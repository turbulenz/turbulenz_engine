// Copyright (c) 2009-2013 Turbulenz Limited

/// <reference path="scene.ts" />
/// <reference path="renderingcommon.ts" />
/// <reference path="shadowmapping.ts" />

interface ForwardRendererInfo
{
    far: number;
    id: number;
    shadowMappingUpdate: { (camera: Camera, md: MathDevice): void; };
};

// TODO: Turn ShaderManager into a full class and get rid of this (TSC
// doesn't pick this up from the .d.ts for some reason).

interface ShaderManager
{
    load(a, b?): Shader;
};

//
// ForwardRendering
//

/*global ShadowMapping: false, VMath: false,
         VMathArrayConstructor:false, Effect: false,
         renderingCommonCreateRendererInfoFn: false,
         renderingCommonGetTechniqueIndexFn: false,
         renderingCommonSortKeyFn: false*/

class ForwardRendering
{
    static version = 1;

    passIndex = {
        fillZ: 0, glow: 1, ambient: 2,
        shadow: 3, diffuse: 4, decal: 5, transparent: 6
    };

    md: MathDevice;

    globalTechniqueParameters: TechniqueParameters;
    ambientTechniqueParameters: TechniqueParameters;

    numPasses: number;
    passes: Pass[][];

    lightingScale: number;
    diffuseQueue: DrawParameters[];
    numDiffuseQueue: number;
    overlapQueryRenderables: Renderable[];
    lightVisibleRenderables: Renderable[];

    static nextNodeID: number = 0;

    spotLights: LightInstance[];
    pointLights: LightInstance[];
    localDirectionalLights: LightInstance[];
    globalDirectionalLights: Light[];
    fogLights: LightInstance[];

    worldView: any; // m43
    lightViewInverseProjection: any; // m43
    lightViewInverseTransposeFalloff: TechniqueParameterBuffer;
    lightViewInverseTranspose: any; // m43
    lightFalloff: any; // v4

    v3Zero: any; // v3
    v4Zero: any; // v4
    v4One: any; // v4

    quadPrimitive: number;
    quadSemantics: Semantics;
    quadVertexBuffer: VertexBuffer;

    defaultSkinBufferSize: number;

    shadowMaps: ShadowMapping;

    lightProjection: any; // m43

    defaultUpdateFn: { (camera: Camera): void; };
    defaultSkinnedUpdateFn: { (camera: Camera): void; };
    defaultPrepareFn: { (geometryInstance: GeometryInstance): void; };
    defaultShadowMappingUpdateFn: { (camera: Camera): void; };
    defaultShadowMappingSkinnedUpdateFn: { (camera: Camera): void; };

    zonlyShader: Shader;
    zonlyRigidTechnique: Technique;
    zonlySkinnedTechnique: Technique;
    zonlyRigidAlphaTechnique: Technique;
    zonlySkinnedAlphaTechnique: Technique;
    zonlyRigidNoCullTechnique: Technique;
    zonlySkinnedNoCullTechnique: Technique;
    zonlyRigidAlphaNoCullTechnique: Technique;
    zonlySkinnedAlphaNoCullTechnique: Technique;
    stencilSetTechnique: Technique;
    stencilClearTechnique: Technique;
    stencilSetSpotLightTechnique: Technique;
    stencilClearSpotLightTechnique: Technique;

    forwardShader: Shader;
    skyboxTechnique: Technique;
    ambientRigidTechnique: Technique;
    ambientSkinnedTechnique: Technique;
    ambientRigidAlphaTechnique: Technique;
    ambientSkinnedAlphaTechnique: Technique;
    ambientFlatRigidTechnique: Technique;
    ambientFlatRigidNoCullTechnique: Technique;
    ambientFlatSkinnedTechnique: Technique;
    ambientGlowmapRigidTechnique: Technique;
    ambientGlowmapSkinnedTechnique: Technique;
    ambientLightmapRigidTechnique: Technique;
    glowmapRigidTechnique: Technique;
    glowmapSkinnedTechnique: Technique;
    lightmapRigidTechnique: Technique;

    visibleRenderables: Renderable[];

    camera: Camera;
    globalCameraMatrix: any; // m43
    sceneExtents: any; // v3

    ambientColor: any; //v3
    identityUVTransform: any; // Float32Array of length 6.

    finalRenderTarget: RenderTarget;
    finalTexture: Texture;
    depthBuffer: RenderBuffer;

    bufferWidth: number;
    bufferHeight: number;

    techniqueIndex: number;

    //minPixelCount: 16,
    //minPixelCountShadows: 256,

    updateShader(shaderManager)
    {
        var shader = shaderManager.get("shaders/zonly.cgfx");
        if (shader !== this.zonlyShader)
        {
            this.zonlyShader = shader;
            this.zonlyRigidTechnique = shader.getTechnique("rigid");
            this.zonlySkinnedTechnique = shader.getTechnique("skinned");
            this.zonlyRigidAlphaTechnique = shader.getTechnique("rigid_alphatest");
            this.zonlySkinnedAlphaTechnique = shader.getTechnique("skinned_alphatest");
            this.zonlyRigidNoCullTechnique = shader.getTechnique("rigid_nocull");
            this.zonlySkinnedNoCullTechnique = shader.getTechnique("skinned_nocull");
            this.zonlyRigidAlphaNoCullTechnique = shader.getTechnique("rigid_alphatest_nocull");
            this.zonlySkinnedAlphaNoCullTechnique = shader.getTechnique("skinned_alphatest_nocull");
            this.stencilSetTechnique = shader.getTechnique("stencil_set");
            this.stencilClearTechnique = shader.getTechnique("stencil_clear");
            this.stencilSetSpotLightTechnique = shader.getTechnique("stencil_set_spotlight");
            this.stencilClearSpotLightTechnique = shader.getTechnique("stencil_clear_spotlight");
        }

        shader = shaderManager.get("shaders/forwardrendering.cgfx");
        if (shader !== this.forwardShader)
        {
            this.forwardShader = shader;
            this.skyboxTechnique = shader.getTechnique("skybox");
            this.ambientRigidTechnique = shader.getTechnique("ambient");
            this.ambientSkinnedTechnique = shader.getTechnique("ambient_skinned");
            this.ambientRigidAlphaTechnique = shader.getTechnique("ambient_alphatest");
            this.ambientSkinnedAlphaTechnique = shader.getTechnique("ambient_alphatest_skinned");
            this.ambientFlatRigidTechnique = shader.getTechnique("ambient_flat");
            this.ambientFlatRigidNoCullTechnique = shader.getTechnique("ambient_flat_nocull");
            this.ambientFlatSkinnedTechnique = shader.getTechnique("ambient_flat_skinned");
            this.ambientGlowmapRigidTechnique = shader.getTechnique("ambient_glowmap");
            this.ambientGlowmapSkinnedTechnique = shader.getTechnique("ambient_glowmap_skinned");
            this.ambientLightmapRigidTechnique = shader.getTechnique("ambient_lightmap");
            this.glowmapRigidTechnique = shader.getTechnique("glowmap");
            this.glowmapSkinnedTechnique = shader.getTechnique("glowmap_skinned");
            this.lightmapRigidTechnique = shader.getTechnique("lightmap");
        }

        var shadowMaps = this.shadowMaps;
        if (shadowMaps)
        {
            shadowMaps.updateShader(shaderManager);
        }
    };

    static createNodeRendererInfo(node, md)
    {
        node.rendererInfo = {
            id: ForwardRendering.nextNodeID,
            worldView: md.m43BuildIdentity(),
            worldViewInverseTranspose: md.m33BuildIdentity()
        };
        ForwardRendering.nextNodeID += 1;
    };

    createRendererInfo(renderable): ForwardRendererInfo
    {
        var rendererInfo = <ForwardRendererInfo>
            renderingCommonCreateRendererInfoFn(renderable);

        // TODO: Doesn't this happen in renderingCommonCreateRendererInfoFn?
        renderable.rendererInfo = rendererInfo;

        var sharedMaterialTechniqueParameters = renderable.sharedMaterial.techniqueParameters;
        if (!(sharedMaterialTechniqueParameters.env_map &&
              !sharedMaterialTechniqueParameters.normal_map))
        {   //not skybox
            if (!sharedMaterialTechniqueParameters.materialColor &&
                !renderable.techniqueParameters.materialColor)
            {
                renderable.techniqueParameters.materialColor = this.v4One;
            }
        }

        if (!sharedMaterialTechniqueParameters.uvTransform &&
            !renderable.techniqueParameters.uvTransform)
        {
            renderable.techniqueParameters.uvTransform = this.identityUVTransform;
        }

        var node = renderable.node;
        if (!node.rendererInfo)
        {
            ForwardRendering.createNodeRendererInfo(node, this.md);
        }

        var nodeId = node.rendererInfo.id;
        rendererInfo.id = (nodeId ? (1.0 / (1.0 + nodeId)) : 0);

        return rendererInfo;
    };

    prepareRenderables(camera, scene)
    {
        var passIndex;
        var passes = this.passes;
        var numPasses = this.numPasses;
        for (passIndex = 0; passIndex < numPasses; passIndex += 1)
        {
            passes[passIndex].length = 0;
        }

        var visibleRenderables = scene.getCurrentVisibleRenderables();
        this.visibleRenderables = visibleRenderables;
        var numVisibleRenderables = visibleRenderables.length;
        if (numVisibleRenderables > 0)
        {
            var n, renderable, rendererInfo, pass;
            var drawParametersArray, numDrawParameters, drawParametersIndex, drawParameters, sortDistance;
            var transparentPassIndex = this.passIndex.transparent;
            var ambientPassIndex = this.passIndex.ambient;
            var maxDistance = scene.maxDistance;
            var invMaxDistance = (0.0 < maxDistance ? (1.0 / maxDistance) : 0.0);
            n = 0;
            do
            {
                renderable = visibleRenderables[n];

                rendererInfo = renderable.rendererInfo;
                if (!rendererInfo)
                {
                    rendererInfo = this.createRendererInfo(renderable);
                }

                if (rendererInfo.far)
                {
                    renderable.distance = 1.e38;
                }

                renderable.renderUpdate(camera);

                drawParametersArray = renderable.drawParameters;
                numDrawParameters = drawParametersArray.length;

                sortDistance = renderable.distance;
                if (0.0 < sortDistance)
                {
                    sortDistance *= invMaxDistance;
                    // Make sure it is lower than 1.0 to avoid changing the integer part of sortKey
                    if (0.999 < sortDistance)
                    {
                        sortDistance = 0.999;
                    }
                }
                else
                {
                    // Make sure it is positive to avoid changing the
                    // integer part of sortKey
                    sortDistance = 0;
                }

                for (drawParametersIndex = 0;
                     drawParametersIndex < numDrawParameters;
                     drawParametersIndex += 1)
                {
                    drawParameters = drawParametersArray[drawParametersIndex];
                    passIndex = drawParameters.userData.passIndex;
                    if (passIndex <= ambientPassIndex)
                    {
                        /*jshint bitwise:false*/
                        drawParameters.sortKey = ((drawParameters.sortKey | 0) + sortDistance);
                        /*jshint bitwise:true*/
                    }
                    else if (passIndex === transparentPassIndex)
                    {
                        drawParameters.sortKey = sortDistance;
                    }
                    pass = passes[passIndex];
                    pass[pass.length] = drawParameters;
                }

                drawParametersArray = renderable.diffuseDrawParameters;
                if (drawParametersArray)
                {
                    numDrawParameters = drawParametersArray.length;
                    for (drawParametersIndex = 0; drawParametersIndex < numDrawParameters; drawParametersIndex += 1)
                    {
                        drawParameters = drawParametersArray[drawParametersIndex];
                        drawParameters.removeInstances();
                    }

                    drawParametersArray = renderable.diffuseShadowDrawParameters;
                    if (drawParametersArray)
                    {
                        numDrawParameters = drawParametersArray.length;
                        for (drawParametersIndex = 0; drawParametersIndex < numDrawParameters; drawParametersIndex += 1)
                        {
                            drawParameters = drawParametersArray[drawParametersIndex];
                            drawParameters.removeInstances();
                        }
                    }
                }

                n += 1;
            }
            while (n < numVisibleRenderables);
        }
    };

    prepareLights(gd, scene)
    {
        var pointLights = this.pointLights;
        var spotLights = this.spotLights;
        var localDirectionalLights = this.localDirectionalLights;
        var globalDirectionalLights = this.globalDirectionalLights;

        var numPoint = 0;
        var numSpot = 0;
        var numLocalDirectional = 0;
        var numGlobalDirectional = 0;

        var visibleLights = scene.getCurrentVisibleLights();
        var numVisibleLights = visibleLights.length;
        var lightInstance, light, l;
        if (numVisibleLights)
        {
            //var widthToPixel = (0.5 * gd.width);
            //var heightToPixel = (0.5 * gd.height);
            //var minPixelCount = this.minPixelCount;
            //var minPixelCountShadows = this.minPixelCountShadows;
            //var screenExtents;

            l = 0;
            do
            {
                lightInstance = visibleLights[l];

                //screenExtents = lightInstance.screenExtents;
                //if (screenExtents)
                //{
                //    var pixelCount = (((screenExtents[2] - screenExtents[0]) * widthToPixel) +
                //                      ((screenExtents[3] - screenExtents[1]) * heightToPixel));
                //    if (pixelCount < minPixelCount)
                //    {
                //        numVisibleLights -= 1;
                //        if (l < numVisibleLights)
                //        {
                //            visibleLights[l] = visibleLights[numVisibleLights];
                //            continue;
                //        }
                //        else
                //        {
                //            break;
                //        }
                //    }
                //
                //    lightInstance.pixelCount = pixelCount;
                //}
                //else
                //{
                //    lightInstance.pixelCount = minPixelCountShadows;
                //}

                light = lightInstance.light;
                if (light)
                {
                    if (!light.global)
                    {
                        lightInstance.shadows = false;

                        if (this.lightFindVisibleRenderables(gd, lightInstance, scene))
                        {
                            if (light.spot)
                            {
                                spotLights[numSpot] = lightInstance;
                                numSpot += 1;
                            }
                            else if (light.point)
                            {
                                // this includes local ambient lights
                                pointLights[numPoint] = lightInstance;
                                numPoint += 1;
                            }
                            else if (light.directional)
                            {
                                // this includes local ambient lights
                                localDirectionalLights[numLocalDirectional] = lightInstance;
                                numLocalDirectional += 1;
                            }
                            // this renderer does not support fog lights yet
                        }
                        else
                        {
                            numVisibleLights -= 1;
                            if (l < numVisibleLights)
                            {
                                visibleLights[l] = visibleLights[numVisibleLights];
                                continue;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                }

                l += 1;
            }
            while (l < numVisibleLights);

            if (numVisibleLights < visibleLights.length)
            {
                visibleLights.length = numVisibleLights;
            }
        }

        var globalLights = scene.getGlobalLights();
        var numGlobalLights = globalLights.length;
        if (numGlobalLights)
        {
            l = 0;
            do
            {
                light = globalLights[l];
                if (light && !light.disabled && light.directional)
                {
                    globalDirectionalLights[numGlobalDirectional] = light;
                    numGlobalDirectional += 1;
                }

                l += 1;
            }
            while (l < numGlobalLights);
        }

        // Clear remaining deleted lights from the last frame
        globalDirectionalLights.length = numGlobalDirectional;
        localDirectionalLights.length = numLocalDirectional;
        pointLights.length = numPoint;
        spotLights.length = numSpot;
    };

    addToDiffuseQueue(gd, renderableDrawParameters,
                      lightInstanceTechniqueParameters)
    {
        renderableDrawParameters.addInstance(lightInstanceTechniqueParameters);

        if (1 === renderableDrawParameters.getNumInstances())
        {
            var queue = this.diffuseQueue;
            var queueLength = this.numDiffuseQueue;
            this.numDiffuseQueue = (queueLength + 1);

            queue[queueLength] = renderableDrawParameters;
        }
    };

    //TODO name.
    lightFindVisibleRenderables(gd, lightInstance, scene): bool
    {
        var origin, overlappingRenderables, numOverlappingRenderables;
        var n, meta, extents, lightFrameVisible;
        var node, light, renderable;
        var shadowMaps = this.shadowMaps;

        node = lightInstance.node;
        light = lightInstance.light;

        extents = lightInstance.getWorldExtents();

        lightFrameVisible = lightInstance.frameVisible;

        var overlapQueryRenderables = this.overlapQueryRenderables;
        var numOverlapQueryRenderables = 0;
        overlapQueryRenderables.length = 0;

        var lightVisibleRenderables = this.lightVisibleRenderables;
        var numLightVisibleRenderables = 0;

        overlappingRenderables = lightInstance.overlappingRenderables;

        if (node.dynamic ||
            lightInstance.staticNodesChangeCounter !== scene.staticNodesChangeCounter)
        {
            var md = this.md;
            var matrix = node.world;
            var lightOrigin = light.origin;
            if (lightOrigin)
            {
                origin = md.m43TransformPoint(matrix, lightOrigin, lightInstance.lightOrigin);
            }
            else
            {
                origin = md.m43Pos(matrix, lightInstance.lightOrigin);
            }
            lightInstance.lightOrigin = origin;

            if (!overlappingRenderables)
            {
                overlappingRenderables = [];
                lightInstance.overlappingRenderables = overlappingRenderables;
            }
            numOverlappingRenderables = 0;

            lightInstance.staticNodesChangeCounter = scene.staticNodesChangeCounter;

            scene.findStaticOverlappingRenderables(origin, extents, overlapQueryRenderables);
            numOverlapQueryRenderables = overlapQueryRenderables.length;
            for (n = 0; n < numOverlapQueryRenderables; n += 1)
            {
                renderable = overlapQueryRenderables[n];
                meta = renderable.sharedMaterial.meta;
                if (!meta.transparent && !meta.decal && !meta.far)
                {
                    overlappingRenderables[numOverlappingRenderables] = renderable;
                    numOverlappingRenderables += 1;

                    // Make sure the extents are calculated
                    renderable.getWorldExtents();

                    if (renderable.frameVisible === lightFrameVisible &&
                        !renderable.disabled &&
                        !renderable.node.disabled)
                    {
                        lightVisibleRenderables[numLightVisibleRenderables] = renderable;
                        numLightVisibleRenderables += 1;
                    }
                }
            }
            overlapQueryRenderables.length = 0;

            overlappingRenderables.length = numOverlappingRenderables;
            lightInstance.numStaticOverlappingRenderables = numOverlappingRenderables;
        }
        else
        {
            origin = lightInstance.lightOrigin;
            numOverlappingRenderables = lightInstance.numStaticOverlappingRenderables;

            for (n = 0; n < numOverlappingRenderables; n += 1)
            {
                renderable = overlappingRenderables[n];
                if (renderable.frameVisible === lightFrameVisible &&
                    !renderable.disabled &&
                    !renderable.node.disabled)
                {
                    lightVisibleRenderables[numLightVisibleRenderables] = renderable;
                    numLightVisibleRenderables += 1;
                }
            }
        }

        // Query the dynamic renderables from the scene and filter out non lit geometries
        scene.findDynamicOverlappingRenderables(origin, extents, overlapQueryRenderables);
        numOverlapQueryRenderables = overlapQueryRenderables.length;
        for (n = 0; n < numOverlapQueryRenderables; n += 1)
        {
            renderable = overlapQueryRenderables[n];
            meta = renderable.sharedMaterial.meta;
            if (!meta.transparent && !meta.decal && !meta.far)
            {
                overlappingRenderables[numOverlappingRenderables] = renderable;
                numOverlappingRenderables += 1;

                if (renderable.frameVisible === lightFrameVisible &&
                    !renderable.disabled &&
                    !renderable.node.disabled)
                {
                    lightVisibleRenderables[numLightVisibleRenderables] = renderable;
                    numLightVisibleRenderables += 1;
                }
            }
        }

        if (0 === numLightVisibleRenderables)
        {
            lightInstance.numVisibleDrawParameters = 0;
            return false;
        }

        var renderableID;
        var drawParameterIndex, numDrawParameters, drawParametersArray, drawParameters;
        var numVisibleDrawParameters = 0;

        var usingShadows = false;
        if (shadowMaps &&
            light.shadows /*&&
            lightInstance.pixelCount >= this.minPixelCountShadows*/)
        {
            shadowMaps.findVisibleRenderables(lightInstance);

            var shadowRenderables = lightInstance.shadowRenderables;
            usingShadows = (shadowRenderables && 0 < shadowRenderables.length);
        }

        var lightInstanceTechniqueParameters = lightInstance.techniqueParameters;
        if (!lightInstanceTechniqueParameters)
        {
            lightInstanceTechniqueParameters = gd.createTechniqueParameters(light.techniqueParameters);
            lightInstanceTechniqueParameters.lightViewInverseTransposeFalloff =
                                               gd.createTechniqueParameterBuffer({ numFloats: 16 });
            lightInstance.techniqueParameters = lightInstanceTechniqueParameters;
        }

        for (n = 0; n < numLightVisibleRenderables; n += 1)
        {
            renderable = lightVisibleRenderables[n];
            renderableID = (renderable.rendererInfo.id || 0);

            if (usingShadows)
            {
                drawParametersArray = renderable.diffuseShadowDrawParameters;
            }
            else
            {
                drawParametersArray = renderable.diffuseDrawParameters;
            }
            numDrawParameters = drawParametersArray.length;
            for (drawParameterIndex = 0; drawParameterIndex < numDrawParameters; drawParameterIndex += 1)
            {
                drawParameters = drawParametersArray[drawParameterIndex];
                /*jshint bitwise:false*/
                drawParameters.sortKey = ((drawParameters.sortKey | 0) + renderableID);
                /*jshint bitwise:true*/
                this.addToDiffuseQueue(gd, drawParameters,
                                       lightInstanceTechniqueParameters);
                numVisibleDrawParameters += 1;
            }
        }

        lightInstance.numVisibleDrawParameters = numVisibleDrawParameters;

        return (0 < numVisibleDrawParameters);
    };

    directionalLightsUpdateVisibleRenderables(gd /*, scene */) : bool
    {
        var globalDirectionalLights = this.globalDirectionalLights;
        var numGlobalDirectionalLights = globalDirectionalLights.length;
        var visibleRenderables = this.visibleRenderables;
        var numVisibleRenderables = visibleRenderables.length;

        var light, lightTechniqueParameters, numVisibleDrawParameters, n, renderable;
        var drawParameterIndex, numDrawParameters, drawParametersArray;

        var totalVisibleDrawParameters = 0;
        var l = 0;
        do
        {
            light = globalDirectionalLights[l];

            lightTechniqueParameters = light.techniqueParameters;

            numVisibleDrawParameters = 0;
            for (n = 0; n < numVisibleRenderables; n += 1)
            {
                renderable = visibleRenderables[n];
                if (!renderable.disabled &&
                    !renderable.node.disabled)
                {
                    drawParametersArray = renderable.diffuseDrawParameters;
                    if (drawParametersArray)
                    {
                        numDrawParameters = drawParametersArray.length;
                        for (drawParameterIndex = 0; drawParameterIndex < numDrawParameters; drawParameterIndex += 1)
                        {
                            this.addToDiffuseQueue(gd, drawParametersArray[drawParameterIndex],
                                                   lightTechniqueParameters);
                            numVisibleDrawParameters += 1;
                        }
                    }
                }
            }

            light.numVisibleDrawParameters = numVisibleDrawParameters;

            totalVisibleDrawParameters += numVisibleDrawParameters;

            l += 1;
        }
        while (l < numGlobalDirectionalLights);


        return (0 < totalVisibleDrawParameters);
    };

    update(gd, camera, scene, currentTime)
    {
        this.camera = camera;
        this.globalCameraMatrix = camera.matrix;
        this.numDiffuseQueue = 0;

        if (0 < currentTime)
        {
            scene.updateVisibleNodes(camera);
        }

        this.sceneExtents = scene.extents;

        //scene.calculateLightsScreenExtents(camera);

        this.prepareRenderables(camera, scene);

        this.prepareLights(gd, scene);

        var md = this.md;

        var viewMatrix = camera.viewMatrix;
        var globalTechniqueParameters = this.globalTechniqueParameters;
        globalTechniqueParameters['projection'] = camera.projectionMatrix;
        globalTechniqueParameters['viewProjection'] =
            camera.viewProjectionMatrix;
        globalTechniqueParameters['eyePosition'] =
            md.m43Pos(camera.matrix, globalTechniqueParameters['eyePosition']);
        globalTechniqueParameters['time'] = currentTime;

        /*
        var maxDepth = (scene.maxDistance + camera.nearPlane);
        var maxDepthReciprocal = (1.0 / maxDepth);
        globalTechniqueParameters.viewDepth = md.v4Build(-viewMatrix[2]  * maxDepthReciprocal,
                                                         -viewMatrix[5]  * maxDepthReciprocal,
                                                         -viewMatrix[8]  * maxDepthReciprocal,
                                                         -viewMatrix[11] * maxDepthReciprocal,
                                                         globalTechniqueParameters.viewDepth);
        */

        var globalLights = scene.globalLights;
        var numGlobalLights = globalLights.length;
        var ambientColorR = 0, ambientColorG = 0, ambientColorB = 0;
        var globalLight, globalLightColor;
        var g;
        for (g = 0; g < numGlobalLights; g += 1)
        {
            globalLight = globalLights[g];
            if (!globalLight.disabled)
            {
                if (globalLight.ambient)
                {
                    globalLightColor = globalLight.color;
                    ambientColorR += globalLightColor[0];
                    ambientColorG += globalLightColor[1];
                    ambientColorB += globalLightColor[2];
                }
            }
        }

        var lightingScale = this.lightingScale;

        if (ambientColorR || ambientColorG || ambientColorB)
        {
            this.ambientColor = md.v3Build((lightingScale * ambientColorR),
                                           (lightingScale * ambientColorG),
                                           (lightingScale * ambientColorB),
                                           this.ambientColor);
        }
        else
        {
            delete this.ambientColor;
        }

        var l, node, light, lightInstance, lightColor, matrix, techniqueParameters, origin, halfExtents;
        var lightViewInverseTransposeFalloff;
        var lightViewInverseTranspose = this.lightViewInverseTranspose;
        var lightFalloff = this.lightFalloff;
        var worldView = this.worldView;

        var pointInstances = this.pointLights;
        var numPointInstances = pointInstances.length;
        for (l = 0; l < numPointInstances; l += 1)
        {
            lightInstance = pointInstances[l];
            node = lightInstance.node;
            light = lightInstance.light;

            matrix = node.world;
            techniqueParameters = lightInstance.techniqueParameters;

            origin = light.origin;

            worldView = md.m43Mul(matrix, viewMatrix, worldView);

            if (origin)
            {
                techniqueParameters.lightOrigin = md.m43TransformPoint(worldView, origin, techniqueParameters.lightOrigin);
            }
            else
            {
                techniqueParameters.lightOrigin = md.m43Pos(worldView, techniqueParameters.lightOrigin);
            }

            lightColor = light.color;
            techniqueParameters.lightColor = md.v3Build((lightingScale * lightColor[0]),
                                                        (lightingScale * lightColor[1]),
                                                        (lightingScale * lightColor[2]),
                                                        techniqueParameters.lightColor);

            lightViewInverseTranspose = md.m43InverseTransposeProjection(worldView, light.halfExtents,
                                                                         lightViewInverseTranspose);

            lightFalloff[0] = lightViewInverseTranspose[8];
            lightFalloff[1] = lightViewInverseTranspose[9];
            lightFalloff[2] = lightViewInverseTranspose[10];
            lightFalloff[3] = lightViewInverseTranspose[11];

            lightViewInverseTranspose[8] = 0;
            lightViewInverseTranspose[9] = 0;
            lightViewInverseTranspose[10] = 0;
            lightViewInverseTranspose[11] = 1.0;

            lightViewInverseTransposeFalloff = techniqueParameters.lightViewInverseTransposeFalloff;
            lightViewInverseTransposeFalloff.setData(lightViewInverseTranspose, 0, 12);
            lightViewInverseTransposeFalloff.setData(lightFalloff, 12, 4);
        }

        var localDirectionalInstances = this.localDirectionalLights;
        var numLocalDirectionalInstances = localDirectionalInstances.length;
        var direction;
        for (l = 0; l < numLocalDirectionalInstances; l += 1)
        {
            lightInstance = localDirectionalInstances[l];
            node = lightInstance.node;
            light = lightInstance.light;

            matrix = node.world;
            techniqueParameters = lightInstance.techniqueParameters;

            worldView = md.m43Mul(matrix, viewMatrix, worldView);

            direction = md.m43TransformVector(worldView, light.direction, direction);
            techniqueParameters.lightOrigin = md.v3ScalarMul(direction, -1e5, techniqueParameters.lightOrigin);

            lightColor = light.color;
            techniqueParameters.lightColor = md.v3Build((lightingScale * lightColor[0]),
                                                        (lightingScale * lightColor[1]),
                                                        (lightingScale * lightColor[2]),
                                                        techniqueParameters.lightColor);

            lightViewInverseTranspose = md.m43InverseTransposeProjection(worldView, light.halfExtents,
                                                                         lightViewInverseTranspose);

            lightFalloff[0] = lightViewInverseTranspose[8];
            lightFalloff[1] = lightViewInverseTranspose[9];
            lightFalloff[2] = lightViewInverseTranspose[10];
            lightFalloff[3] = lightViewInverseTranspose[11];

            lightViewInverseTranspose[8] = 0;
            lightViewInverseTranspose[9] = 0;
            lightViewInverseTranspose[10] = 0;
            lightViewInverseTranspose[11] = 1.0;

            lightViewInverseTransposeFalloff = techniqueParameters.lightViewInverseTransposeFalloff;
            lightViewInverseTransposeFalloff.setData(lightViewInverseTranspose, 0, 12);
            lightViewInverseTransposeFalloff.setData(lightFalloff, 12, 4);
        }

        var globalDirectionalLights = this.globalDirectionalLights;
        var numGlobalDirectionalLights = globalDirectionalLights.length;
        if (numGlobalDirectionalLights)
        {
            if (this.directionalLightsUpdateVisibleRenderables(gd))
            {
                var extents = scene.extents;

                var sceneDirectionalLightDistance = (-1e5) * ((extents[3] - extents[0]) +
                                                              (extents[4] - extents[1]) +
                                                              (extents[5] - extents[2]));

                halfExtents = md.v3Build(extents[3] - extents[0],
                                         extents[4] - extents[1],
                                         extents[5] - extents[2]);

                lightViewInverseTranspose = md.m43InverseTransposeProjection(viewMatrix, halfExtents,
                                                                             lightViewInverseTranspose);

                lightFalloff[0] = lightViewInverseTranspose[8];
                lightFalloff[1] = lightViewInverseTranspose[9];
                lightFalloff[2] = lightViewInverseTranspose[10];
                lightFalloff[3] = lightViewInverseTranspose[11];

                lightViewInverseTranspose[8] = 0;
                lightViewInverseTranspose[9] = 0;
                lightViewInverseTranspose[10] = 0;
                lightViewInverseTranspose[11] = 1.0;

                lightViewInverseTransposeFalloff = this.lightViewInverseTransposeFalloff;
                lightViewInverseTransposeFalloff.setData(lightViewInverseTranspose, 0, 12);
                lightViewInverseTransposeFalloff.setData(lightFalloff, 12, 4);

                var lightAt = md.v3BuildZero();

                l = 0;
                do
                {
                    light = globalDirectionalLights[l];

                    techniqueParameters = light.techniqueParameters;

                    techniqueParameters.lightViewInverseTransposeFalloff = lightViewInverseTransposeFalloff;

                    md.v3Normalize(light.direction, lightAt);
                    origin = md.v3ScalarMul(lightAt, sceneDirectionalLightDistance);
                    techniqueParameters.lightOrigin = md.m43TransformPoint(viewMatrix, origin,
                                                                           techniqueParameters.lightOrigin);

                    lightColor = light.color;
                    techniqueParameters.lightColor = md.v3Build((lightingScale * lightColor[0]),
                                                                (lightingScale * lightColor[1]),
                                                                (lightingScale * lightColor[2]),
                                                                techniqueParameters.lightColor);

                    l += 1;
                }
                while (l < numGlobalDirectionalLights);
            }
            else
            {
                globalDirectionalLights.length = 0;
            }
        }

        var spotInstances = this.spotLights;
        var numSpotInstances = spotInstances.length;
        if (numSpotInstances)
        {
            var lightView, lightViewInverse;
            var lightProjection = this.lightProjection;
            var lightViewInverseProjection = this.lightViewInverseProjection;

            l = 0;
            do
            {
                lightInstance = spotInstances[l];
                node = lightInstance.node;
                light = lightInstance.light;

                matrix = node.world;
                techniqueParameters = lightInstance.techniqueParameters;

                origin = light.origin;

                worldView = md.m43Mul(matrix, viewMatrix, worldView);

                if (origin)
                {
                    techniqueParameters.lightOrigin = md.m43TransformPoint(worldView, origin, techniqueParameters.lightOrigin);
                }
                else
                {
                    techniqueParameters.lightOrigin = md.m43Pos(worldView, techniqueParameters.lightOrigin);
                }

                lightColor = light.color;
                techniqueParameters.lightColor = md.v3Build((lightingScale * lightColor[0]),
                                                            (lightingScale * lightColor[1]),
                                                            (lightingScale * lightColor[2]),
                                                            techniqueParameters.lightColor);

                var frustum = light.frustum;
                var frustumNear = light.frustumNear;
                var invFrustumNear = 1.0 / (1 - frustumNear);
                lightView = md.m33MulM43(frustum, worldView, lightView);
                lightViewInverse = md.m43Inverse(lightView, lightViewInverse);
                lightProjection[8] = invFrustumNear;
                lightProjection[11] = -(frustumNear * invFrustumNear);
                lightViewInverseProjection = md.m43Mul(lightViewInverse, lightProjection, lightViewInverseProjection);
                lightViewInverseTranspose = md.m43Transpose(lightViewInverseProjection, lightViewInverseTranspose);

                lightFalloff[0] = lightViewInverseTranspose[8];
                lightFalloff[1] = lightViewInverseTranspose[9];
                lightFalloff[2] = lightViewInverseTranspose[10];
                lightFalloff[3] = lightViewInverseTranspose[11];

                lightViewInverseTransposeFalloff = techniqueParameters.lightViewInverseTransposeFalloff;
                lightViewInverseTransposeFalloff.setData(lightViewInverseTranspose, 0, 12);
                lightViewInverseTransposeFalloff.setData(lightFalloff, 12, 4);

                l += 1;
            }
            while (l < numSpotInstances);
        }
    };

    destroyBuffers()
    {
        if (this.finalRenderTarget)
        {
            this.finalRenderTarget.destroy();
            this.finalRenderTarget = null;
        }
        if (this.finalTexture)
        {
            this.finalTexture.destroy();
            this.finalTexture = null;
        }
        if (this.depthBuffer)
        {
            this.depthBuffer.destroy();
            this.depthBuffer = null;
        }
    };

    updateBuffers(gd, deviceWidth, deviceHeight): bool
    {
        if (this.bufferWidth === deviceWidth && this.bufferHeight === deviceHeight)
        {
            return true;
        }

        this.destroyBuffers();

        this.finalTexture = gd.createTexture({
                name: "final",
                width: deviceWidth,
                height: deviceHeight,
                format: "R8G8B8A8",
                mipmaps: false,
                renderable: true
            });

        this.depthBuffer = gd.createRenderBuffer({
                width: deviceWidth,
                height: deviceHeight,
                format: "D24S8"
            });

        if (this.finalTexture &&
            this.depthBuffer)
        {
            this.finalRenderTarget = gd.createRenderTarget({
                    colorTexture0: this.finalTexture,
                    depthBuffer: this.depthBuffer
                });

            if (this.finalRenderTarget)
            {
                this.bufferWidth = deviceWidth;
                this.bufferHeight = deviceHeight;
                return true;
            }
        }

        this.bufferWidth = 0;
        this.bufferHeight = 0;
        this.destroyBuffers();
        return false;
    };

    drawAmbientPass(gd, ambientColor)
    {
        this.ambientTechniqueParameters['ambientColor'] = ambientColor;
        gd.drawArray(this.passes[this.passIndex.ambient],
                     [this.globalTechniqueParameters,
                      this.ambientTechniqueParameters], -1);
    };

    drawShadowMaps(gd, globalTechniqueParameters, lightInstances, shadowMaps, minExtentsHigh)
    {
        var numInstances = lightInstances.length;
        if (!numInstances)
        {
            return;
        }

        var lightInstance, light;
        var l;
        var globalCameraMatrix = this.globalCameraMatrix;
        //var minPixelCountShadows = this.minPixelCountShadows;

        l = 0;
        do
        {
            lightInstance = lightInstances[l];
            if (!lightInstance.numVisibleDrawParameters)
            {
                l += 1;
                continue;
            }
            light = lightInstance.light;

            // TODO: pixel count test
            if (light.shadows &&
                !light.ambient /*&&
                lightInstance.pixelCount >= minPixelCountShadows*/)
            {
                shadowMaps.drawShadowMap(globalCameraMatrix, minExtentsHigh, lightInstance);
            }

            l += 1;
        }
        while (l < numInstances);
    };

    draw(gd,
                                          clearColor,
                                          drawDecalsFn,
                                          drawTransparentFn,
                                          drawDebugFn,
                                          postFXsetupFn)
    {
        var globalTechniqueParameters = this.globalTechniqueParameters;
        var ambientColor = this.ambientColor;

        // draw the shadow maps
        var shadowMaps = this.shadowMaps;
        if (shadowMaps)
        {
            var sceneExtents = this.sceneExtents;
            var minExtentsHigh = (Math.max((sceneExtents[3] - sceneExtents[0]),
                                           (sceneExtents[4] - sceneExtents[1]),
                                           (sceneExtents[5] - sceneExtents[2])) / 6);

            shadowMaps.lowIndex = 0;
            shadowMaps.highIndex = 0;
            this.drawShadowMaps(gd, globalTechniqueParameters, this.pointLights, shadowMaps, minExtentsHigh);
            this.drawShadowMaps(gd, globalTechniqueParameters, this.spotLights, shadowMaps, minExtentsHigh);
            this.drawShadowMaps(gd, globalTechniqueParameters, this.localDirectionalLights, shadowMaps, minExtentsHigh);
            shadowMaps.blurShadowMaps();
        }

        var usingRenderTarget;
        if (postFXsetupFn)
        {
            usingRenderTarget = gd.beginRenderTarget(this.finalRenderTarget);
        }
        else
        {
            usingRenderTarget = false;
        }

        if (clearColor)
        {
            gd.clear(clearColor, 1.0, 0);
        }
        else if (ambientColor)
        {
            gd.clear(null, 1.0, 0);
        }
        else
        {
            gd.clear(this.v4Zero, 1.0, 0);
        }

        var globalTechniqueParametersArray = [globalTechniqueParameters];

        // ambient and emissive pass
        if (clearColor &&
            (clearColor[0] ||
             clearColor[1] ||
             clearColor[2] ||
             clearColor[3] !== 1.0))
        {
            if (!ambientColor)
            {
                // Need to draw everything on black to cope with the external clear color
                ambientColor = this.v3Zero;
            }

            this.drawAmbientPass(gd, ambientColor);
        }
        else if (ambientColor)
        {
            this.drawAmbientPass(gd, ambientColor);
        }
        else
        {
            // Here we may need a fill pass because only a handful of materials may glow
            gd.drawArray(this.passes[this.passIndex.fillZ], globalTechniqueParametersArray, -1);

            gd.drawArray(this.passes[this.passIndex.glow], globalTechniqueParametersArray, -1);
        }

        // diffuse pass
        var numDiffuseQueue = this.numDiffuseQueue;
        if (0 < numDiffuseQueue)
        {
            var diffuseQueue = this.diffuseQueue;
            if (numDiffuseQueue < diffuseQueue.length)
            {
                diffuseQueue.length = numDiffuseQueue;
            }

            gd.drawArray(diffuseQueue, globalTechniqueParametersArray, -1);
        }

        // decals
        var pass = this.passes[this.passIndex.decal];
        if (0 < pass.length)
        {
            gd.drawArray(pass, globalTechniqueParametersArray, -1);
        }

        if (drawDecalsFn)
        {
            drawDecalsFn();
        }

        // transparent objects
        pass = this.passes[this.passIndex.transparent];
        if (0 < pass.length)
        {
            gd.drawArray(pass, globalTechniqueParametersArray, 1);
        }

        if (drawTransparentFn)
        {
            drawTransparentFn();
        }

        if (drawDebugFn)
        {
            drawDebugFn();
        }

        if (usingRenderTarget)
        {
            gd.endRenderTarget();
            var finalTexture = this.finalTexture;

            postFXsetupFn(gd, finalTexture);

            gd.setStream(this.quadVertexBuffer, this.quadSemantics);
            gd.draw(this.quadPrimitive, 4);
        }
    };

    setLightingScale(scale)
    {
        this.lightingScale = scale;
    };

    getDefaultSkinBufferSize(): number
    {
        return this.defaultSkinBufferSize;
    };

    destroy()
    {
        delete this.globalTechniqueParameters;
        delete this.ambientTechniqueParameters;
        delete this.passes;
        delete this.passIndex;

        delete this.sceneExtents;
        delete this.visibleRenderables;

        delete this.globalCameraMatrix;

        delete this.diffuseQueue;

        delete this.spotLights;
        delete this.pointLights;
        delete this.localDirectionalLights;
        delete this.globalDirectionalLights;
        delete this.fogLights;

        delete this.lightViewInverseTransposeFalloff;
        delete this.lightViewInverseTranspose;
        delete this.lightFalloff;

        delete this.v3Zero;
        delete this.v4Zero;
        delete this.v4One;

        delete this.lightProjection;

        delete this.quadPrimitive;
        delete this.quadSemantics;

        if (this.quadVertexBuffer)
        {
            this.quadVertexBuffer.destroy();
            delete this.quadVertexBuffer;
        }

        delete this.camera;
        delete this.ambientColor;

        if (this.zonlyShader)
        {
            delete this.zonlyShader;
            delete this.zonlyRigidTechnique;
            delete this.zonlySkinnedTechnique;
            delete this.zonlyRigidAlphaTechnique;
            delete this.zonlySkinnedAlphaTechnique;
            delete this.zonlyRigidNoCullTechnique;
            delete this.zonlySkinnedNoCullTechnique;
            delete this.zonlyRigidAlphaNoCullTechnique;
            delete this.zonlySkinnedAlphaNoCullTechnique;
            delete this.stencilSetTechnique;
            delete this.stencilClearTechnique;
            delete this.stencilSetSpotLightTechnique;
            delete this.stencilClearSpotLightTechnique;
        }

        if (this.forwardShader)
        {
            delete this.forwardShader;
            delete this.skyboxTechnique;
            delete this.ambientRigidTechnique;
            delete this.ambientSkinnedTechnique;
            delete this.ambientRigidAlphaTechnique
            delete this.ambientSkinnedAlphaTechnique;
            delete this.ambientFlatRigidTechnique;
            delete this.ambientFlatRigidNoCullTechnique
            delete this.ambientFlatSkinnedTechnique;
            delete this.ambientGlowmapRigidTechnique;
            delete this.ambientGlowmapSkinnedTechnique;
            delete this.ambientLightmapRigidTechnique;
            delete this.glowmapRigidTechnique;
            delete this.glowmapSkinnedTechnique;
            delete this.lightmapRigidTechnique;
        }

        var shadowMaps = this.shadowMaps;
        if (shadowMaps)
        {
            shadowMaps.destroy();
            delete this.shadowMaps;
        }

        this.destroyBuffers();

        delete this.md;
    };

    // Constructor function
    static create(gd: GraphicsDevice, md: MathDevice,
                  shaderManager: ShaderManager, effectManager: EffectManager,
                  settings)
    {
        var fr = new ForwardRendering();

        fr.md = md;

        fr.globalTechniqueParameters = gd.createTechniqueParameters({
            time : 0.0
        });

        fr.ambientTechniqueParameters = gd.createTechniqueParameters({
            ambientColor: md.v3BuildZero()
        });

        fr.numPasses = fr.passIndex.transparent + 1;

        var passes = fr.passes = [];
        var numPasses = fr.numPasses;
        var index;
        for (index = 0; index < numPasses; index += 1)
        {
            passes[index] = [];
        }

        fr.lightingScale = 2.0;

        fr.diffuseQueue = [];
        fr.numDiffuseQueue = 0;

        fr.overlapQueryRenderables = [];
        fr.lightVisibleRenderables = [];

        fr.spotLights = [];
        fr.pointLights = [];
        fr.localDirectionalLights = [];
        fr.globalDirectionalLights = [];
        fr.fogLights = [];

        fr.worldView = md.m43BuildIdentity();
        fr.lightViewInverseProjection = md.m43BuildIdentity();
        fr.lightViewInverseTransposeFalloff = gd.createTechniqueParameterBuffer({
            numFloats: 16
        });
        fr.lightViewInverseTranspose = md.m43BuildIdentity();
        fr.lightFalloff = md.v4BuildZero();

        fr.v3Zero = md.v3BuildZero();
        fr.v4Zero = md.v4BuildZero();
        fr.v4One = md.v4BuildOne();
        fr.identityUVTransform = new Float32Array([1, 0, 0, 1, 0, 0]);

        fr.quadPrimitive = gd.PRIMITIVE_TRIANGLE_STRIP;
        fr.quadSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0']);

        fr.quadVertexBuffer = gd.createVertexBuffer({
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

        var onShaderLoaded = function onShaderLoadedFn(shader)
        {
            var skinBones = shader.getParameter("skinBones");
            fr.defaultSkinBufferSize = skinBones.rows * skinBones.columns;
        };

        shaderManager.load("shaders/zonly.cgfx");
        shaderManager.load("shaders/forwardrendering.cgfx", onShaderLoaded);

        // Prepare effects
        var shadowMappingUpdateFn;
        var shadowMappingSkinnedUpdateFn;

        if (settings && settings.shadowRendering)
        {
            shaderManager.load("shaders/forwardrenderingshadows.cgfx");

            var shadowMaps = ShadowMapping.create(gd, md, shaderManager, effectManager, settings.shadowSizeLow, settings.shadowSizeHigh);
            fr.shadowMaps = shadowMaps;
            shadowMappingUpdateFn = shadowMaps.update;
            shadowMappingSkinnedUpdateFn = shadowMaps.skinnedUpdate;
            fr.defaultShadowMappingUpdateFn = shadowMappingUpdateFn;
            fr.defaultShadowMappingSkinnedUpdateFn = shadowMappingSkinnedUpdateFn;
        }

        var flareIndexBuffer, flareSemantics, flareVertexData;

        var lightProjectionRight = md.v3Build(0.5, 0.0, 0.0);
        var lightProjectionUp    = md.v3Build(0.0, 0.5, 0.0);
        var lightProjectionAt    = md.v3Build(0.5, 0.5, 1.0);
        var lightProjectionPos   = md.v3Build(0.0, 0.0, 0.0);

        fr.lightProjection = md.m43Build(lightProjectionRight,
                                         lightProjectionUp,
                                         lightProjectionAt,
                                         lightProjectionPos);

        var updateNodeRendererInfo = function updateNodeRendererInfoFn(node, rendererInfo, camera)
        {
            var worldView = md.m43Mul(node.world, camera.viewMatrix, rendererInfo.worldView);
            md.m33InverseTranspose(worldView, rendererInfo.worldViewInverseTranspose);
        }

        var forwardUpdate = function forwardUpdateFn(camera)
        {
            var node = this.node;
            var rendererInfo = node.rendererInfo;
            if (rendererInfo.frameVisible !== node.frameVisible)
            {
                rendererInfo.frameVisible = node.frameVisible;
                updateNodeRendererInfo(node, rendererInfo, camera);
            }

            var techniqueParameters = this.techniqueParameters;
            techniqueParameters.worldView = rendererInfo.worldView;
            techniqueParameters.worldViewInverseTranspose = rendererInfo.worldViewInverseTranspose;
        };

        var forwardSkinnedUpdate = function forwardSkinnedUpdateFn(camera)
        {
            var node = this.node;
            var rendererInfo = node.rendererInfo;
            if (rendererInfo.frameVisible !== node.frameVisible)
            {
                rendererInfo.frameVisible = node.frameVisible;
                updateNodeRendererInfo(node, rendererInfo, camera);
            }

            var techniqueParameters = this.techniqueParameters;
            techniqueParameters.worldView = rendererInfo.worldView;
            techniqueParameters.worldViewInverseTranspose = rendererInfo.worldViewInverseTranspose;

            var skinController = this.skinController;
            if (skinController)
            {
                techniqueParameters.skinBones = skinController.output;
                skinController.update();
            }
        };

        //
        // forwardPrepareFn
        //
        var alphaSortOffset = 0x4000; // High bit to OR with techniqueIndex that wont cause sortKey to become negative.
        var opaqueSortOffset = 0;

        var forwardPrepare = function forwardPrepareFn(geometryInstance)
        {
            var drawParameters;
            var techniqueParameters;
            var rendererInfo = geometryInstance.rendererInfo;
            var geometryInstanceSharedMaterial = geometryInstance.sharedMaterial;
            var meta = geometryInstanceSharedMaterial.meta;
            var sharedMaterialTechniqueParameters = geometryInstanceSharedMaterial.techniqueParameters;
            var geometryInstanceTechniqueParameters = geometryInstance.techniqueParameters;
            var materialColor = geometryInstanceTechniqueParameters.materialColor || sharedMaterialTechniqueParameters.materialColor || fr.v4One;
            geometryInstance.drawParameters = [];
            var numTechniqueParameters;

            var techniqueName = this.technique.name;
            var sortOffset = opaqueSortOffset;  // Used to force alpha tested objects to be rendererd after opaque so the halo blends with objects

            var node = geometryInstance.node;
            if (!node.rendererInfo)
            {
                ForwardRendering.createNodeRendererInfo(node, md);
            }

            //
            // glow, lightmap, and fillZ. Only if no ambient
            //
            if (sharedMaterialTechniqueParameters.glow_map ||
                sharedMaterialTechniqueParameters.light_map)
            {
                drawParameters = drawParameters = gd.createDrawParameters();
                drawParameters.userData = {};
                geometryInstance.prepareDrawParameters(drawParameters);
                drawParameters.userData.passIndex = fr.passIndex.glow;
                geometryInstance.drawParameters.push(drawParameters);

                if (sharedMaterialTechniqueParameters.light_map)
                {
                    drawParameters.technique = fr.lightmapRigidTechnique;
                }
                else if (geometryInstance.skinController)
                {
                    drawParameters.technique = fr.glowmapSkinnedTechnique;
                }
                else
                {
                    drawParameters.technique = fr.glowmapRigidTechnique;
                }

                drawParameters.sortKey = renderingCommonSortKeyFn(renderingCommonGetTechniqueIndexFn(drawParameters.technique.name),
                                                                  meta.materialIndex);
                //Now add common for world and skin data. materialColor is also copied here.
                drawParameters.setTechniqueParameters(0, sharedMaterialTechniqueParameters);
                drawParameters.setTechniqueParameters(1, geometryInstanceTechniqueParameters);
            }
            else if (!meta.transparent &&
                     !meta.decal)
            {
                // fillZ
                drawParameters = gd.createDrawParameters();
                drawParameters.userData = {};
                geometryInstance.prepareDrawParameters(drawParameters);
                drawParameters.userData.passIndex = fr.passIndex.fillZ;
                geometryInstance.drawParameters.push(drawParameters);
                numTechniqueParameters = 0;

                var alpha = false;
                var nocull = -1 !== techniqueName.indexOf("_nocull");

                if (sharedMaterialTechniqueParameters.alpha_map)
                {
                    sortOffset = alphaSortOffset;
                    alpha = true;

                    techniqueParameters = gd.createTechniqueParameters();
                    techniqueParameters.alpha_map = sharedMaterialTechniqueParameters.alpha_map;
                    techniqueParameters.alphaFactor = materialColor[3];
                    if (sharedMaterialTechniqueParameters.uvTransform)
                    {
                        techniqueParameters.uvTransform = sharedMaterialTechniqueParameters.uvTransform;
                    }

                    drawParameters.setTechniqueParameters(numTechniqueParameters, techniqueParameters);
                    numTechniqueParameters += 1;
                }
                else
                {
                    if (-1 !== techniqueName.indexOf("_alpha"))
                    {
                        alpha = true;
                        sortOffset = alphaSortOffset;

                        techniqueParameters = gd.createTechniqueParameters();
                        techniqueParameters.alpha_map = sharedMaterialTechniqueParameters.diffuse;
                        techniqueParameters.alphaFactor = materialColor[3];
                        if (sharedMaterialTechniqueParameters.uvTransform)
                        {
                            techniqueParameters.uvTransform = sharedMaterialTechniqueParameters.uvTransform;
                        }

                        drawParameters.setTechniqueParameters(numTechniqueParameters, techniqueParameters);
                        numTechniqueParameters += 1;
                    }
                    else if (-1 !== techniqueName.indexOf("_nocull"))
                    {
                        nocull = true;
                    }
                }

                if (geometryInstance.skinController)
                {
                    if (alpha)
                    {
                        if (nocull)
                        {
                            drawParameters.technique = fr.zonlySkinnedAlphaNoCullTechnique;
                        }
                        else
                        {
                            drawParameters.technique = fr.zonlySkinnedAlphaTechnique;
                        }
                    }
                    else if (nocull)
                    {
                        drawParameters.technique = fr.zonlySkinnedNoCullTechnique;
                    }
                    else
                    {
                        drawParameters.technique = fr.zonlySkinnedTechnique;
                    }
                }
                else
                {
                    if (alpha)
                    {
                        if (nocull)
                        {
                            drawParameters.technique = fr.zonlyRigidAlphaNoCullTechnique;
                        }
                        else
                        {
                            drawParameters.technique = fr.zonlyRigidAlphaTechnique;
                        }
                    }
                    else if (nocull)
                    {
                        drawParameters.technique = fr.zonlyRigidNoCullTechnique;
                    }
                    else
                    {
                        drawParameters.technique = fr.zonlyRigidTechnique;
                    }
                }

                var techniqueIndex = renderingCommonGetTechniqueIndexFn(drawParameters.technique.name);
                if (alpha)
                {
                    drawParameters.sortKey = renderingCommonSortKeyFn(sortOffset | techniqueIndex, meta.materialIndex);
                }
                else
                {
                    drawParameters.sortKey = renderingCommonSortKeyFn(sortOffset | techniqueIndex, node.rendererInfo.id);
                }
                //Now add common for world and skin data
                drawParameters.setTechniqueParameters(numTechniqueParameters, geometryInstanceTechniqueParameters);
            }

            //
            // Ambient Pass, which also does glow and lightmap.
            //
            if (!meta.transparent &&
                !meta.decal)
            {
                drawParameters = gd.createDrawParameters();
                drawParameters.userData = {};
                geometryInstance.prepareDrawParameters(drawParameters);
                drawParameters.userData.passIndex = fr.passIndex.ambient;
                geometryInstance.drawParameters.push(drawParameters);

                if (geometryInstance.skinController)
                {
                    if (sharedMaterialTechniqueParameters.glow_map)
                    {
                        if (sharedMaterialTechniqueParameters.diffuse)
                        {
                            drawParameters.technique = fr.ambientGlowmapSkinnedTechnique;
                        }
                        else
                        {
                            drawParameters.technique = fr.glowmapSkinnedTechnique;
                        }
                    }
                    else if (0 === techniqueName.indexOf("flat"))
                    {
                        drawParameters.technique = fr.ambientFlatSkinnedTechnique;
                    }
                    else
                    {
                        drawParameters.technique = fr.ambientSkinnedTechnique;
                    }
                }
                else
                {
                    if (sharedMaterialTechniqueParameters.light_map)
                    {
                        drawParameters.technique = fr.ambientLightmapRigidTechnique;
                    }
                    else if (sharedMaterialTechniqueParameters.glow_map)
                    {
                        if (sharedMaterialTechniqueParameters.diffuse)
                        {
                            drawParameters.technique = fr.ambientGlowmapRigidTechnique;
                        }
                        else
                        {
                            drawParameters.technique = fr.glowmapRigidTechnique;
                        }
                    }
                    else if (0 === techniqueName.indexOf("flat"))
                    {
                        if (-1 !== techniqueName.indexOf("_nocull"))
                        {
                            drawParameters.technique = fr.ambientFlatRigidNoCullTechnique;
                        }
                        else
                        {
                            drawParameters.technique = fr.ambientFlatRigidTechnique;
                        }
                    }
                    else if (-1 !== techniqueName.indexOf("_alpha"))
                    {
                        drawParameters.technique = fr.ambientRigidAlphaTechnique;
                    }
                    else
                    {
                        drawParameters.technique = fr.ambientRigidTechnique;
                    }
                }
                drawParameters.sortKey = renderingCommonSortKeyFn(sortOffset | renderingCommonGetTechniqueIndexFn(drawParameters.technique.name),
                                                                  meta.materialIndex);
                //Now add common for world and skin data. materialColor is also copied here.
                drawParameters.setTechniqueParameters(0, sharedMaterialTechniqueParameters);
                drawParameters.setTechniqueParameters(1, geometryInstanceTechniqueParameters);
            }

            //
            // Diffuse Pass
            //
            drawParameters = gd.createDrawParameters();
            drawParameters.userData = {};
            geometryInstance.prepareDrawParameters(drawParameters);

            drawParameters.technique = this.technique;
            drawParameters.sortKey = renderingCommonSortKeyFn(sortOffset | this.techniqueIndex, meta.materialIndex);
            geometryInstance.renderUpdate = this.update;

            drawParameters.setTechniqueParameters(0, sharedMaterialTechniqueParameters);
            drawParameters.setTechniqueParameters(1, geometryInstanceTechniqueParameters);

            if (meta.decal)
            {
                drawParameters.userData.passIndex = fr.passIndex.decal;
                geometryInstance.drawParameters.push(drawParameters);
            }
            else if (meta.transparent)
            {
                drawParameters.userData.passIndex = fr.passIndex.transparent;
                geometryInstance.drawParameters.push(drawParameters);
            }
            else
            {
                // If technique name starts with "glowmap" or "lightmap" it is emissive only
                if (0 === techniqueName.indexOf("glowmap") ||
                    0 === techniqueName.indexOf("lightmap"))
                {
                    geometryInstance.diffuseDrawParameters = [];
                }
                else
                {
                    drawParameters.userData.passIndex = fr.passIndex.diffuse;
                    geometryInstance.diffuseDrawParameters = [drawParameters];
                }

                if (fr.shadowMaps && this.shadowTechnique)
                {
                    var shadowDrawParameters = gd.createDrawParameters();
                    shadowDrawParameters.userData = {};
                    geometryInstance.prepareDrawParameters(shadowDrawParameters);

                    shadowDrawParameters.technique = this.shadowTechnique;
                    shadowDrawParameters.sortKey = renderingCommonSortKeyFn(sortOffset | this.shadowTechniqueIndex,
                                                                            meta.materialIndex);
                    // for now force all shadows to be updated in the default update loop
                    //rendererInfo.renderUpdateShadow = this.shadowUpdate;

                    shadowDrawParameters.setTechniqueParameters(0, sharedMaterialTechniqueParameters);
                    shadowDrawParameters.setTechniqueParameters(1, geometryInstanceTechniqueParameters);

                    geometryInstance.diffuseShadowDrawParameters = [shadowDrawParameters];
                }
                else
                {
                    geometryInstance.diffuseShadowDrawParameters = geometryInstance.diffuseDrawParameters;
                }
            }

            //
            // shadow maps
            //
            if (fr.shadowMaps)
            {
                if (this.shadowMappingUpdate &&
                    !meta.noshadows)
                {
                    drawParameters = gd.createDrawParameters();
                    drawParameters.userData = {};
                    geometryInstance.prepareDrawParameters(drawParameters);
                    geometryInstance.shadowMappingDrawParameters = [drawParameters];

                    drawParameters.userData.passIndex = fr.passIndex.shadow;

                    rendererInfo.shadowMappingUpdate = this.shadowMappingUpdate;
                    drawParameters.technique = this.shadowMappingTechnique;

                    drawParameters.sortKey = renderingCommonSortKeyFn(this.shadowMappingTechniqueIndex,
                                                                      node.rendererInfo.id);

                    var shadowTechniqueParameters = gd.createTechniqueParameters();
                    geometryInstance.shadowTechniqueParameters = shadowTechniqueParameters;
                    drawParameters.setTechniqueParameters(0, shadowTechniqueParameters);
                }
                else
                {
                    meta.noshadows = true;
                }
            }
        };

        fr.defaultUpdateFn = forwardUpdate;
        fr.defaultSkinnedUpdateFn = forwardSkinnedUpdate;
        fr.defaultPrepareFn = forwardPrepare;


        var forwardSelfLitUpdate = function forwardSelfLitUpdateFn(camera)
        {
            var node = this.node;
            var rendererInfo = node.rendererInfo;
            if (rendererInfo.frameVisible !== node.frameVisible)
            {
                rendererInfo.frameVisible = node.frameVisible;
                updateNodeRendererInfo(node, rendererInfo, camera);
            }

            var techniqueParameters = this.techniqueParameters;
            techniqueParameters.worldView = rendererInfo.worldView;
        };

        var forwardSelfLitSkinnedUpdate = function forwardSelfLitSkinnedUpdateFn(camera)
        {
            var node = this.node;
            var rendererInfo = node.rendererInfo;
            if (rendererInfo.frameVisible !== node.frameVisible)
            {
                rendererInfo.frameVisible = node.frameVisible;
                updateNodeRendererInfo(node, rendererInfo, camera);
            }

            var techniqueParameters = this.techniqueParameters;
            techniqueParameters.worldView = rendererInfo.worldView;

            var skinController = this.skinController;
            if (skinController)
            {
                techniqueParameters.skinBones = skinController.output;
                skinController.update();
            }
        };

        var forwardSkyboxPrepare =
            function forwardSkyboxPrepareFn(geometryInstance)
        {
            var drawParameters;
            var geometryInstanceSharedMaterial = geometryInstance.sharedMaterial;
            var meta = geometryInstanceSharedMaterial.meta;
            var sharedMaterialTechniqueParameters = geometryInstanceSharedMaterial.techniqueParameters;
            var geometryInstanceTechniqueParameters = geometryInstance.techniqueParameters;
            geometryInstance.drawParameters = [];

            // glow pass
            drawParameters = gd.createDrawParameters();
            drawParameters.userData = {};
            geometryInstance.prepareDrawParameters(drawParameters);
            drawParameters.userData.passIndex = fr.passIndex.glow;
            drawParameters.technique = fr.skyboxTechnique;
            drawParameters.setTechniqueParameters(0, sharedMaterialTechniqueParameters);
            drawParameters.setTechniqueParameters(1, geometryInstanceTechniqueParameters);
            drawParameters.sortKey = renderingCommonSortKeyFn(renderingCommonGetTechniqueIndexFn(drawParameters.technique.name),
                                                              meta.materialIndex);
            geometryInstance.drawParameters.push(drawParameters);

            // ambient pass
            drawParameters = gd.createDrawParameters();
            drawParameters.userData = {};
            geometryInstance.prepareDrawParameters(drawParameters);
            drawParameters.userData.passIndex = fr.passIndex.ambient;
            drawParameters.technique = fr.skyboxTechnique;
            drawParameters.setTechniqueParameters(0, sharedMaterialTechniqueParameters);
            drawParameters.setTechniqueParameters(1, geometryInstanceTechniqueParameters);
            drawParameters.sortKey = renderingCommonSortKeyFn(opaqueSortOffset | renderingCommonGetTechniqueIndexFn(drawParameters.technique.name),
                                                              meta.materialIndex);
            geometryInstance.drawParameters.push(drawParameters);

            geometryInstance.diffuseDrawParameters = [];
            geometryInstance.diffuseShadowDrawParameters = [];
            geometryInstance.renderUpdate = this.update;
        };

        var forwardBlendUpdate = function forwardBlendUpdateFn(/* camera */)
        {
            this.techniqueParameters.world = this.node.world;
        };

        var forwardBlendSkinnedUpdate =
            function forwardBlendSkinnedUpdateFn(/* camera */)
        {
            var techniqueParameters = this.techniqueParameters;
            techniqueParameters.world = this.node.world;
            var skinController = this.skinController;
            if (skinController)
            {
                techniqueParameters.skinBones = skinController.output;
                skinController.update();
            }
        };

        var forwardSkyboxUpdate = function forwardSkyboxUpdateFn(/* camera */)
        {
            this.techniqueParameters.world = this.node.world;
        };

        var forwardEnvUpdate = function forwardEnvUpdateFn(/* camera */)
        {
            var techniqueParameters = this.techniqueParameters;
            var node = this.node;
            var worldUpdate = node.worldUpdate;
            if (this.techniqueParametersUpdated !== worldUpdate)
            {
                this.techniqueParametersUpdated = worldUpdate;
                var matrix = node.world;
                techniqueParameters.world = matrix;
                techniqueParameters.worldInverseTranspose = md.m33InverseTranspose(matrix, techniqueParameters.worldInverseTranspose);
            }
        };

        var forwardEnvSkinnedUpdate =
            function forwardEnvSkinnedUpdateFn(/* camera */)
        {
            var techniqueParameters = this.techniqueParameters;
            var node = this.node;
            var worldUpdate = node.worldUpdate;
            if (this.techniqueParametersUpdated !== worldUpdate)
            {
                this.techniqueParametersUpdated = worldUpdate;
                var matrix = node.world;
                techniqueParameters.world = matrix;
                techniqueParameters.worldInverseTranspose = md.m33InverseTranspose(matrix, techniqueParameters.worldInverseTranspose);
            }
            var skinController = this.skinController;
            if (skinController)
            {
                techniqueParameters.skinBones = skinController.output;
                skinController.update();
            }
        };

        var forwardFlarePrepare =
            function forwardFlarePrepareFn(geometryInstance)
        {
            if (!geometryInstance.customGeometry)
            {
                geometryInstance.customGeometry = true;

                if (!flareIndexBuffer)
                {
                    flareIndexBuffer = gd.createIndexBuffer({
                        numIndices: 8,
                        format: 'USHORT',
                        dynamic: false,
                        data: [1, 0, 2, 5, 4, 3, 2, 1]
                    });

                    flareSemantics = gd.createSemantics(['POSITION', 'TEXCOORD']);

                    flareVertexData = new VMathArrayConstructor(6 * (3 + 2));
                }

                var oldGeometry = geometryInstance.geometry;
                var oldSemantics = oldGeometry.semantics;
                var oldVertexBuffer = oldGeometry.vertexBuffer;
                var oldSurface = geometryInstance.surface;
                var oldVertexData = oldSurface.vertexData;
                var oldIndexData = oldSurface.indexData;

                var vertexBuffer = gd.createVertexBuffer({
                    numVertices: 6,
                    attributes: ['FLOAT3', 'FLOAT2'],
                    dynamic: true
                });

                var geometry = {
                    halfExtents: oldGeometry.halfExtents,
                    primitive: gd.PRIMITIVE_TRIANGLE_STRIP,
                    semantics: flareSemantics,
                    vertexBuffer: vertexBuffer,
                    numIndices: 8,
                    first: 0,
                    indexBuffer: flareIndexBuffer,
                    lastTimeVisible: true,
                    center: undefined,
                    sourceVertices: undefined
                };

                var oldCenter = oldGeometry.center;
                if (oldCenter)
                {
                    geometry.center = oldCenter;
                }

                geometryInstance.geometry = geometry;
                geometryInstance.surface = geometry;
                geometryInstance.semantics = flareSemantics;

                // Extract positions from old geometry
                //var sempos = gd.SEMANTIC_POSITION;
                var semnor = gd.SEMANTIC_NORMAL;
                var semtex = gd.SEMANTIC_TEXCOORD;
                var stride = oldVertexBuffer.stride;
                var offset = 0;
                if (oldSemantics[0] === semnor)
                {
                    offset += 3;
                    if (oldSemantics[1] === semtex)
                    {
                        offset += 2;
                    }
                }
                else if (oldSemantics[0] === semtex)
                {
                    offset += 2;
                    if (oldSemantics[1] === semnor)
                    {
                        offset += 3;
                    }
                }

                var faces;
                if (oldIndexData[3] !== 0 && oldIndexData[4] !== 0 && oldIndexData[5] !== 0)
                {
                    faces = [0, 2, 1, 3];
                }
                else if (oldIndexData[3] !== 1 && oldIndexData[4] !== 1 && oldIndexData[5] !== 1)
                {
                    faces = [1, 0, 2, 3];
                }
                else //if (oldIndexData[3] !== 2 && oldIndexData[4] !== 2 && oldIndexData[5] !== 2)
                {
                    faces = [3, 0, 1, 2];
                }
                oldIndexData = null;

                var tlOff = (faces[0] * stride + offset);
                var trOff = (faces[1] * stride + offset);
                var blOff = (faces[2] * stride + offset);
                var brOff = (faces[3] * stride + offset);
                var v00 = oldVertexData[tlOff + 0];
                var v01 = oldVertexData[tlOff + 1];
                var v02 = oldVertexData[tlOff + 2];
                var v10 = oldVertexData[trOff + 0];
                var v11 = oldVertexData[trOff + 1];
                var v12 = oldVertexData[trOff + 2];
                var v20 = oldVertexData[blOff + 0];
                var v21 = oldVertexData[blOff + 1];
                var v22 = oldVertexData[blOff + 2];
                var v30 = oldVertexData[brOff + 0];
                var v31 = oldVertexData[brOff + 1];
                var v32 = oldVertexData[brOff + 2];
                oldVertexData = null;

                var va01 = md.v3Build((v00 + v10) * 0.5, (v01 + v11) * 0.5, (v02 + v12) * 0.5);
                var va02 = md.v3Build((v00 + v20) * 0.5, (v01 + v21) * 0.5, (v02 + v22) * 0.5);
                var va13 = md.v3Build((v10 + v30) * 0.5, (v11 + v31) * 0.5, (v12 + v32) * 0.5);
                var va23 = md.v3Build((v20 + v30) * 0.5, (v21 + v31) * 0.5, (v22 + v32) * 0.5);

                var oldTop, oldBottom;
                if (VMath.v3LengthSq(VMath.v3Sub(va01, va23)) > VMath.v3LengthSq(VMath.v3Sub(va02, va13)))
                {
                    oldTop    = va01;
                    oldBottom = va23;
                }
                else
                {
                    oldTop    = va02;
                    oldBottom = va13;
                }

                var c10 = VMath.v3Normalize(md.v3Build(v10 - v00, v11 - v01, v12 - v02));
                var c20 = VMath.v3Normalize(md.v3Build(v20 - v00, v21 - v01, v22 - v02));
                var oldNormal = VMath.v3Cross(c10, c20);

                geometry.sourceVertices = [oldTop, oldBottom, oldNormal];

                oldGeometry.reference.remove();

                forwardPrepare.call(this, geometryInstance);
            }
        };

        var forwardFlareUpdate = function forwardFlareUpdateFn(camera)
        {
            var geometry = this.geometry;
            var node = this.node;

            var top, bottom, normal, tb;
            var top0, top1, top2, bottom0, bottom1, bottom2, tb0, tb1, tb2, normal0, normal1, normal2;
            var worldUpdate = node.worldUpdate;
            if (this.techniqueParametersUpdated !== worldUpdate)
            {
                this.techniqueParametersUpdated = worldUpdate;
                var matrix = node.world;
                this.techniqueParameters.world = md.m43BuildIdentity();
                var sourceVertices = geometry.sourceVertices;
                top    = md.m43TransformPoint(matrix, sourceVertices[0], geometry.top);
                bottom = md.m43TransformPoint(matrix, sourceVertices[1], geometry.bottom);
                normal = md.m43TransformVector(matrix, sourceVertices[2], geometry.normal);
                top0 = top[0];
                top1 = top[1];
                top2 = top[2];
                bottom0 = bottom[0];
                bottom1 = bottom[1];
                bottom2 = bottom[2];
                normal0 = normal[0];
                normal1 = normal[1];
                normal2 = normal[2];
                // Normalize top to bottom
                tb0 = (top0 - bottom0);
                tb1 = (top1 - bottom1);
                tb2 = (top2 - bottom2);
                var tblensq = ((tb0 * tb0) + (tb1 * tb1) + (tb2 * tb2));
                var tblenrec = (tblensq > 0.0 ? (1.0 / Math.sqrt(tblensq)) : 0);
                tb0 *= tblenrec;
                tb1 *= tblenrec;
                tb2 *= tblenrec;
                if (node.dynamic)
                {
                    geometry.top    = top;
                    geometry.bottom = bottom;
                    geometry.normal = normal;
                }
                else
                {
                    geometry.top    = [top0, top1, top2];
                    geometry.bottom = [bottom0, bottom1, bottom2];
                    geometry.normal = [normal0, normal1, normal2];
                }
                geometry.tb     = [tb0, tb1, tb2];
            }
            else
            {
                top    = geometry.top;
                bottom = geometry.bottom;
                tb     = geometry.tb;
                normal = geometry.normal;
                top0 = top[0];
                top1 = top[1];
                top2 = top[2];
                bottom0 = bottom[0];
                bottom1 = bottom[1];
                bottom2 = bottom[2];
                tb0 = tb[0];
                tb1 = tb[1];
                tb2 = tb[2];
                normal0 = normal[0];
                normal1 = normal[1];
                normal2 = normal[2];
            }

            var vertexBuffer = geometry.vertexBuffer;
            var cameraMatrix = camera.matrix;
            var cameraToBottom0 = (bottom0 - cameraMatrix[9]);
            var cameraToBottom1 = (bottom1 - cameraMatrix[10]);
            var cameraToBottom2 = (bottom2 - cameraMatrix[11]);
            if (((normal0 * cameraToBottom0) + (normal1 * cameraToBottom1) + (normal2 * cameraToBottom2)) < 0)
            {
                geometry.lastTimeVisible = true;

                var flareScale = this.sharedMaterial.meta.flareScale;

                // Normalize camera to bottom
                var ctblensq = ((cameraToBottom0 * cameraToBottom0) + (cameraToBottom1 * cameraToBottom1) + (cameraToBottom2 * cameraToBottom2));
                var ctblenrec = (ctblensq > 0.0 ? (1.0 / Math.sqrt(ctblensq)) : 0);
                cameraToBottom0 *= ctblenrec;
                cameraToBottom1 *= ctblenrec;
                cameraToBottom2 *= ctblenrec;

                // Cross camera to bottom with top to bottom
                var flareRight0 = ((cameraToBottom1 * tb2) - (cameraToBottom2 * tb1));
                var flareRight1 = ((cameraToBottom2 * tb0) - (cameraToBottom0 * tb2));
                var flareRight2 = ((cameraToBottom0 * tb1) - (cameraToBottom1 * tb0));

                // Cross flareRight with camera to bottom
                var flareUp0 = ((flareRight1 * cameraToBottom2) - (flareRight2 * cameraToBottom1));
                var flareUp1 = ((flareRight2 * cameraToBottom0) - (flareRight0 * cameraToBottom2));
                var flareUp2 = ((flareRight0 * cameraToBottom1) - (flareRight1 * cameraToBottom0));

                // Scale axis
                flareRight0 *= flareScale;
                flareRight1 *= flareScale;
                flareRight2 *= flareScale;
                flareUp0    *= flareScale;
                flareUp1    *= flareScale;
                flareUp2    *= flareScale;

                var atScale  = (-2.5 * flareScale);
                var flareAt0 = (cameraToBottom0 * atScale);
                var flareAt1 = (cameraToBottom1 * atScale);
                var flareAt2 = (cameraToBottom2 * atScale);

                flareVertexData[0] = (top0    - flareRight0 + flareUp0 + flareAt0);
                flareVertexData[1] = (top1    - flareRight1 + flareUp1 + flareAt1);
                flareVertexData[2] = (top2    - flareRight2 + flareUp2 + flareAt2);
                flareVertexData[3] = 1.0;
                flareVertexData[4] = 0.0;

                flareVertexData[5] = (top0    + flareRight0 + flareUp0 + flareAt0);
                flareVertexData[6] = (top1    + flareRight1 + flareUp1 + flareAt1);
                flareVertexData[7] = (top2    + flareRight2 + flareUp2 + flareAt2);
                flareVertexData[8] = 1.0;
                flareVertexData[9] = 1.0;

                flareVertexData[10] = top0;
                flareVertexData[11] = top1;
                flareVertexData[12] = top2;
                flareVertexData[13] = 0.5;
                flareVertexData[14] = 0.0;

                flareVertexData[15] = (bottom0 + flareRight0 - flareUp0 + flareAt0);
                flareVertexData[16] = (bottom1 + flareRight1 - flareUp1 + flareAt1);
                flareVertexData[17] = (bottom2 + flareRight2 - flareUp2 + flareAt2);
                flareVertexData[18] = 1.0;
                flareVertexData[19] = 0.0;

                flareVertexData[20] = bottom0;
                flareVertexData[21] = bottom1;
                flareVertexData[22] = bottom2;
                flareVertexData[23] = 0.5;
                flareVertexData[24] = 1.0;

                flareVertexData[25] = (bottom0 - flareRight0 - flareUp0 + flareAt0);
                flareVertexData[26] = (bottom1 - flareRight1 - flareUp1 + flareAt1);
                flareVertexData[27] = (bottom2 - flareRight2 - flareUp2 + flareAt2);
                flareVertexData[28] = 1.0;
                flareVertexData[29] = 1.0;

                vertexBuffer.setData(flareVertexData, 0, 6);
            }
            else
            {
                if (geometry.lastTimeVisible)
                {
                    geometry.lastTimeVisible = false;

                    var n;
                    for (n = 0; n < 30; n += 1)
                    {
                        flareVertexData[n] = 0;
                    }

                    vertexBuffer.setData(flareVertexData, 0, 6);
                }
            }
        };

        var loadTechniques = function loadTechniquesFn(shaderManager)
        {
            var that = this;

            var callback = function shaderLoadedCallbackFn(shader)
            {
                that.shader = shader;
                that.technique = shader.getTechnique(that.techniqueName);
                that.techniqueIndex =  renderingCommonGetTechniqueIndexFn(that.techniqueName);
            };
            shaderManager.load(this.shaderName, callback);

            if (fr.shadowMaps)
            {
                if (this.shadowMappingTechniqueName)
                {
                    var shadowMappingCallback = function shaderLoadedShadowMappingCallbackFn(shader)
                    {
                        that.shadowMappingShader = shader;
                        that.shadowMappingTechnique = shader.getTechnique(that.shadowMappingTechniqueName);
                        that.shadowMappingTechniqueIndex = renderingCommonGetTechniqueIndexFn(that.shadowMappingTechniqueName);
                    };
                    shaderManager.load(this.shadowMappingShaderName, shadowMappingCallback);
                }

                if (this.shadowTechniqueName)
                {
                    var shadowCallback = function shaderLoadedShadowCallbackFn(shader)
                    {
                        that.shadowShader = shader;
                        that.shadowTechnique = shader.getTechnique(that.shadowTechniqueName);
                        that.shadowTechniqueIndex = renderingCommonGetTechniqueIndexFn(that.shadowTechniqueName);
                    };
                    shaderManager.load(this.shadowShaderName, shadowCallback);
                }
            }
        };

        var effect;
        var effectTypeData;
        var skinned = "skinned";
        var rigid = "rigid";

        //
        // rxgb_normalmap
        //
        effect = Effect.create("rxgb_normalmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // rxgb_normalmap_specularmap
        //
        effect = Effect.create("rxgb_normalmap_specularmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_specularmap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_specularmap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_specularmap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_specularmap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // rxgb_normalmap_alphatest
        //
        effect = Effect.create("rxgb_normalmap_alphatest");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_alphatest",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_alphatest_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_alphatest_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_alphatest_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // rxgb_normalmap_specularmap_alphatest
        //
        effect = Effect.create("rxgb_normalmap_specularmap_alphatest");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_specularmap_alphatest",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_specularmap_alphatest_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_specularmap_alphatest_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_specularmap_alphatest_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // rxgb_normalmap_glowmap
        //
        effect = Effect.create("rxgb_normalmap_glowmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_glowmap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_glowmap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_glowmap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_glowmap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // rxgb_normalmap_specularmap_glowmap
        //
        effect = Effect.create("rxgb_normalmap_specularmap_glowmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_specularmap_glowmap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_specularmap_glowmap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "rxgb_normalmap_specularmap_glowmap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "rxgb_normalmap_specularmap_glowmap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // add
        //
        effect = Effect.create("add");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "add",
                            update : forwardBlendUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "add_skinned",
                            update : forwardBlendSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // add_particle
        //
        effect = Effect.create("add_particle");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "add_particle",
                            update : forwardBlendUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // blend
        //
        effect = Effect.create("blend");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "blend",
                            update : forwardBlendUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "blend_skinned",
                            update : forwardBlendSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // blend_particle
        //
        effect = Effect.create("blend_particle");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "blend_particle",
                            update : forwardBlendUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // translucent
        //
        effect = Effect.create("translucent");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "translucent",
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            update : forwardBlendUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "translucent_skinned",
                            update : forwardBlendSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // translucent_particle
        //
        effect = Effect.create("translucent_particle");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "translucent_particle",
                            update : forwardBlendUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // filter
        //
        effect = Effect.create("filter");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "filter",
                            update : forwardBlendUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "filter_skinned",
                            update : forwardBlendSkinnedUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // invfilter
        //
        effect = Effect.create("invfilter");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "invfilter",
                            update : forwardBlendUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // invfilter_particle
        //
        effect = Effect.create("invfilter_particle");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "invfilter_particle",
                            update : forwardBlendUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // glass
        //
        effect = Effect.create("glass");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "glass",
                            update : forwardBlendUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // glass_env
        //
        effect = Effect.create("glass_env");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "glass_env",
                            update : forwardEnvUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // modulate2
        //
        effect = Effect.create("modulate2");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "modulate2",
                            update : forwardBlendUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "modulate2_skinned",
                            update : forwardBlendSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // skybox
        //
        effect = Effect.create("skybox");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardSkyboxPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "skybox",
                            update : forwardSkyboxUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // env
        //
        effect = Effect.create("env");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "env",
                            update : forwardEnvUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "env_skinned",
                            update : forwardEnvSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // flare
        //
        effect = Effect.create("flare");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardFlarePrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "add",
                            update : forwardFlareUpdate,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // blinn
        //
        effect = Effect.create("blinn");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "blinn",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "blinn_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "blinn_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "blinn_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // blinn_nocull
        //
        effect = Effect.create("blinn_nocull");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "blinn_nocull",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "blinn_shadows_nocull",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "blinn_skinned_nocull",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "blinn_skinned_shadows_nocull",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // normalmap
        //
        effect = Effect.create("normalmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // normalmap_specularmap
        //
        effect = Effect.create("normalmap_specularmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_specularmap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_specularmap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_specularmap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_specularmap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // normalmap_specularmap_alphamap
        //
        effect = Effect.create("normalmap_specularmap_alphamap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_specularmap_alphamap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_specularmap_alphamap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_specularmap_alphamap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_specularmap_alphamap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // normalmap_alphatest
        //
        effect = Effect.create("normalmap_alphatest");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_alphatest",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_alphatest_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        //
        // normalmap_specularmap_alphatest
        //
        effect = Effect.create("normalmap_specularmap_alphatest");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_specularmap_alphatest",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_specularmap_alphatest_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_specularmap_alphatest_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_specularmap_alphatest_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // normalmap_glowmap
        //
        effect = Effect.create("normalmap_glowmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_glowmap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_glowmap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_glowmap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_glowmap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // normalmap_specularmap_glowmap
        //
        effect = Effect.create("normalmap_specularmap_glowmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_specularmap_glowmap",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_specularmap_glowmap_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "normalmap_specularmap_glowmap_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "normalmap_specularmap_glowmap_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        effectManager.map("default", "blinn");
        effectManager.map("lambert", "blinn");
        effectManager.map("phong", "blinn");

        //
        // glowmap
        //
        effect = Effect.create("glowmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "glowmap",
                            update : forwardSelfLitUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "glowmap_skinned",
                            update : forwardSelfLitSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // constant
        //
        effect = Effect.create("constant");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "flat",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "flat_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "flat_skinned",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "flat_skinned_shadows",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // constant_nocull
        //
        effect = Effect.create("constant_nocull");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "flat_nocull",
                            update : forwardUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "flat_shadows_nocull",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "flat_skinned_nocull",
                            update : forwardSkinnedUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "skinned",
                            shadowMappingUpdate : shadowMappingSkinnedUpdateFn,
                            shadowShaderName : "shaders/forwardrenderingshadows.cgfx",
                            shadowTechniqueName : "flat_skinned_shadows_nocull",
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(skinned, effectTypeData);

        //
        // lightmap
        //
        effect = Effect.create("lightmap");
        effectManager.add(effect);

        effectTypeData = {  prepare : forwardPrepare,
                            shaderName : "shaders/forwardrendering.cgfx",
                            techniqueName : "lightmap",
                            update : forwardSelfLitUpdate,
                            shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                            shadowMappingTechniqueName : "rigid",
                            shadowMappingUpdate : shadowMappingUpdateFn,
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(rigid, effectTypeData);

        return fr;
    };
};
