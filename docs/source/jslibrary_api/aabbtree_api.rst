.. _aabbtree:

.. highlight:: javascript

.. index::
    single: AABBTree

-------------------
The AABBTree Object
-------------------

Provides a hierarchy of axis-aligned bounding boxes that can be queried for visibility and overlaps.

**Required scripts**

The AABBTree object requires::

    /*{{ javascript("jslib/aabbtree.js") }}*/

A two dimensional variant exists in the :ref:`BoxTree <boxtree>` object.


Constructor
===========

.. index::
    pair: AABBTree; create

`create`
--------

**Summary**

**Syntax** ::

    var aabbtree = AABBTree.create(highQuality);

``highQuality``
    A boolean parameter. Setting to true enables a more optimal division of space when updating the tree.
    This can improve performance when doing many queries but it will make updating the tree more expensive.
    Usually it is only enabled for trees of objects that are either static or that don't move much every frame.


Method
======


.. index::
    pair: AABBTree; add

`add`
-----

**Summary**

Adds an entry to the tree.

**Syntax** ::

    aabbtree.add(externalObject, extents);

``externalObject``
    The object whose extents are going to be added to the tree.
    This method will store some tree information on this object to be used when updating or removing its entry.

``extents``
    The :ref:`extents <extents>` parameter is the extents of the ``externalObject``.

This method will require a call to `finalize` before doing any queries.


.. index::
    pair: AABBTree; update

`update`
--------

**Summary**

Updates an entry of the tree.

**Syntax** ::

    aabbtree.update(externalNode, extents);

``externalObject``
    The object whose extents are going to be updated on the tree.

``extents``
    The :ref:`extents <extents>` parameter is the extents of the ``externalObject``.

This method will require a call to `finalize` before doing any queries.


.. index::
    pair: AABBTree; remove

`remove`
--------

**Summary**

Removes an entry to the tree.

**Syntax** ::

    aabbtree.remove(externalObject);

``externalObject``
    The object whose extents are going to be removed from the tree.

This method will require a call to `finalize` before doing any queries.


.. index::
    pair: AABBTree; finalize

`finalize`
----------

**Summary**

Updates the tree to reflect recent changes.

**Syntax** ::

    aabbtree.finalize();

This method is required before any queries are performed.


.. index::
    pair: AABBTree; getVisibleNodes

.. _aabbtree_getvisiblenodes:

`getVisibleNodes`
-----------------

**Summary**

Query to find which objects are visible.

**Syntax** ::

    aabbtree.getVisibleNodes(planes, visibleObjects, startIndex);

Returns an integer representing the number of insertions made to the visibleObjects array.

``planes``
    An array of :ref:`Plane <plane>` objects that delimit the visible frustum.
    There is no limit to the number of planes to be tested.
    Each plane is assumed to be an array of 4 numbers defining the plane equation.

``visibleObjects``
    An array to which the visible objects will be appended.

``startIndex (Optional)``
    The index at which to begin insertions to the visibleObjects array.
    If left undefined, then all insertions will be made to the end of the array.


.. index::
    pair: AABBTree; getOverlappingNodes

`getOverlappingNodes`
---------------------

**Summary**

Query to find which objects overlap with the given bounding box.

**Syntax** ::

    var numInsertions = aabbtree.getOverlappingNodes(queryExtents, overlappingObjects, startIndex);

Returns an integer representing the number of insertions made to the overlappingObjects array.

``queryExtents``
    The :ref:`extents <extents>` of the query.

``overlappingObjects``
    An array to which the overlapping objects will be inserted.

``startIndex (Optional)``
    The index at which to begin insertions to the overlappingObjects array.
    If left undefined, then all insertions will be made to the end of the array.


.. index::
    pair: AABBTree; getSphereOverlappingNodes

.. _aabbtree_sphereoverlappingnodes:

`getSphereOverlappingNodes`
---------------------------

**Summary**

Query to find which objects overlap with the given sphere.

**Syntax** ::

    aabbtree.getSphereOverlappingNodes(center, radius, overlappingObjects);

``center``
    An array of 3 numbers that define the center of the sphere.

``radius``
    The radius of the sphere.

``overlappingObjects``
    An array to which the overlapping objects will be appended.


.. index::
    pair: AABBTree; getOverlappingPairs

`getOverlappingPairs`
---------------------------

**Summary**

Query to find which objects overlap with each other.

**Syntax** ::

    var numInsertions = aabbtree.getOverlappingPairs(overlappingPairs, startIndex);

Returns an integer representing the number of insertions made to the overlappingPairs array.
This value will always be an even integer, equal to twice the number of pairs inserted.

``overlappingPairs``
    An array to which the overlapping pairs will be inserted.
    Each pair is inserted as consecutive elements of the array.

``startIndex (Optional)``
    The index at which to begin insertions to the overlappingPairs array.
    If left undefined, then all insertions will be made to the end of the array.

This method does not generate any duplicated pairs.


.. index::
    pair: AABBTree; clear

`clear`
-------

**Summary**

Removes all the entries from the tree.

**Syntax** ::

    aabbtree.clear();

.. _aabbtree_raytest:

`rayTest`
---------

**Summary**

Cast a parametrically defined ray through multiple AABBTree objects concurrently to find
first intersection based on a callback.

**Syntax** ::

    var ray = {
        origin : startPoint,
        direction : direction,
        maxFactor : 4
    };

    function callback(tree, externalNode, ray, factor, upperBound)
    {
        return {
            factor: factor,
            externalNode : externalNode
        };
    }

    var closestResult = AABBTree.rayTest(trees, ray, callback);
    if (closestResult)
    {
        var intersection = mathDevice.v3AddScalarMul(ray.origin, ray.direction, closestResult.factor);
        console.log("Ray intersected an external node's extents at position " + intersection +
                    "for external node " + closestResult.externalNode);
    }

``trees``
    An array of AABBTree objects through which to cast the ray.

``ray``
    A parametrically defined ray.

    The direction property need not be a normalised vector, with maxFactor defining
    the upper limit for how far the ray will be cast before terminating with failure.

    To convert a ray defined by a start and end point, to a parametric ray the following would suffice. ::

        var parametric_ray = {
            origin : ray.start,
            direction : mathDevice.v3Sub(ray.end, ray.start),
            maxFactor : 1
        };

``callback``
    A function to be used in filtering unwanted external nodes, and to perform any
    further specific ray testing logic.

    **Arguments to callback**

        ``tree``
            The AABBTree to which the externalNode belongs.

        ``externalNode``
            The external node for the AABBTree leaf intersected.

        ``ray``
            Reference to the ray supplied in the call to rayTest.

        ``factor``
            The factor along ray representing the intersection point with the AABBTree leaf extents, this value
            will always be greater than 0.

        ``upperBound``
            A current upper bound to the factor representing the closest intersection at this point in time.
            This value will always be less than the input ray's maxFactor value, and greater than or equal to
            the value of the factor argument.

            This value together with factor define a viable range for a more specific ray testing routine outside
            of which the external node's contents may be ignored.

    This callback should return an object with a property named factor, or null to discard this external node.

    The value of this property should represent the intersection point with the externalNode. It must be
    greater than, or equal to the factor argument of the callback, and less than or equal to the upperBound
    argument to the callback.

    The return object may contain any further properties useful to you.

The return value of this function is the object returned by the callback function, having the smallest factor.

This function will return null if there was no reported intersection for factors in the range 0, up to the input
ray's maxFactor value.


Properties
==========

.. index::
    pair: AABBTree; version

`version`
---------

**Summary**

The version number of the Scene implementation.

**Syntax** ::

    var versionNumber = aabbtree.version;
