from hashlib import md5
from os import getenv
from urllib.parse import unquote

from fastapi import APIRouter, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse, PlainTextResponse

from .plot import (
    ViewPlaneConfig,
    plot_blank,
    plot_view_plane,
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
    viewPlaneConfig = ViewPlaneConfig.model_validate_json(unquote(fig))

    response.headers.append(
        "cache-control",
        "no-cache" if isDev else "public, max-age=1440, s-maxage=1440",
    )

    return plot_view_plane(viewPlaneConfig).model_dump()


@router.get("/preview", response_class=PlainTextResponse)
async def get_preview() -> str:
    return "Hello, world! preview"


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
