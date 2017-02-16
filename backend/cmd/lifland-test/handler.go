package main

import (
	"strings"

	"github.com/kirillDanshin/myutils"
	"github.com/valyala/fasthttp"
)

func handler(ctx *fasthttp.RequestCtx) {
	reqRoute := slash
	routeArg := string(ctx.RequestURI())
	if routeArg != slash {
		reqRoute = routeArg
	}
	if strings.HasPrefix(reqRoute, static) {
		ctx.SetStatusCode(200)
		fasthttp.ServeFile(ctx, myutils.Concat(*dir, reqRoute))
		return
	}
	if reqRoute == slash {
		ctx.SetStatusCode(200)
		fasthttp.ServeFile(ctx, myutils.Concat(*dir, index))
		return
	}
	ctx.Error(nf, fasthttp.StatusNotFound)
}
