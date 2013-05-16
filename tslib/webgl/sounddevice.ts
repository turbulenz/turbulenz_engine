// Copyright (c) 2011-2013 Turbulenz Limited
/*global TurbulenzEngine: false*/
/*global SoundTARLoader: false*/
/*global Audio: false*/
/*global VMath: false*/
/*global window: false*/
/*global Uint8Array: false*/
"use strict";

/// <reference path="../vmath.ts" />

/// <reference path="turbulenzengine.ts" />
/// <reference path="soundtarloader.ts" />

interface WebGLSound extends Sound
{
    audioContext: any; // TODO
    buffer: any; // TODO
    data: any; // TODO
    audio: HTMLAudioElement;
};

declare var WebGLSound :
{
    new(): WebGLSound;
    prototype: any;
    create(sd: WebGLSoundDevice, params: any): WebGLSound;
};

interface WebGLSoundSource extends SoundSource
{
    sd: WebGLSoundDevice;
    id: number;

    sound: WebGLSound;
    playing: bool;
    paused: bool;
    looping: bool;

    position: any; // v3 // getter and setter
    direction: any; //v3 // getter and setter
    velocity: any; // v3 // getter and setter

    audioContext: any; // window.AudioContext || window.webkitAudioContext
    bufferNode: any; // window.AudioContext.createbufferSource()
    playStart: number;
    playPaused: number;
    pannerNode: any; // window.AudioContext.createPanner()
    gainNode: any; // window.AudioContext.createGain()

    relative: bool;
    minDistance: number;
    maxDistance: number;
    rollOff: number;

    audio: HTMLAudioElement;
    gainFactor: number;
    pitch: number;

    createBufferNode: { (WebGLSound): any; };
    updateAudioVolume: { (): void; };
    loopAudio: { (): void; };
};

declare var WebGLSoundSource :
{
    new(): WebGLSoundSource;
    prototype: any;
    create(soundDevice: WebGLSoundDevice, id: number, params: any);
};

interface WebGLSoundDeviceSoundCheckCall
{
    (): bool;
};

interface WebGLSoundDeviceSourceMap
{
    [id: string] : WebGLSoundSource;
};

interface WebGLSoundDevice extends SoundDevice
{
    renderer            : string;
    audioContext        : any;   //
    gainNode            : any;   //
    linearDistance      : bool;
    loadingSounds       : WebGLSoundDeviceSoundCheckCall[];
    loadingInterval     : number;  // window.setIntervalID id
    playingSources      : WebGLSoundDeviceSourceMap;
    lastSourceID        : number;

    loopingSupported    : bool;
    supportedExtensions : { [extName: string] : bool; };

    isResourceSupported(soundPath: string) : bool;
    addLoadingSound(call: WebGLSoundDeviceSoundCheckCall);
    removePlayingSource(source: WebGLSoundSource): void;
    destroy(): void;
};

declare var WebGLSoundDevice :
{
    new(): WebGLSoundDevice;
    prototype: any;
    create(params: any): WebGLSoundDevice;
};

//
// WebGLSound
//
function WebGLSound() { return this; }
WebGLSound.prototype =
{
    version : 1,

    destroy : function soundDestroyFn()
    {
        var audioContext = this.audioContext;
        if (audioContext)
        {
            delete this.audioContext;
            delete this.buffer;
        }
        else
        {
            delete this.audio;
        }
    }
};

WebGLSound.create = function webGLSoundCreateFn(sd, params)
{
    var sound = new WebGLSound();

    var soundPath = params.src;

    sound.name = (params.name || soundPath);
    sound.frequency = 0;
    sound.channels = 0;
    sound.bitrate = 0;
    sound.length = 0;
    sound.compressed = (!params.uncompress);

    var onload = params.onload;

    var data, numSamples, numChannels, samplerRate;

    var audioContext = sd.audioContext;
    if (audioContext)
    {
        sound.audioContext = audioContext;

        var buffer;
        if (soundPath)
        {
            if (!sd.isResourceSupported(soundPath))
            {
                if (onload)
                {
                    onload(null);
                }
                return null;
            }

            var bufferCreated = function bufferCreatedFn(buffer)
            {
                if (buffer)
                {
                    sound.buffer = buffer;
                    sound.frequency = buffer.sampleRate;
                    sound.channels = buffer.numberOfChannels;
                    sound.bitrate = (sound.frequency * sound.channels * 2 * 8);
                    sound.length = buffer.duration;

                    if (onload)
                    {
                        onload(sound, 200);
                    }
                }
                else
                {
                    if (onload)
                    {
                        onload(null);
                    }
                }
            };

            var bufferFailed = function bufferFailedFn()
            {
                if (onload)
                {
                    onload(null);
                }
            };

            data = params.data;
            if (data)
            {
                if (audioContext.decodeAudioData)
                {
                    audioContext.decodeAudioData(data, bufferCreated, bufferFailed);
                }
                else
                {
                    buffer = audioContext.createBuffer(data, false);
                    bufferCreated(buffer);
                }
            }
            else
            {
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
                    if (onload)
                    {
                        onload(null);
                    }
                    return null;
                }

                xhr.onreadystatechange = function ()
                {
                    if (xhr.readyState === 4)
                    {
                        if (!TurbulenzEngine || !TurbulenzEngine.isUnloading())
                        {
                            var xhrStatus = xhr.status;
                            var xhrStatusText = (xhrStatus !== 0 && xhr.statusText || 'No connection');
                            var response = xhr.response;

                            // Sometimes the browser sets status to 200 OK when the connection is closed
                            // before the message is sent (weird!).
                            // In order to address this we fail any completely empty responses.
                            // Hopefully, nobody will get a valid response with no headers and no body!
                            if (xhr.getAllResponseHeaders() === "" && !response && xhrStatus === 200 && xhrStatusText === 'OK')
                            {
                                if (onload)
                                {
                                    onload(null);
                                }
                            }
                            else if (xhrStatus === 200 || xhrStatus === 0)
                            {
                                if (audioContext.decodeAudioData)
                                {
                                    audioContext.decodeAudioData(response, bufferCreated, bufferFailed);
                                }
                                else
                                {
                                    var buffer = audioContext.createBuffer(response, false);
                                    bufferCreated(buffer);
                                }
                            }
                            else
                            {
                                if (onload)
                                {
                                    onload(null);
                                }
                            }
                        }
                        // break circular reference
                        xhr.onreadystatechange = null;
                        xhr = null;
                    }
                };
                xhr.open("GET", soundPath, true);
                xhr.responseType = "arraybuffer";
                xhr.setRequestHeader("Content-Type", "text/plain");
                xhr.send(null);
            }

            return sound;
        }
        else
        {
            data = params.data;
            if (data)
            {
                numSamples = data.length;
                numChannels = (params.channels || 1);
                samplerRate = params.frequency;

                var contextSampleRate = Math.min(audioContext.sampleRate, 96000);
                var c, channel, i, j;

                if (contextSampleRate === samplerRate)
                {
                    buffer = audioContext.createBuffer(numChannels, (numSamples / numChannels), samplerRate);

                    // De-interleave data
                    for (c = 0; c < numChannels; c += 1)
                    {
                        channel = buffer.getChannelData(c);
                        for (i = c, j = 0; i < numSamples; i += numChannels, j += 1)
                        {
                            channel[j] = data[i];
                        }
                    }
                }
                else
                {
                    var ratio = (samplerRate / contextSampleRate);
                    /*jshint bitwise: false*/
                    var bufferLength = ((numSamples / (ratio * numChannels)) | 0);
                    /*jshint bitwise: true*/

                    buffer = audioContext.createBuffer(numChannels, bufferLength, contextSampleRate);

                    // De-interleave data
                    for (c = 0; c < numChannels; c += 1)
                    {
                        channel = buffer.getChannelData(c);
                        for (j = 0; j < bufferLength; j += 1)
                        {
                            /*jshint bitwise: false*/
                            channel[j] = data[c + (((j * ratio) | 0) * numChannels)];
                            /*jshint bitwise: true*/
                        }
                    }
                }

                if (buffer)
                {
                    sound.buffer = buffer;
                    sound.frequency = samplerRate;
                    sound.channels = numChannels;
                    sound.bitrate = (samplerRate * numChannels * 2 * 8);
                    sound.length = (numSamples / (samplerRate * numChannels));

                    if (onload)
                    {
                        onload(sound, 200);
                    }

                    return sound;
                }
            }
        }
    }
    else
    {
        var audio;

        if (soundPath)
        {
            var extension = soundPath.slice(-3);

            data = params.data;
            if (data)
            {

                var dataArray;
                if (data instanceof Uint8Array)
                {
                    dataArray = data;
                }
                else
                {
                    dataArray = new Uint8Array(data);
                }

                // Check extension based on data

                if (dataArray[0] === 79 &&
                    dataArray[1] === 103 &&
                    dataArray[2] === 103 &&
                    dataArray[3] === 83)
                {
                    extension = 'ogg';
                    soundPath = 'data:audio/ogg;base64,';
                }
                else if (dataArray[0] === 82 &&
                         dataArray[1] === 73 &&
                         dataArray[2] === 70 &&
                         dataArray[3] === 70)
                {
                    extension = 'wav';
                    soundPath = 'data:audio/wav;base64,';
                }
                else
                {
                    // Assume it's an mp3?
                    extension = 'mp3';
                    soundPath = 'data:audio/mpeg;base64,';
                }

                // Mangle data into a data URI
                soundPath = soundPath +
                    (<WebGLTurbulenzEngine>TurbulenzEngine).base64Encode(
                        dataArray);
            }

            if (!sd.supportedExtensions[extension])
            {
                if (onload)
                {
                    onload(null);
                }
                return null;
            }

            audio = new Audio();

            audio.preload = 'auto';
            audio.autobuffer = true;

            audio.src = soundPath;

            audio.onerror = function loadingSoundFailedFn(/* e */)
            {
                if (onload)
                {
                    onload(null);
                    onload = null;
                }
            };

            sd.addLoadingSound(function checkLoadedFn() {
                if (3 <= audio.readyState)
                {
                    sound.frequency = (audio.sampleRate || audio.mozSampleRate);
                    sound.channels = (audio.channels || audio.mozChannels);
                    sound.bitrate = (sound.frequency * sound.channels * 2 * 8);
                    sound.length = audio.duration;

                    if (audio.buffered &&
                        audio.buffered.length &&
                        0 < audio.buffered.end(0))
                    {
                        if (isNaN(sound.length) ||
                            sound.length === Number.POSITIVE_INFINITY)
                        {
                            sound.length = audio.buffered.end(0);
                        }

                        if (onload)
                        {
                            onload(sound, 200);
                            onload = null;
                        }
                    }
                    else
                    {
                        // Make sure the data is actually loaded
                        var forceLoading = function forceLoadingFn()
                        {
                            audio.pause();
                            audio.removeEventListener('play', forceLoading, false);

                            if (onload)
                            {
                                onload(sound, 200);
                                onload = null;
                            }
                        };
                        audio.addEventListener('play', forceLoading, false);
                        audio.volume = 0;
                        audio.play();
                    }

                    return true;
                }
                return false;
            });

            sound.audio = audio;

            return sound;
        }
        else
        {
            data = params.data;
            if (data)
            {
                audio = new Audio();

                if (audio.mozSetup)
                {
                    numSamples = data.length;
                    numChannels = (params.channels || 1);
                    samplerRate = params.frequency;

                    audio.mozSetup(numChannels, samplerRate);

                    sound.data = data;
                    sound.frequency = samplerRate;
                    sound.channels = numChannels;
                    sound.bitrate = (samplerRate * numChannels * 2 * 8);
                    sound.length = (numSamples / (samplerRate * numChannels));

                    sound.audio = audio;

                    if (onload)
                    {
                        onload(sound, 200);
                    }

                    return sound;
                }
                else
                {
                    audio = null;
                }
            }
        }
    }

    if (onload)
    {
        onload(null);
    }

    return null;
};

//
// WebGLSoundSource
//
function WebGLSoundSource() { return this; }
WebGLSoundSource.prototype =
{
    version : 1,

    // Public API
    play : function sourcePlayFn(sound, seek)
    {
        var audioContext = this.audioContext;
        if (audioContext)
        {
            var bufferNode = this.bufferNode;

            if (this.sound !== sound)
            {
                if (bufferNode)
                {
                    bufferNode.stop(0);
                }
            }
            else
            {
                if (bufferNode)
                {
                    return this.seek(seek);
                }
            }

            bufferNode = this.createBufferNode(sound);

            this.sound = sound;

            if (!this.playing)
            {
                this.playing = true;
                this.paused = false;

                this.sd.addPlayingSource(this);
            }

            if (seek === undefined)
            {
                seek = 0;
            }

            if (0 < seek)
            {
                var buffer = sound.buffer;
                if (bufferNode.loop)
                {
                    bufferNode.start(0, seek, buffer.duration);
                }
                else
                {
                    bufferNode.start(0, seek, (buffer.duration - seek));
                }
                this.playStart = (audioContext.currentTime - seek);
            }
            else
            {
                bufferNode.start(0);
                this.playStart = audioContext.currentTime;
            }
        }
        else
        {
            var audio;

            if (this.sound !== sound)
            {
                this.stop();

                if (sound.data)
                {
                    audio = new Audio();
                    audio.mozSetup(sound.channels, sound.frequency);
                }
                else
                {
                    audio = sound.audio.cloneNode(true);
                }

                this.sound = sound;
                this.audio = audio;

                audio.loop = this.looping;

                audio.addEventListener('ended', this.loopAudio, false);
            }
            else
            {
                if (this.playing && !this.paused)
                {
                    if (this.looping)
                    {
                        return true;
                    }
                }

                audio = this.audio;
            }

            if (!this.playing)
            {
                this.playing = true;
                this.paused = false;

                this.sd.addPlayingSource(this);
            }

            if (seek === undefined)
            {
                seek = 0;
            }

            if (0.05 < Math.abs(audio.currentTime - seek))
            {
                try
                {
                    audio.currentTime = seek;
                }
                catch (e)
                {
                    // There does not seem to be any reliable way of seeking
                }
            }

            if (sound.data)
            {
                audio.mozWriteAudio(sound.data);
            }
            else
            {
                audio.play();
            }
        }

        return true;
    },

    stop : function sourceStopFn()
    {
        var playing = this.playing;
        if (playing)
        {
            this.playing = false;
            this.paused = false;

            var audioContext = this.audioContext;
            if (audioContext)
            {
                this.sound = null;

                var bufferNode = this.bufferNode;
                if (bufferNode)
                {
                    bufferNode.stop(0);
                    bufferNode.disconnect();
                    this.bufferNode = null;
                }
            }
            else
            {
                var audio = this.audio;
                if (audio)
                {
                    this.sound = null;
                    this.audio = null;

                    audio.pause();

                    audio.removeEventListener('ended', this.loopAudio, false);

                    audio = null;
                }
            }

            this.sd.removePlayingSource(this);
        }

        return playing;
    },

    pause : function sourcePauseFn()
    {
        if (this.playing)
        {
            if (!this.paused)
            {
                this.paused = true;

                var audioContext = this.audioContext;
                if (audioContext)
                {
                    this.playPaused = audioContext.currentTime;

                    this.bufferNode.stop(0);
                    this.bufferNode.disconnect();
                    this.bufferNode = null;
                }
                else
                {
                    this.audio.pause();
                }

                this.sd.removePlayingSource(this);
            }

            return true;
        }

        return false;
    },

    resume : function sourceResumeFn(seek)
    {
        if (this.paused)
        {
            this.paused = false;

            var audioContext = this.audioContext;
            if (audioContext)
            {
                if (seek === undefined)
                {
                    seek = (this.playPaused - this.playStart);
                }

                var bufferNode = this.createBufferNode(this.sound);

                if (0 < seek)
                {
                    var buffer = this.sound.buffer;
                    if (bufferNode.loop)
                    {
                        bufferNode.start(0, seek, buffer.duration);
                    }
                    else
                    {
                        bufferNode.start(0, seek, (buffer.duration - seek));
                    }
                    this.playStart = (audioContext.currentTime - seek);
                }
                else
                {
                    bufferNode.start(0);
                    this.playStart = audioContext.currentTime;
                }
            }
            else
            {
                var audio = this.audio;

                if (seek !== undefined)
                {
                    if (0.05 < Math.abs(audio.currentTime - seek))
                    {
                        try
                        {
                            audio.currentTime = seek;
                        }
                        catch (e)
                        {
                            // There does not seem to be any reliable way of seeking
                        }

                    }
                }

                audio.play();
            }

            this.sd.addPlayingSource(this);

            return true;
        }

        return false;
    },

    rewind : function sourceRewindFn()
    {
        if (this.playing)
        {
            var audioContext = this.audioContext;
            if (audioContext)
            {
                var bufferNode = this.bufferNode;
                if (bufferNode)
                {
                    bufferNode.stop(0);
                }

                bufferNode = this.createBufferNode(this.sound);

                bufferNode.start(0);

                this.playStart = audioContext.currentTime;

                return true;
            }
            else
            {
                var audio = this.audio;
                if (audio)
                {
                    audio.currentTime = 0;

                    return true;
                }
            }
        }

        return false;
    },

    seek : function sourceSeekFn(seek)
    {
        if (this.playing)
        {
            var audioContext = this.audioContext;
            if (audioContext)
            {
                if (0.05 < Math.abs((audioContext.currentTime - this.playStart) - seek))
                {
                    var bufferNode = this.bufferNode;
                    if (bufferNode)
                    {
                        bufferNode.stop(0);
                    }

                    bufferNode = this.createBufferNode(this.sound);

                    if (0 < seek)
                    {
                        var buffer = this.sound.buffer;
                        if (bufferNode.loop)
                        {
                            bufferNode.start(0, seek, buffer.duration);
                        }
                        else
                        {
                            bufferNode.start(0, seek, (buffer.duration - seek));
                        }
                        this.playStart = (audioContext.currentTime - seek);
                    }
                    else
                    {
                        bufferNode.start(0);
                        this.playStart = audioContext.currentTime;
                    }
                }

                return true;
            }
            else
            {
                var audio = this.audio;
                if (audio)
                {
                    // There does not seem to be any reliable way of seeking
                    if (audio.currentTime > seek)
                    {
                        try
                        {
                            audio.currentTime = seek;
                        }
                        catch (e)
                        {
                        }
                    }

                    return true;
                }
            }
        }

        return false;
    },

    clear : function sourceClearFn()
    {
        this.stop();
    },

    setAuxiliarySendFilter : function setAuxiliarySendFilterFn()
    {
    },

    setDirectFilter : function setDirectFilterFn()
    {
    },

    destroy : function sourceDestroyFn()
    {
        this.stop();

        var audioContext = this.audioContext;
        if (audioContext)
        {
            var pannerNode = this.pannerNode;
            if (pannerNode)
            {
                pannerNode.disconnect();
                delete this.pannerNode;
            }

            delete this.audioContext;
        }
    }
};

WebGLSoundSource.create = function webGLSoundSourceCreateFn(sd, id, params)
{
    var source = new WebGLSoundSource();

    source.sd = sd;
    source.id = id;

    source.sound = null;
    source.playing = false;
    source.paused = false;

    var gain = (typeof params.gain === "number" ? params.gain : 1);
    var looping = (params.looping || false);
    var pitch = (params.pitch || 1);
    var position, direction, velocity;

    var audioContext = sd.audioContext;
    if (audioContext)
    {
        source.audioContext = audioContext;
        source.bufferNode = null;
        source.playStart = -1;
        source.playPaused = -1;

        var masterGainNode = sd.gainNode;

        var pannerNode = audioContext.createPanner();
        source.pannerNode = pannerNode;
        pannerNode.connect(masterGainNode);

        var gainNode = (audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode());
        source.gainNode = gainNode;

        if (sd.linearDistance)
        {
            if (typeof pannerNode.distanceModel === "string")
            {
                pannerNode.distanceModel = "linear";
            }
            else if (typeof pannerNode.LINEAR_DISTANCE === "number")
            {
                pannerNode.distanceModel = pannerNode.LINEAR_DISTANCE;
            }
        }

        if (typeof pannerNode.panningModel === "string")
        {
            pannerNode.panningModel = "equalpower";
        }
        else
        {
            pannerNode.panningModel = pannerNode.EQUALPOWER;
        }

        Object.defineProperty(source, "position", {
                get : function getPositionFn() {
                    return position.slice();
                },
                set : function setPositionFn(newPosition) {
                    position = VMath.v3Copy(newPosition, position);
                    if (!source.relative)
                    {
                        this.pannerNode.setPosition(newPosition[0], newPosition[1], newPosition[2]);
                    }
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "direction", {
                get : function getDirectionFn() {
                    return direction.slice();
                },
                set : function setDirectionFn(newDirection) {
                    direction = VMath.v3Copy(newDirection, direction);
                    this.pannerNode.setOrientation(newDirection[0], newDirection[1], newDirection[2]);
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "velocity", {
                get : function getVelocityFn() {
                    return velocity.slice();
                },
                set : function setVelocityFn(newVelocity) {
                    velocity = VMath.v3Copy(newVelocity, velocity);
                    this.pannerNode.setVelocity(newVelocity[0], newVelocity[1], newVelocity[2]);
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "gain", {
                get : function getGainFn() {
                    return gain;
                },
                set : function setGainFn(newGain) {
                    gain = newGain;
                    this.gainNode.gain.value = newGain;
                },
                enumerable : true,
                configurable : false
            });

        source.createBufferNode = function createBufferNodeFn(sound)
        {
            var buffer = sound.buffer;

            var bufferNode = audioContext.createBufferSource();
            bufferNode.buffer = buffer;
            bufferNode.loop = looping;
            bufferNode.playbackRate.value = pitch;
            bufferNode.connect(gainNode);

            gainNode.disconnect();
            if (1 < sound.channels)
            {
                // We do not support panning of stereo sources
                gainNode.connect(masterGainNode);
            }
            else
            {
                gainNode.connect(pannerNode);
            }

            // Backwards compatibility
            if (!bufferNode.start)
            {
                bufferNode.start = function audioStart(when, offset, duration)
                {
                    if (arguments.length <= 1)
                    {
                        this.noteOn(when);
                    }
                    else
                    {
                        this.noteGrainOn(when, offset, duration);
                    }
                };
            }

            if (!bufferNode.stop)
            {
                bufferNode.stop = function audioStop(when)
                {
                    this.noteOff(when);
                };
            }

            this.bufferNode = bufferNode;

            return bufferNode;
        };

        Object.defineProperty(source, "looping", {
                get : function getLoopingFn() {
                    return looping;
                },
                set : function setLoopingFn(newLooping) {
                    looping = newLooping;
                    var bufferNode = this.bufferNode;
                    if (bufferNode)
                    {
                        bufferNode.loop = newLooping;
                    }
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "pitch", {
                get : function getPitchFn() {
                    return pitch;
                },
                set : function setPitchFn(newPitch) {
                    pitch = newPitch;
                    var bufferNode = this.bufferNode;
                    if (bufferNode)
                    {
                        bufferNode.playbackRate.value = newPitch;
                    }
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "tell", {
            get : function tellFn() {
                if (this.playing)
                {
                    if (this.paused)
                    {
                        return (this.playPaused - this.playStart);
                    }
                    else
                    {
                        return (audioContext.currentTime - this.playStart);
                    }
                }
                else
                {
                    return 0;
                }
            },
            enumerable : true,
            configurable : false
        });

        Object.defineProperty(source, "minDistance", {
                get : function getMinDistanceFn() {
                    return pannerNode.refDistance;
                },
                set : function setMinDistanceFn(minDistance) {
                    if (this.pannerNode.maxDistance === minDistance)
                    {
                        minDistance = this.pannerNode.maxDistance * 0.999;
                    }
                    this.pannerNode.refDistance = minDistance;
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "maxDistance", {
                get : function getMaxDistanceFn() {
                    return pannerNode.maxDistance;
                },
                set : function setMaxDistanceFn(maxDistance) {
                    if (this.pannerNode.refDistance === maxDistance)
                    {
                        maxDistance = this.pannerNode.refDistance * 1.001;
                    }
                    this.pannerNode.maxDistance = maxDistance;
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "rollOff", {
                get : function getRolloffFactorFn() {
                    return pannerNode.rolloffFactor;
                },
                set : function setRolloffFactorFn(rollOff) {
                    this.pannerNode.rolloffFactor = rollOff;
                },
                enumerable : true,
                configurable : false
            });
    }
    else
    {
        source.audio = null;

        source.gainFactor = 1;
        source.pitch = pitch;

        source.updateAudioVolume = function updateAudioVolumeFn()
        {
            var audio = this.audio;
            if (audio)
            {
                var volume = Math.min((this.gainFactor * gain), 1);
                audio.volume = volume;
                if (0 >= volume)
                {
                    audio.muted = true;
                }
                else
                {
                    audio.muted = false;
                }
            }
        };

        Object.defineProperty(source, "position", {
                get : function getPositionFn() {
                    return position.slice();
                },
                set : function setPositionFn(newPosition) {
                    position = VMath.v3Copy(newPosition, position);
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "direction", {
                get : function getDirectionFn() {
                    return direction.slice();
                },
                set : function setDirectionFn(newDirection) {
                    direction = VMath.v3Copy(newDirection, direction);
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "velocity", {
                get : function getVelocityFn() {
                    return velocity.slice();
                },
                set : function setVelocityFn(newVelocity) {
                    velocity = VMath.v3Copy(newVelocity, velocity);
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(source, "gain", {
                get : function getGainFn() {
                    return gain;
                },
                set : function setGainFn(newGain) {
                    gain = newGain;
                    source.gainFactor = -1;
                },
                enumerable : true,
                configurable : false
            });

        if (sd.loopingSupported)
        {
            Object.defineProperty(source, "looping", {
                    get : function getLoopingFn() {
                        return looping;
                    },
                    set : function setLoopingFn(newLooping) {
                        looping = newLooping;
                        var audio = source.audio;
                        if (audio)
                        {
                            audio.loop = newLooping;
                        }
                    },
                    enumerable : true,
                    configurable : false
                });

            source.loopAudio = function loopAudioFn() {
                var audio = source.audio;
                if (audio)
                {
                    source.playing = false;
                    source.sd.removePlayingSource(source);
                }
            };
        }
        else
        {
            source.looping = looping;

            source.loopAudio = function loopAudioFn() {
                var audio = source.audio;
                if (audio)
                {
                    if (source.looping)
                    {
                        audio.currentTime = 0;
                        audio.play();
                    }
                    else
                    {
                        source.playing = false;
                        source.sd.removePlayingSource(source);
                    }
                }
            };
        }

        Object.defineProperty(source, "tell", {
            get : function tellFn() {
                var audio = source.audio;
                if (audio)
                {
                    return audio.currentTime;
                }
                else
                {
                    return 0;
                }
            },
            enumerable : true,
            configurable : false
        });
    }

    source.relative = params.relative;
    source.position = (params.position || VMath.v3BuildZero());
    source.direction = (params.direction || VMath.v3BuildZero());
    source.velocity = (params.velocity || VMath.v3BuildZero());
    source.minDistance = (params.minDistance || 1);
    source.maxDistance = (params.maxDistance || 3.402823466e+38);
    source.rollOff = (params.rollOff || 1);

    return source;
};


//
// WebGLSoundDevice
//
function WebGLSoundDevice() { return this; }
WebGLSoundDevice.prototype =
{
    version : 1,

    vendor : "Turbulenz",

    // Public API
    createSource : function createSourceFn(params)
    {
        this.lastSourceID += 1;
        return WebGLSoundSource.create(this, this.lastSourceID, params);
    },

    createSound : function createSoundFn(params)
    {
        return WebGLSound.create(this, params);
    },

    loadSoundsArchive : function loadSoundsArchiveFn(params)
    {
        var src = params.src;
        if (typeof SoundTARLoader !== 'undefined')
        {
            SoundTARLoader.create({
                sd: this,
                src : src,
                uncompress : params.uncompress,
                onsoundload : function tarSoundLoadedFn(texture)
                {
                    params.onsoundload(texture);
                },
                onload : function soundTarLoadedFn(success /*, status */)
                {
                    if (params.onload)
                    {
                        params.onload(success);
                    }
                },
                onerror : function soundTarFailedFn()
                {
                    if (params.onload)
                    {
                        params.onload(false);
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
    },

    createEffect : function createEffectFn(/* params */)
    {
        return null;
    },

    createEffectSlot : function createEffectSlotFn(/* params */)
    {
        return null;
    },

    createFilter : function createFilterFn(/* params */)
    {
        return null;
    },

    update : function soundUpdateFn()
    {
        var sqrt = Math.sqrt;

        var listenerTransform = this.listenerTransform;
        var listenerPosition0 = listenerTransform[9];
        var listenerPosition1 = listenerTransform[10];
        var listenerPosition2 = listenerTransform[11];

        var listenerGain = this.listenerGain;

        var linearDistance = this.linearDistance;

        var playingSources = this.playingSources;
        var id;
        for (id in playingSources)
        {
            if (playingSources.hasOwnProperty(id))
            {
                var source = playingSources[id];

                // Change volume depending on distance to listener
                var minDistance = source.minDistance;
                var maxDistance = source.maxDistance;
                var position = source.position;
                var position0 = position[0];
                var position1 = position[1];
                var position2 = position[2];

                var distanceSq;
                if (source.relative)
                {
                    distanceSq = ((position0 * position0) + (position1 * position1) + (position2 * position2));
                }
                else
                {
                    var delta0 = (listenerPosition0 - position0);
                    var delta1 = (listenerPosition1 - position1);
                    var delta2 = (listenerPosition2 - position2);
                    distanceSq = ((delta0 * delta0) + (delta1 * delta1) + (delta2 * delta2));
                }

                var gainFactor;
                if (distanceSq <= (minDistance * minDistance))
                {
                    gainFactor = 1;
                }
                else if (distanceSq >= (maxDistance * maxDistance))
                {
                    gainFactor = 0;
                }
                else
                {
                    var distance = sqrt(distanceSq);
                    if (linearDistance)
                    {
                        gainFactor = ((maxDistance - distance) / (maxDistance - minDistance));
                    }
                    else
                    {
                        gainFactor = minDistance / (minDistance + (source.rollOff * (distance - minDistance)));
                    }
                }

                gainFactor *= listenerGain;

                if (source.gainFactor !== gainFactor)
                {
                    source.gainFactor = gainFactor;
                    source.updateAudioVolume();
                }
            }
        }
    },

    isSupported : function isSupportedFn(name)
    {
        if ("FILEFORMAT_OGG" === name)
        {
            return this.supportedExtensions.ogg;
        }
        else if ("FILEFORMAT_MP3" === name)
        {
            return this.supportedExtensions.mp3;
        }
        else if ("FILEFORMAT_WAV" === name)
        {
            return this.supportedExtensions.wav;
        }
        return false;
    },

    // Private API
    addLoadingSound : function addLoadingSoundFn(soundCheckCall)
    {
        var loadingSounds = this.loadingSounds;
        loadingSounds[loadingSounds.length] = soundCheckCall;

        var loadingInterval = this.loadingInterval;
        var that = this;
        if (loadingInterval === null)
        {
            this.loadingInterval = loadingInterval = window.setInterval(function checkLoadingSources() {
                var numLoadingSounds = loadingSounds.length;
                var n = 0;
                do
                {
                    var soundCheck = loadingSounds[n];
                    if (soundCheck())
                    {
                        numLoadingSounds -= 1;
                        if (n < numLoadingSounds)
                        {
                            loadingSounds[n] = loadingSounds[numLoadingSounds];
                        }
                        loadingSounds.length = numLoadingSounds;
                    }
                    else
                    {
                        n += 1;
                    }
                }
                while (n < numLoadingSounds);
                if (numLoadingSounds === 0)
                {
                    window.clearInterval(loadingInterval);
                    that.loadingInterval = null;
                }
            }, 100);
        }
    },

    addPlayingSource : function addPlayingSourceFn(source)
    {
        this.playingSources[source.id] = source;
    },

    removePlayingSource : function removePlayingSourceFn(source)
    {
        delete this.playingSources[source.id];
    },

    isResourceSupported : function isResourceSupportedFn(soundPath)
    {
        var extension = soundPath.slice(-3).toLowerCase();
        return this.supportedExtensions[extension];
    },

    destroy : function soundDeviceDestroyFn()
    {
        var loadingInterval = this.loadingInterval;
        if (loadingInterval !== null)
        {
            window.clearInterval(loadingInterval);
            this.loadingInterval = null;
        }

        var loadingSounds = this.loadingSounds;
        if (loadingSounds)
        {
            loadingSounds.length = 0;
            this.loadingSounds = null;
        }

        var playingSources = this.playingSources;
        var id;
        if (playingSources)
        {
            for (id in playingSources)
            {
                if (playingSources.hasOwnProperty(id))
                {
                    var source = playingSources[id];
                    if (source)
                    {
                        source.stop();
                    }
                }
            }
            this.playingSources = null;
        }
    }
};

// Constructor function
WebGLSoundDevice.create = function webGLSoundDeviceFn(params)
{
    var sd = new WebGLSoundDevice();

    sd.extensions = '';
    sd.renderer = 'HTML5 Audio';
    sd.alcVersion = "0";
    sd.alcExtensions = '';
    sd.alcEfxVersion = "0";
    sd.alcMaxAuxiliarySends = 0;

    sd.deviceSpecifier = (params.deviceSpecifier || null);
    sd.frequency = (params.frequency || 44100);
    sd.dopplerFactor = (params.dopplerFactor || 1);
    sd.dopplerVelocity = (params.dopplerVelocity || 1);
    sd.speedOfSound = (params.speedOfSound || 343.29998779296875);
    sd.linearDistance = (params.linearDistance !== undefined ? params.linearDistance : true);

    sd.loadingSounds = [];
    sd.loadingInterval = null;

    sd.playingSources = <WebGLSoundDeviceSourceMap><any>{};
    sd.lastSourceID = 0;

    var AudioContextConstructor = (window.AudioContext || window.webkitAudioContext);
    if (AudioContextConstructor)
    {
        var audioContext;
        try
        {
            audioContext = new AudioContextConstructor();
        }
        catch (error)
        {
            (<WebGLTurbulenzEngine>TurbulenzEngine).callOnError(
                'Failed to create AudioContext:' + error);
            return null;
        }

        if (audioContext.sampleRate === 0)
        {
            return null;
        }

        sd.renderer = 'WebAudio';
        sd.audioContext = audioContext;
        sd.frequency = audioContext.sampleRate;

        sd.gainNode = (audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode());
        sd.gainNode.connect(audioContext.destination);

        var listener = audioContext.listener;
        listener.dopplerFactor = sd.dopplerFactor;
        listener.speedOfSound = sd.speedOfSound;

        var listenerTransform, listenerVelocity;

        Object.defineProperty(sd, "listenerTransform", {
                get : function getListenerTransformFn() {
                    return listenerTransform.slice();
                },
                set : function setListenerTransformFn(transform) {
                    listenerTransform = VMath.m43Copy(transform, listenerTransform);

                    var position0 = transform[9];
                    var position1 = transform[10];
                    var position2 = transform[11];

                    listener.setPosition(position0, position1, position2);

                    listener.setOrientation(-transform[6], -transform[7], -transform[8],
                                            transform[3], transform[4], transform[5]);
                },
                enumerable : true,
                configurable : false
            });

        Object.defineProperty(sd, "listenerVelocity", {
                get : function getListenerVelocityFn() {
                    return listenerVelocity.slice();
                },
                set : function setListenerVelocityFn(velocity) {
                    listenerVelocity = VMath.v3Copy(velocity, listenerVelocity);
                    listener.setVelocity(velocity[0], velocity[1], velocity[2]);
                },
                enumerable : true,
                configurable : false
            });

        sd.update = function soundDeviceUpdate()
        {
            this.gainNode.gain.value = this.listenerGain;

            var listenerPosition0 = listenerTransform[9];
            var listenerPosition1 = listenerTransform[10];
            var listenerPosition2 = listenerTransform[11];

            var playingSources = this.playingSources;
            var stopped = [];
            var id;

            for (id in playingSources)
            {
                if (playingSources.hasOwnProperty(id))
                {
                    var source = playingSources[id];

                    var tell = (audioContext.currentTime - source.playStart);
                    if (source.bufferNode.buffer.duration < tell)
                    {
                        if (source.looping)
                        {
                            source.playStart = (audioContext.currentTime - (tell - source.bufferNode.buffer.duration));
                        }
                        else
                        {
                            source.playing = false;
                            source.sound = null;
                            source.bufferNode.disconnect();
                            source.bufferNode = null;
                            stopped[stopped.length] = id;
                            continue;
                        }
                    }

                    if (source.relative)
                    {
                        var position = source.position;
                        var pannerNode = source.pannerNode;
                        pannerNode.setPosition(position[0] + listenerPosition0,
                                               position[1] + listenerPosition1,
                                               position[2] + listenerPosition2);
                    }
                }
            }

            var numStopped = stopped.length;
            var n;
            for (n = 0; n < numStopped; n += 1)
            {
                delete playingSources[stopped[n]];
            }
        };
    }

    sd.listenerTransform = (params.listenerTransform || VMath.m43BuildIdentity());
    sd.listenerVelocity = (params.listenerVelocity || VMath.v3BuildZero());
    sd.listenerGain = (typeof params.listenerGain === "number" ? params.listenerGain : 1);

    // Need a temporary Audio element to test capabilities
    var audio = new Audio();

    if (sd.audioContext)
    {
        sd.loopingSupported = true;
    }
    else
    {
        if (audio.mozSetup)
        {
            try
            {
                audio.mozSetup(1, 22050);
            }
            catch (e)
            {
                return null;
            }
        }

        // Check for looping support
        sd.loopingSupported = (typeof audio.loop === 'boolean');
    }

    // Check for supported extensions
    var supportedExtensions = {
        ogg: false,
        mp3: false,
        wav: false,
    };
    if (audio.canPlayType('application/ogg'))
    {
        supportedExtensions.ogg = true;
    }
    if (audio.canPlayType('audio/mp3'))
    {
        supportedExtensions.mp3 = true;
    }
    if (audio.canPlayType('audio/wav'))
    {
        supportedExtensions.wav = true;
    }
    sd.supportedExtensions = supportedExtensions;

    audio = null;

    return sd;
};
