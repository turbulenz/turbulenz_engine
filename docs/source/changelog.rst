.. index::
    single: Changelog

.. _changelog:

---------
Changelog
---------

Version 1.x-dev
---------------

2013-05-30
    - Added Data Shares - shared public key-value stores which allow games to share data with other users.
    - Added Notifications - send instant to other users or delayed notifications to the current user.
    - Added Tic-tac-toe app - An app showing how to use the Data Share and Notification API's with a simple game.

2013-05-21
    - Update protolib library and add two apps 'protolibsampleapp' and 'protolibtemplateapp'

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
2013-05-20
    - Updated the buildassets tool to support parallel builds
2013-05-17
    - Added support for batched submission of custom events, this allows for many custom events to be sent
      with less HTTP request overhead
2013-05-15
    - Added Visual Studio 2010 and 2012 projects for the tools
2013-05-13
    - Added NvTriStrip as a submodule. This is built with the manage.py tools command and is used by dae2json
      to generate optimized tristripped output assets


Version 1.0
-----------

2013-05-02

    - Changes for first open source release
