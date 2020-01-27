'use strict';

exports.__esModule = true;

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

require('isomorphic-fetch');

var _qs = require('qs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultHandleErrorReponse = function defaultHandleErrorReponse(v) {
  return v;
};

var createHandleResponse = function createHandleResponse(extractErrorResponse) {
  return function (response) {
    return response.text().then(function (text) {
      if (response.ok) {
        return Promise.resolve(JSON.parse(text));
      }

      var error = void 0;
      try {
        error = JSON.parse(text);
        error = extractErrorResponse(error);
      } catch (e) {
        error = { message: text };
      }

      return Promise.reject(error);
    });
  };
};

var handleNetworkError = function handleNetworkError(_error) {
  var message = _error && _error.message;

  if (!message || message === 'Failed to fetch') {
    message = 'Error loading data';
  }

  var error = _error || new Error();
  error.message = message;

  return Promise.reject(error);
};

var formBody = function formBody(params) {
  var body = new FormData();

  (0, _each3.default)(params, function (value, key) {
    var formValue = value;

    if ((0, _isPlainObject3.default)(value) || (0, _isArray3.default)(value)) {
      formValue = JSON.stringify(value);
    }

    body.append(key, formValue);
  });

  return body;
};

var jsonBody = function jsonBody(params) {
  return JSON.stringify(params);
};

exports.default = function (_ref) {
  var endpoint = _ref.endpoint,
      credentials = _ref.credentials,
      extractErrorResponse = _ref.extractErrorResponse,
      paramsStringificationOptions = _ref.paramsStringificationOptions;

  var handleResponse = createHandleResponse(extractErrorResponse || defaultHandleErrorReponse);

  return function (_ref2) {
    var method = _ref2.method,
        path = _ref2.path,
        params = _ref2.params,
        _headers = _ref2.headers;

    var body = void 0;
    var url = '' + endpoint + path;
    var json = void 0;

    if (method === 'GET') {
      var query = (0, _qs.stringify)(params || {}, paramsStringificationOptions);
      if (query) url = url + '?' + query;
    } else {
      json = !(0, _some3.default)(params, function (value) {
        return value instanceof File;
      });

      body = json ? jsonBody(params) : formBody(params);
    }

    var headers = _headers || {};
    if (json) {
      headers['Content-Type'] = 'application/json';
    }

    return fetch(url, {
      method: method,
      body: body,
      headers: headers,
      credentials: credentials
    }).then(handleResponse, handleNetworkError);
  };
};