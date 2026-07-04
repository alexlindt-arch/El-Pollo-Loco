/** Class representing a collectable object. */
class CollectableObject extends DrawableObject {
    IMAGES;
    collect_sound;

    /** Randomly places the object in the world (x axis), leaving out the start canvas. */
    place() {
        do {
            this.x = (WORLD_START + 200) + Math.random() * (WORLD_WIDTH - CANVAS_WIDTH);
        } while (this.isInStartCanvas());
    }
}