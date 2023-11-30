"""Utilities.

"""

from concurrent.futures import ThreadPoolExecutor
from functools import wraps
from queue import Queue
from typing import Any, Callable

import numpy as np
import numpy.typing as npt
from pyaedt.hfss import Hfss


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


# %%
def submit_tasks(
    aedt_queue: Queue[Hfss],
    variable_list: npt.NDArray[np.float32],
    task: Callable[
        [Queue[Hfss], npt.NDArray[np.float32]], npt.NDArray[np.float32]
    ],
) -> npt.NDArray[np.float32]:
    """Distribute simulation tasks to multiple AEDT sessions.

    :return: Results
    """
    n_available_desktop = aedt_queue.qsize()

    def param_list(
        aedt_queue: Queue[Hfss], variable_list: npt.NDArray[np.float32]
    ):
        for variables in variable_list:
            yield (aedt_queue, variables)

    with ThreadPoolExecutor(n_available_desktop) as executor:
        result = list(executor.map(task, param_list(aedt_queue, variable_list)))

    return np.array(result)
