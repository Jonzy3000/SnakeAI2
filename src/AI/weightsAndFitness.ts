

export default class WeightsAndFitness {
    constructor(private weights: number[], private fitness: number) {

    }

    public get getWeights() : number[] {
        return this.weights;
    }

    public get getFitness() : number {
        return this.fitness;
    }
}