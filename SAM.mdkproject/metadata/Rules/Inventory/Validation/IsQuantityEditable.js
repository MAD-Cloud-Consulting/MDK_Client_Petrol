import showAuto from './ShowAutoSerialNumberField';
import libCom from '../../Common/Library/CommonLibrary';
import ShowSerialNumberField from './ShowSerialNumberField';

export default function IsQuantityEditable(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const moveType = libCom.getStateVariable(context, 'IMMovementType');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (objectType === 'REV') {
        return false;
    }

    if (context.binding) {
        if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return false;
        }
    }

    if (moveType === 'R' && objectType === 'PO') {
        return showAuto(context).then(show => {
            if (show) {
                return !!context.binding.AutoGenerateSerialNumbers;
            } 

            return true;
        });
    } 

    return ShowSerialNumberField(context).then(show => !show);
}
