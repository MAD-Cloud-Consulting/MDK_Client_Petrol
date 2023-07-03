import libVal from '../../Common/Library/ValidationLibrary';
import WarrantyDate from './EquipmentWarrantiesDate';

/**
 * Get the End Date of the Equipment Warranty Object
 * @param {*} context SectionProxy object.
 * @returns {String} Formatted Date String or 'No End Date' text
 */
export default function EquipmentWarrantiesEndDate(context) {
    let warrantyEndData = context.binding.WarrantyEnd;
    if (!libVal.evalIsEmpty(warrantyEndData)) {
        return WarrantyDate(context, warrantyEndData);
    } else {
        return context.localizeText('no_end_date');
    } 
}
