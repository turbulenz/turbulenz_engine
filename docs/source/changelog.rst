.. index::
    single: Changelog

.. _changelog:

---------
Changelog
---------

Version 1.x-dev
---------------

2013-11-07

- Changed default materialColor and uvTransform setting behaviour in the renderers to set on the sharedMaterial
  instead of each renderable

Version 1.2
-----------

2013-10-30

- Fixed animation NodeTransformControllers which would not bind to multiple root nodes in a scene.
- Added method Material.clone.
- Added default effect callbacks for all the renderers:
    * defaultPrepareFn
    * defaultUpdateFn
    * defaultSkinnedUpdateFn
    * defaultShadowMappingUpdateFn
    * defaultShadowMappingSkinnedUpdateFn
    * loadTechniquesFn
- Added VERTEX_SHADER_PRECISION and FRAGMENT_SHADER_PRECISION to GraphicsDevice.maxSupported.
- Added utility function PhysicsManager.addNode.
- Fixed CanvasContext.fillText to support scale and rotation transforms.
- Updated all Python code to comply with a Pylint 1.0.0 based on updated .pylintrc file.
- Upgraded to TypeScript 0.9.1 compiler for all engine, sample and
  application builds.  See http://www.typescriptlang.org/ for
  information about breaking changes from 0.8.x.
- Added alpha channel support when creating the GraphicsDevice.
- Added TEXTURE_UNITS and VERTEX_TEXTURE_UNITS to GraphicsDevice.maxSupported.
- Added experimental header and footer code required to run .canvas.js
  builds under ejecta.js.  See scripts directory.
- Updated hub documentation relating to changes in metrics display. See the Hub user guide metrics section for
  details of changes.
- Numerous small fixes and optimizations across all the typescript and javascript libraries.
- Fixed background sound source bug in Protolib.
- Added a setProgress method to the LoadingScreen object.
- Added id property to Texture, VertexBuffer, IndexBuffer, RenderBuffer, RenderTarget, Shader, and Technique objects.
- Canvas 2D API no longer requires a MathDevice object.
- When setting a negative or invalid score the leaderboard manager will now raise an error.
- Added getTime method to TurbulenzEngine.
- Added a getMetrics method on the scene when scenedebugging is enabled, and show metrics in the viewer.
- Fixed wireframe rendering issues in scenedebugging, adds support for non-indexed geometries sharing buffers.
- Fix for removal of playbackRate property in Firefox 22.
- Updates and optimizations to cgfx2json shader compilation.
- Enable support for pointer lock outside of fullscreen mode in Firefox 22 and higher.
- Added new copyFiltered post effect to PostEffects.
- Respect the requested version of typescript when setting up the env to avoid failures with new releases.
- Enable deferred rendering sample for canvas builds when extensions are supported.
- Added support for WEBGL_draw_buffers or EXT_draw_buffers extensions.
- Added sphere loading to load_model sample.
- Fixed dependencies link in README.rst.
- Various minor updates shadowmapping.
- Added NodeJS script to allow exportevents tool to work with open source engine releases.
- Added compilers check to 'env' command. Should warn if correct compilers can't be found.
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
