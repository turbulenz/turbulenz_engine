// Copyright (c) 2010-2013 Turbulenz Limited
/*global Scene*/
/*global Geometry*/
/*global GeometryInstance*/
/*global Utilities*/
/*global TurbulenzEngine*/

/// <reference path="scene.ts" />

interface SceneDebuggingMetrics
{
    numPortals       : number;
    numPortalsPlanes : number;
    numLights        : number;
    numRenderables   : number;
    numShadowMaps    : number;
    numOccluders     : number;
};

//
// Scene debugging methods
//


//
// getMaterialName
//
Scene.prototype.getMaterialName = function getMaterialNameFn(node)
{
    var names = [];

    var materials = this.materials;
    function addMaterialName(material, nameList)
    {
        for (var m in materials)
        {
            if (materials.hasOwnProperty(m))
            {
                if (material === materials[m])
                {
                    nameList.push(m);
                }
            }
        }
    }

    var material = node.sharedMaterial;
    if (material)
    {
        addMaterialName(material, names);
    }

    var renderables = node.renderables;
    if (renderables)
    {
        var numRenderables = renderables.length;
        for (var i = 0; i < numRenderables; i += 1)
        {
            var renderable = renderables[i];
            material = renderable.sharedMaterial;
            addMaterialName(material, names);
        }
    }

    var lights = node.lightInstances;
    if (lights)
    {
        var numLights = lights.length;
        for (var l = 0; l < numLights; l += 1)
        {
            var light = lights[l];
            material = light.material;
            addMaterialName(material, names);
        }
    }

    if (names.length)
    {
        if (names.length === 1)
        {
            return names[0];
        }
        else
        {
            return names;
        }
    }

    return undefined;
};

//
// findLightName
//
Scene.prototype.findLightName = function findLightNameFn(light)
{
    var lights = this.lights;
    for (var n in lights)
    {
        if (lights.hasOwnProperty(n))
        {
            if (light === lights[n])
            {
                return n;
            }
        }
    }
    return undefined;
};

//
// writeBox
//
Scene.prototype.writeBox = function sceneWriteBoxFn(writer, extents, r, g, b)
{
    var p0 = extents[0];
    var p1 = extents[1];
    var p2 = extents[2];
    var n0 = extents[3];
    var n1 = extents[4];
    var n2 = extents[5];

    writer(p0, p1, p2, r, g, b);
    writer(p0, p1, n2, r, g, b);

    writer(p0, p1, p2, r, g, b);
    writer(p0, n1, p2, r, g, b);

    writer(p0, p1, p2, r, g, b);
    writer(n0, p1, p2, r, g, b);

    writer(n0, n1, n2, r, g, b);
    writer(n0, n1, p2, r, g, b);

    writer(n0, n1, n2, r, g, b);
    writer(n0, p1, n2, r, g, b);

    writer(n0, n1, n2, r, g, b);
    writer(p0, n1, n2, r, g, b);

    writer(p0, n1, n2, r, g, b);
    writer(p0, n1, p2, r, g, b);

    writer(p0, n1, n2, r, g, b);
    writer(p0, p1, n2, r, g, b);

    writer(n0, n1, p2, r, g, b);
    writer(p0, n1, p2, r, g, b);

    writer(n0, n1, p2, r, g, b);
    writer(n0, p1, p2, r, g, b);

    writer(n0, p1, n2, r, g, b);
    writer(p0, p1, n2, r, g, b);

    writer(n0, p1, n2, r, g, b);
    writer(n0, p1, p2, r, g, b);
};

//
// writeRotatedBox
//
Scene.prototype.writeRotatedBox = function sceneWriteRotatedBoxFn(writer, transform, halfExtents, r, g, b)
{
    var m0 = transform[0];
    var m1 = transform[1];
    var m2 = transform[2];
    var m3 = transform[3];
    var m4 = transform[4];
    var m5 = transform[5];
    var m6 = transform[6];
    var m7 = transform[7];
    var m8 = transform[8];
    var m9 = transform[9];
    var m10 = transform[10];
    var m11 = transform[11];

    var hx = halfExtents[0];
    var hy = halfExtents[1];
    var hz = halfExtents[2];

    var hx0 = (m0 * hx);
    var hx1 = (m1 * hx);
    var hx2 = (m2 * hx);
    var hy3 = (m3 * hy);
    var hy4 = (m4 * hy);
    var hy5 = (m5 * hy);
    var hz6 = (m6 * hz);
    var hz7 = (m7 * hz);
    var hz8 = (m8 * hz);

    var p0x = (m9  - hx0 - hy3 - hz6);
    var p0y = (m10 - hx1 - hy4 - hz7);
    var p0z = (m11 - hx2 - hy5 - hz8);
    var p1x = (m9  + hx0 - hy3 - hz6);
    var p1y = (m10 + hx1 - hy4 - hz7);
    var p1z = (m11 + hx2 - hy5 - hz8);
    var p2x = (m9  + hx0 - hy3 + hz6);
    var p2y = (m10 + hx1 - hy4 + hz7);
    var p2z = (m11 + hx2 - hy5 + hz8);
    var p3x = (m9  - hx0 - hy3 + hz6);
    var p3y = (m10 - hx1 - hy4 + hz7);
    var p3z = (m11 - hx2 - hy5 + hz8);
    var p4x = (m9  - hx0 + hy3 - hz6);
    var p4y = (m10 - hx1 + hy4 - hz7);
    var p4z = (m11 - hx2 + hy5 - hz8);
    var p5x = (m9  + hx0 + hy3 - hz6);
    var p5y = (m10 + hx1 + hy4 - hz7);
    var p5z = (m11 + hx2 + hy5 - hz8);
    var p6x = (m9  + hx0 + hy3 + hz6);
    var p6y = (m10 + hx1 + hy4 + hz7);
    var p6z = (m11 + hx2 + hy5 + hz8);
    var p7x = (m9  - hx0 + hy3 + hz6);
    var p7y = (m10 - hx1 + hy4 + hz7);
    var p7z = (m11 - hx2 + hy5 + hz8);

    writer(p0x, p0y, p0z, r, g, b);
    writer(p1x, p1y, p1z, r, g, b);

    writer(p1x, p1y, p1z, r, g, b);
    writer(p2x, p2y, p2z, r, g, b);

    writer(p2x, p2y, p2z, r, g, b);
    writer(p3x, p3y, p3z, r, g, b);

    writer(p3x, p3y, p3z, r, g, b);
    writer(p0x, p0y, p0z, r, g, b);

    writer(p0x, p0y, p0z, r, g, b);
    writer(p4x, p4y, p4z, r, g, b);

    writer(p1x, p1y, p1z, r, g, b);
    writer(p5x, p5y, p5z, r, g, b);

    writer(p2x, p2y, p2z, r, g, b);
    writer(p6x, p6y, p6z, r, g, b);

    writer(p3x, p3y, p3z, r, g, b);
    writer(p7x, p7y, p7z, r, g, b);

    writer(p4x, p4y, p4z, r, g, b);
    writer(p5x, p5y, p5z, r, g, b);

    writer(p5x, p5y, p5z, r, g, b);
    writer(p6x, p6y, p6z, r, g, b);

    writer(p6x, p6y, p6z, r, g, b);
    writer(p7x, p7y, p7z, r, g, b);

    writer(p7x, p7y, p7z, r, g, b);
    writer(p4x, p4y, p4z, r, g, b);
};

//
// drawLights
//
Scene.prototype.drawLights = function sceneDrawLightsFn(gd, sm, camera)
{
    var visibleNodes = this.visibleNodes;
    var numVisibleNodes = visibleNodes.length;
    if (numVisibleNodes > 0)
    {
        var node, lights, numLights, lightInstance, light, l;
        var numSpot = 0;
        var numPoint = 0;
        var numFog = 0;
        var n = 0;
        do
        {
            node = visibleNodes[n];

            lights = node.lightInstances;
            if (lights)
            {
                numLights = lights.length;
                for (l = 0; l < numLights; l += 1)
                {
                    lightInstance = lights[l];
                    light = lightInstance.light;
                    if (light)
                    {
                        if (light.global)
                        {
                            n += 1;
                            continue;
                        }

                        if (light.spot)
                        {
                            numSpot += 1;
                        }
                        else if (light.fog)
                        {
                            numFog += 1;
                        }
                        else
                        {
                            numPoint += 1;
                        }
                    }
                }
            }

            n += 1;
        }
        while (n < numVisibleNodes);


        if (0 === numPoint && 0 === numSpot && 0 === numFog)
        {
            return;
        }

        var shader = sm.load("shaders/debug.cgfx");
        var technique = shader.getTechnique("debug_lines");
        if (!technique)
        {
            return;
        }

        gd.setTechnique(technique);

        var techniqueParameters = this.debugLinesTechniqueParameters;
        if (!techniqueParameters)
        {
            techniqueParameters = gd.createTechniqueParameters({
                worldViewProjection: camera.viewProjectionMatrix
            });
            this.debugLinesTechniqueParameters = techniqueParameters;
        }
        else
        {
            techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
        }

        gd.setTechniqueParameters(techniqueParameters);

        var sem = this.getDebugSemanticsPosCol();
        var vformatFloat3 = gd.VERTEXFORMAT_FLOAT3;
        var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                  ((24 * numPoint) + (16 * numSpot) + (24 * numFog)),
                                  [ vformatFloat3, vformatFloat3 ],
                                  sem);
        if (writer)
        {
            var md = this.md;
            var matrix, color, r, g, b, halfExtents, center;

            n = 0;
            do
            {
                node = visibleNodes[n];

                lights = node.lightInstances;
                if (lights)
                {
                    numLights = lights.length;
                    for (l = 0; l < numLights; l += 1)
                    {
                        lightInstance = lights[l];
                        light = lightInstance.light;
                        if (light)
                        {
                            if (light.global)
                            {
                                n += 1;
                                continue;
                            }

                            matrix = node.world;
                            color = light.color;
                            r = color[0];
                            g = color[1];
                            b = color[2];

                            if (light.spot)
                            {
                                var transform = md.m33MulM43(light.frustum, matrix);
                                var p0 = md.m43TransformPoint(transform, md.v3Build(-1, -1, 1));
                                var p1 = md.m43TransformPoint(transform, md.v3Build(1, -1, 1));
                                var p2 = md.m43TransformPoint(transform, md.v3Build(-1, 1, 1));
                                var p3 = md.m43TransformPoint(transform, md.v3Build(1, 1, 1));
                                var st = md.m43Pos(matrix);
                                writer(st, r, g, b);
                                writer(p0, r, g, b);
                                writer(st, r, g, b);
                                writer(p1, r, g, b);
                                writer(st, r, g, b);
                                writer(p2, r, g, b);
                                writer(st, r, g, b);
                                writer(p3, r, g, b);
                                writer(p0, r, g, b);
                                writer(p1, r, g, b);
                                writer(p1, r, g, b);
                                writer(p3, r, g, b);
                                writer(p3, r, g, b);
                                writer(p2, r, g, b);
                                writer(p2, r, g, b);
                                writer(p0, r, g, b);
                            }
                            else if (light.fog)
                            {
                                halfExtents = light.halfExtents;
                                this.writeRotatedBox(writer, matrix, halfExtents, r, g, b);
                            }
                            else
                            {
                                halfExtents = light.halfExtents;
                                center = light.center;
                                if (center)
                                {
                                    matrix = md.m43Offset(matrix, center);
                                }
                                this.writeRotatedBox(writer, matrix, halfExtents, r, g, b);
                            }
                        }
                    }
                }

                n += 1;
            }
            while (n < numVisibleNodes);

            gd.endDraw(writer);
        }
    }
};

//
// drawLightsExtents
//
Scene.prototype.drawLightsExtents = function sceneDrawLightsExtentsFn(gd, sm, camera)
{
    var visibleLights = this.visibleLights;
    var numVisibleLights = visibleLights.length;
    if (numVisibleLights > 0)
    {
        var lightInstance, light;
        var numLights = 0;
        var n = 0;
        do
        {
            lightInstance = visibleLights[n];
            light = lightInstance.light;
            if (light)
            {
                if (light.global)
                {
                    n += 1;
                    continue;
                }

                numLights += 1;
            }

            n += 1;
        }
        while (n < numVisibleLights);


        if (0 === numLights)
        {
            return;
        }

        var shader = sm.load("shaders/debug.cgfx");
        var technique = shader.getTechnique("debug_lines");
        if (!technique)
        {
            return;
        }

        gd.setTechnique(technique);

        var techniqueParameters = this.debugLinesTechniqueParameters;
        if (!techniqueParameters)
        {
            techniqueParameters = gd.createTechniqueParameters({
                worldViewProjection: camera.viewProjectionMatrix
            });
            this.debugLinesTechniqueParameters = techniqueParameters;
        }
        else
        {
            techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
        }

        gd.setTechniqueParameters(techniqueParameters);

        var sem = this.getDebugSemanticsPosCol();
        var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                  (24 * numLights),
                                  [ gd.VERTEXFORMAT_FLOAT3,
                                    gd.VERTEXFORMAT_FLOAT3 ],
                                  sem);
        if (writer)
        {
            var writeBox = this.writeBox;
            var extents, color, r, g, b;

            n = 0;
            do
            {
                lightInstance = visibleLights[n];
                light = lightInstance.light;
                if (light)
                {
                    if (light.global)
                    {
                        n += 1;
                        continue;
                    }

                    extents = lightInstance.getWorldExtents();
                    if (extents)
                    {
                        color = light.color;
                        r = color[0];
                        g = color[1];
                        b = color[2];

                        writeBox(writer, extents, r, g, b);
                    }
                }

                n += 1;
            }
            while (n < numVisibleLights);

            gd.endDraw(writer);
        }
    }
};

//
// drawLightsScreenExtents
//
Scene.prototype.drawLightsScreenExtents = function sceneDrawLightsScreenExtentsFn(gd, sm /*, camera */)
{
    var visibleLights = this.visibleLights;
    var numVisibleLights = visibleLights.length;
    if (numVisibleLights > 0)
    {
        var lightInstance, light;
        var numLights = 0;
        var n = 0;
        do
        {
            lightInstance = visibleLights[n];
            light = lightInstance.light;
            if (light)
            {
                if (light.global)
                {
                    n += 1;
                    continue;
                }

                if (lightInstance.screenExtents)
                {
                    numLights += 1;
                }
            }

            n += 1;
        }
        while (n < numVisibleLights);


        if (0 === numLights)
        {
            return;
        }

        var shader = sm.load("shaders/generic2D.cgfx");
        var technique = shader.getTechnique("vertexColor2D");
        if (!technique)
        {
            return;
        }

        gd.setTechnique(technique);

        technique.clipSpace = this.md.v4Build(1.0, 1.0, 0.0, 0.0);

        var sem = this.getDebugSemanticsPosCol();
        var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                  (8 * numLights),
                                  [ gd.VERTEXFORMAT_FLOAT2,
                                    gd.VERTEXFORMAT_FLOAT3 ],
                                  sem);
        if (writer)
        {
            var screenExtents, minX, maxX, minY, maxY, color, r, g, b;

            n = 0;
            do
            {
                lightInstance = visibleLights[n];
                light = lightInstance.light;
                if (light)
                {
                    if (light.global)
                    {
                        n += 1;
                        continue;
                    }

                    screenExtents = lightInstance.screenExtents;
                    if (screenExtents)
                    {
                        minX = screenExtents[0];
                        minY = screenExtents[1];
                        maxX = screenExtents[2];
                        maxY = screenExtents[3];

                        color = light.color;
                        r = color[0];
                        g = color[1];
                        b = color[2];

                        writer(minX, minY, r, g, b);
                        writer(minX, maxY, r, g, b);

                        writer(minX, maxY, r, g, b);
                        writer(maxX, maxY, r, g, b);

                        writer(maxX, maxY, r, g, b);
                        writer(maxX, minY, r, g, b);

                        writer(maxX, minY, r, g, b);
                        writer(minX, minY, r, g, b);
                    }
                }

                n += 1;
            }
            while (n < numVisibleLights);

            gd.endDraw(writer);
        }
    }
};

//
// drawAreas
//
Scene.prototype.drawAreas = function sceneDrawAreasFn(gd, sm, camera)
{
    var areas = this.areas;
    if (areas)
    {
        var shader = sm.load("shaders/debug.cgfx");
        var technique = shader.getTechnique("debug_lines");
        if (!technique)
        {
            return;
        }

        var isInsidePlanesAABB = this.isInsidePlanesAABB;
        var frustumPlanes = this.frustumPlanes;
        var visibleAreas = [];
        var numVisibleAreas = 0;
        var area, n;
        var areaIndex = this.cameraAreaIndex;//this.findAreaIndex(this.bspNodes, cameraMatrix[9], cameraMatrix[10], cameraMatrix[11]);
        if (areaIndex >= 0)
        {
            visibleAreas[numVisibleAreas] = areaIndex;
            numVisibleAreas += 1;

            var visiblePortals = this.visiblePortals;
            var numVisiblePortals = visiblePortals.length;
            for (n = 0; n < numVisiblePortals; n += 1)
            {
                visibleAreas[numVisibleAreas] = visiblePortals[n].area;
                numVisibleAreas += 1;
            }
        }
        else
        {
            var numAreas = areas.length;
            for (n = 0; n < numAreas; n += 1)
            {
                area = areas[n];
                if (isInsidePlanesAABB(area.extents, frustumPlanes))
                {
                    visibleAreas[numVisibleAreas] = n;
                    numVisibleAreas += 1;
                }
            }
        }

        if (!numVisibleAreas)
        {
            return;
        }

        gd.setTechnique(technique);

        var techniqueParameters = this.debugLinesTechniqueParameters;
        if (!techniqueParameters)
        {
            techniqueParameters = gd.createTechniqueParameters({
                worldViewProjection: camera.viewProjectionMatrix
            });
            this.debugLinesTechniqueParameters = techniqueParameters;
        }
        else
        {
            techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
        }

        gd.setTechniqueParameters(techniqueParameters);

        var sem = this.getDebugSemanticsPosCol();
        var vformatFloat3 = gd.VERTEXFORMAT_FLOAT3;
        var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                  (24 * numVisibleAreas),
                                  [ vformatFloat3, vformatFloat3 ],
                                  sem);
        if (writer)
        {
            var writeBox = this.writeBox;
            var r, g, b;

            for (n = 0; n < numVisibleAreas; n += 1)
            {
                areaIndex = visibleAreas[n];
                area = areas[areaIndex];

                var m = (areaIndex % 3);
                if (m === 0)
                {
                    r = 1;
                    g = 0;
                    b = 0;
                }
                else if (m === 1)
                {
                    r = 0;
                    g = 1;
                    b = 0;
                }
                else //if (m === 2)
                {
                    r = 0;
                    g = 0;
                    b = 1;
                }

                writeBox(writer, area.extents, r, g, b);
            }

            gd.endDraw(writer);
        }
    }
};

//
// drawPortals
//
Scene.prototype.drawPortals = function sceneDrawPortalsFn(gd, sm, camera)
{
    var areas = this.areas;
    if (areas)
    {
        var numVertices, area, n, portals, numPortals, np, portal;
        var points, numPoints, p, pointA, pointB;

        // First all portals in white
        var portalsToRender = [];
        var numAreas = areas.length;

        numVertices = 0;
        for (n = 0; n < numAreas; n += 1)
        {
            area = areas[n];
            portals = area.portals;
            numPortals = portals.length;
            for (np = 0; np < numPortals; np += 1)
            {
                portal = portals[np];
                portalsToRender.push(portal);
                numVertices += 2 * (portal.points.length);
            }
        }

        if (!numVertices)
        {
            return;
        }

        var shader = sm.load("shaders/debug.cgfx");
        var technique = shader.getTechnique("debug_lines_constant");
        if (!technique)
        {
            return;
        }

        gd.setTechnique(technique);

        var md = this.md;
        technique.worldViewProjection = camera.viewProjectionMatrix;
        technique.constantColor = md.v4Build(1.0, 1.0, 1.0, 1.0);

        var sem = this.getDebugSemanticsPos();
        var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                  numVertices,
                                  [gd.VERTEXFORMAT_FLOAT3],
                                  sem);
        if (writer)
        {
            var numPortalsToRender = portalsToRender.length;
            for (n = 0; n < numPortalsToRender; n += 1)
            {
                portal = portalsToRender[n];
                points = portal.points;
                numPoints = points.length;
                for (p = 0; p < numPoints; p += 1)
                {
                    pointA = (p > 0 ? points[p - 1] : points[numPoints - 1]);
                    pointB = points[p];
                    writer(pointA[0], pointA[1], pointA[2]);
                    writer(pointB[0], pointB[1], pointB[2]);
                }
            }

            gd.endDraw(writer);
        }

        // Now redraw visible ones in yellow
        // It has to be done in this order because portals pointing in oposite directions will have the same points
        var visiblePortals = this.visiblePortals;
        var numVisiblePortals = visiblePortals.length;

        numVertices = 0;
        for (n = 0; n < numVisiblePortals; n += 1)
        {
            portal = visiblePortals[n].portal;
            numVertices += 2 * (portal.points.length);
        }

        if (!numVertices)
        {
            return;
        }

        technique.constantColor = md.v4Build(1.0, 1.0, 0.0, 1.0);

        writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                              numVertices,
                              [gd.VERTEXFORMAT_FLOAT3],
                              sem);
        if (writer)
        {
            for (n = 0; n < numVisiblePortals; n += 1)
            {
                portal = visiblePortals[n].portal;
                points = portal.points;
                numPoints = points.length;
                for (p = 0; p < numPoints; p += 1)
                {
                    pointA = (p > 0 ? points[p - 1] : points[numPoints - 1]);
                    pointB = points[p];
                    writer(pointA[0], pointA[1], pointA[2]);
                    writer(pointB[0], pointB[1], pointB[2]);
                }
            }

            gd.endDraw(writer);
        }
    }
};

//
// drawTransforms
//
Scene.prototype.drawTransforms = function sceneDrawTransformsFn(gd, sm, camera, scale)
{
    var nodes = this.visibleNodes;
    var numNodes = nodes.length;
    if (numNodes)
    {
        var n, numVertices = 6 * (numNodes + 1);

        if (!numVertices)
        {
            return;
        }

        var shader = sm.load("shaders/debug.cgfx");
        var technique = shader.getTechnique("debug_lines");
        if (!technique)
        {
            return;
        }

        gd.setTechnique(technique);

        var techniqueParameters = this.debugLinesTechniqueParameters;
        if (!techniqueParameters)
        {
            techniqueParameters = gd.createTechniqueParameters({
                worldViewProjection: camera.viewProjectionMatrix
            });
            this.debugLinesTechniqueParameters = techniqueParameters;
        }
        else
        {
            techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
        }

        gd.setTechniqueParameters(techniqueParameters);

        var sem = this.getDebugSemanticsPosCol();
        var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                  numVertices,
                                  [gd.VERTEXFORMAT_FLOAT3, gd.VERTEXFORMAT_FLOAT3],
                                  sem);
        if (writer)
        {
            for (n = 0; n < numNodes; n += 1)
            {
                var node = nodes[n];
                var matrix = node.world;
                var px = matrix[9];
                var py = matrix[10];
                var pz = matrix[11];

                writer(px, py, pz, 1, 0, 0);
                writer(px + matrix[0] * scale, py + matrix[1] * scale, pz + matrix[2] * scale, 1, 0, 0);
                writer(px, py, pz, 0, 1, 0);
                writer(px + matrix[3] * scale, py + matrix[4] * scale, pz + matrix[5] * scale, 0, 1, 0);
                writer(px, py, pz, 0, 0, 1);
                writer(px + matrix[6] * scale, py + matrix[7] * scale, pz + matrix[8] * scale, 0, 0, 1);
            }

            writer(0, 0, 0, 0, 0, 0);
            writer(scale, 0, 0, 1, 0, 0);
            writer(0, 0, 0, 0, 0, 0);
            writer(0, scale, 0, 0, 1, 0);
            writer(0, 0, 0, 0, 0, 0);
            writer(0, 0, scale, 0, 0, 1);

            gd.endDraw(writer);

            writer = null;
        }
    }
};

//
// drawAnimationHierarchy
//
Scene.prototype.drawAnimationHierarchy = function sceneDrawAnimationHierarchyFn(gd, sm, camera, hierarchy, numJoints, controller, matrix, boneColor, boundsColor)
{
    var numBones = numJoints;
    var interp = controller;
    var bounds = interp.bounds;
    var numVertices = 2 * numBones; // one per end of bone
    var rBone = 0;
    var gBone = 0;
    var bBone = 0;
    var rBound = 1;
    var gBound = 0;
    var bBound = 0;
    if (boneColor)
    {
        rBone = boneColor[0];
        gBone = boneColor[1];
        bBone = boneColor[2];
    }
    if (boundsColor)
    {
        rBound = boundsColor[0];
        gBound = boundsColor[1];
        bBound = boundsColor[2];
    }
    if (bounds)
    {
        numVertices += 24; // and 24 for the bounds
    }

    if (!numVertices)
    {
        return;
    }

    var shader = sm.load("shaders/debug.cgfx");
    var technique = shader.getTechnique("debug_lines");
    if (!technique)
    {
        return;
    }

    gd.setTechnique(technique);

    var techniqueParameters = this.debugLinesTechniqueParameters;
    if (!techniqueParameters)
    {
        techniqueParameters = gd.createTechniqueParameters({
            worldViewProjection: camera.viewProjectionMatrix
        });
        this.debugLinesTechniqueParameters = techniqueParameters;
    }
    else
    {
        techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
    }

    gd.setTechniqueParameters(techniqueParameters);

    var sem = this.getDebugSemanticsPosCol();
    var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                              numVertices,
                              [gd.VERTEXFORMAT_FLOAT3, gd.VERTEXFORMAT_FLOAT3],
                              sem);
    if (writer)
    {
        var md = this.md;
        var m43TransformPoint = md.m43TransformPoint;
        var m43FromRTS = md.m43FromRTS;
        var m43FromQuatPos = md.m43FromQuatPos;
        var quatPosBuild = md.quatPosBuild;
        var m43Mul = md.m43Mul;
        var m43Pos = md.m43Pos;

        var jointParents = hierarchy.parents;
        interp.update();
        var interpOut = interp.output;
        var interpOutputChannels = interp.outputChannels;
        var hasScale = interpOutputChannels.scale;
        var ltms = []; // we cache the ltms as we build them
        var bone_matrix, quatPos;
        for (var n = 0; n < numBones; n += 1)
        {
            var parent = jointParents[n];

            var interpVal = interpOut[n];
            if (hasScale)
            {
                bone_matrix = m43FromRTS.call(md, interpVal.rotation, interpVal.translation, interpVal.scale, ltms[n]);
            }
            else
            {
                quatPos = quatPosBuild.call(md, interpVal.rotation, interpVal.translation, quatPos);
                bone_matrix = m43FromQuatPos.call(md, quatPos, ltms[n]);
            }

            if (parent !== -1)
            {
                bone_matrix = m43Mul.call(md, bone_matrix, ltms[parent], ltms[n]);
            }
            ltms[n] = bone_matrix;

            if (parent === -1)
            {
                continue;
            }

            var start = m43Pos.call(md, ltms[n]);
            var end = m43Pos.call(md, ltms[parent]);

            if (matrix)
            {
                start = m43TransformPoint.call(md, matrix, start);
                end = m43TransformPoint.call(md, matrix, end);
            }

            writer(start, rBone, gBone, bBone);
            writer(end, rBone, gBone, bBone);
        }

        if (bounds)
        {
            var center = bounds.center;
            var halfExtent = bounds.halfExtent;
            if (matrix)
            {
                center = md.v3Add(md.m43Pos(matrix), center);
            }

            var minExtent = md.v3Sub(center, halfExtent);
            var maxExtent = md.v3Add(center, halfExtent);
            var extents = [minExtent[0], minExtent[1], minExtent[2], maxExtent[0], maxExtent[1], maxExtent[2]];
            this.writeBox(writer, extents, rBound, gBound, bBound);
        }

        gd.endDraw(writer);
    }
};

//
// drawSceneNodeHierarchy
//
Scene.prototype.drawSceneNodeHierarchy = function drawSceneNodeHierarchy(gd, sm, camera)
{
    var countNodesInHierarchy = function countNodesInHierarchyFn(root)
    {
        var count = 1; // Include myself
        var children = root.children;
        if (children)
        {
            var numChildren = children.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                count += countNodesInHierarchy(children[c]);
            }
        }

        return count;
    };

    var drawNodeHierarchy = function drawNodeHierarchyFn(root, writer, md)
    {
        var children = root.children;
        if (children)
        {
            var numChildren = children.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                var child = children[c];

                var start = md.m43Pos(root.world);
                var end = md.m43Pos(child.world);

                writer(start, 0, 0, 0);
                writer(end, 0, 0, 0);

                drawNodeHierarchy(child, writer, md);
            }
        }
    };


    if (!this.rootNodes)
    {
        return;
    }
    var numNodes = 0;
    var numRoots = this.rootNodes.length;
    for (var n = 0; n < numRoots; n += 1)
    {
        numNodes += countNodesInHierarchy(this.rootNodes[n]);
    }

    var numVertices = 2 * numNodes; // one per end of connection
    if (!numVertices)
    {
        return;
    }

    var shader = sm.load("shaders/debug.cgfx");
    var technique = shader.getTechnique("debug_lines");
    if (!technique)
    {
        return;
    }

    gd.setTechnique(technique);

    var techniqueParameters = this.debugLinesTechniqueParameters;
    if (!techniqueParameters)
    {
        techniqueParameters = gd.createTechniqueParameters({
            worldViewProjection: camera.viewProjectionMatrix
        });
        this.debugLinesTechniqueParameters = techniqueParameters;
    }
    else
    {
        techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
    }

    gd.setTechniqueParameters(techniqueParameters);

    var sem = this.getDebugSemanticsPosCol();
    var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                              numVertices,
                              [gd.VERTEXFORMAT_FLOAT3, gd.VERTEXFORMAT_FLOAT3],
                              sem);
    if (writer)
    {
        var md = this.md;
        for (n = 0; n < numRoots; n += 1)
        {
            var nodeRoot = this.rootNodes[n];

            drawNodeHierarchy(nodeRoot, writer, md);
        }

        gd.endDraw(writer);
    }
};

Scene.prototype.createGeoSphere = function scenecreateGeoSphereFn(radius, recursionLevel)
{
    var positions = [];
    var indices = [];
    var cache = {};
    // Golden ratio
    var t = (1.0 + Math.sqrt(5.0)) / 2.0;

    // Default recursion level of 3
    recursionLevel = (!recursionLevel) ? 3 : recursionLevel;

    // add vertex to mesh, fix position to be on unit sphere then scale up to required radius
    // return index
    function addVertex(p0, p1, p2)
    {
        var length = Math.sqrt(p0 * p0 + p1 * p1 + p2 * p2);
        var scale = radius / length;
        positions[positions.length] = p0  * scale;
        positions[positions.length] = p1 * scale;
        positions[positions.length] = p2  * scale;
        return (positions.length / 3) - 1;
    }

    // return index of point in the middle of p1 and p2
    function getMiddlePoint(p1, p2)
    {
        // first check if we have it already
        var firstIsSmaller = p1 < p2;
        var k1 = firstIsSmaller ? p1 : p2;
        var k2 = firstIsSmaller ? p2 : p1;
        var key = k1.toString() + k2.toString() + (k1 + k2);

        if (cache[key])
        {
            return cache[key];
        }

        // not in cache, calculate it - take in to account positions are stored
        // as a single array
        p1 = p1 * 3;
        p2 = p2 * 3;
        var i = addVertex((positions[p1] + positions[p2]) * 0.5,
                          (positions[p1 + 1] + positions[p2 + 1]) * 0.5,
                          (positions[p1 + 2] + positions[p2 + 2]) * 0.5);

        // store it, return index
        cache[key] = i;
        return i;
    }

    // create 12 vertices of an icosahedron - default unit parameters
    addVertex(-1,  t,  0);
    addVertex( 1,  t,  0);
    addVertex(-1, -t,  0);
    addVertex( 1, -t,  0);

    addVertex( 0, -1,  t);
    addVertex( 0,  1,  t);
    addVertex( 0, -1, -t);
    addVertex( 0,  1, -t);

    addVertex( t,  0, -1);
    addVertex( t,  0,  1);
    addVertex(-t,  0, -1);
    addVertex(-t,  0,  1);

    // create 20 triangles of the icosahedron
    indices = [
            0, 11, 5,
            0, 5, 1,
            0, 1, 7,
            0, 7, 10,
            0, 10, 11,
            1, 5, 9,
            5, 11, 4,
            11, 10, 2,
            10, 7, 6,
            7, 1, 8,
            3, 9, 4,
            3, 4, 2,
            3, 2, 6,
            3, 6, 8,
            3, 8, 9,
            4, 9, 5,
            2, 4, 11,
            6, 2, 10,
            8, 6, 7,
            9, 8, 1
        ];


    // refine triangles
    for (var i = 0; i < recursionLevel; i += 1)
    {
        var newindices = [];
        for (var j = 0; j < indices.length; j += 3)
        {
            // Current triangle
            var a = indices[j];
            var b = indices[j + 1];
            var c = indices[j + 2];

            // replace triangle by 4 triangles
            var d = getMiddlePoint(a, b);
            var e = getMiddlePoint(b, c);
            var f = getMiddlePoint(c, a);

            newindices[newindices.length] = a;
            newindices[newindices.length] = d;
            newindices[newindices.length] = f;

            newindices[newindices.length] = b;
            newindices[newindices.length] = e;
            newindices[newindices.length] = d;

            newindices[newindices.length] = c;
            newindices[newindices.length] = f;
            newindices[newindices.length] = e;

            newindices[newindices.length] = d;
            newindices[newindices.length] = e;
            newindices[newindices.length] = f;
        }
        indices = newindices;
    }

    return {
        indices : indices,
        vertices : positions,
        minExtent : [-radius, -radius, -radius],
        maxExtent : [radius, radius, radius]
    };
};

Scene.prototype.createCylinder = function sceneCreateCylinderFn(radius1, radius2, len, capEnds, tesselation)
{
    var positions = [];
    var indices = [];
    var height = len / 2;

    // Default tesselation value of 10
    tesselation = (!tesselation) ? 10 : tesselation;

    var recTesselation = 1 / tesselation;
    var angleStep = (Math.PI * 2.0) * recTesselation;
    var angleStepHalf = angleStep * 0.5;

    var x = -height;
    var y = -height;
    var z = -height;

    // Build the main hull positions. Built as a quad which goes between each
    // circular end of the cylinder. This allows differing radii for each end
    // of the cylinder and thus allows cones to be built.
    for (var i = 0; i <= tesselation; i += 1)
    {
        var angle = angleStep * i;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var coshalf = Math.cos(angle + angleStepHalf);
        var sinhalf = Math.sin(angle + angleStepHalf);

        x = radius1 * cos;
        y = -height;
        z = radius1 * sin;
        positions[positions.length] = x;
        positions[positions.length] = y;
        positions[positions.length] = z;

        x = radius2 * cos;
        y = height;
        z = radius2 * sin;
        positions[positions.length] = x;
        positions[positions.length] = y;
        positions[positions.length] = z;

        x = radius1 * coshalf;
        y = -height;
        z = radius1 * sinhalf;
        positions[positions.length] = x;
        positions[positions.length] = y;
        positions[positions.length] = z;

        x = radius2 * coshalf;
        y = height;
        z = radius2 * sinhalf;
        positions[positions.length] = x;
        positions[positions.length] = y;
        positions[positions.length] = z;
    }

    // Indices for the main hull part
    var nonWrappedSize = tesselation * 4;
    for (i = 0; i !== nonWrappedSize; i += 2)
    {
        indices[indices.length] = i + 2;
        indices[indices.length] = i;
        indices[indices.length] = i + 1;

        indices[indices.length] = i + 2;
        indices[indices.length] = i + 1;
        indices[indices.length] = i + 3;
    }

    // Two closing quads between end and start
    indices[indices.length] = 0;
    indices[indices.length] = i;
    indices[indices.length] = i + 1;

    indices[indices.length] = 0;
    indices[indices.length] = i + 1;
    indices[indices.length] = 1;

    if (capEnds)
    {
        var index = 0;

        // Close bottom
        if (radius1 !== 0)
        {
            x = 0.0;
            y = -height;
            z = 0.0;

            positions[positions.length] = x;
            positions[positions.length] = y;
            positions[positions.length] = z;

            index = (positions.length / 3) - 1;

            for (i = 0; i !== nonWrappedSize; i += 2)
            {
                indices[indices.length] = index;
                indices[indices.length] = i;
                indices[indices.length] = i + 2;
            }

            indices[indices.length] = index;
            indices[indices.length] = i;
            indices[indices.length] = 0;
        }

        // Close top
        if (radius2 !== 0)
        {
            y = height;
            z = 0.0;

            positions[positions.length] = x;
            positions[positions.length] = y;
            positions[positions.length] = z;

            index = (positions.length / 3) - 1;

            for (i = 0; i !== nonWrappedSize; i += 2)
            {
                indices[indices.length] = i + 1;
                indices[indices.length] = index;
                indices[indices.length] = i + 3;
            }

            indices[indices.length] = i + 1;
            indices[indices.length] = index;
            indices[indices.length] = 1;
        }
    }

    var radius = Math.max(radius1, radius2);

    return {
        indices : indices,
        vertices : positions,
        minExtent : [-radius, -height, -radius],
        maxExtent : [radius, height, radius]
    };
};

Scene.prototype.createRoundedPrimitive = function sceneCreateRoundedPrimitiveFn(mSizeX, mSizeY, mSizeZ, radius, mChamferNumSeg)
{
    // radius = mChamferSize
    var md = this.md;
    // These can be used to set multiple segments instead of one long segment.
    // Must be scaled to the relevant size.
    // Eg. mNumSegX = 3 means mSizeX must be set to three as well otherwise the corners will be wrong
    var mNumSegX = 1;
    var mNumSegY = 1;
    var mNumSegZ = 1;

    // Setup some default parameters.
    // Also never allow the size to ACTUALLY be 0
    // Set it to something really small otherwise the planes won't render
    mSizeX         = (mSizeX === 0)    ? 0.0001 : mSizeX;
    mSizeY         = (mSizeY === 0)    ? 0.0001 : mSizeY;
    mSizeZ         = (mSizeZ === 0)    ? 0.0001 : mSizeZ;
    mChamferNumSeg = (!mChamferNumSeg) ? 8      : mChamferNumSeg;

    var offset = 0;
    var positions = [];
    var indices = [];
    var pi = Math.PI;

    // Cache mathDevice functions
    var v3Add4 = md.v3Add4;
    var v3Add3 = md.v3Add3;
    var v3ScalarMul = md.v3ScalarMul;

    function addCorner(isXPositive, isYPositive, isZPositive)
    {
        offset = (positions.length / 3);

        var offsetPosition = [(isXPositive ? 1 : -1) * 0.5 * mSizeX,
                              (isYPositive ? 1 : -1) * 0.5 * mSizeY,
                              (isZPositive ? 1 : -1) * 0.5 * mSizeZ];

        var deltaRingAngle = ((pi / 2) / mChamferNumSeg);
        var offsetRingAngle = isYPositive ? 0 : (pi / 2);
        var offsetSegAngle;

        if (isXPositive && isZPositive)
        {
            offsetSegAngle = 0;
        }
        if (!isXPositive && isZPositive)
        {
            offsetSegAngle = 1.5 * pi;
        }
        if (isXPositive && !isZPositive)
        {
            offsetSegAngle = pi / 2;
        }
        if (!isXPositive && !isZPositive)
        {
            offsetSegAngle = pi;
        }

        // Generate the group of rings for the sphere
        for (var ring = 0; ring <= mChamferNumSeg; ring += 1)
        {
            var ringAngle = ring * deltaRingAngle + offsetRingAngle;
            var r0 = radius * Math.sin(ringAngle);
            var y0 = radius * Math.cos(ringAngle);

            // Generate the group of segments for the current ring
            for (var seg = 0; seg <= mChamferNumSeg; seg += 1)
            {
                var segAngle = seg * deltaRingAngle + offsetSegAngle;
                var x0 = r0 * Math.sin(segAngle);
                var z0 = r0 * Math.cos(segAngle);

                // Add one vertex to the strip which makes up the sphere
                positions[positions.length] = x0 + offsetPosition[0];
                positions[positions.length] = y0 + offsetPosition[1];
                positions[positions.length] = z0 + offsetPosition[2];

                if ((ring !== mChamferNumSeg) && (seg !== mChamferNumSeg))
                {
                    // Each vertex (except the last) has six indices pointing to it
                    indices[indices.length] = offset + mChamferNumSeg + 2;
                    indices[indices.length] = offset;
                    indices[indices.length] = offset + mChamferNumSeg + 1;
                    indices[indices.length] = offset + mChamferNumSeg + 2;
                    indices[indices.length] = offset + 1;
                    indices[indices.length] = offset;
                }
                offset += 1;
            }
        }
    }

     // xPos,yPos,zPos : 1 => positive
     //                 -1 => negative
     //                  0 => undefined
    function addEdge(xPos, yPos, zPos)
    {
        var unitX = md.v3BuildXAxis(unitX);
        var unitY = md.v3BuildYAxis(unitY);
        var unitZ = md.v3BuildZAxis(unitZ);
        var ver;

        var tempx = v3ScalarMul.call(md, unitX, 0.5 * xPos * mSizeX);
        var tempy = v3ScalarMul.call(md, unitY, 0.5 * yPos * mSizeY);
        var tempz = v3ScalarMul.call(md, unitZ, 0.5 * zPos * mSizeZ);
        var centerPosition = v3Add3.call(md, tempx, tempy, tempz);

        tempx = v3ScalarMul.call(md, unitX, 1.0 - Math.abs(xPos));
        tempy = v3ScalarMul.call(md, unitY, 1.0 - Math.abs(yPos));
        tempz = v3ScalarMul.call(md, unitZ, 1.0 - Math.abs(zPos));
        var vy0 = v3Add3.call(md, tempx, tempy, tempz);
        var vx0 = md.v3Build(vy0[1], vy0[2], vy0[0]);
        var vz0 = md.v3Build(vy0[2], vy0[0], vy0[1]);

        offset = (positions.length / 3);

        if (md.v3Dot(vx0, centerPosition) < 0)
        {
            vx0 = md.v3Neg(vx0, vx0);
        }
        if (md.v3Dot(vz0, centerPosition) < 0)
        {
            vz0 = md.v3Neg(vz0, vz0);
        }

        var vxvy = md.v3Cross(vx0, vy0);
        if (md.v3Dot(vxvy, vz0) < 0)
        {
            vy0 = md.v3Neg(vy0, vy0);
        }

        var height = (1 - Math.abs(xPos)) * mSizeX +
                     (1 - Math.abs(yPos)) * mSizeY +
                     (1 - Math.abs(zPos)) * mSizeZ;

        var offsetPosition = md.v3Sub(centerPosition, md.v3ScalarMul(vy0, 0.5 * height));
        var numSegHeight = 1;

        var deltaAngle = ((Math.PI / 2) / mChamferNumSeg);
        var deltaHeight = height / numSegHeight;

        if (xPos === 0)
        {
            numSegHeight = mNumSegX;
        }
        else if (yPos === 0)
        {
            numSegHeight = mNumSegY;
        }
        else if (zPos === 0)
        {
            numSegHeight = mNumSegZ;
        }

        for (var i = 0; i <= numSegHeight; i += 1)
        {
            for (var j = 0; j <= mChamferNumSeg; j += 1)
            {
                var x0 = radius * Math.cos(j * deltaAngle);
                var z0 = radius * Math.sin(j * deltaAngle);

                // (x0 * vx0) + (i * deltaHeight * vy0) + (z0 * vz0) + offsetPosition
                v3ScalarMul.call(md, vx0, x0, tempx);
                v3ScalarMul.call(md, vy0, i * deltaHeight, tempy);
                v3ScalarMul.call(md, vz0, z0, tempz);
                ver = v3Add4.call(md, tempx, tempy, tempz, offsetPosition, ver);

                positions[positions.length] = ver[0];
                positions[positions.length] = ver[1];
                positions[positions.length] = ver[2];

                if (i !== numSegHeight && j !== mChamferNumSeg)
                {
                    indices[indices.length] = offset + mChamferNumSeg + 2;
                    indices[indices.length] = offset;
                    indices[indices.length] = offset + mChamferNumSeg + 1;
                    indices[indices.length] = offset + mChamferNumSeg + 2;
                    indices[indices.length] = offset + 1;
                    indices[indices.length] = offset;
                }
                offset += 1;
            }
        }
    }

    function generatePlane(numSegX, numSegY, sizeX, sizeY, normal, position)
    {
        offset = (positions.length / 3);

        // Generate a perpendicular to the normal
        // There are infinitely many of these, we have just chosen to build one with the X-axis
        // If the normal is aligned to the X-axis then calculate again with the Y-axis
        var vX = md.v3Cross(normal, md.v3BuildXAxis());
        if (md.v3LengthSq(vX) < 0.0000001)
        {
            md.v3Cross(normal, md.v3BuildYAxis(), vX);
        }
        md.v3Normalize(vX, vX);

        var vY = md.v3Cross(normal, vX);
        var delta1 = v3ScalarMul.call(md, vX, sizeX / numSegX);
        var delta2 = v3ScalarMul.call(md, vY, sizeY / numSegY);

        // Build one corner of the square
        var orig = md.v3Sub(v3ScalarMul.call(md, vX, -0.5 * sizeX), v3ScalarMul.call(md, vY, 0.5 * sizeY));

        // Calculate the positions
        for (var i1 = 0; i1 <= numSegX; i1 += 1)
        {
            for (var i2 = 0; i2 <= numSegY; i2 += 1)
            {
                var pos = v3Add4.call(md, orig, v3ScalarMul.call(md, delta1, i1), v3ScalarMul.call(md, delta2, i2), position, pos);
                positions[positions.length] = pos[0];
                positions[positions.length] = pos[1];
                positions[positions.length] = pos[2];
            }
        }

        var reverse = false;
        var d1d2 = md.v3Cross(delta1, delta2);
        if (md.v3Dot(d1d2, normal) > 0)
        {
            reverse = true;
        }
        for (var n1 = 0; n1 < numSegX; n1 += 1)
        {
            for (var n2 = 0; n2 < numSegY; n2 += 1)
            {
                if (reverse)
                {
                    indices[indices.length] = offset;
                    indices[indices.length] = offset + numSegY + 1;
                    indices[indices.length] = offset + 1;
                    indices[indices.length] = offset + 1;
                    indices[indices.length] = offset + numSegY + 1;
                    indices[indices.length] = offset + numSegY + 1 + 1;
                }
                else
                {
                    indices[indices.length] = offset;
                    indices[indices.length] = offset + 1;
                    indices[indices.length] = offset + numSegY + 1;
                    indices[indices.length] = offset + 1;
                    indices[indices.length] = offset + numSegY + 1 + 1;
                    indices[indices.length] = offset + numSegY + 1;
                }
                offset += 1;
            }
            offset += 1;
        }
    }

    var hX = (0.5 * mSizeX + radius);
    var hY = (0.5 * mSizeY + radius);
    var hZ = (0.5 * mSizeZ + radius);

    var planeNorm = md.v3Neg(md.v3BuildZAxis(), planeNorm);
    var planePos = v3ScalarMul.call(md, planeNorm, hZ);

    // Generate the pseudo-box shape
    generatePlane(mNumSegY, mNumSegX, mSizeY, mSizeX, planeNorm, planePos);

    planeNorm = md.v3BuildZAxis(planeNorm);
    v3ScalarMul.call(md, planeNorm, hZ, planePos);
    generatePlane(mNumSegY, mNumSegX, mSizeY, mSizeX, planeNorm, planePos);

    md.v3Neg(md.v3BuildYAxis(planeNorm), planeNorm);
    v3ScalarMul.call(md, planeNorm, hY, planePos);
    generatePlane(mNumSegZ, mNumSegX, mSizeZ, mSizeX, planeNorm, planePos);

    md.v3BuildYAxis(planeNorm);
    v3ScalarMul.call(md, planeNorm, hY, planePos);
    generatePlane(mNumSegZ, mNumSegX, mSizeZ, mSizeX, planeNorm, planePos);

    md.v3Neg(md.v3BuildXAxis(planeNorm), planeNorm);
    v3ScalarMul.call(md, planeNorm, hX, planePos);
    generatePlane(mNumSegZ, mNumSegY, mSizeZ, mSizeY, planeNorm, planePos);

    md.v3BuildXAxis(planeNorm);
    v3ScalarMul.call(md, planeNorm, hX, planePos);
    generatePlane(mNumSegZ, mNumSegY, mSizeZ, mSizeY, planeNorm, planePos);

    // Generate the corners
    addCorner(true,  true,  true);
    addCorner(true,  true,  false);
    addCorner(true,  false, true);
    addCorner(true,  false, false);
    addCorner(false, true,  true);
    addCorner(false, true,  false);
    addCorner(false, false, true);
    addCorner(false, false, false);

    // Generate the edges
    addEdge(-1, -1,  0);
    addEdge(-1,  1,  0);
    addEdge( 1, -1,  0);
    addEdge( 1,  1,  0);
    addEdge(-1,  0, -1);
    addEdge(-1,  0,  1);
    addEdge( 1,  0, -1);
    addEdge( 1,  0,  1);
    addEdge( 0, -1, -1);
    addEdge( 0, -1,  1);
    addEdge( 0,  1, -1);
    addEdge( 0,  1,  1);

    return {
        indices : indices,
        vertices : positions,
        minExtent : [-hX, -hY, -hZ],
        maxExtent : [hX, hY, hZ]
    };
};

Scene.prototype.createBox = function sceneCreateBoxFn(halfExtents)
{
    var xHalfExtent = halfExtents[0];
    var yHalfExtent = halfExtents[1];
    var zHalfExtent = halfExtents[2];

    var positions = [-xHalfExtent, -yHalfExtent,  zHalfExtent,
                      xHalfExtent, -yHalfExtent,  zHalfExtent,
                      xHalfExtent,  yHalfExtent,  zHalfExtent,
                     -xHalfExtent,  yHalfExtent,  zHalfExtent,
                     -xHalfExtent,  yHalfExtent,  zHalfExtent,
                      xHalfExtent,  yHalfExtent,  zHalfExtent,
                      xHalfExtent,  yHalfExtent, -zHalfExtent,
                     -xHalfExtent,  yHalfExtent, -zHalfExtent,
                     -xHalfExtent,  yHalfExtent, -zHalfExtent,
                      xHalfExtent,  yHalfExtent, -zHalfExtent,
                      xHalfExtent, -yHalfExtent, -zHalfExtent,
                     -xHalfExtent, -yHalfExtent, -zHalfExtent,
                     -xHalfExtent, -yHalfExtent, -zHalfExtent,
                      xHalfExtent, -yHalfExtent, -zHalfExtent,
                      xHalfExtent, -yHalfExtent,  zHalfExtent,
                     -xHalfExtent, -yHalfExtent,  zHalfExtent,
                      xHalfExtent, -yHalfExtent,  zHalfExtent,
                      xHalfExtent, -yHalfExtent, -zHalfExtent,
                      xHalfExtent,  yHalfExtent, -zHalfExtent,
                      xHalfExtent,  yHalfExtent,  zHalfExtent,
                     -xHalfExtent, -yHalfExtent, -zHalfExtent,
                     -xHalfExtent, -yHalfExtent,  zHalfExtent,
                     -xHalfExtent,  yHalfExtent,  zHalfExtent,
                     -xHalfExtent,  yHalfExtent, -zHalfExtent
                    ];

    var indices = [
                    2,  0,  1,
                    3,  0,  2,
                    6,  4,  5,
                    7,  4,  6,
                   10,  8,  9,
                   11,  8, 10,
                   14, 12, 13,
                   15, 12, 14,
                   18, 16, 17,
                   19, 16, 18,
                   22, 20, 21,
                   23, 20, 22
                ];

    return {
        indices : indices,
        vertices : positions,
        minExtent : [-xHalfExtent, -yHalfExtent, -zHalfExtent],
        maxExtent : [xHalfExtent, yHalfExtent, zHalfExtent]
    };
};

Scene.prototype.createConvexHull = function sceneCreateConvexHull(dw, body, numRays)
{
    if (TurbulenzEngine.canvas)
    {
        // Special case for WebGL.
        // ConvexHull posesses a TriangleArray with vertices/indicies
        //   to render a triangle mesh for debug view instead of
        //   the much slower and less helpful ray casted positioned squares.
        return body.shape._private.triangleArray;
    }

    var positions = [];
    var indices = [];
    var md = this.md;
    var offset = 0;

    var transform = body.transform;
    var pos = md.m43Pos(transform);
    var halfextents = body.shape.halfExtents;
    var sqrtNumRays = Math.ceil(Math.sqrt(numRays));

    var biggestHalfExtent = halfextents[0];
    biggestHalfExtent = (halfextents[1] > biggestHalfExtent) ? halfextents[1] : biggestHalfExtent;
    biggestHalfExtent = (halfextents[1] > biggestHalfExtent) ? halfextents[2] : biggestHalfExtent;
    var scale = (biggestHalfExtent / numRays) * (numRays / 5);

    function addSquare(position, normal)
    {
        // Cache mathDevice functions
        var v3Add4 = md.v3Add4;
        var v3ScalarMul = md.v3ScalarMul;

        offset = (positions.length / 3);

        // Generate a perpendicular to the normal
        // There are infinitely many of these, we have just chosen to build one with the X-axis
        // If the normal is aligned to the X-axis then calculate again with the Y-axis
        var vX = md.v3Cross(normal, md.v3BuildXAxis());
        if (md.v3LengthSq(vX) < 0.0000001)
        {
            md.v3Cross(normal, md.v3BuildYAxis(), vX);
        }
        md.v3Normalize(vX, vX);

        var vY = md.v3Cross(normal, vX);
        var delta1 = md.v3ScalarMul(vX, scale);
        var delta2 = md.v3ScalarMul(vY, scale);

        // Build one corner of the square
        var orig = md.v3Sub(md.v3ScalarMul(vX, -0.5 * scale), md.v3ScalarMul(vY, 0.5 * scale));

        // Calculate the positions
        for (var i1 = 0; i1 < 2; i1 += 1)
        {
            for (var i2 = 0; i2 < 2; i2 += 1)
            {
                var pos = v3Add4.call(md, orig, v3ScalarMul.call(md, delta1, i1), v3ScalarMul.call(md, delta2, i2), position, pos);
                positions[positions.length] = pos[0];
                positions[positions.length] = pos[1];
                positions[positions.length] = pos[2];
            }
        }

        var reverse = false;
        var d1d2 = md.v3Cross(delta1, delta2);
        if (md.v3Dot(d1d2, normal) > 0)
        {
            reverse = true;
        }
        if (reverse)
        {
            indices[indices.length] = offset;
            indices[indices.length] = offset + 2;
            indices[indices.length] = offset + 1;
            indices[indices.length] = offset + 1;
            indices[indices.length] = offset + 2;
            indices[indices.length] = offset + 3;
        }
        else
        {
            indices[indices.length] = offset;
            indices[indices.length] = offset + 1;
            indices[indices.length] = offset + 2;
            indices[indices.length] = offset + 1;
            indices[indices.length] = offset + 3;
            indices[indices.length] = offset + 2;
        }
    }

    function rayCastFromPlane(index, neg)
    {
        // Cache plugin functions
        var v3Add = md.v3Add;
        var v3Add3 = md.v3Add3;
        var rayTest = dw.rayTest;
        var v3Sub = md.v3Sub;
        var m43InverseOrthonormal = md.m43InverseOrthonormal;
        var m43TransformPoint = md.m43TransformPoint;
        var m43TransformVector = md.m43TransformVector;

        var mask = [];
        mask[0] = md.v3BuildXAxis();
        mask[1] = md.v3BuildYAxis();
        mask[2] = md.v3BuildZAxis();

        var min1 = v3Sub.call(md, md.v3Mul(pos, mask[(index + 1) % 3]), md.v3Mul(halfextents, mask[(index + 1) % 3]));
        var min2 = v3Sub.call(md, md.v3Mul(pos, mask[(index + 2) % 3]), md.v3Mul(halfextents, mask[(index + 2) % 3]));
        var depthmax = v3Sub.call(md, md.v3Mul(pos, mask[index]), md.v3Mul(halfextents, mask[index]));
        var depthmin = v3Add.call(md, md.v3Mul(pos, mask[index]), md.v3Mul(halfextents, mask[index]));
        if (neg)
        {
            var temp = depthmax;
            depthmax = depthmin;
            depthmin = temp;
        }
        // ((halfextents * mask) * 2) / sqrtNumRays
        var step1 = md.v3ScalarMul(md.v3ScalarMul(md.v3Mul(halfextents, mask[(index + 1) % 3]), 2), 1 / sqrtNumRays);
        var step2 = md.v3ScalarMul(md.v3ScalarMul(md.v3Mul(halfextents, mask[(index + 2) % 3]), 2), 1 / sqrtNumRays);

        for (var i = 0; i < sqrtNumRays; i += 1)
        {
            for (var k = 0; k < sqrtNumRays; k += 1)
            {
                var u = v3Add.call(md, min1, md.v3ScalarMul(step1, i));
                var v = v3Add.call(md, min2, md.v3ScalarMul(step2, k));
                var from = v3Add3.call(md, u, v, depthmin, from);
                var to = v3Add3.call(md, u, v, depthmax, to);
                var rayHit = rayTest.call(dw, {
                        from : from,
                        to   : to
                    });
                if (rayHit && (rayHit.body === body || rayHit.collisionObject === body))
                {
                    var hitPoint = rayHit.hitPoint;
                    var normal = rayHit.hitNormal;
                    var inv = m43InverseOrthonormal.call(md, transform);
                    m43TransformPoint.call(md, inv, hitPoint, hitPoint);
                    m43TransformVector.call(md, inv, normal, normal);
                    addSquare(hitPoint, normal);
                }
            }
        }
    }

    rayCastFromPlane(0, false);
    rayCastFromPlane(0, true);
    rayCastFromPlane(1, false);
    rayCastFromPlane(1, true);
    rayCastFromPlane(2, false);
    rayCastFromPlane(2, true);

    return {
        indices : indices,
        vertices : positions
    };
};

//
// drawPhysicsNodes
//
Scene.prototype.drawPhysicsNodes = function sceneDrawPhysicsNodesFn(gd, sm, camera, physicsManager)
{
    var shader = sm.load("shaders/debug.cgfx");
    var technique = shader.getTechnique("debug_lines");
    if (!technique)
    {
        return;
    }

    var physicsNodes = physicsManager.physicsNodes;
    var previousFrameIndex = (this.frameIndex - 1);
    var isInsidePlanesAABB = this.isInsidePlanesAABB;
    var frustumPlanes = this.frustumPlanes;
    var n, physicsNode, target;
    var extents = (this.float32ArrayConstructor ?
                   new this.float32ArrayConstructor(6) :
                   new Array(6));
    var numNodes = physicsNodes.length;
    var visiblePhysicsNodes = [];
    for (n = 0; n < numNodes; n += 1)
    {
        physicsNode = physicsNodes[n];
        target = physicsNode.target;
        if (target.frameVisible >= previousFrameIndex)
        {
            visiblePhysicsNodes[visiblePhysicsNodes.length] = physicsNode;
        }
        else
        {
            physicsNode.body.calculateExtents(extents);
            if (isInsidePlanesAABB(extents, frustumPlanes))
            {
                visiblePhysicsNodes[visiblePhysicsNodes.length] = physicsNode;
            }
        }
    }

    numNodes = visiblePhysicsNodes.length;
    if (!numNodes)
    {
        return;
    }

    gd.setTechnique(technique);

    var techniqueParameters = this.debugLinesTechniqueParameters;
    if (!techniqueParameters)
    {
        techniqueParameters = gd.createTechniqueParameters({
            worldViewProjection: camera.viewProjectionMatrix
        });
        this.debugLinesTechniqueParameters = techniqueParameters;
    }
    else
    {
        techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
    }

    gd.setTechniqueParameters(techniqueParameters);

    var sem = this.getDebugSemanticsPosCol();
    var vformatFloat3 = gd.VERTEXFORMAT_FLOAT3;
    var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                              (24 * numNodes),
                              [vformatFloat3, vformatFloat3],
                              sem);
    if (writer)
    {
        var transform = physicsManager.mathsDevice.m43BuildIdentity();
        for (n = 0; n < numNodes; n += 1)
        {
            physicsNode = visiblePhysicsNodes[n];
            target = physicsNode.target;
            var scale = (target.disabled ? 0.2 : 1.0);
            var r, g, b;
            if (physicsNode.kinematic)
            {
                r = 0;
                g = 0;
                b = scale;
            }
            else if (physicsNode.dynamic)
            {
                r = 0;
                g = scale;
                b = 0;
            }
            else
            {
                r = scale;
                g = 0;
                b = 0;
            }
            var body = physicsNode.body;
            body.calculateTransform(transform);
            this.writeRotatedBox(writer, transform, body.shape.halfExtents, r, g, b);
        }

        gd.endDraw(writer);
    }
};

//
// drawPhysicsGeometry
//
Scene.prototype.drawPhysicsGeometry = function sceneDrawPhysicsGeometryFn(gd, sm, camera, physicsManager)
{
    var shader = sm.load("shaders/debug.cgfx");
    var technique = shader.getTechnique("physics_debug");
    if (!technique)
    {
        return;
    }

    var md = this.md;

    // Cache vertex formats
    var vformatFloat3 = gd.VERTEXFORMAT_FLOAT3;
    var vformatFloat4 = gd.VERTEXFORMAT_FLOAT4;
    var attributes = [ vformatFloat4, vformatFloat3, vformatFloat3 ];
    var numAttributeComponents = 10;

    var physicsNodes = physicsManager.physicsNodes;
    var previousFrameIndex = (this.frameIndex - 1);
    var isInsidePlanesAABB = this.isInsidePlanesAABB;
    var frustumPlanes = this.frustumPlanes;
    var n, physicsNode, target, triangleArray, visible, positions, i, indices, numIndices;
    var extents = (this.float32ArrayConstructor ?
                   new this.float32ArrayConstructor(6) :
                   new Array(6));
    var numNodes = physicsNodes.length;
    var visiblePhysicsNodes = [];
    var triangleArrayParams;
    var pd = physicsManager.physicsDevice;
    var dw = physicsManager.dynamicsWorld;
    var shape;
    for (n = 0; n < numNodes; n += 1)
    {
        physicsNode = physicsNodes[n];

        visible = false;
        target = physicsNode.target;
        if (target.frameVisible >= previousFrameIndex)
        {
            visible = true;
        }
        else
        {
            physicsNode.body.calculateExtents(extents);
            if (isInsidePlanesAABB(extents, frustumPlanes))
            {
                visible = true;
            }
        }

        if (visible)
        {
            visiblePhysicsNodes[visiblePhysicsNodes.length] = physicsNode;

            triangleArray = physicsNode.triangleArray;
            if (!triangleArray)
            {
                shape = physicsNode.body.shape;
                var type = shape.type;
                var halfExtents = shape.halfExtents;

                if (type === "SPHERE")
                {
                    triangleArrayParams = this.createGeoSphere(shape.radius);
                }
                else if (type === "CYLINDER")
                {
                    triangleArrayParams = this.createCylinder(halfExtents[0],
                                                              halfExtents[2],
                                                              halfExtents[1] * 2,
                                                              true);
                }
                else if (type === "CONE")
                {
                    triangleArrayParams = this.createCylinder(halfExtents[0],
                                                              0,
                                                              halfExtents[1] * 2,
                                                              true);
                }
                else if (type === "CAPSULE")
                {
                    var height = (halfExtents[1] - halfExtents[0]) * 2;
                    triangleArrayParams = this.createRoundedPrimitive(0,
                                                                      height,
                                                                      0,
                                                                      halfExtents[0]);
                }
                else if (type === "BOX")
                {
                    triangleArrayParams = this.createBox(halfExtents);
                }
                else if (type === "CONVEX_HULL")
                {
                    triangleArrayParams = this.createConvexHull(dw,
                                                                physicsNode.body,
                                                                50);
                }
                else if (type === "TRIANGLE_MESH")
                {
                    triangleArrayParams = shape.triangleArray;
                }

                if (triangleArrayParams && triangleArrayParams.vertices.length > 0)
                {
                    if (triangleArrayParams.triangles)
                    {
                        triangleArray = triangleArrayParams;
                    }
                    else
                    {
                        triangleArray = pd.createTriangleArray(triangleArrayParams);
                    }
                    physicsNode.triangleArray = triangleArray;
                }
                else
                {
                    visiblePhysicsNodes.pop();
                    continue;
                }
            }

            positions = physicsNode.positions;
            if (!positions && triangleArray)
            {
                var vertices = triangleArray.vertices;

                // convert native arrays to javascript ones
                if (!TurbulenzEngine.canvas)
                {
                    var numVertexComponents = vertices.length;
                    positions = [];
                    positions.length = numVertexComponents;
                    for (i = 0; i < numVertexComponents; i += 1)
                    {
                        positions[i] = vertices[i];
                    }
                }
                else
                {
                    positions = vertices;
                }

                physicsNode.positions = positions;
                physicsNode.indices = triangleArray.indices;
            }

            if (!physicsNode.wireframeBuffer && positions)
            {
                indices = physicsNode.indices;
                numIndices = indices.length;

                var vData = (this.float32ArrayConstructor ?
                             new this.float32ArrayConstructor(numIndices * numAttributeComponents) :
                             new Array(numIndices * numAttributeComponents));
                var j;
                var dstIndex = 0;
                var vdIndex0, vdValue0x, vdValue0y, vdValue0z,
                    vdIndex1, vdValue1x, vdValue1y, vdValue1z,
                    vdIndex2, vdValue2x, vdValue2y, vdValue2z;

                var vertexBuffer = gd.createVertexBuffer({
                        numVertices: numIndices,
                        attributes: attributes
                    });

                for (j = 0; j < numIndices; j += 3)
                {
                    vdIndex0 = 3 * indices[j];
                    vdIndex1 = 3 * indices[j + 1];
                    vdIndex2 = 3 * indices[j + 2];
                    //Vertex 0
                    vdValue0x = positions[vdIndex0];
                    vdValue0y = positions[vdIndex0 + 1];
                    vdValue0z = positions[vdIndex0 + 2];
                    vData[dstIndex] = vdValue0x;
                    vData[dstIndex + 1] = vdValue0y;
                    vData[dstIndex + 2] = vdValue0z;
                    vData[dstIndex + 3] = 0;
                    //Vertex 1 passed as attribute of Vertex 0
                    vdValue1x = positions[vdIndex1];
                    vdValue1y = positions[vdIndex1 + 1];
                    vdValue1z = positions[vdIndex1 + 2];
                    vData[dstIndex + 4] = vdValue1x;
                    vData[dstIndex + 5] = vdValue1y;
                    vData[dstIndex + 6] = vdValue1z;
                    //Vertex 2 passed as attribute of Vertex 0
                    vdValue2x = positions[vdIndex2];
                    vdValue2y = positions[vdIndex2 + 1];
                    vdValue2z = positions[vdIndex2 + 2];
                    vData[dstIndex + 7] = vdValue2x;
                    vData[dstIndex + 8] = vdValue2y;
                    vData[dstIndex + 9] = vdValue2z;
                    //Depending on whether skinned or not, increments accordingly
                    dstIndex += numAttributeComponents;

                    //Repeat for Vertex 1
                    vData[dstIndex] = vdValue1x;
                    vData[dstIndex + 1] = vdValue1y;
                    vData[dstIndex + 2] = vdValue1z;
                    vData[dstIndex + 3] = 1;
                    vData[dstIndex + 4] = vdValue0x;
                    vData[dstIndex + 5] = vdValue0y;
                    vData[dstIndex + 6] = vdValue0z;
                    vData[dstIndex + 7] = vdValue2x;
                    vData[dstIndex + 8] = vdValue2y;
                    vData[dstIndex + 9] = vdValue2z;
                    dstIndex += numAttributeComponents;

                    //Repeat for Vertex 2
                    vData[dstIndex] = vdValue2x;
                    vData[dstIndex + 1] = vdValue2y;
                    vData[dstIndex + 2] = vdValue2z;
                    vData[dstIndex + 3] = 2;
                    vData[dstIndex + 4] = vdValue0x;
                    vData[dstIndex + 5] = vdValue0y;
                    vData[dstIndex + 6] = vdValue0z;
                    vData[dstIndex + 7] = vdValue1x;
                    vData[dstIndex + 8] = vdValue1y;
                    vData[dstIndex + 9] = vdValue1z;
                    dstIndex += numAttributeComponents;
                }

                vertexBuffer.setData(vData);

                physicsNode.wireframeBuffer = vertexBuffer;
            }
        }
    }

    numNodes = visiblePhysicsNodes.length;
    if (!numNodes)
    {
        return;
    }

    // Cache math functions and vertex formats
    var v4Build = md.v4Build;
    var m43MulM44 = md.m43MulM44;

    // Set technique and shared parameters
    gd.setTechnique(technique);

    technique.windowScale = [gd.width / 2, gd.height / 2];
    technique.wireColor = v4Build.call(md, 0, 0.2, 0.6, 1);
    technique.alphaRef = 0;
    technique.alpha = 0.5;

    var fillColor, worldViewProjection;
    var transform = md.m43BuildIdentity();

    var wireframeSemantics = this.physicsWireframeSemantics;
    if (!wireframeSemantics)
    {
        this.physicsWireframeSemantics = wireframeSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0', 'TEXCOORD1']);
    }

    for (n = 0; n < numNodes; n += 1)
    {
        physicsNode = visiblePhysicsNodes[n];
        target = physicsNode.target;
        var body = physicsNode.body;
        var scale = (target.disabled ? 0.2 : body.active ? 1.0 : 0.4);
        var tintR, tintG, tintB;
        if (physicsNode.kinematic)
        {
            tintR = 0;
            tintG = 0;
            tintB = scale;
        }
        else if (physicsNode.dynamic)
        {
            tintR = 0;
            tintG = scale;
            tintB = 0;
        }
        else
        {
            tintR = scale;
            tintG = 0;
            tintB = 0;
        }

        var r, g, b;
        if (body.type === "CHARACTER")
        {
            r = 0;
            g = 0;
            b = 0;
        }
        else
        {
            shape = body.shape;
            if (shape.type === "TRIANGLE_MESH")
            {
                r = 1;
                g = 0;
                b = 0;
            }
            else if (shape.type === "CONVEX_HULL")
            {
                r = 0;
                g = 0;
                b = 1;
            }
            else
            {
                r = 0;
                g = 1;
                b = 0;
            }
        }

        r = 0.5 * (r + tintR);
        g = 0.5 * (g + tintG);
        b = 0.5 * (b + tintB);

        fillColor = v4Build.call(md, r, g, b, 0, fillColor);
        body.calculateTransform(transform);
        worldViewProjection = m43MulM44.call(md, transform, camera.viewProjectionMatrix, worldViewProjection);

        technique.fillColor = fillColor;
        technique.worldViewProjection = worldViewProjection;

        var wireframeBuffer = physicsNode.wireframeBuffer;

        gd.setStream(wireframeBuffer, wireframeSemantics);

        gd.draw(gd.PRIMITIVE_TRIANGLES, wireframeBuffer.numVertices, 0);
    }
};

//
// drawVisibleRenderablesExtents
//
Scene.prototype.drawVisibleRenderablesExtents = function sceneDrawVisibleRenderablesExtentsFn(gd, sm, camera, drawDecals, drawTransparents)
{
    var renderables = this.visibleRenderables;
    var numRenderables = renderables.length;
    if (numRenderables)
    {
        var n, renderable, meta, numVertices = 0;
        for (n = 0; n < numRenderables; n += 1)
        {
            renderable = renderables[n];
            meta = renderable.sharedMaterial.meta;
            if (meta.decal)
            {
                if (drawDecals)
                {
                    numVertices += 24;
                }
            }
            else if (meta.transparent)
            {
                if (drawTransparents)
                {
                    numVertices += 24;
                }
            }
            else
            {
                if (!drawDecals && !drawTransparents)
                {
                    numVertices += 24;
                }
            }
        }

        if (!numVertices)
        {
            return;
        }

        var shader = sm.load("shaders/debug.cgfx");
        var technique = shader.getTechnique("debug_lines");
        if (!technique)
        {
            return;
        }

        var r, g, b;
        if (drawDecals)
        {
            r = 1;
            g = 0;
            b = 0;
        }
        else if (drawTransparents)
        {
            r = 0;
            g = 0;
            b = 1;
        }
        else
        {
            r = 0;
            g = 1;
            b = 0;
        }

        gd.setTechnique(technique);

        var techniqueParameters = this.debugLinesTechniqueParameters;
        if (!techniqueParameters)
        {
            techniqueParameters = gd.createTechniqueParameters({
                worldViewProjection: camera.viewProjectionMatrix
            });
            this.debugLinesTechniqueParameters = techniqueParameters;
        }
        else
        {
            techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
        }

        gd.setTechniqueParameters(techniqueParameters);

        var sem = this.getDebugSemanticsPosCol();
        var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                  numVertices,
                                  [gd.VERTEXFORMAT_FLOAT3, gd.VERTEXFORMAT_FLOAT3],
                                  sem);
        if (writer)
        {
            var writeBox = this.writeBox;
            for (n = 0; n < numRenderables; n += 1)
            {
                renderable = renderables[n];
                meta = renderable.sharedMaterial.meta;
                if (meta.decal)
                {
                    if (!drawDecals)
                    {
                        continue;
                    }
                }
                else if (meta.transparent)
                {
                    if (!drawTransparents)
                    {
                        continue;
                    }
                }
                else
                {
                    if (drawDecals || drawTransparents)
                    {
                        continue;
                    }
                }

                var extents = renderable.getWorldExtents();
                if (extents)
                {
                    writeBox(writer, extents, r, g, b);
                }
            }

            gd.endDraw(writer);

            writer = null;
        }
    }
};

//
// drawOpaqueNodesExtents
//
Scene.prototype.drawOpaqueNodesExtents = function drawOpaqueNodesExtentsFn(gd, sm, camera)
{
    this.drawVisibleRenderablesExtents(gd, sm, camera, false, false);
};

//
// drawDecalNodesExtents
//
Scene.prototype.drawDecalNodesExtents = function drawDecalNodesExtentsFn(gd, sm, camera)
{
    this.drawVisibleRenderablesExtents(gd, sm, camera, true, false);
};

//
// drawTransparentNodesExtents
//
Scene.prototype.drawTransparentNodesExtents = function drawTransparentNodesExtentsFn(gd, sm, camera)
{
    this.drawVisibleRenderablesExtents(gd, sm, camera, false, true);
};

//
// drawStaticNodesTree
//
Scene.prototype.drawStaticNodesTree = function sceneDrawStaticNodesTreeFn(gd, sm, camera, drawLevel)
{
    this.drawNodesTree(this.staticSpatialMap, gd, sm, camera, drawLevel);
};

//
// drawDynamicNodesTree
//
Scene.prototype.drawDynamicNodesTree = function sceneDrawDynamicNodesTreeFn(gd, sm, camera, drawLevel)
{
    this.drawNodesTree(this.dynamicSpatialMap, gd, sm, camera, drawLevel);
};

//
// drawNodesTree
//
Scene.prototype.drawNodesTree = function sceneDrawNodesTreeFn(tree, gd, sm, camera, drawLevel)
{
    function drawNodeFn(writer, nodes, idx, level)
    {
        var node = nodes[idx];

        if (level === 0)
        {
            var extents = node.extents;
            var p0 = extents[0];
            var p1 = extents[1];
            var p2 = extents[2];
            var n0 = extents[3];
            var n1 = extents[4];
            var n2 = extents[5];

            writer(p0, p1, p2);
            writer(p0, p1, n2);

            writer(p0, p1, p2);
            writer(p0, n1, p2);

            writer(p0, p1, p2);
            writer(n0, p1, p2);

            writer(n0, n1, n2);
            writer(n0, n1, p2);

            writer(n0, n1, n2);
            writer(n0, p1, n2);

            writer(n0, n1, n2);
            writer(p0, n1, n2);

            writer(p0, n1, n2);
            writer(p0, n1, p2);

            writer(p0, n1, n2);
            writer(p0, p1, n2);

            writer(n0, n1, p2);
            writer(p0, n1, p2);

            writer(n0, n1, p2);
            writer(n0, p1, p2);

            writer(n0, p1, n2);
            writer(p0, p1, n2);

            writer(n0, p1, n2);
            writer(n0, p1, p2);

            return (idx + node.escapeNodeOffset);
        }
        else
        {
            if (node.isLeaf())
            {
                return (idx + 1);
            }
            else
            {
                var endIndex = (idx + node.escapeNodeOffset);
                level -= 1;
                idx += 1; // first child
                do
                {
                    idx = drawNodeFn(writer, nodes, idx, level);
                }
                while (idx < endIndex);
                return idx;
            }
        }
    }

    var nodes = tree.getNodes();
    var numNodes = tree.getEndNodeIndex();
    if (numNodes)
    {
        var shader = sm.load("shaders/debug.cgfx");
        var technique = shader.getTechnique("debug_lines_constant");
        if (!technique)
        {
            return;
        }

        gd.setTechnique(technique);

        var md = this.md;
        var techniqueParameters = this.debugLinesConstantTechniqueParameters;
        if (!techniqueParameters)
        {
            techniqueParameters = gd.createTechniqueParameters({
                worldViewProjection: null,
                constantColor: null
            });
            this.debugLinesConstantTechniqueParameters = techniqueParameters;
        }

        techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
        techniqueParameters.constantColor = md.v4Build(1.0, 0.0, 0.0, 1.0);

        gd.setTechniqueParameters(techniqueParameters);


        var numVertices = 24 * md.truncate(Math.pow(2, drawLevel));

        var sem = this.getDebugSemanticsPos();
        var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                  numVertices,
                                  [gd.VERTEXFORMAT_FLOAT3],
                                  sem);
        if (writer)
        {
            drawNodeFn(writer, nodes, 0, drawLevel);

            gd.endDraw(writer);

            writer = null;
        }
    }
};

//
// updateNormals
//
Scene.prototype.updateNormals = function updateNormalsFn(gd, scale, drawNormals, normalMaterial, drawTangents, tangentMaterial, drawBinormals, binormalMaterial)
{

    var halfExtents;
    var center;
    var node;
    var stride;

    var createNormalsGeometryInstance = function createNormalsGeometryInstanceFn(normalsNumVerts, material)
    {
        var normalsVertexBuffer = gd.createVertexBuffer({
                numVertices: normalsNumVerts,
                attributes: [ gd.VERTEXFORMAT_FLOAT3 ],
                dynamic: true
            });

        var normalsGeometry = Geometry.create();

        normalsGeometry.halfExtents = halfExtents;
        normalsGeometry.center = center;

        normalsGeometry.primitive = gd.PRIMITIVE_LINES;
        normalsGeometry.semantics = gd.createSemantics([gd.SEMANTIC_POSITION]);
        normalsGeometry.vertexBuffer = normalsVertexBuffer;
        normalsGeometry.numIndices = normalsNumVerts;

        var normalsSurface = {
                first: 0,
                numVertices: normalsNumVerts,
                primitive: gd.PRIMITIVE_LINES
            };

        var normalGeometryInstance = GeometryInstance.create(normalsGeometry,
                                                             normalsSurface,
                                                             material);
        node.addRenderable(normalGeometryInstance);

        return normalGeometryInstance;
    };

    var writeNormals = function writeNormalsFn(normalsVertexBuffer,
                                               vertexBufferData,
                                               positionOffset,
                                               normalOffset,
                                               normalsNumVerts,
                                               scaleAll)
    {
        var length, normScale;
        var pos0, pos1, pos2;
        var norm0, norm1, norm2;
        var offset = 0;

        var writer = normalsVertexBuffer.map();
        if (writer)
        {
            for (var n = 0; n < normalsNumVerts; n += 2)
            {
                pos0 = vertexBufferData[offset + positionOffset + 0];
                pos1 = vertexBufferData[offset + positionOffset + 1];
                pos2 = vertexBufferData[offset + positionOffset + 2];

                norm0 = vertexBufferData[offset + normalOffset + 0];
                norm1 = vertexBufferData[offset + normalOffset + 1];
                norm2 = vertexBufferData[offset + normalOffset + 2];

                length = (norm0 * norm0) + (norm1 * norm1) + (norm2 * norm2);
                if (length)
                {
                    normScale = (1 / length) * scaleAll;
                    norm0 *= normScale;
                    norm1 *= normScale;
                    norm2 *= normScale;
                }
                else
                {
                    norm0 = 0;
                    norm1 = 0;
                    norm2 = 0;
                }

                writer(pos0, pos1, pos2);
                writer(pos0 + norm0,
                       pos1 + norm1,
                       pos2 + norm2);

                offset += stride;
            }
            normalsVertexBuffer.unmap(writer);
        }
    };

    var sceneNodes = this.rootNodes;
    var numNodes = sceneNodes.length;
    for (var i = 0; i < numNodes; i += 1)
    {
        node = sceneNodes[i];
        if (node.renderables)
        {
            var normalsNumVerts;

            var geometry;
            var surface;
            var vertexBuffer;
            var numVerts;
            var vertexBufferData;
            var positionOffset;
            var scaleGeometry;

            var normalOffset;
            var normalRenderable;
            var tangentOffset;
            var tangentRenderable;
            var binormalOffset;
            var binormalRenderable;

            var renderablesLength = node.renderables.length;
            for (var j = 0; j < renderablesLength; j += 1)
            {
                var renderable = node.renderables[j];

                if (!renderable.isNormal)
                {
                    geometry = renderable.geometry;
                    surface = renderable.surface;
                    halfExtents = geometry.halfExtents;
                    vertexBuffer = geometry.vertexBuffer;
                    scaleGeometry = (halfExtents[0] + halfExtents[1] + halfExtents[2]) * 0.01;

                    if (!renderable.normalsInfo)
                    {
                        var first;
                        if (surface.indexBuffer)
                        {
                            var vertexBufferAllocation = geometry.vertexBufferAllocation;
                            first = vertexBufferAllocation.baseIndex;
                            numVerts = vertexBufferAllocation.length;
                        }
                        else
                        {
                            first = surface.first;
                            numVerts = surface.numVertices;
                        }

                        var semantics = geometry.semantics;
                        var numSemantics = semantics.length;
                        normalsNumVerts = numVerts * 2;
                        stride = vertexBuffer.stride;
                        vertexBufferData = surface.vertexData;

                        var attributes = vertexBuffer.attributes;
                        var numAttributes = attributes.length;
                        center = geometry.center;

                        normalOffset = -1;
                        tangentOffset = -1;
                        binormalOffset = -1;
                        positionOffset = -1;
                        normalRenderable = null;
                        tangentRenderable = null;
                        binormalRenderable = null;

                        var offset = 0;
                        var semantic, attribute;

                        debug.assert(numAttributes === numSemantics);

                        for (var n = 0; n < numSemantics; n += 1)
                        {
                            semantic = semantics[n];
                            attribute = attributes[n];
                            if (gd.SEMANTIC_POSITION === semantic)
                            {
                                positionOffset = offset;
                            }
                            else if (gd.SEMANTIC_NORMAL === semantic)
                            {
                                normalRenderable = createNormalsGeometryInstance(normalsNumVerts, normalMaterial);
                                normalRenderable.normals = true;
                                normalOffset = offset;
                            }
                            else if (gd.SEMANTIC_TANGENT === semantic)
                            {
                                tangentRenderable = createNormalsGeometryInstance(normalsNumVerts, tangentMaterial);
                                tangentRenderable.tangents = true;
                                tangentOffset = offset;
                            }
                            else if (gd.SEMANTIC_BINORMAL === semantic)
                            {
                                binormalRenderable = createNormalsGeometryInstance(normalsNumVerts, binormalMaterial);
                                binormalRenderable.binormal = true;
                                binormalOffset = offset;
                            }

                            var numComponents =
                                this.attributeComponents(attribute);
                            offset += numComponents;
                        }

                        debug.assert(positionOffset !== -1);

                        renderable.normalsInfo = {
                                stride: stride,
                                positionOffset: positionOffset,
                                vertexBufferData: vertexBufferData,
                                normalsNumVerts: normalsNumVerts,
                                normalOffset: normalOffset,
                                tangentOffset: tangentOffset,
                                binormalOffset: binormalOffset,
                                normalRenderable: normalRenderable,
                                tangentRenderable: tangentRenderable,
                                binormalRenderable: binormalRenderable,
                                scale: scaleGeometry
                            };

                    }
                    else
                    {
                        var normalsInfo = renderable.normalsInfo;
                        stride = normalsInfo.stride;
                        positionOffset = normalsInfo.positionOffset;
                        vertexBufferData = normalsInfo.vertexBufferData;
                        normalsNumVerts = normalsInfo.normalsNumVerts;

                        normalRenderable = normalsInfo.normalRenderable;
                        tangentRenderable = normalsInfo.tangentRenderable;
                        binormalRenderable = normalsInfo.binormalRenderable;

                        normalOffset = normalsInfo.normalOffset;
                        tangentOffset = normalsInfo.tangentOffset;
                        binormalOffset = normalsInfo.binormalOffset;

                        scaleGeometry = normalsInfo.scale;
                    }

                    if (normalRenderable)
                    {
                        normalRenderable.disabled = !drawNormals;
                        if (drawNormals)
                        {
                            normalRenderable.setMaterial(normalMaterial);
                            writeNormals(normalRenderable.geometry.vertexBuffer,
                                         vertexBufferData,
                                         positionOffset,
                                         normalOffset,
                                         normalsNumVerts,
                                         scale * scaleGeometry);
                        }
                    }
                    if (tangentRenderable)
                    {
                        tangentRenderable.disabled = !drawTangents;
                        if (drawTangents)
                        {
                            tangentRenderable.setMaterial(tangentMaterial);
                            writeNormals(tangentRenderable.geometry.vertexBuffer,
                                         vertexBufferData,
                                         positionOffset,
                                         tangentOffset,
                                         normalsNumVerts,
                                         scale * scaleGeometry);
                        }
                    }
                    if (binormalRenderable)
                    {
                        binormalRenderable.disabled = !drawBinormals;
                        if (drawBinormals)
                        {
                            binormalRenderable.setMaterial(binormalMaterial);
                            writeNormals(binormalRenderable.geometry.vertexBuffer,
                                         vertexBufferData,
                                         positionOffset,
                                         binormalOffset,
                                         normalsNumVerts,
                                         scale * scaleGeometry);
                        }
                    }
                }

            }
        }
    }
};

//
//
//
Scene.prototype.attributeComponents = function attributeComponentsFn(attribute)
{
    if (TurbulenzEngine.canvas)
    {
        // Shortcut for canvas mode
        return attribute.numComponents;
    }

    var attrToComponents = this.vertexAttrToNumComponents;
    if (!attrToComponents)
    {
        var gd = TurbulenzEngine.getGraphicsDevice();

        attrToComponents = {};
        attrToComponents[gd.VERTEXFORMAT_BYTE4] = 4;
        attrToComponents[gd.VERTEXFORMAT_BYTE4N] = 4;
        attrToComponents[gd.VERTEXFORMAT_UBYTE4] = 4;
        attrToComponents[gd.VERTEXFORMAT_UBYTE4N] = 4;
        attrToComponents[gd.VERTEXFORMAT_SHORT4] = 4;
        attrToComponents[gd.VERTEXFORMAT_SHORT4N] = 4;
        attrToComponents[gd.VERTEXFORMAT_USHORT4] = 4;
        attrToComponents[gd.VERTEXFORMAT_USHORT4N] = 4;
        attrToComponents[gd.VERTEXFORMAT_FLOAT4] = 4;
        attrToComponents[gd.VERTEXFORMAT_SHORT2] = 2;
        attrToComponents[gd.VERTEXFORMAT_SHORT2N] = 2;
        attrToComponents[gd.VERTEXFORMAT_USHORT2] = 2;
        attrToComponents[gd.VERTEXFORMAT_USHORT2N] = 2;
        attrToComponents[gd.VERTEXFORMAT_FLOAT2] = 2;
        attrToComponents[gd.VERTEXFORMAT_FLOAT1] = 1;
        attrToComponents[gd.VERTEXFORMAT_FLOAT3] = 3;

        this.vertexAttrToNumComponents = attrToComponents;
    }

    var numComponents = attrToComponents[attribute];
    debug.assert(numComponents, "Unknown attribute type");
    return numComponents;
};


//
// drawWireframe
//
Scene.prototype.drawWireframe = function drawWireframeFn(gd, sm, camera, wireframeInfo)
{
    var nodes = this.visibleNodes;
    var numNodes = nodes.length;
    if (numNodes)
    {
        var shader = sm.load("shaders/debug.cgfx");
        var technique = shader.getTechnique("wireframe");
        var technique_skinned = shader.getTechnique("wireframe_skinned");
        if (!technique || !technique_skinned)
        {
            return false;
        }

        var md = this.md;

        var setTechnique = gd.setTechnique;
        var setStream = gd.setStream;
        var draw = gd.draw;
        var m43MulM44 = md.m43MulM44;

        var vpm = camera.viewProjectionMatrix;

        var currentTechnique, wvp, wireframeSemantics, attributes,
            numAttributeComponents, numBlendComponents;

        var vformatFloat4 = gd.VERTEXFORMAT_FLOAT4;
        var vformatFloat3 = gd.VERTEXFORMAT_FLOAT3;
        var vformatByte4 = gd.VERTEXFORMAT_BYTE4;

        var skinnedAttributes = [ vformatFloat4, vformatFloat3,
                                  vformatFloat3, vformatByte4,
                                  vformatFloat4, vformatByte4,
                                  vformatFloat4, vformatByte4,
                                  vformatFloat4 ];
        var solidAttributes = [vformatFloat4,
                               vformatFloat3,
                               vformatFloat3];

        var skinnedWireframeSemantics = this.skinnedWireframeSemantics;
        if (!skinnedWireframeSemantics)
        {
            skinnedWireframeSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0', 'TEXCOORD1', 'BLENDINDICES', 'BLENDWEIGHT', 'TEXCOORD2', 'TEXCOORD3', 'TEXCOORD4', 'TEXCOORD5']);
            this.skinnedWireframeSemantics = skinnedWireframeSemantics;
        }

        var solidWireframeSemantics = this.solidWireframeSemantics;
        if (!solidWireframeSemantics)
        {
            solidWireframeSemantics = gd.createSemantics(['POSITION', 'TEXCOORD0', 'TEXCOORD1']);
            this.solidWireframeSemantics = solidWireframeSemantics;
        }

        for (var n = 0; n < numNodes; n += 1)
        {
            var node = nodes[n];
            var renderables = node.renderables;
            if (renderables && !node.disabled)
            {
                var numRenderables = renderables.length;
                for (var i = 0; i < numRenderables; i += 1)
                {
                    var renderable = renderables[i];
                    var oldSurface = renderable.surface;

                    if (!renderable.disabled &&
                        oldSurface &&
                        oldSurface.vertexData &&
                        (oldSurface.primitive === gd.PRIMITIVE_TRIANGLES ||
                         oldSurface.primitive === gd.PRIMITIVE_TRIANGLE_STRIP ||
                         oldSurface.primitive === gd.PRIMITIVE_TRIANGLE_FAN))
                    {
                        var surfacePrimitive = oldSurface.primitive;
                        var skinController = renderable.skinController;
                        if (skinController)
                        {
                            if (currentTechnique !== technique_skinned)
                            {
                                currentTechnique = technique_skinned;
                                setTechnique.call(gd, technique_skinned);
                            }

                            currentTechnique.skinBones = skinController.output;

                            attributes = skinnedAttributes;
                            wireframeSemantics = skinnedWireframeSemantics;
                            numAttributeComponents = 34;
                            numBlendComponents = 24;
                        }
                        else
                        {
                            if (currentTechnique !== technique)
                            {
                                currentTechnique = technique;
                                setTechnique.call(gd, technique);
                            }

                            attributes = solidAttributes;
                            wireframeSemantics = solidWireframeSemantics;
                            numAttributeComponents = 10;
                            numBlendComponents = 0;
                        }

                        wvp = m43MulM44.call(md, renderable.node.world, vpm, wvp);
                        currentTechnique.worldViewProjection = wvp;
                        currentTechnique.windowScale = [gd.width / 2, gd.height / 2];
                        if (wireframeInfo && wireframeInfo.wireColor && wireframeInfo.fillColor)
                        {
                            currentTechnique.wireColor = wireframeInfo.wireColor;
                            currentTechnique.fillColor = wireframeInfo.fillColor;
                            currentTechnique.alphaRef = wireframeInfo.alphaRef;
                        }
                        else
                        {
                            currentTechnique.wireColor = md.v4Build(0, 0, 0, 1); //choose color for the wireframe lines
                            currentTechnique.fillColor = md.v4Build(1, 1, 1, 0); //choose color for the interior of the polygon,
                                                                        //leave alpha as zero to allow removing interior of polygons
                            currentTechnique.alphaRef = 0.35; //set to greater than zero (e.g. 0.1) to remove interior of polygons
                        }

                        var wireframeBuffer = oldSurface.wireframeBuffer;
                        if (!wireframeBuffer)
                        {
                            var oldGeometry = renderable.geometry;
                            var oldVertexBuffer = oldGeometry.vertexBuffer;
                            var oldSemantics = oldGeometry.semantics;
                            var oldVertexBufferData = oldSurface.vertexData;
                            var indexBuffer = oldSurface.indexBuffer;

                            var stride = oldVertexBuffer.stride;
                            var positionOffset = 0;
                            var blendIndicesOffset = 0;
                            var blendWeightOffset = 0;

                            var semanticFound = false;
                            for (var j = 0; j < oldSemantics.length; j += 1)
                            {
                                if (oldSemantics[j] !== gd.SEMANTIC_POSITION)
                                {
                                    positionOffset += Scene.prototype.attributeComponents(oldVertexBuffer.attributes[j]);
                                }
                                else
                                {
                                    semanticFound = true;
                                    break;
                                }
                            }
                            if (semanticFound === false)    //sanity check
                            {
                                return false;
                            }

                            if (currentTechnique === technique_skinned)
                            {
                                semanticFound = false;
                                for (j = 0; j < oldSemantics.length; j += 1)
                                {
                                    if (oldSemantics[j] !== gd.SEMANTIC_BLENDINDICES)
                                    {
                                        blendIndicesOffset += Scene.prototype.attributeComponents(oldVertexBuffer.attributes[j]);
                                    }
                                    else
                                    {
                                        semanticFound = true;
                                        break;
                                    }
                                }
                                if (semanticFound === false)    //sanity check
                                {
                                    return false;
                                }

                                semanticFound = false;
                                for (j = 0; j < oldSemantics.length; j += 1)
                                {
                                    if (oldSemantics[j] !== gd.SEMANTIC_BLENDWEIGHT)
                                    {
                                        blendWeightOffset += Scene.prototype.attributeComponents(oldVertexBuffer.attributes[j]);
                                    }
                                    else
                                    {
                                        semanticFound = true;
                                        break;
                                    }
                                }
                                if (semanticFound === false)    //sanity check
                                {
                                    return false;
                                }
                            }

                            var indexBufferData, vertexBuffer, dataLength, numTriangles, k, stepSize;
                            var vData = [];
                            var dstIndex = 0;
                            var vdIndex0, vdValue0x, vdValue0y, vdValue0z,
                                vdIndex1, vdValue1x, vdValue1y, vdValue1z,
                                vdIndex2, vdValue2x, vdValue2y, vdValue2z;

                            if (indexBuffer)
                            {
                                indexBufferData = oldSurface.indexData;
                                dataLength = indexBufferData.length;
                                stepSize = 3;
                            }
                            else if (surfacePrimitive === gd.PRIMITIVE_TRIANGLE_STRIP || surfacePrimitive === gd.PRIMITIVE_TRIANGLE_FAN)
                            {
                                numTriangles = oldSurface.numVertices - 2;
                                dataLength = numTriangles * 3;
                                stepSize = 1;
                            }
                            else    //unindexed and gd.PRIMITIVE_TRIANGLES
                            {
                                dataLength = oldSurface.numVertices;
                                stepSize = 3;
                            }

                            vertexBuffer = gd.createVertexBuffer({
                                    numVertices: dataLength,
                                    attributes: attributes,
                                    dynamic: true
                                });

                            vData.length = dataLength * numAttributeComponents;

                            for (j = 0; j < dataLength; j += stepSize)
                            {
                                //set the indices
                                if (indexBuffer)
                                {
                                    vdIndex0 = indexBufferData[j] * stride + positionOffset;
                                    vdIndex1 = indexBufferData[j + 1] * stride + positionOffset;
                                    vdIndex2 = indexBufferData[j + 2] * stride + positionOffset;
                                }
                                else if (surfacePrimitive === gd.PRIMITIVE_TRIANGLE_STRIP)
                                {
                                    if ((j % 2) === 0)
                                    {
                                        vdIndex0 = j * stride + positionOffset;
                                        vdIndex1 = (j + 1) * stride + positionOffset;
                                        vdIndex2 = (j + 2) * stride + positionOffset;
                                    }
                                    else
                                    {
                                        vdIndex0 = (j + 1) * stride + positionOffset;
                                        vdIndex1 = j * stride + positionOffset;
                                        vdIndex2 = (j + 2) * stride + positionOffset;
                                    }
                                }
                                else if (surfacePrimitive === gd.PRIMITIVE_TRIANGLE_FAN)
                                {
                                    vdIndex0 = positionOffset;  //0 * stride + positionOffset;
                                    vdIndex1 = (j + 1) * stride + positionOffset;
                                    vdIndex2 = (j + 2) * stride + positionOffset;
                                }
                                else
                                {
                                    vdIndex0 = j * stride + positionOffset;
                                    vdIndex1 = (j + 1) * stride + positionOffset;
                                    vdIndex2 = (j + 2) * stride + positionOffset;
                                }

                                //Vertex 0
                                vdValue0x = oldVertexBufferData[vdIndex0];
                                vdValue0y = oldVertexBufferData[vdIndex0 + 1];
                                vdValue0z = oldVertexBufferData[vdIndex0 + 2];
                                vData[dstIndex] = vdValue0x;
                                vData[dstIndex + 1] = vdValue0y;
                                vData[dstIndex + 2] = vdValue0z;
                                vData[dstIndex + 3] = 0;
                                //Vertex 1 passed as attribute of Vertex 0
                                vdValue1x = oldVertexBufferData[vdIndex1];
                                vdValue1y = oldVertexBufferData[vdIndex1 + 1];
                                vdValue1z = oldVertexBufferData[vdIndex1 + 2];
                                vData[dstIndex + 4] = vdValue1x;
                                vData[dstIndex + 5] = vdValue1y;
                                vData[dstIndex + 6] = vdValue1z;
                                //Vertex 2 passed as attribute of Vertex 0
                                vdValue2x = oldVertexBufferData[vdIndex2];
                                vdValue2y = oldVertexBufferData[vdIndex2 + 1];
                                vdValue2z = oldVertexBufferData[vdIndex2 + 2];
                                vData[dstIndex + 7] = vdValue2x;
                                vData[dstIndex + 8] = vdValue2y;
                                vData[dstIndex + 9] = vdValue2z;
                                //Depending on whether skinned or not, increments accordingly
                                dstIndex += numAttributeComponents;

                                //Repeat for Vertex 1
                                vData[dstIndex] = vdValue1x;
                                vData[dstIndex + 1] = vdValue1y;
                                vData[dstIndex + 2] = vdValue1z;
                                vData[dstIndex + 3] = 1;
                                vData[dstIndex + 4] = vdValue0x;
                                vData[dstIndex + 5] = vdValue0y;
                                vData[dstIndex + 6] = vdValue0z;
                                vData[dstIndex + 7] = vdValue2x;
                                vData[dstIndex + 8] = vdValue2y;
                                vData[dstIndex + 9] = vdValue2z;
                                dstIndex += numAttributeComponents;

                                //Repeat for Vertex 2
                                vData[dstIndex] = vdValue2x;
                                vData[dstIndex + 1] = vdValue2y;
                                vData[dstIndex + 2] = vdValue2z;
                                vData[dstIndex + 3] = 2;
                                vData[dstIndex + 4] = vdValue0x;
                                vData[dstIndex + 5] = vdValue0y;
                                vData[dstIndex + 6] = vdValue0z;
                                vData[dstIndex + 7] = vdValue1x;
                                vData[dstIndex + 8] = vdValue1y;
                                vData[dstIndex + 9] = vdValue1z;
                                dstIndex += numAttributeComponents;
                            }

                            //if skinned, fill the added gaps in vData
                            if (currentTechnique === technique_skinned)
                            {
                                var vdIndex0i, vdIndex0w, vdIndex1i, vdIndex1w, vdIndex2i, vdIndex2w;
                                var vdValue0iw = [];
                                var vdValue1iw = [];
                                var vdValue2iw = [];
                                dstIndex = 0;
                                for (j = 0; j < dataLength; j += stepSize)
                                {
                                    //set the indices
                                    if (indexBuffer)
                                    {
                                        vdIndex0i = indexBufferData[j] * stride + blendIndicesOffset;
                                        vdIndex1i = indexBufferData[j + 1] * stride + blendIndicesOffset;
                                        vdIndex2i = indexBufferData[j + 2] * stride + blendIndicesOffset;
                                        vdIndex0w = indexBufferData[j] * stride + blendWeightOffset;
                                        vdIndex1w = indexBufferData[j + 1] * stride + blendWeightOffset;
                                        vdIndex2w = indexBufferData[j + 2] * stride + blendWeightOffset;
                                    }
                                    else if (surfacePrimitive === gd.PRIMITIVE_TRIANGLE_STRIP)
                                    {
                                        if ((j % 2) === 0)
                                        {
                                            vdIndex0i = j * stride + blendIndicesOffset;
                                            vdIndex1i = (j + 1) * stride + blendIndicesOffset;
                                            vdIndex2i = (j + 2) * stride + blendIndicesOffset;
                                            vdIndex0w = j * stride + blendWeightOffset;
                                            vdIndex1w = (j + 1) * stride + blendWeightOffset;
                                            vdIndex2w = (j + 2) * stride + blendWeightOffset;
                                        }
                                        else
                                        {
                                            vdIndex0i = (j + 1) * stride + blendIndicesOffset;
                                            vdIndex1i = j * stride + blendIndicesOffset;
                                            vdIndex2i = (j + 2) * stride + blendIndicesOffset;
                                            vdIndex0w = (j + 1) * stride + blendWeightOffset;
                                            vdIndex1w = j * stride + blendWeightOffset;
                                            vdIndex2w = (j + 2) * stride + blendWeightOffset;
                                        }
                                    }
                                    else if (surfacePrimitive === gd.PRIMITIVE_TRIANGLE_FAN)
                                    {
                                        vdIndex0i = blendIndicesOffset;   //0 * stride + blendIndicesOffset;
                                        vdIndex1i = (j + 1) * stride + blendIndicesOffset;
                                        vdIndex2i = (j + 2) * stride + blendIndicesOffset;
                                        vdIndex0w = blendWeightOffset;    //0 * stride + blendWeightOffset;
                                        vdIndex1w = (j + 1) * stride + blendWeightOffset;
                                        vdIndex2w = (j + 2) * stride + blendWeightOffset;
                                    }
                                    else
                                    {
                                        vdIndex0i = j * stride + blendIndicesOffset;
                                        vdIndex1i = (j + 1) * stride + blendIndicesOffset;
                                        vdIndex2i = (j + 2) * stride + blendIndicesOffset;
                                        vdIndex0w = j * stride + blendWeightOffset;
                                        vdIndex1w = (j + 1) * stride + blendWeightOffset;
                                        vdIndex2w = (j + 2) * stride + blendWeightOffset;
                                    }

                                    //Vertex 0
                                    for (k = 0; k < 4; k += 1)
                                    {
                                        vdValue0iw[k] = oldVertexBufferData[vdIndex0i + k];
                                        vdValue0iw[k + 4] = oldVertexBufferData[vdIndex0w + k];
                                        vdValue1iw[k] = oldVertexBufferData[vdIndex1i + k];
                                        vdValue1iw[k + 4] = oldVertexBufferData[vdIndex1w + k];
                                        vdValue2iw[k] = oldVertexBufferData[vdIndex2i + k];
                                        vdValue2iw[k + 4] = oldVertexBufferData[vdIndex2w + k];
                                    }
                                    for (k = 0; k < 8; k += 1)
                                    {
                                        vData[dstIndex + 10 + k] = vdValue0iw[k];
                                        vData[dstIndex + 18 + k] = vdValue1iw[k];
                                        vData[dstIndex + 26 + k] = vdValue2iw[k];
                                    }
                                    dstIndex += numAttributeComponents;

                                    //Repeat for Vertex 1
                                    for (k = 0; k < 8; k += 1)
                                    {
                                        vData[dstIndex + 10 + k] = vdValue1iw[k];
                                        vData[dstIndex + 18 + k] = vdValue0iw[k];
                                        vData[dstIndex + 26 + k] = vdValue2iw[k];
                                    }
                                    dstIndex += numAttributeComponents;

                                    //Repeat for Vertex 2
                                    for (k = 0; k < 8; k += 1)
                                    {
                                        vData[dstIndex + 10 + k] = vdValue2iw[k];
                                        vData[dstIndex + 18 + k] = vdValue0iw[k];
                                        vData[dstIndex + 26 + k] = vdValue1iw[k];
                                    }
                                    dstIndex += numAttributeComponents;
                                }
                            }

                            vertexBuffer.setData(vData);
                            indexBuffer = null;
                            oldSurface.wireframeBuffer = vertexBuffer;
                            wireframeBuffer = vertexBuffer;
                        }

                        setStream.call(gd, wireframeBuffer, wireframeSemantics);
                        draw.call(gd, gd.PRIMITIVE_TRIANGLES, wireframeBuffer.numVertices, 0);
                    }
                }
            }
        }
    }
    return true;
};


//
// getVisibilityMetrics
//
Scene.prototype.getVisibilityMetrics =
    function getVisibilityMetricsFn() : SceneDebuggingMetrics
{
    var visiblePortals = this.visiblePortals;
    var numVisiblePortals = visiblePortals.length;

    var numPortalsPlanes = 0;
    var n;
    for (n = 0; n < numVisiblePortals; n += 1)
    {
        numPortalsPlanes += visiblePortals[n].planes.length;
    }

    var numRenderables = this.visibleRenderables.length;
    var numShadowMaps = 0, numOccluders = 0;
    var visibleLights = this.visibleLights;
    var numLights = visibleLights.length;
    for (n = 0; n < numLights; n += 1)
    {
        var lightInstance = visibleLights[n];
        if (lightInstance.numVisibleDrawParameters) // Forward rendering
        {
            numRenderables += lightInstance.numVisibleDrawParameters;
        }
        var shadowMap = lightInstance.shadowMap;
        if (shadowMap)
        {
            if (lightInstance.frameVisible === shadowMap.frameVisible &&
                shadowMap.numRenderables) // may be undefined
            {
                numShadowMaps += 1;
                numOccluders += shadowMap.numRenderables;
            }
        }
    }

    return {
        numPortals: numVisiblePortals,
        numPortalsPlanes: numPortalsPlanes,
        numLights: numLights,
        numRenderables: numRenderables,
        numShadowMaps: numShadowMaps,
        numOccluders: numOccluders
    };
};

//
// getDebugSemanticsPosCol
//
Scene.prototype.getDebugSemanticsPosCol = function getDebugSemanticsPosColFn()
{
    var debugSemantics = this.debugSemanticsPosCol;
    if (!debugSemantics)
    {
        var gd = TurbulenzEngine.getGraphicsDevice();
        debugSemantics = gd.createSemantics([ gd.SEMANTIC_POSITION,
                                              gd.SEMANTIC_COLOR ]);
        this.debugSemanticsPosCol = debugSemantics;
    }
    return debugSemantics;
};

//
// getDebugSemanticsPos
//
Scene.prototype.getDebugSemanticsPos = function getDebugSemanticsPosFn()
{
    var debugSemantics = this.debugSemanticsPos;
    if (!debugSemantics)
    {
        var gd = TurbulenzEngine.getGraphicsDevice();
        debugSemantics = gd.createSemantics([ gd.SEMANTIC_POSITION ]);
        this.debugSemanticsPos = debugSemantics;
    }
    return debugSemantics;
};
