/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
 * @title: Texture effects
 * @description:
 * This sample shows how to use advanced texture effects with the Draw2D API.
 * You can select, customize and combine the following effects to be applied to the rendered texture:
 * Distortion, Color Matrix, Bloom and Gaussian blur.
*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/textureeffects.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global Draw2D: false */
/*global Draw2DSprite: false */
/*global TextureEffects: false */
/*global HTMLControls: false */

TurbulenzEngine.onload = function onloadFn()
{
    //==========================================================================
    // HTML Controls
    //==========================================================================
    var htmlControls;

    var distort = false;
    var strength = 10; //px
    var rotation = 0; //radian
    var scale = 1; // factor.

    var colormatrix = false;
    var saturation = 1; // factor.
    var hue = 0; //radian
    var brightness = 0; // normalised offset.
    var contrast = 1; // factor
    var grayscale = false;
    var sepia = false;
    var negative = false;

    var bloom = false;
    var bloomRadius = 20;
    var bloomThreshold = 0.65;
    var bloomIntensity = 1.2;
    var bloomSaturation = 1.2;
    var originalIntensity = 1.0;
    var originalSaturation = 1.0;
    var thresholdCutoff = 3;

    var gausblur = false;
    var gausBlurRadius = 10;

    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var requestHandler = RequestHandler.create({});

    var loadedResources = 0;

    // Textures to load:
    var distortionTextureName = "textures/texfxdisplace.png";
    var backgroundTextureName = "textures/texfxbg.png";

    var textureNames = [distortionTextureName, backgroundTextureName];

    // List to store Texture objects.
    var textures = {};
    var numResources = textureNames.length;

    function mappingTableReceived(mappingTable)
    {
        function textureParams(src)
        {
            return {
                src : mappingTable.getURL(src),
                mipmaps : true,
                onload : function (texture)
                {
                    if (texture)
                    {
                        textures[src] = texture;
                        loadedResources += 1;
                    }
                }
            };
        }

        var i;
        for (i = 0; i < textureNames.length; i += 1)
        {
            graphicsDevice.createTexture(textureParams(textureNames[i]));
        }
    }

    var gameSession;
    function sessionCreated()
    {
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            mappingTableReceived
        );
    }

    gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);

    //==========================================================================
    // Draw2D and TextureEffects initialization
    //==========================================================================

    var clearColor = mathDevice.v4Build(0, 0, 0, 1);

    var draw2D = Draw2D.create({
        graphicsDevice : graphicsDevice
    });

    var effects = TextureEffects.create({
        graphicsDevice : graphicsDevice,
        mathDevice : mathDevice
    });

    // Create render targets used for effects rendering.
    var renderTargetFullScreen1 = draw2D.createRenderTarget({});
    var renderTargetFullScreen2 = draw2D.createRenderTarget({});
    var renderTargetFullScreen3 = draw2D.createRenderTarget({});
    var renderTarget256A = draw2D.createRenderTarget({ width : 256, height : 256 });
    var renderTarget256B = draw2D.createRenderTarget({ width : 256, height : 256 });

    // Distortion effect.
    // ------------------
    var distortEffectParam = {
        transform : [1, 0, 0, 1, 0, 0],
        source: null,
        destination: null,
        strength: 0,
        distortion: <Texture>null
    };

    function applyDistort(src, dest)
    {
        var param = distortEffectParam;
        param.source = src;
        param.destination = dest;

        param.strength = strength;
        var xform = param.transform;

        // We invert rotation and scale as this transformation
        // occurs in texture lookup to distortion texture.
        // so to scale by 200% we have to scale texture lookups by 50%.
        var cos = Math.cos(rotation) / scale;
        var sin = - Math.sin(rotation) / scale;

        // Determine additional scaling to fit distortion texture to
        // section of back buffer / render target in use.
        var w = src.width / graphicsDevice.width;
        var h = src.height / graphicsDevice.height;

        xform[0] = cos * w;
        xform[1] = sin * w;
        xform[2] = -sin * h;
        xform[3] = cos * h;
        xform[4] = 0.5 * (1 - cos + sin);
        xform[5] = 0.5 * (1 - cos - sin);

        effects.applyDistort(param);
    }

    // ColorMatrix effect.
    // -------------------
    var tmpMatrix = mathDevice.m43BuildIdentity();
    var colorMatrixEffectParam = {
        colorMatrix : mathDevice.m43BuildIdentity(),
        source: null,
        destination: null
    };
    function applyColorMatrix(src, dest)
    {
        var param = colorMatrixEffectParam;

        var xform = param.colorMatrix;
        var tmp = tmpMatrix;
        param.source = src;
        param.destination = dest;

        mathDevice.m43BuildIdentity(xform);
        if (saturation !== 1)
        {
            effects.saturationMatrix(saturation, tmp);
            mathDevice.m43Mul(xform, tmp, xform);
        }
        if ((hue % (Math.PI * 2)) !== 0)
        {
            effects.hueMatrix(hue, tmp);
            mathDevice.m43Mul(xform, tmp, xform);
        }
        if (contrast !== 1)
        {
            effects.contrastMatrix(contrast, tmp);
            mathDevice.m43Mul(xform, tmp, xform);
        }
        if (brightness !== 0)
        {
            effects.brightnessMatrix(brightness, tmp);
            mathDevice.m43Mul(xform, tmp, xform);
        }
        if (grayscale)
        {
            effects.grayScaleMatrix(tmp);
            mathDevice.m43Mul(xform, tmp, xform);
        }
        if (negative)
        {
            effects.negativeMatrix(tmp);
            mathDevice.m43Mul(xform, tmp, xform);
        }
        if (sepia)
        {
            effects.sepiaMatrix(tmp);
            mathDevice.m43Mul(xform, tmp, xform);
        }

        effects.applyColorMatrix(param);
    }

    // Bloom effect.
    // -------------
    var bloomEffectParam = {
        source: null,
        destination: null,
        blurRadius: 0,
        bloomThreshold: 0,
        bloomIntensity: 0,
        bloomSaturation: 0,
        originalIntensity: 0,
        originalSaturation: 0,
        thresholdCutoff: 0,
        blurTarget1: <RenderTarget>null,
        blurTarget2: <RenderTarget>null
    };
    function applyBloom(src, dest)
    {
        var param = bloomEffectParam;
        param.source = src;
        param.destination = dest;
        param.blurRadius = bloomRadius;
        param.bloomThreshold = bloomThreshold;
        param.bloomIntensity = bloomIntensity;
        param.bloomSaturation = bloomSaturation;
        param.originalIntensity = originalIntensity;
        param.originalSaturation = originalSaturation;
        param.thresholdCutoff = thresholdCutoff;

        // Strictly speaking as these are non-dynamic render targets,
        // we can be sure the render target is not going to change
        // instead of accessing it each time.
        param.blurTarget1 = draw2D.getRenderTarget(renderTarget256A);
        param.blurTarget2 = draw2D.getRenderTarget(renderTarget256B);

        effects.applyBloom(param);
    }

    // GaussianBlur effect.
    // --------------------
    var gausBlurEffectParam = {
        source: null,
        destination: null,
        blurRadius: 0,
        blurTarget: <RenderTarget>null
    };
    function applyGausBlur(src, dest)
    {
        var param = gausBlurEffectParam;
        param.source = src;
        param.destination = dest;
        param.blurRadius = gausBlurRadius;

        param.blurTarget = draw2D.getRenderTarget(renderTargetFullScreen3);

        effects.applyGaussianBlur(param);
    }

    // List of active effect applicators.
    var effElement = document.getElementById("effectInfo");
    var activeEffects = [];

    function invalidateEffects()
    {
        var names = [];
        var i;
        for (i = 0; i < activeEffects.length; i += 1)
        {
            names[i] = activeEffects[i].name;
        }
        effElement.innerHTML = names.toString();
    }

    //==========================================================================
    // Main loop.
    //==========================================================================

    var fpsElement = document.getElementById("fpscounter");
    var lastFPS = "";
    var nextUpdate = 0;
    function displayPerformance()
    {
        var currentTime = TurbulenzEngine.time;
        if (currentTime > nextUpdate)
        {
            nextUpdate = (currentTime + 0.1);

            var fpsText = (graphicsDevice.fps).toFixed(2);
            if (lastFPS !== fpsText)
            {
                lastFPS = fpsText;
                fpsElement.innerHTML = fpsText + " fps";
            }
        }
    }

    var backgroundSprite = null;
    var distortionSprite = null;
    function mainLoop()
    {
        if (!graphicsDevice.beginFrame()) return;

        // If no effects applied, render directly to back buffer.
        if (activeEffects.length === 0)
        {
            draw2D.setBackBuffer();
        }
        else
        {
            draw2D.setRenderTarget(renderTargetFullScreen1);
        }

        draw2D.clear(clearColor);
        draw2D.begin();

        backgroundSprite.setWidth(graphicsDevice.width);
        backgroundSprite.setHeight(graphicsDevice.height);
        draw2D.drawSprite(backgroundSprite);

        draw2D.end();

        // Apply effects!
        var src = renderTargetFullScreen1;
        var dest = renderTargetFullScreen2;
        var i;
        for (i = 0; i < activeEffects.length; i += 1)
        {
            activeEffects[i].applyEffect(
                draw2D.getRenderTargetTexture(src),
                draw2D.getRenderTarget(dest)
            );

            var tmp = src;
            src = dest;
            dest = tmp;
        }

        // If we have effects applied, copy to back buffer.
        if (activeEffects.length !== 0)
        {
            draw2D.setBackBuffer();
            draw2D.copyRenderTarget(src);
        }

        // Render distortion texture at end to display what it looks like.
        if (distort)
        {
            draw2D.begin();
            draw2D.drawSprite(distortionSprite);
            draw2D.end();
        }

        graphicsDevice.endFrame();

        if (fpsElement)
        {
            displayPerformance();
        }
    }

    var intervalID;
    function loadingLoop()
    {
        if (loadedResources === numResources)
        {
            // Set distortion texture, create background sprite.
            distortEffectParam.distortion = textures[distortionTextureName];

            backgroundSprite = Draw2DSprite.create({
                texture : textures[backgroundTextureName],
                origin : [0, 0]
            });

            distortionSprite = Draw2DSprite.create({
                texture : distortEffectParam.distortion,
                origin : [0, 0],
                width : 128,
                height : 128
            });

            TurbulenzEngine.clearInterval(intervalID);
            intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
        }
    }

    intervalID = TurbulenzEngine.setInterval(loadingLoop, 100);

    //==========================================================================

    function loadHtmlControls()
    {
        var distortEffect = {
            applyEffect : applyDistort,
            name : "distort"
        };
        var colorMatrixEffect = {
            applyEffect : applyColorMatrix,
            name : "colorMatrix"
        };
        var gausBlurEffect = {
            applyEffect : applyGausBlur,
            name : "gaussianBlur"
        };
        var bloomEffect = {
            applyEffect : applyBloom,
            name : "bloom"
        };

        htmlControls = HTMLControls.create();
        htmlControls.addCheckboxControl({
            id: "distortBox",
            value: "distort",
            isSelected: distort,
            fn: function ()
            {
                distort = !distort;
                if (distort)
                {
                    activeEffects.push(distortEffect);
                }
                else
                {
                    activeEffects.splice(activeEffects.indexOf(distortEffect), 1);
                }
                invalidateEffects();
                return distort;
            }
        });
        htmlControls.addSliderControl({
            id: "strengthSlider",
            value: strength,
            max: 100,
            min: -100,
            step: 1,
            fn: function ()
            {
                strength = this.value;
                htmlControls.updateSlider("strengthSlider", strength);
            }
        });
        htmlControls.addSliderControl({
            id: "rotationSlider",
            value: Math.round(rotation * 180 / Math.PI),
            max: 360,
            min: 0,
            step: 1,
            fn: function ()
            {
                rotation = this.value * Math.PI / 180;
                htmlControls.updateSlider("rotationSlider", Math.round(rotation * 180 / Math.PI));
            }
        });
        htmlControls.addSliderControl({
            id: "scaleSlider",
            value: (scale * 100),
            max: 300,
            min: -300,
            step: 1,
            fn: function ()
            {
                scale = this.value / 100;
                htmlControls.updateSlider("scaleSlider", scale * 100);
            }
        });

        htmlControls.addCheckboxControl({
            id: "colorMatrixBox",
            value: "colormatrix",
            isSelected: colormatrix,
            fn: function ()
            {
                colormatrix = !colormatrix;
                if (colormatrix)
                {
                    activeEffects.push(colorMatrixEffect);
                }
                else
                {
                    activeEffects.splice(activeEffects.indexOf(colorMatrixEffect), 1);
                }
                invalidateEffects();
                return colormatrix;
            }
        });
        htmlControls.addSliderControl({
            id: "saturationSlider",
            value: (saturation * 100),
            max: 200,
            min: -200,
            step: 1,
            fn: function ()
            {
                saturation = this.value / 100;
                htmlControls.updateSlider("saturationSlider", saturation * 100);
            }
        });
        htmlControls.addSliderControl({
            id: "hueSlider",
            value: Math.round(hue * 180 / Math.PI),
            max: 360,
            min: 0,
            step: 1,
            fn: function ()
            {
                hue = this.value * Math.PI / 180;
                htmlControls.updateSlider("hueSlider", Math.round(hue * 180 / Math.PI));
            }
        });
        htmlControls.addSliderControl({
            id: "brightnessSlider",
            value: brightness,
            max: 1,
            min: -1,
            step: 0.01,
            fn: function ()
            {
                brightness = this.value;
                htmlControls.updateSlider("brightnessSlider", brightness);
            }
        });
        htmlControls.addSliderControl({
            id: "contrastSlider",
            value: (contrast * 100),
            max: 200,
            min: 0,
            step: 1,
            fn: function ()
            {
                contrast = this.value / 100;
                htmlControls.updateSlider("contrastSlider", contrast * 100);
            }
        });
        htmlControls.addCheckboxControl({
            id: "grayscaleBox",
            value: "grayscale",
            isSelected: grayscale,
            fn: function ()
            {
                grayscale = !grayscale;
                return grayscale;
            }
        });
        htmlControls.addCheckboxControl({
            id: "negativeBox",
            value: "negative",
            isSelected: negative,
            fn: function ()
            {
                negative = !negative;
                return negative;
            }
        });
        htmlControls.addCheckboxControl({
            id: "sepiaBox",
            value: "sepia",
            isSelected: sepia,
            fn: function ()
            {
                sepia = !sepia;
                return sepia;
            }
        });

        htmlControls.addCheckboxControl({
            id: "bloomBox",
            value: "bloom",
            isSelected: bloom,
            fn: function ()
            {
                bloom = !bloom;
                if (bloom)
                {
                    activeEffects.push(bloomEffect);
                }
                else
                {
                    activeEffects.splice(activeEffects.indexOf(bloomEffect), 1);
                }
                invalidateEffects();
                return bloom;
            }
        });
        htmlControls.addSliderControl({
            id: "bloomRadiusSlider",
            value: bloomRadius,
            max: 50,
            min: 0,
            step: 0.5,
            fn: function ()
            {
                bloomRadius = this.value;
                htmlControls.updateSlider("bloomRadiusSlider", bloomRadius);
            }
        });
        htmlControls.addSliderControl({
            id: "bloomThresholdSlider",
            value: bloomThreshold,
            max: 1,
            min: 0,
            step: 0.01,
            fn: function ()
            {
                bloomThreshold = this.value;
                htmlControls.updateSlider("bloomThresholdSlider", bloomThreshold);
            }
        });
        htmlControls.addSliderControl({
            id: "bloomThresholdCutoffSlider",
            value: thresholdCutoff,
            max: 6,
            min: -3,
            step: 0.25,
            fn: function ()
            {
                thresholdCutoff = this.value;
                htmlControls.updateSlider("bloomThresholdCutoffSlider", thresholdCutoff);
            }
        });
        htmlControls.addSliderControl({
            id: "bloomIntensitySlider",
            value: bloomIntensity,
            max: 2,
            min: 0,
            step: 0.02,
            fn: function ()
            {
                bloomIntensity = this.value;
                htmlControls.updateSlider("bloomIntensitySlider", bloomIntensity);
            }
        });
        htmlControls.addSliderControl({
            id: "bloomSaturationSlider",
            value: bloomSaturation,
            max: 2,
            min: -2,
            step: 0.04,
            fn: function ()
            {
                bloomSaturation = this.value;
                htmlControls.updateSlider("bloomSaturationSlider", bloomSaturation);
            }
        });
        htmlControls.addSliderControl({
            id: "originalIntensitySlider",
            value: originalIntensity,
            max: 2,
            min: 0,
            step: 0.02,
            fn: function ()
            {
                originalIntensity = this.value;
                htmlControls.updateSlider("originalIntensitySlider", originalIntensity);
            }
        });
        htmlControls.addSliderControl({
            id: "originalSaturationSlider",
            value: originalSaturation,
            max: 2,
            min: -2,
            step: 0.04,
            fn: function ()
            {
                originalSaturation = this.value;
                htmlControls.updateSlider("originalSaturationSlider", originalSaturation);
            }
        });

        htmlControls.addCheckboxControl({
            id: "gausBlurBox",
            value: "gausblur",
            isSelected: gausblur,
            fn: function ()
            {
                gausblur = !gausblur;
                if (gausblur)
                {
                    activeEffects.push(gausBlurEffect);
                }
                else
                {
                    activeEffects.splice(activeEffects.indexOf(gausBlurEffect), 1);
                }
                invalidateEffects();
                return gausblur;
            }
        });
        htmlControls.addSliderControl({
            id: "gausBlurRadiusSlider",
            value: gausBlurRadius,
            max: 50,
            min: 0,
            step: 0.5,
            fn: function ()
            {
                gausBlurRadius = this.value;
                htmlControls.updateSlider("gausBlurRadiusSlider", gausBlurRadius);
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
