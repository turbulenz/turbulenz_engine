// Copyright (c) 2011 Turbulenz Limited

interface OSDDocument extends Document
{
    osdStartLoading();
    osdStartSaving();
    osdStopLoading();
    osdStopSaving();
};

class OSD
{
    static version = 1;

    topLevelDocument: OSDDocument;

    startLoading()
    {
        try
        {
            var doc = this.topLevelDocument;
            if (doc && doc.osdStartLoading)
            {
                doc.osdStartLoading();
            }
        }
        catch (exception)
        {
            // Silently ignore - OSD methods may throw in cross-origin iframe contexts
        }
    }

    startSaving()
    {
        try
        {
            var doc = this.topLevelDocument;
            if (doc && doc.osdStartSaving)
            {
                doc.osdStartSaving();
            }
        }
        catch (exception)
        {
            // Silently ignore - OSD methods may throw in cross-origin iframe contexts
        }
    }

    stopLoading()
    {
        try
        {
            var doc = this.topLevelDocument;
            if (doc && doc.osdStopLoading)
            {
                doc.osdStopLoading();
            }
        }
        catch (exception)
        {
            // Silently ignore - OSD methods may throw in cross-origin iframe contexts
        }
    }

    stopSaving()
    {
        try
        {
            var doc = this.topLevelDocument;
            if (doc && doc.osdStopSaving)
            {
                doc.osdStopSaving();
            }
        }
        catch (exception)
        {
            // Silently ignore - OSD methods may throw in cross-origin iframe contexts
        }
    }

    // Constructor function
    static create(/* args */): OSD
    {
        var osdObject = new OSD();

        var topLevelWindow = window;
        var counter = 15;
        while (topLevelWindow.parent !== topLevelWindow && counter > 0)
        {
            topLevelWindow = topLevelWindow.parent;
            counter -= 1;
        }
        osdObject.topLevelDocument = <OSDDocument>(topLevelWindow.document);
        return osdObject;
    }
}
