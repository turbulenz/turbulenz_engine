.. index::
    single: ParticleBuilder

.. highlight:: javascript

.. _particlebuilder:

==========================
The ParticleBuilder Object
==========================

ParticleBuilder provides methods for constructing the necessary textures required for animating particle appearances in a particle system.

Methods
=======

.. index::
    pair: ParticleBuilder; compile

`compile`
---------

**Summary**

Compile an animation texture for use in a particular particle system.

**Note**

This method is intended for use with JSON parsed objects to define system and particle definitions, and as such will perform verification of the input objects to ensure they have the expected structure and data types.

Additionally, verification will be performed between the system and particle definitions to ensure that only attributes defined by the system are used by the particle animations.

This verification applies also to any uv-remapping or per-particle attribute tweaks applied.

Any verification errors will be reported as late as possible, and any non-critical errors reported seperately as warnings.

**Syntax** ::

    var result = ParticleBuilder.compile({
        graphicsDevice: graphicsDevice,
        particles: particleAnimationsDefnArray,
        system: systemDefn,
        uvMap: particleUVmapping,
        tweaks: particleAnimationTweaks,
        failOnWarnings: true
    });
    var maxLifeTime = result.maxLifeTime;
    var animation = result.animation;
    var particle = result.particle;
    var attribute = result.attribute;

``graphicsDevice``
    :ref:`GraphicsDevice <graphicsdevice>` object to construct texture with.

``particles``
    An array of particle animation definition objects to be compiled into the resultant texture.

    The particle animation definition must have the following structure ::

        Particle := {
            name          : "particle-name",
            ?fps          : number,
            ?texture#     : Vector4[],
            ?texture#-size: [width, height],
            animation     : Snapshot[]
        }

        Snapshot := {
            ?time : number
            ?attr : attribute-value,
            ?attr-interpolation : Interpolator
        }

        Interpolator :=
            | "none"
            | "linear"
            | "catmull"
            | { type: "cardinal", tension: number }

    `name`
        The name of this particle animation, should be unique amongst a compiled system so that required attributes for shaders can be later retrieved from the compilation result.

    `fps` (Optional)
        Default value 30. Specifies the frames per second that will be compiled into the texture for this particle. A higher fps means that the animation when used in a particle system will appear smoother, at the expense of a large texture being created to store the animation.

    `texture#` (Optional)
        Provides a set of uv-rectangles of the form `[x0, y0, x1, y1]` defining the frames of a flip-book animation. These uv-rectangles must be normalised, but may be specified in pixel coordinates as long as an appropriate `texture#-size` field is defined to enable the compiler to normalise them for you.

        These fields should match the system defined attributes. If the system has defined an attribute using `texture0`, and a particle has not defined uv-rectangles for `texture0`, then a default value of `[[0, 0, 1, 1]]` will be used.

    `animation`
        Specifies a sequence of snapshots defining the animation.

        Each snapshot defines values that the animation should have at a particular time for system attributes, and the interpolation mode that should be used from that point forwards. Times are defined relative to the previous snapshot of the sequence and apart from the first snapshot which must have `time` of `0` (default), all times must be positive.

        This sequence of snapshots is later discretised based on the fps using the defined interpolators to fill in the attributes. Note that each snapshot need not define every attribute and interpolator, for example: ::

            [
                {
                    scale: [0, 0],
                    rotation: 0,
                    "scale-interpolation": "catmull"
                },
                {
                    time: 0.25,
                    scale: [4, 4],
                },
                {
                    time: 0.25,
                    scale: [0.5, 0.5],
                },
                {
                    time: 0.5
                    scale: [1, 1]
                },
                {
                    time: 2,
                    scale: [0, 0],
                    rotation: Math.PI * 2
                }
            ]

        Assuming the default system defined below, this defines an animation where the rotation of the particle moves linearly from 0 to Math.PI * 2 over the whole animation, whilst at the same time, there is a much more complex animation of the particles scale.

``system`` (Optional)
    The system definition object to be used. If unspecified a default will be provided which will work against the default system updaters, renderers and emitters.

    The system definition is formed as an Array of attribute descriptions: ::

        System := Attribute[]

        Attribute := {
            name     : "attribute-name",
            type     : "float" | "float2" | "float4" | "texture#",
            ?default : attribute-default-value,
            ?min     : attribute-minimum-value,
            ?max     : attribute-maximum-value,
            ?storage : "direct" | "normalized",
            ?compress: "none" | "half" | "full",
            ?default-interpolation: Interpolator
        }

    Where each attribute value is either a `number` for `float` and `texture#` types, or an `Array` of `numbers` of the appropariate length for `float2` and `float4` types.

    ``default``
        The attribute default value if unspecified is all `0`.

    ``min/max``
        The attribute min/max values may be specified with `null` to indicate the attribute component has no min or max, and the default value if unspecified is all `null`.

    ``storage``
        `"direct"` storage indicates that values will be encoded into the texture without any remapping, and thus will only handle values between `0` and `1`.

        `"normalized"` storage indicates that values will be remapped to be between `0` and `1` based on the system-wide minimum, and maximum values attained after interpolation and discretisation to animation frames.

    ``compress``
        `"none"` compression indicates that `float2` values will occupy two rows of the output texture, and `float4` values will occupy four rows of the output texture.

        `"half"` compression indicates that `float2` values will occupy a single row of the output texture, and `float4` values two rows of the output texture.

        `"full"` compression indicates that all attribute types will be encoded in a single row of the output texture.

    `texture#` attribute types are output in the texture with the relevant uv-rectangle defined by the particles, and as such will be treat as a `float4` value when it comes to compression.

    ``default-interpolation``
        The attribute default interpolator will itself default to `"linear"` interpolation.

.. _defaultparticlesystem:

    The default system is ::

            [
                {
                    name     : "color",
                    type     : "float4",
                    "default": [1.0, 1.0, 1.0, 1.0],
                    min      : [0.0, 0.0, 0.0, 0.0],
                    max      : [1.0, 1.0, 1.0, 1.0],
                    storage  : "direct"
                },
                {
                    name     : "scale",
                    type     : "float2",
                    "default": [1.0, 1.0]
                },
                {
                    name     : "rotation",
                    type     : "float",
                    "default": 0.0
                },
                {
                    name     : "frame",
                    type     : "texture0",
                    "default": 0
                }
            ]

``uvMap`` (Optional)
    A dictionary of uv-mappings for each texture type used in the system, mapping each particle to the region of the relevant texture to be used. ::

        var uvMap = {
            "texture0": [
                /*particle 0*/ [0, 0, 1, 0.5],
                /*particle 1*/ [0, 0.5, 1, 1]
            ]
        };

    uv-maps are declared by a :ref:`Vector4 <v4object>` object of the form `[x0, y0, x1, y1]` in normalised texture coordinates.

    Use of this parameter enables re-use of particle animations amongst many systems as each individual particle animation can assume use of a full texture instead of requiring foresight into how its texture is packed together with others later on.

``tweaks`` (Optional)
    An array of dictionaries providing scale/offset tweaks to be applied to the animation of the corresponding particles. ::

        var tweaks = [
            /*particle 0*/ {
                "color-scale": [-1, -1, -1, 1],
                "color-offset": [1, 1, 1, 0]
            },
            /*particle 1*/ {
                "scale-scale": [2, 2]
            }
        ];

        // Effect here, would be to invert the color of particles using "particle 0" animation,
        // and to double the size of particles using "particle 1" animation,

    Each tweak is of the form `attr-scale` or `attr-offset` defining an appropriately typed scale or offset for the system attribute.

    These tweaks are applied before any interpolation or normalization occurs.

    Use of this parameter enables re-use of a basic particle animation amongst many systems with slightly different behaviours.

``failOnWarnings`` (Optional)
    Default value true. If true, then the compilation will fail if any warnings occur, even if no errors have occured. Warnings indicate things that may well be a bug in your code, though they are not critical in causing the compilation to fail.

The resultant object contains the following fields:

``maxLifeTime``
    The maximum life time of any particle in the animation.

``animation``
    The compiled animation :ref:`Texture <texture>` object.

``particle``
    An array of particle attributes for the animation texture. Each input particle animation is mapped to an object with the same index containing the following fields:

    ``lifeTime``
        The total life time of the particles animation.

    ``animationRange``
        A `Vector2` object whose values are the normalised texture columns representing the start and end of this particles animation in the texture. This is used when creating particles in the system to match the created particle to its animation in the texture.

``attribute``
    A dictionary of normalized attribute properties to be passed to the shaders, each normalized system attribute will be represented in the dictionary as an object with the following fields:

    ``min``
        An array of numbers matching the dimension of the attribute (1, 2 or 4) for the minimum values attained considering all particle animations after interpolation used by the shaders to remap animation values to true attribute values.

    ``delta``
        An array of numbers as above, representing the difference between the maximum and minimum values attained for the normalized attribute. Used by the shaders as with `min`.

.. index::
    pair: ParticleBuilder; packTextures

`packTextures`
--------------

**Summary**

Perform a run-time packing of a set of textures on the GPU. Intended for use in combination with compiling a particle system animation texture for quicker prototyping.

Packing is performed using the `OnlineTexturePacker` object with unique textures first sorted in decreasing sizes to aid in a more optimal packing.

**Note**

Restrictions on how textures can be packed means that if possible, you should instead perform this packing offline to achieve better mip-mapping of the final result and possibly a more optimal packing.

**Syntax** ::

    var result = ParticleBuilder.packTextures({
        graphicsDevice: graphicsDevice,
        textures: texturesArray,
        borderShrink: 4
    );
    var texture = result.texture;
    var uvMap = result.uvMap;

``graphicsDevice``
    A :ref:`GraphicsDevice <graphicsdevice>` object used to create the newly packed texture and to perform required draw calls to render input textures into the packed texture on the GPU.

``texturesArray``
    An Array of :ref:`Texture <texture>` objects to be packed on the GPU. These textures need not be mipmapped, and repetitions are permitted.

``borderShrink`` (Optional)
    Default value 4. This parameter controls how much input textures are shrunk so as to retain a border around regions of the packed textures without requiring the total size of the packed texture to be increased.
    This is used so that when packing a set of already power-of-two dimension textures, the resultant packed texture can be optimally sized without introducing bleeding effects during mip-mapping.

The resultant object contains the following fields:

``texture``
    The packed :ref:`Texture <texture>` storing all unique input textures

``uvMap``
    An Array of :ref:`Vector4 <v4object>` objects storing the uv-rectangle of each corresponding input texture in the format `[x0, y0, x1, y1]`
