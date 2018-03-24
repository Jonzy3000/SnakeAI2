import * as PIXI from "pixi.js";
import Game from "./game";
import Brain from "../AI/brain";

class Entry {
    private app: PIXI.Application;
    private width: number;
    private height: number;
    private numberOfSnakes: number = 1;
    constructor() {
        this.app = new PIXI.Application({ roundPixels: true });
        document.body.appendChild(this.app.view);

        for (let i = 0; i < this.numberOfSnakes; i++) {
            new Game(this.app, [new Brain().onGameUpdate]);
        }
    }
}

export default Entry;