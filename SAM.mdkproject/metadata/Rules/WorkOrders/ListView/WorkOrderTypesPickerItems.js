import libPersona from '../../Persona/PersonaLibrary';
import getWorkOrdersFSMQueryOption from './WorkOrdersFSMQueryOption';

export default function WorkOrderTypesPickerItems(context) {
    let orderTypesPromise;
    let isFST = libPersona.isFieldServiceTechnician(context);

    if (isFST) {
        orderTypesPromise = getWorkOrdersFSMQueryOption(context);
    } else {
        orderTypesPromise = Promise.resolve();
    }
    
    return orderTypesPromise.then(types => {
        let queryBuilder = context.dataQueryBuilder();
        if (isFST) {
            queryBuilder.filter(types);
        }

        queryBuilder.orderBy('OrderType');
        return queryBuilder;
    });
}
