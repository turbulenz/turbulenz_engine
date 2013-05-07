// Copyright (c) 2011-2012 Turbulenz Limited
/*global window: false*/
/*global TurbulenzServices: false*/
/*global debug: false*/
/*jshint nomen: false*/

/// <reference path="../debug.ts" />

/// <reference path="turbulenzservices.ts" />

/*
 * An object that takes care of communication with the gamesite and, among
 * other things, replaces the deprecated 'osdlib' module.
 *
 * It wraps an EventEmitter instance that is stored on the page and provides
 * methods that manually display the 'loading'-flag, post certain events to
 * the page or request information about a player's settings.
 *
 */

class TurbulenzBridge
{
    static private _bridge = undefined;

    /**
     * Try to find an 'EventEmitter' object on the page and cache it.
     */
    static _initInstance()
    {
        var Turbulenz = window.top.Turbulenz;

        if (Turbulenz && Turbulenz.Services)
        {
            var bridge = Turbulenz.Services.bridge;
            if (!bridge)
            {
                return;
            }

            this._bridge = bridge;

            this.emit = bridge.emit;
            // TODO can remove all of these or's after gamesite and hub updates
            this.on = bridge.gameListenerOn || bridge.addListener || bridge.setListener;

            // we cant use off yet because the function received on the other VM is re-wrapped each time
            //this.off = bridge.gameListenerOff;
            // Legacy functions addListener/setListener
            this.addListener = bridge.gameListenerOn || bridge.addListener || bridge.setListener;
            this.setListener = bridge.gameListenerOn || bridge.setListener;
        }
        else
        {
            debug.log("No turbulenz services");
        }

        if (typeof TurbulenzServices !== 'undefined')
        {
            TurbulenzServices.addBridgeEvents();
        }
    };

    static isInitialised(): bool
    {
        return (this._bridge !== undefined);
    };

    static emit(serviceName: string, request?: string)
    {
    };

    static on(serviceName: string, cb: { (data: string) : void; })
    {
    };

    //off: function offFn() {},

    static addListener() {};

    static setListener(eventName: string,
                       listener: { (params: string): void; })
    {
    };

    /**
     * Message that passes game configuration information from the hosting site
     */
    static setOnReceiveConfig(callback)
    {
        this.on('config.set', callback);
    };

    static triggerRequestConfig()
    {
        this.emit('config.request');
    };

    /**
     * Methods to signal the beginning and end of load/save processes.
     * This will display hints to the player and helps the page
     * to prioritize resources.
     */
    static startLoading()
    {
        this.emit('status.loading.start');
    };

    static startSaving()
    {
        this.emit('status.saving.start');
    };

    static stopLoading()
    {
        this.emit('status.loading.stop');
    };

    static stopSaving()
    {
        this.emit('status.saving.stop');
    };

    /**
     * These methods tell the gamesite the gameSession so it can
     * emit a heartbeat for the message server to detect.
     * gameSessionId - A string for identifying the current game session
     */
    static createdGameSession(gameSessionId)
    {
        this.emit('game.session.created', gameSessionId);
    };

    static destroyedGameSession(gameSessionId)
    {
        this.emit('game.session.destroyed', gameSessionId);
    };

    static setGameSessionStatus(gameSessionId, status)
    {
        this.emit('game.session.status', gameSessionId, status);
    };

    static setGameSessionInfo(info)
    {
        this.emit('game.session.info', info);
    };

    /**
     * Update a userbadge. Used by the BadgeManager
     */
    static updateUserBadge(badge)
    {
        this.emit('userbadge.update', badge);
    };

    /**
     * Update a leaderboard. Used by the LeaderboardManager
     */
    static updateLeaderBoard(scoreData)
    {
        this.emit('leaderboards.update', scoreData);
    };

    /**
     * Handle multiplayer join events
     */
    static setOnMultiplayerSessionToJoin(callback)
    {
        this.on('multiplayer.session.join', callback);
    };

    static triggerJoinedMultiplayerSession(session)
    {
        this.emit('multiplayer.session.joined', session);
    };

    static triggerLeaveMultiplayerSession(sessionId)
    {
        this.emit('multiplayer.session.leave', sessionId);
    };

    static triggerMultiplayerSessionMakePublic(sessionId)
    {
        this.emit('multiplayer.session.makepublic', sessionId);
    };

    /**
     * Handle store basket events
     */
    static setOnBasketUpdate(callback)
    {
        this.on('basket.site.update', callback);
    };

    static triggerBasketUpdate(basket?)
    {
        this.emit('basket.game.update.v2', basket);
    };

    static triggerUserStoreUpdate(items)
    {
        this.emit('store.user.update', items);
    };

    static setOnPurchaseConfirmed(callback)
    {
        this.on('purchase.confirmed', callback);
    };

    static setOnPurchaseRejected(callback)
    {
        this.on('purchase.rejected', callback);
    };

    static triggerShowConfirmPurchase()
    {
        this.emit('purchase.show.confirm');
    };

    static triggerFetchStoreMeta()
    {
        this.emit('fetch.store.meta');
    };

    static setOnStoreMeta(callback)
    {
        this.on('store.meta.v2', callback);
    };

    /**
     * Methods to signal changes of the viewport's aspect ratio to the page.
     */
    static changeAspectRatio(ratio)
    {
        this.emit('change.viewport.ratio', ratio);
    };

    /**
     * Methods to set callbacks to react to events happening on the page.
     */
    static setOnViewportHide(callback)
    {
        this.on('change.viewport.hide', callback);
    };

    static setOnViewportShow(callback)
    {
        this.on('change.viewport.show', callback);
    };

    static setOnFullscreenOn(callback)
    {
        this.on('change.viewport.fullscreen.on', callback);
    };

    static setOnFullscreenOff(callback)
    {
        this.on('change.viewport.fullscreen.off', callback);
    };

    static setOnMenuStateChange(callback)
    {
        this.on('change.menu.state', callback);
    };

    static setOnUserStateChange(callback)
    {
        this.on('change.user.state', callback);
    };

    /**
     * Methods to send trigger event-emission on the page. These
     * prompt the page to trigger the aforementioned corresponding
     * onXXXX methods.
     */

    static triggerOnFullscreen()
    {
        this.emit('trigger.viewport.fullscreen');
    };

    static triggerOnViewportVisibility()
    {
        this.emit('trigger.viewport.visibility');
    };

    static triggerOnMenuStateChange()
    {
        this.emit('trigger.menu.state');
    };

    static triggerOnUserStateChange()
    {
        this.emit('trigger.user.state');
    };

    /**
     * Methods to send requests for information to the page. These
     * methods can be used to send state-queries. They take a callback
     * function and prompt the page to call it.
     */

    /**
     * callback - a function that takes a single boolean value that
     * will be set to 'true' if the viewport is in fullscreen.
     */
    static queryFullscreen(callback)
    {
        this.emit('query.viewport.fullscreen', callback);
    };

    /**
     * callback - a function that takes a single boolean value that
     * will be set to 'true' if the viewport is visible.
     */
    static queryViewportVisibility(callback)
    {
        this.emit('query.viewport.visibility', callback);
    };

    /**
     * callback - a function that takes an object-representation of
     * the current menu-state.
     */
    static queryMenuState(callback)
    {
        this.emit('query.menu.state', callback);
    };

    /**
     * callback - a function that takes an object-representation of
     * the current state of the user's settings.
     */
    static queryUserState(callback)
    {
        this.emit('query.user.state', callback);
    };
};

if (!TurbulenzBridge.isInitialised())
{
    TurbulenzBridge._initInstance();
}
