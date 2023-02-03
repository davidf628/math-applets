function evalstr(expr, scope={}) {
	try {
		let v = math.evaluate(expr, scope);
		return isNaN(v) ? NaN : v;
	} catch (Error) {
		return Number.NaN;
	}
}

function evalf(f, parameters) {
	var expr = math.compile(f);
	return expr.eval(parameters);
}

///////////////////////////////////////////////////////////////
//
// Evaluates a function expressed as:
//    2*x - 5, ln(x - 4), etc.
// Note that there variable is always 'x' and it is assumed that
//    y = or f(x) = is ommitted from the start.
//
// This function allows intervals to be restricted using an
//    interval formatted as stated in [regex_interval]
//
// This function can also evaluate a piecewise defined function
//    if multiple functions are provided and separated by
//    semicolons
//
/////////////////////////////////////////////////////////////////

function evaluate(f, x, args) {

	if(args === undefined) {
		args = {};
	}

	if(x !== undefined) {

		var variable = args.variable ? args.variable : 'x';

		f = f.toLowerCase();

		// Make sure to ignore points and asymptotes
		if (f.includes(';') || isPoint(f) || isAsymptote(f)) {
			var newf = '';
			f_list = f.split(';');
			for(var i = 0; i < f_list.length; i++) {
				if (!isPoint(f_list[i]) && !isAsymptote(f_list[i])) {
					newf += f_list[i] + ';'
				}
			}
			f = newf.substring(0, newf.length - 1);
		}

		if(f.search(regex_hole) != -1) {
			var interval = getInterval(f);
			var xloc = getHoleValue(interval);
			if(x == xloc) {
				return NaN;
			}
			f = removeInterval(f);
		}

		// if f includes a restricted interval, handle that
		if(f.search(regex_interval) != -1) {

			x_on_interval = false;

			if(f.includes(';')) {
				f_list = f.split(';');
			} else {
				f_list = [f];
			}
			for (var i = 0; i < f_list.length; i++) {
				var loc = f_list[i].search(regex_interval);
				if(loc != -1) {
					interval = f_list[i].substring(loc, f_list[i].length);
					lowerbound = getLowerEndpoint(interval);
					upperbound = getUpperEndpoint(interval);
					var upperboundclosed = !upperBoundOpen(interval);
					var lowerboundclosed = !lowerBoundOpen(interval);
					if((x > lowerbound) && (x < upperbound)) {
						f = f_list[i].substring(0, loc);
						x_on_interval = true;
					}
					if((x == lowerbound) && lowerboundclosed) {
						f = f_list[i].substring(0, loc);
						x_on_interval = true;
					}
					if((x == upperbound) && upperboundclosed) {
						f = f_list[i].substring(0, loc);
						x_on_interval = true;
					}
				}
			}
			if(!x_on_interval) {
				//f = NaN;
				return NaN;
			}
		}

		// math.js doesn't support ln
		f = f.replace(/ln/g, "log");

		var expr = math.compile(f);
		var parameter = {};
		parameter[variable] = x;

		// math.js returns complex numbers for negative values of logs, etc. This
		// code below makes sure to only return real numbers
		try {
			var val = expr.eval(parameter); // An older version of mathjs used eval instead of evaluate
		} catch (TypeError) {
			var val = expr.evaluate(parameter);
		}
		if (typeof(val) == 'object') {
			return NaN;
		} else return parseFloat(val);
	} else {
	 	return parseFloat(evalstr(f));
 	}

}
