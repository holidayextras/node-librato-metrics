var util        = require('util');
var request     = require('request');
var url         = require('url');
var packagejson = require('../package.json');

module.exports = Client;
function Client(options) {
  this.email = options.email;
  this.token = options.token;

  this._endpoint = 'https://metrics-api.librato.com/v1';
}

Client.createClient = function(options) {
  return new Client(options);
};

Client.prototype.get = function(path, cb) {
  this.request({
    method : 'GET',
    path   : path,
  }, cb);
};

Client.prototype.post = function(path, json, cb) {
  this.request({
    method : 'POST',
    path   : path,
    json   : json,
  }, cb);
};

Client.prototype.request = function(options, cb) {
  var requestOptions = {
    method  : options.method,
    uri     : this._endpoint + options.path,
    json    : options.json,
    headers : {
      authorization : this._authorization(),
      'user-agent'  : 'node-librato-metrics/'+ packagejson.version
    },
  };

  request(requestOptions, function(err, response, body) {
    if(!response) {
      err = new Error('node-librato-metrics: No response received!')
    }
    var code = response.statusCode || '';
    if (!err && ((body && body.errors) || code > 399)) {
      err = new Error(
        'LibratoMetrics.Error: ' +
        util.inspect(body) +
        ' (statusCode: ' + code + ')'
      );
    }

    // No need to parse the body the request module takes care of that if `requestOptions.json` is used
    if(!requestOptions.json){
      try{
        if (body) body = JSON.parse(body);
      } catch (_err) {
        if (!err) err = _err;
      }
    }

    cb(err, body);
  });
};

Client.prototype._authorization = function() {
  var credentials = this.email + ':' + this.token;
  return 'Basic ' + new Buffer(credentials).toString('base64');
};
