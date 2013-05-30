.. index::
    single: DataShareManager

.. _datasharemanager:

.. highlight:: javascript

---------------------------
The DataShareManager Object
---------------------------

.. Added in :ref:`SDK x.x.x <added_sdk_0_25_0>`.

The ``DataShareManager`` object is an API for creating and finding :ref:`data share <datashare>` objects.
Data shares are public key-value stores which allow games to share data with other users.
For example, data shares could be used to store the game state of an asynchronous multiplayer game
(communication with users who are not required to be on-line) like Chess or Diplomacy.

For real-time multiplayer games requiring low latency (games with users all playing at the same time e.g. FPS) please
use the :ref:`MultiPlayerSessionManager <multiplayersessionmanager>`.

Before using the ``DataShareManager`` make sure you understand the :ref:`user data <userdatamanager>` API and
know which :ref:`game data <turbulenz_services_game_data>` API to use.
The ``DataShareManager`` is the most complex of the game data API's and you should always consider
the :ref:`user data <userdatamanager>` API or the :ref:`game profiles <gameprofilemanager>` API before using data
shares.

**Required scripts**

The ``DataShareManager`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/datasharemanager.js") }}*/
    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/

Data Shares
===========

:ref:`Data shares <datashare>` are public key-value stores which allow games to share data with other users.
Please read the :ref:`user data guide for using a key-value store <working_with_http>` for how to use a key-value store
efficiently.

Multiple data share objects can be created per user, one for each multiplayer game they are playing.

.. _datashare_access:

**Access**

Each key in a data share has a public write access level.
This can be set to either :ref:`public read only <datashare_publicreadonly>` or
:ref:`public read and write <datashare_publicreadandwrite>`.
All keys are read only when created with the :ref:`set <datashare_set>` function and
read and write when created with the :ref:`compareAndSet <datashare_compareandset>` function.
Giving keys read only access protects save games from malicious users who could use the API to alter other user's save
games.
Only the owner of a key (the first user to write to the key) can set the value for a public read only key.

For more information see the :ref:`data share access example <datashare_access_example>`.

**Testing**

To test with multiple users see this :ref:`guide on multiple logins <multiple_logins>`.

**Manually viewing and removing the data store on the local server**

You can find the data share key-value stores in the ``devserver/localdata/datashare/{game-slug}/{datashare-id}.yaml``
files of the SDK.

.. highlight:: yaml

Each file contains a the meta information and key-value store of the items owned in the following example format::

    created: 1361967918
    owner: dave
    store:
      apples: {access: 0, lastSet: 1361967918, modifiedBy: dave, token: d965512aac48e6451c32929a,
        value: '1'}
      bananas: {access: 0, lastSet: 1361967918, modifiedBy: dave, token: b29799338516ab0c091997de,
        value: '3'}
    users: [dave, ben, bill]

.. highlight:: javascript

To remove a data store remove this file and then refresh the page.
To remove all data stores for a game remove the ``devserver/localdata/datashare/{game-slug}`` directory and then refresh
the page.

Examples
========

.. _creating_datashare_example:

**Creating a data share**

A data share can be created for the current user by calling the
:ref:`dataShareManager.createDataShare <datasharemanager_createdatashare>` function.
After creating the data share the game can write to its key-value store using the
:ref:`set <datashare_set>` (:ref:`read only <datashare_access>`) and
:ref:`compareAndSet <datashare_compareandset>` (:ref:`read and write <datashare_access>`) functions.

::

    var dataShareManager;

    function dataShareCreated(dataShare) {
        function dataShareSetCallback(wasSet, reason)
        {
            // player can now stop playing or go offline
        }
        dataShare.set({
                key: 'gamestate',
                value: JSON.stringify(gameState),
                callback: dataShareSetCallback
            });
    }

    function sessionReadyFn(gameSession)
    {
        dataShareManager = DataShareManager.create(requestHandler, gameSession);
        dataShareManager.createDataShare(dataShareCreated);
    }
    var gameSession = TurbulenzServices.createGameSession(requestHandler, sessionReadyFn);

Note that the user's game can remain joined to a data share even while the user is off-line.
When the game has finished using the data share it should call :ref:`dataShare.leave <datashare_leave>` to remove the current user from the data share.
Once the :ref:`dataShare.users <datashare_users>` array is empty it will be deleted.

.. _finding_joining_datashare_examples:

**Finding and joining data share objects**

Data shares can be found using the :ref:`dataShareManager.findDataShares <datasharemanager_finddatashares>` function.
This function returns an array of data share objects which match the find parameters.
To use the data share :ref:`getKeys <datashare_getkeys>`, :ref:`get <datashare_get>`, :ref:`set <datashare_set>` or
:ref:`compareAndSet <datashare_compareandset>` functions you first need to :ref:`join <datashare_join>` the data share.

By joining a data share object the current user is added to the :ref:`dataShare.users <datashare_users>` array property of the data share.
Once the :ref:`dataShare.users <datashare_users>` array is empty it will be deleted.

The following code will find the first data share object with the user "bob" joined and, if it can find it, will join it
and get the key "gamestate"::

    var dataShare;

    function joined() {
        Utilities.log('Joined game');
        dataShare.get('gamestate', function stateLoaded(store)
            {
                gameState = JSON.parse(store.value);
            });
    };

    dataShareManager.findDataShares({
        user: 'bob',
        callback: function callback(dataShares)
        {
            if (dataShares.length > 0)
            {
                dataShare = dataShare[0];
                dataShare.join(joined);
            }
            else
            {
                Utilities.log('Bob is not in a multiplayer game');
            }
        }
    });

    ...
    // sometime later the multiplayer game ends
    function leave() {
        Utilities.log('Multiplayer game left');
    };
    dataShare.leave(leave);

Note that the user's game can remain joined to a data share even while the user is off-line.
Once the user leaves a multiplayer game or it is complete, the game must call :ref:`leave <datashare_leave>` so that the
data share can be deleted.

To find any joinable data share object remove the ``user`` filter::

    dataShareManager.findDataShares({
        callback: function callback(dataShares)
        {
            if (dataShares.length > 0)
            {
                dataShare = dataShare[0];
                dataShare.join(joined);
            }
            else
            {
                Utilities.log('No available multiplayer games');
            }
        }
    });

.. _datashare_isjoined_example:

To filter out the data shares with the current user already joined use the
:ref:`dataShare.isJoined <datashare_isjoined>` function::

    dataShareManager.findDataShares({
        callback: function callback(dataShares)
        {
            var dataSharesLength = dataShares.length;
            var dataSharesIndex;

            for (dataSharesIndex = 0; dataSharesIndex < dataSharesLength; dataSharesIndex += 1)
            {
                dataShare = dataShare[dataSharesIndex];
                if (!dataShare.isJoined(currentUsername))
                {
                    dataShare.join(joined);
                    return;
                }
            }
            Utilities.log('No available multiplayer games');
        }
    });

.. NOTE::
    The username of the current user can be found with the
    :ref:`TurbulenzServices.createUserProfile <turbulenzservices_createuserprofile>` function.

.. _datashare_access_example:

**Public read only and public read and write keys**

Keys can be created as read only by the key creator to stop malicious users from overwriting data::

    dataShare.set({
            key: 'gamestate',
            value: JSON.stringify(gameState),
            callback: dataShareSetCallback
        });

The :ref:`dataShare.set <datashare_set>` function will create the key with public read only access.
Once a key has been created using :ref:`dataShare.set <datashare_set>` the
:ref:`dataShare.compareAndSet <datashare_compareandset>` function cannot be used on that key until it is deleted.

To allow any user who can :ref:`join <datashare_join>` to the data share write access to the key::

    dataShare.compareAndSet({
            key: 'gamestate',
            value: JSON.stringify(gameState),
            callback: dataShareSetCallback
        });

Once a key has been set using :ref:`dataShare.compareAndSet <datashare_compareandset>` the
:ref:`dataShare.set <datashare_set>` function cannot be used on that key until it is deleted.
Compare and set operations will fail if another user has written to the key value since it was last
read using :ref:`dataShare.get <datashare_get>`.

**Limiting the number of players**

Currently, the number of players that can join a data share has to be limited client-side.
This can be achieved by using the :ref:`dataShare.users <datashare_users>` property.

::

    function joinedDataShare(success)
    {
        if (success)
        {
            currentDataShare = dataShare;
            if (currentDataShare.users.length > maxUsers)
            {
                // only maxUsers players should join a game
                // this is possible if 2 (or more) people click to join a game at the same time
                leaveGame();
                currentDataShare.setJoinable(false);
            }
            ...
        }
    }
    dataShare.join(joinedDataShare);

Since :ref:`dataShare.users <datashare_users>` is only updated when join is called only the last user to join will leave
(as the first user to join will not see the last user int the users list and so will see the correct amount of users).

It is also a good idea to check the number of players when starting a game (in-case a player joins and then closes
their browser before checking the number of joined players).
For a more detailed example see the Tic-tac-toe app.

**Tic-tac-toe**

The SDK contains a Tic-tac-toe app which shows how to use data share objects combined with
:ref:`instant notifications <notificationsmanager>` with some simple game and lobby logic.
This includes code for limiting the number of players that can join the game.

Constructor
===========

.. index::
    pair: DataShareManager; create

.. _datasharemanager_create:

`create`
--------

**Summary**

Creates a DataShareManager object.

**Syntax** ::

    var dataShareManager = DataShareManager.create(requestHandler, gameSession, defaultErrorCallbackFn);

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``gameSession``
    A :ref:`GameSession <gamesession>` object.

``defaultErrorCallbackFn`` :ref:`(Optional) <turbulenzservices_errorcallbackfn>`
    The default :ref:`error callback function <datasharemanager_errorcallback>` that is called for any DataShareManager
    functions that do not specify their own error callback function.

Returns a DataShareManager object or if the Turbulenz Services are unavailable returns ``null``.

Methods
=======

.. index::
    pair: DataShareManager; createDataShare

.. _datasharemanager_createdatashare:

`createDataShare`
-----------------

**Summary**

Create a :ref:`DataShare <datashare>` object.

**Syntax** ::

    function dataShareCreated(dataShare) {}
    dataShareManager.createDataShare(dataShareCreated, errorCallback);

``dataShareCreated``
    A JavaScript function.
    A callback function called asynchronously with the created :ref:`DataShare <datashare>` object.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

The current user owns the returned ``dataShare`` object and is automatically :ref:`joined <datashare_join>` to it.
Note that the user's game can remain joined to a data share even while the user is off-line.
The game should still call :ref:`dataShare.leave <datashare_leave>` once it has stopped using the data share object.

For an example using this function see :ref:`creating datashares <creating_datashare_example>`.

.. index::
    pair: DataShareManager; findDataShares

.. _datasharemanager_finddatashares:

`findDataShares`
----------------

**Summary**

Create a :ref:`DataShare <datashare>` object.

**Syntax** ::

    function dataSharesFound(dataShares) {}
    var dataShare = dataShareManager.findDataShares({
            user: 'bob',
            callback: dataSharesFound,
            errorCallback: errorCallback
        });

``user`` (Optional)
    A JavaScript string.
    Find only data shares with the username ``user`` joined.

``friendsOnly`` (Optional)
    A JavaScript boolean.
    Find only data shares with the current user's friends joined.
    This flag is ignored if the ``user`` property is also set.
    This flag is currently ignored (so returns all users) on the Local and Hub as they do not yet support friends.

``callback``
    A JavaScript function.
    Returns a list of the first 64 joinable :ref:`DataShare <datashare>` objects matching the search sorted by most
    recently created.
    This list can contain data shares that the current user has already joined.
    Joined data shares can be filtered out with the :ref:`dataShare.isJoined <datashare_isjoined>` function.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

The user must be :ref:`joined <datashare_join>` to the data share before calling
:ref:`getKeys <datashare_getkeys>`,
:ref:`get <datashare_get>`,
:ref:`set <datashare_set>` or
:ref:`compareAndSet <datashare_compareandset>` functions.
When calling :ref:`createDataShare <datasharemanager_createdatashare>` the current user is joined automatically.

For examples using this function see :ref:`finding and joining data shares <finding_joining_datashare_examples>`.

.. index::
    single: DataShareManager

.. _datashare:

.. highlight:: javascript

--------------------
The DataShare Object
--------------------

.. Added in :ref:`SDK x.x.x <added_sdk_x_x_x>`.

A data share object can be created with a call to
:ref:`DataShareManager.createDataShare <datasharemanager_createdatashare>`.
Other users data share objects can be retrieved with a call to
:ref:`DataShareManager.findDataShares <datasharemanager_finddatashares>`.

Methods
=======

.. index::
    pair: DataShare; join

.. _datashare_join:

`join`
------

**Summary**

Join the :ref:`DataShare <datashare>`.

**Syntax** ::

    function dataShareJoined(success) {}
    dataShare.join(dataShareJoined, errorCallback);

``dataShareJoined`` (Optional)
    A JavaScript function.
    Callback function, called asynchronously once the joined to the ``dataShare`` object.
    Called with the following properties:

    ``success``
        A JavaScript boolean.
        True, if the current player successfully joined the data share.
        False, if the data share is not :ref:`joinable <datashare_setjoinable>`.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

The user must be joined to the data share before calling
:ref:`getKeys <datashare_getkeys>`,
:ref:`get <datashare_get>`,
:ref:`set <datashare_set>`
or :ref:`compareAndSet <datashare_compareandset>` functions.
Once the game has finished using a ``dataShare`` object it must call :ref:`dataShare.leave <datashare_leave>`.

The :ref:`dataShare.users <datashare_users>` property is updated on a successful join operation.

.. NOTE::
    Calling :ref:`dataShareManager.createDataShare <datasharemanager_createdatashare>` automatically joins the user to
    the created data share.

.. NOTE::
    The :ref:`dataShare.users <datashare_users>` property is updated atomically.
    This means that the ``users`` property always lists the users in the order that they joined and that any other
    users who join after the current user will not be listed.

.. index::
    pair: DataShare; leave

.. _datashare_leave:

`leave`
-------

**Summary**

Leave the :ref:`DataShare <datashare>`.

**Syntax** ::

    function dataShareLeaveCallback() {}
    dataShare.leave(dataShareLeaveCallback, errorCallback);

``dataShareLeaveCallback`` (Optional)
    A JavaScript function.
    Callback function, called asynchronously once the user is removed from the ``dataShare`` object.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

Once the game has finished using a ``dataShare`` object it must call :ref:`dataShare.leave <datashare_leave>`.
Once all joined players leave a ``dataShare`` object it will be deleted
(so there is no need to manually delete the keys).

After calling ``dataShare.leave`` the ``dataShare`` object should not be used again.

.. NOTE::
    The owner of the ``dataShare`` object is joined automatically when they call
    :ref:`DataShareManager.createDataShare <datasharemanager_createdatashare>` but ``dataShare.leave`` should still be
    called once the owner has finished with the ``dataShare``.

.. index::
    pair: DataShare; setJoinable

.. _datashare_setjoinable:

`setJoinable`
-------------

**Summary**

Allow other players to join the data share.

**Syntax** ::

    function setJoinableCallback() {}
    dataShare.setJoinable(joinable, setJoinableCallback, errorCallback);

``joinable``
    A JavaScript boolean.
    Set the joinable flag to this value.

``setJoinableCallback`` (Optional)
    A JavaScript function.
    Callback function, called asynchronously once the user is removed from the ``dataShare`` object.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

Allow other players to join the data share.
On creation of the data share this flag is set to true.

When this flag is set to false, other users will not be able to :ref:`find <datasharemanager_finddatashares>` this data
share (with the exception of users who are already :ref:`joined <datashare_join>` to this data share).
This can be used, for example, to stop new players from joining after the maximum number of players have joined.

.. index::
    pair: DataShare; getKeys

.. _datashare_getkeys:

`getKeys`
---------

**Summary**

Find all of the keys set for the :ref:`DataShare <datashare>` key-value store.

**Syntax** ::

    function dataShareGetKeysCallback(stores) {}
    dataShare.getKeys(dataShareGetKeysCallback, errorCallback);

``dataShareGetKeysCallback``
    A JavaScript function.
    Callback function, called asynchronously with the key summary data from the ``dataShare`` object.
    Called with the first 64 key ``stores`` which an list of summary data objects with the following properties:

    ``ownedBy``
        A JavaScript string.
        The username of the first user to set the data for key ``key``.
        This is reset when the key is removed.

    ``access``
        Either :ref:`DataShare.publicReadOnly <datashare_publicreadonly>` or
        :ref:`DataShare.publicReadAndWrite <datashare_publicreadandwrite>`.
        The write access for key ``key``.

    Note that, to save bandwidth and memory, it does not contain ``value`` for any of the keys.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

.. NOTE::
    The user must be :ref:`joined <datashare_join>` to the data share before calling :ref:`getKeys <datashare_getkeys>`.

.. index::
    pair: DataShare; get

.. _datashare_get:

`get`
-----

**Summary**

Get a value from the :ref:`DataShare <datashare>` key-value store.

**Syntax** ::

    function dataShareGetCallback(store) {}
    dataShare.get(key, dataShareGetCallback, errorCallback);

``key``
    A JavaScript string.
    The key to get in the data share key-value store.

``dataShareGetCallback``
    A JavaScript function.
    Callback function, called asynchronously with the data from the ``dataShare`` object.
    Called with ``store`` which is either ``null`` if no value has been set or an object with the following properties:

    ``ownedBy``
        A JavaScript string.
        The username of the first user to set the data for key ``key``.
        This is reset when the key is removed.

    ``value``
        A JavaScript string.
        The value stored for key ``key`` see :ref:`set <datashare_set>` and
        :ref:`compareAndSet <datashare_compareandset>` functions.

    ``access``
        Either :ref:`DataShare.publicReadOnly <datashare_publicreadonly>` or
        :ref:`DataShare.publicReadAndWrite <datashare_publicreadandwrite>`.
        The write access for key ``key``.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

.. NOTE::
    The user must be :ref:`joined <datashare_join>` to the data share before calling :ref:`get <datashare_get>`.

.. index::
    pair: DataShare; set

.. _datashare_set:

`set`
-----

**Summary**

Set a :ref:`public read only <datashare_publicreadonly>` value in the :ref:`DataShare <datashare>` key-value store.

**Syntax** ::

    function dataShareSetCallback(wasSet, reason) {}
    dataShare.set({
            key: 'apples',
            value: '3',
            callback: dataShareSetCallback,
            errorCallback: errorCallback
        });

``key``
    A JavaScript string.
    The key to set in the data share key-value store.

``value``
    A JavaScript string.
    The value to set for key ``key``.
    Setting ``value`` to an empty string will delete the key-value.

``dataShareSetCallback`` (Optional)
    A JavaScript function.
    Callback function, called asynchronously with:

    ``wasSet``
        A JavaScript boolean.
        True, if the data was successfully set.
        False otherwise, the reason it could not be set is specified in ``reason``.

    ``reason``
        A reason string from :ref:`DataShare.notSetReason <datashare_notsetreason>` or ``undefined`` if ``wasSet`` is
        true.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

.. NOTE::
    The user must be :ref:`joined <datashare_join>` to the data share before calling :ref:`set <datashare_set>`.

.. NOTE::
    ``DataShare.compareAndSet`` can only be used on keys with
    :ref:`public read only <datashare_publicreadonly>` access values.
    For more information see the :ref:`datashare access example <datashare_access_example>`.

.. index::
    pair: DataShare; compareAndSet

.. _datashare_compareandset:

`compareAndSet`
---------------

**Summary**

Set a :ref:`public read and write <datashare_publicreadandwrite>` value in the :ref:`DataShare <datashare>` key-value
store if it has not been set by another user since the last :ref:`dataShare.get <datashare_get>` request for the
same key.

**Syntax** ::

    function dataShareSetCallback(wasSet, reason) {}
    dataShare.compareAndSet({
            key: 'apples',
            value: '3',
            callback: dataShareSetCallback,
            errorCallback: errorCallback
        });

    // example callback usage:
    function dataShareSetCallback(wasSet, reason)
    {
        if (!wasSet && reason === DataShare.notSetReason.changed)
        {
            // unable to set key because it has changed since the last dataShare.get('apples') request
        }
    }

``key``
    A JavaScript string.
    The key to set in the data share key-value store.

``value``
    A JavaScript string.
    The value to set for key ``key``.
    Setting ``value`` to an empty string will delete the key-value.

``dataShareSetCallback`` (Optional)
    A JavaScript function.
    Callback function, called asynchronously with:

    ``wasSet``
        A JavaScript boolean.
        True, if the data was successfully set.
        False otherwise, the reason it could not be set is specified in ``reason``.

    ``reason``
        A reason string from :ref:`DataShare.notSetReason <datashare_notsetreason>` or ``undefined`` if ``wasSet`` is
        true.

``errorCallback`` :ref:`(Optional) <datasharemanager_errorcallback>`

The ``reason`` argument will return ``DataShare.notSetReason.changed`` if the key has been set by another user
since the key was last read with :ref:`dataShare.get <datashare_get>`.

.. NOTE::
    The user must be :ref:`joined <datashare_join>` to the data share before calling ``DataShare.compareAndSet``.

.. NOTE::
    ``DataShare.compareAndSet`` can only be used on keys with
    :ref:`public read and write <datashare_publicreadandwrite>` access values.
    For more information see the :ref:`datashare access example <datashare_access_example>`.

.. index::
    pair: DataShare; isJoined

.. _datashare_isjoined:

`isJoined`
----------

**Summary**

Check if a user is joined to the data share.

**Syntax** ::

    dataShare.isJoined(username);

``username``
    A JavaScript string.
    The username to check.

Returns a JavaScript boolean.
Useful to filter out data shares that the current user is already joined to.
See the :ref:`finding data shares <datashare_isjoined_example>` example.

Properties
==========

.. index::
    pair: DataShare; id

.. _datashare_id:

`id`
----

**Summary**

A globally unique id for this data share (this is the same for all users).

**Syntax** ::

    var id = dataShare.id;

A JavaScript string.
Useful when sending notifications (see :ref:`NotificationsManager <notificationsmanager>`) so the receiving user knows
which data share the notification is about.

.. NOTE::
    This property is read only.

.. index::
    pair: DataShare; publicReadOnly

.. _datashare_publicreadonly:

`publicReadOnly`
----------------

**Summary**

Public read only flag returned by :ref:`dataShare.get <dataShare_get>` and :ref:`dataShare.getKeys <datashare_getkeys>`
functions.

**Syntax** ::

    var publicReadOnly = DataShare.publicReadOnly;

To set a key with ``DataShare.publicReadOnly`` access use the :ref:`dataShare.set <datashare_set>` function.
The :ref:`dataShare.compareAndSet <datashare_compareandset>` function cannot be used on ``DataShare.publicReadOnly``
keys.

A JavaScript number.

.. NOTE::
    This property is read only.

.. index::
    pair: DataShare; publicReadAndWrite

.. _datashare_publicreadandwrite:

`publicReadAndWrite`
--------------------

**Summary**

Public read and write flag returned by :ref:`dataShare.get <dataShare_get>` and
:ref:`dataShare.getKeys <datashare_getkeys>` functions.

**Syntax** ::

    var publicReadAndWrite = DataShare.publicReadAndWrite;

To set a key with ``DataShare.publicReadAndWrite`` access use the
:ref:`dataShare.compareAndSet <datashare_compareandset>` function.
The :ref:`dataShare.set <datashare_set>` function cannot be used on ``DataShare.publicReadAndWrite``
keys.

A JavaScript number.

.. NOTE::
    This property is read only.

.. index::
    pair: DataShare; notSetReason

.. _datashare_notsetreason:

`notSetReason`
--------------

**Summary**

A dictionary of reasons why a :ref:`set <datashare_set>` or :ref:`compareAndSet <datashare_compareandset>` operation
could not be achieved.

**Syntax** ::

    var notSetReason = DataShare.notSetReason;

    // example usage:
    function dataShareSetCallback(wasSet, reason)
    {
        if (!wasSet && reason === DataShare.notSetReason.changed)
        {
            // unable to set key because it has changed since the last dataShare.get('apples') request
        }
    }
    dataShare.compareAndSet({
            key: 'apples',
            value: '3',
            callback: dataShareSetCallback,
            errorCallback: errorCallback
        });
    // or
    dataShare.set({
            key: 'apples',
            value: '3',
            callback: dataShareSetCallback,
            errorCallback: errorCallback
        });

The ``notSetReason`` properties are:

.. _datashare_notsetreason_changed:

``changed``
    The key could not be set for the :ref:`compareAndSet <datashare_compareandset>` function
    because it has changed since the last :ref:`get <datashare_get>` request for the same key.

.. _datashare_notsetreason_readonly:

``readOnly``
    The key could not be set as it is read only.
    When :ref:`publicReadOnly <datashare_publicreadonly>` access is set:

    - Only the :ref:`dataShare.set <datashare_set>` function can be used to set the key
      value (:ref:`dataShare.compareAndSet <datashare_compareandset>` cannot be used).
    - Only the owner of a key can set the value for a read only key.

.. _datashare_notsetreason_readandwrite:

``readAndWrite``
    When :ref:`publicReadAndWrite <datashare_publicreadandwrite>` access is set
    only the :ref:`dataShare.compareAndSet <datashare_compareandset>` function can be used to set the key value
    (:ref:`dataShare.set <datashare_set>` cannot be used).

.. NOTE::
    This property is read only.

.. index::
    pair: DataShare; created

.. _datashare_created:

`created`
---------

**Summary**

The UTC time since epoch in seconds that the data share was created.

**Syntax** ::

    var created = dataShare.created;

A JavaScript number.

.. NOTE::
    This property is read only.

.. index::
    pair: DataShare; owner

.. _datashare_owner:

`owner`
-------

**Summary**

The username of the creator of the data share.

**Syntax** ::

    var owner = dataShare.owner;

A JavaScript string.

.. NOTE::
    This property is read only.

.. index::
    pair: DataShare; users

.. _datashare_users:

`users`
-------

**Summary**

A list of user's usernames joined to the data share.

**Syntax** ::

    var users = dataShare.users;
    var username = users[0];

A JavaScript array of strings.
This list is in order of joining with the first to join the datashare (normally the owner if they have not left the datashare) at index 0 and
the last user to join the datashare at the end.

.. NOTE::
    This property is only updated on calls to
    :ref:`dataShareManager.createDataShare <datasharemanager_createdatashare>`,
    :ref:`dataShareManager.findDataShares <datasharemanager_finddatashares>` and :ref:`dataShare.join <datashare_join>`.

.. NOTE::
    This property is read only.

.. index::
    pair: DataShare; joinable

.. _datashare_joinable:

`joinable`
----------

**Summary**

True, if a data share can be joined.
False, otherwise.

**Syntax** ::

    var joinable = dataShare.joinable;

A JavaScript boolean.
See :ref:`setJoinable <datashare_setjoinable>` to set this property.
If false, then the ``dataShare`` object will not be returned by
:ref:`DataShareManager.findDataShares <datasharemanager_finddatashares>` if the current user is not joined to the data
share.

.. NOTE::
    This property is read only.

.. _datasharemanager_errorcallback:

Error callback
==============

If no error callback is given then the :ref:`DataShareManager.create <turbulenzservices_createstoremanager>`
``errorCallbackFn`` is used.

**Summary**

A JavaScript function.
Returns an error message and its HTTP status.

**Syntax** ::

    function errorCallbackFn(errorMsg, httpStatus, calledByFn, calledByParams) {}

``errorMsg``
    A JavaScript string.
    The error message.

``httpStatus``
    A JavaScript number.
    You can find a list of common status codes here - http://en.wikipedia.org/wiki/List_of_HTTP_status_codes

``calledByFn``
    A JavaScript function.
    The function that threw the error.

``calledByParams``
    A JavaScript array of the parameters given to the function that threw the error.
