
/**
 * Diese Exception wird ausgelöst, wenn zu dem Studenplancode kein Stundenplan abgeholt werden kann.
 */
export class TimetableNotFoundError extends Error {

    /**
     * Stundenplancode welcher keinem Stundenplan angehörig ist.
     * @type {string}
     */
    timetableCode

    /**
     *
     * @param {string} timetableCode Stundenplancode, welcher zu einem Fehler führte, weil dieser mit keinem Stundenplan verknüpft ist
     */
    constructor(timetableCode) {
        super(`Timetable code ${timetableCode} is not linked to a timetable`);
        this.timetableCode = timetableCode;
        this.name = this.constructor.name;
    }
}