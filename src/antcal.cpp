#include <doctest/doctest.h>

#include "antcal/antcal.hpp"

int antcal::factorial(int number) {
  return number <= 1 ? 1 : number * factorial(number - 1);
}

TEST_CASE("function 'factorial'") {
  CHECK(antcal::factorial(0) == 1);
  CHECK(antcal::factorial(1) == 1);
  CHECK(antcal::factorial(2) == 2);
  CHECK(antcal::factorial(5) == 120);
  CHECK(antcal::factorial(10) == 3628800);
}
