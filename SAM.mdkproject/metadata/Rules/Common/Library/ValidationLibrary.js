import libThis from './ValidationLibrary';
export default class {
    /*
     * determines if a value is undefined, empty or null
     */
    static evalIsEmpty(val) {
        return (val === undefined || val == null || val.length <= 0 || val === 'undefined');
    }

    /**
    * Checks if the param is a number
    */
    static evalIsNumeric(val) {
        if (libThis.evalIsEmpty(val)) return false;
        return !isNaN(Number(val)) && isFinite(val);
    }
}
