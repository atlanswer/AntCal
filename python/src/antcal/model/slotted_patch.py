"""Slotted Patch"""

# %%
from importlib import reload
import numpy as np
from pyaedt.hfss import Hfss
from pyaedt.modeler.cad.object3d import Object3d
from pyaedt.modeler.modeler3d import Modeler3D
from pyaedt.modules.SolveSetup import SetupHFSS
from pyaedt.modules.solutions import SolutionData
import antcal.pyaedt.hfss

reload(antcal.pyaedt.hfss)
from antcal.pyaedt.hfss import (
    new_hfss_session,
    update_variables,
    check_materials,
)


# %%
def create_slotted_patch(hfss: Hfss, variables: dict[str, str]) -> None:
    materials = ["pec", "Rogers RT/duroid 5880 (tm)", "Teflon (tm)"]

    hfss.solution_type = hfss.SolutionTypes.Hfss.DrivenModal
    hfss.set_auto_open()
    hfss.odesign.SetDesignSettings(  # pyright:ignore[reportOptionalMemberAccess]
        ["NAME:Design Settings Data", "Port Validation Settings:=", "Extended"],
    )
    # hfss.change_material_override()
    update_variables(hfss, variables)

    modeler = hfss.modeler
    assert isinstance(modeler, Modeler3D)

    check_materials(hfss, materials)

    current_objects = modeler.object_names
    if "RadiatingSurface" in current_objects:
        current_objects.remove("RadiatingSurface")
    modeler.delete(current_objects)
    modeler.cleanup_objects()

    substrate = modeler.create_box(
        ["-Lg/2", "-Wg/2", "0 mm"],
        ["Lg", "Wg", "-h"],
        "substrate",
        "Rogers RT/duroid 5880 (tm)",
    )
    assert isinstance(substrate, Object3d)

    patch = modeler.create_rectangle(
        hfss.PLANE.XY, ["-L/2", "-W/2", "0 mm"], ["L", "W"], "patch"
    )
    assert isinstance(patch, Object3d)
    slot1 = modeler.create_rectangle(
        hfss.PLANE.XY, ["L/2", "Pr-Wr/2", "0 mm"], ["-Lr", "Wr"], "slot1"
    )
    slot2 = modeler.create_rectangle(
        hfss.PLANE.XY, ["-Lh/2", "-W/2+Lv-Wu", "0mm"], ["Lh", "Wu"], "slot2"
    )
    slot3 = modeler.create_rectangle(
        hfss.PLANE.XY, ["-Lh/2", "-W/2", "0 mm"], ["Wu", "Lv"], "slot3"
    )
    patch.subtract([slot1, slot2, slot3], False)
    hfss.assign_perfecte_to_sheets(patch, "patch")

    gnd = modeler.create_rectangle(
        hfss.PLANE.XY, ["-Lg/2", "-Wg/2", "-h"], ["Lg", "Wg"], "gnd"
    )
    assert isinstance(gnd, Object3d)
    hfss.assign_perfecte_to_sheets(gnd, "gnd")

    probe_in = modeler.create_cylinder(
        hfss.AXIS.Z,
        ["fx", "-W/2+fy", "0 mm"],
        "0.91 mm / 2",
        "-2*h",
        name="probe_in",
        matname="pec",
    )
    substrate.subtract(probe_in)
    probe_out = modeler.create_cylinder(
        hfss.AXIS.Z,
        ["fx", "-W/2+fy", "-h"],
        "3.58 mm / 2",
        "-h",
        name="probe_out",
        matname="pec",
    )
    assert isinstance(probe_out, Object3d)
    gnd.subtract(probe_out)
    probe_ins = modeler.create_cylinder(
        hfss.AXIS.Z,
        ["fx", "-W/2+fy", "-h"],
        "2.97 mm / 2",
        "-h",
        name="probe_ins",
        matname="Teflon (tm)",
    )
    assert isinstance(probe_ins, Object3d)
    probe_out.subtract(probe_ins)
    probe_ins.subtract(probe_in)
    hfss.lumped_port(
        probe_in,
        probe_out,
        True,
        name="1",
        renormalize=False,
    )

    setup_name = "Auto1"
    setup = hfss.get_setup(setup_name)
    assert isinstance(setup, SetupHFSS)
    setup.enable()

    if "MultipleAdaptiveFreqsSetup" not in setup.props:
        setup.props["MultipleAdaptiveFreqsSetup"] = {}

    setup.enable_adaptive_setup_multifrequency([1.9, 2.4], 0.02)
    setup.update({"MaximumPasses": 20})

    # sweep_name = "Sweep1"
    # sweep = setup.create_frequency_sweep(
    # "GHz", 1.5, 3, 401, sweep_name, sweep_type="Fast"
    # )
    # hfss.create_linear_count_sweep()

    # sweeps = h1.get_sweeps(setup_name)


def solve(hfss: Hfss) -> SolutionData:
    setup_name = "Auto1"
    setup = hfss.get_setup(setup_name)
    assert isinstance(setup, SetupHFSS)
    setup.analyze(16, 3, 0, use_auto_settings=False)

    solution_data = setup.get_solution_data(
        "dB(S(1,1))", f"{setup_name} : LastAdaptive"
    )
    assert isinstance(solution_data, SolutionData)

    return solution_data


def obj_fn(hfss: Hfss, variables: dict[str, str]) -> np.float32:
    create_slotted_patch(hfss, variables)
    assert hfss.validate_full_design()[1]

    solution_data = solve(hfss)

    s11 = solution_data.data_real()
    assert isinstance(s11, list)

    return np.max(s11)


# %%
if __name__ == "__main__":
    h1 = new_hfss_session()
    variables = {
        "h": "3.175mm",
        "L": "57.57mm",
        "W": "67.84mm",
        "Lg": "L+6*h",
        "Wg": "W+6*h",
        "Lr": "2.66mm",
        "Wr": "5.98mm",
        "Lh": "52.81mm",
        "Lv": "25.47mm",
        "Wu": "5.68mm",
        "fx": "22.15mm",
        "fy": "8.95mm",
        "Pr": "-3.22mm",
    }
    print(obj_fn(h1, variables))
