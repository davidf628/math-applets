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

export function swap(a: number, b: number) :number[] { 
    return [b, a]; 
}

/******************************************************************************
 * Implements rounding of a float to a specific number of decimal values (or
 *   an integer)
 */

export function round(x: number, a: number = 0) :number { 
    return Math.round(x * Math.pow(10, a)) / Math.pow(10, a); 
}
//function min(a, b) { return a <= b ? a : b; }
//function max(a, b) { return a >= b ? a : b; }
export function sgn(a: number) :number { 
    return a / Math.abs(a);
};

export function odd(x: number) :boolean { 
    return (x % 2) == 1; 
};

export function even(x: number) :boolean { 
    return (x % 2) == 0; 
};

export function ln(x: number) :number { 
    return Math.log(x); 
};

export function log(x: number) :number { 
    return Math.log(x) / Math.log(10); 
};