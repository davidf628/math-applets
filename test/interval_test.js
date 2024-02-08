import { isBetween, getInterval, isInterval, isPoint, removeInterval } from '../js/interval.js';

function isBetween_test() {
    console.log(`\nisbetween(2, 0, 10) expected: true => returns: ${isbetween(2, 0, 10)}`);
    console.log(`isBetween(,-4 0, 10) expected: false => returns: ${isBetween(-4, 0, 10)}`);
    console.log(`isBetween(25, 0, 10) expected: false => returns: ${isBetween(25, 0, 10)}`);
    console.log(`isBetween(10, 0, 10) expected: false => returns: ${isBetween(10, 0, 10)}`);

    console.log(`\nisBetween(10, 0, 10, true) expected: true => returns: ${isBetween(10, 0, 10, true)}`);

    console.log(`\nisBetween(2, 10, 0) expected: false => returns: ${isBetween(2, 10, 0)}`);
    console.log(`isBetween(-8, -25, -5) expected: true => returns: ${isBetween(-8, -25, -5)}`);
}

function getInterval_test() {
    console.log(`y=2x+5 (2,5) expected: (2,5) => returns ${getInterval('y=2x+5 (2,5)')}`);
    console.log(`y=2x+5 (-2,5) expected: (-2,5) => returns ${getInterval('y=2x+5 (-2,5)')}`);
    console.log(`y=2x+5 (1.8,-2.5) expected: (1.8,-2.5) => returns ${getInterval('y=2x+5 (1.8,-2.5)')}`);
    console.log(`y=2x+5 [2+4,-pi/2) expected: [2+4,-pi/2) => returns ${getInterval('y=2x+5 (2+4,-pi/2)')}`);
    console.log(`y=2x+5 [2,f(2)] expected: [2,f(2)] => returns ${getInterval('y=2x+5 [2,f(2)]')}`);
    console.log(`y=2x+5 (-oo,a+b) expected: (-oo,a+b) => returns ${getInterval('y=2x+5 (-oo,a+b)')}`);
    console.log(`<t, 2t> (-1,4] expected: (-1,4] => returns ${getInterval('<t, 2t> (-1,4]')}`);
    console.log(`removeInterval('<t, 2t> (-1,4]') expected: <t, 2t> => returns ${removeInterval('<t, 2t> (-1,4]')}`);
}

function isInterval_test() {
    console.log(`(2,5) expected: true => returns ${isInterval('(2,5)')}`);
    console.log(`(2,5] expected: true => returns ${isInterval('(2,5]')}`);
    console.log(`[2,5) expected: true => returns ${isInterval('[2,5)')}`);
    console.log(`[2,5] expected: true => returns ${isInterval('[2,5]')}`);
    console.log(`(-2,3] expected: true => returns ${isInterval('[-2,3]')}`);
    console.log(`y=2x+5 (-2,3) expected: false => returns ${isInterval('y=2x+5 (-2,3)')}`);
    console.log(` (a,oo] expected: true => returns ${isInterval(' (a,oo]')}`);
    console.log(`(f(a),2a^2-b] expected: true => returns ${isInterval('(f(a),2a^2-b]')}`);
}

function isPoint_test() {
    console.log(`(2,5) expected: true => returns ${isPoint('(2,5)')}`);
    console.log(`(2,5] expected: false => returns ${isPoint('(2,5]')}`);
    console.log(`[2,5) expected: false => returns ${isPoint('[2,5)')}`);
    console.log(`[2,5] expected: true => returns ${isPoint('[2,5]')}`);
    console.log(`(-2,3] expected: false => returns ${isPoint('(-2,3]')}`);
    console.log(`y=2x+5 (-2,3) expected: false => returns ${isPoint('y=2x+5 (-2,3)')}`);
    console.log(`(a,oo] expected: false => returns ${isPoint('(a,oo]')}`);
    console.log(` (a,oo) expected: true => returns ${isPoint(' (a,oo)')}`);
    console.log(`(f(a),2a^2-b] expected: true => returns ${isPoint('(f(a),2a^2-b]')}`);
}

getInterval_test()