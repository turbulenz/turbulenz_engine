// Copyright (c) 2012-2013 Turbulenz Limited

//SoundSourceManager:
//Creates a pool of sound Source objects.
//An unused Source can be requested.
//A previously requested Source is deemed unused when the sound played on it has stopped,
//and there isn't a sound queued to be played pending loading.
function SoundSourceManager(soundDevice, numSoundSources)
{
    this.soundSources = [];
    this.soundSourceLoading = {};
    this.activeTokens = {};
    this.releasedCallbacks = {};
    this.requestCount = 0;

    if (!soundDevice)
    {
        return;
    }

    var i;
    var soundSources = this.soundSources;
    for (i = 0; i < numSoundSources; i += 1)
    {
        soundSources.push(soundDevice.createSource({}));
    }
}

SoundSourceManager.prototype =
{
    getSoundSourceToken : function getSoundSourceFn(onReleasedCallback)
    {
        var soundSources = this.soundSources;
        var activeTokens = this.activeTokens;
        var releasedCallbacks = this.releasedCallbacks;

        var soundSource = soundSources.pop();
        if (!soundSource)
        {
            return null;
        }

        var token = this.requestCount;
        this.requestCount += 1;

        activeTokens[token] = soundSource;
        releasedCallbacks[token] = onReleasedCallback;

        return token;
    },
    getSoundSource : function getSoundSourceFn(token)
    {
        var activeTokens = this.activeTokens;

        if (token in activeTokens)
        {
            if (activeTokens.hasOwnProperty(token))
            {
                return this.activeTokens[token];
            }
        }
        return null;
    },
    returnSoundSource : function returnSoundSourceFn(token)
    {
        var soundSources = this.soundSources;
        var activeTokens = this.activeTokens;
        var releasedCallbacks = this.releasedCallbacks;

        var soundSource = activeTokens[token];
        soundSources.push(soundSource);
        delete activeTokens[token];

        releasedCallbacks[token]();
    },
    setSoundSourceLoading : function setSoundSourceLoadingFn(token, loading)
    {
        this.soundSourceLoading[token] = loading;
    },
    checkFreeSoundSources : function checkFreeSoundSourcesFn()
    {
        var soundSourceLoading = this.soundSourceLoading;
        var activeTokens = this.activeTokens;

        var token;
        var soundSource;

        for (token in activeTokens)
        {
            if (activeTokens.hasOwnProperty(token))
            {
                soundSource = activeTokens[token];

                if (!soundSource.playing && !soundSource.paused && !soundSourceLoading[token])
                {
                    this.returnSoundSource(token);
                }
            }
        }
    }
};

SoundSourceManager.create = function soundSourceManagerCreateFn(soundDevice, numSoundSources)
{
    return new SoundSourceManager(soundDevice, numSoundSources);
};
