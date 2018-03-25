import AISetup from "./setup"

import GameInfo from "./../Game/gameInfo";
import Game from "./../Game/game";
import Brain from "./brain";

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
	private numBrainsForSelection : number = this.numberOfSnakes/2;
	private weightMutationRate : number = 0.1;
	private offspringMutationRate : number = 0.2;
	private crossover : number;
	private numberOfWeights : number;
	private weightValueRange : number;
	private weightValueOffset : number;

	constructor(private app: PIXI.Application, private numberOfSnakes: number) {
        let numberOfWeights:number = this.numInputs * (this.numHiddenLayers + 1) * this.numNeurons;
       	let weightValueRange:number = 4;
        let weightValueOffset:number = -2;
		this.generateInitialWeights(numberOfWeights, weightValueRange, weightValueOffset);
		this.numberOfWeights = numberOfWeights;
		this.weightValueRange = weightValueRange;
		this.weightValueOffset = weightValueOffset;
		this.startGeneration();
	}


    //Instatiate the brains 
    public startGeneration() {
    	
    	console.log("Generation: " + this.generationCount + " Fittest: " + this.fittest);
    	for (let i = 0; i < this.numberOfSnakes; i++) {
    		let brain = new Brain(this.numInputs, this.numHiddenLayers, this.numNeurons, this.weights[i]);
    		this.brains.push(brain);
    		new Game(this.app, [brain.onGameUpdate.bind(brain)]);
    	}

    	//This doesn't work as expected.
    	setInterval(this.areBrainsFinished, 5000);
    	console.log("Are brains still running: " + this.brainsFinished);

    	//When all games are finished
    	this.performMutation(
    		this.performSwapCrossover(
    			this.performSelection()
    			)
    		);
    	// if (this.brainsFinished) {
    	// 	this.performSelection();
    	// }
    }

    public areBrainsFinished() {
    	for (let i = 0; i < this.numberOfSnakes; i++) {
    		if (!this.brains[i].getIsGameFinished()) {
    			this.brainsFinished = false;
    			return false;
    		}
    	}
    }

    public performSelection() {

    	let results : Brain.Result[] = [];
    	for (let i = 0; i < this.numberOfSnakes; i++) {
    		results.push(this.brains[i].getResults());
    	}    	

    	let sortedResults: Brain.Result[] = results.sort((result1, result2) => result1.fitness - result2.fitness);
    
    	let selectedPopulation:Brain.Result[] = sortedResults.slice(0, this.numBrainsForSelection);
    	
    	return selectedPopulation;
        
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

    public performMutation(selectedPopulation:Brain.Result[]) {
    	let numWeights = selectedPopulation[0].weights.length;
    	//let numOffspringMutations = Math.floor(selectedPopulation.length * this.offspringMutationRate);
    	let numOffspringMutations = 1;
    	let numWeightMutations = Math.floor(numWeights*this.weightMutationRate);
    	let weightMutationArray : number[] = [];
    	let offspringMutationArray : number[] = [];

    	console.log("numWeights: " + numWeights);

    	for (let i = 0; i < numWeightMutations; i++) {
    		weightMutationArray[i] = Math.round(Math.random() * (numWeights - 1));
    	}

    	for (let i = 0; i < numOffspringMutations; i++) {
    		offspringMutationArray[i] = 0;
    		//offspringMutationArray[i] = Math.round(Math.random() * (selectedPopulation.length - 1));
    	}

    	for (let i = 0; i < numOffspringMutations; i++) {
    		console.log("before mutation: ");
    		//console.log(selectedPopulation[offspringMutationArray[i]]);
    		console.log(selectedPopulation[0]);
    		//selectedPopulation[offspringMutationArray[i]] = this.mutateOffspring(selectedPopulation[offspringMutationArray[i]], weightMutationArray, numWeightMutations);
    		selectedPopulation[0] = this.mutateOffspring(selectedPopulation[0], weightMutationArray, numWeightMutations);
    		console.log("after mutation: ");
    		//console.log(selectedPopulation[offspringMutationArray[i]]);
    		console.log(selectedPopulation[0]);
    	}


    	console.log("Num weight mutations: " + numWeightMutations + "\nWeight mutation array:" + weightMutationArray );
    	console.log("Num offspring mutations: " + numOffspringMutations + "\nOffspring array: " +  offspringMutationArray);

    	//console.log(selectedPopulation);

    }

    public mutateOffspring(offspring:Brain.Result, weightMutationArray:number[], numWeightMutations:number) {
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