'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var createErrorHandler = function createErrorHandler(store, handleResponseError) {
  return function (error) {
    handleResponseError(error, store);

    return Promise.reject(error);
  };
};
// some general logic, like attaching auth_token to every request
// and signing out after auth error

exports.default = function (_ref) {
  var enhanceRequest = _ref.enhanceRequest,
      handleResponseError = _ref.handleResponseError;
  return function (api) {
    return function (requestParams) {
      return function (store) {
        var errorHandler = void 0;
        var newRequestParams = requestParams;

        if (enhanceRequest) {
          newRequestParams = (0, _lodash.merge)({}, requestParams, enhanceRequest(store, requestParams));
        }

        if (handleResponseError) {
          errorHandler = createErrorHandler(store, handleResponseError);
        }

        var call = api(newRequestParams);

        if (errorHandler) {
          call = call.catch(errorHandler);
        }

        if (requestParams.then) {
          call = call.then(requestParams.then);
        }

        return call;
      };
    };
  };
};