var assert = require('assert');
var client = require('../../').createClient({
  email: process.env.LIBRATO_METRICS_EMAIL,
  token: process.env.LIBRATO_METRICS_TOKEN,
});


var json = {
  gauges: [
    {name: 'node-librato-metrics-test', value: 123},
  ],
};

client.post('/metrics', json, function(err, response) {
  if (err) throw err;

  var metricName = json.gauges[0].name;
  client.get('/metrics/' + metricName, function(err, response) {
    if (err) throw err;

    assert.equal(response.name, metricName);
  });
});
