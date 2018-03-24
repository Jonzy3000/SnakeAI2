import Vector from "./vector";

class VectorUtils {
    public static getRandomPointInRange(max: Vector): Vector {
        return new Vector(this.getRandomInt(max.X), this.getRandomInt(max.Y));
    }

    public static getRandomInt(max: number): number {
        return Math.floor(Math.random() * max + 1);
    }

    public static getRandPointRounded(max: Vector, nearest: number) {
        let randomX = this.getRandomInt(max.X);
        randomX = randomX - randomX % nearest;
        let randomY = this.getRandomInt(max.Y);
        randomY = randomY - randomY % nearest;
        return new Vector(randomX, randomY);
    }

}

export default VectorUtils;