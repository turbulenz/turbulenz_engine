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
// SizeTree (private type)
//
// A 2D AABB Tree working only with the 'sizes' of boxes rather than extents
// Implemented differently from BoxTree/AABBTree as this tree does not need
// to support overlapping queries, but only a search whose main characteristic
// is to discard AABB's that are too small.
//
interface SizeTreeNode<T>
{
    // Size and associated data
    w: number;
    h: number;

    // leaf only
    data: T;

    // Tree links and sub-tree height
    parent: SizeTreeNode<T>;
    height: number;

    // non-leaf only
    child : Array<SizeTreeNode<T>>; // Pair

    // Tree constraints:
    //
    // data === null <> child !== null
    // child !== null => child.length = 2 and they're valid
    // data.height = 1 + max(childs height's)
    // (w,h) >= childs heights (each component separate)
    // (w,h) is minimal.
    // abs(child1.height - child2.height) in {-1,0,1}
}
class SizeTree<T>
{
    private root: SizeTreeNode<T>;

    constructor()
    {
        this.root = null;
    }

    private static gen<T>(data: T, w: number, h: number): SizeTreeNode<T>
    {
        return {
            w: w,
            h: h,
            data: data,
            parent: null,
            child: null,
            height: 0
        };
    }

    insert (data: T, w: number, h: number): SizeTreeNode<T>
    {
        var leaf = SizeTree.gen(data, w, h);
        if (!this.root)
        {
            this.root = leaf;
        }
        else
        {
            var node = this.root;
            while (node.child)
            {
                var child0 = node.child[0];
                var child1 = node.child[1];

                // cost of creating a new parent for this node and leaf.
                var ncost = (node.w > leaf.w ? node.w : leaf.w) +
                            (node.h > leaf.h ? node.h : leaf.h);
                // cost of pushing leaf further down the tree.
                var icost = ncost - (node.w + node.h);
                // cost of descending into a particular child.
                var cost0 = (child0.w > leaf.w ? child0.w : leaf.w) +
                            (child0.h > leaf.h ? child0.h : leaf.h) + icost;
                var cost1 = (child1.w > leaf.w ? child1.w : leaf.w) +
                            (child1.h > leaf.h ? child1.h : leaf.h) + icost;
                if (child0.child)
                {
                    cost0 -= (child0.w + child0.h);
                }
                if (child1.child)
                {
                    cost1 -= (child1.w + child1.h);
                }

                if (ncost < cost0 && ncost < cost1)
                {
                    break;
                }
                else
                {
                    // Descend into cheaper child.
                    node = (cost0 < cost1) ? child0 : child1;
                }
            }

            var sibling = node;

            // Create a new parent for sibling and leaf
            var oparent = sibling.parent;
            var nparent = SizeTree.gen(null, (leaf.w > sibling.w ? leaf.w : sibling.w),
                                             (leaf.h > sibling.h ? leaf.h : sibling.h));
            nparent.parent = oparent;
            nparent.height = sibling.height + 1;
            sibling.parent = nparent;
            leaf.parent    = nparent;
            nparent.child  = [sibling, leaf];

            if (oparent)
            {
                // sibling is not the root of tree, set its parent's child ref.
                oparent.child[oparent.child[0] === sibling ? 0 : 1] = nparent;
            }
            else
            {
                // sibiling is the root of tree, set new root.
                this.root = nparent;
            }

            // Adjust ancestor bounds and balance tree
            this.filterUp(nparent);
        }
        return leaf;
    }

    remove(leaf: SizeTreeNode<T>): void
    {
        if (leaf === this.root)
        {
            this.root = null;
        }
        else
        {
            var parent  = leaf.parent;
            var gparent = parent.parent;
            var sibling = parent.child[parent.child[0] === leaf ? 1 : 0];

            if (gparent)
            {
                // destroy parent and connect sibling and gparent.
                gparent.child[gparent.child[0] === parent ? 0 : 1] = sibling;
                sibling.parent = gparent;

                // Adjust ancestor bounds and balance tree
                this.filterUp(gparent);
            }
            else
            {
                this.root = sibling;
                sibling.parent = null;
            }
        }
    }

    private filterUp(node: SizeTreeNode<T>)
    {
        while (node)
        {
            node = this.balance(node);

            var child0 = node.child[0];
            var child1 = node.child[1];
            node.height = 1 + (child0.height > child1.height ? child0.height : child1.height);
            node.w      = (child0.w > child1.w ? child0.w : child1.w);
            node.h      = (child0.h > child1.h ? child0.h : child1.h);

            node = node.parent;
        }
    }

    private balance(node: SizeTreeNode<T>)
    {
        if (!node.child || node.height < 2)
        {
            // sub tree is already balanced.
            return node;
        }
        else
        {
            var child0 = node.child[0];
            var child1 = node.child[1];

            var balance = child1.height - child0.height;
            if (balance >= -1 && balance <= 1)
            {
                // sub tree is already balanced.
                return node;
            }

            // Decide which direction to rotate sub-tree.
            var rotate, other, childN;
            if (balance > 0)
            {
                rotate = child1;
                other  = child0;
                childN = 1;
            }
            else
            {
                rotate = child0;
                other  = child1;
                childN = 0;
            }

            // Rotate sub-tree.
            var gchild0 = rotate.child[0];
            var gchild1 = rotate.child[1];

            // swap node with rotate
            rotate.child[1 - childN] = node;
            rotate.parent = node.parent;
            node.parent = rotate;

            // make node's old parent point down to rotate
            // or set new root if appropriate.
            if (rotate.parent)
            {
                rotate.parent.child[rotate.parent.child[0] === node ? 0 : 1] = rotate;
            }
            else
            {
                this.root = rotate;
            }

            // Decide which grandchild to swing.
            var pivot, swing;
            if (gchild0.height > gchild1.height)
            {
                pivot = gchild0;
                swing = gchild1;
            }
            else
            {
                pivot = gchild1;
                swing = gchild0;
            }

            // Swing
            rotate.child[childN] = pivot;
            node.child[childN] = swing;
            swing.parent = node;

            // Recompute bounds and heights
            node.w   = (other.w > swing.w ? other.w : swing.w);
            node.h   = (other.h > swing.h ? other.h : swing.h);
            rotate.w = (node.w  > pivot.w ? node.w  : pivot.w);
            rotate.h = (node.h  > pivot.h ? node.h  : pivot.h);
            node.height   = 1 + (other.height > swing.height ? other.height : swing.height);
            rotate.height = 1 + (node.height  > pivot.height ? node.height  : pivot.height);

            return rotate;
        }
    }

    // Depth first traversal of tree executing lambda for every node
    traverse(lambda: (node: SizeTreeNode<T>) => boolean): void
    {
        // TODO, don't use a temporary for stack
        var stack = [];
        if (this.root)
        {
            stack.push(this.root);
        }
        while (stack.length !== 0)
        {
            var node = stack.pop();
            if (lambda(node) && node.child)
            {
                stack.push(node.child[0]);
                stack.push(node.child[1]);
            }
        }
    }

    // Depth first traversal of tree, searching for a minimum
    // cost leaf of the tree, discarding subtrees that are not
    // at least as wide, and as tall as the given (w,h).
    //
    // Cost function should return null for zero-cost leaf (upon
    // which search will terminate), or any real number.
    searchBestFit(w: number, h: number, getCost: (w: number, h: number, data: T) => number): SizeTreeNode<T>
    {
        // TODO, don't use a temporary for stack
        var stack = [];
        if (this.root)
        {
            stack.push(this.root);
        }

        var minCost = Number.POSITIVE_INFINITY;
        var minLeaf = null;
        while (stack.length !== 0)
        {
            var node = stack.pop();
            if (node.w >= w && node.h >= h)
            {
                if (node.child)
                {
                    stack.push(node.child[0]);
                    stack.push(node.child[1]);
                }
                else
                {
                    var cost = getCost(w, h, node.data);
                    if (cost === null)
                    {
                        // Early exit, got a best fit
                        minLeaf = node;
                        break;
                    }
                    else if (cost < minCost)
                    {
                        minCost = cost;
                        minLeaf = node;
                    }
                }
            }
        }
        return minLeaf;
    }
}

//
// OnlineTexturePacker
//
// Uses SizeTree to implement a reasonably performant (in terms of packing density) online packing
// algorithm designed for texture packing into shared storage where 'free-ing' allocated regions of
// shared textures is not required and fragmentation as a result can be ignored allowing high performance.
//
// Although intended for use with integer w/h (in which case x/y would also be integer in results)
// There is no reason for this not to be used with any finite strictly positive w/h
//
// The type actually returned from public API:
interface PackedRect
{
    // x,y,w,h of rectangle relative to bin.
    x: number;
    y: number;
    w: number;
    h: number;
    // bin index [0,N) for which texture is used.
    bin: number;
}
class OnlineTexturePacker
{
    // Store for optimised search of available free-space in bins
    private free: SizeTree<PackedRect>;
    // Set of bins (shared textures) 'allocated' for storage by packer
    // (readonly from public api side)
    bins: Array<PackedRect>;

    // Maximum dimensions of a bin.
    private maxWidth: number;
    private maxHeight: number;

    constructor(maxWidth: number, maxHeight: number)
    {
        this.free = new SizeTree<PackedRect>();
        this.bins = [];
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    private release(bin, x, y, w, h)
    {
        if (w !== 0 && h !== 0)
        {
            var rect = {
                x: x,
                y: y,
                w: w,
                h: h,
                bin: bin
            };
            this.free.insert(rect, w, h);
        }
    }

    // Cost of assigning (w,h) into given rectangle.
    //
    // Assign costs that primarily aims to assign exactly to a given empt space.
    // Failing that, we assign a low cost for stores that waste only a very small
    // amount of space, and a low cost for stores into much larger rectangles with
    // high costs inbetween.
    private static costFit(w, h, rect)
    {
        // Impossible fit.
        if (rect.w < w || rect.h < h)
        {
            return Number.POSITIVE_INFINITY;
        }
        // Exact fit (terminate early)
        else if (rect.w === w && rect.h === h)
        {
            return null;
        }
        else
        {
            var fw = rect.w / w;
            var fh = rect.h / h;
            var cw = Math.sin((1 - fw*fw) * Math.PI);
            var ch = Math.sin((1 - fh*fh) * Math.PI);
            return (cw * ch) + (cw + ch);
        }
    }

    // Pack (w,h) into texture store, possibly 'resizing' the virtual size of
    // a bin up to (maxWidth,maxHeight), and possibly 'creating' a new virtual texture (bin)
    pack(w: number, h: number): PackedRect
    {
        if (w > this.maxWidth || h > this.maxHeight)
        {
            return null;
        }

        var bin = 0;
        var node = this.free.searchBestFit(w, h, OnlineTexturePacker.costFit);
        if (node)
        {
            this.free.remove(node);
            return this.split(node.data, w, h);
        }
        else
        {
            return this.grow(w, h);
        }
    }

    private split(rect: PackedRect, w: number, h: number): PackedRect
    {
        // I have no idea why this choice of branch condition works as well as it does...
        if ((rect.w - w) < (rect.h - h))
        {
            this.release(rect.bin, rect.x, rect.y + h, rect.w, rect.h - h);
            this.release(rect.bin, rect.x + w, rect.y, rect.w - w, h);
        }
        else
        {
            this.release(rect.bin, rect.x, rect.y + h, w, rect.h - h);
            this.release(rect.bin, rect.x + w, rect.y, rect.w - w, rect.h);
        }
        return {
            x: rect.x,
            y: rect.y,
            w: w,
            h: h,
            bin: rect.bin
        };
    }

    private grow(w, h, bin = 0): PackedRect
    {
        if (bin >= this.bins.length)
        {
            this.bins.push({
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                bin: bin
            });
        }

        var rect = this.bins[bin];
        var canGrowRight = (rect.x + rect.w + w) <= this.maxWidth;
        var canGrowDown  = (rect.y + rect.h + h) <= this.maxHeight;

        // We decide which direction to grow, trying to avoid narrow regions being created.
        var shouldGrowRight = (Math.abs(rect.h - h) > Math.abs(rect.w - w));

        if (canGrowRight && shouldGrowRight)
        {
            return this.growRight(rect, w, h);
        }
        else if (canGrowDown)
        {
            return this.growDown(rect, w, h);
        }
        else
        {
            return this.grow(w, h, bin + 1);
        }
    }

    private growRight(rect: PackedRect, w, h): PackedRect
    {
        var fit = {
            x: rect.x + rect.w,
            y: rect.y,
            w: w,
            h: h,
            bin : rect.bin
        };
        if (h < rect.h)
        {
            this.release(rect.bin, rect.x + rect.w, rect.y + h, w, rect.h - h);
        }
        else
        {
            this.release(rect.bin, rect.x, rect.y + rect.h, rect.w, h - rect.h);
            rect.h = h;
        }
        rect.w += w;
        return fit;
    }
    private growDown(rect: PackedRect, w, h): PackedRect
    {
        var fit = {
            x: rect.x,
            y: rect.y + rect.h,
            w: w,
            h: h,
            bin: rect.bin
        };
        if (w < rect.w)
        {
            this.release(rect.bin, rect.x + w, rect.y + rect.h, rect.w - w, h);
        }
        else
        {
            this.release(rect.bin, rect.x + rect.w, rect.y, w - rect.w, rect.h);
            rect.w = w;
        }
        rect.h += h;
        return fit;
    }
}


//
// MinHeap
//
// Min binary heap using pairs of key/value and a given comparison function return true if key1 < key2
//
class MinHeap<K,T>
{
    private heap: Array<{ key: K; data: T; }>;
    private compare: (key1: K, key2: K) => boolean;

    private swap(i1, i2)
    {
        var heap = this.heap;
        var tmp = heap[i1];
        heap[i1] = heap[i2];
        heap[i2] = tmp;
    }

    constructor(compare: (key1: K, key2: K) => boolean)
    {
        this.compare = compare;
        this.heap = [];
    }

    clear(): void
    {
        this.heap = [];
    }

    // Remove element from binary heap at some location 'i'
    private removeNode(i: number)
    {
        // Swap element with last in heap.
        //   Filter element either up or down to re-heapify.
        //   This 'removes' the element from the heap
        var heap = this.heap;
        var h2 = heap.length - 1;
        if (i !== h2)
        {
            heap[i] = heap[h2];
            // Check if we must filter up or down.
            var parent = (i - 1) >>> 1;
            if (i === 0 || this.compare(heap[parent].key, heap[i].key))
            {
                // Filter down
                while (true)
                {
                    var left  = (i << 1) + 1;
                    var right = (i << 1) + 2;
                    var small = i;
                    if (left  < h2 && this.compare(heap[left].key, heap[small].key))
                    {
                        small = left;
                    }
                    if (right < h2 && this.compare(heap[right].key, heap[small].key))
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
                while (parent !== i && this.compare(heap[i].key, heap[parent].key))
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
        heap.pop();
    }

    // Insert element into heap
    private insertNode(node): void
    {
        var heap = this.heap;
        var i = heap.length;
        heap.push(node);
        if (i !== 0)
        {
            var parent = (i - 1) >>> 1;
            while (parent !== i && this.compare(heap[i].key, heap[parent].key))
            {
                this.swap(i, parent);
                i = parent;
                if (parent === 0)
                {
                    break;
                }
                parent = (parent - 1) >>> 1;
            }
        }
    }

    // Find element id based on value
    private findNode(data: T): number
    {
        var i = 0;
        var heap = this.heap;
        var count = heap.length;
        while (i < count)
        {
            if (heap[i].data === data)
            {
                break;
            }
            i += 1;
        }
        return i;
    }

    // remove data from heap, returns true if removed.
    remove(data: T): boolean
    {
        var ind = this.findNode(data);
        if (ind === this.heap.length)
        {
            return false;
        }
        this.removeNode(ind);
        return true;
    }

    insert(data: T, key: K): void
    {
        this.insertNode({
            data: data,
            key: key
        });
    }

    headData(): T
    {
        return (this.heap.length === 0 ? null : this.heap[0].data);
    }
    headKey(): K
    {
        return (this.heap.length === 0 ? null : this.heap[0].key);
    }

    pop(): T
    {
        if (this.heap.length === 0)
        {
            return null;
        }
        var ret = this.heap[0].data;
        this.removeNode(0);
        return ret;
    }
}

//
// TimeoutQueue
//
// Interface ontop of MinHeap to implement a 'TimeoutQueue'
// a type allowing an efficient way of implementing a large number
// of setTimeout behaviours.
//
class TimeoutQueue<T>
{
    private heap: MinHeap<number, T>;
    // Time since queue was created
    private time: number;

    constructor()
    {
        this.heap = new MinHeap(function (x, y) { return x < y; });
        this.time = 0.0;
    }

    clear(): void
    {
        this.heap.clear();
        this.time = 0.0;
    }

    remove(data: T): boolean
    {
        return this.heap.remove(data);
    }

    insert(data: T, timeout: number): void
    {
        this.heap.insert(data, this.time + timeout);
    }

    update(deltaTime: number): void
    {
        this.time += deltaTime;
    }

    hasNext(): boolean
    {
        var key = this.heap.headKey();
        return (key !== null) && key <= this.time;
    }

    next(): T
    {
        return this.heap.pop();
    }

    iter(lambda: (data: T) => void): void
    {
        while (this.hasNext())
        {
            lambda(this.next());
        }
    }
}

//
// ParticleQueue (private type)
//
// Represents the available particles in a system efficiently using a min-binary heap
// whose key is the absolute time at which a particle will die.
//
// Uses a specialised version of TimeoutQueue/Minheap with compressed storage for better performance
// in this specific use case.
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

