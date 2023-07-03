import libPersona from '../Persona/PersonaLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import WorkOrderOperationsFSMQueryOption from '../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';

/**
* Returning actual query options depending on current date
* @param {IClientAPI} context
*/
export default function ServiceOperationTodayList(context) {
    const defaultDate = libWO.getActualDate(context);
    return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
        if (libPersona.isFieldServiceTechnician(context)) {
            return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
                let queryOption = `$expand=OperationMobileStatus_Nav,WOHeader&$filter=${dateFilter}`;
                if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                    queryOption += ' and ' + fsmQueryOptions;
                }
                
                return queryOption + '&$top=2';
            });
        } else {
            return `$expand=OperationMobileStatus_Nav,WOHeader&$filter=${dateFilter}&$top=2`;
        }
    });

   
}
