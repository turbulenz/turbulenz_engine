/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Multiple animations
 * @description:
 * This sample demonstrates how the Turbulenz engine can render a high number of animated skinned characters each one
 * with their own separate animation.
 * You can use the slider to increase or decrease the number of character to animate and render at the same time.
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
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/animationmanager.js") }}*/
/*{{ javascript("jslib/animation.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/scenedebugging.js") }}*/
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

/*global TurbulenzEngine: false */
/*global RequestHandler: false */
/*global DefaultRendering: false */
/*global TurbulenzServices: false */
/*global Camera: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global AnimationManager: false */
/*global Scene: false */
/*global SkinnedNode: false */
/*global GPUSkinController: false */
/*global SceneLoader: false */
/*global ResourceLoader: false */
/*global InterpolatorController: false */
/*global VMath: false */
/*global HTMLControls: false */
/*global window: false */

// We put some custom data onto Scene
class CustomScene extends Scene
{
    skinnedNodes: SceneNode[];
};


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
    var animationManager = AnimationManager.create(errorCallback);

    // The model used for this sample only has 20 bones so we optimize for it.
    // Ideally you will modify the source shader code instead of patching at runtime
    // but this is done here for convenience.
    shaderManager.setAutomaticParameterResize("skinBones", 20 * 3);

    var resourceLoader = ResourceLoader.create();
    var scene = <CustomScene>(Scene.create(mathDevice));
    var sceneLoader = SceneLoader.create();
    var mappingTable;
    var renderer;

    // Setup world space
    var worldUp = mathDevice.v3BuildYAxis();

    // Setup a camera to view a close-up object
    var camera = Camera.create(mathDevice);
    camera.nearPlane = 0.05;
    camera.updateViewMatrix();

    var animMinExtent, animMaxExtent;

    var cameraDistanceFactor = 1.2;
    var cameraDir = [-1, 1, -1]; // The +/- direction the camera is moved from the scene in each axis

    // Settings for the animation
    var settings = {
        animScale: 1,
        defaultRate: 1,
        drawDebug: false,
        drawInterpolators: false,
        drawWireframe: false,
        loopAnimation: true
    };

    // This is our base asset that includes a character and animations
    var assetToLoad = "models/Seymour.dae";

    var character = {
        count: 64,                      // N characters arranged in a grid
        max: 400,                       // The maximum count for (20x20) grid characters
        min: 1,                         // The minimum count for (1x1) grid characters
        lastCount: 1,                   // charCount != lastcharCount to ensure grid is initially set
        startPos: [0.0, 0.0, 0.0],      // The position of the first item in the grid
        gridSpace: 0.1,                 // unit space between each character
        baseAngle: 135,                 // The base angle all characters should rotate
        varAngle: 270,                  // Variation angle range from the base angle
        height: 0.1                     // The max height of the characters on the grid
    };

    var deg2Rad = (Math.PI / 180); // Pre-calculate conversion value

    // Materials to use for grid characters
    var materials = {
        seymour10: {
            parameters: {
                diffuse: "textures/boy_10.png"
            },
            effect: "lambert"
        },
        seymour20: {
            parameters: {
                diffuse: "textures/boy_20.png"
            },
            effect: "lambert"
        },
        seymour30: {
            parameters: {
                diffuse: "textures/boy_30.png"
            },
            effect: "lambert"
        },
        seymour40: {
            parameters: {
                diffuse: "textures/boy_40.png"
            },
            effect: "lambert"
        },
        seymour50: {
            parameters: {
                diffuse: "textures/boy_50.png"
            },
            effect: "lambert"
        }
    };

    // Helper function for setting material on skeleton hierarchy
    var setMaterialHierarchy = function setMaterialHierarchyFn(scene, node, materialName)
    {
        var renderables = node.renderables;
        if (renderables)
        {
            var material = scene.getMaterial(materialName);
            var numRenderables = renderables.length;
            for (var i = 0; i < numRenderables; i += 1)
            {
                renderables[i].setMaterial(material);
            }
        }
        var children = node.children;
        if (children)
        {
            var numChildren = children.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                var child = children[c];
                setMaterialHierarchy(scene, child, materialName);
            }
        }
    };

    // The list of animations to load pre-scene load (by reference)
    // This is only for animations that are not included in the default scene
    // e.g. "animations/default_walking.anim"
    var addAnimations = ["models/Seymour_anim2_rot90_anim_only.dae"];

    // The list of animations to be removed from the scene data pre-load
    // This is for undesired animations that are packed in the scene
    // All these animations are not required for this sample
    var removeAnimations = ["default_astroboy_w_skel02_gog_polySurface5",
                            "default_astroboy_w_skel02_polySurface5",
                            "default_astroboy_w_skel02c_gog_polySurface5",
                            "default_astroboy_w_skel02c_polySurface5",
                            "default_gog_polySurface5",
                            "default_polySurface5"];


    var animationsLoaded;
    // When the JSON is loaded, add a prefix to uniquely identify that set of animation data
    var animationsLoadedCallback = function animationsLoadedCallbackFn(jsonData) {
        var addAnimNum = (addAnimations.length - animationsLoaded);
        animationManager.loadData(jsonData, "AnimExtra" + addAnimNum + "-");
        animationsLoaded -= 1;
    };

    var addAnimationsToScene = function addAnimationsToSceneFn()
    {
        // Attach additional animations to the scene (specify by path)
        // The animations are added by reference and the scene will attempt to load them using request
        animationsLoaded = addAnimations.length;
        for (var i = 0; i < addAnimations.length; i += 1)
        {
            var path = addAnimations[i];
            resourceLoader.load(mappingTable.getURL(path), {
                append : true,
                onload : animationsLoadedCallback,
                requestHandler : requestHandler
            });
        }
    };

    var removeAnimationsFromScene = function removeAnimationsFromSceneFn(sceneData)
    {
        // Remove unrequired animations from scene, if they exist before load
        var anims = sceneData.animations;
        var animationRef;

        if (anims)
        {
            for (var i = 0; i < removeAnimations.length; i += 1)
            {
                animationRef = removeAnimations[i];
                if (anims[animationRef])
                {
                    delete anims[animationRef];
                }
            }
        }
    };


    // Calculates a position for the camera to lookAt
    var resetCamera = function resetCameraFn(camera)
    {
        var ceil = Math.ceil;
        var ex = character.gridSpace * ceil(Math.sqrt(character.count));
        animMinExtent = mathDevice.v3BuildZero();
        animMaxExtent = mathDevice.v3Build(ex, character.height, ex);

        // Update the camera to scale to the size of the scene
        var center = mathDevice.v3ScalarMul(mathDevice.v3Add(animMaxExtent, animMinExtent), 0.5);
        var extent = mathDevice.v3Sub(center, animMinExtent);

        camera.lookAt(center,
                      worldUp,
                      mathDevice.v3Build(center[0] + extent[0] * cameraDistanceFactor * cameraDir[0],
                                         center[1] + extent[1] * cameraDistanceFactor * cameraDir[1] * 4,
                                         center[2] + extent[2] * cameraDistanceFactor * cameraDir[2]));
        camera.updateViewMatrix();

        // Calculates the appropriate nearPlane for the animation extents
        var len = VMath.v3Length(extent);
        if (len < 4.0)
        {
            camera.nearPlane = len * 0.1;
        }
        else
        {
            camera.nearPlane = 1.0;
        }
        camera.farPlane = ceil(len) * 100.0;
        camera.updateProjectionMatrix();
    };

    // Controls
    var htmlControls = HTMLControls.create();

    var slider01ID = "slider1";

    htmlControls.addSliderControl({
        id: slider01ID,
        value: character.count,
        max: character.max,
        min: character.min,
        step: 1,
        fn: function ()
        {
            var val = this.value;
            character.count = val;
            htmlControls.updateSlider(slider01ID, val);
        }
    });

    htmlControls.register();


    // Initialise character animations
    var initCharacters = function initCharactersFn()
    {
        var n, i, j, k, x, y, node, characterAngle;

        var nodeHasSkeleton = animationManager.nodeHasSkeleton;
        var sceneNodes = scene.rootNodes;
        var numNodes = sceneNodes.length;
        var random = Math.random;
        var floor = Math.floor;
        var ceil = Math.ceil;

        // We want to create resources for the maximum grid elements we want to use
        var gridDim = ceil(Math.sqrt(character.max));
        var gridSpace = character.gridSpace;
        var startX = character.startPos[0];
        var startY = character.startPos[2];
        var varAngle = character.varAngle;
        var halfVarAngle = varAngle / 2;
        var baseAngle = character.baseAngle;
        var currentNodeIndex = 0;

        var newNodes = [];

        // These will be the reference node hierarchies for each material we use
        // Instead of cloning the base node in the scene we will clone the reference node, because the material is already set
        var referenceNodes = [];
        referenceNodes.push("seymour10");
        referenceNodes.push("seymour20");
        referenceNodes.push("seymour30");
        referenceNodes.push("seymour40");
        referenceNodes.push("seymour50");

        var refLength = referenceNodes.length;

        var nodePos, nodeMaterialID, refNode, newNode, nodeName, matrix;
        var v3Build = mathDevice.v3Build;
        var m43FromAxisRotation = mathDevice.m43FromAxisRotation;
        var m43SetPos = mathDevice.m43SetPos;

        // For each node find which ones have skeletons
        for (n = 0; n < numNodes; n += 1)
        {
            node = sceneNodes[n];
            var skeleton = nodeHasSkeleton(node);
            if (skeleton)
            {
                // Clone nodes to match the grid dimensions
                for (i = 0; i < gridDim; i += 1)
                {
                    for (j = 0; j < gridDim; j += 1)
                    {
                        if ((i === 0) && (j === 0))
                        {
                            // Use the orginal node as the basis, so don't create one
                            node.gridNum = 1;
                            continue;
                        }
                        nodeMaterialID = floor(refLength * random()) % refLength;
                        refNode = referenceNodes[nodeMaterialID];
                        if (typeof refNode === 'string')
                        {
                            // Create the first instance of the node, from the material name 'refNode'
                            nodeName = node.name + "_" + refNode;
                            newNode = scene.cloneRootNode(node, nodeName);

                            // Sets the material on this node and its children
                            setMaterialHierarchy(scene, newNode, refNode);

                            // Assign the new hierarchy as a reference
                            referenceNodes[nodeMaterialID] = newNode;
                        }
                        else
                        {
                            // Clone the reference node
                            newNode = scene.cloneRootNode(refNode, refNode.name + currentNodeIndex);
                        }

                        // CharacterAngle is the random angle of rotation
                        characterAngle = baseAngle + (halfVarAngle - (varAngle * random()));

                        // x and y are the top down grid positions
                        x = (i * gridSpace) + startX;
                        y = (j * gridSpace) + startY;
                        nodePos = v3Build.call(mathDevice, x, 0, y);

                        // Create a matrix from the angle
                        matrix = m43FromAxisRotation.call(mathDevice, worldUp, characterAngle * deg2Rad);
                        m43SetPos.call(mathDevice, matrix, nodePos);
                        newNode.setLocalTransform(matrix);
                        // Set the grid position identifiers for our nodes
                        // We can find the node grid position later
                        newNode.gridX = i;
                        newNode.gridY = j;


                        if (i > j)
                        {
                            k = (i + 1);
                            k *= k;
                            newNode.gridNum = k - (2 * i) + j;
                        }
                        else
                        {
                            k = (j + 1);
                            k *= k;
                            newNode.gridNum = k - j + i;
                        }

                        newNodes.push(newNode);
                        currentNodeIndex += 1;
                    }

                }
            }
        }
    };

    // Initialise all animations with InterpolatorControllers set to start time
    var initAnimations = function initAnimationsFn(scene)
    {
        var a, n, interp, skinnedNode, node;
        var nodeHasSkeleton = animationManager.nodeHasSkeleton;
        var sceneNodes = scene.rootNodes;
        var sceneAnimations = animationManager.getAll();
        var numNodes = sceneNodes.length;

        var random = Math.random;
        var floor = Math.floor;

        var animations = [];
        var animationsLength = 0;

        // Enumerate the animations for quick access by index
        for (a in sceneAnimations)
        {
            if (sceneAnimations.hasOwnProperty(a))
            {
                animations.push(sceneAnimations[a]);
            }
        }
        animationsLength = animations.length;

        scene.skinnedNodes = [];

        var randomIndex = 0;
        // For each node find which ones have skeletons
        for (n = 0; n < numNodes; n += 1)
        {
            node = sceneNodes[n];
            var skeleton = nodeHasSkeleton(node);
            if (skeleton)
            {
                // Randomly select an animation
                randomIndex = (floor(random() * 100) + randomIndex) % animationsLength;
                var animation = animations[randomIndex];

                // Create an interpolation controller
                interp = InterpolatorController.create(animation.hierarchy);
                interp.setAnimation(animation, settings.loopAnimation);
                // Set a different start time for each looping animation (for variation)
                interp.setTime(animation.length * random());
                interp.setRate(settings.defaultRate);

                // Create a skinnedNode
                skinnedNode = SkinnedNode.create(graphicsDevice, mathDevice, node, skeleton, interp);
                skinnedNode.active = false; // Set inactive until the grid size is set
                scene.skinnedNodes.push(skinnedNode);
            }
        }

        return true;
    };

    // Initialize the previous frame time
    var previousFrameTime = TurbulenzEngine.time;
    var nextGridUpdateTime = 0;
    var fpsElement = document.getElementById("fpscounter");
    var lastFPS = '';

    var updateFPSCounter = function updateFPSCounterFn()
    {
        fpsElement.innerHTML = (lastFPS + ' fps');
    };

    var renderFrame = function renderFrameFn()
    {
        var skinnedNodes, numSkins, skinnedNode, sceneNode, skin;
        var currentCharacterCount = character.count;
        var resetGrid = false;

        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }

        // Update animated grid
        if (currentTime >= nextGridUpdateTime)
        {
            nextGridUpdateTime = (currentTime + 0.5);

            resetGrid = (currentCharacterCount !== character.lastCount);
            character.lastCount = currentCharacterCount;

            if (fpsElement)
            {
                var currentFPS = (graphicsDevice.fps).toFixed(2);
                if (lastFPS !== currentFPS)
                {
                    lastFPS = currentFPS;

                    // Execute any code that interacts with the DOM in a separate callback
                    TurbulenzEngine.setTimeout(updateFPSCounter, 1);
                }
            }
        }

        if (resetGrid)
        {
            resetCamera(camera);
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

        skinnedNodes = scene.skinnedNodes;
        numSkins = skinnedNodes.length;

        for (skin = 0; skin < numSkins; skin += 1)
        {
            skinnedNode = skinnedNodes[skin];
            sceneNode = skinnedNode.node;

            // Sets the active flag for this skinned node
            if (resetGrid)
            {
                var gridNum = sceneNode.gridNum;
                if (gridNum !== undefined)
                {
                    skinnedNode.active = (gridNum <= currentCharacterCount);
                }
                else
                {
                    // Default model or not in the grid, so set active
                    skinnedNode.active = true;
                }

            }

            // If active, update the controller and ensure the hierarchy is visible
            if (skinnedNode.active)
            {
                if (sceneNode.getDisabled())
                {
                    sceneNode.enableHierarchy(true);
                }

                // The skinned node will peform the update
                skinnedNode.addTime(deltaTime);
                skinnedNode.update(true);
            }
            else
            {
                if (!sceneNode.getDisabled())
                {
                    sceneNode.enableHierarchy(false);
                }
            }
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

        previousFrameTime = currentTime;
    };

    var intervalID;
    var loadingLoop = function loadingLoopFn()
    {
        if (sceneLoader.complete() && animationsLoaded === 0)
        {
            TurbulenzEngine.clearInterval(intervalID);

            // Adds character nodes to the scene
            initCharacters();

            // Init the animations from the scene
            initAnimations(scene);

            // Intial reset of the camera
            resetCamera(camera);

            renderer.updateShader(shaderManager);

            // Update the slider
            htmlControls.updateSlider(slider01ID, undefined);

            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

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

        // Load each of the materials into the scene
        for (var m in materials)
        {
            if (materials.hasOwnProperty(m))
            {
                var material = materials[m];

                if (!material.loaded)
                {
                    material.loaded = scene.hasMaterial(m);
                }

                if (!material.loaded)
                {
                    material.loaded = scene.loadMaterial(graphicsDevice,
                                                         textureManager,
                                                         effectManager,
                                                         m,
                                                         material);
                }
            }
        }

        // Create object using scene loader
        sceneLoader.load({
            scene : scene,
            assetPath : assetToLoad,
            graphicsDevice : graphicsDevice,
            mathDevice : mathDevice,
            textureManager : textureManager,
            effectManager : effectManager,
            shaderManager : shaderManager,
            animationManager : animationManager,
            requestHandler : requestHandler,
            preSceneLoadFn : function (sceneData)
            {
                // Apply the modifications to the sceneData from assetPath
                addAnimationsToScene();
                removeAnimationsFromScene(sceneData);
            },
            keepLights : true,
            append : true,
            vertexFormatMap : {
                "BLENDINDICES" : "UBYTE4",
                "NORMAL"       : "BYTE4N",
                "BLENDWEIGHT"  : "UBYTE4N"
            }
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
        mappingTable = TurbulenzServices.createMappingTable(requestHandler,
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
        mappingTable = null;

        if (scene)
        {
            scene.destroy();
            scene = null;
        }
        requestHandler = null;
        sceneLoader = null;

        htmlControls = null;

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        addAnimations = null;
        removeAnimations = null;

        materials = null;

        settings = null;
        character = null;

        camera = null;
        cameraDir = null;

        animMinExtent = [];
        animMaxExtent = [];

        clearColor = [];
        worldUp = [];

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

        fpsElement = null;

        TurbulenzEngine.flush();
        graphicsDevice = null;
        mathDevice = null;
    };
};
