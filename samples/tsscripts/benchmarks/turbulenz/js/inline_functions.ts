// Copyright (c) 2010-2011 Turbulenz Limited

/*global BF: false*/

declare var BF;

//
//  Inline functions vs non-inline functions
//

//
//  Inline function: Call an inline version of a math function
//
class InlineFunction
{
    // Settings
    n = 10000; // Number of times to call the function

    array: any[];

    init()
    {
        var n = this.n;
        var array = [];
        var angle = Math.PI / 6;
        var inc = (Math.PI * 2) / n; // n increments

        for (var i = 0; i < n; i += 1)
        {
            // Constant angle so the execution route is the same for all calculations
            var theta = (i * inc);
            var thetaAngle = theta + angle;
            array[i] = {
                    j1: [theta, theta, theta, theta],
                    j2: [thetaAngle, thetaAngle, thetaAngle, thetaAngle],
                    quatRes: []
                };
        }
        this.array = array;
    };

    run()
    {
        var array = this.array;
        var n = this.n;

        // Constants
        var delta = 0.1;
        var cosMinSlerpAngle = Math.cos(Math.PI / 40.0);
        var sqrt = Math.sqrt;
        var sin = Math.sin;
        var acos = Math.acos;

        for (var i = 0; i < n; i += 1)
        {
            var obj = array[i];
            var j1 = obj.j1;
            var j2 = obj.j2;
            //
            // INLINED: var quatResult = VMath.quatslerp(j1[0..3], j2[0..3], delta);
            //
            // A version of quatslerp from VMath library
            //
            var t = delta;
            var q1x = j1[0];
            var q1y = j1[1];
            var q1z = j1[2];
            var q1w = j1[3];
            var q2x = j2[0];
            var q2y = j2[1];
            var q2z = j2[2];
            var q2w = j2[3];
            var dotq1q2 = (q1x * q2x) + (q1y * q2y) + (q1z * q2z) + (q1w * q2w);
            var cosom = dotq1q2;
            if (cosom < 0.0)
            {
                q1x = -q1x;
                q1y = -q1y;
                q1z = -q1z;
                q1w = -q1w;
                cosom = -cosom;
            }

            if (cosom > cosMinSlerpAngle)
            {
                if (dotq1q2 <= 0.0)
                {
                    t = -t;
                }
                var qrx = ((q2x - q1x) * t) + q1x;
                var qry = ((q2y - q1y) * t) + q1y;
                var qrz = ((q2z - q1z) * t) + q1z;
                var qrw = ((q2w - q1w) * t) + q1w;

                var mag = sqrt((qrx * qrx) + (qry * qry) + (qrz * qrz) + (qrw * qrw));
                var recip = 1.0 / mag;

                obj.quatRes = [qrx * recip, qry * recip, qrz * recip, qrw * recip];
            }
            else
            {
                var omega = acos(cosom);
                var inv_sin_omega = 1.0 / sin(omega);
                var scalar = sin((1.0 - t) * omega) * inv_sin_omega;
                q1x = q1x * scalar;
                q1y = q1y * scalar;
                q1z = q1z * scalar;
                q1w = q1w * scalar;
                scalar = sin(t * omega) * inv_sin_omega;
                q2x = q2x * scalar;
                q2y = q2y * scalar;
                q2z = q2z * scalar;
                q2w = q2w * scalar;

                obj.quatRes = [q1x + q2x, q1y + q2y, q1z + q2z, q1w + q2w];
            }
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
        var a = new InlineFunction();
        a.array = [];
        return a;
    };
};

//
//  Non-inline function: Call the non-inline version of a math function
//
class NonInlineFunction
{
    // Settings
    n = 10000; // Number of times to call the function

    array: any[];

    init()
    {
        var n = this.n;
        var array = [];
        var angle = Math.PI / 6;
        var inc = (Math.PI * 2) / n; // n increments

        for (var i = 0; i < n; i += 1)
        {
            // Constant angle so the execution route is the same for all calculations
            var theta = (i * inc);
            var thetaAngle = theta + angle;
            array[i] = {
                    j1: [theta, theta, theta, theta],
                    j2: [thetaAngle, thetaAngle, thetaAngle, thetaAngle],
                    quatRes: []
                };
        }
        this.array = array;
    };

    run()
    {
        var array = this.array;
        var n = this.n;

        // Constants
        var delta = 0.1;
        var cosMinSlerpAngle = Math.cos(Math.PI / 40.0);
        var sqrt = Math.sqrt;
        var sin = Math.sin;
        var acos = Math.acos;

        // Non-inline function
        var quatslerp = function quatslerpFn(j1, j2, delta)
        {
            //
            // A version of quatslerp from VMath library
            //
            var t = delta;
            var q1x = j1[0];
            var q1y = j1[1];
            var q1z = j1[2];
            var q1w = j1[3];
            var q2x = j2[0];
            var q2y = j2[1];
            var q2z = j2[2];
            var q2w = j2[3];
            var dotq1q2 = (q1x * q2x) + (q1y * q2y) + (q1z * q2z) + (q1w * q2w);
            var cosom = dotq1q2;
            if (cosom < 0.0)
            {
                q1x = -q1x;
                q1y = -q1y;
                q1z = -q1z;
                q1w = -q1w;
                cosom = -cosom;
            }

            if (cosom > cosMinSlerpAngle)
            {
                if (dotq1q2 <= 0.0)
                {
                    t = -t;
                }
                var qrx = ((q2x - q1x) * t) + q1x;
                var qry = ((q2y - q1y) * t) + q1y;
                var qrz = ((q2z - q1z) * t) + q1z;
                var qrw = ((q2w - q1w) * t) + q1w;

                var mag = sqrt((qrx * qrx) + (qry * qry) + (qrz * qrz) + (qrw * qrw));
                var recip = 1.0 / mag;

                return [qrx * recip, qry * recip, qrz * recip, qrw * recip];
            }
            else
            {
                var omega = acos(cosom);
                var inv_sin_omega = 1.0 / sin(omega);
                var scalar = sin((1.0 - t) * omega) * inv_sin_omega;
                q1x = q1x * scalar;
                q1y = q1y * scalar;
                q1z = q1z * scalar;
                q1w = q1w * scalar;
                scalar = sin(t * omega) * inv_sin_omega;
                q2x = q2x * scalar;
                q2y = q2y * scalar;
                q2z = q2z * scalar;
                q2w = q2w * scalar;

                return [q1x + q2x, q1y + q2y, q1z + q2z, q1w + q2w];
            }
        };

        for (var i = 0; i < n; i += 1)
        {
            var obj = array[i];
            var j1 = obj.j1;
            var j2 = obj.j2;

            obj.quatRes = quatslerp(j1, j2, delta);
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
        var a = new NonInlineFunction();
        a.array = [];
        return a;
    };
};

var inlineFunction = InlineFunction.create();
var nonInlineFunction = NonInlineFunction.create();

BF.register({
    name: "InlineFunction",
    path: "scripts/benchmarks/turbulenz/js/inline_functions.js",
    description: [
        "Stores n objects containing a unique pair of quaternions each.",
        "For each object runs an inline version of quatSlerp function on the arguments and assigns the result to the object."
    ],
    init: function () {
        return inlineFunction.init();
    },
    run: function () {
        return inlineFunction.run();
    },
    destroy: function () {
        return inlineFunction.destroy();
    },
    targetMean: 0.00177,
    version: 1.1
});

BF.register({
    name: "NonInlineFunctions",
    path: "scripts/benchmarks/turbulenz/js/inline_functions.js",
    description: [
        "Stores n objects containing a unique pair of quaternions each.",
        "For each object calls a non-inlined version of the quatSlerp function on the arguments and assigns the returned result to the object."
    ],
    init: function () {
        return nonInlineFunction.init();
    },
    run: function () {
        return nonInlineFunction.run();
    },
    destroy: function () {
        return nonInlineFunction.destroy();
    },
    targetMean: 0.00201,
    version: 1.1
});
