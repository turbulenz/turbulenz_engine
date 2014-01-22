/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Particles
 * @description:
 * This sample demonstrates how to animate a simple particle system from a moving emitter using the CPU.
 * You can select different kinds of particles to render and you can also enable the rendering of the
 * dynamically calculated bounding box of the particle system.
*/

/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/light.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/scenedebugging.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/defaultrendering.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*{{ javascript("scripts/sceneloader.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/
/*{{ javascript("scripts/emitter.js") }}*/
/*{{ javascript("scripts/motion.js") }}*/

/*global RequestHandler: false */
/*global TurbulenzEngine: true */
/*global DefaultRendering: false */
/*global TurbulenzServices: false */
/*global Camera: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global Motion: false */
/*global Effect: false */
/*global Emitter: false */
/*global HTMLControls: false */
/*global window: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

    var graphicsDeviceParameters = {};
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    if (!graphicsDevice.shadingLanguageVersion)
    {
        errorCallback("No shading language support detected.\nPlease check your graphics drivers are up to date.");
        graphicsDevice = null;
        return;
    }

    // Clear the background color of the engine window
    var clearColor = [0.5, 0.5, 0.5, 1.0];
    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(clearColor);
        graphicsDevice.endFrame();
    }

    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var random = Math.random;
    var renderer;

    // Setup camera & controller
    var camera = Camera.create(mathDevice);
    var worldUp = mathDevice.v3BuildYAxis();
    camera.lookAt(mathDevice.v3Build(0.0, 2.0, 0.0), worldUp, mathDevice.v3Build(7.0, 3.0, 0.0));
    camera.updateViewMatrix();
    camera.nearPlane = 0.05;

    // The node on which the particle system is attached
    var particleNode = null;
    // The positions for the node to move between
    var positions = [
        [0, 0, -3],
        [0, 0, 3]
    ];
    var lastPositionIndex = 0;

    // Emitter object, created when loading is complete
    var emitter = null;

    // Emitter movement
    var emitterMotion = Motion.create(mathDevice, "EmitterMotion");
    var movementRate = 3.0;
    emitterMotion.setRailMovement(positions[lastPositionIndex], movementRate);

    // The material list
    var materials = {
        particle1 : {
            effect : "add_particle_world",
            meta : {
                transparent : true
            },
            parameters : {
                diffuse : "textures/default_light.png"
            }
        },
        particle2 : {
            effect : "add_particle_world",
            meta : {
                transparent : true
            },
            parameters : {
                diffuse : "textures/particle_star.png"
            }
        },
        particle3 : {
            effect : "add_particle_world",
            meta : {
                transparent : true
            },
            parameters : {
                diffuse : "textures/particle_spark.png"
            }
        }
    };

    // The color list
    var colors = {
        particle1 : [ mathDevice.v4Build(1.0, 1.0, 1.0, 1.0)],
        particle2 : [ mathDevice.v4Build(1.0, 1.0, 1.0, 1.0)],
        particle3 : [ mathDevice.v4Build(0.898, 0.807, 0.474, 1.0),
                      mathDevice.v4Build(0.878, 0.874, 0.345, 1.0),
                      mathDevice.v4Build(0.933, 0.811, 0.223, 1.0),
                      mathDevice.v4Build(0.772, 0.494, 0.294, 1.0),
                      mathDevice.v4Build(0.913, 0.909, 0.866, 1.0) ]
    };

    // Generate random colors
    var randomColorCount = 14;
    var colorList = colors.particle1;
    for (var i = 0; i < randomColorCount; i += 1)
    {
        colorList[colorList.length] = mathDevice.v4Build(random(), random(), random(), 1.0);
    }

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();

    var drawBoundingBox = false;

    function drawDebugFn()
    {
        if (drawBoundingBox)
        {
            scene.drawTransparentNodesExtents(graphicsDevice, shaderManager, camera);
        }
    }

    // Controls
    var htmlControls = HTMLControls.create();

    htmlControls.addRadioControl({
        id : "radio01",
        groupName : "particleType",
        radioIndex : 0,
        value : "coloured",
        fn : function ()
            {
                if (scene && emitter)
                {
                    emitter.setParticleColors(colors.particle1);
                    var material = scene.getMaterial("particle1");
                    if (material)
                    {
                        // Set the material to use for the particle
                        emitter.setMaterial(material);
                    }
                }
            },
        isDefault : true
    });

    htmlControls.addRadioControl({
        id : "radio02",
        groupName : "particleType",
        radioIndex : 1,
        value : "constant",
        fn : function ()
            {
                if (scene && emitter)
                {
                    emitter.setParticleColors(colors.particle2);
                    var material = scene.getMaterial("particle2");
                    if (material)
                    {
                        // Set the material to use for the particle
                        emitter.setMaterial(material);
                    }
                }
            },
        isDefault : false
    });

    htmlControls.addRadioControl({
        id : "radio03",
        groupName : "particleType",
        radioIndex : 2,
        value : "sparks",
        fn : function ()
            {
                if (scene && emitter)
                {
                    emitter.setParticleColors(colors.particle3);
                    var material = scene.getMaterial("particle3");
                    if (material)
                    {
                        // Set the material to use for the particle
                        emitter.setMaterial(material);
                    }
                }
            },
        isDefault : false
    });

    htmlControls.addCheckboxControl({
        id: "checkbox01",
        value: "drawBoundingBox",
        isSelected: drawBoundingBox,
        fn: function ()
        {
            drawBoundingBox = !drawBoundingBox;
            return drawBoundingBox;
        }
    });

    htmlControls.register();

    // Initialize the previous frame time
    var previousFrameTime;
    var intervalID;

    var lastFPS = '';
    var numActiveParticles = 0;

    var numActiveParticlesElement = document.getElementById("numActiveParticles");
    var fpsElement = document.getElementById("fpscounter");
    var lastNumActiveParticles;

    //
    // Update
    //
    var update = function updateFn()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }

        var gdWidth = graphicsDevice.width;
        var gdHeight = graphicsDevice.height;

        var aspectRatio = (gdWidth / gdHeight);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        emitterMotion.update(deltaTime);

        if (emitterMotion.atTarget)
        {
            lastPositionIndex += 1;
            lastPositionIndex %= positions.length;
            emitterMotion.setRailMovement(positions[lastPositionIndex], movementRate);
        }

        if (particleNode)
        {
            particleNode.setLocalTransform(emitterMotion.matrix);
        }

        if (fpsElement)
        {
            var fps = (graphicsDevice.fps).toFixed(2);
            if (lastFPS !== fps)
            {
                lastFPS = fps;

                // Execute any code that interacts with the DOM in a separate callback
                TurbulenzEngine.setTimeout(function () {
                    fpsElement.innerHTML = fps + ' fps';
                }, 1);
            }
        }

        scene.update();

        if (emitter)
        {
            emitter.update(currentTime, deltaTime, camera);

            numActiveParticles = emitter.getNumActiveParticles();
            if (numActiveParticlesElement && (numActiveParticles !== lastNumActiveParticles))
            {
                numActiveParticlesElement.innerHTML =
                    numActiveParticles.toString();
                lastNumActiveParticles = numActiveParticles;
            }
        }

        renderer.update(graphicsDevice, camera, scene, currentTime);

        if (graphicsDevice.beginFrame())
        {
            // Render the scene with the renderer of choice
            if (renderer.updateBuffers(graphicsDevice, gdWidth, gdHeight))
            {
                renderer.draw(graphicsDevice,
                              clearColor,
                              null,
                              null,
                              drawDebugFn);
            }
            graphicsDevice.endFrame();
        }

        previousFrameTime = currentTime;
    };

    // Callback for when the scene is loaded to prepare particles
    function loadSceneFinished(scene)
    {
        particleNode = scene.findNode("cube");
        if (particleNode)
        {
            particleNode.setDynamic(true);

            for (var m in materials)
            {
                if (materials.hasOwnProperty(m))
                {
                    if (scene.loadMaterial(graphicsDevice,
                                           textureManager,
                                           effectManager,
                                           m,
                                           materials[m]))
                    {
                        materials[m].loaded = true;
                    }
                    else
                    {
                        errorCallback("Failed to load material: " + m);
                    }
                }
            }
        }
    }

    // Create a loop to run on an interval whilst loading
    var loadingLoop = function loadingLoopFn()
    {
        // Wait for all assets to download
        if (sceneLoader.complete())
        {
            // Register the update() loop as the new interval and make it call the function at 60Hz
            TurbulenzEngine.clearInterval(intervalID);

            var material = scene.getMaterial("particle1");
            if (material)
            {
                var particleSystemParameters = {
                        minSpawnTime : 0.005,
                        maxSpawnTime : 0.01,
                        minLifetime : 1,
                        maxLifetime : 2,
                        gravity : 9.81,
                        size : 0.1,
                        growRate : -0.02
                    };
                emitter = Emitter.create(graphicsDevice, mathDevice, material, particleNode, particleSystemParameters);
                emitter.setParticleColors(colors.particle1);
            }

            for (var m in materials)
            {
                if (materials.hasOwnProperty(m))
                {
                    material = scene.getMaterial(m);
                    if (material)
                    {
                        // Add additional references to materials, to avoid them being removed when not in use
                        material.reference.add();
                    }
                }
            }

            // Loading has completed, update the shader system
            renderer.updateShader(shaderManager);

            sceneLoader = null;

            previousFrameTime = TurbulenzEngine.time;

            intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

    function updateEffectFn(camera)
    {
        // Custom update effect to project particles in world space
        var techniqueParameters = this.techniqueParameters;
        techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;

        // As we update the geometry we need to propagate the changes to the drawParameters.
        this.drawParameters[0].firstIndex = this.surface.first;
        this.drawParameters[0].count = this.surface.numIndices;
    }

    function loadTechniques(shaderManager)
    {
        var that = this;

        var callback = function shaderLoadedCallbackFn(shader)
        {
            that.shader = shader;
            that.technique = shader.getTechnique(that.techniqueName);
            that.techniqueIndex = that.technique.id;
        };
        shaderManager.load(this.shaderName, callback);
    }

    var loadAssets = function loadAssetsFn()
    {
        // Renderer for the scene (requires shader assets).
        renderer = DefaultRendering.create(graphicsDevice,
                                           mathDevice,
                                           shaderManager,
                                           effectManager);
        renderer.setGlobalLightPosition(mathDevice.v3Build(100, 100, 100));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));
        renderer.setDefaultTexture(textureManager.get("default"));

        //
        // add_particle_world
        //
        var effect = Effect.create("add_particle_world");
        effectManager.add(effect);

        var effectTypeData = {  prepare : DefaultRendering.defaultPrepareFn,
                                shaderName : "shaders/defaultrendering.cgfx",
                                techniqueName : "add_particle",
                                update : updateEffectFn,
                                loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add("rigid", effectTypeData);

        //Start the loading
        sceneLoader.load({  scene : scene,
                            append : false,
                            assetPath : "models/cube.dae",
                            keepLights : false,
                            graphicsDevice : graphicsDevice,
                            mathDevice : mathDevice,
                            textureManager : textureManager,
                            shaderManager : shaderManager,
                            effectManager : effectManager,
                            requestHandler: requestHandler,
                            postSceneLoadFn : loadSceneFinished
                        });
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
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
    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    TurbulenzEngine.onunload = function destroyScene()
    {
        TurbulenzEngine.clearInterval(intervalID);

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        var material = null;
        for (var m in materials)
        {
            if (materials.hasOwnProperty(m))
            {
                material = scene.getMaterial(m);
                if (material)
                {
                    // Remove additional references to materials, we no longer need them
                    material.reference.remove();
                }
            }
        }

        if (emitter)
        {
            emitter.destroy();
            emitter = null;
        }

        if (scene)
        {
            scene.destroy();
            scene = null;
        }

        requestHandler = null;

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        htmlControls = null;
        numActiveParticlesElement = null;
        fpsElement = null;

        particleNode = null;

        camera = null;

        colors = null;
        materials = null;
        clearColor = null;

        if (textureManager)
        {
            textureManager.destroy();
            textureManager = null;
        }

        if (shaderManager)
        {
            shaderManager.destroy();
            shaderManager = null;
        }

        effectManager = null;

        TurbulenzEngine.flush();
        graphicsDevice = null;
        mathDevice = null;
    };
};
