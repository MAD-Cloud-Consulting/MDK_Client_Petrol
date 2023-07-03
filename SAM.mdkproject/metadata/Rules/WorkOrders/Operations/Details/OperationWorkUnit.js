import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function OperationWorkUnit(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.WorkUnit);
}
