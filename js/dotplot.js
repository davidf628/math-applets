
/******************************************************************************
 * Draws a dot_plot onto a JSX Graph canvas that has already been defined. The
 *   canvas and the bounds for which the plot should be drawn need to be 
 *   specified, along with the data set to plot.
 * 
 *   Inputs:
 *      board - the JSX graph board to draw the plot on to
 *      bounds - an object of the form:
 *           { x, y, width, height } - bounds for the box in board units
 *      scale - an object of the form:
 *           { xmin, xmax, scale } - scale to draw the plot within      
 *      data - an array of numbers to plot
 *      parameters (optional) - a JSON object of pre-defined constants to
 *        modify the way the dot plot is drawn
 */

import { rectangle } from './rectangle.js';

export function dotplot(board, bounds, scale, data, parameters) {

    // Check to see if any parameters were specified, make a default empty
    //   object if not

    if (parameters === undefined) {
        parameters = {};
    }

    // Make sure the bounds and scale were specified, or else exit

    if (bounds === undefined || bounds.x === undefined || bounds.y === undefined 
        || bounds.width === undefined || bounds.height === undefined) {
        console.error("Bounds for dotplot not specified, expected an objected of type: " +
            " {x: Number, y: Number, width: Number, height: Number");
        return
    }

    if (scale === undefined || scale.xmin === undefined || scale.xmax === undefined 
        || scale.scale === undefined) {
        console.error("Scale for dotplot not specified, expected an objected of type: " +
            " {xmin: Number, xmax: Number, scale: Number");
        return
    }

    // Set all the base parameters

    let border = parameters.border ? parameters.border : false;
    let borderColor = parameters.borderColor ? parameters.borderColor : 'black';

    if (border) {
        rectangle(board, bounds, {border: border, borderColor: borderColor });
    }


}