//
//  debughelpers
//
//  Adds additional functionality to debug object
//

/*global debug: false*/
/*global Profile: false*/

if ('undefined' !== typeof debug)
{
    // Simply evaluates its arguments - useful for debug only code paths
    debug.evaluate = function debugEvaluateFn()
    {

    };

    debug.info = function debugInfoFn(message)
    {
        if (window.console)
        {
            window.console.info(message);
        }
    };

    debug.warn = function debugWarnFn(message)
    {
        if (window.console)
        {
            window.console.warn(message);
        }
    };

    debug.error = function debugErrorFn(message)
    {
        debug.assert(false, message);
    };

    debug.startProfile = function debugStartProfileFn(profileName)
    {
        Profile.start(profileName);
    };

    debug.endProfile = function debugEndProfileFn(profileName)
    {
        Profile.end(profileName);
    };
}
