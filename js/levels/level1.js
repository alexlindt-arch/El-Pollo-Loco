let level1 = new Level();


/**
 * Initializes the first level. Calls other functions to initialize
 * different aspects of the level (background, enemies, and collectible objects).
 * @returns {Promise<void>} A Promise that resolves after the level is initialized.
 */
async function initLevel() {
    level1.numberOfClouds = Math.floor(NUMBER_OF_BG / 2);
    level1.numberOfChickens = 10;
    level1.numberOfBabyChickens = 5;
    level1.numberOfBottles = 20;
    level1.numberOfCoins = 20;

    initLevelBackground();
    initLevelEnemies();
    initLevelCollectableObjects();
}


/**
 * Initializes the background objects for the first level.
 */
function initLevelBackground() {
    level1.backgroundObjects = [];
    level1.clouds = Array(level1.numberOfClouds).fill().map(() => new Cloud());

    createBackgroundObjectsForLevel1();
    setStartPointsForClouds();
}


/**
 * Creates background objects for the first level, including different layers.
 */
function createBackgroundObjectsForLevel1() {
    for (let i = MOST_LEFT_BG; i <= MOST_RIGHT_BG; i++) {
        let bg_x = i * CANVAS_WIDTH;
        let pngNumber = (i % 2) ? '1' : '2';
        level1.backgroundObjects.push(new BackgroundObject('assets/img/5_background/layers/air.png', bg_x));
        level1.backgroundObjects.push(new BackgroundObject(`assets/img/5_background/layers/3_third_layer/${pngNumber}.png`, bg_x));
        level1.backgroundObjects.push(new BackgroundObject(`assets/img/5_background/layers/2_second_layer/${pngNumber}.png`, bg_x));
        level1.backgroundObjects.push(new BackgroundObject(`assets/img/5_background/layers/1_first_layer/${pngNumber}.png`, bg_x));
    }
}


/**
 * Sets random start points for the clouds in the first level.
 */
function setStartPointsForClouds() {
    for (let i = 0; i < level1.numberOfClouds; i++) {
        level1.clouds[i].x = (MOST_LEFT_BG + 2 * i + 1) * CANVAS_WIDTH + Math.random() * 500;
    }
}


/**
 * Initializes enemies for the first level.
 */
function initLevelEnemies() {
    let chickens = Array(level1.numberOfChickens).fill().map(() => new Chicken());
    let babyChickens = Array(level1.numberOfBabyChickens).fill().map(() => new BabyChicken());

    level1.enemies = [
        ...chickens,
        ...babyChickens,
        new Endboss()
    ];

    level1.endboss = level1.enemies.at(-1);
}


/**
 * Initializes collectible objects for the first level.
 */
function initLevelCollectableObjects() {
    level1.bottles = Array(level1.numberOfBottles).fill().map(() => new CollectableBottle());
    level1.coins = Array(level1.numberOfCoins).fill().map(() => new CollectableCoin());

    level1.replaceOverlappingCollectableObjects();
}