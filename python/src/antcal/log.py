import logging

from rich.logging import RichHandler

log = logging.getLogger("antcal")
handler = RichHandler(
    log_time_format="[%m/%d %H:%M:%S]",
    markup=True,
    rich_tracebacks=True,
    tracebacks_show_locals=True,
)
log.setLevel(logging.DEBUG)
log.addHandler(handler)
