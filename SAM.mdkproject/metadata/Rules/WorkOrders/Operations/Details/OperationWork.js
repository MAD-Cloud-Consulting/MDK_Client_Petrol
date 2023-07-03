import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function OperationWork(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.Work);
}
