import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function WorkOrderOperationShortText(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.OperationShortText);
}
