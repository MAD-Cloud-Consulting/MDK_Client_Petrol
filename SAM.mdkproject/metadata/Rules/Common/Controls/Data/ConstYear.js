import libCommon from '../../Library/CommonLibrary';

export default function ConstYear(context) {
    let dateTime = libCommon.getControlValue(libCommon.getControlProxy(context, 'ManufactureDatePicker'));
    let date = new Date();
    
    if (dateTime) {
        date = new Date(dateTime);
    }

    return date.getFullYear().toString();
}
