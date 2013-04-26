.. index::
    single: GameSession

.. _gamesession:

.. highlight:: javascript

----------------------
The GameSession Object
----------------------

The GameSession object represents the user's current game session, it contains a unique string that the Turbulenz Services use to identify the user and the game they are playing.
The object is required by the majority of the :ref:`TurbulenzServices <turbulenzservices>` methods and associates the created objects with the GameSession.
The GameSession object can be used to retrieve a :ref:`mapping table <mappingtable>` and application settings for the current game.

The game can also attach metadata to the current game through the :ref:`setTeamInfo <gamesession_setteaminfo>` and :ref:`setPlayerInfo <gamesession_setplayerinfo>` functions.
This metadata can be used to display scores, ranks and other information to the user through the game site.

A GameSession object can be created with the :ref:`TurbulenzServices.createGameSession <turbulenzservices_creategamesession>` method.

Any created game session older than a few days will be automatically destroyed when the Local server is started.
The Hub and game site automatically destroy any game sessions a week after their last TurbulenzService API request.
You must create only one GameSession object and always call its :ref:`destroy <gamesession_destroy>` in :ref:`TurbulenzEngine.onunload <turbulenzengine_unload>`.

**Required scripts**

The ``GameSession`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/gamesession.js") }}*/
    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/

Methods
=======

.. index::
    pair: GameSession; setTeamInfo

.. _gamesession_setteaminfo:

`setTeamInfo`
-------------

**Summary**

Set the ordered list of teams in the game

**Syntax** ::

    var teamlist = ['Team A', 'Team B', 'Observers']
    gameSession.setTeamInfo(teamlist);

``teamlist``
    An array of strings giving the list of teams in the order they will be displayed on the game site.

If teams are used within the game then the use of this function to specify team ordering is recommended.
If the game does not use teams then it is not necesarry to call this function.
Teams with no current members will not be displayed so this function may be called once at the start of the game to give the ordering for all teams.

.. index::
    pair: GameSession; setPlayerInfo

.. _gamesession_setplayerinfo:

`setPlayerInfo`
---------------

**Summary**

Set the per-player info to be displayed by the game site

**Syntax** ::

    var playerInfo = {
        color: "red",
        status: "playing as Medic in area 51",
        rank: "14th",
        score: "$350",
        team: "Team A",
        sortkey: "14",
    };
    // A full update of player info
    gameSession.setPlayerInfo(playerId, playerInfo);
    // A partial update of player info
    gameSession.setPlayerInfo(playerId, {score: "$450"});

``playerId``
    The playerId returned by the :ref:`UserProfile.username <userprofile_username>` function.

``playerInfo``
    An object whose properties are used to set the current player's info.
    The currently supported info fields are:

    * color: The player's color as a sting in any web format (i.e. ``'red'``, ``'#ff0000'`` or ``'#f00'``)
    * status: The player's status as a string. The status may be relatively detailed, but should be less than about 250 characters
    * rank: The player's rank as a string.
    * score: The player's score as a string.
      Formatting should be applied (i.e. ``'5m30s'``, ``'66 coins'``, ``'3.254m'``).
      Scores should be less than 8 characters long
    * team: The name of the team that the player is in.
      If a team-list has been specified in :ref:`GameSession.setTeamInfo <gamesession_setteaminfo>` this name should match one the specified names exactly.
    * sortkey: A string which will be used to sort player order for display on the game site (sort order is ascending).
      If teams are used then sorting will only occur within a team group.

This function allows player data such as current score, team, rank, color and status to be displayed by the game site.

Calling this function will add or update the specified fields.
To remove all fields which have been previously set, :ref:`GameSession.removePlayerInfo <gamesession_removeplayerinfo>` should be called

.. index::
    pair: GameSession; removePlayerInfo

.. _gamesession_removeplayerinfo:

`removePlayerInfo`
------------------

**Summary**

Removes the stored info for a player

**Syntax** ::

    gameSession.removePlayerInfo(playerId);

This function will remove all data for the specified player that was set with :ref:`GameSession.setPlayerInfo <gamesession_setplayerinfo>`

.. index::
    pair: GameSession; clearAllPlayerInfo

.. _gamesession_clearallplayerinfo:

`clearAllPlayerInfo`
--------------------

**Summary**

Removes the stored info for all players

**Syntax** ::

    gameSession.clearAllPlayerInfo();

This function will remove all data for the all players that was set with :ref:`GameSession.setPlayerInfo <gamesession_setplayerinfo>`

.. index::
    pair: GameSession; destroy

.. _gamesession_destroy:

`destroy`
---------

**Summary**

Destroy a GameSession.

**Syntax** ::

    //example usage:
    gameDestroy = function gameDestroyFn()
    {
        // destroy Turbulenz engine and JavaScript library objects
        ...

        // first destroy all objects that require the gameSession
        mappingTable = null;
        userDataManager = null;
        leaderboardManager = null;
        gameSession.destroy();
        gameSession = null;
    };

    TurbulenzEngine.onunload = gameDestroy;

Once this is called, all objects that take a GameSession object parameter on construction will no longer work, therefore it is advisable to destroy any such objects before calling ``destroy``.
