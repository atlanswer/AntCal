import typer

app = typer.Typer()


@app.command()
def design():
    """**Design** a ring resonator."""


@app.command()
def analyze():
    """**Analyze** a ring resonator."""
