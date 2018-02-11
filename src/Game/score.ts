

class Score {
    private score: number = 0;

    constructor() {

    }

    public get get() {
        return this.score;
    }

    public increase() {
        this.score++;
    }

    public reset() {
        this.score = 0;
    }
}

export default Score;