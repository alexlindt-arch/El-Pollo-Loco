/** 
 * Class representing a collectable bottle.
 * @extends CollectableObject
 */
class CollectableBottle extends CollectableObject {
    y = 350;
    width = 400 / 5;
    height = 400 / 5;
    IMAGES = [
        'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    numberOfImagesToLoad = 1;
    offset = {
        top: 0.1 * this.height,
        right: 0.3 * this.width,
        bottom: 0.1 * this.height,
        left: 0.3 * this.width
    };
    collect_sound = audioElements['assets/audio/bottle_collect.mp3'];

    /** Constructs an instance of CollectableBottle.
     * Randomly chooses one of the two possible images and 
     * randomly places the bottle in the world. 
     */
    constructor() {
        let randomIndex = Math.round(Math.random());
        super().loadImage(this.IMAGES[randomIndex]);
        this.place();
    }
}