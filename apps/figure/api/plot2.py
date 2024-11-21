# spell-checker:words xtick ytick mplot verts3d stix cmap azim
# spell-checker:words xlim ylim zlim zdir hpbw lpwl
# spell-checker:words fonttype labelweight axisbelow linewidth
# spell-checker:words labelsize mathtext fontset figsize

import logging
from typing import Any, Literal, TypedDict, cast

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import numpy.typing as npt
from matplotlib.axes import Axes
from matplotlib.projections import PolarAxes
from matplotlib.ticker import MaxNLocator
from numpy import abs, cos, pi, sin, sqrt
from pydantic import BaseModel

logging.getLogger("matplotlib.font_manager").setLevel(logging.CRITICAL)

mpl.rcParams["backend"] = "SVG"
plt.style.use(["default", "seaborn-v0_8-paper"])
mpl.rcParams["svg.fonttype"] = "none"
mpl.rcParams["font.family"] = "Arial"
mpl.rcParams["font.weight"] = "bold"
mpl.rcParams["axes.labelweight"] = "bold"
mpl.rcParams["axes.grid"] = True
mpl.rcParams["axes.axisbelow"] = True
mpl.rcParams["grid.alpha"] = 0.5
mpl.rcParams["grid.linewidth"] = 0.5
mpl.rcParams["xtick.direction"] = "in"
mpl.rcParams["xtick.labelsize"] = 10
mpl.rcParams["ytick.direction"] = "in"
mpl.rcParams["ytick.labelsize"] = 10
mpl.rcParams["lines.linewidth"] = 2
mpl.rcParams["mathtext.fontset"] = "stix"
mpl.rcParams["figure.figsize"] = 3.5, 3.5


class Source(TypedDict):
    type: Literal["E", "M"]
    theta: float
    phi: float
    amplitude: float
    phase: float


class ViewPlaneConfig(TypedDict):
    db: bool
    total: bool
    sources: list[Source]
    theta: float
    phi: float


class FigureWithInfoResponse(BaseModel):
    figData: str
    maxD: float
    hpbw: float


def pol_to_car(
    theta: float,
    phi: float,
    t: npt.NDArray[np.float64] | float,
    f: npt.NDArray[np.float64] | float,
) -> npt.NDArray[np.float64]:
    return (
        sin(theta) * cos(phi) * sin(t) * cos(f)
        + sin(theta) * sin(phi) * sin(t) * sin(f)
        + cos(theta) * cos(t)
    )


def pattern(
    lpwl: float,
    theta: float,
    phi: float,
    t: npt.NDArray[np.float64] | float,
    f: npt.NDArray[np.float64] | float,
) -> npt.NDArray[np.float64]:
    theta = np.deg2rad(theta)
    phi = np.deg2rad(phi)
    t = np.deg2rad(t)
    f = np.deg2rad(f)

    temp = pol_to_car(theta, phi, t, f)

    numerator = abs(cos(pi * lpwl * temp) - cos(pi * lpwl))
    denominator = sqrt(np.clip(1 - temp**2, 1e-15, None))

    res = numerator / denominator
    res = np.where(np.isclose(res, 0, atol=1e15), res, 0)

    return res


def plot_polar(
    r: npt.NDArray[np.float64]
    | tuple[npt.NDArray[np.float64], npt.NDArray[np.float64]],
):
    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)
    ax.set_theta_zero_location("N")
    ax.set_theta_direction("clockwise")

    length = r[0].size if isinstance(r, tuple) else r.size

    theta = np.linspace(0, pi * 2, length, endpoint=True)

    if isinstance(r, tuple):
        ax.plot(theta, r[0], clip_on=False)
        ax.plot(theta, r[1], clip_on=False)
    else:
        ax.plot(theta, r, clip_on=False)

    return fig


if __name__ == "__main__":
    theta = 90
    phi = 0

    t = np.linspace(0, 360, 361, endpoint=True)
    f = 90

    lpwl = 0.5

    res = pattern(lpwl, theta, phi, f, t)

    fig = plot_polar(res)
