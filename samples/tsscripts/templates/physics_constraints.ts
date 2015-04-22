/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: 3D Physics rigid body constraints
 * @subTitle: How to create physical constraints for physics rigid bodies.
 * @description:
 * This sample shows how to create each of the physics constraints (point to point, hinge, slider, cone twist,
 * 6 degrees of freedom).
 * Each object in the scene can be manipulated with the mouse to see how the constraints work.
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

/*{{ javascript("scripts/debugphysics.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global DebugConstraint: false */
/*global Camera: false */
/*global CameraController: false */
/*global Floor: false */
/*global MouseForces: false */
/*global HTMLControls: false */

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

    var assetsToLoad = 4;

    // Setup camera & controller
    var camera = Camera.create(mathDevice);
    var worldUp = mathDevice.v3BuildYAxis();
    camera.lookAt(mathDevice.v3Build(-4.9, 5.3, -14.2), worldUp, mathDevice.v3Build(13.4, 5.7, 6.5));
    camera.updateViewMatrix();

    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);

    var floor = Floor.create(graphicsDevice, mathDevice);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var shader3d = null;
    var technique3d = null;
    var shader2d = null;
    var technique2d = null;
    var shaderDebug = null;
    var techniqueDebug = null;
    var debugConstraint = null;
    var debugMode = true;

    var shader3dLoaded = function shader3dLoadedFn(shaderText)
    {
        if (shaderText)
        {
            var shaderParameters = JSON.parse(shaderText);
            shader3d = graphicsDevice.createShader(shaderParameters);
            if (shader3d)
            {
                technique3d = shader3d.getTechnique("desatureTextureConstantColor3D");
                assetsToLoad -= 1;
            }
        }
    };

    var techniqueParameters3d = graphicsDevice.createTechniqueParameters({
            diffuse : null,
            constantColor : mathDevice.v4Build(0, 0, 0, 1)
        });

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

    var shaderDebugLoaded = function shaderDebugLoadedFn(shaderText)
    {
        if (shaderText)
        {
            var shaderParameters = JSON.parse(shaderText);
            shaderDebug = graphicsDevice.createShader(shaderParameters);
            if (shaderDebug)
            {
                techniqueDebug = shaderDebug.getTechnique("debug_lines");
                assetsToLoad -= 1;
            }
        }
        debugConstraint = DebugConstraint.create(graphicsDevice, techniqueDebug, mathDevice, camera);
    };

    var techniqueParameters2d = graphicsDevice.createTechniqueParameters({
            clipSpace : null,
            constantColor : mathDevice.v4Build(0, 0, 0, 1)
        });

    var linePrim = graphicsDevice.PRIMITIVE_LINES;
    var cursorFormat = [graphicsDevice.VERTEXFORMAT_FLOAT3];
    var cursorSemantic = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION]);
    var semantics = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION, graphicsDevice.SEMANTIC_TEXCOORD]);
    var primitive = graphicsDevice.PRIMITIVE_TRIANGLES;

    // Create the dimensions of a cube and a door shape for rendering and physics purposes
    var cubeExtents = mathDevice.v3Build(0.5, 0.5, 0.5);
    var doorExtents = mathDevice.v3Build(0.5, 1.5, 0.05);

    /*jshint white: false*/
    function buildCuboidVertexBufferParams(extents)
    {
        var extents0 = extents[0];
        var extents1 = extents[1];
        var extents2 = extents[2];

        return {
            numVertices: 24,
            attributes: ['FLOAT3', 'SHORT2N'],
            dynamic: false,
            data: [
                    -extents0, -extents1,  extents2, 0, 0,
                     extents0, -extents1,  extents2, 1, 0,
                     extents0,  extents1,  extents2, 1, 1,
                    -extents0,  extents1,  extents2, 0, 1,
                    -extents0,  extents1,  extents2, 0, 0,
                     extents0,  extents1,  extents2, 1, 0,
                     extents0,  extents1, -extents2, 1, 1,
                    -extents0,  extents1, -extents2, 0, 1,
                    -extents0,  extents1, -extents2, 1, 1,
                     extents0,  extents1, -extents2, 0, 1,
                     extents0, -extents1, -extents2, 0, 0,
                    -extents0, -extents1, -extents2, 1, 0,
                    -extents0, -extents1, -extents2, 0, 0,
                     extents0, -extents1, -extents2, 1, 0,
                     extents0, -extents1,  extents2, 1, 1,
                    -extents0, -extents1,  extents2, 0, 1,
                     extents0, -extents1,  extents2, 0, 0,
                     extents0, -extents1, -extents2, 1, 0,
                     extents0,  extents1, -extents2, 1, 1,
                     extents0,  extents1,  extents2, 0, 1,
                    -extents0, -extents1, -extents2, 0, 0,
                    -extents0, -extents1,  extents2, 1, 0,
                    -extents0,  extents1,  extents2, 1, 1,
                    -extents0,  extents1, -extents2, 0, 1
            ]
        };
    }

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

    var cubeVertexbuffer = graphicsDevice.createVertexBuffer(buildCuboidVertexBufferParams(cubeExtents));
    var doorVertexbuffer = graphicsDevice.createVertexBuffer(buildCuboidVertexBufferParams(doorExtents));
    var indexbuffer = graphicsDevice.createIndexBuffer(indexbufferParameters);
    var numIndices = indexbufferParameters.numIndices;

    var clearColor = mathDevice.v4Build(0.95, 0.95, 1.0, 1.0);

    // Cache mathDevice functions
    var m43MulM44 = mathDevice.m43MulM44;
    var isVisibleBoxOrigin = mathDevice.isVisibleBoxOrigin;
    var v4Build = mathDevice.v4Build;

    //
    // Physics
    //
    var physicsDeviceParameters = { };
    var physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);

    var dynamicsWorldParameters = { };
    var dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);

    // Specify the generic settings for the collision objects
    var collisionMargin = 0.005;
    var mass = 1.0;
    var pi = Math.PI;

    // Floor is represented by a plane shape
    var floorShape = physicsDevice.createPlaneShape({
            normal : mathDevice.v3Build(0, 1, 0),
            distance : 0,
            margin : 0.001
        });

    var floorObject = physicsDevice.createCollisionObject({
            shape : floorShape,
            transform : mathDevice.m43Build(
                1.0,  0.0, 0.0,
                0.0,  1.0, 0.0,
                0.0,  0.0, 1.0,
                0.0, -2.0, 0.0
            ),
            friction : 0.5,
            restitution : 0.3,
            group: physicsDevice.FILTER_STATIC,
            mask: physicsDevice.FILTER_ALL
        });

    // Adds the floor collision object to the physicsDevice
    dynamicsWorld.addCollisionObject(floorObject);

    // Set up some rigid body shapes to match the rendering shapes
    var cubeShape = physicsDevice.createBoxShape({
            halfExtents : cubeExtents,
            margin : collisionMargin
        });

    var doorShape = physicsDevice.createBoxShape({
            halfExtents : doorExtents,
            margin : collisionMargin
        });

    // Do not use inertia for fixed objects (objects with mass = 0.0)
    var inertia = cubeShape.inertia;

    var rigidBodies = [];

    // SLIDER CONSTRAINT

    // Moveable Body
    var sliderMovingBody = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : mass,
        inertia : inertia,
        transform : mathDevice.m43Build(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
           -2.0, 8.0, 0.0
        )
    });
    rigidBodies[rigidBodies.length] = {
        body : sliderMovingBody,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.54, 0.54, 0.82, 1),
        constraintName : "Slider"
    };
    dynamicsWorld.addRigidBody(sliderMovingBody);

    // Fixed Body
    var sliderFixedBody = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : 0.0,
        transform : mathDevice.m43Build(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            2.0, 4.0, 0.0
        )
    });
    rigidBodies[rigidBodies.length] = {
        body : sliderFixedBody,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.54, 0.54, 0.82, 1),
        constraintName : "Slider"
    };
    dynamicsWorld.addRigidBody(sliderFixedBody);

    // A slider constraint only slides along the x-axis of the frame.
    // Therefore rotate the frame of reference so that the x-axis is equal to the direction vector between the objects
    var dir = mathDevice.v3Normalize(mathDevice.v3Sub(mathDevice.m43Pos(sliderFixedBody.transform),
                                     mathDevice.m43Pos(sliderMovingBody.transform)), dir);
    var xaxis = mathDevice.v3BuildXAxis();
    var angle = Math.acos(mathDevice.v3Dot(dir, xaxis));
    var axis = mathDevice.v3Normalize(mathDevice.v3Cross(xaxis, dir));
    var frameInA = mathDevice.m43FromAxisRotation(axis, angle);

    var sliderConstraint = physicsDevice.createSliderConstraint({
        bodyA : sliderMovingBody,
        bodyB : sliderFixedBody,
        transformA : frameInA,
        transformB : frameInA,
        linearLowerLimit : 1.2,
        linearUpperLimit : 8,
        angularLowerLimit : 0,
        angularUpperLimit : 0
    });
    dynamicsWorld.addConstraint(sliderConstraint);

    // HINGE CONSTRAINT - fixed to world

    // Rotated to roughly 160 degrees around the Y-axis - causes door to swing
    var yaxis = mathDevice.v3BuildYAxis();
    var transform = mathDevice.m43FromAxisRotation(yaxis, pi * (5 / 4));
    mathDevice.m43SetPos(transform, mathDevice.v3Build(0.0, 5.0, -10.0));

    // Door Body
    var hingeDoorBody = physicsDevice.createRigidBody({
        shape : doorShape,
        mass : mass,
        inertia : doorShape.inertia,
        transform : transform
    });
    rigidBodies[rigidBodies.length] = {
        body : hingeDoorBody,
        vertexBuffer : doorVertexbuffer,
        color : mathDevice.v4Build(0.89, 0.99, 0.43, 1),
        constraintName : "Hinge"
    };
    dynamicsWorld.addRigidBody(hingeDoorBody);

    // Creates a hinge that simulates a door frame
    mathDevice.m43FromAxisRotation(xaxis, pi / 2, frameInA);
    mathDevice.m43SetPos(frameInA, mathDevice.v3Build(-0.5, 0, 0));

    var hingeConstraint = physicsDevice.createHingeConstraint({
        bodyA : hingeDoorBody,
        transformA : frameInA,
        low : 0,
        high : pi * (5 / 6) // 150 degrees
    });
    dynamicsWorld.addConstraint(hingeConstraint);

    // POINT2POINT CONSTRAINT

    // Moveable body1
    var p2pMoveableBody1 = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : mass,
        inertia : inertia,
        transform : mathDevice.m43Build(
            1.0, 0.0,   0.0,
            0.0, 1.0,   0.0,
            0.0, 0.0,   1.0,
            0.0, 5.5, -20.0
        ),
        linearDamping :  0.8,
        angularDamping : 0.8
    });
    rigidBodies[rigidBodies.length] = {
        body : p2pMoveableBody1,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.43, 0.89, 0.89, 1),
        constraintName : "Point2Point"
    };
    dynamicsWorld.addRigidBody(p2pMoveableBody1);

    // Moveable body2
    var p2pMoveableBody2 = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : mass,
        inertia : inertia,
        transform : [
            1.0, 0.0,   0.0,
            0.0, 1.0,   0.0,
            0.0, 0.0,   1.0,
            0.0, 3.0, -20.0
        ],
        linearDamping :  0.8,
        angularDamping : 0.8
    });
    rigidBodies[rigidBodies.length] = {
        body : p2pMoveableBody2,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.43, 0.89, 0.89, 1),
        constraintName : "Point2Point"
    };
    dynamicsWorld.addRigidBody(p2pMoveableBody2);

    // Fixed Body
    var p2pFixedBody = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : 0.0,
        transform : mathDevice.m43Build(
            1.0, 0.0,   0.0,
            0.0, 1.0,   0.0,
            0.0, 0.0,   1.0,
            0.0, 6.0, -20.0
        )
    });
    rigidBodies[rigidBodies.length] = {
        body : p2pFixedBody,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.43, 0.89, 0.89, 1),
        constraintName : "Point2Point"
    };
    dynamicsWorld.addRigidBody(p2pFixedBody);

    var pivotInA = mathDevice.v3Build(0.5, -0.5, -0.5);
    // Transform the pivot point of bodyA into the object space of bodyB
    // pivotInB = inverse(p2pMoveableBody1.transform) * (p2pFixedBody.transform * pivotInA)
    var pivotInB = mathDevice.m43TransformVector(mathDevice.m43InverseOrthonormal(p2pMoveableBody1.transform),
                                                 mathDevice.m43TransformVector(p2pFixedBody.transform, pivotInA));

    var p2pConstraint1 = physicsDevice.createPoint2PointConstraint({
        bodyA : p2pMoveableBody1,
        bodyB : p2pFixedBody,
        pivotA : pivotInA,
        pivotB : pivotInB
    });
    dynamicsWorld.addConstraint(p2pConstraint1);

    pivotInA = mathDevice.v3Build(-0.5, -0.5, 0.5, pivotInA);
    // Transform the pivot point of bodyA into the object space of bodyB
    // pivotInB = inverse(p2pMoveableBody2.transform) * (p2pMoveableBody1.transform * pivotInA)
    pivotInB = mathDevice.m43TransformVector(mathDevice.m43InverseOrthonormal(p2pMoveableBody2.transform),
                                                 mathDevice.m43TransformVector(p2pMoveableBody1.transform, pivotInA),
                                                 pivotInB);

    var p2pConstraint2 = physicsDevice.createPoint2PointConstraint({
        bodyA : p2pMoveableBody2,
        bodyB : p2pMoveableBody1,
        pivotA : pivotInA,
        pivotB : pivotInB
    });
    dynamicsWorld.addConstraint(p2pConstraint2);

    // CONETWIST CONSTRAINT

    // Moveable Box
    var coneTwistMoveableBody = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : mass,
        inertia : inertia,
        transform : mathDevice.m43Build(
            1.0, 0.0,   0.0,
            0.0, 1.0,   0.0,
            0.0, 0.0,   1.0,
            3.0, 7.0, -30.0
        ),
        linearDamping :  0.8,
        angularDamping : 0.8
    });
    rigidBodies[rigidBodies.length] = {
        body : coneTwistMoveableBody,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.88, 0.78, 0.78, 1),
        constraintName : "ConeTwist"
    };
    dynamicsWorld.addRigidBody(coneTwistMoveableBody);

    // Fixed body
    var coneTwistFixedBody = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : 0.0,
        transform : mathDevice.m43Build(
            1.0, 0.0,   0.0,
            0.0, 1.0,   0.0,
            0.0, 0.0,   1.0,
            0.0, 6.0, -30.0
        )
    });
    rigidBodies[rigidBodies.length] = {
        body : coneTwistFixedBody,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.88, 0.78, 0.78, 1),
        constraintName : "ConeTwist"
    };
    dynamicsWorld.addRigidBody(coneTwistFixedBody);

    // Set up the frame of reference for the conetwist constraint
    var rotation = mathDevice.quatBuild(pi / 2, 0.0, 0.0, pi / 2);
    mathDevice.quatNormalize(rotation, rotation);
    var translation = mathDevice.v3Build(-3, 0.0, 0.0);
    frameInA = mathDevice.m43FromRT(rotation, translation);

    translation = mathDevice.v3Build(0.0, 0.0, 0.0, translation);
    var frameInB = mathDevice.m43FromRT(rotation, translation);

    var coneTwistConstraint = physicsDevice.createConeTwistConstraint({
        bodyA : coneTwistMoveableBody,
        bodyB : coneTwistFixedBody,
        transformA : frameInA,
        transformB : frameInB,
        damping : 5.0,
        swingSpan1 : (pi / 4) * 0.6,
        swingSpan2 : pi / 4,
        twistSpan  : pi * 0.7
    });
    dynamicsWorld.addConstraint(coneTwistConstraint);

    // 6DOF CONSTRAINT

    // Fixed Body
    var sixDOFFixedBody = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : 0.0,
        transform : mathDevice.m43Build(
            1.0, 0.0,   0.0,
            0.0, 1.0,   0.0,
            0.0, 0.0,   1.0,
            0.0, 6.0, -40.0
        )
    });
    rigidBodies[rigidBodies.length] = {
        body : sixDOFFixedBody,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.52, 0.88, 0.52, 1),
        constraintName : "6DOF"
    };
    dynamicsWorld.addRigidBody(sixDOFFixedBody);

    // Moveable body
    var sixDOFMoveableBody = physicsDevice.createRigidBody({
        shape : cubeShape,
        mass : mass,
        intertia : inertia,
        transform : mathDevice.m43Build(
            1.0, 0.0,   0.0,
            0.0, 1.0,   0.0,
            0.0, 0.0,   1.0,
            2.0, 4.0, -40.0
        ),
        linearDamping :  0.6,
        angularDamping : 0.6
    });
    rigidBodies[rigidBodies.length] = {
        body : sixDOFMoveableBody,
        vertexBuffer : cubeVertexbuffer,
        color : mathDevice.v4Build(0.52, 0.88, 0.52, 1),
        constraintName : "6DOF"
    };
    dynamicsWorld.addRigidBody(sixDOFMoveableBody);

    var pos = mathDevice.v3Build(0.0, 0.0, 0.0);
    frameInA = mathDevice.m43BuildTranslation(pos, frameInA);

    pos = mathDevice.v3Build(3.0, 0.0, 0.0, pos);
    frameInB = mathDevice.m43BuildTranslation(pos, frameInB);

    var sixDOFConstraint = physicsDevice.create6DOFConstraint({
        bodyA : sixDOFFixedBody,
        bodyB : sixDOFMoveableBody,
        transformA : frameInA,
        transformB : frameInB,
        linearLowerLimit : mathDevice.v3Build(-4.0, -2.0, -2.0),
        linearUpperLimit : mathDevice.v3Build(4.0, 2.0, 2.0),
        angularLowerLimit : mathDevice.v3Build(-pi / 2, -0.75, -pi / 2),
        angularUpperLimit : mathDevice.v3Build(pi / 2, 0.75, pi / 2)
    });

    dynamicsWorld.addConstraint(sixDOFConstraint);

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
    htmlControls.register();
    var constraintTypeElement = document.getElementById("constrainttype");

    //Callback to update the control
    var constraintName;

    var onKeyUp = function physicsOnkeyupFn(keynum)
    {
        cameraController.onkeyup(keynum);
    };

    // Mouse forces
    var mouseForces = MouseForces.create(graphicsDevice, inputDevice, mathDevice, physicsDevice);
    // Limit the impulse force of selecting objects in the scene
    mouseForces.clamp = 1;

    var mouseCodes = inputDevice.mouseCodes;

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

    var numObjects = rigidBodies.length;

    function desaturate(color, percent)
    {
        var newcolor = [];
        newcolor[0] = color[0] * percent;
        newcolor[1] = color[1] * percent;
        newcolor[2] = color[2] * percent;

        return newcolor;
    }

    //
    // Update
    //
    var update = function updateFn()
    {
        inputDevice.update();

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
            mouseForces.update(dynamicsWorld, camera, 0.0);

            dynamicsWorld.update();
        }

        var vp = camera.viewProjectionMatrix;
        var wvp;
        var shape;
        var body;
        var color;
        var vertexbuffer;

        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(clearColor, 1.0, 0);

            floor.render(graphicsDevice, camera);

            if (0 >= assetsToLoad)
            {
                graphicsDevice.setTechnique(technique3d);

                graphicsDevice.setTechniqueParameters(techniqueParameters3d);

                for (var n = 0; n < numObjects; n += 1)
                {
                    body = rigidBodies[n].body;
                    wvp = m43MulM44.call(mathDevice, body.transform, vp, wvp);
                    color = rigidBodies[n].color;
                    shape = body.shape;
                    vertexbuffer = rigidBodies[n].vertexBuffer;

                    if (vertexbuffer)
                    {
                        graphicsDevice.setStream(vertexbuffer, semantics);

                        graphicsDevice.setIndexBuffer(indexbuffer);
                        if (isVisibleBoxOrigin.call(mathDevice, shape.halfExtents, wvp))
                        {
                            // Use directly the active technique when just a single property changes
                            technique3d.worldViewProjection = wvp;
                            technique3d.constantColor = (body.active) ? color : desaturate(color, 0.5);
                            graphicsDevice.drawIndexed(primitive, numIndices);

                            if (mouseForces.pickedBody === body && constraintTypeElement)
                            {
                                constraintName = rigidBodies[n].constraintName;
                                constraintTypeElement.innerHTML = constraintName;
                            }
                        }
                    }
                }

                if (!mouseForces.pickedBody)
                {
                    graphicsDevice.setTechnique(technique2d);

                    var screenWidth = graphicsDevice.width;
                    var screenHeight = graphicsDevice.height;
                    techniqueParameters2d['clipSpace'] = v4Build.call(mathDevice, 2.0 / screenWidth, -2.0 / screenHeight, -1.0, 1.0);
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

                    if (constraintTypeElement)
                    {
                        constraintTypeElement.innerHTML = "None Selected";
                    }
                }

                if (debugConstraint && debugMode)
                {
                    debugConstraint.drawSliderConstraintLimits(sliderConstraint);
                    debugConstraint.drawHingeConstraintLimits(hingeConstraint);
                    debugConstraint.drawP2PConstraintLimits(p2pConstraint1);
                    debugConstraint.drawP2PConstraintLimits(p2pConstraint2);
                    debugConstraint.drawConeTwistConstraintLimits(coneTwistConstraint);
                    debugConstraint.draw6DOFConstraintLimits(sixDOFConstraint);
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
                techniqueParameters3d['diffuse'] = texture;
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
        requestHandler.request({
            src: mappingTable.getURL("shaders/debug.cgfx"),
            onload: shaderDebugLoaded
        });
    };

    var gameSessionCreated = function gameSessionCreatedFn(gameSession)
    {
        TurbulenzServices.createMappingTable(requestHandler,
                                             gameSession,
                                             mappingTableReceived);
    };
    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    function destroyScene()
    {
        TurbulenzEngine.clearInterval(intervalID);

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        requestHandler = null;
        indexbuffer = null;
        indexbufferParameters = null;
        cubeVertexbuffer = null;
        doorVertexbuffer = null;
        semantics = null;
        technique3d = null;
        shader3d = null;
        technique2d = null;
        shader2d = null;
        shaderDebug = null;
        debugConstraint = null;
        techniqueDebug = null;
        techniqueParameters2d = null;
        techniqueParameters3d = null;
        mouseForces = null;
        floor = null;
        cameraController = null;
        camera = null;
        rigidBodies = null;
        cubeExtents = null;
        doorExtents = null;
        doorShape = null;
        cubeShape = null;
        constraintTypeElement = null;
        htmlControls = null;

        sliderMovingBody = null;
        sliderFixedBody = null;
        sliderConstraint = null;
        hingeDoorBody = null;
        hingeConstraint = null;
        coneTwistMoveableBody = null;
        coneTwistFixedBody = null;
        coneTwistConstraint = null;
        sixDOFMoveableBody = null;
        sixDOFFixedBody = null;
        sixDOFConstraint = null;
        p2pFixedBody = null;
        p2pMoveableBody1 = null;
        p2pMoveableBody2 = null;
        p2pConstraint1 = null;
        p2pConstraint2 = null;

        rotation = null;
        transform = null;
        frameInA = null;
        frameInB = null;
        pivotInA = null;
        pivotInB = null;
        dir = null;
        xaxis = null;
        yaxis = null;

        m43MulM44 = null;
        isVisibleBoxOrigin = null;
        v4Build = null;

        mouseCodes = null;

        TurbulenzEngine.flush();
        physicsDevice = null;
        inputDevice = null;
        graphicsDevice = null;
        mathDevice = null;
    }

    TurbulenzEngine.onunload = destroyScene;
};
