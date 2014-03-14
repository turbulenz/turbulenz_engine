/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
 * @title: Draw2D
 * @description:
 * This sample demonstrates the capabilities of the Draw2D API.
 * You can drag the slider around to increase or decrease the amount of sprites rendered using the Draw2D API.
 * You can also select between different rendering options (draw mode, texture mode, sort mode and blend mode)
 * and see the impact on performance reflected on the frames per second counter at the bottom of the left pane.
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
/*global HTMLControls: false */

TurbulenzEngine.onload = function onloadFn()
{
    //==========================================================================
    // HTML Controls
    //==========================================================================
    var htmlControls;

    var objectCount = 500;
    var moveSprites = true;
    var rotateSprites = false;
    var cycleColorSprites = false;

    var drawMode = 'drawSprite';
    var texMode = 'single';
    var sortMode = 'deferred';
    var blendMode = 'alpha';
    var scaleMode = 'scale';

    //==========================================================================
    // Turbulenz Initialization
    //==========================================================================

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var requestHandler = RequestHandler.create({});

    var loadedResources = 0;

    // Textures to load:
    var spriteTextureNames = ["textures/draw2DCircle.png",
                              "textures/draw2DSquare.png",
                              "textures/draw2DStar.png"];

    // List to store Texture objects.
    var textures = {};
    var numResources = spriteTextureNames.length;

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
        for (i = 0; i < spriteTextureNames.length; i += 1)
        {
            graphicsDevice.createTexture(textureParams(spriteTextureNames[i]));
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
    // Draw2D initialization
    //==========================================================================

    var draw2D = Draw2D.create({
        graphicsDevice : graphicsDevice
    });

    // Viewport for Draw2D.
    var gameWidth = graphicsDevice.width;
    var gameHeight = graphicsDevice.height;

    var viewport = mathDevice.v4Build(0, 0, gameWidth, gameHeight);
    var configureParams = {
        scaleMode : undefined,
        viewportRectangle : viewport
    };

    //==========================================================================
    // Sprite drawing.
    //==========================================================================

    // Draw2DSprite object collections.
    // Lazily constructed and cached.
    var sprites = [];
    var spriteSize = 32;

    function getTexture()
    {
        if (texMode === 'none')
        {
            return null;
        }
        else if (texMode === 'single')
        {
            return textures[spriteTextureNames[0]];
        }
        else
        {
            var ind = Math.floor(Math.random() * spriteTextureNames.length);
            return textures[spriteTextureNames[ind]];
        }
    }

    function invalidateSpriteTextures()
    {
        var i;
        var limit = sprites.length;
        for (i = 0; i < limit; i += 1)
        {
            var sprite = sprites[i];
            var tex = getTexture();
            sprite.body.setTexture(tex);
            sprite.halo.setTexture(tex);
        }
    }

    var prevObjectCount;
    function validateSprites()
    {
        var tex;
        while (sprites.length < objectCount)
        {
            // We don't do any scaling or shearing as standard draw mode
            // cannot support this.
            tex = getTexture();
            var body = Draw2DSprite.create({
                texture : tex,
                width : spriteSize,
                height : spriteSize,
                x : (Math.random() * (gameWidth - spriteSize) + (spriteSize * 0.5)),
                y : (Math.random() * (gameHeight - spriteSize) + (spriteSize * 0.5)),
                rotation : 0,
                color : mathDevice.v4Build(1, 1, 1, 1),
                textureRectangle : mathDevice.v4Build(0, 0, spriteSize, spriteSize)
            });
            var halo = Draw2DSprite.create({
                texture : tex,
                width : spriteSize,
                height : spriteSize,
                x : body.x,
                y : body.y,
                rotation : body.rotation,
                color : mathDevice.v4Build(1, 1, 1, 1),
                textureRectangle : mathDevice.v4Build(spriteSize, 0, spriteSize * 2, spriteSize)
            });

            sprites.push({
                body : body,
                halo : halo,
                colorModifier : mathDevice.v4Build(
                                    Math.random() / 100, Math.random() / 100,
                                    Math.random() / 100, Math.random() / 100),
                velocity : [Math.random() * 4 - 2, Math.random() * 4 - 2],
                angularVel : Math.random() / 10 - (1 / 20)
            });
        }

        // Reset position/rotation/color of reused objects etc.
        var i;
        for (i = prevObjectCount; i < objectCount; i += 1)
        {
            var sprite = sprites[i];
            tex = getTexture();

            sprite.body.setTexture(tex);
            sprite.body.x = (Math.random() * (gameWidth - spriteSize) + (spriteSize * 0.5));
            sprite.body.y = (Math.random() * (gameHeight - spriteSize) + (spriteSize * 0.5));
            sprite.body.rotation = 0;
            sprite.body.setColor(mathDevice.v4Build(1, 1, 1, 1));

            sprite.halo.setTexture(tex);
            sprite.halo.x = sprite.body.x;
            sprite.halo.y = sprite.body.y;
            sprite.halo.rotation = sprite.body.rotation;
            sprite.halo.setColor(mathDevice.v4Build(1, 1, 1, 1));
        }
        prevObjectCount = objectCount;
    }

    // Object used when performing draw() calls.
    var drawObjectColor = mathDevice.v4BuildZero();
    var drawObjectDest = mathDevice.v4BuildZero();
    var drawObjectSrc = mathDevice.v4BuildZero();
    var drawObject = {
        color : drawObjectColor,
        rotation : 0,
        destinationRectangle : drawObjectDest,
        sourceRectangle : drawObjectSrc,
        texture : null
    };

    // Buffer used when performing drawRaw() calls.
    var rawBuffer;
    if (typeof Float32Array !== "undefined")
    {
        rawBuffer = new Float32Array(20000 * 16);
    }
    else
    {
        rawBuffer = [];
    }

    //==========================================================================
    // Main loop.
    //==========================================================================

    var fpsElement = document.getElementById("fps");
    var gpuElement = document.getElementById("gpu");
    var dataElement = document.getElementById("dataTransfers");
    var batchElement = document.getElementById("batchCount");
    var minElement = document.getElementById("minBatch");
    var maxElement = document.getElementById("maxBatch");
    var avgElement = document.getElementById("avgBatch");

    var lastFPS = "";
    var lastGPU = "";
    var lastData = "";
    var lastBatch = "";
    var lastMin = "";
    var lastMax = "";
    var lastAvg = "";

    var nextUpdate = 0;
    function displayPerformance()
    {
        var currentTime = TurbulenzEngine.time;
        if (currentTime > nextUpdate)
        {
            nextUpdate = (currentTime + 0.1);

            var data = draw2D.performanceData;

            var fpsText = (graphicsDevice.fps).toFixed(2) + " fps";
            var gpuText = (data.gpuMemoryUsage / 1024).toFixed(2) + " KiB";
            var dataText  = (data.dataTransfers).toString();
            var batchText = (data.batchCount).toString();
            var minText = (data.batchCount === 0) ? "" : (data.minBatchSize + " sprites");
            var maxText = (data.batchCount === 0) ? "" : (data.maxBatchSize + " sprites");
            var avgText = (data.batchCount === 0) ? "" : (Math.round(data.avgBatchSize) + " sprites");

            if (fpsText !== lastFPS)
            {
                lastFPS = fpsText;
                fpsElement.innerHTML = fpsText;
            }
            if (gpuText !== lastGPU)
            {
                lastGPU = gpuText;
                gpuElement.innerHTML = gpuText;
            }

            if (dataText !== lastData)
            {
                lastData = dataText;
                dataElement.innerHTML = dataText;
            }
            if (batchText !== lastBatch)
            {
                lastBatch = batchText;
                batchElement.innerHTML = batchText;
            }
            if (minText !== lastMin)
            {
                lastMin = minText;
                minElement.innerHTML = minText;
            }
            if (maxText !== lastMax)
            {
                lastMax = maxText;
                maxElement.innerHTML = maxText;
            }
            if (avgText !== lastAvg)
            {
                lastAvg = avgText;
                avgElement.innerHTML = avgText;
            }
        }
    }

    // array of blend modes for when 'cycle' option is chosen.
    var blendCycleModes = ['alpha', 'additive', 'opaque'];
    var curBlend;

    var colorTmp = mathDevice.v4Build(0, 0, 0, 0);
    function mainLoop()
    {
        if (!graphicsDevice.beginFrame())
        {
            return;
        }

        draw2D.resetPerformanceData();

        // reset any reused sprites, create any new sprites necessary
        // to reach current spriteCnt value.
        validateSprites();

        if (scaleMode === 'none')
        {
            // with scale mode none, we resize the viewport so that
            // balls can expand into the new area, or become restricted
            // to the smaller screen area.
            gameWidth = graphicsDevice.width;
            gameHeight = graphicsDevice.height;
            viewport[2] = gameWidth;
            viewport[3] = gameHeight;
        }

        configureParams.scaleMode = scaleMode;
        draw2D.configure(configureParams);

        draw2D.setBackBuffer();
        draw2D.clear();

        curBlend = 0;
        draw2D.begin(blendMode === 'cycle' ? blendCycleModes[curBlend] : blendMode, sortMode);

        var halfSize = spriteSize * 0.5;

        var xMin = halfSize;
        var yMin = halfSize;
        var xMax = gameWidth - halfSize;
        var yMax = gameHeight - halfSize;

        var i;
        // Draw sprites!
        for (i = 0; i < objectCount; i += 1)
        {
            // cycling blend modes has no effect when using drawRaw
            // as we are buffering everything into one draw call.
            if (drawMode !== 'drawRaw' && blendMode === 'cycle' && ((i % 100) === 99))
            {
                draw2D.end();
                curBlend = (curBlend + 1) % blendCycleModes.length;
                draw2D.begin(blendCycleModes[curBlend], sortMode);
            }

            var sprite = sprites[i];
            var body = sprite.body;
            var halo = sprite.halo;

            if (moveSprites)
            {
                body.x += sprite.velocity[0];
                body.y += sprite.velocity[1];

                if (body.x < xMin)
                {
                    body.x = xMin;
                    sprite.velocity[0] *= -1;
                }
                if (body.y < yMin)
                {
                    body.y = yMin;
                    sprite.velocity[1] *= -1;
                }
                if (body.x > xMax)
                {
                    body.x = xMax;
                    sprite.velocity[0] *= -1;
                }
                if (body.y > yMax)
                {
                    body.y = yMax;
                    sprite.velocity[1] *= -1;
                }

                halo.x = body.x;
                halo.y = body.y;
            }

            if (rotateSprites)
            {
                body.rotation += sprite.angularVel;
                halo.rotation = body.rotation;
            }

            if (cycleColorSprites)
            {
                body.getColor(colorTmp);

                var j;
                for (j = 0; j < 4; j += 1)
                {
                    var c = colorTmp[j] + sprite.colorModifier[j];
                    if (c < 0)
                    {
                        c = 0;
                        sprite.colorModifier[j] *= -1;
                    }
                    else if (c > 1)
                    {
                        c = 1;
                        sprite.colorModifier[j] *= -1;
                    }
                    colorTmp[j] = c;
                }

                body.setColor(colorTmp);
                // Halo has same alpha, but white color.
                colorTmp[0] = colorTmp[1] = colorTmp[2] = 1;
                halo.setColor(colorTmp);
            }

            if (drawMode === 'drawSprite')
            {
                draw2D.drawSprite(halo);
                draw2D.drawSprite(body);
            }
            else if (drawMode === 'draw')
            {
                drawObject.texture = body.getTexture();
                drawObject.rotation = body.rotation;
                drawObjectDest[0] = body.x - halfSize;
                drawObjectDest[1] = body.y - halfSize;
                drawObjectDest[2] = body.x + halfSize;
                drawObjectDest[3] = body.y + halfSize;

                halo.getTextureRectangle(drawObjectSrc);
                halo.getColor(drawObjectColor);
                draw2D.draw(drawObject);

                body.getTextureRectangle(drawObjectSrc);
                body.getColor(drawObjectColor);
                draw2D.draw(drawObject);
            }
            else
            {
                draw2D.bufferSprite(rawBuffer, halo, (i * 2));
                draw2D.bufferSprite(rawBuffer, body, (i * 2) + 1);
            }
        }

        // drawRaw mode we can only use 1 texture. so Regardless we must force this.
        if (drawMode === 'drawRaw' && objectCount !== 0)
        {
            draw2D.drawRaw(sprites[0].body.getTexture(), rawBuffer, objectCount * 2);
        }

        draw2D.end();

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
            TurbulenzEngine.clearInterval(intervalID);
            intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
        }
    }

    intervalID = TurbulenzEngine.setInterval(loadingLoop, 100);

    //==========================================================================

    function loadHtmlControls()
    {
        htmlControls = HTMLControls.create();
        htmlControls.addSliderControl({
            id: "spriteSlider",
            value: (objectCount * 2),
            max: 20000,
            min: 2,
            step: 2,
            fn: function ()
            {
                objectCount = Math.floor(this.value / 2);
                htmlControls.updateSlider("spriteSlider", objectCount * 2);
            }
        });

        htmlControls.addCheckboxControl({
            id: "moveBox",
            value: "moveSprites",
            isSelected: moveSprites,
            fn: function ()
            {
                moveSprites = !moveSprites;
                return moveSprites;
            }
        });
        htmlControls.addCheckboxControl({
            id: "rotateBox",
            value: "rotateSprites",
            isSelected: rotateSprites,
            fn: function ()
            {
                rotateSprites = !rotateSprites;
                return rotateSprites;
            }
        });
        htmlControls.addCheckboxControl({
            id: "colorBox",
            value: "cycleColorSprites",
            isSelected: cycleColorSprites,
            fn: function ()
            {
                cycleColorSprites = !cycleColorSprites;
                return cycleColorSprites;
            }
        });

        htmlControls.addRadioControl({
            id: "draw0",
            groupName: "drawMode",
            radioIndex: 0,
            value: "drawSprite",
            fn: function ()
            {
                drawMode = 'drawSprite';
            },
            isDefault : true
        });
        htmlControls.addRadioControl({
            id: "draw1",
            groupName: "drawMode",
            radioIndex: 1,
            value: "draw",
            fn: function ()
            {
                drawMode = 'draw';
            },
            isDefault : false
        });
        htmlControls.addRadioControl({
            id: "draw2",
            groupName: "drawMode",
            radioIndex: 2,
            value: "drawRaw",
            fn: function ()
            {
                drawMode = 'drawRaw';
            },
            isDefault : false
        });

        htmlControls.addRadioControl({
            id: "tex0",
            groupName: "texMode",
            radioIndex: 0,
            value: "none",
            fn: function ()
            {
                texMode = 'none';
                invalidateSpriteTextures();
            },
            isDefault : false
        });
        htmlControls.addRadioControl({
            id: "tex1",
            groupName: "texMode",
            radioIndex: 1,
            value: "single",
            fn: function ()
            {
                texMode = 'single';
                invalidateSpriteTextures();
            },
            isDefault : true
        });
        htmlControls.addRadioControl({
            id: "tex2",
            groupName: "texMode",
            radioIndex: 2,
            value: "many",
            fn: function ()
            {
                texMode = 'many';
                invalidateSpriteTextures();
            },
            isDefault : false
        });

        htmlControls.addRadioControl({
            id: "sort0",
            groupName: "sortMode",
            radioIndex: 0,
            value: "immediate",
            fn: function ()
            {
                sortMode = 'immediate';
            },
            isDefault : false
        });
        htmlControls.addRadioControl({
            id: "sort1",
            groupName: "sortMode",
            radioIndex: 1,
            value: "deferred",
            fn: function ()
            {
                sortMode = 'deferred';
            },
            isDefault : true
        });
        htmlControls.addRadioControl({
            id: "sort2",
            groupName: "sortMode",
            radioIndex: 2,
            value: "texture",
            fn: function ()
            {
                sortMode = 'texture';
            },
            isDefault : false
        });

        htmlControls.addRadioControl({
            id: "blend0",
            groupName: "blendMode",
            radioIndex: 0,
            value: "opaque",
            fn: function ()
            {
                blendMode = 'opaque';
            },
            isDefault : false
        });
        htmlControls.addRadioControl({
            id: "blend1",
            groupName: "blendMode",
            radioIndex: 1,
            value: "alpha",
            fn: function ()
            {
                blendMode = 'alpha';
            },
            isDefault : true
        });
        htmlControls.addRadioControl({
            id: "blend2",
            groupName: "blendMode",
            radioIndex: 2,
            value: "additive",
            fn: function ()
            {
                blendMode = 'additive';
            },
            isDefault : false
        });
        htmlControls.addRadioControl({
            id: "blend3",
            groupName: "blendMode",
            radioIndex: 3,
            value: "cycle",
            fn: function ()
            {
                blendMode = 'cycle';
            },
            isDefault : false
        });

        htmlControls.addRadioControl({
            id: "scale0",
            groupName: "scaleMode",
            radioIndex: 0,
            value: "none",
            fn: function ()
            {
                scaleMode = 'none';
            },
            isDefault : false
        });
        htmlControls.addRadioControl({
            id: "scale1",
            groupName: "scaleMode",
            radioIndex: 1,
            value: "scale",
            fn: function ()
            {
                scaleMode = 'scale';
            },
            isDefault : true
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
