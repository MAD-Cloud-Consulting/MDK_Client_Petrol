import receiveAll from '../IssueOrReceipt/ReceiptReceiveAllCreatePost';
import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function MaterialDocumentCreateUpdatePostWrapper(context) {    

    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let binding = context.binding.AssociatedMaterialDoc;
    if (type !== 'MaterialDocItem' && type !== 'MaterialDocument' && !binding) {
        return receiveAll(context); //This is not a material document being updated, so run the receive all routine
    } else if (type === 'MaterialDocument' || !binding) {
        binding = context.binding;
    }

    //Update this material document
    binding.TempHeader_DocumentDate = new ODataDate(libCom.getControlProxy(context,'DocumentDate').getValue()).toLocalDateString();
    binding.TempHeader_MaterialDocYear = new ODataDate(libCom.getControlProxy(context,'DocumentDate').getValue()).toDBDate(context).getFullYear().toString();
    binding.TempHeader_PostingDate = new ODataDate().toDBDateString(context);
    binding.TempHeader_HeaderText = libCom.getControlProxy(context,'HeaderTextSimple').getValue();
    binding.TempHeader_DeliveryNote = libCom.getControlProxy(context,'DeliveryNoteSimple').getValue();
    binding.TempHeader_MatDocReadLink = binding['@odata.readLink'];
    binding.TempHeader_Key = binding.MaterialDocNumber;
    context.setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentUpdate.action').then(() => {
        //Close screen and show success popup
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
    });

}
