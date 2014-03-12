// Copyright (c) 2009-2011 Turbulenz Limited

interface PostEffectsEntry
{
    technique           : Technique;
    techniqueParameters : TechniqueParameters;
    textureName         : String;
    callback            : (gd: GraphicsDevice, colTex: Texture) => void;
}

//
// PostEffects
//
class PostEffects
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    shader: Shader;
    bicolor: PostEffectsEntry;
    copy: PostEffectsEntry;
    copyFiltered: PostEffectsEntry;
    fadein: PostEffectsEntry;
    modulate: PostEffectsEntry;
    blend: PostEffectsEntry;

    updateShader(sm)
    {
        var shader = sm.get("shaders/posteffects.cgfx");
        if (shader !== this.shader)
        {
            this.shader = shader;
            this.bicolor.technique      = shader.getTechnique("bicolor");
            this.copy.technique         = shader.getTechnique("copy");
            this.copyFiltered.technique = shader.getTechnique("copyFiltered");
            this.fadein.technique       = shader.getTechnique("fadein");
            this.modulate.technique     = shader.getTechnique("modulate");
            this.blend.technique        = shader.getTechnique("blend");
        }
    }

    getEffectSetupCB(name) : { (gd: GraphicsDevice, colTex: Texture): void; }
    {
        var effect = this[name];
        if (effect)
        {
            if (!effect.callback)
            {
                effect.callback = function postFXSetupFn(gd, colorTexture)
                {
                    gd.setTechnique(effect.technique);
                    effect.techniqueParameters[effect.textureName] = colorTexture;
                    gd.setTechniqueParameters(effect.techniqueParameters);
                };
            }
            return effect.callback;
        }
        else
        {
            return undefined;
        }
    }

    destroy()
    {
        for (var p in this)
        {
            if (this.hasOwnProperty(p))
            {
                delete this[p];
            }
        }
    }

    // Constructor function
    static create(gd: GraphicsDevice, sm: ShaderManager) : PostEffects
    {
        var pe = new PostEffects();

        sm.load("shaders/posteffects.cgfx");

        pe.bicolor = {
            technique: null,
            techniqueParameters: gd.createTechniqueParameters({
                color0: [0, 0, 0],
                color1: [1, 1, 1],
                colorTexture: null
            }),
            callback : null,
            textureName : 'colorTexture'
        };

        pe.copy = {
            technique: null,
            techniqueParameters: gd.createTechniqueParameters({
                colorTexture: null
            }),
            callback : null,
            textureName : 'colorTexture'
        };

        pe.copyFiltered = {
            technique: null,
            techniqueParameters: gd.createTechniqueParameters({
                colorTextureFiltered: null
            }),
            callback : null,
            textureName : 'colorTextureFiltered'
        };

        pe.fadein = {
            technique: null,
            techniqueParameters: gd.createTechniqueParameters({
                fadeColor: [0, 0, 0, 0],
                colorTexture: null
            }),
            callback : null,
            textureName : 'colorTexture'
        };

        pe.modulate = {
            technique: null,
            techniqueParameters: gd.createTechniqueParameters({
                modulateColor: [1, 1, 1, 1],
                colorTexture: null
            }),
            callback : null,
            textureName : 'colorTexture'
        };

        pe.blend = {
            technique: null,
            techniqueParameters: gd.createTechniqueParameters({
                alpha: 0.5,
                colorTexture: null
            }),
            callback : null,
            textureName : 'colorTexture'
        };

        return pe;
    }
}
