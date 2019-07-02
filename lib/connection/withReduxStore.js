'use strict';

exports.__esModule = true;

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// some general logic, like attaching auth_token to every request
// and signing out after auth error
var createErrorHandler = function createErrorHandler(store, handleResponseError) {
  return function (error) {
    handleResponseError(error, store);

    return Promise.reject(error);
  };
};

exports.default = function (_ref) {
  var enhanceRequest = _ref.enhanceRequest,
      handleResponseError = _ref.handleResponseError;
  return function (api) {
    return function (requestParams) {
      return function (store) {
        var errorHandler = void 0;
        var newRequestParams = requestParams;

        if (enhanceRequest) {
          newRequestParams = (0, _merge3.default)({}, requestParams, enhanceRequest(store, requestParams));
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