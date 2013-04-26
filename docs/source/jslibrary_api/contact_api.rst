.. index::
    single: Contact

.. highlight:: javascript

.. _contact:

------------------
The Contact Object
------------------

A Contact object contains the contact information for a :ref:`contact callback <physicsdevice_contactcallbacks>`.

.. note:: Contact objects will be reused from callback to callback.
          Do not keep any references to a Contact object,
          always copy any information you need to your own objects.


Properties
==========

.. index::
    pair: Contact; localPointOnA

`localPointOnA`
---------------

**Summary**

A :ref:`Vector3 <v3object>` representing the location of the contact in the local space of object A.

**Syntax** ::

    var contactOnA = contact.localPointOnA;

.. note:: Read Only


.. index::
    pair: Contact; localPointOnB

`localPointOnB`
---------------

**Summary**

A :ref:`Vector3 <v3object>` representing the location of the contact in the local space of object B.

**Syntax** ::

    var contactOnB = contact.localPointOnB;

.. note:: Read Only


.. index::
    pair: Contact; worldNormalOnB

`worldNormalOnB`
----------------

**Summary**

A :ref:`Vector3 <v3object>` representing the normal of the surface in world space
at the contact location on object B.

**Syntax** ::

    var contactNormalOnB = contact.worldNormalOnB;

.. note:: Read Only


.. index::
    pair: Contact; added

`added`
-------

**Summary**

A boolean value, `true` if the contact was added on the last simulation update,
`false` otherwise.

**Syntax** ::

    if (contact.added)
    {
        ...
    }

.. note:: Read Only
