// Copyright (c) 2010-2011 Turbulenz Limited

/*global BF: false*/

declare var BF;

//
//  Recursive vs iterative: Perform functionality on a set of data by accessing it in both methods
//

//
//  Recursive: Perform a task on a data set by recursively processing it
//
class Recursive
{
    // Settings
    depth = 14;
    childrenCount = 2;

    root: any;
    result: number;

    init()
    {
        function createNode(childCount, currentDepth)
        {
            var children = [];
            if (currentDepth === 0)
            {
                return null;
            }

            for (var i = 0; i < childCount; i += 1)
            {
                children[i] = createNode(childCount, currentDepth - 1);
            }

            return {
                children : children,
                depth : currentDepth
            };
        }

        this.root = createNode(this.childrenCount, this.depth);
    };

    run()
    {
        function processNodeFn(node, accum)
        {
            var childrenCount;
            if (node !== null)
            {
                var children = node.children;
                childrenCount = children.length;
                for (var i = 0; i < childrenCount; i += 1)
                {
                    var child = children[i];
                    if (child !== null)
                    {
                        accum = processNodeFn(child, accum);
                    }
                }
                return node.depth + accum;
            }
            else
            {
                return accum;
            }
        }

        this.result = processNodeFn(this.root, 0);
    };

    destroy()
    {
        this.root = {};
        this.result = 0;
    };

    // Constructor function
    static create()
    {
        var r = new Recursive();
        return r;
    };
};

//
//  Iterative: Perform a task on a data set by iterating over a custom stack
//
class Iterative
{
    // Settings
    depth = 14;
    childrenCount = 2;
    estimateStackLength = 14;

    root: any;
    result: number;

    init()
    {
        function createNode(childCount, currentDepth)
        {
            var children = [];
            if (currentDepth === 0)
            {
                return null;
            }

            for (var i = 0; i < childCount; i += 1)
            {
                children[i] = createNode(childCount, currentDepth - 1);
            }

            return {
                children : children,
                depth : currentDepth
            };
        }

        this.root = createNode(this.childrenCount, this.depth);
    };

    run()
    {
        // Process Node
        var childrenCount = 0;
        var accum = 0;
        var children;
        var node;
        var length = 1;
        var stack = [this.root];
        stack.length = this.estimateStackLength;

        do
        {
            length -= 1;
            node = stack[length];
            accum += node.depth;
            children = node.children;
            childrenCount = children.length;
            for (var i = 0; i < childrenCount; i += 1)
            {
                var child = children[i];
                if (child !== null)
                {
                    stack[length] = child;
                    length += 1;
                }
            }
        }
        while (length !== 0);

        this.result = accum;
    };

    destroy()
    {
        this.root = {};
        this.result = 0;
    };

    // Constructor function
    static create()
    {
        var i = new Iterative();
        return i;
    };
};

var recursive = Recursive.create();
var iterative = Iterative.create();

BF.register({
    name: "RecursiveProcessing",
    path: "scripts/benchmarks/turbulenz/js/recursive_iterative.js",
    description: [
        "Creates a node structure of fixed depth with children.",
        "Processes the node structure by recursively processing each child node and returning the accumulated depth of the node.",
        "This test is comparable to iteratively processing the same node structure without a recursive function"
    ],
    init: function () {
        return recursive.init();
    },
    run: function () {
        return recursive.run();
    },
    destroy: function () {
        return recursive.destroy();
    },
    targetMean: 0.00088,
    version: 1.0
});

BF.register({
    name: "IterativeProcessing",
    path: "scripts/benchmarks/turbulenz/js/recursive_iterative.js",
    description: [
        "Creates a node structure of fixed depth with children.",
        "Processes the node structure by pushing each node onto the stack, unpacking each node's children and accumulating the depth",
        "This test is comparable to recursive processing the same node structure"
    ],
    init: function () {
        return iterative.init();
    },
    run: function () {
        return iterative.run();
    },
    destroy: function () {
        return iterative.destroy();
    },
    targetMean: 0.00093,
    version: 1.0
});
