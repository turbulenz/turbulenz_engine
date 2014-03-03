.. index::
    single: AssetCache

.. highlight:: javascript

.. _assetcache:

---------------------
The AssetCache Object
---------------------

**Version 1 - SDK 0.24.0 to 0.27.0**

**Version 2 - SDK 0.28.0**

Provides functionality for caching assets using least recently used (LRU) caching.
When the cache is full each cache miss causes the removal of the asset that has the oldest requested time.

**Required scripts**

The AssetCache object requires::

    /*{{ javascript("jslib/assetcache.js") }}*/

**Example**

The ``AssetCache`` object is used in the leaderboards sample to make sure that by scrolling through users' avatar
textures the amount of memory used is limited (while keeping the interface smooth).

Constructor
===========

.. index::
    pair: AssetCache; create

`create`
--------

**Summary**

Creates and returns an AssetCache object.

**Syntax** ::

    var cacheParams = {
            size: 32,
            load: function loadAssetFn(key, params, loadedCallback) {},
            destroy: function destroyAssetFn(key, asset) {}
        };

    var assetCache = AssetCache.create(cacheParams);

    // example usage:
    cacheParams = {
            size: 64,
            onLoad: function loadTextureFn(key, params, loadedCallback)
            {
                graphicsDevice.createTexture({
                        src: key,
                        mipmaps: true,
                        onload: loadedCallback
                    });
            },
            onDestroy: function destroyTextureFn(key, texture)
            {
                if (texture)
                {
                    texture.destroy();
                }
            }
        };
    var textureCache = AssetCache.create(cacheParams);

``onLoad``
    A JavaScript function.
    The function called when a cache miss occurs to load the asset into the cache.
    See :ref:`assetCache.onLoad <assetcache_onload>`.

``onDestroy`` (Optional)
    A JavaScript function.
    This is called for the asset with the oldest requested time when a cache miss occurs and the cache is full.
    See :ref:`assetCache.onDestroy <assetcache_ondestroy>`.

``size`` (Optional)
    A JavaScript integer.
    The size (maximum possible number of assets) of the asset cache.
    Defaults to 64.

Methods
=======

.. index::
    pair: AssetCache; request

.. _assetcache_request:

`request`
---------

**Summary**

Load the asset from the cache.

**Syntax** ::

    var callback = function loadedCallbackFn(key, asset, params)
    {
        // Loading complete, use asset/trigger cache use
    };

    assetCache.request(key, params, callback);

``key``
    The cache identifier.
    This is normally the URL of the asset to get.

``params`` (Optional)
    Custom params object passed onto the :ref:`assetCache.onLoad <assetcache_onload>` function in the case of a cache miss.

``callback`` (Optional) Added in :ref:`SDK 0.28.0 <assetcache_v2>`
    The callback to be triggered when the requested asset has been loaded.
    This function will be called with the following arguments:

    ``key``
        The cache identifier.

    ``asset``
        The loaded asset that exists in the cache.
        Note that this value can be any value returned by the loaded function,
        for example NULL if the asset cannot be loaded or found.
        If the asset requested is forced out of the cache before
        loading is complete the onDestroy function will be called and the asset
        returned in this callback will be NULL.

    ``params``
        Custom params object passed to the request function.
        This will be undefined if params is not used.

In the case of a cache miss the asset will be loaded asynchronously using the :ref:`assetCache.onLoad <assetcache_onload>` function.
If the cache is full this will also trigger an :ref:`assetCache.onDestroy <assetcache_ondestroy>` function for the asset that has the oldest requested time.

In :ref:`SDK 0.28.0 <assetcache_v2>`

    Does not return a value.

    If the asset is already loading, the callback argument will be added to list of
    callbacks to notify when the asset is loaded.

In SDK 0.24.0 to 0.27.0

    Returns the loaded asset for a cache hit.
    If the key is missing from the cache (cache miss) or if the asset is loading returns ``null``.


.. index::
    pair: AssetCache; get

.. _assetcache_get:

`get`
-----

**Summary**

Added in :ref:`SDK 0.28.0 <assetcache_v2>`

Get the asset from the cache.

**Syntax** ::

    var assetOrNull = assetCache.get(key);

``key``
    The cache identifier.
    This is normally the URL of the asset to get.

Returns the loaded asset for a cache hit.
If the key is missing from the cache (cache miss) or if the asset is loading returns ``null``.

.. index::
    pair: AssetCache; exists

.. _assetcache_exists:

`exists`
--------

**Summary**

Check if an asset is already in the cache.

**Syntax** ::

    var assetExists = assetCache.exists(key);

``key``
    The cache identifier.
    This is normally the URL of the asset.

Returns ``true`` if the asset is in the cache (assets which are loading will also return ``true`` here).
Returns ``false`` if the asset is not in the cache.

.. index::
    pair: AssetCache; isLoading

.. _assetcache_isloading:

`isLoading`
-----------

**Summary**

Check if an asset is currently loading.

**Syntax** ::

    var assetLoading = assetCache.isLoading(key);

``key``
    The cache identifier.
    This is normally the URL of the asset.

Returns ``true`` if the is loading.
Returns ``false`` if the asset is not in the cache or has completed loading.

Properties
==========

.. index::
    pair: AssetCache; onLoad

.. _assetcache_onload:

`onLoad`
--------

**Summary**

The function called when a cache miss occurs to load the asset into the cache.

**Syntax** ::

    assetCache.onLoad = function assetCacheOnLoadFn(key, params, loadedCallback) {};

It takes the arguments:

``key``
    The cache identifier.
    This is normally the URL of the asset to load.

``params``
    Custom params object passed into the :ref:`request <assetcache_request>` function.

``loadedCallback``
    Callback to call with the asset once it is loaded.

.. index::
    pair: AssetCache; onDestroy

.. _assetcache_ondestroy:

`onDestroy`
-----------

**Summary**

This is called for the asset with the oldest requested time when a cache miss occurs and the cache is full.

**Syntax** ::

    assetCache.onDestroy = function assetCacheOnLoadFn(key, asset) {};

It takes the arguments:

    ``key``
        The cache identifier.
        This is normally the URL of the asset to load.

    ``asset``
        The asset being removed from the cache.
