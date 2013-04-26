.. index::
    single: Light

.. highlight:: javascript

.. _light:

----------------
The Light Object
----------------

A light object is a light template referenced by one or more :ref:`LightInstances <lightinstance>`.
The :ref:`LightInstances <lightinstance>` provides the transformation for the Lights from the :ref:`SceneNode <scenenode>` they are attached to.
Direction lights are not effected by the the transformation.

Lights are often created by loading a :ref:`Scene <scene>`, see the :ref:`Scene pipeline <scene_pipeline_json>` documentation.

**Required scripts**

The Light object requires::

    /*{{ javascript("jslib/light.js") }}*/

It also requires that a :ref:`MathDevice <tz_createmathdevice>` has been created before calling the Light constructor.

Constructor
===========

.. index::
    pair: Light; create

.. _light_create:

`create`
--------

**Summary**

Creates and returns a Light object with passed in parameters.

**Syntax** ::

    var pointLight = Light.create({name : lightName,
                                   color : mathDevice.v3Build(1, 1, 1),
                                   point : true,
                                   shadows : true,
                                   halfExtents : mathDevice.v3Build(40, 40, 40),
                                   origin : mathDevice.v3Build(0, 10, 0),
                                   material : lightMatrial});

    var spotLight = Light.create({name : "spot_light_1",
                                  spot : true,
                                  color : mathDevice.v3Build(0.89, 1, 0.99),
                                  material : coneLightMaterial,
                                  right : mathDevice.v3Build(0, 6, 26),
                                  up : mathDevice.v3Build(21, 0, 0),
                                  target : mathDevice.v3Build(0, -36, 9),
                                  shadows : true});

    var directionalLight = Light.create({name : "directional_light1",
                                         directional : true,
                                         color : mathDevice.v3Build(0.2, 0.2, 0.8),
                                         direction : mathDevice.v3Build(0, -1, 0),
                                         material : directionalLightMaterial});

    var ambient  = Light.create({name : "ambient1",
                                 ambient : true,
                                 color : mathDevice.v3Build(0.1, 0.1, 0.1)} );

If a light does not have halfExtents, radius or target parameters defined then it is assumed to be a global light.

``name``
    A string.
    The name of the light.

``point``, ``spot``, ``directional``, ``ambient``
    Booleans representing the type of the light. Only one of these values should be true.

``color``
    A :ref:`Vector3 <vector3>` object giving numbers [red, green, blue].

``material``
    The :ref:`Material <material>` to use for the light.
    This supplies the :ref:`TechniqueParameters <techniqueparameters>` to use.

``origin``
    A :ref:`Vector3 <vector3>` object giving the position of the light source.
    This property does not need to have the same value as :ref:`center <light_center>`.

``target``, ``right``, ``up``, ``end``, ``start``
    All :ref:`Vector3 <vector3>` objects.
    For defining spot light frustums.

``radius``
    A number defining the radius of effect, particularly for point lights.

``halfExtents``
    The half extents defining the area of effect for non-spot lights.

``direction``
    A :ref:`Vector3 <vector3>` object.

``shadows``
    Set to true to enable shadows. Only supported for point and spot lights.

``disabled``
    Set to true to disable the light.

Returns a light object.

Methods
=======

.. index::
    pair: Light; clone

`clone`
-------

**Summary**

Creates a light by cloning an existing light.

**Syntax** ::

    var newLight = light.clone();

Properties
==========

The properties of lights depends on the type of the light created.

.. index::
    pair: Light; name

`name`
------

**Summary**

A string name of the light.

**Syntax** ::

    var name = light.name;


`directional`, `spot`, `ambient`, `point`
-----------------------------------------

Booleans representing the type of the light. Only one of these values should be true.

**Syntax** ::

    if (light.point)
    {
        // ...
    }


.. index::
    pair: Light; global

`global`
--------

**Summary**

Boolean. If set to true then all objects in the :ref:`Scene <scene>` are effected by the light.
Ambient and directional lights are often global.

**Syntax** ::

    if (light.global)
    {
        // ...
    }

.. index::
    pair: Light; color

`color`
-------

**Summary**

A :ref:`Vector3 <vector3>` representing color. Defaults to white.

**Syntax** ::

    var red = light.color[0];


.. index::
    pair: Light; shadows

`shadows`
---------

**Summary**

Boolean, set to true if the light casts shadows.

**Syntax** ::

    var shadows = light.shadows;


.. index::
    pair: Light; direction

`direction`
-----------

**Summary**

A :ref:`Vector3 <vector3>` representing the direction of a direction light.

**Syntax** ::

    var direction = light.direction;


.. index::
    pair: Light; origin

`origin`
--------

**Summary**

A :ref:`Vector3 <vector3>` representing the position of the light source.
This property does not need to have the same value as :ref:`center <light_center>`.

**Syntax** ::

    var origin = light.origin;


.. index::
    pair: Light; center

.. _light_center:

`center`
--------

**Summary**

A :ref:`Vector3 <vector3>` representing the center of the light's bounding box.
If the property is missing or undefined it is implied to be `[0, 0, 0]`.

**Syntax** ::

    var center = light.center;

.. index::
    pair: Light; halfExtents

`halfExtents`
-------------

**Summary**

A :ref:`Vector3 <vector3>` representing the half extents of the light's bounding box.

**Syntax** ::

    var minX = light.center[0] - light.halfExtents[0];


.. index::
    pair: Light; radius

`radius`
--------

**Summary**

For point lights the radius of effect. The half extents of the light should be set to this value.

**Syntax** ::

    light.halfExtents[0] = light.radius;


.. index::
    pair: Light; disabled

`disabled`
----------

**Summary**

Boolean value. If its set then the light is ignored.

**Syntax** ::

    if (light.disabled)
    {
        // ...
    }


.. index::
    pair: Light; material

`material`
----------

**Summary**

The :ref:`Material <material>` to use.
This supplies the :ref:`TechniqueParameters <techniqueparameters>` to use.

**Syntax** ::

    if (light.material)
    {
        // ...
    }


.. index::
    pair: Light; techniqueParameters


`techniqueParameters`
---------------------

**Summary**

The :ref:`TechniqueParameters <techniqueparameters>` to use.

**Syntax** ::

    var techniqueParameters = light.techniqueParameters;
