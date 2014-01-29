--------------------
Turbulenz SDK 0.28.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.28.0 is an update for both the Turbulenz Engine
Installer and SDK components.

Packaged Components
===================

The following versions of Turbulenz products are packaged in this SDK:

* turbulenz_engine - 1.X
* turbulenz_tools - 1.0.X
* turbulenz_local - 1.1.X

Change List
===========

New Features
------------

* (**BETA**) Added an API for particle effects running on the GPU.
  Includes a :ref:`high-level <highlevelparticles_api>`, data-driven API
  exposed through the :ref:`ParticleManager <particlemanager>`
  object with verified data-input reporting semantic errors.
  The GPU particle API has support (for adventurous coders) to plug-in new
  modules to customize
  rendering, simulation and emittance of particles using the
  :ref:`low-level <lowlevelparticles_api>` API. See :ref:`Particle System
  <particlesystem>` for more information.
  The GPU particle API Works together with existing :ref:`Scene <scene>`
  and rendering objects.

* Added a sample *gpu_particles* demonstrating the high-level usage of the
  GPU particle API.

* Support for IE11. Work-around fixes have been added to allow the Turbulenz Engine to work due to an incomplete WebGL implementation. Once the WebGL 1.0 specification is completely implemented in IE11, the fixes will be removed.

* Payment support added for iOS/Android Turbulenz apps.
  Apps built using Turbulenz now allow in-app purchases to be triggered from the game.

* Minor features:

  - Added viewBox transforms to svg implementation
  - Added support for proposed canvas API resetTransform to canvas.js
  - Added support for tar files to deps.yaml and build process
  - Added support to the Camera for specifying the near/far plane to getFrustumFarPoints, getFrustumPoints, getFrustumExtents query
  - Exposed the ability for the Graphics Device to be created with disabled stencil and depth buffers
  - Added scene extents to the viewer scene metrics
  - Added check when using Workers for processing DDS textures on unsupported platforms
  - Added support for non-ascii characters in makehtml and maketzjs

Changes
-------

* The *plugin-debug* build mode has been deprecated.  The SDK no
  longer contains the *plugin-debug* version of any samples or apps,
  and developers should not rely upon support for this build mode in
  any tools.  The *canvas-debug* mode is the recommended way to use
  the browser debugging tools.

* Mac OS X 10.6 and Safari 5 are no longer officially supported.  This
  removes the need for any browser plugin on Mac OS X platforms, and
  so the *TurbulenzEngine* binary installers are no longer bundled
  with SDKs or available for download.

* Updated to Protolib (0.2.1).
  Minor changes include:

  - Corrected the rendering order of the :ref:`drawText <protolib-drawText>` function to occur after :ref:`draw2DSprite <protolib-draw2dsprite>` function.
  - Added new callback :ref:`setPreRendererDraw <protolib-setprerendererdraw>` and updated behavior of :ref:`setPreDraw <protolib-setpredraw>`

* General improvements to the soundDevice for stability and the process of incorrectly loaded files

* Updated documentation about developer clients.
  More information about the :ref:`iOS/Android Developer Client <developer_client_readme>` offerings.

* Minor changes:

  - Added debug assertion for draw2D when npot textures are used with mipmaps not supported
  - Request handler now retries if 504 responses are encountered instead of failing immediately
  - Improved handling of non-JSON responses to API requests
  - Updated device_initialization to output to console for fullscreen apps
  - Improvements to fullscreen implementation (also supports IE11)
  - Improvements to DDS loader image processing
  - Removed usage of deprecated event property "event.keyLocation" in the Input Device
  - Changed default materialColor and uvTransform setting behaviour in the renderers to set on the sharedMaterial
  instead of each renderable
  - Modified MIME types for tar/mp3 files required for IE11

Fixed
-----

* Fixed an issue in draw2D where sprites were incorrectly scaled around the origin

* Fixed missing urllib3 from tools/local packages

* Fixed missing copyright comments

* Fixed the handling of gamesession create to treat 404s as if services are unavailable

* Fix for jointMax being infinity in Physics2D Debug Draw

* Fixed an animation issue in addTime() for animations with zero length

* Fixed an processing issue for cubemaps with a single mipmap level

* Fixed support for multiple animation elements targeting the same attribute

* Fixed scale animation export when stored as separate axis components

* Fix dae2json referencing a legacy flat effect in the shaders


Known Issues
============

New
---

* The GPU particle API depends on non-standard WebGL feature
  (MAX_VERTEX_TEXTURE_IMAGE_UNITS)
  to be available. It is supported on most devices (with the exception of iOS).
  In order to use the GPU particle API, check if
  *graphicsDevice.maxSupported("VERTEX_TEXTURE_UNITS") >= 4*.
  There is currently no fallback available for unsupported platforms.

Unchanged
---------

For a list of current known issues see the :ref:`known issues section
<known_issues>`.
