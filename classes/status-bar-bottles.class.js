/** 
 * Class representing the character's statusbar regarding the collected bottles. 
 * @extends StatusBar
 * */
class StatusBarBottles extends StatusBar {
    x = 20;
    y = 80;
    dirName = '1_statusbar/3_statusbar_bottle';
    color = 'orange';
    percentage = 100;

    /** Constructs an instance of StatusBarBottles. */
    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }
}