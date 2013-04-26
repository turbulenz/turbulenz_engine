/*{# Copyright (c) 2010-2013 Turbulenz Limited #}*/

/*
 * @title: 3D Physics
 * @description:
 * This sample shows how to create and use the Turbulenz physics device.
 * The sample creates a floor plane and multiple cube shaped rigid bodies attached to nodes in the rendering scene.
 * Click on the rendering window to move and rotate the camera around,
 * click again to pick up and move the rigid bodies using the mouse forces object.
*/

/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/floor.js") }}*/
/*{{ javascript("jslib/mouseforces.js") }}*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */

/*global RequestHandler: false */
/*global window: false */
/*global Camera: false */
/*global CameraController: false */
/*global Floor: false */
/*global RequestHandler: false */
/*global HTMLControls: false */
/*global MouseForces: false */
/*global TurbulenzServices: false */

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

    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var inputDeviceParameters = { };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    var assetsToLoad = 3;

    // Setup camera & controller
    var camera = Camera.create(mathDevice);
    var cameraInitialize = function cameraInitializeFn()
    {
        var worldUp = mathDevice.v3BuildYAxis();
        camera.lookAt(worldUp, worldUp, mathDevice.v3Build(0.0, 3.0, -15.0));
        camera.updateViewMatrix();
    };
    cameraInitialize();

    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);

    var floor = Floor.create(graphicsDevice, mathDevice);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var shader3d = null;
    var technique3d = null;

    var shader3dLoaded = function shader3dLoadedFn(shaderText)
    {
        if (shaderText)
        {
            var shaderParameters = JSON.parse(shaderText);
            shader3d = graphicsDevice.createShader(shaderParameters);
            if (shader3d)
            {
                technique3d = shader3d.getTechnique("textured3D");
                assetsToLoad -= 1;
            }
        }
    };

    var sharedTechniqueParameters = graphicsDevice.createTechniqueParameters({
            diffuse : null
        });

    /*jshint white: false*/
    // Vertex buffer parameters for crate
    var vertexbufferParameters =
    {
        numVertices: 24,
        attributes: ['FLOAT3', 'SHORT2'],
        dynamic: false,
        data: [
                -0.5, -0.5,  0.5, 0, 0,
                 0.5, -0.5,  0.5, 1, 0,
                 0.5,  0.5,  0.5, 1, 1,
                -0.5,  0.5,  0.5, 0, 1,
                -0.5,  0.5,  0.5, 0, 0,
                 0.5,  0.5,  0.5, 1, 0,
                 0.5,  0.5, -0.5, 1, 1,
                -0.5,  0.5, -0.5, 0, 1,
                -0.5,  0.5, -0.5, 1, 1,
                 0.5,  0.5, -0.5, 0, 1,
                 0.5, -0.5, -0.5, 0, 0,
                -0.5, -0.5, -0.5, 1, 0,
                -0.5, -0.5, -0.5, 0, 0,
                 0.5, -0.5, -0.5, 1, 0,
                 0.5, -0.5,  0.5, 1, 1,
                -0.5, -0.5,  0.5, 0, 1,
                 0.5, -0.5,  0.5, 0, 0,
                 0.5, -0.5, -0.5, 1, 0,
                 0.5,  0.5, -0.5, 1, 1,
                 0.5,  0.5,  0.5, 0, 1,
                -0.5, -0.5, -0.5, 0, 0,
                -0.5, -0.5,  0.5, 1, 0,
                -0.5,  0.5,  0.5, 1, 1,
                -0.5,  0.5, -0.5, 0, 1
            ]
    };
    /*jshint white: true*/

    var vertexbuffer = graphicsDevice.createVertexBuffer(vertexbufferParameters);

    var semantics = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION, graphicsDevice.SEMANTIC_TEXCOORD]);

    /*jshint white: false*/
    var indexbufferParameters =
    {
        numIndices: 36,
        format: 'USHORT',
        dynamic: false,
        data: [
                 2,  0,  1,
                 3,  0,  2,
                 6,  4,  5,
                 7,  4,  6,
                10,  8,  9,
                11,  8, 10,
                14, 12, 13,
                15, 12, 14,
                18, 16, 17,
                19, 16, 18,
                22, 20, 21,
                23, 20, 22
            ]
    };
    /*jshint white: true*/

    var indexbuffer = graphicsDevice.createIndexBuffer(indexbufferParameters);

    var primitive = graphicsDevice.PRIMITIVE_TRIANGLES;
    var numIndices = 36;

    // Cache mathDevice functions
    var m43MulM44 = mathDevice.m43MulM44;
    var isVisibleBoxOrigin = mathDevice.isVisibleBoxOrigin;
    var v4Build = mathDevice.v4Build;
    var m43BuildTranslation = mathDevice.m43BuildTranslation;

    var shader2d = null;
    var technique2d = null;

    var shader2dLoaded = function shader2dLoadedFn(shaderText)
    {
        if (shaderText)
        {
            var shaderParameters = JSON.parse(shaderText);
            shader2d = graphicsDevice.createShader(shaderParameters);
            if (shader2d)
            {
                technique2d = shader2d.getTechnique("constantColor2D");
                assetsToLoad -= 1;
            }
        }
    };

    var techniqueParameters2d = graphicsDevice.createTechniqueParameters({
            clipSpace : null,
            constantColor : mathDevice.v4Build(0, 0, 0, 1)
        });

    var linePrim = graphicsDevice.PRIMITIVE_LINES;
    var cursorFormat = [graphicsDevice.VERTEXFORMAT_FLOAT3];
    var cursorSemantic = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION]);

    var clearColor = mathDevice.v4Build(0.95, 0.95, 1.0, 1.0);

    //
    // Physics
    //
    var physicsDeviceParameters = { };
    var physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);

    var dynamicsWorldParameters = { };
    var dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);

    // Specify the generic settings for the collision objects
    var collisionMargin = 0.005;
    var mass = 20.0;
    var numCubes = 200;
    var cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);

    // Floor is represented by a plane
    var floorShape = physicsDevice.createPlaneShape({
            normal : mathDevice.v3Build(0, 1, 0),
            distance : 0,
            margin : collisionMargin
        });

    var floorObject = physicsDevice.createCollisionObject({
            shape : floorShape,
            transform : mathDevice.m43BuildIdentity(),
            friction : 0.5,
            restitution : 0.3,
            group: physicsDevice.FILTER_STATIC,
            mask: physicsDevice.FILTER_ALL
        });

    // Adds the floor collision object to the physicsDevice
    dynamicsWorld.addCollisionObject(floorObject);

    var boxShape = physicsDevice.createBoxShape({
            halfExtents : cubeExtents,
            margin : collisionMargin
        });

    var inertia = boxShape.inertia;
    inertia = mathDevice.v3ScalarMul(inertia, mass);

    var boxBodies = [];

    // Initial box is created as a rigid body
    boxBodies[0] = physicsDevice.createRigidBody({
        shape : boxShape,
        mass : mass,
        inertia : inertia,
        transform : mathDevice.m43BuildTranslation(0.0, 1.0, 0.0),
        friction : 0.5,
        restitution : 0.3,
        angularDamping: 0.9,
        frozen : false
    });
    dynamicsWorld.addRigidBody(boxBodies[0]);

    for (var n = 1; n < numCubes; n += 1)
    {
        // Each additional box is cloned from the original
        boxBodies[n] = boxBodies[0].clone();
        boxBodies[n].transform = m43BuildTranslation.call(mathDevice, 0.0, 1.0 + 1.5 * n, 0.0);

        dynamicsWorld.addRigidBody(boxBodies[n]);
    }

    var doReset = false;
    var reset = function resetFn()
    {
        var transform = mathDevice.m43BuildIdentity();
        var v3Zero = mathDevice.v3BuildZero();

        for (n = 0; n < numCubes; n += 1)
        {
            var body = boxBodies[n];
            body.transform = mathDevice.m43BuildTranslation(0.0, 1.0 + 1.5 * n, 0.0, transform);
            body.linearVelocity = v3Zero;
            body.angularVelocity = v3Zero;
            body.active = true;
        }

        cameraInitialize();
    };

    // Controls
    var htmlControls = HTMLControls.create();

    htmlControls.addButtonControl({
        id: "button01",
        value: "Reset",
        fn: function schedulResetFn()
        {
            doReset = true;
        }
    });
    htmlControls.register();

    var keyCodes = inputDevice.keyCodes;
    var mouseCodes = inputDevice.mouseCodes;

    var onKeyUp = function physicsOnkeyupFn(keynum)
    {
        // If the key R is released we reset the positions
        if (keynum === keyCodes.R)
        {
            reset();
        }
    };

    // Mouse forces
    var dragMin = mathDevice.v3Build(-1000, 0, -1000);
    var dragMax = mathDevice.v3Build(1000, 1000, 1000);
    var mouseForces = MouseForces.create(graphicsDevice, inputDevice, mathDevice,
                                         physicsDevice, dragMin, dragMax);

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

    // Add event listeners
    inputDevice.addEventListener("keyup", onKeyUp);
    inputDevice.addEventListener("mousedown", onMouseDown);
    inputDevice.addEventListener("mouseup", onMouseUp);

    //
    // Update
    //
    var update = function updateFn()
    {
        inputDevice.update();

        if (doReset)
        {
            reset();
            doReset = false;
        }

        if (mouseForces.pickedBody)
        {
            // If we're dragging a body don't apply the movement to the camera
            cameraController.pitch = 0;
            cameraController.turn = 0;
            cameraController.step = 0;
        }

        cameraController.update();

        var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        if (0 >= assetsToLoad)
        {
            mouseForces.update(dynamicsWorld, camera, 0.1);

            dynamicsWorld.update();
        }

        var vp = camera.viewProjectionMatrix;
        var transform = mathDevice.m43BuildIdentity();
        var wvp;

        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(clearColor, 1.0, 0);

            floor.render(graphicsDevice, camera);

            if (0 >= assetsToLoad)
            {
                graphicsDevice.setStream(vertexbuffer, semantics);

                graphicsDevice.setIndexBuffer(indexbuffer);

                graphicsDevice.setTechnique(technique3d);

                graphicsDevice.setTechniqueParameters(sharedTechniqueParameters);

                for (n = 0; n < numCubes; n += 1)
                {
                    boxBodies[n].calculateTransform(transform);
                    wvp = m43MulM44.call(mathDevice, transform, vp, wvp);
                    if (isVisibleBoxOrigin.call(mathDevice, cubeExtents, wvp))
                    {
                        // Use directly the active technique when just a single property changes
                        technique3d.worldViewProjection = wvp;
                        graphicsDevice.drawIndexed(primitive, numIndices);
                    }
                }

                if (!mouseForces.pickedBody)
                {
                    graphicsDevice.setTechnique(technique2d);

                    var screenWidth = graphicsDevice.width;
                    var screenHeight = graphicsDevice.height;
                    techniqueParameters2d['clipSpace'] =
                        v4Build.call(mathDevice, 2.0 / screenWidth, -2.0 / screenHeight, -1.0, 1.0);
                    graphicsDevice.setTechniqueParameters(techniqueParameters2d);

                    var writer = graphicsDevice.beginDraw(linePrim,
                                  4,
                                  cursorFormat,
                                  cursorSemantic);

                    if (writer)
                    {
                        var halfWidth = screenWidth * 0.5;
                        var halfHeight = screenHeight * 0.5;
                        writer([halfWidth - 10, halfHeight]);
                        writer([halfWidth + 10, halfHeight]);
                        writer([halfWidth, halfHeight - 10]);
                        writer([halfWidth, halfHeight + 10]);

                        graphicsDevice.endDraw(writer);
                    }
                }
            }

            graphicsDevice.endFrame();
        }
    };
    var intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        var textureParameters =
        {
            src     : mappingTable.getURL("textures/crate.jpg"),
            mipmaps : true,
            onload  : function (texture)
            {
                sharedTechniqueParameters['diffuse'] = texture;
                assetsToLoad -= 1;
            }
        };

        graphicsDevice.createTexture(textureParameters);

        requestHandler.request({
            src: mappingTable.getURL("shaders/generic3D.cgfx"),
            onload: shader3dLoaded
        });
        requestHandler.request({
            src: mappingTable.getURL("shaders/generic2D.cgfx"),
            onload: shader2dLoaded
        });
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

        requestHandler = null;
        indexbuffer = null;
        vertexbuffer = null;
        semantics = null;
        cursorSemantic = null;
        primitive = null;
        linePrim = null;
        technique3d = null;
        shader3d = null;
        technique2d = null;
        shader2d = null;
        techniqueParameters2d = null;
        sharedTechniqueParameters = null;
        mouseForces = null;
        floor = null;
        cameraController = null;
        camera = null;
        boxBodies = null;
        inertia = null;
        clearColor = null;
        m43MulM44 = null;
        m43BuildTranslation = null;
        isVisibleBoxOrigin = null;
        v4Build = null;
        dragMax = null;
        dragMin = null;
        mouseCodes = null;
        keyCodes = null;

        TurbulenzEngine.flush();
        physicsDevice = null;
        inputDevice = null;
        graphicsDevice = null;
        mathDevice = null;

    };
};
