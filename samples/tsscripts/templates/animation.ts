/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Animation
 * @description:
 * This sample shows how to load multiple animations and build an animation controller hierarchy.
 * An animation transition controller is used to blend between two animations.
 * You can enable drawing of debug information to see the animation bounding box, the skeleton,
 * and the mesh wireframe.
 * You can also click on the rendering windows to move and rotate the camera around.
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
/*{{ javascript("jslib/animationmanager.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/defaultrendering.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/animation.js") }}*/
/*{{ javascript("jslib/scenedebugging.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
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
/*global RequestHandler: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global ResourceLoader: false */
/*global Camera: false */
/*global HTMLControls: false */
/*global AnimationManager: false */
/*global CameraController: false */
/*global DefaultRendering: false */
/*global SkinnedNode: false */
/*global VMath: false */
/*global GPUSkinController: false */
/*global InterpolatorController: false */
/*global ReferenceController: false */
/*global NodeTransformController: false */
/*global TransitionController: false */

// We put some custom data onto Scene
class CustomScene extends Scene
{
    skinnedNodes: SkinnedNode[];
};


TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };
    TurbulenzEngine.onerror = errorCallback;

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

    var inputDeviceParameters = { };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    var requestHandlerParameters = { };
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();
    var animationManager = AnimationManager.create(errorCallback);
    var mappingTable;

    var resourceLoader = ResourceLoader.create();

    // Setup world space
    var worldUp = mathDevice.v3Build(0.0, 1.0, 0.0);

    // Bounds are red, interpolatorColor is updated per animation
    var boundsColor = [1, 0, 0];
    var interpolatorColor = [0, 0, 0];

    // Setup a camera to view a close-up object
    var camera = Camera.create(mathDevice);
    camera.nearPlane = 0.05;
    camera.updateViewMatrix();

    var animMinExtent, animMaxExtent;

    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);
    var maxSpeed = cameraController.maxSpeed;
    var cameraDistanceFactor = 1.0;
    var cameraDir = [1, 1, 1]; // The +/- direction the camera is moved from the scene in each axis

    // Settings for the animation
    var settings = {
        animScale: 1,
        defaultRate: 1,
        drawDebug: false,
        drawInterpolators: false,
        drawWireframe: false,
        loopAnimation: true,
        blendAnimation: false,
        transitionLength: 1
    };

    // The default animation to start with
    var defaultAnimIndex = 0;

    // The current playing animation
    var curAnimIndex = 0;

    // The controller references by index
    var controllerMap = [];

    // This is our base asset that includes a character and animations
    var assetToLoad = "models/Seymour.dae";

    // The list of animations to load pre-scene load (by reference)
    // This is only for animations that are not included in the default scene
    // e.g. "animations/default_walking.anim"
    var addAnimations = ["models/Seymour_anim2_rot90_anim_only.dae"];

    // The list of animations to be remove from the scene data pre-load
    // This is for undesired animations that are packed in the scene
    // All these animations are not required for this sample
    var removeAnimations = ["default_astroboy_w_skel02_gog_polySurface5",
                            "default_astroboy_w_skel02_polySurface5",
                            "default_astroboy_w_skel02c_gog_polySurface5",
                            "default_astroboy_w_skel02c_polySurface5",
                            "default_gog_polySurface5",
                            "default_polySurface5"];

    // The controller to blend the transisitions between animations, that don't have a matching key frame
    var transitionController = null;
    var transitionStartColor = [0, 0, 0];
    var transitionEndColor = [0, 0, 0];

    // Reference controller for the whole animation
    var currentReferenceController = null;
    var currentNodeController = null;

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
        // The animations are added by reference and the resourceLoader will attempt to load them using request
        animationsLoaded = addAnimations.length;
        for (var i = 0; i < addAnimations.length; i += 1)
        {
            var path = addAnimations[i];
            resourceLoader.load(mappingTable.getURL(path), {
                append : true,
                onload : animationsLoadedCallback,
                requestHandler: requestHandler
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

    // Sets the next animation to play
    var nextAnimation = function nextAnimationFn(nextAnimIndex)
    {
        var controllers, interpStart, interpEnd, startColor, endColor, startSkinnedNode, endSkinnedNode, startNodes, endNodes;

        controllers = controllerMap[curAnimIndex];
        if (controllers)
        {
            interpStart = controllers.interpController;
            startColor = controllers.color;
            startSkinnedNode = controllers.skinnedNode;
            startNodes = controllers.nodeCount;
        }

        controllers = controllerMap[nextAnimIndex];
        if (controllers)
        {
            interpEnd = controllers.interpController;
            endColor = controllers.color;
            endSkinnedNode = controllers.skinnedNode;
            endNodes = controllers.nodeCount;
        }

        if (interpEnd)
        {
            interpEnd.setTime(0);

            // Set active on start skinned node to false
            if (startSkinnedNode && (startSkinnedNode !== endSkinnedNode))
            {
                startSkinnedNode.active = false;
                startSkinnedNode.setInputController(interpStart);
            }

            // Use the transition controller instead on this node
            // Don't blend if the interpControllers are the same
            // Don't blend if the number of nodes is different
            if ((settings.blendAnimation || !interpStart) &&
                (interpStart !== interpEnd) &&
                (startNodes === endNodes))
            {
                if (!transitionController)
                {
                    transitionController = TransitionController.create(interpStart, interpEnd, settings.transitionLength);
                    transitionController.onFinishedTransitionCallback = function onFinishedTransitionCallbackFn(/* transition */)
                    {
                        var controllers = controllerMap[curAnimIndex];
                        if (controllers)
                        {
                            var skinnedNode = controllers.skinnedNode;
                            currentReferenceController.setReferenceController(controllers.interpController);
                            currentReferenceController.setTime(0);
                            interpolatorColor = controllers.color;
                            if (skinnedNode)
                            {
                                skinnedNode.setInputController(currentReferenceController);
                                skinnedNode.active = true;
                            }
                        }
                        // Callback return value of 'false' tells the controller not to continue operating
                        // This is because we have decided to set a different controller to be used instead
                        return false;
                    };
                    transitionController.onUpdateCallback = function onUpdateCallbackFn(transition)
                    {
                        var delta = (transition.transitionTime / transition.transitionLength);
                        interpolatorColor = VMath.v3Add(VMath.v3ScalarMul(transitionStartColor, 1 - delta), VMath.v3ScalarMul(transitionEndColor, delta));
                    };
                }
                else
                {
                    transitionController.setEndController(interpEnd);
                    transitionController.setStartController(interpStart);
                    transitionController.setTransitionLength(settings.transitionLength);
                }

                currentReferenceController.setReferenceController(transitionController);
                transitionStartColor = startColor;
                transitionEndColor = endColor;
            }
            else
            {
                // Set the node controller to be the reference controller
                currentReferenceController.setReferenceController(interpEnd);
                interpolatorColor = endColor;
            }

            // Reset the animation about to play
            currentReferenceController.setTime(0);

            if (endSkinnedNode)
            {
                endSkinnedNode.setInputController(currentReferenceController);
                endSkinnedNode.active = true;
            }
            curAnimIndex = nextAnimIndex;
        }

    };

    // Update the settings for an existing animation controller
    var updateAnimations = function updateAnimationsFn(/* scene */)
    {
        var i, controllers, interp;
        var length = controllerMap.length;

        for (i = 0; i < length; i += 1)
        {
            controllers = controllerMap[i];
            if (controllers)
            {
                interp = controllers.interpController;
                if (interp)
                {
                    interp.setAnimation(interp.currentAnim, settings.loopAnimation);
                    interp.setRate(settings.defaultRate);
                }
            }
        }
    };

    function calcAnimationExtents(scene, animationIndex)
    {
        // Calculate the extents from the animation
        var controllers = controllerMap[animationIndex];
        if (controllers)
        {
            var maxValue = Number.MAX_VALUE;
            var animExtentMin0 = maxValue;
            var animExtentMin1 = maxValue;
            var animExtentMin2 = maxValue;
            var animExtentMax0 = -maxValue;
            var animExtentMax1 = -maxValue;
            var animExtentMax2 = -maxValue;

            var bounds = controllers.animation.bounds;
            var numFrames = bounds.length;
            for (var i = 0; i < numFrames; i = i + 1)
            {
                var bound = bounds[i];
                var center = bound.center;
                var halfExtent = bound.halfExtent;
                var c0 = center[0];
                var c1 = center[1];
                var c2 = center[2];
                var h0 = halfExtent[0];
                var h1 = halfExtent[1];
                var h2 = halfExtent[2];
                var min0 = (c0 - h0);
                var min1 = (c1 - h1);
                var min2 = (c2 - h2);
                var max0 = (c0 + h0);
                var max1 = (c1 + h1);
                var max2 = (c2 + h2);
                animExtentMin0 = (animExtentMin0 < min0 ? animExtentMin0 : min0);
                animExtentMin1 = (animExtentMin1 < min1 ? animExtentMin1 : min1);
                animExtentMin2 = (animExtentMin2 < min2 ? animExtentMin2 : min2);
                animExtentMax0 = (animExtentMax0 > max0 ? animExtentMax0 : max0);
                animExtentMax1 = (animExtentMax1 > max1 ? animExtentMax1 : max1);
                animExtentMax2 = (animExtentMax2 > max2 ? animExtentMax2 : max2);
            }

            animMinExtent = mathDevice.v3Build(animExtentMin0, animExtentMin1, animExtentMin2);
            animMaxExtent = mathDevice.v3Build(animExtentMax0, animExtentMax1, animExtentMax2);
        }
        else
        {
            // Use the scene extents
            var sceneExtents = scene.getExtents();
            animMinExtent = mathDevice.v3Build(sceneExtents[0], sceneExtents[1], sceneExtents[2]);
            animMaxExtent = mathDevice.v3Build(sceneExtents[3], sceneExtents[4], sceneExtents[5]);
        }

    }

    // Calculates a position for the camera to lookAt
    var resetCamera = function resetCameraFn(camera, scene)
    {
        calcAnimationExtents(scene, curAnimIndex);

        // Update the camera to scale to the size of the scene
        var center = mathDevice.v3ScalarMul(mathDevice.v3Add(animMaxExtent, animMinExtent), 0.5);
        var extent = mathDevice.v3Sub(center, animMinExtent);

        camera.lookAt(center,
                      worldUp,
                      mathDevice.v3Build(center[0] + extent[0] * cameraDistanceFactor * cameraDir[0] * 2,
                                         center[1] + extent[1] * cameraDistanceFactor * cameraDir[1],
                                         center[2] + extent[2] * cameraDistanceFactor * cameraDir[2] * 2));
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
        camera.farPlane = Math.ceil(len) * 100.0;
        camera.updateProjectionMatrix();

        // Calculates the speed to move around the animation
        maxSpeed = (len < 100 ? (len * 2) : (len * 0.5));
    };

    // Create object using scene loader
    var scene = <CustomScene>(Scene.create(mathDevice));
    var sceneLoader = SceneLoader.create();

    var renderer;
    var loadAssets = function loadAssets()
    {
        // Renderer for the scene (requires shader assets).
        renderer = DefaultRendering.create(graphicsDevice,
                                           mathDevice,
                                           shaderManager,
                                           effectManager);

        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));
        renderer.setDefaultTexture(textureManager.get("default"));

        sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        sceneLoader.load({
            scene : scene,
            assetPath : assetToLoad,
            graphicsDevice : graphicsDevice,
            mathDevice : mathDevice,
            textureManager : textureManager,
            effectManager : effectManager,
            shaderManager : shaderManager,
            animationManager : animationManager,
            requestHandler: requestHandler,
            keepVertexData : true,
            preSceneLoadFn : function (sceneData)
            {
                // Apply the modifications to the data from assetPath
                addAnimationsToScene();
                removeAnimationsFromScene(sceneData);
            },
            keepLights : true,
            append : true
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
        mappingTable = TurbulenzServices.createMappingTable(requestHandler,
                                                            gameSession,
                                                            mappingTableReceived,
                                                            defaultMappingSettings);
    };
    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    // Controls
    var htmlControls = HTMLControls.create();

    htmlControls.addButtonControl({
        id: "button01",
        value: "Next",
        fn: function ()
        {
            nextAnimation((curAnimIndex + 1) % controllerMap.length);
        }
    });

    htmlControls.addButtonControl({
        id: "button02",
        value: "Previous",
        fn: function ()
        {
            var index = (curAnimIndex - 1);
            index = (index === -1) ? (controllerMap.length - 1) : index;
            nextAnimation(index);
        }
    });

    htmlControls.addButtonControl({
        id: "button03",
        value: "Reset Camera",
        fn: function ()
        {
            resetCamera(camera, scene);
        }
    });

    htmlControls.addCheckboxControl({
        id: "checkbox01",
        value: "loopAnimation",
        isSelected: settings.loopAnimation,
        fn: function ()
        {
            settings.loopAnimation = !settings.loopAnimation;
            updateAnimations();
            return settings.loopAnimation;
        }
    });

    htmlControls.addCheckboxControl({
        id: "checkbox02",
        value: "blendAnimation",
        isSelected: settings.blendAnimation,
        fn: function ()
        {
            settings.blendAnimation = !settings.blendAnimation;
            return settings.blendAnimation;
        }
    });


    htmlControls.addCheckboxControl({
        id: "checkbox03",
        value: "drawDebug",
        isSelected: settings.drawDebug,
        fn: function ()
        {
            settings.drawDebug = !settings.drawDebug;
            settings.drawWireframe = settings.drawDebug;
            settings.drawInterpolators = settings.drawDebug;
            return settings.drawDebug;
        }
    });

    htmlControls.register();

    // Provides a distinct array of colors to use for each controller
    // Does not use red, black or white as they are reserved
    var colorArray = [
        [0.5, 1, 0.5],
        [0.5, 1, 1],
        [1, 1, 0.5],
        [1, 0.5, 1],
        [0.5, 0.5, 1]
    ];
    var lastColor = (colorArray.length - 1);
    var getControllerColor = function getControllerColorFn()
    {
        lastColor = (lastColor + 1) % colorArray.length;
        return colorArray[lastColor];
    };

    // Initialise all animations with InterpolatorControllers set to start time
    var initAnimations = function initAnimationsFn(scene: CustomScene)
    {
        var a, n, anim, interp, tempNode, skinnedNode, node, hierarchy;
        var nodeHasSkeleton = animationManager.nodeHasSkeleton;
        var sceneNodes = scene.rootNodes;
        var numNodes = sceneNodes.length;
        scene.skinnedNodes = [];

        // For each node find which ones have skeletons
        for (n = 0; n < numNodes; n += 1)
        {
            node = sceneNodes[n];
            var skeleton = nodeHasSkeleton(node);
            if (skeleton && skeleton.numNodes)
            {
                skinnedNode = SkinnedNode.create(graphicsDevice, mathDevice,
                                                 node, skeleton);
                scene.skinnedNodes.push(skinnedNode);
            }
        }

        numNodes = scene.skinnedNodes.length;

        // For each animation, create an interpolation controller
        var animations = animationManager.getAll();
        for (a in animations)
        {
            if (animations.hasOwnProperty(a))
            {
                anim = animations[a];
                hierarchy = anim.hierarchy;

                // Create an interpolator controller for each animation
                interp = InterpolatorController.create(hierarchy);
                interp.setAnimation(anim, settings.loopAnimation);
                interp.setTime(0);
                interp.setRate(settings.defaultRate);

                skinnedNode = null;
                if (numNodes !== 0)
                {
                    for (n = 0; n < numNodes; n += 1)
                    {
                        tempNode = scene.skinnedNodes[n];
                        if (tempNode && (anim.numNodes === tempNode.skinController.skeleton.numNodes))
                        {
                            skinnedNode = tempNode;
                        }
                    }
                }

                // Controller map used for every interp controller
                controllerMap.push({
                    interpController : interp,
                    animation : anim,
                    nodeCount : hierarchy.numNodes,
                    skinnedNode : skinnedNode,
                    color : getControllerColor()
                });

            }
        }

        var index = (controllerMap.length - 1);
        if (index === -1)
        {
            // Couldn't find any animations on the scene
            return false;
        }

        var controllers = controllerMap[defaultAnimIndex];
        if (!controllers)
        {
            // Pick the last added as a default
            controllers = controllerMap[index];
        }
        else
        {
            index = defaultAnimIndex;
        }

        var defaultInterp = controllers.interpController;
        currentReferenceController = ReferenceController.create(defaultInterp);
        hierarchy = currentReferenceController.getHierarchy();

        // Assumes hierarchy is the same for all anims
        // If different hierarchies are used, create a new controller
        currentNodeController = NodeTransformController.create(hierarchy, scene);
        currentNodeController.setInputController(currentReferenceController);
        currentNodeController.active = true;

        // Set the initial animation
        nextAnimation(index);

        return true;
    };

    // Callback to draw extra debug information
    function drawDebugCB()
    {
        // Draws the interpolators for debugging
        if (currentNodeController.active)
        {
            if (settings.drawInterpolators)
            {
                var interp = currentNodeController.inputController;
                var hierarchy = interp.getHierarchy();
                scene.drawAnimationHierarchy(graphicsDevice, shaderManager, camera,
                                             hierarchy,
                                             hierarchy.numNodes,
                                             interp,
                                             null,
                                             interpolatorColor,
                                             boundsColor);
            }
        }
    }

    // Initialize the previous frame time
    var previousFrameTime = TurbulenzEngine.time;

    var renderFrame = function renderFrameFn()
    {
        var skinnedNodes, numSkins, skinnedNode, skin;

        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }
        cameraController.maxSpeed = (maxSpeed * deltaTime);

        // Update input
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

        // Update the current animation by using the node controller
        // The node controller input is the referenceNodeController
        currentNodeController.addTime(deltaTime * settings.animScale);

        skinnedNodes = scene.skinnedNodes;
        numSkins = skinnedNodes.length;

        // Create an array to insert the list of update nodes
        for (skin = 0; skin < numSkins; skin += 1)
        {
            skinnedNode = skinnedNodes[skin];
            if (skinnedNode.active)
            {
                // The skinned node will peform the update
                skinnedNode.update();
            }
        }

        scene.update();

        renderer.update(graphicsDevice, camera, scene, currentTime);

        if (graphicsDevice.beginFrame())
        {
            // Only draw the skin if active
            if (skinnedNode.active)
            {
                renderer.setWireframe(settings.drawWireframe);

                if (renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight))
                {
                    renderer.draw(graphicsDevice, clearColor, null, null, drawDebugCB);
                }
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

            // Init the animations from the scene
            initAnimations(scene);

            // Intial reset of the camera
            resetCamera(camera, scene);

            // Scene loading is complete, now update the loaded shaders
            renderer.updateShader(shaderManager);

            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
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

        if (scene)
        {
            scene.destroy();
            scene = null;
        }

        requestHandler = null;
        sceneLoader = null;

        htmlControls = null;

        transitionController = null;
        transitionStartColor = [];
        transitionEndColor = [];

        currentReferenceController = null;
        currentNodeController = null;

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        addAnimations = [];
        removeAnimations = [];

        settings = null;

        cameraController = null;
        camera = null;
        cameraDir = [];

        mappingTable = null;

        animMinExtent = [];
        animMaxExtent = [];

        boundsColor = [];
        interpolatorColor = [];

        clearColor = [];
        worldUp = null;

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
        inputDevice = null;
    };

};
