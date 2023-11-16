# AntCal

[![Documentation Status](https://readthedocs.org/projects/antcal/badge/?version=latest)](https://antcal.readthedocs.io/en/latest/?badge=latest) [![Hatch project](https://img.shields.io/badge/%F0%9F%A5%9A-Hatch-4051b5.svg)](https://github.com/pypa/hatch) [![PyAnsys](https://img.shields.io/badge/Py-Ansys-ffc107.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABDklEQVQ4jWNgoDfg5mD8vE7q/3bpVyskbW0sMRUwofHD7Dh5OBkZGBgW7/3W2tZpa2tLQEOyOzeEsfumlK2tbVpaGj4N6jIs1lpsDAwMJ278sveMY2BgCA0NFRISwqkhyQ1q/Nyd3zg4OBgYGNjZ2ePi4rB5loGBhZnhxTLJ/9ulv26Q4uVk1NXV/f///////69du4Zdg78lx//t0v+3S88rFISInD59GqIH2esIJ8G9O2/XVwhjzpw5EAam1xkkBJn/bJX+v1365hxxuCAfH9+3b9/+////48cPuNehNsS7cDEzMTAwMMzb+Q2u4dOnT2vWrMHu9ZtzxP9vl/69RVpCkBlZ3N7enoDXBwEAAA+YYitOilMVAAAAAElFTkSuQmCC)](https://aedt.docs.pyansys.com/) [![PyPI](https://img.shields.io/pypi/v/antcal?logo=pypi&logoColor=white)](https://pypi.org/project/antcal/) [![MIT license](https://img.shields.io/pypi/l/antcal)](https://opensource.org/licenses/MIT)

Antenna calculator

## Roadmap

- Included features: [#1](https://github.com/atlanswer/AntCal/issues/1)
- Implemantation: [#2](https://github.com/atlanswer/AntCal/issues/2)

## Usage

### Python

#### Install

```shell
pip install antcal
```

## Build

### Python package

- Restore `conda` environment
  ```shell
  conda-lock install --mamba --dev -E vis -E docs -p ./python/venv ./python/conda-lock.yml
  ```
- Create lockfile
  ```shell
  conda-lock lock --mamba -e vis -e docs -f ./python/pyproject.toml --lockfile ./python/conda-lock.yml
  ```
- Build
  ```shell
  cd python
  hatch build
  ```
- Publish
  ```shell
  cd python
  hatch publish
  ```

### C++ package

**Currently in backlog**

C++ implementation is on the branch `cpplib`. A build environment is required. All presets are documented in `CMakePresets.json`.

- Fetch vcpkg
  ```shell
  > git submodule update --init --recursive
  ```
- Configurate
  ```shell
  > cmake --preset <preset>
  ```
- Build
  ```shell
  > cmake --build --preset <preset>
  ```
- Test
  ```shell
  > ctest --preset <preset>
  ```
