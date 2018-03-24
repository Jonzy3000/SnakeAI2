
import Vector from "./../Utils/vector";

export default class GameInfo {
    private foodLocation: PIXI.Rectangle;
    private snakeBody: PIXI.Rectangle[];
    private gameFinished: boolean;
    private score: number;

    constructor(
        foodLocation: PIXI.Rectangle,
        snakeBody: PIXI.Rectangle[],
        gameFinished: boolean,
        score: number
    ) {
        this.foodLocation = foodLocation;
        this.snakeBody = snakeBody;
    }

    public get getSnakeBody(): PIXI.Rectangle[] {
        return this.snakeBody;
    }

    public get getFoodLocation(): PIXI.Rectangle {
        return this.foodLocation;
    }

    public get getScore(): number {
        return this.score;
    }

    public get getGameFinished(): boolean {
        return this.gameFinished;
    }
}
