import {ValueIfExists} from '../Common/Library/Formatter';
export default function EquipmentInventoryNumber(context) {
    return ValueIfExists(context.binding.InventoryNum);
}
