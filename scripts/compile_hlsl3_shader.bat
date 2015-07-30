@echo off
rem Copyright (c) 2009-2015 Turbulenz Limited

set FXC=C:\Program Files (x86)\Windows Kits\8.1\bin\x86\fxc.exe

if not exist "%FXC%" (
  echo Cannot find shader compiler: "%FXC%"
  exit 1
)

set ENTRYPOINT=%1
set CGFXSOURCE=%2
set TYPE=%3
set INPUT=%4
set OUTPUT=%5
set LOG=%6
set MUTE=%7

if "%TYPE%" == "vertex" (
  set HLSL_PROFILE=vs_3_0
)
if "%TYPE%" == "fragment" (
  set HLSL_PROFILE=ps_3_0
)
if "%TYPE%" == "geometry" (
  set HLSL_PROFILE=gs_3_0
)

if "" == "%HLSL_PROFILE%" (
  echo Unknown shader type '%TYPE%'
  exit 1
)

rem echo "%FXC%" /nologo /O3 /WX /T %HLSL_PROFILE% /Fo %OUTPUT% %INPUT%
"%FXC%" /nologo /O3 /Fe %LOG% /T %HLSL_PROFILE% /Fo %OUTPUT% %INPUT% > %MUTE%
