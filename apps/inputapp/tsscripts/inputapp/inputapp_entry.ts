/*{# Copyright (c) 2011-2012 Turbulenz Limited #}*/

// jslib files
/*{{ javascript("jslib/canvas.js") }}*/
/*{{ javascript("jslib/fontmanager.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/vmath.js") }}*/

// The JS generated from TypeScript modules
/*{{ javascript("scripts/htmlcontrols.js") }}*/
/*{{ javascript("scripts/inputapplib.js") }}*/

/* For jslint */
/*global TurbulenzEngine: false*/
/*global Application: false*/

// Main app entry point

TurbulenzEngine.onload = function onloadFn()
{
    var application = Application.create(null);

    TurbulenzEngine.onunload = function onbeforeunloadFn()
    {
        application.shutdown();
    };

    application.init();
};
