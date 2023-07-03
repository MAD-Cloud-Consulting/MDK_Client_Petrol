import {ValueIfExists} from '../Formatter';

export default function PreviousReadingStatus(context) {
    return ValueIfExists(context.binding.PreviousReadingStatus, '-');
}
