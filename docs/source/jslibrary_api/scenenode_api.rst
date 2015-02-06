.. index::
    single: SceneNode

.. highlight:: javascript

.. _scenenode:

--------------------
The SceneNode Object
--------------------

The SceneNode objects are the nodes that form the scene graph of a :ref:`Scene <scene>`. Each node has a collection of children SceneNodes, a local transform and, optionally, :ref:`extents <extents>` (bounding box).
Additionally it may have visible objects attached, defined as a collection of :ref:`renderable <renderable>` items, typically :ref:`GeometryInstances <geometryinstance>`, and a collection of :ref:`LightInstances <lightinstance>`.

All matrices used for local and world transformations are :ref:`Matrix43 <m43object>` objects.

The SceneNodes use lazy evaluation internally to avoid unnecessary calculations.

SceneNodes can be dynamic, which may move or change extents at some point.
Non-dynamic (static) nodes never move or change extents. Static nodes are cheaper to render and update.
Typically a level mesh would be static while the entities and FX would be dynamic.

.. WARNING::

    Changing from dynamic to static or visa versa can be an expensive operation.
    Usually this will be specified at creation time using the `dynamic` property, either in the tool chain, through the :ref:`Scene.load() <scene_load>` load parameters or the :ref:`SceneNode.create() <scenenode_create>` parameters.


Rules:

 * Root nodes (nodes with no parent) added to a scene must be uniquely named. Choose a naming convention for nodes in your code and assets.
 * Nodes should not be renamed post create.
 * Properties with get/set methods should not be directly accessed unless :ref:`SceneNode.update() <scenenode_update>`, :ref:`Scene.updateNodes() <scene_updatenodes>` or :ref:`Scene.update() <scene_update>` has been called and no further modification made.
 * A node must only be in one scene.

.. _scenenode_required_scripts:

**Required scripts**

The SceneNode object requires::

    /*{{ javascript("jslib/aabbtree.js") }}*/
    /*{{ javascript("jslib/utilities.js") }}*/


Constructor
===========

.. index::
    pair: SceneNode; create

.. _scenenode_create:

`create`
--------

**Summary**

Create and return a sceneNode object initialized with the passed in parameters.

**Syntax** ::

    var parameters =
    {
        name: "player1",
        local: startPoint,
        dynamic: true,
        disabled: false
    };
    var player1Node = SceneNode.create(parameters);

``name`` (Optional)
    Name of the object.
    For root nodes these must be unique.

``local`` (Optional)
    The initial local transform of the node.
    It should be a :ref:`Matrix43 <m43object>`.
    If not specified its the identity matrix.

``dynamic`` (Optional)
    If false then the node will ever move or change extents.
    By default scene nodes are assumed static.

``disabled`` (Optional)
    If true the attached renderables and lights are not rendered.
    By default this is set to false.

Methods
=======

.. index::
    pair: SceneNode; makePath

.. _scenenode_makepath:

`makePath`
----------

**Summary**

Makes a nodes path by appending a child name to an ancestor path.

See :ref:`getPath <scenenode_getpath>`.

**Syntax** ::

    SceneNode.makePath(parentPath, childName);

    //example usage:
    var childPath = SceneNode.makePath(parentNode.getPath(), "childname");

``parentPath``
    A JavaScript string.

``childName``
    A JavaScript string.


.. index::
    pair: SceneNode; getName

`getName`
---------

**Summary**

Get the name of the node. Not all nodes have a name.

**Syntax** ::

    var name = node.getName();

Returns a JavaScript string.

.. index::
    pair: SceneNode; getPath

.. _scenenode_getpath:

`getPath`
---------

**Summary**

Get the path of the node. This is a \\ delimited string of it and its ancestors names, e.g. "grandParentName\\parentName\\name".

**Syntax** ::

    var path = node.getPath();

Returns a JavaScript string.

.. index::
    pair: SceneNode; addChild

`addChild`
----------

**Summary**

Add a SceneNode as a child of this node.

**Syntax** ::

    node.addChild(sceneNode);

``sceneNode``
    A :ref:`SceneNode <scenenode>` object.
    Cyclic links will cause undefined behavior.
    If ``sceneNode`` previously had a parent node it will be removed from that parent's children.

.. index::
    pair: SceneNode; removeChild

.. _scenenode_removechild:

`removeChild`
-------------

**Summary**

Remove the child from the SceneNode. If the node is in the scene then it will remove all references from it.

**Syntax** ::

    parentNode.removeChild(childNode);

``childNode``
    A :ref:`SceneNode <scenenode>` object.
    ``childNode`` must be an immediate child of ``parentNode``.

.. index::
    pair: SceneNode; findChild

`findChild`
-----------

**Summary**

Finds a named child of this node.

**Syntax** ::

    var childNode = parentNode.findChild(childNodeName);

``childNodeName``
    A JavaScript string.

Returns undefined if a child with the given name does not exist.
This function only searches through the immediate children of ``parentNode``.

.. index::
    pair: SceneNode; clone

.. _scenenode_clone:

`clone`
-------

**Summary**

Create a new node by copying the node.

This clones all descendant nodes as well as lights and renderable items.

**Syntax** ::

    var cloneNode = originalNode.clone(cloneName);

``cloneName``
    A JavaScript string.

Returns a :ref:`SceneNode <scenenode>` object.

.. index::
    pair: SceneNode; getRoot


`getRoot`
---------

**Summary**

Get the root node of this node.

**Syntax** ::

    var root = node.getRoot();

Returns a :ref:`SceneNode <scenenode>` object.
This function will return ``node`` if ``node`` is a root node.

.. index::
    pair: SceneNode; setLocalTransform

`setLocalTransform`
-------------------

**Summary**

Set the local transform matrix of the node. This is not valid for non-dynamic nodes that have been added to the scene.

**Syntax** ::

    player1Node.setLocalTransform(matrix);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

.. index::
    pair: SceneNode; getLocalTransform

`getLocalTransform`
-------------------

**Summary**

Get the local transform matrix of the node.

**Syntax** ::

    var local = node.getLocalTransform();

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: SceneNode; getWorldTransform

`getWorldTransform`
-------------------

**Summary**

Get the world transform matrix of the node.

**Syntax** ::

    var world = node.getWorldTransform();

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: SceneNode; update

.. _scenenode_update:

`update`
--------

**Summary**

Update all the state of the node.
This will not normally be required to be called manually as it is automatically called by Scene.update() or by calling Scene.updateNodes().
Once called properties, such as world and worldExtents, can be read without worrying about dirty state.

**Syntax** ::

    node.update(scene);

``scene``
    A :ref:`Scene <scene>` object.


.. index::
    pair: SceneNode; getLocalExtents

`getLocalExtents`
-----------------

**Summary**

Get the local extents of the node.
These are not transformed by the local transformation matrix.
These may be undefined.

**Syntax** ::

    var localExtents = node.getLocalExtents();

Returns an :ref:`extents <extents>` object.

.. index::
    pair: SceneNode; getWorldExtents

`getWorldExtents`
-----------------

**Summary**

Get the world :ref:`extents <extents>` of the node.
These may be undefined.

**Syntax** ::

    var worldExtents = node.getWorldExtents();

Returns an :ref:`extents <extents>` object.


.. index::
    pair: SceneNode; addCustomLocalExtents

`addCustomLocalExtents`
-----------------------

**Summary**

User defined :ref:`extents <extents>` that replace the ones calculated from any attached geometry.
The extents should be defined based on the local transform being the identity matrix.

**Syntax** ::

    node.addCustomLocalExtents(extents);

    //example usage:
    node.addCustomLocalExtents([-10, -10, -10, 10, 10, 10]);

``extents``
    An :ref:`extents <extents>` object.

.. index::
    pair: SceneNode; removeCustomLocalExtents

`removeCustomLocalExtents`
--------------------------

**Summary**

Removes previously attached custom local :ref:`extents <extents>`.

**Syntax** ::

    node.removeCustomLocalExtents();

.. index::
    pair: SceneNode; getCustomLocalExtents

`getCustomLocalExtents`
-----------------------

**Summary**

Get previously attached custom local extents. Maybe undefined.

**Syntax** ::

    var extents = node.getCustomLocalExtents();

This function returns an :ref:`extents <extents>` object.

.. index::
    pair: SceneNode; addCustomWorldExtents

`addCustomWorldExtents`
-----------------------

**Summary**

User defined :ref:`extents <extents>` that replace the ones calculated from any attached geometry and the world transform.
Even if the node moves the extents will not be recalculated.
These can be used as an optimization for animated objects that are constrained to a location.

**Syntax** ::

    node.addCustomWorldExtents(worldExtents);

    //example usage:
    var worldExtents = node.getWorldExtents().slice();
    var padding = 10;
    worldExtents[0] -= padding;
    worldExtents[1] -= padding;
    worldExtents[2] -= padding;
    worldExtents[3] += padding;
    worldExtents[4] += padding;
    worldExtents[5] += padding;
    node.addCustomWorldExtents(worldExtents);

``worldExtents``
    An :ref:`extents <extents>` object.

.. index::
    pair: SceneNode; removeCustomWorldExtents

`removeCustomWorldExtents`
--------------------------

**Summary**

Remove previously attached custom world extents.

**Syntax** ::

    node.removeCustomWorldExtents();

.. index::
    pair: SceneNode; getCustomWorldExtents

`getCustomWorldExtents`
-----------------------

**Summary**

Get previously attached world :ref:`extents <extents>`.
Maybe undefined.

**Syntax** ::

    var extents = node.getCustomWorldExtents();

.. index::
    pair: SceneNode; calculateHierarchyWorldExtents

`calculateHierarchyWorldExtents`
--------------------------------

**Summary**

Get world :ref:`extents <extents>` of the node and all its descendants.
Maybe undefined.

**Syntax** ::

    var extents = node.calculateHierarchyWorldExtents(destination);

``destination`` (Optional)
    The :ref:`extents <extents>` array to use as the destination for the world extents of the node.

.. index::
    pair: SceneNode; setDynamic

`setDynamic`
------------

**Summary**

Sets the node and all its descendants to be dynamic nodes.
This can be an expensive operation.

**Syntax** ::

   node.setDynamic();

.. index::
    pair: SceneNode; setStatic

`setStatic`
-----------

**Summary**

Sets the node and all its descendants to be static nodes.
This can be an expensive operation.

**Syntax** ::

   node.setStatic();


.. index::
    pair: SceneNode; setDisabled

`setDisabled`
-------------

**Summary**

Sets the node to be the passed in value.
Disabled nodes are not rendered.

**Syntax** ::

   node.setDisabled(boolean);

.. index::
    pair: SceneNode; getDisabled

`getDisabled`
-------------

**Summary**

Gets if the node is disabled.

**Syntax** ::

   var disabled = node.getDisabled();

Returns a boolean.

.. index::
    pair: SceneNode; enableHierarchy

`enableHierarchy`
-----------------

**Summary**

Enable or disabled the node and its descendants.

**Syntax** ::

   node.enableHierarchy(boolean);


.. index::
    pair: SceneNode; addRenderable

.. _scenenode_addrenderable:

`addRenderable`
---------------

**Summary**

Add a :ref:`renderable <renderable>` object to the node's collection.

**Syntax** ::

   node.addRenderable(renderable);

``renderable``
    A :ref:`renderable <renderable>` object.

.. index::
    pair: SceneNode; addRenderableArray

`addRenderableArray`
--------------------

**Summary**

Add an array of renderable objects to the node's collection.

**Syntax** ::

   node.addRenderableArray(renderables);

``geometryInstances``
    A JavaScript array of :ref:`renderable <renderable>` objects.

.. index::
    pair: SceneNode; removeRenderable

`removeRenderable`
------------------

**Summary**

Remove a renderable object from the node's collection.

**Syntax** ::

   node.removeRenderable(renderable);

``renderable``
    A :ref:`renderable <renderable>` object.

.. index::
    pair: SceneNode; hasRenderables

`hasRenderables`
----------------

**Summary**

Returns whether the node has any renderable objects.

**Syntax** ::

   if (node.hasRenderables())
   {
       //...
   }

.. index::
    pair: SceneNode; addLightInstance

`addLightInstance`
------------------

**Summary**

Add a lightInstance object to the node's collection.

**Syntax** ::

   node.addLightInstance(lightInstance);

``lightInstance``
    A :ref:`LightInstance <lightinstance>` object.

`addLightInstanceArray`
-----------------------

**Summary**

Add an array of lightInstance objects to the node's collection.

**Syntax** ::

   node.addLightInstanceArray(lightInstances);

``lightInstances``
    A JavaScript array of :ref:`LightInstance <lightinstance>` objects.

.. index::
    pair: SceneNode; removeLightInstance

`removeLightInstance`
---------------------

**Summary**

Remove a lightInstance object from the node's collection.

**Syntax** ::

   node.removeLightInsance(lightInstance);

``lightInstance``
    A :ref:`LightInstance <lightinstance>` object.

.. index::
    pair: SceneNode; hasLightInstance

`hasLightInstance`
------------------

**Summary**

Returns whether the node has any lightInstance objects.

**Syntax** ::

   if (node.hasLightInstance())
   {
       //...
   }

.. index::
    pair: SceneNode; isInScene

`isInScene`
-----------

**Summary**

Returns whether the node is in a scene.

**Syntax** ::

   if (node.isInScene())
   {
       //...
   }

.. index::
    pair: SceneNode; destroy

`destroy`
---------

**Summary**

Destroy the node and all its children.
This destroys any attached renderables and lights.
The node should not be used after calling destroy().

**Syntax** ::

    scene.removeRootNode(node);
    node.destroy();
    node = null;

Properties
==========

.. index::
    pair: SceneNode; version

`version`
---------

**Summary**

The version number of the SceneNode implementation.

**Syntax** ::

    var sceneNodeVersionNumber = sceneNode.version;

.. index::
    pair: SceneNode; local

`local`
-------

**Summary**

The local is the local transformation :ref:`Matrix43 <m43object>` object.

**Syntax** ::

    var local = sceneNode.local;

.. index::
    pair: SceneNode; world

`world`
-------

**Summary**

The world is the world transformation :ref:`Matrix43 <m43object>` object.
See the top level summary for when this is valid.

**Syntax** ::

    var world = sceneNode.world;

.. index::
    pair: SceneNode; worldExtents

`worldExtents`
--------------

**Summary**

The world :ref:`extents <extents>` of the node.
Maybe be undefined.
See the top level summary for when this is valid.

**Syntax** ::

    var extents = sceneNode.worldExtents;

.. index::
    pair: SceneNode; children

`children`
--------------

**Summary**

An array of children of SceneNodes.

**Syntax** ::

    var children = sceneNode.children;
