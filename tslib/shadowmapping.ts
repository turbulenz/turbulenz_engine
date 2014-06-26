// Copyright (c) 2010-2013 Turbulenz Limited

//
// ShadowMapping
//
/*global renderingCommonCreateRendererInfoFn: false, Camera: false*/

interface ShadowMap
{
    shadowMapTexture: Texture;
    shadowMapRenderTarget: RenderTarget;
    lightInstance: LightInstance;

    // TODO: Is this ever set?  DeferredRendering appears to refer to it.
    texture?: Texture;
};

class ShadowMapping
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    defaultSizeLow = 512;
    defaultSizeHigh = 1024;
    blurEnabled = true;

    gd                  : GraphicsDevice;
    md                  : MathDevice;
    clearColor          : any; // v4
    tempMatrix43        : any; // m43
    tempV3Up            : any; // v3
    tempV3At            : any; // v3
    tempV3Pos           : any; // v3
    tempV3AxisX         : any; // v3
    tempV3AxisY         : any; // v3
    tempV3AxisZ         : any; // v3

    quadPrimitive       : number;
    quadSemantics       : Semantics;
    quadVertexBuffer    : VertexBuffer;

    pixelOffsetH        : number[];
    pixelOffsetV        : number[];

    node                : SceneNode;

    bufferWidth         : number;
    bufferHeight        : number;

    techniqueParameters : TechniqueParameters;
    shader              : Shader;
    shadowMapsLow       : ShadowMap[];
    shadowMapsHigh      : ShadowMap[];

    sizeLow             : number;
    sizeHigh            : number;

    lowIndex            : number;
    highIndex           : number;

    blurTextureHigh      : Texture;
    blurTextureLow       : Texture;
    depthBufferLow       : RenderBuffer;
    depthBufferHigh      : RenderBuffer;
    blurRenderTargetHigh : RenderTarget;
    blurRenderTargetLow  : RenderTarget;

    occludersExtents     : any[];

    shadowMappingShader  : Shader;
    rigidTechnique       : Technique;
    skinnedTechnique     : Technique;
    blurTechnique        : Technique;

    shadowTechniqueParameters : TechniqueParameters;

    skinController       : SkinController;

    // Methods

    updateShader(sm)
    {
        var shader = sm.get("shaders/shadowmapping.cgfx");
        if (shader !== this.shadowMappingShader)
        {
            this.shader = shader;
            this.rigidTechnique = shader.getTechnique("rigid");
            this.skinnedTechnique = shader.getTechnique("skinned");
            this.blurTechnique = shader.getTechnique("blur");
        }
    }

    update()
    {
        /* tslint:disable:no-string-literal */
        this.shadowTechniqueParameters['world'] = this.node.world;
        /* tslint:enable:no-string-literal */
    }

    skinnedUpdate()
    {
        var techniqueParameters = this.shadowTechniqueParameters;
        /* tslint:disable:no-string-literal */
        techniqueParameters['world'] = this.node.world;
        /* tslint:enable:no-string-literal */

        var skinController = this.skinController;
        if (skinController)
        {
            /* tslint:disable:no-string-literal */
            techniqueParameters['skinBones'] = skinController.output;
            /* tslint:enable:no-string-literal */
            skinController.update();
        }
    }

    destroyBuffers()
    {
        var shadowMaps, numShadowMaps, n, shadowMap, renderTarget, texture;

        shadowMaps = this.shadowMapsLow;
        if (shadowMaps)
        {
            numShadowMaps = shadowMaps.length;
            for (n = 0; n < numShadowMaps; n += 1)
            {
                shadowMap = shadowMaps[n];

                renderTarget = shadowMap.renderTarget;
                if (renderTarget)
                {
                    renderTarget.destroy();
                    shadowMap.renderTarget = null;
                }

                texture = shadowMap.texture;
                if (texture)
                {
                    texture.destroy();
                    shadowMap.texture = null;
                }
            }
            shadowMaps.length = 0;
        }

        shadowMaps = this.shadowMapsHigh;
        if (shadowMaps)
        {
            numShadowMaps = shadowMaps.length;
            for (n = 0; n < numShadowMaps; n += 1)
            {
                shadowMap = shadowMaps[n];

                renderTarget = shadowMap.renderTarget;
                if (renderTarget)
                {
                    renderTarget.destroy();
                    shadowMap.renderTarget = null;
                }

                texture = shadowMap.texture;
                if (texture)
                {
                    texture.destroy();
                    shadowMap.texture = null;
                }
            }
            shadowMaps.length = 0;
        }

        if (this.blurRenderTargetLow)
        {
            this.blurRenderTargetLow.destroy();
            this.blurRenderTargetLow = null;
        }
        if (this.blurRenderTargetHigh)
        {
            this.blurRenderTargetHigh.destroy();
            this.blurRenderTargetHigh = null;
        }
        if (this.blurTextureLow)
        {
            this.blurTextureLow.destroy();
            this.blurTextureLow = null;
        }
        if (this.blurTextureHigh)
        {
            this.blurTextureHigh.destroy();
            this.blurTextureHigh = null;
        }
        if (this.depthBufferLow)
        {
            this.depthBufferLow.destroy();
            this.depthBufferLow = null;
        }
        if (this.depthBufferHigh)
        {
            this.depthBufferHigh.destroy();
            this.depthBufferHigh = null;
        }
    }

    updateBuffers(sizeLow, sizeHigh): boolean
    {
        if (this.sizeLow === sizeLow &&
            this.sizeHigh === sizeHigh)
        {
            return true;
        }
        if (!sizeLow && !sizeHigh)
        {
            sizeLow = this.sizeLow;
            sizeHigh = this.sizeHigh;
        }

        var gd = this.gd;

        this.shadowMapsHigh = [];
        this.shadowMapsLow = [];

        this.destroyBuffers();
        this.depthBufferLow = gd.createRenderBuffer({
                width: sizeLow,
                height: sizeLow,
                format: "D16"
            });

        this.depthBufferHigh = gd.createRenderBuffer({
                width: sizeHigh,
                height: sizeHigh,
                format: "D16"
            });

        this.blurTextureLow = gd.createTexture({
                name: "blur-low",
                width: sizeLow,
                height: sizeLow,
                format: "R5G6B5",
                mipmaps: false,
                renderable: true
            });

        this.blurTextureHigh = gd.createTexture({
                name: "blur-high",
                width: sizeHigh,
                height: sizeHigh,
                format: "R5G6B5",
                mipmaps: false,
                renderable: true
            });

        if (this.depthBufferLow &&
            this.depthBufferHigh &&
            this.blurTextureLow &&
            this.blurTextureHigh)
        {
            this.blurRenderTargetLow = gd.createRenderTarget({
                    colorTexture0: this.blurTextureLow
                });

            this.blurRenderTargetHigh = gd.createRenderTarget({
                    colorTexture0: this.blurTextureHigh
                });

            if (this.blurRenderTargetLow &&
                this.blurRenderTargetHigh)
            {
                this.sizeLow = sizeLow;
                this.sizeHigh = sizeHigh;
                return true;
            }
        }

        this.sizeLow = 0;
        this.sizeHigh = 0;
        this.destroyBuffers();
        return false;
    }

    findVisibleRenderables(lightInstance): boolean
    {
        var md = this.md;

        var light = lightInstance.light;
        var node = lightInstance.node;
        var matrix = node.world;
        var origin = lightInstance.lightOrigin;
        var target, up, frustumWorld, p0, p1, p2, direction;
        var halfExtents = light.halfExtents;

        var shadowMapInfo = lightInstance.shadowMapInfo;
        if (!shadowMapInfo)
        {
            shadowMapInfo = {
                camera: Camera.create(md),
                target: md.v3BuildZero()
            };
            lightInstance.shadowMapInfo = shadowMapInfo;
        }

        target = shadowMapInfo.target;
        var camera = shadowMapInfo.camera;

        if (light.spot)
        {
            frustumWorld = md.m33MulM43(light.frustum, matrix, shadowMapInfo.frustumWorld);
            md.v3Add(origin, md.m43At(frustumWorld, target), target);
            up = md.m43Up(frustumWorld, this.tempV3Up);
            shadowMapInfo.frustumWorld = frustumWorld;
            camera.parallel = false;
        }
        else
        {
            var nodeUp = md.m43Up(matrix, this.tempV3Up);
            var nodeAt = md.m43At(matrix, this.tempV3At);
            var nodePos = md.m43Pos(matrix, this.tempV3Pos);
            var abs = Math.abs;

            if (light.point)
            {
                md.v3AddScalarMul(nodePos, nodeUp, -halfExtents[1], target);
                direction = md.v3Sub(target, origin, nodePos);
                camera.parallel = false;
            }
            else // directional
            {
                direction = light.direction;

                var d0 = direction[0];
                var d1 = direction[1];
                var d2 = direction[2];

                p0 = halfExtents[0];
                p1 = halfExtents[1];
                p2 = halfExtents[2];

                var n0 = -p0;
                var n1 = -p1;
                var n2 = -p2;

                var maxDistance = ((d0 * (d0 > 0 ? p0 : n0)) + (d1 * (d1 > 0 ? p1 : n1)) + (d2 * (d2 > 0 ? p2 : n2)));
                var minDistance = ((d0 * (d0 > 0 ? n0 : p0)) + (d1 * (d1 > 0 ? n1 : p1)) + (d2 * (d2 > 0 ? n2 : p2)));

                direction = md.m43TransformVector(matrix, light.direction);
                md.v3AddScalarMul(nodePos, direction, maxDistance, target);
                origin = md.v3AddScalarMul(nodePos, direction, minDistance);

                camera.parallel = true;
            }

            if (abs(md.v3Dot(direction, nodeAt)) < abs(md.v3Dot(direction, nodeUp)))
            {
                up = nodeAt;
            }
            else
            {
                up = nodeUp;
            }
        }

        // TODO: we do this in the drawShadowMap function as well
        // could we put this on the lightInstance?
        this.lookAt(camera, target, up, origin);
        camera.updateViewMatrix();

        if (!lightInstance.lightDepth || light.dynamic)
        {
            halfExtents = light.halfExtents;
            var halfExtents0 = halfExtents[0];
            var halfExtents1 = halfExtents[1];
            var halfExtents2 = halfExtents[2];
            var lightDepth, lightViewWindowX, lightViewWindowY;
            if (light.spot)
            {
                var tan = Math.tan;
                var acos = Math.acos;
                frustumWorld = shadowMapInfo.frustumWorld;

                p0 = md.m43TransformPoint(frustumWorld, md.v3Build(-1, -1, 1));
                p1 = md.m43TransformPoint(frustumWorld, md.v3Build( 1, -1, 1));
                p2 = md.m43TransformPoint(frustumWorld, md.v3Build(-1,  1, 1));
                var p3 = md.m43TransformPoint(frustumWorld, md.v3Build( 1,  1, 1));
                var farLightCenter = md.v3Sub(md.v3ScalarMul(md.v3Add4(p0, p1, p2, p3), 0.25), origin);
                lightDepth = md.v3Length(farLightCenter);
                if (lightDepth <= 0.0)
                {
                    lightInstance.shadows = false;
                    return false;
                }
                farLightCenter = md.v3ScalarMul(farLightCenter, 1.0 / lightDepth);
                var farLightRight = md.v3Normalize(md.v3Sub(md.v3ScalarMul(md.v3Add(p0, p2), 0.5), origin));
                var farLightTop = md.v3Normalize(md.v3Sub(md.v3ScalarMul(md.v3Add(p0, p1), 0.5), origin));
                lightViewWindowX = tan(acos(md.v3Dot(farLightCenter, farLightRight)));
                lightViewWindowY = tan(acos(md.v3Dot(farLightCenter, farLightTop)));
            }
            else if (light.point)
            {
                // HACK: as we are only rendering shadowmaps for the lower half
                var lightOrigin = light.origin;
                if (lightOrigin)
                {
                    var displacedTarget = target.slice();
                    displacedTarget[0] -= lightOrigin[0];
                    displacedTarget[2] -= lightOrigin[2];
                    lightDepth = md.v3Length(md.v3Sub(displacedTarget, origin));
                    lightViewWindowX = (halfExtents0 / lightDepth);
                    lightViewWindowY = (halfExtents2 / lightDepth);
                }
                else
                {
                    lightDepth = halfExtents1;
                    lightViewWindowX = (halfExtents0 / halfExtents1);
                    lightViewWindowY = (halfExtents2 / halfExtents1);
                }
                if (lightDepth <= 0.0)
                {
                    lightInstance.shadows = false;
                    return false;
                }
                lightViewWindowX *= 3;
                lightViewWindowY *= 3;
            }
            else // directional
            {
                direction = light.direction;
                var lightUp;
                if (direction[0] < direction[2] && direction[1] < direction[2])
                {
                    lightUp = md.v3Build(0, 1, 0, this.tempV3AxisY);
                }
                else
                {
                    lightUp = md.v3Build(0, 0, 1, this.tempV3AxisY);
                }
                var xaxis = md.v3Cross(lightUp, direction, this.tempV3AxisX);
                var yaxis = md.v3Cross(direction, xaxis, this.tempV3AxisY);
                var x0 = xaxis[0];
                var x1 = xaxis[1];
                var x2 = xaxis[2];
                var y0 = yaxis[0];
                var y1 = yaxis[1];
                var y2 = yaxis[2];
                lightViewWindowX = ((x0 < 0 ? -x0 : x0) * halfExtents0 +
                                    (x1 < 0 ? -x1 : x1) * halfExtents1 +
                                    (x2 < 0 ? -x2 : x2) * halfExtents2);
                lightViewWindowY = ((y0 < 0 ? -y0 : y0) * halfExtents0 +
                                    (y1 < 0 ? -y1 : y1) * halfExtents1 +
                                    (y2 < 0 ? -y2 : y2) * halfExtents2);
                lightDepth = md.v3Length(md.v3Sub(target, origin));
            }

            lightInstance.lightViewWindowX = lightViewWindowX;
            lightInstance.lightViewWindowY = lightViewWindowY;
            lightInstance.lightDepth = lightDepth;
        }

        var distanceScale = (1.0 / 65536);
        camera.aspectRatio = 1;
        camera.nearPlane = (lightInstance.lightDepth * distanceScale);
        camera.farPlane  = (lightInstance.lightDepth + distanceScale);
        camera.recipViewWindowX = 1.0 / lightInstance.lightViewWindowX;
        camera.recipViewWindowY = 1.0 / lightInstance.lightViewWindowY;
        camera.viewOffsetX = 0.0;
        camera.viewOffsetY = 0.0;
        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();
        camera.updateFrustumPlanes();

        var numStaticOverlappingRenderables = lightInstance.numStaticOverlappingRenderables;
        var overlappingRenderables = lightInstance.overlappingRenderables;
        var numOverlappingRenderables = overlappingRenderables.length;
        var staticNodesChangeCounter = lightInstance.staticNodesChangeCounter;

        var occludersDrawArray = lightInstance.occludersDrawArray;
        if (!occludersDrawArray)
        {
            occludersDrawArray = new Array(numOverlappingRenderables);
            lightInstance.occludersDrawArray = occludersDrawArray;

            // Initialize some properties required on the light instance
            lightInstance.minLightDistance = 0;
            lightInstance.maxLightDistance = 0;
            lightInstance.minLightDistanceX = 0;
            lightInstance.maxLightDistanceX = 0;
            lightInstance.minLightDistanceY = 0;
            lightInstance.maxLightDistanceY = 0;

            lightInstance.shadowMap = null;
            lightInstance.shadows = false;
        }

        if (node.dynamic ||
            numStaticOverlappingRenderables !== numOverlappingRenderables ||
            shadowMapInfo.staticNodesChangeCounter !== staticNodesChangeCounter)
        {
            var occludersExtents = this.occludersExtents;
            var numOccluders = this._filterOccluders(overlappingRenderables,
                                                     numStaticOverlappingRenderables,
                                                     occludersDrawArray,
                                                     occludersExtents);
            numOccluders = this._updateOccludersLimits(lightInstance,
                                                       camera.viewMatrix,
                                                       camera.frustumPlanes,
                                                       occludersDrawArray,
                                                       occludersExtents,
                                                       numOccluders);
            occludersDrawArray.length = numOccluders;
            shadowMapInfo.staticNodesChangeCounter = staticNodesChangeCounter;

            if (1 < numOccluders)
            {
                occludersDrawArray.sort(this._sortNegative);
            }
        }

        return (0 < occludersDrawArray.length);
    }

    private _sortNegative(a, b)
    {
        return (a.sortKey - b.sortKey);
    }

    private _adjustCameraPosition(camera: Camera,
                                  minWindowX: number,
                                  maxWindowX: number,
                                  minWindowY: number,
                                  maxWindowY: number): void
    {
        var matrix = camera.matrix;
        var r0 = -matrix[0];
        var r1 = -matrix[1];
        var r2 = -matrix[2];

        var u0 = -matrix[3];
        var u1 = -matrix[4];
        var u2 = -matrix[5];

        var ox = (minWindowX + maxWindowX) / 2.0;
        var oy = (minWindowY + maxWindowY) / 2.0;
        var origin0 = ox * r0 + oy * u0;
        var origin1 = ox * r1 + oy * u1;
        var origin2 = ox * r2 + oy * u2;

        matrix[9]  += origin0;
        matrix[10] += origin1;
        matrix[11] += origin2;

        camera.updateViewMatrix();
    }

    drawShadowMap(cameraMatrix, minExtentsHigh, lightInstance)
    {
        var md = this.md;
        var gd = this.gd;
        var node = lightInstance.node;
        var light = lightInstance.light;

        var shadowMapInfo = lightInstance.shadowMapInfo;
        var camera = shadowMapInfo.camera;
        var origin = lightInstance.lightOrigin;

        var halfExtents = light.halfExtents;
        var halfExtents0 = halfExtents[0];
        var halfExtents1 = halfExtents[1];
        var halfExtents2 = halfExtents[2];
        var lightOrigin;

        lightInstance.shadows = false;

        var occludersDrawArray = lightInstance.occludersDrawArray;
        var numOccluders;
        if (occludersDrawArray)
        {
            numOccluders = occludersDrawArray.length;
            if (!numOccluders)
            {
                return;
            }
        }
        else
        {
            return;
        }

        var numStaticOverlappingRenderables = lightInstance.numStaticOverlappingRenderables;
        var numOverlappingRenderables = lightInstance.overlappingRenderables.length;

        var maxExtentSize = Math.max(halfExtents0, halfExtents1, halfExtents2);
        var shadowMap, shadowMapTexture, shadowMapRenderTarget, shadowMapSize;
        if (maxExtentSize >= minExtentsHigh)
        {
            shadowMapSize = this.sizeHigh;
            var shadowMapsHighIndex = this.highIndex;
            if (shadowMapsHighIndex < this.shadowMapsHigh.length)
            {
                shadowMap = this.shadowMapsHigh[shadowMapsHighIndex];
                shadowMapTexture = shadowMap.texture;
                shadowMapRenderTarget = shadowMap.renderTarget;
            }
            else
            {
                shadowMapTexture = gd.createTexture({
                        name: "shadowmap-high",
                        width: shadowMapSize,
                        height: shadowMapSize,
                        format: "R5G6B5",
                        mipmaps: false,
                        renderable: true
                    });
                if (shadowMapTexture)
                {
                    shadowMapRenderTarget = gd.createRenderTarget({
                            colorTexture0: shadowMapTexture,
                            depthBuffer: this.depthBufferHigh
                        });
                    if (!shadowMapRenderTarget)
                    {
                        shadowMapTexture = null;
                        return;
                    }
                    else
                    {
                        shadowMap = {
                            texture: shadowMapTexture,
                            renderTarget: shadowMapRenderTarget,
                            lightInstance: lightInstance
                        };
                        this.shadowMapsHigh[shadowMapsHighIndex] = shadowMap;
                    }
                }
                else
                {
                    return;
                }
            }

            this.highIndex = (shadowMapsHighIndex + 1);
        }
        else
        {
            shadowMapSize = this.sizeLow;
            var shadowMapsLowIndex = this.lowIndex;
            if (shadowMapsLowIndex < this.shadowMapsLow.length)
            {
                shadowMap = this.shadowMapsLow[shadowMapsLowIndex];
                shadowMapTexture = shadowMap.texture;
                shadowMapRenderTarget = shadowMap.renderTarget;
            }
            else
            {
                shadowMapTexture = gd.createTexture({
                        name: "shadowmap-low",
                        width: shadowMapSize,
                        height: shadowMapSize,
                        format: "R5G6B5",
                        mipmaps: false,
                        renderable: true
                    });
                if (shadowMapTexture)
                {
                    shadowMapRenderTarget = gd.createRenderTarget({
                            colorTexture0: shadowMapTexture,
                            depthBuffer: this.depthBufferLow
                        });
                    if (!shadowMapRenderTarget)
                    {
                        shadowMapTexture = null;
                        return;
                    }
                    else
                    {
                        shadowMap = {
                            texture: shadowMapTexture,
                            renderTarget: shadowMapRenderTarget,
                            lightInstance: lightInstance
                        };
                        this.shadowMapsLow[shadowMapsLowIndex] = shadowMap;
                    }
                }
                else
                {
                    return;
                }
            }

            this.lowIndex = (shadowMapsLowIndex + 1);
        }

        lightInstance.shadowMap = shadowMap;
        lightInstance.shadows = true;

        var distanceScale = (1.0 / 65536);
        // Need padding to avoid culling near objects
        var minLightDistance = (lightInstance.minLightDistance - distanceScale);
        // Need padding to avoid encoding singularity at far plane
        var maxLightDistance = (lightInstance.maxLightDistance + distanceScale);

        var lightViewWindowX = lightInstance.lightViewWindowX;
        var lightViewWindowY = lightInstance.lightViewWindowY;
        var lightDepth = lightInstance.lightDepth;

        var lightViewOffsetX = 0;
        var lightViewOffsetY = 0;

        if (0 < minLightDistance)
        {
            var borderPadding = ((this.blurEnabled ? 3 : 1) / shadowMapSize);
            var minLightDistanceX = lightInstance.minLightDistanceX;
            var maxLightDistanceX = lightInstance.maxLightDistanceX;
            var minLightDistanceY = lightInstance.minLightDistanceY;
            var maxLightDistanceY = lightInstance.maxLightDistanceY;
            var minimalViewWindowX, minimalViewWindowY;
            if (light.directional)
            {
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
                this._adjustCameraPosition(camera,
                                           minLightDistanceX,
                                           maxLightDistanceX,
                                           minLightDistanceY,
                                           maxLightDistanceY);
                minimalViewWindowX = (maxLightDistanceX - minLightDistanceX) / 2.0;
                minimalViewWindowX += 2 * borderPadding * minimalViewWindowX;
                minimalViewWindowY = (maxLightDistanceY - minLightDistanceY) / 2.0;
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
            else
            {
                var endLightDistance = (lightDepth < maxLightDistance ? lightDepth : maxLightDistance);
                lightOrigin = light.origin;
                if (lightOrigin)
                {
                    var displacedExtent0 = (halfExtents0 + Math.abs(origin[0]));
                    var displacedExtent2 = (halfExtents2 + Math.abs(origin[2]));
                    if (minLightDistanceX < -displacedExtent0)
                    {
                        minLightDistanceX = -displacedExtent0;
                    }
                    if (maxLightDistanceX > displacedExtent0)
                    {
                        maxLightDistanceX = displacedExtent0;
                    }
                    if (minLightDistanceY < -displacedExtent2)
                    {
                        minLightDistanceY = -displacedExtent2;
                    }
                    if (maxLightDistanceY > displacedExtent2)
                    {
                        maxLightDistanceY = displacedExtent2;
                    }
                }
                else
                {
                    if (minLightDistanceX < -halfExtents0)
                    {
                        minLightDistanceX = -halfExtents0;
                    }
                    if (maxLightDistanceX > halfExtents0)
                    {
                        maxLightDistanceX = halfExtents0;
                    }
                    if (minLightDistanceY < -halfExtents2)
                    {
                        minLightDistanceY = -halfExtents2;
                    }
                    if (maxLightDistanceY > halfExtents2)
                    {
                        maxLightDistanceY = halfExtents2;
                    }
                }
                minLightDistanceX /= (minLightDistanceX <= 0 ? minLightDistance : endLightDistance);
                maxLightDistanceX /= (maxLightDistanceX >= 0 ? minLightDistance : endLightDistance);
                minLightDistanceY /= (minLightDistanceY <= 0 ? minLightDistance : endLightDistance);
                maxLightDistanceY /= (maxLightDistanceY >= 0 ? minLightDistance : endLightDistance);
                minimalViewWindowX = ((0.5 * (maxLightDistanceX - minLightDistanceX)) + borderPadding);
                minimalViewWindowY = ((0.5 * (maxLightDistanceY - minLightDistanceY)) + borderPadding);
                if (lightViewWindowX > minimalViewWindowX)
                {
                    lightViewWindowX = minimalViewWindowX;
                    lightViewOffsetX = (minimalViewWindowX + minLightDistanceX - borderPadding);
                }
                if (lightViewWindowY > minimalViewWindowY)
                {
                    lightViewWindowY = minimalViewWindowY;
                    lightViewOffsetY = (minimalViewWindowY + minLightDistanceY - borderPadding);
                }
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
        var viewMatrix = camera.viewMatrix;
        var shadowProjection = camera.viewProjectionMatrix;

        var maxDepthReciprocal = (1.0 / (maxLightDistance - minLightDistance));
        var techniqueParameters = lightInstance.techniqueParameters;
        techniqueParameters.shadowProjection = md.m43MulM44(cameraMatrix,
                                                            shadowProjection,
                                                            techniqueParameters.shadowProjection);
        var viewToShadowMatrix = md.m43Mul(cameraMatrix, viewMatrix, this.tempMatrix43);
        techniqueParameters.shadowDepth = md.v4Build(-viewToShadowMatrix[2] * maxDepthReciprocal,
                                                     -viewToShadowMatrix[5] * maxDepthReciprocal,
                                                     -viewToShadowMatrix[8] * maxDepthReciprocal,
                                                     (-viewToShadowMatrix[11] - minLightDistance) * maxDepthReciprocal,
                                                     techniqueParameters.shadowDepth);
        techniqueParameters.shadowSize = shadowMapSize;
        techniqueParameters.shadowMapTexture = shadowMapTexture;

        var frameUpdated = lightInstance.frameVisible;

        if (numStaticOverlappingRenderables === numOverlappingRenderables &&
            !node.dynamic) // No dynamic renderables
        {
            if (shadowMap.numRenderables === numOccluders &&
                shadowMap.lightNode === node &&
                (shadowMap.frameUpdated + 1) === frameUpdated)
            {
                // No need to update shadowmap
                //Utilities.log(numOccluders);
                shadowMap.frameUpdated = frameUpdated;
                shadowMap.needsBlur = false;
                return;
            }
            else
            {
                shadowMap.numRenderables = numOccluders;
                shadowMap.lightNode = node;
                shadowMap.frameUpdated = frameUpdated;
                shadowMap.frameVisible = frameUpdated;
                shadowMap.needsBlur = this.blurEnabled;
            }
        }
        else
        {
            shadowMap.numRenderables = numOccluders;
            shadowMap.frameVisible = frameUpdated;
            shadowMap.needsBlur = this.blurEnabled;
        }

        if (!gd.beginRenderTarget(shadowMapRenderTarget))
        {
            return;
        }

        gd.clear(this.clearColor, 1.0, 0);

        /* tslint:disable:no-string-literal */
        var shadowMapTechniqueParameters = this.techniqueParameters;
        shadowMapTechniqueParameters['viewTranspose'] = md.m43Transpose(viewMatrix,
                                                        shadowMapTechniqueParameters['viewTranspose']);
        shadowMapTechniqueParameters['shadowProjectionTranspose'] = md.m44Transpose(camera.projectionMatrix,
                                                            shadowMapTechniqueParameters['shadowProjectionTranspose']);
        shadowMapTechniqueParameters['shadowDepth'] =
            md.v4Build(0, 0, -maxDepthReciprocal,
                       -minLightDistance * maxDepthReciprocal,
                       shadowMapTechniqueParameters['shadowDepth']);
        /* tslint:enable:no-string-literal */

        gd.drawArray(occludersDrawArray, [shadowMapTechniqueParameters], 0);

        gd.endRenderTarget();
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

    private _updateOccludersLimits(lightInstance: any,
                                   viewMatrix: any,
                                   frustumPlanes: any[],
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

        var numPlanes = frustumPlanes.length;

        var minLightDistance = Number.MAX_VALUE;
        var maxLightDistance = -minLightDistance;
        var minLightDistanceX = minLightDistance;
        var maxLightDistanceX = -minLightDistance;
        var minLightDistanceY = minLightDistance;
        var maxLightDistanceY = -minLightDistance;

        var abs = Math.abs;
        var n, extents, n0, n1, n2, p0, p1, p2, p, lightDistance;

        for (n = 0; n < numOccluders; )
        {
            extents = occludersExtents[n];
            n0 = extents[0];
            n1 = extents[1];
            n2 = extents[2];
            p0 = extents[3];
            p1 = extents[4];
            p2 = extents[5];

            p = 0;
            do
            {
                var plane = frustumPlanes[p];
                var f0 = plane[0];
                var f1 = plane[1];
                var f2 = plane[2];
                var maxDistance = (f0 * (f0 < 0 ? n0 : p0) +
                                   f1 * (f1 < 0 ? n1 : p1) +
                                   f2 * (f2 < 0 ? n2 : p2) -
                                   plane[3]);
                if (maxDistance < 0.0)
                {
                    break;
                }
                else
                {
                    // Clamp extents to the part that is inside the plane
                    if (maxDistance < abs(f0) * (p0 - n0))
                    {
                        if (f0 < 0)
                        {
                            p0 = n0 - (maxDistance / f0);
                        }
                        else
                        {
                            n0 = p0 - (maxDistance / f0);
                        }
                    }
                    if (maxDistance < abs(f1) * (p1 - n1))
                    {
                        if (f1 < 0)
                        {
                            p1 = n1 - (maxDistance / f1);
                        }
                        else
                        {
                            n1 = p1 - (maxDistance / f1);
                        }
                    }
                    if (maxDistance < abs(f2) * (p2 - n2))
                    {
                        if (f2 < 0)
                        {
                            p2 = n2 - (maxDistance / f2);
                        }
                        else
                        {
                            n2 = p2 - (maxDistance / f2);
                        }
                    }
                }

                p += 1;
            }
            while (p < numPlanes);

            if (p >= numPlanes)
            {
                lightDistance = ((d0 * (d0 > 0 ? p0 : n0)) +
                                 (d1 * (d1 > 0 ? p1 : n1)) +
                                 (d2 * (d2 > 0 ? p2 : n2)) -
                                 offset);
                if (maxLightDistance < lightDistance)
                {
                    maxLightDistance = lightDistance;
                }

                if (0 < minLightDistance)
                {
                    lightDistance = ((d0 * (d0 > 0 ? n0 : p0)) +
                                     (d1 * (d1 > 0 ? n1 : p1)) +
                                     (d2 * (d2 > 0 ? n2 : p2)) -
                                     offset);
                    if (lightDistance < minLightDistance)
                    {
                        minLightDistance = lightDistance;
                        if (0 >= lightDistance)
                        {
                            n += 1;
                            continue;
                        }
                    }

                    lightDistance = ((r0 * (r0 > 0 ? n0 : p0)) +
                                     (r1 * (r1 > 0 ? n1 : p1)) +
                                     (r2 * (r2 > 0 ? n2 : p2)) -
                                     roffset);
                    if (lightDistance < minLightDistanceX)
                    {
                        minLightDistanceX = lightDistance;
                    }

                    lightDistance = ((r0 * (r0 > 0 ? p0 : n0)) +
                                     (r1 * (r1 > 0 ? p1 : n1)) +
                                     (r2 * (r2 > 0 ? p2 : n2)) -
                                     roffset);
                    if (maxLightDistanceX < lightDistance)
                    {
                        maxLightDistanceX = lightDistance;
                    }

                    lightDistance = ((u0 * (u0 > 0 ? n0 : p0)) +
                                     (u1 * (u1 > 0 ? n1 : p1)) +
                                     (u2 * (u2 > 0 ? n2 : p2)) -
                                     uoffset);
                    if (lightDistance < minLightDistanceY)
                    {
                        minLightDistanceY = lightDistance;
                    }

                    lightDistance = ((u0 * (u0 > 0 ? p0 : n0)) +
                                     (u1 * (u1 > 0 ? p1 : n1)) +
                                     (u2 * (u2 > 0 ? p2 : n2)) -
                                     uoffset);
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

        if (maxLightDistance > lightInstance.lightDepth)
        {
            maxLightDistance = lightInstance.lightDepth;
        }

        lightInstance.minLightDistance = minLightDistance;
        lightInstance.maxLightDistance = maxLightDistance;
        lightInstance.minLightDistanceX = minLightDistanceX;
        lightInstance.maxLightDistanceX = maxLightDistanceX;
        lightInstance.minLightDistanceY = minLightDistanceY;
        lightInstance.maxLightDistanceY = maxLightDistanceY;

        return numOccluders;
    }

    blurShadowMaps()
    {
        var gd = this.gd;
        var numShadowMaps, n, shadowMaps, shadowMap, shadowMapBlurTexture, shadowMapBlurRenderTarget;

        gd.setStream(this.quadVertexBuffer, this.quadSemantics);

        var shadowMappingBlurTechnique = this.blurTechnique;
        gd.setTechnique(shadowMappingBlurTechnique);

        var quadPrimitive = this.quadPrimitive;

        var pixelOffsetH = this.pixelOffsetH;
        var pixelOffsetV = this.pixelOffsetV;

        numShadowMaps = this.highIndex;
        if (numShadowMaps)
        {
            shadowMaps = this.shadowMapsHigh;
            shadowMapBlurTexture = this.blurTextureHigh;
            shadowMapBlurRenderTarget = this.blurRenderTargetHigh;
            pixelOffsetV[1] = pixelOffsetH[0] = (1.0 / this.sizeHigh);
            for (n = 0; n < numShadowMaps; n += 1)
            {
                shadowMap = shadowMaps[n];
                if (shadowMap.needsBlur)
                {
                    // Horizontal
                    if (!gd.beginRenderTarget(shadowMapBlurRenderTarget))
                    {
                        break;
                    }

                    /* tslint:disable:no-string-literal */
                    shadowMappingBlurTechnique['shadowMap'] = shadowMap.texture;
                    shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetH;
                    /* tslint:enable:no-string-literal */
                    gd.draw(quadPrimitive, 4);

                    gd.endRenderTarget();

                    // Vertical
                    if (!gd.beginRenderTarget(shadowMap.renderTarget))
                    {
                        break;
                    }

                    /* tslint:disable:no-string-literal */
                    shadowMappingBlurTechnique['shadowMap'] = shadowMapBlurTexture;
                    shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetV;
                    /* tslint:enable:no-string-literal */
                    gd.draw(quadPrimitive, 4);

                    gd.endRenderTarget();
                }
            }
        }

        numShadowMaps = this.lowIndex;
        if (numShadowMaps)
        {
            shadowMaps = this.shadowMapsLow;
            shadowMapBlurTexture = this.blurTextureLow;
            shadowMapBlurRenderTarget = this.blurRenderTargetLow;
            pixelOffsetV[1] = pixelOffsetH[0] = (1.0 / this.sizeLow);
            for (n = 0; n < numShadowMaps; n += 1)
            {
                shadowMap = shadowMaps[n];
                if (shadowMap.needsBlur)
                {
                    // Horizontal
                    if (!gd.beginRenderTarget(shadowMapBlurRenderTarget))
                    {
                        break;
                    }

                    /* tslint:disable:no-string-literal */
                    shadowMappingBlurTechnique['shadowMap'] = shadowMap.texture;
                    shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetH;
                    /* tslint:enable:no-string-literal */
                    gd.draw(quadPrimitive, 4);

                    gd.endRenderTarget();

                    // Vertical
                    if (!gd.beginRenderTarget(shadowMap.renderTarget))
                    {
                        break;
                    }

                    /* tslint:disable:no-string-literal */
                    shadowMappingBlurTechnique['shadowMap'] = shadowMapBlurTexture;
                    shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetV;
                    /* tslint:enable:no-string-literal */
                    gd.draw(quadPrimitive, 4);

                    gd.endRenderTarget();
                }
            }
        }
    }

    lookAt(camera, lookAt, up, eyePosition)
    {
        var md = this.md;
        var zaxis = md.v3Sub(eyePosition, lookAt, this.tempV3AxisZ);
        md.v3Normalize(zaxis, zaxis);
        var xaxis = md.v3Cross(md.v3Normalize(up, up), zaxis, this.tempV3AxisX);
        md.v3Normalize(xaxis, xaxis);
        var yaxis = md.v3Cross(zaxis, xaxis, this.tempV3AxisY);
        camera.matrix = md.m43Build(xaxis, yaxis, zaxis, eyePosition, camera.matrix);
    }

    destroy()
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

        delete this.shadowMapsLow;
        delete this.shadowMapsHigh;
        delete this.techniqueParameters;
        delete this.occludersExtents;
        delete this.md;
        delete this.gd;
    }

    // Constructor function
    static create(gd, md, shaderManager, effectsManager, sizeLow,
                  sizeHigh): ShadowMapping
    {
        var shadowMapping = new ShadowMapping();

        shaderManager.load("shaders/shadowmapping.cgfx");

        shadowMapping.gd = gd;
        shadowMapping.md = md;
        shadowMapping.clearColor = md.v4Build(1, 1, 1, 1);
        shadowMapping.tempMatrix43 = md.m43BuildIdentity();
        shadowMapping.tempV3Up = md.v3BuildZero();
        shadowMapping.tempV3At = md.v3BuildZero();
        shadowMapping.tempV3Pos = md.v3BuildZero();
        shadowMapping.tempV3AxisX = md.v3BuildZero();
        shadowMapping.tempV3AxisY = md.v3BuildZero();
        shadowMapping.tempV3AxisZ = md.v3BuildZero();

        shadowMapping.quadPrimitive = gd.PRIMITIVE_TRIANGLE_STRIP;
        shadowMapping.quadSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0']);

        shadowMapping.quadVertexBuffer = gd.createVertexBuffer({
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

        shadowMapping.pixelOffsetH = [0, 0];
        shadowMapping.pixelOffsetV = [0, 0];

        shadowMapping.bufferWidth = 0;
        shadowMapping.bufferHeight = 0;

        shadowMapping.techniqueParameters = gd.createTechniqueParameters();
        shadowMapping.shader = null;
        shadowMapping.shadowMapsLow = [];
        shadowMapping.shadowMapsHigh = [];

        sizeLow = sizeLow || shadowMapping.defaultSizeLow;
        sizeHigh = sizeHigh || shadowMapping.defaultSizeHigh;
        shadowMapping.updateBuffers(sizeLow, sizeHigh);

        shadowMapping.occludersExtents = [];

        var precision = gd.maxSupported("FRAGMENT_SHADER_PRECISION");
        if (precision && // Just in case the query is not supported
            precision < 16)
        {
            shadowMapping.blurEnabled = false;
        }

        return shadowMapping;
    }
}
