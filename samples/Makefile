TZROOT := ..

# LIBS

TS_BASE_FILES :=                                                 \
  $(TZROOT)/external/definitelytyped/jquery/jquery-1.8.d.ts      \
  $(TZROOT)/external/definitelytyped/jqueryui/jqueryui-1.9.d.ts

sceneloader_src := tsscripts/sceneloader.ts
htmlcontrols_src := tsscripts/htmlcontrols.ts
motion_src := tsscripts/motion.ts
emitter_src := tsscripts/emitter.ts
debugphysics_src := tsscripts/debugphysics.ts
morph_src := tsscripts/morph.ts
dynamiccameracontroller_src := tsscripts/dynamiccameracontroller.ts
simplebuttons_src := tsscripts/simplebuttons.ts

TSLIBS += \
  sceneloader htmlcontrols motion emitter debugphysics morph \
  dynamiccameracontroller simplebuttons

# APPS

2dcanvas_src := tsscripts/templates/2dcanvas.ts
2dcanvas_deps := htmlcontrols
TSAPPS += 2dcanvas

animation_src := tsscripts/templates/animation.ts
animation_deps := sceneloader htmlcontrols motion
TSAPPS += animation

basic_loop_src := tsscripts/templates/basic_loop.ts
basic_loop_deps := htmlcontrols
TSAPPS += basic_loop

camera_src := tsscripts/templates/camera.ts
camera_deps := sceneloader motion htmlcontrols dynamiccameracontroller
TSAPPS += camera

deferred_rendering_src := tsscripts/templates/deferred_rendering.ts
deferred_rendering_deps := sceneloader htmlcontrols
deferred_rendering_nocanvas := 1
TSAPPS += deferred_rendering

device_initialization_src := tsscripts/templates/device_initialization.ts
TSAPPS += device_initialization

draw2d_src := tsscripts/templates/draw2d.ts
draw2d_deps := htmlcontrols
TSAPPS += draw2d

forward_rendering_src := tsscripts/templates/forward_rendering.ts
forward_rendering_deps := sceneloader htmlcontrols
TSAPPS += forward_rendering

immediate_mode_rendering_src := tsscripts/templates/immediate_mode_rendering.ts
TSAPPS += immediate_mode_rendering

javascript_benchmark_src := \
  tsscripts/templates/javascript_benchmark.ts \
  tsscripts/benchmark.ts tsscripts/benchmark_singleton.ts \
  $(wildcard tsscripts/benchmarks/turbulenz/js/*.ts)
javascript_benchmark_deps := htmlcontrols
TSAPPS += javascript_benchmark

leaderboards_src := tsscripts/templates/leaderboards.ts
leaderboards_deps := htmlcontrols
TSAPPS += leaderboards

load_model_src := tsscripts/templates/load_model.ts
load_model_deps := sceneloader htmlcontrols
TSAPPS += load_model

loading_src := tsscripts/templates/loading.ts
loading_deps := sceneloader htmlcontrols
TSAPPS += loading

material_src := tsscripts/templates/material.ts
material_deps := sceneloader motion htmlcontrols
TSAPPS += material

morphing_src := tsscripts/templates/morphing.ts
morphing_deps := sceneloader htmlcontrols morph motion
TSAPPS += morphing

multichat_src := tsscripts/templates/multichat.ts
TSAPPS += multichat

multiple_animations_src := tsscripts/templates/multiple_animations.ts
multiple_animations_deps := sceneloader htmlcontrols
TSAPPS += multiple_animations

particles_src := tsscripts/templates/particles.ts
particles_deps := motion sceneloader emitter htmlcontrols
TSAPPS += particles

payments_src := tsscripts/templates/payments.ts
payments_deps := htmlcontrols simplebuttons
TSAPPS += payments

physics_src := tsscripts/templates/physics.ts
physics_deps := htmlcontrols
TSAPPS += physics

physics2d_src := tsscripts/templates/physics2d.ts
physics2d_deps := htmlcontrols
TSAPPS += physics2d

physics2d_callbacks_src := tsscripts/templates/physics2d_callbacks.ts
TSAPPS += physics2d_callbacks

physics2d_constraints_src := tsscripts/templates/physics2d_constraints.ts
physics2d_constraints_deps := htmlcontrols debugphysics
TSAPPS += physics2d_constraints

physics_benchmark_src := tsscripts/templates/physics_benchmark.ts
physics_benchmark_deps := sceneloader htmlcontrols
TSAPPS += physics_benchmark

physics_collisionmesh_src := tsscripts/templates/physics_collisionmesh.ts
physics_collisionmesh_deps := sceneloader htmlcontrols
TSAPPS += physics_collisionmesh

physics_constraints_src := tsscripts/templates/physics_constraints.ts
physics_constraints_deps := debugphysics htmlcontrols
physics_constraints_nocanvas := 1
TSAPPS += physics_constraints

postfx_src := tsscripts/templates/postfx.ts
postfx_deps := sceneloader motion htmlcontrols
TSAPPS += postfx

scene_loading_src := tsscripts/templates/scene_loading.ts
scene_loading_deps := sceneloader
TSAPPS += scene_loading

sound_src := tsscripts/templates/sound.ts
sound_deps := sceneloader motion htmlcontrols
TSAPPS += sound

svg_src := tsscripts/templates/svg.ts
TSAPPS += svg

textureeffects_src := tsscripts/templates/textureeffects.ts
textureeffects_deps := htmlcontrols
TSAPPS += textureeffects

userdata_src := tsscripts/templates/userdata.ts
userdata_deps := sceneloader htmlcontrols
TSAPPS += userdata


video_src := tsscripts/templates/video.ts
TSAPPS += video

# Apps that do not have a canvas version
NON_CANVAS_APPS :=   \
  deferred_rendering \
  physics_constraints   \

# include the main application build file
include $(TZROOT)/scripts/appbuild.mk
