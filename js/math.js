export function swap(a, b) { 
    return [b, a]; 
}

export function round(x, a = 0) { 
    return Math.round(x * Math.pow(10, a)) / Math.pow(10, a); 
}
//function min(a, b) { return a <= b ? a : b; }
//function max(a, b) { return a >= b ? a : b; }
export function sgn(a) { 
    return a / abs(a) 
};

export function odd(x) { 
    return (x % 2) == 1; 
};

export function even(x) { 
    return (x % 2) == 0; 
};

export function ln(x) { 
    return Math.log(x); 
};

export function log(x) { 
    return Math.log(x) / Math.log(10); 
};