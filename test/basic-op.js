const expect = require('chai').expect;
const Mapromise = require('../series');


describe('Basic operations', function() {
	const input = [3,2,4,1,5,6,7,4];
	let output;
	const identityCallback = (value) => {
		return new Promise((resolve) => {
			global.setTimeout(() => {
				output.push(value);
				resolve(value);
			}, value);
		});
	};
	const indexSensitiveCallback = (value, index) => {
		return new Promise((resolve) => {
			global.setTimeout(() => {
				output.push(value - index);
				resolve(value - index);
			}, value);
		});
	};

	beforeEach('clean output', function() {
		output = [];
	});

	context('Basic iteration', function() {
		it('Should be fully sequential', function() {
			return Mapromise(input, identityCallback)
				.then(() => {
					expect(output).eql(input);
				});
		});

		it('should set correct index', function() {
			return Mapromise(input, indexSensitiveCallback)
				.then(() => Promise.all(input))
				.then((input) => {
					expect(output).eql(input.map((value, index) => value - index));
				});
		});
	});
});
