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
    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================

    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    if (graphicsDevice.maxSupported("VERTEX_TEXTURE_UNITS") === 0)
    {
        errorCallback("Device does not support sampling of textures from vertex shaders required by GPU particle system");
        return;
    }

    var mathDevice = TurbulenzEngine.createMathDevice({});
    var inputDevice = TurbulenzEngine.createInputDevice({});

    var requestHandler = RequestHandler.create({});
    var textureManager = TextureManager.create(graphicsDevice, requestHandler, undefined, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, undefined, errorCallback);
    var effectManager = EffectManager.create();
    var fontManager = FontManager.create(graphicsDevice, requestHandler);

    // region of world (x/z) where systems are created.
    var sceneWidth = 500;
    var sceneHeight = 500;

    var camera = Camera.create(mathDevice);
    var halfFOV = Math.tan(30 * Math.PI / 180);
    camera.recipViewWindowX = 1 / halfFOV;
    camera.recipViewWindowY = 1 / halfFOV;
    camera.lookAt([0, 1, 0], [0, 1, 0], [sceneWidth/2, 1, sceneHeight/2]);
    camera.updateProjectionMatrix();
    camera.updateViewMatrix();
    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);
    var maxSpeed = 200;

    var renderer;
    var clearColor = [0.4, 0.4, 0.4, 1.0];
    var scene = Scene.create(mathDevice);
    var floor = Floor.create(graphicsDevice, mathDevice);
    floor.fadeToColor = clearColor;
    function drawFloor()
    {
        floor.render(graphicsDevice, camera);
    }

    // Create canvas object for minimap.
    var canvas = Canvas.create(graphicsDevice);
    var ctx = canvas.getContext('2d');

    var scaleX = 100 / sceneWidth;
    var scaleY = 100 / sceneHeight;
    ctx.lineWidth = 0.1;

    //==========================================================================
    // Particle Systems
    //==========================================================================

    var alphaRenderer;
    var additiveRenderer;
    var updater;
    var node1;
    var node2;

    var manager = ParticleManager.create(graphicsDevice, textureManager, shaderManager);
    manager.registerParticleAnimation({
        name: "black and white",
        animation: [{
            scale: [0, 0],
            "scale-interpolation": "catmull",
            color: [0, 0, 0, 1]
        },
        {
            time: 0.2,
            scale: [1, 1],
            color: [1, 1, 1, 1]
        },
        {
            time: 0.6,
        },
        {
            time: 0.2,
            scale: [1.5, 1.5],
            color: [1, 1, 1, 0]
        }]
    });
    var archetype1 = manager.parseArchetype({
        renderer: {
            name: "alpha"
        },
        system: {
            center: [0, 6, 0],
            halfExtents: [3, 6, 3],
            maxParticles: 128
        },
        particles: {
            smoke: {
                animation: "black and white",
                texture: "textures/smoke.dds"
            },
            fire: {
                animation: "black and white",
                texture: "textures/noise.dds"
            }
        },
        emitters: [{
            particleName: "smoke",
            emittance: {
                burstMin: 0,
                burstMax: 2,
                rate: 20
            },
            velocity: {
                speedMin: 2.5,
                speedMax: 4.5,
                conicalSpread: Math.PI*0.25
            }
        }, {
            particleName: "fire",
            emittance: {
                burstMin: 0,
                burstMax: 2,
                rate: 30
            },
            velocity: {
                speedMin: 3.75,
                speedMax: 4.8,
                conicalSpread: Math.PI*0.25
            }
        }]
    });
    var archetype2 = manager.parseArchetype({
        packedTexture: "textures/smoke.dds",
        system: {
            center: [0, 3, 0],
            halfExtents: [4, 3, 4],
        },
        renderer: {
            name: "additive",
            randomizedAlpha: 0.5,
            animatedAlpha: true,
            randomizedOrientation: [Math.PI*0.25, Math.PI*0.25],
            animatedOrientation: true,
            randomizedRotation: Math.PI*2
        },
        updater: {
            noiseTexture: "textures/noise.dds",
            randomizedAcceleration: [10, 0, 10],
            drag: 1
        },
        particles: {
            smoke: {
                animation: "black and white",
                tweaks: {
                    "scale-scale": [0.5, 0.5]
                }
            }
        },
        emitters: [{
            particleName: "smoke",
            emittance: {
                rate: 40
            },
            particle: {
                userData: DefaultParticleUpdater.createUserData(true) |
                          DefaultParticleRenderer.createUserData({
                              facing               : "velocity",
                              randomizedAlpha      : true,
                              randomizedOrientation: true,
                              randomizedRotation   : true
                          })
            },
            velocity: {
                speedMin: 3,
                speedMax: 6,
                conicalSpread: Math.PI/10
            },
            position: {
                spherical: false,
                normal: [0, 1, 0],
                radiusMin: 2,
                radiusMax: 3,
                radiusDistribution: "normal"
            }
        }]
    });

    //==========================================================================
    // Main loop
    //=========================================================================

    var fontTechnique;
    var fontTechniqueParameters;
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

        manager.initialize(scene, renderer.passIndex.transparent);

        function run()
        {
            if (Math.random() < 0.25 || !graphicsDevice.beginFrame())
            {
                return;
            }
            var instance1 = manager.createInstance(archetype1, 1.5 + 2 * Math.random());
            var instance2 = manager.createInstance(archetype2, 1.5 + 2 * Math.random());
            var x = Math.random() * sceneWidth;
            var z = Math.random() * sceneHeight;
            instance1.renderable.setLocalTransform(VMath.m43BuildTranslation(x, 0, z));
            var x = Math.random() * sceneWidth;
            var z = Math.random() * sceneHeight;
            instance2.renderable.setLocalTransform(VMath.m43BuildTranslation(x, 0, z));
            manager.addInstanceToScene(instance1);
            manager.addInstanceToScene(instance2);
            graphicsDevice.endFrame();
        }
        TurbulenzEngine.setInterval(run, 10);
        run();
        previousFrameTime = TurbulenzEngine.time;
    }

    function mainLoop()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        cameraController.maxSpeed = (deltaTime * maxSpeed);
        previousFrameTime = currentTime;

        manager.update(deltaTime);
        inputDevice.update();
        cameraController.update();

        if (Math.random() < 0.001)
        {
            manager.clear();
        }

        // Update the aspect ratio of the camera in case of window resizes
        var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        // Update scene
        scene.update();
        renderer.update(graphicsDevice, camera, scene, currentTime);

        // Render scene
        //renderer.draw(graphicsDevice, clearColor, undefined, drawFloor);
        renderer.draw(graphicsDevice, clearColor);

        //(<any>scene).drawVisibleRenderablesExtents(graphicsDevice, shaderManager, camera, false, true);
        // Draw fonts.
        graphicsDevice.setTechnique(fontTechnique);
        mathDevice.v4Build(2 / graphicsDevice.width, -2 / graphicsDevice.height, -1, 1,
                           fontTechniqueParameters.clipSpace);
        graphicsDevice.setTechniqueParameters(fontTechniqueParameters);

        var metrics = manager.gatherMetrics();
        var text = "";
        for (var f in metrics)
        {
            text += f + ": " + metrics[f] + "\n";
        }

        var font = fontManager.get("fonts/hero.fnt");
        var width = font.calculateTextDimensions(text, 0.5, 0).width;
        font.drawTextRect(text, {
            rect: [0, 0, width, 0/*ignored*/],
            scale: 0.5
        });

        // Draw 2d mini-map
        if (canvas.width !== graphicsDevice.width)
        {
            canvas.width = graphicsDevice.width;
        }
        if (canvas.height !== graphicsDevice.height)
        {
            canvas.height = graphicsDevice.height;
        }
        ctx.beginFrame();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(canvas.width - sceneWidth * scaleX - 2, 2);

        ctx.strokeStyle = "#000000";
        ctx.strokeRect(0, 0, sceneWidth * scaleX, sceneHeight * scaleY);

        var instanceMetrics = manager.gatherInstanceMetrics();
        var count = instanceMetrics.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var metric = instanceMetrics[i];
            var extents = metric.instance.renderable.getWorldExtents();
            var x = (extents[0] + extents[3]) / 2 * scaleX;
            var z = (extents[2] + extents[5]) / 2 * scaleY;
            ctx.strokeStyle = metric.active    ? "#00ff00" :
                              metric.allocated ? "#ffff00" :
                                                 "#ff0000";
            ctx.strokeRect(x - 0.5, z - 0.5, 1, 1);
        }

        var pos = mathDevice.m43Pos(mathDevice.m43Inverse(camera.viewMatrix));
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(pos[0] * scaleX - 0.5, pos[2] * scaleY - 0.5, 1, 1);
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
        shaderManager.load("shaders/debug.cgfx");
        shaderManager.load("shaders/font.cgfx");
        fontManager.load('fonts/hero.fnt');

        manager.preloadArchetype(archetype1);
        manager.preloadArchetype(archetype2);

        intervalID = TurbulenzEngine.setInterval(loadingLoop, 10);
    }
    function mappingTableReceived(table)
    {
        textureManager.setPathRemapping(table.urlMapping, table.assetPrefix);
        shaderManager.setPathRemapping(table.urlMapping, table.assetPrefix);
        fontManager.setPathRemapping(table.urlMapping, table.assetPrefix);
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
        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        effectManager = null;
        requestHandler = null;
        cameraController = null;
        camera = null;

        TurbulenzEngine.flush();

        inputDevice = null;
        graphicsDevice = null;
        mathDevice = null;
    };

    //=========================================================================
    // HTML Controls
    //=========================================================================
    var htmlControls = HTMLControls.create();
    htmlControls.register();
}
