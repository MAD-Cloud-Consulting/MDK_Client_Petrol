import libVal from '../../../Common/Library/ValidationLibrary';
import libPersona from '../../../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../../ListView/WorkOrdersFSMQueryOption';

export default function WorkOrderOperationCreateUpdateOrderQueryOption(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return WorkOrdersFSMQueryOption(context).then(fsmTypes => {
            if (!libVal.evalIsEmpty(fsmTypes)) {
                return `$filter=${fsmTypes}&$orderby=OrderId asc`;
            }

            return '$orderby=OrderId asc';
        });
    } else {
        return '$orderby=OrderId asc';
    }
}
