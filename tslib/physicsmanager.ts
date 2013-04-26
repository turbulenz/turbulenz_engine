// Copyright (c) 2010-2013 Turbulenz Limited

/*global Utilities: false */
/*global SceneNode: false */

/// <reference path="turbulenz.d.ts" />
/// <reference path="scenenode.ts" />

// TODO: Does this inherit from some base Node?
interface PhysicsNode
{
    target         : SceneNode;
    body           : PhysicsCollisionObject;

    origin?        : any; // v3
    triangleArray? : any; // number[] or Float32Array
    dynamic?       : bool;
    kinematic?     : bool;

    worldUpdate?   : any;
};

//
// physicsmanager
//
class PhysicsManager
{
    static version = 1;
    arrayConstructor: any;  // on prototype

    mathsDevice: MathDevice;
    physicsDevice: PhysicsDevice;
    dynamicsWorld: PhysicsWorld;

    physicsNodes: PhysicsNode[];
    dynamicPhysicsNodes: PhysicsNode[];
    kinematicPhysicsNodes: PhysicsNode[];

    tempMatrix: any; // m43

    sceneNodeCloned: { (data): void; };
    sceneNodeDestroyed: { (data): void; };

    //
    // update
    //
    update()
    {
        var mathsDevice = this.mathsDevice;

        // Dynamic nodes
        var physicsNodes = this.dynamicPhysicsNodes;
        var numPhysicsNodes = physicsNodes.length;
        var physicsNode, body, target, worldMatrix, origin, n;
        if (numPhysicsNodes > 0)
        {
            for (n = 0; n < numPhysicsNodes; n += 1)
            {
                physicsNode = physicsNodes[n];
                body = physicsNode.body;
                if (body.active)
                {
                    target = physicsNode.target;
                    if (target.disabled)
                    {
                        continue;
                    }

                    if (target.parent)
                    {
                        debug.abort("Rigid bodies with parent nodes are unsupported");
                        //Not really possible, since the child can become inactive (frozen) and therefore it will
                        /*var parentWorld = target.parent.getWorldTransform();
                        var inverseParent = mathsDevice.m43Inverse(parentWorld);
                        var newLocal = mathsDevice.m43Mul(worldMatrix, inverseParent);
                        target.setLocalTransform(newLocal);*/
                    }
                    else
                    {
                        worldMatrix = target.getLocalTransform();
                        body.calculateTransform(worldMatrix, physicsNode.origin);
                        target.setLocalTransform(worldMatrix);
                    }
                }
            }
        }

        // Kinematic nodes
        var tempMatrix = this.tempMatrix;
        physicsNodes = this.kinematicPhysicsNodes;
        numPhysicsNodes = physicsNodes.length;
        for (n = 0; n < numPhysicsNodes; n += 1)
        {
            physicsNode = physicsNodes[n];
            target = physicsNode.target;
            if (target.disabled)
            {
                continue;
            }

            if (target.worldUpdate !== physicsNode.worldUpdate)
            {
                physicsNode.worldUpdate = target.worldUpdate;
                worldMatrix = target.getWorldTransform();
                origin = physicsNode.origin;
                if (origin)
                {
                    // The physics API copies the matrix instead of referencing it
                    // so it is safe to share a temp one
                    physicsNode.body.transform = mathsDevice.m43Offset(worldMatrix, origin, tempMatrix);
                }
                else
                {
                    physicsNode.body.transform = worldMatrix;
                }
            }
        }
    };

    //
    // enableNode
    //
    enableNode(sceneNode, enabled)
    {
        var physicsNodes = sceneNode.physicsNodes;

        if (physicsNodes)
        {
            var dynamicsWorld = this.dynamicsWorld;
            var numPhysicsNodes = physicsNodes.length;
            for (var p = 0; p < numPhysicsNodes; p += 1)
            {
                var physicsNode = physicsNodes[p];
                var body = physicsNode.body;
                if (body)
                {
                    if (physicsNode.kinematic)
                    {
                        if (enabled)
                        {
                            dynamicsWorld.addCollisionObject(body);
                        }
                        else
                        {
                            dynamicsWorld.removeCollisionObject(body);
                        }
                    }
                    else if (physicsNode.dynamic)
                    {
                        if (enabled)
                        {
                            dynamicsWorld.addRigidBody(body);
                        }
                        else
                        {
                            dynamicsWorld.removeRigidBody(body);
                        }
                    }
                    else
                    {
                        if (enabled)
                        {
                            dynamicsWorld.addCollisionObject(body);
                        }
                        else
                        {
                            dynamicsWorld.removeCollisionObject(body);
                        }
                    }
                }
            }
        }
    };

    //
    // enableHierarchy
    //
    enableHierarchy(sceneNode, enabled)
    {
        this.enableNode(sceneNode, enabled);

        var children = sceneNode.children;
        if (children)
        {
            var numChildren = children.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                this.enableHierarchy(children[c], enabled);
            }
        }
    };

    //
    // deletePhysicsNode
    //
    deletePhysicsNode(physicsNode)
    {
        var physicsNodes = this.physicsNodes;
        var numPhysicsNodes = physicsNodes.length;
        var n;
        for (n = 0; n < numPhysicsNodes; n += 1)
        {
            if (physicsNodes[n] === physicsNode)
            {
                physicsNodes.splice(n, 1);
                break;
            }
        }

        physicsNodes = this.dynamicPhysicsNodes;
        numPhysicsNodes = physicsNodes.length;
        for (n = 0; n < numPhysicsNodes; n += 1)
        {
            if (physicsNodes[n] === physicsNode)
            {
                physicsNodes.splice(n, 1);
                break;
            }
        }

        physicsNodes = this.kinematicPhysicsNodes;
        numPhysicsNodes = physicsNodes.length;
        for (n = 0; n < numPhysicsNodes; n += 1)
        {
            if (physicsNodes[n] === physicsNode)
            {
                physicsNodes.splice(n, 1);
                break;
            }
        }
    };

    //
    // deleteNode
    //
    deleteNode(sceneNode)
    {
        var physicsNodes = sceneNode.physicsNodes;
        if (physicsNodes)
        {
            var physicsDevice = this.physicsDevice;
            var dynamicsWorld = this.dynamicsWorld;
            if (physicsDevice && dynamicsWorld)
            {
                var numPhysicsNodes = physicsNodes.length;
                for (var p = 0; p < numPhysicsNodes; p += 1)
                {
                    var physicsNode = physicsNodes[p];
                    var body = physicsNode.body;
                    if (body)
                    {
                        if (physicsNode.kinematic)
                        {
                            dynamicsWorld.removeCollisionObject(body);
                        }
                        else if (physicsNode.dynamic)
                        {
                            dynamicsWorld.removeRigidBody(body);
                        }
                        else
                        {
                            dynamicsWorld.removeCollisionObject(body);
                        }
                    }
                    this.deletePhysicsNode(physicsNode);
                }

                this.unsubscribeSceneNode(sceneNode);
                delete sceneNode.physicsNodes;
            }
        }
    };

    //
    // deleteHierarchy
    //
    deleteHierarchy(sceneNode)
    {
        this.deleteNode(sceneNode);

        var children = sceneNode.children;
        if (children)
        {
            var numChildren = children.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                this.deleteHierarchy(children[c]);
            }
        }
    };

    //
    // calculateHierarchyExtents
    //
    calculateHierarchyExtents(sceneNode)
    {
        var min = Math.min;
        var max = Math.max;
        var maxValue = Number.MAX_VALUE;
        var arrayConstructor = this.arrayConstructor;
        /*jshint newcap: false*/
        var totalExtents = new arrayConstructor(6);
        /*jshint newcap: true*/
        totalExtents[2] = totalExtents[1] = totalExtents[0] = maxValue;
        totalExtents[5] = totalExtents[4] = totalExtents[3] = -maxValue;

        var calculateNodeExtents = function calculateNodeExtentsFn(sceneNode)
        {
            var physicsNodes = sceneNode.physicsNodes;
            if (physicsNodes)
            {
                var numPhysicsNodes = physicsNodes.length;
                /*jshint newcap: false*/
                var extents = new arrayConstructor(6);
                /*jshint newcap: true*/
                for (var p = 0; p < numPhysicsNodes; p += 1)
                {
                    physicsNodes[p].body.calculateExtents(extents);
                    totalExtents[0] = min(totalExtents[0], extents[0]);
                    totalExtents[1] = min(totalExtents[1], extents[1]);
                    totalExtents[2] = min(totalExtents[2], extents[2]);
                    totalExtents[3] = max(totalExtents[3], extents[3]);
                    totalExtents[4] = max(totalExtents[4], extents[4]);
                    totalExtents[5] = max(totalExtents[5], extents[5]);
                }
            }

            var children = sceneNode.children;
            if (children)
            {
                var numChildren = children.length;
                for (var n = 0; n < numChildren; n += 1)
                {
                    calculateNodeExtents(children[n]);
                }
            }
        }

        calculateNodeExtents(sceneNode);

        if (totalExtents[0] >= totalExtents[3])
        {
            return undefined;
        }
        return totalExtents;
    };

    //
    // calculateExtents
    //
    calculateExtents(sceneNode)
    {
        var min = Math.min;
        var max = Math.max;
        var maxValue = Number.MAX_VALUE;
        var totalExtents = new this.arrayConstructor(6);
        totalExtents[2] = totalExtents[1] = totalExtents[0] = maxValue;
        totalExtents[5] = totalExtents[4] = totalExtents[3] = -maxValue;

        var physicsNodes = sceneNode.physicsNodes;
        if (physicsNodes)
        {
            var numPhysicsNodes = physicsNodes.length;
            var extents = new this.arrayConstructor(6);
            for (var p = 0; p < numPhysicsNodes; p += 1)
            {
                physicsNodes[p].body.calculateExtents(extents);
                totalExtents[0] = min(totalExtents[0], extents[0]);
                totalExtents[1] = min(totalExtents[1], extents[1]);
                totalExtents[2] = min(totalExtents[2], extents[2]);
                totalExtents[3] = max(totalExtents[3], extents[3]);
                totalExtents[4] = max(totalExtents[4], extents[4]);
                totalExtents[5] = max(totalExtents[5], extents[5]);
            }
        }

        if (totalExtents[0] >= totalExtents[3])
        {
            return undefined;
        }
        return totalExtents;
    };

    //
    // clear
    //
    clear()
    {
        if (this.physicsNodes)
        {
            for (var index = 0; index < this.physicsNodes.length; index += 1)
            {
                this.unsubscribeSceneNode(this.physicsNodes[index].target);
            }
        }
        this.physicsNodes = [];
        this.dynamicPhysicsNodes = [];
        this.kinematicPhysicsNodes = [];
    };

    //
    // loadNodes
    //
    loadNodes(loadParams, scene)
    {
        var sceneData = loadParams.data;
        var collisionMargin = (loadParams.collisionMargin || 0.005);
        var nodesNamePrefix = loadParams.nodesNamePrefix;

        if (!loadParams.append)
        {
            this.clear();
        }

        if (!this.physicsDevice)
        {
            return;
        }
        var physicsDevice = this.physicsDevice;
        var dynamicsWorld = this.dynamicsWorld;
        var dynamicFilterFlag = physicsDevice.FILTER_DYNAMIC;
        var kinematicFilterFlag = physicsDevice.FILTER_KINEMATIC;
        var staticFilterFlag = physicsDevice.FILTER_STATIC;
        var characterFilterFlag = physicsDevice.FILTER_CHARACTER;
        var projectileFilterFlag = physicsDevice.FILTER_PROJECTILE;
        var allFilterFlag = physicsDevice.FILTER_ALL;

        var mathsDevice = this.mathsDevice;
        var physicsNodes = this.physicsNodes;
        var dynamicPhysicsNodes = this.dynamicPhysicsNodes;
        var kinematicPhysicsNodes = this.kinematicPhysicsNodes;
        var fileShapes = sceneData.geometries;
        var fileNodes = sceneData.physicsnodes;
        var fileModels = sceneData.physicsmodels;
        var fileMaterials = sceneData.physicsmaterials;
        var shape, origin, triangleArray;
        for (var fn in fileNodes)
        {
            if (fileNodes.hasOwnProperty(fn))
            {
                var fileNode = fileNodes[fn];
                var targetName = fileNode.target;
                if (nodesNamePrefix)
                {
                    targetName = SceneNode.makePath(nodesNamePrefix, targetName);
                }
                var target = scene.findNode(targetName);
                if (!target)
                {   //missing target.
                    continue;
                }
                var fileModel = fileModels[fileNode.body];
                if (!fileModel)
                {
                    continue;
                }
                var physicsMaterial;
                if (fileMaterials)
                {
                    physicsMaterial = fileMaterials[fileModel.material];
                }
                if (physicsMaterial && (physicsMaterial.nonsolid || physicsMaterial.far))
                {
                    continue;
                }
                var kinematic = (fileModel.kinematic || target.kinematic);
                var dynamic = (fileModel.dynamic || target.dynamic);
                var disabled = target.disabled;
                shape = null;
                origin = null;
                triangleArray = null;
                var shapeType = fileModel.shape;
                if (shapeType === "box")
                {
                    var halfExtents = fileModel.halfExtents || fileModel.halfextents;
                    shape = physicsDevice.createBoxShape({
                        halfExtents: halfExtents,
                        margin: collisionMargin
                    });
                }
                else if (shapeType === "sphere")
                {
                    shape = physicsDevice.createSphereShape({
                        radius: fileModel.radius,
                        margin: collisionMargin
                    });
                }
                else if (shapeType === "cone")
                {
                    shape = physicsDevice.createConeShape({
                        radius: fileModel.radius,
                        height: fileModel.height,
                        margin: collisionMargin
                    });
                }
                else if (shapeType === "capsule")
                {
                    shape = physicsDevice.createCapsuleShape({
                        radius: fileModel.radius,
                        height: fileModel.height,
                        margin: collisionMargin
                    });
                }
                else if (shapeType === "cylinder")
                {
                    shape = physicsDevice.createCylinderShape({
                        halfExtents: [fileModel.radius, fileModel.height, fileModel.radius],
                        margin: collisionMargin
                    });
                }
                else if (shapeType === "convexhull" ||
                         shapeType === "mesh")
                {
                    var geometry = fileShapes[fileModel.geometry];
                    if (geometry)
                    {
                        shape = geometry.physicsShape;
                        if (shape)
                        {
                            origin = geometry.origin;
                        }
                        else
                        {
                            var inputs = geometry.inputs;
                            var inputPosition = inputs.POSITION;
                            var positions = geometry.sources[inputPosition.source];
                            var positionsData = positions.data;
                            var posMin = positions.min;
                            var posMax = positions.max;
                            var numPositionsValues, np, pos0, pos1, pos2;
                            var min0, min1, min2, max0, max1, max2;
                            if (posMin && posMax)
                            {
                                var centerPos0 = ((posMax[0] + posMin[0]) * 0.5);
                                var centerPos1 = ((posMax[1] + posMin[1]) * 0.5);
                                var centerPos2 = ((posMax[2] + posMin[2]) * 0.5);
                                if (Math.abs(centerPos0) > 1.e-6 ||
                                    Math.abs(centerPos1) > 1.e-6 ||
                                    Math.abs(centerPos2) > 1.e-6)
                                {
                                    var halfPos0 = ((posMax[0] - posMin[0]) * 0.5);
                                    var halfPos1 = ((posMax[1] - posMin[1]) * 0.5);
                                    var halfPos2 = ((posMax[2] - posMin[2]) * 0.5);
                                    min0 = -halfPos0;
                                    min1 = -halfPos1;
                                    min2 = -halfPos2;
                                    max0 = halfPos0;
                                    max1 = halfPos1;
                                    max2 = halfPos2;
                                    numPositionsValues = positionsData.length;
                                    var newPositionsData = [];
                                    newPositionsData.length = numPositionsValues;
                                    for (np = 0; np < numPositionsValues; np += 3)
                                    {
                                        pos0 = (positionsData[np + 0] - centerPos0);
                                        pos1 = (positionsData[np + 1] - centerPos1);
                                        pos2 = (positionsData[np + 2] - centerPos2);
                                        if (min0 > pos0)
                                        {
                                            min0 = pos0;
                                        }
                                        else if (max0 < pos0)
                                        {
                                            max0 = pos0;
                                        }
                                        if (min1 > pos1)
                                        {
                                            min1 = pos1;
                                        }
                                        else if (max1 < pos1)
                                        {
                                            max1 = pos1;
                                        }
                                        if (min2 > pos2)
                                        {
                                            min2 = pos2;
                                        }
                                        else if (max2 < pos2)
                                        {
                                            max2 = pos2;
                                        }
                                        newPositionsData[np + 0] = pos0;
                                        newPositionsData[np + 1] = pos1;
                                        newPositionsData[np + 2] = pos2;
                                    }
                                    positionsData = newPositionsData;
                                    posMin = [min0, min1, min2];
                                    posMax = [max0, max1, max2];
                                    origin = mathsDevice.v3Build(centerPos0, centerPos1, centerPos2);
                                    geometry.origin = origin;
                                }
                            }
                            else
                            {
                                //TODO: add a warning that with no extents we can't calculate and origin?
                                geometry.origin = [0, 0, 0];
                            }

                            // Can we use a box?
                            // TODO: do it offline
                            if (positionsData.length === 24)
                            {
                                min0 = posMin[0];
                                min1 = posMin[1];
                                min2 = posMin[2];
                                max0 = posMax[0];
                                max1 = posMax[1];
                                max2 = posMax[2];

                                for (np = 0; np < 24; np += 3)
                                {
                                    pos0 = positionsData[np + 0];
                                    pos1 = positionsData[np + 1];
                                    pos2 = positionsData[np + 2];
                                    if ((pos0 !== min0 && pos0 !== max0) ||
                                        (pos1 !== min1 && pos1 !== max1) ||
                                        (pos2 !== min2 && pos2 !== max2))
                                    {
                                        break;
                                    }
                                }

                                if (np >= numPositionsValues)
                                {
                                    shapeType = "box";

                                    shape = physicsDevice.createBoxShape({
                                        halfExtents: [(max0 - min0) * 0.5,
                                                      (max1 - min1) * 0.5,
                                                      (max2 - min2) * 0.5],
                                        margin: collisionMargin
                                    });
                                }
                            }

                            if (shapeType === "convexhull")
                            {
                                shape = physicsDevice.createConvexHullShape({
                                    points: positionsData,
                                    margin: collisionMargin
                                });
                            }
                            else if (shapeType === "mesh")
                            {
                                var maxOffset = 0;
                                for (var input in inputs)
                                {
                                    if (inputs.hasOwnProperty(input))
                                    {
                                        var fileInput = inputs[input];
                                        var offset = fileInput.offset;
                                        if (offset > maxOffset)
                                        {
                                            maxOffset = offset;
                                        }
                                    }
                                }

                                var indices = [];
                                var surfaces = geometry.surfaces;
                                if (!surfaces)
                                {
                                    surfaces = { s: { triangles: geometry.triangles } };
                                }
                                for (var surf in surfaces)
                                {
                                    if (surfaces.hasOwnProperty(surf))
                                    {
                                        var surface = surfaces[surf];

                                        if (maxOffset > 0)
                                        {
                                            var triangles = surface.triangles;
                                            if (triangles)
                                            {
                                                var indicesPerVertex = (maxOffset + 1);
                                                var numIndices = triangles.length;
                                                var positionsOffset = inputPosition.offset;
                                                for (var v = 0; v < numIndices; v += indicesPerVertex)
                                                {
                                                    indices.push(triangles[v + positionsOffset]);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            var surfIndices = surface.triangles;
                                            if (surfIndices)
                                            {
                                                if (indices.length === 0)
                                                {
                                                    indices = surfIndices;
                                                }
                                                else
                                                {
                                                    var numSurfIndices = surfIndices.length;
                                                    for (var i = 0; i < numSurfIndices; i += 1)
                                                    {
                                                        indices.push(surfIndices[i]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if (indices)
                                {
                                    var triangleArrayParams = {
                                        vertices: positionsData,
                                        indices: indices,
                                        minExtent: posMin,
                                        maxExtent: posMax
                                    };
                                    triangleArray = physicsDevice.createTriangleArray(triangleArrayParams);
                                    if (triangleArray)
                                    {
                                        shape = physicsDevice.createTriangleMeshShape({
                                            triangleArray: triangleArray,
                                            margin: collisionMargin
                                        });
                                    }
                                }
                            }
                            geometry.physicsShape = shape;
                        }
                    }
                }

                if (shape)
                {
                    var transform = target.getWorldTransform();
                    if (origin)
                    {
                        transform = mathsDevice.m43Offset(transform, origin);
                    }

                    // TODO: Declare this as a Physics*Parameters so
                    // we only have to initialize the required entries
                    // at this stage.
                    var params = {
                        shape: shape,
                        transform: transform,
                        friction: undefined,
                        restitution: undefined,
                        group: undefined,
                        mask: undefined,
                        kinematic: undefined,
                        mass: undefined,
                        inertia: undefined,
                        frozen: undefined,
                        linearVelocity: undefined,
                        angularVelocity: undefined
                    };



                    if (physicsMaterial)
                    {
                        if (physicsMaterial.dynamic_friction)
                        {
                            params.friction = physicsMaterial.dynamic_friction;
                        }
                        if (physicsMaterial.restitution)
                        {
                            params.restitution = physicsMaterial.restitution;
                        }
                    }

                    // Check for filters to specify which groups will collide against these objects
                    var collisionFilters = allFilterFlag;
                    if (physicsMaterial)
                    {
                        var materialFilter = physicsMaterial.collisionFilter;
                        if (materialFilter)
                        {
                            collisionFilters = 0;
                            var numFilters = materialFilter.length;
                            for (var f = 0; f < numFilters; f += 1)
                            {
                                var filter = materialFilter[f];
                                if (filter === "ALL")
                                {
                                    collisionFilters += allFilterFlag;
                                }
                                else if (filter === "DYNAMIC")
                                {
                                    collisionFilters += dynamicFilterFlag;
                                }
                                else if (filter === "CHARACTER")
                                {
                                    collisionFilters += characterFilterFlag;
                                }
                                else if (filter === "PROJECTILE")
                                {
                                    collisionFilters += projectileFilterFlag;
                                }
                                else if (filter === "STATIC")
                                {
                                    collisionFilters += staticFilterFlag;
                                }
                                else if (filter === "KINEMATIC")
                                {
                                    collisionFilters += kinematicFilterFlag;
                                }
                            }
                        }
                    }

                    var physicsObject;
                    if (kinematic)
                    {
                        params.group = kinematicFilterFlag;
                        params.mask = collisionFilters;
                        params.kinematic = true;
                        physicsObject = physicsDevice.createCollisionObject(params);
                        if (physicsObject && !disabled)
                        {
                            dynamicsWorld.addCollisionObject(physicsObject);
                        }
                    }
                    else if (dynamic)
                    {
                        params.mass = (fileModel.mass || 1);
                        params.inertia = fileModel.inertia;
                        params.group = dynamicFilterFlag;
                        params.mask = collisionFilters;
                        params.frozen = false;
                        if (fileModel.velocity)
                        {
                            params.linearVelocity = fileModel.velocity;
                        }
                        if (fileModel.angularvelocity)
                        {
                            params.angularVelocity = fileModel.angularvelocity;
                        }
                        physicsObject = physicsDevice.createRigidBody(params);
                        if (physicsObject && !disabled)
                        {
                            dynamicsWorld.addRigidBody(physicsObject);
                        }
                    }
                    else
                    {
                        params.group = staticFilterFlag;
                        params.mask = collisionFilters;
                        physicsObject = physicsDevice.createCollisionObject(params);
                        if (physicsObject && !disabled)
                        {
                            dynamicsWorld.addCollisionObject(physicsObject);
                        }
                    }

                    if (physicsObject)
                    {
                        var physicsNode : PhysicsNode = {
                            body: physicsObject,
                            target: target
                        };

                        // Make the physics object point back at the target node so we can get to it
                        // from collision tests
                        physicsObject.userData = target;

                        if (origin)
                        {
                            physicsNode.origin = origin;
                        }

                        if (triangleArray)
                        {
                            physicsNode.triangleArray = triangleArray;
                        }

                        if (kinematic)
                        {
                            physicsNode.kinematic = true;
                            target.kinematic = true;
                            target.dynamic = true;
                            kinematicPhysicsNodes.push(physicsNode);
                        }
                        else if (dynamic)
                        {
                            physicsNode.dynamic = true;
                            target.dynamic = true;
                            dynamicPhysicsNodes.push(physicsNode);
                        }

                        physicsNodes.push(physicsNode);

                        var targetPhysicsNodes = target.physicsNodes;
                        if (targetPhysicsNodes)
                        {
                            targetPhysicsNodes.push(physicsNode);
                        }
                        else
                        {
                            target.physicsNodes = [physicsNode];
                            this.subscribeSceneNode(target);
                        }

                    }
                }
            }
        }
    };

    //
    // unsubscribeSceneNode
    //
    unsubscribeSceneNode(sceneNode)
    {
        sceneNode.unsubscribeCloned(this.sceneNodeCloned);
        sceneNode.unsubscribeDestroyed(this.sceneNodeDestroyed);
    };

    //
    // subscribeSceneNode
    //
    subscribeSceneNode(sceneNode)
    {
        sceneNode.subscribeCloned(this.sceneNodeCloned);
        sceneNode.subscribeDestroyed(this.sceneNodeDestroyed);
    };

    //
    // cloneSceneNode
    //
    cloneSceneNode(oldSceneNode, newSceneNode)
    {
        var physicsManager = this;

        var physicsManagerCloneNode =
            function physicsManagerCloneNodeFn(physicsNode: PhysicsNode,
                                               targetSceneNode: SceneNode)
        {
            var newPhysicsObject = physicsNode.body.clone();

            var newPhysicsNode : PhysicsNode = {
                body: newPhysicsObject,
                target: targetSceneNode
            };

            // Make the physics object point back at the target node so we can get to it
            // from collision tests
            newPhysicsObject.userData = targetSceneNode;

            if (physicsNode.origin)
            {
                newPhysicsNode.origin = physicsNode.origin; // TODO: clone?
            }

            if (physicsNode.triangleArray)
            {
                newPhysicsNode.triangleArray = physicsNode.triangleArray;
            }

            if (physicsNode.kinematic)
            {
                newPhysicsNode.kinematic = true;
                targetSceneNode.kinematic = true;
                targetSceneNode.dynamic = true;
                physicsManager.kinematicPhysicsNodes.push(newPhysicsNode);
                newPhysicsNode.body.transform = targetSceneNode.getWorldTransform();
            }
            else if (physicsNode.dynamic)
            {
                newPhysicsNode.dynamic = true;
                targetSceneNode.dynamic = true;
                physicsManager.dynamicPhysicsNodes.push(newPhysicsNode);
                newPhysicsNode.body.transform = targetSceneNode.getWorldTransform();
            }

            physicsManager.physicsNodes.push(newPhysicsNode);

            var targetPhysicsNodes = targetSceneNode.physicsNodes;
            if (targetPhysicsNodes)
            {
                targetPhysicsNodes.push(newPhysicsNode);
            }
            else
            {
                targetSceneNode.physicsNodes = [newPhysicsNode];
                this.subscribeSceneNode(targetSceneNode);
            }
        }

        var physicsNodes = oldSceneNode.physicsNodes;
        if (physicsNodes)
        {
            var numPhysicsNodes = physicsNodes.length;
            newSceneNode.physicsNodes = [];
            for (var p = 0; p < numPhysicsNodes; p += 1)
            {
                physicsManagerCloneNode(physicsNodes[p], newSceneNode);
            }
        }
    };

    //
    // Snapshot
    //
    createSnapshot()
    {
        var snapshot = {};

        // We only snapshot dynamic nodes because kinematics are driven externally
        var physicsNodes = this.dynamicPhysicsNodes;
        var numPhysicsNodes = physicsNodes.length;
        if (numPhysicsNodes > 0)
        {
            var physicsNode, n, body;
            for (n = 0; n < numPhysicsNodes; n += 1)
            {
                physicsNode = physicsNodes[n];
                body = physicsNode.body;
                snapshot[physicsNode.target.name] = {
                    active: body.active,
                    transform: body.transform,
                    linearVelocity: body.linearVelocity,
                    angularVelocity: body.angularVelocity
                };
            }
        }

        return snapshot;
    };

    restoreSnapshot(snapshot)
    {
        var physicsNodes = this.dynamicPhysicsNodes;
        var numPhysicsNodes = physicsNodes.length;
        if (numPhysicsNodes > 0)
        {
            var physicsNode, n, body, state;
            for (n = 0; n < numPhysicsNodes; n += 1)
            {
                physicsNode = physicsNodes[n];
                body = physicsNode.body;
                state = snapshot[physicsNode.target.name];
                if (state)
                {
                    body.transform = state.transform;
                    body.linearVelocity = state.linearVelocity;
                    body.angularVelocity = state.angularVelocity;
                    body.active = state.active;
                }
            }
        }
    };

    //
    // Constructor function
    //
    static create(mathsDevice: MathDevice, physicsDevice: PhysicsDevice,
                  dynamicsWorld: PhysicsWorld) : PhysicsManager
    {
        var physicsManager = new PhysicsManager();

        physicsManager.mathsDevice = mathsDevice;
        physicsManager.physicsDevice = physicsDevice;
        physicsManager.dynamicsWorld = dynamicsWorld;
        physicsManager.clear();

        physicsManager.sceneNodeCloned = function sceneNodeClonedFn(data)
        {
            physicsManager.cloneSceneNode(data.oldNode, data.newNode);
        };

        physicsManager.sceneNodeDestroyed = function sceneNodeDestroyedFn(data)
        {
            physicsManager.deleteNode(data.node);
        };

        physicsManager.tempMatrix = mathsDevice.m43BuildIdentity();

        return physicsManager;
    };
};

PhysicsManager.prototype.arrayConstructor = Array;

// Detect correct typed arrays
(function () {
    if (typeof Float32Array !== "undefined")
    {
        var testArray = new Float32Array(4);
        var textDescriptor = Object.prototype.toString.call(testArray);
        if (textDescriptor === '[object Float32Array]')
        {
            PhysicsManager.prototype.arrayConstructor = Float32Array;
        }
    }
}());
