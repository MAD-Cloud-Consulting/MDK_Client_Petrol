import {ValueIfExists} from '../Common/Library/Formatter';
export default function EquipmentModelNumber(context) {
    return ValueIfExists(context.binding.ModelNum);
}
