'use strict';

exports.__esModule = true;

require('isomorphic-fetch');

var _qs = require('qs');

var _lodash = require('lodash');

var handleResponse = function handleResponse(response) {
  return response.text().then(function (text) {
    if (response.ok) {
      return Promise.resolve(JSON.parse(text));
    }

    var error = void 0;
    try {
      error = JSON.parse(text).data.errors;
    } catch (e) {
      error = { message: text };
    }

    return Promise.reject(error);
  });
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

  (0, _lodash.each)(params, function (value, key) {
    var formValue = value;

    if ((0, _lodash.isPlainObject)(value) || (0, _lodash.isArray)(value)) {
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
      credentials = _ref.credentials;
  return function (_ref2) {
    var method = _ref2.method,
        path = _ref2.path,
        params = _ref2.params,
        _headers = _ref2.headers;

    var body = void 0;
    var url = '' + endpoint + path;
    var json = void 0;

    if (method === 'GET') {
      var query = (0, _qs.stringify)(params || {});
      if (query) url = url + '?' + query;
    } else {
      json = !(0, _lodash.some)(params, function (value) {
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