import QueryBuilder from '../../Common/Query/QueryBuilder';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function VariancePickerQueryOptions(context) {

    let workOrder = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:WorkOrderLstPkr/#Value'));
    let operation = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:OperationPkr/#Value'));
    let plant = '';
    if ((libVal.evalIsEmpty(workOrder)) && (libVal.evalIsEmpty(operation))) {
        workOrder = context.binding.OrderID;
        operation = context.binding.Operation;
    }
    if (!libVal.evalIsEmpty(context.binding.Plant)) {
        plant = context.binding.Plant;
    }
    let queryBuilder = new QueryBuilder();
    if ((!libVal.evalIsEmpty(workOrder)) && (!libVal.evalIsEmpty(operation))) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OrderId='${workOrder}',OperationNo='${operation}')`, [], '$expand=WOHeader&$select=MainWorkCenterPlant,MaintenancePlant,WOHeader/MainWorkCenterPlant,WOHeader/MaintenancePlant,WOHeader/PlanningPlant').then(function(data) {
            if (!libVal.evalIsEmpty(data.getItem(0).MainWorkCenterPlant)) {
                plant = data.getItem(0).MainWorkCenterPlant;
            } else if (!libVal.evalIsEmpty(data.getItem(0).MaintenancePlant)) {
                plant = data.getItem(0).MaintenancePlant;
            } else if (!libVal.evalIsEmpty(data.getItem(0).WOHeader.MainWorkCenterPlant)) {
                plant = data.getItem(0).WOHeader.MainWorkCenterPlant;
            } else if (!libVal.evalIsEmpty(data.getItem(0).WOHeader.MaintenancePlant)) {
                plant = data.getItem(0).WOHeader.MaintenancePlant;
            } else if (!libVal.evalIsEmpty(data.getItem(0).WOHeader.PlanningPlant)) {
                plant = data.getItem(0).WOHeader.PlanningPlant;
            }
            if (!libVal.evalIsEmpty(plant)) {
                queryBuilder.addFilter(`Plant eq '${plant}'`);	
            }
            queryBuilder.addExtra('orderby=VarianceReason asc');    
            return queryBuilder.build();
        });
    }
    
    if (!libVal.evalIsEmpty(plant)) {
        queryBuilder.addFilter(`Plant eq '${plant}'`);	
    }

    queryBuilder.addExtra('orderby=VarianceReason asc');    
    return queryBuilder.build();
}
