function Mapromise(collection, callback, options = {}) {
	return new Promise(function(resolve, reject) {
		const concurrency = options.concurrency || 1;
		let iterator;
		if (Reflect.has(collection, 'next')) iterator = collection;
		if (collection[Symbol.iterator]) iterator = collection[Symbol.iterator]();
		if (!iterator) return reject(new Error('Not iterable'));

		const bulk = {
			next() {
				let current = this.iterator.next();
				if (current.done) {
					if (this.running === 0 && !this.rejected) resolve(this.accumulator || this.index);
					this.done = true;
					return;
				}
				let currentIndex = this.index;
				Promise.resolve(callback(current.value, currentIndex))
					.then((result) => this.resolve(result, currentIndex))
					.catch((reason) => this.reject(reason));

				this.index++;
				this.running++;
			},
			resolve(result, index) {
				this.running--;
				if (this.accumulator) this.accumulator[index] = result;
				this.next();
			},
			reject(reason) {
				this.rejected = true;
				this.done = true;
				reject(reason);
			},
			accumulator: options.collect === false ? null : [],
			running: 0,
			index: 0,
			iterator
		};


		while(bulk.running < concurrency) {
			bulk.next();
			if (bulk.done) break;
		}
	});
}

module.exports = Mapromise;
