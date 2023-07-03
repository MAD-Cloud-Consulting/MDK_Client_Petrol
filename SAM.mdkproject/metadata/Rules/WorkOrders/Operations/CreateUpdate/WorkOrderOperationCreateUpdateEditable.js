import libCommon from '../../../Common/Library/CommonLibrary';
import assnType from '../../../Common/Library/AssignmentType';

// Define these as shared vars
let isLocal, onCreate;

function isEditable(controlName) {
    let controlDefs = assnType.getWorkOrderAssignmentDefaults();

    if (!onCreate && !isLocal) {
        return false;
    }
    return controlDefs.type === 'WorkOrderOperation' ? controlDefs[controlName].enabled : true;
}

export default function WorkOrderOperationCreateUpdateEditable(control) {
    let controlName = control.getName();
    let currentReadLink = libCommon.getTargetPathValue(control.getPageProxy(), '#Property:@odata.readLink');

    isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    onCreate = libCommon.IsOnCreate(control.getPageProxy());

    switch (controlName) {
        case 'WorkCenterLstPkr':
            return isEditable('MainWorkCenter');
        case 'WorkCenterPlantLstPkr':
            return isEditable('WorkCenterPlant');
        default:
            return true;
    }
}
