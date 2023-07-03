import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import WorkOrderOperationsFSMQueryOption from './WorkOrderOperationsFSMQueryOption';
import WorkOrderOperationsListViewQueryOption from './WorkOrderOperationsListViewQueryOption';

export default function WorkOrderOperationsListViewQueryOptionWrapper(context) {
    if (PersonaLibrary.isFieldServiceTechnician(context)) {
        return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
            let queryOptions = WorkOrderOperationsListViewQueryOption(context);
            if (typeof queryOptions === 'string') {
                queryOptions = context.dataQueryBuilder(queryOptions);
            }
            if (!ValidationLibrary.evalIsEmpty(fsmQueryOptions)) {
                queryOptions.filter(fsmQueryOptions);
            }
            return queryOptions;
        });
    } else {
        return WorkOrderOperationsListViewQueryOption(context);
    }
}
