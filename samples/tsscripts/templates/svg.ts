/*{# Copyright (c) 2011-2013 Turbulenz Limited #}*/

/*
 * @title: Scalable vector graphics
 * @description:
 * This sample shows a more complex usage of the Canvas 2D API by manually rendering SVG images.
*/

/*{# Import additional JS files here #}*/

/*{{ javascript("jslib/canvas.js") }}*/
/*{{ javascript("jslib/svg.js") }}*/

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
    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    // This sample only works on the local development server so we harcode the assets path
    var assetPrefix = '/play/samples/';

    var canvas, ctx;
    var svg: SVGNode;
    var zoom = 1;

    var zoomElement = document.getElementById('zoom');
    if (zoomElement)
    {
        function zoomChanged()
        {
            zoom = parseFloat(this.options[this.selectedIndex].value);
        }
        zoomElement.onchange = zoomChanged;
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
        var nodeParams: any = {};
        var n;

        var attributes = e.attributes;
        if (attributes)
        {
            buildAttributesMap(attributes, nodeParams);
        }

        // Convert shape parameters
        var svgNode: SVGNode;
        if (type === "path")
        {
            var d = nodeParams.d;
            if (d)
            {
                d = d.replace(',', ' ').replace(/\s+/g, ' ').replace(' -', '-').replace(/\s([AaCcHhLlMmQqSsTtVvZz])/g, "$1");
                svgNode = new SVGPathNode(d);
            }
        }
        else if (type === "polygon" ||
                 type === "polyline")
        {
            var points = nodeParams.points;
            if (points)
            {
                points = points.replace(/\s+/g, ',').split(',');
                var numPoints = points.length;
                for (n = 0; n < numPoints; n += 1)
                {
                    points[n] = parseFloat(points[n]);
                }

                if (type === "polygon")
                {
                    svgNode = new SVGPolygonNode(points);
                }
                else
                {
                    svgNode = new SVGPolylineNode(points);
                }
            }
        }
        else if (type === "rect")
        {
            svgNode = new SVGRectNode(parseOptionalFloat(nodeParams.x),
                                      parseOptionalFloat(nodeParams.y),
                                      parseFloat(nodeParams.width),
                                      parseFloat(nodeParams.height));
        }
        else if (type === "circle")
        {
            svgNode = new SVGCircleNode(parseOptionalFloat(nodeParams.cx),
                                        parseOptionalFloat(nodeParams.cy),
                                        parseFloat(nodeParams.r));
        }
        else if (type === "ellipse")
        {
            svgNode = new SVGEllipseNode(parseOptionalFloat(nodeParams.cx),
                                         parseOptionalFloat(nodeParams.cy),
                                         parseFloat(nodeParams.rx),
                                         parseFloat(nodeParams.ry));
        }
        else if (type === "line")
        {
            svgNode = new SVGLineNode(parseOptionalFloat(nodeParams.x1),
                                      parseOptionalFloat(nodeParams.y1),
                                      parseOptionalFloat(nodeParams.x2),
                                      parseOptionalFloat(nodeParams.y2));
        }

        if (!svgNode)
        {
            svgNode = new SVGEmptyNode();
        }

        var id = nodeParams.id;
        if (id)
        {
            idMap[id] = nodeParams;
        }

        // Process style
        var fillStyle, strokeStyle, strokeWidthStyle;

        var style = nodeParams.style;
        if (style)
        {
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

        if (nodeParams.fill)
        {
            fillStyle = nodeParams.fill.replace(/\s+/g, '');
        }

        if (nodeParams.stroke)
        {
            strokeStyle = nodeParams.stroke;
        }

        if (nodeParams['stroke-width'])
        {
            strokeWidthStyle = nodeParams['stroke-width'];
        }

        if (fillStyle)
        {
            fillStyle = checkStyle(fillStyle, idMap);
            svgNode.setFillStyle(fillStyle);
        }

        if (strokeStyle)
        {
            strokeStyle = checkStyle(strokeStyle, idMap);
            svgNode.setStrokeStyle(strokeStyle);
        }

        if (strokeWidthStyle)
        {
            strokeWidthStyle = parseUnitValue(strokeWidthStyle);
            svgNode.setLineWidth(strokeWidthStyle);
        }

        // Convert transform
        var transform = nodeParams.transform;
        if (transform)
        {
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
                    svgNode.translate(tx, ty);
                    break;

                case 'scale':
                    var sx = parseFloat(parameters[0]);
                    var sy = (parameters.length > 1 ? parseFloat(parameters[1]) : sx);
                    svgNode.scale(sx, sy);
                    break;

                case 'rotate':
                    var angle = parseFloat(parameters[0]) * (Math.PI / 180);
                    var cx = (parameters.length > 1 ? parseFloat(parameters[1]) : 0);
                    var cy = (parameters.length > 2 ? parseFloat(parameters[2]) : cx);
                    svgNode.rotate(angle, cx, cy);
                    break;

                case 'matrix':
                    var m0 = parseFloat(parameters[0]);
                    var m1 = parseFloat(parameters[1]);
                    var m2 = parseFloat(parameters[2]);
                    var m3 = parseFloat(parameters[3]);
                    var m4 = parseFloat(parameters[4]);
                    var m5 = parseFloat(parameters[5]);
                    svgNode.transform(m0, m1, m2, m3, m4, m5);
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

        // parse children
        var addedChildren = 0;
        var child;
        var childNodes = e.children;
        if (childNodes)
        {
            var numChildren = childNodes.length;
            for (n = 0; n < numChildren; n += 1)
            {
                child = parseSVG(childNodes[n], idMap);
                if (child)
                {
                    svgNode.addChild(child);
                    addedChildren += 1;
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
                    svgNode.addChild(child);
                    addedChildren += 1;
                }
                childNode = childNode.nextSibling;
            }
        }

        if (addedChildren === 0 &&
            svgNode instanceof SVGEmptyNode)
        {
            return null;
        }

        return svgNode;
    }

    function parseBaseVal(baseVal)
    {
        if (baseVal.valueAsString.indexOf('%') !== -1)
        {
            return 0;
        }
        return baseVal.value
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

                            var width = 0, height = 0;

                            if (loadedSVG.width && loadedSVG.width.baseVal &&
                                loadedSVG.height && loadedSVG.height.baseVal)
                            {
                                width = parseBaseVal(loadedSVG.width.baseVal);
                                height = parseBaseVal(loadedSVG.height.baseVal);
                            }
                            else if (loadedSVG.viewBox &&
                                     loadedSVG.viewBox.baseVal)
                            {
                                width = loadedSVG.viewBox.baseVal.width;
                                height = loadedSVG.viewBox.baseVal.height;
                            }

                            if (!width || !height)
                            {
                                width = graphicsDevice.width;
                                height = graphicsDevice.height;
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

        xhr.open("GET", assetPrefix + url, true);
        xhr.onreadystatechange = httpRequestCallback;
        xhr.send();
    }

    // Load SVG file
    var initialSVGfile = "img/lion.svg";
    loadSVGfile(initialSVGfile);

    // Create canvas object
    canvas = Canvas.create(graphicsDevice);

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
    var viewPort = [0, 0, 0, 0];
    var clearColor = [0.57, 0.57, 0.57, 1];

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
            var deviceWidth = graphicsDevice.width;
            var deviceHeight = graphicsDevice.height;

            var canvasWidth = (zoom * canvas.width);
            var canvasHeight = (zoom * canvas.height);

            viewPort[0] = 0;
            viewPort[1] = (deviceHeight - canvasHeight);
            viewPort[2] = canvasWidth;
            viewPort[3] = canvasHeight;

            if (canvasWidth < deviceWidth ||
                canvasHeight < deviceHeight)
            {
                graphicsDevice.clear(clearColor);
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
                    svg.draw(ctx);
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

        TurbulenzEngine.onunload = null;
    };
};
