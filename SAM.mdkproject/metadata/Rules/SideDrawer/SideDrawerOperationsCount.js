import count from '../Operations/OperationCount';
import WorkOrderOperationsListGetTypesQueryOption from '../WorkOrders/Operations/WorkOrderOperationsListGetTypesQueryOption';
import libPersona from '../Persona/PersonaLibrary';

export default function SideDrawerOperationsCount(context) {
    return WorkOrderOperationsListGetTypesQueryOption(context).then(typesQueryOption => {
        let queryOption = '';
        if (libPersona.isFieldServiceTechnician(context)) {
            queryOption = '$filter=' + typesQueryOption;
        }
        return count(context, queryOption).then(result => {
            return context.localizeText('operations_x', [result]);
        });
    });
}
