// Copyright (c) 2010-2013 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global Reference: false*/

/// <reference path="turbulenz.d.ts" />
/// <reference path="material.ts" />
/// <reference path="animation.ts" />

//
// Surface
//
// TODO: Is there an inheritance relationship with Geometry?
interface Surface
{
    first        : number;
    numVertices  : number;
    primitive    : number; // GraphicsDevicePrimitive

    numIndices?  : number;
    vertexData?  : any;    // [] or ArrayBufferView
    indexData?   : any;    // [] or ArrayBufferView

    indexBuffer? : IndexBuffer;
};

//
// Geometry
//
class Geometry
{
    static version = 1;

    name                   : string;
    type                   : string;
    center                 : any; // v3?
    halfExtents            : any; // v3
    reference              : Reference;

    primitive              : number;
    semantics              : Semantics;
    vertexBuffer           : VertexBuffer;
    //numVertices            : number;
    baseIndex              : number;
    indexBuffer            : IndexBuffer;
    numIndices             : number;

    skeleton               : Skeleton;
    surfaces               : any; // { [name: string]: Surface; };

    vertexData             : any;
    indexData              : any;
    first                  : number;

    vertexBufferAllocation : any;
    vertexBufferManager    : VertexBufferManager;
    indexBufferAllocation  : any;
    indexBufferManager     : IndexBufferManager;

    destroy()
    {
        if (this.vertexBufferAllocation)
        {
            this.vertexBufferManager.free(this.vertexBufferAllocation);
            delete this.vertexBufferManager;
            delete this.vertexBufferAllocation;
        }
        if (this.indexBufferAllocation)
        {
            this.indexBufferManager.free(this.indexBufferAllocation);
            delete this.indexBufferManager;
            delete this.indexBufferAllocation;
        }
        delete this.vertexBuffer;
        delete this.indexBuffer;
        delete this.vertexData;
        delete this.indexData;
        delete this.semantics;
        delete this.first;
        delete this.halfExtents;
        delete this.reference;
        delete this.surfaces;
    };

    static create() : Geometry
    {
        var geometry = new Geometry();
        geometry.reference = Reference.create(geometry);
        geometry.surfaces = {};
        geometry.type = "rigid";
        return geometry;
    };
};

//
// GeometryInstance
//
class GeometryInstance implements Renderable
{
    static version = 1;
    maxUpdateValue = Number.MAX_VALUE;

    // Renderable
    geometry            : Geometry;
    geometryType        : string;
    node                : SceneNode;

    renderUpdate        : any;
    rendererInfo        : any;
    distance            : number;
    drawParameters      : DrawParameters[];

    // GeometryInstance
    // TODO: Potentially some of these belong on Renderable too

    surface             : Surface;
    halfExtents         : any; // v3
    center              : any; // v3
    worldExtents        : any; // new instance.arrayConstructor(6);
    semantics           : Semantics;
    techniqueParameters : TechniqueParameters;
    sharedMaterial      : Material;
    worldExtentsUpdate  : number;
    worldUpdate         : number;
    disabled            : bool;
    sorting             : number; // TODO: can't see any ref to this in jslib.  Is it used?

    arrayConstructor: any; // array constructor

    //
    // clone
    //
    clone() : GeometryInstance
    {
        var newInstance = GeometryInstance.create(this.geometry,
                                                  this.surface,
                                                  this.sharedMaterial);

        if (this.disabled)
        {
            newInstance.disabled = true;
        }

        return newInstance;
    };

    //
    // isSkinned
    //
    isSkinned() : bool
    {
        if (this.geometry.skeleton)
        {
            return true;
        }
        return false;
    };

    //
    // setNode
    //
    setNode(node)
    {
        if (this.node)
        {
            if (this.hasCustomWorldExtents())
            {
                this.node.renderableWorldExtentsRemoved();
            }
        }

        this.node = node;

        if (this.node)
        {
            if (this.hasCustomWorldExtents())
            {
                this.node.renderableWorldExtentsUpdated(false);
            }
        }
        this.worldExtentsUpdate = -1;
    };

    //
    // getNode
    //
    getNode(): SceneNode
    {
        return this.node;
    };

    //
    // setMaterial
    //
    setMaterial(material)
    {
        material.reference.add();
        this.sharedMaterial.reference.remove();

        this.sharedMaterial = material;

        this.renderUpdate = undefined;
        this.rendererInfo = undefined;
    };

    //
    // getMaterial
    //
    getMaterial() : Material
    {
        return this.sharedMaterial;
    };

    //
    // getWorldExtents
    //
    getWorldExtents()
    {
        //Note: This method is only valid on a clean node.
        var worldExtents = this.worldExtents;
        var node = this.node;
        if (node.worldUpdate > this.worldExtentsUpdate)
        {
            this.worldExtentsUpdate = node.worldUpdate;

            var center = this.center;
            var halfExtents = this.halfExtents;

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
            if (center)
            {
                var c0 = center[0];
                var c1 = center[1];
                var c2 = center[2];
                ct0 += (m0 * c0 + m3 * c1 + m6 * c2);
                ct1 += (m1 * c0 + m4 * c1 + m7 * c2);
                ct2 += (m2 * c0 + m5 * c1 + m8 * c2);
            }

            var h0 = halfExtents[0];
            var h1 = halfExtents[1];
            var h2 = halfExtents[2];
            var ht0 = ((m0 < 0 ? -m0 : m0) * h0 + (m3 < 0 ? -m3 : m3) * h1 + (m6 < 0 ? -m6 : m6) * h2);
            var ht1 = ((m1 < 0 ? -m1 : m1) * h0 + (m4 < 0 ? -m4 : m4) * h1 + (m7 < 0 ? -m7 : m7) * h2);
            var ht2 = ((m2 < 0 ? -m2 : m2) * h0 + (m5 < 0 ? -m5 : m5) * h1 + (m8 < 0 ? -m8 : m8) * h2);

            worldExtents[0] = (ct0 - ht0);
            worldExtents[1] = (ct1 - ht1);
            worldExtents[2] = (ct2 - ht2);
            worldExtents[3] = (ct0 + ht0);
            worldExtents[4] = (ct1 + ht1);
            worldExtents[5] = (ct2 + ht2);
        }
        return worldExtents;
    };

    //
    // addCustomWorldExtents
    //
    addCustomWorldExtents(customWorldExtents)
    {
        var worldExtents = this.worldExtents;
        worldExtents[0] = customWorldExtents[0];
        worldExtents[1] = customWorldExtents[1];
        worldExtents[2] = customWorldExtents[2];
        worldExtents[3] = customWorldExtents[3];
        worldExtents[4] = customWorldExtents[4];
        worldExtents[5] = customWorldExtents[5];
        var alreadyHadCustomExtents = (this.worldExtentsUpdate === this.maxUpdateValue);
        this.worldExtentsUpdate = this.maxUpdateValue;
        this.node.renderableWorldExtentsUpdated(alreadyHadCustomExtents);
    };

    //
    // removeCustomWorldExtents
    //
    removeCustomWorldExtents()
    {
        this.worldExtentsUpdate = -1;
        this.node.renderableWorldExtentsRemoved();
    };

    //
    // getCustomWorldExtents
    //
    getCustomWorldExtents()
    {
        if (this.worldExtentsUpdate === this.maxUpdateValue)
        {
            return this.worldExtents;
        }
        return undefined;
    };

    //
    // hasCustomWorldExtents
    //
    hasCustomWorldExtents() : bool
    {
        return this.worldExtentsUpdate === this.maxUpdateValue;
    };

    //
    // destroy
    //
    destroy()
    {
        if (this.geometry.reference)
        {
            this.geometry.reference.remove();
        }

        if (this.sharedMaterial.reference)
        {
            this.sharedMaterial.reference.remove();
        }

        delete this.surface;
        delete this.geometry;
        delete this.sharedMaterial;
        delete this.techniqueParameters;
        delete this.halfExtents;
        delete this.center;
        delete this.worldExtentsUpdate;
        delete this.drawParameters;
        delete this.renderUpdate;
        delete this.rendererInfo;
        delete this.sorting;
    };

    //
    // prepareDrawParameters
    //
    prepareDrawParameters(drawParameters)
    {
        var surface = this.surface;
        var geometry = this.geometry;
        drawParameters.setVertexBuffer(0, geometry.vertexBuffer);
        drawParameters.setSemantics(0, this.semantics);

        drawParameters.primitive = surface.primitive;

        drawParameters.firstIndex = surface.first;

        if (surface.indexBuffer)
        {
            drawParameters.indexBuffer = surface.indexBuffer;
            drawParameters.count = surface.numIndices;
        }
        else
        {
            drawParameters.count = surface.numVertices;
        }
    };

    //
    // Constructor function
    //
    static create(geometry: Geometry, surface: Surface,
                  sharedMaterial: Material) : GeometryInstance
    {
        var instance = new GeometryInstance();
        var graphicsDevice = TurbulenzEngine.getGraphicsDevice(); //Maybe null when running on the server.

        instance.geometry = geometry;
        instance.geometry.reference.add();
        instance.geometryType = geometry.type;
        instance.surface = surface;
        instance.semantics = geometry.semantics;

        instance.halfExtents = geometry.halfExtents;
        instance.center = geometry.center;

        instance.techniqueParameters = graphicsDevice ? graphicsDevice.createTechniqueParameters(): null;
        instance.sharedMaterial = sharedMaterial;
        if (instance.sharedMaterial)
        {
            instance.sharedMaterial.reference.add();
        }
        instance.worldExtents = new instance.arrayConstructor(6);
        instance.worldExtentsUpdate = -1;
        instance.worldUpdate = -1;

        instance.node = undefined;
        instance.renderUpdate = undefined;
        instance.rendererInfo = undefined;

        return instance;
    };
};

// Detect correct typed arrays
(function () {
    GeometryInstance.prototype.arrayConstructor = Array;
    if (typeof Float32Array !== "undefined")
    {
        var testArray = new Float32Array(4);
        var textDescriptor = Object.prototype.toString.call(testArray);
        if (textDescriptor === '[object Float32Array]')
        {
            GeometryInstance.prototype.arrayConstructor = Float32Array;
        }
    }
}());
