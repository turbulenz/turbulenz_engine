// Copyright (c) 2010-2011 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global renderingCommonGetTechniqueIndexFn: false*/
/*global Effect: false*/
/*global VertexBufferManager: false*/
/*global Geometry: false*/
/*global Reference: false*/
/*exported loadCustomFileShapeFn*/

//
//  loadCustomFileShapeFn
//
var loadCustomFileShape = function loadCustomFileShapeFn(shapeName, shape, fileShape, loadParams)
{
    //
    //  Custom geometry loading function:
    //
    //  This function is a custom implementation to load shape data in a way
    //  that supports our custom geometry type, in this case morph targets
    //
    //  Differences from standard geometry loading function:
    //
    //      * Optional use of vertexBufferManager (allows vertexBuffer per shape)
    //      * Custom shape is passed as an argument to the function

    var cachedSemantics = [];

    var graphicsDevice = loadParams.graphicsDevice;
    var dynamicVertexBuffers = false || (loadParams.dynamicVertexBuffers);
    var useVertexBufferManager = false || (loadParams.useVertexBufferManager);

    var sources = fileShape.sources;
    var inputs = fileShape.inputs;

    if (graphicsDevice)
    {
        // First calculate data about the vertex streams
        var offset, stride;
        var maxOffset = 0;
        var vertexSources = [];
        for (var input in inputs)
        {
            if (inputs.hasOwnProperty(input))
            {
                var fileInput = inputs[input];
                offset = fileInput.offset;
                if (offset > maxOffset)
                {
                    maxOffset = offset;
                }
                var fileSource = sources[fileInput.source];
                vertexSources.push({
                    semantic: input,
                    offset: offset,
                    data: fileSource.data,
                    stride: fileSource.stride
                });
            }
        }
        var indicesPerVertex = (maxOffset + 1);

        if (0 < maxOffset)
        {
            var vertexSourcesCompare = function (vertexSourceA, vertexSourceB)
            {
                return (vertexSourceA.offset - vertexSourceB.offset);
            };
            vertexSources.sort(vertexSourcesCompare);
        }

        var numVertexSources = vertexSources.length;
        var semanticsNames = [];
        var attributes = [];
        var vs, vertexSource;
        for (vs = 0; vs < numVertexSources; vs += 1)
        {
            vertexSource = vertexSources[vs];
            semanticsNames[vs] = vertexSource.semantic;
            attributes[vs] = ("FLOAT" + vertexSource.stride);
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

        var vertexBufferManager = (loadParams.vertexBufferManager || this.vertexBufferManager);
        if (!vertexBufferManager)
        {
            vertexBufferManager = VertexBufferManager.create(graphicsDevice);
            this.vertexBufferManager = vertexBufferManager;
        }

        var surface;
        var destSurface;
        var faces;
        for (var s in surfaces)
        {
            if (surfaces.hasOwnProperty(s))
            {
                surface = surfaces[s];
                destSurface = {};
                shape.surfaces[s] = destSurface;

                faces = surface.triangles;
                var primitive, vertexPerPrimitive;
                if (faces)
                {
                    primitive = graphicsDevice.PRIMITIVE_TRIANGLES;
                    vertexPerPrimitive = 3;
                }
                else
                {
                    faces = surface.lines;
                    if (faces)
                    {
                        primitive = graphicsDevice.PRIMITIVE_LINES;
                        vertexPerPrimitive = 2;
                    }
                }
                destSurface.primitive = primitive;
                destSurface.faces = faces;

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
                    }
                    totalNumVertices += numVertices;
                }
            }
        }

        var baseIndex;
        var vertexbuffer = null;
        if (useVertexBufferManager)
        {
            // Use the vertexBufferManager to allocate a static buffer
            var vertexBufferAllocation = vertexBufferManager.allocate(totalNumVertices, attributes);
            vertexbuffer = vertexBufferAllocation.vertexBuffer;
            if (!vertexbuffer)
            {
                return undefined;
            }
            shape.vertexBuffer = vertexbuffer;
            shape.vertexBufferManager = vertexBufferManager;
            shape.vertexBufferAllocation = vertexBufferAllocation;

            baseIndex = vertexBufferAllocation.baseIndex;
        }
        else
        {
            // Create a new vertexBuffer for the shape
            var vertexbufferParameters =
            {
                attributes: attributes,
                numVertices: totalNumVertices,
                dynamic: dynamicVertexBuffers
            };
            vertexbuffer = graphicsDevice.createVertexBuffer(vertexbufferParameters);
            if (!vertexbuffer)
            {
                return undefined;
            }
            shape.vertexBuffer = vertexbuffer;
            baseIndex = 0;
        }

        for (s in surfaces)
        {
            if (surfaces.hasOwnProperty(s))
            {
                surface = surfaces[s];
                destSurface = shape.surfaces[s];

                var indexbuffer = null;
                var numIndices;
                var writer, write;
                var data = [];
                var sourceData;
                var t, i, n;
                var nextIndex, index;
                var firstVertex = baseIndex;

                faces = destSurface.faces;
                delete destSurface.faces;

                if (faces)
                {
                    if (1 < indicesPerVertex)
                    {
                        numVertices = destSurface.numVertices;

                        var maxSurfaceOffset = (faces.length / numVertices);

                        writer = vertexbuffer.map(baseIndex, numVertices);
                        if (writer)
                        {
                            write = (writer.write || writer);

                            if (maxSurfaceOffset === numVertexSources)
                            {
                                for (t = 0, i = 0; t < numVertices; t += 1)
                                {
                                    n = 0;
                                    vs = 0;
                                    do
                                    {
                                        vertexSource = vertexSources[vs];
                                        sourceData = vertexSource.data;
                                        stride = vertexSource.stride;
                                        index = (faces[i] * stride);
                                        nextIndex = (index + stride);
                                        do
                                        {
                                            data[n] = sourceData[index];
                                            n += 1;
                                            index += 1;
                                        }
                                        while (index < nextIndex);
                                        vs += 1;
                                        i += 1;
                                    }
                                    while (vs < numVertexSources);

                                    write.apply(writer, data);
                                }
                            }
                            else
                            {
                                for (t = 0, i = 0; t < numVertices; t += 1)
                                {
                                    n = 0;
                                    vs = 0;
                                    do
                                    {
                                        vertexSource = vertexSources[vs];
                                        sourceData = vertexSource.data;
                                        stride = vertexSource.stride;
                                        offset = vertexSource.offset;
                                        if (offset < maxSurfaceOffset)
                                        {
                                            index = (faces[i + offset] * stride);
                                            nextIndex = (index + stride);
                                            do
                                            {
                                                data[n] = sourceData[index];
                                                n += 1;
                                                index += 1;
                                            }
                                            while (index < nextIndex);
                                        }
                                        else
                                        {
                                            nextIndex = (n + stride);
                                            do
                                            {
                                                data[n] = 0;
                                                n += 1;
                                            }
                                            while (n < nextIndex);
                                        }
                                        vs += 1;
                                    }
                                    while (vs < numVertexSources);

                                    write.apply(writer, data);

                                    i += maxSurfaceOffset;
                                }
                            }

                            vertexbuffer.unmap(writer);

                            baseIndex += numVertices;

                            write = null;
                            writer = null;
                        }
                    }
                    else
                    {
                        numIndices = faces.length;
                        numVertices = (vertexSources[0].data.length / vertexSources[0].stride);

                        // extract data
                        if (numVertices === 4 && numIndices === 6 && surface.triangles)
                        {
                            destSurface.primitive = graphicsDevice.PRIMITIVE_TRIANGLE_STRIP;
                            numIndices = 4;

                            if (faces[3] !== 0 && faces[4] !== 0 && faces[5] !== 0)
                            {
                                faces = [0, 2, 1, 3];
                            }
                            else if (faces[3] !== 1 && faces[4] !== 1 && faces[5] !== 1)
                            {
                                faces = [1, 0, 2, 3];
                            }
                            else //if (faces[3] !== 2 && faces[4] !== 2 && faces[5] !== 2)
                            {
                                faces = [3, 0, 1, 2];
                            }

                            writer = vertexbuffer.map(baseIndex, 4);
                            if (writer)
                            {
                                write = (writer.write || writer);

                                for (i = 0; i < numIndices; i += 1)
                                {
                                    n = 0;
                                    vs = 0;
                                    do
                                    {
                                        vertexSource = vertexSources[vs];
                                        sourceData = vertexSource.data;
                                        stride = vertexSource.stride;
                                        index = (faces[i] * stride);
                                        nextIndex = (index + stride);
                                        do
                                        {
                                            data[n] = sourceData[index];
                                            n += 1;
                                            index += 1;
                                        }
                                        while (index < nextIndex);
                                        vs += 1;
                                    }
                                    while (vs < numVertexSources);

                                    write.apply(writer, data);
                                }

                                vertexbuffer.unmap(writer);

                                baseIndex += 4;

                                write = null;
                                writer = null;
                            }
                        }
                        else if (numVertices < numIndices)
                        {
                            writer = vertexbuffer.map(baseIndex, numVertices);
                            if (writer)
                            {
                                write = (writer.write || writer);

                                for (t = 0; t < numVertices; t += 1)
                                {
                                    n = 0;
                                    vs = 0;
                                    do
                                    {
                                        vertexSource = vertexSources[vs];
                                        sourceData = vertexSource.data;
                                        stride = vertexSource.stride;
                                        index = (t * stride);
                                        nextIndex = (index + stride);
                                        do
                                        {
                                            data[n] = sourceData[index];
                                            n += 1;
                                            index += 1;
                                        }
                                        while (index < nextIndex);
                                        vs += 1;
                                    }
                                    while (vs < numVertexSources);

                                    write.apply(writer, data);
                                }

                                baseIndex += numVertices;

                                vertexbuffer.unmap(writer);

                                write = null;
                                writer = null;
                            }

                            var indexbufferParameters =
                            {
                                numIndices: numIndices,
                                format: ((firstVertex + numVertices) <= 65536 ? 'USHORT' : 'UINT'),
                                dynamic: false
                            };
                            indexbuffer = graphicsDevice.createIndexBuffer(indexbufferParameters);
                            if (!indexbuffer)
                            {
                                window.alert("IndexBuffer not created.");
                            }

                            writer = indexbuffer.map();
                            if (writer)
                            {
                                if (0 !== firstVertex)
                                {
                                    if (surface.triangles)
                                    {
                                        for (t = 0; t < numIndices; t += 3)
                                        {
                                            writer(faces[t + 0] + firstVertex, faces[t + 1] + firstVertex, faces[t + 2] + firstVertex);
                                        }
                                    }
                                    else //if (surface.lines)
                                    {
                                        for (t = 0; t < numIndices; t += 2)
                                        {
                                            writer(faces[t + 0] + firstVertex, faces[t + 1] + firstVertex);
                                        }
                                    }
                                }
                                else
                                {
                                    if (surface.triangles)
                                    {
                                        for (t = 0; t < numIndices; t += 3)
                                        {
                                            writer(faces[t + 0], faces[t + 1], faces[t + 2]);
                                        }
                                    }
                                    else //if (surface.lines)
                                    {
                                        for (t = 0; t < numIndices; t += 2)
                                        {
                                            writer(faces[t + 0], faces[t + 1]);
                                        }
                                    }
                                }
                                indexbuffer.unmap(writer);

                                writer = null;
                            }
                        }
                        else
                        {
                            numVertices = numIndices;

                            writer = vertexbuffer.map(baseIndex, numVertices);
                            if (writer)
                            {
                                write = (writer.write || writer);

                                for (i = 0; i < numIndices; i += 1)
                                {
                                    n = 0;
                                    vs = 0;
                                    do
                                    {
                                        vertexSource = vertexSources[vs];
                                        sourceData = vertexSource.data;
                                        stride = vertexSource.stride;
                                        index = (faces[i] * stride);
                                        nextIndex = (index + stride);
                                        do
                                        {
                                            data[n] = sourceData[index];
                                            n += 1;
                                            index += 1;
                                        }
                                        while (index < nextIndex);
                                        vs += 1;
                                    }
                                    while (vs < numVertexSources);

                                    write.apply(writer, data);
                                }

                                vertexbuffer.unmap(writer);

                                baseIndex += numVertices;

                                write = null;
                                writer = null;
                            }
                        }
                    }
                    if (indexbuffer)
                    {
                        destSurface.indexBuffer = indexbuffer;
                        destSurface.numIndices = numIndices;
                    }
                    else
                    {
                        destSurface.numVertices = numVertices;
                        destSurface.first = firstVertex;
                    }
                }
                else
                {
                    delete shape.surfaces[s];
                }
            }
        }

        var semanticsHash = semanticsNames.join();
        var semantics = cachedSemantics[semanticsHash];
        if (!semantics)
        {
            semantics = graphicsDevice.createSemantics(semanticsNames);
            cachedSemantics[semanticsHash] = semantics;
        }
        shape.semantics = semantics;
        shape.semanticsNames = semanticsNames;

        if (noSurfaces)
        {
            surface = shape.surfaces.singleSurface;

            if (surface)
            {
                shape.primitive = surface.primitive;
                if (surface.indexBuffer)
                {
                    shape.indexBuffer = surface.indexBuffer;
                    shape.numIndices = surface.numIndices;
                }
                else
                {
                    shape.numVertices = surface.numVertices;
                    shape.first = surface.first;
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
            if (min0 !== -max0 || min1 !== -max1 || min2 !== -max2)
            {
                var c0 = (min0 + max0) * 0.5;
                var c1 = (min1 + max1) * 0.5;
                var c2 = (min2 + max2) * 0.5;
                shape.center      = [c0, c1, c2];
                shape.halfExtents = [(max0 - c0), (max1 - c1), (max2 - c2)];
            }
            else
            {
                shape.halfExtents = [(max0 - min0) * 0.5, (max1 - min1) * 0.5, (max2 - min2) * 0.5];
            }
        }
    }

    shape.name = shapeName;
    shape.reference.subscribeDestroyed(loadParams.onGeometryDestroyed);

    return shape;
};


//
// MorphShape
//
class MorphShape extends Geometry
{
    initialWeight: number;

    //
    // MorphShape Constructor
    //
    static create(initialWeight?): MorphShape
    {
        var m = <MorphShape>(Geometry.create());
        m.initialWeight = initialWeight;
        return m;
    }
}

//
// Morph
//
class Morph
{
    version = 1;

    //The maximum number of morphShapes supported (baseShape + shapes)
    maxMorphs = 4;

    // Creates the mapping for semantics in file to sematics for the
    // morph shader
    semanticMap = {
        POSITION    : [ "ATTR0", "ATTR10", "ATTR12", "ATTR14" ],
        NORMAL      : [ "ATTR2", "ATTR11", "ATTR13", "ATTR15" ],
        TEXCOORD    : [ "ATTR8", "ATTR7", "ATTR6", "ATTR5" ],
        POSITION0   : [ "ATTR0", "ATTR10", "ATTR12", "ATTR14" ],
        NORMAL0     : [ "ATTR2", "ATTR11", "ATTR13", "ATTR15" ],
        TEXCOORD0   : [ "ATTR8", "ATTR7", "ATTR6", "ATTR5" ]
    };

    // Lists the attributes, not used by the shader
    remainingAttributes = [ "ATTR1", "ATTR3", "ATTR9"];

    // Members

    reference: Reference;
    baseShape: Geometry;
    halfExtents: any; // AABB
    center: any; // v3
    type: string;
    semanticsNamesArray: string[];
    shapes: Geometry[];

    //
    // addShapes
    //
    addShapes(morphShapes)
    {
        var result = false;
        if (this.generateSemanticsNames(morphShapes))
        {
            this.shapes = morphShapes;
            result = true;
        }
        return result;
    }

    //
    // generateSemanticsNames
    //
    generateSemanticsNames(shapes)
    {
        var baseShape = this.baseShape;
        var shapesLen = shapes.length;
        var maxMorphs = this.maxMorphs;

        var maxTargetShapes = (shapesLen < maxMorphs) ? shapesLen + 1: maxMorphs;

        var semanticsNamesArray = [];
        var semanticMap = this.semanticMap;

        var remainingAttributes = this.remainingAttributes;

        function mapSematicNamesFn(semanticName, index)
        {
            var mappedNames = semanticMap[semanticName];
            if (mappedNames)
            {
                return mappedNames[index];
            }

            return null;
        }

        var inputs, input, semanticsNames, semanticsNamesLen, mappedName, shape, mappedNames, remainingAttributesLen, lastRemainingAttribute;
        for (var i = 0; i < maxTargetShapes; i += 1)
        {
            shape = (i === 0) ? baseShape: shapes[i - 1];
            semanticsNames = shape.semanticsNames;
            mappedNames = [];
            lastRemainingAttribute = 0;

            if (!semanticsNames)
            {
                semanticsNames = [];
                inputs = shape.inputs;
                for (input in inputs)
                {
                    if (inputs.hasOwnProperty(input))
                    {
                        semanticsNames[semanticsNames.length] = input;
                    }
                }
            }

            semanticsNamesLen = semanticsNames.length;
            for (var j = 0; j < semanticsNamesLen; j += 1)
            {
                mappedName = mapSematicNamesFn(semanticsNames[j], i);
                if (mappedName)
                {
                    mappedNames[mappedNames.length] = mappedName;
                }
                else
                {
                    // No mapping available, systematically use remaining attributes (Since they are ignored by the shader)
                    remainingAttributesLen = remainingAttributes.length;
                    if (lastRemainingAttribute < remainingAttributesLen)
                    {
                        mappedNames[mappedNames.length] = remainingAttributes[lastRemainingAttribute];
                        lastRemainingAttribute += 1;
                    }
                    else
                    {
                        // Fail when no more attributes exist
                        return false;
                    }
                }
            }

            semanticsNamesArray[i] = mappedNames;
        }
        this.semanticsNamesArray = semanticsNamesArray;
        return true;
    }

    getShapeCount()
    {
        return (this.shapes.length + 1);
    }

    //
    // destroy
    //
    destroy()
    {
        delete this.reference;
        delete this.baseShape;
        delete this.shapes;

        delete this.halfExtents;
        delete this.center;

        delete this.type;
        delete this.semanticsNamesArray;
    }

    //
    // Morph Constructor
    //
    static create(baseShape): Morph
    {
        var morph = new Morph();
        morph.reference = Reference.create(morph);
        morph.baseShape = baseShape;

        // Assumes that baseShape extents encapsulate all morphed shapes
        // To recalculate accurate extents, implement a custom getWorldExtents function
        morph.halfExtents = baseShape.halfExtents;
        morph.center = baseShape.center;

        morph.type = "morph";

        return morph;
    }
}

//
// MorphInstance
//
class MorphInstance
{
    version = 1;

    maxUpdateValue = Number.MAX_VALUE;

    morph: Morph;
    geometryType: string;
    halfExtents: any; // AAB
    center: any; // v3
    techniqueParameters: TechniqueParameters;
    sharedMaterial: Material;

    worldExtents: any; // AABB = [];
    worldUpdate: number;
    worldExtentsUpdate: number;

    sorting: any; // TODO: is this used?
    rendererInfo: any; // TODO: is this used?
    renderUpdate: any; // TODO: is this used?
    drawParameters: DrawParameters; // TODO: is this used?;

    node: SceneNode;

    cachedSemantics: { [hash: string]: Semantics; };
    semanticsHashes: string[];

    disabled: bool;

    //
    // clone
    //
    clone()
    {
        var newInstance = MorphInstance.create(this.morph, this.sharedMaterial);
        newInstance.halfExtents = this.halfExtents.slice();
        if (this.center)
        {
            newInstance.center = this.center.slice();
        }
        if (this.disabled)
        {
            newInstance.disabled = true;
        }

        newInstance.worldExtents = [];
        newInstance.worldExtentsUpdate = -1;

        return newInstance;
    }

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
    }

    //
    // getNode
    //
    getNode()
    {
        return this.node;
    }

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
    }

    //
    // getMaterial
    //
    getMaterial()
    {
        return this.sharedMaterial;
    }

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
    }

    //
    // addCustomWorldExtents
    //
    addCustomWorldExtents(customWorldExtents)
    {
        this.worldExtents = customWorldExtents.slice();
        var alreadyHadCustomExtents = (this.worldExtentsUpdate === this.maxUpdateValue);
        this.worldExtentsUpdate = this.maxUpdateValue;
        this.node.renderableWorldExtentsUpdated(alreadyHadCustomExtents);
    }

    //
    // removeCustomWorldExtents
    //
    removeCustomWorldExtents()
    {
        this.worldExtentsUpdate = -1;
        this.node.renderableWorldExtentsRemoved();
    }

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
    }

    //
    // hasCustomWorldExtents
    //
    hasCustomWorldExtents()
    {
        return this.worldExtentsUpdate === this.maxUpdateValue;
    }

    //
    // destroy
    //
    destroy()
    {
        if (this.morph.reference)
        {
            this.morph.reference.remove();
        }

        if (this.sharedMaterial.reference)
        {
            this.sharedMaterial.reference.remove();
        }

        delete this.morph;
        delete this.sharedMaterial;
        delete this.techniqueParameters;
        delete this.halfExtents;
        delete this.center;
        delete this.worldExtentsUpdate;
        delete this.drawParameters;
        delete this.sorting;
        delete this.cachedSemantics;
        delete this.semanticsHashes;
    }

    //
    // prepareDrawParameters
    //
    prepareDrawParameters(drawParameters)
    {
        var morph = this.morph;
        var shapeCount = morph.getShapeCount();
        var shapes = morph.shapes;
        var baseShape = morph.baseShape;

        var surfaces = baseShape.surfaces;
        var surface;

        // Obtains the primitive from the surface on the baseShape.
        // Assumes that the primitive is the same for all surfaces
        // If different primitive types are used, the shape should be broken down into multiple drawParameters
        for (var s in surfaces)
        {
            if (surfaces.hasOwnProperty(s))
            {
                surface = surfaces[s];
            }
        }

        var cachedSemantics = this.cachedSemantics;
        var semanticsHashes = this.semanticsHashes;

        drawParameters.setVertexBuffer(0, morph.baseShape.vertexBuffer);

        // If more vertex buffers exist than available semantics,
        // multiple semantic configurations can be created and the setSemantics call can be made during the update call
        drawParameters.setSemantics(0, cachedSemantics[semanticsHashes[0]]);

        for (var i = 1; i < shapeCount; i += 1)
        {
            drawParameters.setVertexBuffer(i, shapes[i - 1].vertexBuffer);
            drawParameters.setSemantics(i, cachedSemantics[semanticsHashes[i]]);
        }

        drawParameters.primitive = surface.primitive;

        if (surface.indexBuffer)
        {
            drawParameters.indexBuffer = surface.indexBuffer;
            drawParameters.count =  surface.numIndices;
        }
        else
        {
            drawParameters.firstIndex =  surface.first;
            drawParameters.count = surface.numVertices;
        }
    }

    //
    // generateSemantics
    //
    generateSemantics(graphicsDevice, semanticsNames)
    {
        var cachedSemantics = this.cachedSemantics;
        var semanticsHash = semanticsNames.join();
        var semantics = cachedSemantics[semanticsHash];
        if (!semantics)
        {
            semantics = graphicsDevice.createSemantics(semanticsNames);
            cachedSemantics[semanticsHash] = semantics;
        }
        return semanticsHash;
    }

    setWeights(weights)
    {
        this.techniqueParameters['morphWeights'] = weights;
    }

    //
    // registerEffects
    //
    static registerEffects(mathDevice, renderer, shaderManager, effectManager)
    {
        var defaultPrepareFn = renderer.defaultPrepareFn;
        var defaultUpdateFn = renderer.defaultUpdateFn;

        var effect;
        var effectTypeData;
        var morph = "morph";

        function morphPrepareFn(morphInstance)
        {
            DefaultRendering.defaultPrepareFn.call(this, morphInstance);
            var techniqueParameters = morphInstance.techniqueParameters;

            if (!techniqueParameters.morphWeights)
            {
                techniqueParameters.morphWeights = mathDevice.v3Build(0.0, 0.0, 0.0);
            }
        }

        function loadTechniques(shaderManager)
        {
            var that = this;

            var callback = function shaderLoadedCallbackFn(shader)
            {
                that.shader = shader;
                that.technique = shader.getTechnique(that.techniqueName);
                that.techniqueIndex = renderingCommonGetTechniqueIndexFn(that.techniqueName);
            };
            shaderManager.load(this.shaderName, callback);
        }

        //
        // morph
        //
        effect = Effect.create("morph");
        effectManager.add(effect);

        effectTypeData = {  prepare : morphPrepareFn,
                            shaderName : "shaders/morph.cgfx",
                            techniqueName : "morph",
                            update : defaultUpdateFn, // Uses the defaultUpdateFn from default renderer
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(morph, effectTypeData);

        //
        // debug_normals_morph
        //
        effect = Effect.create("debug_normals_morph");
        effectManager.add(effect);

        effectTypeData = {  prepare : morphPrepareFn,
                            shaderName : "shaders/morph.cgfx",
                            techniqueName : "debug_normals_morph",
                            update : defaultUpdateFn, // Uses the defaultUpdateFn from default renderer
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(morph, effectTypeData);

        //
        // blinn_morph
        //
        effect = Effect.create("blinn_morph");
        effectManager.add(effect);

        effectTypeData = {  prepare : morphPrepareFn,
                            shaderName : "shaders/morph.cgfx",
                            techniqueName : "blinn_morph",
                            update : defaultUpdateFn, // Uses the defaultUpdateFn from default renderer
                            loadTechniques : loadTechniques };
        effectTypeData.loadTechniques(shaderManager);
        effect.add(morph, effectTypeData);
    }

    //
    // Constructor function
    //
    static create(morph: Morph, sharedMaterial: Material): MorphInstance
    {
        var instance = new MorphInstance();
        var graphicsDevice = TurbulenzEngine.getGraphicsDevice(); //Maybe null when running on the server.

        instance.morph = morph;
        instance.morph.reference.add();
        instance.geometryType = morph.type;
        instance.halfExtents = morph.halfExtents;
        instance.center = morph.center;
        instance.techniqueParameters = graphicsDevice ? graphicsDevice.createTechniqueParameters(): null;
        instance.sharedMaterial = sharedMaterial;
        if (instance.sharedMaterial)
        {
            instance.sharedMaterial.reference.add();
        }
        instance.worldExtents = [];
        instance.worldUpdate = -1;
        instance.sorting = {};

        instance.cachedSemantics = {};
        instance.semanticsHashes = [];

        var semanticsNamesArray = morph.semanticsNamesArray;
        var semanticsNamesArrayLen = semanticsNamesArray.length;
        for (var i = 0; i < semanticsNamesArrayLen; i += 1)
        {
            instance.semanticsHashes[i] = instance.generateSemantics(graphicsDevice, semanticsNamesArray[i]);
        }

        return instance;
    }
}
