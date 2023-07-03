import {ValueIfExists} from '../Common/Library/Formatter';
export default function EquipmentWorkCenter(context) {
    return ValueIfExists(context.binding.WorkCenter_Main_Nav, '-', function(value) {
        return value.WorkCenterDescr;
    });
}
