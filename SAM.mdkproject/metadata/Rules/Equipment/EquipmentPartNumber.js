import {ValueIfExists} from '../Common/Library/Formatter';
export default function EquipmentPartNumber(context) {
    return ValueIfExists(context.binding.ManufPartNo);
}
