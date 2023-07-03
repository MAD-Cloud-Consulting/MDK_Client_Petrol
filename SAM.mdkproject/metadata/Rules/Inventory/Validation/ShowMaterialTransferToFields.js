import libCom from '../../Common/Library/CommonLibrary';

export default function ShowMaterialTransferToFields(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
     
    if (type === 'TRF' || (type === 'ADHOC' && move === 'T')) {
        return true;
    }

    return false;
}
