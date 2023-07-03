import libCom from '../../Common/Library/CommonLibrary';

export default function PlantFromLabel(context) {
    let type = libCom.getStateVariable(context, 'IMMovementType');
    if (type === 'T') {
        return context.localizeText('from_plant');
    }
    return context.localizeText('plant');
}
