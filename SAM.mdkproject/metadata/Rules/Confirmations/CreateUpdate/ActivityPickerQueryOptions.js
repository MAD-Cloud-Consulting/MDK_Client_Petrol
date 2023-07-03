import QueryBuilder from '../../Common/Query/QueryBuilder';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function ActivityPickerQueryOptions(context) {
    let queryBuilder = new QueryBuilder();
    let workOrder = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:WorkOrderLstPkr/#Value'));
    let operation = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:OperationPkr/#Value'));
    let subOperation = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:SubOperationPkr/#Value'));
    const mileageActivityType = libCom.getMileageActivityType(context);
    const expenseActivityType = libCom.getExpenseActivityType(context);

    if (mileageActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${mileageActivityType}'`);
    }

    if (expenseActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${expenseActivityType}'`);
    }

    queryBuilder.addExtra('orderby=ActivityType asc'); 

    if (libVal.evalIsEmpty(workOrder) && libVal.evalIsEmpty(operation)) {
        workOrder = context.binding.OrderID;
        operation = context.binding.Operation;
        subOperation = context.binding.SubOperation;
    }

    if (!libVal.evalIsEmpty(workOrder) && !libVal.evalIsEmpty(operation)) {

        if (!libVal.evalIsEmpty(subOperation)) { //If Suboperation is selected then we need to use the Work Center of the SubOperation to filter the ActivityTypes
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderSubOperations(OrderId='${workOrder}',OperationNo='${operation}',SubOperationNo='${subOperation}')`, [], '$expand=WorkOrderOperation,WorkOrderOperation/WOHeader&$select=ActivityType,WorkCenterInternalId,WorkOrderOperation/WorkCenterInternalId,WorkOrderOperation/WOHeader/CostCenter,WorkOrderOperation/WOHeader/ControllingArea').then(function(data) {
                if (data.getItem(0)) {
                    context.getClientData().DefaultActivityType = data.getItem(0).ActivityType;
                    let workCenter = '';
                    if (!libVal.evalIsEmpty(data.getItem(0).WorkCenterInternalId)) {
                        workCenter = data.getItem(0).WorkCenterInternalId;
                    } else if (!libVal.evalIsEmpty(data.getItem(0).WorkOrderOperation.WorkCenterInternalId)) {
                        workCenter = data.getItem(0).WorkOrderOperation.WorkCenterInternalId;
                    } else if (!libVal.evalIsEmpty(data.getItem(0).WorkOrderOperation.WOHeader.CostCenter) && !libVal.evalIsEmpty(data.getItem(0).WorkOrderOperation.WOHeader.ControllingArea)) {
                        queryBuilder.addFilter(`CostCenter eq '${data.getItem(0).WorkOrderOperation.WOHeader.CostCenter}'`);
                        queryBuilder.addFilter(`ControllingArea eq '${data.getItem(0).WorkOrderOperation.WOHeader.ControllingArea}'`);
                    }
    
                    if (!libVal.evalIsEmpty(workCenter)) {
                        return context.read('/SAPAssetManager/Services/AssetManager.service', `WorkCenters(WorkCenterId='${workCenter}',ObjectType='A')`, [], '$select=CostCenter,ControllingArea').then(function(result) {
                            if (!libVal.evalIsEmpty(result)) {
                                if (!libVal.evalIsEmpty(result.getItem(0).CostCenter)) {
                                    queryBuilder.addFilter(`CostCenter eq '${result.getItem(0).CostCenter}'`);
                                }
                                if (!libVal.evalIsEmpty(result.getItem(0).ControllingArea)) {
                                    queryBuilder.addFilter(`ControllingArea eq '${result.getItem(0).ControllingArea}'`);
                                }
                            } 
                            return queryBuilder.build();
                        });
                    }
                }
                return queryBuilder.build();
            });
        } else {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OrderId='${workOrder}',OperationNo='${operation}')`, [], '$expand=WOHeader&$select=ActivityType,WorkCenterInternalId,WOHeader/WorkCenterInternalId,WOHeader/MainWorkCenterPlant,WOHeader/MaintenancePlant,WOHeader/PlanningPlant,WOHeader/CostCenter,WOHeader/ControllingArea').then(function(data) {
                if (data.getItem(0)) {
                    context.getClientData().DefaultActivityType = data.getItem(0).ActivityType;
                    let workCenter = '';
                    if (!libVal.evalIsEmpty(data.getItem(0).WorkCenterInternalId)) {
                        workCenter = data.getItem(0).WorkCenterInternalId;
                    } else if (!libVal.evalIsEmpty(data.getItem(0).WOHeader.WorkCenterInternalId)) {
                        workCenter = data.getItem(0).WOHeader.WorkCenterInternalId;
                    } else if (!libVal.evalIsEmpty(data.getItem(0).WOHeader.CostCenter) && !libVal.evalIsEmpty(data.getItem(0).WOHeader.ControllingArea)) {
                        queryBuilder.addFilter(`CostCenter eq '${data.getItem(0).WOHeader.CostCenter}'`);
                        queryBuilder.addFilter(`ControllingArea eq '${data.getItem(0).WOHeader.ControllingArea}'`);
                    }
    
                    if (!libVal.evalIsEmpty(workCenter)) {
                        return context.read('/SAPAssetManager/Services/AssetManager.service', `WorkCenters(WorkCenterId='${workCenter}',ObjectType='A')`, [], '$select=CostCenter,ControllingArea').then(function(result) {
                            if (!libVal.evalIsEmpty(result)) {
                                if (!libVal.evalIsEmpty(result.getItem(0).CostCenter)) {
                                    queryBuilder.addFilter(`CostCenter eq '${result.getItem(0).CostCenter}'`);
                                }
                                if (!libVal.evalIsEmpty(result.getItem(0).ControllingArea)) {
                                    queryBuilder.addFilter(`ControllingArea eq '${result.getItem(0).ControllingArea}'`);
                                }
                            }  
                            return queryBuilder.build();
                        });
                    }
                }   
                return queryBuilder.build();
            });
        }
    } else {    
        return queryBuilder.build();
    }
}
