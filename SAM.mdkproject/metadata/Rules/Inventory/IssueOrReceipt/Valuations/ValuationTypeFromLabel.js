import libCom from '../../../Common/Library/CommonLibrary';

export default function ValuationTypeFromLabel(context) {
    let type = libCom.getStateVariable(context, 'IMMovementType');
    if (type === 'T') {
        return context.localizeText('from_valuation_type');
    }
    return context.localizeText('valuation_type');
}
