/*--------------------------------------------------
Sound
---------------------------------------------------*/
/**
 * Toggles sound and music settings between 'on' and 'off'.
 * If both music and sound are on, music will be turned off.
 * If only sound is on, it will be turned off.
 * If both is off, it will be turned on. 
 * The updated settings are saved to local storage.
 */
function toggleSoundAndMusic() {
    if (musicIsOn) {
        musicIsOn = false;
    }
    else if (soundIsOn) {
        soundIsOn = false;
    }
    else {
        musicIsOn = true;
        soundIsOn = true;
    }
    setSoundIcon();
    saveSoundSettingToLocalStorage();
}


/**
 * Sets the sound icon image based on the current sound and music settings.
 */
function setSoundIcon() {
    const soundIcon = document.getElementById('sound-btn-icon');
    if (musicIsOn) {
        soundIcon.src = 'assets/img/sounds-and-music.png';
    }
    else if (soundIsOn) {
        soundIcon.src = 'assets/img/sounds-without-music.png';
    }
    else {
        soundIcon.src = 'assets/img/sounds-off.png';
    }
}


/*--------------------------------------------------
Info
---------------------------------------------------*/
/**
 * Toggles the game info screen along with other elements (touch keys, end screen, play button) 
 * that have to hide when info screen is displayed.
 */
function toggleGameInfo() {
    document.getElementById('info-screen').classList.toggle('full-opacity');
    document.getElementById('touch-keys').classList.toggle('full-opacity');
    if (gameIsRunning) return;

    if (gameIsLost) {
        toggleEndScreen('end-screen-lost');
    }
    else if (gameIsWon) {
        toggleEndScreen('end-screen-won');
    }
    else {// game has not been started
        document.getElementById('play-btn').classList.toggle('d-none');
    }
}


/**
 * Toggles the visibility of an end screen (either 'game lost' or 'game won' screen)
 * and the replay button screen. It also manages the zIndex of the replay button screen.
 * @param {string} screenId - The ID of the end screen to be toggled.
 */
function toggleEndScreen(screenId) {
    document.getElementById(screenId).classList.toggle('full-opacity');
    document.getElementById('replay-btn-screen').classList.toggle('full-opacity');
    document.getElementById('replay-btn-screen').style.zIndex = (+document.getElementById('replay-btn-screen').style.zIndex + 1) % 2;
}


/*--------------------------------------------------
Fullscreen
---------------------------------------------------*/
/**
 * Toggles fullscreen mode by either entering or exiting fullscreen.
 * After toggling, it resizes the canvas content to fit the new screen size.
 */
function toggleFullscreen() {
    if (fullscreenIsActive) {
        closeFullscreen();
    } else {
        openFullscreen();
    }
    resizeCanvasContent();
    fullscreenIsActive = !fullscreenIsActive;
}


/**
 * Requests the browser to enter fullscreen mode for the 'main-screen-container' element.
 * It also updates the fullscreen button icon accordingly.
 */
function openFullscreen() {
    let element = document.getElementById('main-screen-container');

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE11 */
        element.msRequestFullscreen();
    }

    document.getElementById('fullscreen-btn-icon').src = 'assets/img/fullscreen_exit.png';
}


/**
 * Exits fullscreen mode if the page is currently in fullscreen.
 * It also updates the fullscreen button icon accordingly.
 */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }

    document.getElementById('fullscreen-btn-icon').src = 'assets/img/fullscreen.png';
}