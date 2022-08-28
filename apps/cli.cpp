#include <fmt/core.h>
#include <antcal/antcal.hpp>

int main(int argc, char **argv) {
    fmt::print("Hello, world!\nantcal version: {}.\n", antcal::VERSION);
    return 0;
}
