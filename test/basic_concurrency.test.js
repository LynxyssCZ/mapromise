[
	['simple', require('../index')],
	['perf', require('../perf')]
].forEach(([name, Mapromise]) => {
	describe(`Concurrency - ${name}`, function() {
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

		describe('Basic iteration', function() {
			it('results should be sequential', function() {
				return Mapromise(input, identityCallback, {concurrency: 2})
					.then((res) => {
						expect(res).toEqual(input);
					});
			});

			it('calls with a correct index', function() {
				return Mapromise(input, indexSensitiveCallback, {concurrency: 5})
					.then((res) => {
						expect(res).toEqual(input.map((value, index) => value - index));
					});
			});

			it('handles having no workload for multiple workers', async () => {
				const result = await Mapromise([1], identityCallback, {concurrency: 5})
				expect(result).toEqual([1]);
			})

			it('does not explode on multiple rejections', async () => {
				try {
					const result = await Mapromise(input, () => new Promise((resolve, reject) => {
						setTimeout(() => {reject('FAIL')});
					}), {concurrency: 5})
				}
				catch (e) {
					expect(e).toEqual('FAIL');
				}
			})
		});
	});
});
