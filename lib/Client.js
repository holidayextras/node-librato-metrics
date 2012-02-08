var request = require('request');
var url = require('url');

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
  var uri = url.parse(this._endpoint);
  uri.auth = this.email + ':' + this.token;
  uri = url.format(uri) + options.path;

  var requestOptions = {
    method : options.method,
    uri    : uri,
    json   : options.json,
  };

  request(requestOptions, function(err, response, body) {
    if (body && body.errors) {
      err = new Error('LibratoErrors: ' + JSON.stringify(body));
    }

    cb(err, body);
  });
};
