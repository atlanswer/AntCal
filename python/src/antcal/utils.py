"""Utilities.
"""

import asyncio
from functools import wraps
from typing import Any, Callable, Coroutine

import numpy as np
import numpy.typing as npt
from loguru import logger
from pyaedt.hfss import Hfss

from antcal.pyaedt.hfss import new_hfss_session

TaskFn = Callable[
    [asyncio.Queue[Hfss], npt.NDArray[np.float32]],
    Coroutine[None, None, np.float32],
]
"""Task function signature"""


# %%
async def submit_tasks(
    task_fn: TaskFn,
    vs: npt.NDArray[np.float32],
    n_workers: int = 3,
    aedt_queue: asyncio.Queue[Hfss] | None = None,
) -> npt.NDArray[np.float32]:
    """Distribute simulation tasks to multiple AEDT sessions.

    :param task_fn: Task to run.
    :param vs: Input matrix, each row is one sample.
    :param n_workers: Number of AEDT to create, ignored if `aedt_queue` is provided.
    :param aedt_queue: AEDT worker queue, for long running simulation tasks.
    :return: Results.
    """

    if not aedt_queue:
        logger.debug("aedt_queue not provided, using self-hosted AEDT workers.")
        aedt_queue = asyncio.Queue()
        for _ in range(n_workers):
            await aedt_queue.put(new_hfss_session())
    else:
        logger.debug("Using provided aedt_queue.")

    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(task_fn(aedt_queue, v)) for v in vs]

    logger.debug("Simulation task queue completed.")
    results = np.vstack([task.result() for task in tasks])

    return results


# %%
def add_to_class(cls: type) -> Callable[..., Callable[..., Any]]:
    """A decorator that add the decorated function
    to a class as its attribute.

    In development, this decorator could be used to
    dynamically overwrite attributes in a class for
    convenience.

    The implementation came from [Michael Garod](https://mgarod.medium.com/dynamically-add-a-method-to-a-class-in-python-c49204b85bd6).

    :param cls: The class to be added to.

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
