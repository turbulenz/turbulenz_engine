// Copyright (c) 2009-2013 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global Observer: false*/
/*global Float32Array: false*/

"use strict";

interface FontDimensions
{
    width        : number;
    height       : number;
    numGlyphs    : number;
    linesWidth   : number[];
    glyphCounts  : { [pageIdx: number]: number; };
}

interface FontGlyph
{
    width   : number;
    height  : number;
    awidth  : number;
    xoffset : number;
    yoffset : number;
    left    : number;
    top     : number;
    right   : number;
    bottom  : number;
    page    : number;
}

// A FontKerning is a map from character code to spacing values.
interface FontKerning
{
    [charcode: number]: number;
}

// Map from character code to the corresponding kerning values.
interface FontKerningMap
{
    [charcode: number]: FontKerning;
}

// Parameters to the drawTextRect call
interface FontDrawParameters
{
    rect        : any;
    scale       : number;
    alignment   : any;
    spacing?    : number;
    dimensions? : FontDimensions;
}

// Maintains the per-page info for a given string.

interface FontDrawPageContext
{
    vertices    : Float32Array;
    vertexIndex : number;
}

interface FontDrawContext
{
    pageContexts : { [pageIdx: number]: FontDrawPageContext };
}

/**
   @class  Font
   @private

   @since TurbulenzEngine 0.1.0
*/
class Font
{
    static version = 1;

    bold: boolean;
    italic: boolean;
    pageWidth: number;
    pageHeight: number;
    baseline: any; // TODO
    glyphs: FontGlyph[];
    numGlyphs: number;
    minGlyphIndex: number;
    lineHeight: number;
    pages: string[];
    kernings: FontKerningMap;
    textures: Texture[];

    gd: GraphicsDevice;
    fm: FontManager;

    constructor(gd: GraphicsDevice, fontManager: FontManager)
    {
        this.gd = gd;
        this.fm = fontManager;

        this.bold = false;
        this.italic = false;
        this.pageWidth = 0;
        this.pageHeight = 0;
        this.baseline = 0;
        this.glyphs = null;
        this.numGlyphs = 0;
        this.minGlyphIndex = 0;
        this.lineHeight = 0;
        this.pages = null;
        this.kernings = null;
        this.textures = [];
    }

    /// Measure the width and height of the text, and optionally
    /// collect information about how the characters are distributed
    /// across the pages.

    calculateTextDimensions(text: string, scale: number, spacing: number)
    {
        var glyphs = this.glyphs;
        var lineHeight = (this.lineHeight * scale);
        var width = 0;
        var height = 0;
        var numGlyphs = 0;
        var numLines = 0;
        var linesWidth = [];
        var glyphCounts = {};

        var textLength = text.length;
        var lineWidth = 0;
        var c: number;
        var glyph: FontGlyph;
        var gaw: number;

        var curGlyphCount: number;
        var pageIdx: number;

        for (var i = 0; i < textLength; i += 1)
        {
            c = text.charCodeAt(i);
            if (c === 10)
            {
                if (lineWidth)
                {
                    lineWidth -= spacing;
                }
                linesWidth[numLines] = lineWidth;
                numLines += 1;
                if (width < lineWidth)
                {
                    width = lineWidth;
                }
                lineWidth = 0;
                height += lineHeight;
            }
            else
            {
                glyph = glyphs[c] || glyphs['?'.charCodeAt(0)];
                if (glyph)
                {
                    gaw = glyph.awidth;
                    if (gaw)
                    {
                        lineWidth += ((gaw * scale) + spacing);
                        numGlyphs += 1;
                    }
                    else
                    {
                        lineWidth += spacing;
                    }

                    pageIdx = glyph.page;
                    curGlyphCount = glyphCounts[pageIdx] || 0;
                    glyphCounts[pageIdx] = curGlyphCount + 1;
                }
            }
        }

        linesWidth[numLines] = lineWidth;
        if (width < lineWidth)
        {
            width = lineWidth;
        }
        height += lineHeight;

        return {
            width: width,
            height: height,
            numGlyphs: numGlyphs,
            linesWidth: linesWidth,
            glyphCounts: glyphCounts
        };
    }

    /// A FontDimensions object, as returned by
    /// calculateTextDimensions can optionally be passed in to avoid
    /// recalculating certain properties of the text.
    generateTextVertices(text: string,
                         params: FontDrawParameters) : FontDrawContext
    {
        var rect = params.rect;
        var alignment = params.alignment;
        var scale = (params.scale || 1.0);
        var extraSpacing = (params.spacing ? (params.spacing * scale) : 0);
        var dimensions = params.dimensions ||
            this.calculateTextDimensions(text, scale, extraSpacing);

        var ctx : FontDrawContext = {
            pageContexts: {}
        };
        var pageContexts = ctx.pageContexts;

        var glyphCounts = dimensions.glyphCounts;
        var totalNumGlyphs = dimensions.numGlyphs;
        if (0 >= totalNumGlyphs)
        {
            return null;
        }

        var linesWidth = dimensions.linesWidth;
        var lineHeight = (this.lineHeight * scale);
        var kernings = this.kernings;
        var glyphs = this.glyphs;

        var fm = this.fm;
        var reusableArrays = fm.reusableArrays;

        var numGlyphs: number;
        var pageIdx: any;
        var pageCtx: FontDrawPageContext;
        var vertices: Float32Array;
        var vertexIndex: number;

        // Fill out the context with buffers to hold the vertices for
        // each page.

        for (pageIdx in glyphCounts)
        {
        if (glyphCounts.hasOwnProperty(pageIdx))
        {
            numGlyphs = glyphCounts[pageIdx];
            vertices = reusableArrays[numGlyphs];
            if (vertices)
            {
                // Need to remove from cache just in case it is not
                // returned to us
                reusableArrays[numGlyphs] = null;
            }
            else
            {
                vertices = new fm.float32ArrayConstructor((numGlyphs * 4) * 4);
            }

            pageContexts[pageIdx] = {
                vertices: vertices,
                vertexIndex: 0
            };
        }
        }

        var c, glyph, gx0, gy0, gx1, gy1, gaw, u0, v0, u1, v1;
        var lineWidth = linesWidth[0];
        var rectLeft = rect[0];
        var rectWidth = rect[2];
        var y = rect[1];
        var x = rectLeft;
        if (1 === alignment)
        {
            x += ((rectWidth - lineWidth) * 0.5);
        }
        else if (2 === alignment)
        {
            x += ((rectWidth - lineWidth));
        }
        var textLength = text.length;
        var line = 0;
        var i;

        for (i = 0; i < textLength; i += 1)
        {
            c = text.charCodeAt(i);
            if (c === 10)
            {
                y += lineHeight;
                line += 1;
                lineWidth = linesWidth[line];
                x = rectLeft;
                if (1 === alignment)
                {
                    x += ((rectWidth - lineWidth) * 0.5);
                }
                else if (2 === alignment)
                {
                    x += ((rectWidth - lineWidth));
                }
            }
            else
            {
                glyph = glyphs[c] || glyphs['?'.charCodeAt(0)];
                if (glyph)
                {
                    pageIdx = glyph.page;
                    gaw = (glyph.awidth * scale);
                    if (gaw)
                    {

                        gx0 = (x + (glyph.xoffset * scale));
                        gy0 = (y + (glyph.yoffset * scale));
                        gx1 = (gx0 + (glyph.width  * scale));
                        gy1 = (gy0 + (glyph.height * scale));
                        u0 = glyph.left;
                        v0 = glyph.top;
                        u1 = glyph.right;
                        v1 = glyph.bottom;

                        pageCtx = pageContexts[pageIdx];
                        vertices = pageCtx.vertices
                        vertexIndex = pageCtx.vertexIndex;

                        vertices[vertexIndex + 0] = gx0;
                        vertices[vertexIndex + 1] = gy0;
                        vertices[vertexIndex + 2] = u0;
                        vertices[vertexIndex + 3] = v0;

                        vertices[vertexIndex + 4] = gx1;
                        vertices[vertexIndex + 5] = gy0;
                        vertices[vertexIndex + 6] = u1;
                        vertices[vertexIndex + 7] = v0;

                        vertices[vertexIndex + 8] = gx1;
                        vertices[vertexIndex + 9] = gy1;
                        vertices[vertexIndex + 10] = u1;
                        vertices[vertexIndex + 11] = v1;

                        vertices[vertexIndex + 12] = gx0;
                        vertices[vertexIndex + 13] = gy1;
                        vertices[vertexIndex + 14] = u0;
                        vertices[vertexIndex + 15] = v1;

                        vertexIndex += 16;
                        pageCtx.vertexIndex = vertexIndex;

                        totalNumGlyphs -= 1;
                        if (0 === totalNumGlyphs)
                        {
                            break;
                        }
                        x += (gaw + extraSpacing);

                        if (kernings)
                        {
                            var kerning = kernings[c];
                            if (kerning && i < (textLength - 1))
                            {
                                var amount = kerning[text.charCodeAt(i + 1)];
                                if (amount)
                                {
                                    x += (amount * scale);
                                }
                            }
                        }
                    }
                    else
                    {
                        x += extraSpacing;
                    }
                }
            }
        }

        return ctx;
    }

    drawTextRect(text: string, params: FontDrawParameters)
    {
        // TODO: It may work out more efficient to check the
        // dimensions and call 'generateTextVertices' and
        // 'drawTextVertices' for each page.  We have to iterate
        // through the text several times, but we can ensure we only
        // take a single buffer from the 'reusableArrays' cache each
        // time.

        var ctx = this.generateTextVertices(text, params);
        this.drawTextVertices(ctx, true);
    }

    drawTextVertices(ctx, reuseVertices?)
    {
        var pageContexts = ctx.pageContexts;
        var gd = this.gd;
        var fm = this.fm;
        var sharedVertexBuffer = fm.sharedVertexBuffer;
        var sharedIndexBuffer = fm.sharedIndexBuffer;
        var techniqueParameters = fm.techniqueParameters;

        var pageIdx: any;
        var pageCtx: FontDrawPageContext;
        var vertices: Float32Array;
        var numGlyphs: number;
        var numVertices: number;
        var numIndices: number;
        var reusableArrays = fm.reusableArrays;

        for (pageIdx in pageContexts)
        {
        if (pageContexts.hasOwnProperty(pageIdx))
        {
            pageCtx = pageContexts[pageIdx];
            vertices = pageCtx.vertices;

            /*jshint bitwise: false*/
            numGlyphs = (vertices.length >> 4);
            /*jshint bitwise: true*/

            numVertices = (numGlyphs * 4);

            if (!sharedVertexBuffer ||
                numVertices > sharedVertexBuffer.numVertices)
            {
                if (sharedVertexBuffer)
                {
                    sharedVertexBuffer.destroy();
                }
                sharedVertexBuffer = this.createVertexBuffer(numGlyphs);
                fm.sharedVertexBuffer = sharedVertexBuffer;
            }

            sharedVertexBuffer.setData(vertices, 0, numVertices);

            gd.setStream(sharedVertexBuffer, fm.semantics);

            techniqueParameters['texture'] = this.textures[pageIdx];
            gd.setTechniqueParameters(techniqueParameters);

            if (4 < numVertices)
            {
                numIndices = (numGlyphs * 6);
                if (!sharedIndexBuffer ||
                    numIndices > sharedIndexBuffer.numIndices)
                {
                    if (sharedIndexBuffer)
                    {
                        sharedIndexBuffer.destroy();
                    }
                    sharedIndexBuffer = this.createIndexBuffer(numGlyphs);
                    fm.sharedIndexBuffer = sharedIndexBuffer;
                }

                gd.setIndexBuffer(sharedIndexBuffer);
                gd.drawIndexed(fm.primitive, numIndices, 0);
            }
            else
            {
                gd.draw(fm.primitiveFan, 4, 0);
            }

            if (reuseVertices)
            {
                // This may overwrite an existing entry in the cache,
                // but it's probably faster to blindly overwrite than
                // do a lookup to see if there is already an entry.

                fm.reusableArrays[numGlyphs] = vertices;
            }
        }
        }
    }

    private createIndexBuffer(maxGlyphs)
    {
        var gd = this.gd;
        var indexBufferParameters = {
            numIndices: (6 * maxGlyphs),
            format: 'USHORT'
        };

        var indexBuffer = gd.createIndexBuffer(indexBufferParameters);

        var writer = indexBuffer.map();
        if (writer)
        {
            var i0, i1, i2, i3;
            for (var i = 0; i < maxGlyphs; i += 1)
            {
                i0 = (4 * i);
                i1 = (i0 + 1);
                i2 = (i0 + 2);
                i3 = (i0 + 3);
                writer(i0, i1, i2);
                writer(i2, i3, i0);
            }

            indexBuffer.unmap(writer);
        }

        return indexBuffer;
    }

    private createVertexBuffer(maxGlyphs)
    {
        var gd = this.gd;
        return gd.createVertexBuffer({numVertices: (4 * maxGlyphs),
            attributes: [gd.VERTEXFORMAT_FLOAT2, gd.VERTEXFORMAT_FLOAT2],
            dynamic: true,
            'transient': true});
    }
}

/**
  @class  Font manager
  @private

  @since TurbulenzEngine 0.1.0
*/
class FontManager
{
    static version = 1;

    fonts: { [name: string]: Font; };

    load: { (path: string, onFontLoaded?: { (font): void; }): Font; };
    map: { (dst: string, src: string): void; };
    remove: { (path: string): void; };
    get(path: string): Font { debug.abort("empty method"); return undefined; }
    getAll: { (): { [name: string]: Font; }; };

    getNumPendingFonts: { (): number; };
    isFontLoaded: { (path: string): boolean; };
    isFontMissing: { (path: string): boolean; };
    setPathRemapping: { (prm, assetUrl: string): void; };
    calculateTextDimensions: { (path: string, text: string, scale: number,
                                spacing: number): FontDimensions; };
    reuseVertices: { (vertices: any): void; };
    destroy: { (): void; };

    public primitive: number;
    public primitiveFan: number;
    public semantics: Semantics;
    public techniqueParameters: TechniqueParameters;
    public sharedIndexBuffer: IndexBuffer;
    public sharedVertexBuffer: VertexBuffer;
    public reusableArrays: {[idx: number]: Float32Array};
    public float32ArrayConstructor: { new(i: number): Float32Array; };

    /**
       @constructs Constructs a FontManager object.

       @param {GraphicsDevice} gd Graphics device
       @param {RequestHandler} rh RequestHandler object

       @return {FontManager} object, null if failed
    */
    static create(gd: GraphicsDevice,
                  rh: RequestHandler,
                  df?: Font,
                  errorCallback?: { (msg: string): void; },
                  log?: HTMLElement): FontManager
    {
        if (!errorCallback)
        {
            errorCallback = function (/* e */) {};
        }

        var fonts = {};
        var loadingFont = {};
        var loadedObservers = {};
        var loadingPages = {};
        var numLoadingFonts = 0;
        var internalFont = {};
        var pathRemapping = null;
        var pathPrefix = "";
        var defaultFont = df;

        var buildGlyphsGrid = function buildGlyphsGridFn(font, t, numGlyphs)
        {
            // Assume 16 characters per row
            var floor = Math.floor;
            var numRows = (numGlyphs / 16);
            var du = 1.0 / 16;
            var dv = 1.0 / numRows;
            var pu = (0.5 / t.width);
            var pv = (0.5 / t.height);
            var w = floor(t.width  * du);
            var h = floor(t.height * dv);
            var glyphs = [];
            glyphs.length = numGlyphs;
            for (var g = 0; g < numGlyphs; g += 1)
            {
                var u = (floor(g % 16) * du) - pu;
                var v = (floor(g / 16) * dv) - pv;
                glyphs[g] = {
                    width: w,
                    height: h,
                    awidth: w,
                    xoffset: 0,
                    yoffset: 0,
                    left: u,
                    top: v,
                    right: (u + du),
                    bottom: (v + dv),
                    page: 0
                };
            }
            font.lineHeight = h;
            font.baseline = h;
            font.glyphs = glyphs;
            font.numGlyphs = numGlyphs;
            font.minGlyphIndex = 0;
        };

        var buildDefaultFontTexture = function buildDefaultFontTextureFn(gd)
        {
            var fontData = [
                0, 0, 0, 0, 0, 0, 0, 0,
                126, 129, 165, 129, 189, 153, 129, 126,
                126, 255, 219, 255, 195, 231, 255, 126,
                108, 254, 254, 254, 124, 56, 16, 0,
                16, 56, 124, 254, 124, 56, 16, 0,
                56, 124, 56, 254, 254, 124, 56, 124,
                16, 16, 56, 124, 254, 124, 56, 124,
                0, 0, 24, 60, 60, 24, 0, 0,
                255, 255, 231, 195, 195, 231, 255, 255,
                0, 60, 102, 66, 66, 102, 60, 0,
                255, 195, 153, 189, 189, 153, 195, 255,
                15, 7, 15, 125, 204, 204, 204, 120,
                60, 102, 102, 102, 60, 24, 126, 24,
                63, 51, 63, 48, 48, 112, 240, 224,
                127, 99, 127, 99, 99, 103, 230, 192,
                153, 90, 60, 231, 231, 60, 90, 153,
                128, 224, 248, 254, 248, 224, 128, 0,
                2, 14, 62, 254, 62, 14, 2, 0,
                24, 60, 126, 24, 24, 126, 60, 24,
                102, 102, 102, 102, 102, 0, 102, 0,
                127, 219, 219, 123, 27, 27, 27, 0,
                62, 99, 56, 108, 108, 56, 204, 120,
                0, 0, 0, 0, 126, 126, 126, 0,
                24, 60, 126, 24, 126, 60, 24, 255,
                24, 60, 126, 24, 24, 24, 24, 0,
                24, 24, 24, 24, 126, 60, 24, 0,
                0, 24, 12, 254, 12, 24, 0, 0,
                0, 48, 96, 254, 96, 48, 0, 0,
                0, 0, 192, 192, 192, 254, 0, 0,
                0, 36, 102, 255, 102, 36, 0, 0,
                0, 24, 60, 126, 255, 255, 0, 0,
                0, 255, 255, 126, 60, 24, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                48, 120, 120, 120, 48, 0, 48, 0,
                108, 108, 108, 0, 0, 0, 0, 0,
                108, 108, 254, 108, 254, 108, 108, 0,
                48, 124, 192, 120, 12, 248, 48, 0,
                0, 198, 204, 24, 48, 102, 198, 0,
                56, 108, 56, 118, 220, 204, 118, 0,
                96, 96, 192, 0, 0, 0, 0, 0,
                24, 48, 96, 96, 96, 48, 24, 0,
                96, 48, 24, 24, 24, 48, 96, 0,
                0, 102, 60, 255, 60, 102, 0, 0,
                0, 48, 48, 252, 48, 48, 0, 0,
                0, 0, 0, 0, 0, 48, 48, 96,
                0, 0, 0, 252, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 48, 48, 0,
                6, 12, 24, 48, 96, 192, 128, 0,
                124, 198, 206, 222, 246, 230, 124, 0,
                48, 112, 48, 48, 48, 48, 252, 0,
                120, 204, 12, 56, 96, 204, 252, 0,
                120, 204, 12, 56, 12, 204, 120, 0,
                28, 60, 108, 204, 254, 12, 30, 0,
                252, 192, 248, 12, 12, 204, 120, 0,
                56, 96, 192, 248, 204, 204, 120, 0,
                252, 204, 12, 24, 48, 48, 48, 0,
                120, 204, 204, 120, 204, 204, 120, 0,
                120, 204, 204, 124, 12, 24, 112, 0,
                0, 48, 48, 0, 0, 48, 48, 0,
                0, 48, 48, 0, 0, 48, 48, 96,
                24, 48, 96, 192, 96, 48, 24, 0,
                0, 0, 252, 0, 0, 252, 0, 0,
                96, 48, 24, 12, 24, 48, 96, 0,
                120, 204, 12, 24, 48, 0, 48, 0,
                124, 198, 222, 222, 222, 192, 120, 0,
                48, 120, 204, 204, 252, 204, 204, 0,
                252, 102, 102, 124, 102, 102, 252, 0,
                60, 102, 192, 192, 192, 102, 60, 0,
                248, 108, 102, 102, 102, 108, 248, 0,
                126, 96, 96, 120, 96, 96, 126, 0,
                126, 96, 96, 120, 96, 96, 96, 0,
                60, 102, 192, 192, 206, 102, 62, 0,
                204, 204, 204, 252, 204, 204, 204, 0,
                120, 48, 48, 48, 48, 48, 120, 0,
                30, 12, 12, 12, 204, 204, 120, 0,
                230, 102, 108, 120, 108, 102, 230, 0,
                96, 96, 96, 96, 96, 96, 126, 0,
                198, 238, 254, 254, 214, 198, 198, 0,
                198, 230, 246, 222, 206, 198, 198, 0,
                56, 108, 198, 198, 198, 108, 56, 0,
                252, 102, 102, 124, 96, 96, 240, 0,
                120, 204, 204, 204, 220, 120, 28, 0,
                252, 102, 102, 124, 108, 102, 230, 0,
                120, 204, 224, 112, 28, 204, 120, 0,
                252, 48, 48, 48, 48, 48, 48, 0,
                204, 204, 204, 204, 204, 204, 252, 0,
                204, 204, 204, 204, 204, 120, 48, 0,
                198, 198, 198, 214, 254, 238, 198, 0,
                198, 198, 108, 56, 56, 108, 198, 0,
                204, 204, 204, 120, 48, 48, 120, 0,
                254, 6, 12, 24, 48, 96, 254, 0,
                120, 96, 96, 96, 96, 96, 120, 0,
                192, 96, 48, 24, 12, 6, 2, 0,
                120, 24, 24, 24, 24, 24, 120, 0,
                16, 56, 108, 198, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 255, 0,
                48, 48, 24, 0, 0, 0, 0, 0,
                0, 0, 120, 12, 124, 204, 118, 0,
                224, 96, 96, 124, 102, 102, 220, 0,
                0, 0, 120, 204, 192, 204, 120, 0,
                28, 12, 12, 124, 204, 204, 118, 0,
                0, 0, 120, 204, 252, 192, 120, 0,
                56, 108, 96, 240, 96, 96, 240, 0,
                0, 0, 118, 204, 204, 124, 12, 248,
                224, 96, 108, 118, 102, 102, 230, 0,
                48, 0, 112, 48, 48, 48, 120, 0,
                12, 0, 12, 12, 12, 204, 204, 120,
                224, 96, 102, 108, 120, 108, 230, 0,
                112, 48, 48, 48, 48, 48, 120, 0,
                0, 0, 204, 254, 254, 214, 198, 0,
                0, 0, 248, 204, 204, 204, 204, 0,
                0, 0, 120, 204, 204, 204, 120, 0,
                0, 0, 220, 102, 102, 124, 96, 240,
                0, 0, 118, 204, 204, 124, 12, 30,
                0, 0, 220, 118, 102, 96, 240, 0,
                0, 0, 124, 192, 120, 12, 248, 0,
                16, 48, 124, 48, 48, 52, 24, 0,
                0, 0, 204, 204, 204, 204, 118, 0,
                0, 0, 204, 204, 204, 120, 48, 0,
                0, 0, 198, 214, 254, 254, 108, 0,
                0, 0, 198, 108, 56, 108, 198, 0,
                0, 0, 204, 204, 204, 124, 12, 248,
                0, 0, 252, 152, 48, 100, 252, 0,
                28, 48, 48, 224, 48, 48, 28, 0,
                24, 24, 24, 0, 24, 24, 24, 0,
                224, 48, 48, 28, 48, 48, 224, 0,
                118, 220, 0, 0, 0, 0, 0, 0,
                0, 16, 56, 108, 198, 198, 254, 0
            ];

            function unpack(dst, d, c)
            {
                /*jshint bitwise: false*/
                dst[d + 0] = 255;
                dst[d + 1] = (c & 0x80 ? 255 : 0);
                dst[d + 2] = 255;
                dst[d + 3] = (c & 0x40 ? 255 : 0);
                dst[d + 4] = 255;
                dst[d + 5] = (c & 0x20 ? 255 : 0);
                dst[d + 6] = 255;
                dst[d + 7] = (c & 0x10 ? 255 : 0);
                dst[d + 8] = 255;
                dst[d + 9] = (c & 0x08 ? 255 : 0);
                dst[d + 10] = 255;
                dst[d + 11] = (c & 0x04 ? 255 : 0);
                dst[d + 12] = 255;
                dst[d + 13] = (c & 0x02 ? 255 : 0);
                dst[d + 14] = 255;
                dst[d + 15] = (c & 0x01 ? 255 : 0);
                /*jshint bitwise: true*/
            }

            var textureData = new Array(16 * 16 * 8 * 8 * 2);
            var x, y, row, xchar, xn, i, stride;

            row = 0;
            i = 0;
            stride = 16 * 8 * 2;
            for (y = 0; y < 16; y += 1)
            {
                xchar = row;
                for (x = 0; x < 16; x += 1)
                {
                    for (xn = 0; xn < 8; xn += 1)
                    {
                        unpack(textureData, xchar + (xn * stride), fontData[i]);
                        i += 1;
                    }

                    xchar += 8 * 2;
                }
                row += 16 * 8 * 8 * 2;
            }

            return gd.createTexture({
                name    : "defaultFont",
                width   : 128,
                height  : 64,
                depth   : 1,
                format  : 'L8A8',
                cubemap : false,
                mipmaps : true,
                dynamic : false,
                data    : textureData
            });
        };

        var fm = new FontManager();
        fm.primitive = gd.PRIMITIVE_TRIANGLES;
        fm.primitiveFan = gd.PRIMITIVE_TRIANGLE_FAN;
        fm.semantics = gd.createSemantics(['POSITION', 'TEXCOORD0']);
        fm.techniqueParameters = gd.createTechniqueParameters({
            texture: null
        });
        fm.sharedIndexBuffer = null;
        fm.sharedVertexBuffer = null;
        fm.reusableArrays = {};
        fm.float32ArrayConstructor = <{new(i:number): Float32Array;}><any>Array;
        if (typeof Float32Array !== "undefined")
        {
            var testArray = new Float32Array(4);
            var textDescriptor = Object.prototype.toString.call(testArray);
            if (textDescriptor === '[object Float32Array]')
            {
                fm.float32ArrayConstructor = Float32Array;
            }
        }

        if (!defaultFont)
        {
            defaultFont = new Font(gd, fm);

            var defaultFontTexture = buildDefaultFontTexture(gd);
            if (defaultFontTexture)
            {
                buildGlyphsGrid(defaultFont, defaultFontTexture, 128);

                defaultFont.textures = [defaultFontTexture];
                defaultFont.pageWidth = 128;
                defaultFont.pageHeight = 64;
            }
        }
        fonts["default"] = defaultFont;

        var singlePageLoaded = function singlePageLoadedFn(font: Font,
                                                           t: Texture)
        {
            font.textures = [t];
            font.pageWidth = t.width;
            font.pageHeight = t.height;

            var glyphs = font.glyphs;
            if (!glyphs)
            {
                // Assume regular grid
                buildGlyphsGrid(font, t, 256);
            }
        };

        /**
           Creates a font from an '.fnt' or '.fontdat'file and its associated image file

           @memberOf FontManager.prototype
           @public
           @function
           @name load

           @param {string} path Path to the font file without the extension
           @param {function} onFontLoaded function to call once the font has loaded

           @return {object} Font object if it exists, undefined otherwise
        */
        var loadFont = function loadFontFn(path, onFontLoaded?)
        {
            function pageComplete()
            {
                loadingPages[path] -= 1;
                if (loadingPages[path] === 0)
                {
                    // Last page response
                    delete loadingPages[path];
                    delete loadingFont[path];
                    numLoadingFonts -= 1;
                    return true;
                }
                return false;
            }

            function requestFn(url, onload /*, callContext */)
            {
                var font = fonts[path];
                if (!font)
                {
                    pageComplete();
                    return;
                }

                if (!gd.createTexture({
                    src     : url,
                    mipmaps : true,
                    onload  : onload
                }))
                {
                    errorCallback("Failed to create texture for font '" + path + "'.");
                    delete fonts[path];

                    pageComplete();
                }
            }

            var font = fonts[path];
            if (!font)
            {
                if (!(path in loadingFont))
                {
                    loadingFont[path] = true;
                    loadingPages[path] = 0;
                    numLoadingFonts += 1;

                    var observer = Observer.create();
                    loadedObservers[path] = observer;
                    if (onFontLoaded)
                    {
                        observer.subscribe(onFontLoaded);
                    }

                    var fontDataLoaded = function fontDataLoadedFn(text, status)
                    {
                        if (status === 200 && text)
                        {
                            font = new Font(gd, fm);

                            var fontData = JSON.parse(text);
                            var layouts = fontData.bitmapfontlayouts;
                            for (var p in layouts)
                            {
                                if (layouts.hasOwnProperty(p))
                                {
                                    var layout = layouts[p];
                                    font.bold = layout.bold || false;
                                    font.italic = layout.italic || false;
                                    font.pageWidth = layout.pagewidth || 0;
                                    font.pageHeight = layout.pageheight || 0;
                                    font.baseline = layout.baseline || 0;
                                    font.glyphs = layout.glyphs || null;
                                    font.numGlyphs = layout.numglyphs || 0;
                                    font.minGlyphIndex = layout.minglyphindex || 0;
                                    font.lineHeight = layout.lineheight || 0;
                                    font.pages = layout.pages || null;
                                    font.kernings = layout.kernings || null;
                                    break;
                                }
                            }
                        }
                        else
                        {
                            errorCallback("Failed to load font file: '" + path + "'.");
                            observer.notify(null);
                            delete loadingPages[path];
                            delete loadingFont[path];
                            numLoadingFonts -= 1;
                            if (status === 404)
                            {
                                fonts[path] = defaultFont;
                            }
                            return;
                        }

                        fonts[path] = font;
                        var texturePath;
                        var pages = font.pages;

                        if (pages)
                        {
                            var numPages = pages.length;
                            loadingPages[path] += numPages;

                            var onloadFn =
                                function onloadFn(t:Texture,
                                                  status: number,
                                                  callContext)
                            {
                                var font: Font = fonts[path];
                                var pageIdx = callContext.pageIdx;

                                if (font)
                                {
                                    if (t)
                                    {
                                        font.textures[pageIdx] = t;
                                        if (pageComplete())
                                        {
                                            observer.notify(font);
                                            delete loadedObservers[path];
                                        }
                                        return;
                                    }
                                    else
                                    {
                                        errorCallback("Failed to load font page: '" + pages[i] + "'.");
                                        delete fonts[path];
                                    }
                                }
                                pageComplete();
                            };

                            for (var i = 0; i < numPages; i += 1)
                            {
                                texturePath = pages[i];
                                rh.request({
                                    src: ((pathRemapping && pathRemapping[texturePath]) || (pathPrefix + texturePath)),
                                    onload: onloadFn,
                                    requestFn: requestFn,
                                    pageIdx: i
                                });
                            }
                        }
                        else
                        {
                            texturePath = (path + ".dds");
                            rh.request({
                                src: ((pathRemapping && pathRemapping[texturePath]) || (pathPrefix + texturePath)),
                                onload: function (t)
                                {
                                    if (t)
                                    {
                                        singlePageLoaded(font, t);

                                        observer.notify(font);
                                        delete loadedObservers[path];
                                    }
                                    else
                                    {
                                        errorCallback("Failed to load font page: '" + texturePath + "'.");
                                        delete fonts[path];
                                    }

                                    delete loadingPages[path];
                                    delete loadingFont[path];
                                    numLoadingFonts -= 1;
                                },
                                requestFn: function (url, onload)
                                {
                                    if (!gd.createTexture({
                                        src     : url,
                                        mipmaps : false,
                                        onload  : onload
                                    }))
                                    {
                                        if (text)
                                        {
                                            errorCallback("Failed to create texture for font '" + path + "'.");
                                        }
                                        else
                                        {
                                            errorCallback("Failed to load font '" + path + "'.");
                                        }
                                        delete fonts[path];
                                        delete loadingPages[path];
                                        delete loadingFont[path];
                                        numLoadingFonts -= 1;
                                    }
                                }
                            });
                        }
                    };

                    var dataPath = path;

                    var extension;
                    var dot = dataPath.lastIndexOf(".");
                    if (dot !== -1)
                    {
                        extension = dataPath.substr(dot);
                    }
                    if (!extension ||
                        (extension !== ".fnt" && extension !== ".fontdat"))
                    {
                        dataPath += ".fontdat";
                    }

                    rh.request({
                        src: (pathRemapping && pathRemapping[dataPath]) || (pathPrefix + dataPath),
                        onload: fontDataLoaded
                    });
                }
                else if (onFontLoaded)
                {
                    loadedObservers[path].subscribe(onFontLoaded);
                }
                font = defaultFont;
            }
            else
            {
                if (onFontLoaded)
                {
                    // the callback should always be called asynchronously
                    TurbulenzEngine.setTimeout(function fontAlreadyLoadedFn()
                                               {
                                                   onFontLoaded(font);
                                               }, 0);
                }
            }
            return font;
        };

        /**
           Alias one font to another name

           @memberOf FontManager.prototype
           @public
           @function
           @name map

           @param {string} dst Name of the alias
           @param {string} src Name of the font to be aliased
        */
        var mapFont = function mapFontFn(dst, src)
        {
            fonts[dst] = fonts[src];
            internalFont[dst] = true;
        };

        /**
           Removes a font from the manager

           @memberOf FontManager.prototype
           @public
           @function
           @name remove

           @param {string} path Path or name of the font
        */
        var removeFont = function removeFontFn(path)
        {
            if (path in fonts)
            {
                delete fonts[path];
            }
        };

        if (log)
        {
            fm.load = function loadFontLogFn(path, onfontloaded?)
            {
                log.innerHTML += "FontManager.load:&nbsp;'" + path + "'";
                return loadFont(path, onfontloaded);
            };

            fm.map = function mapFontLogFn(dst, src)
            {
                log.innerHTML += "FontManager.map:&nbsp;'" + src + "' -> '" + dst + "'";
                mapFont(dst, src);
            };

            fm.remove = function removeFontLogFn(path)
            {
                log.innerHTML += "FontManager.remove:&nbsp;'" + path + "'";
                removeFont(path);
            };
        }
        else
        {
            fm.load = loadFont;
            fm.map = mapFont;
            fm.remove = removeFont;
        }

        fm.get = function fontManagerGetFn(path)
        {
            var font = fonts[path];
            if (!font)
            {
                return defaultFont;
            }
            return font;
        };

        /**
           Get object containing all loaded fonts data

           @memberOf FontManager.prototype
           @public
           @function
           @name getAll

           @return {object}
        */
        fm.getAll = function getAllFontsFn()
        {
            return fonts;
        };

        /**
           Get number of fonts pending

           @memberOf FontManager.prototype
           @public
           @function
           @name getNumLoadingFonts

           @return {number}
        */
        fm.getNumPendingFonts = function getNumPendingFontsFn()
        {
            return numLoadingFonts;
        };

        /**
           Check if a font is not pending

           @memberOf FontManager.prototype
           @public
           @function
           @name isFontLoaded

           @param {string} path Path or name of the font

           @return {boolean}
        */
        fm.isFontLoaded = function isFontLoadedFn(path)
        {
            return !loadingFont[path];
        };

        /**
           Check if a font is missing

           @memberOf FontManager.prototype
           @public
           @function
           @name isFontMissing

           @param {string} path Path or name of the font

           @return {boolean}
        */
        fm.isFontMissing = function isFontMissingFn(path)
        {
            return !fonts[path];
        };

        /**
           Set path remapping dictionary

           @memberOf FontManager.prototype
           @public
           @function
           @name setPathRemapping

           @param {string} prm Path remapping dictionary
           @param {string} assetUrl Asset prefix for all assets loaded
        */
        fm.setPathRemapping = function setPathRemappingFn(prm, assetUrl)
        {
            pathRemapping = prm;
            pathPrefix = assetUrl;
        };

        /**
           Calculate text dimensions

           @memberOf FontManager.prototype
           @public
           @function
           @name calculateTextDimensions

           @param {string} path Name of the font
           @param {string} text Text to calculate dimensions for
           @param {number} scale Text scale
           @param {number} spacing Extra spacing between characters

           @return {object} Width and height of the text
        */
        fm.calculateTextDimensions = function calculateTextDimensionsFn(path, text, scale, spacing)
        {
            var font = fonts[path];
            if (font)
            {
                return font.calculateTextDimensions(text, scale, spacing);
            }
            else
            {
                return {
                    width: 0,
                    height: 0,
                    numGlyphs: 0
                };
            }
        };

        fm.reuseVertices = function reuseVerticesFn(vertices)
        {
            /*jshint bitwise: false*/
            (<FontManager><any>this).reusableArrays[vertices.length >> 4] = vertices;
            /*jshint bitwise: true*/
        };

        /**
           Destroy font manager

           @memberOf FontManager.prototype
           @public
           @function
           @name destroy
        */
        fm.destroy = function fontManagerDestroyFn(/* prm */)
        {
            if (fonts)
            {
                var p;
                for (p in fonts)
                {
                    if (fonts.hasOwnProperty(p))
                    {
                        var font = fonts[p];
                        if (font)
                        {
                            var texture = font.texture;
                            if (texture)
                            {
                                texture.destroy();
                                font.texture = null;
                            }
                        }
                    }
                }
                fonts = null;
            }
            if ((<FontManager><any>this).sharedVertexBuffer)
            {
                (<FontManager><any>this).sharedVertexBuffer.destroy();
                (<FontManager><any>this).sharedVertexBuffer = null;
            }
            if ((<FontManager><any>this).sharedIndexBuffer)
            {
                (<FontManager><any>this).sharedIndexBuffer.destroy();
                (<FontManager><any>this).sharedIndexBuffer = null;
            }
            (<FontManager><any>this).techniqueParameters = null;
            (<FontManager><any>this).semantics = null;
            loadingFont = null;
            loadingPages = null;
            loadedObservers = null;
            loadingPages = null;
            numLoadingFonts = 0;
            internalFont = null;
            pathRemapping = null;
            pathPrefix = null;
            rh = null;
            gd = null;
        };

        return fm;
    }
}
