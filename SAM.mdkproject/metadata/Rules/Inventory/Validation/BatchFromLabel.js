import libCom from '../../Common/Library/CommonLibrary';

export default function BatchFromLabel(context) {
    let type = libCom.getStateVariable(context, 'IMMovementType');
    if (type === 'T') {
        return context.localizeText('from_batch');
    }
    return context.localizeText('batch');
}
