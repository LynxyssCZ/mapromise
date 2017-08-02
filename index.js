module.exports = function mapromise(collection, callback, options = {}) {
	if (options.concurrency > 1) {
		return require('./concurrency')(collection, callback, options);
	} else {
		return require('./series')(collection, callback, options);
	}
};
