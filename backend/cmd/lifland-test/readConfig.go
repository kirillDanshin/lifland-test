package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/gramework/gramework"
	"github.com/kirillDanshin/myutils"
)

func readConfig(app *gramework.App) *Config {
	confFile, err := os.Open(*conf)
	if err != nil {
		app.Logger.Fatalf("can't read config: %s", err)
	}

	confReader := bufio.NewReader(confFile)

	dec := json.NewDecoder(confReader)
	var c Config
	if err := dec.Decode(&c); err != nil && err != io.EOF {
		app.Logger.Fatalf("can't decode config: %s", err)
	}

	confFile.Close()

	host := c.Host
	port := fmt.Sprintf("%v", c.Port)
	var addr string
	if port == "" {
		port = "80"
	}
	addr = myutils.Concat(host, ":", port)

	c.Addr = addr

	return &c
}
