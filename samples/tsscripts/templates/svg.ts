/*{# Copyright (c) 2011-2013 Turbulenz Limited #}*/

/*
 * @title: Scalable vector graphics
 * @description:
 * This sample shows a more complex usage of the Canvas 2D API by manually rendering SVG images.
*/

/*{# Import additional JS files here #}*/

/*{{ javascript("jslib/canvas.js") }}*/

/*global TurbulenzEngine: true */
/*global Canvas: false */
/*global window: false */
/*global console: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };
    TurbulenzEngine.onerror = errorCallback;

    // Create each of the native engine API devices to be used
    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    var canvas, ctx, svg;
    var scaleCanvas = false;

    function drawSVGpath(ctx)
    {
        var d = this.d;
        if (d)
        {
            ctx.beginPath();

            ctx.path(d);

            if (ctx.fillStyle !== 'none')
            {
                ctx.fill();
            }

            if (ctx.strokeStyle !== 'none')
            {
                ctx.stroke();
            }
        }
    }

    function drawSVGpolygon(ctx)
    {
        var values = this.points;
        if (values)
        {
            var numValues = values.length;

            ctx.beginPath();

            ctx.moveTo(values[0], values[1]);

            for (var n = 2; n < numValues; n += 2)
            {
                ctx.lineTo(values[n], values[n + 1]);
            }

            ctx.closePath();

            if (ctx.fillStyle !== 'none')
            {
                ctx.fill();
            }

            if (ctx.strokeStyle !== 'none')
            {
                ctx.stroke();
            }
        }
    }

    function drawSVGpolyline(ctx)
    {
        var values = this.points;
        if (values)
        {
            var numValues = values.length;

            ctx.beginPath();

            ctx.moveTo(values[0], values[1]);

            for (var n = 2; n < numValues; n += 2)
            {
                ctx.lineTo(values[n], values[n + 1]);
            }

            if (ctx.fillStyle !== 'none')
            {
                ctx.fill();
            }

            if (ctx.strokeStyle !== 'none')
            {
                ctx.stroke();
            }
        }
    }

    function drawSVGrect(ctx)
    {
        var x = this.x;
        var y = this.y;
        var width = this.width;
        var height = this.height;

        if (ctx.fillStyle !== 'none')
        {
            ctx.fillRect(x, y, width, height);
        }

        if (ctx.strokeStyle !== 'none')
        {
            ctx.strokeRect(x, y, width, height);
        }
    }

    function drawSVGcircle(ctx)
    {
        var cx = this.cx;
        var cy = this.cy;
        var radius = this.r;
        if (radius > 0)
        {
            ctx.beginPath();

            ctx.arc(cx, cy, radius, 0, (2 * Math.PI));

            if (ctx.fillStyle !== 'none')
            {
                ctx.fill();
            }

            if (ctx.strokeStyle !== 'none')
            {
                ctx.stroke();
            }
        }
    }

    function drawSVGellipse(ctx)
    {
        var cx = this.cx;
        var cy = this.cy;
        var rx = this.rx;
        var ry = this.ry;
        if (rx > 0 && ry > 0)
        {
            ctx.beginPath();

            if (rx !== ry)
            {
                var r, sx, sy;
                if (rx > ry)
                {
                    r = rx;
                    sx = 1;
                    sy = ry / rx;
                }
                else //if (rx < ry)
                {
                    r = ry;
                    sx = rx / ry;
                    sy = 1;
                }

                ctx.translate(cx, cy);
                ctx.scale(sx, sy);
                ctx.arc(0, 0, r, 0, (2 * Math.PI));
                ctx.scale(1 / sx, 1 / sy);
                ctx.translate(-cx, -cy);
            }
            else
            {
                ctx.arc(cx, cy, rx, 0, (2 * Math.PI));
            }

            if (ctx.fillStyle !== 'none')
            {
                ctx.fill();
            }

            if (ctx.strokeStyle !== 'none')
            {
                ctx.stroke();
            }
        }
    }

    function drawSVGline(ctx)
    {
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = this.x2;
        var y2 = this.y2;

        ctx.beginPath();

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (ctx.strokeStyle !== 'none')
        {
            ctx.stroke();
        }
    }

    function drawSVGempty(ctx)
    {
    }

    // Don't set the flag if we're running on IE10

    var isIE = (!!window.ActiveXObject) &&
        (-1 === window.navigator.userAgent.indexOf("MSIE 1"));

    function buildAttributesMap(attributes, attributesMap)
    {
        var numAttributes = attributes.length;
        for (var n = 0; n < numAttributes; n += 1)
        {
            var attribute = (isIE ? attributes.nextNode() : attributes[n]);
            var attributeName = attribute.name;
            var nameSpaceEnd = attributeName.indexOf(":");
            var nameSpace = (nameSpaceEnd !== -1 ? attributeName.slice(0, nameSpaceEnd) : null);
            if (nameSpace !== "sodipodi" &&
                nameSpace !== "inkscape" &&
                nameSpace !== "xmlns")
            {
                attributesMap[attributeName] = attribute.value;
            }
        }
        return attributesMap;
    }

    function addGradientStops(gradient, stops)
    {
        var numStops = stops.length;
        for (var s = 0; s < numStops; s += 1)
        {
            var stop = stops[s];
            if (stop.tagName === "stop")
            {
                var stopAttributes = buildAttributesMap(stop.attributes, {});

                var stopOffset = parseFloat(stopAttributes.offset);
                var stopColor = stopAttributes["stop-color"];
                if (!stopColor)
                {
                    var stopStyle = stopAttributes.style;
                    if (!stopStyle)
                    {
                        return false;
                    }

                    stopStyle = stopStyle.replace(/\s+/g, '');

                    var stopColorIndex = stopStyle.indexOf('stop-color:');
                    if (stopColorIndex !== -1)
                    {
                        var endStopColorIndex = stopStyle.indexOf(';', stopColorIndex);
                        if (endStopColorIndex === -1)
                        {
                            endStopColorIndex = stopStyle.length;
                        }

                        stopColor = stopStyle.slice(stopColorIndex + 11, endStopColorIndex);
                    }
                }
                gradient.addColorStop(stopOffset, stopColor);
            }
        }

        return true;
    }

    function parseDefinitions(defs, idMap)
    {
        var childNodes = defs.children;
        if (!childNodes)
        {
            childNodes = [];

            var childNode = defs.firstChild;
            while (childNode)
            {
                childNodes[childNodes.length] = childNode;
                childNode = childNode.nextSibling;
            }
        }

        var numChildren = childNodes.length;
        var n, child, attributes, id, stopsParent, stops, base;

        // First, create local map
        var localIdMap = {};
        for (n = 0; n < numChildren; n += 1)
        {
            child = childNodes[n];

            attributes = child.attributes;
            if (!attributes)
            {
                continue;
            }

            id = child.getAttribute('id');
            if (id)
            {
                localIdMap[id] = child;
            }
        }

        // Then parse definitions
        for (n = 0; n < numChildren; n += 1)
        {
            child = childNodes[n];

            attributes = child.attributes;
            if (!attributes)
            {
                continue;
            }

            attributes = buildAttributesMap(attributes, {});

            id = attributes.id;
            if (!id)
            {
                continue;
            }

            var type = child.tagName;
            if (type === "linearGradient")
            {
                if (attributes.x1 !== undefined)
                {
                    var x1 = parseFloat(attributes.x1);
                    var y1 = parseFloat(attributes.y1);
                    var x2 = parseFloat(attributes.x2);
                    var y2 = parseFloat(attributes.y2);

                    var linearGradient = ctx.createLinearGradient(x1, y1, x2, y2);

                    base = attributes["xlink:href"];
                    if (base)
                    {
                        stopsParent = localIdMap[base.slice(1)];
                    }
                    else
                    {
                        stopsParent = child;
                    }

                    stops = stopsParent.children;
                    if (!stops)
                    {
                        stops = [];

                        var stopNode = stopsParent.firstChild;
                        while (stopNode)
                        {
                            stops[stops.length] = stopNode;
                            stopNode = stopNode.nextSibling;
                        }
                    }

                    if (addGradientStops(linearGradient, stops))
                    {
                        idMap[id] = linearGradient;
                    }
                }
            }
            else if (type === "radialGradient")
            {
                if (attributes.cx !== undefined)
                {
                    var cx = parseFloat(attributes.cx);
                    var cy = parseFloat(attributes.cy);
                    var fx = parseFloat(attributes.fx !== undefined ? attributes.fx : cx);
                    var fy = parseFloat(attributes.fy !== undefined ? attributes.fy : cx);
                    var r = parseFloat(attributes.r);

                    var radialGradient = ctx.createRadialGradient(fx, fy, 0, cx, cy, r);

                    base = attributes["xlink:href"];
                    if (base)
                    {
                        base = localIdMap[base.slice(1)];

                        stops = (base.children || base.childNodes);
                    }
                    else
                    {
                        stops = (child.children || child.childNodes);
                    }

                    if (addGradientStops(radialGradient, stops))
                    {
                        idMap[id] = radialGradient;
                    }
                }
            }
        }
    }

    function checkStyle(style, idMap)
    {
        if (style.slice(0, 3) === 'url')
        {
            var urlEndIndex = style.indexOf(')', 3);
            if (urlEndIndex !== -1)
            {
                var url = style.slice(4, urlEndIndex).replace(/["#]/g, '');

                var ref = idMap[url];
                if (ref)
                {
                    return ref;
                }

                style = style.slice(urlEndIndex + 1);
                if (!style)
                {
                    return '#000';
                }
            }
            else
            {
                return '#000';
            }
        }
        return style;
    }

    function parseUnitValue(unit)
    {
        var value = parseFloat(unit);

        if (unit.indexOf("pt") !== -1)
        {
            value *= 1.25;
        }
        else if (unit.indexOf("pc") !== -1)
        {
            value *= 15;
        }
        else if (unit.indexOf("cm") !== -1)
        {
            value *= (96.0 / 2.54);
        }
        else if (unit.indexOf("mm") !== -1)
        {
            value *= (96.0 / 25.4);
        }
        else if (unit.indexOf("in") !== -1)
        {
            value *= 96.0;
        }

        return value;
    }

    function parseSVG(e, idMap)
    {
        var type = e.tagName;
        if (!type ||
            type === "title" ||
            type === "metadata" ||
            type === "sodipodi:namedview" ||
            type === "desc")
        {
            return null;
        }

        if (type === "defs")
        {
            parseDefinitions(e, idMap);
            return null;
        }
        else if (type === "text")
        {
            // TODO
            return null;
        }

        // create node
        var node : any = {};
        var n;

        var attributes = e.attributes;
        if (attributes)
        {
            buildAttributesMap(attributes, node);
        }

        var id = node.id;
        if (id)
        {
            idMap[id] = node;
        }

        // Process style
        var fillStyle, strokeStyle, strokeWidthStyle;

        var style = node.style;
        if (style)
        {
            delete node.style;

            style = style.replace(/\s+/g, '');

            var fillIndex = style.indexOf('fill:');
            if (fillIndex !== -1)
            {
                var endFill = style.indexOf(';', fillIndex);
                if (endFill === -1)
                {
                    endFill = style.length;
                }

                fillStyle = style.slice(fillIndex + 5, endFill);
            }

            var strokeIndex = style.indexOf('stroke:');
            if (strokeIndex !== -1)
            {
                var endStroke = style.indexOf(';', strokeIndex);
                if (endStroke === -1)
                {
                    endStroke = style.length;
                }

                strokeStyle = style.slice(strokeIndex + 7, endStroke);
            }

            var strokeWidthIndex = style.indexOf('stroke-width:');
            if (strokeWidthIndex !== -1)
            {
                var endStrokeWidth = style.indexOf(';', strokeWidthIndex);
                if (endStrokeWidth === -1)
                {
                    endStrokeWidth = style.length;
                }

                strokeWidthStyle = style.slice(strokeWidthIndex + 13, endStrokeWidth);
            }
        }

        if (node.fill)
        {
            fillStyle = node.fill.replace(/\s+/g, '');
            delete node.fill;
        }

        if (node.stroke)
        {
            strokeStyle = node.stroke;
            delete node.stroke;
        }

        if (node['stroke-width'])
        {
            strokeWidthStyle = node['stroke-width'];
            delete node['stroke-width'];
        }

        if (fillStyle)
        {
            fillStyle = checkStyle(fillStyle, idMap);
        }

        if (strokeStyle)
        {
            strokeStyle = checkStyle(strokeStyle, idMap);
        }

        var lineWidth;
        if (strokeWidthStyle)
        {
            lineWidth = parseUnitValue(strokeWidthStyle);
        }

        // Convert transform
        var transformArray;
        var transform = node.transform;
        if (transform)
        {
            delete node.transform;

            transformArray = [];

            var parametersIndex = transform.indexOf('(');
            while (parametersIndex !== -1)
            {
                var parametersEndIndex = transform.indexOf(')', (parametersIndex + 1));
                var parameters = transform.slice(parametersIndex + 1, parametersEndIndex);
                if (-1 !== parameters.indexOf(','))
                {
                    parameters = parameters.split(',');
                }
                else
                {
                    parameters = parameters.split(' ');
                }

                var command = transform.slice(0, parametersIndex).replace(/\s+/g, '');
                switch (command)
                {
                case 'translate':
                    var tx = parseFloat(parameters[0]);
                    var ty = (parameters.length > 1 ? parseFloat(parameters[1]) : 0);
                    transformArray.push(['translate',
                                         <string><any>[tx, ty]]);
                    break;

                case 'scale':
                    var sx = parseFloat(parameters[0]);
                    var sy = (parameters.length > 1 ? parseFloat(parameters[1]) : sx);
                    transformArray.push(['scale',
                                         <string><any>[sx, sy]]);
                    break;

                case 'rotate':
                    var angle = parseFloat(parameters[0]) * (Math.PI / 180);
                    var cx = (parameters.length > 1 ? parseFloat(parameters[1]) : 0);
                    var cy = (parameters.length > 2 ? parseFloat(parameters[2]) : cx);
                    transformArray.push(['rotate',
                                         <string><any>[angle, cx, cy]]);
                    break;

                case 'matrix':
                    var m0 = parseFloat(parameters[0]);
                    var m1 = parseFloat(parameters[1]);
                    var m2 = parseFloat(parameters[2]);
                    var m3 = parseFloat(parameters[3]);
                    var m4 = parseFloat(parameters[4]);
                    var m5 = parseFloat(parameters[5]);
                    transformArray.push(['transform',
                                         <string><any>[m0, m1, m2, m3, m4, m5]]);
                    break;

                default:
                    break;
                }

                var nextCommand = (parametersEndIndex + 1);
                if (nextCommand >= transform.length)
                {
                    break;
                }

                if (transform[nextCommand] === ',')
                {
                    nextCommand += 1;
                }

                transform = transform.slice(nextCommand);
                parametersIndex = transform.indexOf('(');
            }
        }

        // Convert shape parameters
        var draw = drawSVGempty;

        function parseOptionalFloat(value)
        {
            if (value !== undefined)
            {
                return parseFloat(value);
            }
            else
            {
                return 0;
            }
        }

        if (type === "path")
        {
            draw = drawSVGpath;

            var d = node.d;
            if (d)
            {
                node.d = d.replace(',', ' ').replace(/\s+/g, ' ').replace(' -', '-').replace(/\s([AaCcHhLlMmQqSsTtVvZz])/g, "$1");
            }
        }
        else if (type === "polygon" ||
                 type === "polyline")
        {
            if (type === "polygon")
            {
                draw = drawSVGpolygon;
            }
            else
            {
                draw = drawSVGpolyline;
            }

            var points = node.points;
            if (points)
            {
                points = points.replace(/\s+/g, ',').split(',');
                var numPoints = points.length;
                for (n = 0; n < numPoints; n += 1)
                {
                    points[n] = parseFloat(points[n]);
                }
                node.points = points;
            }
        }
        else if (type === "rect")
        {
            draw = drawSVGrect;

            node.x = parseOptionalFloat(node.x);
            node.y = parseOptionalFloat(node.y);
            node.width = parseFloat(node.width);
            node.height = parseFloat(node.height);
        }
        else if (type === "circle")
        {
            draw = drawSVGcircle;

            node.cx = parseOptionalFloat(node.cx);
            node.cy = parseOptionalFloat(node.cy);
            node.r = parseFloat(node.r);
        }
        else if (type === "ellipse")
        {
            draw = drawSVGellipse;

            node.cx = parseOptionalFloat(node.cx);
            node.cy = parseOptionalFloat(node.cy);
            node.rx = parseFloat(node.rx);
            node.ry = parseFloat(node.ry);
        }
        else if (type === "line")
        {
            draw = drawSVGline;

            node.x1 = parseOptionalFloat(node.x1);
            node.y1 = parseOptionalFloat(node.y1);
            node.x2 = parseOptionalFloat(node.x2);
            node.y2 = parseOptionalFloat(node.y2);
        }

        // parse children
        var children = [], child;

        var childNodes = e.children;
        if (childNodes)
        {
            var numChildren = childNodes.length;
            for (n = 0; n < numChildren; n += 1)
            {
                child = parseSVG(childNodes[n], idMap);
                if (child)
                {
                    children[children.length] = child;
                }
            }
        }
        else
        {
            var childNode = e.firstChild;
            while (childNode)
            {
                child = parseSVG(childNode, idMap);
                if (child)
                {
                    children[children.length] = child;
                }
                childNode = childNode.nextSibling;
            }
        }

        if (children.length !== 0)
        {
            node.children = children;
        }

        node.type = type;
        node.draw = draw;

        var hasState = (transform ||
                        fillStyle ||
                        strokeStyle ||
                        strokeWidthStyle);
        if (hasState)
        {
            node.hasState = hasState;
            node.transform = transformArray;
            node.fill = fillStyle;
            node.stroke = strokeStyle;
            node.lineWidth = lineWidth;
        }

        return node;
    }

    function drawSVGnode(node, ctx)
    {
        if (node.hasState)
        {
            ctx.save();

            var transform = node.transform;
            if (transform)
            {
                var numTransforms = transform.length;
                for (var t = 0; t < numTransforms; t += 1)
                {
                    var tr = transform[t];
                    var command = tr[0];
                    var arg = tr[1];
                    var ax, ay;
                    switch (command)
                    {
                    case 'translate':
                        ax = arg[0];
                        ay = arg[1];
                        if (ax !== 0 || ay !== 0)
                        {
                            ctx.translate(ax, ay);
                        }
                        break;

                    case 'scale':
                        ax = arg[0];
                        ay = arg[1];
                        if (ax !== 1 || ay !== 1)
                        {
                            ctx.scale(ax, ay);
                        }
                        break;

                    case 'rotate':
                        var angle = arg[0];
                        ax = arg[1];
                        ay = arg[2];
                        if (angle !== 0)
                        {
                            if (ax !== 0 || ay !== 0)
                            {
                                ctx.translate(ax, ay);
                                ctx.rotate(angle);
                                ctx.translate(-ax, -ay);
                            }
                            else
                            {
                                ctx.rotate(angle);
                            }
                        }
                        break;

                    case 'transform':
                        ctx.transform(arg[0], arg[1], arg[2],
                                      arg[3], arg[4], arg[5]);
                        break;

                    default:
                        break;
                    }
                }
            }

            var fill = node.fill;
            if (fill)
            {
                ctx.fillStyle = fill;
            }

            var stroke = node.stroke;
            if (stroke)
            {
                ctx.strokeStyle = stroke;
            }

            var lineWidth = node.lineWidth;
            if (lineWidth)
            {
                ctx.lineWidth = lineWidth;
            }
        }

        node.draw(ctx);

        var children = node.children;
        if (children)
        {
            var numChildren = children.length;
            for (var n = 0; n < numChildren; n += 1)
            {
                drawSVGnode(children[n], ctx);
            }
        }

        if (node.hasState)
        {
            ctx.restore();
        }
    }

    function loadSVGfile(url)
    {
        svg = null;

        if (url.slice(url.length - 4).toLowerCase() !== '.svg')
        {
            window.alert('"' + url + '" is not a SVG file.');
            return;
        }

        var xhr;
        if (window.XMLHttpRequest)
        {
            xhr = new window.XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }
        else
        {
            errorCallback("No XMLHTTPRequest object could be created");
            return;
        }

        function httpRequestCallback()
        {
            if (xhr.readyState === 4 && !TurbulenzEngine.isUnloading()) /* 4 == complete */
            {
                if (xhr.status === 200 || xhr.status === 0)
                {
                    var responseXML = xhr.responseXML;
                    if (responseXML)
                    {
                        var loadedSVG;
                        if (responseXML.documentElement)
                        {
                            loadedSVG = responseXML.documentElement;
                        }
                        else if (responseXML.getElementsByTagName)
                        {
                            loadedSVG = responseXML.getElementsByTagName("svg")[0];
                        }
                        else
                        {
                            window.alert('The SVG MIME type is not supported by this browser');
                        }

                        if (loadedSVG)
                        {
                            var idMap = {};

                            svg = parseSVG(loadedSVG, idMap);

                            svg.idMap = idMap;

                            svg.findById = function findByIdFn(id)
                            {
                                return this.idMap[id];
                            };

                            var width, height;

                            if (svg.width && svg.height)
                            {
                                width = parseUnitValue(svg.width);
                                height = parseUnitValue(svg.height);
                                scaleCanvas = false;
                            }
                            else if (loadedSVG.viewBox &&
                                     loadedSVG.viewBox.baseVal &&
                                     loadedSVG.viewBox.baseVal.width &&
                                     loadedSVG.viewBox.baseVal.height)
                            {
                                width = loadedSVG.viewBox.baseVal.width;
                                height = loadedSVG.viewBox.baseVal.height;
                                scaleCanvas = false;
                            }
                            else
                            {
                                width = graphicsDevice.width;
                                height = graphicsDevice.height;
                                scaleCanvas = true;
                            }

                            canvas.width = width;
                            canvas.height = height;
                        }
                    }
                }
                else
                {
                    window.alert('"' + url + '" not found.');
                }

                xhr.onreadystatechange = null;
                xhr = null;
            }
        }

        xhr.open("GET", url, true);
        xhr.onreadystatechange = httpRequestCallback;
        xhr.send();
    }

    // Create game session and load textures
    var initialSVGfile = "img/lion.svg";
    loadSVGfile(initialSVGfile);

    // Create canvas object
    canvas = Canvas.create(graphicsDevice, mathDevice);

    ctx = canvas.getContext('2d');

    // Load new SVG file
    var fileInputElement = <HTMLInputElement>
        document.getElementById("svgfileinput");
    if (fileInputElement)
    {
        fileInputElement.value = initialSVGfile;
    }

    var loadFileInputElement = document.getElementById("buttonloadsvgfile");
    if (loadFileInputElement)
    {
        loadFileInputElement.onclick = function ()
        {
            if (fileInputElement)
            {
                loadSVGfile(fileInputElement.value);
            }
        };
        loadFileInputElement = null;
    }

    // Set the initial previous frametime for the first loop
    var previousFrameTime = TurbulenzEngine.time;
    var fpsElement = document.getElementById("fpscounter");
    var currentFPS = "0", lastFPS = "0";

    //
    // Update: Should update the input, physics, sound and other js libraries used.
    //         The function should then trigger the rendering using the graphicsDevice
    //
    function update()
    {
        // Gets the currentTime to be used in calculations for this frame
        var currentTime = TurbulenzEngine.time;

        // Render the color
        if (graphicsDevice.beginFrame())
        {
            var viewPort;

            if (!scaleCanvas)
            {
                var canvasWidth = canvas.width;
                var canvasHeight = canvas.height;

                var deviceWidth = graphicsDevice.width;
                var deviceHeight = graphicsDevice.height;

                if (canvasWidth !== deviceWidth ||
                    canvasHeight !== deviceHeight)
                {
                    graphicsDevice.clear([0.57, 0.57, 0.57, 1]);

                    viewPort = [0, deviceHeight - canvasHeight, canvasWidth, canvasHeight];
                }
            }

            ctx.beginFrame(graphicsDevice, viewPort);

            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            if (svg)
            {
                ctx.save();
                ctx.fillStyle = '#000';
                ctx.strokeStyle = 'none';
                try
                {
                    drawSVGnode(svg, ctx);
                }
                catch (exc)
                {
                    console.log(exc);
                }
                ctx.restore();
            }

            ctx.endFrame();

            graphicsDevice.endFrame();

            currentFPS = (graphicsDevice.fps).toFixed(2);
            if (lastFPS !== currentFPS)
            {
                lastFPS = currentFPS;

                if (fpsElement)
                {
                    fpsElement.innerHTML = currentFPS + ' fps';
                }
            }
        }

        previousFrameTime = currentTime;
    }

    var intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);

    TurbulenzEngine.onunload = function destroyScene()
    {
        // Clear the interval to stop update from being called
        TurbulenzEngine.clearInterval(intervalID);

        // Clear any references to memory
        ctx = null;
        canvas = null;

        fpsElement = null;

        // Tell the Turbulenz Engine to force the js virtual machine
        // to free as much memory as possible
        TurbulenzEngine.flush();

        // Clear each native engine reference
        graphicsDevice = null;
        mathDevice = null;

        TurbulenzEngine.onunload = null;
    };
};
