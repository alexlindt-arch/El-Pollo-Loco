/** Class representing the game world that contains the main character, enemies, collectable objects and more. */
class World {
    character = new Character();
    statusBarHealth = new StatusBarHealth();
    statusBarCoins = new StatusBarCoins();
    statusBarBottles = new StatusBarBottles();
    statusBarEndboss = new StatusBarEndboss();
    thrownObjects = [];
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameOver_sound = audioElements['assets/audio/game-over.mp3'];
    gameWon_music = audioElements['assets/audio/music/won.mp3'];
    gameLost_music = audioElements['assets/audio/music/lost.mp3'];
    background_music = audioElements['assets/audio/music/game-bg.mp3'];
    endbossAppears_music = audioElements['assets/audio/music/endboss-appears.mp3'];
    gameOverSoundHasBeenPlayed = false;
    startImagesAreLoaded = false;

    /**
     * Creates a World instance and initializes the game.
     * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d'); // defines functions/settings for insertion of images
        this.ctx.font = '20px "boogaloo", Arial, Helvetica, sans-serif';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.playBackgroundMusic();
        this.runGame();
    }

    /*--------------------------------------------------
    Prepare and Run Game
    ---------------------------------------------------*/
    /** Checks if the start images are loaded and sets the flag accordingly. */
    checkIfStartImagesAreLoaded() {
        if (this.startImagesAreLoaded) return;

        if (
            this.character.allImagesAreLoaded() &&
            this.statusBarHealth.allImagesAreLoaded() &&
            this.statusBarCoins.allImagesAreLoaded() &&
            this.statusBarBottles.allImagesAreLoaded() &&
            this.level.clouds.every(obj => obj.allImagesAreLoaded()) &&
            this.level.backgroundObjects.every(obj => obj.allImagesAreLoaded())
        ) {
            this.startImagesAreLoaded = true;
        }
    }

    /** Sets the world references for character and enemies. */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
    }

    /** Plays the background music and handles endboss appearance music. */
    playBackgroundMusic() {
        setStoppableInterval(() => {
            this.playMusicIfSwitchedOn(this.background_music);

            if (this.character.hasBeenInFinalZone) {
                this.background_music.pause();
                this.playMusicIfSwitchedOn(this.endbossAppears_music);
            }
        }, 100);
    }

    /** Runs the main game loop for various game events and checks. */
    runGame() {
        setStoppableInterval(() => {
            this.checkCollisions();
            this.checkThrows();
            this.checkChickenKills();
            this.checkEnteringFinalZone();
            this.checkEndbossHits();
        }, 50);
        setInterval(() => {
            this.checkGameOver();
        }, 300);
    }

    /**
     * Calculates the time passed since the last key press.
     * @returns {number} The time passed in milliseconds.
     */
    timePassedSinceLastKeyPress() {
        return aKeyIsPressed() ? 0 : (new Date().getTime() - this.keyboard.lastKeyPress);
    }

    /*--------------------------------------------------
    Collisions
    ---------------------------------------------------*/
    /** 
     * Checks for collisions between the character and enemies, as well as collectable objects. 
     * Updates the statusbars accordingly.
     */
    checkCollisions() {
        this.checkCollisionWithEnemies();
        this.checkCollisionWithCollectableObjects(this.level.bottles);
        this.checkCollisionWithCollectableObjects(this.level.coins);
        this.updateStatusBars();
    }

    /** Checks for collisions between the character and enemies. */
    checkCollisionWithEnemies() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !this.character.isAboveGround()) {
                const energyLossFactor = enemy instanceof Endboss ? 3 : 1;
                this.character.hit(energyLossFactor);
            }
        });
    }

    /**
     * Checks for collisions between the character and collectable objects.
     * @param {Array<CollectableObject>} collectableObjects - An array of collectable objects to check collisions with.
     */
    checkCollisionWithCollectableObjects(collectableObjects) {
        collectableObjects.forEach(obj => {
            if (this.character.isColliding(obj)) {
                this.character.collect(obj);
            }
        });
    }

    /** Updates the status bars based on the character's state and collected items. */
    updateStatusBars() {
        const coinsPercentage = (100 / this.level.numberOfCoins) * this.character.numberOfCoins;
        const bottlesPercentage = (100 / this.level.numberOfBottles) * this.character.numberOfBottles;

        this.statusBarHealth.setPercentage(this.character.energy);
        this.statusBarCoins.setPercentage(coinsPercentage);
        this.statusBarBottles.setPercentage(bottlesPercentage);
        this.statusBarEndboss.setPercentage(this.level.endboss.energy);
    }

    /*--------------------------------------------------
    Throws
    ---------------------------------------------------*/
    /** Checks for the throw action and creates a thrown object if possible. */
    checkThrows() {
        if (!this.keyboard.D) return;
        if (this.character.timePassedSinceLastThrow() < 500) return;
        if (this.character.numberOfBottles === 0) {
            this.character.nothingToThrow_sound.currentTime = 0;
            this.playSoundIfSwitchedOn(this.character.nothingToThrow_sound);
            return;
        }

        this.createAndThrowObject();
    }

    /** Creates and throws a bottle from the character's position. */
    createAndThrowObject() {
        const bottle_x = this.character.x + 0.6 * this.character.width;
        const bottle_y = this.character.y + 0.4 * this.character.height;
        const bottle = new ThrownObject(bottle_x, bottle_y, this);

        this.thrownObjects.push(bottle);
        this.character.throwBottle(bottle);
    }

    /*--------------------------------------------------
    Kills
    ---------------------------------------------------*/
    /** Checks for chicken (enemy) kills using jumping or thrown bottles. */
    checkChickenKills() {
        this.level.enemies.forEach(chicken => {
            if (chicken instanceof Endboss) return;
            this.checkKillByJump(chicken);
            this.checkKillByThrow(chicken);
        });
    }

    /**
     * Checks if the character killed a chicken by jumping on it.
     * @param {MovableObject} chicken - The chicken enemy to check.
     */
    checkKillByJump(chicken) {
        if (this.character.isJumpingOn(chicken)) {
            this.character.killByJump(chicken);
        }
    }

    /**
     * Checks if the character killed a chicken by throwing a bottle at it.
     * @param {MovableObject} chicken - The chicken enemy to check.
     */
    checkKillByThrow(chicken) {
        this.thrownObjects.forEach(bottle => {
            if (bottle.isColliding(chicken)) {
                this.character.killByThrow(bottle, chicken);
            }
        });
    }

    /**
     * Deletes a thrown bottle from the world after a delay.
     * @param {ThrownObject} bottle - The thrown bottle to delete.
     */
    deleteThrownBottle(bottle) {
        setTimeout(() => {
            let bottleIndex = this.thrownObjects.indexOf(bottle);
            this.thrownObjects.splice(bottleIndex, 1);
        }, 300);
    }

    /** Deletes dead enemies from the world. */
    deleteDeadEnemies() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead()) deleteDeadEnemy(enemy);
        });
    }

    /**
     * Deletes a dead enemy from the world after a delay.
     * @param {MovableObject} enemy - The dead enemy to delete.
     */
    deleteDeadEnemy(enemy) {
        setTimeout(() => {
            let enemyIndex = this.level.enemies.indexOf(enemy);
            this.level.enemies.splice(enemyIndex, 1);
        }, 500);
    }

    /** Deletes all enemies from the world (applied if game is won). */
    deleteAllEnemies() {
        this.level.enemies = [];
    }

    /*--------------------------------------------------
    Final Zone
    ---------------------------------------------------*/
    /** Checks if the character has entered the final zone. */
    checkEnteringFinalZone() {
        if (this.character.hasBeenInFinalZone) return;
        if (this.character.isInFinalZone()) this.character.hasBeenInFinalZone = true;
    }

    /*--------------------------------------------------
    Endboss
    ---------------------------------------------------*/
    /** Checks for hits on the endboss by the thrown bottles. */
    checkEndbossHits() {
        this.thrownObjects.forEach(bottle => {
            if (bottle.isColliding(this.level.endboss)) {
                this.level.endboss.hit();
                this.deleteThrownBottle(bottle);
                this.level.endboss.speed += 0.1;
            }
        });
        this.updateStatusBars();
    }

    /*--------------------------------------------------
    Game Over
    ---------------------------------------------------*/
    /** Checks if the game is over (character is dead or endboss is dead). */
    checkGameOver() {
        if (this.character.isDead()) {
            setTimeout(() => this.onLostGame(), 800);
        }
        else if (this.level.endboss.isDead()) {
            if (!this.level.endboss.hasDied) {
                this.level.endboss.hasDied = true;
                this.level.endboss.speedY = 0;
            }
            setTimeout(() => {
                if (this.character.isDead()) return;
                this.onWonGame();
            }, 1000);
        }
    }

    /** Handles the game over state when the character loses. */
    onLostGame() {
        this.stopBackgroundSounds();
        this.playGameOverSound();
        clearStoppableIntervals();
        setTimeout(() => this.endGameOnLoss(), 2000);
    }

    /** Handles the game over state when the character wins. */
    onWonGame() {
        this.stopBackgroundSounds();
        clearStoppableIntervals();
        setTimeout(() => this.endGameOnWin(), 1000);
        setTimeout(() => this.character.dance(), 2800);
    }

    /** Stops the background sounds when the game ends. */
    stopBackgroundSounds() {
        this.background_music.pause();
        this.endbossAppears_music.pause();
        this.character.walking_sound.pause();
    }

    /** Plays the game over sound if it hasn't been played yet. */
    playGameOverSound() {
        if (!this.gameOverSoundHasBeenPlayed) {
            this.playSoundIfSwitchedOn(this.gameOver_sound);
            this.gameOverSoundHasBeenPlayed = true;
        }
    }

    /** Ends the game when the character loses. */
    endGameOnLoss() {
        if (gameIsRunning) {
            gameIsRunning = false;
            gameIsLost = true;
            this.setupEndScreen('end-screen-lost');
        }
        this.playMusicIfSwitchedOn(this.gameLost_music);
    }

    /** Ends the game when the character wins. */
    endGameOnWin() {
        if (gameIsRunning) {
            gameIsRunning = false;
            gameIsWon = true;
            this.setupEndScreen('end-screen-won');
            this.deleteAllEnemies();
        }
        this.playMusicIfSwitchedOn(this.gameWon_music);
    }

    /**
     * Sets up the end screen based on game result.
     * @param {string} screenId - The ID of the end screen to set up.
     */
    setupEndScreen(screenId) {
        removeElement('touch-keys');
        showEndScreen(screenId);
        if (document.getElementById('info-screen').classList.contains('full-opacity')) {
            toggleEndScreen(screenId);
        }
    }

    /*--------------------------------------------------
    Draw
    ---------------------------------------------------*/
    /** Adjusts the camera position to follow the character. */
    adjustCameraPosition() {
        const desiredLeftEdge = this.character.x - 100;
        if (desiredLeftEdge < MOST_RIGHT_BG * CANVAS_WIDTH && desiredLeftEdge > WORLD_START)
            this.camera_x = -desiredLeftEdge;
    }

    /** Draws all elements in the game world on the canvas. */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0); // objects depend on camera
        this.drawBackground();
        this.drawCollectableObjects();
        this.drawThrownObjects();
        this.ctx.translate(-this.camera_x, 0); // to add fixed objects
        this.drawStatusBars();
        this.ctx.translate(this.camera_x, 0);
        this.drawCharacter();
        this.drawEnemies();
        this.ctx.translate(-this.camera_x, 0);
        this.callDrawFunctionRepeatedly();
    }

    /** Draws the background elements (background objects and clouds). */
    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    }

    /** Draws the collectable objects (bottles and coins). */
    drawCollectableObjects() {
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
    }

    /** Draws the thrown objects (bottles). */
    drawThrownObjects() {
        this.addObjectsToMap(this.thrownObjects);
    }

    /** Draws the status bars for character and endboss. */
    drawStatusBars() {
        this.drawStatusBarsOfCharacter();
        this.drawStatusBarOfEndboss();
    }

    /** Draws the status bars of the character (health, coins, bottles). */
    drawStatusBarsOfCharacter() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.ctx.fillText(this.character.energy, ...this.getStatusBarCoordinates(this.statusBarHealth));
        this.ctx.fillText(this.character.numberOfCoins, ...this.getStatusBarCoordinates(this.statusBarCoins));
        this.ctx.fillText(this.character.numberOfBottles, ...this.getStatusBarCoordinates(this.statusBarBottles));
    }

    /** Draws the status bar of the endboss (health). */
    drawStatusBarOfEndboss() {
        if (this.character.hasBeenInFinalZone) {
            this.addToMap(this.statusBarEndboss);
            this.ctx.textAlign = 'right';
            this.ctx.fillText(this.level.endboss.energy, ...this.getStatusBarCoordinates(this.statusBarEndboss));
            this.ctx.textAlign = 'center';
        }
    }

    /** Draws the character on the canvas. */
    drawCharacter() {
        this.addToMap(this.character);
    }

    /** Draws the enemies (chickens) on the canvas. */
    drawEnemies() {
        this.addObjectsToMap(this.level.enemies);
    }

    /** Calls the draw function repeatedly for smooth animation. */
    callDrawFunctionRepeatedly() {
        let self = this;
        requestAnimationFrame(() => self.draw());
    }

    /**
     * Adds multiple objects to the map (canvas) for drawing.
     * @param {Array<DrawableObject>} objects - An array of objects to be added to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    /**
     * Adds a single object to the map (canvas) for drawing.
     * @param {DrawableObject} object - The object to be added to the map.
     */
    addToMap(object) {
        this.flipImageIfNecessary(object);

        try {
            object.draw(this.ctx);
            // object.drawFrames(this.ctx);
        } catch (error) {
            console.warn(error);
            console.log(object);
        }

        this.flipImageBackIfNecessary(object);
    }

    /**
     * Flips an image horizontally if required for mirroring effect.
     * @param {MovableObject} object - The object whose image needs flipping.
     */
    flipImageIfNecessary(object) {
        if (object instanceof MovableObject && object.otherDirection)
            this.flipImage(object);
    }

    /**
     * Flips back the image horizontally if it was previously flipped.
     * @param {MovableObject} object - The object whose image needs flipping back.
     */
    flipImageBackIfNecessary(object) {
        if (object instanceof MovableObject && object.otherDirection)
            this.flipImageBack(object);
    }

    /**
     * Flips the image horizontally to create a mirrored effect.
     * @param {MovableObject} object - The object whose image needs flipping.
     */
    flipImage(object) {
        this.ctx.save(); // saves current ctx settings for later recovery
        this.ctx.translate(object.width, 0); // future inserted images will be shifted to the right by object.width (x-axis)
        this.ctx.scale(-1, 1); // future inserted images will be mirrored along x-axis
        object.x *= -1;
    }

    /**
     * Flips back the image to revert the mirrored effect.
     * @param {MovableObject} object - The object whose image needs flipping back.
     */
    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore(); // recovers saved ctx settings
    }

    /**
     * Retrieves the coordinates for drawing a text on a status bar.
     * @param {StatusBar} statusBar - The status bar to position the text.
     * @returns {Array<number>} The x and y coordinates for drawing the text.
     */
    getStatusBarCoordinates(statusBar) {
        let x = statusBar.x + statusBar.width + 18;
        let y = statusBar.y + 0.8 * statusBar.height;

        if (statusBar === this.statusBarEndboss) {
            x = statusBar.x - 5;
            y = statusBar.y + 0.6 * statusBar.height;
        }
        return [x, y];
    }

    /**
     * Gets the current background number based on the character's position.
     * @returns {number} The current background number.
     */
    getCurrentBackground() {
        let currentBackground;
        this.level.backgroundObjects.forEach((bg) => {
            if (bg.x <= this.character.x && this.character.x < bg.x + CANVAS_WIDTH) {
                currentBackground = Math.floor(this.level.backgroundObjects.indexOf(bg) / 4) + MOST_LEFT_BG;
                return;
            }
        });
        return currentBackground;
    }

    /*--------------------------------------------------
    Soundsettings
    ---------------------------------------------------*/
    /**
     * Plays the sound if sound is enabled, or pauses it otherwise.
     * @param {HTMLAudioElement} soundObject - The audio element to play or pause.
     */
    playSoundIfSwitchedOn(soundObject) {
        if (soundIsOn) {
            try {
                const p = soundObject.play();
                if (p && p.catch) p.catch(() => {});
            } catch (error) {
                console.warn('Error playing sound', error);
                console.log('Unable to play sound', soundObject);
            }
        } else {
            soundObject.pause();
        }
    }

    /**
     * Plays the music if music is enabled, or pauses it otherwise.
     * @param {HTMLAudioElement} musicObject - The audio element to play or pause.
     */
    playMusicIfSwitchedOn(musicObject) {
        if (musicIsOn) {
            try {
                const p = musicObject.play();
                if (p && p.catch) p.catch(() => {});
            } catch (error) {
                console.warn('Error playing music', error);
                console.log('Unable to play music', musicObject);
            }
        } else {
            musicObject.pause();
        }
    }
}