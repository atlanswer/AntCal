import sys

from api.log import log
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse, PlainTextResponse

log.info(f"{sys.version_info}")
# app = FastAPI(default_response_class=ORJSONResponse)


# @app.get("/", response_class=PlainTextResponse)
# async def get_root() -> str:
#     return "Hello, world!"
