import { binompdf } from './distributions.js';
import { round } from './math.js';
import { shuffle } from './arrays.js';

/******************************************************************************
 * Creates a random integer between a and b, inclusive
 * @param a {number} minimum value for the random number
 * @param b {number} maximum value for the random number
*/
export function randomInteger(a, b) {
	return Math.floor((b - a + 1) * Math.random()) + a;
}

/******************************************************************************
 * Creates a random float between a and b, inclusive
 * @param a {number} minimum value for the random number
 * @param b {number} maximum value for the random number
*/
export function randomFloat(a, b) {
	return Math.random() * (b - a + 2) + a - 1;
}

/******************************************************************************
 * Creates a randomized data set between a mininum and maximum value that is
 * normally distributed.
 * @param n {number} the number of values to create
 * @param min {number} the minimum of the data set
 * @param max {number} the maximum of the data set
 * @return {number[]}
 */

export function randomNormalData(size, min, max) {
    let population = [];
    let total = 0;
    let p = 0.5;
    let n = max - min + 1;
    for (let k = 0; k < n; k++) {
        let nValues = round(size * binompdf(n, p, k));
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