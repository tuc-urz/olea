import i18n from 'i18next';
import { initReactI18next } from "react-i18next";

import localeEN from './locales/en';
import localeDE from './locales/de';
import localeDEAccessibility from './locales/de-accessibility';
import localeENAccessibility from './locales/en-accessibility';
import {store} from "@openasist/core";

const resources = {
    en: {...localeEN, ...localeENAccessibility},
    de: {...localeDE, ...localeDEAccessibility}
};

const getLanguage = () => {
    return store.getState().settingReducer.settingsGeneral.language;
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        nsSeparator: ":",
        compatibilityJSON: 'v3', // Please remove if react native supports Intl.PluralRules
        resources,
        lng: getLanguage(),
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        react: {
            useSuspense: true
        }
    });

export default i18n;
