# AntCal

[![Read the Docs](https://readthedocs.org/projects/antcal/badge/?version=latest)](https://antcal.readthedocs.io)
[![PyAnsys](https://img.shields.io/badge/Py-Ansys-ffc107.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABDklEQVQ4jWNgoDfg5mD8vE7q/3bpVyskbW0sMRUwofHD7Dh5OBkZGBgW7/3W2tZpa2tLQEOyOzeEsfumlK2tbVpaGj4N6jIs1lpsDAwMJ278sveMY2BgCA0NFRISwqkhyQ1q/Nyd3zg4OBgYGNjZ2ePi4rB5loGBhZnhxTLJ/9ulv26Q4uVk1NXV/f///////69du4Zdg78lx//t0v+3S88rFISInD59GqIH2esIJ8G9O2/XVwhjzpw5EAam1xkkBJn/bJX+v1365hxxuCAfH9+3b9/+////48cPuNehNsS7cDEzMTAwMMzb+Q2u4dOnT2vWrMHu9ZtzxP9vl/69RVpCkBlZ3N7enoDXBwEAAA+YYitOilMVAAAAAElFTkSuQmCC)](https://aedt.docs.pyansys.com)
[![PyPI - Version](https://img.shields.io/pypi/v/antcal?logo=pypi)](https://pypi.org/project/antcal)
![PyPI - Downloads](https://img.shields.io/pypi/dm/antcal?logo=pypi) ![PyPI - Status](https://img.shields.io/pypi/status/antcal?logo=pypi)
![PyPI - Python Version](https://img.shields.io/pypi/pyversions/antcal?logo=pypi)
[![MIT license](https://img.shields.io/pypi/l/antcal?logo=pypi)](https://opensource.org/licenses/MIT)

Antenna calculator: https://antcal.readthedocs.io

Figure: https://antcal.atlanswer.com

## Usage

### Python Package

#### Install

```shell
pip install antcal
```

## Development

### Figure

```shell
bun i
bun dev:fig
bun dev:api
bun run build
```

### Python package

```shell
cd python
# Create virtual env
uv sync
# Install as Editable
uv pip install -e .
```

### C++ package

**Currently in backlog**

C++ implementation is on the branch `cpplib`. A build environment is required. All presets are documented in `CMakePresets.json`.

```shell
# Fetch vcpkg
git submodule update --init --recursive
# Configurate
cmake --preset <preset>
# Build
cmake --build --preset <preset>
# Test
ctest --preset <preset>
```
