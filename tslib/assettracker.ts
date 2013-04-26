// Copyright (c) 2009-2013 Turbulenz Limited

/*global Utilities: false*/

/// <reference path="utilities.ts" />

class AssetTracker
{
    static version = 1;

    assetsLoadedCount: number;
    loadingProgress: number;
    numberAssetsToLoad: number;
    callback: { (): void; };
    displayLog: bool;

    eventOnLoadHandler: { (event): void; }; // TODO: ? who calls this?

    getLoadedCount(): number
    {
        return this.assetsLoadedCount;
    };

    getLoadingProgress(): number
    {
        return this.loadingProgress;
    };

    getNumberAssetsToLoad(): number
    {
        return this.numberAssetsToLoad;
    };

    eventOnAssetLoadedCallback(event)
    {
        var numberAssetsToLoad = this.numberAssetsToLoad;

        this.assetsLoadedCount += 1;

        if (numberAssetsToLoad)
        {
            var progress = this.assetsLoadedCount / numberAssetsToLoad;

            this.loadingProgress = Math.max(this.loadingProgress, Math.min(progress, 1.0));
        }

        if (this.displayLog)
        {
            Utilities.log(event.name + " (Asset Number " + this.assetsLoadedCount + ") Progress : " + this.loadingProgress);
        }

        if (this.callback)
        {
            this.callback();
        }
    };

    setCallback(callback)
    {
        this.callback = callback;
    };

    setNumberAssetsToLoad(numberAssetsToLoad)
    {
        if ((numberAssetsToLoad) && (this.numberAssetsToLoad !== numberAssetsToLoad))
        {
            this.numberAssetsToLoad = numberAssetsToLoad;

            var progress = this.assetsLoadedCount / numberAssetsToLoad;

            this.loadingProgress = Math.max(this.loadingProgress, Math.min(progress, 1.0));
        }

        if (this.callback)
        {
            this.callback();
        }
    };

    // Constructor function
    static create(numberAssetsToLoad: number, displayLog: bool): AssetTracker
    {
        var f = new AssetTracker();

        f.assetsLoadedCount = 0;
        f.loadingProgress = 0;
        f.numberAssetsToLoad = 0;
        f.callback = null;
        f.displayLog = displayLog;

        if (numberAssetsToLoad)
        {
            f.numberAssetsToLoad = numberAssetsToLoad;
        }

        f.eventOnLoadHandler = function assetTrackerEventOnLoadHandlerFn(event)
        {
            f.eventOnAssetLoadedCallback(event);
        };

        return f;
    };
};
