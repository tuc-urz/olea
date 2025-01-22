"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleRetry = exports.networkStatusChanged = exports.completeRetry = exports.busy = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _constants = require("./constants");
var networkStatusChanged = exports.networkStatusChanged = function networkStatusChanged(params) {
  var payload;
  if ((0, _typeof2.default)(params) === 'object') {
    payload = params;
  } else {
    payload = {
      online: params
    };
  }
  return {
    type: _constants.OFFLINE_STATUS_CHANGED,
    payload: payload
  };
};
var scheduleRetry = exports.scheduleRetry = function scheduleRetry() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return {
    type: _constants.OFFLINE_SCHEDULE_RETRY,
    payload: {
      delay: delay
    }
  };
};
var completeRetry = exports.completeRetry = function completeRetry(action) {
  return {
    type: _constants.OFFLINE_COMPLETE_RETRY,
    payload: action
  };
};
var busy = exports.busy = function busy(isBusy) {
  return {
    type: _constants.OFFLINE_BUSY,
    payload: {
      busy: isBusy
    }
  };
};