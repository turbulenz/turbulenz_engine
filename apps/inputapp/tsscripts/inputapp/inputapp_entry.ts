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

/// <reference path="../../../../external/definitelytyped/jquery/jquery-1.8.d.ts" />

/// <reference path="../../../../jslib-modular/turbulenz.d.ts" />
/// <reference path="../../../../jslib-modular/fontmanager.d.ts" />
/// <reference path="../../../../jslib-modular/canvas.d.ts" />
/// <reference path="../../../../jslib-modular/utilities.d.ts" />
/// <reference path="../../../../jslib-modular/servicedatatypes.d.ts" />
/// <reference path="../../../../jslib-modular/services.d.ts" />

/// <reference path="../../scripts/htmlcontrols.d.ts" />
/// <reference path="../../scripts/inputapplib.d.ts" />

TurbulenzEngine.onload = function onloadFn()
{
    var application = Application.create(null);

    TurbulenzEngine.onunload = function onbeforeunloadFn()
    {
        application.shutdown();
    };

    application.init();
};
