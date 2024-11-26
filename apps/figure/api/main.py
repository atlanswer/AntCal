from hashlib import md5
from os import getenv
from urllib.parse import unquote

from fastapi import APIRouter, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse, PlainTextResponse

from .plot import (
    Sources,
    PlaneConf,
    PlaneConfArray,
    plot_blank,
    plot_source_preview,
    plot_view_plane,
    plot_view_planes,
)

app = FastAPI(
    default_response_class=ORJSONResponse,
)

VITE_API_URL = getenv("VITE_API_URL")

isDev = bool(VITE_API_URL is not None and "localhost" in VITE_API_URL)

if isDev:
    app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"])


router = APIRouter(prefix="/api")


@router.get("", response_class=PlainTextResponse)
async def get_root() -> str:
    return "Hello, world!"


@router.get("/figure-with-detail", response_class=ORJSONResponse)
async def get_figure(fig: str, response: Response):
    viewPlaneConfig = PlaneConf.model_validate_json(unquote(fig))

    response.headers.append(
        "cache-control",
        "no-cache" if isDev else "public, max-age=1440, s-maxage=1440",
    )

    return plot_view_plane(viewPlaneConfig).model_dump()


@router.get("/figures", response_class=ORJSONResponse)
async def get_figures(figs: str, response: Response):
    viewPlaneConfigs = PlaneConfArray.model_validate_json(unquote(figs))

    response.headers.append(
        "cache-control",
        "no-cache" if isDev else "public, max-age=1440, s-maxage=1440",
    )

    return plot_view_planes(viewPlaneConfigs).model_dump()


@router.get("/source-preview", response_class=PlainTextResponse)
async def get_source_preview(src: str, response: Response):
    sources = Sources.model_validate_json(unquote(src))

    response.headers.append(
        "cache-control",
        "no-cache" if isDev else "public, max-age=1440, s-maxage=1440",
    )

    return plot_source_preview(sources)


@router.get("/blank")
async def get_blank() -> Response:
    content = plot_blank()
    return Response(
        content=content,
        headers={
            "Content-Disposition": 'attachment; filename="blank.svg"',
            "Content-Length": f"{len(content)}",
            "Etag": f"{md5(content, usedforsecurity=False).hexdigest()}",
        },
        media_type="image/svg+xml",
    )


app.include_router(router)
