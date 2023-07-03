import oDataDate from '../../Common/Date/ODataDate';
/**
 * Convert backend date into readable format
 * @param {*} context SectionProxy object.
 * @param {String} date Date String
 * @returns {String} Formatted Date String
 */
export default function EquipmentWarrantiesDate(context, date) {
    let odataDate = new oDataDate(date);
    return context.formatDate(odataDate.date());
}
