// Copyright (c) 2011-2012 Turbulenz Limited

/// <reference path="../base.d.ts" />
/// <reference path="../turbulenz.d.ts" />

"use strict";

//
// WebGLNetworkDevice
//
class WebGLNetworkDevice implements NetworkDevice
{
    static version = 1;

    WebSocketConstructor: any;  // prototype

    createWebSocket(url:string, protocol?: string): WebSocket
    {
        var WebSocketConstructor = this.WebSocketConstructor;
        if (WebSocketConstructor)
        {
            var ws : WebSocket;
            if (protocol)
            {
                ws = new WebSocketConstructor(url, protocol);
            }
            else
            {
                ws = new WebSocketConstructor(url);
            }
            if (typeof ws.destroy === "undefined")
            {
                ws.destroy = function websocketDestroyFn()
                {
                    this.onopen = null;
                    this.onerror = null;
                    this.onclose = null;
                    this.onmessage = null;
                    this.close();
                };
            }
            return ws;
        }
        else
        {
            return <WebSocket>null;
        }
    }

    update()
    {
    }

    static create(params: any): WebGLNetworkDevice
    {
        var nd = new WebGLNetworkDevice();
        return nd;
    }
}

WebGLNetworkDevice.prototype.WebSocketConstructor =
    (window.WebSocket ? window.WebSocket : window.MozWebSocket);
