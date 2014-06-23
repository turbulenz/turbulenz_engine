// Copyright (c) 2012-2014 Turbulenz Limited

// For V8 stack traces

interface IError
{
    new (message?: string): Error;
    (message?: string): Error;
    prototype: Error;
    captureStackTrace?(a: any, b: any): any;
}
interface IErrorStackResult
{
    stack: string;
}

// The debug object is only available in debug modes.  The build tools
// will automatically include it or prevent it from being included
// based on the build mode.
//
// Always use this in the form:
//
//   debug.assert(x === y, "X must equal Y");
//
// and avoid caching either debug or assert:
//
//   var d = debug;
//   d.assert(....);
//
//   var a = debug.assert;
//   a.call(debug, ....);
//
// etc...

interface TurbulenzDebug
{
    reportAssert(msg: string): void;
    abort(msg: string): void;
    assert(condition: any, msg?: string): void;
    log(msg: string): void;

    /// Call the given function.  No returns values are propagated.
    evaluate(fn: { (): void; }): void;

    isNumber(s: any): boolean;

    /// Optionally call the performance warning callback
    isMathType(v): boolean;

    isVec2(v): boolean;
    isVec3(v): boolean;
    isVec4(v): boolean;
    isAABB(v): boolean;
    isQuat(v): boolean;
    isMtx33(v): boolean;
    isMtx43(v): boolean;
    isMtx34(v): boolean;
    isMtx44(v): boolean;
    isQuatPos(v): boolean;
}

var debug : TurbulenzDebug = {

    // Override this to change the behaviour when asserts are
    // triggered.  Default logs the message to the console and then
    // throws an exception.
    reportAssert : function debugReportAssertFn(msg)
    {
        var fnName;
        var stackTrace;

        if ('undefined' !== typeof Error && ((<IError>Error).captureStackTrace))
        {
            var getStackTrace = function debugReportAssertGetStackTraceFn()
            {
                var obj = {};
                (<IError>Error).captureStackTrace(obj, getStackTrace);
                stackTrace = (<IErrorStackResult>obj).stack;

                // Attempt to get the name of the function in which
                // debug.assert was called.

                var fnFrame = stackTrace.split("\n")[3];
                fnName = fnFrame.substr(fnFrame.indexOf("at ") + 3);
            };
            getStackTrace();
        }

        if (fnName)
        {
            msg = "ASSERT at " + fnName + ": " + msg;
        }
        else
        {
            msg = "ASSERT: " + msg;
        }

        // plugin does not have a "console" object
        // web workers do not have a "window" object
        var consoleObj;

        if (typeof console !== 'undefined')
        {
            consoleObj = console;
        }
        if (typeof window !== 'undefined')
        {
            consoleObj = window.console;
        }

        if (consoleObj)
        {
            consoleObj.log(msg);

            if (stackTrace)
            {
                consoleObj.log(stackTrace);
            }
        }

        throw msg;
    },

    abort : function debugAbortFn(msg)
    {
        debug.reportAssert(msg);
    },

    // Basic assertion that a condition is true.
    assert : function debugAssertFn(condition, msg?)
    {
        if (!condition)
        {
            if (!msg)
            {
                msg = "Unlabelled assert";
            }
            // TODO : Grab information about the caller?
            debug.reportAssert(msg);
        }
    },

    log : function debugAssertLogFn(msg)
    {
        window.console.log(msg);
    },

    evaluate : function debugEvaluateFn(fn: { (): void; })
    {
        fn();
    },

    isNumber : function debugIsNumber(s)
    {
        return "number" === typeof s;
    },

    isMathType : function isMathTypeFn(v)
    {
        if (v instanceof Float32Array)
        {
            return true;
        }

        // For now, math type errors do not generate a full assert
        // (hence we return true).  They just trigger the callback.

        if (TurbulenzEngine.onperformancewarning)
        {
            TurbulenzEngine.onperformancewarning(
                "Object is not of type Float32Array.  If this message appears "
                + "frequently, performance of your game may be affected.");
        }

        return true;
    },

    isVec2 : function debugIsVec2Fn(v)
    {
        return (2 === v.length);
    },

    isVec3 : function debugIsVec3Fn(v)
    {
        return (3 === v.length);
    },

    isVec4 : function debugIsVec4Fn(v)
    {
        return (4 === v.length);
    },

    isAABB : function debugIsAABBFn(v)
    {
        return (6 === v.length);
    },

    isQuat : function debugIsQuatFn(v)
    {
        return (4 === v.length);
    },

    isMtx33 : function debugIsMtx33Fn(v)
    {
        return (9 === v.length);
    },

    isMtx43 : function debugIsMtx43Fn(v)
    {
        return (12 === v.length);
    },

    isMtx34 : function debugIsMtx34Fn(v)
    {
        return (12 === v.length);
    },

    isMtx44 : function debugIsMtx44Fn(v)
    {
        return (16 === v.length);
    },

    isQuatPos : function debugIsQuatPos(v)
    {
        return (7 === v.length);
    }
};
