import KeyInput from "../Inputs/keyInput";
import Direction from "./Snake/direction";
import Snake from "./Snake/snake";

class KeyInputSnakeController {
    left = new KeyInput(37);
    right = new KeyInput(39);
    up = new KeyInput(38);
    down = new KeyInput(40);
    r = new KeyInput(82);

    constructor(private snake: Snake, rKeyCallBack: () => void) {
        this.left.press = () => this.snake.setDirection(Direction.LEFT());
        this.right.press = () => this.snake.setDirection(Direction.RIGHT());
        this.up.press = () => this.snake.setDirection(Direction.UP());
        this.down.press = () => this.snake.setDirection(Direction.DOWN());
        this.r.press = () => rKeyCallBack();
    }
}

export default KeyInputSnakeController;