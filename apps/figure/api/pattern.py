# spell-checker:words lpwl

import logging

import matplotlib.pyplot as plt
import numpy as np
import numpy.typing as npt
from matplotlib.projections import PolarAxes
from numpy import abs, cos, pi, sin, sqrt


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
    lpwl: float,
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

        # ax.plot(theta, r, clip_on=False)
        ax.plot(theta, r_p, "b-", clip_on=False)
        ax.plot(theta, r_n, "r-", clip_on=False)

    ax.set_theta_zero_location("N")
    ax.set_theta_direction("clockwise")

    return fig


if __name__ == "__main__":
    logging.getLogger("matplotlib.font_manager").setLevel(logging.CRITICAL)

    plt.style.use(["default", "seaborn-v0_8-paper", "./publication.mplstyle"])

    theta = pi / 4
    phi = pi / 2

    t = np.linspace(0, 2 * pi, 361, endpoint=True)
    f = pi / 2

    lpwl = 0.5

    res = pattern(lpwl, theta, phi, t, f)

    fig = plot_polar(res)
