export default class {
    /**
     * 
     * @param {*} date
     */

    static isDateToday(date) {
        return (new Date()).toDateString() === date.toDateString();
    }
}
