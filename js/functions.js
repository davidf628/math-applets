
//import { evaluate } from 'mathjs';
import { E, PI } from './dmath.js';
import { removeSpaces } from './misc.js';

///////////////////////////////////////////////////////////////////////////////
//
// Exchanges constansts pi and e to numbers and eliminates instances of
//   implicit multiplication
//
///////////////////////////////////////////////////////////////////////////////

export function preprocessFunction (s) {

	// convert any instances of implicit multiplication to explicit form
	s = math.parse(s).toString({ implicit: 'show' });

	// convert any constants 'e' or 'pi' to numbers
	//s = Parser.parse(s).simplify({ e: E, pi: PI }).toString();
	s = math.simplify(s, { e: E, pi: PI }).toString();

	return s;
}



///////////////////////////////////////////////////////////////////////////////
//
// Checks to see if a function is implicitly defined by seeing if the math.js
//   parser can parse it. If not, then it is implicit, otherwise it is
//   explicit.
//
///////////////////////////////////////////////////////////////////////////////

export function isImplicitEquation(expression) {
	try {
		const node = math.parse(expression);
	} catch(err) {
		return true;
	}
	return false;
}

/**
 * Determines whether the given relation is in the form: y=f(x). This also
 * allows for functions where no 'y=' is specified, as long as the only
 * variable is 'x'
 * @param {string} relation - the mathematical relation to check
 * @returns {boolean} true if the relation is a function, false otherwise
 */
export function isFunction(relation) {
    let vars = getVariables(relation);
    if ((vars.length == 1 && vars[0] == 'x') || (vars.length == 0)) {
        return getFunctionName(relation) == 'y';
    }
    return false;
}

/**
 * Determines whether the given relation is in the form: x=g(y). 
 * @param {string} relation - the mathematical relation to check
 * @returns {boolean} true if the relation is a function, false otherwise
 */
export function isXFunction(relation) {
    let vars = getVariables(relation);
    if (vars.length == 1 && vars[0] == 'y') {
        return getFunctionName(relation) == 'x';
    }
    return false;
}

///////////////////////////////////////////////////////////////////////////////
//
// Converts an implicit equation to an explcit expression by finding the
//   equals sign in the equation, and negating all terms on the right-hand
//   side of the equation. Then the right and left sides are combined.
//
///////////////////////////////////////////////////////////////////////////////

export function convertImplicitEquation(expression) {

	var equalloc = expression.search('=');
	var LH = expression.substring(0, equalloc);
	var RH = expression.substring(equalloc + 1, expression.length);
	var newRH = '';

	if(RH.charAt(0) != '+') {
		RH = '+' + RH;
	}

	for(var i = 0; i < RH.length; i++) {
		if(RH[i] == '+') {
			newRH += '-';
		} else if(RH[i] == '-') {
			newRH += '+';
		} else {
			newRH += RH[i];
		}
	}

	return LH + newRH;

}

///////////////////////////////////////////////////////////////////////////////
//
// Removes the function name from an equation. This is assumed to be on the
//   left-hand side of the equation, and in explicit form.
//
///////////////////////////////////////////////////////////////////////////////

export function removeFunctionName(expression) {
	if(expression.search('=') != -1) {
		return expression.split('=')[1];
	} else {
		return expression;
	}
}

///////////////////////////////////////////////////////////////////////////////
//
// Determines the name of an explicitly defined function using the math.js
//   parser.
//
///////////////////////////////////////////////////////////////////////////////

export function getFunctionName(expression) {

	var fname = '';
	var node = math.parse(expression);
	node.traverse(
		function(node, path, parent) {
			if(node.type == 'AssignmentNode' || node.type == 'FunctionAssignmentNode') {
				fname = node.name;
			}
		}
	);

    // if no function name is found, then see if this is of the form f(x)
    if (fname == '') {
        let vars = getVariables(relation);
        if ((vars[0] == 'x' && vars.length == 1) || (vars.length == 0)) {
            fname = 'y';
        }
    }

	return fname;
}

///////////////////////////////////////////////////////////////////////////////
//
// Changes all the instances of the variable 'x' and replaces it with
//
///////////////////////////////////////////////////////////////////////////////

export function getVariables(expression) {

	// Gets a list of all variables within an expression - note that implicit multiplication doesn't work for two variables in a row
	// So sin(xy) != sin(x*y) as far as math.js is concerned

	let knownConstants = ['e', 'pi', 'i'];
	let knownFunctions = ['abs', 'cbrt', 'ceil', 'cube', 'exp', 'expm1', 'fix', 'floor', 'gcd', 'lcm', 'log', 'log10', 'log1p', 'log2',
		'norm', 'nthRoot', 'pow', 'round', 'sign', 'sqrt', 'square', 'factorial', 'gamma', 'combinations', 'factorial', 'permutations',
		'cumsum', 'mad', 'max', 'mean', 'median', 'min', 'mode', 'prod', 'std', 'sum', 'variance', 'acos', 'acosh', 'acot', 'acoth',
		'acsc', 'acsch', 'asec', 'asech', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'cos', 'cosh', 'cot', 'coth', 'csc', 'csch', 'sec',
		'sech', 'sin', 'sinh', 'tan', 'tanh'];
	var variables = [];
	var func = getFunctionName(expression);

	var node = math.parse(expression);

	node.traverse(
		function(node, path, parent) {
			if(node.type == 'SymbolNode') {
				if(node.name != func && !knownConstants.includes(node.name) && !knownFunctions.includes(node.name) && !variables.includes(node.name)) {
					variables.push(node.name);
				}
			}
		}
	);

	return variables;

}

export function makeJSFunction(board, s, variable) {

	variable = variable === undefined ? 'x' : variable;
	s = preprocessFunction(s);

	return board.jc.snippet(s, true, variable, false);
}