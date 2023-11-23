import os
import sys

from pyaedt import settings
from pyaedt.generic.desktop_sessions import _desktop_sessions


class Desktop:
    """Provides the Ansys Electronics Desktop (AEDT) interface."""

    def __new__(cls):
        if len(_desktop_sessions.keys()) > 0:
            # Reuse _desktop_session[sessions[0]]
            ...
        else:
            return object.__new__(cls)

    def __init__(
        self,
        specified_version: str | None = None,
        non_graphical: bool = False,
        new_desktop_session: bool = True,
        close_on_exit: bool = True,
        student_version: bool = False,
        machine: str = "",
        port: int = 0,
        aedt_process_id: int | None = None,
    ):
        self._main = sys.modules["__main__"]

        student_version_flag, version_key, version = self._assert_version(
            specified_version, student_version
        )

        # AEDT opening decision tree
        if "oDesktop" in dir():
            starting_mode = "console_in"
        elif "oDesktop" in dir(self._main) and self._main.oDesktop is not None:
            starting_mode = "console_out"
        else:
            ...

        starting_mode = "grpc"

        # starting AEDT
        settings.aedt_version = version_key
        if "oDesktop" in dir(self._main):
            del self._main.oDesktop
        if starting_mode == "grpc":
            self._init_grpc(
                non_graphical,
                new_desktop_session,
                version,
                student_version_flag,
                version_key,
            )

        settings.enable_desktop_logs = not non_graphical
        self._init_desktop()

    def _assert_version(
        self,
        specified_version: str | None = None,
        student_version: bool = False,
    ):
        return False, "2023.2", "Ansoft.ElectronicsDesktop.2023.2"

    def _init_grpc(
        self,
        non_graphical: bool,
        new_desktop_session: bool,
        version: str,
        student_version: bool,
        version_key: str,
    ):
        self.machine = ""

        self.port = _find_free_port()

        installer = os.path.join(
            self._main.sDesktopinstallDirectory, "ansysedt.exe"
        )

        out, self.port = launch_aedt(
            installer, non_graphical, self.port, student_version
        )
        self.launched_by_pyaedt = True
        oApp = self._initialize(
            is_grpc=True,
            non_graphical=non_graphical,
            machine=self.machine,
            port=self.port,
            new_session=not out,
            version=version_key,
        )

        self._main.isoutsideDesktop = True
        self._main.oDekstop = oApp.GetAppDesktop()
        _proc = self._main.oDesktop.GetProcessID()
        self.is_grpc_api = True

    def _initialize(
        self,
        machine: str = "",
        port: int = 0,
        non_graphical: bool = False,
        new_session: bool = False,
        version: str | None = None,
        is_grpc: bool = True,
    ):
        base_path = self._main.sDesktopinstallDirectory
        sys.path.insert(0, base_path)
        sys.path.insert(
            0, os.path.join(base_path, "PythonFiles", "DesktopPlugin")
        )
        ...
        import pyaedt.generic.grpc_plugin as StandalonePyScriptWrapper

        return StandalonePyScriptWrapper.CreateAedtApplication(
            machine, port, non_graphical, new_session
        )

    def _init_desktop(self):
        self._main.pyaedt_version = pyaedtversion
        self._main.AEDTVersion = self._main.oDesktop.GetVersion()[0:6]
        self._main.oDesktop.RestoreWindow()
        self._main.sDesktopinstallDirectory = self._main.oDesktop.GetExeDir()
        self._main.pyaedt_initialized = True

def _find_free_port():
    from contextlib import closing
    import socket

    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(("127.0.0.1", 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


def launch_aedt(
    full_path: str,
    non_graphical: bool,
    port: int,
    student_version: bool,
    first_run: bool = True,
):
    """Launch AEDT in gRPC mode."""

    return True, port
