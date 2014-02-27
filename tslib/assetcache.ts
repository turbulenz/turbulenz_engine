// Copyright (c) 2012 Turbulenz Limited
/*global Observer: false*/
/*global debug: false*/
/*global TurbulenzEngine: false*/

interface CachedAsset
{
    cacheHit: number;
    asset: any;
    isLoading: boolean;
    key: string;
    observer: Observer;
};

interface AssetCacheOnLoadFn { (key: string,
                                params: any,
                                callback: { (asset: any): void; }): void; };

interface AssetCacheOnDestroyFn { (oldestKey: string, asset: any): void; };

interface AssetCacheOnLoadedFn { (key: string, asset: any, params: any): void; };

interface AssetCacheParams
{
    size?: number;
    onLoad: AssetCacheOnLoadFn;
    onDestroy?: AssetCacheOnDestroyFn;
};

//
// AssetCache
//

class AssetCache
{
    static version = 2;

    maxCacheSize: number;
    onLoad: AssetCacheOnLoadFn;
    onDestroy: AssetCacheOnDestroyFn;

    hitCounter: number;
    cache: { [idx: string]: CachedAsset; };
    cacheArray: CachedAsset[];

    exists(key: string): boolean
    {
        return this.cache.hasOwnProperty(key);
    }

    isLoading(key: string): boolean
    {
        var cachedAsset = this.cache[key];
        if (cachedAsset)
        {
            return cachedAsset.isLoading;
        }
        return false;
    }

    get(key: string): any
    {
        debug.assert(key, "Key is invalid");

        var cachedAsset = this.cache[key];
        if (cachedAsset)
        {
            cachedAsset.cacheHit = this.hitCounter;
            this.hitCounter += 1;
            return cachedAsset.asset;
        }
        return null;
    }

    request(key: string, params?, callback?: AssetCacheOnLoadedFn): void
    {
        debug.assert(key, "Key is invalid");

        var cachedAsset = this.cache[key];
        if (cachedAsset)
        {
            cachedAsset.cacheHit = this.hitCounter;
            this.hitCounter += 1;
            if (!callback)
            {
                return;
            }
            if (cachedAsset.isLoading)
            {
                cachedAsset.observer.subscribe(callback);
            }
            else
            {
                TurbulenzEngine.setTimeout(function requestCallbackFn() {
                    callback(key, cachedAsset.asset, params);
                }, 0);
            }
            return;
        }

        var cacheArray = this.cacheArray;
        var cacheArrayLength = cacheArray.length;

        if (cacheArrayLength >= this.maxCacheSize)
        {
            var cache = this.cache;
            var oldestCacheHit = this.hitCounter;
            var oldestKey = null;
            var oldestIndex;
            var i;

            for (i = 0; i < cacheArrayLength; i += 1)
            {
                if (cacheArray[i].cacheHit < oldestCacheHit)
                {
                    oldestCacheHit = cacheArray[i].cacheHit;
                    oldestIndex = i;
                }
            }

            cachedAsset = cacheArray[oldestIndex];
            oldestKey = cachedAsset.key;

            if (this.onDestroy && !cachedAsset.isLoading)
            {
                this.onDestroy(oldestKey, cachedAsset.asset);
            }
            delete cache[oldestKey];
            cachedAsset.cacheHit = this.hitCounter;
            cachedAsset.asset = null;
            cachedAsset.isLoading = true;
            cachedAsset.key = key;
            cachedAsset.observer = Observer.create();
            this.cache[key] = cachedAsset;
        }
        else
        {
            cachedAsset = this.cache[key] = cacheArray[cacheArrayLength] = {
                cacheHit: this.hitCounter,
                asset: null,
                isLoading: true,
                key: key,
                observer: Observer.create()
            }
        }
        this.hitCounter += 1;

        var that = this;
        var observer = cachedAsset.observer;
        if (callback)
        {
            observer.subscribe(callback);
        }
        this.onLoad(key, params, function onLoadedAssetFn(asset)
                {
                    // Check cacheAsset has not been replaced during loading
                    if (cachedAsset.key === key)
                    {
                        cachedAsset.cacheHit = that.hitCounter;
                        cachedAsset.asset = asset;
                        cachedAsset.isLoading = false;
                        that.hitCounter += 1;

                        cachedAsset.observer.notify(key, asset, params);
                    }
                    else
                    {
                        if (that.onDestroy)
                        {
                            that.onDestroy(key, asset);
                        }
                        observer.notify(key, null, params);
                    }
                });
    }

    // Constructor function
    static create(cacheParams: AssetCacheParams): AssetCache
    {
        if (!cacheParams.onLoad)
        {
            return null;
        }

        var assetCache = new AssetCache();

        assetCache.maxCacheSize = cacheParams.size || 64;
        assetCache.onLoad = cacheParams.onLoad;
        assetCache.onDestroy = cacheParams.onDestroy;

        assetCache.hitCounter = 0;
        assetCache.cache = {};
        assetCache.cacheArray = [];

        return assetCache;
    }
}
