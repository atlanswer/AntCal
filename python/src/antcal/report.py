"""Generating report."""

# %% Import
from typing import cast

import numpy as np
import numpy.typing as npt
from ansys.aedt.core.generic.constants import SOLUTIONS
from ansys.aedt.core.modules.advanced_post_processing import PostProcessor
from ansys.aedt.core.modules.solutions import SolutionData


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

    match post.post_solution_type:  # pyright: ignore
        case SOLUTIONS.Hfss.DrivenModal:
            category = "Modal Solution Data"
        case SOLUTIONS.Hfss.DrivenTerminal:
            category = "Terminal Solution Data"
        case _:  # pyright: ignore
            category = "Modal Solution Data"

    s = cast(
        SolutionData,
        post.get_solution_data(  # pyright: ignore
            f"dB(S({row},{col}))",
            f"{setup_name} : {sweep_name}",
            "Sweep",
            report_category=category,
        ),
    )
    assert s.is_real_only(), "S parameters is not real only."  # pyright: ignore
    return np.array(s.data_real())  # pyright: ignore
