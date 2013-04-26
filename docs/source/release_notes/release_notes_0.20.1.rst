--------------------
Turbulenz SDK 0.20.1
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.20.1 is an update for both the Turbulenz Engine
Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

.. NOTE::

    The Turbulenz Engine Installer is now included with the SDK.
    If you intended to develop using this SDK, you will need to install the engine located here: **\*SDKINSTALLDIR\*/engines/0.20.1/**.
    This Turbulenz Engine is a pre-release for developers and is only intended for development with the SDK.
    If you want to access games on https://turbulenz.com, make sure you check https://hub.turbulenz.com/download to ensure you have the latest compatible version.
    In the future, engine version management will be taken care of automatically.

**Windows XP/Vista/7**

    The Turbulenz SDK for Windows is available from https://hub.turbulenz.com as a downloadable a self-extracting installer exe.
    This contains the tools, samples and engine components required to develop Turbulenz applications.

    The following software should be installed before installing the Turbulenz SDK:

    **Essential**

    * Python 2.6.5+ - http://www.python.org/download/releases

    .. NOTE::

        It is possible to use Python 2.7 (Not 3.X) with the tools.
        This feature is currently in beta.
        If you encounter any problems, revert back to using 2.6.

    **Recommended**

    * Microsoft Visual Studio 2008 - Used to compile speed-ups for python environment if available on platform.
    * PDF reader - Required to read documentation in PDF format

    After installing the essential and recommended software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK 0.20.1 for Windows
    3) Run TurbulenzSDK-0.20.1.exe
    4) Follow the instructions

    .. NOTE::

        Performance of any Python modules could potentially be slower if speed-ups cannot be compiled.
        It is recommended that you install Visual Studio **before** installing the Turbulenz SDK, so that the speed-ups can be configured in the environment.
        If you are using a 64bit version of Python you **must** have installed a 64bit version of the Visual Studio compilers.

**Mac OS X 10.6/10.7 (BETA)**

    The Turbulenz SDK for Mac OS X  is now available to developers in beta from https://hub.turbulenz.com as a self-extracting shell script.
    This contains the tools, samples and engine components required to develop Turbulenz applications.

    The following software should be installed before installing the Turbulenz SDK:

    **Essential**

    * Python 2.6.5+ - http://www.python.org/download/releases

    .. NOTE::

        It is possible to use Python 2.7 (Not 3.X) with the tools.
        This feature is currently in beta.
        If you encounter any problems, revert back to using 2.6.

    *Mac OS X 10.6*
        * Xcode 3.2.6+ - This MUST be installed before running the script so that Python can compile certain modules.

        .. NOTE::

            Only the command line development tools are required from Xcode and the iOS SDK is NOT required and can be skipped.
            If compilation tools such as GCC are already available, then the whole of Xcode is not necessary.

    *Mac OS X 10.7*
        * Xcode 4.3.2+
           or
        * Command Line Tools for Xcode (February 2012 or later)

        .. NOTE::

            If you don't already have Xcode installed, Turbulenz recommend the command line tools only, which is the minimum required for Turbulenz development.

    **Recommended**

    * Cg Toolkit - http://developer.nvidia.com/cg-toolkit - Required to compile shaders using the cgfx2json tool.

    After installing the essential and recommended software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK 0.20.1 for Mac
    3) Open a terminal in the same directory as the SDK installer and type:
    4) chmod a+x TurbulenzSDK-0.20.1.run
    5) ./TurbulenzSDK-0.20.1.run
    6) Follow the instructions

Recommendations
===============

As technology and tools are updated, so too will the recommendations for development environment.
Turbulenz aim to recommend versions of various third party tools and services that are the most stable, reliable and representative of the final product for development of your projects.

Web Browser & Debugger
----------------------

The web browser is the focus point for development.
Games developed using Turbulenz are run, debugged and profiled from the web browser.
Although performance of the browsers in release mode is relatively consistent.
The choice for debug mode, depends on the performance of the browser and the tools available for it.
Most JavaScript debuggers are either integrated into the browser or add-ons.
These debuggers allow developers to pause execution, step through code, inspect variables and execute functions via the console.

Supported Development Platforms:
    :Windows: XP/Vista/7
    :Mac: 10.5/10.6/10.7

Turbulenz recommends for debugging in debug mode:

For canvas configurations: **Chrome 17 with Web Inspector (built-in)**

- In canvas 3D (WebGL), Chrome offers the best performance.
- Chrome's web inspector also includes a heap snapshot tool for looking at memory usage.
- Alternative(s)
    :Windows: Firefox 11 with Firebug 1.8.4
    :Mac: Safari 5.0/5.1 with Web Inspector (built-in)

For plugin configurations: **Firefox 3.6.X with Firebug 1.7.3**

- Firefox 3.6 is recommended for performance in debug mode.
  This is due to fact that it runs plugins in-process, making the execution of low level API faster.
  Later versions of Firefox can be configured to run plugins in process too. See :ref:`Running in Process <running_in_process>`.
- Alternative(s)
    :Windows: Firefox 11 with Firebug 1.8.4 can be configured to achieve a similar performance level with in process.
    :Mac: Safari 5.0/5.1 with Web Inspector (built-in)

.. NOTE::

    Performance of plugin configurations in release mode is unaffected by being in or out of process.
    This is true across all supported browsers.


Code Verification
-----------------

Ensuring accurate JavaScript code is written before runtime is an important step when developing with JavaScript.
There are a number of tools that are designed to inspect JavaScript usage and check syntax.
Turbulenz recommends for code verification:

**JSHint**
    * A fork of JSLint adapted to work well with flexible coding guidelines.
    * Version: Latest
    * Url: http://www.jshint.com/about/

**JSLint**
    * The original code quality tool written by JSON creator, Douglas Crockford.
    * Version: 2010-01-04
    * Url: http://www.jslint.com

.. NOTE::

    JSHint & JSLint can be run on JavaScript code in many ways:
        * Directly on the site.
        * From the command line using Node.js
        * From the command line using cscript (Windows script host)(JSHint)
        * Integrated into IDEs and editors (Both are now shipped in Komodo Edit 7.0)

Minimization and Compression
----------------------------

For JavaScript code optimization, a minimization tool is required that combines speed with accurate optimization.
Choosing an appropriate minimizer improves the workflow of developing and ensures that the code will run as expected on the Turbulenz JavaScript engine.
Turbulenz recommends for minimization:

**UglifyJS**

* Version: Latest
* Url: https://github.com/mishoo/UglifyJS

.. NOTE::

    Requires Node.js - http://nodejs.org/#download to be run from the command line.

Editor/IDE
----------

To edit JavaScript code for Turbulenz applications, there are very few restrictions.
The choice of editor should meet your development needs and include the features you require.
Turbulenz recommend using an editor with a minimum of JavaScript syntax highlighting, code verification options and external command execution.
If you are looking for a basic editor to try, Turbulenz recommend:

**Komodo Edit**

* Version: 7.0
* Url: http://www.activestate.com/komodo-edit/downloads
* Includes JSHint & JSLint support.

Change List
===========

New Features
------------

**0.20.0**

* A new :ref:`IndexBufferManager <indexbuffermanager>` object,
  *jslib/indexbuffermanager.js*, has been added to provide management
  and sharing of IndexBuffers across geometries to reduce state
  changes.

* A new ``destroy`` method has been added to low level objects holding
  hardware or OS resources.  This method allows releasing those
  resources immediately instead of waiting for the Garbage Collector
  to do it at any random time in the future.  The objects supporting
  this new feature are: :ref:`IndexBuffer <indexbuffer>`,
  :ref:`RenderBuffer <renderbuffer>`, :ref:`RenderTarget
  <rendertarget>`, :ref:`Shader <shader>`, :ref:`Sound <sound>`,
  :ref:`Source <source>`, :ref:`Texture <texture>`, :ref:`VertexBuffer
  <vertexbuffer>` and :ref:`WebSocket <websocket>`.  Once the
  ``destroy`` method is called the object will be invalid and should
  not be used again for anything.

* A new ``destroy`` method has been added to manager objects holding
  hardware or OS resources.  This method allows releasing those
  resources immediately instead of waiting for the Garbage Collector
  to do it at an undetermined time in the future.  The objects
  supporting this new feature are: :ref:`TextureManager
  <texturemanager>`, :ref:`ShaderManager <shadermanager>` and
  :ref:`SoundManager <soundmanager>`.  Once the ``destroy`` method is
  called the object will be invalid and should not be used again for
  anything.

* SoundDevice has a new method: :ref:`isSupported
  <sounddevice_issupported>`.  It can be used to check the supported
  features and should be used instead of checking extensions directly.

* The Font object has a new method: :ref:`generateTextVertices
  <font_generatetextvertices>`.  It can be used to generate the
  vertices for a given text, useful for custom text drawing or for
  caching of vertex data if the same text should be drawn on the same
  location for multiple frames.

* A tag `tz_engine_2d_div` is available for custom HTML templates that
  only require a 2D canvas context in plugin mode.  In canvas mode,
  this is supported on a wider range of browsers than the 3D context
  created by `tz_engine_div`.

* The `makehtml` tool now creates loading code that checks the runtime
  engine version, displaying an error if it is older than the current
  SDK.  Game code no longer needs to perform this check, and all
  checking code has been removed from the supplied samples and example
  applications.

* A tag `tz_sdk_version` is now available for use in HTML templates.
  It contains the SDK version used to build the template.

* Added :ref:`MathDevice.v3AddScalarMul <mathdevice_v3addscalarmul>` and :ref:`MathDevice.v4AddScalarMul <mathdevice_v4addscalarmul>`.

* Games can now access the player's Turbulenz username - see :ref:`userProfile.username <userprofile_username>`.


Changes
-------

* The loading mechanism for the Turbulenz Engine has changed.

  The function **TurbulenzEngine.run** is no longer available in 0.20.0 onwards.
  To run tzjs/tzo code, refer to the documentation for :ref:`TurbulenzLoader <turbulenzloader>`.

  This affects developers who are **NOT** using Turbulenz templates.
  The *makehtml* template system will automatically add the code to use the TurbulenzLoader.
  To migrate code from 0.19.0, simply rebuild the template.

  *TurbulenzEngine.onload* & *TurbulenzEngine.unonload* must be defined to take advantage of this.

  .. WARNING::

    This change is not compatible with Turbulenz Engines version 0.19.0 or earlier.
    Make sure that anyone testing your game installs the 0.20.0 engine.

* The Turbulenz Engine plugin on Mac OS X is now installed into the
  users plugin directory ::

    ~/Library/Internet Plug-Ins

  instead of the system-wide directory ::

    /Library/Internet Plug-Ins

  Developers installing *older* versions of the engine *after*
  installing this version will need to delete the current version from
  their user plugins directory to avoid conflicts.

* A new :ref:`update <soundDevice_update>` method is now required to
  be called every frame when using the SoundDevice.

* The Turbulenz tools should now be invoked directly, e.g. ::

    makehtml -h

  without the *.py* suffix or *python -m* prefix to invoke them as
  modules.  This unifies tools invocation across Windows and Mac
  platforms.

* The :ref:`Scene <scene>` object now uses internally an
  :ref:`IndexBufferManager <indexbuffermanager>` to manage the
  creation and sharing of IndexBuffers, the file
  *jslib/indexbuffermanager.js* is now a requirement when using a
  Scene.

* Display resolution is no longer changed when switching to
  fullscreen, and `getSupportedDisplayModes()`, `fullscreenWidth` and
  `fullscreenHeight` have been removed from the `GraphicsDevice`
  interface.  The `desktopWidth` and `desktopHeight` properties
  remain, but their values may not necessarily reflect the resolution
  when going to full screen (since the user may move the browser
  window to another screen before switching to fullscreen).  Game code
  should check the `width` and `height` properties on `GraphicsDevice`
  once fullscreen mode has been entered to accurately determine the
  correct resolution.

* Engine objects `VertexBuffer`, `IndexBuffer` and `Texture` now
  return formats as `GraphicsDevice.VERTEXFORMAT_*`,
  `GraphicsDevice.INDEXFORMAT_*` and `GraphicsDevice.PIXELFORMAT_*`
  instead of as strings.  Canvas and plugin modes are now consistent
  in this respect.

* Graphics APIs that take a `Semantics` object could sometimes be
  passed an array of strings or `GraphicsDevice.SEMANTIC_`... enums.
  The plugin version no longer supports this and has strict argument
  checking, ensuring that the canvas and plugin modes are consistent.

Fixed
-----

**0.20.1**

* Loading of archived sounds in canvas mode fixed for Firefox (T972)
* Corrected the value returned by InputDevice.convertToUnicode() for
  some keys (T966)
* Fixes for m43Orthonormalize and v3Cross on MathDevice
* PDF documentation added back to the Windows SDK installer
* Clean up the __tmp_attach directory left by the SDK installer on Mac

**0.20.0**

* SceneNode.getDisabled always returns a bool
* Wireframe rendering now skips disabled SceneNodes
* MathDevice.quatTransformVector and VMath.quatTransformVector.
* MathDevice.m43Orthonormalize and VMath.m43Orthonormalize.
  Correctly provides left handed vectors instead of right handed ones.
* InputDevice.isFocused is now a function in both canvas and plugin
  modes.
  Games should now call this function to determine if it has focus and hence is able to process input.
* Python can now be installed to a non-default path (T938)

Support
=======

If you are having difficulties with Turbulenz Technology, the following support resources are available for developers:

Turbulenz Documentation
-----------------------
Documentation should be the first port of call, wherever possible.
Documentation for each SDK is included within (In HTML/PDF format).
The latest documentation can be found online at http://docs.turbulenz.com

**Having a problem with a programming interface?**
Take a look at the API reference. There might be an argument you are missing or dependency you need to include:

    * :ref:`Low Level API <low_level_api>`
    * :ref:`High Level API <high_level_api>`
    * :ref:`Turbulenz Services API <turbulenz_services_api>`

**Something slightly different in a previous release?**
We put interface upgrade information in the release notes for each SDK. If there's something different you have to do, you'll find it listed here:

    * `Latest Release Notes <http://docs.turbulenz.com/release_notes>`_

**Do we already know about your problem?**
The known issues contain a listing of caveats, some of which we are fixing, some which 3rd parties are fixing and a few facts of life.
Make sure you look at the known issues for the version of Turbulenz you are working with. Issues do get fixed!

    * `Latest Known Issues <http://docs.turbulenz.com/known_issues>`_

If you think something is not quite right, doesn't make sense or is missing, give us some feedback.

Turbulenz Knowledge Base
------------------------
This is where you can find important notifications, useful articles and frequently asked questions.
If there's something we think our developers should know about, we'll put it here.
The knowledge base will grow and update over time to keep coming back, there might be an better way to it!

Submit A Support Request
------------------------
If you've racked your brains, searched the documentation and you are just plain stuck, then maybe its time to send Turbulenz a support request.
Questions, issues, feature requests, advice, whatever you need help with... put it in the form and we will try to get back to you as soon as possible.
Once you've submitted it you can track your request until you get the right information and the issue has been resolved.

**To use the support system, navigate to** `https://hub.turbulenz.com <https://hub.turbulenz.com>`_ **and click on 'Support'**

In some cases we may give you an additional issue reference so you can find out exactly when the issue fix is available.
In these cases you can compare your issue with the release notes for the version of the SDK your issue was resolved in.

Once you have started your support request, you can correspond with the support team about that ticket via the support site or email.

Known Issues
============

The following is a list of the changes to the known issues in this SDK.

Updated
-------
* Due to a Firefox bug, key up events are not sent in Firefox 8, 9, 10, 11, 12 on Mac OS 10.5.

Unchanged
---------

* Placing Firebug breakpoints before ``window.onload`` in debug builds results in the Turbulenz Engine failing to load properly.
* The "insert" key is not supported on macs when using the plugin.
* On IE the samples' slider and text controls are not fully functional.
* With the canvas versions of applications the captured mouse can move outside of the browser's window. This is because a consistent definition of 'mouse lock' functionality for canvas is yet to be defined.
* Creating a GraphicsDevice with width or height of 0 may fail on some configurations on Windows where Angle is used.
* With Firefox 4 and above on Windows coming out of fullscreen may hang.
* On Windows Vista with an ATI video card, Firefox may not refresh the display until the browser is activated or moved.
* On Mac the python tools do no work when invoked with "python -m", e.g. "python -m dae2json -h". However using the SDK environment you can simply use the tool directly, e.g. "dae2json.py -h".
* Calling hasOwnProperty on a JavaScript object returned from the plugin implementation throws an error (Not in canvas implementations).
* The plugin implementation of the Turbulenz Engine on the following configurations may be slower than the Windows equivalent:
    * Mac OS X 10.6 and above : Google Chrome, Firefox 4.0 and above
    * Mac OS X 10.5 : Google Chrome
* Under Mac OS X, switching to full-screen browsing under Firefox 3.6 while the plugin version of the engine is running can result in rendering being halted.
* Certain samples don't have canvas equivalents due to utilizing plugin only features. These include:
    * deferred_rendering (Multiple render targets)
    * loading (External resource dependency issue)
    * physics (Uses plugin physics device)
    * physics_collisionmesh (Uses plugin physics device)
    * physics_constraints (Uses plugin physics device)
* WebGL performance in Firefox 4 and above may be limited by the browser's current implementation.
  Consider using Chrome to get a better representation of WebGL performance.
* The plugin implementation of the engine requires a CPU that supports SSE2.
* When running intensive JavaScript applications that push the performance of the platform, such as the *multiple animations*, the browser may become less responsive.
  You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly.
  See the Turbulenz :ref:`recommendations <recommendations>` for the preferred browser to use for development.
* The following browser(s) do not fully support the majority of samples in the following *debug* configurations:
    * IE 6/7/8/9 - canvas, plugin
    * Opera 10/11 - canvas, plugin
* The following browser(s) do not fully support the majority of samples in the following *release* configurations:
    * IE 6 - canvas, plugin (Styling issue only)
    * Opera 10/11 - canvas, plugin
* The following browser(s) are performance limited for the samples in the following *debug* configurations:
    * Chrome - plugin
    * Firefox 4 and above - plugin (with out of process plugins enabled. See :ref:`Running in Process <running_in_process>`).
* Some browsers don't support delete on engine object properties (plugin only), e.g. delete techniqueParameters.diffuse does not work, use techniqueParameters.diffuse = undefined instead.
* Erratic behavior has been observed in Safari 5.0 on Mac OS X, relating to input and debug mode applications.
  Turbulenz recommend using Safari 5.1 if any of this behavior is observed.
* The SVG samples doesn't work on Internet Explorer 8 in any mode. This is related to IE8 not parsing the SVG file correctly.
* The nVidia drivers (version 8.17.12.7061 - 8.17.12.7533) bug causes multiple render targets to render the output for the first target to all target textures.
  The current work around for shaders generated with ``cgfx2json`` is to reorder any writes to ``gl_FragData`` so they are in order.
  nVidia have now fixed this bug through windows update or the latest driver download on their website.
  If an update is not possible follow the steps in this :ref:`example <nVidia_driver_MRT_bug>`.
* WebGL is currently unsupported by Firefox on Mac OS 10.5.
* The MathDevice ignores JavaScript arrays as destination parameters and acts as if no destination has been given.
  This is to ensure performance in maintained.
* For shader support the plugin implementation of the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome.
  See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the local server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the local server before running any Turbulenz tools.
* Firefox 4 and above
    * With out of process plugins enabled debug builds may behave erratically.
      This has been fixed by Mozilla and will be rolled out in a future version.
      See https://bugzilla.mozilla.org/show_bug.cgi?id=653083
* When debugging with Chrome it may repeatedly warn the plugin is unresponsive.
    * See http://code.google.com/p/chromium/issues/detail?id=82061
* Sound stuttering can be heard when the browser is using 100% of CPU.
* In some cases, refreshing a web page when a Turbulenz application is requesting data can leave the browser in an inconsistent state.
  Please avoid refreshing when the application is still loading.
* Compatibility
    * Shaders
        * tex2DProj does not work as expected on some Intel chip-sets, e.g. G41. tex2DProj requires a float4 with w=1.0 to be passed, rather than a float3.
          The sample shaders use tex2DProjFix to work around this issue.
* In some cases on Windows 7, the SDK installer is unable to automatically open the Windows Firewall for the Local Server on a local network if UAC is enabled.
  To allow the local server to be accessed over a local network, please manually update the Windows Firewall rule.
* When using the Input Device, certain browsers can take a little longer to release the mouse pointer when pressing ESC.
  Try holding ESC for a longer period of time, or alternatively use alt-tab to navigate to a different window (windows only) or end the process if the browser stops responding.
* The mouse wheel does not send scroll events in Safari 5.0 on Mac OS 10.5.
* The middle mouse button does not send click events in Firefox on Mac OS 10.6 and 10.5, and in Safari 5.0 on Mac OS 10.5.
* Switching window or tab on Safari 5.0 and Firefox on 10.5 does not send a blur or mouselocklost event.
* The browser is not in focus when exiting fullscreen in Safari 5.0 & Firefox on Mac OS 10.5.
