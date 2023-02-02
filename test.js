import { round } from './js/math.js';
import { randomNormalData } from './js/stats.js';
import { evaluate } from 'mathjs';

console.log(evaluate('2+5'));
console.log(round(25.5));
console.log(randomNormalData(15, 10, 30));
