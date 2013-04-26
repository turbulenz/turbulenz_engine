// Copyright (c) 2012 Turbulenz Limited

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

var debug = {

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

        window.console.log(msg);

        if (stackTrace)
        {
            window.console.log(stackTrace);
        }

        throw msg;
    },

    abort : function debugAbortFn(msg)
    {
        debug.reportAssert(msg);
    },

    // Basic assertion that a condition is true.
    assert : function debugAssertFn(condition, msg)
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
    }

};
