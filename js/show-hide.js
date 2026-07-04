/**
 * Function to show an element with a given ID by removing the 'd-none' and 'hidden' classes.
 * @param {string} id - The ID of the element to show.
 */
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
    document.getElementById(id).classList.remove('hidden');
}


/**
 * Function to hide an element with a given ID by adding the 'hidden' class.
 * @param {string} id - The ID of the element to hide.
 */
function hideElement(id) {
    document.getElementById(id).classList.add('hidden');
}


/**
 * Function to remove an element with a given ID by adding the 'd-none' class.
 * @param {string} id - The ID of the element to remove.
 */
function removeElement(id) {
    document.getElementById(id).classList.add('d-none');
}


/**
 * Function to hide an element with a given ID by removing the 'full-opacity' class.
 * @param {string} id - The ID of the element to remove.
 */
function removeOpacity(id) {
    document.getElementById(id).classList.remove('full-opacity');
}


/**
 * Function to show an element with a given ID by adding the 'full-opacity' class.
 * @param {string} id - The ID of the element to show.
 */
function addOpacity(id) {
    document.getElementById(id).classList.add('full-opacity');
}