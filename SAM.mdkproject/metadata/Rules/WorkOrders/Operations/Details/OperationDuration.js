import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function OperationDuration(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.Duration);
}
