import asyncio
from loguru import logger
from random import random
import numpy as np


async def solve(workers: asyncio.Queue[int], input: int) -> int:
    worker = await workers.get()
    logger.info(f"Task start, {input=} assigned to {worker=}.")
    progress = 0

    while progress < 1:
        work = random()
        await asyncio.sleep(work)
        progress += work
        logger.info(f"{progress=:.2f}")

    logger.info(f"Task finished, final {progress=:.2f}, {worker=} queued.")
    await workers.put(worker)
    return input * 2


async def orchestrator(n_workers: int, inputs: list[int]):
    workers = asyncio.Queue()
    for i in range(1, n_workers + 1):
        await workers.put(i)
    logger.info("Worker queue created.")

    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(solve(workers, i)) for i in inputs]

    results = np.vstack([task.result() for task in tasks])

    logger.info(f"All tasks finished, {results=}, {results.shape=}")


def main():
    inputs = [i for i in range(100, 105)]
    asyncio.run(orchestrator(3, inputs), debug=True)


if __name__ == "__main__":
    main()
