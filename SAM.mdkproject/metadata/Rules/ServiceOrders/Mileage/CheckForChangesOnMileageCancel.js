import CheckForChangesBeforeClose from '../../Common/CheckForChangesBeforeClose';
import common from '../../Common/Library/CommonLibrary';
import libOprMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import PDFGenerateDuringCompletion from '../../PDF/PDFGenerateDuringCompletion';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesOnMileageCancel(context) { 
    return CheckForChangesBeforeClose(context).then(() => {
        return SupervisorLibrary.checkReviewRequired(context, context.binding).then(review => {
            let createFinalConfirmationPromise = Promise.resolve();
            if (!common.getStateVariable(context, 'IsFinalConfirmation', common.getPageName(context)) && !review) {
                createFinalConfirmationPromise = libOprMobile.createBlankConfirmation(context);
            }
            return createFinalConfirmationPromise.then(() => {
                if (common.getStateVariable(context, 'IsPDFGenerate')) {
                    return PDFGenerateDuringCompletion(context).then(() => {
                        common.setStateVariable(context, 'IsPDFGenerate', false);
                        common.setStateVariable(context, 'IsWOCompletion', false);
                        return Promise.resolve();
                    });
                }
                return Promise.resolve();
            });
        });
    });
}
