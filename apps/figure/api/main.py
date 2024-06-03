from hashlib import md5

from fastapi import APIRouter, FastAPI, Response
from fastapi.responses import ORJSONResponse, PlainTextResponse

from .plot import plot_blank

app = FastAPI(
    default_response_class=ORJSONResponse,
)

router = APIRouter(prefix="/api")


@router.get("", response_class=PlainTextResponse)
async def get_root() -> str:
    return "Hello, world!"


@router.get("/graph", response_class=PlainTextResponse)
async def get_graph() -> str:
    return "Hello, world! graph"


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
