# spell-checker:words emscripten, xtick, ytick

import logging
import sys

import matplotlib as mpl
import matplotlib.pyplot as plt

logging.getLogger("matplotlib.font_manager").setLevel(logging.ERROR)

mpl.rcParams["backend"] = "SVG"
if sys.platform == "emscripten":
    plt.style.use(["default", "seaborn-paper"])
else:
    plt.style.use(["default", "seaborn-v0_8-paper"])
mpl.rcParams["svg.fonttype"] = "none"
mpl.rcParams["font.family"] = "Arial"
mpl.rcParams["font.weight"] = "bold"
mpl.rcParams["axes.labelweight"] = "bold"
mpl.rcParams["axes.grid"] = True
mpl.rcParams["axes.axisbelow"] = True
mpl.rcParams["grid.alpha"] = 0.5
mpl.rcParams["grid.linewidth"] = 0.5
mpl.rcParams["xtick.direction"] = "in"
mpl.rcParams["xtick.labelsize"] = 10
mpl.rcParams["ytick.direction"] = "in"
mpl.rcParams["ytick.labelsize"] = 10
mpl.rcParams["lines.linewidth"] = 2
mpl.rcParams["mathtext.fontset"] = "stix"

# sf = 3.5 / 3.5
# """Scale factor"""

# mpl.rcParams["figure.figsize"] = 3.5 * sf, 3.5 * sf
mpl.rcParams["figure.figsize"] = 3.5, 3.5
