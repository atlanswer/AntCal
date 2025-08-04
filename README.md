# AntCal

[![Read the Docs](https://readthedocs.org/projects/antcal/badge/?version=latest)](https://antcal.readthedocs.io)
[![PyPI - Version](https://img.shields.io/pypi/v/antcal?logo=pypi)](https://pypi.org/project/antcal)
![PyPI - Downloads](https://img.shields.io/pypi/dm/antcal?logo=pypi)
![PyPI - Status](https://img.shields.io/pypi/status/antcal?logo=pypi)
![PyPI - Python Version](https://img.shields.io/pypi/pyversions/antcal?logo=pypi)
[![MIT license](https://img.shields.io/pypi/l/antcal?logo=pypi)](https://opensource.org/licenses/MIT)

Visualize vector field, synthesize radiation pattern, and more to come!

<img alt="AntCal web app screenshot" src="https://github.com/user-attachments/assets/9f1b3123-ea08-4c4a-a7d5-11bc8cb1fcc6" />

AntCal Web App: https://antcal.atlanswer.com<br/>
Dev version: https://dev.antcal.atlanswer.com

## Usage

### Python Package

Docs: https://antcal.readthedocs.io

#### Install

```shell
pip install antcal
```

## Development

### Web App

```shell
bun i
bun dev
bun preview
```

### Python package

```shell
cd python
# Create virtual env
uv sync
# Build and publish
uv run flit build
uv run flit publish
```

<details>

<summary>
AntCal C++ package
</summary>

### C++ package

**Currently in backlog**

C++ implementation is in `/cpp`. A build environment is required. All presets are documented in `CMakePresets.json`.

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

</details>
