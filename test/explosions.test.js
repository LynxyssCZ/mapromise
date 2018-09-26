const BASE = process.env.BASE || 5;
const MAX_EXP = process.env.MAX_EXP || 6;

[
	['simple', require('../index')],
	['perf', require('../perf')]
].forEach(([name, Mapromise]) => {
	describe(`Heap explosion - ${name}`, function() {
		jest.setTimeout(3e5);

		for (let exp = 0; exp <= MAX_EXP; exp++) {
			const count = BASE * Math.pow(10, exp);

			describe(`${count.toExponential()} iterations`, function() {
				let turd = new Array(count);
				turd.fill(BASE);

				it('does not explode - concurrency 1', function() {
					return Mapromise(turd, (value) => ({value}), {concurrency: 1, collect: true})
				});

				it('does not explode - concurrency 2', function() {
					return Mapromise(turd, (value) => ({value}), {concurrency: 2, collect: true})
				});


				it(`does not explode - concurrency ${2 * BASE}`, function() {
					return Mapromise(turd, (value) => ({value}), {concurrency: 2 * BASE, collect: true})
				});

				it('does handle rejection well', function() {
					return Mapromise(turd, (x, index) => {
						if (index === count - 1) {
							return Promise.reject('I_FAILED_YOU');
						}
					}, {collect: true})
					.catch(reason => reason)
					.then(res => {
						expect(res).toEqual('I_FAILED_YOU');
					});
				});
			});
		};
	});
});
