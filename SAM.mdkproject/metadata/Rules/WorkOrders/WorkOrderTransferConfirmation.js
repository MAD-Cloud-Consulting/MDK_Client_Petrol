export default function WorkOrderTransferConfirmation(context) {
    context.executeAction(
        {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': context.localizeText('confirm_status_change'),
                'Message': context.localizeText('transfer_workorder'),
                'OKCaption': context.localizeText('ok'),
                'CancelCaption': context.localizeText('cancel'),
                'OnOK': '/SAPAssetManager/Rules/WorkOrders/WorkOrderSetTransferFields.js',
            },
        }
    );
}
