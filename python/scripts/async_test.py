import asyncio
import logging
from random import random

import numpy as np
from rich.logging import RichHandler

logging.basicConfig(
    level="NOTSET",
    format="%(message)s",
    datefmt="[%m/%d %H:%M:%S]",
    handlers=[RichHandler(markup=True)],
)
log = logging.getLogger("rich")


async def solve(workers: asyncio.Queue[int], input: int) -> int:
    worker = await workers.get()
    log.info(f"Task start, {input=} assigned to {worker=}.")
    progress = 0

    while progress < 1:
        work = random()
        await asyncio.sleep(work)
        progress += work
        log.info(f"{progress=:.2f}")

    log.info(f"Task finished, final {progress=:.2f}, {worker=} queued.")
    await workers.put(worker)
    return input * 2


async def orchestrator(n_workers: int, inputs: list[int]):
    workers: asyncio.Queue[int] = asyncio.Queue()
    for i in range(1, n_workers + 1):
        await workers.put(i)
    log.info("Worker queue created.")

    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(solve(workers, i)) for i in inputs]

    results = np.vstack([task.result() for task in tasks])

    log.info(f"All tasks finished, {results=}, {results.shape=}")


def main():
    inputs = [i for i in range(100, 105)]
    asyncio.run(orchestrator(3, inputs), debug=True)


if __name__ == "__main__":
    main()
