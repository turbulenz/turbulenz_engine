--------------------
Turbulenz SDK 0.12.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.12.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.12.0 - http://www.turbulenz.com/download

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

**JavaScript Engine**

* :ref:`scene.load <scene_load>` and ``SceneLoader.load`` now require a mathDevice parameter.
* :ref:`camera.lookAt <camera_lookat>` now requires mathDevice object arguments.
* :ref:`Light.create <light_create>` now requires mathDevice objects on its params argument.
* Added a :ref:`MathDeviceConvert <mathdeviceconvert>` object for converting between JavaScript arrays and MathDevice objects.
* The JavaScript Engine Turbulenz Services files have moved into jslib/services:

    * jslib/gamesession.js --> jslib/services/gamesession.js
    * jslib/mappingtable.js --> jslib/services/mappingtable.js
    * jslib/turbulenzservices.js --> jslib/services/jslib/turbulenzservices.js
    * jslib/userdata.js --> jslib/services/jslib/userdata.js

**Native Engine**

* MathDevice functions removed support for taking JavaScript arrays as arguments.
  The reason for this change is the low performance of the functions when using JavaScript arrays (in most cases slower than using VMath).
  When updating your code to fix calls with JavaScript arrays be careful of the following:

    * Some of our functions now require MathDevice object arguments; for example the :ref:`Camera.lookAt <camera_lookat>` function.
    * Any JSON assets you have loaded manually will have JavaScript values which may need to be converted to native MathDevice objects.
    * When converting from JavaScript arrays to MathDevice objects try to only convert them once at load time and as little as possible at runtime.
    * Look out for cases using JavaScript arrays for destination variables as this will now cause unexpected behavior.
      For example::

        var a = [1, 2, 3];
        var b = [4, 5, 6];
        var c = b;
        b = mathDevice.v3Add(a, b, b);
        // We expect c = [4, 5, 6]

      In release 0.11.0 this code would work.
      However, this code is **NOT** correct it only works because we previously didn't support JavaScript array destinations.
      Suppose we update the code for 0.12.0 by converting all the JavaScript arrays to native MathDevice objects::

        var a = mathDevice.v3Build(1, 2, 3);
        var b = mathDevice.v3Build(4, 5, 6);
        var c = b;
        b = mathDevice.v3Add(a, b, b);
        // c = [5, 7, 9]
        // We expect c = [4, 5, 6] but this is not true!

      This can be corrected by removing the destination argument for the ``b = mathDevice.v3Add(a, b, b);`` line giving ``b = mathDevice.v3Add(a, b);``.

  You can convert from VMath types to MathDevice objects using apply.
  For example::

    var v3Build = mathDevice.v3Build;
    v3 = v3Build.apply(mathDevice, jsV3);

  Or when a destination is needed using the :ref:`MathDeviceConvert <mathdeviceconvert>` object::

    var v3Build = mathDevice.v3Build;
    v3 = MathDeviceConvert.arrayToV3(mathDevice, jsV3, mathDeviceV3);


* MathDevice function changes:
    * Removed ``v3Set(dest, a, b, c)`` you should now use ``v3Build(a, b, c, dest)`` instead.
    * Removed ``v4Set(dest, a, b, c)`` you should now use ``v4Build(a, b, c, dest)`` instead.
    * Removed ``aabbSet(dest, a, b, c)`` you should now use ``aabbBuild(a, b, c, dest)`` instead.
    * The matrix and quatPos build functions are overloaded to accept a list of components as arguments.
      See :ref:`quatPosBuild <quatpos>`, :ref:`m33Build <m33>`, :ref:`m43Build <m43>` and :ref:`m44Build <m44>`.
    * All build functions now take optional destinations.

**Local Server**

* Saved user data viewer added, which enables viewing saved game data for the default user on the Local, where the game or sample allows saving.


**Turbulenz Services**

* Added a :ref:`MappingTable.alias <mappingtable_alias>` function.

Changes
-------

* Support for the primitives 'quads', 'quad_strip' and 'polygon' has been removed.
  Quads created individually should now be formed using a triangle strip, and multiple quads created together should be formed using indexed triangles.
  Existing code, for instance using a single quad, can be transformed in the following manner::

    var writer = graphicsDevice.beginDraw('QUADS', 4, ['SHORT2', 'SHORT2'], ['POSITION', 'TEXCOORD0']);
    if (writer)
    {
        writer([x,       100], [0, 0]);
        writer([x + 300, 100], [1, 0]);
        writer([x + 300, 400], [1, 1]);
        writer([x,       400], [0, 1]);
        graphicsDevice.endDraw(writer);
    }

  To::

    var writer = graphicsDevice.beginDraw('TRIANGLE_STRIP', 4, ['SHORT2', 'SHORT2'], ['POSITION', 'TEXCOORD0']);
    if (writer)
    {
        writer([x,       100], [0, 0]);
        writer([x + 300, 100], [1, 0]);
        writer([x,       400], [0, 1]);
        writer([x + 300, 400], [1, 1]);
        graphicsDevice.endDraw(writer);
    }

* Support for 'GraphicsDevice::DrawRect()' has been removed. Desired functionality can be achieved by using a triangle strip instead.
  The code can be transformed in the following manner::

    gd.drawRect(x1, y1, x2, y2);

  To::

    var writer = gd.beginDraw('TRIANGLE_STRIP', 4, ['SHORT2'], ['POSITION']);
    if (writer)
    {
        writer(x1, y1);
        writer(x2, y1);
        writer(x1, y2);
        writer(x2, y2);

        gd.endDraw(writer);
        writer = null;
    }

* The :ref:`VertexBuffers <vertexbuffer>` and :ref:`IndexBuffers <indexbuffer>` buffer data can no longer be read.
    * VertexBuffer and IndexBuffer `data` property has been removed and a :ref:`setData  <vertexbuffer_setdata>` method added.
    * If you require access to the data the :ref:`Surface <surface>` now has a `vertexData` and an `indexData` property.
      By default the scene will discard vertex and index data during loading once :ref:`VertexBuffer <vertexbuffer>` objects are created.
      A `keepVertexData` flag has been added to the :ref:`Scene.load <scene_load>` parameters.
      Data can be cleared using :ref:`Scene.clearShapesVertexData <scene_clearShapesVertexData>`.

* The :ref:`Texture <texture>` data can no longer be read.
    * Texture `data` property has been removed and a `setData` method added.
    * If you require access to the data you can use :ref:`GraphicsDevice.getScreenshot <graphicsdevice_getscreenshot>`.

* The method :ref:`GraphicsDevice.getScreenshot <graphicsdevice_getscreenshot>` has been modified and the `scale` option has been removed.
    Four new options (`x`, `y`, `width`, `height`) are available that allow retrieving a subsection of the image.


Fixed
-----
* The forward and deferred rendering samples render correctly on a Radeon X1300.

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
