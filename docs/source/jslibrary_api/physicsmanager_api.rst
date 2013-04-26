.. index::
    single: PhysicsManager

.. highlight:: javascript

.. _physicsmanager:

-------------------------
The PhysicsManager Object
-------------------------

Provides loading and managing of physics nodes.
Physics nodes are linked to target scene nodes which they update with the results of
physics simulation, DynamicsWorld.update(), by calling the PhysicsManager.update() method.
When the target SceneNode the physics object it bound to is destroyed the physics objects are destroyed too.
If the SceneNode is removed from the scene the developer is responsible for disabling the physics objects, if they wish to do so.
Rigid body nodes should not have a parent node.

**Required scripts**

The PhysicsManager object requires::

    /*{{ javascript("jslib/physicsmanager.js") }}*/
    /*{{ javascript("jslib/utilities.js") }}*/

As well as the :ref:`SceneNode's <scenenode_required_scripts>` required scripts.

Constructor
===========

.. index::
    pair: PhysicsManager; create

`create`
--------

**Summary**

**Syntax** ::

    var physicsManager = PhysicsManager.create(mathsDevice, physicsDevice, dynamicsWorld);


Methods
=======


.. index::
    pair: PhysicsManager; update

`update`
--------

**Summary**

Called once a frame after the physics simulation to write back the state from the physics nodes back to the target scene nodes.

This should be called after DynamicsWorld.update() but before Scene.update().

**Syntax** ::

    physicsManager.update();


.. index::
    pair: PhysicsManager; enableHierarchy

`enableHierarchy`
-----------------

**Summary**

Called to enable or disable physics simulation of a SceneNode and its descendants.

**Syntax** ::

    physicsManager.enableHierarchy(sceneNode, enabled);

``SceneNode``
    The :ref:`SceneNode <scenenode>` object.

``enabled``
    A JavaScript boolean.


.. index::
    pair: PhysicsManager; enableNode

`enableNode`
------------

**Summary**

Called to enable or disable physics simulation of a SceneNode.

**Syntax** ::

    physicsManager.enableNode(sceneNode, enabled);

``SceneNode``
    A :ref:`SceneNode <scenenode>` object.

``enabled``
    A JavaScript boolean.

.. index::
    pair: PhysicsManager; deleteHierarchy

`deleteHierarchy`
-----------------

**Summary**

Called to remove physics objects from a SceneNode and its descendants.

**Syntax** ::

    physicsManager.deleteHierarchy(sceneNode);

``SceneNode``
    The :ref:`SceneNode <scenenode>` object.

.. index::
    pair: PhysicsManager; deleteNode

`deleteNode`
------------

**Summary**

Called to remove physics objects from a SceneNode.

**Syntax** ::

    physicsManager.deleteNode(sceneNode);

``SceneNode``
    A :ref:`SceneNode <scenenode>` object.

.. index::
    pair: PhysicsManager; calculateHierarchyExtents

`calculateHierarchyExtents`
---------------------------

**Summary**

Called to calculate the extents of the physics objects of a SceneNode and its descendants.

Returns undefined if there are none.

**Syntax** ::

    var physicsExtents = physicsManager.calculateHierarchyExtents(sceneNode);

``SceneNode``
    The :ref:`SceneNode <scenenode>` object.

Returns an :ref:`extents <extents>` object.

.. index::
    pair: PhysicsManager; calculateExtents

`calculateExtents`
------------------

**Summary**

Called to calculate the extents of the physics objects of a SceneNode.

Returns undefined if there are none.

**Syntax** ::

    var physicsExtents = physicsManager.calculateExtents(sceneNode);

``SceneNode``
    The :ref:`SceneNode <scenenode>` object.

Returns an :ref:`extents <extents>` object.


.. index::
    pair: PhysicsManager; createSnapshot

.. _physicsmanager_createsnapshot:

`createSnapshot`
----------------

**Summary**

Create a snapshot of the state of all the dynamic physic objects.

**Syntax** ::

    var snapshot = physicsManager.createSnapshot();

Returns a snapshot object.

.. index::
    pair: PhysicsManager; restoreSnapshot

.. _physicsmanager_restoresnapshot:

`restoreSnapshot`
-----------------

**Summary**

Restore the state of all the dynamic physic objects
from the snapshot object.

**Syntax** ::

    physicsManager.restoreSnapshot(snapshot);


Properties
==========

`version`
---------

**Summary**

The version number of the PhysicsManager implementation.

**Syntax** ::

    var versionNumber = physicsManager.version;
