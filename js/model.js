class MyModel extends Croquet.Model {

    static types() {
        return {
          "Stroke": Stroke,
        };
    }

    init() {
        this.strokes = [];
        this.subscribe("canvas", "draw", this.updateStrokes);
    }

    updateStrokes(stroke) {
        this.strokes.push(stroke);
        this.publish("canvas", "updateView");
    }

}

MyModel.register("MyModel");

class Stroke {
    constructor(color, width, userId, plots) {
        this.color = color;
        this.width = width;
        this.userId = userId;
        this.plots = plots;
    }
}

