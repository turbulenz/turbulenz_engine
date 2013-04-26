// Copyright (c) 2012 Turbulenz Limited

/*global TurbulenzServices: false*/
/*global MultiPlayerSession: false*/

/// <reference path="multiplayersession.ts" />

//
// API
//
class MultiPlayerSessionManager
{
    requestHandler: RequestHandler;
    gameSession: GameSession;
    sessionList: any[];

    // Public API
    createSession(numSlots,
                  sessionCreatedFn,
                  errorCallbackFn)
    {
        var gameSession = this.gameSession;
        var gameSessionId = gameSession.gameSessionId;
        var requestHandler = this.requestHandler;
        var that = this;
        var request = {
            url: '/api/v1/multiplayer/session/create/' + gameSession.gameSlug,
            method: 'POST',
            data: {
                'slots': numSlots,
                'gameSessionId': gameSessionId
            },
            requestHandler: requestHandler
        };

        var successCallback = function successCallbackFn(jsonResponse)
        {
            var mpSession;
            var sessionData = jsonResponse.data;
            sessionData.requestHandler = requestHandler;
            sessionData.gameSessionId = gameSessionId;
            mpSession = MultiPlayerSession.create(sessionData, sessionCreatedFn, errorCallbackFn);
            that.sessionList.push(mpSession);
        };

        this.processRequest("createSession", request, successCallback,
                            errorCallbackFn);
    };

    getJoinRequestQueue() {
        return TurbulenzServices.multiplayerJoinRequestQueue;
    };

    joinSession(sessionID,
                                                                 sessionJoinedFn,
                                                                 errorCallbackFn)
    {
        var gameSessionId = this.gameSession.gameSessionId;
        var requestHandler = this.requestHandler;
        var that = this;
        var request = {
            url: '/api/v1/multiplayer/session/join',
            method: 'POST',
            data: {
                'session': sessionID,
                'gameSessionId': gameSessionId
            },
            requestHandler: requestHandler
        };

        var successCallback = function successCallbackFn(jsonResponse)
        {
            var mpSession;
            var sessionData = jsonResponse.data;
            sessionData.requestHandler = requestHandler;
            sessionData.gameSessionId = gameSessionId;
            mpSession = MultiPlayerSession.create(sessionData, sessionJoinedFn, errorCallbackFn);
            that.sessionList.push(mpSession);
        };

        this.processRequest("joinSession", request, successCallback,
                            errorCallbackFn);
    };

    joinAnySession(sessionJoinedFn,
                                                                       failCallbackFn,
                                                                       errorCallbackFn)
    {
        var gameSession = this.gameSession;
        var gameSessionId = gameSession.gameSessionId;
        var requestHandler = this.requestHandler;
        var that = this;
        var request = {
            url: '/api/v1/multiplayer/session/join-any/' + gameSession.gameSlug,
            method: 'POST',
            data: {
                'gameSessionId': gameSessionId
            },
            requestHandler: requestHandler
        };

        var successCallback = function successCallbackFn(jsonResponse)
        {
            var sessionData = jsonResponse.data;
            var mpSession;

            if (sessionData.sessionid)
            {
                sessionData.requestHandler = requestHandler;
                sessionData.gameSessionId = gameSessionId;
                mpSession = MultiPlayerSession.create(sessionData, sessionJoinedFn, errorCallbackFn);
                that.sessionList.push(mpSession);
            }
            else
            {
                failCallbackFn();
            }
        };

        this.processRequest("joinAnySession", request, successCallback,
                            errorCallbackFn);
    };

    joinOrCreateSession(numSlots,
                                                                                 sessionJoinCreatedFn,
                                                                                 errorCallbackFn)
    {
        var that = this;
        var joinFailedCallback = function joinFailedCallbackFn()
        {
            that.createSession(numSlots, sessionJoinCreatedFn, errorCallbackFn);
        };

        this.joinAnySession(sessionJoinCreatedFn, joinFailedCallback, errorCallbackFn);
    };

    getFriendsSessions(querySuccessFn,
                                                                               errorCallbackFn)
    {
        var requestHandler = this.requestHandler;

        var request = {
            url: '/api/v1/multiplayer/session/list/' + this.gameSession.gameSlug,
            method: 'GET',
            requestHandler: requestHandler
        };

        var successCallback = function successCallbackFn(jsonResponse)
        {
            querySuccessFn(jsonResponse.data);
        };

        this.processRequest("getFriendsSessions", request, successCallback,
                            errorCallbackFn);
    };

    destroy()
    {
        var sessionList = this.sessionList;
        var sessionListLength = sessionList.length;
        var i;
        for (i = 0; i < sessionListLength; i += 1)
        {
            sessionList[i].destroy();
        }

        delete this.sessionList;
    };

    // Helper Functions
    processRequest(source,
                                                                       request,
                                                                       successFn,
                                                                       errorFn)
    {
        if (!errorFn)
        {
            errorFn = TurbulenzServices.defaultErrorCallback;
        }

        if (TurbulenzServices.available())
        {
            request.callback = function requestCallbackFn(jsonResponse,
                                                          status)
            {
                if (status === 200)
                {
                    successFn(jsonResponse);
                }
                else if (errorFn)
                {
                    errorFn("MultiPlayerSessionManager." + source + " error with HTTP status " + status + ": " +
                                jsonResponse.msg, status);
                }
            };

            TurbulenzServices.getService('multiplayer').request(request);
        }
        else
        {
            if (errorFn)
            {
                errorFn(source + " failed: Service not available", 0);
            }
        }
    };

   static create(requestHandler: RequestHandler,
                  gameSession: GameSession): MultiPlayerSessionManager
    {
        var manager = new MultiPlayerSessionManager();
        manager.requestHandler = requestHandler;
        manager.gameSession = gameSession;
        manager.sessionList = [];
        return manager;
    };
};