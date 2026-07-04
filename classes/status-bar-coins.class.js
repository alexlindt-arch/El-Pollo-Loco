/** 
 * Class representing the character's statusbar regarding the collected coins. 
 * @extends StatusBar
 * */
class StatusBarCoins extends StatusBar {
    x = 20;
    y = 45;
    dirName = '1_statusbar/1_statusbar_coin';
    color = 'blue';
    percentage = 0;

    /** Constructs an instance of StatusBarCoins. */
    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }
}