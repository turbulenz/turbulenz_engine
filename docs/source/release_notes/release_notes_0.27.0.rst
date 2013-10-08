--------------------
Turbulenz SDK 0.27.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.27.0 is an update for both the Turbulenz Engine
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

* - Added a :ref:`setProgress <loadingscreen_setprogress>` method to the LoadingScreen object.

* - Added a :ref:`additiveMatrix <textureeffects_additivematrix>` method to the TextureEffects object which allows transforming of the red, green and blue color channels.
    The ``additiveMatrix`` function is used in the textureeffects sample with new red, green and blue additive sliders.

* - Added the :ref:`TurbulenzEngine.onperformancewarning
  <turbulenzengine_onperformancewarning>` callback to code that is
  likely to be sub-optimal on lower-powered devices.  In particular,
  developers planning to target mobile devices should consider using
  this to avoid wasting memory and execution resources.

Changes
-------

* The pacakaged Local server has been updated to version 1.1.3 for a detailed list of changes see
  `turbulenz_local changelog <https://github.com/turbulenz/turbulenz_local/blob/1.1.3/CHANGES.rst>`__

* The pacakaged Turbulenz Python tools have been updated to version 1.0.3 for a detailed list of changes see
  `turbulenz_tools changelog <https://github.com/turbulenz/turbulenz_tools/blob/1.0.3/CHANGES.rst>`__

* All native-implemented math types (Vector3, Vector4, Matrix33, etc)
  have been replaced with Float32Arrays when the native implemented
  MathDevice is used.  Note that for most configurations, the
  MathDevice is simply the JavaScript global VMath object, which
  produces the fastest code when the JIT compilation is available.
  For those platforms (such as iOS) where JIT compilation is not
  available, the native implemented MathDevice results in faster
  execution.  This change greatly improves compatibility of the two
  implementations, and improves performance in the non-JIT case.

Fixed
-----

* Fixed background sound source bug in Protolib.

* Fixed a bug in the ForwardRendering skinned Blinn and flat techniques.

* Fixed a bug in Physics2D rayCast method.

* Added missing documentation from Physics2D Arbiter object.

* Fixed a bug in Scene when re-adding an un-modified root node.


Known Issues
============

New
---

* Importing tools/local server directly from Python has changed. Previously you could import them using 'turbulenz.tools.*' and 'turbulenz.devserver.*', now you must invoke them via 'turbulenz_tools.tools.*' and 'turbulenz_local.*'.
* Any manual changes to release.ini configuration files have to be manually applied to the release.ini, after first running the local server command for the first time, since the file needs to be generated.
* The default list of games in the local server flows onto the next page. You must click the arrow to scroll to the second page to see all applications.

Unchanged
---------

For a list of current known issues see the :ref:`known issues section
<known_issues>`.
