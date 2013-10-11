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

* - Added :ref:`onperformancewarning <turbulenzengine_onperformancewarning>`
  callback to flag code that is likely to be sub-optimal.  In
  particular, developers planning to target mobile devices should
  consider using this to help avoid performance issues.

Changes
-------

* The pacakaged Local server has been updated to version 1.1.3 for a detailed list of changes see
  `turbulenz_local changelog <https://github.com/turbulenz/turbulenz_local/blob/1.1.3/CHANGES.rst>`__

* The pacakaged Turbulenz Python tools have been updated to version 1.0.3 for a detailed list of changes see
  `turbulenz_tools changelog <https://github.com/turbulenz/turbulenz_tools/blob/1.0.3/CHANGES.rst>`__

* The JavaScript `VMath` global is no longer always the same object as
  `MathDevice` (returned by `TurbulenzEngine.getMathDevice()`).  In
  particular, in the canvas-debug build configuration they are now
  distinct objects (albeit with the same interface).  This is intended
  to help catch errors that may only appear on certain platforms.

* `MathDevice` now includes type checks in canvas-debug mode, to catch
  cases where developers use the sub-optimal Array types.  (Note that
  `VMath` is intended to accept either Array or Float32Array
  arguments, whereas `MathDevice` expects all arguments to be
  Float32Array, which results in much faster execution).  At this
  stage, developers must implement the
  :ref:`turbulenz_onperformancewarning` callback to receive these
  warnings.  This behaviour may change in future versions.

* All native-implemented math types (Vector3, Vector4, Matrix33, etc)
  have been removed and replaced by Float32Arrays.  This, along with
  the other math changes, greatly improve consistency across
  platforms.

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
