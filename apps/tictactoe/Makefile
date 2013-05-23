
TZROOT := ../..
TS_BASE_FILES :=                                                 \
  $(TZROOT)/external/definitelytyped/jquery/jquery-1.8.d.ts      \
  $(TZROOT)/external/definitelytyped/jqueryui/jqueryui-1.9.d.ts

# tzbuild settings

simplebuttons_src := $(TZROOT)/samples/tsscripts/simplebuttons.ts
TSLIBS += simplebuttons

tictactoelib_src := $(addprefix tsscripts/tictactoe/,tictactoeapp.ts tictactoegame.ts)
tictactoelib_deps := simplebuttons
TSLIBS += tictactoelib

tictactoe_src := tsscripts/tictactoe/tictactoe_entry.ts
tictactoe_deps := tictactoelib

# appbuild extensions to tzbulid.  Mark tictactoe as the entry point

TSAPPS += tictactoe

include $(TZROOT)/scripts/appbuild.mk
