.. index::
    single: Animation

.. highlight:: javascript

=====================
The Animation Objects
=====================

Collection of animation controllers designed to allow the developer to construct and evaluate/query animation trees.
Controllers read their input data either from supplied data sources (e.g. keyframe interpolators) or from other
controllers (e.g. blending controllers).
Controllers either write data out to an output array (to be passed to other controllers) or to a specified data
target (e.g. GPU skinning controllers will write to shader constant buffers).
Controllers are designed to be evaluated on demand to ensure that time is not spent evaluating data which is unused.
Each controller implements an addTime and update method, addTime should be called per frame and will trigger events
on animations whilst update should only be called prior to reading data from a controller, update will ensure all the
controllers dependents are updated as necessary.

**Required scripts**

The Animation objects require::

    /*{{ javascript("jslib/animation.js") }}*/

.. _interpolatorcontroller:

.. index::
    pair: Animation; InterpolatorController

---------------------------------
The InterpolatorController Object
---------------------------------

Provides a controller designed to interpolate a stream of quaternion and position keyframes over time. Once created
an interpolator controller can have animations assigned to it followed by adding delta time values.
Based on the current time, calling Update will calculate interpolated values for each of the joints represented by
the animation.
Animations assigned to the controller can be both one shot or looping animations, on finished or on loop callbacks
will be called based on the setting and on update callbacks called each time the controller has time added to it.
Through these callbacks a game is free to implement its own event systems based on time keys in animations.

Constructor
===========

.. index::
    pair: InterpolatorController; create

`create`
--------

**Summary**

Creates a new InterpolatorController which can be used to interpolate animations created for the given hierarchical
node structure.

**Syntax** ::

    var interpolator = InterpolatorController.create(hierarchy);

Methods
=======

.. index::
    pair: InterpolatorController; setAnimation

`setAnimation`
--------------

**Summary**

Set the animation to be interpolated by this controller. The second parameter specifies whether or not to loop
the animation automatically on completion. Calling this method will also set the current time on the interpolator
back to 0.

**Syntax** ::

    interpolator.setAnimation(animation, true);

.. index::
    pair: InterpolatorController; addTime

`addTime`
---------

**Summary**

Step the interpolator forward the specified amount of time in seconds. If the interpolator steps beyond the
length of the attached animation then it will call either the onFinishedCallback or the onLoopCallback in
the case where the animation is flagged for looped playback.
The interpolator will always call the onUpdateCallback if one is assigned.

**Syntax** ::

    interpolator.addTime(delta);

.. index::
    pair: InterpolatorController; setTime

`setTime`
---------

**Summary**

Set the current time on the interpolator, unlike addTime this is not treated as a step to the specified time
and thus won't call any of the callbacks.

**Syntax** ::

    interpolator.setTime(time);

.. index::
    pair: InterpolatorController; setRate

`setRate`
---------

**Summary**

Sets the rate at which the animation is played back, in the simplest sense this is simply a multiplier applied to
values passed into addTime.

Defaults to 1.

**Syntax** ::

    interpolator.setRate(rate);

.. index::
    pair: InterpolatorController; update

`update`
--------

**Summary**

A call to update will evaluate the state of the interpolator at the currentTime as set through addTime or
setTime calls. This will calculate interpolated keyframes for each node in the interpolator and write it to
the output buffer.
Update will also update the bounds if they are dirty.

**Syntax** ::

    interpolator.update();

.. index::
    pair: InterpolatorController; updateBounds

`updateBounds`
--------------

**Summary**

A call to updateBounds will evaluate the bounds of the keyframe data for the current time. This evaluation is
faster than fully evaluating the interpolator and the results can be used to potentially reject a full update
where the results would not be used by rendering systems etc.

**Syntax** ::

    interpolator.updateBounds();

Properties
==========

.. index::
    pair: InterpolatorController; version

`version`
---------

**Summary**

The version number of the InterpolatorController implementation.

**Syntax** ::

    var versionNumber = interpolatorController.version;

.. index::
    pair: InterpolatorController; bounds

`bounds`
--------

**Summary**

Access to the interpolated bounds of the animation. To ensure it is up to date, call updateBounds or update before
accessing.

**Syntax** ::

    var bounds = interpolatorController.bounds;

.. index::
    pair: InterpolatorController; output

`output`
--------

**Summary**

Access to the output buffer of the interpolator. To ensure it is up to date, call update before accessing.

**Syntax** ::

    var outputBuffer = interpolatorController.output;

.. index::
    pair: InterpolatorController; onUpdateCallback

`onUpdateCallback`
------------------

**Summary**

Get or set the callback function to be called every time the interpolator has time added to it.
The callback is passed the interpolator object as a parameter.

**Syntax** ::

    interpolatorController.onUpdateCallback = function updateCallback(interp) {};

.. index::
    pair: InterpolatorController; onFinishedCallback

`onFinishedCallback`
--------------------

**Summary**

Get or set the callback function to be called every time a non-looping animation finishes.
The callback is passed the interpolator object as a parameter.
The return value specifies whether or not to continue after the callback is completed.

**Syntax** ::

    interpolatorController.onFinishedCallback = function finishedCallback(interp) { return false; };

.. index::
    pair: InterpolatorController; onLoopCallback

`onLoopCallback`
----------------

**Summary**

Get or set the callback function which should be called every time a looping animation loops.
The callback is passed the interpolator object as a parameter.
The return value specifies whether or not to continue after the callback is completed.

**Syntax** ::

    interpolatorController.onLoopCallback = function loopCallback(interp) { return false; };

.. index::
    pair: InterpolatorController; getJointTransform

`getJointTransform`
-------------------

**Summary**

Get the transform for an individual joint being animated by the interpolation controller.
The return value is a 4x3 matrix representation of any translation, rotation or scale relative to the joints
parent.

**Syntax** ::

    var jointMatrix = interpolator.getJointTransform(jointId);


.. index::
    pair: InterpolatorController; getJointWorldTransform

`getJointWorldTransform`
------------------------

**Summary**

Get the transform for a joint being animated by the interpolation controller.
The return value is a representation of the hierarchy space transform for the given joint. For example
for a hierarchy which is positioned relative to some entity transforming this result by the entities world space
transform would yield a world space transform for the joint.
The optional second parameter specifies whether to convert the return value to a 4x3 matrix representation. By
default an object containing the separated rotation, scale and position is returned

**Syntax** ::

    var jointMatrix = interpolator.getJointWorldTransform(jointId, True);

.. index::
    pair: Animation; OverloadedNodeController

-----------------------------------
The OverloadedNodeController Object
-----------------------------------

Provides a controller designed to replace specific nodes from one input controller with nodes from another controller.
An example of this would be if a characters main torso and head were dealt with as separate hierarchies, this controller
would allow the root node of the heads controller to be replaced with the neck joint from the torso controller.

.. highlight:: javascript


Constructor
===========

.. index::
    pair: OverloadedNodeController; create

`create`
--------

**Summary**

Creates an overloaded controller based upon the base controller passed in. The evaluation of this controller will
generate a copy of the base controllers output with any nodes replaced for which an overload has been supplied.

**Syntax** ::

    var controller = OverloadedNodeController.create(baseController);

Methods
=======

.. index::
    pair: OverloadedNodeController; addTime

`addTime`
---------

**Summary**

Adds the given delta time to the baseController. Note that this method does not add time to the controllers
providing any overloads.

**Syntax** ::

    controller.addTime(delta);

.. index::
    pair: OverloadedNodeController; update

`update`
--------

**Summary**

Updates the output of the controller. The baseController is first updated and it's output is copied to this
controllers output. For each overload specified the controller supplying the overload is updated where dirty and
the overload is evaluated as a world space transform and used in place of the base controllers transform.
Update will also update the bounds if they are dirty.

**Syntax** ::

    controller.update();

.. index::
    pair: OverloadedNodeController; updateBounds

`updateBounds`
--------------

**Summary**

Updates the bounds of the controller. The bounds are currently represented by the bounds of the base controller.

**Syntax** ::

    controller.updateBounds();

.. index::
    pair: OverloadedNodeController; getHierarchy

`getHierarchy`
--------------

**Summary**

Returns the hierarchy representation used by the base controller.

**Syntax** ::

    var hierarchy = controller.getHierarchy();

.. index::
    pair: OverloadedNodeController; addOverload

`addOverload`
--------------

**Summary**

Adds an overload to the controller. The inputs are the controller from which to copy the overload, the index of the
joint which should be copied and the index where the overload should be stored in this controller.

**Syntax** ::

    headController.addOverload(torsoController, neckJointIndex, headRootJointIndex);

.. index::
    pair: OverloadedNodeController; getJointTransform

`getJointTransform`
-------------------

**Summary**

Get the transform for an individual joint being animated by the controller. This transform will be correctly
selected based on any overloads applied.
The return value is a 4x3 matrix representation of any translation, rotation or scale relative to the joints
parent.

**Syntax** ::

    var jointMatrix = interpolator.getJointTransform(jointId);


.. index::
    pair: OverloadedNodeController; getJointWorldTransform

`getJointWorldTransform`
------------------------

**Summary**

Get the transform for a joint being animated by the controller. The transform will take into account any overloads
which have been applied.
The return value is a representation of the hierarchy space transform for the given joint. For example
for a hierarchy which is positioned relative to some entity transforming this result by the entities world space
transform would yield a world space transform for the joint.
The optional second parameter specifies whether to convert the return value to a 4x3 matrix representation. By
default an object containing the separated rotation, scale and position is returned

**Syntax** ::

    var jointMatrix = interpolator.getJointWorldTransform(jointId, True);

Properties
==========

.. index::
    pair: OverloadedNodeController; version

`version`
---------

**Summary**

The version number of the OverloadedNodeController implementation.

**Syntax** ::

    var versionNumber = overloadedNodeController.version;


.. index::
    pair: Animation; ReferenceController

------------------------------
The ReferenceController Object
------------------------------

The reference controller is provided as a helper object used to facilitate modifications of the controller tree at
runtime. In some situations it may be needed to switch a controller in the tree, for example from a transition
controller to a blend controller. Because each controller has no links to the controllers which reference it, a
reference controller can be added instead, such that the parents all reference only the reference controller.
Different controllers can then be swapped in and out by updating what the reference controller points to.
A reference controller automatically inherits all API from whichever controller it is proxying.

.. highlight:: javascript

Constructor
===========

.. index::
    pair: ReferenceController; create

`create`
--------

**Summary**

Create a reference controller with it's current target set as the base controller supplied.

**Syntax** ::

    var interpolator = ReferenceController.create(baseController);

Methods
=======

.. index::
    pair: ReferenceController; setReferenceController

`setReferenceController`
------------------------

**Summary**

Changes the target of the reference controller. At this point the reference controllers API will switch between it's
old target controller and the new target controller. The setReferenceController method will be persisted during the
switch.

**Syntax** ::

    controller.setReferenceController(newTargetController);


.. index::
    pair: Animation; TransitionController

-------------------------------
The TransitionController Object
-------------------------------

A TransitionController provides a way to evaluate a blend between the output of two other controllers. This sort of
controller will often be used to transition between a pair of animations which have no common pose at which they
can be switched.

.. highlight:: javascript

Constructor
===========

.. index::
    pair: TransitionController; create

`create`
--------

**Summary**

Creates a new transition controller which will blend between the current state of the startController and
endController provided. The transition will occur over length time.

**Syntax** ::

    var controller = TransitionController.create(startController, endController, length);

Methods
=======

.. index::
    pair: TransitionController; addTime

`addTime`
---------

**Summary**

Adds the given delta time to the transition controller. If the time added takes the controller past the length of the
transition then the onFinishedTransitionCallback will be called if set. The onUpdateCallback will also be called each
time the addTime method is called.

**Syntax** ::

    controller.addTime(deltaTime);


.. index::
    pair: TransitionController; update

`update`
--------

**Summary**

Evaluates the current state of the transition between the two input controllers based on the amount of time which
has passed since the controller was created. The input controllers are both updated before evaluation (thus they can
be modified if required during the transition). If either of the input controllers includes scale in it's output then
the transition controller will also include scale, if only one input provides scale the second will be assumed to have
unit scale.
Update will also update the bounds if they are dirty.

**Syntax** ::

    controller.update();

.. index::
    pair: TransitionController; updateBounds

`updateBounds`
--------------

**Summary**

Evaluates the current bounds of the input controllers for the transition and generates a set of bounds which will
contain both inputs and thus any resulting transitional blend.

**Syntax** ::

    controller.updateBounds();

.. index::
    pair: TransitionController; getJointTransform

`getJointTransform`
-------------------

**Summary**

Get the transform for an individual joint being animated by the transition controller. The transform will be
evaluated based on the current state of the transition.
The return value is a 4x3 matrix representation of any translation, rotation or scale relative to the joints
parent.

**Syntax** ::

    var jointMatrix = interpolator.getJointTransform(jointId);


.. index::
    pair: TransitionController; getJointWorldTransform

`getJointWorldTransform`
------------------------

**Summary**

Get the transform for a joint being animated by the transition controller. All joints involved in the evaluation
will be included based on their current state during the transition.
The return value is a representation of the hierarchy space transform for the given joint. For example
for a hierarchy which is positioned relative to some entity transforming this result by the entities world space
transform would yield a world space transform for the joint.
The optional second parameter specifies whether to convert the return value to a 4x3 matrix representation. By
default an object containing the separated rotation, scale and position is returned

**Syntax** ::

    var jointMatrix = interpolator.getJointWorldTransform(jointId, True);

.. index::
    pair: TransitionController; setStartController

`setStartController`
--------------------

**Summary**

Changes the start controller used in the transition. This will also dirty the transition controller but will not reset
the transition to the start, call setTime(0) if required.

**Syntax** ::

    controller.setStartController(controllerA);

.. index::
    pair: TransitionController; setEndController

`setEndController`
------------------

**Summary**

Changes the end controller used in the transition. This will also dirty the transition controller but will not reset the
transition to the start, call setTime(0) if required.

**Syntax** ::

    controller.setEndController(controllerB);

.. index::
    pair: TransitionController; setTransitionLength

`setTransitionLength`
---------------------

**Summary**

Sets the length of time (in seconds) over which the transition from the start controller to the end controller will
occurs. This will also dirty the transition controller but will not reset the transition to the start, call setTime(0)
if required.

**Syntax** ::

    controller.setTransitionLength(0.5);

.. index::
    pair: TransitionController; setTime

`setTime`
---------

**Summary**

Sets the current time for the transition controller, subsequent calls to addTime will be relative to this.
This will dirty the transition controller forcing a reevaluation even if addTime is not subsequently called.

**Syntax** ::

    controller.setTime(0);

.. index::
    pair: TransitionController; setRate

`setRate`
---------

**Summary**

Sets the rate for the transition, the rate can be used as a scale for how fast a transition is required to happen.
This could be accomplished by applying the rate to the initial transition length however rates can be changed during
a transition allowing things like non linear transitions.
The default rate is 1

**Syntax** ::

    controller.setRate(2);

.. index::
    pair: TransitionController; getHierarchy

`getHierarchy`
--------------

**Summary**

Returns the hierarchy representing the joints being animated by the transition. This currently returns the start
controller hierarchy as start and end controllers are currently required to have matching hierarchies.

**Syntax** ::

    var hierarchy = controller.getHierarchy();

Properties
==========

.. index::
    pair: TransitionController; version

`version`
---------

**Summary**

The version number of the TransitionController implementation.

**Syntax** ::

    var versionNumber = transitionController.version;

.. index::
    pair: TransitionController; onUpdateCallback

`onUpdateCallback`
------------------

**Summary**

Get or set the callback function to be called every time the TransitionController has time added to it.
The callback is passed the TransitionController object as a parameter.

**Syntax** ::

    transitionController.onUpdateCallback = function updateCallback(transition) {};

.. index::
    pair: TransitionController; onFinishedTransitionCallback

`onFinishedTransitionCallback`
------------------------------

**Summary**

Get or set the callback function to be called every time a transition animation finishes.
The callback is passed the transition object as a parameter.
The return value specifies whether or not to continue after the callback is completed.

**Syntax** ::

    transitionController.onFinishedTransitionCallback = function finishedTransitionCallback(transition) { return false };

.. index::
    pair: Animation; BlendController

--------------------------
The BlendController Object
--------------------------

A BlendController is used to provide a blend between an array of controllers given a delta. The controller can be used
for a situation such as having a character where you have a run cycle with variations for running to the left and right.
By setting up a blend controller with 3 inputs (running to the left, running forward and running to the right) the delta
can then be supplied in a range of 0 running to the left, 0.5 running forward and 1 running to the right. By varying
the delta the animations will be blended accordingly.

.. highlight:: javascript

Constructor
===========

.. index::
    pair: BlendController; create

`create`
--------

**Summary**

Creates a new blend controller referencing a set of input controllers supplied in an array of controllers. All
controllers involved in a blend are required to have the same hierarchical layout and thus the same number of nodes.
The output channels of the blend controller will be a union of the input channels from the controllers passed in.

**Syntax** ::

    var blendController = BlendController.create(controllers);

Methods
=======

.. index::
    pair: BlendController; addTime

`addTime`
---------

**Summary**

Adds the given delta time to the blend controller which in turn adds the delta time to all the controllers involved
in the blend. If any of those controllers have update callbacks, looping callbacks or finished callbacks then they
may fire during the call.

**Syntax** ::

    controller.addTime(deltaTime);

.. index::
    pair: BlendController; update

`update`
--------

**Summary**

Evaluates the current state of the blend between the input controllers based on the delta set on the controller. The
pair of controllers which are are active based on the blend delta will both be updated before evaluation.
If any of the input controllers includes scale in it's output then the blend controller will also include scale, in this
scenario if any of the active controllers based on the delta do not provide scale then a unit scale will be inserted.
Update will also update the bounds if they are dirty.

**Syntax** ::

    blendController.update();

.. index::
    pair: BlendController; updateBounds

`updateBounds`
--------------

**Summary**

Evaluates the current bounds of the input controllers currently active for the blend and generates a set of bounds
which will contain them and thus any resulting blend.

**Syntax** ::

    controller.updateBounds();

.. index::
    pair: BlendController; getJointTransform

`getJointTransform`
-------------------

**Summary**

Get the transform for an individual joint being animated by the blend controller. The joint transform will be
based on the evaluation of the blend being performed.
The return value is a 4x3 matrix representation of any translation, rotation or scale relative to the joints
parent.

**Syntax** ::

    var jointMatrix = controller.getJointTransform(jointId);


.. index::
    pair: BlendController; getJointWorldTransform

`getJointWorldTransform`
------------------------

**Summary**

Get the transform for a joint being animated by the blend controller. Any joints included in the evaluation will
be used based on their state at the current point of the blend
The return value is a representation of the hierarchy space transform for the given joint. For example
for a hierarchy which is positioned relative to some entity transforming this result by the entities world space
transform would yield a world space transform for the joint.
The optional second parameter specifies whether to convert the return value to a 4x3 matrix representation. By
default an object containing the separated rotation, scale and position is returned

**Syntax** ::

    var jointMatrix = controller.getJointWorldTransform(jointId, True);

.. index::
    pair: BlendController; setBlendDelta

`setBlendDelta`
---------------

**Summary**

Sets the delta to be used to determine the blend between the input controllers. With a pair of input controllers a
delta of 0 would result in the same output as the first controller, a delta of 1 resulting in the output from the
second controller and in between a linear blend. With three controllers 0 would give the first, 0.5 the second and 1
the third, values from 0 to 0.5 would blend between the first pair etc.

**Syntax** ::

    controller.setBlendDelta(0.5);

.. index::
    pair: BlendController; setTime

`setTime`
---------

**Summary**

Sets the current time for the blend controller, subsequent calls to addTime will be relative to this.
This will dirty the blend controller and set the time on all controllers used by the blend to this time.

**Syntax** ::

    controller.setTime(0);

.. index::
    pair: BlendController; setRate

`setRate`
---------

**Summary**

Sets the rate for the controllers used in the blend. This call will change the rate of any controllers referenced by
the blend controller so ensure that they aren't expected to be used by other sources with the original rate.
The default rate for controllers is 1

**Syntax** ::

    controller.setRate(2);

.. index::
    pair: BlendController; getHierarchy

`getHierarchy`
--------------

**Summary**

Returns the hierarchy representing the joints being animated by the blend. This currently returns the hierarchy from the
first controller as all controllers in a blend are currently required to have matching hierarchies.

**Syntax** ::

    var hierarchy = controller.getHierarchy();

Properties
==========

.. index::
    pair: BlendController; version

`version`
---------

**Summary**

The version number of the BlendController implementation.

**Syntax** ::

    var versionNumber = blendController.version;


.. index::
    pair: Animation; MaskController

-------------------------
The MaskController Object
-------------------------

A MaskController allows a number of input controllers to be mixed together based on a mask specifying which controller
each node should be evaluated from. A common use might be with a game character where the upper torso is an animated
separately from the leg animations. The two animations can be run on separate controllers and joined by masking the
legs and upper torso from the appropriate input controller.

.. highlight:: javascript

Constructor
===========

.. index::
    pair: MaskController; create

`create`
--------

**Summary**

Creates a new mask controller referencing all the controllers passed into the create function. No masks are added
during creation and thus masks need to be set up with setMask prior to using the controller.

**Syntax** ::

    var controller = MaskController.create(controllers);

Methods
=======

.. index::
    pair: MaskController; addTime

`addTime`
---------

**Summary**

Adds the given delta time to the mask controller which in turn adds the delta time to all the controllers involved
in the mask. If any of those controllers have update callbacks, looping callbacks or finished callbacks then they
may fire during the call.

**Syntax** ::

    controller.addTime(delta);

.. index::
    pair: MaskController; update

`update`
--------

**Summary**

Updates the output of the controller. The controllers referenced by the mask are first updated and then the mask
output is created based on copying channels from each controller dependent on the flags set by the defined
masks.
Update will also update the bounds if they are dirty.

**Syntax** ::

    controller.update();

.. index::
    pair: MaskController; updateBounds

`updateBounds`
--------------

**Summary**

Updates the bounds of the controller. The bounds are based on the accumulation of the bounds of each animation involved
in the mask operation.

**Syntax** ::

    controller.updateBounds();


.. index::
    pair: MaskController; getJointTransform

`getJointTransform`
-------------------

**Summary**

Get the transform for an individual joint being animated by the mask controller. The joint transform will be
evaluated from the correct input controller based on the mask.
The return value is a 4x3 matrix representation of any translation, rotation or scale relative to the joints
parent.

**Syntax** ::

    var jointMatrix = controller.getJointTransform(jointId);


.. index::
    pair: MaskController; getJointWorldTransform

`getJointWorldTransform`
------------------------

**Summary**

Get the transform for a joint being animated by the mask controller. The joints involved in the evaluation
will be selected based on any masks set on the controller.
The return value is a representation of the hierarchy space transform for the given joint. For example
for a hierarchy which is positioned relative to some entity transforming this result by the entities world space
transform would yield a world space transform for the joint.
The optional second parameter specifies whether to convert the return value to a 4x3 matrix representation. By
default an object containing the separated rotation, scale and position is returned

**Syntax** ::

    var jointMatrix = controller.getJointWorldTransform(jointId, True);

.. index::
    pair: MaskController; setTime

`setTime`
---------

**Summary**

Sets the current time for the mask controller, subsequent calls to addTime will be relative to this. This operation
will set the time on all controllers used by the mask controller.
This will dirty the mask controller forcing a reevaluation even if addTime is not subsequently called.

**Syntax** ::

    controller.setTime(0);

.. index::
    pair: MaskController; setRate

`setRate`
---------

**Summary**

Sets the rate for the mask controller, this will set the rate on each of the controllers used by the mask operation.
The default rate is 1

**Syntax** ::

    controller.setRate(2);

.. index::
    pair: MaskController; setMask

`setMask`
---------

**Summary**

Sets a mask on the mask controller for the input controller given by the controller index. The masks can be defined
by either names of joints with wildcards specifying branches of the joint hierarchy or by a boolean mask or a
combination of both. The maskJoints list is a string of space separated joint names where a prefix of "-" indicates
negation from the mask and a "\*" prefix denotes traversing the hierarchy.
An example string might be "\*waist -\*leftKnee -\*rightKnee" which would specify all the joints from waist down but
subtracting joints from leftKnee down and rightKnee down.
Mask array is simply an array of booleans one per joint specifying whether to include each joint or not.

**Syntax** ::

    controller.setMask(controllerIndex, "*waist", null);

.. index::
    pair: MaskController; getHierarchy

`getHierarchy`
--------------

**Summary**

Returns the hierarchy representation used by the first controller, since all controllers in a mask controller
currently need the same hierarchical description.

**Syntax** ::

    var hierarchy = controller.getHierarchy();

Properties
==========

.. index::
    pair: MaskController; version

`version`
---------

**Summary**

The version number of the MaskController implementation.

**Syntax** ::

    var versionNumber = maskController.version;

.. index::
    pair: Animation; PoseController

-------------------------
The PoseController Object
-------------------------

A PoseController allows a fixed state of an array of nodes to be supplied as an input to other controllers. It can be
used where the state (or pose) is being created programmatically by another system e.g. physics ragdolls

.. highlight:: javascript

Constructor
===========

.. index::
    pair: PoseController; create

`create`
--------

**Summary**

Creates a new pose controller with the joints specified by the hierarchy supplied. Initially the PoseController will
be created with all the joints in an identity transform.

**Syntax** ::

    var controller = PoseController.create(hierarchy);

Methods
=======

.. index::
    pair: PoseController; addTime

`addTime`
---------

**Summary**

Adds the given delta time to the pose controller note this operation is a null operation.

**Syntax** ::

    controller.addTime(deltaTime);

.. index::
    pair: PoseController; update

`update`
--------

**Summary**

Updates the PoseController in it's current state. Because the pose is fixed this is a null operation.

**Syntax** ::

    controller.update();

.. index::
    pair: PoseController; updateBounds

`updateBounds`
--------------

**Summary**

Updates the bounds of the PoseController in it's current state. Because the pose is fixed this will only update the
bounds if any new pose transforms have been set. The bounds are calculated as a volume containing all the joints
for the current pose.

**Syntax** ::

    controller.updateBounds();

.. index::
    pair: PoseController; getJointTransform

`getJointTransform`
-------------------

**Summary**

Get the transform for an individual joint being animated by the pose controller. The joint transform returned
will be the joint transform originally set for the pose.
The return value is a 4x3 matrix representation of any translation, rotation or scale relative to the joints
parent.

**Syntax** ::

    var jointMatrix = controller.getJointTransform(jointId);


.. index::
    pair: PoseController; getJointWorldTransform

`getJointWorldTransform`
------------------------

**Summary**

Get the transform for a joint being animated by the pose controller. The transform will be evaluated based on
the pose matrices originally set.
The return value is a representation of the hierarchy space transform for the given joint. For example
for a hierarchy which is positioned relative to some entity transforming this result by the entities world space
transform would yield a world space transform for the joint.
The optional second parameter specifies whether to convert the return value to a 4x3 matrix representation. By
default an object containing the separated rotation, scale and position is returned

**Syntax** ::

    var jointMatrix = controller.getJointWorldTransform(jointId, True);

.. index::
    pair: PoseController; setTime

`setTime`
---------

**Summary**

Sets the current time for the pose controller, note this operation is a null operation.

**Syntax** ::

    controller.setTime(0);

.. index::
    pair: PoseController; setRate

`setRate`
---------

**Summary**

Sets the current rate for the pose controller note this operation is a null operation.

**Syntax** ::

    controller.setRate(1);

.. index::
    pair: PoseController; setOutputChannels

`setOutputChannels`
-------------------

**Summary**

Sets the output channels to be supported by the PoseController. For most controllers the output channels can be
determined from the input data. Since the PoseController is based off pose transforms which are set dynamically the
channels required for output need to be specified.

**Syntax** ::

    var channels = {
        rotation: True,
        translation: True
    };
    controller.setOutputChannels(channels);

.. index::
    pair: PoseController; setJointPose

`setJointPose`
--------------

**Summary**

Sets a joint pose transform for the given joint index. The transform is supplied as rotation, translation and scale
components (with rotation as a Quaternion). Components can be left out where required as long as the output channels
are specified to match, and the controllers reading the PoseController as input can deal with those sets of channels.

**Syntax** ::

    controller.setJointPose(jointIndex, rotation, position, scale);

.. index::
    pair: PoseController; getHierarchy

`getHierarchy`
--------------

**Summary**

Returns the hierarchy representation used by the pose controller.

**Syntax** ::

    var hierarchy = controller.getHierarchy();

Properties
==========

.. index::
    pair: PoseController; version

`version`
---------

**Summary**

The version number of the PoseController implementation.

**Syntax** ::

    var versionNumber = poseController.version;

.. index::
    pair: Animation; AnimationChannels

----------------------------
The AnimationChannels Object
----------------------------

The AnimationChannels object provides a set of functions to define collections of channels used by the animation
objects. These collections are used to define the inputs and outputs between the various controllers, for example
when blending between a pair of animations where one animates scale and the other doesn't it's possible to use the
channels to allow a controller to introduce a fixed normal scale.

.. highlight:: javascript

Methods
=======

.. index::
    pair: AnimationChannels; copy

`copy`
------

**Summary**

Allows a copy of a set of AnimationChannels to be made, this copy can then be manipulated for a specific use case.

**Syntax** ::

    var newChannels = AnimationChannels.copy(oldChannels);

.. index::
    pair: AnimationChannels; union

`union`
-------

**Summary**

Returns the union of two input sets of channels. The union is a new object and can be manipulated without affecting
the original inputs.

**Syntax** ::

    var channelUnion = AnimationChannels.union(interpolator.outputChannels, blender.outputChannels);


.. index::
    pair: AnimationChannels; add

`add`
-----

**Summary**

Adds a set of channels to an existing set. In other words performs a union returning the result in the first input.
Therefore union is required if anything is using the input in the existing state, however if the first input set
is no longer required this is more efficient than union.

**Syntax** ::

    AnimationChannels.add(outputChannels, blender.outputChannels);


.. index::
    pair: Animation; NodeTransformController

----------------------------------
The NodeTransformController Object
----------------------------------

A NodeTransformController allows the output from a set of controllers to be written to the transforms of a hierarchy
of nodes in a scene. This allows for a the animation of a set of objects rigidly bound to a hierarchy of nodes.

.. highlight:: javascript

Constructor
===========

.. index::
    pair: NodeTransformController; create

`create`
--------

**Summary**

**Syntax** ::

    var controller = NodeTransformController.create(hierarchy, scene);

Methods
=======

.. index::
    pair: NodeTransformController; addTime

`addTime`
---------

**Summary**

Adds the given delta time to the input controller which is being used by this NodeTransformController. If the input
controller has an update callback, looping callback or on finished callback then they may fire during the call.

**Syntax** ::

    controller.addTime(deltaTime);

.. index::
    pair: NodeTransformController; setInputController

`setInputController`
--------------------

**Summary**

Sets the input controller to be used to update the transforms in the scene nodes bound by this NodeTransformController.

**Syntax** ::

    controller.setInputController(input);

.. index::
    pair: NodeTransformController; setHierarchy

`setHierarchy`
--------------

**Summary**

Sets the NodeTransformController to update the scene nodes matching the hierarchy description provided. This function
will search the scene provided during Create or setScene for scene nodes matching the hierarchical layout described
in the hierarchy. Subsequent update calls will then update those scene nodes directly.

**Syntax** ::

    controller.setHierarchy(hierarchy);

or ::

    controller.setHierarchy(hierarchy, fromNode);

``hierarchy``
    The string name of the material to check.

``fromNode``
    Optional :ref:`SceneNode <scenenode>` to use as the root node of the animation instead of looking in the :ref:`Scene <scene>` for the root nodes.

.. index::
    pair: NodeTransformController; setScene

`setScene`
----------

**Summary**

Switches the scene which should be searched for scene nodes to be bound by the current hierarchical description. This
function will search the new scene provided for scene nodes matching the hierarchical layout described in the call to
Create or setHierarchy. Subsequent update calls will then update those scene nodes directly.

**Syntax** ::

    controller.setScene(scene);

.. index::
    pair: NodeTransformController; update

`update`
--------

**Summary**

Update the bound scene nodes with the current state of animation on the input controller. This method will evaluate the
input controller and update any bound scene nodes with animation transform matrices. Subsequent access and use of the
scene nodes will be based on these new transforms.

**Syntax** ::

    controller.update();

Properties
==========

.. index::
    pair: NodeTransformController; version

`version`
---------

**Summary**

The version number of the NodeTransformController implementation.

**Syntax** ::

    var versionNumber = nodeTransformController.version;

.. index::
    pair: Animation; SkinController

-------------------------
The SkinController Object
-------------------------

A SkinController evaluates a list of nodes from an input controller based on a skeletal hierarchy description
generating a set of matrices suitable for use in mesh skinning.

.. highlight:: javascript

Constructor
===========

.. index::
    pair: SkinController; create

`create`
--------

**Summary**

Create a new SkinController. An instance of the math device should be supplied which will be used during evaluation
of the skinning matrices. Before using the skin controller both an input controller and a skeleton should be set with
setInputController and setSkeleton respectively.

**Syntax** ::

    var skinController = SkinController.create(mathDevice);

Methods
=======

.. index::
    pair: SkinController; setInputController

`setInputController`
--------------------

**Summary**

Sets the controller which should be used as the source of input data for evaluation of the skinning matrices. This
will dirty the skin controller.

**Syntax** ::

    skinController.setInputController(inputController);

.. index::
    pair: SkinController; setSkeleton

`setSkeleton`
-------------

**Summary**

Sets the skeletal hierarchy description to be used when evaluating the skinning matrices. This tells the skin controller
how to interpret the output of the input controller so that it can generate LTMs for the joints in the hierarchy.
This will dirty the skin controller.

**Syntax** ::

    skinController.setSkeleton(skeleton);

.. index::
    pair: SkinController; update

`update`
--------

**Summary**

Updates the output of the skin controller with the current state of the joints suitable for mesh skinning. The update
will firstly evaluate the input controller and then convert it's output into a set of 4x3 local transform matrices
multiplied by the inverse skinning matrices in the skeleton.

**Syntax** ::

    skinController.update();

Properties
==========

.. index::
    pair: SkinController; output

`output`
--------

**Summary**

The output buffer used by this instance of the SkinController. This output is an array of 4x3 matrices suitable
for use in mesh skinning. The output will the valid for the current animation state after a call to update.

**Syntax** ::

    var skinningMatrices = skinController.output;

.. index::
    pair: SkinController; version

`version`
---------

**Summary**

The version number of the SkinController implementation.

**Syntax** ::

    var versionNumber = skinController.version;

.. _gpuskincontroller:

.. index::
    pair: Animation; GPUSkinController

----------------------------
The GPUSkinController Object
----------------------------

A GPUSkinController operates in exactly the same way as a SkinController, however it allocates an output array
as a TechniqueParameterBuffer.

.. highlight:: javascript

Constructor
===========

.. index::
    pair: GPUSkinController; create

`create`
--------

**Summary**

Create a new GPUSkinController. An instance of the GraphicsDevice must be supplied to allow the controller to allocate
graphics buffers for output of the skinning matrices. An instance of the MathDevice should be supplied which will be
used during evaluation of the skinning matrices. Before using the skin controller both an input controller and a
skeleton should be set with setInputController and setSkeleton respectively.

For WebGL the internal :ref:`TechniqueParameterBuffer <techniqueparameterbuffer>` must match the size of the skin matrices array in the shader, even if the number of values used is lower.
The size can be passed in to the Create. If this is not specified then the value set by GPUSkinController.setDefaultBufferSize() is used if specified
otherwise the number of bones is used to calculate the size.


**Syntax** ::

    var skinController = GPUSkinController.create(graphicsDevice, mathDevice, bufferSize);


Class Functions
===============

.. _gpuskincontroller_setdefaultbuffersize:

.. index::
    pair: GPUSkinController; setDefaultBufferSize

`setDefaultBufferSize`
----------------------
The default size of the :ref:`TechniqueParameterBuffer <techniqueparameterbuffer>` to use. This can be used if all skinning shaders use the same number of values.

    For example: ::

        GPUSkinController.setDefaultBufferSize(renderer.getDefaultSkinBufferSize());


Methods
=======

.. index::
    pair: GPUSkinController; setInputController

`setInputController`
--------------------

**Summary**

Sets the controller which should be used as the source of input data for evaluation of the skinning matrices. This
will dirty the skin controller.

**Syntax** ::

    skinController.setInputController(inputController);

.. index::
    pair: GPUSkinController; setSkeleton

`setSkeleton`
-------------

**Summary**

Sets the skeletal hierarchy description to be used when evaluating the skinning matrices. This tells the skin controller
how to interpret the output of the input controller so that it can generate LTMs for the joints in the hierarchy.
This will dirty the skin controller and also reallocate any graphics buffers needed for skinning matrices if the number
of bones in the skeleton has changed.

**Syntax** ::

    skinController.setSkeleton(skeleton);


.. index::
    pair: GPUSkinController; update

`update`
--------

**Summary**

Updates the output of the skin controller with the current state of the joints suitable for mesh skinning. The update
will firstly evaluate the input controller and then convert it's output into a set of 4x3 local transform matrices
multiplied by the inverse skinning matrices in the skeleton. The output is written to the shaderParameterBuffer stored
in the output property.

**Syntax** ::

    skinController.update();

Properties
==========

.. index::
    pair: GPUSkinController; output

`output`
--------

**Summary**

The output buffer used by this instance of the GPUSkinController. This output is a technique parameter buffer suitable
for use in GPU mesh skinning. The output will the valid for the current animation state after a call to update.

**Syntax** ::

    var skinningMatrices = skinController.output;

.. index::
    pair: GPUSkinController; version

`version`
---------

**Summary**

The version number of the GPUSkinController implementation.

**Syntax** ::

    var versionNumber = skinController.version;


.. index::
    pair: Animation; SkinnedNode

----------------------
The SkinnedNode Object
----------------------

The SkinnedNode object is provided to allow a skin controller and the output from an InterpolatorController to be
joined with additional useful api. When only performing skinning a skin controller and InterpolatorController can
be joined without a SkinnedNode, but the SkinnedNode can be used to allow querying of state such as world space
transforms of joints, useful for binding objects and characters together.

.. highlight:: javascript

Constructor
===========

.. index::
    pair: SkinnedNode; create

`create`
--------

**Summary**

    Creates a skinned node suitable for performing skinning on a mesh around the given skeleton hierarchy. An optional
    input controller can be passed in or set later with setInputContoller(). A skin controller will be created, and
    where a GraphicsDevice is passed in the skin controller will be a GPU skinning targeted GPUSkinController initialized
    with the optional techniqueParameterBufferSize argument.

**Syntax** ::

    var skinnedNode = SkinnedNode.create(graphicsDevice, mathDevice, node, skeleton, techniqueParameterBufferSize);

Methods
=======

.. index::
    pair: SkinnedNode; addTime

`addTime`
---------

**Summary**

    Adds time to the controllers which are used as an input to the skin controller on the skinned node. The
    controllers will call any appropriate on finished, on loop or update callbacks.

**Syntax** ::

    skinnedNode.addTime(delta);

.. index::
    pair: SkinnedNode; update

`update`
--------

**Summary**

    Updates the skinned node optionally performing a full evaluation of the skin controller and all dependent
    controllers. After performing the update all scene nodes in the hierarchy attached to the skinned node will
    have been updated with the extents calculated from the animation. If updateSkinController is set to true then
    the output arrays of the skin controller will also have been evaluated, useful to control where in a game loop
    the cost of evaluation is made.

**Syntax** ::

    skinnedNode.update(updateSkinController);

.. index::
    pair: SkinnedNode; getJointIndex

`getJointIndex`
---------------

**Summary**

    Returns the index of a joint for use in setting up and querying controllers. The joint name is looked up in the
    skeleton description used by the skinned node. If the joint requested is not found -1 will be returned.

**Syntax** ::

    var jointIndex = skinnedNode.getJointIndex(jointName);

.. index::
    pair: SkinnedNode; getJointLTM

`getJointLTM`
-------------

**Summary**

    Returns the local transform of the joint stored at the given index, the index can be found with getJointIndex. The
    transform is relative to the root of the skinned node hierarchy and can be used for things like attachment of
    objects to attach points on skinned hierarchies.
    The optional second parameter specifies a 4x3 matrix to write the local transform to.

**Syntax** ::

    var jointMatrix = skinnedNode.getJointLTM(jointIndex, destinationMatrix);

.. index::
    pair: SkinnedNode; setInputController

`setInputController`
--------------------

**Summary**

Sets the input controller to be used to update the skinned meshes referenced by the skinned node.

**Syntax** ::

    skinnedNode.setInputController(input);

.. index::
    pair: SkinnedNode; getSkeleton

`getSkeleton`
-------------

**Summary**

Returns the skeleton representation used by the skinned node.

**Syntax** ::

    var skeleton = skinnedNode.getSkeleton();

Properties
==========

.. index::
    pair: SkinnedNode; version

`version`
---------

**Summary**

The version number of the SkinnedNode implementation.

**Syntax** ::

    var versionNumber = skinnedNode.version;
