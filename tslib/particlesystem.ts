// Copyright (c) 2012 Turbulenz Limited

/*global
Float32Array: false
Uint8Array: false
Uint16Array: false
Uint32Array: false
VMath: false
*/

"use strict";

interface FloatArray {
    [index: number]: number;
    length: number;
}

//
// TextureEncode
//
// Used to encode/decode floats/vectors into pixel values for texture storage.
// Analogous to methods of particles-commmon.cgh
//
class TextureEncode
{
    static version = 1;

    // f in [0,1) map to 8bit integer value.
    // Note: Can represent 0.5 exactly.
    static encodeByteUnsignedFloat(f: number): number
    {
        return f <= 0.0 ? 0x00
             : f >= 1.0 ? 0xff
             : ((f * 256.0) | 0);
    }
    static decodeByteUnsignedFloat(v: number): number
    {
        return (v / 256.0);
    }

    // f in [-1,1) map to 8bit integer value.
    // Note: Can represent 0.0 exactly.
    static encodeByteSignedFloat(f: number): number
    {
        return TextureEncode.encodeByteUnsignedFloat((f + 1.0) * 0.5);
    }
    static decodeByteSignedFloat(v: number): number
    {
        return (TextureEncode.decodeByteUnsignedFloat(v) * 2.0) - 1.0;
    }

    // f in [0,1) map to 16bit integer value.
    // Note: Can represent 0.5 exactly.
    static encodeHalfUnsignedFloat(f: number): number
    {
        if (f <= 0.0)
        {
            return 0x0000;
        }
        else if (f >= 1.0)
        {
            return 0xffff;
        }
        else
        {
            var x = ((f * 256.0) % 1.0) * 256.0;
            var y = (f % 1.0) * 256.0;
            y -= x / 256.0;
            return (x | (y << 8));
        }
    }
    static decodeHalfUnsignedFloat(v: number): number
    {
        var x = (v & 0xff);
        var y = (v >>> 8);
        return (x / 65536.0) + (y / 256.0);
    }

    // f in [-1,1) map to 16bit integer value.
    // Note: Can represent 0.0 exactly.
    static encodeHalfSignedFloat(f: number): number
    {
        return TextureEncode.encodeHalfUnsignedFloat((f + 1.0) * 0.5);
    }
    static decodeHalfSignedFloat(v: number): number
    {
        return (TextureEncode.decodeHalfUnsignedFloat(v) * 2.0) - 1.0;
    }

    // f in [0,1) map to 32bit integer value.
    // Note: Can represent 0.5 exactly.
    static encodeUnsignedFloat(f: number): number
    {
        if (f <= 0.0)
        {
            return 0x00000000;
        }
        else if (f >= 1.0)
        {
            return -1; // 0xffffffff does not give -1 in JS due to not having a real int32 type.
        }
        else
        {
            var x = ((f * 16777216.0) % 1.0) * 256.0;
            var y = ((f * 65536.0) % 1.0) * 256.0;
            var z = ((f * 256.0) % 1.0) * 256.0;
            var w = (f % 1.0) * 256.0;
            w -= z / 256.0;
            z -= y / 256.0;
            y -= x / 256.0;
            return (x | (y << 8) | (z << 16) | (w << 24));
        }
    }
    static decodeUnsignedFloat(v: number): number
    {
        var x = (v & 0xff);
        var y = (v >>> 8) & 0xff;
        var z = (v >>> 16) & 0xff;
        var w = (v >>> 24);
        return (x / 4294967296.0) + (y / 16777216.0) + (z / 65536.0) + (w / 256.0);
    }

    // f in [-1,1) map to 32bit integer value.
    // Note: Can represent 0.0 exactly.
    static encodeSignedFloat(f: number): number
    {
        return TextureEncode.encodeUnsignedFloat((f + 1.0) * 0.5);
    }
    static decodeSignedFloat(v: number): number
    {
        return (TextureEncode.decodeUnsignedFloat(v) * 2.0) - 1.0;
    }

    // v in [0,1]*4 map to 32bit integer value.
    // Note: Cannot represent 0.5's exactly, but does encode 1.0's.
    static encodeUnsignedFloat4(v: FloatArray): number
    {
        var x = v[0];
        var y = v[1];
        var z = v[2];
        var w = v[3];
        x = (x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x) * 0xff;
        y = (y < 0.0 ? 0.0 : y > 1.0 ? 1.0 : y) * 0xff;
        z = (z < 0.0 ? 0.0 : z > 1.0 ? 1.0 : z) * 0xff;
        w = (w < 0.0 ? 0.0 : w > 1.0 ? 1.0 : w) * 0xff;
        return (x | (y << 8) | (z << 16) | (w << 24));
    }
    static decodeUnsignedFloat4(v: number, dst?: FloatArray): FloatArray
    {
        if (dst === undefined)
        {
            dst = VMath.v4BuildZero();
        }
        dst[0] = (v & 0xff) / 0xff;
        dst[1] = ((v >>> 8) & 0xff) / 0xff;
        dst[2] = ((v >>> 16) & 0xff) / 0xff;
        dst[3] = (v >>> 24) / 0xff;
        return dst;
    }

    // v in [0,1)*2 map to 32bit integer value.
    // Note: Can represent 0.5's exactly.
    static encodeUnsignedFloat2(v: FloatArray): number
    {
        var x = TextureEncode.encodeHalfUnsignedFloat(v[0]);
        var y = TextureEncode.encodeHalfUnsignedFloat(v[1]);
        return (x | (y << 16));
    }
    static decodeUnsignedFloat2(v: number, dst?: FloatArray): FloatArray
    {
        if (dst === undefined)
        {
            dst = VMath.v2BuildZero();
        }
        dst[0] = TextureEncode.decodeHalfUnsignedFloat(v & 0xffff);
        dst[1] = TextureEncode.decodeHalfUnsignedFloat(v >>> 16);
        return dst;
    }

    // v in [-1,1)*2 map to 32bit integer value.
    // Note: Can represent 0.0's exactly.
    static encodeSignedFloat2(v: FloatArray): number
    {
        var x = TextureEncode.encodeHalfSignedFloat(v[0]);
        var y = TextureEncode.encodeHalfSignedFloat(v[1]);
        return (x | (y << 16));
    }
    static decodeSignedFloat2(v: number, dst?: FloatArray): FloatArray
    {
        if (dst === undefined)
        {
            dst = VMath.v2BuildZero();
        }
        dst[0] = TextureEncode.decodeHalfSignedFloat(v & 0xffff);
        dst[1] = TextureEncode.decodeHalfSignedFloat(v >>> 16);
        return dst;
    }
}

//
// ParticleQueue (private type)
//
// Represents the available particles in a system efficiently using a min-binary heap
// whose key is the absolute time at which a particle will die.
//
class ParticleQueue
{
    // (time, index) pair list
    private heap: Float32Array;
    private heapSize: number;

    // Time since queue was created
    private time: number;
    // Current time of last particle death in system.
    private lastDeath: number;

    // Whether the last creation was forced.
    wasForced: boolean;

    private swap(i1, i2)
    {
        var heap = this.heap;
        var tmp = heap[i1];
        heap[i1] = heap[i2];
        heap[i2] = tmp;

        tmp = heap[i1 + 1];
        heap[i1 + 1] = heap[i2 + 1];
        heap[i2 + 1] = tmp;
    }

    // pre: maxParticles >= 0
    constructor(maxParticles: number)
    {
        this.heapSize = maxParticles << 1;
        this.heap = new Float32Array(this.heapSize);
        this.time = 0.0;
        this.wasForced = false;
        this.lastDeath = 0.0;

        // Set up indices
        var i;
        for (i = 0; i < maxParticles; i += 1)
        {
            this.heap[(i << 1) + 1] = i;
        }
    }

    clear(): void
    {
        var i;
        var count = (this.heapSize >>> 1);
        // reset times.
        for (i = 0; i < count; i += 1)
        {
            this.heap[i << 1] = 0.0;
        }
        this.time = 0.0;
        this.wasForced = false;
        this.lastDeath = 0.0;
    }

    // Remove element from binary heap at some location 'i'
    //   and re-insert it again with new time value.
    replace(i: number, time: number)
    {
        // Swap element with last in heap.
        //   Filter element either up or down to re-heapify.
        //   This 'removes' the element from the heap
        var heap = this.heap;
        var h2 = this.heapSize - 2;
        if (i !== h2)
        {
            this.swap(i, h2);
            // Check if we must filter up or down.
            var parent = ((i - 2) >>> 2) << 1;
            if (i === 0 || heap[i] >= heap[parent])
            {
                // Filter down
                while (true)
                {
                    var left  = (i << 1) + 2;
                    var right = (i << 1) + 4;
                    var small = i;
                    if (left  < h2 && heap[left]  < heap[small])
                    {
                        small = left;
                    }
                    if (right < h2 && heap[right] < heap[small])
                    {
                        small = right;
                    }
                    if (i === small)
                    {
                        break;
                    }
                    this.swap(i, small);
                    i = small;
                }
            }
            else
            {
                // Filter up
                while (parent !== i && heap[i] < heap[parent])
                {
                    this.swap(i, parent);
                    i = parent;
                    if (parent === 0)
                    {
                        break;
                    }
                    parent = ((parent - 2) >>> 2) << 1;
                }
            }
        }

        // set new time for last element in heap.
        // and filter up to correct position.
        i = h2;
        heap[i] = time;
        if (i !== 0)
        {
            var parent = ((i - 2) >>> 2) << 1;
            while (parent !== i && heap[i] < heap[parent])
            {
                this.swap(i, parent);
                i = parent;
                if (parent === 0)
                {
                    break;
                }
                parent = ((parent - 2) >>> 2) << 1;
            }
        }

        return heap[i + 1];
    }

    private find(particleID: number): number
    {
        var i = 0;
        var heap = this.heap;
        var count = this.heapSize;
        while (i < count)
        {
            if (heap[i + 1] === particleID)
            {
                break;
            }
            i += 2;
        }
        return i;
    }

    removeParticle(particleID: number): void
    {
        // insert with time = 0 so that particle is moved to
        // root of heap (most efficent removal method).
        this.replace(this.find(particleID), 0);
    }

    updateParticle(particleID: number, lifeDelta: number): void
    {
        var i = this.find(particleID);
        var deathTime = this.heap[i] + lifeDelta;
        // Prevent updates on dead particles making them
        // even more dead (violates heap property in general).
        if (deathTime < this.time)
        {
            deathTime = this.time;
        }
        if (deathTime > this.lastDeath)
        {
            this.lastDeath = deathTime;
        }
        this.replace(i, deathTime);
    }

    create(timeTillDeath: number, forceCreation:boolean = false): number
    {
        if (forceCreation || (this.heap[0] <= this.time))
        {
            this.wasForced = (this.heap[0] > this.time);
            var id = this.heap[1];
            var deathTime = timeTillDeath + this.time;
            if (deathTime > this.lastDeath)
            {
                this.lastDeath = deathTime;
            }
            this.replace(0, deathTime);
            return id;
        }
        else
        {
            return null;
        }
    }

    // Returns if - after system updater - there will be any potentially live particles remaining.
    update(timeUpdate: number): boolean
    {
        this.time += timeUpdate;
        return (this.time < this.lastDeath);
    }
}

