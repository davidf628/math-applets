class JSXCheckBox {

	constructor(board, xLoc, yLoc, label, checked, onChange, args) {

		// Ensure that the proper inputs have been provided
		if (typeof(board) !== "object" || typeof(xLoc) !== "number" || typeof(yLoc) !== "number" || typeof(checked) !== "boolean") {
			console.warn('Invalid parameters for "JSXCheckbox" must include: board, xLoc, yLoc, label, and default status')
		}

		// Check to see if any additional arguments were passed
		if(args == undefined) {
			args = {};
		}
		args.fixed = typeof(args.fixed) === "boolean" ? args.fixed : true;

		// Create the checkbox
		this.checkbox = board.create('checkbox', [xLoc, yLoc, label], args);
		this.checkbox.rendNodeCheckbox.checked = checked;
		this.checkbox._value = checked;

		// Attach an onChange event function, if one was provided
		if (onChange) {
			JXG.addEvent(this.checkbox.rendNodeCheckbox, 'change', onChange, this.checkbox);
		}

	}

	toggle() {
		if(this.checkbox.isChecked) {
			this.checkbox.set(true);
		} else {
			this.checkbox.set(false);
		}
	}

	set(value) {
		this.checkbox._value = value;
		this.checkbox.rendNodeCheckbox.checked = value;
	}

	isChecked() {
		return this.checkbox._value;
	}
}
