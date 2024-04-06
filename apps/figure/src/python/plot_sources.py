# spell-checker:words azim, mplot3d, xlim, ylim, zlim, verts3d, zdir, cmap

import io
import sys
from typing import Any, Literal, TypedDict, cast

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.backend_bases import RendererBase
from matplotlib.patches import Arc, FancyArrow, FancyArrowPatch
from mpl_toolkits.mplot3d import proj3d
from mpl_toolkits.mplot3d.art3d import (
    pathpatch_2d_to_3d,  # pyright: ignore[reportUnknownVariableType]
)
from mpl_toolkits.mplot3d.axes3d import Axes3D

if sys.platform != "emscripten":
    import initialization  # noqa: F401 # type:ignore

set1 = plt.get_cmap("Set1")


class Source(TypedDict):
    type: Literal["E", "M"]
    direction: Literal["X", "Y", "Z"]
    amplitude: float
    phase: float


class Arrow3D(FancyArrowPatch):
    def __init__(
        self,
        xs: tuple[float, float],
        ys: tuple[float, float],
        zs: tuple[float, float],
        *args: list[Any],
        **kwargs: dict[str, Any],
    ):
        super().__init__((0, 0), (0, 0), *args, **kwargs)
        self._verts3d = xs, ys, zs

    def draw(self, renderer: RendererBase):
        xs3d, ys3d, zs3d = self._verts3d
        xs, ys, _ = proj3d.proj_transform(
            xs3d, ys3d, zs3d, cast(Axes3D, self.axes).M
        )
        self.set_positions((xs[0], ys[0]), (xs[1], ys[1]))
        super().draw(renderer)


def plot_sources(sources: list[Source]):
    if sys.platform != "emscripten":
        ...
    else:
        sources = cast(list[Source], sources.to_py())  # type: ignore

    scale_factor = 100

    fig, ax = plt.subplots(
        figsize=(2, 2),
        subplot_kw={"projection": "3d"},
    )
    assert isinstance(ax, Axes3D)

    ax.set_proj_type("ortho")
    ax.set_box_aspect((1, 1, 1))
    ax.view_init(elev=45, azim=45)
    ax.set_axis_off()

    max_amplitude = 0

    for s in sources:
        match s["direction"]:
            case "X":
                theta = np.pi / 2
                phi = 0
            case "Y":
                theta = np.pi / 2
                phi = np.pi / 2
            case "Z":
                theta = 0
                phi = 0
        amplitude = s["amplitude"] * scale_factor
        w = amplitude * np.cos(theta)
        w2 = amplitude * np.sin(theta)
        u = w2 * np.cos(phi)
        v = w2 * np.sin(phi)
        ax.quiver(
            0,
            0,
            0,
            u,
            v,
            w,
            pivot="middle",
            color=set1(0) if s["type"] == "E" else set1(1),
            arrow_length_ratio=0.2,
        )
        ax.text(
            u / 2 * 1.2,
            v / 2 * 1.2,
            w / 2 * 1.2,
            "J" if s["type"] == "E" else "M",
        )
        max_amplitude = max(max_amplitude, amplitude)

    ax.plot([0, max_amplitude], [0, 0], [0, 0], "k", linewidth=0.5)
    ax.plot([0, 0], [0, max_amplitude], [0, 0], "k", linewidth=0.5)
    ax.plot([0, 0], [0, 0], [0, max_amplitude], "k", linewidth=0.5)
    ax.text(max_amplitude, 0, max_amplitude * 0.1, "$x$", "x", fontsize="small")
    ax.text(
        0,
        max_amplitude * 0.8,
        max_amplitude * 0.05,
        "$y$",
        "y",
        fontsize="small",
    )
    ax.text(
        0, max_amplitude * 0.05, max_amplitude * 0.85, "$z$", fontsize="small"
    )
    ax.set_xlim(-max_amplitude * 0.4, max_amplitude * 0.4)
    ax.set_ylim(-max_amplitude * 0.4, max_amplitude * 0.4)
    ax.set_zlim(-max_amplitude * 0.4, max_amplitude * 0.4)
    ax.set_axisbelow(True)

    arrow_phi = FancyArrow(
        max_amplitude * 0.4,
        max_amplitude * 0.65,
        -max_amplitude * 0.05,
        0,
        length_includes_head=True,
        width=max_amplitude * 0.025,
        head_length=max_amplitude * 0.05,
        color="k",
    )
    pathpatch_2d_to_3d(arrow_phi, zdir="z")
    ax.add_artist(arrow_phi)
    tail_phi = Arc(
        (max_amplitude * 0.4, max_amplitude * 0.4),
        max_amplitude * 0.5,
        max_amplitude * 0.5,
        theta1=0,
        theta2=90,
        linewidth=0.5,
    )
    pathpatch_2d_to_3d(tail_phi, zdir="z")
    ax.add_artist(tail_phi)
    ax.text(
        max_amplitude * 0.7,
        max_amplitude * 0.65,
        0,
        "$ϕ$",
        fontsize="small",
    )
    arrow_theta = FancyArrow(
        max_amplitude * 0.85,
        max_amplitude * 0.9,
        0,
        -max_amplitude * 0.05,
        length_includes_head=True,
        width=max_amplitude * 0.025,
        head_length=max_amplitude * 0.05,
        color="k",
    )
    pathpatch_2d_to_3d(arrow_theta, zdir="x")
    ax.add_artist(arrow_theta)
    tail_theta = Arc(
        (max_amplitude * 0.6, max_amplitude * 0.85),
        max_amplitude * 0.5,
        max_amplitude * 0.5,
        theta1=0,
        theta2=90,
        linewidth=0.5,
    )
    pathpatch_2d_to_3d(tail_theta, zdir="x")
    ax.add_artist(tail_theta)
    ax.text(
        0,
        max_amplitude * 0.8,
        max_amplitude * 1.05,
        "$θ$",
        fontsize="small",
    )

    if sys.platform != "emscripten":
        ...
    else:
        f = io.BytesIO()
        fig.savefig(f, format="svg", bbox_inches="tight", pad_inches=0)
        plt.close(fig)
        f.seek(0)

        return f.getvalue().decode()


if sys.platform != "emscripten":
    plot_sources([Source(type="E", direction="X", amplitude=1, phase=0)])

plot_sources  # pyright: ignore[reportUnusedExpression] # noqa: B018
