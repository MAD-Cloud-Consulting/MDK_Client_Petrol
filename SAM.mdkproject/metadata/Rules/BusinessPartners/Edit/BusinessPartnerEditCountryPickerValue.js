import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function BusinessPartnerEditCountryPickerValue(context) {

    let countryPicker = libCom.getControlProxy(context, 'Country');
    let value = countryPicker.getValue();
    if (libVal.evalIsEmpty(value)) {
        return '';
    }
    return value[0].ReturnValue;
}
