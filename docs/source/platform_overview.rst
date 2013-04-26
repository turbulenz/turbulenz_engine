==================
Turbulenz Platform
==================

The Turbulenz Platform is the collection of server-side infrastructure provided by Turbulenz to allow the development, testing, publishing and monetizing of games online. This includes development tools, content distribution and game management services. 

The technology is organized in three key stages:

- **Local Development**: The local development of a game, simulating the Turbulenz service APIs on a :ref:`local server <local_introduction>` on a developer's machine or local network.
- **Remote Collaboration**: The remote development and testing of a build of a game on the :ref:`Turbulenz Hub <hub_introduction>`, a developer site for staging games. The infrastructure better represents the performance and characteristics of publishing to the live environment.
- **Live Deployment**: The live site, turbulenz.com, accessible by Turbulenz users. Gives developers the ability to monetize games with in-game payments, allow access to beta users, setup A/B testing and gather metrics, while making full use of all the Turbulenz site features, such as leaderboards and multiplayer. 

This section gives an overview of the Turbulenz Platform by describing an example workflow with a diagram to demonstrate the connections between services.

.. ------------------------------------------------------------

----------
 Overview
----------

.. figure:: hub/img/hub-technology-diagram02.png
    :width: 480 px
    :scale: 100 %
    :alt: Platform overview and workflow
    :align: center

    This is a diagram shows the complete Turbulenz platform and flow for developing, testing and publishing games.

Workflow
--------

The Turbulenz platform has been designed to allow the rapid, iterative development of games from conception to release. The following is an example workflow that is possible with the platform:

**Local**

Development begins with the **Turbulenz SDK**. Available for Windows, Mac and Linux, both programmers and artists can install the Turbulenz engine, tools, samples and documentation. Having setup appropriate build processes and asset pipelines using the tools provided, programmers and artists can use their existing workflows to generate builds of their code and game assets targeting HTML5 with Turbulenz APIs and test them on the local server. To play the locally developed games any developer running a local server can choose a configuration by visiting a web page on their computer. The process of making simple code changes and viewing the updated game is fast and often only requires the web page to be refreshed. Games can be shared with other computers on a local network by allowing access to the server.

**Remote**

Even during early stages of development, games can be deployed from the local server to the **Turbulenz Hub** service to share with collaborators outside of the developer's own local network. This can be anyone the project owner wants to allow to access their project and that has an account on the *Turbulenz Hub* for example other team members, external developers, 3rd parties, etc. All that is required is an account for the Turbulenz Hub and permission to access the project. By logging into the Hub, the game can be played allowing project members to collaborate and test during development.

**Live**

Once a version of the project is ready for a wider audience, the project owners can consider publishing the game to the **Turbulenz game site** (turbulenz.com). This can be either to a select group as a 'preview' or open to all users of the site. Once the game has been blessed by Turbulenz, developers can publish the game on the site via the Turbulenz Hub and can look at analytics gathered from the platform showing key information on how the game is being accessed on the site.

Users of turbulenz.com can play the published game from a range of :ref:`supported clients <requirements>`, streaming the required game data and interacting socially with other users via messages and notifications. For non-playing clients, users will still be able to keep up-to-date with their activites in game via a companion client. This will allow the users to continue to interact with the site.

In addition to the Turbulenz supported clients, 3rd party apps are able to access the platform via developer APIs allowing access to certain site features.


