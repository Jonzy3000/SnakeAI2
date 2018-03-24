import AISetup from "./setup"

import GameInfo from "./../Game/gameInfo"
import Direction from "../Game/Snake/direction";
import Snake from "../Game/Snake/snake";

export default class Brain {
    constructor() {
        
    }

    public onGameUpdate(input: GameInfo, snake: Snake) {
        if (input.getGameFinished) {
            return;
        }

        console.log(input.getDuration);

        //Ideally we would just get a callback, but this is confusing in js 
        snake.setDirection(Direction.randomDirection());
    }
}