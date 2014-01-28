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

/*{{ javascript("scripts/subtitles.js") }}*/

TurbulenzEngine.onload = function onloadFn()
{
    var md = TurbulenzEngine.createMathDevice({});
    var gd = TurbulenzEngine.createGraphicsDevice({});

    var requestHandler = RequestHandler.create({});

    var fontManager = FontManager.create(gd, requestHandler);
    var shaderManager = ShaderManager.create(gd, requestHandler);
    var subtitlePlayer = null;

    var subtitlesStartTime = 0;
    var subtitlesDuration = 0;

    var curLanguageIdx = 0;
    var languages = [ 'ja', 'en' ];

    var onSubtitlesReady = function onSubtitlesReadyFn()
    {
        // TODO: In reality, we probably want to define a font and
        // script file per-locale.

        subtitlePlayer.setScript([
            {
                startTime: 1,
                duration: 1,
                text: {
                    en: "1. First Caption",
                    ja: "1. 最初のキャプション"
                }
            },
            {
                startTime: 3,
                duration: 1,
                text: {
                    en: "2. Another Caption",
                    ja: "2. もう一つのキャプション"
                }
            },
            {
                startTime: 5,
                duration: 1,
                text: {
                    en: "2. Third Subtitle",
                    ja: "2. 三つ目の字幕"
                }
            },
        ]);

        subtitlesStartTime = TurbulenzEngine.getTime();
        subtitlesDuration = subtitlePlayer.getDuration();
    };

    // Could take the language code from the system.  For
    // demonstration purposes, we hard-code it to Japanese.

    // var sysInfo = TurbulenzEngine.getSystemInfo();
    // var languageCode =
    //   (sysInfo.userLocale)?(sysInfo.userLocale.slice(0,2)):('en');

    var subtitlesPlayerParams = {
        mathDevice: md,
        graphicsDevice: gd,
        fontManager: fontManager,
        shaderManager: shaderManager,

        fontURL: 'fonts/aozoraminchoregular.fnt',
        shaderURL: 'shaders/font.cgfx',
        fontTechniqueName: 'font8',

        maxWidthFactor: 0.8,
        lowEdgeFactor: 0.1,
        languageCode: languages[0],
        // defaultLanguageCode?: string;

        onReady: onSubtitlesReady,
        onError: function (msg)
        {
            window.alert("Error in SubtitlePlayer: " + msg);
        }
    };

    var errorCallback = function errorCallbackFn(msg)
    {
        window.alert("ERROR: " + msg);
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        var urlMapping = mappingTable.urlMapping;
        var assetPrefix = mappingTable.assetPrefix;

        fontManager.setPathRemapping(urlMapping, assetPrefix);
        shaderManager.setPathRemapping(urlMapping, assetPrefix);

        subtitlePlayer = SubtitlePlayer.create(subtitlesPlayerParams);
    };

    TurbulenzServices.createMappingTable
    (requestHandler, undefined, mappingTableReceived, undefined, errorCallback);

    // ------------------------------------------------------------------
    // Per-Frame
    // ------------------------------------------------------------------

    var renderText = function renderTextFn()
    {
        if (!subtitlesStartTime)
        {
            return;
        }

        var currentTime = TurbulenzEngine.getTime();
        var subtitlesTime = currentTime - subtitlesStartTime;
        subtitlePlayer.draw(subtitlesTime);

        // Check for end of script and rotate between the languages.

        if (subtitlesTime > subtitlesDuration)
        {
            curLanguageIdx = (curLanguageIdx + 1) % languages.length;

            subtitlePlayer.setLanguageCode(languages[curLanguageIdx]);
            subtitlePlayer.reset();

            subtitlesStartTime = currentTime;
            subtitlesDuration = subtitlePlayer.getDuration();
        }
    };

    var tick = function tickFn()
    {
        if (gd.beginFrame())
        {
            gd.clear([0.4, 0.4, 0.8, 1.0], 1.0);

            renderText();

            gd.endFrame();
        }
    };
    TurbulenzEngine.setInterval(tick, 500.0);

};
