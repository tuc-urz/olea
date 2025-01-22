"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkError = NetworkError;
exports.getHeaders = exports.getFormData = exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _excluded = ["Content-Type", "content-type"],
    _excluded2 = ["url", "json"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function NetworkError(response, status) {
  this.name = 'NetworkError';
  this.status = status;
  this.response = response;
} // $FlowFixMe


NetworkError.prototype = Error.prototype;

var tryParseJSON = function tryParseJSON(json) {
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error("Failed to parse unexpected JSON response: ".concat(json));
  }
};

var getResponseBody = function getResponseBody(res) {
  var contentType = res.headers.get('content-type') || false;

  if (contentType && contentType.indexOf('json') >= 0) {
    return res.text().then(tryParseJSON);
  }

  return res.text();
};

var getHeaders = function getHeaders(headers) {
  var _ref = headers || {},
      contentTypeCapitalized = _ref['Content-Type'],
      contentTypeLowerCase = _ref['content-type'],
      restOfHeaders = (0, _objectWithoutProperties2.default)(_ref, _excluded);

  var contentType = contentTypeCapitalized || contentTypeLowerCase || 'application/json';
  return _objectSpread(_objectSpread({}, restOfHeaders), {}, {
    'content-type': contentType
  });
};

exports.getHeaders = getHeaders;

var getFormData = function getFormData(object) {
  var formData = new FormData();
  Object.keys(object).forEach(function (key) {
    Object.keys(object[key]).forEach(function (innerObj) {
      var newObj = object[key][innerObj];
      formData.append(newObj[0], newObj[1]);
    });
  });
  return formData;
}; // eslint-disable-next-line no-unused-vars


exports.getFormData = getFormData;

var _default = function _default(effect, _action) {
  var url = effect.url,
      json = effect.json,
      options = (0, _objectWithoutProperties2.default)(effect, _excluded2);
  var headers = getHeaders(options.headers);

  if (!(options.body instanceof FormData) && Object.prototype.hasOwnProperty.call(headers, 'content-type') && headers['content-type'].toLowerCase().includes('multipart/form-data')) {
    options.body = getFormData(options.body);
  }

  if (json !== null && json !== undefined) {
    try {
      options.body = JSON.stringify(json);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return fetch(url, _objectSpread(_objectSpread({}, options), {}, {
    headers: headers
  })).then(function (res) {
    if (res.ok) {
      return getResponseBody(res);
    }

    return getResponseBody(res).then(function (body) {
      throw new NetworkError(body || '', res.status);
    });
  });
};

exports.default = _default;