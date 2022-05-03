export const _lib = Deno.dlopen("./test.so", {
"square": { parameters: ["i32"], result: "i32" },
"sqrt_of_sum_of_squares": { parameters: ["f64","f64"], result: "f64" },
});
export { _lib as default };