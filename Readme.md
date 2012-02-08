# librato-metrics

A node module for sending data to [librato metrics][].

[librato metrics]: metrics.librato.com

## Install

```
npm install librato-metrics
```

## Example

```js
var client = require('librato-metrics').createClient({
  email: 'user@example.org',
  token: '...',
});

client.post('/metrics', {
  gauges: [
    {name: 'metric1', value: 123},
  ],
}, function(err, response) {
  if (err) throw err;

  console.log(response);
});
```

## License

Licensed under the MIT license.
