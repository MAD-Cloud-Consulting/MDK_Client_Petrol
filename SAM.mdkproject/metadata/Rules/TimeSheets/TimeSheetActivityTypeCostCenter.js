import QueryBuilder from '../Common/Query/QueryBuilder';
import libVal from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function TimeSheetActivityTypeCostCenter(context) {
    let queryBuilder = new QueryBuilder();
    let workOrder = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:RecOrderLstPkr/#Value'));
    if (workOrder) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders('+ '\'' + workOrder +'\''+')', [], '$select=CostCenter,ControllingArea').then(function(data) {
            if (data.getItem(0)) {
                if (!libVal.evalIsEmpty(data.getItem(0).CostCenter)) {
                    queryBuilder.addFilter(`CostCenter eq '${data.getItem(0).CostCenter}'`);
                }
                if (!libVal.evalIsEmpty(data.getItem(0).ControllingArea)) {
                    queryBuilder.addFilter(`ControllingArea eq '${data.getItem(0).ControllingArea}'`);
                }
            }
            queryBuilder.addExtra('orderby=ActivityType asc');  
            return queryBuilder.build();
        });
    } else {
        queryBuilder.addExtra('orderby=ActivityType asc');
        return queryBuilder.build();
    }
}
