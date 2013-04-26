-------------------
Turbulenz SDK 0.6.0
-------------------

Summary
=======

Turbulenz SDK 0.6.0 is an update for both the Turbulenz Engine Installer and SDK components.
This release includes additional features for the local development server, such as JSON asset disassembly, game asset viewer and improved metrics.
It also includes a new sample demonstrating particles as well as updates to the Shader Manager, Effect Manager and Math Library.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.6.0 - http://www.turbulenz.com/download

**Optional**

* Java 1.4+ (Required for YUI Compressor) - http://www.java.com/en/download/manual.jsp

Change List
===========


New Features
------------


**Local.Turbulenz**


The Local server (formerly known as DevServer) now features a *Viewer* and a *Disassembler*.
Select a game project and click on the 'View Assets' button. Here you can find the game's assets, grouped in categories such as *textures*. Where possible, Local offers the links 'View' and/or 'Disassemble'.

'View' lets you inspect an asset, for example a model, and offers funcionality to change lighting conditions or apply different shaders.

'Disassemble' offers a detailed view on an asset's structure in JSON format. The displayed document tree can be traversed using the 'more' and 'less' links. The tree's display depth and that of its sub-structures can be increased or decreased using the buttons at the top of the page.


**Sample App**

The Sample App now supports a remapping table and caching of certain assets with unique names.
This demonstrates the use of the browser caching for files on the local server.
To view the assets that the Sample App requests, you can view the metrics page of the local development server.
For example: staticmax/2Hohp_autOW0WbutP_NSUw.json

**Particle Sample**

New to the SDK is the *particle sample* that demonstrates how to use custom geometry and render buffers with the scene, in order to create a simple particle system rendered using quads.
The sample allows you to change the material and hence the texture used so you can modify the particles spawned in world space at runtime.
To view the sample, run either the development or release build from the *samples* directory.

**JavaScript Benchmark 1.3**

A new feature has been added to the JavaScript Benchmark, which allows you to quickly run selected tests without fully initializing the benchmark.
This allows you to get a quick (but sometimes inaccurate) estimate of the time each test will run in.
Initializing can be run just before performing the benchmark.

Two additional tests have been added comparing the performance cost of using recursive functions or iterating a custom stack.
Three tests have been renamed to compare variable access for parameter, outer and 'this' scope.

.. NOTE::

    Benchmark scores gathered with different versions of JavaScript Benchmark are **not** comparable.
    Please run same version on all browsers and platforms you wish to compare.

**Updates to Tools**

Minor changes have been applied to js2tzjs including a new option *-P* which when used with *-M* to generate dependencies, allows you to output pairs of reference and source file paths.
This allows you to check how dependencies are called so you can deploy your files.
See :ref:`js2tzjs <maketzjs>` for how to use this option.

**Updates to GraphicsDevice**

A new property *videoRam* has been added to the GraphicsDevice to return the amount of video ram in megabytes.

Changes
-------

**Effect and Shader Manager API**

The interfaces to the effect and shader managers have been modified, removing previous requirements such as calling ``update`` on the effect manager.
The purpose of this change is to remove the dependancies between modules and simplify the functionality of some components.
The changes are listed below, please see the API documentation for more detail.

* The effect manager function ``update`` has been removed.
* The effect manager now includes a ``load`` and ``attachEffect`` function. See *effectManager.load()* and *effectManager.attachEffect()*.
* The scene functions ``updateEffects`` and ``createMaterialEffect`` have been removed.
* The scene function ``loadMaterial`` now takes an extra ``effectManager`` argument. See :ref:`scene.loadMaterial() <scene_loadmaterial>`. A consequence of this change is that ``sceneLoader.load`` now requires the following parameter: ``effectManager : effectManager``.
* Geometry instances don't require a ``renderUpdate`` function on creation. See :ref:`GeometryInstance.create() <GeometryInstance>`.
* The effects ``prepare`` function now needs to set ``rendererInfo.technique``, ``rendererInfo.techniqueName`` and ``rendererInfo.renderUpdate`` if they change the technique or update function.
* Some of the effects attributes have been renamed ``effect.techniqueName`` to ``effect.defaultTechniqueName``, ``effect.technique`` to ``effect.defaultTechnique`` and ``effect.update`` to ``effect.defaultUpdate``
* The shader manager ``load`` and ``reload`` functions now have an optional extra argument ``callback`` which is called with the shader as its argument once it has loaded. See :ref:`shaderManager.load() <shadermanager_load>` and :ref:`shaderManager.reload() <shadermanager_reload>`.

**Templating System**

The templating system used to generate compiled .tzjs files and HTML game pages (with js2tzjs and html2tzhtml), has been updated to make construction of games easier.
Any existing game projects will need to update their templates to match the changes, the following changes should be noted:

* The script_open and script_close tags have been renamed code_begin and code_end to express the differences between including external scripts and inlining JavaScript code
* code_begin and code_end are now valid tags inside code blocks which need to be run in the engine (although in this scenario they evaluate as no-ops)
* The js2tzjs tool automatically wraps the Turbulenz Engine builds of code in an anonymous function evaluation to improve compacting, previously this had to be included manually

**VMath and MathDevice**

Turbulenz Game Engine provides two math libraries: the *Math Device*, which is a native library accessible via the Turbulenz Native Engine and *VMath*, which is written in JavaScript and can be found in *jslib*.
To unify the operation of both libraries, the format for Math Device and VMath function names has changed.
The new format is lower case type name, eg. v3, m44 or quat, followed by the operation in camel case.
For example::

    mathDevice.typenameFunctionName();
    mathDevice.typenameFunctionNameTypeName();

A preceding type name is given if the input parameter type is not clear.
For example, ``mathDevice.v3MulM33`` since v3Mul could mean either v3MulM34 or v3MulM33.

Some of the functions have now been added and others renamed to ensure consistency between VMath and MathDevice.
Here is a list of the changes made:

**Completely removed functions**:
    * m43(), m33(), m44(), m44transformn(), m44transformp(), v4equals()

**Renamed functions**:
    * v3()          -> v3Build()
    * v3zero        -> v3BuildZero()
    * v3half        -> v3BuildHalf()
    * v3one         -> v3BuildOne()
    * v3two         -> v3BuildTwo()
    * v3xaxis       -> v3BuildXaxis()
    * v3yaxis       -> v3BuildYaxis()
    * v3zaxis       -> v3BuildZaxis()
    * v3mulm33()    -> m33Transform()

    * v4()          -> v4Build()
    * v4zero        -> v4BuildZero()
    * v4half        -> v4BuildHalf()
    * v4one         -> v4BuildOne()
    * v4two         -> v4BuildTwo()
    * v4mulm44()    -> m44Transform()

    * m33identity   -> m33BuildIdentity()

    * m43identity   -> m43BuildIdentity()

    * m44identity   -> m44BuildIdentity()

    * quat()        -> quatBuild()
    * quatPos()     -> quatPosBuild()


**Renamed functions on VMath**:

    * v3madd()            -> v3MulAdd()
    * v3recp()            -> v3Reciprocal()
    * v3mequal()          -> v3MaskEqual()
    * v3mless()           -> v3MaskLess()
    * v3mgreater()        -> v3MaskGreater()
    * v3mgreatereq()      -> v3MaskGreaterEq()
    * v3mnot()            -> v3MaskNot()
    * v3mor()             -> v3MaskOr()
    * v3mand()            -> v3MaskAnd()
    * v3mselect()         -> v3MaskSelect()
    * v3creates()         -> v3ScalarCreate()
    * v3maxs()            -> v3ScalarMax()
    * v3mins()            -> v3ScalarMin()
    * v3adds()            -> v3ScalarAdd()
    * v3subs()            -> v3ScalarSub()
    * v3muls()            -> v3ScalarMul()
    * v3equals()          -> v3ScalarEqual()
    * v3equalsm()         -> v3EqualScalarMask()
    * v3lesssm()          -> v3LessScalarMask()
    * v3greatersm()       -> v3GreaterScalarMask()
    * v3greatereqsm()     -> v3GreaterEqScalarMask()

    * v4madd()            -> v4MulAdd()
    * v4recp()            -> v4Reciprocal()
    * v4mequal()          -> v4MaskEqual()
    * v4mless()           -> v4MaskLess()
    * v4mgreater()        -> v4MaskGreater()
    * v4mgreatereq()      -> v4MaskGreatereq()
    * v4mnot()            -> v4MaskNot()
    * v4mor()             -> v4MaskOr()
    * v4mand()            -> v4MaskAnd()
    * v4many()            -> v4MaskAny()
    * v4mall()            -> v4MaskAll()
    * v4creates()         -> v4ScalarCreate()
    * v4maxs()            -> v4ScalarMax()
    * v4mins()            -> v4ScalarMin()
    * v4adds()            -> v4ScalarAdd()
    * v4subs()            -> v4ScalarSub()
    * v4muls()            -> v4ScalarMul()
    * v4equalsm()         -> v4EqualScalarMask()
    * v4lesssm()          -> v4LessScalarMask()
    * v4greatersm()       -> v4GreaterScalarMask()
    * v4greatereqsm()     -> v4GreaterEqScalarMask()

    * m33adds()           -> m33ScalarAdd()
    * m33subs()           -> m33ScalarSub()
    * m33muls()           -> m33ScalarMul()

    * m43orthoNormalize() -> m43Orthonormalize()
    * m43transformn()     -> m43TransformVector()
    * m43transformp()     -> m43TransformPoint()
    * m43adds()           -> m43ScalarAdd()
    * m43subs()           -> m43ScalarSub()
    * m43muls()           -> m43ScalarMul()

    * MulRT()             -> quatMulTranslate()

    * m44adds()           -> m44ScalarAdd()
    * m44subs()           -> m44ScalarSub()
    * m44muls()           -> m44ScalarMul()

**New functions**

    * VMath - v3Copy(), v4Copy(), v4Set(), m33BuildIdentity(), m34BuildIdentity(), m34Scale(), m43FromRTS(), m43FromRT(), m43BuildIdentity(), m43BuildTranslation(), m43Translate(), m43Scale(), m44buildidentity(), quatMulTranslate(), quatCopy()
    * MathDevice - v3Set(), v3Reciprocal(), v3Add3(), v3MulAdd(), v3ScalarCreate(), v4Set(), v4Add3(), v4Reciprocal(), v4MulAdd(), v4ScalarCreate(), m33FromQuat(), m33SetRight(), m33SetUp(), m33SetAt(), m33Transpose(), m33Determinant(), m33Inverse(), m33Transform(), m43Determinant(), m43Inverse(), m43Scale(), m43Translate(), m43BuildTranslation(), m43Scale(), m43Orthonormalize(), m43Determinant(), m44Create(), m44Right(), m44Up(), m44At(), m44Pos(), m44SetRight(), m44SetUp(), m44SetAt(), m44SetPos(), m44Translate(), m44Scale(), m44Transpose(), quatIssimilar(), quatLength(), quatDot(), quatNormalize(), quatConjugate(), quatLerp(), quatToAxis(), Rotation(), quatTransformVector(), quatCopy()

Removed
-------

**Build Step for Template and Sample Apps**

The *Build.bat* file is unsupported in this version of the SDK.
Developers should use their own build system and where appropriate use Turbulenz tools and documentation for reference.
The behaviour of the file can be recreated using the *js2tzjs* and *html2tzhtml* tools.

Known Issues
============

* The engine requires a CPU that supports SSE2.
* For shader support the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome. See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the Local Server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the Local Server before running any Turbulenz tools.
* When running intensive JavaScript applications, such as the *multiple animations* sample, some browsers, such as Safari, may lockup the user interface.
  This is due to the JavaScript interactions. You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly. Turbulenz recommends Firefox.
* The following browser(s) do not fully support the samples in *development* mode:
    * IE 6/7/8 - Engine not compatible
    * Opera 10.X - Engine not compatible
* The following browser(s) do not fully support the samples in *release* mode:
    * IE 6 - Not compatible with the styling
    * Opera 10.X - Controls are not fully functional
* The following browser(s) are performance limited for the samples in *development* mode (Don't use the Turbulenz JavaScript Engine):
    * Chrome
