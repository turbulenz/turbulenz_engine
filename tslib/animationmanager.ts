// Copyright (c) 2010-2012 Turbulenz Limited

/*global TurbulenzEngine: false*/

/// <reference path="animation.ts" />
/// <reference path="debug.ts" />

// -----------------------------------------------------------------------------

interface AnimationList { [name: string]: Animation; };

class AnimationManager
{
    static version = 1;

    mathDevice: MathDevice;

    // Methods
    loadFile(path: string, callback: any)
    { debug.abort("abstract method"); };
    loadData(data: any, prefix?: string)
    { debug.abort("abstract method"); };
    get(name: string): Animation
    { debug.abort("abstract method"); return null; };
    remove(name: string)
    { debug.abort("abstract method"); };
    nodeHasSkeleton(node: Node): Skeleton
    { debug.abort("abstract method"); return null; };
    getAll(): AnimationList
    { debug.abort("abstract method"); return null; };
    setPathRemapping(prm: any, assetUrl: string)
    { debug.abort("abstract method"); };

    static create(errorCallback?: { (msg: string): void; },
                  log?          : HTMLElement              ): AnimationManager
    {
        if (!errorCallback)
        {
            errorCallback = function (msg) {};
        }

        var animations : AnimationList = {};
        var pathRemapping = null;
        var pathPrefix = "";

        var loadAnimationData = function loadAnimationDataFn(data, prefix?)
        {
            var fileAnimations = data.animations;
            var a;
            for (a in fileAnimations)
            {
                if (fileAnimations.hasOwnProperty(a))
                {
                    var name = prefix ? prefix + a : a;
                    if (animations[name])
                    {
                        fileAnimations[a] = animations[name];
                        continue;
                    }
                    var anim = fileAnimations[a];

                    var numNodes = anim.numNodes;
                    var nodeDataArray = anim.nodeData;
                    var n;
                    for (n = 0; n < numNodes; n += 1)
                    {
                        var nodeData = nodeDataArray[n];
                        var baseframe = nodeData.baseframe;

                        if (baseframe)
                        {
                            if (baseframe.rotation)
                            {
                                baseframe.rotation = this.mathDevice.quatBuild(baseframe.rotation[0],
                                                                               baseframe.rotation[1],
                                                                               baseframe.rotation[2],
                                                                               baseframe.rotation[3]);
                            }
                            if (baseframe.translation)
                            {
                                baseframe.translation = this.mathDevice.v3Build(baseframe.translation[0],
                                                                                baseframe.translation[1],
                                                                                baseframe.translation[2]);
                            }
                            if (baseframe.scale)
                            {
                                baseframe.scale = this.mathDevice.v3Build(baseframe.scale[0],
                                                                          baseframe.scale[1],
                                                                          baseframe.scale[2]);
                            }
                        }

                        var keyframes = nodeData.keyframes;

                        if (keyframes && keyframes[0].hasOwnProperty('time'))
                        {
                            var numKeys = keyframes.length;
                            var k, keyframe;
                            var channels = {};
                            var channel, value, values, index;
                            var i;
                            nodeData.channels = channels;

                            for (k = 0; k < numKeys; k += 1)
                            {
                                keyframe = keyframes[k];
                                for (value in keyframe)
                                {
                                    if (keyframe.hasOwnProperty(value) && value !== "time")
                                    {
                                        channel = channels[value];
                                        if (!channel)
                                        {
                                            channel = {
                                                count: 0,
                                                offset: 0,
                                                stride: keyframe[value].length + 1
                                            };
                                            channels[value] = channel;
                                            channel.firstKey = k;
                                        }
                                        channel.lastKey = k;
                                        channel.count += 1;
                                    }
                                }
                            }

                            var numberOfValues = 0;
                            for (value in channels)
                            {
                                if (channels.hasOwnProperty(value))
                                {
                                    channel = channels[value];

                                    channel.count = 1 + channel.lastKey - channel.firstKey; // TODO: For now we repeate values for intermediate keyframes
                                    if (channel.firstKey)
                                    {
                                        channel.count += 1;
                                    }
                                    if (channel.lastKey !== numKeys - 1)
                                    {
                                        channel.count += 1;
                                    }
                                    channel.offset = numberOfValues;
                                    channel.writeIndex = numberOfValues;
                                    numberOfValues += channel.stride * channel.count;
                                }
                            }

                            var keyframeArray = null;
                            if (numberOfValues)
                            {
                                keyframeArray = new Float32Array(numberOfValues);
                            }

                            for (value in channels)
                            {
                                if (channels.hasOwnProperty(value))
                                {
                                    channel = channels[value];
                                    if (channel.firstKey)
                                    {
                                        keyframeArray[channel.writeIndex] = keyframes[channel.firstKey - 1].time;
                                        values = baseframe[value];
                                        for (i = 0; i < channel.stride - 1; i += 1)
                                        {
                                            keyframeArray[channel.writeIndex + 1 + i] = values[i];
                                        }
                                        channel.writeIndex += channel.stride;
                                    }

                                    if (channel.lastKey !== numKeys - 1)
                                    {
                                        index = channel.offset + (channel.count - 1) * channel.stride;
                                        keyframeArray[index] = keyframes[channel.lastKey + 1].time;
                                        values = baseframe[value];
                                        for (i = 0; i < channel.stride - 1; i += 1)
                                        {
                                            keyframeArray[index + 1 + i] = values[i];
                                        }
                                    }
                                }
                            }

                            for (k = 0; k < numKeys; k += 1)
                            {
                                keyframe = keyframes[k];

                                for (value in channels)
                                {
                                    if (channels.hasOwnProperty(value))
                                    {
                                        channel = channels[value];
                                        if (k >= channel.firstKey && k <= channel.lastKey)
                                        {
                                            if (keyframe[value])
                                            {
                                                values = keyframe[value];
                                            }
                                            else
                                            {
                                                values = baseframe[value];
                                            }

                                            keyframeArray[channel.writeIndex] = keyframe.time;

                                            for (i = 0; i < channel.stride - 1; i += 1)
                                            {
                                                keyframeArray[channel.writeIndex + 1 + i] = values[i];
                                            }

                                            channel.writeIndex += channel.stride;
                                        }
                                    }
                                }
                            }

                            for (value in channels)
                            {
                                if (channels.hasOwnProperty(value))
                                {
                                    delete channel.writeIndex;
                                }
                            }

                            nodeData.keyframes = keyframeArray;
                        }
                        else if (keyframes)
                        {
                            nodeData.keyframes = new Float32Array(keyframes);
                        }
                    }

                    var bounds = anim.bounds;
                    var numFrames = bounds.length;
                    var f;
                    for (f = 0; f < numFrames; f += 1)
                    {
                        var bound = bounds[f];
                        bound.center = this.mathDevice.v3Build(bound.center[0],
                                                               bound.center[1],
                                                               bound.center[2]);
                        bound.halfExtent = this.mathDevice.v3Build(bound.halfExtent[0],
                                                                   bound.halfExtent[1],
                                                                   bound.halfExtent[2]);
                    }

                    animations[name] = anim;
                }
            }
        };

        var loadAnimationFile = function loadAnimationFileFn(path, onload)
        {

        };

        var getAnimation = function getAnimationFn(name)
        {
            var animation = animations[name];
            return animation;
        };

        var removeAnimation = function removeAnimationFn(name)
        {
            if (typeof animations[name] !== 'undefined')
            {
                delete animations[name];
            }
        };

        var nodeHasSkeleton = function nodeHasSkeletonFn(node)
        {
            var renderables = node.renderables;
            if (renderables)
            {
                var skeleton;
                var numRenderables = renderables.length;
                var r;
                for (r = 0; r < numRenderables; r += 1)
                {
                    if (renderables[r].geometry)
                    {
                        skeleton = renderables[r].geometry.skeleton;
                        if (skeleton)
                        {
                            return skeleton;
                        }
                    }
                }
            }

            var children = node.children;
            if (children)
            {
                var numChildren = children.length;
                var c;
                for (c = 0; c < numChildren; c += 1)
                {
                    var childSkel = nodeHasSkeleton(children[c]);
                    if (childSkel)
                    {
                        return childSkel;
                    }
                }
            }
            return undefined;
        };

        var animationManager = new AnimationManager();
        animationManager.mathDevice = TurbulenzEngine.getMathDevice();

        if (log)
        {
            animationManager.loadFile = function loadAnimationFileLogFn(path, callback)
            {
                log.innerHTML += "AnimationManager.loadFile:&nbsp;'" + path + "'";
                return loadAnimationFile(path, callback);
            };

            animationManager.loadData =
                function loadAnimationDataLogFn(data, prefix?)
            {
                log.innerHTML += "AnimationManager.loadData";
                return loadAnimationData(data, prefix);
            };

            animationManager.get = function getAnimationLogFn(name)
            {
                log.innerHTML += "AnimationManager.get:&nbsp;'" + name + "'";
                return getAnimation(name);
            };

            animationManager.remove = function removeAnimationLogFn(name)
            {
                log.innerHTML += "AnimationManager.remove:&nbsp;'" + name + "'";
                removeAnimation(name);
            };
        }
        else
        {
            animationManager.loadFile = loadAnimationFile;
            animationManager.loadData = loadAnimationData;
            animationManager.get = getAnimation;
            animationManager.remove = removeAnimation;
            animationManager.nodeHasSkeleton = nodeHasSkeleton;
        }

        animationManager.getAll = function getAllAnimationsFn()
        {
            return animations;
        };

        animationManager.setPathRemapping = function setPathRemappingFn(prm, assetUrl)
        {
            pathRemapping = prm;
            pathPrefix = assetUrl;
        };

        return animationManager;
    };
};