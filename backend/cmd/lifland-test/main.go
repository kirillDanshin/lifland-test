package main

import (
	"flag"
	"log"

	"github.com/gramework/gramework"
)

var (
	dir  = flag.String("dir", "./frontend/dist", "directory to serve")
	conf = flag.String("conf", "./config.json", "path to config file (json)")
)

func main() {
	flag.Parse()
	ticker, err := NewTicker("btc-usd", "btc-eur", "eur-usd")
	if err != nil {
		log.Fatalf("could not initialize the ticker: %s", err)
	}
	ticker.Update()
	go ticker.Updater()

	app := gramework.New()
	c := readConfig(app)

	app.NotFound(handler)
	app.GET("/subscribe", subscribeServer(ticker))

	app.Logger.Infof("Serving %s on %s\n", *dir, c.Addr)
	log.Fatalln(app.ListenAndServe(c.Addr))
}
