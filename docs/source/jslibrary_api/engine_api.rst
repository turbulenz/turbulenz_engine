.. _turbulenzengine:

.. index::
    single: TurbulenzEngine

.. highlight:: javascript

.. _turbulenzobject:

--------------------------
The TurbulenzEngine Object
--------------------------

This is the main engine object, available to JavaScript as a global
`TurbulenzEngine`.  All other parts of the Turbulenz native api are
accessed through `TurbulenzEngine`, either via methods on this object
or by device objects that they return.

Note that the space occupied by the engine on the web page will not be
drawn until a GraphicsDevice object is created with
:ref:`tz_creategraphicsdevice`.

Methods
=======

.. index::
    pair: TurbulenzEngine; createGraphicsDevice

.. _tz_creategraphicsdevice:

`createGraphicsDevice`
----------------------

**Summary**

Creates a :ref:`GraphicsDevice <graphicsdevice>`.
Only one graphics device can be created at any time.
If you call this function again it will fail. To get the previously created device call :ref:`tz_getGraphicsDevice`.

**Syntax** ::

    var graphicsDeviceOptions = {
            vsync: false,
            multisample: 1
        };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceOptions);

``vsync``
    Setting this option synchronizes the rendering with the vertical retrace in order to reduce tearing.
    It also limits the maximum frames per second to the frequency of the monitor.
    Defaults to false.

``multisample``
    Enables multisample anti-aliasing.
    The bigger the number the less aliasing but performance could severely affected.
    Any value lower than 2 will effectively disable multisample anti-aliasing.
    Recommended valid values are 1, 2, 4, 8 and 16.
    Defaults to 1.

.. index::
    pair: TurbulenzEngine; getGraphicsDevice

.. _tz_getgraphicsdevice:

`getGraphicsDevice`
-------------------

**Summary**

Returns the current :ref:`GraphicsDevice <graphicsdevice>`.
If you call this function before creating a GraphicsDevice it will return null.

**Syntax** ::

    var graphicsDevice = TurbulenzEngine.getGraphicsDevice();


.. index::
    pair: TurbulenzEngine; createPhysicsDevice

`createPhysicsDevice`
---------------------

**Summary**

Creates a :ref:`PhysicsDevice <physicsdevice>`.
Only one physics device can be created at any time.
If you call this function again it will fail. To get the previously created device call :ref:`tz_getPhysicsDevice`.

**Syntax** ::

    var physicsDevice = TurbulenzEngine.createPhysicsDevice({});

Currently, no parameters are required to create the physics device,
however for consistency with other devices and to allow for parameters
to be added in the future, an empty object must be passed in.

.. index::
    pair: TurbulenzEngine; getPhysicsDevice

.. _tz_getphysicsdevice:

`getPhysicsDevice`
-------------------

**Summary**

Returns the current :ref:`PhysicsDevice <physicsdevice>`.
If you call this function before creating a PhysicsDevice it will return null.

**Syntax** ::

    var physicsDevice = TurbulenzEngine.getPhysicsDevice();

.. index::
    pair: TurbulenzEngine; createSoundDevice

.. _tz_createsounddevice:

`createSoundDevice`
-------------------

**Summary**

Creates a :ref:`SoundDevice <sounddevice>`.
Only one sound device can be created at any time.
If you call this function again it will fail. To get the previously created device call :ref:`tz_getSoundDevice`.

This function can return 'null' if there is no audio device enabled on the host system.

**Syntax** ::

    var soundDeviceOptions = {
            deviceSpecifier: "DirectSound Software",
            linearDistance: true
        };
    var soundDevice = TurbulenzEngine.createSoundDevice(soundDeviceOptions);

    if (soundDevice)
    {
        // ...
    }

``deviceSpecifier``
    Selects a different sound rendering device than the default one.
    Defaults to the default OS device.

``linearDistance``
    Selects a linear distance falloff model instead of using an inverse distance falloff.
    Defaults to true.

All the :ref:`sound device properties <sounddevice_properties>` can also be passed as options.

.. index::
    pair: TurbulenzEngine; getSoundDevice

.. _tz_getsounddevice:

`getSoundDevice`
----------------

**Summary**

Returns the current :ref:`SoundDevice <sounddevice>`.
If you call this function before creating a SoundDevice it will return null.

**Syntax** ::

    var soundDevice = TurbulenzEngine.getSoundDevice();

.. index::
    pair: TurbulenzEngine; createNetworkDevice

.. _tz_createnetworkdevice:

`createNetworkDevice`
---------------------

**Summary**

Creates a :ref:`NetworkDevice <networkdevice>`.
Only one network device can be created at any time.
If you call this function again it will fail. To get the previously created device call :ref:`tz_getNetworkDevice`.

**Syntax** ::

    var networkDeviceOptions = {
        };
    var networkDevice = TurbulenzEngine.createNetworkDevice(networkDeviceOptions);


This device does not have any configuration options at the moment.


.. index::
    pair: TurbulenzEngine; getNetworkDevice

.. _tz_getnetworkdevice:

`getNetworkDevice`
-------------------

**Summary**

Returns the current :ref:`NetworkDevice <networkdevice>`.
If you call this function before creating a NetworkDevice it will return null.

**Syntax** ::

    var networkDevice = TurbulenzEngine.getNetworkDevice();


.. index::
    pair: TurbulenzEngine; createInputDevice

`createInputDevice`
-------------------

**Summary**

Creates an :ref:`InputDevice <inputdevice>`.
Only one input device can be created at any time.
If you call this function again it will fail. To get the previously created device call :ref:`tz_getInputDevice`.

**Syntax** ::

    var inputDeviceOptions = {
        };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceOptions);

This device does not have any configuration options at the moment.

.. index::
    pair: TurbulenzEngine; getInputDevice

.. _tz_getinputdevice:

`getInputDevice`
----------------

**Summary**

Returns the current :ref:`InputDevice <inputdevice>`.
If you call this function before creating a InputDevice it will return null.

**Syntax** ::

    var inputDevice = TurbulenzEngine.getInputDevice();


.. index::
    pair: TurbulenzEngine; createMathDevice

.. _tz_createmathdevice:

`createMathDevice`
------------------

**Summary**

Creates a :ref:`MathDevice <mathdevice>`.
Only one math device can be created at any time.
If you call this function again it will fail. To get the previously created device call :ref:`tz_getMathDevice`.

**Syntax** ::

    var mathDeviceOptions = {
        };
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceOptions);

This device does not have any configuration options at the moment.


.. index::
    pair: TurbulenzEngine; getMathDevice

.. _tz_getmathdevice:

`getMathDevice`
---------------

**Summary**

Returns the current :ref:`MathDevice <mathdevice>`.
If you call this function before creating a MathDevice it will return null.

**Syntax** ::

    var mathDevice = TurbulenzEngine.getMathDevice();

.. index::
    pair: TurbulenzEngine; encrypt

`encrypt`
---------

**Summary**

Compresses, encrypts and returns base 64 encoded the string passed in.
Returns null if not running a TZO file as no key will exist to encrypt with.

**Syntax** ::

    var plainText = "Hello World";
    var encryptedStr = TurbulenzEngine.encrypt(plainText);

``plainText``
    The string to be encrypted.

.. index::
    pair: TurbulenzEngine; decrypt

`decrypt`
----------

**Summary**

Decompresses and decrypts the string passed in.
Returns null if decryption fails.
Returns the string as it was given if not running a TZO file.

**Syntax** ::

    var encryptedStr = "X8woxDiR2nu2YtMQf7LHpzOrUwKJQFZcc";
    var decryptedStr = TurbulenzEngine.decrypt(encryptedStr);

``encryptedStr``
    The string to decrypt.

.. index::
    pair: TurbulenzEngine; generateSignature

`generateSignature`
-------------------

**Summary**

Generates a base 64 encoded SHA-256 HMAC of a given string.
Returns null if not running a TZO file.

**Syntax** ::

    var str = "Hello World";
    var signature = TurbulenzEngine.generateSignature(str);

``str``
    The string to generate a signature of.

.. index::
    pair: TurbulenzEngine; verifySignature

`verifySignature`
------------------

**Summary**

Given a string and an existing signature generates a new signature and checks if the two are equal.
Always returns true if not running a TZO file.

**Syntax** ::

    var originalStr = "Hello World";
    var originalSignature = "xdVw6STqGdSzGi1lFcMeQfiPDINGY+t/3k6K8e/rbkw=";
    var verified = TurbulenzEngine.generateSignature(str);

``originalStr``
    The string the signature was originally generated from.

``originalSignature``
    The signature to compare against.


.. index::
    pair: TurbulenzEngine; request

.. _turbulenzengine_request:

`request`
---------

**Summary**

Requests the resource represented by the URL and when the transmission finishes
the given function is called with the contents of the file as an string.
Returns immediately.

**Syntax** ::

    var onLoadedData = function onLoadedDataFn(responseText, status)
    {
        ...
    };

    var resource = 'data/room_scene.json';
    TurbulenzEngine.request(resource, onLoadedData);

``resource``
    The relative path to the JSON resource to load.

``onLoadedData``
    A JavaScript function.
    The callback function called with the requested resource in a string format.
    For example::

        var onLoadedData = function onLoadedDataFn(responseText, status)
        {
            if (!responseText || status !== 200)
            {
                var obj = JSON.parse(responseText);
            }
            else
            {
                //request failed
            }
        }

    This function is always called asynchronously.

``responseText``
    A JavaScript string.
    The response body of the HTTP request.
    This is ``null`` if the response timed out.

``status``
    A JavaScript number.
    The HTTP response status code.
    For example, status ``200`` is ``OK``.
    See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10 for more information.

Returns ``true`` if the request can be made or ``false`` if parameters are incorrect.

.. note::
    You should manage the response status codes correctly.
    See the :ref:`RequestHandler <requesthandler>` for handling connection and service busy issues.

.. index::
    pair: TurbulenzEngine; setTimeout

.. _tz_settimeout:

`setTimeout`
------------

**Summary**

Calls the given function after the specified delay in milliseconds.
Returns the ID of the timeout.

**Syntax** ::

    var delay = 100;
    var timeoutID = TurbulenzEngine.setTimeout(timeoutFunction, delay);

``timeoutFunction``
    The function to call once the timeout is complete.
    The function is not called with any arguments.

``delay``
    The specified delay in milliseconds.
    If this delay is ``0`` the ``timeoutFunction`` is called as soon as possible.

.. index::
    pair: TurbulenzEngine; setInterval

.. _tz_setinterval:

`setInterval`
-------------

**Summary**

Calls the given function repeatedly, with a fixed time delay between each call to that function.
Returns the ID of the interval.

Note that if the interval function takes a long time to execute, these
callbacks may be skipped to avoid creating a backlog of interval
events that cannot be handled.  It is therefore recommended that the
game measure the actual time between interval callbacks and update
game logic accordingly.

The setTimeout function should be used to repeatedly schedule
callbacks in the case where the game needs to guarantee that interval
events are not skipped.

.. NOTE::

    In canvas mode, if the delay is set to 16.6±1ms (i.e. ~60Hz), the
    interval function may not be called if the game browser tab is not
    active (as it uses `requestAnimationFrame
    <http://www.w3.org/TR/animation-timing/>`_). To ensure that the
    interval function is called even when the game tab is not active
    (e.g. during loading), it is best to set the interval to less than
    60Hz, resetting it back as appropriate.

    Browsers tend to prioritise loading callbacks above timer interval
    callbacks, which often results in long pauses during loading
    animations (progress bars, spinning wheels, etc).  To help avoid
    such pauses, game code should update loading animations from asset
    request callbacks if interval timers have not been called recently
    enough.

**Syntax** ::

    var delay = (1000 / 60);
    var intervalID = TurbulenzEngine.setInterval(intervalFunction, delay);

``intervalFunction``
    The function to call each time the delay is complete.
    The function is not called with any arguments.

``delay``
    The specified delay in milliseconds.

.. index::
    pair: TurbulenzEngine; clearTimeout

`clearTimeout`
--------------

**Summary**

Clears a delay set by :ref:`tz_settimeout`.

**Syntax** ::

    TurbulenzEngine.clearTimeout(intervalID);

``intervalID``
    The intervalID returned by a call to ``TurbulenzEngine.setInterval``.

.. index::
    pair: TurbulenzEngine; clearInterval


`clearInterval`
---------------

**Summary**

Cancels repeated action set up using :ref:`tz_setinterval`.

**Syntax** ::

    TurbulenzEngine.clearInterval(intervalID);

``intervalID``
    The intervalID returned by a call to ``TurbulenzEngine.setInterval``.


.. index::
    pair: TurbulenzEngine; flush

`flush`
-------

**Summary**

Forces the JavaScript virtual machine garbage collector to immediately release as much unused memory as possible.
This method could take an unpredictably long time to return.

**Syntax** ::

    TurbulenzEngine.flush();


.. index::
    pair: TurbulenzEngine; getSystemInfo

.. _turbulenzengine_getSystemInfo:

`getSystemInfo`
---------------

**Summary**

Returns a JavaScript object containing information about the system on
which the engine is running.  The returned object contains the
following properties:

``cpuDescription``
    String description of the systems CPU

``cpuVendor``
    String name of the CPU vendor

``numPhysicalCores``

    Number of physical cores available on the system (note on some
    platforms this may not be accurately obtainable, in which case the
    number of logical cores will be returned).

``numLogicalCores``
    Number of logical cores.

``ramInMegabytes``
    Amount of physical memory, given in MegaBytes.

``frequencyInMegaHZ``
    Frequency of CPU(s), given in MegaHZ.

``architecture``

    String representing the architecture on which the game code is
    running.  Typically this is either 'x86' or 'x86_64'.  Note that
    this may not necessarily be the same as the architecture of the
    browser, or the Operating System.

``osName``
    String name of the Operating System (on MacOSX, this returns the string "Darwin").

``osVersionMajor``
    Major version number of the Operating System.

``osVersionMinor``
    Minor version number of the Operating System.

``osVersionBuild``
    Build number of the Operating System.

``platformProfile``
    A string name corresponding to a very high level description of
    the platform capabilities.  This is one of: `desktop`, `tablet`,
    `smartphone`, based on the capabilities of the device in question
    and should only be used as a very rough guide.

``userLocale``
    The current locale setting for the user.

**Syntax** ::

    var systemInfo = TurbulenzEngine.getSystemInfo();

    var numThreads = systemInfo.numLogicalCores;
    var useLowResAssets = (systemInfo.ramInMegabytes <= 1024);

.. _turbulenzengine_getobjectstats:

`getObjectStats`
----------------

**Summary**

Returns a JavaScript object containing information about the objects active in the JavaScript Engine.
If no information is available, an empty object is returned.
The object contains dictionary entries for each recorded object type by name (e.g. 'ObjectTypeName1') in the following format:

::

    {
        'ObjectTypeName1' :
        {
            totalCount : 23
        },
        'ObjectTypeName2' :
        {
            totalCount : 2
        },

        ...

        'Total' :
        {
            totalCount : 43
        }
    }


Each entry is a JavaScript object containing one or more 'stat' entries from the following item(s):

:totalCount:
    The total number of objects recorded for this type per instance of the Turbulenz engine.

In addition to the object type information, a separate entry 'Total' is also returned, which includes **all recorded values, both identified (already in the list) and unidentified (name not available)**.
This number should include all strings, numbers, identifiers, temporary or otherwise used by the JavaScript Engine during execution.

For example:

::

 ObjectTypeName1 + ObjectTypeName2 + 'Unidentified' = Total

 23 + 2 + X = 43

 X = 18 (Unidentified objects)

.. WARNING::

    The behavior of this function is different for each browser. If run in *development* mode, the 'totalCount' refers to that of the *browser's JavaScript Engine*.
    If run in *plugin* mode in **any** browser, the 'totalCount' refers to that of the *Turbulenz JavaScript Engine*.
    The counts returned should be used as a guide.
    The exact figures are subject to the JavaScript Engine's Garbage Collection method and may not be 100% accurate when calling the function.

.. WARNING::

    The function can take some time to process for a large number of objects, therefore it should only be used for debugging purposes.
    In some browsers, using *TurbulenzEngine.flush()* prior to calling the function may assist in providing up-to-date information.
    This behavior cannot be guaranteed.

**Syntax** ::

    // Expected v3's created
    var v3CreatedCount = 10;

    // Only for DEBUGGING
    TurbulenzEngine.flush();

    if (TurbulenzEngine.getObjectStats)
    {
        // getObjectStats is available for this engine
        var objectStats = TurbulenzEngine.getObjectStats();
        var v3ObjectCount = objectStats['Vector3'];
        if (v3ObjectCount)
        {
            if (v3ObjectCount > v3CreatedCount)
            {
                if (console)
                {
                    console.warn("Vector3 count is higher than expected: " + v3CreatedCount + ", actual: " + v3ObjectCount);
                }
            }
        }
    }

.. _turbulenzengine_enableprofiling:

`enableProfiling`
-----------------

**Summary**

Enables the JavaScript engine profiler.

This utilizes the same technology that the browser development tools use when profiling is enabled to measure all the function calls and costs.
For the native engine version the profiler will start on the next script execution, i.e. the next callback, interval or timeout.
For browser based versions the behavior is varied, either immediately or on the next script execution.

.. WARNING::

    When profiling is enabled the code may run markedly slower.

**Syntax** ::

    var enable = true;
    TurbulenzEngine.enableProfiling(enable);


.. _turbulenzengine_startprofiling:

`startProfiling`
----------------

Start profiling. TurbulenzEngine.enableProfiling should be called before this is called.

**Summary**

    TurbulenzEngine.startProfiling();

.. _turbulenzengine_stopprofiling:

`stopProfiling`
----------------

**Summary**

Stops profiling.

The native engine returns an object that is the root profile node of the profile tree.
The browsers versions Chrome and Safari return the same kind of root profile node while Firefox, with Firebug, and Explorer prints to the console.

Some utilities to help process the data are provided by :ref:`JSProfiling <jsprofiling>`.

**Syntax** ::

    var result = TurbulenzEngine.stopProfiling();

    if (result)
    {
        var array = JSProfiling.createArray(result);
        JSProfiling.sort(result);
        // ...
    }


Each profile node has:

``functionName``
    may be blank for anonymous functions.

``numberOfCalls``

``selfTime``
    in milliseconds.

``totalTime``
    in milliseconds.

``url``
    the source file.

``lineNumber``
    in the source file.

``children``
    an optional array of profile nodes.

.. NOTE::

    The implementation of this is dependent on the underlying JavaScript VM and so the structure of the data may vary with future versions.
    The browser based versions may also vary.


.. index::
    pair: TurbulenzEngine; unload

.. _turbulenzengine_unload:

`unload`
--------

**Summary**

The engine will call its :ref:`TurbulenzEngine.onunload <turbulenzengine_onunload>` function property.
This also stops any asynchronous callbacks from being called as everything should be unloaded by
the :ref:`TurbulenzEngine.onunload <turbulenzengine_onunload>` function.

**Syntax** ::

    TurbulenzEngine.unload();


.. index::
    pair: TurbulenzEngine; isUnloading

.. _turbulenzengine_isunloading:

`isUnloading`
-------------

**Summary**

This returns ``false`` until :ref:`TurbulenzEngine.unload() <turbulenzengine_unload>` has been called then returns ``true``.

**Syntax** ::

    var isUnloading = TurbulenzEngine.isUnloading();

``isUnloading``
    A JavaScript boolean.
    ``false`` until :ref:`TurbulenzEngine.unload() <turbulenzengine_unload>` has been called then returns ``true``.


Properties
==========

.. index::
    pair: TurbulenzEngine; onload

.. _turbulenzengine_onload:

`onload`
--------

**Summary**

A JavaScript function.
This should be set as the entry point to the game which will be
called when the page has loaded and the engine is initialized.

**Syntax** ::

    TurbulenzEngine.onload = function onloadFn()
    {
        var application = Application.create();

        TurbulenzEngine.onunload = function onUnloadFn()
        {
            application.shutdown();
        };

        application.init();
    };

This should not be called by the game. This is a callback
the Turbulenz engine will call when ready.

.. index::
    pair: TurbulenzEngine; onunload

.. _turbulenzengine_onunload:

`onunload`
----------

**Summary**

A JavaScript function.
A callback function that is called when the game is closed by the browser or by our site controls.

**Syntax** ::

    // Destroy callback to run when the game is closed
    var appDestroyCallback = function unloadCallbackFn()
    {
        TurbulenzEngine.clearInterval(intervalID);
        gameSession.destroy();
    };
    TurbulenzEngine.onunload = appDestroyCallback;

This function should not be called directly you should use :ref:`TurbulenzEngine.unload() <turbulenzengine_unload>` instead.

.. index::
    pair: TurbulenzEngine; version

`version`
---------

**Summary**

The engine version string.

**Syntax** ::

    var engineVersion = TurbulenzEngine.version;

.. note:: Read Only

.. index::
    pair: TurbulenzEngine; encryptionEnabled

`encryptionEnabled`
-------------------

**Summary**

Whether the engine currently contains a key that can be used for encryption. Always false in development builds.

**Syntax** ::

    var encryption = TurbulenzEngine.encryptionEnabled;

.. note:: Read Only

.. index::
    pair: TurbulenzEngine; top
    pair: TurbulenzEngine; left
    pair: TurbulenzEngine; width
    pair: TurbulenzEngine; height

`top`, `left`, `width`, `height`
--------------------------------

**Summary**

The position and dimensions in pixels of the HTML element that contains the engine.

**Syntax** ::

    var aspectRatio = (TurbulenzEngine.width / TurbulenzEngine.height);

.. note:: Read Only


.. index::
    pair: TurbulenzEngine; time

.. _turbulenzengine_time:

`time`
------

**Summary**

The time in seconds since the engine was initialized. The precision will be in the sub-millisecond range.

**Syntax** ::

    var startTime = TurbulenzEngine.time;

    doSomething();

    var totalTime = (TurbulenzEngine.time - startTime);


.. index::
    pair: TurbulenzEngine; onerror

.. _turbulenzengine_onerror:

`onerror`
---------

**Summary**

A callback to receive messages from the engine when errors occur
during game execution.  This is intended to catch code problems (such
as bad parameters being passed to a function) and runtime errors (such
as failure to allocate memory).

Note that in canvas mode, error checking is less thorough than in
plugin mode (to reduce the execution overhead).  We recommend that
developers regularly run in plugin mode to catch coding errors.

**Syntax** ::

    function onErrorFn(message)
    {
        globalErrors += 1;
        if (alertErrors)
        {
            alert("ERROR FROM ENGINE: " + message);
        }
    }

    TurbulenzEngine.onerror = onErrorFn;


.. index::
    pair: TurbulenzEngine; onwarning

.. _turbulenzengine_onwarning:

`onwarning`
-----------

**Summary**

A callback to receive messages from the engine when recoverable errors
happen during game execution.  The primary intention of this callback
is to catch programming mistakes and potential problems that might
otherwise not be highlighted until a later stage in the game
execution.

**Syntax** ::

    function onWarningFn(message)
    {
        if (alertWarnings)
        {
            alert("WARNING FROM ENGINE: " + message);
        }
    }

    TurbulenzEngine.onwarning = onWarningFn;

The following code will result in a warning message ::

    var renderTargetParams = {
        colourTexture0 : myRenderTexture0,  // < wrong spelling of 'color'
        colorTexture1  : myRenderTexture1,
        depthBuffer    : myDepthBuffer
    };
    var renderTarget = graphicsDevice.createRenderTarget(renderTargetParams);

`canvas`
--------

**Summary**

Exists only when the engine is running in *canvas* or *canvas-debug*
mode.  Game code can use this to determine which mode it is running
in, but it must not set the value.  It is used internally by the
engine.

In general, game code should not need to make use of this property.
