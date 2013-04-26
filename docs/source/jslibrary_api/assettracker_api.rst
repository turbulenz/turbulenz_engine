.. index::
    single: AssetTracker

.. highlight:: javascript

.. _assetTrackerObject:

-----------------------
The AssetTracker Object
-----------------------

Utility object that provides a means to count the number of assets loaded at start up during development. Once game startup requirments have been finalised, this information can then
be used to calculate the loading progress as the game downloads its assets.

Constructor
===========

.. index::
    pair: AssetTracker; create

`create`
--------

**Summary**

Creates the AssetTracker object.

This object can be used to determine the total number of assets that are loaded at startup.

By creating the the object using *zero* for the numberAssetsToLoad and *true* for the displayLog parameters, a log showing all the
the names of the assets loaded and the count will be displayed in the console.

Once the total number of assets to load is known, the parameters for creating the object should then be modified.

**Syntax** ::

    var assetTracker = AssetTracker.create(numberAssetsToLoad, displayLog);

``numberAssetsToLoad``
    The number of assets that are going to be loaded. If this value is zero, no progress infomation is calculated.

``displayLog``
    Boolean flag to enable logging information to console. Usefully while game is in development. Should be set for false before
    the game is released.

Method
======


.. index::
    pair: AssetTracker; eventOnLoadHandler

`eventOnLoadHandler`
--------------------

**Summary**

This callback has to be registered on the *'eventOnLoad'* event with the request handler being used for the game.

This callback is used to perform tracking of loaded assets and progress calculations.

It is called once per asset loaded.

**Syntax** ::

    requestHandler.addEventListener('eventOnload', assetTracker.eventOnLoadHandler);

This callback has a single parameter which is passed to it when it is triggered.

``event``
    An object with the following fields
        ``name``
            The name of the asset just loaded.

        ``eventType``
            The event that triggered this callback.

.. index::
    pair: AssetTracker; getLoadedCount

`getLoadedCount`
----------------

**Summary**

    Returns the number of assets loaded.

**Syntax** ::

    var numberAssetsLoaded = assetTracker.getLoadedCount();


.. index::
    pair: AssetTracker; getLoadingProgress

`getLoadingProgress`
--------------------

**Summary**

    Returns the current loading progress, a number between 0 and 1 inclusive.
    When all the requested assets have been loaded, this value will be equal to 1.

**Syntax** ::

    var loadingProgress = assetTracker.getLoadingProgress();


.. index::
    pair: AssetTracker; setCallback

`setCallback`
-------------

**Summary**

    Sets a callback function for an action to take each time the assetTracker updates its values and calculations.

**Syntax** ::

    assetTracker.setCallback(callback);
