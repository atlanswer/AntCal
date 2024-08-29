# spell-checker:words lpwl, arange, dtype, xyval, yzval, xzval

import numpy as np
import numpy.typing as npt
from matplotlib import pyplot as plt
from matplotlib.axes import Axes
from matplotlib.projections import PolarAxes
from numpy import abs, cos, pi, sin, sqrt


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
    theta: np.float64,
    phi: np.float64,
    t: npt.NDArray[np.float64] | np.float64,
    f: npt.NDArray[np.float64] | np.float64,
) -> npt.NDArray[np.float64]:
    return (
        sin(theta) * cos(phi) * sin(t) * cos(f)
        + sin(theta) * sin(phi) * sin(t) * sin(f)
        + cos(theta) * cos(t)
    )  # pyright: ignore


def EE(
    length: np.float64,
    theta: np.float64,
    phi: np.float64,
    t: npt.NDArray[np.float64] | np.float64,
    f: npt.NDArray[np.float64] | np.float64,
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

    res = EE(lpwl, theta, phi, np.float64(pi / 2), f)

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def yzval1(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    t = np.linspace(0, pi, 181, endpoint=True)

    res = EE(lpwl, theta, phi, t, np.float64(pi / 2))

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def yzval2(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    t = np.linspace(0, pi, 181, endpoint=True)

    res = EE(lpwl, theta, phi, t, np.float64(pi / 2 * 3))

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def zxval1(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    t = np.linspace(0, pi, 181, endpoint=True)

    res = EE(lpwl, theta, phi, t, np.float64(0))

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


def zxval2(
    lpwl: np.float64,
    theta: np.float64,
    phi: np.float64,
) -> npt.NDArray[np.float64]:
    t = np.linspace(0, pi, 181, endpoint=True)

    res = EE(lpwl, theta, phi, t, np.float64(pi))

    return np.where(np.isclose(res, 0, atol=1e15), res, 0)


if __name__ == "__main__":
    xi = np.linspace(0, pi, 181, endpoint=True, dtype=np.float64)

    f = fun(np.float64(0.5), xi)

    x = np.linspace(0, 2 * pi, 361, endpoint=True, dtype=np.float64)
    print(x.shape)

    y1 = yzval1(np.float64(0.5), np.float64(0), np.float64(0))
    y2 = yzval2(np.float64(0.5), np.float64(0), np.float64(0))
    
    y = np.hstack((y1, y2))

    print(y.shape)

    # fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    # assert isinstance(ax, PolarAxes)
    fig, ax = plt.subplots()
    assert isinstance(ax, Axes)

    ax.plot(y)

    fig.show()
