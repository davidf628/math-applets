
/******************************************************************************
 * 
 * Draws a rectangle on a JSX board, given specified bounds.
 * 
 * Inputs:
 *   board - the jsx board to draw on
 *   bounds - an object specifying the bounds of the rectangle, must
 *     be of the form: {x, y, width, height}
 *   args (optional) - a JSON object that contains constants controlling
 *     how the rectangle should be drawn
 * 
 */

export function rectangle(board, bounds, args) {

    // Exit if no board is specified

    if (board === undefined) {
        console.error("A JSX board must be specified to draw a rectangle on.");
        return;
    }

    // Check to see if any parameters were specified, make a default empty
    //   object if not

    if (args === undefined) {
        args = {};
    }

    // Make sure the bounds were specified, or else exit

    if (bounds === undefined || bounds.x === undefined || bounds.y === undefined 
        || bounds.width === undefined || bounds.height === undefined) {
        console.error("Bounds for rectangle not specified, expected an objected of type: " +
            " {x: Number, y: Number, width: Number, height: Number");
        return
    }

    let borderColor = args.borderColor ? args.borderColor : 'black';
    let showBorder = args.showBorder ? args.showBorder : true;
    let borderWidth = args.borderWidth ? args.borderWidth : 1;
    let borderOpacity = args.borderOpacity ? args.borderOpacity : 1;
    let showFill = args.showFill ? args.showFill : false;
    let fillColor = args.fillColor ? args.fillColor : 'green';
    let fillOpacity = args.fillOpacity ? args.fillOpacity : 0.2;

    let x = bounds.x;
    let y = bounds.y;
    let w = bounds.width;
    let h = bounds.height;

    var poly = board.create('polygon', [[x, y], [x+w, y], [x+w, y-h], [x, y-h]]);

    poly.setAttribute({ highlight: false});
    poly.setAttribute({ fixed: true });

    if (showFill) {
        poly.setAttribute({ fillColor: fillColor });
        poly.setAttribute({ fillOpacity: fillOpacity });
    } else {
        poly.setAttribute({ fillOpacity: 0 });
    }

    for(let point of poly.vertices) {
        point.setAttribute({ visible: false });
    }

    if (showBorder) {

        poly.setAttribute({ strokeWidth: borderWidth });
        poly.setAttribute({ strokeOpacity: borderOpacity });
        for(let border of poly.borders) {
            border.setAttribute({ strokeColor: borderColor });
            border.setAttribute({ fixed: true });
            border.setAttribute({ highlight: false });
        }
    }


}