// Copyright (c) 2013-2014 Turbulenz Limited

//
// CascadedShadowMapping
//
/*global renderingCommonCreateRendererInfoFn: false, Camera: false*/

class CascadedShadowSplit
{
    viewportX: number;
    viewportY: number;

    camera: Camera;

    origin: any; // v3
    at: any; // v3
    viewWindowX: number;
    viewWindowY: number;

    minLightDistance: number;
    maxLightDistance: number;
    minLightDistanceX: number;
    maxLightDistanceX: number;
    minLightDistanceY: number;
    maxLightDistanceY: number;

    lightViewWindowX: number;
    lightViewWindowY: number;
    lightDepth: number;

    shadowDepthScale: number;
    shadowDepthOffset: number;

    staticNodesChangeCounter: number;
    numStaticOverlappingRenderables: number;
    numOverlappingRenderables: number;
    needsRedraw: boolean;
    needsBlur: boolean;

    overlappingRenderables: Renderable[];
    overlappingExtents: Float32Array[]; // AABB
    occludersDrawArray: DrawParameters[];

    worldShadowProjection: any; // m34
    viewShadowProjection: any; // m34
    shadowScaleOffset: any; // v4

    constructor(md, x, y)
    {
        this.viewportX = x;
        this.viewportY = y;

        /* tslint:disable:no-duplicate-variable */
        var camera = Camera.create(md);
        camera.parallel = true;
        camera.aspectRatio = 1;
        camera.viewOffsetX = 0;
        camera.viewOffsetY = 0;
        this.camera = camera;
        /* tslint:enable:no-duplicate-variable */

        this.origin = md.v3BuildZero();
        this.at = md.v3BuildZero();
        this.viewWindowX = 0;
        this.viewWindowY = 0;

        this.minLightDistance = 0;
        this.maxLightDistance = 0;
        this.minLightDistanceX = 0;
        this.maxLightDistanceX = 0;
        this.minLightDistanceY = 0;
        this.maxLightDistanceY = 0;

        this.lightViewWindowX = 0;
        this.lightViewWindowY = 0;
        this.lightDepth = 0;

        this.shadowDepthScale = 0;
        this.shadowDepthOffset = 0;

        this.staticNodesChangeCounter = -1;
        this.numOverlappingRenderables = -1;
        this.numStaticOverlappingRenderables = -1;
        this.needsRedraw = false;
        this.needsBlur = false;

        this.overlappingRenderables = [];
        this.overlappingExtents = [];
        this.occludersDrawArray = [];

        this.worldShadowProjection = md.m34BuildIdentity();
        this.viewShadowProjection = md.m34BuildIdentity();
        this.shadowScaleOffset = md.v4BuildZero();

        return this;
    }

    setAsDummy()
    {
        var m = this.worldShadowProjection;
        m[0] = 0.0;
        m[1] = 0.0;
        m[2] = 0.0;
        m[3] = 1.0;
        m[4] = 0.0;
        m[5] = 0.0;
        m[6] = 0.0;
        m[7] = 1.0;
        m[8] = 0.0;
        m[9] = 0.0;
        m[10] = 0.0;
        m[11] = 1.0;

        m = this.viewShadowProjection;
        m[0] = 0.0;
        m[1] = 0.0;
        m[2] = 0.0;
        m[3] = 1.0;
        m[4] = 0.0;
        m[5] = 0.0;
        m[6] = 0.0;
        m[7] = 1.0;
        m[8] = 0.0;
        m[9] = 0.0;
        m[10] = 0.0;
        m[11] = 1.0;

        var v = this.shadowScaleOffset;
        v[0] = 0.0;
        v[1] = 0.0;
        v[2] = 0.0;
        v[3] = 0.0;
    }
};


class CascadedShadowMapping
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    static splitDistances = [1.0 / 100.0, 4.0 / 100.0, 20.0 / 100.0, 1.0];

    gd                  : GraphicsDevice;
    md                  : MathDevice;
    clearColor          : any; // v4
    tempMatrix44        : any; // m44
    tempMatrix43        : any; // m43
    tempMatrix33        : any; // m33
    tempV3Direction     : any; // v3
    tempV3Right         : any; // v3
    tempV3Up            : any; // v3
    tempV3At            : any; // v3
    tempV3Origin        : any; // v3
    tempV3AxisX         : any; // v3
    tempV3AxisY         : any; // v3
    tempV3AxisZ         : any; // v3
    tempV3Cross1        : any; // v3
    tempV3Cross2        : any; // v3
    tempV3Cross3        : any; // v3
    tempV3Int           : any; // v3

    techniqueParameters : TechniqueParameters;

    quadPrimitive       : number;
    quadSemantics       : Semantics;
    quadVertexBuffer    : VertexBuffer;

    uvScaleOffset       : any; // v4
    pixelOffsetH        : number[];
    pixelOffsetV        : number[];

    bufferWidth         : number;
    bufferHeight        : number;

    globalTechniqueParameters : TechniqueParameters;
    globalTechniqueParametersArray : TechniqueParameters[];
    shader              : Shader;
    splits              : CascadedShadowSplit[];
    dummySplit          : CascadedShadowSplit;

    size                : number;
    numSplitsToRedraw   : number;

    texture             : Texture;
    renderTarget        : RenderTarget;
    blurTexture         : Texture;
    depthBuffer         : RenderBuffer;
    blurRenderTarget    : RenderTarget;

    sideCamera          : Camera;
    sideCameraNearPlane : any; // v4

    numMainFrustumSidePlanes: number;
    numMainFrustumPlanes: number;
    mainFrustumNearPlaneIndex: number;
    mainFrustumPlanes   : any[];
    numSplitFrustumPlanes: number;
    splitFrustumPlanes  : any[];
    intersectingPlanes  : any[];
    frustumPoints       : any[];
    clampedFrustumPoints: any[];
    visibleNodes        : SceneNode[];
    numOccludees        : number;
    occludeesExtents    : Float32Array[];
    occludersExtents    : Float32Array[];

    shadowMappingShader : Shader;
    rigidTechnique      : Technique;
    skinnedTechnique    : Technique;
    blurTechnique       : Technique;

    blurEnabled         : boolean;


    // Render update calbacks
    update: () => void;
    skinnedUpdate: () => void;


    constructor(gd: GraphicsDevice, md: MathDevice, shaderManager: ShaderManager, size: number, blurDisabled: boolean)
    {
        shaderManager.load("shaders/cascadedshadows.cgfx");

        this.gd = gd;
        this.md = md;
        this.clearColor = md.v4Build(1, 1, 1, 0);
        this.tempMatrix44 = md.m44BuildIdentity();
        this.tempMatrix43 = md.m43BuildIdentity();
        this.tempMatrix33 = md.m33BuildIdentity();
        this.tempV3Direction = md.v3BuildZero();
        this.tempV3Right = md.v3BuildZero();
        this.tempV3Up = md.v3BuildZero();
        this.tempV3At = md.v3BuildZero();
        this.tempV3Origin = md.v3BuildZero();
        this.tempV3AxisX = md.v3BuildZero();
        this.tempV3AxisY = md.v3BuildZero();
        this.tempV3AxisZ = md.v3BuildZero();
        this.tempV3Cross1 = md.v3BuildZero();
        this.tempV3Cross2 = md.v3BuildZero();
        this.tempV3Cross3 = md.v3BuildZero();
        this.tempV3Int = md.v3BuildZero();

        this.techniqueParameters = gd.createTechniqueParameters({
            shadowSize: 0.0,
            invShadowSize: 0.0,
            shadowMapTexture: null,
            worldShadowProjection0: null,
            viewShadowProjection0: null,
            shadowScaleOffset0: null,
            worldShadowProjection1: null,
            viewShadowProjection1: null,
            shadowScaleOffset1: null,
            worldShadowProjection2: null,
            viewShadowProjection2: null,
            shadowScaleOffset2: null,
            worldShadowProjection3: null,
            viewShadowProjection3: null,
            shadowScaleOffset3: null
        });

        this.quadPrimitive = gd.PRIMITIVE_TRIANGLE_STRIP;
        this.quadSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0']);

        this.quadVertexBuffer = gd.createVertexBuffer({
            numVertices: 4,
            attributes: ['FLOAT2', 'FLOAT2'],
            dynamic: false,
            data: [
               -1.0,  1.0, 0.0, 1.0,
                1.0,  1.0, 1.0, 1.0,
               -1.0, -1.0, 0.0, 0.0,
                1.0, -1.0, 1.0, 0.0
            ]
        });

        this.uvScaleOffset = md.v4BuildZero();
        this.pixelOffsetH = [0, 0];
        this.pixelOffsetV = [0, 0];

        this.bufferWidth = 0;
        this.bufferHeight = 0;

        this.globalTechniqueParameters = gd.createTechniqueParameters();
        this.globalTechniqueParametersArray = [this.globalTechniqueParameters];
        this.shader = null;

        /* tslint:disable:no-bitwise */
        var splitSize = (size >>> 1);
        /* tslint:enable:no-bitwise */
        this.splits = [new CascadedShadowSplit(md, 0, 0),
                       new CascadedShadowSplit(md, splitSize, 0),
                       new CascadedShadowSplit(md, 0, splitSize),
                       new CascadedShadowSplit(md, splitSize, splitSize)];

        this.dummySplit = new CascadedShadowSplit(md, 0, 0);
        this.dummySplit.setAsDummy();

        this.numSplitsToRedraw = 0;

        var precision = gd.maxSupported("FRAGMENT_SHADER_PRECISION");
        if (blurDisabled ||
            (precision && // Just in case the query is not supported
             precision < 16))
        {
            this.blurEnabled = false;
        }
        else
        {
            this.blurEnabled = true;
        }

        this.updateBuffers(size);

        var camera = Camera.create(md);
        camera.parallel = true;
        camera.aspectRatio = 1;
        camera.viewOffsetX = 0;
        camera.viewOffsetY = 0;
        this.sideCamera = camera;
        this.sideCameraNearPlane = md.v4BuildZero();

        this.numMainFrustumSidePlanes = 0;
        this.numMainFrustumPlanes = 0;
        this.mainFrustumNearPlaneIndex = -1;
        this.mainFrustumPlanes = [
            new Float32Array(4),
            new Float32Array(4),
            new Float32Array(4),
            new Float32Array(4),
            new Float32Array(4),
            new Float32Array(4),
            new Float32Array(4)
        ];
        this.numSplitFrustumPlanes = 0;
        this.splitFrustumPlanes = [];
        this.intersectingPlanes = [];
        this.frustumPoints = [];
        this.clampedFrustumPoints = [];
        this.visibleNodes = [];
        this.numOccludees = 0;
        this.occludeesExtents = [];
        this.occludersExtents = [];

        /* tslint:disable:no-string-literal */
        this.update = function _cascadedShadowsUpdateFn(): void
        {
            var node = this.node;
            while (!node.local &&
                    node.parent)
            {
                node = node.parent;
            }
            this.shadowTechniqueParameters['world'] = node.world;
        };

        this.skinnedUpdate = function _cascadedShadowsSkinnedUpdateFn(): void
        {
            var shadowTechniqueParameters = this.shadowTechniqueParameters;
            shadowTechniqueParameters['world'] = this.node.world;

            var skinController = this.skinController;
            if (skinController)
            {
                shadowTechniqueParameters['skinBones'] = skinController.output;
                skinController.update();
            }
        };
        /* tslint:enable:no-string-literal */

        return this;
    }

    // Methods

    updateShader(sm: ShaderManager): void
    {
        var shader = sm.get("shaders/cascadedshadows.cgfx");
        if (shader !== this.shadowMappingShader)
        {
            this.shader = shader;
            this.rigidTechnique = shader.getTechnique("rigid");
            this.skinnedTechnique = shader.getTechnique("skinned");
            this.blurTechnique = shader.getTechnique("blur");
        }
    }

    destroyBuffers(): void
    {
        if (this.renderTarget)
        {
            this.renderTarget.destroy();
            this.renderTarget = null;
        }

        if (this.texture)
        {
            this.texture.destroy();
            this.texture = null;
        }

        if (this.blurRenderTarget)
        {
            this.blurRenderTarget.destroy();
            this.blurRenderTarget = null;
        }
        if (this.blurTexture)
        {
            this.blurTexture.destroy();
            this.blurTexture = null;
        }
        if (this.depthBuffer)
        {
            this.depthBuffer.destroy();
            this.depthBuffer = null;
        }
    }

    updateBuffers(size: number): boolean
    {
        if (this.size === size)
        {
            return true;
        }

        if (!size)
        {
            size = this.size;
        }

        /* tslint:disable:no-bitwise */
        var splitSize = (size >>> 1);
        /* tslint:enable:no-bitwise */

        var gd = this.gd;

        this.destroyBuffers();

        this.depthBuffer = gd.createRenderBuffer({
                width: size,
                height: size,
                format: "D24S8"
            });

        if (this.blurEnabled)
        {
            this.blurTexture = gd.createTexture({
                    width: splitSize,
                    height: splitSize,
                    format: "R8G8B8A8",
                    mipmaps: false,
                    renderable: true
                });
        }

        if (this.depthBuffer &&
            (!this.blurEnabled || this.blurTexture))
        {
            if (this.blurEnabled)
            {
                this.blurRenderTarget = gd.createRenderTarget({
                        colorTexture0: this.blurTexture
                    });
            }

            if (!this.blurEnabled || this.blurRenderTarget)
            {
                this.texture = gd.createTexture({
                    width: size,
                    height: size,
                    format: "R8G8B8A8",
                    mipmaps: false,
                    renderable: true
                });
                if (this.texture)
                {
                    this.renderTarget = gd.createRenderTarget({
                        colorTexture0: this.texture,
                        depthBuffer: this.depthBuffer
                    });
                    if (this.renderTarget)
                    {
                        var techniqueParameters = this.techniqueParameters;
                        /* tslint:disable:no-string-literal */
                        techniqueParameters['shadowSize'] = size;
                        techniqueParameters['invShadowSize'] = (1.0 / size);
                        techniqueParameters['shadowMapTexture'] = this.texture;
                        /* tslint:enable:no-string-literal */

                        this.size = size;
                        return true;
                    }
                }
            }
        }

        this.size = 0;
        this.destroyBuffers();
        return false;
    }

    private _addPoint(p: any, points: any[], numPoints: number): number
    {
        // Only add point if not already present, there are few points so complexity is not an issue
        var n;
        for (n = 0; n < numPoints; n += 1)
        {
            var op = points[n];
            if (p[0] === op[0] &&
                p[1] === op[1] &&
                p[2] === op[2])
            {
                return numPoints;
            }
        }
        points[numPoints] = this.md.v3Copy(p, points[numPoints]);
        return (numPoints + 1);
    }

    private _intersect(s: any, e: any, plane: any, points: any[], numPoints: number): number
    {
        var sd = ((s[0] * plane[0]) + (s[1] * plane[1]) + (s[2] * plane[2]) - plane[3]);
        if (sd >= 0)
        {
            numPoints = this._addPoint(s, points, numPoints);
        }
        var ed = ((e[0] * plane[0]) + (e[1] * plane[1]) + (e[2] * plane[2]) - plane[3]);
        if (ed >= 0)
        {
            numPoints = this._addPoint(e, points, numPoints);
        }
        if ((sd * ed) < 0)
        {
            var d0 = (e[0] - s[0]);
            var d1 = (e[1] - s[1]);
            var d2 = (e[2] - s[2]);
            var dp = -sd / ((d0 * plane[0]) + (d1 * plane[1]) + (d2 * plane[2]));
            d0 *= dp;
            d1 *= dp;
            d2 *= dp;
            points[numPoints] = this.md.v3Build((s[0] + d0), (s[1] + d1), (s[2] + d2), points[numPoints]);
            numPoints += 1;
        }
        return numPoints;
    }

    private _clampFrustumPoints(frustumPoints: any[], floorPlane: any): number
    {
        var clampedFrustumPoints = this.clampedFrustumPoints;
        var numPoints = 0;
        numPoints = this._intersect(frustumPoints[0], frustumPoints[4], floorPlane, clampedFrustumPoints, numPoints);
        numPoints = this._intersect(frustumPoints[1], frustumPoints[5], floorPlane, clampedFrustumPoints, numPoints);
        numPoints = this._intersect(frustumPoints[2], frustumPoints[6], floorPlane, clampedFrustumPoints, numPoints);
        numPoints = this._intersect(frustumPoints[3], frustumPoints[7], floorPlane, clampedFrustumPoints, numPoints);
        numPoints = this._intersect(frustumPoints[4], frustumPoints[5], floorPlane, clampedFrustumPoints, numPoints);
        numPoints = this._intersect(frustumPoints[5], frustumPoints[6], floorPlane, clampedFrustumPoints, numPoints);
        numPoints = this._intersect(frustumPoints[6], frustumPoints[7], floorPlane, clampedFrustumPoints, numPoints);
        numPoints = this._intersect(frustumPoints[7], frustumPoints[4], floorPlane, clampedFrustumPoints, numPoints);
        return numPoints;
    }

    updateShadowMap(lightDirection: any, camera: Camera, scene: Scene, maxDistance: number, floorPlane: any): void
    {
        var md = this.md;

        this._extractMainFrustumPlanes(camera, lightDirection, maxDistance, floorPlane);

        var cameraMatrix = camera.matrix;
        var cameraRight = md.m43Right(cameraMatrix, this.tempV3Right);
        var cameraUp = md.m43Up(cameraMatrix, this.tempV3Up);
        var cameraAt = md.m43At(cameraMatrix, this.tempV3At);

        var direction = md.v3Normalize(lightDirection, this.tempV3Direction);

        var frustumPoints = this.frustumPoints;
        frustumPoints = camera.getFrustumPoints(maxDistance, camera.nearPlane, frustumPoints);

        var numClampedFrustumPoints = this._clampFrustumPoints(frustumPoints, floorPlane);

        var sideCamera = this._updateSideCamera(cameraRight,
                                                cameraUp,
                                                cameraAt,
                                                direction,
                                                this.clampedFrustumPoints,
                                                numClampedFrustumPoints);
        var sideCameraMaxDistance = sideCamera.farPlane;

        var up;
        if (Math.abs(md.v3Dot(direction, cameraAt)) < Math.abs(md.v3Dot(direction, cameraUp)))
        {
            up = cameraAt;
        }
        else
        {
            up = cameraUp;
        }
        md.v3Normalize(up, up);

        var zaxis = md.v3Neg(direction, this.tempV3AxisZ);
        var xaxis = md.v3Cross(up, zaxis, this.tempV3AxisX);
        md.v3Normalize(xaxis, xaxis);
        var yaxis = md.v3Cross(zaxis, xaxis, this.tempV3AxisY);

        var splitDistances = CascadedShadowMapping.splitDistances;
        var splits = this.splits;
        var numSplits = splits.length;
        var splitStart = -sideCamera.nearPlane;
        var previousSplitPoints = [];
        var n, split, splitEnd;
        for (n = 0; n < numSplits; n += 1)
        {
            split = splits[n];

            splitEnd = sideCameraMaxDistance * splitDistances[n];

            frustumPoints = this._getSideCameraFrustumPoints(splitEnd,
                                                             splitStart,
                                                             camera,
                                                             maxDistance,
                                                             floorPlane);

            this._updateSplit(split,
                              xaxis,
                              yaxis,
                              zaxis,
                              cameraMatrix,
                              frustumPoints,
                              previousSplitPoints,
                              scene,
                              maxDistance);

            splitStart = splitEnd;

            if (0 === split.occludersDrawArray.length &&
                (n + 1) < numSplits)
            {
                splitEnd = (splitEnd + (sideCameraMaxDistance * splitDistances[n + 1])) / 2.0;

                frustumPoints = this._getSideCameraFrustumPoints(splitEnd,
                                                                 splitStart,
                                                                 camera,
                                                                 maxDistance,
                                                                 floorPlane);

                this._updateSplit(split,
                                  xaxis,
                                  yaxis,
                                  zaxis,
                                  cameraMatrix,
                                  frustumPoints,
                                  previousSplitPoints,
                                  scene,
                                  maxDistance);

                splitStart = splitEnd;
            }
        }

        var techniqueParameters = this.techniqueParameters;
        n = -1;

        do
        {
            n += 1;
            if (n >= numSplits)
            {
                split = this.dummySplit;
                break;
            }
            split = splits[n];
        }
        while (0 === split.occludersDrawArray.length);

        /* tslint:disable:no-string-literal */
        techniqueParameters['worldShadowProjection0'] = split.worldShadowProjection;
        techniqueParameters['viewShadowProjection0'] = split.viewShadowProjection;
        techniqueParameters['shadowScaleOffset0'] = split.shadowScaleOffset;
        /* tslint:enable:no-string-literal */

        do
        {
            n += 1;
            if (n >= numSplits)
            {
                split = this.dummySplit;
                break;
            }
            split = splits[n];
        }
        while (0 === split.occludersDrawArray.length);

        /* tslint:disable:no-string-literal */
        techniqueParameters['worldShadowProjection1'] = split.worldShadowProjection;
        techniqueParameters['viewShadowProjection1'] = split.viewShadowProjection;
        techniqueParameters['shadowScaleOffset1'] = split.shadowScaleOffset;
        /* tslint:enable:no-string-literal */

        do
        {
            n += 1;
            if (n >= numSplits)
            {
                split = this.dummySplit;
                break;
            }
            split = splits[n];
        }
        while (0 === split.occludersDrawArray.length);

        /* tslint:disable:no-string-literal */
        techniqueParameters['worldShadowProjection2'] = split.worldShadowProjection;
        techniqueParameters['viewShadowProjection2'] = split.viewShadowProjection;
        techniqueParameters['shadowScaleOffset2'] = split.shadowScaleOffset;
        /* tslint:enable:no-string-literal */

        do
        {
            n += 1;
            if (n >= numSplits)
            {
                split = this.dummySplit;
                break;
            }
            split = splits[n];
        }
        while (0 === split.occludersDrawArray.length);

        /* tslint:disable:no-string-literal */
        techniqueParameters['worldShadowProjection3'] = split.worldShadowProjection;
        techniqueParameters['viewShadowProjection3'] = split.viewShadowProjection;
        techniqueParameters['shadowScaleOffset3'] = split.shadowScaleOffset;
        /* tslint:enable:no-string-literal */
    }

    private _planeNormalize(a, b, c, d, dst)
    {
        var res = dst;
        if (!res)
        {
            res = new Float32Array(4);
        }

        var lsq = ((a * a) + (b * b) + (c * c));
        if (lsq > 0.0)
        {
            var lr = 1.0 / Math.sqrt(lsq);
            res[0] = (a * lr);
            res[1] = (b * lr);
            res[2] = (c * lr);
            res[3] = (d * lr);
        }
        else
        {
            res[0] = 0;
            res[1] = 0;
            res[2] = 0;
            res[3] = 0;
        }

        return res;
    }

    private _extractMainFrustumPlanes(camera: Camera, lightDirection: any, maxDistance: number, floorPlane: any): void
    {
        // This is crap...
        var oldFarPlane = camera.farPlane;
        camera.farPlane = maxDistance;
        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();

        var planeNormalize = this._planeNormalize;
        var m = camera.viewProjectionMatrix;
        var m0  = m[0];
        var m1  = m[1];
        var m2  = m[2];
        var m3  = m[3];
        var m4  = m[4];
        var m5  = m[5];
        var m6  = m[6];
        var m7  = m[7];
        var m8  = m[8];
        var m9  = m[9];
        var m10 = m[10];
        var m11 = m[11];
        var m12 = m[12];
        var m13 = m[13];
        var m14 = m[14];
        var m15 = m[15];
        var planes = this.mainFrustumPlanes;
        var numPlanes = 0;
        var p;

        var d0 = lightDirection[0];
        var d1 = lightDirection[1];
        var d2 = lightDirection[2];

        // Negate 'd' here to avoid doing it on the isVisible functions
        p = planeNormalize((m3 + m0), (m7 + m4), (m11 + m8), -(m15 + m12), planes[numPlanes]); // left
        if ((d0 * p[0]) + (d1 * p[1]) + (d2 * p[2]) <= 0)
        {
            planes[numPlanes] = p;
            numPlanes += 1;
        }

        p = planeNormalize((m3 - m0), (m7 - m4), (m11 - m8), -(m15 - m12), planes[numPlanes]); // right
        if ((d0 * p[0]) + (d1 * p[1]) + (d2 * p[2]) <= 0)
        {
            planes[numPlanes] = p;
            numPlanes += 1;
        }

        p = planeNormalize((m3 - m1), (m7 - m5), (m11 - m9), -(m15 - m13), planes[numPlanes]); // top
        if ((d0 * p[0]) + (d1 * p[1]) + (d2 * p[2]) <= 0)
        {
            planes[numPlanes] = p;
            numPlanes += 1;
        }

        p = planeNormalize((m3 + m1), (m7 + m5), (m11 + m9), -(m15 + m13), planes[numPlanes]); // bottom
        if ((d0 * p[0]) + (d1 * p[1]) + (d2 * p[2]) <= 0)
        {
            planes[numPlanes] = p;
            numPlanes += 1;
        }

        this.numMainFrustumSidePlanes = numPlanes;

        p = planeNormalize((m3 + m2), (m7 + m6), (m11 + m10), -(m15 + m14), planes[numPlanes]);  // near
        if ((d0 * p[0]) + (d1 * p[1]) + (d2 * p[2]) <= 0)
        {
            this.mainFrustumNearPlaneIndex = numPlanes;
            planes[numPlanes] = p;
            numPlanes += 1;
        }
        else
        {
            this.mainFrustumNearPlaneIndex = -1;
        }

        p = planeNormalize((m3 - m2), (m7 - m6), (m11 - m10), -(m15 - m14), planes[numPlanes]); // far
        if ((d0 * p[0]) + (d1 * p[1]) + (d2 * p[2]) <= 0)
        {
            planes[numPlanes] = p;
            numPlanes += 1;
        }

        p = planeNormalize(floorPlane[0], floorPlane[1], floorPlane[2], floorPlane[3], planes[numPlanes]); // floor
        if ((d0 * p[0]) + (d1 * p[1]) + (d2 * p[2]) <= 0)
        {
            planes[numPlanes] = p;
            numPlanes += 1;
        }
        this.numMainFrustumPlanes = numPlanes;

        camera.farPlane = oldFarPlane;
        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();
    }

    private _extractSplitFrustumPlanes(camera: Camera) : any[]
    {
        var planeNormalize = this._planeNormalize;
        var m = camera.viewProjectionMatrix;
        var m0 = m[0];
        var m1 = m[1];
        //var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];
        //var m6 = m[6];
        var m7 = m[7];
        var m8 = m[8];
        var m9 = m[9];
        //var m10 = m[10];
        var m11 = m[11];
        var m12 = m[12];
        var m13 = m[13];
        //var m14 = m[14];
        var m15 = m[15];
        var planes = this.splitFrustumPlanes;

        // Negate 'd' here to avoid doing it on the isVisible functions
        planes[0] = planeNormalize((m3 + m0), (m7 + m4), (m11 + m8), -(m15 + m12), planes[0]); // left
        planes[1] = planeNormalize((m3 - m0), (m7 - m4), (m11 - m8), -(m15 - m12), planes[1]); // right
        planes[2] = planeNormalize((m3 - m1), (m7 - m5), (m11 - m9), -(m15 - m13), planes[2]); // top
        planes[3] = planeNormalize((m3 + m1), (m7 + m5), (m11 + m9), -(m15 + m13), planes[3]); // bottom

        var numMainFrustumPlanes = this.numMainFrustumPlanes;
        var mainFrustumPlanes = this.mainFrustumPlanes;
        var n;
        for (n = 0; n < numMainFrustumPlanes; n += 1)
        {
            planes[4 + n] = mainFrustumPlanes[n];
        }

        this.numSplitFrustumPlanes = 4 + numMainFrustumPlanes;

        planes.length = this.numSplitFrustumPlanes;

        return planes;
    }

    private _isInsidePlanesAABB(extents: any,
                                planes: any[],
                                numPlanes: number,
                                overlappingExtents: Float32Array[],
                                numOverlappingRenderables: number): boolean
    {
        var abs = Math.abs;
        var n0 = extents[0];
        var n1 = extents[1];
        var n2 = extents[2];
        var p0 = extents[3];
        var p1 = extents[4];
        var p2 = extents[5];

        var n = 0;
        do
        {
            var plane = planes[n];
            var d0 = plane[0];
            var d1 = plane[1];
            var d2 = plane[2];
            var maxDistance = (d0 * (d0 < 0 ? n0 : p0) + d1 * (d1 < 0 ? n1 : p1) + d2 * (d2 < 0 ? n2 : p2) - plane[3]);
            if (maxDistance < 0.001)
            {
                return false;
            }
            else
            {
                // Clamp extents to the part that is inside the plane
                if (maxDistance < abs(d0) * (p0 - n0))
                {
                    if (d0 < 0)
                    {
                        p0 = n0 - (maxDistance / d0);
                    }
                    else
                    {
                        n0 = p0 - (maxDistance / d0);
                    }
                }
                if (maxDistance < abs(d1) * (p1 - n1))
                {
                    if (d1 < 0)
                    {
                        p1 = n1 - (maxDistance / d1);
                    }
                    else
                    {
                        n1 = p1 - (maxDistance / d1);
                    }
                }
                if (maxDistance < abs(d2) * (p2 - n2))
                {
                    if (d2 < 0)
                    {
                        p2 = n2 - (maxDistance / d2);
                    }
                    else
                    {
                        n2 = p2 - (maxDistance / d2);
                    }
                }
            }

            n += 1;
        }
        while (n < numPlanes);

        var res = overlappingExtents[numOverlappingRenderables];
        if (!res)
        {
            res = new Float32Array(6);
            overlappingExtents[numOverlappingRenderables] = res;
        }
        res[0] = n0;
        res[1] = n1;
        res[2] = n2;
        res[3] = p0;
        res[4] = p1;
        res[5] = p2;

        return true;
    }

    private _filterFullyInsidePlanes(extents: any, planes: any[], intersectingPlanes: any[]): number
    {
        var n0 = extents[0];
        var n1 = extents[1];
        var n2 = extents[2];
        var p0 = extents[3];
        var p1 = extents[4];
        var p2 = extents[5];
        var numPlanes = planes.length;
        var numIntersectingPlanes = 0;
        var n = 0;
        do
        {
            var plane = planes[n];
            var d0 = plane[0];
            var d1 = plane[1];
            var d2 = plane[2];
            if ((d0 * (d0 > 0 ? n0 : p0) + d1 * (d1 > 0 ? n1 : p1) + d2 * (d2 > 0 ? n2 : p2)) < plane[3])
            {
                intersectingPlanes[numIntersectingPlanes] = plane;
                numIntersectingPlanes += 1;
            }
            n += 1;
        }
        while (n < numPlanes);
        return numIntersectingPlanes;
    }

    private _v3Cross(a, b, dst)
    {
        var a0 = a[0];
        var a1 = a[1];
        var a2 = a[2];
        var b0 = b[0];
        var b1 = b[1];
        var b2 = b[2];
        dst[0] = ((a1 * b2) - (a2 * b1));
        dst[1] = ((a2 * b0) - (a0 * b2));
        dst[2] = ((a0 * b1) - (a1 * b0));
        return dst;
    }

    private _findPlanesIntersection(plane1, plane2, plane3, dst)
    {
        var md = this.md;

        var det = md.m33Determinant(md.m33Build(plane1, plane2, plane3, this.tempMatrix33));
        if (det === 0.0)
        {
            return null;
        }

        var invDet = 1.0 / det;

        var _v3Cross = this._v3Cross;
        var c23 = _v3Cross(plane2, plane3, this.tempV3Cross1);
        var c31 = _v3Cross(plane3, plane1, this.tempV3Cross2);
        var c12 = _v3Cross(plane1, plane2, this.tempV3Cross3);

        return md.v3Add3(md.v3ScalarMul(c23, (plane1[3] * invDet), c23),
                         md.v3ScalarMul(c31, (plane2[3] * invDet), c31),
                         md.v3ScalarMul(c12, (plane3[3] * invDet), c12),
                         dst);
    }

    private _findMaxWindowZ(zaxis: any, planes: any[], currentMaxDistance: number): number
    {
        var maxWindowZ = currentMaxDistance;

        var a0 = -zaxis[0];
        var a1 = -zaxis[1];
        var a2 = -zaxis[2];

        // First 4 planes are assumed to be the split ones
        // Calculate intersections between then and the main camera ones
        var numMainFrustumSidePlanes = this.numMainFrustumSidePlanes;
        var mainFrustumNearPlaneIndex = this.mainFrustumNearPlaneIndex;
        var tempP = this.tempV3Int;
        var p, n, plane, dz;

        // left, top
        for (n = 0; n < numMainFrustumSidePlanes; n += 1)
        {
            p = this._findPlanesIntersection(planes[0], planes[2], planes[4 + n], tempP);
            if (p)
            {
                if (mainFrustumNearPlaneIndex !== -1)
                {
                    plane = planes[4 + mainFrustumNearPlaneIndex];
                    if (((plane[0] * p[0]) + (plane[1] * p[1]) + (plane[2] * p[2])) < plane[3])
                    {
                        continue;
                    }
                }

                dz = ((a0 * p[0]) + (a1 * p[1]) + (a2 * p[2]));
                if (maxWindowZ < dz)
                {
                    maxWindowZ = dz;
                }
            }
        }

        // left, bottom
        for (n = 0; n < numMainFrustumSidePlanes; n += 1)
        {
            p = this._findPlanesIntersection(planes[0], planes[3], planes[4 + n], tempP);
            if (p)
            {
                if (mainFrustumNearPlaneIndex !== -1)
                {
                    plane = planes[4 + mainFrustumNearPlaneIndex];
                    if (((plane[0] * p[0]) + (plane[1] * p[1]) + (plane[2] * p[2])) < plane[3])
                    {
                        continue;
                    }
                }

                dz = ((a0 * p[0]) + (a1 * p[1]) + (a2 * p[2]));
                if (maxWindowZ < dz)
                {
                    maxWindowZ = dz;
                }
            }
        }

        // right, top
        for (n = 0; n < numMainFrustumSidePlanes; n += 1)
        {
            p = this._findPlanesIntersection(planes[1], planes[2], planes[4 + n], tempP);
            if (p)
            {
                if (mainFrustumNearPlaneIndex !== -1)
                {
                    plane = planes[4 + mainFrustumNearPlaneIndex];
                    if (((plane[0] * p[0]) + (plane[1] * p[1]) + (plane[2] * p[2])) < plane[3])
                    {
                        continue;
                    }
                }

                dz = ((a0 * p[0]) + (a1 * p[1]) + (a2 * p[2]));
                if (maxWindowZ < dz)
                {
                    maxWindowZ = dz;
                }
            }
        }

        // right, bottom
        for (n = 0; n < numMainFrustumSidePlanes; n += 1)
        {
            p = this._findPlanesIntersection(planes[1], planes[3], planes[4 + n], tempP);
            if (p)
            {
                if (mainFrustumNearPlaneIndex !== -1)
                {
                    plane = planes[4 + mainFrustumNearPlaneIndex];
                    if (((plane[0] * p[0]) + (plane[1] * p[1]) + (plane[2] * p[2])) < plane[3])
                    {
                        continue;
                    }
                }

                dz = ((a0 * p[0]) + (a1 * p[1]) + (a2 * p[2]));
                if (maxWindowZ < dz)
                {
                    maxWindowZ = dz;
                }
            }
        }

        return maxWindowZ;
    }

    private _updateSideCamera(cameraRight: any,
                              cameraUp: any,
                              cameraAt: any,
                              lightDirection: any,
                              frustumPoints: any[],
                              numFrustumPoints: number): Camera
    {
        var md = this.md;

        var yaxis;
        if (Math.abs(md.v3Dot(lightDirection, cameraAt)) <
                Math.max(Math.abs(md.v3Dot(lightDirection, cameraRight)),
                         Math.abs(md.v3Dot(lightDirection, cameraUp))))
        {
            yaxis = md.v3Neg(lightDirection, this.tempV3AxisY);
        }
        else
        {
            yaxis = cameraUp;
        }
        var xaxis = md.v3Cross(yaxis, cameraAt, this.tempV3AxisX);
        md.v3Normalize(xaxis, xaxis);
        //var yaxis = md.v3Cross(cameraAt, xaxis);
        //var zaxis = md.v3Cross(yaxis, xaxis);
        var zaxis = md.v3Cross(xaxis, yaxis, this.tempV3AxisZ);

        var r0 = -xaxis[0];
        var r1 = -xaxis[1];
        var r2 = -xaxis[2];

        var u0 = -yaxis[0];
        var u1 = -yaxis[1];
        var u2 = -yaxis[2];

        var a0 = -zaxis[0];
        var a1 = -zaxis[1];
        var a2 = -zaxis[2];

        var minWindowX = Number.MAX_VALUE;
        var maxWindowX = -Number.MAX_VALUE;
        var minWindowY = Number.MAX_VALUE;
        var maxWindowY = -Number.MAX_VALUE;
        var minWindowZ = Number.MAX_VALUE;
        var maxWindowZ = -Number.MAX_VALUE;
        var n, p, dx, dy, dz;
        for (n = 0; n < numFrustumPoints; n += 1)
        {
            p = frustumPoints[n];
            dx = ((r0 * p[0]) + (r1 * p[1]) + (r2 * p[2]));
            dy = ((u0 * p[0]) + (u1 * p[1]) + (u2 * p[2]));
            dz = ((a0 * p[0]) + (a1 * p[1]) + (a2 * p[2]));
            if (minWindowX > dx)
            {
                minWindowX = dx;
            }
            if (maxWindowX < dx)
            {
                maxWindowX = dx;
            }
            if (minWindowY > dy)
            {
                minWindowY = dy;
            }
            if (maxWindowY < dy)
            {
                maxWindowY = dy;
            }
            if (minWindowZ > dz)
            {
                minWindowZ = dz;
            }
            if (maxWindowZ < dz)
            {
                maxWindowZ = dz;
            }
        }

        // Calculate origin
        var origin = this.tempV3Origin;
        var ox = (minWindowX + maxWindowX) / 2.0;
        var oy = (minWindowY + maxWindowY) / 2.0;
        var oz = minWindowZ;
        origin[0] = ox * r0 + oy * u0 + oz * a0;
        origin[1] = ox * r1 + oy * u1 + oz * a1;
        origin[2] = ox * r2 + oy * u2 + oz * a2;

        var lightViewWindowX = (maxWindowX - minWindowX) / 2.0;
        var lightViewWindowY = (maxWindowY - minWindowY) / 2.0;
        var lightDepth = (maxWindowZ - minWindowZ);

        // Prepare camera to get light frustum planes
        var camera = this.sideCamera;
        camera.matrix = md.m43Build(xaxis, yaxis, zaxis, origin, camera.matrix);
        camera.updateViewMatrix();

        var distanceScale = (1.0 / (256 * 256 * 256));
        camera.nearPlane = (lightDepth * distanceScale);
        camera.farPlane  = (lightDepth + distanceScale);
        camera.recipViewWindowX = 1.0 / lightViewWindowX;
        camera.recipViewWindowY = 1.0 / lightViewWindowY;

        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();

        var m = this.sideCamera.viewProjectionMatrix;
        var nearPlane = this.sideCameraNearPlane;
        this._planeNormalize((m[3]  + m[2]), (m[7]  + m[6]), (m[11] + m[10]), -(m[15] + m[14]), nearPlane);

        return camera;
    }

    private _getSideCameraFrustumPoints(endDistance: number,
                                        startDistance: number,
                                        mainCamera: Camera,
                                        maxDistance: number,
                                        floorPlane: any): any[]
    {
        var frustumPoints = this.frustumPoints;
        var nearPlane = this.sideCameraNearPlane;
        var nearDistance = nearPlane[3];

        var planes = mainCamera.frustumPlanes;

        nearPlane[3] = nearDistance + startDistance;
        this._findPlanesIntersection(planes[0], planes[2], nearPlane, frustumPoints[0]);
        this._findPlanesIntersection(planes[0], planes[3], nearPlane, frustumPoints[1]);
        this._findPlanesIntersection(planes[1], planes[2], nearPlane, frustumPoints[2]);
        this._findPlanesIntersection(planes[1], planes[3], nearPlane, frustumPoints[3]);

        nearPlane[3] = nearDistance + endDistance;
        this._findPlanesIntersection(planes[0], planes[2], nearPlane, frustumPoints[4]);
        this._findPlanesIntersection(planes[0], planes[3], nearPlane, frustumPoints[5]);
        this._findPlanesIntersection(planes[1], planes[2], nearPlane, frustumPoints[6]);
        this._findPlanesIntersection(planes[1], planes[3], nearPlane, frustumPoints[7]);

        nearPlane[3] = nearDistance;

        var mainCameraMatrix = mainCamera.matrix;
        var ax = -mainCameraMatrix[6];
        var ay = -mainCameraMatrix[7];
        var az = -mainCameraMatrix[8];
        var sx = mainCameraMatrix[9];
        var sy = mainCameraMatrix[10];
        var sz = mainCameraMatrix[11];
        var n;
        for (n = 0; n < 8; n += 1)
        {
            var p = frustumPoints[n];
            var dx = (p[0] - sx);
            var dy = (p[1] - sy);
            var dz = (p[2] - sz);
            var d = ((ax * dx) + (ay * dy) + (az * dz));
            if (d > maxDistance)
            {
                // "d" includes "Math.sqrt((dx * dx) + (dy * dy) + (dz * dz))" and the cosine of the angle
                var a = (maxDistance / d);
                dx *= a;
                dy *= a;
                dz *= a;
                p[0] = sx + dx;
                p[1] = sy + dy;
                p[2] = sz + dz;
            }
            d = ((p[0] * floorPlane[0]) + (p[1] * floorPlane[1]) + (p[2] * floorPlane[2]) - floorPlane[3]);
            if (d < 0)
            {
                var dp = -d / ((dx * floorPlane[0]) + (dy * floorPlane[1]) + (dz * floorPlane[2]));
                p[0] += dx * dp;
                p[1] += dy * dp;
                p[2] += dz * dp;
            }
        }

        return frustumPoints;
    }

    private _updateSplit(split: CascadedShadowSplit,
                         xaxis: any,
                         yaxis: any,
                         zaxis: any,
                         mainCameraMatrix: any,
                         frustumPoints: any[],
                         previousSplitPoints: any[],
                         scene: Scene,
                         maxDistance: number): void
    {
        var md = this.md;

        // Calculate split window limits
        var r0 = -xaxis[0];
        var r1 = -xaxis[1];
        var r2 = -xaxis[2];

        var u0 = -yaxis[0];
        var u1 = -yaxis[1];
        var u2 = -yaxis[2];

        var a0 = -zaxis[0];
        var a1 = -zaxis[1];
        var a2 = -zaxis[2];

        var minWindowX = Number.MAX_VALUE;
        var maxWindowX = -Number.MAX_VALUE;
        var minWindowY = Number.MAX_VALUE;
        var maxWindowY = -Number.MAX_VALUE;
        var minWindowZ = Number.MAX_VALUE;
        var maxWindowZ = -Number.MAX_VALUE;
        var n, p, dx, dy, dz;
        for (n = 0; n < 8; n += 1)
        {
            p = frustumPoints[n];
            dx = ((r0 * p[0]) + (r1 * p[1]) + (r2 * p[2]));
            dy = ((u0 * p[0]) + (u1 * p[1]) + (u2 * p[2]));
            dz = ((a0 * p[0]) + (a1 * p[1]) + (a2 * p[2]));
            if (minWindowX > dx)
            {
                minWindowX = Math.floor(dx);
            }
            if (maxWindowX < dx)
            {
                maxWindowX = Math.ceil(dx);
            }
            if (minWindowY > dy)
            {
                minWindowY = Math.floor(dy);
            }
            if (maxWindowY < dy)
            {
                maxWindowY = Math.ceil(dy);
            }
            if (minWindowZ > dz)
            {
                minWindowZ = Math.floor(dz);
            }
            if (maxWindowZ < dz)
            {
                maxWindowZ = Math.ceil(dz);
            }
        }

        var sceneExtents = scene.extents;
        var minSceneWindowZ = ((a0 * (a0 > 0 ? sceneExtents[0] : sceneExtents[3])) +
                               (a1 * (a1 > 0 ? sceneExtents[1] : sceneExtents[4])) +
                               (a2 * (a2 > 0 ? sceneExtents[2] : sceneExtents[5])));
        if (minWindowZ > minSceneWindowZ)
        {
            minWindowZ = Math.floor(minSceneWindowZ);
        }

        if (0 === this.numMainFrustumSidePlanes)
        {
            // Camera almost parallel to the split (worst case)
            maxWindowZ = Math.ceil(maxWindowZ + maxDistance);
        }

        // Calculate origin of split
        var origin = this.tempV3Origin;
        var ox = (minWindowX + maxWindowX) / 2.0;
        var oy = (minWindowY + maxWindowY) / 2.0;
        var oz = minWindowZ;
        origin[0] = ox * r0 + oy * u0 + oz * a0;
        origin[1] = ox * r1 + oy * u1 + oz * a1;
        origin[2] = ox * r2 + oy * u2 + oz * a2;
        if (a0 < 0)
        {
            origin[0] = Math.ceil(origin[0]);
        }
        else if (a0 > 0)
        {
            origin[0] = Math.floor(origin[0]);
        }
        else //if (a0 === 0)
        {
            origin[0] = Math.round(origin[0]);
        }

        if (a1 < 0)
        {
            origin[1] = Math.ceil(origin[1]);
        }
        else if (a1 > 0)
        {
            origin[1] = Math.floor(origin[1]);
        }
        else //if (a1 === 0)
        {
            origin[1] = Math.round(origin[1]);
        }

        if (a2 < 0)
        {
            origin[2] = Math.ceil(origin[2]);
        }
        else if (a2 > 0)
        {
            origin[2] = Math.floor(origin[2]);
        }
        else //if (a2 === 0)
        {
            origin[2] = Math.round(origin[2]);
        }

        var lightViewWindowX = (maxWindowX - minWindowX) / 2.0;
        var lightViewWindowY = (maxWindowY - minWindowY) / 2.0;
        var lightDepth = (maxWindowZ - minWindowZ);

        // Prepare camera to get split frustum planes
        var camera = split.camera;
        camera.matrix = md.m43Build(xaxis, yaxis, zaxis, origin, camera.matrix);
        camera.updateViewMatrix();
        var viewMatrix = camera.viewMatrix;

        split.lightViewWindowX = lightViewWindowX;
        split.lightViewWindowY = lightViewWindowY;
        split.lightDepth = lightDepth;

        var distanceScale = (1.0 / (256 * 256 * 256));
        camera.nearPlane = (lightDepth * distanceScale);
        camera.farPlane  = (lightDepth + distanceScale);
        camera.recipViewWindowX = 1.0 / lightViewWindowX;
        camera.recipViewWindowY = 1.0 / lightViewWindowY;

        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();

        var frustumPlanes = this._extractSplitFrustumPlanes(camera);

        if (0 < this.numMainFrustumSidePlanes)
        {
            maxWindowZ = this._findMaxWindowZ(zaxis, frustumPlanes, maxWindowZ);
            split.lightDepth = lightDepth = (maxWindowZ - minWindowZ);
            camera.farPlane  = (lightDepth + distanceScale);
        }

        var frustumUpdated = this._updateRenderables(split,
                                                     zaxis,
                                                     origin,
                                                     frustumPlanes,
                                                     scene);

        // Now prepare draw array
        var overlappingRenderables = split.overlappingRenderables;
        var overlappingExtents = split.overlappingExtents;
        var occludersDrawArray = split.occludersDrawArray;
        var numOverlappingRenderables = split.numOverlappingRenderables;
        var numStaticOverlappingRenderables = split.numStaticOverlappingRenderables;

        if (frustumUpdated ||
            numStaticOverlappingRenderables !== numOverlappingRenderables)
        {
            if (!split.needsRedraw)
            {
                split.needsRedraw = true;
                this.numSplitsToRedraw += 1;
            }

            var occludeesExtents = this.occludeesExtents;
            var occludersExtents = this.occludersExtents;

            var numOccluders = this._filterOccluders(overlappingRenderables,
                                                     overlappingExtents,
                                                     numOverlappingRenderables,
                                                     occludersDrawArray,
                                                     occludeesExtents,
                                                     occludersExtents,
                                                     (scene.frameIndex - 1));

            numOccluders = this._updateOccludersLimits(split,
                                                       viewMatrix,
                                                       occludersDrawArray,
                                                       occludersExtents,
                                                       numOccluders);

            occludersDrawArray.length = numOccluders;

            if (0 < numOccluders)
            {
                this._updateOccludeesLimits(split,
                                            viewMatrix,
                                            occludeesExtents);

                if (1 < numOccluders)
                {
                    occludersDrawArray.sort(this._sortNegative);
                }

                split.needsBlur = true;
            }
        }
        else
        {
            split.needsRedraw = false;
        }

        // Prepare rendering data
        var shadowMapSize = this.size;

        // Need padding to avoid culling near objects
        var minLightDistance = (split.minLightDistance - distanceScale);

        // Need padding to avoid encoding singularity at far plane
        var maxLightDistance = (split.maxLightDistance + distanceScale);

        var minLightDistanceX = split.minLightDistanceX;
        var maxLightDistanceX = split.maxLightDistanceX;
        var minLightDistanceY = split.minLightDistanceY;
        var maxLightDistanceY = split.maxLightDistanceY;

        var numPreviousSplitPoints = previousSplitPoints.length;
        if (numPreviousSplitPoints && occludersDrawArray.length)
        {
            // Calculate previous split window compared to current one
            var roffset = viewMatrix[9];
            var uoffset = viewMatrix[10];
            var previousMinWindowX = Number.MAX_VALUE;
            var previousMaxWindowX = -Number.MAX_VALUE;
            var previousMinWindowY = Number.MAX_VALUE;
            var previousMaxWindowY = -Number.MAX_VALUE;
            for (n = 0; n < numPreviousSplitPoints; n += 1)
            {
                p = previousSplitPoints[n];
                dx = ((r0 * p[0]) + (r1 * p[1]) + (r2 * p[2]) - roffset);
                dy = ((u0 * p[0]) + (u1 * p[1]) + (u2 * p[2]) - uoffset);
                if (previousMinWindowX > dx)
                {
                    previousMinWindowX = dx;
                }
                if (previousMaxWindowX < dx)
                {
                    previousMaxWindowX = dx;
                }
                if (previousMinWindowY > dy)
                {
                    previousMinWindowY = dy;
                }
                if (previousMaxWindowY < dy)
                {
                    previousMaxWindowY = dy;
                }
            }

            if (maxLightDistanceX >= previousMaxWindowX)
            {
                if (minLightDistanceX >= previousMinWindowX)
                {
                    if (previousMinWindowY <= minLightDistanceY && maxLightDistanceY <= previousMaxWindowY)
                    {
                        minLightDistanceX = Math.max(minLightDistanceX, previousMaxWindowX);
                    }
                }
            }
            else
            {
                if (previousMinWindowY <= minLightDistanceY && maxLightDistanceY <= previousMaxWindowY)
                {
                    maxLightDistanceX = Math.min(maxLightDistanceX, previousMinWindowX);
                }
            }

            if (maxLightDistanceY >= previousMaxWindowY)
            {
                if (minLightDistanceY >= previousMinWindowY)
                {
                    if (previousMinWindowX <= minLightDistanceX && maxLightDistanceX <= previousMaxWindowX)
                    {
                        minLightDistanceY = Math.max(minLightDistanceY, previousMaxWindowY);
                    }
                }
            }
            else
            {
                if (previousMinWindowX <= minLightDistanceX && maxLightDistanceX <= previousMaxWindowX)
                {
                    maxLightDistanceY = Math.min(maxLightDistanceY, previousMinWindowY);
                }
            }

            if (minLightDistanceX >= maxLightDistanceX ||
                minLightDistanceY >= maxLightDistanceY)
            {
                occludersDrawArray.length = 0;
            }
        }

        if (minLightDistanceX < -lightViewWindowX)
        {
            minLightDistanceX = -lightViewWindowX;
        }
        if (maxLightDistanceX > lightViewWindowX)
        {
            maxLightDistanceX = lightViewWindowX;
        }
        if (minLightDistanceY < -lightViewWindowY)
        {
            minLightDistanceY = -lightViewWindowY;
        }
        if (maxLightDistanceY > lightViewWindowY)
        {
            maxLightDistanceY = lightViewWindowY;
        }

        var minimalViewWindowX, minimalViewWindowY;
        if (maxLightDistanceX !== -minLightDistanceX ||
            maxLightDistanceY !== -minLightDistanceY)
        {
            // we can adjust the origin
            var dX = (minLightDistanceX + maxLightDistanceX) / 2.0;
            var dY = (minLightDistanceY + maxLightDistanceY) / 2.0;

            origin[0] -= ((xaxis[0] * dX) + (yaxis[0] * dY));
            origin[1] -= ((xaxis[1] * dX) + (yaxis[1] * dY));
            origin[2] -= ((xaxis[2] * dX) + (yaxis[2] * dY));

            camera.matrix = md.m43Build(xaxis, yaxis, zaxis, origin, camera.matrix);
            camera.updateViewMatrix();

            minimalViewWindowX = (maxLightDistanceX - minLightDistanceX) / 2.0;
            minimalViewWindowY = (maxLightDistanceY - minLightDistanceY) / 2.0;
        }
        else
        {
            minimalViewWindowX = Math.max(Math.abs(maxLightDistanceX), Math.abs(minLightDistanceX));
            minimalViewWindowY = Math.max(Math.abs(maxLightDistanceY), Math.abs(minLightDistanceY));
        }

        var borderPadding = ((this.blurEnabled ? 2.0 : 1.0) / shadowMapSize);

        minimalViewWindowX += borderPadding * minimalViewWindowX;
        if (lightViewWindowX > minimalViewWindowX)
        {
            lightViewWindowX = minimalViewWindowX;
        }

        minimalViewWindowY += borderPadding * minimalViewWindowY;
        if (lightViewWindowY > minimalViewWindowY)
        {
            lightViewWindowY = minimalViewWindowY;
        }

        if (lightViewWindowX === 0 ||
            lightViewWindowY === 0)
        {
            lightViewWindowX = 0.001;
            lightViewWindowY = 0.001;
        }

        camera.recipViewWindowX = 1.0 / lightViewWindowX;
        camera.recipViewWindowY = 1.0 / lightViewWindowY;

        if (minLightDistance > camera.nearPlane)
        {
            camera.nearPlane = minLightDistance;
        }
        if (camera.farPlane > maxLightDistance)
        {
            camera.farPlane = maxLightDistance;
        }

        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();
        var shadowProjection = camera.viewProjectionMatrix;

        var shadowDepthScale = split.shadowDepthScale;
        var shadowDepthOffset = (shadowDepthScale ? split.shadowDepthOffset : 1.0);

        var worldShadowProjection = split.worldShadowProjection;
        worldShadowProjection[0] = shadowProjection[0];
        worldShadowProjection[1] = shadowProjection[4];
        worldShadowProjection[2] = shadowProjection[8];
        worldShadowProjection[3] = shadowProjection[12];
        worldShadowProjection[4] = shadowProjection[1];
        worldShadowProjection[5] = shadowProjection[5];
        worldShadowProjection[6] = shadowProjection[9];
        worldShadowProjection[7] = shadowProjection[13];
        worldShadowProjection[8] = shadowProjection[2] * shadowDepthScale;
        worldShadowProjection[9] = shadowProjection[6] * shadowDepthScale;
        worldShadowProjection[10] = shadowProjection[10] * shadowDepthScale;
        worldShadowProjection[11] = (shadowProjection[14] * shadowDepthScale) + shadowDepthOffset;

        var viewToShadowProjection = md.m43MulM44(mainCameraMatrix, shadowProjection, this.tempMatrix44);

        var viewShadowProjection = split.viewShadowProjection;
        viewShadowProjection[0] = viewToShadowProjection[0];
        viewShadowProjection[1] = viewToShadowProjection[4];
        viewShadowProjection[2] = viewToShadowProjection[8];
        viewShadowProjection[3] = viewToShadowProjection[12];
        viewShadowProjection[4] = viewToShadowProjection[1];
        viewShadowProjection[5] = viewToShadowProjection[5];
        viewShadowProjection[6] = viewToShadowProjection[9];
        viewShadowProjection[7] = viewToShadowProjection[13];
        viewShadowProjection[8] = viewToShadowProjection[2] * shadowDepthScale;
        viewShadowProjection[9] = viewToShadowProjection[6] * shadowDepthScale;
        viewShadowProjection[10] = viewToShadowProjection[10] * shadowDepthScale;
        viewShadowProjection[11] = (viewToShadowProjection[14] * shadowDepthScale) + shadowDepthOffset;

        var invSize = (1.0 / this.size);
        var shadowScaleOffset = split.shadowScaleOffset;
        shadowScaleOffset[1] = shadowScaleOffset[0] = 0.25;
        shadowScaleOffset[2] = (split.viewportX * invSize) + 0.25;
        shadowScaleOffset[3] = (split.viewportY * invSize) + 0.25;

        if (occludersDrawArray.length)
        {
            frustumPoints = split.camera.getFrustumFarPoints(split.camera.farPlane, frustumPoints);
            for (n = 0; n < 4; n += 1)
            {
                previousSplitPoints.push(frustumPoints[n]);
            }
        }
    }

    private _updateRenderables(split: CascadedShadowSplit,
                               zaxis: any,
                               origin: any,
                               frustumPlanes: any[],
                               scene: Scene): boolean
    {
        var _filterFullyInsidePlanes = this._filterFullyInsidePlanes;
        var _isInsidePlanesAABB = this._isInsidePlanesAABB;
        var visibleNodes = this.visibleNodes;

        var intersectingPlanes = this.intersectingPlanes;
        var numIntersectingPlanes;

        var previousOrigin = split.origin;
        var previousAt = split.at;

        var overlappingRenderables = split.overlappingRenderables;
        var overlappingExtents = split.overlappingExtents;

        var staticNodesChangeCounter = scene.staticNodesChangeCounter;

        var numOverlappingRenderables, numVisibleNodes;
        var node, renderables, numRenderables, renderable;
        var i, n, extents, extentsCopy;

        var frustumUpdated = false;
        if (previousAt[0] !== zaxis[0] ||
            previousAt[1] !== zaxis[1] ||
            previousAt[2] !== zaxis[2] ||
            previousOrigin[0] !== origin[0] ||
            previousOrigin[1] !== origin[1] ||
            previousOrigin[2] !== origin[2] ||
            split.viewWindowX !== split.lightViewWindowX ||
            split.viewWindowY !== split.lightViewWindowY ||
            split.staticNodesChangeCounter !== staticNodesChangeCounter)
        {
            previousAt[0] = zaxis[0];
            previousAt[1] = zaxis[1];
            previousAt[2] = zaxis[2];

            previousOrigin[0] = origin[0];
            previousOrigin[1] = origin[1];
            previousOrigin[2] = origin[2];

            split.viewWindowX = split.lightViewWindowX;
            split.viewWindowY = split.lightViewWindowY;
            split.staticNodesChangeCounter = staticNodesChangeCounter;

            frustumUpdated = true;

            numOverlappingRenderables = 0;

            numVisibleNodes = scene.staticSpatialMap.getVisibleNodes(frustumPlanes, visibleNodes, 0);

            for (n = 0; n < numVisibleNodes; n += 1)
            {
                node = visibleNodes[n];
                renderables = node.renderables;
                if (renderables)
                {
                    numIntersectingPlanes = _filterFullyInsidePlanes(node.getWorldExtents(),
                                                                     frustumPlanes,
                                                                     intersectingPlanes);

                    numRenderables = renderables.length;
                    if (0 < numIntersectingPlanes)
                    {
                        for (i = 0; i < numRenderables; i += 1)
                        {
                            renderable = renderables[i];
                            extents = renderable.getWorldExtents();
                            if (_isInsidePlanesAABB(extents,
                                                    intersectingPlanes,
                                                    numIntersectingPlanes,
                                                    overlappingExtents,
                                                    numOverlappingRenderables))
                            {
                                overlappingRenderables[numOverlappingRenderables] = renderable;
                                numOverlappingRenderables += 1;
                            }
                        }
                    }
                    else
                    {
                        for (i = 0; i < numRenderables; i += 1)
                        {
                            renderable = renderables[i];

                            extents = renderable.getWorldExtents();
                            extentsCopy = overlappingExtents[numOverlappingRenderables];
                            if (!extentsCopy)
                            {
                                extentsCopy = new Float32Array(6);
                                overlappingExtents[numOverlappingRenderables] = extentsCopy;
                            }
                            extentsCopy[0] = extents[0];
                            extentsCopy[1] = extents[1];
                            extentsCopy[2] = extents[2];
                            extentsCopy[3] = extents[3];
                            extentsCopy[4] = extents[4];
                            extentsCopy[5] = extents[5];

                            overlappingRenderables[numOverlappingRenderables] = renderable;
                            numOverlappingRenderables += 1;
                        }
                    }
                }
            }

            split.numStaticOverlappingRenderables = numOverlappingRenderables;
        }
        else
        {
            numOverlappingRenderables = split.numStaticOverlappingRenderables;
        }

        // Query the dynamic renderables
        numVisibleNodes = scene.dynamicSpatialMap.getVisibleNodes(frustumPlanes, visibleNodes, 0);

        for (n = 0; n < numVisibleNodes; n += 1)
        {
            node = visibleNodes[n];
            renderables = node.renderables;
            if (renderables)
            {
                numIntersectingPlanes = _filterFullyInsidePlanes(node.getWorldExtents(),
                                                                 frustumPlanes,
                                                                 intersectingPlanes);

                numRenderables = renderables.length;
                if (0 < numIntersectingPlanes)
                {
                    for (i = 0; i < numRenderables; i += 1)
                    {
                        renderable = renderables[i];
                        extents = renderable.getWorldExtents();
                        if (_isInsidePlanesAABB(extents,
                                                intersectingPlanes,
                                                numIntersectingPlanes,
                                                overlappingExtents,
                                                numOverlappingRenderables))
                        {
                            overlappingRenderables[numOverlappingRenderables] = renderable;
                            numOverlappingRenderables += 1;
                        }
                    }
                }
                else
                {
                    for (i = 0; i < numRenderables; i += 1)
                    {
                        renderable = renderables[i];

                        extents = renderable.getWorldExtents();
                        extentsCopy = overlappingExtents[numOverlappingRenderables];
                        if (!extentsCopy)
                        {
                            extentsCopy = new Float32Array(6);
                            overlappingExtents[numOverlappingRenderables] = extentsCopy;
                        }
                        extentsCopy[0] = extents[0];
                        extentsCopy[1] = extents[1];
                        extentsCopy[2] = extents[2];
                        extentsCopy[3] = extents[3];
                        extentsCopy[4] = extents[4];
                        extentsCopy[5] = extents[5];

                        overlappingRenderables[numOverlappingRenderables] = renderable;
                        numOverlappingRenderables += 1;
                    }
                }
            }
        }

        split.numOverlappingRenderables = numOverlappingRenderables;

        return frustumUpdated;
    }

    private _sortNegative(a, b): number
    {
        return (a.sortKey - b.sortKey);
    }

    private _filterOccluders(overlappingRenderables: Renderable[],
                             overlappingExtents: Float32Array[],
                             numOverlappingRenderables: number,
                             occludersDrawArray: DrawParameters[],
                             occludeesExtents: Float32Array[],
                             occludersExtents: Float32Array[],
                             frameIndex: number): number
    {
        var numOccludees = 0;
        var numOccluders = 0;
        var n, renderable, extents, rendererInfo, shadowMappingUpdate;
        var drawParametersArray, numDrawParameters, drawParametersIndex;
        for (n = 0; n < numOverlappingRenderables; n += 1)
        {
            renderable = overlappingRenderables[n];
            if (!renderable.disabled && !renderable.node.disabled)
            {
                if (renderable.shadowMappingDrawParameters)
                {
                    rendererInfo = renderable.rendererInfo;
                    if (!rendererInfo)
                    {
                        rendererInfo = renderingCommonCreateRendererInfoFn(renderable);
                    }

                    shadowMappingUpdate = rendererInfo.shadowMappingUpdate;
                    if (shadowMappingUpdate)
                    {
                        shadowMappingUpdate.call(renderable);

                        extents = overlappingExtents[n];

                        drawParametersArray = renderable.shadowMappingDrawParameters;
                        numDrawParameters = drawParametersArray.length;
                        for (drawParametersIndex = 0; drawParametersIndex < numDrawParameters; drawParametersIndex += 1)
                        {
                            occludersDrawArray[numOccluders] = drawParametersArray[drawParametersIndex];
                            occludersExtents[numOccluders] = extents;
                            numOccluders += 1;
                        }
                    }
                }

                if (frameIndex === renderable.frameVisible)
                {
                    occludeesExtents[numOccludees] = overlappingExtents[n];
                    numOccludees += 1;
                }
            }
        }
        this.numOccludees = numOccludees;
        return numOccluders;
    }

    private _updateOccludeesLimits(split: CascadedShadowSplit,
                                   viewMatrix: any,
                                   occludeesExtents: Float32Array[]): void
    {
        var numOccludees = this.numOccludees;

        var r0 = -viewMatrix[0];
        var r1 = -viewMatrix[3];
        var r2 = -viewMatrix[6];
        var roffset = viewMatrix[9];

        var u0 = -viewMatrix[1];
        var u1 = -viewMatrix[4];
        var u2 = -viewMatrix[7];
        var uoffset = viewMatrix[10];

        var d0 = -viewMatrix[2];
        var d1 = -viewMatrix[5];
        var d2 = -viewMatrix[8];
        var offset = viewMatrix[11];

        var maxWindowX = split.lightViewWindowX;
        var minWindowX = -maxWindowX;
        var maxWindowY = split.lightViewWindowY;
        var minWindowY = -maxWindowY;
        var maxWindowZ = split.lightDepth;

        var minLightDistance = split.maxLightDistance;
        var maxLightDistance = split.minLightDistance;

        var n, extents, n0, n1, n2, p0, p1, p2, lightDistance;

        for (n = 0; n < numOccludees; )
        {
            extents = occludeesExtents[n];
            n0 = extents[0];
            n1 = extents[1];
            n2 = extents[2];
            p0 = extents[3];
            p1 = extents[4];
            p2 = extents[5];

            lightDistance = ((r0 * (r0 > 0 ? n0 : p0)) +
                             (r1 * (r1 > 0 ? n1 : p1)) +
                             (r2 * (r2 > 0 ? n2 : p2)) -
                             roffset);
            if (lightDistance < maxWindowX)
            {
                lightDistance = ((r0 * (r0 > 0 ? p0 : n0)) +
                                 (r1 * (r1 > 0 ? p1 : n1)) +
                                 (r2 * (r2 > 0 ? p2 : n2)) -
                                 roffset);
                if (lightDistance > minWindowX)
                {
                    lightDistance = ((u0 * (u0 > 0 ? n0 : p0)) +
                                     (u1 * (u1 > 0 ? n1 : p1)) +
                                     (u2 * (u2 > 0 ? n2 : p2)) -
                                     uoffset);
                    if (lightDistance < maxWindowY)
                    {
                        lightDistance = ((u0 * (u0 > 0 ? p0 : n0)) +
                                         (u1 * (u1 > 0 ? p1 : n1)) +
                                         (u2 * (u2 > 0 ? p2 : n2)) -
                                         uoffset);
                        if (lightDistance > minWindowY)
                        {
                            lightDistance = ((d0 * (d0 > 0 ? n0 : p0)) +
                                             (d1 * (d1 > 0 ? n1 : p1)) +
                                             (d2 * (d2 > 0 ? n2 : p2)) -
                                             offset);
                            if (lightDistance < maxWindowZ)
                            {
                                if (lightDistance < minLightDistance)
                                {
                                    minLightDistance = lightDistance;
                                }

                                lightDistance = ((d0 * (d0 > 0 ? p0 : n0)) +
                                                 (d1 * (d1 > 0 ? p1 : n1)) +
                                                 (d2 * (d2 > 0 ? p2 : n2)) -
                                                 offset);
                                if (maxLightDistance < lightDistance)
                                {
                                    maxLightDistance = lightDistance;
                                }

                                n += 1;
                                continue;
                            }
                        }
                    }
                }
            }

            numOccludees -= 1;
            if (n < numOccludees)
            {
                occludeesExtents[n] = occludeesExtents[numOccludees];
            }
            else
            {
                break;
            }
        }

        if (minLightDistance < split.minLightDistance)
        {
            minLightDistance = split.minLightDistance;
        }

        if (maxLightDistance > split.maxLightDistance)
        {
            maxLightDistance = split.maxLightDistance;
        }

        debug.assert(-0.01 <= minLightDistance);
        minLightDistance = Math.max(0, minLightDistance);

        var distanceRange = (maxLightDistance - minLightDistance);
        if (0.001 < distanceRange)
        {
            split.shadowDepthScale = 0.5;
            split.shadowDepthOffset = 0.5;
        }
        else
        {
            split.shadowDepthScale = 0;
            split.shadowDepthOffset = 0;
        }
    }

    private _updateOccludersLimits(split: CascadedShadowSplit,
                                   viewMatrix: any,
                                   occludersDrawArray: DrawParameters[],
                                   occludersExtents: Float32Array[],
                                   numOccluders: number): number
    {
        var r0 = -viewMatrix[0];
        var r1 = -viewMatrix[3];
        var r2 = -viewMatrix[6];
        var roffset = viewMatrix[9];

        var u0 = -viewMatrix[1];
        var u1 = -viewMatrix[4];
        var u2 = -viewMatrix[7];
        var uoffset = viewMatrix[10];

        var d0 = -viewMatrix[2];
        var d1 = -viewMatrix[5];
        var d2 = -viewMatrix[8];
        var offset = viewMatrix[11];

        var maxWindowX = split.lightViewWindowX;
        var minWindowX = -maxWindowX;
        var maxWindowY = split.lightViewWindowY;
        var minWindowY = -maxWindowY;
        var maxWindowZ = split.lightDepth;

        var minLightDistance = Number.MAX_VALUE;
        var maxLightDistance = -minLightDistance;
        var minLightDistanceX = minLightDistance;
        var maxLightDistanceX = -minLightDistance;
        var minLightDistanceY = minLightDistance;
        var maxLightDistanceY = -minLightDistance;

        var n, extents, n0, n1, n2, p0, p1, p2;
        var minX, maxX, minY, maxY, minZ, maxZ;

        for (n = 0; n < numOccluders; )
        {
            extents = occludersExtents[n];
            n0 = extents[0];
            n1 = extents[1];
            n2 = extents[2];
            p0 = extents[3];
            p1 = extents[4];
            p2 = extents[5];

            minX = ((r0 * (r0 > 0 ? n0 : p0)) +
                    (r1 * (r1 > 0 ? n1 : p1)) +
                    (r2 * (r2 > 0 ? n2 : p2)) -
                    roffset);
            if (minX < maxWindowX)
            {
                maxX = ((r0 * (r0 > 0 ? p0 : n0)) +
                        (r1 * (r1 > 0 ? p1 : n1)) +
                        (r2 * (r2 > 0 ? p2 : n2)) -
                        roffset);
                if (maxX > minWindowX)
                {
                    minY = ((u0 * (u0 > 0 ? n0 : p0)) +
                            (u1 * (u1 > 0 ? n1 : p1)) +
                            (u2 * (u2 > 0 ? n2 : p2)) -
                            uoffset);
                    if (minY < maxWindowY)
                    {
                        maxY = ((u0 * (u0 > 0 ? p0 : n0)) +
                                (u1 * (u1 > 0 ? p1 : n1)) +
                                (u2 * (u2 > 0 ? p2 : n2)) -
                                uoffset);
                        if (maxY > minWindowY)
                        {
                            minZ = ((d0 * (d0 > 0 ? n0 : p0)) +
                                    (d1 * (d1 > 0 ? n1 : p1)) +
                                    (d2 * (d2 > 0 ? n2 : p2)) -
                                    offset);
                            if (minZ < maxWindowZ)
                            {
                                maxZ = ((d0 * (d0 > 0 ? p0 : n0)) +
                                        (d1 * (d1 > 0 ? p1 : n1)) +
                                        (d2 * (d2 > 0 ? p2 : n2)) -
                                        offset);
                                if (minZ < minLightDistance)
                                {
                                    minLightDistance = minZ;
                                }

                                if (maxLightDistance < maxZ)
                                {
                                    maxLightDistance = maxZ;
                                }

                                if (minX < minLightDistanceX)
                                {
                                    minLightDistanceX = minX;
                                }

                                if (maxLightDistanceX < maxX)
                                {
                                    maxLightDistanceX = maxX;
                                }

                                if (minY < minLightDistanceY)
                                {
                                    minLightDistanceY = minY;
                                }

                                if (maxLightDistanceY < maxY)
                                {
                                    maxLightDistanceY = maxY;
                                }

                                n += 1;
                                continue;
                            }
                        }
                    }
                }
            }

            // if we reach this code is because the occluder is out of bounds
            numOccluders -= 1;
            if (n < numOccluders)
            {
                occludersDrawArray[n] = occludersDrawArray[numOccluders];
                occludersExtents[n] = occludersExtents[numOccluders];
            }
            else
            {
                break;
            }
        }

        if (numOccluders === 0)
        {
            return 0;
        }

        if (maxLightDistance > split.lightDepth)
        {
            maxLightDistance = split.lightDepth;
        }

        split.minLightDistance = minLightDistance;
        split.maxLightDistance = maxLightDistance;
        split.minLightDistanceX = minLightDistanceX;
        split.maxLightDistanceX = maxLightDistanceX;
        split.minLightDistanceY = minLightDistanceY;
        split.maxLightDistanceY = maxLightDistanceY;

        return numOccluders;
    }

    drawShadowMap(): void
    {
        if (this.numSplitsToRedraw === 0)
        {
            return;
        }

        var globalTechniqueParametersArray = this.globalTechniqueParametersArray;
        var gtp = this.globalTechniqueParameters;
        var renderTarget = this.renderTarget;
        var clearColor = this.clearColor;
        var gd = this.gd;
        var md = this.md;

        /* tslint:disable:no-bitwise */
        var splitSize = (this.size >>> 1);
        /* tslint:enable:no-bitwise */
        var splits = this.splits;
        var numSplits = splits.length;

        if (!gd.beginRenderTarget(renderTarget))
        {
            return;
        }

        if (this.numSplitsToRedraw === numSplits)
        {
            gd.clear(clearColor, 1.0, 0);
        }

        var n, split, splitCamera, occludersDrawArray;
        for (n = 0; n < numSplits; n += 1)
        {
            split = splits[n];
            if (split.needsRedraw)
            {
                split.needsRedraw = false;

                gd.setViewport(split.viewportX, split.viewportY, splitSize, splitSize);
                gd.setScissor(split.viewportX, split.viewportY, splitSize, splitSize);

                if (this.numSplitsToRedraw !== numSplits)
                {
                    gd.clear(clearColor, 1.0, 0);
                }

                splitCamera = split.camera;

                occludersDrawArray = split.occludersDrawArray;
                if (occludersDrawArray.length)
                {
                    /* tslint:disable:no-string-literal */
                    gtp['viewProjectionTranspose'] = md.m44Transpose(splitCamera.viewProjectionMatrix,
                                                                     gtp['viewProjectionTranspose']);
                    /* tslint:enable:no-string-literal */

                    gd.drawArray(occludersDrawArray, globalTechniqueParametersArray, 0);
                }
            }
        }

        gd.endRenderTarget();

        this.numSplitsToRedraw = 0;
    }

    blurShadowMap(): void
    {
        if (!this.blurEnabled)
        {
            return;
        }

        var gd = this.gd;

        gd.setStream(this.quadVertexBuffer, this.quadSemantics);

        var shadowMappingBlurTechnique = this.blurTechnique;
        gd.setTechnique(shadowMappingBlurTechnique);

        var quadPrimitive = this.quadPrimitive;

        var uvScaleOffset = this.uvScaleOffset;
        var pixelOffsetH = this.pixelOffsetH;
        var pixelOffsetV = this.pixelOffsetV;

        /* tslint:disable:no-bitwise */
        var splitSize = (this.size >>> 1);
        /* tslint:enable:no-bitwise */
        var invSplitSize = (1.0 / splitSize);
        var invSize = (1.0 / this.size);
        pixelOffsetH[0] = invSize;
        pixelOffsetV[1] = invSplitSize;

        var blurTexture = this.blurTexture;
        var blurRenderTarget = this.blurRenderTarget;

        var splits = this.splits;
        var numSplits = splits.length;
        var n, split;
        for (n = 0; n < numSplits; n += 1)
        {
            split = splits[n];
            if (split.needsBlur)
            {
                split.needsBlur = false;

                // Horizontal
                if (!gd.beginRenderTarget(blurRenderTarget))
                {
                    break;
                }

                uvScaleOffset[1] = uvScaleOffset[0] = (splitSize - 4) * invSize;
                uvScaleOffset[2] = (split.viewportX + 2) * invSize;
                uvScaleOffset[3] = (split.viewportY + 2) * invSize;

                /* tslint:disable:no-string-literal */
                shadowMappingBlurTechnique['shadowMap'] = this.texture;
                shadowMappingBlurTechnique['uvScaleOffset'] = uvScaleOffset;
                shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetH;
                /* tslint:enable:no-string-literal */

                gd.draw(quadPrimitive, 4);

                gd.endRenderTarget();

                // Vertical
                if (!gd.beginRenderTarget(this.renderTarget))
                {
                    break;
                }

                // Avoid bluring the edges
                gd.setViewport((split.viewportX + 2), (split.viewportY + 2), (splitSize - 4), (splitSize - 4));
                gd.setScissor((split.viewportX + 2), (split.viewportY + 2), (splitSize - 4), (splitSize - 4));

                uvScaleOffset[0] = 1;
                uvScaleOffset[1] = 1;
                uvScaleOffset[2] = 0;
                uvScaleOffset[3] = 0;

                /* tslint:disable:no-string-literal */
                shadowMappingBlurTechnique['shadowMap'] = blurTexture;
                shadowMappingBlurTechnique['uvScaleOffset'] = uvScaleOffset;
                shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetV;
                /* tslint:enable:no-string-literal */

                gd.draw(quadPrimitive, 4);

                gd.endRenderTarget();
            }
        }
    }

    destroy(): void
    {
        delete this.shader;
        delete this.rigidTechnique;
        delete this.skinnedTechnique;
        delete this.blurTechnique;

        this.destroyBuffers();

        delete this.tempV3AxisZ;
        delete this.tempV3AxisY;
        delete this.tempV3AxisX;
        delete this.tempV3At;
        delete this.tempV3Up;
        delete this.tempV3Right;
        delete this.tempV3Direction;
        delete this.tempMatrix33;
        delete this.tempMatrix43;
        delete this.tempMatrix44;
        delete this.clearColor;

        delete this.quadPrimitive;
        delete this.quadSemantics;

        if (this.quadVertexBuffer)
        {
            this.quadVertexBuffer.destroy();
            delete this.quadVertexBuffer;
        }

        delete this.splits;
        delete this.techniqueParameters;
        delete this.globalTechniqueParameters;
        delete this.globalTechniqueParametersArray;
        delete this.occludersExtents;
        delete this.occludeesExtents;
        delete this.md;
        delete this.gd;
    }

    // Constructor function
    static create(gd: GraphicsDevice,
                  md: MathDevice,
                  shaderManager: ShaderManager,
                  size: number,
                  blurDisabled?: boolean): CascadedShadowMapping
    {
        return new CascadedShadowMapping(gd, md, shaderManager, size, blurDisabled);
    }
}
