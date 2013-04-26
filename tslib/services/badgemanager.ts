// Copyright (c) 2011-2012 Turbulenz Limited

/*global TurbulenzServices*/
/*global TurbulenzBridge*/
/*global Utilities*/

/// <reference path="turbulenzservices.ts" />

//
// API
//
interface BadgeManagerDataSpec
{
    gameSessionId?: string;
    badge_key?: string;
    current?: number;
};

//badges is created by Turbulenzservices.createBadges
class BadgeManager
{
    static version = 1;

    gameSession: GameSession;
    gameSessionId: string;
    service: ServiceRequester;
    requestHandler: RequestHandler;

    // list all badges (just queries the yaml file)
    listUserBadges(callbackFn, errorCallbackFn)
    {
        var that = this;
        var cb = function cbFn(jsonResponse, status)
        {
            if (status === 200)
            {
                callbackFn(jsonResponse.data);
            }
            else if (status === 404)
            {
                callbackFn(null);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("Badges.listUserBadges failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              [callbackFn]);
            }
        };

        this.service.request({
            url: '/api/v1/badges/progress/read/' + this.gameSession.gameSlug,
            method: 'GET',
            callback: cb,
            requestHandler: this.requestHandler
        });
    };

    awardUserBadge(badge_key, callbackFn, errorCallbackFn)
    {
        this.addUserBadge(badge_key, null, callbackFn, errorCallbackFn);
    };

    updateUserBadgeProgress(badge_key, current, callbackFn, errorCallbackFn)
    {
        var that = this;
        if (current && typeof current === 'number')
        {
            this.addUserBadge(badge_key, current, callbackFn, errorCallbackFn);
        }
        else
        {
            var errorCallback = errorCallbackFn || that.errorCallbackFn;
            errorCallback("Badges.updateUserBadgeProgress expects a numeric value for current",
                          400,
                          [badge_key, current, callbackFn]);
        }
    };

    // add a badge to a user (gets passed a badge and a current level
    // over POST, the username is taken from the environment)
    addUserBadge(badge_key, current, callbackFn, errorCallbackFn)
    {
        var that = this;
        var cb = function cbFn(jsonResponse, status)
        {
            if (status === 200)
            {
                var userbadge = jsonResponse.data;
                userbadge.gameSlug = that.gameSession.gameSlug;
                TurbulenzBridge.updateUserBadge(userbadge);
                callbackFn(userbadge);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("Badges.addUserBadge failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              [badge_key, current, callbackFn]);
            }
        };

        var dataSpec : BadgeManagerDataSpec = {};
        dataSpec.gameSessionId = this.gameSessionId;
        dataSpec.badge_key = badge_key;

        var url = '/api/v1/badges/progress/add/' + this.gameSession.gameSlug;

        if (current)
        {
            dataSpec.current = current;
        }

        if (TurbulenzServices.bridgeServices)
        {
            TurbulenzServices.addSignature(dataSpec, url);
            TurbulenzServices.callOnBridge('badge.add', dataSpec, function unpackResponse(response)
            {
                cb(response, response.status);
            });
        }
        else
        {
            this.service.request({
                url: url,
                method: 'POST',
                data : dataSpec,
                callback: cb,
                requestHandler: this.requestHandler,
                encrypt: true
            });
        }
    };

    // list all badges (just queries the yaml file)
    listBadges(callbackFn, errorCallbackFn)
    {
        var that = this;
        var cb = function cbFn(jsonResponse, status)
        {
            if (status === 200)
            {
                callbackFn(jsonResponse.data);
            }
            else if (status === 404)
            {
                callbackFn(null);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("Badges.listBadges failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              [callbackFn]);
            }
        };

        this.service.request({
            url: '/api/v1/badges/read/' + that.gameSession.gameSlug,
            method: 'GET',
            callback: cb,
            requestHandler: this.requestHandler
        });
    };

    errorCallbackFn()
    {
        var x = Array.prototype.slice.call(arguments);
        Utilities.log('BadgeManager error: ', x);
    };

    static create(requestHandler: RequestHandler,
                  gameSession: GameSession): BadgeManager
    {
        if (!TurbulenzServices.available())
        {
            return null;
        }

        var badgeManager = new BadgeManager();

        badgeManager.gameSession = gameSession;
        badgeManager.gameSessionId = gameSession.gameSessionId;
        badgeManager.service = TurbulenzServices.getService('badges');
        badgeManager.requestHandler = requestHandler;

        return badgeManager;
    };
};