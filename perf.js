module.exports = async (collection, mapper, config = {collect: true, concurrency: 1}) => {
	const concurrency = config.concurrency || 1;
	const collect = config.collect !== false;
	const iterator = collection[Symbol.iterator]();
	const results = [];

	let running = 0;
	let defered = null;
	let done = false;
	let index = 0;

	const defer = () => new Promise((resolve, reject) => {defered = {
		resolve() {
			defered = null;
			done = true;
			process.nextTick(resolve);
		},
		reject(err) {
			defered = null;
			done = true;
			process.nextTick(reject, err);
		}};
	})

	const run = async () => {
		try {
			let current
			running++;
			while (!done) {
				current = iterator.next();
				done |= current.done;
				if (done) break;

				let currentIndex = index++;
				const result = await mapper(current.value, currentIndex)
				if (collect) results[currentIndex] = result
			}
			running--;

			if (running === 0 && defered) {
				return defered.resolve();
			}
		}
		catch (e) {
			if (defered) defered.reject(e);
		}
	};

	if (concurrency === 1) {
		process.nextTick(run);
	} else {
		for (var i = 0; i < concurrency; i++) {
			process.nextTick(run);
		}
	}

	await defer();
	return collect ? results : index;
};
