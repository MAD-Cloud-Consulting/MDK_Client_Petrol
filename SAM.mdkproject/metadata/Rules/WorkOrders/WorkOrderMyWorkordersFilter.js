import libCom from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function WorkOrderMyWorkordersFilter(context) {
    const isFST = libPersona.isFieldServiceTechnician(context);

    let displayValue = isFST ? context.localizeText('my_serviceorders') : context.localizeText('my_workorders');

    return { name: 'OrderMobileStatus_Nav/CreateUserGUID', values: [{ReturnValue: libCom.getUserGuid(context), DisplayValue: displayValue}]};
}
