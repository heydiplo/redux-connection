'use strict';

exports.__esModule = true;

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// { path: '/items/:id', params: { id: 5 } } => { path: '/items/5', params: {} }
exports.default = function (api) {
  return function (options) {
    var params = options.params,
        path = options.path;

    var newParams = _extends({}, params);
    var newPath = path;

    if (params) {
      newPath = path.replace(/:([^:/.]+)/g, function (originalPart, param) {
        if ((0, _has3.default)(params, param)) {
          delete newParams[param];
          return params[param];
        }

        return originalPart;
      });
    }

    return api(_extends({}, options, {
      path: newPath,
      params: newParams
    }));
  };
};