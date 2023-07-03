import libCommon from '../../Common/Library/CommonLibrary';
import { PrivateMethodLibrary as libPrivate } from './WorkOrderOperationLibrary';

export default function WorkOrderOperationIsEquipFuncLocAllowed(pageProxy) {
    let onWOChangeSet = libCommon.isOnWOChangeset(pageProxy);
    let parentWorkOrderPromise = libPrivate._getParentWorkOrder(pageProxy, onWOChangeSet);
    ///We check if FLOC and Equipmemt can be added to an operation by checking the ObjectListAssignment property on order type 
    return parentWorkOrderPromise.then(parentWorkOrder => {
        if (parentWorkOrder) {
            return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${parentWorkOrder.OrderType}' and PlanningPlant eq '${parentWorkOrder.PlanningPlant}'`).then(function(myOrderTypes) {
                if (myOrderTypes && myOrderTypes.length > 0) {
                    let record = myOrderTypes.getItem(0);
                    return record.ObjectListAssignment === '';
                }
                return false;
            });
        }
        return false;
    });
}
