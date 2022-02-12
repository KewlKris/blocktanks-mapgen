/**
 * Return a randomized version of the given array
 * @param {Function} rand 
 * @param {Object[]} array 
 * @returns {Object[]}
 */
function shuffle(rand, array) {
    let newArray = [];
    while (array.length > 0) {
        let index = Math.floor(rand() * array.length);
        newArray.push(array[index]);
        array.splice(index, 1);
    }

    return newArray;
}

export default {
    shuffle
}