import {ValueIfExists} from './Formatter';

export default function TimeFormat(context) {
    return ValueIfExists(context.binding.UpdateTimeStamp, '-', function(value) {
        return context.formatTime(value);
    });
}
