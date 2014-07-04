// Copyright (c) 2011-2014 Turbulenz Limited

/*global TurbulenzEngine*/
/*global TGALoader*/
/*global DDSLoader*/
/*global TARLoader*/
/*global Int8Array*/
/*global Int16Array*/
/*global Int32Array*/
/*global Uint8Array*/
/*global Uint8ClampedArray*/
/*global Uint16Array*/
/*global Uint32Array*/
/*global Float32Array*/
/*global ArrayBuffer*/
/*global DataView*/
/*global window*/
/*global debug*/

"use strict";

// Extra declarations for WebGL-related types.

interface HTMLCanvasElement {
	getContext(contextId: string, params : {}): WebGLRenderingContext;
    toDataURL(format?: string);

    ALLOW_KEYBOARD_INPUT?: any;

    webkitRequestFullScreenWithKeys?: () => void;
    requestFullScreenWithKeys?: () => void;
    webkitRequestFullScreen?: (flags?: any) => void;
    mozRequestFullScreen?: () => void;
    requestFullScreen?: () => void;
    requestFullscreen?: () => void;

}

interface WebGLSampler
{
    minFilter: number;
    magFilter: number;
    wrapS: number;
    wrapT: number;
    wrapR: number;
    maxAnisotropy: number;
}

interface WebGLVideoSupportedExtensions
{
    webm?: boolean;
    mp4?: boolean;
    m4v?: boolean;
};

// -----------------------------------------------------------------------------
class TZWebGLTexture implements Texture
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // Texture
    id                : number;
    name              : string;
    width             : number;
    height            : number;
    depth             : number;
    format            : number;
    mipmaps           : boolean;
    cubemap           : boolean;
    dynamic           : boolean;
    renderable        : boolean;

    // TZWebGLTexture
    gd                : any;
    failed            : boolean;
    glDepthAttachment : number;  // If renderable and a depth format
    target            : number;
    glTexture         : WebGLTexture;
    sampler           : WebGLSampler;

    setData(data: any,
            face?: number,
            level?: number,
            x?: number,
            y?: number,
            w?: number,
            h?: number)
    {
        var gd = this.gd;
        var target = this.target;
        gd.bindTexture(target, this.glTexture);
        debug.assert(arguments.length === 1 || 3 <= arguments.length);
        if (3 <= arguments.length)
        {
            if (x === undefined)
            {
                x = 0;
            }
            if (y === undefined)
            {
                y = 0;
            }
            if (w === undefined)
            {
                w = (this.width - x);
            }
            if (h === undefined)
            {
                h = (this.height - y);
            }
            this.updateSubData(data, face, level, x, y, w, h);
        }
        else
        {
            this.updateData(data);
        }
        gd.bindTexture(target, null);
    }

    // Internal
    private createGLTexture(data)
    {
        var gd = this.gd;
        var gl = gd.gl;

        var target;
        if (this.cubemap)
        {
            target = gl.TEXTURE_CUBE_MAP;
        }
        else if (this.depth > 1)
        {
            //target = gl.TEXTURE_3D;
            // 3D textures are not supported yet
            return false;
        }
        else
        {
            target = gl.TEXTURE_2D;
        }
        this.target = target;

        var gltex = gl.createTexture();
        this.glTexture = gltex;

        gd.bindTexture(target, gltex);

        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        if (this.mipmaps)
        {
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        }
        else
        {
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        this.updateData(data);

        gd.bindTexture(target, null);

        return true;
    }

    convertDataToRGBA(gl, data, internalFormat, gltype, srcStep)
    {
        var numPixels = (data.length / srcStep);
        var rgbaData = new Uint8Array(numPixels * 4);
        var offset = 0;
        var n, value, r, g, b, a;
        if (internalFormat === gl.LUMINANCE)
        {
            debug.assert(srcStep === 1);
            for (n = 0; n < numPixels; n += 1, offset += 4)
            {
                r = data[n];
                rgbaData[offset    ] = r;
                rgbaData[offset + 1] = r;
                rgbaData[offset + 2] = r;
                rgbaData[offset + 3] = 0xff;
            }
        }
        else if (internalFormat === gl.ALPHA)
        {
            debug.assert(srcStep === 1);
            for (n = 0; n < numPixels; n += 1, offset += 4)
            {
                a = data[n];
                rgbaData[offset    ] = 0xff;
                rgbaData[offset + 1] = 0xff;
                rgbaData[offset + 2] = 0xff;
                rgbaData[offset + 3] = a;
            }
        }
        else if (internalFormat === gl.LUMINANCE_ALPHA)
        {
            debug.assert(srcStep === 2);
            for (n = 0; n < numPixels; n += 2, offset += 4)
            {
                r = data[n];
                a = data[n + 1];
                rgbaData[offset    ] = r;
                rgbaData[offset + 1] = r;
                rgbaData[offset + 2] = r;
                rgbaData[offset + 3] = a;
            }
        }
        else if (gltype === gl.UNSIGNED_SHORT_5_6_5)
        {
            debug.assert(srcStep === 1);
            /* tslint:disable:no-bitwise */
            for (n = 0; n < numPixels; n += 1, offset += 4)
            {
                value = data[n];
                r = ((value >> 11) & 31);
                g = ((value >> 5) & 63);
                b = ((value) & 31);
                rgbaData[offset    ] = ((r << 3) | (r >> 2));
                rgbaData[offset + 1] = ((g << 2) | (g >> 4));
                rgbaData[offset + 2] = ((b << 3) | (b >> 2));
                rgbaData[offset + 3] = 0xff;
            }
            /* tslint:enable:no-bitwise */
        }
        else if (gltype === gl.UNSIGNED_SHORT_5_5_5_1)
        {
            debug.assert(srcStep === 1);
            /* tslint:disable:no-bitwise */
            for (n = 0; n < numPixels; n += 1, offset += 4)
            {
                value = data[n];
                r = ((value >> 11) & 31);
                g = ((value >> 6) & 31);
                b = ((value >> 1) & 31);
                a = ((value) & 1);
                rgbaData[offset    ] = ((r << 3) | (r >> 2));
                rgbaData[offset + 1] = ((g << 3) | (g >> 2));
                rgbaData[offset + 2] = ((b << 3) | (b >> 2));
                rgbaData[offset + 3] = (a ? 0xff : 0);
            }
            /* tslint:enable:no-bitwise */
        }
        else if (gltype === gl.UNSIGNED_SHORT_4_4_4_4)
        {
            debug.assert(srcStep === 1);
            /* tslint:disable:no-bitwise */
            for (n = 0; n < numPixels; n += 1, offset += 4)
            {
                value = data[n];
                r = ((value >> 12) & 15);
                g = ((value >> 8) & 15);
                b = ((value >> 4) & 15);
                a = ((value) & 15);
                rgbaData[offset    ] = ((r << 4) | r);
                rgbaData[offset + 1] = ((g << 4) | g);
                rgbaData[offset + 2] = ((b << 4) | b);
                rgbaData[offset + 3] = ((a << 4) | a);
            }
            /* tslint:enable:no-bitwise */
        }
        return rgbaData;
    }

    updateData(data)
    {
        var gd = this.gd;
        var gl = gd.gl;

        function log2(a)
        {
            return Math.floor(Math.log(a) / Math.LN2);
        }

        var numLevels, generateMipMaps;
        if (this.mipmaps)
        {
            if (data instanceof Image)
            {
                numLevels = 1;
                generateMipMaps = true;
            }
            else
            {
                numLevels = (1 + Math.max(log2(this.width), log2(this.height)));
                generateMipMaps = false;
            }
        }
        else
        {
            numLevels = 1;
            generateMipMaps = false;
        }

        var format = this.format;
        var internalFormat, gltype, srcStep, bufferData = null;
        var compressedTexturesExtension;

        if (format === gd.PIXELFORMAT_A8)
        {
            internalFormat = gl.ALPHA;
            gltype = gl.UNSIGNED_BYTE;
            srcStep = 1;
            if (data && !data.src)
            {
                if (data instanceof Uint8Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Uint8Array(data);
                }
            }
        }
        else if (format === gd.PIXELFORMAT_L8)
        {
            internalFormat = gl.LUMINANCE;
            gltype = gl.UNSIGNED_BYTE;
            srcStep = 1;
            if (data && !data.src)
            {
                if (data instanceof Uint8Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Uint8Array(data);
                }
            }
        }
        else if (format === gd.PIXELFORMAT_L8A8)
        {
            internalFormat = gl.LUMINANCE_ALPHA;
            gltype = gl.UNSIGNED_BYTE;
            srcStep = 2;
            if (data && !data.src)
            {
                if (data instanceof Uint8Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Uint8Array(data);
                }
            }
        }
        else if (format === gd.PIXELFORMAT_R5G5B5A1)
        {
            internalFormat = gl.RGBA;
            gltype = gl.UNSIGNED_SHORT_5_5_5_1;
            srcStep = 1;
            if (data && !data.src)
            {
                if (data instanceof Uint16Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Uint16Array(data);
                }
            }
        }
        else if (format === gd.PIXELFORMAT_R5G6B5)
        {
            internalFormat = gl.RGB;
            gltype = gl.UNSIGNED_SHORT_5_6_5;
            srcStep = 1;
            if (data && !data.src)
            {
                if (data instanceof Uint16Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Uint16Array(data);
                }
            }
        }
        else if (format === gd.PIXELFORMAT_R4G4B4A4)
        {
            internalFormat = gl.RGBA;
            gltype = gl.UNSIGNED_SHORT_4_4_4_4;
            srcStep = 1;
            if (data && !data.src)
            {
                if (data instanceof Uint16Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Uint16Array(data);
                }
            }
        }
        else if (format === gd.PIXELFORMAT_R8G8B8A8)
        {
            internalFormat = gl.RGBA;
            gltype = gl.UNSIGNED_BYTE;
            srcStep = 4;
            if (data && !data.src)
            {
                if (data instanceof Uint8Array)
                {
                    // Some browsers consider Uint8ClampedArray to be
                    // an instance of Uint8Array (which is correct as
                    // per the spec), yet won't accept a
                    // Uint8ClampedArray as pixel data for a
                    // gl.UNSIGNED_BYTE Texture.  If we have a
                    // Uint8ClampedArray then we can just reuse the
                    // underlying data.

                    if (typeof Uint8ClampedArray !== "undefined" &&
                        data instanceof Uint8ClampedArray)
                    {
                        bufferData = new Uint8Array(data.buffer);
                    }
                    else
                    {
                        bufferData = data;
                    }
                }
                else
                {
                    bufferData = new Uint8Array(data);
                }
            }
        }
        else if (format === gd.PIXELFORMAT_R8G8B8)
        {
            internalFormat = gl.RGB;
            gltype = gl.UNSIGNED_BYTE;
            srcStep = 3;
            if (data && !data.src)
            {
                if (data instanceof Uint8Array)
                {
                    // See comment above about Uint8ClampedArray

                    if (typeof Uint8ClampedArray !== "undefined" &&
                        data instanceof Uint8ClampedArray)
                    {
                        bufferData = new Uint8Array(data.buffer);
                    }
                    else
                    {
                        bufferData = data;
                    }
                }
                else
                {
                    bufferData = new Uint8Array(data);
                }
            }
        }
        else if (format === gd.PIXELFORMAT_D24S8)
        {
            //internalFormat = gl.DEPTH24_STENCIL8_EXT;
            //gltype = gl.UNSIGNED_INT_24_8_EXT;
            //internalFormat = gl.DEPTH_COMPONENT;
            internalFormat = gl.DEPTH_STENCIL;
            gltype = gl.UNSIGNED_INT;
            srcStep = 1;
            if (data && !data.src)
            {
                bufferData = new Uint32Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_DXT1 ||
                 format === gd.PIXELFORMAT_DXT3 ||
                 format === gd.PIXELFORMAT_DXT5)
        {
            compressedTexturesExtension = gd.compressedTexturesExtension;
            if (compressedTexturesExtension)
            {
                if (format === gd.PIXELFORMAT_DXT1)
                {
                    internalFormat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                    srcStep = 8;
                }
                else if (format === gd.PIXELFORMAT_DXT3)
                {
                    internalFormat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                    srcStep = 16;
                }
                else //if (format === gd.PIXELFORMAT_DXT5)
                {
                    internalFormat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                    srcStep = 16;
                }

                if (internalFormat === undefined)
                {
                    return; // Unsupported format
                }

                if (data && !data.src)
                {
                    if (data instanceof Uint8Array)
                    {
                        bufferData = data;
                    }
                    else
                    {
                        bufferData = new Uint8Array(data);
                    }
                }
            }
            else
            {
                return;   // Unsupported format
            }
        }
        else if (format === gd.PIXELFORMAT_RGBA32F)
        {
            if (gd.floatTextureExtension)
            {
                internalFormat = gl.RGBA;
                gltype = gl.FLOAT;
                srcStep = 4;
                if (data && !data.src)
                {
                    if (data instanceof Float32Array)
                    {
                        bufferData = data;
                    }
                    else
                    {
                        bufferData = new Float32Array(data);
                    }
                }
            }
            else
            {
                return; // Unsupported format
            }
        }
        else if (format === gd.PIXELFORMAT_RGB32F)
        {
            if (gd.floatTextureExtension)
            {
                internalFormat = gl.RGB;
                gltype = gl.FLOAT;
                srcStep = 3;
                if (data && !data.src)
                {
                    if (data instanceof Float32Array)
                    {
                        bufferData = data;
                    }
                    else
                    {
                        bufferData = new Float32Array(data);
                    }
                }
            }
            else
            {
                return; // Unsupported format
            }
        }
        else if (format === gd.PIXELFORMAT_RGBA16F)
        {
            if (gd.halfFloatTextureExtension)
            {
                internalFormat = gl.RGBA;
                gltype = gd.halfFloatTextureExtension.HALF_FLOAT_OES;
                srcStep = 4;
                if (data && !data.src)
                {
                    bufferData = data;
                }
            }
            else
            {
                return; // Unsupported format
            }
        }
        else if (format === gd.PIXELFORMAT_RGB16F)
        {
            if (gd.halfFloatTextureExtension)
            {
                internalFormat = gl.RGB;
                gltype = gd.halfFloatTextureExtension.HALF_FLOAT_OES;
                srcStep = 3;
                if (data && !data.src)
                {
                    bufferData = data;
                }
            }
            else
            {
                return; // Unsupported format
            }
        }
        else
        {
            return;   //unknown/unsupported format
        }

        if (gd.fixIE && !compressedTexturesExtension)
        {
            var expand = false;
            if (gd.fixIE < "0.93")
            {
                expand = ((internalFormat !== gl.RGBA && internalFormat !== gl.RGB) ||
                          (gltype !== gl.UNSIGNED_BYTE && gltype !== gl.FLOAT));
            }
            else if (gd.fixIE < "0.94")
            {
                expand = (gltype !== gl.UNSIGNED_BYTE && gltype !== gl.FLOAT);
            }
            if (expand)
            {
                if (bufferData)
                {
                    bufferData = this.convertDataToRGBA(gl, bufferData, internalFormat, gltype, srcStep);
                }
                internalFormat = gl.RGBA;
                gltype = gl.UNSIGNED_BYTE;
                srcStep = 4;
            }
        }

        var w = this.width, h = this.height, offset = 0, target, n, levelSize, levelData;
        if (this.cubemap)
        {
            if (data && data instanceof WebGLVideo)
            {
                return;   //unknown/unsupported format
            }

            target = gl.TEXTURE_CUBE_MAP;

            for (var f = 0; f < 6; f += 1)
            {
                var faceTarget = (gl.TEXTURE_CUBE_MAP_POSITIVE_X + f);
                for (n = 0; n < numLevels; n += 1)
                {
                    if (compressedTexturesExtension)
                    {
                        levelSize = (Math.floor((w + 3) / 4) * Math.floor((h + 3) / 4) * srcStep);
                        if (bufferData)
                        {
                            levelData = bufferData.subarray(offset, (offset + levelSize));
                        }
                        else
                        {
                            levelData = new Uint8Array(levelSize);
                        }
                        if (gd.WEBGL_compressed_texture_s3tc)
                        {
                            gl.compressedTexImage2D(faceTarget, n, internalFormat, w, h, 0,
                                                    levelData);
                        }
                        else
                        {
                            compressedTexturesExtension.compressedTexImage2D(faceTarget, n, internalFormat, w, h, 0,
                                                                             levelData);
                        }
                    }
                    else
                    {
                        levelSize = (w * h * srcStep);
                        if (bufferData)
                        {
                            levelData = bufferData.subarray(offset, (offset + levelSize));
                            gl.texImage2D(faceTarget, n, internalFormat, w, h, 0, internalFormat, gltype, levelData);
                        }
                        else if (data)
                        {
                            gl.texImage2D(faceTarget, n, internalFormat, internalFormat, gltype, data);
                        }
                        else
                        {
                            if (gltype === gl.UNSIGNED_SHORT_5_6_5 ||
                                gltype === gl.UNSIGNED_SHORT_5_5_5_1 ||
                                gltype === gl.UNSIGNED_SHORT_4_4_4_4)
                            {
                                levelData = new Uint16Array(levelSize);
                            }
                            else if (gltype === gl.FLOAT)
                            {
                                levelData = new Float32Array(levelSize);
                            }
                            else if (gd.halfFloatTextureExtension &&
                                     gltype === gd.halfFloatTextureExtension.HALF_FLOAT_OES)
                            {
                                levelData = null;
                            }
                            else
                            {
                                levelData = new Uint8Array(levelSize);
                            }
                            gl.texImage2D(faceTarget, n, internalFormat, w, h, 0, internalFormat, gltype, levelData);
                        }
                    }
                    offset += levelSize;
                    if (bufferData && bufferData.length <= offset)
                    {
                        bufferData = null;
                        data = null;
                        if (0 === n && 1 < numLevels)
                        {
                            generateMipMaps = true;
                            break;
                        }
                    }
                    w = (w > 1 ? Math.floor(w / 2) : 1);
                    h = (h > 1 ? Math.floor(h / 2) : 1);
                }
                w = this.width;
                h = this.height;
            }
        }
        else if (data && data instanceof WebGLVideo)
        {
            target = gl.TEXTURE_2D;
            gl.texImage2D(target, 0, internalFormat, internalFormat, gltype, data.video);
        }
        else
        {
            target = gl.TEXTURE_2D;

            for (n = 0; n < numLevels; n += 1)
            {
                if (compressedTexturesExtension)
                {
                    levelSize = (Math.floor((w + 3) / 4) * Math.floor((h + 3) / 4) * srcStep);
                    if (bufferData)
                    {
                        if (numLevels === 1)
                        {
                            levelData = bufferData;
                        }
                        else
                        {
                            levelData = bufferData.subarray(offset, (offset + levelSize));
                        }
                    }
                    else
                    {
                        levelData = new Uint8Array(levelSize);
                    }
                    if (gd.WEBGL_compressed_texture_s3tc)
                    {
                        gl.compressedTexImage2D(target, n, internalFormat, w, h, 0, levelData);
                    }
                    else
                    {
                        compressedTexturesExtension.compressedTexImage2D(target, n, internalFormat, w, h, 0, levelData);
                    }
                }
                else
                {
                    levelSize = (w * h * srcStep);
                    if (bufferData)
                    {
                        if (numLevels === 1)
                        {
                            levelData = bufferData;
                        }
                        else
                        {
                            levelData = bufferData.subarray(offset, (offset + levelSize));
                        }
                        gl.texImage2D(target, n, internalFormat, w, h, 0, internalFormat, gltype, levelData);
                    }
                    else if (data)
                    {
                        gl.texImage2D(target, n, internalFormat, internalFormat, gltype, data);
                    }
                    else
                    {
                        if (gltype === gl.UNSIGNED_SHORT_5_6_5 ||
                            gltype === gl.UNSIGNED_SHORT_5_5_5_1 ||
                            gltype === gl.UNSIGNED_SHORT_4_4_4_4)
                        {
                            levelData = new Uint16Array(levelSize);
                        }
                        else if (gltype === gl.FLOAT)
                        {
                            levelData = new Float32Array(levelSize);
                        }
                        else if (gd.halfFloatTextureExtension &&
                                 gltype === gd.halfFloatTextureExtension.HALF_FLOAT_OES)
                        {
                            levelData = null;
                        }
                        else
                        {
                            levelData = new Uint8Array(levelSize);
                        }
                        gl.texImage2D(target, n, internalFormat, w, h, 0, internalFormat, gltype, levelData);
                    }
                }
                offset += levelSize;
                if (bufferData && bufferData.length <= offset)
                {
                    bufferData = null;
                    data = null;
                    if (0 === n && 1 < numLevels)
                    {
                        generateMipMaps = true;
                        break;
                    }
                }
                w = (w > 1 ? Math.floor(w / 2) : 1);
                h = (h > 1 ? Math.floor(h / 2) : 1);
            }
        }

        if (generateMipMaps)
        {
            gl.generateMipmap(target);
        }
    }

    updateSubData(data, face, level, x, y, w, h)
    {
        debug.assert(data);
        debug.assert(face === 0 || (this.cubemap && face < 6));
        debug.assert(0 <= x && (x + w) <= this.width);
        debug.assert(0 <= y && (y + h) <= this.height);
        var gd = this.gd;
        var gl = gd.gl;

        var format = this.format;
        var glformat, gltype, bufferData;
        var compressedTexturesExtension;

        if (format === gd.PIXELFORMAT_A8)
        {
            glformat = gl.ALPHA;
            gltype = gl.UNSIGNED_BYTE;
            if (data instanceof Uint8Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint8Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_L8)
        {
            glformat = gl.LUMINANCE;
            gltype = gl.UNSIGNED_BYTE;
            if (data instanceof Uint8Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint8Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_L8A8)
        {
            glformat = gl.LUMINANCE_ALPHA;
            gltype = gl.UNSIGNED_BYTE;
            if (data instanceof Uint8Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint8Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_R5G5B5A1)
        {
            glformat = gl.RGBA;
            gltype = gl.UNSIGNED_SHORT_5_5_5_1;
            if (data instanceof Uint16Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint16Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_R5G6B5)
        {
            glformat = gl.RGB;
            gltype = gl.UNSIGNED_SHORT_5_6_5;
            if (data instanceof Uint16Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint16Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_R4G4B4A4)
        {
            glformat = gl.RGBA;
            gltype = gl.UNSIGNED_SHORT_4_4_4_4;
            if (data instanceof Uint16Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint16Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_R8G8B8A8)
        {
            glformat = gl.RGBA;
            gltype = gl.UNSIGNED_BYTE;
            if (data instanceof Uint8Array)
            {
                // See comment above about Uint8ClampedArray on updateData
                if (typeof Uint8ClampedArray !== "undefined" &&
                    data instanceof Uint8ClampedArray)
                {
                    bufferData = new Uint8Array(data.buffer);
                }
                else
                {
                    bufferData = data;
                }
            }
            else
            {
                bufferData = new Uint8Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_R8G8B8)
        {
            glformat = gl.RGB;
            gltype = gl.UNSIGNED_BYTE;
            if (data instanceof Uint8Array)
            {
                // See comment above about Uint8ClampedArray on updateData
                if (typeof Uint8ClampedArray !== "undefined" &&
                    data instanceof Uint8ClampedArray)
                {
                    bufferData = new Uint8Array(data.buffer);
                }
                else
                {
                    bufferData = data;
                }
            }
            else
            {
                bufferData = new Uint8Array(data);
            }
        }
        else if (format === gd.PIXELFORMAT_DXT1 ||
                 format === gd.PIXELFORMAT_DXT3 ||
                 format === gd.PIXELFORMAT_DXT5)
        {
            compressedTexturesExtension = gd.compressedTexturesExtension;
            if (compressedTexturesExtension)
            {
                if (format === gd.PIXELFORMAT_DXT1)
                {
                    glformat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                }
                else if (format === gd.PIXELFORMAT_DXT3)
                {
                    glformat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                }
                else //if (format === gd.PIXELFORMAT_DXT5)
                {
                    glformat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                }

                if (data instanceof Uint8Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Uint8Array(data);
                }
            }
            else
            {
                return;   // Unsupported format
            }
        }
        else if (format === gd.PIXELFORMAT_RGBA32F)
        {
            if (gd.floatTextureExtension)
            {
                glformat = gl.RGBA;
                gltype = gl.FLOAT;
                if (data instanceof Float32Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Float32Array(data);
                }
            }
            else
            {
                return;   // Unsupported format
            }
        }
        else if (format === gd.PIXELFORMAT_RGB32F)
        {
            if (gd.floatTextureExtension)
            {
                glformat = gl.RGB;
                gltype = gl.FLOAT;
                if (data instanceof Float32Array)
                {
                    bufferData = data;
                }
                else
                {
                    bufferData = new Float32Array(data);
                }
            }
            else
            {
                return;   // Unsupported format
            }
        }
        else if (format === gd.PIXELFORMAT_RGBA16F)
        {
            if (gd.halfFloatTextureExtension)
            {
                glformat = gl.RGBA;
                gltype = gd.halfFloatTextureExtension.HALF_FLOAT_OES;
                bufferData = data;
            }
            else
            {
                return;   // Unsupported format
            }
        }
        else if (format === gd.PIXELFORMAT_RGB16F)
        {
            if (gd.halfFloatTextureExtension)
            {
                glformat = gl.RGB;
                gltype = gd.halfFloatTextureExtension.HALF_FLOAT_OES;
                bufferData = data;
            }
            else
            {
                return;   // Unsupported format
            }
        }
        else
        {
            return;   //unknown/unsupported format
        }

        var target;
        if (this.cubemap)
        {
            if (data instanceof WebGLVideo)
            {
                return;   //unknown/unsupported format
            }

            target = (gl.TEXTURE_CUBE_MAP_POSITIVE_X + face);
        }
        else if (data instanceof WebGLVideo)
        {
            target = gl.TEXTURE_2D;
            // width and height are taken from video
            gl.texSubImage2D(target, level,
                             x, y,
                             glformat, gltype, data.video);
            return;
        }
        else
        {
            target = gl.TEXTURE_2D;
        }

        if (compressedTexturesExtension)
        {
            if (gd.WEBGL_compressed_texture_s3tc)
            {
                gl.compressedTexSubImage2D(target, level,
                                           x, y, w, h,
                                           glformat, bufferData);
            }
            else
            {
                compressedTexturesExtension.compressedTexSubImage2D(target, level,
                                                                    x, y, w, h,
                                                                    glformat, bufferData);
            }
        }
        else
        {
            gl.texSubImage2D(target, level,
                             x, y, w, h,
                             glformat, gltype, bufferData);
        }
    }

    updateMipmaps(face)
    {
        if (this.mipmaps)
        {
            if (this.depth > 1)
            {
                (<WebGLTurbulenzEngine><any>TurbulenzEngine).callOnError(
                    "3D texture mipmap generation unsupported");
                return;
            }

            if (this.cubemap && face !== 5)
            {
                return;
            }

            var gd = this.gd;
            var gl = gd.gl;

            var target = this.target;
            gd.bindTexture(target, this.glTexture);
            gl.generateMipmap(target);
            gd.bindTexture(target, null);
        }
    }

    destroy()
    {
        var gd = this.gd;
        if (gd)
        {
            var glTexture = this.glTexture;
            if (glTexture)
            {
                var gl = gd.gl;
                if (gl)
                {
                    gd.unbindTexture(glTexture);
                    gl.deleteTexture(glTexture);
                }
                delete this.glTexture;
            }

            delete this.sampler;
            delete this.gd;
        }
    }

    typedArrayIsValid(typedArray)
    {
        var gd = this.gd;
        var format = this.format;

        if (gd)
        {
            if ((format === gd.PIXELFORMAT_A8) ||
                (format === gd.PIXELFORMAT_L8) ||
                (format === gd.PIXELFORMAT_S8))
            {
                return ((typedArray instanceof Uint8Array) ||
                        (typeof Uint8ClampedArray !== "undefined" &&
                         typedArray instanceof Uint8ClampedArray)) &&
                    (typedArray.length ===
                     this.width * this.height * this.depth);
            }
            if (format === gd.PIXELFORMAT_L8A8)
            {
                return ((typedArray instanceof Uint8Array) ||
                        (typeof Uint8ClampedArray !== "undefined" &&
                         typedArray instanceof Uint8ClampedArray)) &&
                    (typedArray.length ===
                     2 * this.width * this.height * this.depth);
            }
            if (format === gd.PIXELFORMAT_R8G8B8)
            {
                return ((typedArray instanceof Uint8Array) ||
                        (typeof Uint8ClampedArray !== "undefined" &&
                         typedArray instanceof Uint8ClampedArray)) &&
                    (typedArray.length ===
                     3 * this.width * this.height * this.depth);
            }
            if (format === gd.PIXELFORMAT_R8G8B8A8)
            {
                return ((typedArray instanceof Uint8Array) ||
                        (typeof Uint8ClampedArray !== "undefined" &&
                         typedArray instanceof Uint8ClampedArray)) &&
                    (typedArray.length ===
                     4 * this.width * this.height * this.depth);
            }
            if ((format === gd.PIXELFORMAT_R5G5B5A1) ||
                (format === gd.PIXELFORMAT_R5G6B5) ||
                (format === gd.PIXELFORMAT_R4G4B4A4))
            {
                return (typedArray instanceof Uint16Array) &&
                    (typedArray.length ===
                     this.width * this.height * this.depth);
            }
            if (format === gd.PIXELFORMAT_RGBA32F)
            {
                return (typedArray instanceof Float32Array) &&
                    (typedArray.length === 4 * this.width * this.height * this.depth);
            }
            if (format === gd.PIXELFORMAT_RGB32F)
            {
                return (typedArray instanceof Float32Array) &&
                    (typedArray.length === 3 * this.width * this.height * this.depth);
            }
            if (format === gd.PIXELFORMAT_RGBA16F)
            {
                return (typedArray instanceof Uint16Array) &&
                    (typedArray.length === 4 * this.width * this.height * this.depth);
            }
            if (format === gd.PIXELFORMAT_RGB16F)
            {
                return (typedArray instanceof Uint16Array) &&
                    (typedArray.length === 3 * this.width * this.height * this.depth);
            }
        }
        return false;
    }

    static create(gd: WebGLGraphicsDevice, params)
    {
        var tex = new TZWebGLTexture();
        tex.gd = gd;
        tex.mipmaps = params.mipmaps;
        tex.dynamic = params.dynamic;
        tex.renderable = (params.renderable || false);
        tex.id = ++gd.counters.textures;

        var src = params.src;
        if (src)
        {
            tex.name = params.name || src;
            var extension;
            var data = params.data;
            if (data)
            {
                // do not trust file extensions if we got data...
                if (data[0] === 137 &&
                    data[1] === 80 &&
                    data[2] === 78 &&
                    data[3] === 71)
                {
                    extension = '.png';
                }
                else if (data[0] === 255 &&
                         data[1] === 216 &&
                         data[2] === 255 &&
                         (data[3] === 224 || data[3] === 225))
                {
                    extension = '.jpg';
                }
                else if (data[0] === 68 &&
                         data[1] === 68 &&
                         data[2] === 83 &&
                         data[3] === 32)
                {
                    extension = '.dds';
                }
                else
                {
                    extension = src.slice(-4);
                }
            }
            else
            {
                extension = src.slice(-4);
            }

            // DDS and TGA textures require out own image loaders
            if (extension === '.dds' ||
                extension === '.tga')
            {
                if (extension === '.tga' && typeof TGALoader !== 'undefined')
                {
                    var tgaParams = {
                        gd: gd,
                        onload : function tgaLoadedFn(data, width, height, format, status)
                        {
                            tex.width = width;
                            tex.height = height;
                            tex.depth = 1;
                            tex.format = format;
                            tex.cubemap = false;
                            var result = tex.createGLTexture(data);
                            if (params.onload)
                            {
                                params.onload(result ? tex : null, status);
                            }
                        },
                        onerror : function tgaFailedFn(status)
                        {
                            tex.failed = true;
                            if (params.onload)
                            {
                                params.onload(null, status);
                            }
                        },
                        data: undefined,
                        src: undefined
                    };
                    if (data)
                    {
                        tgaParams.data = data;
                    }
                    else
                    {
                        tgaParams.src = src;
                    }
                    TGALoader.create(tgaParams);
                    return tex;
                }
                else if (extension === '.dds' && typeof DDSLoader !== 'undefined')
                {
                    var ddsParams = {
                        gd: gd,
                        onload : function ddsLoadedFn(data, width, height, format, numLevels, cubemap, depth, status)
                        {
                            tex.width = width;
                            tex.height = height;
                            tex.format = format;
                            tex.cubemap = cubemap;
                            tex.depth = depth;
                            if (1 < numLevels)
                            {
                                if (!tex.mipmaps)
                                {
                                    tex.mipmaps = true;
                                    debug.log("Mipmap levels provided for texture created without mipmaps enabled: " +
                                              tex.name);
                                }
                            }
                            var result = tex.createGLTexture(data);
                            if (params.onload)
                            {
                                params.onload(result ? tex : null, status);
                            }
                        },
                        onerror : function ddsFailedFn(status)
                        {
                            tex.failed = true;
                            if (params.onload)
                            {
                                params.onload(null, status);
                            }
                        },
                        data: undefined,
                        src: undefined
                    };
                    if (data)
                    {
                        ddsParams.data = data;
                    }
                    else
                    {
                        ddsParams.src = src;
                    }
                    DDSLoader.create(ddsParams);
                    return tex;
                }
                else
                {
                    (<WebGLTurbulenzEngine><any>TurbulenzEngine).callOnError(
                        'Missing image loader required for ' + src);

                    tex = TZWebGLTexture.create(gd, {
                        name    : (params.name || src),
                        width   : 2,
                        height  : 2,
                        depth   : 1,
                        format  : 'R8G8B8A8',
                        cubemap : false,
                        mipmaps : params.mipmaps,
                        dynamic : params.dynamic,
                        renderable : params.renderable,
                        data    : [255,  20, 147, 255,
                                   255,   0,   0, 255,
                                   255, 255, 255, 255,
                                   255,  20, 147, 255]
                    });

                    if (params.onload)
                    {
                        if (TurbulenzEngine)
                        {
                            TurbulenzEngine.setTimeout(function () {
                                params.onload(tex, 200);
                            }, 0);
                        }
                        else
                        {
                            window.setTimeout(function () {
                                params.onload(tex, 200);
                            }, 0);
                        }
                    }
                    return tex;
                }
            }

            var img = new Image();
            var imageLoaded = function imageLoadedFn()
            {
                tex.width = img.width;
                tex.height = img.height;
                tex.depth = 1;
                tex.format = gd.PIXELFORMAT_R8G8B8A8;
                tex.cubemap = false;
                var result = tex.createGLTexture(img);
                if (params.onload)
                {
                    params.onload(result ? tex : null, 200);
                }
            };
            img.onload = imageLoaded;
            img.onerror = function imageFailedFn()
            {
                tex.failed = true;
                if (params.onload)
                {
                    params.onload(null);
                }
            };
            if (data)
            {
                if (typeof Blob !== "undefined" && typeof URL !== "undefined" && URL.createObjectURL)
                {
                    var dataBlob;
                    if (extension === '.jpg' || extension === '.jpeg')
                    {
                        dataBlob = new Blob([data], {type: "image/jpeg"});
                    }
                    else if (extension === '.png')
                    {
                        dataBlob = new Blob([data], {type: "image/png"});
                    }
                    debug.assert(data.length === dataBlob.size, "Blob constructor does not support typed arrays.");
                    img.onload = function blobImageLoadedFn()
                    {
                        imageLoaded();
                        URL.revokeObjectURL(img.src);
                        dataBlob = null;
                    };
                    src = URL.createObjectURL(dataBlob);
                }
                else
                {
                    if (extension === '.jpg' || extension === '.jpeg')
                    {
                        src = 'data:image/jpeg;base64,' +
                            (<WebGLTurbulenzEngine><any>TurbulenzEngine)
                            .base64Encode(data);
                    }
                    else if (extension === '.png')
                    {
                        src = 'data:image/png;base64,' +
                            (<WebGLTurbulenzEngine><any>TurbulenzEngine)
                            .base64Encode(data);
                    }
                }
                img.src = src;
            }
            else if (typeof URL !== "undefined" && URL.createObjectURL)
            {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4)
                    {
                        if (!TurbulenzEngine || !TurbulenzEngine.isUnloading())
                        {
                            var xhrStatus = xhr.status;
                            // Fix for loading from file
                            if (xhrStatus === 0 &&
                                (window.location.protocol === "file:" ||
                                 window.location.protocol === "chrome-extension:"))
                            {
                                xhrStatus = 200;
                            }

                            // Sometimes the browser sets status to 200 OK when the connection is closed
                            // before the message is sent (weird!).
                            // In order to address this we fail any completely empty responses.
                            // Hopefully, nobody will get a valid response with no headers and no body!
                            if (xhr.getAllResponseHeaders() === "" && !xhr.response)
                            {
                                if (params.onload)
                                {
                                    params.onload(null, 0);
                                }
                            }
                            else
                            {
                                if (xhrStatus === 200 || xhrStatus === 0)
                                {
                                    var blob = xhr.response;
                                    img.onload = function blobImageLoadedFn()
                                    {
                                        imageLoaded();
                                        URL.revokeObjectURL(img.src);
                                        blob = null;
                                    };
                                    img.src = URL.createObjectURL(blob);
                                }
                                else
                                {
                                    params.onload(null, xhrStatus);
                                }
                            }
                            xhr.onreadystatechange = null;
                            xhr = null;
                        }
                        return tex;
                    }
                };
                xhr.open('GET', src, true);
                xhr.responseType = 'blob';
                xhr.send();
            }
            else
            {
                img.crossOrigin = 'anonymous';
                img.src = src;
            }
        }
        else
        {
            // Invalid src values like "" fall through to here
            if ("" === src && params.onload)
            {
                // Assume the caller intended to pass in a valid url.
                return null;
            }

            var format = params.format;
            if (typeof format === 'string')
            {
                format = gd['PIXELFORMAT_' + format];
            }

            tex.width = params.width;
            tex.height = params.height;
            tex.depth = params.depth;
            tex.format = format;
            tex.cubemap = (params.cubemap || false);
            tex.name = params.name;

            var result = tex.createGLTexture(params.data);
            if (!result)
            {
                tex = null;
            }

            // If this is a depth-texture, note the attachment type
            // required, based on the format.

            if (params.renderable)
            {
                if (gd.PIXELFORMAT_D16 === format)
                {
                    tex.glDepthAttachment = gd.gl.DEPTH_ATTACHMENT;
                }
                else if (gd.PIXELFORMAT_D24S8 === format)
                {
                    tex.glDepthAttachment = gd.gl.DEPTH_STENCIL_ATTACHMENT;
                }
            }

            if (params.onload)
            {
                params.onload(tex, 200);
            }
        }

        return tex;
    }
}

//
// WebGLVideo
//
class WebGLVideo implements Video
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // Video
    looping      : boolean;
    playing      : boolean;
    paused       : boolean;
    tell         : number;

    // WebGLVideo
    video        : HTMLVideoElement;
    src          : string;
    length       : number;
    width        : number;
    height       : number;
    elementAdded : boolean;

    // Public API
    play(seek?: number)
    {
        var video = this.video;

        if (!this.playing)
        {
            this.playing = true;
            this.paused = false;
        }

        if (seek === undefined)
        {
            seek = 0;
        }

        if (0.01 < Math.abs(video.currentTime - seek))
        {
            try
            {
                video.currentTime = seek;
            }
            catch (e)
            {
                // There does not seem to be any reliable way of seeking
            }
        }

        video.play();

        return true;
    }

    stop()
    {
        var playing = this.playing;
        if (playing)
        {
            this.playing = false;
            this.paused = false;

            var video = this.video;
            video.pause();
            video.currentTime = 0;
        }

        return playing;
    }

    pause()
    {
        if (this.playing)
        {
            if (!this.paused)
            {
                this.paused = true;

                this.video.pause();
            }

            return true;
        }

        return false;
    }

    resume(seek?: number)
    {
        if (this.paused)
        {
            this.paused = false;

            var video = this.video;

            if (seek !== undefined)
            {
                if (0.01 < Math.abs(video.currentTime - seek))
                {
                    try
                    {
                        video.currentTime = seek;
                    }
                    catch (e)
                    {
                        // There does not seem to be any reliable way of seeking
                    }

                }
            }

            video.play();

            return true;
        }

        return false;
    }

    rewind()
    {
        if (this.playing)
        {
            this.video.currentTime = 0;

            return true;
        }

        return false;
    }

    destroy()
    {
        this.stop();

        if (this.video)
        {
            if (this.elementAdded)
            {
                this.elementAdded = false;
                TurbulenzEngine.canvas.parentElement.removeChild(this.video);
            }
            this.video = null;
        }
    }

    static create(params: any): WebGLVideo
    {
        var v = new WebGLVideo();

        var onload = params.onload;
        var looping = params.looping;
        var src = params.src;

        var userAgent = navigator.userAgent.toLowerCase();

        var video = <HTMLVideoElement>(document.createElement('video'));
        video.preload = 'auto';
        video.autobuffer = true;
        video.muted = true;
        if (looping)
        {
            if (video.loop !== undefined &&
                !userAgent.match(/firefox/))
            {
                video.loop = true;
            }
            else
            {
                video.onended = function () {
                    video.src = src;
                    video.play();
                };
            }
        }
        else
        {
            video.onended = function () {
                v.playing = false;
            };
        }

        v.video = video;
        v.src = src;
        v.playing = false;
        v.paused = false;

        // Safari does not play the video unless is on the page...
        if (userAgent.match(/safari/) && !userAgent.match(/chrome/))
        {
            //video.setAttribute("style", "display: none;");
            video.setAttribute("style", "visibility: hidden;");
            TurbulenzEngine.canvas.parentElement.appendChild(video);
            v.elementAdded = true;
        }

        if (video.webkitDecodedFrameCount !== undefined)
        {
            var lastFrameCount = -1, tell = 0;
            Object.defineProperty(v, "tell", {
                get : function tellFn() {
                    if (lastFrameCount !== this.video.webkitDecodedFrameCount)
                    {
                        lastFrameCount = this.video.webkitDecodedFrameCount;
                        tell = this.video.currentTime;
                    }
                    return tell;
                },
                enumerable : true,
                configurable : false
            });
        }
        else
        {
            Object.defineProperty(v, "tell", {
                get : function tellFn() {
                    return this.video.currentTime;
                },
                enumerable : true,
                configurable : false
            });
        }

        Object.defineProperty(v, "looping", {
            get : function loopingFn() {
                return looping;
            },
            enumerable : true,
            configurable : false
        });

        var loadingVideoFailed = function loadingVideoFailedFn(/* e */)
        {
            if (onload)
            {
                onload(null);
                onload = null;
            }
            video.removeEventListener("error", loadingVideoFailed);
            video = null;
            v.video = null;
            v.playing = false;
        };
        video.addEventListener("error", loadingVideoFailed, false);

        var videoCanPlay = function videoCanPlayFn()
        {
            v.length = video.duration;
            v.width = video.videoWidth;
            v.height = video.videoHeight;

            if (onload)
            {
                onload(v, 200);
                onload = null;
            }

            video.removeEventListener("progress", checkProgress);
            video.removeEventListener("canplaythrough", videoCanPlay);
        };
        var checkProgress = function checkProgressFn()
        {
            if (0 < video.buffered.length && video.buffered.end(0) >= video.duration)
            {
                videoCanPlay();
            }
        };
        video.addEventListener("progress", checkProgress, false);
        video.addEventListener("canplaythrough", videoCanPlay, false);

        video.crossorigin = 'anonymous';
        video.src = src;

        return v;
    }
}


//
// WebGLRenderBuffer
//

class WebGLRenderBuffer implements RenderBuffer
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // RenderBuffer
    id     : number;
    width  : number;
    height : number;
    format : number;

    // WebGLRenderBuffer
    glBuffer: WebGLRenderbuffer;
    glDepthAttachment: number;
    gd: any;

    destroy()
    {
        var gd = this.gd;
        if (gd)
        {
            var glBuffer = this.glBuffer;
            if (glBuffer)
            {
                var gl = gd.gl;
                if (gl)
                {
                    gl.deleteRenderbuffer(glBuffer);
                }
                delete this.glBuffer;
            }

            delete this.gd;
        }
    }

    static create(gd: any, params: any): WebGLRenderBuffer
    {
        var renderBuffer = new WebGLRenderBuffer();

        var width = params.width;
        var height = params.height;
        var format = params.format;
        if (typeof format === 'string')
        {
            format = gd['PIXELFORMAT_' + format];
        }

        if (format !== gd.PIXELFORMAT_D24S8 &&
            format !== gd.PIXELFORMAT_D16)
        {
            return null;
        }

        var gl = gd.gl;

        var glBuffer = gl.createRenderbuffer();

        gl.bindRenderbuffer(gl.RENDERBUFFER, glBuffer);

        var internalFormat;
        var attachment;
        if (gd.PIXELFORMAT_D16 === format)
        {
            internalFormat = gl.DEPTH_COMPONENT16;
            attachment = gl.DEPTH_ATTACHMENT;
        }
        else // if (gd.PIXELFORMAT_D24S8 === format)
        {
            internalFormat = gl.DEPTH_STENCIL;
            attachment = gl.DEPTH_STENCIL_ATTACHMENT;
        }
        // else if (gd.PIXELFORMAT_S8 === format)
        // {
        //     internalFormat = gl.STENCIL_INDEX8;
        //     attachment = gl.STENCIL_ATTACHMENT;
        // }

        gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, width, height);
        renderBuffer.width =
            gl.getRenderbufferParameter(gl.RENDERBUFFER, gl.RENDERBUFFER_WIDTH);
        renderBuffer.height =
            gl.getRenderbufferParameter(gl.RENDERBUFFER, gl.RENDERBUFFER_HEIGHT);

        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        if (renderBuffer.width < width ||
            renderBuffer.height < height)
        {
            gl.deleteRenderbuffer(glBuffer);
            return null;
        }

        renderBuffer.gd = gd;
        renderBuffer.format = format;
        renderBuffer.glDepthAttachment = attachment;
        renderBuffer.glBuffer = glBuffer;
        renderBuffer.id = ++gd.counters.renderBuffers;

        return renderBuffer;
    }
}


//
// WebGLRenderTarget
//
class WebGLRenderTarget implements RenderTarget
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // RenderTarget
    id            : number;
    width         : number;
    height        : number;
    face          : number;
    colorTexture0 : TZWebGLTexture;
    colorTexture1 : TZWebGLTexture;
    colorTexture2 : TZWebGLTexture;
    colorTexture3 : TZWebGLTexture;
    depthBuffer   : WebGLRenderBuffer;
    depthTexture  : TZWebGLTexture;

    // WebGLRenderTarget
    gd: any;
    glObject: any;
    buffers: number[];

    // Shared because there can only be one active at a time
    oldViewportBox : any[]; // prototype
    oldScissorBox : any[]; // prototype

    copyBox(dst, src)
    {
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
    }

    bind()
    {
        var gd = this.gd;
        var gl = gd.gl;

        if (this.colorTexture0)
        {
            gd.unbindTexture(this.colorTexture0.glTexture);
            if (this.colorTexture1)
            {
                gd.unbindTexture(this.colorTexture1.glTexture);
                if (this.colorTexture2)
                {
                    gd.unbindTexture(this.colorTexture2.glTexture);
                    if (this.colorTexture3)
                    {
                        gd.unbindTexture(this.colorTexture3.glTexture);
                    }
                }
            }
        }
        if (this.depthTexture)
        {
            gd.unbindTexture(this.depthTexture.glTexture);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glObject);

        // Only call drawBuffers if we have more than one color attachment
        if (this.colorTexture1)
        {
            var drawBuffersExtension = gd.drawBuffersExtension;
            if (drawBuffersExtension)
            {
                if (gd.WEBGL_draw_buffers)
                {
                    drawBuffersExtension.drawBuffersWEBGL(this.buffers);
                }
                else
                {
                    drawBuffersExtension.drawBuffersEXT(this.buffers);
                }
            }
        }

        var state = gd.state;
        this.copyBox(this.oldViewportBox, state.viewportBox);
        this.copyBox(this.oldScissorBox, state.scissorBox);
        gd.setViewport(0, 0, this.width, this.height);
        gd.setScissor(0, 0, this.width, this.height);

        return true;
    }

    unbind()
    {
        var gd = this.gd;
        var gl = gd.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // Only call drawBuffers if we have more than one color attachment
        if (this.colorTexture1)
        {
            var drawBuffersExtension = gd.drawBuffersExtension;
            if (drawBuffersExtension)
            {
                var buffers = [gl.BACK];

                if (gd.WEBGL_draw_buffers)
                {
                    drawBuffersExtension.drawBuffersWEBGL(buffers);
                }
                else
                {
                    drawBuffersExtension.drawBuffersEXT(buffers);
                }
            }
        }

        var box = this.oldViewportBox;
        gd.setViewport(box[0], box[1], box[2], box[3]);
        box = this.oldScissorBox;
        gd.setScissor(box[0], box[1], box[2], box[3]);

        if (this.colorTexture0)
        {
            this.colorTexture0.updateMipmaps(this.face);
            if (this.colorTexture1)
            {
                this.colorTexture1.updateMipmaps(this.face);
                if (this.colorTexture2)
                {
                    this.colorTexture2.updateMipmaps(this.face);
                    if (this.colorTexture3)
                    {
                        this.colorTexture3.updateMipmaps(this.face);
                    }
                }
            }
        }
        if (this.depthTexture)
        {
            this.depthTexture.updateMipmaps(this.face);
        }
    }

    private _updateColorAttachement(colorTexture: TZWebGLTexture, index: number): void
    {
        var glTexture = colorTexture.glTexture;
        var gl = this.gd.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glObject);
        if (colorTexture.cubemap)
        {
            gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                    (gl.COLOR_ATTACHMENT0 + index),
                                    (gl.TEXTURE_CUBE_MAP_POSITIVE_X + this.face),
                                    glTexture, 0);
        }
        else
        {
            gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                    (gl.COLOR_ATTACHMENT0 + index),
                                    gl.TEXTURE_2D,
                                    glTexture, 0);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    getWidth(): number
    {
        if (this.colorTexture0)
        {
            return this.colorTexture0.width;
        }
        else if (this.depthBuffer)
        {
            return this.depthBuffer.width;
        }
        else if (this.depthTexture)
        {
            return this.depthTexture.width;
        }
    }

    getHeight(): number
    {
        if (this.colorTexture0)
        {
            return this.colorTexture0.height;
        }
        else if (this.depthBuffer)
        {
            return this.depthBuffer.height;
        }
        else if (this.depthTexture)
        {
            return this.depthTexture.height;
        }
    }

    setColorTexture0(colorTexture0: Texture): void
    {
        var oldColorTexture0 = this.colorTexture0;
        debug.assert(oldColorTexture0 &&
                     colorTexture0 &&
                     oldColorTexture0.width === colorTexture0.width &&
                     oldColorTexture0.height === colorTexture0.height &&
                     oldColorTexture0.format === colorTexture0.format &&
                     oldColorTexture0.cubemap === colorTexture0.cubemap);
        this.colorTexture0 = <TZWebGLTexture>(colorTexture0);
        this._updateColorAttachement(this.colorTexture0, 0);
    }

    setColorTexture1(colorTexture1: Texture): void
    {
        var oldColorTexture1 = this.colorTexture1;
        debug.assert(oldColorTexture1 &&
                     colorTexture1 &&
                     oldColorTexture1.width === colorTexture1.width &&
                     oldColorTexture1.height === colorTexture1.height &&
                     oldColorTexture1.format === colorTexture1.format &&
                     oldColorTexture1.cubemap === colorTexture1.cubemap);
        this.colorTexture1 = <TZWebGLTexture>(colorTexture1);
        this._updateColorAttachement(this.colorTexture1, 1);
    }

    setColorTexture2(colorTexture2: Texture): void
    {
        var oldColorTexture2 = this.colorTexture2;
        debug.assert(oldColorTexture2 &&
                     colorTexture2 &&
                     oldColorTexture2.width === colorTexture2.width &&
                     oldColorTexture2.height === colorTexture2.height &&
                     oldColorTexture2.format === colorTexture2.format &&
                     oldColorTexture2.cubemap === colorTexture2.cubemap);
        this.colorTexture2 = <TZWebGLTexture>(colorTexture2);
        this._updateColorAttachement(this.colorTexture2, 2);
    }

    setColorTexture3(colorTexture3: Texture): void
    {
        var oldColorTexture3 = this.colorTexture3;
        debug.assert(oldColorTexture3 &&
                     colorTexture3 &&
                     oldColorTexture3.width === colorTexture3.width &&
                     oldColorTexture3.height === colorTexture3.height &&
                     oldColorTexture3.format === colorTexture3.format &&
                     oldColorTexture3.cubemap === colorTexture3.cubemap);
        this.colorTexture3 = <TZWebGLTexture>(colorTexture3);
        this._updateColorAttachement(this.colorTexture3, 3);
    }

    destroy(): void
    {
        var gd = this.gd;
        if (gd)
        {
            var glObject = this.glObject;
            if (glObject)
            {
                var gl = gd.gl;
                if (gl)
                {
                    gl.deleteFramebuffer(glObject);
                }
                delete this.glObject;
            }

            delete this.colorTexture0;
            delete this.colorTexture1;
            delete this.colorTexture2;
            delete this.colorTexture3;
            delete this.depthBuffer;
            delete this.depthTexture;
            delete this.gd;
        }
    }

    static create(gd: WebGLGraphicsDevice, params: RenderTargetParameters) :
    WebGLRenderTarget
    {
        var renderTarget = new WebGLRenderTarget();

        var colorTexture0 = <TZWebGLTexture>(params.colorTexture0);
        var colorTexture1 = <TZWebGLTexture>
            (colorTexture0 ? (params.colorTexture1 || null) : null);
        var colorTexture2 = <TZWebGLTexture>
            (colorTexture1 ? (params.colorTexture2 || null) : null);
        var colorTexture3 = <TZWebGLTexture>
            (colorTexture2 ? (params.colorTexture3 || null) : null);
        var depthBuffer = <WebGLRenderBuffer>(params.depthBuffer || null);
        var depthTexture = <TZWebGLTexture>(params.depthTexture || null);
        var face = params.face;

        var maxSupported  = gd.maxSupported("RENDERTARGET_COLOR_TEXTURES");
        if (colorTexture1 && maxSupported < 2)
        {
            return null;
        }
        if (colorTexture2 && maxSupported < 3)
        {
            return null;
        }
        if (colorTexture3 && maxSupported < 4)
        {
            return null;
        }

        var gl = gd.gl;
        var colorAttachment0 = gl.COLOR_ATTACHMENT0;

        var glObject = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, glObject);

        var width, height;
        if (colorTexture0)
        {
            width = colorTexture0.width;
            height = colorTexture0.height;

            var glTexture = colorTexture0.glTexture;
            if (glTexture === undefined)
            {
                (<WebGLTurbulenzEngine><any>TurbulenzEngine).callOnError(
                    "Color texture is not a Texture");
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.deleteFramebuffer(glObject);
                return null;
            }

            if (colorTexture0.cubemap)
            {
                gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                        colorAttachment0,
                                        (gl.TEXTURE_CUBE_MAP_POSITIVE_X + face),
                                        glTexture, 0);
            }
            else
            {
                gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                        colorAttachment0,
                                        gl.TEXTURE_2D,
                                        glTexture, 0);
            }

            if (colorTexture1)
            {
                glTexture = colorTexture1.glTexture;
                if (colorTexture1.cubemap)
                {
                    gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                            (colorAttachment0 + 1),
                                            (gl.TEXTURE_CUBE_MAP_POSITIVE_X + face),
                                            glTexture, 0);
                }
                else
                {
                    gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                            (colorAttachment0 + 1),
                                            gl.TEXTURE_2D,
                                            glTexture, 0);
                }

                if (colorTexture2)
                {
                    glTexture = colorTexture2.glTexture;
                    if (colorTexture1.cubemap)
                    {
                        gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                                (colorAttachment0 + 2),
                                                (gl.TEXTURE_CUBE_MAP_POSITIVE_X + face),
                                                glTexture, 0);
                    }
                    else
                    {
                        gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                                (colorAttachment0 + 2),
                                                gl.TEXTURE_2D,
                                                glTexture, 0);
                    }

                    if (colorTexture3)
                    {
                        glTexture = colorTexture3.glTexture;
                        if (colorTexture1.cubemap)
                        {
                            gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                                    (colorAttachment0 + 3),
                                                    (gl.TEXTURE_CUBE_MAP_POSITIVE_X + face),
                                                    glTexture, 0);
                        }
                        else
                        {
                            gl.framebufferTexture2D(gl.FRAMEBUFFER,
                                                    (colorAttachment0 + 3),
                                                    gl.TEXTURE_2D,
                                                    glTexture, 0);
                        }
                    }
                }
            }
        }
        else if (depthTexture)
        {
            width = depthTexture.width;
            height = depthTexture.height;
        }
        else if (depthBuffer)
        {
            width = depthBuffer.width;
            height = depthBuffer.height;
        }
        else
        {
            (<WebGLTurbulenzEngine><any>TurbulenzEngine).callOnError(
                "No RenderBuffers or Textures specified for this RenderTarget");
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(glObject);
            return null;
        }

        if (depthTexture)
        {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, depthTexture.glDepthAttachment,
                                    gl.TEXTURE_2D, depthTexture.glTexture, 0);
        }
        else if (depthBuffer)
        {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER,
                                       depthBuffer.glDepthAttachment,
                                       gl.RENDERBUFFER, depthBuffer.glBuffer);
        }

        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        if (status !== gl.FRAMEBUFFER_COMPLETE)
        {
            gl.deleteFramebuffer(glObject);
            return null;
        }

        renderTarget.gd = gd;
        renderTarget.glObject = glObject;
        renderTarget.colorTexture0 = colorTexture0;
        renderTarget.colorTexture1 = colorTexture1;
        renderTarget.colorTexture2 = colorTexture2;
        renderTarget.colorTexture3 = colorTexture3;
        renderTarget.depthBuffer = depthBuffer;
        renderTarget.depthTexture = depthTexture;
        renderTarget.width = width;
        renderTarget.height = height;
        renderTarget.face = face;

        if (gd.drawBuffersExtension)
        {
            var buffers;
            if (colorTexture0)
            {
                buffers = [colorAttachment0];
                if (colorTexture1)
                {
                    buffers.push(colorAttachment0 + 1);
                    if (colorTexture2)
                    {
                        buffers.push(colorAttachment0 + 2);
                        if (colorTexture3)
                        {
                            buffers.push(colorAttachment0 + 3);
                        }
                    }
                }
            }
            else
            {
                buffers = [gl.NONE];
            }
            renderTarget.buffers = buffers;
        }

        renderTarget.id = ++gd.counters.renderTargets;

        return renderTarget;
    }
}

WebGLRenderTarget.prototype.oldViewportBox = [];
WebGLRenderTarget.prototype.oldScissorBox = [];

//
// IndexBuffer
//

interface WebGLIndexWriteIterator extends IndexWriteIterator
{
    data: any[];
    offset: number;
    getNumWrittenIndices: { (): number; };
};

class WebGLIndexBuffer implements IndexBuffer
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // IndexBuffer
    id         : number;
    numIndices : number;
    format     : number;
    stride     : number;
    length     : number;
    dynamic    : boolean;
    usage      : number;

    // WebGLIndexBuffer
    gd: any;
    glBuffer: WebGLBuffer;

    map(offset?: number, numIndices?: number)
    {
        if (offset === undefined)
        {
            offset = 0;
        }
        if (numIndices === undefined)
        {
            numIndices = this.numIndices;
        }

        var gd = this.gd;
        var gl = gd.gl;

        var format = this.format;
        var data;
        if (format === gl.UNSIGNED_BYTE)
        {
            data = new Uint8Array(numIndices);
        }
        else if (format === gl.UNSIGNED_SHORT)
        {
            data = new Uint16Array(numIndices);
        }
        else //if (format === gl.UNSIGNED_INT)
        {
            data = new Uint32Array(numIndices);
        }

        var numValues = 0;
        var writer = <WebGLIndexWriteIterator>function indexBufferWriterFn()
        {
            var numArguments = arguments.length;
            for (var n = 0; n < numArguments; n += 1)
            {
                data[numValues] = arguments[n];
                numValues += 1;
            }
        };
        writer.write = writer;
        writer.data = data;
        writer.offset = offset;
        writer.getNumWrittenIndices = function getNumWrittenIndicesFn()
        {
            return numValues;
        };
        writer.write = writer;
        return writer;
    }

    unmap(writer)
    {
        if (writer)
        {
            var gd = this.gd;
            var gl = gd.gl;

            var data = writer.data;
            delete writer.data;

            var offset = writer.offset;

            delete writer.write;

            var numIndices = writer.getNumWrittenIndices();
            if (!numIndices)
            {
                return;
            }

            if (numIndices < data.length)
            {
                data = data.subarray(0, numIndices);
            }

            gd.setIndexBuffer(this);

            if (numIndices < this.numIndices)
            {
                gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, data);
            }
            else
            {
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, this.usage);
            }
        }
    }

    setData(data, offset?, numIndices?)
    {
        if (offset === undefined)
        {
            offset = 0;
        }
        if (numIndices === undefined)
        {
            numIndices = this.numIndices;
        }
        debug.assert(offset + numIndices <= this.numIndices,
                     "IndexBuffer.setData: invalid 'offset' and/or " +
                     "'numIndices' arguments");

        var gd = this.gd;
        var gl = gd.gl;

        var bufferData;
        var format = this.format;
        if (format === gl.UNSIGNED_BYTE)
        {
            if (data instanceof Uint8Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint8Array(data);
            }
        }
        else if (format === gl.UNSIGNED_SHORT)
        {
            if (data instanceof Uint16Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint16Array(data);
            }
            offset *= 2;
        }
        else if (format === gl.UNSIGNED_INT)
        {
            if (data instanceof Uint32Array)
            {
                bufferData = data;
            }
            else
            {
                bufferData = new Uint32Array(data);
            }
            offset *= 4;
        }
        data = undefined;

        if (numIndices < bufferData.length)
        {
            bufferData = bufferData.subarray(0, numIndices);
        }

        gd.setIndexBuffer(this);

        if (numIndices < this.numIndices)
        {
            gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, bufferData);
        }
        else
        {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufferData, this.usage);
        }
    }

    destroy()
    {
        var gd = this.gd;
        if (gd)
        {
            var glBuffer = this.glBuffer;
            if (glBuffer)
            {
                var gl = gd.gl;
                if (gl)
                {
                    gd.unsetIndexBuffer(this);
                    gl.deleteBuffer(glBuffer);
                }
                delete this.glBuffer;
            }

            delete this.gd;
        }
    }

    static create(gd: any, params: any): WebGLIndexBuffer
    {
        var gl = gd.gl;

        var ib = new WebGLIndexBuffer();
        ib.gd = gd;

        var numIndices = params.numIndices;
        ib.numIndices = numIndices;

        var format = params.format;
        if (typeof format === "string")
        {
            format = gd['INDEXFORMAT_' + format];
        }
        ib.format = format;

        var stride;
        if (format === gl.UNSIGNED_BYTE)
        {
            stride = 1;
        }
        else if (format === gl.UNSIGNED_SHORT)
        {
            stride = 2;
        }
        else //if (format === gl.UNSIGNED_INT)
        {
            stride = 4;
        }
        ib.stride = stride;

        // Avoid dot notation lookup to prevent Google Closure complaining about transient being a keyword
        /* tslint:disable:no-string-literal */
        ib['transient'] = (params['transient'] || false);
        ib.dynamic = (params.dynamic || ib['transient']);
        ib.usage = (ib['transient'] ? gl.STREAM_DRAW : (ib.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW));
        /* tslint:enable:no-string-literal */

        ib.glBuffer = gl.createBuffer();

        if (params.data)
        {
            ib.setData(params.data, 0, numIndices);
        }
        else
        {
            gd.setIndexBuffer(ib);

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, (numIndices * stride), ib.usage);
        }

        ib.id = ++gd.counters.indexBuffers;

        return ib;
    }
}

//
// WebGLSemantics
//
class WebGLSemantics implements Semantics
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // Semantics
    length: number;
    [index: number]: any;

    constructor(gd: WebGLGraphicsDevice, semantics: any[])
    {
        var numSemantics = semantics.length;
        this.length = numSemantics;
        for (var i = 0; i < numSemantics; i += 1)
        {
            var semantic = semantics[i];
            if (typeof semantic === "string")
            {
                this[i] = gd['SEMANTIC_' + semantic];
            }
            else
            {
                this[i] = semantic;
            }
        }
    }

    static create(gd: WebGLGraphicsDevice, semantics: any[]): WebGLSemantics
    {
        return new WebGLSemantics(gd, semantics);
    }
}

//
// WebGLSemanticOffset
//
interface WebGLSemanticOffset
{
    vertexBuffer: WebGLVertexBuffer;
    offset: number;
}

//
// WebGLVertexWriteIterator
//
interface WebGLVertexWriteIterator extends VertexWriteIterator
{
    data: any;
    offset: number;
    getNumWrittenVertices: () => number;
    getNumWrittenValues: () => number;
}

//
// WebGLVertexBuffer
//
class WebGLVertexBuffer implements VertexBuffer
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // VertexBuffer
    id          : number;
    numVertices : number;
    usage       : number;
    stride      : number;
    transient   : boolean;
    dynamic     : boolean;

    // WebGLVertexBuffer
    gd          : any;
    glBuffer    : WebGLBuffer;
    attributes  : WebGLGraphicsDeviceVertexFormat[];
    hasSingleFormat: boolean;
    strideInBytes : number;
    numAttributes : number;

    map(offset?: number, numVertices?: number): WebGLVertexWriteIterator
    {
        if (offset === undefined)
        {
            offset = 0;
        }
        if (numVertices === undefined)
        {
            numVertices = this.numVertices;
        }

        var gd = this.gd;
        var gl = gd.gl;

        var numValuesPerVertex = this.stride;
        var attributes = this.attributes;
        var numAttributes = attributes.length;

        var data, writer: WebGLVertexWriteIterator;
        var numValues = 0;

        if (this.hasSingleFormat)
        {
            var maxNumValues = (numVertices * numValuesPerVertex);
            var format = attributes[0].format;

            if (format === gl.FLOAT)
            {
                data = new Float32Array(maxNumValues);
            }
            else if (format === gl.BYTE)
            {
                data = new Int8Array(maxNumValues);
            }
            else if (format === gl.UNSIGNED_BYTE)
            {
                data = new Uint8Array(maxNumValues);
            }
            else if (format === gl.SHORT)
            {
                data = new Int16Array(maxNumValues);
            }
            else if (format === gl.UNSIGNED_SHORT)
            {
                data = new Uint16Array(maxNumValues);
            }
            else if (format === gl.INT)
            {
                data = new Int32Array(maxNumValues);
            }
            else if (format === gl.UNSIGNED_INT)
            {
                data = new Uint32Array(maxNumValues);
            }

            writer = <WebGLVertexWriteIterator>
                function vertexBufferWriterSingleFn()
            {
                var numArguments = arguments.length;
                var currentArgument = 0;
                for (var a = 0; a < numAttributes; a += 1)
                {
                    var attribute = attributes[a];
                    var numComponents = attribute.numComponents;
                    var currentComponent = 0, j;
                    do
                    {
                        if (currentArgument < numArguments)
                        {
                            var value = arguments[currentArgument];
                            currentArgument += 1;
                            if (typeof value === "number")
                            {
                                if (attribute.normalized)
                                {
                                    value *= attribute.normalizationScale;
                                }
                                data[numValues] = value;
                                numValues += 1;
                                currentComponent += 1;
                            }
                            else if (currentComponent === 0)
                            {
                                var numSubArguments = value.length;
                                if (numSubArguments > numComponents)
                                {
                                    numSubArguments = numComponents;
                                }
                                if (attribute.normalized)
                                {
                                    var scale = attribute.normalizationScale;
                                    for (j = 0; j < numSubArguments; j += 1)
                                    {
                                        data[numValues] = (value[j] * scale);
                                        numValues += 1;
                                        currentComponent += 1;
                                    }
                                }
                                else
                                {
                                    for (j = 0; j < numSubArguments; j += 1)
                                    {
                                        data[numValues] = value[j];
                                        numValues += 1;
                                        currentComponent += 1;
                                    }
                                }
                                while (currentComponent < numComponents)
                                {
                                    // No need to clear to zeros
                                    numValues += 1;
                                    currentComponent += 1;
                                }
                                break;
                            }
                            else
                            {
                                (<WebGLTurbulenzEngine><any>TurbulenzEngine)
                                    .callOnError(
                                        'Missing values for attribute ' + a);
                                return null;
                            }
                        }
                        else
                        {
                            // No need to clear to zeros
                            numValues += 1;
                            currentComponent += 1;
                        }
                    }
                    while (currentComponent < numComponents);
                }
            };
        }
        else
        {
            var destOffset = 0;
            var bufferSize = (numVertices * this.strideInBytes);

            data = new ArrayBuffer(bufferSize);

            if (typeof DataView !== 'undefined' && 'setFloat32' in DataView.prototype)
            {
                var dataView = new DataView(data);

                writer = <WebGLVertexWriteIterator>
                    function vertexBufferWriterDataViewFn()
                {
                    var numArguments = arguments.length;
                    var currentArgument = 0;
                    for (var a = 0; a < numAttributes; a += 1)
                    {
                        var attribute = attributes[a];
                        var numComponents = attribute.numComponents;
                        var setter = attribute.typedSetter;
                        var componentStride = attribute.componentStride;
                        var currentComponent = 0, j;
                        do
                        {
                            if (currentArgument < numArguments)
                            {
                                var value = arguments[currentArgument];
                                currentArgument += 1;
                                if (typeof value === "number")
                                {
                                    if (attribute.normalized)
                                    {
                                        value *= attribute.normalizationScale;
                                    }
                                    setter.call(dataView, destOffset, value, true);
                                    destOffset += componentStride;
                                    currentComponent += 1;
                                    numValues += 1;
                                }
                                else if (currentComponent === 0)
                                {
                                    var numSubArguments = value.length;
                                    if (numSubArguments > numComponents)
                                    {
                                        numSubArguments = numComponents;
                                    }
                                    if (attribute.normalized)
                                    {
                                        var scale = attribute.normalizationScale;
                                        for (j = 0; j < numSubArguments; j += 1)
                                        {
                                            setter.call(dataView, destOffset, (value[j] * scale), true);
                                            destOffset += componentStride;
                                            currentComponent += 1;
                                            numValues += 1;
                                        }
                                    }
                                    else
                                    {
                                        for (j = 0; j < numSubArguments; j += 1)
                                        {
                                            setter.call(dataView, destOffset, value[j], true);
                                            destOffset += componentStride;
                                            currentComponent += 1;
                                            numValues += 1;
                                        }
                                    }
                                    while (currentComponent < numComponents)
                                    {
                                        // No need to clear to zeros
                                        numValues += 1;
                                        currentComponent += 1;
                                    }
                                    break;
                                }
                                else
                                {
                                    (<WebGLTurbulenzEngine><any>TurbulenzEngine)
                                        .callOnError(
                                        'Missing values for attribute ' + a);
                                    return null;
                                }
                            }
                            else
                            {
                                // No need to clear to zeros
                                numValues += 1;
                                currentComponent += 1;
                            }
                        }
                        while (currentComponent < numComponents);
                    }
                };
            }
            else
            {
                writer = <WebGLVertexWriteIterator>
                    function vertexBufferWriterMultiFn()
                {
                    var numArguments = arguments.length;
                    var currentArgument = 0;
                    var dest;
                    for (var a = 0; a < numAttributes; a += 1)
                    {
                        var attribute = attributes[a];
                        var numComponents = attribute.numComponents;
                        dest = new attribute.typedArray(data, destOffset, numComponents);
                        destOffset += attribute.stride;

                        var currentComponent = 0, j;
                        do
                        {
                            if (currentArgument < numArguments)
                            {
                                var value = arguments[currentArgument];
                                currentArgument += 1;
                                if (typeof value === "number")
                                {
                                    if (attribute.normalized)
                                    {
                                        value *= attribute.normalizationScale;
                                    }
                                    dest[currentComponent] = value;
                                    currentComponent += 1;
                                    numValues += 1;
                                }
                                else if (currentComponent === 0)
                                {
                                    var numSubArguments = value.length;
                                    if (numSubArguments > numComponents)
                                    {
                                        numSubArguments = numComponents;
                                    }
                                    if (attribute.normalized)
                                    {
                                        var scale = attribute.normalizationScale;
                                        for (j = 0; j < numSubArguments; j += 1)
                                        {
                                            dest[currentComponent] = (value[j] * scale);
                                            currentComponent += 1;
                                            numValues += 1;
                                        }
                                    }
                                    else
                                    {
                                        for (j = 0; j < numSubArguments; j += 1)
                                        {
                                            dest[currentComponent] = value[j];
                                            currentComponent += 1;
                                            numValues += 1;
                                        }
                                    }
                                    while (currentComponent < numComponents)
                                    {
                                        // No need to clear to zeros
                                        currentComponent += 1;
                                        numValues += 1;
                                    }
                                    break;
                                }
                                else
                                {
                                    (<WebGLTurbulenzEngine><any>TurbulenzEngine)
                                        .callOnError(
                                            'Missing values for attribute ' + a);
                                    return null;
                                }
                            }
                            else
                            {
                                // No need to clear to zeros
                                currentComponent += 1;
                                numValues += 1;
                            }
                        }
                        while (currentComponent < numComponents);
                    }
                };
            }
        }

        writer.data = data;
        writer.offset = offset;
        writer.getNumWrittenVertices = function getNumWrittenVerticesFn()
        {
            return Math.floor(numValues / numValuesPerVertex);
        };
        writer.getNumWrittenValues = function getNumWrittenValuesFn()
        {
            return numValues;
        };
        writer.write = writer;
        return writer;
    }

    unmap(writer)
    {
        if (writer)
        {
            var data = writer.data;
            delete writer.data;

            delete writer.write;

            var numVertices = writer.getNumWrittenVertices();
            if (!numVertices)
            {
                return;
            }

            var offset = writer.offset;

            var stride = this.strideInBytes;

            if (this.hasSingleFormat)
            {
                var numValues = writer.getNumWrittenValues();
                if (numValues < data.length)
                {
                    data = data.subarray(0, numValues);
                }
            }
            else
            {
                var numBytes = (numVertices * stride);
                if (numBytes < data.byteLength)
                {
                    data = data.slice(0, numBytes);
                }
            }

            var gd = this.gd;
            var gl = gd.gl;

            gd.bindVertexBuffer(this.glBuffer);

            if (numVertices < this.numVertices)
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, (offset * stride), data);
            }
            else
            {
                gl.bufferData(gl.ARRAY_BUFFER, data, this.usage);
            }
        }
    }

    setData(data, offset?: number, numVertices?: number)
    {
        if (offset === undefined)
        {
            offset = 0;
        }
        if (numVertices === undefined)
        {
            numVertices = this.numVertices;
        }

        var gd = this.gd;
        var gl = gd.gl;
        var strideInBytes = this.strideInBytes;

        // Fast path for ArrayBuffer data

        if (data.constructor === ArrayBuffer)
        {
            gd.bindVertexBuffer(this.glBuffer);

            if (numVertices < this.numVertices)
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, (offset * strideInBytes), data);
            }
            else
            {
                gl.bufferData(gl.ARRAY_BUFFER, data, this.usage);
            }
            return;
        }

        var attributes = this.attributes;
        var numAttributes = this.numAttributes;
        var attribute, format, bufferData, TypedArrayConstructor;

        if (this.hasSingleFormat)
        {
            attribute = attributes[0];
            format = attribute.format;

            if (format === gl.FLOAT)
            {
                if (!(data instanceof Float32Array))
                {
                    TypedArrayConstructor = Float32Array;
                }
            }
            else if (format === gl.BYTE)
            {
                if (!(data instanceof Int8Array))
                {
                    TypedArrayConstructor = Int8Array;
                }
            }
            else if (format === gl.UNSIGNED_BYTE)
            {
                if (!(data instanceof Uint8Array))
                {
                    TypedArrayConstructor = Uint8Array;
                }
            }
            else if (format === gl.SHORT)
            {
                if (!(data instanceof Int16Array))
                {
                    TypedArrayConstructor = Int16Array;
                }
            }
            else if (format === gl.UNSIGNED_SHORT)
            {
                if (!(data instanceof Uint16Array))
                {
                    TypedArrayConstructor = Uint16Array;
                }
            }
            else if (format === gl.INT)
            {
                if (!(data instanceof Int32Array))
                {
                    TypedArrayConstructor = Int32Array;
                }
            }
            else if (format === gl.UNSIGNED_INT)
            {
                if (!(data instanceof Uint32Array))
                {
                    TypedArrayConstructor = Uint32Array;
                }
            }

            var numValuesPerVertex = this.stride;
            var numValues = (numVertices * numValuesPerVertex);

            if (TypedArrayConstructor)
            {
                // Data has to be put into a Typed Array and
                // potentially normalized.

                if (attribute.normalized)
                {
                    data = this.scaleValues(data, attribute.normalizationScale, numValues);
                }
                bufferData = new TypedArrayConstructor(data);
                if (numValues < bufferData.length)
                {
                    bufferData = bufferData.subarray(0, numValues);
                }
            }
            else
            {
                bufferData = data;
            }

            if (numValues < data.length)
            {
                bufferData = bufferData.subarray(0, numValues);
            }
        }
        else
        {
            var bufferSize = (numVertices * strideInBytes);

            bufferData = new ArrayBuffer(bufferSize);

            var srcOffset = 0, destOffset = 0, v, c, a, numComponents, componentStride, scale;
            if (typeof DataView !== 'undefined' && 'setFloat32' in DataView.prototype)
            {
                var dataView = new DataView(bufferData);

                for (v = 0; v < numVertices; v += 1)
                {
                    for (a = 0; a < numAttributes; a += 1)
                    {
                        attribute = attributes[a];
                        numComponents = attribute.numComponents;
                        componentStride = attribute.componentStride;
                        var setter = attribute.typedSetter;
                        if (attribute.normalized)
                        {
                            scale = attribute.normalizationScale;
                            for (c = 0; c < numComponents; c += 1)
                            {
                                setter.call(dataView, destOffset, (data[srcOffset] * scale), true);
                                destOffset += componentStride;
                                srcOffset += 1;
                            }
                        }
                        else
                        {
                            for (c = 0; c < numComponents; c += 1)
                            {
                                setter.call(dataView, destOffset, data[srcOffset], true);
                                destOffset += componentStride;
                                srcOffset += 1;
                            }
                        }
                    }
                }
            }
            else
            {
                for (v = 0; v < numVertices; v += 1)
                {
                    for (a = 0; a < numAttributes; a += 1)
                    {
                        attribute = attributes[a];
                        numComponents = attribute.numComponents;
                        var dest = new attribute.typedArray(bufferData, destOffset, numComponents);
                        destOffset += attribute.stride;
                        if (attribute.normalized)
                        {
                            scale = attribute.normalizationScale;
                            for (c = 0; c < numComponents; c += 1)
                            {
                                dest[c] = (data[srcOffset] * scale);
                                srcOffset += 1;
                            }
                        }
                        else
                        {
                            for (c = 0; c < numComponents; c += 1)
                            {
                                dest[c] = data[srcOffset];
                                srcOffset += 1;
                            }
                        }
                    }
                }
            }
        }
        data = undefined;

        gd.bindVertexBuffer(this.glBuffer);

        if (numVertices < this.numVertices)
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, (offset * strideInBytes), bufferData);
        }
        else
        {
            gl.bufferData(gl.ARRAY_BUFFER, bufferData, this.usage);
        }
    }

    // Internal
    scaleValues(values, scale, numValues)
    {
        if (numValues === undefined)
        {
            numValues = values.length;
        }
        var scaledValues = new values.constructor(numValues);
        for (var n = 0; n < numValues; n += 1)
        {
            scaledValues[n] = (values[n] * scale);
        }
        return scaledValues;
    }

    bindAttributes(semantics: WebGLSemantics, offset: number): number
    {
        var numAttributes = Math.min(semantics.length, this.numAttributes);
        var vertexAttributes = this.attributes;
        var stride = this.strideInBytes;
        var gd = this.gd;
        var gl = gd.gl;
        var attributeMask = 0;
        for (var n = 0; n < numAttributes; n += 1)
        {
            var semantic = semantics[n];

            /* tslint:disable:no-bitwise */
            attributeMask |= (1 << semantic);
            /* tslint:enable:no-bitwise */

            var vertexAttribute = vertexAttributes[n];

            gl.vertexAttribPointer(semantic,
                                   vertexAttribute.numComponents,
                                   vertexAttribute.format,
                                   vertexAttribute.normalized,
                                   stride,
                                   offset);

            offset += vertexAttribute.stride;
        }
        if (debug)
        {
            gd.metrics.vertexAttributesChanges += numAttributes;
        }
        return attributeMask;
    }

    bindAttributesCached(semantics: WebGLSemantics, offset: number): number
    {
        var numAttributes = Math.min(semantics.length, this.numAttributes);
        var vertexAttributes = this.attributes;
        var stride = this.strideInBytes;
        var gd = this.gd;
        var gl = gd.gl;
        var semanticsOffsets = gd._semanticsOffsets;
        var attributeMask = 0;
        for (var n = 0; n < numAttributes; n += 1)
        {
            var semantic = semantics[n];

            /* tslint:disable:no-bitwise */
            attributeMask |= (1 << semantic);
            /* tslint:enable:no-bitwise */

            var vertexAttribute = vertexAttributes[n];

            var semanticsOffset = semanticsOffsets[semantic];
            if (semanticsOffset.vertexBuffer !== this ||
                semanticsOffset.offset !== offset)
            {
                semanticsOffset.vertexBuffer = this;
                semanticsOffset.offset = offset;

                gl.vertexAttribPointer(semantic,
                                       vertexAttribute.numComponents,
                                       vertexAttribute.format,
                                       vertexAttribute.normalized,
                                       stride,
                                       offset);

                if (debug)
                {
                    gd.metrics.vertexAttributesChanges += 1;
                }
            }

            offset += vertexAttribute.stride;
        }
        return attributeMask;
    }

    setAttributes(attributes: WebGLGraphicsDeviceVertexFormat[]): number
    {
        var gd = this.gd;

        var numAttributes = attributes.length;
        this.numAttributes = numAttributes;
        this.attributes = [];

        var stride = 0, numValuesPerVertex = 0, hasSingleFormat = true;
        for (var i = 0; i < numAttributes; i += 1)
        {
            var format = attributes[i];
            if (typeof format === "string")
            {
                format = gd['VERTEXFORMAT_' + format];
            }
            this.attributes[i] = format;
            stride += format.stride;
            numValuesPerVertex += format.numComponents;

            if (hasSingleFormat && i)
            {
                if (format.format !== this.attributes[i - 1].format)
                {
                    hasSingleFormat = false;
                }
            }
        }

        this.strideInBytes = stride;
        this.stride = numValuesPerVertex;
        this.hasSingleFormat = hasSingleFormat;

        return stride;
    }

    resize(size)
    {
        if (size !== (this.strideInBytes * this.numVertices))
        {
            var gd = this.gd;
            var gl = gd.gl;

            gd.bindVertexBuffer(this.glBuffer);

            var bufferType = gl.ARRAY_BUFFER;
            gl.bufferData(bufferType, size, this.usage);

            var bufferSize = gl.getBufferParameter(bufferType, gl.BUFFER_SIZE);
            this.numVertices = Math.floor(bufferSize / this.strideInBytes);
        }
    }

    destroy()
    {
        var gd = this.gd;
        if (gd)
        {
            var glBuffer = this.glBuffer;
            if (glBuffer)
            {
                var gl = gd.gl;
                if (gl)
                {
                    gd.unbindVertexBuffer(glBuffer);
                    gl.deleteBuffer(glBuffer);
                }
                delete this.glBuffer;
            }

            delete this.gd;
        }
    }

    static create(gd: any, params: any): WebGLVertexBuffer
    {
        var gl = gd.gl;

        var vb = new WebGLVertexBuffer();
        vb.gd = gd;

        var numVertices = params.numVertices;
        vb.numVertices = numVertices;

        var strideInBytes = vb.setAttributes(params.attributes);

        // Avoid dot notation lookup to prevent Google Closure complaining
        // about transient being a keyword

        /* tslint:disable:no-string-literal */
        vb['transient'] = (params['transient'] || false);
        vb.dynamic = (params.dynamic || vb['transient']);
        vb.usage = (vb['transient'] ? gl.STREAM_DRAW : (vb.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW));
        /* tslint:enable:no-string-literal */
        vb.glBuffer = gl.createBuffer();

        var bufferSize = (numVertices * strideInBytes);

        if (params.data)
        {
            vb.setData(params.data, 0, numVertices);
        }
        else
        {
            gd.bindVertexBuffer(vb.glBuffer);

            gl.bufferData(gl.ARRAY_BUFFER, bufferSize, vb.usage);
        }

        vb.id = ++gd.counters.vertexBuffers;

        return vb;
    }
}

//
// Pass
//

interface WebGLShaderParameter extends ShaderParameter
{
    numValues : number;
    values  : any;
    sampler : any;
};

interface PassParameter
{
    info: WebGLShaderParameter;
    value: any;
    location: WebGLUniformLocation;
    textureUnit: number;
    dirty?: number;
};

interface StateBase
{
    name: string;
    set: (boolean) => void;
    reset: () => void;
};

// Use this in addStateHandler, stateHandlers
interface StateHandler extends StateBase
{
    defaultValues: any[];
    parse: (any) => any;
};

interface PassState extends StateBase
{
    values: any[];
};

class WebGLPass implements Pass
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // DO NOT CHANGE: This table is independent from the actual attribute index on GraphicsDevice.SEMANTIC_xxx
    static semanticToAttr = {
        POSITION: "ATTR0",
        POSITION0: "ATTR0",
        BLENDWEIGHT: "ATTR1",
        BLENDWEIGHT0: "ATTR1",
        NORMAL: "ATTR2",
        NORMAL0: "ATTR2",
        COLOR: "ATTR3",
        COLOR0: "ATTR3",
        COLOR1: "ATTR4",
        SPECULAR: "ATTR4",
        FOGCOORD: "ATTR5",
        TESSFACTOR: "ATTR5",
        PSIZE0: "ATTR6",
        BLENDINDICES: "ATTR7",
        BLENDINDICES0: "ATTR7",
        TEXCOORD: "ATTR8",
        TEXCOORD0: "ATTR8",
        TEXCOORD1: "ATTR9",
        TEXCOORD2: "ATTR10",
        TEXCOORD3: "ATTR11",
        TEXCOORD4: "ATTR12",
        TEXCOORD5: "ATTR13",
        TEXCOORD6: "ATTR14",
        TEXCOORD7: "ATTR15",
        TANGENT: "ATTR14",
        TANGENT0: "ATTR14",
        BINORMAL0: "ATTR15",
        BINORMAL: "ATTR15",
        PSIZE: "ATTR6"
    };

    name: string;
    parameters: { [name: string]: PassParameter };
    parametersArray: PassParameter[];

    glProgram: WebGLProgram;
    semanticsMask: number;
    numTextureUnits: number;
    numParameters: number;
    states: PassState[];
    statesSet: any;
    dirty: boolean;

    updateParametersData(gd)
    {
        var gl = gd.gl;

        this.dirty = false;

        // Set parameters
        var parameters = this.parametersArray;
        var numParameters = parameters.length;
        var n;
        for (n = 0; n < numParameters; n += 1)
        {
            var parameter = parameters[n];
            if (parameter.dirty)
            {
                parameter.dirty = 0;

                var paramInfo = parameter.info;
                var location = parameter.location;
                if (paramInfo &&
                    null !== location)
                {
                    var parameterValues = paramInfo.values;

                    var numColumns;
                    if (paramInfo.type === 'float')
                    {
                        numColumns = paramInfo.columns;
                        if (4 === numColumns)
                        {
                            gl.uniform4fv(location, parameterValues);
                        }
                        else if (3 === numColumns)
                        {
                            gl.uniform3fv(location, parameterValues);
                        }
                        else if (2 === numColumns)
                        {
                            gl.uniform2fv(location, parameterValues);
                        }
                        else if (1 === paramInfo.rows)
                        {
                            gl.uniform1f(location, parameterValues[0]);
                        }
                        else //if (1 === numColumns)
                        {
                            gl.uniform1fv(location, parameterValues);
                        }
                    }
                    else if (paramInfo.sampler !== undefined)
                    {
                        gd.setTexture(parameter.textureUnit, parameterValues, paramInfo.sampler);
                    }
                    else
                    {
                        numColumns = paramInfo.columns;
                        if (4 === numColumns)
                        {
                            gl.uniform4iv(location, parameterValues);
                        }
                        else if (3 === numColumns)
                        {
                            gl.uniform3iv(location, parameterValues);
                        }
                        else if (2 === numColumns)
                        {
                            gl.uniform2iv(location, parameterValues);
                        }
                        else if (1 === paramInfo.rows)
                        {
                            gl.uniform1i(location, parameterValues[0]);
                        }
                        else //if (1 === numColumns)
                        {
                            gl.uniform1iv(location, parameterValues);
                        }
                    }
                }
            }
        }
    }

    initializeParameters(gd)
    {
        var gl = gd.gl;

        var glProgram = this.glProgram;

        gd.setProgram(glProgram);

        var passParameters = this.parameters;
        for (var p in passParameters)
        {
            if (passParameters.hasOwnProperty(p))
            {
                var parameter = passParameters[p];

                var paramInfo = parameter.info;
                if (paramInfo)
                {
                    var location = gl.getUniformLocation(glProgram, p);
                    if (null !== location)
                    {
                        parameter.location = location;

                        if (paramInfo.sampler)
                        {
                            gl.uniform1i(location, parameter.textureUnit);
                        }
                        else
                        {
                            var parameterValues = paramInfo.values;

                            var numColumns;
                            if (paramInfo.type === 'float')
                            {
                                numColumns = paramInfo.columns;
                                if (4 === numColumns)
                                {
                                    gl.uniform4fv(location, parameterValues);
                                }
                                else if (3 === numColumns)
                                {
                                    gl.uniform3fv(location, parameterValues);
                                }
                                else if (2 === numColumns)
                                {
                                    gl.uniform2fv(location, parameterValues);
                                }
                                else if (1 === paramInfo.rows)
                                {
                                    gl.uniform1f(location, parameterValues[0]);
                                }
                                else //if (1 === numColumns)
                                {
                                    gl.uniform1fv(location, parameterValues);
                                }
                            }
                            else
                            {
                                numColumns = paramInfo.columns;
                                if (4 === numColumns)
                                {
                                    gl.uniform4iv(location, parameterValues);
                                }
                                else if (3 === numColumns)
                                {
                                    gl.uniform3iv(location, parameterValues);
                                }
                                else if (2 === numColumns)
                                {
                                    gl.uniform2iv(location, parameterValues);
                                }
                                else if (1 === paramInfo.rows)
                                {
                                    gl.uniform1i(location, parameterValues[0]);
                                }
                                else //if (1 === numColumns)
                                {
                                    gl.uniform1iv(location, parameterValues);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    destroy()
    {
        delete this.glProgram;
        delete this.semanticsMask;
        delete this.parametersArray;
        delete this.parameters;
        delete this.states;
        delete this.statesSet;
    }

    static create(gd: any, shader: any, params: any): WebGLPass
    {
        var gl = gd.gl;

        var pass = new WebGLPass();

        pass.name = (params.name || null);

        var programs = shader.programs;
        var parameters = shader.parameters;

        var parameterNames = params.parameters;
        var programNames = params.programs;
        var semanticNames = params.semantics;
        var states = params.states;

        var compoundProgramName = programNames.join(':');
        var linkedProgram = shader.linkedPrograms[compoundProgramName];
        var glProgram, semanticsMask, p, s;
        if (linkedProgram === undefined)
        {
            // Create GL program
            glProgram = gl.createProgram();

            var numPrograms = programNames.length;
            for (p = 0; p < numPrograms; p += 1)
            {
                var glShader = programs[programNames[p]];
                if (glShader)
                {
                    gl.attachShader(glProgram, glShader);
                }
            }

            var numSemantics = semanticNames.length;
            semanticsMask = 0;
            for (s = 0; s < numSemantics; s += 1)
            {
                var semanticName = semanticNames[s];
                var semantic = gd['SEMANTIC_' + semanticName];
                if (semantic !== undefined)
                {
                    /* tslint:disable:no-bitwise */
                    semanticsMask |= (1 << semantic);
                    /* tslint:enable:no-bitwise */
                    if (0 === semanticName.indexOf("ATTR"))
                    {
                        gl.bindAttribLocation(glProgram, semantic, semanticName);
                    }
                    else
                    {
                        var attributeName = WebGLPass.semanticToAttr[semanticName];
                        gl.bindAttribLocation(glProgram, semantic, attributeName);
                    }
                }
            }

            gl.linkProgram(glProgram);

            shader.linkedPrograms[compoundProgramName] = {
                glProgram : glProgram,
                semanticsMask : semanticsMask
            };
        }
        else
        {
            //console.log('Reused program ' + compoundProgramName);
            glProgram = linkedProgram.glProgram;
            semanticsMask = linkedProgram.semanticsMask;
        }

        pass.glProgram = glProgram;
        pass.semanticsMask = semanticsMask;

        // Set parameters
        var numTextureUnits = 0;
        var passParameters : { [name: string]: PassParameter } = {};
        var passParametersArray : PassParameter[] = [];
        pass.parameters = passParameters;
        pass.parametersArray = passParametersArray;
        var numParameters = parameterNames ? parameterNames.length : 0;
        var n;
        for (n = 0; n < numParameters; n += 1)
        {
            var parameterName = parameterNames[n];

            var paramInfo = parameters[parameterName];

            var parameter : PassParameter = {
                info : paramInfo,
                value: null,
                location: null,
                textureUnit: undefined
            };

            if (paramInfo)
            {
                if (paramInfo.sampler)
                {
                    parameter.textureUnit = numTextureUnits;
                    numTextureUnits += 1;
                }
            }

            passParameters[parameterName] = parameter;
            passParametersArray[n] = parameter;
        }
        pass.numTextureUnits = numTextureUnits;
        pass.numParameters = numParameters;

        function equalRenderStates(defaultValues, values)
        {
            var numDefaultValues = defaultValues.length;
            var n;
            for (n = 0; n < numDefaultValues; n += 1)
            {
                if (defaultValues[n] !== values[n])
                {
                    return false;
                }
            }
            return true;
        }

        var stateHandlers = gd.stateHandlers;
        var passStates = [];
        var passStatesSet = {};
        pass.states = passStates;
        pass.statesSet = passStatesSet;
        for (s in states)
        {
            if (states.hasOwnProperty(s))
            {
                var stateHandler = stateHandlers[s];
                if (stateHandler)
                {
                    var values = stateHandler.parse(states[s]);
                    if (values !== null)
                    {
                        if (equalRenderStates(stateHandler.defaultValues, values))
                        {
                            continue;
                        }
                        passStates.push({
                            name: s,
                            set: stateHandler.set,
                            reset: stateHandler.reset,
                            values: values
                        });
                        passStatesSet[s] = true;
                    }
                    else
                    {
                        (<WebGLTurbulenzEngine><any>TurbulenzEngine)
                            .callOnError(
                                'Unknown value for state ' + s + ': ' +
                                    states[s]
                            );
                    }
                }
            }
        }

        return pass;
    }
}

//
// WebGLTechnique
//
class WebGLTechnique implements Technique
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // Technique
    id            : number;
    initialized   : boolean;
    shader        : TZWebGLShader;
    name          : string;
    passes        : WebGLPass[];
    numPasses     : number;
    numParameters : number;
    device        : WebGLGraphicsDevice;
    _drawArrayId  : number;

    getPass(id)
    {
        var passes = this.passes;
        var numPasses = passes.length;
        if (typeof id === "string")
        {
            for (var n = 0; n < numPasses; n += 1)
            {
                var pass = passes[n];
                if (pass.name === id)
                {
                    return pass;
                }
            }
        }
        else
        {
            /* tslint:disable:no-bitwise */
            id = (id | 0);
            /* tslint:enable:no-bitwise */
            if (id < numPasses)
            {
                return passes[id];
            }
        }
        return null;
    }

    activate(gd: WebGLGraphicsDevice)
    {
        this.device = gd;

        if (!this.initialized)
        {
            this.shader.initialize(gd);
            this.initialize(gd);
        }

        if (debug)
        {
            gd.metrics.techniqueChanges += 1;
        }
    }

    deactivate()
    {
        this.device = null;
    }

    checkProperties(gd)
    {
        // Check for parameters set directly into the technique...
        var fakeTechniqueParameters = {}, p;
        for (p in this)
        {
            if (p !== 'version' &&
                p !== 'name' &&
                p !== 'id' &&
                p !== 'passes' &&
                p !== 'numPasses' &&
                p !== 'device' &&
                p !== 'numParameters')
            {
                fakeTechniqueParameters[p] = this[p];
            }
        }

        if (fakeTechniqueParameters)
        {
            var passes = this.passes;
            if (passes.length === 1)
            {
                gd.setParametersImmediate(passes[0].parameters, fakeTechniqueParameters);
            }
            else
            {
                gd.setParametersDeferred(gd, passes, fakeTechniqueParameters);
            }

            for (p in fakeTechniqueParameters)
            {
                if (fakeTechniqueParameters.hasOwnProperty(p))
                {
                    delete this[p];
                }
            }
        }
    }

    initialize(gd)
    {
        if (this.initialized)
        {
            return;
        }

        var passes = this.passes;
        if (passes)
        {
            var numPasses = passes.length;
            var n;
            for (n = 0; n < numPasses; n += 1)
            {
                passes[n].initializeParameters(gd);
            }
        }

        if (Object.defineProperty)
        {
            this.initializeParametersSetters(gd);
        }

        this.initialized = true;
    }

    initializeParametersSetters(gd)
    {
        var gl = gd.gl;

        function make_sampler_setter(pass: WebGLPass, parameter: PassParameter) {
            return function (parameterValues) {
                if (this.device)
                {
                    gd.setTexture(parameter.textureUnit, parameterValues, parameter.info.sampler);
                }
                else
                {
                    pass.dirty = true;
                    parameter.dirty = 1;
                    parameter.info.values = parameterValues;
                }
            };
        }

        function make_float_uniform_setter(pass: WebGLPass, parameter: PassParameter) {

            var paramInfo = parameter.info;
            var location = parameter.location;

            function setDeferredParameter(parameterValues)
            {
                if (typeof parameterValues !== 'number')
                {
                    var values = paramInfo.values;
                    var numValues = Math.min(paramInfo.numValues, parameterValues.length);
                    for (var v = 0; v < numValues; v += 1)
                    {
                        values[v] = parameterValues[v];
                    }
                    parameter.dirty = Math.max(numValues, (parameter.dirty || 0));
                }
                else
                {
                    paramInfo.values[0] = parameterValues;
                    parameter.dirty = (parameter.dirty || 1);
                }
                pass.dirty = true;
            }

            switch (paramInfo.columns)
            {
            case 1:
                if (1 === paramInfo.numValues)
                {
                    return function (parameterValues)
                    {
                        if (this.device)
                        {
                            gl.uniform1f(location, parameterValues);
                        }
                        else
                        {
                            setDeferredParameter(parameterValues);
                        }
                    };
                }
                return function (parameterValues)
                {
                    if (this.device)
                    {
                        gl.uniform1fv(location, parameterValues);
                    }
                    else
                    {
                        setDeferredParameter(parameterValues);
                    }
                };
            case 2:
                return function (parameterValues)
                {
                    if (this.device)
                    {
                        gl.uniform2fv(location, parameterValues);
                    }
                    else
                    {
                        setDeferredParameter(parameterValues);
                    }
                };
            case 3:
                return function (parameterValues)
                {
                    if (this.device)
                    {
                        gl.uniform3fv(location, parameterValues);
                    }
                    else
                    {
                        setDeferredParameter(parameterValues);
                    }
                };
            case 4:
                return function (parameterValues)
                {
                    if (this.device)
                    {
                        gl.uniform4fv(location, parameterValues);
                    }
                    else
                    {
                        setDeferredParameter(parameterValues);
                    }
                };
            default:
                return null;
            }
        }

        function make_int_uniform_setter(pass: WebGLPass, parameter: PassParameter) {
            var paramInfo = parameter.info;
            var location = parameter.location;

            function setDeferredParameter(parameterValues)
            {
                if (typeof parameterValues !== 'number')
                {
                    var values = paramInfo.values;
                    var numValues = Math.min(paramInfo.numValues, parameterValues.length);
                    for (var v = 0; v < numValues; v += 1)
                    {
                        values[v] = parameterValues[v];
                    }
                    parameter.dirty = Math.max(numValues, (parameter.dirty || 0));
                }
                else
                {
                    paramInfo.values[0] = parameterValues;
                    parameter.dirty = (parameter.dirty || 1);
                }
                pass.dirty = true;
            }

            switch (paramInfo.columns)
            {
            case 1:
                if (1 === paramInfo.numValues)
                {
                    return function (parameterValues)
                    {
                        if (this.device)
                        {
                            gl.uniform1i(location, parameterValues);
                        }
                        else
                        {
                            setDeferredParameter(parameterValues);
                        }
                    };
                }
                return function (parameterValues)
                {
                    if (this.device)
                    {
                        gl.uniform1iv(location, parameterValues);
                    }
                    else
                    {
                        setDeferredParameter(parameterValues);
                    }
                };
            case 2:
                return function (parameterValues)
                {
                    if (this.device)
                    {
                        gl.uniform2iv(location, parameterValues);
                    }
                    else
                    {
                        setDeferredParameter(parameterValues);
                    }
                };
            case 3:
                return function (parameterValues)
                {
                    if (this.device)
                    {
                        gl.uniform3iv(location, parameterValues);
                    }
                    else
                    {
                        setDeferredParameter(parameterValues);
                    }
                };
            case 4:
                return function (parameterValues)
                {
                    if (this.device)
                    {
                        gl.uniform4iv(location, parameterValues);
                    }
                    else
                    {
                        setDeferredParameter(parameterValues);
                    }
                };
            default:
                return null;
            }
        }

        var passes = this.passes;
        var numPasses = passes.length;
        var pass, parameters, p, parameter, paramInfo, setter;
        if (numPasses === 1)
        {
            pass = passes[0];
            parameters = pass.parameters;
            for (p in parameters)
            {
                if (parameters.hasOwnProperty(p))
                {
                    parameter = parameters[p];
                    paramInfo = parameter.info;
                    if (paramInfo)
                    {
                        if (undefined !== parameter.location)
                        {
                            if (paramInfo.sampler)
                            {
                                setter = make_sampler_setter(pass, parameter);
                            }
                            else
                            {
                                if (paramInfo.type === 'float')
                                {
                                    setter = make_float_uniform_setter(pass, parameter);
                                }
                                else
                                {
                                    setter = make_int_uniform_setter(pass, parameter);
                                }
                            }

                            Object.defineProperty(this, p, {
                                    set : setter,
                                    enumerable : false,
                                    configurable : false
                                });
                        }
                    }
                }
            }

            this.checkProperties = null;
        }
        else
        {
            Object.defineProperty(this, 'device', {
                    writable : true,
                    enumerable : false,
                    configurable : false
                });

            Object.defineProperty(this, 'version', {
                    writable : false,
                    enumerable : false,
                    configurable : false
                });

            Object.defineProperty(this, 'name', {
                    writable : false,
                    enumerable : false,
                    configurable : false
                });

            Object.defineProperty(this, 'id', {
                    writable : false,
                    enumerable : false,
                    configurable : false
                });

            Object.defineProperty(this, 'passes', {
                    writable : false,
                    enumerable : false,
                    configurable : false
                });

            Object.defineProperty(this, 'numParameters', {
                    writable : false,
                    enumerable : false,
                    configurable : false
                });
        }
    }

    destroy()
    {
        var passes = this.passes;
        if (passes)
        {
            var numPasses = passes.length;
            var n;

            for (n = 0; n < numPasses; n += 1)
            {
                passes[n].destroy();
            }

            passes.length = 0;

            delete this.passes;
        }

        delete this.device;
    }

    static create(gd: any, shader: Shader, name: string, passes: Pass[])
    : WebGLTechnique
    {
        var technique = new WebGLTechnique();

        technique.initialized = false;
        technique.shader = <TZWebGLShader>shader;
        technique.name = name;

        var numPasses = passes.length, n;
        var numParameters = 0;
        technique.passes = [];
        technique.numPasses = numPasses;
        for (n = 0; n < numPasses; n += 1)
        {
            var passParams = passes[n];
            if (passParams.parameters)
            {
                numParameters += passParams.parameters.length;
            }
            technique.passes[n] = WebGLPass.create(gd, shader, passParams);
        }

        technique.numParameters = numParameters;

        technique.device = null;
        technique._drawArrayId = -1;

        technique.id = ++gd.counters.techniques;

        if (1 < numPasses)
        {
            if (gd.drawArray !== gd.drawArrayMultiPass)
            {
                gd.drawArray = gd.drawArrayMultiPass;
                debug.log("Detected technique with multiple passes, switching to multi pass support.");
            }
        }

        return technique;
    }
}

//
// TZWebGLShader
//
class TZWebGLShader implements Shader
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // Shader
    id             : number;
    name           : string;
    initialized    : boolean;
    programs       : any;
    linkedPrograms : any;

    numTechniques  : number;
    techniques     : {}; // Technique[];

    numParameters  : number;
    parameters     : { [name: string]: WebGLShaderParameter };

    samplers       : any;

    gd             : WebGLGraphicsDevice;

    getTechnique(name): Technique
    {
        if (typeof name === "string")
        {
            return this.techniques[name];
        }
        else
        {
            var techniques = this.techniques;
            for (var t in techniques)
            {
                if (techniques.hasOwnProperty(t))
                {
                    if (name === 0)
                    {
                        return techniques[t];
                    }
                    else
                    {
                        name -= 1;
                    }
                }
            }
            return null;
        }
    }

    getParameter(name: any): ShaderParameter
    {
        if (typeof name === "string")
        {
            return this.parameters[name];
        }
        else
        {
            /* tslint:disable:no-bitwise */
            name = (name | 0);
            /* tslint:enable:no-bitwise */
            var parameters = this.parameters;
            for (var p in parameters)
            {
                if (parameters.hasOwnProperty(p))
                {
                    if (name === 0)
                    {
                        return parameters[p];
                    }
                    else
                    {
                        name -= 1;
                    }
                }
            }
            return null;
        }
    }

    initialize(gd)
    {
        if (this.initialized)
        {
            return;
        }

        var gl = gd.gl;
        var p;

        // Check copmpiled programs as late as possible
        var shaderPrograms = this.programs;
        for (p in shaderPrograms)
        {
            if (shaderPrograms.hasOwnProperty(p))
            {
                var compiledProgram = shaderPrograms[p];
                var compiled = gl.getShaderParameter(compiledProgram, gl.COMPILE_STATUS);
                if (!compiled)
                {
                    var compilerInfo = gl.getShaderInfoLog(compiledProgram);
                    (<WebGLTurbulenzEngine><any>TurbulenzEngine).callOnError(
                        'Program "' + p + '" failed to compile: ' + compilerInfo);
                }
            }
        }

        // Check linked programs as late as possible
        var linkedPrograms = this.linkedPrograms;
        for (p in linkedPrograms)
        {
            if (linkedPrograms.hasOwnProperty(p))
            {
                var linkedProgram = linkedPrograms[p];
                var glProgram = linkedProgram.glProgram;
                if (glProgram)
                {
                    var linked = gl.getProgramParameter(glProgram, gl.LINK_STATUS);
                    if (!linked)
                    {
                        var linkerInfo = gl.getProgramInfoLog(glProgram);
                        (<WebGLTurbulenzEngine><any>TurbulenzEngine)
                            .callOnError(
                                'Program "' + p + '" failed to link: ' +
                                    linkerInfo);
                    }
                }
            }
        }

        this.initialized = true;
    }

    destroy()
    {
        var gd = this.gd;
        if (gd)
        {
            var gl = gd.gl;
            var p;

            var techniques = this.techniques;
            if (techniques)
            {
                for (p in techniques)
                {
                    if (techniques.hasOwnProperty(p))
                    {
                        techniques[p].destroy();
                    }
                }
                delete this.techniques;
            }

            var linkedPrograms = this.linkedPrograms;
            if (linkedPrograms)
            {
                if (gl)
                {
                    for (p in linkedPrograms)
                    {
                        if (linkedPrograms.hasOwnProperty(p))
                        {
                            var linkedProgram = linkedPrograms[p];
                            var glProgram = linkedProgram.glProgram;
                            if (glProgram)
                            {
                                gl.deleteProgram(glProgram);
                                delete linkedProgram.glProgram;
                            }
                        }
                    }
                }
                delete this.linkedPrograms;
            }

            var programs = this.programs;
            if (programs)
            {
                if (gl)
                {
                    for (p in programs)
                    {
                        if (programs.hasOwnProperty(p))
                        {
                            gl.deleteShader(programs[p]);
                        }
                    }
                }
                delete this.programs;
            }

            delete this.samplers;
            delete this.parameters;
            delete this.gd;
        }
    }

    static create(gd, params, onload?): TZWebGLShader
    {
        var gl = gd.gl;

        var shader = new TZWebGLShader();

        shader.initialized = false;

        var techniques = params.techniques;
        var parameters = params.parameters;
        var programs = params.programs;
        var samplers = params.samplers;
        var p;

        shader.gd = gd;
        shader.name = params.name;

        // Compile programs as early as possible
        var shaderPrograms = {};
        shader.programs = shaderPrograms;
        for (p in programs)
        {
            if (programs.hasOwnProperty(p))
            {
                var program = programs[p];

                var glShaderType;
                if (program.type === 'fragment')
                {
                    glShaderType = gl.FRAGMENT_SHADER;
                }
                else if (program.type === 'vertex')
                {
                    glShaderType = gl.VERTEX_SHADER;
                }
                var glShader = gl.createShader(glShaderType);

                var code = program.code;

                if (gd.fixIE && gd.fixIE < "0.93")
                {
                    code = code.replace(/#.*\n/g, '');
                    code = code.replace(/TZ_LOWP/g, '');
                    if (-1 !== code.indexOf('texture2DProj'))
                    {
                        code = 'vec4 texture2DProj(sampler2D s, vec3 uv){ return texture2D(s, uv.xy / uv.z);}\n' + code;
                    }
                }

                gl.shaderSource(glShader, code);

                gl.compileShader(glShader);

                shaderPrograms[p] = glShader;
            }
        }

        var linkedPrograms = {};
        shader.linkedPrograms = linkedPrograms;

        // Samplers
        var defaultSampler = gd.DEFAULT_SAMPLER;
        var maxAnisotropy = gd.maxAnisotropy;

        shader.samplers = {};
        var sampler;
        for (p in samplers)
        {
            if (samplers.hasOwnProperty(p))
            {
                sampler = samplers[p];

                var samplerMaxAnisotropy = sampler.MaxAnisotropy;
                if (samplerMaxAnisotropy)
                {
                    if (samplerMaxAnisotropy > maxAnisotropy)
                    {
                        samplerMaxAnisotropy = maxAnisotropy;
                    }
                }
                else
                {
                    samplerMaxAnisotropy = defaultSampler.maxAnisotropy;
                }

                sampler = {
                    minFilter : (sampler.MinFilter || defaultSampler.minFilter),
                    magFilter : (sampler.MagFilter || defaultSampler.magFilter),
                    wrapS : (sampler.WrapS || defaultSampler.wrapS),
                    wrapT : (sampler.WrapT || defaultSampler.wrapT),
                    wrapR : (sampler.WrapR || defaultSampler.wrapR),
                    maxAnisotropy : samplerMaxAnisotropy
                };
                if (sampler.wrapS === 0x2900)
                {
                    sampler.wrapS = gl.CLAMP_TO_EDGE;
                }
                if (sampler.wrapT === 0x2900)
                {
                    sampler.wrapT = gl.CLAMP_TO_EDGE;
                }
                if (sampler.wrapR === 0x2900)
                {
                    sampler.wrapR = gl.CLAMP_TO_EDGE;
                }
                shader.samplers[p] = gd.createSampler(sampler);
            }
        }

        // Parameters
        var numParameters = 0;
        shader.parameters = {};
        for (p in parameters)
        {
            if (parameters.hasOwnProperty(p))
            {
                var parameter = parameters[p];
                if (!parameter.columns)
                {
                    parameter.columns = 1;
                }
                if (!parameter.rows)
                {
                    parameter.rows = 1;
                }
                parameter.numValues = (parameter.columns * parameter.rows);
                var parameterType = parameter.type;
                if (parameterType === "float" ||
                    parameterType === "int" ||
                    parameterType === "bool")
                {
                    var parameterValues = parameter.values;
                    if (parameterValues)
                    {
                        if (parameterType === "float")
                        {
                            parameter.values = new Float32Array(parameterValues);
                        }
                        else
                        {
                            parameter.values = new Int32Array(parameterValues);
                        }
                    }
                    else
                    {
                        if (parameterType === "float")
                        {
                            parameter.values = new Float32Array(parameter.numValues);
                        }
                        else
                        {
                            parameter.values = new Int32Array(parameter.numValues);
                        }
                    }
                    parameter.sampler = undefined;
                }
                else // Sampler
                {
                    sampler = shader.samplers[p];
                    if (!sampler)
                    {
                        sampler = defaultSampler;
                        shader.samplers[p] = defaultSampler;
                    }
                    parameter.sampler = sampler;
                    parameter.values = null;
                }

                parameter.name = p;

                shader.parameters[p] = parameter;
                numParameters += 1;
            }
        }
        shader.numParameters = numParameters;

        // Techniques and passes
        var shaderTechniques = {};
        var numTechniques = 0;
        var numLoadedTechniques = 0;
        shader.techniques = shaderTechniques;

        function createTechniqueLoader(techniqueName)
        {
            return function () {
                shaderTechniques[techniqueName] = WebGLTechnique.create(gd,
                                                                        shader,
                                                                        techniqueName,
                                                                        techniques[techniqueName]);
                numLoadedTechniques += 1;
                if (numLoadedTechniques >= numTechniques)
                {
                    onload(shader);
                }
            };
        }

        for (p in techniques)
        {
            if (techniques.hasOwnProperty(p))
            {
                if (onload)
                {
                    shaderTechniques[p] = null;

                    TurbulenzEngine.setTimeout(createTechniqueLoader(p), 0);
                }
                else
                {
                    shaderTechniques[p] = WebGLTechnique.create(gd, shader, p, techniques[p]);
                }
                numTechniques += 1;
            }
        }
        shader.numTechniques = numTechniques;

        shader.id = ++gd.counters.shaders;

        return shader;
    }
}

//
// WebGLTechniqueParameters
//
class WebGLTechniqueParameters implements TechniqueParameters
{
    [paramName: string]: any;

    constructor(params: any)
    {
        if (params)
        {
            for (var p in params)
            {
                if (params.hasOwnProperty(p))
                {
                    this[p] = params[p];
                }
            }
        }
    }

    static create(params: any): TechniqueParameters
    {
        return new WebGLTechniqueParameters(params);
    }
}

//
// TechniqueParameterBuffer
//
var techniqueParameterBufferCreate =
    function techniqueParameterBufferCreateFn(params): Float32Array
{
    if (Float32Array.prototype.map === undefined)
    {
        Float32Array.prototype.map = function techniqueParameterBufferMap(offset, numFloats) {
            if (offset === undefined)
            {
                offset = 0;
            }
            var buffer = this;
            if (numFloats === undefined)
            {
                numFloats = this.length;
            }
            function techniqueParameterBufferWriter()
            {
                var numArguments = arguments.length;
                for (var a = 0; a < numArguments; a += 1)
                {
                    var value = arguments[a];
                    if (typeof value === 'number')
                    {
                        buffer[offset] = value;
                        offset += 1;
                    }
                    else
                    {
                        buffer.setData(value, offset, value.length);
                        offset += value.length;
                    }
                }
            }
            return techniqueParameterBufferWriter;
        };

        /* tslint:disable:no-empty */
        Float32Array.prototype.unmap = function techniqueParameterBufferUnmap(writer) {
        };
        /* tslint:enable:no-empty */

        Float32Array.prototype.setData = function techniqueParameterBufferSetData(data,
                                                                                  offset?: number,
                                                                                  numValues?: number) {
            if (offset === undefined)
            {
                offset = 0;
            }
            if (numValues === undefined)
            {
                numValues = this.length;
            }
            for (var n = 0; n < numValues; n += 1, offset += 1)
            {
                this[offset] = data[n];
            }
        };
    }

    return new Float32Array(params.numFloats);
};

//
// WebGLDrawParameters
//
class WebGLDrawParameters implements DrawParameters
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    _indexBuffer: WebGLIndexBuffer;
    _dirty: boolean;
    _vao: any;

    // DrawParameters
    technique       : WebGLTechnique;
    primitive       : number;
    indexBuffer     : WebGLIndexBuffer; // (getter/setter)
    count           : number;
    firstIndex      : number;
    sortKey         : number;
    userData        : any;
    [idx: number]   : any;

    // WebGLDrawParameters (internal)
    endStreams: number;
    endTechniqueParameters: number;
    endInstances: number;

    constructor()
    {
        // Streams, TechniqueParameters and Instances are stored as indexed properties
        this.sortKey = 0;
        this.technique = null;
        this.endStreams = 0;
        this.endTechniqueParameters = (16 * 3);
        this.endInstances = ((16 * 3) + 8);
        this.primitive = -1;
        this.count = 0;
        this.firstIndex = 0;
        this.userData = null;

        this._indexBuffer = null;
        this._dirty = true;
        this._vao = null;

        // Initialize for 1 Stream
        this[0] = null;
        this[1] = null;
        this[2] = 0;

        // Initialize for 2 TechniqueParameters
        this[(16 * 3) + 0] = null;
        this[(16 * 3) + 1] = null;
/*
    // Initialize for 8 instances
        this[((16 * 3) + 8) + 0] = undefined;
        this[((16 * 3) + 8) + 1] = undefined;
        this[((16 * 3) + 8) + 2] = undefined;
        this[((16 * 3) + 8) + 3] = undefined;
        this[((16 * 3) + 8) + 4] = undefined;
        this[((16 * 3) + 8) + 5] = undefined;
        this[((16 * 3) + 8) + 6] = undefined;
        this[((16 * 3) + 8) + 7] = undefined;
*/
        return this;
    }

    setTechniqueParameters(indx, techniqueParameters)
    {
        if (indx < 8)
        {
            indx += (16 * 3);

            this[indx] = techniqueParameters;

            var endTechniqueParameters = this.endTechniqueParameters;
            if (techniqueParameters)
            {
                if (endTechniqueParameters <= indx)
                {
                    this.endTechniqueParameters = (indx + 1);
                }
            }
            else
            {
                while ((16 * 3) < endTechniqueParameters &&
                       !this[endTechniqueParameters - 1])
                {
                    endTechniqueParameters -= 1;
                }
                this.endTechniqueParameters = endTechniqueParameters;
            }
        }
    }

    setVertexBuffer(indx, vertexBuffer)
    {
        if (indx < 16)
        {
            indx *= 3;

            if (this[indx] !== vertexBuffer)
            {
                this[indx] = vertexBuffer;
                this._dirty = true;
            }

            var endStreams = this.endStreams;
            if (vertexBuffer)
            {
                if (endStreams <= indx)
                {
                    this.endStreams = (indx + 3);
                }
            }
            else
            {
                while (0 < endStreams &&
                       !this[endStreams - 3])
                {
                    endStreams -= 3;
                }
                this.endStreams = endStreams;
            }
        }
    }

    setSemantics(indx, semantics)
    {
        if (indx < 16)
        {
            if (this[(indx * 3) + 1] !== semantics)
            {
                this[(indx * 3) + 1] = semantics;
                this._dirty = true;
            }
        }
    }

    setOffset(indx, offset)
    {
        if (indx < 16)
        {
            if (this[(indx * 3) + 2] !== offset)
            {
                this[(indx * 3) + 2] = offset;
                this._dirty = true;
            }
        }
    }

    getTechniqueParameters(indx)
    {
        if (indx < 8)
        {
            return this[indx + (16 * 3)];
        }
        else
        {
            return undefined;
        }
    }

    getVertexBuffer(indx: number): WebGLVertexBuffer
    {
        if (indx < 16)
        {
            return this[(indx * 3) + 0];
        }
        else
        {
            return undefined;
        }
    }

    getSemantics(indx: number): WebGLSemantics
    {
        if (indx < 16)
        {
            return this[(indx * 3) + 1];
        }
        else
        {
            return undefined;
        }
    }

    getOffset(indx: number): number
    {
        if (indx < 16)
        {
            return this[(indx * 3) + 2];
        }
        else
        {
            return undefined;
        }
    }

    addInstance(instanceParameters)
    {
        if (instanceParameters)
        {
            var endInstances = this.endInstances;
            this.endInstances = (endInstances + 1);
            this[endInstances] = instanceParameters;
        }
    }

    removeInstances()
    {
        this.endInstances = ((16 * 3) + 8);
    }

    getNumInstances()
    {
        return (this.endInstances - ((16 * 3) + 8));
    }

    static create(): WebGLDrawParameters
    {
        return new WebGLDrawParameters();
    }
}

Object.defineProperty(WebGLDrawParameters.prototype, "indexBuffer", {
    get : function getIndexBufferFn() {
        return this._indexBuffer;
    },
    set : function setIndexBufferFn(indexBuffer) {
        if (this._indexBuffer !== indexBuffer)
        {
            this._indexBuffer = indexBuffer;
            this._dirty = true;
        }
    },
    enumerable : true,
    configurable : false
});


//
// WebGLGraphicsDevice
//
interface WebGLGraphicsDeviceVertexFormat
{
    name: string;
    numComponents: number;
    stride: number;
    componentStride: number;
    format: number;
    normalized: boolean;
    normalizationScale: number;
    typedSetter: { () : void; };
    typedArray: any; // ArrayBufferView constructor
};

interface WebGLGraphicsDeviceState
{
    depthTestEnable         : boolean;
    blendEnable             : boolean;
    cullFaceEnable          : boolean;
    stencilTestEnable       : boolean;
    polygonOffsetFillEnable : boolean;
    depthMask               : boolean;
    depthFunc               : number;
    blendSrc                : number;
    blendDst                : number;
    cullFace                : number;
    frontFace               : number;
    colorMask               : boolean[];
    stencilFunc             : number;
    stencilRef              : number;
    stencilMask             : number;
    stencilFail             : number;
    stencilZFail            : number;
    stencilZPass            : number;
    polygonOffsetFactor     : number;
    polygonOffsetUnits      : number;
    lineWidth               : number;

    renderStatesToReset     : any[];  // State?

    viewportBox             : number[];
    scissorBox              : number[];

    clearColor              : number[];
    clearDepth              : number;
    clearStencil            : number;

    activeTextureUnit       : number;
    maxTextureUnit          : number;
    lastMaxTextureUnit      : number;
    textureUnits            : any[];

    program                 : WebGLProgram;
};

interface WebGLMetrics
{
    renderTargetChanges: number;
    textureChanges: number;
    renderStateChanges: number;
    vertexAttributesChanges: number;
    vertexBufferChanges: number;
    indexBufferChanges: number;
    vertexArrayObjectChanges: number;
    techniqueChanges: number;
    drawCalls: number;
    primitives: number;

    addPrimitives: { (primitive: number, count: number) : void; };
};

interface WebGLCreationCounters
{
    textures: number;
    vertexBuffers: number;
    indexBuffers: number;
    renderTargets: number;
    renderBuffers: number;
    shaders: number;
    techniques: number;
};

class WebGLGraphicsDevice implements GraphicsDevice
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // GraphicsDevice
    PIXELFORMAT_A8           : number;
    PIXELFORMAT_L8           : number;
    PIXELFORMAT_L8A8         : number;
    PIXELFORMAT_R5G5B5A1     : number;
    PIXELFORMAT_R5G6B5       : number;
    PIXELFORMAT_R4G4B4A4     : number;
    PIXELFORMAT_R8G8B8A8     : number;
    PIXELFORMAT_R8G8B8       : number;
    PIXELFORMAT_D24S8        : number;
    PIXELFORMAT_D16          : number;
    PIXELFORMAT_DXT1         : number;
    PIXELFORMAT_DXT3         : number;
    PIXELFORMAT_DXT5         : number;
    PIXELFORMAT_S8           : number;
    PIXELFORMAT_RGBA32F      : number;
    PIXELFORMAT_RGB32F       : number;
    PIXELFORMAT_RGBA16F      : number;
    PIXELFORMAT_RGB16F       : number;

    PRIMITIVE_POINTS         : number;
    PRIMITIVE_LINES          : number;
    PRIMITIVE_LINE_LOOP      : number;
    PRIMITIVE_LINE_STRIP     : number;
    PRIMITIVE_TRIANGLES      : number;
    PRIMITIVE_TRIANGLE_STRIP : number;
    PRIMITIVE_TRIANGLE_FAN   : number;

    INDEXFORMAT_UBYTE        : number;
    INDEXFORMAT_USHORT       : number;
    INDEXFORMAT_UINT         : number;

    VERTEXFORMAT_BYTE4       : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_BYTE4N      : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_UBYTE4      : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_UBYTE4N     : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_SHORT2      : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_SHORT2N     : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_SHORT4      : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_SHORT4N     : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_USHORT2     : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_USHORT2N    : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_USHORT4     : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_USHORT4N    : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_FLOAT1      : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_FLOAT2      : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_FLOAT3      : WebGLGraphicsDeviceVertexFormat;
    VERTEXFORMAT_FLOAT4      : WebGLGraphicsDeviceVertexFormat;

    SEMANTIC_POSITION        : number;
    SEMANTIC_POSITION0       : number;
    SEMANTIC_BLENDWEIGHT     : number;
    SEMANTIC_BLENDWEIGHT0    : number;
    SEMANTIC_NORMAL          : number;
    SEMANTIC_NORMAL0         : number;
    SEMANTIC_COLOR           : number;
    SEMANTIC_COLOR0          : number;
    SEMANTIC_COLOR1          : number;
    SEMANTIC_SPECULAR        : number;
    SEMANTIC_FOGCOORD        : number;
    SEMANTIC_TESSFACTOR      : number;
    SEMANTIC_PSIZE0          : number;
    SEMANTIC_BLENDINDICES    : number;
    SEMANTIC_BLENDINDICES0   : number;
    SEMANTIC_TEXCOORD        : number;
    SEMANTIC_TEXCOORD0       : number;
    SEMANTIC_TEXCOORD1       : number;
    SEMANTIC_TEXCOORD2       : number;
    SEMANTIC_TEXCOORD3       : number;
    SEMANTIC_TEXCOORD4       : number;
    SEMANTIC_TEXCOORD5       : number;
    SEMANTIC_TEXCOORD6       : number;
    SEMANTIC_TEXCOORD7       : number;
    SEMANTIC_TANGENT         : number;
    SEMANTIC_TANGENT0        : number;
    SEMANTIC_BINORMAL0       : number;
    SEMANTIC_BINORMAL        : number;
    SEMANTIC_PSIZE           : number;
    SEMANTIC_ATTR0           : number;
    SEMANTIC_ATTR1           : number;
    SEMANTIC_ATTR2           : number;
    SEMANTIC_ATTR3           : number;
    SEMANTIC_ATTR4           : number;
    SEMANTIC_ATTR5           : number;
    SEMANTIC_ATTR6           : number;
    SEMANTIC_ATTR7           : number;
    SEMANTIC_ATTR8           : number;
    SEMANTIC_ATTR9           : number;
    SEMANTIC_ATTR10          : number;
    SEMANTIC_ATTR11          : number;
    SEMANTIC_ATTR12          : number;
    SEMANTIC_ATTR13          : number;
    SEMANTIC_ATTR14          : number;
    SEMANTIC_ATTR15          : number;

    DEFAULT_SAMPLER          : WebGLSampler;

    // Members
    width: number;
    height: number;
    extensions: string;
    shadingLanguageVersion: string;

    fullscreen: boolean;

    rendererVersion: string;
    renderer: string;
    vendor: string;
    videoRam: number;
    desktopWidth: number;
    desktopHeight: number;
    fps: number;

    // These are specific to WebGLGraphicsDevice

    gl: WebGLRenderingContext;

    state: WebGLGraphicsDeviceState;
    stateHandlers: any;
    oldFullscreen: boolean;

    clientStateMask: number;
    attributeMask: number;
    activeTechnique: WebGLTechnique;
    activeIndexBuffer: WebGLIndexBuffer;
    bindedVertexBuffer: WebGLVertexBuffer;
    activeRenderTarget: WebGLRenderTarget;

    _semanticsOffsets: WebGLSemanticOffset[];

    immediateVertexBuffer: WebGLVertexBuffer;
    immediatePrimitive: number;
    immediateSemantics: number[];

    numFrames: number;
    previousFrameTime: number;

    _techniqueParametersArray: any[];
    _drawArrayId: number;

    cachedSamplers: any;

    compressedTexturesExtension: any;
    WEBGL_compressed_texture_s3tc: boolean;
    TEXTURE_MAX_ANISOTROPY_EXT: number;
    maxAnisotropy: number;
    WEBGL_draw_buffers: boolean;
    drawBuffersExtension: any;
    floatTextureExtension: any;
    halfFloatTextureExtension: any;
    vertexArrayObjectExtension: any;

    supportedVideoExtensions: WebGLVideoSupportedExtensions;

    metrics: WebGLMetrics;

    counters: WebGLCreationCounters;

    fixIE: string;

    drawIndexed(primitive: number, numIndices: number, first?: number)
    {
        var gl = this.gl;
        var indexBuffer = this.activeIndexBuffer;

        var offset;
        if (first)
        {
            offset = (first * indexBuffer.stride);
        }
        else
        {
            offset = 0;
        }

        var format = indexBuffer.format;

        var attributeMask = this.attributeMask;

        var activeTechnique = this.activeTechnique;
        var passes = activeTechnique.passes;
        var numPasses = passes.length;
        var mask;

        if (activeTechnique.checkProperties)
        {
            activeTechnique.checkProperties(this);
        }

        if (1 === numPasses)
        {
            /* tslint:disable:no-bitwise */
            mask = (passes[0].semanticsMask & attributeMask);
            /* tslint:enable:no-bitwise */
            if (mask !== this.clientStateMask)
            {
                this.enableClientState(mask);
            }

            gl.drawElements(primitive, numIndices, format, offset);

            if (debug)
            {
                this.metrics.addPrimitives(primitive, numIndices);
            }
        }
        else
        {
            for (var p = 0; p < numPasses; p += 1)
            {
                var pass = passes[p];

                /* tslint:disable:no-bitwise */
                mask = (pass.semanticsMask & attributeMask);
                /* tslint:enable:no-bitwise */
                if (mask !== this.clientStateMask)
                {
                    this.enableClientState(mask);
                }

                this.setPass(pass);

                gl.drawElements(primitive, numIndices, format, offset);

                if (debug)
                {
                    this.metrics.addPrimitives(primitive, numIndices);
                }
            }
        }
    }

    draw(primitive: number, numVertices: number, first?: number)
    {
        var gl = this.gl;

        var attributeMask = this.attributeMask;

        var activeTechnique = this.activeTechnique;
        var passes = activeTechnique.passes;
        var numPasses = passes.length;
        var mask;

        if (activeTechnique.checkProperties)
        {
            activeTechnique.checkProperties(this);
        }

        if (1 === numPasses)
        {
            /* tslint:disable:no-bitwise */
            mask = (passes[0].semanticsMask & attributeMask);
            /* tslint:enable:no-bitwise */
            if (mask !== this.clientStateMask)
            {
                this.enableClientState(mask);
            }

            gl.drawArrays(primitive, first, numVertices);

            if (debug)
            {
                this.metrics.addPrimitives(primitive, numVertices);
            }
        }
        else
        {
            for (var p = 0; p < numPasses; p += 1)
            {
                var pass = passes[p];

                /* tslint:disable:no-bitwise */
                mask = (pass.semanticsMask & attributeMask);
                /* tslint:enable:no-bitwise */
                if (mask !== this.clientStateMask)
                {
                    this.enableClientState(mask);
                }

                this.setPass(pass);

                gl.drawArrays(primitive, first, numVertices);

                if (debug)
                {
                    this.metrics.addPrimitives(primitive, numVertices);
                }
            }
        }
    }

    setTechniqueParameters()
    {
        var activeTechnique = this.activeTechnique;
        var passes = activeTechnique.passes;
        var numTechniqueParameters = arguments.length;
        var t;
        if (1 === passes.length)
        {
            var parameters = passes[0].parameters;
            for (t = 0; t < numTechniqueParameters; t += 1)
            {
                this.setParametersImmediate(parameters, arguments[t]);
            }
        }
        else
        {
            for (t = 0; t < numTechniqueParameters; t += 1)
            {
                this.setParametersDeferred(this, passes, arguments[t]);
            }
        }
    }

    //Internal

    setParametersImmediate(parameters: { [name: string]: PassParameter },
                           techniqueParameters: WebGLTechniqueParameters): void
    {
        var gl = this.gl;

        for (var p in techniqueParameters)
        {
            var parameter = parameters[p];
            if (parameter !== undefined)
            {
                var parameterValues = techniqueParameters[p];
                if (parameterValues !== undefined)
                {
                    var paramInfo = parameter.info;
                    var numColumns, location;
                    if (paramInfo.type === 'float')
                    {
                        numColumns = paramInfo.columns;
                        location = parameter.location;
                        if (4 === numColumns)
                        {
                            gl.uniform4fv(location, parameterValues);
                        }
                        else if (3 === numColumns)
                        {
                            gl.uniform3fv(location, parameterValues);
                        }
                        else if (2 === numColumns)
                        {
                            gl.uniform2fv(location, parameterValues);
                        }
                        else if (1 === paramInfo.rows)
                        {
                            gl.uniform1f(location, parameterValues);
                        }
                        else //if (1 === numColumns)
                        {
                            gl.uniform1fv(location, parameterValues);
                        }
                    }
                    else if (paramInfo.sampler !== undefined)
                    {
                        this.setTexture(parameter.textureUnit, parameterValues, paramInfo.sampler);
                    }
                    else
                    {
                        numColumns = paramInfo.columns;
                        location = parameter.location;
                        if (4 === numColumns)
                        {
                            gl.uniform4iv(location, parameterValues);
                        }
                        else if (3 === numColumns)
                        {
                            gl.uniform3iv(location, parameterValues);
                        }
                        else if (2 === numColumns)
                        {
                            gl.uniform2iv(location, parameterValues);
                        }
                        else if (1 === paramInfo.rows)
                        {
                            gl.uniform1i(location, parameterValues);
                        }
                        else //if (1 === numColumns)
                        {
                            gl.uniform1iv(location, parameterValues);
                        }
                    }
                }
                else
                {
                    delete techniqueParameters[p];
                }
            }
        }
    }

    // ONLY USE FOR SINGLE PASS TECHNIQUES ON DRAWARRAY
    setParametersArrayCaching(parameters: { [name: string]: PassParameter },
                              techniqueParametersArray: any[],
                              numTechniqueParameters: number): void
    {
        var gl = this.gl;
        var n;
        for (n = 0; n < numTechniqueParameters; n += 2)
        {
            var p = techniqueParametersArray[n];
            var parameter = parameters[p];
            if (parameter !== undefined)
            {
                var parameterValues = techniqueParametersArray[n + 1];
                if (parameter.value !== parameterValues)
                {
                    parameter.value = parameterValues;

                    var paramInfo = parameter.info;
                    var numColumns, location;
                    if (paramInfo.type === 'float')
                    {
                        numColumns = paramInfo.columns;
                        location = parameter.location;
                        if (4 === numColumns)
                        {
                            gl.uniform4fv(location, parameterValues);
                        }
                        else if (3 === numColumns)
                        {
                            gl.uniform3fv(location, parameterValues);
                        }
                        else if (2 === numColumns)
                        {
                            gl.uniform2fv(location, parameterValues);
                        }
                        else if (1 === paramInfo.rows)
                        {
                            gl.uniform1f(location, parameterValues);
                        }
                        else //if (1 === numColumns)
                        {
                            gl.uniform1fv(location, parameterValues);
                        }
                    }
                    else if (paramInfo.sampler !== undefined)
                    {
                        this.setTexture(parameter.textureUnit, parameterValues, paramInfo.sampler);
                    }
                    else
                    {
                        numColumns = paramInfo.columns;
                        location = parameter.location;
                        if (4 === numColumns)
                        {
                            gl.uniform4iv(location, parameterValues);
                        }
                        else if (3 === numColumns)
                        {
                            gl.uniform3iv(location, parameterValues);
                        }
                        else if (2 === numColumns)
                        {
                            gl.uniform2iv(location, parameterValues);
                        }
                        else if (1 === paramInfo.rows)
                        {
                            gl.uniform1i(location, parameterValues);
                        }
                        else //if (1 === numColumns)
                        {
                            gl.uniform1iv(location, parameterValues);
                        }
                    }
                }
            }
        }
    }

    setParametersCaching(parameters: { [name: string]: PassParameter },
                         techniqueParameters: WebGLTechniqueParameters): void
    {
        var gl = this.gl;

        for (var p in techniqueParameters)
        {
            var parameter = parameters[p];
            if (parameter !== undefined)
            {
                var parameterValues = techniqueParameters[p];
                if (parameter.value !== parameterValues)
                {
                    if (parameterValues !== undefined)
                    {
                        parameter.value = parameterValues;

                        var paramInfo = parameter.info;
                        var numColumns, location;
                        if (paramInfo.type === 'float')
                        {
                            numColumns = paramInfo.columns;
                            location = parameter.location;
                            if (4 === numColumns)
                            {
                                gl.uniform4fv(location, parameterValues);
                            }
                            else if (3 === numColumns)
                            {
                                gl.uniform3fv(location, parameterValues);
                            }
                            else if (2 === numColumns)
                            {
                                gl.uniform2fv(location, parameterValues);
                            }
                            else if (1 === paramInfo.rows)
                            {
                                gl.uniform1f(location, parameterValues);
                            }
                            else //if (1 === numColumns)
                            {
                                gl.uniform1fv(location, parameterValues);
                            }
                        }
                        else if (paramInfo.sampler !== undefined)
                        {
                            this.setTexture(parameter.textureUnit, parameterValues, paramInfo.sampler);
                        }
                        else
                        {
                            numColumns = paramInfo.columns;
                            location = parameter.location;
                            if (4 === numColumns)
                            {
                                gl.uniform4iv(location, parameterValues);
                            }
                            else if (3 === numColumns)
                            {
                                gl.uniform3iv(location, parameterValues);
                            }
                            else if (2 === numColumns)
                            {
                                gl.uniform2iv(location, parameterValues);
                            }
                            else if (1 === paramInfo.rows)
                            {
                                gl.uniform1i(location, parameterValues);
                            }
                            else //if (1 === numColumns)
                            {
                                gl.uniform1iv(location, parameterValues);
                            }
                        }
                    }
                    else
                    {
                        delete techniqueParameters[p];
                    }
                }
            }
        }
    }

    // ONLY USE FOR SINGLE PASS TECHNIQUES ON DRAWARRAYMULTIPASS
    setParametersCachingMultiPass(gd: WebGLGraphicsDevice,
                                  passes: WebGLPass[],
                                  techniqueParameters: WebGLTechniqueParameters): void
    {
        gd.setParametersCaching(passes[0].parameters, techniqueParameters);
    }

    setParametersDeferred(gd: WebGLGraphicsDevice,
                          passes: WebGLPass[],
                          techniqueParameters: WebGLTechniqueParameters): void
    {
        var numPasses = passes.length;
        var min = Math.min;
        var max = Math.max;
        for (var n = 0; n < numPasses; n += 1)
        {
            var pass = passes[n];
            var parameters = pass.parameters;
            pass.dirty = true;

            for (var p in techniqueParameters)
            {
                var parameter = parameters[p];
                if (parameter)
                {
                    var parameterValues = techniqueParameters[p];
                    if (parameterValues !== undefined)
                    {
                        var paramInfo = parameter.info;
                        if (paramInfo.sampler)
                        {
                            paramInfo.values = parameterValues;
                            parameter.dirty = 1;
                        }
                        else if (typeof parameterValues !== 'number')
                        {
                            var values = paramInfo.values;
                            var numValues = min(paramInfo.numValues, parameterValues.length);
                            for (var v = 0; v < numValues; v += 1)
                            {
                                values[v] = parameterValues[v];
                            }
                            parameter.dirty = max(numValues, (parameter.dirty || 0));
                        }
                        else
                        {
                            paramInfo.values[0] = parameterValues;
                            parameter.dirty = (parameter.dirty || 1);
                        }
                    }
                    else
                    {
                        delete techniqueParameters[p];
                    }
                }
            }
        }
    }

    setTechnique(technique)
    {
        var activeTechnique = this.activeTechnique;
        if (activeTechnique !== technique)
        {
            if (activeTechnique)
            {
                activeTechnique.deactivate();
            }

            this.activeTechnique = technique;

            technique.activate(this);

            var passes = technique.passes;
            if (1 === passes.length)
            {
                this.setPass(passes[0]);
            }
        }
    }

    // ONLY USE FOR SINGLE PASS TECHNIQUES ON DRAWARRAY
    setTechniqueCaching(technique: WebGLTechnique, drawArrayId: number)
    {
        var pass = technique.passes[0];

        var activeTechnique = this.activeTechnique;
        if (activeTechnique !== technique)
        {
            if (activeTechnique)
            {
                activeTechnique.deactivate();
            }

            this.activeTechnique = technique;

            technique.activate(this);

            this.setPass(pass);
        }

        var parameters = pass.parametersArray;
        var numParameters = parameters.length;
        var n;
        if (technique._drawArrayId !== drawArrayId)
        {
            technique._drawArrayId = drawArrayId;
            for (n = 0; n < numParameters; n += 1)
            {
                parameters[n].value = null;
            }
        }
        else
        {
            for (n = 0; n < numParameters; n += 1)
            {
                var parameter = parameters[n];
                var paramInfo = parameter.info;
                if (paramInfo.sampler)
                {
                    parameter.value = null;
                }
            }
        }
    }

    setStream(vertexBuffer: VertexBuffer,
              semantics: Semantics,
              offset?: number)
    {
        if (debug)
        {
            debug.assert(vertexBuffer instanceof WebGLVertexBuffer);
            debug.assert(semantics instanceof WebGLSemantics);
        }

        if (offset)
        {
            offset *= (<WebGLVertexBuffer>vertexBuffer).strideInBytes;
        }
        else
        {
            offset = 0;
        }

        this.bindVertexBuffer((<WebGLVertexBuffer>vertexBuffer).glBuffer);

        /* tslint:disable:no-bitwise */
        this.attributeMask |=
            (<WebGLVertexBuffer>vertexBuffer).bindAttributesCached((<WebGLSemantics>semantics), offset);
        /* tslint:enable:no-bitwise */
    }

    setIndexBuffer(indexBuffer: IndexBuffer)
    {
        if (this.activeIndexBuffer !== <WebGLIndexBuffer>indexBuffer)
        {
            this.activeIndexBuffer = <WebGLIndexBuffer>indexBuffer;
            var glBuffer;
            if (indexBuffer)
            {
                glBuffer = (<WebGLIndexBuffer>indexBuffer).glBuffer;
            }
            else
            {
                glBuffer = null;
            }
            var gl = this.gl;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glBuffer);

            if (debug)
            {
                this.metrics.indexBufferChanges += 1;
            }
        }
    }

    // This version only support technique with a single pass, but it is faster
    drawArray(drawParametersArray: WebGLDrawParameters[],
              globalTechniqueParametersArray: TechniqueParameters[],
              sortMode?: number)
    {
        var gl = this.gl;
        var ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER;

        var numDrawParameters = drawParametersArray.length;
        if (numDrawParameters > 1 && sortMode)
        {
            if (sortMode > 0)
            {
                drawParametersArray.sort(this._drawArraySortPositive);
            }
            else //if (sortMode < 0)
            {
                drawParametersArray.sort(this._drawArraySortNegative);
            }
        }

        var globalsArray = this._techniqueParametersArray;
        var numGlobalParameters = this._createTechniqueParametersArray(globalTechniqueParametersArray, globalsArray);

        var drawArrayId = (++this._drawArrayId);
        var activeIndexBuffer = this.activeIndexBuffer;
        var attributeMask = this.attributeMask;
        var lastTechnique: WebGLTechnique = null;
        var lastEndStreams = -1;
        var lastDrawParameters = null;
        var techniqueParameters = null;
        var v = 0;
        var streamsMatch = false;
        var vertexBuffer = null;
        var pass: WebGLPass = null;
        var passParameters: { [name: string]: PassParameter } = null;
        var indexFormat = 0;
        var indexStride = 0;
        var mask = 0;
        var t = 0;

        if (activeIndexBuffer)
        {
            indexFormat = activeIndexBuffer.format;
            indexStride = activeIndexBuffer.stride;
        }

        for (var n = 0; n < numDrawParameters; n += 1)
        {
            var drawParameters = drawParametersArray[n];
            var technique: WebGLTechnique = drawParameters.technique;
            var endTechniqueParameters = drawParameters.endTechniqueParameters;
            var endStreams = drawParameters.endStreams;
            var endInstances = drawParameters.endInstances;
            var indexBuffer = drawParameters._indexBuffer;
            var primitive = drawParameters.primitive;
            var count = drawParameters.count;
            var firstIndex = drawParameters.firstIndex;

            if (lastTechnique !== technique)
            {
                lastTechnique = technique;

                this.setTechniqueCaching(technique, drawArrayId);

                pass = technique.passes[0];
                passParameters = pass.parameters;

                /* tslint:disable:no-bitwise */
                mask = (pass.semanticsMask & attributeMask);
                /* tslint:enable:no-bitwise */
                if (mask !== this.clientStateMask)
                {
                    this.enableClientState(mask);
                }

                if (technique.checkProperties)
                {
                    technique.checkProperties(this);
                }

                this.setParametersArrayCaching(passParameters, globalsArray, numGlobalParameters);
            }

            for (t = (16 * 3); t < endTechniqueParameters; t += 1)
            {
                techniqueParameters = drawParameters[t];
                if (techniqueParameters)
                {
                    this.setParametersCaching(passParameters, techniqueParameters);
                }
            }

            streamsMatch = (lastEndStreams === endStreams);
            for (v = 0; streamsMatch && v < endStreams; v += 3)
            {
                streamsMatch = (lastDrawParameters[v]     === drawParameters[v]     &&
                                lastDrawParameters[v + 1] === drawParameters[v + 1] &&
                                lastDrawParameters[v + 2] === drawParameters[v + 2]);
            }

            if (!streamsMatch)
            {
                lastEndStreams = endStreams;

                for (v = 0; v < endStreams; v += 3)
                {
                    vertexBuffer = drawParameters[v];
                    if (vertexBuffer)
                    {
                        this.setStream(vertexBuffer, drawParameters[v + 1], drawParameters[v + 2]);
                    }
                }

                attributeMask = this.attributeMask;

                /* tslint:disable:no-bitwise */
                mask = (pass.semanticsMask & attributeMask);
                /* tslint:enable:no-bitwise */
                if (mask !== this.clientStateMask)
                {
                    this.enableClientState(mask);
                }
            }

            lastDrawParameters = drawParameters;

            /* tslint:disable:no-bitwise */
            if (indexBuffer)
            {
                if (activeIndexBuffer !== indexBuffer)
                {
                    activeIndexBuffer = indexBuffer;
                    gl.bindBuffer(ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);

                    indexFormat = indexBuffer.format;
                    indexStride = indexBuffer.stride;

                    if (debug)
                    {
                        this.metrics.indexBufferChanges += 1;
                    }
                }

                firstIndex *= indexStride;

                t = ((16 * 3) + 8);
                if (t < endInstances)
                {
                    do
                    {
                        this.setParametersCaching(passParameters, drawParameters[t]);

                        gl.drawElements(primitive, count, indexFormat, firstIndex);

                        if (debug)
                        {
                            this.metrics.addPrimitives(primitive, count);
                        }

                        t += 1;
                    }
                    while (t < endInstances);
                }
                else
                {
                    gl.drawElements(primitive, count, indexFormat, firstIndex);

                    if (debug)
                    {
                        this.metrics.addPrimitives(primitive, count);
                    }
                }
            }
            else
            {
                t = ((16 * 3) + 8);
                if (t < endInstances)
                {
                    do
                    {
                        this.setParametersCaching(passParameters, drawParameters[t]);

                        gl.drawArrays(primitive, firstIndex, count);

                        if (debug)
                        {
                            this.metrics.addPrimitives(primitive, count);
                        }

                        t += 1;
                    }
                    while (t < endInstances);
                }
                else
                {
                    gl.drawArrays(primitive, firstIndex, count);

                    if (debug)
                    {
                        this.metrics.addPrimitives(primitive, count);
                    }
                }
            }
            /* tslint:enable:no-bitwise */
        }

        this.activeIndexBuffer = activeIndexBuffer;
    }

    drawArrayVAO(drawParametersArray: WebGLDrawParameters[],
                 globalTechniqueParametersArray: TechniqueParameters[],
                 sortMode?: number)
    {
        var gl = this.gl;
        var ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER;

        var numDrawParameters = drawParametersArray.length;
        if (numDrawParameters > 1 && sortMode)
        {
            if (sortMode > 0)
            {
                drawParametersArray.sort(this._drawArraySortPositive);
            }
            else //if (sortMode < 0)
            {
                drawParametersArray.sort(this._drawArraySortNegative);
            }
        }

        var globalsArray = this._techniqueParametersArray;
        var numGlobalParameters = this._createTechniqueParametersArray(globalTechniqueParametersArray, globalsArray);

        var vertexArrayObjectExtension = this.vertexArrayObjectExtension;

        var drawArrayId = (++this._drawArrayId);
        var lastTechnique: WebGLTechnique = null;
        var lastEndStreams = -1;
        var lastDrawParameters = null;
        var techniqueParameters = null;
        var v = 0;
        var vaoMatch = false;
        var attributeMask = 0;
        var vertexBuffer: WebGLVertexBuffer = null;
        var semantics: WebGLSemantics = null;
        var offset = 0;
        var pass: WebGLPass = null;
        var passParameters: { [name: string]: PassParameter } = null;
        var indexFormat = 0;
        var indexStride = 0;
        var t = 0;

        for (var n = 0; n < numDrawParameters; n += 1)
        {
            var drawParameters = drawParametersArray[n];
            var technique: WebGLTechnique = drawParameters.technique;
            var endTechniqueParameters = drawParameters.endTechniqueParameters;
            var endStreams = drawParameters.endStreams;
            var endInstances = drawParameters.endInstances;
            var indexBuffer = drawParameters._indexBuffer;
            var primitive = drawParameters.primitive;
            var count = drawParameters.count;
            var firstIndex = drawParameters.firstIndex;

            if (lastTechnique !== technique)
            {
                lastTechnique = technique;

                this.setTechniqueCaching(technique, drawArrayId);

                pass = technique.passes[0];
                passParameters = pass.parameters;

                if (technique.checkProperties)
                {
                    technique.checkProperties(this);
                }

                this.setParametersArrayCaching(passParameters, globalsArray, numGlobalParameters);
            }

            for (t = (16 * 3); t < endTechniqueParameters; t += 1)
            {
                techniqueParameters = drawParameters[t];
                if (techniqueParameters)
                {
                    this.setParametersCaching(passParameters, techniqueParameters);
                }
            }

            vaoMatch = (lastEndStreams === endStreams &&
                        lastDrawParameters._indexBuffer === indexBuffer);
            for (v = 0; vaoMatch && v < endStreams; v += 3)
            {
                vaoMatch = (lastDrawParameters[v]     === drawParameters[v]     &&
                            lastDrawParameters[v + 1] === drawParameters[v + 1] &&
                            lastDrawParameters[v + 2] === drawParameters[v + 2]);
            }

            if (!vaoMatch)
            {
                lastEndStreams = endStreams;

                if (drawParameters._dirty)
                {
                    drawParameters._dirty = false;

                    if (drawParameters._vao)
                    {
                        vertexArrayObjectExtension.deleteVertexArrayOES(drawParameters._vao);
                    }

                    drawParameters._vao = vertexArrayObjectExtension.createVertexArrayOES();

                    vertexArrayObjectExtension.bindVertexArrayOES(drawParameters._vao);

                    attributeMask = 0;
                    for (v = 0; v < endStreams; v += 3)
                    {
                        vertexBuffer = drawParameters[v];
                        if (vertexBuffer)
                        {
                            semantics = drawParameters[v + 1];

                            offset = drawParameters[v + 2];
                            if (offset)
                            {
                                offset *= vertexBuffer.strideInBytes;
                            }
                            else
                            {
                                offset = 0;
                            }

                            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.glBuffer);

                            /* tslint:disable:no-bitwise */
                            attributeMask |= vertexBuffer.bindAttributes(semantics, offset);
                            /* tslint:enable:no-bitwise */

                            if (debug)
                            {
                                this.metrics.vertexBufferChanges += 1;
                            }
                        }
                    }

                    /* tslint:disable:no-bitwise */
                    this.clientStateMask = (~attributeMask) & 0xf;
                    /* tslint:enable:no-bitwise */
                    this.enableClientState(attributeMask);

                    if (indexBuffer)
                    {
                        gl.bindBuffer(ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);
                    }
                }
                else
                {
                    vertexArrayObjectExtension.bindVertexArrayOES(drawParameters._vao);
                }

                if (indexBuffer &&
                    (!lastDrawParameters ||
                     lastDrawParameters._indexBuffer !== indexBuffer))
                {
                    indexFormat = indexBuffer.format;
                    indexStride = indexBuffer.stride;
                }

                if (debug)
                {
                    this.metrics.vertexArrayObjectChanges += 1;
                }
            }
            else
            {
                if (drawParameters._dirty)
                {
                    drawParameters._dirty = false;
                    if (drawParameters._vao !== lastDrawParameters._vao)
                    {
                        if (drawParameters._vao)
                        {
                            vertexArrayObjectExtension.deleteVertexArrayOES(drawParameters._vao);
                        }
                    }
                }
                drawParameters._vao = lastDrawParameters._vao;
            }

            lastDrawParameters = drawParameters;

            /* tslint:disable:no-bitwise */
            if (indexBuffer)
            {
                firstIndex *= indexStride;

                t = ((16 * 3) + 8);
                if (t < endInstances)
                {
                    do
                    {
                        this.setParametersCaching(passParameters, drawParameters[t]);

                        gl.drawElements(primitive, count, indexFormat, firstIndex);

                        if (debug)
                        {
                            this.metrics.addPrimitives(primitive, count);
                        }

                        t += 1;
                    }
                    while (t < endInstances);
                }
                else
                {
                    gl.drawElements(primitive, count, indexFormat, firstIndex);

                    if (debug)
                    {
                        this.metrics.addPrimitives(primitive, count);
                    }
                }
            }
            else
            {
                t = ((16 * 3) + 8);
                if (t < endInstances)
                {
                    do
                    {
                        this.setParametersCaching(passParameters, drawParameters[t]);

                        gl.drawArrays(primitive, firstIndex, count);

                        if (debug)
                        {
                            this.metrics.addPrimitives(primitive, count);
                        }

                        t += 1;
                    }
                    while (t < endInstances);
                }
                else
                {
                    gl.drawArrays(primitive, firstIndex, count);

                    if (debug)
                    {
                        this.metrics.addPrimitives(primitive, count);
                    }
                }
            }
            /* tslint:enable:no-bitwise */
        }

        vertexArrayObjectExtension.bindVertexArrayOES(null);

        // Reset vertex state
        this.activeIndexBuffer = null;
        this.bindedVertexBuffer = null;
        this.clientStateMask = 0;
        this.attributeMask = 0;

        var semanticsOffsets = this._semanticsOffsets;
        for (n = 0; n < 16; n += 1)
        {
            semanticsOffsets[n].vertexBuffer = null;
        }
    }


    // This version suports technique with multiple passes but it is slower
    drawArrayMultiPass(drawParametersArray, globalTechniqueParametersArray, sortMode)
    {
        var gl = this.gl;
        var ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER;

        var setParametersCaching = this.setParametersCachingMultiPass;
        var setParametersDeferred = this.setParametersDeferred;

        var numGlobalTechniqueParameters = globalTechniqueParametersArray.length;

        var numDrawParameters = drawParametersArray.length;
        if (numDrawParameters > 1 && sortMode)
        {
            if (sortMode > 0)
            {
                drawParametersArray.sort(this._drawArraySortPositive);
            }
            else //if (sortMode < 0)
            {
                drawParametersArray.sort(this._drawArraySortNegative);
            }
        }

        var drawArrayId = (++this._drawArrayId);
        var activeIndexBuffer = this.activeIndexBuffer;
        var attributeMask = this.attributeMask;
        var setParameters = null;
        var lastTechnique: WebGLTechnique = null;
        var lastEndStreams = -1;
        var lastDrawParameters = null;
        var techniqueParameters = null;
        var v = 0;
        var streamsMatch = false;
        var vertexBuffer: WebGLVertexBuffer = null;
        var passes: WebGLPass[] = null;
        var p = null;
        var pass: WebGLPass = null;
        var indexFormat = 0;
        var indexStride = 0;
        var numPasses = 0;
        var mask = 0;
        var t = 0;

        if (activeIndexBuffer)
        {
            indexFormat = activeIndexBuffer.format;
            indexStride = activeIndexBuffer.stride;
        }

        for (var n = 0; n < numDrawParameters; n += 1)
        {
            var drawParameters = <WebGLDrawParameters>(drawParametersArray[n]);
            var technique: WebGLTechnique = drawParameters.technique;
            var endTechniqueParameters = drawParameters.endTechniqueParameters;
            var endStreams = drawParameters.endStreams;
            var endInstances = drawParameters.endInstances;
            var indexBuffer = drawParameters._indexBuffer;
            var primitive = drawParameters.primitive;
            var count = drawParameters.count;
            var firstIndex = drawParameters.firstIndex;

            if (lastTechnique !== technique)
            {
                lastTechnique = technique;

                passes = technique.passes;
                numPasses = passes.length;
                if (1 === numPasses)
                {
                    this.setTechniqueCaching(technique, drawArrayId);
                    setParameters = setParametersCaching;

                    /* tslint:disable:no-bitwise */
                    mask = (passes[0].semanticsMask & attributeMask);
                    /* tslint:enable:no-bitwise */
                    if (mask !== this.clientStateMask)
                    {
                        this.enableClientState(mask);
                    }
                }
                else
                {
                    this.setTechnique(technique);
                    setParameters = setParametersDeferred;
                }

                if (technique.checkProperties)
                {
                    technique.checkProperties(this);
                }

                for (t = 0; t < numGlobalTechniqueParameters; t += 1)
                {
                    setParameters(this, passes, globalTechniqueParametersArray[t]);
                }
            }

            for (t = (16 * 3); t < endTechniqueParameters; t += 1)
            {
                techniqueParameters = drawParameters[t];
                if (techniqueParameters)
                {
                    setParameters(this, passes, techniqueParameters);
                }
            }

            streamsMatch = (lastEndStreams === endStreams);
            for (v = 0; streamsMatch && v < endStreams; v += 3)
            {
                streamsMatch = (lastDrawParameters[v]     === drawParameters[v]     &&
                                lastDrawParameters[v + 1] === drawParameters[v + 1] &&
                                lastDrawParameters[v + 2] === drawParameters[v + 2]);
            }

            if (!streamsMatch)
            {
                lastEndStreams = endStreams;

                for (v = 0; v < endStreams; v += 3)
                {
                    vertexBuffer = drawParameters[v];
                    if (vertexBuffer)
                    {
                        this.setStream(vertexBuffer, drawParameters[v + 1], drawParameters[v + 2]);
                    }
                }

                attributeMask = this.attributeMask;
                if (1 === numPasses)
                {
                    /* tslint:disable:no-bitwise */
                    mask = (passes[0].semanticsMask & attributeMask);
                    /* tslint:enable:no-bitwise */
                    if (mask !== this.clientStateMask)
                    {
                        this.enableClientState(mask);
                    }
                }
            }

            lastDrawParameters = drawParameters;

            /* tslint:disable:no-bitwise */
            if (indexBuffer)
            {
                if (activeIndexBuffer !== indexBuffer)
                {
                    activeIndexBuffer = indexBuffer;
                    gl.bindBuffer(ELEMENT_ARRAY_BUFFER, indexBuffer.glBuffer);

                    indexFormat = indexBuffer.format;
                    indexStride = indexBuffer.stride;

                    if (debug)
                    {
                        this.metrics.indexBufferChanges += 1;
                    }
                }

                firstIndex *= indexStride;

                if (1 === numPasses)
                {
                    t = ((16 * 3) + 8);
                    if (t < endInstances)
                    {
                        do
                        {
                            setParameters(this, passes, drawParameters[t]);

                            gl.drawElements(primitive, count, indexFormat, firstIndex);

                            if (debug)
                            {
                                this.metrics.addPrimitives(primitive, count);
                            }

                            t += 1;
                        }
                        while (t < endInstances);
                    }
                    else
                    {
                        gl.drawElements(primitive, count, indexFormat, firstIndex);

                        if (debug)
                        {
                            this.metrics.addPrimitives(primitive, count);
                        }
                    }
                }
                else
                {
                    t = ((16 * 3) + 8);
                    if (t < endInstances)
                    {
                        do
                        {
                            setParameters(this, passes, drawParameters[t]);

                            for (p = 0; p < numPasses; p += 1)
                            {
                                pass = passes[p];

                                mask = (pass.semanticsMask & attributeMask);
                                if (mask !== this.clientStateMask)
                                {
                                    this.enableClientState(mask);
                                }

                                this.setPass(pass);

                                gl.drawElements(primitive, count, indexFormat, firstIndex);

                                if (debug)
                                {
                                    this.metrics.addPrimitives(primitive, count);
                                }
                            }

                            t += 1;
                        }
                        while (t < endInstances);
                    }
                    else
                    {
                        for (p = 0; p < numPasses; p += 1)
                        {
                            pass = passes[p];

                            mask = (pass.semanticsMask & attributeMask);
                            if (mask !== this.clientStateMask)
                            {
                                this.enableClientState(mask);
                            }

                            this.setPass(pass);

                            gl.drawElements(primitive, count, indexFormat, firstIndex);

                            if (debug)
                            {
                                this.metrics.addPrimitives(primitive, count);
                            }
                        }
                    }
                }
            }
            else
            {
                if (1 === numPasses)
                {
                    t = ((16 * 3) + 8);
                    if (t < endInstances)
                    {
                        do
                        {
                            setParameters(this, passes, drawParameters[t]);

                            gl.drawArrays(primitive, firstIndex, count);

                            if (debug)
                            {
                                this.metrics.addPrimitives(primitive, count);
                            }

                            t += 1;
                        }
                        while (t < endInstances);
                    }
                    else
                    {
                        gl.drawArrays(primitive, firstIndex, count);

                        if (debug)
                        {
                            this.metrics.addPrimitives(primitive, count);
                        }
                    }
                }
                else
                {
                    t = ((16 * 3) + 8);
                    if (t < endInstances)
                    {
                        do
                        {
                            setParameters(this, passes, drawParameters[t]);

                            for (p = 0; p < numPasses; p += 1)
                            {
                                pass = passes[p];

                                mask = (pass.semanticsMask & attributeMask);
                                if (mask !== this.clientStateMask)
                                {
                                    this.enableClientState(mask);
                                }

                                this.setPass(pass);

                                gl.drawArrays(primitive, firstIndex, count);
                            }

                            if (debug)
                            {
                                this.metrics.addPrimitives(primitive, count);
                            }

                            t += 1;
                        }
                        while (t < endInstances);
                    }
                    else
                    {
                        for (p = 0; p < numPasses; p += 1)
                        {
                            pass = passes[p];

                            mask = (pass.semanticsMask & attributeMask);
                            if (mask !== this.clientStateMask)
                            {
                                this.enableClientState(mask);
                            }

                            this.setPass(pass);

                            gl.drawArrays(primitive, firstIndex, count);

                            if (debug)
                            {
                                this.metrics.addPrimitives(primitive, count);
                            }
                        }
                    }
                }
            }
            /* tslint:enable:no-bitwise */
        }

        this.activeIndexBuffer = activeIndexBuffer;
    }

    beginDraw(primitive: number, numVertices: number, formats: any[],
              semantics: Semantics): WebGLVertexWriteIterator
    {
        this.immediatePrimitive = primitive;
        if (numVertices)
        {
            var n;
            var immediateSemantics = this.immediateSemantics;
            var numAttributes = semantics.length;
            immediateSemantics.length = numAttributes;
            for (n = 0; n < numAttributes; n += 1)
            {
                var semantic = semantics[n];
                if (typeof semantic === "string")
                {
                    semantic = this['SEMANTIC_' + semantic];
                }
                immediateSemantics[n] = semantic;
            }

            var immediateVertexBuffer = this.immediateVertexBuffer;

            var oldStride = immediateVertexBuffer.strideInBytes;
            var oldSize = (oldStride * immediateVertexBuffer.numVertices);

            var stride = immediateVertexBuffer.setAttributes(formats);
            if (stride !== oldStride)
            {
                immediateVertexBuffer.numVertices = Math.floor(oldSize / stride);
            }

            var size = (stride * numVertices);
            if (size > oldSize)
            {
                immediateVertexBuffer.resize(size);
            }

            return immediateVertexBuffer.map(0, numVertices);
        }
        return null;
    }

    endDraw(writer)
    {
        var immediateVertexBuffer = this.immediateVertexBuffer;

        var numVerticesWritten = writer.getNumWrittenVertices();

        immediateVertexBuffer.unmap(writer);

        if (numVerticesWritten)
        {
            var gl = this.gl;

            var stride = immediateVertexBuffer.strideInBytes;
            var offset = 0;

            var vertexAttributes = immediateVertexBuffer.attributes;

            var semanticsOffsets = this._semanticsOffsets;

            var semantics = this.immediateSemantics;
            var numSemantics = semantics.length;
            var deltaAttributeMask = 0;
            for (var n = 0; n < numSemantics; n += 1)
            {
                var vertexAttribute = vertexAttributes[n];

                var semantic = semantics[n];

                /* tslint:disable:no-bitwise */
                deltaAttributeMask |= (1 << semantic);
                /* tslint:enable:no-bitwise */

                // Clear semantics offset cache because this VertexBuffer changes formats
                semanticsOffsets[semantic].vertexBuffer = null;

                gl.vertexAttribPointer(semantic,
                                       vertexAttribute.numComponents,
                                       vertexAttribute.format,
                                       vertexAttribute.normalized,
                                       stride,
                                       offset);

                offset += vertexAttribute.stride;
            }
            /* tslint:disable:no-bitwise */
            this.attributeMask |= deltaAttributeMask;
            /* tslint:enable:no-bitwise */

            this.draw(this.immediatePrimitive, numVerticesWritten, 0);
        }
    }

    setViewport(x, y, w, h)
    {
        var currentBox = this.state.viewportBox;
        if (currentBox[0] !== x ||
            currentBox[1] !== y ||
            currentBox[2] !== w ||
            currentBox[3] !== h)
        {
            currentBox[0] = x;
            currentBox[1] = y;
            currentBox[2] = w;
            currentBox[3] = h;
            this.gl.viewport(x, y, w, h);
        }
    }

    setScissor(x, y, w, h)
    {
        var currentBox = this.state.scissorBox;
        if (currentBox[0] !== x ||
            currentBox[1] !== y ||
            currentBox[2] !== w ||
            currentBox[3] !== h)
        {
            currentBox[0] = x;
            currentBox[1] = y;
            currentBox[2] = w;
            currentBox[3] = h;
            this.gl.scissor(x, y, w, h);
        }
    }

    clear(color: number[], depth?: number, stencil?: number)
    {
        var gl = this.gl;
        var state = this.state;

        var clearMask = 0;

        if (color)
        {
            clearMask += gl.COLOR_BUFFER_BIT;

            var currentColor = state.clearColor;
            var color0 = color[0];
            var color1 = color[1];
            var color2 = color[2];
            var color3 = color[3];
            if (currentColor[0] !== color0 ||
                currentColor[1] !== color1 ||
                currentColor[2] !== color2 ||
                currentColor[3] !== color3)
            {
                currentColor[0] = color0;
                currentColor[1] = color1;
                currentColor[2] = color2;
                currentColor[3] = color3;
                gl.clearColor(color0, color1, color2, color3);
            }
        }

        if (typeof depth === 'number')
        {
            clearMask += gl.DEPTH_BUFFER_BIT;

            if (state.clearDepth !== depth)
            {
                state.clearDepth = depth;
                gl.clearDepth(depth);
            }

            if (typeof stencil === 'number')
            {
                clearMask += gl.STENCIL_BUFFER_BIT;

                if (state.clearStencil !== stencil)
                {
                    state.clearStencil = stencil;
                    gl.clearStencil(stencil);
                }
            }
        }

        if (clearMask)
        {
            var colorMask = state.colorMask;
            var colorMaskEnabled = (colorMask[0] || colorMask[1] || colorMask[2] || colorMask[3]);
            var depthMask = state.depthMask;
            var program = state.program;

            if (color)
            {
                if (!colorMaskEnabled)
                {
                    // This is posibly a mistake, enable it for this call
                    gl.colorMask(true, true, true, true);
                }
            }

            if (typeof depth === 'number')
            {
                if (!depthMask)
                {
                    // This is posibly a mistake, enable it for this call
                    gl.depthMask(true);
                }
            }

            if (program)
            {
                gl.useProgram(null);    // Work around for Mac crash bug.
            }

            gl.clear(clearMask);

            if (color)
            {
                if (!colorMaskEnabled)
                {
                    gl.colorMask(false, false, false, false);
                }
            }

            if (typeof depth === 'number')
            {
                if (!depthMask)
                {
                    gl.depthMask(false);
                }
            }

            if (program)
            {
                gl.useProgram(program);
            }
        }
    }

    beginFrame()
    {
        var gl = this.gl;

        this.attributeMask = 0;

        var clientStateMask = this.clientStateMask;
        var n;
        if (clientStateMask)
        {
            for (n = 0; n < 16; n += 1)
            {
                /* tslint:disable:no-bitwise */
                if (clientStateMask & (1 << n))
                {
                    gl.disableVertexAttribArray(n);
                }
                /* tslint:enable:no-bitwise */
            }
            this.clientStateMask = 0;
        }

        this.resetStates();

        var canvas = gl.canvas;
        var width = (gl.drawingBufferWidth || canvas.width);
        var height = (gl.drawingBufferHeight || canvas.height);
        this.width = width;
        this.height = height;

        this.setScissor(0, 0, this.width, this.height);
        this.setViewport(0, 0, this.width, this.height);

        if (debug)
        {
            this.metrics.renderTargetChanges = 0;
            this.metrics.textureChanges = 0;
            this.metrics.renderStateChanges = 0;
            this.metrics.vertexAttributesChanges = 0;
            this.metrics.vertexBufferChanges = 0;
            this.metrics.indexBufferChanges = 0;
            this.metrics.vertexArrayObjectChanges = 0;
            this.metrics.techniqueChanges = 0;
            this.metrics.drawCalls = 0;
            this.metrics.primitives = 0;
        }

        /* tslint:disable:no-string-literal */
        return !(document.hidden || document['webkitHidden']);
        /* tslint:enable:no-string-literal */
    }

    beginRenderTarget(renderTarget: RenderTarget): boolean
    {
        debug.assert(!this.activeRenderTarget,
                     "beginRenderTarget called before calling endRenderTarget on current render target");
        this.activeRenderTarget = <WebGLRenderTarget>renderTarget;

        if (debug)
        {
            this.metrics.renderTargetChanges += 1;
        }

        return (<WebGLRenderTarget>renderTarget).bind();
    }

    endRenderTarget()
    {
        this.activeRenderTarget.unbind();
        this.activeRenderTarget = null;
    }

    beginOcclusionQuery()
    {
        return false;
    }

    /* tslint:disable:no-empty */
    endOcclusionQuery()
    {
    }
    /* tslint:enable:no-empty */

    endFrame()
    {
        var gl = this.gl;
        //gl.flush();

        if (this.activeTechnique)
        {
            this.activeTechnique.deactivate();
            this.activeTechnique = null;
        }

        if (this.activeIndexBuffer)
        {
            this.setIndexBuffer(null);
        }

        var state = this.state;
        if (state.program)
        {
            state.program = null;
            gl.useProgram(null);
        }

        this.numFrames += 1;
        var currentFrameTime = TurbulenzEngine.getTime();
        var diffTime = (currentFrameTime - this.previousFrameTime);
        if (diffTime >= 1000.0)
        {
            this.fps = (this.numFrames / (diffTime * 0.001));
            this.numFrames = 0;
            this.previousFrameTime = currentFrameTime;
        }

        // Remove any references to external technique parameters
        var techniqueParametersArray = this._techniqueParametersArray;
        var n;
        for (n = 0; n < techniqueParametersArray.length; n += 1)
        {
            techniqueParametersArray[n] = null;
        }

        // Reset semantics offsets cache
        var semanticsOffsets = this._semanticsOffsets;
        for (n = 0; n < 16; n += 1)
        {
            semanticsOffsets[n].vertexBuffer = null;
        }

        this.checkFullScreen();
    }

    createTechniqueParameters(params?): WebGLTechniqueParameters
    {
        return WebGLTechniqueParameters.create(params);
    }

    _createTechniqueParametersArray(techniqueParameters: WebGLTechniqueParameters[],
                                    techniqueParametersArray: any[]): number
    {
        var n = 0;
        var numTechniqueParameters = techniqueParameters.length;
        var t;
        for (t = 0; t < numTechniqueParameters; t += 1)
        {
            var tp = techniqueParameters[t];
            for (var p in tp)
            {
                var parameterValues = tp[p];
                if (parameterValues !== undefined)
                {
                    techniqueParametersArray[n] = p;
                    techniqueParametersArray[n + 1] = parameterValues;
                    n += 2;
                }
            }
        }
        return n;
    }

    createSemantics(semantics: any[]): WebGLSemantics
    {
        return WebGLSemantics.create(this, semantics);
    }

    createVertexBuffer(params: VertexBufferParameters): WebGLVertexBuffer
    {
        return WebGLVertexBuffer.create(this, params);
    }

    createIndexBuffer(params: IndexBufferParameters): WebGLIndexBuffer
    {
        return WebGLIndexBuffer.create(this, params);
    }

    createTexture(params: TextureParameters): TZWebGLTexture
    {
        return TZWebGLTexture.create(this, params);
    }

    createVideo(params)
    {
        return WebGLVideo.create(params);
    }

    createShader(params: any, onload?: { (shader: Shader): void; }): TZWebGLShader
    {
        return TZWebGLShader.create(this, params, onload);
    }

    createTechniqueParameterBuffer(params): TechniqueParameterBuffer
    {
        // TOOD: We're returning a float array, which doesn't have all
        // the proprties that are expected.
        return <TechniqueParameterBuffer><any>
            techniqueParameterBufferCreate(params);
    }

    createRenderBuffer(params): WebGLRenderBuffer
    {
        return WebGLRenderBuffer.create(this, params);
    }

    createRenderTarget(params: RenderTargetParameters): WebGLRenderTarget
    {
        return WebGLRenderTarget.create(this, params);
    }

    createOcclusionQuery(): OcclusionQuery
    {
        return null;
    }

    createDrawParameters(): WebGLDrawParameters
    {
        return WebGLDrawParameters.create();
    }

    isSupported(name: string): boolean
    {
        var gl = this.gl;
        if ("OCCLUSION_QUERIES" === name)
        {
            return false;
        }
        else if ("NPOT_MIPMAPPED_TEXTURES" === name)
        {
            return false;
        }
        else if ("TEXTURE_DXT1" === name ||
                 "TEXTURE_DXT3" === name ||
                 "TEXTURE_DXT5" === name)
        {
            var compressedTexturesExtension = this.compressedTexturesExtension;
            if (compressedTexturesExtension)
            {
                var compressedFormats = gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS);
                if (compressedFormats)
                {
                    var requestedFormat;
                    if ("TEXTURE_DXT1" === name)
                    {
                        requestedFormat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                    }
                    else if ("TEXTURE_DXT3" === name)
                    {
                        requestedFormat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                    }
                    else //if ("TEXTURE_DXT5" === name)
                    {
                        requestedFormat = compressedTexturesExtension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                    }
                    var numCompressedFormats = compressedFormats.length;
                    for (var n = 0; n < numCompressedFormats; n += 1)
                    {
                        if (compressedFormats[n] === requestedFormat)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        else if ("TEXTURE_ETC1" === name)
        {
            return false;
        }
        else if ("TEXTURE_FLOAT" === name)
        {
            if (this.floatTextureExtension)
            {
                return true;
            }
            return false;
        }
        else if ("TEXTURE_HALF_FLOAT" === name)
        {
            if (this.halfFloatTextureExtension)
            {
                return true;
            }
            return false;
        }
        else if ("INDEXFORMAT_UINT" === name)
        {
            if (gl.getExtension('OES_element_index_uint'))
            {
                return true;
            }
            return false;
        }
        else if ("FILEFORMAT_WEBM" === name)
        {
            return ("webm" in this.supportedVideoExtensions);
        }
        else if ("FILEFORMAT_MP4" === name ||
                 "FILEFORMAT_M4V" === name)
        {
            return ("mp4" in this.supportedVideoExtensions);
        }
        else if ("FILEFORMAT_JPG" === name)
        {
            return true;
        }
        else if ("FILEFORMAT_PNG" === name)
        {
            return true;
        }
        else if ("FILEFORMAT_DDS" === name)
        {
            return typeof DDSLoader !== 'undefined';
        }
        else if ("FILEFORMAT_TGA" === name)
        {
            return typeof TGALoader !== 'undefined';
        }
        return undefined;
    }

    maxSupported(name: string): number
    {
        var gl = this.gl;
        if ("ANISOTROPY" === name)
        {
            return this.maxAnisotropy;
        }
        else if ("TEXTURE_SIZE" === name)
        {
            return gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }
        else if ("CUBEMAP_TEXTURE_SIZE" === name)
        {
            return gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        }
        else if ("3D_TEXTURE_SIZE" === name)
        {
            return 0;
        }
        else if ("RENDERTARGET_COLOR_TEXTURES" === name)
        {
            if (this.drawBuffersExtension)
            {
                if (this.WEBGL_draw_buffers)
                {
                    return gl.getParameter(this.drawBuffersExtension.MAX_COLOR_ATTACHMENTS_WEBGL);
                }
                else
                {
                    return gl.getParameter(this.drawBuffersExtension.MAX_COLOR_ATTACHMENTS_EXT);
                }
            }
            return 1;
        }
        else if ("RENDERBUFFER_SIZE" === name)
        {
            return gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        }
        else if ("TEXTURE_UNITS" === name)
        {
            return gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }
        else if ("VERTEX_TEXTURE_UNITS" === name)
        {
            return gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        }
        else if ("VERTEX_SHADER_PRECISION" === name ||
                 "FRAGMENT_SHADER_PRECISION" === name)
        {
            var shaderType;
            if ("VERTEX_SHADER_PRECISION" === name)
            {
                shaderType = gl.VERTEX_SHADER;

            }
            else
            {
                shaderType = gl.FRAGMENT_SHADER;
            }

            if (!gl.getShaderPrecisionFormat)
            {
                return 0;
            }

            var sp = gl.getShaderPrecisionFormat(shaderType, gl.HIGH_FLOAT);
            if (!sp || !sp.precision)
            {
                sp = gl.getShaderPrecisionFormat(shaderType, gl.MEDIUM_FLOAT);
                if (!sp || !sp.precision)
                {
                    sp = gl.getShaderPrecisionFormat(shaderType, gl.LOW_FLOAT);
                    if (!sp || !sp.precision)
                    {
                        return 0;
                    }
                }
            }
            return sp.precision;
        }
        return 0;
    }

    loadTexturesArchive(params: TextureArchiveParams)
    {
        var src = params.src;
        if (typeof TARLoader !== 'undefined')
        {
            TARLoader.create({
                gd: this,
                src : src,
                mipmaps : params.mipmaps,
                ontextureload : function tarTextureLoadedFn(texture)
                {
                    params.ontextureload(texture);
                },
                onload : function tarLoadedFn(success, status)
                {
                    if (params.onload)
                    {
                        params.onload(success, status);
                    }
                },
                onerror : function tarFailedFn(status)
                {
                    if (params.onload)
                    {
                        params.onload(false, status);
                    }
                }
            });
            return true;
        }
        else
        {
            (<WebGLTurbulenzEngine>TurbulenzEngine).callOnError(
                'Missing archive loader required for ' + src);
            return false;
        }
    }

    getScreenshot(compress: boolean, x?: number, y?: number,
                  width?: number, height?: number): any
    {
        var gl = this.gl;
        var canvas = gl.canvas;

        if (compress)
        {
            return canvas.toDataURL('image/jpeg');
        }
        else
        {
            if (x === undefined)
            {
                x = 0;
            }

            if (y === undefined)
            {
                y = 0;
            }

            var target : { width: number; height: number; } =
                this.activeRenderTarget;
            if (!target)
            {
                target = canvas;
            }

            if (width === undefined)
            {
                width = target.width;
            }

            if (height === undefined)
            {
                height = target.height;
            }

            var pixels = new Uint8Array(4 * width * height);

            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

            return pixels;
        }
    }

    flush()
    {
        this.gl.flush();
    }

    finish()
    {
        this.gl.finish();
    }

    // private
    _drawArraySortPositive(a, b)
    {
        return (b.sortKey - a.sortKey);
    }

    _drawArraySortNegative(a, b)
    {
        return (a.sortKey - b.sortKey);
    }

    checkFullScreen()
    {
        var fullscreen = this.fullscreen;
        if (this.oldFullscreen !== fullscreen)
        {
            this.oldFullscreen = fullscreen;

            this.requestFullScreen(fullscreen);
        }
    }

    requestFullScreen(fullscreen: boolean): boolean
    {
        if (fullscreen)
        {
            var canvas = this.gl.canvas;
            if (canvas.webkitRequestFullScreenWithKeys)
            {
                canvas.webkitRequestFullScreenWithKeys();
            }
            else if (canvas.requestFullScreenWithKeys)
            {
                canvas.requestFullScreenWithKeys();
            }
            else if (canvas.webkitRequestFullScreen)
            {
                canvas.webkitRequestFullScreen(canvas.ALLOW_KEYBOARD_INPUT);
            }
            else if (canvas.mozRequestFullScreen)
            {
                canvas.mozRequestFullScreen();
            }
            else if (canvas.msRequestFullscreen)
            {
                canvas.msRequestFullscreen();
            }
            else if (canvas.requestFullScreen)
            {
                canvas.requestFullScreen();
            }
            else if (canvas.requestFullscreen)
            {
                canvas.requestFullscreen();
            }
        }
        else
        {
            /* tslint:disable:no-string-literal */
            if (document.webkitCancelFullScreen)
            {
                document.webkitCancelFullScreen();
            }
            else if (document['mozCancelFullScreen'])
            {
                document['mozCancelFullScreen']();
            }
            else if (document.msExitFullscreen)
            {
                document.msExitFullscreen();
            }
            else if (document.cancelFullScreen)
            {
                document.cancelFullScreen();
            }
            else if (document.exitFullscreen)
            {
                document.exitFullscreen();
            }
            /* tslint:enable:no-string-literal */
        }
        return true;
    }

    createSampler(sampler)
    {
        var samplerKey = sampler.minFilter.toString() +
                   ':' + sampler.magFilter.toString() +
                   ':' + sampler.wrapS.toString() +
                   ':' + sampler.wrapT.toString() +
                   ':' + sampler.wrapR.toString() +
                   ':' + sampler.maxAnisotropy.toString();

        var cachedSamplers = this.cachedSamplers;
        var cachedSampler = cachedSamplers[samplerKey];
        if (!cachedSampler)
        {
            cachedSamplers[samplerKey] = sampler;
            return sampler;
        }
        return cachedSampler;
    }

    unsetIndexBuffer(indexBuffer)
    {
        if (this.activeIndexBuffer === indexBuffer)
        {
            this.activeIndexBuffer = null;
            var gl = this.gl;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    bindVertexBuffer(buffer)
    {
        if (this.bindedVertexBuffer !== buffer)
        {
            this.bindedVertexBuffer = buffer;
            var gl = this.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            if (debug)
            {
                this.metrics.vertexBufferChanges += 1;
            }
        }
    }

    unbindVertexBuffer(buffer)
    {
        if (this.bindedVertexBuffer === buffer)
        {
            this.bindedVertexBuffer = null;
            var gl = this.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
    }

    bindTextureUnit(unit, target, texture)
    {
        var state = this.state;
        var gl = this.gl;

        if (state.activeTextureUnit !== unit)
        {
            state.activeTextureUnit = unit;
            gl.activeTexture(gl.TEXTURE0 + unit);
        }
        gl.bindTexture(target, texture);
    }

    bindTexture(target, texture)
    {
        var state = this.state;
        var gl = this.gl;

        var dummyUnit = (state.maxTextureUnit - 1);
        if (state.activeTextureUnit !== dummyUnit)
        {
            state.activeTextureUnit = dummyUnit;
            gl.activeTexture(gl.TEXTURE0 + dummyUnit);
        }
        gl.bindTexture(target, texture);
    }

    unbindTexture(texture)
    {
        var state = this.state;
        var lastMaxTextureUnit = state.lastMaxTextureUnit;
        var textureUnits = state.textureUnits;
        for (var u = 0; u < lastMaxTextureUnit; u += 1)
        {
            var textureUnit = textureUnits[u];
            if (textureUnit.texture === texture)
            {
                textureUnit.texture = null;
                this.bindTextureUnit(u, textureUnit.target, null);
            }
        }
    }

    setSampler(sampler, target)
    {
        if (sampler)
        {
            var gl = this.gl;

            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, sampler.minFilter);
            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, sampler.magFilter);
            gl.texParameteri(target, gl.TEXTURE_WRAP_S, sampler.wrapS);
            gl.texParameteri(target, gl.TEXTURE_WRAP_T, sampler.wrapT);
            /*
            if (sSupports3DTextures)
            {
                gl.texParameteri(target, gl.TEXTURE_WRAP_R, sampler.wrapR);
            }
            */
            if (this.TEXTURE_MAX_ANISOTROPY_EXT)
            {
                gl.texParameteri(target, this.TEXTURE_MAX_ANISOTROPY_EXT, sampler.maxAnisotropy);
            }
        }
    }

    setPass(pass)
    {
        var gl = this.gl;
        var state = this.state;

        // Set renderstates
        var renderStatesSet = pass.statesSet;
        var renderStates = pass.states;
        var numRenderStates = renderStates.length;
        var r, renderState;
        for (r = 0; r < numRenderStates; r += 1)
        {
            renderState = renderStates[r];
            renderState.set.apply(renderState, renderState.values);
        }

        // Reset previous renderstates
        var renderStatesToReset = state.renderStatesToReset;
        var numRenderStatesToReset = renderStatesToReset.length;
        for (r = 0; r < numRenderStatesToReset; r += 1)
        {
            renderState = renderStatesToReset[r];
            if (!(renderState.name in renderStatesSet))
            {
                renderState.reset();
            }
        }

        // Copy set renderstates to be reset later
        state.renderStatesToReset = renderStates;

        // Reset texture units
        var lastMaxTextureUnit = state.lastMaxTextureUnit;
        var textureUnits = state.textureUnits;
        var currentMaxTextureUnit = pass.numTextureUnits;
        if (currentMaxTextureUnit < lastMaxTextureUnit)
        {
            var u = currentMaxTextureUnit;
            do
            {
                var textureUnit = textureUnits[u];
                if (textureUnit.texture)
                {
                    textureUnit.texture = null;
                    this.bindTextureUnit(u, textureUnit.target, null);
                }
                u += 1;
            }
            while (u < lastMaxTextureUnit);
        }
        state.lastMaxTextureUnit = currentMaxTextureUnit;

        var program = pass.glProgram;
        if (state.program !== program)
        {
            state.program = program;
            gl.useProgram(program);
        }

        if (pass.dirty)
        {
            pass.updateParametersData(this);
        }
    }

    enableClientState(mask)
    {
        var gl = this.gl;

        var oldMask = this.clientStateMask;
        this.clientStateMask = mask;

        /* tslint:disable:no-bitwise */
        var disableMask = (oldMask & (~mask));
        var enableMask  = ((~oldMask) & mask);
        var n;

        if (disableMask)
        {
            if ((disableMask & 0xff) === 0)
            {
                disableMask >>= 8;
                n = 8;
            }
            else
            {
                n = 0;
            }
            do
            {
                if (0 !== (0x01 & disableMask))
                {
                    gl.disableVertexAttribArray(n);
                }
                n += 1;
                disableMask >>= 1;
            }
            while (disableMask);
        }

        if (enableMask)
        {
            if ((enableMask & 0xff) === 0)
            {
                enableMask >>= 8;
                n = 8;
            }
            else
            {
                n = 0;
            }
            do
            {
                if (0 !== (0x01 & enableMask))
                {
                    gl.enableVertexAttribArray(n);
                }
                n += 1;
                enableMask >>= 1;
            }
            while (enableMask);
        }
        /* tslint:enable:no-bitwise */
    }

    setTexture(textureUnitIndex, texture, sampler)
    {
        var state = this.state;
        var gl = this.gl;

        var textureUnit = state.textureUnits[textureUnitIndex];
        var oldgltarget = textureUnit.target;
        var oldglobject = textureUnit.texture;

        if (texture)
        {
            var gltarget = texture.target;
            var globject = texture.glTexture;
            if (oldglobject !== globject ||
                oldgltarget !== gltarget)
            {
                textureUnit.target = gltarget;
                textureUnit.texture = globject;

                if (state.activeTextureUnit !== textureUnitIndex)
                {
                    state.activeTextureUnit = textureUnitIndex;
                    gl.activeTexture(gl.TEXTURE0 + textureUnitIndex);
                }

                if (oldgltarget !== gltarget &&
                    oldglobject)
                {
                    gl.bindTexture(oldgltarget, null);
                }

                gl.bindTexture(gltarget, globject);

                if (texture.sampler !== sampler)
                {
                    texture.sampler = sampler;

                    this.setSampler(sampler, gltarget);
                }

                if (debug)
                {
                    this.metrics.textureChanges += 1;
                }
            }
        }
        else
        {
            if (oldgltarget &&
                oldglobject)
            {
                textureUnit.target = 0;
                textureUnit.texture = null;

                if (state.activeTextureUnit !== textureUnitIndex)
                {
                    state.activeTextureUnit = textureUnitIndex;
                    gl.activeTexture(gl.TEXTURE0 + textureUnitIndex);
                }

                gl.bindTexture(oldgltarget, null);
            }
        }
    }

    setProgram(program)
    {
        var state = this.state;
        if (state.program !== program)
        {
            state.program = program;
            this.gl.useProgram(program);
        }
    }

    syncState()
    {
        var state = this.state;
        var gl = this.gl;

        if (state.depthTestEnable)
        {
            gl.enable(gl.DEPTH_TEST);
        }
        else
        {
            gl.disable(gl.DEPTH_TEST);
        }

        gl.depthFunc(state.depthFunc);

        gl.depthMask(state.depthMask);

        if (state.blendEnable)
        {
            gl.enable(gl.BLEND);
        }
        else
        {
            gl.disable(gl.BLEND);
        }

        gl.blendFunc(state.blendSrc, state.blendDst);

        if (state.cullFaceEnable)
        {
            gl.enable(gl.CULL_FACE);
        }
        else
        {
            gl.disable(gl.CULL_FACE);
        }

        gl.cullFace(state.cullFace);

        gl.frontFace(state.frontFace);

        var colorMask = state.colorMask;
        gl.colorMask(colorMask[0], colorMask[1], colorMask[2], colorMask[3]);

        if (state.stencilTestEnable)
        {
            gl.enable(gl.STENCIL_TEST);
        }
        else
        {
            gl.disable(gl.STENCIL_TEST);
        }

        gl.stencilFunc(state.stencilFunc, state.stencilRef, state.stencilMask);

        gl.stencilOp(state.stencilFail, state.stencilZFail, state.stencilZPass);

        if (state.polygonOffsetFillEnable)
        {
            gl.enable(gl.POLYGON_OFFSET_FILL);
        }
        else
        {
            gl.disable(gl.POLYGON_OFFSET_FILL);
        }

        gl.polygonOffset(state.polygonOffsetFactor, state.polygonOffsetUnits);

        gl.lineWidth(state.lineWidth);

        gl.activeTexture(gl.TEXTURE0 + state.activeTextureUnit);

        var currentBox = this.state.viewportBox;
        gl.viewport(currentBox[0], currentBox[1], currentBox[2], currentBox[3]);

        currentBox = this.state.scissorBox;
        gl.scissor(currentBox[0], currentBox[1], currentBox[2], currentBox[3]);

        var currentColor = state.clearColor;
        gl.clearColor(currentColor[0], currentColor[1], currentColor[2], currentColor[3]);

        gl.clearDepth(state.clearDepth);

        gl.clearStencil(state.clearStencil);
    }

    resetStates()
    {
        var state = this.state;

        var lastMaxTextureUnit = state.lastMaxTextureUnit;
        var textureUnits = state.textureUnits;
        for (var u = 0; u < lastMaxTextureUnit; u += 1)
        {
            var textureUnit = textureUnits[u];
            if (textureUnit.texture)
            {
                this.bindTextureUnit(u, textureUnit.target, null);
                textureUnit.texture = null;
                textureUnit.target = 0;
            }
        }
    }

    destroy()
    {
        delete this.activeTechnique;
        delete this.activeIndexBuffer;
        delete this.bindedVertexBuffer;

        if (this.immediateVertexBuffer)
        {
            this.immediateVertexBuffer.destroy();
            delete this.immediateVertexBuffer;
        }

        delete this.gl;

        if (typeof DDSLoader !== 'undefined')
        {
            DDSLoader.destroy();
        }
    }

    static create(canvas, params) : WebGLGraphicsDevice
    {
        var getAvailableContext = function getAvailableContextFn
        (canvas: any, params: any, contextList: any[])
        {
            if (canvas.getContext)
            {
                var canvasParams = {
                    alpha: false,
                    depth: true,
                    stencil: true,
                    antialias: false
                };

                var multisample = params.multisample;
                if (multisample !== undefined && 1 < multisample)
                {
                    canvasParams.antialias = true;
                }

                var alpha = params.alpha;
                if (alpha)
                {
                    canvasParams.alpha = true;
                }

                if (params.depth === false)
                {
                    canvasParams.depth = false;
                }

                if (params.stencil === false)
                {
                    canvasParams.stencil = false;
                }

                var numContexts = contextList.length, i;
                for (i = 0; i < numContexts; i += 1)
                {
                    try
                    {
                        var context = canvas.getContext(contextList[i], canvasParams);
                        if (context)
                        {
                            return context;
                        }
                    }
                    /* tslint:disable:no-empty */
                    catch (ex)
                    {
                    }
                    /* tslint:enable:no-empty */
                }
            }
            return null;
        };

        // TODO: Test if we can also use "webkit-3d" and "moz-webgl"
        var gl = getAvailableContext(canvas, params, ['webgl', 'experimental-webgl']);
        if (!gl)
        {
            return null;
        }

        var width = (gl.drawingBufferWidth || canvas.width);
        var height = (gl.drawingBufferHeight || canvas.height);

        gl.enable(gl.SCISSOR_TEST);
        gl.depthRange(0.0, 1.0);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);

        var gd = new WebGLGraphicsDevice();
        gd.gl = gl;
        gd.width = width;
        gd.height = height;

        var extensions = gl.getSupportedExtensions();

        var extensionsMap = {};
        var numExtensions = extensions.length;
        var n;
        for (n = 0; n < numExtensions; n += 1)
        {
            extensionsMap[extensions[n]] = true;
        }

        if (extensions)
        {
            extensions = extensions.join(' ');
        }
        else
        {
            extensions = '';
        }
        gd.extensions = extensions;
        gd.shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        gd.rendererVersion = gl.getParameter(gl.VERSION);
        gd.renderer = gl.getParameter(gl.RENDERER);
        gd.vendor = gl.getParameter(gl.VENDOR);

        /* tslint:disable:no-string-literal */
        if (extensionsMap['WEBGL_compressed_texture_s3tc'])
        {
            gd.WEBGL_compressed_texture_s3tc = true;
            gd.compressedTexturesExtension = gl.getExtension('WEBGL_compressed_texture_s3tc');
        }
        else if (extensionsMap['WEBKIT_WEBGL_compressed_texture_s3tc'])
        {
            gd.WEBGL_compressed_texture_s3tc = true;
            gd.compressedTexturesExtension = gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
        }
        else if (extensionsMap['MOZ_WEBGL_compressed_texture_s3tc'])
        {
            gd.WEBGL_compressed_texture_s3tc = true;
            gd.compressedTexturesExtension = gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc');
        }
        else if (extensionsMap['WEBKIT_WEBGL_compressed_textures'])
        {
            gd.compressedTexturesExtension = gl.getExtension('WEBKIT_WEBGL_compressed_textures');
        }

        var anisotropyExtension;
        if (extensionsMap['EXT_texture_filter_anisotropic'])
        {
            anisotropyExtension = gl.getExtension('EXT_texture_filter_anisotropic');
        }
        else if (extensionsMap['MOZ_EXT_texture_filter_anisotropic'])
        {
            anisotropyExtension = gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
        }
        else if (extensionsMap['WEBKIT_EXT_texture_filter_anisotropic'])
        {
            anisotropyExtension = gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
        }
        if (anisotropyExtension)
        {
            gd.TEXTURE_MAX_ANISOTROPY_EXT = anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT;
            gd.maxAnisotropy = gl.getParameter(anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        }
        else
        {
            gd.maxAnisotropy = 1;
        }

        // Enable OES_element_index_uint extension
        gl.getExtension('OES_element_index_uint');

        if (extensionsMap['WEBGL_draw_buffers'])
        {
            gd.WEBGL_draw_buffers = true;
            gd.drawBuffersExtension = gl.getExtension('WEBGL_draw_buffers');
        }
        else if (extensionsMap['EXT_draw_buffers'])
        {
            gd.drawBuffersExtension = gl.getExtension('EXT_draw_buffers');
        }
        /* tslint:enable:no-string-literal */

        // Enagle OES_texture_float extension
        if (extensionsMap['OES_texture_float'])
        {
            gd.floatTextureExtension = gl.getExtension('OES_texture_float');
        }
        if (extensionsMap['WEBGL_color_buffer_float'])
        {
            gd.floatTextureExtension = gl.getExtension('WEBGL_color_buffer_float');
        }

        // Enagle OES_texture_float extension
        if (extensionsMap['OES_texture_half_float'])
        {
            gd.halfFloatTextureExtension = gl.getExtension('OES_texture_half_float');
        }
        if (extensionsMap['WEBGL_color_buffer_half_float'])
        {
            gl.getExtension('WEBGL_color_buffer_half_float');
        }

        // Enagle OES_vertex_array_object extension
        if (extensionsMap['OES_vertex_array_object'])
        {
            gd.vertexArrayObjectExtension = gl.getExtension('OES_vertex_array_object');
            gd.drawArray = gd.drawArrayVAO;
        }

        if (extensionsMap['WEBGL_debug_renderer_info'])
        {
            var debugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
            gd.vendor = gl.getParameter(debugRendererInfo.UNMASKED_VENDOR_WEBGL);
            gd.renderer = gl.getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL);
        }

        var proto = WebGLGraphicsDevice.prototype;

        proto.PRIMITIVE_POINTS         = gl.POINTS;
        proto.PRIMITIVE_LINES          = gl.LINES;
        proto.PRIMITIVE_LINE_LOOP      = gl.LINE_LOOP;
        proto.PRIMITIVE_LINE_STRIP     = gl.LINE_STRIP;
        proto.PRIMITIVE_TRIANGLES      = gl.TRIANGLES;
        proto.PRIMITIVE_TRIANGLE_STRIP = gl.TRIANGLE_STRIP;
        proto.PRIMITIVE_TRIANGLE_FAN   = gl.TRIANGLE_FAN;

        proto.INDEXFORMAT_UBYTE  = gl.UNSIGNED_BYTE;
        proto.INDEXFORMAT_USHORT = gl.UNSIGNED_SHORT;
        proto.INDEXFORMAT_UINT   = gl.UNSIGNED_INT;

        // Detect IE11 partial WebGL implementation...
        var ieVersionIndex = (gd.vendor === 'Microsoft' ? gd.rendererVersion.indexOf('0.9') : -1);
        if (-1 !== ieVersionIndex)
        {
            gd.fixIE = gd.rendererVersion.substr(ieVersionIndex, 4);
        }
        else
        {
            gd.fixIE = null;
        }

        var getNormalizationScale = function getNormalizationScaleFn(format)
        {
            if (format === gl.BYTE)
            {
                return 0x7f;
            }
            else if (format === gl.UNSIGNED_BYTE)
            {
                return 0xff;
            }
            else if (format === gl.SHORT)
            {
                return 0x7fff;
            }
            else if (format === gl.UNSIGNED_SHORT)
            {
                return 0xffff;
            }
            else if (format === gl.INT)
            {
                return 0x7fffffff;
            }
            else if (format === gl.UNSIGNED_INT)
            {
                return 0xffffffff;
            }
            else //if (format === gl.FLOAT)
            {
                return 1;
            }
        };

        var makeVertexformat =
            function makeVertexformatFn(n, c, s, f, name)
        : WebGLGraphicsDeviceVertexFormat
        {
            var attributeFormat = {
                numComponents: c,
                stride: s,
                componentStride: (s / c),
                format: f,
                name: name,
                normalized: undefined,
                normalizationScale: undefined,
                typedSetter: undefined,
                typedArray: undefined,
            };
            if (n)
            {
                attributeFormat.normalized = true;
                attributeFormat.normalizationScale = getNormalizationScale(f);
            }
            else
            {
                attributeFormat.normalized = false;
                attributeFormat.normalizationScale = 1;
            }

            if (typeof DataView !== 'undefined' && 'setFloat32' in DataView.prototype)
            {
                if (f === gl.BYTE)
                {
                    attributeFormat.typedSetter = DataView.prototype.setInt8;
                }
                else if (f === gl.UNSIGNED_BYTE)
                {
                    attributeFormat.typedSetter = DataView.prototype.setUint8;
                }
                else if (f === gl.SHORT)
                {
                    attributeFormat.typedSetter = DataView.prototype.setInt16;
                }
                else if (f === gl.UNSIGNED_SHORT)
                {
                    attributeFormat.typedSetter = DataView.prototype.setUint16;
                }
                else if (f === gl.INT)
                {
                    attributeFormat.typedSetter = DataView.prototype.setInt32;
                }
                else if (f === gl.UNSIGNED_INT)
                {
                    attributeFormat.typedSetter = DataView.prototype.setUint32;
                }
                else //if (f === gl.FLOAT)
                {
                    attributeFormat.typedSetter = DataView.prototype.setFloat32;
                }
            }
            else
            {
                if (f === gl.BYTE)
                {
                    attributeFormat.typedArray = Int8Array;
                }
                else if (f === gl.UNSIGNED_BYTE)
                {
                    attributeFormat.typedArray = Uint8Array;
                }
                else if (f === gl.SHORT)
                {
                    attributeFormat.typedArray = Int16Array;
                }
                else if (f === gl.UNSIGNED_SHORT)
                {
                    attributeFormat.typedArray = Uint16Array;
                }
                else if (f === gl.INT)
                {
                    attributeFormat.typedArray = Int32Array;
                }
                else if (f === gl.UNSIGNED_INT)
                {
                    attributeFormat.typedArray = Uint32Array;
                }
                else //if (f === gl.FLOAT)
                {
                    attributeFormat.typedArray = Float32Array;
                }
            }
            return attributeFormat;
        };


        if (gd.fixIE && gd.fixIE < "0.94")
        {
            proto.VERTEXFORMAT_BYTE4    = makeVertexformat(0, 4,  16, gl.FLOAT, 'BYTE4');
            proto.VERTEXFORMAT_UBYTE4   = makeVertexformat(0, 4,  16, gl.FLOAT, 'UBYTE4');
            proto.VERTEXFORMAT_SHORT2   = makeVertexformat(0, 2,   8, gl.FLOAT, 'SHORT2');
            proto.VERTEXFORMAT_SHORT4   = makeVertexformat(0, 4,  16, gl.FLOAT, 'SHORT4');
            proto.VERTEXFORMAT_USHORT2  = makeVertexformat(0, 2,   8, gl.FLOAT, 'USHORT2');
            proto.VERTEXFORMAT_USHORT4  = makeVertexformat(0, 4,  16, gl.FLOAT, 'USHORT4');
        }
        else
        {
            proto.VERTEXFORMAT_BYTE4    = makeVertexformat(0, 4,  4, gl.BYTE, 'BYTE4');
            proto.VERTEXFORMAT_UBYTE4   = makeVertexformat(0, 4,  4, gl.UNSIGNED_BYTE, 'UBYTE4');
            proto.VERTEXFORMAT_SHORT2   = makeVertexformat(0, 2,  4, gl.SHORT, 'SHORT2');
            proto.VERTEXFORMAT_SHORT4   = makeVertexformat(0, 4,  8, gl.SHORT, 'SHORT4');
            proto.VERTEXFORMAT_USHORT2  = makeVertexformat(0, 2,  4, gl.UNSIGNED_SHORT, 'USHORT2');
            proto.VERTEXFORMAT_USHORT4  = makeVertexformat(0, 4,  8, gl.UNSIGNED_SHORT, 'USHORT4');
        }
        if (gd.fixIE && gd.fixIE < "0.93")
        {
            proto.VERTEXFORMAT_BYTE4N   = makeVertexformat(0, 4,  16, gl.FLOAT, 'BYTE4N');
            proto.VERTEXFORMAT_UBYTE4N  = makeVertexformat(0, 4,  16, gl.FLOAT, 'UBYTE4N');
            proto.VERTEXFORMAT_SHORT2N  = makeVertexformat(0, 2,   8, gl.FLOAT, 'SHORT2N');
            proto.VERTEXFORMAT_SHORT4N  = makeVertexformat(0, 4,  16, gl.FLOAT, 'SHORT4N');
            proto.VERTEXFORMAT_USHORT2N = makeVertexformat(0, 2,   8, gl.FLOAT, 'USHORT2N');
            proto.VERTEXFORMAT_USHORT4N = makeVertexformat(0, 4,  16, gl.FLOAT, 'USHORT4N');
        }
        else
        {
            proto.VERTEXFORMAT_BYTE4N   = makeVertexformat(1, 4,  4, gl.BYTE, 'BYTE4N');
            proto.VERTEXFORMAT_UBYTE4N  = makeVertexformat(1, 4,  4, gl.UNSIGNED_BYTE, 'UBYTE4N');
            proto.VERTEXFORMAT_SHORT2N  = makeVertexformat(1, 2,  4, gl.SHORT, 'SHORT2N');
            proto.VERTEXFORMAT_SHORT4N  = makeVertexformat(1, 4,  8, gl.SHORT, 'SHORT4N');
            proto.VERTEXFORMAT_USHORT2N = makeVertexformat(1, 2,  4, gl.UNSIGNED_SHORT, 'USHORT2N');
            proto.VERTEXFORMAT_USHORT4N = makeVertexformat(1, 4,  8, gl.UNSIGNED_SHORT, 'USHORT4N');
        }
        proto.VERTEXFORMAT_FLOAT1   = makeVertexformat(0, 1,  4, gl.FLOAT, 'FLOAT1');
        proto.VERTEXFORMAT_FLOAT2   = makeVertexformat(0, 2,  8, gl.FLOAT, 'FLOAT2');
        proto.VERTEXFORMAT_FLOAT3   = makeVertexformat(0, 3, 12, gl.FLOAT, 'FLOAT3');
        proto.VERTEXFORMAT_FLOAT4   = makeVertexformat(0, 4, 16, gl.FLOAT, 'FLOAT4');


        var maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        if (maxAttributes < 16)
        {
            proto.SEMANTIC_ATTR0 =
            proto.SEMANTIC_POSITION =
            proto.SEMANTIC_POSITION0 = 0;

            proto.SEMANTIC_ATTR1 =
            proto.SEMANTIC_BLENDWEIGHT =
            proto.SEMANTIC_BLENDWEIGHT0 = 1;

            proto.SEMANTIC_ATTR2 =
            proto.SEMANTIC_NORMAL =
            proto.SEMANTIC_NORMAL0 = 2;

            proto.SEMANTIC_ATTR3 =
            proto.SEMANTIC_COLOR =
            proto.SEMANTIC_COLOR0 = 3;

            proto.SEMANTIC_ATTR7 =
            proto.SEMANTIC_BLENDINDICES =
            proto.SEMANTIC_BLENDINDICES0 = 4;

            proto.SEMANTIC_ATTR8 =
            proto.SEMANTIC_TEXCOORD =
            proto.SEMANTIC_TEXCOORD0 = 5;

            proto.SEMANTIC_ATTR9 =
            proto.SEMANTIC_TEXCOORD1 = 6;

            proto.SEMANTIC_ATTR14 =
            proto.SEMANTIC_TEXCOORD6 =
            proto.SEMANTIC_TANGENT =
            proto.SEMANTIC_TANGENT0 = 7;

            proto.SEMANTIC_ATTR15 =
            proto.SEMANTIC_TEXCOORD7 =
            proto.SEMANTIC_BINORMAL0 =
            proto.SEMANTIC_BINORMAL = 8;

            proto.SEMANTIC_ATTR10 =
            proto.SEMANTIC_TEXCOORD2 = 9;

            proto.SEMANTIC_ATTR11 =
            proto.SEMANTIC_TEXCOORD3 = 10;

            proto.SEMANTIC_ATTR12 =
            proto.SEMANTIC_TEXCOORD4 = 11;

            proto.SEMANTIC_ATTR13 =
            proto.SEMANTIC_TEXCOORD5 = 12;

            proto.SEMANTIC_ATTR4 =
            proto.SEMANTIC_COLOR1 =
            proto.SEMANTIC_SPECULAR = 13;

            proto.SEMANTIC_ATTR5 =
            proto.SEMANTIC_FOGCOORD =
            proto.SEMANTIC_TESSFACTOR = 14;

            proto.SEMANTIC_ATTR6 =
            proto.SEMANTIC_PSIZE =
            proto.SEMANTIC_PSIZE0 = 15;
        }

        proto.DEFAULT_SAMPLER = {
            minFilter : gl.LINEAR_MIPMAP_LINEAR,
            magFilter : gl.LINEAR,
            wrapS : gl.REPEAT,
            wrapT : gl.REPEAT,
            wrapR : gl.REPEAT,
            maxAnisotropy : 1
        };

        gd.cachedSamplers = {};

        var maxTextureUnit = 1;
        var maxUnit = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        if (maxTextureUnit < maxUnit)
        {
            maxTextureUnit = maxUnit;
        }
        maxUnit = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        if (maxTextureUnit < maxUnit)
        {
            maxTextureUnit = maxUnit;
        }

        var textureUnits = [];
        textureUnits.length = maxTextureUnit;
        for (var t = 0; t < maxTextureUnit; t += 1)
        {
            textureUnits[t] = {
                texture: null,
                target: 0
            };
        }

        var defaultDepthFunc = gl.LEQUAL;
        var defaultBlendFuncSrc = gl.SRC_ALPHA;
        var defaultBlendFuncDst = gl.ONE_MINUS_SRC_ALPHA;
        var defaultCullFace = gl.BACK;
        var defaultFrontFace = gl.CCW;
        var defaultStencilFunc = gl.ALWAYS;
        var defaultStencilOp = gl.KEEP;

        var currentState = {
            depthTestEnable         : true,
            blendEnable             : false,
            cullFaceEnable          : true,
            stencilTestEnable       : false,
            polygonOffsetFillEnable : false,
            depthMask               : true,
            depthFunc               : defaultDepthFunc,
            blendSrc                : defaultBlendFuncSrc,
            blendDst                : defaultBlendFuncDst,
            cullFace                : defaultCullFace,
            frontFace               : defaultFrontFace,
            colorMask               : [true, true, true, true],
            stencilFunc             : defaultStencilFunc,
            stencilRef              : 0,
            stencilMask             : 0xffffffff,
            stencilFail             : defaultStencilOp,
            stencilZFail            : defaultStencilOp,
            stencilZPass            : defaultStencilOp,
            polygonOffsetFactor     : 0,
            polygonOffsetUnits      : 0,
            lineWidth               : 1,

            renderStatesToReset : [],

            viewportBox : [0, 0, width, height],
            scissorBox  : [0, 0, width, height],

            clearColor   : [0, 0, 0, 1],
            clearDepth   : 1.0,
            clearStencil : 0,

            activeTextureUnit : 0,
            maxTextureUnit    : maxTextureUnit,
            lastMaxTextureUnit: 0,
            textureUnits      : textureUnits,

            program : null
        };
        gd.state = currentState;

        gd.counters = <WebGLCreationCounters>{
            textures: 0,
            vertexBuffers: 0,
            indexBuffers: 0,
            renderTargets: 0,
            renderBuffers: 0,
            shaders: 0,
            techniques: 0
        };

        /* tslint:disable:no-bitwise */
        if (debug)
        {
            gd.metrics = <WebGLMetrics>{
                renderTargetChanges: 0,
                textureChanges: 0,
                renderStateChanges: 0,
                vertexAttributesChanges: 0,
                vertexBufferChanges: 0,
                indexBufferChanges: 0,
                vertexArrayObjectChanges: 0,
                techniqueChanges: 0,
                drawCalls: 0,
                primitives: 0,

                addPrimitives: function addPrimitivesFn(primitive: number, count: number)
                {
                    this.drawCalls += 1;
                    switch (primitive)
                    {
                    case 0x0000: //POINTS
                        this.primitives += count;
                        break;
                    case 0x0001: //LINES
                        this.primitives += (count >> 1);
                        break;
                    case 0x0002: //LINE_LOOP
                        this.primitives += count;
                        break;
                    case 0x0003: //LINE_STRIP
                        this.primitives += count - 1;
                        break;
                    case 0x0004: //TRIANGLES
                        this.primitives += (count / 3) | 0;
                        break;
                    case 0x0005: //TRIANGLE_STRIP
                        this.primitives += count - 2;
                        break;
                    case 0x0006: //TRIANGLE_FAN
                        this.primitives += count - 2;
                        break;
                    }
                }
            };
        }
        /* tslint:enable:no-bitwise */

        // State handlers
        function setDepthTestEnable(enable)
        {
            if (currentState.depthTestEnable !== enable)
            {
                currentState.depthTestEnable = enable;
                if (enable)
                {
                    gl.enable(gl.DEPTH_TEST);
                }
                else
                {
                    gl.disable(gl.DEPTH_TEST);
                }

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setDepthFunc(func)
        {
            if (currentState.depthFunc !== func)
            {
                currentState.depthFunc = func;
                gl.depthFunc(func);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setDepthMask(enable)
        {
            if (currentState.depthMask !== enable)
            {
                currentState.depthMask = enable;
                gl.depthMask(enable);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setBlendEnable(enable)
        {
            if (currentState.blendEnable !== enable)
            {
                currentState.blendEnable = enable;
                if (enable)
                {
                    gl.enable(gl.BLEND);
                }
                else
                {
                    gl.disable(gl.BLEND);
                }

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setBlendFunc(src, dst)
        {
            if (currentState.blendSrc !== src || currentState.blendDst !== dst)
            {
                currentState.blendSrc = src;
                currentState.blendDst = dst;
                gl.blendFunc(src, dst);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setCullFaceEnable(enable)
        {
            if (currentState.cullFaceEnable !== enable)
            {
                currentState.cullFaceEnable = enable;
                if (enable)
                {
                    gl.enable(gl.CULL_FACE);
                }
                else
                {
                    gl.disable(gl.CULL_FACE);
                }

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setCullFace(face)
        {
            if (currentState.cullFace !== face)
            {
                currentState.cullFace = face;
                gl.cullFace(face);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setFrontFace(face)
        {
            if (currentState.frontFace !== face)
            {
                currentState.frontFace = face;
                gl.frontFace(face);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setColorMask(mask0, mask1, mask2, mask3)
        {
            var colorMask = currentState.colorMask;
            if (colorMask[0] !== mask0 ||
                colorMask[1] !== mask1 ||
                colorMask[2] !== mask2 ||
                colorMask[3] !== mask3)
            {
                colorMask[0] = mask0;
                colorMask[1] = mask1;
                colorMask[2] = mask2;
                colorMask[3] = mask3;
                gl.colorMask(mask0, mask1, mask2, mask3);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setStencilTestEnable(enable)
        {
            if (currentState.stencilTestEnable !== enable)
            {
                currentState.stencilTestEnable = enable;
                if (enable)
                {
                    gl.enable(gl.STENCIL_TEST);
                }
                else
                {
                    gl.disable(gl.STENCIL_TEST);
                }

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setStencilFunc(stencilFunc, stencilRef, stencilMask)
        {
            if (currentState.stencilFunc !== stencilFunc ||
                currentState.stencilRef !== stencilRef ||
                currentState.stencilMask !== stencilMask)
            {
                currentState.stencilFunc = stencilFunc;
                currentState.stencilRef = stencilRef;
                currentState.stencilMask = stencilMask;
                gl.stencilFunc(stencilFunc, stencilRef, stencilMask);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setStencilOp(stencilFail, stencilZfail, stencilZpass)
        {
            if (currentState.stencilFail !== stencilFail ||
                currentState.stencilZFail !== stencilZfail ||
                currentState.stencilZPass !== stencilZpass)
            {
                currentState.stencilFail = stencilFail;
                currentState.stencilZFail = stencilZfail;
                currentState.stencilZPass = stencilZpass;
                gl.stencilOp(stencilFail, stencilZfail, stencilZpass);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setPolygonOffsetFillEnable(enable)
        {
            if (currentState.polygonOffsetFillEnable !== enable)
            {
                currentState.polygonOffsetFillEnable = enable;
                if (enable)
                {
                    gl.enable(gl.POLYGON_OFFSET_FILL);
                }
                else
                {
                    gl.disable(gl.POLYGON_OFFSET_FILL);
                }

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setPolygonOffset(factor, units)
        {
            if (currentState.polygonOffsetFactor !== factor ||
                currentState.polygonOffsetUnits !== units)
            {
                currentState.polygonOffsetFactor = factor;
                currentState.polygonOffsetUnits = units;
                gl.polygonOffset(factor, units);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function setLineWidth(lineWidth)
        {
            if (currentState.lineWidth !== lineWidth)
            {
                currentState.lineWidth = lineWidth;
                gl.lineWidth(lineWidth);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetDepthTestEnable()
        {
            //setDepthTestEnable(true);
            if (!currentState.depthTestEnable)
            {
                currentState.depthTestEnable = true;
                gl.enable(gl.DEPTH_TEST);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetDepthFunc()
        {
            //setDepthFunc(defaultDepthFunc);
            var func = defaultDepthFunc;
            if (currentState.depthFunc !== func)
            {
                currentState.depthFunc = func;
                gl.depthFunc(func);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetDepthMask()
        {
            //setDepthMask(true);
            if (!currentState.depthMask)
            {
                currentState.depthMask = true;
                gl.depthMask(true);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetBlendEnable()
        {
            //setBlendEnable(false);
            if (currentState.blendEnable)
            {
                currentState.blendEnable = false;
                gl.disable(gl.BLEND);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetBlendFunc()
        {
            //setBlendFunc(defaultBlendFuncSrc, defaultBlendFuncDst);
            var src = defaultBlendFuncSrc;
            var dst = defaultBlendFuncDst;
            if (currentState.blendSrc !== src || currentState.blendDst !== dst)
            {
                currentState.blendSrc = src;
                currentState.blendDst = dst;
                gl.blendFunc(src, dst);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetCullFaceEnable()
        {
            //setCullFaceEnable(true);
            if (!currentState.cullFaceEnable)
            {
                currentState.cullFaceEnable = true;
                gl.enable(gl.CULL_FACE);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetCullFace()
        {
            //setCullFace(defaultCullFace);
            var face = defaultCullFace;
            if (currentState.cullFace !== face)
            {
                currentState.cullFace = face;
                gl.cullFace(face);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetFrontFace()
        {
            //setFrontFace(defaultFrontFace);
            var face = defaultFrontFace;
            if (currentState.frontFace !== face)
            {
                currentState.frontFace = face;
                gl.frontFace(face);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetColorMask()
        {
            //setColorMask(true, true, true, true);
            var colorMask = currentState.colorMask;
            if (colorMask[0] !== true ||
                colorMask[1] !== true ||
                colorMask[2] !== true ||
                colorMask[3] !== true)
            {
                colorMask[0] = true;
                colorMask[1] = true;
                colorMask[2] = true;
                colorMask[3] = true;
                gl.colorMask(true, true, true, true);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetStencilTestEnable()
        {
            //setStencilTestEnable(false);
            if (currentState.stencilTestEnable)
            {
                currentState.stencilTestEnable = false;
                gl.disable(gl.STENCIL_TEST);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetStencilFunc()
        {
            //setStencilFunc(defaultStencilFunc, 0, 0xffffffff);
            var stencilFunc = defaultStencilFunc;
            if (currentState.stencilFunc !== stencilFunc ||
                currentState.stencilRef !== 0 ||
                currentState.stencilMask !== 0xffffffff)
            {
                currentState.stencilFunc = stencilFunc;
                currentState.stencilRef = 0;
                currentState.stencilMask = 0xffffffff;
                gl.stencilFunc(stencilFunc, 0, 0xffffffff);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetStencilOp()
        {
            //setStencilOp(defaultStencilOp, defaultStencilOp, defaultStencilOp);
            var stencilOp = defaultStencilOp;
            if (currentState.stencilFail !== stencilOp ||
                currentState.stencilZFail !== stencilOp ||
                currentState.stencilZPass !== stencilOp)
            {
                currentState.stencilFail = stencilOp;
                currentState.stencilZFail = stencilOp;
                currentState.stencilZPass = stencilOp;
                gl.stencilOp(stencilOp, stencilOp, stencilOp);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetPolygonOffsetFillEnable()
        {
            //setPolygonOffsetFillEnable(false);
            if (currentState.polygonOffsetFillEnable)
            {
                currentState.polygonOffsetFillEnable = false;
                gl.disable(gl.POLYGON_OFFSET_FILL);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetPolygonOffset()
        {
            //setPolygonOffset(0, 0);
            if (currentState.polygonOffsetFactor !== 0 ||
                currentState.polygonOffsetUnits !== 0)
            {
                currentState.polygonOffsetFactor = 0;
                currentState.polygonOffsetUnits = 0;
                gl.polygonOffset(0, 0);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function resetLineWidth()
        {
            //setLineWidth(1);
            if (currentState.lineWidth !== 1)
            {
                currentState.lineWidth = 1;
                gl.lineWidth(1);

                if (debug)
                {
                    gd.metrics.renderStateChanges += 1;
                }
            }
        }

        function parseBoolean(state)
        {
            if (typeof state !== 'boolean')
            {
                return [(state ? true : false)];
            }
            return [state];
        }

        function parseEnum(state)
        {
            if (typeof state !== 'number')
            {
                // TODO
                return null;
            }
            return [state];
        }

        function parseEnum2(state)
        {
            if (typeof state === 'object')
            {
                var value0 = state[0], value1 = state[1];
                if (typeof value0 !== 'number')
                {
                    // TODO
                    return null;
                }
                if (typeof value1 !== 'number')
                {
                    // TODO
                    return null;
                }
                return [value0, value1];
            }
            return null;
        }

        function parseEnum3(state)
        {
            if (typeof state === 'object')
            {
                var value0 = state[0], value1 = state[1], value2 = state[2];
                if (typeof value0 !== 'number')
                {
                    // TODO
                    return null;
                }
                if (typeof value1 !== 'number')
                {
                    // TODO
                    return null;
                }
                if (typeof value2 !== 'number')
                {
                    // TODO
                    return null;
                }
                return [value0, value1, value2];
            }
            return null;
        }

        function parseFloat(state)
        {
            if (typeof state !== 'number')
            {
                // TODO
                return null;
            }
            return [state];
        }

        function parseFloat2(state)
        {
            if (typeof state === 'object')
            {
                var value0 = state[0], value1 = state[1];
                if (typeof value0 !== 'number')
                {
                    // TODO
                    return null;
                }
                if (typeof value1 !== 'number')
                {
                    // TODO
                    return null;
                }
                return [value0, value1];
            }
            return null;
        }

        function parseColorMask(state)
        {
            if (typeof state === 'object')
            {
                var value0 = state[0], value1 = state[1], value2 = state[2], value3 = state[3];
                if (typeof value0 !== 'number')
                {
                    // TODO
                    return null;
                }
                if (typeof value1 !== 'number')
                {
                    // TODO
                    return null;
                }
                if (typeof value2 !== 'number')
                {
                    // TODO
                    return null;
                }
                if (typeof value3 !== 'number')
                {
                    // TODO
                    return null;
                }
                return [value0, value1, value2, value3];
            }
            return null;
        }

        var stateHandlers = {};
        var addStateHandler = function addStateHandlerFn(name, sf, rf, pf, dv)
        {
            stateHandlers[name] = {
                set: sf,
                reset: rf,
                parse: pf,
                defaultValues: dv
            };
        };
        addStateHandler("DepthTestEnable",
                        setDepthTestEnable, resetDepthTestEnable, parseBoolean,
                        [true]);
        addStateHandler("DepthFunc",
                        setDepthFunc, resetDepthFunc, parseEnum,
                        [defaultDepthFunc]);
        addStateHandler("DepthMask",
                        setDepthMask, resetDepthMask, parseBoolean,
                        [true]);
        addStateHandler("BlendEnable",
                        setBlendEnable, resetBlendEnable, parseBoolean,
                        [false]);
        addStateHandler("BlendFunc",
                        setBlendFunc, resetBlendFunc, parseEnum2,
                        [defaultBlendFuncSrc, defaultBlendFuncDst]);
        addStateHandler("CullFaceEnable",
                        setCullFaceEnable, resetCullFaceEnable, parseBoolean,
                        [true]);
        addStateHandler("CullFace",
                        setCullFace, resetCullFace, parseEnum,
                        [defaultCullFace]);
        addStateHandler("FrontFace",
                        setFrontFace, resetFrontFace, parseEnum,
                        [defaultFrontFace]);
        addStateHandler("ColorMask",
                        setColorMask, resetColorMask, parseColorMask,
                        [true, true, true, true]);
        addStateHandler("StencilTestEnable",
                        setStencilTestEnable, resetStencilTestEnable, parseBoolean,
                        [false]);
        addStateHandler("StencilFunc",
                        setStencilFunc, resetStencilFunc, parseEnum3,
                        [defaultStencilFunc, 0, 0xffffffff]);
        addStateHandler("StencilOp",
                        setStencilOp, resetStencilOp, parseEnum3,
                        [defaultStencilOp, defaultStencilOp, defaultStencilOp]);
        addStateHandler("PolygonOffsetFillEnable",
                        setPolygonOffsetFillEnable, resetPolygonOffsetFillEnable, parseBoolean,
                        [false]);
        addStateHandler("PolygonOffset",
                        setPolygonOffset, resetPolygonOffset, parseFloat2,
                        [0, 0]);
        if (!gd.fixIE)
        {
            addStateHandler("LineWidth", setLineWidth, resetLineWidth, parseFloat, [1]);
        }
        gd.stateHandlers = stateHandlers;

        gd.syncState();

        gd.videoRam = 0;
        gd.desktopWidth = window.screen.width;
        gd.desktopHeight = window.screen.height;

        if (Object.defineProperty)
        {
            Object.defineProperty(gd, "fullscreen", {
                get : function getFullscreenFn() {
                    return (document.fullscreenElement ||
                            document.webkitFullscreenElement ||
                            document.mozFullScreenElement ||
                            document.msFullscreenElement ?
                            true : false);
                },
                set : function setFullscreenFn(newFullscreen) {
                    gd.requestFullScreen(newFullscreen);
                },
                enumerable : true,
                configurable : false
            });

            /* tslint:disable:no-empty */
            gd.checkFullScreen = function dummyCheckFullScreenFn()
            {
            };
            /* tslint:enable:no-empty */
        }
        else
        {
            gd.fullscreen = false;
            gd.oldFullscreen = false;
        }

        gd.clientStateMask = 0;
        gd.attributeMask = 0;
        gd.activeTechnique = null;
        gd.activeIndexBuffer = null;
        gd.bindedVertexBuffer = null;
        gd.activeRenderTarget = null;

        gd._semanticsOffsets = [];
        for (n = 0; n < 16; n += 1)
        {
            gd._semanticsOffsets[n] = <WebGLSemanticOffset>{
                vertexBuffer: null,
                offset: 0
            };
        }

        gd.immediateVertexBuffer = <WebGLVertexBuffer>gd.createVertexBuffer({
            numVertices: (256 * 1024 / 16),
            attributes: ['FLOAT4'],
            dynamic: true,
            'transient': true
        });
        gd.immediatePrimitive = -1;
        gd.immediateSemantics = [];

        gd.fps = 0;
        gd.numFrames = 0;
        gd.previousFrameTime = TurbulenzEngine.getTime();

        gd._techniqueParametersArray = [];
        gd._drawArrayId = -1;

        // Need a temporary elements to test capabilities
        var video = <HTMLVideoElement>document.createElement('video');
        var supportedVideoExtensions : WebGLVideoSupportedExtensions = {};
        if (video)
        {
            if (video.canPlayType('video/webm'))
            {
                supportedVideoExtensions.webm = true;
            }
            if (video.canPlayType('video/mp4'))
            {
                supportedVideoExtensions.mp4 = true;
                supportedVideoExtensions.m4v = true;
            }
        }
        gd.supportedVideoExtensions = supportedVideoExtensions;
        video = null;

        return gd;
    }
}

WebGLGraphicsDevice.prototype.SEMANTIC_POSITION = 0;
WebGLGraphicsDevice.prototype.SEMANTIC_POSITION0 = 0;
WebGLGraphicsDevice.prototype.SEMANTIC_BLENDWEIGHT = 1;
WebGLGraphicsDevice.prototype.SEMANTIC_BLENDWEIGHT0 = 1;
WebGLGraphicsDevice.prototype.SEMANTIC_NORMAL = 2;
WebGLGraphicsDevice.prototype.SEMANTIC_NORMAL0 = 2;
WebGLGraphicsDevice.prototype.SEMANTIC_COLOR = 3;
WebGLGraphicsDevice.prototype.SEMANTIC_COLOR0 = 3;
WebGLGraphicsDevice.prototype.SEMANTIC_COLOR1 = 4;
WebGLGraphicsDevice.prototype.SEMANTIC_SPECULAR = 4;
WebGLGraphicsDevice.prototype.SEMANTIC_FOGCOORD = 5;
WebGLGraphicsDevice.prototype.SEMANTIC_TESSFACTOR = 5;
WebGLGraphicsDevice.prototype.SEMANTIC_PSIZE0 = 6;
WebGLGraphicsDevice.prototype.SEMANTIC_BLENDINDICES = 7;
WebGLGraphicsDevice.prototype.SEMANTIC_BLENDINDICES0 = 7;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD = 8;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD0 = 8;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD1 = 9;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD2 = 10;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD3 = 11;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD4 = 12;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD5 = 13;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD6 = 14;
WebGLGraphicsDevice.prototype.SEMANTIC_TEXCOORD7 = 15;
WebGLGraphicsDevice.prototype.SEMANTIC_TANGENT = 14;
WebGLGraphicsDevice.prototype.SEMANTIC_TANGENT0 = 14;
WebGLGraphicsDevice.prototype.SEMANTIC_BINORMAL0 = 15;
WebGLGraphicsDevice.prototype.SEMANTIC_BINORMAL = 15;
WebGLGraphicsDevice.prototype.SEMANTIC_PSIZE = 6;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR0 = 0;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR1 = 1;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR2 = 2;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR3 = 3;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR4 = 4;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR5 = 5;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR6 = 6;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR7 = 7;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR8 = 8;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR9 = 9;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR10 = 10;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR11 = 11;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR12 = 12;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR13 = 13;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR14 = 14;
WebGLGraphicsDevice.prototype.SEMANTIC_ATTR15 = 15;

// Add any new additions need to go into into src/engine/pixelformat.h
// and engine/tslib/turbulenz.d.ts.

WebGLGraphicsDevice.prototype.PIXELFORMAT_A8 = 0;
WebGLGraphicsDevice.prototype.PIXELFORMAT_L8 = 1;
WebGLGraphicsDevice.prototype.PIXELFORMAT_L8A8 = 2;
WebGLGraphicsDevice.prototype.PIXELFORMAT_R5G5B5A1 = 3;
WebGLGraphicsDevice.prototype.PIXELFORMAT_R5G6B5 = 4;
WebGLGraphicsDevice.prototype.PIXELFORMAT_R4G4B4A4 = 5;
WebGLGraphicsDevice.prototype.PIXELFORMAT_R8G8B8A8 = 6;
WebGLGraphicsDevice.prototype.PIXELFORMAT_R8G8B8 = 7;
WebGLGraphicsDevice.prototype.PIXELFORMAT_D24S8 = 8;
WebGLGraphicsDevice.prototype.PIXELFORMAT_D16 = 9;
WebGLGraphicsDevice.prototype.PIXELFORMAT_DXT1 = 10;
WebGLGraphicsDevice.prototype.PIXELFORMAT_DXT3 = 11;
WebGLGraphicsDevice.prototype.PIXELFORMAT_DXT5 = 12;
WebGLGraphicsDevice.prototype.PIXELFORMAT_S8 = 13;
WebGLGraphicsDevice.prototype.PIXELFORMAT_RGBA32F = 14;
WebGLGraphicsDevice.prototype.PIXELFORMAT_RGB32F = 15;
WebGLGraphicsDevice.prototype.PIXELFORMAT_RGBA16F = 16;
WebGLGraphicsDevice.prototype.PIXELFORMAT_RGB16F = 17;
