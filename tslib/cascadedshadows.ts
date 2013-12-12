// Copyright (c) 2013 Turbulenz Limited

//
// CascadedShadowMapping
//
/*global renderingCommonCreateRendererInfoFn: false, Camera: false*/

class CascadedShadowSplit
{
    camera: Camera;

    position: any; // v3
    direction: any; // v3
    halfExtents: any; // v3
    target: any; // v3

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
    needsRedraw: boolean;
    needsBlur: boolean;

    occludersDrawArray: DrawParameters[];
    overlappingRenderables: Renderable[];


    constructor(md)
    {
        this.camera = Camera.create(md);

        this.position = md.v3BuildZero();
        this.direction = md.v3BuildZero();
        this.halfExtents = md.v3BuildZero();
        this.target = md.v3BuildZero();

        this.minLightDistance = 0;
        this.maxLightDistance = 0;
        this.minLightDistanceX = 0;
        this.maxLightDistanceX = 0;
        this.minLightDistanceY = 0;
        this.maxLightDistanceY = 0;

        this.lightViewWindowX = 0;
        this.lightViewWindowY = 0;
        this.lightDepth = 0;

        this.shadowDepthScale = 1;
        this.shadowDepthOffset = 0;

        this.staticNodesChangeCounter = -1;
        this.numStaticOverlappingRenderables = -1;
        this.needsRedraw = false;
        this.needsBlur = false;
        this.occludersDrawArray = [];
        this.overlappingRenderables = [];

        return this;
    }
};


class CascadedShadowMapping
{
    static version = 1;

    gd                  : GraphicsDevice;
    md                  : MathDevice;
    clearColor          : any; // v4
    tempExtents         : any; // v6
    tempMatrix43        : any; // m43
    tempV3Up            : any; // v3
    tempV3At            : any; // v3
    tempV3Pos           : any; // v3
    tempV3Origin        : any; // v3
    tempV3AxisX         : any; // v3
    tempV3AxisY         : any; // v3
    tempV3AxisZ         : any; // v3

    techniqueParameters : TechniqueParameters;

    quadPrimitive       : number;
    quadSemantics       : Semantics;
    quadVertexBuffer    : VertexBuffer;

    pixelOffsetH        : number[];
    pixelOffsetV        : number[];

    bufferWidth         : number;
    bufferHeight        : number;

    globalTechniqueParameters : TechniqueParameters;
    globalTechniqueParametersArray : TechniqueParameters[];
    shader              : Shader;
    splits              : CascadedShadowSplit[];

    size                : number;

    texture             : Texture;
    renderTarget        : RenderTarget;
    blurTexture         : Texture;
    depthBuffer         : RenderBuffer;
    blurRenderTarget    : RenderTarget;

    occludersExtents    : any[];

    shadowMappingShader : Shader;
    rigidTechnique      : Technique;
    skinnedTechnique    : Technique;
    blurTechnique       : Technique;

    blurEnabled         : boolean;


    // Render update calbacks
    update: () => void
    skinnedUpdate: () => void


    constructor(gd: GraphicsDevice, md: MathDevice, shaderManager: ShaderManager, size: number)
    {
        shaderManager.load("shaders/cascadedshadows.cgfx");

        this.gd = gd;
        this.md = md;
        this.clearColor = md.v4Build(1, 1, 1, 1);
        this.tempExtents = new Float32Array(6);
        this.tempMatrix43 = md.m43BuildIdentity();
        this.tempV3Up = md.v3BuildZero();
        this.tempV3At = md.v3BuildZero();
        this.tempV3Pos = md.v3BuildZero();
        this.tempV3Origin = md.v3BuildZero();
        this.tempV3AxisX = md.v3BuildZero();
        this.tempV3AxisY = md.v3BuildZero();
        this.tempV3AxisZ = md.v3BuildZero();

        this.techniqueParameters = gd.createTechniqueParameters();

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

        this.pixelOffsetH = [0, 0];
        this.pixelOffsetV = [0, 0];

        this.bufferWidth = 0;
        this.bufferHeight = 0;

        this.globalTechniqueParameters = gd.createTechniqueParameters();
        this.globalTechniqueParametersArray = [this.globalTechniqueParameters];
        this.shader = null;

        this.splits = [new CascadedShadowSplit(md),
                       new CascadedShadowSplit(md),
                       new CascadedShadowSplit(md),
                       new CascadedShadowSplit(md)];

        this.updateBuffers(size);

        this.occludersExtents = [];

        var precision = gd.maxSupported("FRAGMENT_SHADER_PRECISION");
        if (precision && // Just in case the query is not supported
            precision < 16)
        {
            this.blurEnabled = false;
        }
        else
        {
            this.blurEnabled = true;
        }

        this.update = function _cascadedShadowsUpdateFn(): void
        {
            this.shadowTechniqueParameters['world'] = this.node.world;
        }

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
        }

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

        var gd = this.gd;

        this.destroyBuffers();

        this.depthBuffer = gd.createRenderBuffer({
                width: size,
                height: size,
                format: "D16"
            });

        this.blurTexture = gd.createTexture({
                width: size,
                height: size,
                format: "R5G6B5",
                mipmaps: false,
                renderable: true
            });

        if (this.depthBuffer &&
            this.blurTexture)
        {
            this.blurRenderTarget = gd.createRenderTarget({
                    colorTexture0: this.blurTexture
                });

            if (this.blurRenderTarget)
            {
                this.texture = gd.createTexture({
                    width: size,
                    height: size,
                    format: "R5G6B5",
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

    updateShadowMap(direction: any, camera: Camera, scene: Scene): boolean
    {
        var floor = Math.floor;
        var ceil = Math.ceil;

        var extents = this.tempExtents;
        camera.getFrustumExtents(extents, scene.maxDistance);
        extents[0] = floor(extents[0]);
        extents[1] = floor(extents[1]);
        extents[2] = floor(extents[2]);
        extents[3] = ceil(extents[3]);
        extents[4] = ceil(extents[4]);
        extents[5] = ceil(extents[5]);

        return this._updateSplit(this.splits[0], direction, camera.matrix, extents, scene);
    }

    _updateSplit(split: CascadedShadowSplit, direction: any, cameraMatrix: any, extents: any, scene: Scene): boolean
    {
        var md = this.md;

        var position = this.tempV3Pos;
        position[0] = ((extents[0] + extents[3]) / 2.0);
        position[1] = ((extents[1] + extents[4]) / 2.0);
        position[2] = ((extents[2] + extents[5]) / 2.0);

        var halfExtents0 = ((extents[3] - extents[0]) / 2.0);
        var halfExtents1 = ((extents[4] - extents[1]) / 2.0);
        var halfExtents2 = ((extents[5] - extents[2]) / 2.0);

        var previousDirection = split.direction;
        var previousPosition = split.direction;
        var previousHalfExtents = split.halfExtents;

        var overlappingRenderables = split.overlappingRenderables;

        var staticNodesChangeCounter = scene.staticNodesChangeCounter;

        var numOverlapQueryRenderables, numOverlappingRenderables;
        var renderable;
        var n;

        var extentsUpdated = false;
        if (previousPosition[0] !== position[0] ||
            previousPosition[1] !== position[1] ||
            previousPosition[2] !== position[2] ||
            previousHalfExtents[0] !== halfExtents0 ||
            previousHalfExtents[1] !== halfExtents1 ||
            previousHalfExtents[2] !== halfExtents2 ||
            split.staticNodesChangeCounter !== staticNodesChangeCounter)
        {
            extentsUpdated = true;

            overlappingRenderables.length = 0;
            numOverlappingRenderables = 0;

            scene.findStaticOverlappingRenderables(extents, extents, overlappingRenderables);
            numOverlapQueryRenderables = overlappingRenderables.length;
            for (n = 0; n < numOverlapQueryRenderables; n += 1)
            {
                renderable = overlappingRenderables[n];

                if (renderable.shadowTechniqueParameters)
                {
                    overlappingRenderables[numOverlappingRenderables] = renderable;
                    numOverlappingRenderables += 1;

                    // Make sure the extents are calculated
                    renderable.getWorldExtents();
                }
            }

            split.numStaticOverlappingRenderables = numOverlappingRenderables;
        }
        else
        {
            numOverlappingRenderables = split.numStaticOverlappingRenderables;
        }

        overlappingRenderables.length = numOverlappingRenderables;

        // Query the dynamic renderables from the scene and filter out non lit geometries
        scene.findDynamicOverlappingRenderables(extents, extents, overlappingRenderables);
        numOverlapQueryRenderables = overlappingRenderables.length;
        for (n = numOverlappingRenderables; n < numOverlapQueryRenderables; n += 1)
        {
            renderable = overlappingRenderables[n];

            if (renderable.shadowTechniqueParameters)
            {
                overlappingRenderables[numOverlappingRenderables] = renderable;
                numOverlappingRenderables += 1;
            }
        }

        overlappingRenderables.length = numOverlappingRenderables;

        var occludersDrawArray = split.occludersDrawArray;

        var camera = split.camera;
        camera.parallel = true;

        var target = split.target;

        var axisY = md.v3BuildYAxis(this.tempV3Up);
        var axisZ = md.v3BuildZAxis(this.tempV3At);
        var abs = Math.abs;

        var d0 = direction[0];
        var d1 = direction[1];
        var d2 = direction[2];

        var p0 = halfExtents0;
        var p1 = halfExtents1;
        var p2 = halfExtents2;

        var n0 = -p0;
        var n1 = -p1;
        var n2 = -p2;

        var maxDistance = ((d0 * (d0 > 0 ? p0 : n0)) + (d1 * (d1 > 0 ? p1 : n1)) + (d2 * (d2 > 0 ? p2 : n2)));
        var minDistance = ((d0 * (d0 > 0 ? n0 : p0)) + (d1 * (d1 > 0 ? n1 : p1)) + (d2 * (d2 > 0 ? n2 : p2)));

        md.v3AddScalarMul(position, direction, maxDistance, target);
        var origin = md.v3AddScalarMul(position, direction, minDistance, this.tempV3Origin);

        var up;
        if (abs(md.v3Dot(direction, axisZ)) < abs(md.v3Dot(direction, axisY)))
        {
            up = axisZ;
        }
        else
        {
            up = axisY;
        }

        this.lookAt(camera, target, up, origin);
        camera.updateViewMatrix();
        var viewMatrix = camera.viewMatrix;

        var lightDepth, lightViewWindowX, lightViewWindowY;

        var m0 = viewMatrix[0];
        var m1 = viewMatrix[1];
        var m3 = viewMatrix[3];
        var m4 = viewMatrix[4];
        var m6 = viewMatrix[6];
        var m7 = viewMatrix[7];
        lightViewWindowX = ((m0 < 0 ? -m0 : m0) * halfExtents0 + (m3 < 0 ? -m3 : m3) * halfExtents1 + (m6 < 0 ? -m6 : m6) * halfExtents2);
        lightViewWindowY = ((m1 < 0 ? -m1 : m1) * halfExtents0 + (m4 < 0 ? -m4 : m4) * halfExtents1 + (m7 < 0 ? -m7 : m7) * halfExtents2);
        lightDepth = md.v3Length(md.v3Sub(target, origin));

        split.lightViewWindowX = lightViewWindowX;
        split.lightViewWindowY = lightViewWindowY;
        split.lightDepth = lightDepth;

        var numStaticOverlappingRenderables = split.numStaticOverlappingRenderables;

        if (extentsUpdated ||
            previousDirection[0] !== direction[0] ||
            previousDirection[1] !== direction[1] ||
            previousDirection[2] !== direction[2] ||
            numStaticOverlappingRenderables !== numOverlappingRenderables)
        {
            previousDirection[0] = direction[0];
            previousDirection[1] = direction[1];
            previousDirection[2] = direction[2];

            previousPosition[0] = position[0];
            previousPosition[1] = position[1];
            previousPosition[2] = position[2];

            previousHalfExtents[0] = halfExtents0;
            previousHalfExtents[1] = halfExtents1;
            previousHalfExtents[2] = halfExtents2;

            split.staticNodesChangeCounter = staticNodesChangeCounter;
            split.needsRedraw = true;
            split.needsBlur = true;

            var occludersExtents = this.occludersExtents;
            var numOccluders = this._filterOccluders(overlappingRenderables,
                                                     numStaticOverlappingRenderables,
                                                     occludersDrawArray,
                                                     occludersExtents);
            numOccluders = this._updateOccludersLimits(split,
                                                       viewMatrix,
                                                       occludersDrawArray,
                                                       occludersExtents,
                                                       numOccluders);
            occludersDrawArray.length = numOccluders;

            if (1 < numOccluders)
            {
                occludersDrawArray.sort(this._sortNegative);
            }
        }
        else
        {
            split.needsRedraw = false;
        }

        // Prepare rendering data
        var maxExtentSize = Math.max(halfExtents0, halfExtents1, halfExtents2);
        var shadowMapSize = this.size;

        var distanceScale = (1.0 / 65536);
        var minLightDistance = (split.minLightDistance - distanceScale); // Need padding to avoid culling near objects
        var maxLightDistance = (split.maxLightDistance + distanceScale); // Need padding to avoid encoding singularity at far plane

        var lightViewOffsetX = 0;
        var lightViewOffsetY = 0;

        if (0 < minLightDistance)
        {
            var borderPadding = (3 / shadowMapSize);
            var minLightDistanceX = split.minLightDistanceX;
            var maxLightDistanceX = split.maxLightDistanceX;
            var minLightDistanceY = split.minLightDistanceY;
            var maxLightDistanceY = split.maxLightDistanceY;
            var minimalViewWindowX, minimalViewWindowY;

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
            minimalViewWindowX = Math.max(Math.abs(maxLightDistanceX), Math.abs(minLightDistanceX));
            minimalViewWindowX += 2 * borderPadding * minimalViewWindowX;
            minimalViewWindowY = Math.max(Math.abs(maxLightDistanceY), Math.abs(minLightDistanceY));
            minimalViewWindowY += 2 * borderPadding * minimalViewWindowY;
            if (lightViewWindowX > minimalViewWindowX)
            {
                lightViewWindowX = minimalViewWindowX;
            }
            if (lightViewWindowY > minimalViewWindowY)
            {
                lightViewWindowY = minimalViewWindowY;
            }
        }

        camera.aspectRatio = 1;
        camera.nearPlane = (lightDepth * distanceScale);
        camera.farPlane  = (lightDepth + distanceScale);
        camera.recipViewWindowX = 1.0 / lightViewWindowX;
        camera.recipViewWindowY = 1.0 / lightViewWindowY;
        camera.viewOffsetX = lightViewOffsetX;
        camera.viewOffsetY = lightViewOffsetY;

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

        var maxDepthReciprocal = (1.0 / (maxLightDistance - minLightDistance));

        split.shadowDepthScale = -maxDepthReciprocal;
        split.shadowDepthOffset = -minLightDistance * maxDepthReciprocal;

        var techniqueParameters = this.techniqueParameters;

        techniqueParameters['worldShadowProjection'] = md.m44Copy(shadowProjection,
                                                                  techniqueParameters['worldShadowProjection']);

        techniqueParameters['viewShadowProjection'] = md.m43MulM44(cameraMatrix,
                                                                   shadowProjection,
                                                                   techniqueParameters['viewShadowProjection']);

        techniqueParameters['worldShadowDepth'] = md.v4Build(-viewMatrix[2] * maxDepthReciprocal,
                                                             -viewMatrix[5] * maxDepthReciprocal,
                                                             -viewMatrix[8] * maxDepthReciprocal,
                                                             (-viewMatrix[11] - minLightDistance) * maxDepthReciprocal,
                                                             techniqueParameters['worldShadowDepth']);

        var viewToShadowMatrix = md.m43Mul(cameraMatrix, viewMatrix, this.tempMatrix43);
        techniqueParameters['viewShadowDepth'] = md.v4Build(-viewToShadowMatrix[2] * maxDepthReciprocal,
                                                            -viewToShadowMatrix[5] * maxDepthReciprocal,
                                                            -viewToShadowMatrix[8] * maxDepthReciprocal,
                                                            (-viewToShadowMatrix[11] - minLightDistance) * maxDepthReciprocal,
                                                            techniqueParameters['viewShadowDepth']);
        techniqueParameters['shadowSize'] = shadowMapSize;
        techniqueParameters['invShadowSize'] = (1.0 / shadowMapSize);
        techniqueParameters['shadowMapTexture'] = this.texture;

        return (0 < occludersDrawArray.length);
    }

    private _sortNegative(a, b): number
    {
        return (a.sortKey - b.sortKey);
    }

    drawShadowMap(): void
    {
        this._drawSplit(this.splits[0]);
    }

    _drawSplit(split: CascadedShadowSplit): void
    {
        if (split.needsRedraw)
        {
            split.needsRedraw = false;

            var gd = this.gd;
            var md = this.md;

            if (!gd.beginRenderTarget(this.renderTarget))
            {
                return;
            }

            gd.clear(this.clearColor, 1.0, 0);

            var splitCamera = split.camera;

            var globalTechniqueParameters = this.globalTechniqueParameters;
            globalTechniqueParameters['viewTranspose'] = md.m43Transpose(splitCamera.viewMatrix,
                                                                         globalTechniqueParameters['viewTranspose']);
            globalTechniqueParameters['shadowProjectionTranspose'] = md.m44Transpose(splitCamera.projectionMatrix,
                                                                                     globalTechniqueParameters['shadowProjectionTranspose']);
            globalTechniqueParameters['shadowDepth'] = md.v4Build(0,
                                                                  0,
                                                                  split.shadowDepthScale,
                                                                  split.shadowDepthOffset,
                                                                  globalTechniqueParameters['shadowDepth']);

            gd.drawArray(split.occludersDrawArray, this.globalTechniqueParametersArray, 0);

            gd.endRenderTarget();
        }
    }

    private _filterOccluders(overlappingRenderables: any[],
                             numStaticOverlappingRenderables: number,
                             occludersDrawArray: any[],
                             occludersExtents: any[]): number
    {
        var numOverlappingRenderables = overlappingRenderables.length;
        var numOccluders = 0;
        var n, renderable, worldExtents, rendererInfo;
        var drawParametersArray, numDrawParameters, drawParametersIndex;
        for (n = 0; n < numOverlappingRenderables; n += 1)
        {
            renderable = overlappingRenderables[n];
            if (!(renderable.disabled || renderable.node.disabled || renderable.sharedMaterial.meta.noshadows))
            {
                rendererInfo = renderable.rendererInfo;
                if (!rendererInfo)
                {
                    rendererInfo = renderingCommonCreateRendererInfoFn(renderable);
                }

                if (rendererInfo.shadowMappingUpdate && renderable.shadowMappingDrawParameters)
                {
                    rendererInfo.shadowMappingUpdate.call(renderable);

                    if (n >= numStaticOverlappingRenderables)
                    {
                        worldExtents = renderable.getWorldExtents();
                    }
                    else
                    {
                        // We can use the property directly because as it is static it should not change!
                        worldExtents = renderable.worldExtents;
                    }

                    drawParametersArray = renderable.shadowMappingDrawParameters;
                    numDrawParameters = drawParametersArray.length;
                    for (drawParametersIndex = 0; drawParametersIndex < numDrawParameters; drawParametersIndex += 1)
                    {
                        occludersDrawArray[numOccluders] = drawParametersArray[drawParametersIndex];
                        occludersExtents[numOccluders] = worldExtents;
                        numOccluders += 1;
                    }
                }
            }
        }
        return numOccluders;
    }

    private _updateOccludersLimits(split: any,
                                   viewMatrix: any,
                                   occludersDrawArray: any[],
                                   occludersExtents: any[],
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

        var minLightDistance = Number.MAX_VALUE;
        var maxLightDistance = -minLightDistance;
        var minLightDistanceX = minLightDistance;
        var maxLightDistanceX = -minLightDistance;
        var minLightDistanceY = minLightDistance;
        var maxLightDistanceY = -minLightDistance;

        var n, extents, n0, n1, n2, p0, p1, p2, lightDistance;

        for (n = 0; n < numOccluders; )
        {
            extents = occludersExtents[n];
            n0 = extents[0];
            n1 = extents[1];
            n2 = extents[2];
            p0 = extents[3];
            p1 = extents[4];
            p2 = extents[5];
            lightDistance = ((d0 * (d0 > 0 ? p0 : n0)) + (d1 * (d1 > 0 ? p1 : n1)) + (d2 * (d2 > 0 ? p2 : n2)));
            if (lightDistance > offset)
            {
                lightDistance = (lightDistance - offset);
                if (maxLightDistance < lightDistance)
                {
                    maxLightDistance = lightDistance;
                }

                if (0 < minLightDistance)
                {
                    lightDistance = ((d0 * (d0 > 0 ? n0 : p0)) + (d1 * (d1 > 0 ? n1 : p1)) + (d2 * (d2 > 0 ? n2 : p2)) - offset);
                    if (lightDistance < minLightDistance)
                    {
                        minLightDistance = lightDistance;
                        if (0 >= minLightDistance)
                        {
                            continue;
                        }
                    }

                    lightDistance = ((r0 * (r0 > 0 ? n0 : p0)) + (r1 * (r1 > 0 ? n1 : p1)) + (r2 * (r2 > 0 ? n2 : p2)) - roffset);
                    if (lightDistance < minLightDistanceX)
                    {
                        minLightDistanceX = lightDistance;
                    }

                    lightDistance = ((r0 * (r0 > 0 ? p0 : n0)) + (r1 * (r1 > 0 ? p1 : n1)) + (r2 * (r2 > 0 ? p2 : n2)) - roffset);
                    if (maxLightDistanceX < lightDistance)
                    {
                        maxLightDistanceX = lightDistance;
                    }

                    lightDistance = ((u0 * (u0 > 0 ? n0 : p0)) + (u1 * (u1 > 0 ? n1 : p1)) + (u2 * (u2 > 0 ? n2 : p2)) - uoffset);
                    if (lightDistance < minLightDistanceY)
                    {
                        minLightDistanceY = lightDistance;
                    }

                    lightDistance = ((u0 * (u0 > 0 ? p0 : n0)) + (u1 * (u1 > 0 ? p1 : n1)) + (u2 * (u2 > 0 ? p2 : n2)) - uoffset);
                    if (maxLightDistanceY < lightDistance)
                    {
                        maxLightDistanceY = lightDistance;
                    }
                }

                n += 1;
            }
            else
            {
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
        }

        if (minLightDistance < 0)
        {
            minLightDistance = 0;
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

        var pixelOffsetH = this.pixelOffsetH;
        var pixelOffsetV = this.pixelOffsetV;
        pixelOffsetV[1] = pixelOffsetH[0] = (1.0 / this.size);

        var shadowMapBlurTexture = this.blurTexture;
        var shadowMapBlurRenderTarget = this.blurRenderTarget;

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
                if (!gd.beginRenderTarget(shadowMapBlurRenderTarget))
                {
                    break;
                }

                shadowMappingBlurTechnique['shadowMap'] = this.texture;
                shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetH;
                gd.draw(quadPrimitive, 4);

                gd.endRenderTarget();

                // Vertical
                if (!gd.beginRenderTarget(this.renderTarget))
                {
                    break;
                }

                shadowMappingBlurTechnique['shadowMap'] = shadowMapBlurTexture;
                shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetV;
                gd.draw(quadPrimitive, 4);

                gd.endRenderTarget();
            }
        }
    }

    lookAt(camera, lookAt, up, eyePosition): void
    {
        var md = this.md;
        var zaxis = md.v3Sub(eyePosition, lookAt, this.tempV3AxisZ);
        md.v3Normalize(zaxis, zaxis);
        var xaxis = md.v3Cross(md.v3Normalize(up, up), zaxis, this.tempV3AxisX);
        md.v3Normalize(xaxis, xaxis);
        var yaxis = md.v3Cross(zaxis, xaxis, this.tempV3AxisY);
        camera.matrix = md.m43Build(xaxis, yaxis, zaxis, eyePosition, camera.matrix);
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
        delete this.tempV3Pos;
        delete this.tempV3At;
        delete this.tempV3Up;
        delete this.tempMatrix43;
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
        delete this.md;
        delete this.gd;
    }

    // Constructor function
    static create(gd: GraphicsDevice, md: MathDevice, shaderManager: ShaderManager, size: number): CascadedShadowMapping
    {
        return new CascadedShadowMapping(gd, md, shaderManager, size);
    }
}
