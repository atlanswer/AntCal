# spell-checker:words diel
# spell-checker:ignore perfecte checkifmaterialexists

# %% Import
from __future__ import annotations
import re
from typing import cast
import numpy as np

from pyaedt.hfss import Hfss
from pyaedt.modeler.cad.object3d import Object3d
from pyaedt.modeler.modeler3d import Modeler3D
from pyaedt.modules.Material import Material
from pyaedt.modules.MaterialLib import Materials
from pyaedt.modules.SolveSetup import SetupHFSSAuto
from pyaedt.modules.AdvancedPostProcessing import PostProcessor
from pyaedt.modules.solutions import SolutionData
from antcal.design import HFSS


# %% Class
class SubstrateIntegratedDRA:
    """Substrate integrated DRA"""

    CONSTANTS = {
        "sub_mat": "Rogers RT/duroid 5880 (tm)",
        "sub_epsilon": "2.2",
        "diel_mat": "Rogers RT/duroid 6010/6010LM (tm)",
        "diel_epsilon_xy": "13.3",
        "diel_epsilon_z": "10.6",
    }

    # wavelength in dielectric ~ 3.8 mm
    CONSTANT_VARIABLES = {
        "f_c": "24 GHz",
        "zl_sub": "0.127 mm",
        "zl_diel": "1.27 mm",
    }

    DEFAULT_VARIABLES = {
        "xl_dr": "5 mm",
        "yl_dr": "5 mm",
        "xl_gnd_off": "3.8 mm",
        "yl_gnd_off": "3.8 mm",
        "xl_gnd": "xl_dr + 2 * xl_gnd_off",
        "yl_gnd": "yl_dr + 2 * yl_gnd_off",
        "xl_slot": "0.2 mm",
        "yl_slot": "2 mm",
        "xl_feed": "0.4 mm",
        # "yl_feed_off": ""
        "yl_stub": "1 mm",
    }

    def __init__(self, hfss: HFSS):
        self._hf = hfss
        self._hf.variables = self.CONSTANT_VARIABLES | self.DEFAULT_VARIABLES
        self._setup_name = "setup1"
        self._sweep_name = "sweep1"
        self._sweep_freq_start_off = 1.5
        self._sweep_freq_stop_off = 1.5
        self._sweep_step_size = 0.05

    @property
    def hfss(self) -> Hfss:
        return self._hf.hfss

    @property
    def variables(self) -> dict[str, str]:
        return self._hf.variables

    def update_parameters(self, parameters: np.ndarray) -> None:
        variables = {}
        self._hf.variables |= variables

    @property
    def modeler(self) -> Modeler3D:
        return self._hf.modeler

    @property
    def materials(self) -> Materials:
        return self._hf.materials

    @property
    def post(self) -> PostProcessor:
        return self._hf.post

    @property
    def setup_name(self) -> str:
        return self._setup_name

    @property
    def sweep_name(self) -> str:
        return self._sweep_name

    def build_model(self) -> None:
        # Delete everything
        # self.modeler.delete()
        # Build
        self.create_materials()
        self.build_ground_layer()
        self.build_substrate_layer()
        self.build_slot()

    def create_materials(self) -> None:
        self.materials.checkifmaterialexists(self.CONSTANTS["sub_mat"])
        self.materials.checkifmaterialexists(self.CONSTANTS["diel_mat"])
        self.materials.checkifmaterialexists("copper")
        diel_mat = self.materials.duplicate_material(
            self.CONSTANTS["diel_mat"], self.CONSTANTS["diel_mat"]
        )
        diel_mat = cast(Material, diel_mat)
        diel_mat.permittivity = [
            self.CONSTANTS["diel_epsilon_xy"],
            self.CONSTANTS["diel_epsilon_xy"],
            self.CONSTANTS["diel_epsilon_z"],
        ]
        diel_mat.update()

    def build_ground_layer(self) -> None:
        gnd_prefix = "gnd"
        gnd = self.modeler.create_rectangle(
            self.hfss.PLANE.XY,
            ["-xl_gnd/2", "-yl_gnd/2", 0],
            ["xl_gnd", "yl_gnd"],
            f"{gnd_prefix}",
            f"copper",
        )
        gnd = cast(Object3d, gnd)
        gnd.transparency = 0.5
        self.hfss.assign_perfecte_to_sheets(gnd, f"{gnd_prefix}")

    def build_substrate_layer(self) -> None:
        sub_prefix = "sub"
        sub = self.modeler.create_box(
            ["-xl_gnd/2", "-yl_gnd/2", "-zl_sub"],
            ["xl_gnd", "yl_gnd", "zl_sub"],
            f"{sub_prefix}",
            self.CONSTANTS["sub_mat"],
        )
        sub = cast(Object3d, sub)
        sub.transparency = 0.5

    def build_dielectric_layer(self) -> None:
        pass

    def build_slot(self) -> None:
        gnd = self.modeler.get_object_from_name("gnd")
        assert gnd != None
        gnd = cast(Object3d, gnd)
        slot_name = "slot"
        slot = self.modeler.create_rectangle(
            self.hfss.PLANE.XY,
            ["-xl_slot/2", "-yl_slot/2", 0],
            ["xl_slot", "yl_slot"],
            f"{slot_name}",
        )
        gnd.subtract([slot], keep_originals=False)
        self.modeler.cleanup_objects()

    def build_feedline(self) -> None:
        pass

    def build_probe(self) -> None:
        pass

    def build_integrated_dr(self) -> None:
        pass

    def create_excitation(self) -> None:
        pass

    def create_boundary(self) -> None:
        freq = self.variables["f_c"]
        self.hfss.create_open_region(freq)

    def create_setup(self) -> SetupHFSSAuto:
        freq = self.variables["f_c"]
        match_value = re.search(r"([\d.]+)\s*\w+", freq)
        if match_value:
            freq = float(match_value.group(1))
        else:
            raise ValueError(freq)
        if self.setup_name in self.hfss.existing_analysis_setups:
            self.hfss.delete_setup(self.setup_name)
        setup_1 = cast(
            SetupHFSSAuto,
            self.hfss.create_setup(
                self.setup_name,
            ),
        )
        setup_1.enable_adaptive_setup_single(freq, 11, 0.02)
        self.hfss.create_linear_step_sweep(
            self.setup_name,
            "GHz",
            freq - self._sweep_freq_start_off,
            freq + self._sweep_freq_stop_off,
            self._sweep_step_size,
            self.sweep_name,
            sweep_type="Fast",
        )
        return setup_1

    def get_s_params(self, row: int, col: int) -> np.ndarray:
        s = self.post.get_solution_data(
            f"dB(S({row},{col}))",
            f"{self.setup_name} : {self.sweep_name}",
            "Sweep",
            report_category="Modal Solution Data",
        )
        s = cast(SolutionData, s)
        assert s.is_real_only()
        return np.array(s.data_real())
