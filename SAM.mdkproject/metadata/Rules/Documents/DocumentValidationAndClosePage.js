import DocumentValidation from './DocumentValidation';

export default function DocumentValidationAndClosePage(context, descriptionCtrl='', attachmentCtrl='') {
    return DocumentValidation(context, descriptionCtrl, attachmentCtrl).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    });
}
