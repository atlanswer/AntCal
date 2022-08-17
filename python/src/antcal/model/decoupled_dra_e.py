"""Decoupled DRAs: E-Plane.

Reference: C. Tong, N. Yang, K. W. Leung, P. Gu, and R. Chen,
"Port and Radiation Pattern Decoupling of Dielectric Resonator Antennas,"
_IEEE Transactions on Antennas and Propagation_,
vol. 70, no. 9, pp. 7713-7726, Sept. 2022,
doi: 10.1109/tap.2022.3177547.
"""

# %%
from dataclasses import asdict, dataclass
from importlib import reload
from typing import Literal, get_args

import numpy as np
import numpy.typing as npt
from loguru import logger
from pyaedt.hfss import Hfss
from pyaedt.modeler.cad.elements3d import FacePrimitive
from pyaedt.modeler.cad.object3d import Object3d
from pyaedt.modeler.modeler3d import Modeler3D
from pyaedt.modules.AdvancedPostProcessing import PostProcessor
from pyaedt.modules.Material import Material
from pyaedt.modules.solutions import SolutionData
from pyaedt.modules.SolveSetup import SetupHFSS
from pyaedt.modules.SolveSweeps import SweepHFSS

import antcal.pyaedt.hfss

reload(antcal.pyaedt.hfss)
from antcal.pyaedt.hfss import (
    check_materials,
    new_hfss_session,
    update_variables,
)

# %%
PLANES_LITERAL = Literal["e", "E", "h", "H"]
PARAMS_LIST = [
    "a",
    "b",
    "h",
    "l1",
    "w1",
    "l2",
    "w2",
    "l3",
    "w3",
    "ts",
    "ls",
    "ws",
    "lg",
    "wg",
    "l4",
    "w4",
    "d1",
]
SUGGESTED_PARAMS = np.array(
    [
        46,
        23,
        7.2,
        10,
        1.8,
        4.7,
        0.5,
        2.7,
        0.2,
        1.524,
        15,
        2,
        73,
        50,
        30,
        3.6,
        0.8,
    ],
    dtype=np.float32,
)


@dataclass
class Constants:
    epsilon_d: float = 9.9
    epsilon_s: float = 3.55
    tc: str = "0.035 mm"
    freq_center: float = 4.9
    freq_start: float = 4.6
    freq_end: float = 5.2
    num_of_freq_points: int = 61
    max_passes: int = 12
    max_delta_s: float = 0.02
    # "theta_start": -180,
    # "theta_stop": 180,
    # "theta_step": 1,
    # "phi_e_plane": 0,
    # "phi_h_plane": 90,


constants = Constants()


MATERIALS = ["pec", "copper"]


def convert_to_variables(v: npt.NDArray[np.float32]) -> dict[str, str]:
    return {p: f"{v:.4f} mm" for p, v in zip(PARAMS_LIST, v, strict=True)}


def create_decoupled_dra_h(hfss: Hfss, variables: dict[str, str]) -> None:
    hfss.solution_type = hfss.SolutionTypes.Hfss.DrivenModal
    hfss.odesign.SetDesignSettings(  # pyright:ignore[reportOptionalMemberAccess]
        ["NAME:Design Settings Data", "Port Validation Settings:=", "Extended"]
    )
    hfss.set_auto_open(False)

    modeler = hfss.modeler
    assert isinstance(modeler, Modeler3D)

    current_objects = modeler.object_names
    if "RadiatingSurface" in current_objects:
        current_objects.remove("RadiatingSurface")
    modeler.purge_history(current_objects)
    modeler.delete(current_objects)
    modeler.refresh()

    hfss.set_auto_open()
    update_variables(hfss, variables, asdict(constants))
    check_materials(hfss, MATERIALS)

    materials = hfss.materials
    mat_sub1 = materials.add_material("mat_sub1")
    assert isinstance(mat_sub1, Material)
    mat_sub1.permittivity = hfss["epsilon_s"]
    mat_sub1.dielectric_loss_tangent = 0.0027
    mat_sub2 = materials.add_material("mat_sub2")
    assert isinstance(mat_sub2, Material)
    mat_sub2.permittivity = hfss["epsilon_d"]

    sub1 = modeler.create_box(
        ["a/4-lg/2", "-wg/2", "-ts-tc"], ["lg", "wg", "ts"], "sub1", "mat_sub1"
    )
    assert isinstance(sub1, Object3d)

    gnd = modeler.create_object_from_face(sub1.top_face_z)
    assert isinstance(gnd, Object3d)
    gnd.name = "gnd"

    slot1 = modeler.create_rectangle(
        hfss.PLANE.XY, ["-ws/2", "-ls/2", "-tc"], ["ws", "ls"], "slot1"
    )
    assert isinstance(slot1, Object3d)
    # slot2 = slot1.duplicate_along_line(["a/2", 0, 0])
    # assert isinstance(slot2, list)
    # slot2.append(slot1)

    gnd.subtract(slot1, False)
    modeler.thicken_sheet(gnd, "tc")
    gnd.material_name = "copper"

    dr1 = modeler.create_box(
        ["-a/4", "-b/2", 0], ["a/2", "b", "h"], "dr1", "mat_sub2"
    )
    assert isinstance(dr1, Object3d)
    dr1_top = dr1.top_face_z
    assert isinstance(dr1_top, FacePrimitive)
    dr1_top.create_object(True)
    dr2 = modeler.create_box(
        ["a/4", "-b/2", 0], ["a/2", "b", "h"], "dr2", "mat_sub2"
    )
    assert isinstance(dr2, Object3d)
    dr2_top = dr2.top_face_z
    assert isinstance(dr2_top, FacePrimitive)
    dr2_top.create_object(True)

    feed1 = modeler.create_box(
        ["a/4-lg/2", "-w4/2", "-ts-tc*2"], ["l4", "w4", "tc"], "feed1", "copper"
    )
    assert isinstance(feed1, Object3d)
    feed1.mirror(["a/4", 0, 0], [1, 0, 0], duplicate=True)
    feed2 = modeler.get_object_from_name("feed1_1")
    assert isinstance(feed2, Object3d)

    port1 = modeler.create_rectangle(
        hfss.PLANE.YZ,
        ["a/4-lg/2", "-w4/2", "-ts-tc*2"],
        ["w4", "ts+tc*2"],
        "port1",
    )
    assert isinstance(port1, Object3d)
    # port1.mirror(["a/4", 0, 0], [1, 0, 0], duplicate=True)
    # port2 = modeler.get_object_from_name("port1_1")
    # assert isinstance(port2, Object3d)
    hfss.create_lumped_port_to_sheet(
        port1, hfss.AxisDir.ZNeg, portname="1", renorm=False
    )
    # hfss.create_lumped_port_to_sheet(
    #     port2, hfss.AxisDir.ZNeg, portname="2", renorm=False
    # )

    strip1 = modeler.create_rectangle(
        hfss.PLANE.YZ,
        ["a/4", "-l1/2", "d1"],
        ["l1", "w1+w2+l3"],
        "strip1",
        "copper",
    )
    assert isinstance(strip1, Object3d)
    r2 = modeler.create_rectangle(
        hfss.PLANE.YZ, ["a/4", "-w3/2-l2", "d1+w2"], ["l2", "l3"], "copper"
    )
    r3 = modeler.create_rectangle(
        hfss.PLANE.YZ, ["a/4", "w3/2", "d1+w2"], ["l2", "l3"], "copper"
    )
    strip1.subtract([r2, r3], keep_originals=False)
    # modeler.thicken_sheet(strip1, "-tc")
    hfss.assign_perfecte_to_sheets(strip1, sourcename="strip")

    modeler.cleanup_objects()

    setup_name = "Auto1"
    setup = hfss.get_setup(setup_name)
    assert isinstance(setup, SetupHFSS)
    setup.enable()
    setup.enable_adaptive_setup_single(
        f"{constants.freq_center} GHz",
        constants.max_passes,
        constants.max_delta_s,
    )
    setup.update(
        {
            "MinimumConvergedPasses": 2,
            "PercentRefinement": 45,
            "BasisOrder": -1,
            "DrivenSolverType": "Auto Select Direct/Iterative",
        }
    )

    sweep_name = "Sweep1"
    if sweep_name in hfss.get_sweeps(setup_name):
        setup.omodule.DeleteSweep(setup_name, sweep_name)
    sweep = setup.create_frequency_sweep(
        "GHz",
        constants.freq_start,  # type: ignore
        constants.freq_end,  # type: ignore
        constants.num_of_freq_points,
        sweep_name,
        sweep_type="Fast",
    )
    assert isinstance(sweep, SweepHFSS)

    logger.debug("Build completed.")


def solve_sync(hfss: Hfss) -> None:
    assert hfss.validate_full_design()[1]

    setup_name = "Auto1"

    setup = hfss.get_setup(setup_name)
    assert isinstance(setup, SetupHFSS)
    setup.analyze(10, 3, use_auto_settings=True)


def get_s_params(hfss: Hfss) -> SolutionData:
    setup_name = "Auto1"
    sweep_name = "Sweep1"

    setup = hfss.get_setup(setup_name)
    solution_data = setup.get_solution_data(
        domain="Sweep", sweep_name=sweep_name
    )
    assert isinstance(solution_data, SolutionData)

    return solution_data


def get_patterns(hfss: Hfss, plane: PLANES_LITERAL) -> SolutionData:
    if plane not in get_args(PLANES_LITERAL):
        raise TypeError(f'Plane "{plane}" is not one of {PLANES_LITERAL}')

    phi = "0deg" if plane.lower() == "e" else "90deg"

    setup_name = "Auto1"

    setup = hfss.get_setup(setup_name)
    solution_data = setup.get_solution_data(
        expressions=["GainPhi", "GainTheta"],
        report_category="Far Fields",
        variations={"Phi": phi},
        primary_sweep_variable="Theta",
        context="Elevation",
        sweep_name="LastAdaptive",
    )
    assert isinstance(solution_data, SolutionData)

    return solution_data


# %%
def run():
    h1.logger.clear_messages("", "", 3)  # type: ignore

    variables = convert_to_variables(SUGGESTED_PARAMS)
    create_decoupled_dra_h(h1, variables)

    logger.debug(h1.validate_full_design())

    solve_sync(h1)


if __name__ == "__main__":
    run()


# %%
def run2():
    s_params = get_s_params(h1)

    import matplotlib.pyplot as plt

    plt.style.use(["default", "seaborn-v0_8-paper"])

    fig, ax = plt.subplots()
    ax.grid()
    ax.plot(s_params.primary_sweep_values, s_params.data_db20("S(1,1)"))
    ax.plot(s_params.primary_sweep_values, s_params.data_db20("S(1,2)"))
    fig.show()


if __name__ == "__main__":
    run2()


# %%
def run3():
    patterns = get_patterns(h1, "e")

    import matplotlib.pyplot as plt

    plt.style.use(["default", "seaborn-v0_8-paper"])

    _, ax = plt.subplots()
    ax.grid()
    ax.plot(patterns.primary_sweep_values, patterns.data_db10("GainPhi"))
    ax.plot(patterns.primary_sweep_values, patterns.data_db10("GainTheta"))
    # fig.show()


if __name__ == "__main__":
    run3()


# %%
if __name__ == "__main__":
    h1 = new_hfss_session()


# %%
def get_power_flow(hfss: Hfss, surfname: str):
    setup_name = "Auto1"

    post = hfss.post
    assert isinstance(post, PostProcessor)
    calc = post.ofieldsreporter
    calc.CalcStack("Clear")

    calc.EnterQty("Poynting")
    calc.CalcOp("Real")
    calc.CalcOp("Normal")
    calc.CalcOp("Dot")
    calc.EnterSurf(surfname)
    calc.CalcOp("SurfaceValue")
    calc.CalcOp("Integrate")
    # calc.ClcEval(
    #     f"{setup_name} : LastAdaptive",
    #     ["Freq:=", f"{constants.freq_center}GHz", "Phase:=", "0deg"],
    # )
    return float(
        calc.GetTopEntryValue(
            f"{setup_name} : LastAdaptive",
            ["Freq:=", f"{constants.freq_center}GHz", "Phase:=", "0deg"],
        )[0]
    )


if __name__ == "__main__":
    s = get_power_flow(h1, "dr1_ObjectFromFace1")  # type: ignore
    logger.debug(type(s))
    logger.debug(s)

# %%
