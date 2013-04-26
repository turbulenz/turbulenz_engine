--------------------
Turbulenz SDK 0.14.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.14.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.14.0 - http://www.turbulenz.com/download

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

**Samples**

* Added two new physics-based samples and one new loading sample:

    :Physics Constraints Sample: This sample demonstrates the type of physics constraints provided by the Physics Device.
    :Physics Collision Mesh Sample: This sample demonstrates various physical representations available and how to load them from collada files or add them to existing geometry.
    :Loading Sample: This sample demonstrates how to implement a basic splash loading screen while assets are being retrieved. It also shows how to use the 'On Screen Display (OSD)' library while background loading large assets.

**Native Engine**

* Added a ``TurbulenzEngine.onunload`` property.
  This property takes a callback function which is called just before the game is closed either by the browser or by site controls.
  Basically, where ``window.onbeforeunload`` was previously used::

        // Destroy callback to run when the game is closed
        var appDestroyCallback = function unloadCallbackFn()
        {
            TurbulenzEngine.clearInterval(intervalID);
            gameSession.destroy();
            delete window.onbeforeunload;
        };
        window.onbeforeunload = appDestroyCallback;

  Now, you should set the ``TurbulenzEngine.onunload`` property::

        // Destroy callback to run when the game is closed
        TurbulenzEngine.onunload = function unloadCallbackFn()
        {
            TurbulenzEngine.clearInterval(intervalID);
            gameSession.destroy();
        };

  Note that you should also remove the ``delete window.onbeforeunload;`` line as well.
  
.. NOTE::

    This method will only be called on Turbulenz sites (Local, Hub and the Turbulenz game site).
    If you are running your content directly from the file system, we advise move your development to Local or use an alternative destruction method.

* GraphicsDevice has :ref:`isSupported <graphicsdevice_issupported>` and :ref:`maxSupported <graphicsdevice_maxsupported>` added. These can be used to check the supported features and should be used instead of checking extensions directly.

* The render is being brought inline with the OpenGL ES 2.0 standard used by WebGL.

    * Shaders

        Some changes are required to make them ES 2.0 compliant.
        For the full specification see http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf.

        Cgfx2json will automatically update the output format but wont replace deprecated features which need manual reimplementation.

        If you have your own tool chain or manual shaders then you need to do the following:
            * Add "#ifdef GL_ES\\nprecision mediump float;precision mediump int;\\n#endif\\n" after any preprocessor directives.
            * Replace any unsupported built in name (gl_*) with a custom variable, e.g. to use gl_FrontColor declare a 'varying vec4 color;' and replace the gl_FrontColor reference with 'color'. For gl_TexCoord[] declare a 'varying vec4 texCoord[8]'.
    
    
    * Deprecated alpha testing removed:

        We no longer support alpha testing with::

              technique alphatest
              {
                  pass
                  {
                      AlphaTestEnable = true;
                      AlphaFunc       = float2(GEqual, 0.5);

                      VertexProgram   = compile latest vp_alphatest();
                      FragmentProgram = compile latest fp_alphatest();
                  }
              }

        You can recreate this functionality with ``discard``::

            float4
            fp_alphatest(FP_ALPHATEST_IN IN) : COLOR
            {
                ...
                if (result.a < 0.5)
                {
                    discard;
                }
                return result;
          }

    * Deprecated PolygonMode removed. See the wireframe implementation in debug.cgfx and its use in scenedebugging.js for ideas on how to replicate this behavior.
    * sampler_state replace Clamp with ClampToEdge. e.g. WrapS = ClampToEdge;
    * NULL fragment programs are not supported. Replace them with an empty function. See zonly.cgfx.

.. WARNING::

    It is recommended that you rebuild your shaders with this version of the SDK, due to the updated changes for compatibility.

* By default ES 2.0 does not support non-power of 2 mip mapped textures. See :ref:`isSupported <graphicsdevice_issupported>` for checking implementation.

* Support for the following :ref:`pixel formats <graphicsdevice_PIXELFORMAT>` has been removed:
    * PIXELFORMAT_L16
    * PIXELFORMAT_B5G6R5
    * PIXELFORMAT_B8G8R8A8
    * PIXELFORMAT_B8G8R8
    * PIXELFORMAT_R10G10B10A2
    * PIXELFORMAT_R16G16
    * PIXELFORMAT_R16G16B16A16
    * PIXELFORMAT_R16F
    * PIXELFORMAT_R16G16F
    * PIXELFORMAT_R16G16B16A16F
    * PIXELFORMAT_R32F
    * PIXELFORMAT_R32G32B32A32F
    * PIXELFORMAT_D16
    * PIXELFORMAT_D32

* Added new arguments and configurable properties for Physics Constraints:

    * Point to Point Constraint
        * impulseClamp
    * Hinge Constraint
        * low
        * high
    * Cone Twist Constraint
        * swingSpan1
        * swingSpan2
        * twistSpan
        * twistAngle
        * damping
    * 6 Degrees of Freedom Constraint
        * linearLowerLimit
        * linearUpperLimit
        * angularLowerLimit
        * angularUpperLimit
    * Slider Constraint
        * linearLowerLimit
        * linearUpperLimit
        * angularLowerLimit
        * angularUpperLimit
    
Fixed
-----

* Improved support for Intel graphics.
    * ForwardRender works on GMA4500.

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
    * Shaders
        * tex2DProj does not work as expected on some Intel chip-sets, e.g. G41. tex2DProj requires a float4 with w=1.0 to be passed, rather than a float3.
          The sample shaders use tex2DProjFix to work around this issue.
* In some cases on Windows 7, the SDK installer is unable to automatically open the Windows Firewall for the Local Server on a local network if UAC is enabled.
  To allow the Local Server to be accessed over a local network, please manually update the Windows Firewall rule.
* When using the Input Device, certain browsers can take a little longer to release the mouse pointer when pressing ESC.
  Try holding ESC for a longer period of time, or alternatively use alt-tab to navigate to a different window (windows only) or end the process if the browser stops responding.
