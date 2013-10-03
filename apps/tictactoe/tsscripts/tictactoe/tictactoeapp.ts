// Copyright (c) 2013 Turbulenz Limited

class Application
{
    inputDevice: InputDevice;
    mathDevice: MathDevice;
    graphicsDevice: GraphicsDevice;
    requestHandler: RequestHandler;

    fontManager: FontManager;
    shaderManager: ShaderManager;

    draw2D: Draw2D;

    gameSession: GameSession;
    dataShareManager: DataShareManager;
    notificationsManager: NotificationsManager;
    userProfile: UserProfile;

    setButtons: boolean;
    invalidateButtons: boolean;
    intervalID: number;
    hasShutdown: boolean;
    hasGameSessionClosed: boolean;

    currentDataShare: DataShare;
    joinedDataShares: DataShare[];
    foundDataShares: DataShare[];

    joinedGames:
    {
        [id: string]: TicTacToeGame;
    };
    currentGame: TicTacToeGame;
    spriteTextureNames: string[];
    numTextures: number;
    loadedResources: number;

    textures:
    {
        [id: string]: Texture;
    };
    pieceTextures:
    {
        X: Texture;
        O: Texture;
    };

    boardSprite: Draw2DSprite;
    pieceSprites:
    {
        X: Draw2DSprite[]; // an array of cross texture sprites one for each grid square
        O: Draw2DSprite[]; // an array of nought texture sprites one for each grid square
    };

    oldWidth: number;
    oldHeight: number;

    font: Font;
    fontShader: Shader;
    fontTechnique: Technique;
    fontTechniqueParameters: any; //TechniqueParameters;

    maxPlayers = 2;
    stageWidth = 40;
    stageHeight = 30;

    clearColor: any; // v4
    fontColor: any; // v4
    fontBoldColor: any; // v4

    textScale = 1;
    hoverTextScale = 1.1;
    textSpacingY = 2;

    boardOffsetX = 1;
    boardOffsetY = 3;
    boardSizeX = 10;
    boardSizeY = 10;

    init()
    {
        var that = this;
        var requestHandler = this.requestHandler;

        function mappingTableReceived(mappingTable)
        {
            var urlMapping = mappingTable.urlMapping;
            var assetPrefix = mappingTable.assetPrefix;

            that.fontManager.setPathRemapping(urlMapping, assetPrefix);
            that.fontManager.load('fonts/hero.fnt', function (fontObject)
                {
                    that.font = fontObject;
                });

            that.shaderManager.setPathRemapping(urlMapping, assetPrefix);
            that.shaderManager.load('shaders/font.cgfx', function (shaderObject)
                {
                    that.fontShader = shaderObject;
                });

            function textureParams(src)
            {
                return {
                    src : mappingTable.getURL(src),
                    mipmaps : true,
                    onload : function (texture)
                    {
                        if (texture)
                        {
                            that.textures[src] = texture;
                            that.loadedResources += 1;
                        }
                    }
                };
            }

            var spriteTextureNames = that.spriteTextureNames;
            var spriteTextureNamesLength = spriteTextureNames.length;
            var i;
            for (i = 0; i < spriteTextureNamesLength; i += 1)
            {
                that.graphicsDevice.createTexture(textureParams(spriteTextureNames[i]));
            }
        }

        function sessionCreated(gameSession)
        {
            TurbulenzServices.createMappingTable(
                requestHandler,
                gameSession,
                mappingTableReceived
            );

            that.dataShareManager = DataShareManager.create(requestHandler, gameSession);
            that.notificationsManager = NotificationsManager.create(requestHandler, gameSession);

            function profileRecievedFn(currentUser: UserProfile)
            {
                that.userProfile = currentUser;
                that.findDataShares();
            }
            TurbulenzServices.createUserProfile(requestHandler, profileRecievedFn);
        }

        TurbulenzServices.onGameSessionClosed = () =>
        {
            this.hasGameSessionClosed = true;
        };

        var gameSessionOptions = {
            closeExistingSessions: true
        };
        this.gameSession = TurbulenzServices.createGameSession(requestHandler,
                sessionCreated,
                null,
                gameSessionOptions);

        this.intervalID = TurbulenzEngine.setInterval(this.loadingUpdate.bind(this), 100);
    }

    createGame()
    {
        var dataShareCreated = (createdDataShare: DataShare) =>
        {
            this.currentDataShare = createdDataShare;

            var username = this.userProfile.username;
            var currentGame = this.currentGame = TicTacToeGame.create(username, username);
            this.joinedGames[createdDataShare.id] = currentGame;

            this.invalidateButtons = true;
        };
        this.dataShareManager.createDataShare(dataShareCreated);
    }

    findDataShares()
    {
        // We do 2 find requests:
        // - Find all the data shares that the current user is joined to. These games are the games that the current
        //   user is playing (they are still in progress).
        // - Find with no filters to find the first 64 games that can be joined (if the player wants to join some other
        //   users game). When processing this list of joinable games we remove any games which the current user has
        //   already joined.

        this.foundDataShares = null;
        this.joinedDataShares = null;
        this.invalidateButtons = true;

        var joinedDataSharesCallback = (dataShares: DataShare[]) =>
        {
            var joinedDataShares = this.joinedDataShares = dataShares;
            var dataSharesLength = dataShares.length;
            var dataSharesIndex;
            var getJoinedGameStateFn = (dataShare: DataShare) =>
            {
                return (gameStateStore: DataShareGetCBData) =>
                {
                    var ticTacToeGame = TicTacToeGame.create(this.userProfile.username, dataShare.owner);
                    var currentUsername = this.userProfile.username;
                    var users = dataShare.users;
                    var usersLength = users.length;
                    var usersIndex;

                    // only list the first 2 players as joined (possible race condition in joining)
                    for (usersIndex = 0; usersIndex < usersLength; usersIndex += 1)
                    {
                        if (usersIndex < this.maxPlayers)
                        {
                            ticTacToeGame.playerJoined(users[usersIndex]);
                        }
                        else
                        {
                            // if the current player has managed to join a full game then leave it
                            if (currentUsername === users[usersIndex])
                            {
                                dataShare.leave();
                                return;
                            }
                        }
                    }

                    this.joinedGames[dataShare.id] = ticTacToeGame;

                    // don't allow any more players to join full games
                    if (dataShare.joinable && users.length >= this.maxPlayers)
                    {
                        dataShare.setJoinable(false);
                    }

                    if (gameStateStore)
                    {
                        ticTacToeGame.update(gameStateStore.value);
                    }
                    this.invalidateButtons = true;
                };
            }
            for (dataSharesIndex = 0; dataSharesIndex < dataSharesLength; dataSharesIndex += 1)
            {
                var dataShare = dataShares[dataSharesIndex];
                dataShare.get('game-state', getJoinedGameStateFn(dataShare));
            }
        }
        this.dataShareManager.findDataShares({
                user: this.userProfile.username, // find all games that the current user is joined to
                callback: joinedDataSharesCallback
            });

        var foundDataSharesCallback = (dataShares: DataShare[]) =>
        {
            var foundDataShares = this.foundDataShares = [];
            var dataSharesLength = dataShares.length;
            var dataSharesIndex;
            var currentUsername = this.userProfile.username;

            for (dataSharesIndex = 0; dataSharesIndex < dataSharesLength; dataSharesIndex += 1)
            {
                var dataShare = dataShares[dataSharesIndex];
                if (!dataShare.isJoined(currentUsername))
                {
                    foundDataShares.push(dataShare);
                }
            }
            this.invalidateButtons = true;
        }
        // find any joinable datashares
        this.dataShareManager.findDataShares({callback: foundDataSharesCallback});
    }

    playerJoined(notification)
    {
        if (this.currentGame && this.currentDataShare.id === notification.msg.data.dataShareId)
        {
            this.currentGame.playerJoined(notification.sender);
            // since only 1 notification can be sent at a time read the datashare to check if the other player
            // has moved
            this.readMoves();
        }
    }

    yourTurn(notification)
    {
        if (this.currentGame && this.currentDataShare.id === notification.msg.data.dataShareId)
        {
            this.readMoves();
        }
    }

    leaveGame()
    {
        var dataShareLeft = () =>
        {
            delete this.joinedGames[this.currentDataShare.id];
            this.currentGame = null;

            this.currentDataShare = null;

            this.invalidateButtons = true;
            this.findDataShares();
        }
        this.currentDataShare.leave(dataShareLeft);
    }

    toLobby()
    {
        this.currentDataShare = null;
        this.currentGame = null;
        this.findDataShares();
    }

    forfeitGame()
    {
        var currentGame = this.currentGame;
        var gameStateSet = (wasSet: boolean, reason?: string) =>
        {
            if (wasSet)
            {
                currentGame.update();

                var otherUser = currentGame.otherUser;
                if (otherUser)
                {
                    this.notificationsManager.sendInstantNotification({
                        key: 'forfeit',
                        msg: {
                            data: {
                                dataShareId: this.currentDataShare.id,
                            },
                            text: this.userProfile.username + ' forfeit the game'
                        },
                        recipient: otherUser
                    });
                }
                this.invalidateButtons = true;
            }
            else
            {
                if (reason === DataShare.notSetReason.changed)
                {
                    // other player has moved so read the change and then try to forfeit again
                    this.readMoves(this.forfeitGame.bind(this));
                }
                else
                {
                    // the key must be readOnly so just leave the game
                    this.leaveGame();
                }
            }
        }

        // check the round has not already ended (possible after recursion)
        if (!currentGame.roundEnd)
        {
            currentGame.forfeit();
            // do a compare and set in case the other player has taken the first move
            this.currentDataShare.compareAndSet({
                    key: 'game-state',
                    value: currentGame.serialize(),
                    callback: gameStateSet
                });
        }
    }

    getPlayGameFn(dataShare: DataShare): { (): void; }
    {
        return () =>
        {
            this.currentDataShare = dataShare;
            this.currentGame = this.joinedGames[dataShare.id];
            this.readMoves();
        }
    }

    readMoves(callback?: { (): void; }): void
    {
        var getMovesCallback = (gameStateStore: DataShareGetCBData) =>
        {
            if (gameStateStore)
            {
                var serializedGameState = gameStateStore.value;
                this.currentGame.update(serializedGameState);
            }

            this.invalidateButtons = true;
            if (callback)
            {
                callback();
            }
        }
        this.currentDataShare.get('game-state', getMovesCallback);
    }

    getJoinGameFn(dataShare: DataShare): { (): void; }
    {
        return () =>
        {
            var joinedDataShare = (success: boolean) =>
            {
                if (success)
                {
                    var currentDataShare = this.currentDataShare = dataShare;
                    if (currentDataShare.users.length > 2)
                    {
                        // only 2 players should join a game
                        // this possible if 2 people click to join a game at the same time

                        // only the 3rd player will see 3 users (since users is only updated when join is called)
                        // so the 3rd player should leave
                        currentDataShare.setJoinable(false);
                        this.leaveGame();
                        return;
                    }
                    var setJoinableCallback = () =>
                    {
                        var currentUser = this.userProfile.username
                        this.currentGame = TicTacToeGame.create(currentUser, dataShare.owner);
                        this.joinedGames[dataShare.id] = this.currentGame;
                        this.readMoves();

                        var otherUser = this.currentGame.otherUser;
                        if (otherUser)
                        {
                            this.notificationsManager.sendInstantNotification({
                                key: 'player-joined',
                                msg: {
                                    data: {
                                        dataShareId: currentDataShare.id
                                    },
                                    text: currentUser + ' has joined your game'
                                },
                                recipient: otherUser
                            });
                        }
                    }
                    currentDataShare.setJoinable(false, setJoinableCallback);
                }
                else
                {
                    this.findDataShares();
                }
            }
            dataShare.join(joinedDataShare);
        }
    }

    getOnClickFn(x: number, y: number): { (): void; }
    {
        return () =>
        {
            var currentGame = this.currentGame;
            var gameStateSet = (wasSet: boolean, reason?: string) =>
            {
                if (wasSet)
                {
                    currentGame.update();
                    var otherUser = currentGame.otherUser;
                    if (otherUser)
                    {
                        this.notificationsManager.sendInstantNotification({
                            key: 'your-turn',
                            msg: {
                                data: {
                                    dataShareId: this.currentDataShare.id
                                },
                                text: 'It\'s your turn'
                            },
                            recipient: otherUser
                        });
                    }
                    if (currentGame.roundEnd)
                    {
                        this.invalidateButtons = true;
                    }
                }
                else
                {
                    if (reason === DataShare.notSetReason.changed)
                    {
                        // other player has taken the first move or forfeit so get the moves again and ignore the click
                        this.readMoves();
                    }
                    else
                    {
                        // the key must be readOnly so just leave the game
                        this.leaveGame();
                    }
                }
            }

            if (currentGame.currentPlayerTurn)
            {
                if (currentGame.canMove(x, y))
                {
                    currentGame.doMove(x, y);
                    // compare and set can fail if the other player has taken the first move or has forfeit (which they
                    // can do even when it's not their turn)
                    this.currentDataShare.compareAndSet({
                            key: 'game-state',
                            value: currentGame.serialize(),
                            callback: gameStateSet
                        });
                }
            }
            else
            {
                // for testing on local and hub where instant notifications are slow the user can click to see if there
                // are any updates
                this.readMoves();
            }
        }
    }

    segmentFont(x: number, y: number, text: string, clickCallback?, id?: string)
    {
        // render some simple GUI text (can be clicked if clickCallback and id are given)
        // this cannot be called inside of the draw2d.begin and draw2d.end calls

        var graphicsDevice = this.graphicsDevice;
        var fontTechniqueParameters = this.fontTechniqueParameters;
        var font = this.font;

        var topLeft = this.draw2D.viewportUnmap(x, y);
        if (clickCallback)
        {
            fontTechniqueParameters.color = this.fontBoldColor;
        }
        else
        {
            fontTechniqueParameters.color = this.fontColor;
        }

        if (this.setButtons && clickCallback)
        {
            var textBlockSize = font.calculateTextDimensions(text, this.hoverTextScale, 0);
            SimpleButtonManager.addButton({
                    id: id,
                    left: topLeft[0],
                    top: topLeft[1],
                    right: topLeft[0] + textBlockSize.width,
                    bottom: topLeft[1] + textBlockSize.height,
                    callback: clickCallback
                });
        }

        var scale = this.textScale;
        if (id)
        {
            var button = SimpleButtonManager.buttons[id];
            if (button && button.hovering)
            {
                scale = this.hoverTextScale;
            }
        }
        graphicsDevice.setTechniqueParameters(fontTechniqueParameters);
        font.drawTextRect(text, {
            rect : [topLeft[0], topLeft[1], 0, 0], // for left-align width and height are ignored
            scale : scale,
            spacing : 0,
            alignment : 0
        });
    }

    renderGame()
    {
        this.graphicsDevice.setTechnique(this.fontTechnique);
        var currentGame = this.currentGame;

        var roundEnd = currentGame.roundEnd;
        if (roundEnd)
        {
            this.segmentFont(0, 0, 'Leave', this.leaveGame.bind(this), 'leave');
        }
        else
        {
            this.segmentFont(0, 0, 'Back to lobby', this.toLobby.bind(this), 'toLobby');
            this.segmentFont(20, 0, 'Forfeit', this.forfeitGame.bind(this), 'forfeitGame');
        }

        var users = currentGame.getUsers();
        var usersLength = users.length;
        var usersIndex;

        var boardOffsetX = this.boardOffsetX;
        var boardOffsetY = this.boardOffsetY;
        var boardSizeX = this.boardSizeX;
        var boardSizeY = this.boardSizeY;
        var textSpacingY = this.textSpacingY;

        var offsetY = boardOffsetY + boardSizeY + textSpacingY * 2;
        for (usersIndex = 0; usersIndex < usersLength; usersIndex += 1)
        {
            this.segmentFont(3, offsetY, users[usersIndex]);
            offsetY += textSpacingY;
        }

        if (roundEnd)
        {
            if (roundEnd.draw)
            {
                this.segmentFont(0, offsetY, 'Draw');
            }
            else if (roundEnd.forfeit)
            {
                this.segmentFont(0, offsetY, roundEnd.forfeit + ' forfeit!');
            }
            else if (roundEnd.winner)
            {
                this.segmentFont(0, offsetY, roundEnd.winner + ' wins!');
            }
        }
        else
        {
            if (currentGame.firstMove === null)
            {
                this.segmentFont(0, offsetY, 'Either player can take the first move');
            }
            else if (currentGame.currentPlayerTurn)
            {
                this.segmentFont(0, offsetY, 'It\'s your turn');
            }
            else
            {
                this.segmentFont(0, offsetY, 'Waiting for other player\'s turn');
            }
        }
        offsetY += textSpacingY;

        var draw2D = this.draw2D;
        if (draw2D.begin(draw2D.blend.alpha))
        {
            draw2D.drawSprite(this.boardSprite);
            var pieceSprites = this.pieceSprites;

            var x, y;
            for (x = 0; x < 3; x += 1)
            {
                for (y = 0; y < 3; y += 1)
                {
                    var piece = currentGame.boardState[x + y * 3];
                    if (piece)
                    {
                        draw2D.drawSprite(pieceSprites[piece][x + y * 3]);
                    }
                    if (this.setButtons)
                    {
                        var destRectangle = [boardOffsetX + (boardSizeX / 3) * x,
                                             boardOffsetY + (boardSizeY / 3) * y,
                                             boardOffsetX + (boardSizeX / 3) * (x + 1),
                                             boardOffsetY + (boardSizeY / 3) * (y + 1)];
                        var topLeft = draw2D.viewportUnmap(destRectangle[0],
                                                           destRectangle[1]);
                        var bottomRight = draw2D.viewportUnmap(destRectangle[2],
                                                               destRectangle[3]);
                        var onClickFn = this.getOnClickFn(x, y);
                        SimpleButtonManager.addButton({
                                id: 'click-' + x + '-' + y,
                                left: topLeft[0],
                                top: topLeft[1],
                                right: bottomRight[0],
                                bottom: bottomRight[1],
                                callback: onClickFn
                            });
                    }
                }
            }

            offsetY = boardOffsetY + boardSizeY + textSpacingY * 2;
            for (usersIndex = 0; usersIndex < usersLength; usersIndex += 1)
            {
                destRectangle = [0, offsetY,
                                 textSpacingY, offsetY + textSpacingY];
                offsetY += textSpacingY;
                var pieceTexture = this.pieceTextures[currentGame.getPlayerPiece(users[usersIndex])];
                if (pieceTexture)
                {
                    draw2D.draw({
                        texture : pieceTexture,
                        destinationRectangle : destRectangle
                    });
                }
            }

            draw2D.end();
        }
    }

    renderLobby()
    {
        this.graphicsDevice.setTechnique(this.fontTechnique);

        var offsetY = 0;
        var textSpacingY = this.textSpacingY;

        var joinedDataShares = this.joinedDataShares;
        if (joinedDataShares && joinedDataShares.length > 0)
        {
            this.segmentFont(0, 0, 'Playing:');
            offsetY += textSpacingY;

            var joinedDataSharesIndex;
            var joinedDataSharesLength = joinedDataShares.length;
            for (joinedDataSharesIndex = 0; joinedDataSharesIndex < joinedDataSharesLength; joinedDataSharesIndex += 1)
            {
                var dataShare = joinedDataShares[joinedDataSharesIndex];
                var game = this.joinedGames[dataShare.id];
                var playGameFn = this.getPlayGameFn(dataShare);
                if (game && game.roundEnd)
                {
                    this.segmentFont(3, offsetY, 'Game finished (click to see result)', playGameFn,
                        'playGame-' + joinedDataSharesIndex);
                }
                else
                {
                    var users = dataShare.users;
                    if (users.length === 1)
                    {
                        this.segmentFont(3, offsetY, 'Waiting for player', playGameFn,
                            'playGame-' + joinedDataSharesIndex);
                    }
                    else
                    {
                        this.segmentFont(3, offsetY, users[0] + ' vs ' + users[1], playGameFn,
                            'playGame-' + joinedDataSharesIndex);
                    }
                }
                offsetY += textSpacingY;
            }
        }

        var foundDataShares = this.foundDataShares;
        var dataSharesLength = 0;
        var dataSharesIndex;
        if (foundDataShares)
        {
            var noGamesToJoin = true;
            dataSharesLength = foundDataShares.length;
            if (dataSharesLength > 0)
            {
                for (dataSharesIndex = 0; dataSharesIndex < dataSharesLength; dataSharesIndex += 1)
                {
                    var dataShare = foundDataShares[dataSharesIndex];
                    if (dataShare.users.length === 1)
                    {
                        if (noGamesToJoin)
                        {
                            this.segmentFont(0, offsetY, 'Games to join:');
                            offsetY += textSpacingY;
                            noGamesToJoin = false;
                        }
                        var joinGameFn = this.getJoinGameFn(dataShare)
                        this.segmentFont(3, offsetY, dataShare.owner, joinGameFn, 'joinGame-' + dataSharesIndex);
                        offsetY += textSpacingY;
                    }
                }
            }

            if (noGamesToJoin)
            {
                this.segmentFont(0, offsetY, 'No new games to join');
                offsetY += textSpacingY;
            }
        }

        this.segmentFont(0, offsetY, 'Refresh', this.findDataShares.bind(this), 'refresh');
        this.segmentFont(20, offsetY, 'Create new game', this.createGame.bind(this), 'create');
        offsetY += textSpacingY;
    }

    update()
    {
        var graphicsDevice = this.graphicsDevice;
        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        var width = graphicsDevice.width;
        var height = graphicsDevice.height;
        this.setButtons = this.invalidateButtons || this.oldWidth !== width || this.oldHeight !== height;
        if (this.setButtons)
        {
            SimpleButtonManager.clearButtons();
            this.invalidateButtons = false;
            this.fontTechniqueParameters.clipSpace = this.mathDevice.v4Build(2 / width, -2 / height, -1, 1,
                                                                             this.fontTechniqueParameters.clipSpace);
        }
        this.oldWidth = width;
        this.oldHeight = height;

        graphicsDevice.clear(this.clearColor);

        if (this.hasGameSessionClosed)
        {
            this.graphicsDevice.setTechnique(this.fontTechnique);
            this.segmentFont(0, 0, 'Game session closed. Looks like you have started playing somewhere else.');
        }
        else if (this.userProfile.guest)
        {
            this.graphicsDevice.setTechnique(this.fontTechnique);
            this.segmentFont(0, 0, 'Sorry, guests must register before they can play tic-tac-toe.');
        }
        else if (this.currentGame)
        {
            this.renderGame();
        }
        else
        {
            this.renderLobby();
        }

        graphicsDevice.endFrame();
    }

    loadingUpdate()
    {
        var notificationsManager = this.notificationsManager;
        if (this.font &&
            this.fontShader &&
            this.userProfile &&
            this.dataShareManager &&
            notificationsManager && notificationsManager.ready &&
            this.numTextures === this.loadedResources)
        {
            var mathDevice = this.mathDevice;
            var graphicsDevice = this.graphicsDevice;

            this.fontTechnique = this.fontShader.getTechnique('font');
            this.fontTechniqueParameters = graphicsDevice.createTechniqueParameters({
                clipSpace : mathDevice.v4BuildZero(),
                alphaRef : 0.01,
                color : mathDevice.v4BuildOne()
            });

            this.draw2D = Draw2D.create({
                graphicsDevice : graphicsDevice
            });

            this.draw2D.configure({
                viewportRectangle : [0, 0, this.stageWidth, this.stageHeight],
                scaleMode : 'scale'
            });

            var textures = this.textures;
            var pieceTextures = this.pieceTextures;
            var boardOffsetX = this.boardOffsetX;
            var boardOffsetY = this.boardOffsetY;
            var boardSizeX = this.boardSizeX;
            var boardSizeY = this.boardSizeY;

            this.boardSprite = Draw2DSprite.create({
                texture : textures['textures/tictactoeboard.png'],
                x: boardOffsetX,
                y: boardOffsetY,
                width : boardSizeX,
                height: boardSizeY,
                origin: [0, 0]
            });

            pieceTextures.O = textures['textures/nought.png'];
            pieceTextures.X = textures['textures/cross.png'];

            var pieceWidth = boardSizeX / 3;
            var pieceHeight = boardSizeY / 3;
            var pieceSprites = this.pieceSprites;
            var x, y;
            for (x = 0; x < 3; x += 1)
            {
                for (y = 0; y < 3; y += 1)
                {
                    var pieceX = boardOffsetX + pieceWidth * x;
                    var pieceY = boardOffsetY + pieceHeight * y;
                    pieceSprites.O[x + y * 3] = Draw2DSprite.create({
                        texture : pieceTextures.O,
                        x: pieceX,
                        y: pieceY,
                        width : pieceWidth,
                        height: pieceHeight,
                        origin: [0, 0]
                    });
                    pieceSprites.X[x + y * 3] = Draw2DSprite.create({
                        texture : pieceTextures.X,
                        x: pieceX,
                        y: pieceY,
                        width : pieceWidth,
                        height: pieceHeight,
                        origin: [0, 0]
                    });
                }
            }

            notificationsManager.addNotificationListener('player-joined', this.playerJoined.bind(this));
            notificationsManager.addNotificationListener('your-turn', this.yourTurn.bind(this));
            notificationsManager.addNotificationListener('forfeit', this.yourTurn.bind(this));

            TurbulenzEngine.clearInterval(this.intervalID);
            this.intervalID = TurbulenzEngine.setInterval(this.update.bind(this), 1000 / 60);
        }
    }

    // Attempts to free memory - called from onbeforeunload and/or
    // TurbulenzEngine.onUnload
    shutdown()
    {
        if (!this.hasShutdown)
        {
            this.hasShutdown = true;

            if (this.gameSession)
            {
                this.gameSession.destroy();
            }

            TurbulenzEngine.clearInterval(this.intervalID);

            // Attempt to force clearing of the garbage collector
            TurbulenzEngine.flush();

            this.inputDevice     = null;
            this.mathDevice      = null;
            this.graphicsDevice  = null;
        }
    }

    errorCallback(message)
    {
        Utilities.log(message);
    }

    // Application constructor function
    static create()
    {
        var application = new Application();

        var graphicsDevice = application.graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
        var mathDevice = application.mathDevice = TurbulenzEngine.createMathDevice({});
        var inputDevice = application.inputDevice = TurbulenzEngine.createInputDevice({});
        var requestHandler = application.requestHandler = RequestHandler.create({});

        application.hasShutdown = false;
        application.hasGameSessionClosed = false;

        application.fontManager = FontManager.create(graphicsDevice, requestHandler);
        application.shaderManager = ShaderManager.create(graphicsDevice, requestHandler);

        application.dataShareManager = null;
        application.notificationsManager = null;
        application.userProfile = null;

        SimpleButtonManager.init(inputDevice);

        application.currentDataShare = null;
        application.joinedDataShares = null;
        application.foundDataShares = null;

        application.joinedGames = {};
        application.currentGame = null;

        application.draw2D;

        application.clearColor = mathDevice.v4Build(1.0, 1.0, 1.0, 1.0);
        application.fontColor = mathDevice.v4Build(0.5, 0.5, 0.5, 1.0);
        application.fontBoldColor = mathDevice.v4Build(0.3, 0.3, 0.3, 1.0);

        application.fontTechnique;
        application.fontTechniqueParameters;

        // Textures to load:
        var spriteTextureNames = application.spriteTextureNames = [
            'textures/tictactoeboard.png',
            'textures/nought.png',
            'textures/cross.png'
        ];

        // List to store the loaded texture objects.
        application.textures = {};
        application.numTextures = spriteTextureNames.length;
        application.loadedResources = 0;

        application.pieceTextures = {
            'X': null,
            'O': null
        };

        application.pieceSprites = {
            'O': [],
            'X': []
        };
        application.boardSprite;
        application.oldWidth = 0;
        application.oldHeight = 0;

        return application;
    }
}
