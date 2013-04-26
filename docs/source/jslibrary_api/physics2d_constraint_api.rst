.. index::
    single: Constraint

.. highlight:: javascript

.. _physics2d_constraint:
.. _physics2d_point:
.. _physics2d_weld:
.. _physics2d_distance:
.. _physics2d_line:
.. _physics2d_pulley:
.. _physics2d_angle:
.. _physics2d_motor:
.. _physics2d_custom:

=====================
The Constraint Object
=====================

Constructor
===========

A Constraint object can be constructed with one of:

* :ref:`Physics2DDevice.createPointConstraint <physics2ddevice_createpoint>`
* :ref:`Physics2DDevice.createDistanceConstraint <physics2ddevice_createdistance>`
* :ref:`Physics2DDevice.createAngleConstraint <physics2ddevice_createangle>`
* :ref:`Physics2DDevice.createWeldConstraint <physics2ddevice_createweld>`
* :ref:`Physics2DDevice.createPulleyConstraint <physics2ddevice_createpulley>`
* :ref:`Physics2DDevice.createMotorConstraint <physics2ddevice_createmotor>`
* :ref:`Physics2DDevice.createLineConstraint <physics2ddevice_createline>`
* :ref:`Physics2DDevice.createCustomConstraint <physics2ddevice_createcustom>`

Constructors for constraints take many common parameters which are listed below ::

     {
        stiff : true,
        frequency : 10,
        damping : 1,
        maxForce : Number.POSITIVE_INFINITY,
        maxError : Number.POSITIVE_INFINITY,
        removeOnBreak : true,
        breakUnderForce : false,
        breakUnderError : false,
        ignoreInteractions : false,
        sleeping : false,
        disabled : false,
        userData : null
     }

``stiff`` (Optional)
    Defines whether a positional constraint has its positional errors solved rigidly together with contact errors, or whether positional errors are resolved through mutations of the velocity constraint making the constraint elastic.

    An elastic constraint is implemented in such a way that high frequency and damping will not cause the constraint to `blow up`.

    This parameter has no effect on `velocity-only` constraints such as the `MotorConstraint`.

    Default value is `true`.

``frequency`` (Optional)
    Defines the frequency of the constraint's elastic behavior when positional constraint is non-stiff.

    This value must be strictly positive.

    This parameter has no effect on `velocity-only` constraints such as the `MotorConstraint`, or when a position constraint is `stiff`.

    Default value is `10`.

``damping`` (Optional)
    Defines the damping of the constraint's elastic behavior when positional constraint is non-stiff.

    This value must be positive.

    This parameter has no effect on `velocity-only` constraints such as the `MotorConstraint`, or when a position constraint is `stiff`.

    Default value is `1`.

``maxForce`` (Optional)
    Defines for `non-stiff` positional constraints, and for `velocity-only` constraints the maximum amount of force that may be used
    when solving errors in velocity.

    This value must be positive.

    When such a constraint has also `breakUnderForce` set to `true`. This value defines the limit at which the constraint will be broken.

    Default value is `Number.POSITIVE_INFINITY`.

``maxError`` (Optional)
    Defines for `positional` constraints, the maximum amount of error which will either be solved (For `non-stiff` constraints) per second, or the limit at which the constraint will be broken if `breakUnderError` is also `true`.

    This parameter has no effect on `velocity-only` constraints such as the `MotorConstraint`.

    This value must be positive.

    Default value is `Number.POSITIVE_INFINITY`.

``removeOnBreak`` (Optional)
    Defines behavior for when this constraint is broken.

    When true, the constraint will be removed from the simulation :ref:`World <physics2d_world>` when broken.

    When false, the constraint will remain in the world, but will become disabled.

    Default value is `true`.

``breakUnderForce`` (Optional)
    For `non-stiff` positional constraints, and `velocity-only` constraints this parameter defines whether upon reaching the `maxForce` parameter, the constraint will either limit the amount of force it uses, or be broken.

    Default value is `false`.

``breakUnderError`` (Optional)
    For `positional` constraints, this parameter defines whether upon reaching the `maxError` parameter, the amount of error resolved will be clamped (For `non-stiff` constraints, otherwise ignored) or broken (Both `stiff` and `non-stiff` constraints).

    Default value is `false`.

``ignoreInteractions`` (Optional)
    Defines whether the participating :ref:`RigidBody <physics2d_body>` objects used by this constraint will be permitted to interact (Whether as sensors, or colliders).

   Default value is `false`.

``sleeping`` (Optional)
    Define if the constraint is to be created in a sleeping state. When added to a :ref:`World <physics2d_world>` object, the constraint will remain asleep until woken.

    Default value is `false`.

``disabled`` (Optional).
    Define whether the constraint will be created as already `disabled`.

    Disabling a constraint permits it to remain inside of a :ref:`World <physics2d_world>`, but acting as though it is not, with no side effects beyond the constraint being present in the :ref:`RigidBody <physics2d_body>` object's `constraints` list, and being removed when a related :ref:`RigidBody <physics2d_body>` is removed from the world.

    Default value is `false`.

``userData`` (Optional).
    A field in which to store whatever data you may like.

    Default value is `null`.

Methods
=======

.. index::
    pair: Constraint; configure

`configure`
-----------

**Summary**

Configure common constraint parameters.

**Syntax** ::

    constraint.configure({
        stiff : true,
        frequency : 10,
        damping : 1,
        maxForce : Number.POSITIVE_INFINITY,
        maxError : Number.POSITIVE_INFINITY,
        removeOnBreak : true,
        breakUnderForce : false,
        breakUnderError : false,
        ignoreInteractions : false
    });

All parameters of the object are optional, and leaving unspecified will leave said parameter untouched.

.. index::
    pair: Constraint; wake

`wake`
------

**Summary**

Manually wake this Constraint.

Waking a constraint manually is not generally required. It is only ever required to manually wake a constraint, if you manually put it to sleep or added it as a sleeping constraint.

Mutations to the constraint, and interactions with related rigid bodies in the world will otherwise automatically wake the constraint.

**Syntax** ::

    constraint.wake();

.. index::
    pair: Constraint; sleep

`sleep`
-------

**Summary**

Manually put this Constraint to sleep.

This constraint will be woken as soon as it is interacted with in a World, or is mutated in any way that would require it to wake up in normal circumstances.

**Syntax** ::

    constraint.sleep();

.. index::
    pair: Constraint; isEnabled

`isEnabled`
-----------

**Summary**

Query whether this constraint is currently enabled.

**Syntax** ::

    var enabled = constraint.isEnabled();

.. index::
    pair: Constraint; isDisabled

`isDisabled`
------------

**Summary**

Query whether this constraint is currently disabled.

**Syntax** ::

    var disabled = constraint.isDisabled();

.. index::
    pair: Constraint; enabled

`enable`
--------

**Summary**

Enable this constraint.

**Syntax** ::

    constraint.enable();

.. index::
    pair: Constraint; disable

`disable`
---------

**Summary**

Disable this constraint.

**Syntax** ::

    constraint.disable();

.. index::
    pair: Constraint; addEventListener

`addEventListener`
------------------

**Summary**

Add a new event listener for this Constraint.

**Syntax** ::

    var success = constraint.addEventListener(eventType, handler);

``eventType``
    One of:

    `'wake'`
        Issued when this constraint is woken. This event is not generated when using the wake() method manually.

    `'sleep'`
        Issued when this constraint is put to sleep. This event is not generated when using the sleep() method manually.

    `'break'`
        Issued when this constraint is broken.

``handler``
    Function to be called when this event occurs (Noting that events as usual are deferred until the end of the world `step()`).

    Function is called with no arguments, and with its `this` object as the :ref:`Constraint <physics2d_constraint>` to which the event relates.

This function will fail, and return `false` if the event type was not accepted, or if the handler already exists for the given event type.

Example: ::

    function breakHandler() {
        console.log("Constraint named: " + this.userData.name + "was broken :(");
    }

    constraint.userData = {
        name : "Constraint no. 1"
    };
    constraint.addEventListener('break', breakHandler);

You may add as many handlers for a given event type as you wish, and handlers will be called in the same order in which they were added.

.. index::
    pair: Constraint; removeEventListener

`removeEventListener`
---------------------

**Summary**

Remove existing event listener from this Constraint.

**Syntax** ::

    var success = constraint.removeEventListener(eventType, handler);

This function will fail, and return `false` if the event type was not accepted, or if the handler was not found on the constraint for the given event type.


`getImpulseForBody`
-------------------

**Summary**

Query the impulse applied to the given :ref:`RigidBody <physics2d_body>` by this constraint in the previous simulation step.

The impulse returned is of 3 dimensions, the third equal to the angular impulse the constraint applied.

**Syntax** ::

    var impulse = constraint.getImpulseForBody(body);
    // or
    constraint.getImpulseForBody(body, impulse);

``impulse`` (Optional)
    If specified, the impulse will be stored in this array, otherwise a new array will be created to be returned.


Should the input body be unrelated to this constraint, the impulse returned will be `[0, 0, 0]`



.. index::
    pair: Constraint; getAnchorA

`getAnchorA`
------------

**Summary**

Get local anchor point on first rigid body.

**Syntax** ::

    var anchor = constraint.getAnchorA();
    // or
    constraint.getAnchorA(anchor);

``anchor`` (Optional)
    If specified, the anchor will be stored in this array, otherwise a new array will be created to be returned.

.. note:: Available for constraint types: Point, Distance, Pulley, Weld, Line only.

.. index::
    pair: Constraint; setAnchorA

`setAnchorA`
------------

**Summary**

Set the local anchor point on first rigid body.

**Syntax** ::

    constraint.setAnchorA(anchor);

``anchor``
    The new anchor point for first rigid body in constraint.

.. note:: Available for constraint types: Point, Distance, Pulley, Weld, Line only.


.. index::
    pair: Constraint; getAnchorB

`getAnchorB`
------------

**Summary**

Get local anchor point on second rigid body.

**Syntax** ::

    var anchor = constraint.getAnchorB();
    // or
    constraint.getAnchorB(anchor);

``anchor`` (Optional)
    If specified, the anchor will be stored in this array, otherwise a new array will be created to be returned.

.. note:: Available for constraint types: Point, Distance, Pulley, Weld, Line only.

.. index::
    pair: Constraint; setAnchorB

`setAnchorB`
------------

**Summary**

Set the local anchor point on second rigid body.

**Syntax** ::

    constraint.setAnchorB(anchor);

``anchor``
    The new anchor point for second rigid body in constraint.

.. note:: Available for constraint types: Point, Distance, Pulley, Weld, Line only.


.. index::
    pair: Constraint; getAnchorC

`getAnchorC`
------------

**Summary**

Get local anchor point on third rigid body.

**Syntax** ::

    var anchor = constraint.getAnchorC();
    // or
    constraint.getAnchorC(anchor);

``anchor`` (Optional)
    If specified, the anchor will be stored in this array, otherwise a new array will be created to be returned.

.. note:: Available for constraint type Pulley only.

.. index::
    pair: Constraint; setAnchorC

`setAnchorC`
------------

**Summary**

Set the local anchor point on third rigid body.

**Syntax** ::

    constraint.setAnchorC(anchor);

``anchor``
    The new anchor point for third rigid body in constraint.

.. note:: Available for constraint type Pulley only.


.. index::
    pair: Constraint; getAnchorD

`getAnchorD`
------------

**Summary**

Get local anchor point on fourth rigid body.

**Syntax** ::

    var anchor = constraint.getAnchorD();
    // or
    constraint.getAnchorD(anchor);

``anchor`` (Optional)
    If specified, the anchor will be stored in this array, otherwise a new array will be created to be returned.

.. note:: Available for constraint type Pulley only.

.. index::
    pair: Constraint; setAnchorD

`setAnchorD`
------------

**Summary**

Set the local anchor point on fourth rigid body.

**Syntax** ::

    constraint.setAnchorD(anchor);

``anchor``
    The new anchor point for fourth rigid body in constraint.

.. note:: Available for constraint type Pulley only.


.. index::
    pair: Constraint; getAxis

`getAxis`
------------

**Summary**

Get local axis point on first rigid body for line direction.

**Syntax** ::

    var axis = constraint.getAxis();
    // or
    constraint.getAxis(axis);

``axis`` (Optional)
    If specified, the axis will be stored in this array, otherwise a new array will be created to be returned.

.. note:: Available for constraint type Line only.

.. index::
    pair: Constraint; setAxis

`setAxis`
------------

**Summary**

Set local axis point on first rigid body for line direction.

**Syntax** ::

    constraint.setAxis(axis);

``axis``
    The new axis point for first rigid body in constraint.

.. note:: Available for constraint type Line only.



.. index::
    pair: Constraint; getLowerBound

`getLowerBound`
---------------

**Summary**

Query the lower bound for constraint.

**Syntax** ::

    var lowerBound = constraint.getLowerBound();

.. note:: Available for constraint types: Distance, Angle, Line, Pulley only.


.. index::
    pair: Constraint; setLowerBound

`setLowerBound`
---------------

**Summary**

Set the lower bound on constraint.

**Syntax** ::

    constraint.setLowerBound(lowerBound);

``lowerBound``
    The new lower bound for constraint. Restrictions may change depending on constraint type.

.. note:: Available for constraint types: Distance, Angle, Line, Pulley only.

.. index::
    pair: Constraint; getUpperBound

`getUpperBound`
---------------

**Summary**

Query the upper bound for constraint.,

**Syntax** ::

    var upperBound = constraint.getUpperBound();

.. note:: Available for constraint types: Distance, Angle, Line, Pulley only.


.. index::
    pair: Constraint; setUpperBound

`setUpperBound`
---------------

**Summary**

Set the upper bound on constraint.

**Syntax** ::

    constraint.setUpperBound(upperBound);

``upperBound``
    The new upper bound for constraint. Restrictions may change depending on constraint type.

.. note:: Available for constraint types: Distance, Angle, Line, Pulley only.



.. index::
    pair: Constraint; getRatio

`getRatio`
----------

**Summary**

Query the current ratio parameter on constraint.

**Syntax** ::

    var ratio = constraint.getRatio();

.. note:: Available for constraint types: Angle, Motor, Pulley only.

.. index::
    pair: Constraint; getRatio

`setRatio`
----------

**Summary**

Set the ratio parameter on constraint.

**Syntax** ::

   constraint.setRatio(ratio);

``ratio``
    The new value for ratio parameter.

.. note:: Available for constraint types: Angle, Motor, Pulley only.

.. index::
    pair: Constraint; getRate

`getRate`
----------

**Summary**

Query the current motor rate parameter on constraint.

**Syntax** ::

    var rate = constraint.getRate();

.. note:: Available for constraint type Motor only.

.. index::
    pair: Constraint; getRate

`setRate`
----------

**Summary**

Set the motor rate parameter on constraint.

**Syntax** ::

   constraint.setRate(rate);

``rate``
    The new value for rate parameter.

.. note:: Available for constraint type Motor only.


.. index::
    pair: Constraint; getPhase

`getPhase`
----------

**Summary**

Query the current angular phase parameter on constraint.

**Syntax** ::

    var phase = constraint.getPhase();

.. note:: Available for constraint type Weld only.

.. index::
    pair: Constraint; getPhase

`setPhase`
----------

**Summary**

Set the angular phase parameter on constraint.

**Syntax** ::

   constraint.setPhase(phase);

``phase``
    The new value for phase parameter.

.. note:: Available for constraint type Weld only.


Properties
==========

.. index::
    pair: Constraint; type

`type`
------

A string identifying the type of this Constraint object, one of:

* `'POINT'`
* `'DISTANCE'`
* `'ANGLE'`
* `'WELD'`
* `'LINE'`
* `'PULLEY'`
* `'MOTOR'`
* `'CUSTOM'`

.. note:: Read Only

.. index::
    pair: Constraint; world

`world`
-------

**Summary**

The current :ref:`World <physics2d_world>` object that this constraint is assigned to.

.. note:: Read Only

.. index::
    pair: Constraint; sleeping

`sleeping`
----------

**Summary**

Whether this constraint object is currently sleeping in an ongoing simulation.

.. note:: Read Only

.. index::
    pair: Constraint; userData

`userData`
----------

**Summary**

Field to which you may assign whatever data you wish.


.. index::
    pair: Constraint; dimension

`dimension`
-----------

**Summary**

The dimension of this constraint.

.. note:: Read Only.


.. index::
    pair: Constraint; bodyA

`bodyA`
-------

**Summary**

The first :ref:`RigidBody <physics2d_body>` associated with this constraint.

.. note:: Read Only.
          Not defined for constraint type Custom.

.. index::
    pair: Constraint; bodyB

`bodyB`
-------

**Summary**

The second :ref:`RigidBody <physics2d_body>` associated with this constraint.

.. note:: Read Only.
          Not defined for constraint type Custom.

.. index::
    pair: Constraint; bodyC

`bodyC`
-------

**Summary**

The third :ref:`RigidBody <physics2d_body>` associated with this constraint.

.. note:: Read Only.
          Defined only for constraint type Pulley.

.. index::
    pair: Constraint; bodyD

`bodyD`
-------

**Summary**

The fourth :ref:`RigidBody <physics2d_body>` associated with this constraint.

.. note:: Read Only.
          Defined only for constraint type Pulley.

.. index::
    pair: Constraint; bodies

`bodies`
--------

**Summary**

Set of :ref:`RigidBody <physics2d_body>` objects associated with this `CustomConstraint`.

.. note:: Read Only.
          Defined only for constraint type Custom.
