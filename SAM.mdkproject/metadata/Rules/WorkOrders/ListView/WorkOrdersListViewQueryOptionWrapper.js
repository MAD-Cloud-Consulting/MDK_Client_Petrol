import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from './WorkOrdersFSMQueryOption';
import WorkOrdersListViewQueryOption from './WorkOrdersListViewQueryOption';

export default function WorkOrdersListViewQueryOptionWrapper(clientAPI) {
    if (PersonaLibrary.isFieldServiceTechnician(clientAPI)) {
        return WorkOrdersFSMQueryOption(clientAPI).then(fsmQueryOptions => {
            let queryOptions = WorkOrdersListViewQueryOption(clientAPI);
            if (!ValidationLibrary.evalIsEmpty(fsmQueryOptions)) {
                queryOptions.filter(fsmQueryOptions);
            }
            return queryOptions;
        });
    } else {
        return WorkOrdersListViewQueryOption(clientAPI);
    }
}
