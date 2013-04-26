.. index::
    single: WebSocket

.. highlight:: javascript

.. _websocket:

--------------------
The WebSocket Object
--------------------

A WebSocket object that follows the browser standard. For detailed information about the API please read the
`WebSocket specification <http://dev.w3.org/html5/websockets/>`_.

Constructor
===========

A WebSocket object can be constructed with :ref:`NetworkDevice.createWebSocket <networkdevice_createwebsocket>`.

Methods
=======

.. index::
    pair: WebSocket; send

`send`
------

**Summary**

Sends a text message.

**Syntax** ::

    var message = "Hello World!";
    websocket.send(message);

``message``
    The message string to be send.
    You can serialize JavaScript objects to strings by using `JSON.stringify`.

.. index::
    pair: WebSocket; close

`close`
-------

**Summary**

Closes the connection and prepares the WebSocket to be released.

**Syntax** ::

    websocket.close();


.. index::
    pair: WebSocket; destroy

`destroy`
---------

**Summary**

Releases the WebSocket resources; the object will be invalid after the method is called.

**Syntax** ::

    websocket.destroy();


Properties
==========

.. index::
    pair: WebSocket; readyState

`readyState`
------------

**Summary**

The state of the WebSocket connection. All the possible values are properties on the WebSocket object:

* CONNECTING
* OPEN
* CLOSING
* CLOSED

**Syntax** ::

    if (websocket.readyState === websocket.OPEN)
    {
        // Connection is ready for sending data
    }
    else if (websocket.readyState === websocket.CLOSED)
    {
        // Connection was closed
    }

.. note:: Read Only


.. index::
    pair: WebSocket; onopen

`onopen`
--------

**Summary**

The callback that will be executed when the connection is established successfully.

**Syntax** ::

    websocket.onopen = function connectionOpened() {
        websocket.send("Hello World!");
    };


.. index::
    pair: WebSocket; onmessage

`onmessage`
-----------

**Summary**

The callback that will be executed when a new message arrives.

**Syntax** ::

    websocket.onmessage = function messageReceived(message) {
        window.alert("Message from server: " + message.data);
    };


.. index::
    pair: WebSocket; onerror

`onerror`
---------

**Summary**

The callback that will be executed when the connection breaks.

**Syntax** ::

    websocket.onerror = function connectionError() {
        window.alert("Connection broken!");
        websocket.onopen = null;
        websocket.onerror = null;
        websocket.onclose = null;
        websocket.onmessage = null;
        websocket = null;
    };


.. index::
    pair: WebSocket; onclose

`onclose`
---------

**Summary**

The callback that will be executed when the connection is closed.

**Syntax** ::

    websocket.onclose = function connectionOpened() {
        window.alert("Connection closed!");
        websocket.onopen = null;
        websocket.onerror = null;
        websocket.onclose = null;
        websocket.onmessage = null;
        websocket = null;
    };
