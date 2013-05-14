/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
* @title: Leaderboards
* @description:
* An example of how to set and view scores from the leaderboards.
*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/leaderboardmanager.js") }}*/
/*{{ javascript("jslib/services/gameprofilemanager.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/fontmanager.js") }}*/
/*{{ javascript("jslib/assetcache.js") }}*/

/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global GameProfileManager: false */
/*global RequestHandler: false */
/*global Draw2D: false */
/*global FontManager: false */
/*global ShaderManager: false */
/*global HTMLControls: false */
/*global AssetCache: false */

TurbulenzEngine.onload = function onloadFn()
{
    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var inputDevice = TurbulenzEngine.createInputDevice({});
    var requestHandler = RequestHandler.create({});

    var fontManager = FontManager.create(graphicsDevice, requestHandler);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler);

    var font, fontShader;
    // Not Power Of 2 shader (needed for rendering user avatars)
    var npot2DShader;
    var upTexture, downTexture;
    var leaderboardManager;
    var gameProfileManager;
    var userProfile;
    var gameSession;

    var assetsToLoad = 5;
    function mappingTableReceived(mappingTable)
    {
        var urlMapping = mappingTable.urlMapping;
        var assetPrefix = mappingTable.assetPrefix;

        fontManager.setPathRemapping(urlMapping, assetPrefix);
        fontManager.load('fonts/hero.fnt', function (fontObject)
            {
                font = fontObject;
                assetsToLoad -= 1;
            });

        shaderManager.setPathRemapping(urlMapping, assetPrefix);
        shaderManager.load('shaders/font.cgfx', function (shaderObject)
            {
                fontShader = shaderObject;
                assetsToLoad -= 1;
            });
        shaderManager.load('shaders/npot2D.cgfx', function (shaderObject)
            {
                npot2DShader = shaderObject;
                assetsToLoad -= 1;
            });

        graphicsDevice.createTexture({
                src: mappingTable.getURL('textures/up.png'),
                mipmaps: true,
                onload: function onLoadedTextureFn(texture)
                {
                    upTexture = texture;
                    assetsToLoad -= 1;
                }
            });

        graphicsDevice.createTexture({
                src: mappingTable.getURL('textures/down.png'),
                mipmaps: true,
                onload: function onLoadedTextureFn(texture)
                {
                    downTexture = texture;
                    assetsToLoad -= 1;
                }
            });
    }

    function sessionCreated()
    {
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            mappingTableReceived
        );

        leaderboardManager =
            TurbulenzServices.createLeaderboardManager(requestHandler,
                                                       gameSession);
        gameProfileManager =
            GameProfileManager.create(requestHandler, gameSession);

        userProfile = TurbulenzServices.createUserProfile(requestHandler);
    }

    gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);

    var draw2D;

    var status = [];
    function setStatus(msg)
    {
        status.push(msg);
    }

    function clearStatus(delay?)
    {
        TurbulenzEngine.setTimeout(function () {
                status.shift();
            }, delay || 500);
    }

    var clearColor = mathDevice.v4Build(0.3, 0.3, 0.3, 1.0);

    var fontTechnique, fontTechniqueParameters;
    var npot2DTechniqueParameters;

    var avatarCache = AssetCache.create({
            size: 64,
            onLoad: function loadTextureFn(key, params, loadedCallback)
            {
                graphicsDevice.createTexture({
                        src: key,
                        // since the avatar image might not be a power of 2 we cannot enable mipmaps
                        mipmaps: false,
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
        });

    var titleScale = 1.2;
    var normalScale = 0.75;
    var statusScale = 0.6;
    var currentLeaderboardResult;
    var defaultColor = mathDevice.v4Build(1, 1, 1, 1);
    var playerColor = mathDevice.v4Build(1, 0, 0, 1);
    var gameProfiles = {};
    var xp = 0;
    var rocketsLaunched = 0;

    function mainLoop()
    {
        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        graphicsDevice.clear(clearColor);

        var clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1, clipSpace);
        npot2DTechniqueParameters.clipSpace = clipSpace;
        fontTechniqueParameters.clipSpace = clipSpace;
        fontTechniqueParameters.color = defaultColor;

        var xOffset = 2;
        var yOffset = 0;

        function newColumn()
        {
            xOffset += 10;
            yOffset = 0;
        }

        function writeFont(text, scale, color?)
        {
            if (color === undefined)
            {
                color = defaultColor;
            }
            graphicsDevice.setTechnique(fontTechnique);
            fontTechniqueParameters.color = color;
            graphicsDevice.setTechniqueParameters(fontTechniqueParameters);
            if (text)
            {
                var topLeft = draw2D.viewportUnmap(xOffset, yOffset);
                var bottomRight = draw2D.viewportUnmap(xOffset + 10, yOffset + 1);
                font.drawTextRect(text, {
                    rect : [topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]],
                    scale : scale,
                    spacing : 0,
                    alignment : 0
                });
            }

            yOffset += 2;
        }

        function drawAvatar(url)
        {
            var texture = avatarCache.request(url);
            if (texture)
            {
                draw2D.draw({
                    texture : texture,
                    destinationRectangle : [xOffset, yOffset, xOffset + 1, yOffset + 1]
                });
            }

            yOffset += 2;
        }

        if (currentLeaderboardResult)
        {
            var view = currentLeaderboardResult.getView();
            var getColor = function getColorFn(playerIndex)
            {
                return (playerIndex === view.playerIndex) ? playerColor : defaultColor;
            };
            var ranking = view.ranking;
            var rankingLength = ranking.length;
            var i;

            writeFont("Rank", titleScale);
            for (i = 0; i < rankingLength; i += 1)
            {
                writeFont(ranking[i].rank.toString(), normalScale, getColor(i));
            }

            newColumn();
            writeFont("Avatar", titleScale);
            // we use the NPOT 2D shader as the avatar images might not be a power of 2
            if (draw2D.begin('npot2D'))
            {
                for (i = 0; i < rankingLength; i += 1)
                {
                    drawAvatar(ranking[i].user.avatar);
                }
                draw2D.end();
            }

            newColumn();
            writeFont("User", titleScale);
            for (i = 0; i < rankingLength; i += 1)
            {
                writeFont(ranking[i].user.username, normalScale, getColor(i));
            }

            newColumn();
            writeFont("Score", titleScale);
            for (i = 0; i < rankingLength; i += 1)
            {
                writeFont(ranking[i].score.toString(), normalScale, getColor(i));
            }

            newColumn();
            writeFont("XP", titleScale);
            for (i = 0; i < rankingLength; i += 1)
            {
                if (gameProfiles[ranking[i].user.username])
                {
                    writeFont(gameProfiles[ranking[i].user.username].xp.toString(), normalScale, getColor(i));
                }
                else
                {
                    // skip over users which have unloaded game profiles
                    yOffset += 2;
                }
            }

            if (draw2D.begin('additive'))
            {
                if (!view.top)
                {
                    draw2D.draw({
                        texture : upTexture,
                        destinationRectangle : [0, 2, 1, 3]
                    });
                }
                if (!view.bottom)
                {
                    draw2D.draw({
                        texture : downTexture,
                        destinationRectangle : [0, 28, 1, 29]
                    });
                }
                draw2D.end();
            }

            xOffset = 0;
            if (status.length > 0)
            {
                writeFont('Status: ' + status[0], statusScale);
            }
            else
            {
                writeFont('Status:', statusScale);
            }

            writeFont('Rockets launched: ' + rocketsLaunched.toString(), statusScale);
        }
        graphicsDevice.endFrame();
    }

    var intervalID = 0;
    var leaderboardSize = 14;
    var leaderboardKeys = ['rockets', 'completedTime'];
    var currentLeaderboardIndex = 0;
    var showingNear = false;

    function disableMoving(disable)
    {
        var view = currentLeaderboardResult.getView();
        try
        {
            document.getElementById('button-topscores').disabled  = disable || view.top;
            document.getElementById('button-myscore').disabled    = disable || showingNear;
        }
        catch (e) {}
    }

    function retrieveGameProfiles()
    {
        // request profiles for the entire sliding window (all of the results from the current response)
        // as this is more efficient (only 1 game profile request per leaderboard request)
        var slidingWindow = currentLeaderboardResult.getSlidingWindow();
        var ranking = slidingWindow.ranking;
        var numScores = ranking.length;

        // only get the users which we don't already have
        var users = [];
        var i;
        for (i = 0; i < numScores; i += 1)
        {
            var username = ranking[i].user.username;
            if (!gameProfiles.hasOwnProperty(username))
            {
                users.push(username);
            }
        }

        var onGameProfileList = function onGameProfileListFn(newGameProfiles)
        {
            var u;
            for (u in newGameProfiles)
            {
                if (newGameProfiles.hasOwnProperty(u))
                {
                    gameProfiles[u] = JSON.parse(newGameProfiles[u].value);
                }
            }

            if (userProfile.username && gameProfiles[userProfile.username])
            {
                try
                {
                    (<HTMLInputElement>(document.getElementById('text-xpinput'))).value = gameProfiles[userProfile.username].xp;
                }
                catch (e) {}
            }
        };
        // check that some users are in the list before making a request
        if (users.length > 0)
        {
            gameProfileManager.getList(users, onGameProfileList);
        }
    }

    function gotLeaderboard(key, leaderboardResult)
    {
        currentLeaderboardResult = leaderboardResult;

        // retrieve the game profiles each time the leaderboards sliding window
        // is updated
        retrieveGameProfiles();
        leaderboardResult.onSlidingWindowUpdate = retrieveGameProfiles;

        var slidingWindow = leaderboardResult.getSlidingWindow();
        try
        {
            (<HTMLInputElement>(document.getElementById('text-scoreinput'))).value = slidingWindow.player && slidingWindow.player.score || 0;
        }
        catch (e) {}

        disableMoving(false);
    }

    function leaderboardMoved()
    {
        disableMoving(false);
    }

    function loadingLoop()
    {
        if (assetsToLoad === 0 && leaderboardManager && leaderboardManager.ready)
        {
            fontTechnique = fontShader.getTechnique('font');
            fontTechniqueParameters = graphicsDevice.createTechniqueParameters({
                clipSpace : mathDevice.v4BuildZero(),
                alphaRef : 0.01,
                color : mathDevice.v4BuildOne()
            });

            var npot2DTechnique = npot2DShader.getTechnique('textured2D');
            npot2DTechniqueParameters = graphicsDevice.createTechniqueParameters({
                clipSpace : mathDevice.v4BuildZero(),
                alphaRef : 0.01
            });

            draw2D = Draw2D.create({
                graphicsDevice : graphicsDevice,
                blendModes: {
                    "npot2D": npot2DTechnique
                }
            });

            draw2D.configure({
                viewportRectangle : [0, 0, 52, 35],
                scaleMode : 'scale'
            });

            TurbulenzEngine.clearInterval(intervalID);
            intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);

            leaderboardManager.get(leaderboardKeys[currentLeaderboardIndex], {'type': 'top', 'size': leaderboardSize}, gotLeaderboard);
        }
    }
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 100);

    // Controls
    var htmlControls = HTMLControls.create();

    function changeLeaderboard(index)
    {
        currentLeaderboardIndex = index;
        showingNear = false;
        leaderboardManager.get(leaderboardKeys[index], {'type': 'top', 'size': leaderboardSize}, gotLeaderboard);
        disableMoving(true);

        htmlControls.setSelectedRadio("leaderboardIndex", index);
    }

    function addRadioControl(index)
    {
        htmlControls.addRadioControl({
            id: "radio" + index,
            groupName: "leaderboardIndex",
            radioIndex: index,
            value: leaderboardKeys[index],
            fn: function ()
            {
                changeLeaderboard(index);
            },
            isDefault: index === currentLeaderboardIndex
        });
    }

    addRadioControl(0);
    addRadioControl(1);

    htmlControls.addButtonControl({
        id: "button-setscore",
        value: "Set score",
        fn: function ()
        {
            var elt = <HTMLInputElement>document.getElementById('text-scoreinput');
            var score = parseInt(elt.value, 10);
            if (typeof(score) !== 'number' || isNaN(score))
            {
                setStatus('Score must be a number');
                clearStatus(1000);
                return;
            }
            function scoresSetFn()
            {
                clearStatus();
                try
                {
                    document.getElementById('button-setscore').disabled = false;
                }
                catch (e) {}
                currentLeaderboardResult.refresh(gotLeaderboard);
                disableMoving(true);
            }
            setStatus('Setting score');
            leaderboardManager.set(leaderboardKeys[currentLeaderboardIndex], score, scoresSetFn);
            try
            {
                document.getElementById('button-setscore').disabled = true;
            }
            catch (e) {}
        }
    });

    function setXP(newXp: number, updateFn)
    {
        xp = newXp;
        var gameProfile = {'xp': xp};
        gameProfileManager.set(JSON.stringify(gameProfile), updateFn);
        if (userProfile.username)
        {
            gameProfiles[userProfile.username] = gameProfile;
        }
        try
        {
            (<HTMLInputElement>(document.getElementById('text-xpinput'))).value = xp.toString();
        }
        catch (e) {}
    }

    htmlControls.addButtonControl({
        id: "button-setxp",
        value: "Set XP",
        fn: function ()
        {
            var elt = <HTMLInputElement>(document.getElementById('text-xpinput'));
            setStatus('Setting XP');
            setXP(parseInt(elt.value, 10), clearStatus);
        }
    });

    htmlControls.addButtonControl({
        id: "button-topscores",
        value: "Go",
        fn: function ()
        {
            leaderboardManager.get(leaderboardKeys[currentLeaderboardIndex], {'type': 'top', 'size': leaderboardSize}, gotLeaderboard);
            showingNear = false;
            disableMoving(true);
        }
    });

    htmlControls.addButtonControl({
        id: "button-myscore",
        value: "Go",
        fn: function ()
        {
            leaderboardManager.get(leaderboardKeys[currentLeaderboardIndex], {'type': 'near', 'size': leaderboardSize}, gotLeaderboard);
            showingNear = true;
            disableMoving(true);
        }
    });

    function resetScoreFn()
    {
        setStatus('Resetting leaderboards');
        gameProfileManager.remove();
        if (userProfile.username)
        {
            delete gameProfiles[userProfile.username];
        }
        // ONLY available on Local and the Hub (will fail on the Gamesite)
        leaderboardManager.reset(function leaderboardsResetFn()
            {
                rocketsLaunched = 0;
                setXP(0, null);

                clearStatus();
                currentLeaderboardResult.refresh(gotLeaderboard);
                disableMoving(true);
            });
    }

    htmlControls.addButtonControl({
        id: "button-reset",
        value: "Reset",
        fn: resetScoreFn
    });

    htmlControls.register();

    function moveFn(functionName)
    {
        if (currentLeaderboardResult)
        {
            if (currentLeaderboardResult[functionName](leaderboardMoved))
            {
                showingNear = false;
                disableMoving(true);
            }
        }
    }

    var keyCodes = inputDevice.keyCodes;

    var keyUp = function keyUpFn(key)
    {
        if (key === keyCodes.UP)
        {
            moveFn('pageUp');
        }
        else if (key === keyCodes.DOWN)
        {
            moveFn('pageDown');
        }
        else if (key === keyCodes.LEFT)
        {
            changeLeaderboard(0);
        }
        else if (key === keyCodes.RIGHT)
        {
            changeLeaderboard(1);
        }
        else if (key === keyCodes.R)
        {
            resetScoreFn();
        }
        else if (key === keyCodes.SPACE)
        {
            var leftToSet = 2;
            var setComplete = function completeFn()
            {
                leftToSet -= 1;
                if (leftToSet === 0)
                {
                    clearStatus();
                    currentLeaderboardResult.refresh(gotLeaderboard);
                    disableMoving(true);

                    try
                    {
                        document.getElementById('button-setscore').disabled = false;
                        (<HTMLInputElement>(document.getElementById('text-xpinput'))).value = xp.toString();
                    }
                    catch (e) {}
                }
            };

            rocketsLaunched += 1;

            setStatus('Setting score');
            leaderboardManager.set('rockets', rocketsLaunched, setComplete);

            try
            {
                document.getElementById('button-setscore').disabled = true;
            }
            catch (e) {}

            setXP(xp + 10, setComplete);
        }
    };

    var onMouseWheel = function onMouseWheelFn(delta)
    {
        if (delta > 0)
        {
            moveFn('scrollUp');
        }
        else
        {
            moveFn('scrollDown');
        }
    };

    inputDevice.addEventListener('mousewheel', onMouseWheel);
    inputDevice.addEventListener("keyup", keyUp);

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        if (intervalID)
        {
            TurbulenzEngine.clearInterval(intervalID);
        }

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }
    };
};
