import {ValueIfExists} from '../../../Meter/Format/Formatter';

export default function DeviceLocationBasicInfo(context) {
    if (context.binding.DeviceLocations_Nav) {
        return ValueIfExists(context.binding.DeviceLocations_Nav[0].Description, '-');
    }
    return '-';
}
