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
    if (response.statusCode > 399 && !err) {
      if (body.errors) {
        var messages = [];

        if (body.errors.params) {
          for (var key in body.errors.params) {
            var msgs = body.errors.params[key];
            messages.push(key + " " + msgs.join(", ") + ".");
          }
        }

        if (body.errors.request) {
          body.errors.request.forEach(function(v) {
            messages.push(v);
          });
        }

        if (body.errors.system) {
          body.errors.system.forEach(function(v) {
            messages.push(v);
          });
        }

        if (messages.length === 0) {
          messages = [body.errors.toString()];
        }

        err = new Error(messages.join(" "));
      }

      else {
        err = new Error("Unexpected error (" + response.statusCode + ").");
      }

      // If possible, the body has been parsed into useful errors
      // already. Don't confuse the callback by passing it along.

      body = null;
    }

    if (cb) {
      cb(err, body);
    }
  });
};
