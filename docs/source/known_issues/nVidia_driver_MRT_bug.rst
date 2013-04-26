.. _nVidia_driver_MRT_bug:

----------------------------------------
nVidia Driver -  Multiple Render Targets
----------------------------------------

.. highlight:: javascript

The nVidia drivers (version 8.17.12.7061 - 8.17.12.7533) contain an OpenGL bug that causes multiple render targets to render the output for the first target to all target textures.
nVidia have now fixed this bug in the latest driver download on their website.
The current work around for shaders generated with ``cgfx2json`` is to reorder any writes to ``gl_FragData`` so they are in order.

Example
=======

This is the result of ``cgfx2json`` when run on a multiple render targets shader::

    {
        "version": 1,
        "name": "rendertarget.cgfx",
        "parameters": { },
        "techniques": {
            "rendertarget": [
                {
                    "semantics": [
                        "POSITION"
                    ]
                    "states": {
                        "DepthTestEnable": false
                        "DepthMask": true
                        "CullFaceEnable": false
                        "BlendEnable": false
                    }
                    "programs": [
                        "vp_rendertarget"
                        "fp_rendertarget"
                    ]
                }
            ]
        }
        "programs": {
            "fp_rendertarget": {
                "type": "fragment"
                "code": "#extension GL_ARB_draw_buffers:enable #ifdef GL_ES precision mediump float;precision mediump int; #endif void main() {gl_FragData[1]=vec4(0.0,1.0,0.0,1.0);gl_FragData[2]=vec4(0.0,0.0,1.0,1.0);gl_FragData[3]=vec4(1.0,1.0,1.0,1.0);gl_FragData[0]=vec4(1.0,0.0,0.0,1.0);}"
            }
            "vp_rendertarget": {
                "type": "vertex"
                "code": "#ifdef GL_ES precision mediump float;precision mediump int; #endif attribute vec4 ATTR0; struct VP_RENDERTARGET_OUT{vec4 _Position;};void main() {VP_RENDERTARGET_OUT _OUT;_OUT._Position=vec4(ATTR0.x,ATTR0.y,0.0,1.0);gl_Position=_OUT._Position;}"
            }
        }
    }

To fix this shader for nVidia driver 8.17.12.7533 you should do the following:

Take the ``programs.fp_rendertarget.code`` string::

    #extension GL_ARB_draw_buffers:enable #ifdef GL_ES precision mediump float;precision mediump int; #endif void main() {gl_FragData[1]=vec4(0.0,1.0,0.0,1.0);gl_FragData[2]=vec4(0.0,0.0,1.0,1.0);gl_FragData[3]=vec4(1.0,1.0,1.0,1.0);gl_FragData[0]=vec4(1.0,0.0,0.0,1.0);}

and expand it::

    ...
    void main() {
        gl_FragData[1]=vec4(0.0,1.0,0.0,1.0);
        gl_FragData[2]=vec4(0.0,0.0,1.0,1.0);
        gl_FragData[3]=vec4(1.0,1.0,1.0,1.0);
        gl_FragData[0]=vec4(1.0,0.0,0.0,1.0);
    }

Notice that the assignments to ``gl_FragData`` are out of order.
The nVidia driver fails to handle this out of order assignment correctly.
We can alter the code manually reordering the ``gl_FragData`` so that it is written to sequentially::

    ...
    void main() {
        gl_FragData[0]=vec4(1.0,0.0,0.0,1.0);
        gl_FragData[1]=vec4(0.0,1.0,0.0,1.0);
        gl_FragData[2]=vec4(0.0,0.0,1.0,1.0);
        gl_FragData[3]=vec4(1.0,1.0,1.0,1.0);
    }

Then manually compact it::

    #extension GL_ARB_draw_buffers:enable #ifdef GL_ES precision mediump float;precision mediump int; #endif void main() {gl_FragData[0]=vec4(1.0,0.0,0.0,1.0);gl_FragData[1]=vec4(0.0,1.0,0.0,1.0);gl_FragData[2]=vec4(0.0,0.0,1.0,1.0);gl_FragData[3]=vec4(1.0,1.0,1.0,1.0);}

and copy it back into the JSON file.
The nVidia driver bug should no longer appear.

.. NOTE:: You will have to do this every time that the shaders are rebuilt.
