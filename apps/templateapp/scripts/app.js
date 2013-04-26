// Copyright (c) 2010-2012 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*exported appCreate*/

var appDestroyCallback;
function appCreate()
{
    window.alert("appCreate");

    var versionElem = document.getElementById("engine_version");
    if (versionElem)
    {
        versionElem.innerHTML = TurbulenzEngine.version;
    }

    var intervalID;

    var mainLoop = function mainLoopFn()
    {
    };

    intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);

    appDestroyCallback = function appDestroyCallbackFn()
    {
        TurbulenzEngine.clearInterval(intervalID);

        window.alert("appDestroy");

        TurbulenzEngine.flush();
    };
    TurbulenzEngine.onunload = appDestroyCallback;
}
