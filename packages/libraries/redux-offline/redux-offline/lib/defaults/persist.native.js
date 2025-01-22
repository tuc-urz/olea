"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reduxPersist = require("redux-persist");
var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));
// $FlowIgnore
// $FlowIgnore
var _default = exports.default = function _default(store, options, callback) {
  return (
    // $FlowFixMe
    (0, _reduxPersist.persistStore)(store, callback)
  );
};