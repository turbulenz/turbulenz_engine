// Copyright (c) 2010-2011 Turbulenz Limited

/*global BF: false*/

declare var BF;

//
//  Access properties on object vs Get/Set properties on object
//

//
//  GetSetObjectToAccess: Example Object to be stored
//
class GetSetObjectToAccess
{
    a: number;
    b: number;

    getA()
    {
        return this.a;
    };

    setA(a)
    {
        this.a = a;
    };

    getB()
    {
        return this.b;
    };

    setB(b)
    {
        this.b = b;
    };

    // Constructor function
    static create(i)
    {
        var o = new GetSetObjectToAccess();
        o.a = i;
        o.b = 0;
        return o;
    };
};

//
//  AccessProperty: Iterate over objects and directly access the property on it
//
class AccessProperty
{
    // Settings
    n = 10000; // Number of objects to access

    array: GetSetObjectToAccess[];

    init()
    {
        var array = [];
        var n = this.n;
        for (var i = 0; i < n; i += 1)
        {
            array[i] = GetSetObjectToAccess.create(i);
        }
        this.array = array;
    };

    run()
    {
        var array = this.array;
        var n = this.n;
        var obj;
        var a = n;
        for (var i = 0; i < n; i += 1)
        {
            obj = array[i];
            obj.b = a;
            a = obj.a;
        }
    };

    destroy()
    {
        var n = this.n;
        var array = this.array;
        for (var i = 0; i < n; i += 1)
        {
            delete array[i];
        }
        delete this.array;
    };

    // Constructor function
    static create()
    {
        var a = new AccessProperty();
        a.array = [];
        return a;
    };
};

//
//  GetSetProperty: Iterate over objects and use get and set to access the property
//
class GetSetProperty
{
    // Settings
    n = 10000; // Number of objects to access

    array: GetSetObjectToAccess[];

    init()
    {
        var array = [];
        var n = this.n;
        for (var i = 0; i < n; i += 1)
        {
            array[i] = GetSetObjectToAccess.create(i);
        }
        this.array = array;
    };

    run()
    {
        var array = this.array;
        var n = this.n;
        var obj;
        var a = n;
        for (var i = 0; i < n; i += 1)
        {
            obj = array[i];
            obj.setB(a);
            a = obj.getA();
        }
    };

    destroy()
    {
        var n = this.n;
        var array = this.array;
        for (var i = 0; i < n; i += 1)
        {
            delete array[i];
        }
        delete this.array;
    };

    // Constructor function
    static create()
    {
        var a = new GetSetProperty();
        a.array = [];
        return a;
    };
};

var accessProperty = AccessProperty.create();
var getsetProperty = GetSetProperty.create();

BF.register({
    name: "AccessProperty",
    path: "scripts/benchmarks/turbulenz/js/get_set_properties.js",
    description: [
        "Stores a number of objects, each with a different values for their properties, in an array.",
        "Loops over the array, directly assigning the value from the previous element and temporarily storing the element directly accessed from the object.",
        "The result of this operation is to pass the value of an object to the next object in the array."
    ],
    init: function () {
        return accessProperty.init();
    },
    run: function () {
        return accessProperty.run();
    },
    destroy: function () {
        return accessProperty.destroy();
    },
    targetMean: 0.00009,
    version: 1.0
});

BF.register({
    name: "GetSetProperty",
    path: "scripts/benchmarks/turbulenz/js/get_set_properties.js",
    description: [
        "Stores a number of objects, each with a different values for their properties, in an array.",
        "Loops over the array, using setB() to assign the value from the previous element and temporarily storing the element accessed using getA() from the object.",
        "The result of this operation is to pass the value of an object to the next object in the array."
    ],
    init: function () {
        return getsetProperty.init();
    },
    run: function () {
        return getsetProperty.run();
    },
    destroy: function () {
        return getsetProperty.destroy();
    },
    targetMean: 0.00016,
    version: 1.0
});
