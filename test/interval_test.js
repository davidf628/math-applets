import { isBetween } from '../js/interval.js';

function isBetween_test() {
    console.log(`\nisbetween(2, 0, 10) expected: true => returns: ${isbetween(2, 0, 10)}`);
    console.log(`isBetween(,-4 0, 10) expected: false => returns: ${isBetween(-4, 0, 10)}`);
    console.log(`isBetween(25, 0, 10) expected: false => returns: ${isBetween(25, 0, 10)}`);
    console.log(`isBetween(10, 0, 10) expected: false => returns: ${isBetween(10, 0, 10)}`);

    console.log(`\nisBetween(10, 0, 10, true) expected: true => returns: ${isBetween(10, 0, 10, true)}`);

    console.log(`\nisBetween(2, 10, 0) expected: false => returns: ${isBetween(2, 10, 0)}`);
    console.log(`isBetween(-8, -25, -5) expected: true => returns: ${isBetween(-8, -25, -5)}`);
}

isBetween_test()