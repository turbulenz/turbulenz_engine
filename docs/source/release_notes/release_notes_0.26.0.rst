--------------------
Turbulenz SDK 0.26.0
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.26.0 is an update for both the Turbulenz Engine
Installer and SDK components.


Change List
===========

New Features
------------

* Added the :ref:`DataShareManager <datasharemanager>` object for creating and finding :ref:`data share <datashare>` objects.
  Data shares are shared public key-value stores which allow games to share data with other users.
  For example, data shares could be used to store the game state of an asynchronous multiplayer game
  (allowing communication with users who are on-line or off-line) like Chess or Diplomacy.
* Added :ref:`NotificationsManager <notificationsmanager>` object for allowing games to send notifications to users to notify them of game specific events.
  Examples include:

  - 'Your construction is complete' (for a game where building things takes longer than a single play session).
  - 'You are under attack' (for a game where other players can attack a user that is not currently playing the game).
  - 'It’s your turn' (for a turn-based game).

  Notifications can be instant or time delayed and can be received by users even if the game that sent them is no longer running.
  For a detailed list of API see the :ref:`NotificationsManager <notificationsmanager>` object.

* Added a Tic-tac-toe app which demos how the :ref:`DataShareManager <datasharemanager>` and
  :ref:`NotificationsManager <notificationsmanager>` API's can be used in-game.
  Read the instructions for :ref:`logging in multiple accounts <multiple_logins>` in order to play.

* Added Protolib a 2D/3D library for prototyping games rapidly using higher level functions.
  Examples include:

  - Setting background color.
  - Modifying 3D camera position, direction, orientation, FOV, near/far planes.
  - Loading and drawing 2D Sprites, 3D Sprites, 3D Meshes.
  - Font rendering text for GUIs.
  - Debug rendering for 3D lines, spheres, cubes.
  - Lighting for the 3D scene including shadowrendering : ambient, spot, point.
  - State-based input for keyboard, mouse.
  - Play, pause, resume and stop for 3D sound with position, looping, pitch, min/max distance, rolloff.
  - Live manipulation and monitoring of variables with sliders.
  - Configurable functionality with parameters e.g. fonts, providing custom asset mapping, disabling of sound/shadows.

  **SDK 0.26.0 contains BETA version 0.2 of Protolib.**
  See the :ref:`Protolib <protolib_introduction>` for more details.

* Added two example app structures for building Protolib apps.
  - Protolib Sample App (apps/protolibsampleapp) - Demonstrates a wide range of API used together. The purpose is to show how to use the API for rapid prototyping.
  - Protolib Template App (apps/protolibtemplateapp) - A basic template structure for a blank app. This app provides a skeleton structure with init, update and destroy functions. The template can be copied and used as a basis to start building an app from scratch.


* Added :ref:`GraphicsDevice  <graphicsdevice>` :ref:`finish <graphicsdevice_finish>` and :ref:`flush <graphicsdevice_flush>`.
* Added :ref:`ShaderManager  <shadermanager>` :ref:`setAutomaticParameterResize <shadermanager_setautomaticparameterresize>`.


Changes
-------

* Open source repository changes have been integrated into the SDK.
  This includes various changes to the repository layout and packaging/rebuilding of tools.
  In most cases the changes to the layout of SDK and its content should not have drastically changed.
  The method for invoking certain tools might be slightly different.

* Local server is now distributed as a `python package <https://pypi.python.org/pypi/turbulenz_local>`_, which can be downloaded from pypi.
  In the SDK, these packages are downloaded and included in the installer.
  To update to a newer local server:

  1) Start the environment
  2) Type: easy_install -U turbulenz_local>=X.X.X
     where X.X.X is the required minimum version.

  Each SDK will bundled with a compatible version of the local server.
  Check compatibility before updating to the latest server.

 * Local server is now started differently.
   The old command 'paster serve release.ini' has been replaced by 'local_server --init' followed by 'local_server --launch'.
   For SDK users, using the start_local.sh and run_devserver.bat commands, no changes are required.
   See the `turbulenz_local readme <https://github.com/turbulenz/turbulenz_local/blob/master/README.rst>`__ for more details.

* Performance improvements to the renderers, mainly about reducing CPU cost when preparing the renderables for rendering.
* Performance improvements to the 2D canvas API.

Fixed
-----

Known Issues
============

New
---

There are no new known issues this release.

Unchanged
---------

For a list of current known issues see the :ref:`known issues section
<known_issues>`.
