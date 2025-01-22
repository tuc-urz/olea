/**
 * Return date part of date(time) as iso format.
 * 
 * @param {Date} date 
 * @returns {string} Date in ISO format.
 */
 export function toIsoDateString(date) {
    return date.toISOString().slice(0, 10);
 }