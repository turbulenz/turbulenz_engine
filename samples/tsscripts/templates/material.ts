/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Material
 * @description:
 * This sample shows how to load materials, how to create them procedurally, and how to apply them to renderables in the scene.
 * You can select and apply different materials using different rendering effects to the rotation model.
*/

/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/camera.js") }}*/
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

/*{{ javascript("scripts/sceneloader.js") }}*/
/*{{ javascript("scripts/motion.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global Motion: false */
/*global RequestHandler: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global Camera: false */
/*global HTMLControls: false */
/*global DefaultRendering: false */
/*global VMath: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

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

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();
    var renderer;
    // Setup world space
    var worldUp = mathDevice.v3BuildYAxis();

    // Setup a camera to view a close-up object
    var camera = Camera.create(mathDevice);
    var cameraDistanceFactor = 1.0;
    camera.nearPlane = 0.05;

    // Choice of materials to view:
    //
    //  'defaultMaterialName'   : A material with a texture and technique set on the object by the scene
    //  colouredMaterial        : A material with a materialColor and technique that uses material Color to render
    //  newTextureMaterial      : A material with a new texture other than the one specified by the scene

    // The material list
    var materials = {
        newTextureMaterial : {
            effect : "phong",
            parameters : {
                diffuse : "textures/brick.png"
            }
        },
        coloredMaterial : {
            effect : "constant",
            meta : {
                materialcolor : true
            },
            parameters : {
                materialColor : VMath.v4Build(1.0, 0.1, 0.1, 1.0)
            }
        }
    };

    // We will find the default material name after the scene is loaded
    var defaultMaterialName;

    // The name of the node we want to rotate to demonstrate the material
    var nodeName = "LOD3sp";
    var objectNode = null;
    var objectInstance = null;

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

    // Controls
    var htmlControls = HTMLControls.create();

    htmlControls.addRadioControl({
        id : "radio01",
        groupName : "materialType",
        radioIndex : 0,
        value : "default",
        fn : function ()
            {
                if (objectInstance)
                {
                    var materialName = defaultMaterialName;
                    var material = materials[materialName];
                    if (material && material.loaded)
                    {
                        // Set the material to use on the node
                        objectInstance.setMaterial(scene.getMaterial(materialName));
                    }
                }
            },
        isDefault : true
    });

    htmlControls.addRadioControl({
        id : "radio02",
        groupName : "materialType",
        radioIndex : 1,
        value : "coloured",
        fn : function ()
            {
                if (objectInstance)
                {
                    var materialName = "coloredMaterial";
                    var material = materials[materialName];
                    if (material && material.loaded)
                    {
                        objectInstance.setMaterial(scene.getMaterial(materialName));
                    }
                }
            },
        isDefault : false
    });

    htmlControls.addRadioControl({
        id : "radio03",
        groupName : "materialType",
        radioIndex : 2,
        value : "newTexture",
        fn : function ()
            {
                if (objectInstance)
                {
                    var materialName = "newTextureMaterial";
                    var material = materials[materialName];
                    if (material && material.loaded)
                    {
                        // Set the material to use on the node
                        objectInstance.setMaterial(scene.getMaterial(materialName));
                    }
                }
            },
        isDefault : false
    });
    htmlControls.register();

    var intervalID;
    var loadingLoop = function loadingLoopFn()
    {
        if (sceneLoader.complete())
        {
            TurbulenzEngine.clearInterval(intervalID);

            // For the default texture, take the result loaded by the scene
            objectNode = scene.findNode(nodeName);
            if (objectNode)
            {
                if (objectNode.hasRenderables())
                {
                    objectInstance = objectNode.renderables[0];
                    defaultMaterialName = objectInstance.getMaterial().getName();
                    if (defaultMaterialName)
                    {
                        // We don't have the material parameters or effect, but we can refer to it by name
                        materials[defaultMaterialName] = {};
                        materials[defaultMaterialName].loaded = true;
                        scene.getMaterial(defaultMaterialName).reference.add();
                    }
                }
            }
            var sceneExtents = scene.getExtents();
            var sceneMinExtent = mathDevice.v3Build(sceneExtents[0], sceneExtents[1], sceneExtents[2]);
            var sceneMaxExtent = mathDevice.v3Build(sceneExtents[3], sceneExtents[4], sceneExtents[5]);
            var center = mathDevice.v3ScalarMul(mathDevice.v3Add(sceneMaxExtent, sceneMinExtent), 0.5);
            var extent = mathDevice.v3Sub(center, sceneMinExtent);

            camera.lookAt(center, worldUp, mathDevice.v3Build(center[0] + extent[0] * 2 * cameraDistanceFactor,
                                                              center[1] + extent[1] * cameraDistanceFactor,
                                                              center[2] + extent[2] * 2 * cameraDistanceFactor));
            camera.updateViewMatrix();

            renderer.updateShader(shaderManager);

            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

    var postLoad = function postLoadFn()
    {
        for (var m in materials)
        {
            if (materials.hasOwnProperty(m))
            {
                if (scene.loadMaterial(graphicsDevice, textureManager, effectManager, m, materials[m]))
                {
                    materials[m].loaded = true;
                    scene.getMaterial(m).reference.add();
                }
                else
                {
                    errorCallback("Failed to load material: " + m);
                }
            }
        }
    };

    var loadAssets = function loadAssetsFn()
    {
        // Renderer for the scene (requires shader assets).
        renderer = DefaultRendering.create(graphicsDevice,
                                           mathDevice,
                                           shaderManager,
                                           effectManager);

        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));

        // Create object using scene loader
        sceneLoader.load({
            scene : scene,
            assetPath : "models/duck.dae",
            graphicsDevice : graphicsDevice,
            mathDevice : mathDevice,
            textureManager : textureManager,
            effectManager : effectManager,
            shaderManager : shaderManager,
            requestHandler: requestHandler,
            append : false,
            dynamic : true,
            postSceneLoadFn : postLoad
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

        clearColor = null;

        rotation = null;
        if (scene)
        {
            scene.destroy();
            scene = null;
        }
        requestHandler = null;

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        materials = null;

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
    };
};
