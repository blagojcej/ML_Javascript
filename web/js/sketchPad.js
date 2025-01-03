class SketchPad {
    constructor(container, onUpdate = null, size = 400) {
        // Create a canvas element
        this.canvas = document.createElement("canvas");
        // Add the canvas width and height attributes
        this.canvas.width = size;
        this.canvas.height = size;

        // Add some canvas styling
        this.canvas.style = `
            background-color: white;
            box-shadow: 0px 0px 10px 2px black;
        `;

        // Add the canvas to the container element
        container.appendChild(this.canvas);

        const lineBreak = document.createElement("br");
        container.appendChild(lineBreak);

        this.undoBtn = document.createElement("button");
        this.undoBtn.innerHTML = "UNDO";
        container.appendChild(this.undoBtn);

        // Get the canvas context - 2d drawing canvas
        this.ctx = this.canvas.getContext("2d");

        this.onUpdate = onUpdate;
        this.reset();

        // Listening for a private (a hash symbol) events in the container/canvas
        this.#addEventListener();
    }

    reset() {
        // Set the drawing path
        this.paths = [];
        // Drawing status
        this.isDrawing = false;

        this.#redraw();
    }

    #addEventListener() {
        this.canvas.onmousedown = (evt) => {
            const mouse = this.#getMouse(evt);
            // The drawing path starter points
            this.paths.push([mouse]);
            // Drawing started
            this.isDrawing = true;
        }

        this.canvas.onmousemove = (evt) => {
            // Process the drawing if the drawing has starter
            if (this.isDrawing) {
                const mouse = this.#getMouse(evt);
                // Get the last path
                const lastPath = this.paths[this.paths.length - 1];
                // Push the mouse in the last path
                lastPath.push(mouse);
                this.#redraw();
            }
        }

        document.onmouseup = () => {
            // Stop drawing
            this.isDrawing = false;
        }

        // Register mobile events
        this.canvas.ontouchstart = (evt) => {
            // Get the location of the first touch (mobile devices support multitouch)
            const loc = evt.touches[0];
            this.canvas.onmousedown(loc);
        }
        this.canvas.ontouchmove = (evt) => {
            // Get the location of the first touch (mobile devices support multitouch)
            const loc = evt.touches[0];
            this.canvas.onmousemove(loc);
        }
        document.ontouchend = () => {
            this.canvas.onmouseup();
        }

        this.undoBtn.onclick = () => {
            this.paths.pop();
            this.#redraw();
        }
    }

    #redraw() {
        this.ctx.clearRect(0, 0,
            this.canvas.width, this.canvas.height
        );
        draw.paths(this.ctx, this.paths);
        if (this.paths.length > 0) {
            this.undoBtn.disabled = false;
        } else {
            this.undoBtn.disabled = true;
        }

        this.triggerUpdate();
    }

    triggerUpdate() {
        if (this.onUpdate) {
            this.onUpdate(this.paths);
        }
    }

    #getMouse = (evt) => {
        const rect = this.canvas.getBoundingClientRect();
        // Mouse x and y points decreased by the top and left position of the container
        return [
            Math.round(evt.clientX - rect.left),
            Math.round(evt.clientY - rect.top)
        ];
    }
}