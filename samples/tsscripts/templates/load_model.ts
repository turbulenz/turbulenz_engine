/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Load model
 * @description:
 * This sample shows how to load geometry models and how to add instances of them to the scene.
 * The sample will first request and load a dinning room model into a Scene object and when finished
 * you will then be able to load and remove two additional models to the same scene.
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
/*{{ javascript("jslib/scenedebugging.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/forwardrendering.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/vmath.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*{{ javascript("scripts/sceneloader.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

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
/*global CameraController: false */
/*global Light: false */
/*global LightInstance: false */
/*global HTMLControls: false */
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
    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear([0.5, 0.5, 0.5, 1.0]);
        graphicsDevice.endFrame();
    }
    var clearColor = [0.0, 0.0, 0.0, 1.0];

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
    var renderer;

    var maxSpeed = cameraController.maxSpeed;

    var intervalID;
    var cube;
    var duck;
    var sphere;
    var loadingDuck = false;
    var loadingCube = false;
    var loadingSphere = false;

    var duckTransform = mathDevice.m43BuildIdentity();
    var relPos = mathDevice.v3Build(-4.5, 4.8, -3);
    mathDevice.m43Translate(duckTransform, relPos);

    var cubeTransform = mathDevice.m43BuildIdentity();
    relPos = mathDevice.v3Build(-2, 5.4, 4);
    mathDevice.m43Translate(cubeTransform, relPos);

    var sphereTransform = mathDevice.m43BuildIdentity();
    relPos = mathDevice.v3Build(-6, 5.8, 2);
    mathDevice.m43Translate(sphereTransform, relPos);

    var buttonLoadDuck;
    var buttonRemoveDuck;
    var buttonLoadCube;
    var buttonRemoveCube;
    var buttonLoadSphere;
    var buttonRemoveSphere;
    var buttonsAvailable;

    var loadModelDuck = function loadModelDuckFn()
    {
        // load in the duck
        sceneLoader.load({scene : scene,
                        append : true,
                        assetPath : "models/duck.dae",
                        keepLights : false,
                        keepCameras : false,
                        graphicsDevice : graphicsDevice,
                        mathDevice : mathDevice,
                        textureManager : textureManager,
                        shaderManager : shaderManager,
                        effectManager : effectManager,
                        requestHandler : requestHandler,
                        baseMatrix : duckTransform,
                        disabled : true
                    });

        // we check this flag in the update loop to know when to call sceneLoader.complete()
        loadingDuck = true;

        if (buttonsAvailable)
        {
            buttonLoadDuck.disabled = true;
        }
    };

    var removeModelDuck = function removeModelDuckFn()
    {
        // Remove the duck from the scene
        scene.removeRootNode(duck);
        // Destroy the duck
        // Set references to null
        duck.destroy();
        duck = null;

        if (buttonsAvailable)
        {
            buttonRemoveDuck.disabled = true;
            buttonLoadDuck.disabled = false;
        }
    };

    var loadModelCube = function loadModelCubeFn()
    {
        // Load in the cube
        sceneLoader.load({  scene : scene,
                        append : true,
                        assetPath : "models/cube.dae",
                        keepLights : false,
                        graphicsDevice : graphicsDevice,
                        mathDevice : mathDevice,
                        textureManager : textureManager,
                        shaderManager : shaderManager,
                        effectManager : effectManager,
                        requestHandler : requestHandler,
                        baseMatrix : cubeTransform,
                        disabled : true
                    });

        // we check this flag in the update loop to know when to call sceneLoader.complete()
        loadingCube = true;

        if (buttonsAvailable)
        {
            buttonLoadCube.disabled = true;
        }
    };

    var removeModelCube = function removeModelCubeFn()
    {
        // Remove the cube from the scene
        scene.removeRootNode(cube);
        // Set references to null
        cube.destroy();
        cube = null;

        if (buttonsAvailable)
        {
            buttonRemoveCube.disabled = true;
            buttonLoadCube.disabled = false;
        }
    };

    var loadModelSphere = function loadModelSphereFn()
    {
        // Load in the sphere
        sceneLoader.load({  scene : scene,
                        append : true,
                        assetPath : "models/sphere.dae",
                        keepLights : false,
                        graphicsDevice : graphicsDevice,
                        mathDevice : mathDevice,
                        textureManager : textureManager,
                        shaderManager : shaderManager,
                        effectManager : effectManager,
                        requestHandler : requestHandler,
                        baseMatrix : sphereTransform,
                        disabled : true
                    });

        // we check this flag in the update loop to know when to call sceneLoader.complete()
        loadingSphere = true;

        if (buttonsAvailable)
        {
            buttonLoadSphere.disabled = true;
        }
    };

    var removeModelSphere = function removeModelSphereFn()
    {
        // Remove the sphere from the scene
        scene.removeRootNode(sphere);
        // Set references to null
        sphere.destroy();
        sphere = null;

        if (buttonsAvailable)
        {
            buttonRemoveSphere.disabled = true;
            buttonLoadSphere.disabled = false;
        }
    };

    // Link up with the HTML controls on the page
    var htmlControls = HTMLControls.create();
    htmlControls.addButtonControl({
        id: "buttonLoadDuck",
        value: "Load",
        fn: loadModelDuck
    });
    htmlControls.addButtonControl({
        id: "buttonRemoveDuck",
        value: "Remove",
        fn: removeModelDuck
    });
    htmlControls.addButtonControl({
        id: "buttonLoadCube",
        value: "Load",
        fn: loadModelCube
    });
    htmlControls.addButtonControl({
        id: "buttonRemoveCube",
        value: "Remove",
        fn: removeModelCube
    });
    htmlControls.addButtonControl({
        id: "buttonLoadSphere",
        value: "Load",
        fn: loadModelSphere
    });
    htmlControls.addButtonControl({
        id: "buttonRemoveSphere",
        value: "Remove",
        fn: removeModelSphere
    });

    buttonLoadDuck = document.getElementById("buttonLoadDuck");
    buttonRemoveDuck = document.getElementById("buttonRemoveDuck");
    buttonLoadCube = document.getElementById("buttonLoadCube");
    buttonRemoveCube = document.getElementById("buttonRemoveCube");
    buttonLoadSphere = document.getElementById("buttonLoadSphere");
    buttonRemoveSphere = document.getElementById("buttonRemoveSphere");
    // check that we can access the buttons
    buttonsAvailable = buttonLoadDuck &&
                        buttonRemoveDuck &&
                        buttonLoadCube &&
                        buttonRemoveCube &&
                        buttonLoadSphere &&
                        buttonRemoveSphere;

    if (buttonsAvailable)
    {
        buttonLoadDuck.disabled = true;
        buttonLoadCube.disabled = true;
        buttonLoadSphere.disabled = true;
        buttonRemoveDuck.disabled = true;
        buttonRemoveCube.disabled = true;
        buttonRemoveSphere.disabled = true;
    }
    htmlControls.register();

    // Create a callback for post scene load to update the camera position
    var loadCubeFinished = function loadCubeFinishedFn(scene)
    {
        loadingCube = false;
        cube = scene.findNode("cube");
        cube.enableHierarchy(true);
        buttonRemoveCube.disabled = false;
    };

    var loadDuckFinished = function loadDuckFinishedFn(scene)
    {
        loadingDuck = false;
        duck = scene.findNode("LOD3sp");
        duck.enableHierarchy(true);
        buttonRemoveDuck.disabled = false;
    };

    var loadSphereFinished = function loadSphereFinishedFn(scene)
    {
        loadingSphere = false;
        sphere = scene.findNode("sphere");
        sphere.enableHierarchy(true);
        buttonRemoveSphere.disabled = false;
    };

    var v3Build = mathDevice.v3Build;

    // Callback for when the scene is loaded to add some lights
    function loadSceneFinished(scene)
    {
        var addPointLight = function addLightFn(lightName, lightMaterial, position, color)
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

        if (buttonsAvailable)
        {
            buttonLoadDuck.disabled = false;
            buttonLoadCube.disabled = false;
            buttonLoadSphere.disabled = false;
        }
    }

    var previousFrameTime;

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

    var update = function updateFn()
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

        // If the duck is loading then check if it is complete
        if (loadingDuck && sceneLoader.complete())
        {
            loadDuckFinished(scene);
        }
        else if (loadingCube && sceneLoader.complete())
        {
            loadCubeFinished(scene);
        }
        else if (loadingSphere && sceneLoader.complete())
        {
            loadSphereFinished(scene);
        }

        scene.update();

        renderer.update(graphicsDevice, camera, scene, currentTime);

        if (graphicsDevice.beginFrame())
        {

            renderer.draw(graphicsDevice,
                          clearColor,
                          drawExtraDecalsFn,
                          drawExtraTransparentFn,
                          drawDebugFn);

            graphicsDevice.endFrame();
        }

        previousFrameTime = currentTime;
    };

    var loadingLoop = function loadingLoopFn()
    {
        if (sceneLoader.complete())
        {
            // Register the mainLoop callback as the new interval
            TurbulenzEngine.clearInterval(intervalID);

            // Move the camera to look at the scene
            camera.lookAt(mathDevice.v3Build(-3.5, 5, -0.5), worldUp, mathDevice.v3Build(-13, 10, 8));
            camera.updateViewMatrix();
            camera.updateProjectionMatrix();

            maxSpeed = 30;

            renderer.updateShader(shaderManager);
            intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
        }
    };

    // Start calling the loading loop at 10Hz
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);
    previousFrameTime = TurbulenzEngine.time;

    var loadAssets = function loadAssetsFn()
    {
        // Renderer for the scene (requires shader assets).
        renderer = ForwardRendering.create(graphicsDevice,
                                           mathDevice,
                                           shaderManager,
                                           effectManager,
                                           {});

        // Load the diningroom
        sceneLoader.load({  scene : scene,
                            append : true,
                            assetPath : "models/diningroom.dae",
                            keepLights : true,
                            graphicsDevice : graphicsDevice,
                            mathDevice : mathDevice,
                            textureManager : textureManager,
                            shaderManager : shaderManager,
                            effectManager : effectManager,
                            requestHandler: requestHandler,
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

        requestHandler = null;
        sceneLoader = null;
        if (scene)
        {
            scene.destroy();
            scene = null;
        }
        htmlControls = null;

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
    };
};
