
# Location of the Turbulenz checkout root
TZROOT := ../..

# Location of templates.  Each .js file in the templates dir
# represents an application to be built
TEMPLATES_DIR := templates

# Other directories from which code may be included
INCLUDE_DIRS := .

# Apps that do not have a canvas version
NON_CANVAS_APPS :=

# HACK (part1): Define a TSLIB for the scripts that need to get built
# from the samples dir.
externalscripts_src := \
  ../../samples/tsscripts/sceneloader.ts \
  ../../samples/tsscripts/motion.ts
TSLIBS += externalscripts
TS_OUTPUT_DIR := genscripts

# include the main application build file
include $(TZROOT)/scripts/appbuild.mk

# HACK (part2): Force the template files to depend on the
# externalscripts build.
$(JSFILES) : externalscripts
