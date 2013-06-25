.. index::
    single: Changelog

.. _changelog:

---------
Changelog
---------

Version 1.x-dev
---------------

2013-06-12

- Added sphere loading to load_model sample.
- Fixed dependencies link in README.rst.
- Minor docs typos.
- Added compilers check to 'env' command. Should warn if correct compilers can't be found.
- Fix for unnecessary NvTriStrip build argument
- Various minor updates shadowmapping.

Version 1.1
-----------

2013-06-04

- Update protolib library (version 0.2.0):
  * Added version number field.
  * Added horizontalAlign, verticalAlign properties to drawText.
  * Depricated alignment property of drawText and textAlignment enum.
  * Added setPostRendererDraw function for rendering after the scene rendering.
- Added Data Shares - shared public key-value stores which allow games to share data with other users.
- Added Notifications - send instant to other users or delayed notifications to the current user.
- Added Tic-tac-toe app - An app showing how to use the Data Share and Notification API's with a simple game.
- Update protolib library and add two apps 'protolibsampleapp' and 'protolibtemplateapp' (version 0.1.1)

  * Added a 'warn' function to the protolib.utils for warnings.
  * Add a 'time' property with app timers calculating current, previous, delta and maxDeltaTime times per frame.
  * endFrame, returns the result of graphicsDevice.endFrame.
  * Made naming conventions more explicit md -> mathDevice.
  * Loading now waits for essential assets to load.
  * Warning if minimum asset requirement is not met.
  * Simplesprite now preloads the shader.
  * Added loading screen with asset tracker for the assets loaded at the start of the game.
  * Params is now available via globals.config.
  * Added setPostDraw function for rendering after protolib, but before graphicsDevice.endFrame

  * Fix for the default assetPrefix value in the mapping settings.
  * Fix for opensans not being specified as the default font.
  * Fix for materialColor incorrectly set in plugin.
  * Fixed check for devices destroy function before calling.
  * Fix: Removed maxDistance = Infinity for sounds, that caused no sound on Firefox.
  * Fix: jQuery,extend undefined reference that caused exception on certain configurations.
- Updated the buildassets tool to support parallel builds
- Added support for batched submission of custom events, this allows for many custom events to be sent
  with less HTTP request overhead
- Added Visual Studio 2010 and 2012 projects for the tools
- Added NvTriStrip as a submodule. This is built with the manage.py tools command and is used by dae2json
  to generate optimized tristripped output assets


Version 1.0
-----------

2013-05-02

- Changes for first open source release
