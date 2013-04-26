// Copyright (c) 2009-2011 Turbulenz Limited

/*exported dumpShader*/

var dumpShader = function dumpShaderFn(shader, log)
{
    log("<h2>Shader: " + shader.name + "</h2>");

    var techniquesString = "<ul>";
    var numTechniques = shader.numTechniques;
    for (var t = 0; t < numTechniques; t += 1)
    {
        var technique = shader.getTechnique(t);
        techniquesString += "<li>Technique: " + technique.name;
        techniquesString += "<ul>";
        var numPasses = technique.numPasses;
        for (var p = 0; p < numPasses; p += 1)
        {
            var pass = technique.getPass(p);
            techniquesString += "<li>Pass: " + pass.name + "</li>";
        }
        techniquesString += "</ul>";
        techniquesString += "</li>";
    }
    techniquesString += "</ul>";
    log(techniquesString);

    var parametersString = "<ul>";
    var numParameters = shader.numParameters;
    for (var r = 0; r < numParameters; r += 1)
    {
        var param = shader.getParameter(r);
        parametersString += "<li>Parameter: " + param.name;
        parametersString += " (";
        var numRows = param.rows;
        if (1 < numRows)
        {
            parametersString += numRows;
            parametersString += " ";
        }
        parametersString += param.type;
        var numColumns = param.columns;
        if (1 < numColumns)
        {
            parametersString += numColumns;
        }
        parametersString += ")";
        parametersString += "</li>";
    }
    parametersString += "</ul>";
    log(parametersString);
};
