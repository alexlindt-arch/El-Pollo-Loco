/**
 * Event listener for the 'resize' event on the window object.
 * Calls 'resizeCanvasContent()' whenever the window is resized.
 */
window.addEventListener('resize', resizeCanvasContent);


/**
 * Resizes various elements of the canvas content based on the current canvas dimensions.
 */
function resizeCanvasContent() {
    resizeMenuBar();
    resizePlayButton();
    resizeReplayButton();
    resizeEndScreen();
    resizeInfoScreen();
    resizeTouchKeys();
}


/**
 * Resizes the menu bar, including the sound icon, info icon, and fullscreen icon.
 */
function resizeMenuBar() {
    const menuBar = document.getElementById('menu-bar');
    menuBar.style.gap = `${0.045 * getCanvasWidth()}px`;
    menuBar.style.top = `${0.03 * getCanvasWidth()}px`;
    menuBar.style.right = `${0.03 * getCanvasWidth()}px`;

    resizeSoundIcon();
    resizeInfoIcon();
    resizeFullscreenIcon();
}


/**
 * Resizes the sound icon.
 */
function resizeSoundIcon() {
    const soundIcon = document.getElementById('sound-btn-icon');
    if (musicIsOn) {
        soundIcon.style.width = `${0.045 * getCanvasWidth()}px`;
    }
    else {
        soundIcon.style.width = `${0.04 * getCanvasWidth()}px`;
    }
}


/**
 * Resizes the info icon.
 */
function resizeInfoIcon() {
    const infoIcon = document.getElementById('info-btn-icon');
    infoIcon.style.width = `${0.045 * getCanvasWidth()}px`;
}


/**
 * Resizes the fullscreen icon.
 */
function resizeFullscreenIcon() {
    const fullscreenIcon = document.getElementById('fullscreen-btn-icon');
    fullscreenIcon.style.width = `${0.04 * getCanvasWidth()}px`;
}


/**
 * Resizes the play button.
 */
function resizePlayButton() {
    const playBtn = document.getElementById('play-btn-img');
    const width = 0.5 * Math.min(getCanvasWidth(), getCanvasHeight());
    playBtn.style.width = `${width}px`;
}


/**
 * Resizes the replay button.
 */
function resizeReplayButton() {
    const replayBtn = document.getElementById('replay-btn');
    replayBtn.style.fontSize = `${0.056 * getCanvasWidth()}px`;
}


/**
  * Resizes the end screen elements.
  */
function resizeEndScreen() {
    const endScreenWon = document.getElementById('end-screen-won');
    const endScreenCircle = document.getElementById('end-screen-circle');
    endScreenWon.style.fontSize = `${0.2 * getCanvasHeight()}px`;
    endScreenCircle.style.width = `${0.6 * getCanvasHeight()}px`;
    endScreenCircle.style.height = `${0.6 * getCanvasHeight()}px`;
    endScreenCircle.style.marginBottom = `${0.05 * getCanvasHeight()}px`;
}


/**
 * Resizes the info screen content.
 */
function resizeInfoScreen() {
    const infoContent = document.getElementById('info-content');
    infoContent.style.fontSize = `${0.06 * getCanvasHeight()}px`;

    resizeInfoScreenIcons();
}


/**
 * Resizes the icons and keys displayed on the info screen.
 */
function resizeInfoScreenIcons() {
    const iconCell = document.getElementsByClassName('icon-td');
    Array.from(iconCell).forEach((cell) => {
        cell.style.height = `${0.0888 * getCanvasWidth()}px`;
        cell.style.paddingRight = `${0.111 * getCanvasWidth()}px`;
        cell.style.paddingLeft = `${0.0111 * getCanvasWidth()}px`;
    });

    resizeInfoScreenKeys();
    resizeInfoScreenSoundOptions();
}


/**
 * Resizes the keys displayed on the info screen.
 */
function resizeInfoScreenKeys() {
    const keys = document.getElementsByClassName('key');
    const keySeparator = document.getElementById('key-separator');

    Array.from(keys).forEach((key) => {
        key.style.width = `${0.1 * getCanvasHeight()}px`;
        key.style.height = `${0.1 * getCanvasHeight()}px`;
        key.style.fontSize = `${0.045 * getCanvasWidth()}px`;
    });

    keySeparator.style.fontSize = `${0.1 * getCanvasHeight()}px`;
    keySeparator.style.marginLeft = `${0.033 * getCanvasHeight()}px`;
    keySeparator.style.marginRight = `${0.033 * getCanvasHeight()}px`;
}


/**
 * Resizes the sound options displayed on the info screen.
 */
function resizeInfoScreenSoundOptions() {
    const soundOptions = document.getElementsByClassName('sound-option');
    const soundDescription = document.getElementById('sound-description-text');

    Array.from(soundOptions).forEach((so) => {
        so.style.width = `${0.1 * getCanvasHeight()}px`;
        so.style.height = `${0.1 * getCanvasHeight()}px`;
    });

    soundDescription.marginBottom = `${0.033 * getCanvasHeight()}px`;
}


/**
 * Resizes the touch keys container and the touch keys themselves.
 */
function resizeTouchKeys() {
    const touchKeyContainer = document.getElementById('touch-keys');
    const touchKeyContainerLeft = document.getElementById('touch-keys-lefthand');
    const touchKeyContainerRight = document.getElementById('touch-keys-righthand');
    const touchKeys = document.getElementsByClassName('touch-key');

    touchKeyContainer.style.padding = `${0.015 * getCanvasWidth()}px ${0.045 * getCanvasWidth()}px`;
    touchKeyContainerLeft.style.gap = `${0.05 * getCanvasWidth()}px`;
    touchKeyContainerRight.style.gap = `${0.05 * getCanvasWidth()}px`;

    Array.from(touchKeys).forEach((key) => {
        key.style.width = `${0.16 * getCanvasHeight()}px`;
        key.style.height = `${0.16 * getCanvasHeight()}px`;
    });
}


/**
 * Calculates the canvas width based on the current fullscreen status and available space.
 * @returns {number} The calculated canvas width.
 */
function getCanvasWidth() {
    let width = (fullscreenIsActive || isTouchDeviceInLandscapeMode()) ? window.innerWidth :
        Math.min(CANVAS_WIDTH, window.innerWidth, window.innerHeight * 3 / 2);
    return Math.min(width, window.innerHeight * 3 / 2);
}


/**
 * Calculates the canvas height based on the current fullscreen status and available space.
 * @returns {number} The calculated canvas height.
 */
function getCanvasHeight() {
    let height = (fullscreenIsActive || isTouchDeviceInLandscapeMode()) ? window.innerHeight :
        Math.min(CANVAS_HEIGHT, window.innerHeight, window.innerWidth * 2 / 3);
    return Math.min(height, window.innerWidth * 2 / 3);
}