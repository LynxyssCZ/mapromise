const implementations = [
	['basic', require('./index')],
	['perf', require('./perf')],
]

for (const [name, Mapromise] of implementations) {
	describe(`${name} implementation`, () => {
		describe('Serial', () => {
			const input = [3, 2, 4, 1, 5, 6, 7, 4]

			const identityCallback = (value) => {
				return new Promise((resolve) => {
					global.setTimeout(() => {
						resolve(value)
					}, value)
				})
			}

			const indexSensitiveCallback = (value, index) => {
				return value - index
			}

			describe('Basic iteration', () => {
				it('results should be sequential', async () => {
					const res = await Mapromise(input, identityCallback)
					expect(res).toEqual(input)
				})

				it('execution should be fully serial', async () => {
					const output = []
					const identityCallback = (value) => {
						return new Promise((resolve) => {
							global.setTimeout(() => {
								output.push(value)
								resolve(value)
							}, value)
						})
					}

					const res = await Mapromise(input, identityCallback)
					expect(output).toEqual(input)
					expect(res).toEqual(input)
				})

				it('sets correct index', async () => {
					const res = await Mapromise(input, indexSensitiveCallback)
					expect(res).toEqual(input.map(indexSensitiveCallback))
				})

				it('doesn\'t collect data', async () => {
					const res = await Mapromise(input, identityCallback, {collect: false})
					expect(res).toEqual(input.length)
				})
			})
		})

		describe('Concurrent', () => {
			const input = [3, 2, 4, 1, 5, 6, 7, 4]

			const identityCallback = (value) => {
				return new Promise((resolve) => {
					global.setTimeout(() => {
						resolve(value)
					}, value)
				})
			}

			const indexSensitiveCallback = (value, index) => {
				return new Promise((resolve) => {
					global.setTimeout(() => {
						resolve(value - index)
					}, value)
				})
			}

			describe('Basic iteration', () => {
				it('results should be sequential', async () => {
					const res = await Mapromise(input, identityCallback, {concurrency: 2})
					expect(res).toEqual(input)
				})

				it('calls with a correct index', async () => {
					const res = await Mapromise(input, indexSensitiveCallback, {concurrency: 5})
					expect(res).toEqual(input.map((value, index) => value - index))
				})

				it('handles having no workload for multiple workers', async () => {
					const result = await Mapromise([1], identityCallback, {concurrency: 5})
					expect(result).toEqual([1])
				})

				it('does not explode on multiple rejections', async () => {
					await expect(Mapromise(input, () => new Promise((resolve, reject) => {
						setTimeout(() => { reject(new Error('FAIL')) }, 10)
					}), {
						concurrency: 5,
					})).rejects.toThrow('FAIL')
				})
			})
		})

		describe('Generators and generic iterables', () => {
			const input = [3, 2, 4, 1, 5, 6, 7, 4]

			function * inputGen () {
				for (const val of input) yield val
			}

			const identityCallback = (value) => {
				return new Promise((resolve) => {
					global.setTimeout(() => {
						resolve(value)
					}, value)
				})
			}

			const indexSensitiveCallback = (value, index) => {
				return value - index
			}

			it('results should be sequential', async () => {
				const res = await Mapromise(inputGen(), identityCallback)
				expect(res).toEqual(input)
			})

			it('calls with a correct index', async () => {
				const res = await Mapromise(inputGen(), indexSensitiveCallback, {concurrency: 5})
				expect(res).toEqual(input.map((value, index) => value - index))
			})
		})
	})
}
