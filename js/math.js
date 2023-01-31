/******************************************************************************
 *
 * This library contains routine math functions, and was previously saved as
 * MathFunctions.js, except that got too big so I decided to break it up into
 * individual modules and convert everything to typescript for clarity.
 *
 */


/******************************************************************************
 * This function swaps two numbers contained in different variables.
 */

export function swap(a, b) {
    return [b, a];
}

/******************************************************************************
 * Implements rounding of a float to a specific number of decimal values (or
 *   an integer)
 */

export function round(x, a = 0) {
    return Math.round(x * Math.pow(10, a)) / Math.pow(10, a);
}

//function min(a, b) { return a <= b ? a : b; }
//function max(a, b) { return a >= b ? a : b; }

export function sgn(a) {
    return a / Math.abs(a);
}

export function odd(x) {
    return (x % 2) == 1;
}

export function even(x) {
    return (x % 2) == 0;
}

export function ln(x) {
    return Math.log(x);
}

export function log(x) {
    return Math.log(x) / Math.log(10);
}

export function sqr(x) {
    return Math.pow(x, 2);
}

export function sqrt(x) {
    return Math.pow(x, 0.5);
}

export function cbrt(x) {
    return Math.pow(x, 1 / 3);
}