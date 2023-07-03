import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderCreateUpdateIsCancelButtonVisible(clientAPI) {
    if (libCommon.isOnWOChangeset(clientAPI)) {
        return false;
    } else {
        return true;
    }
}
