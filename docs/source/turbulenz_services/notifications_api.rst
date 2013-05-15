.. index::
    single: NotificationsManager

.. _notificationsmanager:

.. highlight:: javascript

-------------------------------
The NotificationsManager Object
-------------------------------

The NotificationsManager object provides the API for setting up and controlling Turbulenz Notifications (short text messages) from your game.

Game Notifications can be sent in two ways: instantly to anybody on Turbulenz.com or time-delayed back to the sender. This allows for example sending reminders about game-events.

Game Notifications, just like other Turbulenz Notifications, can appear in the 'Notifications Panel' on `turbulenz.com <https://turbulenz.com>`_ (site notifications), and emails sent to the user. Additionally games can register a callback-function to react to game-notifications arriving while the player is playing.

Each registered Turbulenz user has settings to control whether they receive notifications or not.
These can be found on the 'Notification Settings' panel on `turbulenz.com <https://turbulenz.com>`_ called 'Game Actions'.
Site notifications and email can be separately controlled.
A user has to be a 'follower' of a game to receive notifications from it.

**Required scripts**

The ``NotificationsManager`` object requires::

    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/
    /*{{ javascript("jslib/services/notificationsmanager.js") }}*/
    /*{{ javascript("jslib/services/sessiontoken.js") }}*/

Use cases
=========

Some examples of notifications are

- 'Your construction is complete' (for a game where building things takes longer than a single play session)
- 'You are under attack' (for a game where other players can attack a user that is not currently playing the game)
- 'It's your turn' (for a turn-based game)


Usage guidelines
================

The NotificationsManager allows sending short messages to users to keep them informed about game events that occur when they are not currently playing your game. (If the user is currently playing your game then notifications are surpressed, but the game itself can register a callback function with the NotificationsManager to define how it wants to react to a notification)

- Notifications have to be of a certain type (called "key") that is specified in a file called gamenotifications.yaml
- Any text sent will need to be localized by your game so users can read the notification in their own language.
- Delayed notifications can only be sent to the current player. Up to 8 delayed notifications can be stacked up per sender/recpient and game. Only the first and last will be sent via email, but the rest will still appear in the notification panel.
- Instant notifications can be sent to any follower of a game. Only 1 instant notification can be stacked up per sender, recipient and game.
- Outstanding notifications are wiped clean when the recipient logs back into the game.
- Delivery of a notification can be cancelled by the sender via its id or by key by the recipient.


Examples
========

Sending a delayed notification (for 5 minutes from now) to the current user::

    var promise = gameNotificationsManager.sendDelayedNotification({
        key: 'gameprogress',                            // a type specified in gamenotifications.yaml
        msg: {text: 'Your crop is ready to harvest'},   // a message object
        delay: 300,                                     // the delay until the message is sent in seconds
    });


Sending an instant notification to a partner::

    var promise = gameNotificationsManager.sendInstantNotification({
        key: 'turn',                        // a type specified in gamenotifications.yaml
        msg: {text: 'Your turn Peter!'},    // a message object
        recipient: 'peter',                 // the recipient
    });

Notes
=====

Creating a notification is an asynchronous process. The returned 'promise'-object is your link to it. It exposes the
functions 'success' and 'error' which allow you to define callback-functions for both eventualities (note that both
'success' and 'error' return the promise object itself, allowing you to do function-chaining like this)::

    promise
        .success(function (id) {

            ...     // save the notification-id in case you want to cancel the notification later

        })
        .error(function (e) {

            ...     // analyse e.status or e.error
                    // the send***Notification functions throw an error if they are called with an invalid params
                    // object, so this should only ever happen if the server could not be reached for some.
        });

You can also cancel a notification directly on the promise-object, instead of having to store the id::

    promise.cancel();

Constructor
===========

.. index::
    pair: NotificationsManager; create

.. _notificationsmanager_create:

`create`
---------

**Summary**

Creates a NotificationManager object. This object provides the interface for all the game notification features.

**Syntax** ::

    var gameNotificationsManager = TurbulenzServices.createNotificationsManager(requestHandler, gameSession, successCallbackFn, errorCallbackFn);

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``gameSession``
    A :ref:`GameSession <gamesession>` object.

``successCallbackFn`` (Optional)
    If creation is successful, this function is called with the new 'gameNotificationsManager' as a parameter.

``errorCallbackFn`` (Optional)
    A JavaScript function.
    If creation fails due to an api-call failing, a single argument is passed to the function, a JavaScript object
    with the following properties:

    ``error``
        Contains a string with information about the occured error.

    ``status``
        Contains the error status (404, 400, etc)
        You can find a list of common status codes here - http://en.wikipedia.org/wiki/List_of_HTTP_status_codes

Returns a NotificationsManager object or if the Turbulenz Services are unavailable returns ``null``.

Methods
=======

.. index::
    pair: NotificationsManager; sendInstantNotification

.. _notificationsmanager_sendInstantNotification:

`sendInstantNotification`
-------------------------

**Summary**

Sends an instant notification to a user.

**Syntax** ::


    var params = {
        key: key,
        msg: message,
        recipient: string
    };

    var promise = gameNotificationsManager.sendInstantNotification(params);

``promise``
    A promise object.
    The promise object takes callbacks to keep track of the process.

``key``
    A JavaScript string.
    The key of the notification to be sent. Must be specified in :ref:`gamenotifications.yaml <notificationsmanager_gamenotifications_yaml>`

``msg``
    A JavaScript object.
    Must contain a 'text' property, optionally can contain additional properties.
    This text will be used for the site notification and email, with ' in <GAME>' appended, where <GAME> is the title of your game.
    There is a special control property 'noNotification', which if present prevents this notification sending email or appearing in the users notification panel.
    (This can be used to send messages directly to an active game, with none of the associated email or gamesite features.)

``recipient`` (Optional)
    String.
    The Turbulenz username of the person to receive this notification.
    Defaults to the current user's username.


.. index::
    pair: NotificationsManager; sendDelayedNotification

.. _notificationsmanager_sendDelayedNotification:

`sendDelayedNotification`
-------------------------

**Summary**

Sends a delayed notification to the current user.

**Syntax** ::

    var params = {
        key: key,
        msg: message,
        delay: integer
    };

    var promise = gameNotificationsManager.sendDelayedNotification(params);

``promise``
    A promise object.
    The promise object takes callbacks to keep track of the process and to receive the notification's id.
    The id is used for cancelling a notification by id.
    See :ref:`cancelNotificationByID <notificationsmanager_cancelNotificationByID>`

``key``
    A JavaScript string.
    The key of the notification to be sent. Must be specified in :ref:`gamenotifications.yaml <notificationsmanager_gamenotifications_yaml>`

``msg``
    A JavaScript object.
    Must contain a 'text' property, optionally can contain additional properties.
    This text will be used for the site notification and email, with ' in <GAME>' appended, where <GAME> is the title of your game.
    There is a special control property 'noNotification', which if present prevents this notification sending email or appearing in the users notification panel.
    (This can be used to send messages directly to an active game, with none of the associated email or gamesite features.)

``delay`` (Optional)
    Integer.
    Number of seconds until the notification is sent.
    Defaults to 0.

.. index::
    pair: NotificationsManager; cancelNotificationByID

.. _notificationsmanager_cancelNotificationByID:

`cancelNotificationByID`
---------------------------

**Summary**

Cancels a single notification, given the notification_id. This allows cancelling of a pending notification.

**Syntax** ::

    gameNotificationsManager.cancelNotificationByID(notification_id);

``notification_id``
    A JavaScript string.
    This is the id returned by the promise.success callback from :ref:`send***Notification <notificationsmanager_sendInstantNotification>`

.. index::
    pair: NotificationsManager; cancelNotificationsByKey

.. _notificationsmanager_cancelNotificationsByKey:

`cancelNotificationsByKey`
-----------------------------

**Summary**

Cancels all of the current users pending notifications that have the specified key.

**Syntax** ::

    gameNotificationsManager.cancelNotificationsByKey(key);

``key``
    A JavaScript string.
    The key of notification to be cancelled. Keys are specified in :ref:`gamenotifications.yaml <notificationsmanager_gamenotifications_yaml>`

.. index::
    pair: NotificationsManager; cancelAllNotifications

.. _notificationsmanager_cancelAllNotifications:

`cancelAllNotifications`
---------------------------

**Summary**

Cancels all of the current users pending notifications.

**Syntax** ::

    gameNotificationsManager.cancelAllNotifications();

.. index::
    pair: NotificationsManager; addNotificationListener

.. _notificationsmanager_addNotificationListener:

`addNotificationListener`
----------------------------

**Summary**

Adds a listener callback function for notifications with the specified key to the current user.
This allows the game to react to a notification arriving while the player is playing.

**Syntax** ::

    function listenFn(notification) {}
    gameNotificationsManager.addNotificationListener(key, listenFn);

``key``
    A JavaScript string.
    The key of notification to be listened to. Keys are specified in :ref:`gamenotifications.yaml <notificationsmanager_gamenotifications_yaml>`

``listenFn``
    A JavaScript function.
    This function receives the notification data as a single object parameter, which has the following properties:

    ``type``
        This is always set to: 'notify_game'.
    ``key``
        The game key of this notification. (key from gamenotifications.yaml)
    ``sender``
        The username of the user who sent the notification.
    ``msg``
        The message body of the notification, this is the 'msg' parameter of :ref:`send***Notification <notificationsmanager_sendInstantNotification>` or
    ``sent``
        The time the notification was sent out in seconds since 1970

.. index::
    pair: NotificationsManager; removeNotificationListener

.. _notificationsmanager_removeNotificationListener:

`removeNotificationListener`
--------------------------------

**Summary**

Removes a listener callback function for notifications with the specified key.

**Syntax** ::

    gameNotificationsManager.removeNotificationListener(key, listenFn);

``key``
    A JavaScript string.
    The key of notification for the listener function to be removed from.

``listenFn``
    A JavaScript function.
    This is the same function specified in a previous :ref:`addNotificationListener <notificationsmanager_addNotificationListener>`

.. index::
    pair: NotificationsManager; requestUserNotificationSettings

.. _notificationsmanager_requestUserNotificationSettings:

`requestUserNotificationSettings`
-------------------------------------

**Summary**

Gets the current user's notification settings for receiving notifications per email or on Turbulenz.com (1 for enabled, 0 for disabled).

For now, the Local Server and Hub will return dummy-data that corresponds to the default settings for each user on the gamesite::

    email_setting: 1
    site_setting: 1

However, on the Local Server this data stems from a file called 'notificationsettings.yaml' which is automatically created in your localdata/notifications folder.

This allows testing any error-messages, e.g. by corrupting the file. It will automatically get restored after the first error.

**Syntax** ::

    function successFn(data) {}
    gameNotificationsManager.requestUserNotificationSettings(successFn, errorFn);

``successFn``
    A JavaScript function.
    A single argument is passed to the function, a JavaScript object with the following properties:

    ``email_setting``
        Contains an int with value 1 or 0 if the users Game Action notifications settings allow email notifications.

    ``site_setting``
        Contains an int with value 1 or 0 if the users Game Action notifications settings allow notifications on `turbulenz.com <https://turbulenz.com>`_

``errorFn`` (Optional)
    A JavaScript function.
    A single argument is passed to the function, a JavaScript object with the following properties:

    ``error``
        Contains a string with information about the occured error.

    ``status``
        Contains the error status (404, 400, etc)
        You can find a list of common status codes here - http://en.wikipedia.org/wiki/List_of_HTTP_status_codes

.. index::
    pair: NotificationsManager; requestGameNotificationKeys

.. _notificationsmanager_requestGameNotificationKeys:

`requestGameNotificationKeys`
---------------------------------

**Summary**

Gets the current games's notification keys.

**Syntax** ::

    function successFn(data) {}
    gameNotificationsManager.requestGameNotificationKeys(successFn, errorFn);

``successFn``
    A JavaScript function.
    A single argument is passed to the function, a JavaScript object with the following properties:

    ``keys``
    A JavaScript object. Contains properties with the key name for each key defined in :ref:`gamenotifications.yaml <notificationsmanager_gamenotifications_yaml>`

``errorFn`` (Optional)
    A JavaScript function.
    A single argument is passed to the function, a JavaScript object with the following properties:

    ``error``
        Contains a string with information about the occured error.

    ``status``
        Contains the error status (404, 400, etc)
        You can find a list of common status codes here - http://en.wikipedia.org/wiki/List_of_HTTP_status_codes


.. _notificationsmanager_gamenotifications_yaml:

gamenotifications.yaml
======================

This game file specifies the notifications that the game can use, for example:

.. code-block:: yaml

    - key: moo
      title: Moo Notification

    - key: baa
      title: Baa Notification
