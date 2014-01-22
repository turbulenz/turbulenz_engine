// Copyright (c) 2011-2012 Turbulenz Limited

//
// HtmlWriter: Class to format and write badge and leaderboard data to page
//
class HtmlWriter
{
    leaderboards: GameLeaderboards;
    badges: GameBadges;
    game: Game;

    leaderboardsDiv: HTMLElement;
    badgesDiv: HTMLElement;
    scoreDiv: HTMLElement;
    killsDiv: HTMLElement;
    leaderboardDivs: { [name: string]: HTMLElement; };
    badgeDivs: { [name: string]: HTMLElement; };

    // To avoid writing to the page if run as tzjs
    runAsTzjs: boolean;

    init(scoreDivID, killsDivID, leaderboardDivId, badgesDivId)
    {
        var unachievedBadges = this.badges.unachievedBadges;
        var achievedBadges = this.badges.achievedBadges;
        var unachievedBadge;
        var achievedBadge;
        var leaderboards = this.leaderboards.leaderboards;
        var leaderboardDivs = this.leaderboardDivs;
        var badgeDivs = this.badgeDivs;

        var leaderboardDiv;
        var badgeDiv;
        var leaderboard;
        var badge;

        this.scoreDiv = document.getElementById(scoreDivID);
        this.killsDiv = document.getElementById(killsDivID);
        this.leaderboardsDiv = document.getElementById(leaderboardDivId);
        this.badgesDiv = document.getElementById(badgesDivId);

        if (!this.scoreDiv ||
            !this.killsDiv ||
            !this.leaderboardsDiv ||
            !this.badgesDiv)
        {
            this.runAsTzjs = true;
            return;
        }

        // Add each leaderboard
        for (leaderboard in leaderboards)
        {
            if (leaderboards.hasOwnProperty(leaderboard))
            {
                leaderboardDiv =
                {
                    name : leaderboard,
                    title : leaderboards[leaderboard].title,
                    dataDiv : null
                };

                leaderboardDivs[leaderboard] = leaderboardDiv;

                this.addLeaderboardHtml(leaderboardDiv);
            }
        }

        // Add each achieved badge
        for (badge in achievedBadges)
        {
            if (achievedBadges.hasOwnProperty(badge))
            {
                achievedBadge = achievedBadges[badge];

                badgeDiv =
                {
                    name : badge,
                    title: achievedBadge.title,
                    dataDiv : null
                };
                badgeDivs[badge] = badgeDiv;

                this.addBadgeHtml(badgeDiv);
            }
        }

        // Add each unachieved badge
        for (badge in unachievedBadges)
        {
            if (unachievedBadges.hasOwnProperty(badge))
            {
                unachievedBadge = unachievedBadges[badge];

                badgeDiv =
                {
                    name : badge,
                    title: unachievedBadge.title,
                    dataDiv : null
                };
                badgeDivs[badge] = badgeDiv;

                this.addBadgeHtml(badgeDiv);
            }
        }
    }

    // Creates html structure for a leaderboard
    addLeaderboardHtml(leaderboard)
    {
        var leaderboardName = leaderboard.name;
        var leaderboardTitle = leaderboard.title;
        var leaderboardNameDiv;
        var leaderboardDiv;
        var leaderboardDataDiv;
        var leaderboardsDiv = this.leaderboardsDiv;

        // Adds the div
        leaderboardDiv = document.createElement("div");
        leaderboardDiv.id = leaderboardName;
        leaderboardDiv.className = "leaderboard-block";
        leaderboardsDiv.appendChild(leaderboardDiv);

        // Adds the title div
        leaderboardNameDiv = document.createElement("div");
        leaderboardNameDiv.className = "leaderboard-block-title";
        this.writeTextContent(leaderboardNameDiv, leaderboardTitle);
        leaderboardDiv.appendChild(leaderboardNameDiv);

        // Adds the leaderboard content div
        leaderboardDataDiv = document.createElement("span");
        leaderboard.dataDiv = leaderboardDataDiv;
        leaderboardDataDiv.id = (leaderboardName + "_data");
        leaderboardDataDiv.className = "leaderboard-block-score";
        leaderboardDiv.appendChild(leaderboardDataDiv);
    }

    // Creates html structure for a badge
    addBadgeHtml(badge)
    {
        var badgeName = badge.name;
        var badgeTitle = badge.title;
        var badgeDiv;
        var badgeWrapperDiv;
        var badgeNameDiv;
        var badgeDescriptionDiv;
        var badgeDataDiv;
        var badgesDiv = this.badgesDiv;

        // Adds the div
        badgeDiv = document.createElement("div");
        badgeDiv.id = badgeName;
        badgeDiv.className = "badge-block";
        badgesDiv.appendChild(badgeDiv);

        // Add the title + description wrapper
        badgeWrapperDiv = document.createElement("div");
        badgeWrapperDiv.className = "badge-block-wrapper";
        badgeDiv.appendChild(badgeWrapperDiv);

        // Add the title div
        badgeNameDiv = document.createElement("div");
        badgeNameDiv.className = "badge-block-title";
        this.writeTextContent(badgeNameDiv, badgeTitle);
        badgeWrapperDiv.appendChild(badgeNameDiv);

        // Add the description div
        badgeDescriptionDiv = document.createElement("div");
        badge.descriptionDiv = badgeDescriptionDiv;
        badgeDescriptionDiv.id = badgeName + "_description";
        badgeDescriptionDiv.className = "badge-block-description";
        badgeWrapperDiv.appendChild(badgeDescriptionDiv);

        // Adds the badge content div
        badgeDataDiv = document.createElement("div");
        badge.dataDiv = badgeDataDiv;
        badgeDataDiv.id = badgeName + "_data";
        badgeDataDiv.className = "badge-block-progress";
        badgeDiv.appendChild(badgeDataDiv);
    }

    // (Re)Writes the current score html
    writeScore()
    {
        this.writeTextContent(this.scoreDiv, this.game.score);
        this.writeTextContent(this.killsDiv, this.game.kills);
    }

    // (Re)Writes all leaderboards html
    writeLeaderboards()
    {
        var leaderboards = this.leaderboards.leaderboards;

        var leaderboard;

        for (leaderboard in leaderboards)
        {
            if (leaderboards.hasOwnProperty(leaderboard))
            {
                this.writeLeaderboard(leaderboard);
            }
        }
    }

    // (Re)Writes all badges html
    writeBadges()
    {
        var achievedBadges = this.badges.achievedBadges;
        var unachievedBadges = this.badges.unachievedBadges;

        var badge;

        for (badge in achievedBadges)
        {
            if (achievedBadges.hasOwnProperty(badge))
            {
                this.writeAchievedBadge(badge);
            }
        }

        for (badge in unachievedBadges)
        {
            if (unachievedBadges.hasOwnProperty(badge))
            {
                this.writeUnachievedBadge(badge);
            }
        }
    }

    // (Re)Write leaderboard html content
    writeLeaderboard(leaderboardName)
    {
        var leaderboard = this.leaderboards.leaderboards[leaderboardName];
        var leaderboardString = "";

        // Create leaderboard data string
        if (leaderboard.currentScore)
        {
            leaderboardString += leaderboard.currentScore.toFixed(0);
        }
        else
        {
            leaderboardString += "None set";
        }

        this.writeTextContent(this.leaderboardDivs[leaderboardName]['dataDiv'], leaderboardString);
    }

    // (Re)Write achieved badge html content
    writeAchievedBadge(badgeName)
    {
        var badge = this.badges.achievedBadges[badgeName];
        var badgeDiv = this.badgeDivs[badgeName];
        var badgeString = "";

        badgeString += "Got this!";

        this.writeTextContent(badgeDiv['dataDiv'], badgeString);
        this.writeTextContent(badgeDiv['descriptionDiv'], badge.description);
    }

    // (Re)Write unachieved badge html content
    writeUnachievedBadge(badgeName)
    {
        var badge = this.badges.unachievedBadges[badgeName];
        var badgeDiv = this.badgeDivs[badgeName];
        var badgeProgress = badge.currentProgress ? badge.currentProgress.toString(10) : "0";
        var badgeString = "";
        var badgeDescription = badge.predescription || badge.description;

        // Create badge data string
        if (badge.totalRequired)
        {
            badgeString += badgeProgress;
            badgeString += "/";
            badgeString += badge.totalRequired.toString(10);
        }
        else
        {
            badgeString += "Unachieved";
        }

        this.writeTextContent(badgeDiv['dataDiv'], badgeString);
        this.writeTextContent(badgeDiv['descriptionDiv'], badgeDescription);
    }

    // Writes text to element specified
    writeTextContent(element, value)
    {
        var content;

        if (!element)
        {
            return;
        }

        content = element.textContent;

        if (value !== undefined)
        {
            // Check if text content is defined (not in ie)
            if (content !== undefined)
            {
                element.textContent = value;
            }
            else
            {
                element.innerText = value;
            }
        }
    }

    // Refreshed the score/leaderboards/badges html content if necessary
    update()
    {
        if (this.runAsTzjs)
        {
            return;
        }

        var leaderboards = this.leaderboards;
        var badges = this.badges;
        var game = this.game;

        if (leaderboards.hasChangedData)
        {
            leaderboards.hasChangedData = false;
            this.writeLeaderboards();
        }

        if (badges.hasChangedData)
        {
            badges.hasChangedData = false;
            this.writeBadges();
        }

        if (game.hasChangedScore)
        {
            game.hasChangedScore = false;
            this.writeScore();
        }
    }

    static create(leaderboards, badges, game): HtmlWriter
    {
        var htmlWriter = new HtmlWriter();

        htmlWriter.leaderboards = leaderboards;
        htmlWriter.badges = badges;
        htmlWriter.game = game;

        htmlWriter.leaderboardsDiv = null;
        htmlWriter.badgesDiv = null;
        htmlWriter.scoreDiv = null;
        htmlWriter.killsDiv = null;

        htmlWriter.leaderboardDivs = {};
        htmlWriter.badgeDivs = {};

        // To avoid writing to the page if run as tzjs
        htmlWriter.runAsTzjs = false;

        htmlWriter.init("scores", "kills", "leaderboards", "badges");

        return htmlWriter;
    }
}