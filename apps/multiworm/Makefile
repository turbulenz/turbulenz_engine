TZROOT := ../..

sceneloader_src := \
  $(TZROOT)/samples/tsscripts/sceneloader.ts

worm_src :=								\
  tsscripts/worm/appscene.ts			\
  tsscripts/worm/gamebadges.ts			\
  tsscripts/worm/badge.ts				\
  tsscripts/worm/gameleaderboards.ts	\
  tsscripts/worm/htmlwriter.ts			\
  tsscripts/worm/leaderboard.ts			\
  tsscripts/worm/duimanager.ts			\
  tsscripts/worm/game.ts				\
  tsscripts/worm/worm.ts				\
  tsscripts/worm/wormapp.ts
worm_deps := sceneloader

multiworm_src := tsscripts/worm/multiworm_entry.ts
multiworm_deps := worm
_multiworm_out_js := templates/multiworm.js

TSLIBS := sceneloader worm
TSAPPS := multiworm

include $(TZROOT)/scripts/appbuild.mk
