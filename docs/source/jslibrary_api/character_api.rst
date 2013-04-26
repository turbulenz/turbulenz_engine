.. index::
    single: Character

.. highlight:: javascript

.. _character:

--------------------
The Character Object
--------------------

A Character object represents a rigid body with added features that simplify the creation of `character` entities.
The volume of the character will be represented by either two spheres seating one on top of each other or a capsule (:ref:`Canvas vs Plugin <physicsdevice_canvas_vs_plugin>`),
changing their relative vertical location according to the `crouch` or `dead` states.
Due to the vertical symmetry of the two spheres the character object lacks orientation.

Constructor
===========

A Character object can be constructed with :ref:`PhysicsDevice.createCharacter <physicsdevice_createcharacter>`.

Methods
=======

.. index::
    pair: Character; calculateTransform

`calculateTransform`
--------------------

**Summary**

Calculates the world matrix of the character.

**Syntax** ::

    var transform = mathDevice.m43BuildIdentity();
    var n, character, node;
    for (n = 0; n < numNodes; n += 1)
    {
        character = characters[n];
        node = nodes[n];

        character.calculateTransform(transform, node.origin);

        drawNode(node, transform);
    }

The `transform` parameter should be a :ref:`Matrix43 <m43object>` object and
it will be set to the world matrix of the character.

The optional `origin` parameter can be used to offset the world matrix.


.. index::
    pair: Character; calculateExtents

`calculateExtents`
------------------

**Summary**

Calculates the world extents of the character.

**Syntax** ::

    var extents = [];
    character.calculateExtents(extents);

``extents``
    The world :ref:`extents <extents>` of the character.


.. index::
    pair: Character; jump

`jump`
------

**Summary**

Makes the character jump in the direction of the velocity vector.

This method has no effect if character is not a Physics world.

**Syntax** ::

    character.jump();


Properties
==========

.. index::
    pair: Character; velocity

`velocity`
----------

**Summary**

The :ref:`Vector3 <v3object>` object representing the linear velocity of the character.

**Syntax** ::

    // Get the current velocity
    var velocity = character.velocity;

    // Double it
    character.velocity = mathDevice.v3Add(velocity, velocity);


.. index::
    pair: Character; position

`position`
----------

**Summary**

The :ref:`Vector3 <v3object>` object representing the current location of the character.

**Syntax** ::

    // Get the current position
    var position = character.position;

    // Move it to the origin
    character.position = mathDevice.v3Build(0, 0, 0);


.. index::
    pair: Character; onGround

`onGround`
----------

**Summary**

True if the character is on the ground, false otherwise.
Querying this property triggers a convex sweep test from the current position of the character downwards
in order to check for any collisions with non-vertical surfaces.

**Syntax** ::

    if (character.onGround)
    {
        character.jump();
    }

.. note:: Read Only


.. index::
    pair: Character; crouch

`crouch`
--------

**Summary**

True if the character is on a `crouch` state.

Setting this property to true will trigger a transition to the `crouch` state
which halves the height of the character, unless the character is on a `dead` state.
Setting this property to false will make the character stand up.

**Syntax** ::

    if (!character.crouch)
    {
        character.crouch = true;
    }


.. index::
    pair: Character; dead

`dead`
------

**Summary**

True if the character is on a `dead` state.

Setting this property to true will trigger a transition to the `dead` state
which sets the height of the character to its radius.
Setting this property to false will make the character stand up.

**Syntax** ::

    if (!character.dead)
    {
        character.dead = true;
    }


.. index::
    pair: Character; maxJumpHeight

`maxJumpHeight`
---------------

**Summary**

The maximum height the character will jump upwards.

**Syntax** ::

    character.maxJumpHeight = 10.0;


.. index::
    pair: Character; userData

`userData`
----------

**Summary**

The user object associated with the character.

**Syntax** ::

    // Get current user object
    var sceneOwner = character.userData;

    // Set a new one
    character.userData = enemyEntity;
