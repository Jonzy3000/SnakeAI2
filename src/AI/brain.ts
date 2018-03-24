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

        snake.setDirection(Direction.randomDirection());
    }
}