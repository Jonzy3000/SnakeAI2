import Food from "./food";
import Vector from "../Utils/vector";
import Snake from "./Snake/snake";
import KeyInputSnakeController from "./keyInputSnakeController"
import HitDetection from "../Utils/hitDetection";
import Score from "./score";

class Game {
    private food: Food;
    private snake: Snake;
    private keyInputSnakeController: KeyInputSnakeController;
    private count = 0;
    private score: Score = new Score();
    private gameActive: boolean = true;
    constructor(private app: PIXI.Application) {
        this.setupGame();
        setInterval(() => this.renderLoop(), 1000 / 15);
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
        this.keyInputSnakeController = new KeyInputSnakeController(this.snake, this.resetGame.bind(this));
    }

    private notWithinMap(head: PIXI.Rectangle) {
        return head.x < 0 || head.y < 0 || head.x > this.app.screen.width || head.y > this.app.screen.height;
    }

    private resetGame() {
        this.snake.destroy();
        this.food.destory();
        this.score.reset();
        this.setupGame();
        this.gameActive = true;
    }


    private renderLoop() {
        if (!this.gameActive) {
            return;
        }
        this.snake.move();
        if (HitDetection.hasRectanglesHit(this.snake.headRect, this.food.getFoodRect)) {
            this.food.eatFood();
            this.food.spawnNewFood();
            this.snake.onEatFood();
            this.score.increase();

        }

        if (this.snake.isOverlappingWithSelf() || this.notWithinMap(this.snake.headRect)) {
            this.gameActive = false;
        }
    }
}

export default Game;