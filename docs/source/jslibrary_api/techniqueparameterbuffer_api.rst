.. index::
    single: TechniqueParameterBuffer

.. highlight:: javascript

.. _techniqueparameterbuffer:

-----------------------------------
The TechniqueParameterBuffer Object
-----------------------------------

A TechniqueParameterBuffer object is an optimal container for large numbers of floating point values to be set as a technique parameter,
for example as the array of values containing bone matrices for skinning.

This object is only recommended for large arrays or for those that don't match the number of elements of the objects provided by the MathDevice.

Constructor
===========

A TechniqueParameterBuffer object can be constructed with :ref:`GraphicsDevice.createTechniqueParameterBuffer <graphicsdevice_createtechniqueparameterbuffer>`.

Methods
=======

.. index::
    pair: TechniqueParameterBuffer; map

`map`
-----

**Summary**

Requests write access to a region of the TechniqueParameterBuffer.

**Syntax** ::

    var writer = parameterBuffer.map(firstValueToMap, numValuesToMap);
    if (writer)
    {
        var v3zero = mathDevice.v3(0, 0, 0);

        for (var n = 0; n < (numValuesToMap / 3); n += 1)
        {
            writer(v3zero);
        }

        parameterBuffer.unmap(writer);
    }

``firstValueToMap`` (Optional)
    The zero-based index of the first value to map.
    If it is not specified the whole TechniqueParameterBuffer will be mapped.

``numValuesToMap`` (Optional)
    The number of values to map.
    If it is not specified all the values after and including ``firstValueToMap`` will be mapped.

Returns a parameter value writer.

The writer can be called once for each mapped value.
It can also be called with multiple values as parameters or with an object containing multiple values as a single parameter
in order to write multiple values with just one call,
this is more optimal than a call per value but be careful not to write more than the ones the TechniqueParameterBuffer was created with or
the writer will fail.


.. index::
    pair: TechniqueParameterBuffer; unmap

`unmap`
-------

**Summary**

Communicate to the TechniqueParameterBuffer that write access to a mapped region is no longer required.

**Syntax** ::

    var writer = parameterBuffer.map(firstValueToMap, numValuesToMap);
    if (writer)
    {
        // Do something with the writer here

        parameterBuffer.unmap(writer);
    }

``writer``
    The writer returned by a previous call to ``map``.

This method **must** be called if ``map`` returns a valid writer.


Properties
==========

.. index::
    pair: TechniqueParameterBuffer; numFloats

`numFloats`
-----------

**Summary**

Number of floating point values stored on the TechniqueParameterBuffer.

**Syntax** ::

    var numFloats = parameterBuffer.numFloats;

.. note:: Read Only


.. index::
    pair: TechniqueParameterBuffer; dynamic

`dynamic`
---------

**Summary**

True if the TechniqueParameterBuffer was created as dynamic and hence can be modified at runtime, false otherwise.

**Syntax** ::

    var isDynamic = parameterBuffer.dynamic;

.. note:: Read Only


.. index::
    pair: TechniqueParameterBuffer; data

`data`
------

**Summary**

The array of values stored on the TechniqueParameterBuffer.

Create the TechniqueParameterBuffer as dynamic if you are planning to update the values at runtime.

Changing or requesting the values can be an expensive operation.

For a more optimal way to modify the values please use the methods ``map`` and ``unmap``.

**Syntax** ::

    // request all the data
    var parameterData = parameterBuffer.data;

    // update some
    parameterData[0] = 0.5;
    parameterData[1] = 0.25;
    parameterData[2] = 0.125;

    // put it all back
    parameterBuffer.data = parameterData;
