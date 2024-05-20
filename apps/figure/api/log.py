import logging

from rich.logging import RichHandler

logging.basicConfig(
    level="NOTSET",
    format="%(message)s",
    datefmt="[%m/%d %H:%M:%S]",
    handlers=[RichHandler(markup=True)],
)
log = logging.getLogger("rich")
