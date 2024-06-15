# spell-checker:words lpwl, arange
import numpy as np
import numpy.typing as npt
from numpy import abs, cos, pi, sin

xi = np.arange(0, pi + pi / 180, pi / 180)


def fun(lpwl: np.float32) -> npt.NDArray[np.float32]:
    idx = sin(xi) == 0

    print(sin(xi))


if __name__ == "__main__":
    fun(np.float32(0))
