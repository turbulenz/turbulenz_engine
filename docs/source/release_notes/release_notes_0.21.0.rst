--------------------
Turbulenz SDK 0.21.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.21.0 is an update for both the Turbulenz Engine
Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

.. NOTE::

    The Turbulenz Engine Installer is now included with the SDK.
    If you intended to develop using this SDK, you will need to install the engine located here: **\*SDKINSTALLDIR\*/engines/0.21.0/**.
    This Turbulenz Engine is a pre-release for developers and is only intended for development with the SDK.
    If you want to access games on https://turbulenz.com, make sure you check https://hub.turbulenz.com/download to ensure you have the latest compatible version.
    In the future, engine version management will be taken care of automatically.

**Windows XP/Vista/7**

    The Turbulenz SDK for Windows is available from https://hub.turbulenz.com as a downloadable a self-extracting installer exe.
    This contains the tools, samples and engine components required to develop Turbulenz applications.

    The following software should be installed before installing the Turbulenz SDK:

    **Essential**

    * Python 2.7.2+ - http://www.python.org/download/releases

    .. NOTE::

        It is not possible to use Python 3.X with the Turbulenz tools.

    **Recommended**

    * Microsoft Visual Studio 2008 - Used to compile speed-ups for
      python environment if available on platform.

    * PDF reader - Required to read documentation in PDF format

    After installing the essential and recommended software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK 0.21.0 for Windows
    3) Run TurbulenzSDK-0.21.0.exe
    4) Follow the instructions

    .. NOTE::

        Performance of any Python modules could potentially be slower
        if speed-ups cannot be compiled.  It is recommended that you
        install Visual Studio **before** installing the Turbulenz SDK,
        so that the speed-ups can be configured in the environment.
        If you are using a 64bit version of Python you **must** have
        installed a 64bit version of the Visual Studio compilers.

**Mac OS X 10.6/10.7 (BETA)**

    The Turbulenz SDK for Mac OS X is now available to developers in
    beta from https://hub.turbulenz.com as a self-extracting shell
    script.  This contains the tools, samples and engine components
    required to develop Turbulenz applications.

    The following software should be installed before installing the
    Turbulenz SDK:

    **Essential**

    * Python 2.7.2+ - http://www.python.org/download/releases

    .. NOTE::

        It is not possible to use Python 3.X with the Turbulenz tools.

    *Mac OS X 10.6*

        * Xcode 3.2.6+ - This MUST be installed before running the
          script so that Python can compile certain modules.

        .. NOTE::

            Only the command line development tools are required from
            Xcode and the iOS SDK is NOT required.

    *Mac OS X 10.7*

        * Xcode 4.3.2+
           or
        * Command Line Tools for Xcode (February 2012 or later)

        .. NOTE::

            If you don't already have Xcode installed, Turbulenz
            recommend the command line tools only, which is the
            minimum required for Turbulenz development.

    **Recommended**

    * Cg Toolkit - http://developer.nvidia.com/cg-toolkit - Required
      to compile shaders using the cgfx2json tool.

    After installing the essential and recommended software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK 0.21.0 for Mac
    3) Open a terminal in the same directory as the SDK installer and type:
    4) chmod a+x TurbulenzSDK-0.21.0.run
    5) ./TurbulenzSDK-0.21.0.run
    6) Follow the instructions

**Linux (ALPHA)**

    An Alpha release of the Turbulenz SDK for Linux is now available
    from https://hub.turbulenz.com as a self-extracting shell script.
    This contains the tools, samples and engine components required to
    develop Turbulenz applications.  Not that the Linux version of the
    browser plugin is not released.  Developers must use 'canvas' mode
    when running on Linux.

    This release has only been tested against Ubuntu 12.04 (64bit),
    although feedback from developers using other recent releases of
    other distributions is welcome.

    The following software should be installed before installing the
    Turbulenz SDK.  We recommend installing via your package manager:

    **Essential**

    * Python 2.7.2+ (incl. development files)

        * Under Linux, the Python development package (libraries and
          header files) must be installed.  On Ubuntu, this can be
          done with the following command::

            sudo apt-get install python-dev

        * It is recommended that you install `virtualenv` and
          `setuptools` for Python from your for your distribution's
          package manager.  On Ubuntu::

            sudo apt-get install python-virtualenv python-setuptools

    .. NOTE::

        It is not possible to use Python 3.X with the Turbulenz tools.

    * GCC (including g++)

        * This MUST be installed before running the script so that
          Python can compile certain modules.

    * Cg Toolkit 3.0+

        * The cgfx2json tool in the SDK relies on this library being
          installed.  Either install from your package manager or
          visit http://developer.nvidia.com/cg-toolkit to download the
          latest version.  Make sure you have the correct
          configuration for your system (32 / 64-bit).

    After installing the essential and recommended software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK 0.21.0 for Linux
    3) Open a terminal in the same directory as the SDK installer and type:
    4) chmod a+x TurbulenzSDK-0.21.0.linux.run
    5) ./TurbulenzSDK-0.21.0.linux.run
    6) Follow the instructions



Recommendations
===============

As technology and tools are updated, so too will the recommendations
for development environment.  Turbulenz aim to recommend versions of
various third party tools and services that are the most stable,
reliable and representative of the final product for development of
your projects.

Web Browser & Debugger
----------------------

The web browser is the focus point for development.  Games developed
using Turbulenz are run, debugged and profiled from the web browser.
Although performance of the browsers in release mode is relatively
consistent.  The choice for debug mode, depends on the performance of
the browser and the tools available for it.  Most JavaScript debuggers
are either integrated into the browser or add-ons.  These debuggers
allow developers to pause execution, step through code, inspect
variables and execute functions via the console.

Supported Development Platforms:
    :Windows: XP/Vista/7
    :Mac: 10.5/10.6/10.7

Turbulenz recommends for debugging in debug mode:

For canvas configurations: **Chrome with Developer Tools (built-in)**

- In canvas 3D (WebGL), Chrome offers the best performance.
- Chrome's tools also includes a heap snapshot feature for looking at memory usage.
- Alternative(s)
    :Windows: Firefox 14 with Firebug 1.10.2
    :Mac: Safari 5.1 with Web Inspector (built-in)

For plugin configurations: **Firefox with Firebug**

- Firefox 14 is recommended in debug mode. For good performance it
  requires the browsers to be configured to run plugins in-process.
  See :ref:`Running in-process <running_in_process>`.
- Alternative(s)
    :Mac: Safari 5.1 with Web Inspector (built-in)

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
        * Integrated into IDEs and editors (Both are now shipped in Komodo Edit 7)

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

* Version: 7
* Url: http://www.activestate.com/komodo-edit/downloads
* Includes JSHint & JSLint support.

Change List
===========

New Features
------------
* Typed arrays are now available in the Turbulenz plugin (see
  http://www.khronos.org/registry/typedarray/specs/latest for
  details).  We recommend that game code use them where practical.
  See :ref:`typed_arrays`.

* A new function :ref:`AABBTree.rayTest <aabbtree_raytest>` has been
  added to cast a ray through multiple AABBTree's concurrently with
  callback-defined filtering on external nodes.

* Native JavaScript implementation of :ref:`PhysicsDevice
  <physicsdevice>`. This implementation has some differences with the
  plugin version and not all features have been implemented, but is
  suitable for use in many game projects.

* New SDK sample: Physics_Benchmark running on both Canvas and Plugin.

* New Memory Analysis section in the :ref:`JavaScript Development
  Guide <javascript_development>`.  Some additional notes were added
  to the Profiling section.

* :ref:`Draw2D <draw2d>` object added providing a 2D sprite drawing
  API built on top of the :ref:`GraphicsDevice <graphicsdevice>` using
  WebGL.

  Related SDK sample: Draw2D running on both Canvas and Plugin.

* :ref:`TextureEffects <textureeffects>` object added providing an
  effects API with Gaussian Blur, Color Matrix, Bloom and Distort
  effects.

  Related SDK sample making use of Draw2D also: TextureEffects running
  on both Canvas and Plugin.

Changes
-------

* The SDK now requires Python 2.7.  See the requirements section for
  full details.

* The JavaScript VM in the plugin has been upgraded which can result in significant performance improvements.
  To get the best results make use of :ref:`typed_arrays`.
  This is especially true for functions used to create and update VertexBuffers, e.g. setData().

* The :ref:`MathDevice <mathdevice>` is now implemented in JavaScript
  using `Float32Array` objects.  This generally gives a performance
  improvement over previous versions and reduces garbage collection
  pauses.

* In plugin mode JavaScript code can no longer access browser globals
  directly.  A global 'window' object exists which refers to the
  'window' global in the browser.  Game code that interacts with
  objects on the HTML page should be updated appropriately.

  For example::

	if (console)
	{
		// ...
	}

  would now be::

	if (window.console)
	{
		// ...
	}


* SDK Samples Physics_CollisionMesh and Physics enabled on Canvas.

* To improve canvas sound support, sounds are now stored uncompressed
  on the hub and gamesite. Any sounds currently stored on the hub have
  been uncompressed. If you have deployed a game previously, and wish
  to do so again with the same sound files, you will need to delete
  the following from your local deploycache (found at
  SDK_ROOT_FOLDER/devserver/localdata/deploycache): "my-game.json.gz",
  and the "my-game" folder where
  "my-game" is the game slug (see the Manage tab of your game on local
  to check the slug).

* To improve use of memory, the getOverlappingPairs method of AABBTree
  has been modified to insert overlapping pairs as consecutive elements
  of the array, instead of as an array of two elements. This method as
  well as getOverlappingNodes have both been extended to permit re-use
  of the array by providing an optional startIndex parameter at which
  to begin insertions, and returning the number of insertions made. See :ref:`AABBTree <aabbtree>`.

* For consistency with the badges the leaderboards icons are now 48x48
  pixels rather than 46x46 pixels. Any icons in the old format will be
  automatically adjusted by adding a transparent border around the image
  when the game is deployed.

* The VMath function ``m34Scale`` behavior has changed to be consistent
  with the other matrix scale functions.
  Previously, the source matrix was modified.
  Now, the source matrix is left unchanged and the function takes an
  optional destination parameter.

Fixed
-----

* :ref:`badgeManager.listUserBadges <badgemanager_listuserbadges>` callback now gives an array
  (previously a dictionary) on local to be consistent with the documentation, hub and gamesite.

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

If you think something is not quite right, doesn't make sense or is
missing, give us some feedback.

Turbulenz Knowledge Base
------------------------

This is where you can find important notifications, useful articles
and frequently asked questions.  If there's something we think our
developers should know about, we'll put it here.  The knowledge base
will grow and update over time to keep coming back, there might be an
better way to it!

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
* The alpha release for Ubuntu 12 Linux (64 bit) does not include a
  browser plugin.  Developers can build and deploy plugin versions of
  their games, but only run the canvas versions.

Unchanged
---------

* Placing Firebug breakpoints before ``window.onload`` in debug builds results in the Turbulenz Engine failing to load properly.
* The "insert" key is not supported on macs when using the plugin.
* On IE the samples' slider and text controls are not fully functional.
* With the canvas versions of applications the captured mouse can move outside of the browser's window. This is because a consistent definition of 'mouse lock' functionality for canvas is yet to be defined.
* Creating a GraphicsDevice with width or height of 0 may fail on some configurations on Windows where Angle is used.
* On Windows Vista with an ATI video card, Firefox may not refresh the display until the browser is activated or moved.
* The plugin implementation of the Turbulenz Engine on the following configurations may be slower than the Windows equivalent:
    * Mac OS X 10.6 and above : Google Chrome, Firefox 4.0 and above
    * Mac OS X 10.5 : Google Chrome
* Under Mac OS X, switching to full-screen browsing under Firefox 3.6 while the plugin version of the engine is running can result in rendering being halted.
* Certain samples don't have canvas equivalents due to utilizing plugin only features. These include:
    * deferred_rendering (Multiple render targets)
    * loading (External resource dependency issue)
    * physics_constraints (Uses plugin physics device)
* WebGL performance in Firefox may be limited by the browser's current implementation.
  Consider using Chrome to get a better representation of WebGL performance.
* The plugin implementation of the engine requires a CPU that supports SSE2.
* When running intensive JavaScript applications that push the performance of the platform, such as the *multiple animations*, the browser may become less responsive.
  You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly.
  See the Turbulenz :ref:`recommendations <recommendations>` for the preferred browser to use for development.
* The following browser(s) do not fully support the majority of samples in the following *debug* configurations:
    * IE 6/7/8/9 - canvas, plugin
    * Opera 10/11/12 - canvas, plugin
* The following browser(s) do not fully support the majority of samples in the following *release* configurations:
    * IE 6 - canvas, plugin (Styling issue only)
    * Opera 10/11/12 - canvas, plugin
* The following browsers and configurations show low performance and
  unreliable behavior when running the *debug* samples with the plugin:
  * Chrome
  * Firefox 4 and above (with out of process plugins enabled. See :ref:`Running in Process <running_in_process>`).
* In *debug* mode with out-of-process plugins enabled, Firefox can
  invoke callbacks *during* calls to the engine.  This can lead to
  apparently erratic behavior.  (See :ref:`Running in Process
  <running_in_process>`)
* Some browsers don't support delete on engine object properties (plugin only), e.g. delete techniqueParameters.diffuse does not work, use techniqueParameters.diffuse = undefined instead.
* Erratic behavior has been observed in Safari 5.0 on Mac OS X, relating to input and debug mode applications.
  Turbulenz recommend using Safari 5.1 if any of this behavior is observed.
* The SVG samples doesn't work on Internet Explorer 8 in any mode. This is related to IE8 not parsing the SVG file correctly.
* The nVidia drivers (version 8.17.12.7061 - 8.17.12.7533) bug causes multiple render targets to render the output for the first target to all target textures.
  The current work around for shaders generated with ``cgfx2json`` is to reorder any writes to ``gl_FragData`` so they are in order.
  nVidia have now fixed this bug through windows update or the latest driver download on their website.
  If an update is not possible follow the steps in this :ref:`example <nVidia_driver_MRT_bug>`.
* WebGL is currently unsupported by Firefox on Mac OS 10.5.
* For shader support the plugin implementation of the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome.
  See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the local server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the local server before running any Turbulenz tools.
* When debugging with Chrome it may repeatedly warn the plugin is unresponsive.
    * See http://code.google.com/p/chromium/issues/detail?id=82061
* Sound stuttering can be heard when the browser is using 100% of CPU.
* Compatibility
    * Shaders
        * tex2DProj does not work as expected on some Intel chip-sets, e.g. G41. tex2DProj requires a float4 with w=1.0 to be passed, rather than a float3.
          The sample shaders use tex2DProjFix to work around this issue.
* In some cases on Windows 7, the SDK installer is unable to automatically open the Windows Firewall for the Local Server on a local network if UAC is enabled.
  To allow the local server to be accessed over a local network, please manually update the Windows Firewall rule.
* When using the InputDevice, certain browsers can take a little longer to release the mouse pointer when pressing ESC.
  Try holding ESC for a longer period of time, or alternatively use alt-tab to navigate to a different window (windows only) or end the process if the browser stops responding.
* The mouse wheel does not send scroll events in Safari 5.0 on Mac OS 10.5.
* The middle mouse button does not send click events in Firefox on Mac OS 10.6 and 10.5, and in Safari 5.0 on Mac OS 10.5.
* Switching window or tab on Safari 5.0 and Firefox on 10.5 does not send a blur or mouselocklost event.
* The browser is not in focus when exiting fullscreen in Safari 5.0 & Firefox on Mac OS 10.5.
