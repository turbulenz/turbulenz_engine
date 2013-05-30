// Copyright (c) 2011-2013 Turbulenz Limited

// Workaround:

/// <reference path="turbulenz.d.ts" />
/// <reference path="fontmanager.ts" />

// This code relies on the fact that the plugin implements
// a 'toBase64' method on arrays.

interface CanvasPluginArray
{
    toBase64(): string;
};

// -----------------------------------------------------------------------------

interface CanvasImageData
{
    width: number;
    height: number;
    data: any;
};

interface CanvasLinearGradient
{
    x0              : number;
    y0              : number;
    x1              : number;
    y1              : number;
    width           : number;
    height          : number;
    stops           : any[][];

    matrix          : any; // m33?

    numTextureStops : number;
    texture         : Texture;

    opaque          : bool;
};
declare var CanvasLinearGradient :
{
    new(): CanvasLinearGradient;
    prototype: any;
    create(x0: number, y0: number,
           x1: number, y1: number): CanvasLinearGradient;
};

interface CanvasRadialGradient
{
    x0              : number;
    y0              : number;
    r0              : number;
    x1              : number;
    y1              : number;
    r1              : number;
    minX            : number;
    minY            : number;
    stops           : any[][];
    width           : number;
    height          : number;
    matrix          : any; // m33?
    numTextureStops : number;
    texture         : Texture;
    opaque          : bool;
};
declare var CanvasRadialGradient :
{
    new(): CanvasRadialGradient;
    prototype: any;
    create(x0: number, y0: number, r0: number, x1: number, y1: number,
           r1: number): CanvasRadialGradient;
};

// -----------------------------------------------------------------------------

var namedCSSColor = {
    aliceblue : "#f0f8ff",
    antiquewhite : "#faebd7",
    aqua : "#00ffff",
    aquamarine : "#7fffd4",
    azure : "#f0ffff",
    beige : "#f5f5dc",
    bisque : "#ffe4c4",
    black : "#000000",
    blanchedalmond : "#ffebcd",
    blue : "#0000ff",
    blueviolet : "#8a2be2",
    brown : "#a52a2a",
    burlywood : "#deb887",
    cadetblue : "#5f9ea0",
    chartreuse : "#7fff00",
    chocolate : "#d2691e",
    coral : "#ff7f50",
    cornflowerblue : "#6495ed",
    cornsilk : "#fff8dc",
    crimson : "#dc143c",
    cyan : "#00ffff",
    darkblue : "#00008b",
    darkcyan : "#008b8b",
    darkgoldenrod : "#b8860b",
    darkgray : "#a9a9a9",
    darkgrey : "#a9a9a9",
    darkgreen : "#006400",
    darkkhaki : "#bdb76b",
    darkmagenta : "#8b008b",
    darkolivegreen : "#556b2f",
    darkorange : "#ff8c00",
    darkorchid : "#9932cc",
    darkred : "#8b0000",
    darksalmon : "#e9967a",
    darkseagreen : "#8fbc8f",
    darkslateblue : "#483d8b",
    darkslategray : "#2f4f4f",
    darkslategrey : "#2f4f4f",
    darkturquoise : "#00ced1",
    darkviolet : "#9400d3",
    deeppink : "#ff1493",
    deepskyblue : "#00bfff",
    dimgray : "#696969",
    dimgrey : "#696969",
    dodgerblue : "#1e90ff",
    firebrick : "#b22222",
    floralwhite : "#fffaf0",
    forestgreen : "#228b22",
    fuchsia : "#ff00ff",
    gainsboro : "#dcdcdc",
    ghostwhite : "#f8f8ff",
    gold : "#ffd700",
    goldenrod : "#daa520",
    gray : "#808080",
    grey : "#808080",
    green : "#008000",
    greenyellow : "#adff2f",
    honeydew : "#f0fff0",
    hotpink : "#ff69b4",
    indianred : "#cd5c5c",
    indigo : "#4b0082",
    ivory : "#fffff0",
    khaki : "#f0e68c",
    lavender : "#e6e6fa",
    lavenderblush : "#fff0f5",
    lawngreen : "#7cfc00",
    lemonchiffon : "#fffacd",
    lightblue : "#add8e6",
    lightcoral : "#f08080",
    lightcyan : "#e0ffff",
    lightgoldenrodyellow : "#fafad2",
    lightgray : "#d3d3d3",
    lightgrey : "#d3d3d3",
    lightgreen : "#90ee90",
    lightpink : "#ffb6c1",
    lightsalmon : "#ffa07a",
    lightseagreen : "#20b2aa",
    lightskyblue : "#87cefa",
    lightslategray : "#778899",
    lightslategrey : "#778899",
    lightsteelblue : "#b0c4de",
    lightyellow : "#ffffe0",
    lime : "#00ff00",
    limegreen : "#32cd32",
    linen : "#faf0e6",
    magenta : "#ff00ff",
    maroon : "#800000",
    mediumaquamarine : "#66cdaa",
    mediumblue : "#0000cd",
    mediumorchid : "#ba55d3",
    mediumpurple : "#9370d8",
    mediumseagreen : "#3cb371",
    mediumslateblue : "#7b68ee",
    mediumspringgreen : "#00fa9a",
    mediumturquoise : "#48d1cc",
    mediumvioletred : "#c71585",
    midnightblue : "#191970",
    mintcream : "#f5fffa",
    mistyrose : "#ffe4e1",
    moccasin : "#ffe4b5",
    navajowhite : "#ffdead",
    navy : "#000080",
    oldlace : "#fdf5e6",
    olive : "#808000",
    olivedrab : "#6b8e23",
    orange : "#ffa500",
    orangered : "#ff4500",
    orchid : "#da70d6",
    palegoldenrod : "#eee8aa",
    palegreen : "#98fb98",
    paleturquoise : "#afeeee",
    palevioletred : "#d87093",
    papayawhip : "#ffefd5",
    peachpuff : "#ffdab9",
    peru : "#cd853f",
    pink : "#ffc0cb",
    plum : "#dda0dd",
    powderblue : "#b0e0e6",
    purple : "#800080",
    red : "#ff0000",
    rosybrown : "#bc8f8f",
    royalblue : "#4169e1",
    saddlebrown : "#8b4513",
    salmon : "#fa8072",
    sandybrown : "#f4a460",
    seagreen : "#2e8b57",
    seashell : "#fff5ee",
    sienna : "#a0522d",
    silver : "#c0c0c0",
    skyblue : "#87ceeb",
    slateblue : "#6a5acd",
    slategray : "#708090",
    slategrey : "#708090",
    snow : "#fffafa",
    springgreen : "#00ff7f",
    steelblue : "#4682b4",
    tan : "#d2b48c",
    teal : "#008080",
    thistle : "#d8bfd8",
    tomato : "#ff6347",
    turquoise : "#40e0d0",
    violet : "#ee82ee",
    wheat : "#f5deb3",
    white : "#ffffff",
    whitesmoke : "#f5f5f5",
    yellow : "#ffff00",
    yellowgreen : "#9acd32"
};

var parseCSSColor = function parseCSSColorFn(text, color) : number[]
{
    var readInt = parseInt;
    var components;

    text = text.replace(/ /g, '').toLowerCase();

    text = (namedCSSColor[text] || text);

    if (text[0] === '#')
    {
        text = text.substr(1, 6);

        var numChars = text.length;
        if (numChars === 6)
        {
            components = /^(\w{2})(\w{2})(\w{2})$/.exec(text);
            if (components)
            {
                color[0] = (readInt(components[1], 16) / 255);
                color[1] = (readInt(components[2], 16) / 255);
                color[2] = (readInt(components[3], 16) / 255);
                color[3] = 1.0;
                return color;
            }
        }
        else if (numChars === 3)
        {
            components = /^(\w{1})(\w{1})(\w{1})$/.exec(text);
            if (components)
            {
                color[0] = (readInt(components[1], 16) / 15);
                color[1] = (readInt(components[2], 16) / 15);
                color[2] = (readInt(components[3], 16) / 15);
                color[3] = 1.0;
                return color;
            }
        }
    }
    else
    {
        var color_type = text.substr(0, 4);
        if (color_type === 'rgba')
        {
            components = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*\.?\d+)\)$/.exec(text);
            if (components)
            {
                color[0] = readInt(components[1], 10) / 255;
                color[1] = readInt(components[2], 10) / 255;
                color[2] = readInt(components[3], 10) / 255;
                color[3] = parseFloat(components[4]);
                return color;
            }
        }
        else if (color_type === 'rgb(')
        {
            components = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.exec(text);
            if (components)
            {
                color[0] = readInt(components[1], 10) / 255;
                color[1] = readInt(components[2], 10) / 255;
                color[2] = readInt(components[3], 10) / 255;
                color[3] = 1.0;
                return color;
            }
        }
        else
        {
            if (color_type === 'hsla')
            {
                components = /^hsla\((\d{1,3}),\s*(\d{1,3})\%,\s*(\d{1,3})\%,\s*(\d*\.?\d+)\)$/.exec(text);
                if (components)
                {
                    color[3] = parseFloat(components[4]);
                }
            }
            else if (color_type === 'hsl(')
            {
                components = /^hsl\((\d{1,3}),\s*(\d{1,3})\%,\s*(\d{1,3})\%\)$/.exec(text);
                if (components)
                {
                    color[3] = 1.0;
                }
            }

            if (components)
            {
                var hue = readInt(components[1], 10) / 360;
                var saturation = readInt(components[2], 10) / 100;
                var lightness = readInt(components[3], 10) / 100;
                if (saturation === 0)
                {
                    color[0] = lightness;
                    color[1] = lightness;
                    color[2] = lightness;
                }
                else
                {
                    var m1, m2;
                    if (lightness < 0.5)
                    {
                        m2 = (lightness * (saturation + 1));
                    }
                    else
                    {
                        m2 = ((lightness + saturation) - (lightness * saturation));
                    }
                    m1 = ((lightness * 2) - m2);

                    var hueToRgb = function hueToRgbFn(m1, m2, hue)
                    {
                        if (hue < 0)
                        {
                            hue += 1;
                        }
                        else if (hue > 1)
                        {
                            hue -= 1;
                        }

                        if ((6 * hue) < 1)
                        {
                            return (m1 + ((m2 - m1) * (hue * 6)));
                        }
                        else if ((2 * hue) < 1)
                        {
                            return m2;
                        }
                        else if ((3 * hue) < 2)
                        {
                            return (m1 + ((m2 - m1) * ((2 / 3) - hue) * 6));
                        }
                        else
                        {
                            return m1;
                        }
                    };

                    color[0] = hueToRgb(m1, m2, (hue + (1 / 3)));
                    color[1] = hueToRgb(m1, m2, hue);
                    color[2] = hueToRgb(m1, m2, (hue - (1 / 3)));
                }
                return color;
            }
        }
    }

    return undefined;
}

//
// CanvasLinearGradient
//
function CanvasLinearGradient() { return this; }
CanvasLinearGradient.prototype =
{
    version : 1,

    // Public API
    addColorStop : function addLinearColorStopFn(offset, color)
    {
        if (offset < 0 || offset > 1)
        {
            throw 'INDEX_SIZE_ERR';
        }

        function sortfunction(a, b)
        {
            return (a[0] - b[0]);
        }

        var stops = this.stops;
        var numStops = stops.length;

        var parsedColor = parseCSSColor(color, []);

        if (parsedColor[3] < 1.0)
        {
            this.opaque = false;
        }

        parsedColor[0] = parsedColor[0] * 255;
        parsedColor[1] = parsedColor[1] * 255;
        parsedColor[2] = parsedColor[2] * 255;
        parsedColor[3] = parsedColor[3] * 255;
        stops[numStops] = [offset, parsedColor];
        numStops += 1;
        if (numStops > 1)
        {
            stops.sort(sortfunction);
        }
    },

    // Private API
    updateTexture : function updateLinearTextureFn(gd)
    {
        var texture = this.texture;
        var stops = this.stops;
        var numStops = stops.length;
        if (this.numTextureStops !== numStops)
        {
            this.numTextureStops = numStops;

            var width = this.width;
            var height = this.height;

            if (!texture)
            {
                this.texture = texture = gd.createTexture({
                    name    : ('linear:' + width + 'x' + height),
                    width   : width,
                    height  : height,
                    depth   : 1,
                    format  : gd.PIXELFORMAT_R8G8B8A8,
                    cubemap : false,
                    mipmaps : false
                });
            }

            var opaque = this.opaque;

            var lx = (this.x1 - this.x0);
            var ly = (this.y1 - this.y0);
            var ln = ((lx * lx) + (ly * ly));
            if (ln === 0)
            {
                ln = 1;
            }
            else
            {
                ln = (1.0 / Math.sqrt(ln));
            }

            lx *= ln;
            ly *= ln;

            var dx = (lx / (width > 1 ? (width - 1) : 1));
            var dy = (ly / (height > 1 ? (height - 1) : 1));

            var numValues = (width * height * 4);
            var pixelData = new Array(numValues);
            var p = 0;
            var vy = 0;
            for (var y = 0; y < height; y += 1, vy += dy)
            {
                var vyly = (vy * ly);
                var vx = 0;

                for (var x = 0; x < width; x += 1, p += 4, vx += dx)
                {
                    var s = ((vx * lx) + vyly);

                    var currentStop = stops[0];
                    var currentOffset = currentStop[0];
                    var currentColor = currentStop[1];
                    var lastOffset = currentOffset;
                    var lastColor = currentColor;

                    if (s > currentOffset)
                    {
                        for (var ns = 1; ns < numStops; ns += 1)
                        {
                            currentStop = stops[ns];
                            currentOffset = currentStop[0];
                            currentColor = currentStop[1];
                            if (s <= currentOffset)
                            {
                                break;
                            }
                            lastOffset = currentOffset;
                            lastColor = currentColor;
                        }
                    }

                    var da = (currentOffset - lastOffset);
                    if (da <= 0 || s === currentOffset)
                    {
                        pixelData[p] = currentColor[0];
                        pixelData[p + 1] = currentColor[1];
                        pixelData[p + 2] = currentColor[2];
                        if (opaque)
                        {
                            pixelData[p + 3] = 255;
                        }
                        else
                        {
                            pixelData[p + 3] = currentColor[3];
                        }
                    }
                    else
                    {
                        var a = (s - lastOffset) / da;
                        if (a < 0.996)
                        {
                            var inva = (1.0 - a);
                            pixelData[p] = ((currentColor[0] * a) + (lastColor[0] * inva));
                            pixelData[p + 1] = ((currentColor[1] * a) + (lastColor[1] * inva));
                            pixelData[p + 2] = ((currentColor[2] * a) + (lastColor[2] * inva));
                            if (opaque)
                            {
                                pixelData[p + 3] = 255;
                            }
                            else
                            {
                                pixelData[p + 3] = ((currentColor[3] * a) + (lastColor[3] * inva));
                            }
                        }
                        else
                        {
                            pixelData[p] = currentColor[0];
                            pixelData[p + 1] = currentColor[1];
                            pixelData[p + 2] = currentColor[2];
                            if (opaque)
                            {
                                pixelData[p + 3] = 255;
                            }
                            else
                            {
                                pixelData[p + 3] = currentColor[3];
                            }
                        }
                    }
                }
            }

            texture.setData(pixelData);
        }
        return texture;
    }
};

// Constructor function
CanvasLinearGradient.create = function canvasLinearGradientCreateFn(x0, y0, x1, y1)
{
    var dx = (x1 - x0);
    var dy = (y1 - y0);
    var width = Math.abs(dx);
    var height = Math.abs(dy);
    if (width === 0 && height === 0)
    {
        return null;
    }

    // We need minimmal dimensions for minimal quality
    while (width < 16 && height < 16)
    {
        width *= 16;
        height *= 16;
    }

    if (width < 1)
    {
        width = 1;
    }
    else
    {
        width = Math.floor(width);
    }

    if (height < 1)
    {
        height = 1;
    }
    else
    {
        height = Math.floor(height);
    }

    var c = new CanvasLinearGradient();
    c.x0 = x0;
    c.y0 = y0;
    c.x1 = x1;
    c.y1 = y1;
    c.width = width;
    c.height = height;
    c.stops = [];

    var idx = (1.0 / dx);
    var idy = (1.0 / dy);
    c.matrix = [idx, 0, -x0 * idx,
                0, idy, -y0 * idy];

    c.numTextureStops = 0;
    c.texture = null;

    c.opaque = true;

    return c;
};

//
// CanvasRadialGradient
//
function CanvasRadialGradient() { return this; }
CanvasRadialGradient.prototype =
{
    version : 1,

    // Public API
    addColorStop : function addRadialColorStopFn(offset, color)
    {
        if (offset < 0 || offset > 1)
        {
            throw 'INDEX_SIZE_ERR';
        }

        function sortfunction(a, b)
        {
            return (a[0] - b[0]);
        }

        var stops = this.stops;
        var numStops = stops.length;
        var parsedColor = parseCSSColor(color, []);

        if (parsedColor[3] < 1.0)
        {
            this.opaque = false;
        }

        parsedColor[0] = parsedColor[0] * 255;
        parsedColor[1] = parsedColor[1] * 255;
        parsedColor[2] = parsedColor[2] * 255;
        parsedColor[3] = parsedColor[3] * 255;
        stops[numStops] = [offset, parsedColor];
        numStops += 1;
        if (numStops > 1)
        {
            stops.sort(sortfunction);
        }
    },

    // Private API
    updateTexture : function updateRadialTextureFn(gd)
    {
        var texture = this.texture;
        var stops = this.stops;
        var numStops = stops.length;
        if (this.numTextureStops !== numStops)
        {
            this.numTextureStops = numStops;

            var width = this.width;
            if (width < numStops)
            {
                this.width = width = numStops;
            }

            var height = this.height;
            if (height < numStops)
            {
                this.height = height = numStops;
            }

            if (!texture ||
                texture.width !== width ||
                texture.height !== height)
            {
                this.texture = texture = gd.createTexture({
                    name    : ('radial:' + width + 'x' + height),
                    width   : width,
                    height  : height,
                    depth   : 1,
                    format  : gd.PIXELFORMAT_R8G8B8A8,
                    cubemap : false,
                    mipmaps : false
                });
            }

            var x0 = (this.x0 - this.minX);
            var x1 = (this.x1 - this.minX);
            var dx = (x1 - x0);

            var y0 = (this.y0 - this.minY);
            var y1 = (this.y1 - this.minY);
            var dy = (y1 - y0);

            var r0 = this.r0;
            var r1 = this.r1;
            var dr = (r1 - r0);

            var numValues = (width * height * 4);
            var pixelData = new Array(numValues);

            var cos = Math.cos;
            var sin = Math.sin;
            var abs = Math.abs;
            var pi2 = (Math.PI * 2);

            /*jshint bitwise: false*/
            var numSteps = Math.max(abs(dx | 0), abs(dy | 0), abs(dr | 0));
            /*jshint bitwise: true*/

            var dw = (1.0 / numSteps);
            var c0, c1, c2, c3;
            for (var w = 0.0; w <= 1.0; w += dw)
            {
                var currentStop = stops[0];
                var currentOffset = currentStop[0];
                var currentColor = currentStop[1];
                var lastOffset = currentOffset;
                var lastColor = currentColor;

                if (w > currentOffset)
                {
                    for (var ns = 1; ns < numStops; ns += 1)
                    {
                        currentStop = stops[ns];
                        currentOffset = currentStop[0];
                        currentColor = currentStop[1];
                        if (w <= currentOffset)
                        {
                            break;
                        }
                        lastOffset = currentOffset;
                        lastColor = currentColor;
                    }
                }

                var da = (currentOffset - lastOffset);
                if (da <= 0 || w === currentOffset)
                {
                    c0 = currentColor[0];
                    c1 = currentColor[1];
                    c2 = currentColor[2];
                    c3 = currentColor[3];
                }
                else
                {
                    var a = (w - lastOffset) / da;
                    var inva = (1.0 - a);
                    c0 = ((currentColor[0] * a) + (lastColor[0] * inva));
                    c1 = ((currentColor[1] * a) + (lastColor[1] * inva));
                    c2 = ((currentColor[2] * a) + (lastColor[2] * inva));
                    c3 = ((currentColor[3] * a) + (lastColor[3] * inva));
                }

                var x = (x0 + (w * dx));
                var y = (y0 + (w * dy));
                var r = (r0 + (w * dr));

                var angle, dangle, cx, cy, p;
                for (var cr = 1; cr < r; cr += 1)
                {
                    dangle = (1.0 / cr);
                    for (angle = 0; angle < pi2; angle += dangle)
                    {
                        /*jshint bitwise: false*/
                        cx = ((x + (cr * cos(angle))) | 0);
                        cy = ((y + (cr * sin(angle))) | 0);
                        p = ((cx + (cy * width)) << 2);
                        /*jshint bitwise: true*/
                        if (pixelData[p + 3] === undefined)
                        {
                            pixelData[p] = c0;
                            pixelData[p + 1] = c1;
                            pixelData[p + 2] = c2;
                            pixelData[p + 3] = c3;
                        }
                    }
                }

                dangle = (1.0 / r);
                for (angle = 0; angle < pi2; angle += dangle)
                {
                    /*jshint bitwise: false*/
                    cx = ((x + (r * cos(angle))) | 0);
                    cy = ((y + (r * sin(angle))) | 0);
                    p = ((cx + (cy * width)) << 2);
                    /*jshint bitwise: true*/
                    if (pixelData[p + 3] === undefined)
                    {
                        pixelData[p] = c0;
                        pixelData[p + 1] = c1;
                        pixelData[p + 2] = c2;
                        pixelData[p + 3] = c3;
                    }
                }
            }

            var outColor = stops[numStops - 1][1];
            var out0 = outColor[0];
            var out1 = outColor[1];
            var out2 = outColor[2];
            var out3 = outColor[3];
            for (var n = 0; n < numValues; n += 4)
            {
                if (pixelData[n + 3] === undefined)
                {
                    pixelData[n] = out0;
                    pixelData[n + 1] = out1;
                    pixelData[n + 2] = out2;
                    pixelData[n + 3] = out3;
                }
            }

            texture.setData(pixelData);
        }
        return texture;
    }
};

// Constructor function
CanvasRadialGradient.create = function canvasRadialGradientCreateFn(x0, y0, r0, x1, y1, r1)
{
    if (r0 < 0 || r1 < 0)
    {
        throw 'INDEX_SIZE_ERR';
    }

    var c = new CanvasRadialGradient();
    c.x0 = x0;
    c.y0 = y0;
    c.r0 = r0;
    c.x1 = x1;
    c.y1 = y1;
    c.r1 = r1;

    var minX = (Math.min((x0 - r0), (x1 - r1)) - 1);
    var maxX = (Math.max((x0 + r0), (x1 + r1)) + 1);
    var minY = (Math.min((y0 - r0), (y1 - r1)) - 1);
    var maxY = (Math.max((y0 + r0), (y1 + r1)) + 1);

    c.minX = minX;
    c.minY = minY;
    c.stops = [];

    var width = Math.ceil(maxX - minX);
    var height = Math.ceil(maxY - minY);
    if (!width || !height)
    {
        return null;
    }
    c.width = width;
    c.height = height;

    var idx = (1.0 / width);
    var idy = (1.0 / height);

    c.matrix = [idx, 0, -minX * idx,
                0, idy, -minY * idy];

    c.numTextureStops = 0;
    c.texture = null;

    c.opaque = true;

    return c;
};

//
// CanvasContext
//
class CanvasContext
{
    static version = 1;

    canvas                   : any;
    globalAlpha              : number;
    globalCompositeOperation : string;
    strokeStyle              : string;
    fillStyle                : string;
    lineWidth                : number;
    lineCap                  : string;
    lineJoin                 : string;
    miterLimit               : number;
    shadowOffsetX            : number;
    shadowOffsetY            : number;
    shadowBlur               : number;
    shadowColor              : string;
    font                     : string;
    textAlign                : string;
    textBaseline             : string;
    imageColor               : string;

    // private variables
    gd                       : GraphicsDevice;
    md                       : MathDevice;

    fm                       : FontManager;

    target                   : Texture;
    viewport                 : number[];

    pixelRatio               : number;

    width                    : number;
    height                   : number;

    screen                   : any; // v4

    statesStack              : any[]; // TODO
    numStatesInStack         : number;

    subPaths                 : any[];
    currentSubPath           : any[];
    needToSimplifyPath       : bool[];

    activeVertexBuffer       : VertexBuffer;
    activeTechnique          : Technique;
    activeScreen             : any; // v4
    activeColor              : any; // v4

    shader                   : Shader;

    triangleStripPrimitive   : number;
    triangleFanPrimitive     : number;
    trianglePrimitive        : number;
    lineStripPrimitive       : number;
    linePrimitive            : number;

    textureVertexFormats     : number[];
    textureSemantics         : Semantics;
    textureVertexBuffer      : VertexBuffer;

    textureTechniques        : { [name: string]: Technique; };

    flatVertexFormats        : number[];
    flatSemantics            : Semantics;
    flatVertexBuffer         : VertexBuffer;
    flatOffset               : number;

    flatTechniques           : { [name: string]: Technique; };

    bufferData               : any; // floatArrayConstructor(512);
    subBufferDataCache       : {};

    tempRect                 : any; // floatArrayConstructor(8);

    tempVertices             : number[];

    tempStack                : number[];

    v4Zero                   : any; // v4
    v4One                    : any; // v4

    cachedColors             : any; // TOOD {};
    numCachedColors          : number;

    uvtransform              : any; // floatArrayConstructor(6);

    tempColor                : any; // v4
    tempScreen               : any; // v4

    tempImage                : Texture;
    imageTechnique           : Technique;

    patternTechniques        : { [name: string]: Technique; };
    gradientTechniques       : { [name: string]: Technique; };

    textureShadowTechnique   : Technique;
    patternShadowTechnique   : Technique;
    gradientShadowTechnique  : Technique;

    matrix                   : any; // m33?
    clipExtents              : any; // v4?

    defaultStates            : any; // TODO: States

    cachedTriangulation      : {};
    tempAngles               : number[];

    cachedPaths              : {};
    numCachedPaths           : number;

    // On prototype
    floatArrayConstructor    : any;
    byteArrayConstructor     : any;
    shortArrayConstructor    : any;

    // TODO: can't have identifiers with '-' in them
    private compositeOperations =
    {
        'source-atop' : 1,
        'source-in' : 1,
        'source-out' : 1,
        'source-over' : 1,
        'destination-atop' : 1,
        'destination-in' : 1,
        'destination-out' : 1,
        'destination-over' : 1,
        'lighter' : 1,
        'copy' : 1,
        'xor' : 1
    };

    capStyles =
    {
        'butt' : 1,
        'round' : 1,
        'square' : 1
    };

    joinStyles =
    {
        'bevel' : 1,
        'round' : 1,
        'miter' : 1
    };

    //
    // Public canvas 2D context API
    //
    save()
    {
        var statesStack = this.statesStack;
        var numStatesInStack = this.numStatesInStack;
        var states = statesStack[numStatesInStack];
        if (!states)
        {
            statesStack[numStatesInStack] = states = this.createStatesObject();
        }
        this.numStatesInStack = (numStatesInStack + 1);
        this.setStates(states, this);
    };

    restore()
    {
        var numStatesInStack = this.numStatesInStack;
        if (0 < numStatesInStack)
        {
            numStatesInStack -= 1;
            this.numStatesInStack = numStatesInStack;
            var states = this.statesStack[numStatesInStack];
            this.setStates(this, states);
        }
    };

    scale(x, y)
    {
        var m = this.matrix;
        m[0] *= x;
        m[1] *= y;
        m[3] *= x;
        m[4] *= y;
    };

    rotate(angle)
    {
        if (angle)
        {
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            this.transform(c, s, -s, c, 0, 0);
        }
    };

    translate(x, y)
    {
        var m = this.matrix;
        m[2] += (m[0] * x + m[1] * y);
        m[5] += (m[3] * x + m[4] * y);
    };

    transform(a, b, c, d, e, f)
    {
        var m = this.matrix;
        var m0 = m[0];
        var m1 = m[1];
        var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];

        m[0] = (m0 * a + m1 * b);
        m[3] = (m3 * a + m4 * b);
        m[1] = (m0 * c + m1 * d);
        m[4] = (m3 * c + m4 * d);
        m[2] = (m0 * e + m1 * f + m2);
        m[5] = (m3 * e + m4 * f + m5);
    };

    setTransform(a, b, c, d, e, f)
    {
        var m = this.matrix;
        m[0] = a;
        m[1] = c;
        m[2] = e;
        m[3] = b;
        m[4] = d;
        m[5] = f;
    };

    createLinearGradient(x0, y0, x1, y1): CanvasLinearGradient
    {
        return CanvasLinearGradient.create(x0, y0, x1, y1);
    };

    createRadialGradient(x0, y0, r0, x1, y1, r1): CanvasRadialGradient
    {
        return CanvasRadialGradient.create(x0, y0, r0, x1, y1, r1);
    };

    createPattern(image /*, repetition */)
    {
        if (!image)
        {
            throw 'INVALID_STATE_ERR';
        }

        if (image.width === 0 ||
            image.height === 0)
        {
            return null;
        }

        return image;
    };

    clearRect(x, y, w, h)
    {
        if (w > 0 && h > 0)
        {
            var gd = this.gd;
            var clipExtents = this.clipExtents;
            var minClipX = clipExtents[0];
            var minClipY = clipExtents[1];
            var maxClipX = clipExtents[2];
            var maxClipY = clipExtents[3];

            var rect = this.transformRect(x, y, w, h, this.tempRect);

            if (rect[0] <= minClipX &&
                rect[1] >= maxClipY &&
                rect[2] >= maxClipX &&
                rect[3] >= maxClipY &&
                rect[4] <= minClipX &&
                rect[5] <= minClipY &&
                rect[6] >= maxClipX &&
                rect[7] <= minClipY)
            {
                gd.clear(this.v4Zero);
            }
            else
            {
                this.fillFlatBuffer(rect, 4);

                var technique = this.flatTechniques['copy'];

                this.setTechniqueWithColor(technique, this.screen, this.v4Zero);

                gd.draw(this.triangleStripPrimitive, 4, this.flatOffset);

                this.flatOffset += 4;
            }
        }
    };

    fillRect(x, y, w, h)
    {
        if (w > 0 && h > 0)
        {
            var rect = this.transformRect(x, y, w, h, this.tempRect);
            this.fillFlatBuffer(rect, 4);

            var primitive = this.triangleStripPrimitive;
            var style = this.fillStyle;
            var gd = this.gd;

            if (this.setShadowStyle(style))
            {
                gd.draw(primitive, 4, this.flatOffset);
            }

            this.setStyle(style);

            gd.draw(primitive, 4, this.flatOffset);

            this.flatOffset += 4;
        }
    };

    strokeRect(x, y, w, h)
    {
        if (w > 0 || h > 0)
        {
            var rect = this.transformRect(x, y, w, h, this.tempRect);

            var style = this.strokeStyle;
            var lineWidth = this.lineWidth;
            var thinLines = ((this.pixelRatio * lineWidth) < 2);

            var primitive;
            var numVertices;
            var bufferData;

            if (thinLines)
            {
                primitive = this.lineStripPrimitive;
                numVertices = 5;
                bufferData = this.getFlatBuffer(5);
                if (bufferData)
                {
                    bufferData[0] = rect[4];
                    bufferData[1] = rect[5];
                    bufferData[2] = rect[6];
                    bufferData[3] = rect[7];
                    bufferData[4] = rect[2];
                    bufferData[5] = rect[3];
                    bufferData[6] = rect[0];
                    bufferData[7] = rect[1];
                    bufferData[8] = rect[4];
                    bufferData[9] = rect[5];
                    this.fillFlatBuffer(bufferData, 5);
                }
            }
            else
            {
                var p0 = [rect[0], rect[1]];
                var p1 = [rect[2], rect[3]];
                var p2 = [rect[4], rect[5]];
                var p3 = [rect[6], rect[7]];
                var points = [p2, p3, p1, p0, p2];

                primitive = this.triangleStripPrimitive;
                numVertices = this.fillFatStrip(points, 5, lineWidth);
            }

            var gd = this.gd;

            if (this.setShadowStyle(style))
            {
                gd.draw(primitive, numVertices, this.flatOffset);
            }

            this.setStyle(style);

            gd.draw(primitive, numVertices, this.flatOffset);

            this.flatOffset += numVertices;
        }
    };

    beginPath()
    {
        this.subPaths.length = 0;
        this.currentSubPath.length = 0;
        this.needToSimplifyPath[0] = true;
    };

    closePath()
    {
        var currentSubPath = this.currentSubPath;
        var numCurrentSubPathElements = currentSubPath.length;
        if (numCurrentSubPathElements > 1)
        {
            var firstPoint = currentSubPath[0];

            // Close current subpath if not just a single segment
            if (numCurrentSubPathElements > 2)
            {
                var lastPoint = currentSubPath[numCurrentSubPathElements - 1];
                var abs = Math.abs;
                if (abs(firstPoint[0] - lastPoint[0]) >= 1.0 ||
                    abs(firstPoint[1] - lastPoint[1]) >= 1.0)
                {
                    currentSubPath[numCurrentSubPathElements] = firstPoint;
                }

                this.simplifyShape(currentSubPath);
            }

            var subPaths = this.subPaths;
            var numSubPaths = subPaths.length;
            subPaths[numSubPaths] = currentSubPath;

            this.currentSubPath = [firstPoint];

            var needToSimplifyPath = this.needToSimplifyPath;
            needToSimplifyPath[numSubPaths] = false;
            needToSimplifyPath[numSubPaths + 1] = true;
        }
    };

    moveTo(x, y)
    {
        var currentSubPath = this.currentSubPath;
        var numCurrentSubPathElements = currentSubPath.length;
        if (numCurrentSubPathElements > 1)
        {
            var subPaths = this.subPaths;
            var numSubPaths = subPaths.length;
            subPaths[numSubPaths] = currentSubPath;

            this.currentSubPath = [this.transformPoint(x, y)];

            var needToSimplifyPath = this.needToSimplifyPath;
            needToSimplifyPath[numSubPaths] = (numCurrentSubPathElements > 2);
            needToSimplifyPath[numSubPaths + 1] = true;
        }
        else
        {
            currentSubPath[0] = this.transformPoint(x, y);
        }
    };

    lineTo(x, y)
    {
        var currentSubPath = this.currentSubPath;
        currentSubPath[currentSubPath.length] = this.transformPoint(x, y);
    };

    quadraticCurveTo(cpx, cpy, x, y)
    {
        var currentSubPath = this.currentSubPath;
        var numCurrentSubPathElements = currentSubPath.length;
        if (numCurrentSubPathElements === 0)
        {
            throw 'Needs starting point!';
        }

        var p1 = currentSubPath[numCurrentSubPathElements - 1];
        var x1 = p1[0];
        var y1 = p1[1];

        var q = this.transformPoint(cpx, cpy);
        var xq = q[0];
        var yq = q[1];

        var p2 = this.transformPoint(x, y);
        var x2 = p2[0];
        var y2 = p2[1];

        var abs = Math.abs;
        var numSteps = Math.ceil(this.pixelRatio * Math.sqrt(abs(xq - x1) + abs(yq - y1) +
                                                             abs(x2 - xq) + abs(y2 - yq)));
        if (1 < numSteps)
        {
            currentSubPath.length += numSteps;

            var dt = (1.0 / numSteps);
            for (var t = dt; 1 < numSteps; t += dt, numSteps -= 1)
            {
                var invt = (1.0 - t);
                var invt2 = (invt * invt);
                var t2 = (t * t);
                var tinvt = (2 * t * invt);
                currentSubPath[numCurrentSubPathElements] = [((invt2 * x1) + (tinvt * xq) + (t2 * x2)),
                                                             ((invt2 * y1) + (tinvt * yq) + (t2 * y2))];
                numCurrentSubPathElements += 1;
            }
        }

        currentSubPath[numCurrentSubPathElements] = p2;
    };

    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    {
        var currentSubPath = this.currentSubPath;
        var numCurrentSubPathElements = currentSubPath.length;
        if (numCurrentSubPathElements === 0)
        {
            throw 'Needs starting point!';
        }

        var p1 = currentSubPath[numCurrentSubPathElements - 1];
        var x1 = p1[0];
        var y1 = p1[1];

        var q1 = this.transformPoint(cp1x, cp1y);
        var xq1 = q1[0];
        var yq1 = q1[1];

        var q2 = this.transformPoint(cp2x, cp2y);
        var xq2 = q2[0];
        var yq2 = q2[1];

        var p2 = this.transformPoint(x, y);
        var x2 = p2[0];
        var y2 = p2[1];

        var abs = Math.abs;
        var numSteps = Math.ceil(this.pixelRatio * Math.sqrt(abs(xq1 - x1) + abs(yq1 - y1) +
                                                             abs(xq2 - xq1) + abs(yq2 - yq1) +
                                                             abs(x2 - xq2) + abs(y2 - yq2)));
        if (1 < numSteps)
        {
            currentSubPath.length += numSteps;

            var dt = (1.0 / numSteps);
            for (var t = dt; 1 < numSteps; t += dt, numSteps -= 1)
            {
                var invt = (1.0 - t);
                var invt2 = (invt * invt);
                var invt3 = (invt2 * invt);
                var t2 = (t * t);
                var t3 = (t2 * t);
                var tinvt = (3 * t * invt2);
                var invtt = (3 * t2 * invt);
                currentSubPath[numCurrentSubPathElements] = [((invt3 * x1) + (tinvt * xq1) + (invtt * xq2) + (t3 * x2)),
                                                             ((invt3 * y1) + (tinvt * yq1) + (invtt * yq2) + (t3 * y2))];
                numCurrentSubPathElements += 1;
            }
        }

        currentSubPath[numCurrentSubPathElements] = p2;
    };

    arcTo(x1, y1, x2, y2, radius)
    {
        if (radius < 0)
        {
            throw 'INDEX_SIZE_ERR';
        }

        var x0, y0;

        var currentSubPath = this.currentSubPath;
        var numCurrentSubPathElements = currentSubPath.length;
        if (numCurrentSubPathElements === 0)
        {
            currentSubPath[0] = this.transformPoint(x1, y1);
            numCurrentSubPathElements = 1;

            x0 = x1;
            y0 = y1;
        }
        else
        {
            var p0 = this.untransformPoint(currentSubPath[numCurrentSubPathElements - 1]);
            x0 = p0[0];
            y0 = p0[1];
        }

        var dx0 = (x0 - x1);
        var dy0 = (y0 - y1);
        var ln0 = ((dx0 * dx0) + (dy0 * dy0));

        var dx2 = (x2 - x1);
        var dy2 = (y2 - y1);
        var ln2 = ((dx2 * dx2) + (dy2 * dy2));

        if (radius < 2 ||
            ln0 < 2 ||
            ln2 < 2)
        {
            currentSubPath.push(this.transformPoint(x1, y1));
        }
        else
        {
            var sqrt = Math.sqrt;
            var acos = Math.acos;
            var pi = Math.PI;

            ln0 = 1.0 / sqrt(ln0);
            dx0 *= ln0;
            dy0 *= ln0;

            ln2 = 1.0 / sqrt(ln2);
            dx2 *= ln2;
            dy2 *= ln2;

            // Calculate unit vector from x1 to center
            var dxc = (dx0 + dx2);
            var dyc = (dy0 + dy2);
            var lnc = (1.0 / sqrt((dxc * dxc) + (dyc * dyc)));
            dxc *= lnc;
            dyc *= lnc;

            // Calculate angle from vector to center with the vector to x2 using dot product
            // Use it to calculate distance to center
            var dot = ((dxc * dx2) + (dyc * dy2));
            var h = (radius / dot); // dot = Math.cos(angle)

            var cp = this.transformPoint((x1 + (h * dxc)),
                                         (y1 + (h * dyc)));
            var cx = cp[0];
            var cy = cp[1];

            var anticlockwise = (((dx0 * dy2) - (dx2 * dy0)) > 0);

            var da = acos(-dxc);
            if (dyc < 0)
            {
                da = -da;
            }
            da = ((0.5 * pi) - da);

            var angle = acos(dot);
            var startAngle = (pi + angle + da);
            var endAngle = ((2 * pi) - angle + da);
            if (anticlockwise)
            {
                this.interpolateArc(cx, cy, radius, endAngle, startAngle, true);
            }
            else
            {
                this.interpolateArc(cx, cy, radius, startAngle, endAngle);
            }
        }
    };

    arc(x, y, radius, startAngle, endAngle, anticlockwise)
    {
        if (radius < 0)
        {
            throw 'INDEX_SIZE_ERR';
        }

        var cp = this.transformPoint(x, y);

        var currentSubPath = this.currentSubPath;

        if (radius < 2.0)
        {
            currentSubPath.push(cp);
        }
        else
        {
            this.interpolateArc(cp[0], cp[1], radius, startAngle, endAngle, anticlockwise);
        }
    };

    ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
    {
        if (radiusX < 0 || radiusY < 0)
        {
            throw 'INDEX_SIZE_ERR';
        }

        if (radiusX < 2.0 && radiusY < 2.0)
        {
            var cp = this.transformPoint(x, y);
            this.currentSubPath.push(cp);
            return;
        }

        var radius, sx, sy;
        if (radiusX === radiusY)
        {
            radius = radiusX;
            sx = 1;
            sy = 1;
        }
        else if (radiusX > radiusY)
        {
            radius = radiusX;
            sx = 1;
            sy = radiusY / radiusX;
        }
        else //if (radiusX < radiusY)
        {
            radius = radiusY;
            sx = radiusX / radiusY;
            sy = 1;
        }

        if (rotation !== 0 || sx !== 1 || sy !== 1)
        {
            this.translate(x, y);
            if (rotation !== 0)
            {
                this.rotate(rotation);
            }
            if (sx !== 1 || sy !== 1)
            {
                this.scale(sx, sy);
            }

            this.arc(0, 0, radius, startAngle, endAngle, anticlockwise);

            if (sx !== 1 || sy !== 1)
            {
                this.scale((1 / sx), (1 / sy));
            }
            if (rotation !== 0)
            {
                this.rotate(-rotation);
            }
            this.translate(-x, -y);
        }
        else
        {
            this.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        }
    };

    rect(x, y, w, h)
    {
        var subPaths = this.subPaths;
        var numSubPaths = subPaths.length;
        var currentSubPath = this.currentSubPath;
        var numCurrentSubPathElements = currentSubPath.length;
        var needToSimplifyPath = this.needToSimplifyPath;
        if (numCurrentSubPathElements > 1)
        {
            subPaths[numSubPaths] = currentSubPath;

            needToSimplifyPath[numSubPaths] = (numCurrentSubPathElements > 2);

            numSubPaths += 1;
        }

        var rect = this.transformRect(x, y, w, h, this.tempRect);
        var p0 = [rect[0], rect[1]];
        var p1 = [rect[2], rect[3]];
        var p2 = [rect[4], rect[5]];
        var p3 = [rect[6], rect[7]];

        subPaths[numSubPaths] = [p2, p3, p1, p0, p2];

        this.currentSubPath = [p0];

        needToSimplifyPath[numSubPaths] = (w < 1 || h < 1);
        needToSimplifyPath[numSubPaths + 1] = true;
    };

    private _parsePath(path: string) : any[]
    {
        var commands = [];

        var end = path.length;
        var currentCommand = -1, previousCommand = -1;
        var i = 0;

        var skipWhiteSpace = function skipWhiteSpaceFn()
        {
            var c = path.charCodeAt(i);
            while (c <= 32 || c === 44) // whitespace or ,
            {
                i += 1;
                if (i >= end)
                {
                    return -1;
                }
                c = path.charCodeAt(i);
            }
            return c;
        };

        var readNumber = function readNumberFn()
        {
            var c = path.charCodeAt(i);
            while (c <= 32 || c === 44) // whitespace or ,
            {
                i += 1;
                if (i >= end)
                {
                    throw "Reached end of string without required coordinate.";
                }
                c = path.charCodeAt(i);
            }

            var start = i;

            if (c === 45 || //-
                c === 43) //+
            {
                i += 1;
                if (i >= end)
                {
                    return 0;
                }
                c = path.charCodeAt(i);
            }

            while (c >= 48 && c <= 57) //0-9
            {
                i += 1;
                if (i >= end)
                {
                    break;
                }
                c = path.charCodeAt(i);
            }

            if (c === 46 || //.
                c === 101 || //e
                c === 101) //E
            {
                if (c === 46) //.
                {
                    do
                    {
                        i += 1;
                        if (i >= end)
                        {
                            break;
                        }
                        c = path.charCodeAt(i);
                    }
                    while (c >= 48 && c <= 57); //0-9
                }

                if (c === 101 || //e
                    c === 101) //E
                {
                    i += 1;
                    if (i < end)
                    {
                        c = path.charCodeAt(i);

                        if (c === 45 || //-
                            c === 43) //+
                        {
                            i += 1;
                            if (i < end)
                            {
                                c = path.charCodeAt(i);
                            }
                        }

                        while (c >= 48 && c <= 57) //0-9
                        {
                            i += 1;
                            if (i >= end)
                            {
                                break;
                            }
                            c = path.charCodeAt(i);
                        }
                    }
                }

                return parseFloat(path.slice(start, i));
            }
            else
            {
                return parseInt(path.slice(start, i), 10);
            }
        };

        var readFlag = function readFlagFn()
        {
            var c = skipWhiteSpace();
            if (c < -1)
            {
                throw "Reached end of string without required flag.";
            }

            if (c === 48) //0
            {
                i += 1;
                return false;
            }
            else if (c === 49) //1
            {
                i += 1;
                return true;
            }
            else
            {
                throw "Unknown flag: " + path.slice(i);
            }
        };

        // polygons are encoded with a negative number indicating the number of points
        var polygonStart = -1;
        var addLine = function addLineFn(commands, x, y)
        {
            var numCommands = commands.length;
            if (0 < polygonStart)
            {
                var lastCommand = commands[polygonStart];
                if (lastCommand < 0)
                {
                    commands[polygonStart] = (lastCommand - 1);
                }
                else //if (lastCommand === 76)
                {
                    commands[polygonStart] = -2;
                }
                commands.push(x, y);
            }
            else
            {
                polygonStart = numCommands;
                commands.push(76, x, y);
            }
        };

        var getRatio = function getRatioFn(u, v)
        {
            var u0 = u[0];
            var u1 = u[1];
            var v0 = v[0];
            var v1 = v[1];
            return ((u0 * v0) + (u1 * v1)) / Math.sqrt(((u0 * u0) + (u1 * u1)) * ((v0 * v0) + (v1 * v1)));
        };

        var getAngle = function getAngleFn(u, v)
        {
            return ((u[0] * v[1]) < (u[1] * v[0]) ? -1 : 1) * Math.acos(getRatio(u, v));
        };

        var sqrt = Math.sqrt;
        var abs = Math.abs;
        var pi = Math.PI;

        var lx = 0;
        var ly = 0;
        var fx = 0;
        var fy = 0;

        var x, y, x1, y1, x2, y2;
        var rx, ry, angle, largeArcFlag, sweepFlag;

        while (i < end)
        {
            // Skip whitespace
            var c = skipWhiteSpace();
            if (c < 0)
            {
                // end of string
                return commands;
            }

            // Same command, new arguments?
            if (c === 43 || //+
                c === 45 || //-
                c === 46 || //.
                (c >= 48 && c <= 57)) //0-9
            {
                if (currentCommand < 0)
                {
                    throw "Coordinates without a command: " + path.slice(i);
                }
                else
                {
                    // Implicit lineTo after moveTo?
                    if (currentCommand === 77) //M
                    {
                        currentCommand = 76; //L
                    }
                    else if (currentCommand === 109) //m
                    {
                        currentCommand = 108; //l
                    }
                }
            }
            else
            {
                previousCommand = currentCommand;
                currentCommand = c;
                i += 1;
            }

            switch (currentCommand)
            {
            case 77: //M
            case 109: //m
                x = readNumber();
                y = readNumber();
                if (currentCommand === 109) //m
                {
                    x += lx;
                    y += ly;
                }
                fx = x;
                fy = y;
                commands.push(77, x, y);
                polygonStart = -1;
                break;

            case 76: //L
            case 108: //l
                x = readNumber();
                y = readNumber();
                if (currentCommand === 108) //l
                {
                    x += lx;
                    y += ly;
                }
                addLine(commands, x, y);
                break;

            case 72: //H
            case 104: //h
                x = readNumber();
                if (currentCommand === 104) //h
                {
                    x += lx;
                }
                y = ly;
                addLine(commands, x, y);
                break;

            case 86: //V
            case 118: //v
                x = lx;
                y = readNumber();
                if (currentCommand === 118) //v
                {
                    y += ly;
                }
                addLine(commands, x, y);
                break;

            case 67: //C
            case 99: //c
                x1 = readNumber();
                y1 = readNumber();
                x2 = readNumber();
                y2 = readNumber();
                x = readNumber();
                y = readNumber();
                if (currentCommand === 99) //c
                {
                    x1 += lx;
                    y1 += ly;
                    x2 += lx;
                    y2 += ly;
                    x += lx;
                    y += ly;
                }
                commands.push(67, x1, y1, x2, y2, x, y);
                polygonStart = -1;
                break;

            case 83: //S
            case 115: //s
                if (previousCommand === 67 || //C
                    previousCommand === 99 || //c
                    previousCommand === 83 || //S
                    previousCommand === 115) //s
                {
                    x1 = ((2 * lx) - x2);
                    y1 = ((2 * ly) - y2);
                }
                else
                {
                    x1 = lx;
                    y1 = ly;
                }
                x2 = readNumber();
                y2 = readNumber();
                x = readNumber();
                y = readNumber();
                if (currentCommand === 115) //s
                {
                    x2 += lx;
                    y2 += ly;
                    x += lx;
                    y += ly;
                }
                commands.push(67, x1, y1, x2, y2, x, y);
                polygonStart = -1;
                break;

            case 81: //Q
            case 113: //q
                x1 = readNumber();
                y1 = readNumber();
                x = readNumber();
                y = readNumber();
                if (currentCommand === 113) //q
                {
                    x1 += lx;
                    y1 += ly;
                    x += lx;
                    y += ly;
                }
                commands.push(81, x1, y1, x, y);
                polygonStart = -1;
                break;

            case 84: //T
            case 116: //t
                if (previousCommand === 81 || //Q
                    previousCommand === 113 || //q
                    previousCommand === 84 || //T
                    previousCommand === 116) //t
                {
                    x1 = ((2 * lx) - x1);
                    y1 = ((2 * ly) - y1);
                }
                else
                {
                    x1 = lx;
                    y1 = ly;
                }
                x = readNumber();
                y = readNumber();
                if (currentCommand === 116) //t
                {
                    x += lx;
                    y += ly;
                }
                commands.push(81, x1, y1, x, y);
                polygonStart = -1;
                break;

            case 65: //A
            case 97: //a
                x1 = lx;
                y1 = ly;
                rx = readNumber();
                ry = readNumber();
                angle = readNumber();
                angle = (angle * (pi / 180.0));
                largeArcFlag = readFlag();
                sweepFlag = readFlag();
                x = readNumber();
                y = readNumber();
                if (currentCommand === 97) //a
                {
                    x += lx;
                    y += ly;
                }

                var ca = Math.cos(angle);
                var sa = Math.sin(angle);

                var hdx = (x1 - x) * 0.5;
                var hdy = (y1 - y) * 0.5;
                var x1b = ca * hdx + sa * hdy;
                var x1b2 = (x1b * x1b);
                var y1b = -sa * hdx + ca * hdy;
                var y1b2 = (y1b * y1b);

                // adjust radii
                var l = x1b2 / (rx * rx) + y1b2 / (ry * ry);
                if (l > 1)
                {
                    var lsq = sqrt(l);
                    rx *= lsq;
                    ry *= lsq;
                }

                var rx2 = (rx * rx);
                var invrx = (1 / rx);
                var ry2 = (ry * ry);
                var invry = (1 / ry);

                // cx', cy'
                var s = (largeArcFlag === sweepFlag ? -1 : 1) * sqrt(
                        ((rx2 * ry2) - (rx2 * y1b2) - (ry2 * x1b2)) / (rx2 * y1b2 + ry2 * x1b2));
                if (isNaN(s))
                {
                    s = 0;
                }
                var cxb = s * rx * y1b * invry;
                var cyb = s * -ry * x1b * invrx;

                var cx = (x1 + x) * 0.5 + ca * cxb - sa * cyb;
                var cy = (y1 + y) * 0.5 + sa * cxb + ca * cyb;

                var u = [(x1b - cxb) * invrx, (y1b - cyb) * invry];
                var v = [(-x1b - cxb) * invrx, (-y1b - cyb) * invry];

                // initial angle
                var a1 = getAngle([1, 0], u);

                // angle delta
                var ad;
                var ratio = getRatio(u, v);
                if (ratio <= -1)
                {
                    ad = pi;
                }
                else if (ratio >= 1)
                {
                    ad = 0;
                }
                else
                {
                    ad = getAngle(u, v);
                }

                if (!sweepFlag)
                {
                    if (ad > 0)
                    {
                        ad = ad - (2 * pi);
                    }
                }
                else //if (sweepFlag)
                {
                    if (ad < 0)
                    {
                        ad = ad + (2 * pi);
                    }
                }

                var radius, sx, sy;
                if (rx === ry)
                {
                    radius = rx;
                    sx = 1;
                    sy = 1;
                }
                else if (rx > ry)
                {
                    radius = rx;
                    sx = 1;
                    sy = ry * invrx;
                }
                else //if (rx < ry)
                {
                    radius = ry;
                    sx = rx * invry;
                    sy = 1;
                }

                commands.push(65, angle, sx, sy, cx, cy, radius, a1, (a1 + ad), (true - sweepFlag));
                polygonStart = -1;
                break;

            case 90: //Z
            case 122: //z
                if (3 <= polygonStart &&
                    commands[polygonStart - 3] === 77)
                {
                    var startX = commands[polygonStart - 2];
                    var startY = commands[polygonStart - 1];
                    if (abs(startX - lx) < 1.0 &&
                        abs(startY - ly) < 1.0)
                    {
                        // Remove last point because it is redundant
                        // Counter is a negative value
                        commands[polygonStart] += 1;
                        if (commands[polygonStart] === 0)
                        {
                            commands.length = polygonStart;
                        }
                        else
                        {
                            commands.length -= 2;
                        }
                    }
                }
                x = fx;
                y = fy;
                commands.push(90);
                polygonStart = -1;
                break;

            default:
                throw "Unknown command: " + path.slice(i);
            }

            lx = x;
            ly = y;
        }

        return commands;
    };

    addPoints(points: number[], offset: number, numPoints: number) : number
    {
        var currentSubPath = this.currentSubPath;
        var j = currentSubPath.length;
        var endPoints = (j + numPoints);
        var i = offset;

        currentSubPath.length = endPoints;

        if (this.transformPoint === this.transformPointIdentity)
        {
            do
            {
                currentSubPath[j] = [points[i],
                                     points[i + 1]];
                i += 2;
                j += 1;
            }
            while (j < endPoints);
        }
        else if (this.transformPoint === this.transformPointTranslate)
        {
            var m = this.matrix;
            var dx = m[2];
            var dy = m[5];
            do
            {
                currentSubPath[j] = [points[i] + dx,
                                     points[i + 1] + dy];
                i += 2;
                j += 1;
            }
            while (j < endPoints);
        }
        else
        {
            do
            {
                currentSubPath[j] = this.transformPoint(points[i],
                                                        points[i + 1]);
                i += 2;
                j += 1;
            }
            while (j < endPoints);
        }

        return i;
    };

    path(path: string)
    {
        var commands = this.cachedPaths[path];
        if (commands === undefined)
        {
            if (this.numCachedPaths >= 1024)
            {
                this.cachedPaths = {};
                this.numCachedPaths = 0;
            }

            commands = this._parsePath(path);

            this.cachedPaths[path] = commands;
            this.numCachedPaths += 1;
        }

        var end = commands.length;
        var currentCommand = -1;
        var i = 0;

        var x, y, x1, y1, x2, y2;

        while (i < end)
        {
            currentCommand = commands[i];
            i += 1;

            if (currentCommand < 0)
            {
                i = this.addPoints(commands, i, -currentCommand);
                continue;
            }

            switch (currentCommand)
            {
            case 77: //M
                x = commands[i]; i += 1;
                y = commands[i]; i += 1;
                this.moveTo(x, y);
                break;

            case 76: //L
                x = commands[i]; i += 1;
                y = commands[i]; i += 1;
                this.currentSubPath.push(this.transformPoint(x, y));
                break;

            case 67: //C
                x1 = commands[i]; i += 1;
                y1 = commands[i]; i += 1;
                x2 = commands[i]; i += 1;
                y2 = commands[i]; i += 1;
                x = commands[i]; i += 1;
                y = commands[i]; i += 1;
                this.bezierCurveTo(x1, y1, x2, y2, x, y);
                break;

            case 81: //Q
                x1 = commands[i]; i += 1;
                y1 = commands[i]; i += 1;
                x = commands[i]; i += 1;
                y = commands[i]; i += 1;
                this.quadraticCurveTo(x1, y1, x, y);
                break;

            case 65: //A
                var angle = commands[i]; i += 1;
                var sx = commands[i]; i += 1;
                var sy = commands[i]; i += 1;
                var cx = commands[i]; i += 1;
                var cy = commands[i]; i += 1;
                var radius = commands[i]; i += 1;
                var startAngle = commands[i]; i += 1;
                var endAngle = commands[i]; i += 1;
                var anticlockwise = commands[i]; i += 1;
                if (angle !== 0 || sx !== 1 || sy !== 1)
                {
                    this.translate(cx, cy);
                    if (angle !== 0)
                    {
                        this.rotate(angle);
                    }
                    if (sx !== 1 || sy !== 1)
                    {
                        this.scale(sx, sy);
                    }

                    this.arc(0, 0, radius, startAngle, endAngle, anticlockwise);

                    if (sx !== 1 || sy !== 1)
                    {
                        this.scale((1 / sx), (1 / sy));
                    }
                    if (angle !== 0)
                    {
                        this.rotate(-angle);
                    }
                    this.translate(-cx, -cy);
                }
                else
                {
                    this.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);
                }
                break;

            case 90: //Z
                this.closePath();
                break;

            default:
                // should never happen
                break;
            }
        }
    };

    fill()
    {
        var subPaths = this.subPaths;
        var numSubPaths = subPaths.length;
        var currentSubPath = this.currentSubPath;
        var needToSimplifyPath = this.needToSimplifyPath;
        if (numSubPaths > 0 ||
            currentSubPath.length > 2)
        {
            var autoClose = this.autoClose;
            var canTriangulateAsFan = this.canTriangulateAsFan;
            var triangulateAsFan = this.triangulateAsFan;
            var points, numPoints, numSegments;

            var style = this.fillStyle;

            var primitive;
            var vertices;
            var numVertices = 0;

            if (numSubPaths > 1 ||
                (numSubPaths === 1 &&
                 currentSubPath.length > 2))
            {
                primitive = this.trianglePrimitive;
                vertices = this.tempVertices;

                for (var i = 0; i < numSubPaths; i += 1)
                {
                    points = subPaths[i];
                    numPoints = points.length;
                    if (numPoints > 2)
                    {
                        numPoints = autoClose(points, numPoints);
                        numSegments = (numPoints - 1);

                        if (needToSimplifyPath[i])
                        {
                            needToSimplifyPath[i] = false;
                            numSegments = this.simplifyShape(points);
                        }

                        if (numSegments > 1)
                        {
                            if (canTriangulateAsFan(points, numSegments))
                            {
                                numVertices = triangulateAsFan(points, numSegments, vertices, numVertices);
                            }
                            else
                            {
                                numVertices = this.triangulateConcaveCached(points, numSegments, vertices, numVertices);
                            }
                        }
                    }
                }

                points = currentSubPath;
                numPoints = points.length;
                if (numPoints > 2)
                {
                    numPoints = autoClose(points, numPoints);
                    numSegments = (numPoints - 1);

                    if (needToSimplifyPath[numSubPaths])
                    {
                        needToSimplifyPath[numSubPaths] = false;
                        numSegments = this.simplifyShape(points);
                    }

                    if (numSegments > 1)
                    {
                        if (canTriangulateAsFan(points, numSegments))
                        {
                            numVertices = triangulateAsFan(points, numSegments, vertices, numVertices);
                        }
                        else
                        {
                            numVertices = this.triangulateConcaveCached(points, numSegments, vertices, numVertices);
                        }
                    }
                }
            }
            else
            {
                if (numSubPaths > 0)
                {
                    points = subPaths[0];
                }
                else
                {
                    points = currentSubPath;
                }

                numPoints = points.length;
                if (numPoints > 2)
                {
                    numPoints = autoClose(points, numPoints);
                    numSegments = (numPoints - 1);

                    if (needToSimplifyPath[0])
                    {
                        needToSimplifyPath[0] = false;
                        numSegments = this.simplifyShape(points);
                    }

                    if (numSegments > 1)
                    {
                        if (canTriangulateAsFan(points, numSegments))
                        {
                            primitive = this.triangleFanPrimitive;
                            vertices = points;
                            numVertices = numSegments;
                        }
                        else
                        {
                            primitive = this.trianglePrimitive;
                            vertices = this.tempVertices;
                            numVertices = this.triangulateConcaveCached(points, numSegments, vertices, 0);
                        }
                    }
                }
            }

            if (numVertices > 0)
            {
                this.fillFlatVertices(vertices, numVertices);

                var gd = this.gd;

                if (this.setShadowStyle(style))
                {
                    gd.draw(primitive, numVertices, this.flatOffset);
                }

                this.setStyle(style);

                gd.draw(primitive, numVertices, this.flatOffset);

                this.flatOffset += numVertices;
            }
        }
    };

    stroke()
    {
        var subPaths = this.subPaths;
        var numSubPaths = subPaths.length;
        var currentSubPath = this.currentSubPath;
        var needToSimplifyPath = this.needToSimplifyPath;
        if (numSubPaths > 0 ||
            currentSubPath.length > 0)
        {
            var gd = this.gd;
            var style = this.strokeStyle;
            var lineWidth = this.lineWidth;
            var thinLines = ((this.pixelRatio * lineWidth) < 2);
            var points, numPoints, primitive, numVertices;

            if (thinLines)
            {
                primitive = this.lineStripPrimitive;
            }
            else
            {
                primitive = this.triangleStripPrimitive;
            }

            for (var i = 0; i < numSubPaths; i += 1)
            {
                points = subPaths[i];
                numPoints = points.length;

                if (needToSimplifyPath[i])
                {
                    needToSimplifyPath[i] = false;
                    numPoints = (1 + this.simplifyShape(points));
                }

                if (thinLines)
                {
                    numVertices = numPoints;
                    this.fillFlatVertices(points, numPoints);
                }
                else if (numPoints > 1)
                {
                    numVertices = this.fillFatStrip(points, numPoints, lineWidth);
                }
                else
                {
                    continue;
                }

                if (this.setShadowStyle(style))
                {
                    gd.draw(primitive, numVertices, this.flatOffset);
                }

                this.setStyle(style);

                gd.draw(primitive, numVertices, this.flatOffset);

                this.flatOffset += numVertices;
            }

            points = currentSubPath;
            numPoints = points.length;
            if (numPoints > 0)
            {
                if (needToSimplifyPath[numSubPaths])
                {
                    needToSimplifyPath[numSubPaths] = false;
                    if (numPoints > 2)
                    {
                        numPoints = (1 + this.simplifyShape(points));
                    }
                }

                if (thinLines)
                {
                    numVertices = numPoints;
                    this.fillFlatVertices(points, numPoints);
                }
                else if (numPoints > 1)
                {
                    numVertices = this.fillFatStrip(points, numPoints, lineWidth);
                }
                else
                {
                    return;
                }

                if (this.setShadowStyle(style))
                {
                    gd.draw(primitive, numVertices, this.flatOffset);
                }

                this.setStyle(style);

                gd.draw(primitive, numVertices, this.flatOffset);

                this.flatOffset += numVertices;
            }
        }
    };

    drawSystemFocusRing(/* element */)
    {
        // TODO
    };

    drawCustomFocusRing(/* element */): bool
    {
        // TODO
        return false;
    };

    scrollPathIntoView()
    {
        // TODO
    };

    clip()
    {
        // Get copy of sub paths
        var points, numPoints, i, j, point, x, y;
        var numClipSubPaths = 0;
        var clipSubPaths = [];

        var subPaths = this.subPaths;
        var numSubPaths = subPaths.length;
        if (numSubPaths > 0)
        {
            clipSubPaths.length = numSubPaths;
            i = 0;
            do
            {
                points = subPaths[i];
                if (points.length > 2)
                {
                    clipSubPaths[numClipSubPaths] = points.slice();
                    numClipSubPaths += 1;
                }

                i += 1;
            }
            while (i < numSubPaths);
        }

        var currentSubPath = this.currentSubPath;
        if (currentSubPath.length > 2)
        {
            clipSubPaths[numClipSubPaths] = currentSubPath.slice(0);
            numClipSubPaths += 1;
        }

        if (numClipSubPaths === 0)
        {
            return;
        }

        var autoClose = this.autoClose;

        // Calculate bounding box of current path
        var minX, minY, maxX, maxY;
        i = 0;
        do
        {
            points = clipSubPaths[i];
            numPoints = autoClose(points, points.length);

            j = 0;

            if (minX === undefined)
            {
                point = points[0];
                minX = maxX = point[0];
                minY = maxY = point[1];
                j = 1;
            }

            do
            {
                point = points[j];
                x = point[0];
                y = point[1];

                if (minX > x)
                {
                    minX = x;
                }
                else if (maxX < x)
                {
                    maxX = x;
                }

                if (minY > y)
                {
                    minY = y;
                }
                else if (maxY < y)
                {
                    maxY = y;
                }

                j += 1;
            }
            while (j < numPoints);

            i += 1;
        }
        while (i < numClipSubPaths);

        // Intersect current clipExtents with bounding boxes of current paths
        var clipExtents = this.clipExtents;
        var minClipX = clipExtents[0];
        var minClipY = clipExtents[1];
        var maxClipX = clipExtents[2];
        var maxClipY = clipExtents[3];
        minClipX = (minClipX > minX ? minClipX : minX);
        minClipY = (minClipY > minY ? minClipY : minY);
        maxClipX = (maxClipX < maxX ? maxClipX : maxX);
        maxClipY = (maxClipY < maxY ? maxClipY : maxY);
        clipExtents[0] = minClipX;
        clipExtents[1] = minClipY;
        clipExtents[2] = maxClipX;
        clipExtents[3] = maxClipY;

        // Update scissor rectangle to at least have rectangular clipping
        this.updateScissor();

        // TODO: non rectangular clipping
    };

    isPointInPath(x, y): bool
    {
        var subPaths = this.subPaths;
        var numSubPaths = subPaths.length;
        if (numSubPaths > 0)
        {
            for (var i = 0; i < numSubPaths; i += 1)
            {
                if (this.isPointInSubPath(x, y, subPaths[i]))
                {
                    return true;
                }
            }
        }

        var currentSubPath = this.currentSubPath;
        if (this.isPointInSubPath(x, y, currentSubPath))
        {
            return true;
        }

        return false;
    };

    fillText(text: string, x: number, y: number, maxWidth?)
    {
        if (maxWidth !== undefined && maxWidth <= 0)
        {
            return;
        }

        var fm = this.fm;
        if (!fm)
        {
            return;
        }

        var fontName = this.buildFontName();
        if (!fontName)
        {
            return;
        }

        var font = fm.load(fontName);
        if (!font)
        {
            return;
        }

        if (!maxWidth)
        {
            maxWidth = this.width;
        }

        var color;

        var style = this.fillStyle;
        if (typeof style === 'string') // CSS Color
        {
            color = this.parseColor(style);
        }
        else
        {
            // TODO
            color = this.v4One;
        }

        // No need to pre-multiply RGB by alpha for texture shaders
        var globalAlpha = this.globalAlpha;
        if (globalAlpha < 1.0)
        {
            color = this.md.v4Build(color[0], color[1], color[2], (color[3] * globalAlpha), this.tempColor);
        }

        var technique = this.textureTechniques[this.globalCompositeOperation];
        if (!technique)
        {
            throw "Unknown composite operation: " + this.globalCompositeOperation;
        }

        this.setTechniqueWithColor(technique, this.screen, color);

        var rect = this.transformRect(x, y, maxWidth, maxWidth, this.tempRect);
        x = rect[4];
        y = rect[5];
        var w = (rect[2] - x);
        var h = (rect[3] - y);

        var scale = this.calculateFontScale(font);

        if (this.textBaseline === 'alphabetic')
        {
            y -= (font.baseline * scale);
        }
        else if (this.textBaseline === 'middle')
        {
            y -= ((font.baseline * 0.5) * scale);
        }
        else if (this.textBaseline === 'bottom' ||
                 this.textBaseline === 'ideographic')
        {
            y -= (font.lineHeight * scale);
        }

        var params = {
            rect : [x, y, w, h],
            scale : scale,
            spacing : 0,
            alignment: undefined
        };

        if (this.textAlign === "left" ||
            this.textAlign === "start")
        {
            params.alignment = 0;
        }
        else if (this.textAlign === "right" ||
                 this.textAlign === "end")
        {
            params.alignment = 2;
        }
        else
        {
            params.alignment = 1;
        }

        font.drawTextRect(text, params);

        // Clear stream cache because drawTextRect sets its own
        this.activeVertexBuffer = null;
    };

    strokeText(/* text, x, y, maxWidth */)
    {
        // TODO
    };

    measureText(text) : { width: number; }
    {
        var fm = this.fm;
        if (fm)
        {
            var fontName = this.buildFontName();
            if (fontName)
            {
                var font = fm.load(fontName);
                if (font)
                {
                    var scale = this.calculateFontScale(font);
                    return {
                        width : font.calculateTextDimensions(text, scale, 0).width
                    };
                }
            }
        }

        return {
            width : 0
        };
    };

    drawImage(image, _x?, _y?, _width?, _height?)
    {
        var dx, dy, dw, dh, u0, v0, u1, v1;

        if (arguments.length >= 7)
        {
            var sx = arguments[1];
            var sy = arguments[2];
            var sw = arguments[3];
            var sh = arguments[4];

            dx = arguments[5];
            dy = arguments[6];

            if (arguments.length >= 9)
            {
                dw = arguments[7];
                dh = arguments[8];
            }
            else
            {
                dw = sw;
                dh = sh;
            }

            var invImageWidth  = (1.0 / image.width);
            var invImageHeight = (1.0 / image.height);
            u0 = (sx * invImageWidth);
            v0 = (sy * invImageHeight);
            u1 = ((sx + sw) * invImageWidth);
            v1 = ((sy + sh) * invImageHeight);
        }
        else
        {
            dx = arguments[1];
            dy = arguments[2];

            if (arguments.length >= 5)
            {
                dw = arguments[3];
                dh = arguments[4];
            }
            else
            {
                dw = image.width;
                dh = image.height;
            }

            u0 = 0;
            v0 = 0;
            u1 = 1;
            v1 = 1;
        }

        if (dw > 0 && dh > 0)
        {
            var bufferData = this.getTextureBuffer(4);
            if (bufferData)
            {
                var rect = this.transformRect(dx, dy, dw, dh, this.tempRect);

                bufferData[0] = rect[0];
                bufferData[1] = rect[1];
                bufferData[2] = u0;
                bufferData[3] = v1;
                bufferData[4] = rect[2];
                bufferData[5] = rect[3];
                bufferData[6] = u1;
                bufferData[7] = v1;
                bufferData[8] = rect[4];
                bufferData[9] = rect[5];
                bufferData[10] = u0;
                bufferData[11] = v0;
                bufferData[12] = rect[6];
                bufferData[13] = rect[7];
                bufferData[14] = u1;
                bufferData[15] = v0;

                this.fillTextureBuffer(bufferData, 4);

                var primitive = this.triangleStripPrimitive;
                var gd = this.gd;

                if (this.setShadowStyle(image, true))
                {
                    gd.draw(primitive, 4);
                }

                var technique = this.textureTechniques[this.globalCompositeOperation];
                if (!technique)
                {
                    throw "Unknown composite operation: " + this.globalCompositeOperation;
                }

                var color = this.parseColor(this.imageColor);

                var globalAlpha = this.globalAlpha;
                if (globalAlpha < 1.0)
                {
                    color = this.md.v4Build(color[0],
                                            color[1],
                                            color[2],
                                            (color[3] * globalAlpha),
                                            this.tempColor);
                }

                this.setTechniqueWithColor(technique, this.screen, color);

                technique['texture'] = image;

                gd.draw(primitive, 4);
            }
        }
    };

    createImageData() : CanvasImageData
    {
        var sw, sh;
        if (arguments.length === 2)
        {
            sw = arguments[0];
            sh = arguments[1];
        }
        else if (arguments.length === 1)
        {
            var imagedata = arguments[0];
            sw = imagedata.width;
            sh = imagedata.height;
        }
        else
        {
            throw "Wrong arguments";
        }

        var numValues = (sw * sh * 4);
        var pixelData = new Array(numValues);
        for (var i = 0; i < numValues; i += 1)
        {
            pixelData[i] = 0;
        }

        return {
            width : sw,
            height : sh,
            data : pixelData
        };
    };

    getImageData(sx, sy, sw, sh): CanvasImageData
    {
        var gd = this.gd;

        // Convert from top-left to bottom-left
        sy = (this.height - (sy + sh));

        var pixelData = gd.getScreenshot(false, sx, sy, sw, sh);

        return {
            width : sw,
            height : sh,
            data : pixelData
        };
    };

    putImageData(imagedata, dx, dy)
    {
        if (!imagedata || !imagedata.data)
        {
            throw 'TYPE_MISMATCH_ERR';
        }

        var imageWidth  = imagedata.width;
        var imageHeight = imagedata.height;

        var dirtyX, dirtyY, dirtyWidth, dirtyHeight;
        if (arguments.length >= 7)
        {
            dirtyX = arguments[3];
            dirtyY = arguments[4];
            dirtyWidth = arguments[5];
            dirtyHeight = arguments[6];
        }
        else
        {
            dirtyX = 0;
            dirtyY = 0;
            dirtyWidth = imageWidth;
            dirtyHeight = imageHeight;
        }

        if (dirtyWidth && dirtyHeight)
        {
            var gd = this.gd;

            var tempImage = this.tempImage;
            if (tempImage === null ||
                tempImage.width !== dirtyWidth ||
                tempImage.height !== dirtyHeight)
            {
                this.tempImage = tempImage = gd.createTexture({
                        name    : ('imageData:' + dirtyWidth + 'x' + dirtyHeight),
                        width   : dirtyWidth,
                        height  : dirtyHeight,
                        depth   : 1,
                        format  : gd.PIXELFORMAT_R8G8B8A8,
                        cubemap : false,
                        mipmaps : false
                    });
            }

            tempImage.setData(imagedata.data);

            var viewport = this.viewport;
            gd.setScissor(viewport[0], viewport[1], viewport[2], viewport[3]);

            var bufferData = this.getTextureBuffer(4);
            if (bufferData)
            {
                var invCanvasWidth  = 2.0 / this.width;
                var invCanvasHeight = 2.0 / this.height;
                var x0 = ((dx * invCanvasWidth)  - 1);
                var y0 = (1 - (dy * invCanvasHeight));
                var x1 = (((dx + dirtyWidth)  * invCanvasWidth)  - 1);
                var y1 = (1 - ((dy + dirtyHeight) * invCanvasHeight));

                var invImageWidth  = 1.0 / imageWidth;
                var invImageHeight = 1.0 / imageHeight;
                var u0 = (dirtyX * invImageWidth);
                var v0 = (dirtyY * invImageHeight);
                var u1 = ((dirtyX + dirtyWidth)  * invImageWidth);
                var v1 = ((dirtyY + dirtyHeight) * invImageHeight);

                bufferData[0] = x0;
                bufferData[1] = y1;
                bufferData[2] = u0;
                bufferData[3] = v1;
                bufferData[4] = x1;
                bufferData[5] = y1;
                bufferData[6] = u1;
                bufferData[7] = v1;
                bufferData[8] = x0;
                bufferData[9] = y0;
                bufferData[10] = u0;
                bufferData[11] = v0;
                bufferData[12] = x1;
                bufferData[13] = y0;
                bufferData[14] = u1;
                bufferData[15] = v0;

                this.fillTextureBuffer(bufferData, 4);

                var technique = this.imageTechnique;

                gd.setTechnique(technique);
                this.activeTechnique = null;

                technique['image'] = tempImage;

                gd.draw(this.triangleStripPrimitive, 4);
            }

            this.updateScissor();
        }
    };

    //
    // Public Turbulenz Canvas Context API
    //
    beginFrame(target, viewportRect): bool
    {
        if (this.target)
        {
            throw '"endFrame" was never called!';
        }

        var gd = this.gd;

        if (!target)
        {
            target = gd;
        }

        this.target = target;

        gd.setViewport(0, 0, target.width, target.height);

        var viewport = this.viewport;
        if (viewportRect)
        {
            viewport[0] =  viewportRect[0];
            viewport[1] =  viewportRect[1];
            viewport[2] =  viewportRect[2];
            viewport[3] =  viewportRect[3];
        }
        else
        {
            viewport[0] =  0;
            viewport[1] =  0;
            viewport[2] =  target.width;
            viewport[3] =  target.height;
        }

        var canvas = this.canvas;
        var width = canvas.width;
        var height = canvas.height;

        this.updateScreenScale();

        this.updateScissor();

        this.pixelRatio = Math.max((viewport[2] / width), (viewport[3] / height));

        this.activeVertexBuffer = null;
        this.activeTechnique = null;
        this.flatOffset = 0;

        /* This code is required if Object.defineProperty does not work */
        if (width !== this.width ||
            height !== this.height)
        {
            this.width = width;
            this.height = height;

            this.resetState();

            this.clearRect(0, 0, width, height);
        }

        return true;
    };

    endFrame()
    {
        var target = this.target;
        if (!target)
        {
            throw '"beginFrame" was never called!';
        }

        this.target = null;

        this.gd.setScissor(0, 0, target.width, target.height);
    };

    //
    // Private API
    //
    setWidth(width)
    {
        this.width = width;

        this.resetState();

        if (this.target)
        {
            this.updateScreenScale();

            this.clearRect(0, 0, width, this.height);
        }
    };

    setHeight(height)
    {
        this.height = height;

        this.resetState();

        if (this.target)
        {
            this.updateScreenScale();

            this.clearRect(0, 0, this.width, height);
        }
    };

    createStatesObject(): any // TODO
    {
        return {
            globalAlpha : 0.0,
            globalCompositeOperation : null,
            strokeStyle : null,
            fillStyle : null,
            lineWidth : 0.0,
            lineCap : null,
            lineJoin : null,
            miterLimit : 0,
            shadowOffsetX : 0,
            shadowOffsetY : 0,
            shadowBlur : 0,
            shadowColor : null,
            font : null,
            textAlign : null,
            textBaseline : null,
            imageColor: null,
            matrix : new this.floatArrayConstructor(6),
            scale : null,
            translate : null,
            transform : null,
            setTransform : null,
            transformPoint : null,
            transformRect : null,
            clipExtents : new this.floatArrayConstructor(4)
        };
    };

    setStates(dest, src)
    {
        dest.globalAlpha = src.globalAlpha;
        dest.globalCompositeOperation = src.globalCompositeOperation;
        dest.strokeStyle = src.strokeStyle;
        dest.fillStyle = src.fillStyle;
        dest.lineWidth = src.lineWidth;
        dest.lineCap = src.lineCap;
        dest.lineJoin = src.lineJoin;
        dest.miterLimit = src.miterLimit;
        dest.shadowOffsetX = src.shadowOffsetX;
        dest.shadowOffsetY = src.shadowOffsetY;
        dest.shadowBlur = src.shadowBlur;
        dest.shadowColor = src.shadowColor;
        dest.font = src.font;
        dest.textAlign = src.textAlign;
        dest.textBaseline = src.textBaseline;
        dest.imageColor = src.imageColor;

        // Have to copy array elements because if we keep a reference we modify the default ones
        var destMatrix = dest.matrix;
        var srcMatrix = src.matrix;
        destMatrix[0] = srcMatrix[0];
        destMatrix[1] = srcMatrix[1];
        destMatrix[2] = srcMatrix[2];
        destMatrix[3] = srcMatrix[3];
        destMatrix[4] = srcMatrix[4];
        destMatrix[5] = srcMatrix[5];

        dest.scale = src.scale;
        dest.translate = src.translate;
        dest.transform = src.transform;
        dest.setTransform = src.setTransform;
        dest.transformPoint = src.transformPoint;
        dest.transformRect = src.transformRect;

        var destExtents = dest.clipExtents;
        var srcExtents = src.clipExtents;
        destExtents[0] = srcExtents[0];
        destExtents[1] = srcExtents[1];
        destExtents[2] = srcExtents[2];
        destExtents[3] = srcExtents[3];

        return dest;
    };

    resetState()
    {
        this.numStatesInStack = 0;

        this.beginPath();

        this.setStates(this, this.defaultStates);

        var clipExtents = this.clipExtents;
        clipExtents[0] = 0;
        clipExtents[1] = 0;
        clipExtents[2] = this.width;
        clipExtents[3] = this.height;

        if (this.target)
        {
            this.updateScissor();
        }
    };

    updateScreenScale()
    {
        var screen = this.screen;
        var target = this.target;
        var viewport = this.viewport;
        var targetWidth = target.width;
        var targetHeight = target.height;

        screen[0] = ( 2 * viewport[2]) / (this.width * targetWidth);
        screen[1] = (-2 * viewport[3]) / (this.height * targetHeight);
        screen[2] = -1 + (2 * viewport[0] / targetWidth);
        screen[3] =  1 - (2 * (viewport[1] + viewport[3] - targetHeight) / targetHeight);
    };

    updateScissor()
    {
        // Set scissor rectangle to intersection of viewport with clipExtents,
        // in OpengGL screen coordinates (0, 0) at bottom
        var viewport = this.viewport;
        var viewportX = viewport[0];
        var viewportY = viewport[1];
        var viewportWidth = viewport[2];
        var viewportHeight = viewport[3];

        var deviceScaleX = (viewportWidth / this.width);
        var deviceScaleY = (viewportHeight / this.height);

        var clipExtents = this.clipExtents;
        var minClipX = (clipExtents[0] * deviceScaleX);
        var minClipY = (clipExtents[1] * deviceScaleY);
        var maxClipX = (clipExtents[2] * deviceScaleX);
        var maxClipY = (clipExtents[3] * deviceScaleY);

        var x = (viewportX + minClipX);
        var y = (viewportY + (viewportHeight - maxClipY));
        var w = (maxClipX - minClipX);
        var h = (maxClipY - minClipY);

        if (x < 0)
        {
            x = 0;
        }
        if (y < 0)
        {
            y = 0;
        }

        var target = this.target;
        if ((x + w) > target.width)
        {
            w = (target.width - x);
        }
        if ((y + h) > target.height)
        {
            h = (target.height - y);
        }

        this.gd.setScissor(x, y, w, h);
    };

    setFontManager(fm)
    {
        this.fm = fm;
    };

    buildFontName()
    {
        var fontName;
        var font = this.font;
        var lastSpace = font.lastIndexOf(" ");
        if (lastSpace !== -1)
        {
            fontName = ('fonts/' + font.substr(lastSpace + 1) + '.fnt');
        }
        return fontName;
    };

    calculateFontScale(font)
    {
        var requiredHeight = parseInt(this.font, 10);
        if (isNaN(requiredHeight))
        {
            return 1;
        }
        else
        {
            return (requiredHeight / font.lineHeight);
        }
    };

    transformPoint(x, y)
    {
        var m = this.matrix;
        return [((x * m[0]) + (y * m[1]) + m[2]),
                ((x * m[3]) + (y * m[4]) + m[5])];
    };

    transformRect(x, y, w, h, rect)
    {
        var m = this.matrix;
        var m0 = m[0];
        var m1 = m[1];
        var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];

        var bx = ((x * m0) + (y * m1) + m2);
        var by = ((x * m3) + (y * m4) + m5);
        var dx0 = (w * m0);
        var dy0 = (h * m1);
        var dx1 = (w * m3);
        var dy1 = (h * m4);

        rect[0] = (bx + dy0);
        rect[1] = (by + dy1);
        rect[2] = (bx + dx0 + dy0);
        rect[3] = (by + dx1 + dy1);
        rect[4] = bx;
        rect[5] = by;
        rect[6] = (bx + dx0);
        rect[7] = (by + dx1);

        return rect;
    };

    transformPointTranslate(x: number, y: number) : any[]
    {
        var m = this.matrix;
        return [(x + m[2]),
                (y + m[5])];
    };

    transformRectTranslate(x: number, y: number, w: number, h: number, rect: any[]) : any[]
    {
        var m = this.matrix;
        var x0 = (x + m[2]);
        var y0 = (y + m[5]);
        var x1 = (x0 + w);
        var y1 = (y0 + h);

        rect[0] = x0;
        rect[1] = y1;
        rect[2] = x1;
        rect[3] = y1;
        rect[4] = x0;
        rect[5] = y0;
        rect[6] = x1;
        rect[7] = y0;

        return rect;
    };

    transformPointIdentity(x: number, y: number) : any[]
    {
        return [x, y];
    };

    transformRectIdentity(x: number, y: number, w: number, h: number, rect: any[]) : any[]
    {
        var x1 = (x + w);
        var y1 = (y + h);

        rect[0] = x;
        rect[1] = y1;
        rect[2] = x1;
        rect[3] = y1;
        rect[4] = x;
        rect[5] = y;
        rect[6] = x1;
        rect[7] = y;

        return rect;
    };

    untransformPoint(p)
    {
        if (this.transformPoint === this.transformPointIdentity)
        {
            return p;
        }

        var m = this.matrix;
        var x = p[0];
        var y = p[1];

        if (this.transformPoint === this.transformPointTranslate)
        {
            return [(x - m[2]),
                    (y - m[5])];
        }

        var m0 = m[0];
        var m1 = m[1];
        var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];

        // invert matrix
        var r0, r1, r2, r3, r4, r5;

        var det = (m0 * m4 - m1 * m3);
        if (det === 0.0)
        {
            return [x, y];
        }

        r0 = m4;
        r3 = -m3;
        r1 = -m1;
        r4 = m0;
        r2 = (m1 * m5 - m4 * m2);
        r5 = (m2 * m3 - m0 * m5);

        if (det !== 1.0)
        {
            var detrecp = (1.0 / det);
            r0 *= detrecp;
            r3 *= detrecp;
            r1 *= detrecp;
            r4 *= detrecp;
            r2 *= detrecp;
            r5 *= detrecp;
        }

        return [((x * r0) + (y * r1) + r2),
                ((x * r3) + (y * r4) + r5)];
    };

    calculateGradientUVtransform(gradientMatrix)
    {
        var m = this.matrix;
        var m0 = m[0];
        var m1 = m[1];
        var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];

        var g0 = gradientMatrix[0];
        var g1 = gradientMatrix[1];
        var g2 = gradientMatrix[2];
        var g3 = gradientMatrix[3];
        var g4 = gradientMatrix[4];
        var g5 = gradientMatrix[5];

        // invert matrix
        var r0, r1, r2, r3, r4, r5;

        var det = (m0 * m4 - m1 * m3);
        if (det === 0.0)
        {
            r0 = 1.0;
            r3 = 0.0;
            r1 = 0.0;
            r4 = 1.0;
            r2 = 0.0;
            r5 = 0.0;
        }
        else
        {
            r0 = m4;
            r3 = -m3;
            r1 = -m1;
            r4 = m0;
            r2 = (m1 * m5 - m4 * m2);
            r5 = (m2 * m3 - m0 * m5);

            if (det !== 1.0)
            {
                var detrecp = (1.0 / det);
                r0 *= detrecp;
                r3 *= detrecp;
                r1 *= detrecp;
                r4 *= detrecp;
                r2 *= detrecp;
                r5 *= detrecp;
            }
        }

        var uvtransform = this.uvtransform;
        uvtransform[0] = (g0 * r0 + g1 * r3);
        uvtransform[1] = (g0 * r1 + g1 * r4);
        uvtransform[2] = (g0 * r2 + g1 * r5 + g2);
        uvtransform[3] = (g3 * r0 + g4 * r3);
        uvtransform[4] = (g3 * r1 + g4 * r4);
        uvtransform[5] = (g3 * r2 + g4 * r5 + g5);
        return uvtransform;
    };

    calculatePatternUVtransform(imageWidth, imageHeight)
    {
        var m = this.matrix;
        var m0 = m[0];
        var m1 = m[1];
        var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];

        var invWidth = (1.0 / imageWidth);
        var invHeight = (1.0 / imageHeight);

        // invert matrix
        var r0, r1, r2, r3, r4, r5;

        var det = (m0 * m4 - m1 * m3);
        if (det === 0.0)
        {
            r0 = 1.0;
            r3 = 0.0;
            r1 = 0.0;
            r4 = 1.0;
            r2 = 0.0;
            r5 = 0.0;
        }
        else
        {
            r0 = m4;
            r3 = -m3;
            r1 = -m1;
            r4 = m0;
            r2 = (m1 * m5 - m4 * m2);
            r5 = (m2 * m3 - m0 * m5);

            if (det !== 1.0)
            {
                var detrecp = (1.0 / det);
                r0 *= detrecp;
                r3 *= detrecp;
                r1 *= detrecp;
                r4 *= detrecp;
                r2 *= detrecp;
                r5 *= detrecp;
            }
        }

        var uvtransform = this.uvtransform;
        uvtransform[0] = (invWidth * r0);
        uvtransform[1] = (invWidth * r1);
        uvtransform[2] = (invWidth * r2);
        uvtransform[3] = (invHeight * r3);
        uvtransform[4] = (invHeight * r4);
        uvtransform[5] = (invHeight * r5);
        return uvtransform;
    };

    setShadowStyle(style, onlyTexture?): bool
    {
        var shadowOffsetX = this.shadowOffsetX;
        var shadowOffsetY = this.shadowOffsetY;
        if (shadowOffsetX < 1 && shadowOffsetY < 1)
        {
            return false;
        }

        if (this.globalCompositeOperation !== 'source-over')
        {
            return false;
        }

        var color = this.parseColor(this.shadowColor);

        var alpha = (color[3] * this.globalAlpha);

        if (this.shadowBlur > 0)
        {
            alpha *= 0.5;
        }

        if (alpha < 0.004)
        {
            return false;
        }

        if (alpha < 1.0)
        {
            color = this.md.v4Build((color[0] * alpha),
                                    (color[1] * alpha),
                                    (color[2] * alpha),
                                    alpha,
                                    this.tempColor);
        }

        var screen = this.screen;
        var screenScaleX = screen[0];
        var screenScaleY = screen[1];
        screen = this.md.v4Build(screenScaleX, screenScaleY,
                                (screen[2] + (shadowOffsetX * screenScaleX)),
                                (screen[3] + (shadowOffsetY * screenScaleY)),
                                this.tempScreen);

        var technique;

        if (typeof style !== 'string' &&
            !style.opaque)
        {
            if (onlyTexture) // drawImage
            {
                technique = this.textureShadowTechnique;

                this.setTechniqueWithColor(technique, screen, color);

                technique.texture = style;
            }
            else if (style.stops) // Gradient
            {
                var texture = style.updateTexture(this.gd);
                var gradientWidth = texture.width;
                var gradientHeight = texture.height;

                if (!gradientWidth || !gradientHeight)
                {
                    throw 'INVALID_STATE_ERR';
                }

                technique = this.gradientShadowTechnique;

                this.setTechniqueWithColor(technique, screen, color);

                technique.uvtransform = this.calculateGradientUVtransform(style.matrix);
                technique.gradient = texture;
            }
            else // Pattern
            {
                var imageWidth = style.width;
                var imageHeight = style.height;

                if (!imageWidth || !imageHeight)
                {
                    throw 'INVALID_STATE_ERR';
                }

                technique = this.patternShadowTechnique;

                this.setTechniqueWithColor(technique, screen, color);

                technique.uvtransform = this.calculatePatternUVtransform(imageWidth, imageHeight);
                technique.pattern = style;
            }
        }
        else
        {
            if (alpha < 1.0)
            {
                technique = this.flatTechniques['source-over'];
            }
            else
            {
                technique = this.flatTechniques['copy'];
            }

            this.setTechniqueWithColor(technique, screen, color);
        }

        return true;
    };

    setStyle(style)
    {
        if (!style)
        {
            throw 'INVALID_STATE_ERR';
        }

        var globalCompositeOperation = this.globalCompositeOperation;
        var screen = this.screen;

        var technique;

        if (typeof style === 'string') // CSS Color
        {
            var color = this.parseColor(style);

            var alpha = (color[3] * this.globalAlpha);
            if (alpha < 1.0)
            {
                color = this.md.v4Build((color[0] * alpha),
                                        (color[1] * alpha),
                                        (color[2] * alpha),
                                        alpha,
                                        this.tempColor);
            }

            if (globalCompositeOperation !== 'source-over' ||
                alpha < 1.0)
            {
                technique = this.flatTechniques[globalCompositeOperation];
                if (!technique)
                {
                    throw "Unknown composite operation: " + globalCompositeOperation;
                }
            }
            else
            {
                technique = this.flatTechniques['copy'];
            }

            this.setTechniqueWithColor(technique, screen, color);
        }
        else if (style.stops) // Gradient
        {
            var texture = style.updateTexture(this.gd);
            var gradientWidth = texture.width;
            var gradientHeight = texture.height;

            if (!gradientWidth || !gradientHeight)
            {
                throw 'INVALID_STATE_ERR';
            }

            var globalAlpha = this.globalAlpha;
            if (globalCompositeOperation !== 'source-over' ||
                globalAlpha < 1.0 ||
                !style.opaque)
            {
                technique = this.gradientTechniques[globalCompositeOperation];
                if (!technique)
                {
                    throw "Unknown composite operation: " + globalCompositeOperation;
                }
            }
            else
            {
                technique = this.gradientTechniques['copy'];
            }

            this.setTechniqueWithAlpha(technique, screen, globalAlpha);

            technique.uvtransform = this.calculateGradientUVtransform(style.matrix);
            technique.gradient = texture;
        }
        else // Pattern
        {
            var imageWidth = style.width;
            var imageHeight = style.height;

            if (!imageWidth || !imageHeight)
            {
                throw 'INVALID_STATE_ERR';
            }

            technique = this.patternTechniques[globalCompositeOperation];
            if (!technique)
            {
                throw "Unknown composite operation: " + globalCompositeOperation;
            }

            this.setTechniqueWithAlpha(technique, screen, this.globalAlpha);

            technique.uvtransform = this.calculatePatternUVtransform(imageWidth, imageHeight);
            technique.pattern = style;
        }
    };

    setStream(vertexBuffer: VertexBuffer, semantics: Semantics) : void
    {
        if (this.activeVertexBuffer !== vertexBuffer)
        {
            this.activeVertexBuffer = vertexBuffer;
            this.gd.setStream(vertexBuffer, semantics, 0);
        }
    };

    setTechniqueWithAlpha(technique: Technique, screen: any, alpha: number) : void
    {
        var activeScreen = this.activeScreen;
        var activeColor = this.activeColor;

        if (this.activeTechnique !== technique)
        {
            this.activeTechnique = technique;

            this.gd.setTechnique(technique);

            technique['screen'] = screen;
            technique['alpha'] = alpha;

            activeScreen[0] = screen[0];
            activeScreen[1] = screen[1];
            activeScreen[2] = screen[2];
            activeScreen[3] = screen[3];

            activeColor[3] = alpha;
        }
        else
        {
            if (activeScreen[0] !== screen[0] ||
                activeScreen[1] !== screen[1] ||
                activeScreen[2] !== screen[2] ||
                activeScreen[3] !== screen[3])
            {
                activeScreen[0] = screen[0];
                activeScreen[1] = screen[1];
                activeScreen[2] = screen[2];
                activeScreen[3] = screen[3];

                technique['screen'] = screen;
            }

            if (activeColor[3] !== alpha)
            {
                activeColor[3] = alpha;

                technique['alpha'] = alpha;
            }
        }
    };

    setTechniqueWithColor(technique: Technique, screen: any, color: any) : void
    {
        var activeScreen = this.activeScreen;
        var activeColor = this.activeColor;

        if (this.activeTechnique !== technique)
        {
            this.activeTechnique = technique;

            this.gd.setTechnique(technique);

            technique['screen'] = screen;
            technique['color'] = color;

            activeScreen[0] = screen[0];
            activeScreen[1] = screen[1];
            activeScreen[2] = screen[2];
            activeScreen[3] = screen[3];

            activeColor[0] = color[0];
            activeColor[1] = color[1];
            activeColor[2] = color[2];
            activeColor[3] = color[3];
        }
        else
        {
            if (activeScreen[0] !== screen[0] ||
                activeScreen[1] !== screen[1] ||
                activeScreen[2] !== screen[2] ||
                activeScreen[3] !== screen[3])
            {
                activeScreen[0] = screen[0];
                activeScreen[1] = screen[1];
                activeScreen[2] = screen[2];
                activeScreen[3] = screen[3];

                technique['screen'] = screen;
            }

            if (activeColor[0] !== color[0] ||
                activeColor[1] !== color[1] ||
                activeColor[2] !== color[2] ||
                activeColor[3] !== color[3])
            {
                activeColor[0] = color[0];
                activeColor[1] = color[1];
                activeColor[2] = color[2];
                activeColor[3] = color[3];

                technique['color'] = color;
            }
        }
    };

    parseColor(colorText)
    {
        var color = this.cachedColors[colorText];
        if (color !== undefined)
        {
            return color;
        }

        if (this.numCachedColors >= 1024)
        {
            this.cachedColors = {};
            this.numCachedColors = 0;
        }

        color = parseCSSColor(colorText, this.md.v4BuildZero());
        if (color)
        {
            this.cachedColors[colorText] = color;
            this.numCachedColors += 1;
            return color;
        }
        else
        {
            throw "Unknown color: " + colorText;
        }
    };

    interpolateArc(x, y, radius, startAngle, endAngle, anticlockwise?: bool)
    {
        var cos = Math.cos;
        var sin = Math.sin;
        var pi2 = (Math.PI * 2);

        var points = this.currentSubPath;
        var numPoints = points.length;
        var angle, angleDiff, i, j;

        var angleStep = (2.0 / (radius * this.pixelRatio));

        var m = this.matrix;
        var m0 = (m[0] * radius);
        var m1 = (m[1] * radius);
        var m3 = (m[3] * radius);
        var m4 = (m[4] * radius);

        if (anticlockwise)
        {
            while (endAngle >= startAngle)
            {
                endAngle -= pi2;
            }

            angleDiff = (startAngle - endAngle);
            if (angleDiff >= angleStep)
            {
                for (angle = startAngle; angle > endAngle; angle -= angleStep)
                {
                    i = cos(angle);
                    j = sin(angle);
                    points[numPoints] = [((i * m0) + (j * m1) + x),
                                         ((i * m3) + (j * m4) + y)];
                    numPoints += 1;
                }
            }
        }
        else
        {
            while (endAngle <= startAngle)
            {
                endAngle += pi2;
            }

            angleDiff = (endAngle - startAngle);
            if (angleDiff >= angleStep)
            {
                for (angle = startAngle; angle < endAngle; angle += angleStep)
                {
                    i = cos(angle);
                    j = sin(angle);
                    points[numPoints] = [((i * m0) + (j * m1) + x),
                                         ((i * m3) + (j * m4) + y)];
                    numPoints += 1;
                }
            }
        }

        i = cos(endAngle);
        j = sin(endAngle);
        points[numPoints] = [((i * m0) + (j * m1) + x),
                             ((i * m3) + (j * m4) + y)];
    };

    getFlatBuffer(numVertices)
    {
        var bufferData = this.bufferData;

        var numFloats = (2 * numVertices);
        if (bufferData.length < numFloats)
        {
            this.bufferData = bufferData = new this.floatArrayConstructor(numFloats);
            this.subBufferDataCache = {};
        }
        else if (numFloats < bufferData.length)
        {
            var subBuffer = this.subBufferDataCache[numFloats];
            if (subBuffer === undefined)
            {
                subBuffer = bufferData.subarray(0, numFloats);
                this.subBufferDataCache[numFloats] = subBuffer;
            }
            bufferData = subBuffer;
        }

        return bufferData;
    };

    fillFlatBuffer(bufferData, numVertices)
    {
        var flatVertexBuffer = this.flatVertexBuffer;

        if (flatVertexBuffer.numVertices < numVertices)
        {
            flatVertexBuffer.destroy();

            this.flatVertexBuffer = flatVertexBuffer = this.gd.createVertexBuffer({
                numVertices: numVertices,
                attributes: this.flatVertexFormats,
                dynamic: true,
                'transient': true
            });

            this.flatOffset = 0;
        }
        else if ((this.flatOffset + numVertices) > flatVertexBuffer.numVertices)
        {
            this.flatOffset = 0;
        }

        flatVertexBuffer.setData(bufferData, this.flatOffset, numVertices);

        this.setStream(flatVertexBuffer, this.flatSemantics);
    };

    getTextureBuffer(numVertices)
    {
        var bufferData = this.bufferData;

        var numFloats = (4 * numVertices);
        if (bufferData.length < numFloats)
        {
            this.bufferData = bufferData = new this.floatArrayConstructor(numFloats);
            this.subBufferDataCache = {};
        }
        else if (numFloats < bufferData.length)
        {
            var subBuffer = this.subBufferDataCache[numFloats];
            if (subBuffer === undefined)
            {
                subBuffer = bufferData.subarray(0, numFloats);
                this.subBufferDataCache[numFloats] = subBuffer;
            }
            bufferData = subBuffer;
        }

        return bufferData;
    };

    fillTextureBuffer(bufferData, numVertices)
    {
        var textureVertexBuffer = this.textureVertexBuffer;

        if (textureVertexBuffer.numVertices < numVertices)
        {
            textureVertexBuffer.destroy();
            this.textureVertexBuffer = textureVertexBuffer = null;
            this.textureVertexBuffer = textureVertexBuffer = this.gd.createVertexBuffer({
                numVertices: numVertices,
                attributes: this.textureVertexFormats,
                dynamic: true,
                'transient': true
            });
        }

        textureVertexBuffer.setData(bufferData, 0, numVertices);

        this.setStream(textureVertexBuffer, this.textureSemantics);
    };

    fillFatStrip(points, numPoints, lineWidth)
    {
        var numVertices = 0;

        var bufferData = this.getFlatBuffer(numPoints * 2);
        if (bufferData)
        {
            var p, point, xB, yB, xC, yC, xAB, yAB, xBC, yBC, ln, dx, dy, n, inl, outl;
            var sqrt = Math.sqrt;
            var abs = Math.abs;
            var halfLineWidth = (lineWidth * 0.5);

            point = points[0];
            xB = point[0];
            yB = point[1];

            var lastPoint = points[numPoints - 1];
            var isClosed = (abs(xB - lastPoint[0]) < 1.0 &&
                            abs(yB - lastPoint[1]) < 1.0);
            if (isClosed)
            {
                if (numPoints < 3)
                {
                    return 0;
                }

                point = points[numPoints - 2];
                xAB = (xB - point[0]);
                yAB = (yB - point[1]);
            }
            else
            {
                point = points[1];
                xAB = (point[0] - xB);
                yAB = (point[1] - yB);
            }

            ln = ((xAB * xAB) + (yAB * yAB));
            if (ln > 0.0)
            {
                ln = (1.0 / sqrt(ln));
                xAB *= ln;
                yAB *= ln;
            }

            p = 0;
            n = 0;
            do
            {
                p += 1;
                if (p < numPoints)
                {
                    point = points[p];
                    xC = point[0];
                    yC = point[1];
                }
                else if (isClosed)
                {
                    point = points[1];
                    xC = point[0];
                    yC = point[1];
                }
                else
                {
                    // use perpendicular vector to (xAB, yAB) -> (yAB, -xAB)
                    xAB *= halfLineWidth;
                    yAB *= halfLineWidth;
                    bufferData[n + 0] = xB - yAB;
                    bufferData[n + 1] = yB + xAB;
                    bufferData[n + 2] = xB + yAB;
                    bufferData[n + 3] = yB - xAB;

                    n += 4;
                    numVertices += 2;
                    break;
                }
                xBC = (xC - xB);
                yBC = (yC - yB);
                ln = ((xBC * xBC) + (yBC * yBC));
                if (ln >= 1.0)
                {
                    ln = (1.0 / sqrt(ln));
                    xBC *= ln;
                    yBC *= ln;

                    dx = (xAB + xBC);
                    dy = (yAB + yBC);
                    ln = ((dx * dx) + (dy * dy));
                    if (ln > 0.001)
                    {
                        inl = (lineWidth / ln);
                        outl = (halfLineWidth / sqrt(ln));
                        if ((yAB * xBC) > (xAB * yBC))
                        {
                            ln = inl;
                            inl = outl;
                            outl = ln;
                        }
                    }
                    else
                    {
                        dx = -yAB;
                        dy = xAB;
                        inl = halfLineWidth;
                        outl = halfLineWidth;
                    }

                    // use perpendicular vector to (dx, dy) -> (dy, -dx)
                    bufferData[n + 0] = (xB - (dy * inl));
                    bufferData[n + 1] = (yB + (dx * inl));
                    bufferData[n + 2] = (xB + (dy * outl));
                    bufferData[n + 3] = (yB - (dx * outl));

                    n += 4;
                    numVertices += 2;

                    xB = xC;
                    yB = yC;
                    xAB = xBC;
                    yAB = yBC;
                }
            }
            while (p < numPoints);

            this.fillFlatBuffer(bufferData, numVertices);
        }

        return numVertices;
    };

    autoClose(points, numPoints)
    {
        var firstPoint = points[0];
        var lastPoint = points[numPoints - 1];

        if (firstPoint === lastPoint)
        {
            return numPoints;
        }

        var abs = Math.abs;
        if (abs(firstPoint[0] - lastPoint[0]) < 1.0 &&
            abs(firstPoint[1] - lastPoint[1]) < 1.0)
        {
            return numPoints;
        }

        points[numPoints] = firstPoint;

        return (numPoints + 1);
    };

    isClosed(firstPoint, lastPoint): bool
    {
        if (firstPoint === lastPoint)
        {
            return true;
        }

        var abs = Math.abs;
        if (abs(firstPoint[0] - lastPoint[0]) < 1.0 &&
            abs(firstPoint[1] - lastPoint[1]) < 1.0)
        {
            return true;
        }

        return false;
    };

    canTriangulateAsFan(points, numSegments): bool
    {
        if (numSegments < 4)
        {
            return true;
        }

        var flag = 0;

        /*jshint bitwise: false*/
        var p0 = points[0];
        var p1 = points[1];
        var p0x = p0[0];
        var p0y = p0[1];
        var p1x = p1[0];
        var p1y = p1[1];
        var d10x = (p1x - p0x);
        var d10y = (p1y - p0y);
        var n = 2;
        do
        {
            var p2 = points[n];
            var p2x = p2[0];
            var p2y = p2[1];
            var d20x = (p2x - p0x);
            var d20y = (p2y - p0y);

            var z = ((d10x * d20y) - (d10y * d20x));
            if (z < 0)
            {
                flag |= 1;
            }
            else if (z > 0)
            {
                flag |= 2;
            }

            if (flag === 3)
            {
                return false;
            }

            d10x = d20x;
            d10y = d20y;

            n += 1;
        }
        while (n < numSegments);
        /*jshint bitwise: true*/

        if (flag !== 0)
        {
            return true;
        }

        return false;
    };

    simplifyShape(points: any[]) : number
    {
        var abs = Math.abs;
        var epsilon = (0.5 / this.pixelRatio);
        var stack = this.tempStack;
        var stackSize = 0;
        var first = 0;
        var last = (points.length - 1);
        var p2 = points[last];
        var p2x = p2[0];
        var p2y = p2[1];
        var n, dist;

        for (;;)
        {
            var p0 = points[first];
            var p0x = p0[0];
            var p0y = p0[1];
            var d20x = (p2x - p0x);
            var d20y = (p2y - p0y);
            var second = (first + 1);

            var maxDist = epsilon;
            var middle = -1;

            if (abs(d20x) < epsilon)
            {
                for (n = second; n < last; n += 1)
                {
                    dist = abs(points[n][0] - p2x);
                    if (maxDist < dist)
                    {
                        maxDist = dist;
                        middle = n;
                    }
                }
            }
            else if (abs(d20y) < epsilon)
            {
                for (n = second; n < last; n += 1)
                {
                    dist = abs(points[n][1] - p2y);
                    if (maxDist < dist)
                    {
                        maxDist = dist;
                        middle = n;
                    }
                }
            }
            else
            {
                var slope = (d20y / d20x);
                var intercept = (p0y - (slope * p0x));
                var p1;
                maxDist *= Math.sqrt((slope * slope) + 1);
                for (n = second; n < last; n += 1)
                {
                    p1 = points[n];
                    dist = abs((slope * p1[0]) - p1[1] + intercept);
                    if (maxDist < dist)
                    {
                        maxDist = dist;
                        middle = n;
                    }
                }
            }

            if (middle === -1)
            {
                if (last === (points.length - 1))
                {
                    points[second] = p2;
                    points.length = (second + 1);
                }
                else
                {
                    points.splice(second, (last - second));
                }

                if (stackSize === 0)
                {
                    break;
                }
                else
                {
                    stackSize -= 2;
                    first = stack[stackSize];
                    last = stack[stackSize + 1];
                    p2 = points[last];
                    p2x = p2[0];
                    p2y = p2[1];
                }
            }
            else
            {
                if (second < middle)
                {
                    if ((middle + 1) < last)
                    {
                        stack[stackSize] = first;
                        stack[stackSize + 1] = middle;
                        stackSize += 2;

                        first = middle;
                    }
                    else
                    {
                        last = middle;
                        p2 = points[last];
                        p2x = p2[0];
                        p2y = p2[1];
                    }
                }
                else
                {
                    if ((middle + 1) < last)
                    {
                        first = middle;
                    }
                    else
                    {
                        if (stackSize === 0)
                        {
                            break;
                        }
                        else
                        {
                            stackSize -= 2;
                            first = stack[stackSize];
                            last = stack[stackSize + 1];
                            p2 = points[last];
                            p2x = p2[0];
                            p2y = p2[1];
                        }
                    }
                }
            }
        }

        return (points.length - 1);
    }

    calculateArea(points, numPoints): number
    {
        // Dan Sunday, "Fast Polygon Area and Newell Normal Computation"
        var area = 0;
        var p0 = points[numPoints - 2];
        var p1 = points[numPoints - 1];
        var p = 0;
        do
        {
            var p2 = points[p];
            area += p1[0] * (p2[1] - p0[1]);
            p0 = p1;
            p1 = p2;

            p += 1;
        }
        while (p < numPoints);
        return (area * 0.5);
    };

    triangulateAsFan(points, numSegments, vertices, numVertices)
    {
        var p0 = points[0];
        var p1 = points[1];
        var p = 2;
        do
        {
            var p2 = points[p];
            vertices[numVertices] = p0;
            vertices[numVertices + 1] = p1;
            vertices[numVertices + 2] = p2;
            numVertices += 3;
            p1 = p2;
            p += 1;
        }
        while (p < numSegments);

        return numVertices;
    };

    getAngles(points: any[], numSegments: number, angles: any[]): number
    {
        var p0 = points[0];
        var p1 = points[1];
        var p0x = p0[0];
        var p0y = p0[1];
        var p1x = p1[0];
        var p1y = p1[1];
        var d10x = (p1x - p0x);
        var d10y = (p1y - p0y);
        var d10l = ((d10x * d10x) + (d10y * d10y));
        var n = 2;
        var sqrt = Math.sqrt;
        var abs = Math.abs;
        var angle;
        do
        {
            var p2 = points[n];
            var p2x = p2[0];
            var p2y = p2[1];
            var d20x = (p2x - p0x);
            var d20y = (p2y - p0y);
            var d20l = ((d20x * d20x) + (d20y * d20y));

            angle = (((d10x * d20y) - (d10y * d20x)) / sqrt(d10l * d20l));
            angles[n - 2] = ((angle * 100) | 0);
            // Increase the 100 to increase precision if caching matches too dissimilar shapes

            d10x = d20x;
            d10y = d20y;
            d10l = d20l;

            n += 1;
        }
        while (n < numSegments);

        return (n - 2);
    };

    lowerBound(bin: any[], data: number[], length: number) : number
    {
        var first: number = 0;
        var count: number = (bin.length >>> 1); // Bin elements ocupy two slots, divide by 2
        var step: number, middle : number, binIndex:number, diff: number;
        var diff: number, n: number;
        var a: number[];

        while (0 < count)
        {
            step = (count >>> 1);
            middle = (first + step);
            binIndex = ((middle << 1) + 1); // Bin elements have the data on the second slot

            n = 0;
            a = bin[binIndex];
            for (;;)
            {
                diff = (a[n] - data[n]);
                if (diff < 0)
                {
                    first = (middle + 1);
                    count -= (step + 1);
                    break;
                }
                else if (diff > 0)
                {
                    count = step;
                    break;
                }

                n += 1;
                if (n >= length)
                {
                    // This would be a non-zero negative value to signal that we found an identical copy
                    return -binIndex;
                }
            }
        }

        return (first << 1); // Bin elements ocupy two slots, multiply by 2
    }

    triangulateConcaveCached(points, numSegments, vertices, numVertices)
    {
        var lowerIndex;

        var angles = this.tempAngles;
        var numAngles = this.getAngles(points, numSegments, angles);

        var dataBins = this.cachedTriangulation;
        var dataBin = dataBins[numAngles];
        if (dataBin === undefined)
        {
            dataBins[numAngles] = dataBin = [];
            lowerIndex = 0;
        }
        else
        {
            lowerIndex = this.lowerBound(dataBin, angles, numAngles);
        }

        // Check if we found an identical copy
        if (lowerIndex < 0)
        {
            lowerIndex = ((-lowerIndex) - 1);
            numVertices = this.expandIndices(points, vertices, numVertices, dataBin[lowerIndex]);
        }
        else
        {
            var totalArea = this.calculateArea(points, numSegments);
            if (totalArea === 0)
            {
                return numVertices;
            }

            var numPoints = (numSegments + 1);
            var n;
            for (n = 0; n < numPoints; n += 1)
            {
                points[n][2] = n;
            }

            var oldNumVertices = numVertices;
            numVertices = this.triangulateConcave(points, numSegments,
                                                  vertices, numVertices,
                                                  false,
                                                  totalArea);

            var numCachedIndices = (numVertices - oldNumVertices);
            var cachedIndices = (numPoints < 256 ?
                                 new this.byteArrayConstructor(numCachedIndices) :
                                 new this.shortArrayConstructor(numCachedIndices));
            for (n = 0; n < numCachedIndices; n += 1)
            {
                cachedIndices[n] = vertices[oldNumVertices + n][2];
            }

            if (dataBin.length >= 1024)
            {
                dataBin.length = 0;
                lowerIndex = 0;
            }

            var clonedAngles = angles.slice(0, numAngles);
            if (lowerIndex < dataBin.length)
            {
                dataBin.splice(lowerIndex, 0, cachedIndices, clonedAngles);
            }
            else
            {
                dataBin.push(cachedIndices, clonedAngles);
            }
        }

        return numVertices;
    };

    expandIndices(points: any[], vertices: any[], numVertices: number, indices: any[]) : number
    {
        var numIndices = indices.length;
        var n, v;
        for (n = 0, v = numVertices; n < numIndices; n += 1, v += 1)
        {
            vertices[v] = points[indices[n]];
        }
        return v;
    };

    triangulateConcave(points: any[], numSegments: number,
                       vertices: any[], numVertices: number,
                       ownPoints: bool,
                       totalArea: number)
    {
        var canTriangulateAsFan = this.canTriangulateAsFan;

        if (ownPoints)
        {
            points.length = numSegments;
        }
        else
        {
            // Need to get a copy because this is a destructive algorithm
            points = points.slice(0, numSegments); // no need to copy the duplicated last point
        }

        // Ear cutting algorithm
        var i0, i1, i2, p0, p1, p2, j, tarea;
        var ax, ay, bx, by, cx, cy;
        var v0x, v0y, v1x, v1y;
        var minX, maxX, minY, maxY;
        var ABx, ABy, ABxy, BCx, BCy, BCxy, CAx, CAy, CAxy;
        var valid, deletePoint;
        do
        {
            i0 = (numSegments - 2);
            i1 = (numSegments - 1);
            i2 = 0;

            p0 = points[i0];
            ax = p0[0];
            ay = p0[1];

            p1 = points[i1];
            bx = p1[0];
            by = p1[1];
            v1x = (bx - ax);
            v1y = (by - ay);

            valid = false;
            do
            {
                deletePoint = false;

                p2 = points[i2];
                cx = p2[0];
                cy = p2[1];
                v0x = (cx - ax);
                v0y = (cy - ay);

                // Calculate triangle area
                tarea = ((v1x * v0y) - (v0x * v1y)); // * 0.5);

                if ((totalArea * tarea) > 0) // same winding order
                {
                    // Calculate triangle extents
                    minX = (ax < bx ? ax : bx);
                    minX = (minX < cx ? minX : cx);

                    maxX = (ax > bx ? ax : bx);
                    maxX = (maxX > cx ? maxX : cx);

                    minY = (ay < by ? ay : by);
                    minY = (minY < cy ? minY : cy);

                    maxY = (ay > by ? ay : by);
                    maxY = (maxY > cy ? maxY : cy);

                    // Compute edge functions constants
                    if (0 < tarea)
                    {
                        ABx = (bx - ax);
                        ABy = (ay - by);
                        ABxy = ((ax * by) - (ay * bx));
                        BCx = (cx - bx);
                        BCy = (by - cy);
                        BCxy = ((bx * cy) - (by * cx));
                        CAx = (ax - cx);
                        CAy = (cy - ay);
                        CAxy = ((cx * ay) - (cy * ax));
                    }
                    else
                    {
                        ABx = (ax - bx);
                        ABy = (by - ay);
                        ABxy = ((ay * bx) - (ax * by));
                        BCx = (bx - cx);
                        BCy = (cy - by);
                        BCxy = ((by * cx) - (bx * cy));
                        CAx = (cx - ax);
                        CAy = (ay - cy);
                        CAxy = ((cy * ax) - (cx * ay));
                    }

                    var overlappingPointArea = 0.1;
                    var overlappingPoint = -1;

                    // Check if triangle overlaps any other point
                    j = 0;
                    do
                    {
                        var p = points[j];
                        var px = p[0];
                        if (minX < px && px < maxX)
                        {
                            var py = p[1];
                            if (minY < py && py < maxY)
                            {
                                // Edge functions
                                var parea = ((CAy * px) + (CAx * py) + CAxy);
                                if (overlappingPointArea < parea &&
                                    0.1 < ((ABy * px) + (ABx * py) + ABxy) &&
                                    0.1 < ((BCy * px) + (BCx * py) + BCxy))
                                {
                                    // If there is at least one vertex inside the triangle,
                                    // find the one closer to i1 vertically by finding the one that has the
                                    // biggest triangle area with i0 and i2
                                    overlappingPointArea = parea;
                                    overlappingPoint = j;
                                }
                            }
                        }
                        j += 1;
                    }
                    while (j < numSegments);

                    if (overlappingPoint < 0)
                    {
                        vertices[numVertices] = p0;
                        vertices[numVertices + 1] = p1;
                        vertices[numVertices + 2] = p2;
                        numVertices += 3;

                        deletePoint = true;
                    }
                    else if (overlappingPoint === ((i1 + 2) % numSegments))
                    {
                        // The diagonal is only splitting the next triangle
                        // Remove the point and keep going
                        i0 = i1;
                        i1 = i2;
                        i2 = overlappingPoint;

                        p0 = p1;
                        ax = bx;
                        ay = by;

                        p1 = p2;

                        p2 = points[i2];
                        cx = p2[0];
                        cy = p2[1];
                        v0x = (cx - ax);
                        v0y = (cy - ay);

                        vertices[numVertices] = p0;
                        vertices[numVertices + 1] = p1;
                        vertices[numVertices + 2] = p2;
                        numVertices += 3;

                        deletePoint = true;
                    }
                    else if (i1 === ((overlappingPoint + 2) % numSegments))
                    {
                        // The diagonal is only splitting the previous triangle
                        // Remove the point and keep going
                        i2 = i1;
                        i1 = i0;
                        i0 = overlappingPoint;

                        p2 = p1;
                        cx = bx;
                        cy = by;

                        p1 = p0;

                        p0 = points[i0];
                        ax = p0[0];
                        ay = p0[1];

                        v0x = (cx - ax);
                        v0y = (cy - ay);

                        vertices[numVertices] = p0;
                        vertices[numVertices + 1] = p1;
                        vertices[numVertices + 2] = p2;
                        numVertices += 3;

                        deletePoint = true;
                    }
                    else
                    {
                         // Found a diagonal
                        var d0, d1;
                        if (i1 < overlappingPoint)
                        {
                            d0 = i1;
                            d1 = overlappingPoint;
                        }
                        else
                        {
                            d0 = overlappingPoint;
                            d1 = i1;
                        }

                        var dn = (d1 - d0 + 1);
                        var pointsA, pointsB;
                        if (dn <= (points.length - dn + 2))
                        {
                            pointsA = points.splice(d0, dn, points[d0], points[d1]);
                            pointsB = points;
                        }
                        else
                        {
                            pointsB = points.splice(d0, dn, points[d0], points[d1]);
                            pointsA = points;
                        }
                        points = null;

                        var numSegmentsA = pointsA.length;
                        if (numSegmentsA === 3)
                        {
                            vertices[numVertices] = pointsA[0];
                            vertices[numVertices + 1] = pointsA[1];
                            vertices[numVertices + 2] = pointsA[2];
                            numVertices += 3;
                        }
                        else
                        {
                            pointsA[numSegmentsA] = pointsA[0];

                            if (canTriangulateAsFan(pointsA, numSegmentsA))
                            {
                                numVertices = this.triangulateAsFan(pointsA, numSegmentsA, vertices, numVertices);
                            }
                            else
                            {
                                numVertices = this.triangulateConcave(pointsA, numSegmentsA,
                                                                      vertices, numVertices,
                                                                      true,
                                                                      totalArea);
                            }
                        }
                        pointsA = null;

                        var numSegmentsB = pointsB.length;
                        if (numSegmentsB === 3)
                        {
                            vertices[numVertices] = pointsB[0];
                            vertices[numVertices + 1] = pointsB[1];
                            vertices[numVertices + 2] = pointsB[2];
                            numVertices += 3;
                            return numVertices;
                        }
                        else
                        {
                            pointsB[numSegmentsB] = pointsB[0];

                            // Avoid recursion by restarting the loop
                            points = pointsB;
                            numSegments = numSegmentsB;
                            pointsB = null;

                            points.length = numSegments;

                            valid = true;
                            break;
                        }
                    }
                }
                else if (tarea === 0)
                {
                    deletePoint = true;
                }

                if (deletePoint)
                {
                    valid = true;

                    points.splice(i1, 1);

                    numSegments -= 1;
                    if (numSegments < 4)
                    {
                        break;
                    }

                    if (i2 < numSegments)
                    {
                        if (i1 === 0)
                        {
                            i0 = (numSegments - 1);
                        }
                        else
                        {
                            i0 = (i1 - 1);

                            if (i1 === numSegments)
                            {
                                i1 = 0;
                            }
                        }

                        i2 = (i1 + 1);

                        p1 = p2;
                        bx = cx;
                        by = cy;
                        v1x = v0x;
                        v1y = v0y;

                        continue;
                    }
                    else
                    {
                        break;
                    }
                }

                i0 = i1;
                i1 = i2;
                i2 = (i2 + 1);

                p0 = p1;
                ax = bx;
                ay = by;

                p1 = p2;
                bx = cx;
                by = cy;
                v1x = (bx - ax);
                v1y = (by - ay);
            }
            while (i2 < numSegments);
        }
        while (valid && !canTriangulateAsFan(points, numSegments));

        if (!valid)
        {
            return numVertices;
        }

        // convex
        p0 = points[0];
        ax = p0[0];
        ay = p0[1];

        p1 = points[1];
        bx = p1[0];
        by = p1[1];
        v1x = (bx - ax);
        v1y = (by - ay);

        j = 2;
        do
        {
            p2 = points[j];
            cx = p2[0];
            cy = p2[1];
            v0x = (cx - ax);
            v0y = (cy - ay);

            // Calculate triangle area
            tarea = ((v1x * v0y) - (v0x * v1y)); // * 0.5);

            if ((totalArea * tarea) > 0) // same winding order
            {
                vertices[numVertices] = p0;
                vertices[numVertices + 1] = p1;
                vertices[numVertices + 2] = p2;
                numVertices += 3;
            }

            p1 = p2;
            bx = cx;
            by = cy;
            v1x = v0x;
            v1y = v0y;

            j += 1;
        }
        while (j < numSegments);

        return numVertices;
    };

    fillFlatVertices(vertices, numVertices)
    {
        var bufferData = this.getFlatBuffer(numVertices);
        if (bufferData)
        {
            var p = 0, d = 0;
            do
            {
                var vertex = vertices[p];
                bufferData[d] = vertex[0];
                d += 1;
                bufferData[d] = vertex[1];
                d += 1;
                p += 1;
            }
            while (p < numVertices);

            this.fillFlatBuffer(bufferData, numVertices);
        }
    };

    isPointInPolygon(tx, ty, points, numPoints): bool
    {
        var yflag0, yflag1, inside;
        var vtx0, vtx1, vtxn;

        vtx0 = points[numPoints - 1];
        yflag0 = (vtx0[1] >= ty);

        inside = false;

        for (vtxn = 0; vtxn < numPoints; vtxn += 1)
        {
            vtx1 = points[vtxn];
            yflag1 = (vtx1[1] >= ty);

            if (yflag0 !== yflag1)
            {
                if (((vtx1[1] - ty) * (vtx0[0] - vtx1[0]) >= (vtx1[0] - tx) * (vtx0[1] - vtx1[1])) === yflag1)
                {
                    inside = !inside;
                }
            }

            vtx0 = vtx1;
            yflag0 = yflag1;
        }

        return inside;
    };

    isPointInSubPath(tx, ty, points): bool
    {
        var numPoints = points.length;
        if (numPoints > 2)
        {
            if (this.isClosed(points[0], points[numPoints - 1]))
            {
                numPoints -= 1; // Skip duplicated last point

                return this.isPointInPolygon(tx, ty, points, numPoints);
            }
        }

        return false;
    };

    shaderDefinition = {
 "version": 1,
 "name": "canvas.cgfx",
 "samplers":
 {
  "texture":
  {
   "MinFilter": 9985,
   "MagFilter": 9729,
   "WrapS": 33071,
   "WrapT": 33071
  },
  "pattern":
  {
   "MinFilter": 9728,
   "MagFilter": 9729,
   "WrapS": 10497,
   "WrapT": 10497
  },
  "gradient":
  {
   "MinFilter": 9728,
   "MagFilter": 9729,
   "WrapS": 33071,
   "WrapT": 33071
  },
  "image":
  {
   "MinFilter": 9728,
   "MagFilter": 9729,
   "WrapS": 33071,
   "WrapT": 33071
  }
 },
 "parameters":
 {
  "screen":
  {
   "type": "float",
   "columns": 4
  },
  "uvtransform":
  {
   "type": "float",
   "rows": 2,
   "columns": 3
  },
  "color":
  {
   "type": "float",
   "columns": 4
  },
  "alpha":
  {
   "type": "float"
  },
  "texture":
  {
   "type": "sampler2D"
  },
  "pattern":
  {
   "type": "sampler2D"
  },
  "gradient":
  {
   "type": "sampler2D"
  },
  "image":
  {
   "type": "sampler2D"
  }
 },
 "techniques":
 {
  "flat_source_atop":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [772,771]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_source_in":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [772,0]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_source_out":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,0]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_source_over":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,771]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_destination_atop":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,770]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_destination_in":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [0,770]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_destination_out":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [0,771]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_destination_over":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,1]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_lighter":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,1]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_copy":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": false
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "flat_xor":
  [
   {
    "parameters": ["screen","color"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,771]
    },
    "programs": ["vp_flat","fp_flat"]
   }
  ],
  "texture_source_atop":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [772,771]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_source_in":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [772,0]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_source_out":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,0]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_source_over":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,771]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_destination_atop":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,770]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_destination_in":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [0,770]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_destination_out":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [0,771]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_destination_over":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,1]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_lighter":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,1]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_copy":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": false
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "texture_xor":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,771]
    },
    "programs": ["vp_texture","fp_texture"]
   }
  ],
  "pattern_source_atop":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [772,771]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_source_in":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [772,0]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_source_out":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,0]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_source_over":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,771]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_destination_atop":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,770]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_destination_in":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [0,770]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_destination_out":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [0,771]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_destination_over":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,1]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_lighter":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,1]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_copy":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": false
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "pattern_xor":
  [
   {
    "parameters": ["screen","uvtransform","alpha","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,771]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern"]
   }
  ],
  "gradient_source_atop":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [772,771]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_source_in":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [772,0]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_source_out":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,0]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_source_over":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,771]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_destination_atop":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,770]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_destination_in":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [0,770]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_destination_out":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [0,771]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_destination_over":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,1]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_lighter":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,1]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_copy":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": false
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "gradient_xor":
  [
   {
    "parameters": ["screen","uvtransform","alpha","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [773,771]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient"]
   }
  ],
  "texture_shadow":
  [
   {
    "parameters": ["screen","color","texture"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,771]
    },
    "programs": ["vp_texture","fp_texture_shadow"]
   }
  ],
  "pattern_shadow":
  [
   {
    "parameters": ["screen","uvtransform","color","pattern"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,771]
    },
    "programs": ["vp_texture_uvtransform","fp_pattern_shadow"]
   }
  ],
  "gradient_shadow":
  [
   {
    "parameters": ["screen","uvtransform","color","gradient"],
    "semantics": ["POSITION"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": true,
     "BlendFunc": [1,771]
    },
    "programs": ["vp_texture_uvtransform","fp_gradient_shadow"]
   }
  ],
  "image":
  [
   {
    "parameters": ["image"],
    "semantics": ["POSITION","TEXCOORD0"],
    "states":
    {
     "DepthTestEnable": false,
     "DepthMask": false,
     "CullFaceEnable": false,
     "BlendEnable": false
    },
    "programs": ["vp_image","fp_image"]
   }
  ]
 },
 "programs":
 {
  "fp_image":
  {
   "type": "fragment",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nuniform sampler2D image;void main()\n{gl_FragColor=texture2D(image,tz_TexCoord[0].xy);}"
  },
  "vp_image":
  {
   "type": "vertex",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];attribute vec4 ATTR8;attribute vec4 ATTR0;\nvoid main()\n{vec4 tmpvar_1;tmpvar_1.zw=vec2(0.0,1.0);tmpvar_1.x=ATTR0.x;tmpvar_1.y=ATTR0.y;tz_TexCoord[0].xy=ATTR8.xy;gl_Position=tmpvar_1;}"
  },
  "fp_gradient_shadow":
  {
   "type": "fragment",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nuniform sampler2D gradient;uniform vec4 color;void main()\n{gl_FragColor=(color*texture2D(gradient,tz_TexCoord[0].xy).w);}"
  },
  "vp_texture_uvtransform":
  {
   "type": "vertex",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];attribute vec4 ATTR0;\nuniform vec3 uvtransform[2];uniform vec4 screen;void main()\n{vec2 tmpvar_1;vec2 tmpvar_2;tmpvar_2=((ATTR0.xy*screen.xy)+screen.zw);vec4 tmpvar_3;tmpvar_3.zw=vec2(0.0,1.0);tmpvar_3.x=tmpvar_2.x;tmpvar_3.y=tmpvar_2.y;vec3 tmpvar_4;tmpvar_4.z=1.0;tmpvar_4.x=ATTR0.x;tmpvar_4.y=ATTR0.y;tmpvar_1.x=dot(tmpvar_4,uvtransform[0]);tmpvar_1.y=dot(tmpvar_4,uvtransform[1]);tz_TexCoord[0].xy=tmpvar_1;gl_Position=tmpvar_3;}"
  },
  "fp_pattern_shadow":
  {
   "type": "fragment",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nuniform sampler2D pattern;uniform vec4 color;void main()\n{gl_FragColor=(color*texture2D(pattern,tz_TexCoord[0].xy).w);}"
  },
  "fp_texture_shadow":
  {
   "type": "fragment",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nuniform sampler2D texture;uniform vec4 color;void main()\n{gl_FragColor=(color*texture2D(texture,tz_TexCoord[0].xy).w);}"
  },
  "vp_texture":
  {
   "type": "vertex",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];attribute vec4 ATTR8;attribute vec4 ATTR0;\nuniform vec4 screen;void main()\n{vec2 tmpvar_1;tmpvar_1=((ATTR0.xy*screen.xy)+screen.zw);vec4 tmpvar_2;tmpvar_2.zw=vec2(0.0,1.0);tmpvar_2.x=tmpvar_1.x;tmpvar_2.y=tmpvar_1.y;tz_TexCoord[0].xy=ATTR8.xy;gl_Position=tmpvar_2;}"
  },
  "fp_gradient":
  {
   "type": "fragment",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nuniform sampler2D gradient;uniform float alpha;void main()\n{vec4 _fg;vec4 tmpvar_1;tmpvar_1=texture2D(gradient,tz_TexCoord[0].xy);_fg=tmpvar_1;_fg.w=(tmpvar_1.w*alpha);_fg.xyz=(tmpvar_1.xyz*_fg.w);gl_FragColor=_fg;}"
  },
  "fp_pattern":
  {
   "type": "fragment",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nuniform sampler2D pattern;uniform float alpha;void main()\n{vec4 _fg;vec4 tmpvar_1;tmpvar_1=texture2D(pattern,tz_TexCoord[0].xy);_fg=tmpvar_1;_fg.w=(tmpvar_1.w*alpha);_fg.xyz=(tmpvar_1.xyz*_fg.w);gl_FragColor=_fg;}"
  },
  "fp_texture":
  {
   "type": "fragment",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nuniform sampler2D texture;uniform vec4 color;void main()\n{vec4 _fg;vec4 tmpvar_1;tmpvar_1=(texture2D(texture,tz_TexCoord[0].xy)*color);_fg=tmpvar_1;_fg.xyz=(tmpvar_1.xyz*tmpvar_1.w);gl_FragColor=_fg;}"
  },
  "fp_flat":
  {
   "type": "fragment",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nuniform vec4 color;void main()\n{gl_FragColor=color;}"
  },
  "vp_flat":
  {
   "type": "vertex",
   "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nattribute vec4 ATTR0;\nuniform vec4 screen;void main()\n{vec2 tmpvar_1;tmpvar_1=((ATTR0.xy*screen.xy)+screen.zw);vec4 tmpvar_2;tmpvar_2.zw=vec2(0.0,1.0);tmpvar_2.x=tmpvar_1.x;tmpvar_2.y=tmpvar_1.y;gl_Position=tmpvar_2;}"
  }
 }
}

    // Constructor function
    static create(canvas, gd, md, width, height): CanvasContext
    {
        var c = new CanvasContext();

        // public variables
        c.canvas = canvas;
        c.globalAlpha = 1.0;
        c.globalCompositeOperation = 'source-over';
        c.strokeStyle = '#000000';
        c.fillStyle = '#000000';
        c.lineWidth = 1;
        c.lineCap = 'butt';
        c.lineJoin = 'miter';
        c.miterLimit = 10;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.shadowBlur = 0;
        c.shadowColor = 'rgba(0,0,0,0)';
        c.font = '10px sans-serif';
        c.textAlign = 'start';
        c.textBaseline = 'alphabetic';
        c.imageColor = '#fff';

        // private variables
        c.gd = gd;
        c.md = md;

        c.fm = null;

        c.target = null;
        c.viewport = [0, 0, width, height];

        c.pixelRatio = 1;

        c.width = width;
        c.height = height;

        c.screen = md.v4Build((2 / width), (-2 / height), -1, 1);

        c.statesStack = [c.createStatesObject()]; // Preallocate one state objet
        c.numStatesInStack = 0;

        c.subPaths = [];
        c.needToSimplifyPath = [];
        c.currentSubPath = [];

        /*jshint newcap: false*/
        var floatArrayConstructor = c.floatArrayConstructor;

        c.activeVertexBuffer = null;
        c.activeTechnique = null;
        c.activeScreen = new floatArrayConstructor(4);
        c.activeColor = new floatArrayConstructor(4);

        var shader = gd.createShader(c.shaderDefinition);
        c.shader = shader;

        c.triangleStripPrimitive = gd.PRIMITIVE_TRIANGLE_STRIP;
        c.triangleFanPrimitive = gd.PRIMITIVE_TRIANGLE_FAN;
        c.trianglePrimitive = gd.PRIMITIVE_TRIANGLES;
        c.lineStripPrimitive = gd.PRIMITIVE_LINE_STRIP;
        c.linePrimitive = gd.PRIMITIVE_LINES;

        c.textureVertexFormats = [gd.VERTEXFORMAT_FLOAT2, gd.VERTEXFORMAT_FLOAT2];
        c.textureSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0']);

        c.textureVertexBuffer = gd.createVertexBuffer({
            numVertices: 4,
            attributes: c.textureVertexFormats,
            dynamic: true,
            'transient': true
        });

        c.flatVertexFormats = [gd.VERTEXFORMAT_FLOAT2];
        c.flatSemantics = gd.createSemantics(['POSITION']);

        c.flatVertexBuffer = gd.createVertexBuffer({
            numVertices: 256,
            attributes: c.flatVertexFormats,
            dynamic: true,
            'transient': true
        });

        c.flatOffset = 0;

        c.bufferData = new floatArrayConstructor(512);
        c.subBufferDataCache = {};

        c.tempRect = new floatArrayConstructor(8);
        /*jshint newcap: true*/

        c.tempVertices = [];

        c.tempStack = [];

        c.v4Zero = md.v4BuildZero();
        c.v4One = md.v4BuildOne();

        c.cachedColors = {};
        c.numCachedColors = 0;

        /*jshint newcap: false*/
        c.uvtransform = new floatArrayConstructor(6);
        /*jshint newcap: true*/
        c.uvtransform[0] = 1;
        c.uvtransform[1] = 0;
        c.uvtransform[2] = 0;
        c.uvtransform[3] = 0;
        c.uvtransform[4] = 1;
        c.uvtransform[5] = 0;

        c.tempColor = md.v4BuildZero();
        c.tempScreen = md.v4BuildZero();

        c.tempImage = null;
        c.imageTechnique = shader.getTechnique("image");

        var compositeOperations = c.compositeOperations;
        var flatTechniques = {};
        var textureTechniques = {};
        var patternTechniques = {};
        var gradientTechniques = {};
        c.flatTechniques = flatTechniques;
        c.textureTechniques = textureTechniques;
        c.patternTechniques = patternTechniques;
        c.gradientTechniques = gradientTechniques;
        for (var p in compositeOperations)
        {
            if (compositeOperations.hasOwnProperty(p))
            {
                var sp = p.replace('-', '_');
                flatTechniques[p] = shader.getTechnique('flat_' + sp);
                textureTechniques[p] = shader.getTechnique('texture_' + sp);
                patternTechniques[p] = shader.getTechnique('pattern_' + sp);
                gradientTechniques[p] = shader.getTechnique('gradient_' + sp);
            }
        }

        c.textureShadowTechnique = shader.getTechnique('texture_shadow');
        c.patternShadowTechnique = shader.getTechnique('pattern_shadow');
        c.gradientShadowTechnique = shader.getTechnique('gradient_shadow');

        /*
          c.renderTexture = gd.createTexture({
          name       : "canvas.backbuffer",
          width      : width,
          height     : height,
          depth      : 1,
          format     : gd.PIXELFORMAT_R8G8B8A8,
          cubemap    : false,
          mipmaps    : false,
          renderable : true
          });

          c.renderTarget = gd.createRenderTarget({
          colorTexture0 : c.renderTexture
          });
        */

        //
        // Transformation matrix and related operations
        //
        /*jshint newcap: false*/
        c.matrix = new floatArrayConstructor(6);
        /*jshint newcap: true*/
        c.matrix[0] = 1;
        c.matrix[1] = 0;
        c.matrix[2] = 0;
        c.matrix[3] = 0;
        c.matrix[4] = 1;
        c.matrix[5] = 0;

        var CanvasPrototype = CanvasContext.prototype;
        var scale = CanvasPrototype.scale;
        var translate = CanvasPrototype.translate;
        var transform = CanvasPrototype.transform;
        var setTransform = CanvasPrototype.setTransform;
        var transformPoint = CanvasPrototype.transformPoint;
        var transformRect = CanvasPrototype.transformRect;

        var resetTransformMethods = function resetTransformMethodsFn()
        {
            c.scale = scale;
            c.translate = translate;
            c.transform = transform;
            c.setTransform = setTransform;
            c.transformPoint = transformPoint;
            c.transformRect = transformRect;
        };

        var transformTranslate = function transformTranslateFn(a, b, c, d, e, f)
        {
            var m = this.matrix;
            m[0] = a;
            m[3] = b;
            m[1] = c;
            m[4] = d;
            m[2] = (e + m[2]);
            m[5] = (f + m[5]);

            resetTransformMethods();
        };

        var scaleIdentity = function scaleIdentityFn(x, y)
        {
            if (x !== 1 || y !== 1)
            {
                var m = this.matrix;
                m[0] = x;
                m[4] = y;

                resetTransformMethods();
            }
        };

        var translateIdentity = function translateIdentityFn(x, y)
        {
            if (x !== 0 || y !== 0)
            {
                var m = this.matrix;
                m[2] = x;
                m[5] = y;

                this.translate = translate;
                this.transform = transformTranslate;
                this.transformPoint = this.transformPointTranslate;
                this.transformRect = this.transformRectTranslate;
            }
        };

        var setTransformIdentity = function setTransformIdentityFn(a, b, c, d, e, f)
        {
            var m = this.matrix;
            m[0] = a;
            m[1] = c;
            m[2] = e;
            m[3] = b;
            m[4] = d;
            m[5] = f;

            resetTransformMethods();
        };

        c.scale = scaleIdentity;
        c.translate = translateIdentity;
        c.transform = setTransformIdentity;
        c.setTransform = setTransformIdentity;
        c.transformPoint = c.transformPointIdentity;
        c.transformRect = c.transformRectIdentity;

        //
        // Clipping
        //
        /*jshint newcap: false*/
        c.clipExtents = new floatArrayConstructor(4);
        /*jshint newcap: true*/
        c.clipExtents[0] = 0;
        c.clipExtents[1] = 0;
        c.clipExtents[2] = width;
        c.clipExtents[3] = height;

        //
        c.defaultStates = c.setStates(c.createStatesObject(), c);

        c.cachedTriangulation = {};
        c.tempAngles = [];

        c.cachedPaths = {};
        c.numCachedPaths = 0;

        return c;
    };
};

//
// Canvas
//
class Canvas
{
    static version = 1;

    context: CanvasContext;
    width: number;
    height: number;
    clientWidth: number;
    clientHeight: number;

    // Standard API
    getContext(contextId)
    {
        if (contextId.toLowerCase() === '2d')
        {
            return this.context;
        }
        else
        {
            return null;
        }
    };

    toDataURL(/* type */): string
    {
        if (this.width === 0 ||
            this.height === 0)
        {
            return "data:,";
        }

        //if (type.toLowerCase() === 'image/jpeg')
        var pixelData = this.context.gd.getScreenshot(true, 0, 0, this.width, this.height);
        if (pixelData)
        {
            return "data:image/jpeg;base64," +
                (<CanvasPluginArray><any>pixelData).toBase64();
        }

        return null;
    };

    toBlob(fileCallback /*, type */)
    {
        if (fileCallback)
        {
            //if (type.toLowerCase() === 'image/jpeg')
            var pixelData =
                this.context.gd.getScreenshot(true, 0, 0, this.width, this.height);
            fileCallback(pixelData);
        }
    };

    setAttribute(attr, value)
    {
        if (value.substr(-2, 2) === "px")
        {
            value = value.substr(0, value.lengh - 2);
        }
        value = parseInt(value, 10);

        if (attr === "width")
        {
            this.width = value;
        }
        else if (attr === "height")
        {
            this.height = value;
        }
        else
        {
            throw 'UNSUPPORTED ATTRIBUTE!';
        }
    };

    // Turbulenz API
    setFontManager(fm)
    {
        this.context.setFontManager(fm);
    };

    // Constructor function
    static create(gd, md): Canvas
    {
        var width = gd.width;
        var height = gd.height;

        var c = new Canvas();

        c.context = CanvasContext.create(c, gd, md, width, height);

        if (Object.defineProperty)
        {
            Object.defineProperty(c, "width", {
                get : function getWidth() {
                    return width;
                },
                set : function setWidth(newValue) {
                    width = newValue;

                    (<Canvas><any>this).context.setWidth(newValue);

                    (<Canvas><any>this).clientWidth = newValue;
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(c, "height", {
                get : function getHeight() {
                    return height;
                },
                set : function setHeight(newValue) {
                    height = newValue;

                    (<Canvas><any>this).context.setHeight(newValue);

                    (<Canvas><any>this).clientHeight = newValue;
                },
                enumerable : true,
                configurable : false
            });
        }
        else
        {
            c.width = width;
            c.height = height;
        }

        c.clientWidth = width;
        c.clientHeight = height;

        return c;
    };
};

// Detect correct typed arrays
(function () {
    CanvasContext.prototype.floatArrayConstructor = Array;
    CanvasContext.prototype.byteArrayConstructor = Array;
    CanvasContext.prototype.shortArrayConstructor = Array;
    if (typeof Float32Array !== "undefined")
    {
        var textDescriptor = Object.prototype.toString.call(new Float32Array(4));
        if (textDescriptor === '[object Float32Array]')
        {
            CanvasContext.prototype.floatArrayConstructor = Float32Array;
        }
    }
    if (typeof Uint8Array !== "undefined")
    {
        var textDescriptor = Object.prototype.toString.call(new Uint8Array(4));
        if (textDescriptor === '[object Uint8Array]')
        {
            CanvasContext.prototype.byteArrayConstructor = Uint8Array;
        }
    }
    if (typeof Uint16Array !== "undefined")
    {
        var textDescriptor = Object.prototype.toString.call(new Uint16Array(4));
        if (textDescriptor === '[object Uint16Array]')
        {
            CanvasContext.prototype.shortArrayConstructor = Uint16Array;
        }
    }
}());
