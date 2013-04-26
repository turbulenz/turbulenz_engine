.. highlight:: javascript

.. index::
    single: TurbulenzLoader

.. _turbulenzloader:

=============================
 The Turbulenz Loader Object
=============================

.. note::

    The information in this section relates to engine startup and
    loading of game and engine code.  The API here is only available
    on the engine plugin, and can only be called by code running in
    the browser.  In general, developers are not expected to deal with
    this API, but a description is included here for completeness.

    The Turbulenz build tools will generate correct HTML and
    JavaScript code required to begin execution of the game during
    development.  Equivalently, the Turbulenz sites (hub and
    turbulenz.com) include all the relevant code on their pages.

At plugin instantiation (through the HTML `object` tag), attributes
can be added to the DOM element representing the plugin.  Some of
these attributes will control the startup behavior of the plugin.

.. _turbulenzloader_examplehtml:

For example, the following HTML code instantiates the plugin with the
`tz_onready` attribute set (see description below), causing a callback
to happen at the end of plugin initialization ::

  <object id="test_loader_object" type="application/vnd.turbulenz"
          width="100%" height="100%" tz_onready="window.someobj.onreadycall" >
    <p>You need the Turbulenz Engine for this.<\/p>
  <\/object>

For Internet Explorer ::

  <object id="test_loader_object"
          classid="CLSID:49AE29B1-3E7D-4f62-B3D2-D6F7C7BEE728"
          width="100%" height="100%">
    <param name="type" value="application/vnd.turbulenz" \/>
    <param name="tz_onready" value="window.someobj.onreadycall" \/>
    <p>You need the Turbulenz Engine for this.<\/p>
  <\/object>


Properties
==========

`version`
---------

**Summary**

A four-part version number representing the version of the engine
loader.

`tz_onready`
------------

**Summary**

Only used when set as a property of the DOM element that represents
the plugin.  This is the global name of a function object in the page
that should be called at startup.

**Syntax**

:ref:`The code above <turbulenzloader_examplehtml>` shows an example
of HTML that sets `tz_onready` to points to
`window.someobj.onreadycall`.  The corresponding callback could be
defined in the HTML page as follows ::

  <script type="text/javascript" >
    window.someobj = {
      onreadycall: function(version_list)
      {
        // version_list is any array of engine version strings,
        // as returned by getAvailableEngines

      }
    };
  </script>


Methods
=======

`getAvailableEngines`
---------------------

**Summary**

Returns an Array of version strings representing the available
versions.

**Syntax**

Takes an optional argument which is a *hint* version string.  If
given, this function *may* use the hint to restrict the returned list
to versions compatible with the hint version.  The caller should
**NOT** rely on this behavior however, and should do its own checking
of the available versions before invoking loadEngine. ::

    var reqVersion = "1.2";
    var versionList = TurbulenzLoader.getAvailableEngines(reqVersion);

    for (var verIdx = 0; verIdx < versionList.length; verIdx += 1)
    {
        var version = versionList[verIdx];

        // Do appropriate checking here ...
    }

.. _turbulenzloader_loadengine:

`loadEngine`
------------

**Summary**

Creates an instance of the Turbulenz engine, loading and executing
code from the location specified by the parameters.

**Syntax**

The `loadEngine` method takes a configuration object as a single
parameter and (potentially asynchronously) loads and executes game
code in the appropriate manner.  The return value of this function
is a boolean representing success of engine creation (true means
success). ::

    var loaderConfig = {
            version:  'x.y',
            progress: progressCB,
            run:      runCB
        };
    if (!TurbulenzLoader.loadEngine(loaderConfig)) {
        window.alert("Failed to load TurbulenzEngine");
    }

or ::

    var loaderConfig = {
            version:  'x.y',
            progress: progressCB,
            url:      'my_game.tzo',
        };
    if (!TurbulenzLoader.loadEngine(loaderConfig)) {
        window.alert("Failed to load TurbulenzEngine");
    }

It is important to note, that the return value may be no indication of
the success of any asynchronous operations scheduled, or any game code
that may have executed before this function returns.

There are two modes of execution available: *debug* and *release*.
The mode used depends on which properties are specified in
the configuration object.

*Debug* mode refers to unencrypted and usually uncompacted code
that is embedded directly in the page (usually used only for debugging
during development).  In *release* mode, the loader downloads game
code in the form of a .tzjs or .tzo file, performs all security checks
and then executes the game code.

The configuration properties understood by this method are:

``version`` *(optional)*

    The version of the engine targeted by the code to be run.  This
    should be specified as a string formatted as two or three integers
    separated by decimal points.  This is currently ignored, and is
    not required.  In the future, it is only likely to be meaningful
    in *debug* mode.

``progress`` *(optional)*

    A callback that the html page can use to track the progress of
    engine startup.  Periodically called with an integer between 0 and
    100, representing the percentage completion of startup.  If a
    callback is given and the engine starts successfully, this
    function will be called at least once with a value of `100`.

    Non-integer values passed to this function represent an error
    during engine loading.

``run`` *(debug mode only)*

    This parameter is the callback to be made when the engine has
    loaded and is ready for execution.  The callback receives a single
    parameter which is an instance of the :ref:`TurbulenzEngine object
    <turbulenzengine>`.  Turbulenz startup code uses this to setup the
    :ref:`TurbulenzEngine object <turbulenzengine>` global variable
    and to call the ``TurbulenzEngine.onload`` entry point.  Cannot be
    used in conjuction with `url`.

``url`` *(release mode only)*

    The location of the .tzo or .tzjs file to load and execute.  Once
    the code is ready for execution, the loader handles setting up of
    a :ref:`TurbulenzEngine object <turbulenzengine>` global and
    executes the game code.  Cannot be used in conjuction with `run`.

**As indicated above, it is an error to specify both** `run` **and**
`url` **properties on loader configuration objects.**

.. _turbulenzloader_unloadengine:

`unloadEngine`
--------------

**Summary**

Shutdown any existing engine instance that has been created by this
loader.  It is safe to call this even if no engine has been loaded or
no application is running.  This will trigger a call to
``Turbulenz.onunload`` if that callback has been set by application
code.

The expected use of this is to inform the game when the engine is
about to be unloaded because the user is terminating the game or
navigating away from the page ::

    window.onbeforeunload = function ()
    {
        loader.unloadEngine();
    }

``unloadEngine`` is necessarily synchronous and when it returns, the
Turbulenz engine will be completely shutdown.  Therefore it is an
error to call this function from code in the page that has been
invoked directly by the application.
