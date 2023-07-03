import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocumentFiscalYear(context) {
    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'PhysicalInventoryDocItem') {
            return context.binding.FiscalYear;
        }
    }
    return libCom.getStateVariable(context, 'PhysicalInventoryLocalFiscalYear');
}
