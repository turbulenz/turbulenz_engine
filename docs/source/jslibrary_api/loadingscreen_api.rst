.. index::
    single: LoadingScreen

.. highlight:: javascript

------------------------
The LoadingScreen Object
------------------------

Utility object to be used while the game is loading. The LoadingScreen object has the ability to draw a texture in the middle of the screen surrounded by a solid color.
If provided with the necessary information, it will also render a loading progress bar to visually depict loading progress of requested assets.

It can fade in and out smoothly if requested.

**Required scripts**

The LoadingScreen object requires::

    /*{{ javascript("jslib/loadingscreen.js") }}*/

Constructor
===========

.. index::
    pair: LoadingScreen; create

`create`
--------

**Summary**

Creates the LoadingScreen object using data from a parameter object.

If the parameter object is not specified, default values will be used and the loading progress bar will **not** be rendered.

All color fields are in RGBA format.

**Syntax** ::

    var loadingScreenParameters = {
        backgroundColor: mathDevice.v4Build(1, 1, 1, 1),
        barColor: mathDevice.v4Build(1, 1, 0, 1),
        barCenter: {
            x: 0.5,
            y: 0.5
        },
        barBorderSize: 4,
        barBackgroundColor: mathDevice.v4Build(0, 0, 1, 1),
        barBackgroundHeight: 24,
        barBackgroundWidth: 540,
        assetTracker: trackingObject
    };
    var loadingScreen = LoadingScreen.create(graphicsDevice, mathDevice, loadingScreenParameters);

``graphicsDevice``
    The GraphicsDevice object to be used.

``mathDevice``
    The MathDevice object to be used.

``backgroundColor``
    A :ref:`Vector4 <v4object>` which specifies the background color for the loading screen.

``barBackgroundColor``
    A :ref:`Vector4 <v4object>` which specifies the background color for the loading bar.

``barBackgroundHeight``
    The height of the loading bar background.
    The loading bar's height is modified by the border around it. The loading bar height is equal to  ``barBackgroundHeight`` - (2 * ``barBorderSize``).

``barBackgroundWidth``
    The width of the loading bar background.
    The loading bar's width is modified by the border around it. The loading bar width is equal to  ``barBackgroundWidth`` - (2 * ``barBorderSize``).

``barColor``
    A :ref:`Vector4 <v4object>` specifies the color for the loading bar.

``barCenter``
    The center point of the loading progress bar. This object has two fields, x and y, which store the center location as a percentage of the screen width and height.
    The valid range is [0,1] inclusive.

``barBorderSize``
    The number of pixels between the sides of the loading bar and its background.

``progress`` (Optional)
    A JavaScript number between 0 and 1.
    The current progress to display.
    This can also be set with the :ref:`loadingScreen.setProgress <loadingscreen_setprogress>` method.
    If this field is not specified, the ``assetTracker`` property must be set or the loading bar will not be rendered
    until :ref:`loadingScreen.setProgress <loadingscreen_setprogress>` is called.

``assetTracker`` (Optional)
    An object used to count the number of assets loaded and to perform the loading progress calculation.
    If ``progress`` is unset, this generates the progress from the loading assets.
    If this field is not specified, the ``progress`` property must be set or the loading bar will not be rendered.

    For more information, see :ref:`AssetTracker object <assetTrackerObject>`.


Method
======

.. index::
    pair: LoadingScreen; setProgress

`setProgress`
-------------

**Summary**

**Syntax** ::

    loadingScreen.setProgress(progress);

``progress``
    A JavaScript number between 0 and 1.
    The current progress to display.
    Set to ``null`` to use the progress generated from an :ref:`AssetTracker object <assetTrackerObject>`.

.. index::
    pair: LoadingScreen; loadAndSetTexture

`loadAndSetTexture`
-------------------

**Summary**

Using this method, the loading screen would request for the texture specified and set it once the texture has been downloaded.


**Syntax** ::

    loadingScreen.loadAndSetTexture(graphicsDevice, requestHandler, mappingTable, textureName);

``graphicsDevice``
    The GraphicsDevice object to be used.

``requestHandler``
    The RequestHandler object to be used.

``mappingTable``
    The mapping table for remapping the texture name.

``textureName``
    The name for the :ref:`Texture <texture>` object to load and display while loading.

.. index::
    pair: LoadingScreen; setTexture

`setTexture`
------------

**Summary**

**Syntax** ::

    loadingScreen.setTexture(texture);

``texture``
    The :ref:`Texture <texture>` object to display while loading.

.. index::
    pair: LoadingScreen; render

`render`
--------

**Summary**

Adjust the alpha values of the background and texture.
Useful for producing a fade effect from the loading screen to the game.

**Syntax** ::

    loadingScreen.render(backgroundAlpha, textureAlpha);

``backgroundAlpha``
    The alpha value of the background color (will be capped to the range 0 - 1).

``textureAlpha``
    The alpha value of the texture.

Properties
==========

.. index::
    pair: LoadingScreen; version

`version`
---------

**Summary**

The version number of the LoadingScreen implementation.

**Syntax** ::

    var versionNumber = loadingScreen.version;
