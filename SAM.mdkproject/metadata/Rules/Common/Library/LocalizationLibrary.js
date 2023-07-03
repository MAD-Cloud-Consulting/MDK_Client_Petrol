import libVal from './ValidationLibrary';
export default class {

    /**
     * Returns the decimal separator for the passed in locale, or
     * the default for the device.
     * @param {String} locale - locale in the format 'xx-YY' where xx is the language code
     * and YY is the region such as 'en-US' or 'de-DE'
     * @returns {String} - the single character decimal separator
     */
    static getDecimalSeparator(context, locale='') {
        if (locale === '') {
            locale = context.getLanguage() + '-' + context.getRegion();
        }
    
        return (context.formatNumber(Number(1.1),locale)).substr(1,1);

    }

    /**
     * Tests whether the passed in string is a valid number for the
     * default locale
     * @param {ClientAPI} context 
     * @param {String} numString - Number in string format 
     * @param {String} seperator - character to be used as decimal separator
     * @returns {Boolean} 
     */
    static isNumber(context, numString, locale='') {

        if (libVal.evalIsEmpty(numString)) return false;

        let seperator = this.getDecimalSeparator(context, locale);

        let euroReg = /^[+-]?(?:\d{1,3}(?:\.\d{3})*|\d+)?(?:,\d+)?$/;
        let usReg = /^[+-]?(?:\d{1,3}(?:,\d{3})*|\d+)?(?:\.\d+)?$/;
        let expReg = /^[+-]?\d?(?:\.\d+)?[Ee][-+]?\d+$/;

        if (typeof numString === 'string') {
            numString = numString.trim();
        }
        if (seperator === '.') {
            return (usReg.test(numString) || expReg.test(numString));
        } else if (seperator === ',') {
            return (euroReg.test(numString) || expReg.test(numString));
        }

        return false;
    }
    /**
    * Converts the passed in string to a valid number for the
    * specified or default locale
    * @param {ClientAPI} context 
    * @param {String} numString - Number in string format 
    * @param {String} seperator - character to be used as decimal separator
    * @returns {Number} - String converted to a Number
    */
    static toNumber(context, numString, locale='', allowNaN=true) {
        let seperator = this.getDecimalSeparator(context, locale);

        if (this.isNumber(context, numString, locale)) {
            if (typeof numString === 'string') {
                numString = numString.trim();
                let temp = '';
                if (seperator === '.') {
                    temp = numString.replace(/,/g, '');
                } else if (seperator === ',') {
                    temp = numString.replace(/\./g, '');
                    temp = temp.replace(',', '.');
                } else {
                    return allowNaN === true ? Number(NaN) : '';
                }
                return Number(temp);
            } else if (typeof numString === 'number') {
                return numString;
            }
        }
        return allowNaN === true ? Number(NaN) : '';
    }

}
