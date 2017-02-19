package main

import (
	"errors"
	"fmt"

	"github.com/gramework/gramework/apiClient"
)

// NewTicker initializes a Ticker with given pairs
func NewTicker(pairs ...string) (*Ticker, error) {
	if len(pairs) == 0 {
		return nil, errors.New("no pairs provided")
	}

	clients := make(map[string]*apiClient.Instance)

	for k := range pairs {
		clients[pairs[k]] = apiClient.New(apiClient.Config{
			Addresses: []string{
				fmt.Sprintf("https://api.cryptonator.com/api/full/%s", pairs[k]),
			},
		})
	}

	return &Ticker{
		apiClients: clients,
	}, nil
}
