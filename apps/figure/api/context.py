# spell-checker:words lpwl, hpbw

from typing import Any, Literal, TypedDict, cast

from matplotlib.backend_bases import RendererBase
from matplotlib.patches import FancyArrowPatch
from mpl_toolkits.mplot3d import proj3d
from mpl_toolkits.mplot3d.axes3d import Axes3D
from pydantic import BaseModel, RootModel


class Source(TypedDict):
    type: Literal["E", "M"]
    lpwl: float
    direction: Literal["+X", "+Y", "+Z"]
    x: float
    y: float
    z: float
    amplitude: float
    phase: float


class Sources(RootModel[list[Source]]):
    def __iter__(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        return iter(self.root)

    def __getitem__(self, item: int):
        return self.root[item]


Plane = Literal["XZ", "YZ", "XY"]


class PlaneConf(BaseModel):
    sources: list[Source]
    plane: Plane
    db: bool
    gainTotal: bool
    dbMin: int = -30
    dbMax: int = 10
    linMin: int = 0
    axisStepDeg: float = 1


class PlaneConfArray(RootModel[list[PlaneConf]]):
    def __iter__(self):  # pyright: ignore[reportIncompatibleMethodOverride]
        return iter(self.root)

    def __getitem__(self, item: int):
        return self.root[item]


class FigureResponse(BaseModel):
    maxD: int
    hpbw: int
    figData: str


FigureArrayResponse = RootModel[list[FigureResponse]]


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
