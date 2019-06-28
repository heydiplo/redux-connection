'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  return function (next) {
    return function (action) {
      if (!action.promise) return next(action);

      var promise = action.promise,
          types = action.types;


      var payload = action.payload || {};

      var START = types.START,
          SUCCESS = types.SUCCESS,
          FAILURE = types.FAILURE;


      next({ payload: payload, type: START });

      return promise.then(function (result) {
        next({ type: SUCCESS, payload: _extends({}, payload, { result: result }) });

        return result;
      }, function (error) {
        next({ type: FAILURE, payload: _extends({}, payload, { error: error }) });

        return Promise.reject(error);
      });
    };
  };
};