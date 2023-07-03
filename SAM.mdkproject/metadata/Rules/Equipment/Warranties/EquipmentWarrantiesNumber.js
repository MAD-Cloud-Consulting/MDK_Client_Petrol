import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Get number of Equipment Master Warranty
 * @param {*} context SectionProxy object.
 * @returns {String} If empty return missing place holder else return the number.
 */
export default function EquipmentWarrantiesNumber(context) {
    if (!libVal.evalIsEmpty(context.binding.MasterWarrantyNum)) {
        return context.binding.MasterWarrantyNum;
    } else {
        return '-';
    }
}
