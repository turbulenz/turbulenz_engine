// Copyright (c) 2011-2014 Turbulenz Limited
/*global TurbulenzEngine: false*/
/*global SoundTARLoader: false*/
/*global Audio: false*/
/*global VMath: false*/
/*global window: false*/
/*global Uint8Array: false*/

"use strict";

interface WebGLSoundDeviceSoundCheckCall
{
    (): boolean;
};

interface WebGLSoundDeviceSourceMap
{
    [id: string] : boolean;
};

//
// WebGLSound
//
class WebGLSound implements Sound
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // Sound
    name         : string;
    frequency    : number;
    channels     : number;
    bitrate      : number;
    length       : number;
    compressed   : boolean;

    // WebGLSound
    forceUncompress: boolean;
    audioContext : any; // TODO
    buffer       : any; // TODO
    data         : any; // TODO
    audio        : HTMLAudioElement;
    blob         : Blob;

    destroy()
    {
        if (this.buffer)
        {
            this.buffer = null;
        }
        else if (this.audio)
        {
            var src = this.audio.src;
            if (src.indexOf("blob:") === 0)
            {
                URL.revokeObjectURL(src);
            }
            this.audio = null;
        }
        if (this.blob)
        {
            this.blob = null;
        }
    }

    static audioLoaded(sound: WebGLSound, onload: any): void
    {
        var audio = sound.audio;
        sound.frequency = ((<any>audio).sampleRate || (<any>audio).mozSampleRate || 0);
        sound.channels = ((<any>audio).channels || (<any>audio).mozChannels || 0);
        sound.bitrate = (sound.frequency * sound.channels * 2 * 8);
        sound.length = audio.duration;

        if (audio.buffered &&
            audio.buffered.length)
        {
            if (isNaN(sound.length) ||
                sound.length === Number.POSITIVE_INFINITY)
            {
                sound.length = audio.buffered.end(0);
            }

            if (onload)
            {
                if (sound.length)
                {
                    onload(sound, 200);
                }
                else
                {
                    onload(null, 0);
                }
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
                audio.volume = 1;

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
    }

    static create(sd: WebGLSoundDevice, params: any): WebGLSound
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
        var data = params.data;

        var numSamples, numChannels, samplerRate;

        var audioContext = sd.audioContext;
        var xhr: XMLHttpRequest;
        if (audioContext && (sound.forceUncompress || params.uncompress))
        {
            var buffer;
            if (soundPath)
            {
                if (!sd.isResourceSupported(soundPath))
                {
                    if (onload)
                    {
                        onload(null, 0);
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
                            onload(null, 0);
                        }
                    }
                };

                var bufferFailed = function bufferFailedFn()
                {
                    if (onload)
                    {
                        onload(null, 0);
                    }
                };

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
                            onload(null, 0);
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
                                //var xhrStatusText = (xhrStatus !== 0 && xhr.statusText || 'No connection');
                                var response = xhr.response;

                                // Sometimes the browser sets status to 200 OK when the connection is closed
                                // before the message is sent (weird!).
                                // In order to address this we fail any completely empty responses.
                                // Hopefully, nobody will get a valid response with no headers and no body!
                                if (xhr.getAllResponseHeaders() === "" && !response)
                                {
                                    if (onload)
                                    {
                                        onload(null, 0);
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
                                        onload(null, xhrStatus);
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
                        /* tslint:disable:no-bitwise */
                        var bufferLength = ((numSamples / (ratio * numChannels)) | 0);
                        /* tslint:enable:no-bitwise */

                        buffer = audioContext.createBuffer(numChannels, bufferLength, contextSampleRate);

                        // De-interleave data
                        for (c = 0; c < numChannels; c += 1)
                        {
                            channel = buffer.getChannelData(c);
                            for (j = 0; j < bufferLength; j += 1)
                            {
                                /* tslint:disable:no-bitwise */
                                channel[j] = data[c + (((j * ratio) | 0) * numChannels)];
                                /* tslint:enable:no-bitwise */
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

                audio = new Audio();
                audio.preload = 'auto';
                audio.autobuffer = true;

                audio.onerror = function loadingSoundFailedFn(/* e */)
                {
                    if (onload)
                    {
                        onload(null, 0);
                        onload = null;
                    }
                };

                sound.audio = audio;

                var checkLoaded = function checkLoadedFn() {
                    if (3 <= audio.readyState)
                    {
                        WebGLSound.audioLoaded(sound, onload);
                        return true;
                    }
                    return false;
                };

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
                    if (typeof Blob !== "undefined" && typeof URL !== "undefined" && URL.createObjectURL)
                    {
                        var dataBlob;
                        if (dataArray[0] === 79 &&
                            dataArray[1] === 103 &&
                            dataArray[2] === 103 &&
                            dataArray[3] === 83)
                        {
                            extension = 'ogg';
                            dataBlob = new Blob([dataArray], {type: "audio/ogg"});
                        }
                        else if (dataArray[0] === 82 &&
                                 dataArray[1] === 73 &&
                                 dataArray[2] === 70 &&
                                 dataArray[3] === 70)
                        {
                            extension = 'wav';
                            dataBlob = new Blob([dataArray], {type: "audio/wav"});
                        }
                        else
                        {
                            // Assume it's an mp3?
                            extension = 'mp3';
                            dataBlob = new Blob([dataArray], {type: "audio/mpeg"});
                        }
                        debug.assert(dataArray.length === dataBlob.size,
                                    "Blob constructor does not support typed arrays.");
                        sound.blob = dataBlob;
                        soundPath = URL.createObjectURL(dataBlob);
                    }
                    else
                    {
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
                }
                else if (typeof URL !== "undefined" && URL.createObjectURL)
                {
                    if (!sd.supportedExtensions[extension])
                    {
                        if (onload)
                        {
                            onload(null, 0);
                        }
                        return null;
                    }

                    xhr = new XMLHttpRequest();
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
                                    if (onload)
                                    {
                                        onload(null, 0);
                                    }
                                }
                                else
                                {
                                    if (xhrStatus === 200 || xhrStatus === 0)
                                    {
                                        sound.blob = xhr.response;
                                        if (sound.blob.type === 'audio/x-mpg')
                                        {
                                            sound.blob = sound.blob.slice(0, sound.blob.size, 'audio/mpeg');
                                        }
                                        audio.src = URL.createObjectURL(sound.blob);

                                        sd.addLoadingSound(checkLoaded);
                                    }
                                    else if (onload)
                                    {
                                        onload(null, xhrStatus);
                                    }
                                }
                                xhr.onreadystatechange = null;
                                xhr = null;
                            }
                        }
                    };
                    xhr.open('GET', soundPath, true);
                    xhr.responseType = 'blob';
                    xhr.send();

                    return sound;
                }

                if (!sd.supportedExtensions[extension])
                {
                    if (onload)
                    {
                        onload(null, 0);
                    }
                    return null;
                }

                audio.src = soundPath;

                sd.addLoadingSound(checkLoaded);

                return sound;
            }
            else
            {
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
            onload(null, 0);
        }

        return null;
    }
}

//
// WebGLSoundGlobalSource
//
class WebGLSoundGlobalSource implements SoundGlobalSource
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // SoundGlobalSource
    gain        : number;
    looping     : boolean;
    pitch       : number;
    playing     : boolean;
    paused      : boolean;
    tell        : number;

    // WebGLSoundGlobalSource
    _gain        : number;
    _looping     : boolean;
    _pitch       : number;
    sd: WebGLSoundDevice;
    id: number;
    sound: WebGLSound;
    audioContext: any; // window.AudioContext || window.webkitAudioContext
    bufferNode: any; // window.AudioContext.createbufferSource()
    mediaNode: any; // window.AudioContext.createMediaElementSource()
    playStart: number;
    playPaused: number;
    _gainNode: any; // window.AudioContext.createGain()
    audio: HTMLAudioElement;

    updateAudioVolume: { (): void; };
    loopAudio: { (): void; };

    // Public API
    play(sound: Sound, seek?: number)
    {
        if (seek === undefined)
        {
            seek = 0;
        }

        if (this.sound === sound)
        {
            return this.seek(seek);
        }

        if (this.playing)
        {
            this._stop();
        }

        this.sound = <WebGLSound>sound;

        var soundAudio = (<WebGLSound>sound).audio;
        if (soundAudio)
        {
            if ((<WebGLSound>sound).data)
            {
                soundAudio = new Audio();
                soundAudio.mozSetup(sound.channels, sound.frequency);
            }
            else
            {
                soundAudio = <HTMLAudioElement>(soundAudio.cloneNode(true));
            }

            this.audio = soundAudio;

            soundAudio.loop = this._looping;

            soundAudio.addEventListener('ended', this.loopAudio, false);

            if (0.05 < seek)
            {
                try
                {
                    soundAudio.currentTime = seek;
                }
                catch (e)
                {
                    // It seems there is no reliable way of seeking
                }
            }
        }

        var audioContext = this.audioContext;
        if (audioContext)
        {
            if (soundAudio)
            {
                this._createMediaNode(<WebGLSound>sound, soundAudio);
            }
            else
            {
                var bufferNode = this._createBufferNode(<WebGLSound>sound);

                if (0 < seek)
                {
                    var buffer = (<WebGLSound>sound).buffer;
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
        }

        if (soundAudio)
        {
            if ((<WebGLSound>sound).data)
            {
                (<any>soundAudio).mozWriteAudio((<WebGLSound>sound).data);
            }
            else
            {
                if (this.updateAudioVolume)
                {
                    this.updateAudioVolume();
                }
                soundAudio.play();
            }
        }

        this.playing = true;
        this.paused = false;

        this.sd.addPlayingSource(this);

        return true;
    }

    _stop(): void
    {
        this.playing = false;
        this.paused = false;
        this.sound = null;

        var audio = this.audio;
        if (audio)
        {
            this.audio = null;

            var mediaNode = this.mediaNode;
            if (mediaNode)
            {
                this.mediaNode = null;
                mediaNode.disconnect();
            }

            audio.pause();
            audio.removeEventListener('ended', this.loopAudio, false);
        }
        else
        {
            var bufferNode = this.bufferNode;
            if (bufferNode)
            {
                this.bufferNode = null;
                bufferNode.stop(0);
                bufferNode.disconnect();
            }
        }
    }

    stop(): boolean
    {
        var playing = this.playing;
        if (playing)
        {
            this._stop();

            this.sd.removePlayingSource(this);
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

                var audio = this.audio;
                if (audio)
                {
                    audio.pause();
                }
                else
                {
                    var bufferNode = this.bufferNode;
                    if (bufferNode)
                    {
                        this.bufferNode = null;
                        this.playPaused = this.audioContext.currentTime;
                        bufferNode.stop(0);
                        bufferNode.disconnect();
                    }
                }

                this.sd.removePlayingSource(this);
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

            var audio = this.audio;
            if (audio)
            {
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
                            // It seems there is no reliable way of seeking
                        }
                    }
                }

                audio.play();
            }
            else
            {
                var audioContext = this.audioContext;
                if (audioContext)
                {
                    if (seek === undefined)
                    {
                        seek = (this.playPaused - this.playStart);
                    }

                    var bufferNode = this._createBufferNode(this.sound);

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
            }

            this.sd.addPlayingSource(this);

            return true;
        }

        return false;
    }

    rewind()
    {
        if (this.playing)
        {
            var audio = this.audio;
            if (audio)
            {
                audio.currentTime = 0;

                return true;
            }
            else
            {
                var audioContext = this.audioContext;
                if (audioContext)
                {
                    var bufferNode = this.bufferNode;
                    if (bufferNode)
                    {
                        bufferNode.stop(0);
                        bufferNode.disconnect();
                    }

                    bufferNode = this._createBufferNode(this.sound);

                    bufferNode.start(0);

                    this.playStart = audioContext.currentTime;

                    return true;
                }
            }
        }

        return false;
    }

    seek(seek: number): boolean
    {
        if (this.playing)
        {
            var tell = this.tell;
            var delta = Math.abs(tell - seek);
            if (this._looping)
            {
                delta = Math.min(Math.abs(tell - (this.sound.length + seek)), delta);
            }

            if (0.05 < delta)
            {
                var audio = this.audio;
                if (audio)
                {
                    try
                    {
                        audio.currentTime = seek;
                    }
                    catch (e)
                    {
                        // It seems there is no reliable way of seeking
                    }
                }
                else
                {
                    var audioContext = this.audioContext;
                    if (audioContext)
                    {
                        var bufferNode = this.bufferNode;
                        if (bufferNode)
                        {
                            bufferNode.stop(0);
                            bufferNode.disconnect();
                        }

                        bufferNode = this._createBufferNode(this.sound);

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
                }
            }

            return true;
        }

        return false;
    }

    clear()
    {
        this.stop();
    }

    setAuxiliarySendFilter(index: number,
                           effectSlot: SoundEffectSlot,
                           filter: SoundFilter)
    {
        return false;
    }

    setDirectFilter(filter: SoundFilter)
    {
        return false;
    }

    destroy()
    {
        this.stop();

        var gainNode = this._gainNode;
        if (gainNode)
        {
            this._gainNode = null;
            gainNode.disconnect();
        }
    }

    _createBufferNode(sound: WebGLSound): any
    {
        var buffer = sound.buffer;

        var bufferNode = this.audioContext.createBufferSource();
        bufferNode.buffer = buffer;
        bufferNode.loop = this._looping;
        if (bufferNode.playbackRate)
        {
            bufferNode.playbackRate.value = this._pitch;
        }
        bufferNode.connect(this._gainNode);

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
    }

    _checkBufferNode(currentTime: number): boolean
    {
        var bufferNode = this.bufferNode;
        if (bufferNode)
        {
            var tell = (currentTime - this.playStart);
            var duration = bufferNode.buffer.duration;
            if (duration < tell)
            {
                if (this._looping)
                {
                    this.playStart = (currentTime - (tell - duration));
                }
                else
                {
                    bufferNode.disconnect();
                    this.playing = false;
                    this.sound = null;
                    this.bufferNode = null;

                    return false;
                }
            }
        }

        return true;
    }

    _createMediaNode(sound: WebGLSound, audio: HTMLAudioElement): void
    {
        var mediaNode = this.audioContext.createMediaElementSource(audio);
        mediaNode.connect(this._gainNode);

        this.mediaNode = mediaNode;
    }

    static create(sd: WebGLSoundDevice, id: number,
                  params: SoundGlobalSourceParameters): WebGLSoundGlobalSource
    {
        var source = new WebGLSoundGlobalSource();

        source.sd = sd;
        source.id = id;

        source.sound = null;
        source.audio = null;
        source.playing = false;
        source.paused = false;

        source._gain = (typeof params.gain === "number" ? params.gain : 1);
        source._looping = (params.looping || false);
        source._pitch = (params.pitch || 1);

        var audioContext = sd.audioContext;
        if (audioContext)
        {
            source.bufferNode = null;
            source.mediaNode = null;
            source.playStart = -1;
            source.playPaused = -1;

            var masterGainNode = sd._gainNode;

            var gainNode = (audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode());
            gainNode.gain.value = source._gain;
            source._gainNode = gainNode;
            gainNode.connect(masterGainNode);

            Object.defineProperty(source, "gain", {
                get : function getGainFn() {
                    return this._gain;
                },
                set : function setGainFn(newGain) {
                    if (this._gain !== newGain)
                    {
                        this._gain = newGain;
                        this._gainNode.gain.value = newGain;
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "looping", {
                get : function getLoopingFn() {
                    return this._looping;
                },
                set : function setLoopingFn(newLooping) {
                    this._looping = newLooping;
                    var audio = this.audio;
                    if (audio)
                    {
                        audio.loop = newLooping;
                    }
                    else
                    {
                        var bufferNode = this.bufferNode;
                        if (bufferNode)
                        {
                            bufferNode.loop = newLooping;
                        }
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "pitch", {
                get : function getPitchFn() {
                    return this._pitch;
                },
                set : function setPitchFn(newPitch) {
                    this._pitch = newPitch;
                    var audio = this.audio;
                    if (audio)
                    {
                        audio.playbackRate = newPitch;
                    }
                    else
                    {
                        var bufferNode = this.bufferNode;
                        if (bufferNode)
                        {
                            if (bufferNode.playbackRate)
                            {
                                bufferNode.playbackRate.value = newPitch;
                            }
                        }
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "tell", {
                get : function tellFn() {
                    if (this.playing)
                    {
                        var audio = this.audio;
                        if (audio)
                        {
                            return audio.currentTime;
                        }
                        else
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
                    }
                    else
                    {
                        return 0;
                    }
                },
                enumerable : true,
                configurable : false
            });

            source.loopAudio = function loopAudioFn() {
                source.stop();
            };
        }
        else
        {
            source.updateAudioVolume = function updateAudioVolumeFn()
            {
                var audio = this.audio;
                if (audio)
                {
                    var volume = Math.min(this._gain, 1);
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

            Object.defineProperty(source, "gain", {
                get : function getGainFn() {
                    return this._gain;
                },
                set : function setGainFn(newGain) {
                    if (this._gain !== newGain)
                    {
                        this._gain = newGain;
                        this.updateAudioVolume();
                    }
                },
                enumerable : true,
                configurable : false
            });

            if (sd.loopingSupported)
            {
                Object.defineProperty(source, "looping", {
                    get : function getLoopingFn() {
                        return this._looping;
                    },
                    set : function setLoopingFn(newLooping) {
                        this._looping = newLooping;
                        var audio = this.audio;
                        if (audio)
                        {
                            audio.loop = newLooping;
                        }
                    },
                    enumerable : true,
                    configurable : false
                });

                source.loopAudio = function loopAudioFn() {
                    source.stop();
                };
            }
            else
            {
                source.looping = source._looping;

                source.loopAudio = function loopAudioFn() {
                    var audio = source.audio;
                    if (audio)
                    {
                        if (this.looping)
                        {
                            audio.currentTime = 0;
                            audio.play();
                        }
                        else
                        {
                            source.stop();
                        }
                    }
                };
            }

            Object.defineProperty(source, "pitch", {
                get : function getPitchFn() {
                    return this._pitch;
                },
                set : function setPitchFn(newPitch) {
                    this._pitch = newPitch;
                    var audio = this.audio;
                    if (audio)
                    {
                        audio.playbackRate = newPitch;
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "tell", {
                get : function tellFn() {
                    if (this.playing)
                    {
                        var audio = this.audio;
                        if (audio)
                        {
                            return audio.currentTime;
                        }
                    }
                    return 0;
                },
                enumerable : true,
                configurable : false
            });
        }

        return source;
    }
}

//
// WebGLSoundSource
//
class WebGLSoundSource extends WebGLSoundGlobalSource implements SoundSource
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // SoundSource
    position    : any; // v3
    velocity    : any; // v3
    direction   : any; // v3
    minDistance : number;
    maxDistance : number;
    rollOff     : number;
    relative    : boolean;

    // WebGLSoundSource
    _position: any; // v3
    _velocity: any; // v3
    _direction: any; // v3
    _pannerNode: any; // window.AudioContext.createPanner()
    _gainFactor: number;

    updateRelativePosition: { (lp0: number, lp1: number, lp2: number): void; };

    _updateRelativePositionWebAudio(listenerPosition0,
                                    listenerPosition1,
                                    listenerPosition2)
    {
        var position = this._position;
        this._pannerNode.setPosition(position[0] + listenerPosition0,
                                    position[1] + listenerPosition1,
                                    position[2] + listenerPosition2);
    }

    _updateRelativePositionHTML5(listenerPosition0,
                                 listenerPosition1,
                                 listenerPosition2)
    {
        // Change volume depending on distance to listener
        var minDistance = this.minDistance;
        var maxDistance = this.maxDistance;
        var position = this._position;
        var position0 = position[0];
        var position1 = position[1];
        var position2 = position[2];

        var distanceSq;
        if (this.relative)
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
            var distance = Math.sqrt(distanceSq);
            if (this.sd.linearDistance)
            {
                gainFactor = ((maxDistance - distance) / (maxDistance - minDistance));
            }
            else
            {
                gainFactor = minDistance / (minDistance + (this.rollOff * (distance - minDistance)));
            }
        }

        gainFactor *= this.sd.listenerGain;

        if (this._gainFactor !== gainFactor)
        {
            this._gainFactor = gainFactor;
            this.updateAudioVolume();
        }
    }

    // Public API
    destroy()
    {
        this.stop();

        var gainNode = this._gainNode;
        if (gainNode)
        {
            this._gainNode = null;
            gainNode.disconnect();
        }

        var pannerNode = this._pannerNode;
        if (pannerNode)
        {
            this._pannerNode = null;
            pannerNode.disconnect();
        }
    }

    static create(sd: WebGLSoundDevice, id: number,
                  params: SoundSourceParameters): WebGLSoundSource
    {
        var source = new WebGLSoundSource();

        source.sd = sd;
        source.id = id;

        source.sound = null;
        source.audio = null;
        source.playing = false;
        source.paused = false;

        var buffer = new Float32Array(9);
        source._position = buffer.subarray(0, 3);
        source._velocity = buffer.subarray(3, 6);
        source._direction = buffer.subarray(6, 9);

        source._gain = (typeof params.gain === "number" ? params.gain : 1);
        source._looping = (params.looping || false);
        source._pitch = (params.pitch || 1);

        var audioContext = sd.audioContext;
        if (audioContext)
        {
            source.bufferNode = null;
            source.mediaNode = null;
            source.playStart = -1;
            source.playPaused = -1;

            var masterGainNode = sd._gainNode;

            var pannerNode = audioContext.createPanner();
            source._pannerNode = pannerNode;
            pannerNode.connect(masterGainNode);

            var gainNode = (audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode());
            gainNode.gain.value = source._gain;
            source._gainNode = gainNode;
            gainNode.connect(pannerNode);

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

            source.updateRelativePosition = source._updateRelativePositionWebAudio;

            Object.defineProperty(source, "position", {
                get : function getPositionFn() {
                    return this._position.slice();
                },
                set : function setPositionFn(newPosition) {
                    var oldPosition = this._position;
                    if (oldPosition[0] !== newPosition[0] ||
                        oldPosition[1] !== newPosition[1] ||
                        oldPosition[2] !== newPosition[2])
                    {
                        oldPosition[0] = newPosition[0];
                        oldPosition[1] = newPosition[1];
                        oldPosition[2] = newPosition[2];
                        if (!this.relative)
                        {
                            this._pannerNode.setPosition(newPosition[0], newPosition[1], newPosition[2]);
                        }
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "direction", {
                get : function getDirectionFn() {
                    return this._direction.slice();
                },
                set : function setDirectionFn(newDirection) {
                    this._direction = VMath.v3Copy(newDirection, this._direction);
                    this._pannerNode.setOrientation(newDirection[0], newDirection[1], newDirection[2]);
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "velocity", {
                get : function getVelocityFn() {
                    return this._velocity.slice();
                },
                set : function setVelocityFn(newVelocity) {
                    this._velocity = VMath.v3Copy(newVelocity, this._velocity);
                    this._pannerNode.setVelocity(newVelocity[0], newVelocity[1], newVelocity[2]);
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "gain", {
                get : function getGainFn() {
                    return this._gain;
                },
                set : function setGainFn(newGain) {
                    if (this._gain !== newGain)
                    {
                        this._gain = newGain;
                        this._gainNode.gain.value = newGain;
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "looping", {
                get : function getLoopingFn() {
                    return this._looping;
                },
                set : function setLoopingFn(newLooping) {
                    this._looping = newLooping;
                    var audio = this.audio;
                    if (audio)
                    {
                        audio.loop = newLooping;
                    }
                    else
                    {
                        var bufferNode = this.bufferNode;
                        if (bufferNode)
                        {
                            bufferNode.loop = newLooping;
                        }
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "pitch", {
                get : function getPitchFn() {
                    return this._pitch;
                },
                set : function setPitchFn(newPitch) {
                    this._pitch = newPitch;
                    var audio = this.audio;
                    if (audio)
                    {
                        audio.playbackRate = newPitch;
                    }
                    else
                    {
                        var bufferNode = this.bufferNode;
                        if (bufferNode)
                        {
                            if (bufferNode.playbackRate)
                            {
                                bufferNode.playbackRate.value = newPitch;
                            }
                        }
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "tell", {
                get : function tellFn() {
                    if (this.playing)
                    {
                        var audio = this.audio;
                        if (audio)
                        {
                            return audio.currentTime;
                        }
                        else
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
                    return this._pannerNode.refDistance;
                },
                set : function setMinDistanceFn(minDistance) {
                    if (this._pannerNode.maxDistance === minDistance)
                    {
                        minDistance = this._pannerNode.maxDistance * 0.999;
                    }
                    this._pannerNode.refDistance = minDistance;
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "maxDistance", {
                get : function getMaxDistanceFn() {
                    return this._pannerNode.maxDistance;
                },
                set : function setMaxDistanceFn(maxDistance) {
                    if (this._pannerNode.refDistance === maxDistance)
                    {
                        maxDistance = this._pannerNode.refDistance * 1.001;
                    }
                    this._pannerNode.maxDistance = maxDistance;
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "rollOff", {
                get : function getRolloffFactorFn() {
                    return this._pannerNode.rolloffFactor;
                },
                set : function setRolloffFactorFn(rollOff) {
                    this._pannerNode.rolloffFactor = rollOff;
                },
                enumerable : true,
                configurable : false
            });

            source.loopAudio = function loopAudioFn() {
                source.stop();
            };
        }
        else
        {
            source._gainFactor = 1;

            source.updateAudioVolume = function updateAudioVolumeFn()
            {
                var audio = this.audio;
                if (audio)
                {
                    var volume = Math.min((this._gainFactor * this._gain), 1);
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

            source.updateRelativePosition = source._updateRelativePositionHTML5;

            Object.defineProperty(source, "position", {
                get : function getPositionFn() {
                    return this._position.slice();
                },
                set : function setPositionFn(newPosition) {
                    this._position = VMath.v3Copy(newPosition, this._position);
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "direction", {
                get : function getDirectionFn() {
                    return this._direction.slice();
                },
                set : function setDirectionFn(newDirection) {
                    this._direction = VMath.v3Copy(newDirection, this._direction);
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "velocity", {
                get : function getVelocityFn() {
                    return this._velocity.slice();
                },
                set : function setVelocityFn(newVelocity) {
                    this._velocity = VMath.v3Copy(newVelocity, this._velocity);
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "gain", {
                get : function getGainFn() {
                    return this._gain;
                },
                set : function setGainFn(newGain) {
                    if (this._gain !== newGain)
                    {
                        this._gain = newGain;
                        this.updateAudioVolume();
                    }
                },
                enumerable : true,
                configurable : false
            });

            if (sd.loopingSupported)
            {
                Object.defineProperty(source, "looping", {
                    get : function getLoopingFn() {
                        return this._looping;
                    },
                    set : function setLoopingFn(newLooping) {
                        this._looping = newLooping;
                        var audio = this.audio;
                        if (audio)
                        {
                            audio.loop = newLooping;
                        }
                    },
                    enumerable : true,
                    configurable : false
                });

                source.loopAudio = function loopAudioFn() {
                    source.stop();
                };
            }
            else
            {
                source.looping = source._looping;

                source.loopAudio = function loopAudioFn() {
                    var audio = source.audio;
                    if (audio)
                    {
                        if (this.looping)
                        {
                            audio.currentTime = 0;
                            audio.play();
                        }
                        else
                        {
                            source.stop();
                        }
                    }
                };
            }

            Object.defineProperty(source, "pitch", {
                get : function getPitchFn() {
                    return this._pitch;
                },
                set : function setPitchFn(newPitch) {
                    this._pitch = newPitch;
                    var audio = this.audio;
                    if (audio)
                    {
                        audio.playbackRate = newPitch;
                    }
                },
                enumerable : true,
                configurable : false
            });

            Object.defineProperty(source, "tell", {
                get : function tellFn() {
                    if (this.playing)
                    {
                        var audio = this.audio;
                        if (audio)
                        {
                            return audio.currentTime;
                        }
                    }
                    return 0;
                },
                enumerable : true,
                configurable : false
            });
        }

        source.relative = (params.relative || false);
        source.minDistance = (params.minDistance || 1);
        source.maxDistance = (params.maxDistance || 3.402823466e+38);
        source.rollOff = (params.rollOff || 1);

        if (params.position)
        {
            source.position = params.position;
        }
        if (params.velocity)
        {
            source.velocity = params.velocity;
        }
        if (params.direction)
        {
            source.direction = params.direction;
        }

        return source;
    }
}

interface WebGLSoundDeviceExtensions
{
    ogg: boolean;
    mp3: boolean;
    wav: boolean;
}

//
// WebGLSoundDevice
//
class WebGLSoundDevice implements SoundDevice
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    // SoundDevice
    vendor               : string; // prototype
    renderer             : string;
    /* tslint:disable:no-duplicate-variable */
    version              : string;
    /* tslint:enable:no-duplicate-variable */
    deviceSpecifier      : string;
    extensions           : string;
    listenerTransform    : any; // m43
    listenerVelocity     : any; // v3
    listenerGain         : number;
    frequency            : number;
    dopplerFactor        : number;
    dopplerVelocity      : number;
    speedOfSound         : number;
    alcVersion           : string;
    alcExtensions        : string;
    alcEfxVersion        : string;
    alcMaxAuxiliarySends : number;

    // WebGLSoundDevice
    _listenerTransform   : any; // m43
    _listenerVelocity    : any; // v3
    audioContext         : any;   //
    _gainNode            : any;   //
    linearDistance       : boolean;
    loadingSounds        : WebGLSoundDeviceSoundCheckCall[];
    loadingInterval      : number;  // window.setIntervalID id
    numPlayingSources    : number;
    playingSources       : WebGLSoundSource[];
    playingSourcesMap    : WebGLSoundDeviceSourceMap;
    lastSourceID         : number;
    loopingSupported     : boolean;
    supportedExtensions  : WebGLSoundDeviceExtensions;

    update: { (): void; };

    // Public API
    createSource(params)
    {
        this.lastSourceID += 1;
        return WebGLSoundSource.create(this, this.lastSourceID, params);
    }

    createGlobalSource(params)
    {
        this.lastSourceID += 1;
        return WebGLSoundGlobalSource.create(this, this.lastSourceID, params);
    }

    createSound(params)
    {
        return WebGLSound.create(this, params);
    }

    loadSoundsArchive(params: SoundArchiveParameters)
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
                onload : function soundTarLoadedFn(success, status)
                {
                    if (params.onload)
                    {
                        params.onload(success, status);
                    }
                },
                onerror : function soundTarFailedFn(status)
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

    createEffect(params: SoundEffectParameters): SoundEffect
    {
        return null;
    }

    createEffectSlot(params: SoundEffectSlotParameters): SoundEffectSlot
    {
        return null;
    }

    createFilter(params: SoundFilterParameters): SoundFilter
    {
        return null;
    }

    _updateHTML5(): void
    {
        var listenerTransform = this._listenerTransform;
        var listenerPosition0 = listenerTransform[9];
        var listenerPosition1 = listenerTransform[10];
        var listenerPosition2 = listenerTransform[11];

        var numPlayingSources = this.numPlayingSources;
        var playingSources = this.playingSources;
        var n;
        for (n = 0; n < numPlayingSources; n += 1)
        {
            var source = playingSources[n];
            if (source.updateRelativePosition)
            {
                source.updateRelativePosition(listenerPosition0,
                                              listenerPosition1,
                                              listenerPosition2);
            }
        }
    }

    _updateWebAudio(): void
    {
        this._gainNode.gain.value = this.listenerGain;

        var listenerTransform = this._listenerTransform;
        var listenerPosition0 = listenerTransform[9];
        var listenerPosition1 = listenerTransform[10];
        var listenerPosition2 = listenerTransform[11];

        var numPlayingSources = this.numPlayingSources;
        var playingSources = this.playingSources;
        var playingSourcesMap = this.playingSourcesMap;

        var currentTime = this.audioContext.currentTime;

        var n = 0;
        while (n < numPlayingSources)
        {
            var source = playingSources[n];

            if (!source._checkBufferNode(currentTime))
            {
                numPlayingSources -= 1;
                playingSources[n] = playingSources[numPlayingSources];
                playingSources[numPlayingSources] = null;
                delete playingSourcesMap[source.id];

                continue;
            }

            if (source.relative)
            {
                source.updateRelativePosition(listenerPosition0,
                                              listenerPosition1,
                                              listenerPosition2);
            }

            n += 1;
        }

        this.numPlayingSources = numPlayingSources;
        /* tslint:disable:no-bitwise */
        if (numPlayingSources < (playingSources.length >> 1))
        {
            playingSources.length = numPlayingSources;
        }
        /* tslint:enable:no-bitwise */
    }

    isSupported(name): boolean
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
    }

    // Private API
    addLoadingSound(soundCheckCall): void
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
    }

    addPlayingSource(source)
    {
        var id = source.id;
        if (!this.playingSourcesMap[id])
        {
            this.playingSourcesMap[id] = true;
            var numPlayingSources = this.numPlayingSources;
            this.playingSources[numPlayingSources] = source;
            this.numPlayingSources = (numPlayingSources + 1);
        }
    }

    removePlayingSource(source)
    {
        delete this.playingSourcesMap[source.id];

        var numPlayingSources = this.numPlayingSources;
        var playingSources = this.playingSources;
        var n;
        for (n = 0; n < numPlayingSources; n += 1)
        {
            if (playingSources[n] === source)
            {
                numPlayingSources -= 1;
                playingSources[n] = playingSources[numPlayingSources];
                playingSources[numPlayingSources] = null;
                this.numPlayingSources = numPlayingSources;
                break;
            }
        }
    }

    isResourceSupported(soundPath)
    {
        var extension = soundPath.slice(-3).toLowerCase();
        return this.supportedExtensions[extension];
    }

    destroy()
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

        var numPlayingSources = this.numPlayingSources;
        var playingSources = this.playingSources;
        var n;
        for (n = 0; n < numPlayingSources; n += 1)
        {
            playingSources[n]._stop();
        }

        this.numPlayingSources = 0;
        this.playingSources = null;
        this.playingSourcesMap = null;

        WebGLSound.prototype.audioContext = null;
        WebGLSoundSource.prototype.audioContext = null;
        WebGLSoundGlobalSource.prototype.audioContext = null;
    }

    static create(params: SoundDeviceParameters): WebGLSoundDevice
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

        sd.numPlayingSources = 0;
        sd.playingSources = [];
        sd.playingSourcesMap = <WebGLSoundDeviceSourceMap><any>{};

        sd.lastSourceID = 0;

        var AudioContextConstructor;

        if (sd.deviceSpecifier !== "audioelement")
        {
            AudioContextConstructor =
                (window.AudioContext || window.webkitAudioContext);
        }

        var listener = null;
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

            // HTML5 + WebAudio just does not work on Android or iOS
            // and it seems to crash Chrome and perform poorly on Firefox...
            //WebGLSound.prototype.forceUncompress = (TurbulenzEngine.getSystemInfo().platformProfile !== 'desktop' ||
            //                                        !audioContext.createMediaElementSource);
            WebGLSound.prototype.forceUncompress = true;

            WebGLSound.prototype.audioContext = audioContext;
            WebGLSoundSource.prototype.audioContext = audioContext;
            WebGLSoundGlobalSource.prototype.audioContext = audioContext;

            sd.renderer = 'WebAudio';
            sd.audioContext = audioContext;
            sd.frequency = audioContext.sampleRate;

            sd._gainNode = (audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode());
            sd._gainNode.connect(audioContext.destination);

            listener = audioContext.listener;
            listener.dopplerFactor = sd.dopplerFactor;
            listener.speedOfSound = sd.speedOfSound;

            sd.update = sd._updateWebAudio;
        }
        else
        {
            sd.update = sd._updateHTML5;
            WebGLSound.prototype.forceUncompress = false;
        }

        sd._listenerTransform = (params.listenerTransform ?
                                 VMath.m43Copy(params.listenerTransform) :
                                 VMath.m43BuildIdentity());
        sd._listenerVelocity = (params.listenerVelocity ?
                                VMath.v3Copy(params.listenerVelocity) :
                                VMath.v3BuildZero());

        Object.defineProperty(sd, "listenerTransform", {
            get : function getListenerTransformFn() {
                return this._listenerTransform.slice();
            },
            set : function setListenerTransformFn(transform) {
                this._listenerTransform = VMath.m43Copy(transform, this._listenerTransform);
                if (listener)
                {
                    var position0 = transform[9];
                    var position1 = transform[10];
                    var position2 = transform[11];

                    listener.setPosition(position0, position1, position2);

                    listener.setOrientation(-transform[6], -transform[7], -transform[8],
                                            transform[3], transform[4], transform[5]);
                }
            },
            enumerable : true,
            configurable : false
        });

        Object.defineProperty(sd, "listenerVelocity", {
            get : function getListenerVelocityFn() {
                return this._listenerVelocity.slice();
            },
            set : function setListenerVelocityFn(velocity) {
                this._listenerVelocity = VMath.v3Copy(velocity, this._listenerVelocity);
                if (listener)
                {
                    listener.setVelocity(velocity[0], velocity[1], velocity[2]);
                }
            },
            enumerable : true,
            configurable : false
        });

        sd.listenerGain = (typeof params.listenerGain === "number" ? params.listenerGain : 1);

        // Need a temporary Audio element to test capabilities
        var audio;
        try
        {
            audio = new Audio();
        }
        catch (error)
        {
            (<WebGLTurbulenzEngine>TurbulenzEngine).callOnError(
                'Failed to create Audio:' + error);
            return null;
        }

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
        var supportedExtensions : WebGLSoundDeviceExtensions = {
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
    }
}

WebGLSoundDevice.prototype.vendor = "Turbulenz";
