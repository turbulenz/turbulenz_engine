// Copyright (c) 2011-2012 Turbulenz Limited
/*global TurbulenzEngine*/
/*global Uint8Array*/
/*global window*/
"use strict";

/// <reference path="sounddevice.ts" />

// Some old browsers had a broken implementation of ArrayBuffer without a "slice" method
if ((typeof ArrayBuffer !== "undefined") &&
    (ArrayBuffer.prototype !== undefined) &&
    (ArrayBuffer.prototype.slice === undefined))
{
    ArrayBuffer.prototype.slice = function ArrayBufferSlice(s?, e?)
    {
        var length = this.byteLength;
        if (s === undefined)
        {
            s = 0;
        }
        else if (s < 0)
        {
            s += length;
        }
        if (e === undefined)
        {
            e = length;
        }
        else if (e < 0)
        {
            e += length;
        }

        length = (e - s);
        if (0 < length)
        {
            var src = new Uint8Array(this, s, length);
            var dst = new Uint8Array(src);
            return dst.buffer;
        }
        else
        {
            return new ArrayBuffer(0);
        }
    };
}

//
// SoundTARLoader
//
interface SoundTARLoader
{
    sd: WebGLSoundDevice;
    uncompress: bool;
    onsoundload: { (sound: WebGLSound): void; };
    onload: { (result: bool, status: number): void; };
    onerror: { (): void; };
    soundsLoading: number;
    src: string;

    processBytes : { (bytes: Uint8Array): bool; };

};
declare var SoundTARLoader :
{
    new(): SoundTARLoader;
    prototype: any;
    create(params: any): SoundTARLoader;
};


function SoundTARLoader() { return this; }
SoundTARLoader.prototype = {

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

        var sd = this.sd;
        var uncompress = this.uncompress;
        var onsoundload = this.onsoundload;
        var result = true;

        // This function is called for each sound in the archive,
        // synchronously if there is an immediate error,
        // asynchronously otherwise.  If one fails, the load result
        // for the whole archive is false.

        this.soundsLoading = 0;
        var that = this;
        function onload(sound)
        {
            that.soundsLoading -= 1;
            if (sound)
            {
                onsoundload(sound);
            }
            else
            {
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
                    this.soundsLoading += 1;
                    sd.createSound({
                        src : fileName,
                        data : (sd.audioContext ?
                                bytes.buffer.slice(offset, (offset + header.length)) :
                                bytes.subarray(offset, (offset + header.length))),
                        uncompress : uncompress,
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
SoundTARLoader.create = function tgaLoaderFn(params)
{
    var loader = new SoundTARLoader();
    loader.sd = params.sd;
    loader.uncompress = params.uncompress;
    loader.onsoundload = params.onsoundload;
    loader.onload = params.onload;
    loader.onerror = params.onerror;
    loader.soundsLoading = 0;

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
                            var i;
                            buffer = [];
                            buffer.length = numChars;
                            for (i = 0; i < numChars; i += 1)
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

                        // processBytes returns false if any of the
                        // entries in the archive was not supported or
                        // couldn't be loaded as a sound.

                        var archiveResult =
                            loader.processBytes(new Uint8Array(buffer));

                        // Wait until all sounds have been loaded (or
                        // failed) and return the result.

                        if (loader.onload)
                        {
                            var callOnload = function callOnloadFn()
                            {
                                if (0 < loader.soundsLoading)
                                {
                                    if (!TurbulenzEngine || !TurbulenzEngine.isUnloading())
                                    {
                                        window.setTimeout(callOnload, 100);
                                    }
                                }
                                else
                                {
                                    loader.onload(archiveResult, xhrStatus);
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
