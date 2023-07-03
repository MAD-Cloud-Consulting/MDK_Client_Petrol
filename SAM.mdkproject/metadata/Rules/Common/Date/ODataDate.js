import libCom from '../Library/CommonLibrary';
/**
 * Class for modeling a
 */
export default class ODataDate {

    /**
     * Create a Date wrapped for OData usage
     *
     * @param {*} date - Specify the date as YYYY-MM-DD string, Date, or timestamp. Default is current date
     * @param {*} time - Specifyt the time as HH-mm-ss string. Default does not adjust time
     * @param {*} offset - Timezone offset in hours. optional, non-numbers ignored
     */
    constructor(date, time, offset) {

        /**
         * Determine the date from first parameter (if found)
         */
        if (date === undefined || date === null) {
            // No date was passed. Use the current date
            this._date = new Date();
        } else if (date instanceof ODataDate) {
            return date;
        } else if (typeof(date) === 'string') {
            this._date = new Date();
            // Substring then run a math op for type conversion
            let year = date.substring(0, 4) * 1;
            // JS Dates are 0 based
            let month = date.substring(5, 7) - 1;
            let dayOfMonth = date.substring(8, 10) * 1;

            this._date.setFullYear(year, month, dayOfMonth);

            let timeIndex = date.indexOf('T');
            if (timeIndex > 0 && time === undefined) {
                // if time is not supplied and date string has a time component
                // set the time argument from date argument
                time = date.substring(timeIndex+1);
            }

        } else if (date instanceof Date) {
            this._date = date;
        } else if (typeof(date) === 'number') {
            this._date = new Date(date);
        } // Else this was initialized with a bad param Throw error?

        /**
         * Make an adjustment to date based on a passed time component (if found)
         */
        if (time !== undefined) {
            let hours = 0;
            let minutes = 0;
            let seconds = 0;
            if (typeof(time) === 'string') {
                hours = time.substring(0,2) * 1;
                minutes = time.substring(3,5) * 1;
                seconds = time.substring(6,8) * 1;
            } // Else log error ?
            this._date.setHours(hours, minutes, seconds, 0);
        }

        /**
         * Make an offset adjustment
         */
        if (offset !== undefined && typeof(offset) === 'number') {
            // offset may be fractional, so calculate and adjust minutes, negative if necessary
            let minutes = Math.abs((offset % 1) * 60);
            this._date.setHours(this._date.getHours() + offset, this._date.getMinutes() + minutes);
        }

    }

    date() {
        return this._date;
    }

    /**
     * Create a date with the backend offset removed.
     * Ignore timezone when using this date
     * @param {*} context
     */
    toDBDate(context) {
        let backendOffset = libCom.getBackendOffsetFromSystemProperty(context) * 60 * 60 * 1000;
        // Remove the offset between backend time and now
        return new Date(this._date.getTime() + backendOffset);
    }

    repeatingZeros(count) {
        return '0'.repeat(count);
    }

    toDBDateString(context, trailingZeros = 0) {
        let _date = this.toDBDate(context);
        let isoDate = _date.toISOString();
        let suffix = trailingZeros > 0 ? '.' + this.repeatingZeros(trailingZeros) : '';
        return isoDate.substring(0, 10) + 'T00:00:00' + suffix;
    }

    toDBTimeString(context, trailingZeros = 0) {
        let _date = this.toDBDate(context);
        let isoDate = _date.toISOString();
        let suffix = trailingZeros > 0 ? '.' + this.repeatingZeros(trailingZeros) : '';
        return isoDate.substring(11, 19) + suffix;
    }

    toDBDateTimeString(context, trailingZeros = 0) {
        let _date = this.toDBDate(context);
        let isoDate = _date.toISOString();
        let suffix = trailingZeros > 0 ? '.' + this.repeatingZeros(trailingZeros) : '';
        return isoDate.substring(0, 19) + suffix;
    }

    /**
     * Get the Date represented as a string ignoring all offsets
     * @param {*} trailingZeros
     */
    toLocalDateString(trailingZeros = 0) {
        let year = this._date.getFullYear();
        let month = this._date.getMonth() + 1;
        if (month < 10) month = `0${month}`;
        let day = this._date.getDate();
        if (day < 10) day = `0${day}`;
        let suffix = trailingZeros > 0 ? '.' + this.repeatingZeros(trailingZeros) : '';
        return `${year}-${month}-${day}T00:00:00${suffix}`;
    }

    /**
     * Get the time represented as a string ignoring all offsets
     * @param {*} trailingZeros
     */
    toLocalTimeString(trailingZeros = 0) {
        let hr = this._date.getHours();
        if (hr < 10) hr = `0${hr}`;

        let min = this._date.getMinutes();
        if (min < 10) min = `0${min}`;

        let suffix = trailingZeros > 0 ? '.' + this.repeatingZeros(trailingZeros) : '';
        return `${hr}:${min}:00${suffix}`;
    }

    /**
     * Retrieve a string that can be added to an OData query
     * @param {Context} context - Calling context
     * @param {String} property - date, time, or datetime
     * @param {Number} trailingZeros - (optional) some entities require '.{0 X trailingZeros}' as suffix.
     */
    queryString(context, property, trailingZeros = 0) {
        let value;
        let type;
        switch (property) {
            case 'date':
                value = this.toLocalDateString(context, trailingZeros);
                type = 'datetime';
                break;
            case 'datetime':
                value = this.toDBDateTimeString(context, trailingZeros);
                type = 'datetime';
                break;
            case 'time':
                value = this.toDBTimeString(context, trailingZeros);
                type = 'time';
                break;
            default:
                return null;
        }
        return `${type}'${value}'`;
    }

}
