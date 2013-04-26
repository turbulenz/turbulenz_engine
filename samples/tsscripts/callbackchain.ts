// Copyright (c) 2011-2012 Turbulenz Limited

/*exported enterCallbackChain*/

//
// Callback chain script: Calls consecutive independent functions until a dependent function which is only called
// when all preceeding callbacks have been receieved.
//

// Calls functions in order
// NB the argument "functions" is an array of objects of format {func: function, isDependent: true/false}
function enterCallbackChain(context, functions)
{
    var length = functions.length;
    var localCallback;
    var callNextFunction;

    // Invariant: currentFunction always refers to the last uncalled function
    var currentFunction = -1;

    // Invariant: activeCallbacks refers to the number of functions whose callbacks have not yet been received
    var activeCallbacks = 0;

    callNextFunction = function callNextFunctionFn()
    {
        currentFunction += 1;
        activeCallbacks += 1;
        functions[currentFunction].func.call(context, localCallback, arguments);
    };

    localCallback = function localCallbackFn()
    {
        activeCallbacks -= 1;

        // If no callbacks are left then call functions consecutively until dependent (or blocker) function is seen
        if (activeCallbacks === 0 &&
            currentFunction < (length - 1))
        {
            // No active callbacks so immediately call next function
            callNextFunction();

            // Call functions until we hit a dependent (blocking) function
            while (currentFunction < (length - 1) &&
                   !functions[currentFunction].isDependent)
            {
                callNextFunction();
            }
        }
    };

    // Start the async callback chain
    callNextFunction();
}
