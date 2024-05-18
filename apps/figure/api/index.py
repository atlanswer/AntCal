from sanic import Sanic, Config
from sanic.response import text
from sanic import Request as SanicRequest
from types import SimpleNamespace

Request = SanicRequest[Sanic[Config, SimpleNamespace], SimpleNamespace]

app = Sanic("Figure_API")


@app.get("/")
async def get_root(request: Request):
    return text("Hello, world!")
