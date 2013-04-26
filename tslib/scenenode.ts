// Copyright (c) 2010-2013 Turbulenz Limited
/*global TurbulenzEngine: false*/
/*global Utilities: false*/
/*global Observer: false*/

/// <reference path="scene.ts" />
/// <reference path="debug.ts" />
/// <reference path="animation.ts" />

//
// Renderable
//
interface Renderable
{

    geometry: Geometry;
    geometryType: string;
    node: SceneNode;

    renderUpdate: any; // TODO?
    rendererInfo: any; // TODO?
    distance: number;
    drawParameters: DrawParameters[];

    skinController?: ControllerBaseClass;

    center: any; // v3
    halfExtents: any; // v3 / v6?



    // Methods

    clone(): Renderable;
    isSkinned(): bool;
    hasCustomWorldExtents(): bool;
    addCustomWorldExtents(extents: any);
    setNode(node: SceneNode);
    destroy();
};

//
// SceneNode
//
class SceneNode
{
    static version = 1;

    name                            : string;
    mathDevice                      : MathDevice;
    dynamic                         : bool;
    disabled                        : bool;

    dirtyWorld                      : bool;
    dirtyWorldExtents               : bool;
    dirtyLocalExtents               : bool;

    //Counter of number of times modified.
    worldUpdate                     : number;
    rendererInfo                    : any; // TODO?

    local                           : any; // m43
    world                           : any; // m43

    localExtents                    : any; //
    localExtentsCenter              : any; // v3
    localHalfExtents                : any; // v3?
    customLocalExtents              : any; //

    worldExtents                    : any; //
    worldExtentsUpdate              : bool;
    customWorldExtents              : any; //
    numCustomRenderableWorldExtents : number;

    aabbTreeIndex                   : number;

    camera                          : Camera;

    parent                          : SceneNode;
    notifiedParent                  : bool;
    scene                           : Scene;
    children                        : SceneNode[];
    childNeedsUpdateCount           : number;

    clonedObserver                  : Observer;
    destroyedObserver               : Observer;

    // Lights
    lights                          : Light[];
    lightInstances                  : LightInstance[];

    // Animation
    skin                            : any; // TODO:

    // Physics
    physicsNodes                    : PhysicsNode[];
    kinematic: bool;

    // Geometry
    geometryinstances               : { [name: string]: GeometryInstance; };

    // // During loading
    // reference: string;
    // inplace: bool;

    arrayConstructor: any; // on prototype

    //
    //SceneNode.makePath
    //
    static makePath(parentPath, childName)
    {
        return parentPath + "/" + childName;
    };

    //
    //SceneNode.invalidSetLocalTransform
    //
    static invalidSetLocalTransform()
    {
        debug.abort("setLocalTransform can not be called on static nodes.");
    };

    renderables: Renderable[];

    //
    //getName
    //
    getName() : string
    {
        return this.name;
    };

    //
    //getPath
    //
    getPath() : string
    {
        if (this.parent)
        {
            return SceneNode.makePath(this.parent.getPath(), this.name);
        }
        return this.name;
    };

    //
    //getParent
    //
    getParent() : SceneNode
    {
        return this.parent;
    };

    //
    //setParentHelper
    //
    setParentHelper(parent)
    {
        //***Only valid to call from addChild()/removeChild() ***
        this.parent = parent;
        this.notifiedParent = false;
        this.dirtyWorld = false;
        this.setDirtyWorldTransform();
    };

    //
    //addChild
    //
    addChild(child)
    {
        if (child.parent)
        {
            child.parent.removeChild(child);
        }
        else
        {
            //Child was a root node
            if (child.scene)
            {
                child.scene.removeRootNode(child);
            }
        }

        if (!this.children)
        {
            this.children = [];
            this.childNeedsUpdateCount = 0;
        }
        this.children.push(child);
        child.setParentHelper(this);

        if (this.dynamic && !child.dynamic)
        {
            child.setDynamic();
        }
    };

    //
    //removeChild
    //
    removeChild(child)
    {
        var children = this.children;
        if (children)
        {
            if (child.notifiedParent)
            {
                this.childUpdated();
            }
            var numChildren = children.length;
            for (var n = 0; n < numChildren; n += 1)
            {
                if (children[n] === child)
                {
                    var root = this.getRoot();
                    if (root.scene)
                    {
                        child.removedFromScene(root.scene);   //Maybe decouple with an event.
                    }
                    children.splice(n, 1);
                    child.setParentHelper(null);
                    return;
                }
            }
        }
        debug.abort("Invalid child");
    };

    //
    //findChild
    //
    findChild(name)
    {
        var children = this.children;
        if (children)
        {
            var numChildren = children.length;
            for (var childIndex = 0; childIndex < numChildren; childIndex += 1)
            {
                if (children[childIndex].name === name)
                {
                    return children[childIndex];
                }
            }
        }
        return undefined;
    };

    //
    // clone
    //
    clone(newNodeName?: string) : SceneNode
    {
        var newNode = SceneNode.create({name: newNodeName || this.name,
                                        local: this.local,
                                        dynamic: this.dynamic,
                                        disabled: this.disabled});

        // Clone renderables
        var renderables = this.renderables;
        if (renderables)
        {
            var numRenderables = renderables.length;

            for (var i = 0; i < numRenderables; i += 1)
            {
                var renderable = renderables[i];
                newNode.addRenderable(renderable.clone());
            }
        }

        // Clone lights
        var lights = this.lights;
        if (lights)
        {
            var numLights = lights.length;
            for (var l = 0; l < numLights; l += 1)
            {
                var light = lights[l];
                newNode.addLightInstance(light.clone());
            }
        }

        if (this.clonedObserver)
        {
            this.clonedObserver.notify({oldNode: this,
                                        newNode: newNode});
        }

        var childNodes = this.children;
        if (childNodes)
        {
            var numChildren = childNodes.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                newNode.addChild(childNodes[c].clone());
            }
        }

        return newNode;
    };

    //
    //getRoot
    //
    getRoot()
    {
        var result = this;
        while (result.parent)
        {
            result = result.parent;
        }
        return result;
    };

    //
    // isInScene
    //
    isInScene(): bool
    {
        if (this.getRoot().scene)
        {
            return true;
        }
        return false;
    };

    //
    //removedFromScene
    //
    private removedFromScene(scene)
    {
        //private function

        if (this.aabbTreeIndex !== undefined)
        {
            if (this.dynamic)
            {
                scene.dynamicSpatialMap.remove(this);
            }
            else
            {
                scene.staticSpatialMap.remove(this);
                scene.staticNodesChangeCounter += 1;
            }
        }

        var children = this.children;
        if (children)
        {
            var numChildren = children.length;
            for (var childIndex = 0; childIndex < numChildren; childIndex += 1)
            {
                children[childIndex].removedFromScene(scene);
            }
        }
    };

    //
    //setLocalTransform
    //
    setLocalTransform(matrix)
    {
        if (matrix !== this.local)
        {
            this.local = this.mathDevice.m43Copy(matrix, this.local);
        }

        //inlined non-recursive setDirtyWorldTransform()
        var setDirtyWorldTransformHelper =
            function setDirtyWorldTransformHelperFn(nodes)
        {
            var numRemainingNodes = nodes.length;
            var node, index, child;
            do
            {
                numRemainingNodes -= 1;
                node = nodes[numRemainingNodes];

                node.dirtyWorld = true;

                if (!node.customWorldExtents && node.localExtents)
                {
                    node.dirtyWorldExtents = true;
                }

                var children = node.children;
                if (children)
                {
                    var numChildren = children.length;

                    if (!node.childNeedsUpdateCount)
                    {
                        // Common case of propagating down to clean children
                        node.childNeedsUpdateCount = numChildren;
                        for (index = 0; index < numChildren; index += 1)
                        {
                            child = children[index];
                            child.notifiedParent = true;

                            nodes[numRemainingNodes] = child;
                            numRemainingNodes += 1;
                        }
                    }
                    else
                    {
                        // One or more children dirty
                        for (index = 0; index < numChildren; index += 1)
                        {
                            child = children[index];
                            if (!child.dirtyWorld)
                            {
                                if (!child.notifiedParent)
                                {
                                    child.notifiedParent = true;
                                    node.childNeedsUpdateCount += 1;
                                }

                                nodes[numRemainingNodes] = child;
                                numRemainingNodes += 1;
                            }
                        }
                    }
                }
            }
            while (0 < numRemainingNodes);
        }

        if (!this.dirtyWorld)
        {
            //inlined updateRequired()
            var parent = this.parent;
            if (parent)
            {
                if (!this.notifiedParent)
                {
                    this.notifiedParent = true;
                    parent.childNeedsUpdate();
                }
            }
            else
            {
                //Root nodes
                var scene = this.scene;
                if (scene)
                {
                    var dirtyRoots = scene.dirtyRoots;
                    if (!dirtyRoots)
                    {
                        dirtyRoots = {};
                        scene.dirtyRoots = dirtyRoots;
                    }
                    dirtyRoots[this.name] = this;
                }
            }

            setDirtyWorldTransformHelper([this]);
        }
    };

    //
    //getLocalTransform
    //
    getLocalTransform()
    {
        return this.local;
    };

    //
    //setDirtyWorldTransform
    //
    private setDirtyWorldTransform()
    {
        //private function
        if (this.dirtyWorld)
        {
            return;
        }

        var setDirtyWorldTransformHelper =
            function setDirtyWorldTransformHelperFn()
        {
            this.dirtyWorld = true;

            if (!this.customWorldExtents && this.localExtents)
            {
                this.dirtyWorldExtents = true;
            }

            var children = this.children;
            if (children)
            {
                var numChildren = children.length;
                var index;
                var child;

                if (!this.childNeedsUpdateCount)
                {
                    // Common case of propagating down to clean children
                    this.childNeedsUpdateCount = numChildren;
                    for (index = 0; index < numChildren; index += 1)
                    {
                        child = children[index];
                        child.notifiedParent = true;
                        setDirtyWorldTransformHelper.call(child);
                    }
                }
                else
                {
                    // One or more children dirty
                    for (index = 0; index < numChildren; index += 1)
                    {
                        child = children[index];
                        if (!child.dirtyWorld)
                        {
                            if (!child.notifiedParent)
                            {
                                child.notifiedParent = true;
                                this.childNeedsUpdateCount += 1;
                            }
                            setDirtyWorldTransformHelper.call(child);
                        }
                    }
                }
            }
        }

        //inlined updateRequired()
        if (this.parent)
        {
            if (!this.notifiedParent)
            {
                this.parent.childNeedsUpdate();
                this.notifiedParent = true;
            }
        }
        else
        {
            //Root nodes
            var scene = this.scene;
            if (scene)
            {
                if (!scene.dirtyRoots)
                {
                    scene.dirtyRoots = {};
                }
                scene.dirtyRoots[this.name] = this;
            }
        }

        setDirtyWorldTransformHelper.call(this);
    };

    //
    //getWorldTransform
    //
    getWorldTransform()
    {
        if (this.dirtyWorld)
        {
            this.dirtyWorld = false;
            this.worldUpdate += 1;
            this.checkUpdateRequired();

            var parent = this.parent;
            var local = this.local;
            if (parent)
            {
                var parentWorld = parent.getWorldTransform();
                if (local)
                {
                    this.world = this.mathDevice.m43Mul(local, parentWorld, this.world);
                }
                else
                {
                    this.world = this.mathDevice.m43Copy(parentWorld, this.world);
                }
            }
            else
            {
                this.world =  this.mathDevice.m43Copy(local, this.world);
            }
        }
        return this.world;
    };

    //
    //setDynamic
    //
    setDynamic()
    {
        if (!this.dynamic)
        {
            if (this.aabbTreeIndex !== undefined)
            {
                var scene = this.getRoot().scene;
                scene.staticSpatialMap.remove(this);
                scene.staticNodesChangeCounter += 1;
                delete this.aabbTreeIndex;
            }
            delete this.setLocalTransform; //Allowed to move again.

            var worldExtents = this.getWorldExtents();  //If there is any dirty state then its possible that even if it still has an aabbTreeIndex it may no longer.
            if (worldExtents)
            {
                this.getRoot().scene.dynamicSpatialMap.update(this, worldExtents);
            }
            this.dynamic = true;
        }

        var children = this.children;
        if (children)
        {
            var numChildren = children.length;
            for (var n = 0; n < numChildren; n += 1)
            {
                children[n].setDynamic();
            }
        }
    };

    //
    //setStatic
    //
    setStatic()
    {
        if (this.dynamic)
        {
            if (this.aabbTreeIndex !== undefined)
            {
                this.getRoot().scene.dynamicSpatialMap.remove(this);
                delete this.aabbTreeIndex;
            }

            this.setLocalTransform = SceneNode.invalidSetLocalTransform;

            var worldExtents = this.getWorldExtents();  //If there is any dirty state then its possible that even if it still has an aabbTreeIndex it may no longer.
            if (worldExtents)
            {
                var scene = this.getRoot().scene;
                if (scene)
                {
                    scene.staticSpatialMap.update(this, worldExtents);
                    scene.staticNodesChangeCounter += 1;
                }
            }

            delete this.dirtyWorldExtents;
            delete this.worldExtentsUpdate;
            delete this.dirtyWorld;
            delete this.notifiedParent;
            delete this.dynamic;
        }

        var children = this.children;
        if (children)
        {
            var numChildren = children.length;
            for (var n = 0; n < numChildren; n += 1)
            {
                children[n].setStatic();
            }
        }
    };

    //
    //setDisabled
    //
    setDisabled(disabled)
    {
        if (disabled)
        {
            this.disabled = true;
        }
        else
        {
            delete this.disabled;
        }
    };

    //
    //getDisabled
    //
    getDisabled(): bool
    {
        return this.disabled ? true : false;
    };

    //
    //enableHierarchy
    //
    enableHierarchy(enabled)
    {
        this.setDisabled(!enabled);

        var children = this.children;
        if (children)
        {
            var numChildren = children.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                children[c].enableHierarchy(enabled);
            }
        }
    };

    //
    //childUpdated
    //
    private childUpdated()
    {
        //Private function
        //debug.assert(this.childNeedsUpdateCount >= 0, "Child update logic incorrect");
        this.childNeedsUpdateCount -= 1;
        if (this.childNeedsUpdateCount === 0 && this.dirtyWorld === false && this.dirtyWorldExtents === false)
        {   //no longer dirty
            if (this.parent)
            {
                this.parent.childUpdated();
                this.notifiedParent = false;
            }
        }
    };

    //
    //childNeedsUpdate
    //
    private childNeedsUpdate()
    {
        //Private function
        this.updateRequired();        //propagate to the root node.
        this.childNeedsUpdateCount += 1;
    };

    //
    //updateRequired
    //
    private updateRequired()
    {
        //Private function
        var parent = this.parent;
        if (parent)
        {
            if (!this.notifiedParent)
            {
                this.notifiedParent = true;
                parent.childNeedsUpdate();
            }
        }
        else
        {
            //Root nodes
            var scene = this.scene;
            if (scene)
            {
                var dirtyRoots = scene.dirtyRoots;
                if (!dirtyRoots)
                {
                    dirtyRoots = {};
                    scene.dirtyRoots = dirtyRoots;
                }
                dirtyRoots[this.name] = this;
            }
        }
    };

    //
    //checkUpdateRequired
    //
    private checkUpdateRequired()
    {
        //private function
        if (this.notifiedParent)
        {
            if (!this.dirtyWorldExtents &&
               !this.dirtyWorld &&
               !this.childNeedsUpdateCount)
            {
                this.parent.childUpdated();
                this.notifiedParent = false;
            }
        }
    };

    //
    //update
    //
    update(scene)
    {
        this.updateHelper(this.mathDevice, (scene || this.scene), [this]);
    };

    // TODO: Marked as private, but Scene accesses it
    // PRIVATE
    /* private */ updateHelper(mathDevice, scene, nodes)
    {
        var node, parent, index, worldExtents;
        var numNodes = nodes.length;
        do
        {
            numNodes -= 1;
            node = nodes[numNodes];

            if (node.dirtyWorld)
            {
                node.dirtyWorld = false;
                node.worldUpdate += 1;

                parent = node.parent;
                if (parent)
                {
                    var local = node.local;
                    if (local)
                    {
                        node.world = mathDevice.m43Mul(local, parent.world, node.world);
                    }
                    else
                    {
                        node.world = mathDevice.m43Copy(parent.world, node.world);
                    }
                }
                else
                {
                    node.world = mathDevice.m43Copy(node.local, node.world);
                }
            }

            if (node.dirtyWorldExtents)
            {
                if (node.customWorldExtents)
                {
                    node.worldExtents = node.customWorldExtents;
                }
                else
                {
                    if (node.dirtyLocalExtents)
                    {
                        node.updateLocalExtents();
                    }

                    if (node.numCustomRenderableWorldExtents)
                    {
                        var renderable, extents, minX, minY, minZ, maxX, maxY, maxZ;
                        var renderables = node.renderables;
                        var numRenderables = renderables.length;
                        var empty = true;

                        for (index = 0; index < numRenderables; index += 1)
                        {
                            renderable = renderables[index];
                            extents = renderable.getCustomWorldExtents();
                            if (extents)
                            {
                                minX = extents[0];
                                minY = extents[1];
                                minZ = extents[2];
                                maxX = extents[3];
                                maxY = extents[4];
                                maxZ = extents[5];
                                index += 1;
                                empty = false;
                                break;
                            }
                        }

                        for (; index < numRenderables; index += 1)
                        {
                            renderable = renderables[index];
                            extents = renderable.getCustomWorldExtents();
                            if (extents)
                            {
                                if (minX > extents[0])
                                {
                                    minX = extents[0];
                                }
                                if (minY > extents[1])
                                {
                                    minY = extents[1];
                                }
                                if (minZ > extents[2])
                                {
                                    minZ = extents[2];
                                }

                                if (maxX < extents[3])
                                {
                                    maxX = extents[3];
                                }
                                if (maxY < extents[4])
                                {
                                    maxY = extents[4];
                                }
                                if (maxZ < extents[5])
                                {
                                    maxZ = extents[5];
                                }
                            }
                        }

                        if (empty)
                        {
                            // This should not happen...
                            delete node.worldExtents;
                        }
                        else
                        {
                            worldExtents = node.worldExtents;
                            if (!worldExtents)
                            {
                                worldExtents = new node.arrayConstructor(6);
                                node.worldExtents = worldExtents;
                            }
                            worldExtents[0] = minX;
                            worldExtents[1] = minY;
                            worldExtents[2] = minZ;
                            worldExtents[3] = maxX;
                            worldExtents[4] = maxY;
                            worldExtents[5] = maxZ;
                        }
                    }
                    else if (node.localExtents)
                    {
                        //get center and half extents
                        var localExtentsCenter = node.localExtentsCenter;
                        var localHalfExtents = node.localHalfExtents;
                        var c0 = localExtentsCenter[0];
                        var c1 = localExtentsCenter[1];
                        var c2 = localExtentsCenter[2];
                        var h0 = localHalfExtents[0];
                        var h1 = localHalfExtents[1];
                        var h2 = localHalfExtents[2];

                        var world = node.world;
                        var m0 = world[0];
                        var m1 = world[1];
                        var m2 = world[2];
                        var m3 = world[3];
                        var m4 = world[4];
                        var m5 = world[5];
                        var m6 = world[6];
                        var m7 = world[7];
                        var m8 = world[8];

                        var ct0 = world[9];
                        var ct1 = world[10];
                        var ct2 = world[11];
                        if (c0 !== 0 ||
                            c1 !== 0 ||
                            c2 !== 0)
                        {
                            ct0 += (m0 * c0 + m3 * c1 + m6 * c2);
                            ct1 += (m1 * c0 + m4 * c1 + m7 * c2);
                            ct2 += (m2 * c0 + m5 * c1 + m8 * c2);
                        }

                        var ht0 = ((m0 < 0 ? -m0 : m0) * h0 + (m3 < 0 ? -m3 : m3) * h1 + (m6 < 0 ? -m6 : m6) * h2);
                        var ht1 = ((m1 < 0 ? -m1 : m1) * h0 + (m4 < 0 ? -m4 : m4) * h1 + (m7 < 0 ? -m7 : m7) * h2);
                        var ht2 = ((m2 < 0 ? -m2 : m2) * h0 + (m5 < 0 ? -m5 : m5) * h1 + (m8 < 0 ? -m8 : m8) * h2);

                        worldExtents = node.worldExtents;
                        if (!worldExtents)
                        {
                            worldExtents = new node.arrayConstructor(6);
                            node.worldExtents = worldExtents;
                        }
                        worldExtents[0] = (ct0 - ht0);
                        worldExtents[1] = (ct1 - ht1);
                        worldExtents[2] = (ct2 - ht2);
                        worldExtents[3] = (ct0 + ht0);
                        worldExtents[4] = (ct1 + ht1);
                        worldExtents[5] = (ct2 + ht2);
                    }
                    else
                    {
                        //no object with size so no extents.
                        delete node.worldExtents;
                    }
                }

                node.dirtyWorldExtents = false;
                node.worldExtentsUpdate = true;
            }

            if (node.worldExtentsUpdate)
            {
                node.worldExtentsUpdate = false;

                worldExtents = node.worldExtents;
                if (worldExtents)
                {
                    if (node.dynamic)
                    {
                        scene.dynamicSpatialMap.update(node, worldExtents);
                    }
                    else
                    {
                        scene.staticSpatialMap.update(node, worldExtents);
                        scene.staticNodesChangeCounter += 1;
                        //Remove things that are no longer relevant.
                        node.setLocalTransform = SceneNode.invalidSetLocalTransform;  //no longer allowed to move it.
                        delete node.dirtyWorldExtents;
                        delete node.worldExtentsUpdate;
                        delete node.dirtyWorld;
                        delete node.notifiedParent;
                    }
                }
                else if (node.aabbTreeIndex !== undefined)
                {
                    if (node.dynamic)
                    {
                        scene.dynamicSpatialMap.remove(node);
                    }
                    else
                    {
                        scene.staticSpatialMap.remove(node);
                        scene.staticNodesChangeCounter += 1;
                    }
                }
            }

            if (node.childNeedsUpdateCount)
            {
                node.childNeedsUpdateCount = 0;

                var children = node.children;
                if (children)
                {
                    var numChildren = children.length;
                    for (index = 0; index < numChildren; index += 1)
                    {
                        var child = children[index];
                        if (child.notifiedParent)
                        {
                            nodes[numNodes] = child;
                            numNodes += 1;
                        }
                    }
                }
            }

            if (node.notifiedParent)
            {
                node.notifiedParent = false;
            }
        }
        while (0 < numNodes);
    };

    //
    //updateLocalExtents
    //
    updateLocalExtents()
    {
        var localExtents, center, halfExtents;
        var hasExtents = false;
        if (this.customLocalExtents)
        {
            this.localExtents = this.customLocalExtents;
            hasExtents = true;
        }
        else
        {
            var renderables = this.renderables;
            var lights = this.lightInstances;
            if (renderables || lights)
            {
                var maxValue = Number.MAX_VALUE;
                var minValue = -maxValue;
                var min = Math.min;
                var max = Math.max;
                var h0, h1, h2, c0, c1, c2;

                var localExtents0 = maxValue;
                var localExtents1 = maxValue;
                var localExtents2 = maxValue;
                var localExtents3 = minValue;
                var localExtents4 = minValue;
                var localExtents5 = minValue;

                if (renderables)
                {
                    var numRenderables = renderables.length;
                    for (var index = 0; index < numRenderables; index += 1)
                    {
                        var renderable = renderables[index];
                        halfExtents = renderable.halfExtents;
                        if (halfExtents && !renderable.hasCustomWorldExtents())
                        {
                            h0 = halfExtents[0];
                            h1 = halfExtents[1];
                            h2 = halfExtents[2];

                            center = renderable.center;
                            if (center)
                            {
                                c0 = center[0];
                                c1 = center[1];
                                c2 = center[2];

                                localExtents0 = min(localExtents0, (c0 - h0));
                                localExtents1 = min(localExtents1, (c1 - h1));
                                localExtents2 = min(localExtents2, (c2 - h2));

                                localExtents3 = max(localExtents3, (c0 + h0));
                                localExtents4 = max(localExtents4, (c1 + h1));
                                localExtents5 = max(localExtents5, (c2 + h2));
                            }
                            else
                            {
                                localExtents0 = min(localExtents0, - h0);
                                localExtents1 = min(localExtents1, - h1);
                                localExtents2 = min(localExtents2, - h2);

                                localExtents3 = max(localExtents3, + h0);
                                localExtents4 = max(localExtents4, + h1);
                                localExtents5 = max(localExtents5, + h2);
                            }
                        }
                    }
                }

                if (lights)
                {
                    var numLights = lights.length;
                    for (var lindex = 0; lindex < numLights; lindex += 1)
                    {
                        var light = lights[lindex].light;
                        halfExtents = light.halfExtents;
                        if (halfExtents)
                        {
                            h0 = halfExtents[0];
                            h1 = halfExtents[1];
                            h2 = halfExtents[2];

                            center = light.center;
                            if (center)
                            {
                                c0 = center[0];
                                c1 = center[1];
                                c2 = center[2];

                                localExtents0 = min(localExtents0, (c0 - h0));
                                localExtents1 = min(localExtents1, (c1 - h1));
                                localExtents2 = min(localExtents2, (c2 - h2));

                                localExtents3 = max(localExtents3, (c0 + h0));
                                localExtents4 = max(localExtents4, (c1 + h1));
                                localExtents5 = max(localExtents5, (c2 + h2));
                            }
                            else
                            {
                                localExtents0 = min(localExtents0, - h0);
                                localExtents1 = min(localExtents1, - h1);
                                localExtents2 = min(localExtents2, - h2);

                                localExtents3 = max(localExtents3, + h0);
                                localExtents4 = max(localExtents4, + h1);
                                localExtents5 = max(localExtents5, + h2);
                            }
                        }
                    }
                }

                localExtents = new this.arrayConstructor(6);
                localExtents[0] = localExtents0;
                localExtents[1] = localExtents1;
                localExtents[2] = localExtents2;
                localExtents[3] = localExtents3;
                localExtents[4] = localExtents4;
                localExtents[5] = localExtents5;
                this.localExtents = localExtents;
                hasExtents = true;
            }
        }
        if (hasExtents)
        {
            localExtents = this.localExtents;

            center = (this.localExtentsCenter || new this.arrayConstructor(3));
            center[0] = (localExtents[3] + localExtents[0]) * 0.5;
            center[1] = (localExtents[4] + localExtents[1]) * 0.5;
            center[2] = (localExtents[5] + localExtents[2]) * 0.5;
            this.localExtentsCenter = center;

            halfExtents = (this.localHalfExtents || new this.arrayConstructor(3));
            halfExtents[0] = (localExtents[3] - center[0]);
            halfExtents[1] = (localExtents[4] - center[1]);
            halfExtents[2] = (localExtents[5] - center[2]);
            this.localHalfExtents = halfExtents;
        }
        else
        {
            delete this.localExtents;
            delete this.localExtentsCenter;
            delete this.localHalfExtents;
        }

        this.dirtyLocalExtents = false;
    };

    //
    //getLocalExtents
    //
    getLocalExtents()
    {
        if (this.dirtyLocalExtents)
        {
            this.updateLocalExtents();
        }
        return this.localExtents; //Can be undefined if no local extents. These are not transformed by the local transform matrix.
    };

    //
    //updateWorldExtents
    //
    updateWorldExtents()
    {
        if (this.dirtyWorldExtents)
        {
            if (this.customWorldExtents)
            {
                this.worldExtents = this.customWorldExtents;
            }
            else
            {
                if (this.dirtyLocalExtents)
                {
                    this.updateLocalExtents();
                }

                var worldExtents;

                if (this.numCustomRenderableWorldExtents)
                {
                    var index, renderable, extents, minX, minY, minZ, maxX, maxY, maxZ;
                    var renderables = this.renderables;
                    var numRenderables = renderables.length;
                    var empty = true;

                    for (index = 0; index < numRenderables; index += 1)
                    {
                        renderable = renderables[index];
                        extents = renderable.getCustomWorldExtents();
                        if (extents)
                        {
                            minX = extents[0];
                            minY = extents[1];
                            minZ = extents[2];
                            maxX = extents[3];
                            maxY = extents[4];
                            maxZ = extents[5];
                            index += 1;
                            empty = false;
                            break;
                        }
                    }

                    for (; index < numRenderables; index += 1)
                    {
                        renderable = renderables[index];
                        extents = renderable.getCustomWorldExtents();
                        if (extents)
                        {
                            if (minX > extents[0])
                            {
                                minX = extents[0];
                            }
                            if (minY > extents[1])
                            {
                                minY = extents[1];
                            }
                            if (minZ > extents[2])
                            {
                                minZ = extents[2];
                            }

                            if (maxX < extents[3])
                            {
                                maxX = extents[3];
                            }
                            if (maxY < extents[4])
                            {
                                maxY = extents[4];
                            }
                            if (maxZ < extents[5])
                            {
                                maxZ = extents[5];
                            }
                        }
                    }

                    if (empty)
                    {
                        // This should not happen...
                        delete this.worldExtents;
                    }
                    else
                    {
                        worldExtents = this.worldExtents;
                        if (!worldExtents)
                        {
                            worldExtents = new this.arrayConstructor(6);
                            this.worldExtents = worldExtents;
                        }
                        worldExtents[0] = minX;
                        worldExtents[1] = minY;
                        worldExtents[2] = minZ;
                        worldExtents[3] = maxX;
                        worldExtents[4] = maxY;
                        worldExtents[5] = maxZ;
                    }
                }
                else if (this.localExtents)
                {
                    //get center and half extents
                    var localExtentsCenter = this.localExtentsCenter;
                    var localHalfExtents = this.localHalfExtents;
                    var c0 = localExtentsCenter[0];
                    var c1 = localExtentsCenter[1];
                    var c2 = localExtentsCenter[2];
                    var h0 = localHalfExtents[0];
                    var h1 = localHalfExtents[1];
                    var h2 = localHalfExtents[2];

                    var world = this.world;
                    var m0 = world[0];
                    var m1 = world[1];
                    var m2 = world[2];
                    var m3 = world[3];
                    var m4 = world[4];
                    var m5 = world[5];
                    var m6 = world[6];
                    var m7 = world[7];
                    var m8 = world[8];

                    var ct0 = world[9];
                    var ct1 = world[10];
                    var ct2 = world[11];
                    if (c0 !== 0 ||
                        c1 !== 0 ||
                        c2 !== 0)
                    {
                        ct0 += (m0 * c0 + m3 * c1 + m6 * c2);
                        ct1 += (m1 * c0 + m4 * c1 + m7 * c2);
                        ct2 += (m2 * c0 + m5 * c1 + m8 * c2);
                    }

                    var ht0 = ((m0 < 0 ? -m0 : m0) * h0 + (m3 < 0 ? -m3 : m3) * h1 + (m6 < 0 ? -m6 : m6) * h2);
                    var ht1 = ((m1 < 0 ? -m1 : m1) * h0 + (m4 < 0 ? -m4 : m4) * h1 + (m7 < 0 ? -m7 : m7) * h2);
                    var ht2 = ((m2 < 0 ? -m2 : m2) * h0 + (m5 < 0 ? -m5 : m5) * h1 + (m8 < 0 ? -m8 : m8) * h2);

                    worldExtents = this.worldExtents;
                    if (!worldExtents)
                    {
                        worldExtents = new this.arrayConstructor(6);
                        this.worldExtents = worldExtents;
                    }
                    worldExtents[0] = (ct0 - ht0);
                    worldExtents[1] = (ct1 - ht1);
                    worldExtents[2] = (ct2 - ht2);
                    worldExtents[3] = (ct0 + ht0);
                    worldExtents[4] = (ct1 + ht1);
                    worldExtents[5] = (ct2 + ht2);
                }
                else
                {
                    //no object with size so no extents.
                    delete this.worldExtents;
                }
            }

            this.dirtyWorldExtents = false;
            this.worldExtentsUpdate = true;

            this.checkUpdateRequired();
        }
    };

    //
    //getWorldExtents
    //
    getWorldExtents()
    {   //This is its own extents, not it and all its children.
        if (this.dirtyWorldExtents)
        {
            this.updateWorldExtents();
        }
        return this.worldExtents;
    };

    //
    //addCustomLocalExtents
    //
    addCustomLocalExtents(localExtents)
    {
        var customWorldExtents = this.customWorldExtents;
        if (!customWorldExtents)
        {
            this.customWorldExtents = localExtents.slice();
        }
        else
        {
            customWorldExtents[0] = localExtents[0];
            customWorldExtents[1] = localExtents[1];
            customWorldExtents[2] = localExtents[2];
            customWorldExtents[3] = localExtents[3];
            customWorldExtents[4] = localExtents[4];
            customWorldExtents[5] = localExtents[5];
        }
        this.dirtyWorldExtents = true;
        this.dirtyLocalExtents = true;
        this.updateRequired();
    };

    //
    //removeCustomLocalExtents
    //
    removeCustomLocalExtents()
    {
        delete this.customLocalExtents;
        this.dirtyWorldExtents = true;
        this.dirtyLocalExtents = true;
        this.updateRequired();
    };

    //
    //getCustomLocalExtents
    //
    getCustomLocalExtents()
    {
        return this.customLocalExtents;
    };

    //
    //addCustomWorldExtents
    //
    addCustomWorldExtents(worldExtents)
    {
        var customWorldExtents = this.customWorldExtents;
        if (!customWorldExtents)
        {
            this.customWorldExtents = worldExtents.slice();
        }
        else
        {
            customWorldExtents[0] = worldExtents[0];
            customWorldExtents[1] = worldExtents[1];
            customWorldExtents[2] = worldExtents[2];
            customWorldExtents[3] = worldExtents[3];
            customWorldExtents[4] = worldExtents[4];
            customWorldExtents[5] = worldExtents[5];
        }
        this.dirtyWorldExtents = true;
        this.updateRequired();
    };

    //
    //removeCustomWorldExtents
    //
    removeCustomWorldExtents()
    {
        delete this.customWorldExtents;
        this.dirtyWorldExtents = true;
        this.updateRequired();
    };

    //
    //getCustomWorldExtents
    //
    getCustomWorldExtents()
    {
        return this.customWorldExtents;
    };

    //
    //renderableWorldExtentsUpdated
    //
    renderableWorldExtentsUpdated(wasAlreadyCustom)
    {
        if (!this.customWorldExtents)
        {
            this.dirtyWorldExtents = true;
            this.updateRequired();
        }

        if (!wasAlreadyCustom)
        {
            this.dirtyLocalExtents = true;
            this.numCustomRenderableWorldExtents = this.numCustomRenderableWorldExtents ? this.numCustomRenderableWorldExtents + 1 : 1;
        }
    };

    //
    //renderableWorldExtentsRemoved
    //
    renderableWorldExtentsRemoved()
    {
        if (!this.customWorldExtents)
        {
            this.dirtyWorldExtents = true;
            this.updateRequired();
        }
        this.dirtyLocalExtents = true;
        this.numCustomRenderableWorldExtents -= 1;
    };

    //
    //calculateHierarchyWorldExtents
    //
    calculateHierarchyWorldExtents()
    {
        var calculateNodeExtents =
            function calculateNodeExtentsFn(sceneNode, totalExtents)
        {
            var valid = false;

            var worldExtents = sceneNode.getWorldExtents();
            if (worldExtents)
            {
                totalExtents[0] = (totalExtents[0] < worldExtents[0] ? totalExtents[0] : worldExtents[0]);
                totalExtents[1] = (totalExtents[1] < worldExtents[1] ? totalExtents[1] : worldExtents[1]);
                totalExtents[2] = (totalExtents[2] < worldExtents[2] ? totalExtents[2] : worldExtents[2]);
                totalExtents[3] = (totalExtents[3] > worldExtents[3] ? totalExtents[3] : worldExtents[3]);
                totalExtents[4] = (totalExtents[4] > worldExtents[4] ? totalExtents[4] : worldExtents[4]);
                totalExtents[5] = (totalExtents[5] > worldExtents[5] ? totalExtents[5] : worldExtents[5]);
                valid = true;
            }

            var children = sceneNode.children;
            if (children)
            {
                var numChildren = children.length;
                for (var n = 0; n < numChildren; n += 1)
                {
                    valid = (calculateNodeExtents(children[n], totalExtents) || valid);
                }
            }

            return valid;
        }

        var maxValue = Number.MAX_VALUE;
        var totalExtents = new this.arrayConstructor(6);
        totalExtents[0] = maxValue;
        totalExtents[1] = maxValue;
        totalExtents[2] = maxValue;
        totalExtents[3] = -maxValue;
        totalExtents[4] = -maxValue;
        totalExtents[5] = -maxValue;

        if (calculateNodeExtents(this, totalExtents))
        {
            return totalExtents;
        }
        else
        {
            return undefined;
        }
    };

    //
    //addRenderable
    //
    addRenderable(renderable: Renderable)
    {
        this.dirtyWorldExtents = true;
        this.updateRequired();
        if (!this.renderables)
        {
            this.renderables = [];
        }
        this.renderables.push(renderable);
        renderable.setNode(this);
        this.dirtyLocalExtents = true;
    };

    //
    //addRenderableArray
    //
    addRenderableArray(additionalRenderables)
    {
        this.dirtyWorldExtents = true;
        this.updateRequired();
        if (!this.renderables)
        {
            this.renderables = [];
        }
        var renderables = this.renderables;
        var length = additionalRenderables.length;
        for (var index = 0; index < length; index += 1)
        {
            renderables.push(additionalRenderables[index]);
            additionalRenderables[index].setNode(this);
        }
        this.dirtyLocalExtents = true;
    };

    //
    //removeRenderable
    //
    removeRenderable(renderable)
    {
        this.dirtyWorldExtents = true;
        this.updateRequired();
        var renderables = this.renderables;
        var numRenderables = renderables.length;
        for (var index = 0; index < numRenderables; index += 1)
        {
            if (renderables[index] === renderable)
            {
                renderables[index].setNode(null);
                renderables.splice(index, 1);
                this.dirtyLocalExtents = true;
                return;
            }
        }
        debug.abort("Invalid renderable");
    };

    //
    //hasRenderables
    //
    hasRenderables() : bool
    {
        return (this.renderables && this.renderables.length) ? true : false;
    };

    //
    //addLightInstance
    //
    addLightInstance(lightInstance)
    {
        this.dirtyWorldExtents = true;
        this.updateRequired();
        if (!this.lightInstances)
        {
            this.lightInstances = [];
        }
        this.lightInstances.push(lightInstance);
        lightInstance.setNode(this);
        this.dirtyLocalExtents = true;
    };

    //
    //addLightInstanceArray
    //
    addLightInstanceArray(additionalLightInstances)
    {
        this.dirtyWorldExtents = true;
        this.updateRequired();
        if (!this.lightInstances)
        {
            this.lightInstances = [];
        }

        var lightInstances = this.lightInstances;
        var length = additionalLightInstances.length;
        for (var index = 0; index < length; index += 1)
        {
            additionalLightInstances[index].setNode(this);
            lightInstances.push(additionalLightInstances[index]);
        }

        this.dirtyLocalExtents = true;
    };

    //
    //removeLightInstance
    //
    removeLightInstance(lightInstance)
    {
        this.dirtyWorldExtents = true;
        this.updateRequired();
        var lightInstances = this.lightInstances;
        var numLights = lightInstances.length;
        for (var index = 0; index < numLights; index += 1)
        {
            if (lightInstances[index] === lightInstance)
            {
                lightInstance.setNode(null);
                lightInstances.splice(index, 1);
                this.dirtyLocalExtents = true;
                return;
            }
        }
        debug.abort("Invalid light");
    };

    //
    //hasLightInstances
    //
    hasLightInstances(): bool
    {
        return <bool><any>(this.lightInstances && this.lightInstances.length);
    };

    //
    //destroy
    //
    destroy()
    {
        //Should only be called when parent is null
        debug.assert(!this.parent, "SceneNode should be remove from parent before destroy is called");

        if (this.destroyedObserver)
        {
            this.destroyedObserver.notify({node: this});
        }

        var children = this.children;
        if (children)
        {
            var numChildren = children.length;
            for (var childIndex = numChildren - 1;  childIndex >= 0; childIndex -= 1)
            {
                var child = children[childIndex];
                this.removeChild(child);
                child.destroy();
            }
        }

        var renderables = this.renderables;
        if (renderables)
        {
            var numRenderables = renderables.length;
            for (var renderableIndex = numRenderables - 1; renderableIndex >= 0; renderableIndex -= 1)
            {
                var renderable = renderables[renderableIndex];
                if (renderable.destroy)
                {
                    renderable.destroy();
                }
            }
            this.renderables = [];
        }

        if (this.lightInstances)
        {
            this.lightInstances = [];
        }

        delete this.scene;
    };

    //
    //subscribeCloned
    //
    subscribeCloned(observerFunction)
    {
        if (!this.clonedObserver)
        {
            this.clonedObserver = Observer.create();
        }
        this.clonedObserver.subscribe(observerFunction);
    };

    //
    //unsubscribeCloned
    //
    unsubscribeCloned(observerFunction)
    {
        this.clonedObserver.unsubscribe(observerFunction);
    };

    //
    //subscribeDestroyed
    //
    subscribeDestroyed(observerFunction)
    {
        if (!this.destroyedObserver)
        {
            this.destroyedObserver = Observer.create();
        }
        this.destroyedObserver.subscribe(observerFunction);
    };

    //
    //unsubscribeDestroyed
    //
    unsubscribeDestroyed(observerFunction)
    {
        this.destroyedObserver.unsubscribe(observerFunction);
    };

    //
    //SceneNode.create
    //
    static create(params) : SceneNode
    {
        var sceneNode = new SceneNode();
        sceneNode.name = params.name;

        var md = TurbulenzEngine.getMathDevice();
        sceneNode.mathDevice = md;

        if (params.dynamic)
        {
            sceneNode.dynamic = params.dynamic;
        }
        if (params.disabled)
        {
            sceneNode.disabled = params.disabled;
        }

        sceneNode.dirtyWorldExtents = true;
        sceneNode.dirtyLocalExtents = true;
        sceneNode.worldUpdate = 0; //Counter of number of times modified.

        var local = params.local;
        if (local)
        {
            sceneNode.local = md.m43Copy(local);
        }
        else
        {
            sceneNode.local = md.m43BuildIdentity();
        }
        local = sceneNode.local;
        sceneNode.world = md.m43Copy(local);

        return sceneNode;
    };
};

// Detect correct typed arrays
(function () {
    SceneNode.prototype.arrayConstructor = Array;
    if (typeof Float32Array !== "undefined")
    {
        var testArray = new Float32Array(4);
        var textDescriptor = Object.prototype.toString.call(testArray);
        if (textDescriptor === '[object Float32Array]')
        {
            SceneNode.prototype.arrayConstructor = Float32Array;
        }
    }
}());
