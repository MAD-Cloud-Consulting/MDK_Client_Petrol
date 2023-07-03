import libCom from '../../Common/Library/CommonLibrary';
import GetVendorMaterial from '../IssueOrReceipt/GetVendorMaterial';

export default function ShowVendorMaterialNumber(context) {
    
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (!GetVendorMaterial(context)) {
        return false;
    }

    if (move === 'I') { //Issue
        return false;
    }
    if (objectType === 'ADHOC') {
        return false;
    }

    return true;
}
