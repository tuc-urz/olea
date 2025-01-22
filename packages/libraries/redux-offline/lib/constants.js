"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESET_STATE = exports.PERSIST_REHYDRATE = exports.OFFLINE_STATUS_CHANGED = exports.OFFLINE_SEND = exports.OFFLINE_SCHEDULE_RETRY = exports.OFFLINE_COMPLETE_RETRY = exports.OFFLINE_BUSY = exports.JS_ERROR = exports.DEFAULT_ROLLBACK = exports.DEFAULT_COMMIT = void 0;
// Literal ACTION typing allows to ensure a stricter type than string
var OFFLINE_STATUS_CHANGED = exports.OFFLINE_STATUS_CHANGED = 'Offline/STATUS_CHANGED';
var OFFLINE_SCHEDULE_RETRY = exports.OFFLINE_SCHEDULE_RETRY = 'Offline/SCHEDULE_RETRY';
var OFFLINE_COMPLETE_RETRY = exports.OFFLINE_COMPLETE_RETRY = 'Offline/COMPLETE_RETRY';
var OFFLINE_SEND = exports.OFFLINE_SEND = 'Offline/SEND';
var OFFLINE_BUSY = exports.OFFLINE_BUSY = 'Offline/BUSY';
var RESET_STATE = exports.RESET_STATE = 'Offline/RESET_STATE';
var PERSIST_REHYDRATE = exports.PERSIST_REHYDRATE = 'persist/REHYDRATE';
var JS_ERROR = exports.JS_ERROR = 'Offline/JS_ERROR';
var DEFAULT_COMMIT = exports.DEFAULT_COMMIT = 'Offline/DEFAULT_COMMIT';
var DEFAULT_ROLLBACK = exports.DEFAULT_ROLLBACK = 'Offline/DEFAULT_ROLLBACK';