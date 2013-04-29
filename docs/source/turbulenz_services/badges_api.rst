.. index::
    single: BadgeManager

.. _badgemanager:

.. highlight:: javascript

-----------------------
The BadgeManager Object
-----------------------

The ``badgeManager`` object is an API for getting and awarding badges and progress on badges.

A ``badgeManager`` object can be created by calling :ref:`TurbulenzServices.createBadgeManager <turbulenzservices_createbadgemanager>`.
The ``badgeManager`` is ready immediately.

**Required scripts**

The ``badgeManager`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/badgemanager.js") }}*/
    /*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/

Badges
======

**How Badges work**

Badges should be an essential part of your game and you should use them to
encourage your users as they progress through your game. A game can define multiple badges.

The SDK offers a very flexible badge system that allows you to award badges in many different ways.

Badges you assign in your game are immediately displayed on the Turbulenz Gamesite (as a 'Toast' message or in the 'Fold')
and can be seen on the player's and game's feeds.

There are two shapes for in-game badges, circle and diamond, but there can be only one diamond badge per game.
The diamond badge is meant to be the most valuable badge of the game.

Your game can define a badge progress on each badge.
You can even define hidden badges, that are made visible once they have been awarded.

The badge system is made up of two components, badges and userbadges.

* Badges

    Badges carry the meta information about a badge and can be queried with :ref:`listBadges <badgemanager_listbadges>`.
    Each specified badge mainly contains the following information:

    * title and description of the badge
    * key to reference a badge from your game
    * visibility flag, specifying if the badge is hidden


* Userbadges

    Userbadges carry the information specific to the current user (like their current progress).

    When a badge is awarded to a user there are two options, the badge can be awarded:

    a) as a whole using :ref:`awardUserBadge <badgemanager_awardUserBadge>`
    b) progressively using :ref:`updateUserBadgeProgress <badgemanager_updateUserBadgeProgress>`

    Userbadges can be listed with :ref:`listUserBadges <badgemanager_listUserBadges>`.


Badge progress must be numerical.
There is no upper limit to a value that a badge progress can have, however the developer has to specify a total value
for progressively earned badges.
In this case the badge is considered to be 'awarded' in full as soon as the total is achieved (e.g. 50/50).

**Security**

Security is important to make sure that players cannot cheat by altering the requests and responses that your game makes to our API.

All POSTs to the Badges API are expected to be protected.
This means that any POST requests made must be encrypted and signed.
When using the BadgeManager this is handled automatically.

However, the GET requests to the Badges API are **not encrypted or signed**.
This means that the responses that you get from the ``listBadges`` and ``listUserBadges`` requests **cannot be trusted** and should only be displayed and not used internally.
You should not use the results of these requests to track a player's badge progress, instead you should track the player's badge progress using the :ref:`UserDataManager <userdatamanager>`.
For more information see the example in :ref:`Turbulenz Services Security <turbulenzservices_security>`.

**Limitations**

As the progress of badges might change frequently, to avoid overloading the service, badges should not be updated for
each increment.
It is preferable to update these badges at a less frequent interval (e.g. every 1-10 minutes)
possibly at the same time as :ref:`saving your game <userdatamanager>`.

.. _badges_yaml:

**Defining your game's badges**

Badges are defined with a ``badges.yaml`` file located in your games folder.

.. highlight:: yaml

Here is an example file::

    -   key:            'cropmaster'
        title:          'Cropmaster'
        predescription: 'Harvest 10 crops in a month'
        description:    'Harvested 10 crops in a month'
        points:         20
        total:          10
        shape:          'circle'
        imageresource:
            icon:                 'img/badges/cropmaster.png'
            border-color:         '#2299e3'

    -   key:            'seedmeister'
        title:          'Seedmeister'
        description:    'Planted 1000 crops in a month'
        points:         100
        total:          1000
        shape:          'diamond'
        visible:        false
        imageresource:
            icon:                 'img/badges/seedmeister.png'
            border-color:         '#00000'

.. highlight:: javascript

Badges are sorted the way you define them in your YAML file.
The YAML file is a dictionary of badge definitions.
Each key in the dictionary is a badge key which is used as a reference to the badge for the badgeManager API calls.

Keys in this system are restricted to alphanumeric characters separated by either hyphens or dots.

Each badge definition contains:

``key``
    A YAML string.
    The key to uniquely identify a badge in a game.

``title``
    A YAML string.
    The short title of the badge.
    If the title exceeds 100 characters it gets truncated.
    This is the title that is displayed on the game site.

``description``
    A YAML string.
    A more eloquent way of describing what the badge is for or how to achieve it.
    It should not exceed 600 characters.

``predescription`` (Optional)
    A YAML string.
    If specified, this is used as the badge description until the badge is awarded.
    It should not exceed 600 characters.

``points``
    A YAML number (must be an integer).
    The number of points gained when the badge is achieved.

``total`` (Optional)
    A YAML number (must be an integer).
    If specified, the badge is considered progressive.
    If progress reaches this level, the badge is considered awarded.
    Defaults to 1.

``shape``
    A YAML string.
    Must be one of 'diamond' or 'circle'.
    There can be only one 'diamond' shaped badge per game.
    The common circle badge is worth a small amount of points (<100pts).
    Diamond badges are much more difficult badges worth lots of points (100 pts) your game can only have one of these.

``visible`` (Optional)
    A YAML boolean
    Defaults to true.
    The visibility of the badge.
    When set to false, the badge title and description are hidden until the badge is awarded.

.. _badge_yaml_icon:

``icon``
    A YAML string.
    The relative path from the game directory to a :ref:`badge icon <turbulenz_services_images_badges>`.
    This is not required while debugging on Local and the Hub but must be included in order to publish to the Gamesite.
    These icons should be included in the deploy files for your game.
    The icon image should be 256x256 in PNG format.
    Please read :ref:`Turbulenz Services Assets <turbulenz_services_assets>` before creating your images.

.. _badge_yaml_bordercolor:

``border-color``
    A YAML string.
    The border color that will be applied to the badge image on the Hub and the Gamesite.
    This should be a hexadecimal CSS color code.

The ``badges.yaml`` file should sit in the game directory and must be added to the deploy files of your game.

**Manually removing user badges**

You can find the user badges in ``devserver/localdata/userbadges/{game-slug}.yaml``.
To remove all users' badges for a game, remove the ``devserver/localdata/userbadges/{game-slug}.yaml`` file.

Examples
========

Listing your badges::

    var badgeListCallback = function badgeListCallbackFn(badges)
    {
        //do something here with your badges
        var badgesLength = badges.length;
        for (var i = 0; i < badgesLength; i += 1)
        {
            var badge = badges[i];
            document.write(badge.title + ': gives you ' + badge.points + ' points and has a total score of ' + badge.total + '\n');
        }
    };

    badgeManager.listBadges(badgeListCallback, errorCallBackFn);

Awarding a badge::

    var badgeAddCallback = function badgeAddCallbackFn(userbadge)
    {
        //current is the current progress out of the badge total
        document.write(userbadge.badge_key + ':' + userbadge.current + ':' + userbadge.username + '\n');
    };
    badgeManager.awardUserBadge('cropmaster', badgeAddCallback, errorCallBackFn);

Updating progress on a badge::

    var badgeAddCallback = function badgeAddCallbackFn(userbadge)
    {
        document.write(userbadge.badge_key + ':' + userbadge.current + ':' + userbadge.username + '\n');
    };

    badgeManager.updateUserBadgeProgress('cropmaster', 20, badgeAddCallback, errorCallBackFn);

Listing badges for the current user::

    var userbadgeListCallback = function userbadgeListCallbackFn(userbadges)
    {
        for (var i in userbadges)
        {
            if (userbadges.hasOwnProperty(i))
            {
                document.write(userbadges[i].username + ' owns '  + userbadges[i].badge_key + ' and the current progress is ' +  userbadges[i].current + ' points\n');
            }
        }
    };


Methods
=======

.. index::
    pair: badgeManager; listBadges

.. _badgemanager_listbadges:

`listBadges`
-------------

**Summary**

Get a list of all badges.

**Syntax** ::

    function callbackFn(badges) {}
    badgeManager.listBadges(callbackFn, errorCallbackFn);

``callbackFn``
    A JavaScript function.
    Called once a successful listBadges HTTP response is recieved.

``errorCallbackFn`` :ref:`(Optional) <badgemanager_errorcallback>`

The callback is called with a ``badges`` array with the following format::

    [
        {
            key: 'cropmaster',
            title: 'Cropmaster',
            predescription: 'Harvest 10 crops in a month',
            description: 'Harvested 10 crops in a month',
            points: 20,
            total: 10,
            visible: true,
            shape: 'circle',
            images: {
                img32: 'https://...',
                img48: 'https://...',
                img256: 'https://...'
            },
            sortOrder: 0
        },
        {
            key: 'seedmeister',
            title: 'Seedmeister',
            predescription: null,
            description: 'Planted 1000 crops in a month',
            points: 100,
            total: 1000,
            visible: false,
            shape: 'diamond',
            images: {
                img32: 'https://...',
                img48: 'https://...',
                img256: 'https://...'
            },
            sortOrder: 1
        },
        ...
    ]

``key``
    A JavaScript string.
    The key to uniquely identify a badge in a game.

``title``
    A JavaScript string.
    The short title of the badge. If the title exceeds 100 characters it gets truncated.
    This is the title that is displayed on the game site.

``description``
    A JavaScript string.
    A more eloquent way of describing, what the badge is for or how to achieve it.
    Not longer than 600 charactrers.

``predescription``
    A JavaScript string.
    If specified, this is used as the badge description until the badge is awarded.
    Is null if no predescription has been set for the badge.
    It should not exceed 600 characters.

``points``
    A JavaScript number.
    The number of points gained when the badge is achieved.

``total``
    A JavaScript number.
    If progress reaches this level, the badge is considered awarded.
    For non-progress badges, total will be set to ``null``.

``shape``
    A JavaScript string.
    A shape can be 'diamond' or 'circle'. There can be only one 'diamond' shaped badge per game.

``visible``
    A JavaScript boolean.
    The visibility of the badge.

``images``
    A JavaScript object.
    Paths to the processed badge image as 32x32, 48x48 and 256x256 pixel images.
    This is only present when running on the Hub and the Gamesite.
    When running on the Turbulenz Local Server, the ``imageresource`` object defined in ``badges.yaml`` is returned.

``sortOrder``
    A JavaScript string.
    The order in which the badges will appear.
    This is only present when running on the Hub and the Gamesite.
    This is the same as the order they are specified in the ``badges.yaml`` file.


.. index::
    pair: badgeManager; awardUserBadge

.. _badgemanager_awardUserBadge:


`awardUserBadge`
-----------------

**Summary**

Award a badge to a player.

.. note:: This is an :ref:`encrypted API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(userBadge) {}
    badgeManager.awardUserBadge(key, callbackFn, errorCallbackFn);

``key``
    A JavaScript string.
    The key to uniquely identify a badge in a game.

``callbackFn``
    A JavaScript function.
    Called once a successful awardUserBadge HTTP response is recieved.

``errorCallbackFn`` :ref:`(Optional) <badgemanager_errorcallback>`


The callback is called with a ``userbadge`` with the following format:

``achieved``
    A JavaScript boolean.
    Indicates whether the badge was awarded.
    This is only true for the first time the badge is awarded.

``badge_key``
    A JavaScript string.
    The key to uniquely identify a badge in a game.

``current``
    A JavaScript number.
    The current level of progress for the badge.
    1 if the badge has no total.
    If the badge has a total it will be set to total.

``total``
    A JavaScript number.
    The level ``current`` has to reach for the badge to be considered awarded.
    For non-progress badges, total will be set to ``null``.

.. index::
    pair: badgeManager; updateUserBadgeProgress

.. _badgemanager_updateUserBadgeProgress:


`updateUserBadgeProgress`
-------------------------

**Summary**

Update the progress of a badge on a player.

.. note:: This is an :ref:`encrypted API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(userBadge) {}
    badgeManager.updateUserBadgeProgress(key, currentProgress, callbackFn, errorCallbackFn);

``key``
    A JavaScript string.
    The key identifier for the badge to set.

``currentProgress``
    A JavaScript number.
    Sets the current progress of the badge.

``callbackFn``
    A JavaScript function.
    Called once a successful updateUserBadgeProgress HTTP response is recieved.

``errorCallbackFn`` (Optional)
    :ref:`Error Callback <badgemanager_errorcallback>`

The callback is called with a ``userbadges`` with the following format:

``achieved``
    A JavaScript boolean.
    Indicates whether the badge was awarded.
    This is only true for the first time the badge is awarded.

``badge_key``
    A JavaScript string.
    The key to uniquely identify a badge in a game.

``current``
    A JavaScript number.
    The current level of progress for the badge.
    This will be identical to the ``currentProgress`` passed in to ``updateUserBadgeProgress``.

``total``
    A JavaScript number.
    The level ``current`` has to reach for the badge to be considered awarded.
    For non-progress badges, total will be set to ``null``.


.. index::
    pair: badgeManager; listUserBadges

.. _badgemanager_listUserBadges:

`listUserBadges`
----------------

**Summary**

List the badges for a player.

**Syntax** ::

    function callbackFn(userBadge) {}
    badgeManager.listUserBadges(callbackFn, errorCallbackFn);

``callbackFn``
    A JavaScript function.
    Called on successful set of the score.

``errorCallbackFn`` (Optional)
    :ref:`Error Callback <badgemanager_errorcallback>`

The callback is called with a ``userbadges`` array of objects with the following format:

``achieved``
    A JavaScript boolean.
    Indicates whether the badge has been achieved by the player.

``badge_key``
    A JavaScript string.
    The key to uniquely identify a badge in a game.

``current``
    A JavaScript number.
    The current level of progress for the badge.

``total``
    A JavaScript number.
    The level ``current`` has to reach for the badge to be considered awarded.
    For non-progress badges, total will be set to ``null``.


Properties
==========

.. index::
    pair: badgeManager; service

.. _badgemanager_service:

`service`
---------

**Summary**

The :ref:`ServiceRequester <servicerequester>` object for the ``badges`` service.

**Syntax** ::

    var serviceRequester = badgeManager.service;

.. _badgemanager_errorcallback:

Error callback
==============

If no error callback is given then the :ref:`TurbulenzServices.createbadgeManager <turbulenzservices_createbadgemanager>` ``errorCallbackFn`` is used.

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
