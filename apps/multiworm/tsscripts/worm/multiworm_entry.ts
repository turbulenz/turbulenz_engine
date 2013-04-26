/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*{# jslib files #}*/
/*{{ javascript("jslib/vmath.js") }}*/
/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/camera.js")}}*/
/*{{ javascript("jslib/simplerendering.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/
/*{{ javascript("jslib/vmath.js") }}*/
/*{{ javascript("jslib/services/badgemanager.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/multiplayersession.js") }}*/
/*{{ javascript("jslib/services/multiplayersessionmanager.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/leaderboardmanager.js")}}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/userdatamanager.js") }}*/
/*{{ javascript("jslib/fontmanager.js") }}*/

/*{# scripts #}*/
/*{{ javascript("scripts/sceneloader.js")}}*/
/*{{ javascript("scripts/worm.js") }}*/

/*global TurbulenzEngine: true*/
/*global Application: false*/

TurbulenzEngine.onload = function onloadFn()
{
    var application = Application.create(null);

    TurbulenzEngine.onunload = function onUnloadFn()
    {
        application.shutdown();
    };

    application.init();
};
