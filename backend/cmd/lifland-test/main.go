package main

import (
	"flag"
	"time"

	"github.com/gramework/gramework"
	"github.com/gramework/gramework/apiClient"
)

var (
	dir  = flag.String("dir", "./frontend/dist", "directory to serve")
	conf = flag.String("conf", "./config.json", "path to config file (json)")
)

func main() {
	flag.Parse()
	app := gramework.New()
	c := readConfig(app)

	btcUSD := apiClient.New(apiClient.Config{
		Addresses: []string{
			"https://api.cryptonator.com/api/full/btc-usd",
		},
		WatcherTickTime: 5 * time.Second,
	})

	app.NotFound(handler)
	app.GET("/subscribe", btcUSD.WSHandler())

	app.Logger.Infof("Serving %s on %s\n", *dir, c.Addr)
	app.ListenAndServe(c.Addr)
}
