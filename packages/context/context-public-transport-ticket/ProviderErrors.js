
/**
 * Diese Exception wird ausgelöst, wenn zu dem Nutzer kein ÖPNV-Ticket abgeholt werden kann.
 */
export class TicketNotFoundError extends Error {

    constructor() {
        super('User has no ticket');
        this.name = this.constructor.name;
    }
}