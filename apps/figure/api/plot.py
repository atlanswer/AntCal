# spell-checker:words xtick, ytick, mplot, verts3d, stix, cmap, azim
# spell-checker:words xlim, ylim, zlim, zdir, hpbw

import io
import logging
from typing import Any, Literal, TypedDict, cast

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import numpy.typing as npt
from matplotlib.axes import Axes
from matplotlib.backend_bases import RendererBase
from matplotlib.patches import Arc, FancyArrow, FancyArrowPatch
from matplotlib.projections.polar import PolarAxes
from matplotlib.ticker import MaxNLocator
from mpl_toolkits.mplot3d import proj3d
from mpl_toolkits.mplot3d.art3d import (
    pathpatch_2d_to_3d,  # pyright: ignore[reportUnknownVariableType]
)
from mpl_toolkits.mplot3d.axes3d import Axes3D
from pydantic import BaseModel

logging.getLogger("matplotlib.font_manager").setLevel(logging.WARNING)

mpl.rcParams["backend"] = "SVG"
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


set1 = plt.get_cmap("Set1")


class FigureWithDetailResponse(BaseModel):
    maxD: int
    hpbw: int
    figData: str


class Source(TypedDict):
    type: Literal["E", "M"]
    direction: Literal["X", "Y", "Z"]
    amplitude: float
    phase: float


CutPlane = Literal["XZ", "YZ", "XY"]


class ViewPlaneConfig(BaseModel):
    cutPlane: CutPlane
    isDb: bool
    isGainTotal: bool
    sources: list[Source]


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

    f = io.BytesIO()
    fig.savefig(f, format="svg", bbox_inches="tight", pad_inches=0)
    plt.close(fig)
    f.seek(0)

    return f.getvalue().decode()


def plot_view_plane(config: ViewPlaneConfig) -> FigureWithDetailResponse:
    db_min, db_max = -30, 10
    lin_min = 0
    n_samples = 361

    match config.cutPlane:
        case "YZ":
            theta = np.linspace(0, np.pi * 2, n_samples)
            phi = np.pi / 2 * np.ones_like(n_samples)
        case "XZ":
            theta = np.linspace(0, np.pi * 2, n_samples)
            phi = np.zeros_like(n_samples)
        case "XY":
            phi = np.linspace(0, np.pi * 2, n_samples)
            theta = np.pi / 2 * np.ones_like(n_samples)

    theta_a = np.zeros(n_samples)
    theta_phase_a = np.zeros(n_samples)
    phi_a = np.zeros(n_samples)
    phi_phase_a = np.zeros(n_samples)

    for s in config.sources:
        amplitude = s["amplitude"]
        phase_s = cast(np.float64, np.radians(s["phase"]))
        match s["type"], s["direction"]:
            case "E", "X":
                theta_b = np.cos(theta) * np.cos(phi)
                phi_b = np.sin(phi)
            case "M", "X":
                theta_b = np.sin(phi)
                phi_b = np.cos(theta) * np.cos(phi)
            case "E", "Y":
                theta_b = np.cos(theta) * np.sin(phi)
                phi_b = np.cos(phi)
            case "M", "Y":
                theta_b = np.cos(phi)
                phi_b = np.cos(theta) * np.sin(phi)
            case "E", "Z":
                theta_b = np.sin(theta)
                phi_b = np.zeros(n_samples)
            case "M", "Z":
                theta_b = np.zeros(n_samples)
                phi_b = np.sin(theta)
            case _:
                raise ValueError("Unknown source type or direction")
        theta_b *= amplitude
        phi_b *= amplitude

        theta_phase_b = phase_s * np.ones(n_samples)
        phi_phase_b = phase_s * np.ones(n_samples)

        theta_phase_b[theta_b < 0] += np.pi
        theta_b = np.abs(theta_b)
        phi_phase_b[phi_b < 0] += np.pi
        phi_b = np.abs(phi_b)

        theta_phase_numerator = theta_a * np.sin(
            theta_phase_a
        ) + theta_b * np.sin(theta_phase_b)
        theta_phase_denominator = theta_a * np.cos(
            theta_phase_a
        ) + theta_b * np.cos(theta_phase_b)
        # print(f"theta_a: [{theta_a[0], theta_a[180]}]")
        # print(f"theta_phase_a: [{theta_phase_a[0], theta_phase_a[180]}]")
        # print(f"theta_b: [{theta_b[0], theta_b[180]}]")
        # print(f"theta_phase_b: [{theta_phase_b[0], theta_phase_b[180]}]")
        theta_a = np.sqrt(
            theta_a**2
            + theta_b**2
            + 2 * theta_a * theta_b * np.cos(theta_phase_a - theta_phase_b)
        )
        theta_phase_a = np.arctan2(
            theta_phase_numerator,
            theta_phase_denominator,
        )
        # print(f"theta_a: [{theta_a[0], theta_a[180]}]")
        # print(f"theta_phase_a: [{theta_phase_a[0], theta_phase_a[180]}]")
        # print("----------")

        phi_phase_numerator = phi_a * np.sin(phi_phase_a) + phi_b * np.sin(
            phi_phase_b
        )
        phi_phase_denominator = phi_a * np.cos(phi_phase_a) + phi_b * np.cos(
            phi_phase_b
        )
        phi_a = np.sqrt(
            phi_a**2
            + phi_b**2
            + 2 * phi_a * phi_b * np.cos(phi_phase_a - phi_phase_b)
        )
        phi_phase_a = np.arctan2(
            phi_phase_numerator,
            phi_phase_denominator,
        )

    y_total = np.sqrt(theta_a**2 + phi_a**2)
    y_total[y_total < 10 ** (db_min / 10)] = 10 ** (db_min / 10)
    y_total_db = 10 * np.log10(y_total)
    y_total_db[y_total_db < db_min] = db_min
    y_theta = np.abs(theta_a)
    y_phi = np.abs(phi_a)
    if config.isDb:
        y_theta[y_theta < 10 ** (db_min / 10)] = 10 ** (db_min / 10)
        y_theta = 10 * np.log10(y_theta)
        y_theta[y_theta < db_min] = db_min
        y_phi[y_phi < 10 ** (db_min / 10)] = 10 ** (db_min / 10)
        y_phi = 10 * np.log10(y_phi)
        y_phi[y_phi < db_min] = db_min

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)

    match config.cutPlane, config.isDb, config.isGainTotal:
        case "XY", True, True:
            ax.plot(phi, y_total_db, clip_on=False)
        case "XY", False, True:
            ax.plot(phi, y_total, clip_on=False)
        case "XY", _, False:
            ax.plot(phi, y_theta, clip_on=False)
            ax.plot(phi, y_phi, clip_on=False)
        case _, True, True:
            ax.plot(theta, y_total_db, clip_on=False)
        case _, False, True:
            ax.plot(theta, y_total, clip_on=False)
        case _:
            ax.plot(theta, y_theta, clip_on=False)
            ax.plot(theta, y_phi, clip_on=False)

    r_locator = MaxNLocator(nbins=4)
    if config.isDb:
        ax.set_rlim(db_min, db_max)
    else:
        lin_max = 0
        for s in config.sources:
            lin_max += s["amplitude"]
        ax.set_rlim(lin_min, lin_max)
    ax.yaxis.set_major_locator(r_locator)
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    # ax.tick_params(pad=0)

    y_total **= 2
    y_total_db = 10 * np.log10(y_total)
    peak = np.max(y_total_db)
    peak_idx = np.argmax(y_total_db)
    hp = np.subtract(peak, 3)

    def get_hpbw() -> int:
        hpbw = 1
        r_idx = int(peak_idx)
        while y_total_db[r_idx] >= hp:
            r_idx += 1
            if r_idx >= 360:
                r_idx = 0
            if r_idx == peak_idx:
                return 360
        l_idx = r_idx - 2
        while y_total_db[l_idx] >= hp:
            l_idx -= 1
            hpbw += 1
            if l_idx <= 0:
                l_idx = 359
        return hpbw + 1

    f = io.BytesIO()
    fig.savefig(f, format="svg")
    plt.close(fig)
    f.seek(0)

    return FigureWithDetailResponse(
        maxD=int(peak_idx),
        hpbw=get_hpbw(),
        figData=f.getvalue().decode(),
    )


def plot_blank() -> bytes:
    fig, ax = plt.subplots()
    assert isinstance(ax, Axes)
    ax.plot()

    buf = io.BytesIO()
    plt.savefig(buf, format="svg")
    plt.close(fig)
    buf.seek(0)

    return buf.getvalue()


def create_rectangular_plot():
    fig, ax = plt.subplots()
    assert isinstance(ax, Axes)
    ax.plot()

    return fig, ax


def create_polar_plot(
    theta: npt.NDArray[np.float64], r: npt.NDArray[np.float64]
):
    fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
    assert isinstance(ax, PolarAxes)

    ax.plot(theta, r, clip_on=False)

    return fig, ax


if __name__ == "__main__":
    # plot_sources([Source(type="E", direction="X", amplitude=1, phase=0)])
    # plot_view_plane(
    #     ViewPlaneConfig(
    #         cutPlane="YZ",
    #         isDb=True,
    #         isGainTotal=False,
    #         sources=[Source(type="E", direction="Z", amplitude=1, phase=0)],
    #     )
    # )
    ...
