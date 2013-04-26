// Copyright (c) 2011-2012 Turbulenz Limited
/*global TurbulenzEngine*/
/*global Uint8Array*/
/*global window*/
"use strict";

/// <reference path="graphicsdevice.ts" />

//
// TARLoader
//
interface TARLoaderParameters
{
    gd: any;
    src: string;
    mipmaps: bool;
    ontextureload: { (Texture): void; };
    onload: { (success: bool, status: number): void; };
    onerror: { (msg?: string): void; };
};

interface TARLoader
{
    gd: WebGLGraphicsDevice;
    mipmaps: bool;
    src: string;
    ontextureload: { (texture: Texture): void; };
    onload: { (success: bool, status: number): void; };
    onerror: { (): void; };
    texturesLoading: number;

    processBytes: { (bytes: Uint8Array): bool; };
};
declare var TARLoader :
{
    new(): TARLoader;
    prototype: any;
    create(params: TARLoaderParameters): TARLoader;
};


function TARLoader() { return this; }
TARLoader.prototype = {

    version : 1,

    processBytes : function processBytesFn(bytes)
    {
        var offset = 0;
        var totalSize = bytes.length;

        function skip(limit)
        {
            offset += limit;
        }

        function getString(limit)
        {
            var index = offset;
            var nextOffset = (index + limit);
            var c = bytes[index];
            var ret;
            if (c && 0 < limit)
            {
                index += 1;
                var s = new Array(limit);
                var n = 0;
                do
                {
                    s[n] = c;
                    n += 1;

                    c = bytes[index];
                    index += 1;
                }
                while (c && n < limit);
                // remove padding whitespace
                while (s[n - 1] === 32)
                {
                    n -= 1;
                }
                s.length = n;
                ret = String.fromCharCode.apply(null, s);
            }
            else
            {
                ret = '';
            }
            offset = nextOffset;
            return ret;
        }

        function getNumber(text)
        {
            /*jshint regexp: false*/
            text = text.replace(/[^\d]/g, '');
            /*jshint regexp: true*/
            return parseInt('0' + text, 8);
        }

        var header = {
            fileName : null,
            //mode : null,
            //uid : null,
            //gid : null,
            length : 0,
            //lastModified : null,
            //checkSum : null,
            fileType : null,
            //linkName : null,
            ustarSignature : null,
            //ustarVersion : null,
            //ownerUserName : null,
            //ownerGroupName : null,
            //deviceMajor : null,
            //deviceMinor : null,
            fileNamePrefix : null
        };

        function parseHeader(header)
        {
            header.fileName = getString(100);
            skip(8);//header.mode = getString(8);
            skip(8);//header.uid = getString(8);
            skip(8);//header.gid = getString(8);
            header.length = getNumber(getString(12));
            skip(12);//header.lastModified = getString(12);
            skip(8);//header.checkSum = getString(8);
            header.fileType = getString(1);
            skip(100);//header.linkName = getString(100);
            header.ustarSignature = getString(6);
            skip(2);//header.ustarVersion = getString(2);
            skip(32);//header.ownerUserName = getString(32);
            skip(32);//header.ownerGroupName = getString(32);
            skip(8);//header.deviceMajor = getString(8);
            skip(8);//header.deviceMinor = getString(8);
            header.fileNamePrefix = getString(155);
            offset += 12;
        }

        var gd = this.gd;
        var mipmaps = this.mipmaps;
        var ontextureload = this.ontextureload;
        var result = true;

        this.texturesLoading = 0;
        var that = this;
        function onload(texture)
        {
            that.texturesLoading -= 1;
            if (texture)
            {
                ontextureload(texture);
            }
            else
            {
                offset = totalSize;
                result = false;
            }
        }

        while ((offset + 512) <= totalSize)
        {
            parseHeader(header);
            if (0 < header.length)
            {
                var fileName;
                if (header.fileName === "././@LongLink")
                {
                    // name in next chunk
                    fileName = getString(256);
                    offset += 256;

                    parseHeader(header);
                }
                else
                {
                    if (header.fileNamePrefix &&
                        header.ustarSignature === "ustar")
                    {
                        fileName = (header.fileNamePrefix + header.fileName);
                    }
                    else
                    {
                        fileName = header.fileName;
                    }
                }
                if ('' === header.fileType || '0' === header.fileType)
                {
                    //console.log('Loading "' + fileName + '" (' + header.length + ')');
                    this.texturesLoading += 1;
                    gd.createTexture({
                        src : fileName,
                        data : bytes.subarray(offset, (offset + header.length)),
                        mipmaps : mipmaps,
                        onload : onload
                    });
                }
                offset += (Math.floor((header.length + 511) / 512) * 512);
            }
        }

        bytes = null;

        return result;
    },

    isValidHeader : function isValidHeaderFn(/* header */)
    {
        return true;
    }
};

// Constructor function
TARLoader.create = function TarLoaderCreateFn(params)
{
    var loader = new TARLoader();
    loader.gd = params.gd;
    loader.mipmaps = params.mipmaps;
    loader.ontextureload = params.ontextureload;
    loader.onload = params.onload;
    loader.onerror = params.onerror;
    loader.texturesLoading = 0;

    var src = params.src;
    if (src)
    {
        loader.src = src;
        var xhr;
        if (window.XMLHttpRequest)
        {
            xhr = new window.XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }
        else
        {
            if (params.onerror)
            {
                params.onerror("No XMLHTTPRequest object could be created");
            }
            return null;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4)
            {
                if (!TurbulenzEngine || !TurbulenzEngine.isUnloading())
                {
                    var xhrStatus = xhr.status;
                    var xhrStatusText = xhr.status !== 0 && xhr.statusText || 'No connection';

                    // Sometimes the browser sets status to 200 OK when the connection is closed
                    // before the message is sent (weird!).
                    // In order to address this we fail any completely empty responses.
                    // Hopefully, nobody will get a valid response with no headers and no body!
                    if (xhr.getAllResponseHeaders() === "" && xhr.responseText === "" && xhrStatus === 200 && xhrStatusText === 'OK')
                    {
                        loader.onload(false, 0);
                        return;
                    }

                    if (xhrStatus === 200 || xhrStatus === 0)
                    {
                        var buffer;
                        if (xhr.responseType === "arraybuffer")
                        {
                            buffer = xhr.response;
                        }
                        else if (xhr.mozResponseArrayBuffer)
                        {
                            buffer = xhr.mozResponseArrayBuffer;
                        }
                        else //if (xhr.responseText !== null)
                        {
                            /*jshint bitwise: false*/
                            var text = xhr.responseText;
                            var numChars = text.length;
                            buffer = [];
                            buffer.length = numChars;
                            for (var i = 0; i < numChars; i += 1)
                            {
                                buffer[i] = (text.charCodeAt(i) & 0xff);
                            }
                            /*jshint bitwise: true*/
                        }

                        // Fix for loading from file
                        if (xhrStatus === 0 && window.location.protocol === "file:")
                        {
                            xhrStatus = 200;
                        }

                        if (loader.processBytes(new Uint8Array(buffer)))
                        {
                            if (loader.onload)
                            {
                                var callOnload = function callOnloadFn()
                                {
                                    if (0 < loader.texturesLoading)
                                    {
                                        if (!TurbulenzEngine || !TurbulenzEngine.isUnloading())
                                        {
                                            window.setTimeout(callOnload, 100);
                                        }
                                    }
                                    else
                                    {
                                        loader.onload(true, xhrStatus);
                                    }
                                };
                                callOnload();
                            }
                        }
                        else
                        {
                            if (loader.onerror)
                            {
                                loader.onerror();
                            }
                        }
                    }
                    else
                    {
                        if (loader.onerror)
                        {
                            loader.onerror();
                        }
                    }
                }
                // break circular reference
                xhr.onreadystatechange = null;
                xhr = null;
            }
        };
        xhr.open("GET", params.src, true);
        if (xhr.hasOwnProperty && xhr.hasOwnProperty("responseType"))
        {
            xhr.responseType = "arraybuffer";
        }
        else if (xhr.overrideMimeType)
        {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
        else
        {
            xhr.setRequestHeader("Content-Type", "text/plain; charset=x-user-defined");
        }
        xhr.send(null);
    }

    return loader;
};
