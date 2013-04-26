/*{# Copyright (c) 2010-2013 Turbulenz Limited #}*/

/*
 * @title: Sound
 * @description:
 * This sample shows how to load and play sounds from sources moving in a 3D environment.
 * You can enable and disable the movement of the different 3D sources to hear the spatial difference.
 * Sounds can also be played with reverb, echo and pitch filtering effects when supported.
*/

/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/floor.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/light.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/vmath.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/defaultrendering.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*{{ javascript("scripts/motion.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/
/*{{ javascript("scripts/sceneloader.js") }}*/

/*global TurbulenzEngine: true */

/*global Motion: false */
/*global window: false */
/*global RequestHandler: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Camera: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global Floor: false */
/*global HTMLControls: false */
/*global DefaultRendering: false */
/*global TurbulenzServices: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

    // Create the engine devices objects
    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    if (!graphicsDevice.shadingLanguageVersion)
    {
        errorCallback("No shading language support detected.\nPlease check your graphics drivers are up to date.");
        graphicsDevice = null;
        return;
    }

    // Clear the background color of the engine window
    var clearColor = [0.95, 0.95, 1.0, 1.0];
    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(clearColor);
        graphicsDevice.endFrame();
    }

    var mathDeviceParameters = { };
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var soundDeviceParameters = {
        linearDistance : false
    };
    var soundDevice = TurbulenzEngine.createSoundDevice(soundDeviceParameters);

    if (!soundDevice)
    {
        errorCallback("No SoundDevice detected.");
        return;
    }

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();
    var renderer;

    // Create world
    var worldUp = mathDevice.v3BuildYAxis();
    var floor = Floor.create(graphicsDevice, mathDevice);

    // Create moving objects
    var duck1 = Motion.create(mathDevice, "Duck01");
    duck1.setCircularMovement(9.0, [0, 0, 0]);
    duck1.setDuckMotion(0.1, 0.5, 0.3);

    var duck1OrientAngle = -90;
    duck1.setBaseOrientation(duck1OrientAngle);

    var duck2 = Motion.create(mathDevice, "Duck02");
    duck2.setCircularMovement(7.0, [0, 0, 0]);
    duck2.setDuckMotion(0.2, 0.5, 0.3);
    duck2.reverseDirection();

    var duck2OrientAngle = 90;
    duck2.setBaseOrientation(duck2OrientAngle);

    // Create fixed position for camera
    // The camera exists between the duck orbits. This is so the one duck passes in front and one behind.
    var cameraPosition = mathDevice.v3Build(0.0, 2.0, -8.0);
    var lookAtPosition = mathDevice.v3Build(0.0, 0.0, 100.0);

    // Create a sound source for each object (different pitch)
    var duck1SoundSource = soundDevice.createSource({
        position : duck1.position,
        relative : false,
        pitch : 1.0
    });

    var duck2SoundSource = soundDevice.createSource({
        position : duck2.position,
        relative : false,
        pitch : 1.5
    });

    // Set the interval between playing the sound (in seconds)
    // The ratio of the intervals is approximately 1:2
    // The slight variation is so the playing of the sounds don't coincide exactly
    var duck1SoundInterval = 1.1;
    var duck2SoundInterval = 1.9;

    // Accumulates the time elapsed before the next sound is due
    var duck1TimeElapsed = 0;
    var duck2TimeElapsed = 0;

    // Is the duck playing the sound
    var duck1PlaySound = true;
    var duck2PlaySound = true;

    // The sound to play
    var duck1QuackSound = null;
    var duck2QuackSound = null;

    // Sound Effects, Filters
    var reverbOn = false;
    var echoOn = false;
    var lowPassOn = false;

    // Create effects to apply to the source
    var reverb = soundDevice.createEffect({
        name : "DuckReverb",
        type : "Reverb",
        gain : 0.3
    });

    var echo = soundDevice.createEffect({
        name : "DuckEcho",
        type : "Echo",
        damping : 0.78,
        lrdelay : 0.24,
        delay : 0.17,
        gain : 0.3
    });

    var lowPassFilter = soundDevice.createFilter({
        name : "CutoffLowPass",
        type : "LowPass",
        gainHF : 0.05
    });

    var reverbSlot = soundDevice.createEffectSlot({
        effect : reverb,
        gain : 0.1
    });

    var echoSlot = soundDevice.createEffectSlot({
        effect : echo,
        gain : 0.1
    });

    // Create a basic camera
    var camera = Camera.create(mathDevice);
    camera.lookAt(lookAtPosition, worldUp, cameraPosition);
    camera.updateViewMatrix();

    var addCustomSceneData = function addCustomSceneDataFn(sceneData)
    {
        var addModel = function addModelFn(modelName, modelGeometry, modelMaterial, modelSurface, modelPosition)
        {
            var modelMatrix = [1, 0, 0,
                               0, 1, 0,
                               0, 0, 1,
                               modelPosition[0], modelPosition[1], modelPosition[2]];
            sceneData.nodes[modelName] =
            {
                geometryinstances : {
                    "default": {
                        geometry: modelGeometry,
                        surface : modelSurface,
                        material : modelMaterial,
                        render : true
                    }
                },
                matrix : modelMatrix,
                dynamic : true,
                disabled : false,
                visible : true
            };
        };

        // Removes the default duck node in the loaded scene
        delete sceneData.nodes.LOD3sp;

        addModel("Duck01", "LOD3spShape", "blinn3", "blinn3SG", duck1.position);
        addModel("Duck02", "LOD3spShape", "blinn3", "blinn3SG", duck2.position);
    };

    // Controls
    var htmlControls = HTMLControls.create();
    htmlControls.addCheckboxControl({
        id: "checkbox01",
        value: "duck1Move",
        isSelected: duck1.move,
        fn: function ()
        {
            duck1.move = !duck1.move;
            return duck1.move;
        }
    });
    htmlControls.addCheckboxControl({
        id: "checkbox02",
        value: "duck1PlaySound",
        isSelected: duck1PlaySound,
        fn: function ()
        {
            duck1PlaySound = !duck1PlaySound;
            return duck1PlaySound;
        }
    });
    htmlControls.addCheckboxControl({
        id: "checkbox03",
        value: "duck2Move",
        isSelected: duck2.move,
        fn: function ()
        {
            duck2.move = !duck2.move;
            return duck2.move;
        }
    });
    htmlControls.addCheckboxControl({
        id: "checkbox04",
        value: "duck2PlaySound",
        isSelected: duck2PlaySound,
        fn: function ()
        {
            duck2PlaySound = !duck2PlaySound;
            return duck2PlaySound;
        }
    });

    htmlControls.addCheckboxControl({
        id: "checkbox05",
        value: "reverbOn",
        isSelected: reverbOn,
        fn: function ()
        {
            if (reverb && reverbSlot)
            {
                if (reverbOn)
                {
                    // Set no effect slot and no filter on auxiliary send at index 0
                    reverbOn = !(duck1SoundSource.setAuxiliarySendFilter(0, null, null) &&
                                 duck2SoundSource.setAuxiliarySendFilter(0, null, null));
                }
                else
                {
                    // Set the reverb effect slot on auxiliary send at index 0, no filter
                    reverbOn = (duck1SoundSource.setAuxiliarySendFilter(0, reverbSlot, null) &&
                                duck2SoundSource.setAuxiliarySendFilter(0, reverbSlot, null));
                }
            }
            return reverbOn;
        }
    });
    htmlControls.addCheckboxControl({
        id: "checkbox06",
        value: "echoOn",
        isSelected: echoOn,
        fn: function ()
        {
            if (echo && echoSlot)
            {
                if (echoOn)
                {
                    // Set no effect slot and no filter on auxiliary send at index 1
                    echoOn = !(duck1SoundSource.setAuxiliarySendFilter(1, null, null) &&
                               duck2SoundSource.setAuxiliarySendFilter(1, null, null));
                }
                else
                {
                    // Set the reverb effect slot on auxiliary send at index 1, no filter
                    echoOn = (duck1SoundSource.setAuxiliarySendFilter(1, echoSlot, null) &&
                              duck2SoundSource.setAuxiliarySendFilter(1, echoSlot, null));
                }
            }
            return echoOn;
        }
    });
    htmlControls.addCheckboxControl({
        id: "checkbox07",
        value: "lowPassOn",
        isSelected: lowPassOn,
        fn: function ()
        {
            if (lowPassFilter)
            {
                if (lowPassOn)
                {
                    // Set filter on direct output only
                    lowPassOn = !(duck1SoundSource.setDirectFilter(null) &&
                                  duck2SoundSource.setDirectFilter(null));
                }
                else
                {
                    // Set no filter on direct output only
                    lowPassOn = (duck1SoundSource.setDirectFilter(lowPassFilter) &&
                                 duck2SoundSource.setDirectFilter(lowPassFilter));
                }
            }
            return lowPassOn;
        }
    });

    var slider01ID = "slider1";
    var initialGain = soundDevice.listenerGain;
    htmlControls.addSliderControl({
        id: slider01ID,
        value: initialGain,
        max: 1.0,
        min: 0,
        step: 0.05,
        fn: function ()
        {
            var val = this.value;
            soundDevice.listenerGain = val;
            htmlControls.updateSlider(slider01ID, val);
        }
    });

    htmlControls.addButtonControl({
        id: "button01",
        value: "Duck 1",
        fn: function ()
        {
            duck1.reverseDirection();
            duck1OrientAngle = -duck1OrientAngle;
            duck1.setBaseOrientation(duck1OrientAngle);
        }
    });
    htmlControls.addButtonControl({
        id: "button02",
        value: "Duck 2",
        fn: function ()
        {
            duck2.reverseDirection();
            duck2OrientAngle = -duck2OrientAngle;
            duck2.setBaseOrientation(duck2OrientAngle);
        }
    });
    htmlControls.register();

    var reverbButton = document.getElementById("checkbox05");
    if (reverbButton)
    {
        reverbButton.disabled = !(reverb && reverbSlot);
    }

    var echoButton = document.getElementById("checkbox06");
    if (echoButton)
    {
        echoButton.disabled = !(echo && echoSlot);
    }

    var lowpassButton = document.getElementById("checkbox07");
    if (lowpassButton)
    {
        lowpassButton.disabled = !(lowPassFilter);
    }

    // Update listener position to match camera
    // This must occur everytime the listener moves
    soundDevice.listenerTransform = camera.matrix;

    // Initialize the previous frame time
    var previousFrameTime = TurbulenzEngine.time;
    var intervalID;

    var playSounds = function playSoundsFn(delta)
    {
        if (duck1PlaySound)
        {
            duck1TimeElapsed += delta;
            if (duck1TimeElapsed > duck1SoundInterval)
            {
                // Play quack sound
                duck1SoundSource.play(duck1QuackSound);
                duck1TimeElapsed -= duck1SoundInterval;
            }
        }

        if (duck2PlaySound)
        {
            duck2TimeElapsed += delta;
            if (duck2TimeElapsed > duck2SoundInterval)
            {
                // Play quack sound
                duck2SoundSource.play(duck2QuackSound);
                duck2TimeElapsed -= duck2SoundInterval;
            }
        }
    };

    // Callback to draw extra debug information
    function drawDebugCB()
    {
        floor.render(graphicsDevice, camera);
    }

    //
    // Update
    //
    var update = function updateFn()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }

        // Update the aspect ratio of the camera in case of window resizes
        var deviceWidth = graphicsDevice.width;
        var deviceHeight = graphicsDevice.height;
        var aspectRatio = (deviceWidth / deviceHeight);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        // Update duck movement and rotation
        duck1.update(deltaTime);
        duck2.update(deltaTime);

        // Update sound source position
        duck1SoundSource.position = duck1.position;
        duck2SoundSource.position = duck2.position;

        // Play sound if interval has elapsed
        playSounds(deltaTime);

        // Update duck1 position in scene
        var duck1Node = scene.findNode("Duck01");
        if (duck1Node)
        {
            duck1Node.setLocalTransform(duck1.matrix);
        }

        // Update duck2 position in scene
        var duck2Node = scene.findNode("Duck02");
        if (duck2Node)
        {
            duck2Node.setLocalTransform(duck2.matrix);
        }

        // Update scene
        scene.update();

        // Update renderer
        renderer.update(graphicsDevice, camera, scene, currentTime);

        soundDevice.update();

        // Render frame
        if (graphicsDevice.beginFrame())
        {
            if (renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight))
            {
                renderer.draw(graphicsDevice, clearColor, null, null, drawDebugCB);
            }

            graphicsDevice.endFrame();
        }

        previousFrameTime = currentTime;
    };

    var loadingLoop = function loadingLoopFn()
    {
        if (sceneLoader.complete() && duck1QuackSound && duck2QuackSound)
        {
            TurbulenzEngine.clearInterval(intervalID);

            renderer.updateShader(shaderManager);

            intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

    var loadAssets = function loadAssetsFn(mappingTable)
    {
        // Create the sound for the source to emit
        var soundURL;
        if (soundDevice.isSupported("FILEFORMAT_OGG"))
        {
            soundURL = mappingTable.getURL("sounds/duck.ogg");
        }
        else
        {
            soundURL = mappingTable.getURL("sounds/duck.mp3");
        }

        soundDevice.createSound({
            src: soundURL,
            onload : function (sound)
                {
                    if (sound)
                    {
                        duck1QuackSound = sound;
                        duck2QuackSound = sound;
                    }
                    else
                    {
                        errorCallback('Failed to load sound.');
                    }
                }
        });

        // Renderer for the scene (requires shader assets).
        renderer = DefaultRendering.create(graphicsDevice,
                                           mathDevice,
                                           shaderManager,
                                           effectManager);

        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));
        renderer.setDefaultTexture(textureManager.get("default"));

        // Create & load duck scene
        sceneLoader.load({  scene : scene,
                            append : true,
                            assetPath : "models/duck.dae",
                            keepLights : true,
                            baseScene : null,
                            baseMatrix : null,
                            skin : null,
                            graphicsDevice : graphicsDevice,
                            mathDevice : mathDevice,
                            textureManager : textureManager,
                            shaderManager : shaderManager,
                            effectManager : effectManager,
                            requestHandler : requestHandler,
                            preSceneLoadFn : addCustomSceneData
                        });
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

        loadAssets(mappingTable);
    };

    var gameSessionCreated = function gameSessionCreatedFn(gameSession)
    {
        TurbulenzServices.createMappingTable(requestHandler,
                                             gameSession,
                                             mappingTableReceived);
    };
    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        TurbulenzEngine.clearInterval(intervalID);

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        clearColor = null;
        worldUp = null;
        floor = null;

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        reverb = null;
        echo = null;
        lowPassFilter = null;
        reverbSlot = null;
        echoSlot = null;

        duck1 = null;
        duck2 = null;

        if (duck1SoundSource)
        {
            duck1SoundSource.setDirectFilter(null);
            duck1SoundSource.setAuxiliarySendFilter(0, null, null);
            duck1SoundSource.setAuxiliarySendFilter(1, null, null);
            duck1SoundSource.destroy();
            duck1SoundSource = null;
        }
        if (duck2SoundSource)
        {
            duck2SoundSource.setDirectFilter(null);
            duck2SoundSource.setAuxiliarySendFilter(0, null, null);
            duck2SoundSource.setAuxiliarySendFilter(1, null, null);
            duck2SoundSource.destroy();
            duck2SoundSource = null;
        }
        if (duck1QuackSound)
        {
            duck1QuackSound.destroy();
            duck1QuackSound = null;
        }
        if (duck2QuackSound)
        {
            duck2QuackSound.destroy();
            duck2QuackSound = null;
        }

        if (scene)
        {
            scene.destroy();
            scene = null;
        }
        requestHandler = null;
        sceneLoader = null;
        camera = null;

        if (textureManager)
        {
            textureManager.destroy();
            textureManager = null;
        }

        if (shaderManager)
        {
            shaderManager.destroy();
            shaderManager = null;
        }

        effectManager = null;

        TurbulenzEngine.flush();
        graphicsDevice = null;
        mathDevice = null;
        soundDevice = null;
    };
};
