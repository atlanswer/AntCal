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

project(AntCal VERSION ${VERSION_STR}
    DESCRIPTION "Antenna Calculator"
    LANGUAGES CXX)

# Find packages here.
find_package(Git QUIET)
find_package(fmt CONFIG REQUIRED)
find_package(doctest CONFIG REQUIRED)

# Update submodules
if(GIT_FOUND AND EXISTS "${PROJECT_SOURCE_DIR}/.git")
    option(GIT_SUBMODULE "Checkout submodules during build" ON)

    if(GIT_SUBMODULE)
        message(STATUS "Updating submodules")
        execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive
            WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
            RESULT_VARIABLE GIT_SUBMODULE_RESULT)

        if(NOT GIT_SUBMODULE_RESULT EQUAL "0")
            message(FATAL_ERROR "git submodule update --init --recursive failed with ${GIT_SUBMODULE_RESULT}")
        endif()
    endif()
endif()

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

if(BUILD_TESTING)
    add_executable(doctest)
    target_sources(doctest PRIVATE
        tests/test.cpp
    )
    target_link_libraries(doctest PRIVATE
        antcal
        doctest::doctest
        fmt::fmt)
    target_compile_features(doctest PUBLIC cxx_std_20)
    doctest_discover_tests(doctest)
endif()

# set(CPACK_PROJECT_NAME ${PROJECT_NAME})
# set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
# include(CPack)
