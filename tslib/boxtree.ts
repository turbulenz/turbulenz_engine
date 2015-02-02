// Copyright (c) 2012-2015 Turbulenz Limited

interface BoxTreeRay
{
    origin: any;    // v2
    direction: any; // v2
    maxFactor: number;
}

interface BoxTreeRayTestResult
{
    factor: number;
}

interface BoxTreeRayTestCallback
{
    (tree, externalNode, ray: BoxTreeRay, distance,
     upperBound): BoxTreeRayTestResult;
}

interface BoxTreeExternalNode
{
    boxTreeIndex: number;
}

//
// BoxTreeNode
//
class BoxTreeNode
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    escapeNodeOffset: number;
    externalNode: BoxTreeExternalNode;

    constructor(minX, minY, maxX, maxY, escapeNodeOffset, externalNode)
    {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.escapeNodeOffset = escapeNodeOffset;
        this.externalNode = externalNode;
    }

    isLeaf(): boolean
    {
        return !!this.externalNode;
    }

    reset(minX, minY, maxX, maxY, escapeNodeOffset)
    {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.escapeNodeOffset = escapeNodeOffset;
        this.externalNode = undefined;
    }

    clear()
    {
        var maxNumber = Number.MAX_VALUE;
        this.minX = maxNumber;
        this.minY = maxNumber;
        this.maxX = -maxNumber;
        this.maxY = -maxNumber;
        this.escapeNodeOffset = 1;
        this.externalNode = undefined;
    }

    // Constructor function

    static create(minX, minY, maxX, maxY, escapeNodeOffset, externalNode): BoxTreeNode
    {
        return new BoxTreeNode(minX, minY, maxX, maxY, escapeNodeOffset, externalNode);
    }
}

//
// BoxTree
//
class BoxTree
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    nodes: BoxTreeNode[];
    endNode: number;
    needsRebuild: boolean;
    needsRebound: boolean;
    numAdds: number;
    numUpdates: number;
    numExternalNodes: number;
    startUpdate: number;
    endUpdate: number;
    highQuality: boolean;

    numNodesLeaf = 4;

    constructor(highQuality: boolean)
    {
        this.nodes = [];
        this.endNode = 0;
        this.needsRebuild = false;
        this.needsRebound = false;
        this.numAdds = 0;
        this.numUpdates = 0;
        this.numExternalNodes = 0;
        this.startUpdate = 0x7FFFFFFF;
        this.endUpdate = -0x7FFFFFFF;
        this.highQuality = highQuality;
    }

    add(externalNode, extents)
    {
        var endNode = this.endNode;
        externalNode.boxTreeIndex = endNode;
        this.nodes[endNode] = BoxTreeNode.create(extents[0],
                                                 extents[1],
                                                 extents[2],
                                                 extents[3],
                                                 1,
                                                 externalNode);
        this.endNode = (endNode + 1);
        this.needsRebuild = true;
        this.numAdds += 1;
        this.numExternalNodes += 1;
    }

    remove(externalNode)
    {
        var index = externalNode.boxTreeIndex;
        if (index !== undefined)
        {
            if (this.numExternalNodes > 1)
            {
                var nodes = this.nodes;

                nodes[index].clear();

                var endNode = this.endNode;
                if ((index + 1) >= endNode)
                {
                    while (!nodes[endNode - 1].externalNode) // No leaf
                    {
                        endNode -= 1;
                    }
                    this.endNode = endNode;
                }
                else
                {
                    this.needsRebuild = true;
                }
                this.numExternalNodes -= 1;
            }
            else
            {
                this.clear();
            }

            externalNode.boxTreeIndex = undefined;
        }
    }

    findParent(nodeIndex)
    {
        var nodes = this.nodes;
        var parentIndex = nodeIndex;
        var nodeDist = 0;
        var parent;
        do
        {
            parentIndex -= 1;
            nodeDist += 1;
            parent = nodes[parentIndex];
        }
        while (parent.escapeNodeOffset <= nodeDist);
        return parent;
    }

    update(externalNode, extents)
    {
        var index = externalNode.boxTreeIndex;
        if (index !== undefined)
        {
            var min0 = extents[0];
            var min1 = extents[1];
            var max0 = extents[2];
            var max1 = extents[3];

            var needsRebuild = this.needsRebuild;
            var needsRebound = this.needsRebound;
            var nodes = this.nodes;
            var node = nodes[index];

            var doUpdate = (needsRebuild ||
                            needsRebound ||
                            node.minX > min0 ||
                            node.minY > min1 ||
                            node.maxX < max0 ||
                            node.maxY < max1);

            node.minX = min0;
            node.minY = min1;
            node.maxX = max0;
            node.maxY = max1;

            if (doUpdate)
            {
                if (!needsRebuild && 1 < nodes.length)
                {
                    this.numUpdates += 1;
                    if (this.startUpdate > index)
                    {
                        this.startUpdate = index;
                    }
                    if (this.endUpdate < index)
                    {
                        this.endUpdate = index;
                    }
                    if (!needsRebound)
                    {
                        // force a rebound when things change too much
                        if ((2 * this.numUpdates) > this.numExternalNodes)
                        {
                            this.needsRebound = true;
                        }
                        else
                        {
                            var parent = this.findParent(index);
                            if (parent.minX > min0 ||
                                parent.minY > min1 ||
                                parent.maxX < max0 ||
                                parent.maxY < max1)
                            {
                                this.needsRebound = true;
                            }
                        }
                    }
                    else
                    {
                        // force a rebuild when things change too much
                        if (this.numUpdates > (3 * this.numExternalNodes))
                        {
                            this.needsRebuild = true;
                            this.numAdds = this.numUpdates;
                        }
                    }
                }
            }
        }
        else
        {
            this.add(externalNode, extents);
        }
    }

    needsFinalize(): boolean
    {
        return (this.needsRebuild || this.needsRebound);
    }

    finalize()
    {
        if (this.needsRebuild)
        {
            this.rebuild();
        }
        else if (this.needsRebound)
        {
            this.rebound();
        }
    }

    rebound()
    {
        var nodes = this.nodes;
        if (nodes.length > 1)
        {
            var startUpdateNodeIndex = this.startUpdate;
            var endUpdateNodeIndex   = this.endUpdate;

            var nodesStack = [];
            var numNodesStack = 0;
            var topNodeIndex = 0;
            for ( ; ; )
            {
                var topNode = nodes[topNodeIndex];
                var currentNodeIndex = topNodeIndex;
                var currentEscapeNodeIndex = (topNodeIndex + topNode.escapeNodeOffset);
                var nodeIndex = (topNodeIndex + 1); // First child
                var node;
                do
                {
                    node = nodes[nodeIndex];
                    var escapeNodeIndex = (nodeIndex + node.escapeNodeOffset);
                    if (nodeIndex < endUpdateNodeIndex)
                    {
                        if (!node.externalNode) // No leaf
                        {
                            if (escapeNodeIndex > startUpdateNodeIndex)
                            {
                                nodesStack[numNodesStack] = topNodeIndex;
                                numNodesStack += 1;
                                topNodeIndex = nodeIndex;
                            }
                        }
                    }
                    else
                    {
                        break;
                    }
                    nodeIndex = escapeNodeIndex;
                }
                while (nodeIndex < currentEscapeNodeIndex);

                if (topNodeIndex === currentNodeIndex)
                {
                    nodeIndex = (topNodeIndex + 1); // First child
                    node = nodes[nodeIndex];

                    var minX = node.minX;
                    var minY = node.minY;
                    var maxX = node.maxX;
                    var maxY = node.maxY;

                    nodeIndex = (nodeIndex + node.escapeNodeOffset);
                    while (nodeIndex < currentEscapeNodeIndex)
                    {
                        node = nodes[nodeIndex];
                        if (minX > node.minX) { minX = node.minX; }
                        if (minY > node.minY) { minY = node.minY; }
                        if (maxX < node.maxX) { maxX = node.maxX; }
                        if (maxY < node.maxY) { maxY = node.maxY; }
                        nodeIndex = (nodeIndex + node.escapeNodeOffset);
                    }

                    topNode.minX = minX;
                    topNode.minY = minY;
                    topNode.maxX = maxX;
                    topNode.maxY = maxY;

                    endUpdateNodeIndex = topNodeIndex;

                    if (0 < numNodesStack)
                    {
                        numNodesStack -= 1;
                        topNodeIndex = nodesStack[numNodesStack];
                    }
                    else
                    {
                        break;
                    }
                }
            }
        }

        this.needsRebuild = false;
        this.needsRebound = false;
        this.numAdds = 0;
        //this.numUpdates = 0;
        this.startUpdate = 0x7FFFFFFF;
        this.endUpdate = -0x7FFFFFFF;
    }

    rebuild()
    {
        if (this.numExternalNodes > 0)
        {
            var nodes = this.nodes;

            var buildNodes: BoxTreeNode[], numBuildNodes, endNodeIndex;

            if (this.numExternalNodes === nodes.length)
            {
                buildNodes = nodes;
                numBuildNodes = nodes.length;
                nodes = [];
                this.nodes = nodes;
            }
            else
            {
                buildNodes = [];
                buildNodes.length = this.numExternalNodes;
                numBuildNodes = 0;
                endNodeIndex = this.endNode;
                for (var n = 0; n < endNodeIndex; n += 1)
                {
                    var currentNode = nodes[n];
                    if (currentNode.externalNode) // Is leaf
                    {
                        nodes[n] = undefined;
                        buildNodes[numBuildNodes] = currentNode;
                        numBuildNodes += 1;
                    }
                }
                if (buildNodes.length > numBuildNodes)
                {
                    buildNodes.length = numBuildNodes;
                }
            }

            if (numBuildNodes > 1)
            {
                if (numBuildNodes > this.numNodesLeaf &&
                    this.numAdds > 0)
                {
                    if (this.highQuality)
                    {
                        this.sortNodesHighQuality(buildNodes);
                    }
                    else
                    {
                        this.sortNodes(buildNodes);
                    }
                }

                this.recursiveBuild(buildNodes, 0, numBuildNodes, 0);

                endNodeIndex = nodes[0].escapeNodeOffset;
                if (nodes.length > endNodeIndex)
                {
                    nodes.length = endNodeIndex;
                }
                this.endNode = endNodeIndex;
            }
            else
            {
                var rootNode: BoxTreeNode = buildNodes[0];
                rootNode.externalNode.boxTreeIndex = 0;
                nodes.length = 1;
                nodes[0] = rootNode;
                this.endNode = 1;
            }
            buildNodes = null;
        }

        this.needsRebuild = false;
        this.needsRebound = false;
        this.numAdds = 0;
        this.numUpdates = 0;
        this.startUpdate = 0x7FFFFFFF;
        this.endUpdate = -0x7FFFFFFF;
    }

    sortNodes(nodes: BoxTreeNode[])
    {
        var numNodesLeaf = this.numNodesLeaf;
        var numNodes = nodes.length;

        function getkeyXfn(node: BoxTreeNode)
        {
            return (node.minX + node.maxX);
        }

        function getkeyYfn(node: BoxTreeNode)
        {
            return (node.minY + node.maxY);
        }

        function getreversekeyXfn(node: BoxTreeNode)
        {
            return -(node.minX + node.maxX);
        }

        function getreversekeyYfn(node: BoxTreeNode)
        {
            return -(node.minY + node.maxY);
        }

        var nthElement = this.nthElement;
        var reverse = false;

        function sortNodesRecursive(nodes: BoxTreeNode[], startIndex: number, endIndex: number, sortByX: boolean)
        {
            /* tslint:disable:no-bitwise */
            var splitNodeIndex = ((startIndex + endIndex) >> 1);
            /* tslint:enable:no-bitwise */

            if (sortByX)
            {
                if (reverse)
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getreversekeyXfn);
                }
                else
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyXfn);
                }
            }
            else
            {
                if (reverse)
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getreversekeyYfn);
                }
                else
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyYfn);
                }
            }

            reverse = !reverse;

            if ((startIndex + numNodesLeaf) < splitNodeIndex)
            {
                sortNodesRecursive(nodes, startIndex, splitNodeIndex, !sortByX);
            }

            if ((splitNodeIndex + numNodesLeaf) < endIndex)
            {
                sortNodesRecursive(nodes, splitNodeIndex, endIndex, !sortByX);
            }
        }

        sortNodesRecursive(nodes, 0, numNodes, true);
    }

    sortNodesHighQuality(nodes: BoxTreeNode[])
    {
        var numNodesLeaf = this.numNodesLeaf;
        var numNodes = nodes.length;

        function getkeyXfn(node: BoxTreeNode)
        {
            return (node.minX + node.maxX);
        }

        function getkeyYfn(node: BoxTreeNode)
        {
            return (node.minY + node.maxY);
        }

        function getkeyXYfn(node: BoxTreeNode)
        {
            return (node.minX + node.minY + node.maxX + node.maxY);
        }

        function getkeyYXfn(node: BoxTreeNode)
        {
            return (node.minX - node.minY + node.maxX - node.maxY);
        }

        function getreversekeyXfn(node: BoxTreeNode)
        {
            return -(node.minX + node.maxX);
        }

        function getreversekeyYfn(node: BoxTreeNode)
        {
            return -(node.minY + node.maxY);
        }

        function getreversekeyXYfn(node: BoxTreeNode)
        {
            return -(node.minX + node.minY + node.maxX + node.maxY);
        }

        function getreversekeyYXfn(node: BoxTreeNode)
        {
            return -(node.minX - node.minY + node.maxX - node.maxY);
        }

        var nthElement = this.nthElement;
        var calculateSAH = this.calculateSAH;
        var reverse = false;

        function sortNodesHighQualityRecursive(nodes: BoxTreeNode[], startIndex, endIndex)
        {
            /* tslint:disable:no-bitwise */
            var splitNodeIndex = ((startIndex + endIndex) >> 1);
            /* tslint:enable:no-bitwise */

            nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyXfn);
            var sahX = (calculateSAH(nodes, startIndex, splitNodeIndex) +
                        calculateSAH(nodes, splitNodeIndex, endIndex));

            nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyYfn);
            var sahY = (calculateSAH(nodes, startIndex, splitNodeIndex) +
                        calculateSAH(nodes, splitNodeIndex, endIndex));

            nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyXYfn);
            var sahXY = (calculateSAH(nodes, startIndex, splitNodeIndex) +
                         calculateSAH(nodes, splitNodeIndex, endIndex));

            nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyYXfn);
            var sahYX = (calculateSAH(nodes, startIndex, splitNodeIndex) +
                         calculateSAH(nodes, splitNodeIndex, endIndex));

            if (sahX <= sahY &&
                sahX <= sahXY &&
                sahX <= sahYX)
            {
                if (reverse)
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getreversekeyXfn);
                }
                else
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyXfn);
                }
            }
            else if (sahY <= sahXY &&
                     sahY <= sahYX)
            {
                if (reverse)
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getreversekeyYfn);
                }
                else
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyYfn);
                }
            }
            else if (sahXY <= sahYX)
            {
                if (reverse)
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getreversekeyXYfn);
                }
                else
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyXYfn);
                }
            }
            else //if (sahYX <= sahXY)
            {
                if (reverse)
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getreversekeyYXfn);
                }
                else
                {
                    nthElement(nodes, startIndex, splitNodeIndex, endIndex, getkeyYXfn);
                }
            }

            reverse = !reverse;

            if ((startIndex + numNodesLeaf) < splitNodeIndex)
            {
                sortNodesHighQualityRecursive(nodes, startIndex, splitNodeIndex);
            }

            if ((splitNodeIndex + numNodesLeaf) < endIndex)
            {
                sortNodesHighQualityRecursive(nodes, splitNodeIndex, endIndex);
            }
        }

        sortNodesHighQualityRecursive(nodes, 0, numNodes);
    }

    calculateSAH(buildNodes: BoxTreeNode[], startIndex, endIndex)
    {
        var buildNode: BoxTreeNode, minX, minY, maxX, maxY;

        buildNode = buildNodes[startIndex];
        minX = buildNode.minX;
        minY = buildNode.minY;
        maxX = buildNode.maxX;
        maxY = buildNode.maxY;

        for (var n = (startIndex + 1); n < endIndex; n += 1)
        {
            buildNode = buildNodes[n];
            if (minX > buildNode.minX) { minX = buildNode.minX; }
            if (minY > buildNode.minY) { minY = buildNode.minY; }
            if (maxX < buildNode.maxX) { maxX = buildNode.maxX; }
            if (maxY < buildNode.maxY) { maxY = buildNode.maxY; }
        }

        return ((maxX - minX) + (maxY - minY));
    }

    nthElement(nodes: BoxTreeNode[], first, nth, last, getkey)
    {
        function medianFn(a, b, c)
        {
            if (a < b)
            {
                if (b < c)
                {
                    return b;
                }
                else if (a < c)
                {
                    return c;
                }
                else
                {
                    return a;
                }
            }
            else if (a < c)
            {
                return a;
            }
            else if (b < c)
            {
                return c;
            }
            return b;
        }

        function insertionSort(nodes, first, last, getkey)
        {
            var sorted = (first + 1);
            while (sorted !== last)
            {
                var tempNode = nodes[sorted];
                var tempKey = getkey(tempNode);

                var next = sorted;
                var current = (sorted - 1);

                while (next !== first && tempKey < getkey(nodes[current]))
                {
                    nodes[next] = nodes[current];
                    next -= 1;
                    current -= 1;
                }

                if (next !== sorted)
                {
                    nodes[next] = tempNode;
                }

                sorted += 1;
            }
        }

        while ((last - first) > 8)
        {
            /* tslint:disable:no-bitwise */
            var midValue = medianFn(getkey(nodes[first]),
                                    getkey(nodes[first + ((last - first) >> 1)]),
                                    getkey(nodes[last - 1]));
            /* tslint:enable:no-bitwise */

            var firstPos = first;
            var lastPos  = last;
            var midPos;
            for (; ; firstPos += 1)
            {
                while (getkey(nodes[firstPos]) < midValue)
                {
                    firstPos += 1;
                }

                do
                {
                    lastPos -= 1;
                }
                while (midValue < getkey(nodes[lastPos]));

                if (firstPos >= lastPos)
                {
                    midPos = firstPos;
                    break;
                }
                else
                {
                    var temp = nodes[firstPos];
                    nodes[firstPos] = nodes[lastPos];
                    nodes[lastPos]  = temp;
                }
            }

            if (midPos <= nth)
            {
                first = midPos;
            }
            else
            {
                last = midPos;
            }
        }

        insertionSort(nodes, first, last, getkey);
    }

    recursiveBuild(buildNodes: BoxTreeNode[], startIndex: number, endIndex: number, lastNodeIndex: number)
    {
        var nodes = this.nodes;
        var nodeIndex = lastNodeIndex;
        lastNodeIndex += 1;

        var minX, minY, maxX, maxY;
        var buildNode: BoxTreeNode, lastNode: BoxTreeNode;

        if ((startIndex + this.numNodesLeaf) >= endIndex)
        {
            buildNode = buildNodes[startIndex];
            minX = buildNode.minX;
            minY = buildNode.minY;
            maxX = buildNode.maxX;
            maxY = buildNode.maxY;

            buildNode.externalNode.boxTreeIndex = lastNodeIndex;
            nodes[lastNodeIndex] = buildNode;

            for (var n = (startIndex + 1); n < endIndex; n += 1)
            {
                buildNode = buildNodes[n];
                if (minX > buildNode.minX) { minX = buildNode.minX; }
                if (minY > buildNode.minY) { minY = buildNode.minY; }
                if (maxX < buildNode.maxX) { maxX = buildNode.maxX; }
                if (maxY < buildNode.maxY) { maxY = buildNode.maxY; }
                lastNodeIndex += 1;
                buildNode.externalNode.boxTreeIndex = lastNodeIndex;
                nodes[lastNodeIndex] = buildNode;
            }

            lastNode = nodes[lastNodeIndex];
        }
        else
        {
            /* tslint:disable:no-bitwise */
            var splitPosIndex = ((startIndex + endIndex) >> 1);
            /* tslint:enable:no-bitwise */

            if ((startIndex + 1) >= splitPosIndex)
            {
                buildNode = buildNodes[startIndex];
                buildNode.externalNode.boxTreeIndex = lastNodeIndex;
                nodes[lastNodeIndex] = buildNode;
            }
            else
            {
                this.recursiveBuild(buildNodes, startIndex, splitPosIndex, lastNodeIndex);
            }

            lastNode = nodes[lastNodeIndex];
            minX = lastNode.minX;
            minY = lastNode.minY;
            maxX = lastNode.maxX;
            maxY = lastNode.maxY;

            lastNodeIndex = (lastNodeIndex + lastNode.escapeNodeOffset);

            if ((splitPosIndex + 1) >= endIndex)
            {
                buildNode = buildNodes[splitPosIndex];
                buildNode.externalNode.boxTreeIndex = lastNodeIndex;
                nodes[lastNodeIndex] = buildNode;
            }
            else
            {
                this.recursiveBuild(buildNodes, splitPosIndex, endIndex, lastNodeIndex);
            }

            lastNode = nodes[lastNodeIndex];
            if (minX > lastNode.minX) { minX = lastNode.minX; }
            if (minY > lastNode.minY) { minY = lastNode.minY; }
            if (maxX < lastNode.maxX) { maxX = lastNode.maxX; }
            if (maxY < lastNode.maxY) { maxY = lastNode.maxY; }
        }

        var node = nodes[nodeIndex];
        if (node !== undefined)
        {
            node.reset(minX, minY, maxX, maxY,
                       (lastNodeIndex + lastNode.escapeNodeOffset - nodeIndex));
        }
        else
        {
            nodes[nodeIndex] = BoxTreeNode.create(minX,
                                                  minY,
                                                  maxX,
                                                  maxY,
                                                  (lastNodeIndex + lastNode.escapeNodeOffset - nodeIndex),
                                                  undefined);
        }
    }

    getVisibleNodes(planes, visibleNodes)
    {
        if (this.numExternalNodes > 0)
        {
            var nodes = this.nodes;
            var endNodeIndex = this.endNode;
            var numPlanes = planes.length;
            var numVisibleNodes = visibleNodes.length;
            var node, endChildren;
            var n0, n1, p0, p1;
            var isInside, n, plane, d0, d1;
            var nodeIndex = 0;

            for ( ; ; )
            {
                node = nodes[nodeIndex];
                n0 = node.minX;
                n1 = node.minY;
                p0 = node.maxX;
                p1 = node.maxY;
                //isInsidePlanesBox
                isInside = true;
                n = 0;
                do
                {
                    plane = planes[n];
                    d0 = plane[0];
                    d1 = plane[1];
                    if ((d0 * (d0 < 0 ? n0 : p0) + d1 * (d1 < 0 ? n1 : p1)) < plane[2])
                    {
                        isInside = false;
                        break;
                    }
                    n += 1;
                }
                while (n < numPlanes);
                if (isInside)
                {
                    if (node.externalNode) // Is leaf
                    {
                        visibleNodes[numVisibleNodes] = node.externalNode;
                        numVisibleNodes += 1;
                        nodeIndex += 1;
                        if (nodeIndex >= endNodeIndex)
                        {
                            break;
                        }
                    }
                    else
                    {
                        //isFullyInsidePlanesBox
                        isInside = true;
                        n = 0;
                        do
                        {
                            plane = planes[n];
                            d0 = plane[0];
                            d1 = plane[1];
                            if ((d0 * (d0 > 0 ? n0 : p0) + d1 * (d1 > 0 ? n1 : p1)) < plane[2])
                            {
                                isInside = false;
                                break;
                            }
                            n += 1;
                        }
                        while (n < numPlanes);
                        if (isInside)
                        {
                            endChildren = (nodeIndex + node.escapeNodeOffset);
                            nodeIndex += 1;
                            do
                            {
                                node = nodes[nodeIndex];
                                if (node.externalNode) // Is leaf
                                {
                                    visibleNodes[numVisibleNodes] = node.externalNode;
                                    numVisibleNodes += 1;
                                }
                                nodeIndex += 1;
                            }
                            while (nodeIndex < endChildren);
                            if (nodeIndex >= endNodeIndex)
                            {
                                break;
                            }
                        }
                        else
                        {
                            nodeIndex += 1;
                        }
                    }
                }
                else
                {
                    nodeIndex += node.escapeNodeOffset;
                    if (nodeIndex >= endNodeIndex)
                    {
                        break;
                    }
                }
            }
        }
    }

    getOverlappingNodes(queryExtents, overlappingNodes, startIndex)
    {
        if (this.numExternalNodes > 0)
        {
            var queryMinX = queryExtents[0];
            var queryMinY = queryExtents[1];
            var queryMaxX = queryExtents[2];
            var queryMaxY = queryExtents[3];
            var nodes = this.nodes;
            var endNodeIndex = this.endNode;
            var node, endChildren;
            var numOverlappingNodes = 0;
            var storageIndex = (startIndex === undefined) ? overlappingNodes.length : startIndex;
            var nodeIndex = 0;
            for ( ; ; )
            {
                node = nodes[nodeIndex];
                var minX = node.minX;
                var minY = node.minY;
                var maxX = node.maxX;
                var maxY = node.maxY;
                if (queryMinX <= maxX &&
                    queryMinY <= maxY &&
                    queryMaxX >= minX &&
                    queryMaxY >= minY)
                {
                    if (node.externalNode) // Is leaf
                    {
                        overlappingNodes[storageIndex] = node.externalNode;
                        storageIndex += 1;
                        numOverlappingNodes += 1;
                        nodeIndex += 1;
                        if (nodeIndex >= endNodeIndex)
                        {
                            break;
                        }
                    }
                    else
                    {
                        if (queryMaxX >= maxX &&
                            queryMaxY >= maxY &&
                            queryMinX <= minX &&
                            queryMinY <= minY)
                        {
                            endChildren = (nodeIndex + node.escapeNodeOffset);
                            nodeIndex += 1;
                            do
                            {
                                node = nodes[nodeIndex];
                                if (node.externalNode) // Is leaf
                                {
                                    overlappingNodes[storageIndex] = node.externalNode;
                                    storageIndex += 1;
                                    numOverlappingNodes += 1;
                                }
                                nodeIndex += 1;
                            }
                            while (nodeIndex < endChildren);
                            if (nodeIndex >= endNodeIndex)
                            {
                                break;
                            }
                        }
                        else
                        {
                            nodeIndex += 1;
                        }
                    }
                }
                else
                {
                    nodeIndex += node.escapeNodeOffset;
                    if (nodeIndex >= endNodeIndex)
                    {
                        break;
                    }
                }
            }
            return numOverlappingNodes;
        }
        else
        {
            return 0;
        }
    }

    getCircleOverlappingNodes(center, radius, overlappingNodes)
    {
        if (this.numExternalNodes > 0)
        {
            var radiusSquared = (radius * radius);
            var centerX = center[0];
            var centerY = center[1];
            var nodes = this.nodes;
            var endNodeIndex = this.endNode;
            var node;
            var numOverlappingNodes = overlappingNodes.length;
            var nodeIndex = 0;
            for ( ; ; )
            {
                node = nodes[nodeIndex];
                var minX = node.minX;
                var minY = node.minY;
                var maxX = node.maxX;
                var maxY = node.maxY;
                var totalDistance = 0, sideDistance;
                if (centerX < minX)
                {
                    sideDistance = (minX - centerX);
                    totalDistance += (sideDistance * sideDistance);
                }
                else if (centerX > maxX)
                {
                    sideDistance = (centerX - maxX);
                    totalDistance += (sideDistance * sideDistance);
                }
                if (centerY < minY)
                {
                    sideDistance = (minY - centerY);
                    totalDistance += (sideDistance * sideDistance);
                }
                else if (centerY > maxY)
                {
                    sideDistance = (centerY - maxY);
                    totalDistance += (sideDistance * sideDistance);
                }
                if (totalDistance <= radiusSquared)
                {
                    nodeIndex += 1;
                    if (node.externalNode) // Is leaf
                    {
                        overlappingNodes[numOverlappingNodes] = node.externalNode;
                        numOverlappingNodes += 1;
                        if (nodeIndex >= endNodeIndex)
                        {
                            break;
                        }
                    }
                }
                else
                {
                    nodeIndex += node.escapeNodeOffset;
                    if (nodeIndex >= endNodeIndex)
                    {
                        break;
                    }
                }
            }
        }
    }

    getOverlappingPairs(overlappingPairs, startIndex)
    {
        if (this.numExternalNodes > 0)
        {
            var nodes = this.nodes;
            var endNodeIndex = this.endNode;
            var currentNode, currentExternalNode, node;
            var numInsertions = 0;
            var storageIndex = (startIndex === undefined) ? overlappingPairs.length : startIndex;
            var currentNodeIndex = 0, nodeIndex;
            for ( ; ; )
            {
                currentNode = nodes[currentNodeIndex];
                while (!currentNode.externalNode) // No leaf
                {
                    currentNodeIndex += 1;
                    currentNode = nodes[currentNodeIndex];
                }

                currentNodeIndex += 1;
                if (currentNodeIndex < endNodeIndex)
                {
                    currentExternalNode = currentNode.externalNode;
                    var minX = currentNode.minX;
                    var minY = currentNode.minY;
                    var maxX = currentNode.maxX;
                    var maxY = currentNode.maxY;

                    nodeIndex = currentNodeIndex;
                    for ( ; ; )
                    {
                        node = nodes[nodeIndex];
                        if (minX <= node.maxX &&
                            minY <= node.maxY &&
                            maxX >= node.minX &&
                            maxY >= node.minY)
                        {
                            nodeIndex += 1;
                            if (node.externalNode) // Is leaf
                            {
                                overlappingPairs[storageIndex] = currentExternalNode;
                                overlappingPairs[storageIndex + 1] = node.externalNode;
                                storageIndex += 2;
                                numInsertions += 2;
                                if (nodeIndex >= endNodeIndex)
                                {
                                    break;
                                }
                            }
                        }
                        else
                        {
                            nodeIndex += node.escapeNodeOffset;
                            if (nodeIndex >= endNodeIndex)
                            {
                                break;
                            }
                        }
                    }
                }
                else
                {
                    break;
                }
            }
            return numInsertions;
        }
        else
        {
            return 0;
        }
    }

    getRootNode(): BoxTreeNode
    {
        return this.nodes[0];
    }

    getNodes(): BoxTreeNode[]
    {
        return this.nodes;
    }

    getEndNodeIndex(): number
    {
        return this.endNode;
    }

    clear()
    {
        this.nodes = [];
        this.endNode = 0;
        this.needsRebuild = false;
        this.needsRebound = false;
        this.numAdds = 0;
        this.numUpdates = 0;
        this.numExternalNodes = 0;
        this.startUpdate = 0x7FFFFFFF;
        this.endUpdate = -0x7FFFFFFF;
    }

    static rayTest(trees: BoxTree[], ray: BoxTreeRay,
                   callback: BoxTreeRayTestCallback): BoxTreeRayTestResult
    {
        // convert ray to parametric form
        var origin = ray.origin;
        var direction = ray.direction;

        // values used throughout calculations.
        var o0 = origin[0];
        var o1 = origin[1];
        var d0 = direction[0];
        var d1 = direction[1];
        var id0 = 1 / d0;
        var id1 = 1 / d1;

        // evaluate distance factor to a node's extents from ray origin, along direction
        // use this to induce an ordering on which nodes to check.
        function distanceExtents(min0: number,
                                 min1: number,
                                 max0: number,
                                 max1: number,
                                 upperBound: number)
        {

            // treat origin internal to extents as 0 distance.
            if (min0 <= o0 && o0 <= max0 &&
                min1 <= o1 && o1 <= max1)
            {
                return 0.0;
            }

            var tmin, tmax;
            var tymin, tymax;
            var del;
            if (d0 >= 0)
            {
                // Deal with cases where d0 == 0
                del = (min0 - o0);
                tmin = ((del === 0) ? 0 : (del * id0));
                del = (max0 - o0);
                tmax = ((del === 0) ? 0 : (del * id0));
            }
            else
            {
                tmin = ((max0 - o0) * id0);
                tmax = ((min0 - o0) * id0);
            }

            if (d1 >= 0)
            {
                // Deal with cases where d1 == 0
                del = (min1 - o1);
                tymin = ((del === 0) ? 0 : (del * id1));
                del = (max1 - o1);
                tymax = ((del === 0) ? 0 : (del * id1));
            }
            else
            {
                tymin = ((max1 - o1) * id1);
                tymax = ((min1 - o1) * id1);
            }

            if ((tmin > tymax) || (tymin > tmax))
            {
                return undefined;
            }

            if (tymin > tmin)
            {
                tmin = tymin;
            }

            if (tymax < tmax)
            {
                tmax = tymax;
            }

            if (tmin < 0)
            {
                tmin = tmax;
            }

            return (0 <= tmin && tmin < upperBound) ? tmin : undefined;
        }

        // we traverse both trees at once
        // keeping a priority list of nodes to check next.

        // TODO: possibly implement priority list more effeciently?
        //       binary heap probably too much overhead in typical case.
        var priorityList = [];
        //current upperBound on distance to first intersection
        //and current closest object properties
        var minimumResult = null;

        //if node is a leaf, intersect ray with shape
        // otherwise insert node into priority list.
        function processNode(tree, nodeIndex, upperBound)
        {
            var nodes = tree.getNodes();
            var node = nodes[nodeIndex];
            var distance = distanceExtents(node.minX, node.minY, node.maxX, node.maxY, upperBound);
            if (distance === undefined)
            {
                return upperBound;
            }

            if (node.externalNode)
            {
                var result = callback(tree, node.externalNode, ray, distance, upperBound);
                if (result)
                {
                    minimumResult = result;
                    upperBound = result.factor;
                }
            }
            else
            {
                // TODO: change to binary search?
                var length = priorityList.length;
                var i;
                for (i = 0; i < length; i += 1)
                {
                    var curObj = priorityList[i];
                    if (distance > curObj.distance)
                    {
                        break;
                    }
                }

                //insert node at index i
                priorityList.splice(i - 1, 0, {
                    tree: tree,
                    nodeIndex: nodeIndex,
                    distance: distance
                });
            }

            return upperBound;
        }

        var upperBound = ray.maxFactor;

        var tree;
        var i;
        for (i = 0; i < trees.length; i += 1)
        {
            tree = trees[i];
            if (tree.endNode !== 0)
            {
                upperBound = processNode(tree, 0, upperBound);
            }
        }

        while (priorityList.length !== 0)
        {
            var nodeObj = priorityList.pop();
            // A node inserted into priority list after this one may have
            // moved the upper bound.
            if (nodeObj.distance >= upperBound)
            {
                continue;
            }

            var nodeIndex = nodeObj.nodeIndex;
            tree = nodeObj.tree;
            var nodes = tree.getNodes();

            var node = nodes[nodeIndex];
            var maxIndex = nodeIndex + node.escapeNodeOffset;

            var childIndex = nodeIndex + 1;
            do
            {
                upperBound = processNode(tree, childIndex, upperBound);
                childIndex += nodes[childIndex].escapeNodeOffset;
            }
            while (childIndex < maxIndex);
        }

        return minimumResult;
    }

    // Constructor function
    static create(highQuality)
    {
        return new BoxTree(highQuality);
    }
}

