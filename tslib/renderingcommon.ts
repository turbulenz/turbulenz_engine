// Copyright (c) 2010-2011 Turbulenz Limited

/*exported renderingCommonSortKeyFn*/
/*exported renderingCommonCreateRendererInfoFn*/
/*exported renderingCommonAddDrawParameterFastestFn*/

//
// renderingCommonGetTechniqueIndexFn
//
declare var renderingCommonGetTechniqueIndexFn :
{
    (techniqueName: string): number;
    techniquesIndexMap: { [techniqueName: string] : number; };
    numTechniques: number;
};

var renderingCommonGetTechniqueIndexFn =
    function renderingCommonGetTechniqueIndexFnFn(techniqueName)
{
    var dataStore = renderingCommonGetTechniqueIndexFn;
    var techniqueIndex = dataStore.techniquesIndexMap[techniqueName];
    if (techniqueIndex === undefined)
    {
        techniqueIndex = dataStore.numTechniques;
        dataStore.techniquesIndexMap[techniqueName] = techniqueIndex;
        dataStore.numTechniques += 1;
    }
    return techniqueIndex;
}

renderingCommonGetTechniqueIndexFn.techniquesIndexMap = {};
renderingCommonGetTechniqueIndexFn.numTechniques = 0;

//
// renderingCommonSortKeyFn
//
function renderingCommonSortKeyFn(techniqueIndex, materialIndex, nodeIndex?)
{
    var sortKey = ((techniqueIndex * 0x10000) + (materialIndex % 0x10000));
    if (nodeIndex)
    {
        sortKey += (1.0 / (1.0 + nodeIndex))
    }
    return sortKey;
}

//
// renderingCommonCreateRendererInfoFn
//
function renderingCommonCreateRendererInfoFn(renderable)
{
    var rendererInfo = {
        far: renderable.sharedMaterial.meta.far
    };
    renderable.rendererInfo = rendererInfo;

    var effect = renderable.sharedMaterial.effect;
    if (effect.prepare)
    {
        effect.prepare(renderable);
    }

    return rendererInfo;
}

//
// renderingCommonAddDrawParameterFastestFn
//
var renderingCommonAddDrawParameterFastestFn =
    function renderingCommonAddDrawParameterFastestFnFn(drawParameters)
{
    var array = this.array;
    array[array.length] = drawParameters;
}
