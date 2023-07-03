import {ValueIfExists} from '../Common/Library/Formatter';
export default function EquipmentManufacturer(context) {
    return ValueIfExists(context.binding.Manufacturer);
}
