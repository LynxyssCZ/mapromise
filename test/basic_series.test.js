const expect = require('chai').expect;
const Mapromise = require('../series');


describe('Series', function() {
	const input = [3,2,4,1,5,6,7,4];

  const identityCallback = (value) => {
		return new Promise((resolve) => {
			global.setTimeout(() => {
				resolve(value);
			}, value);
		});
	};

	const indexSensitiveCallback = (value, index) => {
		return value - index;
	};

	context('Basic iteration', function() {
    it('results should be sequential', function() {
			return Mapromise(input, identityCallback)
				.then((res) => {
					expect(res).eql(input);
				});
		});

		it('execution should be fully serial', function() {
			const output = [];
			const identityCallback = (value) => {
				return new Promise((resolve) => {
					global.setTimeout(() => {
						output.push(value);
						resolve(value);
					}, value);
				});
			};

			return Mapromise(input, identityCallback)
				.then((res) => {
					expect(output).eql(input);
					expect(res).eql(input);
				});
		});

		it('should set correct index', function() {
			return Mapromise(input, indexSensitiveCallback)
				.then((res) => {
					expect(res).eql(input.map(indexSensitiveCallback));
				});
		});
	});
});
