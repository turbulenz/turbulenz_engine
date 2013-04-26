.. _networkdevice:

.. highlight:: javascript

.. index::
    single: NetworkDevice

------------------------
The NetworkDevice Object
------------------------

Provides networking support.

Constructor
===========

A NetworkDevice object can be constructed with :ref:`TurbulenzEngine.createNetworkDevice <tz_createnetworkdevice>`.

Methods
=======


.. index::
    pair: NetworkDevice; createWebSocket

.. _networkdevice_createwebsocket:

`createWebSocket`
-----------------

**Summary**

Creates a :ref:`WebSocket <websocket>` object that follows the `browser standard <http://dev.w3.org/html5/websockets/>`_.

**Syntax** ::

    var websocket = networkDevice.createWebSocket("ws://isr2.mine.nu/echo");

    websocket.onopen = function connectionOpened() {
        websocket.send("Hello World!");
    };

    websocket.onerror = function connectionError() {
        window.alert("Connection broken!");
        websocket.onopen = null;
        websocket.onerror = null;
        websocket.onclose = null;
        websocket.onmessage = null;
        websocket = null;
    };

    websocket.onmessage = function messageReceived(message) {
        window.alert("Message from server: " + message.data);
    };

    websocket.onclose = function connectionOpened() {
        window.alert("Connection closed!");
        websocket.onopen = null;
        websocket.onerror = null;
        websocket.onclose = null;
        websocket.onmessage = null;
        websocket = null;
    };

Returns a :ref:`WebSocket <websocket>` object.


.. index::
    pair: NetworkDevice; update

.. _networkdevice_update:

`update`
--------

**Summary**

Polls the state of all created WebSockets and calls the relevant callbacks: `onopen`, `onmessage`, `onerror`, `onclose`.

No messages will ever be received if this method is not called.

.. note:: This method should be called frequently to avoid network timeouts, for example once per rendering frame.

**Syntax** ::

    function renderFrame()
    {
        networkDevice.update();
    }

    TurbulenzEngine.setInterval(renderFrame, (1000 / 60));
