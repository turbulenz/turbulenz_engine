/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Deferred rendering
 * @description:
 * This sample shows a scene with dynamic shadows cast by point or spot lights rendered using the Turbulenz deferred renderer.
 * You can enable multiple colored lights to see the impact on performance.
 * You can also see each of the intermediate render buffers created during the render.
*/

/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/light.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/deferredrendering.js") }}*/
/*{{ javascript("jslib/shadowmapping.js") }}*/
/*{{ javascript("jslib/posteffects.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*{{ javascript("scripts/sceneloader.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global PostEffects: false */
/*global DeferredRendering: false */
/*global TurbulenzServices: false */
/*global Camera: false */
/*global CameraController: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global RequestHandler: false */
/*global Scene: false */
/*global SceneNode: false */
/*global SceneLoader: false */
/*global LightInstance: false */
/*global Light: false */
/*global HTMLControls: false */
/*global window: false */

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
    var clearColor = [0.5, 0.5, 0.5, 1.0];
    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(clearColor);
        graphicsDevice.endFrame();
    }

    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var inputDeviceParameters = { };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    // Create a camera with a 60 degree FOV
    var camera = Camera.create(mathDevice);
    var halfFov = Math.tan(30 * Math.PI / 180);
    camera.recipViewWindowX = 1.0 / halfFov;
    camera.recipViewWindowY = 1.0 / halfFov;
    camera.updateProjectionMatrix();
    var worldUp = mathDevice.v3BuildYAxis();
    camera.lookAt(worldUp, worldUp, mathDevice.v3Build(0.0, 50.0, 200.0));
    camera.updateViewMatrix();

    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();

    var maxSpeed = cameraController.maxSpeed;

    var postEffects;
    var renderer;

    function destroyScenePostRenderer()
    {
        postEffects = null;
        sceneLoader = null;
        requestHandler = null;

        if (scene)
        {
            scene.destroy();
            scene = null;
        }

        effectManager = null;

        if (shaderManager)
        {
            shaderManager.destroy();
            shaderManager = null;
        }

        if (textureManager)
        {
            textureManager.destroy();
            textureManager = null;
        }

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        cameraController = null;
        camera = null;

        TurbulenzEngine.flush();

        inputDevice = null;
        graphicsDevice = null;
        mathDevice = null;
    }

    // Create some rendering callbacks to pass to the deffered rendering renderer
    function drawExtraDecalsFn()
    {
    }

    function drawExtraTransparentFn()
    {
    }

    function drawDebugFn()
    {
    }

    // Setup a list of deferred buffers we can display
    var outputTextureNames = [
        null,
        "albedoTexture",
        "normalTexture",
        "depthTexture",
        "diffuseLightingTexture",
        "specularLightingTexture"
    ];
    var outputTextureIndex = 0;

    var coloredLights = false;
    var pointLights = true;
    var spotLights = false;
    var directionalLights = false;
    var pointLightCenter = [-3.5, 15, -0.5];
    var spotLightCenter = [-3.5, 25, -0.5];
    var yAxis = mathDevice.v3BuildYAxis();

    var setDisabled = function setDisabledFn(colored, spot, directional)
    {
        var disabled = !colored || spot || directional;
        scene.findNode("redLight-node").setDisabled(disabled);
        scene.findNode("greenLight-node").setDisabled(disabled);
        scene.findNode("blueLight-node").setDisabled(disabled);
        scene.findNode("whiteLight-node").setDisabled(colored || spot || directional);
        disabled = !colored || !spot;
        scene.findNode("redSpotLight-node").setDisabled(disabled);
        scene.findNode("greenSpotLight-node").setDisabled(disabled);
        scene.findNode("blueSpotLight-node").setDisabled(disabled);
        scene.findNode("whiteSpotLight-node").setDisabled(colored || !spot);
        disabled = !colored || !directional;
        scene.findNode("redDirectionalLight-node").setDisabled(disabled);
        scene.findNode("greenDirectionalLight-node").setDisabled(disabled);
        scene.findNode("blueDirectionalLight-node").setDisabled(disabled);
        scene.findNode("whiteDirectionalLight-node").setDisabled(colored || !directional);
    };

    // Controls
    var htmlControls = HTMLControls.create();

    htmlControls.addRadioControl({
        id: "radio-point",
        groupName: "lightType",
        radioIndex: 0,
        value: "pointLights",
        fn: function ()
        {
            pointLights = true;
            spotLights = false;
            directionalLights = false;
            if (sceneLoader.complete())
            {
                setDisabled(coloredLights, spotLights, directionalLights);
            }
        },
        isDefault: true
    });
    htmlControls.addRadioControl({
        id: "radio-spot",
        groupName: "lightType",
        radioIndex: 1,
        value: "spotLights",
        fn: function ()
        {
            pointLights = false;
            spotLights = true;
            directionalLights = false;
            if (sceneLoader.complete())
            {
                setDisabled(coloredLights, spotLights, directionalLights);
            }
        },
        isDefault: false
    });
    htmlControls.addRadioControl({
        id: "radio-directional",
        groupName: "lightType",
        radioIndex: 2,
        value: "directionalLights",
        fn: function ()
        {
            pointLights = false;
            spotLights = false;
            directionalLights = true;
            if (sceneLoader.complete())
            {
                setDisabled(coloredLights, spotLights, directionalLights);
            }
        },
        isDefault: false
    });

    htmlControls.addCheckboxControl({
        id: "checkbox-colored",
        value: "coloredLights",
        isSelected: coloredLights,
        fn: function ()
        {
            if (sceneLoader.complete())
            {
                coloredLights = !coloredLights;
                setDisabled(coloredLights, spotLights, directionalLights);
            }
            return coloredLights;
        }
    });

    htmlControls.addButtonControl({
        id: "button01",
        value: "Next Buffer",
        fn: function ()
        {
            if (renderer)
            {
                outputTextureIndex += 1;
                outputTextureIndex = outputTextureIndex % outputTextureNames.length;
                renderer.ft = outputTextureNames[outputTextureIndex];
            }
        }
    });

    htmlControls.register();

    var v3Build = mathDevice.v3Build;
    var m43BuildTranslation = mathDevice.m43BuildTranslation;

    // Create a callback for post scene load to add some lights and update the camera position
    var loadSceneFinished = function loadSceneFinishedFn(scene)
    {
        var addLight = function addLightFn(light, enabled, lightCenter)
        {
            scene.addLight(light);

            var lightMatrix = m43BuildTranslation.call(mathDevice, v3Build.apply(mathDevice, lightCenter));

            var lightNode = SceneNode.create(
            {
                name: light.name + "-node",
                local: lightMatrix,
                dynamic : true,
                disabled : !enabled
            });

            lightNode.addLightInstance(LightInstance.create(light));

            scene.addRootNode(lightNode);
        };

        var createPointLight = function createPointLightFn(lightName, lightMaterial, color)
        {
            return Light.create(
            {
                name : lightName,
                color : color,
                point : true,
                shadows : true,
                halfExtents: mathDevice.v3Build(40, 40, 40),
                origin: mathDevice.v3Build(0, 10, 0),
                material : lightMaterial
            });
        };

        var createSpotLight = function createSpotLightFn(lightName, lightMaterial, color)
        {
            return Light.create(
            {
                name : lightName,
                color : mathDevice.v3Build(color[0], color[1], color[2]),
                spot : true,
                shadows : true,
                material : lightMaterial,
                target: mathDevice.v3Build(0, -40, 0),
                right: mathDevice.v3Build(0, 0, 40),
                up: mathDevice.v3Build(40, 0, 0)
            });
        };

        var createDirectionalLight = function createDirectionalLightFn(lightName, lightMaterial, color, direction)
        {
            return Light.create(
            {
                name : lightName,
                color : mathDevice.v3Build(color[0], color[1], color[2]),
                directional : true,
                shadows : true,
                material : lightMaterial,
                halfExtents: mathDevice.v3Build(60, 60, 60),
                direction: mathDevice.v3Build(direction[0], direction[1], direction[2])
            });
        };

        var lightMaterialData = {
            effect: "lambert",
            parameters : {
                lightfalloff: "textures/default_light.png",
                lightprojection: "textures/default_light.png"
            }
        };
        scene.loadMaterial(graphicsDevice, textureManager, effectManager, "defaultLightMaterial", lightMaterialData);
        var lightMaterial = scene.getMaterial("defaultLightMaterial");

        // Add some lights into the scene
        addLight(createPointLight("whiteLight", lightMaterial, [1, 1, 1]),    true,  pointLightCenter);
        addLight(createPointLight("redLight",   lightMaterial, [0.9, 0.1, 0.1]), false, pointLightCenter);
        addLight(createPointLight("greenLight", lightMaterial, [0.1, 0.9, 0.1]), false, pointLightCenter);
        addLight(createPointLight("blueLight",  lightMaterial, [0.1, 0.1, 0.9]), false, pointLightCenter);

        addLight(createSpotLight("whiteSpotLight", lightMaterial, [1, 1, 1]),    false, spotLightCenter);
        addLight(createSpotLight("redSpotLight",   lightMaterial, [0.9, 0.1, 0.1]), false, spotLightCenter);
        addLight(createSpotLight("greenSpotLight", lightMaterial, [0.1, 0.9, 0.1]), false, spotLightCenter);
        addLight(createSpotLight("blueSpotLight",  lightMaterial, [0.1, 0.1, 0.9]), false, spotLightCenter);

        addLight(createDirectionalLight("whiteDirectionalLight", lightMaterial, [1, 1, 1], [-0.707107, -0.707107, 0]),
                 false, pointLightCenter);
        addLight(createDirectionalLight("redDirectionalLight",   lightMaterial, [0.9, 0.1, 0.1], [0.707107, -0.707107, 0]),
                 false, pointLightCenter);
        addLight(createDirectionalLight("greenDirectionalLight", lightMaterial, [0.1, 0.9, 0.1], [0, -0.707107, 0.707107]),
                 false, pointLightCenter);
        addLight(createDirectionalLight("blueDirectionalLight",  lightMaterial, [0.1, 0.1, 0.9], [0, -0.707107, -0.707107]),
                 false, pointLightCenter);

        scene.addLight(Light.create({name : "ambient",
                                     ambient : true,
                                     color : [0.1, 0.1, 0.1]}));

        var sceneExtents = scene.getExtents();
        var sceneMinExtent = mathDevice.v3Build(sceneExtents[0], sceneExtents[1], sceneExtents[2]);
        var sceneMaxExtent = mathDevice.v3Build(sceneExtents[3], sceneExtents[4], sceneExtents[5]);
        var c = mathDevice.v3ScalarMul(mathDevice.v3Add(sceneMaxExtent, sceneMinExtent), 0.5);
        var e = mathDevice.v3Sub(c, sceneMinExtent);

        camera.lookAt(mathDevice.v3Build(-3.5, 5, -0.5),
                      mathDevice.v3Build(0.0, 1.0, 0.0),
                      mathDevice.v3Build(-51, 16, 8));
        camera.updateViewMatrix();

        var len = mathDevice.v3Length(e);
        if (len < 4.0)
        {
            camera.nearPlane = len * 0.25;
        }
        else
        {
            camera.nearPlane = 1.0;
        }
        camera.farPlane = Math.ceil(len) * 100.0;
        camera.updateProjectionMatrix();

        maxSpeed = len;

    };

    var previousFrameTime = TurbulenzEngine.time;
    var doUpdate = true;
    var intervalID;
    var fpsElement = document.getElementById("fpscounter");
    var lastFPS = "0";
    var rendererBufferWidth = 1024;
    var rendererBufferHeight = 1024;

    var renderFrame = function renderFrameFn()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }
        cameraController.maxSpeed = (deltaTime * maxSpeed);

        // Update the input device
        inputDevice.update();

        cameraController.update();

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

        if (doUpdate)
        {
            // Orbit the lights above the scene
            var updateLight = function updateLightFn(lightName, orbitCycle, orbitOffset, orbitRadius, forward, lightCenter)
            {
                var orbit = (currentTime - orbitOffset) % orbitCycle;
                if (!forward)
                {
                    orbit *= -1;
                }
                var omega = (orbit / orbitCycle) * 2 * Math.PI;
                var x = orbitRadius * Math.cos(omega);
                var y = orbitRadius * Math.sin(omega);
                var lightNode = scene.findNode(lightName + "-node");
                var matrix = lightNode.getLocalTransform();
                matrix[9] = (lightCenter[0] + x);
                matrix[11] = (lightCenter[2] + y);
                lightNode.setLocalTransform(matrix);
            };

            var updateDirectionalLight = function updateDirectionalLightFn(lightName, orbitCycle, orbitOffset, forward, axis)
            {
                var orbit = (currentTime - orbitOffset) % orbitCycle;
                if (!forward)
                {
                    orbit *= -1;
                }
                var omega = (orbit / orbitCycle) * 2 * Math.PI;
                var lightNode = scene.findNode(lightName + "-node");
                var matrix = lightNode.getLocalTransform();
                mathDevice.m43FromAxisRotation(axis, omega, matrix);
                lightNode.setLocalTransform(matrix);
            };

            updateLight("whiteLight", 10, 0, 10, true, pointLightCenter);
            updateLight("redLight", 5, 2, 10, true, pointLightCenter);
            updateLight("greenLight", 7, 4.5, 10, true, pointLightCenter);
            updateLight("blueLight", 8, 6, 10, false, pointLightCenter);

            updateLight("whiteSpotLight", 10, 0, 10, true, spotLightCenter);
            updateLight("redSpotLight", 5, 2, 10, true, spotLightCenter);
            updateLight("greenSpotLight", 7, 4.5, 10, true, spotLightCenter);
            updateLight("blueSpotLight", 8, 6, 10, false, spotLightCenter);

            updateDirectionalLight("whiteDirectionalLight", 10, 0, true, yAxis);
            updateDirectionalLight("redDirectionalLight", 5, 2, true, yAxis);
            updateDirectionalLight("greenDirectionalLight", 7, 4.5, true, yAxis);
            updateDirectionalLight("blueDirectionalLight", 8, 6, false, yAxis);

            scene.update();

            renderer.update(graphicsDevice, camera, scene, currentTime);
        }

        if (graphicsDevice.beginFrame())
        {
            if (deviceWidth < 256)
            {
                rendererBufferWidth = 256;
            }
            else if (deviceWidth < 512)
            {
                rendererBufferWidth = 512;
            }
            else
            {
                rendererBufferWidth = 1024;
            }

            if (deviceHeight < 256)
            {
                rendererBufferHeight = 256;
            }
            else if (deviceHeight < 512)
            {
                rendererBufferHeight = 512;
            }
            else
            {
                rendererBufferHeight = 1024;
            }

            if (renderer.updateBuffers(graphicsDevice, rendererBufferWidth, rendererBufferHeight))
            {
                var clearColor = [0.0, 0.0, 0.0, 1.0];

                // Render the scene with the deferred renderer with a simple blit posteffect
                renderer.draw(graphicsDevice,
                              clearColor,
                              drawExtraDecalsFn,
                              drawExtraTransparentFn,
                              drawDebugFn,
                              postEffects.getEffectSetupCB("copy"));
            }

            graphicsDevice.endFrame();
        }

        previousFrameTime = currentTime;

        if (fpsElement)
        {
            var fps = (graphicsDevice.fps).toFixed(2);
            if (lastFPS !== fps)
            {
                lastFPS = fps;

                // Execute any code that interacts with the DOM in a separate callback
                TurbulenzEngine.setTimeout(function () {
                    fpsElement.innerHTML = fps + ' fps';
                }, 1);
            }
        }
    };

    // Create a loop to run on an interval whilst loading
    var loadingLoop = function loadingLoopFn()
    {
        if (sceneLoader.complete())
        {
            // Loading has completed, update the shader and effects systems
            TurbulenzEngine.clearInterval(intervalID);

            renderer.updateShader(shaderManager);
            postEffects.updateShader(shaderManager);

            // Register the rendering callback as the new interval
            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

    var loadAssets = function loadAssets()
    {
        // Create the postEffects, renderer and check we can allocate the buffers (requires shader assets)
        postEffects = PostEffects.create(graphicsDevice, shaderManager);
        renderer = DeferredRendering.create(graphicsDevice,
                                            mathDevice,
                                            shaderManager,
                                            effectManager,
                                            { shadowRendering: true });

        if (!renderer || !renderer.updateBuffers(graphicsDevice, rendererBufferWidth, rendererBufferHeight))
        {
            var errorMessage = "Failed to initialize deferred renderer.";
            var numSupportedRenderTargetColorTextures = graphicsDevice.maxSupported("RENDERTARGET_COLOR_TEXTURES");
            if (numSupportedRenderTargetColorTextures < 4)
            {
                errorMessage += "\nThis device does not support the required number of RENDERTARGET_COLOR_TEXTURES.\n" +
                                "Requires >= 4 but supports " +
                                numSupportedRenderTargetColorTextures + ".";
            }

            errorCallback(errorMessage);

            TurbulenzEngine.clearInterval(intervalID);
            intervalID = undefined;
            return;
        }

        sceneLoader.load({  scene : scene,
                            append : true,
                            assetPath : "models/diningroom.dae",
                            keepLights : true,
                            graphicsDevice : graphicsDevice,
                            mathDevice : mathDevice,
                            textureManager : textureManager,
                            shaderManager : shaderManager,
                            effectManager : effectManager,
                            requestHandler : requestHandler,
                            postSceneLoadFn : loadSceneFinished
                        });
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

        loadAssets();
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
        if (intervalID)
        {
            TurbulenzEngine.clearInterval(intervalID);
        }

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        destroyScenePostRenderer();

        fpsElement = null;
    };

};
