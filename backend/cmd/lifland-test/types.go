package main

import (
	"sync"

	"github.com/gramework/gramework/apiClient"
)

// Config describes server configuration parameters
type Config struct {
	// Host can be ommitted
	Host string
	// Port should not contain `:`.
	// By default it set to 80.
	Port int
	// Used in readConfig. should not be Used
	// with host and port set or will be overwritten
	Addr string
}

// APIResponse describes response of the tick server
type APIResponse struct {
	Error   string `json:"error"`
	Success bool   `json:"success"`
	Ticker  struct {
		Base    string   `json:"base"`
		Change  string   `json:"change"`
		Markets []Market `json:"markets"`
		Price   string   `json:"price"`
		Target  string   `json:"target"`
		Volume  string   `json:"volume"`
	} `json:"ticker"`
	Timestamp int64 `json:"timestamp"`
}

// Market from the APIResponse
type Market struct {
	Market string  `json:"market"`
	Price  string  `json:"price"`
	Volume float64 `json:"volume"`
}

// Ticker handles tick subscribers
// and subscription model
type Ticker struct {
	Response    Response
	resMu       sync.Mutex
	subMu       sync.RWMutex
	subscribers map[int]func()
	apiClients  map[string]*apiClient.Instance
}

// Response is our connection
// response. It handles two timestamps:
// source timestamp and our timestamp.
// Source timestamp is a timestamp when
// source has updated its own data.
type Response struct {
	Pairs           map[string]*Pair
	Timestamp       int64
	SourceTimestamp int64
	mu              sync.Mutex
}

// Pair info for the Response.
// See SourceTimestamp description there.
type Pair struct {
	Market          string
	Price           string
	SourceTimestamp int64
	Error           string `json:",omitempty"`
}
