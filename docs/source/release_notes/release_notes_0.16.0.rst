--------------------
Turbulenz SDK 0.16.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.16.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.16.0 - http://www.turbulenz.com/download

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

**Support for Mac OS X**

This release includes engine support for Mac OS X 10.5 and above.  Please note that this is an early beta version of the engine.  While most functionality is fully working, there are some remaining issues which are specific to the Mac OS X platform.  Please see "Known Issues" for details.


Fixed
-----

* When running with the native engine with large numbers of objects memory use is far lower resulting in fewer out of memory issues when under moderate load.
* Keyboard controls in the following browsers also map to the browser's default behaviour e.g. F1 brings up the help window.
    * IE 7/8/9
* The following version of this browser is not compatible with the Turbulenz Engine:
    * Safari 5.1 - Engine not compatible

Known Issues
============

* The Mac OS X beta version of the engine may exhibit low performance for certain games and samples when run from the following browsers
    * Mac OS X 10.6 and above : Google Chrome, Firefox 4.0 and above
    * Mac OS X 10.5 : Google Chrome
* Under Mac OS X, switching to full-screen browsing under Firefox 3.6 while the engine is running can result in rendering being halted.
* The InputDevice is currently lacking support for certain Mac OS X modifier keys.
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
