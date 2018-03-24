import Food from "./food";
import Vector from "../Utils/vector";
import Snake from "./Snake/snake";
import KeyInputSnakeController from "./keyInputSnakeController"
import HitDetection from "../Utils/hitDetection";
import Score from "./score";
import GameInfo from "./gameInfo";

class Game {
    private food: Food;
    private snake: Snake;
    private keyInputSnakeController: KeyInputSnakeController;
    private count = 0;
    private score: Score;
    private gameActive: boolean = true;
    private fpsLimit: number = 15;
    private lastRender: number = -Infinity;

    constructor(private app: PIXI.Application, private gameUpdateCallback: ((input: GameInfo) => void)[]) {
        this.setupGame();
        app.start();
        this.renderLoop(0);
    }

    private setupGame() {
        this.setUpFood();
        this.setUpSnake();
        this.setUpKeyInputs();
        this.setupScore();
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

    private setupScore() {
        this.score = new Score(this.app.stage);
    }

    private notWithinMap(head: PIXI.Rectangle) {
        return head.x < 0 || head.y < 0 || head.x >= this.app.screen.width || head.y >= this.app.screen.height;
    }

    private resetGame() {
        this.snake.destroy();
        this.food.destory();
        this.score.reset();
        this.setupGame();
        this.gameActive = true;
    }


    private renderLoop(now: number) {
        requestAnimationFrame(this.renderLoop.bind(this));

        if (!this.gameActive || now - this.lastRender < (1000 / this.fpsLimit) - 1) {
            return;
        }

        this.lastRender = now;

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

        this.applyUpdateGameInfo();
    }

    private applyUpdateGameInfo() {
        let gameInfo: GameInfo = new GameInfo(
            this.food.getFoodRect, 
            this.snake.getBody, 
            !this.gameActive, 
            this.score.get, 
            this.snake.getDirection
        );
        
        this.gameUpdateCallback.forEach((callback) => callback(gameInfo));
    }
}

export default Game;