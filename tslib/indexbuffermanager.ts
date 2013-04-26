// Copyright (c) 2010-2013 Turbulenz Limited

/// <reference path="turbulenz.d.ts" />
/// <reference path="debug.ts" />

interface IndexBufferPoolChunk
{
    baseIndex: number;
    length: number;
    nextChunk: IndexBufferPoolChunk;
};

interface IndexBufferPoolBucket
{
    headChunk: IndexBufferPoolChunk;
};

interface IndexBufferData
{
    indexBuffer: IndexBuffer;
    bucket: IndexBufferPoolBucket[];
};

interface IndexBuffersPool
{
    format: number;
    indexBufferData: IndexBufferData[];
};

//
// IndexBufferManager
//

class IndexBufferManager
{
    static version = 1;

    maxIndicesPerIndexBuffer = 262144;
    numBuckets = 10;

    indexBuffersPools: IndexBuffersPool[];  //Array keyed-off attribute
    debugCreatedIndexBuffers: number;
    graphicsDevice: GraphicsDevice;
    dynamicIndexBuffers: bool;

    //
    // bucket
    //
    bucket(numIndices): number
    {
        if (numIndices <= 64)
        {
            if (numIndices <= 16)
            {
                if (numIndices <= 8)
                {
                    return 0;
                }
                return 1;
            }

            if (numIndices <= 32)
            {
                return 2;
            }
            return 3;
        }

        if (numIndices <= 512)
        {
            if (numIndices <= 256)
            {
                if (numIndices <= 128)
                {
                    return 4;
                }
                return 5;
            }
            return 6;
        }

        if (numIndices <= 2048)
        {
            if (numIndices <= 1024)
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
    makeBuckets() : IndexBufferPoolBucket[]
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
    allocate(numIndices, format)
    {
        var indexbuffer = null;
        var baseIndex = 0;

        if (typeof format === "string")
        {
            format = this.graphicsDevice['INDEXFORMAT_' + format];
        }

        var indexbufferParameters : IndexBufferParameters =
        {
            numIndices: undefined,
            format: format,
            dynamic: this.dynamicIndexBuffers
        };

        var poolIndex;
        var maxIndicesPerIndexBuffer = this.maxIndicesPerIndexBuffer;

        var numIndexBuffersPools = this.indexBuffersPools.length;
        var indexBuffersPool;

        //Find the pool to allocate from
        for (poolIndex = 0; poolIndex < numIndexBuffersPools; poolIndex += 1)
        {
            if (this.indexBuffersPools[poolIndex].format === format)
            {
                indexBuffersPool = this.indexBuffersPools[poolIndex];
                break;
            }
        }

        if (!indexBuffersPool)
        {
            indexBuffersPool = { format: format,
                                  indexBufferData: [] };
            this.indexBuffersPools.push(indexBuffersPool);
        }

        var indexBufferData;
        if (numIndices < maxIndicesPerIndexBuffer)
        {
            //Start at the correct size bucket and then look in bigger buckets if there is no suitable space
            //TODO: track last allocation as start point - but needs to be valid.
            for (var bucketIndex = this.bucket(numIndices); !indexbuffer && bucketIndex < this.numBuckets; bucketIndex += 1)
            {
                var previousChunk;
                for (var indexBufferIndex = 0; !indexbuffer && (indexBufferIndex < indexBuffersPool.indexBufferData.length); indexBufferIndex += 1)
                {
                    indexBufferData = indexBuffersPool.indexBufferData[indexBufferIndex];

                    //Now find a to chunk allocate from
                    previousChunk = null;

                    for (var chunk = indexBufferData.bucket[bucketIndex].headChunk; chunk;  chunk = chunk.nextChunk)
                    {
                        if (numIndices <= chunk.length)
                        {
                            indexbuffer = indexBufferData.indexBuffer;
                            baseIndex = chunk.baseIndex;
                            if (numIndices < chunk.length)
                            {
                                chunk.baseIndex = (baseIndex + numIndices);
                                chunk.length -= numIndices;
                                var newBucketIndex = this.bucket(chunk.length);
                                if (newBucketIndex !== bucketIndex)
                                {
                                    if (previousChunk)
                                    {
                                        previousChunk.nextChunk =  chunk.nextChunk;
                                    }
                                    else
                                    {
                                        indexBufferData.bucket[bucketIndex].headChunk = chunk.nextChunk;
                                    }
                                    //Add to new bucket
                                    chunk.nextChunk = indexBufferData.bucket[newBucketIndex].headChunk;
                                    indexBufferData.bucket[newBucketIndex].headChunk = chunk;
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
                                    indexBufferData.bucket[bucketIndex].headChunk = chunk.nextChunk;
                                }
                                chunk.indexBuffer = null;
                            }
                            break;
                        }
                        previousChunk = chunk;
                    }
                }
            }

            if (!indexbuffer)
            {
                indexbufferParameters.numIndices = maxIndicesPerIndexBuffer;
                indexbuffer = this.graphicsDevice.createIndexBuffer(indexbufferParameters);
                this.debugCreatedIndexBuffers += 1;

                debug.assert(indexbuffer, "IndexBuffer not created.");

                if (indexbuffer)
                {
                    indexBufferData = {indexBuffer: indexbuffer,
                                       bucket: this.makeBuckets()};

                    indexBufferData.bucket[this.bucket(maxIndicesPerIndexBuffer - numIndices)].headChunk = {baseIndex: numIndices,
                                                                                                                length: maxIndicesPerIndexBuffer - numIndices,
                                                                                                                nextChunk: null };

                    indexBuffersPool.indexBufferData.push(indexBufferData);
                }
            }
        }

        if (!indexbuffer)
        {
            indexbufferParameters.numIndices = numIndices;
            indexbuffer = this.graphicsDevice.createIndexBuffer(indexbufferParameters);
            this.debugCreatedIndexBuffers += 1;

            debug.assert(indexbuffer, "IndexBuffer not created.");

            if (indexbuffer)
            {
                indexBuffersPool.indexBufferData.push({indexBuffer: indexbuffer,
                                                         bucket: this.makeBuckets()});
            }
        }

        return {
            indexBuffer: indexbuffer,
            baseIndex: baseIndex,
            length: numIndices,
            poolIndex: poolIndex
        };
    };

    //
    // free
    //
    free(allocation)
    {
        var indexBuffersPool = this.indexBuffersPools[allocation.poolIndex];
        var indexBufferData;
        for (var indexBufferIndex = 0;
             indexBufferIndex < indexBuffersPool.indexBufferData.length;
             indexBufferIndex += 1)
        {
            if (allocation.indexBuffer ===
                indexBuffersPool.indexBufferData[indexBufferIndex].indexBuffer)
            {
                indexBufferData = indexBuffersPool.indexBufferData[indexBufferIndex];
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
            for (var chunk = indexBufferData.bucket[bucketIndex].headChunk; chunk && !(leftChunk && rightChunk);  chunk = chunk.nextChunk)
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
                indexBufferData.bucket[this.bucket(rightChunk.length)].headChunk = rightChunk.nextChunk;
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
                    indexBufferData.bucket[oldBucketIndex].headChunk = leftChunk.nextChunk;
                }
                //Add to new bucket
                leftChunk.nextChunk = indexBufferData.bucket[newBucketIndex].headChunk;
                indexBufferData.bucket[newBucketIndex].headChunk = leftChunk;
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
                    indexBufferData.bucket[oldBucketIndex].headChunk = leftChunk.nextChunk;
                }
                //Add to new bucket
                leftChunk.nextChunk = indexBufferData.bucket[newBucketIndex].headChunk;
                indexBufferData.bucket[newBucketIndex].headChunk = leftChunk;
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
                    indexBufferData.bucket[oldBucketIndex].headChunk = rightChunk.nextChunk;
                }
                //Add to new bucket
                rightChunk.nextChunk = indexBufferData.bucket[newBucketIndex].headChunk;
                indexBufferData.bucket[newBucketIndex].headChunk = rightChunk;
            }
        }
        else
        {
            var bucket = indexBufferData.bucket[this.bucket(allocation.length)];
            bucket.headChunk = {baseIndex: allocation.baseIndex,
                                length: allocation.length,
                                nextChunk: bucket.headChunk};
        }

        //See if the whole thing is free and if so free the VB
        var lastChunk = indexBufferData.bucket[this.numBuckets - 1].headChunk;
        if (lastChunk && lastChunk.length >= this.maxIndicesPerIndexBuffer)
        {
            indexBuffersPool.indexBufferData.splice(indexBufferIndex, 1);
            indexBufferData.indexBuffer.destroy();
            indexBufferData.indexBuffer = null;
            indexBufferData.bucket.length = 0;
            indexBufferData.bucket = null;
        }
    };

    //
    // destroy
    //
    destroy()
    {
        var indexBuffersPools = this.indexBuffersPools;
        if (indexBuffersPools)
        {
            var numIndexBuffersPools = indexBuffersPools.length;
            var i, j;
            for (i = 0; i < numIndexBuffersPools; i += 1)
            {
                var indexBuffersPool = indexBuffersPools[i];

                var indexBufferDataArray = indexBuffersPool.indexBufferData;
                var numIndexBufferData = indexBufferDataArray.length;
                for (j = 0; j < numIndexBufferData; j += 1)
                {
                    var indexBufferData = indexBufferDataArray[j];

                    var bucketArray = indexBufferData.bucket;
                    if (bucketArray)
                    {
                        bucketArray.length = 0;
                        indexBufferData.bucket = null;
                    }

                    var indexbuffer = indexBufferData.indexBuffer;
                    if (indexbuffer)
                    {
                        indexbuffer.destroy();
                        indexBufferData.indexBuffer = null;
                    }
                }
                indexBufferDataArray.length = 0;
            }
            indexBuffersPools.length = 0;

            this.indexBuffersPools = null;
        }

        this.graphicsDevice = null;
    };

    //
    // create
    //
    static create(graphicsDevice: GraphicsDevice,
                  dynamicIndexBuffers?: bool) : IndexBufferManager
    {
        var manager = new IndexBufferManager();

        manager.indexBuffersPools = [];    //Array keyed-off attribute
        manager.debugCreatedIndexBuffers = 0;
        manager.graphicsDevice = graphicsDevice;
        manager.dynamicIndexBuffers = dynamicIndexBuffers ? true : false;

        return manager;
    };

};
