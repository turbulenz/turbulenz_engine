/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
 * @title: 2D Physics
 * @description:
 * This sample shows how to create and use the Turbulenz 2D physics device.
 * The sample creates several 2D static objects with surface velocity,
 * two animated kinematic objects to push and lift objects around,
 * and a hundred rigid bodies with different material properties.
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
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global Physics2DDevice: false */
/*global Draw2D: false */
/*global Draw2DSprite: false */
/*global Physics2DDebugDraw: false */
/*global HTMLControls: false */

TurbulenzEngine.onload = function onloadFn()
{
    //==========================================================================
    // HTML Controls
    //==========================================================================
    var htmlControls;

    var debugEnabled = false;
    var contactsEnabled = false;

    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var requestHandler = RequestHandler.create({});

    var draw2DTexture;
    var gameSession;
    function sessionCreated(gameSession)
    {
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            function (table) {
                graphicsDevice.createTexture({
                    src : table.getURL("textures/physics2d.png"),
                    mipmaps : true,
                    onload : function (texture)
                    {
                        if (texture)
                        {
                            draw2DTexture = texture;
                        }
                    }
                });
            }
        );
    }
    gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);

    //==========================================================================
    // Physics2D/Draw2D
    //==========================================================================

    // set up.
    var phys2D = Physics2DDevice.create();

    // size of physics stage.
    var stageWidth = 30; // meters
    var stageHeight = 22; // meters

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
        gravity : [0, 20] // 20 meters/s^2
    });

    var rubberMaterial = phys2D.createMaterial({
        elasticity : 0.9,
        staticFriction : 6,
        dynamicFriction : 4,
        rollingFriction : 0.001
    });

    var heavyMaterial = phys2D.createMaterial({
        density : 3
    });

    var conveyorBeltMaterial = phys2D.createMaterial({
        elasticity : 0,
        staticFriction : 10,
        dynamicFriction : 8,
        rollingFriction : 0.1
    });

    var shapeSize = 0.8;
    var shapeFactory : Physics2DShape[] = [
        phys2D.createCircleShape({
            radius : (shapeSize / 2),
            material : rubberMaterial
        }),
        phys2D.createPolygonShape({
            vertices : phys2D.createBoxVertices(shapeSize, shapeSize),
            material : heavyMaterial
        }),
        phys2D.createPolygonShape({
            vertices : phys2D.createRegularPolygonVertices(shapeSize, shapeSize, 3),
            material : heavyMaterial
        }),
        phys2D.createPolygonShape({
            vertices : phys2D.createRegularPolygonVertices(shapeSize, shapeSize, 6),
            material : rubberMaterial
        })
    ];

    // texture rectangles for above shapes.
    var textureRectangles = [
        [130, 130, 255, 255],
        [5, 132, 125, 252],
        [131, 3, 251, 123],
        [5, 5, 125, 125]
    ];

    // Create a static body at (0, 0) with no rotation
    // which we add to the world to use as the first body
    // in hand constraint. We set anchor for this body
    // as the cursor position in physics coordinates.
    var handReferenceBody = phys2D.createRigidBody({
        type : 'static'
    });
    world.addRigidBody(handReferenceBody);
    var handConstraint = null;

    var animationState = 0;
    var lift;
    var pusher;

    function reset()
    {
        // Remove all bodies and constraints from world.
        world.clear();
        handConstraint = null;

        // Create a static border body around the stage to stop objects leaving the viewport.
        var thickness = 0.01; // 1 cm
        var border = phys2D.createRigidBody({
            type : 'static',
            shapes : [
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(0, 0, thickness, stageHeight)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(0, 0, stageWidth, thickness)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices((stageWidth - thickness), 0, stageWidth, stageHeight)
                }),
                phys2D.createPolygonShape({
                    vertices : phys2D.createRectangleVertices(0, (stageHeight - thickness), stageWidth, stageHeight)
                })
            ]
        });
        world.addRigidBody(border);

        var createBelt = function createBeltFn(x1, y1, x2, y2, radius, speed)
        {
            var normal = mathDevice.v2Build(y2 - y1, x1 - x2);
            mathDevice.v2ScalarMul(normal, radius / mathDevice.v2Length(normal), normal);

            var shapes : Physics2DShape[] = [
                phys2D.createPolygonShape({
                    vertices : [
                        [ x1 + normal[0], y1 + normal[1] ],
                        [ x2 + normal[0], y2 + normal[1] ],
                        [ x2 - normal[0], y2 - normal[1] ],
                        [ x1 - normal[0], y1 - normal[1] ]
                    ],
                    material : conveyorBeltMaterial
                }),
                phys2D.createCircleShape({
                    radius : radius,
                    origin : [x1, y1],
                    material : conveyorBeltMaterial
                }),
                phys2D.createCircleShape({
                    radius : radius,
                    origin : [x2, y2],
                    material : conveyorBeltMaterial
                })
            ];
            var body = phys2D.createRigidBody({
                type : 'static',
                surfaceVelocity : [speed, 0],
                shapes : shapes,
            });

            return body;
        };

        var belt;
        belt = createBelt(0, 11, 7, 14, 0.5, 2);
        world.addRigidBody(belt);

        belt = createBelt(7, 14, 14, 11, 0.5, 2);
        world.addRigidBody(belt);

        belt = createBelt(12, 19, 20.5, 17, 0.5, 2);
        world.addRigidBody(belt);

        belt = createBelt(20.5, 10.5, 10, 5, 0.5, -2);
        world.addRigidBody(belt);

        belt = createBelt(10, 5, 5, 5, 0.5, -2);
        world.addRigidBody(belt);

        // Create lift and pusher bodies.
        lift = phys2D.createRigidBody({
            shapes : [
                phys2D.createPolygonShape({
                    vertices : phys2D.createBoxVertices(9, 0.01)
                })
            ],
            type : 'kinematic',
            position : [stageWidth - 4.5, stageHeight]
        });
        pusher = phys2D.createRigidBody({
            shapes : [
                phys2D.createPolygonShape({
                    vertices : phys2D.createBoxVertices(9, 10)
                })
            ],
            type : 'kinematic',
            position : [stageWidth + 4.5, 5]
        });
        world.addRigidBody(lift);
        world.addRigidBody(pusher);
        animationState = 0;

        // Create piles of each factory shape.
        var x, y;
        var xCount = Math.floor(stageWidth / shapeSize);
        for (x = 0; x < xCount; x += 1)
        {
            for (y = 0; y < 4; y += 1)
            {
                var index = (y % shapeFactory.length);
                var shape = shapeFactory[index];
                var body = phys2D.createRigidBody({
                    shapes : [shape.clone()],
                    position : [
                        (x + 0.5) * (stageWidth / xCount),
                        (y + 0.5) * shapeSize
                    ],
                    userData : Draw2DSprite.create({
                        width : shapeSize,
                        height : shapeSize,
                        origin : [shapeSize / 2, shapeSize / 2],
                        textureRectangle : textureRectangles[index],
                        texture : draw2DTexture
                    })
                });
                world.addRigidBody(body);
            }
        }
    }

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
            var index = Math.floor(Math.random() * shapeFactory.length);
            body = phys2D.createRigidBody({
                shapes : [shapeFactory[index].clone()],
                position : point,
                userData : Draw2DSprite.create({
                    width : shapeSize,
                    height : shapeSize,
                    origin : [shapeSize / 2, shapeSize / 2],
                    textureRectangle : textureRectangles[index],
                    texture : draw2DTexture
                })
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

    var fpsElement = document.getElementById("fpscounter");
    var lastFPS = "";

    var bodiesElement = document.getElementById("bodiescounter");
    var lastNumBodies = 0;

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

        var body;
        if (handConstraint)
        {
            body = handConstraint.bodyB;
            handConstraint.setAnchorA(draw2D.viewportMap(mouseX, mouseY));

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
            // lift/pusher animation
            if (animationState === 0)
            {
                // Start of animatino, set velocity of lift to move up to the target
                // in 3 seconds.
                lift.setVelocityFromPosition([ stageWidth - 4.5, 10], 0, 3);
                animationState = 1;
            }
            else if (animationState === 1)
            {
                if (lift.getPosition()[1] <= 10)
                {
                    // Reached target position for lift.
                    // Set position incase it over-reached and zero velocity.
                    lift.setPosition([ stageWidth - 4.5, 10 ]);
                    lift.setVelocity([0, 0]);

                    // Start pusher animation to move left.
                    pusher.setVelocityFromPosition([ stageWidth - 4.5, 5 ], 0, 1.5);
                    animationState = 2;
                }
            }
            else if (animationState === 2)
            {
                if (pusher.getPosition()[0] <= (stageWidth - 4.5))
                {
                    // Reached target position for pusher.
                    // Set velocities of pusher and lift to both move right off-screen.
                    pusher.setVelocityFromPosition([ stageWidth + 4.5, 5], 0, 1);
                    lift.setVelocityFromPosition([ stageWidth + 4.5, 10], 0, 1);
                    animationState = 3;
                }
            }
            else if (animationState === 3)
            {
                if (pusher.getPosition()[0] >= stageWidth + 4.5)
                {
                    // Reached target.
                    // Reset positions and velocities and begin animation afresh.
                    pusher.setPosition([ stageWidth + 4.5, 5]);
                    pusher.setVelocity([0, 0]);
                    lift.setPosition([ stageWidth - 4.5, stageHeight ]);
                    lift.setVelocity([0, 0]);
                    animationState = 0;
                }
            }

            world.step(1 / 60);
        }

        // draw2D sprite drawing.
        var bodies = world.rigidBodies;
        var limit = bodies.length;
        var i;
        if (!debugEnabled)
        {
            draw2D.begin('alpha', 'deferred');
            var pos = [];
            for (i = 0; i < limit; i += 1)
            {
                body = bodies[i];
                if (body.userData)
                {
                    body.getPosition(pos);
                    var sprite = body.userData;
                    sprite.x = pos[0];
                    sprite.y = pos[1];
                    sprite.rotation = body.getRotation();
                    draw2D.drawSprite(sprite);
                }
            }
            draw2D.end();
        }

        // physics2D debug drawing.
        debug.setScreenViewport(draw2D.getScreenSpaceViewport());
        debug.showRigidBodies = debugEnabled;
        debug.showContacts = contactsEnabled;

        debug.begin();
        if (!debugEnabled)
        {
            // draw anything without a Draw2DSprite.
            for (i = 0; i < limit; i += 1)
            {
                body = bodies[i];
                if (!body.userData)
                {
                    debug.drawRigidBody(body);
                }
            }
        }
        debug.drawWorld(world);
        debug.end();

        graphicsDevice.endFrame();

        if (fpsElement)
        {
            var fpsText = (graphicsDevice.fps).toFixed(2);
            if (lastFPS !== fpsText)
            {
                lastFPS = fpsText;

                fpsElement.innerHTML = fpsText + " fps";
            }
        }

        if (bodiesElement)
        {
            if (lastNumBodies !== limit)
            {
                lastNumBodies = limit;

                bodiesElement.innerHTML = lastNumBodies + "";
            }
        }
    }

    var intervalID;
    function loadingLoop()
    {
        if (!draw2DTexture)
        {
            return;
        }

        reset();
        TurbulenzEngine.clearInterval(intervalID);
        intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
    }
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 10);

    //==========================================================================

    function loadHtmlControls()
    {
        htmlControls = HTMLControls.create();
        htmlControls.addCheckboxControl({
            id : "enableDebug",
            value : "debugEnabled",
            isSelected : debugEnabled,
            fn: function ()
            {
                debugEnabled = !debugEnabled;
                return debugEnabled;
            }
        });
        htmlControls.addCheckboxControl({
            id : "enableContacts",
            value : "contactsEnabled",
            isSelected : contactsEnabled,
            fn: function ()
            {
                contactsEnabled = !contactsEnabled;
                return contactsEnabled;
            }
        });
        htmlControls.register();
    }

    loadHtmlControls();

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        if (intervalID)
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
