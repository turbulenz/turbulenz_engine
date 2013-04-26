.. index::
    single: Introduction

.. highlight:: javascript

.. _local_introduction:

------------
Introduction
------------

Welcome to the Turbulenz Local Server User Guide!

In This Guide
-------------

**Document Sections**

Here is a summary of the topics covered in each section:

:ref:`what_is_local`

    **What does the Turbulenz Local Server do?** An integral part of the Turbulenz development process; the local development server provides the foundation work flow for developing Turbulenz apps/games.
    This section describes the features the technology provide and how to start using it from day one.

:ref:`local_getting_started`

    **How do I try it out?** The best way to see what it does is to start using it!
    This section guides you through the server, step-by-step, showing you how the basics works.

:ref:`local_exploring_features`

    **What features are available?** There are tools you can use with your projects that are designed to assist you during development.
    This section provides further step-by-step guides explain how to use the features and how they might be of assistance.

:ref:`local_common_usage`

    **What common patterns am I likely to encounter when developing?** This section covers how you may interact with the local server on a daily basis.
    It offers suggestions for how best to use it and describes how to perform some more advanced tasks.

:ref:`local_additional_information`

    **What else should I know about?** An additional reference for the local server that covers some aspects in more detail.
    This section contains information to help you get the most out of the local server and its tools.

:ref:`local_troubleshooting`

    **I can't get it to work:** If you are encountering problems when using the local server, check out this section to see if you can find a solution to your problem.
    It covers the possible pitfalls you might encounter and offers you suggestions to help you get going again.

**Assumptions**

* You have a basic understanding of what 'Turbulenz' is as a company and range of products.
* You understand that Turbulenz technology products allow developers to create games that run online on a range of platforms.
* You are have read the :ref:`Getting Started Guide <getting_started_guide>` and have heard the 'local server' mentioned.
* You are new to developing Turbulenz applications/games and are about to start a new project OR you have yet to use the local server.

.. NOTE::

    Some parts of this guide may require you to have an understanding how your application/game is built including build processes and tools.
    The prerequisite information can be found in the :ref:`Getting Started Guide <getting_started_guide>`.

.. highlight:: javascript

.. _what_is_local:

-----------------------------------
What is the Turbulenz Local Server?
-----------------------------------

Summary
-------

The Turbulenz Local Server is a web server you can run on your computer to simulate the online infrastructure provided by Turbulenz.
It provides cloud-based service APIs locally for you to test your game/app against.
Not limited to just web server functionality, it also provides the tools to help you develop your game/app on your local machine.
You can visually debug your game assets, test file mappings, view server response metrics and inspect your :ref:`Turbulenz Services <turbulenz_game_services>` data, all without internet access.
If you are working on a local network with other developers, you can allow them to access your projects and test your work as you are developing it, great for tracking down bugs.
Once your code is running on your local server, even in a basic form, you can use the local server to deploy a build of your project to your account on the Turbulenz Hub.
In this way you can allow 3rd parties to try your project even during development to help with testing, demoing and getting feedback.

It all starts with the local server and here are the features it provides:

Features
--------

**Projects**

* Project creation, editing, deployment from local server interface.
* Ability to select from multiple projects and view associated data.
* Ability to add artwork to your project.

**File Serving**

* A locally run web server for serving your code and asset files.
* Ability to server multiple game configurations.
* Suitable for sharing content with other developers on private networks (Not recommended for unknown networks, such as internet cafes, airports).

**Turbulenz Services APIs**

* An offline accessible set of Turbulenz Service APIs, for the purpose of developing and debugging.
* Visualization of :ref:`User Data API <userdatamanager>` key-value pairs, for debugging data submitted by the game/app.
* Ability to manually set User Profile, Leaderboard, Badge data to test game behavior.

**Metrics**

* Metrics for recording the activity during a play session.
* File request metrics for tracking the type, amount and speed of data transferred including server responses.
* Visualization of the formats of the assets used by the game.

**Built in Tools**

* An Asset viewer for visualizing asset data such as geometries, animations and physics data with the following features:
    - Assets loaded into a 3D window view.
    - Mouse and keyboards controls for navigating 2D/3D data.
    - Default shaders including wireframe, normals to help visualize geometry data.
    - Options to display normals, tangents, binormals for geometry data.
    - Options for controlling animation playback data.
    - Visualization for geometry extents.

* A disassembler tool for inspecting converted asset files in JSON format.

**Deployment**

* Ability to upload project files to a specified Turbulenz Hub account.
* Ability to create a new project version or deploy to an existing one.
* Gzip compression of file data (No additional compression required).
* File hashing of uploaded data (once a file has been successfully deployed, identical files will be skipped, reducing upload time).

.. highlight:: javascript

.. _local_getting_started:

---------------
Getting Started
---------------

To get started using the local server quickly, the following step-by-step instructions will help you navigate the server:

Start the local server
----------------------
Once you have installed the SDK on your computer:

    **Windows:**

        1) Click the link: (Start Menu -> Programs -> Turbulenz -> SDK X.X.X -> Run Local Server X.X.X)
        2) Wait for the server to start. This should take no more than a minute (If it seems to be taking longer try :ref:`troubleshooting <local_server_running_troubleshooting>`).
        3) Once loaded, your default browser should navigate to `http://127.0.0.1:8070 <http://127.0.0.1:8070>`_, this is the web address for your local server.
        4) You should see a page entitled 'local.turbulenz'.

    **Mac / Linux:**

        1) In the terminal, navigate to location of your SDK. The default location is: ~/Turbulenz/SDK/X.X.X
        2) Type: ./start_local.sh
        3) Wait until you get a message such as "Serving on 0.0.0.0:8070 view at http://127.0.0.1:8070".
        4) Navigate to `http://127.0.0.1:8070 <http://127.0.0.1:8070>`_ using your browser.
        5) You should see a page entitled 'local.turbulenz'.

Playing an existing game/app
----------------------------
The local server comes with preloaded content of samples and apps for you to explore.

    1) To select to project to play, click on its art image. Try clicking on 'Sample App'.
    2) You will see a selection of purple buttons that represent what you can do on your project. Click on the 'Play' button.
    3) You will see a list of configurations that have been built for your project. This usually includes plugin debug/release and canvas debug/release builds.
    4) To play a build, click on the link. The requirements for each configuration are:
        - **sampleapp.release.html** - Turbulenz Engine installed. Any supported browser.
        - **sampleapp.debug.html** - Turbulenz Engine installed. A development browser.
        - **sampleapp.canvas.release.html** - Any browser with canvas2D support (for 2D apps) or WebGL support (for 3D apps).
        - **sampleapp.canvas.debug.html** - A development browser supporting canvas2D/WebGL.
        - **sampleapp.tzjs** - Turbulenz Engine installed, certain supported browers.
    5) The app will start running in the page. For the Sample App you should see a spinning duck.
    6) To select another option, use the back button in the browser.

.. NOTE::

    To get a shortcut to app on your computer you can bookmark the url in the address bar when you are playing.
    e.g. http://127.0.0.1:8070/#/play/sample-app/sampleapp.canvas.html
    Remember that this will change if you modify your project configurations or project name.

Adding a new project
--------------------
Once you have taken into account :ref:`project considerations <local_considerations_for_projects>`, you can add a new project to the local server.
This involves letting the server know where your project is located and creating a configuration **'manifest.yaml'** file for your project.

If starting from scratch:

    1) From the local server page click on the **'+'** button on the left hand side (under the **'home'** icon).
    2) This will create an empty project page.
    3) At the bottom you will be asked to specify a **'Game Directory'**.
       You can either:

        1) **Type a directory name** - i.e. **'MyAwesomeProject'** this will allow you to create a project for this SDK at \*SDKINSTALLDIR\*/devserver/games/MyAwesomeProject
        2) **Type a relative/absolute path to a directory you want to put the project** - i.e. Windows: "C:\\Users\\*USERNAME*\\Dev\\MyAwesomeProject" or Mac / Linux: "/Users/*USERNAME*/Dev/MyAwesomeProject"

        .. NOTE::

            Use of ~/ to denote home is not possible. Please use the full path e.g. ~/Dev/MyAwesomeProject becomes /Users/*USERNAME*/Dev/MyAwesomeProject.

    4) If no directory exists: The server will ask you to **'create'** this directory (and show you the full path)
       If the directory exists: The server will ask you to **'confirm'** this directory.
    5) The server will automatically create a **'manifest.yaml'** file in that directory to store your settings.
    6) You will be asked to fill in the following details for your project:

        * **Title** - This is the name of your project and how you can easily identify it.
          If you are adding 'Working project' layout, then something like 'MyAwesomeProject (Dev)' would be suitable.
          If you are adding a 'Deployed project' layout, then depending on the configuration you are deploying, something like 'MyAwesomeProject (v0.1) [\*BUILDCONFIGURATION\*]'

        * **Slug** - This is how the server will access your project by url.
          This is usually automatically generated by the title, but you can edit this if required. (See :ref:`choosing a slug <local_choosing_a_slug>`)

        * **Main** - This is the file that represents the entry point to your game.
          For a development build this will be 'myawesomeproject.debug.html'.
          For release builds this will be either: 'myawesomeproject.tzjs' or 'myawesomeproject.canvas.js' for plugin and canvas builds respectively.
          If you specify a HTML file (for the purpose of debugging), then you must remember to add the required files to the **'Deploy Files'**.
          Note how this file is automatically added to the 'Deploy Files'.

        * **Mapping Table** - This is the file that provides mappings for assets from the **'Asset Name'** to **'Request Name'** (:ref:`What's this?<getting_started_optimization>`).
          This file is how the server knows how to serve your asset files correctly.
          The mapping is usually **'mapping_table.json'** and is located in the root project directory.
          Note how this file is automatically added to the 'Deploy Files'.

        * **Deploy Files** - This is where you can view and add files that will be part of the deployment to the Turbulenz Hub.
          See the section on :ref:`deploying to the Hub <hub_deploy_to_hub>`.
          You can specify individual files or patterns.
          Here are a few examples:

            * **mapping_table.json** - The mapping table. Required for deployment.
            * **myawesomeproject.tzjs** - The main plugin file for MyAwesomeProject.
            * **images/\*** - All files located in the 'images' and its sub-directories.
            * **css/\*.css** - All .css files located in the 'css' sub-directory. Note: This is not recursive.
            * **scripts/app/\*** - All files in the 'app' sub-directory of 'scripts'. Note: Will not include files in 'scripts'. Note: This command will also search sub-directories in 'app'.

          .. NOTE::

            To recursively include files with a certain type in sub-directories you need to specify each sub-directory you intend to include.

            *Example*:

            To include JavaScript files in 'jslib' for a canvas debug build, you would need to add the following entries:

                * jslib/\*.js
                * jslib/services/\*.js
                * jslib/webgl/\*.js

          .. NOTE::

            Eventually you may want to include content for the Turbulenz Services such as leaderboards and badges.
            The deploy files is where you need to add this information to ensure they are uploaded to the Hub.
            See :ref:`badges <badgemanager>` and :ref:`leaderboards <leaderboardmanager>` for an example of what to include.

.. NOTE::

    For more detail on the manifest.yaml format. See the :ref:`manifest format <local_manifest_yaml_format>` section in the documentation.

Adding an existing project
--------------------------
If you have an existing project with an existing manifest.yaml file that needs to be configured for this local server.
The process is similar to adding a new project.

To demonstrate this we will use the Sample App as a basis.

    1) Duplicate the **'sampleapp'** directory and call it 'MyAwesomeProject'
    2) From the local server page click on the **'+'** button on the left hand side (under the **'home'** icon).
    3) This will create an empty project page.
    4) At the bottom you when you are asked to specify a **'Game Directory'**, type in the path of the **'MyAwesomeProject'** directory.
       In this case the relative path should be fine:

       ../../apps/MyAwesomeProject

    5) Once the server finds the existing manifest file it will ask you to either:

        * To **'use'** the data.
        * To **'overwrite'** the data with a new, empty project. This will be like starting from scratch.

    6) If you select 'use', it will fill in the form with the details of the Sample App project.
       Note that the slug has been changed so that this project doesn't clash with your existing sampleapp project.

    7) Since the project is already configured, we will only change the title and slug to make it unique.
    8) Add the title 'My Awesome Project' (the slug will change automatically).
    9) The **'Save Game'** button at the bottom right of the form will be available in green. Press this to save the configuration changes.

.. NOTE::

    In this example we have only changed the title and directory for configuration in the local server.
    There are many other aspects of the app that would need to be changed to convert it over to the MyAwesomeProject naming.

Navigating multiple projects
----------------------------
As you begin to add multiple projects, you will need to be able to navigate between them.

    1) Navigate to the local server main page
    2) Observe the following:

        :local.turbulenz (Text): At the top of the page, clicking on this will return you to the main screen.
        :Home (Icon): Indicated by a little house to the left of the projects artwork.
                      This has the same effect as the local.turbulenz in which it will return you to the main screen.
        :Left and right arrows (Icon): These will appear at either end of the projects when there are more projects to view either side.
                                       You will need 5+ projects before these will be shown.
        :'+' (Icon): This will create a new project and add it to your list of projects.

    3) To see the project page, click on the project artwork or the text. Try this on the 'Samples' project.
    4) Even in the project view you can navigate quickly between projects using the **'left and right arrow icons'**.
    5) Clicking on any of the purple tab items will allow you to see the information for that item without leaving the project page.
       Note that some tabs, such as 'Manage', have content that goes down the page allowing you to scroll.
    6) To get back to the main page, you can also click again on the project artwork.

Deleting a project
------------------
If you created a project as a test or simply want to remove a project from your list you will need to delete it.

    1) From the local server main page, select the project you want to delete by clicking on the artwork image.
    2) Select the **'Manage'** button.
    3) At the bottom there is a **'Delete Game'** button, press this button.
    4) A message will pop up asking you to confirm.
    5) As described in the message this will only delete the configuration file. To truly delete the project you will need to delete the directory that the project referred to.

.. _local_exploring_features:

------------------
Exploring Features
------------------

To get a quick overview of the functionality provided by the local server, follow these steps to explore:

Look at the metrics for a project
---------------------------------
Once you have run an app you can investigate the metrics generated during that session.

    1) Select the project you want to get the metrics for. Try the **'Sample App'** project you just ran.
    2) Select the **'Metrics'** button.
    3) You will see a list of session data starting with the most recent at the top.
    4) Open a closed session by pressing the arrow next to the session date.
    5) If you press the **'Files'** button at the bottom of an open session, it will expand a list of files that were requested during that session.
    6) You can compare the size and response time of the message for each file.
       This is useful if you want to find out which assets are taking the longest to transfer.
    7) Sort the list by clicking on 'time' to see the order in which requests were received.

.. NOTE::

    After repeat plays, you may notice that some sessions have a size of 0 bytes.
    The server response for some of these files is "304 Not Modified".
    This means the server was queried, but the file hadn't changed and the file has been served directly from the browser's cache.
    In this case the time between requests represents the time taken to query the server.

.. WARNING::

    When a session has a size of 0 bytes, some files are not listed.
    This is the case for assets located in 'staticmax'.
    Theses files are cached indefinitely and hence they were served from the browser's cache.
    In this case there is no server response.
    An example asset in Sample App would be 'models/duck.dae'.
    If you want to get a true representation of the response time for a user with no cached files, clear your browser cache and play the game again.

Looking at the total size requested by a game/app that has been run
-------------------------------------------------------------------
Try clearing your cache and run the Sample App again.

    1) Select the **'Sample App'** project.
    2) Select **'Metrics'**.
    3) Look at the top session (Size > 0).
    4) If the session is closed, open it by pressing the arrow by the date.
    5) Press the **'Assets'** button at the bottom of the open session.
    6) You should see a colored bar, breaking the total size down by file type. This is useful if you want to see how much of a project is asset data such as sounds, textures compared to application code.

Viewing a model asset from a project
------------------------------------
If a project has assets containing geometries, animations or physics data, this can be visualized in the 'Asset Viewer' tool.

    1) Select the project with the model asset. In this case select the Sample App, which contains a duck model.
    2) Select the **'Assets'** button.
    3) Below the button is a list of the assets which are part of the project.
       If a mapping table is present, then this represents the root of the mapping table structure.
    4) Select the **'models'** link.
    5) There is a **'duck.dae'** asset, which in the game will be referenced by 'models/duck.dae'.
       This maps to a request name, which is the request that will be sent to the server.
    6) Under the column **'View'** click on the link. This will load the file in the viewer.
    7) You should see a 3D blue grid on a white background with a yellow duck in the middle.
    8) Click on the window and try using the mouse and keyboard to move around the duck. (WASD + Mouse look).
    9) Press Esc to release the mouse

For geometries, such as the duck you can try:

    * **Draw normals** - Toggle the 'Draw normals' checkbox. You should see green lines representing the normals.
    * **Turn on the debug normals shader** - Select it from the 'Debug Normals' options. This will color the geometry based on the direction the normals are facing.
    * **Turn on wireframe mode** - Choose 'Blueprint' from Select Wireframe. This allows you to inspect your mesh geometry.
    * **Draw extents of the object** - Toggle the "Draw opaque nodes extents" option.

Looking at an asset in JSON format
----------------------------------
Since your game/app is run in JavaScript in the browser, its logical that the data is transferred JSON format.
The :ref:`Turbulenz JSON formats <turbulenz_json_format>` for assets are also specified in this documentation.
Turbulenz provides a tool called the **Disassembler** for visualizing these assets from the local server.

    1) Select the project with the assets you want disassemble. Try the Sample App.
    2) Select the **'Assets'** button
    3) This time we will browse the files as they are laid out on the file system.
       Click on **'View as Files'**
    4) Click on the folder **'staticmax'**.
       This is the folder where you put assets you would like to cache.
    5) The green background for each row indicates that files has successfully been found in the mapping table (red rows indicate missing mappings).
       More details about staticmax and mapping tables see the :ref:`introduction <getting_started_optimization>` in the :ref:`getting started guide <getting_started_guide>` and :ref:`Creating a Mapping Table <creating-a-mapping-table>`.
    6) To look at the disassembled JSON for an asset, click the **'disassemble'** button.
       Try this for the **standard.cgfx** shader.
    7) You should see the disassembler view of the shader.
       The controls on the top allow you to expand the following:

        * **depth** - How many levels deep the expanded JSON object tree is. This applies to all branches.
        * **list** - If the JSON contains a 'list' or 'array', how many of the items are shown.
        * **dict** - For JSON objects in the tree, what is the maximum number shown when expanded.

        Each of these options can be performed per object by clicking on the blue **more** or **less** text.
    8) Press the **'reset'** button to return the tree to its initial state.

Viewing data stored by the User Data API
----------------------------------------
The :ref:`User Data API <userdatamanager>` provides the ability to save settings, game saves and other user specific data.
On the local server you can inspect this data to ensure your game/app is correctly using the API.

    1) Select the project that uses the User Data API. In this case we will look at the example in **'Samples'**
    2) Select **'Play'**
    3) Choose a configuration that uses user data.
       Find the **userdata.release.html** configuration in the list and click on it.
    4) Perform some action that ends up setting data.
       In the case of userdata.release.html, save a different state of rotation to each of the save slots using the **'set'** button.
       Try using **'get'** button to retrieve the state of the duck to ensure it has worked.
    5) Go back to the project page on the local server
    6) Select **'User Data'** button
    7) If there is data set, you will see a list of users.

    .. NOTE::

        By default on the local server you will see a single user.
        The user will take on the user name of the account owner that is running the local server.
        To inspect this information and other profile information on local, see the documentation for the :ref:`User Profile API <userprofile>`.

    8) Select the user, in this case the username of the account hosting the server.
    9) You will see a list of **keys** and the respective sizes. Since the data is JSON, you will also see the option to disassemble the values.
    10) To download a copy of the file, click on the name of the key you want to inspect.
    11) Alternatively you can view the data in the **'Disassembler'**.

Deploying a project to the Hub
------------------------------
The local server includes the ability to deploy a build of your project directly to the Turbulenz Hub.
For a configured project this is as simple as:

    1) Selecting a project to deploy.
    2) Pressing the **'Deploy to Hub'** button.
    3) Filling in your Hub account information.
    4) Selecting which of your Hub projects to deploy to (including versioning).
    5) Pressing deploy and watching it transfer, ready for you to try remotely.
    6) Navigating to http://hub.turbulenz.com and playing it immediately.

There are a few checkboxes you need to check to get it ready to do this. The :ref:`deploying to the Hub <hub_deploy_to_hub>` guide should help.

.. highlight:: javascript

.. _local_common_usage:

------------
Common Usage
------------

Once you've discovered the basic features, here are a few more examples of how to use the local server on a day-to-day basis:

.. _local_considerations_for_projects:

Considerations for Projects
---------------------------

Requirements for Serving Projects
*********************************
To add a new project to the local server requires:

    * **A root project directory** - This is the directory structure for your project.
      All the references for your project must be files in this directory or sub-directories (This is so that they can be hosted by the server).
    * **Url safe naming of files** - This applies only to the files you are going to serve.
      Generally you should replace whitespace with '_' or '-'.
      Url safe is uppercase and lowercase letters, decimal digits, hyphen, period, underscore, and tilde (Section 2.3 of `RFC 3986 <http://www.ietf.org/rfc/rfc3986.txt>`_)
    * **Play files need to be at root level** - Files such as **yourproject.canvas.release.html**, **yourproject.debug.html** and **yourproject.tzjs** should be output at the root level.
      This allows the local server to locate and correctly serve them.
    * **The directory needs to have write permission** - The directory should be located in a place where the local server has write permission.
      If it is run under account \*USERNAME\* then the directory must be writeable by that user.

.. _local_choosing_a_slug:

Choosing a slug
***************

Picking a suitable slug is an important step for your project.
The slug is the unique part of the URL that represents your project on the live sites (Hub & game site).
This cannot be the same as any other project on the site.

Usually this is the name of the game as your users would see it.
You should use only url-safe characters.
e.g. 'awesome-adventure' or 'super-duck-3'

    * Keep it concise.
    * Don't use any trademarks that don't belong to you.
    * Avoid the usual inappropriate words.
    * lowercase with hyphens for spaces is recommended.

    .. NOTE::

        Although worth considering now, your slug only needs to be globally unique on the live servers, not for the local server.
        This means that on local you can have extended slugs or slugs with additional configuration information. E.g.

            :super-duck-3: Suitable for the Hub, the game site and the local server.
            :super-duck-3_v1.0_canvas-release: Only suitable on local server.


Choosing a Project Layout
*************************

One choice you have is how to structure your project. You might want to create a **working project** or a **deployed project**.
Here is a description of the terminology and advantages and disadvantages of each.

:Working Project: A working project is a project that is structured ready to be hosted by a webserver.
    This usual means:

        * Configurations are built to the root directory.
        * Sub directories for js, css, templates, etc are already laid out in their final form ready to serve.
        * The directory you work in is the one you host.

    **Advantages:**

        * You can locate your project anywhere accessible by the local server.
        * You have a single location for the current build of your project.
        * Fits easily into source control.
        * You don't require any deployment build steps to package it into a form for the local server.
        * Changes you make to debug files are 'live' (No build step is required, simply refresh the page).

    **Disadvantages:**

        * All your intermediate files are located in the same structure.
        * Your structure is pre-defined (not as flexible).
        * Complex if you want to deploy on multiple local servers at the same time.

:Deployed Project: A deployed project is a project that undergoes a 'deployment' step from your working directory to create a 'build' that is ready to deploy.

    **Advantages:**

        * Includes only the files required to run (no intermediate files, fewer mistakes in dependencies).
        * Easy to target specific SDKs and functionality (i.e. build straight to \*SDKINSTALLDIR\*/devserver/games/myproject-v1.0).
        * Your main working directory can take any structure you require.
        * Easy to change configurations.
        * Your working directory can contain non-url safe filenames (that are converted in the deployment step).

    **Disadvantages:**

        * You must deploy to see changes.
        * Requires a 'deploy' build to construct step.

.. _local_additional_information:

----------------------
Additional Information
----------------------

.. _local_manifest_yaml_format:

Manifest YAML Format
--------------------

These are the fields recognized by the local server and :ref:`deploygame` tool when loading/deploying manifest.yaml configurations.

.. WARNING::

    Be careful when editing these files.
    Any errors can result in the failure of the server to load your project configuration.
    It is preferable to use the local server 'Manage' interface to edit the details.

Revision History
****************
:SDK 0.5.0 - 0.12.0: Version: 0.X
:SDK 0.13.0: Version: 1.0
:SDK 0.19.0: Version: 1.1
:SDK 0.20.0: Version: 1.2
:SDK 0.21.0: Version: 1.3
:SDK 0.23.0: Version: 1.4
:SDK 0.24.0: Version: 1.5

Version 0.X
***********
These versions of manifest.yaml are unofficially supported.
They may require manual conversion to 1.0 or greater.

Version 1.X
***********

**aspect_ratio**

**Added: 0.21.0**

    :Summary: This defines the target ratio that the game expects the site to provide. 
        
        .. NOTE::
        
            The dimensions of the graphics device can be any width or height, but the browser will attempt to maintain this aspect ratio.
            Games still need to handle any dimensions provided by the graphics device.

    :Format: Ratio in the format X:Y (Single Quotes)
    :Description: The target aspect ratio of the project.
    :Requirements:
        Must be either defined as X:Y where X is the ratio for width and Y is the ratio for height
        X and Y must both be integers
    :Used by: Hub
    :Required by: Hub
    :Notes: The resulting aspect ratio is subject to pixel rounding per browser. The game must assume that it is rounded up or down to the nearest pixel in each dimension.
            The aspect ratio is only honored on turbulenz.com
            If no value is specified, it will default to 16:9.
    :Examples:

    ::

        aspect_ratio: '16:9'
        aspect_ratio: '16:10'
        aspect_ratio: '4:3'
        aspect_ratio: ''

**canvas_main**

**Added: 0.20.0**

    :Summary: This is the file that will be the entry point to the canvas build configuration when deployed on the Hub.
    :Format: String (No Quotes)
    :Description: The name of the file that represents the canvas main of the project.
    :Requirements:
        Must be either a .js (generated by maketzjs), .html file.
        The file must exist at the root level.
        No directories are allowed.
        The file must exist in the deploy_files section of the manifest file.
    :Used by: Local, Hub
    :Required by: Hub
    :Notes: Can be '' if not main is not yet defined. If not defined, the project will not deploy a canvas build to the Hub.
    :Examples:

    ::

        canvas_main: myawesomeproject.canvas.js
        canvas_main: ''

**cover_art**

    :Summary: This is the image shown on main page of the local server. It is used to help you visually select your project.
    :Format: String (No quotes)
    :Description: File path of the image to display.
    :Requirements:
        The file pointed to should be a JPG/PNG.
        The file should have dimensions 160 x 234.
        The path must be exist in the root project directory or a sub directory.
        The path must be relative.
    :Used by: Local
    :Required by: None
    :Notes: The image should be at the root level.
    :Examples:

    ::

        cover_art: ''
        cover_art: cover_art.jpg
        cover_art: img/logo.jpg

**deploy_files**

    :Summary: This is list of all the files that are required by your app/game to run.
              They will be uploaded to the Hub when deployed.
              You can use patterns to match groups of files.
    :Format: List of Strings.
    :Description: Filename OR file pattern to match.
    :Requirements:
        The list must include a field identical to the 'main' and 'mapping_table' if those fields are defined.
        All patterns defined must be for files in the root directory or sub directories.
    :Used by: Local, Hub
    :Required by: Hub
    :Notes:
        **Added: 0.19.0**: To include all files and sub-directories in a directory, use the 'name/\*' notation.
        To include certain types of file e.g. \*.js in sub-directories, an entry must be added for each sub-directory. See the examples.
    :Examples:

    ::

        deploy_files:
        - ''

        deploy_files:
        - myawesomeproject.tzjs
        - mapping_table.json

        deploy_files:
        - myawesomeproject.canvas.js
        - myawesomeproject.tzjs
        - mapping_table.json
        - staticmax/*

        deploy_files:
        - badges.yaml
        - img/badges/*.png

        deploy_files:
        - myawesomeproject.debug.html
        - mapping_table.json
        - css/*
        - img/*
        - js/*
        - scripts/*
        - staticmax/*

        deploy_files:
        - jslib/*.js
        - jslib/services/*.js
        - jslib/webgl/*.js

**deployed**

**DO NOT EDIT**

    :Summary: This is the time and date the local server last deployed this configuration file. The local server will read and update this file.
    :Format: String (No Quotes)
    :Description: Time, date string in format (HH:MM | DD/MM/YYYY) OR Never
    :Requirements: N/A
    :Used by: Local
    :Required by: Local
    :Notes: This field should only be set by the local server.
    :Examples:

    ::

        deployed: Never
        deployed: 13:37 | 13/03/2007

.. _local_manifest_yaml_format_engine_version:

**engine_version**

**Added: 0.19.0**, **Modified: 0.23.0**, **Modified: 0.24.0**

    :Summary: This defines the latest engine version that the project is compatible with. This information is used to inform the Hub, what the developer expects the configuration to be compatible with. This will usually represent the version the project has been tested locally against.
    :Format: String (Quotes)
    :Description: The engine version in the form X.X, where X.X is the engine interface version that the game requires.
    :Requirements:
        **Modified: 0.24.0** As of SDK 0.24.0 the engine_version field must abide by these requirements:

        Must be a valid 2-digit engine version.
        Must be formatted 'X.X' or ''
    :Used by: Hub
    :Required by: Hub
    :Notes: The tools in the SDK append an minimum compatible version. This field is in addition to that.
            Not specifying will default to the latest engine version. 

            .. WARNING::

                By not specifying an engine version, your game will request the version of the SDK with which it was uploaded to the Hub, which may be incompatible with interfaces used by the game.
                Please make sure to consider the compatible engine carefully.
    :Examples:

    ::

        engine_version: '0.23'
        engine_version: '0.24'
        engine_version: ''

**is_multiplayer**

**Added: 0.21.0**

    :Summary: This defines if this configuration is compatible with the Turbulenz multiplayer system. If this value is true, additional functionality is enabled on the Hub to view, join and manage active sessions for the project.
    :Format: Boolean
    :Description: true OR false
    :Requirements: N/A
    :Used by: Hub
    :Required by: Hub
    :Notes: 
    :Examples:

    ::

        is_multiplayer: false
        is_multiplayer: true


**is_temp**

**DO NOT EDIT**

    :Summary: This defines if this configuration is temporary. This is usually true when a new project configuration is in the process of being created.
    :Format: Boolean
    :Description: true OR false
    :Requirements: N/A
    :Used by: Local
    :Required by: Local
    :Notes: This field should only be set by the local server.
    :Examples:

    ::

        is_temp: false
        is_temp: true

**main**

**Depricated: 0.20.0 (Unused)**

    :Summary: This field is unused, but has been left in for backwards compatibility. It has been replace by 'canvas_main' and 'plugin_main' Treat this field as **DO NOT EDIT**.

**mapping_table**

    :Summary: This is the file that will be the entry point to the configuration when deployed on the Hub.
    :Format: String (No Quotes)
    :Description: The name of the file that represents the main of the project.
    :Requirements:
        Must be either a .js, .tzjs or .html file.
        The file must exist at the root level.
        No directories are allowed.
        The file must exist in the deploy_files section of the manifest file.
    :Used by: Local, Hub
    :Required by: Hub
    :Notes: If not defined, the project cannot be deployed.
    :Examples:

    ::

        mapping_table: mapping_table.json
        mapping_table: ''

**modified**

    :Summary: This is the time and date the local server last modified this configuration file. The local server will read and update this file.
    :Format: String (No Quotes)
    :Description: Time, date string in format (HH:MM | DD/MM/YYYY) OR Never
    :Requirements: N/A
    :Used by: Local
    :Required by: Local
    :Notes: This field should only be set by the local server.
    :Examples:

    ::

        modified: Never
        modified: 13:37 | 13/03/2007

**path**

**DO NOT EDIT**

    :Summary: This is path that the local server has used to locate the project directory. This is written when the project is added to the local server.
    :Format: String (No Quotes)
    :Description: Directory of the project root. Can be absolute OR relative to \*SDKINSTALLDIR\*/devserver/games/
    :Requirements: Must be the same path as the path to the root directory that the manifest file corresponds to.
    :Used by: Local
    :Required by: Local
    :Notes: This field should only be set by the local server.
    :Examples:

    ::

        path: /Users/Me/Dev/MyAwesomeProject
        path: myawesomeproject

**plugin_main**

**Added: 0.20.0**

    :Summary: This is the file that will be the entry point to the plugin build configuration when deployed on the Hub.
    :Format: String (No Quotes)
    :Description: The name of the file that represents the plugin main of the project.
    :Requirements:
        Must be either a .tzjs (generated by maketzjs), .html file.
        The file must exist at the root level.
        No directories are allowed.
        The file must exist in the deploy_files section of the manifest file.
    :Used by: Local, Hub
    :Required by: Hub
    :Notes: Can be '' if not main is not yet defined. If not defined, the project will not deploy a plugin build to the Hub.
    :Examples:

    ::

        plugin_main: myawesomeproject.tzjs
        plugin_main: ''

**slug**

    :Summary: This is part of the url that is used to locate project on the local server. It is used by the local server and tools to identify the project they perform actions on.
    :Format: String (No Quotes)
    :Description: A url-safe identifier that uniquely identifies this project.
    :Requirements:
        Must be url-safe. (Section 2.3 of `RFC 3986 <http://www.ietf.org/rfc/rfc3986.txt>`_)
        No white space.
        Must be unique on this local server (no other projects with the same slug).
    :Used by: Local
    :Required by: Local
    :Notes: This usually automatically defined by the project title, but is not a requirement.
    :Examples:

    ::

        slug: myawesomeproject-dev
        slug: myawesomeproject-0.1-canvas-debug
        slug: new-game

**title**

    :Summary: This is the title of the project as displayed on the main local server page. This should help the user of the server quickly identify which project/configuration they are looking at.
    :Format: String (No Quotes)
    :Description: The human readable name for the project. Whitespace is allowed.
    :Requirements:
        UTF8 string.
        No white space.
        Must be unique on this local server (no other projects with the same slug).
    :Used by: Local
    :Required by: Local
    :Notes: This usually automatically defined by the project title, but is not a requirement.
    :Examples:

    ::

        title: MyAwesomeProject (Dev)
        title: MyAwesomeProject (v0.1)(canvas.debug)
        title: ''

**title_logo**

**Depricated: 0.19.0 (Unused)**

    :Summary: This field is unused, but has been left in for backwards compatibility. Treat this field as **DO NOT EDIT**.

.. WARNING::

    Future versions of the manifest files may not be backward compatible with older local servers.
    Loading manifest.yaml files on those local servers may result in loss of configuration data.
    All versions of 1.X should be forward compatible unless marked as such.

.. highlight:: javascript

.. _local_troubleshooting:

---------------
Troubleshooting
---------------

.. _local_frequently_asked_questions:

Frequently Asked Questions (FAQ)
--------------------------------

This section contains a list of frequently asked questions (FAQ) relating the use of the local server.
If you are trying to troubleshoot a problem, try checking this section before requesting support from Turbulenz.

:How do I stop the local server?:

    **Windows**:

        1) Find the command window "Run Local Server X.X.X"
        2) Close the terminal window.
        3) If you try navigating to the server, your browser won't find it anymore.

    **Mac / Linux**:

        1) Find the terminal you started the process.
        2) Close the terminal OR abort the process using CTRL-C.
        3) If you try navigating to the server, your browser won't find it anymore.

    If you can still see the server, make sure you don't have another instance open in another terminal.

.. _local_manually_start_local:

:How do I manually start the local server?:

      1) Open the an SDK environment window (:ref:`How do I do this? <getting_started_run_env>`).
      2) Type: *cd devserver*
      3) Type: *paster serve release.ini*
      4) Wait a few seconds
      5) You should see a message with something like: **'Serving on 0.0.0.0:8070 view at http://127.0.0.1:8070'**

      If you encounter an error at this stage, make an note of the error and send it to Turbulenz.

.. _local_change_port_number:

:How do I change the port number of the local server?:

    You may find that on some occasions you want to run multiple versions of the local server (from different SDKs for example).
    It might even be the case that you have another service on your computer that requires port 8070.

    To change the port:

        1) Open the \*SDKINSTALLDIR\* directory.
        2) Look in the 'devserver' directory.
        3) Open **'release.ini'** file in a text editor of your choice.
        4) In the section **[server:main]** look for the value **'port'**
        5) Change the port number to a non-conflicting port, e.g. 8071 or 9070
        6) Restart the local server manually.
        7) Manually start the local server.

        .. NOTE::

            On Windows, you will have to change the script that launches the local server, by editing the file 'browse_devserver.bat'
            Replace any instances of 8070 with the port you have changed it to.

.. _local_change_configuration:

:How do I change the local server configuration?:

    If in the unlikely event you are required to change the server configuration in any way, you will need to edit the release.ini file in the devserver directory of the SDK. 

    .. WARNING::

        Modifying this file, unless specified by Turbulenz, is not recommended. Changes could affect the setup of your local server. If in doubt restore the default release.ini file from the Turbulenz SDK.

    To change the configuration:

        1) Open the \*SDKINSTALLDIR\* directory.
        2) Look in the 'devserver' directory.
        3) Open **'release.ini'** file in a text editor of your choice.
        4) Make the necessary changes recommended by Turbulenz.
        5) Restart the local server manually.
        6) Manually start the local server.

.. _local_resolving_issues:

Resolving Issues
----------------

These hints are steps to try if you become stuck when using the local server:

.. _local_server_running_troubleshooting:

My local server doesn't appear to be running

    If you navigate to the default server location `http://127.0.0.1:8070 <http://127.0.0.1:8070>`_, you should see a web page with a list of games on it.
    If you get a browser message such as 'Unable to connect', the browser can't find the server or something has gone wrong starting local.

    Try the following:

    1) Wait a few seconds
    2) Refresh the page
    3) Check that the browser is not in an 'offline mode' (Firefox)

    If you still see the same page you will need to look at the local server console:

    **Windows**:
        * Is there an open command window on your taskbar that with a title "Run Local Server X.X.X" that says:
            *Serving on 0.0.0.0:8070 view at http://127.0.0.1:8070*
    **Mac / Linux**:
        * In the Terminal you ran the ./start_local.sh command, does it say:
            *Serving on 0.0.0.0:8070 view at http://127.0.0.1:8070*

    If **NO**:
        - You may need to try starting the server again manually.
        - See :ref:`manual starting of local server <local_manually_start_local>`
        - If you see addition text in the window other than the default message (without navigating to it in the browser) it is likely an error.

    If **YES**:

        Have you tried playing a game previously?

        If so, is there any activity in that window such as: *[13/Mar/2007 13:37:00] "GET /play/myawesomegame/myawesomegame.debug.html" 200 5167 (OK)*

        If **NO**:
            There appears to be a communication error between the browser and the server.

            - Check you are not trying to access the wrong port i.e. something other than 8070.
            - Check that you don't have something else running on that port.

        If **YES**:
            Your server has been working at some point.

            - Try restarting the browser in case it dropped the connection.
            - Try navigating to the same page with a different browser.

    In the local server terminal window, if you see something that looks like a python stack trace.
    Copy the text in the window and send it Turbulenz via the :ref:`support system <support>`.

:When trying to run the devserver manually I get the error: socket.error: [Errno 48] Address already in use:

    This means that you are probably running another elsewhere (in another terminal window) or another application is using the port you specified.
    Try looking for the server and shutting it down.
    The default port for the local server is 8070.

    This guide describes how to :ref:`change the port that the local server is running on <local_change_port_number>`.

:When running the Asset Viewer, I only see a gray background:

    Have you installed the Turbulenz Engine component?

        The Asset Viewer requires the Engine to be installed to run.

        * Install the Turbulenz Engine, either from the SDK or having downloaded it from the Turbulenz Hub.

    Is the Engine compatible with the version of the SDK that you are using it with?

        The Asset Viewer also runs with a version of the Turbulenz Engine compatible with the SDK.

        * Check the version of the Turbulenz Engine you have installed. You can do this by running an app, such as the Sample App.
        * SDK and Engine versions should be compatible if they have the same major and minor version numbers.
          i.e 1.1.3 version of the Engine will be compatible with 1.1.0 version of the SDK.

    Do other apps work?

        If you play an app such as the Sample App, does it run? If so there may be something wrong with the viewer itself.

        * Try another app/game/sample.

    Do other assets work?

        Is it just one particular asset that fails?

        * Try a different asset.
        * Does that asset also result in a gray screen?

    Are there any options in the Select Wireframe and Debug Shader boxes?

        A gray screen generally means the viewer wasn't able to start.

        * Try clearing your browser cache and attempting to view an asset again.
        * Have a look at the output of the local server terminal window.
        * Does it show shaders and assets being requested?

    If the answer to all these questions is 'no' then submit a support request to Turbulenz outlining:

    * The Platform you are using
    * The Browser you are using
    * The version of the Engine you have installed
    * The version of the SDK you have installed

    Please include the output of the 'device_initialization' sample, if you are able to run it.


:The Asset Viewer loads but the object is missing/partial, only the blue grid appears:

    Is the type of the asset in Turbulenz JSON format and either a geometry, animation, physics data etc?

        It is possible that the asset might not be viewable or that it might require special rendering
        * Check the format is valid in the viewer.
        * Check that the format is what you expect it to be
        * Check that it doesn't specify a particular shader to render, defined in the asset itself

    Can you see the asset in the file system?

        You might have specified an asset that doesn't exist. It could be listed in the mapping table, but not on the disk.
        * Look at the Assets tab, the red coloring of assets indicates they are missing.
        * Try another asset to make sure that the mapping table is correct.

    Has the object been exported with the normals in the wrong direction?

        If the object has incorrect normals, the geometry might be being culled in the rendering process.
        * Try exporting the format in a different way.
        * Try rendering the same geometry with backface culling turned off.

    Do you specify a bound volume?

        The object may be very large or incredibly small.
        * Try zooming out/moving around.
        * If the bounding volume is incorrect, the camera might be inside the object or at a different scale.

    Some assets may not be renderable or have properties not supported by the viewer.
    Sending Turbulenz Support more information about the asset may help:

    * The format of the Asset.
    * The tools used to convert it to JSON.
    * How the asset was created.
    * An example of the asset in JSON form.
