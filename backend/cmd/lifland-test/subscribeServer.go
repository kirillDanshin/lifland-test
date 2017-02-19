package main

import (
	"errors"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"github.com/fasthttp-contrib/websocket"
	"github.com/gramework/gramework"
	"github.com/gramework/gramework/apiClient"
)

var (
	lastCheckResult = atomic.Value{}
	lcrMu           sync.RWMutex
)

func subscribeServer(t *Ticker) func(*gramework.Context) {
	return func(ctx *gramework.Context) {
		if websocket.IsWebSocketUpgrade(ctx.RequestCtx) {
			websocket.Upgrade(ctx.RequestCtx, func(conn *websocket.Conn) {
				var subscriberID int
				var resMu sync.Mutex
				sendResult := func() {
					resMu.Lock()
					defer resMu.Unlock()
					b, err := ctx.ToJSON(lastCheckResult.Load().(Response))
					if err != nil {
						ctx.Logger.Error("can't serialize API response")
						return
					}
					err = conn.WriteMessage(websocket.TextMessage, b)
					if err != nil {
						conn.Close()
						t.Unsubscribe(subscriberID)
					}
				}
				subscriberID = t.Subscribe(sendResult)
				sendResult()
				for range time.Tick(5 * time.Second) {
					if !t.Subscribed(subscriberID) {
						break
					}
				}
			}, 0, 0)
			return
		}
		ctx.JSON(lastCheckResult.Load().(APIResponse))
	}
}

func (t *Ticker) notify() {
	t.subMu.Lock()
	for k := range t.subscribers {
		go func(subID int) {
			t.subscribers[subID]()
		}(k)
	}
	t.subMu.Unlock()
}

// Updater is a goroutine that watches API changes
func (t *Ticker) Updater() {
	var r Response
	for range time.Tick(1 * time.Second) {
		r = lastCheckResult.Load().(Response)
		t.Update()
		if r.SourceTimestamp != t.Response.SourceTimestamp {
			t.notify()
		}
	}
}

// Update updates the ticker state
func (t *Ticker) Update() {
	result := Response{
		Pairs: make(map[string]*Pair),
	}

	wg := sync.WaitGroup{}

	for pairID := range t.apiClients {
		wg.Add(1)
		go func(pID string) {
			pair, err := t.loadPair(t.apiClients[pID])
			if err != nil {
				pair.Error = err.Error()
			}
			result.mu.Lock()
			result.Pairs[pID] = pair
			if result.SourceTimestamp == 0 {
				result.SourceTimestamp = result.Pairs[pID].SourceTimestamp
			}
			result.mu.Unlock()
			wg.Done()
		}(pairID)
	}
	wg.Wait()

	result.Timestamp = time.Now().Unix()
	t.resMu.Lock()
	t.Response = result
	t.resMu.Unlock()

	lastCheckResult.Store(t.Response)
}

func (t *Ticker) loadPair(api *apiClient.Instance) (*Pair, error) {
	resp, err := t.loadAPIResponse(api)
	if err != nil {
		return nil, err
	}

	idx, err := findMaxFloat(len(resp.Ticker.Markets), func(index int) float64 {
		value, err := strconv.ParseFloat(resp.Ticker.Markets[index].Price, 64)
		if err != nil {
			return -1.0
		}
		return value
	})
	if err != nil {
		return nil, err
	}
	return &Pair{
		Price:           resp.Ticker.Markets[idx].Price,
		Market:          resp.Ticker.Markets[idx].Market,
		SourceTimestamp: resp.Timestamp,
	}, nil
}

func (t *Ticker) loadAPIResponse(api *apiClient.Instance) (*APIResponse, error) {
	var resp APIResponse
	status, err := api.GetJSON(&resp)
	if err != nil {
		return nil, err
	}
	if status != 200 {
		return nil, ErrCantGetStatus
	}
	return &resp, nil
}

func findMaxFloat(sliceLen int, getter func(int) float64) (int, error) {
	if sliceLen == 0 {
		return 0, errors.New("empty slice")
	}

	var maxIdx int
	var maxVal float64
	for i := 0; i < sliceLen; i++ {
		if v := getter(i); v > maxVal {
			maxIdx = i
			maxVal = v
		}
	}
	return maxIdx, nil
}
