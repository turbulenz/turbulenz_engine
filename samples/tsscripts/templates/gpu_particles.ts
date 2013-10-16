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
    var sceneWidth  = 500;
    var sceneHeight = 500;

    var camera = Camera.create(mathDevice);
    var halfFOV = Math.tan(30 * Math.PI / 180);
    camera.recipViewWindowX = 1 / halfFOV;
    camera.recipViewWindowY = 1 / halfFOV;
    camera.lookAt(mathDevice.v3Build(0, 0, 0),
                  mathDevice.v3BuildYAxis(),
                  mathDevice.v3Build(sceneWidth / 2, 10, sceneHeight / 2));
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

    //==========================================================================
    // Particle Systems
    //==========================================================================

    var manager = ParticleManager.create(graphicsDevice, textureManager, shaderManager);

    manager.registerParticleAnimation({
        name: "black and white",
        animation: [{
            scale: [0, 0],
            "scale-interpolation": "catmull",
            color: [0, 0, 0, 0]
        },
        {
            // after 0.2 seconds
            time : 0.2,
            scale: [1, 1],
            color: [1, 1, 1, 1]
        },
        {
            // after another 0.8 seconds
            time : 0.8,
            scale: [1.5, 1.5],
            color: [1, 1, 1, 0]
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
            // define local system extents to be from (-3, 0, -3) to (3, 12, 3)
            center      : [0, 6, 0],
            halfExtents : [3, 6, 3]
        },
        particles: {
            // define two particles to use, both of these define their own texture.
            // the manager will pack these textures itself at runtime.
            smoke: {
                animation: "black and white",
                texture  : "textures/smoke.dds"
            },
            fire: {
                animation: "black and white",
                texture  : "textures/noise.dds"
            }
        },
        // define two emitters, one for each of our particles.
        emitters: [{
            particle: {
               name: "smoke",
            },
            emittance: {
                // we're going to emit particles 20 times per second.
                rate: 20,
                // each time we emit particles, we will emit between 0 and 2 particles.
                burstMin: 0,
                burstMax: 2
            },
            velocity: {
                // particls will be emitted with speeds between these values.
                speedMin: 2.5,
                speedMax: 4.5,
                // and with a conical spread about the default direction (along y-axis) of this angle.
                conicalSpread: Math.PI * 0.25
            }
        }, {
            particle: {
                name: "fire"
            },
            emittance: {
                rate: 30,
                burstMin: 0,
                burstMax: 2
            },
            velocity: {
                speedMin: 3.75,
                speedMax: 4.8,
                conicalSpread: Math.PI * 0.25
            }
        }]
    };

    var description2 = {
        system: {
            // define local system extents to be from (-5, 0, -5) to (5, 10, 5)
            center     : [0, 5, 0],
            halfExtents: [5, 5, 5]
        },
        renderer: {
            // we're going to use the default renderer with the "additive" blend mode.
            name: "additive",
            // for particles that enable these options, we're going to allow particle alphas
            //    to vary +/- 0.5, and this alpha variation will be fixed when particle is created.
            randomizedAlpha: 0.5,
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
                // After 1 second from the start of the effect, we're going to emit particles 40 times per second.
                delay: 1,
                rate: 40,
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
                              facing               : "velocity",
                              randomizedAlpha      : true,
                              randomizedOrientation: true,
                              randomizedRotation   : true
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
                // Letting spherical be false, means we're going to generate particles in a disc shape.
                //   The default normal is along y-axis, so the disc will be flat on the floor.
                spherical: false,
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
                // We will emit particles 10 times per second.
                rate: 10,
                // And whenever we emit particles, we'll emit between 0 and 4 particles.
                burstMin: 0,
                burstMax: 4
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

    function mainLoop()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        previousFrameTime = currentTime;

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

        // Update ParticleManager object with elapsed time.
        // This will add the deltaTime to the managers internal clock used by systems when synchronizing
        // and will also remove any expired ParticleInstance objects created in the manager.
        manager.update(deltaTime);

        // Create new ParticleInstances in manager.
        if (Math.random() > 0.25)
        {
            var instance, x, z, timeout;
            timeout = 2 + 2 * Math.random();
            instance = manager.createInstance(archetype1, timeout);
            x = Math.random() * sceneWidth;
            z = Math.random() * sceneHeight;
            instance.renderable.setLocalTransform(VMath.m43BuildTranslation(x, 0, z));
            manager.addInstanceToScene(instance);

            timeout = 2 + 2 * Math.random();
            instance = manager.createInstance(archetype2, timeout);
            x = Math.random() * sceneWidth;
            z = Math.random() * sceneHeight;
            instance.renderable.setLocalTransform(VMath.m43BuildTranslation(x, 0, z));
            manager.addInstanceToScene(instance);
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
        var text = "";
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
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(pos[0] * scaleX - 1.5, pos[2] * scaleY - 1.5, 3, 3);
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
            manager.clear(archetype1);
            manager.clear(archetype2);
        }
    });

    htmlControls.addButtonControl({
        id: "button-destroy-1",
        value: "Destroy (1)",
        fn: function () {
            manager.destroyArchetype(archetype1);
        }
    });
    htmlControls.addButtonControl({
        id: "button-destroy-2",
        value: "Destroy (2)",
        fn: function () {
            manager.destroyArchetype(archetype2);
        }
    });

    htmlControls.addButtonControl({
        id: "button-replace-1-2",
        value: "Replace (1 with 2)",
        fn: function () {
            manager.replaceArchetype(archetype1, archetype2);
        }
    });
    htmlControls.addButtonControl({
        id: "button-replace-2-1",
        value: "Replace (2 with 1)",
        fn: function () {
            manager.replaceArchetype(archetype2, archetype1);
        }
    });

    htmlControls.register();
}
