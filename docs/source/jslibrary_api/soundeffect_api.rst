.. index::
    single: SoundEffect

.. highlight:: javascript

.. _soundeffect:

-----------------------
The SoundEffect Object
-----------------------

A SoundEffect object represents an effect created with a set of parameters that can be associated with an effect slot.

Constructor
===========

A SoundEffect object can be constructed with :ref:`SoundDevice.createEffect <sounddevice_createeffect>`.

Properties
==========

.. index::
    pair: SoundEffect; name

`name`
------

**Summary**

The name that identifies the effect object.

**Syntax** ::

    // Get
    var name = effect.name;

    // Set
    effect.name = "HallwayReverb01";

.. index::
    pair: SoundEffect; type

`type`
------

**Summary**

The type of the effect, as a string.

**Syntax** ::

    // Get
    var type = effect.type;

.. note:: Read Only

.. _sound_effect_reverb_properties:

Reverb Properties
=================

`density`
---------

**Summary**

Reverb Modal Density controls the coloration of the late reverb.
Lowering the value adds more coloration to the late reverb.

**Syntax** ::

    // Get
    var density = effect.density;

    // Set
    effect.density = 0.3;

``Range``

    0.0 to 1.0

``Default``

    1.0

`diffusion`
-----------

**Summary**

The Reverb Diffusion property controls the echo density in the reverberation decay.
It's set by default to 1.0, which provides the highest density.
Reducing diffusion gives the reverberation a more "grainy" character that is especially noticeable with percussive sound sources.
If you set a diffusion value of 0.0, the later reverberation sounds like a succession of distinct echoes.

**Syntax** ::

    // Get
    var diffusion = effect.diffusion;

    // Set
    effect.diffusion = 0.3;

``Range``

    0.0 to 1.0

``Default``

    1.0

``Units``

    A linear multiplier value

`gain`
------

**Summary**

The Reverb Gain property is the master volume control for the reflected sound (both early reflections and reverberation) that the reverb effect adds to all sound sources.
It sets the maximum amount of reflections and reverberation added to the final sound mix.
The value of the Reverb Gain property ranges from 1.0 (0db) (the maximum amount) to 0.0 (-100db) (no reflected sound at all).

**Syntax** ::

    // Get
    var gain = effect.gain;

    // Set
    effect.gain = 0.4;

``Range``

    0.0 to 1.0

``Default``

    0.32

``Units``

    Linear gain

`gainHF`
--------

**Summary**

The Reverb Gain HF property further tweaks reflected sound by attenuating it at high frequencies.
It controls a low-pass filter that applies globally to the reflected sound of all sound sources feeding the particular instance of the reverb effect.
The value of the Reverb Gain HF property ranges from 1.0 (0db) (no filter) to 0.0 (-100db) (virtually no reflected sound).

**Syntax** ::

    // Get
    var gainHF = effect.gainHF;

    // Set
    effect.gainHF = 0.6;

``Range``

    0.0 to 1.0

``Default``

    0.89

``Units``

    Linear gain

`decayTime`
-----------

**Summary**

The Decay Time property sets the reverberation decay time.
It ranges from 0.1 (typically a small room with very dead surfaces) to 20.0 (typically a large room with very live surfaces).

**Syntax** ::

    // Get
    var decayTime = effect.decayTime;

    // Set
    effect.decayTime = 1.9;

``Range``

    0.1 to 20.0

``Default``

    1.49

``Units``

    Seconds

`decayHFRatio`
--------------

**Summary**

The Decay HF Ratio property sets the spectral quality of the Decay Time parameter.
It is the ratio of high-frequency decay time relative to the time set by Decay Time.
The Decay HF Ratio value 1.0 is neutral: the decay time is equal for all frequencies.
As Decay HF Ratio increases above 1.0, the high-frequency decay time increases so it's longer than the decay time at low frequencies.
You hear a more brilliant reverberation with a longer decay at high frequencies.
As the Decay HF Ratio value decreases below 1.0, the high-frequency decay time decreases so it is shorter than the decay time of the low frequencies.
You hear a more natural reverberation.

**Syntax** ::

    // Get
    var decayHFRatio = effect.decayHFRatio;

    // Set
    effect.decayHFRatio = 1.9;

``Range``

    0.1 to 2.0

``Default``

    0.83

``Units``

    A linear multiplier value

`reflectionsGain`
-----------------

**Summary**

The Reflections Gain property controls the overall amount of initial reflections relative to the Gain property. (The Gain property sets the overall amount of reflected sound: both initial reflections and later reverberation.) The value of Reflections Gain ranges from a maximum of 3.16 (+10 dB) to a minimum of 0.0 (-100 dB) (no initial reflections at all), and is corrected by the value of the Gain property. The Reflections Gain property does not affect the subsequent reverberation decay.

You can increase the amount of initial reflections to simulate a more narrow space or closer walls, especially effective if you associate the initial reflections increase with a reduction in reflections delays by lowering the value of the Reflection Delay property. To simulate open or semi-open environments, you can maintain the amount of early reflections while reducing the value of the Late Reverb Gain property, which controls later reflections.

**Syntax** ::

    // Get
    var reflectionsGain = effect.reflectionsGain;

    // Set
    effect.reflectionsGain = 2.1;

``Range``

    0.0 to 3.16

``Default``

    0.05

``Units``

    Linear gain

`reflectionsDelay`
------------------

**Summary**

The Reflections Delay property is the amount of delay between the arrival time of the direct path from the source to the first reflection from the source.
It ranges from 0 to 300 milliseconds.
You can reduce or increase Reflections Delay to simulate closer or more distant reflective surfaces and therefore control the perceived size of the room.

**Syntax** ::

    // Get
    var reflectionsDelay = effect.reflectionsDelay;

    // Set
    effect.reflectionsDelay = 0.1;

``Range``

    0.0 to 0.3

``Default``

    0.007

``Units``

    Seconds

`lateReverbGain`
----------------

**Summary**

The Late Reverb Gain property controls the overall amount of later reverberation relative to the Gain property. (The Gain property sets the overall amount of both initial reflections and later reverberation.) The value of Late Reverb Gain ranges from a maximum of 10.0 (+20 dB) to a minimum of 0.0 (-100 dB) (no late reverberation at all).

Note that Late Reverb Gain and Decay Time are independent properties: If you adjust Decay Time without changing Late Reverb Gain, the total intensity (the averaged square of the amplitude) of the late reverberation remains constant.

**Syntax** ::

    // Get
    var lateReverbGain = effect.lateReverbGain;

    // Set
    effect.lateReverbGain = 3;

``Range``

    0.0 to 10.0

``Default``

    1.26

``Units``

    Linear gain

`lateReverbDelay`
-----------------

**Summary**

The Late Reverb Delay property defines the begin time of the late reverberation relative to the time of the initial reflection (the first of the early reflections).
It ranges from 0 to 100 milliseconds.
Reducing or increasing Late Reverb Delay is useful for simulating a smaller or larger room.

**Syntax** ::

    // Get
    var lateReverbDelay = effect.lateReverbDelay;

    // Set
    effect.lateReverbDelay = 0.23;

``Range``

    0.0 to 0.1

``Default``

    0.011

``Units``

    Seconds

`roomRollOffFactor`
-------------------

**Summary**

The Room Rolloff Factor property is one of two methods available to attenuate the reflected sound (containing both reflections and reverberation) according to source-listener distance. It's defined the same way as OpenAL's Rolloff Factor, but operates on reverb sound instead of direct-path sound. Setting the Room Rolloff Factor value to 1.0 specifies that the reflected sound will decay by 6 dB every time the distance doubles. Any value other than 1.0 is equivalent to a scaling factor applied to the quantity specified by ((Source listener distance) - (Reference Distance)). Reference Distance is an OpenAL source parameter that specifies the inner border for distance rolloff effects: if the source comes closer to the listener than the reference distance, the direct-path sound isn't increased as the source comes closer to the listener, and neither is the reflected sound.

The default value of Room Rolloff Factor is 0.0 because, by default, the Effects Extension reverb effect naturally manages the reflected sound level automatically for each sound source to simulate the natural rolloff of reflected sound vs. distance in typical rooms. (Note that this isn't the case if the source property flag auxiliarySendFilterGainAuto is set to false) You can use Room Rolloff Factor as an option to automatic control so you can exaggerate or replace the default automatically-controlled rolloff.

**Syntax** ::

    // Get
    var roomRollOffFactor = effect.roomRollOffFactor;

    // Set
    effect.roomRollOffFactor = 0.7;

``Range``

    0.0 to 10.0

``Default``

    0.0

``Units``

    A linear multiplier value

`airAbsorptionGainHF`
---------------------

**Summary**

The Air Absorption Gain HF property controls the distance-dependent attenuation at high frequencies caused by the propagation medium.
It applies to reflected sound only.
You can use Air Absorption Gain HF to simulate sound transmission through foggy air, dry air, smoky atmosphere, and so on.
The default value is 0.994 (-0.05 dB) per meter, which roughly corresponds to typical condition of atmospheric humidity, temperature, and so on.
Lowering the value simulates a more absorbent medium (more humidity in the air, for example); raising the value simulates a less absorbent medium (dry desert air, for example).

**Syntax** ::

    // Get
    var airAbsorptionGainHF = effect.airAbsorptionGainHF;

    // Set
    effect.airAbsorptionGainHF = 0.938;

``Range``

    0.892 to 1.0

``Default``

    0.994

``Units``

    Linear gain per meter

`decayHFLimit`
--------------

**Summary**

When this flag is set, the high-frequency decay time automatically stays below a limit value that's derived from the setting of the property Air Absorption HF.
This limit applies regardless of the setting of the property Decay HF Ratio, and the limit doesn't affect the value of Decay HF Ratio.
This limit, when on, maintains a natural sounding reverberation decay by allowing you to increase the value of Decay Time without the risk of getting an unnaturally long decay time at high frequencies.
If this flag is set to false, high-frequency decay time isn't automatically limited.

**Syntax** ::

    // Get
    var decayHFLimit = effect.decayHFLimit;

    // Set
    effect.decayHFLimit = false;

``Range``

    true or false

``Default``

    true

.. _sound_effect_echo_properties:

Echo Properties
===============

The echo effect generates discrete, delayed instances of the input signal. The amount of delay and feedback is controllable. The delay is 'two tap', you can control the interaction between two separate instances of echoes.

`delay`
-------

**Summary**

This property controls the delay between the original sound and the first 'tap', or echo instance. Subsequently, the value for Echo Delay is used to determine the time delay between each 'second tap' and the next 'first tap'.

**Syntax** ::

    // Get
    var delay = effect.delay;

    // Set
    effect.delay = 0.046;

``Range``

    0.0 to 0.207

``Default``

    0.1

`lrdelay`
---------

**Summary**

This property controls the delay between the first 'tap' and the second 'tap'.
Subsequently, the value for Echo LR Delay is used to determine the time delay between each 'first tap' and the next 'second tap'.

**Syntax** ::

    // Get
    var lrdelay = effect.lrdelay;

    // Set
    effect.lrdelay = 0.1337;

``Range``

    0.0 to 0.404

``Default``

    0.1

`damping`
---------

**Summary**

This property controls the amount of high frequency damping applied to each echo.
As the sound is subsequently fed back for further echoes, damping results in an echo which progressively gets softer in tone as well as intensity.

**Syntax** ::

    // Get
    var damping = effect.damping;

    // Set
    effect.damping = 0.78;

``Range``

    0.0 to 0.99

``Default``

    0.5

`feedback`
----------

**Summary**

This property controls the amount of feedback the output signal fed back into the input.
Use this parameter to create 'cascading' echoes.
At full magnitude, the identical sample will repeat endlessly.
Below full magnitude, the sample will repeat and fade.

**Syntax** ::

    // Get
    var feedback = effect.feedback;

    // Set
    effect.feedback = 0.235;

``Range``

    0.0 to 1.0

``Default``

    0.5

`spread`
--------

**Summary**

This property controls how hard panned the individual echoes are.
With a value of 1.0, the first 'tap' will be panned hard left, and the second tap hard right.
A value of -1.0 gives the opposite result. Settings nearer to 0.0 result in less emphasized panning.

**Syntax** ::

    // Get
    var spread = effect.spread;

    // Set
    effect.spread = -0.5;

``Range``

    -1.0 to 1.0

``Default``

    -1.0

.. index::
    single: SoundEffectSlot

.. _soundeffectslot:

----------------------------
The SoundEffectSlot Object
----------------------------

A SoundEffectSlot object represents a container for an effect.
A SoundEffectSlot can be associated with multiple sources.

.. highlight:: javascript

Properties
==========

`effect`
--------

**Summary**

The effect that is attached to the slot.
This value can only be set on SoundEffectSlot creation.

**Syntax** ::

    // Get
    var effect = effectSlot.effect;

.. note:: Read Only


`gain`
------

**Summary**

The gain applied to the output of the SoundEffectSlot.
0.0 is muted.

**Syntax** ::

    // Get
    var gain = effectSlot.gain;

    // Set
    effectSlot.gain = 0.1;

``Range``

    0.0 to 1.0

``Default``

    1.0

``Units``

    Linear Gain

`auxiliarySendAuto`
-------------------

**Summary**

Enables or disables automatic send adjustments based on the physical positions of the sources and the listener.
This property should be enabled when an application wishes to use a reverb effect to simulate the environment surrounding a listener or a collection of Sources.

**Syntax** ::

    // Get
    var auxiliarySendAuto = effectSlot.auxiliarySendAuto;

    // Set
    effectSlot.auxiliarySendAuto = true;

``Range``

    true or false

``Default``

    true
