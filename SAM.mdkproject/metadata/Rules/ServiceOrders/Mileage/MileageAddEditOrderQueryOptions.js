import libVal from '../../Common/Library/ValidationLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';

export default function MileageAddEditOrderQueryOptions(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
            if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                return '$filter=' + fsmQueryOptions;
            }
            
            return '';
        });
    } else {
        return '';
    }
}
