// Copyright (c) 2011-2012 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global TurbulenzServices: false*/
/*global TurbulenzBridge: false*/
/*global Utilities: false*/

/// <reference path="turbulenzservices.ts" />

//
// API
//

class MultiPlayerSession
{
    static version = 1;

    requestHandler : RequestHandler;
    socket         : WebSocket;
    service        : ServiceRequester;

    sessionId      : string;
    playerId       : string;
    gameSessionId  : string;
    queue          : any[];        // TODO

    onmessage      : { (senderID: string, messageType: number,
                        messageData : string): void; };
    onclose        : { (): void; };

    // Public API
    sendTo(destinationID, messageType, messageData?)
    {
        var packet = (destinationID + ':' + messageType + ':');
        if (messageData)
        {
            packet += messageData;
        }

        var socket = this.socket;
        if (socket)
        {
            socket.send(packet);
        }
        else
        {
            this.queue.push(packet);
        }
    };

    sendToGroup(destinationIDs, messageType, messageData)
    {
        var packet = (destinationIDs.join(',') + ':' + messageType + ':');
        if (messageData)
        {
            packet += messageData;
        }

        var socket = this.socket;
        if (socket)
        {
            socket.send(packet);
        }
        else
        {
            this.queue.push(packet);
        }
    };

    sendToAll(messageType, messageData?)
    {
        var packet = (':' + messageType + ':');
        if (messageData)
        {
            packet += messageData;
        }

        var socket = this.socket;
        if (socket)
        {
            socket.send(packet);
        }
        else
        {
            this.queue.push(packet);
        }
    };

    makePublic(callbackFn)
    {
        var sessionId = this.sessionId;
        this.service.request({
            url: '/api/v1/multiplayer/session/make-public',
            method: 'POST',
            data: {'session': sessionId},
            callback: function ()
            {
                TurbulenzBridge.triggerMultiplayerSessionMakePublic(sessionId);
                if (callbackFn)
                {
                    callbackFn.call(arguments);
                }
            },
            requestHandler: this.requestHandler
        });
    };

    destroy(callbackFn?)
    {
        var sessionId = this.sessionId;
        if (sessionId)
        {
            this.sessionId = null;

            var playerId = this.playerId;
            this.playerId = null;

            var gameSessionId = this.gameSessionId;
            this.gameSessionId = null;

            var socket = this.socket;
            if (socket)
            {
                this.socket = null;

                socket.onopen = null;
                socket.onmessage = null;
                socket.onclose = null;
                socket.onerror = null;

                socket.close();
                socket = null;
            }

            this.queue = null;

            this.onmessage = null;
            this.onclose = null;

            // we can't wait for the callback as the browser doesn't
            // call async callbacks after onbeforeunload has been called
            TurbulenzBridge.triggerLeaveMultiplayerSession(sessionId);

            Utilities.ajax({
                url: '/api/v1/multiplayer/session/leave',
                method: 'POST',
                data: {
                    'session': sessionId,
                    'player': playerId,
                    'gameSessionId': gameSessionId
                },
                callback: callbackFn,
                requestHandler: this.requestHandler
            });
        }
        else
        {
            if (callbackFn)
            {
                TurbulenzEngine.setTimeout(callbackFn, 0);
            }
        }
    };

    connected(): bool
    {
        return (!!this.socket);
    };

    // Private API
    private flushQueue()
    {
        var socket = this.socket;
        var queue = this.queue;
        var numPackets = queue.length;
        for (var n = 0; n < numPackets; n += 1)
        {
            socket.send(queue[n]);
        }
    };
    //
    // Constructor
    //
    static create(sessionData, createdCB, errorCB): MultiPlayerSession
    {
        var ms = new MultiPlayerSession();
        ms.sessionId = sessionData.sessionid;
        ms.playerId = sessionData.playerid;
        ms.gameSessionId = sessionData.gameSessionId;
        ms.socket = null;
        ms.queue = [];
        ms.onmessage = null;
        ms.onclose = null;
        ms.requestHandler = sessionData.requestHandler;
        ms.service = TurbulenzServices.getService('multiplayer');

        var numplayers = sessionData.numplayers;

        var serverURL = sessionData.server;

        var socket;

        sessionData = null;

        var multiPlayerOnMessage = function multiPlayerOnMessageFn(packet)
        {
            var onmessage = ms.onmessage;
            if (onmessage)
            {
                var message = packet.data;
                var firstSplitIndex = message.indexOf(':');
                var secondSplitIndex = message.indexOf(':', (firstSplitIndex + 1));
                var senderID = message.slice(0, firstSplitIndex);
                /*jshint bitwise:false*/
                // The |0 ensures 'messageType' is an integer
                var messageType = (message.slice((firstSplitIndex + 1), secondSplitIndex) | 0);
                /*jshint bitwise:true*/
                var messageData = message.slice(secondSplitIndex + 1);

                onmessage(senderID, messageType, messageData);
            }
        };

        var multiPlayerConnect = function multiPlayerConnectFn()
        {
            var multiPlayerConnectionError =
                function multiPlayerConnectionErrorFn()
            {
                if (!socket)
                {
                    socket = ms.socket;
                }

                ms.socket = null;

                if (socket)
                {
                    socket.onopen = null;
                    socket.onmessage = null;
                    socket.onclose = null;
                    socket.onerror = null;
                    socket = null;
                }

                // current server URL does not respond, ask for a new one
                var requestCallback = function requestCallbackFn(jsonResponse, status)
                {
                    if (status === 200)
                    {
                        var reconnectData = jsonResponse.data;
                        numplayers = reconnectData.numplayers;
                        serverURL = reconnectData.server;
                        ms.sessionId = reconnectData.sessionid;
                        ms.playerId = reconnectData.playerid;

                        TurbulenzEngine.setTimeout(multiPlayerConnect, 0);
                    }
                    else
                    {
                        if (errorCB)
                        {
                            errorCB("MultiPlayerSession failed: Server not available", 0);
                            errorCB = null;
                            createdCB = null;
                        }
                        else
                        {
                            var onclose = ms.onclose;
                            if (onclose)
                            {
                                ms.onclose = null;
                                onclose();
                            }
                        }
                    }
                };

                ms.service.request({
                    url: '/api/v1/multiplayer/session/join',
                    method: 'POST',
                    data: {'session': ms.sessionId,
                           'gameSessionId': ms.gameSessionId},
                    callback: requestCallback,
                    requestHandler: ms.requestHandler
                });
            };

            try
            {
                var nd = TurbulenzEngine.getNetworkDevice();
                if (!nd)
                {
                    nd = TurbulenzEngine.createNetworkDevice({});
                }

                socket = nd.createWebSocket(serverURL);

                socket.onopen = function multiPlayerOnOpen()
                {
                    ms.socket = socket;

                    socket.onopen = null;

                    socket.onmessage = multiPlayerOnMessage;

                    socket = null;

                    ms.flushQueue();

                    TurbulenzBridge.triggerJoinedMultiplayerSession({
                        sessionId: ms.sessionId,
                        playerId: ms.playerId,
                        serverURL: serverURL,
                        numplayers: numplayers
                    });

                    if (createdCB)
                    {
                        createdCB(ms, numplayers);
                        createdCB = null;
                        errorCB = null;
                    }
                };

                socket.onclose = socket.onerror = multiPlayerConnectionError;
            }
            catch (exc)
            {
                multiPlayerConnectionError();
            }
        };

        multiPlayerConnect();

        return ms;
    };
};
