import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrderOperationsListGetTypesQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsListGetTypesQueryOption';

/**
* Getting count of all current day Service Operations
* @param {IClientAPI} context
*/
export default function ServiceOperationsDateFilter(context) {
    return WorkOrderOperationsListGetTypesQueryOption(context).then(typesQueryOptions => {
        const defaultDate = libWO.getActualDate(context);
        return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
            let queryOption = (libPersona.isFieldServiceTechnician(context) && !libVal.evalIsEmpty(typesQueryOptions)) ? `$filter=${dateFilter} and ${typesQueryOptions}` : `$filter=${dateFilter}`;
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', queryOption);
        });
        
    });
}
