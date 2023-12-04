"""Slotted Patch.

Reference: A. Papathanasopoulos,
P. A. Apostolopoulos and Y. Rahmat-Samii,
"Optimization Assisted by Neural Network-Based
Machine Learning in Electromagnetic Applications,"
_IEEE Transactions on Antennas and Propagation_,
doi: 10.1109/TAP.2023.3269883.
"""

# %%
import asyncio
import time

import numpy as np
import numpy.typing as npt
from loguru import logger
from pyaedt.hfss import Hfss
from pyaedt.modeler.cad.elements3d import FacePrimitive
from pyaedt.modeler.cad.object3d import Object3d
from pyaedt.modeler.modeler3d import Modeler3D
from pyaedt.modules.solutions import SolutionData
from pyaedt.modules.SolveSetup import SetupHFSS

from antcal.pyaedt.hfss import (
    check_materials,
    new_hfss_session,
    update_variables,
)

# %%
N_DIMS_SLOTTED_PATCH = 10
VAR_BOUNDS = (
    [30.0, 30.0, 1.0, 1.0, 1.0, -10.0, 7.5, 5.0, 0.0, 0.0],
    [70.0, 70.0, 10.0, 10.0, 50.0, 10.0, 70.0, 35.0, 30.0, 10.0],
)
"""`(lower_bounds, upper_bounds)`"""
SUGGESTED_PARAMS = [
    67.84,
    57.57,
    5.98,
    5.68,
    2.66,
    -3.22,
    52.81,
    25.47,
    22.15,
    8.95,
]
"""Suggested parameters from the paper"""


def check_constrains(v: npt.NDArray[np.float32]) -> bool:
    """Return `False` if dimensions are invalid."""

    if v.shape[0] != N_DIMS_SLOTTED_PATCH:
        raise ValueError("v does not contain 10 elements.")
    w = v[0]
    L = v[1]
    wr = v[2]
    wu = v[3]
    lr = v[4]
    pr = v[5]
    lh = v[6]
    lv = v[7]
    fx = v[8]
    fy = v[9]
    if not fx < L / 2:
        return False
    if not fy < lv - wu:
        return False
    if not lh < L:
        return False
    if not lr < L:
        return False
    if not L < w / 2 - wr / 2 + pr:
        return False
    return True


def convert_to_variables(v: npt.NDArray[np.float32]) -> dict[str, str]:
    variables = {
        "h": "3.175 mm",
        "W": f"{v[0]} mm",
        "L": f"{v[1]} mm",
        "Wr": f"{v[2]} mm",
        "Wu": f"{v[3]} mm",
        "Lr": f"{v[4]} mm",
        "Pr": f"{v[5]} mm",
        "Lh": f"{v[6]} mm",
        "Lv": f"{v[7]} mm",
        "fx": f"{v[8]} mm",
        "fy": f"{v[9]} mm",
        "Lg": "L+6*h",
        "Wg": "W+6*h",
    }

    return variables


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
    port_face = probe_ins.bottom_face_z
    assert isinstance(port_face, FacePrimitive)
    assert port_face.is_planar
    port = modeler.create_object_from_face(port_face)
    hfss.create_lumped_port_to_sheet(
        port,
        [port_face.edges[1].midpoint, port_face.edges[0].midpoint],  # pyright: ignore
        portname="1",
        renorm=False,
    )
    # hfss.lumped_port(
    #     probe_in,
    #     probe_out,
    #     True,
    #     name="1",
    #     renormalize=False,
    # )

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


def solve_sync(hfss: Hfss) -> SolutionData:
    """Synchronously solve and return solution data."""

    setup_name = "Auto1"
    setup = hfss.get_setup(setup_name)
    assert isinstance(setup, SetupHFSS)
    setup.analyze(10, 3, use_auto_settings=True)

    solution_data = setup.get_solution_data(
        "dB(S(1,1))", f"{setup_name} : LastAdaptive"
    )
    assert isinstance(solution_data, SolutionData)

    return solution_data


async def solve(hfss: Hfss) -> SolutionData:
    """Asynchronously solve and return solution data."""

    setup_name = "Auto1"
    setup = hfss.get_setup(setup_name)
    assert isinstance(setup, SetupHFSS)
    setup.analyze(10, 3, use_auto_settings=True, blocking=False)

    while hfss.are_there_simulations_running:
        await asyncio.sleep(5)

    solution_data = setup.get_solution_data(
        "dB(S(1,1))", f"{setup_name} : LastAdaptive"
    )
    assert isinstance(solution_data, SolutionData)

    return solution_data


def obj_fn_sync(hfss: Hfss, v: npt.NDArray[np.float32]) -> np.float32:
    """Object function (synchronous)."""

    variables = convert_to_variables(v)

    create_slotted_patch(hfss, variables)
    assert hfss.validate_full_design()[1]

    solution_data = solve_sync(hfss)

    s11 = solution_data.data_real()
    assert isinstance(s11, list)

    return np.max(s11)


async def obj_fn(
    aedt_queue: asyncio.Queue[Hfss], v: npt.NDArray[np.float32]
) -> np.float32:
    """Object function (asynchronous)."""

    hfss = await aedt_queue.get()
    process_id = hfss.odesktop.GetProcessID()
    logger.debug(f"HFSS ({process_id}) received task: {v}.")

    variables = convert_to_variables(v)

    create_slotted_patch(hfss, variables)
    assert hfss.validate_full_design()[1]

    t_start = time.time()

    solution_data = await solve(hfss)

    t_finish = time.time()

    time_str = time.strftime(
        r"%M min %S sec", time.localtime(t_finish - t_start)
    )
    logger.debug(f"HFSS ({process_id}) solved in {time_str}.")

    s11 = solution_data.data_real()
    assert isinstance(s11, list)

    await aedt_queue.put(hfss)

    return np.max(s11)


# %%
if __name__ == "__main__":
    h1 = new_hfss_session()
    v = np.array(
        [67.84, 57.57, 5.98, 5.68, 2.66, -3.22, 52.81, 25.47, 22.15, 8.95]
    )
    print(obj_fn(h1, v))
