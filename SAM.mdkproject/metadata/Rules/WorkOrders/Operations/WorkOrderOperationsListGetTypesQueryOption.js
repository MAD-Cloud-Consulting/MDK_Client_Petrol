import libPersona from '../../Persona/PersonaLibrary';
import WorkOrderOperationsFSMQueryOption from './WorkOrderOperationsFSMQueryOption';

export default function WorkOrderOperationsListGetTypesQueryOption(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return WorkOrderOperationsFSMQueryOption(context);
    } else {
        return Promise.resolve();
    }
}
