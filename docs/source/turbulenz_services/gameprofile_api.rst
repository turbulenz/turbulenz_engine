.. index::
    single: GameProfileManager

.. _gameprofilemanager:

.. highlight:: javascript

-----------------------------
The GameProfileManager Object
-----------------------------

The GameProfileManager object is an API for setting a public game profile and retrieving other users' game profiles.
Each user has a public game profile string (typically a JSON string) that can be retrieved by any other user playing the same game.
This public profile can be used to hold a small amount of game specific information, for example: level, XP, favorite weapon, ... .
The manager allows retrieving multiple users' game profiles in one request using
the :ref:`gameProfileManager.getList <gameprofilemanager_getlist>` API.

The game profile string is persistent and can be read by any other user after the current user's game has closed.

GameProfileManager shouldn't be confused with :ref:`userdata <userdatamanager>` (for save games and game preferences)
, :ref:`badges <badgemanager>` (for achievements) or :ref:`leaderboards <leaderboardmanager>` (for high scores).

**Required scripts**

The ``GameProfileManager`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/
    /*{{ javascript("jslib/services/gameprofilemanager.js") }}*/

Usage guidelines
================

The GameProfileManager is for retrieving a small profile string (typically a JSON string).
The profile string must be smaller than 1KB in order to limit the size of responses from
the :ref:`gameProfileManager.getList <gameprofilemanager_getlist>` API since up to 64 users can be requested simultaneously.

Any strings stored will need to be localized by game logic as users of any language can read the user's game profile.

Examples
========

Setting the current user's game profile value::

    function callbackFn()
    {
        Utilities.log('Game profile set');
    }
    var userStats = {
        'level': 14,
        'xp': 134800
    };
    gameProfileManager.set(JSON.stringify(userStats), callbackFn);

Getting another user's game profile value::

    function callbackFn(username, gameProfile)
    {
        if (gameProfile.value)
        {
            var otherUsersStats = JSON.parse(gameProfile.value);
            Utilities.log(username + ':');
            Utilities.log('level: ' + otherUsersStats.level);
            Utilities.log('XP: ' + otherUsersStats.xp);
        }
    }
    gameProfileManager.get('dave', callbackFn);

Getting a group of user's game profile values::

    function callbackFn(gameProfiles)
    {
        var username;
        for (username in gameProfiles)
        {
            if (gameProfiles.hasOwnProperty(username))
            {
                var gameProfile = gameProfiles[username];
                if (gameProfile.value)
                {
                    var otherUsersStats = JSON.parse(gameProfile.value);
                    Utilities.log(username + ':');
                    Utilities.log('level: ' + otherUsersStats.level);
                    Utilities.log('XP: ' + otherUsersStats.xp);
                }
            }
        }
    }
    gameProfileManager.getList(['dave', 'bob', 'ben'], callbackFn);

.. _gameprofile_leaderboards_example:

A more advanced example showing how to add additional information to the leaderboards::

    var currentLeaderboardsResult;
    var gameProfiles = {};
    var displayLeaderboard = function displayLeaderboardFn()
    {
        if (currentLeaderboardsResult)
        {
            var leaderboardString = leaderboardManager.meta[currentLeaderboardsResult.key].title + '\n';

            var view = currentLeaderboardsResult.getView();
            var ranking = view.ranking;
            var numScores = ranking.length;
            var i;

            for (i = 0; i < numScores; i += 1)
            {
                var row = ranking[i];
                var username = row.user.username;
                leaderboardString += row.rank + ',';
                leaderboardString += username + ',';
                leaderboardString += row.score + ',';
                if (gameProfiles.hasOwnProperty(username))
                {
                    var gameProfile = JSON.parse(gameProfiles[username].value);
                    leaderboardString += gameProfile.level + ',';
                    leaderboardString += gameProfile.xp;
                }
                leaderboardString += '\n';
            }

            Utilities.log(leaderboardString);
        }
    };

    var gameProfileManager = GameProfileManager.create(requestHandler, gameSession);

    var onSlidingWindowUpdate = function onSlidingWindowUpdateFn()
    {
        if (currentLeaderboardsResult)
        {
            // request profiles for the entire sliding window (all of the results from the current response)
            // as this is more efficient (only 1 game profile request per leaderboard request)
            var slidingWindow = currentLeaderboardsResult.getSlidingWindow();
            var ranking = slidingWindow.ranking;
            var numScores = ranking.length;

            var users = [];
            var i;
            for (i = 0; i < numScores; i += 1)
            {
                var username = ranking[i].user.username;
                if (!gameProfiles.hasOwnProperty(username))
                {
                    users.push(username);
                }
            }

            var onGameProfileList = function onGameProfileListFn(newGameProfiles)
            {
                var u;
                for (u in newGameProfiles)
                {
                    if (newGameProfiles.hasOwnProperty(u))
                    {
                        gameProfiles[u] = newGameProfiles[u];
                    }
                }
                displayLeaderboard();
            };
            if (users.length > 0)
            {
                gameProfileManager.getList(users, onGameProfileList);
            }
        }
    };

    function onLeaderboardResult(key, leaderboardResult)
    {
        currentLeaderboardsResult = leaderboardResult;
        onSlidingWindowUpdate();
        leaderboardResult.onSlidingWindowUpdate = onSlidingWindowUpdate;
    }

    var onScrollUpClicked = function onScrollUpClickedFn()
    {
        currentLeaderboardsResult.scrollUp(displayLeaderboard);
    };

    var onScrollDownClicked = function onScrollDownClickedFn()
    {
        currentLeaderboardsResult.scrollDown(displayLeaderboard);
    };

    var spec = {
        type: 'near',
        size: 5
    };
    leaderboardManager.get('score', spec, onLeaderboardResult);

Constructor
===========

.. index::
    pair: GameProfileManager; create

.. _gameprofilemanager_create:

`create`
--------

**Summary**

Creates a GameProfileManager object.

**Syntax** ::

    var gameProfileManager = GameProfileManager.create(requestHandler, gameSession, defaultErrorCallbackFn);

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``gameSession``
    A :ref:`GameSession <gamesession>` object.

``defaultErrorCallbackFn`` :ref:`(Optional) <turbulenzservices_errorcallbackfn>`
    The default :ref:`error callback function <gameprofilemanager_errorcallback>` that is called for any GameProfileManager
    functions that do not specify their own error callback function.

Returns a GameProfileManager object or if the Turbulenz Services are unavailable returns ``null``.

Methods
=======

.. index::
    pair: GameProfileManager; get

.. _gameprofilemanager_get:

`get`
-----

**Summary**

Get a user's game profile by username.

**Syntax** ::

    function callbackFn(username, gameProfile) {}
    gameProfileManager.get(username, callbackFn, errorCallbackFn);

    // example usage:
    gameProfileManager.get('dave', callbackFn);

``username``
    A JavaScript string.
    The username of the profile to retrieve.

``callbackFn``
    A JavaScript function.
    Called on receipt of the request from the Turbulenz Services.
    With the following arguments:

    ``username``
        A JavaScript string.
        The username of the profile retrieved.

    ``gameProfile``
        ``null`` if the ``username`` does not exist.
        Otherwise, a JavaScript object with the following format:

        ``value``
            A JavaScript string.
            The user's game profile value.

``errorCallbackFn`` :ref:`(Optional) <gameprofilemanager_errorcallback>`

.. index::
    pair: GameProfileManager; getList

.. _gameprofilemanager_getlist:

`getList`
---------

**Summary**

Get a list of users' game profiles by usernames.

**Syntax** ::

    function callbackFn(gameProfiles) {}
    var ok = gameProfileManager.getList(usernames, callbackFn, errorCallbackFn);

    // example usage:
    function callbackFn(gameProfiles) {
        var username;
        for (username in gameProfiles)
        {
            if (gameProfiles.hasOwnProperty(username))
            {
                Utilities.log(username + ': ' + gameProfiles[username].value);
            }
        }
    }

    gameProfileManager.getList(['dave', 'ben', 'bob'], callbackFn);

``usernames``
    A JavaScript array of strings.
    The usernames of the profiles to retrieve.
    This list should contain no more than :ref:`GameProfileManager.maxGetListUsernames <gameprofilemanager_maxgetlistusernames>` usernames.

``callbackFn``
    A JavaScript function.
    Called on receipt of the request from the Turbulenz Services.
    With the following arguments:

    ``gameProfiles``
        A JavaScript dictionary with usernames for keys and values as objects with the following format:

        ``value``
            A JavaScript string.
            The user's game profile value.

``errorCallbackFn`` :ref:`(Optional) <gameprofilemanager_errorcallback>`

The ``gameProfiles`` array retrieved might **not** be in the same order as the ``usernames`` requested.
Users will not be returned in the ``gameProfiles`` array if:

- There is no user with that username.
- The user has not played the game.
- The user's game has not yet called :ref:`set <gameprofilemanager_set>`.
- The user's game has called :ref:`remove <gameprofilemanager_remove>`.

If ``usernames`` length is greater than :ref:`GameProfileManager.maxGetListUsernames <gameprofilemanager_maxgetlistusernames>` this function will
return ``false`` and neither ``callbackFn`` or ``errorCallbackFn`` will be called.
Otherwise, this returns ``true``.

.. index::
    pair: GameProfileManager; set

.. _gameprofilemanager_set:

`set`
-----

**Summary**

Set the current user's game profile string.

.. note:: This is an :ref:`encrypted API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn() {}
    var ok = gameProfileManager.set(value, callbackFn, errorCallbackFn);

``value``
    A JavaScript string.
    The value for this key.
    If the value is an empty string (``null``, ``undefined``, or ``""``) then a remove operation is applied.
    This means that when a :ref:`get <gameprofilemanager_get>` is called after an empty string is set then ``null`` is returned.
    This string must not be greater than :ref:`GameProfileManager.maxValueSize <gameprofilemanager_maxvaluesize>` characters.

``callbackFn``
    A JavaScript function.
    Called on successful write of the key-value.

``errorCallbackFn`` :ref:`(Optional) <gameprofilemanager_errorcallback>`

If ``value`` is too large to set this function returns ``false`` and neither ``callbackFn`` or ``errorCallbackFn`` will be called.
Otherwise, this returns ``true``.

This sets the current user's game profile string to ``value``.
If the current user's game profile string is already set then this overwrites the profile string.

.. index::
    pair: GameProfileManager; remove

.. _gameprofilemanager_remove:

`remove`
--------

**Summary**

Remove the current user's game profile.

.. note:: This is an :ref:`encrypted API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(key) {}
    gameProfileManager.remove(callbackFn, errorCallbackFn);

``callbackFn``
    A JavaScript function.
    Called on receipt of the request from the Turbulenz Services.

``errorCallbackFn`` :ref:`(Optional) <gameprofilemanager_errorcallback>`

Properties
==========

.. index::
    pair: GameProfileManager; maxValueSize

.. _gameprofilemanager_maxvaluesize:

`maxValueSize`
--------------

**Summary**

The max size of a ``value`` string for :ref:`gameProfileManager.set <gameprofilemanager_set>`.

**Syntax** ::

    var maxValueSize = gameProfileManager.maxValueSize;

This is set to 1024.

.. note::
    This property is read only.

.. index::
    pair: GameProfileManager; maxGetListUsers

.. _gameprofilemanager_maxgetlistusernames:

`maxGetListUsernames`
---------------------

**Summary**

The max length of the ``usernames`` array for :ref:`gameProfileManager.getList <gameprofilemanager_getlist>`.

**Syntax** ::

    var maxGetListUsernames = gameProfileManager.maxGetListUsernames;

This is set to 64.

.. note::
    This property is read only.

.. index::
    pair: GameProfileManager; service

.. _gameprofilemanager_service:

`service`
---------

**Summary**

The :ref:`ServiceRequester <servicerequester>` object for the ``gameProfile`` service.

**Syntax** ::

    var serviceRequester = gameProfileManager.service;

.. _gameprofilemanager_errorcallback:

Error callback
==============

**Summary**

A JavaScript function.
Returns an error message and its HTTP status.

**Syntax** ::

    function errorCallbackFn(errorMsg, httpStatus, calledByFn, calledByParams) {}

``httpStatus``
    A JavaScript number.
    You can find a list of common status codes here - http://en.wikipedia.org/wiki/List_of_HTTP_status_codes

``calledByFn``
    A JavaScript function.
    The function that threw the error.

``calledByParams``
    A JavaScript array of the parameters given to the function that threw the error.
