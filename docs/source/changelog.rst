.. index::
    single: Changelog

.. _changelog:

---------
Changelog
---------

Version 1.x-dev
---------------

2014-07-25

- Removed the Turbulenz browser plugin for Windows, since all modern
  browsers now support WebGL.  Correspondingly, samples and apps in
  the SDK no longer ship with builds that target the plugin
  (.release.html and .tzjs files).

2014-05-20

- Added closeExistingSessions option to TurbulenzServices.createGameSession function.
- Added TurbulenzServices.onGameSessionClosed property to detect when a gamesession has been closed remotely.
- Added closeExistingSessions option to the Tic-Tac-Toe app.

2014-04-03

- Added addWebsocket function to the NetworkLatencySimulator
- Added missing normalized `VERTEXFORMAT_` values to the GraphicsDevice documentation
- Added frustum planes and frustum points order to the Camera documentation
- Added createGlobalSource to SoundDevice for creating global sound sources like music.
- Added methods to Draw2DSprite to set RGB and Alpha color components.
- Added destroy method to CharacterController.
- Added setColorTexture0, setColorTexture1, setColorTexture2, and setColorTexture3 methods to RenderTarget.
- Added support for 16-bit (aka half float) and 32-bit floating-point texture formats
  PIXELFORMAT_RGBA16F, PIXELFORMAT_RGB16F, PIXELFORMAT_RGBA32F and PIXELFORMAT_RGB32F.
  Use `graphicsDevice.isSupported("TEXTURE_HALF_FLOAT")` or `graphicsDevice.isSupported("TEXTURE_FLOAT")`
  to check for hardware support.
- Added m43MulM33 function to MathDevice.

Version 1.3.1
-------------

2014-03-07

- Modified simplerendering.cgfx to not use structs (feature not yet implemented in IE11)
- Updated TypeScript documentation for 0.9.1
- Remapped semantics for devices with fewer than 16 vertex attributes
- Updated gamepad detection to support latest specification
- Updated fontManager documentation
- Minor fix to subtitles sample
- Correction of various tslint errors
- Fixed an issue in the SoundDevice when gain was ignored on a source before playing
- Updated AssetCache to version 2:

  * Includes a new 'get' function
  * Modified 'request' behavior to include a callback
  * Improved speed and memory allocations
  * Improved handling of the case where assets are forced out during loading

- Fixed WebGL extension checking to avoid warnings in Firefox
- Fixed mipmap initialization and debug checking
- Fixed fontmanager mipmaps enabled by default
- Fixed wireframe drawing of triangle strips
- Fixed mime-type for mp3 files in SoundDevice
- SoundDevice improvements for playing/stoping sources
- Added node pool and extents to reduce number of ArrayBuffers in AABBTree
- Various memory saving optimizations for scenes, sounds, physics, forward rendering
- Enabled tslint and fixed basic errors on tslib
- TypeScript files can now be linted by using the command:
  python manage.py check-ts path/to/file.ts
- Fixed node extents update when removing its last renderable or its last light.
- Added support for building tools with Visual Studio 2013
- Line spacing support in FontManager

Version 1.3
-----------

2014-02-11

- Added subtitles sample:

  * Demonstrates the creation of subtitles from multiple languages
  * Example shows English and Japanese variants
  * Added support for 8bit font rendering in font.cgfx

- Added FontManager support for multiple pages:

  * New properties *linesWidth* and *glyphCounts* added to the object returned by fontManager.calculateTextDimensions
  * Added argument *dimensions* to font.calculateTextDimensions
  * Replaced generateTextVertices function by generatePageTextVertices, now with page
    compatibility
  * Added argument *pageIdx* to font.drawTextVertices
  * Added argument *dimensions* to font.drawTextRect

- Modified FontManager to use tri-strip instead of fan for single characters. Temporary fix for IE11.
- PhysicsManager optimisations
- Update protolib library (version 0.2.1):

- Added closeExistingSessions option to TurbulenzServices.createGameSession function.
- Added TurbulenzServices.onGameSessionClosed property to detect when a gamesession has been closed remotely.
- Added closeExistingSessions option to the Tic-Tac-Toe app.
  * Corrected 2D text rendering order
  * Added additional advanced callbacks/modified call back behavior

- Fixed an issue in draw2D where sprites were incorrectly scaled around the origin
- Added debug assertion for draw2D when npot textures are used with mipmaps not supported
- Fixed missing copyright comments
- Add viewBox transforms to svg implementation
- Fixed the handling of gamesession create to treat 404s as if services are unavailable
- Request handler now retries if 504 responses are encountered instead of failing immediately
- Improved handling of non-JSON responses to API requests
- Added support for tar files to deps.yaml and build process
- General improvements to the soundDevice for stability and the process of incorrectly loaded files
- Performance improvements to asset loading, especially for large files
- Work-around fixes to support IE11 for incomplete WebGL specification
- New feature: GPU-based particle system for high-performance particles simulated on the graphics card

  * High level particle system API for managing the creation and destruction of particles systems from particle archetypes
  * Low level particle system API for controlling the updating of the particles on the GPU
  * Plug-in architecture allowing high level of customization to the particle simulation
  * A sample demonstrating the features of the GPU particle system
  * Comprehensive documentation explaining the API and architecture including diagrams

- Various documentation corrections
- Added support to the Camera for specifying the near/far plane to getFrustumFarPoints, getFrustumPoints, getFrustumExtents query
- Payment support for iOS/Android
- Fix for jointMax being infinity in Physics2D Debug Draw
- Updated device_initialization to output to console for fullscreen apps
- Exposed the ability for the Graphics Device to be created with disabled stencil and depth buffers
- Fixed an animation issue in addTime() for animations with zero length
- Fixed an processing issue for cubemaps with a single mipmap level
- Added scene extents to the viewer scene metrics
- Improvements to fullscreen implementation (also supports IE11)
- Improvements to DDS loader image processing
- Removed usage of deprecated event property "event.keyLocation" in the Input Device
- Added check when using Workers for processing DDS textures on unsupported platforms
- Added support for proposed canvas API resetTransform to canvas.js
- Updated documentation about developer clients
- Deprecated the *plugin-debug* build.  Sample apps no longer ship in this configuration.
- Fixed tools build under clang 3.3
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
