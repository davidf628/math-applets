
/**
 * This library uses a type of object I created called a PlotObject, which is
 * an array of PlotPieces. A plot piece can consist of the following:
 *  + curve = {
 *      type: 'curve', relation: {string}, interval: {string},
 *      lowerendpoint: JSXGraph.Point, upperendpoint: JSXGraph.Point
 *    }, 
 *  + point = {
 *      type: 'point', coords: {string}, solid: {boolean}
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
 *   - x != {5, -1, 0}: the location of many vertical asymptotes
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
    getEndpoints,
    spliceInterval,
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
 */
export function getPlot(plot_pieces) {
    for(piece of plot_pieces) {
        if(piece.type == 'curve') {
            return piece.curve
        }
    }
}

/**
 * Plots a function, it can restrict to a specified interval but if open/closed
 * endpoints are needed they must be created elsewhere.
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
 * @option {JSXGraph.Curve} curve: a JSX curve object, this is used when the 
 *  curve needs an ability to be updated
 * @returns {PlotPieces[]} a reference to the created JSX curve
 */
export function plot_function2(board, relation, args) {

    let plot_piece = {
        type: 'curve',
    };

	if(args === undefined) {
		args = {};
	}

	let color = args.color ? args.color : 'blue';
	let interval = args.interval ? args.interval : '';
	let width = args.width ? args.width : 2;
	let variable = args.variable ? args.variable : 'x';
	let dashed = (args.dashed !== undefined) ? args.dashed : false;
    let curve = args.curve ? args.curve : board.create('curve', [0,0], 0, 0, { visible: false });

    [relation, interval] = spliceInterval(relation);
    plot_piece.relation = relation;
    plot_piece.interval = interval;

    let bounds = JSXGetBounds(board);

	curve.setAttribute({ strokeWidth: width, strokeColor: color });
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

    plot_piece.curve = curve;

    /*

     - The following code draws the function using mathjs as the main
       computation engine. It is very efficient, but JSX seems to have
       a better underlying algorithm for drawing functions

    // This is an explicit function of the form: f(x)
    curve.dataX = math.range(start_x, end_x + density, density).toArray();
    curve.dataY = curve.dataX.map(
        function(x) {
            var parameter = {};
            parameter[variable] = x;
            return expr.evaluate(parameter);
        }
    );

    // If the curve shoots off to infinity, this will prevent the curve from
    // drawing an "asymptote" at that value

    for(var i = 0; i < curve.dataY.length; i++) {
        if(curve.dataY[i] > (2 * bounds.ymax)) {
            curve.dataY[i] = NaN;
        } else if(curve.dataY[i] < (2 * bounds.ymin)) {
            curve.dataY[i] = NaN;
        }
    }
    */

    curve.updateCurve();

    return [ plot_piece ] ;
	
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
        point = board.create('point', [0,0], { visible: false });
    }
    point.moveTo(coords);
    point.setAttribute({
        strokeColor: color,
        fillColor: solid ? color : 'white',
        visible: true
    });
}

/**
 * Plots a function, it can restrict to a specified interval but if open/closed
 * endpoints are needed they must be created elsewhere.
 * @param {JSXGraph.board} board 
 * @param {string} relation 
 * @param {object} args 
 */

export function plot_function(board, relation, args) {

	if(args === undefined) {
		args = {};
	}

	var color = args.color ? args.color : 'blue';
	var interval = args.interval ? args.interval : '';
	var density = args.density ? args.density : 0.01;
	var width = args.width ? args.width : 2;
	var lowerendpoint = args.lowerendpoint ? args.lowerendpoint : -1;
	var upperendpoint = args.upperendpoint ? args.upperendpoint : -1;
	var hole = args.hole ? args.hole : -1;
	var yMax = args.yMax ? args.yMax : 10;
	var yMin = args.yMin ? args.yMin : -10;
	var yScl = args.yScl ? args.yScl : 1;
	var variable = args.variable ? args.variable : 'x';
	var dashed = (args.dashed !== undefined) ? args.dashed : false;

	var restricted_interval = false;

    curve = board.create('curve', [0, 0], 0, 0, { visible: false });

	curve.setAttribute({ strokeWidth: width, strokeColor: color });
	if(dashed) {
		curve.setAttribute({ dash: dashsetting });
	} else {
		curve.setAttribute({ dash: 0 });
	}

	// math.js does not support ln notation
	relation = replace_logarithms(relation.replace);

	// If the relation is blank but not the interval then we just
	// need to plot a single point or an asymptote

	if (relation.trim() == '' && interval != '') {

		// Draw a point, but find out if it is open or closed
		if (interval.search(regex_interval) != -1) {

			var x = evalstr(getLowerEndpoint(interval));
			var y = evalstr(getUpperEndpoint(interval));
			var closed = upperBoundClosed(interval) || upperBoundClosed(interval);

			lowerendpoint.moveTo([x, y]);

			lowerendpoint.setAttribute({ strokeColor: color, visible: true });
			if (closed) {
				lowerendpoint.setAttribute({ fillColor: color });
			} else {
				lowerendpoint.setAttribute({ fillColor: 'white' });
			}

		}

		// Draw an asymptote
		if (interval.search(regex_hole) != -1) {

			var xloc = getHoleValue(interval);

			curve.dataX = [xloc, xloc];

			// TODO:
			// This -2000 and +2000 just need to be the lower and upper portion
			// of the viewing window, but I don't know how to access it without
			// referencing the board variable

			curve.dataY = [-2000, 2000];

			curve.setAttribute( { dash: dashsetting } );

			curve.updateParametricCurve();

		}

	} else {
		if(hole != -1) {
			hole.setAttribute({ visible: false });
		}

		if(lowerendpoint != -1) {
			lowerendpoint.setAttribute({ visible: false });
		}

		if(upperendpoint != -1) {
			upperendpoint.setAttribute({ visible: false });
		}

		var expr = math.compile(relation);

		if(interval != '') {

			// See if there is a hole in the graph
			if(interval.search(regex_hole) != -1) {
				hole_val = getHoleValue(interval);
				var parameter = {};
				parameter[variable] = hole_val;
				var y_val = evalstr(relation, parameter);
				hole.moveTo([hole_val, y_val]);
				hole.setAttribute( { visible: true, strokeColor: color, fillColor: 'white' });
			}

			// See if a restricted interval was defined
			if(interval.search(regex_interval) != -1) {

				restricted_interval = true;

				var lowerval = getLowerEndpoint(interval);
				var upperval = getUpperEndpoint(interval);

				if(lowerval != NEGATIVE_INFINITY) {
					start_x = lowerval;
					var parameter = {};
					parameter[variable] = lowerval;
					var y_val = evalstr(relation, parameter);
					lowerendpoint.moveTo([lowerval, y_val]);
					lowerendpoint.setAttribute({ strokeColor: color, visible: true });
					if(lowerBoundOpen(interval)) {
						lowerendpoint.setAttribute({ fillColor: 'white' });
					} else {
						lowerendpoint.setAttribute({ fillColor: color });
					}
				}

				if(upperval != POSITIVE_INFINITY) {
					end_x = upperval;
					var parameter = {};
					parameter[variable] = upperval;
					var y_val = evalstr(relation, parameter);
					upperendpoint.moveTo([upperval, y_val]);
					upperendpoint.setAttribute({ strokeColor: color, visible: true });
					if(upperBoundOpen(interval)) {
						upperendpoint.setAttribute({ fillColor: 'white' });
					} else {
						upperendpoint.setAttribute({ fillColor: color });
					}
				}

			}
		} // if(interval != '')

		// This is an explicit function of the form: f(x)
		curve.dataX = math.range(start_x, end_x + density, density).toArray();
		curve.dataY = curve.dataX.map(
			function(x) {
				var parameter = {};
				parameter[variable] = x;
				return evalstr(relation, parameter);
			}
		);

		// If the curve shoots off to infinity, this will prevent the curve from
		// drawing an "asymptote" at that value

		for(var i = 0; i < curve.dataY.length; i++) {
			if(curve.dataY[i] > (yMax + 2 * yScl)) {
				curve.dataY[i] = NaN;
			} else if(curve.dataY[i] < (yMin - 2 * yScl)) {
				curve.dataY[i] = NaN;
			}
		}

		//curve.updateParametricCurve();
		curve.updateCurve();
	}
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

	//var func = board.jc.snippet(relation, true, ['x', 'y'], false);
	//cv.func = func;
	//cv.update();

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

////////////////////////////////////////////////////////////////////////////////
//
//  Here is an algorithm for developing an implicit function plotter that more
//  quickly draws the curves:
//
//  found at: https://groups.google.com/forum/#!topic/jsxgraph/UFt3OoaJlg0
//
//  further resource links to investigate:
//
//		- http://shamshad-npti.github.io/scripts/implicit.js
//		- http://shamshad-npti.github.io/implicit/curve/2015/10/08/Implicit-curve/
//
//
//var ImplicitPlotter = function(board, func)
//{
//  var me = {};
//
//  me.board = board; me.func = func;
//  me.colour = "blue";
//  me.px = 300; me.py = 300;
//  me.tx = 0; me.ty = 0;
//  me.curves = [];
//
//  me.finish = function(segments)
//  {
//    board.create('transform', [-me.x1 * me.tx, me.y2 * me.ty], {type: 'translate'});
//    board.create('transform', [me.tx, -me.ty], {type: 'scale'});
//
//    var xs = [];
//    var ys = [];
//    var curves = [];
//
//    for (var i = 0; i < segments.length; i++)
//    {
//        var s = segments[i];
//        if (!s.lineTo && xs.length)
//        {
//            curves.push(board.create('curve', [xs, ys], {strokeWidth:1, strokeColor:me.colour}));
//            xs = [];
//            ys = [];
//        }
//
//        xs.push(segments[i].x);
//        ys.push(segments[i].y);
//    }
//    if (xs.length)
//    {
//        curves.push(board.create('curve', [xs, ys], {strokeWidth:1, strokeColor:me.colour}));
//    }
//
//    return curves;
//  }
//
//  me.update = function()
//  {
//    var bbox = board.getBoundingBox();
//    me.x1 = 1.2 * bbox[0]; me.x2 = 1.2 * bbox[2];
//    me.y1 = 1.2 * bbox[1]; me.y2 = 1.2 * bbox[3];
//    me.px = board.canvasWidth;
//    me.py = board.canvasHeight;
//    me.tx = me.px / (me.x2 - me.x1);
//    me.ty = me.py / (me.y2 - me.y1);
//    me.plot = new Implicit(me.func, me.finish);
//    me.curves = me.plot.update(me.x1, me.y1, me.x2, me.y2, me.px, me.py);
//  }
//
//  return me;
//};
//
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
//  This is the more advanced implementation of the above algorithm
//
////////////////////////////////////////////////////////////////////////////////

var LinkedList = function() {
	var Node = function(elem, next, prev) {
		this.elem = elem, this.next = next, this.prev = prev;
	};
	var me = this;
	me.head = new Node(null, null, null);
	me.head.next = me.head.prev = me.head;
	me.shift = function() {
		detach(me.head.next);
	};

	me.pop = function() {
		detach(me.head.prev);
	};

	me.push = function(e) {
		var node = new Node(e, me.head, me.head.prev);
		me.head.prev.next = node;
		me.head.prev = node;
	};

	me.unshift = function(e) {
		var node = new Node(e, me.head.next, me.head);
		me.head.next.prev = node;
		me.head.next = node;
	};

	me.merge = function(list) {
		if(list.isEmpty()) return;
		me.head.prev.next = list.head.next;
		list.head.next.prev = me.head.prev;
		list.head.prev.next = me.head;
		me.head.prev = list.head.prev;
		list.destroy();
	}

	me.isEmpty = function() {
		return me.head === me.head.next;
	};

	me.destroy = function() {
		me.head = new Node(null, null, null);
	}

	me.toArray = function() {
		var node = me.head.next;
		var array = [];
		while(node != me.head) {
			array.push(node.elem);
			node = node.next;
		}
		return array;
	}

	me.remove = function(current) {
		if(current instanceof Node) detach(current);
	}

	me.forEach = function(callback) {
		var current = me.head.next, next;
		while(current !== me.head) {
			next = current.next;
			callback(current.elem, current);
			current = next;
		}
	}

	function detach(node) {
		node.next.prev = node.prev;
		node.prev.next = node.next;
		node.next = node.prev = null;
		node.elem = null;
	}

};

var Point = function(x, y, lineTo) {
	var me = this;
	me.x = x, me.y = y, me.lineTo = lineTo;

	me.equals = function(p) {
		return equals(me.x, p.x, 1e-6) && equals(me.y, p.y, 1e-6);
	};

	function equals(x, y, eps) {
		if(x === y) return true;
		return ((x - eps) < y) && (y < (x + eps));
	};
};

var PointList = function(start, end) {
	var me = this;
	me.start = start, me.end = end;
	me.start.lineTo = false, me.end.lineTo = true;
	me.points = new LinkedList();

	me.merge = function(list) {
		me.points.push(me.end);
		list.start.lineTo = true;
		me.points.push(list.start);
		me.end = list.end;
		if(list.points.length == 0) return;
		me.points.merge(list.points);
	}

	me.push = function(point) {
		point.lineTo = true;
		me.points.push(me.end);
		me.end = point;
	};

	me.unshift = function(point) {
		point.lineTo = false;
		me.start.lineTo = true;
		me.points.unshift(me.start);
		me.start = point;
	};
};

var Rectangle = function(func) {
	var me = this;
	me.eval = [0, 0, 0, 0], me.rect = [0, 0, 0, 0];
	me.x = 0, me.y = 0, me.children = null, me.status = null;
	me.singular = false, me.func = func;

	me.copy = function(r) {
		for(var i = 0; i < 4; i++) {
			me.eval[i] = r.eval[i];
			me.rect[i] = r.rect[i];
		}
		me.x = r.x, me.y = r.y;
		me.singular = r.singular;
	};

	me.set = function(x, y, fx, fy, singular) {
		me.x = x, me.y = y, me.rect[2] = fx, me.rect[3] = fy;
		me.singular = singular;
	};

	me.split = function() {
		if(me.children === null) {
			me.children = [];
			for(var i = 0; i < 4; i++) {
				me.children.push(new Rectangle(me.func));
			}
		}
		var r = me.children;
		var w2 = me.rect[2] * 0.5;
		var h2 = me.rect[3] * 0.5;
		for(var i = 0; i < 4; i++) {
			r[i].copy(me);
			r[i].rect[2] = w2;
			r[i].rect[3] = h2;
		}
		r[1].rect[0] += w2;
		r[2].rect[0] += w2;
		r[2].rect[1] += h2;
		r[3].rect[1] += h2;
		r[0].eval[1] = me.func(r[1].rect[0], r[1].rect[1]);
		r[0].eval[2] = me.func(r[2].rect[0], r[2].rect[1]);
		r[0].eval[3] = me.func(r[3].rect[0], r[3].rect[1]);
		r[1].eval[2] = me.func(r[2].rect[0] + w2, r[2].rect[1]);
		r[2].eval[3] = me.func(r[2].rect[0], r[2].rect[1] + h2);
		r[1].eval[0] = r[0].eval[1];
		r[1].eval[3] = r[0].eval[2];
		r[2].eval[0] = r[0].eval[2];
		r[2].eval[1] = r[1].eval[2];
		r[3].eval[0] = r[0].eval[3];
		r[3].eval[1] = r[0].eval[2];
		r[3].eval[2] = r[2].eval[3];
		return r;
	};

	me.x1 = function() {return me.rect[0]; };
	me.y1 = function() {return me.rect[1]; };
	me.x2 = function() {return me.rect[0] + me.rect[2]; };
	me.y2 = function() {return me.rect[1] + me.rect[3]; };
};

var Implicit = function(func, finish) {
	var me = this;
	var EMPTY = 0, FINISHED = -1, T_INV = -1, VALID = 1;
	var LIST_THRESHOLD = 16, MAX_SPLIT = 32, RES_COARSE = 8;
	var MAX_DEPTH = 4, T0101 = 5;

	me.func = func, me.finish = finish, me.grid = null;
	me.temp = null, me.plotDepth = 0, me.segmentCheckDepth = 0;
	me.openList = [], me.segments = [];
	me.sw = 0, me.sh = 0, me.pts = [null, null];

	function buildStatus(r) {
		var z = 0, p = 0, n = 0, k = true;
		for(var i = 0; i < 4; i++) {
			if(!isFinite(r.eval[i]) || isNaN(r.eval[i])) {
				k = false;
				break;
			}
			if(r.eval[i] < 0.0) n++;
			else if(r.eval[i] > 0.0) p++;
			else z++;
		}
		r.status = {pos: p, neg: n, zero: z, valid: k, empty: !k || ((z + 1) | p | n) >= 4};
	}

	function interpolate(p1, p2, fa, fb) {
		var r = -fb / (fa - fb);
		if (r >= 0 && r <= 1) { return r * (p1 - p2) + p2; }
		return (p1 + p2) * 0.5;
	};

	function createLine(x1, y1, x2, y2) {
		me.pts[0] = new Point(x1, y1, false);
		me.pts[1] = new Point(x2, y2, true);
		return VALID;
	}

	function oppSign(x, y) {
		return x * y < 0.0;
	}

	me.abortList = function() {
		for(var i = 0; i < me.openList.length; i++) {
			me.segments.push(me.openList[i].start);
			me.segments = me.segments.concat(me.openList[i].points.toArray());
			me.segments.push(me.openList[i].end);
		}
		me.openList = [];
	};

	me.create = function(r) {
		if(r.status.empty) return EMPTY;
		var zer = r.status.zero;
		var neg = r.status.neg;
		var pos = r.status.pos;
		if(((zer + 1) | neg | pos) >= 4) { return EMPTY; }
		var x1 = r.x1(), x2 = r.x2(), y1 = r.y1(), y2 = r.y2();
		var tl = r.eval[0], tr = r.eval[1], br = r.eval[2], bl = r.eval[3];
		switch(zer) {
			case 0:
				var k = 0;
				if(neg === pos && !oppSign(tl, br)) return T0101;
				if(oppSign(tl, tr)) me.pts[k++] = new Point(interpolate(x1, x2, tl, tr), y1, k !== 0);
				if(oppSign(tr, br)) me.pts[k++] = new Point(x2, interpolate(y1, y2, tr, br), k !== 0);
				if(oppSign(br, bl)) me.pts[k++] = new Point(interpolate(x1, x2, bl, br), y2, k !== 0);
				if(oppSign(bl, tl)) me.pts[k++] = new Point(x1, interpolate(y1, y2, tl, bl), k !== 0);
				return VALID;
			case 1:
				if(neg === 3 || pos === 3) {
					if(tl === 0.0) return createLine(x1, y1, x1, y1);
					if(tr === 0.0) return createLine(x2, y1, x2, y1);
					if(bl === 0.0) return createLine(x1, y2, x2, y2);
					if(br === 0.0) return createLine(x2, y2, x2, y2);
				}
				if(tl === 0.0) {
					if(oppSign(bl, br)) return createLine(x1, y1, interpolate(x1, x2, bl, br), y2);
					if(oppSign(tr, br)) return createLine(x1, y1, x2, interpolate(y1, y1, tr, br));
					return EMPTY;
				}
				if(tr === 0.0) {
					if(oppSign(bl, br)) return createLine(interpolate(x1, x2, bl, br), y2, x2, y1);
					if(oppSign(bl, tl)) return createLine(x1, interpolate(y1, y2, tl, bl), x2, y1);
					return EMPTY;
				}
				if(br === 0.0) {
					if(oppSign(tl, tr)) return createLine(interpolate(x1, x2, tl, tr), y1, x2, y2);
					if(oppSign(tl, bl)) return createLine(x1, interpolate(y1, y2, tl, bl), x2, y2);
					return EMPTY;
				}
				if(bl === 0.0) {
					if(oppSign(tl, tr)) return createLine(x1, y2, interpolate(x1, x2, tl, tr), y1);
					if(oppSign(tr, br)) return createLine(x1, y2, x2, interpolate(y1, y2, tr, br));
					return EMPTY;
				}
				return EMPTY;
			case 2:
				if(pos === 2 || neg === 2) {
					if(tl === 0.0) {
						if(tr === 0.0) return createLine(x1, y1, x2, y1);
						if(bl === 0.0) return createLine(x1, y1, x1, y2);
					} else if(br === 0.0) {
						if(tr === 0.0) return createLine(x2, y1, x2, y2);
						if(bl === 0.0) return createLine(x1, y2, x2, y2);
					}
				} else {
					if(tr === 0.0 && bl === 0.0) return createLine(x1, y2, x2, y1);
					if(tl === 0.0 && br === 0.0) return createLine(x1, y1, x2, y2);
				}
				return EMPTY;
		}
	};

	me.append = function(r) {
		var cfg = me.create(r);
		if(cfg === VALID) {
			if(me.pts[0].x > me.pts[1].x) {
				var temp = me.pts[0]; me.pts[0] = me.pts[1]; me.pts[1] = temp;
			}
			var inx1 = -1, inx2 = -1;

			for(var i = 0; i < me.openList.length; i++) {
				if(me.pts[1].equals(me.openList[i].start)) {
					inx1 = i;
					break;
				}
			}

			for(var i = 0; i < me.openList.length; i++) {
				if(me.pts[0].equals(me.openList[i].end)) {
					inx2 = i;
					break;
				}
			}

			if(inx1 !== -1 && inx2 !== -1) {
				me.openList[inx2].merge(me.openList[inx1]);
				me.openList.splice(inx1, 1);
			} else if(inx1 !== -1) {
				me.openList[inx1].unshift(me.pts[0]);
			} else if(inx2 !== -1) {
				me.openList[inx2].push(me.pts[1]);
			} else {
				me.openList.push(new PointList(me.pts[0], me.pts[1]));
			}
			if(me.openList.length > LIST_THRESHOLD) {
				me.abortList();
			}
		}
		return cfg;
	};

	me.update = function(x1, y1, x2, y2, px, py, fast) {
		x1 -= 0.25 * Math.PI / px;
		if(fast) {
			me.sw = 8;
			me.sh = 8;
		} else {
			me.sw = Math.min(MAX_SPLIT, Math.floor(px / RES_COARSE));
			me.sh = Math.min(MAX_SPLIT, Math.floor(py / RES_COARSE));
		}
		if (me.sw == 0 || me.sh == 0) { return; }
		if (me.grid === null || me.grid.length !== me.sh || me.grid[0].length !== me.sw) {
			me.grid = [];
			for (var i = 0; i < me.sh; i++) {
				var col = [];
				for (var j = 0; j < me.sw; j++) {
					col.push(new Rectangle(me.func));
				}
				me.grid.push(col);
			}
		}

		if(me.temp === null) {
			me.temp = new Rectangle(me.func);
		}

		var w = x2 - x1, h = y2 - y1, cur, prev;
		var frx = w / me.sw, fry = h / me.sh;

		var vertices = [], xcoords = [], ycoords = [];

		for (var i = 0; i <= me.sw; i++) {
			xcoords.push(x1 + i * frx);
		}

		for (var i = 0; i <= me.sh; i++) {
			ycoords.push(y1 + i * fry)
		}

		for (var i = 0; i <= me.sw; i++) {
			vertices.push(me.func(xcoords[i], ycoords[0]));
		}
		var i, j, dx, dy, fx, fy;

		for (i = 1; i <= me.sh; i++) {
			prev = me.func(xcoords[0], ycoords[i]);
			fy = ycoords[i] - 0.5 * fry;
			for (j = 1; j <= me.sw; j++) {
				cur = me.func(xcoords[j], ycoords[i]);
				var rect = me.grid[i - 1][j - 1];
				rect.set(j - 1, i - 1, frx, fry, false);
				rect.rect[0] = xcoords[j - 1];
				rect.rect[1] = ycoords[i - 1];
				rect.eval[0] = vertices[j - 1];
				rect.eval[1] = vertices[j];
				rect.eval[2] = cur;
				rect.eval[3] = prev;
				rect.status = buildStatus(rect);
				vertices[j - 1] = prev;
				prev = cur;
			}
			vertices[me.sw] = prev;
		}

		me.plotDepth = 2;
		me.segmentCheckDepth = 1;
		LIST_THRESHOLD = 48;

		for (i = 0; i < me.sh; i++) {
			for (j = 0; j < me.sw; j++) {
				if (!me.grid[i][j].singular && me.grid[i][j].status != EMPTY) {
					me.temp.copy(me.grid[i][j]);
					me.plot(me.temp, 0);
					me.grid[i][j].status = FINISHED;
				}
			}
		}

		for (var k = 0; k < 4; k++) {
			for (i = 0; i < me.sh; i++) {
				for (j = 0; j < me.sw; j++) {
					if (me.grid[i][j].singular
							&& me.grid[i][j].status != FINISHED) {
						me.temp.copy(grid[i][j]);
						me.plot(temp, 0);
						me.grid[i][j].status = FINISHED;
					}
				}
			}
		}
		me.abortList();
		me.finish(me.segments);
	};

	me.makeTree = function(r, d) {
		var children = r.split();
		me.plot(children[0], d);
		me.plot(children[1], d);
		me.plot(children[2], d);
		me.plot(children[3], d);
	};

	me.plot = function(r, d) {
		if(d < me.segmentCheckDepth) {
			me.makeTree(r, d + 1);
			return;
		}
		buildStatus(r);
		if(!r.status.empty) {
			if(d >= me.plotDepth) {
				if(me.append(r, d === MAX_DEPTH) === T0101 && d < MAX_DEPTH) {
					me.makeTree(r, d + 1);
				}
			} else {
				me.makeTree(r, d + 1);
			}
		}
	};
 };

// plotter code using jsxgraph

var CanvasPlotter = function(board, func) {
var me = {};

me.board = board; me.func = func;
me.x1 = -10; me.x2 = 10;
me.y1 = -10; me.y2 = 10;
me.color = "green";
me.px = 300; me.py = 300;
	me.tx = 0; me.ty = 0;
	me.working = false;

	me.finish = function(segments)
	{
		board.create('transform', [-me.x1 * me.tx, me.y2 * me.ty], {type: 'translate'});
		board.create('transform', [me.tx, -me.ty], {type: 'scale'});

	var xs = [];
	var ys = [];

		for (var i = 0; i < segments.length; i++)
		{
		var s = segments[i];
		if (!s.lineTo && xs.length)
		{
			board.create('curve', [xs, ys], {strokeWidth:2});
			xs = [];
			ys = [];
		}

		xs.push(segments[i].x);
		ys.push(segments[i].y);
		}
	if (xs.length)
	{
		board.create('curve', [xs, ys], {strokeWidth:2});
	}
	}

	me.update = function(fast = false)
	{
		me.px = board.canvasWidth;//canvas.scrollWidth;
		me.py = board.canvasHeight;//canvas.scrollHeight;
		me.tx = me.px / (me.x2 - me.x1);
		me.ty = me.py / (me.y2 - me.y1);
		me.plot = new Implicit(me.func, me.finish);
		me.plot.update(me.x1, me.y1, me.x2, me.y2, me.px, me.py, fast);
	}

	return me;
};

//var cv = new CanvasPlotter(board, function(x, y) {return -1;});




/**
 * Plots a relation in two dimensions. The format of the input is expected to
 *    be one of the following formats:
 *
 *          y = f(x), or just f(x) - for standard rectangular functions
 *          r = f(t) - for polar equations
 *          [ x(t), y(t) ] - for parametric equations
 *          x = g(y) - for rectangular equations rotated by 90 degrees
 *          implicity defined functions such as x^2 + y^2 = 4
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
 *	    ??? lowerendpoint/upperendpoints - references to a circle object for 
 *         an open/closed interval
 *      ??? hole - a reference to a hole in the graph on the interval 
 *	    ??? var yMax = args.yMax ? args.yMax : 10;
 *	    ??? var yMin = args.yMin ? args.yMin : -10;
 *	    ??? var yScl = args.yScl ? args.yScl : 1;
 *	    variable (string) - the depended variable
 *	    dashed (boolean) - whether the funciton should be dashed or solid
 * 
 * @returns - a reference to the curve drawn
 */

export function plot(board, relation, args) {

    args = args ? args : {};
    args.interval = args.interval ? args.interval : '';

	var holeloc = '';
	var endpoints = [];

	relation = relation.toLowerCase();

	if (isImplicitEquation(relation)) {
		relation = convertImplicitEquation(relation);
	}

	// math.js does not support ln notation for natural logarithm
    relation = replace_logarithms(relation);

	if (relation == '' && args.interval != '') {

		// This is just a point, just determine if it's open or closed and plot

        // TODO: This should be corrected to allow the relation to look like:
        //      (2,5), or [2,5] in order to draw an open or closed point

		var interval = args.interval.trim();
		var closed = false;

		if (interval.startsWith('[') || interval.endsWith(']')) {
			closed = true;
		}

		var vals = interval.split(',');
		vals[0] = vals[0].substring(1, vals[0].length);
		vals[1] = vals[1].substring(0, vals[1].length-1);

		var lowerendpoint = args.lowerendpoint ? args.lowerendpoint : -1;
		var upperendpoint = args.upperendpoint ? args.upperendpoint : -1;
		var hole = args.hole ? args.hole : -1;
		var color = args.color ? args.color : 'blue';

		if(hole != -1) {
			hole.setAttribute({ visible: false });
		}

		if(lowerendpoint != -1) {
			lowerendpoint.setAttribute({ visible: false });
		}

		if(upperendpoint != -1) {
			upperendpoint.setAttribute({ visible: false });
		}


		var x = evalstr(vals[0]);
		var y = evalstr(vals[1]);

		lowerendpoint.moveTo([x, y]);

		lowerendpoint.setAttribute({ strokeColor: color, visible: true });
		if (closed) {
			lowerendpoint.setAttribute({ fillColor: color });
		} else {
			lowerendpoint.setAttribute({ fillColor: 'white' });
		}

	} else {

		var vars = getVariables(relation);
		var fname = getFunctionName(relation);

		// if there is no function name given, and we can assume it is a function
		// of x, then just append a y =
		if(fname == '' && ((vars[0] == 'x' && vars.length == 1) || (vars.length == 0))) {
			fname = 'y';
		}
		relation = removeFunctionName(relation);

		if(fname != '') {

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

			if(vars.length == 1) {

				if(vars[0] == 'x' || fname == 'f' || fname == 'y') {

					// rectangular plot y = f(x)
					plot_function(curve, relation, start_x, end_x, args);

				} else if(vars[0] == 'y' || fname == 'g' || fname == 'x') {

					// rectangular x = g(y)
					args.variable = vars[0];
					var bounds = JSXGetBounds(board);
					var tmin = bounds.ymin;
					var tmax = bounds.ymax;
					plot_parametric(curve, relation, args.variable, tmin, tmax, args);

				} else if(fname == 'r' && vars[0] == 't') {

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

			} // if(vars.length == 1)

		} else if(vars[0] == 't' && vars.length == 1) {
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

		} else if(vars.length == 2) {
			implicit_plot(relation, args);
		}

	}

}









