[
	['simple', require('../index')],
	['perf', require('../perf')]
].forEach(([name, Mapromise]) => {
	describe(`Series - ${name}`, function() {
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

		describe('Basic iteration', function() {
			it('results should be sequential', function() {
				return Mapromise(input, identityCallback)
					.then((res) => {
						expect(res).toEqual(input);
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
						expect(output).toEqual(input);
						expect(res).toEqual(input);
					});
			});

			it('sets correct index', function() {
				return Mapromise(input, indexSensitiveCallback)
					.then((res) => {
						expect(res).toEqual(input.map(indexSensitiveCallback));
					});
			});

			it('doesn\'t collect data', async () => {
				const res = await Mapromise(input, identityCallback, {collect: false});
				expect(res).toEqual(input.length);
			})
		});
	});
});
