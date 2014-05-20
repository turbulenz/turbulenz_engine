/*{# Copyright (c) 2012 Turbulenz Limited #}*/

/*
 * @title: Video playback
 * @description:
 * This sample shows how to play a video into a texture.
*/

/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */

TurbulenzEngine.onload = function onloadFn()
{
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    // IE detection while WebGL implementation is incomplete
    if (graphicsDevice && graphicsDevice.renderer === "Internet Explorer")
    {
        window.alert("The video sample is not supported on Internet Explorer");
        return;
    }
    var soundDevice = TurbulenzEngine.createSoundDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var requestHandler = RequestHandler.create({});

    var video;
    var videoPosition = -1;

    var shader, technique;
    var texture;

    var clearColor = mathDevice.v4Build(0, 0, 0, 1);
    var clipSpace = mathDevice.v4Build(1, -1, 0, 0);
    var videoColor = mathDevice.v4Build(1, 1, 1, 1);

    var primitive = graphicsDevice.PRIMITIVE_TRIANGLE_STRIP;
    var semantics = graphicsDevice.createSemantics(['POSITION', 'TEXCOORD0']);
    var vertexBuffer = graphicsDevice.createVertexBuffer({
        numVertices: 4,
        attributes: [graphicsDevice.VERTEXFORMAT_FLOAT2,
                     graphicsDevice.VERTEXFORMAT_FLOAT2],
        dynamic: false,
        data: [
            -1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            -1.0, -1.0, 0.0, 0.0,
            1.0, -1.0, 1.0, 0.0
        ]
    });

    var source = soundDevice.createGlobalSource({
        looping: true
    });
    var sound;

    var assetsToLoad = 3;

    function mappingTableReceived(mappingTable)
    {
        var videoURL;
        if (graphicsDevice.isSupported("FILEFORMAT_WEBM"))
        {
            videoURL = mappingTable.getURL("videos/turbulenzanimation.webm");
        }
        else
        {
            videoURL = mappingTable.getURL("videos/turbulenzanimation.mp4");
        }

        graphicsDevice.createVideo({
            src: videoURL,
            looping: true,
            onload: function (v)
            {
                if (v)
                {
                    video = v;

                    assetsToLoad -= 1;
                }
                else
                {
                    window.alert("Failed to load video!");
                }
            }
        });

        var soundURL;
        if (soundDevice.isSupported("FILEFORMAT_OGG"))
        {
            soundURL = mappingTable.getURL("sounds/turbulenzanimation.ogg");
        }
        else
        {
            soundURL = mappingTable.getURL("sounds/turbulenzanimation.mp3");
        }

        soundDevice.createSound({
            src: soundURL,
            onload : function (s)
            {
                if (s)
                {
                    sound = s;

                    assetsToLoad -= 1;
                }
                else
                {
                    window.alert('Failed to load sound!');
                }
            }
        });

        function shaderLoaded(shaderText)
        {
            if (shaderText)
            {
                var shaderParameters = JSON.parse(shaderText);
                shader = graphicsDevice.createShader(shaderParameters);

                technique = shader.getTechnique("video");

                assetsToLoad -= 1;
            }
            else
            {
                window.alert("Failed to load shader!");
            }
        }

        requestHandler.request({
            src: mappingTable.getURL("shaders/video.cgfx"),
            onload: shaderLoaded
        });
    }

    var gameSession;
    function sessionCreated()
    {
        TurbulenzServices.createMappingTable(
            requestHandler,
            gameSession,
            mappingTableReceived
        );
    }

    gameSession = TurbulenzServices.createGameSession(requestHandler, sessionCreated);

    //==========================================================================
    // Main loop.
    //==========================================================================

    var fpsElement = document.getElementById("fpscounter");
    var lastFPS = "";
    var nextUpdate = 0;
    function displayPerformance()
    {
        var currentTime = TurbulenzEngine.time;
        if (currentTime > nextUpdate)
        {
            nextUpdate = (currentTime + 0.1);

            var fpsText = (graphicsDevice.fps).toFixed(2);
            if (lastFPS !== fpsText)
            {
                lastFPS = fpsText;
                fpsElement.innerHTML = fpsText + " fps";
            }
        }
    }

    function mainLoop()
    {
        soundDevice.update();

        if (graphicsDevice.beginFrame())
        {
            var deviceWidth = graphicsDevice.width;
            var deviceHeight = graphicsDevice.height;
            var aspectRatio = (deviceWidth / deviceHeight);

            var videoWidth = video.width;
            var videoHeight = video.height;
            var videoAspectRatio = (videoWidth / videoHeight);

            var x, y;
            if (aspectRatio < videoAspectRatio)
            {
                x = 1;
                y = aspectRatio / videoAspectRatio;
            }
            else //if (aspectRatio >= videoAspectRatio)
            {
                x = videoAspectRatio / aspectRatio;
                y = 1;
            }

            var currentVideoPosition = video.tell;
            if (currentVideoPosition &&
                videoPosition !== currentVideoPosition)
            {
                if (currentVideoPosition < videoPosition)
                {
                    // looped, sync
                    source.seek(videoPosition);
                }

                videoPosition = currentVideoPosition;
                texture.setData(video);
            }

            graphicsDevice.clear(clearColor);

            graphicsDevice.setTechnique(technique);
            technique.texture = texture;
            technique.clipSpace = mathDevice.v4Build(x, -y, 0, 0, clipSpace);
            technique.color = videoColor;

            graphicsDevice.setStream(vertexBuffer, semantics);
            graphicsDevice.draw(primitive, 4);

            graphicsDevice.endFrame();

            if (fpsElement)
            {
                displayPerformance();
            }
        }
    }

    var intervalID;
    function loadingLoop()
    {
        if (assetsToLoad === 0)
        {
            TurbulenzEngine.clearInterval(intervalID);

            source.play(sound);

            video.play();

            texture = graphicsDevice.createTexture({
                width: video.width,
                height: video.height,
                mipmaps: false,
                format: 'R8G8B8',
                dynamic: true,
                data: video
            });

            videoPosition = video.tell;

            intervalID = TurbulenzEngine.setInterval(mainLoop, 1000 / 60);
        }
    }

    intervalID = TurbulenzEngine.setInterval(loadingLoop, 100);

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        TurbulenzEngine.clearInterval(intervalID);

        if (texture)
        {
            texture.destroy();
            texture = null;
        }

        if (shader)
        {
            shader.destroy();
            technique = null;
            shader = null;
        }

        if (video)
        {
            video.destroy();
            video = null;
        }

        if (vertexBuffer)
        {
            vertexBuffer.destroy();
            vertexBuffer = null;
        }

        if (source)
        {
            source.destroy();
            source = null;
        }

        if (sound)
        {
            sound.destroy();
            sound = null;
        }

        fpsElement = null;

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }
    };
};
