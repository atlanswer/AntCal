import typer

app = typer.Typer()


@app.command()
def design():
    """**Design** a cylindrical resonator."""


@app.command()
def analyze():
    """**Analyze** a cylindrical resonator."""
