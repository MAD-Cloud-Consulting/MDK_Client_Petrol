
import libVal from '../../../Common/Library/ValidationLibrary';

export default function CharacteristicFieldForCreate(context, field) {
    var binding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
    if (binding['@odata.type'].includes('Characteristic')) {
        binding = context.evaluateTargetPathForAPI('#Page:ClassificationDetailsPage').binding;
    }
    if (!libVal.evalIsEmpty(binding[field])) {
        return binding[field];
    } else {
        return '';
    }
}
