"""Design tools."""

from ansys.aedt.core.modules.material_lib import Materials


def import_materials(materials: Materials, material: str | list[str]) -> None:
    """Import materials from the system lib.

    :param pyaedt.modules.MaterialLib.Materials materials: AEDT material database
    :param str | list[str] material: The name of materials to be imported
    """
    if not isinstance(material, list):
        material = [material]
    for mat in material:
        # spell-checker: words checkifmaterialexists
        materials.checkifmaterialexists(mat)  # pyright: ignore
