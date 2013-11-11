
.. _known_issues:

Known Issues
============

The following is a list of the changes to the known issues in this SDK.

* Importing tools/local server directly from Python has changed. Previously you could import them using 'turbulenz.tools.*' and 'turbulenz.devserver.*', now you must invoke them via 'turbulenz_tools.tools.*' and 'turbulenz_local.*'.
* Any manual changes to release.ini configuration files have to be manually applied to the release.ini, after first running the local server command for the first time, since the file needs to be generated.
* The default list of games in the local server flows onto the next page. You must click the arrow to scroll to the second page to see all applications.
* The Linux SDK does not include a browser plugin.  Developers can
  build and deploy plugin versions of their games, but only run the
  canvas versions.
* Placing Firebug breakpoints before ``window.onload`` in debug builds results in the Turbulenz Engine failing to load properly.
* The "insert" key is not supported on macs when using the plugin.
* On IE the samples' slider and text controls are not fully functional.
* With the canvas versions of applications the captured mouse can move outside of the browser's window. This is because a consistent definition of 'mouse lock' functionality for canvas is yet to be defined.
* Creating a GraphicsDevice with width or height of 0 may fail on some configurations on Windows where Angle is used.
* On Windows Vista with an ATI video card, Firefox may not refresh the display until the browser is activated or moved.
* The plugin implementation of the Turbulenz Engine on the following configurations may be slower than the Windows equivalent:
    * Mac OS X 10.6 and above : Google Chrome, Firefox 4.0 and above
* Under Mac OS X, switching to full-screen browsing under Firefox 3.6 while the plugin version of the engine is running can result in rendering being halted.
* Certain samples don't have canvas equivalents due to utilizing plugin only features. These include:
    * deferred_rendering (Multiple render targets)
    * loading (External resource dependency issue)
    * physics_constraints (Uses plugin physics device)
* WebGL performance in Firefox may be limited by the browser's current implementation.
  Consider using Chrome to get a better representation of WebGL performance.
* The plugin implementation of the engine requires a CPU that supports SSE2.
* When running intensive JavaScript applications that push the performance of the platform, such as the *multiple animations*, the browser may become less responsive.
  You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly.
  See the Turbulenz :ref:`recommendations <recommendations>` for the preferred browser to use for development.
* The following browser(s) do not fully support the majority of samples in the following *debug* configurations:
    * IE 6/7/8/9 - canvas, plugin
    * Opera 10/11/12 - canvas, plugin
* The following browser(s) do not fully support the majority of samples in the following *release* configurations:
    * IE 6 - canvas, plugin (Styling issue only)
    * Opera 10/11/12 - canvas, plugin
* The following browsers and configurations show low performance and
  unreliable behavior when running the *debug* samples with the plugin:
  * Chrome
  * Firefox 4 and above (with out of process plugins enabled. See :ref:`Running in Process <running_in_process>`).
* In *debug* mode with out-of-process plugins enabled, Firefox can
  invoke callbacks *during* calls to the engine.  This can lead to
  apparently erratic behavior.  (See :ref:`Running in Process
  <running_in_process>`)
* Some browsers don't support delete on engine object properties (plugin only), e.g. delete techniqueParameters.diffuse does not work, use techniqueParameters.diffuse = undefined instead.
* Erratic behavior has been observed in Safari 5.0 on Mac OS X, relating to input and debug mode applications.
  Turbulenz recommend using Safari 5.1 if any of this behavior is observed.
* The SVG samples doesn't work on Internet Explorer 8 in any mode. This is related to IE8 not parsing the SVG file correctly.
* The nVidia drivers (version 8.17.12.7061 - 8.17.12.7533) bug causes multiple render targets to render the output for the first target to all target textures.
  nVidia have now fixed this bug in the latest driver download on their website.
  The current work around for shaders generated with ``cgfx2json`` is to reorder any writes to ``gl_FragData`` so they are in order.
  nVidia have now fixed this bug through windows update or the latest driver download on their website.
  If an update is not possible follow the steps in this :ref:`example <nVidia_driver_MRT_bug>`.
* For shader support the plugin implementation of the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome.
  See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the local server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the local server before running any Turbulenz tools.
* When debugging with Chrome it may repeatedly warn the plugin is unresponsive.
    * See http://code.google.com/p/chromium/issues/detail?id=82061
* Sound stuttering can be heard when the browser is using 100% of CPU.
* Compatibility
    * Shaders
        * tex2DProj does not work as expected on some Intel chip-sets, e.g. G41. tex2DProj requires a float4 with w=1.0 to be passed, rather than a float3.
          The sample shaders use tex2DProjFix to work around this issue.
* In some cases on Windows 7, the SDK installer is unable to automatically open the Windows Firewall for the Local Server on a local network if UAC is enabled.
  To allow the local server to be accessed over a local network, please manually update the Windows Firewall rule.
* When using the InputDevice, certain browsers can take a little longer to release the mouse pointer when pressing ESC.
  Try holding ESC for a longer period of time, or alternatively use alt-tab to navigate to a different window (windows only) or end the process if the browser stops responding.
* The middle mouse button does not send click events in Firefox on Mac OS 10.6
* In canvas mode, some browsers do not correctly distinguish between
  left and right version of some modifyer keys (CONTROL, ALT, etc).
