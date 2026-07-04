/** Class representing a drawable object that can be displayed on the canvas. */
class DrawableObject {
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    numberOfImagesToLoad;
    numberOfLoadedImages = 0;
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * Loads an image from the given path and sets it as the object's image.
     * @param {string} path - The file path of the image to load.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        this.img.onload = () => {
            this.numberOfLoadedImages++;
        };
    }

    /**
     * Loads multiple images from the given array of paths and caches them.
     * @param {Array<string>} arr - An array of file paths of the images to load and cache.
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
            img.onload = () => {
                this.numberOfLoadedImages++;
            };
        });
    }

    /**
     * Checks if all the images associated with the object have been loaded.
     * @returns {boolean} - True if all images are loaded; otherwise, false.
     */
    allImagesAreLoaded() {
        return this.numberOfImagesToLoad === this.numberOfLoadedImages;
    }

    /**
     * Draws the object on the canvas using the provided context.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (error) {
            console.warn('Error drawing image', error);
            console.log('Unable to draw image', this.img.src);
        }
    }

    /**
     * Draws frames for collision detection purposes.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    drawFrames(ctx) {
        if ((this instanceof MovableObject && !(this instanceof Cloud)) || this instanceof CollectableObject) {
            const outerRectArgs = [this.x, this.y, this.width, this.height];
            const innerRectArgs = [this.x + this.offset.left, this.y + this.offset.top, this.width - (this.offset.left + this.offset.right), this.height - (this.offset.top + this.offset.bottom)];

            this.drawFrame(ctx, 'blue', ...outerRectArgs);
            this.drawFrame(ctx, 'red', ...innerRectArgs);
        }
    }

    /**
     * Draws a rectangular frame with the specified color on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {string} color - The color of the frame.
     * @param {number} x - The x-coordinate of the top-left corner of the frame.
     * @param {number} y - The y-coordinate of the top-left corner of the frame.
     * @param {number} width - The width of the frame.
     * @param {number} height - The height of the frame.
     */
    drawFrame(ctx, color, x, y, width, height) {
        ctx.beginPath();
        ctx.lineWidth = '5';
        ctx.strokeStyle = color;
        ctx.rect(x, y, width, height);
        ctx.stroke();
    }

    /**
     * Checks if the object overlaps with any of the given objects.
     * @param {Array<DrawableObject>} objects - An array of objects to check for overlap.
     * @returns {boolean} - True if there is an overlap; otherwise, false.
     */
    overlapsWithOtherObjects(objects) {
        let foundOverlap = false;

        objects.forEach((obj) => {
            if (this === obj) return;
            if (this.isOverlapping(obj)) {
                foundOverlap = true;
            }
        });

        return foundOverlap;
    }

    /**
     * Checks if the object is overlapping with the given object.
     * @param {DrawableObject} obj - The object to check for overlap.
     * @returns {boolean} - True if there is an overlap; otherwise, false.
     */
    isOverlapping(obj) {
        return this.x + this.width - this.offset.right > obj.x + obj.offset.left &&
            this.x + this.offset.left < obj.x + obj.width - obj.offset.right &&
            this.y + this.height - this.offset.bottom > obj.y + obj.offset.top &&
            this.y + this.offset.top < obj.y + obj.height - obj.offset.bottom;
    }

    /**
     * Checks if the object is in the left half of the canvas.
     * @returns {boolean} - True if the object is in the left half; otherwise, false.
     */
    isInLeftHalfOfCanvas() {
        return this.x < -this.world.camera_x + 0.5 * (CANVAS_WIDTH - this.width);
    }

    /**
     * Checks if the object is in the right half of the canvas.
     * @returns {boolean} - True if the object is in the right half; otherwise, false.
     */
    isInRightHalfOfCanvas() {
        return this.x > -this.world.camera_x + 0.5 * (CANVAS_WIDTH - this.width);
    }

    /**
     * Checks if the object is in the start canvas.
     * @returns {boolean} - True if the object is in the start canvas; otherwise, false.
     */
    isInStartCanvas() {
        return 0 < this.x && this.x < CANVAS_WIDTH;
    }
}