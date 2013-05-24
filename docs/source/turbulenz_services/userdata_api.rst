.. index::
    single: UserDataManager

.. _userdatamanager:

.. highlight:: javascript

--------------------------
The UserDataManager Object
--------------------------

The UserDataManager object is an API for creating and loading save games and storing user settings.

UserData shouldn't be confused with the
:ref:`public game profiles API<gameprofilemanager>` (for a public game profile),
:ref:`data share API<datasharemanager>` (for multiplayer save games),
:ref:`badges API<badgemanager>` (for achievements) or
:ref:`leaderboards API<leaderboardmanager>` (for high scores).
UserData is separate from the badges and leaderboards in that it is designed to only be accessed from inside a game.

**Required scripts**

The ``UserDataManager`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/
    /*{{ javascript("jslib/services/userdatamanager.js") }}*/

.. _working_with_http:

Working with HTTP requests
==========================

The TurbulenzServices JavaScript library and its objects all communicate with Turbulenz Services over an HTTP connection.
:ref:`User data <userdatamanager>` and :ref:`data shares <datasharemanager>` make HTTP requests for each get or set function call.
For these API's it is up to the developer to decide how to use the key-value store effiecently
Subsequently, in order to decrease loading times and bandwidth required you should be aware of HTTP requests and their limitations.

There are several aspects of HTTP behavior developers should be aware of:

* Before any communication can take place, a connection needs to be established.
* Setting up a connection can potentially take a long time.
* Connections could be limited to a maximum number of requests before they have to be closed.
* Connections are limited to a maximum time before they have to be closed.
* Browsers can make multiple connections at the same time, normally browsers will allow 2-8 connections (depending on the browser) to the same server.
* HTTP request headers are large blocks of text that have a considerable overhead on each request (usually more than 512 bytes in size).

These rules mean that in order to make the most use of Turbulenz Services you will have to think carefully about the request sizes and number of requests you make.
A single large request will not take advantage of the multiple connections.
Equally, lots of small requests will have a higher chance of requiring a connection restart and will have a higher HTTP request header overhead.

Subsequently, it is preferable to split large requests into several smaller requests to maximize throughput.
Lots of small requests (<1KB) should be grouped into several larger requests to minimize HTTP request header overhead.

.. NOTE::
  A request that is smaller than 1KB should not be split as multiple request headers will require more than 1KB.
  An exception to this rule is when splitting the request means that only one of the requests needs to be made.

Usage guidelines
================

.. _userdata_key_value_store:

**The key-value system**

The :ref:`HTTP model <working_with_http>` requires a different way of thinking about save data.
An online model no longer suits a single large save game object and Turbulenz Services encourage developers to break their save game data into small transactions.
In order to allow you to take advantage of the HTTP model Turbulenz has provided a key-value system for saving user data.
This allows you to split your own save games into parts.
When the game is ready to save only the key-value pairs that have changed need to be updated.
This will lower the amount of data that needs to be uploaded for each save.

.. _userdatamanager_connected_game_states:

**Security**

All calls to the UserData API are expected to be protected.
This means that any POST requests made must be encrypted and signed and any GET requests must be signed.
When using the UserDataManager this is handled automatically.

**Don't separate connected game states**

Be aware that network errors or users closing their browsers during a sequence of set and remove operations can result
in some operations being completed while others are left uncompleted.
This can cause problems, for example setting the following key-value pairs after an in-game transaction buying a banana::

    {
        items: {
            apples: 5,
            bananas: 46,
            pears: 3
        },
        character: {
            credits: 7843,
            level: 15
        }
    }

If the connection is lost after the items key has been set then the player gets the banana and gets to keep their money!
If the connection is lost after the character key has been set then the player doesn't get the banana and loses their money!

This can be addressed by rearranging the structure of the item and character values::

    {
        items: {
            credits: 7843,
            apples: 5,
            bananas: 46,
            pears: 3
        },
        character: {
            level: 15
        }
    }

Now both keys are completely unrelated and are safe to set separately (assuming fruits or credits can't be traded in someway to alter character level).

Keys in this system are restricted to alphanumeric characters separated by either hyphens or dots.

**Checkpoints and Autosaves**

Try to save at regular intervals as the user could close the browser or lose their connection at anytime.

**Profiles and Metadata**

To avoid loading unneeded information Turbulenz Services encourage you to use known key names for general settings such as profiles.
For example with key value pairs::

    {
        'currentProfile':       'Alice',
        'Alice.currentLevel':   'Some very large JSON string',
        'Alice.characterStats': 'Some very large JSON string',
        'Alice.items':          'Some very large JSON string',
        'Bob.currentLevel':     'Some very large JSON string',
        'Bob.characterStats':   'Some very large JSON string',
        'Bob.items':            'Some very large JSON string',
    }

You can avoid getting all of Bob's profile information by checking the ``currentProfile`` key first.
The ``currentProfile`` value can then be perpended to the rest of the keys for the remaining requests.

**Testing**

The user data for your game can be :ref:`viewed on the local server <viewing_userdata>`

**Manually editing/removing user data**

You can find the UserData saves in ``devserver/localdata/userdata/{game-slug}/{user-name}/{userdata-key}.txt``.
Each file contains the string that has been set by :ref:`UserDataManager.set <userdatamanager_set>`.

To edit the user data stop the local server and then edit this file.
To remove all user data for a game stop the local server and remove the ``devserver/localdata/userdata/{game-slug}`` directory.
To remove all user data for a user stop the local server and remove the ``devserver/localdata/userdata/{game-slug}/{user-name}`` directory.

Examples
========

Creating the UserDataManager object and saving strings::

    var userDataManager;
    var saveComplete = false;

    function saveString()
    {
        function stringSavedFn(key)
        {
            saveComplete = true;
        }

        var key = 'hello';
        var value = 'world';

        userDataManager.set(key, value, stringSavedFn)
    }

    function sessionReadyFn(gameSession)
    {
        userDataManager = UserDataManager.create(requestHandler, gameSession);
    }
    var gameSession = TurbulenzServices.createGameSession(requestHandler, sessionReadyFn);

Loading strings::

    var loadComplete = false;

    function loadString()
    {
        function stringLoadedFn(key, value)
        {
            loadComplete = true;
        }

        var key = 'hello';
        userDataManager.get(key, stringLoadedFn);
    }

Using JSON.stringify to save more complex objects::

    var complexObject = {
        "a": "complex object",
        "can": {
            "have": ["any", "structure", {
                "we want": 438
            }]
        }
    };

    userDataManager.set(key, JSON.stringify(complexObject), stringSavedFn)

And JSON.parse to load them back as complex objects::

    userDataManager.get(key, function getComplexObjectValueFn(key, value)
        {
            var complexObject = JSON.parse(value);
            ...
        });

Saving multiple independent objects::

    var spaceLevel = {
        starsCollected: 5,
        ringsCollected: 8
    };
    var homeLevel = {
        starsCollected: 15,
        ringsCollected: 12
    };
    var character = {
        health: 30,
        level: 15
    };

    var itemsSaved = false;
    var characterSaved = false;

    var saveComplete = false;
    var savesRemaining;
    function saveCompleteFn(key)
    {
        savesRemaining =- 1;
        if (savesRemaining === 0)
        {
            saveComplete = true;
        }
    }

    function save()
    {
        savesRemaining = 3;
        userDataManager.set('spaceLevel', JSON.stringify(spaceLevel), saveCompleteFn);
        userDataManager.set('homeLevel', JSON.stringify(homeLevel), saveCompleteFn);
        userDataManager.set('character', JSON.stringify(character), saveCompleteFn);
    }

    var userDataManager;
    function sessionReadyFn(gameSession)
    {
        userDataManager = UserDataManager.create(requestHandler, gameSession);
    }
    var gameSession = TurbulenzServices.createGameSession(requestHandler, sessionReadyFn);

    ...

    if (userDataManager)
    {
        save();
    }


.. NOTE::
    This example is wasteful as each object saved is smaller than :ref:`the HTTP header size <working_with_http>`.
    In your game you should merge keys with small value sizes into one object.

.. NOTE::
    It also assumes that stars and rings cannot be traded for character level or health
    therefore avoiding :ref:`connected game states <userdatamanager_connected_game_states>`.

Constructor
===========

.. index::
    pair: UserDataManager; create

.. _userdatamanager_create:

`create`
--------

**Summary**

Creates a UserDataManager object.
**Syntax** ::

    var userDataManager = UserDataManager.create(requestHandler, gameSession, defaultErrorCallbackFn);

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``gameSession``
    A :ref:`GameSession <gamesession>` object.

``defaultErrorCallbackFn`` :ref:`(Optional) <turbulenzservices_errorcallbackfn>`
    The default :ref:`error callback function <userdatamanager_errorcallback>` that is called for any UserDataManager
    functions that do not specify their own error callback function.

Returns a UserDataManager object or if the Turbulenz Services are unavailable returns ``null``.

Methods
=======

.. index::
    pair: UserDataManager; get

.. _userdatamanager_get:

`get`
-----

**Summary**

Get the value for a UserData key.

.. note:: This is a :ref:`signed API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(key, value) {}
    userDataManager.get(key, callbackFn, errorCallbackFn);

``value``
    A JavaScript string.
    The value for this key.
    If the key does not exist this is ``null``.

``key``
    A JavaScript string.
    The key to get.

``callbackFn``
    A JavaScript function.
    Called on receipt of the request from the Turbulenz Services.

``errorCallbackFn`` :ref:`(Optional) <userdatamanager_errorcallback>`

.. index::
    pair: UserData; set

.. _userdatamanager_set:

`set`
-----

**Summary**

Set the value for a UserData key.

.. note:: This is an :ref:`encrypted API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(key) {}
    userdataManager.set(key, value, callbackFn, errorCallbackFn);

``value``
    A JavaScript string.
    The value for this key.
    If the value is an empty string (``null``, ``undefined``, or ``""``) then a remove operation is applied.
    This means that when a get is called after an empty string is set then ``null`` is returned.

``key``
    A JavaScript string.
    The key to set.
    Keys in this system are restricted to alphanumeric characters separated by either hyphens or dots.

``callbackFn``
    A JavaScript function.
    Called on successful write of the key-value.

``errorCallbackFn`` :ref:`(Optional) <userdatamanager_errorcallback>`

If the value is null or undefined then the key will be removed and a call to exists with this key will give false.

.. index::
    pair: UserDataManager; exists

`exists`
--------

**Summary**

Check if a UserData key exists.

.. note:: This is a :ref:`signed API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(key, exists) {}
    userDataManager.exists(key, callbackFn, errorCallbackFn);

``key``
    A JavaScript string.
    The key to check.

``exists``
    A JavaScript boolean.

``callbackFn``
    A JavaScript function.
    Called on receipt of the request from the Turbulenz Services.

``errorCallbackFn`` :ref:`(Optional) <userdatamanager_errorcallback>`

Returns true if the key exists.
Returns false if the key doesn't exist, has value null or undefined.

.. WARNING::
    This function should only be used in the case that you only need to know if a ``key`` exists but do not want its contents.
    Otherwise, you should call ``UserDataManager.get`` which will give a ``null`` result in its callback if the ``key`` doesn't exist.
    This avoids 2 requests when only one is necessary.

.. index::
    pair: UserDataManager; remove

`remove`
--------

**Summary**

Remove a UserData key.

.. note:: This is an :ref:`encrypted API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(key) {}
    userDataManager.remove(key, callbackFn, errorCallbackFn);

``key``
    A JavaScript string.
    The key to get.

``callbackFn``
    A JavaScript function.
    Called on receipt of the request from the Turbulenz Services.

``errorCallbackFn`` :ref:`(Optional) <userdatamanager_errorcallback>`

.. index::
    pair: UserDataManager; removeAll

`removeAll`
-----------

**Summary**

Remove all UserData for this user.

.. note:: This is an :ref:`encrypted API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn() {}
    userDataManager.removeAll(callbackFn, errorCallbackFn);

``callbackFn``
    A JavaScript function.
    Called on receipt of the request from the Turbulenz Services.

``errorCallbackFn`` :ref:`(Optional) <userdatamanager_errorcallback>`

.. index::
    pair: UserDataManager; getKeys

.. _userdatamanager_getkeys:

`getKeys`
---------

**Summary**

Get a list of all UserData keys.

.. note:: This is a :ref:`signed API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(keyArray) {}
    userDataManager.getKeys(callbackFn, errorCallbackFn);

    //example usage:
    function getKeysCallbackFn(keyArray)
    {
        var keyArrayLength = keyArray.length;
        for (var i = 0; i < keyArrayLength; i += 1)
        {
            var key = keyArray[i];
            // do stuff with keys
        }
    }

    userDataManager.getKeys(getKeysCallbackFn);

``keyArray``
    A JavaScript array of strings.
    This array contains the all of the UserData keys.

``callbackFn``
    A JavaScript function.
    Called on receipt of the list from the Turbulenz Services.

``errorCallbackFn`` :ref:`(Optional) <userdatamanager_errorcallback>`

This is a debugging function.
Key strings should be known in advance, there should be no need to use this function in a release build.


Properties
==========

.. index::
    pair: UserDataManager; service

.. _userdatamanager_service:

`service`
---------

**Summary**

The :ref:`ServiceRequester <servicerequester>` object for the ``userdata`` service.

**Syntax** ::

    var serviceRequester = userDataManager.service;

.. _userdatamanager_errorcallback:

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
