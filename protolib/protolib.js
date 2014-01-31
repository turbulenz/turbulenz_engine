// Copyright (c) 2013 Turbulenz Limited
/*global TurbulenzEngine: false */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global FontManager: false */
/*global EffectManager: false */
/*global SoundManager: false */
/*global SoundSourceManager: false */
/*global ForwardRendering: false */
/*global Camera: false */
/*global Scene: false */
/*global SceneNode: false */
/*global Light: false */
/*global LightInstance: false */
/*global SimpleSprite: false */
/*global SimpleSceneLoader: false */
/*global SimpleFontRenderer: false */
/*global DebugDraw: false */
/*global Draw2D: false */
/*global DynamicUIManager: false*/
/*global VMathArrayConstructor: false*/
/*global debug: false*/
/*global Utilities: false*/
/*global jQuery: false*/
/*global jQueryExtend: false*/
/*global AssetTracker: false*/
/*global LoadingScreen: false*/

function Protolib(params)
{
    var protolib = this;
    this.globals = {};
    var globals = this.globals;

    // Major, Minor, Revision
    protolib.version = [0, 2, 1];

    globals.config = params = params || {};

    var MAX_SOUND_SOURCES = params.maxSoundSources !== undefined ? params.maxSoundSources : 50;
    this.MAX_SOUND_SOURCES = MAX_SOUND_SOURCES;

    var USE_SHADOWS = params.useShadows !== undefined ? params.useShadows : true;
    this.USE_SHADOWS = USE_SHADOWS;

    var INITIALIZED_CALLBACK = params.onInitialized;
    this.INITIALIZED_CALLBACK = INITIALIZED_CALLBACK;

    function logFn(msg)
    {
        var console = window.console;
        if (console)
        {
            console.log(msg);
        }
    }

    function errorFn(msg)
    {
        var console = window.console;
        if (console)
        {
            console.error("Error: " + msg);
        }
    }

    function warnFn(msg)
    {
        var console = window.console;
        if (console)
        {
            console.log("Warning: " + msg);
        }
    }

    // Utils
    var utilities = Utilities;
    if (!utilities)
    {
        utilities = {
            log: logFn,
            error: errorFn,
            warn: warnFn
        };

        utilities.error("Error: Missing Utilities object");
    }

    this.utils = utilities;
    if (!utilities.error)
    {
        utilities.error = errorFn;
    }
    if (!utilities.warn)
    {
        utilities.warn = warnFn;
    }
    if (!utilities.clamp)
    {
        utilities.clamp = function clampFn(value, min, max)
        {
            if (value < min)
            {
                value = min;
            }
            else if (value > max)
            {
                value = max;
            }
            return value;
        };
    }
    var currentTime = TurbulenzEngine.time;
    this.time = {
        app: {
            current: currentTime,
            previous: currentTime,
            delta: 0,
            maxDeltaTime: 1 / 10 //Maximum deltaTime to step in seconds
        }
    };

    //Devices
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    if (!graphicsDevice)
    {
        graphicsDevice = TurbulenzEngine.getGraphicsDevice();
    }
    globals.graphicsDevice = graphicsDevice;

    var mathDevice = TurbulenzEngine.createMathDevice({});
    if (!mathDevice)
    {
        mathDevice = TurbulenzEngine.getMathDevice();
    }
    globals.mathDevice = mathDevice;

    var inputDevice = TurbulenzEngine.createInputDevice({});
    if (!inputDevice)
    {
        inputDevice = TurbulenzEngine.getInputDevice();
    }
    globals.inputDevice = inputDevice;

    var soundDevice = params.disableSound ? null: TurbulenzEngine.createSoundDevice({});
    if (!soundDevice && !params.disableSound)
    {
        soundDevice = TurbulenzEngine.getSoundDevice();
    }
    globals.soundDevice = soundDevice;

    //Managers & RequestHandler
    var errorCallback = function errorCallbackFn(msg)
    {
        protolib.utils.error(msg);
    };

    TurbulenzEngine.onerror = errorCallback;

    var requestHandler = RequestHandler.create({});
    globals.requestHandler = requestHandler;

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    globals.textureManager = textureManager;

    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    globals.shaderManager = shaderManager;

    var fontManager = FontManager.create(graphicsDevice, requestHandler);
    globals.fontManager = fontManager;

    var effectManager = EffectManager.create();
    globals.effectManager = effectManager;

    var soundManager = soundDevice ? SoundManager.create(soundDevice, requestHandler, null, errorCallback): null;
    globals.soundManager = soundManager;

    globals.soundSourceManager = SoundSourceManager.create(soundDevice, MAX_SOUND_SOURCES);

    this.soundWrappers = [];

    //Dynamic UI
    var dynamicUI = params.enableDynamicUI ? DynamicUIManager.create() : null;
    globals.dynamicUI = dynamicUI;

    this.watchTypes = {
        SLIDER: 'slider'
    };
    this.dynamicUIGroups = {};
    this.watchGroups = {};

    // Global settings
    var settings =
    {
        volume: params.disableSound ? 0: 1.0

    };
    globals.settings = settings;

    var mappingTable = {};

    //Load mapping table.
    var mappingTableSettings = Protolib.extend(true, {
        mappingTablePrefix: 'staticmax/',
        assetPrefix: 'missing/',
        mappingTableURL: 'mapping_table.json',
        urnMapping: {}
    }, params.defaultMappingSettings);

    //Camera
    var camera = Camera.create(mathDevice);
    globals.camera = camera;
    camera.farPlane = 3000;
    camera.updateProjectionMatrix();
    camera.updateViewProjectionMatrix();

    //v3 constants
    this.v3Constants = {};
    var v3Constants = this.v3Constants;
    v3Constants.unitX  = mathDevice.v3Build(1, 0, 0);
    v3Constants.unitY  = mathDevice.v3Build(0, 1, 0);
    v3Constants.unitZ  = mathDevice.v3Build(0, 0, 1);
    v3Constants.origin = mathDevice.v3Build(0, 0, 0);

    v3Constants.red   = v3Constants.unitX;
    v3Constants.green = v3Constants.unitY;
    v3Constants.blue  = v3Constants.unitZ;
    v3Constants.black = v3Constants.origin;
    v3Constants.white = mathDevice.v3Build(1, 1, 1);

    //Setup Lights.
    var scene = Scene.create(mathDevice);
    globals.scene = scene;

    var light = Light.create({
            name : "protoAmbientLight",
            ambient: true,
            color: mathDevice.v3Build(0.2, 0.2, 0.2)
        });
    scene.addLight(light);

    this.clearColor = mathDevice.v4Build(1, 1, 1, 1);

    this._numPointLights = 0;
    this._numSpotLights  = 0;

    //Utils
    var simplesprite = SimpleSprite.create(globals);
    globals.simplesprite = simplesprite;

    globals.debugEnableWireframe = false;
    var simplesceneloader = SimpleSceneLoader.create(globals);
    globals.simplesceneloader = simplesceneloader;

    //Fonts
    var fonts = params.fonts || {
        regular: "opensans"
    };
    if (!fonts.regular)
    {
        fonts.regular = "opensans";
    }
    globals.fonts = fonts;

    var simplefont = SimpleFontRenderer.create(globals);
    globals.simplefont = simplefont;

    var debugdraw = DebugDraw.createFromGlobals(globals);
    globals.debugdraw = debugdraw;

    var draw2D = Draw2D.create({
            graphicsDevice: graphicsDevice
        });
    globals.draw2D = draw2D;

    // Create a dummy renderer
    var renderer = {
        update: function dummyUpdateFn() {},
        draw: function dummyDrawFn() {}
    };
    globals.renderer = renderer;

    protolib.loadingIntervalID = null;

    var assetTracker = null;
    var loadingScreen = null;

    function updateAssetTrackerFn()
    {
        if (protolib.loadingScreen)
        {
            protolib.loadingScreen.render(protolib.loadingScreenBackgroundAlpha, protolib.loadingScreenTextureAlpha);
        }
    }

    //After mapping table has loaded, load forwardrendering's shaders, and the default light material.
    //After the shaders have loaded, call onInitializedCallback.
    var postMappingTableReceived = function postMappingTableReceivedFn()
    {
        globals.mappingTable = mappingTable;

        debugdraw.preload();

        simplefont.preload();

        simplesprite.preload();

        var rendererOptions = {
            shadowRendering: protolib.USE_SHADOWS
        };
        var renderer = ForwardRendering.create(graphicsDevice, mathDevice, shaderManager, effectManager, rendererOptions);
        globals.renderer = renderer;
        renderer.setLightingScale(1.0);

        //Load default light material
        var lightMaterialData = {
            effect: "lambert",
            parameters :
            {
                lightfalloff: "textures/default_light.png",
                lightprojection: "textures/default_light.png"
            }
        };

        scene.loadMaterial(graphicsDevice, textureManager, effectManager, "defaultLightMaterial", lightMaterialData);
        protolib.defaultLightMaterial = scene.getMaterial("defaultLightMaterial");

        var waitForForwardRenderingShaders = function waitForForwardRenderingShadersFn()
        {
            if (shaderManager.getNumPendingShaders() === 0 &&
                textureManager.getNumPendingTextures() === 0 &&
                fontManager.getNumPendingFonts() === 0 &&
                (soundManager ? soundManager.getNumPendingSounds() === 0: true))
            {
                if (protolib.loadingIntervalID)
                {
                    TurbulenzEngine.clearInterval(protolib.loadingIntervalID);
                    protolib.loadingIntervalID = null;
                }

                var missingAssets = [];
                if (protolib._checkAssets(missingAssets))
                {
                    if (!protolib._warnAssets(missingAssets))
                    {
                        protolib.utils.warn("Protolib could not find requested assets");
                        protolib.utils.warn("Missing: " + missingAssets);
                    }

                    renderer.updateBuffers(graphicsDevice, graphicsDevice.width, graphicsDevice.height);
                    renderer.updateShader(shaderManager);

                    protolib.loadingScreen = null;

                    protolib.beginFrame = Protolib.prototype.beginFrame;
                    protolib.endFrame = Protolib.prototype.endFrame;

                    if (INITIALIZED_CALLBACK)
                    {
                        INITIALIZED_CALLBACK(protolib);
                    }
                }
                else
                {
                    protolib.utils.error("Protolib could not find the minimum set of required assets");
                    protolib.utils.error("Missing: " + missingAssets);
                }
            }
            else
            {
                if (protolib.loadingScreen)
                {
                    protolib.loadingScreen.render(protolib.loadingScreenBackgroundAlpha, protolib.loadingScreenTextureAlpha);
                }
            }
        };

        var assetCount = shaderManager.getNumPendingShaders() +
                    textureManager.getNumPendingTextures() +
                    fontManager.getNumPendingFonts();
        if (soundManager)
        {
            assetCount += soundManager.getNumPendingSounds();
        }

        assetTracker = protolib.assetTracker = AssetTracker.create(assetCount, false);
        assetTracker.setCallback(updateAssetTrackerFn);

        requestHandler.addEventListener('eventOnload', assetTracker.eventOnLoadHandler);

        var loadingScreenParameters = {
            backgroundColor: mathDevice.v4Build(0, 0, 0, 1),
            barColor: mathDevice.v4Build(0.749, 0.067, 0.227, 1),
            barCenter: {
                x: 0.5,
                y: 0.5
            },
            barBorderSize: 4,
            barBackgroundColor: mathDevice.v4Build(0.2, 0.2, 0.2, 1),
            barBackgroundHeight: 24,
            barBackgroundWidth: 540,
            assetTracker: assetTracker
        };

        loadingScreen = protolib.loadingScreen = LoadingScreen.create(graphicsDevice, mathDevice, loadingScreenParameters);
        protolib.loadingScreenBackgroundAlpha = 1.0;
        protolib.loadingScreenTextureAlpha = 1.0;

        protolib.loadingIntervalID = TurbulenzEngine.setInterval(waitForForwardRenderingShaders, 1000 / 10);
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        if (mappingTable)
        {
            textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            fontManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

            if (soundManager)
            {
                soundManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            }
            simplesceneloader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        }

        postMappingTableReceived();
    };
    var mappingTableError = function mappingTableErrorFn(msg)
    {
        errorCallback(msg);
        mappingTableReceived(mappingTable);
    };

    var gamesessionReceived = function gamesessionReceivedFn(gamesession)
    {
        protolib.gameSession = gamesession;

        mappingTable = TurbulenzServices.createMappingTable(
            requestHandler,
            gamesession,
            mappingTableReceived,
            mappingTableSettings,
            mappingTableError
        );
    };

    this.draw2DCache = {
        'alpha': [],
        'additive': []
    };

    //Enums
    this.soundStatus = {
        PLAYING: 'playing',
        PAUSED : 'paused',
        STOPPED : 'stopped'
    };

    //Depricated: v0.2.0, replaced with textAlignmentHorz, textVerticalAlign
    this.textAlignment = null;

    this.textHorizontalAlign = simplefont.textHorizontalAlign;
    this.textVerticalAlign = simplefont.textVerticalAlign;

    this.blendStyle = {
        ALPHA : 'alpha',
        ADDITIVE : 'additive'
    };
    this.keyCodes = inputDevice.keyCodes;
    this.mouseCodes = inputDevice.mouseCodes;

    //Mapping from our blendStyle dictionary to SimpleSprite's and Draw2D's.
    this.toSimpleSpriteBlendStyle = {};
    this.toSimpleSpriteBlendStyle[this.blendStyle.ALPHA] = SimpleSprite.prototype.blendStyle.NORMAL;
    this.toSimpleSpriteBlendStyle[this.blendStyle.ADDITIVE] = SimpleSprite.prototype.blendStyle.ADD;

    this.toDraw2DBlendStyle = {};
    this.toDraw2DBlendStyle[this.blendStyle.ALPHA] = draw2D.blend.alpha;
    this.toDraw2DBlendStyle[this.blendStyle.ADDITIVE] = draw2D.blend.additive;


    //Keyboard state
    this.keysPressed = {}; //Keys currently pressed.
    this.keysJustPressed = {}; //Keys that started being pressed this frame.
    this.keysJustReleased = {}; //Keys that were released this frame.

    //Mouse state
    this.mouseBtnsPressed = {};
    this.mouseBtnsJustPressed = {};
    this.mouseBtnsJustReleased = {};
    this.mousePosition = [0, 0];
    this.prevMousePosition = [0, 0];
    this.mouseDelta = [0, 0];
    this.mouseWheelDelta = 0;
    this.mouseOnGame = false;

    this.cursorDraw2DParams = {};
    this.cursorSettings = {};

    this.preDrawFn = null;
    this.preRendererDrawFn = null;
    this.postRendererDrawFn = null;
    this.postDrawFn = null;

    function onKeyDown(keycode)
    {
        protolib.keysJustPressed[keycode] = true;
        protolib.keysPressed[keycode] = true;
    }

    function onKeyUp(keycode)
    {
        protolib.keysJustReleased[keycode] = true;
        delete protolib.keysPressed[keycode];
    }

    function onMouseUp(mousecode, x, y)
    {
        protolib.mouseBtnsJustReleased[mousecode] = true;
        delete protolib.mouseBtnsPressed[mousecode];

        if (x && y)
        {
            protolib.mousePosition[0] = x;
            protolib.mousePosition[1] = y;
        }
    }

    function onMouseDown(mousecode, x, y)
    {
        protolib.mouseBtnsJustPressed[mousecode] = true;
        protolib.mouseBtnsPressed[mousecode] = true;

        if (x && y)
        {
            protolib.mousePosition[0] = x;
            protolib.mousePosition[1] = y;
        }
    }

    function onMouseOver(x, y)
    {
        protolib.mousePosition[0] = x;
        protolib.mousePosition[1] = y;

        protolib.mouseDelta[0] = protolib.prevMousePosition[0] - x;
        protolib.mouseDelta[1] = protolib.prevMousePosition[1] - y;
    }

    function onMouseMove(dx, dy)
    {
        protolib.mouseDelta[0] += dx;
        protolib.mouseDelta[1] += dy;
    }

    function onMouseEnter()
    {
        protolib.mouseOnGame = true;
    }

    function onMouseLeave()
    {
        protolib.mouseOnGame = false;
    }

    function onMouseWheel(delta)
    {
        protolib.mouseWheelDelta += delta;
    }

    this.registerListeners = function registerListenersFn()
    {
        //Keyboard event listeners
        inputDevice.addEventListener('keydown', onKeyDown);
        inputDevice.addEventListener('keyup', onKeyUp);

        //Mouse event listeners
        inputDevice.addEventListener('mouseup', onMouseUp);
        inputDevice.addEventListener('mousedown', onMouseDown);
        inputDevice.addEventListener('mouseover', onMouseOver);
        inputDevice.addEventListener('mousemove', onMouseMove);
        inputDevice.addEventListener('mouseenter', onMouseEnter);
        inputDevice.addEventListener('mouseleave', onMouseLeave);
        inputDevice.addEventListener('mousewheel', onMouseWheel);
    };

    this.unregisterListeners = function unregisterListenersFn()
    {
        var inputDevice = this.globals.inputDevice;
        if (inputDevice)
        {
            //Keyboard event listeners
            inputDevice.removeEventListener('keydown', onKeyDown);
            inputDevice.removeEventListener('keyup', onKeyUp);

            //Mouse event listeners
            inputDevice.removeEventListener('mouseup', onMouseUp);
            inputDevice.removeEventListener('mousedown', onMouseDown);
            inputDevice.removeEventListener('mouseover', onMouseOver);
            inputDevice.removeEventListener('mousemove', onMouseMove);
            inputDevice.removeEventListener('mouseenter', onMouseEnter);
            inputDevice.removeEventListener('mouseleave', onMouseLeave);
            inputDevice.removeEventListener('mousewheel', onMouseWheel);
        }
    };

    this.beginFrame = function dummyBeginFrameFn() { return false; };
    this.endFrame = function dummyEndFrameFn() {};

    this.registerListeners();

    TurbulenzServices.createGameSession(requestHandler, gamesessionReceived);

    this.destroyed = false;
}

Protolib.prototype =
{
    destroy: function destroyFn()
    {
        if (!this.destroyed)
        {
            this.unregisterListeners();

            if (this.loadingIntervalID)
            {
                TurbulenzEngine.clearInterval(this.loadingIntervalID);
                this.loadingIntervalID = null;
            }

            var globals = this.globals;
            if (globals)
            {
                var graphicsDevice = globals.graphicsDevice;
                if (graphicsDevice && graphicsDevice.destroy)
                {
                    graphicsDevice.destroy();
                }
                var inputDevice = globals.inputDevice;
                if (inputDevice && inputDevice.destroy)
                {
                    inputDevice.destroy();
                }
                var soundDevice = globals.soundDevice;
                if (soundDevice && soundDevice.destroy)
                {
                    soundDevice.destroy();
                }
            }
            this.destroyed = true;
        }
    },

    //Devices
    getMathDevice : function getMathDeviceFn()
    {
        return this.globals.mathDevice;
    },
    getInputDevice : function getInputDeviceFn()
    {
        return this.globals.inputDevice;
    },
    getSoundDevice : function getSoundDeviceFn()
    {
        return this.globals.soundDevice;
    },
    getGraphicsDevice : function getGraphicsDeviceFn()
    {
        return this.globals.graphicsDevice;
    },
    //Keyboard state
    isKeyDown : function isKeyDownFn(keycode)
    {
        return this.keysPressed[keycode];
    },
    isKeyJustDown : function isKeyJustDownFn(keycode)
    {
        return this.keysJustPressed[keycode];
    },
    isKeyJustUp : function isKeyJustUpFn(keycode)
    {
        return this.keysJustReleased[keycode];
    },

    //Mouse state
    isMouseDown : function isMouseDownFn(mousecode)
    {
        return this.mouseBtnsPressed[mousecode];
    },
    isMouseJustDown : function isMouseJustDownFn(mousecode)
    {
        return this.mouseBtnsJustPressed[mousecode];
    },
    isMouseJustUp : function isMouseJustUpFn(mousecode)
    {
        return this.mouseBtnsJustReleased[mousecode];
    },
    isMouseOnGame : function isMouseOnGameFn()
    {
        return this.mouseOnGame;
    },
    getMousePosition : function getMousePositionFn()
    {
        return this.mousePosition;
    },
    getMouseDelta : function getMouseDeltaFn()
    {
        return this.mouseDelta;
    },
    getMouseWheelDelta : function getMouseWheeDeltaFn()
    {
        return this.mouseWheelDelta;
    },

    //Game loop
    beginFrame : function beginFrameFn()
    {
        var globals = this.globals;
        var graphicsDevice = globals.graphicsDevice;
        var inputDevice = globals.inputDevice;

        // Update input before frame
        inputDevice.update();

        var simplesprite = globals.simplesprite;
        simplesprite.clearSpriteList();

        var gd_begin = graphicsDevice.beginFrame();

        this.width = graphicsDevice.width;
        this.height = graphicsDevice.height;

        var appTime = this.time.app;
        appTime.current = TurbulenzEngine.time;
        appTime.delta = appTime.current - appTime.previous;
        appTime.delta = this.utils.clamp(appTime.delta, 0, appTime.maxDeltaTime);

        return gd_begin;
    },
    endFrame : function endFrameFn()
    {
        var globals = this.globals;

        var simplesprite = globals.simplesprite;
        var simplefont = globals.simplefont;
        var debugdraw = globals.debugdraw;
        var graphicsDevice = globals.graphicsDevice;

        var soundDevice = globals.soundDevice;
        var camera = globals.camera;
        var scene = globals.scene;
        var renderer = globals.renderer;
        var soundSourceManager = globals.soundSourceManager;

        var clear = this.clearColor;

        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
        scene.update();

        if (this.preDrawFn)
        {
            this.preDrawFn();
        }

        renderer.update(graphicsDevice, camera, scene, TurbulenzEngine.time);
        renderer.draw(graphicsDevice, clear, this.preRendererDrawFn);

        simplesprite.drawSprites();
        debugdraw.drawDebugLines();

        if (this.postRendererDrawFn)
        {
            this.postRendererDrawFn();
        }

        this._draw2DSprites();
        simplefont.render();

        if (this.postDrawFn)
        {
            this.postDrawFn();
        }

        this.keysJustPressed = {};
        this.keysJustReleased = {};
        this.mouseBtnsJustPressed = {};
        this.mouseBtnsJustReleased = {};
        this.prevMousePosition[0] = this.mousePosition[0];
        this.prevMousePosition[1] = this.mousePosition[1];
        this.mouseDelta[0] = 0;
        this.mouseDelta[1] = 0;
        this.mouseWheelDelta = 0;

        this._updateSounds();
        soundSourceManager.checkFreeSoundSources();
        if (soundDevice)
        {
            soundDevice.update();
            soundDevice.listenerTransform = camera.matrix;
        }

        var appTime = this.time.app;
        appTime.previous = appTime.current;

        return graphicsDevice.endFrame();
    },
    setPreDraw : function setPreDrawFn(callbackFn)
    {
        this.preDrawFn = callbackFn;
    },
    setPreRendererDraw : function setPreRendererDrawFn(callbackFn)
    {
        this.preRendererDrawFn = callbackFn;
    },
    setPostRendererDraw : function setPostRendererDrawFn(callbackFn)
    {
        this.postRendererDrawFn = callbackFn;
    },
    setPostDraw : function setPostDrawFn(callbackFn)
    {
        this.postDrawFn = callbackFn;
    },
    setClearColor : function setClearColor(v3Color)
    {
        this._v3CopyAsV4(v3Color, this.clearColor);
    },
    getClearColor : function getClearColor(v3Color)
    {
        this._v4CopyAsV3(this.clearColor, v3Color);
    },
    //Camera
    setCameraPosition : function setCameraPositionFn(v3Position)
    {
        var globals = this.globals;
        var camera = globals.camera;
        var mathDevice = globals.mathDevice;

        mathDevice.m43SetPos(camera.matrix, v3Position);
        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
    },
    getCameraPosition : function getCameraPositionFn(v3Position)
    {
        var globals = this.globals;
        var camera = globals.camera;
        var mathDevice = globals.mathDevice;
        mathDevice.m43Pos(camera.matrix, v3Position);
    },
    setCameraDirection : function setCameraDirectionFn(v3Direction)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var mathDevice = globals.mathDevice;
        var camera = globals.camera;
        var cameraPosition = mathDevice.m43Pos(camera.matrix);
        var cameraDirection = v3Direction;
        var cameraFocus = mathDevice.v3Add(cameraPosition, cameraDirection);

        var upDir = v3Constants.unitY;

        if ((Math.abs(cameraDirection[0]) < 0.000001) &&
            (Math.abs(cameraDirection[2]) < 0.000001))
        {
            upDir = v3Constants.unitZ;
        }

        camera.lookAt(cameraFocus, upDir, cameraPosition);

        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
    },
    getCameraDirection : function getCameraDirectionFn(v3Direction)
    {
        var globals = this.globals;
        var mathDevice = globals.mathDevice;
        var camera = globals.camera;

        mathDevice.v3ScalarMul(mathDevice.m43At(camera.matrix), -1, v3Direction);
    },
    getCameraUp : function getCameraDirectionFn(v3Up)
    {
        var globals = this.globals;
        var mathDevice = globals.mathDevice;
        var camera = globals.camera;

        mathDevice.m43Up(camera.matrix, v3Up);
    },
    getCameraRight : function getCameraDirectionFn(v3Right)
    {
        var globals = this.globals;
        var mathDevice = globals.mathDevice;
        var camera = globals.camera;

        mathDevice.m43Right(camera.matrix, v3Right);
    },
    moveCamera : function moveCameraFn(v3Direction)
    {
        var globals = this.globals;
        var camera = globals.camera;
        var mathDevice = globals.mathDevice;

        var cameraMatrix = camera.matrix;
        var pos = mathDevice.m43Pos(cameraMatrix);

        var right   = v3Direction[0];
        var up      = v3Direction[1];
        var forward = v3Direction[2];

        mathDevice.v3Add4(pos,
                mathDevice.v3ScalarMul(mathDevice.m43Right(cameraMatrix), right),
                mathDevice.v3ScalarMul(mathDevice.m43Up(cameraMatrix),    up),
                mathDevice.v3ScalarMul(mathDevice.m43At(cameraMatrix),   -forward),
                pos);
        mathDevice.m43SetPos(cameraMatrix, pos);
        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
    },
    rotateCamera : function rotateCameraFn(yawDelta, pitchDelta)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var mathDevice = globals.mathDevice;
        var camera = globals.camera;
        var cameraMatrix = camera.matrix;
        var cameraPos = mathDevice.m43Pos(cameraMatrix);

        mathDevice.m43SetPos(cameraMatrix, mathDevice.v3BuildZero());

        var rotate;
        if (pitchDelta !== 0)
        {
            var right = mathDevice.v3Normalize(mathDevice.m43Right(cameraMatrix));
            mathDevice.m43SetRight(cameraMatrix, right);

            rotate = mathDevice.m43FromAxisRotation(right, pitchDelta);

            mathDevice.m43Mul(cameraMatrix, rotate, cameraMatrix);
        }
        if (yawDelta !== 0)
        {
            rotate = mathDevice.m43FromAxisRotation(v3Constants.unitY, yawDelta);

            mathDevice.m43Mul(cameraMatrix, rotate, cameraMatrix);
        }
        mathDevice.m43SetPos(cameraMatrix, cameraPos);

        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
    },
    setCameraFOV : function setCameraFOVFn(fovX, fovY)
    {
        var globals = this.globals;
        var camera = globals.camera;

        var recipViewWindowX = 1.0 / Math.tan(fovX * 0.5);
        var recipViewWindowY = 1.0 / Math.tan(fovY * 0.5);
        camera.recipViewWindowX = recipViewWindowX;
        camera.recipViewWindowY = recipViewWindowY;
        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();
    },
    getCameraFOV : function getCameraFOVFn()
    {
        var globals = this.globals;
        var camera = globals.camera;

        var recipViewWindowX = camera.recipViewWindowX;
        var recipViewWindowY = camera.recipViewWindowY;
        var fovX = 2 * Math.atan(1 / recipViewWindowX);
        var fovY = 2 * Math.atan(1 / recipViewWindowY);
        return [fovX, fovY];
    },
    setNearFarPlanes : function setNearFarPlanes(nearPlane, farPlane)
    {
        var globals = this.globals;
        var camera = globals.camera;

        camera.nearPlane = nearPlane;
        camera.farPlane = farPlane;

        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();
    },
    getNearFarPlanes : function getNearFarPlanes()
    {
        var globals = this.globals;
        var camera = globals.camera;

        return [camera.nearPlane, camera.farPlane];
    },

    //2D
    draw2DSprite : function draw2DSpriteFn(params)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var mathDevice = globals.mathDevice;
        var textureManager = globals.textureManager;

        var texture = params.texture;
        var x = params.position[0];
        var y = params.position[1];
        var width = params.width;
        var height = params.height;
        var v3Color = params.v3Color || v3Constants.white;
        var alpha = params.alpha !== undefined ? params.alpha: 1;
        var rotation = params.rotation || 0;
        var blendStyle = params.blendStyle || this.blendStyle.ALPHA;
        var sourceRectangle = params.sourceRectangle;

        var v4Color = mathDevice.v4Build(v3Color[0], v3Color[1], v3Color[2], alpha);
        var draw2DBlendStyle = this.toDraw2DBlendStyle[blendStyle];

        this.draw2DCache[draw2DBlendStyle].push({
            texture: textureManager.load(texture),
            destinationRectangle: [x, y, x + width, y + height],
            sourceRectangle: sourceRectangle ? mathDevice.v4Copy(sourceRectangle): undefined,
            rotation: rotation,
            color: v4Color
        });
    },
    _draw2DSprites : function _draw2DSpritesFn()
    {
        var globals = this.globals;
        var draw2D = globals.draw2D;
        var draw2DCache = this.draw2DCache;

        var blendModes = ['alpha', 'additive'];
        var blendModesLength = blendModes.length;

        var i;
        var j;
        var sprites;
        var spritesLength;
        var blendMode;
        for (i = 0; i < blendModesLength; i += 1)
        {
            blendMode = blendModes[i];
            sprites = draw2DCache[blendMode];
            spritesLength = sprites.length;

            if (spritesLength === 0)
            {
                continue;
            }

            draw2D.begin(blendMode);
            for (j = 0; j < spritesLength; j += 1)
            {
                draw2D.draw(sprites[j]);
            }
            draw2D.end();
            sprites.length = 0;
        }
    },
    drawText : function drawTextFn(params)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var simplefont = globals.simplefont;

        var v3Color = params.v3Color || v3Constants.red;
        var position = params.position;
        var text = params.text;
        var scale = params.scale || 1;
        var spacing = params.spacing;
        var alignment = params.alignment;
        if (alignment)
        {
            this.utils.warn("Property alignment depricated in v0.2.0, please use verticalAlign and horizontalAlign");
        }
        var horizontalAlign = params.horizontalAlign !== undefined ? params.horizontalAlign: this.textHorizontalAlign.CENTER;
        var verticalAlign = params.verticalAlign !== undefined ? params.verticalAlign: this.textVerticalAlign.MIDDLE;
        var fontStyle = params.fontStyle || "regular";

        var fontParams =
        {
            x : position[0],
            y : position[1],

            r : v3Color[0],
            g : v3Color[1],
            b : v3Color[2],

            scale : scale,
            spacing : spacing,
            alignment : horizontalAlign,
            valignment : verticalAlign,
            fontStyle : fontStyle
        };

        simplefont.drawFont(text, fontParams);
    },

    //3D
    draw3DSprite : function addSpriteFn(params)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var mathDevice = globals.mathDevice;
        var simplesprite = globals.simplesprite;

        var alpha = params.alpha || 1;
        var v3Color = params.v3Color || v3Constants.white;
        var v3Position = params.v3Position;
        var v3Out = params.v3Out;
        var texture = params.texture;
        var size = params.size;
        var rotation = params.rotation || 0;
        var blendStyle = params.blendStyle;

        var spriteParams =
        {
            out : v3Out,
            v3Location : v3Position,
            v4color : mathDevice.v4Build(v3Color[0], v3Color[1], v3Color[2], alpha),
            texture : texture,
            size : size,
            angle: rotation,
            blendStyle : this.toSimpleSpriteBlendStyle[blendStyle]
        };

        if (!simplesprite.addSprite(spriteParams))
        {
            this.utils.warn("draw3DSprite: Maximum sprites reached.");
        }
    },
    loadMesh : function addMeshFn(params)
    {
        var protolib = this;
        var globals = this.globals;
        var simplesceneloader = globals.simplesceneloader;

        var mathDevice = globals.mathDevice;
        var v3Position = params.v3Position || mathDevice.v3BuildZero();
        var v3Size = params.v3Size || mathDevice.v3Build(1, 1, 1);
        var meshPath = params.mesh;

        var node = simplesceneloader.load(meshPath);

        var wrapper = new MeshWrapper(protolib, node);
        wrapper.setPosition(v3Position);
        wrapper.setSize(v3Size);

        return wrapper;
    },
    draw3DLine : function draw3DLineFn(params)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var debugdraw = globals.debugdraw;

        var v3Color = params.v3Color || v3Constants.red;
        var pos1 = params.pos1;
        var pos2 = params.pos2;

        debugdraw.drawDebugLine(pos1, pos2, v3Color[0], v3Color[1], v3Color[2]);
    },
    drawDebugSphere : function drawDebugSphereFn(params)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var debugdraw = globals.debugdraw;

        var radius = params.radius;
        var v3Color = params.v3Color || v3Constants.red;
        var v3Position = params.v3Position;

        debugdraw.drawDebugSphere(v3Position, radius, v3Color[0], v3Color[1], v3Color[2]);
    },
    drawDebugCube : function drawDebugCubeFn(params)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var debugdraw = globals.debugdraw;

        var v3Position = params.v3Position;
        var length = params.length;
        var v3Color = params.v3Color || v3Constants.red;

        debugdraw.drawDebugCube(v3Position, length, v3Color[0], v3Color[1], v3Color[2]);
    },

    //Lights
    setAmbientLightColor : function setAmbientLightColorFn(v3Color)
    {
        var globals = this.globals;
        var scene = globals.scene;
        var mathDevice = globals.mathDevice;

        var ambientLight = scene.getLight("protoAmbientLight");
        mathDevice.v3Copy(v3Color, ambientLight.color);
    },
    getAmbientLightColor : function getAmbientLightColorFn(v3Color)
    {
        var globals = this.globals;
        var scene = globals.scene;
        var mathDevice = globals.mathDevice;

        var ambientLight = scene.getLight("protoAmbientLight");
        mathDevice.v3Copy(ambientLight.color, v3Color);
    },
    _genPointLightId : function genPointLightIdFn()
    {
        var id = this._numPointLights;
        this._numPointLights += 1;
        return id;
    },
    _genSpotLightId : function genSpotLightIdFn()
    {
        var id = this._numSpotLights;
        this._numSpotLights += 1;
        return id;
    },
    _addLight : function addLightFn(mathDevice, scene, name, light)
    {
        var lightNode = SceneNode.create({
                name: name + "_scenenode",
                local: mathDevice.m43BuildIdentity(),
                dynamic: true,
                disabled: false
            });
        scene.addLight(light);

        lightNode.addLightInstance(LightInstance.create(light));

        scene.addRootNode(lightNode);

        return lightNode;
    },
    addPointLight : function addPointLightFn(params)
    {
        var protolib = this;
        var globals = this.globals;
        var scene = globals.scene;
        var mathDevice = globals.mathDevice;

        var v3Color = params.v3Color;
        var radius = params.radius;
        var v3Position = params.v3Position;

        var lightMaterial = this.defaultLightMaterial;

        var name = "pointlight" + this._genPointLightId();

        var light = Light.create({
                name : name,
                point : true,
                color : mathDevice.v3Copy(v3Color),
                shadows : true,
                halfExtents : mathDevice.v3Build(radius, radius, radius),
                origin : mathDevice.v3Build(0, 0, 0),
                material : lightMaterial
            });

        var lightNode = this._addLight(mathDevice, scene, name, light);

        var wrapper = new PointLightWrapper(protolib, lightNode, light);
        wrapper.setPosition(v3Position);
        wrapper.setColor(v3Color);

        return wrapper;
    },

    addSpotLight : function addSpotLightFn(params)
    {
        var protolib = this;
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var scene = globals.scene;
        var mathDevice = globals.mathDevice;

        var v3Position = params.v3Position;
        var v3Direction = params.v3Direction;
        var range = params.range;
        var spreadAngle = params.spreadAngle;
        var v3Color = params.v3Color;

        var name = "spotlight" + this._genSpotLightId();
        var lightMaterial = this.defaultLightMaterial;

        var radius = range * Math.tan(spreadAngle / 2);

        var light = Light.create({
                name : name,
                color : mathDevice.v3Copy(v3Color),
                spot : true,
                shadows : true,
                material : lightMaterial,
                origin : v3Constants.origin,
                start : v3Constants.origin,
                target : mathDevice.v3Build(0, 0, -range),
                up : mathDevice.v3Build(0, radius, 0),
                right : mathDevice.v3Build(radius, 0, 0)
            });

        var lightNode = this._addLight(mathDevice, scene, name, light);

        var wrapper = new SpotLightWrapper(protolib, lightNode, light);
        wrapper.setPosition(v3Position);
        wrapper.setColor(v3Color);
        wrapper.setDirection(v3Direction);

        return wrapper;
    },

    //Sounds
    playSound : function playSoundFn(params)
    {
        var protolib = this;
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var mathDevice = globals.mathDevice;
        var soundManager = globals.soundManager;
        var soundSourceManager = globals.soundSourceManager;

        if (!soundManager)
        {
            // Sounds are disabled
            protolib.utils.error("Cannot play the sound, soundDevice is not available.");
            return null;
        }

        var soundPath = params.sound;
        var volume = (params.volume !== undefined) ? params.volume:  1.0;
        var pitch = params.pitch || 1.0;
        var looping = params.looping || false;
        var position = params.v3Position || v3Constants.origin;
        var minDistance = params.minDistance || 1;
        var maxDistance = params.maxDistance;
        var rollOff = params.rollOff || 1;
        var background = params.background || false;

        if (background)
        {
            if (params.v3Position !== undefined)
            {
                protolib.utils.error("playSound: background is not compatible with v3Position");
                return null;
            }

            if (params.minDistance !== undefined)
            {
                protolib.utils.error("playSound: background is not compatible with minDistance");
                return null;
            }

            if (params.maxDistance !== undefined)
            {
                protolib.utils.error("playSound: background is not compatible with maxDistance");
                return null;
            }

            if (params.rollOff !== undefined)
            {
                protolib.utils.error("playSound: background is not compatible with rollOff");
                return null;
            }
        }

        var soundWrapper = null;
        var soundSource = null;

        var wrapperInvalidatedFn = function soundInvalidFn()
        {
            protolib.utils.error("Cannot modify the sound, as it has stopped playing.");
        };

        var onReleasedCallback = function onReleasedCallbackFn()
        {
            if (soundWrapper)
            {
                protolib._invalidateWrapper(soundWrapper, ['soundStatus'], wrapperInvalidatedFn);
            }
            soundSource = null;
        };

        var token = soundSourceManager.getSoundSourceToken(onReleasedCallback);

        if (token === null)
        {
            protolib.utils.error("Cannot play " + soundPath + ". Too many sounds playing.");
            return null;
        }

        soundSource = soundSourceManager.getSoundSource(token);
        soundSource.pitch = pitch;
        soundSource.looping = looping;
        soundSource.position = mathDevice.v3Build(position[0], position[1], position[2]);
        soundSource.minDistance = minDistance;
        if (maxDistance !== undefined)
        {
            soundSource.maxDistance = maxDistance;
        }
        soundSource.rollOff = rollOff;
        soundSource.relative = background;
        soundWrapper = new SoundWrapper(protolib, token, soundSourceManager, volume);

        soundSourceManager.setSoundSourceLoading(token, true);
        soundManager.load(soundPath, false, function (sound) {
                if (soundSource)
                {
                    var playSound = true;
                    if (sound.channels > 1)
                    {
                        if (!background)
                        {
                            protolib.utils.error(soundPath + ": Non-background sounds do not support multiple channels");
                            playSound = false;
                        }
                    }
                    if (playSound)
                    {
                        soundSource.play(sound);
                    }
                }
                soundSourceManager.setSoundSourceLoading(token, false);
            });

        this.soundWrappers.push(soundWrapper);
        return soundWrapper;
    },
    _updateSounds : function _updateSoundsFn()
    {
        var globals = this.globals;
        var globalVolume = globals.settings.volume;
        var lastGlobalVolume = this.lastGlobalVolume;

        if (globalVolume === lastGlobalVolume)
        {
            return;
        }

        var soundWrappers = this.soundWrappers;
        var soundWrappersLength = soundWrappers.length;
        var soundWrapper;

        for (var i = 0; i < soundWrappersLength; i += 1)
        {
            soundWrapper = soundWrappers[i];
            if (soundWrapper.valid)
            {
                // Update volume with global volume
                soundWrapper.setVolume(soundWrapper.getVolume());
            }
        }

        this.lastGlobalVolume = globalVolume;
    },
    _getPropertyDescriptor : function _getPropertyDescriptor(obj, prop)
    {
        //Similar to getOwnPropertyDescriptor, except it searches the prototype chain.
        var propDescriptor;
        var prototype;
        while (!propDescriptor && obj)
        {
            propDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
            prototype = Object.getPrototypeOf(obj);
            obj = prototype;
        }

        return propDescriptor;
    },
    _invalidateWrapper : function _invalidateWrapper(wrapper, keep, wrapperInvalidatedFn)
    {
        var i;
        var keepLength = keep.length;
        var keepDict = {};
        for (i = 0; i < keepLength; i += 1)
        {
            keepDict[keep[i]] = true;
        }

        var prop;
        var isFunction;
        var hasGetter;
        var hasSetter;
        var propDescriptor;
        for (prop in wrapper)
        {
            isFunction = typeof wrapper[prop] === 'function';
            propDescriptor = this._getPropertyDescriptor(wrapper, prop) || {};
            hasGetter = 'get' in propDescriptor && propDescriptor.get !== undefined;
            hasSetter = 'set' in propDescriptor && propDescriptor.set !== undefined;

            if (!(keepDict[prop]))
            {
                if (isFunction)
                {
                    wrapper[prop] = wrapperInvalidatedFn;
                }
                else if (hasGetter || hasSetter)
                {
                    Object.defineProperty(wrapper, prop,
                    {
                        get : hasGetter ? wrapperInvalidatedFn : undefined,
                        set : hasSetter ? wrapperInvalidatedFn : undefined
                    });
                }
            }
        }
        wrapper.valid = false;
    },
    addWatchVariable: function addWatchVariableFn(params)
    {
        var globals = this.globals;
        var dynamicUI = globals.dynamicUI;
        if (!dynamicUI)
        {
            return -1;
        }

        var dynamicUIGroups = this.dynamicUIGroups;
        var group = params.group || null;
        var groupObject = null;
        if (group)
        {
            groupObject = dynamicUIGroups[group];
            if (!groupObject)
            {
                groupObject = dynamicUIGroups[group] = dynamicUI.addGroup(group);
            }
        }

        var title = params.title || null;
        var property = params.property || null;
        var type = params.type || null;
        var object = params.object !== undefined ? params.object: null;
        var options = params.options ? params.options: null;

        if (!title || !property || !type || !object)
        {
            return -1;
        }

        // Volume slider
        var id = dynamicUI.watchVariable(
            title,
            object,
            property,
            type,
            groupObject,
            options);
        this.watchGroups[id] = groupObject;
        return id;
    },
    removeWatchVariable: function removeWatchVariableFn(id)
    {
        var globals = this.globals;
        var dynamicUI = globals.dynamicUI;
        if (!dynamicUI || !id || id === -1)
        {
            return false;
        }

        var groupObject = this.watchGroups[id];
        dynamicUI.removeFromGroup(id, groupObject);
        delete this.watchGroups[id];

        return true;
    },
    _v4CopyAsV3: function _v4CopyAsV3Fn(a, dst)
    {
        if (dst === undefined)
        {
            dst = new VMathArrayConstructor(3);
        }

        debug.assert(debug.isVec4(a));
        debug.assert(debug.isVec3(dst));

        dst[0] = a[0];
        dst[1] = a[1];
        dst[2] = a[2];
        return dst;
    },
    _v3CopyAsV4: function _v3CopyAsV4Fn(a, dst)
    {
        if (dst === undefined)
        {
            dst = new VMathArrayConstructor(4);
            dst[3] = 0;
        }

        debug.assert(debug.isVec3(a));
        debug.assert(debug.isVec4(dst));

        dst[0] = a[0];
        dst[1] = a[1];
        dst[2] = a[2];
        return dst;
    },
    _checkAssets: function _checkAssetsFn(listOfMissingAssets)
    {
        var assetMissing = false;
        var i, length;

        //Shaders
        var shaderManager = this.globals.shaderManager;
        var shaders = [
            "shaders/debug.cgfx",
            "shaders/shadowmapping.cgfx",
            "shaders/zonly.cgfx",
            "shaders/font.cgfx",
            "shaders/forwardrendering.cgfx",
            "shaders/forwardrenderingshadows.cgfx",
            "shaders/simplesprite.cgfx"
        ];

        length = shaders.length;
        for (i = 0; i < length; i += 1)
        {
            if (shaderManager.isShaderMissing(shaders[i]))
            {
                assetMissing = true;
                listOfMissingAssets.push(shaders[i]);
            }
        }

        //Textures
        var textureManager = this.globals.textureManager;
        var textures = [
            "textures/default_light.png"
        ];

        length = textures.length;
        for (i = 0; i < length; i += 1)
        {
            if (textureManager.isTextureMissing(textures[i]))
            {
                assetMissing = true;
                listOfMissingAssets.push(textures[i]);
            }
        }

        //Fonts
        var fontManager = this.globals.fontManager;
        var fonts = [
            "fonts/opensans-8.fnt",
            "fonts/opensans-16.fnt",
            "fonts/opensans-32.fnt",
            "fonts/opensans-64.fnt",
            "fonts/opensans-128.fnt"
        ];
        //NOTE: Missing font textures, result in missing fonts

        length = fonts.length;
        for (i = 0; i < length; i += 1)
        {
            if (fontManager.isFontMissing(fonts[i]))
            {
                assetMissing = true;
                listOfMissingAssets.push(fonts[i]);
            }
        }

        return !assetMissing;
    },
    _warnAssets: function _warnAssetsFn(listOfMissingAssets)
    {
        var assetMissing = false;
        var i, length;

        var fonts = this.globals.fonts;
        var fontResources = [];
        var fontNames = {
            "opensans": true
        };
        var fontName;
        for (var f in fonts)
        {
            if (fonts.hasOwnProperty(f))
            {
                fontName = fonts[f];
                if (!fontNames[fontName])
                {
                    fontResources.push("fonts/" + fontName + "-8.fnt");
                    fontResources.push("fonts/" + fontName + "-16.fnt");
                    fontResources.push("fonts/" + fontName + "-32.fnt");
                    fontResources.push("fonts/" + fontName + "-64.fnt");
                    fontResources.push("fonts/" + fontName + "-128.fnt");
                    fontNames[fontName] = true;
                }
            }
        }

        //Fonts
        var fontManager = this.globals.fontManager;
        //NOTE: Missing font textures, result in missing fonts

        length = fontResources.length;
        for (i = 0; i < length; i += 1)
        {
            if (fontManager.isFontMissing(fontResources[i]))
            {
                assetMissing = true;
                listOfMissingAssets.push(fontResources[i]);
            }
        }

        return !assetMissing;
    }
};

Protolib.create = function protolibCreateFn(params)
{
    return new Protolib(params);
};

//Wrappers
function SoundWrapper(protolib, token, soundSourceManager, volume)
{
    this.protolib = protolib;
    this.soundSourceManager = soundSourceManager;
    this.mathDevice = protolib.globals.mathDevice;
    this.token = token;
    this.soundSource = soundSourceManager.getSoundSource(token);
    this.volume = volume;
    this.soundSource.gain = volume * protolib.globals.settings.volume;
    this.valid = true;
}

SoundWrapper.prototype =
{
    pause : function pauseFn()
    {
        this.soundSource.pause();
    },
    resume : function resumeFn()
    {
        this.soundSource.resume();
    },
    stop : function stopFn()
    {
        this.soundSource.stop();
        this.soundSourceManager.returnSoundSource(this.token);
    },
    getStatus : function getStatusFn()
    {
        if (this.soundSource)
        {
            if (this.soundSource.paused)
            {
                return this.protolib.soundStatus.PAUSED;
            }
            else if (!this.soundSource.paused && this.soundSource.playing)
            {
                return this.protolib.soundStatus.PLAYING;
            }
            else
            {
                return this.protolib.soundStatus.STOPPED;
            }
        }
        else
        {
            return this.protolib.soundStatus.STOPPED;
        }
    },
    getVolume : function getVolumeFn()
    {
        return this.volume;
    },
    setVolume : function setVolumeFn(volume)
    {
        this.volume = volume;
        this.soundSource.gain = volume * this.protolib.globals.settings.volume;
    },
    getPosition : function getPositionFn(v3Position)
    {
        this.mathDevice.v3Copy(this.soundSource.position, v3Position);
    },
    setPosition : function setPositionFn(v3Position)
    {
        this.soundSource.position = v3Position;
    },
    getPitch : function setPitchFn()
    {
        return this.soundSource.pitch;
    },
    setPitch : function setPitchFn(pitch)
    {
        this.soundSource.pitch = pitch;
    },
    setMinDistance : function setMinDistanceFn(minDistance)
    {
        this.soundSource.minDistance = minDistance;
    },
    getMinDistance : function getMinDistanceFn()
    {
        return this.soundSource.minDistance;
    },
    setMaxDistance : function setMaxDistanceFn(maxDistance)
    {
        this.soundSource.maxDistance = maxDistance;
    },
    getMaxDistance : function getMaxDistanceFn()
    {
        return this.soundSource.maxDistance;
    },
    setRollOff : function setRollOffFn(rollOff)
    {
        this.soundSource.rollOff = rollOff;
    },
    getRollOff : function getRollOffFn()
    {
        return this.soundSource.rollOff;
    }
};

function MeshWrapper(protolib, node)
{
    this.mathDevice = protolib.globals.mathDevice;
    this.v3Constants = protolib.v3Constants;

    var mathDevice = this.mathDevice;
    this.node = node;

    this.localTransform = mathDevice.m43BuildIdentity();
    this.rotationMatrix = mathDevice.m43BuildIdentity();
    this.scaleMatrix = mathDevice.m43BuildIdentity();
    this.v3Position = mathDevice.v3Build(0, 0, 0);
    this.v3Size = mathDevice.v3Build(0, 0, 0);
    this.valid = true;
}

MeshWrapper.prototype =
{
    update : function updateFn()
    {
        var v3Position = this.v3Position;
        var v3Size = this.v3Size;
        var localTransform = this.localTransform;
        var node = this.node;

        this._buildLocalTransform(v3Position, v3Size, localTransform);
        node.setLocalTransform(localTransform);
    },

    getPosition : function getPositionFn(v3Position)
    {
        var mathDevice = this.mathDevice;

        mathDevice.v3Copy(this.v3Position, v3Position);
    },
    setPosition : function setPositionFn(v3Position)
    {
        var mathDevice = this.mathDevice;
        mathDevice.v3Copy(v3Position, this.v3Position);

        this.update();
    },

    getSize : function getSizeFn(v3Size)
    {
        var mathDevice = this.mathDevice;

        mathDevice.v3Copy(this.v3Size, v3Size);
    },
    setSize : function setSizeFn(v3Size)
    {
        var mathDevice = this.mathDevice;
        mathDevice.v3Copy(v3Size, this.v3Size);

        this.update();
    },

    getEnabled : function getEnabledFn()
    {
        return !this.node.getDisabled();
    },
    setEnabled : function setEnabledFn(enabled)
    {
        this.node.enableHierarchy(enabled);
    },

    setRotationMatrix : function setRotationMatrixFn(rotationMatrix)
    {
        var mathDevice = this.mathDevice;
        mathDevice.m43Copy(rotationMatrix, this.rotationMatrix);
        this.update();
    },
    getRotationMatrix : function getRotationMatrixFn(rotationMatrix)
    {
        var mathDevice = this.mathDevice;
        mathDevice.m43Copy(this.rotationMatrix, rotationMatrix);
    },


    _buildLocalTransform : function _buildLocalTransformFn()
    {
        var mathDevice = this.mathDevice;
        var rotationMatrix = this.rotationMatrix;
        var scaleMatrix  = this.scaleMatrix;
        var v3Position = this.v3Position;
        var v3Size = this.v3Size;
        var localTransform = this.localTransform;

        mathDevice.m43BuildIdentity(scaleMatrix);
        mathDevice.m43Scale(scaleMatrix, v3Size, scaleMatrix);

        mathDevice.m43Mul(rotationMatrix, scaleMatrix, localTransform);

        mathDevice.m43SetPos(localTransform, v3Position);
    }
};

function PointLightWrapper(protolib, lightNode, light)
{
    this.mathDevice = protolib.globals.mathDevice;
    var mathDevice = this.mathDevice;
    this.v3Constants = protolib.v3Constants;

    this.lightNode = lightNode;
    this.light = light;
    this.localTransform = lightNode.getLocalTransform();
    this.v3Position = mathDevice.m43Pos(this.localTransform);
    this.valid = true;
}

PointLightWrapper.prototype =
{
    setPosition : function setPositionFn(v3Position)
    {
        var mathDevice = this.mathDevice;
        var lightNode = this.lightNode;
        var localTransform = this.localTransform;

        mathDevice.v3Copy(v3Position, this.v3Position);

        mathDevice.m43SetPos(localTransform, v3Position);
        lightNode.setLocalTransform(localTransform);
    },
    getPosition : function getPositionFn(v3Position)
    {
        var mathDevice = this.mathDevice;

        mathDevice.v3Copy(this.v3Position, v3Position);
    },
    setColor : function setColorFn(v3Color)
    {
        var mathDevice = this.mathDevice;
        var light = this.light;

        mathDevice.v3Copy(v3Color, light.color);
    },
    getColor : function getColorFn(v3Color)
    {
        var mathDevice = this.mathDevice;
        var light = this.light;

        mathDevice.v3Copy(light.color, v3Color);
    },

    getEnabled : function getEnabledFn()
    {
        return !this.lightNode.getDisabled();
    },
    setEnabled : function setEnabledFn(enabled)
    {
        this.lightNode.enableHierarchy(enabled);
    }

};

function SpotLightWrapper(protolib, lightNode, light)
{
    this.mathDevice = protolib.globals.mathDevice;
    var mathDevice = this.mathDevice;
    this.v3Constants = protolib.v3Constants;

    this.lightNode = lightNode;
    this.light = light;
    this.localTransform = lightNode.getLocalTransform();
    this.v3Direction = mathDevice.v3Build(0, 0, 0);
    this.v3Position = mathDevice.v3Build(0, 0, 0);
    this.valid = true;
}
SpotLightWrapper.prototype =
{
    getPosition : PointLightWrapper.prototype.getPosition,
    setPosition : PointLightWrapper.prototype.setPosition,
    getColor : PointLightWrapper.prototype.getColor,
    setColor : PointLightWrapper.prototype.setColor,
    getEnabled : PointLightWrapper.prototype.getEnabled,
    setEnabled : PointLightWrapper.prototype.setEnabled,
    setDirection : function setDirectionFn(v3Direction)
    {
        var mathDevice = this.mathDevice;
        var v3Constants = this.v3Constants;
        var v3Position = this.v3Position;
        var localTransform = this.localTransform;
        var lightNode = this.lightNode;

        mathDevice.v3Copy(v3Direction, this.v3Direction);

        var zaxis = mathDevice.v3ScalarMul(v3Direction, -1);
        mathDevice.v3Normalize(zaxis, zaxis);

        var up = v3Constants.unitY;
        if ((Math.abs(v3Direction[0]) < 0.000001) &&
            (Math.abs(v3Direction[2]) < 0.000001))
        {
            up = v3Constants.unitZ;
        }

        var xaxis = mathDevice.v3Cross(mathDevice.v3Normalize(up, up), zaxis);
        mathDevice.v3Normalize(xaxis, xaxis);
        var yaxis = mathDevice.v3Cross(zaxis, xaxis);
        mathDevice.m43Build(xaxis, yaxis, zaxis, v3Position, localTransform);
        lightNode.setLocalTransform(localTransform);
    },
    getDirection : function getDirectionFn(v3Direction)
    {
        var mathDevice = this.mathDevice;
        mathDevice.v3Copy(this.v3Direction, v3Direction);
    }
};

if (window.jQuery !== undefined && window.jQuery.extend !== undefined)
{
    Protolib.extend = jQuery.extend;
}
else
{
    try
    {
        Protolib.extend = jQueryExtend;
    }
    catch (e)
    {
        var console = window.console;
        if (console)
        {
            console.error("Error: jquery extend is missing. Have you included jqueryextend.js?");
        }
    }
}
