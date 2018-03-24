import Vector from "../../Utils/vector";
import Direction from "./direction";
import HitDetection from "../../Utils/hitDetection";

class Snake {
    private body: SnakeBodyPart[] = [];
    private direction: Direction = Direction.RIGHT();
    private bodySize: Vector = new Vector(10, 10);
    private bodyColour: number = 0xaa33f4;
    constructor(private stage: PIXI.Container, private mapSize: Vector) {
        this.createSnake();
    }

    public get headRect(): PIXI.Rectangle {
        const head = this.body[0];
        return head.rect;
    }

    public get getBody(): PIXI.Rectangle[] {
        return this.body.map<PIXI.Rectangle>((bodyPart: SnakeBodyPart) => bodyPart.rect);
    }

    private createSnake() {
        this.newSnakeBody(new Vector(0, 0));
        this.onEatFood();
        this.onEatFood();
        this.onEatFood();

    }

    public move() {
        const head = this.body[0];
        const tail = this.body.pop();

        tail.x = head.x + this.bodySize.X * this.direction.X;
        tail.y = head.y + this.bodySize.Y * this.direction.Y;

        this.body.unshift(tail);
    }

    public setDirection(direction: Direction): void {
        if (this.direction.isDirectlyOpposite(direction)) {
            return;
        }

        this.direction = direction;
    }

    public onEatFood() {
        this.newSnakeBody(new Vector(
            this.headRect.x + this.bodySize.X * this.direction.X,
            this.headRect.y + this.bodySize.Y * this.direction.Y
        ));

    }

    printDetails() {
        for (var i = 0; i < this.body.length; i++) {
            console.log(`${i}: ${this.body[i].x}, ${this.body[i].y}`);
        }
    }


    private newSnakeBody(pos: Vector) {
        const bodyPart = new SnakeBodyPart(pos);
        bodyPart.beginFill(this.bodyColour);
        bodyPart.lineStyle(1, 0xe0ffe4, 1);
        bodyPart.drawRect(0, 0, this.bodySize.X - 1, this.bodySize.Y - 1);
        bodyPart.endFill();
        this.stage.addChild(bodyPart);
        this.body.unshift(bodyPart);
    }

    public isOverlappingWithSelf() {
        const headRect = this.headRect;
        for (let i = 1; i < this.body.length; i++) {
            const bodyPart = this.body[i];
            if (HitDetection.hasRectanglesHit(headRect, bodyPart.rect)) {
                return true;
            }
        }

        return false;
    }

    public destroy() {
        this.body.forEach(e => {
            e.destroy(true);
        });
    }
}

class SnakeBodyPart extends PIXI.Graphics {
    constructor(pos: Vector) {
        super();
        this.x = pos.X;
        this.y = pos.Y;
    }

    public get rect(): PIXI.Rectangle {
        return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
    }
}

export default Snake;