# from typing import Optional
# from types import ModuleType

# import typer

# from . import cyl, hemi, rect, ring

# from ... import __version__

# epilog = """
#    Made with ❤ . Cli app supported by `Typer`.
#    """


# dra_types: dict[str, tuple[ModuleType, str]] = {
#    "rect": (rect, "rectangular"),
#    "cyl": (cyl, "cylindrical"),
#    "hemi": (hemi, "hemispherical"),
#    "ring": (ring, "ring"),
# }


# def add_command(dra_type: str):
#    (module, name) = dra_types[dra_type]
#    app.add_typer(
#        module.app,
#        help=f"""**Deign**/**analyze** a **{name}** resonator.""",
#        no_args_is_help=True,
#        invoke_without_command=True,
#        epilog=epilog,
#    )


# def version_callback(value: bool):
#    if value:
#        print(f"version: {__version__}")
#        raise typer.Exit()


# app = typer.Typer(epilog=epilog, rich_markup_mode="markdown", no_args_is_help=True)

# list(map(add_command, dra_types))


# @app.callback()
# def main(
#    version: Optional[bool] = typer.Option(
#        None,
#        "--version",
#        "-v",
#        help="Show version.",
#        callback=version_callback,
#        is_eager=True,
#    ),
# ):
#    """
#    🧮 Dielectric Resonator (DR) Calculator

#    Run **cli COMMAND --help** to show command usage.
#    """
#    ...


# if __name__ == "__main__":
#    app()
