module.exports = async (collection, mapper, config = {collect: true, concurrency: 1}) => {
	const concurrency = config.concurrency || 1
	const collect = config.collect !== false
	const iterator = collection[Symbol.iterator]()
	const runners = []
	const results = []

	let isIterableDone = false
	let index = 0

	const run = async () => {
		let current

		while (!isIterableDone) {
			current = iterator.next()
			isIterableDone |= current.done
			if (isIterableDone) break

			const currentIndex = index++

			const result = await mapper(current.value, currentIndex)
			if (collect) results[currentIndex] = result
		}
	}

	if (concurrency === 1) {
		await run()
	} else {
		try {
			while (runners.length < concurrency) {
				runners.push(run())
				if (isIterableDone) break
			}

			await Promise.all(runners)
		} catch (e) {
			isIterableDone = true
			throw e
		}
	}

	return collect ? results : index
}
