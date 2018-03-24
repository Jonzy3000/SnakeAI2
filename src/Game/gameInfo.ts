
import Vector from "./../Utils/vector";
import Direction from "./Snake/direction"

export default class GameInfo {
    private foodLocation: PIXI.Rectangle;
    private snakeBody: PIXI.Rectangle[];
    private gameFinished: boolean;
    private score: number;
    private direction: Direction;

    constructor(
        foodLocation: PIXI.Rectangle,
        snakeBody: PIXI.Rectangle[],
        gameFinished: boolean,
        score: number,
        direction: Direction,
    ) {
        this.foodLocation = foodLocation;
        this.snakeBody = snakeBody;
        this.gameFinished = gameFinished;
        this.score = score;
        this.direction = direction;
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

    public get getDirection(): Direction {
        return this.direction;
    }
}
