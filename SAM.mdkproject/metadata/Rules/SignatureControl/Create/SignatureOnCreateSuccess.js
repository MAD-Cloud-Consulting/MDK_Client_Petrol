/**
* Do some housekeeping before actually creating the links
* @param {IClientAPI} context
*/
import signatureCreateBDKLink from '../Save/SignatureCreateBDSLink';
import SignatureRunConfirmationLAM from '../Create/SignatureRunConfirmationLAM';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import DocumentLibrary from '../../Documents/DocumentLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';

export default function SignatureOnCreateSuccess(context) {
    let signatureActionResult = context.getActionResult('SignatureResult');
    let clientData = context.getPageProxy().getClientData();
    clientData.isWOSigned = true;
    
    return signatureCreateBDKLink(context).then(() => {
        if (IsCompleteAction(context)) {
            if (WorkOrderCompletionLibrary.getStepValue(context, 'signature')) {
                WorkOrderCompletionLibrary.resetStep(context, 
                    WorkOrderCompletionLibrary.getStepDataLink(context, 'signature'));
            }

            if (clientData.mediaReadLinks && clientData.mediaReadLinks.length) {
                WorkOrderCompletionLibrary.updateStepState(context, 'signature', {
                    value: context.localizeText('done'),
                    link: clientData.mediaReadLinks[0],
                });
            }
           
            return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
        }

        return SignatureRunConfirmationLAM(context).then(() => {
            if (context.getPageProxy().currentPage.id === 'PDFControl') { //we're on the service report screen
                return reloadPDFControl(signatureActionResult, context);
            } else {
                return Promise.resolve();
            }
        }).finally(() => {
            CommonLibrary.clearStateVariable(context, 'FinalConfirmationIsCompletingWorkOrder');
        });
    });
}

/* 
Reload the PDF report and disable the customer signature toolbar
*/
function reloadPDFControl(signatureActionResult, context) {
    let signatureReadLink;

    if (signatureActionResult.data.length > 0) {
        signatureReadLink = signatureActionResult.data[0]; //get the readlink of the signature that was just created
    }

    if (signatureReadLink) { 
        return context.read('/SAPAssetManager/Services/AssetManager.service', signatureReadLink, [], '').then(documentArray => {
            if (documentArray.length > 0) {
                let documentObject = documentArray.getItem(0);
                let base64String = DocumentLibrary.getBase64String(context, documentObject);
                
                //reload the PDF with the new signature
                let pdfPage = context.evaluateTargetPathForAPI('#Page:PDFControl');
                let serviceReportData = CommonLibrary.getStateVariable(context, 'ServiceReportData');
                serviceReportData.Order.CustomerSignature = base64String;
                CommonLibrary.setStateVariable(context, 'ServiceReportData', serviceReportData);

                let pdfExtensionControl = pdfPage.getControls()[0];
                pdfExtensionControl._control.update();

                //disable toolbar if a customer signature was added
                let customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentCustomerSignaturePrefix.global').getValue();
                if (documentObject.FileName.startsWith(customerSignaturePrefix)) {
                    return CommonLibrary.enableToolBar(context, 'PDFControl', 'CustomerSignatureButton', false);
                }
            }
            return Promise.resolve();
        });
    } else {
        return Promise.resolve();
    }       
}
