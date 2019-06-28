'use strict';

exports.__esModule = true;

exports.default = function (api) {
  var wrapper = function wrapper(method) {
    return function (path, params, then) {
      return api({ method: method, path: path, params: params, then: then });
    };
  };

  return {
    POST: wrapper('POST'),
    GET: wrapper('GET'),
    DELETE: wrapper('DELETE'),
    PATCH: wrapper('PATCH')
  };
};