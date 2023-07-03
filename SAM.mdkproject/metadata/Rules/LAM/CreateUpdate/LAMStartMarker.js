
import libCom from '../../Common/Library/CommonLibrary';

export default function LAMStartMarker(context) {
    let pickerValue = libCom.getTargetPathValue(context, '#Control:StartMarkerLstPkr/#Value');
    return libCom.getListPickerValue(pickerValue);

}
