// Copyright (c) 2013 Turbulenz Limited
//
//  SimpleFonts
//  ===========
//
//  Helper class allowing you to render fonts, these will be batched rendered later on.
//

function SimpleFontRenderer() {}

SimpleFontRenderer.prototype =
{
    textHorizontalAlign : {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2
    },

    textVerticalAlign : {
        TOP: 0,
        MIDDLE: 1,
        BOTTOM: 2
    },

    drawFontDouble : function simpleFontRendererDrawDoubleFontFn(string, inputParams)
    {
        var scratchPad = this.scratchPad;

        var pcolor = inputParams.color;
        var pr = inputParams.r;
        var pg = inputParams.g;
        var pb = inputParams.b;
        var pa = inputParams.a;

        inputParams.x += 1.0;
        inputParams.y += 1.0;

        inputParams.color   =   scratchPad.v4Black;

        if (string === undefined)
        {
            this.drawFont("Error: String is undefined", inputParams);
        }
        else
        {
            this.drawFont(string, inputParams);
        }

        inputParams.color   =   pcolor;
        inputParams.r = pr;
        inputParams.g = pg;
        inputParams.b = pb;
        inputParams.a = pa;

        inputParams.x -= 1.0;
        inputParams.y -= 1.0;

        if (string === undefined)
        {
            this.drawFont("Error: String is undefined", inputParams);
        }
        else
        {
            this.drawFont(string, inputParams);
        }
    },

    drawFont : function simpleFontRendererDrawFontFn(string, inputParams)
    {
        //Add some stuff to my list.
        var globals   = this.globals;
        var md        = globals.mathDevice;
        var params    = this.allocateParams();
        params.string = string;

        var textHorizontalAlign = this.textHorizontalAlign;
        var textVerticalAlign = this.textVerticalAlign;

        params.spacing    = (inputParams.spacing !== undefined) ? inputParams.spacing : 0;
        params.alignment  = (inputParams.alignment !== undefined) ? inputParams.alignment: textHorizontalAlign.TOP;
        params.valignment = (inputParams.valignment !== undefined) ? inputParams.valignment: textVerticalAlign.MIDDLE;

        md.v4BuildOne(params.color);
        if (inputParams.color !== undefined)
        {
            md.v4Copy(inputParams.color, params.color);
        }
        else
        {
            params.color[0]   =   (inputParams.r !== undefined) ? inputParams.r : 1.0;
            params.color[1]   =   (inputParams.g !== undefined) ? inputParams.g : 1.0;
            params.color[2]   =   (inputParams.b !== undefined) ? inputParams.b : 1.0;
            params.color[3]   =   (inputParams.a !== undefined) ? inputParams.a : 1.0;
        }

        this.calculateFontAndScaleFromInputParams(inputParams, params);

        if (!params.font)
        {
            return;
        }

        if (inputParams.rect === undefined)
        {
            this.calculateRectFromInputParams(params.font, params.string, params.scale, params.spacing, inputParams.x, inputParams.y, params.alignment, params.valignment, params.rect);
        }
        else
        {
            md.v4Copy(inputParams.rect, params.rect);
        }

        this.textToDraw.push(params);
    },

    calculateRectFromInputParams : function simplefontsCalculateRectFromInputParamsFn(font, string, scale, spacing, x, y, align, valign, rect)
    {
        var textDimensions = font.calculateTextDimensions(string, scale, spacing);
        var textHorizontalAlign = this.textHorizontalAlign;
        var textVerticalAlign = this.textVerticalAlign;

        // width: width,
        // height: height,
        // numGlyphs: numGlyphs,
        // linesWidth: linesWidth

        if (align === textHorizontalAlign.LEFT)
        {
            //Left edge should be on location
            rect[0] =   x;
            rect[2] =   textDimensions.width;
        }
        else if (align === textHorizontalAlign.RIGHT)
        {
            //Right edge should be on location
            rect[0] =   x   -   textDimensions.width;
            rect[2] =   textDimensions.width;
        }
        else //textHorizontalAlign.CENTER
        {
            //Mid x should be on location.
            rect[0] =   x   -   textDimensions.width * 0.5;
            rect[2] =   textDimensions.width;
        }

        if (valign === textVerticalAlign.TOP)
        {
            //Top edge should be on location.
            rect[1] =   y;
            rect[3] =   textDimensions.height;
        }
        else if (valign === textVerticalAlign.BOTTOM)
        {
            rect[1] =   y   -   textDimensions.height;
            rect[3] =   textDimensions.height;
        }
        else //textVerticalAlign.MIDDLE
        {
            rect[1] =   y   -   textDimensions.height * 0.5;
            rect[3] =   textDimensions.height;
        }
        return  rect;
    },

    calculateScaleFromInputParams : function calculateScaleFromInputParamsFn(inputParams)
    {
        var scale = inputParams.scale || 1.0;

        if (inputParams.specialScale !== undefined)
        {
            scale    *=  inputParams.specialScale;
        }

        return scale;
    },

    isStandardPointSize : function simplefontsIsStandardPointSizeFn(pointSize)
    {
        var fontSizes = this.fontSizes;
        for (var i = 0; i < fontSizes.length; i += 1)
        {
            if (pointSize === fontSizes[i])
            {
                return;
            }
        }

        return false;
    },

    getFontFromPointSize : function getFontFromPointSizeFn(pointSize, fontType)
    {
        // pointSize is a standard point size
        var fontStyle = fontType;
        if (!fontStyle)
        {
            fontStyle = 'regular';
        }

        var font;
        var fontSizeList = this.fonts[fontStyle];
        if (!fontSizeList)
        {
            fontSizeList = this.fonts.regular;
        }
        if (fontSizeList)
        {
            font = fontSizeList[pointSize];
            if (!font)
            {
                font = this.defaultFont;
            }
            return font;
        }
        return this.defaultFont;
    },

    calculateFontAndScaleFromInputParams : function simplefontsCalculateFontAndScaleFromInputParamsFn(inputParams, outputParams)
    {
        var scale     = this.calculateScaleFromInputParams(inputParams);
        var pointSize = 16;

        if (inputParams.pointSize !== undefined)
        {
            pointSize = inputParams.pointSize;
        }

        if (scale !== 1.0 || !this.isStandardPointSize(pointSize))
        {
            var sizeProduct       = scale * pointSize;
            var powerOf2          = Math.log(sizeProduct) / Math.LN2;
            pointSize             = Math.pow(2, Math.round(powerOf2));

            pointSize             = Math.max(pointSize, this.fontSizeMax);
            pointSize             = Math.min(pointSize, this.fontSizeMin);

            scale                 = sizeProduct / pointSize;
            inputParams.pointSize = pointSize;
        }

        outputParams.scale  =   scale;
        outputParams.font   =   this.getFontFromPointSize(pointSize, inputParams.fontStyle);
    },

    preload : function simplefontsPreloadFn()
    {
        var fontManager = this.globals.fontManager;
        //Relies on shader and font manager having their path remapping done.
        var fontsList = this.fontsList;
        var fontSizes = this.fontSizes;

        for (var f in fontsList)
        {
            if (fontsList.hasOwnProperty(f))
            {
                for (var i = 0; i < fontSizes.length; i += 1)
                {
                    fontManager.load('fonts/' + fontsList[f] + '-' + fontSizes[i] + '.fnt');
                }
            }
        }

        this.globals.shaderManager.load('shaders/font.cgfx');
    },

    hasLoaded : function simpleFontRendererHasLoadedFn()
    {
        var globals = this.globals;
        var fontManager = globals.fontManager;
        var shaderManager = globals.shaderManager;
        var md = globals.mathDevice;
        var gd = globals.graphicsDevice;

        if (fontManager.getNumPendingFonts() === 0 &&
            shaderManager.getNumPendingShaders() === 0)
        {
            if (!this.technique2D)
            {
                var size;
                var fontsList = this.fontsList;
                var fontSizes = this.fontSizes;
                var fonts = this.fonts;

                for (var f in fontsList)
                {
                    if (fontsList.hasOwnProperty(f))
                    {
                        var fontObjects = {};
                        for (var i = 0; i < fontSizes.length; i += 1)
                        {
                            size = fontSizes[i];
                            fontObjects[size] = fontManager.get('fonts/' + fontsList[f] + '-' + size + '.fnt');
                        }
                        fonts[f] = fontObjects;
                    }
                }

                var shader = shaderManager.get('shaders/font.cgfx');
                this.technique2D = shader.getTechnique('font');
                this.technique2Dparameters = gd.createTechniqueParameters({
                    clipSpace: md.v4BuildZero(),
                    alphaRef: 0.01,
                    color: md.v4BuildOne()
                });
            }

            return true;
        }

        return false;
    },

    render : function simpleFontRendererRenderFn()
    {
        if (!this.hasLoaded())
        {
            return;
        }

        if (this.textToDraw.length === 0)
        {
            return;
        }

        var md = this.globals.mathDevice;
        var gd = this.globals.graphicsDevice;

        var width = gd.width;
        var height = gd.height;

        var technique2Dparameters = this.technique2Dparameters;

        gd.setTechnique(this.technique2D);

        technique2Dparameters.clipSpace = md.v4Build(2.0 / width, -2.0 / height, -1.0, 1.0,
                                                             technique2Dparameters.clipSpace);
        var currentText;
        var currentTextIndex  = 0;
        var textToDraw        = this.textToDraw;
        var textToDrawLength  = this.textToDraw.length;
        for (currentTextIndex = 0; currentTextIndex < textToDrawLength; currentTextIndex += 1)
        {
            currentText = textToDraw[currentTextIndex];
            if (!currentText.font)
            {
                continue;
            }

            technique2Dparameters.color = currentText.color;

            gd.setTechniqueParameters(technique2Dparameters);

            currentText.font.drawTextRect(currentText.string, currentText);
        }

        this.clearFontList();
    },

    clearFontList : function simplefontsClearFontListFn()
    {
        //Clear!
        this.textCacheIndex = 0;
        this.textToDraw.length  =   0;
    },

    allocateParams : function simplefontsAllocateParamsFn()
    {
        var params = this.textCache[this.textCacheIndex];
        if (!params)
        {
            var md = this.globals.mathDevice;
            params = {
                    string : null,
                    spacing : 0,
                    alignment : 0,
                    valignment : 0,
                    color : md.v4BuildOne(),
                    font : null,
                    pointSize : undefined,
                    scale : 0,
                    rect : md.v4BuildOne()
                };
            this.textCache.push(params);
        }
        params.pointSize = undefined;
        this.textCacheIndex += 1;

        return params;
    }
};

SimpleFontRenderer.create = function simpleFontRendererCreateFn(globals)
{
    var simpleFontRenderer = new SimpleFontRenderer();

    simpleFontRenderer.globals = globals;

    simpleFontRenderer.textToDraw = [];
    simpleFontRenderer.textCache = [];
    simpleFontRenderer.textCacheIndex = 0;

    simpleFontRenderer.fontsList = globals.fonts || {};
    simpleFontRenderer.fonts = {};

    // The standard set of sizes to request (sorted)
    var fontSizes = simpleFontRenderer.fontSizes = [8, 16, 32, 64, 128];
    simpleFontRenderer.fontSizeMax = fontSizes[0];
    simpleFontRenderer.fontSizeMin = fontSizes[fontSizes.length - 1];

    var fontManager = globals.fontManager;
    simpleFontRenderer.defaultFont = fontManager.get("");

    simpleFontRenderer.scratchPad = {
        v4Black : globals.mathDevice.v4Build(0.0, 0.0, 0.0, 1.0)
    };

    return simpleFontRenderer;
};
