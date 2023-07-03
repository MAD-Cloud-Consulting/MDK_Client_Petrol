import {ValueIfExists} from '../Common/Library/Formatter';

export default function ClassDescription(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.ClassDefinition.ClassDesc);
}
