import {ValueIfExists} from '../Formatter';

export default function WarningMaxLimit(context) {
    try {
        return ValueIfExists(String(context.binding.MeterReadingLimit_Nav.WarningMaxLimit), '-');
    } catch (exc) {
        return '-';
    }
}
