-------------------
Turbulenz SDK 0.8.0
-------------------

Summary
=======

Turbulenz SDK 0.8.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.8.0 - http://www.turbulenz.com/download

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

* Added custom geometry "morphing" sample.
    * Demonstrates the use of a custom geometry instance (implemented as morphInstance) that allows a custom *prepareDrawParameters* function.
    * Demonstrates a method of adding effects to a renderer.
    * Uses the geometry format to create morphShapes and apply weights to them at runtime in the shader.
    * Implementation exists in "samples/scripts/morph.js" and an example "morph.cgfx" shader.

* Added sound archive loading to sound device interface.
    * New function :ref:`loadSoundsArchive <sounddevice_loadsoundsarchive>` on sound device, similar to the loadTexturesArchive function on the graphicsDevice.
    * Allows the loading of sounds from a tar archive.
    * Supports decompression of compressed sounds stored in the tar.
    * :ref:`Sound object <sound>` supports 'name' parameter.

* Added properties to the GraphicsDevice for getting the desktop resolution.
    * See :ref:`graphicsDevice.desktopWidth <graphicsdevice_desktopwidth>` and :ref:`graphicsDevice.desktopHeight <graphicsdevice_desktopheight>`.

* Additional documentation:
    * :ref:`Turbulenz JSON format <turbulenz_json_format>`
    * :ref:`profilingjavascript`

* More support for browser debuggers, such as firebug, evaluating the native engine variables:
    * Our native engine variables properties and methods can now be accessed from the debuggers.
    * The native engine variables are now named ``Turbulenz::ObjectName`` instead of ``NPObject JS wrapper class``.

* The :ref:`Profile <profile>` object.


* More support for firebug evaluating the native engine variables:
    * Our native engine variables properties and methods can now be accessed from firebug.
    * The native engine variables are now named ``Turbulenz::ObjectName`` instead of ``NPObject JS wrapper class``.

Changes
-------

* Moved the DrawParameters to the native engine for improved performance.
    * A new :ref:`GraphicsDevice.drawArray() <graphicsdevice_drawarray>` to efficently render arrays of DrawParameters.
    * A new :ref:`GraphicsDevice.createDrawParameters() <graphicsdevice_createdrawparameters>`.
    * See :ref:`DrawParameters <drawparameters>` for the updated interface.

* The Scene JSON format has moved the skeleton object off nodes and into a new dictionary.
    * The dae2json tool has changed to this new standard.
    * See :ref:`Turbulenz JSON format <turbulenz_json_format>` for the updated format.
    * Added 'meta' object to JSON geometry object. Requires assets to be rebuilt to take advantage of the scene delayed loading feature (:ref:`yieldFn required<scene_load>`).

Fixed
-----

* #Issue 44: The failure to load certain types of TGA file with RLE compression.


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
