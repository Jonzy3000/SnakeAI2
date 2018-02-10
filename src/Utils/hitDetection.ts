import Vector from "./vector";


class HitDetection {
    public static hasRectanglesHit(r1: PIXI.Rectangle, r2: PIXI.Rectangle) {
        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        let r1Center = new Vector(
            r1.x + r1.width / 2,
            r1.y + r1.height / 2
        );

        let r2Center = new Vector(
            r2.x + r2.width / 2,
            r2.y + r2.height / 2
        );

        //Find the half-widths and half-heights of each sprite
        let r1Half = new Vector(
            r1.width / 2,
            r1.height / 2
        );

        let r2Half = new Vector(
            r2.width / 2,
            r2.height / 2
        );

        //Calculate the distance vector between the sprites
        let distance = new Vector(
            r1Center.X - r2Center.X,
            r1Center.Y - r2Center.Y
        );

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1Half.X + r2Half.X;
        combinedHalfHeights = r1Half.Y + r2Half.Y;

        //Check for a collision on the x axis
        if (Math.abs(distance.X) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(distance.Y) < combinedHalfHeights) {

                //There's definitely a collision happening
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    }
}

export default HitDetection;