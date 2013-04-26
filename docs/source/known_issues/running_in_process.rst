.. _running_in_process :

------------------
Running in Process
------------------

Most of the browsers now run plugins in separate processes from the browser process to isolate them for stability, security and performance reasons.
This means that each function call to the plugin is moderately expensive.
When there are few calls, such as running a tzjs file, this is not an issue.
However in development modes, running .js files, there can be very large number of calls making the application run at a fraction of the speed.
To avoid this issue some browsers have an 'in process plugin' option that can be toggled.

Firefox 4 and above
-------------------
* Type 'about:config' in the address bar
* This shows the 'Here be dragons!' message and click on the button
* Type 'dom.ipc.plugins.enabled' and toggle it to false
* Restart Firefox

Note if Firefox crashes or upgrades this setting will need to be reapplied.
