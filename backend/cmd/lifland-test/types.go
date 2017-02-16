package main

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
