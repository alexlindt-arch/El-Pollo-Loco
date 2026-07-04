/**
 * Class representing the main character in the game.
 * @extends MovableObject
 */
class Character extends MovableObject {
    x = 100;
    y = GROUND_Y;
    width = 610 / 4;
    height = 1200 / 4;
    speed = 10;
    IMAGES_IDLE = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    IMAGES_LONGIDLE = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    IMAGES_WALK = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMP = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_DEATH = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png'
    ];
    IMAGES_DANCE = [
        'assets/img/pepe_dance/J-35.png',
        'assets/img/pepe_dance/J-35.png',
        'assets/img/pepe_dance/J-38.png',
        'assets/img/pepe_dance/J-38.png',
        'assets/img/pepe_dance/J-33.png',
        'assets/img/pepe_dance/J-33.png',
        'assets/img/pepe_dance/J-35.png',
        'assets/img/pepe_dance/J-35.png',
        'assets/img/pepe_dance/J-35.png',
        'assets/img/pepe_dance/J-36.png',
        'assets/img/pepe_dance/J-35_mirrored.png',
        'assets/img/pepe_dance/J-36_mirrored.png',
        'assets/img/pepe_dance/J-35.png',
        'assets/img/pepe_dance/J-36.png',
        'assets/img/pepe_dance/J-35_mirrored.png',
        'assets/img/pepe_dance/J-36_mirrored.png'
    ];
    numberOfImagesToLoad = this.IMAGES_IDLE.length + this.IMAGES_LONGIDLE.length + this.IMAGES_WALK.length + this.IMAGES_JUMP.length + this.IMAGES_HURT.length + this.IMAGES_DEATH.length + this.IMAGES_DANCE.length + 1;
    offset = {
        top: 0.5 * this.height,
        right: 0.3 * this.width,
        bottom: 0.05 * this.height,
        left: 0.2 * this.width
    };
    energyLossPerHit = 5;
    energyGainPerCoin = 1;
    numberOfCoins = 0;
    numberOfBottles = 0;
    lastThrow = 0;
    walking_sound = audioElements['assets/audio/running.mp3'];
    jump_sound = audioElements['assets/audio/jump_voice.mp3'];
    nothingToThrow_sound = audioElements['assets/audio/nothrow.mp3'];
    hurt_sound = audioElements['assets/audio/hurt.mp3'];
    death_sound = audioElements['assets/audio/dead.mp3'];
    sleeping_sound = audioElements['assets/audio/sleep.mp3'];

    /** Creates a Character instance. */
    constructor() {
        super().loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEATH);
        this.loadImages(this.IMAGES_DANCE);

        this.applyGravity();
        this.animate();
        this.playSoundEffects();
    }

    /** Controls the movement of the character and plays the animations. */
    animate() {
        setStoppableInterval(() => this.moveCharacter(), 1000 / 60);
        setStoppableInterval(() => this.playCharacterAnimations(), 100);
    }

    /*--------------------------------------------------
    Move
    ---------------------------------------------------*/
    /** Moves the character according to user input and updates the camera position. */
    moveCharacter() {
        if (this.shallMoveRight()) this.moveRight();
        if (this.shallMoveLeft()) this.moveLeft();
        if (this.shallJump()) this.jump();
        this.world.adjustCameraPosition();
    }

    /**
     * Determines if the character should move right based on user input and its position.
     * @returns {boolean} True if the character should move right, otherwise false.
     */
    shallMoveRight() {
        return this.world.keyboard.RIGHT && this.x + this.width < WORLD_END - 10;
    }

    /**
     * Determines if the character should move left based on user input and its position.
     * @returns {boolean} True if the character should move left, otherwise false.
     */
    shallMoveLeft() {
        return this.world.keyboard.LEFT && this.x > WORLD_START + 10;
    }

    /**
     * Determines if the character should jump based on user input and its position.
     * @returns {boolean} True if the character should jump, otherwise false.
     */
    shallJump() {
        return (this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround();
    }

    /** Moves the character to the right and clears the otherDirection flag. */
    moveRight() {
        super.moveRight();
        this.otherDirection = false;
    }

    /** Moves the character to the left and sets the otherDirection flag. */
    moveLeft() {
        super.moveLeft();
        this.otherDirection = true;
    }

    /** Lets the character move to the center of the canvas and dance (applied when game is won). */
    dance() {
        this.speed = 25;
        this.moveTowardsCenter();
        this.playDanceAnimation();
    }

    /*--------------------------------------------------
    Collect
    ---------------------------------------------------*/
    /**
     * Collects a collectable object (coin or bottle).
     * @param {CollectableObject} obj - The collectable object to be collected.
     */
    collect(obj) {
        obj.collect_sound.currentTime = 0;
        this.world.playSoundIfSwitchedOn(obj.collect_sound);
        if (obj instanceof CollectableBottle) {
            this.collectBottle(obj);
        }
        else if (obj instanceof CollectableCoin) {
            this.collectCoin(obj);
        }
    }

    /**
     * Collects a bottle.
     * @param {CollectableBottle} obj - The bottle to be collected.
     */
    collectBottle(obj) {
        let objIndex = this.world.level.bottles.indexOf(obj);
        this.world.level.bottles.splice(objIndex, 1);
        this.numberOfBottles++;
    }

    /**
     * Collects a coin.
     * @param {CollectableCoin} obj - The coin to be collected.
     */
    collectCoin(obj) {
        let objIndex = this.world.level.coins.indexOf(obj);
        this.world.level.coins.splice(objIndex, 1);
        this.numberOfCoins++;
        this.energy += this.energyGainPerCoin;
    }

    /*--------------------------------------------------
    Fight
    ---------------------------------------------------*/
    /**
     * Throws a bottle.
     * @param {ThrownObject} bottle - The bottle object to be thrown.
     */
    throwBottle(bottle) {
        bottle.throw(this.otherDirection);
        this.numberOfBottles--;
        this.lastThrow = new Date().getTime();
    }

    /**
     * Checks if the character is jumping on a Chicken or BabyChicken.
     * @param {MovableObject} obj - True if the character is walking, otherwise false.
     */
    isJumpingOn(obj) {
        return this.isColliding(obj) && this.isAboveGround();
    }

    /**
     * Kills an enemy (Chicken or BabyChicken) by hitting it with a thrown bottle.
     * @param {ThrownObject} bottle - The thrown bottle.
     * @param {MovableObject} enemy - The enemy to kill.
     */
    killByThrow(bottle, enemy) {
        if (enemy.isDead()) return;
        enemy.hit();
        this.world.deleteThrownBottle(bottle);
        this.world.deleteDeadEnemy(enemy);
    }

    /**
     * Kills an enemy (Chicken or BabyChicken) by jumping on it.
     * @param {MovableObject} enemy - The enemy to kill.
     */
    killByJump(enemy) {
        if (enemy.isDead()) return;
        enemy.hit();
        enemy.smash_sound.currentTime = 0;
        this.world.playSoundIfSwitchedOn(enemy.smash_sound);
        this.world.deleteDeadEnemy(enemy);
        this.jump();
    }

    /**
     * Calculates the time passed since the last throw of a bottle.
     * @returns {number} The time passed in milliseconds.
     */
    timePassedSinceLastThrow() {
        return new Date().getTime() - this.lastThrow; // difference in milliseconds
    }

    /*--------------------------------------------------
    Animations
    ---------------------------------------------------*/
    /** Plays the appropriate character animation based on its state. */
    playCharacterAnimations() {
        if (this.isDead()) {
            if (!this.lastImageIsShown(this.IMAGES_DEATH)) this.playAnimation(this.IMAGES_DEATH);
        }
        else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
        else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMP);
        else if (this.isWalking()) this.playAnimation(this.IMAGES_WALK);
        else {
            if (!this.isSleeping()) this.playAnimation(this.IMAGES_IDLE);
            else this.playAnimation(this.IMAGES_LONGIDLE);
        }
    }

    /** Plays the dance animation. */
    playDanceAnimation() {
        this.playAnimation(this.IMAGES_DANCE);
    }

    /**
     * Checks if the character is walking.
     * @returns {boolean} True if the character is walking, otherwise false.
     */
    isWalking() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    /**
     * Checks if the character is sleeping (idle for a long time).
     * @returns {boolean} True if the character is sleeping, otherwise false.
     */
    isSleeping() {
        return this.world.timePassedSinceLastKeyPress() > 10000 && this.timePassedSinceLastHit() > 5000;
    }

    /*--------------------------------------------------
    SoundEffects
    ---------------------------------------------------*/
    /** Plays sound effects based on the character's actions and state. */
    playSoundEffects() {
        setStoppableInterval(() => {
            if (this.isDead()) {
                this.playSoundIfCharacterIsDead();
                return;
            }
            this.playSoundIfCharacterIsWalking();
            this.playSoundIfCharacterIsJumping();
            this.playSoundIfCharacterIsHurt();
            this.playSoundIfCharacterIsSleeping();
        }, 1000 / 60);
    }

    /** Plays the walking sound effect if the character is walking. */
    playSoundIfCharacterIsWalking() {
        if (this.isWalking()) {
            this.world.playSoundIfSwitchedOn(this.walking_sound);
        }
        else {
            this.walking_sound.pause();
        }
    }

    /** Plays the jumping sound effect if the character is jumping. */
    playSoundIfCharacterIsJumping() {
        if (this.shallJump()) {
            this.world.playSoundIfSwitchedOn(this.jump_sound);
        }
    }

    /** Plays the hurt sound effect if the character is hurt. */
    playSoundIfCharacterIsHurt() {
        if (this.isHurt()) {
            if (this.hurtSoundHasBeenPlayed) return;
            this.hurt_sound.currentTime = 0;
            this.world.playSoundIfSwitchedOn(this.hurt_sound);
            this.hurtSoundHasBeenPlayed = true;
        }
        else {
            this.hurtSoundHasBeenPlayed = false;
        }
    }

    /** Plays the death sound effect if the character is dead. */
    playSoundIfCharacterIsDead() {
        if (this.isDead()) {
            if (this.deathSoundHasBeenPlayed) return;
            this.world.playSoundIfSwitchedOn(this.death_sound);
            this.deathSoundHasBeenPlayed = true;
        }
    }

    /** Plays the sleeping sound effect if the character is sleeping. */
    playSoundIfCharacterIsSleeping() {
        if (this.isSleeping()) {
            this.world.playSoundIfSwitchedOn(this.sleeping_sound);
        }
        else {
            this.sleeping_sound.pause();
        }
    }
}