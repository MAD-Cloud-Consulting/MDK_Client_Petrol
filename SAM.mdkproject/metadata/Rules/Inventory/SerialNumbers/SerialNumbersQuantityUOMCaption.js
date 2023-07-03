import libCom from '../../Common/Library/CommonLibrary';

export default function SerialNumbersQuantityUOMCaption(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (objectType === 'ADHOC' || objectType === 'TRF') {
        return context.localizeText('po_item_detail_confirmed');
    }

    return context.localizeText('open_quantity_uom');
}
