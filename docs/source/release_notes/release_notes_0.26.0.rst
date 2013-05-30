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
* Added a Tic-tac-toe app which demos how the :ref:`DataShareManager <datasharemanager>` and
  :ref:`NotificationsManager <notificationsmanager>` API's can be used in-game.
  Read the instructions for :ref:`logging in multiple accounts <multiple_logins>` in order to play.
* Added :ref:`GraphicsDevice  <graphicsdevice>` :ref:`finish <graphicsdevice_finish>` and :ref:`flush <graphicsdevice_flush>`.
* Added :ref:`ShaderManager  <shadermanager>` :ref:`setAutomaticParameterResize <shadermanager_setautomaticparameterresize>`.

Changes
-------

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
