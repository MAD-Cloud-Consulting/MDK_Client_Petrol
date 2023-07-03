
export default function ResetCompleteScreenFieldsMessage(context) {
    return context.executeAction(
        {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': context.localizeText('reset_data_title'),
                'Message': context.localizeText('reset_data_message'),
                'OKCaption': context.localizeText('reset'),
                'CancelCaption': context.localizeText('cancel'),
                'OnOK': '/SAPAssetManager/Rules/WorkOrders/Complete/ResetCompleteScreenFields.js',
            },
        }
    );     
}
