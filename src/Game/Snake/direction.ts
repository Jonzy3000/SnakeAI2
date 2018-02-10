import Vector from "../../Utils/vector";

class Direction extends Vector {
    private constructor(x: number, y: number) {
        super(x,y);
    }

    static LEFT() : Direction {
        return new Direction(-1, 0);
    }

    static RIGHT(): Direction {
        return new Direction(1, 0);
    }

    static UP(): Direction {
        return new Direction(0, -1);
    }

    static DOWN(): Direction {
        return new Direction(0, 1);
    }

    public isDirectlyOpposite(other : Direction) {
        return this.X * -1 === other.X && this.Y *-1 === other.Y; 
    }
}

export default Direction;