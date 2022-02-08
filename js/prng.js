/**
 * A hashing function pulled from: https://stackoverflow.com/a/47593316
 * @param {String} str 
 * @returns {Number}
 */
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

/**
 * A simple PRNG function pulled from: https://stackoverflow.com/a/47593316
 * @param {Number} a - The seed value
 * @returns {Number}
 */
 function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * Generate a new string seed value from an RNG function
 * @param {Function} rand
 */
function seedFromRand(rand) {
    let str = '';
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    for (let x=0; x<15; x++) {
        str += chars[Math.floor(rand() * chars.length)];
    }

    return str;
}

export default {
    hash: xmur3,
    prng: mulberry32,
    seedFromRand
}