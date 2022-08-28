# spell-checker:words diel
# spell-checker:ignore perfecte checkifmaterialexists

"""Dielectric resonator antenna."""

# %% Import
from __future__ import annotations

import re
from typing import cast

import numpy as np
from antcal.application.hfss import HFSS
from pyaedt.hfss import Hfss
from pyaedt.modeler.cad.object3d import Object3d
from pyaedt.modeler.modeler3d import Modeler3D
from pyaedt.modules.AdvancedPostProcessing import PostProcessor
from pyaedt.modules.Material import Material
from pyaedt.modules.MaterialLib import Materials
from pyaedt.modules.solutions import SolutionData
from pyaedt.modules.SolveSetup import SetupHFSSAuto
