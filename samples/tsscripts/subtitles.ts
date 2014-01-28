/*{# Copyright (c) 2014 Turbulenz Limited #}*/

/// General properties for subtitle playback
interface SubtitlePlayerParameters
{
    mathDevice: MathDevice;
    graphicsDevice: GraphicsDevice;
    fontManager: FontManager;
    shaderManager: ShaderManager;

    fontURL: string;
    shaderURL: string;
    fontTechniqueName: string;

    /// Maximum width the subtitles should occupy, as a fraction of
    /// the screen width, e.g. 0.8.
    maxWidthFactor: number;

    /// Location of the lower edge of the subtitles, as a fraction of
    /// screen height, e.g. 0.1.
    lowEdgeFactor: number;

    // TODO: fade duration

    /// Override the system language
    languageCode?: string;

    /// The two letter language code to use if any captions don't
    /// contain data for the given locale.  If none is specified, 'en'
    /// is used.
    defaultLanguageCode?: string;

    /// A callback made when the player is ready for playback
    onReady?: { (): void; };

    ///
    onError: { (msg: string): void; };
}

/// A single caption
interface SubtitleCaption
{
    /// Start time in seconds
    startTime: number;
    duration: number;
    text: { [locale:string]: string};
}

interface SubtitleScript
{
    [idx: number] : SubtitleCaption;
    length        : number;
}

///
class SubtitlePlayer
{
    //
    private md: MathDevice;
    private gd: GraphicsDevice;
    private font: Font;
    private technique: Technique;
    private techniqueParameters: TechniqueParameters;

    // Playback stuff
    private script: SubtitleScript;
    private nextActiveIdx: number;  ///< The next entry to check
    // private lastFontDimensions: FontDimensions;

    private maxWidthFactor: number;
    private lowEdgeFactor: number;
    private languageCode: string;
    private defaultLanguageCode: string;

    private scratchDimensions: FontDimensions;
    private scratchDrawParameters: FontDrawParameters;

    constructor(params: SubtitlePlayerParameters)
    {
        var player = this;

        var checkReady = function()
        {
            if (player.font && player.technique)
            {
                if (params.onReady)
                {
                    params.onReady();
                }
            }
        };

        var error = function(msg: string)
        {
            if (params.onError)
            {
                params.onError(msg);
            }
        };

        this.md = params.mathDevice;
        this.gd = params.graphicsDevice;

        var fontManager = params.fontManager;
        fontManager.load(params.fontURL, function (fontObject)
            {
                player.font = fontObject;
                checkReady();
            });

        var shaderManager = params.shaderManager;
        shaderManager.load(params.shaderURL, function (shader)
            {
                if (shader)
                {
                    player.technique =
                        shader.getTechnique(params.fontTechniqueName);

                    if (player.technique)
                    {
                        // TODO: set of TechniqueParameters is
                        // hard-coded for now.

                        player.techniqueParameters =
                            player.gd.createTechniqueParameters({
                                clipSpace : player.md.v4BuildZero(),
                                alphaRef : 0.01,
                                color : player.md.v4BuildOne()
                            });

                        checkReady();
                    }
                    else
                    {
                        error("No technique '" + params.fontTechniqueName
                              + "'");
                    }
                }
                else
                {
                    error("No shader '" + params.shaderURL + "'");
                }
            });

        player.maxWidthFactor = params.maxWidthFactor;
        player.lowEdgeFactor = params.lowEdgeFactor;
        player.languageCode = params.languageCode || "en";
        player.defaultLanguageCode = params.defaultLanguageCode || "en";
    }

    /// Replace any existing script.  Assumes time will start from 0
    /// next frame.
    setScript(script: SubtitleScript): void
    {
        this.script = script;
        this.reset();
    }

    /// Duration in milliseconds (for comparison with
    /// TurbulenzEngine.getTime()).
    getDuration(): number
    {
        var lastCaption = this.script[this.script.length - 1];
        return (lastCaption.startTime + lastCaption.duration) * 1000.0;
    }

    ///
    reset(): void
    {
        this.nextActiveIdx = 0;
        // this.lastFontDimensions = null;
    }

    /// Set a new language code.  reset must still be called if the
    /// caller wants to move back in time.
    setLanguageCode(languageCode: string): void
    {
        this.languageCode = languageCode;
    }

    /// Render any subtitles associated with the current script and
    /// the specified time.  time is specified in ms (in-line with
    /// TurbulenzEngine.getTime()) and is assumed to be non-decreasing
    /// on each call.  Return value indicates whether anything was
    /// rendered.
    draw(timeMS: number): boolean
    {
        var time = timeMS / 1000.0;
        var script = this.script;
        var nextActiveIdx = this.nextActiveIdx;
        var nextActive = script[nextActiveIdx];

        // Find the next caption

        while (nextActive && time > nextActive.startTime + nextActive.duration)
        {
            nextActiveIdx += 1;
            nextActive = script[nextActiveIdx];
        }
        this.nextActiveIdx = nextActiveIdx

        // If we have gone past the last event, there is nothing to
        // do.

        if (!nextActive)
        {
            return false;
        }

        // At this stage, nextActive points to the next caption to
        // display.

        if (time < nextActive.startTime)
        {
            return false;
        }

        // Render the caption

        var md = this.md;
        var gd = this.gd;
        var techniqueParameters = this.techniqueParameters;

        var screenWidth = gd.width;
        var screenHeight = gd.height;

        gd.setTechnique(this.technique);
        techniqueParameters['clipSpace'] =
            md.v4Build(2 / screenWidth, -2 / screenHeight, -1, 1,
                       techniqueParameters['clipSpace']);
        gd.setTechniqueParameters(techniqueParameters);

        var text = nextActive.text[this.languageCode] ||
            nextActive.text[this.defaultLanguageCode];

        if (text)
        {
            var font = this.font;

            var scale = 1.0;
            var spacing = 0;
            var lowEdgeFactor = this.lowEdgeFactor;

            // Place the text

            var maxX = screenWidth * this.maxWidthFactor;
            var maxY = screenHeight * (1 - lowEdgeFactor);

            var dimensions = this.scratchDimensions;
            dimensions = font.calculateTextDimensions(text, scale, spacing,
                                                      dimensions);
            this.scratchDimensions = dimensions;

            while ((dimensions.width > maxX) || (dimensions.height > maxY))
            {
                scale *= 0.5;
                dimensions = font.calculateTextDimensions(text, scale, spacing,
                                                          dimensions);
            }

            // Setup font parameters

            var drawParams = this.scratchDrawParameters;
            if (!drawParams)
            {
                drawParams = {
                    alignment: 1,
                    rect: [0, 0, 0, 0],
                    scale: scale,
                    spacing: spacing,
                    dimensions: dimensions
                };
                this.scratchDrawParameters = drawParams;
            }

            var rect = drawParams.rect;
            rect[0] = screenWidth / 2;
            rect[1] = screenHeight * (1 -lowEdgeFactor) - dimensions.height;
            drawParams.scale = scale;

            font.drawTextRect(text, drawParams);
        }
    }

    static create(params: SubtitlePlayerParameters): SubtitlePlayer
    {
        return new SubtitlePlayer(params);
    }
}