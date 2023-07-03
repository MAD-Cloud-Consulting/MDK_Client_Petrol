import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditStatePickerValue(context) {

    let statePicker = libCom.getControlProxy(context, 'State');

    let value = statePicker.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }

    return value[0].ReturnValue;
}
