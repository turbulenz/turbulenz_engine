/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
 * @title: 2D Physics callbacks
 * @description:
 * This sample shows how to use 2D physics contact callbacks
 * (preSolve, begin and progress) to implement one-way platforms and
 * destruction based on collision strength.
 * Left click to pick up and move the rigid bodies and right click to add new ones.
*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/physics2ddevice.js") }}*/
/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/boxtree.js") }}*/
/*{{ javascript("jslib/physics2ddebugdraw.js") }}*/
/*{{ javascript("jslib/textureeffects.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global Physics2DDevice: false */
/*global Physics2DDebugDraw: false */
/*global Draw2D: false */

TurbulenzEngine.onload = function onloadFn()
{
    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var requestHandler = RequestHandler.create({});

    var gameSession;
    function sessionCreated()
    {
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            function (/* table */) { }
        );
    }
    gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);

    //==========================================================================
    // Phys2D/Draw2D
    //==========================================================================

    // set up.
    var phys2D = Physics2DDevice.create();

    // size of physics stage.
    var stageWidth = 30; // m
    var stageHeight = 22; // m

    var draw2D = Draw2D.create({
        graphicsDevice : graphicsDevice
    });
    var debug = Physics2DDebugDraw.create({
        graphicsDevice : graphicsDevice
    });

    // Configure draw2D viewport to the physics stage.
    // As well as the physics2D debug-draw viewport.
    draw2D.configure({
        viewportRectangle : [0, 0, stageWidth, stageHeight],
        scaleMode : 'scale'
    });
    debug.setPhysics2DViewport([0, 0, stageWidth, stageHeight]);

    var world = phys2D.createWorld({
        gravity : [0, 20] // 20 m/s/s
    });

    // group that objects breakable by spikes are given
    // for filtering event listeners.
    var breakGroup = 4;

    var shapeSize = 2;
    var boxShape = phys2D.createPolygonShape({
        vertices : phys2D.createBoxVertices(shapeSize, shapeSize),
        userData : {
            breakCount : 3,
            shapeSize : shapeSize
        },
        group : breakGroup
    });

    // Create a static body at (0, 0) with no rotation
    // Which we add to the world to use as the first body
    // In hand constraint. We set anchor for this body
    // as the cursor position in physics coordinates.
    var handReferenceBody = phys2D.createRigidBody({
        type : 'static'
    });
    world.addRigidBody(handReferenceBody);
    var handConstraint = null;

    // Generate event listener for one-way platforms
    // given a direction of permitted movement through body.
    function oneWayListener(direction)
    {
        return function (arbiter /*, otherShape */)
            {
                var normal = arbiter.getNormal();
                // May need to flip directional logic if shapeA is not 'this'
                // as normals always point from shapeA to shapeB.
                var flip = (arbiter.shapeA !== this);
                if ((mathDevice.v2Dot(normal, direction) < 0) === flip)
                {
                    // Ignore interaction, and make action persistent 'till
                    // objects seperate.
                    arbiter.setAcceptedState(false);
                    arbiter.setPersistentState(true);
                }
            };
    }

    // Event listener used for teleporter at bottom of stage.
    function teleportListener(arbiter, otherShape)
    {
        var otherBody = otherShape.body;

        // Teleport to top of screen.
        var pos = otherBody.getPosition();
        pos[1] = -1;
        otherBody.setPosition(pos);
    }

    // Event listener used for spikes to break apart objects.
    function spikeListener(arbiter, otherShape)
    {
        // Shape may have hit more than one spike, ensure we don't break it again
        // once already broken.
        var otherBody = otherShape.body;
        if (!otherBody.world)
        {
            return;
        }

        // Assert that the impact was strong enough for spikes to break the box.
        var impulse = arbiter.getImpulseForBody(otherBody);
        if (mathDevice.v2Length(impulse) < (5 * otherBody.getMass()))
        {
            return;
        }

        world.removeRigidBody(otherBody);

        var shapeSize = (otherShape.userData.shapeSize / 2);
        var breakCount = (otherShape.userData.breakCount - 1);
        if (breakCount === 0)
        {
            // Object simply destroyed instead.
            return;
        }

        // Break shape into a 2x2 grid of smaller parts.
        // We only created square shapes, so this is easy
        var x, y;
        for (x = 0; x < 2; x += 1)
        {
            for (y = 0; y < 2; y += 1)
            {
                var localPosition = [
                    (shapeSize / 2) * ((2 * x) - 1),
                    (shapeSize / 2) * ((2 * y) - 1)
                ];

                var burstVelocity = otherBody.transformLocalVectorToWorld(localPosition);
                var newBody = phys2D.createRigidBody({
                    position : otherBody.transformLocalPointToWorld(localPosition),
                    rotation : otherBody.getRotation(),
                    velocity : mathDevice.v2AddScalarMul(otherBody.getVelocity(), burstVelocity, 10),
                    angularVelocity : otherBody.getAngularVelocity()
                });

                var newShape = otherShape.clone();
                newShape.scale(1 / 2);
                newBody.addShape(newShape);

                // Set up for next level of breaking!
                newShape.userData = {
                    breakCount : breakCount,
                    shapeSize : shapeSize
                };
                newShape.setGroup(breakGroup);

                world.addRigidBody(newBody);
            }
        }
    }

    function lightTunnelListener(position, direction)
    {
        return function (arbiter, otherShape)
            {
                var otherBody = otherShape.body;

                // Counteract gravity force on world.
                // 60 because our time step is (1 / 60) and gravity is a force.
                var mass = otherBody.getMass();
                var gravityImpulse = mathDevice.v2ScalarMul(world.getGravity(), -mass / 60);

                // Tunnel direction impulses.
                var tunnelImpulse = mathDevice.v2ScalarMul(direction, mass);

                // Impulse to guide body to centre of tunnel.
                var amount = mathDevice.v2PerpDot(mathDevice.v2Sub(otherBody.getPosition(), position), direction) * mass;
                var directionX = direction[0];
                var directionY = direction[1];
                var guideImpulse = mathDevice.v2Build(-directionY * amount, directionX * amount);
                // Add a velocity dampener.
                mathDevice.v2AddScalarMul(guideImpulse, otherBody.getVelocity(), -mass * 0.1, guideImpulse);

                otherBody.applyImpulse(gravityImpulse);
                otherBody.applyImpulse(tunnelImpulse);
                otherBody.applyImpulse(guideImpulse);

                // Dampen angular velocity too.
                otherBody.setAngularVelocity(otherBody.getAngularVelocity() * 0.95);
            };
    }

    function reset()
    {
        // Remove all bodies and constraints from world.
        world.clear();
        handConstraint = null;

        // Create border body.
        var thickness = 0.01; // 1 cm
        var border = phys2D.createRigidBody({
            type : 'static',
            shapes : [
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(0, 0, thickness, stageHeight)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices((stageWidth - thickness), 0, stageWidth, stageHeight)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(stageWidth - 2, (stageHeight - thickness - 1), stageWidth, stageHeight)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(0, (stageHeight - thickness - 1), stageWidth - 8, stageHeight)
                })
            ]
        });

        // Set up top bar of border with preSolve handler allowing one-way motion
        // from the top down.
        var topBar = phys2D.createPolygonShape({
            vertices : phys2D.createRectangleVertices(0, 1, stageWidth, thickness + 1)
        });
        border.addShape(topBar);
        // Set as a deterministic handler operating on all objects (undefined mask).
        topBar.addEventListener('preSolve', oneWayListener(mathDevice.v2Build(0, 1)), undefined, true);

        // Set up sensor bar at bottom of border to teleport bodies.
        var sensorBar = phys2D.createPolygonShape({
            vertices : phys2D.createRectangleVertices(stageWidth - 8, (stageHeight - 0.5), stageWidth - 2, stageHeight),
            sensor : true
        });
        border.addShape(sensorBar);
        // Unspecified mask means operate on all objects.
        sensorBar.addEventListener('begin', teleportListener);

        world.addRigidBody(border);

        var spikes = function spikesFn(x: number, y: number,
                                       directionX: number, directionY: number,
                                       count: number, startIndex?: number)
        {
            var spikeBody = phys2D.createRigidBody({
                type : 'static'
            });

            // Create set of spikes.
            var spikeWidth = 0.5;
            var spikeHeight = 0.5;
            var i;
            startIndex = (startIndex || 0);
            for (i = startIndex; i < (startIndex + count); i += 1)
            {
                var posX = x - (directionY * spikeWidth * i);
                var posY = y + (directionX * spikeWidth * i);
                var spike = phys2D.createPolygonShape({
                    vertices : [
                        [ posX,
                          posY ],
                        [ posX - (spikeWidth * directionY / 2) + (spikeHeight * directionX),
                          posY + (spikeWidth * directionX / 2) + (spikeHeight * directionY) ],
                        [ posX - (spikeWidth * directionY),
                          posY + (spikeWidth * directionX) ]
                    ]
                });

                // Don't invoke listener on shapes we don't want to break.
                // Set event listener for 'begin' and 'progress' so we can also
                // cause boxes to break by pushing them into the spikes.
                spike.addEventListener('begin', spikeListener, breakGroup);
                spike.addEventListener('progress', spikeListener, breakGroup);
                spikeBody.addShape(spike);
            }

            world.addRigidBody(spikeBody);
        };

        // Horizontal spikes (facing up [0, -1]) at bottom-left of border.
        spikes(2, stageHeight - 1, 0, -1, 8);

        // Vertical spikes (facing right [1, 0]) at mid-point of left of border.
        spikes(0, stageHeight / 4, 1, 0, 8, -4);

        // Light tunnel.
        var lightShape = phys2D.createPolygonShape({
            vertices : phys2D.createRectangleVertices(0, stageHeight / 4 - 1, stageWidth, stageHeight / 4 + 1),
            sensor : true
        });
        // light tunnel in left direction [-1, 0]
        var listener = lightTunnelListener(mathDevice.v2Build(0, stageHeight / 4), mathDevice.v2Build(-1, 0));
        lightShape.addEventListener('begin', listener);
        lightShape.addEventListener('progress', listener);

        var lightBody = phys2D.createRigidBody({
            shapes : [lightShape],
            type : 'static'
        });
        world.addRigidBody(lightBody);

        // Middle platform with one-way tunnel
        var platform = phys2D.createRigidBody({
            type : 'static',
            shapes : [
                phys2D.createPolygonShape({
                    vertices : [
                        [ 9, 11 ],
                        [ 11, 11 ],
                        [ 11, 15 ]
                    ]
                }),
                phys2D.createPolygonShape({
                    vertices : [
                        [ 17, 11 ],
                        [ 19, 11 ],
                        [ 17, 15 ]
                    ]
                }),

                // Arrow
                phys2D.createPolygonShape({
                    vertices : [
                        [ 14, 12.5 ],
                        [ 14.4, 13 ],
                        [ 13.6, 13 ]
                    ],
                    sensor : true
                }),
                phys2D.createPolygonShape({
                    vertices : [
                        [ 14.1, 13 ],
                        [ 14.1, 13.5 ],
                        [ 13.9, 13.5 ],
                        [ 13.9, 13 ]
                    ],
                    sensor : true
                })
            ]
        });

        thickness = 0.1;
        topBar = phys2D.createPolygonShape({
            vertices : phys2D.createRectangleVertices(11, 11, 17, 11 + thickness)
        });
        platform.addShape(topBar);
        // Set as a deterministic handler operating on all objects (undefined mask).
        topBar.addEventListener('preSolve', oneWayListener(mathDevice.v2Build(0, -1)), undefined, true);
        var bottomBar = phys2D.createPolygonShape({
            vertices : phys2D.createRectangleVertices(11, 15 - thickness, 17, 15)
        });
        platform.addShape(bottomBar);
        // Set as a deterministic handler operating on all objects (undefined mask).
        bottomBar.addEventListener('preSolve', oneWayListener(mathDevice.v2Build(0, -1)), undefined, true);

        world.addRigidBody(platform);

        // Set up some initial objects.
        var generate = function generateFn(x: number, y: number,
                                           scale: number, breakCount: number)
        {
            var shape = boxShape.clone();
            shape.scale(scale);
            shape.userData = {
                shapeSize : (shapeSize * scale),
                breakCount : breakCount
            };

            var body = phys2D.createRigidBody({
                shapes : [shape],
                position : [x, y]
            });
            world.addRigidBody(body);
        };

        generate(15, 14, 1, 3);
        generate(13.5, 14.5, 0.5, 2);
        generate(12.75, 14.75, 0.25, 1);

        generate(4, 15, 1, 3);
        generate(4, 13, 1, 3);
        generate(4, 11, 1, 3);

        generate(stageWidth - 5, 15, 1, 3);
    }

    reset();

    //==========================================================================
    // Mouse/Keyboard controls
    //==========================================================================

    var inputDevice = TurbulenzEngine.createInputDevice({});
    var keyCodes = inputDevice.keyCodes;
    var mouseCodes = inputDevice.mouseCodes;

    var mouseX = 0;
    var mouseY = 0;
    var onMouseOver = function mouseOverFn(x, y)
    {
        mouseX = x;
        mouseY = y;
    };
    inputDevice.addEventListener('mouseover', onMouseOver);

    var onKeyUp = function onKeyUpFn(keynum)
    {
        if (keynum === keyCodes.R) // 'r' key
        {
            reset();
        }
    };
    inputDevice.addEventListener('keyup', onKeyUp);

    var onMouseDown = function onMouseDownFn(code, x, y)
    {
        mouseX = x;
        mouseY = y;

        if (handConstraint)
        {
            return;
        }

        var point = draw2D.viewportMap(x, y);
        var body;
        if (code === mouseCodes.BUTTON_0) // Left button
        {
            if (handConstraint)
            {
                world.removeConstraint(handConstraint);
                handConstraint = null;
            }

            var bodies = [];
            var numBodies = world.bodyPointQuery(point, bodies);
            var i;
            for (i = 0; i < numBodies; i += 1)
            {
                body = bodies[i];
                if (body.isDynamic())
                {
                    handConstraint = phys2D.createPointConstraint({
                        bodyA : handReferenceBody,
                        bodyB : body,
                        anchorA : point,
                        anchorB : body.transformWorldPointToLocal(point),
                        stiff : false,
                        maxForce : 1e5
                    });
                    world.addConstraint(handConstraint);
                    break;
                }
            }
        }
        else if (code === mouseCodes.BUTTON_1) // Right button
        {
            body = phys2D.createRigidBody({
                shapes : [boxShape.clone()],
                position : point
            });
            world.addRigidBody(body);
        }
    };
    inputDevice.addEventListener('mousedown', onMouseDown);

    var onMouseLeaveUp = function onMouseLeaveUpFn()
    {
        if (handConstraint)
        {
            world.removeConstraint(handConstraint);
            handConstraint = null;
        }
    };
    inputDevice.addEventListener('mouseleave', onMouseLeaveUp);
    inputDevice.addEventListener('mouseup', onMouseLeaveUp);

    //==========================================================================
    // Main loop.
    //==========================================================================

    var realTime = 0;
    var prevTime = TurbulenzEngine.time;

    function mainLoop()
    {
        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        inputDevice.update();
        graphicsDevice.clear([0.3, 0.3, 0.3, 1.0]);

        if (handConstraint)
        {
            handConstraint.setAnchorA(draw2D.viewportMap(mouseX, mouseY));
            var body = handConstraint.bodyB;

            // Additional angular dampening of body being dragged.
            // Helps it to settle quicker instead of spinning around
            // the cursor.
            body.setAngularVelocity(body.getAngularVelocity() * 0.9);
        }

        var curTime = TurbulenzEngine.time;
        var timeDelta = (curTime - prevTime);
        // Prevent trying to simulate too much time at once!
        if (timeDelta > (1 / 20))
        {
            timeDelta = (1 / 20);
        }
        realTime += timeDelta;
        prevTime = curTime;

        while (world.simulatedTime < realTime)
        {
            world.step(1 / 60);
        }

        // physics2D debug drawing.
        debug.setScreenViewport(draw2D.getScreenSpaceViewport());
        debug.begin();
        debug.drawWorld(world);
        debug.end();

        graphicsDevice.endFrame();
    }

    var intervalID = TurbulenzEngine.setInterval(mainLoop, (1000 / 60));

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        if (mainLoop)
        {
            TurbulenzEngine.clearInterval(intervalID);
        }

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }
    };
};
