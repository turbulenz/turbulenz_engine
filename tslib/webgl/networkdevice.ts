// Copyright (c) 2011-2012 Turbulenz Limited
/*global window*/
"use strict";

/// <reference path="../turbulenz.d.ts" />

//
// WebGLNetworkDevice
//
interface WebGLNetworkDevice extends NetworkDevice
{

};

declare var WebGLNetworkDevice :
{
    new(): WebGLNetworkDevice;
    prototype: any;
    create(): WebGLNetworkDevice;
};

function WebGLNetworkDevice() { return this; }
WebGLNetworkDevice.prototype = {

    version : 1,

    WebSocketConstructor : (window.WebSocket ? window.WebSocket : window.MozWebSocket),

    createWebSocket : function createWebSocketdFn(url, protocol)
    {
        var WebSocketConstructor = this.WebSocketConstructor;
        if (WebSocketConstructor)
        {
            var ws;
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
            return null;
        }
    },

    update : function networkDeviceUpdateFn()
    {
    }
};

WebGLNetworkDevice.create = function networkDeviceCreateFn(/* params */)
{
    var nd = new WebGLNetworkDevice();
    return nd;
};
