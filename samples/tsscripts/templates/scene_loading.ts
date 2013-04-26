/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Scene loading
 * @description:
 * This sample shows the minimum steps required to set up the Turbulenz engine and how to load the required assets to display a simple scene.
 * The sample is using the Turbulenz forward renderer and it also demostrates how to add a point light to the scene.
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
/*{{ javascript("jslib/forwardrendering.js") }}*/
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

/*{{ javascript("scripts/sceneloader.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneNode: false */
/*global SceneLoader: false */
/*global Camera: false */
/*global Light: false */
/*global LightInstance: false */
/*global ForwardRendering: false */

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

    var mathDeviceParameters = { };
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var physicsDeviceParameters = { };
    var physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();
    var renderer;

    var intervalID; // Timer handle used for the control loops

    var camera = Camera.create(mathDevice);

    // Create some rendering callbacks to pass to the renderer
    function drawExtraDecalsFn()
    {
    }

    function drawExtraTransparentFn()
    {
    }

    function drawDebugFn()
    {
    }

    // Main update loop function
    var update = function updateFn()
    {
        var currentTime = TurbulenzEngine.time;

        // Update the aspect ratio of the camera in case of window resizes
        var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }

        camera.updateViewProjectionMatrix();

        scene.update();

        renderer.update(graphicsDevice, camera, scene, currentTime);

        if (graphicsDevice.beginFrame())
        {
            var clearColor = [0.0, 0.0, 0.0, 1.0];

            // Render the scene with the forward renderer
            renderer.draw(graphicsDevice,
                          clearColor,
                          drawExtraDecalsFn,
                          drawExtraTransparentFn,
                          drawDebugFn);
            graphicsDevice.endFrame();
        }
    };

    // Create a loop to run on an interval whilst loading
    var loadingLoop = function loadingLoopFn()
    {
        // Wait for all assets to download
        if (sceneLoader.complete())
        {
            sceneLoader = null;

            // Loading has completed, update the shader system
            renderer.updateShader(shaderManager);

            // Set the camera to look at the object
            var sceneExtents = scene.getExtents();
            var sceneMinExtent = mathDevice.v3Build(sceneExtents[0], sceneExtents[1], sceneExtents[2]);
            var sceneMaxExtent = mathDevice.v3Build(sceneExtents[3], sceneExtents[4], sceneExtents[5]);
            var center = mathDevice.v3ScalarMul(mathDevice.v3Add(sceneMaxExtent, sceneMinExtent), 0.5);
            var extent = mathDevice.v3Sub(center, sceneMinExtent);

            var halfFov = Math.tan(30 * Math.PI / 180);
            camera.recipViewWindowX = 1.0 / halfFov;
            camera.recipViewWindowY = 1.0 / halfFov;

            camera.lookAt(mathDevice.v3Build(-3.5, 5, -0.5), mathDevice.v3BuildYAxis(), mathDevice.v3Build(-51, 16, 8));
            camera.updateViewMatrix();

            var length = mathDevice.v3Length(extent);
            if (length < 4.0)
            {
                camera.nearPlane = length * 0.25;
            }
            else
            {
                camera.nearPlane = 1.0;
            }
            camera.farPlane = Math.ceil(length) * 100.0;
            camera.updateProjectionMatrix();

            // Register the update() loop as the new interval and make it call the function at 60Hz
            TurbulenzEngine.clearInterval(intervalID);
            intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
        }
    };

    var v3Build = mathDevice.v3Build;

    // Callback for when the scene is loaded to add some lights
    function loadSceneFinished(scene)
    {
        var addPointLight =
            function addLightFn(lightName, lightMaterial, position, color)
        {
            var light = Light.create(
            {
                name : lightName,
                color : mathDevice.v3Build(color[0], color[1], color[2]),
                point : true,
                shadows : true,
                halfExtents: v3Build.call(mathDevice, 40, 40, 40),
                origin: v3Build.call(mathDevice, 0, 10, 0),
                material : lightMaterial
            });

            scene.addLight(light);

            var lightMatrix = mathDevice.m43BuildTranslation(v3Build.apply(mathDevice, position));

            var lightNode = SceneNode.create(
            {
                name: lightName + "-node",
                local: lightMatrix
            });

            lightNode.addLightInstance(LightInstance.create(light));

            scene.addRootNode(lightNode);
        };

        var lightMaterialData = {
            effect: "lambert",
            parameters : {
                lightfalloff: "textures/default_light.png",
                lightprojection: "textures/default_light.png"
            }
        };

        scene.loadMaterial(graphicsDevice,
                           textureManager,
                           effectManager,
                           "defaultLightMaterial",
                           lightMaterialData);
        var lightMaterial = scene.getMaterial("defaultLightMaterial");

        // Add some lights into the scene
        addPointLight("globalLight",
                       lightMaterial,
                       [-3.5, 15, -0.5],
                       [1, 1, 1]);

        scene.addLight(Light.create({name : "ambient",
                                     ambient : true,
                                     color : [0.1, 0.1, 0.1]}));
    }
    // Start calling loadingLoop() at 10Hz to check loading progress
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

    var loadAssets = function loadAssetsFn()
    {
        // Renderer for the scene (requires shader assets).
        renderer = ForwardRendering.create(graphicsDevice,
                                           mathDevice,
                                           shaderManager,
                                           effectManager,
                                           {});

        //Start the loading
        sceneLoader.load({  scene : scene,
                            append : false,
                            assetPath : "models/diningroom.dae",
                            keepLights : true,
                            physicsDevice : physicsDevice,
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
        TurbulenzEngine.clearInterval(intervalID);

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        if (scene)
        {
            scene.destroy();
            scene = null;
        }
        requestHandler = null;
        sceneLoader = null;
        effectManager = null;
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

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        TurbulenzEngine.flush();
        physicsDevice = null;
        graphicsDevice = null;
        mathDevice = null;
    };
};
