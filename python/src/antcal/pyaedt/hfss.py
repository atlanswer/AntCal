"""Helper functions around {py:class}`pyaedt.hfss.Hfss` for convenience."""

from collections.abc import Mapping
from typing import Literal

from ansys.aedt.core.application.variables import Variable, VariableManager
from ansys.aedt.core.generic.constants import Axis
from ansys.aedt.core.generic.file_utils import generate_unique_name
from ansys.aedt.core.hfss import Hfss
from ansys.aedt.core.modeler.cad.object_3d import Object3d
from ansys.aedt.core.modeler.modeler_3d import Modeler3D
from ansys.aedt.core.modules.material_lib import Materials


class MyVariable(Variable):
    """Helper class for using variables in an HFSS instance.

    Usage:
    ```
    from functools import partial

    hfss = Hfss(...)
    Variable = partial(MyVariable, hfss=hfss)

    var1 = Variable("3.14 mm", "var1")
    ```
    """

    def __init__(self, expression: str, name: str, hfss: Hfss):
        super().__init__(expression, name=name, app=hfss)
        self.expression = expression

    def __str__(self) -> str:
        name = self.name
        assert isinstance(name, str)

        return name


def get_variables(hfss: Hfss) -> dict[str, str]:
    """Fetches all design variables and converts them to a Python dict

    Args:
        hfss (Hfss): HFSS instance

    Returns:
        dict[str, str]: All variables
    """

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
    assert isinstance(vm, VariableManager)

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
    assert isinstance(mat, Materials)
    if isinstance(materials, str):
        materials = [materials]
    for material in materials:
        mat.checkifmaterialexists(material)


def create_linear_structure(
    hfss: Hfss,
    type: Literal["hole", "via"],
    size: str,
    starting_point: list[str],
    direction: Literal["X", "Y"],
    length: str,
    min_distance: str,
    shape: Literal["cylindrical", "rectangular"] = "cylindrical",
    omit_start: bool = False,
    omit_end: bool = False,
    offset: str | None = None,
) -> Object3d:
    """Generate a linear array of hole or via alone X or Y axis.

    Args:
        hfss (Hfss): HFSS instance
        type (Literal["hole", "via"]): Structure type
        size (str): Dimension of each item
        starting_point (list[str]): Starting position
        direction (Literal["X", "Y"]): Array span direction
        length (str): Array length
        min_distance (str): Minimum distance between each item
        shape (Literal["cylindrical", "rectangular"], optional):
        Shape of each item. Defaults to "cylindrical".
        omit_start (bool, optional): Ignore the first item. Defaults to False.
        omit_end (bool, optional): Ignore the last item. Defaults to False.
        offset (str | None, optional): Offset to both ends. Defaults to None.

    Returns:
        Object3d: Generated linear structure
    """

    modeler = hfss.modeler
    assert isinstance(modeler, Modeler3D)

    material = "vacuum" if type == "hole" else "copper"

    length = f"({length})"
    if offset:
        length = f"({length} - ({offset}) * 2)"

    min_c2c_item = f"({size} + {min_distance})"
    n_item = f"(int({length} / {min_c2c_item}) + 1)"
    c2c_item = f"({length} / ({n_item} - 1))"

    match shape:
        case "rectangular":
            sp_x = f"{starting_point[0]} - {size} / 2"
            sp_y = f"{starting_point[1]} - {size} / 2"
            if offset:
                match direction:
                    case "X":
                        sp_x += f" + {offset}"
                    case "Y":
                        sp_y += f" + {offset}"
            if omit_start:
                match direction:
                    case "X":
                        sp_x += f" + {c2c_item}"
                    case "Y":
                        sp_y += f" + {c2c_item}"
            item1 = modeler.create_box(
                [sp_x, sp_y, 0],
                [f"{size}", f"{size}", "zl_sub2"],
                generate_unique_name(type),
                material,
            )
        case "cylindrical":
            sp_x = f"{starting_point[0]}"
            sp_y = f"{starting_point[1]}"
            if offset:
                match direction:
                    case "X":
                        sp_x += f" + {offset}"
                    case "Y":
                        sp_y += f" + {offset}"
            if omit_start:
                match direction:
                    case "X":
                        sp_x += f" + {c2c_item}"
                    case "Y":
                        sp_y += f" + {c2c_item}"
            item1 = modeler.create_cylinder(
                Axis.Z,
                [sp_x, sp_y, 0],
                f"{size} / 2",
                "zl_sub2",
                name=generate_unique_name(type),
                material=material,
            )
    assert isinstance(item1, Object3d)

    duplicate_vector = (
        [f"{c2c_item}", 0, 0] if direction == "X" else [0, f"{c2c_item}", 0]
    )

    if omit_start:
        n_item += "- 1"
    if omit_end:
        n_item += "- 1"

    item1.duplicate_along_line(duplicate_vector, f"{n_item}", True)  # pyright: ignore

    return item1
