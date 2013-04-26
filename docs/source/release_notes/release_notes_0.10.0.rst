--------------------
Turbulenz SDK 0.10.0
--------------------

Summary
=======

Turbulenz SDK 0.10.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.10.0 - http://www.turbulenz.com/download

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

**Native Engine**

* :ref:`TurbluenzEngine.getSystemInfo <turbulenzengine_getSystemInfo>` has been added.


**Local Server**

* Hash navigation has been implemented to allow easier navigation through the Local Server and bookmarking of the specific pages
* Metrics now include HTTP request status codes and highlighting for the requests with errors (4**, 5**)
* Pop-up message notifications about newer versions of SDK and Engine available to download
* Pop-up message warning to Windows OS users accessing Local Server through localhost/
* Edit Game page new functionality:
    * Browse dialogs for the game main executable and mapping table
    * Dynamic combo box for deploy files list
    * Improved descriptions of edit page fields

Changes
-------

* The Device Initialisation sample reports the system information.
* Samples detect lack of shader support.

Fixed
-----

* Shadows on older NVIDIA cards were cutting off.
* The Particle sample updated for broader hardware compatibility.
* Detects if the Local Server is running before launching a web browser from the shortcut.


Known Issues
============

* The MathDevice ignores JavaScript arrays as destination parameters and acts is if no destination has been given.
* The engine requires a CPU that supports SSE2.
* For shader support the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome.
  See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the Local Server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the Local Server before running any Turbulenz tools.
* When running intensive JavaScript applications, such as the *multiple animations* sample, some browsers, such as Safari, may lockup the user interface.
  This is due to the JavaScript interactions.
  You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly.
  Turbulenz recommends Firefox.
* The following browser(s) do not fully support the samples in *development* mode:
    * IE 6/7/8 - Engine not compatible
    * Opera 10.X - Engine not compatible
* The following browser(s) do not fully support the samples in *release* mode:
    * IE 6 - Not compatible with the styling
    * Opera 10.X - Controls are not fully functional
* The following browser(s) are performance limited for the samples in *development* mode:
    * Chrome (not using the Turbulenz JavaScript Engine)
* Some browsers don't support delete on native engine object properties, e.g. delete techniqueParameters.diffuse does not work, use techniqueParameters.diffuse = undefined instead.
* Sound stuttering can be heard when the browser is using 100% of CPU.
* In some cases, refreshing a web page when a Turbulenz application is requesting data can leave the browser in an inconsistent state. Please avoid refreshing when the application is still loading.
* Compatibility
    * Features
        * RenderTargets with format "D24S8" do not work on some Intel graphics chipset, e.g. G41.
    * Shaders
        * tex2DProj does not work as expected on some Intel chip-sets, e.g. G41. tex2DProj requires a float4 with w=1.0 to be passed, rather than a float3. The sample shaders use tex2DProjFix to work around this issue.
* In some cases on Windows 7, the SDK installer is unable to automatically open the Windows Firewall for the Local Server on a local network if UAC is enabled. To allow the Local Server to be accessed over a local network, please manually update the Windows Firewall rule.