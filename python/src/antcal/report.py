"""Generating report."""

# %% Import
from typing import cast

import numpy as np
import numpy.typing as npt
from pyaedt.generic.constants import SOLUTIONS
from pyaedt.modules.AdvancedPostProcessing import PostProcessor
from pyaedt.modules.solutions import SolutionData


# %% Functions
def get_s_params(
    post: PostProcessor, row: int, col: int, setup_name: str, sweep_name: str
) -> npt.NDArray[np.float64]:
    """Fetch S parameters as an array.

    :param pyaedt.modules.AdvancedPostProcessing.PostProcessor post: Advanced post processor
    :param int row: Which row of the S matrix
    :param int col: Which column of the S matrix
    :raises AssertionError: Check if the result id real
    :return np.ndarray: S parameters in dB
    """

    match post.post_solution_type:
        case SOLUTIONS.Hfss.DrivenModal:
            category = "Modal Solution Data"
        case SOLUTIONS.Hfss.DrivenTerminal:
            category = "Terminal Solution Data"
        case _:  # pyright: ignore
            category = "Modal Solution Data"

    s = cast(
        SolutionData,
        post.get_solution_data(
            f"dB(S({row},{col}))",
            f"{setup_name} : {sweep_name}",
            "Sweep",
            report_category=category,
        ),
    )
    assert s.is_real_only(), "S parameters is not real only."
    return np.array(s.data_real())
