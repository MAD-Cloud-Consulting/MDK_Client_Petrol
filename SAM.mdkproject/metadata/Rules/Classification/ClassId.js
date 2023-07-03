import {ValueIfExists} from '../Common/Library/Formatter';

export default function ClassId(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.ClassId);
}
