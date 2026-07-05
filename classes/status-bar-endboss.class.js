/** 
 * Class representing the endboss statusbar regarding its remaining energy. 
 * @extends StatusBar
 * */
class StatusBarEndboss extends StatusBar {
    x = CANVAS_WIDTH - (674 / 3.3 + 16);
    y = 70;
    width = 674 / 3.3;
    height = 165 / 3.3;
    dirName = '2_statusbar_endboss';
    color = 'green';
    percentage = 100;

    /** Constructs an instance of StatusBarEndboss. */
    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }

    /**
     * Calculates the image index for the endboss bar.
     * Uses Math.floor so the bar visibly drops right after the first hit
     * (instead of lagging one hit behind like the default Math.ceil mapping).
     * @returns {number} - The index of the image in the IMAGES array.
     */
    resolveImageIndex() {
        if (this.percentage <= 0) return 0;
        let index = Math.floor(this.percentage / 20);
        return Math.max(Math.min(index, 5), 1);
    }
}