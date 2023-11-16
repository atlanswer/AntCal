# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

from datetime import date
from typing import Any

# from sphinx import pygments_styles
from antcal import __version__

project = "AntCal"
copyright = f"{date.today().year}, Atlanswer"
author = "Atlanswer"
version = __version__
release = __version__

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "myst_parser",
    "autodoc2",
    "sphinx_rtd_theme",
    "sphinx.ext.intersphinx",
    "sphinx.ext.viewcode",
    "sphinx_copybutton",
]

intersphinx_mapping = {
    "python": ("https://docs.python.org/3/", None),
    "sphinx": ("https://www.sphinx-doc.org/en/master", None),
    "numpy": ("https://numpy.org/doc/stable/", None),
    "pandas": ("https://pandas.pydata.org/docs/", None),
    "pyaedt": (
        "https://aedt.docs.pyansys.com/dev/",
        "https://raw.githubusercontent.com/pyansys/pyaedt/gh-pages/release/0.6/objects.inv",
    ),
}

templates_path = ["_templates"]
exclude_patterns = []


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_static_path = ["_static"]
html_favicon = "_static/favicon.ico"
html_theme_options: dict[str, Any] = {
    "collapse_navigation": False,
    "navigation_depth": 4,
}
pygments_styles = "one-dark"
# pygments_dark_styles = "github-dark"

# -- myst --------------------------------------------------------------------
myst_enable_extensions = ["colon_fence", "dollarmath", "fieldlist"]
myst_heading_anchors = 2
myst_dmath_allow_space = False
myst_dmath_allow_digits = False

# -- autodoc2 ----------------------------------------------------------------
autodoc2_packages = ["../src/antcal"]
autodoc2_render_plugin = "myst"
# autodoc2_docstring_parser_regexes = [(r".*", "myst"),]
