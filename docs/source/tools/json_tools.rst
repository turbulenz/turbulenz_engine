.. index::
    pair: Tools; json2json

=========
json2json
=========

-----
Usage
-----

**Syntax** ::

    json2json [options] source.json [ ... ] target.json

Merge JSON asset files.

-------
Options
-------

.. program:: json2json

.. cmdoption:: --version

    Show program's version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --metrics, -m

    Generate asset metrics.

-------
Example
-------

::

    json2json -v -m source1.json source2.json target.json

.. index::
    pair: Tools; json2tar

========
json2tar
========

-----
Usage
-----

**Syntax** ::

    json2tar [options] -i input.json -o output.tar

Generate a TAR file for binary assets referenced from a JSON asset.

-------
Options
-------

.. program:: json2tar

.. cmdoption:: --version

    Show program's version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --input=INPUT, -i INPUT

    Input JSON file to process.

.. cmdoption:: --output=OUTPUT, -o OUPUT

    Output TAR file to generate.

.. cmdoption:: --assets=PATH, -a PATH

    Path of the asset root containing all assets referenced by the JSON file.

.. cmdoption:: -M

    Output dependencies.

.. cmdoption:: --MF=DEPENDENCY_FILE

    Dependencies output to file.

-------
Example
-------

::

    json2tar -v -i samples/models/duck.dae.json -o samples/models/duck.tar -a assets

.. index::
    pair: Tools; json2stats

==========
json2stats
==========

-----
Usage
-----

**Syntax** ::

    json2stats [options] asset.json [ ... ]

Report metrics on JSON asset files.

Metrics are:

* :strong:`keys`: number of bytes used by keys.
* :strong:`punctuation (punctn)`: number of bytes used by JSON punctuation, including '[ ] { } " , :'.
* :strong:`values`: number of bytes used by values. For uncompact JSON files this will also include the white space.
* :strong:`k%`: percentage of total size used by the keys.
* :strong:`p%`: percentage of total size used by the punctuation.
* :strong:`v%`: percentage of total size used by the values (and white space).
* :strong:`# keys`: the total number of keys.
* :strong:`unique`: the number of unique keys.
* :strong:`total`: the total asset size in byte.
* :strong:`gzip`: the asset size after gzip compression.
* :strong:`ratio`: the gzip size as a percentage of the uncompressed total size.

-------
Options
-------

.. program:: json2stats

.. cmdoption:: --version

    Show program's version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --metrics, -m

    Output asset metrics

.. cmdoption:: --header, -H

    Generate column header

This tool current assumes the JSON asset is compact with no additional white space.

-------
Example
-------

::

    json2stats -v -H samples/models/*.json

Outputs::

    +-------------------------+----------------------+---------------+------------------------+
    |    keys: punctn: values |     k%:    p%:    v% | # keys:unique |   total:   gzip: ratio |
    +-------------------------+----------------------+---------------+------------------------+
    |    6132:  94002: 441845 |   1.1%: 17.3%: 81.5% |    658:   177 |  541979: 123824: 22.8% | samples/models/Seymour.dae.json
    |    6670:  94504: 442359 |   1.2%: 17.4%: 81.4% |    730:   183 |  543533: 123805: 22.8% | samples/models/Seymour_anim2.dae.json
    |    5266: 113976: 611462 |   0.7%: 15.6%: 83.7% |    563:   177 |  730704: 160746: 22.0% | samples/models/Seymour_anim2_rot90_anim_only.dae.json
    |     436:    737:    662 |  23.8%: 40.2%: 36.1% |     68:    43 |    1835:    604: 32.9% | samples/models/cube.dae.json
    |    2374: 498398:3210566 |   0.1%: 13.4%: 86.5% |    316:    75 | 3711338: 761215: 20.5% | samples/models/diningroom.dae.json
    |     538:  56067: 277087 |   0.2%: 16.8%: 83.0% |     70:    55 |  333692: 102407: 30.7% | samples/models/duck.dae.json
    |     409:   7958:  33016 |   1.0%: 19.2%: 79.8% |     55:    42 |   41383:   8470: 20.5% | samples/models/sphere.dae.json
    +-------------------------+----------------------+---------------+------------------------+
    |   21825: 865642:5016997 |   0.4%: 14.7%: 85.0% |   2460:   752 | 5904464:1281071: 21.7% | cumulative total and global ratio
    +-------------------------+----------------------+---------------+------------------------+

.. index::
    pair: Tools; xml2json

========
xml2json
========

-----
Usage
-----

**Syntax** ::

    xml2json [options] -i input.xml -o output.json

Convert XML assets into a structured JSON asset.

-------
Options
-------

.. program:: xml2json

.. cmdoption:: --version

    Show program's version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --metrics, -m

    Output asset metrics

.. cmdoption:: --input=INPUT, -i INPUT

    Input XML file to process

.. cmdoption:: --output=OUTPUT, -o OUTPUT

    Output JSON file to process

------------------------
Asset Generation Options
------------------------

.. cmdoption:: --json-indent=SIZE, -j SIZE

    JSON output pretty printing indent size, defaults to 0

.. cmdoption:: --namespace, -n

    Maintain XML xmlns namespace in JSON asset keys.

.. cmdoption:: --convert-types, -c

    Attempt to convert values to ints, floats and lists.

-------
Example
-------

::

    xml2json -v -j 2 -c -i asset.xml -o asset.json


.. index::
    pair: Tools; json2txt

========
json2txt
========

-----
Usage
-----

**Syntax** ::

    json2txt [options] -i input.json [-o output.html]

Generate plain text or html from a JSON asset.

-------
Options
-------

.. program:: json2txt

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --version

    Show program's version number and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --input=INPUT, -i INPUT

    Input JSON file to process.

.. cmdoption:: --output=OUTPUT, -o OUTPUT

    Output file to generate (optional). If not specified, output is
    displayed on the terminal.  If specified, flags --html or --txt
    can be used (by default will output as plain text).

.. cmdoption:: --path=PATH, -p PATH

    Path of the required node to output in the JSON asset tree
    structure. Support for wildcards enabled.

.. cmdoption:: --listcull=NUMBER, -l NUMBER

    Culling parameter to specify the maximum length of the lists to
    be displayed. NUMBER=0 displays all contents (defaults to 3).

.. cmdoption:: --dictcull=NUMBER, -c NUMBER

    Culling parameter to specify the maximum length of the dictionaries
    to be displayed. NUMBER=0 displays all contents (defaults to 3).

.. cmdoption:: --depth=NUMBER, -d NUMBER

    Parameter of the dictionary and list rendering depth (defaults to 2).

.. cmdoption:: --html

    Output data in HTML format.

.. cmdoption:: --txt

    Output in plain text format (default)

.. cmdoption:: --color

    Enable colored text output.

-------
Example
-------

::

    json2txt -i samples/models/duck.dae.json -o duck.txt --txt
    json2txt -i samples/models/duck.dae.json -p geometries
    json2txt -i samples/models/duck.dae.json -p geom*/*
    json2txt -i samples/models/duck.dae.json -p geom*/cu*/surf*/lam* -c 0
