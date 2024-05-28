import os
import sys
from hashlib import md5

from fastapi import FastAPI, Response
from fastapi.responses import ORJSONResponse, PlainTextResponse

from .log import log
from .plot import plot_blank

log.info(f"{sys.version_info}")
app = FastAPI(
    default_response_class=ORJSONResponse,
    root_path="/api" if os.getenv("ENVIRONMENT") == "prod" else "",
)


@app.get("/", response_class=PlainTextResponse)
async def get_root() -> str:
    return "Hello, world!"


@app.get("/graph", response_class=PlainTextResponse)
async def get_graph() -> str:
    return "Hello, world! graph"


@app.get("/preview", response_class=PlainTextResponse)
async def get_preview() -> str:
    return "Hello, world! preview"


@app.get("/blank")
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
