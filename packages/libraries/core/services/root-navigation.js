
import { createNavigationContainerRef } from '@react-navigation/native';

/**
 * Root Navigation Service for modules which are not inside the navigation context.
 *
 * Use with the navigation settings (see Settings.js) of each app.
 */


let _isNavigationReady = false;
const _navigationReadyCallbacks = [];
export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

export function isNavigationReady() {
    return _isNavigationReady;
}

export function onNavigationReady(callback) {
    if (_isNavigationReady) {
        callback();
    } else {
        _navigationReadyCallbacks.push(callback);
    }
}

export function triggerNavigationReady() {
    _isNavigationReady = true;
    _navigationReadyCallbacks.forEach(callback => callback());
}
