
import libCom from '../../Common/Library/CommonLibrary';

export default function LAMOffset1UOM(context) {
    let pickerValue = libCom.getTargetPathValue(context, '#Control:Offset1UOMLstPkr/#Value');
    return libCom.getListPickerValue(pickerValue);

}
