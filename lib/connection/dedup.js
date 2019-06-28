'use strict';

exports.__esModule = true;

exports.default = function (api) {
  var inflight = {};

  var onSuccess = function onSuccess(key) {
    return function (r) {
      delete inflight[key];

      return r;
    };
  };

  var onFailure = function onFailure(key) {
    return function (error) {
      delete inflight[key];

      return Promise.reject(error);
    };
  };

  var getHash = function getHash(options) {
    var method = options.method,
        path = options.path,
        params = options.params;


    return [method, path, JSON.stringify(params)].join('/');
  };

  var withDedup = function withDedup(options) {
    if (options.method !== 'GET') {
      return api(options);
    }

    var hash = getHash(options);

    if (!inflight[hash]) {
      inflight[hash] = api(options).then(onSuccess(hash), onFailure(hash));
    }

    return inflight[hash];
  };

  withDedup.inflight = inflight;

  return withDedup;
};
// keeps track of requests inflight and attaches to them
// insted of firing a new one