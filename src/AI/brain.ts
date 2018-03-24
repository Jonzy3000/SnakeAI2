import AISetup from "./setup"

import GameInfo from "./../Game/gameInfo"

import Direction from "./../Game/Snake/direction"

export default class Brain {
    
    private neuralNetwork:NeuralNetwork
    
    constructor(numInputs:number, numOutputs:number, numHiddenLayers:number, numNeuronsPerHiddenLayer:number, weights:number[]) {
        this.neuralNetwork = new NeuralNetwork(numInputs,numOutputs,numHiddenLayers,numNeuronsPerHiddenLayer)    
        this.neuralNetwork.setWeights(weights)
    }

    public onGameUpdate(input: GameInfo) {
        let outputs:number[] = this.neuralNetwork.update()


        return this.generateDirection(outputs)
    }

    private generateDirection(neuralNetworkOutput:number[]): Direction{
        var newDirection: Direction

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
                newDirection = Direction.DOWN()
                break;
            case 1:
                newDirection = Direction.UP()
                break;
            case 2:
                newDirection = Direction.LEFT()
                break;
            case 3:
                newDirection = Direction.RIGHT()
                break;
            default:        
        }
        return newDirection
    } 
}