/*{# Copyright (c) 2013 Turbulenz Limited #}*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/datasharemanager.js") }}*/
/*{{ javascript("jslib/services/notificationsmanager.js") }}*/
/*{{ javascript("jslib/services/sessiontoken.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/fontmanager.js") }}*/
/*{{ javascript("jslib/assetcache.js") }}*/

/*{{ javascript("scripts/simplebuttons.js") }}*/
/*{{ javascript("scripts/tictactoelib.js") }}*/

/*global TurbulenzEngine: true */
/*global Application: false */

TurbulenzEngine.onload = function onloadFn()
{
    var application = Application.create();

    TurbulenzEngine.onunload = function onUnloadFn()
    {
        application.shutdown();
    };

    application.init();
};
