# %% Import
from pyaedt.hfss import Hfss

# %% Class
class HFSS:
    """Represents a HFSS design"""
    def __init__(self) -> None:
        pass

    def __del__(self) -> None:
        pass

    @property
    def name(self) -> str:
        """Return HFSS design name"""
        pass

    @property
    def setup_name(self) -> str:
        """Return current setup name"""
        pass

    @property
    def variables(self):
        pass

    @variables.setter
    def variables(self, variables):
        pass

    @property
    def hfss(self) -> Hfss:
        """Return HFSS handle"""
        pass

    def build_model(self) -> None:
        """Build HFSS design model"""
        pass

    def _init_hfss(self, non_graphical: bool, initial_name: str, solution_type) -> Hfss:
        """Initialize HFSS"""
        