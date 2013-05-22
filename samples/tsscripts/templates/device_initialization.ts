/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Device initialization
 * @description:
 * This sample shows how to create all the Turbulenz devices and how to discover the OS version and the hardware capabilities.
*/

/*global TurbulenzEngine: true */

TurbulenzEngine.onload = function onloadFn()
{
    var systemInfo = TurbulenzEngine.getSystemInfo();

    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    var physicsDeviceParameters = { };
    var physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);

    var dynamicsWorldParameters = { };
    var dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);

    var soundDeviceParameters = { };
    var soundDevice = TurbulenzEngine.createSoundDevice(soundDeviceParameters);

    var inputDeviceParameters = { };
    var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    var plDiv = document.getElementById("pl_details");

    plDiv.innerHTML = "<h3>Turbulenz Engine Details<\/h3>";

    plDiv.innerHTML +=
        "<ul>" +
        "<li>Version: " + TurbulenzEngine.version + "<\/li>" +
        "<\/ul>";

    var sysDiv = document.getElementById("sys_details");

    sysDiv.innerHTML = "<h3>System Details<\/h3>";

    sysDiv.innerHTML +=
        "<ul>" +
        "<li>CpuDescription: "     + systemInfo.cpuDescription + "<\/li>" +
        "<li>CpuVendor: "          + systemInfo.cpuVendor + "<\/li>" +
        "<li>NumPhysicalCores: "   + systemInfo.numPhysicalCores + "<\/li>" +
        "<li>NumLogicalCores: "    + systemInfo.numLogicalCores + "<\/li>" +
        "<li>RamInMegabytes: "     + systemInfo.ramInMegabytes + "<\/li>" +
        "<li>FrequencyInMegaHz: "  + systemInfo.frequencyInMegaHZ + "<\/li>" +
        "<li>EngineArchitecture: " + systemInfo.architecture + "<\/li>" +
        "<li>OSName: "             + systemInfo.osName + "<\/li>" +
        "<li>OSVersionMajor: "     + systemInfo.osVersionMajor + "<\/li>" +
        "<li>OSVersionMinor: "     + systemInfo.osVersionMinor + "<\/li>" +
        "<li>OSVersionBuild: "     + systemInfo.osVersionBuild + "<\/li>" +
        "<li>UserLocale: "         + systemInfo.userLocale + "<\/li>" +
        "<\/ul>";

    var gdDiv = document.getElementById("gd_details");

    gdDiv.innerHTML = "<h3>Graphics Device Details<\/h3>";
    if (graphicsDevice)
    {
        gdDiv.innerHTML +=
            "<ul>" +
            "<li>Vendor: "           + graphicsDevice.vendor          + "<\/li>" +
            "<li>Renderer: "         + graphicsDevice.renderer        + "<\/li>" +
            "<li>Renderer Version: " + graphicsDevice.rendererVersion + "<\/li>" +
            "<li>Shading Language Version: " + graphicsDevice.shadingLanguageVersion + "<\/li>" +
            "<li>Video Ram: " + graphicsDevice.videoRam + " MB<\/li>" +
            "<li>OCCLUSION_QUERIES: " + graphicsDevice.isSupported("OCCLUSION_QUERIES") + " <\/li>" +
            "<li>NPOT_MIPMAPPED_TEXTURES: " + graphicsDevice.isSupported("NPOT_MIPMAPPED_TEXTURES") + " <\/li>" +
            "<li>TEXTURE_DXT1: " + graphicsDevice.isSupported("TEXTURE_DXT1") + " <\/li>" +
            "<li>TEXTURE_DXT3: " + graphicsDevice.isSupported("TEXTURE_DXT3") + " <\/li>" +
            "<li>TEXTURE_DXT5: " + graphicsDevice.isSupported("TEXTURE_DXT5") + " <\/li>" +
            "<li>TEXTURE_ETC1: " + graphicsDevice.isSupported("TEXTURE_ETC1") + " <\/li>" +
            "<li>INDEXFORMAT_UINT: " + graphicsDevice.isSupported("INDEXFORMAT_UINT") + " <\/li>" +
            "<li>ANISOTROPY: " + graphicsDevice.maxSupported("ANISOTROPY") + " <\/li>" +
            "<li>TEXTURE_SIZE: " + graphicsDevice.maxSupported("TEXTURE_SIZE") + " <\/li>" +
            "<li>CUBEMAP_TEXTURE_SIZE: " + graphicsDevice.maxSupported("CUBEMAP_TEXTURE_SIZE") + " <\/li>" +
            "<li>3D_TEXTURE_SIZE: " + graphicsDevice.maxSupported("3D_TEXTURE_SIZE") + " <\/li>" +
            "<li>RENDERTARGET_COLOR_TEXTURES: " + graphicsDevice.maxSupported("RENDERTARGET_COLOR_TEXTURES") + " <\/li>" +
            "<li>RENDERBUFFER_SIZE: " + graphicsDevice.maxSupported("RENDERBUFFER_SIZE") + " <\/li>" +
            "<li>FILEFORMAT_WEBM: " + graphicsDevice.isSupported("FILEFORMAT_WEBM") + " <\/li>" +
            "<li>FILEFORMAT_MP4: " + graphicsDevice.isSupported("FILEFORMAT_MP4") + " <\/li>" +
            "<li>FILEFORMAT_JPG: " + graphicsDevice.isSupported("FILEFORMAT_JPG") + " <\/li>" +
            "<li>FILEFORMAT_PNG: " + graphicsDevice.isSupported("FILEFORMAT_PNG") + " <\/li>" +
            "<li>FILEFORMAT_DDS: " + graphicsDevice.isSupported("FILEFORMAT_DDS") + " <\/li>" +
            "<li>FILEFORMAT_TGA: " + graphicsDevice.isSupported("FILEFORMAT_TGA") + " <\/li>" +
            "<li>Extensions: " + graphicsDevice.extensions + "<\/li>" +
            "<\/ul>";
    }
    else
    {
        gdDiv.innerHTML +=
            "<ul>" +
            "<li>No GraphicsDevice support<\/li>" +
            "<\/ul>";
    }

    var pdDiv = document.getElementById("pd_details");

    pdDiv.innerHTML = "<h3>Physics Device Details<\/h3>";

    var gravity = dynamicsWorld.gravity;
    pdDiv.innerHTML +=
        "<ul>" +
        "<li>Vendor: " + physicsDevice.vendor + "<\/li>" +
        "<li>Version: " + physicsDevice.version + "<\/li>" +
        "<li>MaxSubSteps: "  + dynamicsWorld.maxSubSteps  + "<\/li>" +
        "<li>FixedTimeStep: " + dynamicsWorld.fixedTimeStep + "<\/li>" +
        "<li>Gravity: [" + gravity[0] + ", " + gravity[1] + ", " + gravity[2] + "]<\/li>" +
        "<\/ul>";

    var sdDiv = document.getElementById("sd_details");

    sdDiv.innerHTML = "<h3>Sound Device Details<\/h3>";

    if (soundDevice)
    {
        var transform = soundDevice.listenerTransform;
        var transformString = "<li>ListenerTransform: [" +
                transform[0] + ", " + transform[1] + ", " + transform[2] + ", " +
                transform[3] + ", " + transform[4] + ", " + transform[5] + ", " +
                transform[6] + ", " + transform[7] + ", " + transform[8] + ", " +
                transform[9] + ", " + transform[10] + ", " + transform[11] +
                "]<\/li>";

        var velocity = soundDevice.listenerVelocity;

        sdDiv.innerHTML +=
            "<ul>" +
            "<li>Vendor: " + soundDevice.vendor + "<\/li>" +
            "<li>Renderer: " + soundDevice.renderer + "<\/li>" +
            "<li>Version: " + soundDevice.version + "<\/li>" +
            "<li>Device: " + soundDevice.deviceSpecifier + "<\/li>" +
            "<li>Frequency: " + soundDevice.frequency + "<\/li>" +
            "<li>DopplerFactor: " + soundDevice.dopplerFactor + "<\/li>" +
            "<li>DopplerVelocity: " + soundDevice.dopplerVelocity + "<\/li>" +
            "<li>SpeedOfSound: " + soundDevice.speedOfSound + "<\/li>" +
            "<li>ListenerGain: " + soundDevice.listenerGain + "<\/li>" +
            transformString +
            "<li>ListenerVelocity: [" + velocity[0] + ", " + velocity[1] + ", " + velocity[2] + "]<\/li>" +
            "<li>FILEFORMAT_OGG: " + soundDevice.isSupported("FILEFORMAT_OGG") + " <\/li>" +
            "<li>FILEFORMAT_MP3: " + soundDevice.isSupported("FILEFORMAT_MP3") + " <\/li>" +
            "<li>FILEFORMAT_WAV: " + soundDevice.isSupported("FILEFORMAT_WAV") + " <\/li>" +
            "<li>Extensions: " + soundDevice.extensions + "<\/li>" +
            "<\/ul>";
    }
    else
    {
        sdDiv.innerHTML +=
            "<ul>" +
            "<li>No SoundDevice support<\/li>" +
            "<\/ul>";
    }

    var idDiv = document.getElementById("id_details");

    idDiv.innerHTML = "<h3>Input Device Details<\/h3>";
    idDiv.innerHTML +=
        "<ul>" +
        "<li>POINTER_LOCK: " + inputDevice.isSupported("POINTER_LOCK") + "<\/li>" +
        "<\/ul>";
};
