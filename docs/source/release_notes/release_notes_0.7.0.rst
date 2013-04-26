-------------------
Turbulenz SDK 0.7.0
-------------------

Summary
=======

Turbulenz SDK 0.7.0 is an update for both the Turbulenz Engine Installer and SDK components.
This release includes an update to the JavaScript APIs to improve the consistency of parameter ordering.
It also includes changes to the renderers and dispatching introducing the concept of 'DrawParameters' and multiple render passes.
The renderer changes also make it easier to support custom 'renderables' with a similar API to 'GeometryInstance'.
Minor changes have been made to 'local.turbulenz', improving the functionality of the metrics and recording in JSON format.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.7.0 - http://www.turbulenz.com/download

**Optional**

* Java 1.4+ (Required for YUI Compressor) - http://www.java.com/en/download/manual.jsp
* PDF reader

Change List
===========

New Features
------------

**SceneNode**

    * Added enableHierarchy()

**Scene**

    * Scene.load() parameters now takes an optional ``disabled`` flag.

**MathDevice**

    * MathDevice now contains an :ref:`AABB <aabbobject>` object.

**GraphicsDevice**

    * GraphicsDevice.setStream() now takes an optional ``offset`` flag.

**Observer**

    * An implmentation of the observer pattern.

Changes
-------

* Fix for the ForwardRenderer not working with flares and drawing white when there was no ambient light.

Standardization of parameter ordering to the following format:

* Turbulenz Engine
* Devices
    * Graphics Device
    * Maths Device
    * Input Device
    * Physics Device
    * Sound Device
    * ...
* Managers
    * Texture Manager
    * Shader Manager
    * Effect Manager
    * ...
* Parameters
* Custom parameters
    * ...
    * ErrorCallback
    * Log

Ordering of parameters:

* CameraController.create(camera, graphicsDevice, inputDevice, log) -> (graphicsDevice, inputDevice, camera, log)
* CharacterController.create(matrix, graphicsDevice, inputDevice, physicsDevice, params, log) -> (graphicsDevice, inputDevice, physicsDevice, matrix, params, log)
* loadMaterial(materialName, material, graphicsDevice, textureManager, effectManager) -> (graphicsDevice, textureManager, effectManager, materialName, material)

Removal of parameters:

* loadingScreen.render(graphicsDevice, backgroundAlpha, textureAlpha) -> (backgroundAlpha, textureAlpha)

General renaming:

* scene.findLight -> scene.getLight
* scene.findMaterial -> scene.getMaterial
* scene.findMaterialName -> scene.getMaterialName
* fontManager.release -> fontManager.destroy

EffectManager Changes:

* API reworked to allow custom geometry types to be supported.
* New :ref:`Effect class<effect>` that maps a :ref:`geometryType <renderable_geometrytype>` to a prepare object.
* To replace EffectManager.createEffect calls see the :ref:`EffectManager <effectmanager_effectregistration>` documentation.

Renderer Changes:

* :ref:`Renderables <renderable>` documentation to allow custom renderables.
* :ref:`DrawParameters <drawparameters>` class used in Renderables interface.

local.turbulenz changes:

* Game Metrics recording and storing has been changed to use the JSON format instead of CSV format. Existing metrics sessions will not appear in the local server metrics view.
* Metrics grouping, sorting and Asset List sorting logic has been moved from the controller to the JavaScript client side.


Removed
-------

* scene.findEffectName has been removed.

Known Issues
============

* The MathDevice ignores JavaScript arrays as destination parameters and acts is if no destination has been given.
* The engine requires a CPU that supports SSE2.
* For shader support the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome. See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the Local Server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the Local Server before running any Turbulenz tools.
* When running intensive JavaScript applications, such as the *multiple animations* sample, some browsers, such as Safari, may lockup the user interface.
  This is due to the JavaScript interactions. You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly. Turbulenz recommends Firefox.
* The following browser(s) do not fully support the samples in *development* mode:
    * IE 6/7/8 - Engine not compatible
    * Opera 10.X - Engine not compatible
* The following browser(s) do not fully support the samples in *release* mode:
    * IE 6 - Not compatible with the styling
    * Opera 10.X - Controls are not fully functional
* The following browser(s) are performance limited for the samples in *development* mode (Don't use the Turbulenz JavaScript Engine):
    * Chrome
