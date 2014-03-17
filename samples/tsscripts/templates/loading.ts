/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Loading
 * @description:
 * This sample shows how to track the number of assets loaded in order to render a progress bar.
 * It also shows how to load models and add multiple instances of them to the scene using the scene node hierarchy.
*/

/*{#
This sample is intended to show off the following:

During the initial loading phase (loading the essential assets):
- The user can see an on-screen-display message indicating that the game is
  loading.
- An image can be the first asset to be loaded, which as soon as it's done
  loading will be used to display a splashscreen. The splashscreen fades out
  when all the essential assets are done loading and the scene is ready for
  rendering.
Once the essential assets have been loaded:
- Background loading of additional, non-essential assets can be initiated, and
  specific actions can be performed when their loading is complete. (In this
  example in the form of a melody which starts loading once the scene is done
  loading, and which starts playing as soon as it itself is done loading.)
On-demand loading:
- Assets can be loaded upon demand, with specific actions deciding when to start
  loading them, and specific actions taken once they are done loading.
  In this example, the user can load a duck or a watercan asset on the press of
  a button. The duck asset is relatively small and likely to load quickly. The
  watercan model will take a while to load (due both to a large size and to
  being hosted at a remote server, unlike the other assets), and so the
  developer may decide to show an on-screen-display message that it is loading.
  Once these assets are done loading, they immediately show up in the scene.
- Once an asset is loaded, it can be reused very efficiently. In this example,
  the loading of the watercan asset is time-consuming, but once it is loaded, it
  is very quick to make (or delete) instances of it, and display them in the
  scene.
- Assets can also be removed on demand, in which case they must be reloaded if
  they are required to be used again.

NOTE: Remember to re-upload to the remote server the rehashed watercan model when it changes.

#}*/

/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/assettracker.js") }}*/
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
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/vmath.js") }}*/
/*{{ javascript("jslib/loadingscreen.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/services/osdlib.js") }}*/

/*{{ javascript("scripts/sceneloader.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global OSD: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneNode: false */
/*global SceneLoader: false */
/*global Camera: false */
/*global CameraController: false */
/*global AssetTracker: false */
/*global LoadingScreen: false */
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

    var osd = OSD.create();
    // Print a message to the on-screen-display that the game is loading
    osd.startLoading();

    // Create the engine devices objects
    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    if (!graphicsDevice.shadingLanguageVersion)
    {
        errorCallback("No shading language support detected.\nPlease check your graphics drivers are up to date.");
        graphicsDevice = null;
        return;
    }

    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    // Clear the background color of the engine window
    // Black background whilst loading
    var backgroundColor = mathDevice.v4Build(0, 0, 0, 1);

    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(backgroundColor);
        graphicsDevice.endFrame();
    }

    var loadingScreen = null;
    var assetTracker = null;
    var loadingScreenImage = "textures/logo.png";
    var loadingAlpha = 1;
    var logoAlpha = 1;
    // Relative rate at which the loading screen fades
    var fadeRate = 1;

    var clearColor = mathDevice.v4Build(0, 0, 0, 1);

    var inputDeviceParameters = { };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    var soundDeviceParameters = { };
    var soundDevice = TurbulenzEngine.createSoundDevice(soundDeviceParameters);

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

    assetTracker = AssetTracker.create(12, false);
    requestHandler.addEventListener('eventOnload', assetTracker.eventOnLoadHandler);

    loadingScreen = LoadingScreen.create(graphicsDevice, mathDevice, {assetTracker: assetTracker});

    var lastLoadingScreenRender = 0;

    function onAssetLoaded()
    {
        if ((lastLoadingScreenRender + 0.1) < TurbulenzEngine.time)
        {
            if (graphicsDevice.beginFrame())
            {
                loadingScreen.render(1, 1);
                graphicsDevice.endFrame();

                lastLoadingScreenRender = TurbulenzEngine.time;
            }
        }
    }
    assetTracker.setCallback(onAssetLoaded);


    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();
    var renderer;

    var mappingTable = null;

    var maxSpeed = cameraController.maxSpeed;

    var intervalID;
    var duck;
    var duckNodeName = "LOD3sp";
    // Whether or not the duck or watercan assets are currently loading
    var loadingDuck = false;
    var loadingWatercan = false;

    // Array of watercan scene nodes
    var watercans = [];
    var maxNumWaterCans = 3;
    var numWaterCans = 0;
    var watercanNodeName = "node-watercan.obj";
    // Array of transforms (orientation and translation) of watercans
    var watercanTransforms = [];
    var watercanObjAddress = 'models/watercan.obj';

    var soundSource = null;

    // Duck transform
    var duckTransform = mathDevice.m43FromAxisRotation(worldUp, Math.PI / 2);
    var relPos = mathDevice.v3Build(-4.5, 4.7, -3.5);
    mathDevice.m43Translate(duckTransform, relPos);
    var vecScale = mathDevice.v3ScalarBuild(1.5);
    duckTransform = mathDevice.m43Scale(duckTransform, vecScale);

    // First instance watercan transform
    watercanTransforms[0] = mathDevice.m43BuildIdentity();
    relPos = mathDevice.v3Build(-13, 4.85, 4);
    mathDevice.m43Translate(watercanTransforms[0], relPos);
    vecScale = mathDevice.v3ScalarBuild(1 / 4);
    watercanTransforms[0] = mathDevice.m43Scale(watercanTransforms[0], vecScale);

    // Second instance watercan transform
    watercanTransforms[1] = mathDevice.m43FromAxisRotation(worldUp, Math.PI / 2);
    relPos = mathDevice.v3Build(11.5, -1.23, -27);
    mathDevice.m43Translate(watercanTransforms[1], relPos);
    vecScale = mathDevice.v3ScalarBuild(1 / 4);
    watercanTransforms[1] = mathDevice.m43Scale(watercanTransforms[1], vecScale);

    // Third instance watercan transform
    watercanTransforms[2] = mathDevice.m43FromAxisRotation(worldUp, 3 * Math.PI / 4);
    relPos = mathDevice.v3Build(-6.5, 4.90, 2.6);
    mathDevice.m43Translate(watercanTransforms[2], relPos);
    vecScale = mathDevice.v3ScalarBuild(1 / 12);
    watercanTransforms[2] = mathDevice.m43Scale(watercanTransforms[2], vecScale);

    // Html buttons
    var buttonLoadDuck;
    var buttonRemoveDuck;
    var buttonLoadWatercan;
    var buttonRemoveWatercan;
    var buttonCreateWatercanInstance;
    var buttonRemoveWatercanInstance;
    var buttonsAvailable;

    // Remove nodes from the scene, e.g. the duck or watercan(s)
    var destroySceneNode =  function destroySceneNodeFn(node)
    {
        // Remove the node from the scene
        scene.removeRootNode(node);
        // Destroy the node
        node.destroy();
    };

    var isDuckAssetPresent = function isDuckAssetPresentFn()
    {
        // Convert from object/undefined/null to boolean
        return scene.findNode(duckNodeName) ? true : false;
    };

    var isWatercanAssetPresent = function isWatercanAssetPresentFn()
    {
        return scene.findNode(watercanNodeName) ? true : false;
    };

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
            // Sceneloader cannot reliably load several assets concurrently, so disallow loading the watercan too
            buttonLoadWatercan.disabled = true;
        }
    };

    var removeModelDuck = function removeModelDuckFn()
    {
        destroySceneNode(duck);
        // Set references to null
        duck = null;

        if (buttonsAvailable)
        {
            buttonRemoveDuck.disabled = true;
            buttonLoadDuck.disabled = loadingWatercan;
        }
    };

    var loadModelWatercan = function loadModelWatercanFn()
    {
        if (graphicsDevice.isSupported("INDEXFORMAT_UINT"))
        {
            osd.startLoading();

            // Load in the watercan asset
            sceneLoader.load({  scene : scene,
                            append : true,
                            assetPath : "models/watercan.obj",
                            keepLights : false,
                            graphicsDevice : graphicsDevice,
                            mathDevice : mathDevice,
                            textureManager : textureManager,
                            shaderManager : shaderManager,
                            effectManager : effectManager,
                            requestHandler : requestHandler,
                            baseMatrix : watercanTransforms[0],
                            disabled : true
                        });

            // we check this flag in the update loop to know when to call sceneLoader.complete()
            loadingWatercan = true;

            // Update which buttons are clickable
            if (buttonsAvailable)
            {
                buttonLoadWatercan.disabled = true;
                // Sceneloader cannot reliably load several assets concurrently, so disallow loading the duck too
                buttonLoadDuck.disabled = true;
            }
        }
        else
        {
            window.alert("The model can not be displayed. No 'INDEXFORMAT_UINT' support detected.");
        }
    };

    var removeModelWatercan = function removeModelWatercanFn()
    {
        // Remove all instances of the watercan node from the scene, effectively removing the asset
        while (numWaterCans > 1)
        {
            numWaterCans -= 1;
            destroySceneNode(watercans[numWaterCans]);
            watercans[numWaterCans] = null;
        }
        // Delete the source node separately, in case it is hidden.
        if (watercans[0])
        {
            destroySceneNode(watercans[0]);
            watercans[0] = null;
            numWaterCans = 0;
        }

        // Remove choice to add/create instances
        window.$("#watercan-instance-div").addClass("control-hidden");
        // Update which buttons are clickable
        if (buttonsAvailable)
        {
            buttonRemoveWatercan.disabled = true;
            buttonLoadWatercan.disabled = loadingDuck;
            buttonCreateWatercanInstance.disabled = true;
            buttonRemoveWatercanInstance.disabled = true;
        }
    };

    var createWatercanInstance = function createWatercanInstanceFn()
    {
        // Be sure the watercan model is loaded, and there is space for more instances
        if (numWaterCans < maxNumWaterCans && watercans[0] && watercanTransforms[numWaterCans])
        {
            if (numWaterCans <= 0)
            {
                // There are no visible watercans in the scene.
                // This means the original watercan model is hidden, so unhide it.
                watercans[0].enableHierarchy(true);
                numWaterCans = 1;
            }
            else
            {
                // Clone the original watercan model
                watercans[numWaterCans] = watercans[0].clone(watercanNodeName + '-' + numWaterCans);
                watercans[numWaterCans].setLocalTransform(watercanTransforms[numWaterCans]);
                watercans[numWaterCans].enableHierarchy(true);
                scene.addRootNode(watercans[numWaterCans]);
                numWaterCans += 1;
            }
        }

        // Update which buttons are clickable
        if (buttonsAvailable)
        {
            if (numWaterCans > 0)
            {
                buttonRemoveWatercanInstance.disabled = false;
            }
            if (numWaterCans >= maxNumWaterCans)
            {
                buttonCreateWatercanInstance.disabled = true;
            }
        }
    };

    var removeWatercanInstance = function removeWatercanInstanceFn()
    {
        if (numWaterCans < 1 || !watercans[numWaterCans - 1])
        {
            // Function should not have been called, or nothing can be done
            return;
        }
        if (numWaterCans > 1)
        {
            // There are several watercans present in the scene, so delete the latest one.
            numWaterCans -= 1;
            destroySceneNode(watercans[numWaterCans]);
            watercans[numWaterCans] = null;
        }
        else if (numWaterCans === 1)
        {
            // Only one watercan present, so only hide it.
            // Destroying it would mean having to reload the entire asset next time you want to create an instance.
            numWaterCans = 0;
            watercans[0].enableHierarchy(false);
        }

        // Update which buttons are clickable
        if (buttonsAvailable)
        {
            if (numWaterCans <= 0)
            {
                buttonRemoveWatercanInstance.disabled = true;
            }
            if (numWaterCans < maxNumWaterCans)
            {
                buttonCreateWatercanInstance.disabled = false;
            }
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
        id: "buttonLoadWatercan",
        value: "Load",
        fn: loadModelWatercan
    });
    htmlControls.addButtonControl({
        id: "buttonRemoveWatercan",
        value: "Remove",
        fn: removeModelWatercan
    });
    htmlControls.addButtonControl({
        id: "buttonCreateWatercanInstance",
        value: "Create",
        fn: createWatercanInstance
    });
    htmlControls.addButtonControl({
        id: "buttonRemoveWatercanInstance",
        value: "Remove",
        fn: removeWatercanInstance
    });

    buttonLoadDuck = window.document.getElementById("buttonLoadDuck");
    buttonRemoveDuck = window.document.getElementById("buttonRemoveDuck");
    buttonLoadWatercan = window.document.getElementById("buttonLoadWatercan");
    buttonRemoveWatercan = window.document.getElementById("buttonRemoveWatercan");
    buttonCreateWatercanInstance = window.document.getElementById("buttonCreateWatercanInstance");
    buttonRemoveWatercanInstance = window.document.getElementById("buttonRemoveWatercanInstance");
    // check that we can access the buttons
    buttonsAvailable = buttonLoadDuck &&
                        buttonRemoveDuck &&
                        buttonLoadWatercan &&
                        buttonRemoveWatercan &&
                        buttonCreateWatercanInstance &&
                        buttonRemoveWatercanInstance;

    // Set all buttons to be disabled initially
    if (buttonsAvailable)
    {
        buttonLoadDuck.disabled = true;
        buttonLoadWatercan.disabled = true;
        buttonRemoveDuck.disabled = true;
        buttonRemoveWatercan.disabled = true;
        buttonCreateWatercanInstance.disabled = true;
        buttonRemoveWatercanInstance.disabled = true;
    }
    htmlControls.register();

    // Create a callback for post scene load to update the camera position
    var loadWatercanFinished = function loadWatercanFinishedFn(scene)
    {
        osd.stopLoading();

        loadingWatercan = false;
        if (buttonsAvailable)
        {
            // Allow loading of duck if it is not already loaded
            buttonLoadDuck.disabled = isDuckAssetPresent();
        }
        // Once asset is done loading, display it in the scene
        watercans[0] = scene.findNode(watercanNodeName);
        if (watercans[0])
        {
            watercans[0].enableHierarchy(true);
            numWaterCans = 1;
            // Add choice to add/create instances
            window.$("#watercan-instance-div").removeClass("control-hidden");
            if (buttonsAvailable)
            {
                buttonRemoveWatercan.disabled = false;
                buttonCreateWatercanInstance.disabled = false;
                buttonRemoveWatercanInstance.disabled = false;
            }
        }
        else
        {
            // Indicate to the user that the asset could not be loaded properly
            window.$("#watercan-asset-div .control-title").html("Watercan model not accessible");
            window.$("#watercan-asset-div :not(.control-title)").hide();
        }
    };

    var loadDuckFinished = function loadDuckFinishedFn(scene)
    {
        loadingDuck = false;
        duck = scene.findNode(duckNodeName);
        duck.enableHierarchy(true);
        if (buttonsAvailable)
        {
            buttonRemoveDuck.disabled = false;
            // Allow loading of watercan if it is not already loaded
            buttonLoadWatercan.disabled = isWatercanAssetPresent();
        }
    };

    var v3Build = mathDevice.v3Build;

    var onMelodyLoaded = function onMelodyLoadedFn(melody)
    {
        // Play the melody once it is loaded
        if (melody)
        {
            // Skip 2 seconds of no sound
            soundSource.play(melody, 2.0);
        }
    };

    // Load further assets in the background after the essential assets have loaded
    var loadAssetsBackground = function loadAssetsBackgroundFn()
    {
        if (soundDevice) {
            soundSource = soundDevice.createSource({
                // Ambient sound
                relative: true
            });

            var soundURL;
            if (soundDevice.isSupported("FILEFORMAT_OGG"))
            {
                soundURL = mappingTable.getURL("sounds/furelise.ogg");
            }
            else
            {
                soundURL = mappingTable.getURL("sounds/furelise.mp3");
            }

            soundDevice.createSound({
                src: soundURL,
                onload: onMelodyLoaded    // Play as soon as loaded
            });
        }
    };

    // Callback for when the scene is loaded to add some lights
    var loadSceneFinished = function loadSceneFinishedFn(scene)
    {
        // As soon as essential assets (scene) are done loading, start loading unessential assets
        loadAssetsBackground();

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
            buttonLoadWatercan.disabled = false;
        }
    };

    var previousFrameTime;

    // Create some rendering callbacks to pass to the renderer
    var drawExtraDecals = function drawExtraDecalsFn()
    {
    };

    var drawExtraTransparent = function drawExtraTransparentFn()
    {
    };

    var drawDebug = function drawDebugFn()
    {
    };

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
        soundDevice.update();
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

        // If the duck/watercan is loading then check if loading is complete
        if (loadingDuck && sceneLoader.complete())
        {
            loadDuckFinished(scene);
        }
        else if (loadingWatercan && sceneLoader.complete())
        {
            loadWatercanFinished(scene);
        }

        scene.update();

        renderer.update(graphicsDevice, camera, scene, currentTime);

        if (graphicsDevice.beginFrame())
        {
            renderer.draw(graphicsDevice,
                          clearColor,
                          drawExtraDecals,
                          drawExtraTransparent,
                          drawDebug);

            // Fade the loading screen out once scene is done loading
            if (loadingAlpha > 0)
            {
                loadingScreen.render(loadingAlpha, logoAlpha);
                loadingAlpha -= fadeRate * deltaTime;
                // Counter how the logo seems to fade more slowly than the background
                logoAlpha -= 1.3 * fadeRate * deltaTime;
                if (loadingAlpha <= 0)
                {
                    loadingScreen = null;
                }
            }

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
            camera.lookAt(mathDevice.v3Build(-3.5, 5, -0.5), worldUp, mathDevice.v3Build(-18, 15, 12));
            camera.updateViewMatrix();
            camera.updateProjectionMatrix();

            maxSpeed = 30;

            renderer.updateShader(shaderManager);
            intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);

            requestHandler.removeEventListener('eventOnload', assetTracker.eventOnLoadHandler);
            assetTracker = null;

            // Remove the message on the on-screen-display that the game is loading
            osd.stopLoading();
        }
        else if (loadingScreen)
        {
            if (!textureManager.isTextureMissing(loadingScreenImage) &&
                textureManager.isTextureLoaded(loadingScreenImage))
            {
                // Splashscreen not yet ready
                loadingScreen.setTexture(textureManager.get(loadingScreenImage));
            }

            // Essential assets not loaded, show splashscreen if ready
            if (graphicsDevice.beginFrame())
            {
                loadingScreen.render(1, 1);
                graphicsDevice.endFrame();
            }
        }
        else
        {
            // No loading screen image loaded yet, just clear screen
            if (graphicsDevice.beginFrame())
            {
                graphicsDevice.clear(backgroundColor);
                graphicsDevice.endFrame();
            }
        }
    };

    // Start calling the loading loop at 10Hz
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);
    previousFrameTime = TurbulenzEngine.time;

    var loadAssets = function loadAssetsFn()
    {
        // Load the loading screen texture now we have the remapping table
        textureManager.load(loadingScreenImage, true);

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
                            requestHandler : requestHandler,
                            postSceneLoadFn : loadSceneFinished
                        });
    };

    var mappingTableReceived = function mappingTableReceivedFn(mt)
    {
        var watercanURL;
        var newPrefix = 'https://turbulenz.s3.amazonaws.com/samples/staticmax/';

        // Store mapping table for background loading later on
        mappingTable = mt;
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

        // Manually reassign the mapping table to get the watercan from a predefined web address,
        // rather than where the rest of the assets reside
        watercanURL = mappingTable.getURL(watercanObjAddress);
        var urlSplit = watercanURL.split("/");
        var assetname = urlSplit[urlSplit.length - 1];
        mappingTable.map(watercanObjAddress, newPrefix + assetname);

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

        if (removeModelWatercan)
        {
            removeModelWatercan();
        }

        assetTracker = null;
        loadingScreen = null;

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        errorCallback = null;
        graphicsDeviceParameters = null;
        mathDeviceParameters = null;
        inputDeviceParameters = null;
        soundDeviceParameters = null;
        mappingTable = null;
        watercans = null;
        duck = null;

        if (soundSource)
        {
            soundSource.destroy();
            soundSource = null;
        }

        watercanTransforms = null;
        buttonLoadDuck = null;
        buttonLoadWatercan = null;
        buttonRemoveDuck = null;
        buttonRemoveWatercan = null;
        buttonCreateWatercanInstance = null;
        buttonRemoveWatercanInstance = null;
        buttonsAvailable = null;
        loadModelDuck = null;
        removeModelDuck = null;
        removeModelWatercan = null;
        loadWatercanFinished = null;
        loadDuckFinished = null;
        v3Build = null;
        onMelodyLoaded = null;
        loadAssetsBackground = null;
        loadSceneFinished = null;
        drawDebug = null;
        drawExtraDecals = null;
        drawExtraTransparent = null;
        update = null;
        loadingLoop = null;
        loadAssets = null;
        mappingTableReceived = null;
        gameSessionCreated = null;

        osd = null;
        sceneLoader = null;
        if (requestHandler)
        {
            requestHandler.destroy();
            requestHandler = null;
        }

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
        soundDevice = null;
    };
};
