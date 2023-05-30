export class LancerClockToolTip extends BasePlaceableHUD {

	static get defaultOptions() {
		const options = super.defaultOptions;
		options.classes = options.classes.concat(["lancer-clock-tooltip"]);
		options.template = "modules/lancer-clocks/templates/tooltip.html";
		options.id = "lancer-clock-tooltip";
		return options;
	}

    getData() {
		const data = super.getData();
       return data;
    }

    setPosition() {
		if (!this.object) return;
        const position = {
	        width: canvas.grid.size *1.2,
            height: canvas.grid.size *.8,
            left: this.object.center.x+20,
			top: this.object.center.y+20,
      "font-size": canvas.grid.size / 3.5 + "px",
      "display" : "grid"
        };
	    this.element.css(position);
    }
}