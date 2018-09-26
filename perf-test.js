try {
	require('benchmark');
	require('p-map');
}
catch (e) {
	console.log(e);
	console.warning('Install benchmark microtime p-map to run this perf test')
}

const Benchmark = require('benchmark');
const implementations = {
	pmap: require('p-map'),
	perf: require('./perf'),
	simple: require('./index'),
};
const count = 500;

const suite = new Benchmark.Suite();

[1, 2, 5, 10, 20, 50, count - 1, count].forEach(concurrency => {
	Object.entries(implementations).forEach(([name, implementation]) => {
		suite.add(`${name} - ${count} by ${concurrency}`, function(defered) {
			const turd = new Array(count);
			turd.fill(count);
			implementation(turd, (value) => new Promise((resolve) => {
				global.setImmediate(resolve);
			}), {collect: false, concurrency}).then(() => defered.resolve());
		}, {defer: true});
	})
})

suite
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({async: true});
