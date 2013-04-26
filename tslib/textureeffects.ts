// Copyright (c) 2012 Turbulenz Limited

/// <reference path="turbulenz.d.ts" />

interface TextureEffect
{
    technique   : Technique;
    params      : TechniqueParameters;
    destination : RenderTarget;
};

class TextureEffects
{
    static version = 1;

    graphicsDevice: GraphicsDevice;
    mathDevice: MathDevice;

    staticVertexBufferParams: VertexBufferParameters;
    staticVertexBuffer: VertexBuffer;

    effectParams: TextureEffect;

    quadSemantics: Semantics;
    quadPrimitive: number;

    distortParameters: TechniqueParameters;
    distortTechnique: Technique;
    colorMatrixParameters: TechniqueParameters;
    colorMatrixTechnique: Technique;
    bloomThresholdParameters: TechniqueParameters;
    bloomThresholdTechnique: Technique;
    bloomMergeParameters: TechniqueParameters;
    bloomMergeTechnique: Technique;
    gaussianBlurParameters: TechniqueParameters;
    gaussianBlurTechnique: Technique;

    // Methods

    grayScaleMatrix(dst)
    {
        if (dst === undefined)
        {
            dst = this.mathDevice.m43BuildIdentity();
        }
        dst[0] = 0.2126;
        dst[1] = 0.2126;
        dst[2] = 0.2126;
        dst[3] = 0.7152;
        dst[4] = 0.7152;
        dst[5] = 0.7152;
        dst[6] = 0.0722;
        dst[7] = 0.0722;
        dst[8] = 0.0722;
        dst[9] = dst[10] = dst[11] = 0;
        return dst;
    };

    sepiaMatrix(dst)
    {
        if (dst === undefined)
        {
            dst = this.mathDevice.m43BuildIdentity();
        }
        dst[0] = 0.393;
        dst[1] = 0.349;
        dst[2] = 0.272;
        dst[3] = 0.769;
        dst[4] = 0.686;
        dst[5] = 0.534;
        dst[6] = 0.189;
        dst[7] = 0.168;
        dst[8] = 0.131;
        dst[9] = dst[10] = dst[11] = 0;
        return dst;
    };

    negativeMatrix(dst)
    {
        if (dst === undefined)
        {
            dst = this.mathDevice.m43BuildIdentity();
        }
        dst[0] = dst[4] = dst[8] = -1;
        dst[1] = dst[2] = dst[3] = dst[5] = dst[6] = dst[7] = 0;
        dst[9] = dst[10] = dst[11] = 1;
        return dst;
    };

    saturationMatrix(saturationScale, dst)
    {
        if (dst === undefined)
        {
            dst = this.mathDevice.m43BuildIdentity();
        }
        var is = (1 - saturationScale);
        dst[0] = (is * 0.2126) + saturationScale;
        dst[1] = (is * 0.2126);
        dst[2] = (is * 0.2126);
        dst[3] = (is * 0.7152);
        dst[4] = (is * 0.7152) + saturationScale;
        dst[5] = (is * 0.7152);
        dst[6] = (is * 0.0722);
        dst[7] = (is * 0.0722);
        dst[8] = (is * 0.0722) + saturationScale;
        dst[9] = dst[10] = dst[11] = 0;
        return dst;
    };

    hueMatrix(angle, dst)
    {
        if (dst === undefined)
        {
            dst = this.mathDevice.m43BuildIdentity();
        }

        ////
        //// Uncomment to calculate new coeffecients should luminance
        //// values 0.2126 0.7152 0.0722 change.
        //var lumR = 0.2126;
        //var lumG = 0.7152;
        //var lumB = 0.0722;
        ////
        //Var r23 = Math.sqrt(2 / 3);
        //Var r12 = 1 / Math.sqrt(2);
        //Var r13 = 1 / Math.sqrt(3);
        //Var r16 = 1 / Math.sqrt(6);

        //Var M = [r23, 0, r13, -r16, r12, r13, -r16, -r12, r13, 0, 0, 0];

        //Var zx = (r23 * lumR) - (r16 * lumG) - (r16 * lumB);
        //Var zy =                (r12 * lumG) - (r12 * lumB);
        //Var zz = (r13 * lumR) + (r13 * lumG) + (r13 * lumB);
        //Var x = zx / zz;
        //Var y = zy / zz;
        //Var C = [1, 0, x, 0, 1, y, 0, 0, 1, 0, 0, 0];

        //M = this.mathDevice.m43Mul(M, C, M);
        //Console.log("Pre transform = ", M);

        //Var E = [1, 0, -x, 0, 1, -y, 0, 0, 1, 0, 0, 0];
        //Var N = [r23, -r16, -r16, 0, r12, -r12, r13, r13, r13, 0, 0, 0];
        //This.mathDevice.m43Mul(E, N, N);
        //Console.log("Post transform = ", N);
        ////
        //// Final matrix is then: m43Mul(Pre, [c, s, 0, -s, c, 0, 0, 0, 1, 0, 0, 0, ], Post);
        //// for c = cos(angle), s = sin(angle)
        ////
        //Var out = "";
        //Out += "var c = Math.cos(angle);\n";
        //Out += "var s = Math.sin(angle);\n";
        //Out += "dst[0] = (" + (N[0]*M[0]+N[3]*M[1]) + " * c) + (" + (N[3]*M[0]-N[0]*M[1]) + " * s) + " + lumR+";\n";
        //Out += "dst[1] = (" + (-lumR)               + " * c) + (" + (N[4]*M[0]-N[1]*M[1]) + " * s) + " + lumR+";\n";
        //Out += "dst[2] = (" + (-lumR)               + " * c) + (" + (N[5]*M[0]-N[2]*M[1]) + " * s) + " + lumR+";\n";
        //Out += "dst[3] = (" + (-lumG)               + " * c) + (" + (N[3]*M[3]-N[0]*M[4]) + " * s) + " + lumG+";\n";
        //Out += "dst[4] = (" + (N[1]*M[3]+N[4]*M[4]) + " * c) + (" + (N[4]*M[3]-N[1]*M[4]) + " * s) + " + lumG+";\n";
        //Out += "dst[5] = (" + (-lumG)               + " * c) + (" + (N[5]*M[3]-N[2]*M[4]) + " * s) + " + lumG+";\n";
        //Out += "dst[6] = (" + (-lumB)               + " * c) + (" + (N[3]*M[6]-N[0]*M[7]) + " * s) + " + lumB+";\n";
        //Out += "dst[7] = (" + (-lumB)               + " * c) + (" + (N[4]*M[6]-N[1]*M[7]) + " * s) + " + lumB+";\n";
        //Out += "dst[8] = (" + (N[2]*M[6]+N[5]*M[7]) + " * c) + (" + (N[5]*M[6]-N[2]*M[7]) + " * s) + " + lumB+";\n";
        //Console.log(out);

        var c = Math.cos(angle);
        var s = Math.sin(angle);
        dst[0] = (0.7874  * c) + (-0.3712362230889293  * s) + 0.2126;
        dst[1] = (-0.2126 * c) + (0.20611404610069642  * s) + 0.2126;
        dst[2] = (-0.2126 * c) + (-0.9485864922785551  * s) + 0.2126;
        dst[3] = (-0.7152 * c) + (-0.4962902913954023  * s) + 0.7152;
        dst[4] = (0.2848  * c) + (0.08105997779422341  * s) + 0.7152;
        dst[5] = (-0.7152 * c) + (0.6584102469838492   * s) + 0.7152;
        dst[6] = (-0.0722 * c) + (0.8675265144843316   * s) + 0.0722;
        dst[7] = (-0.0722 * c) + (-0.28717402389491986 * s) + 0.0722;
        dst[8] = (0.9278  * c) + (0.290176245294706    * s) + 0.0722;
        dst[9] = dst[10] = dst[11] = 0;

        return dst;
    };

    brightnessMatrix(brightnessOffset, dst)
    {
        if (dst === undefined)
        {
            dst = this.mathDevice.m43BuildIdentity();
        }

        dst[0] = dst[4] = dst[8] = 1;
        dst[1] = dst[2] = dst[3] = dst[5] = dst[6] = dst[7] = 0;
        dst[9] = dst[10] = dst[11] = brightnessOffset;

        return dst;
    };

    contrastMatrix(contrastScale, dst)
    {
        if (dst === undefined)
        {
            dst = this.mathDevice.m43BuildIdentity();
        }

        dst[0] = dst[4] = dst[8] = contrastScale;
        dst[1] = dst[2] = dst[3] = dst[5] = dst[6] = dst[7] = 0;
        dst[9] = dst[10] = dst[11] = 0.5 * (1 - contrastScale);

        return dst;
    };

    applyBloom(params): bool
    {
        var source = params.source;
        var blur1 = params.blurTarget1;
        var blur2 = params.blurTarget2;
        var dest = params.destination;
        if (!source || !dest || !blur1 || !blur2 ||
            !blur1.colorTexture0 || !blur2.colorTexture0 ||
            blur1 === blur2 || blur1 === dest ||
            source === blur1.colorTexture0 || source === dest.colorTexture0)
        {
            return false;
        }

        var effectParams = this.effectParams;
        var techparams;

        // Threshold copy.
        techparams = this.bloomThresholdParameters;
        effectParams.technique = this.bloomThresholdTechnique;
        effectParams.params = techparams;

        techparams.bloomThreshold = (params.bloomThreshold !== undefined) ? params.bloomThreshold : 0.65;
        techparams.thresholdCutoff = Math.exp((params.thresholdCutoff !== undefined) ? params.thresholdCutoff : 3);
        techparams.inputTexture0 = source;
        effectParams.destination = blur1;
        this.applyEffect(effectParams);

        // Gaussian blur.
        techparams = this.gaussianBlurParameters;
        effectParams.technique = this.gaussianBlurTechnique;
        effectParams.params = techparams;

        var sampleRadius = (params.blurRadius || 20);
        techparams.sampleRadius[0] = sampleRadius / source.width;
        techparams.sampleRadius[1] = 0;
        techparams.inputTexture0 = blur1.colorTexture0;
        effectParams.destination = blur2;
        this.applyEffect(effectParams);

        techparams.sampleRadius[0] = 0;
        techparams.sampleRadius[1] = sampleRadius / source.height;
        techparams.inputTexture0 = blur2.colorTexture0;
        effectParams.destination = blur1;
        this.applyEffect(effectParams);

        // Merge.
        techparams = this.bloomMergeParameters;
        effectParams.technique = this.bloomMergeTechnique;
        effectParams.params = techparams;

        techparams.bloomIntensity     = (params.bloomIntensity     !== undefined) ? params.bloomIntensity     : 1.2;
        techparams.bloomSaturation    = (params.bloomSaturation    !== undefined) ? params.bloomSaturation    : 1.2;
        techparams.originalIntensity  = (params.originalIntensity  !== undefined) ? params.originalIntensity  : 1.0;
        techparams.originalSaturation = (params.originalSaturation !== undefined) ? params.originalSaturation : 1.0;
        techparams.inputTexture0 = source;
        techparams.inputTexture1 = blur1.colorTexture0;
        effectParams.destination = dest;
        this.applyEffect(effectParams);

        return true;
    };

    applyGaussianBlur(params): bool
    {
        var source = params.source;
        var blur = params.blurTarget;
        var dest = params.destination;
        if (!source || !dest || !blur ||
            !blur.colorTexture0 ||
            blur === dest ||
            source === blur.colorTexture0)
        {
            return false;
        }

        var effectParams = this.effectParams;
        var techparams = this.gaussianBlurParameters;
        effectParams.technique = this.gaussianBlurTechnique;
        effectParams.params = techparams;

        var sampleRadius = (params.blurRadius || 5);
        techparams['sampleRadius'][0] = sampleRadius / source.width;
        techparams['sampleRadius'][1] = 0;
        techparams['inputTexture0'] = source;
        effectParams['destination'] = blur;
        this.applyEffect(effectParams);

        techparams['sampleRadius'][0] = 0;
        techparams['sampleRadius'][1] = sampleRadius / source.height;
        techparams['inputTexture0'] = blur.colorTexture0;
        effectParams['destination'] = dest;
        this.applyEffect(effectParams);

        return true;
    };

    applyColorMatrix(params): bool
    {
        var source = params.source;
        var dest = params.destination;
        if (!source || !dest ||
            !dest.colorTexture0 ||
            source === dest.colorTexture0)
        {
            return false;
        }

        var effectParams = this.effectParams;
        var techparams = this.colorMatrixParameters;
        effectParams.technique = this.colorMatrixTechnique;
        effectParams.params = techparams;

        var matrix = params.colorMatrix;
        // TODO: cache 'colorMatrix' here
        techparams['colorMatrix'][0] = matrix[0];
        techparams['colorMatrix'][1] = matrix[3];
        techparams['colorMatrix'][2] = matrix[6];
        techparams['colorMatrix'][3] = matrix[9];
        techparams['colorMatrix'][4] = matrix[1];
        techparams['colorMatrix'][5] = matrix[4];
        techparams['colorMatrix'][6] = matrix[7];
        techparams['colorMatrix'][7] = matrix[10];
        techparams['colorMatrix'][8] = matrix[2];
        techparams['colorMatrix'][9] = matrix[5];
        techparams['colorMatrix'][10] = matrix[8];
        techparams['colorMatrix'][11] = matrix[11];

        techparams['inputTexture0'] = source;
        effectParams.destination = dest;
        this.applyEffect(effectParams);

        return true;
    };

    applyDistort(params): bool
    {
        var source = params.source;
        var dest = params.destination;
        var distort = params.distortion;
        if (!source || !dest || !distort ||
            !dest.colorTexture0 ||
            source === dest.colorTexture0 || distort === dest.colorTexture0)
        {
            return false;
        }

        // input transform.
        //  a b tx
        //  c d ty
        var a, b, c, d, tx, ty;

        var transform = params.transform;
        if (transform)
        {
            // transform col-major.
            a = transform[0];
            b = transform[2];
            tx = transform[4];
            c = transform[1];
            d = transform[3];
            ty = transform[5];
        }
        else
        {
            a = d = 1;
            b = c = 0;
            tx = ty = 0;
        }

        var effectParams = this.effectParams;
        var techparams = this.distortParameters;
        effectParams.technique = this.distortTechnique;
        effectParams.params = techparams;

        // TODO: Cache 'transform', 'invTransform', etc in the code below

        techparams['transform'][0] = a;
        techparams['transform'][1] = b;
        techparams['transform'][2] = tx;
        techparams['transform'][3] = c;
        techparams['transform'][4] = d;
        techparams['transform'][5] = ty;

        // Compute inverse transform to use in distort texture displacement..
        var idet = 1 / (a * d - b * c);
        var ia = techparams['invTransform'][0] = (idet * d);
        var ib = techparams['invTransform'][1] = (idet * -b);
        var ic = techparams['invTransform'][2] = (idet * -c);
        var id = techparams['invTransform'][3] = (idet * a);

        // Compute max pixel offset after transform for normalisation.
        var x1 = ((ia + ib) * (ia + ib)) + ((ic + id) * (ic + id));
        var x2 = ((ia - ib) * (ia - ib)) + ((ic - id) * (ic - id));
        var x3 = ((-ia + ib) * (-ia + ib)) + ((-ic + id) * (-ic + id));
        var x4 = ((-ia - ib) * (-ia - ib)) + ((-ic - id) * (-ic - id));
        var xmax = 0.5 * Math.sqrt(Math.max(x1, x2, x3, x4));

        var strength = (params.strength || 10);
        techparams['strength'][0] = strength / (source.width * xmax);
        techparams['strength'][1] = strength / (source.height * xmax);

        techparams['inputTexture0'] = source;
        techparams['distortTexture'] = distort;
        effectParams.destination = dest;
        this.applyEffect(effectParams);

        return true;
    };

    applyEffect(effect)
    {
        var graphicsDevice = this.graphicsDevice;

        var dest = effect.destination;
        if (graphicsDevice.beginRenderTarget(dest))
        {
            graphicsDevice.setTechnique(effect.technique);
            graphicsDevice.setTechniqueParameters(effect.params);

            graphicsDevice.setStream(this.staticVertexBuffer, this.quadSemantics);
            graphicsDevice.draw(this.quadPrimitive, 4);

            graphicsDevice.endRenderTarget();
        }
    };

    destroy()
    {
        this.staticVertexBuffer.destroy();

        delete this.graphicsDevice;
        delete this.mathDevice;
    };

    static create(params) : TextureEffects
    {
        var e = new TextureEffects();

        var gd = params.graphicsDevice;
        var md = params.mathDevice;

        e.graphicsDevice = gd;
        e.mathDevice = md;

        e.staticVertexBufferParams = {
            numVertices : 4,
            attributes : ['FLOAT2', 'FLOAT2'],
            dynamic : false,
            data : [-1, -1, 0, 0,
                    1, -1, 1, 0,
                    -1,  1, 0, 1,
                    1,  1, 1, 1]
        };

        e.staticVertexBuffer = gd.createVertexBuffer(e.staticVertexBufferParams);

        e.effectParams = {
            technique : null,
            params : null,
            destination : null
        };

        e.quadSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0']);
        e.quadPrimitive = gd.PRIMITIVE_TRIANGLE_STRIP;

        // Distort effect.
        // ---------------

        e.distortParameters = gd.createTechniqueParameters({
            inputTexture0 : null,
            distortTexture : null,
            strength : [0, 0],
            transform : [0, 0, 0, 0, 0, 0],
            invTransform : [0, 0, 0, 0]
        });

        // Color matrix effect.
        // --------------------

        e.colorMatrixParameters = gd.createTechniqueParameters({
            inputTexture0 : null,
            colorMatrix : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        });

        // Bloom effect.
        // ------------

        e.bloomThresholdParameters = gd.createTechniqueParameters({
            inputTexture0 : null,
            bloomThreshold : 0,
            thresholdCuttoff : 0
        });

        e.bloomMergeParameters = gd.createTechniqueParameters({
            inputTexture0 : null,
            inputTexture1 : null,
            bloomIntensity : 0,
            bloomSaturation : 0,
            originalIntensity : 0,
            originalSaturation : 0
        });

        // Gaussian Blur effect.
        // ---------------------

        // (also used by bloom)
        e.gaussianBlurParameters = gd.createTechniqueParameters({
            inputTexture0 : null,
            sampleRadius : [1, 1]
        });

        // Shader embedding.
        // -----------------

        var shader = gd.createShader(
            {
                "version": 1,
                "name": "textureeffects.cgfx",
                "samplers":
                {
                    "inputTexture0":
                    {
                        "MinFilter": 9729,
                        "MagFilter": 9729,
                        "WrapS": 33071,
                        "WrapT": 33071
                    },
                    "inputTexture1":
                    {
                        "MinFilter": 9729,
                        "MagFilter": 9729,
                        "WrapS": 33071,
                        "WrapT": 33071
                    },
                    "inputTexture2":
                    {
                        "MinFilter": 9729,
                        "MagFilter": 9729,
                        "WrapS": 33071,
                        "WrapT": 33071
                    },
                    "distortTexture":
                    {
                        "MinFilter": 9729,
                        "MagFilter": 9729,
                        "WrapS": 10497,
                        "WrapT": 10497
                    }
                },
                "parameters":
                {
                    "strength":
                    {
                        "type": "float",
                        "columns": 2
                    },
                    "transform":
                    {
                        "type": "float",
                        "rows": 2,
                        "columns": 3
                    },
                    "invTransform":
                    {
                        "type": "float",
                        "rows": 2,
                        "columns": 2
                    },
                    "colorMatrix":
                    {
                        "type": "float",
                        "rows": 3,
                        "columns": 4
                    },
                    "sampleRadius":
                    {
                        "type": "float",
                        "columns": 2
                    },
                    "bloomThreshold":
                    {
                        "type": "float"
                    },
                    "thresholdCutoff":
                    {
                        "type": "float"
                    },
                    "bloomSaturation":
                    {
                        "type": "float"
                    },
                    "originalSaturation":
                    {
                        "type": "float"
                    },
                    "bloomIntensity":
                    {
                        "type": "float"
                    },
                    "originalIntensity":
                    {
                        "type": "float"
                    },
                    "inputTexture0":
                    {
                        "type": "sampler2D"
                    },
                    "inputTexture1":
                    {
                        "type": "sampler2D"
                    },
                    "inputTexture2":
                    {
                        "type": "sampler2D"
                    },
                    "distortTexture":
                    {
                        "type": "sampler2D"
                    },
                    "Gauss":
                    {
                        "type": "float",
                        "rows": 9,
                        "values": [0.93,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1]
                    }
                },
                "techniques":
                {
                    "distort":
                    [
                        {
                            "parameters": ["strength","transform","invTransform","inputTexture0","distortTexture"],
                            "semantics": ["POSITION","TEXCOORD0"],
                            "states":
                            {
                                "DepthTestEnable": false,
                                "DepthMask": false,
                                "CullFaceEnable": false,
                                "BlendEnable": false
                            },
                            "programs": ["vp_copy","fp_distort"]
                        }
                    ],
                    "copyColorMatrix":
                    [
                        {
                            "parameters": ["colorMatrix","inputTexture0"],
                            "semantics": ["POSITION","TEXCOORD0"],
                            "states":
                            {
                                "DepthTestEnable": false,
                                "DepthMask": false,
                                "CullFaceEnable": false,
                                "BlendEnable": false
                            },
                            "programs": ["vp_copy","fp_colorMatrix"]
                        }
                    ],
                    "bloomThreshold":
                    [
                        {
                            "parameters": ["bloomThreshold","thresholdCutoff","inputTexture0"],
                            "semantics": ["POSITION","TEXCOORD0"],
                            "states":
                            {
                                "DepthTestEnable": false,
                                "DepthMask": false,
                                "CullFaceEnable": false,
                                "BlendEnable": false
                            },
                            "programs": ["vp_copy","fp_bloom_threshold"]
                        }
                    ],
                    "bloomMerge":
                    [
                        {
                            "parameters": ["bloomSaturation","originalSaturation","bloomIntensity","originalIntensity","inputTexture0","inputTexture1"],
                            "semantics": ["POSITION","TEXCOORD0"],
                            "states":
                            {
                                "DepthTestEnable": false,
                                "DepthMask": false,
                                "CullFaceEnable": false,
                                "BlendEnable": false
                            },
                            "programs": ["vp_copy","fp_bloom_merge"]
                        }
                    ],
                    "gaussianBlur":
                    [
                        {
                            "parameters": ["sampleRadius","inputTexture0","Gauss"],
                            "semantics": ["POSITION","TEXCOORD0"],
                            "states":
                            {
                                "DepthTestEnable": false,
                                "DepthMask": false,
                                "CullFaceEnable": false,
                                "BlendEnable": false
                            },
                            "programs": ["vp_copy","fp_gaussian_blur"]
                        }
                    ]
                },
                "programs":
                {
                    "fp_gaussian_blur":
                    {
                        "type": "fragment",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nvec4 _ret_0;vec4 _TMP2;vec4 _TMP1;vec2 _c0022;vec2 _c0024;uniform vec2 sampleRadius;uniform sampler2D inputTexture0;uniform float Gauss[9];void main()\n{vec2 _step;vec4 _color;vec2 _dir;_step=sampleRadius/9.0;_color=texture2D(inputTexture0,tz_TexCoord[0].xy);_c0022=tz_TexCoord[0].xy+_step;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[0];_c0024=tz_TexCoord[0].xy-_step;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[0];_dir=_step+_step;_c0022=tz_TexCoord[0].xy+_dir;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[1];_c0024=tz_TexCoord[0].xy-_dir;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[1];_dir=_dir+_step;_c0022=tz_TexCoord[0].xy+_dir;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[2];_c0024=tz_TexCoord[0].xy-_dir;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[2];_dir=_dir+_step;_c0022=tz_TexCoord[0].xy+_dir;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[3];_c0024=tz_TexCoord[0].xy-_dir;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[3];_dir=_dir+_step;_c0022=tz_TexCoord[0].xy+_dir;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[4];_c0024=tz_TexCoord[0].xy-_dir;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[4];_dir=_dir+_step;_c0022=tz_TexCoord[0].xy+_dir;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[5];_c0024=tz_TexCoord[0].xy-_dir;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[5];_dir=_dir+_step;_c0022=tz_TexCoord[0].xy+_dir;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[6];_c0024=tz_TexCoord[0].xy-_dir;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[6];_dir=_dir+_step;_c0022=tz_TexCoord[0].xy+_dir;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[7];_c0024=tz_TexCoord[0].xy-_dir;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[7];_dir=_dir+_step;_c0022=tz_TexCoord[0].xy+_dir;_TMP1=texture2D(inputTexture0,_c0022);_color=_color+_TMP1*Gauss[8];_c0024=tz_TexCoord[0].xy-_dir;_TMP2=texture2D(inputTexture0,_c0024);_color=_color+_TMP2*Gauss[8];_ret_0=_color*9.94035751E-02;gl_FragColor=_ret_0;}"
                    },
                    "vp_copy":
                    {
                        "type": "vertex",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];attribute vec4 ATTR8;attribute vec4 ATTR0;\nvec4 _OutPosition1;vec2 _OutUV1;void main()\n{_OutPosition1=ATTR0;_OutUV1=ATTR8.xy;tz_TexCoord[0].xy=ATTR8.xy;gl_Position=ATTR0;}"
                    },
                    "fp_bloom_merge":
                    {
                        "type": "fragment",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nvec4 _ret_0;vec4 _TMP3;vec4 _TMP5;float _TMP2;vec4 _TMP1;float _TMP0;vec4 _TMP36;uniform float bloomSaturation;uniform float originalSaturation;uniform float bloomIntensity;uniform float originalIntensity;uniform sampler2D inputTexture0;uniform sampler2D inputTexture1;void main()\n{vec4 _orig;vec4 _bloom;_orig=texture2D(inputTexture0,tz_TexCoord[0].xy);_bloom=texture2D(inputTexture1,tz_TexCoord[0].xy);_TMP0=dot(_bloom.xyz,vec3(2.12599993E-01,7.15200007E-01,7.22000003E-02));_TMP1=vec4(_TMP0,_TMP0,_TMP0,_TMP0)+bloomSaturation*(_bloom-vec4(_TMP0,_TMP0,_TMP0,_TMP0));_bloom=_TMP1*bloomIntensity;_TMP2=dot(_orig.xyz,vec3(2.12599993E-01,7.15200007E-01,7.22000003E-02));_TMP3=vec4(_TMP2,_TMP2,_TMP2,_TMP2)+originalSaturation*(_orig-vec4(_TMP2,_TMP2,_TMP2,_TMP2));_TMP5=min(vec4(1.0,1.0,1.0,1.0),_bloom);_TMP36=max(vec4(0.0,0.0,0.0,0.0),_TMP5);_orig=(_TMP3*(1.0-_TMP36))*originalIntensity;_ret_0=_bloom+_orig;gl_FragColor=_ret_0;}"
                    },
                    "fp_bloom_threshold":
                    {
                        "type": "fragment",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nvec4 _ret_0;float _TMP1;float _TMP0;float _a0025;float _x0027;uniform float bloomThreshold;uniform float thresholdCutoff;uniform sampler2D inputTexture0;void main()\n{vec4 _col;float _luminance;float _x;float _cut;_col=texture2D(inputTexture0,tz_TexCoord[0].xy);_luminance=dot(_col.xyz,vec3(2.12599993E-01,7.15200007E-01,7.22000003E-02));_x=float((_luminance>=bloomThreshold));_a0025=3.14159274*(_luminance/bloomThreshold-0.5);_TMP0=sin(_a0025);_x0027=0.5*(1.0+_TMP0);_TMP1=pow(_x0027,thresholdCutoff);_cut=bloomThreshold*_TMP1;_ret_0=(_x+(1.0-_x)*_cut)*_col;gl_FragColor=_ret_0;}"
                    },
                    "fp_colorMatrix":
                    {
                        "type": "fragment",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nvec3 _r0019;uniform vec4 colorMatrix[3];uniform sampler2D inputTexture0;void main()\n{vec4 _color;vec4 _mutc;_color=texture2D(inputTexture0,tz_TexCoord[0].xy);_mutc=_color;_mutc.w=1.0;_r0019.x=dot(colorMatrix[0],_mutc);_r0019.y=dot(colorMatrix[1],_mutc);_r0019.z=dot(colorMatrix[2],_mutc);_mutc.xyz=_r0019;_mutc.w=_color.w;gl_FragColor=_mutc;}"
                    },
                    "fp_distort":
                    {
                        "type": "fragment",
                        "code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[8];\nvec4 _ret_0;vec2 _UV1;vec4 _TMP1;vec2 _r0020;vec2 _r0028;vec2 _v0028;uniform vec2 strength;uniform vec3 transform[2];uniform vec2 invTransform[2];uniform sampler2D inputTexture0;uniform sampler2D distortTexture;void main()\n{vec3 _uvt;_uvt=vec3(tz_TexCoord[0].x,tz_TexCoord[0].y,1.0);_r0020.x=dot(transform[0],_uvt);_r0020.y=dot(transform[1],_uvt);_TMP1=texture2D(distortTexture,_r0020);_v0028=_TMP1.xy-0.5;_r0028.x=dot(invTransform[0],_v0028);_r0028.y=dot(invTransform[1],_v0028);_UV1=tz_TexCoord[0].xy+_r0028*strength;_ret_0=texture2D(inputTexture0,_UV1);gl_FragColor=_ret_0;}"
                    }
                }
            }
        );

        e.distortTechnique = shader.getTechnique("distort");
        e.colorMatrixTechnique = shader.getTechnique("copyColorMatrix");
        e.bloomThresholdTechnique = shader.getTechnique("bloomThreshold");
        e.bloomMergeTechnique = shader.getTechnique("bloomMerge");
        e.gaussianBlurTechnique = shader.getTechnique("gaussianBlur");

        return e;
    };
};
