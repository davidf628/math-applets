"use strict";
/******************************************************************************
 *
 * This library contains routine math functions, and was previously saved as
 * MathFunctions.js, except that got too big so I decided to break it up into
 * individual modules and convert everything to typescript for clarity.
 *
 */
exports.__esModule = true;
exports.log = exports.ln = exports.even = exports.odd = exports.sgn = exports.round = exports.swap = void 0;
/******************************************************************************
 *
 * This function swaps two numbers contained in different variables.
 */
function swap(a, b) {
    return [b, a];
}
exports.swap = swap;
function round(x, a) {
    if (a === void 0) { a = 0; }
    return Math.round(x * Math.pow(10, a)) / Math.pow(10, a);
}
exports.round = round;
//function min(a, b) { return a <= b ? a : b; }
//function max(a, b) { return a >= b ? a : b; }
function sgn(a) {
    return a / Math.abs(a);
}
exports.sgn = sgn;
;
function odd(x) {
    return (x % 2) == 1;
}
exports.odd = odd;
;
function even(x) {
    return (x % 2) == 0;
}
exports.even = even;
;
function ln(x) {
    return Math.log(x);
}
exports.ln = ln;
;
function log(x) {
    return Math.log(x) / Math.log(10);
}
exports.log = log;
;
