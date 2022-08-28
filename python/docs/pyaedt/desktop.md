# Desktop module

Source: [`pyaedt/pyaedt/desktop.py`](https://github.com/pyansys/pyaedt/blob/main/pyaedt/desktop.py)

## Launching AEDT desktop

`Desktop.__init__()`

1. Get env `PYAEDT_NON_GRAPHICAL`
1. Set a bunch of parameters
1. Determine if in Iron Python or not
1. Try to find `oDesktop`
   1. `oDesktop` in `dir()`
   1. `oDesktop` in `dir(self._main)`
   1. New desktop session or not
      1. `not new_desktop_session`: find all active session
      1. `new_desktop_session`: try to launch a new one

`active_session()` from `pyaedt/pyaedt/generic/general_methods.py`

Get a list of AEDT PIDs.
