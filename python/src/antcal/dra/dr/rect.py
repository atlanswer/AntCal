# # spell-checker:words vswr
# import typer
# from enum import StrEnum
# from rich import print
# from rich.panel import Panel
# from rich.table import Table
# import numpy as np
# from scipy.constants import c, epsilon_0 as e0
# from typing import Union


# welcome_horse = r"""

#                                        ._ o o
#                                        \_`-)|_
#                                     ,""       \
#                                   ,"  ## |   ಠ ಠ.
#                                 ," ##   ,-\__    `.
#                               ,"       /     `--._;)
#                             ,"     ## /
#                           ,"   ##    /
# """

# rect_dr_graph = r"""
#                               ----------------------------|
#                              /                           /|
#                             /   Rectangular Resonator   / |
#                            /                           /  |
#                         ^ |---------------------------/   |
#                 --------|--                           |   |----------------
#                /        | |                           |   -              /
#  z            /         | |            ε_r            |  /  ^           /
#              /   height | |                           | /  /           /
#  ^          /           | |                           |/  / depth     /
#  |    y    /            v ----------------------------/  v           /
#  |   ^    /               <--------------------------->             /
#  |  /    /                           width                         /
#  | /    /---------------------------------------------------------/
#  |/
#  |---------> x             infinite ground plane
# """


# class OpMode(StrEnum):
#     """Operation mode:
#     - `TExd11`: TE(x)d11 mode
#     - `TEy1d1`: TE(y)1d1 mode
#     - `TEz11d`: TE(z)11d mode (isolated resonator)
#     """

#     TExd11 = "TExd11"
#     TEy1d1 = "TEy1d1"
#     TEz11d = "TEz11d"


# def print_graph():
#     print(
#         Panel.fit(
#             rect_dr_graph,
#             title="Rectangular Resonator Dimensions",
#             title_align="left",
#             subtitle="""Default length unit: mm""",
#             subtitle_align="left",
#         )
#     )


# def solve_TExd11(
#     f: np.double, epsilon_r: np.double, w_h: np.double, d_h: np.double, k0: np.double
# ):
#     """Solve TE(x)d11 mode.

#     Args:
#     -----
#         - f (np.double): frequency
#         - epsilon_r (np.double): dielectric constant
#         - w_h (np.double): width/height ratio
#         - d_h (np.double): depth/height ratio
#         - k0 (np.double): wave number

#     Returns:
#     --------
#         - _type_: _description_
#     """
#     d = 0
#     for n in np.arange(0, np.Inf, 0.0001):
#         ky = np.pi * d_h / w_h / n
#         kz = np.pi * d_h / n
#         kx = np.sqrt(epsilon_r * k0**2 - ky**2 - kz**2)
#         y = kx * np.tan(kx * n / 2) - np.sqrt((epsilon_r - 1) * k0**2 - kx**2)
#         if y > 0:
#             d = n
#             break
#     b = d / d_h
#     h = b / 2
#     w = b * w_h
#     ky = np.pi / w
#     kz = np.pi / b
#     kx = np.sqrt(epsilon_r * k0**2 - ky**2 - kz**2)
#     we = (
#         e0
#         * epsilon_r
#         * w
#         * 2
#         * h
#         * d
#         / 32
#         * (1 + np.sin(kx * d) / kx / d)
#         * (ky**2 + kz**2)
#     )
#     pm = (
#         -1j
#         * 2
#         * np.pi
#         * f
#         * 1e7
#         * 8
#         * e0
#         * (epsilon_r - 1)
#         / kx
#         / ky
#         / kz
#         * np.sin(kx * d / 2)
#     )
#     k0 = np.sqrt((kx**2 + ky**2 + kz**2) / epsilon_r)
#     p_rad = 10 * k0**4 * np.linalg.norm(pm) ** 2
#     q = 4 * np.pi * f * 1e7 * we / p_rad

#     return w, d, h, q


# app = typer.Typer()


# @app.callback()
# def rect(
#     show_graph: bool = typer.Option(
#         False,
#         "--show-graph",
#         "-g",
#         help="""Show a graph about dimensions of a rectangular resonator""",
#     )
# ):
#     if show_graph:
#         print_graph()


# @app.command(name="design")
# def cli_design(
#     freq: float = typer.Option(
#         24,
#         help="Resonant frequency (GHz)",
#         prompt="""1. Enter the desired resonant frequency (GHz)""",
#     ),
#     mode: OpMode = typer.Option(
#         OpMode.TExd11,
#         help=OpMode.__doc__,
#         prompt=f"""2. Choose operating mode""",
#     ),
#     bw: float = typer.Option(
#         0.05,
#         help="""Desired minimum impedance bandwidth""",
#         prompt="""3. Enter the minmum factional bandwith (e.g.: 0.05 for 5%)""",
#     ),
#     vswr: float = typer.Option(
#         2.0,
#         help="""Tolerable voltage standing wave ratio (VSWR)""",
#         prompt="""4. Enter the VSWR for the impedance bandwidth calculations (e.g.: 2)""",
#     ),
#     er: float = typer.Option(
#         10.4,
#         help="Material dielectric constant",
#         prompt="""5. Enter DR's dielectric constant""",
#     ),
#     wh: str = typer.Option(
#         "1,0.1,2",
#         help="""Width/height ratio of the resonator (facultative)""",
#         prompt="""Enter the **width**/**height** (w/h) ratio of the DR (e.g.: 1,0.1,2)""",
#     ),
#     dh: str = typer.Option(
#         "1,0.1,2",
#         help="""Depth/height ratio of the resonator (facultative)""",
#         prompt="""Enter the **depth**/**height** (d/h) ratio of the DR (e.g.: 1,0.1,2)""",
#     ),
# ):
#     """**Design** a rectangular resonator."""

#     # Convert to numpy data
#     f = np.double(freq)  # """Frequency (GHz)"""
#     bandwidth = np.double(bw)
#     v = np.double(vswr)
#     epsilon_r = np.double(er)
#     wh_list = np.array(wh.split(","), dtype=np.double)
#     dh_list = np.array(dh.split(","), dtype=np.double)
#     w_h = d_h = np.double(0)
#     w_h_step = d_h_step = np.double(0)
#     w_h_min = w_h_max = d_h_min = d_h_max = np.double(0)
#     if len(wh_list) > 3:
#         raise typer.Exit(1)
#     elif len(wh_list) == 3:
#         [w_h_min, w_h_step, w_h_max] = wh_list
#     elif len(wh_list) == 1:
#         [w_h] = wh_list
#     if len(dh_list) > 3:
#         raise typer.Exit(1)
#     elif len(dh_list) == 3:
#         [d_h_min, d_h_step, d_h_max] = dh_list
#     elif len(dh_list) == 1:
#         [d_h] = dh_list
#     # Image effect
#     w_h_min = w_h_min / 2
#     w_h_max = w_h_max / 2
#     d_h_min = w_h_min / 2
#     d_h_max = d_h_max / 2

#     # Maximum Q factor for the minimum bandwidth and VSWR
#     q_max = (v - 1) / (np.sqrt(v) * bandwidth)

#     k0 = 2 * np.pi * f * 1e7 / c

#     result_data = np.array([])

#     if len(wh_list) == len(dh_list) == 3:
#         for k in np.arange(w_h_min, w_h_max, w_h_step):
#             for l in np.arange(d_h_min, d_h_max, d_h_step):
#                 if mode == OpMode.TExd11:
#                     w, d, h, q = solve_TExd11(f, epsilon_r, k, l, k0)
#                     if q > q_max:
#                         # print(
#                         #     """The desired bandwidth cannot be achieved in this mode
#                         #     with the specified dielectric constant and dimensions."""
#                         # )
#                         # raise typer.Exit(1)
#                         continue
#                     bw_actual = (v - 1) / (np.sqrt(v) * q) * 100
#                     result_data = np.append(
#                         result_data, [k**2, l**2, w, d, h, q, bw_actual]
#                     )

#     result = Table(title="Design Result")
#     result.add_column("width/height")
#     result.add_column("depth/height")
#     result.add_column("width (mm)")
#     result.add_column("depth (mm)")
#     result.add_column("height (mm)")
#     result.add_column("Q factor", justify="right", style="cyan")
#     result.add_column("bandwidth", justify="right", style="magenta")

#     for result_row in result_data:
#         result.add_row(result_row)

#     print(result)


# @app.command(name="analyze")
# def cli_analyze():
#     """**Analyze** a rectangular resonator."""
