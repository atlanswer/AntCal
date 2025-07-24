import io
import logging
from pathlib import Path
from typing import override

import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator
import numpy as np
import numpy.typing as npt
from matplotlib.figure import Figure
from matplotlib.projections import PolarAxes
from numpy import abs, cos, pi, sin, sqrt

from .context import FigureResponse, PlaneConf, Sources

plt.style.use(
    [
        "default",
        Path(__file__).parent / "./publication.mplstyle",
    ]
)

set1 = plt.get_cmap("Set1")


def pol_to_car(
    src_theta: float,
    src_phi: float,
    axis_theta: npt.NDArray[np.float64] | float,
    axis_phi: npt.NDArray[np.float64] | float,
) -> npt.NDArray[np.float64]:
    return (
        sin(src_theta) * cos(src_phi) * sin(axis_theta) * cos(axis_phi)
        + sin(src_theta) * sin(src_phi) * sin(axis_theta) * sin(axis_phi)
        + cos(src_theta) * cos(axis_theta)
    )


def pattern(
    length: float,
    src_theta: float,
    src_phi: float,
    axis_theta: npt.NDArray[np.float64] | float,
    axis_phi: npt.NDArray[np.float64] | float,
) -> npt.NDArray[np.float64]:
    # theta = np.deg2rad(theta)
    # phi = np.deg2rad(phi)
    # t = np.deg2rad(t)
    # f = np.deg2rad(f)

    temp = pol_to_car(src_theta, src_phi, axis_theta, axis_phi)

    # numerator = abs(cos(pi * length * temp) - cos(pi * length))
    numerator = cos(pi * length * temp) - cos(pi * length)
    denominator = sqrt(np.clip(1 - temp**2, 1e-15, None))

    res = numerator / denominator
    res = np.where(np.isclose(res, 0, atol=1e15), res, 0)

    return res


def plot_polar(
    r: npt.NDArray[np.float64]
    | tuple[npt.NDArray[np.float64], npt.NDArray[np.float64]],
):
    fig, ax = plt.subplots(
        figsize=(3.5, 3.5), subplot_kw={"projection": "polar"}
    )
    assert isinstance(ax, PolarAxes)

    length = r[0].size if isinstance(r, tuple) else r.size
    theta = np.linspace(0, pi * 2, length, endpoint=True)

    if isinstance(r, tuple):
        ax.plot(theta, r[0], clip_on=False)
        ax.plot(theta, r[1], clip_on=False)
    else:
        r_p = np.zeros_like(r)
        r_p[r >= 0] = r[r >= 0]
        r_n = np.zeros_like(r)
        r_n[r < 0] = r[r < 0]

        # ax.plot(theta, r, clip_on=False, linewidth=2)
        ax.plot(theta, r_p, clip_on=False, linewidth=2)
        ax.plot(theta, -r_n, clip_on=False, linewidth=2)

    ax.yaxis.set_major_locator(MaxNLocator(nbins=4))
    ax.set_theta_zero_location("N")
    ax.set_theta_direction("clockwise")

    return fig


def plot_plane(config: PlaneConf) -> FigureResponse:
    plane = config.plane
    source = config.sources[0]
    axis_step = np.deg2rad(config.axisStepDeg)

    length = source["length"]
    src_theta = source["orientation"]["theta"]
    src_phi = source["orientation"]["phi"]

    x = np.linspace(0, 2 * pi, int(2 * pi / axis_step) + 1, dtype=np.float64)

    match plane:
        case "YZ":
            axis_theta = x
            axis_phi = pi / 2
        case "XZ":
            axis_theta = x
            axis_phi = 0
        case "XY":
            axis_theta = pi / 2
            axis_phi = x

    r = pattern(length, src_theta * pi, src_phi * pi, axis_theta, axis_phi)

    fig = plot_polar(r)

    return FigureResponse(maxD=0, hpbw=0, figData=fig_to_str(fig))


def fig_to_str(fig: Figure) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="svg")
    plt.close(fig)
    buf.seek(0)

    return buf.getvalue().decode()


if __name__ == "__main__":
    logging.getLogger("matplotlib.font_manager").setLevel(logging.CRITICAL)

    theta = pi / 4
    phi = pi / 2

    t = np.linspace(0, 2 * pi, 361, endpoint=True)
    f = pi / 2

    lpwl = 0.5

    res = pattern(lpwl, theta, phi, t, f)

    fig = plot_polar(res)
