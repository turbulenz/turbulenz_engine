// Copyright (c) 2013 Turbulenz Limited

// See notes in tzejectaheader.js

var appEntry = TurbulenzEngine.onload;
var appShutdown = TurbulenzEngine.onunload;
var canvas = document.getElementById('canvas');
TurbulenzEngine = WebGLTurbulenzEngine.create({
    canvas: canvas,
    fillParent: false
});

TurbulenzEngine.onload = appEntry;
TurbulenzEngine.onunload = appShutdown;
appEntry()
