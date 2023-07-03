import {ValueIfExists} from '../Common/Library/Formatter';
export default function EquipmentRoom(context) {
    return ValueIfExists(context.binding.Room);
}
