
/**
 * This library uses a type of object I created called a PlotObject, which is
 * an array of PlotPieces. A plot piece can consist of the following:
 *  + curve = {
 *      type: 'curve', 
 *      relation: {string}, 
 *      interval: {string},
 *      jsxobject: JSXGraph.Curve,
 *      lowerendpoint: JSXGraph.Point, 
 *      upperendpoint: JSXGraph.Point
 *    }, 
 *  + point = {
 *      type: 'point', 
 *      jsxobject: JSXGraph.Point,
 *      coords: {string}, 
 *      solid: {boolean}
 *    }
 * 
 * 
 * All of these applets use a standardized method of creating and evaluating
 * functions from strings. Here is an overview of the notation used:
 * 
 * Functions: (independent count: 1, dependent count: 1)
 * ---------
 *   - y = 2x-5  or f(x)=2x-5: both will be interpreted as a fuction of x and
 *       defined on the interval x in (-oo, oo)
 *   - x = 2y+5  or g(y) =3y+4: both will be interpreted as functions of y
 *       and defined on the interval y in (-oo, oo)
 *   - y = x^2 - 1 (-3, 8]: interpreted as a function of x defined on the 
 *       interval from x = -3 to x = 8
 *   Notes: oo can be used to represent infinity, and any variable names
 *    can be used as long as the independent and dependent variable are
 *    well defined
 * 
 * Parametric Equations: (independent count: 1, dependent count: 2)
 * --------------------
 *   - <2t, -8t-1> (-4, 3]: parametric equations where the parameter t
 *       is restricted from t = -4 to t = 3
 *   Notes: an interval for t must be supplied and neither endpoint
 *    can be infinity
 * 
 * Implicit Equations: (independent count: 2, dependent count: 1)
 * ------------------
 *   - x^2+xy^3=4
 *   Notes: restricted intervals are ignored
 * 
 * Points:
 * ------
 *   - (2, -4): a closed point to draw on the graph
 *   - [3, 6]: an open point to draw on a graph
 * 
 * Asymptotes:
 * ----------
 *   - x != 5: the location of a vertical asymptote
 * 
 * Sequential Plots:
 * ----------------
 *   - a=2n+1: a sequential graph plot
 * 
 * Piecewise Defined Functions:
 * ---------------------------
 *   - Piecewise defined functions can contain many of the above items
 *     collected together in curly braces
 *   - { (2,5); (-3, 1); (6,10) }: plots a set of points
 *   - { 1 / (x+1)^2; x!=-1 }: Graphs a rational with an asymptote
 *   - { 2x (-oo,4); x^2-1 [4, 5]; -x+4 (5,oo) }: piecewise defined function
 * 
 * 
 * All graphs can be drawn using solid or dashed lines, and a step interval
 * may be specified
 * 
 * A graph will consist of just a piece of a curve. However, the plot routine
 * can return an array of pieces of graphs, points, and asymptotes as an array.
 * 
 */

import { 
    isImplicitEquation, 
    getVariables, 
    getFunctionName,
    removeFunctionName,
} from './functions.js';

import {
    getEndpoints, spliceInterval, isPoint, isClosedPoint,
    isBetween, lowerBoundClosed, upperBoundClosed
} from './interval.js';

import {
    JSXGetBounds
} from './misc.js';

import { POSITIVE_INFINITY, NEGATIVE_INFINITY } from './dmath.js';

import { evalstr, replace_logarithms } from './eval.js';

// Dependencies:
//
//  - jsxgraph is required for any jsx functions
//  - math.js is required for evaluations and drawing graphs

// Useful constants
let dashsetting = 3;

/**
 * Goes through a PlotPieces array and finds a piece that is a curve, which
 * can then be updated and modified
 * @param {PlotPieces[]} plot_pieces 
 * @returns {PlotPiece} the plot piece found
 */
export function getPlotPiece(plot_pieces) {
    for(let piece of plot_pieces) {
        if(piece.type == 'curve') {
            return piece
        }
    }
}

export function getCurve(plot_piece) {
    for(let piece of plot_pieces) {
        if(piece.type == 'curve') {
            return piece.curve
        }
    }
}

/**
 * Plots a function, it can restrict to a specified interval and will draw open
 * and closed endpoints if they are needed.
 * @param board {JSXGraph.board} - JSXGraph board to draw the curve on
 * @param relation {string} - the function to draw, this can include a 
 *  restricted domain
 * @param args {object} - special arguments to affect the way the function 
 *  is drawn
 * @option {string or hex} color: the color of the curve
 * @option {string} interval: another way to specify a restricted interval
 * @option {float} width: the width of the curve
 * @option {string} variable: the variable used within the function
 * @option {boolean} dashed: whether or not to draw a dashed curve
 * @option {PlotPiece} piece: a wrapper for a JSX curve object, this contains
 *  the curve, and the possible endpoints of the curve
 * @returns {PlotPiece} a Plot Piece which contains the curve
 */
export function plot_function(board, relation, args) {

	if(args === undefined) {
		args = {};
	}

	let color = args.color ? args.color : 'blue';
	let interval = args.interval ? args.interval : '';
	let width = args.width ? args.width : 2;
	let variable = args.variable ? args.variable : 'x';
	let dashed = (args.dashed !== undefined) ? args.dashed : false;
    let plot_piece = args.piece ? args.piece : { type: 'curve' };
    let curve = args.piece ? 
        args.piece.jsxobject : 
        board.create('curve', [0,0], 0, 0, { visible: false });

    [relation, interval] = spliceInterval(relation);
    plot_piece.relation = relation;
    plot_piece.interval = interval;

    let bounds = JSXGetBounds(board);

	curve.setAttribute({ strokeWidth: width, strokeColor: color, highlight: false });
    curve.setAttribute({ dash: dashed ? dashsetting : 0 });

	// math.js does not support ln notation
	relation = replace_logarithms(relation);

    let expr = math.compile(relation);
    let parameter = {};
    parameter[variable] = 0;

    let [ start_x, end_x ] = getEndpoints(interval);

    // Plot an endpoint if the lower bound is restricted
    if (isBetween(start_x, bounds.xmin, bounds.xmax)) {
        parameter[variable] = start_x;
        let x_coord = start_x;
        let y_coord = expr.evaluate(parameter);
        let solid = lowerBoundClosed(interval);
        plot_piece.lowerendpoint = plot_endpoint(board, [x_coord, y_coord], 
            solid, color, plot_piece.lowerendpoint);
    } else if (plot_piece.lowerendpoint) {
        plot_piece.lowerendpoint.setAttribute({ visible: false });
    }

    // Plot an endpoint if the upper bound is restricted
    if (isBetween(end_x, bounds.xmin, bounds.xmax)) {
        parameter[variable] = end_x;
        let x_coord = end_x;
        let y_coord = expr.evaluate(parameter);
        let solid = upperBoundClosed(interval);
        plot_piece.upperendpoint = plot_endpoint(board, [x_coord, y_coord], 
            solid, color, plot_piece.upperendpoint);
    } else if (plot_piece.upperendpoint) {
        plot_piece.upperendpoint.setAttribute({ visible: false });
    }

    start_x = start_x == NEGATIVE_INFINITY ? bounds.xmin : start_x;
    end_x = end_x == POSITIVE_INFINITY ? bounds.xmax : end_x;
    
    curve.X = function(x) { return x; };
    curve.Y = function(x) { 
        if (isBetween(x, start_x, end_x)) {
            parameter[variable] = x;
            return expr.evaluate(parameter); 
        } else {
            return NaN;
        }
    };

    plot_piece.jsxobject = curve;

    curve.updateCurve();

    return plot_piece;
	
}

/**
 * Plots a function x=g(y), it can restrict to a specified interval and will 
 * draw open and closed endpoints if they are needed.
 * @param board {JSXGraph.board} - JSXGraph board to draw the curve on
 * @param relation {string} - the function to draw, this can include a 
 *  restricted domain
 * @param args {object} - special arguments to affect the way the function 
 *  is drawn
 * @option {string or hex} color: the color of the curve
 * @option {string} interval: another way to specify a restricted interval
 * @option {float} width: the width of the curve
 * @option {string} variable: the variable used within the function
 * @option {boolean} dashed: whether or not to draw a dashed curve
 * @option {PlotPiece} piece: a wrapper for a JSX curve object, this contains
 *  the curve, and the possible endpoints of the curve
 * @returns {PlotPiece} a Plot Piece which contains the curve
 */
export function plot_function(board, relation, args) {

	if(args === undefined) {
		args = {};
	}

	let color = args.color ? args.color : 'blue';
	let interval = args.interval ? args.interval : '';
	let width = args.width ? args.width : 2;
	let variable = args.variable ? args.variable : 'y';
	let dashed = (args.dashed !== undefined) ? args.dashed : false;
    let plot_piece = args.piece ? args.piece : { type: 'curve' };
    let curve = args.piece ? 
        args.piece.jsxobject : 
        board.create('curve', [0,0], 0, 0, { visible: false });

    [relation, interval] = spliceInterval(relation);
    plot_piece.relation = relation;
    plot_piece.interval = interval;

    let bounds = JSXGetBounds(board);

	curve.setAttribute({ strokeWidth: width, strokeColor: color, highlight: false });
    curve.setAttribute({ dash: dashed ? dashsetting : 0 });

	// math.js does not support ln notation
	relation = replace_logarithms(relation);

    let expr = math.compile(relation);
    let parameter = {};
    parameter[variable] = 0;

    let [ start_y, end_y ] = getEndpoints(interval);

    // Plot an endpoint if the lower bound is restricted
    if (isBetween(start_y, bounds.ymin, bounds.ymax)) {
        parameter[variable] = start_y;
        let y_coord = start_y;
        let x_coord = expr.evaluate(parameter);
        let solid = lowerBoundClosed(interval);
        plot_piece.lowerendpoint = plot_endpoint(board, [x_coord, y_coord], 
            solid, color, plot_piece.lowerendpoint);
    } else if (plot_piece.lowerendpoint) {
        plot_piece.lowerendpoint.setAttribute({ visible: false });
    }

    // Plot an endpoint if the upper bound is restricted
    if (isBetween(end_y, bounds.ymin, bounds.ymax)) {
        parameter[variable] = end_y;
        let y_coord = end_y;
        let x_coord = expr.evaluate(parameter);
        let solid = upperBoundClosed(interval);
        plot_piece.upperendpoint = plot_endpoint(board, [x_coord, y_coord], 
            solid, color, plot_piece.upperendpoint);
    } else if (plot_piece.upperendpoint) {
        plot_piece.upperendpoint.setAttribute({ visible: false });
    }

    start_y = start_y == NEGATIVE_INFINITY ? bounds.ymin : start_y;
    end_y = end_y == POSITIVE_INFINITY ? bounds.ymax : end_y;
    
    curve.Y = function(y) { return y; };
    curve.X = function(y) { 
        if (isBetween(y, start_y, end_y)) {
            parameter[variable] = y;
            return expr.evaluate(parameter); 
        } else {
            return NaN;
        }
    };

    plot_piece.jsxobject = curve;

    curve.updateCurve();

    return plot_piece;
	
}

export function plot_point(board, coords, args) {

	if(args === undefined) {
		args = {};
	}

	let color = args.color ? args.color : 'blue';
	let size = args.size ? args.size : 2;
	let solid = (args.solid !== undefined) ? args.solid : true;
    let plot_piece = args.piece ? args.piece : { type: 'point' };
    let point = args.piece ? 
        args.piece.jsxobject : 
        board.create('point', [0,0], { visible: false });

	point.setAttribute({ size: size, strokeColor: color, highlight: false });
    point.setAttribute({ fillColor: solid ? color : 'white' });
    point.moveTo(coords);
    point.setAttribute({ visible: true });

    plot_piece.jsxobject = point;
    plot_piece.coords = coords;
    plot_piece.solid = solid;

    return plot_piece;
	
}

/**
 * Draws either an open or closed circle at the endpoint of a curve. 
 * @param {JSXGraph.Board} board - the JSXGraph drawing board to plot
 *   the point on
 * @param {float[]} coords - the coordinates to plot the endpoint in the 
 *   form: (a, b)
 * @param {boolean} solid - whether to plot with an open circle or a closed
 *   circle
 * @param {string or hex} color - the color to draw the point
 * @param {JSXGraph.Point} point - a reference to a JSXGraph point, if this is
 *   null a new point will be created, otherwise it will update the coordinates
 *   of the point it is displaying
 * @returns {JSXGraph.Point} a reference to the point drawn
 */
export function plot_endpoint(board, coords, solid, color, point) {
    if (!point) {
        point = board.create('point', [0,0], { 
            withLabel: false,
            fixed: true,
            visible: false,
            highlight: false,
        });
    }
    point.moveTo(coords);
    point.setAttribute({
        strokeColor: color,
        fillColor: solid ? color : 'white',
        visible: true,
    });
    return point;
}

///////////////////////////////////////////////////////////////////////////////
//
// Plots a polar function, it requires a start and endpoint value for theta.
//
// Returns the plotted curve.
//
///////////////////////////////////////////////////////////////////////////////

export function plot_polar(curve, expression, tmin, tmax, args) {

	var color = args.color ? args.color : 'blue';
	var density = args.density ? args.density : 0.01;
	var width = args.width ? args.width : 2;
	var dashed = (args.dashed !== undefined) ? args.dashed : false;

	if(dashed) {
		curve.setAttribute({ dash: dashsetting });
	} else {
		curve.setAttribute({ dash: 0 });
	}

	// This is an explicit polar function of the form: r(t)
	if(expression != '') {

		var expr = math.compile(expression);

		var tValues = math.range(tmin, tmax + density, density).toArray();
		var rValues = tValues.map(
				function(x) {
					return expr.eval({t: x});
				});

		curve.dataX = [];
		curve.dataY = [];

		for(var i = 0; i < tValues.length; i++) {

			curve.dataX[i] = rValues[i] * Math.cos(tValues[i]);
			curve.dataY[i] = rValues[i] * Math.sin(tValues[i]);

		}

		curve.updateParametricCurve();
	}

}

///////////////////////////////////////////////////////////////////////////////
//
// Plots a parametric curve, it requires a start and endpoint value for t.
//
// Returns the plotted curve.
//
///////////////////////////////////////////////////////////////////////////////

export function plot_parametric(curve, x_t, y_t, tmin, tmax, args) {

	if(args === undefined) {
		args = {};
	}

	var color = args.color ? args.color : 'blue';
	var density = args.density ? args.density : 0.01;
	var interval = args.interval ? args.interval : '';
	var variable = args.variable ? args.variable : 't';
	var width = args.width ? args.width : 2;
	var lowerendpoint = args.lowerendpoint ? args.lowerendpoint : -1;
	var upperendpoint = args.upperendpoint ? args.upperendpoint : -1;
	var hole = args.hole ? args.hole : -1;
	var dashed = (args.dashed !== undefined) ? args.dashed : false;

	curve.setAttribute({ strokeColor: color, strokeWidth: width });
	if(dashed) {
		curve.setAttribute({ dash: dashsetting });
	} else {
		curve.setAttribute({ dash: 0 });
	}

	if(hole != -1) {
		hole.setAttribute({ visible: false });
	}

	if(lowerendpoint != -1) {
		lowerendpoint.setAttribute({ visible: false });
	}

	if(upperendpoint != -1) {
		upperendpoint.setAttribute({ visible: false });
	}

	if(x_t == '') {
		x_t = args.variable;
	} else if(y_t == '') {
		y_t = args.variable;
	}

	var xFunc = math.compile(x_t);
	var yFunc = math.compile(y_t);

	var evalX = function(x) {
					var parameter = {};
					parameter[variable] = x;
					return xFunc.eval(parameter);
				};

	var evalY = function(x) {
					var parameter = {};
					parameter[variable] = x;
					return yFunc.eval(parameter);
				};

	if(interval != '') {

		// See if there is a hole in the graph
		if(interval.search(regex_hole) != -1) {

			hole_val = parseFloat(interval.split('=')[1]);
			hole.moveTo([evalX(hole_val), evalY(hole_val)]);
			hole.setAttribute( { visible: true, strokeColor: color, fillColor: 'white' });

		}

		// See if a restricted interval was defined
		if(interval.search(regex_interval) != -1) {

			restricted_interval = true;

			var lowerval = getLowerEndpoint(interval);
			var upperval = getUpperEndpoint(interval);

			if(lowerval != NEGATIVE_INFINITY) {

				tmin = lowerval;
				lowerendpoint.moveTo([evalX(lowerval), evalY(lowerval)]);
				lowerendpoint.setAttribute({ strokeColor: color, visible: true });
				if(lowerBoundOpen(interval)) {
					lowerendpoint.setAttribute({ fillColor: 'white' });
				} else {
					lowerendpoint.setAttribute({ fillColor: color });
				}
			}

			if(upperval != POSITIVE_INFINITY) {

				tmax = upperval;
				upperendpoint.moveTo([evalX(upperval), evalY(upperval)]);
				upperendpoint.setAttribute({ strokeColor: color, visible: true });
				if(upperBoundOpen(interval)) {
					upperendpoint.setAttribute({ fillColor: 'white' });
				} else {
					upperendpoint.setAttribute({ fillColor: color });
				}
			}

		}
	} // if(interval != '')

	if(!(x_t == '' && y_t == '')) {

		var tValues = math.range(tmin, tmax + density, density).toArray();

		curve.dataX = tValues.map(
				function(x) {
					var parameter = {};
					parameter[variable] = x;
					return xFunc.evaluate(parameter);
				});

		curve.dataY = tValues.map(
				function(x) {
					var parameter = {};
					parameter[variable] = x;
					return yFunc.evaluate(parameter);
				});

		curve.updateCurve();

	}

}


/**
 * Plots a relation in two dimensions. The format of the input is expected to
 *    be one of the following formats:
 *
 *          y = f(x), or just f(x) - for standard rectangular functions
 *          r = f(t) - for polar equations
 *          < x(t), y(t) > - for parametric equations
 *          x = g(y) - for rectangular equations rotated by 90 degrees
 *          implicity defined functions such as x^2 + y^2 = 4
 *          (x,y) or [x,y] - for plotting a point, either closed or open
 *          a = f(n) - for plotting just the points along a curve
 * 
 *    Rectangular functions can be plotted on a restricted interval
 *
 *    Polar and parametric equations must have an interval of t provided to
 *        plot over
 *
 *    If no equals sign is provided, it is assumed that the function is a
 *        rectangular function of x.
 * 
 * @param {JSXGraph.board} board - the JSXGraph board to draw the function on
 * @param {string} relation - a string containing the function to draw
 * @param {object} args - an object containing one or more arguments to define
 *    how the curve is drawn. Possiblities are:
 *      color (string) - the color of the curve
 *	    interval (string) - a restriction on the independent variable for 
 *         drawing the curve such as (-4,5]. Open and closed circles are drawn
 *	    density (float) - the step interval to pick new points
 *	    width (float) - the width of the curve
 *      size (float) - the size of the point to draw
 *	    variable (string) - the dependent variable
 *	    dashed (boolean) - whether the curve should be dashed or solid
 * 
 * @returns - a reference to the curve drawn
 */

export function plot(board, relation, args) {

    args = args ? args : {};

    let color = args.color ? args.color : 'blue';

	relation = relation.toLowerCase();
    relation = removeSpaces(relation);

    // remove any previously plotted graph from the board
    if (args.pieces) {
        for(let piece of args.pieces) {
            board.remove(piece.jsxobject)
        }
    }

    // remove curly braces indicating a piecewise function
    relation = relation.search('{') != -1 ? relation.substring(1) : relation;
    relation = relation.search('}') != -1 ? relation.substring(0, -1) : relation;

    let plot_pieces = [];

    let relations = relation.split(";");

    for (let relation of relations) {

        if (isPoint(relation)) {

            // The relation is of the form (x,y) or [x,y]
            let [x, y] = getEndpoints(relation);
            let piece = plot_point(board, [x, y], { color: color, solid: isClosedPoint(relation) });
            plot_pieces.push(piece);
            continue;

        } 
        
        if (isAsymptote(relation)) {
            // do whatever
            continue;
        }

        // Check to see if a restricted interval is supplied and retrieve it
        let [relation, interval] = spliceInterval(relation);

        // math.js does not support ln notation for natural logarithm
        relation = replace_logarithms(relation);

        if (isConstantFunction(relation)) {
            if(vars.length == 0) {

                // Plot: horizontal line
                if(fname == 'y') {
                    args.density = 1;
                    curve = plot_function(board, relation, args);
                }

                // Plot vertical line
                if(fname == 'x') {
                    args.variable = 't';
                    args.density = 1;
                    var bounds = Bounds(board);
                    var tmin = bounds.ymin;
                    var tmax = bounds.ymax;
                    plot_parametric(curve, relation, 't', tmin, tmax, args);
                }

                // Plot is a circle
                if(fname == 'r') {
                    args.variable = 't';
                    var interval = args.interval ? args.interval : '';
                    var tmin = 0;
                    var tmax = 2 * PI;
                    if (interval != '') {
                        var lval = getLowerEndpoint(interval);
                        tmin = lval == NEGATIVE_INFINITY ? -12 * PI : lval;
                        var uval = getUpperEndpoint(interval);
                        tmax = uval == POSITIVE_INFINITY ? 12 * PI : uval;
                    }

                    plot_polar(curve, relation, tmin, tmax, args);
                }
            }
            continue;
        }

        if (isFunction(relation)) {
            // rectangular y = f(x)
            args.interval = interval;
            let piece = plot_function(board, relation, args);
            plot_pieces.push(piece);
            continue;
        }

        if (isXFunction(relation)) {
            // rectangular x = g(y)
            args.variable = vars[0];
            args.interval = interval;
            let piece = plot_parametric(board, relation, args);
            plot_pieces.push(piece);
            continue;
        }

        if (isParametricFuncion(relation)) {
            if(vars[0] == 't' && vars.length == 1) {
                // Parametrically defined functions

                var interval = args.interval ? args.interval : '';
                var bounds = JSXGetBounds(board);
                var tmin = bounds.xmin < bounds.ymin ? bounds.xmin : bounds.ymin;
                var tmax = bounds.xmax > bounds.ymax ? bounds.xmax : bounds.ymax;
                if (interval != '') {
                    var lval = getLowerEndpoint(interval);
                    tmin = lval == NEGATIVE_INFINITY ? tmin : lval;
                    var uval = getUpperEndpoint(interval);
                    tmax = uval == POSITIVE_INFINITY ? tmax : uval;
                }
                relation = removeSpaces(relation);
                var cloc = relation.search(',');

                var x_t = removeSpaces(relation.substring(1, cloc));
                var y_t = removeSpaces(relation.substring(cloc + 1, relation.length - 1));

                plot_parametric(curve, x_t, y_t, tmin, tmax, args);
            }
            continue;
        }

        if (isPolarFunction(relation)) {
            if(fname == 'r' && vars[0] == 't') {

                // Polar Graph
                var interval = args.interval ? args.interval : '';
                var tmin = 0;
                var tmax = 2 * PI;
                if (interval != '') {
                    var lval = getLowerEndpoint(interval);
                    tmin = lval == NEGATIVE_INFINITY ? -12 * PI : lval;
                    var uval = getUpperEndpoint(interval);
                    tmax = uval == POSITIVE_INFINITY ? 12 * PI : uval;
                }

                plot_polar(curve, relation, tmin, tmax, args);

            }
            continue;
        }

        if (isSequence(relation)) {
            // do whatever
            continue;
        }

        if (isImplicitEquation(relation)) {
            relation = convertImplicitEquation(relation);
            implicit_plot(relation, args);
            continue;
        }

        
    }

    return plot_pieces;

}


///////////////////////////////////////////////////////////////////////////////
//
// Draws the plot of a function implicity, however, very slowly. Uses the
//   marching squares algorithm and plots using multiple segments. There's
//   probably a way of speeding the algorithm up, but for right now this at
//   least works :)
//
// It currently doesn't allow for erasing and redrawing when the window is
//   resized, so that would be the next thing to work on
//
// TODO: Allow for removal of curve when window resized
//
///////////////////////////////////////////////////////////////////////////////

export function implicit_plot(relation, args) {

	if(args === undefined) {
		args = {};
	}

	board.suspendUpdate();

	var color = args.color ? args.color : 'red';
	var density = args.density ? args.density : 0.1;

	var bounds = JSXGetBounds(board);

	var nVertPoints = (bounds.ymax - bounds.ymin) / density;
	var nHorizPoints = (bounds.xmax - bounds.xmin) / density;

	var nVertCells = nVertPoints - 1;
	var nHorizCells = nHorizPoints - 1;

	var expr = math.compile(relation);

	var segmentparams = { color: color, fixed: true, highlight: false };

	for(var x = bounds.xmin; x <= bounds.xmax - density; x += density) {
		for(var y = bounds.ymin+density; y <= bounds.ymax; y += density) {
			var nw = expr.eval({x: x, y: y});
			var ne = expr.eval({x: x + density, y: y});
			var se = expr.eval({x: x + density, y: y - density});
			var sw = expr.eval({x: x, y: y - density});

			var total = 0;
			if(nw > 0) total += 8;
			if(ne > 0) total += 4;
			if(se > 0) total += 2;
			if(sw > 0) total += 1;

			var bottomInterp = -sw / (se - sw) * density;
			var topInterp    = -nw / (ne - nw) * density;
			var leftInterp   = -nw / (sw - nw) * density;
			var rightInterp	 = -ne / (se - ne) * density;

			switch (total) {
				case 0:
					break;
				case 1:
					board.create('segment', [[x, y - leftInterp], [x + bottomInterp, y - density]], segmentparams);
					break;
				case 2:
					board.create('segment', [[x + bottomInterp, y - density], [x + density, y - rightInterp]], segmentparams);
					break;
				case 3:
					board.create('segment', [[x, y - leftInterp], [x + density, y - rightInterp]], segmentparams);
					break;
				case 4:
					board.create('segment', [[x + topInterp, y], [x + density, y - rightInterp]], segmentparams);
					break;
				case 5:
					board.create('segment', [[x, y - leftInterp], [x + topInterp, y]], segmentparams);
					board.create('segment', [[x + bottomInterp, y - density], [x + density, y - rightInterp]], segmentparams);
					break;
				case 6:
					board.create('segment', [[x + topInterp, y], [x + bottomInterp, y - density]], segmentparams);
					break;
				case 7:
					board.create('segment', [[x, y - leftInterp], [x + topInterp, y]], segmentparams);
					break;
				case 8:
					board.create('segment', [[x, y - leftInterp], [x + topInterp, y]], segmentparams);
					break;
				case 9:
					board.create('segment', [[x + topInterp, y], [x + bottomInterp, y - density]], segmentparams);
					break;
				case 10:
					board.create('segment', [[x + topInterp, y], [x + density, y - rightInterp]], segmentparams);
					board.create('segment', [[x, y - leftInterp], [x + bottomInterp, y - density]], segmentparams);
					break;
				case 11:
					board.create('segment', [[x + topInterp, y], [x + density, y - rightInterp]], segmentparams);
					break;
				case 12:
					board.create('segment', [[x, y - leftInterp], [x + density, y - rightInterp]], segmentparams);
					break;
				case 13:
					board.create('segment', [[x + bottomInterp, y - density], [x + density, y - rightInterp]], segmentparams);
					break;
				case 14:
					board.create('segment', [[x, y - leftInterp], [x + bottomInterp, y - density]], segmentparams);
					break;
				case 15:
					break;
			}

		}

	}

	board.unsuspendUpdate();
}