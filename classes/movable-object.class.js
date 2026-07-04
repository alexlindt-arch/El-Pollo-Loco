/**
 * Class representing a movable object in the game.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    energyLossPerHit;
    world;
    gravityInterval;
    deathSoundHasBeenPlayed = false;
    hurtSoundHasBeenPlayed = false;
    hasBeenInFinalZone = false;
    hasDied = false;

    /**
     * Plays the animation using the provided images.
     * @param {Array<string>} images - The array of image paths for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /** Applies gravity to the movable object during its motion. */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0 || this.isDead()) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            else {
                this.y = GROUND_Y;
            }
        }, 1000 / 25);
    }

    /** Stops applying gravity to the movable object. */
    stopGravity() {
        clearInterval(this.gravityInterval);
    }

    /** Moves the movable object to the right by its speed. */
    moveRight() {
        this.x += this.speed;
    }

    /** Moves the movable object to the left by its speed. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Moves the movable object towards the center of the canvas based on its current position. */
    moveTowardsCenter() {
        if (this.isInLeftHalfOfCanvas()) {
            this.moveRight();
        }
        else if (this.isInRightHalfOfCanvas()) {
            this.moveLeft();
        }
    }

    /** Makes the movable object jump by adjusting its vertical speed. */
    jump() {
        this.speedY = 30;
    }

    /**
     * Reduces the energy level of the movable object due to a hit.
     * @param {number} energyLossFactor - The factor by which the energy is reduced due to the hit.
     */
    hit(energyLossFactor = 1) {
        if (this.isHurt()) return;
        this.energy = Math.max(this.energy - energyLossFactor * this.energyLossPerHit, 0);
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the movable object is above the ground level.
     * @returns {boolean} True if the movable object is above the ground level, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrownObject) {
            return true;
        }
        else {
            return this.y < GROUND_Y;
        }
    }

    /**
     * Checks if the movable object is colliding with another object.
     * @param {DrawableObject} obj - The object to check for collision with the movable object.
     * @returns {boolean} True if the movable object is colliding with the given object, false otherwise.
     */
    isColliding(obj) {
        return this.isOverlapping(obj);
    }

    /**
     * Checks if the movable object is hurt (recently hit).
     * @returns {boolean} True if the movable object is hurt, false otherwise.
     */
    isHurt() {
        return this.timePassedSinceLastHit() <= 500;
    }

    /**
     * Checks if the movable object is dead (energy level is 0).
     * @returns {boolean} True if the movable object is dead, false otherwise.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Calculates the time passed since the movable object was last hit.
     * @returns {number} The time passed in milliseconds since the last hit.
     */
    timePassedSinceLastHit() {
        return new Date().getTime() - this.lastHit;
    }

    /**
     * Checks if the last image of the animation is being shown.
     * @param {Array<string>} images - The array of image paths for the animation.
     * @returns {boolean} True if the last image of the animation is shown, false otherwise.
     */
    lastImageIsShown(images) {
        return this.img.src.endsWith(images.at(-1));
    }

    /**
     * Checks if the movable object is in the final zone of the game.
     * @returns {boolean} True if the movable object is in the final zone, false otherwise.
     */
    isInFinalZone() {
        return this.x > MOST_RIGHT_BG * CANVAS_WIDTH - 140;
    }
}