"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports.enhanceReducer = exports.buildOfflineUpdater = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("./constants");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } /* global $Shape */
var initialState = exports.initialState = {
  busy: false,
  lastTransaction: 0,
  online: false,
  outbox: [],
  retryCount: 0,
  retryScheduled: false,
  netInfo: {
    isConnectionExpensive: null,
    reach: 'NONE'
  }
};
var buildOfflineUpdater = exports.buildOfflineUpdater = function buildOfflineUpdater(dequeue, enqueue) {
  return function offlineUpdater() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    // Update online/offline status
    if (action.type === _constants.OFFLINE_STATUS_CHANGED && !action.meta) {
      return _objectSpread(_objectSpread({}, state), {}, {
        online: action.payload.online,
        netInfo: action.payload.netInfo
      });
    }
    if (action.type === _constants.PERSIST_REHYDRATE && action.payload) {
      return _objectSpread(_objectSpread(_objectSpread({}, state), action.payload.offline || {}), {}, {
        online: state.online,
        netInfo: state.netInfo,
        retryScheduled: initialState.retryScheduled,
        retryCount: initialState.retryCount,
        busy: initialState.busy
      });
    }
    if (action.type === _constants.OFFLINE_SCHEDULE_RETRY) {
      return _objectSpread(_objectSpread({}, state), {}, {
        retryScheduled: true,
        retryCount: state.retryCount + 1
      });
    }
    if (action.type === _constants.OFFLINE_COMPLETE_RETRY) {
      return _objectSpread(_objectSpread({}, state), {}, {
        retryScheduled: false
      });
    }
    if (action.type === _constants.OFFLINE_BUSY && !action.meta && action.payload && typeof action.payload.busy === 'boolean') {
      return _objectSpread(_objectSpread({}, state), {}, {
        busy: action.payload.busy
      });
    }

    // Add offline actions to queue
    if (action.meta && action.meta.offline) {
      var transaction = state.lastTransaction + 1;
      var stamped = _objectSpread(_objectSpread({}, action), {}, {
        meta: _objectSpread(_objectSpread({}, action.meta), {}, {
          transaction: transaction
        })
      });
      var offline = state;
      return _objectSpread(_objectSpread({}, state), {}, {
        lastTransaction: transaction,
        outbox: enqueue(offline.outbox, stamped, {
          offline: offline
        })
      });
    }

    // Remove completed actions from queue (success or fail)
    if (action.meta && action.meta.completed === true) {
      var _offline = state;
      return _objectSpread(_objectSpread({}, state), {}, {
        outbox: dequeue(_offline.outbox, action, {
          offline: _offline
        }),
        retryCount: 0
      });
    }
    if (action.type === _constants.RESET_STATE) {
      return _objectSpread(_objectSpread({}, initialState), {}, {
        online: state.online,
        netInfo: state.netInfo
      });
    }
    return state;
  };
};
var enhanceReducer = exports.enhanceReducer = function enhanceReducer(reducer, config) {
  var _config$queue = config.queue,
    dequeue = _config$queue.dequeue,
    enqueue = _config$queue.enqueue;
  var offlineUpdater = buildOfflineUpdater(dequeue, enqueue);
  return function (state, action) {
    var offlineState;
    var restState;
    if (typeof state !== 'undefined') {
      offlineState = config.offlineStateLens(state).get;
      restState = config.offlineStateLens(state).set();
    }
    return config.offlineStateLens(reducer(restState, action)).set(offlineUpdater(offlineState, action));
  };
};