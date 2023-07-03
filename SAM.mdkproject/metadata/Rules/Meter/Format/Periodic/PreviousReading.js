import {ValueIfExists} from '../Formatter';

export default function PreviousReading(context) {
    return ValueIfExists(Number(context.binding.PreviousReadingFloat), '-', function(value) {
        return context.formatNumber(value);
    });
}
