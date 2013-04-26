// Copyright (c) 2009-2011 Turbulenz Limited

/*exported dumpIndexBuffer*/

var dumpIndexBuffer = function dumpIndexBufferFn(indexbuffer, log)
{
    log("<h2>IndexBuffer</h2>");

    var bufferString = "<ul>";

    bufferString += "<li>NumIndices: " + indexbuffer.numIndices + "</li>";
    bufferString += "<li>Format: " + indexbuffer.format + "</li>";
    bufferString += "<li>Dynamic: " + indexbuffer.dynamic + "</li>";

    var data = indexbuffer.data;
    if (data)
    {
        bufferString += "<li>Data: [";
        var lastelement = (data.length - 1);
        for (var n = 0; n < lastelement; n += 1)
        {
            bufferString += data[n] + ", ";
        }
        bufferString += data[lastelement];
        bufferString += "]</li>";
    }

    bufferString += "</ul>";

    log(bufferString);
};
