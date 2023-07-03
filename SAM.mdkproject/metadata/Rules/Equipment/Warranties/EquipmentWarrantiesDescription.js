import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Get Description of Equipment Master Warranty
 * @param {*} context SectionProxy object.
 * @returns {String} If empty return missing place holder else return description.
 */
export default function EquipmentWarrantiesDescription(context) {
    if (!libVal.evalIsEmpty(context.binding.WarrantyDesc)) {
        return context.binding.WarrantyDesc;
    } else {
        return '-';
    }
}
