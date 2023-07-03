import {ValueIfExists} from '../Formatter';

export default function ErrorMinLimit(context) {
    try {
        return ValueIfExists(String(context.binding.MeterReadingLimit_Nav.ErrorMinLimit), '-');
    } catch (exc) {
        return '-';
    }
}
