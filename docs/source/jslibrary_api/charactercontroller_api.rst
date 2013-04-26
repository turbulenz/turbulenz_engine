.. index::
    single: CharacterController

.. highlight:: javascript

------------------------------
The CharacterController Object
------------------------------

Implements a physics based FPS like character with keyboard, mouse and joypad input.

The physics based model of the character is created using a character shape supplied by the physics device with a
height provided at construction time. The character also supports a crouching property which reduces the height
of the character shape to a given crouch height.
The CharacterController also supports a 'god' mode which is treated as a fly camera for development purposes.

.. note:: The character shape is implemented via a multisphere shape see the :ref:`Character Object <character>`.

**Required scripts**

The CharacterController object requires::

    /*{{ javascript("jslib/charactercontroller.js") }}*/

It also requires that a :ref:`MathDevice <tz_createmathdevice>` has been created before calling the CharacterController constructor.


Constructor
===========

.. index::
    pair: CharacterController; create

`create`
--------

**Summary**

    Creates the a character shape physics representation given a set of predefined parameters such as height and
    crouching height.

**Syntax** ::

    var parameters = {
            radius: 30,
            halfHeight: 64,
            crouchHalfHeight: 45,
            rotateSpeed: 2,
            mouseRotateFactor: 2,
            collisionMargin: 1,
            maxSpeed: 120,
            maxStepHeight: 5,
            maxJumpHeight: 30
        };
    var characterController = CharacterController.create(graphicsDevice, inputDevice, physicsDevice, matrix, parameters);

``matrix``
    A :ref:`m43 matrix <m43object>` representing the position and orientation of the character.

The shape representing the character for the PhysicsDevice is a capsule with radius ``radius``.
The character controller is initialized in the scene using given transformation matrix.
The character controller also registers hooks with the InputDevice supporting input from the keyboard, mouse
and gamepads.
The rotateSpeed, mouseRotateFactor, maxSpeed and maxJumpHeight control the limits of how the input
devices will affect the character.
The maxStepHeight represents the largest increase in height the character will treat as a climbable step, i.e.
the maximum height which doesn't require jumping to traverse.


Method
======

.. index::
    pair: CharacterController; update

`update`
--------

**Summary**

    Applies any input device data captured since the last call to update to the physics based character.
    Update also applies any velocity limits and determines whether the character is jumping or crouching and
    also whether the character should currently be treated as on the ground or not.
    At the end of all physics and input based calculations update will also recalculate the extents of the character
    useful for checking interaction with things like trigger volumes.

**Syntax** ::

    characterController.update(deltaTime);

.. index::
    pair: CharacterController; setPosition

`setPosition`
-------------

**Summary**

    Allows the character controller to be repositioned in the scene. This method takes into account states like
    crouching to correctly set the character controller matrix and position of the physics representation of the
    character.

**Syntax** ::

    characterController.setPosition(position);

``position``
    A :ref:`3D Vector <vmath_objects>` representing the new position of the character.

.. index::
    pair: CharacterController; setDead

`setDead`
---------

**Summary**

    Allows the character to be treated as dead or alive. When dead a characters height will be reduced to twice the
    characters radius, and the character will no longer be moved via any of the input device hooks. The boolean sets
    whether to make the character dead or not.

**Syntax** ::

    characterController.setDead(true);


Properties
==========

.. index::
    pair: CharacterController; version

`version`
---------

**Summary**

The version number of the CharacterController implementation.

**Syntax** ::

    var versionNumber = characterController.version;


.. index::
    pair: CharacterController; god

`god`
-----

**Summary**

Whether the CharacterController is currently in 'god' mode.

**Syntax** ::

    if (characterController.god)
    {
        // Remove from AI target lists
    }

.. index::
    pair: CharacterController; jumped

`jumped`
--------

**Summary**

Whether the CharacterController processed a jump request in the last update. This is useful to be able to detect when
a player jumps to play a oneshot sound as the player initiates a jump or process other jump related events.

**Syntax** ::

    if (characterController.jumped)
    {
        PlaySound(jumpSoundEffect);
    }

.. index::
    pair: CharacterController; crouch

`crouch`
--------

**Summary**

Whether the CharacterController is currently in crouch mode.

**Syntax** ::

    var aimingStability = 0.5;
    if (characterController.crouch)
    {
        aimingStability *= 2;
    }

.. index::
    pair: CharacterController; walkDirection

`walkDirection`
---------------

**Summary**

What direction is the character currently walking in, i.e. character orientation. Could be used to determine if the
character is moving in the direction of the goal.

**Syntax** ::

    var characterDirection = characterController.walkDirection;
    if (mathDevice.v3Dot(characterDirection, directionToGoal) < 0)
    {
        SendPlayerMessage("Heading in wrong direction");
    }
