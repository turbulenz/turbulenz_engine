// Copyright (c) 2010-2012 Turbulenz Limited

/*global Reference: false */

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
    }

    getName() : string
    {
        return this.name;
    }

    setName(name)
    {
        this.name = name;
    }

    clone(graphicsDevice: GraphicsDevice) : Material
    {
        var newMaterial = Material.create(graphicsDevice);

        // Copy effect info
        if (this.effect)
        {
            newMaterial.effect = this.effect;
        }

        if (this.effectName)
        {
            newMaterial.effectName = this.effectName;
        }

        // Copy meta
        var oldMeta = this.meta;
        var newMeta = newMaterial.meta;
        var p;
        for (p in oldMeta)
        {
            if (oldMeta.hasOwnProperty(p))
            {
                newMeta[p] = oldMeta[p];
            }
        }

        // Copy technique parameters
        var oldTechniqueParameters = this.techniqueParameters;
        var newTechniqueParameters = newMaterial.techniqueParameters;
        for (p in oldTechniqueParameters)
        {
            if (oldTechniqueParameters.hasOwnProperty(p))
            {
                newTechniqueParameters[p] = oldTechniqueParameters[p];
            }
        }

        // Copy texture names
        var oldTextureNames = this.texturesNames;
        if (oldTextureNames)
        {
            var newTextureNames = newMaterial.texturesNames;
            if (!newTextureNames)
            {
                newMaterial.texturesNames = newTextureNames = {};
            }

            for (p in oldTextureNames)
            {
                if (oldTextureNames.hasOwnProperty(p))
                {
                    newTextureNames[p] = oldTextureNames[p];
                }
            }
        }

        // Copy texture instances
        var oldTextureInstances = this.textureInstances;
        if (oldTextureInstances)
        {
            var newTextureInstances = newMaterial.textureInstances;
            if (!newTextureInstances)
            {
                newMaterial.textureInstances = newTextureInstances = {};
            }

            for (p in oldTextureInstances)
            {
                if (oldTextureInstances.hasOwnProperty(p))
                {
                    var textureInstance = oldTextureInstances[p];
                    newTextureInstances[p] = textureInstance;
                    textureInstance.subscribeTextureChanged(newMaterial.onTextureChanged);
                    textureInstance.reference.add();
                }
            }
        }

        return newMaterial;
    }

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
    }

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
    }

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
    }
}
