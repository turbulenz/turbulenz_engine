// Copyright (c) 2013 Turbulenz Limited

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

    additiveMatrix(additiveRGB, dst)
    {
        if (dst === undefined) {
            dst = this.mathDevice.m43BuildIdentity();
        }

        dst[0] = dst[4] = dst[8] = 1;
        dst[1] = dst[2] = dst[3] = dst[5] = dst[6] = dst[7] = 0;
        dst[9] = additiveRGB[0];
        dst[10] = additiveRGB[1];
        dst[11] = additiveRGB[2];

        return dst;
    }

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
    }

    applyBloom(params): boolean
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
    }

    applyGaussianBlur(params): boolean
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
    }

    applyColorMatrix(params): boolean
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
    }

    applyDistort(params): boolean
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
    }

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
    }

    destroy()
    {
        this.staticVertexBuffer.destroy();

        delete this.graphicsDevice;
        delete this.mathDevice;
    }

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

        // Generated from assets/shaders/textureeffects.cgfx
        var shader = gd.createShader(textureeffects_cgfx);

        e.distortTechnique = shader.getTechnique("distort");
        e.colorMatrixTechnique = shader.getTechnique("copyColorMatrix");
        e.bloomThresholdTechnique = shader.getTechnique("bloomThreshold");
        e.bloomMergeTechnique = shader.getTechnique("bloomMerge");
        e.gaussianBlurTechnique = shader.getTechnique("gaussianBlur");

        return e;
    }
}
