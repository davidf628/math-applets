import { evalstr } from './eval.js';
import { removeSpaces } from './misc.js';
import { NEGATIVE_INFINITY, POSITIVE_INFINITY } from './dmath.js';

// Pattern for a restricted interval:

const regex_math = '|[\\w\\+\\-\\*\\/^()]*';

// const regex_interval = '(\\(|\\[)\\s*' +                       // ( or [
// 			           '(-?\\d*\\.?\\d*|-inf(inity)?|-oo)' +   // -2, 1.8, -inf, -oo
// 			      	   ',\\s*' +                               // ,
// 				       '(-?\\d*\\.?\\d*|\\+?inf(inity)?|\\+?oo)\\s*' + // -2, 1.8, +inf, +oo
// 				       '(\\)|\\])';                            // ] or )

const regex_interval = 
    '(\\(|\\[)\\s*' +                         // ( or [
    '[\\w\\+\\-\\*\\/\\^\\(\\)\\.]*\\s*' +       // -2, 1.8, -inf, -oo, pi/2, etc.
    ',\\s*' +                                  // ,
    '[\\w\\+\\-\\*\\/\\^\\(\\)\\.]*\\s*' +      // "," then -2, 1.8, +inf, +oo, pi/4, etc. 
    '(\\)|\\])';                              // ] or )
                       

// Pattern for a hole in the graph:

const regex_hole = '[Xx]\\s*!=\\s*' +          // x !=
				   '(-?\\d*\\.?\\d*)';        // -2, 1.8, etc.

/******************************************************************************
 * A function can be defined such as: y = 2x-5 (-2,5] and the interval needs
 *  to be removed for graphing this function determines if an interval exists 
 *  and returns it if so, or a blank string if it does not
 * @param relation {string} The relation to check for an interval 
*/
export function getInterval(relation) {

	var interval = '';
	var intervalstart = 0;

	intervalstart = relation.search(regex_interval);
	if (intervalstart != -1) {
		interval = relation.substring(intervalstart, relation.length).trim();
	}

	intervalstart = relation.search(regex_hole);
	if (intervalstart != -1) {
		interval = relation.substring(intervalstart, relation.length).trim();
	}

	return interval;
}

export function removeInterval(relation) {

	var interval = '';
	var intervalstart = 0;

	intervalstart = relation.search(regex_interval);
	if (intervalstart != -1) {
		relation = relation.substring(0, intervalstart).trim();
	}

	intervalstart = relation.search(regex_hole);
	if (intervalstart != -1) {
		relation = relation.substring(0, intervalstart).trim();
	}

	return relation;
}

export function spliceInterval(relation) {
    let interval = getInterval(relation);
    let func = removeInterval(relation);
    return [func, interval];
}

///////////////////////////////////////////////////////////
//
// Gets the lower and bound of a interval expressed as:
//     (-2,5), (1.5, 10], (-inf,2), [2, infinity)
//
////////////////////////////////////////////////////////////

export function getLowerEndpoint(interval) {
    if (interval !== '') {
        interval = removeSpaces(interval);
        let l = interval.split(',');
        l[0] = l[0].substring(1, l[0].length);
        if(l[0].includes('inf') || l[0].includes('-oo')) {
            return NEGATIVE_INFINITY;
        } else {
            return evalstr(l[0]);
        }
    } else {
        return NEGATIVE_INFINITY;
    }
}

export function getUpperEndpoint(interval) {
	if (interval !== '') {
        interval = removeSpaces(interval);
        let l = interval.split(',');
        l[1] = l[1].substring(0, l[1].length - 1);
        if(l[1].includes('inf') || l[1].includes('oo')) {
            return POSITIVE_INFINITY;
        } else {
            return evalstr(l[1]);
        }
    } else {
        return POSITIVE_INFINITY;
    }
}

export function getEndpoints(interval) {
    let lower_val = getLowerEndpoint(interval);
    let upper_val = getUpperEndpoint(interval);
    return [lower_val, upper_val];
}

export function getHoleValue(interval) {
	return evalstr(interval.split('=')[1]);
}

/////////////////////////////////////////////////////////////////
//
// Determines whether an interval is open or closed on the
//   upper or lower limit.
//
/////////////////////////////////////////////////////////////////

export function lowerBoundOpen(interval) {
	return interval.includes('(');
}

export function upperBoundOpen(interval) {
	return interval.includes(')');
}

export function lowerBoundClosed(interval) {
	return interval.includes('[');
}

export function upperBoundClosed(interval) {
	return interval.includes(']');
}


/******************************************************************************
 * Determines if a relation given represents a point or not, which should be
 *  of the form (x, y)
 * @param relation {string} the relation to check
 * @todo rename this function: containsPoint(relation)
 */
export function isPoint(relation) {

/* 	let intervalstart = relation.search(regex_interval);
	if (intervalstart != -1) {
		let interval = relation.substring(intervalstart, relation.length).trim();
		let relation = relation.substring(0, intervalstart).trim();
	}

	return relation === ''; */
	return relation.search(regex_interval) != -1;

}

/******************************************************************************
 * Determines if a relation contains an asymptote restriction or not, which
 *  should be of the form x != 5
 * @param relation {string} The relation to check
 * @todo Rename this function containsAsymptote
 */
export function isAsymptote(relation) {

/*	let intervalstart = relation.search(regex_hole);
 	if (intervalstart != -1) {
		let interval = relation.substring(intervalstart, relation.length).trim();
		let relation = relation.substring(0, intervalstart).trim();
	} 

	return relation === ''; */
	return relation.search(regex_hole) != -1;

}

/******************************************************************************
 * Determines if a value exists between two values, assumes an open interval.
 *  However, an additional parameter can be supplied indicating if the
 *  interval is closed.
 * @param x {number} The value to test
 * @param lower {number} The lower bound of the interval
 * @param upper {number} The upper bound of the interval
 * @param closed {boolean} Set to true if you want the bounds included
 * @returns true if x is on the interval, and false otherwise
 */

export function isBetween(x, lower, upper, closed) {
    if (closed) {
        return (x >= lower) && (x <= upper);
    } else {
        return (x > lower) && (x < upper);
    }
}
