import {ValueIfExists} from '../Common/Library/Formatter';

export default function DocumentDescription(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.Document.Description);
}
