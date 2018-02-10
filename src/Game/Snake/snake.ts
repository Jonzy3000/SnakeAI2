import Vector from "../../Utils/vector";
import Direction from "./direction";
import HitDetection from "../../Utils/hitDetection";

class Snake {
    private body: SnakeBodyPart[] = [];
    private direction: Direction = Direction.RIGHT();
    private bodySize: Vector = new Vector(10, 10);
    private bodyColour: number =  0xaa33f4;
    constructor(private stage: PIXI.Container, private mapSize: Vector) {
        this.createSnake();
    }

    public get headRect() : PIXI.Rectangle {
        const head = this.body[0];
        return new PIXI.Rectangle(head.x, head.y, head.width, head.height);
    }

    private createSnake() {
        this.newSnakeBody(new Vector(this.mapSize.X / 2, this.mapSize.Y / 2));
        this.newSnakeBody(new Vector(0,0));
        this.newSnakeBody(new Vector(0,0));

    }

    public move(velocity: number) {
        this.moveBody();
        this.moveHead(velocity);
    }

    private moveBody() {
        if (this.body.length > 1) {
            for (let i = this.body.length - 1; i > 0; i--) {
                const oldBodyPart = this.body[i];
                const newBodyPart = this.body[i - 1];

                oldBodyPart.x = newBodyPart.x; 
                oldBodyPart.y = newBodyPart.y; 
            }
        }
    }

    private moveHead(velocity: number) {
        const head = this.body[0];
        head.x += (velocity * this.direction.X);
        head.y += (velocity * this.direction.Y);
    }

    public setDirection(direction : Direction): void {
        if (this.direction.isDirectlyOpposite(direction)) {
            return;
        }

        this.direction = direction;
    }

    public onEatFood() {
        this.newSnakeBody(new Vector(0,0));
    }

    private newSnakeBody(pos: Vector) {
        const bodyPart = new SnakeBodyPart(pos);
        bodyPart.beginFill(this.bodyColour);
        bodyPart.drawRect(0, 0, this.bodySize.X, this.bodySize.Y);
        bodyPart.endFill();
        this.stage.addChild(bodyPart);
        this.body.push(bodyPart);
    }

    public isOverlappingWithSelf() {
        // const headRect = this.headRect;
        // for (let i = 1; i < this.body.length; i++) {
        //     const bodyPart = this.body[i];
        //     if (HitDetection.hasRectanglesHit(headRect, bodyPart.getBounds())) {
        //         return true;
        //     }
        // }

        return false;
    }
}

class SnakeBodyPart extends PIXI.Graphics {
    constructor(pos: Vector) {
        super();
        this.x = pos.X;
        this.y = pos.Y;
    }
}

export default Snake;