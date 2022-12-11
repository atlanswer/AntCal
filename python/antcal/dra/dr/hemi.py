import typer

app = typer.Typer()


@app.command()
def design():
    """**Design** a hemispherical resonator."""


@app.command()
def analyze():
    """**Analyze** a hemispherical resonator."""
