// Copyright (c) 2010-2012 Turbulenz Limited

/*global TurbulenzEngine: false */
/*global Draw2D: false */
/*global Physics2DDebugDraw: false */
/*global ParticleBuilder: false */

TurbulenzEngine.onload = function onloadFn()
{
    var md = TurbulenzEngine.createMathDevice({});
    var gd = TurbulenzEngine.createGraphicsDevice({});
    var id = TurbulenzEngine.createInputDevice({});

    var clearColor = [0, 0, 0, 1];
    var draw2D = Draw2D.create({ graphicsDevice: gd });
    var debug = Physics2DDebugDraw.create({ graphicsDevice: gd });

    var letters = [[
        "...___...",
        "../...a..",
        "..|.-.|..",
        "..|_|_|..",
        "_|bbbbb|.",
        "b`-0-0-'."
    ] , [
        "...___...",
        "..|._.)..",
        "..|._.a..",
        "..|___/..",
        "_|bbbbb|.",
        "b`-0-0-'."
    ], [
        "...___...",
        "../.__|..",
        ".|.(__...",
        "..a___|..",
        "_|bbbbb|.",
        "b`-0-0-'."
    ], [
        "...___...",
        "..|...a..",
        "..|.|).|.",
        "..|___/..",
        "_|bbbbb|.",
        "b`-0-0-'."
    ], [
        "...___...",
        "..|.__|..",
        "..|._|...",
        "..|___|..",
        "_|bbbbb|.",
        "b`-0-0-'."
    ], [
        "....___..",
        "...|.__|.",
        "...|._|..",
        ".._|_|_..",
        "_|.bbb.|.",
        "b`-0-0-'."
    ], [
        "...___...",
        "../.__|..",
        ".|.(_.|..",
        "..a___|..",
        "_|bbbbb|.",
        "b`-0-0-'.",
    ]];

    var dim = 3;
    var chars = {
        ".": [0, 0, 0,
              0, 1, 0,
              0, 0, 0],
        "_": [0, 0, 0,
              0, 1, 0,
              1, 1, 1],
        ")": [1, 0, 0,
              1, 1, 0,
              1, 0, 0],
        "(": [0, 0, 1,
              0, 1, 1,
              0, 0, 1],
        "|": [1, 1, 0,
              1, 1, 1,
              1, 1, 0],
        "0": [0, 2, 0,
              2, 1, 2,
              0, 2, 0],
        "b": [2, 0, 2,
              1, 0, 1,
              2, 2, 2],
        "a": [1, 0, 0,
              1, 1, 0,
              1, 1, 1],
        "/": [0, 0, 1,
              0, 1, 1,
              1, 1, 1],
        "-": [0, 0, 0,
              1, 1, 1,
              0, 0, 0],
        "'": [0, 1, 0,
              0, 1, 0,
              0, 1, 0],
        "`": [1, 1, 0,
              0, 1, 0,
              0, 1, 0]
    };

    function createTexture(letter, cols, scale)
    {
        var height = letter.length * dim * scale;
        var width = letter[0].length * dim * scale;
        var data = new Uint32Array(height * width);
        function print(x, y, c)
        {
            var ch = chars[c];
            var i, j;
            for (j = 0; j < dim; j += 1)
            {
                for (i = 0; i < dim; i += 1)
                {
                    var ind = ch[j * dim + i];
                    var c = cols[ind];
                    var k, l;
                    for (k = 0; k < scale; k += 1)
                    {
                        for (l = 0; l < scale; l += 1)
                        {
                            var ind = ((y * dim + j) * scale + k) * width +
                                       (x * dim + i) * scale + l;
                            data[ind] = c | (0xff << 24);
                        }
                    }
                }
            }
        }
        var x, y;
        for (y = 0; y < letter.length; y += 1)
        {
            var line = letter[y];
            for (x = 0; x < line.length; x += 1)
            {
                print(x, y, line.charAt(x));
            }
        }
        return gd.createTexture({
            width: width,
            height: height,
            depth: 1,
            format: gd.PIXELFORMAT_R8G8B8A8,
            mipmaps: false,
            cubemap: false,
            renderable: false,
            dynamic: false,
            data: new Uint8Array(data.buffer)
        });
    }

    var textures = [];
    var colors = [
        [0xffffff, 0x800080, 0x80ff00],
        [0xffffff, 0x8000ff, 0x0000ff],
        [0xffffff, 0x00ff00, 0x00ffff],
        [0xffffff, 0x808000, 0x8000ff],
        [0xffffff, 0x00ff80, 0x80ffff]
    ];
    var i, j, k;
    for (j = 0; j < colors.length; j += 1)
    {
        for (i = 0; i < letters.length; i += 1)
        {
            textures.push(createTexture(letters[i], colors[j], Math.floor(1 + Math.random()*4)));
        }
    }

    var packed = ParticleBuilder.packTextures({
        graphicsDevice: gd,
        textures: textures,
        borderShrink: 4
    });
    var w = packed.texture.width;
    var h = packed.texture.height;

    draw2D.configure({
        viewportRectangle: [0, 0, w * 2, h],
        scaleMode: draw2D.scale.scale
    });
    debug.setPhysics2DViewport(draw2D.getViewport());

    var update = function updateFn()
    {
        if (!gd.beginFrame())
        {
            return;
        }

        gd.clear(clearColor);

        draw2D.begin();
        draw2D.draw({
            destinationRectangle: [0, 0, w, h],
            sourceRectangle: [0, 0, w, h],
            color: [1, 1, 1, 1],
            rotation: 0,
            texture: packed.texture
        });
        draw2D.end();

        debug.setScreenViewport(draw2D.getScreenSpaceViewport());
        debug.begin();
        packed.uvMap.map(function (rect) {
            debug.drawRectangle(
                -1+rect[0] * w, -1+rect[1] * h,
                 1+rect[2] * w,  1+rect[3] * h,
                [0, 0, 0, 1]
            );
            debug.drawRectangle(
                rect[0] * w, rect[1] * h,
                rect[2] * w, rect[3] * h,
                [1, 0, 0, 1]
            );
        });
        debug.end();

        gd.endFrame();
    };
    TurbulenzEngine.setInterval(update, 1000 / 20);
};
