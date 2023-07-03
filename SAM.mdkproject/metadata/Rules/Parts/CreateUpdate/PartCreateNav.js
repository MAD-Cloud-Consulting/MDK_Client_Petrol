import libCommon from '../../Common/Library/CommonLibrary';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import WorkCenterPlant from '../../Common/Controls/WorkCenterPlantControl';
import assnType from '../../Common/Library/AssignmentType';
import Logger from '../../Log/Logger';

export function executeChangeSetAction(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    //set the WoChangeSet flag to false
    libCommon.setOnWOChangesetFlag(context, false);

    //The next few lines are added to pre-populate the OrderId and/or the Operation No if the user is coming in from one of these objects
    try {
        let workOrderContext = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage');

        if (workOrderContext && workOrderContext.binding) {
            context.binding.OrderId = workOrderContext.binding.OrderId;
        }

    } catch (error) {
        //If WorkOrderDetails is not found then the user is not coming in from a workorder so just move on
        Logger.error(error);
    }

    try {
        let operationContext = context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage');

        if (operationContext && operationContext.binding) {
            context.binding.OperationNo = operationContext.binding.OperationNo;
            context.binding.OrderId = operationContext.binding.OrderId;
        }
    } catch (error) {
        //If OperationDetails is not found then the user is not coming in from an operation so just move on
        Logger.error(error);
    }

    context.setActionBinding(context.binding);
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        libCommon.setStateVariable(context, 'BOMPartAdd', true);
        return context.executeAction('/SAPAssetManager/Actions/Parts/BOM/BOMCreateChangeSet.action');
    }
    libCommon.setStateVariable(context, 'PartAdd', true);
    return context.executeAction('/SAPAssetManager/Actions/Parts/PartCreateChangeSet.action');
}

/**
 * Can't add part to local job.
 * @param {*} context 
 */
export default function PartCreateNav(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let storageLocation = libCommon.getUserDefaultStorageLocation();
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    
    if (libCommon.isDefined(storageLocation)) {
        context.binding.StorageLocation = storageLocation;
    } else {
        context.binding.StorageLocation = '';
    }
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        let assnTypeLevel = libCommon.getWorkOrderAssnTypeLevel(context);
        let workcenter = '';
        if (assnTypeLevel === 'Header') {
            workcenter = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'WorkCenterPlant');
        } else if (assnTypeLevel === 'Operation') {
            workcenter = assnType.getWorkOrderFieldDefault('WorkOrderOperation', 'WorkCenterPlant');
        } else if (assnTypeLevel === 'Operation') {
            workcenter = assnType.getWorkOrderFieldDefault('WorkOrderSubOperation', 'WorkCenterPlant');
        }
        if (libCommon.isDefined(workcenter)) {
            context.binding.Plant = workcenter;
        } else {
            context.binding.Plant = libCommon.getAppParam(context, 'WORKORDER', 'PlanningPlant');
        }
        return executeChangeSetAction(context);
    }
    
    return WorkCenterPlant.getOperationPageDefaultValue(context).then(function(plant) {
        if (!libCommon.isDefined(plant)) {
            context.binding.Plant = libCommon.getAppParam(context, 'WORKORDER', 'PlanningPlant');
        } else {
            context.binding.Plant = plant;
        }
        if (isLocal) {
            return executeChangeSetAction(context);
        } 
        return libWOStatus.isOrderComplete(context).then(status => {
            if (!status) {
                return executeChangeSetAction(context);
            }
            return '';
        });
    });
}
