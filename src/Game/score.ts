

class Score {
    private score: number = 0;
    private textObj: PIXI.Text;

    constructor(private stage: PIXI.Container) {
        this.textObj = new PIXI.Text(this.score  + "", new PIXI.TextStyle(
            {
                fill: "white"
            }
        ));

        this.textObj.x = 10;
        this.textObj.y = 0;
        this.stage.addChild(this.textObj);
    }

    public get get() {
        return this.score;
    }

    public increase() {
        this.score++;
        this.textObj.text = this.score.toString();

    }

    public reset() {
        this.score = 0;
        this.textObj.text = this.score.toString();
    }
}

export default Score;