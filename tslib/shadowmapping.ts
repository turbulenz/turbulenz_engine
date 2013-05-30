// Copyright (c) 2010-2012 Turbulenz Limited

//
// ShadowMapping
//
/*global renderingCommonCreateRendererInfoFn: false, Camera: false*/

/// <reference path="scene.ts" />
/// <reference path="renderingcommon.ts" />

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
    static version = 1;

    defaultSizeLow = 512;
    defaultSizeHigh = 1024;

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

    drawQueue            : DrawParameters[];

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
    };

    update()
    {
        this.shadowTechniqueParameters['world'] = this.node.world;
    };

    skinnedUpdate()
    {
        var techniqueParameters = this.shadowTechniqueParameters;
        techniqueParameters['world'] = this.node.world;

        var skinController = this.skinController;
        if (skinController)
        {
            techniqueParameters['skinBones'] = skinController.output;
            skinController.update();
        }
    };

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
    };

    updateBuffers(sizeLow, sizeHigh): bool
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
                width: sizeLow,
                height: sizeLow,
                format: "R5G6B5",
                mipmaps: false,
                renderable: true
            });

        this.blurTextureHigh = gd.createTexture({
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
    };

    findVisibleRenderables(lightInstance)
    {
        var md = this.md;

        var light = lightInstance.light;
        var node = lightInstance.node;
        var matrix = node.world;
        var shadowRenderables = lightInstance.shadowRenderables;
        var origin = lightInstance.lightOrigin;
        var target, up, frustumWorld;
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
            var direction;

            if (light.point)
            {
                md.v3AddScalarMul(nodePos, nodeUp, -halfExtents[1], target);
                direction = md.v3Sub(target, origin, nodePos);
                camera.parallel = false;
            }
            else // directional
            {
                direction = md.m43TransformVector(matrix, light.direction);
                var lightSize = md.v3Length(halfExtents);
                md.v3AddScalarMul(nodePos, direction, lightSize, target);
                origin = md.v3AddScalarMul(nodePos, direction, -lightSize);
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
        var viewMatrix = camera.viewMatrix;

        if (!shadowRenderables)
        {
            shadowRenderables = [];
            lightInstance.shadowRenderables = shadowRenderables;
        }
        var numShadowRenderables = shadowRenderables.length;

        var numStaticOverlappingRenderables = lightInstance.numStaticOverlappingRenderables;
        var numOverlappingRenderables = lightInstance.overlappingRenderables.length;
        var staticNodesChangeCounter = lightInstance.staticNodesChangeCounter;

        if (node.dynamic ||
            numStaticOverlappingRenderables !== numOverlappingRenderables ||
            shadowMapInfo.staticNodesChangeCounter !== staticNodesChangeCounter)
        {
            numShadowRenderables = this.cullShadowRenderables(lightInstance, viewMatrix, shadowRenderables);
            shadowRenderables.length = numShadowRenderables;
            shadowMapInfo.staticNodesChangeCounter = staticNodesChangeCounter;
        }
    };

    drawShadowMap(cameraMatrix, minExtentsHigh, lightInstance)
    {
        var md = this.md;
        var gd = this.gd;
        var node = lightInstance.node;
        var light = lightInstance.light;

        var shadowMapInfo = lightInstance.shadowMapInfo;
        var camera = shadowMapInfo.camera;
        var viewMatrix = camera.viewMatrix;
        var origin = lightInstance.lightOrigin;

        var halfExtents = light.halfExtents;
        var halfExtents0 = halfExtents[0];
        var halfExtents1 = halfExtents[1];
        var halfExtents2 = halfExtents[2];
        var lightOrigin;

        var shadowRenderables = lightInstance.shadowRenderables;
        var numShadowRenderables;
        if (shadowRenderables)
        {
            numShadowRenderables = shadowRenderables.length;
            if (!numShadowRenderables)
            {
                lightInstance.shadows = false;
                return;
            }
        }
        else
        {
            lightInstance.shadows = false;
            return;
        }

        var numStaticOverlappingRenderables = lightInstance.numStaticOverlappingRenderables;
        var numOverlappingRenderables = lightInstance.overlappingRenderables.length;
        numShadowRenderables = lightInstance.numShadowRenderables;

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

        lightInstance.shadowMap = null;
        lightInstance.shadows = true;

        var distanceScale = (1.0 / 65536);
        var minLightDistance = (lightInstance.minLightDistance - distanceScale); // Need padding to avoid culling near objects
        var maxLightDistance = (lightInstance.maxLightDistance + distanceScale); // Need padding to avoid encoding singularity at far plane

        var lightViewWindowX, lightViewWindowY, lightDepth;
        lightViewWindowX = lightInstance.lightViewWindowX;
        lightViewWindowY = lightInstance.lightViewWindowY;
        lightDepth = lightInstance.lightDepth;
        if (!lightDepth || light.dynamic)
        {
            if (light.spot)
            {
                var tan = Math.tan;
                var acos = Math.acos;
                var frustumWorld = shadowMapInfo.frustumWorld;

                var p0 = md.m43TransformPoint(frustumWorld, md.v3Build(-1, -1, 1));
                var p1 = md.m43TransformPoint(frustumWorld, md.v3Build( 1, -1, 1));
                var p2 = md.m43TransformPoint(frustumWorld, md.v3Build(-1,  1, 1));
                var p3 = md.m43TransformPoint(frustumWorld, md.v3Build( 1,  1, 1));
                var farLightCenter = md.v3Sub(md.v3ScalarMul(md.v3Add4(p0, p1, p2, p3), 0.25), origin);
                lightDepth = md.v3Length(farLightCenter);
                if (lightDepth <= 0.0)
                {
                    lightInstance.shadows = false;
                    return;
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
                lightOrigin = light.origin;
                if (lightOrigin)
                {
                    var target = shadowMapInfo.target;
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
                    return;
                }
                lightViewWindowX *= 3;
                lightViewWindowY *= 3;
            }
            else // directional
            {
                var m0 = viewMatrix[0];
                var m1 = viewMatrix[1];
                var m3 = viewMatrix[3];
                var m4 = viewMatrix[4];
                var m6 = viewMatrix[6];
                var m7 = viewMatrix[7];
                lightViewWindowX = ((m0 < 0 ? -m0 : m0) * halfExtents0 + (m3 < 0 ? -m3 : m3) * halfExtents1 + (m6 < 0 ? -m6 : m6) * halfExtents2);
                lightViewWindowY = ((m1 < 0 ? -m1 : m1) * halfExtents0 + (m4 < 0 ? -m4 : m4) * halfExtents1 + (m7 < 0 ? -m7 : m7) * halfExtents2);
                lightDepth = 2 * Math.sqrt((halfExtents0 * halfExtents0) + (halfExtents1 * halfExtents1) + (halfExtents2 * halfExtents2));
            }

            lightInstance.lightViewWindowX = lightViewWindowX;
            lightInstance.lightViewWindowY = lightViewWindowY;
            lightInstance.lightDepth = lightDepth;
        }

        lightInstance.shadowMap = shadowMap;

        var lightViewOffsetX = 0;
        var lightViewOffsetY = 0;

        if (0 < minLightDistance)
        {
            var borderPadding = (3 / shadowMapSize);
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
        var shadowProjection = camera.viewProjectionMatrix;

        var maxDepthReciprocal = (1.0 / (maxLightDistance - minLightDistance));
        var techniqueParameters = lightInstance.techniqueParameters;
        techniqueParameters.shadowProjection = md.m43MulM44(cameraMatrix, shadowProjection, techniqueParameters.shadowProjection);
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
            if (shadowMap.numRenderables === numShadowRenderables &&
                shadowMap.lightNode === node &&
                (shadowMap.frameUpdated + 1) === frameUpdated)
            {
                // No need to update shadowmap
                //Utilities.log(numShadowRenderables);
                shadowMap.frameUpdated = frameUpdated;
                shadowMap.needsBlur = false;
                return;
            }
            else
            {
                shadowMap.numRenderables = numShadowRenderables;
                shadowMap.lightNode = node;
                shadowMap.frameUpdated = frameUpdated;
                shadowMap.frameVisible = frameUpdated;
                shadowMap.needsBlur = true;
            }
        }
        else
        {
            shadowMap.numRenderables = numShadowRenderables;
            shadowMap.frameVisible = frameUpdated;
            shadowMap.needsBlur = true;
        }

        if (!gd.beginRenderTarget(shadowMapRenderTarget))
        {
            return;
        }

        gd.clear(this.clearColor, 1.0, 0);

        var shadowMapTechniqueParameters = this.techniqueParameters;
        var renderable, rendererInfo;
/*
        var d0 = -viewMatrix[2];
        var d1 = -viewMatrix[5];
        var d2 = -viewMatrix[8];
        var offset = -viewMatrix[11];
*/
        var drawParametersArray, numDrawParameters, drawParametersIndex;
        shadowMapTechniqueParameters['viewTranspose'] = md.m43Transpose(viewMatrix,
                                                        shadowMapTechniqueParameters['viewTranspose']);
        shadowMapTechniqueParameters['shadowProjectionTranspose'] = md.m44Transpose(camera.projectionMatrix,
                                                            shadowMapTechniqueParameters['shadowProjectionTranspose']);
        shadowMapTechniqueParameters['shadowDepth'] =
            md.v4Build(0, 0, -maxDepthReciprocal,
                       -minLightDistance * maxDepthReciprocal,
                       shadowMapTechniqueParameters['shadowDepth']);

        var drawQueue = this.drawQueue;
        var drawQueueLength = 0;
        var n;

        for (n = 0; n < numShadowRenderables; n += 1)
        {
            renderable = shadowRenderables[n];
            rendererInfo = renderable.rendererInfo;
            if (!rendererInfo)
            {
                rendererInfo = renderingCommonCreateRendererInfoFn(renderable);
            }

            if (rendererInfo.far)
            {
                renderable.distance = 1.e38;
            }

            if (rendererInfo.shadowMappingUpdate && renderable.shadowMappingDrawParameters)
            {
                rendererInfo.shadowMappingUpdate.call(renderable);

                drawParametersArray = renderable.shadowMappingDrawParameters;
                numDrawParameters = drawParametersArray.length;
                for (drawParametersIndex = 0; drawParametersIndex < numDrawParameters; drawParametersIndex += 1)
                {
                    drawQueue[drawQueueLength] = drawParametersArray[drawParametersIndex];
                    drawQueueLength += 1;
                }
            }
        }

        if (drawQueue.length > drawQueueLength)
        {
            drawQueue.length = drawQueueLength;
        }

        gd.drawArray(drawQueue, [shadowMapTechniqueParameters], 1);

        gd.endRenderTarget();
    };

    cullShadowRenderables(lightInstance,
                                                                         viewMatrix,
                                                                         shadowRenderables)
    {
        var numStaticOverlappingRenderables = lightInstance.numStaticOverlappingRenderables;
        var overlappingRenderables = lightInstance.overlappingRenderables;
        var numOverlappingRenderables = overlappingRenderables.length;

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

        var numShadowRenderables = 0;
        var minLightDistance = Number.MAX_VALUE;
        var maxLightDistance = -minLightDistance;
        var minLightDistanceX = minLightDistance;
        var maxLightDistanceX = -minLightDistance;
        var minLightDistanceY = minLightDistance;
        var maxLightDistanceY = -minLightDistance;

        var n, renderable, extents, n0, n1, n2, p0, p1, p2, lightDistance;

        // Do dynamic first because they are likely to cast shadows into static ones
        n = (numOverlappingRenderables - 1);
        for (; n >= numStaticOverlappingRenderables; n -= 1)
        {
            renderable = overlappingRenderables[n];
            if (!(renderable.disabled || renderable.node.disabled || renderable.sharedMaterial.meta.noshadows))
            {
                extents = renderable.getWorldExtents();
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

                    shadowRenderables[numShadowRenderables] = renderable;
                    numShadowRenderables += 1;

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
                }
            }
        }

        for (; n >= 0; n -= 1)
        {
            renderable = overlappingRenderables[n];
            if (!(renderable.disabled || renderable.node.disabled || renderable.sharedMaterial.meta.noshadows))
            {
                extents = renderable.worldExtents; // We can use the property directly because as it is static it should not change
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

                    shadowRenderables[numShadowRenderables] = renderable;
                    numShadowRenderables += 1;

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
                }
            }
        }

        if (minLightDistance < 0)
        {
            minLightDistance = 0;
        }

        lightInstance.numShadowRenderables = numShadowRenderables;
        lightInstance.minLightDistance = minLightDistance;
        lightInstance.maxLightDistance = maxLightDistance;
        lightInstance.minLightDistanceX = minLightDistanceX;
        lightInstance.maxLightDistanceX = maxLightDistanceX;
        lightInstance.minLightDistanceY = minLightDistanceY;
        lightInstance.maxLightDistanceY = maxLightDistanceY;

        return numShadowRenderables;
    };

    blurShadowMaps()
    {
        var gd = this.gd;
        var numShadowMaps, n, shadowMaps, shadowMap, shadowMapBlurTexture, shadowMapBlurRenderTarget;
        var shadowMapSize, pixelOffsetH, pixelOffsetV;

        gd.setStream(this.quadVertexBuffer, this.quadSemantics);

        var shadowMappingBlurTechnique = this.blurTechnique;
        gd.setTechnique(shadowMappingBlurTechnique);

        var quadPrimitive = this.quadPrimitive;

        numShadowMaps = this.highIndex;
        if (numShadowMaps)
        {
            shadowMaps = this.shadowMapsHigh;
            shadowMapBlurTexture = this.blurTextureHigh;
            shadowMapBlurRenderTarget = this.blurRenderTargetHigh;
            shadowMapSize = this.sizeHigh;
            pixelOffsetH = [(1.0 / shadowMapSize), 0];
            pixelOffsetV = [0, (1.0 / shadowMapSize)];
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

                    shadowMappingBlurTechnique['shadowMap'] = shadowMap.texture;
                    shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetH;
                    gd.draw(quadPrimitive, 4);

                    gd.endRenderTarget();

                    // Vertical
                    if (!gd.beginRenderTarget(shadowMap.renderTarget))
                    {
                        break;
                    }

                    shadowMappingBlurTechnique['shadowMap'] =
                        shadowMapBlurTexture;
                    shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetV;
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
            shadowMapSize = this.sizeLow;
            pixelOffsetH = [(1.0 / shadowMapSize), 0];
            pixelOffsetV = [0, (1.0 / shadowMapSize)];
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

                    shadowMappingBlurTechnique['shadowMap'] = shadowMap.texture;
                    shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetH;
                    gd.draw(quadPrimitive, 4);

                    gd.endRenderTarget();

                    // Vertical
                    if (!gd.beginRenderTarget(shadowMap.renderTarget))
                    {
                        break;
                    }

                    shadowMappingBlurTechnique['shadowMap'] =
                        shadowMapBlurTexture;
                    shadowMappingBlurTechnique['pixelOffset'] = pixelOffsetV;
                    gd.draw(quadPrimitive, 4);

                    gd.endRenderTarget();
                }
            }
        }
    };

    lookAt(camera, lookAt, up, eyePosition)
    {
        var md = this.md;
        var zaxis = md.v3Sub(eyePosition, lookAt, this.tempV3AxisZ);
        md.v3Normalize(zaxis, zaxis);
        var xaxis = md.v3Cross(md.v3Normalize(up, up), zaxis, this.tempV3AxisX);
        md.v3Normalize(xaxis, xaxis);
        var yaxis = md.v3Cross(zaxis, xaxis, this.tempV3AxisY);
        camera.matrix = md.m43Build(xaxis, yaxis, zaxis, eyePosition, camera.matrix);
    };

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
        delete this.drawQueue;
        delete this.md;
        delete this.gd;
    };

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

        shadowMapping.bufferWidth = 0;
        shadowMapping.bufferHeight = 0;

        shadowMapping.techniqueParameters = gd.createTechniqueParameters();
        shadowMapping.shader = null;
        shadowMapping.shadowMapsLow = [];
        shadowMapping.shadowMapsHigh = [];

        sizeLow = sizeLow || shadowMapping.defaultSizeLow;
        sizeHigh = sizeHigh || shadowMapping.defaultSizeHigh;
        shadowMapping.updateBuffers(sizeLow, sizeHigh);

        shadowMapping.drawQueue = [];

        return shadowMapping;
    };

};
