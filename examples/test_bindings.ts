export const modulefile = Deno.dlopen("test.so", {
"square": { parameters: ["i32"], result: "i32" },
"sqrt_of_sum_of_squares": { parameters: ["f64","f64"], result: "f64" },
});
export { modulefile as default };
