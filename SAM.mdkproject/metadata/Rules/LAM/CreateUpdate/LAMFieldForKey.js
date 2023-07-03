
import libVal from '../../Common/Library/ValidationLibrary';

export default function LAMFieldForKey(context, key) {
    
    let binding = context.getActionBinding();

    if (!libVal.evalIsEmpty(binding[key])) {
        return binding[key];
    } else {
        return '';
    }

}
