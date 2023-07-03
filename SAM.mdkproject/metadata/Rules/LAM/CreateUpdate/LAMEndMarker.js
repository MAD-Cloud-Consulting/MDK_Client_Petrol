
import libCom from '../../Common/Library/CommonLibrary';

export default function LAMEndMarker(context) {
    let pickerValue = libCom.getTargetPathValue(context, '#Control:EndMarkerLstPkr/#Value');
    return libCom.getListPickerValue(pickerValue);

}
