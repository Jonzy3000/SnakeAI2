import { Container } from "pixi.js";
import Vector from "./../Utils/vector";
import VectorUtils from "./../Utils/vectorUtils";

class Food {
    private width: number = 10;
    private height: number = 10;
    private fillColour: number = 0xFF700B;
    private foodTile: PIXI.Graphics = new PIXI.Graphics();
    constructor(private stage: PIXI.Container, private mapSize: Vector) {

    }

    public spawnNewFood() {
        const newPoint : Vector = VectorUtils.getRandomPointInRange(this.mapSize);
        this.foodTile.beginFill(this.fillColour);
        this.foodTile.drawRect(0, 0, this.width, this.height);
        this.foodTile.endFill();
        this.foodTile.cacheAsBitmap = true;

        this.foodTile.x = newPoint.X;
        this.foodTile.y = newPoint.Y;

        this.stage.addChild(this.foodTile);
    }

    public eatFood() {
        this.foodTile.clear();
    }

    public get getFoodRect() : PIXI.Rectangle {
        return new PIXI.Rectangle(this.foodTile.x, this.foodTile.y, this.width, this.height);
    }

    public destory() {
        this.foodTile.destroy();
    }
}

export default Food