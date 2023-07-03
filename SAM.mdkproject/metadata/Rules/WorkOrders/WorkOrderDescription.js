import {ValueIfExists} from '../Common/Library/Formatter';

export default function WorkOrderDescription(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.OrderDescription);
}
