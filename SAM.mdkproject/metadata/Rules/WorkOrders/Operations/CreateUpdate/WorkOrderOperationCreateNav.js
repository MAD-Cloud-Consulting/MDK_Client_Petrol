import libCommon from '../../../Common/Library/CommonLibrary';
import libWOStatus from '../../MobileStatus/WorkOrderMobileStatusLibrary';
import IsOperationCreateFromOperationsList from '../IsOperationCreateFromOperationsList';
import lamCopy from './WorkOrderOperationCreateLAMCopy';

export default function WorkOrderOperationCreateNav(clientAPI) {

    libCommon.setStateVariable(clientAPI, 'FromOperationsList', true);
    if (IsOperationCreateFromOperationsList(clientAPI)) {
        return executeWorkOrderOperationChainSet(clientAPI);
    } else {
        return libWOStatus.isOrderComplete(clientAPI).then(status => {
            if (!status) {
                return executeWorkOrderOperationChainSet(clientAPI);
            } else {
                return Promise.resolve();
            }
        });
    }
}

export function executeWorkOrderOperationChainSet(clientAPI) {
    libCommon.setOnCreateUpdateFlag(clientAPI, 'CREATE');
    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(clientAPI, true);
    libCommon.resetChangeSetActionCounter(clientAPI);
    //set the WoChangeSet flag to false
    libCommon.setOnWOChangesetFlag(clientAPI, false);
    libCommon.setStateVariable(clientAPI, 'LocalId', ''); //Reset before starting create
    libCommon.setStateVariable(clientAPI, 'lastLocalOperationId', '');
    libCommon.setStateVariable(clientAPI, 'ObjectCreatedName', 'Operation');
    return clientAPI.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateChangeset.action').then(() => {
        return lamCopy(clientAPI);
    });
}

