/** 
 * Class representing an object thrown by the character.
 * @extends MovableObject
 */
class ThrownObject extends MovableObject {
    width = 400 / 5;
    height = 400 / 5;
    speedY = 0;
    acceleration = 2.5;
    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    numberOfImagesToLoad = this.IMAGES_SPLASH.length + 1;
    hasBeenThrown = false;
    flyInterval;
    checkHitInterval;
    throw_sound = audioElements['assets/audio/throw.mp3'];
    break_sound = audioElements['assets/audio/bottle_break.mp3'];

    /**
     * Creates an instance of ThrownObject.
     * @param {number} x - The initial x-coordinate of the thrown object.
     * @param {number} y - The initial y-coordinate of the thrown object.
     * @param {World} world - The game world in which the object exists.
     */
    constructor(x, y, world) {
        super().loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;
        this.world = world;
    }

    /**
     * Throws the object in the specified direction.
     * @param {boolean} otherDirection - If true, the object is thrown in the opposite direction.
     */
    throw(otherDirection = false) {
        this.fly(otherDirection);
        this.playSoundEffect();
        this.checkHit();
    }

    /**
     * Initiates the flying motion of the thrown object in the specified direction.
     * @param {boolean} otherDirection - If true, the object is thrown in the opposite direction.
     */
    fly(otherDirection) {
        let sgn = otherDirection ? -1 : 1;
        this.speedY = 20;
        this.applyGravity();

        this.flyInterval = setInterval(() => {
            this.x += sgn * 10;
        }, 25);
    }

    /**
     * Plays the sound effect for when the object is thrown.
     */
    playSoundEffect() {
        this.throw_sound.currentTime = 0;
        this.world.playSoundIfSwitchedOn(this.throw_sound);
    }

    /**
     * Checks for collisions with enemies during the object's flight and performs a splash animation if a collision occurs.
     */
    checkHit() {
        this.checkHitInterval = setInterval(() => {
            this.world.level.enemies.forEach(enemy => this.splashWhenHitting(enemy));
        }, 50);

        setTimeout(() => {
            this.hasBeenThrown = true;
            clearInterval(this.checkHitInterval);
        }, 3000);
    }

    /**
     * Performs a splash animation when the object hits an enemy.
     * @param {MovableObject} enemy - The enemy object to check for collision with the thrown object.
     */
    splashWhenHitting(enemy) {
        if (this.isColliding(enemy)) {
            this.playAnimation(this.IMAGES_SPLASH);
            if (this.hasBeenThrown) return;

            this.playSplashSound();
            this.stopGravity();
            clearInterval(this.flyInterval);
            this.hasBeenThrown = true;
        }
    }

    /**
     * Plays the sound effect for when the object breaks/splashes.
     */
    playSplashSound() {
        this.throw_sound.pause();
        this.break_sound.currentTime = 0;
        this.world.playSoundIfSwitchedOn(this.break_sound);
    }
}