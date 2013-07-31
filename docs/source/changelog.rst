.. index::
    single: Changelog

.. _changelog:

---------
Changelog
---------

Version 1.x-dev
---------------

2013-07-31

- Updated hub documentation relating to changes in metrics display. See the Hub user guide metrics section for
  details of changes

2013-07-30

- Numerous small fixes and optimizations across all the typescript and javascript libraries.
- Fixed background sound source bug in Protolib.

2013-07-22

- Added a setProgress method to the LoadingScreen object.

2013-07-17

- Added id property to Texture, VertexBuffer, IndexBuffer, RenderBuffer, RenderTarget, Shader, and Technique objects.

2013-07-15

- Canvas 2D API no longer requires a MathDevice object.

2013-07-11

- When setting a negative or invalid score the leaderboard manager will now raise an error.
- Added getTime method to TurbulenzEngine.

2013-07-05

- Added a getMetrics method on the scene when scenedebugging is enabled, and show metrics in the viewer.

2013-07-04

- Fixed wireframe rendering issues in scenedebugging, adds support for non-indexed geometries sharing buffers.

2013-07-01

- Fix for removal of playbackRate property in Firefox 22.

2013-06-28

- Updates and optimizations to cgfx2json shader compilation.

2013-06-27

- Enable support for pointer lock outside of fullscreen mode in Firefox 22 and higher.
- Added new copyFiltered post effect to PostEffects.

2013-06-19

- Respect the requested version of typescript when setting up the env to avoid failures with new releases.

2013-06-12

- Enable deferred rendering sample for canvas builds when extensions are supported.
- Added support for WEBGL_draw_buffers or EXT_draw_buffers extensions.
- Added sphere loading to load_model sample.
- Fixed dependencies link in README.rst.
- Various minor updates shadowmapping.

2013-06-10

- Added NodeJS script to allow exportevents tool to work with open source engine releases.
- Added compilers check to 'env' command. Should warn if correct compilers can't be found.

2013-06-07

- Fix for unnecessary NvTriStrip build argument

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
