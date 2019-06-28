'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dedup = require('./dedup');

var _dedup2 = _interopRequireDefault(_dedup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('api/dedup', function () {
  var response = { message: 'hey there' };
  var createDelay = function createDelay(ms) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(response);
      }, ms);
    });
  };

  var params1 = { method: 'GET', path: '/v1/stuff', params: { foo: 'bar' } };
  var params2 = { method: 'GET', path: '/v1/stuff/:id', params: { foo: 'bar' } };
  var params3 = { method: 'POST', path: '/v1/stuff/:id', params: { foo: 'bar' } };

  var api = void 0;
  var run = void 0;

  beforeEach(function () {
    api = jest.fn(function () {
      return createDelay(10);
    });
    run = (0, _dedup2.default)(api);
  });

  it('caches inflight response, run callbacks properly', function () {
    var callback1 = jest.fn(function () {
      throw new Error('callback1 error (it\'s ok)');
    });
    var callback2 = jest.fn(function () {});

    var promise1 = run(_extends({}, params1));
    var promise2 = run(_extends({}, params1));

    expect(Object.keys(run.inflight).length).toEqual(1);
    expect(api.mock.calls.length).toEqual(1);
    expect(promise1).toBe(promise2);

    promise1.then(callback1);

    return promise2.then(callback2).catch(function () {
      return Promise.resolve({});
    }).then(function () {
      expect(Object.keys(run.inflight).length).toEqual(0);

      expect(callback1.mock.calls[0][0]).toEqual(response);
      expect(callback2.mock.calls[0][0]).toEqual(response);

      var promise3 = run(_extends({}, params1));

      expect(api.mock.calls.length).toEqual(2);
      expect(promise3).not.toBe(promise1);
    });
  });

  it('don\'t mess different requests', function () {
    var promise1 = run(_extends({}, params1));
    var promise2 = run(_extends({}, params2));

    expect(Object.keys(run.inflight).length).toEqual(2);

    expect(api.mock.calls.length).toEqual(2);
    expect(promise1).not.toBe(promise2);
  });

  it('don\'t mess with POST requests', function () {
    var promise1 = run(params3);
    var promise2 = run(params3);

    expect(Object.keys(run.inflight).length).toEqual(0);

    expect(api.mock.calls.length).toEqual(2);
    expect(promise1).not.toBe(promise2);
  });
});