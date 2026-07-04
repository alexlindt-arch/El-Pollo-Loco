/** 
 * Class representing a Cloud object.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    y = 0;
    width = 1920 / 3;
    height = 1080 / 3;
    numberOfImagesToLoad = 1;

    /** Constructs an instance of Cloud. */
    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.animate();
    }

    /**
     * Moves the Clouds to the left.
     */
    animate() {
        setStoppableInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}