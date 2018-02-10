import Food from "./food";
import Vector from "../Utils/vector";
import Snake from "./Snake/snake";
import KeyInputSnakeController from "./keyInputSnakeController"
import HitDetection from "../Utils/hitDetection";

class Game {
    private food: Food;
    private snake: Snake;
    private keyInputSnakeController: KeyInputSnakeController;
    private count = 0;
    constructor(private app: PIXI.Application) {
        this.setupGame();
        app.ticker.add(() => this.renderLoop());
        app.start();
    }

    private setupGame() {
        this.setUpFood();
        this.setUpSnake();
        this.setUpKeyInputs();
    }

    private setUpFood() {
        this.food = new Food(this.app.stage, new Vector(this.app.screen.width, this.app.screen.height));
        this.food.spawnNewFood();
    }

    private setUpSnake() {
        this.snake = new Snake(this.app.stage, new Vector(this.app.screen.width, this.app.screen.height));
    }

    private setUpKeyInputs() {
        this.keyInputSnakeController = new KeyInputSnakeController(this.snake);
    }


    private renderLoop() {
        this.snake.move(3);
        if (HitDetection.hasRectanglesHit(this.snake.headRect, this.food.getFoodRect)) {
            this.food.eatFood();
            this.food.spawnNewFood();
            this.snake.onEatFood();
        }

        if (this.snake.isOverlappingWithSelf()) {
            alert("GAME OVER");
        }
    }
}

export default Game;