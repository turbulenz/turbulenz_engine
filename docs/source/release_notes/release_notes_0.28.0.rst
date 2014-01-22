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

* turbulenz_engine - 1.2
* turbulenz_tools - 1.0.3
* turbulenz_local - 1.1.3

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

Fixed
-----

* Placeholder

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
