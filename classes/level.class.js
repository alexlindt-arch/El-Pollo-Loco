/** Class representing a level of the game. */
class Level {
    backgroundObjects;
    clouds;
    numberOfClouds;
    enemies;
    numberOfChickens;
    numberOfBabyChickens;
    endboss;
    bottles;
    coins;
    numberOfBottles;
    numberOfCoins;

    /** Avoids overlapping collectable objects by replacing them if necessary. */
    replaceOverlappingCollectableObjects() {
        let objects = this.getCollectableObjects();

        objects.forEach((obj) => {
            while (obj.overlapsWithOtherObjects(objects)) {
                obj.place();
            }
        });
    }

    /** 
     * Gets all collectable objects meaning bottles and coins. 
     * @returns {Array<CollectableObject>} - array of all collectable objects.
     * */
    getCollectableObjects() {
        return [...this.bottles, ...this.coins];
    }
}