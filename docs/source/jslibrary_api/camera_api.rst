.. index::
    single: Camera

.. highlight:: javascript

.. _camera:

-----------------
The Camera Object
-----------------

Provides functionality for a 3D camera.

This object calculates view, projection and combined transforms for a **right-handed** coordinate system.
It can also calculate frustum planes that can be used for visibility queries.

**Required scripts**

The Camera and CameraController objects require::

    /*{{ javascript("jslib/camera.js") }}*/

Constructor
===========

.. index::
    pair: Camera; create

`create`
--------

**Summary**

Creates and returns a camera object with default values.

**Syntax** ::

    var mathDevice = TurbulenzEngine.createMathDevice({});
    var camera = Camera.create(mathDevice);

Methods
=======

.. index::
    pair: Camera; lookAt

.. _camera_lookat:

`lookAt`
--------

**Summary**

Sets the camera `matrix` to look at the specified 3D point in world space from another one.

**Syntax** ::

    camera.lookAt(target, up, origin);
    camera.updateViewMatrix();
    camera.updateViewProjectionMatrix();

``target``
    A :ref:`Vector3 <v3object>` object giving a world space position for the camera to look at.

``up``
    A :ref:`Vector3 <v3object>` object used to compute the roll of the camera.
    This vector will be normalized as a side effect of this function.

``origin``
    A :ref:`Vector3 <v3object>` object giving the world space position of the camera.

.. index::
    pair: Camera; updateViewMatrix

`updateViewMatrix`
------------------

**Summary**

Updates the camera `viewMatrix`.
Should be called anytime the camera `matrix` is updated.

**Syntax** ::

    camera.matrix = mathDevice.m43FromAxisRotation(up, angle);
    camera.updateViewMatrix();


.. index::
    pair: Camera; updateProjectionMatrix

`updateProjectionMatrix`
------------------------

**Summary**

Updates the camera `projectionMatrix`.
Should be called any time the frustum parameters are changed.

**Syntax** ::

    var aspectRatio = (deviceWidth / deviceHeight);
    if (aspectRatio !== camera.aspectRatio)
    {
        camera.aspectRatio = aspectRatio;
        camera.updateProjectionMatrix();
    }


.. index::
    pair: Camera; updateViewProjectionMatrix

`updateViewProjectionMatrix`
----------------------------

**Summary**

Updates the camera `viewProjectionMatrix`.
Should be called any time the camera `matrix` or the frustum parameters are changed.

**Syntax** ::

    camera.matrix = mathDevice.m43FromAxisRotation(up, angle);
    camera.updateViewMatrix();

    var aspectRatio = (deviceWidth / deviceHeight);
    if (aspectRatio !== camera.aspectRatio)
    {
        camera.aspectRatio = aspectRatio;
        camera.updateProjectionMatrix();
    }

    camera.updateViewProjectionMatrix();


.. index::
    pair: Camera; updateFrustumPlanes

`updateFrustumPlanes`
---------------------

**Summary**

Updates the camera frustum planes.
Required if the camera frustum planes are used after the camera `matrix` or the frustum parameters have been changed.

**Syntax** ::

    camera.updateFrustumPlanes();
    var frustumPlanes = camera.frustumPlanes;
    var isVisible = mathDevice.isInsidePlanesAABB(extents, frustumPlanes);


.. index::
    pair: Camera; extractFrustumPlanes

`extractFrustumPlanes`
----------------------

**Summary**

Returns an array with the camera frustum planes.
This function is used by `updateFrustumPlanes` to build the camera frustum planes.

**Syntax** ::

    camera.matrix = mathDevice.m43FromAxisRotation(up, angle);
    camera.updateViewMatrix();
    camera.updateViewProjectionMatrix();
    var frustum1 = camera.extractFrustumPlanes();

    camera.lookAt(target, up, origin);
    camera.updateViewMatrix();
    camera.updateViewProjectionMatrix();
    var frustum2 = camera.extractFrustumPlanes();

Returns an array of 6 :ref:`Plane <plane>` objects in the order:

- 0 - left
- 1 - right
- 2 - top
- 3 - bottom
- 4 - near
- 5 - far

.. index::
    pair: Camera; getFrustumPoints

`getFrustumPoints`
------------------

**Summary**

Returns an array with the 8 points in world units that define the camera frustum.
Useful for calculating a bounding volume of the camera frustum.

**Syntax** ::

    camera.updateViewProjectionMatrix();
    var frustumPoints = camera.getFrustumPoints();
    var sphere = calculateBoundingSphere(frustumPoints);

Returns a JavaScript array of 8 points.
These points are ordered:

- 0 - near top right
- 1 - near top left
- 2 - near bottom left
- 3 - near bottom right
- 4 - far top right
- 5 - far top left
- 6 - far bottom left
- 7 - far bottom right

Each point is represented as JavaScript array of 3 components.

.. index::
    pair: Camera; getFrustumFarPoints

`getFrustumFarPoints`
---------------------

**Summary**

Returns an array with the 4 points in world units of the far plane of the camera frustum.
Useful for calculating simple intersections of the camera frustum with other volumes.

**Syntax** ::

    camera.updateViewProjectionMatrix();
    var farPlanePoints = camera.getFrustumFarPoints();

Returns a JavaScript array of 4 points.
These points are ordered:

- 0 - top right
- 1 - top left
- 2 - bottom left
- 3 - bottom right

Each point is represented as JavaScript array of 3 components.

.. index::
    pair: Camera; isVisibleAABB

`isVisibleAABB`
---------------

**Summary**

Returns true if the given axis-aligned bounding box is visible from the camera.

**Syntax** ::

    camera.updateFrustumPlanes();
    var isVisible = camera.isVisibleAABB(extents);

``extents``
    The :ref:`extents <extents>` of the bounding box.


Properties
==========

.. index::
    pair: Camera; version

`version`
---------

**Summary**

The version number of the Camera implementation.

**Syntax** ::

    var cameraVersionNumber = camera.version;


.. index::
    pair: Camera; viewOffsetX
    pair: Camera; viewOffsetY

`viewOffsetX` and `viewOffsetY`
-------------------------------

**Summary**

Shear offsets of the camera frustum.
Default to zero.

**Syntax** ::

    camera.viewOffsetX = 0.1;


.. index::
    pair: Camera; recipViewWindowX
    pair: Camera; recipViewWindowY

`recipViewWindowX` and `recipViewWindowY`
-----------------------------------------

**Summary**

Reciprocals to set the field of view of the camera frustum.
Default to 1.0.

**Syntax** ::

    var horizontalFOV = 120;
    var degreesToradians = (Math.PI / 180);
    camera.recipViewWindowX = 1.0 / Math.tan((horizontalFOV * 0.5) * degreesToradians);


.. index::
    pair: Camera; infinite

`infinite`
----------

**Summary**

Sets the far plane of the camera frustum at infinity when true,
it effectively disables clipping by that plane.
Defaults to false.

**Syntax** ::

    camera.infinite = true;


.. index::
    pair: Camera; parallel

`parallel`
----------

**Summary**

Sets the camera frustum as an orthographic projection.
Defaults to false.

**Syntax** ::

    camera.parallel = true;


.. index::
    pair: Camera; aspectRatio

`aspectRatio`
-------------

**Summary**

Sets the aspect ratio of the camera frustum.
Defaults to 4.0 / 3.0.

**Syntax** ::

    camera.aspectRatio = 16.0 / 9.0;


.. index::
    pair: Camera; nearPlane

`nearPlane`
-----------

**Summary**

Sets the distance in world units from the camera position to the near plane of the camera frustum.
Setting the near plane to a value lower than 1 can severely degrade the precision of the Z-buffer.
Defaults to 1.0.

**Syntax** ::

    camera.nearPlane = 4.0;


.. index::
    pair: Camera; farPlane

`farPlane`
----------

**Summary**

Sets the distance in world units from the camera position to the far plane of the camera frustum.
Defaults to 1000.0.

**Syntax** ::

    camera.farPlane = 3000.0;


.. index::
    pair: Camera; matrix

`matrix`
--------

**Summary**

Sets the :ref:`Matrix43 <m43object>` object that defines the position and orientation of the camera in world space.
Defaults to the identity matrix.

**Syntax** ::

    camera.matrix = mathDevice.m43FromAxisRotation(up, angle);


.. index::
    pair: Camera; viewMatrix

`viewMatrix`
------------

**Summary**

The :ref:`Matrix43 <m43object>` that defines the transform from world space to the camera space.
It is effectively the inverse of the camera `matrix`.
Not recommended to be updated by hand,
it is better to call the method `updateViewMatrix` when the camera `matrix` is changed.

**Syntax** ::

    var viewMatrix = camera.viewMatrix;


.. index::
    pair: Camera; projectionMatrix

`projectionMatrix`
------------------

**Summary**

The :ref:`Matrix44 <m44object>` that defines the projection from camera space into screen space.
Not recommended to be updated by hand,
it is better to call the method `updateProjectionMatrix` when the frustum parameters are changed.

**Syntax** ::

    var projectionMatrix = camera.projectionMatrix;


.. index::
    pair: Camera; viewProjectionMatrix

`viewProjectionMatrix`
----------------------

**Summary**

The :ref:`Matrix44 <m44object>` that defines the transform from world space to the projected screen space.
Not recommended to be updated by hand,
it is better to call the method `updateViewProjectionMatrix` when the camera `matrix`
or the frustum parameters are changed.

**Syntax** ::

    var viewProjectionMatrix = camera.viewProjectionMatrix;


.. index::
    pair: Camera; frustumPlanes

`frustumPlanes`
---------------

**Summary**

The array of planes that defines the camera frustum.
In the order:

- 0 - left
- 1 - right
- 2 - top
- 3 - bottom
- 4 - near
- 5 - far

Not recommended to be updated by hand,
it is better to call the method `updateFrustumPlanes` when the camera `matrix`
or the frustum parameters are changed.

**Syntax** ::

    var frustumPlanes = camera.frustumPlanes;
    var isVisible = mathDevice.isInsidePlanesAABB(extents, frustumPlanes);

.. index::
    single: CameraController

---------------------------
The CameraController Object
---------------------------

Provides functionality for a fly camera controlled by mouse and keyboard.
Click on the engine window to enable input capture.

The arrow keys move the camera forwards, backwards, to the left and to the right.
The keys `W`, `S`, `A` and `D` work as the arrow keys.
The keys `E` and `Q` work as up and down keys.
The key `enter` switches between fullscreen and windowed mode.
The mouse movements rotate the camera and rolling the mouse is a quick forward movement.
Press the `escape` key to release the input devices.

.. highlight:: javascript


Constructor
===========

.. index::
    pair: CameraController; create

`create`
--------

**Summary**

Creates and returns a camera object with default values.

**Syntax** ::

    var cameraController = CameraController.create(graphicsDevice, inputDevice, camera);

``graphicsDevice``
    The GraphicsDevice object to be set to fullscreen when pressing `enter`.

``inputDevice``
    The InputDevice object that the controller is going to be attached to.

``camera``
    The `Camera` object to be controlled.


Methods
=======

.. index::
    pair: CameraController; update

`update`
--------

**Summary**

Updates the camera according to the input events.

**Syntax** ::

    inputDevice.update();
    cameraController.update();


Properties
==========

.. index::
    pair: CameraController; version

`version`
---------

**Summary**

The version number of the CameraController implementation.

**Syntax** ::

    var cameraVersionNumber = cameraController.version;


.. index::
    pair: CameraController; maxSpeed

`maxSpeed`
----------

**Summary**

The maximum movement speed for each frame.
Defaults to 1.0.

**Syntax** ::

    cameraController.maxSpeed = (deltaTime * maxSceneSpeed);


.. index::
    pair: CameraController; rotateSpeed

`rotateSpeed`
-------------

**Summary**

The rotation speed factor.
Defaults to 2.0.

**Syntax** ::

    cameraController.rotateSpeed = 1.0;


.. index::
    pair: CameraController; mouseRotateFactor

`mouseRotateFactor`
-------------------

**Summary**

The mouse rotation speed factor.
Defaults to 0.1.

**Syntax** ::

    cameraController.mouseRotateFactor = 1.0;
