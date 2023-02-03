
// Pattern for a restricted interval:

regex_math = '|[\\w\\+\\-\\*\\/^()]*';

regex_interval = '(\\(|\\[)\\s*' +                       // ( or [
				 '(-?\\d*\\.?\\d*|-inf(inity)?|-oo)' +   // -2, 1.8, -inf, -oo
				 ',\\s*' +                               // ,
				 '(-?\\d*\\.?\\d*|\\+?inf(inity)?|\\+?oo)\\s*' + // -2, 1.8, +inf, +oo
				 '(\\)|\\])';                            // ] or )

// Pattern for a hole in the graph:

	regex_hole = '[Xx]\\s*!=\\s*' +          // x !=
				 '(-?\\d*\\.?\\d*)';        // -2, 1.8, etc.

///////////////////////////////////////////////////////////
//
// A function can be defined such as: y = 2x-5 (-2,5]
//   and the interval needs to be removed for graphing
//   this function determines if an interval exists and
//   returns it if so, or a blank string if it does not
//
////////////////////////////////////////////////////////////

function getInterval(relation) {

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

function removeInterval(relation) {

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

///////////////////////////////////////////////////////////
//
// Gets the lower and bound of a interval expressed as:
//     (-2,5), (1.5, 10], (-inf,2), [2, infinity)
//
////////////////////////////////////////////////////////////

function getLowerEndpoint(interval) {
	interval = removeSpaces(interval);
	l = interval.split(',');
	l[0] = l[0].substring(1, l[0].length);
	if(l[0].includes('inf') || l[0].includes('-oo')) {
		return NEGATIVE_INFINITY;
	} else {
		return evalstr(l[0]);
	}
}

function getUpperEndpoint(interval) {
	interval = removeSpaces(interval);
	l = interval.split(',');
	l[1] = l[1].substring(0, l[1].length - 1);
	if(l[1].includes('inf') || l[1].includes('oo')) {
		return POSITIVE_INFINITY;
	} else {
		return evalstr(l[1]);
	}
}

function getHoleValue(interval) {
	return evalstr(interval.split('=')[1]);
}

/////////////////////////////////////////////////////////////////
//
// Determines whether an interval is open or closed on the
//   upper or lower limit.
//
/////////////////////////////////////////////////////////////////

function lowerBoundOpen(interval) {
	return interval.includes('(');
}

function upperBoundOpen(interval) {
	return interval.includes(')');
}

function lowerBoundClosed(interval) {
	return interval.includes('[');
}

function upperBoundClosed(interval) {
	return interval.includes(']');
}

///////////////////////////////////////////////////////////////
//
//
/////////////////////////////////////////////////////////////////

function isPoint(relation) {

	intervalstart = relation.search(regex_interval);
	if (intervalstart != -1) {
		interval = relation.substring(intervalstart, relation.length).trim();
		relation = relation.substring(0, intervalstart).trim();
	}

	return relation == '';

}

function isAsymptote(relation) {

	intervalstart = relation.search(regex_hole);
	if (intervalstart != -1) {
		interval = relation.substring(intervalstart, relation.length).trim();
		relation = relation.substring(0, intervalstart).trim();
	}

	return relation == '';

}


