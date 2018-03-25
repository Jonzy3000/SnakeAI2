import AISetup from "./setup";
import NeuralNetwork from "./../AI/neural-network/NeuralNetwork";
import GameInfo from "./../Game/gameInfo";
import Direction from "../Game/Snake/direction";
import Snake from "../Game/Snake/snake";
import Vector from "../Utils/vector";

class Brain {


    private neuralNetwork: NeuralNetwork
    private gameFinished: boolean
    private fitness: number
    constructor(numInputs: number, numHiddenLayers: number, numNeuronsPerHiddenLayer: number, weights: number[]) {

        this.gameFinished = false;
        let numOutputs: number = 4;
        this.neuralNetwork = new NeuralNetwork(numInputs, numOutputs, numHiddenLayers, numNeuronsPerHiddenLayer);
        this.neuralNetwork.setWeights(weights);
    }

    public onGameUpdate(input: GameInfo, snake: Snake) {
        //console.log(input.getDuration);

        if (input.getGameFinished) {
            this.gameFinished = true;
            return;
        }

        this.fitnessFunction(input);

        let outputs: number[] = this.neuralNetwork.update(this.generateNeuralNetworkInput(input, snake));

        //Ideally we would just get a callback, but this is confusing in js 
        snake.setDirection(this.generateDirection(outputs));
    }

    private generateDirection(neuralNetworkOutput: number[]): Direction {
        var newDirection: Direction;

        let max: number = neuralNetworkOutput[0];
        let maxIndex: number = 0;

        for (var i = 1; i < neuralNetworkOutput.length; i++) {
            if (neuralNetworkOutput[i] > max) {
                maxIndex = i;
                max = neuralNetworkOutput[i];
            }
        }

        switch (maxIndex) {
            case 0:
                newDirection = Direction.DOWN();
                break;
            case 1:
                newDirection = Direction.UP();
                break;
            case 2:
                newDirection = Direction.LEFT();
                break;
            case 3:
                newDirection = Direction.RIGHT();
                break;
            default:
        }

        return newDirection;
    }


    private fitnessFunction(input: GameInfo) {
        this.fitness = (input.getScore * input.getScore / (input.getDuration + 1));
    }

    private sign(x: number): number {
        return (+(x > 0) - +(x < 0)) || +x;
    }

    private normaliseDistance(vec1: Vector, vec2: Vector): Vector {
        const x = this.sign(vec1.X - vec2.X);
        const y = this.sign(vec1.Y - vec2.Y);
        return new Vector(x, y);
    }

    private generateNeuralNetworkInput(input: GameInfo, snake: Snake) {
        var neuralNetworkInput: number[] = [];


        let normaliseDistances: Vector = this.normaliseDistance(
            new Vector(input.getFoodLocation.x, input.getFoodLocation.y),
            new Vector(snake.headRect.x, snake.headRect.y)
        );

        neuralNetworkInput.push(normaliseDistances.X);
        neuralNetworkInput.push(normaliseDistances.Y);
        neuralNetworkInput.push(snake.getDirection.X);
        neuralNetworkInput.push(snake.getDirection.Y);


        return neuralNetworkInput;
    }


    public getFitness() {
        return this.fitness;
    }

    public getIsGameFinished() {
        return this.gameFinished;
    }

    public getWeights() {
        return this.neuralNetwork.getWeights();
    }

    public getResults() {
        let result = new Brain.Result(this.getFitness(), this.getWeights());
        return result;
    }
}

module Brain {
    export class Result {
        fitness: number;
        weights: number[];
        constructor(fitness: number, weights: number[]) {
            this.fitness = fitness;
            this.weights = weights;
        }
    }
}

export default Brain