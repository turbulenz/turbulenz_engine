--------------------
Turbulenz SDK 0.26.1
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.26.1 is an update for both the Turbulenz Engine
Installer and SDK components.

Packaged Components
===================

The following versions of Turbulenz products are packaged in this SDK:

* turbulenz_engine - 1.1
* turbulenz_tools - 1.0.1
* turbulenz_local - 1.1.1

Change List
===========

New Features
------------

**0.26.0**

* Added :ref:`multiple logins to local <multiple_logins>`.
  The login button on the top right of the local server page allows you to quickly switch between users.
  The current user is stored as a cookie.
  This cookie will be shared across the tabs on your browser.
  To login as multiple users simultaneously either:

  - Use different browsers for each user.
  - Use private browsing or "Incognito mode" windows for each user (requires logging in again each time).
  - Set up multiple users in Chrome - http://support.google.com/chrome/bin/answer.py?hl=en&answer=2364824
  - Set up multiple profiles in Firefox - http://support.mozilla.org/en-US/kb/profile-manager-create-and-remove-firefox-profiles

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
  Features include:

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

  *SDK 0.26.0 contains BETA version 0.2 of Protolib. See the* :ref:`Protolib <protolib_introduction>` *for more details.*

* Added two example app structures for building Protolib apps.

  - *Protolib Sample App (apps/protolibsampleapp)* - Demonstrates a wide range of API used together. The purpose is to show how to use the API for rapid prototyping.
  - *Protolib Template App (apps/protolibtemplateapp)* - A basic template structure for a blank app. This app provides a skeleton structure with init, update and destroy functions. The template can be copied and used as a basis to start building an app from scratch.

* Added :ref:`GraphicsDevice  <graphicsdevice>` :ref:`finish <graphicsdevice_finish>` and :ref:`flush <graphicsdevice_flush>`.
* Added :ref:`ShaderManager  <shadermanager>` :ref:`setAutomaticParameterResize <shadermanager_setautomaticparameterresize>`.

Changes
-------

**0.26.0**

* Open source repository changes have been integrated into the SDK.
  This includes various changes to the repository layout and packaging/rebuilding of tools.
  In most cases the changes to the layout of SDK and its content should not have drastically changed.
  The method for invoking certain tools might be slightly different.

* Local server is now distributed as a `turbulenz_local python package <https://pypi.python.org/pypi/turbulenz_local>`_, which can be downloaded from pypi.
  In the SDK, these packages are downloaded and included in the installer.
  To update to a later local server:

  1) Start the environment
  2) Type: easy_install -U -Z turbulenz_local>=X.X.X
     where X.X.X is the required minimum version.

  Each SDK will bundled with a compatible version of the local server.
  Check compatibility before updating to the latest server.

  To import local server directly from python, you should now use: 'turbulenz_local.*'.

* Local server is now started differently.
  The old command 'paster serve release.ini' has been replaced by 'local_server --init' followed by 'local_server --launch'.
  For SDK users, using the start_local.sh and run_devserver.bat commands, no changes are required.
  See the `turbulenz_local readme <https://github.com/turbulenz/turbulenz_local/blob/master/README.rst>`__ for more details.

* Turbulenz tools are now distributed as a `turbulenz_tools python package <https://pypi.python.org/pypi/turbulenz_tools>`_, which can be downloaded from pypi.
  In the SDK, these packages are downloaded and included in the installer.
  To update to a later tools package:

  1) Start the environment
  2) Type: easy_install -U turbulenz_tools>=X.X.X
     where X.X.X is the required minimum version.

  Each SDK will bundled with a compatible version of the tools.
  Check compatibility before updating to the latest tools.

  To import tools directly from python, you should now use: 'turbulenz_tools.tools.*'.

* The viewer is now a standalone application. Models, animations, etc can be viewed directly from the application if the base asset URL and asset file are correctly selected.
  When browsing the assets, any assets that can be viewed will launch the viewer application.
  This will allow developers to easily find the viewer and try it out on their models.
  The viewer now has canvas-debug, canvas, plugin-debug, plugin modes.

* Performance improvements to the renderers, mainly about reducing CPU cost when preparing the renderables for rendering.
* Performance improvements to the 2D canvas API.

* Local server now remembers the user's hub password when deploying a game:

  1) When logging into the hub, click the 'Remember me' checkbox.
  2) Once successfully authorized, the user that is logged in, will be written at the bottom right of the deploy dialog.
  3) When next pressing the deploy button, that user will automatically be logged in and the will go straight to the deploy dialog.
  4) Logging out, will forget the user's details.

* The deploy dialog layout has been improved.
  The list of previously deployed versions is now on the left hand side.
  On selecting this list, the version name is shown below so users can see what they have previously uploaded.
  Users can now upload on top of uploaded versions (provided they are unlocked) or create a version with a new name.
  If the version clashes they will be warned and asked if they want to overwrite the previous version.

* The local server now contains a "logged in as" field on the main page.
  This allows developers to test being logged in as a particular user with a given name, emulating the services provided by Turbulenz Hub and turbulenz.com.
  This now separates the data for badges, leaderboards, userdata, notifications.
  To change users read the instructions for :ref:`logging in multiple accounts <multiple_logins>`.

* Local server now has a common.ini and a release.ini/development.ini.
  The common file contains information that is required for both release and development.
  It is possible to overwrite settings from common in release/development by declaring the setting after the import of the common.ini.

* The default renderer's ``defaultPrepareFn`` will now switch to a default "flat" or "flat_skinned" technique if "diffuse" is not set on the technique parameters for a geometries material.

* Changes have been made to the :ref:`Mapping Table <mappingtable>` object.
  Certain undocumented properties are not longer available, if you previously used properties such as mappingTablePrefix, please note they are no longer available.

Fixed
-----

**0.26.1**

* Fixed an issue where certain usernames cause local server to fail with 500s. Fixed in turbulenz_local 1.1.1

**0.26.0**

* Various fixes for the viewer rendering.
* Addition fixes to the dae2json and obj2json importing.
* T1424 - Local does not remember the password when deploying a game from Local to Hub.

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
