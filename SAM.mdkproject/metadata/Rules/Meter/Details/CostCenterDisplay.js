import {ValueIfExists} from '../Format/Formatter';

export default function CostCenterDisplay(context) {
    if (context.binding.Device_Nav) {
        return ValueIfExists(context.binding.Device_Nav.Equipment_Nav.CostCenter, '-');
    } else {
        return ValueIfExists(context.binding.Equipment_Nav.CostCenter, '-');
    }
}
