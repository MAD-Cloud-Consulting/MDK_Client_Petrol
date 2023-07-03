import {ValueIfExists} from './Formatter';

export default function ValueFormat(context) {
    return ValueIfExists(context.binding.AggregatedValue, '-', function(value) {
        return context.formatNumber(value) + ' ' + context.binding.UoMDescription;
    });
}
