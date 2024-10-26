import { isBetween, getInterval, isInterval, isPoint, removeInterval } from '../js/interval.js';
import chalk from 'chalk'; // https://github.com/chalk/chalk

function conduct_test(testval, expectedval, str) {
    if (testval === expectedval) {
        console.log(`${str} ==> expected: ${expectedval} ==> returns ${testval}`);
    } else {
        console.log(chalk.red(`${str} ==> expected: ${expectedval} ==> returns ${testval}`));
    }
}

function isBetween_test() {

    let tests = [
        { test: [2, 0, 10], exp: true },
        { test: [-4, 0, 10], exp: false },
        { test: [25, 0, 10], exp: false },
        { test: [10, 0, 10], exp: false },
        { test: [10, 0, 10, true], exp: true },
        { test: [2, 10, 0], exp: false },
        { test: [-8, -25, -5], exp: true },
    ]

    tests.forEach((t) => {
        conduct_test(isBetween(...t.test), t.exp, `isBetween(${t.test.join(',')})`);
    });

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

    tests.forEach((t) => {
        conduct_test(getInterval(t.test), t.exp, `getInterval(${t.test})`);
    });

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

    tests.forEach((t) => {
        conduct_test(isInterval(t.test), t.exp, `isInterval(${t.test})`);
    });

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

    tests.forEach((t) => { 
        conduct_test(removeInterval(t.test), t.exp, `removeInterval(${t.test})`);
    });

}

function isPoint_test() {

    let tests = [
        { test: '(2,5)', exp: true },
        { test: '(2,5]', exp: false },
        { test: '[2,5)', exp: false },
        { test: '[2,5]', exp: true },
        { test: '(-2,3]', exp: false },
        { test: 'y=2x+5 on (-2,3)', exp: false },
        { test: '(a,oo]', exp: false },
        { test: '(f(a),2a^2-b]', exp: false }
    ];

    tests.forEach((t) => { 
        conduct_test(isPoint(t.test), t.exp, `isPoint(${t.test})`);
     });

}


//console.log('\n\n--------- isBetween_test ---------------\n');
//isBetween_test()

console.log('\n\n--------- isPoint_test ---------------\n');
isPoint_test()

//console.log('\n\n--------- getInterval_test ---------------\n');
//getInterval_test()

//console.log('\n\n--------- isInterval_test ---------------\n');
//isInterval_test()

//console.log('\n\n--------- removeInterval_test ---------------\n');
//removeInterval_test()