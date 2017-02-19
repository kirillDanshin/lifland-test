package main

// Subscribe to the updates
func (t *Ticker) Subscribe(f func()) (subID int) {
	t.subMu.Lock()
	if t.subscribers == nil {
		t.subscribers = make(map[int]func())
	}
	subID = len(t.subscribers)
	t.subscribers[subID] = f
	t.subMu.Unlock()
	return subID
}

// Unsubscribe from the updates
func (t *Ticker) Unsubscribe(subID int) {
	t.subMu.Lock()
	if _, ok := t.subscribers[subID]; ok {
		delete(t.subscribers, subID)
	}
	t.subMu.Unlock()
}

// Subscribed checks if subID is in subscribers
func (t *Ticker) Subscribed(subID int) bool {
	t.subMu.RLock()
	defer func() {
		t.subMu.RUnlock()
	}()
	_, ok := t.subscribers[subID]
	return ok
}
