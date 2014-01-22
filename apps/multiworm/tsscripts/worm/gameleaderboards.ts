// Copyright (c) 2011-2012 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global Leaderboard: false*/

//
// Leaderboard: Hold the html elements to write the leaderboard to and writes to them
//
class GameLeaderboards
{
    leaderboardManager: LeaderboardManager;
    onInitialization: { (): void; };

    leaderboards: { [name: string]: Leaderboard; };
    hasChanged: boolean;

    // Used to know when to write html output
    hasChangedData: boolean;

    // True only if we have a leaderboard manager, and we are initialised
    isActive: boolean;

    // Vars to manage situation where connection to badges server is lost
    hasConnection: boolean;
    updateInterval: number;
    maxInterval: number;
    lastUpdateTime: number;

    // Adds the leadboard structure into the element div
    init()
    {
        var that = this;
        var meta = this.leaderboardManager.meta;
        var leaderboards = this.leaderboards;
        var leaderboard;
        var spec =
        {
            friendsOnly: true
        };

        function initialiseLeaderboards(leaderboardArray)
        {
            that.initialiseLeaderboards(leaderboardArray);
        }

        function localErrorCallback(msg, status)
        {
            that.initialiseLeaderboardsErrorCallback(msg, status);
        }

        // Store leaderboards from meta
        for (leaderboard in meta)
        {
            if (meta.hasOwnProperty(leaderboard))
            {
                leaderboards[leaderboard] = Leaderboard.create(meta[leaderboard].sortBy, meta[leaderboard].title);
            }
        }

        // Add leaderboards to leaderboards dictionary
        this.leaderboardManager.getOverview(spec, initialiseLeaderboards, localErrorCallback);
    }

    // Error function when we fail to list & initialise badges
    initialiseLeaderboardsErrorCallback(msg, status)
    {
        this.isActive = false;
        this.onInitialization();
    }

    // Setup the dictionary to current leaderboard states
    initialiseLeaderboards(leaderboardArray)
    {
        var length = leaderboardArray.length;
        var leaderboards = this.leaderboards;
        var score;
        var leaderboard;
        var currentLeaderboard;
        var leaderboardName;

        var i;

        for (i = 0; i < length; i += 1)
        {
            leaderboard = leaderboardArray[i];
            score = leaderboard.score;
            leaderboardName = leaderboard.key;
            currentLeaderboard = leaderboards[leaderboardName];

            currentLeaderboard.currentScore = score;
            currentLeaderboard.newScore = score;
        }

        this.isActive = true;
        this.onInitialization();
    }

    // Updates the specified leaderboard with the new score provided
    setScore(leaderboardName, score)
    {
        if (this.isActive)
        {
            var leaderboard = this.leaderboards[leaderboardName];
            leaderboard.setScore(score);
            this.hasChanged = true;
        }
    }

    // Sends all new leaderboard data
    refresh()
    {
        var leaderboards = this.leaderboards;

        var leaderboardName;
        var leaderboard;

        // Refresh each leaderboard if there is a newscore
        for (leaderboardName in leaderboards)
        {
            if (leaderboards.hasOwnProperty(leaderboardName))
            {
                leaderboard = leaderboards[leaderboardName];

                if (!leaderboard.isUpdating &&
                    leaderboard.hasImprovedScore())
                {
                    leaderboard.onBeforeSet();
                    this.refreshLeaderboard(leaderboardName, leaderboard.newScore);
                }
            }
        }
    }

    // Sends the data for the specified leaderboard
    refreshLeaderboard(leaderboardName, score)
    {
        var that = this;

        function localSetLeaderboardCallback(key, score, newBest, bestScore)
        {
            that.setLeaderboardCallback(key, score, newBest, bestScore);
        }

        function localSetErrorCallback(msg, status, setFunction, leaderboard)
        {
            that.setErrorCallback(msg, status, setFunction, leaderboard);
        }

        this.leaderboardManager.set(leaderboardName, score, localSetLeaderboardCallback, localSetErrorCallback);
    }

    // Update function called in main loop
    update(currentTime)
    {
        var updateInterval = this.updateInterval;

        if (this.isActive &&
            this.hasChanged)
        {
            if (!this.hasConnection)
            {
                if (currentTime - this.lastUpdateTime > updateInterval)
                {
                    this.updateInterval = Math.min((updateInterval * 2), this.maxInterval);
                    this.lastUpdateTime = currentTime;
                    this.refresh();
                }
            }
            else
            {
                this.hasChanged = false;
                this.lastUpdateTime = currentTime;
                this.refresh();
            }
        }
    }

    // After successful leaderboard set
    setLeaderboardCallback(key, score, newBest, bestScore)
    {
        var leaderboard = this.leaderboards[key];
        leaderboard.onSuccessfulSet(bestScore);

        // Used for writing html output on local
        this.hasChangedData = true;

        this.hasConnection = true;
    }

    // Error callback - uses window alert
    setErrorCallback(msg, status, setFunction, leaderboardData)
    {
        var leaderboardName = leaderboardData[0];
        var leaderboard = this.leaderboards[leaderboardName];

        leaderboard.onUnsuccessfulSet();

        this.hasConnection = false;
        this.hasChanged = true;
    }

    static create(leaderboardManager, onInitialization)
    {
        var gameLeaderboards = new GameLeaderboards();

        gameLeaderboards.leaderboardManager = leaderboardManager;
        gameLeaderboards.onInitialization = onInitialization;

        gameLeaderboards.leaderboards = {};
        gameLeaderboards.hasChanged = true;

        // Used to know when to write html output
        gameLeaderboards.hasChangedData = true;

        // True only if we have a leaderboard manager, and we are initialised
        gameLeaderboards.isActive = false;

        // Vars to manage situation where connection to badges server is lost
        gameLeaderboards.hasConnection = true;
        gameLeaderboards.updateInterval = 1;
        gameLeaderboards.maxInterval = 120;
        gameLeaderboards.lastUpdateTime = TurbulenzEngine.time;

        // Test if we were passed a valid leaderboard manager
        if (leaderboardManager)
        {
            gameLeaderboards.init();
        }
        else
        {
            onInitialization();
        }

        return gameLeaderboards;
    }
}