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


Changes
-------

* The pacakaged Local server has been updated to version 1.1.3 for a detailed list of changes see
  `turbulenz_local changelog <https://github.com/turbulenz/turbulenz_local/blob/1.1.3/CHANGES.rst>`__

* The pacakaged Turbulenz Python tools have been updated to version 1.0.3 for a detailed list of changes see
  `turbulenz_tools changelog <https://github.com/turbulenz/turbulenz_tools/blob/1.0.3/CHANGES.rst>`__


Fixed
-----

* Fixed background sound source bug in Protolib.

* Fixed a bug in the ForwardRendering skinned Blinn and flat techniques.

* Fixed a bug in Physics2D rayCast method.

* Added missing documentation from Physics2D Arbiter object.


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
