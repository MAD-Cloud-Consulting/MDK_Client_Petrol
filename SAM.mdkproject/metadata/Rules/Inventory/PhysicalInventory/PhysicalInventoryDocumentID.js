import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocumentID(context) {
    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'PhysicalInventoryDocItem') {
            return context.binding.PhysInvDoc;
        }
    }
    return libCom.getStateVariable(context, 'PhysicalInventoryLocalId');
}
