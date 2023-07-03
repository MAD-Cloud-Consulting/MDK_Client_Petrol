import {ValueIfExists} from './Formatter';

export default function DateFormat(context) {
    return ValueIfExists(context.binding.UpdateTimeStamp, '-', function(value) {
        return context.formatDate(value);
    });
}
