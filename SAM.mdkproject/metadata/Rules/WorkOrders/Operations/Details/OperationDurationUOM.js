import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function OperationDurationUOM(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.DurationUOM);
}
