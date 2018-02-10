import * as PIXI from "pixi.js";
import Game from "./game";

class Entry {
    private app: PIXI.Application;
    private width: number;
    private height: number;
    constructor() {
        this.app = new PIXI.Application({ roundPixels: true });
        document.body.appendChild(this.app.view);
        new Game(this.app);
    }
}

export default Entry;