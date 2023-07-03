import libCommon from '../../Library/CommonLibrary';

export default function ConstMonth(context) {
    let dateTime = libCommon.getControlValue(libCommon.getControlProxy(context, 'ManufactureDatePicker'));
    let date = new Date();

    if (dateTime) {
        date = new Date(dateTime);
    }

    let dateTimeString = (date.getMonth() + 1).toString();
    return dateTimeString.length === 1 ? '0' + dateTimeString : dateTimeString;
}
