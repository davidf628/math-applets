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

    let tests = [
        { test: 'y=2x+5 on (2,5)', exp: '(2,5)' },
        { test: 'y=2x+5 on (-2,5)', exp: '(-2,5)' },
        { test: 'y=2x+5 on (1.8,-2.5)', exp: '(1.8,-2.5)' },
        { test: 'y=2x+5 on [2+4,-pi/2)', exp: '[2+4,-pi/2)' },
        { test: 'y=2x+5 on [2,f(2)]', exp: '[2,f(2)]' },
        { test: 'y=2x+5 on (-oo,a+b)', exp: '(-oo,a+b)' },
        { test: 'r=sin(2t) on (0,2pi)', exp: '(0,2pi)' },
        { test: '<t,2t> on (-1,4]', exp: '(-1,4]' },
        { test: 'y=(x-2)^2 on (-1,5)', exp: '(-1, 5)' },
        { test: 'y=4x on x!=4', exp: 'x!=4' },
        { test: '', exp: '' },
        { test: 'y=2x', exp: '' },
    ]

    for (let t of tests) {
        console.log(`${t.test} ==> expected: ${t.exp} ==> returns ${getInterval(t.test)}`);
    }

}

function isInterval_test() {

    let tests = [
        { test: '(2,5)', exp: true },
        { test: '(2,5]', exp: true },
        { test: '[2,5]', exp: true },
        { test: '(-2,3]', exp: true },
        { test: 'y=2x+5 (-2,3)', exp: false },
        { test: 'y=sin(x) (-1,pi)', exp: false },
        { test: '  (f(a),2a^2-b]', exp: true }
    ]

    for (let t of tests) {
        console.log(`${t.test} ==> expected: ${t.exp} ==> returns ${isInterval(t.test)}`);
    }

}

function removeInterval_test() {

    let tests = [
        { test: 'y=2x+5 on (2,5)', exp: 'y=2x+5' },
        { test: 'y=2x+5 on(-2,5)', exp: 'y=2x+5' },
        { test: 'y=2x+5on (1.8,-2.5)', exp: 'y=2x+5' },
        { test: 'y=2x+5on[2+4,-pi/2)', exp: 'y=2x+5' },
        { test: 'y=2x+5 on [2,f(2)]', exp: 'y=2x+5' },
        { test: 'y=2x+5 on (-oo,a+b)', exp: 'y=2x+5' },
        { test: 'r=sin(2t)on(0,2pi)', exp: 'r=2sin(2t)' },
        { test: '<t,2t>on (-1,4]', exp: '<t,2t>' },
        { test: '', exp: '' },
        { test: 'y=2x', exp: 'y=2x' },
    ]

    for (let t of tests) {
        console.log(`${t.test} ==> expected: ${t.exp} ==> returns ${removeInterval(t.test)}`);
    }

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


console.log('\n\n--------- getInterval_test ---------------\n');
getInterval_test()

console.log('\n\n--------- isInterval_test ---------------\n');
isInterval_test()

console.log('\n\n--------- removeInterval_test ---------------\n');
removeInterval_test()