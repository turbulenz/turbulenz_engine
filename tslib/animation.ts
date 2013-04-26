// Copyright (c) 2009-2012 Turbulenz Limited
/*global TurbulenzEngine: false*/

/// <reference path="turbulenz.d.ts" />
/// <reference path="scenenode.ts" />

interface Bounds
{
    center: any;     // v3
    halfExtent: any; // v3
};

interface Hierarchy
{
    numNodes: number;
    names: string[];
    parents: number[];
};

// TODO: Is this logically correct?
interface Skeleton extends Hierarchy
{
    invBoneLTMs: any[]; // m43[]
};

// TODO: There is more we can add to this.  It can also be turned into
// a full class so we share some implementations.
interface ControllerBaseClass
{
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };

    // Methods

    getHierarchy(): Hierarchy;
    //setHierarchy(hierarchy: Hierarchy);
    addTime(delta: number): void;
    setTime(time: number): void;
    setRate(rate: number): void;
    update(): void;
    updateBounds(): void;

    getJointTransform(jointId: number): any; // m43
    getJointWorldTransform(jointId: number, asMatrix?: bool): any; // m43
};

//
// Animation
//

// TODO: Fill this out.  Does this come from asset data?

// TODO: This current shares a name with the Animation global.  Can we rename the global?  Is it internal?

interface Animation
{
    length: number;
    nodeData: any;
    channels: any;
    bounds: any;
};

var AnimationMath =
{

    quatPosscalefromm43: function quatPosscalefromm43Fn(matrix, mathDevice)
    {
        var v3Length = mathDevice.v3Length;
        var v3ScalarMul = mathDevice.v3ScalarMul;
        var v3Build = mathDevice.v3Build;

        var right = mathDevice.m43Right(matrix);
        var up = mathDevice.m43Up(matrix);
        var at = mathDevice.m43At(matrix);

        var sx = v3Length.call(mathDevice, right);
        var sy = v3Length.call(mathDevice, up);
        var sz = v3Length.call(mathDevice, at);
        var det = mathDevice.m43Determinant(matrix);

        var scale = v3Build.call(mathDevice, sx, sy, sz);
        var unitScale = v3Build.call(mathDevice, 1, 1, 1);

        if (!mathDevice.v3Equal(scale, unitScale) || det < 0)
        {
            if (det < 0)
            {
                sx *= -1;
                scale = v3Build.call(mathDevice, sx, sy, sz);
            }

            mathDevice.m43SetRight(matrix, v3ScalarMul.call(mathDevice, right, 1 / sx));
            mathDevice.m43SetUp(matrix, v3ScalarMul.call(mathDevice, up, 1 / sy));
            mathDevice.m43SetAt(matrix, v3ScalarMul.call(mathDevice, at, 1 / sz));
        }
        else
        {
            scale = unitScale;
        }

        var quat = mathDevice.quatFromM43(matrix);
        var pos = mathDevice.m43Pos(matrix);

        var result = {
            rotation: quat,
            translation: pos,
            scale: scale
        };

        return result;
    }

};

var AnimationChannels =
{
    copy: function animationChannelsCopyFn(channels)
    {
        var channelCopy = {};
        var c;
        for (c in channels)
        {
            if (channels.hasOwnProperty(c))
            {
                channelCopy[c] = true;
            }
        }

        return channelCopy;
    },

    union: function animationChannelsUnionFn(channelsA, channelsB)
    {
        var channelUnion = {};
        var c;
        for (c in channelsA)
        {
            if (channelsA.hasOwnProperty(c))
            {
                channelUnion[c] = true;
            }
        }
        for (c in channelsB)
        {
            if (channelsB.hasOwnProperty(c))
            {
                channelUnion[c] = true;
            }
        }

        return channelUnion;
    },

    add: function animationChannelsAddFn(channels, newChannels)
    {
        var c;
        for (c in newChannels)
        {
            if (newChannels.hasOwnProperty(c))
            {
                channels[c] = true;
            }
        }
    }
};

var Animation =
{
    minKeyframeDelta: 0.0001, // Don't interpolate keyframes when the delta is less than 0.1ms

    standardGetJointWorldTransform:
    function StandardGetJointWorldTransformFn(controller: ControllerBaseClass,
                                              jointId: number,
                                              mathDevice: MathDevice,
                                              asMatrix?: bool): any
    {
        var quatMulTranslate = mathDevice.quatMulTranslate;
        var m43FromRTS = mathDevice.m43FromRTS;
        var m43FromRT = mathDevice.m43FromRT;
        var quatCopy = mathDevice.quatCopy;
        var v3Copy = mathDevice.v3Copy;
        var output = controller.output;
        var hasScale = controller.outputChannels.scale;
        var joint = output[jointId];
        var hierarchyParents = controller.getHierarchy().parents;
        var parentIndex = hierarchyParents[jointId];
        var parentJoint;
        if (hasScale)
        {
            var m43Mul = mathDevice.m43Mul;
            var parentMatrix;
            var matrix = m43FromRTS.call(mathDevice, joint.rotation, joint.translation, joint.scale);
            while (parentIndex !== -1)
            {
                parentJoint = output[parentIndex];
                parentMatrix = m43FromRTS.call(mathDevice, parentJoint.rotation, parentJoint.translation, parentJoint.scale, parentMatrix);

                matrix = m43Mul.call(mathDevice, matrix, parentMatrix, matrix);

                parentIndex = hierarchyParents[parentIndex];
            }
            if (asMatrix)
            {
                return matrix;
            }
            else
            {
                // TODO: add to mathdevice
                var result = AnimationMath.quatPosscalefromm43(matrix,
                                                               mathDevice);
                return {
                    rotation: result.rotation,
                    translation: result.translation

                    // rotation: mathDevice.quatBuild.apply(mathDevice,
                    //                                      result.slice(0, 4)),
                    // translation: mathDevice.v3Build.apply(mathDevice,
                    //                                       result.slice(4, 7))
                };
            }
        }
        else
        {
            var rotation = quatCopy.call(mathDevice, joint.rotation);
            var translation = v3Copy.call(mathDevice, joint.translation);
            while (parentIndex !== -1)
            {
                parentJoint = output[parentIndex];

                quatMulTranslate.call(mathDevice, parentJoint.rotation, parentJoint.translation, rotation, translation, rotation, translation);

                parentIndex = hierarchyParents[parentIndex];
            }

            if (asMatrix)
            {
                return m43FromRT.call(mathDevice, rotation, translation);
            }
            else
            {
                return { rotation: rotation, translation: translation };
            }
        }
    }
};

//
// InterpolatorController
//
class InterpolatorController implements ControllerBaseClass
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    rate                 : number;
    currentTime          : number;
    looping              : bool;

    currentAnim          : Animation;
    translationEndFrames : Uint32Array;
    rotationEndFrames    : Uint32Array;
    scaleEndFrames       : Uint32Array;

    // prototype
    scratchV3            : any; // v3
    scratchPad           : {
        v1: any; // v4
        v2: any; // v4
        q1: any; // quat
        q2: any; // quat
    };

    addTime(delta)
    {
        this.currentTime += delta * this.rate;
        this.dirty = true;
        this.dirtyBounds = true;

        // deal with looping animations, we do this during addTime to ensure callbacks
        // are fired if someone doesn't call update
        var anim = this.currentAnim;
        var animLength = anim.length;

        while (this.currentTime > animLength)
        {
            var numNodes = this.hierarchy.numNodes;
            var index;

            for (index = 0; index < numNodes; index += 1)
            {
                this.translationEndFrames[index] = 0;
                this.rotationEndFrames[index] = 0;
                this.scaleEndFrames[index] = 0;
            }

            if (this.onUpdateCallback)
            {
                // call the update callback as though we're at the end of the animation
                var tempTime = this.currentTime;
                this.currentTime = animLength;
                this.onUpdateCallback(this);
                if (this.currentTime === animLength)
                {
                    // Only restore the old time if the update callback didn't change it
                    this.currentTime = tempTime;
                }
                else if (this.currentTime < animLength)
                {
                    // If the update callback reset the animation to a valid state don't continue
                    return;
                }
            }

            if (this.looping)
            {
                if (this.onLoopCallback)
                {
                    if (!this.onLoopCallback(this))
                    {
                        return;
                    }
                }
                this.currentTime -= animLength;
            }
            else
            {
                if (this.onFinishedCallback)
                {
                    if (!this.onFinishedCallback(this))
                    {
                        return;
                    }
                }
                this.currentTime = animLength;
            }
        }

        if (this.onUpdateCallback)
        {
            this.onUpdateCallback(this);
        }
    };

    update()
    {
        var mathDevice = this.mathDevice;

        var anim = this.currentAnim;
        var nodeData = anim.nodeData;
        var numJoints = this.hierarchy.numNodes;
        var outputArray = this.output;

        var animHasScale = anim.channels.scale;

        var defaultScale;
        if (animHasScale)
        {
            defaultScale = mathDevice.v3Build(1, 1, 1);
        }

        var scratchPad = InterpolatorController.prototype.scratchPad;
        var v1 = scratchPad.v1;
        var v2 = scratchPad.v2;
        var q1 = scratchPad.q1;
        var q2 = scratchPad.q2;
        var delta, j;

        for (j = 0; j < numJoints; j += 1)
        {
            var data = nodeData[j];
            var jointChannels = data.channels;
            var jointHasScale = jointChannels ? jointChannels.scale : animHasScale;
            var hasScale = jointHasScale || animHasScale;
            var jointKeys = data.keyframes;
            var jointBase = data.baseframe;
            var baseQuat, basePos, baseScale;
            var jointOutput = outputArray[j];

            if (jointBase)
            {
                baseQuat = jointBase.rotation;
                basePos = jointBase.translation;
                baseScale = jointBase.scale;
                /*jshint bitwise: false*/
                jointHasScale |= baseScale !== undefined;
                /*jshint bitwise: true*/
            }

            if (!jointKeys)
            {
                // Completely non animated joint so copy the base
                jointOutput.rotation = mathDevice.quatCopy(baseQuat, jointOutput.rotation);
                jointOutput.translation = mathDevice.v3Copy(basePos, jointOutput.translation);
                if (hasScale)
                {
                    if (jointHasScale)
                    {
                        jointOutput.scale = mathDevice.v3Copy(baseScale, jointOutput.scale);
                    }
                    else
                    {
                        jointOutput.scale = mathDevice.v3Copy(defaultScale, jointOutput.scale);
                    }
                }
            }
            else
            {
                // Find the pair of keys wrapping current time

                var offset = 0;
                var stride = 0;
                var offsetMinusStride = 0;
                var endFrameOffset = 0;
                var channels = data.channels;
                if (channels.rotation)
                {
                    stride = channels.rotation.stride;
                    offset = channels.rotation.offset;
                    endFrameOffset = offset + (channels.rotation.count - 1) * stride;

                    if (this.currentTime <= jointKeys[offset])
                    {
                        jointOutput.rotation = mathDevice.quatBuild(jointKeys[offset + 1], jointKeys[offset + 2], jointKeys[offset + 3], jointKeys[offset + 4], jointOutput.rotation);
                    }
                    else if (this.currentTime >= jointKeys[endFrameOffset])
                    {
                        jointOutput.rotation = mathDevice.quatBuild(jointKeys[endFrameOffset + 1], jointKeys[endFrameOffset + 2], jointKeys[endFrameOffset + 3], jointKeys[endFrameOffset + 4], jointOutput.rotation);
                    }
                    else
                    {

                        offset = this.rotationEndFrames[j] || offset;

                        while (this.currentTime > jointKeys[offset])
                        {
                            offset += stride;
                        }

                        this.rotationEndFrames[j] = offset;
                        offsetMinusStride = offset - stride;

                        delta = (this.currentTime - jointKeys[offsetMinusStride]) / (jointKeys[offset] - jointKeys[offsetMinusStride]);

                        q1[0] = jointKeys[offsetMinusStride + 1];
                        q1[1] = jointKeys[offsetMinusStride + 2];
                        q1[2] = jointKeys[offsetMinusStride + 3];
                        q1[3] = jointKeys[offsetMinusStride + 4];

                        q2[0] = jointKeys[offset + 1];
                        q2[1] = jointKeys[offset + 2];
                        q2[2] = jointKeys[offset + 3];
                        q2[3] = jointKeys[offset + 4];

                        jointOutput.rotation = mathDevice.quatSlerp(q1, q2, delta, jointOutput.rotation);
                    }
                }
                else
                {
                    jointOutput.rotation = mathDevice.quatCopy(baseQuat, jointOutput.rotation);
                }

                if (channels.translation)
                {
                    stride = channels.translation.stride;
                    offset = channels.translation.offset;

                    endFrameOffset = offset + (channels.translation.count - 1) * stride;

                    if (this.currentTime <= jointKeys[offset])
                    {
                        jointOutput.translation = mathDevice.v3Build(jointKeys[offset + 1], jointKeys[offset + 2], jointKeys[offset + 3], jointOutput.translation);
                    }
                    else if (this.currentTime >= jointKeys[endFrameOffset])
                    {
                        jointOutput.translation = mathDevice.v3Build(jointKeys[endFrameOffset + 1], jointKeys[endFrameOffset + 2], jointKeys[endFrameOffset + 3], jointOutput.translation);
                    }
                    else
                    {
                        offset = this.translationEndFrames[j] || offset;

                        while (this.currentTime > jointKeys[offset])
                        {
                            offset += stride;
                        }

                        this.translationEndFrames[j] = offset;
                        offsetMinusStride = offset - stride;

                        delta = (this.currentTime - jointKeys[offsetMinusStride]) / (jointKeys[offset] - jointKeys[offsetMinusStride]);

                        v1[0] = jointKeys[offsetMinusStride + 1];
                        v1[1] = jointKeys[offsetMinusStride + 2];
                        v1[2] = jointKeys[offsetMinusStride + 3];

                        v2[0] = jointKeys[offset + 1];
                        v2[1] = jointKeys[offset + 2];
                        v2[2] = jointKeys[offset + 3];

                        jointOutput.translation = mathDevice.v3Lerp(v1, v2, delta, jointOutput.translation);
                    }
                }
                else
                {
                    jointOutput.translation = mathDevice.v3Copy(basePos, jointOutput.translation);
                }

                if (channels.scale)
                {
                    stride = channels.scale.stride;
                    offset = channels.scale.offset;

                    endFrameOffset = offset + (channels.scale.count - 1) * stride;

                    if (this.currentTime <= jointKeys[offset])
                    {
                        jointOutput.scale = mathDevice.v3Build(jointKeys[offset + 1], jointKeys[offset + 2], jointKeys[offset + 3], jointOutput.scale);
                    }
                    else if (this.currentTime >= jointKeys[endFrameOffset])
                    {
                        jointOutput.scale = mathDevice.v3Build(jointKeys[endFrameOffset + 1], jointKeys[endFrameOffset + 2], jointKeys[endFrameOffset + 3], jointOutput.scale);
                    }
                    else
                    {
                        offset = this.scaleEndFrames[j] || offset;

                        while (this.currentTime > jointKeys[offset])
                        {
                            offset += stride;
                        }

                        this.scaleEndFrames[j] = offset;
                        offsetMinusStride = offset - stride;

                        delta = (this.currentTime - jointKeys[offsetMinusStride]) / (jointKeys[offset] - jointKeys[offsetMinusStride]);

                        v1[0] = jointKeys[offsetMinusStride + 1];
                        v1[1] = jointKeys[offsetMinusStride + 2];
                        v1[2] = jointKeys[offsetMinusStride + 3];

                        v2[0] = jointKeys[offset + 1];
                        v2[1] = jointKeys[offset + 2];
                        v2[2] = jointKeys[offset + 3];

                        jointOutput.scale = mathDevice.v3Lerp(v1, v2, delta, jointOutput.scale);
                    }
                }
                else
                {
                    if (hasScale)
                    {
                        if (jointHasScale)
                        {
                            jointOutput.scale = mathDevice.v3Copy(baseScale, jointOutput.scale);
                        }
                        else
                        {
                            jointOutput.scale = mathDevice.v3Copy(defaultScale, jointOutput.scale);
                        }
                    }
                }
            }
        }

        this.dirty = false;

        if (this.dirtyBounds)
        {
            this.updateBounds();
        }
    };

    updateBounds()
    {
        if (!this.dirtyBounds)
        {
            return;
        }

        var currentTime = this.currentTime;
        var anim = this.currentAnim;

        // work out the offset in the frame list and the delta between frame pairs
        var bounds = anim.bounds;
        var numFrames = bounds.length;
        if (currentTime > bounds[numFrames - 1].time)
        {
            // copy the end bounds
            var endBounds = bounds[numFrames - 1];
            this.bounds.center = endBounds.center;
            this.bounds.halfExtent = endBounds.halfExtent;
            return;
        }

        if (currentTime < bounds[0].time)
        {
            // copy the start bounds
            var startBounds = bounds[0];
            this.bounds.center = startBounds.center;
            this.bounds.halfExtent = startBounds.halfExtent;
            return;
        }

        var endBound = 1;
        while (currentTime > bounds[endBound].time)
        {
            endBound += 1;
        }

        var startBound = (endBound - 1);
        var boundsStart = bounds[startBound];
        var boundsEnd = bounds[endBound];
        var startTime = boundsStart.time;
        var endTime = boundsEnd.time;
        var delta = (currentTime - startTime) / (endTime - startTime);

        var mathDevice = this.mathDevice;
        var ibounds = this.bounds;

        // If delta is close to the limits we just copy the bounds
        var minKeyframeDelta = Animation.minKeyframeDelta;
        if (delta < minKeyframeDelta)
        {
            // copy the bounds
            ibounds.center = mathDevice.v3Copy(boundsStart.center, ibounds.center);
            ibounds.halfExtent = mathDevice.v3Copy(boundsStart.halfExtent, ibounds.halfExtent);
        }
        else if ((1.0 - delta) < minKeyframeDelta)
        {
            // copy the bounds
            ibounds.center = mathDevice.v3Copy(boundsEnd.center, ibounds.center);
            ibounds.halfExtent = mathDevice.v3Copy(boundsEnd.halfExtent, ibounds.halfExtent);
        }
        else
        {
            // accumulate the bounds as average of the center position and max of the extent
            // plus the half distance between the centers
            var centerSum = mathDevice.v3Add(boundsStart.center, boundsEnd.center, ibounds.center);
            var newCenter = mathDevice.v3ScalarMul(centerSum, 0.5, centerSum);
            ibounds.center = newCenter;

            var newExtent = mathDevice.v3Max(boundsStart.halfExtent, boundsEnd.halfExtent, ibounds.halfExtent);
            var centerOffset = mathDevice.v3Sub(boundsStart.center, newCenter, this.scratchPad.v1);
            centerOffset = mathDevice.v3Abs(centerOffset, centerOffset);
            ibounds.halfExtent = mathDevice.v3Add(newExtent, centerOffset, newExtent);
        }

        this.dirtyBounds = false;
    };

    // Note this is purely a transform for the given joint and doesn't include parent transforms
    getJointTransform(jointId: number)
    {
        var mathDevice = this.mathDevice;
        var m43FromRTS = mathDevice.m43FromRTS;
        var m43FromRT = mathDevice.m43FromRT;
        var quatSlerp = mathDevice.quatSlerp;
        var v3Lerp = mathDevice.v3Lerp;

        var anim = this.currentAnim;
        var animHasScale = anim.channels.scale;
        if (this.dirty)
        {
            var nodeData = anim.nodeData;

            var jointKeys = nodeData[jointId].keyframes;
            var jointBase = nodeData[jointId].jointBase;

            var jointChannels = nodeData[jointId].channels;
            var jointHasScale = jointChannels ? jointChannels.scale : animHasScale;
            var hasScale = jointHasScale || animHasScale;

            var baseQuat, basePos, baseScale;
            if (jointBase)
            {
                baseQuat = jointBase.rotation;
                basePos = jointBase.translation;
                baseScale = jointBase.scale;
            }

            if (!jointKeys)
            {
                // Completely non animated joint so use the base info
                if (hasScale)
                {
                    return m43FromRTS.call(mathDevice, baseQuat, basePos, baseScale || mathDevice.v3Build(1, 1, 1));
                }
                else
                {
                    return m43FromRT.call(mathDevice, baseQuat, basePos);
                }
            }
            else
            {
                // Find the pair of keys wrapping current time
                var endFrame = 1;
                while (this.currentTime > jointKeys[endFrame].time)
                {
                    endFrame += 1;
                }
                var startFrame = endFrame - 1;
                var startTime = jointKeys[startFrame].time;
                var endTime = jointKeys[endFrame].time;
                var delta = (this.currentTime - startTime) / (endTime - startTime);

                // If the delta is small enough we just copy the first keyframe
                if (delta < Animation.minKeyframeDelta)
                {
                    var thisKey = jointKeys[startFrame];
                    if (hasScale)
                    {
                        return m43FromRTS.call(mathDevice,
                                               thisKey.rotation || baseQuat,
                                               thisKey.translation || basePos,
                                               thisKey.scale || baseScale || mathDevice.v3Build(1, 1, 1));
                    }
                    else
                    {
                        return m43FromRT.call(mathDevice, thisKey.rotation || baseQuat, thisKey.translation || basePos);
                    }
                }
                else
                {
                    // For each joint slerp between the quats and return the quat pos result
                    var k1 = jointKeys[startFrame];
                    var k2 = jointKeys[endFrame];

                    var q1 = k1.rotation || baseQuat;
                    var q2 = k2.rotation || baseQuat;
                    var rotation = quatSlerp.call(mathDevice, q1, q2, delta);

                    var pos1 = k1.translation || basePos;
                    var pos2 = k2.translation || basePos;
                    var translation = v3Lerp.call(mathDevice, pos1, pos2, delta);

                    if (hasScale)
                    {
                        var scale;
                        if (jointHasScale)
                        {
                            var s1 = k1.scale || baseScale;
                            var s2 = k2.scale || baseScale;

                            scale = v3Lerp.call(mathDevice, s1, s2, delta);
                        }
                        else
                        {
                            scale = mathDevice.v3Build(1, 1, 1);
                        }
                        return m43FromRTS.call(mathDevice, rotation, translation, scale);
                    }
                    else
                    {
                        return m43FromRT.call(mathDevice, rotation, translation);
                    }
                }
            }
        }
        else
        {
            var jointOutput = this.output[jointId];
            if (animHasScale)
            {
                return m43FromRTS.call(mathDevice, jointOutput.rotation, jointOutput.translation, jointOutput.scale);
            }
            else
            {
                return m43FromRT.call(mathDevice, jointOutput.rotation, jointOutput.translation);
            }
        }
    };

    getJointWorldTransform(jointId: number, asMatrix?: bool): any
    {
        if (this.dirty)
        {
            // May as well do a full update since we're accessing the output randomly
            this.update();
        }

        return Animation.standardGetJointWorldTransform(this, jointId, this.mathDevice, asMatrix);
    };

    setAnimation(animation: Animation, looping)
    {
        this.currentAnim = animation;
        this.currentTime = 0.0;
        var index;
        var numNodes = this.hierarchy.numNodes;

        if (!this.translationEndFrames ||
            this.translationEndFrames.length !== numNodes)
        {
            this.translationEndFrames = new Uint32Array(numNodes);
            this.rotationEndFrames = new Uint32Array(numNodes);
            this.scaleEndFrames = new Uint32Array(numNodes);
        }
        else
        {
            for (index = 0; index < numNodes; index += 1)
            {
                this.translationEndFrames[index] = 0;
                this.rotationEndFrames[index] = 0;
                this.scaleEndFrames[index] = 0;
            }
        }

        this.dirty = true;
        this.dirtyBounds = true;
        if (looping)
        {
            this.looping = true;
        }
        else
        {
            this.looping = false;
        }

        this.outputChannels = AnimationChannels.copy(animation.channels);
    };

    setTime(time)
    {
        this.currentTime = time;
        this.dirty = true;
        this.dirtyBounds = true;
        var numNodes = this.hierarchy.numNodes;
        var index;

        for (index = 0; index < numNodes; index += 1)
        {
            this.translationEndFrames[index] = 0;
            this.rotationEndFrames[index] = 0;
            this.scaleEndFrames[index] = 0;
        }
    };

    setRate(rate)
    {
        this.rate = rate;
    };

    getHierarchy()
    {
        return this.hierarchy;
    };

    // Constructor function
    static create(hierarchy): InterpolatorController
    {
        var i = new InterpolatorController();
        i.hierarchy = hierarchy;

        var md = TurbulenzEngine.getMathDevice();
        i.mathDevice = md;
        i.bounds = { center: md.v3BuildZero(), halfExtent: md.v3BuildZero() };

        var output = [];
        i.output = output;
        i.outputChannels = { };
        var numJoints = hierarchy.numNodes;
        for (var j = 0; j < numJoints; j += 1)
        {
            output[j] = {};
        }
        i.rate = 1.0;
        i.currentTime = 0.0;
        i.looping = false;
        i.dirty = true;
        i.dirtyBounds = true;

        if (!InterpolatorController.prototype.scratchPad)
        {
            InterpolatorController.prototype.scratchPad = {
                v1 : md.v3BuildZero(),
                v2 : md.v3BuildZero(),
                q1 : md.quatBuild(0, 0, 0, 1),
                q2 : md.quatBuild(0, 0, 0, 1)
            };
        }

        return i;
    };
};
InterpolatorController.prototype.scratchV3 = null;

// This controller works off a base interpolator and copies all it's output data
// but allows a list of controllers and nodes to overload the output
// Note it only overloads the output quat pos and not any bounds etc
class OverloadedNodeController
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    baseController: ControllerBaseClass;
    nodeOverloads: any[];

    addTime(delta)
    {
        this.dirty = true;
        this.dirtyBounds = true;

        this.baseController.addTime(delta);
    };

    update()
    {
        this.baseController.update();

        var nodeOverloads = this.nodeOverloads;
        var numOverloads = nodeOverloads.length;
        var output = this.output;
        for (var o = 0; o < numOverloads; o += 1)
        {
            var overload = nodeOverloads[o];
            var overloadSource = overload.sourceController;
            if (overloadSource.dirty)
            {
                overloadSource.update();
            }
            output[overload.overloadIndex] = overloadSource.getJointWorldTransform(overload.sourceIndex);
            if (this.outputChannels.scale && !overloadSource.outputChannels.scale)
            {
                output[overload.overloadIndex].scale = this.mathDevice.v3Build(1, 1, 1);
            }
        }

        this.dirty = false;

        if (this.dirtyBounds)
        {
            this.baseController.updateBounds();
            this.dirtyBounds = false;
        }
    };

    updateBounds()
    {
        if (this.dirtyBounds)
        {
            this.baseController.updateBounds();
            this.dirtyBounds = false;
        }
    };

    // Note this is purely a transform for the given joint and doesn't include parent transforms
    getJointTransform(jointId)
    {
        // TODO: check if the jointId is overloaded and return the correct one
        return this.baseController.getJointTransform(jointId);
    };

    getJointWorldTransform(jointId: number, asMatrix?: bool)
    {
        // TODO: check if the jointId is overloaded and return the correct one
        return this.baseController.getJointWorldTransform(jointId, asMatrix);
    };

    getHierarchy()
    {
        return this.baseController.getHierarchy();
    };

    addOverload(sourceController, sourceIndex, overloadIndex)
    {
        // TODO: should ensure the dest overload index is unique in the list
        AnimationChannels.add(this.outputChannels, sourceController.outputChannels);
        this.nodeOverloads.push({
            sourceController: sourceController,
            sourceIndex: sourceIndex,
            overloadIndex: overloadIndex
        });
    };

    // Constructor function
    static create(baseController: ControllerBaseClass): OverloadedNodeController
    {
        var c = new OverloadedNodeController();
        c.baseController = baseController;
        c.bounds = baseController.bounds;
        c.output = baseController.output;
        c.outputChannels = {};
        c.nodeOverloads = [];
        c.dirty = true;
        c.dirtyBounds = true;

        c.mathDevice = TurbulenzEngine.getMathDevice();

        return c;
    };
};

class ReferenceController
{
    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    referenceSource: ControllerBaseClass;
    setReferenceController: { (controller: ControllerBaseClass): void; };

    // Constructor function
    static create(baseController): ReferenceController
    {
        /*jshint proto:true*/
        var c = new ReferenceController();
        /*jshint nomen: false*/
        /*jshint proto: true*/
        c['__proto__'] = baseController;
        /*jshint proto: false*/
        /*jshint nomen: true*/

        var setReferenceController = function setReferenceControllerFn(controller)
        {
            var referenceSource = this.referenceSource;
            delete this.referenceSource;
            delete this.setReferenceController;
            for (var p in this)
            {
                if (this.hasOwnProperty(p))
                {
                    referenceSource[p] = this[p];
                    delete this[p];
                }
            }

            /*jshint nomen: false*/
            /*jshint proto: true*/
            this['__proto__'] = controller;
            /*jshint proto: false*/
            /*jshint nomen: true*/
            this.referenceSource = controller;
            this.setReferenceController = setReferenceController;
        };

        c.referenceSource = baseController;
        c.setReferenceController = setReferenceController;

        /*jshint proto:false*/
        return c;
    };
};

// The TransitionController interpolates between the fixed state of input controllers across a period of time
class TransitionController implements ControllerBaseClass
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    rate: number;
    startController: ControllerBaseClass;
    endController: ControllerBaseClass;
    transitionTime: number;
    transitionLength: number;

    onFinishedTransitionCallback: { (controller: ControllerBaseClass): bool; };

    addTime(delta)
    {
        this.dirty = true;
        // Note we don't dirty the bounds since we simply use the merged bounds of fixed states

        this.transitionTime += delta;

        while (this.transitionTime > this.transitionLength)
        {
            if (this.onFinishedTransitionCallback)
            {
                if (!this.onFinishedTransitionCallback(this))
                {
                    return;
                }
            }
            this.transitionTime = this.transitionLength;
        }

        if (this.onUpdateCallback)
        {
            this.onUpdateCallback(this);
        }
    };

    update()
    {
        var mathDevice = this.mathDevice;
        var quatSlerp = mathDevice.quatSlerp;
        var v3Lerp = mathDevice.v3Lerp;
        var v3Copy = mathDevice.v3Copy;

        this.startController.update();
        this.endController.update();

        var output = this.output;
        var outputChannels = this.outputChannels;
        var outputScale = outputChannels.scale;
        var scaleOnStart = this.startController.outputChannels.scale;
        var scaleOnEnd = this.endController.outputChannels.scale;

        var startOutput = this.startController.output;
        var endOutput = this.endController.output;
        var delta = this.transitionTime / this.transitionLength;

        // For each joint slerp between the quats and return the quat pos result
        var numJoints = this.startController.getHierarchy().numNodes;
        for (var j = 0; j < numJoints; j += 1)
        {
            if (!output[j])
            {
                output[j] = {};
            }
            var j1 = startOutput[j];
            var j2 = endOutput[j];

            output[j].rotation = quatSlerp.call(mathDevice, j1.rotation, j2.rotation, delta, output[j].rotation);
            output[j].translation = v3Lerp.call(mathDevice, j1.translation, j2.translation, delta, output[j].translation);

            if (outputScale)
            {
                if (scaleOnStart)
                {
                    if (scaleOnEnd)
                    {
                        output[j].scale = v3Lerp.call(mathDevice, j1.scale, j2.scale, delta, output[j].scale);
                    }
                    else
                    {
                        output[j].scale = v3Copy.call(mathDevice, j1.scale, output[j].scale);
                    }
                }
                else if (scaleOnEnd)
                {
                    output[j].scale = v3Copy.call(mathDevice, j2.scale, output[j].scale);
                }
            }
        }

        this.dirty = false;

        if (this.dirtyBounds)
        {
            this.updateBounds();
        }
    };

    updateBounds()
    {
        var startController = this.startController;
        var endController = this.endController;
        if (startController.dirtyBounds)
        {
            startController.updateBounds();
        }
        if (endController.dirtyBounds)
        {
            endController.updateBounds();
        }

        // accumulate the bounds as average of the center position and max of the extent
        // plus the half distance between the centers
        var boundsStart = startController.bounds;
        var boundsEnd = endController.bounds;

        var mathDevice = this.mathDevice;
        var v3Add = mathDevice.v3Add;

        var centerSum = v3Add.call(mathDevice, boundsStart.center, boundsEnd.center);
        var newCenter = mathDevice.v3ScalarMul(centerSum, 0.5, centerSum);
        this.bounds.center = newCenter;
        var newExtent = mathDevice.v3Max(boundsStart.halfExtent, boundsEnd.halfExtent);

        // Calc the largest extent for all axis
        var max = Math.max;
        var maxExt = max(newExtent[0], max(newExtent[1], newExtent[2]));
        newExtent = mathDevice.v3Build(maxExt, maxExt, maxExt);

        var centerOffset = mathDevice.v3Sub(boundsStart.center, newCenter);
        centerOffset = mathDevice.v3Abs(centerOffset, centerOffset);
        this.bounds.halfExtent = v3Add.call(mathDevice, newExtent, centerOffset, newExtent);

        this.dirtyBounds = false;
    };

    // Note this is purely a transform for the given joint and doesn't include parent transforms
    getJointTransform(jointId)
    {
        if (this.dirty)
        {
            // Note this is not necessarily the most efficient solution, we only need one joint
            this.update();
        }

        var output = this.output;
        var jointOutput = output[jointId];
        return jointOutput;
    };

    getJointWorldTransform(jointId: number, asMatrix?: bool)
    {
        if (this.dirty)
        {
            // May as well do a full update since we're accessing the output randomly
            this.update();
        }

        return Animation.standardGetJointWorldTransform(this, jointId, this.mathDevice, asMatrix);
    };

    setStartController(controller)
    {
        this.startController = controller;
        this.outputChannels = AnimationChannels.union(this.startController.outputChannels, this.endController.outputChannels);
        this.dirty = true;
        this.dirtyBounds = true;
    };

    setEndController(controller)
    {
        this.endController = controller;
        this.outputChannels = AnimationChannels.union(this.startController.outputChannels, this.endController.outputChannels);
        this.dirty = true;
        this.dirtyBounds = true;
    };

    setTransitionLength(length)
    {
        this.transitionLength = length;
        this.dirty = true;
        this.dirtyBounds = true;
    };

    setTime(time)
    {
        this.transitionTime = time;
        this.dirty = true;
        this.dirtyBounds = true;
    };

    setRate(rate)
    {
        this.rate = rate;
    };

    getHierarchy()
    {
        // Return the start controller, they should match anyway
        return this.startController.getHierarchy();
    };

    // Constructor function
    static create(startController: ControllerBaseClass,
                  endController: ControllerBaseClass,
                  length: number): TransitionController
    {
        var c = new TransitionController();

        var md = TurbulenzEngine.getMathDevice();
        c.mathDevice = md;
        c.bounds = { center: md.v3BuildZero(), halfExtent: md.v3BuildZero() };

        c.startController = startController;
        c.endController = endController;
        c.outputChannels = AnimationChannels.union(startController.outputChannels, endController.outputChannels);
        c.output = [];
        c.transitionTime = 0;
        c.transitionLength = length;
        c.dirty = true;
        c.dirtyBounds = true;

        return c;
    };
};

// The BlendController blends between the animating state of input controllers given a user specified delta
class BlendController implements ControllerBaseClass
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    controllers: ControllerBaseClass[];
    blendDelta: number;

    addTime(delta)
    {
        this.dirty = true;
        this.dirtyBounds = true;

        var controllers = this.controllers;
        var numControllers = controllers.length;
        for (var i = 0; i < numControllers; i += 1)
        {
            var controller = controllers[i];
            controller.addTime(delta);
        }
    };

    update()
    {
        var mathDevice = this.mathDevice;
        var quatSlerp = mathDevice.quatSlerp;
        var v3Lerp = mathDevice.v3Lerp;
        var v3Copy = mathDevice.v3Copy;

        // Decide the pair of controllers we'll blend between and the delta
        var controllers = this.controllers;
        var numControllers = controllers.length;
        var deltaStep = 1 / (numControllers - 1);
        var first = Math.floor(this.blendDelta / deltaStep);
        var last = Math.min(first + 1, numControllers - 1);
        var delta = (this.blendDelta - (first * deltaStep)) / deltaStep;

        var startController = controllers[first];
        var endController = controllers[last];

        startController.update();
        endController.update();

        var output = this.output;
        var outputChannels = this.outputChannels;
        var outputScale = outputChannels.scale;
        var scaleOnStart = startController.outputChannels.scale;
        var scaleOnEnd = endController.outputChannels.scale;

        var startOutput = startController.output;
        var endOutput = endController.output;

        // For each joint slerp between the quats and return the quat pos result
        var numJoints = startController.getHierarchy().numNodes;
        for (var j = 0; j < numJoints; j += 1)
        {
            if (!output[j])
            {
                output[j] = {};
            }
            var j1 = startOutput[j];
            var j2 = endOutput[j];

            output[j].rotation = quatSlerp.call(mathDevice, j1.rotation, j2.rotation, delta, output[j].rotation);
            output[j].translation = v3Lerp.call(mathDevice, j1.translation, j2.translation, delta, output[j].translation);

            if (outputScale)
            {
                if (scaleOnStart)
                {
                    if (scaleOnEnd)
                    {
                        output[j].scale = v3Lerp.call(mathDevice, j1.scale, j2.scale, delta, output[j].scale);
                    }
                    else
                    {
                        output[j].scale = v3Copy.call(mathDevice, j1.scale, output[j].scale);
                    }
                }
                else if (scaleOnEnd)
                {
                    output[j].scale = v3Copy.call(mathDevice, j2.scale, output[j].scale);
                }
            }
        }

        this.dirty = false;

        if (this.dirtyBounds)
        {
            this.updateBounds();
        }
    };

    updateBounds()
    {
        // Decide the pair of controllers we'll blend between and update and merge their bounds
        var controllers = this.controllers;
        var numControllers = controllers.length;
        var deltaStep = 1 / (numControllers - 1);
        var first = Math.floor(this.blendDelta / deltaStep);
        var last = Math.min(first + 1, numControllers - 1);

        var startController = controllers[first];
        var endController = controllers[last];

        if (startController.dirtyBounds)
        {
            startController.updateBounds();
        }
        if (endController.dirtyBounds)
        {
            endController.updateBounds();
        }

        // accumulate the bounds as average of the center position and max of the extent
        // plus the half distance between the centers
        var boundsStart = startController.bounds;
        var boundsEnd = endController.bounds;

        var mathDevice = this.mathDevice;
        var v3Add = mathDevice.v3Add;

        var centerSum = v3Add.call(mathDevice, boundsStart.center, boundsEnd.center);
        var newCenter = mathDevice.v3ScalarMul(centerSum, 0.5, centerSum);
        this.bounds.center = newCenter;
        var newExtent = mathDevice.v3Max(boundsStart.halfExtent, boundsEnd.halfExtent);
        var centerOffset = mathDevice.v3Sub(boundsStart.center, newCenter);
        centerOffset = mathDevice.v3Abs(centerOffset, centerOffset);
        this.bounds.halfExtent = v3Add.call(mathDevice, newExtent, centerOffset, newExtent);

        this.dirtyBounds = false;
    };

    // Note this is purely a transform for the given joint and doesn't include parent transforms
    getJointTransform(jointId)
    {
        if (this.dirty)
        {
            // Note this is not necessarily the most efficient solution, we only need one joint
            this.update();
        }

        return this.output[jointId];
    };

    getJointWorldTransform(jointId: number, asMatrix?: bool)
    {
        if (this.dirty)
        {
            // May as well do a full update since we're accessing the output randomly
            this.update();
        }

        return Animation.standardGetJointWorldTransform(this, jointId, this.mathDevice, asMatrix);
    };

    setBlendDelta(delta)
    {
        this.blendDelta = (0 < delta ? delta : 0);
        this.dirty = true;
        this.dirtyBounds = true;
    };

    setTime(time)
    {
        var controllers = this.controllers;
        var numControllers = controllers.length;
        for (var i = 0; i < numControllers; i += 1)
        {
            var controller = controllers[i];
            controller.setTime(time);
        }
        this.dirty = true;
        this.dirtyBounds = true;
    };

    setRate(rate)
    {
        var controllers = this.controllers;
        var numControllers = controllers.length;
        for (var i = 0; i < numControllers; i += 1)
        {
            controllers[i].setRate(rate);
        }
    };

    getHierarchy()
    {
        // Return the first controller since they should all match
        return this.controllers[0].getHierarchy();
    };

    // Constructor function
    static create(controllers: ControllerBaseClass[]): BlendController
    {
        var c = new BlendController();
        c.outputChannels = {};
        c.controllers = [];
        var numControllers = controllers.length;
        c.controllers.length = numControllers;
        for (var i = 0; i < numControllers; i += 1)
        {
            var inputController = controllers[i];
            c.controllers[i] = inputController;

            debug.assert(inputController.getHierarchy().numNodes === c.getHierarchy().numNodes,
                         "All controllers to a blend controller must have the same number of joints");

            AnimationChannels.add(c.outputChannels, inputController.outputChannels);
        }


        var md = TurbulenzEngine.getMathDevice();
        c.mathDevice = md;
        c.bounds = { center: md.v3BuildZero(), halfExtent: md.v3BuildZero() };

        c.output = [];
        c.blendDelta = 0;
        c.dirty = true;
        c.dirtyBounds = true;


        return c;
    };
};

// The MaskController takes joints from various controllers based on a per joint mask
class MaskController implements ControllerBaseClass
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    controllers: ControllerBaseClass[];
    masks: { [idx: number]: bool; }[];

    addTime(delta)
    {
        this.dirty = true;
        this.dirtyBounds = true;

        var controllers = this.controllers;
        var numControllers = controllers.length;
        for (var i = 0; i < numControllers; i += 1)
        {
            var controller = controllers[i];
            controller.addTime(delta);
        }
    };

    update()
    {
        var output = this.output;
        var outputChannels = this.outputChannels;
        var outputScale = outputChannels.scale;

        var controllers = this.controllers;
        var numControllers = controllers.length;
        var masks = this.masks;
        for (var i = 0; i < numControllers; i += 1)
        {
            var controller = controllers[i];
            controller.update();
            var controllerOutput = controller.output;
            var controllerHasScale = controller.outputChannels.scale;
            var createScale = outputScale && !controllerHasScale;
            var mask = masks[i];

            // For each joint copy over if the mask is set
            var numJoints = controller.getHierarchy().numNodes;
            for (var j = 0; j < numJoints; j += 1)
            {
                if (!output[j])
                {
                    output[j] = {};
                }
                if (mask[j])
                {
                    output[j].rotation = controllerOutput[j].rotation.slice();
                    output[j].translation = controllerOutput[j].translation.slice();
                    if (createScale)
                    {
                        output[j].scale = this.mathDevice.v3BuildOne();
                    }
                    else if (outputScale)
                    {
                        output[j].scale = controllerOutput[j].scale.slice();
                    }
                }
            }
        }

        this.dirty = false;

        if (this.dirtyBounds)
        {
            this.updateBounds();
        }
    };

    updateBounds()
    {
        // Update and merge the bounds of all the controllers
        var controllers = this.controllers;
        var numControllers = controllers.length;

        if (numControllers)
        {
            for (var c = 0; c < numControllers; c += 1)
            {
                controllers[c].updateBounds();
            }

            var bounds0 = controllers[0].bounds;
            var bounds = { center: bounds0.center, halfExtent: bounds0.halfExtent };

            var mathDevice = this.mathDevice;
            var v3Add = mathDevice.v3Add;
            var v3ScalarMul = mathDevice.v3ScalarMul;
            var v3Max = mathDevice.v3Max;
            var v3Sub = mathDevice.v3Sub;
            var v3Abs = mathDevice.v3Abs;

            // accumulate the bounds as average of the center position and max of the extent
            // plus the half distance between the centers
            for (c = 1; c < numControllers; c += 1)
            {
                var controller = controllers[c];
                var cBounds = controller.bounds;

                var centerSum = v3Add.call(mathDevice, bounds.center, cBounds.center);
                var newCenter = v3ScalarMul.call(mathDevice, centerSum, 0.5, centerSum);
                bounds.center = newCenter;
                var newExtent = v3Max.call(mathDevice, bounds.halfExtent, cBounds.halfExtent);
                var centerOffset = v3Sub.call(mathDevice, bounds.center, newCenter);
                centerOffset = v3Abs.call(mathDevice, centerOffset, centerOffset);
                bounds.halfExtent = v3Add.call(mathDevice, newExtent, centerOffset, newExtent);
            }

            this.bounds = bounds;
        }

        this.dirtyBounds = false;
    };

    // Note this is purely a transform for the given joint and doesn't include parent transforms
    getJointTransform(jointId)
    {
        if (this.dirty)
        {
            // Note this is not necessarily the most efficient solution, we only need one joint
            this.update();
        }

        return this.output[jointId];
    };

    getJointWorldTransform(jointId: number, asMatrix?: bool)
    {
        if (this.dirty)
        {
            // May as well do a full update since we're accessing the output randomly
            this.update();
        }

        return Animation.standardGetJointWorldTransform(this, jointId, this.mathDevice, asMatrix);
    };

    setTime(time)
    {
        var controllers = this.controllers;
        var numControllers = controllers.length;
        for (var i = 0; i < numControllers; i += 1)
        {
            var controller = controllers[i];
            controller.setTime(time);
        }
        this.dirty = true;
        this.dirtyBounds = true;
    };

    setRate(rate)
    {
        var controllers = this.controllers;
        var numControllers = controllers.length;
        for (var i = 0; i < numControllers; i += 1)
        {
            controllers[i].setRate(rate);
        }
    };

    setMask(controllerIndex, maskJoints, maskArray)
    {
        var controller = this.controllers[controllerIndex];
        var hierarchy = controller.getHierarchy();
        var hierarchyNames = hierarchy.names;
        var hierarchyParents = hierarchy.parents;
        var numJoints = hierarchy.numNodes;

        var j;
        var mask;
        if (maskArray)
        {
            mask = maskArray.slice();
        }
        else
        {
            mask = [];
            for (j = 0; j < numJoints; j += 1)
            {
                mask[j] = false;
            }
        }
        this.masks[controllerIndex] = mask;

        // Build a dictionary of joint indices
        var jointDict = {};
        for (j = 0; j < numJoints; j += 1)
        {
            jointDict[hierarchyNames[j]] = j;
        }

        var hasParent = function hasParentFn(joint, parent)
        {
            while (joint !== -1)
            {
                if (joint === parent)
                {
                    return true;
                }
                joint = hierarchyParents[joint];
            }
            return false;
        };

        // Process the maskJoints string which is of the form
        // " *origin *hips -*waist "
        var maskList = maskJoints.split(" ");
        var numElements = maskList.length;
        for (var e = 0; e < numElements; e += 1)
        {
            var setValue = true;
            var maskStr = maskList[e];
            if (maskStr !== "")
            {
                if (maskStr[0] === "-")
                {
                    setValue = false;
                    maskStr = maskStr.slice(1);
                }
                if (maskStr[0] === "*")
                {
                    maskStr = maskStr.slice(1);
                    var rootIndex = jointDict[maskStr];
                    for (j = 0; j < numJoints; j += 1)
                    {
                        if (j === rootIndex ||
                            hasParent(j, rootIndex))
                        {
                            mask[j] = setValue;
                        }
                    }
                }
                else
                {
                    mask[jointDict[maskStr]] = setValue;
                }
            }
        }
    };

    getHierarchy()
    {
        // Return the first controller since they should all match
        return this.controllers[0].getHierarchy();
    };

    // Constructor function
    static create(controllers: ControllerBaseClass[]): MaskController
    {
        var c = new MaskController();
        c.outputChannels = {};
        c.controllers = [];
        c.masks = [];
        var numControllers = controllers.length;
        c.controllers.length = numControllers;
        for (var i = 0; i < numControllers; i += 1)
        {
            var inputController = controllers[i];
            c.controllers[i] = inputController;

            debug.assert(inputController.getHierarchy().numNodes === c.getHierarchy().numNodes,
                         "All controllers to a mask controller must have the same number of joints");

            AnimationChannels.add(c.outputChannels, inputController.outputChannels);
        }

        var md = TurbulenzEngine.getMathDevice();
        c.mathDevice = md;
        c.bounds = { center: md.v3BuildZero(), halfExtent: md.v3BuildZero() };

        c.output = [];
        c.dirty = true;
        c.dirtyBounds = true;


        return c;
    };
};

// The PoseController allows the user to set a fixed set of joint transforms to pose a hierarchy
class PoseController implements ControllerBaseClass
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    addTime(/* delta */)
    {
    };

    update()
    {
    };

    updateBounds()
    {
        // Update and bounds of the pose joints
        if (this.dirtyBounds)
        {
            // First generate ltms for the pose
            var md = this.mathDevice;
            var m43Mul = md.m43Mul;
            var m43Copy = md.m43Copy;
            var m43FromRTS = md.m43FromRTS;
            var m43FromRT = md.m43FromRT;
            var m43Pos = md.m43Pos;


            var output = this.output;
            var numJoints = this.hierarchy.numNodes;
            var parents = this.hierarchy.parents;
            var ltms = [];
            var jointMatrix;
            for (var j = 0; j < numJoints; j += 1)
            {
                if (output[j].scale)
                {
                    jointMatrix = m43FromRTS.call(md, output[j].rotation, output[j].translation, output[j].scale, jointMatrix);
                }
                else
                {
                    jointMatrix = m43FromRT.call(md, output[j].rotation, output[j].translation, jointMatrix);
                }

                var parent = parents[j];
                if (parent !== -1)
                {
                    ltms[j] = m43Mul.call(md, jointMatrix, ltms[parent], ltms[j]);
                }
                else
                {
                    ltms[j] = m43Copy.call(md, jointMatrix, ltms[j]);
                }
            }

            // Now add all the positions to a bbox
            var maxNumber = Number.MAX_VALUE;
            var min = md.v3Build(maxNumber, maxNumber, maxNumber);
            var max = md.v3Build(-maxNumber, -maxNumber, -maxNumber);
            for (j = 0; j < numJoints; j += 1)
            {
                jointMatrix = ltms[j];
                var pos = m43Pos.call(md, jointMatrix);
                min = md.v3Min(min, pos);
                max = md.v3Max(max, pos);
            }

            // Now set the bounds
            this.bounds.center = md.v3ScalarMul(md.v3Add(min, max), 0.5);
            this.bounds.halfExtent = md.v3ScalarMul(md.v3Sub(max, min), 0.5);
        }

        this.dirtyBounds = false;
    };

    // Note this is purely a transform for the given joint and doesn't include parent transforms
    getJointTransform(jointId)
    {
        var output = this.output;
        return output[jointId];
    };

    getJointWorldTransform(jointId: number, asMatrix?: bool)
    {
        return Animation.standardGetJointWorldTransform(this, jointId, this.mathDevice, asMatrix);
    };

    setTime(/* time */)
    {
    };

    setRate(/* rate */)
    {
    };

    setOutputChannels(channels)
    {
        this.outputChannels = channels;
    };

    setJointPose(jointIndex, rotation, translation, scale)
    {
        // TODO: should I clone the math structures
        this.output[jointIndex].rotation = rotation;
        this.output[jointIndex].translation = translation;
        this.output[jointIndex].scale = scale;
        this.dirtyBounds = true;
    };

    getHierarchy()
    {
        // Return the first controller since they should all match
        return this.hierarchy;
    };

    // Constructor function
    static create(hierarchy: Hierarchy): PoseController
    {
        var mathDevice = TurbulenzEngine.getMathDevice();

        var c = new PoseController();
        c.hierarchy = hierarchy;

        var md = TurbulenzEngine.getMathDevice();
        c.mathDevice = md;
        c.bounds = { center: md.v3BuildZero(), halfExtent: md.v3BuildZero() };

        var output = [];
        c.output = output;
        c.outputChannels = {};

        // Initialize the output based on the hierarchy joint count
        var identityQuat = mathDevice.quatBuild(0, 0, 0, 1);
        var identityPos = mathDevice.v3BuildZero();
        var identityScale = mathDevice.v3BuildOne();
        var numJoints = hierarchy.numNodes;
        for (var j = 0; j < numJoints; j += 1)
        {
            output[j] = { rotation: identityQuat, translation: identityPos, scale: identityScale };
        }
        c.dirtyBounds = true;

        return c;
    };
};

//
// NodeTransformController
//
class NodeTransformController
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    ltms: any[];     // m43[]  bone-local to model space?
    nodesMap: any[]; // TODO: Node
    scene: Scene;
    inputController: ControllerBaseClass;

    addTime(delta)
    {
        this.inputController.addTime(delta);
        this.dirty = true;
    };

    setInputController(input)
    {
        this.inputController = input;
        this.dirty = true;
    };

    setHierarchy(hierarchy, fromNode?)
    {
        var matchJointHierarchy = function matchJointHierarchyFn(rootIndex, rootNode, nodesMap, numJoints, jointNames, jointParents)
        {
            nodesMap[rootIndex] = rootNode;

            var nextIndex = rootIndex + 1;
            while (nextIndex < numJoints)
            {
                var nextJointParent = jointParents[nextIndex];
                var nextJointName = jointNames[nextIndex];
                if (nextJointParent !== rootIndex)
                {
                    // nextJoint doesn't have me as a parent so we must be going back up the hierarchy
                    return nextIndex;
                }
                else
                {
                    var foundChild = false;
                    var jointNode;
                    if (rootNode)
                    {
                        // Try and find a node matching the joint name
                        var jointName = nextJointName;
                        var children = rootNode.children;
                        if (children)
                        {
                            var numChildren = children.length;
                            for (var c = 0; c < numChildren; c += 1)
                            {
                                var child = rootNode.children[c];
                                if (child.name === jointName)
                                {
                                    foundChild = true;
                                    nextIndex = matchJointHierarchy(nextIndex, child, nodesMap, numJoints, jointNames, jointParents);
                                }
                            }
                        }
                    }
                    // and recurse if we never matched this node as a child
                    if (!foundChild)
                    {
                        nextIndex = matchJointHierarchy(nextIndex, jointNode, nodesMap, numJoints, jointNames, jointParents);
                    }
                }
            }

            return nextIndex;
        };

        this.hierarchy = hierarchy;
        this.dirty = true;

        var jointNames = hierarchy.names;
        var jointParents = hierarchy.parents;
        var numJoints = hierarchy.numNodes;
        for (var j = 0; j < numJoints; j += 1)
        {
            var parentIndex = jointParents[j];
            if (parentIndex === -1)
            {
                var rootNode = null;

                if (fromNode && fromNode.name === jointNames[j])
                {
                    rootNode = fromNode;
                }
                else
                {
                    rootNode = this.scene.findNode(jointNames[j]);
                }

                if (rootNode)
                {
                    j = matchJointHierarchy(j, rootNode, this.nodesMap, numJoints, jointNames, jointParents);
                }
            }
        }
    };

    setScene(scene)
    {
        this.scene = scene;
        this.setHierarchy(this.hierarchy);
    };

    update()
    {
        if (!this.dirty && !this.inputController.dirty)
        {
            return;
        }

        // first update our input data before we try and use it
        if (this.inputController.dirty)
        {
            this.inputController.update();
        }

        var mathDevice = this.mathDevice;

        // convert the input interpolator quat pos data into skinning matrices
        var node;
        var m43FromRTS = mathDevice.m43FromRTS;
        var m43FromQuatPos = mathDevice.m43FromQuatPos;
        var quatPosBuild = mathDevice.quatPosBuild;

        var interpOut = this.inputController.output;
        var interpChannels = this.inputController.outputChannels;
        var hasScale = interpChannels.scale;
        var hierarchy = this.hierarchy;
        var nodesMap = this.nodesMap;
        var ltms = this.ltms;
        var numJoints = hierarchy.numNodes;

        var jointMatrix, quatPos;

        for (var j = 0; j < numJoints; j += 1)
        {
            var interpVal = interpOut[j];

            if (hasScale)
            {
                jointMatrix = m43FromRTS.call(mathDevice, interpVal.rotation, interpVal.translation, interpVal.scale, jointMatrix);
            }
            else
            {
                quatPos = quatPosBuild.call(mathDevice, interpVal.rotation, interpVal.translation, quatPos);
                jointMatrix = m43FromQuatPos.call(mathDevice, quatPos, ltms[j]);
            }

            node = nodesMap[j];
            if (node)
            {
                node.setLocalTransform(jointMatrix);
            }
        }

        this.dirty = false;
    };

    // Constructor function
    static create(hierarchy: Hierarchy, scene: Scene): NodeTransformController
    {
        var c = new NodeTransformController();

        var numNodes = hierarchy.numNodes;
        c.dirty = true;
        c.ltms = [];
        c.ltms.length = numNodes;
        c.nodesMap = [];
        c.nodesMap.length = numNodes;
        c.scene = scene;
        c.setHierarchy(hierarchy);

        c.mathDevice = TurbulenzEngine.getMathDevice();

        return c;
    };
};

interface SkinControllerBase
{
    dirty: bool;
    skeleton: Skeleton;
    inputController: ControllerBaseClass;

    setInputController(input);
    setSkeleton(skeleton);
    update();
};

//
// SkinController
//
class SkinController implements SkinControllerBase
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    output: any[];       // TODO
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    // SkinControllerBase
    skeleton: Skeleton;
    inputController: ControllerBaseClass;
    // SkinControllerBase End

    md: MathDevice;  // TODO: use mathDevice like the base class
    ltms: any[]; // m43[]

    setInputController(input)
    {
        this.inputController = input;
        this.dirty = true;
    };

    setSkeleton(skeleton)
    {
        this.skeleton = skeleton;
        this.dirty = true;

        // Update the size of our buffers
        var newNumBones = skeleton.numNodes;
        this.ltms.length = newNumBones;
        this.output.length = newNumBones;
    };

    update()
    {
        if (!this.dirty && !this.inputController.dirty)
        {
            return;
        }

        // first update our input data before we try and use it
        if (this.inputController.dirty)
        {
            this.inputController.update();
        }

        // convert the input interpolator quat pos data into skinning matrices
        var md = this.md;
        var interpOut = this.inputController.output;
        var interpChannels = this.inputController.outputChannels;
        var hasScale = interpChannels.scale;
        var invBoneLTMs = this.skeleton.invBoneLTMs;
        var jointParents = this.skeleton.parents;
        var ltms = this.ltms;
        var output = this.output;
        var numBones = this.skeleton.numNodes;
        for (var b = 0; b < numBones; b += 1)
        {
            var interpVal = interpOut[b];
            var boneMatrix;
            if (hasScale)
            {
                boneMatrix = md.m43FromRTS(interpVal.rotation, interpVal.translation, interpVal.scale, ltms[b]);
            }
            else
            {
                boneMatrix = md.m43FromRT(interpVal.rotation, interpVal.translation, ltms[b]);
            }
            var parentIndex = jointParents[b];
            if (parentIndex !== -1)
            {
                boneMatrix = md.m43Mul(boneMatrix, ltms[parentIndex], ltms[b]);
            }
            ltms[b] = boneMatrix;
            output[b] = md.m43MulTranspose(invBoneLTMs[b], boneMatrix, output[b]);
        }
        this.dirty = false;
    };

    // Constructor function
    static create(md: MathDevice): SkinController
    {
        var c = new SkinController();

        c.md = md;
        c.dirty = true;
        c.ltms = [];
        c.output = [];

        return c;
    };
};

//
// GPUSkinController
//
class GPUSkinController implements SkinControllerBase
{
    static version = 1;

    // Controller Base
    mathDevice: MathDevice;
    bounds: Bounds;
    // TODO: This is a TechniqueParameterBuffer, so should probably be
    // renamed
    output: TechniqueParameterBuffer;
    outputChannels: any; // TODO
    dirty: bool;
    dirtyBounds: bool;
    hierarchy: Hierarchy;
    onUpdateCallback: { (controller: ControllerBaseClass): void; };
    onLoopCallback: { (controller: ControllerBaseClass): bool; };
    onFinishedCallback: { (controller: ControllerBaseClass): bool; };
    // Controller Base End

    // SkinControllerBase
    skeleton: Skeleton;
    inputController: ControllerBaseClass;
    // SkinControllerBase End

    md: MathDevice;        // TODO: use mathDevice like the base class
    gd: GraphicsDevice;
    ltms: any[];           // m43[]
    outputMat: any;        // m43
    convertedquatPos: any; // m43
    bufferSize: number;

    setInputController(input)
    {
        this.inputController = input;
        this.dirty = true;
    };

    setSkeleton(skeleton)
    {
        var oldNumBones = -1;
        if (this.skeleton)
        {
            oldNumBones = this.skeleton.numNodes;
        }
        this.skeleton = skeleton;
        this.dirty = true;

        // Update the size of our buffers
        var newNumBones = skeleton.numNodes;
        if (oldNumBones !== newNumBones)
        {
            this.ltms.length = newNumBones;
            var size = this.bufferSize || (newNumBones * 12);
            this.output = this.gd.createTechniqueParameterBuffer({
                numFloats : size,
                dynamic : true
            });
        }
    };

    update()
    {
        if (!this.dirty && !this.inputController.dirty)
        {
            return;
        }

        // first update our input data before we try and use it
        if (this.inputController.dirty)
        {
            this.inputController.update();
        }

        // convert the input interpolator quat pos data into skinning matrices
        var output = this.output;
        var writer = output.map();
        if (writer)
        {
            var md = this.md;
            var interpOut = this.inputController.output;
            var interpChannels = this.inputController.outputChannels;
            var hasScale = interpChannels.scale;
            var invBoneLTMs = this.skeleton.invBoneLTMs;
            var jointParents = this.skeleton.parents;
            var ltms = this.ltms;
            var outputMat = this.outputMat;
            var convertedquatPos = this.convertedquatPos;
            var ltm;
            var numBones = this.skeleton.numNodes;
            for (var b = 0; b < numBones; b += 1)
            {
                var interpVal = interpOut[b];
                var parentIndex = jointParents[b];

                if (parentIndex !== -1)
                {
                    if (hasScale)
                    {
                        convertedquatPos = md.m43FromRTS(interpVal.rotation, interpVal.translation, interpVal.scale, convertedquatPos);
                    }
                    else
                    {
                        convertedquatPos = md.m43FromRT(interpVal.rotation, interpVal.translation, convertedquatPos);
                    }
                    ltms[b] = ltm = md.m43Mul(convertedquatPos, ltms[parentIndex], ltms[b]);
                }
                else
                {
                    if (hasScale)
                    {
                        ltms[b] = ltm = md.m43FromRTS(interpVal.rotation, interpVal.translation, interpVal.scale, ltms[b]);
                    }
                    else
                    {
                        ltms[b] = ltm = md.m43FromRT(interpVal.rotation, interpVal.translation, ltms[b]);
                    }
                }

                outputMat = md.m43MulTranspose(invBoneLTMs[b], ltm, outputMat);
                writer(outputMat);
            }

            this.outputMat = outputMat;
            this.convertedquatPos = convertedquatPos;

            output.unmap(writer);
        }
        this.dirty = false;
    };

    // prototype
    defaultBufferSize : number;

    static setDefaultBufferSize(size: number)
    {
        GPUSkinController.prototype.defaultBufferSize = size;
    };

    // Constructor function
    static create(gd: GraphicsDevice, md: MathDevice,
                  bufferSize?: number): GPUSkinController
    {
        var c = new GPUSkinController();

        c.md = md;
        c.gd = gd;
        c.dirty = true;
        c.ltms = [];
        c.outputMat = undefined;
        c.convertedquatPos = undefined;
        c.bufferSize = bufferSize || GPUSkinController.prototype.defaultBufferSize;

        return c;
    };
};

GPUSkinController.prototype.defaultBufferSize = undefined;

//
// SkinnedNode
//
// TODO: Extends SceneNode?
class SkinnedNode
{
    static version = 1;

    md: MathDevice;
    input: ControllerBaseClass;
    skinController: SkinControllerBase;
    node: SceneNode;

    // prototype
    scratchM43 : any;
    scratchExtents : any;

    addTime(delta)
    {
        this.input.addTime(delta);
        this.skinController.dirty = true;
    };

    update(updateSkinController)
    {
        // update the skin controller
        var skinController = this.skinController;
        if (updateSkinController)
        {
            skinController.update();
        }
        else
        {
            if (this.input.dirtyBounds)
            {
                this.input.updateBounds();
            }
        }

        function setNodeHierarchyBoneMatricesAndBoundsFn(node, extents, skinController)
        {
            var isFullySkinned = (!node.lightInstances || node.lightInstances.length === 0);

            var renderables = node.renderables;
            if (renderables)
            {
                var numRenderables = renderables.length;
                for (var i = 0; i < numRenderables; i += 1)
                {
                    var renderable = renderables[i];
                    if (renderable.isSkinned())
                    {
                        renderable.skinController = skinController;
                        renderable.addCustomWorldExtents(extents);
                    }
                    else
                    {
                        isFullySkinned = false;
                    }
                }
            }

            var children = node.children;
            if (children)
            {
                var numChildren = children.length;
                for (var c = 0; c < numChildren; c += 1)
                {
                    var childSkinned = setNodeHierarchyBoneMatricesAndBoundsFn(children[c], extents, skinController);
                    if (!childSkinned)
                    {
                        isFullySkinned = false;
                    }
                }
            }

            if (isFullySkinned)
            {
                node.addCustomWorldExtents(extents);
            }
            else
            {
                if (node.getCustomWorldExtents())
                {
                    node.removeCustomWorldExtents();
                }
            }

            return isFullySkinned;
        }

        // calculate the bounds in world space
        var bounds = skinController.inputController.bounds;
        var extents = this.scratchExtents;
        var matrix = this.node.getWorldTransform();
        var c0 = bounds.center[0];
        var c1 = bounds.center[1];
        var c2 = bounds.center[2];
        var h0 = bounds.halfExtent[0];
        var h1 = bounds.halfExtent[1];
        var h2 = bounds.halfExtent[2];
        if (matrix)
        {
            var abs = Math.abs;

            var m0 = matrix[0];
            var m1 = matrix[1];
            var m2 = matrix[2];
            var m3 = matrix[3];
            var m4 = matrix[4];
            var m5 = matrix[5];
            var m6 = matrix[6];
            var m7 = matrix[7];
            var m8 = matrix[8];

            var ct0, ct1, ct2;
            if (c0 !== 0 ||
                c1 !== 0 ||
                c2 !== 0)
            {
                ct0 = (m0 * c0 + m3 * c1 + m6 * c2 + matrix[9]);
                ct1 = (m1 * c0 + m4 * c1 + m7 * c2 + matrix[10]);
                ct2 = (m2 * c0 + m5 * c1 + m8 * c2 + matrix[11]);
            }
            else
            {
                ct0 = matrix[9];
                ct1 = matrix[10];
                ct2 = matrix[11];
            }

            var ht0 = (abs(m0) * h0 + abs(m3) * h1 + abs(m6) * h2);
            var ht1 = (abs(m1) * h0 + abs(m4) * h1 + abs(m7) * h2);
            var ht2 = (abs(m2) * h0 + abs(m5) * h1 + abs(m8) * h2);

            extents[0] = (ct0 - ht0);
            extents[1] = (ct1 - ht1);
            extents[2] = (ct2 - ht2);
            extents[3] = (ct0 + ht0);
            extents[4] = (ct1 + ht1);
            extents[5] = (ct2 + ht2);
        }
        else
        {
            extents[0] = (c0 - h0);
            extents[1] = (c1 - h1);
            extents[2] = (c2 - h2);
            extents[3] = (c0 + h0);
            extents[4] = (c1 + h1);
            extents[5] = (c2 + h2);
        }

        setNodeHierarchyBoneMatricesAndBoundsFn(this.node, extents, skinController);
    };

    getJointIndex(jointName)
    {
        var jointNames = this.skinController.skeleton.names;
        var numBones = this.skinController.skeleton.numNodes;
        var jointIndex = -1;
        for (var b = 0; b < numBones; b += 1)
        {
            if (jointNames[b] === jointName)
            {
                jointIndex = b;
                break;
            }
        }
        return jointIndex;
    };

    getJointLTM(jointIndex, dst)
    {
        if (this.input.dirty)
        {
            this.input.update();
        }

        // convert the input quat pos data into skinning matrices
        var md = this.md;
        var m43FromRT = md.m43FromRT;
        var m43FromRTS = md.m43FromRTS;
        var m43Mul = md.m43Mul;
        var interpOut = this.input.output;
        var interpChannels = this.input.outputChannels;
        var hasScale = interpChannels.scale;

        var jointParents = this.skinController.skeleton.parents;

        var boneMatrix;
        if (hasScale)
        {
            boneMatrix = m43FromRTS.call(md,
                                         interpOut[jointIndex].rotation,
                                         interpOut[jointIndex].translation,
                                         interpOut[jointIndex].scale,
                                         dst);
        }
        else
        {
            boneMatrix = m43FromRT.call(md,
                                        interpOut[jointIndex].rotation,
                                        interpOut[jointIndex].translation,
                                        dst);
        }

        var parentMatrix = this.scratchM43;

        while (jointParents[jointIndex] !== -1)
        {
            jointIndex = jointParents[jointIndex];
            if (hasScale)
            {
                parentMatrix = m43FromRTS.call(md,
                                               interpOut[jointIndex].rotation,
                                               interpOut[jointIndex].translation,
                                               interpOut[jointIndex].scale,
                                               parentMatrix);
            }
            else
            {
                parentMatrix = m43FromRT.call(md,
                                              interpOut[jointIndex].rotation,
                                              interpOut[jointIndex].translation,
                                              parentMatrix);
            }
            boneMatrix = m43Mul.call(md, boneMatrix, parentMatrix, boneMatrix);
        }
        return boneMatrix;
    };

    setInputController(controller)
    {
        this.input = controller;
        this.skinController.setInputController(controller);
        this.skinController.dirty = true;
    };

    getSkeleton()
    {
        return this.skinController.skeleton;
    };

    // Constructor function
    static create(gd: GraphicsDevice, md: MathDevice,
                  node: SceneNode,
                  skeleton: Skeleton,
                  inputController?: ControllerBaseClass,
                  bufferSize?: number): SkinnedNode
    {
        var sn = new SkinnedNode();

        sn.md = md;
        sn.input = inputController;
        if (gd)
        {
            sn.skinController = GPUSkinController.create(gd, md, bufferSize);
        }
        else
        {
            sn.skinController = SkinController.create(md);
        }

        if (sn.input)
        {
            sn.skinController.setInputController(sn.input);
        }
        sn.skinController.setSkeleton(skeleton);
        sn.node = node;

        if (sn.scratchM43 === null)
        {
            SkinnedNode.prototype.scratchM43 = md.m43BuildIdentity();
        }

        if (sn.scratchExtents === null)
        {
            SkinnedNode.prototype.scratchExtents = md.aabbBuildEmpty();
        }

        return sn;
    };
};

SkinnedNode.prototype.scratchM43 = null;
SkinnedNode.prototype.scratchExtents  = null;
