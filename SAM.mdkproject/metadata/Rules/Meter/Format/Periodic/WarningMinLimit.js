import {ValueIfExists} from '../Formatter';

export default function WarningMinLimit(context) {
    try {
        return ValueIfExists(String(context.binding.MeterReadingLimit_Nav.WarningMinLimit), '-');
    } catch (exc) {
        return '-';
    }
}
