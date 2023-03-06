
// TODO: Add support for multiple data sets


/******************************************************************************
 * This class can create a dot plot which can be drawn directly onto a JSX
 *   graph canvas, which must be previously defined. The class allows for
 *   access to the points within the plot in case the user wants to modify them
 *   in any way, like adjust their color or size for emphasis after they are 
 *   displayed. 
 * 
 *  @param board {JSXBoard} - the JSX graph board to draw the plot on to
 *      bounds - an object of the form shown, defining numeric values that 
 *        are relative to the board's window
 *           { x, y, width, height } 
 *      scale - an object of the form shown, defining the scale on the axis
 *           { min, max, scale }     
 *      data - the array of numbers to plot
 *      args (optional) - a JSON object of pre-defined constants to
 *        modify the way the dot plot is drawn
 */

import { rectangle } from './rectangle.js';
import { scalemap } from './dmath.js';
//import { max_frequency } from './stats.js';

export class DotPlot {

    constructor(board, bounds, scale, data, args) {

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

        if (scale === undefined || scale.min === undefined || scale.max === undefined 
            || scale.scale === undefined) {
            console.error("Scale for dotplot not specified, expected an objected of type: " +
                " {xmin: Number, xmax: Number, scale: Number");
            return
        }

        // Define the local properties
        this.bounds = bounds;
        this.scale = scale;
        this.data = data;
        this.points = [];
        this.tickmarks = [];
        this.ticklabels = [];
        this.board = board;

        this.axisy = bounds.y - 0.8 * bounds.height; // Axis to be positioned 20% from the bottom

        this.showBorder = args.border ? args.border : false;
        this.borderColor = args.borderColor ? args.borderColor : 'black';
        this.axisColor = args.axisColor ? args.axisColor : 'blue';
        this.pointColor = args.pointColor ? args.pointColor : 'black';

        if (this.showBorder) {
            this.border = rectangle(board, bounds, {
                border: this.showBorder, 
                borderColor: this.borderColor, 
                showFill: true, 
                fillOpacity: 1, 
                fillColor: 'white' 
            });
        }

        // Draw the axis
        this.axis = board.create('line', [[bounds.x, this.axisy], [bounds.x + bounds.width, this.axisy]], {
            straightFirst: false,
            straightLast: false,
            firstArrow: true,
            lastArrow: true,
            fixed: true,
            highlight: false,
            strokeColor: this.axisColor
        });

        this.updatePlot(this.data, this.scale);

    }

    updatePlot(newData, newScale) {

        if (newScale === undefined || newScale.min === undefined || newScale.max === undefined 
            || newScale.scale === undefined) {
            console.error("Scale for dotplot not specified, expected an objected of type: " +
                " {xmin: Number, xmax: Number, scale: Number");
            return;
        }

        this.board.suspendUpdate();

        this.data = newData;
        this.scale = newScale;
        this.tickmarks.forEach(function(item) { item.setAttribute( { visible: false } )});
        this.ticklabels.forEach(function(item) { item.setAttribute( { visible: false } )});
        this.points.forEach(function(item) { item.setAttribute( { visible: false })});

        // Get board pixels per unit
        let box = this.board.getBoundingBox();
        //let xppu = this.board.canvasWidth / (box[2] - box[0]);
        let yppu = this.board.canvasHeight / (box[1] - box[3]);

        // Set all the base args
        let x = this.bounds.x;

        // Draw the tick marks and labels
        let nMarks = Math.ceil((this.scale.max - this.scale.min) / this.scale.scale);
        let xDist = this.bounds.width / (nMarks + 2); // Space out the tick marks
        let tickHeight = 5 / yppu; // Make tick marks about 10 pixels
        let labelStart = 10 / yppu; // Make labels start about 10 pixes below axis
        for(let i = 0; i <= nMarks; i++) {

            let labelText = Math.round(this.scale.min + i * this.scale.scale).toString();

            if(this.tickmarks[i] !== undefined) {
                this.tickmarks[i].point1.moveTo([x + (i+1) * xDist, this.axisy + tickHeight]);
                this.tickmarks[i].point2.moveTo([x + (i+1) * xDist, this.axisy - tickHeight]);
                this.tickmarks[i].setAttribute( { visible: true });
            } else {
                let tickmark = this.board.create('segment', [
                    [x + (i+1) * xDist, this.axisy + tickHeight],
                    [x + (i+1) * xDist, this.axisy - tickHeight]], {
                    highlight: false,
                    fixed: true,
                    strokeColor: this.axisColor
                });
                this.tickmarks.push(tickmark);
            }

            if (this.ticklabels[i] !== undefined) {
                this.ticklabels[i].moveTo([x + (i+1) * xDist, this.axisy - labelStart]);
                this.ticklabels[i].setText(labelText);
                this.ticklabels[i].setAttribute( { visible: true });
            } else {
        
                let ticklabel = this.board.create('text', [x + (i+1) * xDist, this.axisy - labelStart, labelText], {
                    anchorX: 'middle',
                    highlight: false,
                    fixed: true,
                });

                this.ticklabels.push(ticklabel);
            }
        }

        let counts = {};

        for(let i = 0; i < this.data.length; i++) {
            let value = this.data[i];
            if (value in counts) {
                counts[value] += 1;
            } else {
                counts[value] = 1;
            }

            if (this.points[i] !== undefined) {
                if ((value >= this.scale.min) && (value <= this.scale.max)) {
                    let xval = scalemap(value, [this.scale.min, this.scale.max], [box[0], box[2]]);
                    let yval = this.axisy + (10 / yppu) * counts[value];
                    this.points[i].moveTo([xval, yval]);
                    this.points[i].setAttribute( { visible: true });
                } else {
                    console.warn(`${value} in data set was outside the range of the dot plot scale.`);
                }
            } else {
                if ((value >= this.scale.min) && (value <= this.scale.max)) {
                    let xval = scalemap(value, [this.scale.min, this.scale.max], [box[0], box[2]]);
                    let yval = this.axisy + (10 / yppu) * counts[value];
                    let point = this.board.create('point', 
                        [xval, yval], {
                        withLabel: false,
                        showInfobox: false,
                        strokeColor: this.pointColor,
                        fillColor: this.pointColor,
                        fixed: true,
                    });
                    this.points.push(point);
                } else {
                    console.warn(`${value} in data set was outside the range of the dot plot scale.`);
                }
            }

        }
        this.board.unsuspendUpdate();

    }

    getData() {
        return this.data;
    }

    setData(newData) {
        this.updatePlot(newData, this.scale);
    }

    getScale() { 
        return this.scale;
    }

    setScale(newScale) {
        this.updatePlot(this.data, newScale);
    }

    getPoints() {
        return this.points;
    }
    
    getBounds() {
        return this.bounds;
    }

}