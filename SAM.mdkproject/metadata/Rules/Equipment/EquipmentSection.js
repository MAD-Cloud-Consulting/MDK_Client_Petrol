import {ValueIfExists} from '../Common/Library/Formatter';
export default function EquipmentSection(context) {
    return ValueIfExists(context.binding.PlantSection);
}
