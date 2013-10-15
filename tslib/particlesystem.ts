// Copyright (c) 2013 Turbulenz Limited

/*global Float32Array: false*/
/*global Uint8Array: false*/
/*global Uint16Array: false*/
/*global Uint32Array: false*/
/*global VMath: false*/
/*global GraphicsDevice: false*/
/*global ShaderManager: false*/
/*global Technique: false*/
/*global TechniqueParameters: false*
/*global Geometry: false*/
/*global Material: false*/
/*global Surface: false*/
/*global SceneNode: false*/
/*global DrawParameters: false*/

"use strict";

// Array<number> | Float32Array
interface FloatArray
{
    [index: number]: number;
    length: number;
}

//
// TextureEncode
//
// Used to encode/decode floats/vectors into pivel values for texture storage.
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
        return this.encodeByteUnsignedFloat((f + 1.0) * 0.5);
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
    static encodeUnsignedFloat2xy(x: number, y: number): number
    {
        x = TextureEncode.encodeHalfUnsignedFloat(x);
        y = TextureEncode.encodeHalfUnsignedFloat(y);
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
    // data === null <=> child !== null                        (only leaves have data)
    // child !== null => child.length = 2 and they're non-null (every non-leaf has exactly 2 children)
    // height = 1 + max(childs height's)                       (height is valid)
    // (w,h) >= childs (w,h) (considered seperately)           (nodes encompass their children)
    // (w,h) is minimal                                        (nodes are as small as possible to encompass children)
    // abs(child1.height - child2.height) in {-1,0,1}          (tree is balanced)
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
                // cost hueristic defined by sum of node dimensions.
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
            var grandchild0 = rotate.child[0];
            var grandchild1 = rotate.child[1];

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
            if (grandchild0.height > grandchild1.height)
            {
                pivot = grandchild0;
                swing = grandchild1;
            }
            else
            {
                pivot = grandchild1;
                swing = grandchild0;
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
    stack: Array<SizeTreeNode<T>>;
    traverse(lambda: (node: SizeTreeNode<T>) => boolean): void
    {
        this.stack = this.stack || [];
        var stack = this.stack;
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
        this.stack = this.stack || [];
        var stack = this.stack;
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
                        while (stack.length !== 0)
                        {
                            stack.pop();
                        }
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
    // READONLY!!
    maxWidth: number;
    maxHeight: number;

    constructor(maxWidth: number, maxHeight: number)
    {
        this.free = new SizeTree<PackedRect>();
        this.bins = [];
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    releaseSpace(bin, x, y, w, h): void
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
        // Exact fit (terminate early)
        if (rect.w === w && rect.h === h)
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
            this.releaseSpace(rect.bin, rect.x, rect.y + h, rect.w, rect.h - h);
            this.releaseSpace(rect.bin, rect.x + w, rect.y, rect.w - w, h);
        }
        else
        {
            this.releaseSpace(rect.bin, rect.x, rect.y + h, w, rect.h - h);
            this.releaseSpace(rect.bin, rect.x + w, rect.y, rect.w - w, rect.h);
        }
        return {
            x: rect.x,
            y: rect.y,
            w: w,
            h: h,
            bin: rect.bin
        };
    }

    private static nearPow2Geq(x)
    {
        return (1 << Math.ceil(Math.log(x) / Math.log(2)));
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
        // But avoid going over a power of 2 boundary if we can avoid it.
        var wExpand = OnlineTexturePacker.nearPow2Geq(rect.w) !== OnlineTexturePacker.nearPow2Geq(rect.w + w);
        var hExpand = OnlineTexturePacker.nearPow2Geq(rect.h) !== OnlineTexturePacker.nearPow2Geq(rect.h + h);
        var shouldGrowRight = (wExpand === hExpand) ? (Math.abs(rect.h - h) > Math.abs(rect.w - w)) : (!wExpand);

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
            this.releaseSpace(rect.bin, rect.x + rect.w, rect.y + h, w, rect.h - h);
        }
        else
        {
            this.releaseSpace(rect.bin, rect.x, rect.y + rect.h, rect.w, h - rect.h);
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
            this.releaseSpace(rect.bin, rect.x + w, rect.y + rect.h, rect.w - w, h);
        }
        else
        {
            this.releaseSpace(rect.bin, rect.x + rect.w, rect.y, w - rect.w, rect.h);
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
    static pool: Array<{key: any; data: any }> = [];
    private heap: Array<{ key: K; data: T; }>;
    private compare: (key1: K, key2: K) => boolean;

    private swap(i1, i2)
    {
        var heap = this.heap;
        var h1 = heap[i1];
        var h2 = heap[i2];
        var tmp: any;
        tmp = h1.key;
        h1.key = h2.key;
        h2.key = tmp;
        tmp = h1.data;
        h1.data = h2.data;
        h2.data = tmp;
    }

    constructor(compare: (key1: K, key2: K) => boolean)
    {
        this.compare = compare;
        this.heap = [];
    }

    clear(cb?: (T) => void): void
    {
        var heap = this.heap;
        var count = heap.length;
        while (count > 0)
        {
            count -= 1;
            var elt = heap.pop();
            if (cb)
            {
                cb(elt.data);
            }
            elt.key = null;
            elt.data = null;
            MinHeap.pool.push(elt);
        }
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
            this.swap(i, h2);
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
                    parent = (parent - 1) >>> 1;
                }
            }
        }
        var elt = heap.pop();
        elt.key = null;
        elt.data = null;
        MinHeap.pool.push(elt);
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
        var heap = this.heap;
        var i = heap.length;
        var pool = MinHeap.pool;
        if (pool.length > 0)
        {
            var elt = pool.pop();
            elt.data = data;
            elt.key = key;
            heap.push(elt);
        }
        else
        {
            heap.push({
                data: data,
                key: key
            });
        }
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
    time: number;

    static compare(x, y)
    {
        return x < y;
    }
    constructor()
    {
        this.heap = new MinHeap(TimeoutQueue.compare);
        this.time = 0.0;
    }

    clear(cb?: (T) => void): void
    {
        this.heap.clear(cb);
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
        if ((forceCreation && isFinite(this.heap[0])) || (this.heap[0] <= this.time))
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

//
// ParticleBuilder and helpers
// ---------------------------
//
// Used to transform animation descriptions into texture data for particle system.
// Also performs texture packing on gpu for particle textures.
//

//
// Interface for result of build step encoding system and particle animation information.
// These interfaces are returned to the user.
//
interface ParticleSystemAnimation
{
    maxLifeTime: number;
    animation  : Texture;
    particle   : Array<ParticleDefn>;
    attribute  : { [name: string]: AttributeRange };
}
interface AttributeRange
{
    min  : Array<number>;
    delta: Array<number>;
}
interface ParticleDefn
{
    lifeTime      : number;
    animationRange: Array<number>;
}

//
// Interface for intermediate parse result of a system defined attribute.
// (Internal to ParticleBuilder)
//
enum AttributeCompress
{
    cNone,
    cHalf,
    cFull
}
enum AttributeStorage
{
    sDirect,
    sNormalized
}
interface Attribute
{
    name               : string;
    // tFloat, tFloat2, tFloat4 or tTexture(n) as number
    // TypeScript has no algebraic data types to represent this 'nicely'.
    type               : any;
    defaultValue       : Array<number>;
    defaultInterpolator: Interpolator;
    minValue           : Array<number>;
    maxValue           : Array<number>;
    compress           : AttributeCompress;
    storage            : AttributeStorage;
}

//
// Interface for intermediate parse result of a particle defined animation.
// (Internal to ParticleBuilder)
//
interface Particle
{
    name        : string;
    fps         : number;
    animation   : Array<Snapshot>;
    textureUVs  : { [name: string]: Array<Array<number>> };
    textureSizes: { [name: string]: Array<number> };
}
interface Snapshot
{
    time         : number;
    attributes   : { [name: string]: Array<number> };
    interpolators: { [name: string]: Interpolator };
}

//
// Interface for defined interpolators supported by build step.
// (Internal to ParticleBuilder)
//
interface InterpolatorFun
{
    (vs: Array<Array<number>>, ts: Array<number>, t: number): Array<number>;
}
interface Interpolator
{
    fun    : InterpolatorFun;
    offsets: Array<number>;
    type   : string;
}

//
// Collects errors accumulated during parse/analysis of the input objects.
// (private helper of ParticleBuilder)
//
// TODO, make private to this module somehow?
class BuildError
{
    // print strings surrounded by "" to avoid confusing "10" with 10
    static wrap(x: any): string
    {
        if (Types.isString(x))
        {
            return '"' + x + '"';
        }
        else
        {
            return "" + x;
        }
    }

    private uncheckedErrorCount: number;
    private uncheckedWarningCount: number;
    private log: Array<{ error: boolean; log: string; }>;

    empty(includeWarnings: boolean): boolean
    {
        if (includeWarnings)
        {
            return this.log.length === 0;
        }
        else
        {
            var log = this.log;
            var count = log.length;
            var i;
            for (i = 0; i < count; i += 1)
            {
                if (log[i].error)
                {
                    return false;
                }
            }
            return true;
        }
    }

    error(x: string): void
    {
        this.uncheckedErrorCount += 1;
        this.log.push({ error: true, log: BuildError.ERROR + "::" + x });
    }
    warning(x: string): void
    {
        this.uncheckedWarningCount += 1;
        this.log.push({ error: false, log: BuildError.WARNING + "::" + x });
    }

    private static ERROR = "ERROR";
    private static WARNING = "WARNING";

    checkErrorState(msg?: string): boolean
    {
        if (this.uncheckedWarningCount !== 0)
        {
            this.log.push({ error: false, log: "Warnings (" + this.uncheckedWarningCount + ")" });
            this.uncheckedWarningCount = 0;
        }
        if (this.uncheckedErrorCount !== 0)
        {
            this.log.push({ error: true, log: "Errors (" + this.uncheckedErrorCount + ")" });
            if (msg)
            {
                this.log.push({ error: true, log: msg });
            }
            this.uncheckedErrorCount = 0;
            return true;
        }
        else
        {
            return false;
        }
    }

    fail(msg: string): string
    {
        var log = this.log;
        if (!this.checkErrorState(msg))
        {
            log.push({ error: true, log: msg });
        }

        var count = log.length;
        var i;

        // compile log
        var ret = "";
        for (i = 0; i < count; i += 1)
        {
            if (i !== 0)
            {
                ret += "\n";
            }
            ret += log[i].log;
        }

        this.log = [];
        return ret;
    }

    constructor()
    {
        this.log = [];
        this.uncheckedErrorCount = 0;
        this.uncheckedWarningCount = 0;
    }
}

//
// Type checking and utilities.
//
class Types {
    static arrayTypes = [
        "[object Float64Array]",
        "[object Float32Array]",
        "[object Int32Array]",
        "[object Int16Array]",
        "[object Int8Array]",
        "[object Uint32Array]",
        "[object Uint16Array]",
        "[object Uint8Array]"
    ];
    static isTypedArray(x: any): boolean
    {
        return Types.arrayTypes.indexOf(Object.prototype.toString.call(x)) !== -1;
    }
    static isArray(x: any): boolean
    {
        return Types.isTypedArray(x) || Object.prototype.toString.call(x) === "[object Array]";
    }
    static isFunction(x: any): boolean
    {
        return Object.prototype.toString.call(x) === "[object Function]";
    }
    static isNumber(x: any): boolean
    {
        return Object.prototype.toString.call(x) === "[object Number]";
    }
    static isString(x: any): boolean
    {
        return Object.prototype.toString.call(x) === "[object String]";
    }
    static isBoolean(x: any): boolean
    {
        return Object.prototype.toString.call(x) === "[object Boolean]";
    }
    static isObject(x: any): boolean
    {
        return Object.prototype.toString.call(x) === "[object Object]";
    }
    static isNullUndefined(x: any): boolean
    {
        // x == null also works.
        return x === null || x === undefined;
    }

    // Deep copy an arbitrary JSON compatible value from 'from' into 'to', returning 'to'
    // to is permitted to be left undefined, otherwise fields are appended/pushed into
    // to
    //
    // setting json to false, means object types will not be deep-copied to avoid
    // trying to do things like deep-copying Texture's when not copying JSON objects.
    static copy(from: any, to?: any, json = true)
    {
        if (Types.isTypedArray(from) && !to)
        {
            return from.subarray(0, from.length);
        }
        else if (Types.isArray(from))
        {
            return Types.copyElements(from, to, json);
        }
        else if (Types.isObject(from))
        {
            return json ? Types.copyFields(from, to) : from;
        }
        else
        {
            return from;
        }
    }

    // As with copyFields, but for Arrays
    static copyElements(from: Array<any>, to: Array<any>, json = true)
    {
        if (!from) return;
        if (!to) to = [];
        var i;
        var count = from.length;
        for (i = 0; i < count; i += 1)
        {
            to[i] = Types.copy(from[i], to[i], json);
        }
        return to;
    }

    // Copy fields of from object, onto the to object.
    // Result is an object with all the fields of to,
    // and with all the fields of from with values copied from from.
    // in a deep-copy.
    static copyFields(from: { [name: string]: any }, to: { [name: string]: any }, json = true)
    {
        if (!from) return to;
        if (!to) to = {};
        for (var f in from) {
            if (from.hasOwnProperty(f))
            {
                to[f] = Types.copy(from[f], to[f], json);
            }
        }
        return to;
    }
}

//
// Parser (private helper of ParticleBuilder)
//
class Parser {
    private static interpolators: { [name: string]: (params: any) => Interpolator } = {
        "none": function (_): Interpolator
        {
            return {
                type: "none",
                offsets: [-1],
                fun: function (vs, _1, _2)
                {
                    return vs[0];
                }
            };
        },
        "linear": function (_): Interpolator
        {
            return {
                type: "linear",
                offsets: [-1, 1],
                fun: function (vs, _, t)
                {
                    if (!vs[1])
                    {
                        return vs[0];
                    }
                    else
                    {
                        var ret = [];
                        var count = vs[0].length;
                        var i;
                        for (i = 0; i < count; i += 1)
                        {
                            ret[i] = (vs[0][i] * (1 - t)) + (vs[1][i] * t);
                        }
                        return ret;
                    }
                }
            };
        },
        "cardinal": function (def: { tension: number; }): Interpolator
        {
            return {
                type: "cardinal",
                offsets: [-2, -1, 1, 2],
                fun: function (vs, ts, t)
                {
                    var n = vs[1].length;
                    // Zero gradients at start/end points of animation
                    // only offset -1 is guaranteed.
                    // we want to gracefully degenerate in even worse situations.
                    var v1 = vs[1];
                    var t1 = ts[1];
                    var v0 = vs[0] || v1;
                    var t0 = ts[0] || t1;
                    var v2 = vs[2] || v1;
                    var t2 = ts[2] || t1;
                    var v3 = vs[3] || v2;
                    var t3 = ts[3] || t2;

                    // Hermite weights
                    var tsqrd = t * t;
                    var tcube = tsqrd * t;
                    var wv1 = 2 * tcube - 3 * tsqrd + 1;
                    var wv2 = - 2 * tcube + 3 * tsqrd;
                    var wm1 = tcube - 2 * tsqrd + t;
                    var wm2 = tcube - tsqrd;

                    var ret = [];
                    var i;
                    for (i = 0; i < n; i += 1)
                    {
                        var m1 = (1 - def.tension) * (v2[i] - v0[i]) / (t2 - t0);
                        var m2 = (1 - def.tension) * (v3[i] - v1[i]) / (t3 - t1);
                        if (isNaN(m1))
                        {
                            // occurs when (after degeneralisation), v2=v0 & t2=t0
                            m1 = 0;
                        }
                        if (isNaN(m2))
                        {
                            // occurs when (after degeneralisation), v3=v1 & t3=t1
                            m2 = 0;
                        }
                        ret[i] = (v1[i] * wv1) + (m1 * wm1) + (m2 * wm2) + (v2[i] * wv2);
                    }
                    return ret;
                }
            };
        },
        "catmull": function (_): Interpolator
        {
            var ret = Parser.interpolators["cardinal"]({ tension: 0.0 });
            ret.type = "catmull";
            return ret;
        }
    };

    // Check for any extra fields that should not be present
    static extraFields(error: BuildError, obj: string, x: Object, excludes: Array<string>): void
    {
        for (var f in x)
        {
            if (x.hasOwnProperty(f) && excludes.indexOf(f) === -1)
            {
                error.warning(obj + " has extra field '" + f + "'");
            }
        }
    }

    // Return object field if it exists, otherwise error and return null
    static field(error: BuildError, obj: string, x: Object, n: string): any
    {
        if (!x.hasOwnProperty(n))
        {
            error.error("No field '" + n + "' found on " + obj);
            return null;
        }
        else
        {
            return x[n];
        }
    }

    // Return object field as a string, if it does not exist (or not a string), error.
    static stringField(error: BuildError, obj: string, x: Object, n: string): string
    {
        var ret: any = Parser.field(error, obj, x, n);
        if (x.hasOwnProperty(n) && !Types.isString(ret))
        {
            error.error("Field '" + n + "' of " + obj + " is not a string (" + BuildError.wrap(ret) + ")");
            return null;
        }
        else
        {
            return (<string>ret);
        }
    }

    // Return object field as a number, if it does not exist (or not a number), error.
    static numberField(error: BuildError, obj: string, x: Object, n: string): number
    {
        var ret: any = Parser.field(error, obj, x, n);
        if (x.hasOwnProperty(n) && !Types.isNumber(ret))
        {
            error.error("Field '" + n + "' of " + obj + " is not a number (" + BuildError.wrap(ret) + ")");
            return null;
        }
        else if (!isFinite(ret))
        {
            error.error("Field '" + n + "' of " + obj + " is nan or infinite (" + BuildError.wrap(ret) + ")");
            return null;
        }
        else
        {
            return (<number>ret);
        }
    }

    // Check value is a number, and error otherwise.
    static checkNumber(error: BuildError, obj: string, n: string, ret: any): number
    {
        if (!Types.isNumber(ret))
        {
            error.error(n + " of " + obj + " is not a number (" + BuildError.wrap(ret) + ")");
            return null;
        }
        else if (!isFinite(ret))
        {
            error.error(n + " of " + obj + " is nan or infinite (" + BuildError.wrap(ret) + ")");
            return null;
        }
        else
        {
            return (<number>ret);
        }
    }
    static checkNullNumber(error: BuildError, obj: string, n: string, ret: any): number
    {
        if (Types.isNullUndefined(ret))
        {
            return null;
        }
        return Parser.checkNumber(error, obj, n, ret);
    }

    // Map object field via run function if it exists, otherwise return default result.
    static maybeField<R>(x: Object, n: string, run: (field: any) => R, def: () => R): R
    {
        return (x.hasOwnProperty(n)) ? run(x[n]) : def();
    }

    // [null, 1, 2] (dim 3) => VMath.v3Build(0, 1, 2)
    // [1, 2] (dim 3) => error
    // ["h", 2] (dim 2) => error
    static checkVector(error, obj: string, n: string, dim: number, field: any): FloatArray
    {
        if (!Types.isArray(field) || field.length !== dim)
        {
            error.error("Field '" + n + "' of " + obj + " should be a Vector" + dim + " object");
            return null;
        }
        var ret = new Float32Array(dim);
        var i;
        for (i = 0; i < dim; i += 1)
        {
            ret[i] = Parser.checkNullNumber(error, obj, "element " + i, field[i]) || 0;
        }
        return ret;
    }

    static checkBoolean(error, obj: string, n: string, field: any): boolean
    {
        if (!Types.isBoolean(field))
        {
            error.error("Field '" + n + "' of " + obj + " should be a boolean");
            return null;
        }
        return <boolean>field;
    }

    static checkString(error, obj: string, n: string, field: any): string
    {
        if (!Types.isString(field))
        {
            error.error("Field '" + n + "' of " + obj + " should be a string");
            return null;
        }
        return <string>field;
    }

    // Check attribute value agaisnt type, and error if not compatible.
    // If acceptNull is true, then attribute (sub) values are permitted to be null.
    static typeAttr(error: BuildError, obj: string, type: any, acceptNull: boolean, val: any): Array<number>
    {
        if (type === null)
        {
            // Cannot perform type check.
            return <Array<number>>null;
        }

        var isNumber = function(val: any): boolean
        {
            return (val === null && acceptNull) || Types.isNumber(val);
        };
        var checkArray = function (val: any, n: number): Array<number>
        {
            if (!Types.isArray(val))
            {
                error.error("Value '" + BuildError.wrap(val) + "' should be a float" + n + " for " + obj);
                return null;
            }

            var arr = <Array<number>>val;
            var count = arr.length;
            if (count !== n)
            {
                error.error("Value '" + BuildError.wrap(val) + "' should have " + n + " elements for float " + n + obj);
                val = null;
            }

            var i;
            for (i = 0; i < count; i += 1)
            {
                if (!isNumber(arr[i]))
                {
                    error.error("Element " + i + " of value '" + BuildError.wrap(val) +
                        "' should be a number (" + BuildError.wrap(arr[i]) + ") for " + obj);
                    val = null;
                }
            }
            return <Array<number>>val;
        };
        switch (type)
        {
            case "tFloat2":
                return checkArray(val, 2);
            case "tFloat4":
                return checkArray(val, 4);
            case "tFloat":
            default: // tTexture(n)
                if (!isNumber(val))
                {
                    error.error("Value '" + BuildError.wrap(val) + "' should be a number for " + obj);
                    return null;
                }
                return [<number>val];
        }
    }

    // return default attribute value for a type.
    static defaultAttr(type: any, val: number = null): Array<number>
    {
        if (type === null)
        {
            // Can't type check.
            return null;
        }

        switch (type)
        {
            case "tFloat2":
                return [val, val];
            case "tFloat4":
                return [val, val, val, val];
            case "tFloat":
            default: // tTexture(n)
                return [val];
        }
    }

    // Parse a system definition object.
    static parseSystem(error: BuildError, defn: any): Array<Attribute>
    {
        var attrs:Array<Attribute>;
        if (!Types.isArray(defn))
        {
            error.error("System definition must be an array of attribute defintions");
            attrs = null;
        }
        else
        {
            attrs = [];
            var defnArray = <Array<any>>(defn);
            var count = defnArray.length;
            var i;
            for (i = 0; i < count; i += 1)
            {
                attrs[i] = Parser.parseSystemAttribute(error, defnArray[i]);
            }

            // Check for duplicates
            for (i = 0; i < count; i += 1)
            {
                var j;
                for (j = (i + 1); j < count; j += 1)
                {
                    if (attrs[i].name === attrs[j].name)
                    {
                        error.error("System definition has conflicting attribute declarations for '" +
                            attrs[i].name + "'");
                    }
                }
            }
        }

        if (error.checkErrorState("System parse failed!"))
        {
            return null;
        }
        else
        {
            return attrs;
        }
    }

    static hasTextureIndex(system, index): boolean
    {
        var count = system.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var sysAttr = system[i];
            switch (sysAttr.type)
            {
                case "tFloat": case "tFloat2": case "tFloat4": break;
                default: // tTexture(n)
                    if (index === sysAttr.type)
                    {
                        return true;
                    }
            }
        }
        return false;
    }

    // Parse a system attribute definition.
    static parseSystemAttribute(error: BuildError, defn: any): Attribute
    {
        var name = Parser.stringField(error, "system attribute", defn, "name");
        if (name !== null && name.length > 14 && name.substr(name.length - 14) === "-interpolation")
        {
            error.error("System attribute cannot have '-interpolation' as a suffix (" + name + ")");
            name = null;
        }
        var printName  = (name === null) ? "" : " '"+name+"'";
        var printNames = (name === null) ? "'s" : " '"+name+"'s";

        var stringField = Parser.stringField.bind(null, error, "system attribute" + printName);
        var parseInterpolator =
            Parser.parseInterpolator.bind(null, error, "system attribute" + printNames +
                                                       " default-interpolation field");

        var typeName = stringField(defn, "type");
        var type = null;
        if (typeName !== null)
        {
            switch (typeName) {
                case "float":
                    type = "tFloat";
                    break;
                case "float2":
                    type = "tFloat2";
                    break;
                case "float4":
                    type = "tFloat4";
                    break;
                default:
                    if (typeName.substr(0, 7) === "texture")
                    {
                        type = parseFloat(typeName.substr(7));
                    }
                    else
                    {
                        error.error("Unknown attribute type '" + typeName + "' for system attribute" + printName);
                    }
            }
        }
        var typeAttr = function (n)
            {
                return Parser.typeAttr.bind(null, error, "system attribute" + printNames + " " + n + " field", type);
            };

        var defaultValue = Parser.maybeField(defn, "default", typeAttr("default").bind(null, false),
                                     Parser.defaultAttr.bind(null, type, 0));
        var defaultInterpolator = Parser.maybeField(defn, "default-interpolation", parseInterpolator,
                                     Parser.interpolators["linear"].bind(null));

        var parseMinMax = function (n)
            {
                // Can't type check for null type.
                if (type === null)
                {
                    return null;
                }

                switch (type)
                {
                    case "tFloat":
                    case "tFloat2":
                    case "tFloat4":
                        return Parser.maybeField(defn, n, typeAttr(n).bind(null, true),
                                                 Parser.defaultAttr.bind(null, type, null));
                    default:
                        if (defn.hasOwnProperty(n))
                        {
                            error.error(n + " is not accepted for system texture attribute" + printName);
                            return null;
                        }
                }
            };
        var minValue = parseMinMax("min");
        var maxValue = parseMinMax("max");

        var compress = Parser.maybeField(defn, "compress",
            function (val)
            {
                switch (val)
                {
                    case "none":
                        return AttributeCompress.cNone;
                    case "half":
                        return AttributeCompress.cHalf;
                    case "full":
                        return AttributeCompress.cFull;
                    default:
                        error.error("Unknown compression type '" + val + "' for system attribute " + printName);
                        return null;
                }
            },
            function ()
            {
                return AttributeCompress.cFull;
            });

        // can't check for null type
        var storage = null;
        if (type !== null)
        {
            switch (type)
            {
                case "tFloat":
                case "tFloat2":
                case "tFloat4":
                    storage = Parser.maybeField(defn, "storage",
                        function (val)
                        {
                            switch (val)
                            {
                                case "direct":
                                    return AttributeStorage.sDirect;
                                case "normalized":
                                    return AttributeStorage.sNormalized;
                                default:
                                    error.error("Unknown storage type '" + val + "' for system attribute " + printName);
                                    return null;
                            }
                        },
                        function ()
                        {
                            return AttributeStorage.sNormalized;
                        });
                    break;
                default: // tTexture(n)
                    if (defn.hasOwnProperty("storage"))
                    {
                        error.error("Storage type is not accepted for system texture attribute" + printName);
                    }
            }
        }

        Parser.extraFields(error, "system attribute" + printName, defn,
            ["name", "type", "default", "default-interpolation", "min", "max", "storage", "compress"]);

        return {
            name               : name,
            type               : type,
            defaultValue       : defaultValue,
            defaultInterpolator: defaultInterpolator,
            minValue           : minValue,
            maxValue           : maxValue,
            compress           : compress,
            storage            : storage
        };
    }

    // Parse attribute interpolator definition
    static parseInterpolator(error: BuildError, obj: string, defn: any): Interpolator
    {
        if (Types.isString(defn))
        {
            var defnString = <string>defn;
            switch (defnString)
            {
                case "none":
                    return Parser.interpolators["none"](null);
                case "linear":
                    return Parser.interpolators["linear"](null);
                case "catmull":
                    return Parser.interpolators["catmull"](null);
                default:
                    error.error("Unknown interpolator type '" + defnString + "' for " + obj);
                    return null;
            }
        }
        else if (defn === null)
        {
            error.error("Interpolator cannot be null for " + obj);
            return null;
        }
        else if (Types.isObject(defn))
        {
            var defnObj = <Object>(defn);
            var type = Parser.stringField(error, obj, defnObj, "type");
            if (type === null)
            {
                error.error("complex interpolator type cannot be null for " + obj);
                return null;
            }
            switch (type)
            {
                case "none":
                    Parser.extraFields(error, obj, defnObj, ["type"]);
                    return Parser.interpolators["none"](null);
                case "linear":
                    Parser.extraFields(error, obj, defnObj, ["type"]);
                    return Parser.interpolators["linear"](null);
                case "catmull":
                    Parser.extraFields(error, obj, defnObj, ["type"]);
                    return Parser.interpolators["catmull"](null);
                case "cardinal":
                    Parser.extraFields(error, obj, defnObj, ["type", "tension"]);
                    var tension = Parser.numberField(error, obj, defnObj, "tension");
                    return Parser.interpolators["cardinal"]({ tension: tension });
                default:
                    error.error("Unknown complex interpolator type '" + type + "' for " + obj);
                    return null;
            }
        }
        else
        {
            error.error("Invalid interpolator for " + obj +
                        ". Should be an interpolator name, or complex interpolator definition, not " +
                        BuildError.wrap(defn));
            return null;
        }
    }

    // avoid creating in loops.
    private static zero(): number
    {
        return 0;
    }
    static parseParticle(error: BuildError, defn: any): Particle
    {
        if (defn === null)
        {
            error.error("particle definition cannot be null");
            error.checkErrorState("Particle parse failed!");
            return null;
        }

        var name = Parser.stringField(error, "particle", defn, "name");
        var printName  = (name === null) ? "" : " '"+name+"'";
        var printNames = (name === null) ? "'s" : " '"+name+"'s";

        var stringField = Parser.stringField.bind(null, error, "particle" + printName);
        var numberField = Parser.numberField.bind(null, error, "particle" + printName);

        var fps =
            Parser.maybeField(defn, "fps",
                              Parser.checkNumber.bind(null, error, "particle" + printName, "fps"),
                              function () { return 30; });
        if (fps !== null && fps <= 0.0)
        {
            error.error("particle" + printNames + " fps (" + fps + ") must be > 0");
            fps = null;
        }

        var textures = [];
        for (var f in defn)
        {
            if (!defn.hasOwnProperty(f))
            {
                continue;
            }

            if (f.substr(0, 7) === "texture")
            {
                if (f.substr(f.length - 5) === "-size")
                {
                    textures.push(f.substr(0, f.length - 5));
                }
                else
                {
                    textures.push(f);
                }
            }
        }
        var textureUVs = {};
        var textureSizes = {};
        var count = textures.length;
        var i, j;
        for (i = 0; i < count; i += 1)
        {
            var tex = textures[i];
            if (defn.hasOwnProperty(tex) && !Types.isArray(defn[tex]))
            {
                error.error("particle" + printNames + " " + f + " should be an Array");
            }
            else if (defn.hasOwnProperty(tex))
            {
                var uvs = <Array<any>>defn[tex];
                var fcount = uvs.length;
                var outUVs = [];
                for (j = 0; j < fcount; j += 1)
                {
                    outUVs.push(Parser.typeAttr(error, "element of particle" + printNames + " " + f,
                                                "tFloat4", false, uvs[j]));
                }
                textureUVs[tex] = outUVs.concat();
            }
            if (defn.hasOwnProperty(tex + "-size"))
            {
                textureSizes[tex] = Parser.typeAttr(error, "particle" + printNames + " " + f + "-size",
                                                "tFloat2", false, defn[tex + "-size"]);
            }
        }

        var animation = Parser.field(error, "particle" + printName, defn, "animation");
        if (defn.hasOwnProperty("animation") && !Types.isArray(animation))
        {
            error.error("particle" + printNames + " animation must be an array");
            animation = null;
        }
        var animationOut = null;
        if (animation !== null)
        {
            var animationArr = <Array<any>>animation;
            if (animationArr.length === 0)
            {
                error.error("particle" + printNames + " animation is empty");
                animationOut = null;
            }
            else
            {
                animationOut = [];
                count = animationArr.length;
                for (i = 0; i < count; i += 1)
                {
                    var snap = animationArr[i];
                    var obj = "particle" + printNames + " animation snapshot";
                    if (!Types.isObject(snap))
                    {
                        error.error(obj + " should be an object");
                        animationOut[i] = null;
                        continue;
                    }

                    var snapObj = <Object>snap;
                    var time;
                    if (i === 0)
                    {
                        time = Parser.maybeField(snapObj, "time",
                                                 Parser.checkNumber.bind(null, error, obj, "time"),
                                                 Parser.zero);
                        if (time !== 0)
                        {
                            error.error("first " + obj + " time must be 0");
                            time = null;
                        }
                    }
                    else
                    {
                        time = Parser.numberField(error, obj, snapObj, "time");
                        if (time !== null && time <= 0)
                        {
                            error.error(obj + " time must be positive");
                            time = null;
                        }
                    }

                    var attributes = {};
                    var interpolators = {};
                    for (var f in snapObj)
                    {
                        if (!snapObj.hasOwnProperty(f) || f === "time")
                        {
                            continue;
                        }
                        if (f.length > 14 && f.substr(f.length - 14) === "-interpolation")
                        {
                            var attr = f.substr(0, f.length - 14);
                            interpolators[attr] =
                                Parser.parseInterpolator(error, obj + " attribute '" + attr + "'", snapObj[f]);
                        }
                        else
                        {
                            attributes[f] =
                                Parser.parseAttributeValue(error, obj + " attribute '" + f + "'", snapObj[f]);
                        }
                    }

                    animationOut[i] = {
                        time         : time,
                        attributes   : attributes,
                        interpolators: interpolators
                    };
                }
            }
        }

        var sizes = [];
        count = textures.length;
        for (i = 0; i < count; i += 1)
        {
            sizes.push(textures[i] + "-size");
        }
        Parser.extraFields(error, "particle" + printName, defn,
                           textures.concat(sizes).concat(["name", "fps", "animation"]));

        if (error.checkErrorState("Particle" + printName + " parse failed!"))
        {
            return null;
        }
        else
        {
            return {
                name        : name,
                fps         : fps,
                animation   : animationOut,
                textureUVs  : textureUVs,
                textureSizes: textureSizes
            };
        }
    }

    static parseAttributeValue(error: BuildError, obj: string, def: any): Array<number>
    {
        if (def === null)
        {
            error.error(obj + " cannot be null");
            return null;
        }

        if (Types.isNumber(def))
        {
            return [<number>def];
        }

        if (Types.isArray(def))
        {
            // At this point, can assume we have tFloat2 or tFloat4 only as no
            // interpolator uses an array definition.
            var defArr = <Array<any>>def;
            var count = defArr.length;
            var i;
            for (i = 0; i < count; i += 1)
            {
                var val = defArr[i];
                if (!Types.isNumber(val))
                {
                    error.error("Element of " + obj + " has none number value (" + val + ")");
                    return null;
                }

            }
            if (defArr.length !== 2 && defArr.length !== 4)
            {
                error.error(obj + " should have either 2 or 4 elements for float2/float4 value");
                return null;
            }
            return defArr;
        }

        error.error(obj + " has unrecognised value type");
        return null;
    }
}

//
// ParticleBuilder
//
class ParticleBuilder
{
    private static buildAnimationTexture(
        graphicsDevice: GraphicsDevice,
        width         : number,
        height        : number,
        data          : Uint8Array
    ): Texture
    {
        return graphicsDevice.createTexture({
            name      : "ParticleBuilder AnimationTexture",
            width     : width,
            height    : height,
            depth     : 1,
            format    : graphicsDevice.PIXELFORMAT_R8G8B8A8,
            mipmaps   : false,
            cubemap   : false,
            renderable: false,
            dynamic   : false,
            data      : data
        });
    }

    private static nearPow2Geq(x)
    {
        return (1 << Math.ceil(Math.log(x) / Math.log(2)));
    }

    private static packedTextureVertices : VertexBuffer;
    private static packedTextureSemantics: Semantics;
    private static packedCopyParameters  : TechniqueParameters;
    private static packedCopyTechnique   : Technique;
    static packTextures(params: {
        graphicsDevice: GraphicsDevice;
        textures      : Array<Texture>;
        borderShrink? : number;
    }): { texture: Texture; uvMap : Array<Array<number>> }
    {
        var graphicsDevice = params.graphicsDevice;
        var textures = params.textures;
        var borderShrink = params.borderShrink;
        if (borderShrink === undefined)
        {
            borderShrink = 4;
        }
        // Init vertexBuffer/semantics/shader technique if required.
        var vertices, semantics, parameters, technique;
        if (!ParticleBuilder.packedTextureVertices)
        {
            vertices = ParticleBuilder.packedTextureVertices =
                graphicsDevice.createVertexBuffer({
                    numVertices: 4,
                    attributes : [graphicsDevice.VERTEXFORMAT_FLOAT2],
                    dynamic    : false,
                    data       : [0,0, 1,0, 0,1, 1,1]
                });
            semantics = ParticleBuilder.packedTextureSemantics =
                graphicsDevice.createSemantics([
                    graphicsDevice.SEMANTIC_POSITION
                ]);
            parameters = ParticleBuilder.packedCopyParameters =
                graphicsDevice.createTechniqueParameters({
                    dim: [0, 0],
                    dst: [0, 0, 0, 0]
                });

            // Shader embedded from assets/shaders/particles-packer.cgfx
            var shader = graphicsDevice.createShader({"version":1,"name":"particles-packer.cgfx","samplers":{"src":{"MinFilter":9728,"MagFilter":9728,"WrapS":33071,"WrapT":33071}},"parameters":{"src":{"type":"sampler2D"},"dim":{"type":"float","columns":2},"dst":{"type":"float","columns":4},"border":{"type":"float"}},"techniques":{"pack":[{"parameters":["dim","dst","border","src"],"semantics":["POSITION"],"states":{"DepthTestEnable":false,"DepthMask":false,"CullFaceEnable":false,"BlendEnable":false},"programs":["vp_pack","fp_pack"]}]},"programs":{"fp_pack":{"type":"fragment","code":"#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];\nvec4 _ret_0;uniform sampler2D src;void main()\n{_ret_0=texture2D(src,tz_TexCoord[0].xy);gl_FragColor=_ret_0;}"},"vp_pack":{"type":"vertex","code":"#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];attribute vec4 ATTR0;\nvec4 _outPosition1;vec2 _outUV1;uniform vec2 dim;uniform vec4 dst;uniform float border;void main()\n{vec2 _xy;vec2 _wh;vec2 _TMP4;_xy=dst.xy*2.0-1.0;_wh=(dst.zw*2.0-1.0)-_xy;_TMP4=_xy+_wh*ATTR0.xy;_outPosition1=vec4(_TMP4.x,_TMP4.y,0.0,1.0);_outUV1=ATTR0.xy+((ATTR0.xy*2.0-1.0)*border)/dim;tz_TexCoord[0].xy=_outUV1;gl_Position=_outPosition1;}"}}});
            technique = ParticleBuilder.packedCopyTechnique = shader.getTechnique("pack");
        }
        else
        {
            vertices   = ParticleBuilder.packedTextureVertices;
            semantics  = ParticleBuilder.packedTextureSemantics;
            parameters = ParticleBuilder.packedCopyParameters;
            technique  = ParticleBuilder.packedCopyTechnique;
        }

        // Determine the unique textures in those supplied
        // keeping track of input indices from unique index.
        var unique  = [];
        var count = textures.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var tex = textures[i];
            var index = unique.indexOf(tex);
            if (index !== -1)
            {
                unique[index].mapping.push(i);
            }
            else
            {
                unique.push({
                    texture: tex,
                    mapping: [i],
                    store: null
                });
            }
        }

        // Sort textures decreasing to improve packing quality.
        unique.sort(function (x, y)
            {
                return (y.texture.width + y.texture.height) - (x.texture.width + x.texture.height);
            });

        // Pack textures.
        var max = graphicsDevice.maxSupported("TEXTURE_SIZE");
        var packer = new OnlineTexturePacker(max, max);
        var ref;
        var refCount = unique.length;
        for (i = 0; i < refCount; i += 1)
        {
            ref = unique[i];
            ref.store = packer.pack(ref.texture.width, ref.texture.height);
            if (ref.store.bin !== 0)
            {
                throw "Packing textures would require more than the maximum size possible";
            }
        }

        graphicsDevice.setStream(vertices, semantics);
        graphicsDevice.setTechnique(technique);
        parameters["border"] = borderShrink;

        // Create texture required with size as the next >= powers of 2 for mip-mapping.
        var bin = packer.bins[0];
        var w = ParticleBuilder.nearPow2Geq(bin.w);
        var h = ParticleBuilder.nearPow2Geq(bin.h);

        var tex = graphicsDevice.createTexture({
            name      : "ParticleBuilder Packed-Texture",
            width     : w,
            height    : h,
            depth     : 1,
            format    : graphicsDevice.PIXELFORMAT_R8G8B8A8,
            mipmaps   : true,
            cubemap   : false,
            renderable: true,
            dynamic   : true
        });
        var target = graphicsDevice.createRenderTarget({
            colorTexture0: tex
        });
        graphicsDevice.beginRenderTarget(target);

        var j;
        var maps = [];
        for (j = 0; j < refCount; j += 1)
        {
            ref = unique[j];

            var mx = (ref.store.x / w);
            var my = (ref.store.y / h);
            var mw = (ref.store.w / w);
            var mh = (ref.store.h / h);
            var map = [
                mx + (borderShrink / w),
                my + (borderShrink / h),
                mx + mw - (borderShrink / w),
                my + mh - (borderShrink / h)
            ];
            var mapCount = ref.mapping.length;
            var k;
            for (k = 0; k < mapCount; k += 1)
            {
                maps[ref.mapping[k]] = map;
            }

            parameters["src"]    = ref.texture;
            parameters["dim"][0] = ref.texture.width;
            parameters["dim"][1] = ref.texture.height;
            parameters["dst"][0] = mx;
            parameters["dst"][1] = my;
            parameters["dst"][2] = mx + mw;
            parameters["dst"][3] = my + mh;
            graphicsDevice.setTechniqueParameters(parameters);
            graphicsDevice.draw(graphicsDevice.PRIMITIVE_TRIANGLE_STRIP, 4, 0);
        }

        graphicsDevice.endRenderTarget();
        target.destroy();

        return {
            texture: tex,
            uvMap  : maps
        };
    }

    // alreadyParsed is a private parameter to compile.
    //
    // When true, the input particles and systems are presumed to be pre-parsed.
    // and with particles attributes checked against the system. (relavent calls
    // made to parseSystem, parseParticle and checkAttributes)
    static compile(params: {
        graphicsDevice : GraphicsDevice;
        particles      : Array<any>;
        system         : any;
        alreadyParsed? : boolean;
        uvMap?         : { [name: string]: Array<Array<number>> };
        tweaks?        : Array<{ [name: string]: any }>; // any = number | Array<number>
        failOnWarnings?: boolean;
    }): ParticleSystemAnimation
    {
        var graphicsDevice = params.graphicsDevice;
        var particles = params.particles;
        var system = params.system;
        var uvMap = params.uvMap;
        var tweaks = params.tweaks;
        var failOnWarnings = params.failOnWarnings;
        if (failOnWarnings === undefined)
        {
            failOnWarnings = true;
        }

        var error = new BuildError();
        var sys, parts;
        var count = particles.length;
        var i;
        if (params.alreadyParsed)
        {
            sys = system;
            parts = []
            // copy over whatever fields are mutated by compilation process.
            // This is still far more efficient than parsing from scratch!
            for (i = 0; i < count; i += 1)
            {
                var part = particles[i]
                // deep copy.
                var textureUVs = Types.copy(part.textureUVs);
                // shallow copy. dont want to try and copy interpolator objects.
                var anim = [];
                var animation = part.animation;
                var animCount = animation.length;
                var j;
                for (j = 0; j < animCount; j += 1)
                {
                    var snap = animation[j];
                    var interpolators = snap.interpolators;
                    var interps = {};
                    for (var f in interpolators)
                    {
                        if (interpolators.hasOwnProperty(f))
                        {
                            interps[f] = interpolators[f];
                        }
                    }
                    anim.push({
                        time         : snap.time,
                        attributes   : Types.copy(snap.attributes),
                        interpolators: interps
                    });
                }

                parts.push({
                    name        : part.name,
                    fps         : part.fps,
                    animation   : anim,
                    textureUVs  : textureUVs,
                    textureSizes: part.textureSizes
                });
            }
        }
        else
        {
            sys = Parser.parseSystem(error, system);
            parts = [];
            for (i = 0; i < count; i += 1)
            {
                parts[i] = Parser.parseParticle(error, particles[i]);
            }
        }

        // Can't go any further in the compile to gather more errors.
        if (sys === null)
        {
            throw error.fail("Build failed!");
        }

        // Normalise particle UV's based on texture sizes in particle.
        for (i = 0; i < count; i += 1)
        {
            if (parts[i])
            {
                ParticleBuilder.normalizeParticleUVs(parts[i]);
            }
        }

        // Check attribute of particles against system attributes
        if (!params.alreadyParsed)
        {
            for (i = 0; i < count; i += 1)
            {
                if (parts[i])
                {
                    ParticleBuilder.checkAttributes(error, parts[i], sys);
                }
            }
        }

        // Perform UV-remapping of particles
        var sysCount = sys.length;
        var attr;
        if (uvMap)
        {
            // Sanity check the maps
            for (var f in uvMap)
            {
                if (uvMap.hasOwnProperty(f))
                {
                    var map = uvMap[f];
                    if (map.length !== parts.length)
                    {
                        error.error("UV-remapping of " + f + " does not specify the correct number of maps");
                    }
                    var found = false;
                    for (i = 0; i < sysCount; i += 1)
                    {
                        attr = sys[i];
                        if (Types.isNumber(attr.type) && f.substr(7) === ""+attr.type)
                        {
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                    {
                        error.warning("UV-mapping is defined for " + f + " which is not used by system");
                    }
                }
            }
            for (i = 0; i < count; i += 1)
            {
                if (parts[i])
                {
                    ParticleBuilder.remapUVs(parts[i], uvMap, i);
                }
            }
        }

        // Can't reasonably go further in the compile if any errors have occured.
        if (!error.empty(failOnWarnings))
        {
            throw error.fail("Build failed!");
        }

        // Set default attributes and interpolators for first snapshot when not defined.
        for (i = 0; i < count; i += 1)
        {
            ParticleBuilder.setDefaults(parts[i], sys);
        }

        // Perform linear remaps of attributes.
        if (tweaks)
        {
            var exclude = [];
            var excludeTypes = [];
            for (i = 0; i < sysCount; i += 1)
            {
                attr = sys[i];
                exclude.push(attr.name + "-scale");
                exclude.push(attr.name + "-offset");
                excludeTypes.push(attr.type);
            }
            var tweakCount = tweaks.length;
            if (tweakCount !== parts.length)
            {
                error.error("Not enough tweaks specified to match particle count");
            }
            for (i = 0; i < tweakCount; i += 1)
            {
                var tweak = tweaks[i];

                // check for extra fields
                Parser.extraFields(error, "animation tweaks", tweak, exclude);

                // check type of expected fields
                for (var f in tweak)
                {
                    var ind = exclude.indexOf(f);
                    if (ind === -1)
                    {
                        continue;
                    }
                    if (Types.isNumber(tweak[f]))
                    {
                        tweak[f] = [tweak[f]];
                    }
                    ParticleBuilder.checkAssignment(error, "particle " + parts[i].name, "tweak '" + f + "'",
                                                    tweak[f], excludeTypes[ind >>> 1]);
                }
            }

            // Can't reasonably go further in the compile if any errors have occured.
            if (error.checkErrorState())
            {
                throw error.fail("Build failed!");
            }

            for (i = 0; i < tweakCount; i += 1)
            {
                ParticleBuilder.applyTweak(sys, parts[i], tweaks[i]);
            }
        }

        // Check for any warnings at any point during compile
        if (!error.empty(failOnWarnings))
        {
            throw error.fail("Build failed!");
        }

        // ----------------------------------------------------
        // No errors/warnings are generated from this point on.

        // Discretise for each output frame of animation texture.
        for (i = 0; i < count; i += 1)
        {
            ParticleBuilder.discretize(sys, parts[i]);
        }

        // Clamp attributes of animation frames.
        for (i = 0; i < count; i += 1)
        {
            ParticleBuilder.clampAttributes(sys, parts[i]);
        }

        // Compute min/max for normalized attribute storages.
        var minDelta = ParticleBuilder.attributesMapping(sys, parts);

        // Normalise attributes if required
        for (i = 0; i < count; i += 1)
        {
            ParticleBuilder.normalizeAttributes(sys, parts[i], minDelta);
        }

        // Build texture data
        var width = 0;
        for (i = 0; i < count; i += 1)
        {
            width += parts[i].animation.length;
        }
        var data = ParticleBuilder.compileData(sys, width, parts);

        // Build output maps
        var particleDefns = [];
        var maxLifeTime = 0;
        var prev = 0;
        for (i = 0; i < count; i += 1)
        {
            var particle = parts[i];
            var seq = particle.animation;
            var lifeTime = seq[seq.length - 1].time;
            if (lifeTime > maxLifeTime)
            {
                maxLifeTime = lifeTime;
            }
            particleDefns.push({
                lifeTime: lifeTime,
                animationRange: [(prev + 0.5) / width, (prev + seq.length - 0.5) / width]
            });
            prev += seq.length;
        }

        return {
            maxLifeTime: maxLifeTime,
            animation: ParticleBuilder.buildAnimationTexture(graphicsDevice, width, sys.length, data),
            particle: particleDefns,
            attribute: minDelta
        };
    }

    private static checkAssignment(error: BuildError, objx: string, objt: string, value: Array<number>, type: any): void
    {
        if (type === null)
        {
            return;
        }
        switch (type)
        {
            case "tFloat":
                if (value.length !== 1)
                {
                    error.error("Cannot type " + BuildError.wrap(value) + " with type float for " +
                                objt + " in " + objx);
                }
                break;
            case "tFloat2":
                if (value.length !== 2)
                {
                    error.error("Cannot type " + BuildError.wrap(value) + " with type float2 for " +
                                objt + " in " + objx);
                }
                break;
            case "tFloat4":
                if (value.length !== 4)
                {
                    error.error("Cannot type " + BuildError.wrap(value) + " with type float4 for " +
                                objt + " in " + objx);
                }
                break;
            default: // tTexture(n)
                if (value.length !== 1)
                {
                    error.error("Cannot type " + BuildError.wrap(value) + " with type texture" + <number>type +
                                " for " + objt + " in " + objx);
                }
        }
    }

    private static compileData(system: Array<Attribute>, width: number, particles: Array<Particle>): Uint8Array
    {
        var height = 0;
        var sysCount = system.length;
        var i;
        for (i = 0; i < sysCount; i += 1)
        {
            var attr = system[i];
            var dim = (Types.isNumber(attr.type) ? 4 : attr.defaultValue.length);
            switch (attr.compress)
            {
                case AttributeCompress.cHalf:
                    // 1 -> 1, 2 -> 1, 4 -> 2
                    dim = Math.ceil(dim / 2);
                    break;
                case AttributeCompress.cFull:
                    // _ -> 1
                    dim = Math.ceil(dim / 4);
                    break;
                default:
                    // _ -> _
            }
            height += dim;
        }

        var count = width * height;
        var data = new Uint32Array(count);
        var store = 0;

        var partCount = particles.length;
        for (i = 0; i < sysCount; i += 1)
        {
            var attr = system[i];
            var j;
            for (j = 0; j < partCount; j += 1)
            {
                var particle = particles[j];
                var seq = particle.animation;
                var seqCount = seq.length;
                var k;
                for (k = 0; k < seqCount; k += 1)
                {
                    var value = seq[k].attributes[attr.name];
                    switch (attr.type)
                    {
                        case "tFloat":
                            data[store] = TextureEncode.encodeUnsignedFloat(value[0]);
                            break;
                        case "tFloat2":
                            if (attr.compress !== AttributeCompress.cNone)
                            {
                                data[store] = TextureEncode.encodeUnsignedFloat2(value);
                            }
                            else
                            {
                                data[store + (width * 0)] = TextureEncode.encodeUnsignedFloat(value[0]);
                                data[store + (width * 1)] = TextureEncode.encodeUnsignedFloat(value[1]);
                            }
                            break;
                        default:
                            if (attr.type !== "tFloat4")
                            {
                                var uvs = particle.textureUVs["texture" + <number>attr.type];
                                var ind = (value[0] | 0);
                                value = uvs[ind];
                            }
                            if (attr.compress === AttributeCompress.cFull)
                            {
                                data[store] = TextureEncode.encodeUnsignedFloat4(value);
                            }
                            else if (attr.compress === AttributeCompress.cNone)
                            {
                                data[store + (width * 0)] = TextureEncode.encodeUnsignedFloat(value[0]);
                                data[store + (width * 1)] = TextureEncode.encodeUnsignedFloat(value[1]);
                                data[store + (width * 2)] = TextureEncode.encodeUnsignedFloat(value[2]);
                                data[store + (width * 3)] = TextureEncode.encodeUnsignedFloat(value[3]);
                            }
                            else
                            {
                                data[store + (width * 0)] = TextureEncode.encodeUnsignedFloat2(value.slice(0, 2));
                                data[store + (width * 1)] = TextureEncode.encodeUnsignedFloat2(value.slice(2, 4));
                            }
                    }
                    store += 1;
                }
            }
        }
        return new Uint8Array(data.buffer);
    }

    private static normalizeAttributes(
        system: Array<Attribute>, particle: Particle, minDelta: { [name: string]: AttributeRange }): void
    {
        var res: { [name: string]: AttributeRange } = {};
        var inf = Number.POSITIVE_INFINITY;

        var sysCount = system.length;
        var i;
        for (i = 0; i < sysCount; i += 1)
        {
            var attr = system[i];
            if (attr.storage !== AttributeStorage.sNormalized)
            {
                continue;
            }

            var md = minDelta[attr.name];
            var dim = md.min.length;
            var seq = particle.animation;
            var seqCount = seq.length;
            var j;
            for (j = 0; j < seqCount; j += 1)
            {
                var value = seq[j].attributes[attr.name];
                var k;
                for (k = 0; k < dim; k += 1)
                {
                    value[k] = (value[k] - md.min[k]) * (md.delta[k] === 0 ? 1 : (1 / md.delta[k]));
                }
            }
        }
    }

    private static attributesMapping(system: Array<Attribute>, particles: Array<Particle>)
    {
        var res: { [name: string]: AttributeRange } = {};
        var inf = Number.POSITIVE_INFINITY;

        var sysCount = system.length;
        var i;
        for (i = 0; i < sysCount; i += 1)
        {
            var attr = system[i];
            if (attr.storage !== AttributeStorage.sNormalized)
            {
                continue;
            }

            var min, max, dim;
            switch (attr.type)
            {
                case "tFloat2":
                    min = [inf, inf];
                    max = [-inf, -inf];
                    dim = 2;
                    break;
                case "tFloat4":
                    min = [inf, inf, inf, inf];
                    max = [-inf, -inf, -inf, -inf];
                    dim = 4;
                    break;
                default: // tFloat | tTexture(n) <-- unused, textures can never be normalized.
                    min = [inf];
                    max = [-inf];
                    dim = 1;
            }

            var count = particles.length;
            var j;
            for (j = 0; j < count; j += 1)
            {
                var particle = particles[j];
                var seq = particle.animation;
                var seqCount = seq.length;
                var k;
                for (k = 0; k < seqCount; k += 1)
                {
                    var value = seq[k].attributes[attr.name];
                    var r;
                    for (r = 0; r < dim; r += 1)
                    {
                        if (value[r] < min[r])
                        {
                            min[r] = value[r];
                        }
                        if (value[r] > max[r])
                        {
                            max[r] = value[r];
                        }
                    }
                }
            }

            var delta = [];
            for (j = 0; j < dim; j += 1)
            {
                delta[j] = (max[j] - min[j]);
            }

            res[attr.name] = {
                min: min,
                delta: delta
            };
        }
        return res;
    }

    private static clampAttributes(system: Array<Attribute>, particle: Particle): void
    {
        var seq = particle.animation;
        var seqCount = seq.length;
        if (seqCount === 0)
        {
            return;
        }

        var sysCount = system.length;
        var i;
        for (i = 0; i < sysCount; i += 1)
        {
            var attr = system[i];
            var min = attr.minValue;
            var max = attr.maxValue;
            if (Types.isNumber(attr.type))
            {
                // tTexture(n)
                min = [0];
                max = [particle.textureUVs["texture"+(<number>attr.type)].length - 1];
            }

            var dim = seq[0].attributes[attr.name].length;
            var j;
            for (j = 0; j < seqCount; j += 1)
            {
                var snap = seq[j].attributes[attr.name];
                var k;
                for (k = 0; k < dim; k += 1)
                {
                    if (min[k] !== null && snap[k] < min[k])
                    {
                        snap[k] = min[k];
                    }
                    if (max[k] !== null && snap[k] > max[k])
                    {
                        snap[k] = max[k];
                    }
                }
            }
        }
    }

    private static setDefaults(particle: Particle, system: Array<Attribute>): void
    {
        if (particle.animation.length === 0)
        {
            return;
        }

        var snap = particle.animation[0];
        var count = system.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var attr = system[i];
            if (!snap.attributes.hasOwnProperty(attr.name))
            {
                snap.attributes[attr.name] = Types.copy(attr.defaultValue);
            }
            if (!snap.interpolators.hasOwnProperty(attr.name))
            {
                snap.interpolators[attr.name] = attr.defaultInterpolator;
            }
        }
    }

    private static applyTweak(
        system  : Array<Attribute>,
        particle: Particle,
        tweak   : { [name: string]: Array<number> }
    ): void
    {
        var sysCount = system.length;
        var i;
        for (i = 0; i < sysCount; i += 1)
        {
            var attr = system[i];
            var scaleName = attr.name + "-scale";
            var offsetName = attr.name + "-offset";
            var scale = null, offset = null;
            if (tweak.hasOwnProperty(scaleName))
            {
                scale = tweak[scaleName];
            }
            if (tweak.hasOwnProperty(offsetName))
            {
                offset = tweak[offsetName];
            }

            if (!scale && !offset)
            {
                continue;
            }

            var seq = particle.animation;
            var seqCount = seq.length;
            var dim = scale ? scale.length : offset.length;
            var j;
            for (j = 0; j < seqCount; j += 1)
            {
                if (!seq[j].attributes.hasOwnProperty(attr.name))
                {
                    continue;
                }
                var snap = seq[j].attributes[attr.name];
                var k;
                for (k = 0; k < dim; k += 1)
                {
                    if (scale)
                    {
                        snap[k] *= scale[k];
                    }
                    if (offset)
                    {
                        snap[k] += offset[k];
                    }
                }
            }
        }
    }

    private static remapUVs(particle: Particle, uvMap: { [name: string]: Array<Array<number>> }, index: number): void
    {
        for (var f in particle.textureUVs)
        {
            if (particle.textureUVs.hasOwnProperty(f) && uvMap.hasOwnProperty(f))
            {
                var uvs = particle.textureUVs[f];
                var count = uvs.length;
                var maps = uvMap[f];
                if (maps.length <= index)
                {
                    continue;
                }

                var map = maps[index];
                var i;
                for (i = 0; i < count; i += 1)
                {
                    var uv = uvs[i];
                    uv[0] = map[0] + (uv[0] * (map[2] - map[0]));
                    uv[1] = map[1] + (uv[1] * (map[3] - map[1]));
                    uv[2] = map[0] + (uv[2] * (map[2] - map[0]));
                    uv[3] = map[1] + (uv[3] * (map[3] - map[1]));
                }
            }
        }
    }

    // Interpolate for value of attribute 'attr' at time 'time'
    // using whatever snapshots are defined before and after the given time and
    // define the attribute, using the interpolator defined on the preceeding
    // snapshot defining an interpolator.
    //
    // Assume there is at least 1 snapshot <= time defining the attribute
    // and atleast 1 snapshot <= time defining an interpolator.
    private static interpolate(
        snaps: Array<Snapshot>,
        attr : Attribute,
        time : number
    ): Array<number>
    {
        var intp = null;
        var back = [];
        var forth = [];

        var count = snaps.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var snap = snaps[i];
            if (snap.time <= time)
            {
                if (snap.attributes.hasOwnProperty(attr.name))
                {
                    back.push(snap);
                }
                if (snap.interpolators.hasOwnProperty(attr.name))
                {
                    intp = snap.interpolators[attr.name];
                }
            }
            else
            {
                if (snap.attributes.hasOwnProperty(attr.name))
                {
                    forth.push(snap);
                }
            }
        }

        var ts = [];
        var vs = [];
        var offsets = intp.offsets;
        count = offsets.length;
        for (i = 0; i < count; i += 1)
        {
            var offset = offsets[i];
            // assume offset <> 0
            if (offset > 0)
            {
                offset -= 1;
                if (offset < forth.length)
                {
                    ts.push(forth[offset].time);
                    vs.push(forth[offset].attributes[attr.name]);
                }
                else
                {
                    ts.push(null);
                    vs.push(null);
                }
            }
            else
            {
                offset += back.length;
                if (offset >= 0)
                {
                    ts.push(back[offset].time);
                    vs.push(back[offset].attributes[attr.name]);
                }
                else
                {
                    ts.push(null);
                    vs.push(null);
                }
            }
        }

        var t;
        if (forth.length === 0)
        {
            t = 0;
        }
        else
        {
            var prev = back[back.length - 1];
            var next = forth[0];
            t = (time - prev.time) / (next.time - prev.time);
        }

        return intp.fun(vs, ts, t);
    }

    // Discretise particle animation to have exact (interpolated) snapshots in its single sequence
    // based on fps.
    //
    // pre: animation has been flattened
    private static discretize(system: Array<Attribute>, particle: Particle): void
    {
        var disc = [];
        var snaps = particle.animation;
        var seqLength = snaps.length;
        var count = system.length;
        var attr, i, chunk;
        if (seqLength === 0)
        {
            // Get defaults from system
            // No longer care about interpolators being defined.
            chunk = {
                time: 0.0,
                attributes: {},
                interpolators: {}
            };

            for (i = 0; i < count; i += 1)
            {
                attr = system[i];
                chunk.attributes[attr.name] = attr.defaultValue.concat();
            }

            disc = [chunk];
        }
        else if (seqLength === 1)
        {
            disc = snaps;
        }
        else
        {
            var time = 0.0;
            // convert relative times to absolute times for snapshot interpolation.
            for (i = 0; i < seqLength; i += 1)
            {
                snaps[i].time += time;
                time = snaps[i].time;
            }
            var lastTime = time;

            time = 0.0;
            var granularity = 1 / particle.fps;
            while (disc.length === 0 || disc[disc.length - 1].time < lastTime)
            {
                // No longer care about interpolators being defined.
                chunk = {
                    time: time,
                    attributes: {},
                    interpolators: {}
                };

                var i;
                for (i = 0; i < count; i += 1)
                {
                    attr = system[i];
                    chunk.attributes[attr.name] =
                        ParticleBuilder.interpolate(snaps, attr, time);
                }

                disc.push(chunk);
                time += granularity;
            }
        }
        particle.animation = disc;
    }

    static checkAttributes(error: BuildError, particle: Particle, system: Array<Attribute>): void
    {
        var sysAttr;
        var seq = particle.animation;
        if (!seq)
        {
            return;
        }

        var count = seq.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var snap = seq[i];
            var interpolators = snap.interpolators;
            for (var attr in interpolators)
            {
                if (interpolators.hasOwnProperty(attr) &&
                    !ParticleBuilder.getAttribute(system, attr))
                {
                    error.warning("particle " + particle.name + " references attribute '" + attr +
                                  "' not defined in system");
                }
            }
            var attributes = snap.attributes;
            for (var attr in attributes)
            {
                if (!attributes.hasOwnProperty(attr))
                {
                    continue;
                }
                sysAttr = ParticleBuilder.getAttribute(system, attr);
                if (!sysAttr)
                {
                    error.warning("particle " + particle.name + " references attribute '" + attr +
                                  "' not defined in system");
                }
                else
                {
                    var value = attributes[attr];
                    ParticleBuilder.checkAssignment(error, "particle " + particle.name, "attribute '" + attr + "'",
                                                    value, sysAttr.type);
                }
            }
        }
        count = system.length;
        for (i = 0; i < count; i += 1)
        {
            sysAttr = system[i];
            switch (sysAttr.type)
            {
                case "tFloat": case "tFloat2": case "tFloat4": break;
                default: // tTexture(n)
                    if (!particle.textureUVs.hasOwnProperty("texture" + (<number>sysAttr.type)))
                    {
                        particle.textureUVs["texture" + (<number>sysAttr.type)] = [[0, 0, 1, 1]];
                    }
            }
        }
    }

    private static getAttribute(system: Array<Attribute>, name: string): Attribute
    {
        var ret = null;
        var count = system.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var attr = system[i];
            if (attr.name === name)
            {
                ret = attr;
                break;
            }
        }
        return ret;
    }

    private static normalizeParticleUVs(particle: Particle): void
    {
        for (var f in particle.textureUVs)
        {
            if (!particle.textureUVs.hasOwnProperty(f) || !particle.textureSizes.hasOwnProperty(f))
            {
                continue;
            }

            // normalize
            var uvs = particle.textureUVs[f];
            var size = particle.textureSizes[f];
            var invSizeX = 1 / size[0];
            var invSizeY = 1 / size[1];
            var uvCount = uvs.length;
            var j;
            for (j = 0; j < uvCount; j += 1)
            {
                uvs[j][0] *= invSizeX;
                uvs[j][1] *= invSizeY;
                uvs[j][2] *= invSizeX;
                uvs[j][3] *= invSizeY;
            }
        }
    }
}



//
// SharedRenderContext
//
// Deals with allocating texture stores for particle states/mapping tables
// and invalidating systems/views when stores are resized.
//
interface Context
{
    width        : number;
    height       : number;
    renderTargets: Array<RenderTarget>;
    store        : Array<{
        fit : PackedRect;
        set : (ctx: AllocatedContext) => void;
    }>
}
interface AllocatedContext
{
    renderTargets: Array<RenderTarget>;
    uvRectangle  : Array<number>;
    bin          : number;
}
class SharedRenderContext
{
    private graphicsDevice: GraphicsDevice;
    private contexts      : Array<Context>;
    private packer        : OnlineTexturePacker;

    private static textureVertices : VertexBuffer;
    private static textureSemantics: Semantics;
    private static copyParameters  : TechniqueParameters;
    private static copyTechnique   : Technique;
    private static init(graphicsDevice: GraphicsDevice): void
    {
        if (!SharedRenderContext.textureVertices)
        {
            SharedRenderContext.textureVertices =
                graphicsDevice.createVertexBuffer({
                    numVertices: 4,
                    attributes : [graphicsDevice.VERTEXFORMAT_FLOAT2],
                    dynamic    : false,
                    data       : [0,0, 1,0, 0,1, 1,1]
                });
            SharedRenderContext.textureSemantics =
                graphicsDevice.createSemantics([
                    graphicsDevice.SEMANTIC_POSITION
                ]);
            SharedRenderContext.copyParameters =
                graphicsDevice.createTechniqueParameters({
                    dim: [0, 0],
                    dst: [0, 0, 0, 0]
                });

            // Shader embedded from assets/shaders/particles-copy.cgfx
            var shader = graphicsDevice.createShader({"version": 1,"name": "particles-copy.cgfx","samplers":{"src":{"MinFilter": 9728,"MagFilter": 9728,"WrapS": 33071,"WrapT": 33071}},"parameters":{"src":{"type": "sampler2D"},"dim":{"type": "float","columns": 2},"dst":{"type": "float","columns": 4}},"techniques":{"copy":[{"parameters": ["dst","src"],"semantics": ["POSITION"],"states":{"DepthTestEnable": false,"DepthMask": false,"CullFaceEnable": false,"BlendEnable": false},"programs": ["vp_copy","fp_copy"]}]},"programs":{"fp_copy":{"type": "fragment","code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];\nvec4 _ret_0;uniform sampler2D src;void main()\n{_ret_0=texture2D(src,tz_TexCoord[0].xy);gl_FragColor=_ret_0;}"},"vp_copy":{"type": "vertex","code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];attribute vec4 ATTR0;\nvec4 _outPosition1;vec2 _outUV1;uniform vec4 dst;void main()\n{vec2 _xy;vec2 _wh;vec2 _TMP3;_xy=dst.xy*2.0-1.0;_wh=(dst.zw*2.0-1.0)-_xy;_TMP3=_xy+_wh*ATTR0.xy;_outPosition1=vec4(_TMP3.x,_TMP3.y,0.0,1.0);_outUV1=ATTR0.xy;tz_TexCoord[0].xy=ATTR0.xy;gl_Position=_outPosition1;}"}}});
            SharedRenderContext.copyTechnique = shader.getTechnique("copy");
        }
    }

    static create(params: {
        graphicsDevice: GraphicsDevice
    }): SharedRenderContext
    {
        return new SharedRenderContext(params);
    }

    constructor(params: {
        graphicsDevice: GraphicsDevice
    })
    {
        this.graphicsDevice = params.graphicsDevice;
        SharedRenderContext.init(this.graphicsDevice);
        var max = this.graphicsDevice.maxSupported("TEXTURE_SIZE");
        this.packer = new OnlineTexturePacker(max, max);
        this.contexts = [];
    }

    destroy(): void
    {
        var contexts = this.contexts;
        var count = contexts.length;
        while (count > 0)
        {
            count -= 1;
            var ctx = contexts[count];
            ctx.renderTargets[0].colorTexture0.destroy();
            ctx.renderTargets[1].colorTexture0.destroy();
            ctx.renderTargets[0].destroy();
            ctx.renderTargets[1].destroy();
        }
        this.graphicsDevice = null;
        this.packer = null;
        this.contexts = null;
    }

    release(ctx: AllocatedContext): void
    {
        var uv = ctx.uvRectangle;
        var binRect = this.packer.bins[ctx.bin];
        var ctxW = binRect.w;
        var ctxH = binRect.h;
        // Math.round is used, as we know the x/y/w/h of the region are integer
        // but after normalisation numerical errors could creep in.
        this.packer.releaseSpace(
            ctx.bin,
            Math.round(uv[0] * ctxW),
            Math.round(uv[1] * ctxH),
            Math.round((uv[2] - uv[0]) * ctxW),
            Math.round((uv[3] - uv[1]) * ctxH)
        );
    }

    allocate(params: {
        set: (ctx: AllocatedContext) => void;
        width: number;
        height: number;
    }): AllocatedContext
    {
        var fit = this.packer.pack(params.width, params.height);
        if (!fit)
        {
            return null;
        }

        var bin = fit.bin;
        var binRect = this.packer.bins[bin];
        var ctxW = binRect.w;
        var ctxH = binRect.h;
        if (bin >= this.contexts.length)
        {
            this.contexts[bin] = SharedRenderContext.createContext(this.graphicsDevice, ctxW, ctxH);
        }

        var ctx = this.contexts[bin];
        if (ctxW > ctx.width || ctxH > ctx.height)
        {
            ctx = this.contexts[bin] = this.resizeContext(ctx, ctxW, ctxH);
        }
        var invW = (1 / ctx.width);
        var invH = (1 / ctx.height);

        ctx.store.push({
            set: params.set,
            fit: fit
        });

        return {
            renderTargets: ctx.renderTargets,
            uvRectangle: [
                (fit.x * invW),
                (fit.y * invH),
                (fit.x + fit.w) * invW,
                (fit.y + fit.h) * invH
            ],
            bin: fit.bin
        };
    }

    private resizeContext(ctx: Context, w, h)
    {
        // don't resize to exactly the required size.
        // instead scale up to a larger size to reduce
        // the number of times we need to resize.
        //
        // whilst multiplication by 2 is optimal in terms of resize counts
        // we don't want to waste too much texture space.
        var newW = ctx.width;
        var newH = ctx.height;
        while (newW < w)
        {
            newW = Math.ceil(newW * 1.25);
        }
        while (newH < h)
        {
            newH = Math.ceil(newH * 1.25);
        }
        if (newW > this.packer.maxWidth)
        {
            newW = this.packer.maxWidth;
        }
        if (newH > this.packer.maxHeight)
        {
            newH = this.packer.maxHeight;
        }
        w = newW;
        h = newH;

        var gd = this.graphicsDevice;
        var newCtx = SharedRenderContext.createContext(gd, w, h);
        SharedRenderContext.copyTexture(gd, ctx.renderTargets[0], newCtx.renderTargets[0]);
        SharedRenderContext.copyTexture(gd, ctx.renderTargets[1], newCtx.renderTargets[1]);
        ctx.renderTargets[0].colorTexture0.destroy();
        ctx.renderTargets[1].colorTexture0.destroy();
        ctx.renderTargets[0].destroy();
        ctx.renderTargets[1].destroy();

        var invW = (1 / w);
        var invH = (1 / h);

        var store = ctx.store;
        var newStore = newCtx.store;
        var count = store.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var elt = store[i];
            var fit = elt.fit;
            newStore.push(elt);
            elt.set({
                renderTargets: newCtx.renderTargets,
                uvRectangle: [
                    (fit.x * invW),
                    (fit.y * invH),
                    (fit.x + fit.w) * invW,
                    (fit.y + fit.h) * invH
                ],
                bin: fit.bin
            });
        }
        return newCtx;
    }

    private static copyTexture(gd: GraphicsDevice, from: RenderTarget, to: RenderTarget): void
    {
        var parameters = SharedRenderContext.copyParameters;
        var technique  = SharedRenderContext.copyTechnique;
        var vertices   = SharedRenderContext.textureVertices;
        var semantics  = SharedRenderContext.textureSemantics;

        parameters["src"] = from.colorTexture0;
        parameters["dst"] = [
            0, 0,
            from.colorTexture0.width / to.colorTexture0.width,
            from.colorTexture0.height / to.colorTexture0.height
        ];

        gd.beginRenderTarget(to);
        gd.setStream(vertices, semantics);
        gd.setTechnique(technique);
        gd.setTechniqueParameters(parameters);
        gd.draw(gd.PRIMITIVE_TRIANGLE_STRIP, 4, 0);
        gd.endRenderTarget();
    }

    private static createContext(gd: GraphicsDevice, w, h)
    {
        var targets = [];
        var i;
        for (i = 0; i < 2; i += 1)
        {
            var tex = gd.createTexture({
                name      : "SharedRenderContext Context Texture " + i,
                width     : w,
                height    : h,
                depth     : 1,
                format    : gd.PIXELFORMAT_R8G8B8A8,
                mipmaps   : false,
                cubemap   : false,
                dynamic   : true,
                renderable: true
            });
            targets.push(gd.createRenderTarget({ colorTexture0: tex }));
        }

        return {
            width        : w,
            height       : h,
            renderTargets: targets,
            store        : [],
        };
    }
}

//
// ParticleGeometry
//
class ParticleGeometry
{
    vertexBuffer  : VertexBuffer;
    particleStride: number;
    semantics     : Semantics;
    attributes    : Array<any>;
    primitive     : any;

    maxParticles  : number;
    shared        : boolean;

    private graphicsDevice: GraphicsDevice;
    private template: Array<number>;

    private handlers: Array<() => void>;
    register(cb: () => void)
    {
        if (this.handlers.indexOf(cb) === -1)
        {
            this.handlers.push(cb);
        }
    }
    unregister(cb: () => void)
    {
        var index = this.handlers.indexOf(cb);
        if (index !== -1)
        {
            this.handlers.splice(index, 1);
        }
    }

    resize(maxParticles: number)
    {
        if (maxParticles <= this.maxParticles)
        {
            return;
        }

        var template       = this.template;
        var templateLength = template.length;
        var particleData   = new Uint16Array(maxParticles * templateLength);

        var i;
        for (i = 0; i < maxParticles; i += 1)
        {
            var index = (i * templateLength);
            var j;
            for (j = 0; j < templateLength; j += 1)
            {
                particleData[index + j] = (template[j] === null ? i : template[j]);
            }
        }

        this.maxParticles = maxParticles;
        if (this.vertexBuffer)
        {
            this.vertexBuffer.destroy();
        }
        this.vertexBuffer = this.graphicsDevice.createVertexBuffer({
            numVertices: maxParticles * this.particleStride,
            attributes : this.attributes,
            dynamic    : false,
            data       : particleData
        });

        var handlers = this.handlers;
        var count = handlers.length;
        for (i = 0; i < count; i += 1)
        {
            handlers[i]();
        }
    }

    constructor() {}
    static create(params: {
        graphicsDevice: GraphicsDevice;
        maxParticles  : number;
        template      : Array<number>;
        attributes    : Array<any>; // VERTEXFORMAT
        stride        : number;
        semantics     : Semantics;
        primitive?    : any; // PRIMITIVE
        shared?       : boolean;
    }): ParticleGeometry
    {
        var maxParticles   = params.maxParticles;
        var template       = params.template;
        var templateLength = template.length;

        var particleStride = (templateLength / params.stride) | 0;
        var primitive = params.primitive;
        if (primitive === undefined)
        {
            primitive = params.graphicsDevice.PRIMITIVE_TRIANGLES;
        }

        var ret = new ParticleGeometry();
        ret.handlers       = [];
        ret.graphicsDevice = params.graphicsDevice;
        ret.particleStride = particleStride;
        ret.semantics      = params.semantics;
        ret.primitive      = primitive;
        ret.shared         = (params.shared === undefined ? false : params.shared);
        ret.template       = template.concat();
        ret.attributes     = params.attributes.concat();
        ret.resize(params.maxParticles);
        return ret;
    }

    destroy(): void
    {
        this.vertexBuffer.destroy();
    }
}

//
// ParticleUpdater
//
interface ParticleUpdater
{
    technique : Technique;
    parameters: { [name: string]: any };
    update?(parameters: TechniqueParameters,
            data      : Float32Array,
            dataI     : Uint32Array,
            tracked   : Uint16Array,
            numTracked: number): void;
    predict?(parameters: TechniqueParameters,
             position  : FloatArray,
             velocity  : FloatArray,
             userData  : number,
             time      : number): number;
    createUserDataSeed(): number;
}

//
// DefaultParticleUpdater
//
interface DefaultUpdaterArchetype
{
    acceleration          : FloatArray;
    drag                  : number;
    noiseTexture          : string;
    randomizedAcceleration: FloatArray;
}
class DefaultParticleUpdater
{
    technique: Technique;
    parameters: { [name: string]: any };

    static template = {
        acceleration          : [0, 0, 0],
        drag                  : 0,
        noiseTexture          : <string>null,
        randomizedAcceleration: [0, 0, 0]
    };
    static preload(archetype: DefaultUpdaterArchetype, shaderManager, textureManager): void
    {
        shaderManager.load("shaders/particles-default-update.cgfx");
        if (archetype.noiseTexture)
        {
            textureManager.load(archetype.noiseTexture);
        }
    }
    static compressArchetype(archetype: DefaultUpdaterArchetype): any
    {
        return ParticleManager.recordDelta(DefaultParticleUpdater.template, archetype);
    }
    static parseArchetype(error: BuildError, delta: any): DefaultUpdaterArchetype
    {
        if (Types.isNullUndefined(delta))
        {
            return Types.copy(DefaultParticleUpdater.template);
        }

        if (!Types.isObject(delta))
        {
            error.error("updater archetype should be an object");
            return null;
        }

        function checkV3(n): (any) => FloatArray
        {
            return Parser.checkVector.bind(null, error, "default updater archetype", n, 3);
        }
        function checkNumber(n): (any) => number
        {
            return Parser.checkNumber.bind(null, error, "default updater archetype", n);
        }
        function checkString(n): (any) => string
        {
            return Parser.checkString.bind(null, error, "default updater archetype", n);
        }
        function val<R>(x: R): () => R
        {
            return function () { return x; };
        }
        function maybe<R>(n, x: (string) => (any) => R, y: () => R): R
        {
            return Parser.maybeField(delta, n, x(n), y);
        }

        Parser.extraFields(error, "default updater archetype", delta,
            ["acceleration", "drag", "noiseTexture", "randomizedAcceleration"]);

        return {
            acceleration          : maybe("acceleration"          , checkV3    , VMath.v3BuildZero),
            drag                  : maybe("drag"                  , checkNumber, val(0)),
            noiseTexture          : maybe("noiseTexture"          , checkString, val(null)),
            randomizedAcceleration: maybe("randomizedAcceleration", checkV3    , VMath.v3BuildZero)
        };
    }
    applyArchetype(textureManager, system, archetype)
    {
        var parameters = system.updateParameters;
        VMath.v3Copy(archetype.acceleration, parameters["acceleration"]);
        parameters["drag"] = archetype.drag;
        parameters["noiseTexture"] = textureManager.get(archetype.noiseTexture);
        VMath.v3Copy(archetype.randomizedAcceleration, parameters["randomizedAcceleration"]);
    }

    createUserDataSeed()
    {
        return (Math.random() * 0xff) << 16;
    }
    static createUserData(randomizeAcceleration = false, seed = 0)
    {
        return ((<any>randomizeAcceleration) << 25) | (seed << 16);
    }

    predict(
        parameters: TechniqueParameters,
        pos       : FloatArray,
        vel       : FloatArray,
        userData  : number,
        time      : number
    ): number
    {
        // A rough approximation only!
        // Not possibly to determine analytically
        // especcially since non-constant step sizes would just not be possible to analyse.

        // To permit approximation, we assume a particles position/velocity
        // does not reach maximum values at any point
        // We assume that the randomised acceleration is uniformnly random
        // and can be disregarded.
        // We assume that the system is updated with a constant timestep of 'h'
        // In this case, we can deduce analytically:
        // v(t) = d^(t/h)v + ah(sum(t/h))
        //     where d = 1 - min(1, drag.h)
        //     and sum(n) = if (d <> 1) d(d^n-1)/(d-1) else nd

        // if d = 1, we have uniform acceleration and
        // p(t) ~= p(0) + v(0)*t + at^2/2
        //
        // if d <> 1, then by wolfram alpha
        // p(t) ~= p(0) + h(d^(t/h) -1)/(log d)*v + (h(d^(t/h) -1) - log d)/((d-1)log d)adh
        //
        // we note that using integration to compute position estimate is not strictly
        // correct due to euler integration used in actual simulation.

        var h = 1/60; // a reasonable guess at time step I would say in ideal circumstances.
        var acceleration: FloatArray = parameters["acceleration"];
        var ax = acceleration[0];
        var ay = acceleration[1];
        var az = acceleration[2];
        var drag = (1 - Math.min(1, parameters["drag"] * h));
        var coef;
        if (drag === 1)
        {
            coef = 0.5 * (time - h);
            pos[0] += time * (vel[0] + (coef * ax));
            pos[1] += time * (vel[1] + (coef * ay));
            pos[2] += time * (vel[2] + (coef * az));
            vel[0] += time * ax;
            vel[1] += time * ay;
            vel[2] += time * az;
        }
        else
        {
            var pow = Math.pow(drag, time / h);
            var log = Math.log(drag);
            coef = h * (pow - 1) / log;
            var coef2 = ((h * (pow - 1)) - (time * log)) / ((drag - 1) * log) * drag * h;
            var coef3 = h * drag * (pow - 1) / (drag - 1);
            pos[0] += (coef * vel[0]) + (coef2 * ax);
            pos[1] += (coef * vel[1]) + (coef2 * ay);
            pos[2] += (coef * vel[2]) + (coef2 * az);
            vel[0] =  (pow  * vel[0]) + (coef3 * ax);
            vel[1] =  (pow  * vel[1]) + (coef3 * ay);
            vel[2] =  (pow  * vel[2]) + (coef3 * az);
        }

        return userData;
    }

    update(
        parameters: TechniqueParameters,
        dataF     : Float32Array,
        dataI     : Uint32Array,
        tracked   : Uint16Array,
        numTracked: number
    ) {
        var timeStep    : number     = parameters["timeStep"];
        var lifeStep    : number     = parameters["lifeStep"];
        var acceleration: FloatArray = parameters["acceleration"];
        var drag        : number     = parameters["drag"];
        var halfExtents : FloatArray = parameters["halfExtents"];
        var shift       : FloatArray = parameters["shift"];
        var maxSpeed    : number     = parameters["maxSpeed"];

        drag = (1 - Math.min(1, timeStep * drag));

        var h0 = maxSpeed / halfExtents[0];
        var h1 = maxSpeed / halfExtents[1];
        var h2 = maxSpeed / halfExtents[2];

        var ax = acceleration[0] / maxSpeed;
        var ay = acceleration[1] / maxSpeed;
        var az = acceleration[2] / maxSpeed;

        var sx = shift[0];
        var sy = shift[1];
        var sz = shift[2];

        var SPAN = ParticleSystem.PARTICLE_SPAN;
        var LIFE = ParticleSystem.PARTICLE_LIFE;
        var VEL  = ParticleSystem.PARTICLE_VEL;
        var POS  = ParticleSystem.PARTICLE_POS;

        var decodeHalfUnsignedFloat = TextureEncode.decodeHalfUnsignedFloat;
        var encodeHalfUnsignedFloat = TextureEncode.encodeHalfUnsignedFloat;

        var i;
        for (i = 0; i < numTracked; i += 1)
        {
            var index = tracked[i] * SPAN;

            // Compute next life, if particle is dead, skip simulation
            // Also prevent 'too much' time being simulated so that tracked
            // particles stop simulation exactly at death.
            var oldLife = decodeHalfUnsignedFloat(dataI[index + LIFE] >>> 16);
            if (oldLife <= 0)
            {
                continue;
            }
            var life = oldLife - lifeStep;
            var time = timeStep;
            if (lifeStep !== 0)
            {
                time *= Math.min(lifeStep, oldLife) / lifeStep;
            }

            var vx = dataF[index + VEL];
            var vy = dataF[index + VEL + 1];
            var vz = dataF[index + VEL + 2];

            // Update position
            var x = dataF[index + POS]     + (vx * time * h0) + sx;
            var y = dataF[index + POS + 1] + (vy * time * h1) + sy;
            var z = dataF[index + POS + 2] + (vz * time * h2) + sz;
            dataF[index + POS]     = (x < -1 ? -1 : x > 1 ? 1 : x);
            dataF[index + POS + 1] = (y < -1 ? -1 : y > 1 ? 1 : y);
            dataF[index + POS + 2] = (z < -1 ? -1 : z > 1 ? 1 : z);

            // Update velocity
            x = drag * (vx + (ax * time));
            y = drag * (vy + (ay * time));
            z = drag * (vz + (az * time));
            dataF[index + VEL]     = (x < -1 ? -1 : x > 1 ? 1 : x);
            dataF[index + VEL + 1] = (y < -1 ? -1 : y > 1 ? 1 : y);
            dataF[index + VEL + 2] = (z < -1 ? -1 : z > 1 ? 1 : z);

            // Update life
            dataI[index + LIFE] = (encodeHalfUnsignedFloat(life) << 16) |
                                  (0xffff & dataI[index + LIFE]);
        }
    }

    constructor() {}
    static create(graphicsDevice: GraphicsDevice, shaderManager: ShaderManager): DefaultParticleUpdater
    {
        var shader = shaderManager.get("shaders/particles-default-update.cgfx");
        var ret = new DefaultParticleUpdater();
        ret.technique = shader.getTechnique("update");
        ret.parameters = {
            acceleration          : new Float32Array(3),
            drag                  : 0,
            noiseTexture          : ParticleSystem.getDefaultNoiseTexture(graphicsDevice),
            randomizedAcceleration: new Float32Array(3)
        };
        return ret;
    }
}

//
// ParticleRenderer
//
interface ParticleGeometryFn
{
    (graphicsDevice: GraphicsDevice, maxParticles: number, shared?: boolean): ParticleGeometry;
}
interface ParticleRenderer
{
    technique : Technique;
    parameters: { [name: string]: any };
    createGeometry(graphicsDevice: GraphicsDevice,
                   maxParticles  : number,
                   shared?       : boolean): ParticleGeometry;
    setAnimationParameters(
        system: ParticleSystem,
        definition: { attribute: { [name: string]: AttributeRange } }
    ): void;
    createUserDataSeed(): number;
}

//
// DefaultParticleRenderer
//
interface DefaultRendererArchetype
{
    noiseTexture         : string;
    randomizedRotation   : number;
    randomizedOrientation: FloatArray;
    randomizedScale      : FloatArray;
    randomizedAlpha      : number;
    animatedRotation     : boolean;
    animatedOrientation  : boolean;
    animatedScale        : boolean;
    animatedAlpha        : boolean;
}
class DefaultParticleRenderer
{
    technique : Technique;
    parameters: { [name: string]: any };

    // For ParticleArchetype
    static template = {
        noiseTexture         : <string>null,
        randomizedRotation   : 0.0,
        randomizedOrientation: [0.0, 0.0],
        randomizedScale      : [0.0, 0.0],
        randomizedAlpha      : 0.0,
        animatedRotation     : false,
        animatedOrientation  : false,
        animatedScale        : false,
        animatedAlpha        : false
    };
    static preload(archetype: DefaultUpdaterArchetype, shaderManager, textureManager): void
    {
        shaderManager.load("shaders/particles-default-render.cgfx");
        if (archetype.noiseTexture)
        {
            textureManager.load(archetype.noiseTexture);
        }
    }
    static compressArchetype(archetype: DefaultRendererArchetype): any
    {
        return ParticleManager.recordDelta(DefaultParticleRenderer.template, archetype);
    }
    static parseArchetype(error: BuildError, delta: any): DefaultRendererArchetype
    {
        if (Types.isNullUndefined(delta))
        {
            return Types.copy(DefaultParticleRenderer.template);
        }

        if (!Types.isObject(delta))
        {
            error.error("renderer archetype should be an object");
            return null;
        }

        // Pre: delta is a non-null object. Manager will guarantee this.
        function checkV2(n): (any) => FloatArray
        {
            return Parser.checkVector.bind(null, error, "default renderer archetype", n, 2);
        }
        function checkNumber(n): (any) => number
        {
            return Parser.checkNumber.bind(null, error, "default renderer archetype", n);
        }
        function checkBoolean(n): (any) => boolean
        {
            return Parser.checkBoolean.bind(null, error, "default renderer archetype", n);
        }
        function checkString(n): (any) => string
        {
            return Parser.checkString.bind(null, error, "default renderer archetype", n);
        }
        function val<R>(x: R): () => R
        {
            return function () { return x; };
        }
        function maybe<R>(n, x: (string) => (any) => R, y: () => R): R
        {
            return Parser.maybeField(delta, n, x(n), y);
        }

        Parser.extraFields(error, "default renderer archetype", delta,
            ["animatedRotation", "animatedOrientation", "animatedScale", "animatedAlpha",
             "randomizedScale", "randomizedAlpha", "randomizedRotation", "randomizedOrientation",
             "noiseTexture"]);

        return {
            noiseTexture         : maybe("noiseTexture"         , checkString , val(null)),
            randomizedRotation   : maybe("randomizedRotation"   , checkNumber , val(0)),
            randomizedOrientation: maybe("randomizedOrientation", checkV2     , VMath.v2BuildZero),
            randomizedScale      : maybe("randomizedScale"      , checkV2     , VMath.v2BuildZero),
            randomizedAlpha      : maybe("randomizedAlpha"      , checkNumber , val(0)),
            animatedRotation     : maybe("animatedRotation"     , checkBoolean, val(false)),
            animatedOrientation  : maybe("animatedRotation"     , checkBoolean, val(false)),
            animatedScale        : maybe("animatedScale   "     , checkBoolean, val(false)),
            animatedAlpha        : maybe("animatedAlpha   "     , checkBoolean, val(false))
        };
    }
    applyArchetype(textureManager, system, archetype, textures)
    {
        var parameters = system.renderParameters;
        parameters["noiseTexture"] = textureManager.get(archetype.noiseTexture);
        parameters["randomizedRotation"] = archetype.randomizedRotation;
        VMath.v2Copy(archetype.randomizedOrientation, parameters["randomizedOrientation"]);
        VMath.v2Copy(archetype.randomizedScale, parameters["randomizedScale"]);
        parameters["randomizedAlpha"] = archetype.randomizedAlpha;
        parameters["animatedRotation"] = archetype.animatedRotation;
        parameters["animatedOrientation"] = archetype.animatedOrientation;
        parameters["animatedScale"] = archetype.animatedScale;
        parameters["animatedAlpha"] = archetype.animatedAlpha;
        parameters["texture"] = textures["texture0"];
    }

    createUserDataSeed()
    {
        return (Math.random() * 0xff) << 16;
    }
    static createUserData(params: {
        facing?              : string;
        randomizeOrientation?: boolean;
        randomizeScale?      : boolean;
        randomizeRotation?   : boolean;
        randomizeAlpha?      : boolean;
        seed?                : number;
        phi?                 : number;
        theta?               : number;
    })
    {
        var ret = 0;
        if (params.facing === "velocity")
        {
            ret |= (1 << 30);
        }
        if (params.facing === "custom")
        {
            ret |= (2 << 30);
        }
        ret |= (<any>params.randomizeRotation << 29);
        ret |= (<any>params.randomizeScale << 28);
        ret |= (<any>params.randomizeOrientation << 27);
        ret |= (<any>params.randomizeAlpha << 26);
        ret |= (params.seed << 16);

        // allow phi/theta to be given as arbitrary angles
        // mapped to appropriate bounded phi/theta before
        // eventual mappings to [0,1) ranges.
        var phiDelta = 0.0;
        if (params.theta !== undefined)
        {
            var theta = (params.theta % (Math.PI * 2));
            if (theta < 0)
            {
                theta += Math.PI * 2;
            }
            if (theta > Math.PI)
            {
                theta = (Math.PI * 2) - theta;
                phiDelta = Math.PI;
            }
            ret |= TextureEncode.encodeByteUnsignedFloat(theta / Math.PI) << 8;
        }
        if (params.phi !== undefined || phiDelta !== 0.0)
        {
            var phi = ((params.phi || 0.0) + phiDelta) % (Math.PI * 2);
            if (phi < 0)
            {
                phi += Math.PI * 2;
            }
            ret |= TextureEncode.encodeByteUnsignedFloat(phi / (Math.PI * 2));
        }
        return ret;
    }

    setAnimationParameters(
        system: ParticleSystem,
        definition: { attribute: { [name: string]: AttributeRange } }
    ): void
    {
        var parameters = system.renderParameters;

        var scale = parameters["animationScale"];
        var animScale = definition.attribute["scale"];
        scale[0] = animScale.min[0];
        scale[1] = animScale.min[1];
        scale[2] = animScale.delta[0];
        scale[3] = animScale.delta[1];

        var rotation = parameters["animationRotation"];
        var animRotation = definition.attribute["rotation"];
        rotation[0] = animRotation.min[0];
        rotation[1] = animRotation.delta[0];
    }

    createGeometry(
        graphicsDevice: GraphicsDevice,
        maxParticles  : number,
        shared        : boolean = false
    ): ParticleGeometry
    {
        return ParticleGeometry.create({
            graphicsDevice: graphicsDevice,
            maxParticles  : maxParticles,
            template      : [0, null,   1, null,   2, null,
                             0, null,   2, null,   3, null],
            attributes    : [graphicsDevice.VERTEXFORMAT_USHORT2],
            stride        : 2,
            semantics     : graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_TEXCOORD]),
            primitive     : graphicsDevice.PRIMITIVE_TRIANGLES,
            shared        : shared
        });
    }

    constructor() {}
    static create(
        graphicsDevice: GraphicsDevice,
        shaderManager : ShaderManager,
        blendMode = "alpha"
    ): DefaultParticleRenderer
    {
        var shader = shaderManager.get("shaders/particles-default-render.cgfx");
        var ret = new DefaultParticleRenderer();
        ret.technique  = shader.getTechnique(blendMode);
        ret.parameters = {
            animationScale       : new Float32Array(4),
            animationRotation    : new Float32Array(2),
            texture              : null,
            noiseTexture         : ParticleSystem.getDefaultNoiseTexture(graphicsDevice),
            randomizedOrientation: new Float32Array(2),
            randomizedScale      : new Float32Array(2),
            randomizedRotation   : 0,
            randomizedAlpha      : 0,
            animatedOrientation  : false,
            animatedScale        : false,
            animatedRotation     : false,
            animatedAlpha        : false
        };
        return ret;
    }
}

//
// ParticleSystem
//
interface ParticleSystemSynchronizer
{
    synchronize(system: ParticleSystem, timeStep: number): void;
}
interface ParticleSystemArchetype
{
    center         : FloatArray;
    halfExtents    : FloatArray;
    maxSpeed       : number;
    maxParticles   : number;
    zSorted        : boolean;
    maxSortSteps   : number;
    trackingEnabled: boolean;
    maxLifeTime    : number;
}
class ParticleSystem
{
    // dimension of particle in gpu memory.
    static PARTICLE_DIMX = 3;
    static PARTICLE_DIMY = 3;
    // size of particle in cpu memory (linear, column by column opposed to gpu)
    static PARTICLE_SPAN = 9;
    // offset to access position (+1, +2) in cpu memory
    static PARTICLE_POS = 0;
    // offset to access velocity (+1, +2) in cpu memory
    static PARTICLE_VEL = 3;
    // offset to access encoded (life | maxLife) in cpu memory
    static PARTICLE_LIFE = 6;
    // offset to access encoded (c0, c1) animation range coefficients
    static PARTICLE_ANIM = 7;
    // offset to access userData in cpu memory
    static PARTICLE_DATA = 8;

    static template = {
        center         : [0, 0, 0],
        halfExtents    : [1, 1, 1],
        maxSpeed       : 10,
        maxParticles   : 64,
        zSorted        : false,
        maxSortSteps   : 136,
        trackingEnabled: false,
        maxLifeTime    : 2
    };
    static compressArchetype(archetype: ParticleSystemArchetype): any
    {
        return ParticleManager.recordDelta(ParticleSystem.template, archetype);
    }
    static parseArchetype(error: BuildError, delta: any): ParticleSystemArchetype
    {
        if (Types.isNullUndefined(delta))
        {
            return Types.copy(ParticleSystem.template);
        }

        if (!Types.isObject(delta))
        {
            error.error("System archetype should be an object");
            return null;
        }

        function checkV3(n): (any) => FloatArray
        {
            return Parser.checkVector.bind(null, error, "system archetype", n, 3);
        }
        function checkNumber(n): (any) => number
        {
            return Parser.checkNumber.bind(null, error, "system archetype", n);
        }
        function checkBoolean(n): (any) => boolean
        {
            return Parser.checkBoolean.bind(null, error, "system archetype", n);
        }
        function val<R>(x: R): () => R
        {
            return function () { return x; };
        }
        function maybe<R>(n, x: (string) => (any) => R, y: () => R): R
        {
            return Parser.maybeField(delta, n, x(n), y);
        }

        Parser.extraFields(error, "system archetype", delta,
            ["center", "halfExtents", "maxSpeed", "maxParticles", "maxParticles", "zSorted",
             "maxSortSTeps", "trackingEnabled", "maxLifeTime"]);

        return {
            center         : maybe("center"         , checkV3     , VMath.v3BuildZero),
            halfExtents    : maybe("halfExtents"    , checkV3     , VMath.v3BuildOne),
            maxSpeed       : maybe("maxSpeed"       , checkNumber , val(10)),
            maxParticles   : maybe("maxParticles"   , checkNumber , val(64)),
            zSorted        : maybe("zSorted"        , checkBoolean, val(false)),
            maxSortSteps   : maybe("maxSortSteps"   , checkNumber , val(136)),
            trackingEnabled: maybe("trackingEnabled", checkBoolean, val(false)),
            maxLifeTime    : maybe("maxLifeTime"    , checkNumber , val(2))
        };
    }

    private static defaultNoiseTexture: Texture;
    static getDefaultNoiseTexture(graphicsDevice: GraphicsDevice): Texture
    {
        if (!ParticleSystem.defaultNoiseTexture)
        {
            var zero = TextureEncode.encodeByteSignedFloat(0.0);
            ParticleSystem.defaultNoiseTexture = graphicsDevice.createTexture({
                name      : "ParticleSystem defaultNoiseTeture",
                width     : 1,
                height    : 1,
                depth     : 1,
                format    : graphicsDevice.PIXELFORMAT_R8G8B8A8,
                mipmaps   : true,
                cubemap   : false,
                renderable: false,
                dynamic   : false,
                data      : [zero, zero, zero, zero]
            });
        }
        return ParticleSystem.defaultNoiseTexture;
    }

    private static computeMaxParticleDependents(maxParticles: number, zSorted: boolean)
    {
        var dimx, dimy;
        if (zSorted)
        {
            if (maxParticles <= 8)
            {
                return {
                    maxMergeStage: 2,
                    textureSize  : [4, 2],
                    capacity     : 8
                };
            }
            else
            {
                // Find best textureSize (most square-like) just large enough for
                // maxParticles, and with area as 8 * power of 2 for sorting.
                var n = Math.ceil(Math.log(maxParticles) / Math.log(2));
                if (n < 3)
                {
                    return {
                        maxMergeStage: 2,
                        textureSize  : [4, 2],
                        capacity     : 8
                    };
                }
                else if (n > 16)
                {
                    return {
                        maxMergeStage: 15,
                        textureSize  : [(1 << 8), (1 << 8)],
                        capacity     : (1 << 16)
                    };
                }
                else
                {
                    var dim = (n >>> 1);
                    dimx = (1 << (n - dim));
                    dimy = (1 << dim);
                    return {
                        maxMergeStage: (n - 1),
                        textureSize  : [dimx, dimy],
                        capacity     : (dimx * dimy)
                    };
                }
            }
        }
        else
        {
            // No restrictions for sorting, can make optimise use of space.
            // Find square like texture size fitting maxParticles
            // to aid in shared packing of textures.
            if (maxParticles > 66536)
            {
                maxParticles = 66536;
            }
            dimx = Math.ceil(Math.sqrt(maxParticles));
            dimy = Math.ceil(maxParticles / dimx);
            return {
                maxMergeStage: null,
                textureSize  : [dimx, dimy],
                capacity     : (dimx * dimy)
            };
        }
    }

    private graphicsDevice: GraphicsDevice;

    // center and half-extents of valid (local) particle positions
    // and half-extents of valid (local) particle velocities.
    center     : FloatArray;
    halfExtents: FloatArray;
    private invHalfExtents: FloatArray;

    maxSpeed    : number;
    maxParticles: number;
    zSorted     : boolean;
    maxSortSteps: number;
    /*Used by ParticleView*/
    /*private*/ maxMergeStage: number;

    // when sharedAnimation is false, destruction of particle system will destroy animation texture.
    private animation: Texture;
    private sharedAnimation: boolean;
    maxLifeTime: number;

    private queue: ParticleQueue;
    /*Accessed by ParticleView*/
    /*private*/ particleSize: FloatArray; // [x, y] in particle counts.

    geometry: ParticleGeometry;

    private lastVisible: number;
    private lastTime   : number;
    synchronizer: ParticleSystemSynchronizer;
    timer: () => number;

    // particle states
    // renderContextShared is false, when no renderContext was supplied to particle system
    // and so on destruction, the (un)shared render context will be destroyed, otherwise
    // the stateContext will be released to the shared render context.
    private renderContextShared: boolean;
    private renderContext: SharedRenderContext;
    private stateContext: AllocatedContext;
    private currentState: number; // 0 | 1 index into stateContext for double buffering.

    updater : ParticleUpdater;
    renderer: ParticleRenderer;
    views   : Array<ParticleView>;

    updateParameters: TechniqueParameters;
    renderParameters: TechniqueParameters;

    // CPU particle states
    trackingEnabled: boolean;
    private numTracked: number;
    private tracked: Uint16Array; // mapping table index storing tracked particles only.
    // Linear storage of particle data on cpu side.
    //   some data on cpu side is kept as floats to avoid encode/decode cycles where unnecessary.
    private cpuF32: Float32Array;
    private cpuU32: Uint32Array;
    private addTracked(id: number): void
    {
        // Precondition: id is not already in trackedIndices.
        var numTracked = this.numTracked;
        var total = numTracked + 1;
        var tracked = this.tracked;
        if (total > tracked.length)
        {
            tracked = this.tracked =
                ParticleSystem.resizeUInt16(tracked, total, numTracked);
        }
        tracked[numTracked] = id;
        this.numTracked += 1;
    }

    /*Used by ParticleView*/
    /*private*/ static fullTextureVertices: VertexBuffer;
    /*private*/ static fullTextureSemantics: Semantics;

    // Shared between EVERY particle system.
    //
    // This can save a hella-lot of memory on the GPU and CPU, with the only restriction
    // induced, being that when particles are created in a system, that system must be
    // updated before any other system has particles created for it.
    //
    // number of particles created since last update
    // createdIndices is at least as long as numCreated and stores the indices of created
    // particles so that relevant data can be zero-ed following the update.
    //
    // particles are 'created' by storing new data in createdTexture via createdData with
    // createdData32 being a view onto createdData.
    private static numCreated       : number = 0;
    private static createdIndices   : Uint16Array;
    private static createdData      : Uint8Array;
    private static createdData32    : Uint32Array;
    private static createdTexture   : Texture;

    // region is clean, no need to flush when no particles were created and used region is smaller.
    private static createdValidWidth : number;
    private static createdValidHeight: number;

    private static addCreated(id: number): void
    {
        // we don't care about corner cases like id's being duplicated, the amount of work
        // done to clear the same particle more than once in stupidly rare circumstances
        // is irrelevant.
        var numCreated = ParticleSystem.numCreated;
        var total = numCreated + 1;
        var created = ParticleSystem.createdIndices;
        if (total > created.length)
        {
            created = ParticleSystem.createdIndices =
                ParticleSystem.resizeUInt16(created, total, numCreated);
        }
        created[numCreated] = id;
        ParticleSystem.numCreated += 1;
    }
    private static resizeUInt16(arr: Uint16Array, total: number, used: number): Uint16Array
    {
        var size = arr.length;
        // Resize list by doubling space to minimise resizes.
        // there is not a whole lot of data involved, so we scale up by the optimal
        // case of doubling as not much memory is wasted in worst-case anyways.
        while (size < total)
        {
            size *= 2;
        }

        // Copy old data to new array.
        var newArr = new Uint16Array(size);
        var i;
        for (i = 0; i < used; i += 1)
        {
            newArr[i] = arr[i];
        }
        return newArr;
    }
    private static sizeCreated(gd, particleSize): void
    {
        if (!ParticleSystem.createdIndices)
        {
            ParticleSystem.createdIndices = new Uint16Array(4);
        }
        // actual texture height is then (w, h) * PARTICLE_DIM
        // Assumption:
        //              this method is called before particles are created in a system
        //              and so we do not need to copy old data into newly allocated
        //              typed arrays / texture.
        var dimx = ParticleSystem.PARTICLE_DIMX;
        var dimy = ParticleSystem.PARTICLE_DIMY;
        var w = particleSize[0] * dimx;
        var h = particleSize[1] * dimy;
        var tex = ParticleSystem.createdTexture;
        if (!tex || (tex.width < w || tex.height < h))
        {
            // we scale up by 1.5 instead of allocating the exact new size needed
            // to avoid in general case, too many resizes, but without wasting too
            // much memory in worst-case.
            var newW = tex ? tex.width : w;
            var newH = tex ? tex.height : h;
            while (newW < w)
            {
                newW = (newW * 1.5) | 0;
            }
            while (newH < h)
            {
                newH = (newH * 1.5) | 0;
            }
            // particle system is limited to 65536 particles
            // => 256 * 256 particles
            var maxW = 256 * dimx;
            var maxH = 256 * dimy;
            if (newW > maxW)
            {
                newW = maxW;
            }
            if (newH > maxH)
            {
                newH = maxH;
            }
            if (tex)
            {
                tex.destroy();
            }
            ParticleSystem.createdTexture = gd.createTexture({
                name      : "ParticleSystem Shared Creation Texture",
                width     : newW,
                height    : newH,
                depth     : 1,
                format    : gd.PIXELFORMAT_R8G8B8A8,
                mipmaps   : false,
                cubemap   : false,
                renderable: false,
                dynamic   : true
            });
            ParticleSystem.createdValidWidth  = newW;
            ParticleSystem.createdValidHeight = newH;
            ParticleSystem.createdData    = new Uint8Array(newW * newH * 4); // rgba
            ParticleSystem.createdData32  = new Uint32Array(ParticleSystem.createdData.buffer);
        }
    }
    private static dispatchCreated(particleSize: FloatArray)
    {
        var dimx = ParticleSystem.PARTICLE_DIMX;
        var dimy = ParticleSystem.PARTICLE_DIMY;

        var validW = ParticleSystem.createdValidWidth;
        var validH = ParticleSystem.createdValidHeight;

        var usedW = particleSize[0] * dimx;
        var usedH = particleSize[1] * dimy;

        var numCreated = ParticleSystem.numCreated;
        if (numCreated !== 0 || (usedW > validW || usedH > validH))
        {
            // XXX requires SDK 0,27,0 :ref: polycraft benchmark.
            ParticleSystem.createdTexture.setData(ParticleSystem.createdData, 0, 0, 0, 0, usedW, usedH);
            if (numCreated === 0)
            {
                // Only expand valid region if it is contained in used region.
                // Particle states are 'square like' so this is almost always
                // the best decision.
                if (usedW >= validW && usedH >= validH)
                {
                    ParticleSystem.createdValidWidth = usedW;
                    ParticleSystem.createdValidHeight = usedH;
                }
            }
            else
            {
                ParticleSystem.createdValidWidth  = 0;
                ParticleSystem.createdValidHeight = 0;
            }
        }
        if (numCreated === 0)
        {
            return;
        }

        var data32 = ParticleSystem.createdData32;
        var indices = ParticleSystem.createdIndices;

        var sizeX = particleSize[0];
        var w = sizeX * dimx;
        var i;
        for (i = 0; i < numCreated; i += 1)
        {
            var id = indices[i];

            // Map Uint16 index back into a full index.
            var u = (id % sizeX);
            var v = ((id - u) / sizeX) | 0;
            var index = (v * dimy * w) + (u * dimx);

            data32[index] = data32[index + 1] = data32[index + 2] =
                data32[index + w] = data32[index + w + 1] = data32[index + w + 2] =
                data32[index + (w * 2)] = data32[index + (w * 2) + 1] = data32[index + (w * 2) + 2] = 0;
        }

        ParticleSystem.numCreated = 0;
    }

    private static sharedDefaultUpdater: ParticleUpdater;
    private static sharedDefaultRenderer: ParticleRenderer;

    private constructor() {}
    static create(params: {
        graphicsDevice      : GraphicsDevice;

        center?             : FloatArray;
        halfExtents         : FloatArray;

        maxSpeed            : number;
        maxParticles        : number;
        zSorted?            : boolean;
        maxSortSteps?       : number;
        geometry?           : ParticleGeometry;
        sharedRenderContext?: SharedRenderContext;

        maxLifeTime         : number;
        animation           : Texture;
        sharedAnimation?    : boolean;

        timer?              : () => number;
        synchronizer?       : ParticleSystemSynchronizer;

        trackingEnabled?    : boolean;

        updater?            : ParticleUpdater;
        renderer?           : ParticleRenderer;
        shaderManager?      : ShaderManager;
    }): ParticleSystem
    {
        var ret = new ParticleSystem();
        ret.graphicsDevice = params.graphicsDevice;

        ret.center = (params.center === undefined) ? VMath.v3BuildZero() : VMath.v3Copy(params.center);
        ret.halfExtents = VMath.v3Copy(params.halfExtents);
        ret.invHalfExtents = VMath.v3Reciprocal(ret.halfExtents);

        ret.maxLifeTime = params.maxLifeTime;
        ret.animation = params.animation;
        ret.sharedAnimation = (params.sharedAnimation === undefined) ? false : params.sharedAnimation;

        ret.timer = params.timer;
        if (ret.timer === undefined)
        {
            ret.timer = function ()
                {
                    return TurbulenzEngine.time;
                };
        }
        ret.synchronizer = params.synchronizer;
        if (!ret.synchronizer)
        {
            ret.synchronizer = DefaultParticleSynchronizer.create({});
        }
        ret.lastVisible = null;
        ret.lastTime = null;

        ret.zSorted = (params.zSorted === undefined) ? false : params.zSorted;
        var deps = ParticleSystem.computeMaxParticleDependents(params.maxParticles, ret.zSorted);
        ret.particleSize  = deps.textureSize;
        ret.maxParticles  = params.maxParticles;
        ret.maxMergeStage = deps.maxMergeStage;
        ret.maxSortSteps  = (params.maxSortSteps === undefined ? 136 : params.maxSortSteps);
        ret.maxSpeed      = params.maxSpeed;

        ret.views = [];

        ret.renderer = params.renderer;
        if (!ret.renderer)
        {
            if (!ParticleSystem.sharedDefaultRenderer)
            {
                ParticleSystem.sharedDefaultRenderer =
                    DefaultParticleRenderer.create(
                        params.graphicsDevice,
                        params.shaderManager,
                        "alpha"
                    );
            }
            ret.renderer = ParticleSystem.sharedDefaultRenderer;
        }

        ret.updater = params.updater;
        if (!ret.updater)
        {
            if (!ParticleSystem.sharedDefaultUpdater)
            {
                ParticleSystem.sharedDefaultUpdater =
                    DefaultParticleUpdater.create(
                        params.graphicsDevice,
                        params.shaderManager
                    );
            }
            ret.updater = ParticleSystem.sharedDefaultUpdater;
        }

        ret.geometry = params.geometry;
        if (!ret.geometry)
        {
            ret.geometry = params.renderer.createGeometry(ret.graphicsDevice, ret.maxParticles);
        }

        ParticleSystem.sizeCreated(ret.graphicsDevice, ret.particleSize);
        ret.queue = new ParticleQueue(ret.maxParticles);

        ret.trackingEnabled = (params.trackingEnabled === true) && (ret.updater !== undefined);
        if (ret.trackingEnabled)
        {
            ret.numTracked = 0;
            ret.tracked = new Uint16Array(4);
            ret.cpuF32 = new Float32Array(ret.maxParticles * ParticleSystem.PARTICLE_SPAN);
            ret.cpuU32 = new Uint32Array(ret.cpuF32.buffer);
        }

        // Add system defined parameters
        var parameters = Types.copyFields(ret.updater.parameters, null, false);
        parameters["lifeStep"]       = 0.0;
        parameters["timeStep"]       = 0.0;
        parameters["shift"]          = VMath.v3BuildZero();
        parameters["center"]         = ret.center;
        parameters["halfExtents"]    = ret.halfExtents;
        parameters["maxSpeed"]       = params.maxSpeed;
        parameters["maxLifeTime"]    = params.maxLifeTime;
        parameters["previousState"]  = null;
        parameters["creationState"]  = null;
        parameters["creationScale"]  = VMath.v2BuildZero();
        parameters["textureSize"]    = VMath.v2BuildZero();
        parameters["invTextureSize"] = VMath.v2BuildZero();
        parameters["regionSize"]     = VMath.v2BuildZero();
        parameters["invRegionSize"]  = VMath.v2BuildZero();
        parameters["regionPos"]      = VMath.v2BuildZero();
        ret.updateParameters = ret.graphicsDevice.createTechniqueParameters(parameters);

        // Add system defined parameters that are constant for all views onto the system.
        // (mapping table / transformation parameters are per-view)
        parameters = Types.copyFields(ret.renderer.parameters, null, false);
        parameters["center"]         = ret.center;
        parameters["halfExtents"]    = ret.halfExtents;
        parameters["zSorted"]        = ret.zSorted;
        parameters["vParticleState"] = null;
        parameters["fParticleState"] = null;
        parameters["maxLifeTime"]    = params.maxLifeTime;
        parameters["animation"]      = ret.animation;
        parameters["animationSize"]  = (ret.animation ? VMath.v2Build(ret.animation.width, ret.animation.height)
                                                      : VMath.v2BuildOne());
        parameters["textureSize"]    = VMath.v2BuildZero();
        parameters["invTextureSize"] = VMath.v2BuildZero();
        parameters["regionSize"]     = VMath.v2BuildZero();
        parameters["invRegionSize"]  = VMath.v2BuildZero();
        parameters["regionPos"]      = VMath.v2BuildZero();
        ret.renderParameters = ret.graphicsDevice.createTechniqueParameters(parameters);

        var sharedRenderContext = params.sharedRenderContext;
        ret.renderContextShared = <boolean><any>(sharedRenderContext);
        if (!ret.renderContextShared)
        {
            sharedRenderContext = new SharedRenderContext({ graphicsDevice: ret.graphicsDevice });
        }
        ret.renderContext = sharedRenderContext;
        ret.currentState = 0;
        ret.setStateContext(sharedRenderContext.allocate({
            width: ret.particleSize[0] * ParticleSystem.PARTICLE_DIMX,
            height: ret.particleSize[1] * ParticleSystem.PARTICLE_DIMY,
            set: ret.setStateContext.bind(ret)
        }));

        if (!ParticleSystem.fullTextureVertices)
        {
            ParticleSystem.fullTextureVertices = ret.graphicsDevice.createVertexBuffer({
                numVertices: 4,
                attributes : [ret.graphicsDevice.VERTEXFORMAT_FLOAT2],
                dynamic    : false,
                data       : [0,0, 1,0, 0,1, 1,1]
            });
            ParticleSystem.fullTextureSemantics =
                ret.graphicsDevice.createSemantics([ret.graphicsDevice.SEMANTIC_POSITION]);
        }

        return ret;
    }

    destroy()
    {
        if (!this.renderContextShared)
        {
            this.renderContext.destroy();
        }
        else
        {
            this.renderContext.release(this.stateContext);
        }
        this.renderContext = null;
        this.stateContext = null;
        this.queue = null;
        if (!this.geometry.shared)
        {
            this.geometry.destroy();
        }
        this.geometry = null;
        this.timer = null;
        this.synchronizer = null;
        if (!this.sharedAnimation && this.animation)
        {
            this.animation.destroy();
        }
        this.animation = null;
    }

    reset(lastTime?)
    {
        this.removeAllParticles();
        if (lastTime !== undefined)
        {
            this.lastVisible = -1;
            this.lastTime = lastTime;
        }
        else
        {
            this.lastVisible = null;
            this.lastTime = null;
        }
    }

    private setStateContext(ctx: AllocatedContext)
    {
        this.stateContext = ctx;
        if (!ctx)
        {
            return;
        }

        var tex = ctx.renderTargets[this.currentState].colorTexture0;
        var uv  = ctx.uvRectangle;
        var ts  = VMath.v2Build(tex.width, tex.height);
        var its = VMath.v2Reciprocal(ts);
        var rp  = VMath.v2Build(uv[0] * tex.width, uv[1] * tex.height);
        var rs  = VMath.v2Build((uv[2] - uv[0]) * tex.width, (uv[3] - uv[1]) * tex.height);
        var irs = VMath.v2Reciprocal(rs);

        var parameters;
        parameters = this.updateParameters;
        VMath.v2Copy(ts,  parameters["textureSize"]);
        VMath.v2Copy(its, parameters["invTextureSize"]);
        VMath.v2Copy(rs,  parameters["regionSize"]);
        VMath.v2Copy(irs, parameters["invRegionSize"]);
        VMath.v2Copy(rp,  parameters["regionPos"]);

        parameters = this.renderParameters;
        VMath.v2Copy(ts,  parameters["textureSize"]);
        VMath.v2Copy(its, parameters["invTextureSize"]);
        VMath.v2Copy(rs,  parameters["regionSize"]);
        VMath.v2Copy(irs, parameters["invRegionSize"]);
        VMath.v2Copy(rp,  parameters["regionPos"]);
        parameters["vParticleState"] = tex;
        parameters["fParticleState"] = tex;
    }

    createParticle(params: {
        position      : FloatArray;
        velocity      : FloatArray;
        lifeTime      : number;
        animationRange: FloatArray;
        userData?     : number;
        forceCreation?: boolean;
        isTracked?    : boolean;
    }): number
    {
        var lifeTime = params.lifeTime;
        if (lifeTime <= 0)
        {
            return null;
        }
        if (lifeTime > this.maxLifeTime)
        {
            lifeTime = this.maxLifeTime;
        }

        var queueTime = lifeTime;
        if (params.isTracked && this.trackingEnabled)
        {
            queueTime = Number.POSITIVE_INFINITY;
        }

        var id = this.queue.create(queueTime, params.forceCreation);
        if (id === null)
        {
            return null;
        }

        var encodeSignedFloat      = TextureEncode.encodeSignedFloat;
        var encodeUnsignedFloat2xy = TextureEncode.encodeUnsignedFloat2xy;
        var index;

        var position = params.position;
        var velocity = params.velocity;
        var userData = (params.userData === undefined ? 0 : params.userData);

        var center = this.center;
        var invHalfExtents = this.invHalfExtents;

        var normalizedLife = lifeTime / this.maxLifeTime;
        var range = params.animationRange;

        var posx = (position[0] - center[0]) * invHalfExtents[0];
        var posy = (position[1] - center[1]) * invHalfExtents[1];
        var posz = (position[2] - center[2]) * invHalfExtents[2];

        var im = 1 / this.maxSpeed;
        var velx = velocity[0] * im;
        var vely = velocity[1] * im;
        var velz = velocity[2] * im;

        var encodedLife  = encodeUnsignedFloat2xy(normalizedLife, normalizedLife);
        var encodedRange = encodeUnsignedFloat2xy(range[1], range[1] - range[0]);

        if (params.isTracked && this.trackingEnabled)
        {
            if (this.queue.wasForced)
            {
                // If particle creation was forced, then we may already track this particle id
                // and we cannot allow duplicates in the tracked list.
                //
                // Best we can do is a linear search sadly, but this is a very rare occurence.
                var found = false;
                var i;
                var numTracked = this.numTracked;
                var tracked = this.tracked;
                for (i = 0; i < numTracked; i += 1)
                {
                    if (tracked[i] === id)
                    {
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    this.addTracked(id);
                }
            }
            else
            {
                this.addTracked(id);
            }

            var x, y, z;
            var cpuF = this.cpuF32;
            var cpuU = this.cpuU32;
            var pos = ParticleSystem.PARTICLE_POS;
            var vel = ParticleSystem.PARTICLE_VEL;
            index = id * ParticleSystem.PARTICLE_SPAN;

            // position and velocity do not need to be encoded, but they do need to be
            // normalised and clamped. We do not worry about the difference in representable
            // values as introduced errors are very, very small.
            cpuF[index + pos]     = (posx < -1 ? -1 : posx > 1 ? 1 : posx);
            cpuF[index + pos + 1] = (posy < -1 ? -1 : posy > 1 ? 1 : posy);
            cpuF[index + pos + 2] = (posz < -1 ? -1 : posz > 1 ? 1 : posz);

            cpuF[index + vel]     = (velx < -1 ? -1 : velx > 1 ? 1 : velx);
            cpuF[index + vel + 1] = (vely < -1 ? -1 : vely > 1 ? 1 : vely);
            cpuF[index + vel + 2] = (velz < -1 ? -1 : velz > 1 ? 1 : velz);

            // keeping code simple, we do use encoding for these values so that the exact same
            // logic can be used and avoid wasting memory.
            cpuU[index + ParticleSystem.PARTICLE_LIFE] = encodedLife;
            cpuU[index + ParticleSystem.PARTICLE_ANIM] = encodedRange;
            cpuU[index + ParticleSystem.PARTICLE_DATA] = userData;
        }

        // Determine index into creation texture
        var sizeX = this.particleSize[0];
        var u = (id % sizeX);
        var v = (((id - u) / sizeX) | 0);
        ParticleSystem.addCreated(id);

        var dimx = ParticleSystem.PARTICLE_DIMX;
        var dimy = ParticleSystem.PARTICLE_DIMY;
        var w = sizeX * dimx;
        index = (v * dimy * w) + (u * dimx);

        var data32 = ParticleSystem.createdData32;
        data32[index]               = encodeSignedFloat(posx);
        data32[index + w]           = encodeSignedFloat(posy);
        data32[index + (w * 2)]     = encodeSignedFloat(posz);
        data32[index + 1]           = encodeSignedFloat(velx);
        data32[index + w + 1]       = encodeSignedFloat(vely);
        data32[index + (w * 2) + 1] = encodeSignedFloat(velz);
        data32[index + 2]           = encodedLife;
        data32[index + w + 2]       = encodedRange;
        data32[index + (w * 2) + 2] = userData;

        return id;
    }

    removeAllParticles(): void
    {
        if (this.trackingEnabled)
        {
            this.numTracked = 0;
        }
        this.queue.clear();

        // create dead particles in all slots.
        var data = ParticleSystem.createdData32;
        var particleSize = this.particleSize;
        var numX = particleSize[0];
        var numY = particleSize[1];
        var dimx = ParticleSystem.PARTICLE_DIMX;
        var dimy = ParticleSystem.PARTICLE_DIMY;
        var w = numX * dimx;
        var u, v;
        for (v = 0; v < numY; v += 1)
        {
            for (u = 0; u < numX; u += 1)
            {
                var gpu = (v * dimy * w) + (u * dimx);
                data[gpu + 2] = 0x0000ffff; // life = 0, total life <> 0 signal to create.
                ParticleSystem.addCreated((v * particleSize[0]) + u);
            }
        }
    }

    removeParticle(id: number): void
    {
        this.queue.removeParticle(id);

        // Remove from tracked list if tracked.
        if (this.trackingEnabled)
        {
            // Shuffle back anything after.
            // (TODO) See updateParticle for reason 'swap-pop' is not performed.
            var i, j = 0;
            var tracked = this.tracked;
            var numTracked = this.numTracked;
            for (i = 0; i < numTracked; i += 1)
            {
                if (tracked[i] !== id)
                {
                    tracked[j] = tracked[i];
                    j += 1;
                }
                else
                {
                    this.numTracked -= 1;
                }
            }
        }

        // create a dead particle in its place.
        var sizeX = this.particleSize[0];
        var u = (id % sizeX);
        var v = (((id - u) / sizeX) | 0);

        var dimx = ParticleSystem.PARTICLE_DIMX;
        var dimy = ParticleSystem.PARTICLE_DIMY;
        var w = sizeX * dimx;
        var gpu = (v * dimy * w) + (u * dimx);
        ParticleSystem.createdData32[gpu + 2] = 0x0000ffff; // life = 0, total life <> 0 signal to create.
    }

    updateParticle(id: number, params: {
        position?      : FloatArray;
        velocity?      : FloatArray;
        animationRange?: FloatArray;
        userData?      : number;
        isTracked?     : boolean;
    }): void
    {
        if (!this.trackingEnabled)
        {
            return;
        }

        var cpuU = this.cpuU32;
        var cpuF = this.cpuF32;

        var POS = ParticleSystem.PARTICLE_POS;
        var VEL = ParticleSystem.PARTICLE_VEL;
        var LIFE = ParticleSystem.PARTICLE_LIFE;
        var ANIM = ParticleSystem.PARTICLE_ANIM;
        var DATA = ParticleSystem.PARTICLE_DATA;

        var decodeHalfUnsignedFloat = TextureEncode.decodeHalfUnsignedFloat;
        var encodeSignedFloat = TextureEncode.encodeSignedFloat;

        var cpu = id * ParticleSystem.PARTICLE_SPAN;

        var sizeX = this.particleSize[0];
        var u = (id % sizeX);
        var v = (((id - u) / sizeX) | 0);

        var dimx = ParticleSystem.PARTICLE_DIMX;
        var dimy = ParticleSystem.PARTICLE_DIMY;
        var w = sizeX * dimx;
        var gpu = (v * dimy * w) + (u * dimx);
        var data32 = ParticleSystem.createdData32;

        // Update position
        var x, y, z;
        var invHalfExtents = this.invHalfExtents;
        var position = params.position;
        if (position !== undefined)
        {
            var center = this.center;
            x = (position[0] - center[0]) * invHalfExtents[0];
            y = (position[1] - center[1]) * invHalfExtents[1];
            z = (position[2] - center[2]) * invHalfExtents[2];
            x = (x < -1 ? -1 : x > 1 ? 1 : x);
            y = (y < -1 ? -1 : y > 1 ? 1 : y);
            z = (z < -1 ? -1 : z > 1 ? 1 : z);
            cpuF[cpu + POS]     = x;
            cpuF[cpu + POS + 1] = y;
            cpuF[cpu + POS + 2] = z;
        }
        else
        {
            x = cpuF[cpu + POS];
            y = cpuF[cpu + POS + 1];
            z = cpuF[cpu + POS + 2];
        }
        data32[gpu]           = encodeSignedFloat(x);
        data32[gpu + w]       = encodeSignedFloat(y);
        data32[gpu + (w * 2)] = encodeSignedFloat(z);

        // Update velocity
        var velocity = params.velocity;
        if (velocity !== undefined)
        {
            var im = 1 / this.maxSpeed;
            x = velocity[0] * im;
            y = velocity[1] * im;
            z = velocity[2] * im;
            x = (x < -1 ? -1 : x > 1 ? 1 : x);
            y = (y < -1 ? -1 : y > 1 ? 1 : y);
            z = (z < -1 ? -1 : z > 1 ? 1 : z);
            cpuF[cpu + VEL]     = x;
            cpuF[cpu + VEL + 1] = y;
            cpuF[cpu + VEL + 2] = z;
        }
        else
        {
            x = cpuF[cpu + VEL];
            y = cpuF[cpu + VEL + 1];
            z = cpuF[cpu + VEL + 2];
        }
        data32[gpu + 1]           = encodeSignedFloat(x);
        data32[gpu + w + 1]       = encodeSignedFloat(y);
        data32[gpu + (w * 2) + 1] = encodeSignedFloat(z);

        // Update life.
        data32[gpu + 2] = cpuU[cpu + LIFE];

        // Update animation range.
        var range = params.animationRange;
        var encodedRange;
        if (range !== undefined)
        {
            encodedRange = TextureEncode.encodeUnsignedFloat2xy(range[1], range[1] - range[0]);
            cpuU[cpu + ANIM] = encodedRange;
        }
        else
        {
            encodedRange = cpuU[cpu + ANIM];
        }
        data32[gpu + w + 2] = encodedRange;

        // Update userData.
        var userData = params.userData;
        if (userData !== undefined)
        {
            cpuU[cpu + DATA] = userData;
        }
        else
        {
            userData = cpuU[cpu + DATA];
        }
        data32[gpu + (w * 2) + 2] = userData;
        ParticleSystem.addCreated(id);

        // Remove from tracked list if no longer tracked on CPU.
        if (params.isTracked !== undefined && !params.isTracked)
        {
            // Shuffle back anything after.
            // Not the fastest of operations, but should only occur very occasionaly
            // (TODO) Reason to shuffle back, instead of 'swap-popping' if for a full
            // cpu-fallback to work more efficiently for partial sorts, as swap-poppping
            // would mess up any particle sorting.
            var tracked = this.tracked;
            var numTracked = this.numTracked;
            var i, j = 0;
            for (i = 0; i < numTracked; i += 1)
            {
                if (tracked[i] !== id)
                {
                    tracked[j] = tracked[i];
                    j += 1;
                }
                else
                {
                    this.numTracked -= 1;
                }
            }
        }
    }

    sync(frameVisible: number)
    {
        if (this.lastVisible === null)
        {
            this.lastTime = this.timer();
        }
        else if (frameVisible !== this.lastVisible)
        {
            var currentTime = this.timer();
            this.synchronizer.synchronize(this, currentTime - this.lastTime);
            this.lastTime = currentTime;
        }
        this.lastVisible = frameVisible;
    }

    private shouldUpdate: boolean;
    /*Used by ParticleView*/
    /*private*/ hasLiveParticles: boolean;
    private updateTime: number;
    private updateShift: FloatArray;
    beginUpdate(deltaTime: number, shift?: FloatArray)
    {
        this.updateTime = deltaTime;
        this.updateShift = shift ? VMath.v3Copy(shift, this.updateShift) : VMath.v3BuildZero(this.updateShift);
        this.shouldUpdate = this.hasLiveParticles;
        this.hasLiveParticles = this.queue.update(deltaTime);
    }
    endUpdate(): boolean
    {
        this.hasLiveParticles = this.hasLiveParticles || (ParticleSystem.numCreated !== 0);
        if (this.shouldUpdate || this.hasLiveParticles)
        {
            this.updateParticleState(this.updateTime, this.updateShift);
        }
        return this.hasLiveParticles;
    }

    private updateParticleState(deltaTime: number, shift: FloatArray)
    {
        ParticleSystem.dispatchCreated(this.particleSize);

        var updater = this.updater;
        var parameters = this.updateParameters;
        var lifeStep = parameters["lifeStep"] = deltaTime / this.maxLifeTime;
        var timeStep = parameters["timeStep"] = deltaTime;
        parameters["creationState"] = ParticleSystem.createdTexture;

        var uShift: FloatArray = parameters["shift"];
        var invHalfExtents = this.invHalfExtents;
        uShift[0] = shift[0] * invHalfExtents[0];
        uShift[1] = shift[1] * invHalfExtents[1];
        uShift[2] = shift[2] * invHalfExtents[2];

        var gd = this.graphicsDevice;
        var targets = this.stateContext.renderTargets;
        var tex = parameters["previousState"] = targets[this.currentState].colorTexture0;
        var scale = parameters["creationScale"];
        scale[0] = this.particleSize[0] * ParticleSystem.PARTICLE_DIMX / ParticleSystem.createdTexture.width;
        scale[1] = this.particleSize[1] * ParticleSystem.PARTICLE_DIMY / ParticleSystem.createdTexture.height;

        gd.setStream(ParticleSystem.fullTextureVertices, ParticleSystem.fullTextureSemantics);
        gd.beginRenderTarget(targets[1 - this.currentState]);
        gd.setTechnique(updater.technique);
        gd.setTechniqueParameters(parameters);
        gd.draw(gd.PRIMITIVE_TRIANGLE_STRIP, 4, 0);
        gd.endRenderTarget();
        this.currentState = 1 - this.currentState;

        var tex = targets[this.currentState].colorTexture0;
        parameters = this.renderParameters;
        parameters["vParticleState"] = tex;
        parameters["fParticleState"] = tex;

        if (this.trackingEnabled)
        {
            updater.update(this.updateParameters, this.cpuF32, this.cpuU32, this.tracked, this.numTracked);
        }
    }

    queryPosition(id: number, dst?: FloatArray): FloatArray
    {
        if (dst === undefined)
        {
            dst = VMath.v3BuildZero();
        }
        var center = this.center;
        var halfExtents = this.halfExtents;
        var cpuF = this.cpuF32;
        var cpu = (id * ParticleSystem.PARTICLE_SPAN) + ParticleSystem.PARTICLE_POS;
        dst[0] = center[0] + (halfExtents[0] * cpuF[cpu]);
        dst[1] = center[1] + (halfExtents[1] * cpuF[cpu + 1]);
        dst[2] = center[2] + (halfExtents[2] * cpuF[cpu + 2]);
        return dst;
    }

    queryVelocity(id: number, dst?: FloatArray): FloatArray
    {
        if (dst === undefined)
        {
            dst = VMath.v3BuildZero();
        }
        var cpuF = this.cpuF32;
        var cpu = (id * ParticleSystem.PARTICLE_SPAN) + ParticleSystem.PARTICLE_VEL;
        dst[0] = this.maxSpeed * cpuF[cpu];
        dst[1] = this.maxSpeed * cpuF[cpu + 1];
        dst[2] = this.maxSpeed * cpuF[cpu + 2];
        return dst;
    }

    queryRemainingLife(id: number): number
    {
        var pix = this.cpuU32[(id * ParticleSystem.PARTICLE_SPAN) + ParticleSystem.PARTICLE_LIFE];
        return TextureEncode.decodeHalfUnsignedFloat(pix >>> 16) * this.maxLifeTime;
    }

    queryUserData(id: number): number
    {
        return this.cpuU32[(id * ParticleSystem.PARTICLE_SPAN) + ParticleSystem.PARTICLE_DATA];
    }

    /*used by ParticleView*/
    /*private*/ render(view: ParticleView): void
    {
        if (!this.hasLiveParticles)
        {
            return;
        }

        var gd = this.graphicsDevice;
        var renderer = this.renderer;
        var geom = this.geometry;

        gd.setStream(geom.vertexBuffer, geom.semantics);
        gd.setTechnique(renderer.technique);
        gd.setTechniqueParameters(this.renderParameters);
        gd.setTechniqueParameters(view.parameters);
        gd.draw(geom.primitive, geom.particleStride * this.maxParticles, 0);
    }

    renderDebug(): void
    {
        // TODO
    }
}

interface ParticleViewParameters
{
    modelView     : FloatArray;
    projection    : FloatArray;
    mappingTable  : Texture;
    mappingSize   : FloatArray;
    invMappingSize: FloatArray;
    mappingPos    : FloatArray;
}
interface PrepareSortParameters
{
    zBound: number;
}
interface MergeSortParameters
{
    cpass         : number;
    PmS           : number;
    twoStage      : number;
    twoStage_PmS_1: number;
    mappingTable  : Texture;
}

class ParticleView
{
    private graphicsDevice: GraphicsDevice;

    private mappingContext: AllocatedContext;
    private currentMapping: number;
    private renderContext: SharedRenderContext;
    private renderContextShared: boolean;

    system: ParticleSystem;
    /*Accessed by ParticleSystem*/
    /*private*/ parameters: ParticleViewParameters;
    private mergePass : number = 0;
    private mergeStage: number = 0;

    private constructor() {}
    static create(params: {
        graphicsDevice      : GraphicsDevice;
        system?             : ParticleSystem;
        sharedRenderContext?: SharedRenderContext;
    }): ParticleView
    {
        var ret = new ParticleView();
        ret.graphicsDevice = params.graphicsDevice;

        // per-view parameters
        ret.parameters = <ParticleViewParameters>ret.graphicsDevice.createTechniqueParameters({
            modelView     : VMath.m43BuildIdentity(),
            projection    : VMath.m44BuildIdentity(),
            mappingTable  : null,
            mappingSize   : VMath.v2BuildZero(),
            invMappingSize: VMath.v2BuildZero(),
            mappingPos    : VMath.v2BuildZero()
        });

        var sharedRenderContext = params.sharedRenderContext;
        ret.renderContextShared = <boolean><any>(sharedRenderContext);
        ret.renderContext = sharedRenderContext;
        ret.setSystem(params.system);
        return ret;
    }

    destroy(): void
    {
        this.setSystem(null);
        this.renderContext = null;
    }

    private setMappingContext(ctx: AllocatedContext): void
    {
        this.mappingContext = ctx;

        var tex = ctx.renderTargets[this.currentMapping].colorTexture0;
        var uv  = ctx.uvRectangle;
        var ms  = VMath.v2Build(tex.width, tex.height);
        var ims = VMath.v2Reciprocal(ms);
        var mp  = VMath.v2Build(uv[0] * tex.width, uv[1] * tex.height);

        var parameters = this.parameters;
        VMath.v2Copy(ms,  parameters.mappingSize);
        VMath.v2Copy(ims, parameters.invMappingSize);
        VMath.v2Copy(mp,  parameters.mappingPos);
        parameters.mappingTable = tex;
    }

    private static mergeSortTechnique   : Technique;
    private static prepareSortTechnique : Technique;
    private static mergeSortParameters  : MergeSortParameters;
    private static prepareSortParameters: PrepareSortParameters;
    private static initSorting(gd: GraphicsDevice)
    {
        if (ParticleView.mergeSortTechnique)
        {
            return;
        }

        // Shader embedded from assets/shaders/particles-sort.cgfx
        var shader = gd.createShader({"version": 1,"name": "particles-sort.cgfx","samplers":{"previousState":{"MinFilter": 9728,"MagFilter": 9728,"WrapS": 33071,"WrapT": 33071},"creationState":{"MinFilter": 9728,"MagFilter": 9728,"WrapS": 33071,"WrapT": 33071},"mappingTable":{"MinFilter": 9728,"MagFilter": 9728,"WrapS": 33071,"WrapT": 33071},"vParticleState":{"MinFilter": 9728,"MagFilter": 9728,"WrapS": 33071,"WrapT": 33071},"fParticleState":{"MinFilter": 9728,"MagFilter": 9728,"WrapS": 33071,"WrapT": 33071},"animation":{"MinFilter": 9728,"MagFilter": 9728,"WrapS": 33071,"WrapT": 33071}},"parameters":{"textureSize":{"type": "float","columns": 2},"invTextureSize":{"type": "float","columns": 2},"regionSize":{"type": "float","columns": 2},"invRegionSize":{"type": "float","columns": 2},"regionPos":{"type": "float","columns": 2},"halfExtents":{"type": "float","columns": 3},"center":{"type": "float","columns": 3},"maxLifeTime":{"type": "float"},"previousState":{"type": "sampler2D"},"shift":{"type": "float","columns": 3},"timeStep":{"type": "float"},"lifeStep":{"type": "float"},"maxSpeed":{"type": "float"},"creationState":{"type": "sampler2D"},"creationScale":{"type": "float","columns": 2},"projection":{"type": "float","rows": 4,"columns": 4},"modelView":{"type": "float","rows": 4,"columns": 3},"mappingTable":{"type": "sampler2D"},"mappingSize":{"type": "float","columns": 2},"invMappingSize":{"type": "float","columns": 2},"mappingPos":{"type": "float","columns": 2},"vParticleState":{"type": "sampler2D"},"fParticleState":{"type": "sampler2D"},"animationSize":{"type": "float","columns": 2},"animation":{"type": "sampler2D"},"zSorted":{"type": "bool"},"zBound":{"type": "float"},"cpass":{"type": "float"},"PmS":{"type": "float"},"twoStage":{"type": "float"},"twoStage_PmS_1":{"type": "float"}},"techniques":{"prepare_sort":[{"parameters": ["regionSize","invMappingSize","mappingPos","invTextureSize","regionSize","invRegionSize","regionPos","modelView","mappingTable","invMappingSize","mappingPos","fParticleState","zBound"],"semantics": ["POSITION"],"states":{"DepthTestEnable": false,"DepthMask": false,"CullFaceEnable": false,"BlendEnable": false},"programs": ["vp_update_mapping","fp_prepare_sort"]}],"sort_pass":[{"parameters": ["regionSize","invMappingSize","mappingPos","regionSize","invRegionSize","mappingTable","invMappingSize","mappingPos","cpass","PmS","twoStage","twoStage_PmS_1"],"semantics": ["POSITION"],"states":{"DepthTestEnable": false,"DepthMask": false,"CullFaceEnable": false,"BlendEnable": false},"programs": ["vp_update_mapping","fp_merge_sort_pass"]}]},"programs":{"fp_merge_sort_pass":{"type": "fragment","code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];\nvec4 _TMP7;float _TMP11;float _TMP12;vec2 _TMP6;vec2 _TMP5;float _TMP10;float _TMP2;float _TMP3;float _TMP4;float _TMP1;vec2 _TMP0;vec2 _p0049;vec2 _x0051;float _x0055;float _x0059;float _x0061;float _u0063;float _index0063;float _v0063;float _y0065;float _x0067;float _TMP78;float _TMP90;uniform vec2 regionSize;uniform vec2 invRegionSize;uniform sampler2D mappingTable;uniform vec2 invMappingSize;uniform vec2 mappingPos;uniform float cpass;uniform float PmS;uniform float twoStage;uniform float twoStage_PmS_1;void main()\n{vec4 _self;float _index1;float _j;float _compare;vec4 _other;_TMP0=(mappingPos+(regionSize*tz_TexCoord[0].xy)/vec2(3.0,3.0))*invMappingSize;_self=texture2D(mappingTable,_TMP0);_x0051=(tz_TexCoord[0].xy*regionSize)/vec2(3.0,3.0);_p0049=floor(_x0051);_index1=(_p0049.y*regionSize.x)/3.0+_p0049.x;_x0055=_index1/twoStage;_TMP10=floor(_x0055);_TMP1=_index1-twoStage*_TMP10;_j=floor(_TMP1);if(_j<PmS||_j>twoStage_PmS_1){_TMP2=0.0;}else{_x0059=(_j+PmS)/cpass;_x0061=_x0059/2.0;_TMP10=floor(_x0061);_TMP4=_x0059-2.0*_TMP10;if(_TMP4<1.0){_TMP3=1.0;}else{_TMP3=-1.0;}\n_TMP2=_TMP3;}\n_compare=float(_TMP2);_index0063=_index1+_compare*cpass;_y0065=regionSize.x/3.0;_x0067=_index0063/_y0065;_TMP10=floor(_x0067);_u0063=_index0063-_y0065*_TMP10;_v0063=(_index0063-_u0063)*invRegionSize.x*3.0;_TMP5=vec2(_u0063+0.5,_v0063+0.5)*invRegionSize*vec2(3.0,3.0);_TMP6=(mappingPos+(regionSize*_TMP5)/vec2(3.0,3.0))*invMappingSize;_other=texture2D(mappingTable,_TMP6);_TMP11=dot(_self.zw,vec2(3.89099121E-03,9.96093750E-01));_TMP12=min(1.0,_TMP11);_TMP78=max(0.0,_TMP12);_TMP11=dot(_other.zw,vec2(3.89099121E-03,9.96093750E-01));_TMP12=min(1.0,_TMP11);_TMP90=max(0.0,_TMP12);if(_TMP78*_compare<=_TMP90*_compare){_TMP7=_self;}else{_TMP7=_other;}\ngl_FragColor=_TMP7;}"},"vp_update_mapping":{"type": "vertex","code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];attribute vec4 ATTR0;\nvec4 _outPosition1;vec2 _outParticle1;vec2 _TMP0;uniform vec2 regionSize;uniform vec2 invMappingSize;uniform vec2 mappingPos;void main()\n{vec2 _TMP32;_TMP0=(mappingPos+(regionSize*ATTR0.xy)/vec2(3.0,3.0))*invMappingSize;_TMP32=_TMP0*2.0-1.0;_outPosition1=vec4(_TMP32.x,_TMP32.y,0.0,1.0);_outParticle1=ATTR0.xy;tz_TexCoord[0].xy=ATTR0.xy;gl_Position=_outPosition1;}"},"fp_prepare_sort":{"type": "fragment","code": "#ifdef GL_ES\n#define TZ_LOWP lowp\nprecision mediump float;\nprecision mediump int;\n#else\n#define TZ_LOWP\n#endif\nvarying vec4 tz_TexCoord[1];\nvec4 _ret_0;vec2 _TMP5;float _TMP11;vec4 _TMP10;float _TMP13;float _TMP6;vec4 _TMP1;vec2 _TMP0;vec2 _p0053;vec4 _life0055;vec2 _c0057;float _TMP64;vec3 _TMP70;vec2 _uv0073;float _TMP74;float _TMP86;float _TMP92;vec2 _uv0093;float _TMP104;float _TMP110;vec2 _uv0111;float _TMP122;vec2 _TMP128;vec2 _enc10129;float _TMP132;vec2 _x0139;uniform vec2 invTextureSize;uniform vec2 regionSize;uniform vec2 invRegionSize;uniform vec2 regionPos;uniform vec3 modelView[4];uniform sampler2D mappingTable;uniform vec2 invMappingSize;uniform vec2 mappingPos;uniform sampler2D fParticleState;uniform float zBound;void main()\n{vec2 _particleUV;float _z1;_TMP0=(mappingPos+(regionSize*tz_TexCoord[0].xy)/vec2(3.0,3.0))*invMappingSize;_TMP1=texture2D(mappingTable,_TMP0);_p0053=(_TMP1.xy*255.0)*vec2(3.0,3.0)*invRegionSize;_particleUV=(regionPos+regionSize*_p0053)*invTextureSize;_c0057=_particleUV+vec2(2.5,0.5)*invTextureSize;_life0055=texture2D(fParticleState,_c0057);_TMP6=dot(_life0055.zw,vec2(3.89099121E-03,9.96093750E-01));_TMP11=min(1.0,_TMP6);_TMP64=max(0.0,_TMP11);if(_TMP64<=0.0){_ret_0=vec4(_TMP1.x,_TMP1.y,1.0,1.0);gl_FragColor=_ret_0;return;}else{_uv0073=_particleUV+vec2(0.5,0.5)*invTextureSize;_TMP10=texture2D(fParticleState,_uv0073);_TMP13=dot(_TMP10,vec4(5.93718141E-08,1.51991844E-05,3.89099121E-03,9.96093750E-01));_TMP11=min(1.0,_TMP13);_TMP86=max(0.0,_TMP11);_TMP74=(_TMP86-0.5)*2.0;_uv0093=_uv0073+vec2(0.0,invTextureSize.y);_TMP10=texture2D(fParticleState,_uv0093);_TMP13=dot(_TMP10,vec4(5.93718141E-08,1.51991844E-05,3.89099121E-03,9.96093750E-01));_TMP11=min(1.0,_TMP13);_TMP104=max(0.0,_TMP11);_TMP92=(_TMP104-0.5)*2.0;_uv0111=_uv0073+vec2(0.0,2.0*invTextureSize.y);_TMP10=texture2D(fParticleState,_uv0111);_TMP13=dot(_TMP10,vec4(5.93718141E-08,1.51991844E-05,3.89099121E-03,9.96093750E-01));_TMP11=min(1.0,_TMP13);_TMP122=max(0.0,_TMP11);_TMP110=(_TMP122-0.5)*2.0;_TMP70=vec3(_TMP74,_TMP92,_TMP110);_z1=_TMP70.x*modelView[0].z+_TMP70.y*modelView[1].z+_TMP70.z*modelView[2].z;_z1=(_z1+zBound)/(2.0*zBound);if(_z1>=1.0){_TMP128=vec2(1.0,1.0);}else{_TMP11=min(1.0,_z1);_TMP132=max(0.0,_TMP11);_x0139=_TMP132*vec2(256.0,1.0);_TMP5=fract(_x0139);_enc10129=_TMP5*256.0;_enc10129.y=_enc10129.y-_enc10129.x/256.0;_TMP128=_enc10129/255.0;}\n_ret_0=vec4(_TMP1.x,_TMP1.y,_TMP128.x,_TMP128.y);gl_FragColor=_ret_0;return;}\ngl_FragColor=_ret_0;}"}}});

        ParticleView.prepareSortTechnique = shader.getTechnique("prepare_sort");
        ParticleView.mergeSortTechnique   = shader.getTechnique("sort_pass");

        ParticleView.prepareSortParameters = <PrepareSortParameters>gd.createTechniqueParameters({
            zBound        : 0
        });
        ParticleView.mergeSortParameters = <MergeSortParameters>gd.createTechniqueParameters({
            cpass         : 0,
            PmS           : 0,
            twoStage      : 0,
            twoStage_PmS_1: 0,
            mappingTable  : null
        });
    }

    setSystem(system: ParticleSystem): void
    {
        if (this.system === system)
        {
            return;
        }

        if (this.system)
        {
            this.system.views.splice(this.system.views.indexOf(this), 1);
            if (this.system.zSorted)
            {
                if (!this.renderContextShared)
                {
                    this.renderContext.destroy();
                    this.renderContext = null;
                }
                else
                {
                    this.renderContext.release(this.mappingContext);
                }
            }
        }

        this.system = system;
        if (!system)
        {
            return;
        }

        system.views.push(this);
        if (system.zSorted)
        {
            ParticleView.initSorting(this.graphicsDevice);

            var particleSize = system.particleSize;
            if (!this.renderContextShared)
            {
                this.renderContext = new SharedRenderContext({ graphicsDevice: this.graphicsDevice });
            }

            this.currentMapping = 0;
            this.setMappingContext(this.renderContext.allocate({
                width : particleSize[0],
                height: particleSize[1],
                set   : this.setMappingContext.bind(this)
            }));

            // Set up first mapping texture with uv-coordinates for all possible particles
            // represented in the table.
            var storageCount = particleSize[0] * particleSize[1];
            var data = new Uint8Array(storageCount * 4);
            var i;
            for (i = 0; i < storageCount; i += 1)
            {
                var u = (i % particleSize[0]);
                var v = ((i - u) / particleSize[0]) | 0;
                data[(i << 2)]     = u;
                data[(i << 2) + 1] = v;
            }

            // XXX requires SDK 0,27,0 :ref: polycraft benchmark.
            var ctx = this.mappingContext;
            var uv = ctx.uvRectangle;
            var tex = ctx.renderTargets[this.currentMapping].colorTexture0;
            tex.setData(
                data, 0, 0,
                uv[0] * tex.width,
                uv[1] * tex.height,
                (uv[2] - uv[0]) * tex.width,
                (uv[3] - uv[1]) * tex.height
            );
        }
    }

    update(modelView?: FloatArray, projection?: FloatArray): void
    {
        var parameters = this.parameters;
        if (modelView)
        {
            VMath.m43Copy(modelView, parameters.modelView);
        }
        if (projection)
        {
            VMath.m44Copy(projection, parameters.projection);
        }
        if (this.system.zSorted)
        {
            this.sort();
            this.parameters.mappingTable = this.mappingContext.renderTargets[this.currentMapping].colorTexture0;
        }
    }

    render(): void
    {
        this.system.render(this);
    }

    private sort(): void
    {
        if (!this.system.hasLiveParticles)
        {
            return;
        }

        var gd = this.graphicsDevice;
        gd.setStream(ParticleSystem.fullTextureVertices, ParticleSystem.fullTextureSemantics);

        var targets = this.mappingContext.renderTargets;
        var prepareParameters = ParticleView.prepareSortParameters;
        var abs = Math.abs;
        var mv = this.parameters.modelView;
        prepareParameters.zBound = abs(mv[2]) + abs(mv[5]) + abs(mv[8]);
        this.parameters.mappingTable = targets[this.currentMapping].colorTexture0;

        // PrepareSort pass.
        gd.beginRenderTarget(targets[1 - this.currentMapping]);
        gd.setTechnique(ParticleView.prepareSortTechnique);
        gd.setTechniqueParameters(this.system.renderParameters);
        gd.setTechniqueParameters(this.parameters);
        gd.setTechniqueParameters(prepareParameters);
        gd.draw(gd.PRIMITIVE_TRIANGLE_STRIP, 4, 0);
        gd.endRenderTarget();
        this.currentMapping = 1 - this.currentMapping;

        // Sort passes
        var mergeParameters = ParticleView.mergeSortParameters;
        gd.setTechnique(ParticleView.mergeSortTechnique);
        gd.setTechniqueParameters(this.system.renderParameters);
        gd.setTechniqueParameters(this.parameters);

        var i = this.system.maxSortSteps;
        while (i > 0)
        {
            i -= 1;
            var pass  = (1 << this.mergePass);
            var stage = (1 << this.mergeStage);
            mergeParameters.cpass          = pass;
            mergeParameters.PmS            = (pass % stage);
            mergeParameters.twoStage       = 2 * stage;
            mergeParameters.twoStage_PmS_1 = (2 * stage) - (pass % stage) - 1;
            mergeParameters.mappingTable   = targets[this.currentMapping].colorTexture0;

            gd.beginRenderTarget(targets[1 - this.currentMapping]);
            gd.setTechniqueParameters(mergeParameters);
            gd.draw(gd.PRIMITIVE_TRIANGLE_STRIP, 4, 0);
            gd.endRenderTarget();
            this.currentMapping = 1 - this.currentMapping;

            this.mergePass -= 1;
            if (this.mergePass < 0)
            {
                this.mergeStage += 1;
                this.mergePass = this.mergeStage;
                if (this.mergeStage > this.system.maxMergeStage)
                {
                    this.mergePass = this.mergeStage = 0;
                    break;
                }
            }
        }
    }
}

//
// ParticleRenderable
//
class ParticleRenderable
{
    // renderable interface
    // ----------------------------------
    addCustomWorldExtents(extents: FloatArray): void
    {
        throw "Not supported";
    }
    clone(): ParticleRenderable
    {
        throw "Not supported";
        return null;
    }
    getCustomWorldExtents(): FloatArray
    {
        return this.getWorldExtents();
    }
    getMaterial(): Material
    {
        return this.sharedMaterial;
    }
    getWorldExtents(): FloatArray
    {
        var node = this.node;
        if (node.worldUpdate > this.worldExtentsUpdate || this.invalidated)
        {
            this.invalidated = false;
            this.updateWorldExtents();
            this.worldExtentsUpdate = node.worldUpdate;
        }
        return this.worldExtents;
    }
    hasCustomWorldExtents(): boolean
    {
        return true;
    }
    removeCustomWorldExtents():void
    {
        throw "Not supported";
    }
    setMaterial(material: Material):void
    {
        throw "Not supported";
    }
    getNode(): SceneNode
    {
        return this.node;
    }
    disabled: boolean = false;
    geometryType: string = "ParticleSystem";
    drawParameters       : Array<DrawParameters> = null;
    diffuseDrawParameters: Array<DrawParameters> = null;
    shadowDrawParameters : Array<DrawParameters> = null;
    sharedMaterial: Material;
    worldExtents: FloatArray;
    distance: number;
    frameVisible: number = 0;
    rendererInfo: any;

    // un-documented renderable interface
    // ----------------------------------
    halfExtents: FloatArray;
    center: FloatArray;
    setNode(node: SceneNode): void
    {
        if (this.node)
        {
            this.node.renderableWorldExtentsRemoved();
        }

        this.node = node;

        if (this.node)
        {
            this.node.renderableWorldExtentsUpdated(false);
        }

        this.worldExtentsUpdate = -1;
    }
    queryCounter: number = 0;
    diffuseShadowDrawParameters: Array<DrawParameters> = null;
    shadowMappingDrawParameters: Array<DrawParameters>=  null;
    geometry: Geometry = null;
    surface: Surface = null;
    techniqueParameters:TechniqueParameters = null;
    skinController: any = null;
    isNormal: boolean = false;
    node: SceneNode = null;
    normalInfos: any = null;
    isSkinned(): boolean
    {
        return false;
    }

    // ParticleRenderable specific
    // ----------------------------------
    private graphicsDevice: GraphicsDevice;
    private lazySystem: () => ParticleSystem;
    private lazyView: () => ParticleView;
    private passIndex: number;
    private views: { [index: number]: ParticleView };
    private sharedRenderContext: SharedRenderContext;

    private invalidated: boolean;
    private worldExtentsUpdate: number;
    world: FloatArray;

    system: ParticleSystem;
    fixedOrientation: boolean;
    localTransform: FloatArray;

    setLocalTransform(localTransform?: FloatArray)
    {
        if (localTransform && this.localTransform !== localTransform)
        {
            VMath.m43Copy(localTransform, this.localTransform);
        }
        this.invalidated = true;
        if (this.node)
        {
            this.node.renderableWorldExtentsUpdated(true);
        }
    }

    setFixedOrientation(fixedOrientation: boolean)
    {
        if (this.fixedOrientation !== fixedOrientation)
        {
            this.fixedOrientation = fixedOrientation;
            this.invalidated = true;
            if (this.node)
            {
                this.node.renderableWorldExtentsUpdated(true);
            }
        }
    }

    private updateWorldExtents()
    {
        var center = this.center;
        var halfExtents = this.halfExtents;
        var worldExtents = this.worldExtents;
        var world = this.world;
        var node = this.node;
        var local = this.localTransform;
        var nodeWorld = node.world;

        // compute actual world transform to use.
        if (this.fixedOrientation)
        {
            // build up target world transform
            var Lx = local[9];
            var Ly = local[10];
            var Lz = local[11];
            // (local scale/rotation)
            world[0] = local[0];
            world[1] = local[1];
            world[2] = local[2];
            world[3] = local[3];
            world[4] = local[4];
            world[5] = local[5];
            world[6] = local[6];
            world[7] = local[7];
            world[8] = local[8];
            // (with position in world space to translate particle system to)
            world[9]  = (nodeWorld[0] * Lx + nodeWorld[3] * Ly + nodeWorld[6] * Lz + nodeWorld[9]);
            world[10] = (nodeWorld[1] * Lx + nodeWorld[4] * Ly + nodeWorld[7] * Lz + nodeWorld[10]);
            world[11] = (nodeWorld[2] * Lx + nodeWorld[5] * Ly + nodeWorld[8] * Lz + nodeWorld[11]);
        }
        else
        {
            VMath.m43Mul(local, nodeWorld, world);
        }

        var m0  = world[0];
        var m1  = world[1];
        var m2  = world[2];
        var m3  = world[3];
        var m4  = world[4];
        var m5  = world[5];
        var m6  = world[6];
        var m7  = world[7];
        var m8  = world[8];
        var m9  = world[9];
        var m10 = world[10];
        var m11 = world[11];

        var c0  = center[0];
        var c1  = center[1];
        var c2  = center[2];
        var ct0 = m9  + (m0 * c0 + m3 * c1 + m6 * c2);
        var ct1 = m10 + (m1 * c0 + m4 * c1 + m7 * c2);
        var ct2 = m11 + (m2 * c0 + m5 * c1 + m8 * c2);

        var h0  = halfExtents[0];
        var h1  = halfExtents[1];
        var h2  = halfExtents[2];
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
    private static material: Material;
    constructor() {}
    static create(params: {
        graphicsDevice      : GraphicsDevice;
        passIndex           : number;
        system?             : ParticleSystem;
        sharedRenderContext?: SharedRenderContext;
    }): ParticleRenderable
    {
        var gd = params.graphicsDevice;
        if (!ParticleRenderable.material)
        {
            var material = ParticleRenderable.material = Material.create(gd);
            material.meta.far         = false;
            material.meta.transparent = true;
            material.meta.decal       = false;
            material.meta.noshadows   = true;
        }

        var ret = new ParticleRenderable();
        ret.resizedGeometryCb = ParticleRenderable.resizedGeometry.bind(null, ret);
        ret.graphicsDevice = gd;
        ret.passIndex = params.passIndex;
        ret.sharedMaterial = ParticleRenderable.material;
        ret.rendererInfo = {};
        ret.views = [];
        ret.fixedOrientation = true;
        ret.world = VMath.m43BuildIdentity();
        ret.worldExtents = new Float32Array(6);
        ret.localTransform = VMath.m43BuildIdentity();
        ret.sharedRenderContext = params.sharedRenderContext;
        ret.setSystem(params.system);
        return ret;
    }

    releaseViews(callback?: (view: ParticleView) => void): void
    {
        var views = this.views;
        for (var i in views)
        {
            if (views.hasOwnProperty(i))
            {
                if (callback)
                {
                    callback(views[i]);
                }
                else
                {
                    views[i].destroy();
                }
            }
        }
        this.views = [];
    }

    destroy(): void
    {
        this.releaseViews();
        this.views = null;
    }

    static cameraId = 0;
    renderUpdate(camera: Camera): void
    {
        if (!this.system)
        {
            this.setSystem(this.lazySystem());
        }
        this.system.sync(this.frameVisible);

        // Use an additional field on Camera to track unique instances
        // and enable mapping back to a ParticleView.
        var cam = <any>camera;
        if (cam.__particle_id === undefined)
        {
            cam.__particle_id = ParticleRenderable.cameraId;
            ParticleRenderable.cameraId += 1;
        }
        var views = this.views;
        var view = views[cam.__particle_id];
        if (!view)
        {
            if (this.lazyView)
            {
                view = this.lazyView();
            }
            if (!view)
            {
                view = ParticleView.create({
                    graphicsDevice     : this.graphicsDevice,
                    sharedRenderContext: this.sharedRenderContext
                });
            }
            view.setSystem(this.system);
            views[cam.__particle_id] = view;
        }

        // optimise setting of modelView to avoid extra temporary.
        VMath.m43Mul(this.world, camera.viewMatrix, view.parameters["modelView"]);
        view.update(null, camera.projectionMatrix);

        this.drawParameters[0].setTechniqueParameters(1, view.parameters);
    }

    setLazyView(view: () => ParticleView): void
    {
        this.lazyView = view;
    }

    setLazySystem(system: () => ParticleSystem, center: FloatArray, halfExtents: FloatArray): void
    {
        this.setSystem(null);
        this.center      = center;
        this.halfExtents = halfExtents;
        this.lazySystem  = system;
        this.worldExtentsUpdate = -1;
    }

    setSystem(system: ParticleSystem): void
    {
        if (this.system)
        {
            this.system.geometry.unregister(this.resizedGeometryCb);
        }

        this.system = system;

        if (system)
        {
            system.geometry.register(this.resizedGeometryCb);
            this.center      = system.center;
            this.halfExtents = system.halfExtents;
            this.worldExtentsUpdate = -1;

            var parameters = this.graphicsDevice.createDrawParameters();
            parameters.setVertexBuffer(0, system.geometry.vertexBuffer);
            parameters.setSemantics   (0, system.geometry.semantics);
            parameters.technique = system.renderer.technique;
            parameters.primitive = system.geometry.primitive;
            parameters.count     = system.maxParticles * system.geometry.particleStride;
            parameters.userData  = { passIndex: this.passIndex };
            parameters.setTechniqueParameters(0, system.renderParameters);
            parameters.setTechniqueParameters(1, null);

            this.drawParameters       = [parameters];
            this.shadowDrawParameters = this.drawParameters;
        }
    }

    private resizedGeometryCb: () => void;
    private static resizedGeometry(self): void
    {
        var system = self.system;
        if (system)
        {
            var parameters = self.drawParameters[0];
            parameters.setVertexBuffer(0, system.geometry.vertexBuffer);
        }
    }
}

interface ParticleEmitter
{
    enabled: boolean;
    sync(synchronizer: ParticleSynchronizer,
         system      : ParticleSystem,
         timeStep    : number);
    reset(): void;
    enable(): void;
    disable(): void;
    burst(count?): void;
}
interface ParticleSynchronizer
{
    emitters: Array<ParticleEmitter>;
    renderable: ParticleRenderable;
    addEmitter(emitter: ParticleEmitter): void;
    removeEmitter(emitter: ParticleEmitter): void;
    synchronize(system: ParticleSystem, timeStep: number): void;
    reset(): void;
}

//
// DefaultParticleSynchronizer
//
interface DefaultParticleSynchronizerEvent
{
    time: number;
    fun(event       : DefaultParticleSynchronizerEvent,
        synchronizer: DefaultParticleSynchronizer,
        system      : ParticleSystem): void;
    recycle(event: DefaultParticleSynchronizerEvent): void;
}
interface DefaultParticleSynchronizerEmitter
{
    enabled: boolean;
    sync(emitter : DefaultParticleSynchronizer,
         system  : ParticleSystem,
         timeStep: number): void;
}
interface DefaultSynchronizerArchetype
{
    fixedTimeStep: number;
    maxSubSteps  : number;
    trailFollow  : number;
}
class DefaultParticleSynchronizer
{
    emitters: Array<DefaultParticleSynchronizerEmitter>;
    events: TimeoutQueue<DefaultParticleSynchronizerEvent>;

    renderable: ParticleRenderable;
    trailFollow: number;

    static template = {
        fixedTimeStep: <number>null,
        maxSubSteps: 3,
        trailFollow: 1
    };
    static compressArchetype(archetype: DefaultSynchronizerArchetype): any
    {
        return ParticleManager.recordDelta(DefaultParticleSynchronizer.template, archetype);
    }
    static parseArchetype(error: BuildError, delta: any): DefaultSynchronizerArchetype
    {
        if (Types.isNullUndefined(delta))
        {
            return Types.copy(DefaultParticleSynchronizer.template);
        }

        if (!Types.isObject(delta))
        {
            error.error("synchronizer archetype should be an object");
            return null;
        }

        function checkNumber(n)
        {
            return Parser.checkNumber.bind(null, error, "default synchronizer archetype", n);
        }
        function checkNullNumber(n)
        {
            return Parser.checkNullNumber.bind(null, error, "default synchronizer archetype", n);
        }
        function val(x): () => any
        {
            return function () { return x; };
        }
        function maybe(n, x, y)
        {
            return Parser.maybeField(delta, n, x(n), y);
        }

        Parser.extraFields(error, "default synchronizer archetype", delta,
            ["fixedTimeStep", "maxSubSteps", "trailFollow"]);

        return {
            fixedTimeStep: maybe("fixedTimeStep", checkNullNumber, val(null)),
            maxSubSteps  : maybe("maxSubSteps"  , checkNumber    , val(3)),
            trailFollow  : maybe("trailFollow"  , checkNumber    , val(1))
        };
    }
    applyArchetype(archetype)
    {
        this.fixedTimeStep = archetype.fixedTimeStep;
        this.maxSubSteps = archetype.maxSubSteps;
        this.trailFollow = archetype.trailFollow;
    }

    fixedTimeStep: number;
    maxSubSteps: number;
    offsetTime: number = 0;
    synchronize(system: ParticleSystem, timeStep: number)
    {
        if (this.fixedTimeStep !== undefined && this.fixedTimeStep !== null)
        {
            timeStep += this.offsetTime;
            var numSteps = Math.floor(timeStep / this.fixedTimeStep);
            if (numSteps > this.maxSubSteps)
            {
                numSteps = this.maxSubSteps;
                timeStep /= numSteps;
                this.offsetTime = 0;
            }
            else
            {
                this.offsetTime = timeStep - (numSteps * this.fixedTimeStep);
                timeStep = this.fixedTimeStep;
            }
            while (numSteps > 0)
            {
                numSteps -= 1;
                this.update(system, timeStep);
            }
        }
        else
        {
            this.update(system, timeStep);
        }
    }

    private previousPos: FloatArray;
    private shift: FloatArray;
    private update(system: ParticleSystem, timeStep: number)
    {
        var shift = this.shift;
        if (this.renderable)
        {
            var xform = this.renderable.world;
            var prev = this.previousPos;
            if (!prev)
            {
                prev = this.previousPos = VMath.m43Pos(xform);
            }
            shift[0] = (prev[0] - xform[9])  * this.trailFollow;
            shift[1] = (prev[1] - xform[10]) * this.trailFollow;
            shift[2] = (prev[2] - xform[11]) * this.trailFollow;
            prev[0] = xform[9];
            prev[1] = xform[10];
            prev[2] = xform[11];
        }
        else
        {
            VMath.v3BuildZero(shift);
        }

        system.beginUpdate(timeStep, shift);

        var emitters = this.emitters;
        var num = emitters.length;
        var i;
        for (i = 0; i < num; i += 1)
        {
            if (emitters[i].enabled)
            {
                emitters[i].sync(this, system, timeStep);
            }
        }

        var events = this.events;
        events.update(timeStep);
        while (events.hasNext())
        {
            var event = events.next();
            event.fun(event, this, system);
        }

        system.endUpdate();
    }

    enqueue(event: DefaultParticleSynchronizerEvent)
    {
        this.events.insert(event, event.time);
    }

    addEmitter(sync: DefaultParticleSynchronizerEmitter)
    {
        if (this.emitters.indexOf(sync) === -1)
        {
            this.emitters.push(sync);
        }
    }

    removeEmitter(sync: DefaultParticleSynchronizerEmitter)
    {
        var index = this.emitters.indexOf(sync);
        if (index !== -1)
        {
            this.emitters.splice(index, 1);
        }
    }

    reset()
    {
        var emitters = this.emitters;
        var count = emitters.length;
        while (count !== 0)
        {
            count -= 1;
            this.removeEmitter(emitters[count]);
        }
        this.offsetTime = 0;
        this.events.clear(DefaultParticleSynchronizer.recycleEvent);
    }

    static recycleEvent(event)
    {
        event.recycle();
    }

    constructor() {}
    static create(params: {
        fixedTimeStep?: number;
        maxSubSteps?  : number;
        renderable?   : ParticleRenderable;
        trailFollow?  : number;
    })
    {
        var ret = new DefaultParticleSynchronizer();
        ret.events = new TimeoutQueue();
        ret.emitters  = [];
        ret.fixedTimeStep = params.fixedTimeStep;
        ret.maxSubSteps = (params.maxSubSteps !== undefined ? params.maxSubSteps : 3);
        ret.renderable = params.renderable;
        ret.trailFollow = (params.trailFollow !== undefined ? params.trailFollow : 1.0);
        ret.shift = VMath.v3BuildZero();
        return ret;
    }
}
interface DefaultEmitterArchetype
{
    forceCreation: boolean;
    usePrediction: boolean;
    emittance: {
        delay   : number;
        rate    : number;
        burstMin: number;
        burstMax: number;
    };
    particle: {
        lifeTimeMin: number;
        lifeTimeMax: number;
        userData   : number;
    };
    position: {
        position          : FloatArray;
        spherical         : boolean;
        normal            : FloatArray;
        radiusMin         : number;
        radiusMax         : number;
        radiusDistribution: string;
        radiusSigma       : number;
    };
    velocity: {
        theta                    : number;
        phi                      : number;
        speedMin                 : number;
        speedMax                 : number;
        flatSpread               : number;
        flatSpreadAngle          : number;
        flatSpreadDistribution   : string;
        flatSpreadSigma          : number;
        conicalSpread            : number;
        conicalSpreadDistribution: string;
        conicalSpreadSigma       : number;
    };
}
class DefaultParticleEmitter
{
    private offsetTime: number;
    private bursting: number;
    forceCreation: boolean;
    usePrediction: boolean;

    emittance: {
        // emit every '1/rate' seconds, after a delay of 'delay' seconds.
        delay: number;
        rate: number;

        // at each emit event, emit between burstMin and burstMax particles.
        burstMin: number;
        burstMax: number;
    };

    particle: {
        // range of animation texture to use.
        animationRange: FloatArray;

        // emit particles with life time between min and max.
        lifeTimeMin: number;
        lifeTimeMax: number;

        // emit particles with this user data.
        userData: number;
    };

    position: {
        // emit particles at this position.
        position: FloatArray;

        // if spherical, emit within a sphere of the position.
        // otherwise within a disc whose normal is specified.
        spherical: boolean;
        normal: FloatArray;

        // emit within min and max radius of position.
        radiusMin: number;
        radiusMax: number;
        // and using the following distribution 'uniform'/'normal' using given sigma.
        radiusDistribution: string;
        radiusSigma: number;
    };

    velocity: {
        // emit particles in this direction (spherical coordinates)
        theta: number;
        phi: number;

        // emit with a speed between min and max.
        speedMin: number;
        speedMax: number;

        // emit in a flat spread of given angular range.
        flatSpread: number;
        // and with the flat spread at a given angle from direction.
        flatSpreadAngle: number;
        // using given distribution.
        flatSpreadDistribution: string;
        flatSpreadSigma: number;

        // emit about a cone after flat spread of given angular range.
        conicalSpread: number;
        // using given distribution.
        conicalSpreadDistribution: string;
        conicalSpreadSigma: number;
    };

    enabled: boolean;

    static template = {
        forceCreation: false,
        usePrediction: true,
        emittance: {
            delay   : 0,
            rate    : 4,
            burstMin: 1,
            burstMax: 1
        },
        particle: {
            lifeTimeMin: 1,
            lifeTimeMax: 1,
            userData   : 0
        },
        position: {
            position          : [0, 0, 0],
            spherical         : true,
            normal            : [0, 1, 0],
            radiusMin         : 0,
            radiusMax         : 0,
            radiusDistribution: "uniform",
            radiusSigma       : 0.25
        },
        velocity: {
            theta                    : 0,
            phi                      : 0,
            speedMin                 : 1,
            speedMax                 : 1,
            flatSpread               : 0,
            flatSpreadAngle          : 0,
            flatSpreadDistribution   : "uniform",
            flatSpreadSigma          : 0.25,
            conicalSpread            : 0,
            conicalSpreadDistribution: "uniform",
            conicalSpreadSigma       : 0.25
        }
    };
    static compressArchetype(archetype: DefaultEmitterArchetype): any
    {
        return ParticleManager.recordDelta(DefaultParticleEmitter.template, archetype);
    }
    static parseArchetype(error: BuildError, delta: any): DefaultEmitterArchetype
    {
        if (Types.isNullUndefined(delta))
        {
            return Types.copy(DefaultParticleEmitter.template);
        }

        if (!Types.isObject(delta))
        {
            error.error("emitter archetype should be an object");
            return null;
        }

        function checkV3(n, field=""): (any) => FloatArray
        {
            return Parser.checkVector.bind(null, error, "default emitter archetype" + field, n, 3);
        }
        function checkNumber(n, field=""): (any) => number
        {
            return Parser.checkNumber.bind(null, error, "default emitter archetype" + field, n);
        }
        function checkBoolean(n, field=""): (any) => boolean
        {
            return Parser.checkBoolean.bind(null, error, "default emitter archetype" + field, n);
        }
        function checkDistribution(n, field=""): (any) => string
        {
            return function (val: any): string
            {
                val = Parser.checkString(error, "default emitter archetype" + field, n, val);
                if (val && (val !== "uniform" && val !== "normal"))
                {
                    error.error("Unknown distribution type, should be 'uniform' or 'normal'");
                    return null;
                }
                return val;
            };
        }
        function val<R>(x: R): () => R
        {
            return function () { return x; };
        }
        function maybe<R>(delta, n, x: (string) => (any) => R, y: () => R): R
        {
            return Parser.maybeField(delta, n, x(n), y);
        }

        Parser.extraFields(error, "default emitter archetype", delta,
           ["forceCreation", "usePrediction", "emittance", "particle", "position", "velocity"]);

        return {
            forceCreation: maybe(delta, "forceCreation", checkBoolean, val(false)),
            usePrediction: maybe(delta, "usePrediction", checkBoolean, val(true)),
            emittance    : Parser.maybeField(delta, "emittance", function (delta)
            {
                if (Types.isNullUndefined(delta))
                {
                    return Types.copy(DefaultParticleEmitter.template.emittance);
                }
                if (!Types.isObject(delta))
                {
                    error.error("default emitter archetype emittance should be an object");
                    return null;
                }

                function checkNum(n): (any) => number
                {
                    return checkNumber(n, " emittance");
                }

                Parser.extraFields(error, "default emitter archetype emittance", delta,
                    ["delay", "rate", "burstMin", "burstMax"]);

                return {
                    delay   : maybe(delta, "delay"   , checkNum, val(0)),
                    rate    : maybe(delta, "rate"    , checkNum, val(4)),
                    burstMin: maybe(delta, "burstMin", checkNum, val(1)),
                    burstMax: maybe(delta, "burstMax", checkNum, val(1))
                };
            }, Types.copy.bind(null, DefaultParticleEmitter.template.emittance)),
            particle: Parser.maybeField(delta, "particle", function (delta)
            {
                if (Types.isNullUndefined(delta))
                {
                    return Types.copy(DefaultParticleEmitter.template.particle);
                }
                if (!Types.isObject(delta))
                {
                    error.error("default emitter archetype particle should be an object");
                    return null;
                }

                function checkNum(n): (any) => number
                {
                    return checkNumber(n, " particle");
                }

                Parser.extraFields(error, "default emitter archetype particle", delta,
                    ["lifeTimeMin", "lifeTimeMax", "userData"]);

                return {
                    lifeTimeMin: maybe(delta, "lifeTimeMin", checkNum, val(1)),
                    lifeTimeMax: maybe(delta, "lifeTimeMax", checkNum, val(1)),
                    userData   : maybe(delta, "userData"   , checkNum, val(0))
                };
            }, Types.copy.bind(null, DefaultParticleEmitter.template.particle)),
            position: Parser.maybeField(delta, "position", function (delta)
            {
                if (Types.isNullUndefined(delta))
                {
                    return Types.copy(DefaultParticleEmitter.template.position);
                }
                if (!Types.isObject(delta))
                {
                    error.error("default emitter archetype position should be an object");
                    return null;
                }

                function checkNum(n): (any) => number
                {
                    return checkNumber(n, " position");
                }
                function checkDist(n): (any) => string
                {
                    return checkDistribution(n, " position");
                }
                function checkVec3(n): (any) => FloatArray
                {
                    return checkV3(n, " position");
                }
                function checkBool(n): (any) => boolean
                {
                    return checkBoolean(n, " position");
                }

                Parser.extraFields(error, "default emitter archetype position", delta,
                    ["position", "spherical", "normal", "radiusMin", "radiusMax",
                     "radiusDistribution", "radiusSigma"]);

                return {
                    position          : maybe(delta, "position"          , checkVec3, VMath.v3BuildZero),
                    spherical         : maybe(delta, "spherical"         , checkBool, val(false)),
                    normal            : maybe(delta, "normal"            , checkVec3, VMath.v3BuildYAxis),
                    radiusMin         : maybe(delta, "radiusMin"         , checkNum , val(0)),
                    radiusMax         : maybe(delta, "radiusMax"         , checkNum , val(0)),
                    radiusDistribution: maybe(delta, "radiusDistribution", checkDist, val("uniform")),
                    radiusSigma       : maybe(delta, "radiusSigma"       , checkNum , val(0.25))
                };
            }, Types.copy.bind(null, DefaultParticleEmitter.template.position)),
            // Typescript compiler infers this next field as type {} erroneously... siigh.
            velocity: <any>Parser.maybeField(delta, "velocity", function (delta)
            {
                if (Types.isNullUndefined(delta))
                {
                    return Types.copy(DefaultParticleEmitter.template.velocity);
                }
                if (!Types.isObject(delta))
                {
                    error.error("default emitter archetype velocity should be an object");
                    return null;
                }

                function checkNum(n)
                {
                    return checkNumber(n, " velocity");
                }
                function checkDist(n)
                {
                    return checkDistribution(n, " velocity");
                }

                Parser.extraFields(error, "default emitter archetype velocity", delta,
                    ["theta", "phi", "speedMin", "speedMax", "flatSpread", "flatSpreadAngle",
                     "flatSpreadDistribution", "flatSpreadSigma", "conicalSpread", "conicalSpreadDistribution",
                     "conicalSpreadSigma"]);

                return {
                    theta              : maybe(delta, "theta"              , checkNum , val(0)),
                    phi                : maybe(delta, "phi"                , checkNum , val(0)),
                    speedMin           : maybe(delta, "speedMin"           , checkNum , val(1)),
                    speedMax           : maybe(delta, "speedMax"           , checkNum , val(1)),
                    flatSpread         : maybe(delta, "flatSpread"         , checkNum , val(0)),
                    flatSpreadAngle    : maybe(delta, "flatSpreadAngle"    , checkNum , val(0)),
                    flatDistribution   : maybe(delta, "flatDistribution"   , checkDist, val("uniform")),
                    flatSigma          : maybe(delta, "flatSigma"          , checkNum , val(0.25)),
                    conicalSpread      : maybe(delta, "conicalSpread"      , checkNum , val(0)),
                    conicalDistribution: maybe(delta, "conicalDistribution", checkDist, val("uniform")),
                    conicalSigma       : maybe(delta, "conicalSigma"       , checkNum , val(0.25))
                };
            }, Types.copy.bind(null, DefaultParticleEmitter.template.velocity))
        };
    }
    applyArchetype(archetype, animationRange)
    {
        this.forceCreation = archetype.forceCreation;
        this.usePrediction = archetype.usePrediction;
        Types.copyFields(archetype.emittance, this.emittance);
        Types.copyFields(archetype.particle, this.particle);
        VMath.v2Copy(animationRange, this.particle.animationRange);
        Types.copyFields(archetype.position, this.position);
        Types.copyFields(archetype.velocity, this.velocity);
    }

    reset(): void
    {
        this.bursting = null;
    }

    static eventPool = [];
    static eventFun(event, emitter, system)
    {
        system.createParticle(event.particle);
        DefaultParticleEmitter.eventPool.push(event);
    }
    static recycleFun(event)
    {
        DefaultParticleEmitter.eventPool.push(event);
    }

    sync(emitter: DefaultParticleSynchronizer, system: ParticleSystem, timeStep: number): void
    {
        var particle = this.particle;
        var emittance = this.emittance;
        var position = this.position;
        var velocity = this.velocity;

        // timeLapse is the amount of time that has passed
        // since the cue for the next particle generation.
        //
        // numGen is the total number of particles that need to be
        // created retrospectively.
        var timeLapse = timeStep + this.offsetTime;
        var numGen = Math.ceil(timeLapse * emittance.rate);
        this.offsetTime += timeStep - (Math.max(0, numGen) / emittance.rate);
        if (numGen <= 0)
        {
            return;
        }
        else if (this.bursting !== null)
        {
            numGen = Math.min(numGen, this.bursting);
        }

        if (this.bursting !== null)
        {
            this.bursting -= numGen;
            if (this.bursting === 0)
            {
                this.bursting = null;
                this.enabled = false;
            }
        }

        // startGen is the number of particles we `skip` based on max life time
        // that have already died.
        var maxLife = particle.lifeTimeMax;
        var startGen = Math.max(0, Math.ceil((timeLapse - maxLife) * emittance.rate));
        if (startGen >= numGen)
        {
            return;
        }

        var pSigmaSqr = position.radiusSigma * position.radiusSigma;
        var pSigmaRecip = 1 / Math.sqrt(pSigmaSqr * 2 * Math.PI);
        var pSigmaMin = pSigmaRecip * Math.exp(-1 / (2 * pSigmaSqr));

        var cSigmaSqr = velocity.conicalSpreadSigma * velocity.conicalSpreadSigma;
        var cSigmaRecip = 1 / Math.sqrt(cSigmaSqr * 2 * Math.PI);
        var cSigmaMin = cSigmaRecip * Math.exp(-1 / (2 * cSigmaSqr));
        var cSpreadCoef = 2 * velocity.conicalSpread / Math.PI;

        var fSigmaSqr = velocity.flatSpreadSigma * velocity.flatSpreadSigma;
        var fSigmaRecip = 1 / Math.sqrt(fSigmaSqr * 2 * Math.PI);
        var fSigmaMin = fSigmaRecip * Math.exp(-1 / (2 * fSigmaSqr));

        var eventPool = DefaultParticleEmitter.eventPool;

        var sin    = Math.sin;
        var cos    = Math.cos;
        var acos   = Math.acos;
        var random = Math.random;
        var exp    = Math.exp;
        var pow    = Math.pow;
        var sqrt   = Math.sqrt;
        var PI     = Math.PI;

        var i;
        for (i = startGen; i < numGen; i += 1)
        {
            var burstCount = emittance.burstMin + random() * (emittance.burstMax - emittance.burstMin);
            var j;
            for (j = 0; j < burstCount; j += 1)
            {
                // compute relative creation and death times for specific generated particle
                // using real randomised time, and discard if already dead.
                var creationTime = (i / emittance.rate) - timeLapse;
                var lifeTime = particle.lifeTimeMin + random() * (particle.lifeTimeMax - particle.lifeTimeMin);
                if (creationTime + lifeTime <= 0)
                {
                    continue;
                }

                var event;
                if (eventPool.length != 0)
                {
                    event = eventPool.pop();
                }
                else
                {
                    event = {
                        particle: {
                            position: new Float32Array(3),
                            velocity: new Float32Array(3),
                            animationRange: new Float32Array(2)
                        },
                        fun    : DefaultParticleEmitter.eventFun,
                        recycle: DefaultParticleEmitter.recycleFun
                    };
                }
                event.time = creationTime;
                var part = event.particle;
                var pos  = part.position;
                var vel  = part.velocity;
                var anim = part.animationRange;
                part.lifeTime = lifeTime + creationTime;
                part.forceCreation = this.forceCreation;
                part.userData = particle.userData | system.renderer.createUserDataSeed() |
                                                    system.updater.createUserDataSeed();

                var y0, y1, y2, rand;
                var ctheta, cphi, rad;
                var theta, phi, sint, cost, sinp, cosp;
                pos[0] = position.position[0];
                pos[1] = position.position[1];
                pos[2] = position.position[2];
                rand = 0;
                switch (position.radiusDistribution)
                {
                    case "uniform":
                        rand = random();
                        break;
                    case "normal":
                        rand = random();
                        rand = pSigmaRecip * exp(-rand * rand / (2 * pSigmaSqr));
                        // normalise to [0, 1]
                        rand = (rand - pSigmaMin) / (pSigmaRecip - pSigmaMin);
                        break;
                }
                if (position.spherical)
                {
                    // uniform distribution of spherical angles in sphere.
                    theta = acos(1 - (random() * 2));
                    phi   = random() * (PI * 2);
                    sint  = sin(theta);
                    cost  = cos(theta);
                    sinp  = sin(phi);
                    cosp  = cos(phi);

                    // Re-distribute radius for volume element.
                    rand = pow(rand, 1 / 3);
                    rad = position.radiusMin + rand * (position.radiusMax - position.radiusMin);

                    pos[0] += cosp * sint * rad;
                    pos[1] += cost * rad;
                    pos[2] += sinp * sint * rad;
                }
                else
                {
                    // Re-distribute radius for area element.
                    rand = sqrt(rand);
                    rad = position.radiusMin + rand * (position.radiusMax - position.radiusMin);

                    var rx, rz;
                    var tx, ty, tz;
                    var normal = position.normal;
                    var nx = normal[0];
                    var ny = normal[1];
                    var nz = normal[2];
                    if (nx == 0 && nz == 0)
                    {
                        rx = tz = rad;
                        rz = tx = ty = 0;
                    }
                    else
                    {
                        var rec = rad / sqrt(nx * nx + nz * nz);
                        rx = -nz * rec;
                        rz = nx * rec;

                        tx = -rz * ny;
                        ty = (rz * nx) - (rx * nz);
                        tz = rx * ny;
                        rec = rad / sqrt(tx * tx + ty * ty + tz * tz);
                        tx *= rec;
                        ty *= rec;
                        tz *= rec;
                    }

                    // Uniform angle around disc.
                    theta = random() * PI * 2;
                    cost = cos(theta);
                    sint = sin(theta);

                    pos[0] += rx * cost + tx * sint;
                    pos[1] += ty * sint;
                    pos[2] += rz * cost + tz * sint;
                }

                phi   = velocity.phi;
                theta = velocity.theta;
                sint  = sin(theta);
                cost  = cos(theta);
                sinp  = sin(phi);
                cosp  = cos(phi);

                // local y-axis becomes target direction after circular spread
                // and base direction rotation.
                if (velocity.conicalSpread !== 0)
                {
                    rand = 0;
                    switch (velocity.conicalSpreadDistribution)
                    {
                        case "uniform":
                            rand = random();
                            break;
                        case "normal":
                            rand = random();
                            rand = cSigmaRecip * exp(-rand * rand / (2 * cSigmaSqr));
                            // normalise to [0,1]
                            rand = (rand - cSigmaMin) / (cSigmaRecip - cSigmaMin);
                            break;
                    }
                    // Massage ctheta so that the spherical sampling is uniform on the surface of a sphere.
                    ctheta = acos(1 - rand * cSpreadCoef);
                    cphi   = random() * (PI * 2);
                    var csint  = sin(ctheta);
                    var ccost  = cos(ctheta);
                    var csinp  = sin(cphi);
                    var ccosp  = cos(cphi);
                    var r0     = ccosp * csint;
                    var r1     = (cost * r0) + (sint * ccost);
                    var r2     = csinp * csint;
                    var r3     = csinp * ccost;
                    var r4     = ccosp * ccost;
                    var r5     = (cost * r4) - (sint * csint);
                    // spherical rotation by ctheta, cphi of y-axis (0,1,0)
                    // followed by spherical rotation by theta, phi
                    y0 = ((cosp * r1) - (sinp * r2));
                    y1 = ((cost * ccost) - (sint * r0));
                    y2 = ((sinp * r1) + (cosp * r2));
                }
                else
                {
                    // spherical rotation by theta, phi of y-axis (0,1,0)
                    y0 = cosp * sint;
                    y1 = cost;
                    y2 = sinp * sint;
                }

                // directional spreads
                // rotate around (base-rotated) z-axis for vertical spread of y
                var d, s, c, C, y0n, y1n, cs;
                if (velocity.flatSpread !== 0)
                {
                    rand = 0;
                    switch (velocity.flatSpreadDistribution)
                    {
                        case "uniform":
                            rand = (random() - 0.5) * 2.0;
                            break;
                        case "normal":
                            var frand = (random() - 0.5) * 2.0;
                            rand = fSigmaRecip * exp(-frand * frand / (2 * fSigmaSqr));
                            // normalise to [0,1]
                            rand = (rand - fSigmaMin) / (fSigmaRecip - fSigmaMin);
                            // negate if required, bringing range to [-1, 1]
                            if (frand < 0) rand = -rand;
                            break;
                    }
                    d  = rand * velocity.flatSpread;
                    s  = sin(d);
                    c  = cos(d);
                    C  = 1 - c;
                    cs = cosp * s;
                    var csC = cosp * sinp * C;
                    var ss  = sinp * s;
                    y0n = (sinp * sinp * C + c) * y0 - (csC * y2 + cs * y1);
                    y1n = (cs * y0) + (c * y1) + (ss * y2);
                    y2  = (cosp * cosp * C + c) * y2 - (csC * y0 + ss * y1);
                    y0  = y0n;
                    y1  = y1n;
                }
                // rotate around (base-rotated) y-axis for direction of spread
                if (velocity.flatSpreadAngle !== 0)
                {
                    d  = velocity.flatSpreadAngle;
                    s  = sin(d);
                    c  = cos(d);
                    C  = 1 - c;
                    var x0 = cosp * sint;
                    var x2 = sinp * sint;
                    var x0C  = x0 * C;
                    var x2C  = x2 * C;
                    var x0s  = x0 * s;
                    var x2s  = x2 * s;
                    var x20C = x2 * x0C;
                    var x2cC = x2C * cost;
                    var x0cC = x0C * cost;
                    cs  = cost * s;
                    y0n = (x0 * x0C + c) * y0 + (x0cC - x2s) * y1 + (x20C + cs) * y2;
                    y1n = (x0cC + x2s) * y0 + (cost * cost * C + c) * y1 + (x2cC - x0s) * y2;
                    y2  = (x2 * x2C + c) * y2 + (x2cC + x0s) * y1 + (x20C - cs) * y0;
                    y0  = y0n;
                    y1  = y1n;
                }
                var speed = velocity.speedMin + random() * (velocity.speedMax - velocity.speedMin);
                vel[0] = speed * y0;
                vel[1] = speed * y1;
                vel[2] = speed * y2;

                anim[0] = particle.animationRange[0];
                anim[1] = particle.animationRange[1];

                if (this.usePrediction)
                {
                    system.updater.predict(system.updateParameters, pos, vel, 0, -creationTime);
                    anim[0] = anim[1] - (anim[1] - anim[0]) * (1 + creationTime / lifeTime);
                }
                emitter.enqueue(event);
            }
        }
    }

    constructor() {}
    static create()
    {
        var template = DefaultParticleEmitter.template;

        var ret = new DefaultParticleEmitter();
        ret.emittance = Types.copy(template.emittance);
        ret.particle = Types.copy(template.particle);
        ret.particle.animationRange = [0, 1]; // not part of template.
        ret.position = Types.copy(template.position);
        ret.velocity = Types.copy(template.velocity);
        ret.forceCreation = template.forceCreation;
        ret.usePrediction = template.usePrediction;
        ret.enabled = false;
        ret.bursting = null;

        return ret;
    }

    enable(): void
    {
        this.enabled = true;
        this.offsetTime = -this.emittance.delay;
    }
    disable(): void
    {
        this.enabled = false;
    }
    burst(count = 1): void
    {
        this.enable();
        this.bursting = count;
    }
}


//
// ParticleArchetype
//
// (Complete, serializable description of a particle system)
//
interface ParticleArchetype
{
    system         : ParticleSystemArchetype;
    renderer       : { name: string };
    updater        : { name: string };
    synchronizer   : { name: string };
    animationSystem: string;
    packedTextures : Array<string>;
    particles: {
        [name: string]: {
            animation : string;
            tweaks    : { [name: string]: any };
            textureUVs: Array<Array<number>>;
            textures  : Array<Array<string>>;
        }
    };
    emitters: Array<{ name: string; particleName: string }>;

    // manager stored data.
    context: ParticleManagerContext;
}

interface ParticleManagerContext
{
    packed      : Array<Texture>;
    textures    : { [name: string]: Texture };
    definition  : ParticleSystemAnimation;
    renderer    : ParticleRenderer;
    updater     : ParticleUpdater;
    geometry    : ParticleGeometry;
    instances   : Array<ParticleInstance>;
    instancePool: Array<ParticleInstance>;
    systemPool  : Array<ParticleSystem>;
}

interface ParticleInstance
{
    archetype   : ParticleArchetype;
    system      : ParticleSystem;
    renderable  : ParticleRenderable;
    synchronizer: ParticleSynchronizer;

    // private
    queued      : boolean;
    creationTime: number;
    lazySystem  : () => ParticleSystem;
}

//
// ParticleManager
//
class ParticleManager
{
    // Cached geometry objects.
    // { [name: string]: (GraphicsDevice, number) => ParticleGeometry | ParticleGeometry }
    private geometries: { [name: string]: any };

    // Animation systems for ParticleBuilder compile.
    private systems: { [name: string]: any };

    // Particle animations for ParticleBuilder compile.
    private particles: { [name: string]: any };

    // ParticleRenderers.
    //   parseArchetype, compressArchetype definitions.
    //   preloader (preload assets a parsed archetype uses)
    //   geometry (the geometry type used)
    //   value (cached) : () => ParticleRenderer | ParticleRenderer
    private renderers: { [name: string]: {
                            parseArchetype   : (BuildError, any) => any;
                            compressArchetype: (any) => any;
                            preload          : (any, ShaderManager, TextureManager) => void;
                            value            : any;
                            geometry         : string } };

    // ParticleUpdaters.
    //   parseArchetype, compressArchetype definitions.
    //   preloader (preload assets a parsed archetype uses)
    //   value (cached) : () => ParticleUpdater | ParticleUpdater
    private updaters: { [name: string]: {
                          parseArchetype   : (BuildError, any) => any;
                          compressArchetype: (any) => any;
                          preload          : (any, ShaderManager, TextureManager) => void;
                          value            : any } };

    // ParticleSynchronizers.
    //   parseArchetype, compressArchetype definitions.
    //   value : () => ParticleSynchronizer
    private synchronizers: { [name: string]: {
                               parseArchetype   : (BuildError, any) => any;
                               compressArchetype: (any) => any;
                               value            : () => any;
                               pool             : Array<any> } };

    // ParticleEmitters.
    //   parseArchetype, compressArchetype definitions.
    //   value : () => ParticleEmitter
    private emitters: { [name: string]: {
                        parseArchetype   : (BuildError, any) => any;
                        compressArchetype: (any) => any;
                        value            : () => any;
                        pool             : Array<any>} };

    // ParticleArchetypes
    //  list of those initialised with the manager.
    private archetypes: Array<ParticleArchetype>;

    private systemContext: SharedRenderContext;
    private viewContext: SharedRenderContext;
    private getViewCb: () => ParticleView;
    private viewPool: Array<ParticleView>;

    private graphicsDevice: GraphicsDevice;
    private textureManager: TextureManager;
    private shaderManager: ShaderManager;

    private uniqueId = 0;
    private scene: Scene;
    private passIndex: number;
    private initialized: boolean = false;

    failOnWarnings = true;

    private time = 0;
    private timerCb: () => number;
    private queue: TimeoutQueue<ParticleInstance>;

    update(timeStep: number)
    {
        this.time += timeStep;

        var queue = this.queue;
        queue.update(timeStep);
        while (queue.hasNext())
        {
            var instance = queue.next();
            this.destroyInstance(instance, true);
        }
    }

    clear(archetype?)
    {
        var instances, count;
        if (!archetype)
        {
            this.queue.clear(this.clearQueueFun.bind(this));

            // Any remaining instances, not part of the queue.
            var archetypes = this.archetypes;
            var archetypeCount = archetypes.length;
            var i;
            for (i = 0; i < archetypeCount; i += 1)
            {
                instances = archetypes[i].context.instances;
                count = instances.length;
                while (count > 0)
                {
                    count -= 1;
                    this.destroyInstance(instances[count]);
                }
            }
        }
        else if (archetype.context)
        {
            // destroy individual instances of the archetype.
            instances = archetype.context.instances;
            count = instances.length;
            while (count > 0)
            {
                count -= 1;
                this.destroyInstance(instances[count]);
            }
        }
    }
    private clearQueueFun(instance)
    {
        this.destroyInstance(instance, true);
    }

    initialize(scene: Scene, passIndex: number)
    {
        this.scene = scene;
        this.passIndex = passIndex;
        this.initialized = true;
    }

    constructor() {}
    static create(graphicsDevice, textureManager, shaderManager)
    {
        var ret = new ParticleManager();
        ret.graphicsDevice = graphicsDevice;
        ret.textureManager = textureManager;
        ret.shaderManager = shaderManager;

        ret.renderers = {};
        ret.updaters = {};
        ret.systems = {};
        ret.particles = {};
        ret.synchronizers = {};
        ret.emitters = {};
        ret.geometries = {};
        ret.archetypes = [];

        ret.systemContext = SharedRenderContext.create({ graphicsDevice: graphicsDevice });
        ret.viewContext = SharedRenderContext.create({ graphicsDevice: graphicsDevice });

        ret.getViewCb = ret.getView.bind(ret);
        ret.viewPool = [];

        ret.queue = new TimeoutQueue();

        function preloadDefaultRenderer(defn)
        {
            shaderManager.load("shaders/particles-default-render.cgfx");
            if (defn.noiseTexture)
            {
                textureManager.load(defn.noiseTexture);
            }
        }

        ret.registerGeometry("default", function (gd, num)
            {
                return DefaultParticleRenderer.prototype.createGeometry(gd, num, true);
            });

        ret.registerRenderer("default",
                             DefaultParticleRenderer.parseArchetype,
                             DefaultParticleRenderer.compressArchetype,
                             DefaultParticleRenderer.preload,
                             DefaultParticleRenderer.create.bind(null, graphicsDevice, shaderManager, "alpha"),
                             "default");

        ret.registerRenderer("alpha",
                             DefaultParticleRenderer.parseArchetype,
                             DefaultParticleRenderer.compressArchetype,
                             DefaultParticleRenderer.preload,
                             DefaultParticleRenderer.create.bind(null, graphicsDevice, shaderManager, "alpha"),
                             "default");

        ret.registerRenderer("additive",
                             DefaultParticleRenderer.parseArchetype,
                             DefaultParticleRenderer.compressArchetype,
                             DefaultParticleRenderer.preload,
                             DefaultParticleRenderer.create.bind(null, graphicsDevice, shaderManager, "additive"),
                             "default");

        ret.registerRenderer("opaque",
                             DefaultParticleRenderer.parseArchetype,
                             DefaultParticleRenderer.compressArchetype,
                             DefaultParticleRenderer.preload,
                             DefaultParticleRenderer.create.bind(null, graphicsDevice, shaderManager, "opaque"),
                             "default");

        ret.registerUpdater("default",
                            DefaultParticleUpdater.parseArchetype,
                            DefaultParticleUpdater.compressArchetype,
                            DefaultParticleUpdater.preload,
                            DefaultParticleUpdater.create.bind(null, graphicsDevice, shaderManager));

        ret.registerAnimationSystem("default", [
            {
                name     : "color",
                type     : "float4",
                "default": [1.0, 1.0, 1.0, 1.0],
                min      : [0.0, 0.0, 0.0, 0.0],
                max      : [1.0, 1.0, 1.0, 1.0],
                storage  : "direct"
            },
            {
                name     : "scale",
                type     : "float2",
                "default": [1.0, 1.0]
            },
            {
                name     : "rotation",
                type     : "float",
                "default": 0.0
            },
            {
                name     : "frame",
                type     : "texture0",
                "default": 0
            }
        ]);

        ret.registerParticleAnimation({
            name: "default",
            animation: [{}]
        });

        ret.registerSynchronizer("default",
                                 DefaultParticleSynchronizer.parseArchetype,
                                 DefaultParticleSynchronizer.compressArchetype,
                                 DefaultParticleSynchronizer.create.bind(null, {}));

        ret.registerEmitter("default",
                            DefaultParticleEmitter.parseArchetype,
                            DefaultParticleEmitter.compressArchetype,
                            DefaultParticleEmitter.create);

        ret.timerCb = function () {
            return ret.time;
        };

        return ret;
    }

    gatherInstanceMetrics(archetype?)
    {
        var time = this.timerCb();
        var metrics, count, i;
        if (archetype)
        {
            if (!archetype.context)
            {
                return [];
            }
            else
            {
                metrics = [];
                var instances = archetype.context.instances;
                count = instances.length;
                for (i = 0; i < count; i += 1)
                {
                    var instance = instances[i];
                    metrics.push({
                        instance : instance,
                        allocated: (<boolean><any>instance.system),
                        active   : instance.system && instance.system.lastTime === time
                    });
                }
                return metrics;
            }
        }
        else
        {
            var archetypes = this.archetypes;
            count = archetypes.length;
            metrics = [];
            for (i = 0; i < count; i += 1)
            {
                metrics = metrics.concat(this.gatherInstanceMetrics(archetypes[i]));
            }
            return metrics;
        }
    }

    gatherMetrics(archetype?)
    {
        var time = this.timerCb();
        var metrics, context, i;
        if (archetype)
        {
            if (!archetype.context)
            {
                return {
                    numPooledSystems     : 0,
                    numPooledInstances   : 0,
                    numActiveInstances   : 0,
                    numAllocatedInstances: 0,
                    numInstances         : 0
                };
            }
            else
            {
                var context = archetype.context;
                var instances = context.instances;
                var count = instances.length;
                metrics = {
                    numPooledSystems     : context.systemPool.length,
                    numPooledInstances   : context.instancePool.length,
                    numActiveInstances   : 0,
                    numAllocatedInstances: 0,
                    numInstances         : count
                };
                for (i = 0; i < count; i += 1)
                {
                    var instance = instances[i];
                    if (instance.system)
                    {
                        metrics.numAllocatedInstances += 1;
                        if (instance.system.lastTime === time)
                        {
                            metrics.numActiveInstances += 1;
                        }
                    }
                }
                return metrics;
            }
        }
        else
        {
            var archetypes = this.archetypes;
            var archetypeCount = archetypes.length;
            metrics = {
                // global values.
                numInitializedArchetypes: archetypeCount,
                numPooledViews          : this.viewPool.length,
                numPooledSynchronizers  : 0,
                numPooledEmitters       : 0,

                // collective values
                numPooledSystems        : 0,
                numPooledInstances      : 0,
                numActiveInstances      : 0,
                numAllocatedInstances   : 0,
                numInstances            : 0
            };

            for (i = 0; i < archetypeCount; i += 1)
            {
                var ms = this.gatherMetrics(archetypes[i]);
                metrics.numPooledSystems      += ms.numPooledSystems;
                metrics.numPooledInstances    += ms.numPooledInstances;
                metrics.numActiveInstances    += ms.numActiveInstances;
                metrics.numAllocatedInstances += ms.numAllocatedInstances;
                metrics.numInstances          += ms.numInstances;
            }

            for (var f in this.emitters)
            {
                if (!this.emitters.hasOwnProperty(f))
                {
                    continue;
                }
                var emitter = this.emitters[f];
                metrics.numPooledEmitters += emitter.pool.length;
            }

            for (var f in this.synchronizers)
            {
                if (!this.synchronizers.hasOwnProperty(f))
                {
                    continue;
                }
                var synchronizer = this.synchronizers[f];
                metrics.numPooledSynchronizers += synchronizer.pool.length;
            }
        }

        return metrics;
    }

    private getGeometry(maxParticles: number, name?: string): ParticleGeometry
    {
        name = name || "default";
        if (!this.geometries.hasOwnProperty(name))
        {
            return null;
        }
        else
        {
            var geometry = this.geometries[name];
            if (typeof(geometry) === "function")
            {
                geometry = this.geometries[name] = geometry(this.graphicsDevice, maxParticles);
            }
            else
            {
                geometry.resize(maxParticles);
            }
            return geometry;
        }
    }
    registerGeometry(name: string, generator: ParticleGeometryFn): void
    {
        this.geometries[name] = generator;
    }

    private getRenderer(name?: string): ParticleRenderer
    {
        name = name || "default";
        if (!this.renderers.hasOwnProperty(name))
        {
            return null;
        }
        else
        {
            var renderer = this.renderers[name].value;
            if (typeof(renderer) === "function")
            {
                renderer = this.renderers[name].value = renderer();
            }
            return renderer;
        }
    }
    registerRenderer(name, parser, compressor, preloader, generator, geometry): void
    {
        this.renderers[name] = {
            parseArchetype   : parser,
            compressArchetype: compressor,
            preload          : preloader,
            value            : generator,
            geometry         : geometry
        };
    }

    private getUpdater(name?: string): ParticleUpdater
    {
        name = name || "default";
        if (!this.updaters.hasOwnProperty(name))
        {
            return null;
        }
        else
        {
            var updater = this.updaters[name].value;
            if (typeof(updater) === "function")
            {
                updater = this.updaters[name].value = updater();
            }
            return updater;
        }
    }
    registerUpdater(name, parser, compressor, preloader, generator): void
    {
        this.updaters[name] = {
            parseArchetype   : parser,
            compressArchetype: compressor,
            preload          : preloader,
            value            : generator
        };
    }

    private getAnimationSystem(name?: string): any
    {
        return this.systems[name || "default"];
    }
    registerAnimationSystem(name: string, definition: any): void
    {
        var error = new BuildError();
        var parsed = Parser.parseSystem(error, definition);
        if (!error.empty(this.failOnWarnings))
        {
            throw error.fail("System parse failed!");
        }
        this.systems[name] = parsed;
    }

    computeAnimationLifeTime(name?: string): any
    {
        var animation = this.getParticleAnimation(name).animation;
        var animCount = animation.length;
        var time = 0;
        var i;
        for (i = 0; i < animCount; i += 1)
        {
            time += animation[i].time;
        }
        return time;
    }

    private getParticleAnimation(name?: string): any
    {
        return this.particles[name || "default"];
    }
    registerParticleAnimation(definition: any): void
    {
        var error = new BuildError();
        var parsed = Parser.parseParticle(error, definition);
        if (!error.empty(this.failOnWarnings))
        {
            throw error.fail("Particle parse failed!");
        }
        this.particles[definition.name] = parsed;
    }

    private getEmitter(name?: string): any
    {
        name = name || "default";
        var emitter = this.emitters[name];
        var ret;
        if (emitter.pool.length > 0)
        {
            ret = emitter.pool.pop();
        }
        else
        {
            ret = emitter.value();
        }
        // store name for pooling.
        ret.name = name;
        return ret;
    }
    registerEmitter(name, parser, compressor, generator): void
    {
        this.emitters[name] = {
            parseArchetype   : parser,
            compressArchetype: compressor,
            value            : generator,
            pool             : []
        };
    }

    private getSynchronizer(name?: string): any
    {
        name = name || "default";
        var synchronizer = this.synchronizers[name];
        var ret;
        if (synchronizer.pool.length > 0)
        {
            ret = synchronizer.pool.pop();
        }
        else
        {
            ret = synchronizer.value();
        }
        // store name for pooling.
        ret.name = name;
        return ret;
    }
    registerSynchronizer(name, parser, compressor, generator): void
    {
        this.synchronizers[name] = {
            parseArchetype   : parser,
            compressArchetype: compressor,
            value            : generator,
            pool             : []
        };
    }

    preloadArchetype(archetype: ParticleArchetype): void
    {
        this.renderers[archetype.renderer.name].preload(archetype.renderer, this.shaderManager, this.textureManager);
        this.updaters [archetype.updater.name ].preload(archetype.updater,  this.shaderManager, this.textureManager);

        var packedTextures = archetype.packedTextures;
        var count = packedTextures.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            this.textureManager.load(packedTextures[i]);
        }

        var particles = archetype.particles;
        for (var f in archetype.particles)
        {
            if (!archetype.particles.hasOwnProperty(f))
            {
                continue;
            }

            var particle = particles[f];
            var textures = particle.textures;
            count = textures.length;
            for (i = 0; i < count; i += 1)
            {
                this.textureManager.load(textures[i]);
            }
        }
    }

    initializeArchetype(archetype: ParticleArchetype): void
    {
        if (!this.initialized)
        {
            throw "ParticleManager not initialized";
        }

        var context = archetype.context;
        if (context)
        {
            return;
        }

        context = <any>{};
        this.archetypes.push(archetype);

        var textureManager = this.textureManager;
        var system = this.getAnimationSystem(archetype.animationSystem);

        // Gather particle animations, tweaks, mappings and textures to pack.
        var textures = {};
        var mapping = {};
        var toPack  = {};
        var tweaks  = [];
        var animations = [], particle, count, i;
        count = archetype.packedTextures.length;
        for (i = 0; i < count; i += 1)
        {
            if (archetype.packedTextures[i])
            {
                mapping["texture" + i] = [];
                textures["texture" + i] = this.textureManager.get(archetype.packedTextures[i]);
            }
        }

        var j;
        for (var f in archetype.particles)
        {
            if (!archetype.particles.hasOwnProperty(f))
            {
                continue;
            }
            particle = archetype.particles[f];

            animations.push(this.getParticleAnimation(particle.animation));
            tweaks.push(particle.tweaks);

            var uvs = particle.textureUVs;
            var texs = particle.textures;
            count = Math.max(texs.length, uvs.length);
            for (i = 0; i < count; i += 1)
            {
                var maps = mapping["texture" + i];
                var packs = toPack["texture" + i];
                if (maps)
                {
                    maps.push(uvs[i]);
                }
                else if (packs || Parser.hasTextureIndex(system, i))
                {
                    if (!packs)
                    {
                        packs = toPack["texture" + i] = [];
                    }
                    packs.push(this.textureManager.get(texs[i]));
                }
            }
        }

        // pack any required textures
        var packed = [];
        for (var f in toPack)
        {
            if (!toPack.hasOwnProperty(f))
            {
                continue;
            }
            var index = parseInt(f.substr(7));
            var packing = ParticleBuilder.packTextures({
                graphicsDevice: this.graphicsDevice,
                textures      : toPack[f]
            });
            textures[f] = packing.texture;
            mapping[f] = packing.uvMap;
            packed.push(packing.texture);
        }

        // Stored so that on archetype descruction, they may be destroyed also.
        context.packed = packed;

        context.textures = textures;
        context.definition = ParticleBuilder.compile({
            graphicsDevice: this.graphicsDevice,
            system        : system,
            particles     : animations,
            alreadyParsed : true,
            uvMap         : mapping,
            tweaks        : tweaks
        });
        var renderer = archetype.renderer.name;
        context.renderer = this.getRenderer(renderer);
        context.updater  = this.getUpdater(archetype.updater.name);
        context.geometry = this.getGeometry(archetype.system.maxParticles, this.renderers[renderer].geometry);
        context.instances    = [];
        context.instancePool = [];
        context.systemPool   = [];
        archetype.context = context;
    }

    createInstance(archetype, timeout?)
    {
        this.initializeArchetype(archetype);
        var context = archetype.context;

        var pool = context.instancePool;
        var instance;
        if (pool.length > 0)
        {
            instance = pool.pop();
        }
        else
        {
            instance = this.createNewInstance(archetype);
        }
        this.buildSynchronizer(archetype, instance);

        instance.queued = (timeout !== undefined);
        instance.creationTime = this.timerCb();
        if (instance.queued)
        {
            this.queue.insert(instance, timeout);
        }
        context.instances.push(instance);

        var emitters = instance.synchronizer.emitters;
        var count = emitters.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            var emitter = emitters[i];
            if (instance.queued)
            {
                var emittance = emitter.emittance;
                var burstCount = emittance.rate * (timeout - emitter.particle.lifeTimeMax - emittance.delay);
                emitter.burst(burstCount);
            }
            else
            {
                emitter.enable();
            }
        }

        return instance;
    }

    static m43Identity = VMath.m43BuildIdentity();
    destroyInstance(instance, removedFromQueue=false)
    {
        var archetype = instance.archetype;
        var context = archetype.context;

        this.removeInstanceFromScene(instance);
        this.releaseSynchronizer(instance);

        var renderable = instance.renderable;
        renderable.releaseViews(this.viewPool.push.bind(this.viewPool));
        if (renderable.system)
        {
            context.systemPool.push(renderable.system);
            renderable.setSystem(null);
        }
        renderable.setLocalTransform(ParticleManager.m43Identity);

        instance.system = null;

        var instances = context.instances;
        instances.splice(instances.indexOf(instance), 1);
        context.instancePool.push(instance);

        if (instance.queued && !removedFromQueue)
        {
            this.queue.remove(instance);
        }
    }

    addInstanceToScene(instance, parent?)
    {
        var sceneNode = instance.sceneNode;
        if (sceneNode.isInScene())
        {
            this.removeInstanceFromScene(instance);
        }

        if (parent)
        {
            parent.addChild(sceneNode);
        }
        else
        {
            // XXX Bug in <0,27 prevents this working without work-around
            // setting worldExtentsUpdate to true on sceneNode
            this.scene.addRootNode(sceneNode);
        }
    }

    removeInstanceFromScene(instance)
    {
        var sceneNode = instance.sceneNode;
        if (sceneNode.isInScene())
        {
            if (sceneNode.getRoot() === sceneNode)
            {
                this.scene.removeRootNode(sceneNode);
            }
            else
            {
                var parent = sceneNode.getParent();
                if (parent)
                {
                    parent.removeChild(sceneNode);
                }
            }
        }
    }

    private getSystem(archetype, instance)
    {
        var context = archetype.context;
        var pool = context.systemPool;
        var system;
        if (pool.length > 0)
        {
            system = pool.pop();
            system.beginUpdate(0);
            system.reset();
            system.endUpdate();

            system.synchronizer = instance.synchronizer;
        }
        else
        {
            var template = archetype.system;
            system = ParticleSystem.create({
                graphicsDevice     : this.graphicsDevice,
                center             : template.center,
                halfExtents        : template.halfExtents,
                maxSpeed           : template.maxSpeed,
                maxParticles       : template.maxParticles,
                zSorted            : template.zSorted,
                maxSortSteps       : template.maxSortSteps,
                geometry           : context.geometry,
                sharedRenderContext: this.systemContext,
                maxLifeTime        : template.maxLifeTime,
                animation          : context.definition.animation,
                sharedAnimation    : true,
                timer              : this.timerCb,
                synchronizer       : instance.synchronizer,
                trackingEnabled    : template.trackingEnabled,
                updater            : context.updater,
                renderer           : context.renderer
            });

            context.updater .applyArchetype(this.textureManager, system, archetype.updater);
            context.renderer.applyArchetype(this.textureManager, system, archetype.renderer, context.textures);
            context.renderer.setAnimationParameters(system, context.definition);
        }
        instance.system = system;

        // Pretend that system was always being updated!
        system.reset(instance.creationTime);

        return system;
    }
    private getView()
    {
        var pool = this.viewPool;
        if (pool.length > 0)
        {
            return pool.pop();
        }
        else
        {
            return ParticleView.create({
                graphicsDevice: this.graphicsDevice,
                sharedRenderContext: this.viewContext
            });
        }
    }

    createNewInstance(archetype)
    {
        var instance = {
            archetype: archetype
        };
        this.buildParticleSceneNode(archetype, instance);
        return instance;
    }

    replaceArchetype(oldArchetype, newArchetype)
    {
        var context = oldArchetype.context;
        if (!context)
        {
            return;
        }

        this.initializeArchetype(newArchetype);
        var newContext = newArchetype.context;

        var instances = context.instances;
        var newInstances = newContext.instances;

        var count = instances.length;
        while (count > 0)
        {
            count -= 1;
            var instance = instances.pop();

            // Partially recycle instance.
            var parent = instance.sceneNode.getParent();
            this.removeInstanceFromScene(instance);

            this.releaseSynchronizer(instance);

            var renderable = instance.renderable;
            renderable.releaseViews(this.viewPool.push.bind(this.viewPool));
            if (renderable.system)
            {
                context.systemPool.push(renderable.system);
                renderable.setSystem(null);
            }
            instance.system = null;

            // Set up for new archetype.
            instance.archetype = newArchetype;
            var lazySystem = this.getSystem.bind(this, newArchetype, instance);
            renderable.setLazySystem(lazySystem, newArchetype.system.center, newArchetype.system.halfExtents);

            this.buildSynchronizer(newArchetype, instance);
            newInstances.push(instance);

            this.addInstanceToScene(instance, parent);
        }
    }

    destroy()
    {
        // Destroy all initialised archetypes and all their instances.
        var archetypes = this.archetypes;
        var count = archetypes.length;
        while (count > 0)
        {
            count -= 1;
            this.destroyArchetype(archetypes[count]);
        }

        // Destroy all geometries
        var geometries = this.geometries;
        for (var f in geometries)
        {
            if (!geometries.hasOwnProperty(f))
            {
                continue;
            }
            var geometry = geometries[f];
            if (typeof(geometry) !== "function")
            {
                geometry.destroy();
            }
        }
        this.geometries = null;

        // destroy all views
        var views = this.viewPool;
        count = views.length;
        while (count > 0)
        {
            count -= 1;
            views.pop().destroy();
        }
        this.viewPool = null;

        this.renderers = null;
        this.updaters = null;
        this.systems = null;
        this.particles = null;
        this.synchronizers = null;
        this.emitters = null;
        this.archetypes = null;

        this.systemContext.destroy();
        this.systemContext = null;
        this.viewContext.destroy();
        this.viewContext = null;
        this.queue = null;
    }

    destroyArchetype(archetype)
    {
        var context = archetype.context;
        if (!context)
        {
            return;
        }

        this.archetypes.splice(this.archetypes.indexOf(archetype), 1);

        var instances = context.instances;
        var count = instances.length;
        while (count > 0)
        {
            count -= 1;
            var instance = instances.pop();

            // Partially recycle instance.
            this.removeInstanceFromScene(instance);
            this.releaseSynchronizer(instance);
            var renderable = instance.renderable;
            renderable.releaseViews(this.viewPool.push.bind(this.viewPool));
            this.queue.remove(instance);
            if (renderable.system)
            {
                renderable.system.destroy();
            }
        }

        // Destroy all pooled systems.
        var systems = context.systemPool;
        count = systems.length;
        while (count > 0)
        {
            count -= 1;
            systems.pop().destroy();
        }

        // Destroy animation texture, and any run-time packed textures.
        context.definition.animation.destroy();
        var packed = context.packed;
        count = packed.length;
        while (count > 0)
        {
            count -= 1;
            packed.pop().destroy();
        }

        archetype.context = null;
    }

    private buildParticleSceneNode(archetype, instance)
    {
        var context = archetype.context;
        var renderable = ParticleRenderable.create({
            graphicsDevice: this.graphicsDevice,
            passIndex: this.passIndex,
            sharedRenderContext: this.viewContext
        });
        var lazySystem = this.getSystem.bind(this, archetype, instance);
        renderable.setLazySystem(lazySystem, archetype.system.center, archetype.system.halfExtents);
        renderable.setLazyView(this.getViewCb);

        var sceneNode = SceneNode.create({
            name: "ParticleManager_SceneNode_" + this.uniqueId,
            dynamic: true
        });
        this.uniqueId += 1;
        sceneNode.addRenderable(renderable);

        instance.renderable = renderable;
        instance.sceneNode = sceneNode;
    }

    private releaseSynchronizer(instance)
    {
        var synchronizer = instance.synchronizer;
        instance.synchronizer = null;
        synchronizer.renderable = null;
        if (instance.system)
        {
            instance.system.synchronizer = null;
        }
        var emitters = synchronizer.emitters;
        var count = emitters.length;
        while (count > 0)
        {
            count -= 1;
            var emitter = emitters[count];
            synchronizer.removeEmitter(emitter);

            emitter.reset();
            this.emitters[emitter.name].pool.push(emitter);
        }

        synchronizer.reset();
        this.synchronizers[synchronizer.name].pool.push(synchronizer);
    }

    private buildSynchronizer(archetype, instance)
    {
        var template: any = archetype.synchronizer;
        var context: any = archetype.context;

        var synchronizer = this.getSynchronizer(template.name);
        synchronizer.applyArchetype(template);
        synchronizer.renderable = instance.renderable;

        var archetypes = archetype.emitters;
        var count = archetypes.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            template = archetypes[i];
            var emitter = this.getEmitter(template.name);
            var index = 0;
            for (var f in archetype.particles)
            {
                if (!archetype.particles.hasOwnProperty(f))
                {
                    continue;
                }
                else if (f === template.particleName)
                {
                    break;
                }
                else
                {
                    index += 1;
                }
            }
            var animationRange = context.definition.particle[index].animationRange;
            emitter.applyArchetype(template, animationRange);
            emitter.enable();
            synchronizer.addEmitter(emitter);
        }

        instance.synchronizer = synchronizer;
    }

    serializeArchetype(archetype: ParticleArchetype): string
    {
        return JSON.stringify(this.compressArchetype(archetype));
    }

    deserializeArchetype(archetype: string): ParticleArchetype
    {
        return this.parseArchetype(JSON.parse(archetype));
    }

    compressArchetype(archetype: ParticleArchetype): any
    {
        var delta = null;
        var systemDelta = ParticleSystem.compressArchetype(archetype.system);
        if (systemDelta)
        {
            delta = delta || {};
            delta.system = systemDelta;
        }

        var rendererName     = archetype.renderer.name;
        var updaterName      = archetype.updater.name;
        var synchronizerName = archetype.synchronizer.name;
        var renderer     = this.renderers    [rendererName];
        var updater      = this.updaters     [updaterName];
        var synchronizer = this.synchronizers[synchronizerName];

        // delete extra name before compression of sub-archetypes.
        delete archetype.renderer.name;
        delete archetype.updater.name;
        delete archetype.synchronizer.name;

        var rendererDelta     = renderer    .compressArchetype(archetype.renderer);
        var updaterDelta      = updater     .compressArchetype(archetype.updater);
        var synchronizerDelta = synchronizer.compressArchetype(archetype.synchronizer);

        // Add back again to avoid destroying archetype.
        archetype.renderer.name     = rendererName;
        archetype.updater.name      = updaterName;
        archetype.synchronizer.name = synchronizerName;

        if (rendererDelta || rendererName !== "default")
        {
            delta = delta || {};
            delta.renderer = rendererDelta || {};
            if (rendererName !== "default")
            {
                delta.renderer.name = rendererName;
            }
        }
        if (updaterDelta || updaterName !== "default")
        {
            delta = delta || {};
            delta.updater = updaterDelta || {};
            if (updaterName !== "default")
            {
                delta.updater.name = updaterName;
            }
        }
        if (synchronizerDelta || synchronizerName !== "default")
        {
            delta = delta || {};
            delta.synchronizer = synchronizerDelta || {};
            if (synchronizerName !== "default")
            {
                delta.synchronizer.name = synchronizerName;
            }
        }

        var packedTextures = archetype.packedTextures;
        var count = packedTextures.length;
        var i;
        if (count !== 0)
        {
            delta = delta || {};
        }
        for (i = 0; i < count; i += 1)
        {
            if (packedTextures[i])
            {
                delta["packedTexture" + (i || "")] = packedTextures[i];
            }
        }

        if (archetype.animationSystem !== "default")
        {
            delta = delta || {};
            delta.animationSystem = archetype.animationSystem;
        }

        var particles = archetype.particles;
        for (var p in particles)
        {
            if (!particles.hasOwnProperty(p))
            {
                continue;
            }
            delta = delta || {};
            delta.particles = delta.particles || {};

            var particle = particles[p];
            var outParticle = null;
            if (particle.animation !== "default")
            {
                outParticle = outParticle || {};
                outParticle.animation = particle.animation;
            }

            for (var t in particle.tweaks)
            {
                if (particle.tweaks.hasOwnProperty(t))
                {
                    outParticle = outParticle || {};
                    outParticle.tweaks = Types.copy(particle.tweaks);
                    break;
                }
            }

            var textures = particle.textures;
            count = textures.length;
            if (count !== 0)
            {
                outParticle = outParticle || {};
            }
            for (i = 0; i < count; i += 1)
            {
                if (textures[i])
                {
                    outParticle["texture" + (i || "")] = textures[i];
                }
            }

            var textureUVs = particle.textureUVs;
            count = textureUVs.length;
            for (i = 0; i < count; i += 1)
            {
                var uv = textureUVs[i];
                if (uv && !(uv[0] === 0 && uv[1] === 0 && uv[2] === 1 && uv[3] === 1))
                {
                    outParticle = outParticle || {};
                    outParticle["texture-uv" + (i || "")] = Types.copy(uv);
                }
            }

            delta.particles[p] = outParticle;
        }

        var emitters = archetype.emitters;
        count = emitters.length;
        if (count !== 0)
        {
            delta = delta || {};
            delta.emitters = [];
        }
        for (i = 0; i < count; i += 1)
        {
            var emitter = emitters[i];

            var emitterName = emitter.name;
            var emitterParticleName = emitter.particleName;

            // remove extra fields before sub-compression.
            delete emitter.name;
            delete emitter.particleName;

            var outEmitter = this.emitters[emitterName].compressArchetype(emitter);
            outEmitter.name = emitterName;

            // Add back again to avoid destroying archetype
            emitter.name         = emitterName;
            emitter.particleName = emitterParticleName;

            if (emitterName !== "default")
            {
                outEmitter.name = emitterName;
            }

            delta.emitters.push(outEmitter);
        }

        return delta;
    }

    parseArchetype(delta: any): ParticleArchetype
    {
        var rendererName     = (delta && delta.renderer     && delta.renderer.name)     || "default";
        var updaterName      = (delta && delta.updater      && delta.updater.name)      || "default";
        var synchronizerName = (delta && delta.synchronizer && delta.synchronizer.name) || "default";
        var renderer     = this.renderers    [rendererName];
        var updater      = this.updaters     [updaterName];
        var synchronizer = this.synchronizers[synchronizerName];

        if (!renderer)
        {
            throw "Renderer with name " + rendererName + " has not been registered with manager";
        }
        if (!updater)
        {
            throw "Renderer with name " + updaterName + " has not been registered with manager";
        }
        if (!synchronizer)
        {
            throw "Renderer with name " + synchronizerName + " has not been registered with manager";
        }

        // delete extra name fields before parsing sub-archetypes.
        if (delta && delta.renderer)
        {
            delete delta.renderer.name;
        }
        if (delta && delta.updater)
        {
            delete delta.updater.name;
        }
        if (delta && delta.synchronizer)
        {
            delete delta.synchronizer.name;
        }

        var error = new BuildError();
        function checkString(n): (any) => string
        {
            return Parser.checkString.bind(null, error, "archetype", n);
        }
        function val<R>(x: R): () => R
        {
            return function () { return x; };
        }
        function maybe<R>(delta, n, x: (string) => (any) => R, y: () => R): R
        {
            return Parser.maybeField(delta, n, x(n), y);
        }

        var animationSystem = !delta ? "default" : maybe(delta, "animationSystem", checkString, val("default"));
        var parsedSystem = this.getAnimationSystem(animationSystem);
        if (!parsedSystem)
        {
            error.error("Archetype references animation system '" + animationSystem + "' not registered with manager");
        }

        var packedTextures = [];
        if (delta)
        {
            for (var f in delta)
            {
                if (!delta.hasOwnProperty(f) || f.substr(0, 13) !== "packedTexture")
                {
                    continue;
                }

                var index = parseFloat(f.substr(13) || "0");
                if ((index | 0) !== index || index < 0)
                {
                    error.error("Archetype packedTexture index must be an integer >= 0 for " + f);
                }
                else if (parsedSystem && !Parser.hasTextureIndex(parsedSystem, index))
                {
                    error.warning("Archetype specifies " + f + ", but system animation " +
                                  "specifies no attribute requiring " + f + ". Field will be ignored");
                }
                else
                {
                    packedTextures[index] = checkString(f)(delta[f]);
                }
            }
        }

        var self = this;
        var archetype = {
            system         : ParticleSystem.parseArchetype(error, delta && delta.system),
            renderer       : renderer      .parseArchetype(error, delta && delta.renderer),
            updater        : updater       .parseArchetype(error, delta && delta.updater),
            synchronizer   : synchronizer  .parseArchetype(error, delta && delta.synchronizer),
            animationSystem: animationSystem,
            packedTextures : packedTextures,
            particles      : !delta ? {} : Parser.maybeField(delta, "particles", function (particles)
            {
                var ret = {};
                for (var p in particles)
                {
                    if (!particles.hasOwnProperty(p))
                    {
                        continue;
                    }

                    var particle = particles[p];
                    if (Types.isNullUndefined(particle))
                    {
                        ret[p] = {
                            animation : "default",
                            tweaks    : {},
                            textureUVs: [],
                            textures  : []
                        };
                        continue;
                    }

                    var animation = particle.animation;
                    if (!Types.isNullUndefined(animation) &&
                        !Types.isString(animation) &&
                        !Types.isObject(animation))
                    {
                        error.error("Archetype particle animation should be a string name referencing a " +
                                    "registered particle animation for particle '" + p + "'");
                    }

                    var tweaks = particle.tweaks || {};

                    var parsedParticle = self.getParticleAnimation(animation);
                    if (!parsedParticle)
                    {
                        error.error("Archetype particle animation '" + animation + "' has not been registered " +
                                    "with the manager");
                    }
                    else if(parsedSystem)
                    {
                        ParticleBuilder.checkAttributes(error, parsedParticle, parsedSystem);
                    }

                    var extraFields = [];
                    var textures    = [];
                    var textureUVs  = [];
                    for (var f in particle)
                    {
                        if (!particle.hasOwnProperty(f))
                        {
                            continue;
                        }

                        var index;
                        if (f.substr(0, 10) === "texture-uv")
                        {
                            extraFields.push(f);
                            index = parseFloat(f.substr(10) || "0");
                            if ((index | 0) !== index || index < 0)
                            {
                                error.error("Archetype particle texture-uv index must be an integer >= 0 for " +
                                            "particle '" + p + "' " + f);
                            }
                            if (!packedTextures[index])
                            {
                                error.warning("Archetype particle specifies " + f + ", but archetype has not " +
                                              "specified a pre-packed texture for index. Field will be ignored");
                            }
                            else
                            {
                                textureUVs[index] =
                                    Parser.checkVector(error, "Archetype particle", f, 4, particle[f]);
                            }
                        }
                        else if (f.substr(0, 7) === "texture")
                        {
                            extraFields.push(f);
                            index = parseFloat(f.substr(7) || "0");
                            if ((index | 0) !== index || index < 0)
                            {
                                error.error("Archetype particle texture index must be an integer >= 0 for " +
                                            "particle '" + p + "' " + f);
                            }
                            if (packedTextures[index])
                            {
                                error.warning("Archetype particle specifies " + f + ", but archetype already" +
                                              "specified a pre-packed texture for index. Field will be ignored");
                            }
                            else if (parsedSystem && !Parser.hasTextureIndex(parsedSystem, index))
                            {
                                error.warning("Archetype particle specifies " + f + ", but system animation " +
                                              "specifies no attribute requiring " + f + ". Field will be ignored");
                            }
                            else
                            {
                                var tex = particle[f];
                                if (Types.isString(tex))
                                {
                                    textures[index] = tex;
                                }
                                else
                                {
                                    error.error("Archetype particle texture should be a string path for " +
                                                "particle '" + p + "' " + f);
                                }
                            }
                        }
                    }

                    Parser.extraFields(error, "Archetype particle '" + p + "'", particle,
                        ["animation", "tweaks"].concat(extraFields));

                    ret[p] = {
                        animation : particle.animation || "default",
                        tweaks    : tweaks,
                        textures  : textures,
                        textureUVs: textureUVs
                    };
                }
                return ret;
            }, val({})),
            emitters: !delta ? [] : Parser.maybeField(delta, "emitters", function (emitters)
            {
                function checkString(n): (any) => string
                {
                    return Parser.checkString.bind(null, error, "archetype emitter", n);
                }

                var ret = [];
                var count = emitters.length;
                var i;
                for (i = 0; i < count; i += 1)
                {
                    var emitter = emitters[i];
                    if (!emitter || !Types.isObject(emitter))
                    {
                        error.error("Archetype emitter must be an object");
                        continue;
                    }

                    var name = maybe(emitter, "name", checkString, val("default"));
                    var emitterDef = self.emitters[name];
                    if (!emitterDef)
                    {
                        throw "Emitter with name " + name + " has not been registered with manager";
                    }
                    var particleName = Parser.stringField(error, "Archetype emitter", emitter, "particleName");

                    // Delete extra fields from emitter before parsing sub-archetype.
                    delete emitter.name;
                    delete emitter.particleName;

                    var parsed = emitterDef.parseArchetype(error, emitter);
                    if (parsed)
                    {
                        parsed.name = name;
                        parsed.particleName = particleName;
                        ret.push(parsed);
                    }

                    // add back fields to avoid destroying original delta.
                    emitter.name = name;
                    emitter.particleName = particleName;
                }
                return ret;
            }, val([])),
            context: null
        };

        var particles = archetype.particles;
        var count = packedTextures.length;
        var i;
        for (i = 0; i < count; i += 1)
        {
            if (parsedSystem && Parser.hasTextureIndex(parsedSystem, i))
            {
                for (var p in particles)
                {
                    if (!particles.hasOwnProperty(p))
                    {
                        continue;
                    }
                    var particle = particles[p];

                    if (packedTextures[i])
                    {
                        if (!particle.textureUVs[i])
                        {
                            particle.textureUVs[i] = VMath.v4Build(0, 0, 1, 1);
                        }
                    }
                    else
                    {
                        if (!particle.textures[i])
                        {
                            particle.textures[i] = [null];
                        }
                    }
                }
            }
        }

        if (!error.empty(this.failOnWarnings))
        {
            throw error.fail("Archetype parse failed!");
        }

        archetype.renderer.name     = rendererName;
        archetype.updater.name      = updaterName;
        archetype.synchronizer.name = synchronizerName;

        // add names back to original delta to avoid destroying it.
        if (delta && delta.renderer)
        {
            delta.renderer.name = rendererName;
        }
        if (delta && delta.updater)
        {
            delta.updater.name = updaterName;
        }
        if (delta && delta.synchronizer)
        {
            delta.synchronizer.name = synchronizerName;
        }

        // Verify all emitters reference valid particles.
        // We do not require that all particles are referenced by emitters.
        var emitters = archetype.emitters;
        count = emitters.length;
        for (i = 0; i < count; i += 1)
        {
            var emitter = emitters[i];
            if (!archetype.particles.hasOwnProperty(emitter.particleName))
            {
                error.error("Emitter #" + i + " references non-existant particle of system '" +
                            emitter.particleName + "'");
            }
        }

        if (!error.empty(this.failOnWarnings))
        {
            throw error.fail("Archetype parse failed!");
        }

        return archetype;
    }

    // Build an object delta of the given object from a template.
    // Assumption that the object has a structure matching the template exactly except
    // that objects are permitted to have extra fields
    //
    // pseudo:
    // let delta t o = match type(t) with
    //    | Null | Undefined ->
    //         o
    //    | Array ->
    //         let del = zipWith delta t o in
    //         if (all (= null) del) then null else del
    //    | Object ->
    //         let o = filter(hasField t) o in
    //         let del = filter (.!= null) $ zipFieldsWith delta t o ^ filter(!hasField t) o
    //         if (del = {}) then null else del
    //    | Function ->
    //         let del = map (delta t()) o in
    //         if (all (= null) del) then null else del
    //    | _ ->
    //         if (t = o) then null else o
    //
    // eg:
    // delta {xs: function () { return {x: 10, y: [20, 30] }; }, y: null}
    //       {xs: [{x: 10, y: [20, 30]}, {x: 20, y: [10, 30]}, {x: 20, y: [20, 30]}], y: "hello"}
    //     = {xs: [null, {x: 20, y: [10, null]}, {x: 20}], y: "hello"}
    static recordDelta(template, obj)
    {
        var allZero = true;
        var count, i, delta;
        if (Types.isNullUndefined(template))
        {
            delta = Types.copy(obj);
            allZero = false;
        }
        else if (Types.isArray(template))
        {
            delta = [];
            count = template.length;
            for (i = 0; i < count; i += 1)
            {
                delta.push(this.recordDelta(template[i], obj[i]));
                if (!Types.isNullUndefined(delta[i]))
                {
                    allZero = false;
                }
            }
        }
        else if (Types.isObject(template))
        {
            allZero = true;
            delta = {};
            var f;
            for (f in template)
            {
                if (template.hasOwnProperty(f))
                {
                    var del = this.recordDelta(template[f], obj[f]);
                    if (!Types.isNullUndefined(del))
                    {
                        delta[f] = del;
                        allZero = false;
                    }
                }
            }
            for (f in obj)
            {
                if (obj.hasOwnProperty(f) && !template.hasOwnProperty(f))
                {
                    delta[f] = obj[f];
                }
            }
        }
        else if (Types.isFunction(template))
        {
            template = template();
            delta = [];
            count = obj.length;
            for (i = 0; i < count; i += 1)
            {
                delta.push(this.recordDelta(template, obj[i]));
                if (!Types.isNullUndefined(delta[i]))
                {
                    allZero = false;
                }
            }
        }
        else
        {
            delta = obj;
            allZero = template === obj;
        }
        return (allZero ? null : delta);
    }
}

