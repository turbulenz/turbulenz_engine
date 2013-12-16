/*{# Copyright (c) 2013 Turbulenz Limited #}*/

/*
 * @title: GPU ParticleSystem
 * @description:
 * This sample demonstrates the capabilities and usage of the GPU ParticleSystem.
*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/floor.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/scenedebugging.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/forwardrendering.js") }}*/
/*{{ javascript("jslib/particlesystem.js") }}*/
/*{{ javascript("jslib/fontmanager.js") }}*/
/*{{ javascript("jslib/canvas.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global CameraController: false */
/*global Camera: false */
/*global Canvas: false */
/*global EffectManager: false */
/*global Floor: false */
/*global FontManager: false */
/*global ForwardRendering: false */
/*global HTMLControls: false */
/*global ParticleBuilder: false */
/*global ParticleSystem: false */
/*global ParticleView: false */
/*global RequestHandler: false*/
/*global Scene: false */
/*global SceneNode: false */
/*global ShaderManager: false */
/*global TextureManager: false */
/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global window: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    if (graphicsDevice.maxSupported("VERTEX_TEXTURE_UNITS") === 0)
    {
        errorCallback("Device does not support sampling of textures from vertex shaders " +
                      "required by GPU particle system");
        return;
    }

    var mathDevice  = TurbulenzEngine.createMathDevice({});
    var inputDevice = TurbulenzEngine.createInputDevice({});

    var requestHandler = RequestHandler.create({});
    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager  = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager  = EffectManager.create();
    var fontManager    = FontManager.create(graphicsDevice, requestHandler, null, errorCallback);

    // region of world where systems will be spawned.
    var sceneWidth  = 1000;
    var sceneHeight = 1000;

    // speed of generation.
    var generationSpeed = 50; // generations per second.
    var lastGen = 0;

    // speed of simulation (log 1.3)
    var simulationSpeed = 0;

    var camera = Camera.create(mathDevice);
    var halfFOV = Math.tan(30 * Math.PI / 180);
    camera.recipViewWindowX = 1 / halfFOV;
    camera.recipViewWindowY = 1 / halfFOV;
    camera.lookAt(mathDevice.v3Build(0, 0, 0),
                  mathDevice.v3BuildYAxis(),
                  mathDevice.v3Build(sceneWidth / 2, 30, sceneHeight / 2));
    camera.updateProjectionMatrix();
    camera.updateViewMatrix();
    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);
    var maxCameraSpeed = 200;

    var renderer;
    var clearColor = mathDevice.v4Build(0, 0, 0, 1);
    var scene = Scene.create(mathDevice);

    var floor = Floor.create(graphicsDevice, mathDevice);
    floor.color = mathDevice.v4Build(0, 0, 0.6, 1);
    floor.fadeToColor = clearColor;

    var drawRenderableExtents = false;
    function extraDrawCallback()
    {
        floor.render(graphicsDevice, camera);
        if (drawRenderableExtents)
        {
            (<any>scene).drawVisibleRenderablesExtents(graphicsDevice, shaderManager, camera, false, true);
        }
    }

    // Create canvas object for minimap.
    var canvas = Canvas.create(graphicsDevice);
    var ctx = canvas.getContext('2d');

    // Scaling to use when drawing to minimap, targetting a size of (150,150) for minimap
    var scaleX = 150 / sceneWidth;
    var scaleY = 150 / sceneHeight;
    ctx.lineWidth = 0.1;

    var fontTechnique;
    var fontTechniqueParameters;

    var fpsElement = document.getElementById("fps");
    var fpsText = "";
    function displayFPS()
    {
        if (!fpsElement)
        {
            return;
        }

        var text = graphicsDevice.fps.toFixed(2) +" fps";
        if (text !== fpsText)
        {
            fpsText = text;
            fpsElement.innerHTML = fpsText;
        }
    }

    //==========================================================================
    // Particle Systems
    //==========================================================================

    var manager = ParticleManager.create(graphicsDevice, textureManager, shaderManager);

    manager.registerParticleAnimation({
        name: "fire",
        // define a texture-size to normalize uv-coordinates with.
        // this avoid needing to use fractional values, especcialy if texture
        // may be changed in future.
        //
        // In this case the actual texture is 512x512, but we map the particle animation
        // to the top-half, so can pretend it is really 512x256.
        //
        // To simplify the uv-coordinates further, we can 'pretend' it is really 4x2 as
        // after normalization the resulting uv-coordinates would be equivalent.
        "texture0-size": [4, 2],
        texture0: [
        //  [x  y   w  h]
            [0, 0,  1, 1], // frame 0
            [1, 0,  1, 1], //
            [2, 0,  1, 1], //
            [3, 0,  1, 1], //
            [0, 1,  1, 1], //
            [1, 1,  1, 1], //
            [2, 1,  1, 1], //
            [3, 1,  1, 1], // frame 7
        ],
        animation: [{
            frame: 0
        }, {
            // after 0.6 seconds, ensure colour is still [1,1,1,1]
            time: 0.6,
            color: [1, 1, 1, 1]
        }, {
            // after another 0.1 seconds
            time: 0.1,
            // want to be 'just past' the last frame.
            // so all frames of animation have equal screen presence.
            frame: 8,
            color: [1, 1, 1, 0]
        }]
    });

    manager.registerParticleAnimation({
        name: "smoke",
        // smoke is similarly mapped as "fire" particle above, but to bottom of packed texture.
        "texture0-size": [4, 2],
        texture0: [
        //  [x  y   w  h]
            [0, 0,  1, 1], // frame 0
            [1, 0,  1, 1], //
            [2, 0,  1, 1], //
            [3, 0,  1, 1], //
            [0, 1,  1, 1], //
            [1, 1,  1, 1], //
            [2, 1,  1, 1], //
            [3, 1,  1, 1], // frame 7
        ],
        animation: [{
            frame: 0
        }, {
            // after 0.8 seconds
            time: 0.8,
            color: [1, 0.5, 0.5, 1]
        }, {
            // after another 1.4 seconds, we fade out.
            time: 0.5,
            // want to be 'just past' the last frame.
            // so all frames of animation have equal screen presence.
            frame: 8,
            color: [0, 0, 0, 0]
        }]
    });

    manager.registerParticleAnimation({
        name: "portal",
        animation: [{
            scale: [1, 1],
            "scale-interpolation": "catmull",
            color: [0, 1, 0, 1]
        },
        {
            // after 0.3 seconds
            time : 0.3,
            scale: [2, 2],
            color: [1, 1, 1, 1]
        },
        {
            // after another 0.7 seconds
            time : 0.7,
            scale: [0.5, 0.5],
            color: [1, 0, 0, 0]
        }]
    });

    var description1 = {
        system: {
            // define local system extents
            // We make extents a little larger than necessary so that in movement of system
            // particles will not push up against the edges of extents so easily.
            center      : [0, 6, 0],
            halfExtents : [7, 6, 7]
        },
        updater: {
            // set noise texture to use for randomization, and allow acceleration (when enabled)
            // to be randomized to up to the given amounts.
            noiseTexture: "textures/noise.dds",
            randomizedAcceleration: [10, 10, 10]
        },
        renderer: {
            // use default renderer with aditive blend mode
            name: "additive",
            // set noise texture to use for randomizations.
            noiseTexture: "textures/noise.dds",
            // for particles that enable these options, we're going to allow particle alphas
            // if enabled on particles, allow particle orientation to be randomized up to these
            // spherical amounts (+/-), in this case, to rotate around y-axis by +/- 0.3*Math.PI
            // specify this variation should change over time
            randomizedOrientation: [0, 0.3 * Math.PI],
            animatedOrientation: true,
            // if enabled on particles, allow particle scale to be randomized up to these
            // amounts (+/-), and define that this variation should not change over time.
            randomizedScale: [3, 3],
            animatedScale  : false
        },
        // All particles make use of this single texture.
        packedTexture: "textures/flamesmokesequence.png",
        particles: {
            fire: {
                animation: "fire",
                // select sub-set of packed texture this particles animation should be mapped to.
                "texture-uv": [0, 0, 1, 0.5], // top-half
                // apply animation tweaks to increase size of animation (x5)
                tweaks: {
                    "scale-scale": [5, 5]
                }
            },
            ember: {
                animation: "fire",
                "texture-uv": [0, 0.0, 1, 0.5], // top-half
                // apply animation tweaks so that only the second half of flip-book is used.
                // and double the size.
                tweaks: {
                    "scale-scale": [2, 2],
                    "frame-scale": 0.5,
                    "frame-offset": 4
                }
            },
            smoke: {
                animation: "smoke",
                // select sub-set of packed texture this particles animation should be mapped to.
                "texture-uv": [0, 0.5, 1, 0.5], // bottom-half
                // apply animation tweaks to increase size of animation (x3)
                tweaks: {
                    "scale-scale": [3, 3]
                }
            }
        },
        emitters: [{
            particle: {
                name: "fire",
                // let life time of particle vary between 0.6 and 1.2 of animation life time.
                lifeTimeScaleMin: 0.6,
                lifeTimeScaleMax: 1.2,
                // set userData so that its orientation will be randomized, and will have a
                // also define scale should be randomized.
                userData: DefaultParticleRenderer.createUserData({
                              facing              : "billboard",
                              randomizeOrientation: true,
                              randomizeScale      : true
                          })
            },
            emittance: {
                // emit particles 10 times per second. With 0 - 2 particles emitted each time.
                rate: 10,
                burstMin: 0,
                burstMax: 2
            },
            position: {
                // position 2 units above system position
                position: [0, 2, 0],
                // and with a randomized radius in disc of up to 1 unit
                // with a normal (gaussian) distribution to focus on centre.
                radiusMax: 1,
                radiusDistribution: "normal"
            }
        }, {
            particle: {
                name: "ember",
                // override animation life times.
                lifeTimeMin: 0.2,
                lifeTimeMax: 0.6,
                // set userData so that acceleration will be randomized and also orientation.
                userData: DefaultParticleUpdater.createUserData(true) |
                          DefaultParticleRenderer.createUserData({
                              randomizeOrientation: true
                          })
            },
            emittance: {
                // emit particles 3 times per second. With 0 - 15 particles emitted each time.
                rate: 3,
                burstMin: 0,
                burstMax: 15,
                // only start emitting after 0.25 seconds
                delay: 0.25
            },
            velocity: {
                // set velocity to a random direction in conical spread
                conicalSpread: Math.PI * 0.25,
                // and with speeds between these values.
                speedMin: 1,
                speedMax: 3
            },
            position: {
                // position 3 units above system position
                position: [0, 3, 0],
                // and in a random radius of this position in a sphere.
                spherical: true,
                radiusMin: 1,
                radiusMax: 2.5
            }
        }, {
            particle: {
                name: "smoke",
                // set userData so that acceleration will be randomized.
                userData: DefaultParticleUpdater.createUserData(true)
            },
            emittance: {
                // emit particles 20 times per second, with 0 - 3 every time.
                rate: 20,
                burstMin: 0,
                burstMax: 3
            },
            velocity: {
                // set velocity to a random direction in conical spread
                conicalSpread: Math.PI * 0.25,
                // and with speeds between these values.
                speedMin: 2,
                speedMax: 6
            },
            position: {
                // position 2.5 units above system position
                position: [0, 2.5, 0],
                // and in a random radius of this position in a sphere.
                spherical: true,
                radiusMin: 0.5,
                radiusMax: 2.0
            }
        }]
    };

    var description2 = {
        system: {
            // define local system extents
            // as with first system these are defined to be a bit larger to account for
            // movements of the system.
            center     : [0, 6, 0],
            halfExtents: [12, 6, 12]
        },
        renderer: {
            // we're going to use the default renderer with the "additive" blend mode.
            name: "additive",
            // set noise texture to use for randomizations
            noiseTexture: "textures/noise.dds",
            // for particles that enable these options, we're going to allow particle alphas
            //    to vary +/- 0.5, and this alpha variation will change over time.
            randomizedAlpha: 1.0,
            animatedAlpha: true,
            // for particles that enable these options, we're going to allow particle orientations
            //    to vary by the given spherical angles (+/-), and this variation will change over time.
            randomizedOrientation: [Math.PI*0.25, Math.PI*0.25],
            animatedOrientation  : true,
            // for particles that enable these options, we're going to allow particle rotations
            //    to vary by the given angle (+/-), and this variation will change over time.
            randomizedRotation: Math.PI*2,
            animatedRotation  : true
        },
        updater: {
            // In the absense of acceleration, set drag so that particles will come to a stop after
            //    1 second of simulation.
            drag: 1,
            // for particles that enable these options, we're going to allow acceleration applied to
            //    particles to vary according to the noise texture, up to a defined maximum in each
            //    coordinate (+/-)
            noiseTexture: "textures/noise.dds",
            randomizedAcceleration: [10, 0, 10]
        },
        particles: {
            // Define two particles to be used in this system.
            // As these define their own textures, textures will be packed at runtime by the manager.
            spark: {
                animation: "portal",
                // define animation tweaks to be applied for this particle.
                tweaks: {
                    // this defines that we're going to half the animated scale of the particle.
                    //   In effect, we're making this particle half the size the animation said it should be.
                    "scale-scale": [0.5, 0.5]
                },
                texture: "textures/particle_spark.png"
            },
            smoke: {
                animation: "portal",
                tweaks: {
                    // The effect of these parameters will be to invert the RGB colours of the particle as
                    //   defined by the animation, and particle texture.
                    "color-scale" : [-1, -1, -1, 1],
                    "color-offset": [ 1,  1,  1, 0]
                },
                texture: "textures/smoke.dds"
            }
        },
        emitters: [{
            emittance: {
                // After 1 second from the start of the effect, we're going to emit particles 80 times per second.
                delay: 1,
                rate: 80,
                // Whenever we emit particles, we will emit exactly 4 particles.
                burstMin: 4,
                burstMax: 4
            },
            particle: {
                name: "spark",
                // Here we access functions of the updater and renderer that will be used, to set the userData
                //    that will be applied to each particle emitted.
                // We define that we want particles emitted by this emitter to have their acceleration randomize
                //    and also their alpha, orientation and rotation. We specify particle quad should be aligned
                //    with the particles velocity vector.
                userData: DefaultParticleUpdater.createUserData(true) |
                          DefaultParticleRenderer.createUserData({
                              facing              : "velocity",
                              randomizeAlpha      : true,
                              randomizeOrientation: true,
                              randomizeRotation   : true
                          })
            },
            velocity: {
                // Particles will be emitted with local speeds between these values.
                speedMin: 3,
                speedMax: 20,
                // And with a conical spread of the given angle about the default direction (y-axis).
                conicalSpread: Math.PI/10
            },
            position: {
                // Particles will be generated at radii between these values.
                radiusMin: 4,
                radiusMax: 5,
                // And the distribution of the radius selected will be according to a normal (Gaussian) distribution
                //   with the given sigma parameter.
                radiusDistribution: "normal",
                radiusSigma       : 0.125
            }
        },
        {
            emittance: {
                // We will emit particles 20 times per second.
                rate: 20,
                // And whenever we emit particles, we'll emit between 0 and 6 particles.
                burstMin: 0,
                burstMax: 6
            },
            particle: {
                name: "smoke",
                // Particles of this emitter will have their quads billboarded to face camera.
                userData: DefaultParticleRenderer.createUserData({ facing: "billboard" }),
                // Particles will live for between these amounts of time in seconds.
                useAnimationLifeTime: false,
                lifeTimeMin: 0.5,
                lifeTimeMax: 1.5
            },
            velocity: {
                speedMin: 5,
                speedMax: 15
            },
            position: {
                spherical: false,
                radiusMin: 0,
                radiusMax: 2
            }
        }]
    };

    // Produce ParticleArchetype objects based on these descriptions.
    //   These calls will verify the input descriptions for correctness, and fill in all missing parameters
    //   with the default values defined by the individual components of a particle system.
    var archetype1 = manager.parseArchetype(description1);
    var archetype2 = manager.parseArchetype(description2);

    //==========================================================================
    // Main loop
    //=========================================================================

    var previousFrameTime;
    function init()
    {
        fontTechnique = shaderManager.get("shaders/font.cgfx").getTechnique('font');
        fontTechniqueParameters = graphicsDevice.createTechniqueParameters({
            clipSpace : mathDevice.v4BuildZero(),
            alphaRef : 0.01,
            color : mathDevice.v4BuildOne()
        });

        renderer = ForwardRendering.create(
            graphicsDevice,
            mathDevice,
            shaderManager,
            effectManager,
            {}
        );

        // manager is initialized with the Scene to be worked with.
        // and the transparent pass index of the renderer, so that particle systems
        // created will be sorted with other transparent renderable elements of the Scene.
        manager.initialize(scene, renderer.passIndex.transparent);

        previousFrameTime = TurbulenzEngine.time;
    }

    // All systems are added as childs of this node so we can shuffle them around
    // in space, demonstrating trails.
    var particleNode = SceneNode.create({
        name   : "particleNode",
        dynamic: true
    });
    scene.addRootNode(particleNode);

    var moveSystems = false;
    var movementTime = 0;
    // movement radius of particleNode.
    var radius = 50;

    function mainLoop()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        previousFrameTime = currentTime;
        displayFPS();

        inputDevice.update();

        cameraController.maxSpeed = (deltaTime * maxCameraSpeed);
        cameraController.update();

        // Update the aspect ratio of the camera in case of window resizes
        var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        // alter deltaTime for simulation speed after camera maxSpeed was set to avoid
        // slowing down the camera movement.
        deltaTime *= Math.pow(1.3, simulationSpeed);

        // Update ParticleManager object with elapsed time.
        // This will add the deltaTime to the managers internal clock used by systems when synchronizing
        // and will also remove any expired ParticleInstance objects created in the manager.
        manager.update(deltaTime);

        // Create new ParticleInstances in manager.
        lastGen += deltaTime;
        var limit = 0;
        while (lastGen > 1 / generationSpeed && limit < 100)
        {
            limit += 1;
            lastGen -= 1 / generationSpeed;

            var instance, x, z, s, timeout;
            timeout = 2 + 2 * Math.random();
            instance = manager.createInstance(archetype1, timeout);
            x = Math.random() * (sceneWidth - radius * 2) + radius;
            z = Math.random() * (sceneHeight - radius * 2) + radius;
            s = 1 + Math.random() * 2;
            instance.renderable.setLocalTransform(mathDevice.m43Build(
                s, 0, 0,
                0, s, 0,
                0, 0, s,
                x, 0, z));
            manager.addInstanceToScene(instance, particleNode);

            timeout = 2 + 2 * Math.random();
            instance = manager.createInstance(archetype2, timeout);
            x = Math.random() * (sceneWidth - radius * 2) + radius;
            z = Math.random() * (sceneHeight - radius * 2) + radius;
            s = 1 + Math.random() * 2;
            instance.renderable.setLocalTransform(mathDevice.m43Build(
                s, 0, 0,
                0, s, 0,
                0, 0, s,
                x, 0, z));
            manager.addInstanceToScene(instance, particleNode);
        }
        lastGen %= (1 / generationSpeed);

        // Shuffle node containing all particle systems around
        if (moveSystems)
        {
            movementTime += deltaTime;
            var time = movementTime / 5;
            var rad = radius * Math.sin(time);
            var transform =
                mathDevice.m43BuildTranslation(
                    Math.sin(time) * rad,
                    0,
                    Math.cos(time) * rad);
            particleNode.setLocalTransform(transform);
        }

        // Update scene
        scene.update();

        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        // Update renderer, this will as a side-effect of particle instances becoming visible to the camera
        //   cause particle systems if required to be lazily created along with any views onto a particle system
        //   the low-level particle system will deal with this itself the way it is used by the particle manager.
        renderer.update(graphicsDevice, camera, scene, currentTime);

        // Render scene including all particle systems.
        renderer.draw(graphicsDevice, clearColor, extraDrawCallback);

        // Gather metrics about object usages in the manager, and display on the screen.
        graphicsDevice.setTechnique(fontTechnique);
        mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1,
                           fontTechniqueParameters.clipSpace);
        graphicsDevice.setTechniqueParameters(fontTechniqueParameters);

        var metrics = manager.gatherMetrics();
        var text = "ParticleManager Metrics:\n";
        for (var f in metrics)
        {
            if (metrics.hasOwnProperty(f))
            {
                text += f + ": " + metrics[f] + "\n";
            }
        }

        var font = fontManager.get("fonts/hero.fnt");
        var fontScale = 0.5;
        var dimensions = font.calculateTextDimensions(text, fontScale, 0);
        font.drawTextRect(text, {
            rect : mathDevice.v4Build(0, 0, dimensions.width, dimensions.height),
            scale: fontScale
        });

        // Draw 2d mini-map displaying all particle instances, and whether they are:
        //    A) Actively being synchronized, updated and renderer.
        //    B) Have had particle systems/views and gpu texture space allocated, but are in-active.
        //    C) Are in-active, and have not had any systems/views or texture space allocated.
        if (canvas.width !== graphicsDevice.width)
        {
            canvas.width = graphicsDevice.width;
        }
        if (canvas.height !== graphicsDevice.height)
        {
            canvas.height = graphicsDevice.height;
        }

        var width  = sceneWidth  * scaleX;
        var height = sceneHeight * scaleY;
        var viewport = VMath.v4Build(
            canvas.width - width - 2,
            canvas.height - 2,
            width,
            height
        );
        viewport = null;
        ctx.beginFrame(null, viewport);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(canvas.width - sceneWidth * scaleX - 2, 2);

        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(0, 0, sceneWidth * scaleX, sceneHeight * scaleY);

        var instanceMetrics = manager.gatherInstanceMetrics();
        var count = instanceMetrics.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var metric = instanceMetrics[i];
            var extents = metric.instance.renderable.getWorldExtents();
            x = (extents[0] + extents[3]) / 2 * scaleX;
            z = (extents[2] + extents[5]) / 2 * scaleY;
            ctx.strokeStyle = metric.active    ? "#00ff00" :
                              metric.allocated ? "#ffff00" :
                                                 "#ff0000";
            ctx.strokeRect(x - 0.5, z - 0.5, 1, 1);
        }

        // Display camera (xz) position on minimap also.
        var pos = mathDevice.m43Pos(mathDevice.m43Inverse(camera.viewMatrix));
        if (pos[0] >= 0 && pos[2] >= 0 && pos[0] <= sceneWidth && pos[2] <= sceneHeight)
        {
            ctx.strokeStyle = "#ffffff";
            ctx.strokeRect(pos[0] * scaleX - 1.5, pos[2] * scaleY - 1.5, 3, 3);
        }

        ctx.endFrame();
        graphicsDevice.endFrame();
    }

    //==========================================================================
    // Asset and Mapping table loading
    //=========================================================================

    var intervalID;
    function loadingLoop()
    {
        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(clearColor);
            graphicsDevice.endFrame();
        }

        if (textureManager.getNumPendingTextures() === 0 && shaderManager.getNumPendingShaders() === 0)
        {
            TurbulenzEngine.clearInterval(intervalID);
            init();
            intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
        }
    }
    function loadAssets()
    {
        // Load assets required to render renderable extents.
        shaderManager.load("shaders/debug.cgfx");

        // Load assets required to render the fonts on screen.
        shaderManager.load("shaders/font.cgfx");
        fontManager.load('fonts/hero.fnt');

        // Load all assets required to create and work with the particle system archetypes we're using.
        manager.loadArchetype(archetype1);
        manager.loadArchetype(archetype2);

        intervalID = TurbulenzEngine.setInterval(loadingLoop, 10);
    }
    function mappingTableReceived(table)
    {
        textureManager.setPathRemapping(table.urlMapping, table.assetPrefix);
        shaderManager .setPathRemapping(table.urlMapping, table.assetPrefix);
        fontManager   .setPathRemapping(table.urlMapping, table.assetPrefix);

        loadAssets();
    }
    function sessionCreated(gameSession)
    {
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            mappingTableReceived
        );
    }
    var gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);


    //==========================================================================
    // Sample tear-down
    //=========================================================================

    TurbulenzEngine.onunload = function unloadFn()
    {
        TurbulenzEngine.clearInterval(intervalID);

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }
        if (shaderManager)
        {
            shaderManager.destroy();
            shaderManager = null;
        }
        if (textureManager)
        {
            textureManager.destroy();
            textureManager = null;
        }
        if (fontManager)
        {
            fontManager.destroy();
            fontManager = null;
        }
        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }
        if (manager)
        {
            manager.destroy();
            manager = null;
        }

        effectManager = null;
        requestHandler = null;
        cameraController = null;
        camera = null;
        floor = null;

        TurbulenzEngine.flush();

        inputDevice = null;
        graphicsDevice = null;
        mathDevice = null;
    };

    //=========================================================================
    // HTML Controls
    //=========================================================================
    var htmlControls = HTMLControls.create();

    htmlControls.addSliderControl({
        id: "speedSlider",
        value: (simulationSpeed),
        max: 6,
        min: -10,
        step: 1,
        fn: function ()
        {
            simulationSpeed = this.value;
            htmlControls.updateSlider("speedSlider", simulationSpeed);
        }
    });

    htmlControls.addSliderControl({
        id: "instanceSlider",
        value: (generationSpeed),
        max: 200,
        min: 20,
        step: 20,
        fn: function ()
        {
            generationSpeed = this.value;
            htmlControls.updateSlider("instanceSlider", generationSpeed);
        }
    });

    var scaleOffset = 0;
    function refreshArchetype(description, archetype, scale)
    {
        var emitters = description.emitters;
        var count = emitters.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var emitter = emitters[i];
            emitter.emittance.burstMin *= scale;
            emitter.emittance.burstMax *= scale;
        }
        // build new archetype from modified description.
        // replacing all instances of old with new.
        // and destroying the old.
        var newArchetype = manager.parseArchetype(description);
        manager.replaceArchetype(archetype, newArchetype);
        manager.destroyArchetype(archetype);
        return newArchetype;
    }
    htmlControls.addButtonControl({
        id: "button-decrease-particles",
        value: "-",
        fn: function ()
        {
            if (scaleOffset > -5)
            {
                scaleOffset -= 1;
                archetype1 = refreshArchetype(description1, archetype1, 1 / 1.5);
                archetype2 = refreshArchetype(description2, archetype2, 1 / 1.5);
            }
        }
    });
    htmlControls.addButtonControl({
        id: "button-increase-particles",
        value: "+",
        fn: function ()
        {
            if (scaleOffset < 4)
            {
                scaleOffset += 1;
                archetype1 = refreshArchetype(description1, archetype1, 1.5);
                archetype2 = refreshArchetype(description2, archetype2, 1.5);
            }
        }
    });

    htmlControls.addCheckboxControl({
        id : "move-systems",
        value : "moveSystems",
        isSelected : moveSystems,
        fn: function ()
        {
            moveSystems = !moveSystems;
            return moveSystems;
        }
    });

    htmlControls.addCheckboxControl({
        id : "draw-extents",
        value : "drawRenderableExtents",
        isSelected : drawRenderableExtents,
        fn: function ()
        {
            drawRenderableExtents = !drawRenderableExtents;
            return drawRenderableExtents;
        }
    });

    htmlControls.addButtonControl({
        id: "button-clear",
        value: "Clear",
        fn: function () {
            // remove all instances of both archetypes, retaining other state like object
            // pools and allocated memory on gpu.
            manager.clear(archetype1);
            manager.clear(archetype2);
        }
    });

    htmlControls.addButtonControl({
        id: "button-destroy-1",
        value: "Destroy (1)",
        fn: function () {
            // destroy all state and instances associated with archetype1 (complete reset)
            manager.destroyArchetype(archetype1);
        }
    });
    htmlControls.addButtonControl({
        id: "button-destroy-2",
        value: "Destroy (2)",
        fn: function () {
            // destroy all state and instances associated with archetype2 (complete reset)
            manager.destroyArchetype(archetype2);
        }
    });

    htmlControls.addButtonControl({
        id: "button-replace-1-2",
        value: "Replace (1 with 2)",
        fn: function () {
            // replace all instances of archetype1 with ones of archetype2 in-place.
            manager.replaceArchetype(archetype1, archetype2);
        }
    });
    htmlControls.addButtonControl({
        id: "button-replace-2-1",
        value: "Replace (2 with 1)",
        fn: function () {
            // replace all instances of archetype2 with ones of archetype1 in-place.
            manager.replaceArchetype(archetype2, archetype1);
        }
    });

    htmlControls.register();
}
