/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Camera
 * @description:
 * This sample shows how to set up and then animate a Turbulenz Camera object.
 * You can switch between tracking, orbiting and chasing motions.
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
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*{{ javascript("scripts/dynamiccameracontroller.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/
/*{{ javascript("scripts/motion.js") }}*/
/*{{ javascript("scripts/sceneloader.js") }}*/

/*global TurbulenzEngine: true */
/*global DefaultRendering: false */
/*global DynamicCameraController: false */
/*global Motion: false */
/*global RequestHandler: false */
/*global SceneLoader: false */
/*global TurbulenzServices: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Camera: false */
/*global Scene: false */
/*global Floor: false */
/*global HTMLControls: false */

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

    var inputDeviceParameters = { };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    var requestHandlerParameters = { };
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var renderer;

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();

    var loadAssets = function loadAssetsFn()
    {
        // Renderer for the scene (requires shader assets).
        renderer = DefaultRendering.create(graphicsDevice,
                                           mathDevice,
                                           shaderManager,
                                           effectManager);

        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));
        renderer.setDefaultTexture(textureManager.get("default"));

        sceneLoader.load({  scene : scene,
                            append : false,
                            assetPath : "models/duck.dae",
                            keepCameras : true,
                            graphicsDevice : graphicsDevice,
                            mathDevice : mathDevice,
                            textureManager : textureManager,
                            effectManager : effectManager,
                            shaderManager : shaderManager,
                            requestHandler : requestHandler,
                            dynamic : true
                        });
    };

    // Read mapping table
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

    // Create world
    var worldUp = mathDevice.v3Build(0.0, 1.0, 0.0);
    var floor = Floor.create(graphicsDevice, mathDevice);

    // Create duck animation
    var duck = Motion.create(mathDevice, "duck");
    duck.setCircularMovement(5.0, [0, 0, 0]);
    duck.setDuckMotion(0.1, 0.5, 0.3);
    duck.baseRotation = mathDevice.m43FromAxisRotation(duck.up, -90, duck.baseRotation);

    // Create fixed positions for tracking camera
    var cameraFixedPositions = [ mathDevice.v3Build(0.0, 4.0, -10.0),
                                 mathDevice.v3Build(9.0, 1.5, 9.0),
                                 mathDevice.v3Build(-9.0, 8.0, 9.0) ];
    var cameraIndex = 1;

    // Create the orbit motion for the orbit camera position
    var orbit = Motion.create(mathDevice, "orbitCam");
    orbit.setCircularMovement(7.0, [0, 0, 0]);
    orbit.setConstantMotion(0.3);
    var updateOrbit = false;

    // Create a basic camera with initial target of the duck position
    var camera = Camera.create(mathDevice);
    camera.lookAt(duck.position, worldUp, cameraFixedPositions[cameraIndex]);
    camera.updateViewMatrix();

    // Generate the initial matrix of the chase camera
    var updateChase = false;
    var chaseCamOffset = mathDevice.v3Build(-8.0, 4.5, 0.0);
    var chaseCamPosition = chaseCamOffset.slice();
    var chaseCamRate = 5.0;

    // Create the dynamic camera used for tracking, orbiting and chasing
    var dynamicCameraController = DynamicCameraController.create(camera, graphicsDevice);
    dynamicCameraController.setChaseRate(0.3);
    dynamicCameraController.setTracking(true);
    dynamicCameraController.setRate(1.4);

    var htmlControls = HTMLControls.create();

    // Switch camera
    var switchToTargetCam = function switchToTargetCamFn(index)
    {
        cameraIndex = index;
        updateOrbit = false;
        updateChase = false;

        // Rail camera mode is used to move to the target position over time
        dynamicCameraController.setCameraMode(dynamicCameraController.cameraType.rail);
        dynamicCameraController.setCameraTargetPos(cameraFixedPositions[index], TurbulenzEngine.time, 100);
        htmlControls.setSelectedRadio("camPos", cameraIndex);
    };


    var switchToOrbitCam = function switchToOrbitCamFn()
    {
        cameraIndex = 3;
        updateChase = false;

        // Fixed camera mode is used for orbit to ensure the orbit movement is constant
        dynamicCameraController.setCameraMode(dynamicCameraController.cameraType.fixed);
        updateOrbit = true;
        htmlControls.setSelectedRadio("camPos", cameraIndex);
    };

    var switchToChaseCam = function switchToChaseCamFn()
    {
        cameraIndex = 4;
        updateOrbit = false;
        // Chase camera mode is used, to smooth the varying motion of the
        // target position
        dynamicCameraController.setCameraMode(dynamicCameraController.cameraType.chase);
        updateChase = true;
        htmlControls.setSelectedRadio("camPos", cameraIndex);
    };

    // Controls
    htmlControls.addRadioControl({
        id: "radio01",
        groupName: "camPos",
        radioIndex: 0,
        value: "pos01",
        fn: function ()
        {
            switchToTargetCam(0);
        },
        isDefault: true
    });
    htmlControls.addRadioControl({
        id: "radio02",
        groupName: "camPos",
        radioIndex: 1,
        value: "pos02",
        fn: function ()
        {
            switchToTargetCam(1);
        },
        isDefault: false
    });
    htmlControls.addRadioControl({
        id: "radio03",
        groupName: "camPos",
        radioIndex: 2,
        value: "pos03",
        fn: function ()
        {
            switchToTargetCam(2);
        },
        isDefault: false
    });
    htmlControls.addRadioControl({
        id: "radio04",
        groupName: "camPos",
        radioIndex: 3,
        value: "pos04",
        fn: switchToOrbitCam,
        isDefault: false
    });
    htmlControls.addRadioControl({
        id: "radio05",
        groupName: "camPos",
        radioIndex: 4,
        value: "pos05",
        fn: switchToChaseCam,
        isDefault: false
    });
    htmlControls.register();

    // Input functions
    var keyCodes = inputDevice.keyCodes;

    var keyUp = function keyUpFn(key)
    {
        // T to switch between the fixed camera positions
        if (key === keyCodes.T)
        {
            cameraIndex = (cameraIndex + 1) % cameraFixedPositions.length;
            switchToTargetCam(cameraIndex);
        }

        // O to switch to orbit camera
        if (key === keyCodes.O)
        {
            switchToOrbitCam();
        }

        // C to switch to chase camera
        if (key === keyCodes.C)
        {
            switchToChaseCam();
        }

        // Return key to toggle fullscreen mode
        if (key === keyCodes.RETURN)
        {
            graphicsDevice.fullscreen = !graphicsDevice.fullscreen;
        }
    };
    inputDevice.addEventListener("keyup", keyUp);

    // Initialize the previous frame time
    var previousFrameTime = TurbulenzEngine.time;
    var intervalID;

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

        // Update input
        inputDevice.update();

        // Update duck position and rotation
        duck.update(deltaTime);

        // Update orbit camera path
        if (updateOrbit)
        {
            orbit.circularCenter[0] = duck.position[0];
            orbit.circularCenter[2] = duck.position[2];
            orbit.position[1] = 4.0; // Constant height above duck
            orbit.update(deltaTime);
            dynamicCameraController.setCameraTargetPos(orbit.position, currentTime, 0);
        }
        else if (updateChase)
        {
            dynamicCameraController.setCameraTargetPos(chaseCamPosition, currentTime, deltaTime * chaseCamRate);
        }

        // Update dynamic camera controller
        dynamicCameraController.setTrackTarget(duck.position);
        dynamicCameraController.update(deltaTime);

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

        //Move the duck model.
        var duckNode = scene.findNode("LOD3sp");
        duckNode.setLocalTransform(duck.matrix);

        if (updateChase)
        {
            // Only update the chase camera position when we are using it
            chaseCamPosition = mathDevice.m43TransformPoint(duckNode.getWorldTransform(), chaseCamOffset);
        }

        // Update scene
        scene.update();

        // Update renderer with new camera and updated scene
        renderer.update(graphicsDevice, camera, scene, currentTime);

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
        if (sceneLoader.complete())
        {
            TurbulenzEngine.clearInterval(intervalID);
            intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);

            renderer.updateShader(shaderManager);

            switchToTargetCam(0);
        }
    };

    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

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

        duck = null;
        cameraFixedPositions = null;

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        orbit = null;
        chaseCamPosition = null;

        requestHandler = null;
        sceneLoader = null;

        if (scene)
        {
            scene.destroy();
            scene = null;
        }

        camera = null;
        dynamicCameraController = null;
        effectManager = null;

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

        TurbulenzEngine.flush();

        keyCodes = null;
        inputDevice = null;
        graphicsDevice = null;
        mathDevice = null;
    };
};
