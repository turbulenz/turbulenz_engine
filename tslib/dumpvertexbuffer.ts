// Copyright (c) 2009-2011 Turbulenz Limited

/*exported dumpVertexBuffer*/

var dumpVertexBuffer = function dumpVertexBufferFn(vertexbuffer, log)
{
    log("<h2>VertexBuffer</h2>");

    var bufferString = "<ul>";

    bufferString += "<li>NumVertices: " + vertexbuffer.numVertices + "</li>";
    bufferString += "<li>Dynamic: " + vertexbuffer.dynamic + "</li>";

    var n;

    var attributes = vertexbuffer.attributes;
    if (attributes)
    {
        bufferString += "<li>Attributes: [";
        var lastattribute = (attributes.length - 1);
        for (n = 0; n < lastattribute; n += 1)
        {
            bufferString += attributes[n] + ", ";
        }
        bufferString += attributes[lastattribute];
        bufferString += "]</li>";
    }

    var data = vertexbuffer.data;
    if (data)
    {
        bufferString += "<li>Data: [";
        var lastelement = (data.length - 1);
        for (n = 0; n < lastelement; n += 1)
        {
            bufferString += data[n] + ", ";
        }
        bufferString += data[lastelement];
        bufferString += "]</li>";
    }

    bufferString += "</ul>";
    log(bufferString);
};
