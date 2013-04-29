.. _turbulenz_services_game_data:

================================
The Turbulenz Services Game Data
================================

There are 3 services for saving or sharing game data:
:ref:`user data <userdatamanager>`,
:ref:`game profiles <gameprofilemanager>` and
:ref:`data shares <datasharemanager>`.
In general, these services should be used as follows:

- :ref:`User data <userdatamanager>` - Storing save game data that is only intended for the current player to read
  (e.g. items in inventory, player position, levels completed).
  This consists of a private key-value store.

- :ref:`Game profiles <gameprofilemanager>` - A short game profile summary of the current player (e.g. xp, level, alliance).
  This consists of a single short string store that can be read by any other user's game.
  Up to 64 user's game profiles can be retrieved in one request.

- :ref:`Data shares <datasharemanager>` - Shared game state for turn based games, user generated content or asynchronous multiplayer events.
  Some examples are:

  - Chess (turn based) or Diplomacy (concurrent turn based).

  - Sharing customizable characters (user generated content).

  - Attacking another user's base while they are offline (asynchronous multiplayer events).

  Multiple data share objects can be created per user, one for each multiplayer game they are currently playing.
  Each data share object consists of a public key-value store that can be read from or written to by other user's games.
  The :ref:`data shares <datasharemanager>` API is the most complex of the game data API's and you should always try to use
  the :ref:`user data <userdatamanager>` API or the :ref:`game profiles <gameprofilemanager>` API if possible.
