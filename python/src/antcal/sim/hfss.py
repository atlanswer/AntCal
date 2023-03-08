# %% Import
from __future__ import annotations
from enum import Enum
from os import getcwd, mkdir, path
from typing import cast
from pyaedt.application.Variables import VariableManager
from pyaedt.generic.general_methods import remove_project_lock
from pyaedt.hfss import Hfss
from pyaedt.modeler.modeler3d import Modeler3D
from pyaedt.modules.AdvancedPostProcessing import PostProcessor
from pyaedt.modules.MaterialLib import Materials


# %% Class
class SOLUTIONS:
    """Provides the names of default solution types."""

    class Hfss(Enum):
        """Provides HFSS solution types."""

        DrivenModal = ("Modal",)
        DrivenTerminal = ("Terminal",)
        EigenMode = ("Eigenmode",)
        Transient = ("Transient Network",)
        SBR = ("SBR+",)
        Characteristic = ("Characteristic",)


class HFSS:
    """Represents a HFSS design"""

    def __init__(
        self,
        non_graphical: bool,
        design_name: str,
        solution_type: SOLUTIONS.Hfss,
        project_name: str = "project.aedt",
        project_dir: str = "projectfiles",
    ) -> None:
        """Initialize HFSS"""
        self._project_dir = path.join(getcwd(), project_dir)
        if not path.exists(self._project_dir):
            mkdir(self._project_dir)
        self._project_path = path.join(self._project_dir, project_name)
        remove_project_lock(self._project_path)
        self._hfss = Hfss(
            self._project_path,
            design_name,
            solution_type,
            non_graphical=non_graphical,
            close_on_exit=True,
        )
        self.hfss.autosave_enable()
        self.hfss.change_material_override()
        print("[antcal.design.HFSS] HFSS initialized.")

    def __enter__(self) -> HFSS:
        return self

    def __exit__(self) -> bool | None:
        """Release HFSS"""
        print("[antcal.design.HFSS] Releasing HFSS...")
        res = self.release()
        if res:
            print("[antcal.design.HFSS] HFSS released successfully.")
        else:
            print("[antcal.design.HFSS] Failed releasing HFSS")
        return None

    def __del__(self) -> None:
        """Release HFSS"""
        self.__exit__()

    def release(self) -> bool:
        """Release HFSS"""
        return self.hfss.release_desktop()

    @property
    def hfss(self) -> Hfss:
        """Return HFSS handle"""
        return self._hfss

    @property
    def name(self) -> str:
        """Return HFSS design name"""
        return cast(str, self.hfss.design_name)

    @property
    def setup_name(self) -> str:
        """Return current setup name"""
        return cast(str, self.hfss.analysis_setup)

    @property
    def variables(self) -> dict[str, str]:
        """Return design variables"""
        return {
            k: v.evaluated_value
            for k, v in self.variable_manager.design_variables.items()
        }

    @variables.setter
    def variables(self, variables: dict[str, str]) -> None:
        """Assign design variables"""
        for item in variables.items():
            self.variable_manager.set_variable(*item)

    @property
    def modeler(self) -> Modeler3D:
        """Return modeler"""
        return cast(Modeler3D, self.hfss.modeler)

    @property
    def materials(self) -> Materials:
        """Return materials"""
        return self.hfss.modeler.materials

    @property
    def post(self) -> PostProcessor:
        """Return post processor"""
        return cast(PostProcessor, self.hfss.post)

    @property
    def variable_manager(self) -> VariableManager:
        variable_manager = self.hfss.variable_manager
        if not variable_manager:
            raise AttributeError(variable_manager)
        return variable_manager

    def solve(self, setup_name: str) -> None:
        """Solve current setup"""
        self.hfss.save_project()
        assert self.hfss.validate_simple()
        self.hfss.analyze_setup(setup_name)
