# Install PyAEDT in AEDT Desktop

> Reference: https://aedt.docs.pyansys.com/version/stable/Getting_started/Installation.html#install-from-a-batch-file

`$env:aedt_path="C:\Program Files\AnsysEM\v231\Win64\commonfiles\CPython\3_7\winx64\Release\python"`
`$env:version=231`

Create PyAEDT virtual environment.

```powershell
$env:pyaedt_install_dir = "$env:APPDATA\pyaedt_env\v$env:version"

."$env:aedt_path\python.exe" -m venv "$env:pyaedt_install_dir" --system-site-packages

."$env:pyaedt_install_dir\Scripts\Activate.ps1"
```

Install PyAEDT.

```powershell
python -m pip install --upgrade pip wheel pyaedt ipython ipyvtklink
python -m pip uninstall pywin32
python "$env:pyaedt_install_dir\Lib\site-packages\pyaedt\misc\aedtlib_personalib_install.py" $env:version
```
