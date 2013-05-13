.. index::
    single: StoreManager

.. _storemanager:

.. highlight:: javascript

-----------------------
The StoreManager Object
-----------------------

Please read this documentation carefully before implementing a game store.
Make sure to only use the functions and properties listed here and read all of the warning notices.

The ``StoreManager`` object is an API for getting store item meta data, user owned store items and basket management.

A ``StoreManager`` object can be created by calling :ref:`TurbulenzServices.createStoreManager <turbulenzservices_createstoremanager>`.
None of the ``StoreManager`` functions or properties can be used until the :ref:`TurbulenzServices.createStoreManager <turbulenzservices_createstoremanager>`
``storeMetaReceived`` callback function has been called.

**Required scripts**

The ``StoreManager`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/sessiontoken.js") }}*/
    /*{{ javascript("jslib/services/storemanager.js") }}*/
    /*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/

**How the store works**

There are two ways that a transaction can start:

1. Your game adds a set of items to the basket and then triggers a purchase confirmation.
   This should always be driven by a user action such as clicking the mouse or pressing a key.
2. The user adds any item to their basket using the payments panel on turbulenz.com.
   Your game does not need to be running for the user to purchase items in this manner.

Once the transaction is started your game will be hidden (if it is running) and a basket confirmation dialog will be shown to the user.

.. NOTE::
    Since turbulenz.com always shows a basket confirmation dialog there is no requirement for your game to render the basket.

The user can then pick a payment provider and make the purchase or close the basket confirmation dialog to reject the payment.

..
.. **Basket system**
..
.. **Security**

Store items
===========

.. _store_items_yaml:

**Defining your game's store items**

.. NOTE::
    The YAML format was changed in :ref:`SDK 0.24.1 <convert_store_items_yaml_0_24_1>` see :ref:`release notes <changes_sdk_0_24_1>`.
    For help on converting to the newer format please read :ref:`converting to SDK 0.24.1 storeitems.yaml <convert_store_items_yaml_0_24_1>`.

Store items are defined with a ``storeitems.yaml`` file.

The store definition file contains ``resources`` and ``offerings``:

- **Resources** - The individual items that the game uses internally.
  Resources cannot be purchased directly.
  They need to be included in an ``offering`` in order to be purchased.
  Resources are displayed in the bottom half of the store drawer.
  Once a resource is deployed it cannot be removed as users could own it.

- **Offerings** - The purchasable items/packs/offers that a user can buy.
  An offering can contain more than one resource and can contain mixtures of resource types.
  The offerings are what the users buy and have a price in each currency (currently only USD are supported).

.. highlight:: yaml

Here is an example file::

    resources:
      - key: levelpack
        title: Level Pack
        description: 10 extra levels
        icon256: assets/icons/levelpack.png
        type: own

      - key: apples
        title: Apples
        description: Apples to eat
        icon256: assets/icons/apple256.png
        icon48: assets/icons/apple48.png
        icon32: assets/icons/apple32.png
        type: consume

      - key: bananas
        title: Bananas
        description: Banana to eat
        icon256: assets/icons/banana.png
        icon32: assets/icons/banana32.png
        type: consume

    offerings:
      - key: levelpack
        title: Level Pack
        description: 10 extra levels
        icon256: assets/icons/levelpack.png
        output:
          levelpack: 1
        price:
          USD: 4.99

      - key: apple
        title: Apple
        description: A single apple to eat
        icon256: assets/icons/apple256.png
        output:
          apples: 1
        price:
          USD: 1.59

      - key: bunchbananas
        title: Bunch of bananas
        description: A bunch of 3 bananas
        icon256: assets/icons/banana.png
        output:
          bananas: 3
        price:
          USD: 0.99

      - key: fruitbowl
        title: Fruit bowl
        description: A fruit bowl containing 7 apples and 5 bananas
        icon256: assets/icons/banana.png
        output:
          apples: 7
          bananas: 5
        price:
          USD: 3.99

.. highlight:: javascript

.. WARNING::

    Only an offerings price can be changed after it has been deployed and it cannot be removed as users could own it.
    To change the offering see :ref:`removing store offerings <storeyaml_remove_store_offerings>`.

Both ``resources`` and ``offerings`` are arrays of store item definitions.
Each store item definition contains:

``key``
    The item can be referenced by its key throughout the store API.
    Store item keys in this system are restricted to alphanumeric characters separated by either hyphens or dots.

``title``
    The title of the store item.
    Limited to 80 characters.
    This is the title that is displayed on turbulenz.com.

.. NOTE::
    For offerings ``title`` please do not use a multiplied by symbol "x" in the title to indicate quantity (e.g. "Bananas x 3") as
    this can clash with the payment GUI on the site (e.g. giving "ItemTitle x 3 x 2").

``description``
    A description of the item.
    Limited to 200 characters.
    A short description of the item to be displayed on turbulenz.com.
    For offerings this description should describe the resources in the offering.

.. _storeyaml_icon256:

``icon256``
    The relative path from the game directory to a :ref:`store icon <turbulenz_services_images_store>`.
    This property is not required while debugging on Local and the Hub but must be included in order to publish to turbulenz.com.
    These icons should be included in the deploy files for your game.
    The icon image should be 256x256 in PNG format.
    Please read :ref:`Turbulenz Services Assets <turbulenz_services_assets>` before creating your images.

.. _storeyaml_icon48:

``icon48`` (Optional)
    The relative path from the game directory to a :ref:`store icon <turbulenz_services_images_store>`.
    These icons are optional but recommended as our automatic resizing of the 256x256 pixel image might not give aethetically pleasing results.
    If set these icons should be included in the deploy files for your game.
    The icon image should be 48x48 in PNG format.
    Please read :ref:`Turbulenz Services Assets <turbulenz_services_assets>` before creating your images.

.. _storeyaml_icon32:

``icon32`` (Optional)
    The relative path from the game directory to a :ref:`store icon <turbulenz_services_images_store>`.
    These icons are optional but recommended as our automatic resizing of the 256x256 pixel image might not give aethetically pleasing results.
    If set these icons should be included in the deploy files for your game.
    The icon image should be 32x32 in PNG format.
    Please read :ref:`Turbulenz Services Assets <turbulenz_services_assets>` before creating your images.

``max``
    :ref:`Removed in SDK 0.24.1 <changes_sdk_0_24_1>`

The ``resources`` definitions also contain:

``type`` (Optional, default "own")
    Either:
      - ``own`` means that once the item is purchased it will always be owned by the user (it can only be purchased once).
      - ``consume`` means that the item can be consumed after its purchase using the :ref:`StoreManager.consume <storemanager_consume>` function
        decreasing the amount that the user owns.

.. WARNING::
    Once a resource has been added and deployed to turbulenz.com it can never be removed as users may own it.
    To remove the visibility of the offering from the store use the 'available' property introduced in SDK 0.24.1.

The ``offerings`` definitions also contain:

.. _storeyaml_available:

``available`` (Optional)
    A boolean value, defaults to true.
    When set to false, disables purchasing of the offering.
    When disabled the offering will no longer appear in the store front.
    However, disabled items will still appear in users receipts if they have previously purchased them.

``output``
    A dictionary of the resources output by the offering.
    The dictionary contains a mapping from resource keys to amount of each resource.
    Each output key must be defined in the ``resources`` section.

.. NOTE::
    If a user already owns an "own" type resource in an offering then that resource will be ignored when purchased.

``price``
    A list of prices for the items in various currency codes.
    You can find a list of currency codes here:
    http://www.xe.com/iso4217.php.
    Currently, only United States dollars (USD) is supported.

.. NOTE::

    The minimum price for an item is $0.99. Please note that if you attempt to upload to the Hub with a price under $0.99, you will receive a warning.

This ``storeitems.yaml`` file should be in the games directory and should be added to the deploy files for your game on local.
The order of the keys in the ``storeitems.yaml`` file is the order that the store offerings and resources will appear on turbulenz.com.

.. _storeyaml_remove_store_offerings:

**Removing store offerings**

Offerings can be removed from the store items list on local and the Hub during development and testing.
However, once a game is published or deployed to turbulenz.com its offerings **cannot be removed** as users may purchase them
(they need to be displayed in their receipts).
The offerings *available* and *price* properties can still be edited but the title, description and output cannot be changed.
You can stop users from purchasing store offerings by setting the *available* property.
To update an existing offering's title, description and output create a new offering with a different key and make the old key unavailable.

**Removing store resources**

Resources can be removed from the store items list on local and the Hub during development and testing.
However, once a game is published or deployed to turbulenz.com its resources **cannot be removed** as users may have purchased them.
The resource title, description and icon can still be edited but their meaning should not be changed.
A resource's type cannot be changed once it is deployed to turbulenz.com.

.. NOTE::

    Equally a game should continue to handle resources of a given name once published.
    For example, if the resource *apples* is no longer purchaseable as an offering, the game should still allow users who have bought apples to consume them in the future.
    The same is true of ownable items.

**Manually editing/removing user's items on the local server**

You can find the items purchased in ``devserver/localdata/storeitems/{game-slug}/{user-name}.yaml`` of the SDK.
Each file contains a dictionary of the items owned in the following example format::

    apples:
        amount: 12
    bananas:
        amount: 3

To edit the user items edit this file and then refresh the page.
To remove all user items for a game remove the ``devserver/localdata/storeitems/{game-slug}`` directory and then refresh the page.

Examples
========

Displaying store offerings::

    Utilities.log('Offerings (key, price):');
    var offerings = storeManager.getOfferings();
    var offeringKey;
    for (offeringKey in offerings)
    {
        if (offerings.hasOwnProperty(offeringKey))
        {
            var offering = offerings[offeringKey];

            // filter out any unavailable offerings (note that they are always at the end of the list)
            if (offering.available)
            {
                Utilities.log(offering.title + ': ' + offering.price);
            }
        }
    }

Displaying user owned store items::

    Utilities.log('User items:');
    var resources = storeManager.getResources();
    var userItems = storeManager.getUserItems();
    var itemKey;
    for (itemKey in userItems)
    {
        if (userItems.hasOwnProperty(itemKey))
        {
            var resource = resources[itemKey];
            Utilities.log(resource.title + ': ' + userItems[itemKey].amount);
        }
    }

Changing the basket::

    function displayBasketItems()
    {
        Utilities.log('Basket currency type: ' + storeManager.currency.alphabeticCode);
        Utilities.log('Basket items:');
        var basketItems = storeManager.basket.items;
        var itemKey;
        for (itemKey in basketItems)
        {
            if (basketItems.hasOwnProperty(itemKey))
            {
                var basketItem = basketItems[itemKey];
                Utilities.log(itemKey + ' x ' + basketItem.amount + ' = ' + basketItem.lineTotal);
            }
        }
        Utilities.log('Total: ' + basket.total);
    }

    // the basket could have anything in it before your game starts
    // if you want to clear the basket you should do
    storeManager.emptyBasket();

    // the basket should now be empty
    Utilities.log('Basket is empty: ' + storeManager.isBasketEmpty());

    // now to add something to the basket
    Utilities.log('Adding items');
    storeManager.addToBasket('apple', 4);
    storeManager.addToBasket('apple', 1);
    storeManager.addToBasket('bunchbananas', 2);
    storeManager.updateBasket(function basketUpdated()
        {
            // the basket should no longer be empty
            Utilities.log('Basket is empty: ' + storeManager.isBasketEmpty());

            // we can now look at the basket and see line totals and the transaction total
            // we should see that we have 5 'apples' items and 3 'bananas' items
            displayBasketItems();

            Utilities.log('Removing items');
            storeManager.removeFromBasket('apple', 1);
            storeManager.removeFromBasket('apple', 2);
            // removeFromBasket clamps values at 0 so you don't need to worry about negatives
            storeManager.removeFromBasket('bunchbananas', 4);

            storeManager.updateBasket(function basketUpdated2()
                {
                    // we can now look at the basket and see line totals and the transaction total
                    // we should see that we have 2 'apples' items and no 'bananas' items
                    displayBasketItems();
                });
        });


    // you can also track when the user changes the basket on the site
    storeManager.onBasketUpdate = function onBasketUpdateFn()
    {
        Utilities.log('New basket:');
        displayBasketItems();
    }

Displaying the site purchase confirmation dialog::

    // add the items to the basket
    storeManager.addToBasket('apple', 4);

    // then request the confirm dialog
    storeManager.showConfirmPurchase();

    // note that this does not mean that the purchase will be confirmed
    // all this does is display a basket purchase confirmation dialog (which the user can close).

Handling a site purchase::

    // When the purchase is confirmed on the site the user items are updated.
    // The basket is also emptied when a purchase is confirmed.

    storeManager.onSitePurchaseConfirmed = function onSitePurchaseConfirmedFn()
    {
        Utilities.log('Total user items after purchase (key, amount):');
        var resources = storeManager.getResources();
        var userItems = storeManager.getUserItems();
        var itemKey;
        for (itemKey in userItems)
        {
            if (userItems.hasOwnProperty(itemKey))
            {
                var resource = resources[itemKey];
                Utilities.log(resource.title + ': ' + userItems[itemKey].amount);
            }
        }

        // Basket should now be empty
        Utilities.log('Basket is empty: ' + storeManager.isBasketEmpty());
    }

    storeManager.onSitePurchaseRejected = function onSitePurchaseRejectedFn()
    {
        Utilities.log('User rejected purchase confirmation');
    }

Methods
=======

.. index::
    pair: StoreManager; getOfferings

.. _storemanager_getofferings:

`getOfferings`
--------------

Added in :ref:`SDK 0.24.1 <added_sdk_0_24_1>`.

**Summary**

The meta data for game store offerings.

**Syntax** ::

    var offerings = storeManager.getOfferings();
    var offering = offerings[key];

    // example usage:
    var key;
    for (key in offerings)
    {
        if (offerings.hasOwnProperty(key))
        {
            var offering = offerings[key];
            // filter out any unavailable offerings (note that they are always at the end of the list)
            if (offering.available)
            {
                Utilties.log('Offering ' + offering.title + ' $' + offering.price);
            }
        }
    }

``key``
    A JavaScript string.
    The key identifier for the store offering.

``offering``
    A store offering meta object with the following format::

        {
            key: 'apple',
            title: 'Apple',
            description: 'Apple to eat',
            index: 0,
            output: {
                'apples': 1
            },
            available: true,
            price: '1.29'
        }

    ``key``
        A JavaScript string.
        The key identifier for the store offering.

    ``title``
        A JavaScript string.
        The title of the store offering.

    ``description``
        A JavaScript string.
        The description of the store offering.

    ``index``
        A JavaScript number.
        The display index of the store offering in a list.
        This is taken from the :ref:`storeitems.yaml <store_items_yaml>` offerings list order with the exception that
        all of the unavailable offerings are at the end.

    ``output``
        A JavaScript object.
        The resources output when this offering is purchased.
        A dictionary of resource keys to amounts in the offering.
        :ref:`Added in SDK 0.24.1 <added_sdk_0_24_1>`.

    ``price``
        A JavaScript string.
        The price of the offering in the users currency, see :ref:`StoreManager.currency <storemanager_currency>`.
        This a string to avoid any precision errors.

    ``available``
        A JavaScript boolean.
        True, if the offering can be purchased and should be displayed in game.
        False, if the offering is hidden and only visible in users receipts.
        Make sure to check this property before displaying the offerings.
        :ref:`Added in SDK 0.24.1 <added_sdk_0_24_1>`.

The properties of ``offerings`` are ordered by index and if iterated will be returned in the same order as they are defined in
the :ref:`storeitems.yaml <store_items_yaml>` file.

.. NOTE::
    The returned object and all of its properties are read only.
    However, these values can be edited on the local server
    to change offerings definitions edit the :ref:`storeitems.yaml <store_items_yaml>` file.

.. index::
    pair: StoreManager; getResources

.. _storemanager_getresources:

`getResources`
--------------

Added in :ref:`SDK 0.24.1 <added_sdk_0_24_1>`.

**Summary**

The meta data for game store resources.

**Syntax** ::

    var resources = storeManager.getResources();
    var resource = resources[key];

``key``
    A JavaScript string.
    The key identifier for the store resource.

``resource``
    A store resource meta object with the following format::

        {
            key: 'apple',
            title: 'Apple',
            description: 'Apple to eat',
            index: 0,
            type: 'consume',
        }

    ``key``
        A JavaScript string.
        The key identifier for the store resource.

    ``title``
        A JavaScript string.
        The title of the store resource.

    ``description``
        A JavaScript string.
        The description of the store resource.

    ``index``
        A JavaScript number.
        The display index of the store resource in a list.

    ``type``
        A JavaScript string.
        ``own`` means that once the resource is purchased it will always be owned by the user (note that it can still be purchased multiple times in mixed offerings).
        ``consume`` means that the resource can be consumed after its purchase using the :ref:`StoreManager.consume <storemanager_consume>` function
        decreasing the amount that the user owns.

The properties of ``resources`` are ordered by index and if iterated will be returned in the same order as they are defined in
the :ref:`storeitems.yaml <store_items_yaml>` file.


.. NOTE::
    The returned object and all of its properties are read only.
    However, these values can be edited on the local server
    to change resources definitions edit the :ref:`storeitems.yaml <store_items_yaml>` file.

.. index::
    pair: StoreManager; getUserItems

.. _storemanager_getuseritems:

`getUserItems`
--------------

Changed in :ref:`SDK 0.24.1 <changes_sdk_0_24_1>`. (Returns :ref:`resources <store_items_yaml>` instead of items)

**Summary**

The :ref:`resources <store_items_yaml>` owned by the current user.

.. note:: This is property is always retrieved with a :ref:`signed API call <turbulenzservices_security>`

**Syntax** ::

    var userItems = storeManager.getUserItems();
    var userItem = userItems[key];

``key``
    A JavaScript string.
    The key identifier for the store :ref:`resource <store_items_yaml>`.

``userItem``
    User item object with the following format::

        {
            amount: 10
        }

    ``amount``
        A JavaScript number.
        The amount of the :ref:`resource <store_items_yaml>` with identifier ``key`` that the user owns.

``userItems`` only contains items which the user owns (there are no ``userItems`` with an ``amount`` of ``0``).

.. WARNING::
    Do not calculate ``userItems`` manually from purchases or consume operations always use ``storeManager.getUserItems``.
    Calculating ``userItems`` manually can result in the loss of user's items bought in other tabs/browsers.

.. NOTE::
    The returned object and all of its properties are read only.

.. index::
    pair: StoreManager; addToBasket

.. _storemanager_addtobasket:

`addToBasket`
-------------

Behavior changed in :ref:`SDK 0.24.1 <changes_sdk_0_24_1>`
(must be followed by a call to :ref:`StoreManager.updateBasket <storemanager_updatebasket>` to push basket changes to the site)

**Summary**

Add game store :ref:`offerings <store_items_yaml>` to the game basket.
This must be followed by a call to :ref:`StoreManager.updateBasket <storemanager_updatebasket>` to push this change to the site.

**Syntax** ::

    var addedToBasket = storeManager.addToBasket(key, amount);

    // example usage:
    storeManager.addToBasket('apple', 4);
    storeManager.updateBasket(function basketUpdated()
        {
            var basket = storeManager.basket;
        });

``key``
    A JavaScript string.
    The key of the store :ref:`offering <store_items_yaml>` to add to the site basket.

``amount``
    A JavaScript number.
    The integer amount to add to the site basket.

If the :ref:`offering <store_items_yaml>` is successfully added to the basket then this function returns true.
If the amount is invalid,
there is no store :ref:`offering <store_items_yaml>` with the key ``key``,
the offering is not longer :ref:`available <storeyaml_available>`
or the user already owns all of the resources in the offering this function will return false.

.. WARNING::
    This site basket will not be updated with changes until
    :ref:`StoreManager.updateBasket <storemanager_updatebasket>` has been called.

.. index::
    pair: StoreManager; removeFromBasket

.. _storemanager_removefrombasket:

`removeFromBasket`
------------------

Behavior changed in :ref:`SDK 0.24.1 <changes_sdk_0_24_1>`
(must be followed by a call to :ref:`StoreManager.updateBasket <storemanager_updatebasket>` to push basket changes to the site)

**Summary**

Remove game :ref:`offerings <store_items_yaml>` from the game basket.
This must be followed by a call to :ref:`StoreManager.updateBasket <storemanager_updatebasket>` to push this change to the site.

**Syntax** ::

    storeManager.removeFromBasket(key, amount);

    // example usage:
    storeManager.removeFromBasket('apple', 2);
    storeManager.updateBasket(function basketUpdated()
        {
            var basket = storeManager.basket;
        });

``key``
    A JavaScript string.
    The key of the store :ref:`offering <store_items_yaml>` to remove from the site basket.

``amount``
    A JavaScript number.
    The integer amount to remove from the site basket.

If the basket is changed by this operation (some amount of the item was previously in the basket) then this function returns true.
If the basket is unchanged, amount is invalid or there is no store :ref:`offering <store_items_yaml>` with the key ``key`` this function will return false.
This function clamps the value to zero so you don't need to worry about negative basket values.

.. WARNING::
    This site basket will not be updated with changes until
    :ref:`StoreManager.updateBasket <storemanager_updatebasket>` has been called.

.. index::
    pair: StoreManager; emptyBasket

.. _storemanager_emptybasket:

`emptyBasket`
-------------

Behavior changed in :ref:`SDK 0.24.1 <changes_sdk_0_24_1>`
(must be followed by a call to :ref:`StoreManager.updateBasket <storemanager_updatebasket>` to push basket changes to the site)

**Summary**

Empty all game store :ref:`offerings <store_items_yaml>` items from the site basket.
This must be followed by a call to :ref:`StoreManager.updateBasket <storemanager_updatebasket>` to push this change to the site.

**Syntax** ::

    storeManager.emptyBasket();

.. index::
    pair: StoreManager; updateBasket

.. _storemanager_updatebasket:

`updateBasket`
--------------

Added in :ref:`SDK 0.24.1 <added_sdk_0_24_1>`.

**Summary**

Push the game's :ref:`StoreManager.basket <storemanager_basket>` to the site and get the ``price``, ``lineTotal`` and ``total`` strings.

**Syntax** ::

    function updateBasketCallback()
    {
        // called once the basket has been updated
        var basket = storeManager.basket;
    }
    storeManager.updateBasket(updateBasketCallback);

    // example usage:
    function updateBasketCallback()
    {
        var basket = storeManager.basket;
        var costOfApple = basket.items.apples.price;
        var costOfApples = basket.items.apples.lineTotal;
        var basketTotal = basket.total;
    }
    storeManager.addToBasket('apples', 4);
    storeManager.addToBasket('bananas', 2);
    storeManager.updateBasket(updateBasketCallback);

``updateBasketCallback`` (Optional)
    A JavaScript function.
    Called once the changes to the basket have been pushed to the site.

Note that this will also trigger a :ref:`StoreManager.onBasketUpdate <storemanager_onbasketupdate>` call once the update is complete.

.. index::
    pair: StoreManager; isBasketEmpty

.. _storemanager_isbasketempty:

`isBasketEmpty`
---------------

**Summary**

Check if the site basket is empty.

**Syntax** ::

    var basketIsEmpty = storeManager.isBasketEmpty();

Returns a JavaScript boolean.

.. index::
    pair: StoreManager; showConfirmPurchase

.. _storemanager_showconfirmpurchase:

`showConfirmPurchase`
---------------------

**Summary**

Message the site to display the basket confirmation dialog.

**Syntax** ::

    var showingDialog = storeManager.showConfirmPurchase();

If the basket is empty this will do nothing and return false.
Otherwise, returns true.

On Local and the Hub this will result in a message at the top of the window asking the user to confirm the purchase.
This will not charge you or any users on Local or the Hub.

On turbulenz.com your game will be hidden if running in the plugin (still running just not visible) and the user will be shown the basket in its place.
You can detect when the game is displayed by waiting for a call
to :ref:`storeManager.onSitePurchaseConfirmed <storemanager_onsitepurchaseconfirmed>`
or :ref:`storeManager.onSitePurchaseRejected <storemanager_onsitepurchaserejected>`

.. NOTE::
    This function calls :ref:`StoreManager.updateBasket <storemanager_updatebasket>` internally so a ``storeManager.updateBasket`` call is not required
    before calling ``storeManager.showConfirmPurchase``.

.. WARNING::
    This does **not** imply that the items in the basket at the time of sending this message will be the same as the items purchased.
    The user can alter the basket items at any time on our site or purchase items in another tab/browser.
    You should only trust the :ref:`storeManager.getUserItems <storemanager_getuseritems>` function and never compute the items purchased from the
    basket.

.. index::
    pair: StoreManager; consume

.. _storemanager_consume:

`consume`
---------

**Summary**

Consume some amount of a user's items.

.. note:: This is a :ref:`encrypted API call <turbulenzservices_security>`

**Syntax** ::

    function callbackFn(consumed) {}
    storeManager.consume(key, consumeAmount, callbackFn, errorCallbackFn);

``key``
    A JavaScript string.
    The key for the user's store :ref:`resource <store_items_yaml>` item to consume.

``consumeAmount``
    A JavaScript number, should be a non-negative integer.
    Remember to check that the :ref:`StoreManager.getUserItems <storemanager_getUserItems>` result actually
    contains enough of the :ref:`resource <store_items_yaml>` item before calling consume.

``callbackFn``
    A JavaScript function.
    Called once the consume HTTP response is received.
    Does not imply that the :ref:`resource <store_items_yaml>` items have been consumed (see ``consumed`` argument).

``errorCallbackFn`` :ref:`(Optional) <storemanager_errorcallback>`

``consumed``
    A JavaScript boolean.
    True, if the consume request succeeded and the user's items have been consumed.
    False, if the user no longer owns enough of the item.
    This can happen if the user consumes the items in a separate tab.

To find the new user's item amounts call the :ref:`StoreManager.getUserItems <storemanager_getUserItems>` function
(this will have changed regardless of the result of ``consumed``).

.. WARNING::
    Before setting leaderboards, badges or saving the game make sure that any in-game items have been consumed.
    Otherwise, it becomes possible for users to "steal" items by blocking the consume requests and then restarting their game.

.. WARNING::
    Do not store consumed items in :ref:`UserData <userdatamanager>` you should always use the :ref:`StoreManger.getUserItems <storemanager_getUserItems>`
    function to find the remaining consumed items.

.. NOTE::
    Remember to check that the :ref:`StoreManager.getUserItems <storemanager_getUserItems>` function returns enough of the item before calling consume.

Properties
==========

.. index::
    pair: StoreManager; ready

.. _storemanager_ready:

`ready`
-------

**Summary**

Set to true once the store manager has loaded and is ready to be used.

**Syntax** ::

    var ready = storeManager.ready;

Returns a JavaScript boolean.

.. index::
    pair: StoreManager; service

.. _storemanager_service:

`service`
---------

**Summary**

The :ref:`ServiceRequester <servicerequester>` object for the ``store`` service.

**Syntax** ::

    var serviceRequester = storeManager.service;

.. index::
    pair: StoreManager; currency

.. _storemanager_currency:

`currency`
----------

**Summary**

The users currency.

**Syntax** ::

    var currency = storeManager.currency;

An object with the following example format::

    {
        "currencyName": "US Dollar",
        "alphabeticCode": "USD",
        "numericCode": 840
    }

``currencyName``
    A JavaScript string.
    The name of the currency in English.

``alphabeticCode``
    A JavaScript string.
    The three letter alphabetic ISO 4217 code for the currency.
    Currently, we only support USD.

``numericCode``
    A JavaScript number.
    The numeric ISO 4217 code for the currency.
    Currently, we only support USD 840.

.. NOTE::
    This property is read only.

.. index::
    pair: StoreManager; basket

.. _storemanager_basket:

`basket`
--------

**Summary**

A dictionary of items currently in the store basket.

**Syntax** ::

    var basket = storeManager.basket;

    // example usage:
    function updateBasketCallback()
    {
        // called once the basket has been updated
        var basket = storeManager.basket;
    }
    storeManager.updateBasket(updateBasketCallback);

The ``basket`` property is an object with the following properties:

``total``
    A JavaScript string.
    The total price of the basket.

``items``
    A dictionary of store item basket objects with the following format::

        'apples':
        {
            amount: 1,
            price: '1.59',
            lineTotal: '1.59'
        },
        'bananas':
        {
            amount: 2,
            price: '0.99',
            lineTotal: '1.98'
        }

Each property of ``items`` is an object with the following properties:

``amount``
    A JavaScript number.
    The amount of the item in the basket.

``price``
    A JavaScript string or ``undefined`` if this is being retrieved.
    The individual price of the store item in the user's currency, see :ref:`StoreManager.currency <storemanager_currency>`.

``lineTotal``
    A JavaScript string or ``undefined`` if this is being retrieved.
    The line total price of the store item in the user's currency, see :ref:`StoreManager.currency <storemanager_currency>`.
    This is the price of the item multiplied by the amount of the item.

.. NOTE::
    After a call to :ref:`storeManager.addToBasket <storemanager_addtobasket>` or
    :ref:`storeManager.removeFromBasket <storemanager_removefrombasket>`
    ``price`` and ``lineTotal`` will be ``undefined`` until
    :ref:`storeManager.updateBasket <storemanager_updatebasket>` ``callback`` has been called.

.. NOTE::
    This property is read only.

.. index::
    pair: StoreManager; onBasketUpdate

.. _storemanager_onbasketupdate:

`onBasketUpdate`
----------------

**Summary**

Callback function called whenever the :ref:`StoreManager.basket <storemanager_basket>` changes.

**Syntax** ::

    storeManager.onBasketUpdate = function onBasketUpdateFn()
    {
        // example usage:
        Utilities.log('New basket:');
        Utilities.log(storeManager.basket);
    }

This is called when the user changes the basket on the site, :ref:`StoreManager.addToBasket <storemanager_addtobasket>` is called
or :ref:`StoreManager.removeFromBasket <storemanager_removefrombasket>` is called.

See the :ref:`StoreManager.basket <storemanager_basket>` property for the actual basket contents.

.. index::
    pair: StoreManager; onSitePurchaseConfirmed

.. _storemanager_onsitepurchaseconfirmed:

`onSitePurchaseConfirmed`
-------------------------

**Summary**

Callback function called when a purchase has been completed by the site.

**Syntax** ::

    storeManager.onSitePurchaseConfirmed = function onSitePurchaseConfirmedFn()
    {
        // example usage:
        Utilities.log('New user items:');
        var userItems = storeManager.getUserItems();
        var itemKey;
        for (itemKey in userItems)
        {
            if (userItems.hasOwnProperty(itemKey))
            {
                Utilities.log(itemKey + ': ' + userItems[itemKey].amount);
            }
        }
    }

This is called when the user completes a purchase for your game items on the site.
This should always be driven by a user action such as clicking the mouse or pressing a key.

To find the new user's item amounts call the :ref:`StoreManager.getUserItems <storemanager_getuseritems>` function.

.. NOTE::
    The user may choose to close the basket confirmation dialog triggered by :ref:`storeManager.showConfirmPurchase <storemanager_showconfirmpurchase>`.
    So after this call either :ref:`storeManager.onSitePurchaseConfirmed <storemanager_onsitepurchaseconfirmed>`
    or :ref:`storeManager.onSitePurchaseRejected <storemanager_onsitepurchaserejected>` should be called.

.. WARNING::
    This does **not** imply that the items in the basket at the time of receiving this callback will be the same as the items purchased.
    The user can alter the basket items at any time on our site or purchase items in another tab/browser.
    You should only trust the :ref:`storeManager.getUserItems <storemanager_getuseritems>` function and never compute the items purchased from the
    basket.

.. WARNING::
    The site basket can be opened by the user at anytime, it does **NOT** require that :ref:`storeManager.showConfirmPurchase <storemanager_showconfirmpurchase>` be called.
    A purchase can be completed at any time on our site (whether your game is playing or not) so you should always call
    the :ref:`StoreManager.getUserItems <storemanager_getuseritems>` function on start-up.

.. index::
    pair: StoreManager; onSitePurchaseRejected

.. _storemanager_onsitepurchaserejected:

`onSitePurchaseRejected`
------------------------

**Summary**

Callback function called when a purchase has been rejected by the user.

**Syntax** ::

    storeManager.onSitePurchaseRejected = function onSitePurchaseRejectedFn() {}

This is called when the user cancels a purchase for your game items on the site by closing the confirmation/transaction status
window before the transaction has completed.

.. NOTE::
    Some transactions might take a while to complete and the user might want to continue playing while the transaction processes.
    In this case ``storeManager.onSitePurchaseRejected`` will be called when the user closes the transaction status window.
    The user can then continue to play the game.
    Some time later ``onSitePurchaseConfirmed`` will be called with the completed transaction.

.. WARNING::
    The site basket can be opened by the user at anytime, it does **NOT** require that :ref:`storeManager.showConfirmPurchase <storemanager_showconfirmpurchase>` be called.

.. _storemanager_errorcallback:

Error callback
==============

If no error callback is given then the :ref:`TurbulenzServices.createStoreManager <turbulenzservices_createstoremanager>` ``errorCallbackFn`` is used.

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

Change history
==============

Converting to SDK 0.24.1
------------------------

.. highlight:: yaml

.. _convert_store_items_yaml_0_24_1:

**storeitems.yaml format**

Here is an example of the SDK 0.24.0 ``storeitems.yaml`` file format::

    - key: apples
      title: Apples
      description: Apples to eat
      icon256: assets/icons/apple256.png
      type: own
      max: 10
      price:
        USD: 1.59
        EUR: 1.29
        JPY: 129
        GBP: 0.99

    - key: bananas
      title: Bananas
      description: Somewhat moldy bunch of old bananas
      icon256: assets/icons/banana.png
      type: consume
      price:
        USD: 0.99
        EUR: 0.69
        JPY: 69
        GBP: 0.59

The SDK 0.24.0 YAML format is a flat list of store items.
The SDK 0.24.1 YAML format consists of 2 types of items: offerings and resources.

To convert a SDK 0.24.0 YAML file to the newer SDK 0.24.1 format:

- Add offerings and resources dictionaries.
- Copy and paste the old items into both offerings and resources.
- Remove the ``type`` and ``max`` properties from each offering.
- Remove the ``price`` and ``max`` properties from each resource.
- Add an ``output`` property for each offering for one of its resource.

.. WARNING::
    The new ``storeitems.yaml`` file **MUST** be in this format.
    The only things you can change on the existing offerings are the prices and icons.
    The only things you can change on the existing resources are the title, description and icons.

The above example would become::

    resources:
        - key: apples
          title: Apples
          description: Apples to eat
          icon256: assets/icons/apple256.png
          type: own

        - key: bananas
          title: Bananas
          description: Somewhat moldy bunch of old bananas
          icon256: assets/icons/banana.png
          type: consume

    offerings:
        - key: apples
          title: Apples
          description: Apples to eat
          icon256: assets/icons/apple256.png
          output:
            apples: 1
          price:
            USD: 1.59
            EUR: 1.29
            JPY: 129
            GBP: 0.99

        - key: bananas
          title: Bananas
          description: Somewhat moldy bunch of old bananas
          icon256: assets/icons/banana.png
          output:
            bananas: 1
          price:
            USD: 0.99
            EUR: 0.69
            JPY: 69
            GBP: 0.59

Now the ``storeitems.yaml`` file has two offerings that the user can buy: ``apples`` and ``bananas``.
Each offering will purchase one of the resources in its output.

To change the offerings that users can buy use the new :ref:`available <storeyaml_available>` flag.
Setting this flag to false will hide an offering from the store front and stop users purchasing it.

As users could own the resources they **cannot be deleted** and your game must respect them.

**Bulk items**

If you were previously doing bulk offers and had a YAML file like this::

    - key: token
      title: Token
      description: Tokens for playing
      icon256: assets/icons/token256.png
      type: consume
      price:
        USD: 0.99

    - key: token3
      title: 3 Token
      description: 3 Tokens for playing
      icon256: assets/icons/3token256.png
      type: consume
      price:
        USD: 1.59

Then you can convert to the new system like this::

    resources:
    - key: token
      title: Token
      description: Tokens for playing
      icon256: assets/icons/token256.png
      type: consume

    - key: token3
      title: 3 Token
      description: 3 Tokens for playing
      icon256: assets/icons/3token256.png
      type: consume

    offerings:
    - key: token
      title: Tokens
      description: Tokens for playing
      icon256: assets/icons/token256.png
      output:
        tokens: 1
      price:
        USD: 0.99

    - key: token3
      title: 3 Token
      description: 3 Tokens for playing
      icon256: assets/icons/3token256.png
      available: false
      output:
        tokens3: 1
      price:
        USD: 1.59

    - key: token3v2
      title: 3 Token
      description: 3 Tokens for playing
      icon256: assets/icons/3token256.png
      output:
        tokens: 3
      price:
        USD: 1.59

Note that all of the original resources and offerings are still defined.
The original ``token`` offering is now replaced by the new ``token3v2`` by using the :ref:`available property <storeyaml_available>`.

When the game starts it should consume the ``token3`` user owned resources first then the ``token`` resources.
This way the old ``token3`` user items will be removed from the store front.

As users could own the ``token3`` resource it **cannot be deleted** and your game must respect them.

**Special offers**

If you were previously doing special offers and had a YAML file like this::

    - key: levelA
      title: Level A
      description: Unlock level A
      icon256: assets/icons/levelA256.png
      type: own
      price:
        USD: 0.99

    - key: levelB
      title: Level B
      description: Unlock level B
      icon256: assets/icons/levelB256.png
      type: own
      price:
        USD: 0.99

    - key: all-levels
      title: Level pack
      description: Unlock level A and B
      icon256: assets/icons/alllevels256.png
      type: own
      price:
        USD: 1.59

Then you can convert to the new system like this::

    resources:
    - key: levelA
      title: Level A
      description: Unlock level A
      icon256: assets/icons/levelA256.png
      type: own

    - key: levelB
      title: Level B
      description: Unlock level B
      icon256: assets/icons/levelB256.png
      type: own

    - key: all-levels
      title: Level pack
      description: Unlock level A and B
      icon256: assets/icons/levelB256.png
      type: own

    offerings:
    - key: levelA
      title: Level A
      description: Unlock level A
      icon256: assets/icons/levelA256.png
      output:
        levelA: 1
      price:
        USD: 0.99

    - key: levelB
      title: Level B
      description: Unlock level B
      icon256: assets/icons/levelB256.png
      output:
        levelB: 1
      price:
        USD: 0.99

    - key: all-levels
      title: Level pack
      description: Unlock level A and B
      icon256: assets/icons/alllevels256.png
      available: false
      output:
        all-levels: 1
      price:
        USD: 1.59

    - key: all-levelsv2
      title: Level pack
      description: Unlock level A and B
      icon256: assets/icons/alllevels256.png
      output:
        levelA: 1
        levelB: 1
      price:
        USD: 1.59

Note that all of the original offerings are still defined.
The original ``all-levels`` offering is now replaced by the new ``all-levelsv2`` by using the :ref:`available property <storeyaml_available>`.

As users could own the ``all-levels`` resource it **cannot be deleted** and your game must respect it.

.. _storemanager_updatebasket_0_24_1:

**addToBasket, removeFromBasket, emptyBasket changes**

The :ref:`StoreManager.addToBasket <storemanager_addtobasket>`,
:ref:`StoreManager.removeFromBasket <storemanager_removefrombasket>` and
:ref:`StoreManager.emptyBasket <storemanager_emptybasket>`
functions now do not update the basket until the :ref:`StoreManager.updateBasket <storemanager_updatebasket>` function is called.
This allows you to add multiple items to the basket before updating.
This should only affect games which render an in game basket.
For example, if you have something like::

  storeManager.addToBasket('apples', 4);
  storeManager.addToBasket('bananas', 2);
  var basket = storeManager.basket;
  Utilities.log('Apples x ' + basket.apples.amount + ' = $' + basket.apples.lineTotal);
  Utilities.log('Bananas x ' + basket.bananas.amount + ' = $' + basket.bananas.lineTotal);
  Utilities.log('Basket total $' + basket.total);

In SDK 0.24.1 this should be::

  storeManager.addToBasket('apples', 4);
  storeManager.addToBasket('bananas', 2);
  var basketUpdated = function basketUpdatedFn()
  {
      // once basketUpdated is called the storeManager.basket has changed with lineTotal and total properties recalculated
      // and the site now shows the basket changes
      var basket = storeManager.basket;
      Utilities.log('Apples x ' + basket.apples.amount + ' = $' + basket.apples.lineTotal);
      Utilities.log('Bananas x ' + basket.bananas.amount + ' = $' + basket.bananas.lineTotal);
      Utilities.log('Basket total $' + basket.total);
  };
  storeManager.updateBasket(basketUpdated);
  // storeManager.basket is unchanged here and the site does not reflect the basket changes until basketUpdated is called

Note that in SDK 0.24.1 :ref:`StoreManager.showConfirmPurchase <storemanager_showconfirmpurchase>` calls
:ref:`StoreManager.updateBasket <storemanager_updatebasket>` internally so a ``storeManager.updateBasket`` call is not required
before calling ``storeManager.showConfirmPurchase``.

.. index::
    pair: StoreManager; getItems

.. _storemanager_getitems:

`getItems`
----------

Depreciated in :ref:`SDK 0.24.1 <changes_sdk_0_24_1>`.

**Summary**

The meta data for game store items.

**Syntax** ::

    var items = storeManager.getItems();
    var item = items[key];

``key``
    A JavaScript string.
    The key identifier for the store item.

``item``
    A store item meta object with the following format::

        {
            key: 'apples',
            title: 'Apples',
            description: 'Apples to eat',
            index: 0,
            type: 'consume',
            max: 10,
            price: '1.29'
        }

    ``key``
        A JavaScript string.
        The key identifier for the store item.

    ``title``
        A JavaScript string.
        The title of the store item.

    ``description``
        A JavaScript string.
        The description of the store item.

    ``index``
        A JavaScript number.
        The display index of the store item in a list.

    ``type``
        A JavaScript string.
        ``own`` means that once the item is purchased it will always be owned by the user (note it can still be purchased multiple times).
        ``consume`` means that the item can be consumed after its purchase using the :ref:`StoreManager.consume <storemanager_consume>` function
        decreasing the amount that the user owns.

    ``max``
        A JavaScript number.
        The maximum number of the item that a user can possess.

    ``price``
        A JavaScript string.
        The price of the item in the users currency, see :ref:`StoreManager.currency <storemanager_currency>`.
        This a string to avoid any precision errors.

The properties of ``items`` are ordered by index and if iterated will be returned in the same order as they are defined in
the :ref:`storeitems.yaml <store_items_yaml>` file.

.. NOTE::
    The returned object and all of its properties are read only.
    To change these values edit the :ref:`storeitems.yaml <store_items_yaml>` file and restart the local server.
