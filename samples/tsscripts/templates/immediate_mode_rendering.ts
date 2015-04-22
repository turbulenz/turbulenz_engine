/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

// There is an issue with TypeScript where comments before a leading
// interface declaration are not emitted.  To ensure that the include
// directives end up in the final .js file, this interface decl must
// be placed right up here.

interface ImmediateRenderObject
{
    update?: (delta: number) => void;
    init: () => void;
    draw: (graphicsDevice: GraphicsDevice) => void;
};

/*
 * @title: Immediate rendering
 * @description:
 * This sample demonstrates how to use the low level API of the Turbulenz graphics device.
 * It shows how to load shaders, change techniques, and how to create and dispatch dynamic index and vertex buffers
 * to render simple 2D animations.
*/

/*{{ javascript("jslib/camera.js") }}*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*global RequestHandler: false */
/*global TurbulenzEngine: false */
/*global TurbulenzServices: false */
/*global Camera: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

    // Create the engine devices objects

    // This sample uses the 'graphicsDevice' to demonstrate different basic rendering techniques
    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    if (!graphicsDevice.shadingLanguageVersion)
    {
        errorCallback("No shading language support detected.\nPlease check your graphics drivers are up to date.");
        graphicsDevice = null;
        return;
    }

    // Clear the background color of the engine window
    var clearColor = [0.0, 0.0, 0.0, 1.0];
    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(clearColor);
        graphicsDevice.endFrame();
    }

    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var camera = Camera.create(mathDevice);
    var worldUp = mathDevice.v3BuildYAxis();
    camera.lookAt(mathDevice.v3Build(0, 0, -100), worldUp, mathDevice.v3Build(0, 4, 15.0));
    camera.updateViewMatrix();
    camera.updateProjectionMatrix();

    var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
    if (aspectRatio !== camera.aspectRatio)
    {
        camera.aspectRatio = aspectRatio;
        camera.updateProjectionMatrix();
    }
    camera.updateViewProjectionMatrix();

    // Create techniqueParameters for each object
    var techniqueParameters = graphicsDevice.createTechniqueParameters({
        worldViewProjection : camera.viewProjectionMatrix,
        constantColor : [1.0, 0.0, 0.0, 0.5]
    });
    var techniqueParametersProceduralTexture = graphicsDevice.createTechniqueParameters({
        worldViewProjection : camera.viewProjectionMatrix,
        diffuse : null
    });
    var techniqueParametersCrateTexture = graphicsDevice.createTechniqueParameters({
        worldViewProjection : camera.viewProjectionMatrix,
        diffuse : null
    });
    var techniqueParametersPoint = graphicsDevice.createTechniqueParameters({
        worldViewProjection : camera.viewProjectionMatrix,
        constantColor : [1.0, 0.0, 0.0, 0.5],
        pointSize : 1
    });

    // Create semantics for specifing the vertices/colors/textureCoords
    var semanticsTypes = {
        position: <Semantics>null,
        color: <Semantics>null,
        positionAndTexture: <Semantics>null
    };
    var vertexFormatTypes = {
        position: <number[]>undefined,
        color: <number[]>undefined,
        positionAndTexture: <number[]>undefined
    };

    // Only the position
    semanticsTypes.position = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION]);
    vertexFormatTypes.position = [graphicsDevice.VERTEXFORMAT_FLOAT3];

    // Only the color (with alpha, rgba)
    semanticsTypes.color = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_COLOR]);
    vertexFormatTypes.color = [graphicsDevice.VERTEXFORMAT_FLOAT4];

    // Both position and texture coordinate
    semanticsTypes.positionAndTexture = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION, graphicsDevice.SEMANTIC_TEXCOORD]);
    vertexFormatTypes.positionAndTexture = [graphicsDevice.VERTEXFORMAT_FLOAT3, graphicsDevice.VERTEXFORMAT_SHORT2N];

    var shader = null;

    // Creation of render objects

    // The grid, drawn as lines with a constant color
    var gridRenderObject : ImmediateRenderObject =
    {
        techniqueName: "constantColor3D",
        semanticName: "position",
        primitive: graphicsDevice.PRIMITIVE_LINES,
        numOfRenderItems: 5, // Each grid dimension i.e. N x N
        technique: null,
        vertexFormats: null,
        semantics: null,
        techniqueParameters: null,
        startPosition: [ 1.0, 1.0, 0.0 ],
        color: [ 1.0, 0.0, 0.0, 0.5],
        isInit: false,
        accTime: 0,                         // Accumulated time of between animation steps
        animPeriod: 0.2,                    // Time to wait between steps
        animStep: 1,                        // How many dimensions to increase per step
        maxNumOfRenderItems: 5,
        update: function updateFn(delta)
        {
            var numOfLevels = this.numOfRenderItems;
            var maxNumOfRenderItems = this.maxNumOfRenderItems;
            var animPeriod = this.animPeriod;

            this.accTime += delta;
            if (this.accTime > animPeriod)
            {
                this.numOfRenderItems = (numOfLevels + this.animStep) % (maxNumOfRenderItems + 1);
                this.accTime = 0;
            }
        },
        init: function initFn()
        {
            // Initialise the references to semantics/vertexFormats
            var semanticName = this.semanticName;
            this.semantics = semanticsTypes[semanticName];
            this.vertexFormats = vertexFormatTypes[semanticName];
            this.techniqueParameters = techniqueParameters;
            this.isInit = (this.semantics && this.vertexFormats && this.techniqueParameters);
        },
        draw: function drawFn(graphicsDevice)
        {
            var numOfLines = this.numOfRenderItems + 1;
            var startX = this.startPosition[0];
            var startY = this.startPosition[1];
            var startZ = this.startPosition[2];

            var primitive = this.primitive;
            var techniqueParameters = this.techniqueParameters;
            var vertexFormats = this.vertexFormats;
            var semantics = this.semantics;

            if (this.isInit)
            {
                // Shared techniqueParameters, so set the color
                // This is the techniqueParameters to be used for this draw
                techniqueParameters.constantColor = this.color;
                graphicsDevice.setTechniqueParameters(techniqueParameters);

                // Draw directly using a writer to populate the vertices
                // In this case only positions of x,y,z are being written
                var writer = graphicsDevice.beginDraw(primitive, numOfLines * 4, vertexFormats, semantics);
                if (writer)
                {
                    var ns = numOfLines - 1;
                    for (var i = 0; i < numOfLines; i += 1)
                    {
                        var xs = startX + i;
                        var ys = startY + i;
                        var xe = startX + ns;
                        var ye = startY + ns;
                        writer(xs,      startY, startZ);
                        writer(xs,      ye,     startZ);
                        writer(startX,  ys,     startZ);
                        writer(xe,      ys,     startZ);
                    }
                    graphicsDevice.endDraw(writer);
                }
            }

        }
    };

    // The circle, drawn as points of a constant color
    var circleRenderObject : ImmediateRenderObject =
    {
        techniqueName: "pointConstantColor3D",
        semanticName: "position",
        primitive: graphicsDevice.PRIMITIVE_POINTS,
        numOfRenderItems: 1500,             // A large number of points are used to be visible
        technique: null,
        vertexFormats: null,
        semantics: null,
        techniqueParameters: null,
        startPosition: [ 10.0, 3.5, 0.0 ],
        color: [ 0.0, 1.0, 0.0, 0.5],
        radius: 2.5,
        isInit: false,
        init: function initFn()
        {
            var semanticName = this.semanticName;
            this.semantics = semanticsTypes[semanticName];
            this.vertexFormats = vertexFormatTypes[semanticName];
            this.techniqueParameters = techniqueParametersPoint;
            this.isInit = (this.semantics && this.vertexFormats && this.techniqueParameters);
        },
        draw: function drawFn(graphicsDevice)
        {
            var numOfRenderItems = this.numOfRenderItems;
            var startX = this.startPosition[0];
            var startY = this.startPosition[1];
            var startZ = this.startPosition[2];

            var primitive = this.primitive;
            var vertexFormats = this.vertexFormats;
            var semantics = this.semantics;


            if (this.isInit)
            {
                this.techniqueParameters.constantColor = this.color;
                graphicsDevice.setTechniqueParameters(this.techniqueParameters);

                // Draw using a writer to add only positions (x,y,z)
                var writer = graphicsDevice.beginDraw(primitive, numOfRenderItems, vertexFormats, semantics);
                if (writer)
                {
                    var sinfn = Math.sin;
                    var cosfn = Math.cos;
                    var random = Math.random;

                    var pi2 = 2 * Math.PI;
                    var inc = pi2 / 64;

                    var radius = this.radius;
                    var sin, cos, r;

                    for (var i = 0, t = 0; i < numOfRenderItems; i += 1)
                    {
                        // Random positions are used to make the points clearer to visualise
                        r = radius * random();
                        sin = sinfn(t);
                        cos = cosfn(t);
                        writer((r * sin) + startX, (r * cos) + startY, startZ);
                        t += inc;
                        if (t > pi2)
                        {
                            t -= pi2;
                        }
                    }

                    graphicsDevice.endDraw(writer);
                }
            }
        }
    };

    // The spiral, drawn using a procedurally generated texture
    var spiralRenderObject : ImmediateRenderObject =
    {
        techniqueName: "textured3D",
        semanticName: "positionAndTexture",
        primitive: graphicsDevice.PRIMITIVE_TRIANGLES,
        numOfRenderItems: 17,               // Iterations of spiral algorithm
        technique: null,
        vertexFormats: null,
        semantics: null,
        techniqueParameters: null,
        startPosition: [ -4.5, 4.5, 0.0 ],
        color: [ 1.0, 0.0, 1.0, 0.5],
        scale: 0.5,
        thetaInc: 0,
        isInit: false,
        accTime: 0,
        animPeriod: 0.5,
        animStep: 1,
        maxNumOfRenderItems: 17,
        update: function updateFn(delta)
        {
            var maxNumOfRenderItems = this.maxNumOfRenderItems;
            var animPeriod = this.animPeriod;

            // Increase/decrease the number of iterations
            this.accTime += delta;
            if (this.accTime > animPeriod)
            {
                this.numOfRenderItems += this.animStep;
                if (this.numOfRenderItems < 1)
                {
                    this.numOfRenderItems = 1;
                    this.animStep *= -1;
                }
                else if (this.numOfRenderItems > maxNumOfRenderItems)
                {
                    this.numOfRenderItems = maxNumOfRenderItems;
                    this.animStep *= -1;
                }
                this.accTime = 0;
            }
        },
        init: function initFn()
        {
            var semanticName = this.semanticName;
            this.semantics = semanticsTypes[semanticName];
            this.vertexFormats = vertexFormatTypes[semanticName];
            this.techniqueParameters = techniqueParametersProceduralTexture;

            // Pre-calculate the theta amount to increase per step
            this.thetaInc = (2 * Math.PI) / 16;
            this.isInit = (this.semantics && this.vertexFormats && this.techniqueParameters);
        },
        draw: function drawFn(graphicsDevice /*, delta */)
        {
            var numOfRenderLevels = this.numOfRenderItems;
            var startX = this.startPosition[0];
            var startY = this.startPosition[1];
            var startZ = this.startPosition[2];

            var primitive = this.primitive;
            var techniqueParameters = this.techniqueParameters;
            var vertexFormats = this.vertexFormats;
            var semantics = this.semantics;

            var scale = this.scale;
            var thetaInc = this.thetaInc;

            var sin, cos, at;
            var theta, absX, absY;
            var x0, y0, x1, y1, x2, y2, x3, y3;

            techniqueParameters.constantColor = this.color;
            graphicsDevice.setTechniqueParameters(techniqueParameters);

            if (this.isInit)
            {
                // Direct draw, specifying a position (x,y,z) and texture coordinate (u,v)
                var writer = graphicsDevice.beginDraw(primitive, (numOfRenderLevels * 6), vertexFormats, semantics);
                if (writer)
                {
                    var sinfn = Math.sin;
                    var cosfn = Math.cos;
                    var absfn = Math.abs;
                    theta = 0;
                    x0 = startX;
                    y0 = startY;
                    x2 = startX;
                    y2 = startY;

                    for (var i = 0; i < numOfRenderLevels; i += 1)
                    {
                        theta += thetaInc;
                        at = scale * theta;
                        sin = sinfn(theta);
                        cos = cosfn(theta);

                        x1 = (at * cos) + startX;
                        y1 = (at * sin) + startY;
                        absX = absfn(x0 - startX);
                        absY = absfn(y0 - startY);
                        x3 = x0 + ((x0 > startX) ? scale * absX : -scale * absX);
                        y3 = y0 + ((y0 > startY) ? scale * absY : -scale * absY);

                        // Draws two triangles for each iterative step of the algorithm
                        writer(x3, y3, startZ, 0, 0);
                        writer(x1, y1, startZ, 1, 1);
                        writer(x0, y0, startZ, 0, 0);

                        writer(x2, y2, startZ, 0, 0);
                        writer(x3, y3, startZ, 1, 1);
                        writer(x0, y0, startZ, 0, 0);

                        x0 = x1;
                        y0 = y1;
                        x2 = x3;
                        y2 = y3;
                    }

                    graphicsDevice.endDraw(writer);
                }
            }
        }
    };

    // The textured panel, drawn using variable vertex colors
    var panelRenderObject : ImmediateRenderObject =
    {
        techniqueName: "vertexColorTextured3D",
        primitive: graphicsDevice.PRIMITIVE_TRIANGLES,              // Uses triangles to draw each texture square
        numOfRenderItems: 5,
        colorStream: {                              // Uses vertexbuffer streams to pass both vertex color and position/texCoords
            semanticName: "color",                  // Colors are varied every frame
            semantics: null,
            vertexBuffer: null
        },
        positionStream: {
            semanticName: "positionAndTexture",     // Positions are defined at initialization
            semantics: null,
            vertexBuffer: null
        },
        indexBuffer: null,
        technique: null,
        techniqueParameters: null,
        startPosition: [ -13.0, 1.0, 0.0 ],
        color: [ 0.0, 1.0, 1.0, 0.5],
        isInit: false,
        remapColors: function remapColorsFn(colors)
        {
            // Code needs to be updated for efficiency
            // Update the colors used for the vertices
            var numOfRenderItems = this.numOfRenderItems;
            var coloredItems = numOfRenderItems * numOfRenderItems * 4;
            var random = Math.random;

            if (colors)
            {
                var writer = colors.map();
                if (writer)
                {
                    var r, g, b;
                    for (var i = 0; i < coloredItems; i += 1)
                    {
                        r = random();
                        g = random();
                        b = random();
                        writer(r, g, b, 1);
                    }

                    colors.unmap(writer);
                    writer = null;
                }
            }
        },
        update: function updateFn(/* delta */)
        {
            if (this.isInit)
            {
                this.remapColors(this.colorStream.vertexBuffer);
            }
        },
        init: function initFn()
        {
            var numOfLevels = this.numOfRenderItems;
            var numOfLevelsSqrd = numOfLevels * numOfLevels;
            var coloredItems = numOfLevelsSqrd * 4;
            var colorStream = this.colorStream;
            var positionStream = this.positionStream;
            var indexBuffer = this.indexBuffer;

            var writer, i;

            var positionsParameters =
            {
                numVertices: coloredItems,
                attributes: ['FLOAT3', 'SHORT2N'], // attributes specify the types the graphicsDevice is expecting to receive for each vertex buffer
                dynamic: false
            };

            var colorsParameters =
            {
                numVertices: coloredItems,
                attributes: ['UBYTE4N'],
                dynamic: true
            };

            var positions = graphicsDevice.createVertexBuffer(positionsParameters);
            var colors = graphicsDevice.createVertexBuffer(colorsParameters);

            colorStream.semantics = semanticsTypes[colorStream.semanticName];
            positionStream.semantics = semanticsTypes[positionStream.semanticName];

            this.remapColors(colors);
            colorStream.vertexBuffer = colors;

            if (!indexBuffer)
            {
                var indexBufferParameters = {
                    numIndices: numOfLevelsSqrd * 6,
                    format: 'USHORT'
                };

                indexBuffer = graphicsDevice.createIndexBuffer(indexBufferParameters);

                writer = indexBuffer.map();
                if (writer)
                {
                    var v0, v1, v2, v3;
                    for (i = 0; i < numOfLevelsSqrd; i += 1)
                    {
                        v0 = 4 * i + 0;
                        v1 = 4 * i + 1;
                        v2 = 4 * i + 2;
                        v3 = 4 * i + 3;
                        writer(v0, v1, v2);
                        writer(v2, v3, v0);
                    }

                    indexBuffer.unmap(writer);
                }

                this.indexBuffer = indexBuffer;
            }

            // Generate all the positions
            if (positions)
            {
                writer = positions.map();
                if (writer)
                {
                    var startX = this.startPosition[0];
                    var startY = this.startPosition[1];
                    var startZ = this.startPosition[2];

                    for (i = 0; i < numOfLevels; i += 1)
                    {
                        var xs = (startX + i);
                        var xe = (xs + 1);
                        for (var j = 0; j < numOfLevels; j += 1)
                        {
                            var ys = (startY + j);
                            var ye = (ys + 1);
                            writer(xs, ys, startZ, 0, 0);
                            writer(xe, ys, startZ, 1, 0);
                            writer(xe, ye, startZ, 1, 1);
                            writer(xs, ye, startZ, 0, 1);
                        }
                    }

                    positions.unmap(writer);
                    writer = null;
                    positionStream.vertexBuffer = positions;
                }
            }

            // Allows panel to be drawn before the texture is loaded
            this.techniqueParameters = techniqueParametersCrateTexture;
            this.isInit = (colorStream.vertexBuffer && positionStream.vertexBuffer && this.techniqueParameters);

        },
        draw: function drawFn(graphicsDevice)
        {
            var primitive = this.primitive;
            var techniqueParameters = this.techniqueParameters;
            var colors = this.colorStream.vertexBuffer;
            var colorSemantics = this.colorStream.semantics;
            var positions = this.positionStream.vertexBuffer;
            var positionSemantics = this.positionStream.semantics;
            var indexBuffer = this.indexBuffer;

            if (this.isInit)
            {
                // Sets the vertexBuffers to use for the draw call
                graphicsDevice.setStream(colors, colorSemantics);
                graphicsDevice.setStream(positions, positionSemantics);

                // Sets the techniqueParameters, in this case a crate texture with shader with vertexColorTextured3D technique
                graphicsDevice.setTechniqueParameters(techniqueParameters);

                // Draw quads
                graphicsDevice.setIndexBuffer(indexBuffer);
                graphicsDevice.drawIndexed(primitive, indexBuffer.numIndices);
            }
        }
    };

    // Sets objects to render
    var renderObjects : ImmediateRenderObject[] =
        [ circleRenderObject,
          gridRenderObject,
          spiralRenderObject,
          panelRenderObject ];

    // Generate texture (Simple checkerboard)
    var proceduralTextureParameters = {
        name: "checkers",
        width: 4,
        height: 4,
        depth: 1,
        format: graphicsDevice.PIXELFORMAT_L8,
        mipmaps: true,
        cubemap: false,
        renderable: false,
        dynamic: false,
        data: [  0, 255,   0, 255,
               255,   0, 255,   0,
                 0, 255,   0, 255,
               255,   0, 255,   0]
    };

    var proceduralTexture = graphicsDevice.createTexture(proceduralTextureParameters);
    techniqueParametersProceduralTexture['diffuse'] = proceduralTexture;

    // Init objects
    spiralRenderObject.init();
    gridRenderObject.init();
    circleRenderObject.init();
    panelRenderObject.init();

    var intervalID;
    var previousTime = TurbulenzEngine.time;
    var renderObj = null;

    var renderFrame = function renderFrameFn()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = currentTime - previousTime;
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }

        // Update objects (in this case animate)
        var renderObjectsCount = renderObjects.length;
        for (var n = 0; n < renderObjectsCount; n += 1)
        {
            renderObj = renderObjects[n];
            var updateObj = renderObj.update;
            if (updateObj)
            {
                renderObj.update(deltaTime);
            }
        }

        // Update the aspect ratio of the camera in case of window resizes
        var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        var vp = camera.viewProjectionMatrix;

        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(clearColor, 1.0, 0);

            for (var m = 0; m < renderObjectsCount; m += 1)
            {
                renderObj = renderObjects[m];
                var technique = renderObj.technique;

                if (!technique)
                {
                    technique = shader.getTechnique(renderObj.techniqueName);
                    if (technique)
                    {
                        renderObj.technique = technique;
                    }
                }

                if (technique)
                {
                    graphicsDevice.setTechnique(technique);

                    var techniqueParameters = renderObj.techniqueParameters;
                    if (techniqueParameters)
                    {
                        techniqueParameters.worldViewProjection = vp;
                    }

                    renderObj.draw(graphicsDevice);
                }
            }

            graphicsDevice.endFrame();
        }
        previousTime = currentTime;
    };

    var crateTextureLoaded = false;
    var loadingLoop = function loadingLoopFn()
    {
        if (shader && crateTextureLoaded)
        {
            TurbulenzEngine.clearInterval(intervalID);

            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
        }
    };
    // Start calling the loading loop at 10Hz
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        // Load shader and techniques
        var shaderLoaded = function shaderLoadedFn(shaderText)
        {
            if (shaderText)
            {
                var shaderParameters = JSON.parse(shaderText);
                shader = graphicsDevice.createShader(shaderParameters);
            }
        };

        requestHandler.request({
            src: mappingTable.getURL("shaders/generic3D.cgfx"),
            onload: shaderLoaded
        });

        var crateTextureParameters =
        {
            src     : mappingTable.getURL("textures/crate.jpg"),
            mipmaps : true,
            onload  : function (texture)
                    {
                        techniqueParametersCrateTexture['diffuse'] = texture;
                        crateTextureLoaded = true;
                    }
        };
        graphicsDevice.createTexture(crateTextureParameters);
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

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        requestHandler = null;
        camera = null;
        techniqueParameters = null;
        techniqueParametersProceduralTexture = null;
        techniqueParametersCrateTexture = null;
        semanticsTypes = null;
        vertexFormatTypes = null;
        renderObjects.length = 0;
        proceduralTexture = null;
        TurbulenzEngine.flush();
        graphicsDevice = null;
        mathDevice = null;
        requestHandler = null;
    };
};
