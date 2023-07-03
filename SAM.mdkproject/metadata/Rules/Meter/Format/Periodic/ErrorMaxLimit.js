import {ValueIfExists} from '../Formatter';

export default function ErrorMaxLimit(context) {
    try {
        return ValueIfExists(String(context.binding.MeterReadingLimit_Nav.ErrorMaxLimit), '-');
    } catch (exc) {
        return '-';
    }
}
