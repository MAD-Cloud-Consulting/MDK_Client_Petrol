import libCom from '../../../Common/Library/CommonLibrary';

export default function GetStartDateTime(context) {
    let date = libCom.getControlProxy(context, 'StartDatePicker').getValue();
    let start = libCom.getControlProxy(context,'StartTimePicker').getValue();

    start.setFullYear(date.getFullYear());
    start.setMonth(date.getMonth());
    start.setDate(date.getDate());

    return start;
}
