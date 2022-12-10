import typer
from enum import StrEnum


class OpMode(StrEnum):
    TExd11 = "TExd11"
    TEy1d1 = "TEy1d1"
    TEz11d = "TEz11d"


app = typer.Typer()


@app.command(no_args_is_help=True)
def design(
    freq: float = typer.Option(..., help="Resonant frequency (GHz)"),
    op_mode: OpMode = typer.Option(
        ...,
        help="""
        Operation mode:
        - `TExd11`: TE(x)d11 mode
        - `TEy1d1`: TE(y)1d1 mode
        - `TEz11d`: TE(z)11d mode (isolated resonator)
        """,
    ),
):
    """**Design** a rectangular resonator."""


@app.command(no_args_is_help=True)
def analyze():
    """**Analyze** a rectangular resonator."""
