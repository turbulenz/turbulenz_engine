// Copyright (c) 2010-2011 Turbulenz Limited

/*global BF: false*/

declare var BF;

//
//  Access Array Index vs Access Object Property
//

//
//  ArrayAccess: Access an array by index
//
class ArrayAccess
{
    // Settings
    n = 10000; // Number of arrays to access items from

    array: number[][];
    results: any[];

    init()
    {
        var array = [];
        var n = this.n;
        array.length = n;
        for (var i = 0; i < n; i += 1)
        {
            // Create a new array
            array[i] = [ 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000 ];
        }
        this.array = array;
        this.results = [];
    };

    run()
    {
        var array = this.array;
        var length = array.length;
        for (var i = 0; i < length; i += 1)
        {
            var arr = array[i];
            // Added together in a fixed, but unsequential order
            this.results[i] = (arr[5] +
                               arr[9] +
                               arr[7] +
                               arr[2] +
                               arr[1] +
                               arr[0] +
                               arr[4] +
                               arr[3] +
                               arr[8] +
                               arr[6]);
        }
    };

    destroy()
    {
        this.array = [];
    };

    // Constructor function
    static create()
    {
        var a = new ArrayAccess();
        a.array = [];
        a.results = [];
        return a;
    };
};

//
//  ArrayUnknownAccess: Access an array by an unknown index
//
class ArrayUnknownAccess
{
    // Settings
    n = 10000; // Number of arrays to access items from

    array: number[][];
    indices: number[];
    results: any[];

    init()
    {
        var array = [];
        var n = this.n;
        array.length = n;
        for (var i = 0; i < n; i += 1)
        {
            // Create a new array
            array[i] = [ 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000 ];
        }
        // Added together in a fixed, but unsequential order
        this.indices = [ 5, 9, 7, 2, 1, 0, 4, 3, 8, 6 ];
        this.array = array;
        this.results = [];
    };

    run()
    {
        var array = this.array;
        var length = array.length;
        var indices = this.indices;

        for (var i = 0; i < length; i += 1)
        {
            var arr = array[i];
            this.results[i] = (arr[indices[0]] +
                               arr[indices[1]] +
                               arr[indices[2]] +
                               arr[indices[3]] +
                               arr[indices[4]] +
                               arr[indices[5]] +
                               arr[indices[6]] +
                               arr[indices[7]] +
                               arr[indices[8]] +
                               arr[indices[9]]);
        }
    };

    destroy()
    {
        this.indices = [];
        this.array = [];
        this.results = [];
    };

    // Constructor function
    static create()
    {
        var a = new ArrayUnknownAccess();
        a.array = [];
        a.indices = [];
        a.results = [];
        return a;
    };
};

//
//  ObjectAccess: Access an object by property
//
class ObjectAccess
{
    // Settings
    n = 10000; // Number of objects to access properties from

    array: any[];
    results: any[];

    init()
    {
        var array = [];
        var n = this.n;
        array.length = n;
        for (var i = 0; i < n; i += 1)
        {
            // Create a new object
            array[i] = {
                a: 100,
                b: 200,
                c: 300,
                d: 400,
                e: 500,
                f: 600,
                g: 700,
                h: 800,
                i: 900,
                j: 1000
            };
        }
        this.array = array;
        this.results = [];
    };

    run()
    {
        var array = this.array;
        var length = array.length;
        for (var i = 0; i < length; i += 1)
        {
            var obj = array[i];
            // Added together in a fixed, but unsequential order
            this.results[i] = (obj.f +
                            obj.j +
                            obj.h +
                            obj.c +
                            obj.b +
                            obj.a +
                            obj.e +
                            obj.d +
                            obj.i +
                            obj.g);
        }
    };

    destroy()
    {
        this.array = [];
        this.results = [];
    };

    // Constructor function
    static create()
    {
        var a = new ObjectAccess();
        a.array = [];
        a.results = [];
        return a;
    };
};

//
//  ObjectAccessAlt: Access an object by property using []
//
class ObjectAccessAlt
{
    // Settings
    n = 10000; // Number of objects to access properties from

    array: any[];
    results: any[];

    init()
    {
        var array = [];
        var n = this.n;
        array.length = n;
        for (var i = 0; i < n; i += 1)
        {
            // Create a new object
            array[i] = {
                a: 100,
                b: 200,
                c: 300,
                d: 400,
                e: 500,
                f: 600,
                g: 700,
                h: 800,
                i: 900,
                j: 1000
            };
        }
        this.array = array;
        this.results = [];
    };

    run()
    {
        var array = this.array;
        var length = array.length;
        for (var i = 0; i < length; i += 1)
        {
            var obj = array[i];
            // Added together in a fixed, but unsequential order
            /*jslint sub: true */
            this.results[i] = (obj['f'] +
                               obj['j'] +
                               obj['h'] +
                               obj['c'] +
                               obj['b'] +
                               obj['a'] +
                               obj['e'] +
                               obj['d'] +
                               obj['i'] +
                               obj['g']);
            /*jslint sub: false */
        }
    };

    destroy()
    {
        this.array = [];
        this.results = [];
    };

    // Constructor function
    static create()
    {
        var a = new ObjectAccessAlt();
        a.array = [];
        a.results = [];
        return a;
    };
};

//
//  ObjectUnknownAccess: Access an object by unknown property
//
class ObjectUnknownAccess
{
    // Settings
    n = 10000; // Number of objects to access properties from

    array: any[];
    results: any[];
    properties: any;

    init()
    {
        var array = [];
        var n = this.n;
        array.length = n;
        for (var i = 0; i < n; i += 1)
        {
            // Create a new object
            array[i] = {
                a: 100,
                b: 200,
                c: 300,
                d: 400,
                e: 500,
                f: 600,
                g: 700,
                h: 800,
                i: 900,
                j: 1000
            };
        }
        this.properties = ['f', 'j', 'h', 'c', 'b', 'a', 'e', 'd', 'i', 'g'];
        this.array = array;
        this.results = [];
    };

    run()
    {
        var array = this.array;
        var length = array.length;
        var properties = this.properties;

        for (var i = 0; i < length; i += 1)
        {
            var obj = array[i];
            this.results[i] = (obj[properties[0]] +
                               obj[properties[1]] +
                               obj[properties[2]] +
                               obj[properties[3]] +
                               obj[properties[4]] +
                               obj[properties[5]] +
                               obj[properties[6]] +
                               obj[properties[7]] +
                               obj[properties[8]] +
                               obj[properties[9]]);
        }
    };

    destroy()
    {
        this.properties = [];
        this.array = [];
        this.results = [];
    };

    // Constructor function
    static create()
    {
        var a = new ObjectUnknownAccess();
        a.array = [];
        a.results = [];
        a.properties = [];
        return a;
    };
};

var objectAccess = ObjectAccess.create();
var objectAccessAlt = ObjectAccessAlt.create();
var objectUnknownAccess = ObjectUnknownAccess.create();
var arrayAccess = ArrayAccess.create();
var arrayUnknownAccess = ArrayUnknownAccess.create();

BF.register({
    name: "AccessObjectProperty",
    path: "scripts/benchmarks/turbulenz/js/object_array_access.js",
    description: [
        "Creates 'n' objects each with properties a to j. For each object, a to j are accessed directly e.g. 'obj.a' and added together"
    ],
    init: function () {
        return objectAccess.init();
    },
    run: function () {
        return objectAccess.run();
    },
    destroy: function () {
        return objectAccess.destroy();
    },
    targetMean: 0.00039,
    version: 1.1
});

BF.register({
    name: "AccessObjectPropertyAlt",
    path: "scripts/benchmarks/turbulenz/js/object_array_access.js",
    description: [
        "Creates 'n' objects each with properties a to j. For each object, a to j are accessed directly e.g. 'obj['a']' and added together"
    ],
    init: function () {
        return objectAccessAlt.init();
    },
    run: function () {
        return objectAccessAlt.run();
    },
    destroy: function () {
        return objectAccessAlt.destroy();
    },
    targetMean: 0.00039,
    version: 1.1
});

BF.register({
    name: "AccessObjectUnknownProperty",
    path: "scripts/benchmarks/turbulenz/js/object_array_access.js",
    description: [
        "Creates 'n' objects each with properties a to j. For each object, a to j are accessed using [] e.g. 'obj['a']' and added together.",
        "To ensure that 'obj['a']' is not the same as to 'obj.a', a function getProperty(index) is used to make sure the property is unknown before run-time"
    ],
    init: function () {
        return objectUnknownAccess.init();
    },
    run: function () {
        return objectUnknownAccess.run();
    },
    destroy: function () {
        return objectUnknownAccess.destroy();
    },
    targetMean: 0.00298,
    version: 1.1
});

BF.register({
    name: "AccessArrayIndex",
    path: "scripts/benchmarks/turbulenz/js/object_array_access.js",
    description: [
        "Creates 'n' arrays each with values from index 0 to 9. For each array, 0 to 9 are accessed e.g. 'arr[0]' and added together"
    ],
    init: function () {
        return arrayAccess.init();
    },
    run: function () {
        return arrayAccess.run();
    },
    destroy: function () {
        return arrayAccess.destroy();
    },
    targetMean: 0.00041,
    version: 1.1
});

BF.register({
    name: "AccessArrayUnknownIndex",
    path: "scripts/benchmarks/turbulenz/js/object_array_access.js",
    description: [
        "Creates 'n' arrays each with values from index 0 to 9. For each array, 0 to 9 are accessed e.g. 'arr[index]' and added together",
        "To ensure the that 'arr[index]' where index = 0 is not evaluated to 'arr[0]', a function getIndex() is used to make sure the index is unknown before run-time"
    ],
    init: function () {
        return arrayUnknownAccess.init();
    },
    run: function () {
        return arrayUnknownAccess.run();
    },
    destroy: function () {
        return arrayUnknownAccess.destroy();
    },
    targetMean: 0.00057,
    version: 1.1
});
