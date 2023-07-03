import libCommon from '../../Common/Library/CommonLibrary';
export default function EnableOperationTransfer(context) {
    if (libCommon.getWorkOrderAssignmentType(context)!=='4' && libCommon.getWorkOrderAssignmentType(context)!=='A') {
        if (libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
