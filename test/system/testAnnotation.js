var assert = require('assert');
var client = require('../../').createClient({
  email: process.env.LIBRATO_METRICS_EMAIL,
  token: process.env.LIBRATO_METRICS_TOKEN,
});

var annotationName = 'node-librato-metrics-annotation-test';
var annotationEvent = {
  title : 'annotation-test',
  source : 'node-librato-metrics-test',
  start_time : Date.now() / 1000
};
client.post('/annotations/' + annotationName,annotationEvent,function(err,data){
  if(err) throw err;
  assert.equal(data.title,annotationEvent.title);
  assert.equal(data.source,annotationEvent.source);
  assert.equal(data.end_time,null);
  assert.equal(data.description,null);
});