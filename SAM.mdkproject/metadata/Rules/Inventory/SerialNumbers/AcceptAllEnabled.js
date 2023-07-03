import libCom from '../../Common/Library/CommonLibrary';

export default function AcceptAllEnabled(context) {
    const type = libCom.getStateVariable(context, 'IMMovementType');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (type === 'R' && (objectType === 'PO' || objectType === 'STO')) {
        return true;
    }

    if (objectType === 'IB' || objectType === 'OB') {
        return true;
    }

    return false;
}
