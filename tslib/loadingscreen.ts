// Copyright (c) 2009-2013 Turbulenz Limited

class LoadingScreen
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    gd                   : GraphicsDevice;

    clipSpace            : any; // v4

    textureWidthHalf     : number;
    textureHeightHalf    : number;
    textureTechnique     : Technique;
    textureMaterial      : TechniqueParameters;
    textureVertexFormats : any[];
    textureSemantics     : Semantics;

    backgroundColor      : any; // v4
    backgroundTechnique  : Technique;
    backgroundMaterial   : TechniqueParameters;

    posVertexFormats     : any[];
    posSemantics         : Semantics;

    barBackgroundColor   : any; // v4
    barColor             : any; // v4
    barCenter            : { x : number; y : number; };
    barBorderSize        : number;
    barBackgroundWidth   : number;
    barBackgroundHeight  : number;
    assetTracker         : AssetTracker;
    progress             : number;

    setProgress(progress: number)
    {
        this.progress = progress;
    }

    setTexture(texture)
    {
        /* tslint:disable:no-string-literal */
        this.textureMaterial['diffuse'] = texture;
        /* tslint:enable:no-string-literal */
        this.textureWidthHalf  = (texture.width  * 0.5);
        this.textureHeightHalf = (texture.height * 0.5);
    }

    loadAndSetTexture(graphicsDevice, requestHandler, mappingTable, name)
    {
        var that = this;
        if (mappingTable)
        {
            var urlMapping = mappingTable.urlMapping;
            var assetPrefix = mappingTable.assetPrefix;
            requestHandler.request({
                    src: ((urlMapping && urlMapping[name]) || (assetPrefix + name)),
                    requestFn: function textureRequestFn(src, onload)
                    {
                        return graphicsDevice.createTexture({
                                src     : src,
                                mipmaps : false,
                                onload  : onload
                            });
                    },
                    onload: function (t)
                    {
                        if (t)
                        {
                            that.setTexture(t);
                        }
                    }
                });
        }
    }

    render(backgroundAlpha, textureAlpha)
    {
        var gd = this.gd;
        var screenWidth = gd.width;
        var screenHeight = gd.height;

        if ((screenWidth === 0) || (screenHeight === 0))
        {
            return;
        }

        var writer;
        var primitive = gd.PRIMITIVE_TRIANGLE_STRIP;

        var backgroundMaterial;

        if (0 < backgroundAlpha)
        {
            // TODO: Cache this.backgroundColor here, rather than below

            this.backgroundColor[3] = backgroundAlpha;

            if (backgroundAlpha >= 1)
            {
                gd.clear(this.backgroundColor);
            }
            else
            {
                gd.setTechnique(this.backgroundTechnique);

                var backgroundColor = this.backgroundColor;
                backgroundMaterial = this.backgroundMaterial;

                /* tslint:disable:no-string-literal */
                backgroundMaterial['color'] = backgroundColor;
                /* tslint:enable:no-string-literal */
                gd.setTechniqueParameters(backgroundMaterial);

                writer = gd.beginDraw(primitive, 4, this.posVertexFormats,
                                      this.posSemantics);
                if (writer)
                {
                    writer(-1, -1);
                    writer(1, -1);
                    writer(-1, 1);
                    writer(1, 1);

                    gd.endDraw(writer);
                    writer = null;
                }
            }
        }

        var centerx = 0;
        var centery = 0;
        var left = 0;
        var right = 0;
        var top = 0;
        var bottom = 0;

        var assetTracker = this.assetTracker;
        var progress = (assetTracker && assetTracker.getLoadingProgress()) || this.progress;

        var xScale = 2 / screenWidth;
        var yScale = -2 / screenHeight;

        if ((progress !== null) && (backgroundAlpha > 0))
        {
            if (progress < 0)
            {
                progress = 0;
            }
            else if (progress > 1)
            {
                progress = 1;
            }

            backgroundMaterial = this.backgroundMaterial;
            var barBackgroundColor = this.barBackgroundColor;

            barBackgroundColor[3] = backgroundAlpha;

            var barColor = this.barColor;
            barColor[3] = backgroundAlpha;

            centerx = this.barCenter.x * screenWidth;
            centery = this.barCenter.y * screenHeight;
            var barBackgroundWidth = this.barBackgroundWidth;
            var halfBarHeight = 0.5 * this.barBackgroundHeight;
            var barBorderSize = this.barBorderSize;

            gd.setTechnique(this.backgroundTechnique);

            /* tslint:disable:no-string-literal */
            backgroundMaterial['color'] = barBackgroundColor;
            /* tslint:enable:no-string-literal */
            gd.setTechniqueParameters(backgroundMaterial);

            writer = gd.beginDraw(primitive, 4, this.posVertexFormats,
                                  this.posSemantics);
            if (writer)
            {
                left   = centerx - (0.5 * barBackgroundWidth);
                right  = left + barBackgroundWidth;
                top    = (centery - halfBarHeight);
                bottom = (centery + halfBarHeight);

                writer((left  * xScale) - 1, (top    * yScale) + 1);
                writer((right * xScale) - 1, (top    * yScale) + 1);
                writer((left  * xScale) - 1, (bottom * yScale) + 1);
                writer((right * xScale) - 1, (bottom * yScale) + 1);

                gd.endDraw(writer);
                writer = null;
            }

            /* tslint:disable:no-string-literal */
            backgroundMaterial['color'] = barColor;
            /* tslint:enable:no-string-literal */
            gd.setTechniqueParameters(backgroundMaterial);

            writer = gd.beginDraw(primitive, 4, this.posVertexFormats,
                                  this.posSemantics);

            if (writer)
            {
                left   = left + barBorderSize;
                right  = left + ((barBackgroundWidth - (2 * barBorderSize)) * progress);
                top    = top + barBorderSize;
                bottom = bottom - barBorderSize;

                writer((left  * xScale) - 1, (top    * yScale) + 1);
                writer((right * xScale) - 1, (top    * yScale) + 1);
                writer((left  * xScale) - 1, (bottom * yScale) + 1);
                writer((right * xScale) - 1, (bottom * yScale) + 1);

                gd.endDraw(writer);
                writer = null;
            }
        }

        var textureWidthHalf = this.textureWidthHalf;
        var textureHeightHalf = this.textureHeightHalf;

        if (0 < textureWidthHalf && 0 < textureAlpha)
        {
            var textureMaterial = this.textureMaterial;

            gd.setTechnique(this.textureTechnique);

            var clipSpace = this.clipSpace;
            clipSpace[0] = xScale;
            clipSpace[1] = yScale;

            /* tslint:disable:no-string-literal */
            textureMaterial['clipSpace'] = clipSpace;
            textureMaterial['alpha'] = textureAlpha;
            /* tslint:enable:no-string-literal */
            gd.setTechniqueParameters(textureMaterial);

            writer = gd.beginDraw(primitive, 4, this.textureVertexFormats,
                                  this.textureSemantics);
            if (writer)
            {
                centerx = (screenWidth  * 0.5);
                centery = (screenHeight * 0.5);

                left   = (centerx - textureWidthHalf);
                right  = (centerx + textureWidthHalf);
                top    = (centery - textureHeightHalf);
                bottom = (centery + textureHeightHalf);
                writer(left,  top,    0, 0);
                writer(right, top,    1, 0);
                writer(left,  bottom, 0, 1);
                writer(right, bottom, 1, 1);
                gd.endDraw(writer);
                writer = null;
            }
        }
    }

    static create(gd: GraphicsDevice, md: MathDevice,
                  parameters: any): LoadingScreen
    {
        var f = new LoadingScreen();

        f.gd = gd;

        f.backgroundColor = md.v4Build(0.231, 0.231, 0.231, 1.0);
        f.backgroundTechnique = null;
        f.backgroundMaterial = gd.createTechniqueParameters();

        f.posVertexFormats = [gd.VERTEXFORMAT_FLOAT2];
        f.posSemantics = gd.createSemantics(['POSITION']);

        f.clipSpace = md.v4Build(1.0, 1.0, -1.0, 1.0);

        f.textureWidthHalf = 0;
        f.textureHeightHalf = 0;
        f.textureTechnique = null;
        f.textureMaterial = gd.createTechniqueParameters();
        f.textureVertexFormats =
            [gd.VERTEXFORMAT_FLOAT2, gd.VERTEXFORMAT_FLOAT2];
        f.textureSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0']);

        if (parameters)
        {
            f.barBackgroundColor = md.v4BuildZero();
            f.barColor = md.v4BuildOne();
            f.barCenter = {x : 0.5, y : 0.75};
            f.barBorderSize = 4;
            f.barBackgroundWidth = 544;
            f.barBackgroundHeight = 32;
            f.assetTracker = null;
            f.progress = null;

            if (parameters.backgroundColor)
            {
                f.backgroundColor = parameters.backgroundColor;
            }

            if (parameters.barBackgroundColor)
            {
                f.barBackgroundColor = parameters.barBackgroundColor;
            }

            if (parameters.barColor)
            {
                f.barColor = parameters.barColor;
            }

            if (parameters.barCenter)
            {
                var percentage;

                percentage = parameters.barCenter.x;
                f.barCenter.x = (percentage > 1.0) ? 1.0 : ((percentage < 0.0) ? 0.0 : percentage);

                percentage = parameters.barCenter.y;
                f.barCenter.y = (percentage > 1.0) ? 1.0 : ((percentage < 0.0) ? 0.0 : percentage);
            }

            if (parameters.barBorderSize)
            {
                f.barBorderSize = parameters.barBorderSize;
            }

            if (parameters.barBackgroundWidth)
            {
                f.barBackgroundWidth = parameters.barBackgroundWidth;
            }

            if (parameters.barBackgroundHeight)
            {
                f.barBackgroundHeight = parameters.barBackgroundHeight;
            }

            if (parameters.assetTracker)
            {
                f.assetTracker = parameters.assetTracker;
            }

            if (parameters.progress)
            {
                f.progress = parameters.progress;
            }
        }

        /* tslint:disable:whitespace */
        /* tslint:disable:max-line-length */
        var shaderParams =
            {
                "version": 1,
                "name": "loadingscreen.cgfx",
                "samplers":
                {
                    "diffuse":
                    {
                        "MinFilter": 9729,
                        "MagFilter": 9729,
                        "WrapS": 33071,
                        "WrapT": 33071
                    }
                },
                "parameters":
                {
                    "color":
                    {
                        "type": "float",
                        "columns": 4
                    },
                    "clipSpace":
                    {
                        "type": "float",
                        "columns": 4
                    },
                    "alpha":
                    {
                        "type": "float"
                    },
                    "diffuse":
                    {
                        "type": "sampler2D"
                    }
                },
                "techniques":
                {
                    "background":
                    [
                        {
                            "parameters": ["color"],
                            "semantics": ["POSITION"],
                            "states":
                            {
                                "DepthTestEnable": false,
                                "DepthMask": false,
                                "CullFaceEnable": false,
                                "BlendEnable": true,
                                "BlendFunc": [770,771]
                            },
                            "programs": ["vp_background","fp_background"]
                        }
                    ],
                    "texture":
                    [
                        {
                            "parameters": ["clipSpace","alpha","diffuse"],
                            "semantics": ["POSITION","TEXCOORD0"],
                            "states":
                            {
                                "DepthTestEnable": false,
                                "DepthMask": false,
                                "CullFaceEnable": false,
                                "BlendEnable": true,
                                "BlendFunc": [770,771]
                            },
                            "programs": ["vp_texture","fp_texture"]
                        }
                    ]
                },
                "programs":
                {
                    "fp_texture":
                    {
                        "type": "fragment",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];\nfloat _TMP0;float _TMP1;float _TMP12;uniform float alpha;uniform sampler2D diffuse;void main()\n{vec4 _textureColor;_textureColor=texture2D(diffuse,tz_TexCoord[0].xy);_TMP1=min(1.0,alpha);_TMP12=max(0.0,_TMP1);_TMP0=_TMP12*_TMP12*(3.0-2.0*_TMP12);_textureColor.w=_textureColor.w*_TMP0;gl_FragColor=_textureColor;}"
                    },
                    "vp_texture":
                    {
                        "type": "vertex",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];attribute vec4 ATTR0;attribute vec4 ATTR8;\nvec4 _OutPosition1;vec2 _OutUV1;uniform vec4 clipSpace;void main()\n{_OutPosition1.xy=ATTR0.xy*clipSpace.xy+clipSpace.zw;_OutPosition1.zw=ATTR0.zw;_OutUV1=ATTR8.xy;tz_TexCoord[0].xy=ATTR8.xy;gl_Position=_OutPosition1;}"
                    },
                    "fp_background":
                    {
                        "type": "fragment",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvec4 _ret_0;float _TMP0;float _TMP1;float _TMP11;uniform vec4 color;void main()\n{_TMP1=min(1.0,color.w);_TMP11=max(0.0,_TMP1);_TMP0=_TMP11*_TMP11*(3.0-2.0*_TMP11);_ret_0=vec4(color.x,color.y,color.z,_TMP0);gl_FragColor=_ret_0;}"
                    },
                    "vp_background":
                    {
                        "type": "vertex",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nattribute vec4 ATTR0;\nvoid main()\n{gl_Position=ATTR0;}"
                    }
                }
            };
            /* tslint:enable:max-line-length */
            /* tslint:enable:whitespace */

        var shader = gd.createShader(shaderParams);
        if (shader)
        {
            f.backgroundTechnique = shader.getTechnique("background");
            f.textureTechnique = shader.getTechnique("texture");
            return f;
        }

        return null;
    }
}
