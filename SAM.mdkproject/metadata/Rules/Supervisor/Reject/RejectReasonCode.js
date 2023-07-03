import libCom from '../../Common/Library/CommonLibrary';

export default function RejectReasonCode(context) {
    let pickerValue = libCom.getTargetPathValue(context, '#Control:ReasonLstPkr/#Value');
    return libCom.getListPickerValue(pickerValue);
}
