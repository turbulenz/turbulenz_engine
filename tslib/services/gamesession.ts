// Copyright (c) 2011-2012 Turbulenz Limited

/*global Utilities: false*/
/*global TurbulenzBridge: false*/
/*global TurbulenzEngine: false*/
/*global TurbulenzServices: false*/

/// <reference path="turbulenzservices.ts" />

//
// API
//
interface GameSessionInfo
{
    sessionData: any;
    playerSessionData: any;
};

interface GameSessionPlayerData
{
    team: string;
    color: string;
    status: string;
    rank: string;
    score: string;
    sortkey: string;
};

class GameSession
{
    static version = 1;

    post_delay = 1000;

    gameSessionId: string;
    gameSlug: string;

    mappingTable: { [idx: string]: string; };

    errorCallbackFn: { (response: string, status?: number) : void; };

    info: GameSessionInfo;
    templatePlayerData: GameSessionPlayerData;
    pendingUpdate: number;
    requestHandler: RequestHandler;
    service: ServiceRequester;
    status: number;
    destroyed: bool;

    postData: { () : void; };

    setStatus(status)
    {
        if (this.destroyed || this.status === status)
        {
            return;
        }

        this.status = status;
        TurbulenzBridge.setGameSessionStatus(this.gameSessionId, status);
    };

    // callbackFn is for testing only!
    // It will not be called if destroy is called in TurbulenzEngine.onUnload
    destroy(callbackFn?)
    {
        var dataSpec;
        if (this.pendingUpdate)
        {
            TurbulenzEngine.clearTimeout(this.pendingUpdate);
            this.pendingUpdate = null;
        }

        if (!this.destroyed && this.gameSessionId)
        {
            // we can't wait for the callback as the browser doesn't
            // call async callbacks after onbeforeunload has been called
            TurbulenzBridge.destroyedGameSession(this.gameSessionId);
            this.destroyed = true;

            dataSpec = {'gameSessionId': this.gameSessionId};

            if (TurbulenzServices.bridgeServices)
            {
                TurbulenzServices.callOnBridge('gamesession.destroy', dataSpec, callbackFn);
            }
            else
            {
                Utilities.ajax({
                    url: '/api/v1/games/destroy-session',
                    method: 'POST',
                    data: dataSpec,
                    callback: callbackFn,
                    requestHandler: this.requestHandler
                });
            }
        }
        else
        {
            if (callbackFn)
            {
                TurbulenzEngine.setTimeout(callbackFn, 0);
            }
        }
    };

    /**
     * Handle player metadata
     */
    setTeamInfo(teamList)
    {
        var sessionData = this.info.sessionData;
        var oldTeamList = sessionData.teamList || [];
        if (teamList.join('#') !== oldTeamList.join('#'))
        {
            sessionData.teamList = teamList;
            this.update();
        }
    };

    setPlayerInfo(playerId, data)
    {
        var playerData = this.info.playerSessionData[playerId];
        var key;
        var dirty = false;

        if (!playerData)
        {
            playerData = {};
            this.info.playerSessionData[playerId] = playerData;
            dirty = true;
        }

        for (key in data)
        {
            if (data.hasOwnProperty(key))
            {
                if (!this.templatePlayerData.hasOwnProperty(key))
                {
                    throw "unknown session data property " + key;
                }
                if (playerData[key] !== data[key])
                {
                    playerData[key] = data[key];
                    dirty = true;
                }
            }
        }

        if (dirty)
        {
            this.update();
        }
    };

    removePlayerInfo(playerId)
    {
        delete this.info.playerSessionData[playerId];
        this.update();
    };

    clearAllPlayerInfo()
    {
        this.info.playerSessionData = {};
        this.update();
    };

    update()
    {
        if (!this.pendingUpdate)
        {
            // Debounce the update to pick up any other changes.
            this.pendingUpdate = TurbulenzEngine.setTimeout(this.postData, this.post_delay);
        }
    };

    static create(requestHandler, sessionCreatedFn,
                  errorCallbackFn?): GameSession
    {
        var gameSession = new GameSession();
        var gameSlug = window.gameSlug;
        var turbulenz = window.top.Turbulenz;
        var turbulenzData = (turbulenz && turbulenz.Data) || {};
        var mode = turbulenzData.mode || TurbulenzServices.mode;
        var createSessionURL = '/api/v1/games/create-session/' + gameSlug;
        var gameSessionRequestCallback = function gameSessionRequestCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                gameSession.mappingTable = jsonResponse.mappingTable;
                gameSession.gameSessionId = jsonResponse.gameSessionId;

                if (sessionCreatedFn)
                {
                    sessionCreatedFn(gameSession);
                }

                TurbulenzBridge.createdGameSession(gameSession.gameSessionId);
            }
            else
            {
                gameSession.errorCallbackFn("TurbulenzServices.createGameSession error with HTTP status " + status + ": " + jsonResponse.msg, status);
            }
        };

        gameSession.info = {
            sessionData: {},
            playerSessionData: {}
        };

        gameSession.templatePlayerData = {
            team: null,
            color: null,
            status: null,
            rank: null,
            score: null,
            sortkey: null
        };

        gameSession.postData = function postDataFn()
        {
            TurbulenzBridge.setGameSessionInfo(JSON.stringify(gameSession.info));
            gameSession.pendingUpdate = null;
        };

        gameSession.pendingUpdate = null;

        gameSession.gameSlug = gameSlug;

        gameSession.requestHandler = requestHandler;
        gameSession.errorCallbackFn = errorCallbackFn || TurbulenzServices.defaultErrorCallback;
        gameSession.gameSessionId = null;
        gameSession.service = TurbulenzServices.getService('gameSessions');
        gameSession.status = null;

        if (!TurbulenzServices.available())
        {
            // Call sessionCreatedFn on a timeout to get the same behaviour as the AJAX call
            if (sessionCreatedFn)
            {
                TurbulenzEngine.setTimeout(function sessionCreatedCall()
                                           {
                                               sessionCreatedFn(gameSession);
                                           }, 0);
            }
            return gameSession;
        }

        if (mode)
        {
            createSessionURL += '/' + mode;
        }

        gameSession.service.request({
            url: createSessionURL,
            method: 'POST',
            callback: gameSessionRequestCallback,
            requestHandler: requestHandler,
            neverDiscard: true
        });

        return gameSession;
    };
};
