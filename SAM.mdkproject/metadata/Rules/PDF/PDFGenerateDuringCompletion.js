import IsServiceReportEnabled from './IsServiceReportEnabled';
import PDFGenerate from './PDFGenerate';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function PDFGenerateDuringCompletion(context, binding) {
    if (IsServiceReportEnabled(context)) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties':
            {
                'Title': '$(L, confirm_status_change)',
                'Message': '$(L,generate_service_report_warning)',
                'OKCaption': '$(L,ok)',
                'CancelCaption': '$(L,cancel)',
            },
        }).then(actionResult => {
            if (actionResult.data === true) {
                return PDFGenerate(context, binding);
            } else {
                CommonLibrary.removeBindingObject(context);
                CommonLibrary.removeStateVariable(context, 'contextMenuSwipePage');
                return Promise.resolve();
            }
        });
    } else {
        CommonLibrary.removeBindingObject(context);
        CommonLibrary.removeStateVariable(context, 'contextMenuSwipePage');
        return Promise.resolve();
    }
    
}
