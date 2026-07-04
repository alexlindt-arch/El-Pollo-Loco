/** 
 * Class representing a statusbar. 
 * @extends DrawableObject
 * */
class StatusBar extends DrawableObject {
    width = 595 / 4;
    height = 158 / 4;
    dirName;
    color = 'green';
    IMAGES = [];
    percentage;

    /**
     * Adds image paths to the IMAGES array based on the directory name and color.
     * @param {string} dirName - The directory name of the status bar images.
     * @param {string} color - The color of the status bar images.
     */
    pushImages(dirName, color) {
        [0, 20, 40, 60, 80, 100].forEach(status => {
            let path = `assets/img/7_statusbars/${dirName}/${color}/${status}.png`;
            this.IMAGES.push(path);
        });
        this.numberOfImagesToLoad = this.IMAGES.length;
    }

    /**
     * Sets the percentage value of the status bar and updates the displayed image accordingly.
     * @param {number} percentage - The percentage value to set.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Calculates the index of the image in the IMAGES array based on the current percentage value.
     * @returns {number} - The index of the image in the IMAGES array.
     */
    resolveImageIndex() {
        let index = Math.ceil(this.percentage / 20);
        return Math.min(index, 5);
    }
}