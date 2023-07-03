import libCom from '../../Common/Library/CommonLibrary';
import getBatch from '../IssueOrReceipt/GetBatch';

export default function IsBatchEditable(context) {
    let editable = true;
    let binding = context.binding;
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if ((movementType === 'R' || movementType === 'I') && (objectType === 'IB' || objectType === 'OB')) {
        editable = false;
    }
    if (binding) {
        let isLocal = libCom.isCurrentReadLinkLocal(binding['@odata.readLink']);
        if (!isLocal) {
            let batch = getBatch(context);
            if (batch !== '') {
                editable = false;
            }
        }
    }

    return editable;
}
