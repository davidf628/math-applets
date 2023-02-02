import { shuffle, sort } from './arrays.js';
import { round, sqr, sqrt } from './math.js';

/******************************************************************************
 * Finds the minimum value in an array of numbers.
 * @param list {number[]} - array to find the minimum
 */

export function min(list) {
    var min = Number.MAX_VALUE;
    for (var i = 0; i < list.length; i++) {
        if (list[i] < min) {
            min = list[i];
        }
    }
    return min;
}

///////////////////////////////////////////////////////////////////////////////
//  Finds the maximum value in an array of numbers.
///////////////////////////////////////////////////////////////////////////////

export function max(list) {
    var max = Number.MIN_VALUE;
    for (var i = 0; i < list.length; i++) {
        if (list[i] > max) {
            max = list[i];
        }
    }
    return max;
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates the value of the median in an array
///////////////////////////////////////////////////////////////////////////////

export function median(list) {
    var a = sort(list);
    var mid = a.length / 2;
    var med = Number.MIN_VALUE;
    if (a.length % 2 == 0) {
        med = (a[mid - 1] + a[mid]) / 2;
    }
    else {
        med = a[Math.floor(mid)];
    }
    return med;
}

/******************************************************************************
 * Calculates the mode of a set of data, returns an array in case there are
 * multiples.
 *
 */

export function mode(list) {
}

/******************************************************************************
 * Finds the highest frequency of any data items within a data set. This is
 * similar to the mode, but it returns the value of the frequency instead of
 * the value(s) that occur the most.
 * 
 * @param list {number[]} - array of number
 */

export function max_frequency(list) {
    let counts = {};
    for (let value of list) {
        if (value in counts) {
            counts[value] += 1;
        }
        else {
            counts[value] = 1;
        }
    }
    let max = 0;
    for (let value of Object.values(counts)) {
        if (value > max) {
            max = value;
        }
    }
    return max;
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates q1 for the values of the items in an array
///////////////////////////////////////////////////////////////////////////////

export function q1(list) {
    var a = sort(list);
    var mid = a.length / 2;
    return median(a.slice(0, Math.floor(mid)));
}

//////////////////////////////////////////////////////////////////////////////
//  Calculates q1 for the values of the items in an array
//////////////////////////////////////////////////////////////////////////////

export function q3(list) {
    var a = sort(list);
    var mid = a.length / 2;
    return median(a.slice(Math.ceil(mid), a.length));
}

///////////////////////////////////////////////////////////////////////////
//  Computes the sum of an array of numbers.
///////////////////////////////////////////////////////////////////////////
export function sum(list) {
    var s = 0;
    for (var i = 0; i < list.length; i++) {
        s += list[i];
    }
    return s;
}

//////////////////////////////////////////////////////////////////////////////
//  Computes the sum of the squares of an array of numbers.
//////////////////////////////////////////////////////////////////////////////

export function sumofsqr(list) {
    var s = 0;
    for (var i = 0; i < list.length; i++) {
        s += sqr(list[i]);
    }
    return s;
}

///////////////////////////////////////////////////////////////////////////
//  Calculates the arithmetic mean of a set of values.
///////////////////////////////////////////////////////////////////////////

export function mean(list) {
    return sum(list) / list.length;
}

///////////////////////////////////////////////////////////////////////////
//  Calculates the arithmetic mean of a set of values,
//   subject to an array of frequencies.
///////////////////////////////////////////////////////////////////////////

export function wmean(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    var s = 0;
    for (var i = 0; i < list.length; i++) {
        s += list[i] * freq[i];
    }
    return s / sum(freq);
}

//////////////////////////////////////////////////////////////////////////////
//  Calculates the sample standard deviation of a set of values.
//////////////////////////////////////////////////////////////////////////////

export function stdev(list) {
    var mu = mean(list);
    var ssd = 0; // sum of squared deviations
    for (var i = 0; i < list.length; i++) {
        ssd += sqr(list[i] - mu);
    }
    return sqrt(ssd / (list.length - 1));
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates the population standard deviation of a set of values.
///////////////////////////////////////////////////////////////////////////////

export function stdevp(list) {
    var mu = mean(list);
    var ssd = 0; // sum of squared deviations
    for (var i = 0; i < list.length; i++) {
        ssd += sqr(list[i] - mu);
    }
    return sqrt(ssd / list.length);
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates the number of items in a frequency table. Allows for
//.   non-integer frequencies.
///////////////////////////////////////////////////////////////////////////////

export function wn(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    return sum(freq);
}

///////////////////////////////////////////////////////////////////////////////
//  Finds the weighted minimum value in an array of numbers.
///////////////////////////////////////////////////////////////////////////////

export function wmin(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    return min(list);
}

///////////////////////////////////////////////////////////////////////////////
//  Finds the maximum value in an array of numbers.
///////////////////////////////////////////////////////////////////////////////

export function wmax(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    return max(list);
}

///////////////////////////////////////////////////////////////////////////
//  Computes the weighted sum of an array of numbers.
///////////////////////////////////////////////////////////////////////////

export function wsum(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    var s = 0;
    for (var i = 0; i < list.length; i++) {
        s += list[i] * freq[i];
    }
    return s;
}

///////////////////////////////////////////////////////////////////////////
//  Computes a dot product of two sets of numbers, similar to a weighted
//  sum, but allows for "frequencies" to be negative.
///////////////////////////////////////////////////////////////////////////

export function innerproduct(list1, list2) {
    if (list1.length != list2.length) {
        return NaN;
    }
    var s = 0;
    for (var i = 0; i < list1.length; i++) {
        s += list1[i] * list2[i];
    }
    return s;
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates the weighted median in an array
///////////////////////////////////////////////////////////////////////////////

export function wmedian(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    [list, freq] = wsort(list, freq);
    var s = sum(freq);
    var mid = s / 2;
    var csum = 0;
    var index = 0;
    while (csum < mid && index < freq.length) {
        csum += freq[index];
        index += 1;
    }
    return list[index - 1];
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates the weighted value of q1 in an array
///////////////////////////////////////////////////////////////////////////////

export function wq1(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    [list, freq] = wsort(list, freq);
    var s = sum(freq);
    var mid = s / 2;
    var csum = 0;
    var index = 0;
    while (csum < mid && index < freq.length) {
        csum += freq[index];
        index += 1;
    }
    return wmedian(list.slice(0, index), freq.slice(0, index));
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates the weighted value of q1 in an array
///////////////////////////////////////////////////////////////////////////////

export function wq3(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    [list, freq] = wsort(list, freq);
    var s = sum(freq);
    var mid = s / 2;
    var csum = 0;
    var index = 0;
    while (csum < mid && index < freq.length) {
        csum += freq[index];
        index += 1;
    }
    return wmedian(list.slice(index, list.length), freq.slice(index, freq.length));
}

///////////////////////////////////////////////////////////////////////////////
//  Computes the weighted sum of the squares of an array of numbers.
///////////////////////////////////////////////////////////////////////////////

export function wsumofsqr(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    var s = 0;
    for (var i = 0; i < list.length; i++) {
        s += sqr(list[i]) * freq[i];
    }
    return s;
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates the weighted sample standard deviation of a set of values.
///////////////////////////////////////////////////////////////////////////////

export function wstdev(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    var mu = wmean(list, freq);
    var ssd = 0; // sum of squared deviations
    for (var i = 0; i < list.length; i++) {
        ssd += freq[i] * sqr(list[i] - mu);
    }
    return sqrt(ssd / (wn(list, freq) - 1));
}

///////////////////////////////////////////////////////////////////////////////
//  Calculates the weighted population standard deviation of a set of values.
///////////////////////////////////////////////////////////////////////////////

export function wstdevp(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    var mu = wmean(list, freq);
    var ssd = 0; // sum of squared deviations
    for (var i = 0; i < list.length; i++) {
        ssd += freq[i] * sqr(list[i] - mu);
    }
    return sqrt(ssd / wn(list, freq));
}

///////////////////////////////////////////////////////////////////////////////
//  Computes the linear correlation (Pearson) cofficent for paird data.
//		@return: NaN - The length of the x and y data sets is different
//					   or there is not enough data in the data sets.
///////////////////////////////////////////////////////////////////////////////

export function correlation(x_data, y_data) {
    if (x_data.length != y_data.length) {
        return NaN;
    }
    if (x_data.length < 2) {
        return NaN;
    }
    var sx = sum(x_data);
    var sy = sum(y_data);
    var sxy = 0;
    var sxx = sumofsqr(x_data);
    var syy = sumofsqr(y_data);
    var n = x_data.length;
    for (var i = 0; i < x_data.length; i++) {
        sxy += x_data[i] * y_data[i];
    }
    var r = (n * sxy - sx * sy) / sqrt((n * sxx - sqr(sx)) * (n * syy - sqr(sy)));
    return r;
}

///////////////////////////////////////////////////////////////////////////////
//  Computes the slope and y-intercept of of the line of best fit for a
//    set of data.
//		@return: NaN - The length of the x and y data sets is different
//					   or there is not enough data in the data sets.
///////////////////////////////////////////////////////////////////////////////

export function linreg(x_data, y_data) {
    if (x_data.length != y_data.length) {
        return NaN;
    }
    if (x_data.length < 2) {
        return NaN;
    }
    var sx = sum(x_data);
    var sy = sum(y_data);
    var sxy = innerproduct(x_data, y_data);
    var sxx = sumofsqr(x_data);
    var n = x_data.length;
    var m = (n * sxy - sx * sy) / (n * sxx - sqr(sx));
    var b = (sy - m * sx) / n;
    return [m, b];
}

///////////////////////////////////////////////////////////////////////////////
//  Expands an array based on a set of frequencies
//.    @returns NaN if any frequency is negative or the number of frequencies
//.        does not match the number data items
///////////////////////////////////////////////////////////////////////////////

export function expandarray(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if ((freq[i] < 0) || (Math.floor(freq[i]) != freq[i])) {
            return NaN;
        }
    }
    var newlist = [];
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < freq[i]; j++) {
            newlist.push(freq[i]);
        }
    }
    return newlist;
}

///////////////////////////////////////////////////////////////////////////////
//  Sorts two arrays simultaneoulsy by the values in the first array.
///////////////////////////////////////////////////////////////////////////////

export function wsort(list, freq) {
    if (list.length != freq.length) {
        return NaN;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] < 0) {
            return NaN;
        }
    }
    var newArray = [];
    for (var i = 0; i < list.length; i++) {
        newArray.push({ 'x': list[i], 'f': freq[i] });
    }
    newArray.sort(function (a, b) {
        return ((a.x < b.x) ? -1 : ((a.x == b.x) ? 0 : 1));
    });
    for (var i = 0; i < newArray.length; i++) {
        list[i] = newArray[i].x;
        freq[i] = newArray[i].f;
    }
    return [list, freq];
}

/******************************************************************************
 * Creates a randomized data set between a mininum and maximum value that is
 * normally distributed.
 *
 * Inputs:
 *   n - the number of values to create
 *   min - the minimum of the data set
 *   max - the maximum of the data set
 */

export function randomNormalData(size, min, max) {
    let population = [];
    let total = 0;
    let p = 0.5;
    let n = max - min + 1;
    for (let k = 0; k < n; k++) {
        let nValues = round(size * binompdf(n, p, k));
        console.log(`k==${k}, binom==${binompdf(n, p, k)}, nValues==${nValues} `);
        total += nValues;
        for (let i = 0; i < nValues; i++) {
            population.push(k + min);
        }
    }
    if (total < size) {
        for (let i = total; i < size; i++) {
            population.push(round((max - min) * p + min));
        }
    }
    return shuffle(population);
}

function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    return { z0, z1 };
}

function getNormallyDistributedRandomNumber(mean, stddev) {
    const { z0, z1 } = boxMullerTransform();
    return z0 * stddev + mean;
}

export function randomNormalDataSet(n, mean, stdev) {
    const generatedNumbers = [];
    for (let i = 0; i < n; i += 1) {
        generatedNumbers.push(getNormallyDistributedRandomNumber(mean, stdev));
    }
    return generatedNumbers;
}

/*
        Returns the factorial of n if 0 <= n <= 170 and n is an integer,
        or else 0 is returned.

        You will get creepy results if n is not an integer.
*/

function factorial(n) {
    var i, fact = 1;
    if ((n <= 170) && (n >= 0)) {
        for (i = n; i >= 1; i--) {
            fact *= i;
        }
    }
    else
        fact = 0;
    return fact;
}

/*
        Returns the number of permutations of n objects taken r at a time.

        Beware the use of non-integer values for n and r!
*/

function permutation(n, r) {
    return (factorial(n) / factorial(n - r));
}

/*
        Returns the number of combinations of n objects taken r at a time.

        Beware the use of non-integer values for n and r!
*/

function combination(n, r) {
    return (factorial(n) / (factorial(r) * factorial(n - r)));
}

/*
        Returns the binomial probability of x successes for n trials and
        probability of success p.

*/

function binompdf(n, p, x) {
    return combination(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
}

function binomcdf(n, p, x) {
    var sum = 0;
    var i;
    for (i = 0; i <= x; i++) {
        sum += binompdf(n, p, i);
    }
    return sum;
}