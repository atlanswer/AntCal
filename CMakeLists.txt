cmake_minimum_required(VERSION 3.21..3.24)

if(${CMAKE_VERSION} VERSION_LESS 3.12)
    cmake_policy(VERSION ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION})
endif()

# Regular expression that matches a define preprocessor.
set(VERSION_REGEX "#define ANTCAL_VERSION[ \t]+\"(.+)\"")

# Read the sourcefile that contains the version info.
file(STRINGS "${CMAKE_CURRENT_SOURCE_DIR}/include/antcal/version.hpp"
    VERSION_STR REGEX ${VERSION_REGEX})

# Replace the captured version.
string(REGEX REPLACE ${VERSION_REGEX} "\\1" VERSION_STR "${VERSION_STR}")

if(${CMAKE_HOST_SYSTEM_NAME} STREQUAL "Windows")
    set(VCPKG_TARGET_TRIPLET "x64-windows-static" CACHE STRING "Vcpkg target triplet")
endif()

project(AntCal VERSION ${VERSION_STR}
    DESCRIPTION "Antenna Calculator"
    LANGUAGES CXX)

# Find packages here.
find_package(fmt CONFIG REQUIRED)
find_package(doctest CONFIG REQUIRED)

# Enable IDE folder support.
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

# set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/bin")

# Default build type if not specified.
set(default_build_type "Debug")

if(CMAKE_CONFIGURATION_TYPES)
    message(STATUS "Multi-config enabled, CMAKE_CONFIGURATION_TYPES=${CMAKE_CONFIGURATION_TYPES}")
elseif(CMAKE_BUILD_TYPE)
    message(STATUS "Build type was specified as CMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}")
else()
    message(STATUS "Setting build type to \"${default_build_type}\" as none was specified.")
    set(CMAKE_BUILD_TYPE "${default_build_type}" CACHE
        STRING "Choose the build type." FORCE)
    set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS
        "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()

# Testing
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)
    include(CTest)
    include(doctest)
endif()

add_library(antcal STATIC)
target_sources(antcal PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/src/antcal.cpp
)
target_include_directories(antcal PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)
target_link_libraries(antcal PRIVATE doctest::doctest)
target_compile_features(antcal PUBLIC cxx_std_20)

add_executable(cli)
target_sources(cli PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/apps/cli.cpp
)
target_link_libraries(cli PRIVATE antcal fmt::fmt)
target_compile_features(cli PUBLIC cxx_std_20)

# MSVC runtime library static link
set_target_properties(antcal cli PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

if(BUILD_TESTING)
    add_executable(doctest)
    target_sources(doctest PRIVATE
        tests/test.cpp
    )
    target_link_libraries(doctest PRIVATE
        antcal
        doctest::doctest
        fmt::fmt)
    target_include_directories(doctest PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/src
    )
    target_compile_features(doctest PUBLIC cxx_std_20)
    doctest_discover_tests(doctest)
    set_target_properties(doctest PROPERTIES MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
endif()
