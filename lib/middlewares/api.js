'use strict';

exports.__esModule = true;

exports.default = function (store) {
  return function (next) {
    return function (action) {
      if (!action.api) return next(action);

      return next({
        types: action.types,
        payload: action.payload,
        promise: action.api(store)
      });
    };
  };
};