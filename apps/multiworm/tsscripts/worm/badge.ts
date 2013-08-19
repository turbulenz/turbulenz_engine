// Copyright (c) 2011-2012 Turbulenz Limited

//
// Badge: Holds the current progress for the badge
//
class Badge
{
    isNonProgress: boolean;

    currentProgress: number;
    totalRequired: number;
    hasProgressed: boolean;

    predescription: string;
    description: string;
    title: string;
    isUpdating: boolean;

    // Update the status of the badge before updateuserbadgeprogress is called
    onBeforeSet()
    {
        this.isUpdating = true;
    }

    // After progress has been successfully set
    onSuccessfulSet(currentProgress)
    {
        this.isUpdating = false;
        if (currentProgress >= this.currentProgress)
        {
            this.hasProgressed = false;
        }
    }

    // After progress failed to be set
    onUnsuccessfulSet()
    {
        this.isUpdating = false;
    }

    // Adds to the progress of the badge
    addProgress()
    {
        this.currentProgress += 1;
        this.currentProgress = Math.min(this.totalRequired, this.currentProgress);
        this.hasProgressed = true;
    }

    // Updates the status of the badge before awardbadge is called
    award()
    {
        this.isUpdating = true;
    }

    // Tests if badge has been achieved
    isAchieved()
    {
        return this.currentProgress >= this.totalRequired;
    }

    static create(totalRequired: number, predescription: string,
                  description: string, title: string): Badge
    {
        var badge = new Badge();

        // If it is a progress badge
        if (!totalRequired)
        {
            badge.isNonProgress = true;
        }

        badge.currentProgress = 0;
        badge.totalRequired = totalRequired;
        badge.hasProgressed = false;

        badge.predescription = predescription;
        badge.description = description;
        badge.title = title;
        badge.isUpdating = false;

        return badge;
    }
}