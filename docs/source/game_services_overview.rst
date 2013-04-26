.. _turbulenz_game_services:

=======================
Turbulenz Game Services
=======================

The Turbulenz Game Services allow games to interact with the live
services provided by the Turbulenz game site.  The services can be
used via the web-based Turbulenz Services API or through the Turbulenz
Services JavaScript Library (Included in jslib).

Turbulenz Services JavaScript Library
=====================================

The Turbulenz Services Library is a set of JavaScript objects for
communicating with the Turbulenz Services API.  AJAX calls are used to
communicate with Turbulenz Services.  No prior understanding of AJAX
is required to make use of these services.  Simply target the
interface provided by the JavaScript library.

.. NOTE::

    To use any of these services, the game must be run on one of:
    Turbulenz local development server, Turbulenz Hub or Turbulenz
    Game Site.  These services are not available when games are run
    directly from the file system.

.. _services_saving:

Saving and loading games
------------------------

Turbulenz Services allow games to save a player's progress.  This data
is saved on remote servers, which means the player can login later
from a different location and continue their game.  The space
available is measured per user, per game and can also be used to save
user-specified settings.

For information about implementing saving and loading, see the
:ref:`UserDataManager <userdatamanager>`.  Here are a few hints and
tips when using the UserDataManager:

- Save games should be split into sections to increase download and
  upload speeds.
- Easy to use key-value system which allows you to save only the
  differences between each save state, in turn saving memory.
- A player's user data represents a location for persistent storage
  for each transaction.  Make sure to verify the integrity of all
  transactions in the case that connection to the server is lost.
- Avoid saving a large amount of total data, this data is saved for
  every user and will be slower to load on game start.

.. _services_highscores:

Recording and querying high scores
----------------------------------

Your game may include some kind of high score or ranking system.  To
allow players to view their high scores and compare with other
friends, Turbulenz Services provide a ranked leaderboard system.  The
system allows the game to record the best scores set by each player
and calculates how that player compares to other players on the
system.  The resulting rank can be queried by the game and is also
displayed on the Turbulenz game site.  A player can see who is above
them and below them in the ranks and what their next target is to
improve.

The :ref:`LeaderboardManager <leaderboardmanager>` is the JavaScript
interface for the game to access this functionality.  Here are a few
hints and tips when using the LeaderboardManager:

- Aim to reduce the number of leaderboards a game creates. This gives
  more value to the fewer leaderboards that do exist and makes them
  more competitive.
- The game site will initially show a selection of the leaderboards
  that you add, make sure the most valuable ones for your game are
  added at the top.
- Use of the sortBy key/flag in the leaderboards.yaml file allows you
  to specify whether a leaderboard is ranked in ascending or
  descending order.
- Make sure your leaderboards.yaml is correct before deploying your
  game to the Hub.  The uploader will verify the file before
  transmitting
- Make sure any assets you use such as icons are correctly added to
  the list of deploy files before upload.  The upload may fail if this
  information is not correct.
- Examples of leaderboards can be found in the MultiWorm example app
  included in the SDK.

.. _services_achievement:

Progressing towards and achieving badges
----------------------------------------

Badges are the name for Turbulenz' achievement system.  They represent
game-based targets and challenges a player can aim towards.  Turbulenz
provides a comprehensive system of badges which accumulate across the
Turbulenz game site.  Badges can be worked towards (e.g. collecting a
certain number of items) or directly awarded for passing a milestone.

The :ref:`BadgeManager <badgemanager>` is the JavaScript interface for
the game to access this functionality.  Here are a few hints and tips
when using the BadgeManager:

- Add value to your Badges, make sure they give the user a sense of
  achievement having put in the effort to obtain them.
- Badges have progress meters, that can take on the form of different
  shapes e.g. circle, diamond, etc, choose how you want them
  represented in the badges.yaml.
- Each badge will have an icon which is revealed when achieved. Be
  creative with the design for these. Making each badge collectible
  will make it worth the effort.
- Examples of badges can be found in the MultiWorm app included in the SDK.

.. _services_userprofile:

Accessing the user's profile
----------------------------

Each user on the Turbulenz game site will have a profile that games
can access to obtain a user's screen name, nationality, language etc.
More information from the profile will become available to the game
over time, subject to user permissions settings.

The :ref:`UserProfile <userprofile>` is the JavaScript interface for
the game to access this server functionality.  Here are a few hints
and tips when using the UserProfile:

- The majority of data from a userprofile is read-only and for the
  purpose of addressing the user directly e.g. adding a user's
  displayname in a story or suggesting a language setting for the
  game.
- Age can be used to determine if a user is suitable for the game's
  age rating.
- Use of a user's profile data is covered in the game site's privacy
  policy
- The Turbulenz local server will always return the data for a single
  user
- If a field is undefined or null, it can be assumed that the
  information is either not specified or inaccessible.

.. _services_resetting_local_server_data:

Resetting local server data
---------------------------

Each of these Turbulenz Services are available from the Turbulenz
local server, Turbulenz Hub or Turbulenz game site.  When testing on
the local server, data is stored locally in the folder:

*\*SDKINSTALLDIR\*/devserver/localdata*

The local server requires no login and acts as the user logged onto
the system.  Your username for the local server is automatically set
to the same as the user logged onto the machine.  To test the
behavior of multiple users, you should upload your game to the Hub.

To reset the local data generated by the Leaderboard or Badges API,
you can remove the data for a specific game from one of:

    - *\*SDKINSTALLDIR\*/devserver/localdata/leaderboards*
    - *\*SDKINSTALLDIR\*/devserver/localdata/userbadges*
    - *\*SDKINSTALLDIR\*/devserver/localdata/userdata*

where individual games are identified by the slug name.  Resetting
this data is equivalent to starting as a new user.

.. WARNING::

    Do not attempt to manually edit data in these files.  Editing the
    files could cause data corruption and undefined behavior from the
    local server.  You should attempt to use the interfaces to debug
    this information and only view this data as a last resort.
