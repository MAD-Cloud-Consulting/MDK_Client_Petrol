export default function GetDeliveryNote(context) {

    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem') {
            return context.binding.AssociatedMaterialDoc.RefDocumentNumber;
        } else if (type === 'MaterialDocument') {
            return context.binding.RefDocumentNumber;
        }

        if (context.binding.TempHeader_DeliveryNote) {
            return context.binding.TempHeader_DeliveryNote;
        }
    }
    return ''; //If not editing an existing local receipt item, then default to empty
}
