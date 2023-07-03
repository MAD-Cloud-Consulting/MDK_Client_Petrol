
import libCom from '../../Common/Library/CommonLibrary';

export default function LAMCreateUOM(context) {
    let pickerValue = libCom.getTargetPathValue(context, '#Control:UOMLstPkr/#Value');
    return libCom.getListPickerValue(pickerValue);

}
