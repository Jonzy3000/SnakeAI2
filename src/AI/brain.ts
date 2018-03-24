import AISetup from "./setup";
import NeuralNetwork from "./../AI/neural-network/NeuralNetwork";
import GameInfo from "./../Game/gameInfo";
import Direction from "../Game/Snake/direction";
import Snake from "../Game/Snake/snake";

export default class Brain {
    
    private neuralNetwork:NeuralNetwork
    private gameFinished:boolean
    private score:number
    constructor(numInputs:number, numHiddenLayers:number, numNeuronsPerHiddenLayer:number, weights:number[]) {
        this.gameFinished = false;
        let numOutputs:number = 4;
        this.neuralNetwork = new NeuralNetwork(numInputs,numOutputs,numHiddenLayers,numNeuronsPerHiddenLayer); 
        this.neuralNetwork.setWeights(weights);  
    }

    public onGameUpdate(input: GameInfo, snake: Snake) {
        console.log(input.getDuration);

        if (input.getGameFinished) {
            this.gameFinished = true;
            return;
        }

        this.calculateScore(input);

        let outputs:number[] = this.neuralNetwork.update(this.generateNeuralNetworkInput(input, snake));
        
        //Ideally we would just get a callback, but this is confusing in js 
        snake.setDirection(this.generateDirection(outputs));
    }

    private generateDirection(neuralNetworkOutput:number[]): Direction{
        var newDirection: Direction;

        let max:number = neuralNetworkOutput[0];
        let maxIndex:number = 0;
    
        for (var i = 1; i < neuralNetworkOutput.length; i++) {
            if (neuralNetworkOutput[i] > max) {
                maxIndex = i;
                max = neuralNetworkOutput[i];
            }
        }

        switch(maxIndex) {
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

    private calculateScore(input: GameInfo){
        this.score = (input.getScore * input.getScore / input.getDuration);
    }

    private generateNeuralNetworkInput(input:GameInfo, snake:Snake){
        var neuralNetworkInput:number[]=[];
        neuralNetworkInput.push(input.getFoodLocation.x-snake.headRect.x);
        neuralNetworkInput.push(input.getFoodLocation.y-snake.headRect.y);
        neuralNetworkInput.push(snake.getDirection.X);
        neuralNetworkInput.push(snake.getDirection.Y);

        return neuralNetworkInput;
    }

    public getScore(){
        return this.score;
    }

    public getIsGameFinished(){
        return this.gameFinished;
    }
}