export default {
    name: 'OpenASiST',
    logo: require('./../assets/images/logo.png'),
    header: require('./../assets/images/header.jpeg'),
    mealPlaceboImage: null,
    googleMapsUrl: 'https://www.google.com/maps/place/',
    defaultCity: 'Chemnitz',
    languages: [
        { code: 'de', extCode: 'deu', labelKey: 'settings:common.languages.de' },
        { code: 'en', extCode: 'eng', labelKey: 'settings:common.languages.en' }
    ],
    groupsOfPersons: [
        { code: 'student',  labelKey: 'canteen:priceTypeStudent',  default: true  },
        { code: 'employee', labelKey: 'canteen:priceTypeEmployee', default: false },
        { code: 'guest',    labelKey: 'canteen:priceTypeGuest',    default: false }
    ],
    mainMenu: {
        routes: [
            {key: 'services',   title: 'menu:titles.services'},
            {key: 'settings',   title: 'menu:titles.settings'},
            {key: 'about',      title: 'menu:titles.about'},
        ],
        items: {
            services: [
                {
                    title: 'menu:titles.aboutUs',
                    url: 'https://tuc.app/mitmachen.html',
                    icon: 'feedback',
                },
            ],
            settings: [
                {title: 'menu:titles.settingsGeneral',          icon: 'settings',           view: 'SettingsGeneral'},
                {title: 'menu:titles.settingsCanteens',         icon: 'mensa',              view: 'SettingsCanteens'},
                {title: 'menu:titles.settingsAccessibility',    icon: 'accessibility',      view: 'SettingsAccessibility'},
            ],
            about: [
                {title: 'menu:titles.imprint',          icon: 'imprint',        url: 'https://www.tu-chemnitz.de/tu/impressum.html?content'},
                {title: 'menu:titles.dataPolicy',       icon: 'lock',           url: 'https://www.tu-chemnitz.de/tu/datenschutz.html?content'},
                {title: 'menu:titles.accessibility',    icon: 'accessibility',  url: 'https://www.tu-chemnitz.de/tu/barrierefreiheit.html?content'},
                {title: 'menu:titles.version',          icon: 'imprint',        view: 'SettingsAppInfo'},
                {title: 'menu:titles.licenses',         icon: 'imprint',        url: 'https://github.com/tuc-urz/openasist/blob/dependency_licenses/docs/licenses.pdf'},
            ],
        }
    },
    deepLinking: {
        prefixes: [
        ],
        config: {
        }
    },
    api: {
        university: 'tuc',
        rootUrl: 'https://asist-app.de/asist/rest/',
        rootStgUrl: 'https://stage.asist-app.de/asist/rest/'
        /*
         * Stage: https://stage.asist-app.de/asist/rest/
         *  Live: https://asist.hrz.tu-chemnitz.de/asist/rest/
         */
    },
    modules: {
        event: {
            api: {
                provider: 'asist-server',
                baseUrl: 'https://asist.hrz.tu-chemnitz.de/asist/rest/app',
            },
        },
        timetable: {
            // Wenn kein API-Provider angegeben wird, wird standartmäßig die generelle API-Einstellung verwendet.
            // Beispiel: Stundenplan-Provider für ASiST-Server
            //api: {
            //    production: {
            //        provider: 'asist-server',
            //        url: 'https://asist-app.de/asist/rest/app/'
            //    }
            //},
            // Beispiel: Stundenplan-Provider für HS-Kollektor in Version 2
            //api: {
            //    production: {
            //        provider: 'hs-kollektor-v2',
            //        url: 'https://hsc-production.hrz.tu-chemnitz.de/hs_collector/api/v1/'
            //    }
            //},
            // Es kann ein produktiver Server (production) und eine Testserver (staging) angeben werden
            api: {
                production: {
                    provider: 'hs-kollektor-v2',
                    url: 'https://hsc-production.hrz.tu-chemnitz.de/hs_collector/api/v1/',
                },
                staging: {
                    provider: 'hs-kollektor-v2',
                    url: 'https://hsc-staging.hrz.tu-chemnitz.de/hs_collector/api/v1/',
                }
            },
            downloadEnabled: false,
            weeksToRender: 2,
            /*
             * Liste von Wochtagen die nicht im Stundenplan angezeigt werden sollen.
             * Die Tage werden im ISO-Wochtagformat angeben, dabei sind die Wochentage lokalisierungsunabhängig feste Intgerwerte:
             * * Montag    : 1
             * * Dienstag  : 2
             * * Mittwoch  : 3
             * * Donnerstag: 4
             * * Freitag   : 5
             * * Samstag   : 6
             * * Sonntag   : 7
             */
            disabledWeekdays: [6, 7],
            code: {
                length: 8,
                // Filter die auf die Nutzereingabe vom Nutzer angewendet werden sollen.
                filters: {
                    // Klein geschriebene Buchstaben in Großbuchstaben umwandeln.
                    toUpperCase: true,
                }
            },
            // Beim Starten der App werden die Stundenplandaten aktualisiet.
            // Hier kann eingestellte werden, welcher Zeitraum geladen wird.
            prefetch: {
                // Mit welchen Abstand vor "heute" sollen die Stundenplandaten geholt werden
                // Siehe Luxon minus: https://moment.github.io/luxon/api-docs/index.html#datetimeminus
                beginDistance: {
                    months: 1,
                },
                // Mit welchen Abstand nach "heute" sollen die Stundenplandaten geholt werden
                // Siehe Luxon plus: https://moment.github.io/luxon/api-docs/index.html#datetimeplus
                endDistance: {
                    month: 1,
                }
            },
            showDetails: true,
            // Hier können die Tag/Wochen/Monatstabs im Stundenplan aktiviert werden
            enableDayTab: true,
            enableWeekTab: true,
            enableMonthTab: false,
        },
        canteen: {
            api: {
                production: {
                    provider: 'hs-collector-v2',
                    url: 'https://hsc-production.hrz.tu-chemnitz.de/hs_collector/api/v1/',
                },
                staging: {
                    provider: 'hs-collector-v2',
                    url: 'https://hsc-staging.hrz.tu-chemnitz.de/hs_collector/api/v1/',
                }
            },
            disabledWeekdays: [6, 7],
        },
        search: {
            /**
             * Enable search categories by adding category name into array.
             * Avaiable search categories contacts, rooms, books. Category all is always avaiable.
             * Search tabs titel are located at search:tabs:name_of_category.
             */
            activeCategories: [
                'contacts',
                'rooms',
            ]
        },
        dashboard: {
            quicklinks: [
                {
                    title: 'quicklinks:titles:openasist',
                    icon: 'rocket',
                    url: 'https://tuc.app/mitmachen.html',
                },
                {
                    title: 'quicklinks:titles:library',
                    accessibilityTitle: 'accessibility:quicklinks.titles.library',
                    icon: 'book',
                    url: 'https://katalog.bibliothek.tu-chemnitz.de'
                },
                {
                    title: 'quicklinks:titles:opal',
                    icon: 'opal',
                    url: 'https://bildungsportal.sachsen.de/opal',
                },
            ]
        }
    },
    // This includes details for a subnavigation from any module which isn't inside the navigation context
    // see https://reactnavigation.org/docs/nesting-navigators/#navigating-to-a-screen-in-a-nested-navigator for more information
    navigation: {
        newsDetail: {
            screen: 'feedsTab',
            params: (additionalParams) => ({screen: 'NewsDetail', params: {news: additionalParams}, initial: false})
        }
    }
}
