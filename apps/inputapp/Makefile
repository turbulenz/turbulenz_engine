
TZROOT := ../..
TS_BASE_FILES :=                                                 \
  $(TZROOT)/external/definitelytyped/jquery/jquery-1.8.d.ts      \
  $(TZROOT)/external/definitelytyped/jqueryui/jqueryui-1.9.d.ts

# tzbuild settings

htmlcontrols_src := $(TZROOT)/samples/tsscripts/htmlcontrols.ts
TSLIBS += htmlcontrols

inputapplib_src := $(addprefix tsscripts/inputapp/,inputapp.ts point.ts)
inputapplib_deps := htmlcontrols
TSLIBS += inputapplib

inputapp_src := tsscripts/inputapp/inputapp_entry.ts
inputapp_deps := inputapplib
# _inputapp_entry_out_js := templates/inputapp.js

# appbuild extensions to tzbulid.  Mark inputapp as the entry point

TSAPPS += inputapp

include $(TZROOT)/scripts/appbuild.mk
