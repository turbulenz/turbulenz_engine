// Copyright (c) 2013 Turbulenz Limited

var CaptureGraphicsCommand =
{
    setTechniqueParameters: 1,
    drawIndexed:            2,
    draw:                   3,
    setIndexBuffer:         4,
    setStream:              5,
    setTechnique:           6,
    setData:                7,
    setAllData:             8,
    beginRenderTarget:      9,
    clear:                  10,
    endRenderTarget:        11,
    beginEndDraw:           12,
    setScissor:             13,
    setViewport:            14,
    beginOcclusionQuery:    15,
    endOcclusionQuery:      16,
    destroy:                17
};

class CaptureGraphicsDevice
{
    public static version = 1;

    gd:         any;
    current:    any[];
    frames:     any[];
    commands:   any[];
    numCommands: number;
    lastId:     number;
    recycledIds: number[];
    destroyedIds: number[];
    data:       {};
    objects:    {};
    vertexBuffers: {};
    indexBuffers: {};
    techniqueParameterBuffers: {};
    semantics:  {};
    semanticsMap: {};
    formats:  {};
    formatsMap: {};
    textures:   {};
    shaders:    {};
    techniques: {};
    videos:     {};
    renderBuffers: {};
    renderTargets: {};
    occlusionQueries: {};
    reverseSemantic: string[];

    constructor(gd)
    {
        var reverseSemantic = [];
        var p;
        for (p in gd)
        {
            var value = gd[p];
            if (typeof value === "number" ||
                typeof value === "string" ||
                0 === p.indexOf('VERTEXFORMAT'))
            {
                this[p] = value;
                if (0 === p.indexOf('SEMANTIC_'))
                {
                    if (reverseSemantic.length <= value)
                    {
                        reverseSemantic[value] = p.slice(9);
                    }
                }
            }
        }
        this.gd = gd;
        this.current = [];
        this.frames = [];
        this.commands = [];
        this.numCommands = 0;
        this.lastId = -1;
        this.recycledIds = [];
        this.destroyedIds = [];
        this.data = {};
        this.objects = {};
        this.vertexBuffers = {};
        this.indexBuffers = {};
        this.techniqueParameterBuffers = {};
        this.semantics = {};
        this.semanticsMap = {};
        this.formats = {};
        this.formatsMap = {};
        this.textures = {};
        this.shaders = {};
        this.techniques = {};
        this.videos = {};
        this.renderBuffers = {};
        this.renderTargets = {};
        this.occlusionQueries = {};
        this.reverseSemantic = reverseSemantic;
        return this;
    }

    private _getCommandId() : number
    {
        var id = this.numCommands;
        this.numCommands = (id + 1);
        return id;
    }

    private _getIntegerId() : number
    {
        if (this.recycledIds.length)
        {
            return this.recycledIds.pop();
        }
        var id = (this.lastId + 1);
        this.lastId = id;
        return id;
    }

    private _getStringId() : string
    {
        return this._getIntegerId().toString();
    }

    private _addData(data, length, integers) : string
    {
        var lowerIndex;

        var dataBin = this.data[length];
        if (dataBin === undefined)
        {
            this.data[length] = dataBin = [];
            lowerIndex = 0;
        }
        else
        {
            if (integers)
            {
                lowerIndex = this._lowerBound(dataBin, data, length, this._compareGenericArrays, 0);
            }
            else
            {
                var threshold = (length > 16 ? 0.001 : 0.00001);
                lowerIndex = this._lowerBound(dataBin, data, length, this._compareFloatArrays, threshold);
            }

            // Check if we found an identical copy
            if (lowerIndex < 0)
            {
                lowerIndex = ((-lowerIndex) - 1);
                return dataBin[lowerIndex].toString();
            }
        }

        var clonedData;
        if (data.slice)
        {
            clonedData = data.slice(0, length);
        }
        else
        {
            // must be a typed array
            clonedData = new data.constructor(data);
        }

        var id = this._getIntegerId();

        if (lowerIndex < dataBin.length)
        {
            dataBin.splice(lowerIndex, 0, id, clonedData);
        }
        else
        {
            dataBin.push(id, clonedData);
        }

        return id.toString();
    }

    private _addCommand(...args: any[]): void
    {
        var length = args.length;
        var method = args[0];

        var lowerIndex;

        var commandsBin = this.commands[method];
        if (commandsBin === undefined)
        {
            this.commands[method] = commandsBin = [];
            lowerIndex = 0;
        }
        else
        {
            lowerIndex = this._lowerBound(commandsBin, args, length, this._compareGenericArrays, 1);

            // Check if we found an identical copy
            if (lowerIndex < 0)
            {
                lowerIndex = ((-lowerIndex) - 1);
                this.current.push(commandsBin[lowerIndex]);
                return;
            }
        }

        var command = new Array(length);
        var a;

        command[0] = method;
        for (a = 1; a < length; a += 1)
        {
            command[a] = args[a];
        }

        var cmdId = this._getCommandId();

        if (lowerIndex < commandsBin.length)
        {
            commandsBin.splice(lowerIndex, 0, cmdId, command);
        }
        else
        {
            commandsBin.push(cmdId, command);
        }

        this.current.push(cmdId);
    }

    private _objectToArray(object) : any[]
    {
        var objectArray = [];

        var p, value;
        for (p in object)
        {
            if (object.hasOwnProperty(p))
            {
                value = object[p];
                if (value !== undefined && value !== null)
                {
                    objectArray.push(p, this._clone(value));
                }
            }
        }

        return objectArray;
    }

    private _patchObjectArray(objectArray)
    {
        var length = objectArray.length;
        var n, value;
        for (n = 0; n < length; n += 2)
        {
            value = objectArray[n + 1];
            if (value !== undefined && value !== null)
            {
                objectArray[n + 1] = this._clone(value);
            }
        }
        return objectArray;
    }

    // We need to implement our own sort because of the way data is stored
    private _sortObjectArray(data, length)
    {
        var sorted = false;
        var j, k1, k2, v1, v2;
        length -= 2;
        do
        {
            sorted = true;
            k1 = data[0];
            for (j = 0; j < length; j += 2)
            {
                k2 = data[j + 2];
                if (k1 > k2)
                {
                    v1 = data[j + 1];
                    v2 = data[j + 2 + 1];
                    data[j + 2] = k1;
                    data[j + 2 + 1] = v1;
                    data[j] = k2;
                    data[j + 1] = v2;
                    sorted = false;
                }
                else
                {
                    k1 = k2;
                }
            }
            length -= 2;
        }
        while (!sorted);
    }

    private _addObject(object) : string
    {
        var objectArray;
        if (object instanceof Array)
        {
            objectArray = this._patchObjectArray(object);
        }
        else
        {
            objectArray = this._objectToArray(object);
        }

        var length = objectArray.length;
        if (length === 0)
        {
            return null;
        }

        if (2 < length)
        {
            this._sortObjectArray(objectArray, length);
        }

        var lowerIndex;

        var objectsBin = this.objects[length];
        if (objectsBin === undefined)
        {
            this.objects[length] = objectsBin = [];
            lowerIndex = 0;
        }
        else
        {
            lowerIndex = this._lowerBound(objectsBin, objectArray, length, this._compareGenericArrays, 0);

            // Check if we found an identical copy
            if (lowerIndex < 0)
            {
                lowerIndex = ((-lowerIndex) - 1);
                return objectsBin[lowerIndex].toString()
            }
        }

        var id = this._getIntegerId();

        if (lowerIndex < objectsBin.length)
        {
            objectsBin.splice(lowerIndex, 0, id, objectArray);
        }
        else
        {
            objectsBin.push(id, objectArray);
        }

        return id.toString();
    }

    private _cloneObject(object, raw)
    {
        var length, index, result, value, id;

        // Check if it has an Id
        if (typeof object._id === "string")
        {
            return object._id;
        }

        if (object instanceof Array)
        {
            length = object.length;
            if (!raw)
            {
                for (index = 0; index < length; index += 1)
                {
                    if (typeof object[index] !== "number")
                    {
                        break;
                    }
                }
                if (index === length)
                {
                    return this._addData(object, length, false);
                }
            }

            result = new Array(length);
            for (index = 0; index < length; index += 1)
            {
                value = object[index];
                if (value !== undefined &&
                    typeof value !== "function")
                {
                    if (!value || typeof value !== "object")
                    {
                        result[index] = value;
                    }
                    else
                    {
                        result[index] = this._cloneObject(value, raw);
                    }
                }
            }
            return result;
        }

        if (object.byteLength !== undefined &&
            object.buffer instanceof ArrayBuffer)
        {
            if (raw)
            {
                length = object.length;
                result = new Array(length);
                for (index = 0; index < length; index += 1)
                {
                    result[index] = object[index];
                }
                return result;
            }
            else
            {
                var integers = !(object instanceof Float32Array ||
                                 object instanceof Float64Array);
                return this._addData(object, object.length, integers);
            }
        }

        if (object instanceof ArrayBuffer)
        {
            return undefined;
        }

        if (object instanceof Date)
        {
            result = new Date(object.getTime());
            return result;
        }

        // This does not clone the prototype. See Object.create() if you want that behaviour
        result = {};
        var property;
        for (property in object)
        {
            if (object.hasOwnProperty(property))
            {
                value = object[property];
                if (value !== undefined &&
                    typeof value !== "function")
                {
                    if (!value || typeof value !== "object")
                    {
                        result[property] = value;
                    }
                    else
                    {
                        result[property] = this._cloneObject(value, raw);
                    }
                }
            }
        }
        return result;
    }

    private _clone(object)
    {
        // boolean, numbers, strings, undefined, null
        if (!object || typeof object !== "object")
        {
            // We are assuming that 'object' will never be a function
            return object;
        }

        return this._cloneObject(object, false);
    }

    private _cloneVertexFormats(formats)
    {
        var gd = this.gd;
        var numFormats = formats.length;
        var newFormats = new Array(numFormats);
        var n;
        for (n = 0; n < numFormats; n += 1)
        {
            var fmt = formats[n];
            if (typeof fmt === "string")
            {
                newFormats[n] = fmt;
            }
            else
            {
                if (fmt === gd.VERTEXFORMAT_BYTE4)
                {
                    newFormats[n] = 'BYTE4';
                }
                else if (fmt === gd.VERTEXFORMAT_BYTE4N)
                {
                    newFormats[n] = 'BYTE4N';
                }
                else if (fmt === gd.VERTEXFORMAT_UBYTE4)
                {
                    newFormats[n] = 'UBYTE4';
                }
                else if (fmt === gd.VERTEXFORMAT_UBYTE4N)
                {
                    newFormats[n] = 'UBYTE4N';
                }
                else if (fmt === gd.VERTEXFORMAT_SHORT2)
                {
                    newFormats[n] = 'SHORT2';
                }
                else if (fmt === gd.VERTEXFORMAT_SHORT2N)
                {
                    newFormats[n] = 'SHORT2N';
                }
                else if (fmt === gd.VERTEXFORMAT_SHORT4)
                {
                    newFormats[n] = 'SHORT4';
                }
                else if (fmt === gd.VERTEXFORMAT_SHORT4N)
                {
                    newFormats[n] = 'SHORT4N';
                }
                else if (fmt === gd.VERTEXFORMAT_USHORT2)
                {
                    newFormats[n] = 'USHORT2';
                }
                else if (fmt === gd.VERTEXFORMAT_USHORT2N)
                {
                    newFormats[n] = 'USHORT2N';
                }
                else if (fmt === gd.VERTEXFORMAT_USHORT4)
                {
                    newFormats[n] = 'USHORT4';
                }
                else if (fmt === gd.VERTEXFORMAT_USHORT4N)
                {
                    newFormats[n] = 'USHORT4N';
                }
                else if (fmt === gd.VERTEXFORMAT_FLOAT1)
                {
                    newFormats[n] = 'FLOAT1';
                }
                else if (fmt === gd.VERTEXFORMAT_FLOAT2)
                {
                    newFormats[n] = 'FLOAT2';
                }
                else if (fmt === gd.VERTEXFORMAT_FLOAT3)
                {
                    newFormats[n] = 'FLOAT3';
                }
                else if (fmt === gd.VERTEXFORMAT_FLOAT4)
                {
                    newFormats[n] = 'FLOAT4';
                }
            }
        }
        var hash = newFormats.join(',');
        var id = this.formatsMap[hash];
        if (id === undefined)
        {
            id = this._getStringId();
            this.formats[id] = newFormats;
            this.formatsMap[hash] = id;
        }
        return id;
    }

    private _cloneSemantics(semantics)
    {
        var gd = this.gd;
        var numSemantics = semantics.length;
        var newSemantics = new Array(numSemantics);
        var n;
        for (n = 0; n < numSemantics; n += 1)
        {
            var semantic = semantics[n];
            if (typeof semantic === "string")
            {
                newSemantics[n] = semantic;
            }
            else
            {
                newSemantics[n] = this.reverseSemantic[semantic];
            }
        }
        return newSemantics;
    }

    private _checkProperties(pass)
    {
        var techniqueParameters = {};
        var objectArray = [];

        pass.dirty = false;
        var parameters = pass.parameters;
        for (var p in parameters)
        {
            if (parameters.hasOwnProperty(p))
            {
                var parameter = parameters[p];
                if (parameter.dirty)
                {
                    parameter.dirty = 0;
                    var paramInfo = parameter.info;
                    if (paramInfo &&
                        null !== location)
                    {
                        var parameterValues = paramInfo.values;
                        var value;
                        if (paramInfo.sampler !== undefined)
                        {
                            value = parameterValues;
                        }
                        else if (1 === paramInfo.numValues)
                        {
                            value = parameterValues[0];
                        }
                        else
                        {
                            value = parameterValues;
                        }
                        techniqueParameters[p] = value;
                        objectArray.push(p, value);
                    }
                }
            }
        }

        this._setSingleTechniqueParameters(techniqueParameters, objectArray);
    };

    private _lowerBound(bin: any[], data: any[], length: number, comp: Function, config: number) : number
    {
        var first: number = 0;
        var count: number = (bin.length >>> 1); // Bin elements ocupy two slots, divide by 2
        var step: number, middle : number, binIndex:number, diff: number;

        while (0 < count)
        {
            step = (count >>> 1);
            middle = (first + step);
            binIndex = ((middle << 1) + 1); // Bin elements have the data on the second slot
            diff = comp(bin[binIndex], data, length, config);
            if (diff < 0)
            {
                first = (middle + 1);
                count -= (step + 1);
            }
            else if (0 < diff)
            {
                count = step;
            }
            else
            {
                // This would be a non-zero negative value to signal that we found an identical copy
                return -binIndex;
            }
        }

        return (first << 1); // Bin elements ocupy two slots, multiply by 2
    }

    private _compareFloatArrays(a: any[], b: any[], length: number, positiveThreshold: number) : number
    {
        var negativeThreshold: number = -positiveThreshold;
        var n: number = 0;
        var diff: number;
        do
        {
            diff = (a[n] - b[n]);
            if (diff < negativeThreshold)
            {
                return -1;
            }
            else if (diff > positiveThreshold)
            {
                return 1;
            }
            n += 1;
        }
        while (n < length);
        return 0;
    }

    private _compareGenericArrays(a: any[], b: any[], length: number, offset: number) : number
    {
        var n: number = offset;
        var av, bv;
        while (n < length)
        {
            av = a[n];
            bv = b[n];
            if (av < bv)
            {
                return -1;
            }
            else if (av > bv)
            {
                return 1;
            }
            n += 1;
        }
        return 0;
    }

    private _equalFloatArrays(a, b, length) : bool
    {
        var n = 0;
        do
        {
            if (Math.abs(a[n] - b[n]) >= 0.00001)
            {
                return false;
            }
            n += 1;
        }
        while (n < length);
        return true;
    }

    private _equalIntegerArrays(a, b, length) : bool
    {
        var n = 0;
        do
        {
            if (a[n] !== b[n])
            {
                return false;
            }
            n += 1;
        }
        while (n < length);
        return true;
    }

    private _setSingleTechniqueParameters(techniqueParameters, objectArray)
    {
        var objectId = this._addObject(objectArray);
        if (objectId !== null)
        {
            this._addCommand(CaptureGraphicsCommand.setTechniqueParameters, objectId);
        }

        this.gd.setTechniqueParameters(techniqueParameters);
    }

    // GraphicsDevice API
    public drawIndexed(primitive, numIndices, first)
    {
        this.gd.drawIndexed(primitive, numIndices, first);

        this._addCommand(CaptureGraphicsCommand.drawIndexed, primitive, numIndices, first || 0);
    }

    public draw(primitive, numVertices, first)
    {
        this.gd.draw(primitive, numVertices, first);

        this._addCommand(CaptureGraphicsCommand.draw, primitive, numVertices, first || 0);
    }

    public setTechniqueParameters(unused?)
    {
        var numTechniqueParameters = arguments.length;
        for (var t = 0; t < numTechniqueParameters; t += 1)
        {
            var techniqueParameters = arguments[t];
            if (techniqueParameters)
            {
                var objectId = this._addObject(techniqueParameters);
                if (objectId !== null)
                {
                    this._addCommand(CaptureGraphicsCommand.setTechniqueParameters, objectId);
                }
            }
        }

        this.gd.setTechniqueParameters.apply(this.gd, arguments);
    }

    public setTechnique(technique)
    {
        if (technique.passes.length === 1)
        {
            var pass = technique.passes[0];
            if (pass.dirty)
            {
                this._checkProperties(pass);
            }
        }

        this.gd.setTechnique(technique);

        // Prevent technique from setting data directly, so we can check the dirty flag
        technique.device = null;

        // we need to do this AFTER the technique has been activated for the first time
        var id = technique._id;
        if (id === undefined)
        {
            id = this._getStringId();
            technique._id = id;
            this.techniques[id] = {
                shader: technique.shader._id,
                name: technique.name
            };

            if (technique.passes.length === 1)
            {
                var self = this;
                technique.checkProperties = function captureCheckProperties()
                {
                    var pass = this.passes[0];
                    if (pass.dirty)
                    {
                        self._checkProperties(pass);
                    }
                };
            }
        }
        this._addCommand(CaptureGraphicsCommand.setTechnique, id);
    }

    public setStream(vertexBuffer, semantics, offset)
    {
        if (offset === undefined)
        {
            offset = 0;
        }
        this._addCommand(CaptureGraphicsCommand.setStream, vertexBuffer._id, semantics._id, offset);

        this.gd.setStream(vertexBuffer, semantics, offset);
    }

    public setIndexBuffer(indexBuffer)
    {
        this._addCommand(CaptureGraphicsCommand.setIndexBuffer, indexBuffer._id);

        this.gd.setIndexBuffer(indexBuffer);
    }

    public drawArray(drawParametersArray, globalTechniqueParametersArray, sortMode)
    {
        var numDrawParameters = drawParametersArray.length;
        if (numDrawParameters <= 0)
        {
            return;
        }

        if (numDrawParameters > 1 && sortMode)
        {
            if (sortMode > 0)
            {
                drawParametersArray.sort(function drawArraySortPositive(a, b) {
                    return (b.sortKey - a.sortKey);
                });
            }
            else //if (sortMode < 0)
            {
                drawParametersArray.sort(function drawArraySortNegative(a, b) {
                    return (a.sortKey - b.sortKey);
                });
            }
        }

        var numGlobalTechniqueParameters = globalTechniqueParametersArray.length;

        var currentParameters = null;
        var deltaParameters = null;
        var objectArray = null;
        var validParameters = null;
        var activeIndexBuffer = null;
        var lastTechnique = null;
        var lastEndStreams = -1;
        var lastDrawParameters = null;
        var techniqueParameters = null;
        var v = 0;
        var streamsMatch = false;
        var vertexBuffer = null;
        var offset = 0;
        var t = 0;
        var p, value, currentValue;

        for (var n = 0; n < numDrawParameters; n += 1)
        {
            var drawParameters = drawParametersArray[n];
            var technique = drawParameters.technique;
            var endTechniqueParameters = drawParameters.endTechniqueParameters;
            var endStreams = drawParameters.endStreams;
            var endInstances = drawParameters.endInstances;
            var indexBuffer = drawParameters.indexBuffer;
            var primitive = drawParameters.primitive;
            var count = drawParameters.count;
            var firstIndex = drawParameters.firstIndex;

            if (lastTechnique !== technique)
            {
                lastTechnique = technique;

                this.setTechnique(technique);

                validParameters = technique.shader.parameters;

                currentParameters = {};
                objectArray = [];

                for (t = 0; t < numGlobalTechniqueParameters; t += 1)
                {
                    techniqueParameters = globalTechniqueParametersArray[t];

                    for (p in techniqueParameters)
                    {
                        if (validParameters[p] !== undefined)
                        {
                            value = techniqueParameters[p];
                            if (value !== undefined)
                            {
                                currentParameters[p] = value;
                                objectArray.push(p, value);
                            }
                            else
                            {
                                delete techniqueParameters[p];
                            }
                        }
                    }
                }

                this._setSingleTechniqueParameters(currentParameters, objectArray);
            }

            for (t = (16 * 3); t < endTechniqueParameters; t += 1)
            {
                techniqueParameters = drawParameters[t];

                deltaParameters = null;

                for (p in techniqueParameters)
                {
                    if (validParameters[p] !== undefined)
                    {
                        value = techniqueParameters[p];
                        currentValue = currentParameters[p];
                        if (currentValue !== value)
                        {
                            if (value !== undefined)
                            {
                                if (currentValue !== undefined &&
                                    (value instanceof Float32Array ||
                                     value instanceof Array) &&
                                    value._id === undefined &&
                                    value.length === currentValue.length &&
                                    this._equalFloatArrays(value, currentValue, value.length))
                                {
                                    continue;
                                }
                                currentParameters[p] = value;
                                if (deltaParameters === null)
                                {
                                    deltaParameters = {};
                                    objectArray = [];
                                }
                                deltaParameters[p] = value;
                                objectArray.push(p, value);
                            }
                            else
                            {
                                delete techniqueParameters[p];
                            }
                        }
                    }
                }

                if (deltaParameters !== null)
                {
                    this._setSingleTechniqueParameters(deltaParameters, objectArray);
                }
            }

            streamsMatch = (lastEndStreams === endStreams);
            for (v = 0; streamsMatch && v < endStreams; v += 3)
            {
                streamsMatch = (lastDrawParameters[v]     === drawParameters[v]     &&
                                lastDrawParameters[v + 1] === drawParameters[v + 1] &&
                                lastDrawParameters[v + 2] === drawParameters[v + 2]);
            }

            if (!streamsMatch)
            {
                lastEndStreams = endStreams;
                lastDrawParameters = drawParameters;

                for (v = 0; v < endStreams; v += 3)
                {
                    vertexBuffer = drawParameters[v];
                    if (vertexBuffer)
                    {
                        this.setStream(vertexBuffer, drawParameters[v + 1], drawParameters[v + 2]);
                    }
                }
            }

            /*jshint bitwise: false*/
            if (indexBuffer)
            {
                if (activeIndexBuffer !== indexBuffer)
                {
                    activeIndexBuffer = indexBuffer;
                    this.setIndexBuffer(indexBuffer);
                }

                t = ((16 * 3) + 8);
                if (t < endInstances)
                {
                    do
                    {
                        deltaParameters = {};
                        objectArray = [];

                        techniqueParameters = drawParameters[t];
                        for (p in techniqueParameters)
                        {
                            if (validParameters[p] !== undefined)
                            {
                                value = techniqueParameters[p];
                                currentValue = currentParameters[p];
                                if (currentValue !== value)
                                {
                                    if (currentValue !== undefined &&
                                        (value instanceof Float32Array ||
                                         value instanceof Array) &&
                                        value._id === undefined &&
                                        value.length === currentValue.length &&
                                        this._equalFloatArrays(value, currentValue, value.length))
                                    {
                                        continue;
                                    }
                                    currentParameters[p] = value;
                                    deltaParameters[p] = value;
                                    objectArray.push(p, value);
                                }
                            }
                        }

                        this._setSingleTechniqueParameters(deltaParameters, objectArray);

                        this.drawIndexed(primitive, count, firstIndex);

                        t += 1;
                    }
                    while (t < endInstances);
                }
                else
                {
                    this.drawIndexed(primitive, count, firstIndex);
                }
            }
            else
            {
                t = ((16 * 3) + 8);
                if (t < endInstances)
                {
                    do
                    {
                        deltaParameters = {};
                        objectArray = [];

                        techniqueParameters = drawParameters[t];
                        for (p in techniqueParameters)
                        {
                            if (validParameters[p] !== undefined)
                            {
                                value = techniqueParameters[p];
                                if (currentParameters[p] !== value)
                                {
                                    currentParameters[p] = value;
                                    deltaParameters[p] = value;
                                    objectArray.push(p, value);
                                }
                            }
                        }

                        this._setSingleTechniqueParameters(deltaParameters, objectArray);

                        this.draw(primitive, count, firstIndex);

                        t += 1;
                    }
                    while (t < endInstances);
                }
                else
                {
                    this.draw(primitive, count, firstIndex);
                }
            }
        }
    }

    public beginDraw(primitive, numVertices, formats, semantics)
    {
        var writer = this.gd.beginDraw(primitive, numVertices, formats, semantics);
        if (writer)
        {
            var self = this;
            var data = [];
            numVertices = 0;
            var captureWriter = function captureBeginDrawWriter()
            {
                var numArguments = arguments.length;
                for (var a = 0; a < numArguments; a += 1)
                {
                    var value = arguments[a];
                    if (typeof value === 'number')
                    {
                        data.push(value);
                    }
                    else
                    {
                        data.push.apply(data, value);
                    }
                }
                numVertices += 1;

                writer.apply(this, arguments);
            };
            captureWriter['end'] = function captureEndDrawWriter()
            {
                self._addCommand(CaptureGraphicsCommand.beginEndDraw,
                                 primitive,
                                 numVertices,
                                 self._cloneVertexFormats(formats),
                                 semantics._id,
                                 self._addData(data, data.length, false));
            };
            captureWriter['proxy'] = writer;
            return captureWriter;
        }
        else
        {
            return writer;
        }
    }

    public endDraw(writer)
    {
        writer['end']();
        this.gd.endDraw(writer['proxy']);
    }

    public setViewport(x, y, w, h)
    {
        var gd = this.gd;

        gd.setViewport(x, y, w, h);

        if (w === gd.width &&
            h === gd.height)
        {
            w = -1;
            h = -1;
        }
        this._addCommand(CaptureGraphicsCommand.setViewport, x, y, w, h);
    }

    public setScissor(x, y, w, h)
    {
        var gd = this.gd;

        gd.setScissor(x, y, w, h);

        if (w === gd.width &&
            h === gd.height)
        {
            w = -1;
            h = -1;
        }
        this._addCommand(CaptureGraphicsCommand.setScissor, x, y, w, h);
    }

    public clear(color, depth, stencil)
    {
        this._addCommand(CaptureGraphicsCommand.clear, this._clone(color), depth, stencil);

        this.gd.clear(color, depth, stencil);
    }

    public beginFrame()
    {
        this['width'] = this.gd.width;
        this['height'] = this.gd.height;
        return this.gd.beginFrame();
    }

    public beginRenderTarget(renderTarget)
    {
        this._addCommand(CaptureGraphicsCommand.beginRenderTarget, renderTarget._id);

        return this.gd.beginRenderTarget(renderTarget);
    }

    public endRenderTarget()
    {
        this._addCommand(CaptureGraphicsCommand.endRenderTarget);

        this.gd.endRenderTarget();
    }

    public beginOcclusionQuery(query)
    {
        this._addCommand(CaptureGraphicsCommand.beginOcclusionQuery, query._id);

        return this.gd.beginOcclusionQuery(query)
    }

    public endOcclusionQuery(query)
    {
        this._addCommand(CaptureGraphicsCommand.endOcclusionQuery, query._id);

        this.gd.endOcclusionQuery(query)
    }

    public endFrame()
    {
        this.frames.push(this.current);
        this.current = [];

        this.gd.endFrame();

        this['fps'] = this.gd.fps;
    }

    public createTechniqueParameters(params)
    {
        return this.gd.createTechniqueParameters(params);
    }

    public createSemantics(attributes)
    {
        var semantics = this.gd.createSemantics(attributes);
        if (semantics)
        {
            var clonedAttributes = this._cloneSemantics(attributes);
            var hash = clonedAttributes.join(',');
            var id = this.semanticsMap[hash];
            if (id === undefined)
            {
                id = this._getStringId();
                this.semanticsMap[hash] = id;
                this.semantics[id] = clonedAttributes;
            }
            semantics._id = id;
        }
        return semantics;
    }

    public createVertexBuffer(params)
    {
        var vertexBuffer = this.gd.createVertexBuffer(params);
        if (vertexBuffer)
        {
            var id = this._getStringId();
            vertexBuffer._id = id;
            var self = this;
            var setData = vertexBuffer.setData;
            vertexBuffer.setData = function captureVBSetData(data, offset, numVertices)
            {
                if (offset === undefined)
                {
                    offset = 0;
                }
                if (numVertices === undefined)
                {
                    numVertices = this.numVertices;
                }

                if (offset === 0 && numVertices === this.numVertices)
                {
                    self._addCommand(CaptureGraphicsCommand.setAllData,
                                     id,
                                     self._addData(data, (numVertices * this.stride), false));
                }
                else
                {
                    self._addCommand(CaptureGraphicsCommand.setData,
                                     id,
                                     offset,
                                     numVertices,
                                     self._addData(data, (numVertices * this.stride), false));
                }

                setData.call(this, data, offset, numVertices);
            };
            var map = vertexBuffer.map;
            vertexBuffer.map = function captureVBmap(offset, numVertices)
            {
                if (offset === undefined)
                {
                    offset = 0;
                }
                if (numVertices === undefined)
                {
                    numVertices = this.numVertices;
                }
                var writer = map.call(this, offset, numVertices);
                if (writer)
                {
                    var data = [];
                    numVertices = 0;
                    var captureWriter = function captureVBWriter()
                    {
                        var numArguments = arguments.length;
                        for (var a = 0; a < numArguments; a += 1)
                        {
                            var value = arguments[a];
                            if (typeof value === 'number')
                            {
                                data.push(value);
                            }
                            else
                            {
                                data.push.apply(data, value);
                            }
                        }
                        numVertices += 1;

                        writer.apply(this, arguments);
                    };
                    captureWriter['end'] = function captureVBWriterEnd()
                    {
                        if (offset === 0 && numVertices === vertexBuffer.numVertices)
                        {
                            self._addCommand(CaptureGraphicsCommand.setAllData,
                                             id,
                                             self._addData(data, data.length, false));
                        }
                        else
                        {
                            self._addCommand(CaptureGraphicsCommand.setData,
                                             id,
                                             offset,
                                             numVertices,
                                             self._addData(data, data.length, false));
                        }
                    };
                    captureWriter['proxy'] = writer;
                    return captureWriter;
                }
                else
                {
                    return writer;
                }
            };
            var unmap = vertexBuffer.unmap;
            vertexBuffer.unmap = function captureVBunmap(writer)
            {
                writer['end']();
                unmap.call(this, writer['proxy']);
            };

            var destroy = vertexBuffer.destroy;
            vertexBuffer.destroy = function captureVBDestroy()
            {
                self.destroyedIds.push(parseInt(this._id, 10));
                self._addCommand(CaptureGraphicsCommand.destroy, this._id);
                destroy.call(this);
            };

            var attributes = params.attributes;
            params.attributes = this._cloneVertexFormats(attributes);
            if (params.dynamic === false || params.transient)
            {
                delete params.dynamic;
            }
            if (params.data)
            {
                var data = params.data;
                this._addCommand(CaptureGraphicsCommand.setAllData,
                                 id,
                                 this._addData(data, data.length, false));
                delete params.data;
            }
            this.vertexBuffers[id] = this._cloneObject(params, true);
            params.attributes = attributes;
        }
        return vertexBuffer;
    }

    public createIndexBuffer(params)
    {
        var indexBuffer = this.gd.createIndexBuffer(params);
        if (indexBuffer)
        {
            var id = this._getStringId();
            indexBuffer._id = id;
            var self = this;
            var setData = indexBuffer.setData;
            indexBuffer.setData = function captureIBSetData(data, offset, numIndices)
            {
                if (offset === undefined)
                {
                    offset = 0;
                }
                if (numIndices === undefined)
                {
                    numIndices = this.numIndices;
                }

                if (offset === 0 && numIndices === this.numIndices)
                {
                    self._addCommand(CaptureGraphicsCommand.setAllData,
                                     id,
                                     self._addData(data, numIndices, true));
                }
                else
                {
                    self._addCommand(CaptureGraphicsCommand.setData,
                                     id,
                                     offset,
                                     numIndices,
                                     self._addData(data, numIndices, true));
                }

                setData.call(this, data, offset, numIndices);
            };
            var map = indexBuffer.map;
            indexBuffer.map = function captureIBmap(offset, numIndices)
            {
                if (offset === undefined)
                {
                    offset = 0;
                }
                if (numIndices === undefined)
                {
                    numIndices = this.numIndices;
                }
                var writer = map.call(this, offset, numIndices);
                if (writer)
                {
                    writer['end'] = function captureIBWriterEnd()
                    {
                        var data = writer.data;
                        var numIndices = writer.getNumWrittenIndices();
                        if (offset === 0 && numIndices === indexBuffer.numIndices)
                        {
                            self._addCommand(CaptureGraphicsCommand.setAllData,
                                             id,
                                             self._addData(data, numIndices, true));
                        }
                        else
                        {
                            self._addCommand(CaptureGraphicsCommand.setData,
                                             id,
                                             offset,
                                             numIndices,
                                             self._addData(data, numIndices, true));
                        }
                    };
                }
                return writer;
            };
            var unmap = indexBuffer.unmap;
            indexBuffer.unmap = function captureIBunmap(writer)
            {
                writer['end']();
                unmap.call(this, writer);
            };

            var destroy = indexBuffer.destroy;
            indexBuffer.destroy = function captureIBDestroy()
            {
                self.destroyedIds.push(parseInt(this._id, 10));
                self._addCommand(CaptureGraphicsCommand.destroy, this._id);
                destroy.call(this);
            };

            if (params.dynamic === false || params.transient)
            {
                delete params.dynamic;
            }
            if (params.data)
            {
                var data = params.data;
                this._addCommand(CaptureGraphicsCommand.setAllData,
                                 id,
                                 this._addData(data, data.length, true));
                delete params.data;
            }
            var clonedParams = this._cloneObject(params, true);
            if (clonedParams.format === this.gd.INDEXFORMAT_USHORT)
            {
                clonedParams.format = 'USHORT';
            }
            else if (clonedParams.format === this.gd.INDEXFORMAT_UINT)
            {
                clonedParams.format = 'UINT';
            }
            else if (clonedParams.format === this.gd.INDEXFORMAT_UBYTE)
            {
                clonedParams.format = 'UBYTE';
            }
            this.indexBuffers[id] = clonedParams;
        }
        return indexBuffer;
    }

    public createTexture(params)
    {
        var texture = this.gd.createTexture(params);
        if (texture)
        {
            var id = this._getStringId();
            texture._id = id;
            var self = this;
            var setData = texture.setData;
            texture.setData = function captureTSetData(data)
            {
                var integers = !(data instanceof Float32Array ||
                                 data instanceof Float64Array ||
                                 data instanceof Array);
                self._addCommand(CaptureGraphicsCommand.setAllData,
                                 id,
                                 self._addData(data, data.length, integers));

                setData.call(this, data);
            };
            if (params.data)
            {
                var data = params.data;
                var integers = !(data instanceof Float32Array ||
                                 data instanceof Float64Array ||
                                 data instanceof Array);
                this._addCommand(CaptureGraphicsCommand.setAllData,
                                 id,
                                 this._addData(data, data.length, integers));
                delete params.data;
            }
            if (params.cubemap === false)
            {
                delete params.cubemap;
            }
            if (params.dynamic === false)
            {
                delete params.dynamic;
            }
            if (params.mipmaps === false)
            {
                delete params.mipmaps;
            }
            var clonedParams = this._cloneObject(params, true);
            if (clonedParams.renderable)
            {
                // special case for fullscreen renderables
                if (clonedParams.width === this.gd.width &&
                    clonedParams.height === this.gd.height)
                {
                    clonedParams.width = -1;
                    clonedParams.height = -1;
                }
            }
            this.textures[id] = clonedParams;
        }
        return texture;
    }

    public createVideo(params)
    {
        var video = this.gd.createVideo(params);
        if (video)
        {
            var id = this._getStringId();
            video._id = id;
            this.videos[id] = this._cloneObject(params, true);
        }
        return video;
    }

    public createShader(params)
    {
        // Need to clone before calling createShader because that function modifies the input object...
        var clonedParams = this._cloneObject(params, true);
        var shader = this.gd.createShader(params);
        if (shader)
        {
            var id = this._getStringId();
            shader._id = id;
            this.shaders[id] = clonedParams;
        }
        return shader;
    }

    public createTechniqueParameterBuffer(params)
    {
        var techniqueParameterBuffer = new Float32Array(params.numFloats);
        var id = this._getStringId();
        techniqueParameterBuffer['_id'] = id;
        if (techniqueParameterBuffer['_id'] !== id)
        {
            // Firefox does not support adding extra properties to Float32Arrays
            // TechniqueParameterBuffers will be treated as regular Float32Arrays...
            return this.gd.createTechniqueParameterBuffer(params);
        }
        var self = this;
        techniqueParameterBuffer['setData'] = function captureTPBSetData(data, offset, numValues)
        {
            if (offset === undefined)
            {
                offset = 0;
            }
            if (numValues === undefined)
            {
                numValues = this.length;
            }

            var n = 0;
            while (n < numValues &&
                   this[offset] === data[n])
            {
                offset += 1;
                n += 1;
            }

            var end = (offset + numValues);
            while (n < numValues &&
                   this[end - 1] === data[numValues - 1])
            {
                end -= 1;
                numValues -= 1;
            }
            if (n >= numValues)
            {
                return;
            }

            if (0 < n)
            {
                numValues -= n;
                if (data.subarray)
                {
                    data = data.subarray(n, (n + numValues));
                }
                else
                {
                    data = data.slice(n, numValues);
                }
            }

            if (offset === 0 && numValues === this.length)
            {
                self._addCommand(CaptureGraphicsCommand.setAllData,
                                 id,
                                 self._addData(data, numValues, false));
            }
            else
            {
                self._addCommand(CaptureGraphicsCommand.setData,
                                 id,
                                 offset,
                                 numValues,
                                 self._addData(data, numValues, false));
            }

            n = 0;
            do
            {
                this[offset] = data[n];
                offset += 1;
                n += 1;
            }
            while (n < numValues);
        };
        techniqueParameterBuffer['map'] = function captureTPBmap(offset, numValues)
        {
            if (offset === undefined)
            {
                offset = 0;
            }
            if (numValues === undefined)
            {
                numValues = this.length;
            }
            var data = new Float32Array(numValues);
            var valuesWritten = 0;
            var captureWriter = function capturTPBWriter()
            {
                var numArguments = arguments.length;
                for (var a = 0; a < numArguments; a += 1)
                {
                    var value = arguments[a];
                    if (typeof value === 'number')
                    {
                        data[valuesWritten] = value;
                        valuesWritten += 1;
                    }
                    else
                    {
                        var length = value.length;
                        var n;
                        for (n = 0; n < length; n += 1)
                        {
                            data[valuesWritten] = value[n];
                            valuesWritten += 1;
                        }
                    }
                }
            };
            captureWriter['end'] = function captureTPBWriterEnd()
            {
                techniqueParameterBuffer['setData'](data, offset, valuesWritten);
            };
            return captureWriter;
        };
        techniqueParameterBuffer['unmap'] = function captureTPBunmap(writer)
        {
            writer['end']();
        };

        techniqueParameterBuffer['destroy'] = function captureTPBDestroy()
        {
            self.destroyedIds.push(parseInt(this._id, 10));
            this.length = 0;
        };

        if (params.dynamic === false)
        {
            delete params.dynamic;
        }
        if (params.data)
        {
            var data = params.data;
            this._addCommand(CaptureGraphicsCommand.setAllData,
                             id,
                             this._addData(data, data.length, true));
            delete params.data;
        }
        this.techniqueParameterBuffers[id] = this._cloneObject(params, true);
        return techniqueParameterBuffer;
    }

    public createRenderBuffer(params)
    {
        var renderBuffer = this.gd.createRenderBuffer(params);
        if (renderBuffer)
        {
            var id = this._getStringId();
            renderBuffer._id = id;
            var clonedParams = this._cloneObject(params, true);
            // special case for fullscreen buffers
            if (clonedParams.width === this.gd.width &&
                clonedParams.height === this.gd.height)
            {
                clonedParams.width = -1;
                clonedParams.height = -1;
            }
            this.renderBuffers[id] = clonedParams;
        }
        return renderBuffer;
    }

    public createRenderTarget(params)
    {
        var renderTarget = this.gd.createRenderTarget(params);
        if (renderTarget)
        {
            var id = this._getStringId();
            renderTarget._id = id;
            this.renderTargets[id] = this._cloneObject(params, true);
        }
        return renderTarget;
    }

    public createOcclusionQuery(params)
    {
        var query = this.gd.createOcclusionQuery(params);
        if (query)
        {
            var id = this._getStringId();
            query._id = id;
            this.occlusionQueries[id] = this._cloneObject(params, true);
        }
        return query;
    }

    public createDrawParameters(params)
    {
        return this.gd.createDrawParameters(params);
    }

    public isSupported(name)
    {
        return this.gd.isSupported(name);
    }

    public maxSupported(name)
    {
        return this.gd.maxSupported(name);
    }

    public loadTexturesArchive(params)
    {
        var clonedParams = this._cloneObject(params, true);
        clonedParams.archive = {};
        this.textures[this._getStringId()] = clonedParams;

        var self = this;
        var ontextureload = params.ontextureload;
        var onload = params.onload;
        params.ontextureload = function captureOnTextureLoad(texture)
        {
            if (texture)
            {
                var id = self._getStringId();
                clonedParams.archive[texture.name] = id;
                texture._id = id;
                ontextureload(texture);
            }
        };
        params.onload = function captureOnLoad(success, status)
        {
            params.ontextureload = ontextureload;
            params.onload = onload;
            if (onload)
            {
                params.onload(success, status);
            }
        };
        return this.gd.loadTexturesArchive(params);
    }

    public getScreenshot(compress, x?, y?, width?, height?)
    {
        return this.gd.getScreenshot(compress, x, y, width, height);
    }

    public flush()
    {
        this.gd.flush();
    }

    public finish()
    {
        this.gd.finish();
    }

    // Capture device API
    public getFramesString()
    {
        var commands = this.commands;
        var numMethods = commands.length;
        var numCommands = this.numCommands;
        var commandsArray = new Array(numCommands);
        var p, n, commandsBin, length;
        for (p = 0; p < numMethods; p += 1)
        {
            commandsBin = commands[p];
            if (commandsBin !== undefined)
            {
                length = commandsBin.length;
                for (n = 0; n < length; n += 2)
                {
                    commandsArray[commandsBin[n]] = commandsBin[n + 1];
                }
            }
        }

        var framesString = '{"version":1,"commands":[';
        for (n = 0; n < numCommands; n += 1)
        {
            if (n)
            {
                framesString += ',';
            }

            framesString += '[';
            var command = commandsArray[n];
            var numArguments = command.length;
            var a, value, valueInt;
            for (a = 0; a < numArguments; a += 1)
            {
                value = command[a];
                if (a)
                {
                    framesString += ',';
                }

                if (typeof value === "string")
                {
                    framesString += value;
                }
                else if (typeof value === "number")
                {
                    valueInt = (value | 0);
                    if (valueInt === value)
                    {
                        framesString += valueInt.toString();
                    }
                    else
                    {
                        framesString += value.toFixed(4).replace(/\.?0+$/, '');
                    }
                }
                else if (value === undefined || value === null)
                {
                    framesString += 'null';
                }
                else
                {
                    framesString += value.toString();
                }
            }
            framesString += ']';
        }
        framesString += '],"frames":[';

        var frames = this.frames;
        var numFrames = frames.length;
        for (n = 0; n < numFrames; n += 1)
        {
            if (n)
            {
                framesString += ',';
            }
            framesString += '[' + frames[n].join(',') + ']';
        }
        framesString += ']}';
        return framesString;
    }

    public getDataString()
    {
        var dataString = '{"version":1,"data":[';
        var addValuesComma = false;
        var dataBins = this.data;
        var p, dataBin, binLength, n, j;
        for (p in dataBins)
        {
            if (dataBins.hasOwnProperty(p))
            {
                dataBin = dataBins[p];
                binLength = dataBin.length;
                var id, data, length, value, valueInt;
                for (n = 0; n < binLength; n += 2)
                {
                    id = dataBin[n];
                    data = dataBin[n + 1];
                    length = data.length;

                    if (addValuesComma)
                    {
                        dataString += ',';
                    }
                    else
                    {
                        addValuesComma = true;
                    }

                    dataString += id + ',[';

                    if (data instanceof Array ||
                        data instanceof Float32Array ||
                        data instanceof Float64Array)
                    {
                        for (j = 0; j < length; j += 1)
                        {
                            if (j)
                            {
                                dataString += ',';
                            }
                            value = data[j];
                            valueInt = (value | 0);
                            if (Math.abs(valueInt - value) < 0.00001)
                            {
                                dataString += valueInt.toString();
                            }
                            else
                            {
                                if (length <= 16)
                                {
                                    if (Math.abs(value) < 0.001)
                                    {
                                        dataString += value.toExponential(2).replace(/\.?0+e/, 'e');
                                    }
                                    else
                                    {
                                        dataString += value.toFixed(5).replace(/\.?0+$/, '');
                                    }
                                }
                                else
                                {
                                    dataString += value.toFixed(3).replace(/\.?0+$/, '');
                                }
                            }
                        }
                    }
                    else
                    {
                        for (j = 0; j < length; j += 1)
                        {
                            if (j)
                            {
                                dataString += ',';
                            }
                            dataString += data[j].toString();
                        }
                    }
                    dataString += ']';
                }
            }
        }

        dataString += '],"objects":[';
        var objects = this.objects;
        addValuesComma = false;
        var objectsBin, object;
        for (p in objects)
        {
            if (objects.hasOwnProperty(p))
            {
                objectsBin = objects[p];
                binLength = objectsBin.length;
                for (n = 0; n < binLength; n += 2)
                {
                    id = objectsBin[n];
                    object = objectsBin[n + 1];
                    length = object.length;
                    if (addValuesComma)
                    {
                        dataString += ',';
                    }
                    else
                    {
                        addValuesComma = true;
                    }
                    dataString += id + ',[';
                    for (j = 0; j < length; j += 1)
                    {
                        if (j)
                        {
                            dataString += ',';
                        }
                        var value = object[j];
                        if (typeof value === "string")
                        {
                            dataString += '"' + value + '"';
                        }
                        else if (typeof value === "number")
                        {
                            valueInt = (value | 0);
                            if (valueInt === value)
                            {
                                dataString += valueInt.toString();
                            }
                            else
                            {
                                dataString += value.toFixed(4).replace(/\.?0+$/, '');
                            }
                        }
                        else
                        {
                            dataString += value.toString();
                        }
                    }
                    dataString += ']';
                }
            }
        }
        dataString += ']}';
        return dataString;
    }

    public getResourcesString()
    {
        return JSON.stringify({
            version: 1,
            resources: {
                vertexBuffers: this.vertexBuffers,
                indexBuffers: this.indexBuffers,
                techniqueParameterBuffers: this.techniqueParameterBuffers,
                semantics: this.semantics,
                formats: this.formats,
                textures: this.textures,
                shaders: this.shaders,
                techniques: this.techniques,
                videos: this.videos,
                renderBuffers: this.renderBuffers,
                renderTargets: this.renderTargets
            }
        });
    }

    public reset()
    {
        // Try forcing a memory release
        var frames = this.frames;
        var numFrames = frames.length;
        var n;
        for (n = 0; n < numFrames; n += 1)
        {
            frames[n].length = 0;
            frames[n] = null;
        }
        frames.length = 0;

        var commands = this.commands;
        var numMethods = commands.length;
        for (n = 0; n < numMethods; n += 1)
        {
            if (commands[n] !== undefined)
            {
                commands[n].length = 0;
            }
        }
        this.numCommands = 0;

        // Clean data array and reclaim the ids for reuse
        var recycledIds = this.recycledIds;
        var dataBins = this.data;
        var dataBin, binLength;
        var p;
        for (p in dataBins)
        {
            if (dataBins.hasOwnProperty(p))
            {
                dataBin = dataBins[p];
                binLength = dataBin.length;
                for (n = 0; n < binLength; n += 2)
                {
                    recycledIds.push(dataBin[n]);
                }
                dataBin.length = 0;
            }
        }

        // Clean the objects dictionary and reclaim the ids for reuse
        var objects = this.objects;
        var objectsBin;
        for (p in objects)
        {
            if (objects.hasOwnProperty(p))
            {
                objectsBin = objects[p];
                binLength = objectsBin.length;
                for (n = 0; n < binLength; n += 2)
                {
                    recycledIds.push(objectsBin[n]);
                }
                objectsBin.length = 0;
            }
        }

        if (this.destroyedIds.length)
        {
            recycledIds.push.apply(recycledIds, this.destroyedIds);
            this.destroyedIds.length = 0;
        }

        // Sort higher to lower so we pop low ids first
        recycledIds.sort(function (a, b) { return (b - a); });

        // Try to release reclaimed ids that can be done with lastId
        var lastId = this.lastId;
        n = 0;
        while (lastId === recycledIds[n])
        {
            n += 1;
            lastId -= 1;
        }
        if (n)
        {
            this.lastId = lastId;
            if (n < recycledIds.length)
            {
                recycledIds.splice(0, n);
            }
            else
            {
                recycledIds.length = 0;
            }
        }

        this.vertexBuffers = {};
        this.indexBuffers = {};
        this.techniqueParameterBuffers = {};
        this.semantics = {};
        this.formats = {};
        this.textures = {};
        this.shaders = {};
        this.techniques = {};
        this.videos = {};
        this.renderBuffers = {};
        this.renderTargets = {};
        this.occlusionQueries = {};
    }

    public destroy()
    {
        this.gd.destroy();
        this.gd = null;
        this.current = null;
        this.frames = null;
        this.commands = null;
        this.numCommands = 0;
        this.lastId = -1;
        this.recycledIds = null;
        this.destroyedIds = null;
        this.data= null;
        this.objects = null;
        this.vertexBuffers = null;
        this.indexBuffers = null;
        this.techniqueParameterBuffers = null;
        this.semantics = null;
        this.semanticsMap = null;
        this.textures = null;
        this.shaders = null;
        this.techniques = null;
        this.videos = null;
        this.renderBuffers = null;
        this.renderTargets = null;
        this.occlusionQueries = null;
        this.reverseSemantic = null;
    }

    public static create(gd) : CaptureGraphicsDevice
    {
        return new CaptureGraphicsDevice(gd);
    }
};

// Playback
class PlaybackGraphicsDevice
{
    public static version = 1;

    gd:         any;
    frames:     any[];
    writerData: any[];
    entities:   any[];
    numPendingResources: number;
    onerror:    any;

    constructor(gd)
    {
        this.gd = gd;
        this.frames = [];
        this.entities = [];
        this.writerData = [];
        this.numPendingResources = 0;
        this.onerror = null;
    }

    private _storeEntity(id, value)
    {
        if (value === null || value === undefined)
        {
            if (this.onerror)
            {
                this.onerror("Failed to create entity: " + id);
            }
        }
        this.entities[parseInt(id, 10)] = value;
    }

    private _resolveEntity(id)
    {
        if (typeof id === "string")
        {
            id = parseInt(id, 10);
        }
        if (typeof id !== "number")
        {
            return id;
        }
        var entity = this.entities[id];
        if (!entity)
        {
            if (this.onerror)
            {
                this.onerror("Unknown entity: " + id);
            }
        }
        return entity;
    }

    public addResources(resourcesObject, baseURL)
    {
        var resources = resourcesObject.resources;
        var gd = this.gd;
        var self = this;
        var p, params, src;

        function makeResourceLoader(src)
        {
            self.numPendingResources += 1;
            return function resourceLoaded(resource, status)
            {
                if (resource)
                {
                    self.numPendingResources -= 1;
                }
                else
                {
                    if (self.onerror)
                    {
                        self.onerror('Failed to load resource: ' + src);
                    }
                }
            };
        }

        function makArchiveTextureLoader(archive)
        {
            return function archiveTextureLoaded(tex)
            {
                self.numPendingResources -= 1;
                self._storeEntity(archive[tex.name], tex);
            };
        }

        var shaders = resources.shaders;
        for (p in shaders)
        {
            if (shaders.hasOwnProperty(p))
            {
                params = shaders[p];
                this._storeEntity(p, gd.createShader(params));
            }
        }

        var videos = resources.videos;
        for (p in videos)
        {
            if (videos.hasOwnProperty(p))
            {
                params = videos[p];
                src = params.src;
                if (src)
                {
                    params.src = baseURL + src;
                    params.onload = makeResourceLoader(params.src);
                }
                this._storeEntity(p, gd.createVideo(params));
            }
        }

        var renderBuffers = resources.renderBuffers;
        for (p in renderBuffers)
        {
            if (renderBuffers.hasOwnProperty(p))
            {
                params = renderBuffers[p];
                if (params.width === -1)
                {
                    params.width = gd.width;
                }
                if (params.height === -1)
                {
                    params.height = gd.height;
                }
                this._storeEntity(p, gd.createRenderBuffer(params));
            }
        }

        var textures = resources.textures;
        for (p in textures)
        {
            if (textures.hasOwnProperty(p))
            {
                params = textures[p];
                src = params.src;
                if (src)
                {
                    params.src = baseURL + src;
                    params.onload = makeResourceLoader(params.src);
                }
                if (params.archive)
                {
                    var archive = params.archive;
                    var name;
                    for (name in archive)
                    {
                        if (archive.hasOwnProperty(name))
                        {
                            this.numPendingResources += 1;
                        }
                    }
                    params.ontextureload = makArchiveTextureLoader(archive);
                    gd.loadTexturesArchive(params);
                }
                else
                {
                    if (params.width === -1)
                    {
                        params.width = gd.width;
                    }
                    if (params.height === -1)
                    {
                        params.height = gd.height;
                    }
                    this._storeEntity(p, gd.createTexture(params));
                }
            }
        }

        var renderTargets = resources.renderTargets;
        for (p in renderTargets)
        {
            if (renderTargets.hasOwnProperty(p))
            {
                params = renderTargets[p];
                if (typeof params.colorTexture0 === "string")
                {
                    params.colorTexture0 = this._resolveEntity(params.colorTexture0);
                }
                if (typeof params.colorTexture1 === "string")
                {
                    params.colorTexture1 = this._resolveEntity(params.colorTexture1);
                }
                if (typeof params.colorTexture2 === "string")
                {
                    params.colorTexture2 = this._resolveEntity(params.colorTexture2);
                }
                if (typeof params.colorTexture3 === "string")
                {
                    params.colorTexture3 =this._resolveEntity(params.colorTexture3);
                }
                if (typeof params.depthBuffer === "string")
                {
                    params.depthBuffer = this._resolveEntity(params.depthBuffer);
                }
                if (typeof params.depthTexture === "string")
                {
                    params.depthTexture = this._resolveEntity(params.depthTexture);
                }
                this._storeEntity(p, gd.createRenderTarget(params));
            }
        }

        var formats = resources.formats;
        for (p in formats)
        {
            if (formats.hasOwnProperty(p))
            {
                var formatArray = formats[p];
                var numFormats = formatArray.length;
                var n;
                for (n = 0; n < numFormats; n += 1)
                {
                    var format = formatArray[n];
                    formatArray[n] = gd['VERTEXFORMAT_' + format];
                    if (formatArray[n] === undefined)
                    {
                        if (this.onerror)
                        {
                            this.onerror("Unknown vertex format: " + format);
                        }
                        return;
                    }
                }
                this._storeEntity(p, formatArray);
            }
        }

        var vertexBuffers = resources.vertexBuffers;
        for (p in vertexBuffers)
        {
            if (vertexBuffers.hasOwnProperty(p))
            {
                params = vertexBuffers[p];
                params.attributes = this._resolveEntity(params.attributes);
                this._storeEntity(p, gd.createVertexBuffer(params));
            }
        }

        var indexBuffers = resources.indexBuffers;
        for (p in indexBuffers)
        {
            if (indexBuffers.hasOwnProperty(p))
            {
                params = indexBuffers[p];
                this._storeEntity(p, gd.createIndexBuffer(params));
            }
        }

        var techniqueParameterBuffers = resources.techniqueParameterBuffers;
        for (p in techniqueParameterBuffers)
        {
            if (techniqueParameterBuffers.hasOwnProperty(p))
            {
                params = techniqueParameterBuffers[p];
                this._storeEntity(p, gd.createTechniqueParameterBuffer(params));
            }
        }

        var semantics = resources.semantics;
        for (p in semantics)
        {
            if (semantics.hasOwnProperty(p))
            {
                params = semantics[p];
                this._storeEntity(p, gd.createSemantics(params));
            }
        }

        var techniques = resources.techniques;
        for (p in techniques)
        {
            if (techniques.hasOwnProperty(p))
            {
                params = techniques[p];
                this._storeEntity(p, this._resolveEntity(params.shader).getTechnique(params.name));
            }
        }

        resourcesObject.resources = {};
    }

    public addData(dataObject)
    {
        var data = dataObject.data;
        var length = data.length;
        var n;
        for (n = 0; n < length; n += 2)
        {
            this._storeEntity(data[n], data[n + 1]);
        }
        data.length = 0;

        var gd = this.gd;
        var objects = dataObject.objects;
        length = objects.length;
        var id, fileObject, object, objectLength, j, k, v, entity;
        for (n = 0; n < length; n += 2)
        {
            id = objects[n];
            fileObject = objects[n + 1];
            objectLength = fileObject.length;
            object = gd.createTechniqueParameters();
            for (j = 0; j < objectLength; j += 2)
            {
                k = fileObject[j];
                v = fileObject[j + 1];
                if (typeof v === "string")
                {
                    entity = this._resolveEntity(v);
                    if (entity instanceof Array)
                    {
                        entity = new Float32Array(entity);
                        this._storeEntity(v, entity);
                    }
                    object[k] = entity;
                }
                else
                {
                    object[k] = v;
                }
            }
            this._storeEntity(id, object);
        }
        objects.length = 0;
    }

    public addFrames(framesObject, reset?)
    {
        var commands = framesObject.commands;
        var numCommands = commands.length;
        var fileFrames = framesObject.frames;
        var numFileFrames = fileFrames.length;
        var frames = this.frames;
        var n, c, command, cmdId;
        if (reset)
        {
            var numFrames = frames.length;
            for (n = 0; n < numFrames; n += 1)
            {
                frames[n].length = 0;
                frames[n] = null;
            }
            frames.length = 0;
        }
        for (n = 0; n < numCommands; n += 1)
        {
            var command = commands[n];
            var numArguments = command.length;
            var method = command[0];
            if (method === CaptureGraphicsCommand.setTechniqueParameters)
            {
                command[1] = this._resolveEntity(command[1]); // TechniqueParameters
            }
            else if (method === CaptureGraphicsCommand.drawIndexed)
            {
                // Nothing to resolve
            }
            else if (method === CaptureGraphicsCommand.draw)
            {
                // Nothing to resolve
            }
            else if (method === CaptureGraphicsCommand.setIndexBuffer)
            {
                command[1] = this._resolveEntity(command[1]); // IndexBuffer
            }
            else if (method === CaptureGraphicsCommand.setStream)
            {
                command[1] = this._resolveEntity(command[1]); // VertexBuffer
                command[2] = this._resolveEntity(command[2]); // Semantics
            }
            else if (method === CaptureGraphicsCommand.setTechnique)
            {
                command[1] = this._resolveEntity(command[1]); // Technique
            }
            else if (method === CaptureGraphicsCommand.setData)
            {
                command[1] = this._resolveEntity(command[1]); // Object
                command[4] = this._resolveEntity(command[4]); // Data
            }
            else if (method === CaptureGraphicsCommand.setAllData)
            {
                command[1] = this._resolveEntity(command[1]); // Object
                command[2] = this._resolveEntity(command[2]); // Data
            }
            else if (method === CaptureGraphicsCommand.beginRenderTarget)
            {
                command[1] = this._resolveEntity(command[1]); // RenderTarget
            }
            else if (method === CaptureGraphicsCommand.clear)
            {
                command[1] = this._resolveEntity(command[1]); // Color object
            }
            else if (method === CaptureGraphicsCommand.endRenderTarget)
            {
                // Nothing to resolve
            }
            else if (method === CaptureGraphicsCommand.beginEndDraw)
            {
                command[3] = this._resolveEntity(command[3]); // Formats
                command[4] = this._resolveEntity(command[4]); // Semantics
                command[5] = this._resolveEntity(command[5]); // Data
            }
            else if (method === CaptureGraphicsCommand.setViewport)
            {
                // Nothing to resolve
            }
            else if (method === CaptureGraphicsCommand.setScissor)
            {
                // Nothing to resolve
            }
            else if (method === CaptureGraphicsCommand.beginOcclusionQuery)
            {
                command[1] = this._resolveEntity(command[1]); // Query
            }
            else if (method === CaptureGraphicsCommand.endOcclusionQuery)
            {
                command[1] = this._resolveEntity(command[1]); // Query
            }
            else if (method === CaptureGraphicsCommand.destroy)
            {
                command[1] = this._resolveEntity(command[1]); // Object
            }
            else
            {
                if (this.onerror)
                {
                    this.onerror('Unknown command: ' + method);
                }
                break;
            }
        }

        for (n = 0; n < numFileFrames; n += 1)
        {
            var frame = fileFrames[n];
            var numCommands = frame.length;
            for (c = 0; c < numCommands; c += 1)
            {
                cmdId = frame[c];
                command = commands[cmdId];
                frame[c] = command;
            }
            frames.push(frame);
        }
        commands.length = 0;
        fileFrames.length = 0;
    }

    private _beginEndDraw(primitive, numVertices, formats, semantics, data)
    {
        var writer = this.gd.beginDraw(primitive, numVertices, formats, semantics);
        if (writer)
        {
            var write = writer.write;
            var numTotalComponents = data.length;
            var numComponents = Math.floor(numTotalComponents / numVertices);
            var writerData = this.writerData;
            writerData.length = numComponents;
            var n = 0;
            while (n < numTotalComponents)
            {
                var i;
                for (i = 0; i < numComponents; i += 1)
                {
                    writerData[i] = data[n];
                    n += 1;
                }
                write.apply(writer, writerData);
            }
            this.gd.endDraw(writer);
        }
    }

    public play(frameIndex)
    {
        var frame = this.frames[frameIndex];
        if (!frame)
        {
            return false;
        }

        var gd = this.gd;
        var numCommands = frame.length;
        var c;
        for (c = 0; c < numCommands; c += 1)
        {
            var command = frame[c];
            var method = command[0];
            if (method === CaptureGraphicsCommand.setTechniqueParameters)
            {
                gd.setTechniqueParameters(command[1]);
            }
            else if (method === CaptureGraphicsCommand.drawIndexed)
            {
                gd.drawIndexed(command[1],
                               command[2],
                               command[3]);
            }
            else if (method === CaptureGraphicsCommand.draw)
            {
                gd.draw(command[1],
                        command[2],
                        command[3]);
            }
            else if (method === CaptureGraphicsCommand.setIndexBuffer)
            {
                gd.setIndexBuffer(command[1]);
            }
            else if (method === CaptureGraphicsCommand.setStream)
            {
                gd.setStream(command[1],
                             command[2],
                             command[3]);
            }
            else if (method === CaptureGraphicsCommand.setTechnique)
            {
                gd.setTechnique(command[1]);
            }
            else if (method === CaptureGraphicsCommand.setData)
            {
                command[1].setData(command[4],
                                   command[2],
                                   command[3]);
            }
            else if (method === CaptureGraphicsCommand.setAllData)
            {
                command[1].setData(command[2]);
            }
            else if (method === CaptureGraphicsCommand.beginRenderTarget)
            {
                gd.beginRenderTarget(command[1]);
            }
            else if (method === CaptureGraphicsCommand.clear)
            {
                gd.clear(command[1],
                         command[2],
                         command[3]);
            }
            else if (method === CaptureGraphicsCommand.endRenderTarget)
            {
                gd.endRenderTarget();
            }
            else if (method === CaptureGraphicsCommand.beginEndDraw)
            {
                this._beginEndDraw(command[1],
                                   command[2],
                                   command[3],
                                   command[4],
                                   command[5]);
            }
            else if (method === CaptureGraphicsCommand.setViewport)
            {
                var x = command[1];
                var y = command[2];
                var w = command[3];
                var h = command[4];
                if (w === -1)
                {
                    w = gd.width;
                }
                if (h === -1)
                {
                    h = gd.height;
                }
                gd.setViewport(x, y, w, h);
            }
            else if (method === CaptureGraphicsCommand.setScissor)
            {
                var x = command[1];
                var y = command[2];
                var w = command[3];
                var h = command[4];
                if (w === -1)
                {
                    w = gd.width;
                }
                if (h === -1)
                {
                    h = gd.height;
                }
                gd.setScissor(x, y, w, h);
            }
            else if (method === CaptureGraphicsCommand.beginOcclusionQuery)
            {
                gd.beginOcclusionQuery(command[1]);
            }
            else if (method === CaptureGraphicsCommand.endOcclusionQuery)
            {
                gd.endOcclusionQuery(command[1]);
            }
            else if (method === CaptureGraphicsCommand.destroy)
            {
                command[1].destroy();
            }
            else
            {
                if (this.onerror)
                {
                    this.onerror('Unknown command: ' + method);
                }
                break;
            }
        }

        return true;
    }

    public destroy()
    {
        this.gd = null;
        this.frames = null;
        this.entities = null;
    }

    public static create(gd) : PlaybackGraphicsDevice
    {
        return new PlaybackGraphicsDevice(gd);
    }
};
