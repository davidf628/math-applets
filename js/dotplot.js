
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
 *      args (optional) - a JSON object of pre-defined constants to
 *        modify the way the dot plot is drawn
 */

import { rectangle } from './rectangle.js';

export function dotplot(board, bounds, scale, data, args) {

    // Check to see if any args were specified, make a default empty
    //   object if not

    if (args === undefined) {
        args = {};
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

    // Set all the base args
    let x = bounds.x;
    let axisy = bounds.y - 0.8 * bounds.height; // Axis to be positioned 20% from the bottom
    let width = bounds.width;

    let border = args.border ? args.border : false;
    let borderColor = args.borderColor ? args.borderColor : 'black';

    if (border) {
        rectangle(board, bounds, {border: border, borderColor: borderColor, showFill: true, fillOpacity: 1, fillColor: 'white' });
    }

    // Draw the axis
    board.create('line', [[x, axisy], [x+width, axisy]], {
        straightFirst: false,
        straightLast: false,
        firstArrow: true,
        lastArrow: true,
    });

    // Get board pixels per unit
    let box = board.getBoundingBox();
    let xppu = board.canvasWidth / (box[2] - box[0]);
    let yppu = board.canvasHeight / (box[1] - box[3]);


    // Draw the tick marks and labels
    let nMarks = Math.ceil((scale.xmax - scale.xmin) / scale.scale);
    let xDist = bounds.width / (nMarks + 2); // Space out the tick marks
    let tickHeight = 5 / yppu; // Make tick marks about 10 pixels
    let labelStart = 10 / yppu; // Make labels start about 10 pixes below axis
    for(let i = 0; i <= nMarks; i++) {
        board.create('segment', [[x + (i+1)*xDist, axisy+tickHeight],[x + (i+1)*xDist, axisy-tickHeight]]);
        let label = Math.round(scale.xmin + i * scale.scale).toString();
        board.create('text', [x + (i+1)*xDist, axisy-labelStart, label], {anchorX: 'middle'})
    }


}