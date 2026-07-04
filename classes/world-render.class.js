/**
 * Rendering and sound methods of the World class.
 * These are attached to World.prototype to keep the main world.class.js file
 * within the 400 lines-of-code limit while remaining part of the same class.
 */
Object.assign(World.prototype, {

    /*--------------------------------------------------
    Draw
    ---------------------------------------------------*/
    /** Adjusts the camera position to follow the character. */
    adjustCameraPosition() {
        const desiredLeftEdge = this.character.x - 100;
        if (desiredLeftEdge < MOST_RIGHT_BG * CANVAS_WIDTH && desiredLeftEdge > WORLD_START)
            this.camera_x = -desiredLeftEdge;
    },

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
    },

    /** Draws the background elements (background objects and clouds). */
    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    },

    /** Draws the collectable objects (bottles and coins). */
    drawCollectableObjects() {
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
    },

    /** Draws the thrown objects (bottles). */
    drawThrownObjects() {
        this.addObjectsToMap(this.thrownObjects);
    },

    /** Draws the status bars for character and endboss. */
    drawStatusBars() {
        this.drawStatusBarsOfCharacter();
        this.drawStatusBarOfEndboss();
    },

    /** Draws the status bars of the character (health, coins, bottles). */
    drawStatusBarsOfCharacter() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.ctx.fillText(this.character.energy, ...this.getStatusBarCoordinates(this.statusBarHealth));
        this.ctx.fillText(this.character.numberOfCoins, ...this.getStatusBarCoordinates(this.statusBarCoins));
        this.ctx.fillText(this.character.numberOfBottles, ...this.getStatusBarCoordinates(this.statusBarBottles));
    },

    /** Draws the status bar of the endboss (health). */
    drawStatusBarOfEndboss() {
        if (this.character.hasBeenInFinalZone) {
            this.addToMap(this.statusBarEndboss);
            this.ctx.textAlign = 'right';
            this.ctx.fillText(this.level.endboss.energy, ...this.getStatusBarCoordinates(this.statusBarEndboss));
            this.ctx.textAlign = 'center';
        }
    },

    /** Draws the character on the canvas. */
    drawCharacter() {
        this.addToMap(this.character);
    },

    /** Draws the enemies (chickens) on the canvas. */
    drawEnemies() {
        this.addObjectsToMap(this.level.enemies);
    },

    /** Calls the draw function repeatedly for smooth animation. */
    callDrawFunctionRepeatedly() {
        let self = this;
        requestAnimationFrame(() => self.draw());
    },

    /**
     * Adds multiple objects to the map (canvas) for drawing.
     * @param {Array<DrawableObject>} objects - An array of objects to be added to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    },

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
            // Object could not be drawn (e.g. image not ready) – skip it.
        }

        this.flipImageBackIfNecessary(object);
    },

    /**
     * Flips an image horizontally if required for mirroring effect.
     * @param {MovableObject} object - The object whose image needs flipping.
     */
    flipImageIfNecessary(object) {
        if (object instanceof MovableObject && object.otherDirection)
            this.flipImage(object);
    },

    /**
     * Flips back the image horizontally if it was previously flipped.
     * @param {MovableObject} object - The object whose image needs flipping back.
     */
    flipImageBackIfNecessary(object) {
        if (object instanceof MovableObject && object.otherDirection)
            this.flipImageBack(object);
    },

    /**
     * Flips the image horizontally to create a mirrored effect.
     * @param {MovableObject} object - The object whose image needs flipping.
     */
    flipImage(object) {
        this.ctx.save(); // saves current ctx settings for later recovery
        this.ctx.translate(object.width, 0); // future inserted images will be shifted to the right by object.width (x-axis)
        this.ctx.scale(-1, 1); // future inserted images will be mirrored along x-axis
        object.x *= -1;
    },

    /**
     * Flips back the image to revert the mirrored effect.
     * @param {MovableObject} object - The object whose image needs flipping back.
     */
    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore(); // recovers saved ctx settings
    },

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
    },

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
    },

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
                // Playback blocked or file missing – ignore.
            }
        } else {
            soundObject.pause();
        }
    },

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
                // Playback blocked or file missing – ignore.
            }
        } else {
            musicObject.pause();
        }
    }

});
