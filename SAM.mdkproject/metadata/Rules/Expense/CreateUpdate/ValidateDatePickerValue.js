import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ValidateDatePickerValue(context, dateControl) {
    let currentDate = new Date();
    if (currentDate >= dateControl.getValue()) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('validation_start_time_cannot_be_in_the_future');
    CommonLibrary.executeInlineControlError(context, dateControl, message);
    return Promise.reject(false);
}
