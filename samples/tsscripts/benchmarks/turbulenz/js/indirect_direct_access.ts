// Copyright (c) 2010-2011 Turbulenz Limited

/*global BF: false*/

//
//  Access functions directly from an object vs Access functions indirectly from an object
//

//
//  DirectAccess: Tests directly accessing Math.sin
//
class DirectAccess
{
    // Settings
    n = 10000; // Number of angles to calculate

    angles: number[];
    result: number;

    init()
    {
        var angles = [];
        var n = this.n;
        var pi2 = Math.PI * 2;
        for (var i = 0; i < n; i += 1)
        {
            angles[i] = pi2 * (i / n);
        }
        this.angles = angles;
    }

    run()
    {
        var angles = this.angles;
        var length = angles.length;
        var result;
        for (var i = 0; i < length; i += 1)
        {
            result = Math.sin(angles[i]);
        }
        this.result = result;
    }

    destroy()
    {
        var angles = this.angles;
        var length = angles.length;
        this.result = 0;
        for (var i = 0; i < length; i += 1)
        {
            delete angles[i];
        }
        delete this.angles;
    }

    // Constructor function
    static create()
    {
        var d = new DirectAccess();
        d.angles = [];
        d.result = 0;
        return d;
    }
}

//
//  IndirectAccess: Tests accessing an assigned value of sin
//
class IndirectAccess
{
    // Settings
    n = 10000; // Number of angles to calculate

    angles: number[];
    result: number;

    init()
    {
        var angles = [];
        var n = this.n;
        var pi2 = Math.PI * 2;
        for (var i = 0; i < n; i += 1)
        {
            angles[i] = pi2 * (i / n);
        }
        this.angles = angles;
    }

    run()
    {
        var angles = this.angles;
        var length = angles.length;
        var sin = Math.sin;
        var result;
        for (var i = 0; i < length; i += 1)
        {
            result = sin(angles[i]);
        }
        this.result = result;
    }

    destroy()
    {
        var angles = this.angles;
        var length = angles.length;
        this.result = 0;
        for (var i = 0; i < length; i += 1)
        {
            delete angles[i];
        }
        delete this.angles;
    }

    // Constructor function
    static create()
    {
        var i = new IndirectAccess();
        i.angles = [];
        i.result = 0;
        return i;
    }
}

var directAccess = DirectAccess.create();
var indirectAccess = IndirectAccess.create();

BF.register({
    name: "DirectFunctionAccess",
    path: "scripts/benchmarks/turbulenz/js/indirect_direct_access.js",
    description: [
        "Creates an array storing 'n' unique angles. For each angle calculates sin(angle) directly accessing 'sin' from the javascript Math object.",
        "This test is comparable with taking a reference to 'sin' and calling the function indirectly."
    ],
    init: function () {
        return directAccess.init();
    },
    run: function () {
        return directAccess.run();
    },
    destroy: function () {
        return directAccess.destroy();
    },
    targetMean: 0.00044,
    version: 1.0
});

BF.register({
    name: "IndirectFunctionAccess",
    path: "scripts/benchmarks/turbulenz/js/indirect_direct_access.js",
    description: [
        "Creates an array storing 'n' unique angles. For each angle calculates sin(angle) indirectly accessing 'sin' by creating 'var sin' and assigning the 'Math.sin' function to it.",
        "This test is comparable with directly accessing the function from the Math object."
    ],
    init: function () {
        return indirectAccess.init();
    },
    run: function () {
        return indirectAccess.run();
    },
    destroy: function () {
        return indirectAccess.destroy();
    },
    targetMean: 0.00043,
    version: 1.0
});
