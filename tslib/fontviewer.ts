// Copyright (c) 2009-2013 Turbulenz Limited

/*global jQuery: false*/

/// <reference path="../external/definitelytyped/jquery/jquery-1.8.d.ts" />

/// <reference path="turbulenz.d.ts" />
/// <reference path="debug.ts" />

//
// FontViewer
//
class FontViewer
{
    static version = 1;

    pathPrefix: string;
    assetServer: string;

    primitive: number;
    vertexFormats: number[];
    semantics: Semantics;
    techniqueParameters: TechniqueParameters;

    fontData: any;
    debugTechnique: Technique;
    technique: Technique;
    shader: Shader;
    texture: Texture;
    loaded: bool;
    aspectRatio: number;
    glyphs: any;
    numGlyphs: number;
    minGlyphIndex: number;

    debugPrimitive: number;
    debugVertexFormats: number[];
    debugSemantics: Semantics;
    debugMaterial: TechniqueParameters;

    load: (assetPath) => void;
    enderFrame: () => void;
    destroy: () => void;

    // Constructor function
    static create(tz, applicationSettings) : FontViewer
    {
        var graphicsDeviceParameters = { };
        var gd = tz.createGraphicsDevice(graphicsDeviceParameters);

        var vi = new FontViewer();
        vi.pathPrefix = applicationSettings.assetPrefix;
        vi.assetServer = applicationSettings.mappingTablePrefix;

        vi.primitive = gd.PRIMITIVE_TRIANGLES;
        vi.vertexFormats = [gd.VERTEXFORMAT_FLOAT2, gd.VERTEXFORMAT_FLOAT2];
        vi.semantics = gd.createSemantics(['POSITION', 'TEXCOORD0']);
        vi.techniqueParameters = gd.createTechniqueParameters({
            transform: [1.0, 0.0, 0.0,
                        0.0, 1.0, 0.0],
            cliptransform: [0, 0, 0,
                            0, 0, 0],
            color: [1.0, 1.0, 1.0, 1.0]
        });

        vi.debugPrimitive = gd.PRIMITIVE_LINES;
        vi.debugVertexFormats = [gd.VERTEXFORMAT_FLOAT2];
        vi.debugSemantics = gd.createSemantics(['POSITION']);
        vi.debugMaterial = gd.createTechniqueParameters({
            transform: [1.0, 0.0, 0.0,
                        0.0, 1.0, 0.0],
            cliptransform: [0, 0, 0,
                            0, 0, 0],
            color: [1.0, 0.75, 0.8, 1.0]
        });

        vi.load = function viewerLoadFn(assetPath)
        {
            jQuery(function ($j) {
                $j('#loading').toggle();
            });

            vi.fontData = null;
            vi.debugTechnique = null;
            vi.technique = null;
            vi.shader = null;
            vi.texture = null;
            vi.techniqueParameters['texture'] = null;
            vi.loaded = false;

            var numAssetsToLoad = 3;

            var fontdatReceived = function fontdatReceivedFn(text)
            {
                numAssetsToLoad -= 1;

                var fontData = JSON.parse(text);
                vi.fontData = fontData;

                var layouts = fontData.bitmapfontlayouts;
                var dataName;
                for (var p in layouts)
                {
                    if (layouts.hasOwnProperty(p))
                    {
                        dataName = p;

                        var font = layouts[p];
                        vi.glyphs = font.glyphs;
                        vi.numGlyphs = font.numglyphs;
                        vi.minGlyphIndex = font.minglyphindex;
                        break;
                    }
                }

                var texturePath = vi.pathPrefix + dataName + ".dds";
                if (!gd.createTexture({
                    src     : texturePath,
                    mipmaps : false,
                    onload  : function (t)
                    {
                        if (t)
                        {
                            vi.texture = t;
                            vi.techniqueParameters['texture'] = t;
                            vi.aspectRatio = (t.width / t.height);

                            numAssetsToLoad -= 1;
                            if (0 === numAssetsToLoad)
                            {
                                vi.loaded = true;
                                jQuery(function ($j) {
                                    $j('#loading').toggle();
                                });
                            }
                        }
                    }
                }))
                {
                    debug.abort("Texture '" + texturePath + "' not created.");
                }
            };

            tz.request(vi.pathPrefix + assetPath, fontdatReceived);

            tz.request(vi.pathPrefix + 'shaders/gui.cgfx',
                       function (shaderText)
                       {
                           debug.assert(shaderText, "Shader 'shaders/gui.cgfx' not created.");

                           if (shaderText)
                           {
                               var shaderParameters = JSON.parse(shaderText);
                               var s = gd.createShader(shaderParameters);

                               debug.assert(s, "Shader 'shaders/gui.cgfx' not created.");

                               if (s)
                               {
                                   vi.shader = s;
                                   vi.technique = s.getTechnique('blend');
                                   vi.debugTechnique = s.getTechnique('flat');

                                   numAssetsToLoad -= 1;
                                   if (0 === numAssetsToLoad)
                                   {
                                       vi.loaded = true;
                                       jQuery(function ($j) {
                                           $j('#loading').toggle();
                                       });
                                   }
                               }
                           }
                       });
        };


        var renderFrame = function renderFrameFn()
        {
            if (gd.beginFrame())
            {
                if (vi.loaded)
                {
                    var width, height;
                    gd.clear([0.0, 0.0, 0.0, 0.0]);

                    gd.setTechnique(vi.technique);

                    gd.setTechniqueParameters(vi.techniqueParameters);

                    var writer = gd.beginDraw(vi.primitive, 6, vi.vertexFormats, vi.semantics);
                    if (writer)
                    {
                        width  =  2;
                        height = -2;
                        if (1 < vi.aspectRatio)
                        {
                            height /= vi.aspectRatio;
                        }
                        else if (1 > vi.aspectRatio)
                        {
                            width *= vi.aspectRatio;
                        }

                        writer(-1.0,         1.0,          0.0, 0.0);
                        writer(-1.0 + width, 1.0,          1.0, 0.0);
                        writer(-1.0 + width, 1.0 + height, 1.0, 1.0);
                        writer(-1.0 + width, 1.0 + height, 1.0, 1.0);
                        writer(-1.0,         1.0 + height, 0.0, 1.0);
                        writer(-1.0,         1.0,          0.0, 0.0);

                        gd.endDraw(writer);
                    }

                    gd.setTechnique(vi.debugTechnique);

                    vi.debugMaterial['transform'] = [width, 0.0, -1.0,
                                                     0.0, height, 1.0];
                    vi.debugMaterial['color'] = [1.0, 0.75, 0.8, 1.0];
                    gd.setTechniqueParameters(vi.debugMaterial);

                    var numGlyphs = vi.numGlyphs;
                    writer = gd.beginDraw(vi.debugPrimitive, (8 * numGlyphs), vi.debugVertexFormats, vi.debugSemantics);
                    if (writer)
                    {
                        var glyphs = vi.glyphs;
                        for (var g = vi.minGlyphIndex; g < 256; g += 1)
                        {
                            if (glyphs.hasOwnProperty(g))
                            {
                                var glyph = glyphs[g];
                                writer(glyph.left,  glyph.top);
                                writer(glyph.right, glyph.top);
                                writer(glyph.right, glyph.top);
                                writer(glyph.right, glyph.bottom);
                                writer(glyph.right, glyph.bottom);
                                writer(glyph.left,  glyph.bottom);
                                writer(glyph.left,  glyph.bottom);
                                writer(glyph.left,  glyph.top);

                                numGlyphs -= 1;
                                if (0 === numGlyphs)
                                {
                                    break;
                                }
                            }
                        }

                        gd.endDraw(writer);
                    }

                    if (1 !== vi.aspectRatio)
                    {
                        vi.debugMaterial['transform'] = [1.0, 0.0, 0.0,
                                                         0.0, 1.0, 0.0];
                        vi.debugMaterial['color'] = [1.0, 1.0, 1.0, 1.0];
                        gd.setTechniqueParameters(vi.debugMaterial);

                        writer = gd.beginDraw(vi.primitive, 12, vi.debugVertexFormats, vi.debugSemantics);
                        if (writer)
                        {
                            writer(-1.0 + width, 1.0);
                            writer(1.0,          1.0);
                            writer(1.0,          -1.0);
                            writer(1.0,          -1.0);
                            writer(-1.0 + width, -1.0);
                            writer(-1.0 + width, 1.0);

                            writer(-1.0, 1.0 + height);
                            writer(1.0,  1.0 + height);
                            writer(1.0,  -1.0);
                            writer(1.0,  -1.0);
                            writer(-1.0, -1.0);
                            writer(-1.0, 1.0 + height);

                            gd.endDraw(writer);
                        }
                    }
                }
                else
                {
                    gd.clear([1.0, 1.0, 1.0, 1.0]);
                }

                gd.endFrame();
            }
        };

        var intervalID = window.setInterval(renderFrame, 1000 / 30);

        vi.destroy = function destroyFn()
        {
            window.clearInterval(intervalID);
            delete vi.loaded;
            delete vi.debugTechnique;
            delete vi.technique;
            delete vi.shader;
            delete vi.primitive;
            delete vi.vertexFormats;
            delete vi.semantics;
            delete vi.techniqueParameters;
            delete vi.debugPrimitive;
            delete vi.debugVertexFormats;
            delete vi.debugSemantics;
            delete vi.debugMaterial;
            delete vi.texture;
            delete vi.fontData;
            gd = null;
        };

        return vi;
    };
};
