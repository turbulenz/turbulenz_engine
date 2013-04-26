.. index::
    single: MultiPlayerSessionManager

.. _multiplayersessionmanager:

.. highlight:: javascript

------------------------------------
The MultiPlayerSessionManager Object
------------------------------------

This object allows you to find and join multiplayer sessions.
The object can be created by calling :ref:`TurbulenzServices.createMultiPlayerSessionManager <turbulenzservices_createmultiplayersessionmanager>`.
You **must** dispose of this object by calling :ref:`MultiPlayerSessionManager.destroy <multiplayersessionmanager_destroy>`, either when you finish using the object or in :ref:`TurbulenzEngine.onunload <turbulenzengine_unload>`.
This will :ref:`destroy <multiplayersession_destroy>` any :ref:`MultiPlayerSession <multiplayersession>` objects which have not yet been destroyed.

**Required scripts**

The ``MultiPlayerSession`` object requires::

    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/
    /*{{ javascript("jslib/services/multiplayersession.js") }}*/
    /*{{ javascript("jslib/services/multiplayersessionmanager.js") }}*/

Methods
=======

.. index::
    pair: MultiPlayerSessionManager; createSession

.. _multiplayersessionmanager_createsession:

`createSession`
---------------

**Summary**

Create a multiplayer session and create a :ref:`MultiPlayerSession <multiplayersession>` object.

**Syntax** ::

    function sessionCreatedFn(multiPlayerSession) {}
    var multiPlayerSession = multiPlayerSessionManager.createSession(maxPlayers,
                                                                     sessionCreatedFn,
                                                                     errorCallbackFn);

``maxPlayers``
    The maximum number of players allowed on this multiplayer session.

``sessionCreatedFn``
    A JavaScript function.
    This function is called once the multiplayer session has been created.
    Until this function is called the ``multiPlayerSession`` object is not valid and should not be used.

``errorCallbackFn`` :ref:`(Optional) <turbulenzservices_errorcallbackfn>`

The :ref:`MultiPlayerSession <multiplayersession>` returned contains no information about the session until ``sessionCreatedFn`` is called.
Once ``sessionCreatedFn`` is called the :ref:`MultiPlayerSession <multiplayersession>` **must** be :ref:`destroyed <multiplayersession_destroy>` before the game is closed.


.. index::
    pair: MultiPlayerSessionManager; joinAnySession

.. _multiplayersessionmanager_joinanysession:

`joinAnySession`
----------------

**Summary**

Join any available existing multiplayer session and create a :ref:`MultiPlayerSession <multiplayersession>` object.

**Syntax** ::

    function sessionJoinedFn(multiPlayerSession) {}
    function failCallbackFn() {}
    var multiPlayerSession = multiPlayerSessionManager.joinAnySession(sessionJoinedFn,
                                                                      failCallbackFn,
                                                                      errorCallbackFn);

``sessionJoinedFn``
    A JavaScript function.
    This function is called once the multiplayer session has been joined.
    Until this function is called the ``multiPlayerSession`` object is not valid and should not be used.

``failCallbackFn``
    A JavaScript function.
    This function is called if there is no suitable session for the user to join.

``errorCallbackFn`` :ref:`(Optional) <turbulenzservices_errorcallbackfn>`

This function will attempt to join an existing session with one or more empty slots created by one of the user's friends.
If there is no available game then ``failCallbackFn`` is called.
The :ref:`MultiPlayerSession <multiplayersession>` returned contains no information about the session until ``sessionJoinedFn`` is called.
Once ``sessionJoinedFn`` is called the :ref:`MultiPlayerSession <multiplayersession>` returned **must** be :ref:`destroyed <multiplayersession_destroy>` before the game is closed.

.. index::
    pair: MultiPlayerSessionManager; joinSession

.. _multiplayersessionmanager_joinsession:

`joinSession`
-------------

**Summary**

Join an existing multiplayer session and create a :ref:`MultiPlayerSession <multiplayersession>` object.

**Syntax** ::

    function sessionJoinedFn(multiPlayerSession) {}
    var multiPlayerSession = multiPlayerSessionManager.joinSession(sessionId,
                                                                   sessionJoinedFn,
                                                                   errorCallbackFn);

``sessionId``
    Identifier of the session to join.

``sessionJoinedFn``
    A JavaScript function.
    This function is called once the multiplayer session has been joined.
    Until this function is called the ``multiPlayerSession`` object is not valid and should not be used.

``errorCallbackFn`` :ref:`(Optional) <turbulenzservices_errorcallbackfn>`

The :ref:`MultiPlayerSession <multiplayersession>` returned contains no information about the session until ``sessionJoinedFn`` is called.
Once ``sessionJoinedFn`` is called the :ref:`MultiPlayerSession <multiplayersession>` returned **must** be :ref:`destroyed <multiplayersession_destroy>` before the game is closed.

.. index::
    pair: MultiPlayerSessionManager; joinOrCreateSession

.. _multiplayersessionmanager_joinorcreatesession:

`joinOrCreateSession`
---------------------

**Summary**

Join an existing multiplayer session or create a new one and create a :ref:`MultiPlayerSession <multiplayersession>` object.

**Syntax** ::

    function sessionCreatedFn(multiPlayerSession) {}
    var multiPlayerSession = multiPlayerSessionManager.joinOrCreateSession(maxPlayers,
                                                                           sessionCreatedFn,
                                                                           errorCallbackFn);

``maxPlayers``
    If a new session is created, the maximum number of players allowed on the created multiplayer session.

``sessionCreatedFn``
    A JavaScript function.
    This function is called once the multiplayer session has been created.
    Until this function is called the ``multiPlayerSession`` object is not valid and should not be used.

``errorCallbackFn`` :ref:`(Optional) <turbulenzservices_errorcallbackfn>`

This is simply a convenience function which calls :ref:`MultiPlayerSessionManager.joinAnySession <multiplayersessionmanager_joinanysession>` to attempt to join an existing multiplayer session.
If no suitable session is available, then :ref:`MultiPlayerSessionManager.createSession <multiplayersessionmanager_createsession>` is called to create a new session.
The :ref:`MultiPlayerSession <multiplayersession>` returned contains no information about the session until ``sessionCreatedFn`` is called.
Once ``sessionCreatedFn`` is called the :ref:`MultiPlayerSession <multiplayersession>` returned **must** be :ref:`destroyed <multiplayersession_destroy>` before the game is closed.


.. index::
    pair: MultiPlayerSessionManager; queryFriendsSessions

.. _multiplayersessionmanager_queryfriendssessions:

`queryFriendsSessions`
----------------------

**Summary**

Retrieve a list of sessions of the friends of the current user

**Syntax** ::

    var querySuccessFn = function (sessionList) {}
    multiPlayerSessionManager.queryFriendsSessions(querySuccessFn,
                                                   errorCallbackFn);


``querySuccessFn``
    A JavaScript function.
    The callback to be called when the query is successful.

``errorCallbackFn`` :ref:`(Optional) <turbulenzservices_errorcallbackfn>`

``sessionList``
    An array of objects representing the sessions currently being run by the user's friends.
    Each session object has the following properties:

    * ``_id`` the sessionId to use with :ref:`joinSession <multiplayersessionmanager_joinsession>`
    * ``numslots`` the maximum number of players in the session
    * ``players`` an array giving the ids of the players in the current session
    * ``joinable`` whether the session is joinable or not

This function can be used to request a list of sessions currently being run by the user's friends.
The list can be used to allow the user to join games with friends through an in-game API.
You should be aware that as with any such asynchronous API the information retrieved (such as the number of free slots or even the existence of the session) may be out-of-date by the time you attempt to use it.


.. index::
    pair: MultiPlayerSessionManager; getJoinRequestQueue

.. _multiplayersessionmanager_getjoinrequestqueue:

`getJoinRequestQueue`
---------------------

**Summary**

Manage multiplayer join events generated by external sources such as the game site.

**Syntax** ::

    var queue = multiplayerSessionManager.getJoinRequestQueue();
    var pendingJoinRequest = queue.shift();
    var multiplayerSessionSuccess = function multiplayerSessionSuccessFn()
    {
        queue.clear(); // if you want to ignore requests that came in while you were joining the session.
        queue.resume();
    }
    var joinCallback = function joinCallbackFn(joinMultiplayerSessionId)
    {
        queue.pause();
        multiplayerSessionManager.joinSession(joinMultiplayerSessionId,
                                              multiplayerSessionSuccess,
                                              multiplayerSessionError);
    };
    queue.onEvent(joinCallback);
    if (pendingJoinRequest)
    {
        multiplayerSessionManager.joinSession(pendingJoinRequest,
                                              multiplayerSessionSuccess,
                                              multiplayerSessionError);
    }
    else
    {
        multiplayerSessionManager.joinOrCreateSession(numSlots,
                                                      multiplayerSessionSuccess,
                                                      multiplayerSessionError);
    }

``joinCallback``
    A JavaScript function.
    The callback to be called when the user triggers a join multiplayer event.

``queue``
    An event queue.
    The queue object returned by this function supports the following methods:

    * ``onEvent(joinCallback, context)`` registers a callback to be fired when a new event is added to the queue.
      Also takes an optional context object which will be used to call the callback.
    * ``pause`` inhibits calls to the registered ``onEvent`` callback and queues any join requests that are triggered.
      The queue is initially in the paused state
    * ``resume`` resumes the queue. Any pending requests are processed by calling any ``onEvent`` handlers
    * ``clear`` clears the queue
    * ``shift`` retrieves the next item in the queue to be processed

Events are added to the queue when the user triggers a join multiplayer event using the game site controls.
If the user starts a game through a join event (such as from an invitation) then the queue will be populated with the appropriate sessionId.


.. index::
    pair: MultiPlayerSessionManager; destroy

.. _multiplayersessionmanager_destroy:

`destroy`
---------

**Summary**

Destroy a :ref:`MultiPlayerSessionManager <multiplayersessionmanager>`.
This will destroy any remaining :ref:`MultiPlayerSession <multiplayersession>` objects.

**Syntax** ::

    multiPlayerSessionManager.destroy();

**Example** ::

    //example usage:
    gameDestroy = function gameDestroyFn()
    {
        // destroy Turbulenz engine and JavaScript library objects
        ...

        multiPlayerSessionManager.destroy();
        multiPlayerSessionManager = null;

        mappingTable = null;
        userDataManager = null;
        leaderboardManager = null;

        gameSession.destroy();
        gameSession = null;
    };

    TurbulenzEngine.onunload = gameDestroy;


