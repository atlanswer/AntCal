"""Helper functions around
{py:class}`pyaedt.hfss.Hfss`
for convenience.
"""

import sys
from collections.abc import Mapping
from types import MethodType

from loguru import logger
from pyaedt.application.Variables import Variable
from pyaedt.generic.desktop_sessions import (
    _desktop_sessions,  # pyright: ignore [reportPrivateUsage]
)
from pyaedt.generic.settings import settings
from pyaedt.hfss import Hfss
from pyaedt.modeler.cad.object3d import Object3d


def __exit__(self: Hfss) -> None:
    """Release HFSS when leaving the context manager."""

    self.close_desktop()


def __del__(self: Hfss) -> None:
    """Release HFSS when there's no more reference."""

    self.close_desktop()


def close_desktop(self: Hfss) -> None:
    """Close desktop without saving the project."""

    try:
        self.close_project(save_project=False)
    except Exception as e:
        logger.error(f"Exception occurred during closing: {e}.")

    self.odesktop.QuitApplication()  # pyright: ignore[reportOptionalMemberAccess]


def new_hfss_session(non_graphical: bool = False) -> Hfss:
    """Create a new HFSS instance, defaults to the latest version.

    A workaround to achieve multiple desktop sessions.

    :param bool non_graphical: Launch AEDT in non graphical mode,
    defaults to False
    :return Hfss: Hfss object

    :Examples:
    ```py
    >>> h1 = new_hfss_session()
    >>> h2 = new_hfss_session()
    ```
    """

    # Fallback to PythonNET
    settings.use_grpc_api = False
    # Reset desktop session tracker
    _desktop_sessions.clear()
    # Remove existing desktop handle
    if "oDesktop" in dir(sys.modules["__main__"]):
        try:
            del sys.modules["__main__"].oDesktop  # pyright: ignore
        except AttributeError:
            logger.error("Failed to remove `oDesktop` from `__main__`")

    # Create a new HFSS object
    h = Hfss(non_graphical=non_graphical, new_desktop_session=True)

    # Rebind desktop properties
    d = sys.modules["__main__"].oDesktop
    desktop_install_dir = sys.modules["__main__"].sDesktopinstallDirectory
    h._odesktop = d  # pyright: ignore [reportPrivateUsage]
    # h._odesktop.aedt_version_id = h.odesktop.GetVersion()[0:6]
    h._desktop_install_dir = desktop_install_dir  # pyright: ignore [reportPrivateUsage]

    # Patch close methods
    h.close_desktop = MethodType(close_desktop, h)
    h.__exit__ = MethodType(__exit__, h)

    # My preferences
    # h.autosave_enable()
    h.autosave_disable()
    # h.logger.disable_stdout_log()  # pyright: ignore[reportGeneralTypeIssues]
    # h.change_material_override()

    return h


def get_variables(hfss: Hfss) -> dict[str, str]:
    vm = hfss.variable_manager
    if not vm:
        return {}
    return {k: v.evaluated_value for k, v in vm.design_variables.items()}


def update_variables(
    hfss: Hfss,
    variables: Mapping[str, str],
    constants: Mapping[str, str | float] | None = None,
) -> None:
    vm = hfss.variable_manager
    if not vm:
        return
    for item in variables.items():
        vm.set_variable(*item)
    if not constants:
        return
    for item in constants.items():
        vm.set_variable(*item)


def check_materials(hfss: Hfss, materials: str | list[str]) -> None:
    """If the material exists and is not in the materials database,
    it is added to this database."""

    mat = hfss.materials
    if isinstance(materials, str):
        materials = [materials]
    for material in materials:
        mat.checkifmaterialexists(material)


def set_material_appearance(
    obj: Object3d, material_appearance: bool = True
) -> None:
    vMaterialAppearance = [
        "NAME:Material Appearance",
        "Value:=",
        material_appearance,
    ]
    obj._change_property(vMaterialAppearance)  # pyright: ignore[reportPrivateUsage]


class MyVariable(Variable):
    def __init__(self, expression: str, name: str, hfss: Hfss):
        super().__init__(expression, name=name, app=hfss)
        self.expression = expression

    def __str__(self) -> str:
        name = self.name
        assert isinstance(name, str)

        return name
