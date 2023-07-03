import warrantyStartDate from './EquipmentWarrantiesStartDate';
import warrantyEndDate from './EquipmentWarrantiesEndDate';

// Get the Formatted date of the warranty using the helper and Start/End Date functions
/**
 * Get the Formatted Date of the Equipment Warranty Object
 * @param {*} context SectionProxy object.
 * @returns {String} Formatted Date String with Start and End Date.
 */
export default function EquipmentWarrantiesFormattedDate(context) {
    return warrantyStartDate(context).replace(/-/g,'/') + ' - ' + warrantyEndDate(context).replace(/-/g,'/');
}
