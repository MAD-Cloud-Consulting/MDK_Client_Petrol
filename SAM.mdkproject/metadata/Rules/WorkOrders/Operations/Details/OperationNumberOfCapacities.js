import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function OperationNumberOfCapacities(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.NumberOfCapacities);
}
