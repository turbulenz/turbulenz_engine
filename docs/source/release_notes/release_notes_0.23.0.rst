--------------------
Turbulenz SDK 0.23.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.23.0 is an update for both the Turbulenz Engine
Installer and SDK components.

Change List
===========

New Features
------------

* Leaderboard :ref:`aggregate scores, average and number of users <leaderboardmanager_aggregates>` have been added.

Changes
-------

* Support for Internet Explorer 10 has now been added.

* Support has been added in Turbulenz Services for play before sign-in.
  Games that are built with this version of the SDK will automatically support play before sign-in, when available on turbulenz.com

Fixed
-----

* In previous versions, calls to Turbulenz.setInterval() in plugin
  mode could generate callbacks at 60Hz independent of the interval
  value passed in.  This has been fixed.

* The previous version of the Turbulenz Engine installer (0.22.0) for
  Mac OS X unconditionally replaces parts of existing plugins, even if
  a newer plugin is already installed.  This has been fixed, but users
  installing 0.22.0 *after* later versions of the engine should be
  aware of this behavior and should ensure that they (re)install the
  newest Turbulenz Engine *after* 0.22.0 if they wish to continue
  using the 0.22.0 engine alongside newer versions.

* Callbacks from the `NetworkDevice` are now called asynchronously,
  fixing an inconsistency between the canvas and plugin versions.

* Sending of websocket data >8kb was being incorrectly buffered in the plugin (T1221)

Known Issues
============

New
---

* An implementation difference between canvas and plugin GraphicsDevice implementations has been observed:

    * WebGL clears the back buffer after a present.
    * WebGL clears all created buffers.

    Not all platforms will demonstrate the same behaviour in the plugin.
    To ensure consistent behaviour you should clear all relevant buffers and not rely on the WebGL behaviour.

    For more information see :ref:`Graphics Device <graphicsdevice>`

* SVG sample fails to run in Internet Explorer 10

Unchanged
---------

For a list of current known issues see the :ref:`known issues section <known_issues>`.
