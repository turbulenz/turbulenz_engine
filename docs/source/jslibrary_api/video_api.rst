.. index::
    single: Video

.. highlight:: javascript

.. _video:

----------------
The Video Object
----------------

A Video object provides video-only playback.

The current playing video frame can be :ref:`set as pixel data <texture_setdata>`
on a :ref:`Texture <texture>` object.
The framerate of a video may be lower than the framerate of the game so it is recomended to check if the current
playback possition has changed before setting it to a texture, for example: ::

    var currentVideoPosition = video.tell;
    if (currentVideoPosition &&
        lastUpdateVideoPosition !== currentVideoPosition)
    {
        lastUpdateVideoPosition = currentVideoPosition;
        texture.setData(video);
    }

A video object should always be destroyed when no longer needed, for example: ::

    function cutSceneEnd()
    {
        if (video)
        {
            video.destroy();
            video = null;
        }
    };

Constructor
===========

A Video object can be constructed with :ref:`GraphicsDevice.createVideo <graphicsdevice_createvideo>`.

Methods
=======

.. index::
    pair: Video; play

`play`
------

**Summary**

Play the given video.

**Syntax** ::

    video.play(position);

``position`` (Optional)
    The position in seconds where to start playing.


.. index::
    pair: Video; stop

`stop`
------

**Summary**

Stop the video playback.
If you pause you have to resume it before stopping.

**Syntax** ::

    video.stop();

Returns true if the video was playing, false otherwise.


.. index::
    pair: Video; pause

`pause`
-------

**Summary**

Pause the video playback.

**Syntax** ::

    video.pause();

Returns true if the video was playing, false otherwise.


.. index::
    pair: Video; resume

`resume`
--------

**Summary**

Resume the video playback.

**Syntax** ::

    video.resume(position);

``position`` (Optional)
    The position in seconds where to resume playing.

Returns true if the video was paused, false otherwise.

.. index::
    pair: Video; rewind

`rewind`
--------

**Summary**

Rewind the playback position to the start of the video.

**Syntax** ::

    video.rewind();

Returns true if the playback position was not already at the start of the video, false otherwise.


.. index::
    pair: Video; destroy

`destroy`
---------

**Summary**

Releases the Video; the object will be invalid after the method is called.

**Syntax** ::

    video.destroy();


Properties
==========

.. index::
    pair: Video; looping

`looping`
---------

**Summary**

True if the video should start playing again from the start when reaching the end,
false if the video should stop when reaching the end.

**Syntax** ::

    if (video.looping)
    {
    }

.. note:: Read Only


.. index::
    pair: Video; playing

`playing`
---------

**Summary**

True if the video is playing the video right now, false otherwise.

**Syntax** ::

    if (video.playing)
    {
    }

.. note:: Read Only


.. index::
    pair: Video; paused

`paused`
--------

**Summary**

True if the video has been paused, false otherwise.

**Syntax** ::

    if (video.paused)
    {
    }

.. note:: Read Only


.. index::
    pair: Video; tell

`tell`
------

**Summary**

The current playback position in seconds, zero if playback has not started.

**Syntax** ::

    var currentPlaybackPosition = video.tell;

.. note:: Read Only
