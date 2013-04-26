// Copyright (c) 2010-2011 Turbulenz Limited

/*global BF: false*/

declare var BF;

//
//  Passing vars vs `this` scope vs outer scope
//

//
//  VariablePass: Call a function, passing a required parameter
//
class VariablePass
{
    // Settings
    n = 10000; // Number of function calls to make

    init()
    {

    };

    run()
    {
        var a, b, c, d, e; // Variables that needs to be accessed
        var n = this.n;

        // Fake random function, used to avoid JavaScript Engine optimization
        var random = function randomFn(seed)
        {
            return seed;
        };

        var func1 = function func1Fn(a, b, c, d, e)
        {
            return ((a * a) *
                    (b * b) *
                    (c * c) *
                    (d * d) *
                    (e * e));
        };

        for (var i = 0; i < n; i += 1)
        {
            a = random(i);
            b = a * 0.8;
            c = b * 0.4;
            d = c * 0.2;
            e = d * 0.1;

            a = func1(a, b, c, d, e);
            b = func1(a, b, c, d, e);
            c = func1(a, b, c, d, e);
            d = func1(a, b, c, d, e);
            e = func1(a, b, c, d, e);
        }
    };

    destroy()
    {

    };

    // Constructor function
    static create()
    {
        var p = new VariablePass();
        return p;
    };

};

//
//  VariableScopeThis: Call a function, accessing variables from `this` pointer
//
class VariableScopeThis
{
    // Settings
    n = 10000; // Number of function calls to make

    a: number;
    b: number;
    c: number;
    d: number;
    e: number;

    func4()
    {
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var e = this.e;
        return ((a * a) *
                (b * b) *
                (c * c) *
                (d * d) *
                (e * e));
    };

    init()
    {
        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.d = 0;
        this.e = 0;
    };

    run()
    {
        var n = this.n;

        // Fake random function, used to avoid JavaScript Engine optimization
        var random = function randomFn(seed)
        {
            return seed;
        };

        for (var i = 0; i < n; i += 1)
        {
            this.a = random(i);
            this.b = this.a * 0.8;
            this.c = this.b * 0.4;
            this.d = this.c * 0.2;
            this.e = this.d * 0.1;

            this.a = this.func4();
            this.b = this.func4();
            this.c = this.func4();
            this.d = this.func4();
            this.e = this.func4();
        }
    };

    destroy()
    {

    };

    // Constructor function
    static create()
    {
        var p = new VariableScopeThis();
        p.a = 0;
        p.b = 0;
        p.c = 0;
        p.d = 0;
        p.e = 0;
        return p;
    };
};

//
//  VariableScopeOuter: Call a function, accessing the parameters from outer scope
//
class VariableScopeOuter
{
    // Settings
    n = 10000; // Number of function calls to make

    init()
    {

    };

    run()
    {
        var a, b, c, d, e; // Variables that needs to be accessed
        var n = this.n;

        // Fake random function, used to avoid JavaScript Engine optimization
        var random = function randomFn(seed)
        {
            return seed;
        };

        var func2 = function func2Fn()
        {
            return ((a * a) *
                    (b * b) *
                    (c * c) *
                    (d * d) *
                    (e * e));
        };

        for (var i = 0; i < n; i += 1)
        {
            a = random(i);
            b = a * 0.8;
            c = b * 0.4;
            d = c * 0.2;
            e = d * 0.1;

            a = func2();
            b = func2();
            c = func2();
            d = func2();
            e = func2();
        }
    };

    destroy()
    {

    };

    // Constructor function
    static create()
    {
        var p = new VariableScopeOuter();
        return p;
    };
};

var variablePass = VariablePass.create();
var variableScopeThis = VariableScopeThis.create();
var variableScopeOuter = VariableScopeOuter.create();

BF.register({
    name: "VariablePass",
    path: "scripts/benchmarks/turbulenz/js/passing_params.js",
    description: [
        "Assigns random values to a number of variables, which are then utilised by a function.",
        "The variables are passed to the function, then used in the calculation.",
        "The function call is repeated 'n' times with different values each time to ensure the variables aren't cached.",
        "This test can be used to investigate the cost of accessing variables stored in undetermined locations vs the cost of moving variables to a known location."
    ],
    init: function () {
        return variablePass.init();
    },
    run: function () {
        return variablePass.run();
    },
    destroy: function () {
        return variablePass.destroy();
    },
    targetMean: 0.00150,
    version: 1.2
});

BF.register({
    name: "VariableScopeThis",
    path: "scripts/benchmarks/turbulenz/js/passing_params.js",
    description: [
        "Assigns random values to a number of variables, which are then utilised by a function.",
        "The variables are passed to the function having first been accessed via the this pointer, then used in the calculation.",
        "The function call is repeated 'n' times with different values each time to ensure the variables aren't cached.",
        "This test can be used to investigate the cost of accessing variables stored in undetermined locations vs the cost of moving variables to a known location."
    ],
    init: function () {
        return variableScopeThis.init();
    },
    run: function () {
        return variableScopeThis.run();
    },
    destroy: function () {
        return variableScopeThis.destroy();
    },
    targetMean: 0.00213,
    version: 1.2
});

BF.register({
    name: "VariableScopeOuter",
    path: "scripts/benchmarks/turbulenz/js/passing_params.js",
    description: [
        "Assigns random values to a number of variables, which are then utilised by a function.",
        "The variables are available for the function to access, without the need to pass them.",
        "The function call is repeated 'n' times with different values each time to ensure the variables aren't cached.",
        "This test can be used to investigate the cost of accessing variables stored in undetermined locations vs the cost of moving variables to a known location."
    ],
    init: function () {
        return variableScopeOuter.init();
    },
    run: function () {
        return variableScopeOuter.run();
    },
    destroy: function () {
        return variableScopeOuter.destroy();
    },
    targetMean: 0.00271,
    version: 1.2
});
