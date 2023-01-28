export function rectangle(board, bounds, parameters) {

    // Exit if no board is specified

    if (board === undefined) {
        console.error("A JSX board must be specified to draw a rectangle on.");
        return;
    }

    // Check to see if any parameters were specified, make a default empty
    //   object if not

    if (parameters === undefined) {
        parameters = {};
    }

    // Make sure the bounds and scale were specified, or else exit

    if (bounds === undefined || bounds.x === undefined || bounds.y === undefined 
        || bounds.width === undefined || bounds.height === undefined) {
        console.error("Bounds for rectangle not specified, expected an objected of type: " +
            " {x: Number, y: Number, width: Number, height: Number");
        return
    }

    let borderColor = parameters.borderColor ? parameters.borderColor : 'black';

    let x = bounds.x;
    let y = bounds.y;
    let w = bounds.width;
    let h = bounds.height;

    var poly = board.create('polygon', [[x, y], [x+w, y], [x+w, y+h], [x, y+h]]);
    poly.setAttribute({ highlight: false});
    poly.setAttribute({ fixed: true });
    for(let point of poly.vertices) {
        point.setAttribute({ visible: false });
    }
    for(let border of poly.borders) {
        border.setAttribute({ strokeColor: borderColor });
        border.setAttribute({ fixed: true });
        border.setAttribute({ highlight: false });
    }


}