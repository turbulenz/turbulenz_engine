.. index::
    pair: Tools; disassembler

.. _disassembler:

============
Disassembler
============

-----
Usage
-----

**Syntax** ::

    http://x.x.x.x:8070/disassemble/game/asset.json

Disassembles and displays JSON asset files, with a simple navigation in the asset tree and parameterizable depth, and width of dictionaries and lists.

The rendered JSON tree has links, allowing to expand or collapse certain branches of the tree.

Where other JSON assets are referenced in the tree, they are linked and can be disassembled as well just by clicking on the link.

-------
Options
-------

.. program:: json2json

* **DEPTH**
	Parameter controlling the depth of the tree to render (default=2). The branches below the specified depth will be displayed as collapsed, with an option to expand them individually.
* **LIST**
	Parameter to control the list culling (default=5).
* **DICT**
	Parameter to control dictionary culling (default=5).
* **Reset**
