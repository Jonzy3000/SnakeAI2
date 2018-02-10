import Vector from "./vector";

class VectorUtils {
    public static getRandomPointInRange(max: Vector): Vector {
        return new Vector(this.getRandomInt(max.X), this.getRandomInt(max.Y));
    }

    public static getRandomInt(max: number): number {
        return Math.floor(Math.random() * max + 1);
    }
}

export default VectorUtils;