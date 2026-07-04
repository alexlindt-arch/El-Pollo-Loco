const audioFiles = [
    'assets/audio/music/endboss-appears.mp3',
    'assets/audio/music/game-bg.mp3',
    'assets/audio/music/lost.mp3',
    'assets/audio/music/won.mp3',
    'assets/audio/baby-chicken_dead.mp3',
    'assets/audio/bottle_break.mp3',
    'assets/audio/bottle_collect.mp3',
    'assets/audio/chicken_dead.mp3',
    'assets/audio/coin.mp3',
    'assets/audio/dead.mp3',
    'assets/audio/endboss_alert.mp3',
    'assets/audio/endboss_attack.mp3',
    'assets/audio/endboss_dead.mp3',
    'assets/audio/endboss_hurt.mp3',
    'assets/audio/endboss_walk.mp3',
    'assets/audio/game-over.mp3',
    'assets/audio/hurt.mp3',
    'assets/audio/jump_voice.mp3',
    'assets/audio/nothrow.mp3',
    'assets/audio/running.mp3',
    'assets/audio/sleep.mp3',
    'assets/audio/smash.mp3',
    'assets/audio/throw.mp3'
];
const audioElements = {};


/**
 * Preloads audio elements by creating HTMLAudioElement objects for each audio file,
 * setting their preload attribute to 'auto', and storing them in the 'audioElements' object.
 */
function preloadAudioElements() {
    audioFiles.forEach(path => {
        let audio = new Audio(path);
        audio.preload = 'auto';
        audio.load();
        audioElements[path] = audio;
    });
}


/**
 * Sets the currentTime property of all audio elements to the beginning (0 seconds).
 */
function setAllAudioElementsToBeginning() {
    audioFiles.forEach(path => {
        audioElements[path].currentTime = 0;
    });
}


/**
 * Saves the current sound settings (musicIsOn and soundIsOn) to the local storage.
 */
function saveSoundSettingToLocalStorage() {
    localStorage.setItem('musicIsOn', JSON.stringify(musicIsOn));
    localStorage.setItem('soundIsOn', JSON.stringify(soundIsOn));
}


/**
 * Loads sound settings (musicIsOn and soundIsOn) from local storage and updates the corresponding variables.
 * If no setting is found in local storage, the variables are set to true by default.
 * @returns {Promise<void>} A Promise that resolves after the sound settings are loaded and updated.
 */
async function loadSoundSettingFromLocalStorage() {
    musicIsOn = JSON.parse(localStorage.getItem('musicIsOn') || true);
    soundIsOn = JSON.parse(localStorage.getItem('soundIsOn') || true);
}