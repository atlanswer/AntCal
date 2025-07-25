from hashlib import md5
from os import getenv
from urllib.parse import unquote

from fastapi import APIRouter, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse, PlainTextResponse

from .plot import (
    PlaneConf,
    Sources,
    plot_blank,
    plot_plane,
    plot_source,
)

app = FastAPI(
    default_response_class=ORJSONResponse,
)

PUBLIC_API_URL = getenv("PUBLIC_API_URL")

isDev = bool(PUBLIC_API_URL is not None and "localhost" in PUBLIC_API_URL)

if isDev:
    app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:4321"])


router = APIRouter(prefix="/api")


@router.get("", response_class=PlainTextResponse)
async def get_root() -> str:
    return "Hello, world!"


@router.get("/figure", response_class=ORJSONResponse)
async def get_figure(fig: str, response: Response):
    viewPlaneConfig = PlaneConf.model_validate_json(unquote(fig))

    response.headers.append(
        "cache-control",
        "no-cache" if isDev else "public, max-age=1440, s-maxage=1440",
    )

    return plot_plane(viewPlaneConfig).model_dump()


@router.get("/source-preview", response_class=PlainTextResponse)
async def get_source_preview(src: str, response: Response):
    sources = Sources.model_validate_json(unquote(src))

    response.headers.append(
        "cache-control",
        "no-cache" if isDev else "public, max-age=1440, s-maxage=1440",
    )

    return plot_source(sources)


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
