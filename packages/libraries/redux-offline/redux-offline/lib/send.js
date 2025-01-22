"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _actions = require("./actions");
var _constants = require("./constants");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var complete = function complete(action, result, offlineAction, config) {
  var _config$offlineAction = config.offlineActionTracker,
    resolveAction = _config$offlineAction.resolveAction,
    rejectAction = _config$offlineAction.rejectAction;
  if (result.success) {
    resolveAction(offlineAction.meta.transaction, result.payload);
  } else if (result.payload) {
    rejectAction(offlineAction.meta.transaction, result.payload);
  }
  return _objectSpread(_objectSpread({}, action), {}, {
    payload: result.payload,
    meta: _objectSpread(_objectSpread({}, action.meta), {}, {
      success: result.success,
      completed: true
    })
  });
};
var handleJsError = function handleJsError(error) {
  return {
    type: _constants.JS_ERROR,
    meta: {
      error: error,
      success: false,
      completed: true
    }
  };
};
var send = function send(action, dispatch, config) {
  var retries = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var metadata = action.meta.offline;
  dispatch((0, _actions.busy)(true));
  return config.effect(metadata.effect, action).then(function (result) {
    var commitAction = metadata.commit || _objectSpread(_objectSpread({}, config.defaultCommit), {}, {
      meta: _objectSpread(_objectSpread({}, config.defaultCommit.meta), {}, {
        offlineAction: action
      })
    });
    try {
      return dispatch(complete(commitAction, {
        success: true,
        payload: result
      }, action, config));
    } catch (error) {
      return dispatch(handleJsError(error));
    }
  }).catch(/*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee(error) {
      var rollbackAction, mustDiscard, delay, _t;
      return _regenerator.default.wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            rollbackAction = metadata.rollback || _objectSpread(_objectSpread({}, config.defaultRollback), {}, {
              meta: _objectSpread(_objectSpread({}, config.defaultRollback.meta), {}, {
                offlineAction: action
              })
            }); // discard
            mustDiscard = true;
            _context.prev = 1;
            _context.next = 2;
            return config.discard(error, action, retries);
          case 2:
            mustDiscard = _context.sent;
            _context.next = 4;
            break;
          case 3:
            _context.prev = 3;
            _t = _context["catch"](1);
            console.warn(_t);
          case 4:
            if (mustDiscard) {
              _context.next = 5;
              break;
            }
            delay = config.retry(action, retries);
            if (!(delay != null)) {
              _context.next = 5;
              break;
            }
            return _context.abrupt("return", dispatch((0, _actions.scheduleRetry)(delay)));
          case 5:
            return _context.abrupt("return", dispatch(complete(rollbackAction, {
              success: false,
              payload: error
            }, action, config)));
          case 6:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 3]]);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()).finally(function () {
    return dispatch((0, _actions.busy)(false));
  });
};
var _default = exports.default = send;