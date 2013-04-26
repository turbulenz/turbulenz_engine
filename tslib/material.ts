// Copyright (c) 2010-2012 Turbulenz Limited

/*global Reference: false */

/// <reference path="turbulenz.d.ts" />
/// <reference path="utilities.ts" />
/// <reference path="scene.ts" />
/// <reference path="texturemanager.ts" />

//
// Material
//
class Material
{
    static version = 1;

    name                : string;
    reference           : Reference;
    techniqueParameters : TechniqueParameters;
    meta                : any;
    effect              : Effect;
    effectName          : string;
    texturesNames       : { [name: string]: string; }; // name -> filename?
    textureInstances    : { [name: string]: TextureInstance; };

    onTextureChanged    : { (textureInstance: TextureInstance): void; };

    static create(graphicsDevice: GraphicsDevice) : Material
    {
        var newMaterial = new Material();
        newMaterial.reference = Reference.create(newMaterial);
        newMaterial.techniqueParameters = graphicsDevice.createTechniqueParameters();
        newMaterial.meta = {};

        newMaterial.onTextureChanged = function materialOnTextureChangedFn(textureInstance)
        {
            var textureInstanceTexture = textureInstance.texture;
            var material = newMaterial;
            var materialTechniqueParameters = material.techniqueParameters;
            var materialTextureInstances = material.textureInstances;

            for (var p in materialTextureInstances)
            {
                if (materialTextureInstances.hasOwnProperty(p))
                {
                    if (materialTextureInstances[p] === textureInstance)
                    {
                        materialTechniqueParameters[p] = textureInstanceTexture;
                    }
                }
            }
        };

        return newMaterial;
    };

    getName() : string
    {
        return this.name;
    };

    setName(name)
    {
        this.name = name;
    };

    loadTextures(textureManager)
    {
        var materialTextureNames = this.texturesNames;
        for (var p in materialTextureNames)
        {
            if (materialTextureNames.hasOwnProperty(p))
            {
                var textureName = materialTextureNames[p];
                textureManager.load(textureName);
                this.setTextureInstance(p, textureManager.getInstance(textureName));
            }
        }
    };

    setTextureInstance(propertryName, textureInstance)
    {
        if (!this.textureInstances)
        {
            this.textureInstances = {};
        }
        var oldInstance = this.textureInstances[propertryName];
        if (oldInstance !== textureInstance)
        {
            if (oldInstance && oldInstance.unsubscribeTextureChanged)
            {
                oldInstance.unsubscribeTextureChanged(this.onTextureChanged);
            }
            this.textureInstances[propertryName] = textureInstance;
            this.techniqueParameters[propertryName] = textureInstance.texture;
            textureInstance.subscribeTextureChanged(this.onTextureChanged);
            textureInstance.reference.add();
        }
    };

    destroy()
    {
        delete this.techniqueParameters;

        var textureInstance;
        var textureInstances = this.textureInstances;
        for (var p in textureInstances)
        {
            if (textureInstances.hasOwnProperty(p))
            {
                textureInstance = textureInstances[p];
                textureInstance.unsubscribeTextureChanged(this.onTextureChanged);
                textureInstance.reference.remove();
            }
        }
        delete this.textureInstances;
        delete this.texturesNames;
    };
};
