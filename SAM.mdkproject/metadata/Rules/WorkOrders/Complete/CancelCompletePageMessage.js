export default function CancelCompletePageMessage(context) {
    return context.executeAction(
        {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': context.localizeText('canceling_completion_title'),
                'Message': context.localizeText('canceling_completion_message'),
                'OKCaption': context.localizeText('ok'),
                'CancelCaption': context.localizeText('cancel'),
                'OnOK': '/SAPAssetManager/Rules/WorkOrders/Complete/CancelCompletePage.js',
            },
        }
    );     
}
