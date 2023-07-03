import {ValueIfExists} from './Formatter';

export default function ThresholdFormat(context) {
    return ValueIfExists(context.binding.ThresholdDesc, '-');
}
