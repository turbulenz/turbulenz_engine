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
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global ForwardRendering: false */
/*global TurbulenzServices: false */
/*global Camera: false */
/*global CameraController: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneNode: false */
/*global Floor: false */
/*global HTMLControls: false */
/*global ParticleBuilder: false */
/*global ParticleSystem: false */
/*global ParticleView: false */
/*global RequestHandler: false*/
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

    var camera = Camera.create(mathDevice);
    var halfFOV = Math.tan(30 * Math.PI / 180);
    camera.recipViewWindowX = 1 / halfFOV;
    camera.recipViewWindowY = 1 / halfFOV;
    camera.lookAt([0, 1, 0], [0, 1, 0], [0, 1, -1]);
    camera.updateProjectionMatrix();
    camera.updateViewMatrix();
    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);
    var maxSpeed = 10;

    var renderer;
    var clearColor = [0.4, 0.4, 0.4, 1.0];
    var scene = Scene.create(mathDevice);
    var floor = Floor.create(graphicsDevice, mathDevice);
    floor.fadeToColor = clearColor;
    function drawFloor()
    {
        floor.render(graphicsDevice, camera);
    }

    //==========================================================================
    // Particle Systems
    //==========================================================================

    var alphaRenderer;
    var additiveRenderer;
    var updater;

    //==========================================================================
    // Main loop
    //=========================================================================

    var previousFrameTime;
    function init()
    {
        previousFrameTime = TurbulenzEngine.time;

        renderer = ForwardRendering.create(
            graphicsDevice,
            mathDevice,
            shaderManager,
            effectManager,
            {}
        );

        // Create particle renderers and updaters
        // and set some defaults before creating any systems.
        alphaRenderer = ParticleSystem.createDefaultRenderer({
            graphicsDevice: graphicsDevice,
            shaderManager: shaderManager,
            blendMode: "alpha"
        });
        additiveRenderer = ParticleSystem.createDefaultRenderer({
            graphicsDevice: graphicsDevice,
            shaderManager: shaderManager,
            blendMode: "additive"
        });
        alphaRenderer.parameters.noiseTexture = textureManager.get("textures/noise.dds");
        additiveRenderer.parameters.noiseTexture = textureManager.get("textures/noise.dds");

        updater = ParticleSystem.createDefaultUpdater({
            graphicsDevice: graphicsDevice,
            shaderManager: shaderManager
        });
        updater.parameters.acceleration = [0, -9.8, 0];
        updater.parameters.drag = 2.5;
        updater.parameters.noiseTexture = textureManager.get("textures/noise.dds");

        // TODO TEMPORARY, SAMPLE SHOULD USE PARTICLE MANAGER WITH ARCHETYPES
        // RATHER THAN MANUAL CONSTRUCTION OF SYSTEMS AND ANIMATIONS.
        var smokeAnimation = {
            name: "smoke",
            animation: [
                {
                    "scale": [1, 1],
                    "color": [1, 1, 1, 0],
                    "color-interpolation": "catmull",
                    "scale-interpolation": "catmull"
                },
                {
                    "time": 0.5,
                    "scale": [1, 1],
                    "color": [1, 1, 1, 1]
                },
                {
                    "time": 0.5,
                    "scale": [1.2, 1.2],
                    "color": [1, 1, 1, 0]
                }
            ]
        };
        var defn = ParticleBuilder.compile({
            graphicsDevice: graphicsDevice,
            particles: [smokeAnimation]
        });
        var system = ParticleSystem.create({
            graphicsDevice: graphicsDevice,
            center: [0, 0, 0],
            halfExtents: [2, 2, 2],
            maxSpeed: 20,
            maxParticles: 100,
            maxLifeTime: defn.maxLifeTime,
            animation: defn.animation,
            renderer: alphaRenderer,
            updater: updater,
            synchronize: function (system, _, deltaTime)
            {
                system.beginUpdate(deltaTime);
                system.createParticle({
                    position: [0, 0, 0],
                    velocity: [0, 8, 0],
                    lifeTime: defn.particle["smoke"].lifeTime,
                    animationRange: defn.particle["smoke"].animationRange
                });
                system.endUpdate();
            }
        });
        var scale = defn.attribute["scale"];
        var rotation = defn.attribute["rotation"];
        system.renderParameters["animationScale"] = [
            scale.min[0], scale.min[1], scale.delta[0], scale.delta[1]
        ];
        system.renderParameters["animationRotation"] = [
            rotation.min[0], rotation.delta[0]
        ];
        system.renderParameters["texture"] = textureManager.get("textures/smoke.dds");
        var renderable = ParticleRenderable.create({
            graphicsDevice: graphicsDevice,
            passIndex: renderer.passIndex.transparent,
            system: system
        });
        var node = SceneNode.create({
            name: "TODO_TMP",
            dynamic: true
        });
        node.addRenderable(renderable);
        scene.addRootNode(node);
    }

    function mainLoop()
    {
        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        cameraController.maxSpeed = (deltaTime * maxSpeed);

        inputDevice.update();
        cameraController.update();

        // Update the aspect ratio of the camera in case of window resizes
        var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        // Update scene
        scene.update();
        renderer.update(graphicsDevice, camera, scene, currentTime);

        // Render scene
        renderer.draw(graphicsDevice, clearColor, undefined, drawFloor);

        (<any>scene).drawVisibleRenderablesExtents(graphicsDevice, shaderManager, camera, false, true);

        graphicsDevice.endFrame();
        previousFrameTime = currentTime;
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
        shaderManager.load("shaders/particles-default-render.cgfx");
        shaderManager.load("shaders/particles-default-update.cgfx");
        shaderManager.load("shaders/debug.cgfx");

        textureManager.load("textures/noise.dds");
        textureManager.load("textures/smoke.dds");

        intervalID = TurbulenzEngine.setInterval(loadingLoop, 10);
    }
    function mappingTableReceived(table)
    {
        textureManager.setPathRemapping(table.urlMapping, table.assetPrefix);
        shaderManager.setPathRemapping(table.urlMapping, table.assetPrefix);
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
