.. _FontManager:

.. index::
    single: FontManager

.. highlight:: javascript

----------------------
The FontManager Object
----------------------

Provides support for bitmap fonts.

This object supports loading of bitmap fonts with either fixed of variable character spacing and dimensions.

Only `Bitmap Font Generator <http://www.angelcode.com/products/bmfont/>`_ `.fnt` files are supported.
They have to be converted to JSON by the tool :ref:`bmfont2json <bmfont2json>`.
A `.fnt` file contains references to the image files the font glyphs were rendered to,
those image files need to be on the :ref:`mapping table <creating-a-mapping-table>` so they can be loaded.

.. note:: At the moment only a single image file per font is supported.

.. When asked to load a font by name this object first looks for the bitmap file by appending ".dds" to the requested name,
   if the bitmap file is present it then looks for a file with the extension ".fontdat" for the glyph information,
   the glyph information is encoded as JSON,
   if this file is missing the manager assumes a fixed character grid on the bitmap texture of 16x16.

**Required scripts**

The FontManager object requires::

    /*{{ javascript("jslib/fontmanager.js") }}*/

Constructor
===========

.. index::
    pair: FontManager; create

.. _fontmanager_create:

`create`
--------

**Summary**

**Syntax** ::

    var fontManager = FontManager.create(graphicsDevice, requestHandler);

``graphicsDevice``
    The GraphicsDevice object to be used to create and load the textures.

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.


Methods
=======


.. index::
    pair: FontManager; load

.. _fontmanager_load:

`load`
------

**Summary**

Creates a :ref:`Font <font>` from a loaded `.fnt` file and its associated image files.

**Syntax** ::

    // request font to be loaded
    var onload = function onloadFn(font) {};
    fontManager.load(path, onload);

    // use font when ready
    var font = fontManager.get(path);
    var textParameters = {
            rect: [x, y, width, height],
            alignment: windowdef.textalign,
            scale: windowdef.textscale,
            spacing: windowdef.textspacing
        };
    font.drawTextRect(text, textParameters);

``path``
    Relative path to the font file.

``onload`` (Optional)
    The callback function to call once the :ref:`Font <font>` has loaded.
    This function is called asynchronously.

The font file will be loaded asynchronously.
This method returns a :ref:`Font <font>` object,
if the font file has already been loaded it returns the requested font,
otherwise it returns the default font.
The method :ref:`getNumPendingFonts <getNumPendingFonts>` can be used to check
how many of the fonts requested to be loaded are still pending.
The callback function is called with the loaded :ref:`Font <font>` as an argument.


.. index::
    pair: FontManager; get

`get`
-----

**Summary**

Returns the loaded font stored with the given path or name.

**Syntax** ::

    var font = fontManager.get(path);
    var textParameters = {
            rect: [x, y, width, height],
            alignment: windowdef.textalign,
            scale: windowdef.textscale,
            spacing: windowdef.textspacing
        };
    font.drawTextRect(text, textParameters);

``path``
    The name or path of the font to get.

This method returns a :ref:`Font <font>` object,
if the font has already been loaded it returns the requested font,
otherwise it returns the default font.
The method :ref:`getNumPendingFonts <getNumPendingFonts>` can be used to check
how many of the fonts requested to be loaded are still pending.


.. index::
    pair: FontManager; map

`map`
-----

**Summary**

Alias one font to another name.

**Syntax** ::

    fontManager.map(alias, name);

``name``
    The name to be mapped.

``alias``
    The new alias for ``name``.


.. index::
    pair: FontManager; remove

`remove`
--------

**Summary**

Removes a font from the manager.

**Syntax** ::

    fontManager.remove();

.. _getNumPendingFonts:

.. index::
    pair: FontManager; getNumPendingFonts

`getNumPendingFonts`
--------------------

**Summary**

Get the number of fonts pending load.

**Syntax** ::

    var numFontsToBeLoaded = fontManager.getNumPendingFonts();


.. index::
    pair: FontManager; isFontLoaded

`isFontLoaded`
---------------

**Summary**

Check if a font is not pending load.

**Syntax** ::

    fontManager.isFontLoaded(name);

``name``
    The name used to load the font (or the remapped name).

Returns true if a font has loaded, false otherwise.


.. index::
    pair: FontManager; isFontMissing

`isFontMissing`
---------------

**Summary**

Check if a font is missing.

**Syntax** ::

    fontManager.isFontMissing(name);

``name``
    The name used to load the font (or the remapped name).

Returns true if the font has not been requested to load, false otherwise.


.. index::
    pair: FontManager; setPathRemapping

`setPathRemapping`
------------------

**Summary**

Enables remapping of loading paths.

The remapping only affects the loading URLs.

**Syntax** ::

    fontManager.setPathRemapping(remappingTable, globalPrefix);

``mappingTable``
    A remapping table that can be used to redirect specific paths.

``prefix``
    A string that will be appended to all paths, useful for global redirections.


.. index::
    pair: FontManager; calculateTextDimensions

.. _fontmanager_calculatetextdimensions:

`calculateTextDimensions`
-------------------------

**Summary**

Calculate text dimensions of a block of text and a font.

**Syntax** ::

    var dimensions = fontManager.calculateTextDimensions(name, text, scale, spacing);
    var width = dimensions.width;
    var height = dimensions.height;
    var linesWidth = dimensions.linesWidth;
    var numGlyphs = dimensions.numGlyphs;
    var glyphCounts = dimensions.glyphCounts;

``name``
    The name used to load the font (or the remapped name).

``text``
    Text to calculate dimensions for.

``scale``
    Text scale.

``spacing``
    Extra spacing between characters (in pixels).

Returns an object with properties:

``width`` and ``height``
    The dimensions of the block of text (in pixels).

``linesWidth``
    An array for the width (in pixels) of each line of text in ``text``

``numGlyphs``
    The number of glyphs in the block of text.

``glyphCounts``
    A map from page numbers to glyph counts, for the given string.
    This is generally only used by the `drawTextRect` function, in
    particular for fonts that require multiple texture pages.  It can
    be passed into `drawTextRect` via the parameters object to avoid
    recalculation.

.. index::
    pair: FontManager; destroy

`destroy`
---------

**Summary**

Releases the FontManager object and all the resources it allocated.

**Syntax** ::

    fontManager.destroy();


Properties
==========

.. index::
    pair: FontManager; version

`version`
---------

**Summary**

The version number of the FontManager implementation.

**Syntax** ::

    var versionNumber = fontManager.version;


.. _font:

.. index::
    single: Font

---------------
The Font Object
---------------

Contains information about a bitmap font and provides screen size calculations and geometry generation from given strings.


Methods
=======

.. index::
    pair: Font; calculateTextDimensions

.. _font_calculatetextdimensions:

`calculateTextDimensions`
-------------------------

**Summary**

Calculate text dimensions of a block of text.

**Syntax** ::

    var dimensions = font.calculateTextDimensions(text, scale, spacing, dimensions);
    var width = dimensions.width;
    var height = dimensions.height;
    var linesWidth = dimensions.linesWidth;
    var numGlyphs = dimensions.numGlyphs;
    var glyphCounts = dimensions.glyphCounts;

``text``
    Text to calculate dimensions for.

``scale``
    Text scale.

``spacing``
    Extra spacing between characters (in pixels).

``dimensions``
    (Optional) A dimensions object to overwrite, so avoid creation of
    a new one.

Returns an object with properties:

``width`` and ``height``
    The dimensions of the block of text (in pixels).

``linesWidth``
    An array for the width (in pixels) of each line of text in ``text``

``numGlyphs``
    The number of glyphs in the block of text.

``glyphCounts``
    A map from page numbers to glyph counts, for the given string.
    This is generally only used by the `drawTextRect` function, in
    particular for fonts that require multiple texture pages.  It can
    be passed into `drawTextRect` via the parameters object to avoid
    recalculation.


.. _font_generatetextvertices:

.. index::
    pair: Font; generatePageTextVertices

.. _font_generatepagetextvertices:

`generatePageTextVertices`
--------------------------

**Modified SDK 0.28.0**

Replaces function previously called generateTextVertices

**Summary**

For a given bit of text, generates the vertices corresponding to a
specific texture page.  This method is used internally by
:ref:`drawTextRect <font_drawtextrect>` to generate the vertices to be
drawn.

**Syntax** ::

    var textParameters = {
            rect: [x, y, width, height],
            alignment: windowdef.textalign,
            scale: windowdef.textscale,
            spacing: windowdef.textspacing
        };
    if (dimensions)
    {
        textParameters.dimensions = dimensions;
    }
    var vertices = font.generatePageTextVertices(text, textParameters, 0);
    if (vertices)
    {
        var numVertices = (vertices.length / 4);
        vertexBuffer.setData(vertices, 0, numVertices);
    }

``text``
    Text to generate vertices for.

``params``
    Text drawing parameters.

    ``rect``
        Array of numbers describing the screen rectangle the text will be rendered into.
        The width is only used for horizontal alignment of the text.
        Currently, the height is always ignored.

    ``alignment``
        - A value of `0` left-aligns the text (``rect`` width is ignored).
        - A value of `1` center-aligns the text (text is horizontally centered using the ``rect`` width).
        - A value of `2` right-aligns the text (text is right-aligned using the ``rect`` width).

        Defaults to left-aligned.

    ``scale``
        Text scale. Defaults to `1`.

    ``spacing``
        Extra spacing between characters. Defaults to `0`.

    ``dimensions``
        (Optional) A dimensions object to re-use, to avoid creating a
        new one.  If set, this should have been calculated for the
        given text via `calculateTextDimensions`.

``pageIdx``
    The index of the texture page to generate indices for.

Returns an array of numbers, 4 numbers per vertex: X, Y, U, V.


.. _font_drawtextvertices:

.. index::
    pair: Font; drawTextVertices

`drawTextVertices`
------------------

**Summary**

Draws the given text vertices for a specific texture page.
This method is used internally by :ref:`drawTextRect <font_drawtextrect>` to draw the vertices generated by
:ref:`generateTextVertices <font_generatetextvertices>`.

**Syntax** ::

    var textParameters = {
            rect: [x, y, width, height],
            alignment: windowdef.textalign,
            scale: windowdef.textscale,
            spacing: windowdef.textspacing,
        };
    var vertices = font.generatePageTextVertices(text, textParameters, 0);
    if (vertices)
    {
        var numValues = vertices.length;
        var n;
        for (n = 0; n < numValues; n += 4)
        {
            var p = transformPoint(vertices[n], vertices[n + 1]);
            vertices[n] = p[0];
            vertices[n + 1] = p[1];
        }

        font.drawTextVertices(vertices, 0, reuse);
    }

``vertices``
    Vertices to be drawn.

``pageIdx``
    The index of the texture page that the vertices correspond to.

``reuse``
    (Optional) boolean value to determine if the ``vertices`` object should be reused for subsequent calls to
    :ref:`generateTextVertices <font_generatetextvertices>`.


.. _font_drawtextrect:

.. index::
    pair: Font; drawTextRect

`drawTextRect`
--------------

**Summary**

Draws text.

**Syntax** ::

    graphicsDevice.setTechnique(textTechnique);

    var textParameters = {
            rect: [x, y, width, height],
            alignment: windowdef.textalign,
            scale: windowdef.textscale,
            spacing: windowdef.textspacing
        };
    if (dimensions)
    {
        textParameters.dimensions = dimensions;
    }
    font.drawTextRect(text, textParameters);

``text``
    Text to draw.
    This can be wrapped using the newline character ``\n``.

``params``
    Text drawing parameters.

    ``rect``
        Array of numbers describing the screen rectangle the text will be rendered into.
        The width is only used for horizontal alignment of the text.
        Currently, the height is always ignored.
        No clipping will occur if, after alignment and scaling, the output text is larger than the rectangle defined by ``rect``.

    ``alignment``
        - A value of `0` left-aligns the text (``rect`` width is ignored).
        - A value of `1` center-aligns the text (text is horizontally centered using the ``rect`` width).
        - A value of `2` right-aligns the text (text is right-aligned using the ``rect`` width).

        Defaults to left-aligned.

    ``scale``
        Text scale. Defaults to `1`.

    ``spacing``
        Extra spacing between characters. Defaults to `0`.

    ``dimensions``
        (Optional).  A dimensions object, returned by
        calculateTextDimensions, to save internal re-calculation of
        various properties of the text.


Properties
==========

.. index::
    pair: Font; version

`version`
---------

**Summary**

The version number of the Font implementation.

**Syntax** ::

    var versionNumber = font.version;
