# spell-checker:words vswr
import typer
from enum import StrEnum
from rich import print
from rich.panel import Panel
import numpy as np
from scipy.constants import c, epsilon_0 as e0


welcome_horse = r"""

                                       ._ o o
                                       \_`-)|_
                                    ,""       \ 
                                  ,"  ## |   ಠ ಠ. 
                                ," ##   ,-\__    `.
                              ,"       /     `--._;)
                            ,"     ## /
                          ,"   ##    /
"""

rect_dr_graph = r"""
                      ----------------------------|                
                     /                           /|                
                    /   Rectangular Resonator   / |                
                   /                           /  |                
                ^ |---------------------------/   |                
        --------|--                           |   |----------------
       /        | |                           |   -              / 
      /         | |            ε_r            |  /  ^           /  
     /   height | |                           | /  /           /   
    /           | |                           |/  / depth     /    
   /            v ----------------------------/  v           /     
  /               <--------------------------->             /      
 /                           width                         /       
/---------------------------------------------------------/        
                                                                   
                   infinite ground plane                           
"""


class OpMode(StrEnum):
    """Operation mode:
    - `TExd11`: TE(x)d11 mode
    - `TEy1d1`: TE(y)1d1 mode
    - `TEz11d`: TE(z)11d mode (isolated resonator)
    """

    TExd11 = "TExd11"
    TEy1d1 = "TEy1d1"
    TEz11d = "TEz11d"


def print_graph():
    print(
        Panel.fit(
            rect_dr_graph,
            title="Rectangular Resonator Dimensions",
            title_align="left",
            subtitle="""Default length unit: mm""",
            subtitle_align="left",
        )
    )


def solve_TExd11(
    f: np.double, epsilon_r: np.double, w_h: np.double, d_h: np.double, k0: np.double
):
    """Solve TExd11 mode"""
    d = 0
    for n in np.arange(0, np.Inf, 0.0001):
        ky = np.pi * d_h / w_h / n
        kz = np.pi * d_h / n
        kx = np.sqrt(epsilon_r * k0**2 - ky**2 - kz**2)
        y = kx * np.tan(kx * n / 2) - np.sqrt((epsilon_r - 1) * k0**2 - kx**2)
        if y > 0:
            d = n
            break
    b = d / d_h
    h = b / 2
    w = b * w_h
    ky = np.pi / w
    kz = np.pi / b
    kx = np.sqrt(epsilon_r * k0**2 - ky**2 - kz**2)
    we = (
        e0
        * epsilon_r
        * w
        * 2
        * h
        * d
        / 32
        * (1 + np.sin(kx * d) / kx / d)
        * (ky**2 + kz**2)
    )
    pm = (
        -1j
        * 2
        * np.pi
        * f
        * 1e7
        * 8
        * e0
        * (epsilon_r - 1)
        / kx
        / ky
        / kz
        * np.sin(kx * d / 2)
    )
    k0 = np.sqrt((kx ** 2 + ky ** 2 + kz ** 2) / epsilon_r)
    p_rad = 10 * k0 ** 4 * np.linalg.norm(pm) ** 2
    q = 4 * np.pi * f * 1e7 * we / p_rad


app = typer.Typer()


@app.callback()
def rect(
    show_graph: bool = typer.Option(
        False,
        "--show-graph",
        "-g",
        help="""Show a graph about dimensions of a rectangular resonator""",
    )
):
    if show_graph:
        print_graph()


@app.command(name="design")
def cli_design(
    freq: float = typer.Option(
        24,
        help="Resonant frequency (GHz)",
        prompt="""1. Enter the desired resonant frequency (GHz)""",
    ),
    mode: OpMode = typer.Option(
        OpMode.TExd11,
        help=OpMode.__doc__,
        prompt=f"""2. Choose operating mode""",
    ),
    bw: float = typer.Option(
        0.05,
        help="""Desired minimum impedance bandwidth""",
        prompt="""3. Enter the minmum factional bandwith (e.g.: 0.05 for 5%)""",
    ),
    vswr: float = typer.Option(
        2.0,
        help="""Tolerable voltage standing wave ratio (VSWR)""",
        prompt="""4. Enter the VSWR for the impedance bandwidth calculations (e.g.: 2)""",
    ),
    er: float = typer.Option(
        10.4,
        help="Material dielectric constant",
        prompt="""5. Enter DR's dielectric constant""",
    ),
    wh: float = typer.Option(
        2,
        help="""Width/height ratio of the resonator (facultative)""",
        prompt="""Enter the **width**/**height** (w/h) ratio of the DR""",
    ),
    dh: float = typer.Option(
        2,
        help="""Depth/height ratio of the resonator (facultative)""",
        prompt="""Enter the **depth**/**height** (d/h) ratio of the DR""",
    ),
):
    """**Design** a rectangular resonator."""

    # Convert to numpy data
    f = np.double(freq)  # """Frequency (GHz)"""
    bandwidth = np.double(bw)
    v = np.double(vswr)
    epsilon_r = np.double(er)
    # Image effect
    w_h = np.double(wh) / 2
    d_h = np.double(dh) / 2

    # Maximum Q factor for the minimum bandwidth and VSWR
    max_q = (v - 1) / (np.sqrt(v) * bandwidth)

    k0 = 2 * np.pi * f * 1e7 / c


@app.command(name="analyze")
def cli_analyze():
    """**Analyze** a rectangular resonator."""
