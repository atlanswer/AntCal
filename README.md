# AntCal

Antenna calculator

**Note**: This project is still in the early development phase.

## Roadmap

- Included features: [#1](https://github.com/atlanswer/AntCal/issues/1)
- Implemantation: [#2](https://github.com/atlanswer/AntCal/issues/2)

## Usage

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

Python implemantation is on the brach `dra`.
Currently focusing on implementing DR calculator feature.
