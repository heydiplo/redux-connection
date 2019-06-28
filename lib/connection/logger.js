'use strict';

exports.__esModule = true;

exports.default = function (enabled) {
  return function (api) {
    if (!enabled) return api;

    return function (options) {
      var started = new Date();

      var finished = function finished(status) {
        var time = new Date() - started;

        console.log('API ' + options.path + ': ' + status + ' ' + time + 'ms');
      };

      var onSuccess = function onSuccess(response) {
        finished('OK');
        return response;
      };
      var onError = function onError(error) {
        finished('ERROR');
        throw error;
      };

      return api(options).then(onSuccess, onError);
    };
  };
};