# Mapromise
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

Mapromise(Iterable, iterationCallback[, options]).then(results => {
	console.log(results);
});

// > [first, middle, last]
```

### Concurrent
```javascript
const Mapromise = require('mapromise/concurrency');

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

// > [first, middle, last], order not guaranteed
```

### In
 - Iterable collection
 - Iterator callback - Asynchronous callback invoked on each value of the iterable
 - options
 defaults being:
 ```javascript
 {
	collect: true,
	concurrency: 1 // For the concurrent variant
 }
 ```

### Out
`Promise`, duh!
 - Resolves to either array of results (ordered), or number of iterations (*not* index)
 - Rejects with the first rejection reason in series.
 On rejection, no subsequent callbacks are invoked



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
