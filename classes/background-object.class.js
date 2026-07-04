/** 
 * Class representing a BackgroundObject
 * @extends DrawableObject
 */
class BackgroundObject extends DrawableObject {
    width = CANVAS_WIDTH + 1;
    height = CANVAS_HEIGHT;
    numberOfImagesToLoad = 1;

    /**
     * Constructs an instance of BackgroundObject.
     * @param {string} imagePath - The path to the background image.
     * @param {number} x - The x position of the background image.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = CANVAS_HEIGHT - this.height;
    }
}