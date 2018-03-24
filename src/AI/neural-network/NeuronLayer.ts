class NeuronLayer
{
	public neurons:Neuron[]
	constructor(
		private numNeuronsPerHiddenLayer:number, 
		private numInputs:number)
	{
        this.neurons = [];

		for (var i = 0; i < numNeuronsPerHiddenLayer; ++i)
		{
			var newNeuron = new Neuron(numInputs);
			
			this.neurons.push(newNeuron);
		}
	}
}