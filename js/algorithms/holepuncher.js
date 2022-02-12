import Algorithm from './algorithm.js';
import ConsoleManager from '../consolemanager.js';
import CanvasManager from '../canvasmanager.js';

/**
 * @typedef {import('../tilemap.js').default} TileMap
 */

class HolePuncher extends Algorithm {
    static NAME = 'Hole Puncher';
    static SETTINGS_TEMPLATE = {
        'punchRate': {
            type: 'number',
            label: 'Punch Rate',
            default: 0.2,
            min: 0.01,
            max: 1,
            step: 0.01,
            randomMin: 0.01,
            randomMax: 1
        }
    };

    /**
     * @param {TileMap} map 
     * @param {Object} settings 
     * @param {Function} rand 
     */
    static async execute(map, settings, rand) {
        let punchRate = settings.punchRate;

        let counter = 0;
        let addEmptyTile = tile => {
            let id = counter;
            counter++;
            let {x, y} = tile.getCoords();
            let color = this.#getRandomColor(rand);

            map.animation.logComputation(x, y, color); // Draw initial empty tiles
            
            return {tile, id, color, x, y};
        };

        let emptyTileList = map.getTilesOfType('empty').map(tile => {
            return addEmptyTile(tile);
        });


        let iteration = 0;
        let change;
        do {
            let result = this.#refineEmptyTileList(map, emptyTileList, (iteration == 0));
            change = result.change;
            iteration++;

            let uniqueValues = result.uniqueValues;

            /*
            console.log('Unique IDs:');
            console.log(uniqueValues);
            console.log(emptyTileList);
            */

            if (uniqueValues.length == 1) return; // The map is completely accessible!

            let targetValue = uniqueValues[0]; // Take the first unique value (lowest count) and try to correct it
            let punchCount = Math.ceil(targetValue.count * punchRate);

            let touchingWalls = []; // The list of walls this area is touching
            targetValue.tiles.forEach(tile => {
                let adjacentTiles = [tile.tileLeft, tile.tileRight, tile.tileAbove, tile.tileBelow];
                adjacentTiles.forEach(adjacentTile => {
                    if (adjacentTile.getType() == 'empty') return; // Ignore this tile if it is empty
                    if (adjacentTile.hasProperty('immutable')) return; // Ignore this tile if it is immutable

                    if (touchingWalls.indexOf(adjacentTile) == -1) touchingWalls.push(adjacentTile);
                });
            });
            
            // Add a distance value to each wall
            touchingWalls = touchingWalls.map(wall => {
                return {
                    wall: wall,
                    distance: Infinity
                };
            })

            // For each wall find the closest distance to a non-targetValue value
            touchingWalls.forEach(touchingWall => {
                if (touchingWall.distance == 1) return; // Shortest distance already achieved!
                let wall = touchingWall.wall;
                let wallCoords = wall.getCoords();
                uniqueValues.forEach(uniqueValue => {
                    if (uniqueValue.id == targetValue.id) return; // This is the target value!
    
                    uniqueValue.tiles.forEach(tile => {
                        // Calculate the distance to this tile and see if it is less than the current lowest
                        let tileCoords = tile.getCoords();
                        let distance = Math.sqrt(Math.pow(wallCoords.x - tileCoords.x, 2) + Math.pow(wallCoords.y - tileCoords.y, 2));
                        if (distance < touchingWall.distance) touchingWall.distance = distance;
                    });
                });
            });

            // Sort the touching walls by the lowest distance
            touchingWalls.sort((a, b) => a.distance - b.distance);

            // Punch through the walls
            punchCount = Math.min(punchCount, touchingWalls.length); // Ensure we cannot punch more walls than we are touching
            for (let i=0; i<punchCount; i++) {
                let touchingWall = touchingWalls[i];
                touchingWall.wall.symmetrySetType('empty').forEach(wall => {
                    let newEmptyTile = addEmptyTile(wall);
                    map.animation.logComputation(newEmptyTile.x, newEmptyTile.y, newEmptyTile.color);
                    emptyTileList.push(newEmptyTile);
                });
            }

        } while (change);
    }

    static #refineEmptyTileList(map, emptyTileList, logSorted=false) {
        let change = false;
        let growth;
        do {
            growth = false;
            for (let i=0; i<emptyTileList.length; i++) {
                let mainTileDict = emptyTileList[i];
                let mainX = mainTileDict.x;
                let mainY = mainTileDict.y;
                for (let i2=0; i2<emptyTileList.length; i2++) {
                    if (i == i2) continue;

                    let testTileDict = emptyTileList[i2];
                    let testX = testTileDict.x;
                    let testY = testTileDict.y;
                    
                    let adjacentTile = false;
                    if (testX == (mainX-1) && testY == mainY) {
                        // Test left
                        adjacentTile = true;
                    } else if (testX == (mainX+1) && testY == mainY) {
                        // Test right
                        adjacentTile = true;
                    } else if (testX == mainX && testY == (mainY-1)) {
                        // Test above
                        adjacentTile = true;
                    } else if (testX == mainX && testY == (mainY+1)) {
                        // Test below
                        adjacentTile = true;
                    }

                    if (adjacentTile) {
                        if (mainTileDict.id < testTileDict.id) {
                            testTileDict.id = mainTileDict.id;
                            testTileDict.color = mainTileDict.color
                            map.animation.logComputation(testTileDict.x, testTileDict.y, testTileDict.color);
                            growth = true;
                        } else if (testTileDict.id < mainTileDict.id) {
                            mainTileDict.id = testTileDict.id;
                            mainTileDict.color = testTileDict.color;
                            map.animation.logComputation(mainTileDict.x, mainTileDict.y, mainTileDict.color);
                            growth = true;
                        }

                        //if (growth) break;
                    }
                }
                
                //if (growth) break;
            }

            if (growth) change = true;
        } while (growth);

        // Sort by id
        emptyTileList.sort((a, b) => a.id - b.id);
        if (logSorted) emptyTileList.forEach(tileDict => map.animation.logComputation(tileDict.x, tileDict.y, tileDict.color));

        // Find unique values
        let uniqueValues = [];
        emptyTileList.forEach(tileDict => {
            let unique = true;
            for (let x=0; x<uniqueValues.length; x++) {
                let testValue = uniqueValues[x];
                if (testValue.id == tileDict.id) {
                    unique = false;
                    uniqueValues[x].count++;
                    uniqueValues[x].tiles.push(tileDict.tile);
                    break;
                }
            }
            if (unique) {
                uniqueValues.push({
                    id: tileDict.id,
                    count: 1,
                    tiles: [tileDict.tile]
                });
            }
        });

        uniqueValues.sort((a, b) => a.count - b.count);

        return {
            emptyTileList: emptyTileList,
            uniqueValues: uniqueValues,
            change: change
        };
    }

    static #getRandomColor(rand) {
        let r = Math.floor(rand() * 256);
        let g = Math.floor(rand() * 256);
        let b = Math.floor(rand() * 256);

        return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    }
}

export default HolePuncher;