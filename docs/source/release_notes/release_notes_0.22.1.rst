--------------------
Turbulenz SDK 0.22.1
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.22.1 is an update for both the Turbulenz Engine
Installer and SDK components.

Change List
===========

New Features
------------

**0.22.0**

* Turbulenz payments for local and the Hub is now supported (not yet supported for the Gamesite).
  To use the Turbulenz payments see the documentation for the :ref:`StoreManager <storemanager>` object.
  Please note that the Gamesite does not yet support payments.
  Any games published to the Gamesite should not use the :ref:`StoreManager <storemanager>` object.

* The :ref:`leaderboards.yaml <leaderboards_yaml>` now takes an optional set of default scores for the leaderboards.

* :ref:`Physics2DDevice <physics2ddevice>` object added for high performance 2D physics simulations with Turbulenz.
  This is a complete 2D physics engine built from the ground up, and optimised for JavaScript.

  Physics2D comes with 3 new samples: Physics2D, Physics2D-Constraints and Physics2D-Callbacks
  demonstrating the main features of Physics2D and co-operation with Draw2D library.

* Added 2D vector types and operations to :ref:`VMath <vmath>` and the :ref:`MathDevice <mathdevice>`.

* Badges now allow you to specify an optional ``predescription``, which if specified is used as the description
  until the badge is unlocked. See :ref:`Defining your game's badges <badges_yaml>`.

* Added :ref:`DebuggingTools <debuggingtools>` which allows data breakpoints to be set on object properties and array indices.

* :ref:`Transient IndexBuffers <graphicsdevice_createindexbuffer>` are now supported: this kind of IndexBuffer is optimized for dynamic single use geometries.

    * The only change required to use them is to set as true the parameter ``transient`` when creating the IndexBuffer.

* The Multiplayer functionality exposed via the :ref:`TurbulenzServices <turbulenzservices>` object has moved into the
  :ref:`MultiplayerSessionManager <multiplayersessionmanager>` object, please see the documentation for full details.

  The behaviour of the :ref:`createSession <multiplayersessionmanager_createsession>` function is different to the
  behaviour of the old ``createMultiplayerSession`` function and will now always create a new multiplayer session. If you
  want the old behaviour please use
  :ref:`joinOrCreateSession <multiplayersessionmanager_joinorcreatesession>`.

  The new functions :ref:`queryFriendsSessions <multiplayersessionmanager_queryfriendssessions>` and
  :ref:`joinAnySession <multiplayersessionmanager_joinanysession>` allow you to find friends' multiplayer sessions or
  join a friend's multiplayer session automatically.

  :ref:`getJoinRequestQueue <multiplayersessionmanager_getjoinrequestqueue>` replaces
  the previous methods for responding to multiplayer join requests originating from the game site.

* New user session information can be displayed on the gamesite. The API to add per-player meta-data is exposed on the
  :ref:`GameSession <gamesession>` object via the :ref:`setTeamInfo <gamesession_setteaminfo>` and
  :ref:`setPlayerInfo <gamesession_setplayerinfo>` functions.

* The DyanmicUI and BridgeServicesSimulator allow you to easily build powerful dynamic user interfaces and preview
  your integration into the games site while developing games on the local server or the Hub. A version of
  these tools is included in the MultiWorm sample provided with the SDK. To try them out in your own project simply copy
  across the contents of the js folder into your own project, add the file `duimanager.js` to your scripts directory,
  add `duimanager.css` to your css folder and add the following lines to the header of your html template::

    <link rel="stylesheet" type="text/css" href="css/dynamicui.css">
    <script type="text/javascript" src="js/jquery-1.7.1.js"></script>
    <script type="text/javascript" src="js/duiserver.js"></script>
    <script type="text/javascript" src="js/bridgeservice.js"></script>

Changes
-------

**0.22.0**

* The engine loader will now respect the engine version specified for your game.
  This can be done in the Manage tab for the game in the local development server or
  directly in the game's manifest file by adding the line (for instance with the
  current engine version)::

        engine_version: '0.22.0'

  For the game to be publishable, this engine version must be a three-part string
  (of the form X.Y.Z).

Fixed
-----

**0.22.1**

* In 0.22.0, the TurbulenzEngine.setInterval() function could ignore
  the specified time interval in some situations.  This has been fixed
  in 0.22.1.

**0.22.0**

* Fix for a deficiency in Draw2D for Draw2DSprite objects that previously assumed a 1:1 ratio between
  Draw2D coordinates and screen pixel coordinates. This previously led to a visible slack in updating of rotations when
  Draw2D viewport resolution was significantly smaller than that of the screen.

* The canvas version of SoundDevice no longer generates 404s on Firefox when sound source stop() is called.

* Input events now cause all callbacks to happen outside of the game
  loop in both canvas and plugin modes.  Previously canvas and plugin
  modes were inconsistent with some callbacks being made during the
  call to `InputDevice.update`.  Note that `InputDevice.update` should
  still be called to ensure all events are reliably delivered to the
  game.

* Fix for the :ref:`leaderboardResult <leaderboardresult>` scrolling
  functions throwing an exception when a callback argument is provided
  in TZJS and release builds.

* Fix for custom objects appearing as functions when passed from
  Safari to plugin JavaScriptEngine.

Known Issues
============

New
---

There are no new known issues this release.

Unchanged
---------

For a list of current known issues see the :ref:`known issues section <known_issues>`.
