/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
 * @title: 2D Physics constraints
 * @description:
 * This sample shows how to create each of the 2D physics constraints
 * (point, weld, distance, line, angle, motor, pulley and custom).
 * Each object in the scene can be manipulated with the mouse to see how the constraints work.
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
/*{{ javascript("jslib/fontmanager.js") }}*/

/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global Physics2DDevice: false */
/*global Draw2D: false */
/*global FontManager: false */
/*global ShaderManager: false */
/*global Physics2DDebugDraw: false */
/*global HTMLControls: false */

TurbulenzEngine.onload = function onloadFn()
{
    //==========================================================================
    // HTML Controls
    //==========================================================================
    var htmlControls;

    var elasticConstraints = false;
    var frequency = 1;
    var damping = 0.1;

    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var requestHandler = RequestHandler.create({});

    var fontManager = FontManager.create(graphicsDevice, requestHandler);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler);

    var font, shader, gameSession;
    function sessionCreated()
    {
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            function (mappingTable)
            {
                var urlMapping = mappingTable.urlMapping;
                var assetPrefix = mappingTable.assetPrefix;
                shaderManager.setPathRemapping(urlMapping, assetPrefix);
                fontManager.setPathRemapping(urlMapping, assetPrefix);
                fontManager.load('fonts/hero.fnt', function (fontObject)
                    {
                        font = fontObject;
                    });
                shaderManager.load('shaders/font.cgfx', function (shaderObject)
                    {
                        shader = shaderObject;
                    });
            }
        );
    }
    gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);

    //==========================================================================
    // Physics2D/Draw2D (Use Draw2D to define viewport scalings)
    //==========================================================================

    // set up.
    var phys2D = Physics2DDevice.create();

    // size of physics stage.
    var stageWidth = 40; // meters
    var stageHeight = 20; // meters

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

    // Create a static body at (0, 0) with no rotation
    // which we add to the world to use as the first body
    // in hand constraint. We set anchor for this body
    // as the cursor position in physics coordinates.
    var staticReferenceBody = phys2D.createRigidBody({
        type : 'static'
    });
    world.addRigidBody(staticReferenceBody);
    var handConstraint = null;

    function reset()
    {
        // Remove all bodies and constraints from world.
        world.clear();
        handConstraint = null;

        // Create a static body around the stage to stop objects leaving the viewport.
        // And walls between each constraint section.
        var border = phys2D.createRigidBody({
            type : 'static'
        });

        var thickness = 0.01; // 1cm
        var i;
        for (i = 0; i <= 4; i += 1)
        {
            var x = (stageWidth / 4) * i;
            border.addShape(phys2D.createPolygonShape({
                vertices : phys2D.createRectangleVertices(x - thickness, 0, x + thickness, stageHeight)
            }));
        }
        for (i = 0; i <= 2; i += 1)
        {
            var y = (stageHeight / 2) * i;
            border.addShape(phys2D.createPolygonShape({
                vertices : phys2D.createRectangleVertices(0, y - thickness, stageWidth, y + thickness)
            }));
        }

        world.addRigidBody(border);

        function circle(x: number, y: number, radius: number, pinned?: bool)
        {
            var body = phys2D.createRigidBody({
                shapes : [
                    phys2D.createCircleShape({
                        radius : radius
                    })
                ],
                position : [x, y]
            });
            world.addRigidBody(body);

            if (pinned)
            {
                var pin = phys2D.createPointConstraint({
                    bodyA : staticReferenceBody,
                    bodyB : body,
                    anchorA : [x, y],
                    anchorB : [0, 0],
                    userData : "pin"
                });
                world.addConstraint(pin);
            }

            return body;
        }

        var bodyA, bodyB, worldAnchor;

        // ------------------------------------
        // Point Constraint
        bodyA = circle(3.3, 5, 1);
        bodyB = circle(6.6, 5, 1);

        worldAnchor = [5, 5];
        var pointConstraint = phys2D.createPointConstraint({
            bodyA : bodyA,
            bodyB : bodyB,
            anchorA : bodyA.transformWorldPointToLocal(worldAnchor),
            anchorB : bodyB.transformWorldPointToLocal(worldAnchor),

            stiff : (!elasticConstraints),
            frequency : frequency,
            damping : damping
        });
        world.addConstraint(pointConstraint);

        // ------------------------------------
        // Weld Constraint
        bodyA = circle(13.3, 5, 1);
        bodyB = circle(16.6, 5, 1);

        worldAnchor = [15, 5];
        var weldConstraint = phys2D.createWeldConstraint({
            bodyA : bodyA,
            bodyB : bodyB,
            anchorA : bodyA.transformWorldPointToLocal(worldAnchor),
            anchorB : bodyB.transformWorldPointToLocal(worldAnchor),
            phase : 0,

            stiff : (!elasticConstraints),
            frequency : frequency,
            damping : damping
        });
        world.addConstraint(weldConstraint);

        // ------------------------------------
        // Distance Constraint
        bodyA = circle(23.3, 5, 1);
        bodyB = circle(26.6, 5, 1);

        var distanceConstraint = phys2D.createDistanceConstraint({
            bodyA : bodyA,
            bodyB : bodyB,
            anchorA : [1, 0],
            anchorB : [-1, 0],
            lowerBound : 1,
            upperBound : 3,

            stiff : (!elasticConstraints),
            frequency : frequency,
            damping : damping
        });
        world.addConstraint(distanceConstraint);

        // ------------------------------------
        // Line Constraint
        bodyA = circle(33.3, 5, 1);
        bodyB = circle(36.6, 5, 1);

        worldAnchor = [35, 5];
        var lineConstraint = phys2D.createLineConstraint({
            bodyA : bodyA,
            bodyB : bodyB,
            anchorA : bodyA.transformWorldPointToLocal(worldAnchor),
            anchorB : bodyB.transformWorldPointToLocal(worldAnchor),
            axis : [0, 1],
            lowerBound : -1,
            upperBound : 1,

            stiff : (!elasticConstraints),
            frequency : frequency,
            damping : damping
        });
        world.addConstraint(lineConstraint);

        // ------------------------------------
        // Angle Constraint
        bodyA = circle(3, 15, 1.5, true);
        bodyB = circle(7, 15, 1.5, true);

        var angleConstraint = phys2D.createAngleConstraint({
            bodyA : bodyA,
            bodyB : bodyB,
            ratio : 3,
            lowerBound : -Math.PI * 2,
            upperBound : Math.PI * 2,

            stiff : (!elasticConstraints),
            frequency : frequency,
            damping : damping
        });
        world.addConstraint(angleConstraint);

        // ------------------------------------
        // Motor Constraint
        bodyA = circle(13, 15, 1.5, true);
        bodyB = circle(17, 15, 1.5, true);

        var motorConstraint = phys2D.createMotorConstraint({
            bodyA : bodyA,
            bodyB : bodyB,
            ratio : 4,
            rate : 20
        });
        world.addConstraint(motorConstraint);

        // ------------------------------------
        // Pulley Constraint

        var bodyC;
        bodyA = circle(23.3, 16.6, 0.5);
        bodyB = circle(25, 13.3, 1, true);
        bodyC = circle(26.6, 16.6, 0.5);

        // Additional distance constraints to prevent pulley
        // becoming degenerate when one side becomes 0 length.
        var distanceA = phys2D.createDistanceConstraint({
            bodyA : bodyA,
            bodyB : bodyB,
            lowerBound : 0.25,
            upperBound : Number.POSITIVE_INFINITY,
            anchorA : [0, -0.5],
            anchorB : [-1, 0],
            userData : 'pin'
        });
        world.addConstraint(distanceA);

        var distanceB = phys2D.createDistanceConstraint({
            bodyA : bodyC,
            bodyB : bodyB,
            lowerBound : 0.25,
            upperBound : Number.POSITIVE_INFINITY,
            anchorA : [0, -0.5],
            anchorB : [1, 0],
            userData : 'pin'
        });
        world.addConstraint(distanceB);

        var pulleyConstraint = phys2D.createPulleyConstraint({
            bodyA : bodyA,
            bodyB : bodyB,
            bodyC : bodyB,
            bodyD : bodyC,
            anchorA : [0, -0.5],
            anchorB : [-1, 0],
            anchorC : [1, 0],
            anchorD : [0, -0.5],
            ratio : 2,
            lowerBound : 6,
            upperBound : 8,

            stiff : (!elasticConstraints),
            frequency : frequency,
            damping : damping
        });
        world.addConstraint(pulleyConstraint);

        // ------------------------------------
        // Custom Constraint
        bodyA = circle(35, 13.3, 1);
        bodyB = circle(35, 16.6, 1, true);

        // Additional line constraint to pin upper body to rack.
        var line = phys2D.createLineConstraint({
            bodyA : staticReferenceBody,
            bodyB : bodyA,
            anchorA : [35, 13.3],
            anchorB : [0, 0],
            axis : [1, 0],
            lowerBound : -5,
            upperBound : 5,
            userData : 'pin'
        });
        world.addConstraint(line);

        // Custom constraint defined so that the x-position of
        // the first body, is equal to the rotation of the
        // second body.
        //
        // Constraint equation:
        //    (pi / 5) * (bodyA.posX - 35) - bodyB.rotation = 0
        //
        // Time Derivative (Velocity constraint):
        //    (pi / 5) * bodyA.velX - bodyB.angularVel = 0
        //
        // Partial derivatives of velocity constraint (Jacobian)
        //        velAx   velAy  angVelA  velBx  velBy  angVelB
        //    [ (pi / 5),   0,      0,      0,     0,     -1    ]
        //
        var user = phys2D.createCustomConstraint({
            bodies : [bodyA, bodyB],
            dimension : 1,

            position : function positionFn(data, index)
                {
                    var bodyA = this.bodies[0];
                    var bodyB = this.bodies[1];
                    data[index] = (Math.PI / 5 * (bodyA.getPosition()[0] - 35)) - bodyB.getRotation();
                },

            jacobian : function jacobianFn(data, index)
                {
                    data[index]     = (Math.PI / 5);
                    data[index + 1] = 0;
                    data[index + 2] = 0;

                    data[index + 3] = 0;
                    data[index + 4] = 0;
                    data[index + 5] = -1;
                },

            debugDraw : function debugDrawFn(debug, stiff)
                {
                    if (stiff)
                    {
                        return;
                    }

                    var bodyA = this.bodies[0];
                    var bodyB = this.bodies[1];

                    var posA = bodyA.getPosition();
                    var posB = bodyB.getPosition();

                    // target for x-position of bodyA
                    var targetX = ((bodyB.getRotation()) / (Math.PI / 5)) + 35;
                    // target for rotation of bodyB
                    var targetR = (Math.PI / 5 * (posA[0] - 35));

                    // 3 pixel spring radius
                    var radius = 3 * debug.screenToPhysics2D;
                    debug.drawLinearSpring(posA[0], posA[1], targetX, posA[1], 3, radius, [1, 0, 0, 1]);
                    debug.drawSpiralSpring(posB[0], posB[1], targetR, bodyB.getRotation(), radius, radius * 2, [0, 0, 1, 1]);
                },

            stiff : (!elasticConstraints),
            frequency : frequency,
            damping : damping
        });
        world.addConstraint(user);

    }
    reset();

    function invalidateConstraints()
    {
        var constraints = world.constraints;
        var limit = constraints.length;
        var i;
        for (i = 0; i < limit; i += 1)
        {
            var con = constraints[i];
            // Don't re-configure hand or pin constraints.
            if (con === handConstraint || con.userData === "pin")
            {
                continue;
            }

            con.configure({
                stiff : (!elasticConstraints),
                frequency : frequency,
                damping : damping
            });
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
                        bodyA : staticReferenceBody,
                        bodyB : body,
                        anchorA : point,
                        anchorB : body.transformWorldPointToLocal(point),
                        stiff : false,
                        maxForce : 1e5
                    });
                    world.addConstraint(handConstraint);
                }
            }
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

    var fontTechnique, fontTechniqueParameters;
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

        // Draw fonts.
        graphicsDevice.setTechnique(fontTechnique);
        fontTechniqueParameters.clipSpace = mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1,
                                                               fontTechniqueParameters.clipSpace);
        graphicsDevice.setTechniqueParameters(fontTechniqueParameters);

        function segmentFont(x, y, text, height)
        {
            var topLeft = draw2D.viewportUnmap(x, y);
            var bottomRight = draw2D.viewportUnmap(x + 10, y + height);
            font.drawTextRect(text, {
                rect : [topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]],
                scale : 1.0,
                spacing : 0,
                alignment : 1
            });
        }

        var titleHeight = 0.75;
        segmentFont(0, 0, "Point", titleHeight);
        segmentFont(10, 0, "Weld", titleHeight);
        segmentFont(20, 0, "Distance", titleHeight);
        segmentFont(30, 0, "Line", titleHeight);
        segmentFont(0, 10, "Angle", titleHeight);
        segmentFont(10, 10, "Motor", titleHeight);
        segmentFont(20, 10, "Pulley", titleHeight);
        segmentFont(30, 10, "Custom", titleHeight);

        graphicsDevice.endFrame();
    }

    var intervalID = 0;
    function loadingLoop()
    {
        if (font && shader)
        {
            fontTechnique = shader.getTechnique('font');
            fontTechniqueParameters = graphicsDevice.createTechniqueParameters({
                clipSpace : mathDevice.v4BuildZero(),
                alphaRef : 0.01,
                color : mathDevice.v4BuildOne()
            });

            TurbulenzEngine.clearInterval(intervalID);
            TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
        }
    }
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 100);

    //==========================================================================

    function loadHtmlControls()
    {
        htmlControls = HTMLControls.create();
        htmlControls.addCheckboxControl({
            id : "elasticConstraints",
            value : "elasticConstraints",
            isSelected : elasticConstraints,
            fn: function ()
            {
                elasticConstraints = !elasticConstraints;
                invalidateConstraints();
                return elasticConstraints;
            }
        });
        htmlControls.addSliderControl({
            id: "frequencySlider",
            value: (frequency),
            max: 10,
            min: 0.25,
            step: 0.25,
            fn: function ()
            {
                frequency = this.value;
                htmlControls.updateSlider("frequencySlider", frequency);
                if (elasticConstraints)
                {
                    invalidateConstraints();
                }
            }
        });
        htmlControls.addSliderControl({
            id: "dampingSlider",
            value: (damping),
            max: 2,
            min: 0,
            step: 0.25,
            fn: function ()
            {
                damping = this.value;
                htmlControls.updateSlider("dampingSlider", damping);
                if (elasticConstraints)
                {
                    invalidateConstraints();
                }
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
