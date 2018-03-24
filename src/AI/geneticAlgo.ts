import AISetup from "./setup"

import GameInfo from "./../Game/gameInfo";
import Game from "./../Game/game";
import Brain from "./brain";

export default class GeneticAlgorithm {
	private numInputs : number = 4;
	private numHiddenLayers : number = 2;
	private numNeurons : number = 4;
	private generationCount : number = 0;
	private fittest : number = 0;
	private brainsFinished : boolean;
	private brains : Brain[];
	private weights : number[][];
    constructor(private app: PIXI.Application, private numberOfSnakes: number) {
    	this.startGeneration();
    }

    //Instatiate the brains 
    public startGeneration() {
    	
    	console.log("Generation: " + this.generationCount + " Fittest: " + this.fittest);
        for (let i = 0; i < this.numberOfSnakes; i++) {
        	this.brains[i] = new Brain(this.numInputs, this.numHiddenLayers, this.numNeurons, this.weights[i]);
            new Game(this.app, [this.brains[i].onGameUpdate]);
        }

        setInterval(this.areBrainsFinished, 5000);
        console.log("Are brains still running: " + this.brainsFinished);
    }

    public areBrainsFinished() {
    	for (let i = 0; i < this.numberOfSnakes; i++) {
    		if (!this.brains[i].getIsGameFinished()) {
    			this.brainsFinished = false;
    			return false;
    		}
    	}
    }





//fitness function: score squared/time
//todo: Every 5 seconds: are you all finished? I.e. we need some way of checking if all done.


}