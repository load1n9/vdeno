# v_bindgen for deno
generates deno bindings for the v programming language (not advanced yet but it work)

## example
```v
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
```
### compile
```sh
v -shared -prod test.v
```

### generates bindings

```sh
deno run -A --unstable https://deno.land/x/vlang/main.ts test.v
```

### output
```ts

export const modulefile = Deno.dlopen("test.so", {
"square": { parameters: ["i32"], result: "i32" },
"sqrt_of_sum_of_squares": { parameters: ["f64","f64"], result: "f64" },
});
export { modulefile as default };

```
### Maintainers

- [load1n9](https://github.com/load1n9)