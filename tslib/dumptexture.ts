// Copyright (c) 2009-2011 Turbulenz Limited

/*exported dumpTexture*/

var dumpTexture = function dumpTextureFn(texture, log)
{
    log("<h2>Texture: " + texture.name + "</h2>");

    var textureString = "<ul>";

    textureString += "<li>Format: "  + texture.format  + "</li>";
    textureString += "<li>Width: "   + texture.width   + "</li>";
    textureString += "<li>Height: "  + texture.height  + "</li>";
    textureString += "<li>Depth: "   + texture.depth   + "</li>";
    textureString += "<li>Cubemap: " + texture.cubemap + "</li>";
    textureString += "<li>Mipmaps: " + texture.mipmaps + "</li>";
    textureString += "<li>Dynamic: " + texture.dynamic + "</li>";
    textureString += "<li>Renderable: " + texture.renderable + "</li>";

    var data = texture.data;
    if (data)
    {
        textureString += "<li>Data: [";
        var lastelement = (data.length - 1);
        for (var n = 0; n < lastelement; n += 1)
        {
            textureString += data[n] + ", ";
        }
        textureString += data[lastelement];
        textureString += "]</li>";
    }

    textureString += "</ul>";

    log(textureString);
};
