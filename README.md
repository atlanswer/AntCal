# AntCal

Antenna calculator

## Roadmap

- Included features: [#1](https://github.com/atlanswer/AntCal/issues/1)
- Implemantation: [#2](https://github.com/atlanswer/AntCal/issues/2)

## Usage

### Python

## Build

### Python package

- Restore `conda` environment
  ```shell
  > conda-lock install --mamba -p ./python/venv -f ./python/conda-lock.yml
  ```
- Create lockfile
  ```shell
  > conda-lock --mamba -f ./python/pyproject.toml --lockfile conda-lock.yml
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
