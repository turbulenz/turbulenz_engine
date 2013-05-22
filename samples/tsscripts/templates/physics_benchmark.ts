/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
 * @title: 3D Physics benchmark
 * @description:
 * This sample is a benchmark for rigid body physics simulation with randomly generated boxes, spheres, cones,
 * cylinders, capsules and convex hulls.
 * The rigid bodies fall into a procedurally generated triangle mesh bowl that can be animated.
 * The sample also shows the time spent on the different physics simulation phases.
 * Disabling the debug rendering will show its impact on the framerate, the physics simulation will continue but
 * without any graphics update.
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
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/scenedebugging.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/physicsmanager.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/mouseforces.js") }}*/

/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*{{ javascript("scripts/htmlcontrols.js") }}*/
/*{{ javascript("scripts/sceneloader.js") }}*/

/*global TurbulenzEngine: true */
/*global RequestHandler: false */
/*global SceneLoader: false */
/*global SceneNode: false */
/*global TurbulenzServices: false */
/*global ShaderManager: false */
/*global Scene: false */
/*global Camera: false */
/*global CameraController: false */
/*global Floor: false */
/*global MouseForces: false */
/*global PhysicsManager: false */
/*global HTMLControls: false */

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

    var mathDeviceParameters = { };
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    var physicsDeviceParameters = { };
    var physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);

    var dynamicsWorldParameters = {
        variableTimeSteps : true,
        maxSubSteps : 2
    };
    var dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);

    var inputDeviceParameters = { };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    var requestHandlerParameters = { };
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var physicsManager = PhysicsManager.create(mathDevice, physicsDevice, dynamicsWorld);

    var debugMode = true;

    // Renderer and assets for the scene.
    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();

    // Setup world space
    var clearColor = mathDevice.v4Build(0.95, 0.95, 1.0, 1.0);
    var loadingClearColor = mathDevice.v4Build(0.8, 0.8, 0.8, 1.0);
    var worldUp = mathDevice.v3BuildYAxis();

    // Setup a camera to view a close-up object
    var camera = Camera.create(mathDevice);
    camera.nearPlane = 0.05;
    var cameraDefaultPos = mathDevice.v3Build(0, 8.0, 18.1);
    var cameraDefaultLook = mathDevice.v3Build(0, -(camera.farPlane / 4), -camera.farPlane);

    // The objects needed to draw the crosshair
    var technique2d;
    var shader2d;
    var techniqueParameters2d;
    var chSemantics = graphicsDevice.createSemantics(['POSITION']);
    var chFormats = [graphicsDevice.VERTEXFORMAT_FLOAT3];

    // Setup world floor
    var floor = Floor.create(graphicsDevice, mathDevice);
    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);

    // Mouse forces
    var dragMin = mathDevice.v3Build(-50, -50, -50);
    var dragMax = mathDevice.v3Build(50, 50, 50);
    var mouseForces = MouseForces.create(graphicsDevice, inputDevice, mathDevice,
                                         physicsDevice, dragMin, dragMax);
    mouseForces.clamp = 400;

    // Control codes
    var keyCodes = inputDevice.keyCodes;
    var mouseCodes = inputDevice.mouseCodes;

    // Dynamic physics objects
    var physicsObjects = [];
    var bowlObject;

    // Configuration of demo.
    // Bowl radius and height
    var bowlRadius = 9;
    var bowlHeight = 5;
    // Number of radial points, and planes in bowl.
    var radialN = 30;
    var depthN = 10;

    // Control approximate size of objects
    var objectSize = 0.5;

    // Radius to place objects at in spiral
    // y-displacement between each object.
    // And start y position.
    var genRadius = bowlRadius - 4;
    var genDeltaY = 1;
    var genStartY = 50;
    var genStartSpeed = 60;

    // Number of objects
    var genCount = 100;

    // Determine a suitable angular displacement between each object.
    var genTheta = Math.asin(0.5 * Math.sqrt(100 * objectSize * objectSize + genDeltaY * genDeltaY) / genRadius);

    // Whether bowl is animated.
    var animateBowl = false;
    var animateBowlTime = 0;
    var prevAnimationTime = 0;
    var animatedBowlAxis = mathDevice.v3Build(0, 0, 1);
    var animatedBowlTransform = mathDevice.m43BuildIdentity();

    function reset()
    {
        // Reset camera
        camera.lookAt(cameraDefaultLook, worldUp, cameraDefaultPos);
        camera.updateViewMatrix();

        // Reset physics object positions to new random values.
        // We keep the physics objects that already exist to simplify things.
        var n;
        var maxN = physicsObjects.length;
        for (n = 0; n < maxN; n += 1)
        {
            var body = physicsObjects[n];
            dynamicsWorld.removeRigidBody(body);
            var position = mathDevice.m43BuildTranslation(genRadius * Math.cos(n * genTheta),
                                                          genStartY + (genDeltaY * n) * 3,
                                                          genRadius * Math.sin(n * genTheta));
            body.transform = position;
            body.linearVelocity = mathDevice.v3Build(0, -genStartSpeed, 0);
            body.angularVelocity = mathDevice.v3BuildZero();
            body.active = true;
            dynamicsWorld.addRigidBody(body);
        }
    }

    var onMouseDown = function (button)
    {
        if (mouseCodes.BUTTON_0 === button || mouseCodes.BUTTON_1 === button)
        {
            mouseForces.onmousedown();
        }
    };

    var onMouseUp = function (button)
    {
        if (mouseCodes.BUTTON_0 === button || mouseCodes.BUTTON_1 === button)
        {
            mouseForces.onmouseup();
        }
    };

    var onKeyUp = function physicsOnkeyupFn(keynum)
    {
        if (keynum === keyCodes.R) // 'r' key
        {
            reset();
        }
        else
        {
            cameraController.onkeyup(keynum);
        }
    };

    // Add event listeners
    inputDevice.addEventListener("keyup", onKeyUp);
    inputDevice.addEventListener("mousedown", onMouseDown);
    inputDevice.addEventListener("mouseup", onMouseUp);

    // Controls
    var htmlControls = HTMLControls.create();
    htmlControls.addCheckboxControl({
        id: "checkbox01",
        value: "debugMode",
        isSelected: debugMode,
        fn: function ()
        {
            debugMode = !debugMode;
            return debugMode;
        }
    });
    htmlControls.addCheckboxControl({
        id: "checkbox02",
        value: "animate",
        isSelected: animateBowl,
        fn: function ()
        {
            animateBowl = !animateBowl;
            prevAnimationTime = TurbulenzEngine.time;
            return animateBowl;
        }
    });
    htmlControls.register();

    function drawCrosshair()
    {
        if (!mouseForces.pickedBody)
        {
            graphicsDevice.setTechnique(technique2d);

            var screenWidth = graphicsDevice.width;
            var screenHeight = graphicsDevice.height;
            techniqueParameters2d.clipSpace = mathDevice.v4Build(2.0 / screenWidth,
                                                                 -2.0 / screenHeight,
                                                                 -1.0,
                                                                 1.0,
                                                                 techniqueParameters2d.clipSpace);
            graphicsDevice.setTechniqueParameters(techniqueParameters2d);

            var writer = graphicsDevice.beginDraw(
                graphicsDevice.PRIMITIVE_LINES, 4, chFormats, chSemantics);

            if (writer)
            {
                var halfWidth = screenWidth * 0.5;
                var halfHeight = screenHeight * 0.5;
                writer(halfWidth - 10, halfHeight);
                writer(halfWidth + 10, halfHeight);
                writer(halfWidth, halfHeight - 10);
                writer(halfWidth, halfHeight + 10);

                graphicsDevice.endDraw(writer);
            }
        }
    }

    var nextUpdate = 0;

    var fpsElement = document.getElementById("fpscounter");
    var lastFPS = "";

    var discreteElement          = document.getElementById("discrete");
    var preComputationsElement   = document.getElementById("precomputations");
    var physicsIterationsElement = document.getElementById("physicsiterations");
    var continuousElement        = document.getElementById("continuous");

    var lastDiscreteText          = "";
    var lastPreComputationsText   = "";
    var lastPhysicsIterationsText = "";
    var lastContinuousText        = "";

    var discreteVal          = -1;
    var preComputationsVal   = -1;
    var physicsIterationsVal = -1;
    var continuousVal        = -1;

    var displayPerformance = function displayPerformanceFn()
    {
        if (TurbulenzEngine.canvas)
        {
            var data = dynamicsWorld.performanceData;
            var preval = data.sleepComputation + data.prestepContacts + data.prestepConstraints +
                data.integrateVelocities + data.warmstartContacts + data.warmstartConstraints;
            var contval = data.integratePositions + data.continuous;

            if (discreteVal === -1)
            {
                discreteVal          = data.discrete;
                preComputationsVal   = preval;
                physicsIterationsVal = data.physicsIterations;
                continuousVal        = contval;
            }
            else
            {
                discreteVal          = (0.95 * discreteVal)          + (0.05 * data.discrete);
                preComputationsVal   = (0.95 * preComputationsVal)   + (0.05 * preval);
                physicsIterationsVal = (0.95 * physicsIterationsVal) + (0.05 * data.physicsIterations);
                continuousVal        = (0.95 * continuousVal)        + (0.05 * contval);
            }
        }

        var currentTime = TurbulenzEngine.time;
        if (nextUpdate < currentTime)
        {
            nextUpdate = (currentTime + 0.1);

            // No fpsElement if we are running in standalone or
            // directly via the .tzjs

            if (fpsElement)
            {
                var fpsText = (graphicsDevice.fps).toFixed(2);
                if (lastFPS !== fpsText)
                {
                    lastFPS = fpsText;

                    fpsElement.innerHTML = fpsText + " fps";
                }
            }

            if (TurbulenzEngine.canvas)
            {
                var discreteText = (1e3 * discreteVal).toFixed(2);
                var preComputationsText = (1e3 * preComputationsVal).toFixed(2);
                var physicsIterationsText =
                    (1e3 * physicsIterationsVal).toFixed(2);
                var continuousText = (1e3 * continuousVal).toFixed(2);

                if (discreteElement && lastDiscreteText !== discreteText)
                {
                    lastDiscreteText = discreteText;
                    discreteElement.innerHTML = discreteText + " ms";
                }

                if (preComputationsElement &&
                    lastPreComputationsText !== preComputationsText)
                {
                    lastPreComputationsText = preComputationsText;
                    preComputationsElement.innerHTML = preComputationsText +
                        " ms";
                }

                if (physicsIterationsElement &&
                    lastPhysicsIterationsText !== physicsIterationsText)
                {
                    lastPhysicsIterationsText = physicsIterationsText;
                    physicsIterationsElement.innerHTML =
                        physicsIterationsText + " ms";
                }

                if (continuousElement && lastContinuousText !== continuousText)
                {
                    lastContinuousText = continuousText;
                    continuousElement.innerHTML = continuousText + " ms";
                }

                discreteVal          = -1;
                preComputationsVal   = -1;
                physicsIterationsVal = -1;
                continuousVal        = -1;
            }
        }
    };

    // Functions to generate a physics object of a particular type.
    var factories = [
        // Create a random box primitive
        function boxFactoryFn()
        {
            var width  = objectSize + (Math.random() * objectSize);
            var height = objectSize + (Math.random() * objectSize);
            var depth  = objectSize + (Math.random() * objectSize);

            return physicsDevice.createBoxShape({
                    halfExtents : mathDevice.v3Build(width, height, depth),
                    margin : 0.001
                });
        },

        // Create a random convex hull primitive
        function convexHullFactoryFn()
        {
            var radius0 = (objectSize + (Math.random() * objectSize)) * 2.0;
            var radius1 = (objectSize + (Math.random() * objectSize)) * 2.0;
            var radius2 = (objectSize + (Math.random() * objectSize)) * 2.0;
            var numPoints = Math.floor(5 + Math.random() * 30);

            var positionsData = [];
            var i;
            for (i = 0; i < (numPoints * 3); i += 3)
            {
                var azimuth = Math.random() * Math.PI * 2;
                var elevation = (Math.random() - 0.5) * Math.PI;
                positionsData[i]     = Math.sin(azimuth) * Math.cos(elevation) * radius0;
                positionsData[i + 1] = Math.cos(azimuth) * radius2;
                positionsData[i + 2] = Math.sin(azimuth) * Math.sin(elevation) * radius1;
            }

            return physicsDevice.createConvexHullShape({
                    points : positionsData,
                    margin : 0.001
                });
        },

        // Create a random sphere primitive
        function sphereFactoryFn()
        {
            return physicsDevice.createSphereShape({
                    radius : (objectSize + (Math.random() * objectSize)) * 1.5,
                    margin : 0.0
                });
        },

        // Create a random capsule primitive
        function capsuleFactoryFn()
        {
            return physicsDevice.createCapsuleShape({
                    radius : (objectSize + (Math.random() * objectSize)),
                    height : (objectSize + (Math.random() * objectSize)) * 2,
                    margin : 0.001
                });
        },

        // Create a random cylinder primitive
        function cylinderFactoryFn()
        {
            var radius = (objectSize + (Math.random() * objectSize));
            var height = (objectSize + (Math.random() * objectSize));

            return physicsDevice.createCylinderShape({
                    halfExtents : mathDevice.v3Build(radius, height, radius),
                    margin : 0.001
                });
        },

        // Create a random cone primitive
        function coneFactoryFn()
        {
            return physicsDevice.createConeShape({
                    radius : (objectSize + (Math.random() * objectSize)) * 1.5,
                    height : (objectSize + (Math.random() * objectSize)) * 3,
                    margin : 0.001
                });
        }
    ];

    var skipFrame = true;

    var deferredObjectCreation = function deferredObjectCreationFn()
    {
        var i = physicsObjects.length;
        var shape = factories[Math.floor(factories.length * Math.random())]();
        var position = mathDevice.m43BuildTranslation(genRadius * Math.cos(i * genTheta),
                                                      genStartY + (genDeltaY * i),
                                                      genRadius * Math.sin(i * genTheta));

        var sceneNode = SceneNode.create({
                name: "Phys" + i,
                local: position,
                dynamic: true,
                disabled: false
            });

        var rigidBody = physicsDevice.createRigidBody({
                shape: shape,
                mass: 10.0,
                inertia: mathDevice.v3ScalarMul(shape.inertia, 10.0),
                transform: position,
                friction: 0.8,
                restitution: 0.2,
                angularDamping: 0.4,
                linearVelocity : mathDevice.v3Build(0, -genStartSpeed, 0)
            });

        var physicsNode = {
            body: rigidBody,
            target: sceneNode,
            dynamic: true
        };

        scene.addRootNode(sceneNode);
        sceneNode.physicsNodes = [physicsNode];
        sceneNode.setDynamic();

        physicsManager.physicsNodes.push(physicsNode);
        physicsManager.dynamicPhysicsNodes.push(physicsNode);
        physicsManager.enableHierarchy(sceneNode, true);

        physicsObjects.push(rigidBody);
    };

    var renderFrame = function renderFrameFn()
    {
        // Update input and camera
        inputDevice.update();

        if (mouseForces.pickedBody)
        {
            // If we're dragging a body don't apply the movement to the camera
            cameraController.pitch = 0;
            cameraController.turn = 0;
            cameraController.step = 0;
        }

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

        // Generate new physics objects.
        //
        // To deal with JIT slow-down on start up in canvas, we continously add new objects
        // every other frame to prevent massive initial slow down.
        if (physicsObjects.length !== genCount && !skipFrame)
        {
            deferredObjectCreation();
        }
        skipFrame = !skipFrame;

        if (animateBowl)
        {
            animateBowlTime += (TurbulenzEngine.time - prevAnimationTime);
            prevAnimationTime = TurbulenzEngine.time;

            mathDevice.m43FromAxisRotation(animatedBowlAxis, 0.5 * Math.sin(animateBowlTime), animatedBowlTransform);
            animatedBowlTransform[10] = Math.abs(7 * 0.5 * Math.sin(Math.sin(animateBowlTime)));
            bowlObject.transform = animatedBowlTransform;
        }

        // Update the physics
        mouseForces.update(dynamicsWorld, camera, 0.1);
        dynamicsWorld.update();

        physicsManager.update();
        scene.update();

        scene.updateVisibleNodes(camera);

        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(clearColor, 1.0, 0);

            floor.render(graphicsDevice, camera);

            if (debugMode)
            {
                scene.drawPhysicsGeometry(graphicsDevice, shaderManager, camera, physicsManager);
            }

            drawCrosshair();

            graphicsDevice.endFrame();
        }

        displayPerformance();
    };

    var intervalID;
    var loadingCompleted = false;
    var loadingLoop = function loadingLoopFn()
    {
        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(loadingClearColor);
            graphicsDevice.endFrame();
        }

        if (loadingCompleted)
        {
            TurbulenzEngine.clearInterval(intervalID);

            camera.lookAt(cameraDefaultLook, worldUp, cameraDefaultPos);
            camera.updateViewMatrix();

            shader2d = shaderManager.get("shaders/generic2D.cgfx");
            technique2d = shader2d.getTechnique("constantColor2D");
            techniqueParameters2d = graphicsDevice.createTechniqueParameters({
                    clipSpace : mathDevice.v4BuildOne(),
                    constantColor : mathDevice.v4Build(0, 0, 0, 1)
                });

            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);
    // Change the clear color before we start loading assets
    loadingLoop();

    var postLoad = function postLoadFn()
    {
        // Floor is represented by a plane shape
        var floorShape = physicsDevice.createPlaneShape({
                normal : mathDevice.v3Build(0, 1, 0),
                distance : 0,
                margin : 0.001
            });

        var floorObject = physicsDevice.createCollisionObject({
                shape : floorShape,
                transform : mathDevice.m43BuildIdentity(),
                friction : 0.8,
                restitution : 0.1,
                group: physicsDevice.FILTER_STATIC,
                mask: physicsDevice.FILTER_ALL
            });

        // Adds the floor collision object to the world
        dynamicsWorld.addCollisionObject(floorObject);

        // Bowl is represented by a triangle mesh shape.
        // We create the triangle mesh simply and manually.
        var positionsData = [];
        var indicesData = [];

        // Compute bowl vertices.
        var i, j, offset;
        for (i = 0; i < depthN; i += 1)
        {
            var elevation = (Math.PI * 0.75) * ((i + 1) / (depthN + 2));
            for (j = 0; j < radialN; j += 1)
            {
                var azimuth = (Math.PI * 2) * (j / radialN);

                offset = ((i * radialN) + j) * 3;
                positionsData[offset]     = Math.sin(elevation) * Math.cos(azimuth) * bowlRadius;
                positionsData[offset + 1] = (1 - Math.cos(elevation)) * bowlHeight;
                positionsData[offset + 2] = Math.sin(elevation) * Math.sin(azimuth) * bowlRadius;
            }
        }

        offset = (depthN * radialN) * 3;
        positionsData[offset]     = 0;
        positionsData[offset + 1] = 0;
        positionsData[offset + 2] = 0;

        // Compute bowl triangle indices
        for (i = 0; i < (depthN - 1); i += 1)
        {
            for (j = 0; j < radialN; j += 1)
            {
                offset = ((i * radialN) + j) * 3 * 2;
                indicesData[offset]     = (i * radialN) + j;
                indicesData[offset + 1] = (i * radialN) + ((j + 1) % radialN);
                indicesData[offset + 2] = ((i + 1) * radialN) + j;

                indicesData[offset + 3] = ((i + 1) * radialN) + j;
                indicesData[offset + 4] = (i * radialN) + ((j + 1) % radialN);
                indicesData[offset + 5] = ((i + 1) * radialN) + ((j + 1) % radialN);
            }
        }

        for (i = 0; i < radialN; i += 1)
        {
            offset = (((depthN - 1) * radialN) * 3 * 2) + (i * 3);
            indicesData[offset]     = i;
            indicesData[offset + 1] = (depthN * radialN);
            indicesData[offset + 2] = ((i + 1) % radialN);
        }

        // Create triangle array for bowl
        var bowlTriangleArray = physicsDevice.createTriangleArray({
                vertices : positionsData,
                indices : indicesData
            });

        // Create bowl physics shape and object.
        var bowlShape = physicsDevice.createTriangleMeshShape({
                triangleArray : bowlTriangleArray,
                margin : 0.001
            });

        bowlObject = physicsDevice.createCollisionObject({
                shape : bowlShape,
                transform : mathDevice.m43BuildIdentity(),
                friction : 0.8,
                restitution : 0.1,
                group: physicsDevice.FILTER_STATIC,
                mask: physicsDevice.FILTER_ALL,
                kinematic : true
            });

        // Create SceneNode for bowl, and add to scene.
        var bowlSceneNode = SceneNode.create({
                name: "Bowl",
                local: bowlObject.transform,
                dynamic: false,
                disabled: false
            });

        var bowlPhysicsNode : PhysicsNode = {
            body : bowlObject,
            target : bowlSceneNode,
            dynamic : false,
            triangleArray : bowlTriangleArray
        };

        scene.addRootNode(bowlSceneNode);
        bowlSceneNode.physicsNodes = [bowlPhysicsNode];
        // TODO: should be setStatic?  setDynamic takes no args.
        //bowlSceneNode.setDynamic(false);
        bowlSceneNode.setDynamic();

        physicsManager.physicsNodes.push(bowlPhysicsNode);
        physicsManager.enableHierarchy(bowlSceneNode, true);
    };

    var numShadersToLoad = 2;

    var shadersLoaded = function shadersLoadedFn(/* shader */)
    {
        numShadersToLoad -= 1;
        if (0 === numShadersToLoad)
        {
            postLoad();
            loadingCompleted = true;
        }
    };

    var loadAssets = function loadAssetsFn()
    {
        shaderManager.load("shaders/debug.cgfx", shadersLoaded);
        shaderManager.load("shaders/generic2D.cgfx", shadersLoaded);
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
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

    var gameSessionFailed = function gameSessionFailedFn(reason)
    {
        gameSessionCreated(null);
    }

    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    // Create a scene destroy callback to run when the window is closed
    function destroyScene()
    {
        gameSession.destroy();

        TurbulenzEngine.clearInterval(intervalID);
        clearColor = null;

        if (scene)
        {
            scene.destroy();
            scene = null;
        }

        requestHandler = null;

        camera = null;

        techniqueParameters2d = null;
        technique2d = null;
        shader2d = null;
        chSemantics = null;
        chFormats = null;

        if (shaderManager)
        {
            shaderManager.destroy();
            shaderManager = null;
        }

        TurbulenzEngine.flush();
        graphicsDevice = null;
        mathDevice = null;
        physicsDevice = null;
        physicsManager = null;
        dynamicsWorld = null;
        mouseCodes = null;
        keyCodes = null;
        inputDevice = null;
        cameraController = null;
        floor = null;
    }

    TurbulenzEngine.onunload = destroyScene;

};
