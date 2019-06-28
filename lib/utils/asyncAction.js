'use strict';

exports.__esModule = true;

exports.default = function (actionName) {
  return {
    START: actionName,
    SUCCESS: actionName + '_SUCCESS',
    FAILURE: actionName + '_FAILURE'
  };
};