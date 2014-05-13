// Copyright (c) 2013-2014 Turbulenz Limited

//
// SpatialGridNode
//

class SpatialGridNode
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    extents          : any;
    cellExtents      : any;
    queryIndex       : number;
    id               : number;
    externalNode     : {};

    constructor(extents: any,
                cellExtents: any,
                id: number,
                externalNode: {})
    {
        this.extents = extents;
        this.cellExtents = cellExtents;
        this.queryIndex = -1;
        this.id = id;
        this.externalNode = externalNode;
        return this;
    }

    clear()
    {
        this.queryIndex = -1;
        this.externalNode = undefined;
    }

    // Constructor function
    static create(extents: any,
                  cellExtents: any,
                  id: number,
                  externalNode?: {}): SpatialGridNode
    {
        return new SpatialGridNode(extents, cellExtents, id, externalNode);
    }
}

//
// SpatialGrid
//
class SpatialGrid
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    extents: any;
    cellSize: number;
    numCellsX: number;
    numCellsZ: number;
    cells: SpatialGridNode[][];
    nodes:  SpatialGridNode[];
    numNodes: number;
    queryIndex: number;
    queryRowPlanes: any[];
    queryCellPlanes: any[];

    floatArrayConstructor: any;
    intArrayConstructor: any;

    constructor(extents: any, cellSize: number)
    {
        var gridExtents = new this.floatArrayConstructor(6);
        gridExtents[0] = extents[0];
        gridExtents[1] = extents[1];
        gridExtents[2] = extents[2];
        gridExtents[3] = extents[3];
        gridExtents[4] = extents[4];
        gridExtents[5] = extents[5];
        this.extents = gridExtents;

        this.cellSize = cellSize;

        this.numCellsX = Math.ceil((extents[3] - extents[0]) / cellSize);
        this.numCellsZ = Math.ceil((extents[5] - extents[2]) / cellSize);

        this.cells = new Array(this.numCellsX * this.numCellsZ);

        this.nodes = [];
        this.numNodes = 0;

        this.queryIndex = -1;
        this.queryRowPlanes = [];
        this.queryCellPlanes = [];
    }

    add(externalNode: {}, extents: any): void
    {
        var numNodes = this.numNodes;
        /* tslint:disable:no-string-literal */
        externalNode['spatialIndex'] = numNodes;
        /* tslint:enable:no-string-literal */

        var node = this.nodes[numNodes];
        var nodeExtents, cellExtents;
        if (node)
        {
            nodeExtents = node.extents;
            cellExtents = node.cellExtents;

            node.externalNode = externalNode;
        }
        else
        {
            nodeExtents = new this.floatArrayConstructor(6);
            cellExtents = new this.intArrayConstructor(4);

            node = new SpatialGridNode(nodeExtents, cellExtents, numNodes, externalNode);
            this.nodes[numNodes] = node;
        }
        debug.assert(node.id === numNodes);

        var min0 = extents[0];
        var min1 = extents[1];
        var min2 = extents[2];
        var max0 = extents[3];
        var max1 = extents[4];
        var max2 = extents[5];

        nodeExtents[0] = min0;
        nodeExtents[1] = min1;
        nodeExtents[2] = min2;
        nodeExtents[3] = max0;
        nodeExtents[4] = max1;
        nodeExtents[5] = max2;

        var cellSize = this.cellSize;
        var numCellsX = this.numCellsX;
        var gridExtents = this.extents;
        var minGridX = gridExtents[0];
        var minGridZ = gridExtents[2];

        var minX = Math.floor((min0 - minGridX) / cellSize);
        var minRow = (Math.floor((min2 - minGridZ) / cellSize) * numCellsX);
        var maxX = Math.floor((max0 - minGridX) / cellSize);
        var maxRow = (Math.floor((max2 - minGridZ) / cellSize) * numCellsX);

        debug.assert(0 <= minX && maxX < numCellsX &&
                     0 <= minRow && maxRow < this.cells.length,
                     "Node is out of bounds.");

        cellExtents[0] = minX;
        cellExtents[1] = minRow;
        cellExtents[2] = maxX;
        cellExtents[3] = maxRow;

        this.numNodes = (numNodes + 1);

        this._addToCells(node, minX, minRow, maxX, maxRow);
    }

    update(externalNode: {}, extents: any): void
    {
        /* tslint:disable:no-string-literal */
        var index = externalNode['spatialIndex'];
        /* tslint:enable:no-string-literal */
        if (index !== undefined)
        {
            var cellSize = this.cellSize;
            var numCellsX = this.numCellsX;
            var gridExtents = this.extents;
            var node = this.nodes[index];
            var nodeExtents = node.extents;
            var cellExtents = node.cellExtents;

            var min0 = extents[0];
            var min1 = extents[1];
            var min2 = extents[2];
            var max0 = extents[3];
            var max1 = extents[4];
            var max2 = extents[5];

            nodeExtents[0] = min0;
            nodeExtents[1] = min1;
            nodeExtents[2] = min2;
            nodeExtents[3] = max0;
            nodeExtents[4] = max1;
            nodeExtents[5] = max2;

            var minGridX = gridExtents[0];
            var minGridZ = gridExtents[2];

            var newMinX = Math.floor((min0 - minGridX) / cellSize);
            var newMinRow = (Math.floor((min2 - minGridZ) / cellSize) * numCellsX);
            var newMaxX = Math.floor((max0 - minGridX) / cellSize);
            var newMaxRow = (Math.floor((max2 - minGridZ) / cellSize) * numCellsX);

            debug.assert(0 <= newMinX && newMaxX < numCellsX &&
                         0 <= newMinRow && newMaxRow < this.cells.length,
                         "Node is out of bounds.");

            var oldMinX = cellExtents[0];
            var oldMinRow = cellExtents[1];
            var oldMaxX = cellExtents[2];
            var oldMaxRow = cellExtents[3];

            if (oldMinX !== newMinX ||
                oldMinRow !== newMinRow ||
                oldMaxX !== newMaxX ||
                oldMaxRow !== newMaxRow)
            {
                cellExtents[0] = newMinX;
                cellExtents[1] = newMinRow;
                cellExtents[2] = newMaxX;
                cellExtents[3] = newMaxRow;

                var minX = Math.min(oldMinX, newMinX);
                var minRow = Math.min(oldMinRow, newMinRow);
                var maxX = Math.max(oldMaxX, newMaxX);
                var maxRow = Math.max(oldMaxRow, newMaxRow);

                var cells = this.cells;
                do
                {
                    var ci = (minX + minRow);
                    var ce = (maxX + minRow);
                    var newRow = (newMinRow <= minRow && minRow <= newMaxRow);
                    var oldRow = (oldMinRow <= minRow && minRow <= oldMaxRow);
                    var x = minX;
                    do
                    {
                        var newCell = (newRow && newMinX <= x && x <= newMaxX);
                        var oldCell = (oldRow && oldMinX <= x && x <= oldMaxX);
                        var cell = cells[ci];
                        if (cell)
                        {
                            var numNodes = cell.length;
                            var n;

                            if (debug)
                            {
                                for (n = 0; n < numNodes; n += 1)
                                {
                                    if (cell[n] === node)
                                    {
                                        break;
                                    }
                                }
                                if (oldCell)
                                {
                                    // The node should already be on this cell
                                    debug.assert(n < numNodes, "Node missing from cell.");
                                }
                                else
                                {
                                    // The node should not already be on this cell
                                    debug.assert(n >= numNodes, "Node found in wrong cell.");
                                }
                            }

                            if (newCell)
                            {
                                if (!oldCell)
                                {
                                    cell.push(node);
                                }
                            }
                            else if (oldCell)
                            {
                                for (n = 0; n < numNodes; n += 1)
                                {
                                    if (cell[n] === node)
                                    {
                                        numNodes -= 1;
                                        if (n < numNodes)
                                        {
                                            cell[n] = cell[numNodes];
                                        }
                                        cell.length = numNodes;
                                        if (0 === numNodes)
                                        {
                                            cells[ci] = undefined;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        else
                        {
                            debug.assert(!oldCell, "Node missing from cell.");

                            if (newCell)
                            {
                                cells[ci] = [node];
                            }
                        }

                        ci += 1;
                        x += 1;
                    }
                    while (ci <= ce);

                    minRow += numCellsX;
                }
                while (minRow <= maxRow);
            }
        }
        else
        {
            this.add(externalNode, extents);
        }
    }

    remove(externalNode: {}): void
    {
        /* tslint:disable:no-string-literal */
        var index = externalNode['spatialIndex'];
        if (index !== undefined)
        {
            externalNode['spatialIndex'] = undefined;
            /* tslint:enable:no-string-literal */

            var numNodes = this.numNodes;
            if (1 < numNodes)
            {
                numNodes -= 1;
                this.numNodes = numNodes;

                var nodes = this.nodes;
                var node = nodes[index];
                var cellExtents = node.cellExtents;

                this._removeFromCells(node,
                                      cellExtents[0],
                                      cellExtents[1],
                                      cellExtents[2],
                                      cellExtents[3]);

                node.clear();

                if (index < numNodes)
                {
                    var lastNode = nodes[numNodes];
                    nodes[index] = lastNode;
                    nodes[numNodes] = node;
                    node.id = numNodes;
                    lastNode.id = index;
                    /* tslint:disable:no-string-literal */
                    lastNode.externalNode['spatialIndex'] = index;
                    /* tslint:enable:no-string-literal */
                }
            }
            else
            {
                this.clear();
            }
        }
    }

    _addToCells(node: SpatialGridNode,
                minX: number,
                minRow: number,
                maxX: number,
                maxRow: number): void
    {
        var numCellsX = this.numCellsX;
        var cells = this.cells;
        do
        {
            var ci = (minX + minRow);
            var ce = (maxX + minRow);
            do
            {
                var cell = cells[ci];
                if (cell)
                {
                    cell.push(node);
                }
                else
                {
                    cells[ci] = [node];
                }
                ci += 1;
            }
            while (ci <= ce);

            minRow += numCellsX;
        }
        while (minRow <= maxRow);
    }

    _removeFromCells(node: SpatialGridNode,
                     minX: number,
                     minRow: number,
                     maxX: number,
                     maxRow: number): void
    {
        var numCellsX = this.numCellsX;
        var cells = this.cells;
        do
        {
            var ci = (minX + minRow);
            var ce = (maxX + minRow);
            do
            {
                var cell = cells[ci];
                var numNodes = cell.length;
                var found = false;
                var n;
                for (n = 0; n < numNodes; n += 1)
                {
                    if (cell[n] === node)
                    {
                        numNodes -= 1;
                        if (n < numNodes)
                        {
                            cell[n] = cell[numNodes];
                        }
                        cell.length = numNodes;
                        if (0 === numNodes)
                        {
                            cells[ci] = undefined;
                        }
                        found = true;
                        break;
                    }
                }
                debug.assert(found, "Node was not found on the cell.");
                ci += 1;
            }
            while (ci <= ce);

            minRow += numCellsX;
        }
        while (minRow <= maxRow);
    }

    /* tslint:disable:no-empty */
    finalize(): void
    {
    }
    /* tslint:enable:no-empty */

    getOverlappingNodes(queryExtents: any, overlappingNodes: any[], startIndex?: number): number
    {
        var numOverlappingNodes = 0;
        if (0 < this.numNodes)
        {
            var queryMinX = queryExtents[0];
            var queryMinY = queryExtents[1];
            var queryMinZ = queryExtents[2];
            var queryMaxX = queryExtents[3];
            var queryMaxY = queryExtents[4];
            var queryMaxZ = queryExtents[5];

            var cellSize = this.cellSize;
            var numCellsX = this.numCellsX;
            var cells = this.cells;
            var gridExtents = this.extents;
            var minGridX = gridExtents[0];
            var minGridZ = gridExtents[2];
            var minX = Math.floor((queryMinX - minGridX) / cellSize);
            var firstRow = (Math.floor((queryMinZ - minGridZ) / cellSize) * numCellsX);
            var maxX = Math.floor((queryMaxX - minGridX) / cellSize);
            var lastRow = (Math.floor((queryMaxZ - minGridZ) / cellSize) * numCellsX);
            var minRow = firstRow;

            var queryIndex = (this.queryIndex + 1);
            this.queryIndex = queryIndex;

            var storageIndex = (startIndex === undefined ? overlappingNodes.length : startIndex);
            var cell, numCellNodes, n, node, nodeExtents;
            do
            {
                var internalRow = (firstRow < minRow && minRow < lastRow);
                var cs = (minX + minRow);
                var ce = (maxX + minRow);
                var ci = cs;
                do
                {
                    cell = cells[ci];
                    if (cell)
                    {
                        numCellNodes = cell.length;
                        n = 0;
                        if (internalRow && cs < ci && ci < ce)
                        {
                            // internal cells only need checks on Y
                            do
                            {
                                node = cell[n];
                                if (node.queryIndex !== queryIndex)
                                {
                                    node.queryIndex = queryIndex;

                                    nodeExtents = node.extents;
                                    if (queryMinY <= nodeExtents[4] &&
                                        queryMaxY >= nodeExtents[1])
                                    {
                                        overlappingNodes[storageIndex] = node.externalNode;
                                        storageIndex += 1;
                                        numOverlappingNodes += 1;
                                    }
                                }
                                n += 1;
                            }
                            while (n < numCellNodes);
                        }
                        else
                        {
                            do
                            {
                                node = cell[n];
                                if (node.queryIndex !== queryIndex)
                                {
                                    node.queryIndex = queryIndex;

                                    nodeExtents = node.extents;
                                    if (queryMinX <= nodeExtents[3] &&
                                        queryMinY <= nodeExtents[4] &&
                                        queryMinZ <= nodeExtents[5] &&
                                        queryMaxX >= nodeExtents[0] &&
                                        queryMaxY >= nodeExtents[1] &&
                                        queryMaxZ >= nodeExtents[2])
                                    {
                                        overlappingNodes[storageIndex] = node.externalNode;
                                        storageIndex += 1;
                                        numOverlappingNodes += 1;
                                    }
                                }
                                n += 1;
                            }
                            while (n < numCellNodes);
                        }
                    }
                    ci += 1;
                }
                while (ci <= ce);

                minRow += numCellsX;
            }
            while (minRow <= lastRow);
        }
        return numOverlappingNodes;
    }

    getSphereOverlappingNodes(center: any, radius: number, overlappingNodes: any[]): void
    {
        if (0 < this.numNodes)
        {
            var centerX = center[0];
            var centerY = center[1];
            var centerZ = center[2];
            var radiusSquared = (radius * radius);

            var cellSize = this.cellSize;
            var numCellsX = this.numCellsX;
            var cells = this.cells;
            var gridExtents = this.extents;
            var minGridX = gridExtents[0];
            var minGridZ = gridExtents[2];
            var minX = Math.floor(((centerX - radius) - minGridX) / cellSize);
            var minRow = (Math.floor(((centerZ - radius) - minGridZ) / cellSize) * numCellsX);
            var maxX = Math.floor(((centerX + radius) - minGridX) / cellSize);
            var maxRow = (Math.floor(((centerZ + radius) - minGridZ) / cellSize) * numCellsX);

            var queryIndex = (this.queryIndex + 1);
            this.queryIndex = queryIndex;

            var storageIndex = overlappingNodes.length;
            var cell, numCellNodes, n, node;
            do
            {
                var ci = (minX + minRow);
                var ce = (maxX + minRow);
                do
                {
                    cell = cells[ci];
                    if (cell)
                    {
                        numCellNodes = cell.length;
                        for (n = 0; n < numCellNodes; n += 1)
                        {
                            node = cell[n];
                            if (node.queryIndex !== queryIndex)
                            {
                                node.queryIndex = queryIndex;

                                var nodeExtents = node.extents;
                                var minNodeX = nodeExtents[0];
                                var minNodeY = nodeExtents[1];
                                var minNodeZ = nodeExtents[2];
                                var maxNodeX = nodeExtents[3];
                                var maxNodeY = nodeExtents[4];
                                var maxNodeZ = nodeExtents[5];
                                var totalDistance = 0, sideDistance;
                                if (centerX < minNodeX)
                                {
                                    sideDistance = (minNodeX - centerX);
                                    totalDistance += (sideDistance * sideDistance);
                                }
                                else if (centerX > maxNodeX)
                                {
                                    sideDistance = (centerX - maxNodeX);
                                    totalDistance += (sideDistance * sideDistance);
                                }
                                if (centerY < minNodeY)
                                {
                                    sideDistance = (minNodeY - centerY);
                                    totalDistance += (sideDistance * sideDistance);
                                }
                                else if (centerY > maxNodeY)
                                {
                                    sideDistance = (centerY - maxNodeY);
                                    totalDistance += (sideDistance * sideDistance);
                                }
                                if (centerZ < minNodeZ)
                                {
                                    sideDistance = (minNodeZ - centerZ);
                                    totalDistance += (sideDistance * sideDistance);
                                }
                                else if (centerZ > maxNodeZ)
                                {
                                    sideDistance = (centerZ - maxNodeZ);
                                    totalDistance += (sideDistance * sideDistance);
                                }
                                if (totalDistance <= radiusSquared)
                                {
                                    overlappingNodes[storageIndex] = node.externalNode;
                                    storageIndex += 1;
                                }
                            }
                        }
                    }
                    ci += 1;
                }
                while (ci <= ce);

                minRow += numCellsX;
            }
            while (minRow <= maxRow);
        }
    }

    getOverlappingPairs(overlappingPairs: any[], startIndex: number): number
    {
        var numInsertions = 0;
        if (0 < this.numNodes)
        {
            var storageIndex = (startIndex === undefined) ? overlappingPairs.length : startIndex;
            var cells = this.cells;
            var numCells = cells.length;
            var pairsMap = {};
            var c, i, j, nodeI, idI, nodeJ, idJ, extents, pairId;
            for (c = 0; c < numCells; c += 1)
            {
                var cell = cells[c];
                if (cell)
                {
                    var numNodes = (cell.length - 1);
                    for (i = 0; i < numNodes; i += 1)
                    {
                        nodeI = cell[i];
                        idI = nodeI.id;
                        extents = nodeI.extents;
                        var minX = extents[0];
                        var minY = extents[1];
                        var minZ = extents[2];
                        var maxX = extents[3];
                        var maxY = extents[4];
                        var maxZ = extents[5];
                        for (j = numNodes; i < j; j -= 1)
                        {
                            nodeJ = cell[j];
                            idJ = nodeJ.id;
                            /* tslint:disable:no-bitwise */
                            if (idI < idJ)
                            {
                                pairId = ((idJ << 16) | idI);
                            }
                            else
                            {
                                pairId = ((idI << 16) | idJ);
                            }
                            /* tslint:enable:no-bitwise */
                            if (!pairsMap[pairId])
                            {
                                extents = nodeJ.extents;
                                if (minX <= extents[3] &&
                                    minY <= extents[4] &&
                                    minZ <= extents[5] &&
                                    maxX >= extents[0] &&
                                    maxY >= extents[1] &&
                                    maxZ >= extents[2])
                                {
                                    pairsMap[pairId] = true;
                                    overlappingPairs[storageIndex] = nodeI.externalNode;
                                    overlappingPairs[storageIndex + 1] = nodeJ.externalNode;
                                    storageIndex += 2;
                                    numInsertions += 2;
                                }
                            }
                        }
                    }
                }
            }
        }
        return numInsertions;
    }

    getVisibleNodes(planes: any[], visibleNodes: any[], startIndex?: number): number
    {
        // We use brute force when the number of cell checks is bigger than the number of nodes
        if (this.numNodes < (this.numCellsZ * 2))
        {
            return this._getVisibleNodesBruteForce(planes, visibleNodes, startIndex);
        }

        var numVisibleNodes = 0;
        var numPlanes = planes.length;
        var storageIndex = (startIndex === undefined) ? visibleNodes.length : startIndex;
        var cells = this.cells;
        var cellSize = this.cellSize;
        var numCellsX = this.numCellsX;
        //var numCellsZ = this.numCellsZ;
        var gridExtents = this.extents;
        var minGridX = gridExtents[0];
        var minGridY = gridExtents[1];
        var minGridZ = gridExtents[2];
        var maxGridX = gridExtents[3];
        var maxGridY = gridExtents[4];
        var maxGridZ = gridExtents[5];

        // clamp grid extents to planes
        var abs = Math.abs;
        var isInside, plane, d0, d1, d2;
        var n = 0;
        do
        {
            plane = planes[n];
            d0 = plane[0];
            d1 = plane[1];
            d2 = plane[2];
            var maxDistance = (d0 * (d0 < 0 ? minGridX : maxGridX) +
                               d1 * (d1 < 0 ? minGridY : maxGridY) +
                               d2 * (d2 < 0 ? minGridZ : maxGridZ) - plane[3]);
            if (maxDistance < 0.0001)
            {
                return 0;
            }
            else
            {
                if (maxDistance < abs(d0) * (maxGridX - minGridX))
                {
                    if (d0 < 0)
                    {
                        maxGridX = minGridX - (maxDistance / d0);
                    }
                    else
                    {
                        minGridX = maxGridX - (maxDistance / d0);
                    }
                }
                if (maxDistance < abs(d1) * (maxGridY - minGridY))
                {
                    if (d1 < 0)
                    {
                        maxGridY = minGridY - (maxDistance / d1);
                    }
                    else
                    {
                        minGridY = maxGridY - (maxDistance / d1);
                    }
                }
                if (maxDistance < abs(d2) * (maxGridZ - minGridZ))
                {
                    if (d2 < 0)
                    {
                        maxGridZ = minGridZ - (maxDistance / d2);
                    }
                    else
                    {
                        minGridZ = maxGridZ - (maxDistance / d2);
                    }
                }
            }
            n += 1;
        }
        while (n < numPlanes);

        var minX = Math.floor((minGridX - gridExtents[0]) / cellSize);
        var minZ = Math.floor((minGridZ - gridExtents[2]) / cellSize);
        var maxX = Math.ceil((maxGridX - gridExtents[0]) / cellSize);
        var maxZ = Math.ceil((maxGridZ - gridExtents[2]) / cellSize);

        minGridX = ((minX * cellSize) + gridExtents[0]);
        minGridZ = ((minZ * cellSize) + gridExtents[2]);

        var queryIndex = (this.queryIndex + 1);
        this.queryIndex = queryIndex;

        var queryRowPlanes = this.queryRowPlanes;
        var queryCellPlanes = this.queryCellPlanes;
        var numQueryRowPlanes = 0;
        var numQueryCellPlanes = 0;

        var i, j, k;
        var minRowZ = minGridZ;
        var maxRowZ = (minGridZ + cellSize);
        for (j = minZ; j < maxZ; j += 1)
        {
            // Check if row is visible
            isInside = true;
            n = 0;
            do
            {
                plane = planes[n];
                d0 = plane[0];
                d1 = plane[1];
                d2 = plane[2];
                if ((d0 * (d0 < 0 ? minGridX : maxGridX) +
                     d1 * (d1 < 0 ? minGridY : maxGridY) +
                     d2 * (d2 < 0 ? minRowZ : maxRowZ)) < plane[3])
                {
                    isInside = false;
                    break;
                }
                n += 1;
            }
            while (n < numPlanes);

            if (isInside)
            {
                // Remove those planes on which the row is fully inside
                numQueryRowPlanes = 0;
                n = 0;
                do
                {
                    plane = planes[n];
                    d0 = plane[0];
                    d1 = plane[1];
                    d2 = plane[2];
                    if ((d0 * (d0 > 0 ? minGridX : maxGridX) +
                         d1 * (d1 > 0 ? minGridY : maxGridY) +
                         d2 * (d2 > 0 ? minRowZ : maxRowZ)) < plane[3])
                    {
                        queryRowPlanes[numQueryRowPlanes] = plane;
                        numQueryRowPlanes += 1;
                    }
                    n += 1;
                }
                while (n < numPlanes);

                var minCellX = minGridX;
                var maxCellX = (minGridX + cellSize);
                var cellIndex = ((j * numCellsX) + minX);
                for (i = minX; i < maxX; i += 1, cellIndex += 1)
                {
                    var cell = cells[cellIndex];
                    if (cell)
                    {
                        // check if cell is visible
                        isInside = true;
                        for (n = 0; n < numQueryRowPlanes; n += 1)
                        {
                            plane = queryRowPlanes[n];
                            d0 = plane[0];
                            d1 = plane[1];
                            d2 = plane[2];
                            if ((d0 * (d0 < 0 ? minCellX : maxCellX) +
                                 d1 * (d1 < 0 ? minGridY : maxGridY) +
                                 d2 * (d2 < 0 ? minRowZ : maxRowZ)) < plane[3])
                            {
                                isInside = false;
                                break;
                            }
                        }

                        if (isInside)
                        {
                            var numNodes = cell.length;

                            // Remove those planes on which the cell is fully inside
                            numQueryCellPlanes = 0;
                            for (n = 0; n < numQueryRowPlanes; n += 1)
                            {
                                plane = queryRowPlanes[n];
                                d0 = plane[0];
                                d1 = plane[1];
                                d2 = plane[2];
                                if ((d0 * (d0 > 0 ? minCellX : maxCellX) +
                                     d1 * (d1 > 0 ? minGridY : maxGridY) +
                                     d2 * (d2 > 0 ? minRowZ : maxRowZ)) < plane[3])
                                {
                                    queryCellPlanes[numQueryCellPlanes] = plane;
                                    numQueryCellPlanes += 1;
                                }
                            }

                            var node;
                            if (numQueryCellPlanes === 0)
                            {
                                for (k = 0; k < numNodes; k += 1)
                                {
                                    // check if node is visible
                                    node = cell[k];
                                    if (node.queryIndex !== queryIndex)
                                    {
                                        node.queryIndex = queryIndex;
                                        visibleNodes[storageIndex] = node.externalNode;
                                        storageIndex += 1;
                                        numVisibleNodes += 1;
                                    }
                                }
                            }
                            else
                            {
                                for (k = 0; k < numNodes; k += 1)
                                {
                                    // check if node is visible
                                    node = cell[k];
                                    if (node.queryIndex !== queryIndex)
                                    {
                                        node.queryIndex = queryIndex;

                                        var extents = node.extents;
                                        var n0 = extents[0];
                                        var n1 = extents[1];
                                        var n2 = extents[2];
                                        var p0 = extents[3];
                                        var p1 = extents[4];
                                        var p2 = extents[5];

                                        isInside = true;
                                        n = 0;
                                        do
                                        {
                                            plane = queryCellPlanes[n];
                                            d0 = plane[0];
                                            d1 = plane[1];
                                            d2 = plane[2];
                                            if ((d0 * (d0 < 0 ? n0 : p0) +
                                                 d1 * (d1 < 0 ? n1 : p1) +
                                                 d2 * (d2 < 0 ? n2 : p2)) < plane[3])
                                            {
                                                isInside = false;
                                                break;
                                            }
                                            n += 1;
                                        }
                                        while (n < numQueryCellPlanes);

                                        if (isInside)
                                        {
                                            visibleNodes[storageIndex] = node.externalNode;
                                            storageIndex += 1;
                                            numVisibleNodes += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    minCellX = maxCellX;
                    maxCellX += cellSize;
                }
            }

            minRowZ = maxRowZ;
            maxRowZ += cellSize;
        }

        return numVisibleNodes;
    }

    private _getVisibleNodesBruteForce(planes: any[], visibleNodes: any[], startIndex?: number): number
    {
        var numVisibleNodes = 0;
        var numPlanes = planes.length;
        var storageIndex = (startIndex === undefined) ? visibleNodes.length : startIndex;
        var nodes = this.nodes;
        var numNodes = this.numNodes;
        var n, p, plane, isInside, d0, d1, d2;
        for (n = 0; n < numNodes; n += 1)
        {
            var node = nodes[n];
            var extents = node.extents;
            var n0 = extents[0];
            var n1 = extents[1];
            var n2 = extents[2];
            var p0 = extents[3];
            var p1 = extents[4];
            var p2 = extents[5];

            isInside = true;
            p = 0;
            do
            {
                plane = planes[p];
                d0 = plane[0];
                d1 = plane[1];
                d2 = plane[2];
                if ((d0 * (d0 < 0 ? n0 : p0) + d1 * (d1 < 0 ? n1 : p1) + d2 * (d2 < 0 ? n2 : p2)) < plane[3])
                {
                    isInside = false;
                    break;
                }
                p += 1;
            }
            while (p < numPlanes);

            if (isInside)
            {
                visibleNodes[storageIndex] = node.externalNode;
                storageIndex += 1;
                numVisibleNodes += 1;
            }
        }

        return numVisibleNodes;
    }

    getExtents(): any
    {
        return this.extents;
    }

    getCells(): SpatialGridNode[][]
    {
        return this.cells;
    }

    getCellSize(): number
    {
        return this.cellSize;
    }

    clear(): void
    {
        var cells = this.cells;
        var numCells = cells.length;
        var n;
        for (n = 0; n < numCells; n += 1)
        {
            cells[n] = undefined;
        }

        this.nodes.length = 0;
        this.numNodes = 0;
        this.queryIndex = -1;
    }

   static create(extents: any, cellSize: number): SpatialGrid
   {
       return new SpatialGrid(extents, cellSize);
   }
};

// Detect correct typed arrays
(function () {
    SpatialGrid.prototype.floatArrayConstructor = Array;
    SpatialGrid.prototype.intArrayConstructor = Array;
    if (typeof Float32Array !== "undefined")
    {
        SpatialGrid.prototype.floatArrayConstructor = Float32Array;
    }
    if (typeof Int32Array !== "undefined")
    {
        SpatialGrid.prototype.intArrayConstructor = Int32Array;
    }
}());

