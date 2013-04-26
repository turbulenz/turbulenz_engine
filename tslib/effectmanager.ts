// Copyright (c) 2009-2013 Turbulenz Limited
/*global Utilities: false*/

/// <reference path="turbulenz.d.ts" />
/// <reference path="shadermanager.ts" />
/// <reference path="material.ts" />
/// <reference path="geometry.ts" />
/// <reference path="utilities.ts" />


"use strict";

//
// EffectPrepareObject
//
interface EffectPrepareObject
{
    prepare(renderable: Renderable);
    shaderName: string;
    techniqueName: string;
    update(camera: Camera);
    loadTechniques(shaderManager: ShaderManager);
};

//
// Effect
//
class Effect
{
    static version = 1;

    name: string;
    geometryType: { [type: string]: EffectPrepareObject; }; // TODO
    numMaterials: number;
    materialsMap: { [hash: string]: number; };

    static create(name: string): Effect
    {
        var effect = new Effect();

        effect.name = name;
        effect.geometryType = {};
        effect.numMaterials = 0;
        effect.materialsMap = {};

        return effect;
    };

    hashMaterial(material: Material)
    {
        var texturesNames = material.texturesNames;
        var hashArray = [];
        var numTextures = 0;
        for (var p in texturesNames)
        {
            if (texturesNames.hasOwnProperty(p))
            {
                hashArray[numTextures] = texturesNames[p];
                numTextures += 1;
            }
        }
        if (1 < numTextures)
        {
            hashArray.sort();
            return hashArray.join(',');
        }
        else
        {
            return hashArray[0];
        }
    };

    prepareMaterial(material: Material)
    {
        var hash = this.hashMaterial(material);
        var index = this.materialsMap[hash];
        if (index === undefined)
        {
            index = this.numMaterials;
            this.numMaterials += 1;
            this.materialsMap[hash] = index;
        }
        material.meta.materialIndex = index;
        material.effect = this;
    };

    add(geometryType: string, prepareObject)
    {
        this.geometryType[geometryType] = prepareObject;
    };

    remove(geometryType: string)
    {
        delete this.geometryType[geometryType];
    };

    get(geometryType: string): EffectPrepareObject
    {
        return this.geometryType[geometryType];
    }

    prepare(renderable: Renderable)
    {
        var prepareObject = this.geometryType[renderable.geometryType];
        if (prepareObject)
        {
            prepareObject.prepare(renderable);
        }
        else
        {
            debug.abort("Unsupported or missing geometryType");
        }
    };
};

//
// EffectManager
//
class EffectManager
{
    static version = 1;

    effects: any; // { [effectName: string]: Effect; };

    static create(): EffectManager
    {
        var effectManager = new EffectManager();
        effectManager.effects = {};
        return effectManager;
    };

    add(effect: Effect)
    {
        debug.assert(this.effects[effect.name] === undefined);
        this.effects[effect.name] = effect;
    };

    remove(name: string)
    {
        delete this.effects[name];
    };

    map(destination: string, source: string)
    {
        this.effects[destination] = this.effects[source];
    };

    get(name: string): Effect
    {
        var effect = this.effects[name];
        if (!effect)
        {
            return this.effects["default"];
        }
        return effect;
    };
};
