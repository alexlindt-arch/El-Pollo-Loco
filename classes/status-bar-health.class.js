/** 
 * Class representing the character's statusbar regarding his remaining energy. 
 * @extends StatusBar
 * */
class StatusBarHealth extends StatusBar {
    x = 20;
    y = 10;
    dirName = '1_statusbar/2_statusbar_health';
    color = 'green';
    percentage = 100;

    /** Constructs an instance of StatusBarHealth. */
    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }
}