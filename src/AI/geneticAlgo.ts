import AISetup from "./setup"

import GameInfo from "./../Game/gameInfo";
import Game from "./../Game/game";
import Brain from "./brain";

export default class GeneticAlgorithm {
    constructor(private app: PIXI.Application, private numberOfSnakes: number) {
        this.startGeneration();
    }

    //Instatiate the brains 
    public startGeneration() {
        for (let i = 0; i < this.numberOfSnakes; i++) {
            let brain = new Brain(4, 2, 4, []);
            new Game(this.app, [brain.onGameUpdate.bind(brain)]);
        }
    }

    //fitness function: score squared/time
    //todo: Every 5 seconds: are you all finished? I.e. we need some way of checking if all done.


}