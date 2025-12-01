import { useSyncExternalStore } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TucUnseenApiProvider from './TucUnseenApiProvider';

//class SubscribeableValue {
//    #value;
//
//    #subscribers = new Set();
//
//    get value() {
//        return this.#value
//    }
//
//    set value(value) {
//        this.#value = value;
//
//        this.#subscribers.forEach(subscriber => subscriber(this.#value));
//    }
//
//    constructor(value) {
//        this.#value = value;
//    }
//
//    subscribe(subscriber) {
//        return () => this.unsubscribe(subscriber);
//    }
//
//    unsubscribe(subscriber) {
//        return this.#subscribers.delete(subscriber);
//    }
//}

/**
 * @typedef ProviderSetting
 * @property {string} provider Name des Providers
 * @property {string} [url] Basis-URL des Provider für Web-Requests
 */

const UnreadEmailCountStoreKey = 'mails.unreadEmailCount';

export default class MailService {
    #provider;
    #unreadEmailCount = undefined;
    #unreadEmailCountSubscribers = new Set();

    /**
     *
     * @param {*} provider Provider, der die Komunikation mit den Backend übernimmt
     */
    constructor(provider) {
        this.#provider = provider;

        AsyncStorage.getItem(UnreadEmailCountStoreKey)
            .then(
                unreadEmailCount => {
                    if (this.#unreadEmailCount === undefined) {
                        this.#unreadEmailCount = unreadEmailCount;
                        this.#unreadEmailCountSubscribers.forEach(subscriber => subscriber());
                    }
                }
            );

        this.refreshUnreadEmailCount();
    }

    refreshUnreadEmailCount() {
        return this.#provider
            .getUnreadEmailCount()
            .then(
                unreadEmailCount => {
                    AsyncStorage.setItem(UnreadEmailCountStoreKey, unreadEmailCount);
                    this.#unreadEmailCount = unreadEmailCount;
                    this.#unreadEmailCountSubscribers.forEach(subscriber => subscriber(unreadEmailCount));
                }
            );
    }

    refreshUnreadEmailCountCallback = () => this.refreshUnreadEmailCount();

    unreadEmailCountSubscribe(subscriber) {
        this.#unreadEmailCountSubscribers.add(subscriber);

        return () => this.unreadEmailCountUnsubscribe(subscriber);
    }

    unreadEmailCountSubscribeCallback = subscriber => this.unreadEmailCountSubscribe(subscriber);

    unreadEmailCountUnsubscribe(subscriber) {
        return this.#unreadEmailCountSubscribers.delete(subscriber);
    }

    unreadEmailCount() {
        return this.#unreadEmailCount;
    }

    unreadEmailCountCallback = () => this.unreadEmailCount();

    /**
     *
     * @param {ProviderSetting} providerSettingsObject
     * @param {string} language
     * @param {string} accessToken
     * @returns
     */
    static fromProviderSettingsObject(providerSettingsObject, language, accessToken) {
        const provider = MailService.#createProvider(providerSettingsObject, language, accessToken);

        return new MailService(provider);
    }

    /**
     * @param {ProviderSetting} providerSettingsObject
     */
    static #createProvider(providerSettingsObject, language, accessToken) {
        const { provider } = providerSettingsObject;

        switch (provider) {
            case TucUnseenApiProvider.name:
                return TucUnseenApiProvider.fromSettingsObject(providerSettingsObject, language, accessToken);
            default:
                return null;
        }
    }
}

function nullUnreadEmailCountSubscribeCallback(subscriber) {
    return () => { };
}

function nullUnreadEmailCountCallback() {
    return undefined;
}

/**
 *
 * @param {MailService} mailService
 */
export function useUnreadEmailCount(mailService) {
    const unreadEmailCount = useSyncExternalStore(
        mailService?.unreadEmailCountSubscribeCallback ?? nullUnreadEmailCountSubscribeCallback,
        mailService?.unreadEmailCountCallback ?? nullUnreadEmailCountCallback,
    );

    return [unreadEmailCount, mailService?.refreshUnreadEmailCountCallback];
}