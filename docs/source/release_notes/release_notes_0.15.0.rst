--------------------
Turbulenz SDK 0.15.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.15.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.15.0 - http://www.turbulenz.com/download

**Optional**

* Microsoft Visual Studio 2008 - Used to compile speed-ups for python environment if available on platform.
* Java 1.4+ (Required for YUI Compressor) - http://www.java.com/en/download/manual.jsp
* PDF reader

.. NOTE::

    Performance of any Python modules could potentially be slower if speed-ups cannot be compiled.
    It is recommended that you install Visual Studio **before** installing the Turbulenz SDK, so that the speed-ups can be configured in the environment.
    If you are using a 64bit version of Python you **must** have installed a 64bit version of the Visual Studio compilers.

Change List
===========


New Features
------------

* Three new Turbulenz Services are supported for games, **Leaderboards**, **Badges** and **User Profiles**.
  Leaderboards can be added to your games, allowing players to compare their high scores within the game.
  Badges allow games to reward their players for progressing within the game.
  User Profiles allow games to display a player's name and query their prefered language.

  * A LeaderboardManager object is now part of the TurbulenzServices API for communicating with the leaderboards API see :ref:`LeaderboardManager <leaderboardmanager>`.
  * A BadgeManager object is now part of the TurbulenzServices API for communicating with the badges API see :ref:`BadgeManager <badgemanager>`.
  * A UserProfile object is now part of the TurbulenzService API for communicating with the user profile API see :ref:`UserProfile <userprofile>`.

  For an overview of the Turbulenz Services please read: :ref:`Turbulenz Game Services <turbulenz_game_services>`.

* A new app has been added called **Worm** that demonstrates a minigame using the Leaderboards and Badges APIs.
  The app shows the basics of creating a small 3D game with Turbulenz technology.

* A new tool has been added to the Turbulenz tools: **deploygame**.
  :ref:`deploygame <deploygame>` allows a game manifest to be deployed from the command line without directly interacting with the Turbulenz Local Server.
  This tools is accessed like the other Turbulenz python tools using '*python -m deploygame*'.
  For more information see the :ref:`deploygame API <deploygame>`.

* **Experimental**: Additional libraries allowing Turbulenz apps to use take advantage of WebGL in compatible browsers is now available!
  This feature allows you to use a WebGL compatible Engine, Graphics Device and Input Device interface.
  Although this feature is in experimental stages, you can see examples of its use in samples, sampleapp and Worm app.


.. NOTE::

    Sound Device, Network Device and Physics device interfaces are only available from the Native Engine API.

Changes
-------

* The UserData object in ``jslib\services\userdata.js`` has been renamed to UserDataManager ``jslib\services\userdatamanager.js``.
  Make sure to update any references to ``userdata.js`` that you have in your project(s).

* Various VMath functions now take an additional 'destination' argument to bring the JavaScript math library in line with the Math Device.
  These changes are necessary for compatibility with WebGL.

* The Turbulenz Local Server now uses 7-Zip as its prefered method of compressing deployment files to communicate with the Hub.
  This improvement reduces the time to deploy and the total size of the files sent to the server.

Fixed
-----

* The Turbulenz Engine now supports the following browsers:

    - Firefox 4/5
    - Internet Explorer 9

* Minor fixes to camera, deferred/forward shadows

* A bug related to the PIXELFORMAT_D24S8 format.

* The Turbulenz Native Engine now uses stable_sort as the method of sorting renderables.

Known Issues
============

* The nVidia drivers (version 8.17.12.7061 - 8.17.12.7533) bug causes multiple render targets to render the output for the first target to all target textures.
  The current work around for shaders generated with ``cgfx2json`` is to reorder any writes to ``gl_FragData`` so they are in order.
  nVidia have now fixed this bug through windows update or the latest driver download on their website.
  If an update is not possible follow the steps in this :ref:`example <nVidia_driver_MRT_bug>`.
* The WebGL samples are experimental and not all are currently supported.

  * Sample App is fully WebGL compatible.
  * The Worm App is fully WebGL compatible.
  * All samples are fully WebGL compatible except for the following: deferred_rendering, loading, physics,
    physics_collisionmesh, physics_constraints, sound.

* WebGL performance in Firefox 4/5 is limited by the browser's current implementation.
  Consider using Chrome to get a better representation of WebGL performance.
* Keyboard controls in the following browsers also map to the browser's default behaviour e.g. F1 brings up the help window.

  * IE 7/8/9

  This issue will be addressed in future SDK releases.
* The following version of this browser is not compatible with the Turbulenz Engine:

  * Safari 5.1 - Engine not compatible

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

* Firefox 4/5

  * With out of process plugins enabled development builds may behave erratically.
    This has been fixed by Mozilla and will be rolled out in a future version.
    See https://bugzilla.mozilla.org/show_bug.cgi?id=653083

* The following browser(s) are performance limited for the samples in *development* mode:

  * Chrome
  * Firefox 4/5 with out of process plugins enabled. See :ref:`Running in Process <running_in_process>`.

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
