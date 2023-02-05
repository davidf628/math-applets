///////////////////////////////////////////////////////////////////
//
// Displays the value of a function using a little more
//    logic than the default printing operation.
//
// Leading and trailing zeros are ommitted.
//
////////////////////////////////////////////////////////////////////

export function displayNumber(val) {
	if(Math.abs(val) < 0.00000000000001) {
		return "0";
	}
	if(Math.abs(val) < 0.00001) {
		return val.toExponential(3);
	} else {
		if(typeof(val) !== 'undefined') {
			s = val.toFixed(4);
			if(s.includes('.')) {
				while(s.slice(-1) == '0') {
					s = s.substring(0, s.length - 1);
				}
				if(s.slice(-1) == '.') {
					s = s.substring(0, s.length - 1);
				}
			}
			if(s.includes('e')) {
				s = s.substring(0, 4) + s.substring(s.indexOf('e'),s.length);
			}
			return s;
		}
	}
	return '';
}

///////////////////////////////////////////////////////////////////
//
// double-values often have junk at the end, this function attempts
// to remove that junk so that calculations are a little more
// accurate.
//
////////////////////////////////////////////////////////////////////

export function trimNumber(val) {

	// Make each number accurate to 12 decimal places - this also
	// has the effect of rounding numbers like 1.99999999999 to 2

	var s = val.toFixed(12);

	if(s.includes('.')) {

		// Remove any trailing zeros

		while(s.slice(-1) == '0') {
			s = s.substring(0, s.length - 1);
		}

		// If so many trailing zeros are removed that you
		// end up at a decimal, then this is an integer and
		// remove the decimal to make it so

		if(s.slice(-1) == '.') {
			s = s.substring(0, s.length - 1);
		}
	}

	return s;
}

///////////////////////////////////////////////////////////////////////////////
//
//  Displays the value of a number to a fixed number of decimal places, if
//    necessary.
//
///////////////////////////////////////////////////////////////////////////////

export function formatNumber(val, dec) {
	s = val.toFixed(dec);
	if(s.includes('.')) {
		while(s.slice(-1) == '0') {
			s = s.substring(0, s.length - 1);
		}
		if(s.slice(-1) == '.') {
			s = s.substring(0, s.length - 1);
		}
	}
	if(s.includes('e')) {
		s = s.substring(0, 4) + s.substring(s.indexOf('e'),s.length);
	}
	return s;
}


