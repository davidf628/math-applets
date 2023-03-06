import { scalemap } from '../js/dmath.js';

function scalemap_test() {
    console.log(`\nscalemap(0, [0, 10], [0, 10]) should return 0 => output: ${scalemap(0, [0, 10], [0, 10])}`);
    console.log(`scalemap(4, [0, 10], [0, 10]) should return 4 => output: ${scalemap(4, [0, 10], [0, 10])}`);
    console.log(`scalemap(10, [0, 10], [0, 10]) should return 10 => output: ${scalemap(10, [0, 10], [0, 10])}`);
    console.log(`scalemap(-5, [0, 10], [0, 10]) should return -5 => output: ${scalemap(-5, [0, 10], [0, 10])}`);
    console.log(`scalemap(20, [0, 10], [0, 10]) should return 20 => output: ${scalemap(20, [0, 10], [0, 10])}`);

    console.log(`\nscalemap(6, [6, 25], [42, 93]) should return 42 => output: ${scalemap(6, [6, 25], [42, 93])}`);
    console.log(`scalemap(15, [6, 25], [42, 93]) should return 66.158 => output: ${scalemap(15, [6, 25], [42, 93])}`);
    console.log(`scalemap(25, [6, 25], [42, 93]) should return 93 => output: ${scalemap(25, [6, 25], [42, 93])}`);
    console.log(`scalemap(0, [6, 25], [42, 93]) should return 25.895 => output: ${scalemap(0, [6, 25], [42, 93])}`);
    console.log(`scalemap(2, [6, 25], [42, 93]) should return 31.263 => output: ${scalemap(2, [6, 25], [42, 93])}`);
    console.log(`scalemap(35, [6, 25], [42, 93]) should return 119.84 => output: ${scalemap(35, [6, 25], [42, 93])}`);

    console.log(`\nscalemap(300, [100, 500], [10, 350]) should return 180 => output: ${scalemap(300, [100, 500], [10, 350])}`);

    console.log(`\nscalemap(15, [15, 80], [-10, 10]) should return -10 => output: ${scalemap(15, [15, 80], [-10, 10])}`);
    console.log(`scalemap(80, [15, 80], [-10, 10]) should return 10 => output: ${scalemap(80, [15, 80], [-10, 10])}`);
    console.log(`scalemap(47.5, [15, 80], [-10, 10]) should return 0 => output: ${scalemap(47.5, [15, 80], [-10, 10])}`);
    console.log(`scalemap(31.25, [15, 80], [-10, 10]) should return -5 => output: ${scalemap(31.25, [15, 80], [-10, 10])}`);
    console.log(`scalemap(63.75, [15, 80], [-10, 10]) should return 5 => output: ${scalemap(63.75, [15, 80], [-10, 10])}`);

    console.log(`\nscalemap(-16, [-16, 80], [-25, -8]) should return -25 => output: ${scalemap(-16, [-16, 80], [-25, -8])}`);
    console.log(`scalemap(80, [-16, 80], [-25, -8]) should return -8 => output: ${scalemap(80, [-16, 80], [-25, -8])}`);
    console.log(`scalemap(10, [-16, 80], [-25, -8]) should return -20.395 => output: ${scalemap(10, [-16, 80], [-25, -8])}`);
    console.log(`scalemap(-32, [-16, 80], [-25, -8]) should return -27.833 => output: ${scalemap(-32, [-16, 80], [-25, -8])}`);
    console.log(`scalemap(160, [-16, 80], [-25, -8]) should return -6.167 => output: ${scalemap(160, [-16, 80], [-25, -8])}`);

    console.log(`\nscalemap(0, [0, 10], [10, 0]) should return 10 => output: ${scalemap(0, [0, 10], [10, 0])}`);
    console.log(`scalemap(10, [0, 10], [10, 0]) should return 0 => output: ${scalemap(10, [0, 10], [10, 0])}`);
    console.log(`scalemap(5, [0, 10], [10, 0]) should return 5 => output: ${scalemap(5, [0, 10], [10, 0])}`);
    console.log(`scalemap(2, [0, 10], [10, 0]) should return 8 => output: ${scalemap(2, [0, 10], [10, 0])}`);
    console.log(`scalemap(12, [0, 10], [10, 0]) should return -2 => output: ${scalemap(12, [0, 10], [10, 0])}`);
}

scalemap_test()