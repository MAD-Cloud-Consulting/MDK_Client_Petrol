import {ValueIfExists} from '../Common/Library/Formatter';
export default function EquipmentSerialNumber(context) {
    return ValueIfExists(context.binding.ManufSerialNo);
}
