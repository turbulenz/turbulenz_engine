--------------------
Turbulenz SDK 0.13.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.13.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.13.0 - http://www.turbulenz.com/download

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

**Turbulenz Services**

* New :ref:`On Screen Display Library <osdlib>` to display messages on the Turbulenz pages.

Changes
-------

* :ref:`GraphicsDevice.getScreenshot <graphicsdevice_getscreenshot>` now uses the width and height of the active render target,
  otherwise defaults to using ``graphicsDevice.width`` and ``graphicsDevice.height`` as before.
  This allows reading texture data from a render buffer using :ref:`GraphicsDevice.getScreenshot <graphicsdevice_getscreenshot>`.

* :ref:`RenderTarget <renderTarget>` now supports `getWidth` and `getHeight`.

* The maximum attributes allowed for :ref:`VertexBuffers <vertexbuffer>` have been increased from 8 to 16.

* The wireframe functionality has been expanded to allow passing in a ``wireframeInfo`` object as a parameter to
  :ref:`DefaultRendering.setWireframe <defaultrendering_setwireframe>`, which specifies the wire color, fill color and alpha value to be used.

* The :ref:`Viewer <viewer>` has been updated to incorporate default and blueprint wireframe options.

Fixed
-----

* Fixed dds loading for R5G6B5 and B5G6R5 formats.
* Fixed tga loading for 16-bit textures and 8-bit paletted textures.


Known Issues
============

* The MathDevice ignores JavaScript arrays as destination parameters and acts is if no destination has been given.
* The engine requires a CPU that supports SSE2.
* For shader support the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome.
  See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the Local Server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the Local Server before running any Turbulenz tools.
* When running intensive JavaScript applications, such as the *multiple animations* sample, some browsers, such as IE9, may lockup the user interface.
  You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly.
  Turbulenz recommends Firefox 3.6.
* The following browser(s) do not fully support the samples in *development* mode:
    * IE 6/7/8/9 - Engine not compatible
    * Opera 10/11 - Engine not compatible
* The following browser(s) do not fully support the samples in *release* mode:
    * IE 6 - Not compatible with the styling
    * Opera 10/11, IE 9 - Controls are not fully functional
* Firefox 4
    * We are currently working on compatibility.
* The following browser(s) are performance limited for the samples in *development* mode:
    * Chrome (not using the Turbulenz JavaScript Engine)
* Some browsers don't support delete on native engine object properties, e.g. delete techniqueParameters.diffuse does not work, use techniqueParameters.diffuse = undefined instead.
* Sound stuttering can be heard when the browser is using 100% of CPU.
* In some cases, refreshing a web page when a Turbulenz application is requesting data can leave the browser in an inconsistent state.
  Please avoid refreshing when the application is still loading.
* Compatibility
    * Features
        * RenderTargets with format "D24S8" do not work on some Intel graphics chip-set, e.g. G41.
    * Shaders
        * tex2DProj does not work as expected on some Intel chip-sets, e.g. G41. tex2DProj requires a float4 with w=1.0 to be passed, rather than a float3.
          The sample shaders use tex2DProjFix to work around this issue.
* In some cases on Windows 7, the SDK installer is unable to automatically open the Windows Firewall for the Local Server on a local network if UAC is enabled.
  To allow the Local Server to be accessed over a local network, please manually update the Windows Firewall rule.
