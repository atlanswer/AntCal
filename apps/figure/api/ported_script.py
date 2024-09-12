# spell-checker:words lpwl, arange, dtype, xyval, yzval, xzval

import logging
from typing import Literal, TypedDict

import matplotlib as mpl
import numpy as np
import numpy.typing as npt
from matplotlib import pyplot as plt
from matplotlib.projections import PolarAxes
from matplotlib.ticker import MaxNLocator
from numpy import abs, cos, pi, sin, sqrt
from pydantic import BaseModel

logging.getLogger("matplotlib.font_manager").setLevel(logging.WARNING)

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

set1 = plt.get_cmap("Set1")


class FigureWithDetailedResponse(BaseModel):
    maxD: int
    hpbw: int
    figData: str


class Source(TypedDict):
    type: Literal["E"]
    lpwl: float
    theta: float
    phi: float
    phase: float


class ViewPlaneConfig(TypedDict):
    isDb: bool
    isGainTotal: bool
    source: list[Source]
    theta: float
    phi: float


def fun(
    lpwl: np.float64, xi: npt.NDArray[np.float64]
) -> npt.NDArray[np.float64]:
    sin_xi = sin(xi)
    idx = np.isclose(sin_xi, 0, atol=1e-15)

    nominator1 = pi * lpwl * sin(pi * lpwl * cos(xi)) * sin_xi
    nominator2 = cos(pi * lpwl * cos(xi)) - cos(pi * lpwl)

    nominator = np.where(idx, nominator1, nominator2)

    denominator = np.where(idx, cos(xi), sin_xi)

    return abs(nominator / denominator)


def max(lpwl: np.float64, xi: npt.NDArray[np.float64]):
    return np.max(fun(lpwl, xi))


def pol_to_car(
    theta: npt.NDArray[np.float64], phi: npt.NDArray[np.float64]
) -> npt.NDArray[np.float64]:
    return np.vstack((sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta)))


def pol_to_car2(
    theta: np.float64 | float,
    phi: np.float64 | float,
    t: npt.NDArray[np.float64] | float,
    f: npt.NDArray[np.float64] | float,
) -> npt.NDArray[np.float64]:
    return (
        sin(theta) * cos(phi) * sin(t) * cos(f)
        + sin(theta) * sin(phi) * sin(t) * sin(f)
        + cos(theta) * cos(t)
    )  # pyright: ignore


def EE(
    length: np.float64 | float,
    theta: np.float64 | float,
    phi: np.float64 | float,
    t: npt.NDArray[np.float64] | float,
    f: npt.NDArray[np.float64] | float,
) -> npt.NDArray[np.float64]:
    temp = pol_to_car2(theta, phi, t, f)
    return abs(cos(pi * length * temp) - cos(pi * length)) / sqrt(1 - temp**2)


def sf() -> npt.NDArray[np.float64]:
    ang = np.linspace(0, 2 * pi, 361, endpoint=True, dtype=np.float64)
    return np.sin(ang)


def cf() -> npt.NDArray[np.float64]:
    ang = np.linspace(0, 2 * pi, 361, endpoint=True, dtype=np.float64)
    return np.cos(ang)


def xyval(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    f = np.linspace(0, 2 * pi, 361, endpoint=True)

    res = EE(lpwl, theta, phi, pi / 2, f)

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def yzval1(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    t = np.linspace(0, pi, 181, endpoint=True)

    res = EE(lpwl, theta, phi, t, pi / 2)

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def yzval2(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    t = np.linspace(0, pi, 181, endpoint=True)

    res = EE(lpwl, theta, phi, t, pi / 2 * 3)

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def zxval1(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    t = np.linspace(0, pi, 181, endpoint=True)

    res = EE(lpwl, theta, phi, t, 0)

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def zxval2(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    t = np.linspace(0, pi, 181, endpoint=True)

    res = EE(lpwl, theta, phi, t, pi)

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def plot_view_plane(config: ViewPlaneConfig):
    # db_min, db_max = -30, 10
    # lin_min = 0
    n_samples = 361

    source = config["source"][0]

    x = np.linspace(0, 2 * pi, n_samples, endpoint=True, dtype=np.float64)

    y = EE(
        source["lpwl"],
        source["theta"] / 180 * pi,
        source["phi"] / 180 * pi,
        x,
        config["phi"],
    )
    y = np.where(np.isclose(y, 0, atol=1e15), y, 0)

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)

    ax.plot(np.linspace(0, 2 * pi, len(y)), y, clip_on=False)

    r_locator = MaxNLocator(nbins=4)
    ax.yaxis.set_major_locator(r_locator)
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)

    return fig


if __name__ == "__main__":
    fig = plot_view_plane(
        ViewPlaneConfig(
            isDb=False,
            isGainTotal=False,
            theta=0,
            phi=0,
            source=[Source(type="E", lpwl=0.5, theta=45, phi=90, phase=0)],
        )
    )
