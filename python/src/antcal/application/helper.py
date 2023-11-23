"""Hack a way to achieve multiple desktop sessions."""

import sys
from pyaedt.generic.desktop_sessions import _desktop_sessions  # pyright: ignore [reportPrivateUsage]
from pyaedt.hfss import Hfss
from pyaedt.generic.settings import settings


def new_hfss_session(non_graphical: bool = False) -> Hfss:
    """Create a new HFSS instance, defaults to the latest version.

    :param bool non_graphical: Launch AEDT in non graphical mode, defaults to False
    :return Hfss: Hfss object

    :Examples:
    ```py
    >>> h1 = new_hfss_session()
    >>> h2 = new_hfss_session()
    ```
    """

    # Fallback to PythonNET
    settings.use_grpc_api = False
    # Reset desktop session tracker
    _desktop_sessions.clear()
    # Remove existing desktop handle
    try:
        del sys.modules["__main__"].oDesktop  # pyright: ignore
    except AttributeError:
        ...

    # Create a new HFSS object
    h = Hfss(non_graphical=non_graphical, new_desktop_session=True)

    # Rebind desktop properties
    d = sys.modules["__main__"].oDesktop
    desktop_install_dir = sys.modules["__main__"].sDesktopinstallDirectory
    h._odesktop = d  # pyright: ignore [reportPrivateUsage]
    h._desktop_class = d  # pyright: ignore [reportPrivateUsage]
    h._desktop_install_dir = desktop_install_dir  # pyright: ignore [reportPrivateUsage]

    return h
