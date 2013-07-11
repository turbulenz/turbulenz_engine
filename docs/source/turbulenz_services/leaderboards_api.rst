.. index::
    single: LeaderboardManager

.. _leaderboardmanager:

.. highlight:: javascript

------------------------------
The LeaderboardManager Object
------------------------------

The ``LeaderboardManager`` object is an API for getting and setting leaderboard scores.

A ``LeaderboardManager`` object can be created by calling :ref:`TurbulenzServices.createLeaderboardManager <turbulenzservices_createleaderboardmanager>`.
None of the ``LeaderboardManager`` functions can be used until the :ref:`TurbulenzServices.createLeaderboardManager <turbulenzservices_createleaderboardmanager>`
``leaderboardsReceivedFn`` callback function has been called.

**Required scripts**

The ``LeaderboardManager`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/leaderboardmanager.js") }}*/

Leaderboards
============

**How leaderboards work**

A game can create multiple leaderboards to track and compare a player's score with other players of the game.
The different leaderboards need to be specified in a configuration file which is deployed to the Hub during development.
Each specified leaderboard can contain one score for each player that plays the game.
When a score is submitted using the API, only the player's best score is recorded.
Scores for each leaderboard must be numerical.
There is no upper limit to value that a leaderboard entry records other than the maximum representable numerical value.

In general there are two leaderboard types:

- Highest - The highest score achieved for a specific activity.
  For example, the highest score a player has achieved on a level.
- Cumulative - The total number of times a specific activity has been repeated.
  For example, total number of steps taken.

.. _ranking_system:

**Ranking system**

We use Standard competition ranking (http://en.wikipedia.org/wiki/Ranking) for leaderboards.
Leaderboards are ordered by highest or lowest score.

The ordering for scores is first by score and then time that the score was achieved (first player to achieve the score is highest).

**Security**

Security is important to make sure that players cannot cheat by altering the requests and responses that your game makes to our API.

All POSTs to the Leaderboards API are expected to be protected.
This means that any POST requests made must be encrypted and signed.
When using the LeaderboardManager this is handled automatically.

However, the GET requests to the Leaderboards API are **not encrypted or signed**.
This means that the responses that you get from the :ref:`getOverview <leaderboardmanager_getoverview>`
and :ref:`get <leaderboardmanager_get>` requests **cannot be trusted** and should only be displayed and not used internally.
You should not use the results of these requests to find a players score, instead you should track the players score using the :ref:`UserDataManager <userdatamanager>`.

**Limitations**

To avoid overloading the service, cumulative leaderboards that increment frequently should not be updated for each increment.
For example, if a leaderboard tracks the number of steps taken by the player in game, then you should avoid submitting a score for each step.
This could also seriously effect the performance of your game.
It is preferable to update these leaderboards on a less frequent interval (e.g. somewhere between every 1-10 minutes)
possibly at the same time as :ref:`saving your game <userdatamanager>`.

.. _leaderboards_yaml:

**Defining your game's leaderboards**

Leaderboards are defined with a ``leaderboards.yaml`` file.

.. highlight:: yaml

Here is an example file::

    - key: steps
      title: Total steps taken
      aggregate: true
      sortBy: 1
      icon256: img/Most Steps256.png
      icon48: img/Most Steps48.png
      icon32: img/Most Steps32.png
      default-scores:
        - user: bob
          score: 1000
        - user: bill
          score: 2000
        - user: ben
          score: 3000
        - email: barry@example.com
          score: 4000
        - email: brian@example.net
          score: 5000
        - email: boris@example.org
          score: 6000
        - email: bruce@example.edu
          score: 7000
    - key: best-level-time
      title: Best level time (seconds)
      sortBy: -1
      icon256: img/Best level time.png
      icon32: img/Best level time32.png
    - key: best-dm-kills
      title: Highest kills in deathmatch round
      sortBy: 1
      icon256: img/Best dm kills256.png

.. highlight:: javascript

The definition file is a dictionary of leaderboard definitions.
Each key in the dictionary is a leaderboard key which is used as a reference to the leaderboard for the LeaderboardManager API calls.
Keys in this system are restricted to alphanumeric characters separated by either hyphens or dots.

Each leaderboard definition contains:

``title``
    The title of the leaderboard.
    This is the title that is displayed on the Gamesite.

``sortBy`` (Optional)
    This can have two values -1 and 1.
    A value of 1 means that higher scores are better.
    A value of -1 means that lower scores are better.
    This will default to 1.

.. _leaderboardsyaml_aggregate:

``aggregate`` (Optional)
    Enable collection of :ref:`aggregates <leaderboardmanager_aggregates>` for this leaderboard.
    This will default to false.

.. _leaderboardsyaml_icon256:

``icon256``
    The relative path from the game directory to a :ref:`leaderboard icon <turbulenz_services_images_leaderboards>`.
    This is not required while debugging on Local and the Hub but must be included in order to publish to the Gamesite.
    These icons should be included in the deploy files for your game.
    The icon image should be 256x256 in PNG format.
    Please read :ref:`Turbulenz Services Assets <turbulenz_services_assets>` before creating your images.

.. _leaderboardsyaml_icon48:

``icon48`` (Optional)
    The relative path from the game directory to a :ref:`leaderboard icon <turbulenz_services_images_leaderboards>`.
    These icons are optional but recommended as our automatic resizing of the 256x256 pixel image might not give aethetically pleasing results.
    If set these icons should be included in the deploy files for your game.
    The icon image should be 48x48 in PNG format.
    Please read :ref:`Turbulenz Services Assets <turbulenz_services_assets>` before creating your images.

.. _leaderboardsyaml_icon32:

``icon32`` (Optional)
    The relative path from the game directory to a :ref:`leaderboard icon <turbulenz_services_images_leaderboards>`.
    These icons are optional but recommended as our automatic resizing of the 256x256 pixel image might not give aethetically pleasing results.
    If set these icons should be included in the deploy files for your game.
    The icon image should be 32x32 in PNG format.
    Please read :ref:`Turbulenz Services Assets <turbulenz_services_assets>` before creating your images.

``default-scores``
    A list of default scores for selected users.
    This can be used for testing your leaderboards on Local/Hub and to populate some target scores on the Gamesite.
    Make sure that these scores can be beaten before deploying the game to the Gamesite.
    These scores are reset to their defaults every time:

      - Leaderboards are reset.
      - The game is uploaded to the Hub.
      - The game is deployed to the Gamesite.

    However, the score can be changed by the user setting a better score after a reset.

    Each element of the default scores list is an object with the following properties:

    ``user`` or ``email`` (never both)
        The user to set to the default score.
        If email is used on the Hub and Gamesite then ``user`` will be looked up by email address.
        If email is used on Local then ``user`` is set to the local part of the address (everything before the @ symbol).
        On the Hub and Gamesite the user must exist or the score will be ignored.
        On the Hub the user must be a member of the game's project or the score will be ignored.

    ``score``
        The default score to set.
        The time of the score is the time that the score was reset.

This ``leaderboards.yaml`` file should be in the game directory and be added to the deploy files for the game.
The order of the keys in the ``leaderboards.yaml`` file is the order that the leaderboards will appear on the Gamesite.

.. warning::
    ``default-scores`` should only be used for changing scores for accounts owned by you.
    Please make sure when using ``user`` that you own the username used on both the Hub **AND** the Gamesite.

**Manually editing/removing leaderboards**

You can find the leaderboards in ``devserver/localdata/leaderboards/{game-slug}/{leaderboard-key}.yaml``.
Each file contains a list of the scores in the following example format::

    - score: 10.0
      time: 1346671479
      user: dave
    - score: 5.0
      time: 1346671526
      user: bob

The list is sorted by first best score.
The list will be resorted after a :ref:`leaderboardManager.set <leaderboardmanager_set>` request.

To edit the leaderboards stop the local server and then edit this file.
To remove all leaderboards for a game stop the local server and remove the ``devserver/localdata/leaderboards/{game-slug}`` directory.
If the leaderboard file is removed the :ref:`default user scores <leaderboards_yaml>` will be reinserted after the
first :ref:`leaderboardManager.set <leaderboardmanager_set>` request.

.. _leaderboardmanager_paging:

**Paging and scrolling**

Turbulenz provides a simple API for paging or scrolling through leaderboard results.
Any :ref:`leaderboardManager.get <leaderboardmanager_get>` request using our API is taken from the live data.
This means that the data retrieved can become stale very quickly.
For example, any of the users listed in a get request could, at any time, set a new score.
This when combined with paging can result in the following:

1. When switching between pages the ranks will not be consistent with the previous page.
   This can happen if other players beat the scores of the players on the first page therefore pushing their ranks down.
2. When paging up players can be duplicated if they improve their score between requests.

Because of these issues it is not recommended to:

- Cache the responses of :ref:`leaderboardManager.get <leaderboardmanager_get>` or
  the :ref:`LeaderboardResult <leaderboardresult>` functions for repeated use.
- Show the response of multiple API requests simultaneously.

The :ref:`pageUp <leaderboardresult_pageup>`,
:ref:`pageDown <leaderboardresult_pagedown>`,
:ref:`scrollUp <leaderboardresult_scrollup>` and
:ref:`scrollDown <leaderboardresult_scrolldown>`
functions use a sliding window of results to reduce the number of HTTP requests made while paging/scrolling.
To access the full set of results for :ref:`looking up game profiles <gameprofile_leaderboards_example>` use the
:ref:`leaderboardResult.getSlidingWindow <leaderboardresult_getslidingwindow>` function.
When a HTTP request is made the :ref:`leaderboardResult.onSlidingWindowUpdate <leaderboardresult_onslidingwindowupdate>` callback is called.
Please read the :ref:`example <leaderboardmanager_paging_example>` for paging leaderboards.

.. _leaderboardmanager_aggregates:

**Aggregates, number of users and averages**

If the :ref:`aggregate <leaderboardsyaml_aggregate>` flag is enabled in the :ref:`leaderboards.yaml <leaderboards_yaml>` file then aggregates can be collected.
To find the aggregates for your leaderboards use the :ref:`leaderboardManager.getAggregates <leaderboardmanager_getaggregates>` function.
You can also calculate the average score by dividing the aggregate score by the number of users.

**Adding meta data to leaderboards**

Meta data can also be displayed for each user on the leaderboard by using the :ref:`GameProfileManager <gameprofile_leaderboards_example>`.

Examples
========

**Setting**

Setting a score on a leaderboard::

    var leaderboardsSetCallback = function leaderboardsSetCallbackFn(key,
                                                                     score,
                                                                     newBest,
                                                                     bestScore)
    {
        var sortBy = leaderboardManager.meta[key].sortBy;
        if (newBest)
        {
            document.write('New best score ' + score);
        }
        else if (score === bestScore)
        {
            document.write('Matched your best score ' + bestScore);
        }
        else
        {
            document.write('Score not good enough. Need to beat ' + bestScore);
        }
    }
    leaderboardManager.set(key, score, callbackFn, errorCallbackFn);

Setting scores doesn't make redundant requests::

    // Set the score to 10. The leaderboard manager goes and makes a HTTP request to set a new best score.
    leaderboardManager.set('apples', 10, callbackFn, errorCallbackFn);

    // Set the score to 5. The leaderboard manager knows that this score is not the players best.
    // Therefore, it will just call the callbackFn with newBest = false and bestScore = 10.
    leaderboardManager.set('apples', 5, callbackFn, errorCallbackFn);

    // Set the score to 20. The leaderboard manager knows that the score is 10 and so makes a HTTP request to set a new best score.
    leaderboardManager.set('apples', 20, callbackFn, errorCallbackFn);

    // Set the score to 15. Yet again, the leaderboard manager knows this is a worse score so avoids making the request.
    leaderboardManager.set('apples', 15, callbackFn, errorCallbackFn);

There is no need to check if the players score has improved just set the score and let the leaderboard manager figure it out.

**Getting**

Displaying a leaderboard::

    var displayLeaderboard = function displayLeaderboardFn(key, leaderboardResult)
    {
        if (leaderboardResult)
        {
            var view = leaderboardResult.getView();
            var leaderboardString = leaderboardManager.meta[key].title + '<br/>';

            var ranking = view.ranking;
            var numScores = ranking.length;
            for (var i = 0; i < numScores; i += 1)
            {
                var row = ranking[i];
                leaderboardString += row.rank + ',';
                leaderboardString += row.user.username + ',';
                leaderboardString += row.score + '<br/>';
            }

            document.write(leaderboardString);
        }
    };

    var spec = {
        type: 'near',
        size: 5,
        friendsOnly: true
    };
    leaderboardManager.get('best-dm-kills', spec, displayLeaderboard);

.. _leaderboardmanager_paging_example:

**Paging/scrolling**

Paging or scrolling through leaderboards::

    var currentLeaderboardResult;
    function displayLeaderboardUI(key, leaderboardResult)
    {
        currentLeaderboardResult = leaderboardResult;
        var view = leaderboardResult.getView();

        if (!view.top)
        {
            displayUpButton();
        }
        displayLeaderboard(key, leaderboardResult);
        if (!view.bottom)
        {
            displayDownButton();
        }
    }

    function onPageUpClicked()
    {
        currentLeaderboardResult.pageUp(displayLeaderboardUI);
    }

    function onPageDownClicked()
    {
        currentLeaderboardResult.pageDown(displayLeaderboardUI);
    }

    function onScrollUpClicked()
    {
        currentLeaderboardResult.scrollUp(displayLeaderboardUI);
    }

    function onScrollDownClicked()
    {
        currentLeaderboardResult.scrollDown(displayLeaderboardUI);
    }

    var spec = {
        type: 'near',
        size: 20,
        friendsOnly: true
    };
    leaderboardManager.get('best-dm-kills', spec, displayLeaderboard);

Methods
=======

.. index::
    pair: LeaderboardManager; getOverview

.. _leaderboardmanager_getoverview:

`getOverview`
-------------

**Summary**

Get an overview of all leaderboards scores.

**Syntax** ::

    var spec = {
        friendsOnly: true
    };
    function callbackFn(overview) {}
    leaderboardManager.getOverview(spec, callbackFn, errorCallbackFn);

``friendsOnly``
    Filter the leaderboard by friends only.

``callbackFn``
    A JavaScript function.
    Called on successful set of the score.

``errorCallbackFn`` :ref:`(Optional) <leaderboardmanager_errorcallback>`

.. NOTE::
    Currently the ``friendsOnly`` option is only supported on the Gamesite.
    It is ignored on Local and Hub.

The callback ``callbackFn`` is called with an ``overview`` array with the following format::

    [
        {
            key: "best-level-time",
            score: 190.3242,
            rank: 12
        },
        {
            key: "steps",
            score: 739.0,
            rank:8
        },
        {
            key: "best-dm-kills",
            score: 47.0,
            rank: 1
        }
    ]

``key``
    A JavaScript string.
    The key of the leaderboard.

``score``
    A JavaScript number.
    The players score for the leaderboard with key ``key``.

``rank``
    A JavaScript number.
    The players rank for the leaderboard with key ``key``.
    This will change according to the filter ``friendsOnly``.

``time``
    A JavaScript number.
    The UTC time since epoch that the user's score was achieved (double precision).

The leaderboards order is the same order they are specified in the ``leaderboards.yaml`` file.
If the player has not yet set a score for a leaderboard then the leaderboard will not be included in these results.

.. index::
    pair: LeaderboardManager; getAggregates

.. _leaderboardmanager_getaggregates:

`getAggregates`
---------------

**Summary**

Get the aggregates for the leaderboards.

**Syntax** ::

    var spec = {};
    function callbackFn(aggregates) {}
    leaderboardManager.getAggregates(spec, callbackFn, errorCallbackFn);

``callbackFn``
    A JavaScript function.
    Called on successful set of the score.

``errorCallbackFn`` :ref:`(Optional) <leaderboardmanager_errorcallback>`

The callback ``callbackFn`` is called with an ``aggregates`` array with the following format::

    [
        {
            key: "best-level-time",
            aggregateScore: 97423847.3432,
            numUsers: 511883,
        }
    ]

``key``
    A JavaScript string.
    The key of the leaderboard.

``aggregateScore``
    A JavaScript number.
    The aggregation of all users scores for the leaderboard with key ``key``.
    To find the average score divide this value by ``numUsers``.

``numUsers``
    A JavaScript number.
    The number of users with scores set for the leaderboard with key ``key``.

The leaderboards order is the same order they are specified in the ``leaderboards.yaml`` file.
Only leaderboards with the :ref:`aggregate <leaderboardsyaml_aggregate>` flag enabled will be listed in the results.

.. index::
    pair: LeaderboardManager; get

.. _leaderboardmanager_get:

`get`
-----

**Summary**

Get a group of scores for a leaderboard.

**Syntax** ::

    var spec = {
        type: 'top',
        size: 5,
        friendsOnly: true
    };
    function callbackFn(key, leaderboardResult) {
        var view = leaderboardResult.getView();
    }
    leaderboardManager.get(key, spec, callbackFn, errorCallbackFn);

``key``
    A JavaScript string.
    The key identifier for the leaderboard to get.
    This must be a ``key`` from the ``leaderboards.yaml`` file

``type`` (Optional)
    A JavaScript string.
    This can be either 'top' or 'near'.
    The string 'top' will retrieve the top ``size`` scores.
    The string 'near' will retrieve ``size`` scores around the current player.
    Defaults to 'top'.

.. _leaderboardmanager_get_size:

``size`` (Optional)
    A JavaScript number must be an integer.
    Defaults to 9.
    The size of the score table to retrieve.
    We currently have a limit on the maximum size you can request.
    You can request a ``size`` up to 32.
    If your request ``size`` is more than 32 then the request is ignored.

``friendsOnly`` (Optional)
    A JavaScript boolean.
    Filter the leaderboard by friends only.
    Defaults to false.

``callbackFn``
    A JavaScript function.
    Called on successful set of the score.

``errorCallbackFn`` :ref:`(Optional) <leaderboardmanager_errorcallback>`

The callback ``callbackFn`` is called with the following properties:

``key``
    A JavaScript string.
    The key identifier for the leaderboard retrieved.

``leaderboardResult``
    A :ref:`LeaderboardResult <leaderboardresult>` object.
    The results of the request.

To extract the view results of a :ref:`LeaderboardResult <leaderboardresult>` object call the :ref:`leaderboardResult.getView <leaderboardresult_getview>`
function.

.. WARNING::
    You can request a ``size`` up to 32.
    If your request ``size`` is more than 32 then the request is ignored.
    This is to limit the load on our servers.

.. NOTE::
    Currently the ``friendsOnly`` option is only supported on the Gamesite.
    It is ignored on Local and Hub.

.. index::
    pair: LeaderboardManager; set

.. _leaderboardmanager_set:

`set`
-----

**Summary**

Set the players score on a leaderboard.

.. note:: This is an encrypted API call

**Syntax** ::

    function callbackFn(key, score, bestScore) {}
    leaderboardManager.set(key, score, callbackFn, errorCallbackFn);

``key``
    A JavaScript string.
    The key identifier for the leaderboard to set.

``score``
    A JavaScript number.
    The score value to set for the player.

``callbackFn``
    A JavaScript function.
    Called on successful set of the score.

``errorCallbackFn`` :ref:`(Optional) <leaderboardmanager_errorcallback>`

The ``callbackFn`` is called with the following arguments:

``key``
    A JavaScript string.
    The key identifier for the leaderboard to set.

``score``
    A JavaScript number.
    The score value that was requested to be set.
    This cannot be a negative value.

``newBest``
    A JavaScript boolean.
    True, if ``score`` is a new best score.
    False, if ``score`` is the same or worse than the players best score.

``bestScore``
    A JavaScript number.
    The players best score after the set request is completed.
    If ``newBest`` is true then this is equal to ``score``.
    However, the reverse is not true ``score`` can equal ``bestScore`` when ``newBest`` is false.
    In this case the player has matched their best score.

Players scores can only get better.
If you try to set a worse score then the players leaderboard score will not change.
The ``LeaderboardManager`` will not make a request if it knows the score from a previous request is better.

.. NOTE::
    There is no need to check if a players score is better than their previous score.
    The ``LeaderboardManager`` tracks previous scores and will not make redundant HTTP requests.

Properties
==========

.. index::
    pair: LeaderboardManager; service

.. _leaderboardmanager_service:

`service`
---------

**Summary**

The :ref:`ServiceRequester <servicerequester>` object for the ``leaderboards`` service.

**Syntax** ::

    var serviceRequester = leaderboardManager.service;

.. index::
    pair: LeaderboardManager; meta

`meta`
------

**Summary**

The meta information for the leaderboards.

**Syntax** ::

    var meta = leaderboardManager.meta;

``meta`` is a JavaScript object of the following format::

    {
        steps:
        {
            title: "Total steps taken",
            sortBy: 1
        },
        best-level-time:
        {
            title: "Best time to clear level",
            sortBy: -1
        },
        best-dm-kills:
        {
            title: "Highest kills in deathmatch round",
            sortBy: 1
        }
    }

This contains some of the information from the ``leaderboards.yaml`` definition file.

The ``meta`` object is a dictionary of leaderboard keys each with an object property with:

``title``
    A JavaScript string.
    The title of the leaderboard.

``sortBy``
    This can have either value -1 or 1.
    A value of 1 means that higher scores are better.
    A value of -1 means that lower scores are better.

The ``meta`` property is ``undefined`` until the ``leaderboardsLoadedFn`` callback is called for
 :ref:`TurbulenzServices.createLeaderboardManager <turbulenzservices_createleaderboardmanager>`.

.. NOTE::
    This property is read only.

.. index::
    single: LeaderboardResult

.. _leaderboardresult:

----------------------------
The LeaderboardResult Object
----------------------------

A ``LeaderboardResult`` object is given as an argument to the callback for a :ref:`LeaderboardManager.get <leaderboardmanager_get>` request.
It contains all of the information required to render a leaderboard UI.

Internally, the ``LeaderboardResult`` object contains the results of a single :ref:`LeaderboardManager.get <leaderboardmanager_get>` request.
It manages a sliding window over a large set of results to seamlessly reduce the number of HTTP requests that the manager has to make.

Methods
=======

.. index::
    pair: LeaderboardResult; pageUp

.. _leaderboardresult_pageup:

`pageUp`
--------

**Summary**

Move the :ref:`view <leaderboardresult_getview>` up one page.

**Syntax** ::

    function callbackFn(key, leaderboardResult) {}
    var ok = leaderboardResult.pageUp(callbackFn, errorCallbackFn);

    // equivalent to
    var ok = leaderboardResult.moveUp(leaderboardResult.spec.size, callbackFn, errorCallbackFn);

For more information see :ref:`leaderboardResult.moveUp <leaderboardresult_moveup>`.

.. index::
    pair: LeaderboardResult; pageDown

.. _leaderboardresult_pagedown:

`pageDown`
----------

**Summary**

Move the :ref:`view <leaderboardresult_getview>` down one page.

**Syntax** ::

    function callbackFn(key, leaderboardResult) {}
    var ok = leaderboardResult.pageDown(callbackFn, errorCallbackFn);

    // equivalent to
    var ok = leaderboardResult.moveDown(leaderboardResult.spec.size, callbackFn, errorCallbackFn);

For more information see :ref:`leaderboardResult.moveDown <leaderboardresult_movedown>`.

.. index::
    pair: LeaderboardResult; scrollUp

.. _leaderboardresult_scrollup:

`scrollUp`
----------

**Summary**

Scroll the :ref:`view <leaderboardresult_getview>` up one score.

**Syntax** ::

    function callbackFn() {}
    var ok = leaderboardResult.scrollUp(callbackFn, errorCallbackFn);

    // equivalent to
    var ok = leaderboardResult.moveUp(1, callbackFn, errorCallbackFn);

For more information see :ref:`leaderboardResult.moveUp <leaderboardresult_moveup>`.

.. index::
    pair: LeaderboardResult; scrollDown

.. _leaderboardresult_scrolldown:

`scrollDown`
------------

**Summary**

Scroll the :ref:`view <leaderboardresult_getview>` down one score.

**Syntax** ::

    function callbackFn() {}
    var ok = leaderboardResult.scrollDown(callbackFn, errorCallbackFn);

    // equivalent to
    var ok = leaderboardResult.moveDown(1, callbackFn, errorCallbackFn);

For more information see :ref:`leaderboardResult.moveDown <leaderboardresult_movedown>`.

.. index::
    pair: LeaderboardResult; moveUp

.. _leaderboardresult_moveup:

`moveUp`
--------

**Summary**

Scroll the :ref:`view <leaderboardresult_getview>` up by ``offset`` scores.

**Syntax** ::

    function callbackFn() {}
    var ok = leaderboardResult.moveUp(offset, callbackFn, errorCallbackFn);

``offset``
    A JavaScript number.
    This should be an integer value between (inclusive) ``1``  and (inclusive) ``leaderboardResult.spec.size``.

``callbackFn``
    A JavaScript function.
    Called asynchronously once the leaderboard results have been retrieved and the :ref:`view <leaderboardresult_getview>` has been updated.
    Called with arguments:

    ``key``
        A JavaScript string.
        The key identifier for the leaderboard.

    ``leaderboardResult``
        The :ref:`LeaderboardResult <leaderboardresult>` object used for the request.

``errorCallbackFn`` :ref:`(Optional) <leaderboardmanager_errorcallback>`

Returns a boolean ``ok`` value which is ``true`` if the operation will be carried out.
This is ``false`` if another view operation is already in progress.

To get the results after moving up down call the :ref:`leaderboardResult.getView <leaderboardresult_getview>` function.

Please read the :ref:`leaderboard paging guide <leaderboardmanager_paging>` before using this function.
For an example of how to use these functions see :ref:`here <leaderboardmanager_paging_example>`.

.. NOTE::
    View operations cannot be called synchronously, as they might have to do an asynchronous HTTP request::

        function moveDownCompleted()
        {
            // This call will work
            leaderboardResult.moveUp(1);
        }
        leaderboardResult.moveDown(1, moveDownCompleted);
        // This call will be ignored
        leaderboardResult.moveUp(1);

.. index::
    pair: LeaderboardResult; moveDown

.. _leaderboardresult_movedown:

`moveDown`
----------

**Summary**

Scroll the :ref:`view <leaderboardresult_getview>` down by ``offset`` scores.

**Syntax** ::

    function callbackFn(key, leaderboardResult) {}
    var ok = leaderboardResult.moveDown(offset, callbackFn, errorCallbackFn);

``offset``
    A JavaScript number.
    This should be an integer value between (inclusive) ``1``  and (inclusive) ``leaderboardResult.spec.size``.

``callbackFn``
    A JavaScript function.
    Called asynchronously once the leaderboard results have been retrieved and the :ref:`view <leaderboardresult_getview>` has been updated.
    Called with arguments:

    ``key``
        A JavaScript string.
        The key identifier for the leaderboard.

    ``leaderboardResult``
        The :ref:`LeaderboardResult <leaderboardresult>` object used for the request.

``errorCallbackFn`` :ref:`(Optional) <leaderboardmanager_errorcallback>`

Returns a boolean ``ok`` value which is ``true`` if the operation will be carried out.
This is ``false`` if another view operation is already in progress.

To get the results after moving down down call the :ref:`leaderboardResult.getView <leaderboardresult_getview>` function.

Please read the :ref:`leaderboard paging guide <leaderboardmanager_paging>` before using this function.
For an example of how to use these functions see :ref:`here <leaderboardmanager_paging_example>`.

.. NOTE::
    View operations cannot be called synchronously, as they might have to do an asynchronous HTTP request::

        function moveUpCompleted()
        {
            // This call will work
            leaderboardResult.moveDown(1);
        }
        leaderboardResult.moveUp(1, moveUpCompleted);
        // This call will be ignored
        leaderboardResult.moveDown(1);

.. index::
    pair: LeaderboardResult; getView

.. _leaderboardresult_getview:

`getView`
---------

**Summary**

Returns an ordered array of ranks, users and scores (best to worst) in the current results view.

**Syntax** ::

    var view = LeaderboardResult.getView();

    // example usage:
    var ranking = view.ranking;
    var bestInResult = ranking[0];
    var worstInResult = ranking[ranking.length - 1];

    var bestScore = bestInResult.score;
    var bestScoreUsername = bestInResult.user.username;
    var bestScoreRank = bestInResult.rank;
    var bestScoreTime = bestInResult.time;

Returns a ``view`` object with the following properties:

``ranking``
    An ordered (by rank and time) JavaScript array.
    Each element is an object, representing a user's score, with the following properties:

    ``rank``
        A JavaScript number.
        An integer giving the rank of the user's score.
        This is computed using :ref:`Standard competition ranking <ranking_system>` and might not be unique to this user's score.

    ``score``
        A JavaScript number.
        The user's score.

    ``time``
        A JavaScript number.
        The UTC time since epoch that the user's score was achieved.
        Users with equal scores are ordered in the array by first to achieve the score.

    ``user``
        A JavaScript object with the username, display name and avatar of the user.
        For example::

            {
                username: "dave",
                displayname: "dave"
                avatar: "https://..."
            }

``top``
    A JavaScript Boolean value.
    Is true when ``view`` is at the top of the scores (i.e. there are no better scores).

``bottom``
    A JavaScript Boolean value.
    Is true when ``view`` is at the bottom of the scores (i.e. there are no worse scores).

``player``
    Information about the current player in the same format as the ``ranking`` array's elements.

``playerIndex``
    The index of the player in the ``ranking`` array or ``null`` if the current player is not in the rankings.

The view can be adjusted using the :ref:`pageUp <leaderboardresult_pageup>`
, :ref:`pageDown <leaderboardresult_pagedown>`
, :ref:`scrollUp <leaderboardresult_scrollup>`
, :ref:`scrollDown <leaderboardresult_scrolldown>`
, :ref:`moveUp <leaderboardresult_moveup>`
and :ref:`moveDown <leaderboardresult_movedown>` functions above.

The result of this function is automatically cached so it can be called inside of a rendering loop.

Please read the :ref:`leaderboard paging guide <leaderboardmanager_paging>` before using this function.
For an example of how to use these functions see :ref:`here <leaderboardmanager_paging_example>`.

.. index::
    pair: LeaderboardResult; getSlidingWindow

.. _leaderboardresult_getslidingwindow:

`getSlidingWindow`
------------------

**Summary**

Returns an ordered array of ranks, users and scores (best to worst).
This is a superset of the results of :ref:`getView <leaderboardresult_getview>`.
It is typically a set of 64 leaderboard scores (although can be smaller) centered around the ``view`` returned by :ref:`getView <leaderboardresult_getview>`.

**Syntax** ::

    var slidingWindow = LeaderboardResult.getSlidingWindow();

Returns a ``slidingWindow`` object with the following properties:

``ranking``
    An ordered (by rank and time) JavaScript array.
    Each element is an object, representing a user's score, with the following properties:

    ``rank``
        A JavaScript number.
        An integer giving the rank of the user's score.
        This is computed using :ref:`Standard competition ranking <ranking_system>` and might not be unique to this user's score.

    ``score``
        A JavaScript number.
        The user's score.

    ``time``
        A JavaScript number.
        The UTC time since epoch that the user's score was achieved.
        Users with equal scores are ordered in the array by first to achieve the score.

    ``user``
        A JavaScript object with the username, display name and avatar of the user.
        For example::

            {
                username: "dave",
                displayname: "dave"
                avatar: "https://..."
            }

``top``
    A JavaScript Boolean value.
    Is true when ``slidingWindow`` is at the top of the scores (i.e. there are no better scores).

``bottom``
    A JavaScript Boolean value.
    Is true when ``slidingWindow`` is at the bottom of the scores (i.e. there are no worse scores).

``player``
    Information about the current player in the same format as the ``ranking`` array's elements.

``playerIndex``
    The index of the player in the ``ranking`` array or ``null`` if the current player is not in the rankings.

This can be combined with the :ref:`leaderboardResult.onSlidingWindowUpdate() <leaderboardresult_onslidingwindowupdate>` function to efficiently create
avatar images or :ref:`collect game profiles <gameprofile_leaderboards_example>` for users in the leaderboard.

Properties
==========

.. index::
    pair: LeaderboardResult; key

.. _leaderboardresult_key:

`key`
-----

**Summary**

The meta key used to generate the leaderboard result.

**Syntax** ::

    var key = leaderboardResult.key;

.. index::
    pair: LeaderboardResult; onSlidingWindowUpdate

.. _leaderboardresult_onslidingwindowupdate:

`onSlidingWindowUpdate`
-----------------------

**Summary**

Called for each HTTP request the ``LeaderboardResult`` object makes.
This is useful for making :ref:`game profile requests efficiently <gameprofile_leaderboards_example>`.

**Syntax** ::

    leaderboardResult.onSlidingWindowUpdate = function onSlidingWindowUpdate() {}

This can be combined with the :ref:`leaderboardResult.getSlidingWindow() <leaderboardresult_getslidingwindow>` function to efficiently create
avatar images or :ref:`collect game profiles <gameprofile_leaderboards_example>` for users in the leaderboard.

.. index::
    pair: LeaderboardResult; originalSpec

.. _leaderboardresult_originalspec:

`originalSpec`
--------------

**Summary**

The ``spec`` object used by the :ref:`LeaderboardManager.get <leaderboardmanager_get>` to create this ``LeaderboardResult`` object.

**Syntax** ::

    var spec = leaderboardResult.originalSpec;

    var specSize = spec.size;
    var specType = spec.type;
    var friendsOnly = spec.friendsOnly;

This ``originalSpec`` object will have the default values populated if they were missing in the original :ref:`LeaderboardManager.get <leaderboardmanager_get>` request.
The defaults are:

- ``type = 'top'``
- ``size = 9``

.. _leaderboardmanager_errorcallback:

Error callback
==============

If no error callback is given then the :ref:`TurbulenzServices.createLeaderboardManager <turbulenzservices_createleaderboardmanager>` ``errorCallbackFn`` is used.

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
