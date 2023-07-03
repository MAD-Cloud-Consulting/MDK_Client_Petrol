import libCommon from '../../Common/Library/CommonLibrary';

export default function SubOperationCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    libCommon.setOnChangesetFlag(clientAPI, true);
    libCommon.resetChangeSetActionCounter(clientAPI);
    libCommon.setStateVariable(clientAPI, 'ObjectCreatedName', 'SubOperation');
    return clientAPI.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationCreateChangeset.action');
}
