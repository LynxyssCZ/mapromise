const expect = require('chai').expect;
const Mapromise = require('../concurrency');

describe('Concurrency', function() {
	const input = [3,2,4,1,5,6,7,4];

	const identityCallback = (value) => {
		return new Promise((resolve) => {
			global.setTimeout(() => {
				resolve(value);
			}, value);
		});
	};

	const indexSensitiveCallback = (value, index) => {
		return new Promise((resolve) => {
			global.setTimeout(() => {
				resolve(value - index);
			}, value);
		});
	};

	context('Basic iteration', function() {
		it('results should be sequential', function() {
			return Mapromise(input, identityCallback)
				.then((res) => {
					expect(res).eql(input);
				});
		});

		it('should call with a correct index', function() {
			return Mapromise(input, indexSensitiveCallback)
				.then((res) => {
					expect(res).eql(input.map((value, index) => value - index));
				});
		});
	});
});
