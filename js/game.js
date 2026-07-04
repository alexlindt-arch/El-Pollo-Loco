let canvas;
let world;
let keyboard = new Keyboard();
let fullscreenIsActive = false;
let musicIsOn = true;
let soundIsOn = true;
let intervalIds = [];
let gameIsRunning = false;
let gameIsLost = false;
let gameIsWon = false;


/**
 * Initializes the game by loading sound settings from local storage,
 * setting sound icons, resizing canvas content, and preloading audio elements.
 * @returns {Promise<void>} A Promise that resolves when all initialization tasks are complete.
 */
async function init() {
    await loadSoundSettingFromLocalStorage();
    setSoundIcon();
    resizeCanvasContent();
    preloadAudioElements();
}


/*--------------------------------------------------
Start / Restart
---------------------------------------------------*/
/**
 * Starts the game by removing the start screen, initializing the level and world,
 * providing touch keys for mobile devices, and setting the gameIsRunning flag to true.
 * @returns {Promise<void>} A Promise that resolves when the game is started.
 */
async function startGame() {
    try {
        await showLoader();
        removeStartScreen();
        await Promise.all([initLevel(), initWorld()]); // Simulate asynchronous operations using Promises
        provideTouchKeysForMobileDevices();
        gameIsRunning = true;
    } catch (error) {
        console.error("An error occurred while starting the game:", error);
    } finally {
        removeLoaderWhenAllImagesAreLoaded(); // Ensure that the loader element is removed, even if there's an error, but only when all relevant images are loaded
    }
}


/**
 * Shows the loading screen with a loader animation (CSS).
 * @returns {Promise<void>} A Promise that resolves after a short delay to show at least a bit of the loading animation.
 */
async function showLoader() {
    showElement('loader');
    await new Promise((resolve) => setTimeout(resolve, 500));
}


/**
 * Removes the start screen elements to hide the start screen.
 */
function removeStartScreen() {
    removeElement('play-btn');
    removeOpacity('play-btn-screen');
    removeOpacity('start-screen');
    setTimeout(() => {
        removeElement('start-screen');
    }, 500);
}


/**
 * Initializes the world by getting the canvas element and creating a new World instance.
 */
async function initWorld() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}


/**
 * Removes the loader element when all start images are loaded in the world.
 */
function removeLoaderWhenAllImagesAreLoaded() {
    let checkLoading = setInterval(() => {
        world.checkIfStartImagesAreLoaded();
        if (world.startImagesAreLoaded) {
            clearInterval(checkLoading);
            removeElement('loader');
        }
    }, 50);
}


/**
 * Restarts the game by clearing all intervals, resetting audio elements, removing end screen,
 * and starting the game again with `startGame()` function.
 */
function restartGame() {
    clearAllIntervals();
    intervalIds = [];
    world.gameLost_music.pause();
    world.gameWon_music.pause();
    setAllAudioElementsToBeginning();
    removeEndScreen();
    startGame();
    gameIsLost = false;
    gameIsWon = false;
}


/**
 * Removes the end screen (either "game lost" or "game won" screen).
 * @param {string} endScreenId - The id of the end screen element to be removed.
 */
function removeEndScreen() {
    const endScreenId = gameIsLost ? 'end-screen-lost' : 'end-screen-won';

    document.getElementById('replay-btn-screen').style.zIndex = 0;
    removeOpacity('replay-btn-screen');

    removeOpacity(endScreenId);
    setTimeout(() => {
        removeElement(endScreenId);
    }, 500);
}


/**
 * Shows the end screen (either "game lost" or "game won" screen).
 * @param {string} endScreenId - The id of the end screen element to be displayed.
 */
function showEndScreen(endScreenId) {
    showElement(endScreenId);
    addOpacity(endScreenId);
    showElement('replay-btn-screen');
    addOpacity('replay-btn-screen');
    document.getElementById('replay-btn-screen').style.zIndex = 1;

}


/*--------------------------------------------------
Intervals
---------------------------------------------------*/
/**
 * Sets a new interval using `setInterval` and keeps track of the interval ID.
 * @param {Function} fn - The function to be executed at each interval.
 * @param {number} time - The interval time in milliseconds.
 * @returns {number} The ID of the created interval.
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
    return id;
}


/**
 * Clears all the stoppable intervals by using their respective interval IDs.
 */
function clearStoppableIntervals() {
    intervalIds.forEach(clearInterval);
}


/**
 * Clears all intervals in the window object (interval IDs from 1 to 9999).
 */
function clearAllIntervals() {
    for (let i = 1; i < 9999; i++)
        window.clearInterval(i);
}