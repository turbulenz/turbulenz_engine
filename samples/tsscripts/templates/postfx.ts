/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Post effects
 * @description:
 * This sample shows how to use render targets to apply post processing effects to a dynamically rendered image.
 * You can select between simple copy, inverted colors or light bloom post effects.
*/

/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/light.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/vmath.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/defaultrendering.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*{{ javascript("scripts/sceneloader.js") }}*/
/*{{ javascript("scripts/motion.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global Motion: false */
/*global RequestHandler: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global Camera: false */
/*global HTMLControls: false */
/*global DefaultRendering: false */

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

    // Clear the background color of the engine window
    var clearColor = [0.5, 0.5, 0.5, 1.0];
    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(clearColor);
        graphicsDevice.endFrame();
    }

    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var requestHandlerParameters = { };
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();

    // Setup world space
    var worldUp = mathDevice.v3Build(0.0, 1.0, 0.0);

    // Setup a camera to view a close-up object
    var camera = Camera.create(mathDevice);
    var cameraDistanceFactor = 1.0;
    camera.nearPlane = 0.05;

    var defaultHeight = 1024;
    var defaultWidth = 1024;

    var postFX = {
        copy    : 0, // Copies the render target to the backbuffer
        invert  : 1, // Inverts each pixel color
        bloom   : 2  // A basic bloom, demonstrating the use of additional render targets
    };

    // The current effect to be processed
    var effectID = postFX.copy; // Default: copy

    // The effects available
    var effects : {
        luminance?: any;
        blurvert?: any;
        blurhorz?: any;
        composite?: any;
        copy?: any;
        invert?: any;
    } = {};

    // Renderer for the scene.
    var renderer;

    var shaderLoaded = function shaderLoadedFn(shaderText)
    {
        if (shaderText)
        {
            var shaderParameters = JSON.parse(shaderText);
            var shader = graphicsDevice.createShader(shaderParameters);
            if (shader)
            {
                var technique = shader.getTechnique("luminance");
                if (technique)
                {
                    effects.luminance = {
                            technique : technique,
                            techniqueParameters : graphicsDevice.createTechniqueParameters({
                                luminance: 0.51,
                                bgColor: mathDevice.v4BuildZero(),
                                inputTexture0: null
                            })
                        };
                }

                technique = shader.getTechnique("blurvert");
                if (technique)
                {
                    effects.blurvert = {
                            technique : technique,
                            techniqueParameters : graphicsDevice.createTechniqueParameters({
                                vertDim: defaultHeight / 2, // Is applied to the render target half the size
                                inputTexture0: null
                            })
                        };
                }

                technique = shader.getTechnique("blurhorz");
                if (technique)
                {
                    effects.blurhorz = {
                            technique : technique,
                            techniqueParameters : graphicsDevice.createTechniqueParameters({
                                horzDim: defaultWidth / 2, // Is applied to the render target half the size
                                inputTexture0: null
                            })
                        };
                }

                technique = shader.getTechnique("composite");
                if (technique)
                {
                    effects.composite = {
                            technique : technique,
                            techniqueParameters : graphicsDevice.createTechniqueParameters({
                                alpha: 0.8,
                                inputTexture0: null,
                                inputTexture1: null
                            })
                        };
                }

                technique = shader.getTechnique("copy");
                if (technique)
                {
                    effects.copy = {
                            technique : technique,
                            techniqueParameters : graphicsDevice.createTechniqueParameters({
                                inputTexture0: null
                            })
                        };
                }

                technique = shader.getTechnique("invert");
                if (technique)
                {
                    effects.invert = {
                            technique : technique,
                            techniqueParameters : graphicsDevice.createTechniqueParameters({
                                inputTexture0: null
                            })
                        };
                }
            }
        }
    };

    // Render Target
    var renderBuffer = null;
    var renderTarget = null;
    var renderTexture = null;

    var renderTextureParameters =
    {
        name       : "rendertexture",
        width      : defaultWidth,
        height     : defaultHeight,
        depth      : 1,
        format     : "R8G8B8A8",
        cubemap    : false,
        mipmaps    : false,
        renderable : true
    };

    var renderBufferParams =
    {
        width  : defaultWidth,
        height : defaultHeight,
        format : "D24S8"
    };

    var renderTargetParams =
    {
        colorTexture0 : null,
        depthBuffer : null
    };

    // PostFX Target
    var postFXTarget = null;
    var postFXTexture = null;

    var postFXTextureParameters =
    {
        name       : "postfxtexture",
        width      : defaultWidth / 2,
        height     : defaultHeight / 2,
        depth      : 1,
        format     : "R8G8B8A8",
        cubemap    : false,
        mipmaps    : false,
        renderable : true
    };

    var postFXTargetParams =
    {
        colorTexture0 : null
    };

    // PostFX2 Target
    var postFX2Target = null;
    var postFX2Texture = null;

    var postFX2TextureParameters =
    {
        name       : "postfx2texture",
        width      : defaultWidth / 2,
        height     : defaultHeight / 2,
        depth      : 1,
        format     : "R8G8B8A8",
        cubemap    : false,
        mipmaps    : false,
        renderable : true
    };

    var postFX2TargetParams =
    {
        colorTexture0 : null
    };

    /*jshint white: false*/
    // Create a quad
    var quadVertexBufferParams = {
        numVertices: 4,
        attributes: ['FLOAT2', 'FLOAT2'],
        dynamic: false,
        data: [
            -1.0,  1.0, 0.0, 1.0,
             1.0,  1.0, 1.0, 1.0,
            -1.0, -1.0, 0.0, 0.0,
             1.0, -1.0, 1.0, 0.0
        ]
    };
    /*jshint white: true*/
    var quadSemantics = graphicsDevice.createSemantics(['POSITION', 'TEXCOORD0']);
    var quadPrimitive = graphicsDevice.PRIMITIVE_TRIANGLE_STRIP;
    var quadVertexBuffer = graphicsDevice.createVertexBuffer(quadVertexBufferParams);

    var destroyBuffers = function destroyBuffersFn()
    {
        if (renderTarget)
        {
            renderTarget.destroy();
            renderTarget = null;
        }

        if (renderBuffer)
        {
            renderBuffer.destroy();
            renderBuffer = null;
        }

        if (renderTexture)
        {
            renderTexture.destroy();
            renderTexture = null;
        }

        if (postFXTarget)
        {
            postFXTarget.destroy();
            postFXTarget = null;
        }

        if (postFXTexture)
        {
            postFXTexture.destroy();
            postFXTexture = null;
        }

        if (postFX2Target)
        {
            postFX2Target.destroy();
            postFX2Target = null;
        }

        if (postFX2Texture)
        {
            postFX2Texture.destroy();
            postFX2Texture = null;
        }
    };

    var createBuffers = function createBuffersFn()
    {
        // Create renderTarget textures & buffers
        renderTexture = graphicsDevice.createTexture(renderTextureParameters);
        if (!renderTexture)
        {
            errorCallback("Render Texture not created.");
        }

        renderBuffer = graphicsDevice.createRenderBuffer(renderBufferParams);
        if (!renderBuffer)
        {
            errorCallback("Render Buffer not created.");
        }

        if (renderTexture && renderBuffer)
        {
            renderTargetParams.colorTexture0 = renderTexture;
            renderTargetParams.depthBuffer = renderBuffer;

            renderTarget = graphicsDevice.createRenderTarget(renderTargetParams);
        }

        // Create postFX textures & buffers
        postFXTexture = graphicsDevice.createTexture(postFXTextureParameters);
        if (!postFXTexture)
        {
            errorCallback("PostFX Texture not created.");
        }

        if (postFXTexture)
        {
            postFXTargetParams.colorTexture0 = postFXTexture;

            postFXTarget = graphicsDevice.createRenderTarget(postFXTargetParams);
        }

        // Create postFX2 textures & buffers
        postFX2Texture = graphicsDevice.createTexture(postFX2TextureParameters);
        if (!postFX2Texture)
        {
            errorCallback("PostFX2 Texture not created.");
        }

        if (postFX2Texture)
        {
            postFX2TargetParams.colorTexture0 = postFX2Texture;

            postFX2Target = graphicsDevice.createRenderTarget(postFX2TargetParams);
        }

    };

    // Process effect finds the requested, sets the technique and input texture, then runs on the specified render target
    var processEffect = function processEffectFn(params)
    {
        var outputTarget = params.outputTarget;
        var inputTexture0 = params.inputTexture0;

        var effect = effects[params.effect];
        if (effect)
        {
            var techniqueParameters = effect.techniqueParameters;

            graphicsDevice.setTechnique(effect.technique);

            techniqueParameters.inputTexture0 = inputTexture0;
            graphicsDevice.setTechniqueParameters(techniqueParameters);

            if (graphicsDevice.beginRenderTarget(outputTarget))
            {
                // Apply the effect to the output render target
                graphicsDevice.setStream(quadVertexBuffer, quadSemantics);
                graphicsDevice.draw(quadPrimitive, 4);

                graphicsDevice.endRenderTarget();
            }
        }
    };

    var setupCopy = function setupCopyFn(inputTexture)
    {
        // The copy is applied directly from the default render target to backbuffer
        var copy = effects.copy;
        if (copy)
        {
            var copyTechniqueParameters = copy.techniqueParameters;
            copyTechniqueParameters.inputTexture0 = inputTexture;

            // The copy technique & copyTechniqueParameters are set ready for the final pass
            graphicsDevice.setTechnique(copy.technique);
            graphicsDevice.setTechniqueParameters(copyTechniqueParameters);
        }
    };

    var setupInvertEffect = function setupInvertEffectFn(inputTexture)
    {
        // The invert is also applied directly from the default render target to backbuffer
        var invert = effects.invert;
        if (invert)
        {
            var invertTechniqueParameters = invert.techniqueParameters;
            invertTechniqueParameters.inputTexture0 = inputTexture;

            // The invert technique & techniqueParameters are set ready for the final pass
            graphicsDevice.setTechnique(invert.technique);
            graphicsDevice.setTechniqueParameters(invertTechniqueParameters);
        }
    };

    var renderBloomEffect = function renderBloomEffectFn(inputTexture)
    {
        // To demonstrate the use of multiple render targets, this bloom effect uses additional render targets

        // Pass 1: Luminance of inputTexture, downsampled to the smaller postFXTarget
        processEffect({
            effect : "luminance",
            outputTarget : postFXTarget,
            inputTexture0 : inputTexture
        });

        // Pass 2: blur the texture in the vertical direction to postFX2Target
        processEffect({
            effect : "blurvert",
            outputTarget : postFX2Target,
            inputTexture0 : postFXTexture
        });

        // Pass 3: blur the texture in the horizontal direction back to postFXTarget
        processEffect({
            effect : "blurhorz",
            outputTarget : postFXTarget,
            inputTexture0 : postFX2Texture
        });

        // The composite is applied to the postFX texture and the input texture to the backbuffer
        var composite = effects.composite;
        if (composite)
        {
            var compositeTechniqueParameters = composite.techniqueParameters;
            compositeTechniqueParameters.inputTexture0 = inputTexture;
            compositeTechniqueParameters.inputTexture1 = postFXTexture;

            // The composite technique & techniqueParameters, ready for the final pass
            graphicsDevice.setTechnique(composite.technique);
            graphicsDevice.setTechniqueParameters(compositeTechniqueParameters);
        }
    };

    // The name of the node we want to rotate to demonstrate the postFX effect
    var nodeName = "LOD3sp";
    var objectNode = null;

    // Initialise all render targets, textures and buffers
    createBuffers();

    var rotation = Motion.create(mathDevice, "scene");
    rotation.setConstantRotation(0.01);

    // Initialize the previous frame time
    var previousFrameTime = TurbulenzEngine.time;

    var renderFrame = function renderFrameFn()
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

        if (objectNode)
        {
            // Update the scene with rotation
            rotation.update(deltaTime);
            objectNode.setLocalTransform(rotation.matrix);
        }

        scene.update();

        renderer.update(graphicsDevice, camera, scene, currentTime);

        if (graphicsDevice.beginFrame())
        {
            if (renderTarget)
            {
                // Render the scene to the default render target
                if (graphicsDevice.beginRenderTarget(renderTarget))
                {
                    if (renderer.updateBuffers(graphicsDevice, gdWidth, gdHeight))
                    {
                        renderer.draw(graphicsDevice, clearColor);
                    }

                    graphicsDevice.endRenderTarget();
                }
            }

            // Setup the postFX shader to be applied on the final pass
            // If the effect requires additional passes, perform them now
            switch (effectID)
            {
            case postFX.copy:
                // Copy only needs to set the copy technique and texture to copy from
                // In this case, the renderTexture
                setupCopy(renderTexture);
                break;
            case postFX.invert:
                // Invert only needs to set the invert technique and texture to apply the invert to
                // In this case, the renderTexture
                setupInvertEffect(renderTexture);
                break;
            case postFX.bloom:
                // This effect requires an additional render target to perform the postFX technique
                // Once it has applied the technique to the render target, it will set the final technique to apply to the backbuffer
                renderBloomEffect(renderTexture);
                break;
            default:
            }

            // The final step is to apply the final postFX technique to the backbuffer
            graphicsDevice.setStream(quadVertexBuffer, quadSemantics);
            graphicsDevice.draw(quadPrimitive, 4);

            graphicsDevice.endFrame();
        }
    };

    // Controls
    var htmlControls = HTMLControls.create();

    htmlControls.addRadioControl({
        id : "radio01",
        groupName : "postEffect",
        radioIndex : 0,
        value : "copy",
        fn : function ()
            {
                effectID = postFX.copy;
            },
        isDefault : true
    });
    htmlControls.addRadioControl({
        id : "radio02",
        groupName : "postEffect",
        radioIndex : 1,
        value : "invert",
        fn : function ()
            {
                effectID = postFX.invert;
            },
        isDefault : false
    });
    htmlControls.addRadioControl({
        id : "radio03",
        groupName : "postEffect",
        radioIndex : 2,
        value : "bloom",
        fn : function ()
            {
                effectID = postFX.bloom;
            },
        isDefault : false
    });
    htmlControls.register();

    var intervalID;
    var loadingLoop = function loadingLoopFn()
    {
        if (sceneLoader.complete())
        {
            TurbulenzEngine.clearInterval(intervalID);

            objectNode = scene.findNode(nodeName);

            var sceneExtents = scene.getExtents();
            var sceneMinExtent = mathDevice.v3Build(sceneExtents[0], sceneExtents[1], sceneExtents[2]);
            var sceneMaxExtent = mathDevice.v3Build(sceneExtents[3], sceneExtents[4], sceneExtents[5]);
            var center = mathDevice.v3ScalarMul(mathDevice.v3Add(sceneMaxExtent, sceneMinExtent), 0.5);
            var extent = mathDevice.v3Sub(center, sceneMinExtent);

            camera.lookAt(center, worldUp, mathDevice.v3Build(center[0] + extent[0] * 2 * cameraDistanceFactor,
                                                              center[1] + extent[1] * cameraDistanceFactor,
                                                              center[2] + extent[2] * 2 * cameraDistanceFactor));
            camera.updateViewMatrix();

            renderer.updateShader(shaderManager);

            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

    var loadAssets = function loadAssetsFn(mappingTable)
    {
        // Renderer for the scene (requires shader assets).
        renderer = DefaultRendering.create(graphicsDevice,
                                               mathDevice,
                                               shaderManager,
                                               effectManager);

        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));
        renderer.setDefaultTexture(textureManager.get("default"));

        // Create duck
        sceneLoader.load({
            scene : scene,
            assetPath : "models/duck.dae",
            graphicsDevice : graphicsDevice,
            mathDevice : mathDevice,
            textureManager : textureManager,
            effectManager : effectManager,
            shaderManager : shaderManager,
            requestHandler : requestHandler,
            append : false,
            dynamic : true
        });

        requestHandler.request({
            src: mappingTable.getURL("shaders/postfx.cgfx"),
            onload: shaderLoaded
        });
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

        loadAssets(mappingTable);
    };

    var gameSessionCreated = function gameSessionCreatedFn(gameSession)
    {
        TurbulenzServices.createMappingTable(requestHandler,
                                             gameSession,
                                             mappingTableReceived);
    };
    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        TurbulenzEngine.clearInterval(intervalID);
        clearColor = null;

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        rotation = null;
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

        camera = null;

        effects = null;

        renderTextureParameters = null;
        renderBufferParams = null;
        renderTargetParams = null;

        postFXTextureParameters = null;
        postFXTargetParams = null;

        postFX2TextureParameters = null;
        postFX2TargetParams = null;

        quadVertexBufferParams = null;
        quadSemantics = null;
        quadPrimitive = null;
        quadVertexBuffer = null;

        destroyBuffers();

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
