/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Morphing
 * @description:
 * This sample loads a model with four morph targets and blends between them.
 * This kind of geometry manipulation can make the model appear to stretch, squash or twist.
 * You can drag the sliders around to modify how much to apply each morph target to the original geometry.
*/

/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/light.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/scenedebugging.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/defaultrendering.js") }}*/
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
/*{{ javascript("scripts/motion.js") }}*/

/*{{ javascript("scripts/morph.js") }}*/

/*global TurbulenzEngine: true */
/*global Morph: false */
/*global MorphInstance: false */
/*global MorphShape: false */
/*global loadCustomFileShapeFn: false */
/*global RequestHandler: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Camera: false */
/*global CameraController: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global HTMLControls: false */
/*global SceneNode: false */
/*global DefaultRendering: false */
/*global TurbulenzServices: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

    var graphicsDeviceParameters = {};
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

    var inputDeviceParameters = {};
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var assetName = "models/duck_morph.dae";

    var shapes = {};
    var fileShapeCount = 0;

    var morphs = [];
    var morphNodes = [];
    var morphInstances = [];

    var currentMaterial = "blinnMorphMaterial";
    var materials = {
        debugNormalsMorphMaterial : {
            effect: "debug_normals_morph",
            parameters : {
                morphWeights : [0.0, 0.0, 0.0]
            }
        },
        blinnMorphMaterial : {
            effect: "blinn_morph",
            parameters : {
                diffuse : "textures/duck.png",
                morphWeights : [0.0, 0.0, 0.0]
            }
        }
    };

    var setMaterial = function setMaterialFn(materialName)
    {
        var morphInstancesLen = morphInstances.length;
        for (var i = 0; i < morphInstancesLen; i += 1)
        {
            morphInstances[i].setMaterial(materials[materialName]);
        }
    };

    var renderer;

    // The maximum number of morph shapes the effects/shader supports (includes base shape)
    var maxMorphShapes = 4;

    // The weights that are modified at runtime, to calculate a relative morph
    var weights = [ 0.0, 0.0, 0.0 ];

    // Slider settings for weights
    var weightScaleMax = 1.0;
    var weightScaleMin = 0.0;
    var weightStep = 0.01;

    // Slider settings for node rotation
    var rotation = 3.5;
    var lastRotation = 0;
    var rotationMax = Math.PI * 2;
    var rotationMin = 0;
    var rotationStep = 0.1;

    // Initial camera view
    var lookAtScaleFactor = 0.4;
    var cameraPos = mathDevice.v3Build(-5 * lookAtScaleFactor, 4 * lookAtScaleFactor, 5 * lookAtScaleFactor);
    var lightPos = mathDevice.v3Build(-1 * lookAtScaleFactor, 50 * lookAtScaleFactor, -5 * lookAtScaleFactor);
    var targetPos = mathDevice.v3Build(-0.3, 1, 0);
    var up = mathDevice.v3Build(0, 1, 0);

    // Setup camera & controller
    var camera = Camera.create(mathDevice);
    camera.nearPlane = 0.05;
    camera.lookAt(targetPos, up, cameraPos);
    camera.updateViewMatrix();
    camera.updateProjectionMatrix();

    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);
    var maxSpeed = cameraController.maxSpeed;

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();

    // Controls
    var htmlControls = HTMLControls.create();

    htmlControls.addRadioControl({
        id : "radio04",
        groupName : "materialType",
        radioIndex : 0,
        value : "Debug Normals",
        fn : function ()
        {
            currentMaterial = "debugNormalsMorphMaterial";
            setMaterial(currentMaterial);
        },
        isDefault : false
    });

    htmlControls.addRadioControl({
        id : "radio03",
        groupName : "materialType",
        radioIndex : 1,
        value : "Textured Blinn",
        fn : function ()
        {
            currentMaterial = "blinnMorphMaterial";
            setMaterial(currentMaterial);
        },
        isDefault : true
    });

    var sliderTarget1ID = "slider1";
    var sliderTarget2ID = "slider2";
    var sliderTarget3ID = "slider3";
    var sliderRotateID = "slider4";

    var registerSliders = function registerSlidersFn()
    {
        htmlControls.addSliderControl({
            id: sliderTarget1ID,
            value: weights[0],
            max: weightScaleMax,
            min: weightScaleMin,
            step: weightStep,
            fn: function ()
            {
                var val = this.value;
                weights[0] = val;
                htmlControls.updateSlider(sliderTarget1ID, val);
            }
        });

        htmlControls.addSliderControl({
            id: sliderTarget2ID,
            value: weights[1],
            max: weightScaleMax,
            min: weightScaleMin,
            step: weightStep,
            fn: function ()
            {
                var val = this.value;
                weights[1] = val;
                htmlControls.updateSlider(sliderTarget2ID, val);
            }
        });

        htmlControls.addSliderControl({
            id: sliderTarget3ID,
            value: weights[2],
            max: weightScaleMax,
            min: weightScaleMin,
            step: weightStep,
            fn: function ()
            {
                var val = this.value;
                weights[2] = val;
                htmlControls.updateSlider(sliderTarget3ID, val);
            }
        });

        htmlControls.addSliderControl({
            id: sliderRotateID,
            value: rotation,
            max: rotationMax,
            min: rotationMin,
            step: rotationStep,
            fn: function ()
            {
                var val = this.value;
                rotation = val;
                htmlControls.updateSlider(sliderRotateID, val);
            }
        });

        htmlControls.register();
    };

    // Initialize the previous frame time
    var previousFrameTime;
    var intervalID;

    // Callback for when the scene data is available, pre load
    var preLoadScene = function preLoadSceneFn(data)
    {
        var shapesArray;
        var geometries = data.geometries;
        if (geometries)
        {
            for (var g in geometries)
            {
                if (geometries.hasOwnProperty(g))
                {
                    shapesArray = shapes[assetName];
                    if (!shapesArray)
                    {
                        shapesArray = [];
                        shapes[assetName] = shapesArray;
                    }

                    shapesArray[shapesArray.length] = {
                        weight: 0.0, // Set weight to 0.0, could load default weight from file
                        shape: geometries[g]
                    };
                    fileShapeCount += 1;
                }
            }
        }
    };

    var loadMorphShape = function loadMorphShapeFn(name, index)
    {
        var shapeArray = shapes[name];
        if (!shapeArray)
        {
            return null;
        }

        var shape = shapeArray[index];
        if (!shape)
        {
            return null;
        }

        var morphShape = MorphShape.create(shape.weight);
        var loadShapeParams = {
            graphicsDevice : graphicsDevice,
            useVertexBufferManager : false,
            dynamicVertexBuffers : false // Only works without vertexBufferManager
        };

        // loadShapeParams also takes parameter "onGeometryDestroyed : function (data) {}"
        // Can be used as a callback for when the geometry is destroyed

        // Use a custom shape loader to process the shape data from file
        loadCustomFileShape(name, morphShape, shape.shape, loadShapeParams);
        return morphShape;
    };

    // Callback for when the scene is loaded to assign nodes
    function loadSceneFinished(scene)
    {
        var morphShape = loadMorphShape(assetName, 0);
        var morph = Morph.create(morphShape);
        var morphShapes = [];

        var i;
        for (i = 1; i < maxMorphShapes; i += 1)
        {
            morphShape = loadMorphShape(assetName, i);
            if (morphShape)
            {
                morphShapes[morphShapes.length] = morphShape;
                weights[i - 1] = morphShape.initialWeight;
            }
        }
        if ((morphShapes.length !== 0) && morph.addShapes(morphShapes))
        {
            morphs.push(morph);
        }
        else
        {
            window.alert("Could not add shapes to morph. Please check the morph shapes are compatible");
            return;
        }

        var morphsLen = morphs.length;
        for (i = 0; i < morphsLen; i += 1)
        {
            morphNodes[i] = SceneNode.create({ name : "MorphNode" + i, dynamic : true});
            scene.addRootNode(morphNodes[i]);
        }

        for (var m in materials)
        {
            if (materials.hasOwnProperty(m))
            {
                scene.loadMaterial(graphicsDevice, textureManager, effectManager, m, materials[m]);
            }
        }

        // registerSliders having loaded the initial weights
        registerSliders();
    }

    //
    // Update
    //
    var update = function updateFn()
    {
        var transform = null;
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }
        cameraController.maxSpeed = (deltaTime * maxSpeed);

        inputDevice.update();

        cameraController.update();

        var deviceWidth = graphicsDevice.width;
        var deviceHeight = graphicsDevice.height;
        var aspectRatio = (deviceWidth / deviceHeight);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        if (rotation !== lastRotation)
        {
            transform = mathDevice.m43FromAxisRotation(up, rotation);
            lastRotation = rotation;
        }

        var morphNodesLen = morphNodes.length;
        for (var i = 0; i < morphNodesLen; i += 1)
        {
            if (transform)
            {
                morphNodes[i].setLocalTransform(transform);
            }
            morphInstances[i].setWeights(mathDevice.v3Build(weights[0], weights[1], weights[2]));
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

    var loadingPostSceneEffects = function loadingPostSceneEffectsFn()
    {
        var material;

        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(clearColor);
            graphicsDevice.endFrame();
        }

        if ((!textureManager || 0 === textureManager.getNumPendingTextures()) &&
            (!shaderManager || 0 === shaderManager.getNumPendingShaders()))
        {
            TurbulenzEngine.clearInterval(intervalID);

            for (var m in materials)
            {
                if (materials.hasOwnProperty(m))
                {
                    material = scene.getMaterial(m);
                    if (material)
                    {
                        // Add additional references to materials, to avoid them being removed when not in use
                        material.reference.add();
                    }
                    materials[m] = material;
                }
            }

            var morphNodesLen = morphNodes.length;
            var morphInstance;
            for (var i = 0; i < morphNodesLen; i += 1)
            {
                morphInstance = MorphInstance.create(morphs[i], materials[currentMaterial]);
                morphNodes[i].addRenderable(morphInstance);
                morphInstances[i] = morphInstance;
            }

            // All resources loaded, start the render update
            intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
        }
    };

    var loadingScene = function loadingSceneFn()
    {
        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(clearColor);
            graphicsDevice.endFrame();
        }

        if (sceneLoader.complete())
        {
            TurbulenzEngine.clearInterval(intervalID);

            // Starts the loop that will wait for resources required, post scene load
            intervalID = TurbulenzEngine.setInterval(loadingPostSceneEffects, 1000 / 10);
        }
    };

    var loadingDefaultEffects = function loadingDefaultEffectsFn()
    {
        if ((!textureManager || 0 === textureManager.getNumPendingTextures()) &&
            (!shaderManager || 0 === shaderManager.getNumPendingShaders()))
        {
            TurbulenzEngine.clearInterval(intervalID);

            // Start the loading of the scene
            sceneLoader.load({  scene : scene,
                                append : false,
                                assetPath : assetName,
                                graphicsDevice : graphicsDevice,
                                mathDevice : mathDevice,
                                textureManager : textureManager,
                                shaderManager : shaderManager,
                                effectManager : effectManager,
                                requestHandler : requestHandler,
                                preSceneLoadFn : preLoadScene,
                                postSceneLoadFn : loadSceneFinished
                            });

            // Starts the loop that will wait for the scene to load
            intervalID = TurbulenzEngine.setInterval(loadingScene, 1000 / 10);
        }
    };

    var loadAssets = function loadAssetsFn()
    {
        // Renderer for the scene (requires shader assets).
        renderer = DefaultRendering.create(graphicsDevice,
                                                    mathDevice,
                                                    shaderManager,
                                                    effectManager);
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));
        renderer.setDefaultTexture(textureManager.get("default"));

        // Setup light based on lookAtScaleFactor
        renderer.setGlobalLightPosition(lightPos);

        // Register the effects that are required for morphing
        MorphInstance.registerEffects(mathDevice, renderer, shaderManager, effectManager);

        // Starts the loop that will wait for the shaders and textures required by the default effects registered with the renderer
        intervalID = TurbulenzEngine.setInterval(loadingDefaultEffects, 1000 / 10);
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

    TurbulenzEngine.onunload = function destroyScene()
    {
        TurbulenzEngine.clearInterval(intervalID);

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        var material = null;
        for (var m in materials)
        {
            if (materials.hasOwnProperty(m))
            {
                material = scene.getMaterial(m);
                if (material)
                {
                    // Remove additional references to materials, we no longer need them
                    material.reference.remove();
                }
            }
        }
        currentMaterial = null;

        sliderTarget1ID = null;
        sliderTarget2ID = null;
        sliderTarget3ID = null;
        sliderRotateID = null;

        if (scene)
        {
            scene.destroy();
            scene = null;
        }
        requestHandler = null;
        sceneLoader = null;

        cameraPos = null;
        lightPos = null;
        targetPos = null;
        up = null;

        assetName = null;

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        htmlControls = null;
        cameraController = null;
        camera = null;

        weights = null;

        morphInstances = null;
        morphNodes = null;
        morphs = null;
        shapes = null;

        materials = null;
        clearColor = null;

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
        inputDevice = null;
        graphicsDevice = null;
        mathDevice = null;
    };

    previousFrameTime = TurbulenzEngine.time;
};
