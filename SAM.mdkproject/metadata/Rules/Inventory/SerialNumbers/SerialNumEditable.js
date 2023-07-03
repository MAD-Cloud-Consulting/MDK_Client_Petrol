import libCom from '../../Common/Library/CommonLibrary';

export default function SerialNumEditable(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT') {
        return true;
    }

    const quantity = libCom.getStateVariable(context, 'OpenQuantity');
    return !!quantity;
}
