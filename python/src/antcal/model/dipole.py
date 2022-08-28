"""Dipole antenna."""

# %% Import

from __future__ import annotations

from pyaedt.modeler.modeler3d import Modeler3D

from antcal.application.hfss import HFSS

# %% Class
class Dipole:
    """Represent a dipole antenna."""

    def __init__(self, hfss: HFSS) -> None:
        self._hfss = hfss
        self._Hfss = hfss.hfss
    
    @property
    def modeler(self) -> Modeler3D:
        return self._hfss.modeler
