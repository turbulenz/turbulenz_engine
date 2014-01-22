.. highlight:: javascript
.. _games_development:

-----------------
Games Development
-----------------

This section list some tips and techniques for games development.

Improving Download Speed
========================

* Most assets are gzip compressed so look at the compressed file sizes in the network tab, rather than raw file size.
* Consider using DDS, which will be compressed, rather than PNG for textures. Typically they will be faster to render as well as smaller.
* Often music tracks appear as a large percentage of download size so consider the length and sample rate they need to be. Ogg and MP3 files are already compressed and are not gzip compressed.
* There is a maximum number of concurrent request, often 6, that a browser will allow. If a game is attempting to down load hundreds of files then this can be limiting factor. Building an archive (e.g. tar) file is one approach to solving this.
* Make sure the loading code is being run at a high enough frequency to process the assets as soon as they are ready, e.g. 60Hz.
* Look to defer loading assets not required for the initial part of the game.

See also :ref:`asset serving <considerations-for-asset-serving>`.

.. _multiplayer_games:

Developing Multiplayer Networked Games
======================================

The :ref:`MultiPlayerSessionManager <multiplayersessionmanager>` implements support for creating and joining multiplayer networked games.
The implementation of :ref:`MultiPlayerSession <multiplayersession>` uses WebSockets which use TCP.
As TCP is a guaranteed, in-order protocol this can result in greater spikes in latency than UDP when dropped packets need to be resent.
These peaks in latency will depend on the location of the user and their connection but games need to cope with periodic >1 second spikes in latency.

The amount of data sent per second will effect the likelihood of dropped packets, which will in turn cause the spikes.
A sensible target for data transfer is <50 KB/sec.
While some browsers will compress the data sent over WebSockets not all do so.
Attempting to minimize the data size will help you reach a sensible data transfer target.
Here are a few example techniques:

    * Only send delta information where possible.
      Try to avoid sending the same data if it hasn't changed between messages.
    * Encode numbers with as few significant figures as possible.
      The default JSON stringify function will encode complete floating point numbers, which is noticeable when you have rounding errors in your calculations e.g. 1.00000000001
      Equally, if the complete floating point accuracy is not required for the data consider sending 2.3 instead of 2.3846758439
    * Avoid using long object property names or create a string lookup table.
      When processing the data ready to send, you could use a string lookup table to avoid sending the string in multiple places.
      This string lookup table could be generated at runtime on each client or sent with the message.

Development Tools
-----------------

Chrome's multi-process architecture allows many independent instances of it to be run concurrently on one machine.
This allows a developer to use the local server with multiple instances of Chrome to rapidly test changes.
To run independent instances use a new tab rather than the ‘Duplicate’ option on the tab.
Running on a multi-core machine can help keep them running at full speed in parallel.

Chrome's Developer Tools have a *WebSockets* view in the Network tab that can be used to view the data transferred in multiplayer sessions. The sizes reported are the uncompressed sizes.

The :ref:`NetworkLatencySimulator <networklatencysimulator>` object can be used to help simulate delays and grouping of messages that happen over remote connections.
The NetworkLatencySimulator can be configured to have independent behaviors for different builds of the game. e.g. to simulate what happens if a client with a slower connection joins an existing game session with a good connection.
This behavior is useful for local testing, however it should not replace testing on the Hub.
There are many 3rd party network simulators that may be able to operate at a lower level, depending on your operating system.

.. _testing_multiple_user_accouts:

Testing Multiple User Accounts
==============================

At some point during your development you will likely require multiple Turbulenz user accounts to test certain features such as multiplayer. The Turbulenz sites require users to sign-in to access some features of the site and for this reason you may need to be signed-in to multiple accounts at the same time during testing.

Some browsers provide means to create different user profiles. Using profiles will allow you to create different users with different settings for that browser. Our sites: local, hub.turbulenz.com and turbulenz.com support this method.

To login as multiple users simultaneously either:

- Set up multiple users in Chrome - http://support.google.com/chrome/bin/answer.py?hl=en&answer=2364824
- Set up multiple profiles in Firefox - http://support.mozilla.org/en-US/kb/profile-manager-create-and-remove-firefox-profiles
- Use different browsers for each user.
- Use private browsing or "Incognito mode" windows for each user (requires logging in again each time).

Handling Browser Usage
======================

In the browser it is very easy for users to quickly navigate between pages, switch tabs and close pages abrubtly.
Games like other applications need to acknowledge this kind of usage applied to games attempt to manage it as cleanly as possible.

Shutting Down Cleanly
---------------------

When a page is about to be unloaded the TurbulenzEngine will call the :ref:`unload <turbulenzengine_unload>` function.
During this function the game should do its best to stop and avoid crashes caused by using APIs that in the process of being shutdown.

The Turbulenz engine also provides an :ref:`isUnloading <turbulenzengine_isunloading>` call that allows code to check if
it's in the middle of a shutdown and hence whether or not to call certain functions.
This is used to tidy up callbacks from requests making sure they don't return after shutdown and call libraries that have
been destroyed.

Here is a checklist of actions a game **should do** when unloading

:Clear intervals and timeouts:
  One of the biggest causes of crashes on game exit is intervals and timeouts being
  called after the game state has been destroyed and hence invalid. This can purely be down to the browser scheduling callbacks.
  TurbulenzEngine attempts to protect against this by checking the *isUnloading* property before calling the interval.
  Using :ref:`clearInterval <tz_clearinterval>` and :ref:`clearTimeout <tz_cleartimeout>` should be the first thing a game
  does when shutting down, especially if using multiple intervals/timeouts.

:Show/unlock the mouse:
  If the game hides the mouse to replace with a custom cursor, it should attempt to display the
  mouse again. Equally if it is locked it should attempt to unlock it to avoid any confusion for the user.

:Disable fullscreen:
  If the game has requested fullscreen it should also disable it when unloading. Usually the player
  will have to have exited fullscreen before they navigate away or close the browser, but this should be done as a
  precaution.

:Release references to game data:
  It should release any references to memory in use using the techniques described in
  the :ref:`Initializing and Destroying <javascript_development_initializing_and_destroying>` section of the JavaScript
  development guide. Leaving large amounts of object data referenced can result in it taking up memory when the game has
  been closed. Be careful when using global variables to make sure this doesn't negatively impact the site.

:Unregister any callbacks:
  This applies mainly to input, where handlers that are listening for input can interfere
  with input after the game has stopped. Ideally a game should unregister any callbacks and at minimum stop processing
  the responses when the callbacks are flushed. See :ref:`removeEventListener<inputdevice-removeeventlistener>`.

Here is a checklist of actions a game **should NOT do** when unloading:

:Attempt to prompt the user for input:
  At this stage the page could already be unloading so halting the page could
  force the browser to flag the tab as unresponsive. It is usually too late to query
  information at this point.
