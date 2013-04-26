.. _boxtree:

.. highlight:: javascript

.. index::
    single: BoxTree

------------------
The BoxTree Object
------------------

Provides a two dimensional variant of the three dimensional :ref:`AABBTree <aabbtree>` object.

Methods of this object are equivalent to those of the :ref:`AABBTree <aabbtree>` except for obvious changes such as extents being defined with `4` values instead of `6`.

This is true also for methods such as :ref:`getVisibleNodes <aabbtree_getvisiblenodes>` for which the planes are defined
now using `3` values for the normal and distance instead of `4` and
for :ref:`getSphereOverlappingNodes <aabbtree_sphereoverlappingnodes>` (renamed as `getCircleOverlappingNodes`
for `BoxTree`) which takes `2` values to define center of the circle, instead of `3` defining the center of a sphere.

**Required scripts**

The BoxTree object requires::

    /*{{ javascript("jslib/boxtree.js") }}*/
