import HttpApiProvider, { JsonContentType } from '@olea-bps/base-api-provider';

const categories = {
    E: 'employee',
    G: 'guest',
    S: 'student',
}

/**
 * Provider that provides a REST interface to the ASiST server.
 * The getByCode method can be used to retrieve the lectures for a personal timetable code.
 * @extends HttpApiProvider
 */
export default class AsistServerApiProvider extends HttpApiProvider {

    /**
     * Short code of the university to be queried by the ASiST server.
     * @type {String}
     * @private
     */
    #university

    /**
     * @param {string} baseUrl - URL of the ASiST server that is extended for API requests.
     * @param {string} university - Short code of the university to be queried by the ASiST server.
     * @param {string[]} acceptingLanguages - List of languages that are queried by the ASiST server. The priority is based on the order of the languages in the array.
     */
    constructor(baseUrl, university, acceptingLanguages) {
        // ContentTypes wird auf JSON festgesetzt, da der ASiST-Server nur JSON spricht.
        super(baseUrl, acceptingLanguages, [JsonContentType]);

        this.#university = university;
    }

    /**
     * Returns the request URL to get all canteens from the asist server.
     * @returns {URL} URL that can be used to query canteens.
     */
    getAllUrl() {
        return this.extendBaseUrl(['v3', this.#university, 'canteens', 'all']);
    }

    /**
     * Requests the canteens from the ASiST server.
     * @returns {Object[]} List of canteens.
     */
    getCanteens() {
        const getAllUrl = this.getAllUrl();

        return this.get(getAllUrl)
            .then(response => response.json())
            .then(jsonResponse => jsonResponse?.canteens ?? [])
            .then(canteens => AsistServerApiProvider.convertCanteens(canteens));
    }

    getMenu(canteenId, date) {
        const getAllUrl = this.getAllUrl();

        return this.get(getAllUrl)
            .then(response => response.json())
            .then(jsonResponse => jsonResponse?.canteens ?? [])
            .then(canteens => canteens.find(canteen => canteen.id === canteenId))
            .then(canteen => canteen?.menuItems ?? [])
            .then(meals => meals.filter(meal => meal.date === date))
            .then(menu => AsistServerApiProvider.convertMenu(menu));
    }

    static convertCanteens(canteens) {
        return canteens.map(
            canteen =>
            ({
                id: canteen.id?.toString?.() ?? canteen.id,
                title: canteen.title,
                type: canteen.type,
            })
        );
    }

    static convertMenu(menu) {
        return menu.map(meal => this.convertMeal(meal));
    }

    static convertMeal(meal) {
        const prices = this.convertPrices(meal.prices);

        return {
            identifier: meal?.title,
            title: meal?.title,
            prices: prices,
            imageUrl: meal?.imgUrlBig,
            category: meal?.category,
            type: meal?.type,
            selections: meal?.selections ?? [],
            allergens: meal?.allergens ?? [],
            additives: meal?.additives ?? [],
        }
    }

    static convertPrices(prices) {
        return Object.fromEntries(
            prices?.map?.(
                price => {
                    const category = categories?.[price.title];
                    const amount = price.price;

                    return [category, amount];
                }
            ) ?? []
        )
    }

    /**
     * Static constructor that can be used to easily create a provider instance. English and German are set as request languages by default.
     * The main languages are used to set the priority.
     * If the main language is not German or English, this is also set as the request language.
     * @param {string} baseUrl - URL of the ASiST server that is extended for API requests.
     * @param {string} university - Short code of the university to be queried by the ASiST server.
     * @param {string} mainLanguage - Main language used to create the list of languages. The main language is prioritised highest.
     * @returns {AsistServerApiProvider} Provider instance
     */
    static from(baseUrl, university, mainLanguage = 'de') {
        const acceptingLanguages = AsistServerApiProvider.languagesFromMainLanguages(mainLanguage);

        return new AsistServerApiProvider(baseUrl, university, acceptingLanguages);
    }
}