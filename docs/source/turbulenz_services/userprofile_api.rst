.. index::
    single: UserProfile

.. _userprofile:

.. highlight:: javascript

-----------------------
The UserProfile Object
-----------------------

The UserProfile object provides profile information about the current user.

A profile object can be created with the :ref:`TurbulenzServices.createUserProfile <turbulenzservices_createuserprofile>` method.

**Required scripts**

The ``UserProfile`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/

Properties
==========

.. index::
    pair: UserProfile; username

.. _userprofile_username:

`username`
-------------

**Summary**

String with the username provided by the user. This is a unique name containing only the characters 0-9, A-Z, a-z and
hyphen "-".

**Syntax** ::

    var name = userProfile.username;

.. note:: Read Only


.. index::
    pair: UserProfile; displayname

.. _userprofile_displayname:

`displayname`
-------------

**Summary**

String with the real name provided by the user. This is not unique to the user and can contain any characters.

.. note::

    This is an optional field which the user may not have set. Games should generally use the
    :ref:`username <userprofile_username>` to refer to the player.

**Syntax** ::

    var name = userProfile.displayname;

.. note:: Read Only


.. index::
    pair: UserProfile; age

.. _userprofile_age:

`age`
-----

**Summary**

Number with the age provided by the user.

**Syntax** ::

    var age = userProfile.age;
    if (age)
    {
        // User provided date of birth information
    }

.. note:: Read Only


.. index::
    pair: UserProfile; language

.. _userprofile_language:

`language`
----------

**Summary**

String with the preferred language chosen by the user.
It follows the two-letter code standard `ISO 639-1 <http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>`_.

**Syntax** ::

    var language = userProfile.language;
    if (language)
    {
        // User provided preferred language
    }

.. note:: Read Only


.. index::
    pair: UserProfile; country

.. _userprofile_country:

`country`
---------

**Summary**

String with the country of residence provided by the user.
It follows the two-letter code standard `ISO 3166-1 <http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2>`_.

**Syntax** ::

    var country = userProfile.country;
    if (country)
    {
        // User provided country of residence
    }

.. note:: Read Only

.. index::
    pair: UserProfile; guest

.. _userprofile_guest:

`guest`
-------

**Summary**

True if the current user is a guest.

**Syntax** ::

    var guest = userProfile.guest;
    if (guest)
    {
        // Ask user to create an account to purchase items
    }

.. note:: Read Only

.. index::
    pair: UserProfile; anonymous

.. _userprofile_anonymous:

`anonymous`
-----------

**Summary**

True if the current user is an anonymous user.  Anonymous users have
access to most online functionality (such as UserData, StoreManager),
but are unable to use any social features of the engine such as
Leaderboards or Badges.  The anonymous user functionality is intended
for mobile platforms to make Turbulenz games behave more like
traditional installed apps - it cannot be used from the browser.

**Syntax** ::

    var anonymous = userProfile.anonymous;
    if (anonymous)
    {
        // Ask user to upgrade to full account.
        // See TurbulenzServices.upgradeAnonymousUser()

    }

.. note:: Read Only
