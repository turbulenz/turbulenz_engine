// Copyright (c) 2010-2013 Turbulenz Limited

/// <reference path="turbulenz.d.ts" />
/// <reference path="debug.ts" />

interface VertexBuffersBucketChunk
{
    length: number;
    baseIndex: number;
    nextChunk: VertexBuffersBucketChunk;
};

interface VertexBuffersBucket
{
    headChunk: any;

};

interface VertexBuffersPool
{
    attributesHash: number;
    vertexBufferData: {
        vertexBuffer: VertexBuffer;
        bucket: VertexBuffersBucket[];
    }[];
};

interface VertexBufferAllocation
{
    vertexBuffer: VertexBuffer;
    baseIndex: number;
    length: number;
    poolIndex: number;
};

//
// VertexBufferManager
//

class VertexBufferManager
{
    static version = 1;

    maxVerticesPerVertexBuffer = 65535;
    numBuckets = 10;

    vertexBuffersPools: VertexBuffersPool[];  //Array keyed-off attribute
    debugCreatedVertexBuffers: number;
    graphicsDevice: GraphicsDevice;
    dynamicVertexBuffers: bool;

    //
    // bucket
    //
    bucket(numVertices): number
    {
        if (numVertices <= 64)
        {
            if (numVertices <= 16)
            {
                if (numVertices <= 8)
                {
                    return 0;
                }
                return 1;
            }

            if (numVertices <= 32)
            {
                return 2;
            }
            return 3;
        }

        if (numVertices <= 512)
        {
            if (numVertices <= 256)
            {
                if (numVertices <= 128)
                {
                    return 4;
                }
                return 5;
            }
            return 6;
        }

        if (numVertices <= 2048)
        {
            if (numVertices <= 1024)
            {
                return 7;
            }
            return 8;
        }
        return 9;
    };

    //
    // makeBuckets
    //
    makeBuckets(): VertexBuffersBucket[]
    {
        var result = [];

        for (var index = 0; index < this.numBuckets; index += 1)
        {
            result.push({headChunk: null});
        }
        return result;
    };

    //
    // allocate
    //
    allocate(numVertices, attributes) : VertexBufferAllocation
    {
        var vertexbuffer = null;
        var baseIndex = 0;

        var vertexbufferParameters : VertexBufferParameters =
        {
            numVertices: undefined,
            attributes: attributes,
            dynamic: this.dynamicVertexBuffers
        };

        var poolIndex;
        var maxVerticesPerVertexBuffer = this.maxVerticesPerVertexBuffer;

        var attributesHash = attributes.join();
        var numVertexBuffersPools = this.vertexBuffersPools.length;
        var vertexBuffersPool;

        //Find the pool to allocate from
        for (poolIndex = 0; poolIndex < numVertexBuffersPools; poolIndex += 1)
        {
            if (this.vertexBuffersPools[poolIndex].attributesHash === attributesHash)
            {
                vertexBuffersPool = this.vertexBuffersPools[poolIndex];
                break;
            }
        }

        if (!vertexBuffersPool)
        {
            vertexBuffersPool = { attributesHash: attributesHash,
                                  vertexBufferData: [] };
            this.vertexBuffersPools.push(vertexBuffersPool);
        }

        var vertexBufferData;
        if (numVertices < maxVerticesPerVertexBuffer)
        {
            //Start at the correct size bucket and then look in bigger buckets if there is no suitable space
            //TODO: track last allocation as start point - but needs to be valid.
            for (var bucketIndex = this.bucket(numVertices); !vertexbuffer && bucketIndex < this.numBuckets; bucketIndex += 1)
            {
                var previousChunk;
                for (var vertexBufferIndex = 0; !vertexbuffer && (vertexBufferIndex < vertexBuffersPool.vertexBufferData.length); vertexBufferIndex += 1)
                {
                    vertexBufferData = vertexBuffersPool.vertexBufferData[vertexBufferIndex];

                    //Now find a to chunk allocate from
                    previousChunk = null;

                    for (var chunk = vertexBufferData.bucket[bucketIndex].headChunk; chunk;  chunk = chunk.nextChunk)
                    {
                        if (numVertices <= chunk.length)
                        {
                            vertexbuffer = vertexBufferData.vertexBuffer;
                            baseIndex = chunk.baseIndex;
                            if (numVertices < chunk.length)
                            {
                                chunk.baseIndex = (baseIndex + numVertices);
                                chunk.length -= numVertices;
                                var newBucketIndex = this.bucket(chunk.length);
                                if (newBucketIndex !== bucketIndex)
                                {
                                    if (previousChunk)
                                    {
                                        previousChunk.nextChunk =  chunk.nextChunk;
                                    }
                                    else
                                    {
                                        vertexBufferData.bucket[bucketIndex].headChunk = chunk.nextChunk;
                                    }
                                    //Add to new bucket
                                    chunk.nextChunk = vertexBufferData.bucket[newBucketIndex].headChunk;
                                    vertexBufferData.bucket[newBucketIndex].headChunk = chunk;
                                }
                            }
                            else
                            {
                                //Allocated whole chunk so remove it.
                                if (previousChunk)
                                {
                                    previousChunk.nextChunk =  chunk.nextChunk;
                                }
                                else
                                {
                                    vertexBufferData.bucket[bucketIndex].headChunk = chunk.nextChunk;
                                }
                                chunk.vertexBuffer = null;
                            }
                            break;
                        }
                        previousChunk = chunk;
                    }
                }
            }

            if (!vertexbuffer)
            {
                vertexbufferParameters.numVertices = maxVerticesPerVertexBuffer;
                vertexbuffer = this.graphicsDevice.createVertexBuffer(vertexbufferParameters);
                this.debugCreatedVertexBuffers += 1;

                debug.assert(vertexbuffer, "VertexBuffer not created.");

                if (vertexbuffer)
                {
                    vertexBufferData = {vertexBuffer: vertexbuffer,
                                        bucket: this.makeBuckets()};

                    vertexBufferData.bucket[this.bucket(maxVerticesPerVertexBuffer - numVertices)].headChunk = {baseIndex: numVertices,
                                                                                                                length: maxVerticesPerVertexBuffer - numVertices,
                                                                                                                nextChunk: null };

                    vertexBuffersPool.vertexBufferData.push(vertexBufferData);
                }
            }
        }

        if (!vertexbuffer)
        {
            vertexbufferParameters.numVertices = numVertices;
            vertexbuffer = this.graphicsDevice.createVertexBuffer(vertexbufferParameters);
            this.debugCreatedVertexBuffers += 1;

            debug.assert(vertexbuffer, "VertexBuffer not created.");

            if (vertexbuffer)
            {
                vertexBuffersPool.vertexBufferData.push({vertexBuffer: vertexbuffer,
                                                         bucket: this.makeBuckets()});
            }
        }

        return {
            vertexBuffer: vertexbuffer,
            baseIndex: baseIndex,
            length: numVertices,
            poolIndex: poolIndex
        };
    };

    //
    // free
    //
    free(allocation: VertexBufferAllocation)
    {
        var vertexBuffersPool = this.vertexBuffersPools[allocation.poolIndex];
        var vertexBufferData;
        for (var vertexBufferIndex = 0; vertexBufferIndex < vertexBuffersPool.vertexBufferData.length; vertexBufferIndex += 1)
        {
            if (allocation.vertexBuffer ===
                vertexBuffersPool.vertexBufferData[vertexBufferIndex].vertexBuffer)
            {
                vertexBufferData = vertexBuffersPool.vertexBufferData[vertexBufferIndex];
                break;
            }
        }
        //TODO: optimise
        var leftChunk;
        var leftChunkPrevious;
        var rightChunk;
        var rightChunkPrevious;
        var previous;
        for (var bucketIndex = 0; !(leftChunk && rightChunk) && (bucketIndex < this.numBuckets); bucketIndex += 1)
        {
            previous = null;
            for (var chunk = vertexBufferData.bucket[bucketIndex].headChunk; chunk && !(leftChunk && rightChunk);  chunk = chunk.nextChunk)
            {
                if (!leftChunk)
                {
                    if (chunk.baseIndex + chunk.length === allocation.baseIndex)
                    {
                        leftChunk = chunk;
                        leftChunkPrevious = previous;
                    }
                }
                if (!rightChunk)
                {
                    if (chunk.baseIndex === allocation.baseIndex + allocation.length)
                    {
                        rightChunk = chunk;
                        rightChunkPrevious = previous;
                    }
                }
                previous = chunk;
            }
        }

        var oldBucketIndex;
        var newBucketIndex;
        if (leftChunk && rightChunk)
        {
            oldBucketIndex = this.bucket(leftChunk.length);
            leftChunk.length += allocation.length + rightChunk.length;

            //destroy right - before any move of left, as it previous could be the left...
            if (rightChunkPrevious)
            {
                rightChunkPrevious.nextChunk = rightChunk.nextChunk;
                if (rightChunk === leftChunkPrevious)
                {
                    leftChunkPrevious = rightChunkPrevious;
                }
            }
            else
            {
                vertexBufferData.bucket[this.bucket(rightChunk.length)].headChunk = rightChunk.nextChunk;
                if (rightChunk === leftChunkPrevious)
                {
                    leftChunkPrevious = null;
                }
            }

            //move left if it needs to
            newBucketIndex = this.bucket(leftChunk.length);
            if (newBucketIndex !== oldBucketIndex)
            {
                if (leftChunkPrevious)
                {
                    leftChunkPrevious.nextChunk =  leftChunk.nextChunk;
                }
                else
                {
                    vertexBufferData.bucket[oldBucketIndex].headChunk = leftChunk.nextChunk;
                }
                //Add to new bucket
                leftChunk.nextChunk = vertexBufferData.bucket[newBucketIndex].headChunk;
                vertexBufferData.bucket[newBucketIndex].headChunk = leftChunk;
            }
        }
        else if (leftChunk)
        {
            oldBucketIndex = this.bucket(leftChunk.length);
            leftChunk.length += allocation.length;

            newBucketIndex = this.bucket(leftChunk.length);

            if (newBucketIndex !== oldBucketIndex)
            {
                if (leftChunkPrevious)
                {
                    leftChunkPrevious.nextChunk =  leftChunk.nextChunk;
                }
                else
                {
                    vertexBufferData.bucket[oldBucketIndex].headChunk = leftChunk.nextChunk;
                }
                //Add to new bucket
                leftChunk.nextChunk = vertexBufferData.bucket[newBucketIndex].headChunk;
                vertexBufferData.bucket[newBucketIndex].headChunk = leftChunk;
            }
        }
        else if (rightChunk)
        {
            oldBucketIndex = this.bucket(rightChunk.length);
            rightChunk.baseIndex = allocation.baseIndex;
            rightChunk.length += allocation.length;

            newBucketIndex = this.bucket(rightChunk.length);

            if (newBucketIndex !== oldBucketIndex)
            {
                if (rightChunkPrevious)
                {
                    rightChunkPrevious.nextChunk =  rightChunk.nextChunk;
                }
                else
                {
                    vertexBufferData.bucket[oldBucketIndex].headChunk = rightChunk.nextChunk;
                }
                //Add to new bucket
                rightChunk.nextChunk = vertexBufferData.bucket[newBucketIndex].headChunk;
                vertexBufferData.bucket[newBucketIndex].headChunk = rightChunk;
            }
        }
        else
        {
            var bucket = vertexBufferData.bucket[this.bucket(allocation.length)];
            bucket.headChunk = {baseIndex: allocation.baseIndex,
                                length: allocation.length,
                                nextChunk: bucket.headChunk};
        }

        //See if the whole thing is free and if so free the VB
        var lastChunk = vertexBufferData.bucket[this.numBuckets - 1].headChunk;
        if (lastChunk && lastChunk.length >= this.maxVerticesPerVertexBuffer)
        {
            vertexBuffersPool.vertexBufferData.splice(vertexBufferIndex, 1);
            vertexBufferData.vertexBuffer.destroy();
            vertexBufferData.vertexBuffer = null;
            vertexBufferData.bucket.length = 0;
            vertexBufferData.bucket = null;
        }
    };

    //
    // destroy
    //
    destroy()
    {
        var vertexBuffersPools = this.vertexBuffersPools;
        if (vertexBuffersPools)
        {
            var numVertexBuffersPools = vertexBuffersPools.length;
            var i, j;
            for (i = 0; i < numVertexBuffersPools; i += 1)
            {
                var vertexBuffersPool = vertexBuffersPools[i];

                var vertexBufferDataArray = vertexBuffersPool.vertexBufferData;
                var numVertexBufferData = vertexBufferDataArray.length;
                for (j = 0; j < numVertexBufferData; j += 1)
                {
                    var vertexBufferData = vertexBufferDataArray[j];

                    var bucketArray = vertexBufferData.bucket;
                    if (bucketArray)
                    {
                        bucketArray.length = 0;
                        vertexBufferData.bucket = null;
                    }

                    var vertexbuffer = vertexBufferData.vertexBuffer;
                    if (vertexbuffer)
                    {
                        vertexbuffer.destroy();
                        vertexBufferData.vertexBuffer = null;
                    }
                }
                vertexBufferDataArray.length = 0;
            }
            vertexBuffersPools.length = 0;

            this.vertexBuffersPools = null;
        }

        this.graphicsDevice = null;
    };

    //
    // create
    //
    static create(graphicsDevice: GraphicsDevice,
                  dynamicVertexBuffers?: bool) : VertexBufferManager
    {
        var manager = new VertexBufferManager();

        manager.vertexBuffersPools = [];    //Array keyed-off attribute
        manager.debugCreatedVertexBuffers = 0;
        manager.graphicsDevice = graphicsDevice;
        manager.dynamicVertexBuffers = dynamicVertexBuffers ? true : false;

        return manager;
    };

};
