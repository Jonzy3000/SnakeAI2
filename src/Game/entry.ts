import * as PIXI from "pixi.js";
import Game from "./game";
import Brain from "../AI/brain";
import GeneticAlgorithm from "../AI/geneticAlgo";

class Entry {
    private app: PIXI.Application;
    private width: number;
    private height: number;
    private numberOfSnakes: number = 1;
    private geneticAlgorithm: GeneticAlgorithm;
    constructor() {
        this.app = new PIXI.Application({ roundPixels: true, width:300, height:400 });
        document.body.appendChild(this.app.view);

        //Instantiate the Genetic Algorithm
        this.geneticAlgorithm = new GeneticAlgorithm(this.app, this.numberOfSnakes);

        //Instatiate the brains (old)
        // for (let i = 0; i < this.numberOfSnakes; i++) {
        //     new Game(this.app, [new Brain().onGameUpdate]);
        // }
    }
}

export default Entry;