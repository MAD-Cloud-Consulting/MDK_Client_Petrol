
import libCom from '../../Common/Library/CommonLibrary';

export default function LAMMarkerUOM(context) {
    let pickerValue = libCom.getTargetPathValue(context, '#Control:MarkerUOMLstPkr/#Value');
    return libCom.getListPickerValue(pickerValue);

}
