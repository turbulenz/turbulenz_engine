// Copyright (c) 2010-2011 Turbulenz Limited

/*global BF: false*/

//
//  Iterate over Array vs Iterate over Object
//

//
//  IterateObjectToAccess: Example Object to be stored
//
class IterateObjectToAccess
{
    a: number;
    b: number;
    result: number;

    sum()
    {
        return (this.a + this.b);
    }

    // Constructor function
    static create()
    {
        var o = new IterateObjectToAccess();
        o.a = 123456789;
        o.b = 987654321;
        o.result = 0;
        return o;
    }
}

//
//  IterateObject: Iterate over objects stored as properties on an object
//
class IterateObject
{
    // Settings
    n = 10000; // Number of objects to access

    object: any;

    init()
    {
        var object = {};
        var n = this.n;
        for (var i = 0; i < n; i += 1)
        {
            object[i] = IterateObjectToAccess.create();
        }
        this.object = object;
    }

    run()
    {
        var object = this.object;
        for (var n in object)
        {
            if (object.hasOwnProperty(n))
            {
                var obj = object[n];
                obj.result = obj.sum();
            }
        }
    }

    destroy()
    {
        var object = this.object;
        for (var n in object)
        {
            if (object.hasOwnProperty(n))
            {
                delete (object[n]);
            }
        }
        delete this.object;
    }

    // Constructor function
    static create()
    {
        var i = new IterateObject();
        i.object = {};
        return i;
    }
}

//
//  IterateArray: Iterate over objects stored as items in an array
//
class IterateArray
{
    // Settings
    n = 10000; // Number of objects to access

    array: IterateObjectToAccess[];

    init()
    {
        var array = [];
        var n = this.n;
        for (var i = 0; i < n; i += 1)
        {
            array[i] = IterateObjectToAccess.create();
        }
        this.array = array;
    }

    run()
    {
        var array = this.array;
        var length = array.length;
        for (var i = 0; i < length; i += 1)
        {
            var obj = array[i];
            obj.result = obj.sum();
        }
    }

    destroy()
    {
        var array = this.array;
        var length = array.length;
        for (var i = 0; i < length; i += 1)
        {
            delete (array[i]);
        }
        delete this.array;
    }

    // Constructor function
    static create()
    {
        var i = new IterateArray();
        i.array = [];
        return i;
    }
}

var iterateArray = IterateArray.create();
var iterateObject = IterateObject.create();

BF.register({
    name: "IterateArrayAccess",
    path: "scripts/benchmarks/turbulenz/js/iterate_object_array.js",
    description: [
        "Stores a number of identical objects, each with a different reference (in an array) then accesses those objects from the array by index.",
        "This test can be used to compare access of object from arrays compared to access properties on an object."
    ],
    init: function () {
        return iterateArray.init();
    },
    run: function () {
        return iterateArray.run();
    },
    destroy: function () {
        return iterateArray.destroy();
    },
    targetMean: 0.00017,
    version: 1.1
});

BF.register({
    name: "IterateObjectAccess",
    path: "scripts/benchmarks/turbulenz/js/iterate_object_array.js",
    description: [
        "Stores a number of identical objects, each with a different reference (as properties on an object) then accesses those objects from the object by name.",
        "This test can be used to compare access of object from arrays compared to access properties on an object."
    ],
    init: function () {
        return iterateObject.init();
    },
    run: function () {
        return iterateObject.run();
    },
    destroy: function () {
        return iterateObject.destroy();
    },
    targetMean: 0.00235,
    version: 1.1
});
