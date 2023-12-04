"""Utilities.
"""

import sys
from concurrent.futures import ProcessPoolExecutor
from functools import wraps
from time import sleep
from typing import Any, Callable

import numpy as np
import numpy.typing as npt
from loguru import logger
from pyaedt.hfss import Hfss

from antcal.pyaedt.hfss import new_hfss_session


# %%
def add_to_class(cls: type) -> Callable[..., Callable[..., Any]]:
    """A decorator that add the decorated function
    to a class as its attribute.

    In development, this decorator could be used to
    dynamically overwrite attributes in a class for
    convenience.

    The implementation came from [Michael Garod](https://mgarod.medium.com/dynamically-add-a-method-to-a-class-in-python-c49204b85bd6).

    :param type cls: The class to be added to.

    :Examples:
    ```py
    class A:
        def __init__(self) -> None:
            ...

    @add_to_class(A)
    def print_hi(self: A) -> None:
        print("Hi")

    >>> a = A()
    >>> a.print_hi()
    Hi
    ```
    """

    def decorator(method: Callable[..., Any]) -> Callable[..., Any]:
        """This decorator perform the attachment,
        then just return the original function.
        """

        @wraps(method)
        def add_this(*args, **kwargs):  # pyright: ignore[reportMissingParameterType, reportUnknownParameterType]
            return method(*args, **kwargs)

        setattr(cls, method.__name__, add_this)
        return method

    return decorator


def aedt_process_initializer() -> None:
    """Assign an instance of {py:class}`pyaedt.hfss.Hfss`
    to the global variable `hfss`.

    This function should be run in a separate process.
    """

    main_module = sys.modules["__main__"]
    if "hfss" in dir(main_module):
        process_id = main_module.hfss.odesktop.GetProcessID()
        logger.error(f"HFSS ({process_id}) already exists.")
        assert isinstance(main_module.hfss, Hfss)
        return
    main_module.hfss = new_hfss_session()  # pyright: ignore

    process_id = main_module.hfss.odesktop.GetProcessID()
    logger.debug(
        f"HFSS launched | process id: {process_id} | object address: {id(main_module.hfss)} | oDesktop address: {id(main_module.hfss.odesktop)}"
    )

    sleep(3)


# %%
def submit_tasks(
    task: Callable[[npt.NDArray[np.float32]], np.float32],
    vs: npt.NDArray[np.float32],
    max_workers: int = 3,
) -> npt.NDArray[np.float32]:
    """Distribute simulation tasks to multiple AEDT sessions.

    :return: Results
    """

    with ProcessPoolExecutor(
        max_workers, initializer=aedt_process_initializer
    ) as executor:
        result = list(executor.map(task, vs, chunksize=1))

    return np.array(result)
