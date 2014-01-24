var x = 1;
/*{# Copyright (c) 2014 Turbulenz Limited #}*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/sessiontoken.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/fontmanager.js") }}*/

TurbulenzEngine.onload = function onloadFn()
{
    var md = TurbulenzEngine.createMathDevice({});
    var gd = TurbulenzEngine.createGraphicsDevice({});

    var requestHandler = RequestHandler.create({});

    var fontManager = FontManager.create(gd, requestHandler);
    var font, fontTechnique, fontTechniqueParameters;

    var shaderManager = ShaderManager.create(gd, requestHandler);
    var shader;

    var errorCallback = function errorCallbackFn(msg)
    {
        window.alert("ERROR: " + msg);
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        var urlMapping = mappingTable.urlMapping;
        var assetPrefix = mappingTable.assetPrefix;

        fontManager.setPathRemapping(urlMapping, assetPrefix);
        fontManager.load('fonts/mincho.fnt', function (fontObject)
            {
                font = fontObject;
            });

        shaderManager.setPathRemapping(urlMapping, assetPrefix);
        shaderManager.load('shaders/font.cgfx', function (shaderObject)
            {
                shader = shaderObject;
                fontTechnique = shader.getTechnique('font8');
                fontTechniqueParameters = gd.createTechniqueParameters({
                    clipSpace : md.v4BuildZero(),
                    alphaRef : 0.01,
                    color : md.v4BuildOne()
                });

            });
    };

    TurbulenzServices.createMappingTable
    (requestHandler, undefined, mappingTableReceived, undefined, errorCallback);


    // ------------------------------------------------------------------
    // Per-Frame
    // ------------------------------------------------------------------

    var renderText = function renderTextFn()
    {
        var ready = font && fontTechnique;
        if (!ready)
        {
            return;
        }

        // Graphics Setup

        gd.setTechnique(fontTechnique);

        fontTechniqueParameters.clipSpace =
            md.v4Build(2 / gd.width, -2 / gd.height, -1, 1,
                       fontTechniqueParameters.clipSpace);
        gd.setTechniqueParameters(fontTechniqueParameters);

        var text = "Alright, world?";
        var scale = 1.0;
        var spacing = 0;

        var textSize = font.calculateTextDimensions(text, scale, spacing);
        font.drawTextRect
        (text,
         {
             alignment: 0,
             rect: [0, 0, 0, 0],
             scale: scale,
             spacing: spacing
         });

    };

    var tick = function tickFn()
    {
        if (gd.beginFrame())
        {
            gd.clear([0.4, 0.4, 0.8, 1.0], 1.0);

            renderText();

            gd.endFrame();
        }
        else
        {
            errorCallback("beginFrame failed");
        }
    };
    TurbulenzEngine.setInterval(tick, 1);

};