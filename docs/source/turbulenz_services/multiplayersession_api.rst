.. index::
    single: MultiPlayerSession

.. _multiplayersession:

.. highlight:: javascript

-----------------------------
The MultiPlayerSession Object
-----------------------------

The MultiPlayerSession object represents the user's current multiplayer session.
You should only have one instance of a MultiPlayerSession at a time.
Once the session is over you should call :ref:`destroy <multiplayersession_destroy>` before creating a new session.
You should also destroy any remaining MultiPlayerSession objects in :ref:`TurbulenzEngine.onunload <turbulenzengine_unload>`.

A MultiPlayerSession object can be created through the :ref:`MultiPlayerSessionManager <multiplayersessionmanager>` object which can be accessed through :ref:`TurbulenzServices.createMultiPlayerSessionManager <turbulenzservices_createmultiplayersessionmanager>`.

**Required scripts**

The ``MultiPlayerSession`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/multiplayersession.js") }}*/


Properties
==========


.. index::
    pair: MultiPlayerSession; onmessage

`onmessage`
-----------

**Summary**

Callback for received messages.

**Syntax** ::

    multiPlayerSession.onmessage = function onReceivedMessage(senderId,
                                                              messageType,
                                                              messageData)
    {
        if (messageType === MyNetworkMessageTypes.update)
        {
            if (messageData)
            {
                var updateData = JSON.parse(messageData);

                game.update(senderId, updateData);
            }
        }
    };

``senderId``
    Unique string identifier representing the user that sent the message.

``messageType``
    User-defined number specifying the type of message received.

``messageData``
    String containing the message data.


.. index::
    pair: MultiPlayerSession; onclose

`onclose`
---------

**Summary**

Callback for sessions closed by the remote server.

**Syntax** ::

    multiPlayerSession.onclose = function onSessionClosed()
    {
        // Alert the user of session closed
        window.alert("Connection lost!");
    };


.. index::
    pair: MultiPlayerSession; sessionId

`sessionId`
-----------

**Summary**

The unique string identifier representing multiplayer session.

**Syntax** ::

    var sessionId = multiPlayerSession.sessionId;


.. index::
    pair: MultiPlayerSession; playerId

`playerId`
----------

**Summary**

The unique string identifier representing the user on the multiplayer session.

**Syntax** ::

    var playerId = multiPlayerSession.playerId;


Methods
=======

.. index::
    pair: MultiPlayerSession; sendTo

`sendTo`
--------

**Summary**

Sends a message to a single user.

**Syntax** ::

    var messageType = MyNetworkMessageTypes.update;
    var messageData = JSON.stringify(updateData);
    multiPlayerSession.sendTo(playerId, messageType, messageData);

``playerId``
    Unique string identifier representing the user to send the message to.

``messageType``
    User-defined number specifying the type of message.

``messageData``
    String containing the message data to send.


.. index::
    pair: MultiPlayerSession; sendToGroup

`sendToGroup`
-------------

**Summary**

Sends a message to multiple users.

**Syntax** ::

    var playersIds = [playerAid, playerBid];
    var messageType = MyNetworkMessageTypes.update;
    var messageData = JSON.stringify(updateData);
    multiPlayerSession.sendToGroup(playersIds, messageType, messageData);

``playersIds``
    Array containing the unique string identifiers representing the users to send the message to.

``messageType``
    User-defined number specifying the type of message.

``messageData``
    String containing the message data to send.


.. index::
    pair: MultiPlayerSession; sendToAll

`sendToAll`
-----------

**Summary**

Sends a message to all the users on the multiplayer session except the current one.

**Syntax** ::

    var messageType = MyNetworkMessageTypes.update;
    var messageData = JSON.stringify(updateData);
    multiPlayerSession.sendToAll(messageType, messageData);

``messageType``
    User-defined number specifying the type of message.

``messageData``
    String containing the message data to send.


.. index::
    pair: MultiPlayerSession; connected

`connected`
-----------

**Summary**

Check if the MultiPlayerSession object is connected to a remote server.

**Syntax** ::

    if (multiPlayerSession.connected())
    {
        // Draw connected icon
    }


.. index::
    pair: MultiPlayerSession; makePublic

`makePublic`
------------

**Summary**

Make the multiplayer session public and allow anyone to join.

**Syntax** ::

    var callbackFn = function () {window.alert('Session is public.')};
    multiPlayerSession.makePublic(callbackFn);


``callbackFn``
    (Optional) Callback triggered when session has been made public

.. index::
    pair: MultiPlayerSession; destroy

.. _multiplayersession_destroy:

`destroy`
---------

**Summary**

Destroy a MultiPlayerSession.

**Syntax** ::

    multiPlayerSession.destroy();

**Example** ::

    //example usage:
    gameDestroy = function gameDestroyFn()
    {
        // destroy Turbulenz engine and JavaScript library objects
        ...

        multiPlayerSession.destroy();
        multiPlayerSession = null;

        multiPlayerSessionManager.destroy();
        multiPlayerSessionManager = null;

        mappingTable = null;
        userDataManager = null;
        leaderboardManager = null;

        gameSession.destroy();
        gameSession = null;
    };

    TurbulenzEngine.onunload = gameDestroy;


