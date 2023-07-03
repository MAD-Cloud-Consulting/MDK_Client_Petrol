import libCom from '../../Common/Library/CommonLibrary';

export default function SlocFromLabel(context) {
    let type = libCom.getStateVariable(context, 'IMMovementType');
    if (type === 'T') {
        return context.localizeText('from_sloc');
    }
    return context.localizeText('storage_location');
}
