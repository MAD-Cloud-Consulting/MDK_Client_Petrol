import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocumentItemID(context) {
    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'PhysicalInventoryDocItem') {
            return context.binding.Item;
        }
    }
    return libCom.getStateVariable(context, 'PhysicalInventoryItemId');
}
