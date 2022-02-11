import TileMap from './tilemap.js';
import CanvasManager from './canvasmanager.js';

/**
 * @typedef {import('./tile.js').default} Tile
 */

class TileMapAnimation {
    /** @type {Boolean} */
    #isRecording;

    /** @type {Boolean} */
    #isPlaying;

    /** @type {Object[]} */
    #log;

    /** @type {Number} */
    #stepCounter;

    /** @type {Number} */
    #width;

    /** @type {Number} */
    #height;

    /** @type {Number} */
    #animationRequest;

    /** @type {TileMap} */
    #map;

    constructor() {
        this.#isRecording = false;
        this.#isPlaying = false;
    }

    /**
     * Start logging TileMap changes
     * @param {TileMap} map 
     */
    startRecording(map) {
        this.#isRecording = true;
        this.#log = [];
        this.#stepCounter = 0;
        this.#width = map.getWidth();
        this.#height = map.getHeight();
        this.#map = map;

        this.logMapState(map);
    }

    /**
     * Log a Tile update in the animation
     * @param {Tile} tile 
     */
    logTileUpdate(tile) {
        if (!this.#isRecording) return;

        this.#log.push({
            step: this.#nextStep(),
            type: 'tileUpdate',
            tile: tile.copy()
        });
    }

    /**
     * Log the current state of the map which the recording was started with
     */
     logMapState() {
        if (!this.#isRecording) return;

        let width = this.#map.getWidth();
        let height = this.#map.getHeight();

        let tiles = [];
        for (let y=0; y<height; y++) {
            for (let x=0; x<width; x++) {
                let tile = this.#map.getTile(x, y);
                tiles.push(tile.copy());
            }
        }

        this.#log.push({
            step: this.#nextStep(),
            type: 'mapState',
            tiles
        });
    }

    /**
     * Log a computation in the animation
     * @param {Number} x 
     * @param {Number} y 
     * @param {String} fillStyle 
     */
    logComputation(x, y, fillStyle) {
        if (!this.#isRecording) return;

        this.#log.push({
            step: this.#nextStep(),
            type: 'computation',
            x,
            y,
            fillStyle
        });
    }

    /**
     * Log the computation canvas being cleared in the animation
     */
    logComputationClear() {
        if (!this.#isRecording) return;

        this.#log.push({
            step: this.#nextStep(),
            type: 'computationClear'
        });
    }

    stopRecording() {
        this.#isRecording = false;
    }

    /**
     * Play a TileMap generation animation on the main canvas
     * @param {Number} stepDelay 
     * @param {Boolean} showComputations 
     */
    playAnimation(stepDelay, showComputations) {
        if (this.#isPlaying) {
            this.stopAnimation();
        }

        this.#isPlaying = true;
        let map = new TileMap(this.#width, this.#height);
        CanvasManager.setMap(map);
        CanvasManager.drawMap();

        let startTime = Date.now();
        let logIndex = 0;
        let stepOffset = 0; // Used when skipping computation animations
        let animationLoop = () => {
            if (this.#isPlaying) this.#animationRequest = window.requestAnimationFrame(animationLoop);
            else return;

            let currentTime = Date.now();
            let timeStep = (currentTime - startTime) / stepDelay;

            while (logIndex < this.#log.length) {
                let currentLog = this.#log[logIndex];
                let currentStep = timeStep + stepOffset;
                if (currentLog.step > currentStep) break; // This event hasn't been reached yet

                // Handle this event
                switch (currentLog.type) {
                    case 'tileUpdate':
                        CanvasManager.drawTile(currentLog.tile);
                        break;
                    case 'mapState':
                        currentLog.tiles.forEach(tile => {
                            CanvasManager.drawTile(tile);
                        });
                        break;
                    case 'computation':
                        if (showComputations) {
                            CanvasManager.drawComputation(currentLog.x, currentLog.y, currentLog.fillStyle);
                        } else {
                            stepOffset -= 1;
                        }
                        break;
                    case 'computationClear':
                        if (showComputations) {
                            CanvasManager.clearComputationCanvas();
                        } else {
                            stepOffset -= 1;
                        }
                        break;
                }

                logIndex += 1;
            }

            if (logIndex == this.#log.length) {
                this.stopAnimation();
            }

            CanvasManager.updateMainCanvas();
        };
        this.#animationRequest = window.requestAnimationFrame(animationLoop);
    }

    stopAnimation() {
        window.cancelAnimationFrame(this.#animationRequest);
        this.#isPlaying = false;
    }

    isRecording() {
        return this.#isRecording;
    }

    isPlaying() {
        return this.#isPlaying;
    }

    /**
     * Return the next step value
     * @returns {Number}
     */
    #nextStep() {
        let value = this.#stepCounter;
        this.#stepCounter++;
        return value;
    }
}

export default TileMapAnimation;