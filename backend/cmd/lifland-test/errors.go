package main

import "errors"

var (
	// ErrCantGetStatus occurred when API answers with invalid status code
	ErrCantGetStatus = errors.New("can't get status from the API")
)
