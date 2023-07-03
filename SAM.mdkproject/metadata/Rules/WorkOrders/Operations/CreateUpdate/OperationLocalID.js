import GenerateLocalID from '../../../Common/GenerateLocalID';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function OperationLocalID(context) {
    let onWoChangeset = libCommon.isOnWOChangeset(context);
    var entitySet = '';
    var localId = '';

    if (onWoChangeset) {
        localId = 'L001';
        libCommon.setStateVariable(context, 'lastLocalOperationId', localId);
        return localId;
    }

    if (context.binding.OperationNo) {
        return context.binding.OperationNo;
    }

    if (!libCommon.isDefined(context.binding['@odata.readLink'])) {
        entitySet = 'MyWorkOrderOperations';
    } else {
        entitySet = context.binding['@odata.readLink'] + '/Operations';
    }

    localId = GenerateLocalID(context, entitySet, 'OperationNo', '000', "$filter=startswith(OperationNo, 'L') eq true", 'L');
    return localId;
}
