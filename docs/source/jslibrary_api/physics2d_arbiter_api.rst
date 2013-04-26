.. index::
    single: Arbiter

.. highlight:: javascript

.. _physics2d_arbiter:

==================
The Arbiter Object
==================

Arbiter objects group contact, and other related data between pairs of interacting :ref:`Shape <physics2d_shape>` objects.

These objects are created only by the internals of Physics2D and are recycled, so no references should be kept to them.

Methods
=======

.. index::
    pair: Arbiter; getNormal

`getNormal`
-----------

**Summary**

Query the contact normal for this interaction pair. The normal will always point from `shapeA` to `shapeB`.

This function will return `[0, 0]` when `sensor` is true.

**Syntax** ::

    var normal = arbiter.getNormal();
    // or
    arbiter.getNormal(normal);

``normal`` (Optional)
    If specified, the normal will be stored into this array. Otherwise a new array will be created to be returned.

.. index::
    pair: Arbiter; getRollingImpulse

`getRollingImpulse`
-------------------

**Summary**

Query the rolling impulse that was applied for this Arbiter in the previous simulation step.

This value is non-zero only for interactions that involve a :ref:`Circle <physics2d_circle>` shape.

This value is zero when `sensor` is true.

**Syntax** ::

    var impulse = arbiter.getRollingImpulse();


`getImpulseForBody`
-------------------

**Summary**

Query the impulse applied to the given :ref:`RigidBody <physics2d_body>` by the interaction represented by this arbiter object in the previous simulation step.

The impulse returned is of 3 dimensions, the third equal to the angular impulse the interaction was responsible for.

**Syntax** ::

    var impulse = arbiter.getImpulseForBody(body);
    // or
    arbiter.getImpulseForBody(body, impulse);

``impulse`` (Optional)
    If specified, the impulse will be stored in this array, otherwise a new array will be created to be returned.

Should the input body be unrelated to this arbiter, the impulse returned will be `[0, 0, 0]`

.. index::
    pair: Arbiter; getElasticity

`getElasticity`
---------------

**Summary**

Query the combined value of elasticity present for this pair of interacting shapes.

This is computed from the shapes by taking the average of material elasticities, and clamping to the range `[0, 1]` and may change over time should shape materials be changed.

This function returns `undefined` when `sensor` is true.

**Syntax** ::

    var elasticity = arbiter.getElasticity();

.. index::
    pair: Arbiter; getStaticFriction

`getStaticFriction`
-------------------

**Summary**

Query the combined value of static friction present for this pair of interacting shapes.

This is computed from the shapes by taking the square root of the material's static friction's product and may change over time should shape materials be changed.

This function returns `undefined` when `sensor` is true.

**Syntax** ::

    var staticFriction = arbiter.getStaticFriction();

.. index::
    pair: Arbiter; getDynamicFriction

`getDynamicFriction`
--------------------

**Summary**

Query the combined value of dynamic friction present for this pair of interacting shapes.

This is computed from the shapes by taking the square root of the material's dynamic friction's product and may change over time should shape materials be changed.

This function returns `undefined` when `sensor` is true.

**Syntax** ::

    var dynamicFriction = arbiter.getDynamicFriction();

.. index::
    pair: Arbiter; getRollingFriction

`getRollingFriction`
--------------------

**Summary**

Query the combined value of rolling friction present for this pair of interacting shapes.

This is computed from the shapes by taking the square root of the material's rolling friction's product and may change over time should shape materials be changed.

This function returns `undefined` when `sensor` is true.

**Syntax** ::

    var rollingFriction = arbiter.getRollingFriction();

.. index::
    pair: Arbiter; setElasticity

`setElasticity`
---------------

**Summary**

Set the combined value of elasticity for this Arbiter.

This function may be called at any time outside of simulation step, but likely needs to be called from a relative `preSolve` event listener (which is the only time it may be called during a simulation step) so as to immediately override default computed values before physics is performed.

This function has no effect when `sensor` is true.

**Syntax** ::

    arbiter.setElasticity(elasticity);

``elasticity``
    New combined value of elasticity. This value should be given in the range `[0, 1]` and will remain fixed until this function, or `setElasticityFromShapes` functions are called even if shape materials are changed.

.. index::
    pair: Arbiter; setElasticityFromShapes

`setElasticityFromShapes`
-------------------------

**Summary**

Set the combined value of elasticity for this Arbiter to be computed from its related :ref:`Shape <physics2d_shape>` objects.

This may be called at any time outside of simulation step, and during a simulation step may be called only from a related `preSolve` event listener.

This function has no effect when `sensor` is true.

**Syntax** ::

    arbiter.setElasticityFromShapes();

.. index::
    pair: Arbiter; setStaticFriction

`setStaticFriction`
--------------------

**Summary**

Set the combined value of static friction for this Arbiter.

This function may be called at any time outside of simulation step, but likely needs to be called from a relative `preSolve` event listener (which is the only time it may be called during a simulation step) so as to immediately override default computed values before physics is performed.

This function has no effect when `sensor` is true.

**Syntax** ::

    arbiter.setStaticFriction(staticFriction);

``staticFriction``
    New combined value of static friction. This value should be given in the range `[0, 1]` and will remain fixed until this function, or `setStaticFrictionFromShapes` functions are called even if shape materials are changed.

.. index::
    pair: Arbiter; setStaticFrictionFromShapes

`setStaticFrictionFromShapes`
------------------------------

**Summary**

Set the combined value of static friction for this Arbiter to be computed from its related :ref:`Shape <physics2d_shape>` objects.

This may be called at any time outside of simulation step, and during a simulation step may be called only from a related `preSolve` event listener.

This function has no effect when `sensor` is true.

**Syntax** ::

    arbiter.setStaticFrictionFromShapes();

.. index::
    pair: Arbiter; setDynamicFriction

`setDynamicFriction`
--------------------

**Summary**

Set the combined value of dynamic friction for this Arbiter.

This function may be called at any time outside of simulation step, but likely needs to be called from a relative `preSolve` event listener (which is the only time it may be called during a simulation step) so as to immediately override default computed values before physics is performed.

This function has no effect when `sensor` is true.

**Syntax** ::

    arbiter.setDynamicFriction(dynamicFriction);

``dynamicFriction``
    New combined value of dynamic friction. This value should be given in the range `[0, 1]` and will remain fixed until this function, or `setDynamicFrictionFromShapes` functions are called even if shape materials are changed.

.. index::
    pair: Arbiter; setDynamicFrictionFromShapes

`setDynamicFrictionFromShapes`
------------------------------

**Summary**

Set the combined value of dynamic friction for this Arbiter to be computed from its related :ref:`Shape <physics2d_shape>` objects.

This may be called at any time outside of simulation step, and during a simulation step may be called only from a related `preSolve` event listener.

This function has no effect when `sensor` is true.

**Syntax** ::

    arbiter.setDynamicFrictionFromShapes();

.. index::
    pair: Arbiter; setRollingFriction

`setRollingFriction`
--------------------

**Summary**

Set the combined value of rolling friction for this Arbiter.

This function may be called at any time outside of simulation step, but likely needs to be called from a relative `preSolve` event listener (which is the only time it may be called during a simulation step) so as to immediately override default computed values before physics is performed.

This function has no effect when `sensor` is true.

**Syntax** ::

    arbiter.setRollingFriction(rollingFriction);

``rollingFriction``
    New combined value of rolling friction. This value should be given in the range `[0, 1]` and will remain fixed until this function, or `setRollingFrictionFromShapes` functions are called even if shape materials are changed.

.. index::
    pair: Arbiter; setRollingFrictionFromShapes

`setRollingFrictionFromShapes`
------------------------------

**Summary**

Set the combined value of rolling friction for this Arbiter to be computed from its related :ref:`Shape <physics2d_shape>` objects.

This may be called at any time outside of simulation step, and during a simulation step may be called only from a related `preSolve` event listener.

This function has no effect when `sensor` is true.

**Syntax** ::

    arbiter.setRollingFrictionFromShapes();

Properties
==========

.. index::
    pair: Arbiter; shapeA

`shapeA`
--------

**Summary**

The first :ref:`Shape <physics2d_shape>` for this Arbiter. Arbiter normals and impulses are always defined relative to this shape.

.. note:: Read Only

.. index::
    pair: Arbiter; shapeB

`shapeB`
--------

**Summary**

The second :ref:`Shape <physics2d_shape>` for this Arbiter.

.. note:: Read Only

.. index::
    pair: Arbiter; bodyA

`bodyA`
--------

**Summary**

The first :ref:`RigidBody <physics2d_body>` for this Arbiter. It will always be the case that `shapeA.body === bodyA`.

.. note:: Read Only

.. index::
    pair: Arbiter; bodyB

`shapeB`
--------

**Summary**

The second :ref:`RigidBody <physics2d_body>` for this Arbiter. It will always be the case that `shapeB.body === bodyB`.

.. note:: Read Only

.. index::
    pair: Arbiter; sensor

`sensor`
----------

**Summary**

Whether this arbiter object corresponds to a sensor type interaction. In such an interaction type there is no collision information computed, only intersection test.

.. note:: Read Only

.. index::
    pair: Arbiter; sleeping

`sleeping`
----------

**Summary**

Whether this arbiter object corresponds to an interaction between two sleeping objects.

.. note:: Read Only

.. index::
    pair: Arbiter; active

`active`
--------

**Summary**

This property indicates that the arbiter object is actively taking part in a simulation, when iterating lists of arbiter objects you should ignore any such inactive arbiter.

An arbiter is inactive either because it has persisted once an interaction has ended in order to cache information that may shortly be recovered, or because the arbiter is waiting to be destroyed.

.. note:: Read Only

.. index::
    pair: Arbiter; contacts

`contacts`
----------

**Summary**

The list of :ref:`Contact <physics2d_contact>` points associated with this interaction, this list will contain at most 2 contact points of which there may only be 1 that is active.

When `sensor` is true, this list will always be empty.

.. note:: Read Only

.. index::
    single: Contact

.. _physics2d_contact:

==================
The Contact Object
==================

The Contact object stores physics information for contact points of a collision interaction.

These objects are created only by the internals of Physics2D and are recycled, so no references should be kept to them.

Methods
=======

.. index::
    pair: Contact; getPosition

`getPosition`
-------------

**Summary**

Get contact position in world coordinates.

**Syntax** ::

    var position = contact.getPosition();
    // or
    contact.getPosition(position);

``position`` (Optional)
    If specified, the contact position will be stored in this array, otherwise a new array will be created.

    The result of this operation will not effect the contact position which is immutable.

.. index::
    pair: Contact; getPenetration

`getPenetration`
----------------

**Summary**

Get contact penetration, indicating how much the shapes are overlapping at this contact point along the related :ref:`Arbiter <physics2d_arbiter>` normal.

**Syntax** ::

    var penetration = contact.getPenetration();

Contact penetration may be negative (indicating separation) as in the edge-edge case for Polygons, 2 contact points are always computed, though only one may have been used for solving errors in velocity.

.. index::
    pair: Contact; getNormalImpulse

`getNormalImpulse`
------------------

**Summary**

Query the signed magnitude of the normal impulse that was applied at this contact point during the simulation step.

**Syntax** ::

    var normalImpulse = contact.getNormalImpulse();

`getTangentImpulse`
-------------------

**Summary**

Query the signed magnitude of the tangent (friction) impulse that was applied at this contact point during the simulation step.

**Syntax** ::

    var tangentImpulse = contact.getTangentImpulse();


Properties
==========

.. index::
    pair: Contact; active

`active`
--------

**Summary**

Indicates that this contact corresponds to active collision data.

When iterating contacts you should ignore any contact which is not active as it will refer to information from previous simulation steps which is persisting for purposes of caching values for possible re-use in near future.

.. note:: Read Only

.. index::
    pair: Contact; virtual

`virtual`
---------

**Summary**

This property indicates that the contact point was generated, but was not used during resolution of velocity errors in physics. This contact point may or may not have been used during resolution of positional errors.

A `virtual` contact will always have `0` normal and tangent impulse values.

.. note:: Read Only

.. index::
    pair: Contact; fresh

`fresh`
-------

**Summary**

This property indicates that this contact point was used for the first time in the resolution of velocity errors. This property may be used to cull contact points when determining `impact` impulses in collisions so as to ignore resting contacts.

.. note:: Read Only


