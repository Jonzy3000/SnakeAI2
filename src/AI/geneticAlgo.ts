import AISetup from "./setup"

import GameInfo from "./../Game/gameInfo";
import Game from "./../Game/game";
import Brain from "./brain";

export default class GeneticAlgorithm {
	private numInputs: number = 4;
	private numHiddenLayers: number = 3;
	private numNeurons: number = 4;
	private generationCount: number = 0;
	private fittest: number = 0;
	private fittestBrainsForSelection: number[][];
	private brains: Brain[] = [];
	private games: Game[] = [];
	private weights: number[][] = [];
	private fitnessScores: number[];
	private numBrainsForSelection: number = 5;
	private crossover: number;

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
			this.performSelection();
			this.startGeneration();
		}

		setTimeout(this.ifFinishedEvolve.bind(this), 1000);
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
		let results: Brain.Result[] = [];
		for (let i = 0; i < this.numberOfSnakes; i++) {
			results.push(this.brains[i].getResults());
		}

		let sortedResults: Brain.Result[] = results.sort((result1, result2) => result1.fitness - result2.fitness);

		let selectedPopulation: Brain.Result[] = sortedResults.slice(0, this.numBrainsForSelection);
		this.crossover = Math.round(Math.random() * (this.weights[0].length - 1));
		this.performCrossover(selectedPopulation, this.crossover);
		//performcrossover(sortedResults, Math.random(weights[0].length));

	}

	public performCrossover(selectedPopulation: Brain.Result[], crossover: number) {
		console.log(selectedPopulation);
		for (let i = 0; i < this.numberOfSnakes; i++) {
			for (let i = 0; i < this.crossover; i++) {

			}
		}
		let fittestParent: Brain.Result = selectedPopulation[0];
		let secondFittestParent: Brain.Result = selectedPopulation[1];

		//Swap values among parents (two most successful parents)
		// for (let i = 0; i < this.crossover; i++) {
		// 	let temp: number = fittestParent.weights[i];
		// 	fittestParent.weights[i] = secondFittestParent.weights[i];
		// 	secondFittestParent.weights[i] = temp;
		// }
	}

	//fitness function: score squared/time
	//todo: Every 5 seconds: are you all finished? I.e. we need some way of checking if all done.

	private generateInitialWeights(numberOfWeights: number, range: number, offset: number) {
		this.weights = [];
		for (let i = 0; i < this.numberOfSnakes; i++) {
			this.weights[i] = [];

			for (let j = 0; j < numberOfWeights; j++) {
				this.weights[i][j] = (Math.random() * range) + offset;
			}
		}
	}
}