############################################################
# Basic variables and checks
############################################################

ifeq ($(TZROOT),)
  $(error You must set TZROOT before including appbuild.mk)
endif

MODE ?= all
COMPACTOR ?= uglifyjs
BUILD_DIR ?= _build
NOSTRIP ?=

# This avoids problems where sh.exe exists in the path, but spaces in
# it.  This can be removed once this file uses tzbuild.
_shell_base := $(notdir $(SHELL))
ifneq (,$(filter %.exe,$(_shell_base)))
  override SHELL := cmd.exe
endif
############################################################
# Set up tzbuild for any TypeScript stuff we need
############################################################

BUILDDIR := $(TZROOT)/external/tzbuild
TS_BASE_FILES += $(wildcard $(TZROOT)/jslib-modular/*.d.ts)

# Set for the refcheck build
TS_SRC_DIR := tsscripts

# Only set the output dir based on whether we are doing a refcheck or
# not.

ifeq (1,$(TS_REFCHECK))
  TS_OUTPUT_DIR := _build/scripts-refcheck
else
  # Allow the client to override the output destination
  ifeq (,$(TS_OUTPUT_DIR))
    TS_OUTPUT_DIR := scripts
  endif
endif

# Ensure the templates dir is included if this is a TS build

ifneq (,$(TSAPPS)$(TSLIBS))
  INCLUDE_DIRS += templates
endif

include $(BUILDDIR)/config.mk

############################################################
# Tools
############################################################

# _dir_marker - common tzbuild function
# _mkdir_rule - common tzbuild function

INCLUDE_DIRS := $(sort $(INCLUDE_DIRS) .)
TEMPLATE_FLAGS = $(foreach d,$(TEMPLATES_DIR) $(INCLUDE_DIRS),-t $(d))
MAKETZJS_FLAGS :=

MAKETZJS := maketzjs
MAKEHTML := makehtml

ifeq ($(OS),Windows_NT)
  $(call log,WINDOWS)
  MAKETZJS := python -m turbulenz_tools.tools.maketzjs
  MAKEHTML := python -m turbulenz_tools.tools.makehtml
else
  $(call log,UNIX)
endif

# Make use of the _version files if they exist
maketzjs_version := $(wildcard build/default/maketzjs.dep)
makehtml_version := $(wildcard build/default/makehtml.dep)

ifeq ($(COMPACTOR),uglifyjs)
  $(call log,Enabling uglifyjs compactor)
  COMPACTOR_FLAGS := -u $(TZROOT)/external/uglifyjs/bin/uglifyjs
endif

ifeq ($(COMPACTOR),yui)
  $(call log,Enabling yuicompressor compactor)
  COMPACTOR_FLAGS := -y \
    $(TZROOT)/external/yuicompressor/yuicompressor-2.4.2/yuicompressor-2.4.2.jar
endif

ifeq ($(COMPACTOR),none)
  $(call log,Disabling compactor)
endif

ifeq ($(NOSTRIP),1)
  MAKETZJS_FLAGS += --no-strip-debug
else
  MAKETZJS_FLAGS += --strip-debug $(TZROOT)/tools/scripts/strip-debug
endif

############################################################
# Functions
############################################################

##################################################
# Debugging output
ifeq ($(BUILDVERBOSE),1)
  log=$(warning $(1))
endif
#
##################################################

##################################################
# Sets the input and output file names for an app given the
# .js filename and adds it to the JSAPPS variable
#
# 1 - app name
# 2 - .js file
define _set_app_files

  $(call log,_set_app_files "$(1)" "$(2)")
  $(1)_js ?= $(2)
  $(1)_html ?= $(wildcard $(2:.js=.html))
  $(1)_out_html := $(1).$(HTML_EXT)
  $(1)_out_code := $(1).$(CODE_EXT)
  $(1)_out_html_deps := $(BUILD_DIR)/$(MODE)/$(strip $(1)).$(HTML_EXT).deps
  $(1)_out_code_deps := $(BUILD_DIR)/$(MODE)/$(strip $(1)).$(CODE_EXT).deps

  JSAPPS += $(1)

endef
#
##################################################

############################################################
# Handle a TSAPPS decl.
#
# tzbuild has already been included, so all information is available.
#
# 1 - tsapp name
define _handle_tsapp

  JSFILES += $(_$(1)_out_js)
  EXTERNAL_SCRIPTFILES += $($(1)_external_scripts)
  NON_CANVAS_APPS += $(if $(filter 1,$($(1)_nocanvas)),$(1))

endef
#
############################################################

##################################################
# Defines the rules to build an HTML file
#
# 1 - app name
#
define _create_html_rule

  $(call _mkdir_rule,$(dir $($(1)_out_html_deps)))

  # Command to build <app>_out_html_deps file
  $($(1)_out_html_deps) : $($(1)_js) $($(1)_html) $(external_scriptfiles) \
   | install_jslib $(call _dir_marker,$(dir $($(1)_out_html_deps)))
	@echo "[HTML ] (dep)" $$@
	$(CMDPREFIX)$(MAKEHTML) $(TEMPLATE_FLAGS)    \
      --mode=$(MODE) -M --MF $$@     \
      -o $($(1)_out_html) $($(1)_js) $($(1)_html)

  # Command to build the final html file
  $($(1)_out_html) : $($(1)_js) $($(1)_html) $(external_scriptfiles) $(makehtml_version) \
   | install_jslib
	@echo "[HTML ]" $$@
	$(CMDPREFIX)$(MAKEHTML) $(TEMPLATE_FLAGS) --mode=$(MODE)  \
      -o $$@ $($(1)_js) $($(1)_html)                          \
      --code $($(1)_out_code)

  # Include the deps
  ifneq (,$(filter build $(1),$(MAKECMDGOALS)))
    -include $($(1)_out_html_deps)
  endif

  # The target '<app name>' depends on the .html file
  $(1) : $($(1)_out_html)

  # List the files to be cleaned from this rule
  $(1)_clean_files += $($(1)_out_html_deps) $($(1)_out_html)

endef
#
##################################################

##################################################
# Defines rules to build a .tzjs or .js file
#
# 1 - app name
#
define _create_code_rule

  $(call _mkdir_rule,$(dir $($(1)_out_code_deps)))

  # Command to build <app>_out_tzjs_deps
  $($(1)_out_code_deps) : $($(1)_js) $(external_scriptfiles) \
   | install_jslib $(call _dir_marker,$(dir $($(1)_out_code_deps)))
	@echo "[TZJS ] (dep)" $$@
	$(CMDPREFIX)$(MAKETZJS) $(TEMPLATE_FLAGS)         \
      --mode=$(MODE)                      \
      -M --MF $$@                         \
      -o $($(1)_out_code)                 \
      $($(1)_js)

  # Include the deps if we are building (otherwise they may be
  # generated unnecessarily)
  ifneq (,$(filter build $(1),$(MAKECMDGOALS)))
    -include $($(1)_out_code_deps)
  endif

  # Command to build the final html file
  $($(1)_out_code) : $($(1)_js) $(external_scriptfiles) $(maketzjs_version) \
   | install_jslib
	@echo "[TZJS ]" $$@
	$(CMDPREFIX)$(MAKETZJS) $(TEMPLATE_FLAGS)         \
      $(COMPACTOR_FLAGS)                  \
      $(MAKETZJS_FLAGS)                   \
      --mode=$(MODE)                      \
      -o $$@                              \
      $($(1)_js)

  $(call log,TARGET: $(1) - $($(1)_out_code))

  # The target '<app name>' depends on the .tzjs file
  $(1) : $($(1)_out_code)

  # List the files to be cleaned from this rule
  $(1)_clean_files += $($(1)_out_code_deps) $($(1)_out_code)

endef
#
##################################################

##################################################
#
# Define a rule to copy an external file into this projects scripts
# dir.  The 'external_scriptfiles' variable contains the list of
# local files on which all build steps need to depend.
#
# 1 - external file
#
define _create_external_script_file_rule

  $(if $(realpath $(1)),,$(error No external script file: $(1)))
  external_scriptfiles += scripts/$(notdir $(1))

  scripts/$(notdir $(1)) : $(1)
	$(CMDPREFIX)$(CP) $(1) $$@

endef

##################################################
#
# Defines the rule to clean this app
#
# 1 - app name
#
define _create_clean_rule

  .PHONY : $(1)_clean
  $(1)_clean :
	$(RM) $($(1)_clean_files)

endef
#
##################################################

$(call log,MODE = $(MODE))
$(call log,TEMPLATES_DIR = $(TEMPLATES_DIR))

############################################################
# 'help' target (default)
############################################################

.PHONY : help
help :
	@echo ""
	@echo " Usage:"
	@echo ""
	@echo "   make [<options>] build"
	@echo "   make [<options>] clean"
	@echo "   make distclean"
	@echo "   make install_jslib"
	@echo "   make install_protolib"
	@echo ""
	@echo " Targets:"
	@echo ""
	@echo "   build           - Build apps (filter with JSAPPS option)"
	@echo ""
	@echo "   clean           - Clean apps (filter with JSAPPS option)"
	@echo ""
	@echo "   distclean       - Remove all output and intermediate build files"
	@echo ""
	@echo "   install_jslib   - Install jslib into the current directory.  This"
	@echo "                     recursively copies all files from TZROOT/jslib,"
	@echo "                     taking care not to overwrite any files that have"
	@echo "                     been changed (safe to run at every build)."
	@echo ""
	@echo "   install_protolib - Install protolib into the current directory.  This"
	@echo "                     recursively copies all files from TZROOT/protolib,"
	@echo "                     taking care not to overwrite any files that have"
	@echo "                     been changed (safe to run at every build)."
	@echo ""
	@echo " Options:"
	@echo ""
	@echo "   JSAPPS=app        - Build/clean only app (multiple apps in quotes)"
	@echo ""
	@echo "   MODE=mode       - Set build mode: plugin(-debug), canvas(-debug)"
	@echo "                     or 'all' for all modes.  (default: all)"
	@echo ""
	@echo "   COMPACTOR=comp  - Set compactor (uglifyjs|yui|none)."
	@echo "                     (default: uglifyjs)"
	@echo ""
	@echo "   BUILDVERBOSE=1  - Debug output from build system"
	@echo ""

############################################################
# 'install_jslib' target
############################################################

JSLIBDIR ?= $(TZROOT)/jslib
_jslib_src_files := $(shell $(FIND) $(JSLIBDIR) -iname '*.js')

.PHONY: install_jslib
.PHONY: do_install_jslib

install_jslib:
	$(MAKE) do_install_jslib

# 1 - src
# 2 - dst
define _copy_jslib_file

  $(call _mkdir_rule,$(dir $(2)))

  $(2): $(1) |$(call _dir_marker,$(dir $(2)))
	@echo [CP   ] $(1) $(2)
	$(CMDPREFIX)$(CP) $(1) $(2)

  do_install_jslib: $(2)

endef

$(foreach s,$(_jslib_src_files),$(eval                          \
  $(call _copy_jslib_file,$(s),$(subst $(JSLIBDIR),jslib,$(s))) \
))

############################################################
# 'install_protolib' target
############################################################

PROTOLIBDIR ?= $(TZROOT)/protolib
_protolib_src_files := $(shell $(FIND) $(PROTOLIBDIR) -iname '*.js')

.PHONY: install_protolib
.PHONY: do_install_protolib

install_protolib:
	$(MAKE) do_install_protolib

# 1 - src
# 2 - dst
define _copy_protolib_file

  $(call _mkdir_rule,$(dir $(2)))

  $(2): $(1) |$(call _dir_marker,$(dir $(2)))
	@echo [CP   ] $(1) $(2)
	$(CMDPREFIX)$(CP) $(1) $(2)

  do_install_protolib: $(2)

endef

$(foreach s,$(_protolib_src_files),$(eval                          \
  $(call _copy_protolib_file,$(s),$(subst $(PROTOLIBDIR),protolib,$(s))) \
))

############################################################
# Main Logic
############################################################

# Set the HTML and CODE extensions based on the build mode
#
# if MODE == 'plugin-debug':
#   ...
ifeq ($(MODE),plugin-debug)
  HTML_EXT:=debug.html
  CODE_EXT:=
endif

ifeq ($(MODE),plugin)
  HTML_EXT:=release.html
  CODE_EXT:=tzjs
endif

ifeq ($(MODE),canvas-debug)
  HTML_EXT:=canvas.debug.html
  CODE_EXT:=
  CANVAS:=1
endif

ifeq ($(MODE),canvas)
  HTML_EXT:=canvas.release.html
  CODE_EXT:=canvas.js
  CANVAS:=1
endif

# The special mode 'all' means build all modes (for targets 'build'
# and 'clean' only).  Override these targets.
ifeq ($(MODE),all)
  run_all_targets := build clean
  .PHONY : $(run_all_targets)

  # Remove any MODE= settings from MAKEFLAGS.  pymake seems to insert
  # 'w' and '--' into MAKEFLAGS, so remove these too.

  make_flags := $(filter-out MODE%,$(MAKEFLAGS))
  make_flags := $(filter-out w,$(make_flags))
  make_flags := $(filter-out --,$(make_flags))

  # On win32, make always passes -j 1 to child make process via
  # MAKEFLAGS, to avoid saturating the CPU.  Override this since we
  # know there are no other jobs in this case.

  ifneq (,$(NUMBER_OF_PROCESSORS))
    make_flags := $(filter-out -j%,$(make_flags))
    make_flags := $(filter-out -j\ %,$(make_flags))
    make_flags += -j$(NUMBER_OF_PROCESSORS)
  endif

  $(run_all_targets) :
	$(MAKE) $(make_flags) MODE=plugin $@
	$(MAKE) $(make_flags) MODE=plugin-debug $@
	$(MAKE) $(make_flags) MODE=canvas $@
	$(MAKE) $(make_flags) MODE=canvas-debug $@

  # Make sure no other apps are discovered
  TEMPLATES_DIR := no-such-dir
  override JSAPPS :=
endif

$(call log,HTML_EXT = $(HTML_EXT))
$(call log,CODE_EXT = $(CODE_EXT))

# Get the list of .js files
#
# JSFILES = glob.glob(TEMPLATES_DIR + "/* .js")
#
ifneq ($(MODE),all)
  JSFILES := $(wildcard $(TEMPLATES_DIR)/*.js)
endif

# Add any TSAPPS to TSLIBS and include tzbuild to define any modules.
# All the tzbuild output relies on jslib being updated, and any TSAPPS
# require changes to JSFILES, etc.

TSLIBS += $(foreach tsa,$(sort $(TSAPPS)), \
  $(if $(filter $(tsa),TSLIBS),,$(tsa))    \
)

# Set the output file for TSAPPS to point to the templates dir

$(foreach tsa,$(TSAPPS),$(eval            \
  _$(tsa)_out_js := templates/$(tsa).js   \
))

include $(BUILDDIR)/rules.mk

ifneq ($(MODE),all)
  $(foreach tsa,$(TSAPPS), $(eval \
    $(call _handle_tsapp,$(tsa)) \
  ))
endif

ifneq (,$(TSAPPS))
  # Tidy up after _handle_tsapp
  EXTERNAL_SCRIPTFILES := $(sort $(EXTERNAL_SCRIPTFILES))
endif

$(call log,JSFILES = $(JSFILES))

# Generate the list of app names and set the basic variables up for
# each one.
#
# JSAPPS = []
# for js in JSFILES:
#   # JSAPPS.append(appname) happens in _set_app_files
#   _set_app_files(os.path.splitext(os.path.basename(js))[0], js)
#
JSAPPS :=
$(foreach js,$(JSFILES), $(eval                                 \
  $(call _set_app_files,$(notdir $(basename $(js))),$(js))      \
))
$(call log,JSAPPS = $(JSAPPS))

# Filter out any apps specified in NON_CANVAS_APPS if this is a canvas
# build
#
# if CANVAS:
#   JSAPPS = [ a in JSAPPS if a not in NON_CANVAS_APPS ]
#
ifeq ($(CANVAS),1)
  JSAPPS := $(filter-out $(NON_CANVAS_APPS),$(JSAPPS))
  $(call log,JSAPPS (after removing NON_CANVAS_APPS) = $(JSAPPS))
endif

# Build mode targets don't produce any output - their dependencies do
#.PHONY : plugin plugin-debug canvas canvas-debug

# Log the values for each app
$(foreach app,$(JSAPPS), $(eval                               \
  $(call log,-----------------------------------)             \
  $(call log,APP $(app):)                                     \
  $(call log,  JSFILE $($(app)_js))                           \
  $(call log,  HTMLFILE $($(app)_html))                       \
  $(call log,  OUT HTMLFILE $($(app)_out_html))               \
  $(call log,  OUT JSFILE $($(app)_out_code))                 \
  $(call log,  OUT HTMLFILE DEPS $($(app)_out_html_deps))     \
  $(call log,  OUT JSFILE DEPS $($(app)_out_code_deps))       \
))

# Create the rules that copy external files into the project dir
#
# for f in EXTERNAL_SCRIPTFILES:
#   external_scriptfiles += _copy_external_script_file(f)
#
$(call log,EXTERNAL_SCRIPTFILES = $(EXTERNAL_SCRIPTFILES))
$(foreach e,$(EXTERNAL_SCRIPTFILES), $(eval                   \
  $(call _create_external_script_file_rule,$(e))              \
))
$(call log,external_scriptfiles = $(external_scriptfiles))
# Create the html build rules for each app
#
# if HTML_EXT:
#   for app in JSAPPS:
#     _create_html_rule(app)
#
ifneq ($(HTML_EXT),)
  $(foreach app,$(JSAPPS), $(eval                            \
    $(call _create_html_rule,$(app))                         \
  ))
endif
$(call log,animation_out_code = $(animation_out_code))

# Create the code build rules if a code extension has been set
#
# if CODE_EXT:
#   for app in JSAPPS:
#     _create_code_rule(app)
#
ifneq ($(CODE_EXT),)
  $(foreach app,$(JSAPPS), $(eval                            \
    $(call _create_code_rule,$(app))                         \
  ))
endif
$(call log,animation_out_code = $(animation_out_code))
$(call log,animation_clean_files = $(animation_clean_files))

# Create the <app>_clean target
$(foreach app,$(JSAPPS), $(eval                              \
    $(call _create_clean_rule,$(app))                        \
  ))

############################################################
# Create the build target
############################################################

ifeq ($(USE_PROTOLIB), 1)
PROTOLIB_DEPS = install_protolib
endif

.PHONY : build
build : $(JSAPPS) | install_jslib $(PROTOLIB_DEPS)

############################################################
# Create the clean and distclean targets
############################################################

.PHONY : clean distclean
clean : $(foreach app,$(JSAPPS),$(app)_clean)
distclean :
	$(RM) $(BUILD_DIR) $(external_scriptfiles)
