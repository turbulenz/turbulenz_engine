--------------------
Turbulenz SDK 0.17.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.17.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

.. NOTE::

    The Turbulenz Engine Installer is now included with the SDK.
    If you intended to develop using this SDK, you will need to install the engine located here: **\*SDKINSTALLDIR\*/engines/0.17.0/**.
    This Turbulenz Engine is a pre-release for developers and is only intended for development with the SDK.
    If you want to access games on http://www.turbulenz.com, make sure you check http://www.turbulenz.com/download to ensure you have the latest compatible version.
    In the future, engine version management will be taken care of automatically.

**Windows XP/Vista/7**

    The Turbulenz SDK for Windows is available from GitHub as a downloadable installer.
    This contains the tools, samples and engine components required to develop Turbulenz applications.

    The following software should be installed before installing the Turbulenz SDK:

    **Essential**

    * Python 2.6.5 - http://www.python.org/download/releases/2.6.5/

    **Recommended**

    * Microsoft Visual Studio 2008 - Used to compile speed-ups for python environment if available on platform.
    * PDF reader - Required to read documentation in PDF format

    .. NOTE::

        Performance of any Python modules could potentially be slower if speed-ups cannot be compiled.
        It is recommended that you install Visual Studio **before** installing the Turbulenz SDK, so that the speed-ups can be configured in the environment.
        If you are using a 64bit version of Python you **must** have installed a 64bit version of the Visual Studio compilers.

**Mac OS X 10.5/10.6/10.7 (BETA)**

    The Turbulenz SDK for Mac OS X is now available to developers in beta.
    The SDK installer is a self-extracting shell script.
    After installing the essential software, open a terminal in the same directory as the SDK installer and type:

    1) chmod a+x TurbulenzSDK-X.X.X.run
    2) ./TurbulenzSDK-X.X.X.run
    3) Follow the instructions

    The following software should be installed before installing the Turbulenz SDK:

    **Essential**

    * Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
    * Xcode 3.2.6 (Or greater) - This MUST be installed before running the script so that Python can compile certain modules.

    **Recommended**

    * Cg Toolkit - http://developer.nvidia.com/cg-toolkit - Required to compile shaders using the cgfx2json tool.

Recommendations
===============

As technology and tools are updated, so too will the recommendation for development environment.
Turbulenz aim to recommend versions of various third party tools and services that are the most stable, reliable and representative of the final product for development of your projects.

Web Browser & Debugger
----------------------

The web browser is the focus point for development.
Games developed using Turbulenz are run, debugged and profiled from the web browser.
Although performance of the browsers in release mode is relatively consistent. The choice for development mode, depends on the performance of the browser and the tools available for it.
Most JavaScript debuggers are either integrated into the browser or add-ons.
These debuggers allow developers to pause execution, step through code, inspect variables and execute functions via the console.
Turbulenz recommends for debugging in development mode:

**Firefox 3.6.X with Firebug 1.7.3**

* Platforms: Windows XP/Vista/7 & Mac 10.5/10.6/10.7
* Alternative(s):
    * Windows - Firefox 6.0 with Firebug 1.8.1 (Using in-process mode. See :ref:`Running in Process <running_in_process>`.)
    * Mac - Safari 5.0/5.1 with Web Inspector (built-in)

Code Verification
-----------------

Ensuring accurate JavaScript code is written before runtime is an important step when developing with JavaScript.
There are a number of tools that are designed to inspect JavaScript usage and check syntax.
Turbulenz recommends for code verification:

**JSLint**

* Version: 2010-01-04
* Url: http://www.jslint.com

.. NOTE::

    JSLint can be run on JavaScript code in a many ways: directly from the site, from the command line using Node.js etc.
    It has also been integrated into a number of IDEs and editors, for example KJSLint extension for Komodo Edit (http://community.activestate.com/xpi/kjslint-jslint-komodo)

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

* Version: 6.1
* Url: http://www.activestate.com/komodo-edit/downloads

Change List
===========

New Features
------------

* :ref:`Canvas <canvas>` class added to jslib: This implements the `HTML5 canvas specification <http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#the-canvas-element>`_.

    * Two new samples added:
        * 2dcanvas: demonstrates most of the 2D canvas API.
        * svg: example code to load, parse and render SVG files. Animation is not supported.

* :ref:`FontManager <FontManager>` class added to jslib: This may be used to render bitmap fonts.
* :ref:`getObjectStats <turbulenzengine_getobjectstats>` function has been added to the Turbulenz Engine. This function allows developers to find statistics about the objects currently active in the JavaScript Engine.

Changes
-------

* Improved shader compilation speed on ATI graphics cards.
* The fullscreen sample has been renamed postfx.
* The players locale can now be obtained using the :ref:`getSystemInfo <turbulenzengine_getSystemInfo>` method of the TurbulenzEngine object. This is useful when localizing game content.
* :ref:`InputDevice <inputdevice>` changes: There have been significant changes to the InputDevice - in particular to how keys and buttons are mapped before events are sent to the game. Please see the InputDevice docs for full details. The major changes include:

    * New oninputcapture and oninputrelease callbacks to alert the game when the player focuses or unfocuses on the game.
    * Keyboard keys are now mapped to KeyCodes which refer to a physical key on the keyboard and are standardized across all platforms. This allows one set of game code to work with many keyboards and keyboard layouts reducing the need for localization.
    * A convertToUnicode method has been added to the InputDevice. This converts a KeyCode to the Unicode character which would result from the user pressing the physical key associated with that KeyCode. This can be used to display localized controls to the player whilst internally only dealing with KeyCodes.
    * Mouse buttons are mapped to MouseCodes which are standardized across all platforms.
    * Pad buttons are mapped to PadCodes.
    * Mouse scroll events now have a minimum scroll of ±1 and behave consistently across all platforms.
    * The Escape key is now reserved for releasing the mouse cursor from the game.
    * General consistency improvements across all platforms.

* ``InputManager`` class added to jslib: This may be used to automate the receiving of events and management of device states.
* :ref:`Transient VertexBuffers <graphicsdevice_createvertexbuffer>` are now supported: this kind of VertexBuffer is optimized for dynamic single use geometries.

    * The only change required to use them is to set as true the parameter ``transient`` when creating the VertexBuffer.

* Experimental 'WebGL' samples have been renamed to 'canvas'. This now encompasses 2D canvas rendering and 3D canvas rendering. WebGL compatible browsers are still required to render 3D canvas contexts.


Fixed
-----
* SoundDevice bug that caused erratic behavior when the device runs out of sound sources.
* Sound.length was missing.


Support
=======

If you are having difficulties with the Turbulenz Engine & SDK, the following support resources are available for developers:

1) **Documentation** -   Before submitting any support request, Turbulenz recommend you look at the known issues in the release notes for the latest issues and :ref:`known issues knowledge base <known_issues_section>` for further details on solutions to problems.
2) **Issue Tracker (Github)** -  The Turbulenz SDK project on github has an issue tracker, where you can post issues for the Turbulenz team and other Turbulenz developers who may be able to help solve your issue. The information on this site is only available to Turbulenz developers. Feature requests can also be made using the issue tracker. Visit: https://github.com/turbulenz/sdk/issues
3) **Support Request** - If you can't find a resolution to your issue in any of the other resources, you can send an email to **support@turbulenz.com** and our team will endeavor to answer your question as soon as possible.

Known Issues
============

* Erratic behaviour has been observed in Safari 5.0 on Mac OS X, relating to input and development mode applications. Turbulenz recommend using Safari 5.1 if any of this behaviour is observed.
* The SVG samples doesn't work on Internet Explorer 8 in any mode. This is related to IE8 not parsing the SVG file correctly.
* Calling hasOwnProperty on a native JavaScript object throws an error.
* The Mac OS X beta version of the engine may exhibit low performance for certain games and samples when run from the following browsers
    * Mac OS X 10.6 and above : Google Chrome, Firefox 4.0 and above
    * Mac OS X 10.5 : Google Chrome
* Under Mac OS X, switching to full-screen browsing under Firefox 3.6 while the engine is running can result in rendering being halted.
* The nVidia drivers (version 8.17.12.7061 - 8.17.12.7533) bug causes multiple render targets to render the output for the first target to all target textures.
  The current work around for shaders generated with ``cgfx2json`` is to reorder any writes to ``gl_FragData`` so they are in order.
  nVidia have now fixed this bug through windows update or the latest driver download on their website.
  If an update is not possible follow the steps in this :ref:`example <nVidia_driver_MRT_bug>`.
* The WebGL samples are experimental and not all are currently supported.
    * Sample App is fully WebGL compatible.
    * The Worm App is fully WebGL compatible.
    * All samples are fully WebGL compatible except for the following: deferred_rendering, loading, physics,
      physics_collisionmesh, physics_constraints, sound.
* WebGL performance in Firefox 4/5/6/7 is limited by the browser's current implementation.
  Consider using Chrome to get a better representation of WebGL performance.
* The MathDevice ignores JavaScript arrays as destination parameters and acts as if no destination has been given.
* The engine requires a CPU that supports SSE2.
* For shader support the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome.
  See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the Local Server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the Local Server before running any Turbulenz tools.
* When running intensive JavaScript applications, such as the *multiple animations* sample may lockup the user interface.
  You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly.
  Turbulenz recommends Firefox 3.6.
* The following browser(s) do not fully support the samples in *development* mode:
    * IE 6/7/8/9 - Engine not compatible
    * Opera 10/11 - Engine not compatible
* The following browser(s) do not fully support the samples in *release* mode:
    * IE 6 - Not compatible with the styling
    * Opera 10/11
* Firefox 4/5/6/7
    * With out of process plugins enabled development builds may behave erratically.
      This has been fixed by Mozilla and will be rolled out in a future version.
      See https://bugzilla.mozilla.org/show_bug.cgi?id=653083
* The following browser(s) are performance limited for the samples in *development* mode:
    * Chrome
    * Firefox 4/5/6/7 with out of process plugins enabled. See :ref:`Running in Process <running_in_process>`.
* When debugging with Chrome it may repeatedly warn the plugin is unresponsive.
    * See http://code.google.com/p/chromium/issues/detail?id=82061
* Some browsers don't support delete on native engine object properties, e.g. delete techniqueParameters.diffuse does not work, use techniqueParameters.diffuse = undefined instead.
* Sound stuttering can be heard when the browser is using 100% of CPU.
* In some cases, refreshing a web page when a Turbulenz application is requesting data can leave the browser in an inconsistent state.
  Please avoid refreshing when the application is still loading.
* Compatibility
    * Shaders
        * tex2DProj does not work as expected on some Intel chip-sets, e.g. G41. tex2DProj requires a float4 with w=1.0 to be passed, rather than a float3.
          The sample shaders use tex2DProjFix to work around this issue.
* In some cases on Windows 7, the SDK installer is unable to automatically open the Windows Firewall for the Local Server on a local network if UAC is enabled.
  To allow the Local Server to be accessed over a local network, please manually update the Windows Firewall rule.
* When using the Input Device, certain browsers can take a little longer to release the mouse pointer when pressing ESC.
  Try holding ESC for a longer period of time, or alternatively use alt-tab to navigate to a different window (windows only) or end the process if the browser stops responding.
