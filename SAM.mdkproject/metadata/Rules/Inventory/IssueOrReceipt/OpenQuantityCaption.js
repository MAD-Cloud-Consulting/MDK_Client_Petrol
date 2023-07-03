import libCom from '../../Common/Library/CommonLibrary';

export default function OpenQuantityCaption(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const move = libCom.getStateVariable(context, 'IMMovementType');

    if (objectType === 'PO' || objectType === 'STO' || objectType === 'RES' || objectType === 'REV' || (objectType === 'PRD' && move === 'I')) {
        return context.localizeText('open_quantity');
    } else if (objectType === 'ADHOC' || objectType === 'TRF') {
        return context.localizeText('po_item_detail_confirmed');
    }

    return context.localizeText('open_quantity');
}
