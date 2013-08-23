.. index:
    single: TextureEffects

.. highlight:: javascript

.. _textureeffects:

=========================
The TextureEffects Object
=========================

Provide GPU powered texture effects.

Constructor
===========

.. index::
    pair: TextureEffects; create

`create`
--------

**Summary**

**Syntax** ::

    var effects = TextureEffects.create({
        graphicsDevice : gd,
        mathDevice : md
    });

``graphicsDevice``
    The :ref:`GraphicsDevice <graphicsdevice>` object used for rendering.

``mathDevice``
    The :ref:`MathDevice <mathdevice>` object used to create new matrices with.


Method
======

.. index::
    pair: TextureEffects; applyDistort

`applyDistort`
--------------

**Summary**

Apply a distortion effect based on a given distortion texture.

**Syntax** ::

    var success = effects.applyDistort({
        source : sourceTexture,
        distortion : distortionTexture,
        destination : renderTarget,
        strength : 10,
        transform : [ x1, x2, y1, y2, t1, t2]
    });

``source``
    The source :ref:`Texture <texture>` for the effect.

``distortion``
    The :ref:`Texture <texture>` object defining the distortion to be applied.

    The `red` channel of the texture is used to define the local x-coordinate distortion. A post-normalized value of `0` specifying full distortion to the left, and `1` full distortion to the right.

    The `green` channel is used for y-distortion. whilst `blue` and any `alpha` channel present are ignored.

``destination``
    The :ref:`RenderTarget <rendertarget>` object to which the result of the distortion will be rendered. The rendering will be made to the render target's `colorTexture0` texture object.

``strength`` (optional)
    The maximum displacement in pixels that will be applied to the source texture.

    The default value if none is specified is `10`.

``transform`` (optional)
    A 2x3 transformation matrix used to transform texture coordinates before a look-up is performed into the distortion texture. As per usual, this transformation matrix is stored in column major order ::

        transform = [x1, x2, y1, y2, t1, t2]
        // equivalent to matrix:
        //     [ x1 y1 t1 ]
        //     [ x2 y2 t2 ]

    This can be used to scale/shear/rotate/translate the texture look-ups with the inverse transform being applied to the displacement vectors obtained from the distortion texture.

    This transformation occurs in the normalized coordinate space of the textures. For example to rotate the distortion effect clockwise about the center of the source texture we could use a transformation matrix ::

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var transform = [cos, -sin, sin, cos, (1 - cos + sin) / 2, (1 - cos - sin) / 2];

    Since this is a transformation applied to the texture look-ups, should you wish to scale the distortion effect by `2` for instance, you would need to scale the texture look-ups by `0.5`.

This call will fail with `false` if the input texture or render targets are not well defined, or if the source of distortion texture are equal to the destination's colorTexture0, or if the destination does not have a colorTexture0.


.. index::
    pair: TextureEffects; applyGaussianBlur

`applyGaussianBlur`
-------------------

**Summary**

Apply a high quality Gaussian blur effect.

**Syntax** ::

    var success = effects.applyGaussianBlur({
        source : sourceTexture,
        blurTarget : blurRenderTarget,
        destination : renderTarget,
        blurRadius : 5,
    });

``source``
    The source :ref:`Texture <texture>` for the effect.

``blurTarget``
    The :ref:`RenderTarget <rendertarget>` object to which the intermediate result of the blur will be rendered. The rendering will be made to the render target's `colorTexture0` texture object.

    This render target's texture should have the same dimensions as the destination for best results.

``destination``
    The :ref:`RenderTarget <rendertarget>` object to which the result of the blur will be rendered. The rendering will be made to the render target's `colorTexture0` texture object.

``blurRadius`` (optional)
    Specify the blurring radius in pixels for the effect.

    Default value is `5`.

This call will fail with `false` if the input texture or render targets are not well defined, or if the source texture is equal to the blurTarget colorTexture0, or if the blurTarget is equal to the destination, or if the render targets do not have a colorTexture0.

Note that `destination.colorTexture0` is permitted to be equal to `source` so we can blur a render target to itself using the intermediate blurring render target ::

    effects.applyGaussianBlur({
        source : destination.colorTexture0,
        blurTarget : intermediateTarget,
        destination : destination
    });

This effect uses `18` texture look-ups in each blurring pass performing a horizontal blur to the intermediate target, and then a vertical blur to the destination.

.. index::
    pair: TextureEffects; applyFastBlur

`applyBloom`
------------

**Summary**

Apply a bloom effect.

**Syntax** ::

    var success = effects.applyBloom({
        source : sourceTexture,
        blurTarget1 : blurRenderTarget1,
        blurTarget2 : blurRenderTarget2,
        destination : renderTarget,
        blurRadius : 20,
        bloomThreshold : 0.65,
        thresholdCutoff : 3,
        bloomIntensity : 1.2,
        bloomSaturation : 1.2,
        originalIntensity : 1.0,
        originalSaturation : 1.0
    });

``source``
    The source :ref:`Texture <texture>` for the effect.

``blurTarget1``
    The first :ref:`RenderTarget <rendertarget>` object to which the intermediate result of the bloom will be rendered. The rendering will be made to the render target's `colorTexture0` texture object.

    This render target need not be the same size as the source, smaller dimensions give comparable results with less cost.

``blurTarget2``
    The second :ref:`RenderTarget <rendertarget>` object to which the intermediate result of the bloom will be rendered. The rendering will be made to the render target's `colorTexture0` texture object.

    This render target should be the same size as blurTarget1.

``destination``
    The :ref:`RenderTarget <rendertarget>` object to which the result of the bloom will be rendered. The rendering will be made to the render target's `colorTexture0` texture object.

``blurRadius`` (optional)
    Specifies the blurring radius in pixels for the effect's blur passes.

    Default value is `20`.

``bloomThreshold`` (optional)
    Specifies a luminance threshold to discard regions of the source not bright enough to be bloomed.

    This value should be given in the range `[0,1]`.

    Default value is `0.65`.

``thresholdCutoff`` (optional)
    Specifies the cutoff speed for how quickly the bloom effect dissipates below the threshold.

    This can take any value though the range of values that give noticeable differences is roughly `[-3,6]` with `-3` being no noticeable cutoff, and `6` being no noticeable difference from an instant cutoff.

``bloomIntensity`` (optional)
    Specifies a scaling factor to multiply the bloom effect with in merging step.

    This value should be positive.

    Default value is `1.2`.

``bloomSaturation`` (optional)
    Specifies a scaling factor for the saturation of the bloom effect in merging step.

    Default value is `1.2`.

``originalIntensity`` (optional)
    Specifies a scaling factor to multiply the source with in merging step.

    This value should be positive.

    Default value is `1.0`.

``originalSaturation`` (optional)
    Specifies a scaling factor for the saturation of the source in merging step.

    Default value is `1.0`.

This call will fail with `false` if the input texture or render targets are not well defined, or if the source texture is equal to blurTarget1's colorTexture0, or if blurTarget1 is equal to blurTarget2 or blurTarget1 is equal to destination or if any render target does not have a colorTexture0.

This effect first performs a threshold copy into blurTarget1, and then invokes the Gaussian blur rendering first into blurTarget2, and then back to blurTarget1. Finally the source, and blurTarget1 are merged together into the destination.

.. index::
    pair: TextureEffects; applyColorMatrix

`applyColorMatrix`
------------------

**Summary**

Apply a color matrix effect, transforming RGB color values in source texture by given matrix.

**Syntax** ::

    var success = effects.applyColorMatrix({
        source : sourceTexture,
        destination : renderTarget,
        colorMatrix : [ r1, r2, r3, g1, g2, g3, b1, b2, b3, addR, addG, addB ]
    });

``source``
    The source :ref:`Texture <texture>` for the effect.

``destination``
    The :ref:`RenderTarget <rendertarget>` object to which the result of the distortion will be rendered. The rendering will be made to the render target's `colorTexture0` texture object.

``colorMatrix``
    The 3x4 matrix used to transform RGB color values. This matrix is given as usual in column major order and is compatible with :ref:`Matrix43 <m43object>` objects and may be composed by multiplication. ::

    // [outR]   ( r1 g1 b1 addR )[inR]
    // [outG] = ( r2 g2 b2 addG )[inG]
    // [outB]   ( r3 g3 b3 addB )[inB]
    // [outA]   ( 0  0  0   1   )[inA]

This call will fail with `false` if the source, or destination parameters are not well defined, or the source texture is equal to the destination colorTexture0, or the destination does not have a colorTexture0.


.. index::
    pair: TextureEffects; grayScaleMatrix

`grayScaleMatrix`
-----------------

**Summary**

Create color matrix to transform colors into gray-scale.

**Syntax** ::

    var colorMatrix = effects.grayScaleMatrix();
    // or
    effects.grayScaleMatrix(colorMatrix);

``colorMatrix`` (optional)
    Specify a :ref:`Matrix43 <m43object>` object in which to store the color matrix. If unspecified a new matrix will be created.

This transformation maps colors to their luminance value.


.. index::
    pair: TextureEffects; sepiaMatrix

`sepiaMatrix`
-------------

**Summary**

Create color matrix to transform colors into sepia.

**Syntax** ::

    var colorMatrix = effects.sepiaMatrix();
    // or
    effects.sepiaMatrix(colorMatrix);

``colorMatrix`` (optional)
    Specify a :ref:`Matrix43 <m43object>` object in which to store the color matrix. If unspecified a new matrix will be created.


.. index::
    pair: TextureEffects; negativeMatrix

`negativeMatrix`
----------------

**Summary**

Create color matrix to transform colors into their negative.

**Syntax** ::

    var colorMatrix = effects.negativeMatrix();
    // or
    effects.negativeMatrix(colorMatrix);

``colorMatrix`` (optional)
    Specify a :ref:`Matrix43 <m43object>` object in which to store the color matrix. If unspecified a new matrix will be created.


.. index::
    pair: TextureEffects; saturationMatrix

`saturationMatrix`
------------------

**Summary**

Create color matrix to transform colors by scaling their saturation.

**Syntax** ::

    var colorMatrix = effects.saturationMatrix(saturationScale);
    // or
    effects.saturationMatrix(saturationScale, colorMatrix);

``saturationScale``
    The saturation scaling to compute color matrix.

    A scaling of `1` will create an identity mapping.

    A scaling of `0` will create a `grayScaleMatrix`

    A scaling of `-1` will map colors to their complements.

``colorMatrix`` (optional)
    Specify a :ref:`Matrix43 <m43object>` object in which to store the color matrix. If unspecified a new matrix will be created.

This transformation preserves color luminance. When scaling is positive the color hue will also be preserved, whilst for negative values the color hue will be rotated 180 degrees.


.. index::
    pair: TextureEffects; hueMatrix

`hueMatrix`
-----------

**Summary**

Create a color matrix to transform colors by rotation of their hue.

**Syntax** ::

    var colorMatrix = effects.hueMatrix(hueRotation);
    // or
    effects.hueMatrix(hueRotation, colorMatrix);

``hueRotation``
    The rotation in clockwise radians to apply to color hues.

    A normalized rotation of `0` will create an identity mapping.

    A normalized rotation of `Math.PI / 2` will map colors to their complements.

``colorMatrix`` (optional)
    Specify a :ref:`Matrix43 <m43object>` object in which to store the color matrix. If unspecified a new matrix will be created.

This transformation preserves color luminance and saturation.


.. index::
    pair: TextureEffects; brightnessMatrix

`brightnessMatrix`
------------------

**Summary**

Create a color matrix to transform colors by offsetting their brightness.

**Syntax** ::

    var colorMatrix = effects.brightnessMatrix(brightnessOffset);
    // or
    effects.brightnessMatrix(brightnessOffset, colorMatrix);

``brightnessOffset``
    The brightness offset as a normalized color value.

    An offset of `-1` will map colors to black.

    An offset of `0` will create an identity mapping.

    An offset of `1` will map colors to white.

``colorMatrix`` (optional)
    Specify a :ref:`Matrix43 <m43object>` object in which to store the color matrix. If unspecified a new matrix will be created.

This transformation preserves color hue.


.. index::
    pair: TextureEffects; additiveMatrix

.. _textureeffects_additivematrix:

`additiveMatrix`
----------------

**Summary**

Create a color matrix to transform colors by offsetting their red, green or blue values.

**Syntax** ::

    var colorMatrix = effects.additiveMatrix(colorOffset);
    // or
    effects.additiveMatrix(colorOffset, colorMatrix);

``colorOffset``
    A JavaScript array of length 3. With red, green and blue elements as offsets:

    An offset of `-1` will completely remove the color.

    An offset of `0` will create an identity mapping.

    An offset of `1` will map the color to its full value.
    For example, a ``colorOffset`` value of `[-1, 1, -1]` will result in a matrix which always outputs a green color `[0, 1, 0]` (after clamping to the range `[0, 1]`).

``colorMatrix`` (optional)
    Specify a :ref:`Matrix43 <m43object>` object in which to store the color matrix. If unspecified a new matrix will be created.


.. index::
    pair: TextureEffects; contrastMatrix

`contrastMatrix`
----------------

**Summary**

Create a color matrix to transform colors by scaling their contrast.

**Syntax** ::

    var colorMatrix = effects.contrastMatrix(contrastScale);
    // or
    effects.contrastMatrix(contrastScale, colorMatrix);

``contrastScale``
    The contrast scaling to create color matrix with.

    A scaling of `0` will map colors to gray.

    A scaling of `1` will create an identity mapping.

``colorMatrix`` (optional)
    Specify a :ref:`Matrix43 <m43object>` object in which to store the color matrix. If unspecified a new matrix will be created.

This transformation preserves color hue.

