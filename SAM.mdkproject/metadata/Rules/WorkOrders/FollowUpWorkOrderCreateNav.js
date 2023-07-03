import libCommon from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWo } from './WorkOrderLibrary';
import lamCopy from '../WorkOrders/CreateUpdate/WorkOrderCreateLAMCopy';

export default function FollowUpWorkOrderCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(clientAPI, true);
    libCommon.setOnWOChangesetFlag(clientAPI, true);
    libCommon.resetChangeSetActionCounter(clientAPI);

    libCommon.removeStateVariable(clientAPI, 'WODefaultPlanningPlant');
    libCommon.removeStateVariable(clientAPI, 'WODefaultWorkCenterPlant');
    libCommon.removeStateVariable(clientAPI, 'WODefaultMainWorkCenter');

    //set the follow up page and flag
    libWo.setFollowUpFlagPage(clientAPI);
    libWo.setFollowUpFlag(clientAPI, true);

    libCommon.setStateVariable(clientAPI, 'LocalId', ''); //Reset before starting create
    return libCommon.navigateOnRead(clientAPI, '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateChangeset.action').then(() => {
        return lamCopy(clientAPI);
    });
}
