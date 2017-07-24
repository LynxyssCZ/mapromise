/**
 * Kicks off the iteration
 * @method Mapromise
 * @param {Iterable} collection Collection to iterate over
 * @param {Function} callback Callback of each iteration, takes value and index
 * @param {Bool} [noCollect=false] Disable collecting of results
 * @returns {Promise} Promise resolved/rejected based on the iteration process (RTFM)
 */
function Mapromise(collection, callback, options = {}) {
	return new Promise(function(resolve, reject) {
		let iterator;
		const collector = options.collect !== false ? [] : null;

		if (Reflect.has(collection, 'next')) iterator = collection;
		if (collection[Symbol.iterator]) iterator = collection[Symbol.iterator]();
		if (!iterator) return reject(new Error('Not iterable'));

		iterationStep(iterator, 0, callback, collector, (result) => resolve(result), (reason) => reject(reason));
	});
}

function iterationStep(iterator, index, callback, collector, resolve, reject) {
	let current = iterator.next();
	if (current.done) return resolve(collector || index);

	Promise.resolve(callback(current.value, index))
		.then((result) => {
			if (collector) collector.push(result);
			iterationStep(iterator, index + 1, callback, collector, resolve, reject);
		})
		.catch(reject);
}

module.exports = Mapromise;
