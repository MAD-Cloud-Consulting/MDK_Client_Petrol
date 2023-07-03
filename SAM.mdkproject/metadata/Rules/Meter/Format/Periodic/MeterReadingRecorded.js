import {ValueIfExists} from '../Formatter';

export default function MeterReadingRecorded(context) {
    return ValueIfExists(context.binding.MeterReadingRecorded, '-', function(value) {
        return context.formatNumber(value);
    });
}
