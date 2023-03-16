/******************************************************************************
 *
 * This library contains routine math functions, and was previously saved as
 * MathFunctions.js, except that got too big so I decided to break it up into
 * individual modules and convert everything to typescript for clarity.
 *
 */

export const PI        = 3.14159265358979323846;
export const E         = 2.71828182845904523536;
export const LN2       = 0.69314718055994530942;
export const LN10      = 2.30258509299404568402;
export const PHI       = 1.61803398874989484821;
export const LNPI      = 1.14472988584940017414;
export const LNSQRT2PI = 0.91893853320467274178;
export const SQRT2PI   = 2.50662827463100050242;

export const MAXGAM  = 34.648;
export const MAXFACT = 170;
export const MAXLGM  = 1.0383E+36;
export const MACHEP  = 1.08420217248550444E-19;
export const BIG     = 9.223372036854775808E18;
export const BIGINV  = 1.084202172485504434007E-19;
export const PREC    = 1E-16;

export const MAXDOUBLE = Number.MAX_VALUE;
export const MINDOUBLE = Number.MIN_VALUE;
export const MAXINT    = Number.MAX_SAFE_INTEGER;
export const MININT    = Number.MIN_SAFE_INTEGER;
export const MAXLOG    = Math.log(MAXDOUBLE);
export const MINLOG    = Math.log(MINDOUBLE);

/******************************************************************************
 * This function swaps two numbers contained in different variables.
 * @param a{any}
 * @param b{any}
 * @return array with the swapped elements
 */

export function swap(a, b) {
    return [b, a];
}

/******************************************************************************
 * Implements rounding of a float to a specific number of decimal values (or
 *   an integer if a is 0). Uses banker's rounding rule of Half-Up rounding
 * @param x{number} - the value to round
 * @param a{integer} - the number of decimals to round to
 * @returns the rounded value 
 */

export function round(x, a = 0) {
    return Math.round(x * Math.pow(10, a)) / Math.pow(10, a);
}

/******************************************************************************
 * Returns the fractional part of a number 
 */

export function frac(x) {
    x = Math.abs(x);
    return x - Math.floor(x);
}

/******************************************************************************
 * Maps a point within some specified domain to an output range
 * @param x {number} - the point to change the mapping for
 * @param domain {number[]} - the range of the input values. This should be a
 *   two element array with a lower and upper bound of the range
 * @param range {number[]} - the raound of the output values. This should be a
 *   two element array with a lower and upper bound of the domain
 */

export function scalemap(x, domain, range) {
    return (x - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]) + range[0];
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

export function abs(x) {
    return Math.abs(x);
}

/******************************************************************************
 * Determines which quadrant a point lies in for a standard two-dimensional
 *  array
 * @param x {number} the x-coordinate of the point
 * @param y {number} the y-coordinate of the point
 * @return {number} either 1, 2, 3, or 4 depending on the quadrant
 */
export function quadrant(x, y) {
	if (x > 0) {
		return y > 0 ? 1 : 4;
	} else {
		return y > 0 ? 2 : 3;
	}
}