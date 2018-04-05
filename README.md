# Mapromise [![Build Status](https://travis-ci.org/LynxyssCZ/mapromise.svg?branch=master)](https://travis-ci.org/LynxyssCZ/mapromise)
`Promise.all([].map(() => {})).then(results => {})`, *serial*! (or even __concurent__)


## Usage
### Serial
```javascript
const Mapromise = require('mapromise');

const iterable = ['first', 'middle', 'last'];
function iterationCallback(value, index) {
	return new Promise((resolve) => {
		global.setTimeout(() => {
			resolve(value);
		}, (Math.random() * 10));
	});
}

Mapromise(iterable, iterationCallback).then(results => {
	console.log(results);
});

// > [first, middle, last]
```

### Concurrent
```javascript
const Mapromise = require('mapromise');

const iterable = ['first', 'middle', 'last'];
function iterationCallback(value, index) {
	return new Promise((resolve) => {
		global.setTimeout(() => {
			resolve(value);
		}, (Math.random() * 10));
	});
}

Mapromise(Iterable, iterationCallback, {concurency: 50}).then(results => {
	console.log(results);
});

// > [first, middle, last], order of execution is not guaranteed, but order of results is
```

### In
 - Iterable collection
 - Iterator callback - Asynchronous callback invoked on each value of the iterable
 - options
 defaults being:
 ```javascript
 {
	collect: true, // Do you want to collect results of each iteration (Array.map behavior)
	concurrency: 1 // For the concurrent variant
 }
 ```

### Out
`Promise`, duh!
 - Resolves to either array of results (ordered), or number of iterations (*not* index)
 - Rejects with the first rejection reason in series.
 On rejection, no subsequent callbacks are invoked

### Using specialized modules
Mapromise is split into two separate modules.
One to handle parallel operation and one for fully serial.
If you prefer including just one in your project, you can do so.

Otherwise the default export determines which iteration to choose based on `concurency` option supplied.

```javascript
// Handles only fully serial iteration
// Optimized for serial payload
const MapromiseSeries = require('mapromise/series');

// Can run with specified concurency, but is slightly slower than series for concurency of 1
const MapromiseConcurency = require('mapromise/concurency');
```

## Only arrays?
Everything that implements iterator interface (has `next` method), or has `Symbol.iterator` method defined.


## But why?
Because I had some uses for this behavior. `Async.mapSeries` is the best comparison.
Promises didn't offer this functionality natively and I don't know if Bluebird does.


## But 'new Promise' antipatern
Yeah, it's not *nice*, but it works, does not leak, and handles large collections without exploding the poor V8.


If you have cleaner solution, make a PR. I'd be glad for a one.


## Tests?
There are some. Though, they are mostly just pure smoke tests and slight torture/heap-explosion ones.
