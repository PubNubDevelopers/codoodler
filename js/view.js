class MyView extends Croquet.View {
    constructor(model) {
        super(model)

        // view state
        this.model = model;
        this.active_stroke = null;
        this.drawn_strokes_idx = 0;

        // setup canvas
        this.canvas = document.getElementById('drawCanvas');
        let canvas = this.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.selected_color = document.querySelector(':checked').getAttribute('data-color');

        canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
        canvas.height = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);
        
        let ctx = this.ctx;
        ctx.lineWidth = '3';
        ctx.lineCap = ctx.lineJoin = 'round';

        // Mouse and touch events        

        this.onSelectColor();
        this.onSelectColor = this.onSelectColor.bind(this);
        this.onStartDraw = this.onStartDraw.bind(this);
        this.onDraw = this.onDraw.bind(this);
        this.onEndDraw = this.onEndDraw.bind(this);

        document.getElementById('colorSwatch').addEventListener('click', this.onSelectColor, false);
        
        let isTouchSupported = 'ontouchstart' in window;
        let isPointerSupported = navigator.pointerEnabled;
        let isMSPointerSupported =  navigator.msPointerEnabled;
        
        let downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
        let moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
        let upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));
            
        canvas.addEventListener(downEvent, this.onStartDraw, false);
        canvas.addEventListener(moveEvent, this.onDraw, false);
        canvas.addEventListener(upEvent, this.onEndDraw, false);
        
        this.subscribe("canvas",  "updateView",  this.updateCanvas);
        this.updateCanvas();
    }

    updateCanvas() {
        for (; this.drawn_strokes_idx < this.model.strokes.length; ++this.drawn_strokes_idx) {
            this.drawStrokeOnCanvas(this.model.strokes[this.drawn_strokes_idx]);
        }
    }

    drawStrokeOnCanvas(stroke) {
            // console.log(stroke);
            if (stroke.plots.length < 2) {
                return;
            }
            this.ctx.strokeStyle = stroke.color;
            this.ctx.beginPath();
            this.ctx.moveTo(stroke.plots[0].x, stroke.plots[0].y);

            for(var i=1; i<stroke.plots.length; i++) {
                this.ctx.lineTo(stroke.plots[i].x, stroke.plots[i].y);
            }

            this.ctx.stroke();
    }

    onSelectColor() {
        this.selected_color = document.querySelector(':checked').getAttribute('data-color');
    }

	onDraw(e) {
		e.preventDefault(); // prevent continuous touch event process e.g. scrolling!
	  	if(!this.active_stroke) return;

    	var x = this.isTouchSupported ? (e.targetTouches[0].pageX - this.canvas.offsetLeft) : (e.offsetX || e.layerX - this.canvas.offsetLeft);
    	var y = this.isTouchSupported ? (e.targetTouches[0].pageY - this.canvas.offsetTop) : (e.offsetY || e.layerY - this.canvas.offsetTop);

    	this.active_stroke.plots.push({x: (x << 0), y: (y << 0)}); // round numbers for touch screens
        this.drawStrokeOnCanvas(this.active_stroke);
	}
	
	onStartDraw(e) {
	  	e.preventDefault();
	  	this.active_stroke = new Stroke(this.selected_color, []);
	}
	
	onEndDraw(e) {
	  	e.preventDefault();
        let finished_stroke = this.active_stroke;
	  	this.active_stroke = null;
	  
        this.publish("canvas", "draw", finished_stroke);
	}
}