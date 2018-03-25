import AISetup from "./setup"

import GameInfo from "./../Game/gameInfo";
import Game from "./../Game/game";
import Brain from "./brain";
import BrainWriter from "./brainsWriter";

export default class GeneticAlgorithm {
	private numInputs : number = 4;
	private numHiddenLayers : number = 3;
	private numNeurons : number = 4;
	private generationCount : number = 0;
	private fittest : number = 0;
	private fittestBrainsForSelection : number[][];
	private brainsFinished : boolean = true;
	private brains : Brain[] = [];
	private weights : number[][] = [];
	private fitnessScores : number[];
	private numBrainsForSelection : number = 5;
	private mutationRate : number = 0.1;
	private crossover : number;
	private games: Game[] = [];

	constructor(private app: PIXI.Application, private numberOfSnakes: number) {
		let numberOfWeights: number = this.numInputs * (this.numHiddenLayers + 1) * this.numNeurons;
		let weightValueRange: number = 4;
		let weightValueOffset: number = -2
		this.generateInitialWeights(numberOfWeights, weightValueRange, weightValueOffset);
		this.startGeneration();
		this.ifFinishedEvolve();
	}


	//Instatiate the brains 
	public startGeneration() {
		// I think each child should have their own stage, but for now leave this here
		this.app.stage.removeChildren().forEach(e => {
			e.destroy();
		});

		this.brains = [];
		console.log("Generation: " + this.generationCount++ + " Fittest: " + this.fittest);
		for (let i = 0; i < this.numberOfSnakes; i++) {
			let brain = new Brain(this.numInputs, this.numHiddenLayers, this.numNeurons, this.weights[i]);

			this.brains.push(brain);

			//Super hacky, but what you gunna do??
			if (this.games[i]) {
				this.games[i].setCallBack([brain.onGameUpdate.bind(brain)]);
				this.games[i].resetGame();
			} else {
				this.games.push(new Game(this.app, [brain.onGameUpdate.bind(brain)]));
			}
		}
	}

	public ifFinishedEvolve() {
		if (this.areBrainsFinished()) {
			// BrainWriter.write(this.getResults(), this.generationCount);
			this.performSelection();

			this.startGeneration();
		}

		setTimeout(this.ifFinishedEvolve.bind(this), 1000);
	}

	private getResults() : Brain.Result[] {
		return this.brains.map(brain => brain.getResults());
	}

	public areBrainsFinished() {
		for (let i = 0; i < this.numberOfSnakes; i++) {
			if (!this.brains[i].getIsGameFinished()) {
				return false;
			}
		}

		return true;
	}

	public performSelection() {
    	let results : Brain.Result[] = [];
    	for (let i = 0; i < this.numberOfSnakes; i++) {
    		results.push(this.brains[i].getResults());
    	}    	

    	let sortedResults: Brain.Result[] = results.sort((result1, result2) => result1.fitness - result2.fitness);
    
    	let selectedPopulation:Brain.Result[] = sortedResults.slice(0, this.numBrainsForSelection);
    	
        this.performSwapCrossover(selectedPopulation);
        
    	//performcrossover(sortedResults, Math.random(weights[0].length));

    }

    public performSwapCrossover(selectedPopulation:Brain.Result[]) {
        console.log(selectedPopulation);

        for(let i=1;i<selectedPopulation.length;i+=2){
            let crossover:number = Math.round(Math.random() * (this.weights[i].length - 1));
            for(let j=0; j<crossover; j++){
                let temp : number = selectedPopulation[i].weights[j];
                selectedPopulation[i].weights[j] = selectedPopulation[i-1].weights[j];
                selectedPopulation[i-1].weights[j] = temp;
            }
        }
        return selectedPopulation;
    }

    //This function was created as a crossover possibility.
    public performAdjustCrossover(selectedPopulation:Brain.Result[], crossover:number) {
        console.log(selectedPopulation);

        var higherRankWeight:number = 0.6;
        var lowerRankWeight:number = 0.4;

        var newPopulation:number[][] = [];
        for(let i=1; i<selectedPopulation.length;i++){
            newPopulation[i-1] = [];
            for(let j=0;j<selectedPopulation[i].weights.length;j++){
                newPopulation[i-1][j] = (selectedPopulation[i-1].weights[j] * higherRankWeight)
                                        + (selectedPopulation[i].weights[j] * lowerRankWeight)
            }   
        }
    }

    public performMutation(offspring:Brain.Result) {
    	let numWeights = offspring.weights.length;
    	let numMutations = Math.floor(numWeights*this.mutationRate);
    	let mutationArray : number[] = [];
    	for (let i = 0; i < numMutations; i++) {
    		mutationArray[i] = Math.round(Math.random() * (numWeights-1));
    	}
    }

//fitness function: score squared/time
//todo: Every 5 seconds: are you all finished? I.e. we need some way of checking if all done.

    private generateInitialWeights(numberOfWeights:number, range:number, offset:number){
        this.weights = [];
        for (let i = 0; i < this.numberOfSnakes; i++) {
            this.weights[i] = [];

            for(let j = 0; j < numberOfWeights; j++){
                this.weights[i][j]= (Math.random()*range)+offset;
            }
        }
    }
}