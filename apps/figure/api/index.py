from fastapi import FastAPI
from fastapi.responses import ORJSONResponse, PlainTextResponse


app = FastAPI(default_response_class=ORJSONResponse)


@app.get("/", response_class=PlainTextResponse)
async def get_root() -> str:
    return "Hello, world!"
