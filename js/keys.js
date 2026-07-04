/*--------------------------------------------------
Keyboard
---------------------------------------------------*/
/**
 * Listens for the 'keydown' event on the window object and sets the corresponding
 * properties in the `keyboard` object based on the pressed key.
 * @param {KeyboardEvent} e - The 'keydown' event object.
 */
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            keyboard.LEFT = true;
            break;
        case 'ArrowRight':
            keyboard.RIGHT = true;
            break;
        case 'ArrowUp':
            keyboard.UP = true;
            break;
        case 'ArrowDown':
            keyboard.DOWN = true;
            break;
        case ' ':
            e.preventDefault(); // for not toggling sound/music
            keyboard.SPACE = true;
            break;
        case 'd':
            keyboard.D = true;
            break;
    }
});


/**
 * Listens for the 'keyup' event on the window object and resets the corresponding
 * properties in the `keyboard` object based on the released key.
 * @param {KeyboardEvent} e - The 'keyup' event object.
 */
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            keyboard.LEFT = false;
            break;
        case 'ArrowRight':
            keyboard.RIGHT = false;
            break;
        case 'ArrowUp':
            keyboard.UP = false;
            break;
        case 'ArrowDown':
            keyboard.DOWN = false;
            break;
        case ' ':
            keyboard.SPACE = false;
            break;
        case 'd':
            keyboard.D = false;
            break;
    }

    keyboard.lastKeyPress = new Date().getTime();
});


/**
 * Checks if any key relevant to the game is currently pressed.
 * @returns {boolean} `true` if any relevant key is pressed, `false` otherwise.
 */
function aKeyIsPressed() {
    return keyboard.LEFT || keyboard.RIGHT || keyboard.UP || keyboard.DOWN || keyboard.SPACE || keyboard.D;
}


/*--------------------------------------------------
Touchkeys
---------------------------------------------------*/
/**
 * Provides touch keys for mobile devices if the device is a touch-enabled device.
 * It shows the touch keys on the screen and handles touch interactions with them.
 */
function provideTouchKeysForMobileDevices() {
    if (!isTouchDevice()) return;

    showElement('touch-keys');
    handleTouchKeys();
}


/**
 * Handles touch interactions for the touch keys on the screen.
 * Synchronizes touch events with the corresponding keyboard key states in the `keyboard` object.
 */
function handleTouchKeys() {
    synchronizeTouchKeyWithKeyboardKey('touch-key-left', 'LEFT');
    synchronizeTouchKeyWithKeyboardKey('touch-key-right', 'RIGHT');
    synchronizeTouchKeyWithKeyboardKey('touch-key-jump', 'UP');
    synchronizeTouchKeyWithKeyboardKey('touch-key-throw', 'D');
}


/**
 * Synchronizes a touch key's touch events with the corresponding keyboard key states in the `keyboard` object.
 * @param {string} touchKeyId - The ID of the touch key element to synchronize.
 * @param {string} keyName - The name of the keyboard key to synchronize with.
 */
function synchronizeTouchKeyWithKeyboardKey(touchKeyId, keyName) {
    const touchKey = document.getElementById(touchKeyId);
    synchronizeTouchstartWithKeydown(touchKey, keyName);
    synchronizeTouchendWithKeyup(touchKey, keyName);
}


/**
 * Synchronizes a touch key's 'touchstart' event with the corresponding 'keydown' event for a keyboard key.
 * @param {HTMLElement} touchKey - The touch key element to synchronize.
 * @param {string} keyName - The name of the keyboard key to synchronize with.
 */
function synchronizeTouchstartWithKeydown(touchKey, keyName) {
    touchKey.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchKey.style.background = '#a0220a80';
        keyboard[keyName] = true;
    });
}


/**
 * Synchronizes a touch key's 'touchend' event with the corresponding 'keyup' event for a keyboard key.
 * @param {HTMLElement} touchKey - The touch key element to synchronize.
 * @param {string} keyName - The name of the keyboard key to synchronize with.
 */
function synchronizeTouchendWithKeyup(touchKey, keyName) {
    touchKey.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchKey.style.background = 'linear-gradient(to bottom, #ef8b10, #ffc521)';
        keyboard[keyName] = false;

        keyboard.lastKeyPress = new Date().getTime();
    });
}