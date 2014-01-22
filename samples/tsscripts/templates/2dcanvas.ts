/*{# Copyright (c) 2011-2012 Turbulenz Limited #}*/

/*
 * @title: 2D Canvas
 * @description:
 * This sample demonstrates some of the capabilities of the Canvas 2D API.
 * It shows how to render lines, rectangles, circles, arcs, polygons, textures and linear and radial gradients using the Canvas 2D API.
 * It also shows a frames per second counter to get a measure of the API performance.
*/

/*{# Import additional JS files here #}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/canvas.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global Canvas: false */

TurbulenzEngine.onload = function onloadFn()
{
    if (!TurbulenzEngine.canvas)
    {
        var graphicsDeviceParameters = { };
        var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);
    }

    var canvas, ctx, crateImage, stonesImage, stonesPattern;

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    // Create game session and load textures
    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        if (TurbulenzEngine.canvas)
        {
            var crateImageLoading = new Image();
            crateImageLoading.onload = function ()
            {
                crateImage = crateImageLoading;
            };
            crateImageLoading.src = mappingTable.getURL("textures/crate.jpg");

            var stonesImageLoading = new Image();
            stonesImageLoading.onload = function ()
            {
                stonesImage = stonesImageLoading;
            };
            stonesImageLoading.src = mappingTable.getURL("textures/stones.jpg");
        }
        else
        {
            var crateImageParameters =
                {
                    src     : mappingTable.getURL("textures/crate.jpg"),
                    mipmaps : true,
                    onload  : function (texture)
                    {
                        crateImage = texture;
                    }
                };
            graphicsDevice.createTexture(crateImageParameters);

            var stonesImageParameters =
                {
                    src     : mappingTable.getURL("textures/stones.jpg"),
                    mipmaps : true,
                    onload  : function (texture)
                    {
                        stonesImage = texture;
                    }
                };
            graphicsDevice.createTexture(stonesImageParameters);
        }
    };

    var gameSessionCreated = function gameSessionCreatedFn(gameSession)
    {
        TurbulenzServices.createMappingTable(requestHandler,
                                             gameSession,
                                             mappingTableReceived);
    };
    var gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    // Create canvas object

    if (TurbulenzEngine.canvas)
    {
        canvas = TurbulenzEngine.canvas;

        var numFrames = 0;
        var lastSecond = 0;
    }
    else
    {
        canvas = Canvas.create(graphicsDevice);
    }
    var ctx = canvas.getContext('2d');

    // Set the initial previous frametime for the first loop
    var previousFrameTime = TurbulenzEngine.time;
    var fpsElement = document.getElementById("fpscounter");
    var currentFPS = "0", lastFPS = "0";

/*
    var concavePoints = [];
    for (var a = 0; a < (Math.PI * 2); a += 0.05)
    {
        var r = (150 + (150 * Math.random()));
        concavePoints.push([(300 + (r * Math.cos(a))),
                            (300 + (r * Math.sin(a)))]);
    }
 */

    var concavePoints = [[204, 49], [48, 233], [296, 328], [261, 244], [87, 228], [211, 206], [170, 178], [274, 132]];


    function calculateSpirograph(R, r, O)
    {
        var points = [];

        /*jshint bitwise: false*/
        var dRO = ((R - O) | 0);
        var Rr = (R + r);
        var rO = (r + O);
        var Rrr = (Rr / r);

        var pi72 = (Math.PI / 72);
        var cos = Math.cos;
        var sin = Math.sin;

        points[0] = [dRO, 0];

        var x1i = dRO, y1i = 0;
        var x2, y2;
        var i = 1;
        do
        {
            var ipi = (i * pi72);
            var Rrripi = (Rrr * ipi);

            x2 = ((Rr * cos(ipi)) - (rO * cos(Rrripi)));
            y2 = ((Rr * sin(ipi)) - (rO * sin(Rrripi)));

            var x2i = (x2 | 0);
            var y2i = (y2 | 0);

            if (x1i !== x2i || y1i !== y2i)
            {
                x1i = x2i;
                y1i = y2i;

                points.push([x2, y2]);

                if (x2i === dRO && y2i === 0)
                {
                    break;
                }
            }

            i += 1;
        }
        while (i < 2000);
        /*jshint bitwise: true*/

        return points;
    }

    var spirographPoints = [];

    for (var i = 0; i < 3; i += 1)
    {
        for (var j = 0; j < 3; j += 1)
        {
            spirographPoints[(i * 3) + j] = calculateSpirograph(20 * (j + 2) / (j + 1), -8 * (i + 3) / (i + 1), 10);
        }
    }


    var lingrad = ctx.createLinearGradient(0, 0, 0, 150);
    lingrad.addColorStop(0, '#00ABEB');
    lingrad.addColorStop(0.5, '#fff');
    lingrad.addColorStop(0.5, '#26C000');
    lingrad.addColorStop(1, '#fff');

    var lingrad2 = ctx.createLinearGradient(0, 50, 0, 95);
    lingrad2.addColorStop(0.5, '#000');
    lingrad2.addColorStop(1, 'rgba(0,0,0,0)');

    var radgrad = ctx.createRadialGradient(45, 45, 10, 52, 50, 30);
    radgrad.addColorStop(0, '#A7D30C');
    radgrad.addColorStop(0.9, '#019F62');
    radgrad.addColorStop(0.95, 'rgba(1,159,98,0)');
    radgrad.addColorStop(1, 'rgba(1,159,98,0)');

    var radgrad2 = ctx.createRadialGradient(105, 105, 20, 112, 120, 50);
    radgrad2.addColorStop(0, '#FF5F98');
    radgrad2.addColorStop(0.75, '#FF0188');
    radgrad2.addColorStop(0.99, 'rgba(255,1,136,0)');
    radgrad2.addColorStop(1, 'rgba(255,1,136,0)');

    var radgrad3 = ctx.createRadialGradient(95, 15, 15, 102, 20, 40);
    radgrad3.addColorStop(0, '#00C9FF');
    radgrad3.addColorStop(0.8, '#00B5E2');
    radgrad3.addColorStop(0.99, 'rgba(0,201,255,0)');
    radgrad3.addColorStop(1, 'rgba(0,201,255,0)');

    var radgrad4 = ctx.createRadialGradient(0, 150, 50, 0, 140, 90);
    radgrad4.addColorStop(0, '#F4F201');
    radgrad4.addColorStop(0.8, '#E4C700');
    radgrad4.addColorStop(0.99, 'rgba(228,199,0,0)');
    radgrad4.addColorStop(1, 'rgba(228,199,0,0)');


    // Update: Should update the input, physics, sound and other js libraries used.
    //         The function should then trigger the rendering using the graphicsDevice

    function update()
    {
        // Gets the currentTime to be used in calculations for this frame
        var currentTime = TurbulenzEngine.time;

        // Delta is calculated to be used by update functions that require the elapsed time since they were last called
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }

        var deviceWidth, deviceHeight, i, j, points, numPoints, point;

        // Render the color

        var ok = false;
        if (TurbulenzEngine.canvas)
        {
            deviceWidth = canvas.width;
            deviceHeight = canvas.height;
            ok =true;
        }
        else
        {
            if (graphicsDevice.beginFrame())
            {
                deviceWidth = graphicsDevice.width;
                deviceHeight = graphicsDevice.height;

                if (canvas.width !== deviceWidth)
                {
                    canvas.width = deviceWidth;
                }
                if (canvas.height !== deviceHeight)
                {
                    canvas.height = deviceHeight;
                }

                ctx.beginFrame();
                ok = true;
            }
        }

        if (ok)
        {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, deviceWidth, deviceHeight);

            //ctx.beginPath();
            //ctx.arc(deviceWidth * 0.5, deviceHeight * 0.5, Math.min(deviceWidth, deviceHeight) * 0.5, 0, Math.PI * 2, true);
            //ctx.clip();

            // Background pattern
            if (stonesImage)
            {
                ctx.save();
                if (!stonesPattern)
                {
                    stonesPattern = ctx.createPattern(stonesImage, 'repeat');
                }
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = stonesPattern;
                ctx.fillRect(0, 0, deviceWidth, deviceHeight);
                ctx.restore();
            }

            //ctx.shadowOffsetX = 5;
            //ctx.shadowOffsetY = 5;
            //ctx.shadowColor = '#000';

            // colored rectangles
            ctx.save();
            ctx.translate(330, 70);
            for (i = 0; i < 6; i += 1)
            {
                for (j = 0; j < 6; j += 1)
                {
                    ctx.fillStyle = 'rgb(' + Math.floor(255 - (42.5 * i)) + ',' +  Math.floor(255 - (42.5 * j)) + ',0)';
                    ctx.fillRect(j * 25, i * 25, 25, 25);
                }
            }
            ctx.restore();

            // Crate image
            if (crateImage)
            {
                ctx.save();
                ctx.translate(50, 525);
                ctx.drawImage(crateImage, 40, 0, 128, 128);
                ctx.restore();
            }

            // Transparent arcs
            ctx.save();
            ctx.translate(330, 320);
            ctx.fillStyle = '#FD0';
            ctx.fillRect(0, 0, 75, 75);
            ctx.fillStyle = '#6C0';
            ctx.fillRect(75, 0, 75, 75);
            ctx.fillStyle = '#09F';
            ctx.fillRect(0, 75, 75, 75);
            ctx.fillStyle = '#F30';
            ctx.fillRect(75, 75, 75, 75);
            ctx.fillStyle = '#FFF';

            ctx.globalAlpha = 0.2;

            for (i = 0; i < 7; i += 1)
            {
                ctx.beginPath();
                ctx.arc(75, 75, 10 + (10 * i), 0, Math.PI * 2, true);
                ctx.fill();
            }
            ctx.restore();

            // Thick lines
            ctx.save();
            ctx.translate(330, 520);
            ctx.strokeStyle = '#FFF';
            var lineJoin = ['round', 'bevel', 'miter'];
            var lineCap = ['butt', 'round', 'square'];
            ctx.lineWidth = 10;
            for (i = 0; i < lineJoin.length; i += 1)
            {
                ctx.lineJoin = lineJoin[i];
                ctx.lineCap = lineCap[i];
                ctx.beginPath();
                ctx.moveTo(-5, 5 + (i * 40));
                ctx.lineTo(35, 45 + (i * 40));
                ctx.lineTo(75, 5 + (i * 40));
                ctx.lineTo(115, 45 + (i * 40));
                ctx.lineTo(155, 5 + (i * 40));
                ctx.stroke();
            }
            ctx.restore();

            // Smiley
            //ctx.strokeStyle = "#FFFFFF";
            //ctx.beginPath();
            //ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
            //ctx.moveTo(110,75);
            //ctx.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
            //ctx.moveTo(65,65);
            //ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
            //ctx.moveTo(95,65);
            //ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
            //ctx.stroke();

            // Spirographs
            for (i = 0; i < 3; i += 1)
            {
                for (j = 0; j < 3; j += 1)
                {
                    ctx.save();
                    ctx.strokeStyle = "#9CFF00";
                    ctx.translate((50 + (j * 100)), (50 + (i * 100)));

                    points = spirographPoints[(i * 3) + j];
                    numPoints = points.length;

                    ctx.beginPath();

                    point = points[0];
                    ctx.moveTo(point[0], point[1]);

                    for (var k = 1; k < numPoints; k += 1)
                    {
                        point = points[k];
                        ctx.lineTo(point[0], point[1]);
                    }

                    ctx.stroke();

                    ctx.restore();
                }
            }

            // Concentric rings of circles
            ctx.save();
            ctx.translate(150, 390);
            for (i = 1; i < 6; i += 1)
            {
                // Loop through rings (from inside to out)
                ctx.save();

                ctx.fillStyle = 'rgb(' + (51 * i) + ',' + (255 - (51 * i)) + ',255)';

                ctx.beginPath();

                for (j = 0; j < (i * 6); j += 1)
                {
                    // draw individual dots
                    ctx.rotate(Math.PI * 2 / (i * 6));
                    ctx.moveTo(0, i * 12.5);
                    ctx.arc(0, i * 12.5, 5, 0, Math.PI * 2, true);
                }

                ctx.fill();

                ctx.restore();
            }
            ctx.restore();

            // Linear gradient
            ctx.save();
            ctx.translate(550, 70);
            ctx.fillStyle = lingrad;
            ctx.strokeStyle = lingrad2;
            ctx.fillRect(10, 10, 130, 130);
            ctx.strokeRect(50, 50, 50, 50);
            ctx.restore();

            // Radial gradient
            ctx.save();
            ctx.translate(550, 320);
            ctx.fillStyle = radgrad4;
            ctx.fillRect(0, 0, 150, 150);
            ctx.fillStyle = radgrad3;
            ctx.fillRect(0, 0, 150, 150);
            ctx.fillStyle = radgrad2;
            ctx.fillRect(0, 0, 150, 150);
            ctx.fillStyle = radgrad;
            ctx.fillRect(0, 0, 150, 150);
            ctx.restore();

            // Concave polygon
            numPoints = concavePoints.length;
            point = concavePoints[0];
            ctx.save();
            ctx.translate(530, 490);
            ctx.scale(0.5, 0.5);
            ctx.beginPath();
            ctx.moveTo(point[0], point[1]);
            for (i = 1; i < numPoints; i += 1)
            {
                point = concavePoints[i];
                ctx.lineTo(point[0], point[1]);
            }
            ctx.closePath();
            ctx.fillStyle = '#00F';
            ctx.fill();
            ctx.strokeStyle = '#FFF';
            ctx.stroke();
            ctx.restore();

            // Paths with rounded corners
            ctx.save();
            ctx.translate(0, 100);
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.moveTo(120, 100);
            ctx.lineTo(180, 100);
            ctx.arcTo(200, 100, 200, 80, 20);
            ctx.lineTo(200, 20);
            ctx.arcTo(200, 0, 180, 0, 20);
            ctx.lineTo(120, 0);
            ctx.arcTo(100, 0, 100, 20, 20);
            ctx.lineTo(100, 80);
            ctx.arcTo(100, 100, 120, 100, 20);
            ctx.stroke();
            ctx.translate(250, 80);
            ctx.rotate(Math.PI / 4);
            ctx.beginPath();
            ctx.moveTo(20, 0);
            ctx.lineTo(80, 0);
            ctx.arcTo(100, 0, 100, 20, 20);
            ctx.lineTo(100, 80);
            ctx.arcTo(100, 100, 80, 100, 20);
            ctx.lineTo(20, 100);
            ctx.arcTo(0, 100, 0, 80, 20);
            ctx.lineTo(0, 20);
            ctx.arcTo(0, 0, 20, 0, 20);
            ctx.stroke();
            ctx.restore();

            // Canvas capture
            //var imageData = ctx.getImageData(100, 350, 100, 100);
            //ctx.putImageData(imageData, 100, 100);

            //ctx.shadowOffsetX = 0;
            //ctx.shadowOffsetY = 0;

            if (TurbulenzEngine.canvas)
            {
                numFrames += 1;

                if ((currentTime - lastSecond) >= 1)
                {
                    currentFPS = (numFrames / ((currentTime - lastSecond))).toFixed(2);
                    numFrames = 0;
                    lastSecond = currentTime;
                }
            }
            else
            {
                ctx.endFrame();

                graphicsDevice.endFrame();

                currentFPS = (graphicsDevice.fps).toFixed(2);
            }
        }

        if (lastFPS !== currentFPS)
        {
            lastFPS = currentFPS;
            if (fpsElement)
            {
                fpsElement.innerHTML = currentFPS + ' fps';
            }
        }

        previousFrameTime = currentTime;
    }

    var intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);

    TurbulenzEngine.onunload = function destroyScene()
    {
        // Clear the interval to stop update from being called
        TurbulenzEngine.clearInterval(intervalID);

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        // Clear any references to memory
        radgrad4 = null;
        radgrad3 = null;
        radgrad2 = null;
        radgrad = null;
        lingrad2 = null;
        lingrad = null;
        stonesPattern = null;
        stonesImage = null;
        crateImage = null;
        ctx = null;
        canvas = null;
        requestHandler = null;

        fpsElement = null;

        // Tell the Turbulenz Engine to force the js virtual machine
        // to free as much memory as possible
        TurbulenzEngine.flush();

        // Clear each native engine reference
        graphicsDevice = null;

        TurbulenzEngine.onunload = null;
    };

};
