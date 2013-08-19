// Copyright (c) 2011-2012 Turbulenz Limited

//
// Leaderboard: Holds the current score, new score and set score logic for a leaderboard
//
class Leaderboard
{
    sortBy: number;
    title: string;
    isUpdating: boolean;
    newScore: number;

    currentScore: number;
    setScore: { (score: number): void; };
    hasImprovedScore: () =>boolean;

    // Before the leaderboard set call is made
    onBeforeSet()
    {
        this.isUpdating = true;
    }

    // When leaderboard set callback is made
    onSuccessfulSet(bestScore)
    {
        this.currentScore = bestScore;
        this.isUpdating = false;
    }

    // When leaderboard set failed
    onUnsuccessfulSet()
    {
        this.isUpdating = false;
    }

    static create(sortBy, title)
    {
        var leaderboard = new Leaderboard();

        leaderboard.sortBy = sortBy;
        leaderboard.title = title;
        leaderboard.isUpdating = false;

        function setHighScore(score)
        {
            if (score > this.newScore)
            {
                this.newScore = score;
            }
        }

        function setLowScore(score)
        {
            if (score < this.newScore ||
                !this.newScore)
            {
                this.newScore = score;
            }
        }

        function hasImprovedHighScore()
        {
            if (this.newScore > this.currentScore)
            {
                return true;
            }

            return false;
        }

        function hasImprovedLowScore()
        {
            if (this.newScore < this.currentScore ||
                this.newScore && !this.currentScore)
            {
                return true;
            }

            return false;
        }

        if (sortBy > 0)
        {
            leaderboard.currentScore = 0;
            leaderboard.newScore = 0;
            leaderboard.setScore = setHighScore;
            leaderboard.hasImprovedScore = hasImprovedHighScore;
        }
        else
        {
            leaderboard.currentScore = null;
            leaderboard.newScore = null;
            leaderboard.setScore = setLowScore;
            leaderboard.hasImprovedScore = hasImprovedLowScore;
        }

        return leaderboard;
    }
}