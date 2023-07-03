import libVal from '../../Common/Library/ValidationLibrary';
import WarrantyDate from './EquipmentWarrantiesDate';

// Get the start date of the warranty
export default function EquipmentWarrantiesStartDate(context) {
    let warrantyStartData = context.binding.WarrantyDate;
    if (!libVal.evalIsEmpty(warrantyStartData)) {
        return WarrantyDate(context, warrantyStartData);
    }
    return '';
}
