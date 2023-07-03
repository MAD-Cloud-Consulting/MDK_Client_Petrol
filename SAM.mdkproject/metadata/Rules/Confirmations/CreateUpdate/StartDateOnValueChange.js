/**
* Adjust the Posting Date value based on the start date change
* @param {IClientAPI} context
*/
import getPostingOverride from '../ConfirmationsGetPostingDateOverride';
import libCom from '../../Common/Library/CommonLibrary';

export default function StartDateOnValueChange(context) {
    let pageProxy = context.getPageProxy();
    const startDatePickerControl = libCom.getControlProxy(pageProxy, 'StartDatePicker');
    const postingDateControl = libCom.getControlProxy(pageProxy, 'PostingDatePicker');
    const startDateTime = startDatePickerControl.getValue();

    const nowDateTime = new Date();

    if (startDateTime > nowDateTime) {
        if (getPostingOverride(context)) {
            libCom.executeInlineControlError(context, postingDateControl, context.localizeText('labor_time_err_start_datetime'));
        }
        return libCom.executeInlineControlError(context, startDatePickerControl, context.localizeText('labor_time_err_start_datetime'));
    }

    startDatePickerControl.clearValidationOnValueChange();

    if (getPostingOverride(context)) {
        postingDateControl.clearValidationOnValueChange();
        postingDateControl.setValue(startDateTime);
    }
}
