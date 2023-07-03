import libCom from '../../Common/Library/CommonLibrary';
import updateHeaderCountItems from '../InboundOrOutbound/UpdateHeaderCountItems';

export default function ReceiptReceiveAllWrapper(context) {

    var messageText = context.localizeText('receive_all_warning');
    var captionText = context.localizeText('warning');

    //Prompt user with receive all warning dialog
    return libCom.showWarningDialog(context, messageText, captionText).then(result => {
        if (result === true) {
            //Figure out binding properties
            libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
            libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
            libCom.removeStateVariable(context, 'ReceiveAllItemId');

            context.binding.TempHeader_DocumentDate = '';
            context.binding.TempHeader_HeaderText = '';
            context.binding.TempHeader_DeliveryNote = '';

            libCom.removeStateVariable(context, 'CancelActionFlag');
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ReceiptReceiveAllCreateChangeset.action').then(() => {
                if (!libCom.getStateVariable(context, 'CancelActionFlag')) {
                    return updateHeaderCountItems(context).then((status) => {
                        try {
                            if (status) { //Refresh the PO or STO details page
                                let pageName = libCom.getPageName(context);
                                context.binding.DocumentStatus = status;                        
                                context.getPageProxy().getControl('SectionedTable').getSection('SectionObjectHeader').redraw(true);
                                libCom.enableToolBar(context, pageName, 'IssuePartTbI', false);
                            }
                        } catch (err) {
                            //Do nothing
                        } finally {
                            libCom.removeStateVariable(context, 'CancelActionFlag');
                        }
                        return true;
                    });
                }
                return true;
            });
        }
        return false;
    }).catch(function() {
        return false; //User terminated out of warning dialog
    });
}
