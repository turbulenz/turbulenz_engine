// Copyright (c) 2011-2013 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global Game: false*/
/*global TurbulenzServices: false*/
/*global RequestHandler: false*/
/*global TextureManager: false*/
/*global ShaderManager: false*/
/*global EffectManager: false*/
/*global FontManager: false*/
/*global GameBadges: false*/
/*global GameLeaderboards: false*/
/*global AppScene: false*/
/*global HtmlWriter: false*/
/*global window: false*/

interface Technique2DParameters extends TechniqueParameters
{
    clipSpace: any; // v4
};

//
// Application: The global for the whole application (singleton)
//
class Application
{
    // Ensures shutdown function is only called once
    hasShutDown               : boolean;
    runInEngine               : boolean; // TODO: seems not to be used

    previousGameUpdateTime    : number;
    gameSession               : GameSession;
    userProfile               : UserProfile;
    multiplayerSession        : MultiPlayerSession;
    leaderboardManager        : LeaderboardManager;
    badgeManager              : BadgeManager;
    multiplayerSessionManager : MultiPlayerSessionManager;
    leaderboards              : GameLeaderboards;
    badges                    : GameBadges;
    htmlWriter                : HtmlWriter;
    appScene                  : AppScene;
    game                      : Game;
    devices                   : any;
    managers                  : any;
    others                    : any;
    isHost                    : boolean;
    connectionTime            : number;
    previousHeartbeatTime     : number;
    lastSentMessageTime       : number;
    frameCounter              : number;
    hostFrameCounter          : number;
    needToRender              : boolean;
    requestHandler            : RequestHandler;
    intervalID                : number;
    mappingTable              : any;

    // UI
    font                      : Font;
    technique2D               : Technique;
    technique2Dparameters     : Technique2DParameters;

    hasShutdown               : boolean;

    gameSettings = {
        width : 30,  // Must be a multiple of 2
        height : 16, // Must be a multiple of 2
        boardSpacing : 1.1,
        maxPlayers : 3
    };

    gameTimeStep = 0.05;

    networkIds = {
        joining : 0,
        update : 1,
        leaving : 2,
        ping : 3,
        pong : 4
    };

    heartbeatTime = 0.5; // Should be lower than staleTime

    staleTime = 1.5;

    sceneSetup = false;

    // Error callback - uses window alert
    errorCallback(msg)
    {
        window.alert(msg);
    }

    // Initialise the application
    init()
    {
        // Test for minimum engine version, device creation, and shader support
        if (!this.createDevices() ||
            !this.hasShaderSupport())
        {
            return;
        }

        var creationFunctions =
        [
            {func : this.createUserProfile, isDependent : false},
            {func : this.createGameSession, isDependent : false},
            {func : this.createMappingTable, isDependent : true},
            {func : this.createLeaderboardManager, isDependent : true},
            {func : this.createBadgeManager, isDependent : false, noCallback : true},
            {func : this.createMultiplayerSessionManager, isDependent : false, noCallback : true},
            {func : this.createGameLeaderboards, isDependent : true},
            {func : this.createGameBadges, isDependent : false},
            {func : this.createGame, isDependent : true, noCallback : true},
            {func : this.createHTMLWriter, isDependent : true, noCallback : true},
            {func : this.enterLoadingLoop, isDependent : true}
        ];
        this.enterCallbackChain(this, creationFunctions);
    }

    // Update function called in main loop
    update(currentTime)
    {
        var devices = this.devices;

        devices.inputDevice.update();

        devices.networkDevice.update();

        var gameStep = false, heartbeat = false;

        if ((currentTime - this.previousGameUpdateTime) > this.gameTimeStep)
        {
            this.previousGameUpdateTime = currentTime;

            gameStep = true;
        }

        if ((currentTime - this.previousHeartbeatTime) > this.heartbeatTime)
        {
            this.previousHeartbeatTime = currentTime;

            this.checkOthers();

            heartbeat = true;
        }

        if (this.updateGame(gameStep, heartbeat))
        {
            this.appScene.update();

            this.leaderboards.update(currentTime);

            this.badges.update(currentTime);

            this.htmlWriter.update();

            return true;
        }

        return false;
    }

    // Update game state
    updateGame(gameStep, heartbeat)
    {
        var isHost = this.isHost;
        var game = this.game;
        var gameSession = this.gameSession;
        var sortedWorms, worm, playerId, index;
        var ranks = ["1st", "2nd", "3rd"];
        var theOthers = this.others;
        var myID = this.userProfile.username;

        game.update(isHost, gameStep);

        var multiplayerSession = this.multiplayerSession;
        if (multiplayerSession &&
            game.myWormIndex >= 0)
        {
            var updateData = {
                frame : undefined,
                host  : undefined,
                others: undefined
            };

            var sendUpdate = ((TurbulenzEngine.time - this.lastSentMessageTime) > this.heartbeatTime);

            if (this.hasOthers())
            {
                var needToSend = game.serializeDelta(isHost, updateData);
                if (needToSend)
                {
                    sendUpdate = true;
                }
            }

            if (sendUpdate)
            {
                updateData.frame = this.frameCounter;

                if (isHost)
                {
                    updateData.host = true;
                }

                var others = {};
                others[multiplayerSession.playerId] = game.myWormIndex;
                updateData.others = others;

                multiplayerSession.sendToAll(this.networkIds.update, JSON.stringify(updateData));

                /*
                if (heartbeat)
                {
                    var pingData = {
                        ping : Math.floor(TurbulenzEngine.time * 1000)
                    };
                    multiplayerSession.sendToAll(this.networkIds.ping, JSON.stringify(pingData));
                }
                */

                this.lastSentMessageTime = TurbulenzEngine.time;
            }

            sortedWorms = game.worms.slice(0).sort(
                function (wormA, wormB)
                {
                    return wormB.playerInfo.score - wormA.playerInfo.score;
                }
            );

            for (index = 0 ; index < sortedWorms.length; index += 1)
            {
                sortedWorms[index].playerInfo.rank = ranks[index] || index + 1 + "th";
                sortedWorms[index].playerInfo.sortkey = index;
            }

            myID = multiplayerSession.playerId;
            for (playerId in theOthers)
            {
                if (theOthers.hasOwnProperty(playerId))
                {
                    worm = game.worms[theOthers[playerId].wormIndex];
                    gameSession.setPlayerInfo(playerId, worm.playerInfo);
                }
            }
        }

        // Set session status for main player
        if (game.myWormIndex >= 0)
        {
            worm = game.worms[game.myWormIndex];
            gameSession.setPlayerInfo(myID, worm.playerInfo);
        }

        if (gameStep)
        {
            this.frameCounter += 1;
            this.needToRender = true;
        }

        return this.needToRender;
    }

    // Render function called in main loop
    render(currentTime)
    {
        var appScene = this.appScene;
        var renderer = appScene.renderer;
        var graphicsDevice = this.devices.graphicsDevice;

        renderer.update(graphicsDevice, appScene.camera, appScene.scene, currentTime);

        // Start rendering a frame
        if (graphicsDevice.beginFrame())
        {
            renderer.draw(graphicsDevice, appScene.clearColor);

            this.drawUI();

            graphicsDevice.endFrame();
        }

        this.needToRender = false;
    }

    // Load UI
    loadUI()
    {
        var managers = this.managers;
        managers.fontManager.load('fonts/hero.fnt');
        managers.shaderManager.load('shaders/font.cgfx');
    }

    hasUILoaded()
    {
        var managers = this.managers;
        var fontManager = managers.fontManager;
        var shaderManager = managers.shaderManager;
        if (fontManager.getNumPendingFonts() === 0 &&
            shaderManager.getNumPendingShaders() === 0)
        {
            if (!this.technique2D)
            {
                var devices = this.devices;

                this.font = fontManager.get('fonts/hero.fnt');

                var shader = shaderManager.get('shaders/font.cgfx');
                this.technique2D = shader.getTechnique('font');
                this.technique2Dparameters = devices.graphicsDevice.createTechniqueParameters({
                    clipSpace: devices.mathDevice.v4BuildZero(),
                    alphaRef: 0.01,
                    color: devices.mathDevice.v4BuildOne()
                });
            }

            return true;
        }

        return false;
    }

    // Draw UI
    drawUI()
    {
        var msg = '';
        var words = [];
        var word;
        var linecount;

        var game = this.game;
        var devices = this.devices;
        var graphicsDevice = devices.graphicsDevice;
        var mathDevice = devices.mathDevice;

        var width = graphicsDevice.width;
        var height = graphicsDevice.height;

        var font = this.font;
        var technique2Dparameters = this.technique2Dparameters;

        graphicsDevice.setTechnique(this.technique2D);

        technique2Dparameters.clipSpace = mathDevice.v4Build(2.0 / width, -2.0 / height, -1.0, 1.0,
                                                                technique2Dparameters.clipSpace);
        graphicsDevice.setTechniqueParameters(technique2Dparameters);

        // Draw score
        font.drawTextRect('Score: ' + game.score, {
                rect : [10, 10, (width * 0.5) - 10, 32],
                scale : 1.0,
                spacing : 0,
                alignment : 0
            });

        font.drawTextRect('Kills: ' + game.kills, {
                rect : [(width * 0.5), 10, (width * 0.5) - 10, 32],
                scale : 1.0,
                spacing : 0,
                alignment : 2
            });

        // Draw error info
        if (game.currentState === game.state.ERROR)
        {
            font.drawTextRect('Failed to join game', {
                rect : [0, 40, (width - 10), 32],
                scale : 1.5,
                spacing : 0,
                alignment : 1
            });
            words = game.join_error.split(' ');
            linecount = 0;
            while (words.length > 0)
            {
                msg = '';
                while (msg.length < 40 && words.length > 0)
                {
                    word = words.shift();
                    msg += word + ' ';
                    // Only dealing with simple case of newline either on its own or at end of word.
                    if (word.indexOf('\n') !== -1)
                    {
                        break;
                    }
                }
                font.drawTextRect(msg, {
                    rect : [0, 104 + (linecount * 33), (width - 10), 32],
                    scale : 1.0,
                    spacing : 0,
                    alignment : 1
                });
                linecount += 1;
            }
            font.drawTextRect('Press SPACE to start new game', {
                rect : [0, 104 + (linecount * 33) + 20, (width - 10), 32],
                scale : 1.0,
                spacing : 0,
                alignment : 1
            });
        }
        // Draw dead info
        else if (game.currentState === game.state.DEAD)
        {
            font.drawTextRect('DEAD', {
                rect : [0, 20, (width - 10), 32],
                scale : 1.5,
                spacing : 0,
                alignment : 1
            });
            font.drawTextRect('Press SPACE to continue', {
                rect : [0, 84, (width - 10), 32],
                scale : 1.0,
                spacing : 0,
                alignment : 1
            });
        }

        // Draw connection and host status flags
        if (!this.multiplayerSession)
        {
            if (game.currentState !== game.state.ERROR)
            {
                font.drawTextRect('No multiplayer servers. Playing solo!', {
                        rect : [0, (height - 32), (width - 10), 32],
                        scale : 0.5,
                        spacing : 0,
                        alignment : 1
                    });
            }
        }
        else
        {
            if (this.isHost)
            {
                graphicsDevice.setScissor((width - 6), 2, 4, 4);
                graphicsDevice.clear([1, 0, 0, 1]);
                graphicsDevice.setScissor(0, 0, width, height);
            }

            if (!this.multiplayerSession.connected())
            {
                font.drawTextRect('Connection lost!', {
                        rect : [0, (height - 32), (width - 10), 32],
                        scale : 0.5,
                        spacing : 0,
                        alignment : 1
                    });
            }
        }
    }

    // Checks for shading language support
    hasShaderSupport()
    {
        var graphicsDevice = this.devices.graphicsDevice;

        if (!graphicsDevice.shadingLanguageVersion)
        {
            this.errorCallback("No shading language support detected.\nPlease check your graphics drivers are up to date.");
            graphicsDevice = null;
            return false;
        }
        return true;
    }

    // Create the device interfaces required
    createDevices()
    {
        var devices = this.devices;
        var managers = this.managers;
        var errorCallback = this.errorCallback;

        var graphicsDeviceParameters = { multisample: 16 };
        var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

        var mathDeviceParameters = {};
        var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

        var inputDeviceParameters = {};
        var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

        var networkDeviceParameters = {};
        var networkDevice = TurbulenzEngine.createNetworkDevice(networkDeviceParameters);

        devices.graphicsDevice = graphicsDevice;
        devices.mathDevice = mathDevice;
        devices.inputDevice = inputDevice;
        devices.networkDevice = networkDevice;

        var requestHandlerParameters = {};
        var requestHandler = RequestHandler.create(requestHandlerParameters);
        this.requestHandler = requestHandler;

        managers.textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
        managers.shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
        managers.effectManager = EffectManager.create()
        managers.fontManager = FontManager.create(graphicsDevice, requestHandler, null, errorCallback);

        return true;
    }

    // Calls functions in order
    enterCallbackChain(context, functions)
    {
        var length = functions.length;
        var localCallback;
        var callNextFunction;

        // Invariant: currentFunction always refers to the last uncalled function
        var currentFunction = 0;

        // Invariant: activeCallbacks refers to the number of functions whose callbacks have not yet been received
        var activeCallbacks = 0;

        callNextFunction = function callNextFunctionFn()
        {

            if (!functions[currentFunction].noCallback)
            {
                activeCallbacks += 1;
            }

            functions[currentFunction].func.call(context, localCallback, arguments);

            currentFunction += 1;
        };

        localCallback = function localCallbackFn()
        {
            activeCallbacks -= 1;

            // If no callbacks are left then call functions consecutively until dependent (or blocker) function is seen
            if (activeCallbacks === 0 &&
                currentFunction < length)
            {
                // No active callbacks so immediately call next function
                callNextFunction();

                // Call functions until we hit a dependent (blocking) function
                while (currentFunction < length &&
                       ((0 === activeCallbacks) || (!functions[currentFunction].isDependent)))
                {
                    callNextFunction();
                }
            }
        };

        // Start the async callback chain
        callNextFunction();
    }

    // Creates the game with the settings provided
    createGame()
    {
        var devices = this.devices;
        var inputDevice = devices.inputDevice;

        this.game = Game.create(this.gameSettings,
                                devices.graphicsDevice,
                                this.gameSession,
                                this.leaderboards,
                                this.badges,
                                inputDevice.keyCodes,
                                inputDevice.mouseCodes);

        this.createInputDeviceCallbacks();
    }

    // Adds onKeyDown functions to inputDevice
    createInputDeviceCallbacks()
    {
        var game = this.game;
        var inputDevice = this.devices.inputDevice;

        // Closure for keyDown callback
        function onKeyDown(keynum)
        {
            game.onKeyDown(keynum);
        }

        function onMouseDown(keynum)
        {
            game.onMouseDown(keynum);
        }

        inputDevice.addEventListener('keydown', onKeyDown);
        inputDevice.addEventListener('mousedown', onMouseDown);
    }

    // Create GameLeaderboards
    createGameLeaderboards(callback)
    {
        this.leaderboards = GameLeaderboards.create(this.leaderboardManager, callback);
    }

    // Create GameBadges
    createGameBadges(callback)
    {
        this.badges = GameBadges.create(this.badgeManager, callback);
    }

    // Create HTML Writer
    createHTMLWriter()
    {
        // Must be created after badges, leaderboards, and game have been initialised
        this.htmlWriter = HtmlWriter.create(this.leaderboards, this.badges, this.game);
    }

    // Create multiplayer session
    startMultiplayerSession()
    {
        var that = this;
        var queue = this.multiplayerSessionManager.getJoinRequestQueue();
        var pendingJoinRequest = queue.shift();

        function localConnectingStateLoop()
        {
            return that.connectingStateLoop();
        }

        function localMainStateLoop()
        {
            return that.mainStateLoop();
        }

        function onMultiplayerMessage(senderID, messageType, messageData)
        {
            that.onMessage(senderID, messageType, messageData);
        }

        function onMultiplayerClose()
        {
            that.errorCallback("Connection lost!");
        }

        // Called when a new multiplayer session is joined
        function startNewGame()
        {
            var game = that.game;
            var myPrevWormIndex = game.myWormIndex;
            game.myWormIndex = -1;
            if (that.sceneSetup && myPrevWormIndex >= 0)
            {
                that.appScene.resetWorm(myPrevWormIndex);
            }
            game.currentState = game.state.PLAY;
            delete game.join_error;
            that.gameSession.clearAllPlayerInfo();
        }

        function multiplayerSessionCreateError()
        {
            startNewGame();

            if (that.multiplayerSession)
            {
                that.multiplayerSession.destroy();
                that.multiplayerSession = null;
            }
            that.isHost = true;
            that.game.badges = that.badges;
            that.game.leaderboards = that.leaderboards;
            that.game.start();

            queue.clear();
            queue.resume();
        }

        function multiplayerSessionSuccess(multiplayerSession, numplayers)
        {
            if (1 === numplayers)
            {
                that.isHost = true;
                that.game.start();
            }

            that.multiplayerSession = multiplayerSession;

            multiplayerSession.onmessage = onMultiplayerMessage;

            multiplayerSession.onclose = onMultiplayerClose;

            multiplayerSession.sendToAll(that.networkIds.joining);

            that.connectionTime = TurbulenzEngine.time;

            queue.clear();
            queue.resume();
        }

        function multiplayerSessionJoinError(errMsg, status)
        {
            // Set up an error to display
            that.game.currentState = that.game.state.ERROR;
            that.game.join_error = 'I\'m sorry, something has gone wrong. Please try again. \n (Technical stuff: ' +
                errMsg + ')';
            if (status === 404)
            {
                that.game.join_error = 'I\'m sorry, that game has ended.';
            }
            if (status === 409 && errMsg.match('private'))
            {
                that.game.join_error = 'I\'m sorry, you can\'t join that game right now. You can only join your ' +
                    'friend\'s games or public games.';
            }
            if (status === 409 && errMsg.match('slot'))
            {
                that.game.join_error = 'I\'m sorry, you can\'t join that game right now as it is full.' +
                     ' Try again later!';
            }

            // Make sure we have a game to display the message over
            if (!that.sceneSetup)
            {
                that.appScene.setupScene();
                that.sceneSetup = true;
            }

            TurbulenzEngine.clearInterval(that.intervalID);
            that.intervalID = TurbulenzEngine.setInterval(localMainStateLoop, (1000 / 10));

            // Allow user to try to join another game if required
            queue.clear();
            queue.resume();

            that.game.join_error_cb = function () {
                delete that.game.join_error_cb;
                queue.pause();
                TurbulenzEngine.clearInterval(that.intervalID);
                that.intervalID = TurbulenzEngine.setInterval(localConnectingStateLoop, (1000 / 10));
                that.game.currentState = that.game.state.PLAY;
                that.multiplayerSessionManager.joinOrCreateSession(that.gameSettings.maxPlayers,
                                                                   multiplayerSessionSuccess,
                                                                   multiplayerSessionCreateError);
            };
        }

        function onJoinEvent(multiplayerSessionId)
        {
            var oldMultiplayerSession = that.multiplayerSession;
            if (!oldMultiplayerSession || oldMultiplayerSession.sessionId !== multiplayerSessionId)
            {
                if (oldMultiplayerSession)
                {
                    oldMultiplayerSession.sendToAll(that.networkIds.leaving);
                    oldMultiplayerSession.destroy();
                    that.multiplayerSession = null;
                    that.others = {};
                }

                TurbulenzEngine.clearInterval(that.intervalID);
                that.intervalID = TurbulenzEngine.setInterval(localConnectingStateLoop, (1000 / 10));

                startNewGame();

                queue.pause();

                that.multiplayerSessionManager.joinSession(multiplayerSessionId,
                                                           multiplayerSessionSuccess,
                                                           multiplayerSessionJoinError);
            }
        }

        queue.onEvent(onJoinEvent, this);

        if (pendingJoinRequest)
        {
            this.multiplayerSessionManager.joinSession(pendingJoinRequest,
                                                       multiplayerSessionSuccess,
                                                       multiplayerSessionJoinError);
        }
        else
        {
            this.multiplayerSessionManager.joinOrCreateSession(this.gameSettings.maxPlayers,
                                                               multiplayerSessionSuccess,
                                                               multiplayerSessionCreateError);
        }
    }

    // Create game session
    createGameSession(callback)
    {
        this.gameSession = TurbulenzServices.createGameSession(this.requestHandler, callback);
        // Setup static teamlist for ordering teams
        this.gameSession.setTeamInfo(['Worms', 'Snakes']);
    }

    // Create a user profile
    createUserProfile(callback)
    {
        this.userProfile = TurbulenzServices.createUserProfile(this.requestHandler, callback);
    }

    // Create mapping table
    createMappingTable(callback)
    {
        this.mappingTable = TurbulenzServices.createMappingTable(this.requestHandler, this.gameSession, callback);
    }

    // Create leaderboard manager
    createLeaderboardManager(callback)
    {
        var that = this;

        function createLeaderboardManagerError()
        {
            that.leaderboardManager = null;
            callback();
        }

        this.leaderboardManager = TurbulenzServices.createLeaderboardManager(this.requestHandler,
                                                                             this.gameSession,
                                                                             callback,
                                                                             createLeaderboardManagerError);
    }

    // Create badge manager
    createBadgeManager()
    {
        // Only create badge manager if leaderboardManager has been initialised successfully
        if (this.leaderboardManager)
        {
            this.badgeManager = TurbulenzServices.createBadgeManager(this.requestHandler, this.gameSession);
        }
    }

    createMultiplayerSessionManager()
    {
        this.multiplayerSessionManager = TurbulenzServices.createMultiplayerSessionManager(this.requestHandler,
            this.gameSession);
    }

    // Starts loading scene and creates an interval to check loading progress
    enterLoadingLoop()
    {
        var that = this;
        var managers = this.managers;
        var mappingTable = this.mappingTable;
        var urlMapping = mappingTable.urlMapping;
        var assetPrefix = mappingTable.assetPrefix;

        managers.textureManager.setPathRemapping(urlMapping, assetPrefix);
        managers.shaderManager.setPathRemapping(urlMapping, assetPrefix);
        managers.fontManager.setPathRemapping(urlMapping, assetPrefix);

        this.appScene = AppScene.create(this.devices, this.managers,
                                        this.requestHandler, this.mappingTable,
                                        this.game);
        this.loadUI();

        // Enter loading state
        function localLoadingStateLoop()
        {
            return that.loadingStateLoop();
        }
        this.intervalID = TurbulenzEngine.setInterval(localLoadingStateLoop, (1000 / 10));
    }

    // Called until assets have been loaded at which point the connecting loop is entered
    loadingStateLoop()
    {
        var that = this;

        function localConnectingStateLoop()
        {
            return that.connectingStateLoop();
        }

        // If everything has finished loading/initialising
        if (this.appScene.hasLoaded() &&
            this.hasUILoaded())
        {
            TurbulenzEngine.clearInterval(this.intervalID);

            this.startMultiplayerSession();

            this.intervalID = TurbulenzEngine.setInterval(localConnectingStateLoop, (1000 / 10));
        }
    }

    // Called until connected to the multiplayer session at which point the main loop is entered
    connectingStateLoop()
    {
        var that = this;

        function localMainStateLoop()
        {
            return that.mainStateLoop();
        }

        this.devices.networkDevice.update();

        // If joined game
        if (this.game.myWormIndex >= 0)
        {
            TurbulenzEngine.clearInterval(this.intervalID);

            if (!this.sceneSetup)
            {
                this.appScene.setupScene();
                this.sceneSetup = true;
            }

            this.intervalID = TurbulenzEngine.setInterval(localMainStateLoop, (1000 / 60));
        }
        else
        {
            // If connected to session
            if (this.multiplayerSession)
            {
                var currentTime = TurbulenzEngine.time;
                var connectionTime = this.connectionTime;
                var staleTime = this.staleTime;
                if ((connectionTime + staleTime) < currentTime)
                {
                    this.isHost = true;
                    this.game.start();
                }
                else if ((connectionTime + (staleTime * 0.5)) < currentTime)
                {
                    // Keep requesting to join to avoid problems when starting in the middle of a host transition
                    this.multiplayerSession.sendToAll(this.networkIds.joining);
                }
            }
        }
    }

    mainStateLoop()
    {
        var currentTime = TurbulenzEngine.time;
        if (this.update(currentTime))
        {
            this.render(currentTime);
        }
    }

    onMessage(senderID, messageType, messageData)
    {
        //Utilities.log(senderID, messageType, messageData);
        var networkIds = this.networkIds;

        switch (messageType)
        {
        case networkIds.joining:
            this.onJoiningMessage(senderID);
            break;

        case networkIds.update:
            this.onUpdateMessage(senderID, messageData);
            break;

        case networkIds.leaving:
            this.onLeavingMessage(senderID);
            break;

        case networkIds.ping:
            this.onPingMessage(senderID, messageData);
            break;

        case networkIds.pong:
            this.onPongMessage(senderID, messageData);
            break;
        }
    }

    onJoiningMessage(senderID)
    {
        var multiplayerSession = this.multiplayerSession;
        var myID = multiplayerSession.playerId;
        var networkIds = this.networkIds;
        var theOthers = this.others;
        var other = theOthers[senderID];
        var game = this.game;
        var updateData, others, n, otherID;
        var wormIndex = game.myWormIndex;

        var time = TurbulenzEngine.time;

        if (other === undefined)
        {
            if (!this.isHost)
            {
                return;
            }

            var maxPlayers = this.gameSettings.maxPlayers;


            var usedWormIndex = {};
            usedWormIndex[wormIndex] = true;

            var existingPlayers = [];

            others = {};
            others[myID] = wormIndex;
            for (otherID in theOthers)
            {
                if (theOthers.hasOwnProperty(otherID))
                {
                    var another = theOthers[otherID];
                    wormIndex = another.wormIndex;
                    usedWormIndex[wormIndex] = true;
                    others[otherID] = wormIndex;

                    if (otherID !== senderID)
                    {
                        existingPlayers.push(otherID);
                    }
                }
            }

            for (n = 0; n < maxPlayers; n += 1)
            {
                if (!usedWormIndex[n])
                {
                    theOthers[senderID] = {
                        wormIndex: n,
                        heartbeat: time
                    };

                    others[senderID] = n;

                    //Utilities.log('New player wormIndex: ' + n);

                    break;
                }
            }

            updateData = {
                frame: this.frameCounter,
                others: others,
                host: true
            };

            // Notify the rest of the players of the new player
            if (0 < existingPlayers.length)
            {
                multiplayerSession.sendToGroup(existingPlayers, networkIds.update, JSON.stringify(updateData));
            }

            // Add current game state
            game.serialize(updateData);

            // Send new player current game state
            multiplayerSession.sendTo(senderID, networkIds.update, JSON.stringify(updateData));

            this.lastSentMessageTime = time;
        }
        else
        {
            // Resend wormindex information, probably just a temporary disconnection
            others = {};
            others[myID] = wormIndex;
            for (otherID in theOthers)
            {
                if (theOthers.hasOwnProperty(otherID))
                {
                    others[otherID] = theOthers[otherID].wormIndex;
                }
            }

            updateData = {
                frame: this.frameCounter,
                others: others,
                host: true
            };

            // Send new player current game state
            multiplayerSession.sendTo(senderID, networkIds.update, JSON.stringify(updateData));
        }
    }

    onUpdateMessage(senderID, messageData)
    {
        var multiplayerSession = this.multiplayerSession;
        var myID = multiplayerSession.playerId;
        var networkIds = this.networkIds;
        var theOthers = this.others;
        var other = theOthers[senderID];
        var game = this.game;
        var updateData, others, otherID, wormIndex;

        var time = TurbulenzEngine.time;

        if (other !== undefined)
        {
            other.heartbeat = time;
        }

        if (messageData)
        {
            updateData = JSON.parse(messageData);
            if (updateData)
            {
                others = updateData.others;
                if (others !== undefined)
                {
                    for (otherID in others)
                    {
                        if (others.hasOwnProperty(otherID))
                        {
                            wormIndex = others[otherID];

                            if (otherID === myID)
                            {
                                if (game.myWormIndex < 0)
                                {
                                    this.frameCounter = updateData.frame;
                                    if (this.sceneSetup)
                                    {
                                        this.appScene.resetWorm(wormIndex);
                                    }
                                }
                                game.myWormIndex = wormIndex;
                                //Utilities.log(myID + ' got worm index ' + wormIndex);
                            }
                            else
                            {
                                if (wormIndex === game.myWormIndex)
                                {
                                    //Utilities.log(myID + ', ' + otherID + ' worm index conflict ' + wormIndex);
                                    if (myID > otherID)
                                    {
                                        //Utilities.log('Resetting worm index');
                                        game.myWormIndex = -1;
                                        multiplayerSession.sendTo(senderID, networkIds.leaving);
                                        multiplayerSession.sendTo(senderID, networkIds.joining);
                                        return;
                                    }
                                }

                                var another = theOthers[otherID];
                                if (another === undefined)
                                {
                                    theOthers[otherID] = another = {};
                                }
                                another.wormIndex = wormIndex;
                                another.heartbeat = time;
                            }
                        }
                    }

                    if (other === undefined)
                    {
                        other = theOthers[senderID];
                    }
                }

                if (updateData.host)
                {
                    // Check for host conflict
                    if (this.isHost)
                    {
                        if ((other !== undefined && other.wormIndex < game.myWormIndex) ||
                            (other === undefined && senderID < myID))
                        {
                            //Utilities.log(myID + ', ' + senderID + ' host index conflict');
                            // This instance should not be the host
                            this.isHost = false;
                            game.myWormIndex = -1;
                            multiplayerSession.sendTo(senderID, networkIds.leaving);
                            multiplayerSession.sendTo(senderID, networkIds.joining);
                        }
                        return;
                    }

                    if (other !== undefined)
                    {
                        other.host = true;
                    }

                    this.hostFrameCounter = updateData.frame;
                }

                if (game.deserialize(this.isHost, updateData))
                {
                    this.needToRender = true;
                }
            }
        }
    }

    onLeavingMessage(senderID)
    {
        var other = this.others[senderID];
        this.gameSession.removePlayerInfo(senderID);
        if (other !== undefined)
        {
            other.heartbeat = 0; // Force client to be stale

            this.previousHeartbeatTime = 0; // Force a checkOthers
        }
    }

    onPingMessage(senderID, messageData)
    {
        var time = TurbulenzEngine.time;

        if (messageData)
        {
            var pingData = JSON.parse(messageData);
            if (pingData)
            {
                pingData.pong = Math.floor(time * 1000);

                this.multiplayerSession.sendTo(senderID, this.networkIds.pong, JSON.stringify(pingData));
            }
        }
    }

    onPongMessage(senderID, messageData)
    {
        var time = TurbulenzEngine.time;

        var other = this.others[senderID];
        if (other !== undefined)
        {
            other.heartbeat = time;

            var pongData = JSON.parse(messageData);
            if (pongData)
            {
                // Update latency by calculating the median of the history
                var latency = (time - (pongData.ping * 0.001));
                var latencyHistory = other.latencyHistory;
                var nextLatencyHistory = other.nextLatencyHistory;
                if (latencyHistory === undefined)
                {
                    other.latencyHistory = latencyHistory = [];
                    other.nextLatencyHistory = nextLatencyHistory = 0;
                }
                /*jshint bitwise: false*/
                var numLatencies = latencyHistory.length;
                if (32 <= numLatencies)
                {
                    other.nextLatencyHistory = ((nextLatencyHistory + 1) & 31);
                    latencyHistory[nextLatencyHistory] = latency;
                }
                else
                {
                    latencyHistory[numLatencies] = latency;
                    numLatencies += 1;
                }
                if (1 < numLatencies)
                {
                    // sort history numerically lower to higher
                    latencyHistory = latencyHistory.slice();
                    latencyHistory.sort(function (a, b) {
                        return (a - b);
                    });

                    var medianIndex = (numLatencies >> 1);
                    if (numLatencies & 1)
                    {
                        latency = latencyHistory[medianIndex];
                    }
                    else
                    {
                        latency = ((latencyHistory[medianIndex - 1] + latencyHistory[medianIndex]) * 0.5);
                    }
                }
                /*jshint bitwise: true*/

                other.latency = latency;
                other.time = ((pongData.pong * 0.001) + (0.5 * latency));
            }
        }
    }

    // Migrate host to player with lower index
    migrateHost()
    {
        var myWormIndex = this.game.myWormIndex;

        var others = this.others;
        for (var otherID in others)
        {
            if (others.hasOwnProperty(otherID))
            {
                var wormIndex = others[otherID].wormIndex;
                if (wormIndex < myWormIndex)
                {
                    return;
                }
            }
        }

        // If we reach this code we should be the host
        this.isHost = true;

        //Utilities.log("You have become the host of the game!");
    }

    // Check state of others
    checkOthers()
    {
        var staleTime = (TurbulenzEngine.time - this.staleTime);
        var others = this.others;
        var needToMigrate = (!this.isHost);
        var staleWorms = [];
        var numStale = 0;
        var other;

        for (var otherID in others)
        {
            if (others.hasOwnProperty(otherID))
            {
                other = others[otherID];
                if (other.heartbeat < staleTime)
                {
                    staleWorms[numStale] = other.wormIndex;
                    numStale += 1;
                    this.gameSession.removePlayerInfo(otherID);
                    delete others[otherID];
                }
                else if (other.host)
                {
                    needToMigrate = false;
                }
            }
        }

        if (needToMigrate)
        {
            this.migrateHost();
        }

        if (0 < numStale)
        {
            if (this.isHost)
            {
                var game = this.game;
                var n = 0;
                do
                {
                    game.placeWorm(staleWorms[n]);
                    n += 1;
                }
                while (n < numStale);
            }
        }
    }

    // is anyone listening?
    hasOthers()
    {
        var others = this.others;
        var otherID;
        for (otherID in others)
        {
            if (others.hasOwnProperty(otherID))
            {
                return true;
            }
        }
        return false;
    }

    // Attempts to free memory - called from onbeforeunload and/or TurbulenzEngine.onUnload
    shutdown()
    {
        if (!this.hasShutdown)
        {
            this.hasShutdown = true;

            TurbulenzEngine.clearInterval(this.intervalID);

            // Leave the multiplayer session
            var multiplayerSession = this.multiplayerSession;
            if (multiplayerSession)
            {
                multiplayerSession.sendToAll(this.networkIds.leaving);
            }
            // Destroy any remaining multiplayer sessions
            this.multiplayerSessionManager.destroy();

            // Tell the Turbulenz Services that the game session is over
            this.gameSession.clearAllPlayerInfo();
            this.gameSession.destroy();

            // Destroy vars in reverse order from creation
            this.technique2Dparameters = null;
            this.technique2D = null;
            this.font = null;
            this.previousHeartbeatTime = null;
            this.others = null;
            this.managers = null;
            this.devices = null;
            this.game = null;
            this.appScene = null;
            this.htmlWriter = null;
            this.multiplayerSession = null;
            this.badges = null;
            this.leaderboards = null;
            this.badgeManager = null;
            this.multiplayerSessionManager = null;
            this.leaderboardManager = null;
            this.gameSession = null;
            this.userProfile = null;
            this.previousGameUpdateTime = null;
            this.runInEngine = null;

            // Attempt to force clearing of the garbage collector
            TurbulenzEngine.flush();

            // Clear native engine references
            this.devices = null;
        }
    }

    // Application constructor function
    static create(runInEngine?: boolean)
    {
        var application = new Application();

        // Ensures shutdown function is only called once
        application.hasShutDown = false;
        application.runInEngine = runInEngine;

        application.previousGameUpdateTime = 0;
        application.gameSession = null;
        application.userProfile = null;
        application.multiplayerSession = null;
        application.leaderboardManager = null;
        application.badgeManager = null;
        application.multiplayerSessionManager = null;
        application.leaderboards = null;
        application.badges = null;
        application.htmlWriter = null;
        application.appScene = null;
        application.game = null;
        application.devices = {};
        application.managers = {};
        application.others = {};
        application.isHost = false;
        application.connectionTime = 0;
        application.previousHeartbeatTime = 0;
        application.lastSentMessageTime = 0;
        application.frameCounter = 0;
        application.hostFrameCounter = 0;
        application.needToRender = true;

        // UI
        application.font = null;
        application.technique2D = null;
        application.technique2Dparameters = null;

        return application;
    }
}
