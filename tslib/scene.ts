// Copyright (c) 2009-2014 Turbulenz Limited
/*global AABBTree*/
/*global Material*/
/*global SceneNode*/
/*global Geometry*/
/*global GeometryInstance*/
/*global Light*/
/*global LightInstance*/
/*global Utilities*/
/*global VertexBufferManager*/
/*global IndexBufferManager*/
/*global alert*/
/*global Uint16Array*/
/*global Uint32Array*/
/*global Float32Array*/

/* tslint:disable:max-line-length */

interface ScenePortal
{
    disabled : boolean;
    area     : SceneArea;
    extents  : any; // Array[6] or Float32Array(6)?
    plane    : any; // v4 or Array
};

interface SceneArea
{
    portals        : ScenePortal[];
    extents        : any; // v6 / Array?

    target?        : SceneNode;
    queryCounter?  : number;
    externalNodes? : SceneNode[];
};

interface SceneBSPNode
{
    plane: any; // v4
    pos: any; // v3?
    neg: any; // TODO:
};

interface SpatialMap
{
    add: (externalNode, extents: any) => void;
    update: (externalNode, extents) => void;
    remove: (externalNode) => void;
    finalize: () => void;
    getVisibleNodes: (planes, visibleNodes, startIndex?) => number;
    getOverlappingNodes: (queryExtents, overlappingNodes, startIndex?) => number;
    getSphereOverlappingNodes: (center, radius, overlappingNodes) => void;
    getOverlappingPairs: (overlappingPairs, startIndex) => number;
    getExtents: () => any;
    clear: () => void;
};

//
// Scene
//
class Scene
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    md: MathDevice;

    onGeometryDestroyed: { (geometry: Geometry): void; };
    onMaterialDestroyed: { (material: Material): void; };

    effects: Effect[];
    effectsMap: { [name: string]: Effect; };
    semantics: Semantics;
    lights: { [name: string]: Light; };
    globalLights: Light[];

    rootNodes: SceneNode[];
    rootNodesMap: { [name: string]: SceneNode; };
    dirtyRoots: { [name: string]: SceneNode; };
    nodesToUpdate: SceneNode[];
    numNodesToUpdate: number;
    queryVisibleNodes: SceneNode[];

    materials: { [name: string]: Material; };
    shapes: any; // TODO:

    staticSpatialMap: SpatialMap;
    dynamicSpatialMap: SpatialMap;
    frustumPlanes: any[]; // v4[]?
    animations: any; // TODO:
    skeletons: any; // TODO:
    extents: any; // Array or Float32Array
    visibleNodes: SceneNode[];
    visibleRenderables: Renderable[];
    visibleLights: LightInstance[];
    cameraAreaIndex: number;
    cameraExtents: any; // Array or Float32Array(6)
    visiblePortals: any[]; // TODO:
    frameIndex: number;
    queryCounter: number;
    staticNodesChangeCounter: number;
    testExtents: any; // Array or Float32Array(6)
    externalNodesStack: SceneNode[];
    overlappingPortals: any[]; // PortalItem[]
    newPoints: any[]; // v3[]

    vertexBufferManager: VertexBufferManager;
    indexBufferManager: IndexBufferManager;

    areas: SceneArea[];
    areaInitalizeStaticNodesChangeCounter: number;

    nearPlane: any; // v4 / Array
    maxDistance: number;

    bspNodes: SceneBSPNode[];

    float32ArrayConstructor: any; // on prototype
    uint16ArrayConstructor: any; // on prototype
    uint32ArrayConstructor: any; // on prototype

    // Scene
    constructor(mathDevice: MathDevice, staticSpatialMap?: SpatialMap, dynamicSpatialMap?: SpatialMap)
    {
        this.md = mathDevice;
        this.staticSpatialMap = (staticSpatialMap || AABBTree.create(true));
        this.dynamicSpatialMap = (dynamicSpatialMap || AABBTree.create());

        this.clear();

        var scene = this;
        this.onGeometryDestroyed = function sceneOnGeometryDestroyedFn(geometry)
        {
            geometry.reference.unsubscribeDestroyed(scene.onGeometryDestroyed);
            delete scene.shapes[geometry.name];
        };

        this.onMaterialDestroyed = function sceneOnMaterialDestroyedFn(material)
        {
            material.reference.unsubscribeDestroyed(scene.onMaterialDestroyed);
            delete scene.materials[material.name];
        };
    }

    // getMaterial: (node) => string;
    getMaterialName: (node) => string;
    findLightName: (light) => string;
    writeBox: (writer, extents, r, g, b) => void;
    writeRotatedBox: (writer, transform, halfExtents, r, g, b) => void;
    drawLights: (gd, sm, camera) => void;
    drawLightsExtents: (gd, sm, camera) => void;
    drawLightsScreenExtents: (gd, sm /*, camera */) => void;
    drawAreas: (gd, sm, camera) => void;
    drawPortals: (gd, sm, camera) => void;
    drawTransforms: (gd, sm, camera, scale) => void;
    drawAnimationHierarchy: (gd, sm, camera, hierarchy, numJoints, controller, matrix, boneColor, boundsColor) => void;
    getDebugSemanticsPos: () => Semantics;
    getDebugSemanticsPosCol: () => Semantics;
    getMetrics: () => any;
    getVisibilityMetrics: () => any;
    drawWireframe: (gd, sm, camera, wireframeInfo) => void;
    attributeComponents: (attribute) => number;
    updateNormals: (gd, scale, drawNormals, normalMaterial, drawTangents,
                    tangentMaterial, drawBinormals, binormalMaterial) => void;
    drawNodesTree: (tree, gd, sm, camera, drawLevel) => void;
    drawCellsGrid: (grid, gd, sm, camera) => void;
    drawDynamicNodesTree: (gd, sm, camera, drawLevel) => void;
    drawStaticNodesTree: (gd, sm, camera, drawLevel) => void;
    drawTransparentNodesExtents: (gd, sm, camera) => void;
    drawDecalNodesExtents: (gd, sm, camera) => void;
    drawOpaqueNodesExtents: (gd, sm, camera) => void;
    drawVisibleRenderablesExtents: (gd, sm, camera, drawDecals,
                                    drawTransparents) => void;
    drawPhysicsGeometry: (gd, sm, camera, physicsManager) => void;
    drawPhysicsNodes: (gd, sm, camera, physicsManager) => void;
    createConvexHull: (dw, body, numRays) => { indices: any; vertices: any; };
    createBox: (halfExtents)
        => { indices: any; vertices: any;
             minExtent: number[]; maxExtent: number[]; };
    createRoundedPrimitive: (mSizeX, mSizeY, mSizeZ, radius, mChamferNumSeg)
        => { indices: any; vertices: any;
             minExtent: number[]; maxExtent: number[]; };
    createCylinder: (radius1, radius2, len, capEnds, tesselation)
        => { indices: any; vertices: any;
             minExtent: number[]; maxExtent: number[]; };
    createGeoSphere: (radius, recursionLevel)
        => { indices: any; vertices: any;
             minExtent: number[]; maxExtent: number[]; };
    drawSceneNodeHierarchy: (gd, sm, camera) => void;

    //
    // findNode
    //
    findNode(nodePath) : SceneNode
    {
        //simple case of root node
        var result =  this.rootNodesMap[nodePath];
        if (result)
        {
            return result;
        }

        //else find node in turn
        var names = nodePath.split("/");
        var rootName = names[0];
        result =  this.rootNodesMap[rootName];

        for (var depth = 1; result && depth < names.length;  depth += 1)
        {
            result = result.findChild(names[depth]);
        }
        return result;
    }

    //
    // addRootNode
    //
    addRootNode(rootNode)
    {
        // Add the root to the top level nodes list and update the scene hierarchys
        var name = rootNode.name;

        debug.assert(name, "Root nodes must be named");
        debug.assert(!rootNode.scene, "Root node already in a scene");
        debug.assert(!this.rootNodesMap[name], "Root node with the same name exits in the scene");

        // Need to call this method before setting scene property
        rootNode.addedToScene(this);

        rootNode.scene = this;

        this.rootNodes.push(rootNode);
        this.rootNodesMap[name] = rootNode;
    }

    //
    // removeRootNode
    //
    removeRootNode(rootNode)
    {
        var name = rootNode.name;

        debug.assert(rootNode.scene === this, "Root node is not in the scene");
        rootNode.removedFromScene(this);

        var rootNodes = this.rootNodes;
        var index = rootNodes.indexOf(rootNode);
        if (index !== -1)
        {
            var numRootNodes = (rootNodes.length - 1);
            if (index < numRootNodes)
            {
                rootNodes[index] = rootNodes[numRootNodes];
            }
            rootNodes.length = numRootNodes;
        }
        delete this.rootNodesMap[name];

        if (this.dirtyRoots[name] === rootNode)
        {
            delete this.dirtyRoots[name];

            // Can not use indexOf because it will search the whole array instead of just the active range
            var nodesToUpdate = this.nodesToUpdate;
            var numNodesToUpdate = this.numNodesToUpdate;
            for (index = 0; index < numNodesToUpdate; index += 1)
            {
                if (nodesToUpdate[index] === rootNode)
                {
                    numNodesToUpdate -= 1;
                    if (index < numNodesToUpdate)
                    {
                        nodesToUpdate[index] = nodesToUpdate[numNodesToUpdate];
                    }
                    nodesToUpdate[numNodesToUpdate] = null;
                    this.numNodesToUpdate = numNodesToUpdate;
                    break;
                }
            }
        }

        rootNode.scene = undefined;
    }

    //
    // addLight
    //
    addLight(light)
    {
        this.lights[light.name] = light;

        if (light.isGlobal())
        {
            this.globalLights.push(light);
        }
    }

    //
    // removeLight
    //
    removeLight(light)
    {
        delete this.lights[light.name];

        if (light.isGlobal())
        {
            var globalLights = this.globalLights;
            var numGlobalLights = globalLights.length;
            for (var index = 0; index < numGlobalLights; index += 1)
            {
                if (light === globalLights[index])
                {
                    globalLights.splice(index, 1);
                    break;
                }
            }
        }
    }

    //
    // getLight
    //
    getLight(name)
    {
        return this.lights[name];
    }

    //
    // getGlobalLights
    //
    getGlobalLights()
    {
        return this.globalLights;
    }

    //
    // calculateNumNodes
    //
    calculateNumNodes(nodes)
    {
        var numNodes = nodes.length;
        var numTotalNodes = numNodes;
        for (var n = 0; n < numNodes; n += 1)
        {
            var children = nodes[n].children;
            if (children)
            {
                numTotalNodes += this.calculateNumNodes(children);
            }
        }
        return numTotalNodes;
    }

    //
    // buildPortalPlanes
    //
    buildPortalPlanes(points, planes, cX, cY, cZ, frustumPlanes) : boolean
    {
        var md = this.md;
        var numPoints = points.length;
        var numFrustumPlanes = frustumPlanes.length;
        var numPlanes = 0;
        var n, np, nnp, p, plane, numVisiblePointsPlane;

        debug.assert(numFrustumPlanes < 32, "Cannot use bit field for so many planes...");

        var culledByPlane: number[] = [];
        culledByPlane.length = numPoints;
        np = 0;
        do
        {
            culledByPlane[np] = 0;
            np += 1;
        }
        while (np < numPoints);

        n = 0;
        do
        {
            plane = frustumPlanes[n];
            var pl0 = plane[0];
            var pl1 = plane[1];
            var pl2 = plane[2];
            var pl3 = plane[3];
            numVisiblePointsPlane = 0;

            np = 0;
            do
            {
                p = points[np];
                if ((pl0 * p[0] + pl1 * p[1] + pl2 * p[2]) >= pl3)
                {
                    numVisiblePointsPlane += 1;
                }
                else
                {
                    /* tslint:disable:no-bitwise */
                    culledByPlane[np] |= (1 << n);
                    /* tslint:enable:no-bitwise */
                }
                np += 1;
            }
            while (np < numPoints);

            if (numVisiblePointsPlane === 0)
            {
                planes.length = 0;
                return false;
            }
            else if (numVisiblePointsPlane < numPoints)
            {
                planes[numPlanes] = md.v4Copy(plane, planes[numPlanes]);
                numPlanes += 1;
            }
            n += 1;
        }
        while (n < numFrustumPlanes);

        var allPointsVisible = (numPlanes === 0);

        var newPoints = this.newPoints;
        np = 0;
        do
        {
            p = points[np];
            newPoints[np] = md.v3Build((p[0] - cX), (p[1] - cY), (p[2] - cZ), newPoints[np]);
            np += 1;
        }
        while (np < numPoints);

        var sqrt = Math.sqrt;
        np = 0;
        do
        {
            nnp = (np + 1);
            if (nnp >= numPoints)
            {
                nnp = 0;
            }

            /* tslint:disable:no-bitwise */
            // Skip plane if both points were culled by the same frustum plane
            if (0 !== (culledByPlane[np] & culledByPlane[nnp]))
            {
                np += 1;
                continue;
            }
            /* tslint:enable:no-bitwise */

            p = newPoints[np];
            var p0X = p[0];
            var p0Y = p[1];
            var p0Z = p[2];

            p = newPoints[nnp];
            var p1X = p[0];
            var p1Y = p[1];
            var p1Z = p[2];

            // n = cross(p0, p1)
            var nX = ((p0Y * p1Z) - (p0Z * p1Y));
            var nY = ((p0Z * p1X) - (p0X * p1Z));
            var nZ = ((p0X * p1Y) - (p0Y * p1X));

            // normalize(n)
            var lnsq = ((nX * nX) + (nY * nY) + (nZ * nZ));
            if (lnsq === 0)
            {
                planes.length = 0;
                return false;
            }
            var lnrcp = 1.0 / sqrt(lnsq);
            nX *= lnrcp;
            nY *= lnrcp;
            nZ *= lnrcp;

            // d = dot(n, c)
            var d = ((nX * cX) + (nY * cY) + (nZ * cZ));

            planes[numPlanes] = md.v4Build(nX, nY, nZ, d, planes[numPlanes]);
            numPlanes += 1;

            np += 1;
        }
        while (np < numPoints);

        planes.length = numPlanes;
        return allPointsVisible;
    }

    //
    // findAreaIndex
    //
    findAreaIndex(bspNodes, cX, cY, cZ) : number
    {
        var numNodes = bspNodes.length;
        var nodeIndex = 0;
        var node, plane;
        do
        {
            node = bspNodes[nodeIndex];
            plane = node.plane;
            nodeIndex = (((plane[0] * cX) + (plane[1] * cY) + (plane[2] * cZ)) < plane[3] ? node.neg : node.pos);
            if (nodeIndex <= 0)
            {
                return -(nodeIndex + 1);
            }
        }
        while (nodeIndex < numNodes);
        return -1;
    }

    //
    // findAreaIndicesAABB
    //
    findAreaIndicesAABB(bspNodes, n0, n1, n2, p0, p1, p2) : number[]
    {
        var numNodes = bspNodes.length;
        var areaIndices = [];
        var visitedArea = [];
        var stack = [0];
        var numNodesStack = 1;
        var nodeIndex, node, plane, areaIndex;
        do
        {
            numNodesStack -= 1;
            nodeIndex = stack[numNodesStack];
            do
            {
                node = bspNodes[nodeIndex];
                plane = node.plane;
                var d0 = plane[0];
                var d1 = plane[1];
                var d2 = plane[2];
                var d3 = plane[3];
                if ((d0 * (d0 < 0 ? n0 : p0) + d1 * (d1 < 0 ? n1 : p1) + d2 * (d2 < 0 ? n2 : p2)) < d3)
                {
                    nodeIndex = node.neg;
                }
                else
                {
                    if ((d0 * (d0 > 0 ? n0 : p0) + d1 * (d1 > 0 ? n1 : p1) + d2 * (d2 > 0 ? n2 : p2)) <= d3)
                    {
                        nodeIndex = node.neg;
                        if (nodeIndex <= 0)
                        {
                            if (nodeIndex < 0)
                            {
                                areaIndex = -(nodeIndex + 1);
                                if (!visitedArea[areaIndex])
                                {
                                    visitedArea[areaIndex] = true;
                                    areaIndices.push(areaIndex);
                                }
                            }
                        }
                        else
                        {
                            stack[numNodesStack] = nodeIndex;
                            numNodesStack += 1;
                        }
                    }
                    nodeIndex = node.pos;
                }
                if (nodeIndex <= 0)
                {
                    if (nodeIndex < 0)
                    {
                        areaIndex = -(nodeIndex + 1);
                        if (!visitedArea[areaIndex])
                        {
                            visitedArea[areaIndex] = true;
                            areaIndices.push(areaIndex);
                        }
                    }
                    break;
                }
            }
            while (nodeIndex < numNodes);
        }
        while (0 < numNodesStack);
        return areaIndices;
    }

    //
    // findVisiblePortals
    //
    findVisiblePortals(areaIndex, cX, cY, cZ)
    {
        var visiblePortals = this.visiblePortals;
        var oldNumVisiblePortals = visiblePortals.length;
        var frustumPlanes = this.frustumPlanes;
        var numFrustumPlanes = frustumPlanes.length;
        var queryCounter = this.getQueryCounter();
        var areas = this.areas;
        var portals, numPortals, portal, plane, area, n, portalPlanes, portalItem;
        var numVisiblePortals = 0;

        // Cull portals behind camera
        // (do NOT use nearPlane directly because areaIndex is based on the camera position)
        var nearPlane  = this.nearPlane;
        var nearPlane0 = nearPlane[0];
        var nearPlane1 = nearPlane[1];
        var nearPlane2 = nearPlane[2];
        frustumPlanes[numFrustumPlanes] = this.md.v4Build(nearPlane0,
                                                          nearPlane1,
                                                          nearPlane2,
                                                          ((nearPlane0 * cX) + (nearPlane1 * cY) + (nearPlane2 * cZ)));

        area = areas[areaIndex];
        portals = area.portals;
        numPortals = portals.length;
        for (n = 0; n < numPortals; n += 1)
        {
            portal = portals[n];
            if (portal.disabled)
            {
                continue;
            }
            portal.queryCounter = queryCounter;
            plane = portal.plane;
            if (((plane[0] * cX) + (plane[1] * cY) + (plane[2] * cZ)) < plane[3])
            {
                if (numVisiblePortals < oldNumVisiblePortals)
                {
                    portalItem = visiblePortals[numVisiblePortals];
                    portalPlanes = portalItem.planes;
                }
                else
                {
                    portalPlanes = [];
                }
                this.buildPortalPlanes(portal.points, portalPlanes, cX, cY, cZ, frustumPlanes);
                if (0 < portalPlanes.length)
                {
                    if (numVisiblePortals < oldNumVisiblePortals)
                    {
                        portalItem.portal = portal;
                        portalItem.area   = portal.area;
                    }
                    else
                    {
                        visiblePortals[numVisiblePortals] = {
                                portal: portal,
                                planes: portalPlanes,
                                area: portal.area
                            };
                    }
                    numVisiblePortals += 1;
                }
            }
        }

        frustumPlanes.length = numFrustumPlanes; // remove camera plane, not needed to cull nodes

        if (0 < numVisiblePortals)
        {
            var numPortalPlanes, nextArea, plane0, plane1, plane2, plane3, planes, allPointsVisible;
            var currentPortalIndex = 0;
            do
            {
                portalItem = visiblePortals[currentPortalIndex];
                currentPortalIndex += 1;
                portalPlanes = portalItem.planes;
                numPortalPlanes = portalPlanes.length;
                portal = portalItem.portal;
                areaIndex = portalItem.area;

                portalPlanes[numPortalPlanes] = portal.plane; // Add current plane to cull portals behind

                area = areas[areaIndex];
                portals = area.portals;
                numPortals = portals.length;
                for (n = 0; n < numPortals; n += 1)
                {
                    portal = portals[n];
                    nextArea = portal.area;
                    if (nextArea !== areaIndex &&
                        portal.queryCounter !== queryCounter &&
                        !portal.disabled)
                    {
                        plane = portal.plane;
                        plane0 = plane[0];
                        plane1 = plane[1];
                        plane2 = plane[2];
                        plane3 = plane[3];
                        if (((plane0 * cX) + (plane1 * cY) + (plane2 * cZ)) < plane3)
                        {
                            if (numVisiblePortals < oldNumVisiblePortals)
                            {
                                portalItem = visiblePortals[numVisiblePortals];
                                planes = portalItem.planes;
                            }
                            else
                            {
                                planes = [];
                            }
                            allPointsVisible = this.buildPortalPlanes(portal.points, planes, cX, cY, cZ, portalPlanes);
                            if (0 < planes.length)
                            {
                                if (allPointsVisible)
                                {
                                    portal.queryCounter = queryCounter;
                                }
                                if (numVisiblePortals < oldNumVisiblePortals)
                                {
                                    portalItem.portal = portal;
                                    portalItem.area   = nextArea;
                                }
                                else
                                {
                                    visiblePortals[numVisiblePortals] = {
                                            portal: portal,
                                            planes: planes,
                                            area: nextArea
                                        };
                                }
                                numVisiblePortals += 1;
                            }
                        }
                        else
                        {
                            portal.queryCounter = queryCounter;
                        }
                    }
                }

                portalPlanes.length = numPortalPlanes; // remove current plane, not needed to cull nodes
            }
            while (currentPortalIndex < numVisiblePortals);
        }

        if (numVisiblePortals < oldNumVisiblePortals)
        {
            visiblePortals.length = numVisiblePortals;
        }
    }

    //
    // findVisibleNodes
    //
    findVisibleNodes(camera, visibleNodes)
    {
        var numVisibleNodes = visibleNodes.length;
        var frustumPlanes = this.frustumPlanes;
        var useSpatialMaps = true;
        var areas = this.areas;
        if (areas)
        {
            var cameraMatrix = camera.matrix;
            var cX = cameraMatrix[9];
            var cY = cameraMatrix[10];
            var cZ = cameraMatrix[11];

            var areaIndex = this.findAreaIndex(this.bspNodes, cX, cY, cZ);
            this.cameraAreaIndex = areaIndex;

            if (areaIndex >= 0)
            {
                camera.getFrustumExtents(this.cameraExtents);
                var cameraMinExtent0 = this.cameraExtents[0];
                var cameraMinExtent1 = this.cameraExtents[1];
                var cameraMinExtent2 = this.cameraExtents[2];
                var cameraMaxExtent0 = this.cameraExtents[3];
                var cameraMaxExtent1 = this.cameraExtents[4];
                var cameraMaxExtent2 = this.cameraExtents[5];

                this.findVisiblePortals(areaIndex, cX, cY, cZ);

                var area, na, nodes, numNodes;
                var numAreas = areas.length;
                for (na = 0; na < numAreas; na += 1)
                {
                    area = areas[na];
                    nodes = area.nodes;
                    numNodes = area.numStaticNodes;
                    if (nodes.length > numNodes)
                    {
                        nodes.length = numNodes;
                    }
                    area.addedDynamicNodes = false;
                }

                var isInsidePlanesAABB = this.isInsidePlanesAABB;
                var dynamicSpatialMap = this.dynamicSpatialMap;
                var visiblePortals = this.visiblePortals;
                var numVisiblePortals = visiblePortals.length;
                var queryCounter = this.getQueryCounter();
                var n, node, np, portalItem, portalPlanes;

                area = areas[areaIndex];
                nodes = area.nodes;
                area.addedDynamicNodes = true;

                var areaExtent = area.extents;
                var areaMinExtent0 = areaExtent[0];
                var areaMinExtent1 = areaExtent[1];
                var areaMinExtent2 = areaExtent[2];
                var areaMaxExtent0 = areaExtent[3];
                var areaMaxExtent1 = areaExtent[4];
                var areaMaxExtent2 = areaExtent[5];
                var combinedExtents = (this.float32ArrayConstructor ?
                                       new this.float32ArrayConstructor(6) :
                                       new Array(6));
                combinedExtents[0] = (areaMinExtent0 < cameraMinExtent0 ? cameraMinExtent0 : areaMinExtent0);
                combinedExtents[1] = (areaMinExtent1 < cameraMinExtent1 ? cameraMinExtent1 : areaMinExtent1);
                combinedExtents[2] = (areaMinExtent2 < cameraMinExtent2 ? cameraMinExtent2 : areaMinExtent2);
                combinedExtents[3] = (areaMaxExtent0 > cameraMaxExtent0 ? cameraMaxExtent0 : areaMaxExtent0);
                combinedExtents[4] = (areaMaxExtent1 > cameraMaxExtent1 ? cameraMaxExtent1 : areaMaxExtent1);
                combinedExtents[5] = (areaMaxExtent2 > cameraMaxExtent2 ? cameraMaxExtent2 : areaMaxExtent2);

                dynamicSpatialMap.getOverlappingNodes(combinedExtents, nodes);

                numNodes = nodes.length;
                for (n = 0; n < numNodes; n += 1)
                {
                    node = nodes[n];
                    node.queryCounter = queryCounter;
                    if (isInsidePlanesAABB(node.worldExtents, frustumPlanes))
                    {
                        visibleNodes[numVisibleNodes] = node;
                        numVisibleNodes += 1;
                    }
                }

                for (np = 0; np < numVisiblePortals; np += 1)
                {
                    portalItem = visiblePortals[np];
                    portalPlanes = portalItem.planes;
                    area = areas[portalItem.area];
                    nodes = area.nodes;

                    if (!area.addedDynamicNodes)
                    {
                        area.addedDynamicNodes = true;
                        areaExtent = area.extents;
                        areaMinExtent0 = areaExtent[0];
                        areaMinExtent1 = areaExtent[1];
                        areaMinExtent2 = areaExtent[2];
                        areaMaxExtent0 = areaExtent[3];
                        areaMaxExtent1 = areaExtent[4];
                        areaMaxExtent2 = areaExtent[5];
                        combinedExtents[0] = (areaMinExtent0 < cameraMinExtent0 ? cameraMinExtent0 : areaMinExtent0);
                        combinedExtents[1] = (areaMinExtent1 < cameraMinExtent1 ? cameraMinExtent1 : areaMinExtent1);
                        combinedExtents[2] = (areaMinExtent2 < cameraMinExtent2 ? cameraMinExtent2 : areaMinExtent2);
                        combinedExtents[3] = (areaMaxExtent0 > cameraMaxExtent0 ? cameraMaxExtent0 : areaMaxExtent0);
                        combinedExtents[4] = (areaMaxExtent1 > cameraMaxExtent1 ? cameraMaxExtent1 : areaMaxExtent1);
                        combinedExtents[5] = (areaMaxExtent2 > cameraMaxExtent2 ? cameraMaxExtent2 : areaMaxExtent2);
                        dynamicSpatialMap.getOverlappingNodes(combinedExtents, nodes);
                    }

                    numNodes = nodes.length;
                    for (n = 0; n < numNodes; n += 1)
                    {
                        node = nodes[n];
                        if (node.queryCounter !== queryCounter)
                        {
                            if (isInsidePlanesAABB(node.worldExtents, portalPlanes))
                            {
                                node.queryCounter = queryCounter;
                                visibleNodes[numVisibleNodes] = node;
                                numVisibleNodes += 1;
                            }
                        }
                    }
                }

                useSpatialMaps = false;
            } /*
            else
            {
                Utilities.log("Camera outside areas!");
            }*/
        }

        if (useSpatialMaps)
        {
            numVisibleNodes += this.staticSpatialMap.getVisibleNodes(frustumPlanes, visibleNodes, numVisibleNodes);
            this.dynamicSpatialMap.getVisibleNodes(frustumPlanes, visibleNodes, numVisibleNodes);
        }
    }

    //
    // findVisibleNodesTree
    //
    findVisibleNodesTree(tree, camera, visibleNodes)
    {
        var numVisibleNodes = visibleNodes.length;
        var frustumPlanes = this.frustumPlanes;
        var useSpatialMap = true;
        var areas = this.areas;
        if (areas)
        {
            // Assume scene.update has been called before this function
            var areaIndex = this.cameraAreaIndex; //this.findAreaIndex(this.bspNodes, cX, cY, cZ);
            if (areaIndex >= 0)
            {
                //this.findVisiblePortals(areaIndex, cX, cY, cZ);

                //camera.getFrustumExtents(this.cameraExtents);
                var cameraMinExtent0 = this.cameraExtents[0];
                var cameraMinExtent1 = this.cameraExtents[1];
                var cameraMinExtent2 = this.cameraExtents[2];
                var cameraMaxExtent0 = this.cameraExtents[3];
                var cameraMaxExtent1 = this.cameraExtents[4];
                var cameraMaxExtent2 = this.cameraExtents[5];

                var externalNodesStack = this.externalNodesStack;

                var areaExtent;
                var areaMinExtent0, areaMinExtent1, areaMinExtent2;
                var areaMaxExtent0, areaMaxExtent1, areaMaxExtent2;
                var combinedExtents = (this.float32ArrayConstructor ?
                                       new this.float32ArrayConstructor(6) :
                                       new Array(6));

                var area, na, nodes, numNodes;
                var numAreas = areas.length;
                for (na = 0; na < numAreas; na += 1)
                {
                    area = areas[na];
                    nodes = area.externalNodes;
                    if (nodes)
                    {
                        externalNodesStack.push(nodes);
                        area.externalNodes = null;
                    }
                }

                var isInsidePlanesAABB = this.isInsidePlanesAABB;
                var findOverlappingAreas = this.findOverlappingAreas;
                var findAreaIndex = this.findAreaIndex;
                var visiblePortals = this.visiblePortals;
                var numVisiblePortals = visiblePortals.length;
                var queryCounter = this.getQueryCounter();
                var bspNodes = this.bspNodes;
                var portalPlanes;
                var n, node, nodeExtents, np, portalItem;
                var cX, cY, cZ, nodeAreaIndex, overlappingAreas, numOverlappingAreas;

                area = areas[areaIndex];
                nodes = area.externalNodes;

                if (!nodes)
                {
                    if (0 < externalNodesStack.length)
                    {
                        nodes = externalNodesStack.pop();
                    }
                    else
                    {
                        nodes = [];
                    }
                    area.externalNodes = nodes;

                    areaExtent = area.extents;
                    areaMinExtent0 = areaExtent[0];
                    areaMinExtent1 = areaExtent[1];
                    areaMinExtent2 = areaExtent[2];
                    areaMaxExtent0 = areaExtent[3];
                    areaMaxExtent1 = areaExtent[4];
                    areaMaxExtent2 = areaExtent[5];
                    combinedExtents[0] = (areaMinExtent0 < cameraMinExtent0 ? cameraMinExtent0 : areaMinExtent0);
                    combinedExtents[1] = (areaMinExtent1 < cameraMinExtent1 ? cameraMinExtent1 : areaMinExtent1);
                    combinedExtents[2] = (areaMinExtent2 < cameraMinExtent2 ? cameraMinExtent2 : areaMinExtent2);
                    combinedExtents[3] = (areaMaxExtent0 > cameraMaxExtent0 ? cameraMaxExtent0 : areaMaxExtent0);
                    combinedExtents[4] = (areaMaxExtent1 > cameraMaxExtent1 ? cameraMaxExtent1 : areaMaxExtent1);
                    combinedExtents[5] = (areaMaxExtent2 > cameraMaxExtent2 ? cameraMaxExtent2 : areaMaxExtent2);

                    numNodes = tree.getOverlappingNodes(combinedExtents, nodes, 0);

                    // Check which ones actually belong to the area
                    for (n = 0; n < numNodes; n += 1)
                    {
                        node = nodes[n];
                        nodeExtents = node.worldExtents;
                        cX = (nodeExtents[0] + nodeExtents[3]) * 0.5;
                        cY = (nodeExtents[1] + nodeExtents[4]) * 0.5;
                        cZ = (nodeExtents[2] + nodeExtents[5]) * 0.5;
                        nodeAreaIndex = findAreaIndex(bspNodes, cX, cY, cZ);
                        if (nodeAreaIndex >= 0 &&
                            areaIndex !== nodeAreaIndex)
                        {
                            overlappingAreas = findOverlappingAreas.call(this, nodeAreaIndex, nodeExtents, true);
                            numOverlappingAreas = overlappingAreas.length;
                            for (na = 0; na < numOverlappingAreas; na += 1)
                            {
                                if (overlappingAreas[na] === area)
                                {
                                    break;
                                }
                            }
                            if (na >= numOverlappingAreas)
                            {
                                numNodes -= 1;
                                if (n < numNodes)
                                {
                                    nodes[n] = nodes[numNodes];
                                    n -= 1; // compensate for the n += 1 on the for loop
                                }
                                else
                                {
                                    break;
                                }
                            }
                        }
                    }
                    nodes.length = numNodes;
                }

                numNodes = nodes.length;
                for (n = 0; n < numNodes; n += 1)
                {
                    node = nodes[n];
                    node.queryCounter = queryCounter;
                    if (isInsidePlanesAABB(node.worldExtents, frustumPlanes))
                    {
                        visibleNodes[numVisibleNodes] = node;
                        numVisibleNodes += 1;
                    }
                }

                for (np = 0; np < numVisiblePortals; np += 1)
                {
                    portalItem = visiblePortals[np];
                    portalPlanes = portalItem.planes;
                    areaIndex = portalItem.area;
                    area = areas[areaIndex];
                    nodes = area.externalNodes;

                    if (!nodes)
                    {
                        if (0 < externalNodesStack.length)
                        {
                            nodes = externalNodesStack.pop();
                        }
                        else
                        {
                            nodes = [];
                        }
                        area.externalNodes = nodes;

                        areaExtent = area.extents;
                        areaMinExtent0 = areaExtent[0];
                        areaMinExtent1 = areaExtent[1];
                        areaMinExtent2 = areaExtent[2];
                        areaMaxExtent0 = areaExtent[3];
                        areaMaxExtent1 = areaExtent[4];
                        areaMaxExtent2 = areaExtent[5];
                        combinedExtents[0] = (areaMinExtent0 < cameraMinExtent0 ? cameraMinExtent0 : areaMinExtent0);
                        combinedExtents[1] = (areaMinExtent1 < cameraMinExtent1 ? cameraMinExtent1 : areaMinExtent1);
                        combinedExtents[2] = (areaMinExtent2 < cameraMinExtent2 ? cameraMinExtent2 : areaMinExtent2);
                        combinedExtents[3] = (areaMaxExtent0 > cameraMaxExtent0 ? cameraMaxExtent0 : areaMaxExtent0);
                        combinedExtents[4] = (areaMaxExtent1 > cameraMaxExtent1 ? cameraMaxExtent1 : areaMaxExtent1);
                        combinedExtents[5] = (areaMaxExtent2 > cameraMaxExtent2 ? cameraMaxExtent2 : areaMaxExtent2);

                        numNodes = tree.getOverlappingNodes(combinedExtents, nodes, 0);

                        // Check which ones actually belong to the area
                        for (n = 0; n < numNodes; n += 1)
                        {
                            node = nodes[n];
                            nodeExtents = node.worldExtents;
                            cX = (nodeExtents[0] + nodeExtents[3]) * 0.5;
                            cY = (nodeExtents[1] + nodeExtents[4]) * 0.5;
                            cZ = (nodeExtents[2] + nodeExtents[5]) * 0.5;
                            nodeAreaIndex = findAreaIndex(bspNodes, cX, cY, cZ);
                            if (nodeAreaIndex >= 0 &&
                                areaIndex !== nodeAreaIndex)
                            {
                                overlappingAreas = findOverlappingAreas.call(this, nodeAreaIndex, nodeExtents, true);
                                numOverlappingAreas = overlappingAreas.length;
                                for (na = 0; na < numOverlappingAreas; na += 1)
                                {
                                    if (overlappingAreas[na] === area)
                                    {
                                        break;
                                    }
                                }
                                if (na >= numOverlappingAreas)
                                {
                                    numNodes -= 1;
                                    if (n < numNodes)
                                    {
                                        nodes[n] = nodes[numNodes];
                                        n -= 1; // compensate for the n += 1 on the for loop
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                            }
                        }
                        nodes.length = numNodes;
                    }

                    numNodes = nodes.length;
                    for (n = 0; n < numNodes; n += 1)
                    {
                        node = nodes[n];
                        if (node.queryCounter !== queryCounter)
                        {
                            if (isInsidePlanesAABB(node.worldExtents, portalPlanes))
                            {
                                node.queryCounter = queryCounter;
                                visibleNodes[numVisibleNodes] = node;
                                numVisibleNodes += 1;
                            }
                        }
                    }
                }

                useSpatialMap = false;
            }
        }

        if (useSpatialMap)
        {
            tree.getVisibleNodes(frustumPlanes, visibleNodes, numVisibleNodes);
        }
    }

    //
    // buildPortalPlanesNoFrustum
    //
    buildPortalPlanesNoFrustum(points: any[], planes: any[], cX: number, cY: number, cZ: number, parentPlanes: any[]) : boolean
    {
        var md = this.md;
        var numPoints = points.length;
        var numParentPlanes = (parentPlanes ? parentPlanes.length : 0);
        var numPlanes = numParentPlanes;
        var newPoints = this.newPoints;
        var np, p;

        np = 0;
        do
        {
            p = points[np];
            newPoints[np] = md.v3Build((p[0] - cX), (p[1] - cY), (p[2] - cZ), newPoints[np]);
            np += 1;
        }
        while (np < numPoints);

        var sqrt = Math.sqrt;
        np = 0;
        do
        {
            p = newPoints[np];
            var p0X = p[0];
            var p0Y = p[1];
            var p0Z = p[2];

            p = newPoints[((np + 1) < numPoints ? (np + 1) : 0)];
            var p1X = p[0];
            var p1Y = p[1];
            var p1Z = p[2];

            // n = cross(p0, p1)
            var nX = ((p0Y * p1Z) - (p0Z * p1Y));
            var nY = ((p0Z * p1X) - (p0X * p1Z));
            var nZ = ((p0X * p1Y) - (p0Y * p1X));
            var lnsq = ((nX * nX) + (nY * nY) + (nZ * nZ));
            if (lnsq === 0)
            {
                return false;
            }
            var lnrcp = 1.0 / sqrt(lnsq);
            nX *= lnrcp;
            nY *= lnrcp;
            nZ *= lnrcp;

            // d = dot(n, c)
            var d = ((nX * cX) + (nY * cY) + (nZ * cZ));

            planes[numPlanes] = md.v4Build(nX, nY, nZ, d, planes[numPlanes]);
            numPlanes += 1;

            np += 1;
        }
        while (np < numPoints);

        for (np = 0; np < numParentPlanes; np += 1)
        {
            planes[np] = md.v4Copy(parentPlanes[np], planes[np]);
        }

        planes.length = numPlanes;
        return true;
    }

    //
    // findOverlappingPortals
    //
    findOverlappingPortals(areaIndex, cX, cY, cZ, extents, overlappingPortals): number
    {
        var portals, numPortals, n, portal, plane, d0, d1, d2, offset, area, portalExtents, planes;
        var queryCounter = this.getQueryCounter();
        var areas = this.areas;
        var numOverlappingPortals = 0;
        var portalItem;

        var min0 = extents[0];
        var min1 = extents[1];
        var min2 = extents[2];
        var max0 = extents[3];
        var max1 = extents[4];
        var max2 = extents[5];

        area = areas[areaIndex];
        portals = area.portals;
        numPortals = portals.length;
        for (n = 0; n < numPortals; n += 1)
        {
            portal = portals[n];
            if (portal.disabled)
            {
                continue;
            }

            portal.queryCounter = queryCounter;

            portalExtents = portal.extents;
            if (portalExtents[0] < max0 &&
                portalExtents[1] < max1 &&
                portalExtents[2] < max2 &&
                portalExtents[3] > min0 &&
                portalExtents[4] > min1 &&
                portalExtents[5] > min2)
            {
                plane = portal.plane;
                d0 = plane[0];
                d1 = plane[1];
                d2 = plane[2];
                offset = plane[3];
                if (((d0 * cX) + (d1 * cY) + (d2 * cZ)) < offset &&
                    (d0 * (d0 < 0 ? min0 : max0) + d1 * (d1 < 0 ? min1 : max1) + d2 * (d2 < 0 ? min2 : max2)) >= offset)
                {
                    portalItem = overlappingPortals[numOverlappingPortals];
                    if (portalItem)
                    {
                        planes = portalItem.planes;
                    }
                    else
                    {
                        planes = [];
                        overlappingPortals[numOverlappingPortals] = portalItem = {
                                portal: null,
                                planes: planes,
                                area: 0
                            };
                    }
                    if (this.buildPortalPlanesNoFrustum(portal.points, planes, cX, cY, cZ, null))
                    {
                        portalItem.portal = portal;
                        portalItem.area = portal.area;
                        numOverlappingPortals += 1;
                    }
                }
            }
        }

        if (0 < numOverlappingPortals)
        {
            var parentPlanes, nextArea;
            var currentPortalIndex = 0;
            do
            {
                portalItem = overlappingPortals[currentPortalIndex];
                currentPortalIndex += 1;
                parentPlanes = portalItem.planes;
                areaIndex = portalItem.area;
                portal = portalItem.portal;

                area = areas[areaIndex];
                portals = area.portals;
                numPortals = portals.length;
                for (n = 0; n < numPortals; n += 1)
                {
                    portal = portals[n];
                    nextArea = portal.area;
                    if (nextArea !== areaIndex &&
                        portal.queryCounter !== queryCounter &&
                        !portal.disabled)
                    {
                        portalExtents = portal.extents;
                        if (portalExtents[0] < max0 &&
                            portalExtents[1] < max1 &&
                            portalExtents[2] < max2 &&
                            portalExtents[3] > min0 &&
                            portalExtents[4] > min1 &&
                            portalExtents[5] > min2)
                        {
                            plane = portal.plane;
                            d0 = plane[0];
                            d1 = plane[1];
                            d2 = plane[2];
                            offset = plane[3];
                            if (((d0 * cX) + (d1 * cY) + (d2 * cZ)) < offset &&
                                (d0 * (d0 < 0 ? min0 : max0) + d1 * (d1 < 0 ? min1 : max1) + d2 * (d2 < 0 ? min2 : max2)) >= offset)
                            {
                                portalItem = overlappingPortals[numOverlappingPortals];
                                if (portalItem)
                                {
                                    planes = portalItem.planes;
                                }
                                else
                                {
                                    planes = [];
                                    overlappingPortals[numOverlappingPortals] = portalItem = {
                                        portal: null,
                                        planes: planes,
                                        area: 0
                                    };
                                }
                                if (this.buildPortalPlanesNoFrustum(portal.points, planes, cX, cY, cZ, parentPlanes))
                                {
                                    portal.queryCounter = queryCounter;
                                    portalItem.portal = portal;
                                    portalItem.area = nextArea;
                                    numOverlappingPortals += 1;
                                }
                            }
                            else
                            {
                                portal.queryCounter = queryCounter;
                            }
                        }
                        else
                        {
                            portal.queryCounter = queryCounter;
                        }
                    }
                }
            }
            while (currentPortalIndex < numOverlappingPortals);
        }

        return numOverlappingPortals;
    }

    //
    // findOverlappingNodes
    //
    findOverlappingNodes(tree, origin, extents, overlappingNodes)
    {
        var useSpatialMap = true;

        if (this.areas)
        {
            useSpatialMap = !this._findOverlappingNodesAreas(tree, origin, extents, overlappingNodes);
        }

        if (useSpatialMap)
        {
            tree.getOverlappingNodes(extents, overlappingNodes);
        }
    }

    //
    // findStaticOverlappingNodes
    //
    findStaticOverlappingNodes(origin, extents, overlappingNodes)
    {
        this.findOverlappingNodes(this.staticSpatialMap, origin, extents, overlappingNodes);
    }

    //
    // findDynamicOverlappingNodes
    //
    findDynamicOverlappingNodes(origin, extents, overlappingNodes)
    {
        this.findOverlappingNodes(this.dynamicSpatialMap, origin, extents, overlappingNodes);
    }

    //
    // _findOverlappingNodesAreas
    //
    _findOverlappingNodesAreas(tree, origin, extents, overlappingNodes): boolean
    {
        // Assume scene.update has been called before this function
        var cX = origin[0];
        var cY = origin[1];
        var cZ = origin[2];
        var areaIndex = this.findAreaIndex(this.bspNodes, cX, cY, cZ);
        if (areaIndex < 0)
        {
            return false;
        }

        var externalNodesStack = this.externalNodesStack;
        var areas = this.areas;

        var na, area, nodes, numNodes;
        var numAreas = areas.length;
        for (na = 0; na < numAreas; na += 1)
        {
            area = areas[na];
            nodes = area.externalNodes;
            if (nodes)
            {
                externalNodesStack.push(nodes);
                area.externalNodes = null;
            }
        }

        var minExtent0 = extents[0];
        var minExtent1 = extents[1];
        var minExtent2 = extents[2];
        var maxExtent0 = extents[3];
        var maxExtent1 = extents[4];
        var maxExtent2 = extents[5];

        area = areas[areaIndex];
        var areaExtents = area.extents;
        var testMinExtent0 = areaExtents[0];
        var testMinExtent1 = areaExtents[1];
        var testMinExtent2 = areaExtents[2];
        var testMaxExtent0 = areaExtents[3];
        var testMaxExtent1 = areaExtents[4];
        var testMaxExtent2 = areaExtents[5];

        var overlappingPortals = this.overlappingPortals;
        var numOverlappingPortals = this.findOverlappingPortals(areaIndex, cX, cY, cZ, extents, overlappingPortals);

        var isInsidePlanesAABB = this.isInsidePlanesAABB;
        var queryCounter = this.getQueryCounter();
        var numOverlappingNodes = overlappingNodes.length;
        var portalPlanes;
        var n, node, np, portalItem;

        if (0 < externalNodesStack.length)
        {
            nodes = externalNodesStack.pop();
        }
        else
        {
            nodes = [];
        }
        area.externalNodes = nodes;

        var testExtents = this.testExtents;
        testExtents[0] = (testMinExtent0 > minExtent0 ? testMinExtent0 : minExtent0);
        testExtents[1] = (testMinExtent1 > minExtent1 ? testMinExtent1 : minExtent1);
        testExtents[2] = (testMinExtent2 > minExtent2 ? testMinExtent2 : minExtent2);
        testExtents[3] = (testMaxExtent0 < maxExtent0 ? testMaxExtent0 : maxExtent0);
        testExtents[4] = (testMaxExtent1 < maxExtent1 ? testMaxExtent1 : maxExtent1);
        testExtents[5] = (testMaxExtent2 < maxExtent2 ? testMaxExtent2 : maxExtent2);

        nodes.length = tree.getOverlappingNodes(testExtents, nodes, 0);

        numNodes = nodes.length;
        for (n = 0; n < numNodes; n += 1)
        {
            node = nodes[n];
            node.queryCounter = queryCounter;
            overlappingNodes[numOverlappingNodes] = node;
            numOverlappingNodes += 1;
        }

        for (np = 0; np < numOverlappingPortals; np += 1)
        {
            portalItem = overlappingPortals[np];
            portalPlanes = portalItem.planes;
            area = areas[portalItem.area];
            nodes = area.externalNodes;

            if (!nodes)
            {
                if (0 < externalNodesStack.length)
                {
                    nodes = externalNodesStack.pop();
                }
                else
                {
                    nodes = [];
                }
                area.externalNodes = nodes;
                areaExtents = area.extents;
                testMinExtent0 = areaExtents[0];
                testMinExtent1 = areaExtents[1];
                testMinExtent2 = areaExtents[2];
                testMaxExtent0 = areaExtents[3];
                testMaxExtent1 = areaExtents[4];
                testMaxExtent2 = areaExtents[5];

                testExtents[0] = (testMinExtent0 > minExtent0 ? testMinExtent0 : minExtent0);
                testExtents[1] = (testMinExtent1 > minExtent1 ? testMinExtent1 : minExtent1);
                testExtents[2] = (testMinExtent2 > minExtent2 ? testMinExtent2 : minExtent2);
                testExtents[3] = (testMaxExtent0 < maxExtent0 ? testMaxExtent0 : maxExtent0);
                testExtents[4] = (testMaxExtent1 < maxExtent1 ? testMaxExtent1 : maxExtent1);
                testExtents[5] = (testMaxExtent2 < maxExtent2 ? testMaxExtent2 : maxExtent2);

                nodes.length = tree.getOverlappingNodes(testExtents, nodes, 0);
            }

            numNodes = nodes.length;
            for (n = 0; n < numNodes; n += 1)
            {
                node = nodes[n];
                if (node.queryCounter !== queryCounter)
                {
                    if (isInsidePlanesAABB(node.worldExtents, portalPlanes))
                    {
                        node.queryCounter = queryCounter;
                        overlappingNodes[numOverlappingNodes] = node;
                        numOverlappingNodes += 1;
                    }
                }
            }
        }

        return true;
    }

    //
    // findOverlappingRenderables
    //
    findOverlappingRenderables(tree, origin, extents, overlappingRenderables)
    {
        var useSpatialMap = true;

        if (this.areas)
        {
            useSpatialMap = !this._findOverlappingRenderablesAreas(tree, origin, extents, overlappingRenderables);
        }

        if (useSpatialMap)
        {
            this._findOverlappingRenderablesNoAreas(tree, extents, overlappingRenderables);
        }
    }

    //
    // findStaticOverlappingRenderables
    //
    findStaticOverlappingRenderables(origin, extents, overlappingRenderables)
    {
        this.findOverlappingRenderables(this.staticSpatialMap, origin, extents, overlappingRenderables);
    }

    //
    // findDynamicOverlappingRenderables
    //
    findDynamicOverlappingRenderables(origin, extents, overlappingRenderables)
    {
        this.findOverlappingRenderables(this.dynamicSpatialMap, origin, extents, overlappingRenderables);
    }

    //
    // _findOverlappingRenderablesAreas
    //
    _findOverlappingRenderablesAreas(tree, origin, extents, overlappingRenderables): boolean
    {
        // Assume scene.update has been called before this function
        var cX = origin[0];
        var cY = origin[1];
        var cZ = origin[2];
        var areaIndex = this.findAreaIndex(this.bspNodes, cX, cY, cZ);
        if (areaIndex < 0)
        {
            return false;
        }

        var numOverlappingRenderables = overlappingRenderables.length;
        var minExtent0 = extents[0];
        var minExtent1 = extents[1];
        var minExtent2 = extents[2];
        var maxExtent0 = extents[3];
        var maxExtent1 = extents[4];
        var maxExtent2 = extents[5];

        var node;
        var numNodes;
        var nodeIndex;
        var renderable;
        var renderables;
        var numRenderables;
        var nodeExtents;
        var renderableIndex;
        var renderableExtents;

        var externalNodesStack = this.externalNodesStack;
        var areas = this.areas;

        var na, area, nodes;
        var numAreas = areas.length;
        for (na = 0; na < numAreas; na += 1)
        {
            area = areas[na];
            nodes = area.externalNodes;
            if (nodes)
            {
                externalNodesStack.push(nodes);
                area.externalNodes = null;
            }
        }

        area = areas[areaIndex];
        var areaExtents = area.extents;
        var testMinExtent0 = areaExtents[0];
        var testMinExtent1 = areaExtents[1];
        var testMinExtent2 = areaExtents[2];
        var testMaxExtent0 = areaExtents[3];
        var testMaxExtent1 = areaExtents[4];
        var testMaxExtent2 = areaExtents[5];

        var overlappingPortals = this.overlappingPortals;
        var numOverlappingPortals = this.findOverlappingPortals(areaIndex, cX, cY, cZ, extents, overlappingPortals);

        var isInsidePlanesAABB = this.isInsidePlanesAABB;
        var isFullyInsidePlanesAABB = this.isFullyInsidePlanesAABB;
        var queryCounter = this.getQueryCounter();
        var portalPlanes;
        var n, np, portalItem;
        var allVisible;

        if (0 < externalNodesStack.length)
        {
            nodes = externalNodesStack.pop();
        }
        else
        {
            nodes = [];
        }
        area.externalNodes = nodes;

        var testExtents = this.testExtents;
        testExtents[0] = (testMinExtent0 > minExtent0 ? testMinExtent0 : minExtent0);
        testExtents[1] = (testMinExtent1 > minExtent1 ? testMinExtent1 : minExtent1);
        testExtents[2] = (testMinExtent2 > minExtent2 ? testMinExtent2 : minExtent2);
        testExtents[3] = (testMaxExtent0 < maxExtent0 ? testMaxExtent0 : maxExtent0);
        testExtents[4] = (testMaxExtent1 < maxExtent1 ? testMaxExtent1 : maxExtent1);
        testExtents[5] = (testMaxExtent2 < maxExtent2 ? testMaxExtent2 : maxExtent2);

        nodes.length = tree.getOverlappingNodes(testExtents, nodes, 0);

        numNodes = nodes.length;
        for (nodeIndex = 0; nodeIndex < numNodes; nodeIndex += 1)
        {
            node = nodes[nodeIndex];
            node.queryCounter = queryCounter;
            renderables = node.renderables;
            if (renderables)
            {
                numRenderables = renderables.length;
                if (numRenderables === 1)
                {
                    overlappingRenderables[numOverlappingRenderables] = renderables[0];
                    numOverlappingRenderables += 1;
                }
                else
                {
                    // Check if node is fully inside
                    nodeExtents = node.worldExtents;
                    if (nodeExtents[0] >= minExtent0 &&
                        nodeExtents[1] >= minExtent1 &&
                        nodeExtents[2] >= minExtent2 &&
                        nodeExtents[3] <= maxExtent0 &&
                        nodeExtents[4] <= maxExtent1 &&
                        nodeExtents[5] <= maxExtent2)
                    {
                        for (renderableIndex = 0; renderableIndex < numRenderables; renderableIndex += 1)
                        {
                            overlappingRenderables[numOverlappingRenderables] = renderables[renderableIndex];
                            numOverlappingRenderables += 1;
                        }
                    }
                    else
                    {
                        for (renderableIndex = 0; renderableIndex < numRenderables; renderableIndex += 1)
                        {
                            renderable = renderables[renderableIndex];
                            renderableExtents = renderable.getWorldExtents();
                            if (renderableExtents[3] >= minExtent0 &&
                                renderableExtents[4] >= minExtent1 &&
                                renderableExtents[5] >= minExtent2 &&
                                renderableExtents[0] <= maxExtent0 &&
                                renderableExtents[1] <= maxExtent1 &&
                                renderableExtents[2] <= maxExtent2)
                            {
                                overlappingRenderables[numOverlappingRenderables] = renderable;
                                numOverlappingRenderables += 1;
                            }
                        }
                    }
                }
            }
        }

        for (np = 0; np < numOverlappingPortals; np += 1)
        {
            portalItem = overlappingPortals[np];
            portalPlanes = portalItem.planes;
            area = areas[portalItem.area];
            nodes = area.externalNodes;

            if (!nodes)
            {
                if (0 < externalNodesStack.length)
                {
                    nodes = externalNodesStack.pop();
                }
                else
                {
                    nodes = [];
                }
                area.externalNodes = nodes;
                areaExtents = area.extents;
                testMinExtent0 = areaExtents[0];
                testMinExtent1 = areaExtents[1];
                testMinExtent2 = areaExtents[2];
                testMaxExtent0 = areaExtents[3];
                testMaxExtent1 = areaExtents[4];
                testMaxExtent2 = areaExtents[5];

                testExtents[0] = (testMinExtent0 > minExtent0 ? testMinExtent0 : minExtent0);
                testExtents[1] = (testMinExtent1 > minExtent1 ? testMinExtent1 : minExtent1);
                testExtents[2] = (testMinExtent2 > minExtent2 ? testMinExtent2 : minExtent2);
                testExtents[3] = (testMaxExtent0 < maxExtent0 ? testMaxExtent0 : maxExtent0);
                testExtents[4] = (testMaxExtent1 < maxExtent1 ? testMaxExtent1 : maxExtent1);
                testExtents[5] = (testMaxExtent2 < maxExtent2 ? testMaxExtent2 : maxExtent2);

                nodes.length = tree.getOverlappingNodes(testExtents, nodes, 0);
            }

            numNodes = nodes.length;
            for (n = 0; n < numNodes; n += 1)
            {
                node = nodes[n];
                if (node.queryCounter !== queryCounter)
                {
                    allVisible = true;

                    renderables = node.renderables;
                    if (renderables)
                    {
                        nodeExtents = node.worldExtents;
                        if (isInsidePlanesAABB(nodeExtents, portalPlanes))
                        {
                            numRenderables = renderables.length;
                            if (numRenderables === 1)
                            {
                                renderable = renderables[0];
                                if (renderable.queryCounter !== queryCounter)
                                {
                                    renderable.queryCounter = queryCounter;
                                    overlappingRenderables[numOverlappingRenderables] = renderable;
                                    numOverlappingRenderables += 1;
                                }
                            }
                            else
                            {
                                // Check if node is fully inside
                                if (nodeExtents[0] >= minExtent0 &&
                                    nodeExtents[1] >= minExtent1 &&
                                    nodeExtents[2] >= minExtent2 &&
                                    nodeExtents[3] <= maxExtent0 &&
                                    nodeExtents[4] <= maxExtent1 &&
                                    nodeExtents[5] <= maxExtent2)
                                {
                                    if (isFullyInsidePlanesAABB(nodeExtents, portalPlanes))
                                    {
                                        for (renderableIndex = 0; renderableIndex < numRenderables; renderableIndex += 1)
                                        {
                                            renderable = renderables[renderableIndex];
                                            if (renderable.queryCounter !== queryCounter)
                                            {
                                                renderable.queryCounter = queryCounter;
                                                overlappingRenderables[numOverlappingRenderables] = renderable;
                                                numOverlappingRenderables += 1;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        for (renderableIndex = 0; renderableIndex < numRenderables; renderableIndex += 1)
                                        {
                                            renderable = renderables[renderableIndex];
                                            if (renderable.queryCounter !== queryCounter)
                                            {
                                                if (isInsidePlanesAABB(renderable.getWorldExtents(), portalPlanes))
                                                {
                                                    renderable.queryCounter = queryCounter;
                                                    overlappingRenderables[numOverlappingRenderables] = renderable;
                                                    numOverlappingRenderables += 1;
                                                }
                                                else
                                                {
                                                    allVisible = false;
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if (isFullyInsidePlanesAABB(nodeExtents, portalPlanes))
                                    {
                                        for (renderableIndex = 0; renderableIndex < numRenderables; renderableIndex += 1)
                                        {
                                            renderable = renderables[renderableIndex];
                                            if (renderable.queryCounter !== queryCounter)
                                            {
                                                renderableExtents = renderable.getWorldExtents();
                                                if (renderableExtents[3] >= minExtent0 &&
                                                    renderableExtents[4] >= minExtent1 &&
                                                    renderableExtents[5] >= minExtent2 &&
                                                    renderableExtents[0] <= maxExtent0 &&
                                                    renderableExtents[1] <= maxExtent1 &&
                                                    renderableExtents[2] <= maxExtent2)
                                                {
                                                    renderable.queryCounter = queryCounter;
                                                    overlappingRenderables[numOverlappingRenderables] = renderable;
                                                    numOverlappingRenderables += 1;
                                                }
                                                else
                                                {
                                                    allVisible = false;
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        for (renderableIndex = 0; renderableIndex < numRenderables; renderableIndex += 1)
                                        {
                                            renderable = renderables[renderableIndex];
                                            if (renderable.queryCounter !== queryCounter)
                                            {
                                                renderableExtents = renderable.getWorldExtents();
                                                if (renderableExtents[3] >= minExtent0 &&
                                                    renderableExtents[4] >= minExtent1 &&
                                                    renderableExtents[5] >= minExtent2 &&
                                                    renderableExtents[0] <= maxExtent0 &&
                                                    renderableExtents[1] <= maxExtent1 &&
                                                    renderableExtents[2] <= maxExtent2 &&
                                                    isInsidePlanesAABB(renderableExtents, portalPlanes))
                                                {
                                                    renderable.queryCounter = queryCounter;
                                                    overlappingRenderables[numOverlappingRenderables] = renderable;
                                                    numOverlappingRenderables += 1;
                                                }
                                                else
                                                {
                                                    allVisible = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            allVisible = false;
                        }
                    }

                    if (allVisible)
                    {
                        node.queryCounter = queryCounter;
                    }
                }
            }
        }

        return true;
    }

    //
    // _findOverlappingRenderablesNoAreas
    //
    _findOverlappingRenderablesNoAreas(tree, extents, overlappingRenderables)
    {
        var numOverlappingRenderables = overlappingRenderables.length;
        var minExtent0 = extents[0];
        var minExtent1 = extents[1];
        var minExtent2 = extents[2];
        var maxExtent0 = extents[3];
        var maxExtent1 = extents[4];
        var maxExtent2 = extents[5];

        var overlappingNodes = this.queryVisibleNodes;

        var node;
        var numNodes;
        var nodeIndex;
        var renderable;
        var renderables;
        var numRenderables;
        var nodeExtents;
        var renderableIndex;
        var renderableExtents;

        numNodes = tree.getOverlappingNodes(extents, overlappingNodes, 0);
        for (nodeIndex = 0; nodeIndex < numNodes; nodeIndex += 1)
        {
            node = overlappingNodes[nodeIndex];
            renderables = node.renderables;
            if (renderables)
            {
                numRenderables = renderables.length;
                if (numRenderables === 1)
                {
                    overlappingRenderables[numOverlappingRenderables] = renderables[0];
                    numOverlappingRenderables += 1;
                }
                else
                {
                    // Check if node is fully inside
                    nodeExtents = node.worldExtents;
                    if (nodeExtents[0] >= minExtent0 &&
                        nodeExtents[1] >= minExtent1 &&
                        nodeExtents[2] >= minExtent2 &&
                        nodeExtents[3] <= maxExtent0 &&
                        nodeExtents[4] <= maxExtent1 &&
                        nodeExtents[5] <= maxExtent2)
                    {
                        for (renderableIndex = 0; renderableIndex < numRenderables; renderableIndex += 1)
                        {
                            overlappingRenderables[numOverlappingRenderables] = renderables[renderableIndex];
                            numOverlappingRenderables += 1;
                        }
                    }
                    else
                    {
                        for (renderableIndex = 0; renderableIndex < numRenderables; renderableIndex += 1)
                        {
                            renderable = renderables[renderableIndex];
                            renderableExtents = renderable.getWorldExtents();
                            if (renderableExtents[3] >= minExtent0 &&
                                renderableExtents[4] >= minExtent1 &&
                                renderableExtents[5] >= minExtent2 &&
                                renderableExtents[0] <= maxExtent0 &&
                                renderableExtents[1] <= maxExtent1 &&
                                renderableExtents[2] <= maxExtent2)
                            {
                                overlappingRenderables[numOverlappingRenderables] = renderable;
                                numOverlappingRenderables += 1;
                            }
                        }
                    }
                }
            }
        }
    }

    //
    // cloneRootNode
    //
    cloneRootNode(rootNode, newInstanceName, newLocalTransform?): void
    {
        var newNode = rootNode.clone(newInstanceName);
        if (newLocalTransform)
        {
            rootNode.setLocalTransform(newLocalTransform);
        }
        this.addRootNode(newNode);
        return newNode;
    }

    //
    // updateVisibleNodes
    //
    updateVisibleNodes(camera)
    {
        var useSpatialMap = true;

        if (this.areas)
        {
            useSpatialMap = !this._updateVisibleNodesAreas(camera);
        }

        if (useSpatialMap)
        {
            this._updateVisibleNodesNoAreas(camera);
        }

        this.frameIndex += 1;
    }

    //
    // _updateVisibleNodesNoAreas
    //
    _updateVisibleNodesNoAreas(camera)
    {
        var visibleNodes = this.visibleNodes;
        var numVisibleNodes = 0;

        var visibleRenderables = this.visibleRenderables;
        var numVisibleRenderables = 0;

        var visibleLights = this.visibleLights;
        var numVisibleLights = 0;

        this.extractFrustumPlanes(camera);
        var frustumPlanes = this.frustumPlanes;

        var frameIndex = this.frameIndex;
        var nearPlane = this.nearPlane;
        var d0 = nearPlane[0];
        var d1 = nearPlane[1];
        var d2 = nearPlane[2];
        var offset = nearPlane[3];
        var maxDistance = 0;
        var n, node;

        var isFullyInsidePlanesAABB = this.isFullyInsidePlanesAABB;
        var isInsidePlanesAABB = this.isInsidePlanesAABB;

        var queryVisibleNodes = this.queryVisibleNodes;
        var numQueryVisibleNodes = this.staticSpatialMap.getVisibleNodes(frustumPlanes, queryVisibleNodes, 0);
        numQueryVisibleNodes += this.dynamicSpatialMap.getVisibleNodes(frustumPlanes, queryVisibleNodes, numQueryVisibleNodes);

        for (n = 0; n < numQueryVisibleNodes; n += 1)
        {
            node = queryVisibleNodes[n];
            if (!node.disabled)
            {
                var extents = node.worldExtents;
                var distance, renderable, i, lightInstance, l;

                debug.assert(node.frameVisible !== frameIndex);
                node.frameVisible = frameIndex;

                distance = ((d0 * (d0 > 0 ? extents[3] : extents[0])) +
                            (d1 * (d1 > 0 ? extents[4] : extents[1])) +
                            (d2 * (d2 > 0 ? extents[5] : extents[2])) - offset);
                node.distance = distance;

                if (0 < distance)
                {
                    //This signifies any part of the node is visible, but not necessarily all.
                    visibleNodes[numVisibleNodes] = node;
                    numVisibleNodes += 1;

                    var renderables = node.renderables;
                    var numRenderables = (renderables ? renderables.length : 0);

                    var lights = node.lightInstances;
                    var numLights = (lights ? lights.length : 0);

                    var fullyVisible = (1 < (numLights + numRenderables) ?
                                        isFullyInsidePlanesAABB(extents, frustumPlanes) :
                                        false);

                    if (renderables)
                    {
                        if (numRenderables === 1 && !lights)
                        {
                            renderable = renderables[0];
                            if (!renderable.disabled)
                            {
                                if (maxDistance < distance)
                                {
                                    maxDistance = distance;
                                }
                                renderable.distance = distance;
                                renderable.frameVisible = frameIndex;
                                visibleRenderables[numVisibleRenderables] = renderable;
                                numVisibleRenderables += 1;
                            }
                        }
                        else
                        {
                            for (i = 0; i < numRenderables; i += 1)
                            {
                                renderable = renderables[i];
                                if (!renderable.disabled)
                                {
                                    extents = renderable.getWorldExtents();
                                    if (fullyVisible || isInsidePlanesAABB(extents, frustumPlanes))
                                    {
                                        distance = ((d0 * (d0 > 0 ? extents[3] : extents[0])) +
                                                    (d1 * (d1 > 0 ? extents[4] : extents[1])) +
                                                    (d2 * (d2 > 0 ? extents[5] : extents[2])) - offset);
                                        if (0 < distance)
                                        {
                                            if (maxDistance < distance)
                                            {
                                                maxDistance = distance;
                                            }
                                            renderable.distance = distance;
                                            renderable.frameVisible = frameIndex;
                                            visibleRenderables[numVisibleRenderables] = renderable;
                                            numVisibleRenderables += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (lights)
                    {
                        if (numLights === 1 && !renderables)
                        {
                            lightInstance = lights[0];
                            if (!lightInstance.disabled &&
                                !lightInstance.light.isGlobal())
                            {
                                lightInstance.distance = distance;
                                lightInstance.frameVisible = frameIndex;
                                visibleLights[numVisibleLights] = lightInstance;
                                numVisibleLights += 1;
                            }
                        }
                        else
                        {
                            for (l = 0; l < numLights; l += 1)
                            {
                                lightInstance = lights[l];
                                if (!lightInstance.disabled &&
                                    !lightInstance.light.isGlobal())
                                {
                                    extents = lightInstance.getWorldExtents();
                                    if (fullyVisible || isInsidePlanesAABB(extents, frustumPlanes))
                                    {
                                        distance = ((d0 * (d0 > 0 ? extents[3] : extents[0])) +
                                                    (d1 * (d1 > 0 ? extents[4] : extents[1])) +
                                                    (d2 * (d2 > 0 ? extents[5] : extents[2])) - offset);
                                        if (0 < distance)
                                        {
                                            lightInstance.distance = distance;
                                            lightInstance.frameVisible = frameIndex;
                                            visibleLights[numVisibleLights] = lightInstance;
                                            numVisibleLights += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        this.maxDistance = (maxDistance + camera.nearPlane);
        if (this.maxDistance < camera.farPlane)
        {
            this._filterVisibleNodesForCameraBox(camera, numVisibleNodes, numVisibleRenderables, numVisibleLights);
        }
        else
        {
            visibleRenderables.length = numVisibleRenderables;
            visibleLights.length = numVisibleLights;
            visibleNodes.length = numVisibleNodes;
        }
    }

    //
    // _updateVisibleNodesAreas
    //
    _updateVisibleNodesAreas(camera): boolean
    {
        var cameraMatrix = camera.matrix;
        var cX = cameraMatrix[9];
        var cY = cameraMatrix[10];
        var cZ = cameraMatrix[11];

        var areaIndex = this.findAreaIndex(this.bspNodes, cX, cY, cZ);
        this.cameraAreaIndex = areaIndex;

        if (areaIndex < 0)
        {
            return false;
        }

        var visibleNodes = this.visibleNodes;
        var numVisibleNodes = 0;

        var visibleRenderables = this.visibleRenderables;
        var numVisibleRenderables = 0;

        var visibleLights = this.visibleLights;
        var numVisibleLights = 0;

        this.extractFrustumPlanes(camera);
        var frustumPlanes = this.frustumPlanes;

        var frameIndex = this.frameIndex;
        var nearPlane = this.nearPlane;
        var d0 = nearPlane[0];
        var d1 = nearPlane[1];
        var d2 = nearPlane[2];
        var offset = nearPlane[3];
        var maxDistance = 0;
        var n = 0;
        var node;

        var isFullyInsidePlanesAABB = this.isFullyInsidePlanesAABB;
        var isInsidePlanesAABB = this.isInsidePlanesAABB;

        // findVisibleNodes
        var cameraExtents = this.cameraExtents;

        camera.getFrustumExtents(cameraExtents);

        var cameraMinExtent0 = cameraExtents[0];
        var cameraMinExtent1 = cameraExtents[1];
        var cameraMinExtent2 = cameraExtents[2];
        var cameraMaxExtent0 = cameraExtents[3];
        var cameraMaxExtent1 = cameraExtents[4];
        var cameraMaxExtent2 = cameraExtents[5];

        var areas = this.areas;
        var queryCounter = this.getQueryCounter();

        //
        // sceneProcessVisibleNodeFn helper
        //
        function sceneProcessVisibleNode(node, planes)
        {
            var extents = node.worldExtents;
            var allVisible = true;
            var distance;

            if (node.frameVisible !== frameIndex)
            {
                node.frameVisible = frameIndex;

                distance = ((d0 * (d0 > 0 ? extents[3] : extents[0])) +
                            (d1 * (d1 > 0 ? extents[4] : extents[1])) +
                            (d2 * (d2 > 0 ? extents[5] : extents[2])) - offset);
                node.distance = distance;
                if (0 < distance)
                {
                    //This signifies any part of the node is visible, but not necessarily all.
                    visibleNodes[numVisibleNodes] = node;
                    numVisibleNodes += 1;
                }
            }
            else
            {
                distance = node.distance;
            }

            if (0 < distance)
            {
                var renderable, i, lightInstance, l;
                var renderables = node.renderables;
                var numRenderables = (renderables ? renderables.length : 0);

                var lights = node.lightInstances;
                var numLights = (lights ? lights.length : 0);

                var fullyVisible = (1 < (numLights + numRenderables) ?
                                    isFullyInsidePlanesAABB(extents, planes) :
                                    false);

                if (renderables)
                {
                    if (numRenderables === 1 && !lights)
                    {
                        renderable = renderables[0];
                        if (!renderable.disabled &&
                            renderable.queryCounter !== queryCounter)
                        {
                            if (maxDistance < distance)
                            {
                                maxDistance = distance;
                            }
                            renderable.distance = distance;
                            renderable.frameVisible = frameIndex;
                            renderable.queryCounter = queryCounter;
                            visibleRenderables[numVisibleRenderables] = renderable;
                            numVisibleRenderables += 1;
                        }
                    }
                    else
                    {
                        for (i = 0; i < numRenderables; i += 1)
                        {
                            renderable = renderables[i];
                            if (!renderable.disabled &&
                                renderable.queryCounter !== queryCounter)
                            {
                                extents = renderable.getWorldExtents();
                                if (fullyVisible || isInsidePlanesAABB(extents, planes))
                                {
                                    distance = ((d0 * (d0 > 0 ? extents[3] : extents[0])) +
                                                (d1 * (d1 > 0 ? extents[4] : extents[1])) +
                                                (d2 * (d2 > 0 ? extents[5] : extents[2])) - offset);
                                    if (0 < distance)
                                    {
                                        if (maxDistance < distance)
                                        {
                                            maxDistance = distance;
                                        }
                                        renderable.distance = distance;
                                        renderable.frameVisible = frameIndex;
                                        renderable.queryCounter = queryCounter;
                                        visibleRenderables[numVisibleRenderables] = renderable;
                                        numVisibleRenderables += 1;
                                    }
                                    else
                                    {
                                        allVisible = false;
                                    }
                                }
                                else
                                {
                                    allVisible = false;
                                }
                            }
                        }
                    }
                }

                if (lights)
                {
                    if (numLights === 1 && !renderables)
                    {
                        lightInstance = lights[0];
                        if (!lightInstance.disabled &&
                            lightInstance.queryCounter !== queryCounter &&
                            !lightInstance.light.isGlobal())
                        {
                            lightInstance.distance = distance;
                            lightInstance.frameVisible = frameIndex;
                            lightInstance.queryCounter = queryCounter;
                            visibleLights[numVisibleLights] = lightInstance;
                            numVisibleLights += 1;
                        }
                    }
                    else
                    {
                        for (l = 0; l < numLights; l += 1)
                        {
                            lightInstance = lights[l];
                            if (!lightInstance.disabled &&
                                lightInstance.queryCounter !== queryCounter &&
                                !lightInstance.light.isGlobal())
                            {
                                extents = lightInstance.getWorldExtents();
                                if (fullyVisible || isInsidePlanesAABB(extents, planes))
                                {
                                    distance = ((d0 * (d0 > 0 ? extents[3] : extents[0])) +
                                                (d1 * (d1 > 0 ? extents[4] : extents[1])) +
                                                (d2 * (d2 > 0 ? extents[5] : extents[2])) - offset);
                                    if (0 < distance)
                                    {
                                        lightInstance.distance = distance;
                                        lightInstance.frameVisible = frameIndex;
                                        lightInstance.queryCounter = queryCounter;
                                        visibleLights[numVisibleLights] = lightInstance;
                                        numVisibleLights += 1;
                                    }
                                    else
                                    {
                                        allVisible = false;
                                    }
                                }
                                else
                                {
                                    allVisible = false;
                                }
                            }
                        }
                    }
                }
            }

            if (allVisible)
            {
                node.queryCounter = queryCounter;
            }
        }

        this.findVisiblePortals(areaIndex, cX, cY, cZ);

        var area, na, nodes, numNodes;
        var numAreas = areas.length;
        for (na = 0; na < numAreas; na += 1)
        {
            area = areas[na];
            nodes = area.nodes;
            numNodes = area.numStaticNodes;
            if (nodes.length > numNodes)
            {
                nodes.length = numNodes;
            }
            area.addedDynamicNodes = false;
        }

        var dynamicSpatialMap = this.dynamicSpatialMap;
        var visiblePortals = this.visiblePortals;
        var numVisiblePortals = visiblePortals.length;

        var np, portalItem, portalPlanes;

        area = areas[areaIndex];
        nodes = area.nodes;
        area.addedDynamicNodes = true;

        var areaExtent = area.extents;
        var areaMinExtent0 = areaExtent[0];
        var areaMinExtent1 = areaExtent[1];
        var areaMinExtent2 = areaExtent[2];
        var areaMaxExtent0 = areaExtent[3];
        var areaMaxExtent1 = areaExtent[4];
        var areaMaxExtent2 = areaExtent[5];
        var combinedExtents = (this.float32ArrayConstructor ?
                               new this.float32ArrayConstructor(6) :
                               new Array(6));
        combinedExtents[0] = (areaMinExtent0 < cameraMinExtent0 ? cameraMinExtent0 : areaMinExtent0);
        combinedExtents[1] = (areaMinExtent1 < cameraMinExtent1 ? cameraMinExtent1 : areaMinExtent1);
        combinedExtents[2] = (areaMinExtent2 < cameraMinExtent2 ? cameraMinExtent2 : areaMinExtent2);
        combinedExtents[3] = (areaMaxExtent0 > cameraMaxExtent0 ? cameraMaxExtent0 : areaMaxExtent0);
        combinedExtents[4] = (areaMaxExtent1 > cameraMaxExtent1 ? cameraMaxExtent1 : areaMaxExtent1);
        combinedExtents[5] = (areaMaxExtent2 > cameraMaxExtent2 ? cameraMaxExtent2 : areaMaxExtent2);

        dynamicSpatialMap.getOverlappingNodes(combinedExtents, nodes);

        numNodes = nodes.length;
        for (n = 0; n < numNodes; n += 1)
        {
            node = nodes[n];
            node.queryCounter = queryCounter;
            if (!node.disabled && isInsidePlanesAABB(node.worldExtents, frustumPlanes))
            {
                sceneProcessVisibleNode(node, frustumPlanes);
            }
        }

        for (np = 0; np < numVisiblePortals; np += 1)
        {
            portalItem = visiblePortals[np];
            portalPlanes = portalItem.planes;
            area = areas[portalItem.area];
            nodes = area.nodes;

            // Frustum tests do return some false positives, check bounding boxes
            areaExtent = area.extents;
            areaMinExtent0 = areaExtent[0];
            areaMinExtent1 = areaExtent[1];
            areaMinExtent2 = areaExtent[2];
            areaMaxExtent0 = areaExtent[3];
            areaMaxExtent1 = areaExtent[4];
            areaMaxExtent2 = areaExtent[5];
            if (cameraMaxExtent0 > areaMinExtent0 &&
                cameraMaxExtent1 > areaMinExtent1 &&
                cameraMaxExtent2 > areaMinExtent2 &&
                areaMaxExtent0 > cameraMinExtent0 &&
                areaMaxExtent1 > cameraMinExtent1 &&
                areaMaxExtent2 > cameraMinExtent2)
            {
                if (!area.addedDynamicNodes)
                {
                    area.addedDynamicNodes = true;
                    combinedExtents[0] = (areaMinExtent0 < cameraMinExtent0 ? cameraMinExtent0 : areaMinExtent0);
                    combinedExtents[1] = (areaMinExtent1 < cameraMinExtent1 ? cameraMinExtent1 : areaMinExtent1);
                    combinedExtents[2] = (areaMinExtent2 < cameraMinExtent2 ? cameraMinExtent2 : areaMinExtent2);
                    combinedExtents[3] = (areaMaxExtent0 > cameraMaxExtent0 ? cameraMaxExtent0 : areaMaxExtent0);
                    combinedExtents[4] = (areaMaxExtent1 > cameraMaxExtent1 ? cameraMaxExtent1 : areaMaxExtent1);
                    combinedExtents[5] = (areaMaxExtent2 > cameraMaxExtent2 ? cameraMaxExtent2 : areaMaxExtent2);
                    dynamicSpatialMap.getOverlappingNodes(combinedExtents, nodes);
                }

                numNodes = nodes.length;
                for (n = 0; n < numNodes; n += 1)
                {
                    node = nodes[n];
                    if (node.queryCounter !== queryCounter)
                    {
                        if (node.disabled)
                        {
                            node.queryCounter = queryCounter;
                        }
                        else if (isInsidePlanesAABB(node.worldExtents, portalPlanes))
                        {
                            sceneProcessVisibleNode(node, portalPlanes);
                        }
                    }
                }
            }
        }

        this.maxDistance = (maxDistance + camera.nearPlane);
        if (this.maxDistance < camera.farPlane)
        {
            this._filterVisibleNodesForCameraBox(camera, numVisibleNodes, numVisibleRenderables, numVisibleLights);
        }
        else
        {
            visibleRenderables.length = numVisibleRenderables;
            visibleLights.length = numVisibleLights;
            visibleNodes.length = numVisibleNodes;
        }

        return true;
    }

    //
    // _filterVisibleNodesForCameraBox
    //
    _filterVisibleNodesForCameraBox(camera, numVisibleNodes, numVisibleRenderables, numVisibleLights)
    {
        var visibleNodes = this.visibleNodes;
        var visibleRenderables = this.visibleRenderables;
        var visibleLights = this.visibleLights;

        var oldNumVisibleRenderables = numVisibleRenderables;
        var oldNumVisibleLights = numVisibleLights;

        // The camera extents may be different and some objects could be discarded
        var cameraExtents = this.cameraExtents;

        camera.getFrustumExtents(cameraExtents, this.maxDistance);

        var cameraMinExtent0 = cameraExtents[0];
        var cameraMinExtent1 = cameraExtents[1];
        var cameraMinExtent2 = cameraExtents[2];
        var cameraMaxExtent0 = cameraExtents[3];
        var cameraMaxExtent1 = cameraExtents[4];
        var cameraMaxExtent2 = cameraExtents[5];

        var node, renderable, lightInstance, extents;
        var n = 0;
        while (n < numVisibleRenderables)
        {
            renderable = visibleRenderables[n];
            extents = renderable.getWorldExtents();
            if (extents[0] > cameraMaxExtent0 ||
                extents[1] > cameraMaxExtent1 ||
                extents[2] > cameraMaxExtent2 ||
                extents[3] < cameraMinExtent0 ||
                extents[4] < cameraMinExtent1 ||
                extents[5] < cameraMinExtent2)
            {
                renderable.frameVisible -= 1;
                numVisibleRenderables -= 1;
                if (n < numVisibleRenderables)
                {
                    visibleRenderables[n] = visibleRenderables[numVisibleRenderables];
                }
                else
                {
                    break;
                }
            }
            else
            {
                n += 1;
            }
        }

        n = 0;
        while (n < numVisibleLights)
        {
            lightInstance = visibleLights[n];
            extents = lightInstance.getWorldExtents();
            if (extents[0] > cameraMaxExtent0 ||
                extents[1] > cameraMaxExtent1 ||
                extents[2] > cameraMaxExtent2 ||
                extents[3] < cameraMinExtent0 ||
                extents[4] < cameraMinExtent1 ||
                extents[5] < cameraMinExtent2)
            {
                lightInstance.frameVisible -= 1;
                numVisibleLights -= 1;
                if (n < numVisibleLights)
                {
                    visibleLights[n] = visibleLights[numVisibleLights];
                }
                else
                {
                    break;
                }
            }
            else
            {
                n += 1;
            }
        }

        if (oldNumVisibleRenderables !== numVisibleRenderables ||
            oldNumVisibleLights !== numVisibleLights)
        {
            n = 0;
            while (n < numVisibleNodes)
            {
                node = visibleNodes[n];
                extents = node.worldExtents;
                if (extents[0] > cameraMaxExtent0 ||
                    extents[1] > cameraMaxExtent1 ||
                    extents[2] > cameraMaxExtent2 ||
                    extents[3] < cameraMinExtent0 ||
                    extents[4] < cameraMinExtent1 ||
                    extents[5] < cameraMinExtent2)
                {
                    node.frameVisible -= 1;
                    numVisibleNodes -= 1;
                    if (n < numVisibleNodes)
                    {
                        visibleNodes[n] = visibleNodes[numVisibleNodes];
                    }
                    else
                    {
                        break;
                    }
                }
                else
                {
                    n += 1;
                }
            }
        }

        visibleRenderables.length = numVisibleRenderables;
        visibleLights.length = numVisibleLights;
        visibleNodes.length = numVisibleNodes;
    }

    //
    // getCurrentVisibleNodes
    //
    getCurrentVisibleNodes(): SceneNode[]
    {
        return this.visibleNodes;
    }

    //
    // getCurrentVisibleRenderables
    //
    getCurrentVisibleRenderables()
    {
        return this.visibleRenderables;
    }

    //
    // getCurrentVisibleLights
    //
    getCurrentVisibleLights()
    {
        return this.visibleLights;
    }

    //
    // addRootNodeToUpdate
    //
    addRootNodeToUpdate(rootNode, name)
    {
        var dirtyRoots = this.dirtyRoots;
        if (dirtyRoots[name] !== rootNode)
        {
            dirtyRoots[name] = rootNode;
            var numNodesToUpdate = this.numNodesToUpdate;
            this.nodesToUpdate[numNodesToUpdate] = rootNode;
            this.numNodesToUpdate = (numNodesToUpdate + 1);
        }
    }

    //
    // updateNodes
    //
    updateNodes()
    {
        var numNodesToUpdate = this.numNodesToUpdate;
        if (0 < numNodesToUpdate)
        {
            var nodesToUpdate = this.nodesToUpdate;
            var dirtyRoots = this.dirtyRoots;
            var n;
            for (n = 0; n < numNodesToUpdate; n += 1)
            {
                dirtyRoots[nodesToUpdate[n].name] = null;
            }

            SceneNode.updateNodes(this.md, this, nodesToUpdate, numNodesToUpdate);

            this.numNodesToUpdate = 0;
        }
    }

    //
    // update
    //
    update()
    {
        this.updateNodes();
        this.staticSpatialMap.finalize();
        this.dynamicSpatialMap.finalize();
        this.updateExtents();

        if (this.areas &&
            this.staticNodesChangeCounter !== this.areaInitalizeStaticNodesChangeCounter)
        {
            //Note this leaves extents of areas as large as they ever got.
            this.initializeAreas();
        }
    }

    //
    // updateExtents
    //
    updateExtents()
    {
        var rootStaticExtents = this.staticSpatialMap.getExtents();
        var rootDynamicExtents = this.dynamicSpatialMap.getExtents();
        var sceneExtents = this.extents;

        if (rootStaticExtents)
        {
            if (rootDynamicExtents)
            {
                var minStaticX, minStaticY, minStaticZ, maxStaticX, maxStaticY, maxStaticZ;
                var minDynamicX, minDynamicY, minDynamicZ, maxDynamicX, maxDynamicY, maxDynamicZ;

                minStaticX = rootStaticExtents[0];
                minStaticY = rootStaticExtents[1];
                minStaticZ = rootStaticExtents[2];
                maxStaticX = rootStaticExtents[3];
                maxStaticY = rootStaticExtents[4];
                maxStaticZ = rootStaticExtents[5];

                minDynamicX = rootDynamicExtents[0];
                minDynamicY = rootDynamicExtents[1];
                minDynamicZ = rootDynamicExtents[2];
                maxDynamicX = rootDynamicExtents[3];
                maxDynamicY = rootDynamicExtents[4];
                maxDynamicZ = rootDynamicExtents[5];

                sceneExtents[0] = (minStaticX < minDynamicX ? minStaticX : minDynamicX);
                sceneExtents[1] = (minStaticY < minDynamicY ? minStaticY : minDynamicY);
                sceneExtents[2] = (minStaticZ < minDynamicZ ? minStaticZ : minDynamicZ);
                sceneExtents[3] = (maxStaticX > maxDynamicX ? maxStaticX : maxDynamicX);
                sceneExtents[4] = (maxStaticY > maxDynamicY ? maxStaticY : maxDynamicY);
                sceneExtents[5] = (maxStaticZ > maxDynamicZ ? maxStaticZ : maxDynamicZ);
            }
            else
            {
                sceneExtents[0] = rootStaticExtents[0];
                sceneExtents[1] = rootStaticExtents[1];
                sceneExtents[2] = rootStaticExtents[2];
                sceneExtents[3] = rootStaticExtents[3];
                sceneExtents[4] = rootStaticExtents[4];
                sceneExtents[5] = rootStaticExtents[5];
            }
        }
        else
        {
            if (rootDynamicExtents)
            {
                sceneExtents[0] = rootDynamicExtents[0];
                sceneExtents[1] = rootDynamicExtents[1];
                sceneExtents[2] = rootDynamicExtents[2];
                sceneExtents[3] = rootDynamicExtents[3];
                sceneExtents[4] = rootDynamicExtents[4];
                sceneExtents[5] = rootDynamicExtents[5];
            }
            else
            {
                sceneExtents[0] = 0;
                sceneExtents[1] = 0;
                sceneExtents[2] = 0;
                sceneExtents[3] = 0;
                sceneExtents[4] = 0;
                sceneExtents[5] = 0;
            }
        }
    }

    //
    //  getExtents
    //
    getExtents()
    {
        if (0 < this.numNodesToUpdate)
        {
            this.updateNodes();
            this.staticSpatialMap.finalize();
            this.dynamicSpatialMap.finalize();
            this.updateExtents();
        }
        return this.extents;
    }

    //
    //  loadMaterial
    //
    loadMaterial(graphicsDevice, textureManager, effectManager, materialName, material)
    {
        var materials = this.materials;

        // Check materials if the materialName has already been added
        if (!materials[materialName])
        {
            var effectName = material.effect || "default";
            var newMaterial = this.createMaterial(materialName, material, effectName, null, null, graphicsDevice);
            if (newMaterial)
            {
                delete newMaterial.effectName;
                var effect = effectManager.get(effectName);
                if (effect)
                {
                    effect.prepareMaterial(newMaterial);
                }
                newMaterial.loadTextures(textureManager);
                return true;
            }
        }
        return false;
    }

    //
    // hasMaterial
    //
    hasMaterial(materialName): boolean
    {
        var material = this.materials[materialName];
        if (material)
        {
            return true;
        }
        return false;
    }

    //
    // getMaterial
    //
    getMaterial(materialName): Material
    {
        return this.materials[materialName];
    }

    //
    // Draw nodes with same technique, mostly for debugging
    //
    drawNodesArray(nodes, gd, globalMaterial, technique, renderUpdate)
    {
        var numNodes = nodes.length;
        if (numNodes > 0)
        {
            var setTechnique = gd.setTechnique;
            var setTechniqueParameters = gd.setTechniqueParameters;
            var setStream = gd.setStream;
            var setIndexBuffer = gd.setIndexBuffer;
            var drawIndexed = gd.drawIndexed;
            var draw = gd.draw;
            var currentSharedTechniqueParameters = null;
            var currentVertexBuffer = null;
            var currentSemantics = null;
            var currentOffset = -1;
            var node, shape, sharedTechniqueParameters, techniqueParameters, vertexBuffer, semantics, offset, surface, indexBuffer;
            var renderables, renderable, numRenderables, i;
            var n = 0;
            setTechnique.call(gd, technique);
            setTechniqueParameters.call(gd, globalMaterial);
            do
            {
                node = nodes[n];
                renderables = node.renderables;
                if (renderables)
                {
                    numRenderables = renderables.length;
                    for (i = 0; i < numRenderables; i += 1)
                    {
                        renderable = renderables[i];

                        renderUpdate.call(renderable);

                        shape = renderable.geometry;
                        vertexBuffer = shape.vertexBuffer;
                        offset = shape.vertexOffset;
                        semantics = shape.semantics;
                        surface = renderable.surface;
                        sharedTechniqueParameters = renderable.sharedMaterial.techniqueParameters;
                        techniqueParameters = renderable.techniqueParameters;

                        if (currentSharedTechniqueParameters !== sharedTechniqueParameters)
                        {
                            currentSharedTechniqueParameters = sharedTechniqueParameters;
                            setTechniqueParameters.call(gd, sharedTechniqueParameters, techniqueParameters);
                        }
                        else
                        {
                            setTechniqueParameters.call(gd, techniqueParameters);
                        }

                        if (currentVertexBuffer !== vertexBuffer ||
                            currentSemantics !== semantics ||
                            currentOffset !== offset)
                        {
                            currentVertexBuffer = vertexBuffer;
                            currentSemantics = semantics;
                            currentOffset = offset;
                            setStream.call(gd, vertexBuffer, semantics, offset);
                        }

                        indexBuffer = surface.indexBuffer;
                        if (indexBuffer)
                        {
                            setIndexBuffer.call(gd, indexBuffer);

                            drawIndexed.call(gd, surface.primitive, surface.numIndices, surface.first);
                        }
                        else
                        {
                            //Utilities.log("" + surface.primitive + " ," + surface.numVertices + " ," + surface.first);
                            draw.call(gd, surface.primitive, surface.numVertices, surface.first);
                        }
                    }
                }

                n += 1;
            }
            while (n < numNodes);
        }
    }

    drawVisibleNodes(gd, globalTechniqueParameters, technique, renderUpdate)
    {
        this.drawNodesArray(this.visibleNodes, gd, globalTechniqueParameters, technique, renderUpdate);
    }

    //
    // clearMaterials
    //
    clearMaterials()
    {
        var onMaterialDestroyed = this.onMaterialDestroyed;
        var materials = this.materials;
        if (materials)
        {
            for (var p in materials)
            {
                if (materials.hasOwnProperty(p))
                {
                    materials[p].reference.unsubscribeDestroyed(onMaterialDestroyed);
                }
            }
        }
        this.materials = {};
    }

    //
    // clearShapes
    //
    clearShapes()
    {
        var onGeometryDestroyed = this.onGeometryDestroyed;
        var shapes = this.shapes;
        if (shapes)
        {
            for (var p in shapes)
            {
                if (shapes.hasOwnProperty(p))
                {
                    shapes[p].reference.unsubscribeDestroyed(onGeometryDestroyed);
                }
            }
        }
        this.shapes = {};
    }

    //
    // clearShapesVertexData
    //
    clearShapesVertexData()
    {
        var shapes = this.shapes;
        var shape;
        if (shapes)
        {
            for (var p in shapes)
            {
                if (shapes.hasOwnProperty(p))
                {
                    shape = shapes[p];
                    delete shape.vertexData;
                    delete shape.indexData;
                    var surfaces = shape.surfaces;
                    if (surfaces)
                    {
                        for (var s in surfaces)
                        {
                            if (surfaces.hasOwnProperty(s))
                            {
                                var surface = surfaces[s];
                                delete surface.vertexData;
                                delete surface.indexData;
                            }
                        }
                    }
                }
            }
        }
    }

    //
    // clearRootNodes
    //
    clearRootNodes()
    {
        var rootNodes = this.rootNodes;
        if (rootNodes)
        {
            var rootLength = rootNodes.length;
            for (var rootIndex = 0; rootIndex < rootLength; rootIndex += 1)
            {
                rootNodes[rootIndex].destroy();
            }
        }
        this.rootNodes = [];
        this.rootNodesMap = {};
        this.dirtyRoots = {};
        this.nodesToUpdate = [];
        this.numNodesToUpdate = 0;
    }

    //
    // clear
    //
    clear()
    {
        this.effects = [];
        this.effectsMap = {};
        this.semantics = <Semantics><any>{}; // TODO: null?
        this.lights = {};
        this.globalLights = [];
        this.clearRootNodes();
        this.clearMaterials();
        this.clearShapes();
        this.staticSpatialMap.clear();
        this.dynamicSpatialMap.clear();
        this.frustumPlanes = [];
        this.animations = {};
        this.skeletons = {};
        this.extents = this.md.aabbBuildEmpty();
        this.visibleNodes = [];
        this.visibleRenderables = [];
        this.visibleLights = [];
        this.cameraAreaIndex = -1;
        this.cameraExtents = this.md.aabbBuildEmpty();
        this.visiblePortals = [];
        this.frameIndex = 0;
        this.queryCounter = 0;
        this.staticNodesChangeCounter = 0;
        this.testExtents = this.md.aabbBuildEmpty();
        this.externalNodesStack = [];
        this.overlappingPortals = [];
        this.newPoints = [];
        this.queryVisibleNodes = [];
    }

    //
    // endLoading
    //
    endLoading(onload)
    {
        this.initializeNodes();
        this.initializeAreas();
        if (onload)
        {
            onload(this);
        }
    }

    //
    // initializeNodes
    //
    initializeNodes()
    {
        var numNodesToUpdate = this.numNodesToUpdate;
        if (0 < numNodesToUpdate)
        {
            this.numNodesToUpdate = 0;
            this.dirtyRoots = {};

            SceneNode.updateNodes(this.md, this, this.nodesToUpdate, numNodesToUpdate);
        }

        this.staticSpatialMap.finalize();

        this.updateExtents();
    }

    //
    // addAreaStaticNodes
    //
    addAreaStaticNodes()
    {
        var findAreaIndicesAABB = this.findAreaIndicesAABB;
        var findAreaIndex = this.findAreaIndex;
        var scene = this;

        var addAreasNode = function addAreasNodeFn(bspNodes, areas)
        {
            if (this.dynamic)
            {
                return;
            }

            if (this.hasRenderables() || (this.hasLightInstances() && this.worldExtents))
            {
                var extents = this.worldExtents;
                var min0 = extents[0];
                var min1 = extents[1];
                var min2 = extents[2];
                var max0 = extents[3];
                var max1 = extents[4];
                var max2 = extents[5];
                var area, na;
                var cX, cY, cZ;
                if (!this.hasRenderables() &&
                    this.lightInstances.length === 1 &&
                    this.lightInstances[0].light.spot)
                {
                    var world = this.world;
                    cX = world[9];
                    cY = world[10];
                    cZ = world[11];
                }
                else
                {
                    cX = (min0 + max0) * 0.5;
                    cY = (min1 + max1) * 0.5;
                    cZ = (min2 + max2) * 0.5;
                }
                var areaIndex = findAreaIndex(bspNodes, cX, cY, cZ);
                if (areaIndex >= 0)
                {
                    area = areas[areaIndex];
                    area.nodes.push(this);

                    var overlappingAreas = scene.findOverlappingAreas(areaIndex, extents);
                    var numOverlappingAreas = overlappingAreas.length;
                    for (na = 0; na < numOverlappingAreas; na += 1)
                    {
                        overlappingAreas[na].nodes.push(this);
                    }
                }
                else
                {
                    var areaFound = false;
                    var areaExtents;
                    for ( ; ; )
                    {
                        var areaIndices = findAreaIndicesAABB(bspNodes, min0, min1, min2, max0, max1, max2);
                        var numAreaIndices = areaIndices.length;
                        if (0 < numAreaIndices)
                        {
                            // 1st try: only attach to overlapping areas
                            na = 0;
                            do
                            {
                                area = areas[areaIndices[na]];
                                areaExtents = area.extents;
                                if (areaExtents[0] <= max0 &&
                                    areaExtents[1] <= max1 &&
                                    areaExtents[2] <= max2 &&
                                    areaExtents[3] >= min0 &&
                                    areaExtents[4] >= min1 &&
                                    areaExtents[5] >= min2)
                                {
                                    area.nodes.push(this);
                                    areaFound = true;
                                }
                                na += 1;
                            }
                            while (na < numAreaIndices);
                            if (!areaFound)
                            {
                                // 2nd try: attach to any areas from bsp query
                                na = 0;
                                do
                                {
                                    areas[areaIndices[na]].nodes.push(this);
                                    na += 1;
                                }
                                while (na < numAreaIndices);
                            }
                            break;
                        }
                        else
                        {
                            // 3nd try: increase bounding box
                            var delta = Math.max((max0 - min0), (max1 - min1), (max2 - min2)) / 20;
                            min0 -= delta;
                            min1 -= delta;
                            min2 -= delta;
                            max0 += delta;
                            max1 += delta;
                            max2 += delta;
                        }
                    }
                }
            }
            var children = this.children;
            if (children)
            {
                var numChildren = children.length;
                for (var nc = 0; nc < numChildren; nc += 1)
                {
                    addAreasNode.call(children[nc], bspNodes, areas);
                }
            }
        };

        var rootNodes = this.rootNodes;
        var numRootNodes = rootNodes.length;
        var bspNodes = this.bspNodes;
        var areas = this.areas;
        for (var n = 0; n < numRootNodes; n += 1)
        {
            addAreasNode.call(rootNodes[n], bspNodes, areas);
        }
    }

    //
    // findOverlappingAreas
    //
    findOverlappingAreas(startAreaIndex: number, extents: any,
                         avoidDisabled?: boolean)
    {
        var area, portals, numPortals, n, portal, plane, d0, d1, d2, portalExtents, areaIndex, nextArea;
        var queryCounter = this.getQueryCounter();
        var areas = this.areas;
        var portalsStack = [];
        var numPortalsStack = 0;
        var overlappingAreas = [];
        var numOverlappingAreas = 0;

        var min0 = extents[0];
        var min1 = extents[1];
        var min2 = extents[2];
        var max0 = extents[3];
        var max1 = extents[4];
        var max2 = extents[5];

        area = areas[startAreaIndex];
        area.queryCounter = queryCounter;

        portals = area.portals;
        numPortals = portals.length;
        for (n = 0; n < numPortals; n += 1)
        {
            portal = portals[n];
            if (avoidDisabled && portal.disabled)
            {
                continue;
            }
            portal.queryCounter = queryCounter;

            portalExtents = portal.extents;
            if (portalExtents[0] < max0 &&
                portalExtents[1] < max1 &&
                portalExtents[2] < max2 &&
                portalExtents[3] > min0 &&
                portalExtents[4] > min1 &&
                portalExtents[5] > min2)
            {
                plane = portal.plane;
                d0 = plane[0];
                d1 = plane[1];
                d2 = plane[2];
                if ((d0 * (d0 < 0 ? min0 : max0) + d1 * (d1 < 0 ? min1 : max1) + d2 * (d2 < 0 ? min2 : max2)) >= plane[3])
                {
                    portalsStack[numPortalsStack] = portal;
                    numPortalsStack += 1;
                }
            }
        }

        while (0 < numPortalsStack)
        {
            numPortalsStack -= 1;
            portal = portalsStack[numPortalsStack];

            areaIndex = portal.area;
            area = areas[areaIndex];
            if (area.queryCounter !== queryCounter)
            {
                area.queryCounter = queryCounter;
                overlappingAreas[numOverlappingAreas] = area;
                numOverlappingAreas += 1;
            }

            portals = area.portals;
            numPortals = portals.length;
            for (n = 0; n < numPortals; n += 1)
            {
                portal = portals[n];
                if (avoidDisabled && portal.disabled)
                {
                    continue;
                }
                nextArea = portal.area;
                if (nextArea !== areaIndex &&
                    nextArea !== startAreaIndex &&
                    portal.queryCounter !== queryCounter)
                {
                    portal.queryCounter = queryCounter;

                    portalExtents = portal.extents;
                    if (portalExtents[0] < max0 &&
                        portalExtents[1] < max1 &&
                        portalExtents[2] < max2 &&
                        portalExtents[3] > min0 &&
                        portalExtents[4] > min1 &&
                        portalExtents[5] > min2)
                    {
                        plane = portal.plane;
                        d0 = plane[0];
                        d1 = plane[1];
                        d2 = plane[2];
                        if ((d0 * (d0 < 0 ? min0 : max0) + d1 * (d1 < 0 ? min1 : max1) + d2 * (d2 < 0 ? min2 : max2)) >= plane[3])
                        {
                            portalsStack[numPortalsStack] = portal;
                            numPortalsStack += 1;
                        }
                    }
                }
            }
        }

        return overlappingAreas;
    }

    //
    // checkAreaDynamicNodes
    //
    checkAreaDynamicNodes()
    {
        var findAreaIndicesAABB = this.findAreaIndicesAABB;
        var dynamicSpatialMap = this.dynamicSpatialMap;
        var bspNodes = this.bspNodes;
        var areas = this.areas;

        var checkAreaNode = function checkAreaNodeFn()
        {
            if (this.dynamic &&
                (this.hasRenderables() || (this.hasLightInstances() && this.worldExtents)))
            {
                var extents = this.worldExtents;
                var min0 = extents[0];
                var min1 = extents[1];
                var min2 = extents[2];
                var max0 = extents[3];
                var max1 = extents[4];
                var max2 = extents[5];
                var pad = false;
                var areaFound = false;
                var na;
                for ( ; ; )
                {
                    var areaIndices = findAreaIndicesAABB(bspNodes, min0, min1, min2, max0, max1, max2);
                    var numAreaIndices = areaIndices.length;
                    if (0 < numAreaIndices)
                    {
                        na = 0;
                        do
                        {
                            var area = areas[areaIndices[na]];
                            var areaExtent = area.extents;
                            if (areaExtent[0] <= max0 &&
                                areaExtent[1] <= max1 &&
                                areaExtent[2] <= max2 &&
                                areaExtent[3] >= min0 &&
                                areaExtent[4] >= min1 &&
                                areaExtent[5] >= min2)
                            {
                                areaFound = true;
                                break;
                            }
                            na += 1;
                        }
                        while (na < numAreaIndices);
                    }
                    if (areaFound)
                    {
                        break;
                    }
                    var delta = Math.max((max0 - min0), (max1 - min1), (max2 - min2)) / 20;
                    min0 -= delta;
                    min1 -= delta;
                    min2 -= delta;
                    max0 += delta;
                    max1 += delta;
                    max2 += delta;
                    pad = true;
                }
                if (pad)
                {   //TODO: This alters extents but the developer would expect them to remain constant if they are responsible for them.
                    extents[0] = min0;
                    extents[1] = min1;
                    extents[2] = min2;
                    extents[3] = max0;
                    extents[4] = max1;
                    extents[5] = max2;
                    dynamicSpatialMap.update(this, extents);
                }
            }
            var children = this.children;
            if (children)
            {
                var numChildren = children.length;
                for (var nc = 0; nc < numChildren; nc += 1)
                {
                    checkAreaNode.call(children[nc]);
                }
            }
        };

        var rootNodes = this.rootNodes;
        var numRootNodes = rootNodes.length;
        for (var n = 0; n < numRootNodes; n += 1)
        {
            checkAreaNode.call(rootNodes[n]);
        }
    }

    //
    // initializeAreas
    //
    initializeAreas()
    {
        var areas = this.areas;
        if (areas)
        {
            var numAreas = areas.length;
            var n, area, target, extents, areaExtents;
            for (n = 0; n < numAreas; n += 1)
            {
                area = areas[n];
                target = area.target;
                area.nodes = [];
                extents = target.calculateHierarchyWorldExtents();
                if (extents)
                {
                    areaExtents = area.extents;
                    areaExtents[0] = (extents[0] < areaExtents[0] ? extents[0] : areaExtents[0]);
                    areaExtents[1] = (extents[1] < areaExtents[1] ? extents[1] : areaExtents[1]);
                    areaExtents[2] = (extents[2] < areaExtents[2] ? extents[2] : areaExtents[2]);
                    areaExtents[3] = (extents[3] > areaExtents[3] ? extents[3] : areaExtents[3]);
                    areaExtents[4] = (extents[4] > areaExtents[4] ? extents[4] : areaExtents[4]);
                    areaExtents[5] = (extents[5] > areaExtents[5] ? extents[5] : areaExtents[5]);
                }
            }

            this.addAreaStaticNodes();

            this.checkAreaDynamicNodes();

            for (n = 0; n < numAreas; n += 1)
            {
                area = areas[n];
                area.numStaticNodes = area.nodes.length;
            }
        }
        this.areaInitalizeStaticNodesChangeCounter = this.staticNodesChangeCounter;
    }

    //
    // createMaterial
    //
    createMaterial(materialName, fileMaterial, effectName, fileEffects, fileImages, graphicsDevice)
    {
        var materials = this.materials;

        var material = Material.create(graphicsDevice);
        var param, filename, effectType, p;
        var fileEffectMeta;

        // Effect associated, load from file
        if (fileEffects)
        {
            var fileEffect = fileEffects[effectName];
            if (fileEffect)
            {
                var effectParameters = fileEffect.parameters;
                for (p in effectParameters)
                {
                    if (effectParameters.hasOwnProperty(p))
                    {
                        param = effectParameters[p];
                        if (typeof param === 'string')
                        {
                            if (fileImages)
                            {
                                filename = fileImages[param] || param;
                            }
                            else
                            {
                                filename = param;
                            }

                            if (!material.texturesNames)
                            {
                                material.texturesNames = {};
                            }
                            material.texturesNames[p] = filename;
                            material.techniqueParameters[p] = null;
                        }
                        else
                        {
                            material.techniqueParameters[p] = param;
                        }
                    }
                }
                effectType = fileEffect.type;
                fileEffectMeta = fileEffect.meta;
            }
            else
            {
                effectType = effectName;
            }
        }
        else
        {
            effectType = effectName;
        }

        var materialParameters = fileMaterial.parameters;
        for (p in materialParameters)
        {
            if (materialParameters.hasOwnProperty(p))
            {
                param = materialParameters[p];
                if (typeof param === 'string')
                {
                    if (fileImages)
                    {
                        filename = fileImages[param] || param;
                    }
                    else
                    {
                        filename = param;
                    }

                    if (!material.texturesNames)
                    {
                        material.texturesNames = {};
                    }
                    material.texturesNames[p] = filename;

                    material.techniqueParameters[p] = null;
                }
                else
                {
                    material.techniqueParameters[p] = param;
                }
            }
        }

        material.effectName = effectType;

        var fileMaterialMeta = fileMaterial.meta;
        if (fileMaterialMeta)
        {
            if (fileEffectMeta)
            {
                for (p in fileEffectMeta)
                {
                    if (fileEffectMeta.hasOwnProperty(p) &&
                        !fileMaterialMeta.hasOwnProperty(p))
                    {
                        fileMaterialMeta[p] = fileEffectMeta[p];
                    }
                }
            }
            material.meta = fileMaterialMeta;
        }
        else if (fileEffectMeta)
        {
            material.meta = fileEffectMeta;
        }

        materials[materialName] = material;
        material.name = materialName;
        material.reference.subscribeDestroyed(this.onMaterialDestroyed);

        return material;
    }

    //
    // loadMaterials
    //
    loadMaterials(loadParams)
    {
        var sceneData = loadParams.data;
        var gd = loadParams.graphicsDevice;
        var textureManager = loadParams.textureManager;
        var createMaterial = this.createMaterial;

        if (!loadParams.append)
        {
            this.effects = [];
            this.effectsMap = {};
            this.clearMaterials();
        }

        // Import materials
        var fileMaterials = sceneData.materials;
        if (fileMaterials)
        {
            var fileImages = sceneData.images;
            var fileEffects = sceneData.effects;
            var materials = this.materials;
            for (var m in fileMaterials)
            {
                if (fileMaterials.hasOwnProperty(m) &&
                    !materials[m])
                {
                    var fileMaterial = fileMaterials[m];
                    var effectName = (fileMaterial.effect || "default");
                    createMaterial.call(this, m, fileMaterial, effectName, fileEffects, fileImages, gd, textureManager);
                }
            }
        }
    }

    //
    // loadSkeletons
    //
    loadSkeletons(loadParams)
    {
        var sceneData = loadParams.data;
        var fileSkeletons = sceneData.skeletons;

        var md = this.md;
        var m43Build = md.m43Build;

        var invLTM, bindPose;

        for (var s in fileSkeletons)
        {
            if (fileSkeletons.hasOwnProperty(s))
            {
                var skeleton = fileSkeletons[s];

                var numJoints = skeleton.numNodes;
                var invLTMs = skeleton.invBoneLTMs;
                var bindPoses = skeleton.bindPoses;

                // copy the inv bone ltms and bind poses to make them native
                for (var b = 0; b < numJoints; b += 1)
                {
                    invLTM = invLTMs[b];
                    bindPose = bindPoses[b];

                    invLTMs[b] = m43Build.apply(md, invLTM);
                    bindPoses[b] = m43Build.apply(md, bindPose);
                }

                if (loadParams.skeletonNamePrefix)
                {
                    s = loadParams.skeletonNamePrefix + s;
                }

                this.skeletons[s] = skeleton;
            }
        }
    }

    // For cases where > 1-index per vertex we process it to create 1-index per vertex from data
    _updateSingleIndexTables(surface,
                             indicesPerVertex,
                             verticesAsIndexLists,
                             verticesAsIndexListTable,
                             numUniqueVertices)
    {
        var faces = surface.faces;
        var numIndices = faces.length;

        var newFaces = [];
        newFaces.length = numIndices;

        var numUniqueVertIndex = verticesAsIndexLists.length;
        var vertIdx = 0;
        var srcIdx = 0;
        var n, maxn, index;
        var currentLevel, nextLevel, thisVertIndex;

        while (srcIdx < numIndices)
        {
            currentLevel = verticesAsIndexListTable;
            n = srcIdx;
            maxn = (srcIdx + (indicesPerVertex - 1));
            do
            {
                index = faces[n];
                nextLevel = currentLevel[index];
                if (nextLevel === undefined)
                {
                    currentLevel[index] = nextLevel = {};
                }
                currentLevel = nextLevel;
                n += 1;
            }
            while (n < maxn);

            index = faces[n];
            thisVertIndex = currentLevel[index];
            if (thisVertIndex === undefined)
            {
                // New index - add to tables
                currentLevel[index] = thisVertIndex = numUniqueVertices;
                numUniqueVertices += 1;

                // Copy indices
                n = srcIdx;
                do
                {
                    verticesAsIndexLists[numUniqueVertIndex] = faces[n];
                    numUniqueVertIndex += 1;
                    n += 1;
                }
                while (n < maxn);

                verticesAsIndexLists[numUniqueVertIndex] = index;
                numUniqueVertIndex += 1;
            }

            newFaces[vertIdx] = thisVertIndex;
            vertIdx += 1;

            srcIdx += indicesPerVertex;
        }

        newFaces.length = vertIdx;
        surface.faces = newFaces;

        return numUniqueVertices;
    }

    _remapVertices(vertexSources: any[],
                   totalNumVertices: number,
                   indicesPerVertex: number,
                   verticesAsIndexLists: number[]): void
    {
        var numVertexSources = vertexSources.length;
        var vs;
        for (vs = 0; vs < numVertexSources; vs += 1)
        {
            var vertexSource = vertexSources[vs];
            var thisSourceOffset = vertexSource.offset;
            var thisSourceStride = vertexSource.stride;
            var thisSourceData = vertexSource.data;

            var newData = new Array(thisSourceStride * totalNumVertices);

            // For each entry in index list
            var vertIdx = 0;
            var vertIdxOffset = thisSourceOffset;
            while (vertIdx < totalNumVertices)
            {
                var newVBIdx = thisSourceStride * vertIdx;
                var oldVBIdx = thisSourceStride * verticesAsIndexLists[vertIdxOffset];

                // Copy the vertex data out of the vertex buffer
                for (var attrIdx = 0; attrIdx < thisSourceStride; attrIdx += 1)
                {
                    newData[newVBIdx + attrIdx] = thisSourceData[oldVBIdx + attrIdx];
                }

                vertIdx += 1;
                vertIdxOffset += indicesPerVertex;
            }

            vertexSource.data = newData;
            vertexSource.offset = 0;
        }
    }

    _gatherVertexData(vertexData: any,
                      vertexSources: any[],
                      totalNumVertices: number): void
    {
        var numVertexSources = vertexSources.length;
        var vertexDataCount = 0;
        var t = 0;
        for (t = 0; t < totalNumVertices; t += 1)
        {
            var vs = 0;
            do
            {
                var vertexSource = vertexSources[vs];
                var sourceData = vertexSource.data;
                var stride = vertexSource.stride;
                var index = t * stride;
                var nextIndex = (index + stride);
                var destStride = vertexSource.destStride;
                do
                {
                    vertexData[vertexDataCount] = sourceData[index];
                    vertexDataCount += 1;
                    index += 1;
                }
                while (index < nextIndex);

                while (stride < destStride)
                {
                    vertexData[vertexDataCount] = 0;
                    vertexDataCount += 1;
                    destStride -= 1;
                }

                vs += 1;
            }
            while (vs < numVertexSources);
        }
    }

    _isSequentialIndices(indices, numIndices): boolean
    {
        var baseIndex = indices[0];
        var n;
        for (n = 1; n < numIndices; n += 1)
        {
            if (indices[n] !== (baseIndex + n))
            {
                return false;
            }
        }
        return true;
    }

    _copyIndexData(indexBufferData: any,
                   indexBufferOffset: number,
                   faces: number[],
                   numIndices: number,
                   baseIndex: number): number
    {
        var t;
        if (baseIndex)
        {
            for (t = 0; t < numIndices; t += 1)
            {
                indexBufferData[indexBufferOffset] = (baseIndex + faces[t]);
                indexBufferOffset += 1;
            }
        }
        else
        {
            for (t = 0; t < numIndices; t += 1)
            {
                indexBufferData[indexBufferOffset] = faces[t];
                indexBufferOffset += 1;
            }
        }
        return indexBufferOffset;
    }

    // try to group sequential renderables into a single draw call
    _optimizeRenderables(node: SceneNode, gd: GraphicsDevice): void
    {
        var renderables = node.renderables;
        var numRenderables = renderables.length;
        var triangles = gd.PRIMITIVE_TRIANGLES;
        var vbMap = {};
        var ungroup = [];
        var numUngroup = 0;
        var n, renderable, geometry, surface, vbid, ibMap, ibid, group;
        var foundGroup = false;
        for (n = 0; n < numRenderables; n += 1)
        {
            renderable = renderables[n];
            surface = renderable.surface;
            // we can only trivially group rigid triangle primitives
            if (surface.primitive === triangles &&
                renderable.geometryType === "rigid")
            {
                geometry = renderable.geometry;
                vbid = geometry.vertexBuffer.id;
                ibMap = vbMap[vbid];
                if (ibMap === undefined)
                {
                    vbMap[vbid] = ibMap = {};
                }
                if (surface.indexBuffer)
                {
                    ibid = surface.indexBuffer.id;
                }
                else
                {
                    ibid = 'null';
                }
                group = ibMap[ibid];
                if (group === undefined)
                {
                    ibMap[ibid] = [renderable];
                }
                else
                {
                    group.push(renderable);
                    foundGroup = true;
                }
            }
            else
            {
                ungroup[numUngroup] = renderable;
                numUngroup += 1;
            }
        }

        function cloneSurface(surface: any): any
        {
            var clone = new surface.constructor();
            var p;
            for (p in surface)
            {
                if (surface.hasOwnProperty(p))
                {
                    clone[p] = surface[p];
                }
            }
            return clone;
        }

        if (foundGroup)
        {
            var max = Math.max;
            var min = Math.min;
            var arrayConstructor = (this.float32ArrayConstructor ? this.float32ArrayConstructor : Array);
            var sequenceExtents = new arrayConstructor(6);
            var sequenceFirstRenderable, sequenceLength, sequenceVertexOffset, sequenceIndicesEnd, sequenceNumVertices;
            var groupSize, g, lastMaterial, material, center, halfExtents;

            var flushSequence = function flushSequenceFn()
            {
                var surface = cloneSurface(sequenceFirstRenderable.surface);
                sequenceFirstRenderable.surface = surface;
                if (surface.indexBuffer)
                {
                    surface.numIndices = (sequenceIndicesEnd - surface.first);
                    surface.numVertices = sequenceNumVertices;
                }
                else
                {
                    surface.numVertices = (sequenceIndicesEnd - surface.first);
                }

                var c0 = (sequenceExtents[3] + sequenceExtents[0]) * 0.5;
                var c1 = (sequenceExtents[4] + sequenceExtents[1]) * 0.5;
                var c2 = (sequenceExtents[5] + sequenceExtents[2]) * 0.5;
                if (c0 !== 0 ||
                    c1 !== 0 ||
                    c2 !== 0)
                {
                    var center = (sequenceFirstRenderable.center || new arrayConstructor(3));
                    sequenceFirstRenderable.center = center;
                    center[0] = c0;
                    center[1] = c1;
                    center[2] = c2;
                }
                else
                {
                    sequenceFirstRenderable.center = null;
                }

                var halfExtents = (sequenceFirstRenderable.halfExtents || new arrayConstructor(3));
                sequenceFirstRenderable.halfExtents = halfExtents;
                halfExtents[0] = (sequenceExtents[3] - sequenceExtents[0]) * 0.5;
                halfExtents[1] = (sequenceExtents[4] - sequenceExtents[1]) * 0.5;
                halfExtents[2] = (sequenceExtents[5] - sequenceExtents[2]) * 0.5;
            };

            numRenderables = 0;
            for (vbid in vbMap)
            {
                if (vbMap.hasOwnProperty(vbid))
                {
                    ibMap = vbMap[vbid];
                    for (ibid in ibMap)
                    {
                        if (ibMap.hasOwnProperty(ibid))
                        {
                            group = ibMap[ibid];
                            groupSize = group.length;
                            if (groupSize === 1)
                            {
                                renderables[numRenderables] = group[0];
                                numRenderables += 1;
                            }
                            else
                            {
                                group.sort(function (a, b) {
                                    return (a.geometry.vertexOffset - b.geometry.vertexOffset) || (a.surface.first - b.surface.first);
                                });

                                g = 0;
                                lastMaterial = null;
                                sequenceFirstRenderable = null;
                                sequenceNumVertices = 0;
                                sequenceVertexOffset = -1;
                                sequenceIndicesEnd = 0;
                                sequenceLength = 0;
                                do
                                {
                                    renderable = group[g];
                                    geometry = renderable.geometry;
                                    surface = renderable.surface;
                                    material = renderable.sharedMaterial;
                                    center = renderable.center;
                                    halfExtents = renderable.halfExtents;
                                    if (sequenceVertexOffset !== geometry.vertexOffset ||
                                        sequenceIndicesEnd !== surface.first ||
                                        !lastMaterial ||
                                        (lastMaterial !== material &&
                                         !lastMaterial.isSimilar(material)))
                                    {
                                        if (0 < sequenceLength)
                                        {
                                            if (1 < sequenceLength)
                                            {
                                                flushSequence();
                                            }

                                            renderables[numRenderables] = sequenceFirstRenderable;
                                            numRenderables += 1;
                                        }

                                        lastMaterial = material;
                                        sequenceFirstRenderable = renderable;
                                        sequenceNumVertices = 0;
                                        sequenceLength = 1;
                                        sequenceVertexOffset = geometry.vertexOffset;

                                        if (center)
                                        {
                                            sequenceExtents[0] = (center[0] - halfExtents[0]);
                                            sequenceExtents[1] = (center[1] - halfExtents[1]);
                                            sequenceExtents[2] = (center[2] - halfExtents[2]);
                                            sequenceExtents[3] = (center[0] + halfExtents[0]);
                                            sequenceExtents[4] = (center[1] + halfExtents[1]);
                                            sequenceExtents[5] = (center[2] + halfExtents[2]);
                                        }
                                        else
                                        {
                                            sequenceExtents[0] = -halfExtents[0];
                                            sequenceExtents[1] = -halfExtents[1];
                                            sequenceExtents[2] = -halfExtents[2];
                                            sequenceExtents[3] = halfExtents[0];
                                            sequenceExtents[4] = halfExtents[1];
                                            sequenceExtents[5] = halfExtents[2];
                                        }
                                    }
                                    else
                                    {
                                        sequenceLength += 1;

                                        if (center)
                                        {
                                            sequenceExtents[0] = min(sequenceExtents[0], (center[0] - halfExtents[0]));
                                            sequenceExtents[1] = min(sequenceExtents[1], (center[1] - halfExtents[1]));
                                            sequenceExtents[2] = min(sequenceExtents[2], (center[2] - halfExtents[2]));
                                            sequenceExtents[3] = max(sequenceExtents[3], (center[0] + halfExtents[0]));
                                            sequenceExtents[4] = max(sequenceExtents[4], (center[1] + halfExtents[1]));
                                            sequenceExtents[5] = max(sequenceExtents[5], (center[2] + halfExtents[2]));
                                        }
                                        else
                                        {
                                            sequenceExtents[0] = min(sequenceExtents[0], -halfExtents[0]);
                                            sequenceExtents[1] = min(sequenceExtents[1], -halfExtents[1]);
                                            sequenceExtents[2] = min(sequenceExtents[2], -halfExtents[2]);
                                            sequenceExtents[3] = max(sequenceExtents[3], halfExtents[0]);
                                            sequenceExtents[4] = max(sequenceExtents[4], halfExtents[1]);
                                            sequenceExtents[5] = max(sequenceExtents[5], halfExtents[2]);
                                        }
                                    }

                                    if (surface.indexBuffer)
                                    {
                                        sequenceIndicesEnd = (surface.first + surface.numIndices);
                                        sequenceNumVertices += surface.numVertices;
                                    }
                                    else
                                    {
                                        sequenceIndicesEnd = (surface.first + surface.numVertices);
                                    }

                                    g += 1;
                                }
                                while (g < groupSize);

                                debug.assert(0 < sequenceLength);

                                if (1 < sequenceLength)
                                {
                                    flushSequence();
                                }

                                renderables[numRenderables] = sequenceFirstRenderable;
                                numRenderables += 1;
                            }
                        }
                    }
                }
            }
            for (n = 0; n < numUngroup; n += 1)
            {
                renderables[numRenderables] = ungroup[n];
                numRenderables += 1;
            }
            for (n = numRenderables; n < renderables.length; n += 1)
            {
                renderables[n].setNode(null);
            }
            renderables.length = numRenderables;
        }
    }

    //
    // loadShape
    //
    loadShape(shapeName, fileShapeName, loadParams)
    {
        var shape = this.shapes[shapeName];

        if (!shape)
        {
            var cachedSemantics = this.semantics;

            var sceneData = loadParams.data;
            var gd = loadParams.graphicsDevice;
            var keepVertexData = loadParams.keepVertexData;
            var fileShapes = sceneData.geometries;
            var fileShape = fileShapes[fileShapeName];
            var sources = fileShape.sources;
            var inputs = fileShape.inputs;
            var skeletonName = loadParams.skeletonNamePrefix ? loadParams.skeletonNamePrefix + fileShape.skeleton : fileShape.skeleton;

            shape = Geometry.create();

            if (skeletonName)
            {
                var skeleton = this.skeletons[skeletonName];
                if (skeleton)
                {
                    shape.skeleton = skeleton;
                    shape.type = "skinned";
                }
                else
                {
                    // Failed to load skeleton so just draw bind pose
                    shape.type = "rigid";
                }
            }
            else
            {
                shape.type = "rigid";
            }

            if (gd)
            {
                // First calculate data about the vertex streams
                var offset;
                var destStride;
                var destFormat;
                var maxOffset = 0;
                var vertexSources = [];

                var isUByte4Range = function isUByte4RangeFn(minVal, maxVal)
                {
                    return (minVal >= 0) && (maxVal <= 255) && (maxVal >= 0);
                };

                var areInRange = function areInRangeFn(minVals, maxVals, isRangeFn)
                {
                    var numVals = minVals.length;
                    if (maxVals.length !== numVals)
                    {
                        return false;
                    }
                    for (var valIdx = 0 ; valIdx < numVals ; valIdx += 1)
                    {
                        if (!isRangeFn(minVals[valIdx], maxVals[valIdx]))
                        {
                            return false;
                        }
                    }
                    return true;
                };

                var formatMap = loadParams.vertexFormatMap || {};

                var fileInput;
                for (var input in inputs)
                {
                    if (inputs.hasOwnProperty(input))
                    {
                        // skip unknown semantics
                        if (gd['SEMANTIC_' + input] === undefined)
                        {
                            debug.log("Unknown semantic: " + input);
                            continue;
                        }

                        fileInput = inputs[input];
                        offset = fileInput.offset;
                        if (offset > maxOffset)
                        {
                            maxOffset = offset;
                        }
                        var fileSource = sources[fileInput.source];
                        var fileSourceStride = fileSource.stride;

                        // If the caller gave a preferred format, try
                        // to use it.

                        destFormat = formatMap[input];
                        destStride = fileSourceStride;

                        // If we got a caller preference, check for a
                        // new stride

                        if (destFormat)
                        {
                            if (destFormat.indexOf("4"))
                            {
                                destStride = 4;
                            }
                            else if (destFormat.indexOf("3")) {
                                destStride = 3;
                            }
                            else if (destFormat.indexOf("2"))
                            {
                                destStride = 2;
                            }
                            else if (destFormat.indexOf("1"))
                            {
                                destStride = 1;
                            }
                            else
                            { /* ERROR */
                                destFormat = null;
                            }
                        }

                        // No preferred format, make our own choice

                        if (!destFormat)
                        {
                            // Check for appropriate formats.  Make
                            // assumptions based on semantic names.

                            if (input === "BLENDINDICES" || input === "BLENDINDICES0")
                            {
                                if (fileSourceStride === 4 &&
                                    areInRange(fileSource.min, fileSource.max, isUByte4Range))
                                {
                                    destFormat = "UBYTE4";
                                }
                            }

                            // if (input == "NORMAL" || input == "NORMAL0")
                            // {
                            //     if (fileSourceStride == 3)
                            //     {
                            //         Check range is within [-1,1]

                            //         destFormat = "BYTE";
                            //         destFormatNormalized = true;
                            //         destStride = 4;
                            //     }
                            // }
                        }

                        // If we still don't have a format, revert to FLOATn

                        if (!destFormat)
                        {
                            destFormat = "FLOAT" + fileSourceStride;
                        }

                        vertexSources.push({
                            semantic: input,
                            offset: offset,
                            data: fileSource.data,
                            stride: fileSourceStride,
                            destFormat: destFormat,
                            destStride: destStride
                        });
                    }
                }
                var indicesPerVertex = (maxOffset + 1);

                if (0 < maxOffset)
                {
                    var vertexSourcesCompare = function (vertexSourceA, vertexSourceB)
                    {
                        if (vertexSourceA.offset === vertexSourceB.offset)
                        {
                            var semanticA = vertexSourceA.semantic;
                            if (typeof semanticA === 'string')
                            {
                                semanticA = gd['SEMANTIC_' + semanticA];
                            }
                            var semanticB = vertexSourceB.semantic;
                            if (typeof semanticB === 'string')
                            {
                                semanticB = gd['SEMANTIC_' + semanticB];
                            }
                            return (semanticA - semanticB);
                        }
                        else
                        {
                            return (vertexSourceA.offset - vertexSourceB.offset);
                        }
                    };
                    vertexSources.sort(vertexSourcesCompare);
                }

                var numVertexSources = vertexSources.length;
                var semanticsNames = [];
                var attributes = [];
                var useFloatArray = (this.float32ArrayConstructor ? true : false);
                var numValuesPerVertex = 0;
                var vs, vertexSource;
                for (vs = 0; vs < numVertexSources; vs += 1)
                {
                    vertexSource = vertexSources[vs];
                    semanticsNames[vs] = vertexSource.semantic;
                    destFormat = vertexSource.destFormat;
                    if (useFloatArray)
                    {
                        if (typeof destFormat === "string")
                        {
                            if (destFormat[0] !== "F")
                            {
                                useFloatArray = false;
                            }
                        }
                        else
                        {
                            if (destFormat !== gd.VERTEXFORMAT_FLOAT1 &&
                                destFormat !== gd.VERTEXFORMAT_FLOAT2 &&
                                destFormat !== gd.VERTEXFORMAT_FLOAT3 &&
                                destFormat !== gd.VERTEXFORMAT_FLOAT4)
                            {
                                useFloatArray = false;
                            }
                        }
                    }
                    attributes[vs] = destFormat;
                    numValuesPerVertex += vertexSource.stride;
                }

                // Now parse the surfaces to work out primitive types and the total vertex count
                var numVertices, totalNumVertices = 0;
                var noSurfaces = false;
                var surfaces = fileShape.surfaces;
                if (!surfaces)
                {
                    noSurfaces = true;
                    surfaces = {
                        singleSurface: {
                            triangles: fileShape.triangles,
                            lines: fileShape.lines,
                            numPrimitives: fileShape.numPrimitives
                        }
                    };
                }

                var surface;
                var destSurface;
                var faces;
                var s;

                for (s in surfaces)
                {
                    if (surfaces.hasOwnProperty(s))
                    {
                        surface = surfaces[s];

                        faces = surface.triangles;
                        var primitive, vertexPerPrimitive;
                        if (faces)
                        {
                            primitive = gd.PRIMITIVE_TRIANGLES;
                            vertexPerPrimitive = 3;
                        }
                        else
                        {
                            faces = surface.lines;
                            if (faces)
                            {
                                primitive = gd.PRIMITIVE_LINES;
                                vertexPerPrimitive = 2;
                            }
                        }

                        destSurface = {
                            first: 0,
                            numVertices: 0,
                            primitive: primitive,
                            faces: faces
                        };
                        shape.surfaces[s] = destSurface;

                        if (faces)
                        {
                            if (1 < indicesPerVertex)
                            {
                                numVertices = (surface.numPrimitives * vertexPerPrimitive);
                                destSurface.numVertices = numVertices;
                            }
                            else
                            {

                                numVertices = (vertexSources[0].data.length / vertexSources[0].stride);
                                if (numVertices > faces.length)
                                {
                                    numVertices = faces.length;
                                }
                                destSurface.numVertices = numVertices;
                            }
                        }
                    }
                }

                if (indicesPerVertex > 1)
                {
                    // [ [a,b,c], [d,e,f], ... ]
                    totalNumVertices = 0;

                    var verticesAsIndexLists = [];
                    var verticesAsIndexListTable = {};
                    var shapeSurfaces = shape.surfaces;
                    for (s in shapeSurfaces)
                    {
                        if (shapeSurfaces.hasOwnProperty(s))
                        {
                            var shapeSurface = shapeSurfaces[s];
                            totalNumVertices = this._updateSingleIndexTables(shapeSurface,
                                                                             indicesPerVertex,
                                                                             verticesAsIndexLists,
                                                                             verticesAsIndexListTable,
                                                                             totalNumVertices);
                        }
                    }

                    verticesAsIndexListTable = null;

                    // Recreate vertex buffer data on the vertexSources
                    this._remapVertices(vertexSources,
                                        totalNumVertices,
                                        indicesPerVertex,
                                        verticesAsIndexLists);

                    verticesAsIndexLists.length = 0;
                    verticesAsIndexLists = null;

                    indicesPerVertex = 1;
                }

                debug.assert(indicesPerVertex === 1);

                totalNumVertices = vertexSources[0].data.length / vertexSources[0].stride;

                var vertexBufferManager = (loadParams.vertexBufferManager ||
                                           this.vertexBufferManager);
                if (!vertexBufferManager)
                {
                    vertexBufferManager = VertexBufferManager.create(gd);
                    this.vertexBufferManager = vertexBufferManager;
                }

                var indexBufferManager = (loadParams.indexBufferManager || this.indexBufferManager);
                if (!indexBufferManager)
                {
                    indexBufferManager = IndexBufferManager.create(gd);
                    this.indexBufferManager = indexBufferManager;
                }

                var baseIndex;
                var vertexBuffer = null;
                var vertexBufferAllocation = vertexBufferManager.allocate(totalNumVertices, attributes);
                vertexBuffer = vertexBufferAllocation.vertexBuffer;
                if (!vertexBuffer)
                {
                    return undefined;
                }

                shape.vertexBuffer = vertexBuffer;
                shape.vertexBufferManager = vertexBufferManager;
                shape.vertexBufferAllocation = vertexBufferAllocation;

                baseIndex = vertexBufferAllocation.baseIndex;

                //
                // We no have the simple case of each index maps to one vertex so create one vertex buffer and fill in.
                //
                var vertexData = (useFloatArray ?
                                  new this.float32ArrayConstructor(totalNumVertices * numValuesPerVertex) :
                                  new Array(totalNumVertices * numValuesPerVertex));
                this._gatherVertexData(vertexData,
                                       vertexSources,
                                       totalNumVertices);
                vertexBuffer.setData(vertexData, baseIndex, totalNumVertices);

                if (keepVertexData &&
                    !useFloatArray &&
                    this.float32ArrayConstructor)
                {
                    vertexData = new this.float32ArrayConstructor(vertexData);
                }

                // Count total num indices
                var totalNumIndices = 0;
                var numIndices;

                for (s in surfaces)
                {
                    if (surfaces.hasOwnProperty(s))
                    {
                        destSurface = shape.surfaces[s];
                        faces = destSurface.faces;
                        if (faces)
                        {
                            numIndices = faces.length;

                            // Try to optimize simple quads
                            if (numIndices === 6 &&
                                totalNumVertices === 4 &&
                                destSurface.primitive === gd.PRIMITIVE_TRIANGLES)
                            {
                                var f0 = faces[0];
                                if (f0 === faces[3] || f0 === faces[4] || f0 === faces[5])
                                {
                                    faces[0] = faces[1];
                                    faces[1] = faces[2];
                                    faces[2] = f0;

                                    f0 = faces[0];
                                    if (f0 === faces[3] || f0 === faces[4] || f0 === faces[5])
                                    {
                                        faces[0] = faces[1];
                                        faces[1] = faces[2];
                                        faces[2] = f0;
                                    }
                                }
                                var f5 = faces[5];
                                if (f5 === faces[1] || f5 === faces[2])
                                {
                                    faces[5] = faces[4];
                                    faces[4] = faces[3];
                                    faces[3] = f5;

                                    f5 = faces[5];
                                    if (f5 === faces[1] || f5 === faces[2])
                                    {
                                        faces[5] = faces[4];
                                        faces[4] = faces[3];
                                        faces[3] = f5;
                                    }
                                }
                                if (faces[1] === faces[4] &&
                                    faces[2] === faces[3])
                                {
                                    destSurface.primitive = gd.PRIMITIVE_TRIANGLE_STRIP;
                                    numIndices = 4;
                                    faces = [faces[0], faces[1], faces[2], faces[5]];
                                    destSurface.faces = faces;
                                }
                            }

                            if (!this._isSequentialIndices(faces, numIndices))
                            {
                                totalNumIndices += numIndices;
                            }
                        }
                    }
                }

                var indexBuffer, indexBufferData, indexBufferBaseIndex, indexBufferOffset, maxIndex;
                if (0 < totalNumIndices)
                {
                    maxIndex = (baseIndex + totalNumVertices - 1);
                    if (maxIndex >= 65536)
                    {
                        if (totalNumVertices <= 65536)
                        {
                            // Assign vertex offsets in blocks of 16bits so we can optimize renderables togheter
                            /* tslint:disable:no-bitwise */
                            var blockBase = ((baseIndex >>> 16) << 16);
                            /* tslint:enable:no-bitwise */
                            baseIndex -= blockBase;
                            if ((baseIndex + totalNumVertices) > 65536)
                            {
                                blockBase += (baseIndex + totalNumVertices - 65536);
                                baseIndex = (65536 - totalNumVertices);
                                maxIndex = 65535;
                            }
                            else
                            {
                                maxIndex = (baseIndex + totalNumVertices - 1);
                            }
                            shape.vertexOffset = blockBase;
                        }
                        else
                        {
                            shape.vertexOffset = 0;
                        }
                    }
                    else
                    {
                        shape.vertexOffset = 0;
                    }

                    var indexBufferAllocation = indexBufferManager.allocate(totalNumIndices,
                                                                            (maxIndex < 65536 ? 'USHORT' : 'UINT'));
                    indexBuffer = indexBufferAllocation.indexBuffer;
                    if (!indexBuffer)
                    {
                        return undefined;
                    }

                    shape.indexBufferManager = indexBufferManager;
                    shape.indexBufferAllocation = indexBufferAllocation;

                    if (maxIndex < 65536 &&
                        this.uint16ArrayConstructor)
                    {
                        indexBufferData = new this.uint16ArrayConstructor(totalNumIndices);
                    }
                    else if (this.uint32ArrayConstructor)
                    {
                        indexBufferData = new this.uint32ArrayConstructor(totalNumIndices);
                    }
                    else
                    {
                        indexBufferData = new Array(totalNumIndices);
                    }

                    indexBufferBaseIndex = indexBufferAllocation.baseIndex;
                    indexBufferOffset = 0;
                }

                // Fill index buffers
                for (s in surfaces)
                {
                    if (surfaces.hasOwnProperty(s))
                    {
                        destSurface = shape.surfaces[s];

                        faces = destSurface.faces;
                        delete destSurface.faces;

                        if (faces)
                        {
                            // Vertices already de-indexed (1 index per vert)
                            numIndices = faces.length;

                            //See if they are all sequential, in which case we don't need an index buffer
                            if (!this._isSequentialIndices(faces, numIndices))
                            {
                                destSurface.indexBuffer = indexBuffer;
                                destSurface.numIndices = numIndices;
                                destSurface.first = (indexBufferBaseIndex + indexBufferOffset);
                                destSurface.numVertices = totalNumVertices;

                                indexBufferOffset = this._copyIndexData(indexBufferData,
                                                                        indexBufferOffset,
                                                                        faces,
                                                                        numIndices,
                                                                        baseIndex);
                                if (keepVertexData)
                                {
                                    if (maxIndex < 65536 &&
                                        this.uint16ArrayConstructor)
                                    {
                                        destSurface.indexData = new this.uint16ArrayConstructor(faces);
                                    }
                                    else if (this.uint32ArrayConstructor)
                                    {
                                        destSurface.indexData = new this.uint32ArrayConstructor(faces);
                                    }
                                    else
                                    {
                                        destSurface.indexData = faces;
                                    }
                                }
                            }
                            else
                            {
                                destSurface.first = (baseIndex + faces[0]);
                            }

                            faces = null;

                            if (keepVertexData)
                            {
                                destSurface.vertexData = vertexData;
                            }
                        }
                        else
                        {
                            delete shape.surfaces[s];
                        }
                    }
                }

                if (indexBuffer)
                {
                    indexBuffer.setData(indexBufferData, indexBufferBaseIndex, totalNumIndices);
                    indexBufferData = null;
                }

                //Utilities.log("Buffers creation time: " + (TurbulenzEngine.time - startTime));

                var semanticsHash = semanticsNames.join();
                var semantics = cachedSemantics[semanticsHash];
                if (!semantics)
                {
                    semantics = gd.createSemantics(semanticsNames);
                    cachedSemantics[semanticsHash] = semantics;
                }
                shape.semantics = semantics;

                if (noSurfaces)
                {
                    // TODO: could remove this and always have surfaces
                    surface = shape.surfaces.singleSurface;

                    if (surface)
                    {
                        shape.primitive = surface.primitive;
                        if (keepVertexData)
                        {
                            shape.vertexData = surface.vertexData;
                        }

                        shape.first = surface.first;
                        shape.numVertices = surface.numVertices;

                        if (surface.indexBuffer)
                        {
                            shape.indexBuffer = surface.indexBuffer;
                            shape.numIndices = surface.numIndices;
                            if (keepVertexData)
                            {
                                shape.indexData = surface.indexData;
                            }
                        }
                    }

                    delete shape.surfaces;
                }
            }

            if (inputs.POSITION)
            {
                var positions = sources[inputs.POSITION.source];
                var minPos = positions.min;
                var maxPos = positions.max;
                if (minPos && maxPos)
                {
                    var min0 = minPos[0];
                    var min1 = minPos[1];
                    var min2 = minPos[2];
                    var max0 = maxPos[0];
                    var max1 = maxPos[1];
                    var max2 = maxPos[2];

                    var halfExtents, center;
                    if (min0 !== -max0 || min1 !== -max1 || min2 !== -max2)
                    {
                        if (this.float32ArrayConstructor)
                        {
                            var buffer = new this.float32ArrayConstructor(6);
                            center = buffer.subarray(0, 3);
                            halfExtents = buffer.subarray(3, 6);
                        }
                        else
                        {
                            center = new Array(3);
                            halfExtents = new Array(3);
                        }
                        center[0] = (min0 + max0) * 0.5;
                        center[1] = (min1 + max1) * 0.5;
                        center[2] = (min2 + max2) * 0.5;
                        halfExtents[0] = (max0 - center[0]);
                        halfExtents[1] = (max1 - center[1]);
                        halfExtents[2] = (max2 - center[2]);
                    }
                    else
                    {
                        halfExtents = (this.float32ArrayConstructor ?
                                       new this.float32ArrayConstructor(3) :
                                       new Array(3));
                        halfExtents[0] = (max0 - min0) * 0.5;
                        halfExtents[1] = (max1 - min1) * 0.5;
                        halfExtents[2] = (max2 - min2) * 0.5;
                    }
                    shape.center = center;
                    shape.halfExtents = halfExtents;
                }
                //else
                //{
                    //TODO: add warning that we have no extents information
                //}
            }

            this.shapes[shapeName] = shape;
            shape.name = shapeName;
            shape.reference.subscribeDestroyed(this.onGeometryDestroyed);
        }
        else
        {
            throw "Geometry '" + shapeName + "' already exists in the scene";
        }
        return shape;
    }

    streamShapes(loadParams, postLoadFn)
    {
        // Firstly build an array listing all the shapes we need to load
        var yieldFn = loadParams.yieldFn;
        var scene = this;
        var shapesNamePrefix = loadParams.shapesNamePrefix;
        var sceneData = loadParams.data;
        var fileShapes = sceneData.geometries;
        var loadCustomShapeFn = loadParams.loadCustomShapeFn;

        var shapesToLoad = [];
        var customShapesToLoad = [];

        for (var fileShapeName in fileShapes)
        {
            if (fileShapes.hasOwnProperty(fileShapeName))
            {
                var fileShape = fileShapes[fileShapeName];
                if (fileShape.meta && fileShape.meta.graphics)
                {
                    if (fileShape.meta.custom)
                    {
                        customShapesToLoad.push(fileShapeName);
                    }
                    else
                    {
                        shapesToLoad.push(fileShapeName);
                    }
                }
            }
        }

        var sceneLoadNextShape = function sceneLoadNextShapeFn()
        {
            var nextShape = shapesToLoad.pop();

            var shapeName = (shapesNamePrefix ? (shapesNamePrefix + "-" + nextShape) : nextShape);
            scene.loadShape(shapeName, nextShape, loadParams);

            if (shapesToLoad.length)
            {
                yieldFn(sceneLoadNextShape);
            }
            else
            {
                yieldFn(postLoadFn);
            }
        };

        var sceneLoadNextCustomShape = function sceneLoadNextCustomShapeFn()
        {
            var nextShape = customShapesToLoad.pop();

            var shapeName = (shapesNamePrefix ? (shapesNamePrefix + "-" + nextShape) : nextShape);
            loadCustomShapeFn.call(scene, shapeName, nextShape, loadParams);

            if (customShapesToLoad.length)
            {
                yieldFn(sceneLoadNextCustomShape);
            }
            else if (shapesToLoad.length)
            {
                yieldFn(sceneLoadNextShape);
            }
            else
            {
                yieldFn(postLoadFn);
            }
        };

        if (customShapesToLoad.length)
        {
            yieldFn(sceneLoadNextCustomShape);
        }
        else if (shapesToLoad.length)
        {
            yieldFn(sceneLoadNextShape);
        }
        else
        {
            yieldFn(postLoadFn);
        }
    }

    //
    // Load lights
    //
    loadLights(loadParams)
    {
        var sceneData = loadParams.data;
        var textureManager = loadParams.textureManager;

        if (!loadParams.append)
        {
            this.lights = {};
            this.globalLights = [];
        }

        var fileLights = sceneData.lights;
        var lights = this.lights;
        var globalLights = this.globalLights;
        var materials = this.materials;
        var beget = Utilities.beget;

        var md = loadParams.mathDevice;
        var v3Build = md.v3Build;

        for (var l in fileLights)
        {
            if (fileLights.hasOwnProperty(l) &&
                !lights[l])
            {
                var fileLight = fileLights[l];

                // convert to create parameters
                var lightParams = beget(fileLight);

                var type = fileLight.type;
                if (type === 'directional')
                {
                    lightParams.directional = true;
                }
                else if (type === 'spot')
                {
                    lightParams.spot = true;
                }
                else if (type === 'ambient')
                {
                    lightParams.ambient = true;
                }
                else //if (type === 'point')
                {
                    lightParams.point = true;
                }

                // Convert to MathDevice objects
                lightParams.color = fileLight.color && v3Build.apply(md, fileLight.color);

                lightParams.origin = fileLight.origin && v3Build.apply(md, fileLight.origin);
                lightParams.center = fileLight.center && v3Build.apply(md, fileLight.center);
                lightParams.target = fileLight.target && v3Build.apply(md, fileLight.target);
                lightParams.right =  fileLight.right  && v3Build.apply(md, fileLight.right);
                lightParams.up =     fileLight.up     && v3Build.apply(md, fileLight.up);
                lightParams.start =  fileLight.start  && v3Build.apply(md, fileLight.start);
                lightParams.end =    fileLight.end    && v3Build.apply(md, fileLight.end);
                lightParams.direction = fileLight.direction && v3Build.apply(md, fileLight.direction);

                lightParams.halfExtents = fileLight.halfextents && v3Build.apply(md, fileLight.halfextents);

                var materialName = fileLight.material;
                if (materialName)
                {
                    var material = materials[materialName];
                    if (material)
                    {
                        lightParams.material = material;

                        if (material.effectName)
                        {
                            delete material.effectName;
                            material.loadTextures(textureManager);
                        }
                    }
                }

                var light = Light.create(lightParams);
                lights[l] = light;
                if (light.isGlobal())
                {
                    globalLights.push(light);
                }
            }
        }
    }

    //
    // loadNodes
    //
    loadNodes(loadParams)
    {
        var sceneData = loadParams.data;
        var gd = loadParams.graphicsDevice;
        var textureManager = loadParams.textureManager;
        var effectManager = loadParams.effectManager;
        var baseScene = loadParams.baseScene;
        var keepCameras = loadParams.keepCameras;
        var keepLights = loadParams.keepLights;
        var optimizeHierarchy = loadParams.optimizeHierarchy;
        var optimizeRenderables = loadParams.optimizeRenderables;
        var disableNodes = loadParams.disabled;

        if (!loadParams.append)
        {
            this.clearRootNodes();
            this.staticSpatialMap.clear();
            this.dynamicSpatialMap.clear();
        }

        var loadCustomGeometryInstanceFn = loadParams.loadCustomGeometryInstanceFn;

        var md = this.md;
        var m43Build = md.m43Build;
        var materials = this.materials;
        var lights = this.lights;
        var currentScene = this;

        var baseMaterials;
        if (baseScene)
        {
            baseMaterials = baseScene.materials;
        }
        var baseMatrix = loadParams.baseMatrix;
        var nodesNamePrefix = loadParams.nodesNamePrefix;
        var shapesNamePrefix = loadParams.shapesNamePrefix;

        function optimizeNode(parent, child)
        {
            function matrixIsIdentity(matrix)
            {
                var abs = Math.abs;
                return (abs(1.0 - matrix[0]) < 1e-5 &&
                        abs(0.0 - matrix[1]) < 1e-5 &&
                        abs(0.0 - matrix[2]) < 1e-5 &&
                        abs(0.0 - matrix[3]) < 1e-5 &&
                        abs(1.0 - matrix[4]) < 1e-5 &&
                        abs(0.0 - matrix[5]) < 1e-5 &&
                        abs(0.0 - matrix[6]) < 1e-5 &&
                        abs(0.0 - matrix[7]) < 1e-5 &&
                        abs(1.0 - matrix[8]) < 1e-5 &&
                        abs(0.0 - matrix[9]) < 1e-5 &&
                        abs(0.0 - matrix[10]) < 1e-5 &&
                        abs(0.0 - matrix[11]) < 1e-5);
            }

            if ((!child.camera || !parent.camera) &&
                child.disabled === parent.disabled &&
                child.dynamic === parent.dynamic &&
                child.kinematic === parent.kinematic &&
                (!child.local || matrixIsIdentity(child.local)))
            {
                if (child.renderables)
                {
                    parent.addRenderableArray(child.renderables);
                }

                if (child.lightInstances)
                {
                    parent.addLightInstanceArray(child.lightInstances);
                }

                if (child.camera)
                {
                    parent.camera = child.camera;
                }

                var grandChildren = child.children;
                if (grandChildren)
                {
                    var n;
                    var numGrandChildren = grandChildren;
                    for (n = 0; n < numGrandChildren; n += 1)
                    {
                        if (!optimizeNode(parent, child))
                        {
                            parent.addChild(child);
                        }
                    }
                }
                return true;
            }

            return false;
        }

        var copyNode = function copyNodeFn(nodeName, parentNodePath,
                                           baseNode, materialSkin)
        {
            var nodePath = parentNodePath ? (parentNodePath + "/" + nodeName) : nodeName;

            var node = SceneNode.create({name: nodeName,
                                         local: this.matrix &&
                                         m43Build.apply(md, this.matrix),
                                         dynamic: this.dynamic || baseNode.dynamic || loadParams.dynamic});

            var effect;

            var customgeometryinstance = this.customgeometryinstances;
            if (customgeometryinstance && loadCustomGeometryInstanceFn)
            {
                for (var ci in customgeometryinstance)
                {
                    if (customgeometryinstance.hasOwnProperty(ci))
                    {
                        var fileCustomGeometryInstance = customgeometryinstance[ci];
                        var customGeometryInstance = loadCustomGeometryInstanceFn.call(currentScene, fileCustomGeometryInstance, loadParams);

                        if (customGeometryInstance)
                        {
                            node.addRenderable(customGeometryInstance);
                        }
                    }
                }
            }

            var geometryinstances = this.geometryinstances;
            if (geometryinstances)
            {
                for (var gi in geometryinstances)
                {
                    if (geometryinstances.hasOwnProperty(gi))
                    {
                        var fileGeometryInstance = geometryinstances[gi];
                        var fileShapeName = fileGeometryInstance.geometry;
                        var shapeName = (shapesNamePrefix ? (shapesNamePrefix + "-" + fileShapeName) : fileShapeName);

                        // If the geometry has already been loaded,
                        // use that, otherwise attempt to load it from
                        // the current set of parameters.

                        var nodeShape = currentScene.shapes[shapeName];
                        if (!nodeShape)
                        {
                            nodeShape = currentScene.loadShape(shapeName,
                                                               fileShapeName,
                                                               loadParams);
                        }

                        if (gd)
                        {
                            var sharedMaterialName = fileGeometryInstance.material;
                            if (materialSkin && sceneData.skins)
                            {
                                var skin = sceneData.skins[materialSkin];
                                if (skin)
                                {
                                    var newMaterialName = skin[sharedMaterialName];
                                    if (newMaterialName)
                                    {
                                        sharedMaterialName = newMaterialName;
                                    }
                                }
                            }
                            var sharedMaterial = materials[sharedMaterialName];
                            if (!sharedMaterial)
                            {
                                if (baseMaterials)
                                {
                                    sharedMaterial = baseMaterials[sharedMaterialName];
                                }

                                if (!sharedMaterial)
                                {
                                    //Utilities.log("Unknown material '" + sharedMaterialName + "'");
                                    return undefined;
                                }
                                materials[sharedMaterialName] = sharedMaterial;
                                sharedMaterial.name = sharedMaterialName;
                                sharedMaterial.reference.subscribeDestroyed(currentScene.onMaterialDestroyed);
                            }
                            effect = sharedMaterial.effect;
                            if (!effect)
                            {
                                // Load the textures since if the effect is undefined then scene.loadMaterial
                                // has not yet been called for this material
                                sharedMaterial.loadTextures(textureManager);
                                var effectName = sharedMaterial.effectName;
                                delete sharedMaterial.effectName;
                                effect = effectManager.get(effectName);
                                if (effect)
                                {
                                    effect.prepareMaterial(sharedMaterial);
                                }
                            }

                            var surfaces = nodeShape.surfaces;
                            var surface = (surfaces ? surfaces[fileGeometryInstance.surface] : nodeShape);

                            var geometryInstance = GeometryInstance.create(nodeShape,
                                                                           surface,
                                                                           sharedMaterial);
                            node.addRenderable(geometryInstance);

                            if (fileGeometryInstance.disabled)
                            {
                                geometryInstance.disabled = true;
                            }

                        }
                        else
                        {
                            // TODO: TSC complains about this,
                            // apparenty for good reason.
                            node.addRenderable(
                                GeometryInstance.create(nodeShape,
                                                        null, // Surface
                                                        null // Material
                                                       )
                            );
                        }
                    }
                }
            }

            // Check for a camera on the node
            if (this.camera)
            {
                if (keepCameras)
                {
                    node.camera = this.camera;
                }
            }

            // Check for any instances of lights attached to the node
            var fileLightInstances = this.lightinstances;
            if (fileLightInstances && keepLights)
            {
                for (var li in fileLightInstances)
                {
                    if (fileLightInstances.hasOwnProperty(li))
                    {
                        var fileLightInstance = fileLightInstances[li];
                        var light = lights[fileLightInstance.light];
                        if (light && !light.global)
                        {
                            var lightInstance = LightInstance.create(light);
                            node.addLightInstance(lightInstance);
                            if (fileLightInstance.disabled)
                            {
                                lightInstance.disabled = true;
                            }
                        }
                    }
                }
            }

            if (this.reference)
            {
                alert("Found unresolved node reference during scene loading");
            }

            if (this.kinematic || baseNode.kinematic)
            {
                node.kinematic = true;
            }

            if ((this.disabled || baseNode.disabled) && (disableNodes !== false))
            {
                node.disabled = true;
            }

            var fileChildren = this.nodes;
            if (fileChildren)
            {
                for (var c in fileChildren)
                {
                    if (fileChildren.hasOwnProperty(c))
                    {
                        if (!node.findChild(c))
                        {
                            var child = copyNode.call(
                                fileChildren[c], c, nodePath, node,
                                this.skin || materialSkin);
                            if (child)
                            {
                                if (!optimizeHierarchy ||
                                    !optimizeNode(node, child))
                                {
                                    node.addChild(child);
                                }
                            }
                        }
                    }
                }
            }

            if (optimizeRenderables)
            {
                if (node.renderables &&
                    1 < node.renderables.length)
                {
                    currentScene._optimizeRenderables(node, gd);
                }
            }

            return node;
        };

        var fileNodes = sceneData.nodes;
        var parentNode = loadParams.parentNode;

        var emptyNode = {};
        for (var fn in fileNodes)
        {
            if (fileNodes.hasOwnProperty(fn))
            {
                var fileNode = fileNodes[fn];
                var nodeName = fn;
                var nodePath = (nodesNamePrefix ? (nodesNamePrefix + "/" + fn) : fn);
                var overloadedNode = currentScene.findNode(nodePath); //If a node with the same name exist already we update that.

                var node = copyNode.call(fileNode,
                                         nodeName,
                                         nodesNamePrefix,
                                         (overloadedNode || parentNode || emptyNode),
                                         fileNode.skin || loadParams.materialSkin);
                if (node)
                {
                    if (parentNode && !overloadedNode)
                    {
                        parentNode.addChild(node);
                    }

                    if (baseMatrix)
                    {
                        if (node.local)
                        {
                            node.setLocalTransform(md.m43Mul(node.getLocalTransform(), baseMatrix));
                        }
                        else
                        {
                            node.setLocalTransform(baseMatrix);
                        }
                    }
                    else
                    {
                        if (!node.local)
                        {
                            node.setLocalTransform(md.m43BuildIdentity());
                        }
                    }

                    if (disableNodes)
                    {
                        node.enableHierarchy(false);
                    }

                    if (overloadedNode)
                    {
                        debug.log("Overloading existing node '" + nodePath + "'");

                        var overloadedMatrix = overloadedNode.local;
                        if (overloadedMatrix && node.local)
                        {
                            node.local = md.m43Mul(node.local, overloadedMatrix);
                            overloadedNode.setLocalTransform(node.local);
                            delete node.local;
                        }

                        var overloadedChildren = overloadedNode.children;
                        if (overloadedChildren && node.children)
                        {
                            //Utilities.log("Concat children of node '" + nodePath + "'");
                            while (node.children.length)
                            {
                                var child = node.children[0];
                                if (!overloadedNode.findChild(child.name))
                                {
                                    overloadedNode.addChild(child);
                                }
                                node.removeChild(child);
                            }
                        }

                        for (var on in node)
                        {   //TODO: This really doesn't work other than simple objects....
                            if (node.hasOwnProperty(on))
                            {
                                overloadedNode[on] = node[on];
                            }
                        }
                        node = null;
                    }
                    else if (!parentNode)
                    {
                        this.addRootNode(node);
                    }
                }
            }
        }
    }

    //
    // loadAreas
    //
    loadAreas(loadParams)
    {
        var sceneData = loadParams.data;

        var fileAreas = sceneData.areas;
        if (!fileAreas)
        {
            return;
        }

        var numFileAreas = fileAreas.length;
        if (numFileAreas <= 0)
        {
            return;
        }

        if (!loadParams.append)
        {
            delete this.areas;
        }

        var areas = this.areas;
        if (!areas)
        {
            areas = [];
            this.areas = areas;
        }

        var nodesNamePrefix = loadParams.nodesNamePrefix;
        var md = this.md;
        var planeNormalize = this.planeNormalize;
        var baseIndex = areas.length;

        var maxValue = Number.MAX_VALUE;
        var buffer, bufferIndex;

        for (var fa = 0; fa < numFileAreas; fa += 1)
        {
            var fileArea = fileAreas[fa];

            var targetName = fileArea.target;
            if (nodesNamePrefix)
            {
                targetName = (nodesNamePrefix + "/" + targetName);
            }
            var target = this.findNode(targetName);
            if (!target)
            {
                //Utilities.log("Missing target: " + targetName);
                baseIndex -= 1;
                continue;
            }

            var matrix = target.getWorldTransform();
            var m0 = matrix[0];
            var m1 = matrix[1];
            var m2 = matrix[2];
            var m3 = matrix[3];
            var m4 = matrix[4];
            var m5 = matrix[5];
            var m6 = matrix[6];
            var m7 = matrix[7];
            var m8 = matrix[8];
            var m9 = matrix[9];
            var m10 = matrix[10];
            var m11 = matrix[11];

            var minAreaX = maxValue;
            var minAreaY = maxValue;
            var minAreaZ = maxValue;
            var maxAreaX = -maxValue;
            var maxAreaY = -maxValue;
            var maxAreaZ = -maxValue;

            var filePortals = fileArea.portals;
            var numFilePortals = filePortals.length;
            var portals = [];
            var filePortal, filePoints, points, numPoints, np, filePoint;
            var areaExtents;

            if (this.float32ArrayConstructor)
            {
                buffer = new this.float32ArrayConstructor(6 + (numFilePortals * (6 + 3 + 4)));
                bufferIndex = 0;

                areaExtents = buffer.subarray(bufferIndex, (bufferIndex + 6));
                bufferIndex += 6;
            }
            else
            {
                areaExtents = new Array(6);
            }

            for (var fp = 0; fp < numFilePortals; fp += 1)
            {
                var minX = maxValue;
                var minY = maxValue;
                var minZ = maxValue;
                var maxX = -maxValue;
                var maxY = -maxValue;
                var maxZ = -maxValue;
                var c0 = 0;
                var c1 = 0;
                var c2 = 0;
                filePortal = filePortals[fp];
                filePoints = filePortal.points;
                numPoints = filePoints.length;
                points = [];
                for (np = 0; np < numPoints; np += 1)
                {
                    filePoint = filePoints[np];
                    var fp0 = filePoint[0];
                    var fp1 = filePoint[1];
                    var fp2 = filePoint[2];
                    var p0 = (m0 * fp0 + m3 * fp1 + m6 * fp2 + m9);
                    var p1 = (m1 * fp0 + m4 * fp1 + m7 * fp2 + m10);
                    var p2 = (m2 * fp0 + m5 * fp1 + m8 * fp2 + m11);
                    if (p0 < minX) { minX = p0; }
                    if (p1 < minY) { minY = p1; }
                    if (p2 < minZ) { minZ = p2; }
                    if (p0 > maxX) { maxX = p0; }
                    if (p1 > maxY) { maxY = p1; }
                    if (p2 > maxZ) { maxZ = p2; }
                    c0 += p0;
                    c1 += p1;
                    c2 += p2;
                    points.push(md.v3Build(p0, p1, p2));
                }
                if (minX < minAreaX) { minAreaX = minX; }
                if (minY < minAreaY) { minAreaY = minY; }
                if (minZ < minAreaZ) { minAreaZ = minZ; }
                if (maxX > maxAreaX) { maxAreaX = maxX; }
                if (maxY > maxAreaY) { maxAreaY = maxY; }
                if (maxZ > maxAreaZ) { maxAreaZ = maxZ; }
                var normal = md.v3Cross(md.v3Sub(points[1], points[0]), md.v3Sub(points[2], points[0]));

                var portalExtents, portalOrigin, portalPlane;
                if (this.float32ArrayConstructor)
                {
                    portalExtents = buffer.subarray(bufferIndex, (bufferIndex + 6));
                    bufferIndex += 6;
                    portalOrigin = buffer.subarray(bufferIndex, (bufferIndex + 3));
                    bufferIndex += 3;
                    portalPlane = buffer.subarray(bufferIndex, (bufferIndex + 4));
                    bufferIndex += 4;
                }
                else
                {
                    portalExtents = new Array(6);
                    portalOrigin = new Array(3);
                    portalPlane = new Array(4);
                }
                portalExtents[0] = minX;
                portalExtents[1] = minY;
                portalExtents[2] = minZ;
                portalExtents[3] = maxX;
                portalExtents[4] = maxY;
                portalExtents[5] = maxZ;

                portalOrigin[0] = (c0 / numPoints);
                portalOrigin[1] = (c1 / numPoints);
                portalOrigin[2] = (c2 / numPoints);

                portalPlane = planeNormalize(normal[0], normal[1], normal[2], md.v3Dot(normal, points[0]), portalPlane);

                var portal = {
                    area: (baseIndex + filePortal.area),
                    points: points,
                    origin: portalOrigin,
                    extents: portalExtents,
                    plane: portalPlane
                };
                portals.push(portal);
            }

            areaExtents[0] = minAreaX;
            areaExtents[1] = minAreaY;
            areaExtents[2] = minAreaZ;
            areaExtents[3] = maxAreaX;
            areaExtents[4] = maxAreaY;
            areaExtents[5] = maxAreaZ;

            var area = {
                target: target,
                portals: portals,
                extents: areaExtents,
                externalNodes: null
            };
            areas.push(area);
        }

        // Keep bsp tree
        var fileBspNodes = sceneData.bspnodes;
        var numBspNodes = fileBspNodes.length;
        var bspNodes = [];
        bspNodes.length = numBspNodes;
        this.bspNodes = bspNodes;

        if (this.float32ArrayConstructor)
        {
            buffer = new this.float32ArrayConstructor(4 * numBspNodes);
            bufferIndex = 0;
        }

        for (var bn = 0; bn < numBspNodes; bn += 1)
        {
            var fileBspNode = fileBspNodes[bn];
            var plane = fileBspNode.plane;
            var nodePlane;
            if (this.float32ArrayConstructor)
            {
                nodePlane = buffer.subarray(bufferIndex, (bufferIndex + 4));
                bufferIndex += 4;
            }
            else
            {
                nodePlane = new Array(4);
            }
            nodePlane[0] = plane[0];
            nodePlane[1] = plane[1];
            nodePlane[2] = plane[2];
            nodePlane[3] = -plane[3];
            bspNodes[bn] = {
                    plane: nodePlane,
                    pos: fileBspNode.pos,
                    neg: fileBspNode.neg
                };
        }
    }

    //
    // load
    //
    load(loadParams)
    {
        var scene = this;

        if (!loadParams.append)
        {
            this.clearShapes();
            this.semantics = <Semantics><any>{}; // TODO: null?
        }

        var sceneCompleteLoadStage = function sceneCompleteLoadStageFn()
        {
            if (loadParams.keepLights)
            {
                scene.loadLights(loadParams);
            }

            scene.loadNodes(loadParams);

            if (loadParams.physicsManager)
            {
                loadParams.physicsManager.loadNodes(loadParams, scene);
            }

            scene.loadAreas(loadParams);

            scene.endLoading(loadParams.onload);
        };

        if (loadParams.graphicsDevice)
        {
            this.loadMaterials(loadParams);
        }

        // Needs to be called before the geometry is loaded by loadNodes or streamShapes
        scene.loadSkeletons(loadParams);

        var yieldFn = loadParams.yieldFn;
        if (yieldFn)
        {
            var streamNodesStage = function sceneStreamNodesStage()
            {
                scene.streamShapes(loadParams, sceneCompleteLoadStage);
            };
            yieldFn(streamNodesStage);
        }
        else
        {
            sceneCompleteLoadStage();
        }
    }

    planeNormalize(a, b, c, d, dst?)
    {
        var res = dst;
        if (!res)
        {
            /*jshint newcap: false*/
            var float32ArrayConstructor = Scene.prototype.float32ArrayConstructor;
            res = (float32ArrayConstructor ?
                   new float32ArrayConstructor(4) :
                   new Array(4));
            /*jshint newcap: true*/
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

    isInsidePlanesAABB(extents, planes) : boolean
    {
        var n0 = extents[0];
        var n1 = extents[1];
        var n2 = extents[2];
        var p0 = extents[3];
        var p1 = extents[4];
        var p2 = extents[5];
        var numPlanes = planes.length;
        var n = 0;
        do
        {
            var plane = planes[n];
            var d0 = plane[0];
            var d1 = plane[1];
            var d2 = plane[2];
            if ((d0 * (d0 < 0 ? n0 : p0) + d1 * (d1 < 0 ? n1 : p1) + d2 * (d2 < 0 ? n2 : p2)) < plane[3])
            {
                return false;
            }
            n += 1;
        }
        while (n < numPlanes);
        return true;
    }

    isFullyInsidePlanesAABB(extents, planes) : boolean
    {
        var n0 = extents[0];
        var n1 = extents[1];
        var n2 = extents[2];
        var p0 = extents[3];
        var p1 = extents[4];
        var p2 = extents[5];
        var numPlanes = planes.length;
        var n = 0;
        do
        {
            var plane = planes[n];
            var d0 = plane[0];
            var d1 = plane[1];
            var d2 = plane[2];
            if ((d0 * (d0 > 0 ? n0 : p0) + d1 * (d1 > 0 ? n1 : p1) + d2 * (d2 > 0 ? n2 : p2)) < plane[3])
            {
                return false;
            }
            n += 1;
        }
        while (n < numPlanes);
        return true;
    }

    extractFrustumPlanes(camera) : any[]
    {
        var planeNormalize = this.planeNormalize;
        var m = camera.viewProjectionMatrix;
        var m0 = m[0];
        var m1 = m[1];
        var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];
        var m6 = m[6];
        var m7 = m[7];
        var m8 = m[8];
        var m9 = m[9];
        var m10 = m[10];
        var m11 = m[11];
        var m12 = m[12];
        var m13 = m[13];
        var m14 = m[14];
        var m15 = m[15];
        var planes = this.frustumPlanes;

        // Negate 'd' here to avoid doing it on the isVisible functions
        planes[0] = planeNormalize((m3 + m0), (m7 + m4), (m11 + m8), -(m15 + m12), planes[0]); // left
        planes[1] = planeNormalize((m3 - m0), (m7 - m4), (m11 - m8), -(m15 - m12), planes[1]); // right
        planes[2] = planeNormalize((m3 - m1), (m7 - m5), (m11 - m9), -(m15 - m13), planes[2]); // top
        planes[3] = planeNormalize((m3 + m1), (m7 + m5), (m11 + m9), -(m15 + m13), planes[3]); // bottom

        if (this.areas)
        {
            if (planes.length > 4)
            {
                planes.length = 4;
            }
        }
        else
        {
            planes[4] = planeNormalize((m3 - m2), (m7 - m6), (m11 - m10), -(m15 - m14), planes[4]); // far
        }

        this.nearPlane = planeNormalize((m3 + m2), (m7 + m6), (m11 + m10), -(m15 + m14), this.nearPlane);  // near

        return planes;
    }

    //
    // calculateHullScreenExtents
    //
    calculateHullScreenExtents(polygons, screenExtents)
    {
        // Sutherland-Hodgman polygon clipping algorithm
        var clipLine = function clipLineFn(va, vb, axis, positive, out)
        {
            var a = va[axis];
            var b = vb[axis];
            var aw = va[3];
            var bw = vb[3];
            var t = 0.0;
            var bInside = true;
            if (positive)
            {
                if (a > aw)
                {
                    if (b <= bw)
                    {
                        if (b < bw)
                        {
                            t = ((aw - a) / ((b - a) - (bw - aw)));
                        }
                    }
                    else
                    {
                        // both out
                        return;
                    }
                }
                else if (b > bw)
                {
                    if (a < aw)
                    {
                        t = ((aw - a) / ((b - a) - (bw - aw)));
                    }
                    bInside = false;
                }
            }
            else
            {
                if (a < -aw)
                {
                    if (b >= -bw)
                    {
                        if (b > -bw)
                        {
                            t = ((- aw - a) / ((b - a) + (bw - aw)));
                        }
                    }
                    else
                    {
                        // both out
                        return;
                    }
                }
                else if (b < -bw)
                {
                    if (a > -aw)
                    {
                        t = ((- aw - a) / ((b - a) + (bw - aw)));
                    }
                    bInside = false;
                }
            }

            if (t > 0.0)
            {
                var ax = va[0];
                var ay = va[1];
                var az = va[2];
                var bx = vb[0];
                var by = vb[1];
                var bz = vb[2];
                out.push([ (ax + (t * (bx - ax))),
                           (ay + (t * (by - ay))),
                           (az + (t * (bz - az))),
                           (aw + (t * (bw - aw))) ]);
            }

            if (bInside)
            {
                out.push(vb);
            }
        };

        var minX =  1.0;
        var maxX = -1.0;
        var minY =  1.0;
        var maxY = -1.0;

        var numPolygons = polygons.length;
        for (var n = 0; n < numPolygons; n += 1)
        {
            var points = polygons[n];
            var numPoints, p, a, b, out;
            for (var positive = 0; positive < 2; positive += 1)
            {
                for (var axis = 0; axis < 3; axis += 1)
                {
                    numPoints = points.length;
                    if (!numPoints)
                    {
                        break;
                    }
                    out = [];
                    for (p = 0; p < numPoints; p += 1)
                    {
                        if (p < 1)
                        {
                            a = points[numPoints - 1];
                        }
                        else
                        {
                            a = points[p - 1];
                        }
                        b = points[p];
                        clipLine(a, b, axis, positive, out);
                    }
                    points = out;
                }
            }

            numPoints = points.length;
            for (p = 0; p < numPoints; p += 1)
            {
                a = points[p];
                var ax = a[0];
                var ay = a[1];
                var aw = a[3];
                if (aw === 0)
                {
                    ax = (ax >= 0 ? 1 : -1);
                    ay = (ay >= 0 ? 1 : -1);
                }
                else
                {
                    var rcpa = 1.0 / aw;
                    ax *= rcpa;
                    ay *= rcpa;
                }
                if (minX > ax)
                {
                    minX = ax;
                }
                if (maxX < ax)
                {
                    maxX = ax;
                }
                if (minY > ay)
                {
                    minY = ay;
                }
                if (maxY < ay)
                {
                    maxY = ay;
                }
            }
        }

        if (minX >= maxX || minY >= maxY)
        {
            return undefined;
        }

        if (minX < -1.0)
        {
            minX = -1.0;
        }
        if (maxX > 1.0)
        {
            maxX = 1.0;
        }
        if (minY < -1.0)
        {
            minY = -1.0;
        }
        if (maxY > 1.0)
        {
            maxY = 1.0;
        }

        if (!screenExtents)
        {
            screenExtents = (this.float32ArrayConstructor ?
                             new this.float32ArrayConstructor(4) :
                             new Array(4));
        }
        screenExtents[0] = minX;
        screenExtents[1] = minY;
        screenExtents[2] = maxX;
        screenExtents[3] = maxY;
        return screenExtents;
    }

    //
    // calculateLightsScreenExtents
    //
    calculateLightsScreenExtents(camera)
    {
        var visibleLights = this.visibleLights;
        var numVisibleLights = visibleLights.length;
        if (numVisibleLights > 0)
        {
            var matrix, transform, halfExtents, center, hx, hy, hz, p0, p1, p2, p3, p4, p5, p6, p7, st, polygons;
            var lightInstance, light, worldViewProjectionMatrix;
            var viewProjectionMatrix = camera.viewProjectionMatrix;
            var calculateHullScreenExtents = this.calculateHullScreenExtents;
            var md = this.md;
            var m44Transform = md.m44Transform;
            var m43MulM44 = md.m43MulM44;
            var v4Build = md.v4Build;
            var spotA = v4Build.call(md, -1, -1, 1, 1);
            var spotB = v4Build.call(md,  1, -1, 1, 1);
            var spotC = v4Build.call(md, -1,  1, 1, 1);
            var spotD = v4Build.call(md,  1,  1, 1, 1);
            var n = 0;
            do
            {
                lightInstance = visibleLights[n];
                light = lightInstance.light;
                if (light)
                {
                    if (light.global)
                    {
                        continue;
                    }

                    matrix = lightInstance.node.world;

                    if (light.spot)
                    {
                        transform = md.m33MulM43(light.frustum, matrix, transform);

                        worldViewProjectionMatrix = m43MulM44.call(md, transform, viewProjectionMatrix, worldViewProjectionMatrix);

                        p0 = m44Transform.call(md, worldViewProjectionMatrix, spotA, p0);
                        p1 = m44Transform.call(md, worldViewProjectionMatrix, spotB, p1);
                        p2 = m44Transform.call(md, worldViewProjectionMatrix, spotC, p2);
                        p3 = m44Transform.call(md, worldViewProjectionMatrix, spotD, p3);

                        st = v4Build.call(md, matrix[9], matrix[10], matrix[11], 1, st);
                        st = m44Transform.call(md, viewProjectionMatrix, st, st);

                        polygons = [ [st, p0, p1],
                                     [st, p1, p3],
                                     [st, p2, p0],
                                     [st, p3, p2],
                                     [p2, p3, p1, p0]];
                    }
                    else
                    {
                        halfExtents = light.halfExtents;
                        if (!light.fog)
                        {
                            center = light.center;
                            if (center)
                            {
                                matrix = transform = md.m43Offset(matrix, center, transform);
                            }
                        }

                        hx = halfExtents[0];
                        hy = halfExtents[1];
                        hz = halfExtents[2];

                        worldViewProjectionMatrix = m43MulM44.call(md, matrix, viewProjectionMatrix, worldViewProjectionMatrix);

                        p0 = m44Transform.call(md, worldViewProjectionMatrix, v4Build.call(md, - hx, - hy, - hz, 1, p0), p0);
                        p1 = m44Transform.call(md, worldViewProjectionMatrix, v4Build.call(md, + hx, - hy, - hz, 1, p1), p1);
                        p2 = m44Transform.call(md, worldViewProjectionMatrix, v4Build.call(md, + hx, - hy, + hz, 1, p2), p2);
                        p3 = m44Transform.call(md, worldViewProjectionMatrix, v4Build.call(md, - hx, - hy, + hz, 1, p3), p3);
                        p4 = m44Transform.call(md, worldViewProjectionMatrix, v4Build.call(md, - hx, + hy, - hz, 1, p4), p4);
                        p5 = m44Transform.call(md, worldViewProjectionMatrix, v4Build.call(md, + hx, + hy, - hz, 1, p5), p5);
                        p6 = m44Transform.call(md, worldViewProjectionMatrix, v4Build.call(md, + hx, + hy, + hz, 1, p6), p6);
                        p7 = m44Transform.call(md, worldViewProjectionMatrix, v4Build.call(md, - hx, + hy, + hz, 1, p7), p7);

                        polygons = [ [p3, p2, p1, p0],
                                     [p4, p5, p6, p7],
                                     [p0, p1, p5, p4],
                                     [p7, p6, p2, p3],
                                     [p4, p7, p3, p0],
                                     [p1, p2, p6, p5] ];
                    }

                    lightInstance.screenExtents = calculateHullScreenExtents(polygons, lightInstance.screenExtents);
                }

                n += 1;
            }
            while (n < numVisibleLights);
        }
    }

    //
    // destroy
    //
    destroy()
    {
        this.clear();
        if (this.vertexBufferManager)
        {
            this.vertexBufferManager.destroy();
            delete this.vertexBufferManager;
        }
        if (this.indexBufferManager)
        {
            this.indexBufferManager.destroy();
            delete this.indexBufferManager;
        }
    }

    getQueryCounter()
    {
        var queryCounter = this.queryCounter;
        this.queryCounter = (queryCounter + 1);
        return queryCounter;
    }

    // Constructor function
    static create(mathDevice: MathDevice, staticSpatialMap?: SpatialMap, dynamicSpatialMap?: SpatialMap) : Scene
    {
        return new Scene(mathDevice, staticSpatialMap, dynamicSpatialMap);
    }

}

// Detect correct typed arrays
(function () {
    var testArray, textDescriptor;
    if (typeof Uint16Array !== "undefined")
    {
        testArray = new Uint16Array(4);
        textDescriptor = Object.prototype.toString.call(testArray);
        if (textDescriptor === '[object Uint16Array]')
        {
            Scene.prototype.uint16ArrayConstructor = Uint16Array;
        }
    }
    if (typeof Uint32Array !== "undefined")
    {
        testArray = new Uint32Array(4);
        textDescriptor = Object.prototype.toString.call(testArray);
        if (textDescriptor === '[object Uint32Array]')
        {
            Scene.prototype.uint32ArrayConstructor = Uint32Array;
        }
    }
    if (typeof Float32Array !== "undefined")
    {
        testArray = new Float32Array(4);
        textDescriptor = Object.prototype.toString.call(testArray);
        if (textDescriptor === '[object Float32Array]')
        {
            Scene.prototype.float32ArrayConstructor = Float32Array;
        }
    }
}());
