module test

import math

// square -> (int) -> int
[export: 'square']
fn square(i int) int {
	return i * i
}
// sqrt_of_sum_of_squares -> (f64, f64) -> f64
[export: 'sqrt_of_sum_of_squares']
fn sqrt_of_sum_of_squares(x f64, y f64) f64 {
	return math.sqrt(x * x + y * y)
}