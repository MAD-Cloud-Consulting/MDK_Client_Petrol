import GenerateLocalID from '../../../Common/GenerateLocalID';
import { SubOperationControlLibrary as libSubOpControl } from '../../../SubOperations/SubOperationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';

export default function SubOperationLocalID(context) {

    if (context.binding.SubOperationNo) {
        return context.binding.SubOperationNo;
    }
    let readLink = '';
    if (context.binding['@odata.readLink'] !== undefined) {
        readLink = context.binding['@odata.readLink'];
    } else {
        readLink = libSubOpControl.getOperation(context);
    }
    return GenerateLocalID(context, readLink + '/SubOperations', 'SubOperationNo', '000', "$filter=startswith(SubOperationNo, 'L') eq true", 'L').then(
        (localID) => {
            //Save local sub-operation id into state variable.
            libCom.setStateVariable(context, 'localSubOperationId', localID);
            return localID;
        }
    );
}

