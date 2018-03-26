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
	private fittest : Brain.Result = new Brain.Result(-1 , []);
	private fittestBrainsForSelection : number[][];
	private brainsFinished : boolean = true;
	private brains : Brain[] = [];
	private weights : number[][] = [];
	private newGenerationWeights : number[][] = [];
	private fitnessScores : number[];
	private numBrainsForSelection : number = this.numberOfSnakes/2;
	private weightMutationRate : number = 0.1;
	private offspringMutationRate : number = 0.2;
	private evolveBool = false;
	private crossover : number;
	private numberOfWeights : number;
	private weightValueRange : number;
	private weightValueOffset : number;
	private games:Game[] = []

	constructor(private app: PIXI.Application, private numberOfSnakes: number) {
        let numberOfWeights:number = this.numInputs * (this.numHiddenLayers + 1) * this.numNeurons;
       	let weightValueRange:number = 4;
        let weightValueOffset:number = -2;
		this.generateWeights(numberOfWeights, weightValueRange, weightValueOffset);
		this.numberOfWeights = numberOfWeights;
		this.weightValueRange = weightValueRange;
		this.weightValueOffset = weightValueOffset;

		this.startGeneration();
		if (this.evolveBool) {
			this.ifFinishedEvolve();
		}
		else {
			this.performSelection();
			this.startGeneration();
		}
	}


	//Instatiate the brains 
	public startGeneration() {
		// I think each child should have their own stage, but for now leave this here
		this.app.stage.removeChildren().forEach(e => {
			e.destroy();
		});

		this.brains = [];
		console.log("Generation: " + this.generationCount++ + " Fittest: " + this.fittest.fitness);
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
	}

	private getResults() : Brain.Result[] {
		return this.brains.map(brain => brain.getResults());
	}

	public areBrainsFinished() {
		for (let i = 0; i < this.numberOfSnakes; i++) {
			if (!this.brains[i].getIsGameFinished()) {
				console.log("BRAIN " + i + " is finished :)");
				return false;
			}
		}

		return true;
	}

	/*
	Take the 20 initial snakes.
	Use only the top 10 performing snakes to have offspring (swap crossover)
	Perform small mutation on a couple of the offspring to prevent premature convergence.
	Randomly generate 10 new offspring
	Push the 10 top performing snakes to this pool of new offspring
	Start next generation
	*/
	public performSelection() {
    	let results : Brain.Result[] = [];
    	for (let i = 0; i < this.numberOfSnakes; i++) {
			results.push(this.brains[i].getResults());
			
			if (this.brains[i].getResults().fitness > this.fittest.fitness) {
				this.fittest = this.brains[i].getResults();
			}
    	}    	

    	let sortedResults: Brain.Result[] = results.sort((result1, result2) => result1.fitness - result2.fitness);
    
    	let selectedPopulation:Brain.Result[] = sortedResults.slice(0, Math.round(this.numberOfSnakes / 2));
    	
      	selectedPopulation = this.performSwapCrossover(selectedPopulation);
        console.log(selectedPopulation);
        
        //Gross but it should work
        this.weights = []
        this.generateWeights(selectedPopulation[0].weights.length,4,-2);
        this.weights = this.weights.slice(0,this.numberOfSnakes/2)
        for(let i = 0; i<selectedPopulation.length;i++){
            this.weights.push(selectedPopulation[i].weights);     
        }
        console.log(this.weights);
        
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

        let offspringPopulation : Brain.Result[] = this.performMutation(selectedPopulation);
        return offspringPopulation;
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
        return selectedPopulation;
    }

    public performMutation(selectedPopulation : Brain.Result[]) {
    	let weightMutationArray : number[] = [];
    	let offspringMutationArray : number[] = [];
    	let offspring : Brain.Result;
    	let offspringPopulation : Brain.Result[] = [];
    	let numOffspringMutations = this.offspringMutationRate*this.numBrainsForSelection;
    	//let numWeightMutations = 1;
    	let numWeightMutations = Math.floor(this.numberOfWeights*this.weightMutationRate);

    	for (let i = 0; i < numWeightMutations; i++) {
    		weightMutationArray[i] = Math.round(Math.random() * (this.numberOfWeights - 1));
    		//weightMutationArray[0] = 0;
    	}

    	for (let i = 0; i < numOffspringMutations; i++) {
    		//offspringMutationArray[i] = 0;
    		offspringMutationArray[i] = Math.round(Math.random() * (this.numBrainsForSelection));
    		console.log(selectedPopulation[offspringMutationArray[i]]);
    		//offspring = this.mutateOffspring(selectedPopulation[offspringMutationArray[i]], weightMutationArray, numWeightMutations);
    		selectedPopulation[offspringMutationArray[i]] = this.mutateOffspring(selectedPopulation[offspringMutationArray[i]], weightMutationArray, numWeightMutations);
    		console.log(selectedPopulation[offspringMutationArray[i]]);
    		//offspringPopulation.push(offspring);
    	
    	}

    	console.log("Num offspring mutations: " + numOffspringMutations + "\nOffspring array: " +  offspringMutationArray);
    	console.log("Num weight mutations: " + numWeightMutations + "\nWeight mutation array:" + weightMutationArray );

    	//offspring = this.mutateOffspring(selectedPopulation[0], weightMutationArray, numWeightMutations);

    	//offspringPopulation.push(offspring);

    	return selectedPopulation;
    	


    }

    public mutateOffspring(offspring : Brain.Result, weightMutationArray:number[], numWeightMutations:number) {
    	for (let i = 0; i < numWeightMutations; i++) {
    		//console.log("Old Weight index: " + weightMutationArray[i] + " Old weight value: " +  offspring.weights[weightMutationArray[i]] + "\n");
    		console.log("Old Weight index: " + weightMutationArray[i] + " Old weight value: " +  offspring.weights[weightMutationArray[i]] + "\n");
    		offspring.weights[weightMutationArray[i]] = (Math.random() * 4) + -2;
    		console.log("New Weight: " + offspring.weights[weightMutationArray[i]]);
    	}
    	return offspring;

    }

//fitness function: score squared/time
//todo: Every 5 seconds: are you all finished? I.e. we need some way of checking if all done.

    private generateWeights(numberOfWeights:number, range:number, offset:number){
        for (let i = 0; i < this.numberOfSnakes; i++) {
            this.weights[i] = [];

            for(let j = 0; j < numberOfWeights; j++){
                this.weights[i][j]= (Math.random()*range)+offset;
            }
        }
    }    
}