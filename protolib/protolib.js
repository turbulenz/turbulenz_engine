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

function Protolib(params)
{
    var protolib = this;
    this.globals = {};
    var globals = this.globals;

    params = params || {};

    var MAX_SOUND_SOURCES = params.maxSoundSources !== undefined ? params.maxSoundSources : 50;
    this.MAX_SOUND_SOURCES = MAX_SOUND_SOURCES;

    var USE_SHADOWS = params.useShadows !== undefined ? params.useShadows : true;
    this.USE_SHADOWS = USE_SHADOWS;

    var INITIALIZED_CALLBACK = params.onInitialized;
    this.INITIALIZED_CALLBACK = INITIALIZED_CALLBACK;

    //Utils
    this.utils = {
        clamp : function clampFn(value, min, max)
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
        }
    };

    //Devices
    var gd = TurbulenzEngine.createGraphicsDevice({});
    if (!gd)
    {
        gd = TurbulenzEngine.getGraphicsDevice();
    }
    globals.graphicsDevice = gd;

    var md = TurbulenzEngine.createMathDevice({});
    if (!md)
    {
        md = TurbulenzEngine.getMathDevice();
    }
    globals.mathDevice = md;

    var id = TurbulenzEngine.createInputDevice({});
    if (!id)
    {
        id = TurbulenzEngine.getInputDevice();
    }
    globals.inputDevice = id;

    var sd = params.disableSound ? null: TurbulenzEngine.createSoundDevice({});
    if (!sd && !params.disableSound)
    {
        sd = TurbulenzEngine.getSoundDevice();
    }
    globals.soundDevice = sd;

    //Managers & RequestHandler
    var errorCallback = function errorCallbackFn(msg)
    {
        window.console.error("Error: ", msg);
    };

    TurbulenzEngine.onerror = errorCallback;

    var requestHandler = RequestHandler.create({});
    globals.requestHandler = requestHandler;

    var tm = TextureManager.create(gd, requestHandler, null, errorCallback);
    globals.textureManager = tm;

    var sm = ShaderManager.create(gd, requestHandler, null, errorCallback);
    globals.shaderManager = sm;

    var fm = FontManager.create(gd, requestHandler);
    globals.fontManager = fm;

    var em = EffectManager.create();
    globals.effectManager = em;

    var soundm = sd ? SoundManager.create(sd, requestHandler, null, errorCallback): null;
    globals.soundManager = soundm;

    globals.soundSourceManager = SoundSourceManager.create(sd, MAX_SOUND_SOURCES);

    this.soundWrappers = [];

    //Dynamic UI
    var dynamicUI = params.enableDynamicUI ? DynamicUIManager.create() : null;
    globals.dynamicUI = dynamicUI;

    this.watch = {
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
        assetPrefix: 'missing',
        mappingTableURL: 'mapping_table.json',
        urnMapping: {}
    }, params.defaultMappingSettings);

    //Camera
    var camera = Camera.create(md);
    globals.camera = camera;
    camera.farPlane = 3000;
    camera.updateProjectionMatrix();
    camera.updateViewProjectionMatrix();

    //v3 constants
    this.v3Constants = {};
    var v3Constants = this.v3Constants;
    v3Constants.unitX  = md.v3Build(1, 0, 0);
    v3Constants.unitY  = md.v3Build(0, 1, 0);
    v3Constants.unitZ  = md.v3Build(0, 0, 1);
    v3Constants.origin = md.v3Build(0, 0, 0);

    v3Constants.red   = v3Constants.unitX;
    v3Constants.green = v3Constants.unitY;
    v3Constants.blue  = v3Constants.unitZ;
    v3Constants.black = v3Constants.origin;
    v3Constants.white = md.v3Build(1, 1, 1);

    //Setup Lights.
    var scene = Scene.create(md);
    globals.scene = scene;

    var light = Light.create({
            name : "protoAmbientLight",
            ambient: true,
            color: md.v3Build(0.2, 0.2, 0.2)
        });
    scene.addLight(light);

    this.clearColor = md.v4Build(1, 1, 1, 1);

    this._numPointLights = 0;
    this._numSpotLights  = 0;

    //Utils
    var simplesprite = SimpleSprite.create(globals);
    globals.simplesprite = simplesprite;

    var simplesceneloader = SimpleSceneLoader.create(globals);
    globals.simplesceneloader = simplesceneloader;

    //Fonts
    var fonts = params.fonts || {
        regular: "opensans"
    };
    globals.fonts = fonts;

    var simplefont = SimpleFontRenderer.create(globals);
    globals.simplefont = simplefont;

    var debugdraw = DebugDraw.createFromGlobals(globals);
    globals.debugdraw = debugdraw;

    var draw2D = Draw2D.create({
            graphicsDevice: gd
        });
    globals.draw2D = draw2D;

    // Create a dummy renderer
    var renderer = {
        update: function dummyUpdateFn() {},
        draw: function dummyDrawFn() {}
    };
    globals.renderer = renderer;

    //After mapping table has loaded, load forwardrendering's shaders, and the default light material.
    //After the shaders have loaded, call onInitializedCallback.
    var postMappingTableRecieved = function postMappingTableRecievedFn()
    {
        globals.mappingTable = mappingTable;

        debugdraw.preload();

        simplefont.preload();

        var rendererOptions = {
            shadowRendering: protolib.USE_SHADOWS
        };
        var renderer = ForwardRendering.create(gd, md, sm, em, rendererOptions);
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

        scene.loadMaterial(gd, tm, em, "defaultLightMaterial", lightMaterialData);
        protolib.defaultLightMaterial = scene.getMaterial("defaultLightMaterial");

        var intervalId;
        var waitForForwardRenderingShaders = function waitForForwardRenderingShadersFn()
        {
            if (sm.getNumPendingShaders() === 0)
            {
                TurbulenzEngine.clearInterval(intervalId);
                renderer.updateBuffers(gd, gd.width, gd.height);
                renderer.updateShader(sm);

                protolib.beginFrame = Protolib.prototype.beginFrame;
                protolib.endFrame = Protolib.prototype.endFrame;

                if (INITIALIZED_CALLBACK)
                {
                    INITIALIZED_CALLBACK(protolib);
                }
            }
        };
        intervalId = TurbulenzEngine.setInterval(waitForForwardRenderingShaders, 1000 / 10);
    };

    var mappingTableRecieved = function mappingTableRecievedFn(mappingTable)
    {
        if (mappingTable)
        {
            tm.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            sm.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            fm.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

            if (soundm)
            {
                soundm.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            }
            simplesceneloader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        }

        postMappingTableRecieved();
    };
    var mappingTableError = function mappingTableErrorFn(msg)
    {
        errorCallback(msg);
        mappingTableRecieved(mappingTable);
    };

    var gamesessionRecieved = function gamesessionRecievedFn(gamesession)
    {
        protolib.gameSession = gamesession;

        mappingTable = TurbulenzServices.createMappingTable(
            requestHandler,
            gamesession,
            mappingTableRecieved,
            mappingTableSettings,
            mappingTableError
        );
    };

    TurbulenzServices.createGameSession(requestHandler, gamesessionRecieved);

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
    this.textAlignment = {
        LEFT: 'left',
        CENTER: 'center',
        RIGHT: 'right'
    };
    this.blendStyle = {
        ALPHA : 'alpha',
        ADDITIVE : 'additive'
    };
    this.keyCodes = id.keyCodes;
    this.mouseCodes = id.mouseCodes;

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
        id.addEventListener('keydown', onKeyDown);
        id.addEventListener('keyup', onKeyUp);

        //Mouse event listeners
        id.addEventListener('mouseup', onMouseUp);
        id.addEventListener('mousedown', onMouseDown);
        id.addEventListener('mouseover', onMouseOver);
        id.addEventListener('mousemove', onMouseMove);
        id.addEventListener('mouseenter', onMouseEnter);
        id.addEventListener('mouseleave', onMouseLeave);
        id.addEventListener('mousewheel', onMouseWheel);
    };

    this.unregisterListeners = function unregisterListenersFn()
    {
        var id = this.globals.inputDevice;
        if (id)
        {
            //Keyboard event listeners
            id.removeEventListener('keydown', onKeyDown);
            id.removeEventListener('keyup', onKeyUp);

            //Mouse event listeners
            id.removeEventListener('mouseup', onMouseUp);
            id.removeEventListener('mousedown', onMouseDown);
            id.removeEventListener('mouseover', onMouseOver);
            id.removeEventListener('mousemove', onMouseMove);
            id.removeEventListener('mouseenter', onMouseEnter);
            id.removeEventListener('mouseleave', onMouseLeave);
            id.removeEventListener('mousewheel', onMouseWheel);
        }
    };

    this.beginFrame = function dummyBeginFrameFn() { return false; };
    this.endFrame = function dummyEndFrameFn() {};

    this.registerListeners();
}

Protolib.prototype =
{
    destroy: function destroyFn()
    {
        this.unregisterListeners();
    },

    //Devices
    getMathDevice : function getMathDeviceFn()
    {
        return this.globals.mathDevice;
    },
    getInputDevice : function getMathDeviceFn()
    {
        return this.globals.inputDevice;
    },
    getSoundDevice : function getMathDeviceFn()
    {
        return this.globals.soundDevice;
    },
    getGraphicsDevice : function getMathDeviceFn()
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
    update : function updateFn()
    {
        //TODO: Add input processing and sound processing
        this._updateSounds();
    },
    beginFrame : function beginFrameFn()
    {
        var globals = this.globals;
        var gd = globals.graphicsDevice;
        var gd_begin = gd.beginFrame();

        this.width = gd.width;
        this.height = gd.height;

        return gd_begin;
    },
    endFrame : function endFrameFn()
    {
        var globals = this.globals;

        var simplesprite = globals.simplesprite;
        var simplefont = globals.simplefont;
        var debugdraw = globals.debugdraw;
        var gd = globals.graphicsDevice;
        var id = globals.inputDevice;
        var sd = globals.soundDevice;
        var camera = globals.camera;
        var scene = globals.scene;
        var renderer = globals.renderer;
        var soundSourceManager = globals.soundSourceManager;

        var clear = this.clearColor;

        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
        scene.update();

        renderer.update(gd, camera, scene, TurbulenzEngine.time);
        renderer.draw(gd, clear, this.preDrawFn);

        simplesprite.drawSprites();
        simplefont.render();
        debugdraw.drawDebugLines();
        this._draw2DSprites();

        this.keysJustPressed = {};
        this.keysJustReleased = {};
        this.mouseBtnsJustPressed = {};
        this.mouseBtnsJustReleased = {};
        this.prevMousePosition[0] = this.mousePosition[0];
        this.prevMousePosition[1] = this.mousePosition[1];
        this.mouseDelta[0] = 0;
        this.mouseDelta[1] = 0;
        this.mouseWheelDelta = 0;
        id.update();

        soundSourceManager.checkFreeSoundSources();
        if (sd)
        {
            sd.update();
            sd.listenerTransform = camera.matrix;
        }

        return gd.endFrame();
    },
    setPreDraw : function setPreDrawFn(callbackFn)
    {
        this.preDrawFn = callbackFn;
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
        var md = globals.mathDevice;

        md.m43SetPos(camera.matrix, v3Position);
        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
    },
    getCameraPosition : function getCameraPositionFn(v3Position)
    {
        var globals = this.globals;
        var camera = globals.camera;
        var md = globals.mathDevice;
        md.m43Pos(camera.matrix, v3Position);
    },
    setCameraDirection : function setCameraDirectionFn(v3Direction)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var md = globals.mathDevice;
        var camera = globals.camera;
        var cameraPosition = md.m43Pos(camera.matrix);
        var cameraDirection = v3Direction;
        var cameraFocus = md.v3Add(cameraPosition, cameraDirection);

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
        var md = globals.mathDevice;
        var camera = globals.camera;

        md.v3ScalarMul(md.m43At(camera.matrix), -1, v3Direction);
    },
    getCameraUp : function getCameraDirectionFn(v3Up)
    {
        var globals = this.globals;
        var md = globals.mathDevice;
        var camera = globals.camera;

        md.m43Up(camera.matrix, v3Up);
    },
    getCameraRight : function getCameraDirectionFn(v3Right)
    {
        var globals = this.globals;
        var md = globals.mathDevice;
        var camera = globals.camera;

        md.m43Right(camera.matrix, v3Right);
    },
    moveCamera : function moveCameraFn(v3Direction)
    {
        var globals = this.globals;
        var camera = globals.camera;
        var md = globals.mathDevice;

        var cameraMatrix = camera.matrix;
        var pos = md.m43Pos(cameraMatrix);

        var right   = v3Direction[0];
        var up      = v3Direction[1];
        var forward = v3Direction[2];

        md.v3Add4(pos,
                md.v3ScalarMul(md.m43Right(cameraMatrix), right),
                md.v3ScalarMul(md.m43Up(cameraMatrix),    up),
                md.v3ScalarMul(md.m43At(cameraMatrix),   -forward),
                pos);
        md.m43SetPos(cameraMatrix, pos);
        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
    },
    rotateCamera : function rotateCameraFn(yawDelta, pitchDelta)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var md = globals.mathDevice;
        var camera = globals.camera;
        var cameraMatrix = camera.matrix;
        var cameraPos = md.m43Pos(cameraMatrix);

        md.m43SetPos(cameraMatrix, md.v3BuildZero());

        var rotate;
        if (pitchDelta !== 0)
        {
            var right = md.v3Normalize(md.m43Right(cameraMatrix));
            md.m43SetRight(cameraMatrix, right);

            rotate = md.m43FromAxisRotation(right, pitchDelta);

            md.m43Mul(cameraMatrix, rotate, cameraMatrix);
        }
        if (yawDelta !== 0)
        {
            rotate = md.m43FromAxisRotation(v3Constants.unitY, yawDelta);

            md.m43Mul(cameraMatrix, rotate, cameraMatrix);
        }
        md.m43SetPos(cameraMatrix, cameraPos);

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
        var md = globals.mathDevice;
        var tm = globals.textureManager;

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

        var v4Color = md.v4Build(v3Color[0], v3Color[1], v3Color[2], alpha);
        var draw2DBlendStyle = this.toDraw2DBlendStyle[blendStyle];

        this.draw2DCache[draw2DBlendStyle].push({
            texture: tm.load(texture),
            destinationRectangle: [x, y, x + width, y + height],
            sourceRectangle: sourceRectangle ? md.v4Copy(sourceRectangle): undefined,
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
            alignment : alignment,
            fontStyle : fontStyle
        };

        simplefont.drawFont(text, fontParams);
    },

    //3D
    draw3DSprite : function addSpriteFn(params)
    {
        var globals = this.globals;
        var v3Constants = this.v3Constants;
        var md = globals.mathDevice;
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
            v4color : md.v4Build(v3Color[0], v3Color[1], v3Color[2], alpha),
            texture : texture,
            size : size,
            angle: rotation,
            blendStyle : this.toSimpleSpriteBlendStyle[blendStyle]
        };

        simplesprite.addSprite(spriteParams);
    },
    loadMesh : function addMeshFn(params)
    {
        var protolib = this;
        var globals = this.globals;
        var simplesceneloader = globals.simplesceneloader;

        var md = globals.mathDevice;
        var v3Position = params.v3Position || md.v3BuildZero();
        var v3Size = params.v3Size || md.v3Build(1, 1, 1);
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
        var md = globals.mathDevice;

        var ambientLight = scene.getLight("protoAmbientLight");
        md.v3Copy(v3Color, ambientLight.color);
    },
    getAmbientLightColor : function getAmbientLightColorFn(v3Color)
    {
        var globals = this.globals;
        var scene = globals.scene;
        var md = globals.mathDevice;

        var ambientLight = scene.getLight("protoAmbientLight");
        md.v3Copy(ambientLight.color, v3Color);
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
    _addLight : function addLightFn(md, scene, name, light)
    {
        var lightNode = SceneNode.create({
                name: name + "_scenenode",
                local: md.m43BuildIdentity(),
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
        var md = globals.mathDevice;

        var v3Color = params.v3Color;
        var radius = params.radius;
        var v3Position = params.v3Position;

        var lightMaterial = this.defaultLightMaterial;

        var name = "pointlight" + this._genPointLightId();

        var light = Light.create({
                name : name,
                point : true,
                color : md.v3Copy(v3Color),
                shadows : true,
                halfExtents : md.v3Build(radius, radius, radius),
                origin : md.v3Build(0, 0, 0),
                material : lightMaterial
            });

        var lightNode = this._addLight(md, scene, name, light);

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
        var md = globals.mathDevice;

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
                color : md.v3Copy(v3Color),
                spot : true,
                shadows : true,
                material : lightMaterial,
                origin : v3Constants.origin,
                start : v3Constants.origin,
                target : md.v3Build(0, 0, -range),
                up : md.v3Build(0, radius, 0),
                right : md.v3Build(radius, 0, 0)
            });

        var lightNode = this._addLight(md, scene, name, light);

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
        var md = globals.mathDevice;
        var soundm = globals.soundManager;
        var soundSourceManager = globals.soundSourceManager;

        if (!soundm)
        {
            // Sounds are disabled
            window.console.error("Cannot play the sound, sound is not available.");
            return null;
        }

        var soundPath = params.sound;
        var volume = (params.volume !== undefined) ? params.volume:  1.0;
        var pitch = params.pitch || 1.0;
        var looping = params.looping || false;
        var position = params.v3Position || v3Constants.origin;
        var minDistance = params.minDistance || 1;
        var maxDistance = params.maxDistance || Infinity;
        var rollOff = params.rollOff || 1;
        var background = params.background || false;

        var soundWrapper = null;
        var soundSource = null;

        var wrapperInvalidatedFn = function soundInvalidFn()
        {
            window.console.error("Cannot modify the sound, as it has stopped playing.");
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
            window.console.error("Cannot play " + soundPath + ". Too many sounds playing.");
            return null;
        }

        soundSource = soundSourceManager.getSoundSource(token);
        soundSource.pitch = pitch;
        soundSource.looping = looping;
        soundSource.position = md.v3Build(position[0], position[1], position[2]);
        soundSource.minDistance = minDistance;
        soundSource.maxDistance = maxDistance;
        soundSource.rollOff = rollOff;
        soundSource.relative = background;
        soundWrapper = new SoundWrapper(protolib, token, soundSourceManager, volume);

        soundSourceManager.setSoundSourceLoading(token, true);
        soundm.load(soundPath, null, function (sound) {
                if (soundSource)
                {
                    soundSource.play(sound);
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
    this.soundSource.relative = false;
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

    var md = this.mathDevice;
    this.node = node;

    this.localTransform = md.m43BuildIdentity();
    this.rotationMatrix = md.m43BuildIdentity();
    this.scaleMatrix = md.m43BuildIdentity();
    this.v3Position = md.v3Build(0, 0, 0);
    this.v3Size = md.v3Build(0, 0, 0);
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
        var md = this.mathDevice;

        md.v3Copy(this.v3Position, v3Position);
    },
    setPosition : function setPositionFn(v3Position)
    {
        var md = this.mathDevice;
        md.v3Copy(v3Position, this.v3Position);

        this.update();
    },

    getSize : function getSizeFn(v3Size)
    {
        var md = this.mathDevice;

        md.v3Copy(this.v3Size, v3Size);
    },
    setSize : function setSizeFn(v3Size)
    {
        var md = this.mathDevice;
        md.v3Copy(v3Size, this.v3Size);

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
        var md = this.mathDevice;
        md.m43Copy(rotationMatrix, this.rotationMatrix);
        this.update();
    },
    getRotationMatrix : function getRotationMatrixFn(rotationMatrix)
    {
        var md = this.mathDevice;
        md.m43Copy(this.rotationMatrix, rotationMatrix);
    },


    _buildLocalTransform : function _buildLocalTransformFn()
    {
        var md = this.mathDevice;
        var rotationMatrix = this.rotationMatrix;
        var scaleMatrix  = this.scaleMatrix;
        var v3Position = this.v3Position;
        var v3Size = this.v3Size;
        var localTransform = this.localTransform;

        md.m43BuildIdentity(scaleMatrix);
        md.m43Scale(scaleMatrix, v3Size, scaleMatrix);

        md.m43Mul(rotationMatrix, scaleMatrix, localTransform);

        md.m43SetPos(localTransform, v3Position);
    }
};

function PointLightWrapper(protolib, lightNode, light)
{
    this.mathDevice = protolib.globals.mathDevice;
    var md = this.mathDevice;
    this.v3Constants = protolib.v3Constants;

    this.lightNode = lightNode;
    this.light = light;
    this.localTransform = lightNode.getLocalTransform();
    this.v3Position = md.m43Pos(this.localTransform);
    this.valid = true;
}

PointLightWrapper.prototype =
{
    setPosition : function setPositionFn(v3Position)
    {
        var md = this.mathDevice;
        var lightNode = this.lightNode;
        var localTransform = this.localTransform;

        md.v3Copy(v3Position, this.v3Position);

        md.m43SetPos(localTransform, v3Position);
        lightNode.setLocalTransform(localTransform);
    },
    getPosition : function getPositionFn(v3Position)
    {
        var md = this.mathDevice;

        md.v3Copy(this.v3Position, v3Position);
    },
    setColor : function setColorFn(v3Color)
    {
        var md = this.mathDevice;
        var light = this.light;

        md.v3Copy(v3Color, light.color);
    },
    getColor : function getColorFn(v3Color)
    {
        var md = this.mathDevice;
        var light = this.light;

        md.v3Copy(light.color, v3Color);
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
    var md = this.mathDevice;
    this.v3Constants = protolib.v3Constants;

    this.lightNode = lightNode;
    this.light = light;
    this.localTransform = lightNode.getLocalTransform();
    this.v3Direction = md.v3Build(0, 0, 0);
    this.v3Position = md.v3Build(0, 0, 0);
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
        var md = this.mathDevice;
        var v3Constants = this.v3Constants;
        var v3Position = this.v3Position;
        var localTransform = this.localTransform;
        var lightNode = this.lightNode;

        md.v3Copy(v3Direction, this.v3Direction);

        var zaxis = md.v3ScalarMul(v3Direction, -1);
        md.v3Normalize(zaxis, zaxis);

        var up = v3Constants.unitY;
        if ((Math.abs(v3Direction[0]) < 0.000001) &&
            (Math.abs(v3Direction[2]) < 0.000001))
        {
            up = v3Constants.unitZ;
        }

        var xaxis = md.v3Cross(md.v3Normalize(up, up), zaxis);
        md.v3Normalize(xaxis, xaxis);
        var yaxis = md.v3Cross(zaxis, xaxis);
        md.m43Build(xaxis, yaxis, zaxis, v3Position, localTransform);
        lightNode.setLocalTransform(localTransform);
    },
    getDirection : function getDirectionFn(v3Direction)
    {
        var md = this.mathDevice;
        md.v3Copy(this.v3Direction, v3Direction);
    }
};

(function (window, undefined) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
    var
    //core_version = "1.9.1",

    class2type = {},

    core_toString = class2type.toString,
    core_hasOwn = class2type.hasOwnProperty,

    jQuery = {

        // Modified jQuery required for extend function

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function (obj) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === "array";
        },

        isWindow: function (obj) {
            return obj !== null && obj === obj.window;
        },

        isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },

        type: function (obj) {
            if (obj === null) {
                return String(obj);
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[core_toString.call(obj)] || "object" :
                typeof obj;
        },

        isPlainObject: function (obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if (obj.constructor &&
                    !core_hasOwn.call(obj, "constructor") &&
                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for (key in obj) {}

            return key === undefined || core_hasOwn.call(obj, key);
        },

        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        }
    };


    Protolib.extend = jQuery.extend = function extendFn() {

        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            i -= 1;
        }

        for (; i < length; i += 1) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) !== null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                    // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

})(window);
