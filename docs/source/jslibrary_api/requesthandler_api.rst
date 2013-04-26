.. index::
    single: RequestHandler

.. highlight:: javascript

.. _requesthandler:

-------------------------
The RequestHandler Object
-------------------------

The ``RequestHandler`` object handles HTTP requests and captures events such as a lost connection as well as repeating failed requests.
This makes requests easier to make as you no longer have to support the connection loss or service busy response codes.

The ``RequestHandler`` catches the following HTTP response codes:

- 0 - The connection has been lost, the request timed out or a cross domain request has been made.
- 408 Request time-out - The client did not produce a request within the time that the server was prepared to wait.
- 429 Too Many Requests - The service is overloaded or unable to respond correctly.
- 480 Temporarily unavailable - The service is overloaded or unable to respond correctly.

It also catches any ``XMLHttpRequest`` responses with a ``Retry-After`` header.
When a request fails like this the ``RequestHandler`` does the following:

- Queues up any other failed requests.
- Repeats the failed request with an exponential timeout (or the specified ``Retry-After`` value).
- If the failed request now succeeds then the queued up requests are repeated and all the ``onload`` callbacks are called.
- If the failed request continues to fail after a set period the ``RequestHandler`` calls its ``onRequestTimeout`` callback.
  The failed request is still being repeated with an exponential timeout.
- If sometime after this the failed request succeeds then the ``RequestHandler`` calls its ``onReconnected`` callback.
  Then the queued up requests are made and all the ``onload`` callbacks are called.

The ``RequestHandler`` provides means for event handlers to be added for different event types.
Event handlers are added and removed using :ref:`addEventListener<requesthandler-addeventlistener>` and :ref:`removeEventListener<requesthandler-removeeventlistener>`.
Multiple event listeners may be added for each event type.

**Required scripts**

The ``RequestHandler`` object requires::

    /*{{ javascript("jslib/observer.js") }}*/
    /*{{ javascript("jslib/requesthandler.js") }}*/

Examples
========

**TurbulenzEngine.request** ::

    // TurbulenzEngine.request(src, onload) becomes:

    requestHandler.request({
        src: src,
        onload: onload
    });

**GraphicsDevice.createTexture** ::

    // graphicsDevice.createTexture({
    //     src     : src,
    //     mipmaps : true,
    //     onload  : onload
    // });
    // becomes:

    var textureRequest = function textureRequestFn(src, onload, callContext)
    {
        var texture = graphicsDevice.createTexture({
            src     : src,
            mipmaps : callContext.userData.mipmaps,
            onload  : onload
        });
        if (!texture)
        {
            errorCallback("Texture '" + callContext.src + "' not created.");
        }
    };

    requestHandler.request({
        src: src,
        userData:
        {
            mipmaps : mipmaps
        },
        requestFn: textureRequest,
        onload: onload
    });

Alternatively, you can use the :ref:`TextureManager <texturemanager>`.
The :ref:`SoundManager <soundmanager>` and :ref:`FontManager <fontmanager>` also use a ``RequestHandler`` object to make requests.

Constructor
===========

.. index::
    pair: RequestHandler; create

`create`
--------

**Summary**

Creates a `RequestHandler` object.

**Syntax** ::

    var requestHandler = RequestHandler.create({
        initialRetryTime: 500,
        notifyTime: 4000,
        maxRetryTime: 8000,
        onReconnected: function onReconnectedFn(reason, requestCallContext)
        {
            console.log('Reconnected');
        },
        onRequestTimeout: function onRequestTimeoutFn(reason, requestCallContext)
        {
            console.log('Connection lost');
        }
    });

See the :ref:`properties <requesthandler_properties>` section for information on these parameters.

Methods
=======

.. index::
    pair: RequestHandler; request

`request`
---------

**Summary**

Makes a HTTP request.
For more information on this function see the :ref:`RequestHandler introduction <requesthandler>` section.

**Syntax** ::

    var callContext = {
        src: 'textures/duck.png',
        requestOwner: ownerObject,
        requestFn: function requestFn(src, onResponse, callContext) {},
        onload: function onloadFn(response, status, callContext) {},
        userData: {}
    };

    requestHandler.request(callContext);

    // for example:

    var loadedTextures = {};
    var techniqueParameters;

    var callContext = {
        src: 'textures/duck.png',
        requestFn: function requestFn(src, onResponse, callContext) {
            var userData = callContext.userData;
            if (!graphicsDevice.createTexture({
                src: src,
                onload: onResponse,
                mipmaps: userData.mipmaps
            }))
            {
                errorCallback('Unable to create texture for URL: ' + src);
            }
        },
        onload: function onloadFn(texture, status, callContext) {
            if (status === 200 && texture)
            {
                loadedTextures[callContext.src] = texture;
            }
        },
        userData: {
            mipmaps: true
        }
    };

    requestHandler.request(callContext);

``src``
    A JavaScript string.
    The request URL.

``requestOwner`` (Optional)
    A JavaScript function or object with a ``request`` function property.
    If ``requestFn`` is undefined then ``requestOwner.request`` is used as the request function.

``requestFn`` (Optional)
    A JavaScript function.
    This function makes the request.
    The ``RequestHandler`` calls this function to repeat requests.
    It must call ``onResponse`` with the response and the status code of the request.
    If ``requestFn`` and ``requestOwner`` are undefined then :ref:`TurbulenzEngine.request <turbulenzengine_request>` is used.

``onload``
    A JavaScript function.
    Called once the request has been successfully made.

``userData``
    The developer can put anything they want on to this property.
    The ``requestFn`` and ``onload`` callbacks are called with the ``callContext`` parameter.

.. _requesthandler-addEventListener:

`addEventListener`
------------------

**Summary**

Adds an event listener for the specified event. Multiple event listeners may be added for each event type. Adding the
same event listener twice has no effect - the event listener will still only be called once per event.

**Syntax** ::

    var eventType = 'eventOnLoad';
    var eventListener = function eventOnLoad(event)
    {
	...
	...
    }

    requestHandler.addEventListener(eventType, eventListener);


``eventType``
    A valid :ref:`event type <requesthandler-eventypes>` string.

``eventListener``
    Callback associated with events of eventType.

.. _requesthandler-removeeventlistener:


`removeEventListener`
---------------------

**Summary**

Removes an event listener for the specified event. If the event listener supplied was never added using
:ref:`addEventListener <requesthandler-addeventlistener>`, this has no effect.

**Syntax** ::

    requestHandler.removeEventListener(eventType, eventListener);


``eventType``
    A valid :ref:`event type <requesthandler-eventypes>` string.

``eventListener``
    Callback associated with events of eventType.


.. _requesthandler-destroy:

`destroy`
---------

**Summary**

Destroys the object. Callbacks for any outstanding requests are not called.
This will usually be called from the application's destroy function callback,
set using :ref:`TurbulenzEngine.onunload <turbulenzengine_onunload>`,
to prevent the callbacks accessing invalid state.

**Syntax** ::

    requestHandler.destroy();

.. _requesthandler_properties:

Properties
==========

`initialRetryTime`
------------------

**Summary**

A JavaScript number.
Initial time in milliseconds to wait before retrying a request.
Defaults to ``500``.

**Syntax** ::

    var initialRetryTime = requestHandler.initialRetryTime;

`notifyTime`
------------

**Summary**

A JavaScript number.
Time in milliseconds to wait before calling :ref:`onRequestTimeout <requesthandler_onrequesttimeout>` with the ``callContext`` of the asset that failed.
Defaults to ``4000``.

**Syntax** ::

    var notifyTime = requestHandler.notifyTime;

`maxRetryTime`
--------------

**Summary**

A JavaScript number.
Maximum time in milliseconds to wait before retrying a request.
Defaults to ``8000``.

**Syntax** ::

    var maxRetryTime = requestHandler.maxRetryTime;

.. _requesthandler_onreconnected:

`onReconnected`
---------------

**Summary**

A JavaScript function.
Called if :ref:`onRequestTimeout <requesthandler_onrequesttimeout>` has been called and
the connection has been regained or the service is back online allowing the request to succeed.

**Syntax** ::

    requestHandler.onReconnected = function onReconnectedFn(reason, requestCallContext)
    {
        failedAsset = null;
        if (reason === this.reasonConnectionLost)
        {
            // switch off a connection lost message
            ...
        }
        else if (reason === this.reasonServiceBusy)
        {
            // switch off a service busy message
            ...
        }
    };

``reason``
    A JavaScript number.
    The :ref:`reason code <requesthandler_reasons>` for the original failure.

``requestCallContext``
    The ``callContext`` of the requestHandler.request call that caused the timeout.
    The ``callContext`` now contains the following additional properties:

* ``status`` - The returned status response of the last request.
* ``retries`` - The number of times the ``RequestHandler`` has retried the request.

.. _requesthandler_onrequesttimeout:

`onRequestTimeout`
------------------

**Summary**

A JavaScript function.
Called when a request fails because of a lost internet connection or a disconnected or overloaded server.

**Syntax** ::

    requestHandler.onRequestTimeout = function onRequestTimeoutFn(reason, requestCallContext)
    {
        failedAsset = requestCallContext;
        if (reason === this.reasonConnectionLost)
        {
            // switch on a connection lost message
            log('After ' + requestCallContext.retries + ' retries the ' + requestCallContext.src + ' asset failed with code ' + requestCallContext.status);
            ...
        }
        else if (reason === this.reasonServiceBusy)
        {
            // switch on a service busy message
            ...
        }
    };

``reason``
    A JavaScript number.
    The :ref:`reason code <requesthandler_reasons>` for the failure.

``requestCallContext``
    The ``callContext`` of the requestHandler.request call that caused the timeout.
    The ``callContext`` now contains the following additional properties:

* ``status`` - The returned status response of the last request.
* ``retries`` - The number of times the ``RequestHandler`` has retried the request.

.. note::
  The first set of assets to load should be the assets required to display a connection lost message.
  This means that if a connection is lost at any time the message can be displayed.

.. _requesthandler_reasons:

`reasonConnectionLost`
----------------------

**Summary**

A JavaScript number.
A reason code given as an argument for the :ref:`onReconnected <requesthandler_onreconnected>` and :ref:`onRequestTimeout <requesthandler_onrequesttimeout>` functions.

**Syntax** ::

    var reasonConnectionLost = requestHandler.reasonConnectionLost;

`reasonServiceBusy`
-------------------

**Summary**

A JavaScript number.
A reason code given as an argument for the :ref:`onReconnected <requesthandler_onreconnected>` and :ref:`onRequestTimeout <requesthandler_onrequesttimeout>` functions.

**Syntax** ::

    var reasonServiceBusy = requestHandler.reasonServiceBusy;

.. _requesthandler-eventypes:

Event Types
===========

Event listeners can be added for the following event types:

* :ref:`eventOnLoad <requesthandler-eventOnLoad>`

.. _requesthandler-eventOnLoad:

`eventOnLoad`
-------------

**Summary**

Occurs when an asset is loaded.

**Syntax** ::

    var eventType = 'eventOnLoad';

    var eventListener = function eventOnLoad(event)
    {
	    ...
	    ...
    }

    requestHandler.addEventListener(eventType, eventListener);

**Event Listener Arguments**

``event``
    An object with the following fields
        ``name``
            The name of the asset just loaded.

        ``eventType``
            The event that triggered this callback.
