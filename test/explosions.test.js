const expect = require('chai').expect;
const Mapromise = require('../series');
const MapromiseConcurrent = require('../concurrency');
const BASE = process.env.BASE || 5;
const MAX_EXP = process.env.MAX_EXP || 6;

describe('Heap explosion', function() {
	this.timeout(3e5);

	for (let exp = 0; exp <= MAX_EXP; exp++) {
		const count = BASE * Math.pow(10, exp);

		context(`${count.toExponential()} iterations`, function() {
			let turd = new Array(count);
			turd.fill(BASE);

			it('should not explode - no concurrency', function() {
				return Mapromise(turd, () => {}, {collect: false})
					.then(res => expect(res).equal(count));
			});

			it('should not explode - concurrency 1', function() {
				return MapromiseConcurrent(turd, (value) => ({value}), {concurrency: 1, collect: false})
					.then(res => expect(res).equal(count));
			});

			it('should not explode - concurrency 2', function() {
				return MapromiseConcurrent(turd, (value) => ({value}), {concurrency: 2, collect: false})
					.then(res => expect(res).equal(count));
			});


			it(`should not explode - concurrency ${2 * BASE}`, function() {
				return MapromiseConcurrent(turd, (value) => ({value}), {concurrency: 2 * BASE, collect: false})
					.then(res => expect(res).equal(count));
			});

			it('should handle rejection well', function() {
				return Mapromise(turd, (x, index) => {
					if (index === count - 1) {
						return Promise.reject('I_FAILED_YOU');
					}
				}, {collect: false})
				.catch(reason => reason)
				.then(res => {
					expect(res).equal('I_FAILED_YOU');
				});
			});
		});
	}
});
