/** 
 * Class representing the Endboss chicken.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    y = GROUND_Y;
    width = 1045 / 4;
    height = 1217 / 4;
    speed = 1;
    IMAGES_WALK = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    IMAGES_DEATH = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    numberOfImagesToLoad = this.IMAGES_WALK.length + this.IMAGES_ALERT.length + this.IMAGES_ATTACK.length + this.IMAGES_HURT.length + this.IMAGES_DEATH.length + 1;
    offset = {
        top: 0.2 * this.height,
        right: 0.1 * this.width,
        bottom: 0.1 * this.height,
        left: 0.05 * this.width
    };
    energyLossPerHit = 10;
    animationCount = 0;
    walking_sound = audioElements['assets/audio/endboss_walk.mp3'];
    alert_sound = audioElements['assets/audio/endboss_alert.mp3'];
    attack_sound = audioElements['assets/audio/endboss_attack.mp3'];
    hurt_sound = audioElements['assets/audio/endboss_hurt.mp3'];
    death_sound = audioElements['assets/audio/endboss_dead.mp3'];
    alertSoundHasBeenPlayed = false;
    attackSoundHasBeenPlayed = false;

    /**
     * Constructs an Endboss instance.
     * Loads all required images and sets initial position and animations.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEATH);

        this.x = WORLD_END - this.width;
        this.applyGravity();
        this.animate();
        this.playSoundEffects();
    }

    /** Controls the movement of the endboss and plays the corresponding animations. */
    animate() {
        setStoppableInterval(() => this.moveEndboss(), 1000 / 60);
        setStoppableInterval(() => this.playEndbossAnimations(), 200);
    }

    /*--------------------------------------------------
    Move
    ---------------------------------------------------*/
    /** Moves the endboss based on its state and the position of the character. */
    moveEndboss() {
        if (this.isWalking()) {
            setTimeout(() => this.moveTowardsCharacter(), 300);
        }
        if (this.shallJump()) {
            this.turnTowardsCharacter();
            this.jump();
        }
        if (this.isAboveGround()) {
            this.moveFast(3);
        }
    }

    /** Turns the endboss towards the character based on their relative positions. */
    turnTowardsCharacter() {
        if (this.characterIsRight()) {
            this.otherDirection = true;
        }
        else if (this.characterIsLeft()) {
            this.otherDirection = false;
        }
    }

    /** Moves the endboss towards the character. */
    moveTowardsCharacter() {
        if (this.characterIsRight()) {
            this.moveRight();
        }
        else if (this.characterIsLeft()) {
            this.moveLeft();
        }
    }

    /**
     * Checks if the character is to the right of the endboss.
     * @returns {boolean} True if the character is to the right, false otherwise.
     */
    characterIsRight() {
        return this.x + 0.5 * this.width < this.world.character.x + 0.5 * this.world.character.width;
    }

    /**
     * Checks if the character is to the left of the endboss.
     * @returns {boolean} True if the character is to the left, false otherwise.
     */
    characterIsLeft() {
        return !this.characterIsRight();
    }

    /** Moves the endboss to the right and sets the otherDirection flag. */
    moveRight() {
        super.moveRight();
        this.otherDirection = true;
    }

    /** Moves the endboss to the left and clears the otherDirection flag. */
    moveLeft() {
        super.moveLeft();
        this.otherDirection = false;
    }

    /**
     * Moves the endboss with increased speed (applied on jumping).
     * @param {number} speedFactor - The factor to increase the speed.
     */
    moveFast(speedFactor) {
        let sgn = this.otherDirection ? 1 : -1;
        this.x = this.x + sgn * speedFactor * this.speed;
    }

    /**
     * Checks if the endboss shall jump based on its state and position.
     * @returns {boolean} True if the endboss shall jump, false otherwise.
     */
    shallJump() {
        return this.isAttacking() && !this.isAboveGround();
    }

    /*--------------------------------------------------
    Animations
    ---------------------------------------------------*/
    /** Plays the appropriate endboss animation based on its state and the character's position. */
    playEndbossAnimations() {
        if (!this.world.character.hasBeenInFinalZone) {
            this.animationCount = 0;
            return;
        }
        if (this.isDead()) {
            if (!this.lastImageIsShown(this.IMAGES_DEATH)) this.playAnimation(this.IMAGES_DEATH);
        }
        else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
        else if (this.isAlert()) this.playAnimation(this.IMAGES_ALERT);
        else if (this.isAttacking()) this.playAnimation(this.IMAGES_ATTACK);
        else this.playAnimation(this.IMAGES_WALK);
        this.animationCount++;
    }

    /**
     * Checks if the endboss is in alert state.
     * @returns {boolean} True if the endboss is in alert state, false otherwise.
     */
    isAlert() {
        let alertAtFirstContact = (this.animationCount < 8);
        let alertAfterHit = (this.timePassedSinceLastHit() > 500 && this.timePassedSinceLastHit() <= 800);
        let alertAfterAttack = (this.timePassedSinceLastHit() > 1600 && this.timePassedSinceLastHit() <= 2800);
        return alertAtFirstContact || alertAfterHit || alertAfterAttack;
    }

    /**
     * Checks if the endboss is in attacking state.
     * @returns {boolean} True if the endboss is in attacking state, false otherwise.
     */
    isAttacking() {
        return this.timePassedSinceLastHit() > 800 && this.timePassedSinceLastHit() <= 1600;
    }

    /**
     * Checks if the endboss is in walking state.
     * @returns {boolean} True if the endboss is in walking state, false otherwise.
     */
    isWalking() {
        return this.world.character.hasBeenInFinalZone && !(this.isAlert() || this.isAttacking() || this.isHurt() || this.isDead());
    }

    /*--------------------------------------------------
    SoundEffects
    ---------------------------------------------------*/
    /** Plays sound effects based on the endboss's state. */
    playSoundEffects() {
        setStoppableInterval(() => {
            if (!this.world.character.hasBeenInFinalZone) return;
            if (this.isDead()) {
                this.playSoundIfEndbossIsDead();
                return;
            }
            this.playSoundIfEndbossIsWalking();
            this.playSoundIfEndbossIsAlert();
            this.playSoundIfEndbossIsAttacking();
            this.playSoundIfEndbossIsHurt();
        }, 100);
    }

    /** Plays the walking sound effect if the endboss is walking. */
    playSoundIfEndbossIsWalking() {
        if (this.isWalking() && !this.world.character.isDead()) {
            this.world.playSoundIfSwitchedOn(this.walking_sound);
        }
        else {
            this.walking_sound.pause();
        }
    }

    /** Plays the alert sound effect if the endboss is in alert state. */
    playSoundIfEndbossIsAlert() {
        if (this.isAlert()) {
            if (this.alertSoundHasBeenPlayed) return;
            setTimeout(() => {
                this.world.playSoundIfSwitchedOn(this.alert_sound);
            }, 1000);
            this.alertSoundHasBeenPlayed = true;
        }
        else {
            this.alertSoundHasBeenPlayed = false;
        }
    }

    /** Plays the attack sound effect if the endboss is in attacking state. */
    playSoundIfEndbossIsAttacking() {
        if (this.isAttacking()) {
            if (this.attackSoundHasBeenPlayed) return;
            this.world.playSoundIfSwitchedOn(this.attack_sound);
            this.attackSoundHasBeenPlayed = true;
        }
        else {
            this.attackSoundHasBeenPlayed = false;
        }
    }

    /** Plays the hurt sound effect if the endboss is hurt. */
    playSoundIfEndbossIsHurt() {
        if (this.isHurt()) {
            if (this.hurtSoundHasBeenPlayed) return;
            this.world.playSoundIfSwitchedOn(this.hurt_sound);
            this.hurtSoundHasBeenPlayed = true;
        }
        else {
            this.hurtSoundHasBeenPlayed = false;
        }
    }

    /** Plays the death sound effect if the endboss is dead. */
    playSoundIfEndbossIsDead() {
        if (this.isDead()) {
            if (this.deathSoundHasBeenPlayed) return;
            this.world.playSoundIfSwitchedOn(this.death_sound);
            this.deathSoundHasBeenPlayed = true;
        }
    }
}