// Copyright (c) 2010-2012 Turbulenz Limited

/*global TurbulenzEngine: false */
/*global Motion: false */
/*global TurbulenzBridge: false */
/*global RequestHandler: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global Camera: false */
/*global DefaultRendering: false */
/*global TurbulenzServices: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };
    TurbulenzEngine.onerror = errorCallback;

    var warningCallback = function warningCallback(msg)
    {
        window.alert(msg);
    };
    TurbulenzEngine.onwarning = warningCallback;

    // Put the plugin version onto the page
    var versionElem = document.getElementById("engine_version");
    if (versionElem)
    {
        versionElem.innerHTML = TurbulenzEngine.version;
    }

    TurbulenzBridge.startLoading();

    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var graphicsDeviceParameters = {};
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    // Renderer and assets for the scene.
    var renderer;
    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();

    // Setup world space
    var clearColor = [0.5, 0.5, 0.5, 1.0];
    var worldUp = mathDevice.v3BuildYAxis();

    // Setup a camera to view a close-up object
    var camera = Camera.create(mathDevice);
    var cameraDistanceFactor = 1.0;
    camera.nearPlane = 0.05;

    // The name of the node we want to rotate
    var nodeName = "LOD3sp";
    var objectNode = null;

    var rotation = Motion.create(mathDevice, "scene");
    rotation.setConstantRotation(0.01);

    // Initialize the previous frame time
    var previousFrameTime = TurbulenzEngine.time;

    var renderFrame = function renderFrameFn()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }

        var deviceWidth = graphicsDevice.width;
        var deviceHeight = graphicsDevice.height;
        var aspectRatio = (deviceWidth / deviceHeight);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        if (objectNode)
        {
            // Update the scene with rotation
            rotation.update(deltaTime);
            objectNode.setLocalTransform(rotation.matrix);
        }

        scene.update();

        renderer.update(graphicsDevice, camera, scene, currentTime);

        if (graphicsDevice.beginFrame())
        {
            if (renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight))
            {
                renderer.draw(graphicsDevice, clearColor);
            }

            graphicsDevice.endFrame();
        }
    };

    var intervalID;
    var loadingLoop = function loadingLoopFn()
    {
        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear([1.0, 1.0, 1.0, 1.0]);
            graphicsDevice.endFrame();
        }

        if (sceneLoader.complete())
        {
            TurbulenzEngine.clearInterval(intervalID);

            objectNode = scene.findNode(nodeName);

            var sceneExtents = scene.getExtents();
            var sceneMinExtent = mathDevice.v3Build(sceneExtents[0], sceneExtents[1], sceneExtents[2]);
            var sceneMaxExtent = mathDevice.v3Build(sceneExtents[3], sceneExtents[4], sceneExtents[5]);
            var center = mathDevice.v3ScalarMul(mathDevice.v3Add(sceneMaxExtent, sceneMinExtent), 0.5);

            var extent = mathDevice.v3Sub(center, sceneMinExtent);
            var eyePosition = mathDevice.v3Build(center[0] + extent[0] * 2 * cameraDistanceFactor,
                                                 center[1] + extent[1] * cameraDistanceFactor,
                                                 center[2] + extent[2] * 2 * cameraDistanceFactor);

            camera.lookAt(center, worldUp, eyePosition);
            camera.updateViewMatrix();

            renderer.updateShader(shaderManager);

            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
            TurbulenzBridge.stopLoading();
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);
    // Change the clear color before we start loading assets
    loadingLoop();

    var loadAssets = function loadAssetsFn()
    {
        // Renderer for the scene.
        renderer = DefaultRendering.create(graphicsDevice,
                                       mathDevice,
                                       shaderManager,
                                       effectManager);

        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));

        // Load the scene
        sceneLoader.load({
            scene : scene,
            assetPath : "models/duck.dae",
            graphicsDevice : graphicsDevice,
            textureManager : textureManager,
            effectManager : effectManager,
            shaderManager : shaderManager,
            requestHandler : requestHandler,
            append : false,
            dynamic : true
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
        var defaultMappingSettings = {
            mappingTablePrefix: "staticmax/",
            assetPrefix: "missing/",
            mappingTableURL: "mapping_table.json"
        };
        TurbulenzServices.createMappingTable(requestHandler,
                                             gameSession,
                                             mappingTableReceived,
                                             defaultMappingSettings);
    };

    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    // Create a scene destroy callback to run when the window is closed
    var appDestroyCallback = function unloadCallbackFn()
    {
        TurbulenzEngine.clearInterval(intervalID);

        gameSession.destroy();

        if (scene)
        {
            scene.destroy();
            scene = null;
        }

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

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
        clearColor = null;
        rotation = null;
        camera = null;

        TurbulenzEngine.flush();

        graphicsDevice = null;
        mathDevice = null;
    };
    TurbulenzEngine.onunload = appDestroyCallback;

};
