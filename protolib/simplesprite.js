// Copyright (c) 2009-2013 Turbulenz Limited

/*global debug: false*/

function SimpleSprite(globals)
{
    this.globals = globals;
    var gd = globals.graphicsDevice;
    var md = globals.mathDevice;

    /* jshint bitwise: false */
    debug.assert(this.maxSprites * 6 < 1<<16); // Must fit in 16 bit indicies.
    /* jshint bitwise: true */

    // Index buffer generation.
    var numIndexBufferIndices = 6 * this.maxSprites;

    var indexBufferParameters = {
        numIndices: numIndexBufferIndices,
        format: 'USHORT'
    };

    var indexBuffer = gd.createIndexBuffer(indexBufferParameters);

    var writer = indexBuffer.map();
    if (writer)
    {
        var v0, v1, v2, v3;
        for (var i = 0; i < this.maxSprites; i += 1)
        {
            v0 = 4 * i + 0;
            v1 = 4 * i + 1;
            v2 = 4 * i + 2;
            v3 = 4 * i + 3;
            writer(v0);
            writer(v1);
            writer(v2);
            writer(v2);
            writer(v3);
            writer(v0);
        }

        indexBuffer.unmap(writer);
    }

    this.indexBuffer = indexBuffer;

    this.numVerticesPerParticle = 4;
    this.numVertexBufferVertices = this.numVerticesPerParticle * this.maxSprites;

    var vertexBufferParameters = {
        numVertices : this.numVertexBufferVertices,
        attributes : ['FLOAT3', 'FLOAT2', 'FLOAT4'],
        dynamic : true,
        'transient': true
    };

    // Dynamic vertexBuffer created for changing position and vertex color
    this.vertexBuffer = gd.createVertexBuffer(vertexBufferParameters);
    this.semantics = gd.createSemantics([gd.SEMANTIC_POSITION, gd.SEMANTIC_TEXCOORD, gd.SEMANTIC_COLOR]);
    this.primitive = gd.PRIMITIVE_TRIANGLES;
    this.globalTechniqueParameters = gd.createTechniqueParameters(
        {
            worldViewProjection: null,
            materialColor: md.v4BuildOne()
        });
    this.localTechniqueParameters = gd.createTechniqueParameters(
        {
            diffuse: null
        });

    this.spriteList = [];
    this.spriteCache = [];
    for (var index = 0; index < this.maxSprites; index += 1)
    {
        this.spriteCache[index] = {v3location  :   md.v3BuildZero(),
                                   sizeX       :   0.0,
                                   sizeY       :   0.0,
                                   v4color     :   md.v4BuildOne(),
                                   texture     :   null,
                                   blendStyle  :   this.blendStyle.NORMAL,
                                   out         :    md.v3BuildZero(),
                                   outValid    : false,
                                   angle       :   0.0,
                                   offsetX     :   0.0,
                                   offsetY     :   0.0,
                                   offsetAngle :   0.0
                                  };
    }

    this.scratchPad = { };
    this.writerArray = new Float32Array(this.numVertexBufferVertices * 9);
}

SimpleSprite.prototype =
{
    maxSprites : 256,

    blendStyle :
    {
        NORMAL : 0,
        ADD : 1,
        NORMAL_NO_Z : 2,
        ADD_NO_Z : 3
    },

    blendNames :
    [
        "blend_particle",
        "add_particle",
        "blend_particle_no_z",
        "add_particle_no_z"
    ],

    addSprite : function simpleSpriteAddSpriteFn(params) //v3location, size, v4color, texture, blendStyle
    {
        if (this.spriteList.length >= this.maxSprites)
        {
            return false;
        }

        var md  =   this.globals.mathDevice;

        var sprite_to_add = this.spriteCache[this.spriteList.length];

        sprite_to_add.v3location = params.v3Location ? md.v3Copy(params.v3Location, sprite_to_add.v3location) : md.v3BuildZero(sprite_to_add.v3location);
        sprite_to_add.sizeX = params.sizeX !== undefined ? params.sizeX : (params.size !== undefined ? params.size : 1.0);
        sprite_to_add.sizeY = params.sizeY !== undefined ? params.sizeY : (params.size !== undefined ? params.size : 1.0);
        sprite_to_add.v4color = params.v4color ? md.v4Copy(params.v4color, sprite_to_add.v4color) : md.v4BuildOne(sprite_to_add.v4color);
        sprite_to_add.texture = params.texture ? params.texture : "textures/Test.dds";
        sprite_to_add.blendStyle = params.blendStyle ? params.blendStyle : this.blendStyle.NORMAL;

        sprite_to_add.outValid = false;
        if (params.out)
        {
            sprite_to_add.out = md.v3Copy(params.out, sprite_to_add.out);
            sprite_to_add.outValid = true;
        }

        sprite_to_add.angle = params.angle ? params.angle : 0.0;
        sprite_to_add.offsetX = params.offsetX ? params.offsetX : 0.0;
        sprite_to_add.offsetY = params.offsetY ? params.offsetY : 0.0;
        sprite_to_add.offsetAngle = params.offsetAngle ? params.offsetAngle : 0.0;

        this.spriteList.push(sprite_to_add);
        return true;
    },

    preload : function preloadFn()
    {
        this.globals.shaderManager.load("shaders/simplesprite.cgfx");
    },

    drawSprites : function simpleSpriteDrawSpriteFn()
    {
        if (this.spriteList.length === 0)
        {
            return;
        }

        var globals =   this.globals;
        var md      =   globals.mathDevice;
        var camera  =   globals.camera;
        var tm      =   globals.textureManager;
        var gd      =   globals.graphicsDevice;
        var sm      =   globals.shaderManager;

        var submitted_blendStyle;
        var submitted_texture;

        var sprite_list =   this.spriteList;
        var num_sprites =   sprite_list.length;

        var sprites_drawn = 0;
        var sprites_to_be_drawn = 0;

        var that = this;

        var rootTwo = Math.sqrt(2.0);
        var fortyFive = Math.PI * 0.25;
        var sin_value;
        var cos_value;

        var writerArray = this.writerArray;
        var writerIndex = 0;
        var writer = function localWriter(position, u, v, color)
        {
            writerArray[writerIndex]      = position[0];
            writerArray[writerIndex + 1]  = position[1];
            writerArray[writerIndex + 2]  = position[2];
            writerArray[writerIndex + 3]  = u;
            writerArray[writerIndex + 4]  = v;
            writerArray[writerIndex + 5]  = color[0];
            writerArray[writerIndex + 6]  = color[1];
            writerArray[writerIndex + 7]  = color[2];
            writerArray[writerIndex + 8]  = color[3];
            writerIndex += 9;
        };

        function doDraw()
        {
            that.vertexBuffer.setData(writerArray, 0, sprites_to_be_drawn * 4);
            writerIndex = 0;

            gd.drawIndexed(gd.PRIMITIVE_TRIANGLES, sprites_to_be_drawn * 6, 0);

            sprites_drawn += sprites_to_be_drawn;
            sprites_to_be_drawn =   0;
        }

        gd.setStream(this.vertexBuffer, this.semantics);
        gd.setIndexBuffer(this.indexBuffer);

        this.globalTechniqueParameters.worldViewProjection = camera.viewProjectionMatrix;

        if (writer)
        {
            var shader = sm.load("shaders/simplesprite.cgfx");
            var cameraMatrix = camera.matrix;
            var up = md.m43Up(cameraMatrix);
            var right = md.m43Right(cameraMatrix);

            var scratchPad = this.scratchPad;
            var thisUp = scratchPad.thisUp = md.v3BuildOne(scratchPad.thisUp);
            var thisRight = scratchPad.thisRight = md.v3BuildOne(scratchPad.thisRight);

            var rightScaled = scratchPad.rightScaled = md.v3BuildOne(scratchPad.rightScaled);
            var upScaled = scratchPad.upScaled = md.v3BuildOne(scratchPad.upScaled);

            var tr  = scratchPad.tr = md.v3BuildOne(scratchPad.tr);
            var tl  = scratchPad.tl = md.v3BuildOne(scratchPad.tl);
            var br  = scratchPad.br = md.v3BuildOne(scratchPad.br);
            var bl  = scratchPad.bl = md.v3BuildOne(scratchPad.bl);

            var techniqueParameters = this.localTechniqueParameters;
            var lastTechnique;


            for (var i = 0; i < num_sprites; i += 1)
            {
                var this_sprite = sprite_list[i];

                var this_blendStyle = this_sprite.blendStyle;
                var this_texture    = this_sprite.texture;

                if (submitted_blendStyle !== this_blendStyle || submitted_texture !== this_texture)
                {
                    if (sprites_to_be_drawn > 0)
                    {
                        doDraw();
                    }

                    submitted_blendStyle    =   this_blendStyle;
                    submitted_texture       =   this_texture;

                    var textureThatIveLoaded = tm.load(this_texture);
                    var technique   = shader.getTechnique(this.blendNames[this_blendStyle]);

                    if (!technique)
                    {
                        return;
                    }

                    if (technique !== lastTechnique)
                    {
                        gd.setTechnique(technique);
                        gd.setTechniqueParameters(this.globalTechniqueParameters);
                        lastTechnique = technique;
                    }

                    techniqueParameters.diffuse = textureThatIveLoaded;
                    gd.setTechniqueParameters(techniqueParameters);
                }

                var position    = this_sprite.v3location;
                var sizeX       = this_sprite.sizeX;
                var sizeY       = this_sprite.sizeY;

                if (this_sprite.outValid)
                {
                    if (Math.abs(this_sprite.out[1]) === 1.0)
                    {
                        md.v3BuildZAxis(thisUp);
                        md.v3BuildXAxis(thisRight);
                    }
                    else
                    {
                        md.v3Cross(this_sprite.out, md.v3BuildYAxis(), thisRight);
                        md.v3Cross(thisRight, this_sprite.out, thisUp);

                        md.v3Normalize(thisRight, thisRight);
                        md.v3Normalize(thisUp, thisUp);
                    }

                    md.v3Neg(thisRight, thisRight);
                }
                else
                {
                    md.v3Copy(up, thisUp);
                    md.v3Copy(right, thisRight);
                }

                md.v3ScalarMul(thisRight, sizeX, rightScaled);
                md.v3ScalarMul(thisUp, sizeY, upScaled);

                if (this_sprite.offsetX !== 0.0 || this_sprite.offsetY)
                {
                    if (this_sprite.offsetAngle !== 0.0)
                    {
                        sin_value   =   Math.sin(this_sprite.offsetAngle);
                        cos_value   =   Math.cos(this_sprite.offsetAngle);

                        md.v3AddScalarMul(position, thisRight, this_sprite.offsetX * cos_value, position);
                        md.v3AddScalarMul(position, thisUp, -this_sprite.offsetX * sin_value, position);

                        md.v3AddScalarMul(position, thisRight, this_sprite.offsetY * sin_value, position);
                        md.v3AddScalarMul(position, thisUp, this_sprite.offsetY * cos_value, position);
                    }
                    else
                    {
                        md.v3AddScalarMul(position, thisRight, this_sprite.offsetX, position);
                        md.v3AddScalarMul(position, thisUp, this_sprite.offsetY, position);
                    }
                }

                md.v3Copy(position, tr);
                md.v3Copy(position, tl);
                md.v3Copy(position, br);
                md.v3Copy(position, bl);

                if (this_sprite.angle !== 0.0)
                {
                    sin_value   =   Math.sin(this_sprite.angle + fortyFive) * rootTwo;
                    cos_value   =   Math.cos(this_sprite.angle + fortyFive) * rootTwo;

                    md.v3AddScalarMul(tr, rightScaled, sin_value,    tr);
                    md.v3AddScalarMul(tr, upScaled,    cos_value,    tr);

                    md.v3AddScalarMul(tl, rightScaled, -cos_value,   tl);
                    md.v3AddScalarMul(tl, upScaled,    sin_value,    tl);

                    md.v3AddScalarMul(br, rightScaled, cos_value,    br);
                    md.v3AddScalarMul(br,  upScaled,    -sin_value,  br);

                    md.v3AddScalarMul(bl, rightScaled, -sin_value,   bl);
                    md.v3AddScalarMul(bl, upScaled,    -cos_value,   bl);
                }
                else
                {
                    md.v3Add(tr,    rightScaled,    tr);
                    md.v3Add(tr,    upScaled,       tr);

                    md.v3Sub(tl,    rightScaled,    tl);
                    md.v3Add(tl,    upScaled,       tl);

                    md.v3Add(br,    rightScaled,    br);
                    md.v3Sub(br,    upScaled,       br);

                    md.v3Sub(bl,    rightScaled,    bl);
                    md.v3Sub(bl,    upScaled,       bl);
                }

                var color = this_sprite.v4color;

                writer(bl, 0, 1, color);
                writer(br, 1, 1, color);
                writer(tr, 1, 0, color);
                writer(tl, 0, 0, color);

                sprites_to_be_drawn += 1;
            }
        }

        if (sprites_to_be_drawn > 0)
        {
            doDraw();
        }

        this.clearSpriteList();
    },

    clearSpriteList : function simpleSpriteClearSpriteListFn()
    {
        this.spriteList.length = 0;
    }
};

SimpleSprite.create = function simpleSpriteCreateFn(globals)
{
    return new SimpleSprite(globals);
};
