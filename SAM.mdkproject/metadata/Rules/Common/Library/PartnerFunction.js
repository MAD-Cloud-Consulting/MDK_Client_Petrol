/**
 * Static class that has all of the getter and setter of the global variable
 */
export class PartnerFunction {

    static setSoldToPartyPartnerFunction(value) {
        this._soldToPartyPartnerFunction = value;
    }

    static getSoldToPartyPartnerFunction() {
        return this._soldToPartyPartnerFunction;
    }

    static setPersonnelPartnerFunction(value) {
        this._personnelPartnerFunction = value;
    }

    static getPersonnelPartnerFunction() {
        return this._personnelPartnerFunction;
    }
}
