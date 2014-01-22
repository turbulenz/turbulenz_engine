// Copyright (c) 2011-2012 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global Badge: false*/

//
// GameBadges: Class to manage game badges, and their html elements
//
class GameBadges
{
    badgesManager: BadgeManager;
    onInitialization: { (): void; };

    unachievedBadges: { [name: string]: Badge; };
    achievedBadges: { [name: string]: Badge; };

    // Stores badges that will be awarded irrespective of current progress
    awardedBadges: { [name: string]: boolean; };
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

    // Adds the badges structure into the element div
    init()
    {
        var that = this;

        function localInitialiseBadges(badges)
        {
            that.initialiseBadges(badges);
        }

        function localErrorCallback(msg, status)
        {
            that.initialiseBadgesErrorCallback(msg, status);
        }

        // Store and categorise badges
        this.badgesManager.listBadges(localInitialiseBadges, localErrorCallback);
    }

    // Error function when we fail to list & initialise badges
    initialiseBadgesErrorCallback(msg, status)
    {
        this.isActive = false;
        this.onInitialization();
    }

    // Add all badges to unachieved badge dictionary
    initialiseBadges(badges)
    {
        var that = this;
        var unachievedBadges = this.unachievedBadges;

        function localInitialiseUserBadges(badges)
        {
            that.initialiseUserBadges(badges);
        }

        function localErrorCallback(msg, status)
        {
            that.initialiseBadgesErrorCallback(msg, status);
        }

        var i;
        var name;
        var badge;

        var length = badges.length;
        for (i = 0; i < length; i += 1)
        {
            badge = badges[i];
            name = badge.key;

            // Create an unachieved badge
            unachievedBadges[name] = Badge.create(badge.total, badge.predescription, badge.description, badge.title);
        }

        // Add user badges to badges dictionary
        this.badgesManager.listUserBadges(localInitialiseUserBadges, localErrorCallback);
    }

    // Add user badges to unachieved and achieved badge dictionaries
    initialiseUserBadges(badges)
    {
        var achievedBadges = this.achievedBadges;
        var unachievedBadges = this.unachievedBadges;

        var i;
        var name;
        var badge;
        var unachievedBadge;

        var length = badges.length;
        for (i = 0; i < length; i += 1)
        {
            badge = badges[i];
            name = badge.badge_key;
            unachievedBadge = unachievedBadges[name];
            if (unachievedBadge !== undefined)
            {
                // If already achieved then store as such
                if (!badge.current ||
                    badge.current >= unachievedBadge.totalRequired)
                {
                    achievedBadges[name] = unachievedBadge;
                    delete unachievedBadges[name];
                }
                else
                {
                    // Create an unachieved badge
                    unachievedBadge.currentProgress = badge.current;
                }
            }
        }

        this.isActive = true;
        this.onInitialization();
    }

    // Adds a user badge (with how much they have achieved towards it)
    addBadge(badgeName)
    {
        var unachievedBadge;

        // If badge has not been achieved then update
        if (this.isActive &&
            !this.achievedBadges[badgeName])
        {
            unachievedBadge = this.unachievedBadges[badgeName];

            // If badge is non-progress then award it
            if (unachievedBadge.isNonProgress)
            {
                this.awardBadge(badgeName);
            }
            // Else update current badge progress
            else
            {
                unachievedBadge.addProgress();
                this.hasChanged = true;
            }
        }
    }

    // Awards a user badge no matter what the current progress
    awardBadge(badgeName)
    {
        if (this.isActive &&
            !this.achievedBadges[badgeName])
        {
            this.awardedBadges[badgeName] = true;
            this.hasChanged = true;
        }
    }

    // Updates the state of all badges
    refresh()
    {
        var that = this;
        var unachievedBadges = this.unachievedBadges;
        var awardedBadges = this.awardedBadges;
        var badgesManager = this.badgesManager;

        var badge;
        var unachievedBadge;

        function localUpdateUserBadgeProgressCallback(badge)
        {
            that.updateUserBadgeProgressCallback(badge);
        }

        function localAwardUserBadgeCallback(badge)
        {
            that.awardUserBadgeCallback(badge);
        }

        function localUpdateUserBadgeErrorCallback(msg, status, badge)
        {
            that.updateUserBadgeErrorCallback(msg, status, badge);
        }

        function localAwardUserBadgeErrorCallback(msg, status, badge)
        {
            that.awardUserBadgeErrorCallback(msg, status, badge);
        }

        // Set awarded badges first
        for (badge in awardedBadges)
        {
            if (awardedBadges.hasOwnProperty(badge) &&
                !unachievedBadges[badge].isUpdating)
            {
                unachievedBadges[badge].award();
                badgesManager.awardUserBadge(badge, localAwardUserBadgeCallback, localAwardUserBadgeErrorCallback);
            }
        }

        // Update badges which have been incremented
        for (badge in unachievedBadges)
        {
            if (unachievedBadges.hasOwnProperty(badge))
            {
                unachievedBadge = unachievedBadges[badge];

                if (!unachievedBadge.isUpdating &&
                    unachievedBadge.hasProgressed)
                {
                    unachievedBadge.onBeforeSet();

                    badgesManager.updateUserBadgeProgress(badge, unachievedBadge.currentProgress,
                                               localUpdateUserBadgeProgressCallback, localUpdateUserBadgeErrorCallback);
                }
            }
        }
    }

    // Callback when user badge has been added
    updateUserBadgeProgressCallback(badge)
    {
        var unachievedBadges = this.unachievedBadges;
        var badgeName = badge.badge_key;
        var unachievedBadge = unachievedBadges[badgeName];

        this.hasConnection = true;

        unachievedBadge.onSuccessfulSet(badge.current);

        // Used for writing html output on local
        this.hasChangedData = true;

        // If badge is now achieved
        if (unachievedBadge.isAchieved())
        {
            this.achievedBadges[badgeName] = unachievedBadges[badgeName];
            delete unachievedBadges[badgeName];
        }
    }

    // Error callback when user badge failed to add
    updateUserBadgeErrorCallback(msg, status, badgeData)
    {
        var badgeName = badgeData[0];
        var unachievedBadge = this.unachievedBadges[badgeName];

        this.hasConnection = false;
        this.hasChanged = true;

        unachievedBadge.onUnsuccessfulSet();
    }

    // Callback when user badge has been awarded
    awardUserBadgeCallback(badge)
    {
        var badgeName = badge.badge_key;

        this.achievedBadges[badgeName] = this.unachievedBadges[badgeName];
        delete this.unachievedBadges[badgeName];
        delete this.awardedBadges[badgeName];

        this.hasConnection = true;
        this.hasChangedData = true;
    }

    // Callback when user badge has been awarded
    awardUserBadgeErrorCallback(msg, status, badgeData)
    {
        var badgeName = badgeData[0];

        this.hasConnection = false;
        this.hasChanged = true;

        this.unachievedBadges[badgeName].onUnsuccessfulSet();
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
                this.lastUpdateTime = currentTime;
                this.hasChanged = false;
                this.refresh();
            }
        }
    }

    static create(badgesManager, onInitialization): GameBadges
    {
        var gameBadges = new GameBadges();

        gameBadges.badgesManager = badgesManager;
        gameBadges.onInitialization = onInitialization;

        gameBadges.unachievedBadges = {};
        gameBadges.achievedBadges = {};

        // Stores badges that will be awarded irrespective of current progress
        gameBadges.awardedBadges = {};

        gameBadges.hasChanged = true;

        // Used to know when to write html output
        gameBadges.hasChangedData = true;

        // True only if we have a leaderboard manager, and we are initialised
        gameBadges.isActive = false;

        // Vars to manage situation where connection to badges server is lost
        gameBadges.hasConnection = true;
        gameBadges.updateInterval = 1;
        gameBadges.maxInterval = 120;
        gameBadges.lastUpdateTime = TurbulenzEngine.time;

        if (badgesManager)
        {
            gameBadges.init();
        }
        else
        {
            onInitialization();
        }

        return gameBadges;
    }
}